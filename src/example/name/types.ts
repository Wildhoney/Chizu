import { Create } from "../../library/index.ts";
import { DistributedActions } from "../types.ts";

export type Model = {
  name: null | string;
  isValid: boolean;
};

export const enum Events {
  UpdateName,
}

export type Actions =
  | DistributedActions
  | [Events.UpdateName, React.ChangeEvent<HTMLInputElement>];

export type Props = {
  model: {
    name: null | string;
  };
  onClick(): void;
};

export type Module = Create.Module<Model, Actions, Props>;
