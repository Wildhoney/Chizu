import useActions from "./actions.ts";
import { Actions } from "./actions.ts";
import * as styles from "./styles.ts";
import * as React from "react";

export default function Counter(): React.ReactElement {
  const [model, actions] = useActions();

  return (
    <section className={styles.container}>
      <button onClick={() => actions.dispatch(Actions.Decrement)}>
        Decrement
      </button>

      <h1>{model.count}</h1>

      {/* {actions.consume(Actions.Increment, (count) => {
        return <p>{count}</p>
      })} */}

      <button onClick={() => actions.dispatch(Actions.Increment)}>
        Increment
      </button>
    </section>
  );
}
