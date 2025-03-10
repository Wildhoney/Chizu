import { Lifecycle, Maybe, create, utils } from "../../library/index.ts";
import { Phase } from "../../library/types/index.ts";
import { Events, Module, Task } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    *[Lifecycle.Mount]() {
      const tasks: Maybe<Task[]> = yield self.actions.io(async () => {
        // await utils.sleep(1_000);
        return db.todos.toArray();
      });

      return self.actions.produce((draft) => {
        draft.tasks = tasks.otherwise([]);
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
        task: String(self.model.task),
        date: new Date(),
        completed: false,
      };

      const persisted: Maybe<Task> = yield self.actions.io(async () => {
        if (!self.model.task) return;
        await utils.sleep(4_000);
        await db.todos.put(optimistic);
        return optimistic;
      });

      return self.actions.produce((draft, phase) => {
        switch (phase) {
          case Phase.Discovery:
            draft.task = null;
            draft.tasks = [...draft.tasks, optimistic];
            break;

          case Phase.Persist:
            const task = self.model.tasks.findIndex(
              (task) =>
                persisted.map(({ task }) => task).otherwise("") === task.task,
            );
            if (task !== -1)
              draft.tasks[task] = persisted.otherwise(optimistic);
            break;
        }
      });
    },

    *[Events.Completed](taskId) {
      const task: Maybe<Task> = yield self.actions.io(async () => {
        const task = await db.todos.get(taskId);

        if (!task) {
          return Maybe.Fault(new Error("Task not found"));
        }

        await utils.sleep(1_000);
        await db.todos.update(taskId, { completed: !task.completed });
        return task;
      });

      return self.actions.produce((draft, phase) => {
        switch (phase) {
          case Phase.Discovery:
            const id = task.map(({ id }) => id).otherwise(taskId);
            const index = draft.tasks.findIndex((task) => task.id === id);
            const model = draft.tasks[index];

            if (index !== -1)
              draft.tasks[index] = { ...model, completed: !model.completed };
        }
      });
    },

    *[Events.Remove](taskId) {
      const task: Maybe<Task> = yield self.actions.io(async () => {
        const task = await db.todos.get(taskId);
        await db.todos.delete(taskId);
        // await utils.sleep(1_000);
        return task;
      });

      return self.actions.produce((draft) => {
        const id = task.map(({ id }) => id).otherwise(taskId);
        draft.tasks = draft.tasks.filter((task) => task.id !== id);
      });
    },
  };
});
