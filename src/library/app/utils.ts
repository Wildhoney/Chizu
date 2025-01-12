import { Module } from "../module/types.ts";
import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";

export function closest<R extends Routes>(options: AppOptions<R>): Module {
  return options.routes[window.location.pathname];
}
