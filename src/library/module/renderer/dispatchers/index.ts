import { useApp } from "../../../app/index.tsx";
import { ModuleDefinition } from "../../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { GeneratorFn, Props } from "./types.ts";
import { dispatcher } from "./utils.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

export default function useDispatchers<M extends ModuleDefinition>(
  props: Props<M>,
) {
  const app = useApp();
  const dispatch = dispatcher(props);

  return React.useMemo(() => {
    const unicast = new EventEmitter();
    const broadcast = app.appEmitter;

    return {
      attach<F extends GeneratorFn>(action: Head<M["Actions"]>, ƒ: F) {
        const name = String(action);
        unicast.on(name, dispatch(action, ƒ));
        broadcast.on(name, dispatch(action, ƒ));
      },
      dispatch(action: Head<M["Actions"]>, data: Tail<M["Actions"]>) {
        const name = String(action);
        const isBroadcast = name.startsWith("distributed");
        isBroadcast ? broadcast.emit(name, data) : unicast.emit(name, data);
      },
    };
  }, []);
}
