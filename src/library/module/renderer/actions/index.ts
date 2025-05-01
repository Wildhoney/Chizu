import { IoHelpers } from "../../../controller/types.ts";
import { Events, ModuleDefinition } from "../../../types/index.ts";
import produce from "../../../utils/produce/index.ts";
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
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (model: M["Model"]) => {
              const [draft, proxy] = produce(model);
              ƒ(proxy);
              return draft;
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
