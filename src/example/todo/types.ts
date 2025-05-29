import { Pk, Typed } from "../../library/index.ts";
import { DistributedActions } from "../types.ts";

type Id = number;

export type Task = {
  id: Pk<Id>;
  summary: string;
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
  | [Events.Completed, Pk<Id>]
  | [Events.Remove, Pk<Id>];

export type Module = Typed.Module<Model, Actions>;
