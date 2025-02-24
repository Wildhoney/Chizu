import { Lifecycle, Maybe, create } from "../../library/index.ts";
import { Events, Module, Task, TaskWithoutId } from "./types.ts";
import { TodosDb } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new TodosDb();

  return {
    *[Lifecycle.Mount]() {
      const tasks: Maybe<Task[]> = yield self.actions.io(async () => {
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
      const task: Maybe<Task> = yield self.actions.io(async () => {
        const task: TaskWithoutId = {
          task: self.model.task as string,
          date: new Date(),
          completed: false,
        };

        await db.todos.put(task);
        return task;
      });

      return self.actions.produce((draft) => {
        draft.task = null;
        task.invoke((task) => draft.tasks.push(task));
      });
    },

    *[Events.Completed](id) {
      const task: Maybe<Task> = yield self.actions.io(async () => {
        const task = await db.todos.get(id);

        if (!task) {
          return Maybe.Fault(new Error("Task not found"));
        }

        await db.todos.update(id, { completed: !task.completed });
        return task;
      });

      return self.actions.produce((draft) => {
        const pk = task.map(({ id }) => id).otherwise(id);
        const index = draft.tasks.findIndex(({ id }) => pk === id);
        const model = draft.tasks[index];

        if (index !== -1) {
          draft.tasks[index] = { ...model, completed: !model.completed };
        }
      });
    },

    *[Events.Remove](id) {
      const task: Maybe<Task> = yield self.actions.io(async () => {
        const task = await db.todos.get(id);
        await db.todos.delete(id);
        return task;
      });

      return self.actions.produce((draft) => {
        task.invoke((task) => {
          draft.tasks = draft.tasks.filter(({ id }) => task.id !== id);
        });
      });
    },
  };
});
