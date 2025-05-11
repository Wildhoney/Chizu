import { Operation } from "../../../../library/index.ts";
import * as styles from "./styles.ts";
import { Props } from "./types.ts";
import { ReactElement } from "react";

export default function List({ self }: Props): ReactElement {
  if (self.validate.tasks.is(Operation.Add)) {
    return <>Loading&hellip;</>;
  }

  return (
    <ul className={styles.container}>
      {self.model.tasks.map((task) => (
        <li key={String(task.id)}>
          <label htmlFor={String(task.id)} className={styles.task}>
            <div className={styles.details(task.completed)}>{task.summary}</div>

            {/* <div className={styles.date}>
                Added: {dayjs(task.date.toString()).format("DD/MM/YYYY")}
              </div> */}
          </label>
        </li>
      ))}
    </ul>
  );
}
