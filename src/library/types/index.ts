// export const enum Transmit {
//   Unicast = "unicast",
//   Multicast = "multicast",
//   Broadcast = "broadcast",
// }
export const enum State {
  Actual = 0,
  Pending = 1,
}

export const enum Operation {
  Adding = 512,
  Removing = 4,
  Updating = 8,
  Moving = 16,
}

export const enum Target {
  Direct = 32,
  Indirect = 64,
}

// 73 = 1 | 64 | 8
// 512 & 73 = 0
// 576 = 64 | 512

export type ActionName = Lifecycle | string | number;

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

export type Attributes = Record<string, unknown>;

export type Module<
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

export type ModuleDefinition = {
  Model: Model;
  Actions: Actions;
  Attributes: Attributes;
  Routes: Routes | [Routes, Parameters];
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
