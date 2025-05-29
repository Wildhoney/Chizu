import EventEmitter from "eventemitter3";
import * as React from "react";

export type BroadcastContext = {
  appEmitter: EventEmitter;
};

export type UseBroadcast = BroadcastContext;

export type Props = {
  children: React.ReactNode;
};
