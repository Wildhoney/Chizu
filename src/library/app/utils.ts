import { ComponentChildren } from "preact";
import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";

export function closest<R extends Routes>(
  options: AppOptions<R>,
): ComponentChildren {
  return options.routes[<keyof R>window.location.pathname];
}
