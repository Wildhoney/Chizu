import Maybe from "./index.ts";
import { describe, expect, it } from "@jest/globals";

type Value = number | null | undefined | Error;

describe("Maybe", () => {
  it("should handle the value type", () => {
    const a = Maybe.of<Value>(10);
    const b = a.map();
    expect(b).toEqual(10);

    const c = Maybe.of<Value>(20);
    const d = c.map((x) => x * 2);
    expect(d).toEqual(40);

    const e = Maybe.of<Value>(30);
    const f = e.map(
      (x) => x * 2,
      (_) => "Nothing",
    );
    expect(f).toEqual(60);
  });

  it("should handle the nothing type", () => {
    const a = Maybe.of<Value>(null);
    const b = a.map();
    expect(b).toEqual(null);

    const c = Maybe.of<undefined | number>(undefined);
    const d = c.map(
      (x) => x * 2,
      (_) => "Nothing",
    );
    expect(d).toEqual("Nothing");
  });

  it("should handle the fault type", () => {
    const a = Maybe.of<Value>(new Error("Something went wrong"));
    const b = a.map(
      (x) => x,
      (_) => "Error",
    );
    expect(b).toEqual("Error");
  });
});
