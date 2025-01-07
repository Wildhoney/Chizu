import { ComponentChildren } from "preact";

export const enum Transmit {
  Unicast = "unicast",
  Multicast = "multicast",
  Broadcast = "broadcast",
}

export const enum State {
  Resolved = 1,
  Pending = 2,
  Failed = 4,
  Optimistic = 8,
}

const Pending = Symbol("pending");
const Failed = Symbol("failed");
const Optimistic = Symbol("optimistic");

export type Reactive<P> =
  | typeof Pending
  | typeof Failed
  | typeof Optimistic
  | P;

export type Actions = [any] | [any, any];

export type Model = Record<string, any>;

export type RoutePaths<R extends Routes> = R[keyof R];

export type Routes = Record<string, string | number | symbol>;

type ReactiveMethods = {
  equals<P>(state: State | ((state: State) => string | P)): boolean;
  pending<P>(options?: PlaceholderOptions): P;
  otherwise<P>(fallback: ComponentChildren): P;
};

export type ReactiveProps<Prop> = {
  [Key in keyof Prop]: Prop[Key] & ReactiveMethods;
};

type PlaceholderOptions = {
  size: number;
};
