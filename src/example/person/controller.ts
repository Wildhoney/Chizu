import { create, Transmit, Lifecycle } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";
import { DistributedEvents } from "../types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  ({ model, actions, element }) => {
    return {
      *[Lifecycle.Mount](parameters) {
        console.log(element, "mounted");
      },

      *[Lifecycle.Unmount]() {},

      *[DistributedEvents.UpdateName](name) {
        const random: string = yield actions.io(() => name);

        return actions.produce((draft) => {
          draft.name = random;
          // draft.name = actions.optimistic(random, name);
        });
      },

      *[Events.UpdateAge](age) {
        const random = Math.random() * age;

        return actions.produce((draft) => {
          draft.age = random;
          draft.displayParentalPermission = random < 18;
        });
      },
    };
  },
);
