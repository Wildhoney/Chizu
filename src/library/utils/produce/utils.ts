import { Process, State } from "../../types/index.ts";
import { enablePatches, Immer } from "immer";

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
    public operations: State[],
    public field: null | number | string = null,
  ) {
    this.process = null;
  }

  public attach(process: Process): Annotation<M> {
    this.process = process;
    return this;
  }
}

export function annotate<M>(value: M, operations: State[] = []): M {
  return new Annotation(value, operations) as M;
}
