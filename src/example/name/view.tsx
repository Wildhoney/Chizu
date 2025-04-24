import { create } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

export default create.view<Module>((self) => {
  return (
    <>
      <h1 onClick={self.events.onClick}>Hey {self.model.name}!</h1>
      <h2>Valid name: {self.model.isValid ? "Yes" : "No"}</h2>

      {self.model.name && (
        <input
          name="person"
          type="text"
          value={self.model.name}
          onChange={(event) =>
            self.actions.dispatch([Events.UpdateName, event])
          }
        />
      )}
    </>
  );
});
