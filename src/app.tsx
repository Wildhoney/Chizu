import { create, Transmit } from ".";

type Model = {
  name: string;
  locale: string;
  friends: { name: string }[];
};

const enum Events {
  UpdateName,
  UpdateAge,
}

export type Actions = [Events.UpdateName, string] | [Events.UpdateAge, number];

const model = create.model<Model>({
  name: "Adam",
  locale: "en-GB",
  friends: [],
});

create.controller<Model, Actions>`person`(model, ({ app, use }) => ({
  [Events.UpdateName](name) {
    return use.produce(Transmit.Unicast, (draft) => {
      draft.name = name;
    });
  },

  [Events.UpdateAge](age) {
    return use.produce(Transmit.Unicast, (draft) => {
      draft.age = age;
    });
  },
}));

create.view<Model, Actions>`x-person`(model, ({ model, use }) => {
  return (
    <h1>
      <span>Hello</span>

      <strong onClick={() => use.dispatch([Events.UpdateName, "Adam"])}>
        {model.name}
      </strong>
    </h1>
  );
});
