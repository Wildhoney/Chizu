import { Unify } from "../lib/types";
import PersonController from "./controller";
import PersonView from "./view";

export const enum Events {
  ModifyName = "modify_name",
  ModifyAge = "modify_age",
}

// export type Dispatch = Dispatchables<typeof PersonController>;

export type Self = Unify<
  typeof PersonController,
  typeof PersonView
>;
