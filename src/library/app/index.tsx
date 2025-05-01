import { AppContext } from "./types.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

const Context = React.createContext<AppContext>({
  appEmitter: new EventEmitter(),
});

export function useApp() {
  return React.useContext(Context);
}

export default function app(Tree: React.ComponentType): React.ComponentType {
  return () => {
    const context = React.useMemo(
      () => ({
        appEmitter: new EventEmitter(),
      }),
      [],
    );

    return (
      <Context.Provider value={context}>
        <Tree />
      </Context.Provider>
    );
  };
}
