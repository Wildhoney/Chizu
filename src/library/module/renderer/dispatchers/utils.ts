import { EventError, ModuleDefinition } from "../../../types/index.ts";
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
    return async (payload: Tail<M["Actions"]>): Promise<void> => {
      if (typeof ƒ !== "function") return;

      const process = Symbol(`process/${Math.random()}`);
      const task = Promise.withResolvers<void>();
      props.queue.current.add(task.promise);
      const abortController = new AbortController();

      try {
        const context: Context<M> = {
          task,
          process,
          ƒ,
          abortController,
          payload,
          props,
        };
        const ios = inspectAction<M>(props, context);

        if (props.queue.current.size > 1) {
          await Promise.allSettled([...props.queue.current].slice(0, -1));
        }

        if (ios.size > 0) await flushIos<M>(props, context, ios);
      } catch (error) {
        console.error("Error in dispatcher", error);
      } finally {
        props.queue.current.delete(task.promise);
        task.resolve();
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

      if (result.done && result.value) {
        props.process.current = context.process;
        const model = result.value(context.props.model.current);
        if (model) context.props.model.current = model;
        props.process.current = null;
        context.props.update.rerender();

        return ios;
      }

      props.process.current = context.process;
      ios.add(
        result
          .value({ signal: context.abortController.signal })
          .catch((error: unknown) => {
            return (model: M["Model"]) => {
              if (getError(error)) model.errors.push(getError(error));
            };
          }),
      );
      props.process.current = null;
    } catch (error) {
      if (getError(error)) props.model.current.errors.push(getError(error));
      context.props.update.rerender();
      return new Set();
    }
  }
}

/**
 * @param props {UseDispatchHandlerProps<M>}
 * @param context {Context<M>}
 * @param ios {Set<unknown>}
 * @returns {Promise<void>}
 */
async function flushIos<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
  context: Context<M>,
  ios: Set<unknown>,
) {
  (await Promise.allSettled(ios)).forEach((io) => {
    props.process.current = context.process;

    const model =
      io.status === "fulfilled" && typeof io.value === "function"
        ? io.value(context.props.model.current)
        : io;

    if (model) context.props.model.current = model;
    props.process.current = null;
    props.mutations.current = new Set(
      [...props.mutations.current].filter(
        (mutation) => mutation.process !== context.process,
      ),
    );
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
 * Check if the error is an instance of Error.
 *
 * @param error {unknown}
 * @returns {Error}
 */
export function getError(error: unknown): null | EventError {
  if (error instanceof IoError) return error.into();
  if (error instanceof Error) return { type: null, message: error.message };
  return null;
}

/**
 * Custom error class for IO errors.
 *
 * @class IoError
 * @extends Error
 * @param type {string} - The type of the error.
 * @param message {string} - The error message.
 */
export class IoError extends Error {
  #type: string;
  #message: null | string;

  constructor(type: string, message: null | string = null) {
    super(String(message));
    this.#type = type;
    this.#message = message;
  }

  into(): EventError {
    return {
      type: this.#type,
      message: this.#message,
    };
  }
}
