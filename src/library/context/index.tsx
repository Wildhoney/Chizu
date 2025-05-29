import { useOptimisedMemo } from "../hooks/index.ts";
import type { AppContext } from "./types.ts";
import { Props } from "./types.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

const Context = React.createContext<AppContext>({
  appEmitter: new EventEmitter(),
});

export function useApp() {
  return React.useContext(Context);
}

export function AppContext({ children }: Props): React.ComponentType {
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
