import { Operation, State } from "../../../types/index.ts";
import { mutations, patcher, tag, tagProperty } from "./utils.ts";
import { describe, expect, it } from "@jest/globals";
import { produce } from "immer";

describe("mutations()", () => {
  describe("objects", () => {
    it("handles adding", () => {
      type Model = { name: string; age?: number };
      const process = Symbol("process");

      const x = tag<Model>({ name: "Adam" });
      const y = produce(x, (draft) => {
        draft.age = 32;
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "age",
          state: State.Pending | Operation.Adding,
          value: 32,
          process,
        },
      ]);
    });

    it("handles updating", () => {
      type Model = { name: string };
      const process = Symbol("process");

      const x = tag<Model>({ name: "Adam" });
      const y = produce(x, (draft) => {
        draft.name = "Maria";
      });

      const b = mutations(process, patcher.diff(x, y));

      expect(b).toEqual([
        {
          path: "name",
          state: State.Pending | Operation.Updating,
          value: "Maria",
          process,
        },
      ]);
    });

    it("handles removing", () => {
      type Model = { name: string; age?: number };
      const process = Symbol("process");

      const x = tag<Model>({ name: "Adam", age: 32 });
      const y = produce(x, (draft) => {
        delete draft.age;
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "age",
          state: State.Pending | Operation.Removing,
          value: 0,
          process,
        },
      ]);
    });

    it("handles combinations of all", () => {
      type Model = { name: string; age?: number; location?: string };
      const process = Symbol("process");

      const x = tag<Model>({ name: "Adam", age: 32 });
      const y = produce(x, (draft) => {
        draft.name = "Maria";
        draft.location = "Horsham";
        delete draft.age;
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "name",
          state: State.Pending | Operation.Updating,
          value: "Maria",
          process,
        },
        {
          path: "age",
          state: State.Pending | Operation.Removing,
          value: 0,
          process,
        },
        {
          path: "location",
          state: State.Pending | Operation.Adding,
          value: "Horsham",
          process,
        },
      ]);
    });
  });

  describe("arrays", () => {
    it("handles adding", () => {
      type Model = { count: number[] };
      const process = Symbol("process");

      const x = tag<Model>({ count: [1, 2, 3] });
      const y = produce(x, (draft) => {
        draft.count.push(4);
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "count.3",
          state: State.Pending | Operation.Adding,
          value: 4,
          process,
        },
      ]);
    });

    it("handles removing", () => {
      type Model = { count: number[] };
      const process = Symbol("process");

      const x = tag<Model>({ count: [1, 2, 3] });
      const y = produce(x, (draft) => {
        delete draft.count[1];
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "count.1",
          state: State.Pending | Operation.Removing,
          value: undefined,
          process,
        },
      ]);
    });

    it("handles updating", () => {
      type Model = { count: number[] };
      const process = Symbol("process");

      const x = tag<Model>({ count: [1, 2, 3] });
      const y = produce(x, (draft) => {
        draft.count[0] = 5;
        draft.count[1] = 10;
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "count.0",
          state: State.Pending | Operation.Updating,
          value: 5,
          process,
        },
        {
          path: "count.1",
          state: State.Pending | Operation.Updating,
          value: 10,
          process,
        },
      ]);
    });

    it("handles sorting", () => {
      type Model = { count: number[] };
      const process = Symbol("process");

      const x = tag<Model>({ count: [3, 2, 1] });
      const y = produce(x, (draft) => {
        draft.count.sort();
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "count.1",
          state: 17,
          value: undefined,
          process,
        },
        {
          path: "count.2",
          state: 17,
          value: undefined,
          process,
        },
      ]);
    });

    it("handles combinations of all", () => {
      type Model = { count: number[] };
      const process = Symbol("process");

      const x = tag<Model>({ count: [1, 2, 3] });
      const y = produce(x, (draft) => {
        draft.count.push(4);
        draft.count[0] = 5;
        delete draft.count[1];
      });

      expect(mutations(process, patcher.diff(x, y))).toEqual([
        {
          path: "count.3",
          state: State.Pending | Operation.Adding,
          value: 4,
          process,
        },
        {
          path: "count.0",
          state: State.Pending | Operation.Updating,
          value: 5,
          process,
        },
        { path: "count.1", state: State.Pending | Operation.Removing, process },
      ]);
    });
  });
});

describe("tag", () => {
  it("tags objects", () => {
    const model = { name: "Adam", age: 32 };
    const tagged = tag(model);
    expect(tagged).toEqual({
      name: "Adam",
      age: 32,
      [tagProperty]: expect.any(Symbol),
    });
  });

  it("tags arrays", () => {
    const model = [{ name: "Adam", age: 32 }];
    const tagged = tag(model);
    expect(tagged).toEqual([
      { name: "Adam", age: 32, [tagProperty]: expect.any(Symbol) },
    ]);
  });
});
