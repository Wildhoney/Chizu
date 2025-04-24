import { IoHelpers } from "../../../controller/types.ts";
import { Events, ModuleDefinition, State } from "../../../types/index.ts";
import {
  observe,
  placeholder,
  validate,
} from "../../../utils/placeholder/index.ts";
import { Validator } from "../../../view/types.ts";
import { Props, UseActions } from "./types.ts";
import * as React from "react";

export default function useActions<M extends ModuleDefinition>(
  props: Props<M>,
): UseActions<M> {
  return React.useMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current as Readonly<M["Model"]>;
        },
        queue: [],
        events: props.options.props as Events<M["Props"]>,
        actions: {
          io<T>(ƒ: (helpers: IoHelpers) => T): T {
            return ƒ as T;
          },
          placeholder<T>(value: T, state: State) {
            return placeholder(value, state, props.process.current) as T;
          },
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (model: M["Model"]) => {
              ƒ(observe(model, props.mutations.current));
              return model;
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
          return props.model.current as Readonly<M["Model"]>;
        },
        get validate() {
          return validate(
            props.model.current,
            props.mutations.current,
          ) as Readonly<Validator<M["Model"]>>;
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
