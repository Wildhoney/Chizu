// export const enum Transmit {
//   Unicast = "unicast",
//   Multicast = "multicast",
//   Broadcast = "broadcast",
// }

export const enum State {
  Resolved = 1,
  Pending = 2,
  Failed = 4,
  Optimistic = 8,
}

type ActionName = Lifecycle | string | number;

type ActionPayload = [any, ...any[]];

export type Actions = [ActionName] | [ActionName, ...ActionPayload];

export type Model = Record<string, any>;

export type RoutePaths<R extends Routes> = R[keyof R];

export type Routes = Record<string, string | number | symbol>;

export type Parameters = undefined | string;

export const enum Lifecycle {
  Mount = "lifecycle/mount",
  Tree = "lifecycle/tree",
  Derive = "lifecycle/derive",
  Unmount = "lifecycle/unmount",
}

export type Name<A extends Actions> = A[0];

export type Attributes = Record<string, string>;

export type ModuleOptions<
  A extends Model,
  B extends Actions,
  C extends Attributes,
  D extends Routes | [Routes, Parameters],
> = {
  Model: A;
  Actions: B;
  Attributes: C;
  Routes: D;
};

export type Module = {
  Model: Model;
  Actions: Actions;
  Attributes: Attributes;
  Routes: Routes | [Routes, Parameters];
};
