import { Head } from "../module/renderer/types";

export const enum Transmit {
  Unicast = "unicast",
  Multicast = "multicast",
  Broadcast = "broadcast",
}

export const enum State {
  Idle = 0,
  Pending = 1,
  Adding = 2,
  Removing = 4,
  Updating = 8,
  Moving = 16,
}

export const reference = Symbol("marea-reference");

export type ActionName = Lifecycle | string | number;

type ActionPayload = [any, ...any[]];

export type Actions = [ActionName] | [ActionName, ...ActionPayload];

export type Model = Record<string, any>;

export type Parameters = undefined | string;

export const enum Lifecycle {
  Mount = "lifecycle/mount",
  Tree = "lifecycle/tree",
  Derive = "lifecycle/derive",
  Error = "distributed/lifecycle/error",
  Unmount = "lifecycle/unmount",
}

export type Name<A extends Actions> = A[0];

export type Attributes = Record<string, unknown>;

export type Module<
  A extends Model,
  B extends Actions,
  C extends Attributes = {},
> = {
  Model: A;
  Actions: B;
  Attributes: C;
};

export type ModuleDefinition = {
  Model: Model;
  Actions: Actions;
  Attributes: Attributes;
};

type Fns<A extends Attributes> = {
  [K in keyof A]: A[K] extends (...args: any[]) => any ? A[K] : never;
};

export type Events<A extends Attributes> = Pick<
  Fns<A>,
  {
    [K in keyof Fns<A>]: Fns<A>[K] extends never ? never : K;
  }[keyof Fns<A>]
>;

export type Pk<T> = undefined | Symbol | T;

export type Queue<A extends ModuleDefinition["Actions"]> = {
  event: Head<A>;
  actions: {
    abort: AbortController["abort"];
  };
}[];

export type Task = PromiseWithResolvers<void>;
