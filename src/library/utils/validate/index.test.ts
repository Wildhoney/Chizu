import { Mutations } from "../../module/renderer/mutations/types.ts";
import { Model, State } from "../../types/index.ts";
import validate from "./index.ts";
import { describe, expect, it } from "@jest/globals";

describe("validate", () => {
  it("should return a new model with the state of the mutations", () => {
    const process = Symbol("process");

    const model = {
      name: "John",
      otherNames: { middleName: "James", lastName: "Smith" },
      friends: [{ name: "Sarah" }, { name: "Mary" }],
    } satisfies Model;

    const mutations: Mutations = [
      { path: "name", state: State.Pending, process },
      { path: "otherNames.middleName", state: State.Pending, process },
      { path: "friends.0.name", state: State.Pending, process },
    ];

    const validator = validate(model, mutations);

    expect(validator.name.is(State.Pending)).toEqual(true);

    expect(validator.otherNames.middleName.is(State.Pending)).toEqual(true);
    expect(validator.otherNames.lastName.is(State.Pending)).toEqual(false);

    expect(validator.friends[0].name.is(State.Pending)).toEqual(true);
    expect(validator.friends[1].name.is(State.Pending)).toEqual(false);
  });
});
