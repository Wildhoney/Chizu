export default class Optimistic<T> {
  #optimistic: T;
  #actual: () => T;

  constructor(actual: () => T, optimistic: T) {
    this.#optimistic = optimistic;
    this.#actual = actual;
  }

  get optimistic() {
    return this.#optimistic;
  }

  get actual() {
    return this.#actual;
  }
}
