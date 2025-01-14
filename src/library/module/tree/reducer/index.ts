import { Actions, Model, Routes } from "../../../types/index.ts";
import { ReducerState, ReducerEvents } from "./types.ts";

export default function reducer<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(
  state: ReducerState<M, A, R>,
  event: ReducerEvents<M>,
): ReducerState<M, A, R> {
  switch (event.type) {
    case "element":
      return { ...state, element: event.payload };

    case "model":
      return { ...state, model: event.payload };
  }
}
