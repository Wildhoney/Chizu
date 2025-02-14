import { create, Lifecycle } from "../../library/index.ts";
import { Events, Module } from "./types.ts";
import { DistributedEvents } from "../types.ts";

export default create.controller<Module>((self) => {
  return {
    *[Lifecycle.Derive](attributes) {
      return self.actions.produce((draft) => {
        draft.kite = Number(attributes.taskCount);
      });
    },

    *[Events.Roll]() {
      console.log("Yah!");
      return self.actions.produce((draft) => {
        draft.kite = Math.floor(Math.random() * (6 - 1 + 1) + 1);
      });
    },

    *[DistributedEvents.Reset]() {
      return self.actions.produce((draft) => {
        draft.kite = 0;
      });
    },
  };
});
