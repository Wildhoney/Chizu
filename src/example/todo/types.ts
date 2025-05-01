import { Create, Maybe, Pk } from "../../library/index.ts";
import { DistributedActions } from "../types.ts";

type Id = number;

export type Task = {
  id: Pk<Id>;
  summary: string;
  // date: Date;
  // completed: Maybe<boolean>;
};

export type Model = {
  id: number;
  task: null | string;
  tasks: Maybe<Task[]>;
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

export type Module = Create.Module<Model, Actions>;
