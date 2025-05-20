import { View } from "../../library/index.ts";
import Field from "./components/form/index.tsx";
import List from "./components/list/index.tsx";
import * as styles from "./styles.ts";
import { Module } from "./types.ts";

export default (function Todo(module) {
  return (
    <>
      <section className={styles.container}>
        <div className={styles.boundary}>
          <Field module={module} />
          <List module={module} />
        </div>
      </section>
    </>
  );
} as View<Module>);
