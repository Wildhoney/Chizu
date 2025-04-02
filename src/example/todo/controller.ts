import { Lifecycle, State, create, utils } from "../../library/index.ts";
import { pk } from "../../library/utils/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    *[Lifecycle.Mount]() {
      yield self.actions.io(async () => {
        await utils.sleep(1_000);

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
      const id = pk();

      const task: Task = {
        id,
        summary: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      yield self.actions.io(async () => {
        await utils.sleep(1_000);

        const id = await db.todos.put({ ...task, id: undefined });

        return self.actions.produce((model) => {
          const index = self.model.tasks.findIndex(({ id }) => id === task.id);
          if (~index) model.tasks[index].id = id;
        });
      });

      return self.actions.produce((draft) => {
        draft.task = null;
        draft.tasks = self.actions.placeholder(draft.tasks, State.Updating);
        draft.tasks.push(self.actions.placeholder(task, State.Adding));
      });
    },

    *[Events.Completed](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(1_000);

        const task = await db.todos.get(taskId);
        await db.todos.update(taskId, { completed: !task?.completed });
        const row = await db.todos.get(taskId);

        return self.actions.produce((draft) => {
          const index = self.model.tasks.findIndex(({ id }) => id === taskId);
          if (~index && row) draft.tasks[index].completed = row.completed;
        });
      });

      return self.actions.produce((draft) => {
        const index = self.model.tasks.findIndex((task) => task.id === taskId);

        if (~index) {
          const model = self.model.tasks[index];
          draft.tasks[index].completed = self.actions.placeholder(
            !model.completed,
            State.Updating,
          );
        }
      });
    },

    *[Events.Remove](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(1_000);

        await db.todos.delete(taskId);

        return self.actions.produce((draft) => {
          const index = self.model.tasks.findIndex(({ id }) => id === taskId);
          if (~index) draft.tasks.splice(index, 1);
        });
      });

      return self.actions.produce((draft) => {
        const index = self.model.tasks.findIndex((task) => task.id === taskId);

        if (~index)
          draft.tasks[index] = self.actions.placeholder(
            self.model.tasks[index],
            State.Removing,
          );
      });
    },
  };
});
