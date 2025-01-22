import { create } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  ({ actions }) => {
    return {
      *[Events.ChangeProfile]() {
        const name: string = yield actions.io(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve("Maria");
              }, 2000);
            }),
        );

        return actions.produce((draft) => {
          draft.name = name;
          draft.age = 24;
        });
      },
    };
  },
);
