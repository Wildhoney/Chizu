import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import * as preact from "preact";
import EventEmitter from "eventemitter3";

export const appContext = preact.createContext(new EventEmitter());

export default function app<R extends Routes = any>(
  options: AppOptions<R>,
): void {
  const vnode = closest<R>(options);

  if (vnode)
    preact.render(
      preact.h(appContext.Provider, {
        value: new EventEmitter(),
        children: vnode,
      }),
      document.body,
    );
}
