import { Process } from "../../module/renderer/process/types.ts";
import { State } from "../../types/index.ts";

export const unwrap = Symbol("unwrap");

export class Placeholder<T> {
  #primitive: T;
  #state: State;
  #process: null | Process;

  constructor(primitive: T, state: State, process: null | Process) {
    this.#primitive = primitive;
    this.#state = state;
    this.#process = process;
  }

  value(): T {
    return this.#primitive;
  }

  state(): State {
    return this.#state;
  }

  process(): null | Process {
    return this.#process;
  }
}
