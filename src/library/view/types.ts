import { Actions, Model, Routes, State } from "../types/index.ts";

type ViewArgs<M extends Model, A extends Actions, R extends Routes> = {
  model: M;
  actions: {
    is<P>(property: P, state: State): boolean;
    not<P>(property: P, state: State): boolean;
    match<P>(property: P, ƒ: (state: State) => string | P): void;
    dispatch(event: A): void;
  };
};

export type ViewDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = (actions: ViewArgs<M, A, R>) => any;
