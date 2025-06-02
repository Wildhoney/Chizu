import { cleanup, update } from ".";
import { Models } from "../../module/renderer/model/utils.ts";
import { Boundary, Process, State } from "../../types/index.ts";
import { meta } from "../index.ts";
import { Annotation, annotate, config } from "./utils.ts";
import { describe, expect, it } from "@jest/globals";

const process: Process = Symbol("process");

const model = {
  [meta]: { boundary: Boundary.Default },
  name: { first: "Adam" },
  location: { area: "Brighton" },
  children: [{ name: "Imogen" }],
};

describe("update", () => {
  it("transforms the model with simple primitives", () => {
    const models = new Models(model);

    const a = update(models, process, (draft) => {
      draft.name.first = "Maria";
      draft.location = { area: "Watford" };
      draft.children.push({ name: "Phoebe" });
    });

    expect(a.stateless).toEqual(
      expect.objectContaining({
        name: { first: "Maria" },
        location: { area: "Watford" },
        children: [{ name: "Imogen" }, { name: "Phoebe" }],
      }),
    );

    expect(a.stateful).toEqual(
      expect.objectContaining({
        name: { first: "Maria" },
        location: { area: "Watford" },
        children: [{ name: "Imogen" }, { name: "Phoebe" }],
      }),
    );
  });

  it("transforms the model with state operations", () => {
    const models = new Models(model);

    const a = update(models, process, (draft) => {
      draft.name.first = annotate("Maria", [State.Op.Update]);
      draft.location = annotate({ area: "Watford" }, [State.Op.Replace]);
      draft.children.push(annotate({ name: "Phoebe" }, [State.Op.Add]));
    });

    expect(a.stateless).toEqual(
      expect.objectContaining({
        name: { first: "Maria" },
        location: { area: "Watford" },
        children: [{ name: "Imogen" }, { name: "Phoebe" }],
      }),
    );

    expect(a.stateful).toEqual(
      expect.objectContaining({
        name: {
          first: "Maria",
          [config.annotations]: [expect.any(Annotation)],
        },
        location: {
          area: "Watford",
          [config.annotations]: [expect.any(Annotation)],
        },
        children: [
          { name: "Imogen" },
          { name: "Phoebe", [config.annotations]: [expect.any(Annotation)] },
        ],
      }),
    );
  });

  it("transforms the model with chained state operations", () => {
    const models = new Models(model);

    const a = update(models, process, (draft) => {
      draft.name.first = annotate("Maria", [State.Op.Update]);
      draft.location = annotate({ area: "Horsham" }, [State.Op.Update]);
      draft.children.push(annotate({ name: "Phoebe" }, [State.Op.Add]));
    });

    expect(a.stateful).toEqual(
      expect.objectContaining({
        name: {
          first: "Maria",
          [config.annotations]: [expect.any(Annotation)],
        },
        location: {
          area: "Horsham",
          [config.annotations]: [expect.any(Annotation)],
        },
        children: [
          { name: "Imogen" },
          { name: "Phoebe", [config.annotations]: [expect.any(Annotation)] },
        ],
      }),
    );
    expect(a.validatable.location.is(State.Op.Update)).toBe(true);
    expect(a.validatable.location.is(State.Op.Replace)).toBe(false);

    const b = update(a, process, (draft) => {
      draft.name.first = annotate("Adam", [State.Op.Update]);
      draft.location = annotate({ area: "Watford" }, [State.Op.Replace]);
    });

    expect(b.stateful).toEqual(
      expect.objectContaining({
        name: {
          first: "Adam",
          [config.annotations]: [
            expect.any(Annotation),
            expect.any(Annotation),
          ],
        },
        location: {
          area: "Watford",
          [config.annotations]: [
            expect.any(Annotation),
            expect.any(Annotation),
          ],
        },
        children: [
          { name: "Imogen" },
          { name: "Phoebe", [config.annotations]: [expect.any(Annotation)] },
        ],
      }),
    );
    expect(b.validatable.location.is(State.Op.Update)).toBe(true);
    expect(b.validatable.location.is(State.Op.Replace)).toBe(true);
  });
});

describe("cleanup", () => {
  it("transforms the model by cleaning up state processes", () => {
    const models = new Models(model);

    const a = cleanup(
      update(models, process, (draft) => {
        draft.name.first = annotate("Maria", [State.Op.Update]);
        draft.location = annotate({ area: "Watford" }, [State.Op.Replace]);
        draft.children.push(annotate({ name: "Phoebe" }, [State.Op.Add]));
      }),
      process,
    );

    expect(a.stateful).toEqual(
      expect.objectContaining({
        name: { first: "Maria", [config.annotations]: [] },
        location: { area: "Watford", [config.annotations]: [] },
        children: [
          { name: "Imogen" },
          { name: "Phoebe", [config.annotations]: [] },
        ],
      }),
    );
  });
});

describe("validatable", () => {
  it("transforms the model with validatable operations", () => {
    const models = new Models(model);

    const a = update(models, process, (draft) => {
      draft.name.first = annotate("Maria", [State.Op.Update]);
      draft.location = annotate({ area: "Watford" }, [
        State.Op.Replace,
        State.Draft("Maybe Watford"),
      ]);
      draft.children.push(annotate({ name: "Phoebe" }, [State.Op.Add]));
    });

    expect(a.validatable.name.first.pending()).toBe(true);
    expect(a.validatable.name.first.is(State.Op.Update)).toBe(true);

    expect(a.validatable.location.pending()).toBe(true);
    expect(a.validatable.location.is(State.Op.Replace)).toBe(true);
    expect(a.validatable.location.draft()).toBe("Maybe Watford");

    expect(a.validatable.children[0].pending()).toBe(false);
    expect(a.validatable.children[0].is(State.Op.Add)).toBe(false);

    expect(a.validatable.children[1].pending()).toBe(true);
    expect(a.validatable.children[1].is(State.Op.Add)).toBe(true);
  });
});
