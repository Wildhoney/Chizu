import { Lifecycle, Maybe, create } from "../../library/index.ts";
import { DistributedEvents } from "../types.ts";
import { Events, Module } from "./types.ts";

export default create.controller<Module>((self) => {
  return {
    *[Lifecycle.Derive](attributes) {
      return self.actions.produce((draft) => {
        draft.kite = Number(attributes.taskCount);
      });
    },

    *[Events.Roll]() {
      const kite: Maybe<number> = yield self.actions.io(async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(Math.floor(Math.random() * (6 - 1 + 1) + 1));
          }, 1_000);
        });
      });

      return self.actions.produce((draft) => {
        draft.kite = kite.otherwise(self.model.kite);
      });
    },

    *[DistributedEvents.Reset]() {
      return self.actions.produce((draft) => {
        draft.kite = 0;
      });
    },
  };
});
