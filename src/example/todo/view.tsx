import { create } from "../../library/index.ts";
import Field from "./components/form/index.tsx";
import List from "./components/list/index.tsx";
import * as styles from "./styles.ts";
import { Module } from "./types.ts";
import { BrowserRouter } from "react-router";

export default create.view<Module>((self) => {
  return (
    <BrowserRouter>
      <section className={styles.container}>
        <div className={styles.boundary}>
          <Field self={self} />
          <List self={self} />
        </div>
      </section>
    </BrowserRouter>
  );
});
