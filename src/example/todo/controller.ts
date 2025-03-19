import { Lifecycle, State, create, utils } from "../../library/index.ts";
import { Mode } from "../../library/module/renderer/actions/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    *[Lifecycle.Mount]() {
      yield self.actions.io(async () => {
        // await utils.sleep(2_000);
        const tasks = await db.todos.toArray();

        return self.actions.produce((draft) => {
          draft.tasks = tasks;
        });
      });

      return self.actions.produce((draft) => {
        draft.tasks = self.actions.placeholder([], State.Adding);
      });
    },

    *[Events.Task](task) {
      return self.actions.produce((draft) => {
        draft.task = task;
      });
    },

    *[Events.Add]() {
      const optimistic: Task = {
        id: undefined,
        summary: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      yield self.actions.io(async () => {
        await utils.sleep(5_000);
        const id = await db.todos.put({ ...optimistic });
        return self.actions.produce((model) => {
          const index = self.model.tasks.findIndex(
            (task) => task.summary === optimistic.summary,
          );

          if (~index) model.tasks[index].id = id;
        });
      });

      return self.actions.produce((draft) => {
        draft.task = null;
        draft.tasks = [
          ...self.model.tasks,
          self.actions.placeholder(optimistic, State.Adding),
        ];
      });
    },

    *[Events.Completed](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(4_000);

        const task = await db.todos.get(taskId);
        await db.todos.update(taskId, { completed: !task?.completed });
        const final = await db.todos.get(taskId);

        return self.actions.produce((draft) => {
          const index = self.model.tasks.findIndex(
            (task) => task.id === taskId,
          );

          if (~index && final) {
            draft.tasks[index] = final;
          }
        });
      });

      return self.actions.produce((draft) => {
        const index = self.model.tasks.findIndex((task) => task.id === taskId);

        if (~index) {
          const model = self.model.tasks[index];
          draft.tasks[index] = self.actions.placeholder(
            { ...model, completed: !model.completed },
            State.Updating,
          );
        }
      });
    },

    *[Events.Remove](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(6_000);
        await db.todos.delete(taskId);

        return self.actions.produce((draft) => {
          const index = self.model.tasks.findIndex(
            (task) => task.id === taskId,
          );
          draft.tasks = [
            ...self.model.tasks.slice(0, index),
            ...self.model.tasks.slice(index + 1),
          ];
        });
      });

      return self.actions.produce((draft) => {
        const index = self.model.tasks.findIndex((task) => task.id === taskId);

        if (~index) {
          draft.tasks[index] = self.actions.placeholder(
            self.model.tasks[index],
            State.Removing,
          );
        }
      });
    },
  };
});
