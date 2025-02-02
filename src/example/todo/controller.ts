import { create } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events, Id } from "./types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  (self) => {
    return {
      *[Events.Task](task: string) {
        return self.actions.produce((draft) => {
          draft.task = task;
        });
      },

      *[Events.Add]() {
        return self.actions.produce((draft) => {
          if (self.model.task) {
            draft.task = null;

            draft.tasks.push({
              id: ++self.model.id,
              task: self.model.task,
              date: new Date(),
              completed: false,
            });
          }
        });
      },

      *[Events.Completed](id: Id) {
        return self.actions.produce((draft) => {
          const task = draft.tasks.find((task) => task.id === id);

          if (task) {
            task.completed = !task.completed;
          }
        });
      },

      *[Events.Remove](id: Id) {
        return self.actions.produce((draft) => {
          draft.tasks = draft.tasks.filter((task) => task.id !== id);
        });
      },
    };
  },
);
