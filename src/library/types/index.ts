import { Head } from "../module/renderer/types.ts";

export enum Transmit {
  Unicast = "unicast",
  Multicast = "multicast",
  Broadcast = "broadcast",
}

export class Draft<T> {
  constructor(public value: T) {}
}

export class State {
  static Op = {
    Add: 1,
    Remove: 2,
    Update: 4,
    Move: 8,
    Replace: 16,
  };

  static Draft<T>(value: T): Draft<T> {
    return new Draft(value);
  }
}

export type ActionName = Lifecycle | symbol | string | number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionPayload = [any, ...any[]];

export enum Lifecycle {
  Mount = "lifecycle/mount",
  Node = "lifecycle/node",
  Derive = "lifecycle/derive",
  Error = "distributed/lifecycle/error",
  Unmount = "lifecycle/unmount",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Model = Record<string, any>;
export type Actions = [] | [ActionName] | [ActionName, ...ActionPayload];
export type Props = Record<string, unknown>;

export type Module<
  M extends Model,
  A extends Actions = [],
  P extends Props = Record<string, never>,
> = {
  Model: M;
  Actions: A;
  Props: P;
};

export type ModuleDefinition = {
  Model: Model;
  Actions: Actions;
  Props: Props;
};

export type Pk<T> = undefined | symbol | T;

export type Queue<A extends ModuleDefinition["Actions"]> = {
  name: Head<A>;
  actions: {
    abort: AbortController["abort"];
  };
}[];

export type Task = PromiseWithResolvers<void>;

export type Process = symbol;

export type Op = number;
