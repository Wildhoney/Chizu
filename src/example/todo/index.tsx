import { Tree } from "../../library/index.ts";
import actions from "./actions.ts";
import Field from "./components/form/index.tsx";
import List from "./components/list/index.tsx";
import model from "./model.ts";
import * as styles from "./styles.ts";
import { Module } from "./types.ts";
import * as React from "react";

export default function Todo(): React.ReactElement {
  return (
    <Tree<Module> using={{ model, actions }}>
      {(module) => (
        <section className={styles.container}>
          {module.error && (
            <>
              Hmm!
              <button onClick={module.actions.retry}>Retry&hellip;</button>
              <button onClick={module.actions.remount}>Remount&hellip;</button>
            </>
          )}

          {!module.error && (
            <div className={styles.boundary}>
              <Field module={module} />
              <List module={module} />
            </div>
          )}
        </section>
      )}
    </Tree>
  );
}
