import { Pk, Typed } from "../../library/index.ts";

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
  Recover,
}

export type Actions =
  | [Events.Task, string]
  | [Events.Add]
  | [Events.Completed, Pk<Id>]
  | [Events.Remove, Pk<Id>]
  | [Events.Recover];

export type Module = Typed.Module<Model, Actions>;
