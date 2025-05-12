import { Operation } from "../../../../library/index.ts";
import { Events } from "../../types.ts";
import * as styles from "./styles.ts";
import { Props } from "./types.ts";
import { Trash2 } from "lucide-react";
import { ReactElement } from "react";

export default function List({ self }: Props): ReactElement {
  if (self.validate.tasks.is(Operation.Add)) {
    return <>Loading&hellip;</>;
  }

  return (
    <ul className={styles.container}>
      {self.model.tasks.map((task) => (
        <li key={String(task.id)}>
          <input
            id={String(task.id)}
            // disabled={
            //   !utils.pk(task.id) ||
            //   self.validate.tasks[index].completed.is(State.Pending)
            // }
            type="checkbox"
            checked={task.completed}
            onChange={() =>
              task.id && self.actions.dispatch([Events.Completed, task.id])
            }
          />

          <label htmlFor={String(task.id)} className={styles.task}>
            <div className={styles.details(task.completed)}>{task.summary}</div>

            {/* <div className={styles.date}>
                Added: {dayjs(task.date.toString()).format("DD/MM/YYYY")}
              </div> */}
          </label>

          <button
            className={styles.button}
            // disabled={
            //   !utils.pk(task.id) ||
            //   self.validate.tasks[index].is(State.Removing)
            // }
            onClick={() =>
              task.id && self.actions.dispatch([Events.Remove, task.id])
            }
          >
            {/* {self.validate.tasks[index].is(State.Removing) ? (
              <LoaderPinwheel size={20} />
            ) : ( */}
            <Trash2 size={20} />
            {/* )} */}
          </button>
        </li>
      ))}
    </ul>
  );
}
