import { createElement, h } from "preact";
import { create, State } from "../../library/index.ts";
import { Actions, Events, Model } from "./types.ts";

const React = h;
React.createElement = createElement;

export default create.view<Model, Actions>`x-person`(({ model, actions }) => {
  return (
    <section>
      <span>Hello</span>

      <h1>
        Hey Adam!
        {/* {model.name} */}
      </h1>

      <button
      // disabled={actions.dispatching([Events.UpdateName, "Adam"])}
      // onClick={() => actions.dispatch([Events.UpdateName, "Adam"])}
      >
        {/* {actions.is(model.name, State.Pending) ? "Loading..." : model.name} */}
      </button>
    </section>
  );
});
