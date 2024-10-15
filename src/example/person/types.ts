import { Reactive } from "../../library/index.ts";

export type Model = {
  name: Reactive<string>;
  age: number;
  displayParentalPermission: boolean;
};

export const enum Events {
  UpdateName,
  UpdateAge,
  Register,
  DisplayParentalPermission,
}

export type Actions = [Events.UpdateName, string] | [Events.UpdateAge, number];
