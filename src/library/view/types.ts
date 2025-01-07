import { Actions, Model, ReactiveProps, Routes } from "../types/index.ts";

type ViewArgs<M extends Model, A extends Actions, R extends Routes> = {
  model: ReactiveProps<M>;
  actions: {
    dispatch(event: A): void;
  };
};

export type ViewDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = (actions: ViewArgs<M, A, R>) => any;
