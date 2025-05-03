import { Process } from "../../module/renderer/process/types.ts";
import { Operation } from "../../types/index.ts";

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

export const states = Symbol("states") as unknown as string;
