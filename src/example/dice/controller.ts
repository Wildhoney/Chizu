import { create, Lifecycle } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

export default create.controller<Module>((self) => {
  return {
    *[Lifecycle.Mount]() {
      return self.actions.produce((draft) => {
        draft.kite = Number(self.attributes.initialKite);
      });
    },

    *[Lifecycle.Derive]() {
      return self.actions.produce((draft) => {
        draft.kite = Number(self.attributes.taskCount);
      });
    },

    *[Events.Roll]() {
      return self.actions.produce((draft) => {
        draft.kite = Math.floor(Math.random() * (6 - 1 + 1) + 1);
      });
    },
  };
});
