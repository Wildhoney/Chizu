import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";
import * as React from "react";

export function closest<R extends Routes>(
  options: AppOptions<R>,
): React.ElementType {
  return options.routes[<keyof R>window.location.pathname];
}
