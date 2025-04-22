import { RoutePaths, Routes } from "../types/index.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

export type AppOptions<R extends Routes> = {
  routes: Record<RoutePaths<R>, React.ElementType>;
};

export type AppContext = {
  appEmitter: EventEmitter;
};

export type TreeProps = {
  options: AppContext;
  children: React.ReactNode;
};

export type UseApp = AppContext;
