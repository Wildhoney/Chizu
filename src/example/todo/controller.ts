import { Lifecycle, State, create, utils } from "../../library/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    async *[Lifecycle.Mount]() {
      yield self.actions.produce((draft) => {
        draft.tasks = self.actions.state([], [State.Operation.Replace]);
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
      const optimistic: Task = {
        id: utils.pk(),
        summary: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      yield self.actions.produce((draft) => {
        draft.task = null;
        draft.tasks.push(self.actions.state(optimistic));
      });

      await utils.sleep(10_000);

      const pk = await db.todos.put({ ...optimistic, id: undefined });
      const index = self.model.tasks.findIndex(
        (task) => task.id === optimistic.id,
      );

      return self.actions.produce((draft) => {
        draft.tasks[index] = { ...optimistic, id: pk };
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
        draft.tasks[index] = self.actions.state(task, [State.Operation.Remove]);
      });

      await utils.sleep(10_000);

      await db.todos.delete(taskId);

      return self.actions.produce((draft) => {
        draft.tasks.splice(index, 1);
      });
    },
  };
});
