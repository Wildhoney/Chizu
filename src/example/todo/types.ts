import { Pk, Schema } from "../../library/index.ts";

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

export const enum Action {
  Task,
  Add,
  Completed,
  Remove,
}

export type Actions =
  | [Action.Task, string]
  | [Action.Add]
  | [Action.Completed, Pk<Id>]
  | [Action.Remove, Pk<Id>];

export type Module = Schema<Model, Actions>;
