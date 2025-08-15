import useActions, { Actions } from "./actions.ts";
import { Model } from "./types.ts";
import { UseActions } from "../../library/index.ts";
import * as styles from "./styles.ts";
import * as React from "react";

export default function Counter(): React.ReactElement {
  const [model, actions] = useActions() as UseActions<Model, typeof Actions>;

  return (
    <section className={styles.container}>
      <button onClick={() => actions.dispatch(Actions.Decrement)}>
        Decrement
      </button>

      <h1>{model.count}</h1>

      <button onClick={() => actions.dispatch(Actions.Increment)}>
        Increment
      </button>
    </section>
  );
}
