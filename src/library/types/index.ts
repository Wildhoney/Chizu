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

export type Props = Record<string, string>;

export type Stitch<
  M extends Model,
  A extends Actions,
  P extends Props,
  R extends Routes | [Routes, Parameters],
> = {
  Model: M;
  Actions: A;
  Props: P;
  Routes: R;
};

export type Module = {
  Model: Model;
  Actions: Actions;
  Attributes: Props;
  Routes: Routes | [Routes, Parameters];
};
