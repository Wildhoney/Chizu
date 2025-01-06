import { createElement, h } from "preact";
import { create, State } from "../../library/index.ts";
import { Actions, Events, Model } from "./types.ts";
import { Routes } from "../types.ts";

const React = h;
React.createElement = createElement;

export default create.view<Model, Actions, Routes>`x-person`(
  ({ model, actions }) => {
    return (
      <section>
        <h1>
          Hey {name()}!{/* {model.name} */}
        </h1>

        <button
          disabled={actions.is(model.name, State.Pending)}
          onClick={() => actions.dispatch([Events.UpdateName, "Adam"])}
        >
          {/* {actions.is(model.name, State.Pending) ? "Loading..." : model.name} */}
        </button>
      </section>
    );
  },
);

export function name(): string {
  return "Adam";
}
