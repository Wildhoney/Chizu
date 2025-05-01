import produce from "./index.ts";
import { describe, expect, it } from "@jest/globals";

describe("produce", () => {
  it("should create a proxy object", () => {
    type Model = {
      name: { first: string; last: string };
      spouse: { name: { first: string } };
      children: { names: string[] };
    };

    const [model, proxy] = produce<Model>({
      name: { first: "", last: "Timberlake" },
      spouse: { name: { first: "" } },
      children: { names: [] },
    });

    proxy.name.first = "Adam";
    proxy.spouse.name.first = "Maria";
    proxy.children.names = ["Imogen", "Phoebe"];

    expect(model).toMatchSnapshot();
  });
});
