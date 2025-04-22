import { useApp } from "../../../app/index.tsx";
import { ModuleDefinition, Task } from "../../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { GeneratorFn, Props } from "./types.ts";
import { isBroadcast, useDispatcher } from "./utils.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

/**
 * @param props {Props<M>}
 * @returns { attach: (action: Head<M["Actions"]>, ƒ: F) => void; dispatch: (action: Head<M["Actions"]>, data: Tail<M["Actions"]>) => void; }
 */
export default function useDispatchers<M extends ModuleDefinition>(
  props: Props<M>,
) {
  const app = useApp();
  const dispatcher = useDispatcher(props);

  return React.useMemo(() => {
    const unicast = new EventEmitter();
    const broadcast = app.appEmitter;

    return {
      attach<F extends GeneratorFn<M>>(action: Head<M["Actions"]>, ƒ: F) {
        const name = String(action);

        isBroadcast(name)
          ? broadcast.on(name, dispatcher(action, ƒ))
          : unicast.on(name, dispatcher(action, ƒ));
      },
      dispatch(
        action: Head<M["Actions"]>,
        data: Tail<M["Actions"]>,
        task?: Task,
      ) {
        const name = String(action);

        isBroadcast(name)
          ? broadcast.emit(name, task, data)
          : unicast.emit(name, task, data);
      },
    };
  }, []);
}
