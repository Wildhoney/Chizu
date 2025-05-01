import { State } from "../../../../library";
import { Events } from "../../types";
import * as styles from "./styles.ts";
import { Props } from "./types";
import { CirclePlus, LoaderPinwheel } from "lucide-react";
import { ReactElement } from "react";

export default function Form({ self }: Props): ReactElement {
  console.log(self.model.task);

  return (
    <section className={styles.container}>
      <input
        type="text"
        placeholder="What needs to be done?"
        className={styles.input}
        value={self.model.task ?? ""}
        onChange={(event) =>
          self.actions.dispatch([Events.Task, event.currentTarget.value])
        }
      />

      <button
        className={styles.button}
        disabled={!self.model.task}
        onClick={() => self.actions.dispatch([Events.Add])}
      >
        {/* {self.validate.tasks.is(State.Updating) ? (
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
