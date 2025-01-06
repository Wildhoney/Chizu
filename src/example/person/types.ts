import { Reactive } from "../../library/index.ts";
import { DistributedActions } from "../types.ts";

export type Name = Reactive<string>;

export type Model = {
  name: Name;
  age: number;
  displayParentalPermission: boolean;
};

export const enum Events {
  UpdateAge,
}

export type Actions = DistributedActions | [Events.UpdateAge, number];
