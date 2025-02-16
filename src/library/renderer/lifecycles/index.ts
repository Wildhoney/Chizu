import { Lifecycle, Module } from "../../types/index.ts";
import { Phase } from "../phase/types.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useLifecycles<M extends Module>(props: Props<M>) {
  React.useEffect((): void => {
    props.dispatchers.dispatch(Lifecycle.Derive, [props.options.attributes]);
  }, [props.options.attributes]);

  React.useEffect(() => {
    if (Boolean(props.phase.current & Phase.InvokedMounts)) {
      return;
    }

    props.phase.current ^= Phase.InvokedMounts;
    return () => props.dispatchers.dispatch(Lifecycle.Unmount, []);
  }, []);
}
