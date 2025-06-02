import { Action } from "../../types";
import * as styles from "./styles.ts";
import { Props } from "./types";
import { CirclePlus } from "lucide-react";
import { ReactElement } from "react";

export default function Form({ module }: Props): ReactElement {
  return (
    <section className={styles.container}>
      <input
        type="text"
        placeholder="What needs to be done?"
        className={styles.input}
        value={module.model.task ?? ""}
        onChange={(event) =>
          module.actions.dispatch([Action.Task, event.currentTarget.value])
        }
      />

      <button
        className={styles.button}
        disabled={!module.model.task}
        onClick={() => module.actions.dispatch([Action.Add])}
      >
        {/* {module.validate.tasks.is(State.Op.Updating) ? (
          <>
            Adding task&hellip; <LoaderPinwheel size={20} />
          </>
        ) : ( */}
        <>
          Add task <CirclePlus size={20} />
        </>
        {/* )} */}
      </button>
    </section>
  );
}
