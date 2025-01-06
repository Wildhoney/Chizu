import { h } from "preact";
import { create, State } from "../../library/index.ts";
import { Actions, Model } from "./types.ts";
import { DistributedEvents, Routes } from "../types.ts";
import { name } from "./nodes/name.tsx";

export default create.view<Model, Actions, Routes>`x-person`(
  ({ model, actions }) => {
    return (
      <section class="container">
        <h1>
          Hey {name()}!{/* {model.name} */}
        </h1>

        <button
          disabled={actions.is(model.name, State.Pending)}
          onClick={() =>
            actions.dispatch([DistributedEvents.UpdateName, "Adam"])
          }
        >
          {/* {actions.is(model.name, State.Pending) ? "Loading..." : model.name} */}
        </button>
      </section>
    );
  },
);
