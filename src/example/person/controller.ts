import { create, Lifecycle } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  ({ actions }) => {
    return {
      *[Lifecycle.Mount](parameters) {},

      *[Lifecycle.Unmount]() {},

      // *[DistributedEvents.UpdateName](name) {
      //   const random: string = yield actions.io(() => name);

      //   return actions.produce((draft) => {
      //     draft.name = random;
      //     // draft.name = actions.optimistic(random, name);
      //   });
      // },

      *[Events.RandomAvatar]() {
        const name = yield actions.io(() => "Maria");

        return actions.produce((draft) => {
          draft.name = name;
        });
      },
    };
  },
);
