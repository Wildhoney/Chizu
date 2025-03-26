import { create } from "../../library/index.ts";
import Field from "./components/form/index.tsx";
import List from "./components/list/index.tsx";
import { Container, Enclosure } from "./styles.ts";
import { Module } from "./types.ts";

export default create.view<Module>((self) => {
  return (
    <Container>
      <Enclosure>
        <Field self={self} />
        <List self={self} />
      </Enclosure>
    </Container>
  );
});
