import { ComponentChildren } from "preact";
import { RoutePaths, Routes } from "../types/index.ts";

export type AppOptions<R extends Routes> = {
  routes: Record<RoutePaths<R>, ComponentChildren>;
};
