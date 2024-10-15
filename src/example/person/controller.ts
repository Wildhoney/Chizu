import { create, Reactive, Transmit } from "../../library/index.ts";
import model from "./model.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions>`person`(
  model,
  ({ app, use }) => {
    return {
      *[Events.UpdateName](name) {
        const random: Reactive<string> = yield use.io(() => name);

        return use.produce(Transmit.Multicast, (draft) => {
          draft.name = random;
        });
      },

      *[Events.UpdateAge](age) {
        const random = Math.random() * age;

        return use.produce(Transmit.Multicast, (draft) => {
          draft.age = random;
          draft.displayParentalPermission = random < 18;
        });
      },
    };
  },
);
