import { Properties } from "../lib/view";

export type Model = {
  name: string;
  age: number;
};

export const enum Events {
  ModifyName = "modifyName",
  ModifyAge = "modifyAge",
}

export const Handle = new Properties<Model>();
