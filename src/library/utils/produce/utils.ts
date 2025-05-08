import { Process } from "../../module/renderer/process/types.ts";
import { Operation } from "../../types/index.ts";
import { Immer, enablePatches } from "immer";

export const config = {
  immer: new Immer(),
  states: Symbol("states"),
};

config.immer.setAutoFreeze(false);
enablePatches();

export class State<M> {
  constructor(
    public value: M,
    public process: null | Process,
    public operation: null | Operation = null,
    public field: null | string = null,
  ) {
    this.value = value;
    this.operation = operation;
    this.field = field;
  }
}

export function state<M>(
  value: M,
  operation: null | Operation,
  process: null | Process,
) {
  return new State(value, process, operation) as M;
}
