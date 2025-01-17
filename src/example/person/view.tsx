import { create, State } from "../../library/index.ts";
import { Actions, Events, Model } from "./types.ts";
import { Routes } from "../types.ts";
// import { name } from "./nodes/name.tsx";
// import * as styles from "./styles.module.css";

export default create.view<Model, Actions, Routes>(({ model, actions }) => {
  return (
    <section>
      <h1>Hey {model.name}!</h1>

      {/* <p>
          Your name has always been{" "}
          <span aria-busy={model.name.pending()}>
            {model.name.otherwise("Adam")}
          </span>
          .
        </p> */}

      {/* <img
        src={model.avatar ?? undefined}
        style={{ width: "100px", aspectRatio: "1/1" }}
        alt="avatar"
        aria-busy={actions.validate((model) => model.avatar === State.Pending)}
      /> */}

      <button
        // disabled={model.name.equals(State.Pending)}
        onClick={() => actions.dispatch([Events.ChangeProfile])}
      >
        Change profile
      </button>
    </section>
  );
});
