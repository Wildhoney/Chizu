import { ModuleDefinition, Operation } from "../../../types/index.ts";
import { State, config } from "../../../utils/produce/utils.ts";
import { Validatable } from "./types.ts";
import get from "lodash/get";

export class Models<M extends ModuleDefinition["Model"]> {
  constructor(
    public stateless: M,
    public stateful: M,
  ) {}

  get validatable(): Validatable<M> {
    return validatable(this.stateful);
  }
}

function validatable<M extends ModuleDefinition["Model"]>(
  stateful: M,
  properties: string[] = [],
): Validatable<M> {
  return new Proxy(stateful, {
    get(_, property) {
      if (property === "is") {
        return (operation: Operation) => {
          const value = get(stateful, properties);
          const path =
            typeof value === "object" ? properties : properties.slice(0, -1);
          const object = path.length === 0 ? stateful : get(stateful, path);
          const states: undefined | State<M>[] = object?.[config.states];

          if (!states) return false;

          const operations = new Set(states.map((state) => state.operation));
          const state = Array.from(operations).reduce(
            (current, operation) => current | (operation ?? 0),
            0,
          );

          return (state & operation) === operation;
        };
      }

      return validatable(stateful, [...properties, String(property)]);
    },
  }) as Validatable<M>;
}
