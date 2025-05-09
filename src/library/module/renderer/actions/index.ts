import { Events, ModuleDefinition, Operation } from "../../../types/index.ts";
import { update } from "../../../utils/produce/index.ts";
import { state } from "../../../utils/produce/utils.ts";
import { Validatable } from "../model/types.ts";
import { Models } from "../model/utils.ts";
import { Process } from "../process/types.ts";
import { Props, UseActions } from "./types.ts";
import * as React from "react";

export default function useActions<M extends ModuleDefinition>(
  props: Props<M>,
): UseActions<M> {
  return React.useMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current.stateful as Readonly<M["Model"]>;
        },
        queue: [],
        events: props.options.props as Events<M["Props"]>,
        actions: {
          state<T>(value: T, operation: null | Operation = null): T {
            return state(value, operation, props.process.current);
          },
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (
              model: M["Model"],
              process: Process,
            ): Models<M["Model"]> => {
              return update(model, process, ƒ);
            };
          },
          dispatch([action, ...data]) {
            const task = Promise.withResolvers<void>();
            props.dispatchers.dispatch(action, data, task);
            return task.promise;
          },
        },
      },
      view: {
        get model() {
          return props.model.current.interface as Validatable<
            Readonly<M["Model"]>
          >;
        },
        events: props.options.props as Events<M["Props"]>,
        actions: {
          dispatch([action, ...data]) {
            const task = Promise.withResolvers<void>();
            props.dispatchers.dispatch(action, data, task);
            return task.promise;
          },
        },
      },
    }),
    [],
  );
}
