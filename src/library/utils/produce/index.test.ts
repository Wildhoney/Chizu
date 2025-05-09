import { cleanup, update } from ".";
import { Process } from "../../module/renderer/process/types.ts";
import { Operation } from "../../types/index.ts";
import { State, config, state } from "./utils.ts";
import { describe, expect, it } from "@jest/globals";

const process: Process = Symbol("process");

describe("produce", () => {
  const model = {
    name: { first: "Adam" },
    location: { area: "Brighton" },
    children: [{ name: "Imogen" }],
  };

  it("transforms the model with simple primitives", () => {
    const models = update(model, process, (draft) => {
      draft.name.first = "Maria";
      draft.location = { area: "Watford" };
      draft.children.push({ name: "Phoebe" });
    });

    expect(models.stateless).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });
    expect(models.stateful).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });
    expect(models.interface.name.is(Operation.Update)).toBe(false);
  });

  it("transforms the model with state operations", () => {
    const models = update(model, process, (draft) => {
      draft.name.first = state("Maria", Operation.Update, process);
      draft.location = state({ area: "Watford" }, Operation.Replace, process);
      draft.children.push(state({ name: "Phoebe" }, Operation.Add, process));
    });

    expect(models.stateless).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });
    expect(models.stateful).toEqual({
      name: { first: "Maria", [config.states]: [expect.any(State)] },
      location: { area: "Watford", [config.states]: [expect.any(State)] },
      children: [
        { name: "Imogen" },
        { name: "Phoebe", [config.states]: [expect.any(State)] },
      ],
    });
    expect(models.interface.name.is(Operation.Update)).toBe(true);
  });

  it("transforms the model by cleaning up state processes", () => {
    const models = cleanup(
      update(model, process, (draft) => {
        draft.name.first = state("Maria", Operation.Update, process);
        draft.location = state({ area: "Watford" }, Operation.Replace, process);
        draft.children.push(state({ name: "Phoebe" }, Operation.Add, process));
      }),
      process,
    );

    expect(models.stateful).toEqual({
      name: { first: "Maria", [config.states]: [] },
      location: { area: "Watford", [config.states]: [] },
      children: [{ name: "Imogen" }, { name: "Phoebe", [config.states]: [] }],
    });
  });
});
