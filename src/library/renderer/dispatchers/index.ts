import { useApp } from "../../app/index.tsx";
import { Module } from "../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { Props } from "./types.ts";
import { useDispatchHandler } from "./utils.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

export default function useDispatchers<M extends Module>(props: Props<M>) {
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
        const isBroadcast = String(action).startsWith("distributed");
        isBroadcast ? broadcast.emit(action, data) : unicast.emit(action, data);
      },
    };
  }, []);
}
