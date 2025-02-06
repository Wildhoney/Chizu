import { RoutePaths, Routes } from "../types/index.ts";
import { ElementType } from "preact/compat";

export type AppOptions<R extends Routes> = {
  routes: Record<RoutePaths<R>, ElementType>;
};
