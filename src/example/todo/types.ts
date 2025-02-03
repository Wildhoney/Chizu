import { DistributedActions } from "../types.ts";

type Id = number;

type Task = {
  id: Id;
  task: string;
  date: Date;
  completed: boolean;
};

export type Model = {
  id: number;
  task: null | string;
  tasks: Task[];
};

export const enum Events {
  Task,
  Add,
  Completed,
  Remove,
}

export type Actions =
  | DistributedActions
  | [Events.Task, string]
  | [Events.Add]
  | [Events.Completed, Id]
  | [Events.Remove, Id];
