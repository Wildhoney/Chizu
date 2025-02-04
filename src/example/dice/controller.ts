import { create } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  (self) => {
    return {
      *[Events.Roll]() {
        return self.actions.produce((draft) => {
          draft.kite = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        });
      },
    };
  },
);
