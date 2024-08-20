import { ClassType, EventNames, FnType, Tree, Props } from "./types";

export abstract class View<Controller extends ClassType> {
  protected model: InstanceType<Controller>["model"];

  constructor(model: InstanceType<Controller>["model"]) {
    this.model = model;
  }

  public dispatch<E extends EventNames<Controller>>(
    event: E,
    payload: Parameters<InstanceType<Controller>[E]>[0],
  ) {}

  public abstract render(): Tree;
}

export class Properties<Model extends Record<string, unknown>> {
  pending(name: Props<Model>, fn: FnType): any {
    return null;
  }

  error(name: Props<Model>, fn: FnType): any {
    return null;
  }
}

// public dispatch(run) {
//   const effects = new Set();

//   const a = run();
//   effects.add(a.next().value);
//   effects.add(a.next(states.pending).value);

//   Promise.all([...effects].map((effect) => effect?.() ?? effect)).then(
//     (values) => {
//       const b = run();
//       effects.add(b.next().value);
//       effects.add(b.next(values[0]).value);
//     },
//   );
// }
