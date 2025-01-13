import { Model, State } from "../../../../types";

export default function state<M extends Model>(model: M, state: State): M {
  return new Proxy(model, {
    get() {
      return state;
    },
  });
}
