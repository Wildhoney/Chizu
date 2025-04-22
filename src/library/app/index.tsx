import { Routes } from "../types/index.ts";
import { AppContext, AppOptions, TreeProps } from "./types.ts";
import { closest } from "./utils.ts";
import { Global, css } from "@emotion/react";
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
      <>
        <Global
          styles={css`
            body {
              padding: 0;
              margin: 0;
            }
          `}
        />

        <Tree options={appOptions}>
          <Child />
        </Tree>
      </>,
    );
}

function Tree({ options, children }: TreeProps) {
  return <Context.Provider value={options}>{children}</Context.Provider>;
}
