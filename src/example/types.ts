export const enum Paths {
  Dashboard = "/",
}

export type Routes = typeof Paths;

export const enum DistributedEvents {
  UpdateName = "distributed/update-name",
}

export type DistributedActions = [DistributedEvents.UpdateName, string];
