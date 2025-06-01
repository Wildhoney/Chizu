import { Channel, Tree } from "../../library/index.ts";
import actions from "./actions.ts";
import Field from "./components/form/index.tsx";
import List from "./components/list/index.tsx";
import model from "./model.ts";
import * as styles from "./styles.ts";
import { Events, Module } from "./types.ts";
import * as React from "react";

export default function Todo(): React.ReactElement {
  return (
    <Tree<Module> using={{ model, actions }}>
      {(module) => (
        <section className={styles.container}>
          {module.channel.is(Channel.Error) && (
            <div>
              Error!{" "}
              <button onClick={() => module.actions.dispatch([Events.Recover])}>
                Retry
              </button>
            </div>
          )}

          {module.channel.is(Channel.Default) && (
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
