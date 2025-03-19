import { State } from "../../types/index.ts";
import { placeholder, proxify } from "./index.ts";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("ArrayPlaceholder", () => {
  it("behaves like an array", () => {
    const process = Symbol("process");

    const model = proxify({
      tasks: placeholder([] as number[], process, State.Adding),
    });

    model.tasks.push(1);
    expect(model.tasks).toEqual([1]);

    model.tasks.push(placeholder(2, process, State.Adding));
    expect([...model.tasks].map((task) => Number(task))).toEqual([1, 2]);

    model.tasks.push(placeholder(3, process, State.Adding));
    expect([...model.tasks].map((task) => Number(task))).toEqual([1, 2, 3]);

    model.tasks.pop();
    expect([...model.tasks].map((task) => Number(task))).toEqual([1, 2]);
  });

  it("behaves when being updated", () => {
    const process = Symbol("process");

    const model = proxify({
      tasks: placeholder([] as { id: number }[], process, State.Adding),
    });

    model.tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(model.tasks).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);

    model.tasks = [
      placeholder({ id: 1 }, process, State.Updating),
      placeholder({ id: 2 }, process, State.Updating),
      { id: 3 },
    ];
    expect([...model.tasks].map((task) => task)).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    model.tasks = model.tasks.filter((task) => task.id != 2);
    expect([...model.tasks].map((task) => task)).toEqual([
      { id: 1 },
      { id: 3 },
    ]);

    model.tasks[0].id++;
    expect([...model.tasks].map((task) => task)).toEqual([
      { id: 2 },
      { id: 3 },
    ]);

    model.tasks[1].id = model.tasks[1].id - 1;
    expect([...model.tasks].map((task) => task)).toEqual([
      { id: 2 },
      { id: 2 },
    ]);
  });
});

describe("ObjectPlaceholder", () => {
  it("behaves like an object", () => {
    const process = Symbol("process");

    const model = proxify({
      task: placeholder({ description: "Buy milk" }, process, State.Adding),
    });

    expect(model.task.description).toEqual("Buy milk");
    expect(model.task).toEqual({ description: "Buy milk" });

    expect(Object.keys(model.task)).toEqual(["description"]);
    expect(Object.values(model.task)).toEqual(["Buy milk"]);
  });

  it("behaves when being updated", () => {
    const process = Symbol("process");

    const model = proxify({
      task: {
        id: 1,
        description: placeholder("Buy milk", process, State.Adding),
      },
    });

    model.task.description = "Buy butter";
    expect(String(model.task.description)).toEqual("Buy butter");

    model.task.id--;
    expect(model.task.id).toEqual(0);

    model.task.id = placeholder(1, process, State.Updating);
    expect(Number(model.task.id)).toEqual(1);
    expect(model.task.id.state()).toEqual(State.Updating);

    model.task.id--;
    expect(Number(model.task.id)).toEqual(0);
    expect(model.task.id.state()).toEqual(State.Updating);
  });
});

describe("NumberPlaceholder", () => {
  it("behaves like a number", () => {
    const process = Symbol("process");

    const model = proxify({
      task: placeholder(42, process, State.Adding),
    });

    expect(model.task + 1).toEqual(43);
    expect(model.task < 50).toBe(true);
  });

  it("behaves when being updated", () => {
    const process = Symbol("process");

    const model = proxify({
      task: placeholder(42, process, State.Adding),
    });

    model.task = model.task + 1;
    expect(Number(model.task)).toEqual(43);

    model.task = placeholder(model.task + 1, process, State.Updating);
    expect(Number(model.task)).toEqual(44);
  });

  it("behaves in a component", () => {
    const process = Symbol("process");
    const task = placeholder(42, process, State.Adding);
    const tree = render(<div>{task}</div>);
    expect(tree.getByText("42")).toBeInTheDocument();
  });
});

describe("StringPlaceholder", () => {
  const process = Symbol("process");

  it("behaves like a string", () => {
    const model = proxify({
      task: placeholder("Buy milk", process, State.Adding),
    });

    expect(model.task + " and bread").toEqual("Buy milk and bread");
    expect(model.task.length).toEqual(8);
  });

  it("behaves when being updated", () => {
    const process = Symbol("process");

    const model = proxify({
      task: placeholder("Buy milk", process, State.Adding),
    });

    model.task = "Buy milk and bread";
    expect(String(model.task)).toEqual("Buy milk and bread");
  });

  it("behaves in a component", () => {
    const process = Symbol("process");
    const task = placeholder("Buy milk", process, State.Adding);
    const tree = render(<div>{task}</div>);
    expect(tree.getByText("Buy milk")).toBeInTheDocument();
  });
});

describe("BooleanPlaceholder", () => {
  it("behaves like a boolean", () => {
    const process = Symbol("process");
    const model = proxify({
      task: placeholder(true, process, State.Adding),
    });

    expect(model.task == true).toBe(true);
    expect(model.task == false).toBe(false);
    expect(!model.task).toBe(false);
  });

  it("behaves when being updated", () => {
    const process = Symbol("process");

    const model = proxify({
      task: placeholder(true, process, State.Adding),
    });

    expect(model.task == true).toBe(true);
    model.task = !model.task;
    expect(model.task == false).toBe(true);
  });

  it("behaves in a component", () => {
    const process = Symbol("process");
    const task = placeholder(true, process, State.Adding);
    const tree = render(<div>{task}</div>);
    expect(tree.getByText("true")).toBeInTheDocument();
  });
});
