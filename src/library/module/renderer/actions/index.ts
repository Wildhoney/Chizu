import { Events, ModuleDefinition, Phase } from "../../../types/index.ts";
import * as utils from "../../../utils/index.ts";
import { Validator } from "../../../view/types.ts";
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
          produce(ƒ) {
            return (model, phase) =>
              immer.produce(model, (draft) => ƒ(draft, phase));
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
          return utils.validate(
            props.model.current,
            props.mutations.current,
          ) as Validator<M["Model"]>;
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
