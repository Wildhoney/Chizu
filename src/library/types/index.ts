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

type ActionPayload = [any, ...any[]];

export enum Lifecycle {
  Mount = "lifecycle/mount",
  Node = "lifecycle/node",
  Derive = "lifecycle/derive",
  Error = "distributed/lifecycle/error",
  Unmount = "lifecycle/unmount",
}

export type Model = Record<string, any>;
export type Actions = [] | [ActionName] | [ActionName, ...ActionPayload];
export type Props = Record<string, unknown>;
export type Query = null | string;

export type Module<
  T extends {
    Model?: Model;
    Actions?: Actions;
    Props?: Props;
    Query?: Query;
  } = {},
> = {
  Model: T["Model"] extends Model ? T["Model"] : {};
  Actions: T["Actions"] extends Actions ? T["Actions"] : [];
  Props: T["Props"] extends Props ? T["Props"] : {};
  Query: T["Query"] extends Query ? T["Query"] : null;
};

export type ModuleDefinition = {
  Model: Model;
  Actions: Actions;
  Props: Props;
  Query: Query;
};

type Fns<P extends Props> = {
  [K in keyof P]: P[K] extends (...args: any[]) => any ? P[K] : never;
};

type NonFns<P extends Props> = {
  [K in keyof P]: P[K] extends (...args: any[]) => any ? never : P[K];
};

export type Handlers<P extends Props> = {
  [K in keyof Fns<P> as Fns<P>[K] extends never ? never : K]: Fns<P>[K];
};

export type Attributes<P extends Props> = {
  [K in keyof NonFns<P> as NonFns<P>[K] extends never
    ? never
    : K]: NonFns<P>[K];
};

export type Pk<T> = undefined | Symbol | T;

export type Queue<A extends ModuleDefinition["Actions"]> = {
  name: Head<A>;
  actions: {
    abort: AbortController["abort"];
  };
}[];

export type Task = PromiseWithResolvers<void>;

export type Process = Symbol;

export type Op = number;
