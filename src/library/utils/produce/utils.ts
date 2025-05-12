import { Operation, Process } from "../../types/index.ts";
import { Immer } from "immer";

export const config = {
  immer: new Immer(),
  states: "___states",
};

config.immer.setAutoFreeze(false);

export class State<M> {
  process: null | Process;

  constructor(
    public value: M,
    public operation: null | Operation = null,
    public field: null | number | string = null,
  ) {
    this.process = null;
  }

  public bind(process: Process): State<M> {
    const state = new State(this.value, this.operation, this.field);
    state.process = process;
    return state;
  }
}

export function state<M>(value: M, operation: null | Operation) {
  return new State(value, operation) as M;
}
