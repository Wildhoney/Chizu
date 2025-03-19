import { Process } from "../../module/renderer/process/types.ts";
import { State } from "../../types/index.ts";
import { Mutation } from "./types.ts";

const GetStates = Symbol("GetStates");
const MergeStates = Symbol("MergeStates");
const GetPrimitive = Symbol("GetPrimitive");

interface Placeholder<T> {
  [GetStates](): Mutation[];
  [MergeStates](states: Mutation[]): void;
  [GetPrimitive](): T;
  clone(value: T): Placeholder<T>;
}

export class PrimitivePlaceholder<T> extends String implements Placeholder<T> {
  #primitive: T;
  #states: Mutation[] = [];

  constructor(process: null | Process, state: State, value: T) {
    super(value);
    this.#primitive = value;
    if (process) this.#states = [{ process, state }];
  }

  [Symbol.toPrimitive](hint: "default" | "string" | "number"): T | string {
    return hint === "string" ? String(this.#primitive) : this.#primitive;
  }

  [GetStates]() {
    return this.#states;
  }

  [MergeStates](states: Mutation[]) {
    this.#states.push(...states);
  }

  [GetPrimitive]() {
    return this.#primitive;
  }

  clone(value: T) {
    const isPlaceholder = value instanceof PrimitivePlaceholder;
    const instance = new this.constructor(
      null,
      State.Idle,
      isPlaceholder ? value[GetPrimitive] : value,
    );
    instance.states = this[GetStates]();
    if (isPlaceholder) instance[MergeStates](value[GetStates]());
    return instance;
  }
}

export class ArrayPlaceholder<T> extends Array implements Placeholder<T[]> {
  #primitive: T[];
  #states: Mutation[] = [];

  constructor(process: null | Process, state: State, ...value: T[]) {
    super(...(value as []));
    this.#primitive = value;
    if (process) this.#states = [{ process, state }];
  }

  [GetStates]() {
    return this.#states;
  }

  [MergeStates](states: Mutation[]) {
    this.#states.push(...states);
  }

  [GetPrimitive]() {
    return this.#primitive;
  }

  clone(value: T[]) {
    const isPlaceholder = value instanceof ArrayPlaceholder;
    const instance = new this.constructor(
      null,
      State.Idle,
      ...(isPlaceholder ? value[GetPrimitive]() : value),
    );
    instance.states = this[GetStates]();
    if (isPlaceholder) instance[MergeStates](value[GetStates]());

    return instance;
  }
}

export class ObjectPlaceholder<T extends object>
  extends Object
  implements Placeholder<T>
{
  #primitive: T;
  #states: Mutation[] = [];

  constructor(process: null | Process, state: State, value: object) {
    super(value);
    Object.assign(this, value);
    this.#primitive = value as T;
    if (process) this.#states = [{ process, state }];
  }

  [GetStates]() {
    return this.#states;
  }

  [MergeStates](states: Mutation[]) {
    this.#states.push(...states);
  }

  [GetPrimitive]() {
    return this.#primitive;
  }

  clone(value: T) {
    const isPlaceholder = value instanceof ObjectPlaceholder;
    const instance = new this.constructor(
      null,
      State.Idle,
      isPlaceholder ? value[GetPrimitive] : value,
    );
    instance.states = this[GetStates]();
    if (isPlaceholder) instance[MergeStates](value[GetStates]());
    return instance;
  }
}

export class StringPlaceholder extends PrimitivePlaceholder<string> {
  constructor(process: null | Process, state: State, value: string) {
    super(process, state, value);
  }
}

export class NumberPlaceholder extends PrimitivePlaceholder<number> {
  constructor(process: null | Process, state: State, value: number) {
    super(process, state, value);
  }
}

export class BooleanPlaceholder extends PrimitivePlaceholder<boolean> {
  constructor(process: null | Process, state: State, value: boolean) {
    super(process, state, value);
  }
}
