import { describe, expect, it } from "@jest/globals";
import { render } from ".";

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
  });
});

export function view() {
  return [
    "h1",
    {},
    [
      ["span", {}, "Hello"],
      ["strong", {}, "Adam"],
    ],
  ];
}
