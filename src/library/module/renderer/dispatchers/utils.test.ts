import { isBroadcast } from "./utils.ts";
import { describe, expect, it } from "@jest/globals";

describe("isBroadcast()", () => {
  it("should return true for broadcast events", () => {
    expect(isBroadcast("age")).toBe(false);
    expect(isBroadcast("distributed/name")).toBe(true);
  });
});
