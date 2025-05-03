import { produce } from ".";
import { Process } from "../../module/renderer/process/types";
import { Operation } from "../../types";
import { State, state, states } from "./utils";
import { describe, expect, it } from "@jest/globals";

describe("produce", () => {
  const process: Process = Symbol("process");

  it("transforms the model with simple primitives", () => {
    const current = { name: { first: "Adam" }, location: { area: "Brighton" } };
    const updated = produce(current, process, (draft) => {
      draft.name.first = "Maria";
      draft.location = { area: "Watford" };
    });

    expect(updated).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
    });
  });

  it("transforms the model with state operations", () => {
    const current = { name: { first: "Adam" }, location: { area: "Brighton" } };
    const updated = produce(current, process, (draft) => {
      draft.name.first = state("Maria", Operation.Update);
      draft.location = state({ area: "Watford" }, Operation.Replace);
    });

    expect(updated).toEqual({
      name: { first: "Maria", [states]: [expect.any(State)] },
      location: { area: "Watford", [states]: [expect.any(State)] },
    });
  });
});
