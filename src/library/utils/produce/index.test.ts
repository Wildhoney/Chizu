import { produce } from ".";
import { Process } from "../../module/renderer/process/types";
import { Operation } from "../../types";
import { State, config, state } from "./utils";
import { describe, expect, it } from "@jest/globals";

describe("produce", () => {
  const process: Process = Symbol("process");

  const model = {
    name: { first: "Adam" },
    location: { area: "Brighton" },
    children: [{ name: "Imogen" }],
  };

  it("transforms the model with simple primitives", () => {
    const models = produce(model, process, (draft) => {
      draft.name.first = "Maria";
      draft.location = { area: "Watford" };
      draft.children.push({ name: "Phoebe" });
    });

    expect(models.draft).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });
    expect(models.model).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });
  });

  it("transforms the model with state operations", () => {
    const models = produce(model, process, (draft) => {
      draft.name.first = state("Maria", Operation.Update);
      draft.location = state({ area: "Watford" }, Operation.Replace);
      draft.children.push(state({ name: "Phoebe" }, Operation.Add));
    });

    expect(models.model).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });
    expect(models.draft).toEqual({
      name: { first: "Maria", [config.states]: [expect.any(State)] },
      location: { area: "Watford", [config.states]: [expect.any(State)] },
      children: [
        { name: "Imogen" },
        { name: "Phoebe", [config.states]: [expect.any(State)] },
      ],
    });
  });
});
