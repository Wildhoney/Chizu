export class Maybe<T> {
  #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  static of<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  map<U>(ƒ: (value: T) => U): Maybe<U> {
    return new Maybe(ƒ(this.#value));
  }
}
