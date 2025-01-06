import { create, Transmit } from "../../library/index.ts";
import { Routes } from "../types.ts";
import { Actions, Model, Events, Name } from "./types.ts";

export default create.controller<Model, Actions, Routes>`person`(
  ({ model, actions }) => {
    return {
      *[Events.UpdateName](name) {
        const random: Name = yield actions.io(() => name);

        return actions.produce(Transmit.Multicast, (draft) => {
          draft.name = random;
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
