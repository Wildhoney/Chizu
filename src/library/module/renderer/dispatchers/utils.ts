import { Lifecycle, ModuleDefinition, Task } from "../../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { Context, GeneratorFn, UseDispatchHandlerProps } from "./types.ts";

/**
 * @param props {UseDispatchHandlerProps<M>}
 * @returns {(name: Head<M["Actions"]>, ƒ: GeneratorFn<M>) => (payload: Tail<M["Actions"]>) => Promise<void>}
 */
export function useDispatcher<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
) {
  return (_name: Head<M["Actions"]>, ƒ: GeneratorFn<M>) => {
    return async (
      task: Task = Promise.withResolvers<void>(),
      payload: Tail<M["Actions"]>,
    ): Promise<void> => {
      if (typeof ƒ !== "function") return;

      props.queue.current.add(task.promise);
      const abortController = new AbortController();

      try {
        const context: Context<M> = {
          app: props.app,
          task,
          ƒ,
          abortController,
          payload,
          props,
        };
        const ios = inspectAction<M>(props, context);

        if (props.queue.current.size > 1) {
          await Promise.allSettled([...props.queue.current].slice(0, -1));
        }

        if (ios.size > 0) await flushIos<M>(context, ios);
        props.queue.current.delete(task.promise);
        task.resolve();
      } catch (error) {
        console.log("hmm, error", error);
        props.app.appEmitter.emit(Lifecycle.Error, task, [error]);
      }
    };
  };
}

/**
 * @param props {UseDispatchHandlerProps<M>}
 * @param context {Context<M>}
 * @returns {Set<unknown>}
 */
function inspectAction<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
  context: Context<M>,
) {
  const ios = new Set();
  const discovery = context.ƒ(...context.payload);

  while (true) {
    try {
      const result = discovery.next();

      if (result.done && typeof result.value === "function") {
        const model = result.value(context.props.model.current);
        if (model) context.props.model.current = model;
        context.props.update.rerender();

        return ios;
      }

      if (typeof result.value === "function")
        ios.add(
          result
            .value({ signal: context.abortController.signal })
            .catch((error: unknown) => () => {
              props.app.appEmitter.emit(Lifecycle.Error, context.task, [error]);
            }),
        );
    } catch (error) {
      props.app.appEmitter.emit(Lifecycle.Error, context.task, [error]);
      return new Set();
    }
  }
}

/**
 * @param context {Context<M>}
 * @param ios {Set<unknown>}
 * @returns {Promise<void>}
 */
async function flushIos<M extends ModuleDefinition>(
  context: Context<M>,
  ios: Set<unknown>,
) {
  (await Promise.allSettled(ios)).forEach((io) => {
    if (io.status === "rejected") {
      return;
    }

    const model =
      typeof io.value === "function"
        ? io.value(context.props.model.current)
        : io;

    if (model) context.props.model.current = model;
    context.props.update.rerender();
  });
}

/**
 * Check if the name is a broadcast event.
 *
 * @param name {string}
 * @returns {boolean}
 */
export function isBroadcast(name: string): boolean {
  return name.startsWith("distributed");
}

/**
 * Custom error class for IO errors.
 *
 * @class EventError
 * @extends Error
 * @param type {string} - The type of the error.
 * @param message {string} - The error message.
 */
export class EventError extends Error {
  #type: string;
  #message: null | string;

  constructor(type: string, message: null | string = null) {
    super(String(message));
    this.#type = type;
    this.#message = message;
  }

  get type(): string {
    return this.#type;
  }

  get message(): string {
    return this.#message || "";
  }
}
