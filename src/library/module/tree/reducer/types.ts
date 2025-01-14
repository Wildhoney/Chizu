import { Actions, Model, Routes } from "../../../types/index.ts";
import { ModuleOptions } from "../../types.ts";

export type ReducerState<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  id: string;
  model: M;
  options: ModuleOptions<M, A, R>;
  element: null | HTMLElement;
  pending: string[];
};

export type ReducerEvents<M extends Model> =
  | {
      type: "element";
      payload: HTMLElement;
    }
  | {
      type: "model";
      payload: M;
    };
