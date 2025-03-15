import { State, reference } from "../../types/index.ts";
import { immerable } from "immer";

export default function placeholder<T>(
  state: State,
  value: T,
): ArrayPlaceholder<T> | ObjectPlaceholder<T> | PrimitivePlaceholder<T> {
  if (
    value instanceof ArrayPlaceholder ||
    value instanceof ObjectPlaceholder ||
    value instanceof PrimitivePlaceholder
  ) {
    value.state |= state;
    return value;
  }

  if (Array.isArray(value)) {
    return new ArrayPlaceholder(state, ...value);
  }

  if (value instanceof Date) {
    return new DatePlaceholder(state, value);
  }

  if (typeof value === "object" && value !== null) {
    return new ObjectPlaceholder(state, value);
  }

  switch (typeof value) {
    case "string":
      return new StringPlaceholder(state, value);

    case "number":
      return new NumberPlaceholder(state, value);

    case "boolean":
      return new BooleanPlaceholder(state, value);
  }

  return value;
}

class ArrayPlaceholder<T> extends Array {
  [immerable] = true;
  [reference] = Symbol();

  public state: State;

  constructor(state: State, ...values: T) {
    super(...values);
    this.state = State.Pending | state;
  }
}

class ObjectPlaceholder<T> {
  [immerable] = true;
  [reference] = Symbol();

  public state: State;

  constructor(state: State, value: T) {
    Object.assign(this, value);
    this.state = State.Pending | state;
  }
}

class PrimitivePlaceholder<T> extends String {
  [immerable] = true;
  [reference] = Symbol();

  private display;

  public state: State;

  constructor(state: State, value: T) {
    super(value);
    this.display = String(value);
    this.state = State.Pending | state;
  }

  valueOf(): any {
    return this.display as string;
  }
}

class StringPlaceholder extends PrimitivePlaceholder<string> {
  [immerable] = true;
  [reference] = Symbol();

  private actual;

  constructor(state: State, value: string) {
    super(state, value);
    this.actual = value;
  }

  valueOf() {
    return this.actual;
  }
}

class NumberPlaceholder extends PrimitivePlaceholder<number> {
  [immerable] = true;
  [reference] = Symbol();

  private actual;

  constructor(state: State, value: number) {
    super(state, value);
    this.actual = value;
  }

  valueOf() {
    return this.actual;
  }
}

class BooleanPlaceholder extends PrimitivePlaceholder<boolean> {
  [immerable] = true;
  [reference] = Symbol();

  private value;

  constructor(state: State, value: boolean) {
    super(state, value);
    this.value = value;
  }

  valueOf() {
    return this.value;
  }
}

class DatePlaceholder extends PrimitivePlaceholder<Date> {
  [immerable] = true;
  [reference] = Symbol();

  private actual;

  constructor(state: State, value: Date) {
    super(state, value);
    this.actual = value;
  }

  valueOf() {
    return this.actual;
  }
}
