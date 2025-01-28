import { create, State } from "../../library/index.ts";
import { Actions, Events, Model } from "./types.ts";
import { Routes } from "../types.ts";

export default create.view<Model, Actions, Routes>((self) => {
  return (
    <section>
      <h1>
        Hey{" "}
        <span
        // aria-busy={self.actions.validate(
        //   (model) => model.name === State.Pending,
        // )}
        >
          {self.model.name}
        </span>
        !
      </h1>

      <button
        disabled={self.actions.validate((model) =>
          Boolean(model.name & State.Pending),
        )}
        // aria-busy={self.actions.validate((model) =>
        //   Boolean(model.name & State.Pending),
        // )}
        onClick={() => self.actions.dispatch([Events.ChangeProfile])}
      >
        Change profile
      </button>
    </section>
  );
});
