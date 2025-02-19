import { create } from "../../library/index.ts";
import Dice from "../dice/index.ts";
import GithubFollowers from "../github-followers/index.ts";
import { DistributedEvents } from "../types.ts";
import { Events, Module } from "./types.ts";

export default create.view<Module>((self) => {
  return (
    <section>
      <h1>Todo app</h1>

      <input
        type="text"
        value={self.model.task ?? ""}
        onChange={(event) => self.actions.dispatch([Events.Task, event.currentTarget.value])}
      />

      <button disabled={!self.model.task} onClick={() => self.actions.dispatch([Events.Add])}>
        Add task
      </button>

      {/* <Dice taskCount={String(self.model.tasks.length)} initialKite="6" /> */}

      <GithubFollowers />

      <button onClick={(): void => self.actions.dispatch([DistributedEvents.Reset])}>Reset</button>

      {self.model.tasks.length === 0 ? (
        <p>You have no tasks yet.</p>
      ) : (
        <ol>
          {self.model.tasks.map((task) => (
            <li key={task.id}>
              {task.id}{" "}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => self.actions.dispatch([Events.Completed, task.id])}
              />
              {task.task} {task.completed ? "✅" : ""}
              <button onClick={() => self.actions.dispatch([Events.Remove, task.id])}>Remove</button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
});
