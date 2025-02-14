import * as React from "react";
import { useApp } from "../../app/index.tsx";
import EventEmitter from "eventemitter3";
import { Module } from "../../types/index.ts";
import { useDispatchHandler } from "./utils.ts";
import { Props } from "./types.ts";

export default function useDispatchers<M extends Module>(props: Props<M>) {
  const app = useApp();
  const dispatchHandler = useDispatchHandler(props);

  const dispatchers = React.useMemo(
    () => ({
      unicast: new EventEmitter(),
      broadcast: app.appEmitter,
    }),
    [],
  );

  return React.useMemo(
    () => ({
      emit(action, ƒ) {
        dispatchers.unicast.emit(action, ƒ);
        // dispatchers.broadcast.emit(action, ƒ);
      },
      bind(action, ƒ) {
        dispatchers.unicast.on(action, dispatchHandler(action, ƒ));
        // dispatchers.broadcast.on(action, dispatch(ƒ));
      },
    }),
    [dispatchers],
  );
}
