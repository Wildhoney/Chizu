import { create } from "../../library/index.ts";
import Name from "../name/index.ts";
import Field from "./components/form/index.tsx";
import List from "./components/list/index.tsx";
import * as styles from "./styles.ts";
import { Module } from "./types.ts";

export default create.view<Module>((self) => {
  return (
    <>
      <Name model={{ name: "Adam" }} onClick={console.log} />

      <section className={styles.container}>
        <div className={styles.boundary}>
          <Field self={self} />
          <List self={self} />
        </div>
      </section>
    </>
  );
});
