import { IoError, getError, isBroadcast } from "./utils.ts";
import { describe, expect, it } from "@jest/globals";

describe("isBroadcast()", () => {
  it("should return true for broadcast events", () => {
    expect(isBroadcast("age")).toBe(false);
    expect(isBroadcast("distributed/name")).toBe(true);
  });
});

describe("getError()", () => {
  it("should return the error message", () => {
    expect(getError(new Error("test"))).toEqual({
      message: "test",
      type: null,
    });

    expect(getError(new IoError("invalid", "Invalid user account"))).toEqual({
      type: "invalid",
      message: "Invalid user account",
    });
  });
});

describe("IoError", () => {
  it("can unwrap the error message", () => {
    const error = new IoError("invalid", "Invalid user account");

    expect(error.into()).toEqual({
      message: "Invalid user account",
      type: "invalid",
    });
  });
});
