import { describe, expect, it } from "@jest/globals";
import { create, render } from ".";
import { decorate } from "../model";
import { dispatch } from "../dispatcher";
// import { ƒ } from "../operations";

describe("view", () => {
  describe("render()", () => {
    it("transforms the tree into valid html", () => {
      const container = document.createElement("section");
      const fragment = render(view());
      container.append(fragment);

      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<h1><span>Hello</span><strong>Adam</strong></h1>"`,
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
          `"<h1 locale="en-GB">Adam</h1>"`,
        );

        dispatch({ op: "replace", path: ["locale"], value: "fr-FR" });
        expect(container.innerHTML).toMatchInlineSnapshot(
          `"<h1 locale="fr-FR">Adam</h1>"`,
        );
      });

      it("dispatches removals to node attributes", () => {
        const container = document.createElement("section");
        const fragment = render(["h1", { locale: model.locale }, "Adam"]);
        container.append(fragment);

        expect(container.innerHTML).toMatchInlineSnapshot(
          `"<h1 locale="en-GB">Adam</h1>"`,
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

const model = decorate<Model>({
  name: "Adam",
  locale: "en-GB",
  friends: [],
});

export const view = create("x-person", () => {
  return [
    "h1",
    {},
    [
      ["span", {}, "Hello"],
      ["strong", {}, model.name],
      // [ƒ.is(model.name, "Adam", ["em", {}, "👋"])],
      // [ƒ.map(model.friends, (friend) => ["p", {}, friend.name])],
    ],
  ];
});
