import { ModuleDefinition } from "../../../types/index.ts";
import * as utils from "../../../utils/index.ts";
import { Props, UseActions } from "./types.ts";
import { Immer, enablePatches } from "immer";
import * as React from "react";

const immer = new Immer();
immer.setAutoFreeze(false);
enablePatches();

export default function useActions<M extends ModuleDefinition>(props: Props): UseActions<M> {
  return React.useMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current;
        },
        actions: {
          io<T>(ƒ: () => T): T {
            return ƒ as T;
          },
          produce(ƒ) {
            return (model) => immer.produceWithPatches(model, ƒ);
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
          validate(ƒ) {
            const proxy = utils.validate(props.model.current, props.mutations.current);
            return ƒ(proxy);
          },
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
          // navigate() {},
        },
      },
    }),
    [],
  );
}
