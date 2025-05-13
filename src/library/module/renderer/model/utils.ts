import {
  ModuleDefinition,
  Operation,
  Optimistic,
} from "../../../types/index.ts";
import { Stateful, config } from "../../../utils/produce/utils.ts";
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
      switch (property) {
        case "is": {
          return (operation: Operation) => {
            const states = read<M>(stateful, properties);
            if (!states) return false;
            const operations = new Set(
              states.flatMap((state) => state.operations),
            ) as Set<Operation>;

            const state = Array.from(operations).reduce(
              (current, operation) => current | (operation ?? 0),
              0,
            );

            return (state & operation) === operation;
          };
        }

        case "pending": {
          return () => {
            const states = read<M>(stateful, properties);
            return Boolean(states);
          };
        }

        case "optimistic": {
          return () => {
            const states = read<M>(stateful, properties);

            if (!states) return get(stateful, properties);

            const optimistic = states
              .flatMap((state) => state.operations)
              .find((operation) => operation instanceof Optimistic);

            if (!optimistic) return get(stateful, properties);

            return optimistic.value;
          };
        }
      }

      return validatable(stateful, [...properties, String(property)]);
    },
  }) as Validatable<M>;
}

function read<M extends ModuleDefinition["Model"]>(
  stateful: M,
  properties: string[],
): null | Stateful<M>[] {
  const value = get(stateful, properties);
  const path = typeof value === "object" ? properties : properties.slice(0, -1);
  const object = path.length === 0 ? stateful : get(stateful, path);
  const states: Stateful<M>[] = object?.[config.states] ?? [];

  return states.length > 0 ? states : null;
}
