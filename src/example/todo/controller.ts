import { Lifecycle, Maybe, create, utils } from "../../library/index.ts";
import { Events, Module } from "./types.ts";
import { Db } from "./utils.ts";

export default create.controller<Module>((self) => {
  const db = new Db();

  return {
    *[Lifecycle.Mount]() {
      yield self.actions.io(async () => {
        await utils.sleep(1_000);

        const tasks = await db.todos.toArray();
        return self.actions.produce((draft) => {
          draft.tasks = Maybe.Ok(tasks);
        });
      });

      return self.actions.produce((draft) => {
        draft.tasks = Maybe.Loading([]);
      });
    },

    *[Events.Task](task) {
      return self.actions.produce((draft) => {
        draft.task = task;
      });
    },

    // *[Events.Add]() {
    //   const id = utils.pk();

    //   const draftTask: Task = {
    //     id: Maybe.Loading(id),
    //     summary: String(self.model.task),
    //     date: new Date(),
    //     completed: Maybe.Loading(false),
    //   };

    //   yield self.actions.io(async () => {
    //     await utils.sleep(1_000);

    //     const id = await db.todos.put({ ...draftTask, id: Maybe.None() });

    //     return self.actions.produce((draft) => {
    //       const index = self.model.tasks
    //         .map((task) =>
    //           task.findIndex((task) =>
    //             task.map((task) => task.id === draftTask.id),
    //           ),
    //         )
    //         .otherwise(-1);
    //       if (~index) draft.tasks[index].id = id;
    //     });
    //   });

    //   return self.actions.produce((draft) => {
    //     const tasks = self.model.tasks.otherwise([]);
    //     draft.task = null;
    //     draft.tasks = Maybe.Loading([...tasks, draftTask]);
    //   });
    // },

    // *[Events.Completed](taskId) {
    //   yield self.actions.io(async () => {
    //     await utils.sleep(1_000);

    //     const task = await db.todos.get(taskId);
    //     await db.todos.update(taskId, {
    //       completed: Maybe.Ok(!task?.completed),
    //     });
    //     const row = await db.todos.get(taskId);

    //     return self.actions.produce((draft) => {
    //       const tasks = draft.tasks.otherwise([]);
    //       const index = tasks.findIndex(({ id }) => id.otherwise(0) === taskId);
    //       if (~index && row) tasks[index].completed = row.completed;
    //     });
    //   });

    //   return self.actions.produce((draft) => {
    //     const tasks = draft.tasks.otherwise([]);
    //     const index = tasks.findIndex(
    //       (task) => task.id.otherwise(0) === taskId,
    //     );

    //     if (~index) {
    //       const tasks = draft.tasks.otherwise([]);
    //       tasks[index].completed = Maybe.Loading(
    //         !tasks[index].completed,
    //         State.Update,
    //       );
    //     }
    //   });
    // },

    // *[Events.Remove](taskId) {
    //   yield self.actions.io(async () => {
    //     await utils.sleep(1_000);
    //     await db.todos.delete(taskId);

    //     return self.actions.produce((draft) => {
    //       const index = self.model.tasks
    //         .map((task) =>
    //           task.findIndex((task) =>
    //             task.map((task) => task.id.map((id) => id === taskId)),
    //           ),
    //         )
    //         .otherwise(-1);
    //       if (~index) draft.tasks.splice(index, 1);
    //     });
    //   });

    //   return self.actions.produce((draft) => {
    //     const tasks = self.model.tasks.otherwise([]);
    //     const index = self.model.tasks
    //       .map((task) =>
    //         task.findIndex((task) =>
    //           task.map((task) => task.id.map((id) => id === taskId)),
    //         ),
    //       )
    //       .otherwise(-1);
    //     const task = tasks[index];

    //     if (~index) draft.tasks[index] = Maybe.Loading(task, State.Remove);
    //   });
    // },
  };
});
