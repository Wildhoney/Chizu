import { Mutations } from "../../module/renderer/mutations/types.ts";
import { Model, State } from "../../types/index.ts";
import validate from "./index.ts";
import { describe, expect, it } from "@jest/globals";

describe("validate", () => {
  it("should return a new model with the state of the mutations", () => {
    const model = {
      name: "John",
      otherNames: { middleName: "James", lastName: "Smith" },
      friends: [{ name: "Sarah" }, { name: "Mary" }],
    } satisfies Model;

    const mutations: Mutations = [
      { path: ["name"], state: State.Pending },
      { path: ["otherNames", "middleName"], state: State.Pending },
      { path: ["friends", "0", "name"], state: State.Pending },
    ];

    const validator = validate(model, mutations);

    expect(validator.name.pending()).toEqual(true);

    expect(validator.otherNames.middleName.pending()).toEqual(true);
    expect(validator.otherNames.lastName.pending()).toEqual(false);

    expect(validator.friends[0].name.pending()).toEqual(true);
    expect(validator.friends[1].name.pending()).toEqual(false);
  });
});
