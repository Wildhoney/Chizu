type Otherwise = null | undefined | Error;
type Value<T> = Exclude<T, Otherwise>;

export default class Maybe<T> {
  #value: T;

  static of<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  constructor(value: T) {
    this.#value = value;
  }

  map<U>(unwrap?: never, otherwise?: never): T;
  map<U>(unwrap?: (value: Value<T>) => U, otherwise?: never): T | U;
  map<U, V>(
    unwrap?: (value: Value<T>) => U,
    otherwise?: (value: Otherwise) => V,
  ): U | V;
  map<U>(
    unwrap = (value: Value<T>) => value,
    otherwise = (value: Otherwise) => value,
  ): T | U {
    if (this.#value == null || this.#value instanceof Error) {
      return otherwise(this.#value as Otherwise) as T | U;
    }

    return unwrap(this.#value as Value<T>) as T | U;
  }
}
