import { Operation, utils } from "../../../../library/index.ts";
import { Events } from "../../types.ts";
import * as styles from "./styles.ts";
import { Props } from "./types.ts";
import dayjs from "dayjs";
import { LoaderPinwheel, Trash2 } from "lucide-react";
import { ReactElement } from "react";

export default function List({ self }: Props): ReactElement {
  if (self.model.tasks.length === 0) {
    return (
      <div className={styles.empty}>
        {self.validate.tasks.is(Operation.Replace) ? (
          <>Please wait&hellip;</>
        ) : (
          "You have no tasks yet."
        )}
      </div>
    );
  }

  return (
    <ul className={styles.container}>
      {self.model.tasks.map((task, index) => (
        <li key={String(task.id)} className={styles.row}>
          <input
            id={String(task.id)}
            disabled={
              !utils.pk(task.id) ||
              self.validate.tasks[index].completed.is(Operation.Add)
            }
            type="checkbox"
            checked={task.completed}
            onChange={() =>
              task.id && self.actions.dispatch([Events.Completed, task.id])
            }
          />

          <label htmlFor={String(task.id)} className={styles.task}>
            <div
              className={styles.details(
                self.validate.tasks[index].is(Operation.Add),
              )}
            >
              {task.summary}
            </div>

            <div className={styles.date}>
              Added: {dayjs(task.date.toString()).format("DD/MM/YYYY")}
            </div>
          </label>

          <button
            className={styles.button}
            disabled={
              !utils.pk(task.id) ||
              self.validate.tasks[index].is(Operation.Remove)
            }
            onClick={() =>
              task.id && self.actions.dispatch([Events.Remove, task.id])
            }
          >
            {self.validate.tasks[index].is(Operation.Remove) ? (
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
