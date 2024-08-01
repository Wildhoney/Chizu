import * as immer from "immer";

export const states = {
  pending: Symbol("pending"),
  error: Symbol("error"),
};

export class BaseController {
  model = {};

  constructor() {
    this.mount();
  }

  protected mount() {}
  protected unmount() {}
  protected commit() {}

  protected effect<T>(fn: () => T): T {
    return fn;
  }

  public dispatch(run) {
    const effects = new Set();

    const a = run();
    effects.add(a.next().value);
    effects.add(a.next(states.pending).value);

    Promise.all([...effects].map((effect) => effect?.() ?? effect)).then(
      (values) => {
        const b = run();
        effects.add(b.next().value);
        effects.add(b.next(values[0]).value);
      },
    );
  }

  protected apply(fn) {
    const model = immer.produce(this.model, fn);
    this.model = model;
  }
}
