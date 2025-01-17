export default class Optimistic<T> {
  #optimistic: T;
  #actual: () => T;

  constructor(optimistic: T, actual: () => T) {
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
