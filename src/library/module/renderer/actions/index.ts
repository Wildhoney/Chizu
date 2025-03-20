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
          return props.model.current;
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
            return placeholder(value, state, props.process.current) as T;
          },
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (model: M["Model"]) => {
              ƒ(observe(model, props.mutations.current));
              return model;
            };
          },
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
        },
      },
      view: {
        get model() {
          return props.model.current;
        },
        get validate() {
          return validate(props.model.current, props.mutations.current);
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
