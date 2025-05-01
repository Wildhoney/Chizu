import { Process } from "../../module/renderer/process/types.ts";
import { State } from "../../types/index.ts";
import { MaybeObject } from "../produce/index.ts";
import { Primitive } from "utility-types";

const none = Symbol("nothing");

export const merge = Symbol("merge");

export default class Maybe<T> {
  #value: T;
  #states: (null | State)[] = [];
  #processes: (null | Process)[] = [];

  constructor(value: T, state: null | State, process: null | Process = null) {
    this.#value = value;
    this.#states = [state];
    this.#processes = [process];
  }

  static Ok<T extends object>(
    value: T,
    process?: null | Process,
  ): T & MaybeObject;
  static Ok<T extends Primitive>(value: T, process?: null | Process): Maybe<T>;
  static Ok<T>(value: T, process: null | Process = null): Maybe<T> {
    return new Maybe(value, null, process);
  }

  static None<T extends object>(process?: null | Process): Maybe<T>;
  static None<T extends Primitive>(process?: null | Process): Maybe<T>;
  static None<T>(process: null | Process = null): Maybe<T> {
    return new Maybe(none as T, null, process);
  }

  static Error<T extends object>(
    value: T,
    process?: null | Process,
  ): T & MaybeObject;
  static Error<T extends Primitive>(value: T): Maybe<T>;
  static Error<T extends Error>(
    value: T,
    process: null | Process = null,
  ): Maybe<T> {
    return new Maybe(value, null, process);
  }

  static Loading<T extends object>(
    value: T,
    state?: null | State,
    process?: null | Process,
  ): T & MaybeObject;
  static Loading<T extends Primitive>(
    value: T,
    state?: null | State,
    process?: null | Process,
  ): Maybe<T>;
  static Loading<T>(
    value: T,
    state: null | State = null,
    process: null | Process = null,
  ): Maybe<T> {
    return new Maybe(value, state, process);
  }

  #ok(): boolean {
    return this.#value instanceof Error || this.#value === none ? false : true;
  }

  map<U>(fn: (value: T) => U): Maybe<U extends Maybe<infer V> ? V : U> {
    if (this.#ok()) {
      let value = fn(this.#value);

      if (value instanceof Maybe) {
        return new Maybe(
          value.#value,
          value.#states[0] ?? this.#states[0],
          value.#processes[0] ?? this.#processes[0],
        ) as Maybe<U extends Maybe<infer V> ? V : U>;
      } else if (value instanceof Error) {
        return new Maybe(value, null, this.#processes[0]) as Maybe<
          U extends Maybe<infer V> ? V : U
        >;
      } else if (value === none) {
        return new Maybe(value, null, this.#processes[0]) as Maybe<
          U extends Maybe<infer V> ? V : U
        >;
      } else {
        return new Maybe(value, this.#states[0], this.#processes[0]) as Maybe<
          U extends Maybe<infer V> ? V : U
        >;
      }
    } else {
      return new Maybe(
        this.#value as unknown as U extends Maybe<infer V> ? V : U,
        this.#states[0],
        this.#processes[0],
      );
    }
  }

  otherwise<U>(value: U): T extends Maybe<infer V> ? V | U : T | U {
    if (this.#ok()) {
      let currentValue: unknown = this.#value;

      while (currentValue instanceof Maybe) {
        currentValue = currentValue.#value;
      }

      return currentValue as T extends Maybe<infer V> ? V | U : T | U;
    }

    return value as T extends Maybe<infer V> ? V | U : T | U;
  }
}
