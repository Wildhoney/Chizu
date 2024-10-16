import { Actions, Model, State } from "../types/index.ts";

type ViewArgs<M extends Model, A extends Actions> = {
  model: M;
  actions: {
    is<P>(property: P, state: State): boolean;
    not<P>(property: P, state: State): boolean;
    match<P>(property: P, state: State): boolean;
    dispatch(event: A): void;
    dispatching(event: A | [A[0]]): boolean;
    match<P>(property: P, ƒ: (state: State) => string | P): void;
  };
};

export type ViewDefinition<M extends Model, A extends Actions> = (
  actions: ViewArgs<M, A>,
) => any;
