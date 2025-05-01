import Maybe from "./index.ts";
import { describe, expect, it } from "@jest/globals";

describe("Maybe", () => {
  it("Maybe.Ok", () => {
    const a = Maybe.Ok(42) as Maybe<number>;
    const b = a.otherwise(null);
    const c = a.map((x) => x + 1).otherwise(null);

    expect(b).toBe(42);
    expect(c).toBe(43);

    const x = Maybe.Ok({ y: Maybe.Ok("Adam") }) as unknown as Maybe<{
      y: Maybe<string>;
    }>;
    const y = x.map((x) => x.y.map((y) => y + " Smith")).otherwise(null);
    expect(y).toBe("Adam Smith");
  });

  it("Maybe.None", () => {
    const a = Maybe.None() as Maybe<number>;
    const b = a.otherwise(null);
    const c = a.map((x) => x + 1).otherwise(null);

    expect(b).toBe(null);
    expect(c).toBe(null);
  });

  it("Maybe.Error", () => {
    const a = Maybe.Error(new Error("test")) as unknown as Maybe<number>;
    const b = a.otherwise(null);
    const c = a.map((x) => x + 1).otherwise(null);

    expect(b).toBe(null);
    expect(c).toBe(null);
  });

  it("Maybe.Loading", () => {
    const a = Maybe.Loading(42) as Maybe<number>;
    const b = a.otherwise(null);
    const c = a.map((x) => x + 1).otherwise(null);

    expect(b).toBe(42);
    expect(c).toBe(43);
  });
});
