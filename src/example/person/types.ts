import { Reactive } from "../../library/index.ts";
import { DistributedEvents } from "../types.ts";

export type Name = Reactive<string>;

export type Model = {
  name: Name;
  age: number;
  displayParentalPermission: boolean;
};

export const enum Events {
  UpdateName = DistributedEvents.UpdateName,
  UpdateAge = "UpdateAge",
}

export type Actions = [Events.UpdateName, string] | [Events.UpdateAge, number];
