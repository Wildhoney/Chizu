import { Fn } from "../types";

type Actions = Record<string, Fn<any, unknown>>;

type Helpers<M> = {
  produce(dispatch: Dispatch, fn: Fn<M, void>): void;
};

export function actions<M>(model: M, actions: Fn<Helpers<M>, Actions>) {
  return actions;
}

export const enum Dispatch {
  Unicast,
  Multicast,
}
