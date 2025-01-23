import { create, Lifecycle } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  (self) => {
    return {
      *[Lifecycle.Mount]() {},

      *[Lifecycle.DOM]() {},

      *[Lifecycle.Unmount]() {},

      *[Events.ChangeProfile]() {
        const name: string = yield self.actions.io(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve("Maria");
              }, 2_000);
            }),
        );

        return self.actions.produce((draft) => {
          draft.name = name;
          draft.age = 24;
        });
      },
    };
  },
);
