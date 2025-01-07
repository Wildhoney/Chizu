import { create, Transmit } from "../../library/index.ts";
import { Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";
import { DistributedEvents } from "../types.ts";

export default create.controller<Model, Actions, Routes>`person`(
  ({ model, actions }) => {
    return {
      *[DistributedEvents.UpdateName](name) {
        const random: string = yield actions.io(() => name);

        return actions.produce(Transmit.Multicast, (draft) => {
          draft.name = actions.optimistic(random, name);
        });
      },

      *[Events.UpdateAge](age) {
        const random = Math.random() * age;

        return actions.produce(Transmit.Multicast, (draft) => {
          draft.age = random;
          draft.displayParentalPermission = random < 18;
        });
      },
    };
  },
);
