export const enum Route {
  Dashboard = "/",
}

export type Routes = typeof Route;

export enum DistributedEvents {
  Reset = "distributed/reset",
}

export type DistributedActions = [DistributedEvents.Reset];
