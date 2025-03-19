import { Events, ModuleDefinition, State } from "../../../types/index.ts";
import { placeholder, proxify } from "../../../utils/placeholder/index.ts";
import { Validator } from "../../../view/types.ts";
import { Props, UseActions } from "./types.ts";
import { cloneDeep } from "lodash";
import * as React from "react";

export const enum Mode {
  Stateless,
  Stateful,
}

export default function useActions<M extends ModuleDefinition>(
  props: Props<M>,
): UseActions<M> {
  return React.useMemo(
    () => ({
      controller: {
        get model() {
          return proxify(props.model.current);
        },
        events: Object.entries(props.options.attributes)
          .filter(([_, value]) => typeof value === "function")
          .reduce(
            (acc, [key, value]) => ({ ...acc, [key]: value }),
            {} as Events<M["Attributes"]>,
          ),
        actions: {
          io<T>(ƒ: () => T): T {
            return ƒ as T;
          },
          placeholder<T>(value: T, state: State) {
            return placeholder(value, props.process.current, state) as T;
          },
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (model: M["Model"]) => {
              const cloned = cloneDeep(model);
              ƒ(proxify(cloned));
              return cloned;
            };
          },
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
        },
      },
      view: {
        get raw() {
          return props.model.current;
        },
        get model() {
          return props.model.current;
        },
        get validate() {
          // return proxy.validate(props.model.current) as Validator<M["Model"]>;
        },
        actions: {
          is<T>(value: T, state: State): boolean {
            return true;
            // if (!isPlaceholder(value)) return false;

            // const currentState = [
            //   ...new Set([...value.states].map((state) => state.state)),
            // ].reduce((current, state) => current | state, State.Pending);

            // return isPlaceholder(value) ? Boolean(currentState & state) : false;
          },
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
        },
      },
    }),
    [],
  );
}
