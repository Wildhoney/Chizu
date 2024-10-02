import { element, render } from ".";
import { actions, Dispatch } from "../controller";
import { dispatch } from "../dispatcher";
import { decorate } from "../model";
import { ƒ } from "../operations";
import { describe, expect, it } from "@jest/globals";
import { produce } from "immer";

describe("view", () => {
  describe("render()", () => {
    it("transforms the tree into valid html", () => {
      const container = document.createElement("section");
      const fragment = render(view);
      container.append(fragment);

      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<h1><span>Hello</span><strong>Adam</strong></h1>"`
      );
    });

    describe("text", () => {
      it("dispatches updates to text nodes", () => {
        const container = document.createElement("section");
        const fragment = render(["h1", {}, model.name]);
        container.append(fragment);

        expect(container.innerHTML).toMatchInlineSnapshot(`"<h1>Adam</h1>"`);

        dispatch({ op: "replace", path: ["name"], value: "Maria" });
        expect(container.innerHTML).toMatchInlineSnapshot(`"<h1>Maria</h1>"`);
      });

      it("dispatches removals to text nodes", () => {
        const container = document.createElement("section");
        const fragment = render(["h1", {}, model.name]);
        container.append(fragment);

        expect(container.innerHTML).toMatchInlineSnapshot(`"<h1>Adam</h1>"`);

        dispatch({ op: "remove", path: ["name"] });
        expect(container.innerHTML).toMatchInlineSnapshot(`"<h1></h1>"`);
      });
    });

    describe("attributes", () => {
      it("dispatches updates to node attributes", () => {
        const container = document.createElement("section");
        const fragment = render(["h1", { locale: model.locale }, "Adam"]);
        container.append(fragment);

        expect(container.innerHTML).toMatchInlineSnapshot(
          `"<h1 locale="en-GB">Adam</h1>"`
        );

        dispatch({ op: "replace", path: ["locale"], value: "fr-FR" });
        expect(container.innerHTML).toMatchInlineSnapshot(
          `"<h1 locale="fr-FR">Adam</h1>"`
        );
      });

      it("dispatches removals to node attributes", () => {
        const container = document.createElement("section");
        const fragment = render(["h1", { locale: model.locale }, "Adam"]);
        container.append(fragment);

        expect(container.innerHTML).toMatchInlineSnapshot(
          `"<h1 locale="en-GB">Adam</h1>"`
        );

        dispatch({ op: "remove", path: ["locale"] });
        expect(container.innerHTML).toMatchInlineSnapshot(`"<h1>Adam</h1>"`);
      });
    });
  });
});

type Model = {
  name: string;
  locale: string;
  friends: { name: string }[];
};

const model = create.model<Model>({
  name: "Adam",
  locale: "en-GB",
  friends: [],
});

const enum Events {
  UpdateName
}

const controller = create.controller`person`(model, ({ app, use }) => ({
  [Events.UpdateName](name: string) {
    return use.produce(Dispatch.Unicast, (state) => {
      state.name = name;
    });
  },
}));

export const view = create.view`x-person`(({ model, use }) => {
return (
    <h1>
      <span>Hello</span>

      <strong onClick={() => use.dispatch(Events.UpdateName, "Adam")}>
        {model.name}
      </strong>
    </h1>
  );
});
