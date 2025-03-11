import { Lifecycle, create, utils } from "../../library/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    *[Lifecycle.Mount]() {
      yield self.actions.io(async () => {
        const tasks = await db.todos.toArray();

        return self.actions.produce((draft) => {
          draft.tasks = tasks;
        });
      });

      return self.actions.produce((draft) => {
        draft.tasks = [];
      });
    },

    *[Events.Task](task) {
      return self.actions.produce((draft) => {
        draft.task = task;
      });
    },

    *[Events.Add]() {
      const draft: Task = {
        id: undefined,
        task: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      yield self.actions.io(async () => {
        await utils.sleep(4_000);

        const final = await db.todos.put(draft);

        return self.actions.produce((model) => {
          const index = self.model.tasks.findIndex(
            (task) => task.task === draft.task,
          );
          model.tasks[index].id = final;
        });
      });

      return self.actions.produce((model) => {
        model.task = null;
        model.tasks = [...model.tasks, draft];
      });
    },

    *[Events.Completed](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(1_000);

        const task = await db.todos.get(taskId);
        await db.todos.update(taskId, { completed: !task.completed });
        const final = await db.todos.get(taskId);

        return self.actions.produce((draft) => {
          const index = draft.tasks.findIndex((task) => task.id === taskId);
          draft.tasks[index] = final;
        });
      });

      return self.actions.produce((draft) => {
        const index = draft.tasks.findIndex((task) => task.id === taskId);

        if (~index) {
          const model = draft.tasks[index];
          draft.tasks[index] = { ...model, completed: !model.completed };
        }
      });
    },

    *[Events.Remove](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(2_000);
        await db.todos.delete(taskId);
      });

      return self.actions.produce((draft) => {
        draft.tasks = draft.tasks.filter((task) => task.id !== taskId);
      });
    },
  };
});
