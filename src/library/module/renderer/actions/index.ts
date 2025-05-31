import { useOptimisedMemo } from "../../../hooks/index.ts";
import { Draft, ModuleDefinition, Op, Process } from "../../../types/index.ts";
import { Meta } from "../../../utils/index.ts";
import { update } from "../../../utils/produce/index.ts";
import { annotate } from "../../../utils/produce/utils.ts";
import { Validatable } from "../model/types.ts";
import { Models } from "../model/utils.ts";
import { Props, UseActions } from "./types.ts";

export default function useActions<M extends ModuleDefinition>(
  props: Props<M>,
): UseActions<M> {
  return useOptimisedMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current.stateful as Readonly<M["Model"]>;
        },
        queue: [],
        actions: {
          annotate<T>(value: T, operations: (Op | Draft<T>)[]): T {
            return annotate(value, operations);
          },
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (
              models: Models<M["Model"]>,
              process: Process,
            ): Models<M["Model"]> => {
              return update(models, process, ƒ);
            };
          },
          dispatch([action, ...data]) {
            if (action == null) return Promise.reject();
            const task = Promise.withResolvers<void>();
            props.dispatchers.dispatch(action, data, task);
            return task.promise;
          },
        },
      },
      view: {
        get model() {
          return props.model.current.stateless as Readonly<M["Model"]>;
        },
        get validate() {
          return props.model.current.validatable as Validatable<
            Readonly<M["Model"]>
          >;
        },
        actions: {
          corrupt() {
            return props.model.current.stateless[Meta.Error];
          },
          dispatch([action, ...data]) {
            if (action == null) return Promise.reject();
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
