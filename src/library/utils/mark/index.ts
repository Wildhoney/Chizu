import { ModuleDefinition, State } from "../../types/index.ts";
import { Mutation } from "./types.ts";

class Mark<T> {
  public value: T;
  public state: State;

  constructor(value: T, state: State) {
    this.value = value;
    this.state = state;
  }
}

export function inspect<M extends ModuleDefinition>(
  model: M["Model"],
): [M["Model"], Set<Mutation>] {
  const mutations = new Set<Mutation>();

  function iterate(model: M["Model"], path = ""): M["Model"] {
    const marked = model instanceof Mark;
    const value = marked ? model.value : model;

    if (marked) {
      mutations.add({ path, state: model.state });
    }

    if (value instanceof Set) {
      return new Set(
        Array.from(value).map((item, index) =>
          iterate(item, `${path}[${index}]`),
        ),
      );
    } else if (value instanceof Map) {
      return new Map(
        [...model.entries()].map(([key, item]) => [
          key,
          iterate(item, `${path}.${key}`),
        ]),
      );
    } else if (Array.isArray(value)) {
      return value.map((item, index) => iterate(item, `${path}[${index}]`));
    } else if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          iterate(item as M["Model"], `${path}.${key}`),
        ]),
      );
    }

    return value;
  }

  return [iterate(model), mutations];
}

export function mark<T>(value: T, state: State): T {
  return new Mark(value, state) as T;
}
