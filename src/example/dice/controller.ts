import { create, Lifecycle } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events, Props } from "./types.ts";

export default create.controller<
  Model,
  Actions,
  Routes,
  Props,
  Route.Dashboard
>((self) => {
  return {
    *[Lifecycle.Mount](parameters) {
      return self.actions.produce((draft) => {
        draft.kite = Number(parameters.props.initialKite);
      });
    },

    *[Events.Roll]() {
      return self.actions.produce((draft) => {
        draft.kite = Math.floor(Math.random() * (6 - 1 + 1) + 1);
      });
    },
  };
});
