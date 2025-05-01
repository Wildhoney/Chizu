import * as styles from "./styles.ts";
import { Props } from "./types.ts";
import { ReactElement } from "react";

export default function List({ self }: Props): ReactElement {
  return (
    <ul className={styles.container}>
      {self.model.tasks
        .map((tasks) => tasks.map((task) => <li key={task.id}>{task.id}</li>))
        .otherwise([])}
    </ul>
  );
}
