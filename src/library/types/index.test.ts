import { State } from ".";
import { describe, expect, it } from "@jest/globals";

describe("State", () => {
  it("can determine the operation", () => {
    const state = State.Op.Add;
    expect(state).toBe(1);
  });

  it("can determine the draft state", () => {
    const a = State.Draft("Maria");
    expect(a.value).toBe("Maria");
  });
});
