import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import * as preact from "preact";

export default function app<R extends Routes = any>(options: AppOptions<R>) {
  const vnode = closest<R>(options);
  if (vnode) preact.render(vnode, document.body);
}
