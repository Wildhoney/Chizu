import { AppContext, TreeProps } from "./types.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const Context = React.createContext<AppContext>({
  appEmitter: new EventEmitter(),
});

export function useApp() {
  return React.useContext(Context);
}

export default function app(tree: React.ElementType): void {
  const root = ReactDOM.createRoot(document.body);
  root.render(<Tree tree={tree} />);
}

function Tree({ tree: Tree }: TreeProps) {
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
}
