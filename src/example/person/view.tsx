import { createElement, h } from "preact";
import { create, State } from "../../library/index.ts";
import model from "./model.ts";
import { Actions, Events, Model } from "./types.ts";

const React = h;
React.createElement = createElement;

export default create.view<Model, Actions>`x-person`(
  model,
  ({ model, actions, attrs, inspect }) => {
    return (
      <section>
        <span>Hello</span>

        {/* <h1>{model.name}</h1> */}

        <button
        // disabled={actions.dispatching([Events.UpdateName, "Adam"])}
        // onClick={() => actions.dispatch([Events.UpdateName, "Adam"])}
        >
          {/* {inspect.is(model.name, State.Pending) ? "Loading..." : model.name} */}
        </button>
      </section>
    );
  },
);
