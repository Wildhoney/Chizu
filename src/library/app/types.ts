import EventEmitter from "eventemitter3";
import { RoutePaths, Routes } from "../types/index.ts";
import { ElementType } from "preact/compat";

export type AppOptions<R extends Routes, DE> = {
  routes: Record<RoutePaths<R>, ElementType>;
  distributedEvents: DE;
};

export type AppContext = {
  appEmitter: EventEmitter;
  distributedEvents: null | any;
};
