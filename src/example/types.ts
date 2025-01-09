export const enum Route {
  Dashboard = "/",
}

export type Routes = typeof Route;

export const enum DistributedEvents {
  UpdateName = "distributed/update-name",
}

export type DistributedActions = [DistributedEvents.UpdateName, string];
