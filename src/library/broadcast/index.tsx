import { useOptimisedMemo } from "../hooks/index.ts";
import type { BroadcastContext } from "./types.ts";
import { Props } from "./types.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

const Context = React.createContext<BroadcastContext>({
  appEmitter: new EventEmitter(),
});

export function useBroadcast() {
  return React.useContext(Context);
}

export function BroadcastProvider({ children }: Props): React.ComponentType {
  return () => {
    const context = useOptimisedMemo(
      () => ({
        appEmitter: new EventEmitter(),
      }),
      [],
    );

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };
}
