import { State } from ".";
import { describe, expect, it } from "@jest/globals";

describe("State", () => {
  it("can determine the operation", () => {
    const state = State.Operation.Add;
    expect(state).toBe(1);
  });

  it("can determine the optimistic state", () => {
    const a = State.Optimistic("Maria");
    expect(a.value).toBe("Maria");
  });
});
