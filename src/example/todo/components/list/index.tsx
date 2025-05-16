import { State, utils } from "../../../../library/index.ts";
import { Events } from "../../types.ts";
import * as styles from "./styles.ts";
import { Props } from "./types.ts";
import dayjs from "dayjs";
import { LoaderPinwheel, Trash2 } from "lucide-react";
import { ReactElement } from "react";

export default function List({ module }: Props): ReactElement {
  if (module.model.tasks.length === 0) {
    return (
      <div className={styles.empty}>
        {module.validate.tasks.draft() ? (
          <>Please wait&hellip;</>
        ) : (
          "You have no tasks yet."
        )}
      </div>
    );
  }

  return (
    <ul className={styles.container}>
      {module.model.tasks.map((task, index) => (
        <li key={String(task.id)} className={styles.row}>
          <input
            id={String(task.id)}
            disabled={
              !utils.pk(task.id) ||
              module.validate.tasks[index].completed.is(State.Op.Add)
            }
            type="checkbox"
            checked={task.completed}
            onChange={() =>
              task.id && module.actions.dispatch([Events.Completed, task.id])
            }
          />

          <label htmlFor={String(task.id)} className={styles.task}>
            <div
              className={styles.details(
                module.validate.tasks[index].is(State.Op.Add),
              )}
            >
              {task.summary}
              {module.validate.tasks[index].is(State.Op.Remove) &&
                "Removing..."}
            </div>

            <div className={styles.date}>
              Added: {dayjs(task.date.toString()).format("DD/MM/YYYY")}
            </div>
          </label>

          <button
            className={styles.button}
            disabled={
              !utils.pk(task.id) ||
              module.validate.tasks[index].is(State.Op.Remove)
            }
            onClick={() =>
              task.id && module.actions.dispatch([Events.Remove, task.id])
            }
          >
            {module.validate.tasks[index].is(State.Op.Remove) ? (
              <LoaderPinwheel size={20} />
            ) : (
              <Trash2 size={20} />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
