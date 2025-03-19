import { create } from "../../library/index.ts";
import {
  ArrayPlaceholder,
  ObjectPlaceholder,
} from "../../library/utils/placeholder/utils.ts";
import { Events, Module } from "./types.ts";

export default create.view<Module>((self) => {
  console.log(self.model, "raw");

  return (
    <section>
      <h1>Todo app</h1>

      <input
        type="text"
        value={self.model.task ?? ""}
        onChange={(event) =>
          self.actions.dispatch([Events.Task, event.currentTarget.value])
        }
      />

      {self.model.tasks instanceof ArrayPlaceholder && "Loading tasks&hellip;"}

      <button
        disabled={!self.model.task}
        onClick={() => self.actions.dispatch([Events.Add])}
      >
        Add task
        {/* {self.validate.tasks.is(State.Adding) ? (
          <>Adding task&hellip;</>
        ) : (
          "Add task"
        )} */}
      </button>

      {self.model.tasks.length === 0 ? (
        <p>
          No tasks
          {/* {self.validate.tasks.is(State.Pending) ? (
            <>Please wait&hellip;</>
          ) : (
            "You have no tasks yet."
          )} */}
        </p>
      ) : (
        <ol>
          {self.model.tasks.map((task, index) => (
            <li key={task.id}>
              <input
                // disabled={self.validate.task.is(State.Pending) || !task.id}
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  task.id && self.actions.dispatch([Events.Completed, task.id])
                }
              />
              {task instanceof ObjectPlaceholder ? "Yes" : "No"} -
              <span
              // style={{
              //   fontStyle: self.validate.tasks[index].is(State.Adding)
              //     ? "italic"
              //     : "",
              // }}
              >
                {task.id} {task.summary} {task.completed ? "✅" : ""}
                {/* {self.validate.tasks[index].is(State.Updating) && <>&hellip;</>} */}
              </span>
              <button
                // disabled={
                //   self.validate.tasks[index].is(State.Removing) || !task.id
                // }
                onClick={() =>
                  task.id && self.actions.dispatch([Events.Remove, task.id])
                }
              >
                Remove
                {/* {self.validate.tasks[index].is(State.Removing) ? (
                  <>Removing&hellip;</>
                ) : (
                  "Remove"
                )} */}
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
});
