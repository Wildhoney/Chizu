import { h } from "preact";
import { create, State } from "../../library/index.ts";
import { Actions, Model } from "./types.ts";
import { DistributedEvents, Routes } from "../types.ts";
import { name } from "./nodes/name.tsx";

export default create.view<Model, Actions, Routes>`x-person`(
  ({ model, actions, node }) => {
    console.log(model, actions, node);

    return (
      <section class="container">
        <h1>Hey {name()}!</h1>

        {/* <p>
          Your name has always been{" "}
          <span aria-busy={model.name.pending()}>
            {model.name.otherwise("Adam")}
          </span>
          .
        </p>

        <img
          src={model.avatar}
          alt="avatar"
          aria-busy={model.avatar.pending()}
        />

        <button
          disabled={model.name.equals(State.Pending)}
          onClick={() =>
            actions.dispatch([DistributedEvents.UpdateName, "Adam"])
          }
        >
          Update name
        </button> */}
      </section>
    );
  },
);
