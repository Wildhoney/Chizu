import { cleanup, update } from ".";
import { Process, State } from "../../types/index.ts";
import { Stateful, config, state } from "./utils.ts";
import { describe, expect, it } from "@jest/globals";

const process: Process = Symbol("process");

const model = {
  name: { first: "Adam" },
  location: { area: "Brighton" },
  children: [{ name: "Imogen" }],
};

describe("update", () => {
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
  });

  it("transforms the model with state operations", () => {
    const models = update(model, process, (draft) => {
      draft.name.first = state("Maria", [State.Operation.Update]);
      draft.location = state({ area: "Watford" }, [State.Operation.Replace]);
      draft.children.push(state({ name: "Phoebe" }, [State.Operation.Add]));
    });

    expect(models.stateless).toEqual({
      name: { first: "Maria" },
      location: { area: "Watford" },
      children: [{ name: "Imogen" }, { name: "Phoebe" }],
    });

    expect(models.stateful).toEqual({
      name: { first: "Maria", [config.states]: [expect.any(Stateful)] },
      location: { area: "Watford", [config.states]: [expect.any(Stateful)] },
      children: [
        { name: "Imogen" },
        { name: "Phoebe", [config.states]: [expect.any(Stateful)] },
      ],
    });
  });
});

describe("cleanup", () => {
  it("transforms the model by cleaning up state processes", () => {
    const models = cleanup(
      update(model, process, (draft) => {
        draft.name.first = state("Maria", [State.Operation.Update]);
        draft.location = state({ area: "Watford" }, [State.Operation.Replace]);
        draft.children.push(state({ name: "Phoebe" }, [State.Operation.Add]));
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

describe.only("validatable", () => {
  it("transforms the model with validatable operations", () => {
    const models = update(model, process, (draft) => {
      draft.name.first = state("Maria", [State.Operation.Update]);
      draft.location = state({ area: "Watford" }, [
        State.Operation.Replace,
        State.Optimistic("Maybe Watford"),
      ]);
      draft.children.push(state({ name: "Phoebe" }, [State.Operation.Add]));
    });

    expect(models.validatable.name.first.pending()).toBe(true);
    expect(models.validatable.name.first.is(State.Operation.Update)).toBe(true);

    expect(models.validatable.location.pending()).toBe(true);
    expect(models.validatable.location.is(State.Operation.Replace)).toBe(true);
    expect(models.validatable.location.optimistic()).toBe("Maybe Watford");

    expect(models.validatable.children[0].pending()).toBe(false);
    expect(models.validatable.children[0].is(State.Operation.Add)).toBe(false);

    expect(models.validatable.children[1].pending()).toBe(true);
    expect(models.validatable.children[1].is(State.Operation.Add)).toBe(true);
  });
});
