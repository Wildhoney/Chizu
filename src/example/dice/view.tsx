import { create } from "../../library/index.ts";
import { Actions, Events, Model } from "./types.ts";
import { Routes } from "../types.ts";

export default create.view<Model, Actions, Routes>((self) => {
  return (
    <section>
      <p>
        You rolled a <strong>{self.model.kite}</strong>
      </p>

      <button onClick={(): void => self.actions.dispatch([Events.Roll])}>
        Roll again
      </button>
    </section>
  );
});
