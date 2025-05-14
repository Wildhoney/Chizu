import { Lifecycle, State, create, utils } from "../../library/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    async *[Lifecycle.Mount]() {
      yield self.actions.produce((draft) => {
        draft.tasks = self.actions.state([], [State.Op.Replace]);
      });

      await utils.sleep(1_000);
      const tasks = await db.todos.toArray();

      return self.actions.produce((draft) => {
        draft.tasks = tasks;
      });
    },

    async *[Events.Task](task) {
      return self.actions.produce((draft) => {
        draft.task = task;
      });
    },

    async *[Events.Add]() {
      const task: Task = {
        id: utils.pk(),
        summary: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      yield self.actions.produce((draft) => {
        draft.task = null;
        draft.tasks.push(self.actions.state(task, [State.Op.Add]));
      });

      await utils.sleep(10_000);

      const pk = await db.todos.put({ ...task, id: undefined });
      const index = self.model.tasks.findIndex((task) => task.id === task.id);

      return self.actions.produce((draft) => {
        draft.tasks[index] = { ...task, id: pk };
      });
    },

    async *[Events.Completed](taskId) {
      const index = self.model.tasks.findIndex((task) => task.id === taskId);

      yield self.actions.produce((draft) => {
        const task = self.model.tasks[index];
        draft.tasks[index] = { ...task, completed: !task.completed };
      });

      await utils.sleep(10_000);

      const task = await db.todos.get(taskId);
      await db.todos.update(taskId, {
        completed: !task?.completed,
      });
      const row = await db.todos.get(taskId);

      return self.actions.produce((draft) => {
        if (row) draft.tasks[index] = row;
      });
    },

    async *[Events.Remove](taskId) {
      const index = self.model.tasks.findIndex((task) => task.id === taskId);

      yield self.actions.produce((draft) => {
        const task = self.model.tasks[index];
        draft.tasks[index] = self.actions.state(task, [State.Op.Remove]);
      });

      await utils.sleep(10_000);

      await db.todos.delete(taskId);

      return self.actions.produce((draft) => {
        draft.tasks.splice(index, 1);
      });
    },
  };
});
