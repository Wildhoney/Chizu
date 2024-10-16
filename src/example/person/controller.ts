import { create, Reactive, Transmit } from "../../library/index.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions>`person`(
  ({ model, actions }) => {
    return {
      *[Events.UpdateName](name) {
        const random: Reactive<string> = yield actions.io(() => name);

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
