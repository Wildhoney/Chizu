import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";
import { ElementType } from "preact/compat";

export function closest<R extends Routes>(options: AppOptions<R>): ElementType {
  return options.routes[<keyof R>window.location.pathname];
}
