import { Routes } from "../types/index.ts";
import { AppContext, AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const Context = React.createContext<AppContext>({
  appEmitter: new EventEmitter(),
});

export function useApp() {
  return React.useContext(Context);
}

export default function app<R extends Routes>(options: AppOptions<R>): void {
  const Module = closest<R>(options);
  const appOptions = {
    appEmitter: new EventEmitter(),
  };

  const Child = options.routes["/"];
  const root = ReactDOM.createRoot(document.body);

  if (Module)
    root.render(
      <Tree options={appOptions}>
        <Child />
      </Tree>,
    );
}

function Tree({ options, children }) {
  return <Context.Provider value={options}>{children}</Context.Provider>;
}
