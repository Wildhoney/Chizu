import { useApp } from "../../app/index.tsx";
import { Head, Tail } from "../types.ts";
import { Props } from "./types.ts";
import { useDispatchHandler } from "./utils.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

export default function useDispatchers(props: Props) {
  const app = useApp();
  const dispatchHandler = useDispatchHandler(props);

  return React.useMemo(() => {
    const unicast = new EventEmitter();
    const broadcast = app.appEmitter;

    return {
      attach(action: Head<M["Actions"]>, ƒ) {
        unicast.on(action, dispatchHandler(action, ƒ));
        broadcast.on(action, dispatchHandler(action, ƒ));
      },
      dispatch(action: Head<M["Actions"]>, data: Tail<M["Actions"]>) {
        unicast.emit(action, data);
        broadcast.emit(action, data);
      },
    };
  }, []);
}
