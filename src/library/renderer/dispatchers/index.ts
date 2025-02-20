import { useApp } from "../../app/index.tsx";
import { Module } from "../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { Fn, Props } from "./types.ts";
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
      attach<F extends Fn>(action: Head<M["Actions"]>, ƒ: F) {
        const name = String(action);
        unicast.on(name, dispatchHandler(action, ƒ));
        broadcast.on(name, dispatchHandler(action, ƒ));
      },
      dispatch(action: Head<M["Actions"]>, data: Tail<M["Actions"]>) {
        const name = String(action);
        const isBroadcast = name.startsWith("distributed");
        isBroadcast ? broadcast.emit(name, data) : unicast.emit(name, data);
      },
    };
  }, []);
}
