import { DistributedActions } from "../types.ts";

export type Model = {
  name: string;
  age: number;
  avatar: null | string;
  displayParentalPermission: boolean;
};

export const enum Events {
  UpdateAge,
}

export type Actions = DistributedActions | [Events.UpdateAge, number];
