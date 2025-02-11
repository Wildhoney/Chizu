import EventEmitter from "eventemitter3";
import { Routes } from "../types/index.ts";
import { AppContext, AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import * as preact from "preact";
import { useContext } from "preact/hooks";

const Context = preact.createContext<AppContext>({
  appEmitter: new EventEmitter(),
  distributedEvents: null,
});

export function useApp() {
  return useContext(Context);
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

  if (Module)
    preact.render(
      <Tree options={appOptions}>
        <Child />
      </Tree>,
      document.body,
    );
}

function Tree({ options, children }) {
  return <Context.Provider value={options}>{children}</Context.Provider>;
}
