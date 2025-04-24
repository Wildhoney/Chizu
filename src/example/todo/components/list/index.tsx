import { State, utils } from "../../../../library/index.ts";
import { Events } from "../../types";
import * as styles from "./styles.ts";
import { Props } from "./types.ts";
import dayjs from "dayjs";
import { LoaderPinwheel, Trash2 } from "lucide-react";
import { ReactElement } from "react";

export default function List({ self }: Props): ReactElement {
  return (
    <ul className={styles.container}>
      {self.model.tasks.length === 0 && (
        <div className={styles.empty}>
          {self.validate.tasks.is(State.Pending) ? (
            <>Please wait&hellip;</>
          ) : (
            "You have no tasks yet."
          )}
        </div>
      )}

      {self.model.tasks.map((task, index) => (
        <li key={String(task.id)} className={styles.row}>
          <div
            className={styles.details(
              self.validate.tasks[index].completed.is(State.Pending),
            )}
          >
            <input
              id={String(task.id)}
              disabled={
                !utils.pk(task.id) ||
                self.validate.tasks[index].completed.is(State.Pending)
              }
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                task.id && self.actions.dispatch([Events.Completed, task.id])
              }
            />

            <label htmlFor={String(task.id)} className={styles.task}>
              <div className={styles.details(task.completed)}>
                {task.summary}
              </div>

              <div className={styles.date}>
                Added: {dayjs(task.date.toString()).format("DD/MM/YYYY")}
              </div>
            </label>
          </div>

          <button
            className={styles.button}
            disabled={
              !utils.pk(task.id) ||
              self.validate.tasks[index].is(State.Removing)
            }
            onClick={() =>
              task.id && self.actions.dispatch([Events.Remove, task.id])
            }
          >
            {self.validate.tasks[index].is(State.Removing) ? (
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
