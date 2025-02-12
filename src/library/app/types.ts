import EventEmitter from "eventemitter3";
import { RoutePaths, Routes } from "../types/index.ts";
import * as React from "react";

export type AppOptions<R extends Routes, DE> = {
  routes: Record<RoutePaths<R>, React.ElementType>;
  distributedEvents: DE;
};

export type AppContext = {
  appEmitter: EventEmitter;
  distributedEvents: null | any;
};
