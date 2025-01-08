import { Actions, Model, Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import * as preact from "preact";

export default function app<
  M extends Model = any,
  A extends Actions = any,
  R extends Routes = any,
>(options: AppOptions<M, A, R>) {
  const module = closest(options);
  const vnode = module.meta.view({ model: module.meta.model });
  preact.render(vnode, document.body);
}
