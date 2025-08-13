import { Draft, Model, Process, Operation } from "../../types/index.ts";
import { enablePatches, Immer } from "immer";
import { Validatable } from "./types.ts";
import get from "lodash/get";

export const config = {
  immer: new Immer(),
  annotations: Symbol("annotations") as unknown as string,
};

enablePatches();
config.immer.setAutoFreeze(false);

export class Annotation<M> {
  process: null | Process;

  constructor(
    public value: M,
    public operations: Operation[],
    public field: null | number | string = null,
  ) {
    this.process = null;
  }

  public attach(process: Process): Annotation<M> {
    this.process = process;
    return this;
  }
}

export function annotate<M>(value: M, operations: Operation[] = []): M {
  return new Annotation(value, operations) as M;
}

export function validatable<M extends Model>(
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

            // return (state & operation) === operation;
            return Boolean(state & operation);
          };
        }

        case "pending": {
          return () => {
            const states = read<M>(stateful, properties);
            return Boolean(states);
          };
        }

        case "draft": {
          return () => {
            const states = read<M>(stateful, properties);

            if (!states) return get(stateful, properties);

            const drafts = states
              .flatMap((state) => state.operations)
              .find((operation) => operation instanceof Draft);

            if (!drafts) return get(stateful, properties);

            return drafts.value;
          };
        }
      }

      return validatable(stateful, [...properties, String(property)]);
    },
  }) as Validatable<M>;
}

function read<M extends Model>(
  stateful: M,
  properties: string[],
): null | Annotation<M>[] {
  const value = get(stateful, properties);
  const path = typeof value === "object" ? properties : properties.slice(0, -1);
  const object = path.length === 0 ? stateful : get(stateful, path);
  const annotations: Annotation<M>[] = object?.[config.annotations] ?? [];

  return annotations.length > 0 ? annotations : null;
}
