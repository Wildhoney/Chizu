import { describe, expect, it } from "@jest/globals";
import { render } from ".";
import { decorate } from "../model";
import { dispatch } from "../dispatcher";

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

    it("dispatches updates to text nodes", () => {
      const container = document.createElement("section");
      const fragment = render(["h1", {}, model.name]);
      container.append(fragment);

      expect(container.innerHTML).toMatchInlineSnapshot(`"<h1>Adam</h1>"`);

      dispatch("name", "Maria");
      expect(container.innerHTML).toMatchInlineSnapshot(`"<h1>Maria</h1>"`);
    });

    it("dispatches updates to node attributes", () => {
      const container = document.createElement("section");
      const fragment = render(["h1", { locale: model.locale }, "Adam"]);
      container.append(fragment);

      expect(container.innerHTML).toMatchInlineSnapshot(`"<h1 locale="en-GB">Adam</h1>"`);

      dispatch("locale", "fr-FR");
      expect(container.innerHTML).toMatchInlineSnapshot(`"<h1 locale="fr-FR">Adam</h1>"`);
    });
  });
});

const model = decorate({
  name: "Adam",
  locale: "en-GB",
});

export function view() {
  return [
    "h1",
    {},
    [
      ["span", {}, "Hello"],
      ["strong", {}, model.name],
    ],
  ];
}
