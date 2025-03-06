import { State, create } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

export default create.view<Module>((self) => {
  return (
    <section style={{ border: "1px solid #000", padding: "10px" }}>
      <button onClick={(): void => self.actions.dispatch([Events.Profile])}>
        Random profile
      </button>

      <p>
        Hey {self.model.username} you have {self.model.followers} followers!
      </p>

      {self.validate.username.is(State.Pending) ? "Loading..." : null}
    </section>
  );
});
