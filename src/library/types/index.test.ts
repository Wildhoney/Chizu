import { State, Lifecycle, Pk, Payload, PayloadKey } from ".";
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

describe("Lifecycle", () => {
  it("should have unique symbols", () => {
    const symbols = Object.values(Lifecycle);
    const uniqueSymbols = new Set(symbols);
    expect(symbols.length).toBe(uniqueSymbols.size);
  });
});

describe("Pk", () => {
  it("can be a symbol", () => {
    const pk: Pk<never> = Symbol("test");
    expect(typeof pk).toBe("symbol");
  });

  it("can be undefined", () => {
    const pk: Pk<never> = undefined;
    expect(pk).toBeUndefined();
  });
});

describe("Payload", () => {
  it("should be a symbol", () => {
    const payload: Payload<unknown> = Symbol("test");
    expect(typeof payload).toBe("symbol");
  });
});

describe("PayloadKey", () => {
  it("should be a symbol", () => {
    expect(typeof PayloadKey).toBe("symbol");
  });
});