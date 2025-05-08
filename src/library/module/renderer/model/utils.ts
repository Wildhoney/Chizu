import { ModuleDefinition, Operation } from "../../../types/index.ts";
import { State, config } from "../../../utils/produce/utils.ts";
import { Validatable } from "./types.ts";
import get from "lodash/get";

export class Models<M extends ModuleDefinition["Model"]> {
  constructor(
    public stateless: M,
    public stateful: M,
  ) {}

  get interface(): Validatable<M> {
    return proxy(this.stateless, this.stateful);
  }
}

function proxy<
  M1 extends ModuleDefinition["Model"],
  M2 extends ModuleDefinition["Model"],
>(model: M1, draft: M2, path: string[] = []): Validatable<M1> {
  return new Proxy(model, {
    get(target, property) {
      if (property === "is") {
        return (operation: Operation) => {
          const object = path.length === 0 ? draft : get(draft, path);
          const states: undefined | State<M1>[] = object?.[config.states];
          if (!states) return false;
          const operations = new Set(states.map((state) => state.operation));
          const state = Array.from(operations).reduce(
            (acc, op) => acc | (op ?? 0),
            0,
          );
          return (state & operation) === operation;
        };
      }

      const value = Reflect.get(target, property);
      if (value && typeof value === "object") {
        return proxy(value, draft, [...path, String(property)]);
      }

      return value;
    },
  }) as Validatable<M1>;
}
