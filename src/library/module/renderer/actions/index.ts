import { Events, ModuleDefinition, State } from "../../../types/index.ts";
import { mark } from "../../../utils/mark/index.ts";
import { Props, UseActions } from "./types.ts";
import { Immer } from "immer";
import * as React from "react";

const immer = new Immer();
immer.setAutoFreeze(false);

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
          mark<T>(value: T, state: State): T {
            return mark(value, state);
          },
          produce(ƒ) {
            return (model) => immer.produce(model, (draft) => ƒ(draft));
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
        actions: {
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
        },
      },
    }),
    [],
  );
}
