export enum DistributedEvents {
  Reset = "distributed/reset",
}

export type DistributedActions = [DistributedEvents.Reset];
