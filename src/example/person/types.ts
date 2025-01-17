import { DistributedActions } from "../types.ts";

export type Model = {
  name: string;
  age: number;
  avatar: null | string;
  displayParentalPermission: boolean;
};

export const enum Events {
  ChangeProfile,
}

export type Actions = DistributedActions | [Events.ChangeProfile];
