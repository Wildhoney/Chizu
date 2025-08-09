import { State } from ".";
import { describe, expect, it } from "@jest/globals";

describe("State", () => {
  it("can access an operation", () => {
    const state = State.Operation.Adding;
    expect(state).toBe(1);
  });

  it("can create a draft state", () => {
    const a = State.Draft("Maria");
    expect(a.value).toBe("Maria");
  });
});
