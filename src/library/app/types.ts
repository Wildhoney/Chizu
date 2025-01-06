import { Module } from "../module/index.ts";
import { Actions, Model, RoutePaths, Routes } from "../types/index.ts";

export type AppOptions<M extends Model, A extends Actions, R extends Routes> = {
  routes: Record<RoutePaths<R>, Module<M, A, R>>;
};
