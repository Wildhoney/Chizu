import { describe, expect, it } from "@jest/globals";
import { isBroadcastAction } from "./utils.ts";

describe("isBroadcastAction()", () => {
  it("should return true for broadcast actions", () => {
    expect(isBroadcastAction("age")).toBe(false);
    expect(isBroadcastAction("distributed/name")).toBe(true);
  });
});
