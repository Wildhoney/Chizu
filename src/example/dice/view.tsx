import { create } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

export default create.view<Module>((self) => {
  return (
    <section>
      <p>
        You rolled a <strong>{self.model.kite}</strong>
      </p>

      <button onClick={(): void => self.actions.dispatch([Events.Roll])}>Roll again</button>
    </section>
  );
});
