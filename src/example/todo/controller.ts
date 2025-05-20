import { Controller, Lifecycle, State, utils } from "../../library/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default (function Controller(module) {
  const db = new Db();

  return {
    async *[Lifecycle.Mount]() {
      Draft: {
        yield module.actions.produce((draft) => {
          draft.tasks = module.actions.annotate([], [State.Op.Replace]);
        });
      }

      await utils.sleep(1_000);

      Read: {
        const tasks = await db.todos.toArray();

        return module.actions.produce((draft) => {
          draft.tasks = tasks;
        });
      }
    },

    async *[Events.Task](task) {
      return module.actions.produce((draft) => {
        draft.task = task;
      });
    },

    async *[Events.Add]() {
      const id = utils.pk();
      const task: Task = {
        id,
        summary: String(module.model.task),
        date: new Date(),
        completed: false,
      };

      Draft: {
        yield module.actions.produce((draft) => {
          draft.task = null;
          draft.tasks.push(module.actions.annotate(task, [State.Op.Add]));
        });
      }

      await utils.sleep(3_000);

      Create: {
        const pk = await db.todos.put({ ...task, id: undefined });
        const index = module.model.tasks.findIndex((task) => task.id === id);

        return module.actions.produce((draft) => {
          draft.tasks[index] = { ...task, id: pk };
        });
      }
    },

    async *[Events.Completed](taskId) {
      Draft: {
        yield module.actions.produce((draft) => {
          const index = module.model.tasks.findIndex(
            (task) => task.id === taskId,
          );
          const task = module.model.tasks[index];
          draft.tasks[index] = { ...task, completed: !task.completed };
        });
      }

      await utils.sleep(10_000);

      Update: {
        const task = await db.todos.get(taskId);
        await db.todos.update(taskId, {
          completed: !task?.completed,
        });
        const row = await db.todos.get(taskId);

        return module.actions.produce((draft) => {
          const index = module.model.tasks.findIndex(
            (task) => task.id === taskId,
          );
          if (row) draft.tasks[index] = row;
        });
      }
    },

    async *[Events.Remove](taskId) {
      Draft: {
        yield module.actions.produce((draft) => {
          const index = module.model.tasks.findIndex(
            (task) => task.id === taskId,
          );
          const task = module.model.tasks[index];
          draft.tasks[index] = module.actions.annotate(task, [State.Op.Remove]);
        });
      }

      await utils.sleep(10_000);

      Delete: {
        await db.todos.delete(taskId);

        return module.actions.produce((draft) => {
          const index = module.model.tasks.findIndex(
            (task) => task.id === taskId,
          );
          draft.tasks.splice(index, 1);
        });
      }
    },
  };
} as Controller<Module>);
