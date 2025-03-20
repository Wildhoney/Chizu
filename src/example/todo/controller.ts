import { Lifecycle, State, create, utils } from "../../library/index.ts";
import { pk } from "../../library/utils/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    *[Lifecycle.Mount]() {
      yield self.actions.io(async () => {
        // await utils.sleep(1_000);

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

      const optimistic: Task = {
        id,
        summary: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      yield self.actions.io(async () => {
        await utils.sleep(1_000);

        const id = await db.todos.put({ ...optimistic, id: undefined });

        return self.actions.produce((model) => {
          const index = self.model.tasks.findIndex(
            (task) => task.id === optimistic.id,
          );

          if (~index) model.tasks[index].id = id;
        });
      });

      return self.actions.produce((draft) => {
        draft.task = null;
        draft.tasks = self.actions.placeholder(draft.tasks, State.Updating);
        draft.tasks.push(self.actions.placeholder(optimistic, State.Adding));
      });
    },

    *[Events.Completed](taskId) {
      yield self.actions.io(async () => {
        await utils.sleep(1_000);

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
        await utils.sleep(1_000);

        await db.todos.delete(taskId);

        return self.actions.produce((draft) => {
          const index = self.model.tasks.findIndex(
            (task) => task.id === taskId,
          );
          draft.tasks.splice(index, 1);
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
