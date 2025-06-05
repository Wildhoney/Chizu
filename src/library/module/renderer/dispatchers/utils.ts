import { ActionEvent } from "../../../controller/types.ts";
import { intoError } from "../../../errors/utils.ts";
import { Lifecycle, ModuleDefinition, Task } from "../../../types/index.ts";
import { cleanup } from "../../../utils/produce/index.ts";
import { Head, Tail } from "../types.ts";
import { UseDispatchHandlerProps } from "./types.ts";

/**
 * @function useDispatcher
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
      if (typeof ƒ !== "function") return void task.resolve();

      // const abort = new AbortController();
      const process = Symbol("process");
      const action = ƒ(...payload);

      try {
        if (action == null) return void task.resolve();

        if (typeof action === "function") {
          const models = action(props.model.current, process);
          props.model.current = cleanup(models, process);
          props.update.rerender();

          return void task.resolve();
        }

        while (true) {
          if (action instanceof Promise) {
            const produce = await action;

            if (produce == null) return void task.resolve();

            const models = produce(props.model.current, process);
            props.model.current = cleanup(models, process);
            props.update.rerender();

            return void task.resolve();
          }

          const { value: produce, done } = await action.next();

          if (done) {
            const models = produce(props.model.current, process);
            props.model.current = cleanup(models, process);
            props.update.rerender();

            return void task.resolve();
          }

          props.model.current = produce(props.model.current, process);
          props.update.rerender();
        }
      } catch (error) {
        cleanup(props.model.current, process);
        props.update.rerender();
        props.unicast.emit(Lifecycle.Error, task, [intoError(error)]);
      }
    };
  };
}
