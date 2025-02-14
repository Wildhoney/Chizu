import * as React from "react";
import { Props } from "./types.ts";
import { enablePatches, Immer } from "immer";

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
          io: <T>(ƒ: () => T): (() => T) => ƒ,
          produce(ƒ: (draft: any) => void) {
            return immer.produceWithPatches(props.model.current, ƒ);
          },
          dispatch([action, ...data]) {
            return props.dispatchers.emit(action, data);
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
            return props.dispatchers.emit(action, data);
          },
          navigate() {},
        },
      },
    }),
    [],
  );
}
