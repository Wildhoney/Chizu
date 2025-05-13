import { Process, State } from "../../types/index.ts";
import { Immer } from "immer";

export const config = {
  immer: new Immer(),
  states: "___states",
};

config.immer.setAutoFreeze(false);

export class Stateful<M> {
  process: null | Process;

  constructor(
    public value: M,
    public operations: State[],
    public field: null | number | string = null,
  ) {
    this.process = null;
  }

  public attach(process: Process): Stateful<M> {
    this.process = process;
    return this;
  }
}

export function state<M>(value: M, operations: State[] = []): M {
  return new Stateful(value, operations) as M;
}
