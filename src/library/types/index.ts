import { Head } from "../module/renderer/types.ts";

export enum Transmit {
  Unicast = "unicast",
  Multicast = "multicast",
  Broadcast = "broadcast",
}

export class Optimistic<T> {
  constructor(public value: T) {}
}

export class State {
  static Operation = {
    Add: 1,
    Remove: 2,
    Update: 4,
    Move: 8,
    Replace: 16,
  };

  static Optimistic<T>(value: T): Optimistic<T> {
    return new Optimistic(value);
  }
}

export type ActionName = Lifecycle | string | number;

type ActionPayload = [any, ...any[]];

export type Actions = [ActionName] | [ActionName, ...ActionPayload];

export type Model = Record<string, any>;

export type Parameters = undefined | string;

export enum Lifecycle {
  Mount = "lifecycle/mount",
  Tree = "lifecycle/tree",
  Derive = "lifecycle/derive",
  Error = "distributed/lifecycle/error",
  Unmount = "lifecycle/unmount",
}

export type Name<A extends Actions> = A[0];

export type Props = Record<string, unknown>;

export type Module<M extends Model, A extends Actions, P extends Props = {}> = {
  Model: M;
  Actions: A;
  Props: P;
};

export type ModuleDefinition = {
  Model: Model;
  Actions: Actions;
  Props: Props;
};

type Fns<P extends Props> = {
  [K in keyof P]: P[K] extends (...args: any[]) => any ? P[K] : never;
};

type NonFns<P extends Props> = {
  [K in keyof P]: P[K] extends (...args: any[]) => any ? never : P[K];
};

export type Events<P extends Props> = {
  [K in keyof Fns<P> as Fns<P>[K] extends never ? never : K]: Fns<P>[K];
};

export type Values<P extends Props> = {
  [K in keyof NonFns<P> as NonFns<P>[K] extends never
    ? never
    : K]: NonFns<P>[K];
};

export type Pk<T> = undefined | Symbol | T;

export type Queue<A extends ModuleDefinition["Actions"]> = {
  event: Head<A>;
  actions: {
    abort: AbortController["abort"];
  };
}[];

export type Task = PromiseWithResolvers<void>;

export type Process = Symbol;

export type Operation = number;
