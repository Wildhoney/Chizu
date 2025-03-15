import placeholder from ".";
import { State } from "../../types";
import { describe, expect, it } from "@jest/globals";

describe("ArrayPlaceholder", () => {
  it("behaves like a normal object", () => {
    const x = placeholder(State.Adding, ["Imogen", "Phoebe"]);
    expect(x[0]).toBe("Imogen");
    expect(x[1]).toBe("Phoebe");
    expect(x.state).toBe(State.Pending | State.Adding);
  });
});

describe("ObjectPlaceholder", () => {
  it("behaves like a normal object", () => {
    const x = placeholder(State.Adding, {
      first: "Imogen",
      second: "Phoebe",
    });
    expect(x.first).toBe("Imogen");
    expect(x.second).toBe("Phoebe");
    expect(x.state).toBe(State.Pending | State.Adding);

    const y = placeholder(State.Removing, x);
    expect(y.state).toBe(State.Pending | State.Adding | State.Removing);
  });
});

describe("StringPlaceholder", () => {
  it("behaves like a normal string", () => {
    const x = placeholder(State.Adding, "Adam");
    expect(x.valueOf()).toBe("Adam");
    expect(x.state).toBe(State.Pending | State.Adding);
  });
});

describe("NumberPlaceholder", () => {
  it("behaves like a normal number", () => {
    const x = placeholder(State.Adding, 42);
    expect(x.valueOf()).toBe(42);
    expect(x.state).toBe(State.Pending | State.Adding);
  });
});

describe("BooleanPlaceholder", () => {
  it("behaves like a normal boolean", () => {
    const x = placeholder(State.Adding, true);
    expect(x.valueOf()).toBe(true);
    expect(x.state).toBe(State.Pending | State.Adding);
  });
});

describe("DatePlaceholder", () => {
  it("behaves like a normal date", () => {
    const x = placeholder(State.Adding, new Date(2021, 0, 1));
    expect(x.valueOf()).toEqual(new Date(2021, 0, 1));
    expect(x.state).toBe(State.Pending | State.Adding);
  });
});
