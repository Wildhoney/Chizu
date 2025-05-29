import EventEmitter from "eventemitter3";
import * as React from "react";

export type BroadcastOptions = React.ComponentType;

export type BroadcastContext = {
  appEmitter: EventEmitter;
};

export type UseBroadcast = BroadcastContext;

export type Props = {
  children: React.ReactNode;
};
