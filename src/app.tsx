import { create, Transmit } from ".";
import { State, Reactive } from "./types";

type Model = {
  name: Reactive<string>;
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
    const random: Reactive<string> = yield use.io(() => name);

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

      <h1>{model.name}</h1>

      <strong onClick={() => use.dispatch([Events.UpdateName, "Adam"])}>
        {use.is(model.name, State.Pending) ? "Loading..." : model.name}
      </strong>
    </h1>
  );
});
