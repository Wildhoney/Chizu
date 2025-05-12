import { ActionEvent } from "../../../controller/types.ts";
import { ModuleDefinition, Task } from "../../../types/index.ts";
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
  return (_name: Head<M["Actions"]>, ƒ: ActionEvent<M>) => {
    return async (
      task: Task = Promise.withResolvers<void>(),
      payload: Tail<M["Actions"]>,
    ): Promise<void> => {
      if (typeof ƒ !== "function") return;

      // const abort = new AbortController();
      const process = Symbol("process");
      const generator = ƒ(...payload);

      while (true) {
        const { value, done } = await generator.next();

        if (done) {
          const models = value(props.model.current.stateful, process);
          props.model.current = cleanup(models, process);
          props.update.rerender();
          break;
        }

        const produce = value;
        const models = produce(props.model.current.stateful, process);

        props.model.current = models;
        props.update.rerender();
      }

      task.resolve();
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
