import EventEmitter from "eventemitter3";
import * as React from "react";

export type AppOptions = React.ComponentType;

export type AppContext = {
  appEmitter: EventEmitter;
};

export type TreeProps = {
  tree: React.ComponentType;
};

export type UseApp = AppContext;
