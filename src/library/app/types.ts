import EventEmitter from "eventemitter3";
import * as React from "react";

export type AppOptions = React.ElementType;

export type AppContext = {
  appEmitter: EventEmitter;
};

export type TreeProps = {
  tree: React.ElementType;
};

export type UseApp = AppContext;
