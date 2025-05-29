import { useBroadcast } from "../../../broadcast/index.tsx";
import { ActionEvent } from "../../../controller/types.ts";
import { Lifecycle, ModuleDefinition, Task } from "../../../types/index.ts";
import { cleanup } from "../../../utils/produce/index.ts";
import { Head, Tail } from "../types.ts";
import { UseDispatchHandlerProps } from "./types.ts";

/**
 * @param props {UseDispatchHandlerProps<M>}
 * @returns {(name: Head<M["Actions"]>, ƒ: GeneratorFn<M>) => (payload: Tail<M["Actions"]>) => Promise<void>}
 */
export function useDispatcher<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
) {
  const broadcast = useBroadcast();

  return (_name: Head<M["Actions"]>, ƒ: ActionEvent<M>) => {
    return async (
      task: Task = Promise.withResolvers<void>(),
      payload: Tail<M["Actions"]>,
    ): Promise<void> => {
      if (typeof ƒ !== "function") return;

      // const abort = new AbortController();
      const process = Symbol("process");
      const action = ƒ(...payload);

      try {
        if (action == null) return;

        if (typeof action === "function") {
          const models = action(props.model.current, process);
          props.model.current = cleanup(models, process);
          props.update.rerender();
          task.resolve();

          return;
        }

        while (true) {
          const { value, done } = await action.next();

          if (done) {
            const models = value(props.model.current, process);
            props.model.current = cleanup(models, process);
            props.update.rerender();
            break;
          }

          const produce = value;
          props.model.current = produce(props.model.current, process);
          props.update.rerender();
          task.resolve();
        }
      } catch (error) {
        cleanup(props.model.current, process);
        props.update.rerender();
        broadcast.appEmitter.emit(Lifecycle.Error, task, [error]);
      }
    };
  };
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
