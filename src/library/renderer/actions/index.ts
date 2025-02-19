import { Props } from "./types.ts";
import { Immer, enablePatches } from "immer";
import * as React from "react";

const immer = new Immer();
immer.setAutoFreeze(false);
enablePatches();

export default function useActions(props: Props) {
  return React.useMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current;
        },
        actions: {
          io(ƒ) {
            return ƒ;
          },
          produce(ƒ) {
            return (model) => immer.produceWithPatches(model, ƒ);
          },
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
          navigate() {},
        },
      },
      view: {
        get model() {
          return props.model.current;
        },
        actions: {
          // validate<T>(ƒ: (model: Validation<S["Model"]>) => T): T {
          //   return ƒ(
          //     validate<S["Model"]>(props.model.current, mutations.current),
          //   );
          // },
          // pending(ƒ: (model: Validation<S["Model"]>) => State): boolean {
          //   const state = ƒ(
          //     validate<S["Model"]>(props.model.current, mutations.current),
          //   );
          //   return Boolean(state & State.Pending);
          // },
          dispatch([action, ...data]) {
            return props.dispatchers.dispatch(action, data);
          },
          navigate() {},
        },
      },
    }),
    [],
  );
}
