import EventEmitter from "eventemitter3";
import { Routes } from "../types/index.ts";
import { AppContext, AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import * as ReactDOM from "react-dom/client";
import * as React from "react";

const Context = React.createContext<AppContext>({
  appEmitter: new EventEmitter(),
  distributedEvents: null,
});

export function useApp() {
  return React.useContext(Context);
}

export default function app<R extends Routes, DE>(
  options: AppOptions<R, DE>,
): void {
  const Module = closest<R>(options);
  const appOptions = {
    appEmitter: new EventEmitter(),
    distributedEvents: options.distributedEvents,
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
