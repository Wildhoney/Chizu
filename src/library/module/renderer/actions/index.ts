import {
  Draft,
  Events,
  ModuleDefinition,
  Op,
  Process,
} from "../../../types/index.ts";
import { update } from "../../../utils/produce/index.ts";
import { state } from "../../../utils/produce/utils.ts";
import { Validatable } from "../model/types.ts";
import { Models } from "../model/utils.ts";
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
          state<T>(value: T, operations: (Op | Draft<T>)[]): T {
            return state(value, operations);
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
