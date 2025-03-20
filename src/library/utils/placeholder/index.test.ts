import { observe, placeholder, validate } from ".";
import { Mutations } from "../../module/renderer/mutations/types.ts";
import { State } from "../../types/index.ts";
import { describe, expect, it } from "@jest/globals";

describe("observe()", () => {
  const model = {
    name: "Adam",
    age: 18,
    favourite: {
      country: "Japan",
    },
  };

  it("should behave like a regular object", () => {
    const mutations: Mutations = new Set();
    const segment = observe(model, mutations);

    expect(segment.name).toEqual("Adam");
    expect(segment.age).toEqual(18);
    expect(segment.favourite.country).toEqual("Japan");

    expect(Object.keys(segment)).toEqual(["name", "age", "favourite"]);
    expect(Object.values(segment)).toEqual(["Adam", 18, { country: "Japan" }]);
  });

  it("should behave like a regular array", () => {
    const mutations: Mutations = new Set();
    const segment = observe([{ name: "Adam" }, { name: "Eve" }], mutations);

    expect(segment[0].name).toEqual("Adam");
    expect(segment[1].name).toEqual("Eve");

    expect(Object.keys(segment)).toEqual(["0", "1"]);
    expect(Object.values(segment)).toEqual([{ name: "Adam" }, { name: "Eve" }]);
  });

  it("should handle placeholders at the root for objects", () => {
    const mutations: Mutations = new Set();
    const segment = observe(
      { people: [{ name: "Adam" }, { name: "Eve" }] },
      mutations,
    );

    expect(segment.people[0].name).toEqual("Adam");
    segment.people[0] = placeholder(
      segment.people[0],
      State.Updating,
      Symbol("process"),
    );
    expect(mutations).toEqual(
      new Set([expect.objectContaining({ key: "0", state: State.Updating })]),
    );
  });

  it("should handle placeholders at the root for arrays", () => {
    const mutations: Mutations = new Set();
    const segment = observe(
      {
        people: [{ name: "Adam" }, { name: "Eve" }],
      },
      mutations,
    );

    expect(segment.people[0].name).toEqual("Adam");
    expect(segment.people[1].name).toEqual("Eve");

    segment.people = placeholder(
      segment.people,
      State.Updating,
      Symbol("process"),
    );
    expect(mutations).toEqual(
      new Set([
        expect.objectContaining({ key: "people", state: State.Updating }),
      ]),
    );
  });

  it("should handle placeholders for objects", () => {
    const mutations: Mutations = new Set();
    const process = Symbol("process");
    const segment = observe(model, mutations);

    segment.name = placeholder("Eve", State.Updating, process);
    expect(segment.name).toEqual("Eve");
    expect(mutations).toEqual(
      new Set([
        expect.objectContaining({ key: "name", state: State.Updating }),
      ]),
    );

    segment.name = placeholder("Carla", State.Updating, process);
    expect(segment.name).toEqual("Carla");
    expect(mutations).toEqual(
      new Set([
        expect.objectContaining({ key: "name", state: State.Updating }),
        expect.objectContaining({ key: "name", state: State.Updating }),
      ]),
    );

    segment.favourite.country = placeholder("Czechia", State.Updating, process);
    expect(segment.favourite.country).toEqual("Czechia");
    expect(mutations).toEqual(
      new Set([
        expect.objectContaining({ key: "name", state: State.Updating }),
        expect.objectContaining({ key: "name", state: State.Updating }),
        expect.objectContaining({ key: "country", state: State.Updating }),
      ]),
    );
  });

  it("should handle placeholders for arrays", () => {
    const mutations: Mutations = new Set();
    const process = Symbol("process");
    const segment = observe([{ name: "Adam" }, { name: "Eve" }], mutations);

    segment[0].name = placeholder("Carla", State.Updating, process);
    expect(segment[0].name).toEqual("Carla");
    expect(mutations).toEqual(
      new Set([
        expect.objectContaining({ key: "name", state: State.Updating }),
      ]),
    );

    segment[1].name = placeholder("Diana", State.Updating, process);
    expect(segment[1].name).toEqual("Diana");
    expect(mutations).toEqual(
      new Set([
        expect.objectContaining({ key: "name", state: State.Updating }),
        expect.objectContaining({ key: "1", state: State.Updating }),
      ]),
    );
  });

  it("should handle deleting items from arrays", () => {
    const mutations: Mutations = new Set();
    const process = Symbol("process");

    const segment = observe(
      {
        people: [{ name: "Adam" }, { name: "Eve" }],
      },
      mutations,
    );

    segment.people[0] = placeholder(segment.people[0], State.Removing, process);
    expect(segment.people[0].name).toEqual("Adam");
    expect(mutations).toEqual(
      new Set([expect.objectContaining({ key: "0", state: State.Removing })]),
    );

    segment.people = segment.people.filter((person) => person.name !== "Eve");
    expect(segment.people).toEqual([{ name: "Adam" }]);
    expect(mutations).toEqual(
      new Set([expect.objectContaining({ key: "0", state: State.Removing })]),
    );
  });
});

describe("validate()", () => {
  it("should validate objects", () => {
    const mutations: Mutations = new Set();
    const model = { name: "Adam", age: 18 };
    const segment = observe(model, mutations);
    const validator = validate(model, mutations);

    segment.name = placeholder("Eve", State.Updating, Symbol("process"));

    expect(validator.name.is(State.Pending)).toBe(true);
    expect(validator.name.is(State.Updating)).toBe(true);
    expect(validator.age.is(State.Pending)).toBe(false);
  });

  it("should validate arrays", () => {
    const mutations: Mutations = new Set();
    const model = [{ name: "Adam" }, { name: "Eve" }];
    const segment = observe(model, mutations);
    const validator = validate(model, mutations);

    segment[0] = placeholder(segment[0], State.Updating, Symbol("process"));

    expect(validator[0].is(State.Pending)).toBe(true);
    expect(validator[0].is(State.Updating)).toBe(true);
    expect(validator[1].is(State.Pending)).toBe(false);
  });
});
