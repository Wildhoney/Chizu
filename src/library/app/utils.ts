import { Module } from "../module/types.ts";
import { Actions, Model, Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";

export function closest<M extends Model, A extends Actions, R extends Routes>(
  options: AppOptions<M, A, R>,
): Module {
  return options.routes[window.location.pathname];
}
