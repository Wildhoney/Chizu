import { Process } from "../../module/renderer/process/types.ts";
import { ModuleDefinition, Operation } from "../../types/index.ts";
import { Immer, enablePatches } from "immer";

export const config = {
  immer: new Immer(),
  states: Symbol("states"),
};

config.immer.setAutoFreeze(false);
enablePatches();

export class State<T> {
  public process: null | Process = null;

  constructor(
    public value: T,
    public operation: null | Operation = null,
    public field: null | string = null,
  ) {
    this.value = value;
    this.operation = operation;
    this.field = field;
  }
}

export function state<T>(value: T, state: null | Operation = null): T {
  return new State(value, state) as T;
}

export class Models<M extends ModuleDefinition["Model"]> {
  constructor(
    public model: M,
    public draft: M,
  ) {
    this.model = model;
    this.draft = draft;
  }
}
