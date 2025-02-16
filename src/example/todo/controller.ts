import { create } from "../../library/index.ts";
import { DistributedEvents } from "../types.ts";
import { Events, Module } from "./types.ts";

export default create.controller<Module>((self) => {
  return {
    *[Events.Task](task) {
      return self.actions.produce((draft) => {
        draft.task = task;
      });
    },

    *[Events.Add]() {
      return self.actions.produce((draft) => {
        if (self.model.task) {
          draft.task = null;

          draft.tasks.push({
            id: ++draft.id,
            task: self.model.task,
            date: new Date(),
            completed: false,
          });
        }
      });
    },

    *[Events.Completed](id) {
      return self.actions.produce((draft) => {
        const task = draft.tasks.find((task) => task.id === id);

        if (task) {
          task.completed = !task.completed;
        }
      });
    },

    *[Events.Remove](id) {
      return self.actions.produce((draft) => {
        draft.tasks = draft.tasks.filter((task) => task.id !== id);
      });
    },

    *[DistributedEvents.Reset]() {
      return self.actions.produce((draft) => {
        draft.tasks = [];
        draft.id = 0;
      });
    },
  };
});
