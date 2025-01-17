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

export type Actions = [any] | [any, ...Data];

export type Model = Record<string, any>;

export type RoutePaths<R extends Routes> = R[keyof R];

export type Routes = Record<string, string | number | symbol>;

export type Parameters = undefined | string;

export const enum Lifecycle {
  Mount = "lifecycle/mount",
  Unmount = "lifecycle/unmount",
}

export type Data = any[];
