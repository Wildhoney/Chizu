import { create, Transmit } from ".";
import { State } from "./types";

type Model = {
  name: string;
  age: number;
};

const enum Events {
  UpdateName,
  UpdateAge,
  Register,
}

export type Actions = [Events.UpdateName, string] | [Events.UpdateAge, number];

const model = create.model<Model>({
  name: "Adam",
  age: 16,
});

create.controller<Model, Actions>`person`(model, ({ app, use }) => ({
  *[Events.UpdateName](name) {
    const random: string = yield use.io(() => name);

    return use.dispatch(Transmit.Multicast, (draft) => {
      draft.name = random;
    });
  },

  *[Events.UpdateAge](age) {
    return use.dispatch(Transmit.Multicast, (draft) => {
      draft.age = age;
    });
  },
}));

create.view<Model, Actions>`x-person`(model, ({ model, use }) => {
  return (
    <h1>
      <span>Hello</span>

      <strong onClick={() => use.dispatch([Events.UpdateName, "Adam"])}>
        {use.is(model.name, State.Pending) ? "Loading..." : model.name}
      </strong>
    </h1>
  );
});
