import { Lifecycle, create } from "../../library/index.ts";
import { DistributedEvents } from "../types.ts";
import { Events, Module } from "./types.ts";

export default create.controller<Module>((self) => {
  return {
    *[Lifecycle.Derive](attributes) {
      return self.actions.produce((draft) => {
        draft.kite = Number(attributes.taskCount);
      });
    },

    // @Signal.Unique()
    // @Signal.Prioritise()
    *[Events.Roll]() {
      const kite: number = yield self.actions.io<number>(async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(Math.floor(Math.random() * (6 - 1 + 1) + 1));
          }, 1_000);
        });
      }, 0);

      return self.actions.produce((draft) => {
        draft.kite = kite;
      });
    },

    *[DistributedEvents.Reset]() {
      return self.actions.produce((draft) => {
        draft.kite = 0;
      });
    },
  };
});
