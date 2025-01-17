import { Actions, Model, Routes } from "../../../types/index.ts";
import { ReducerState, ReducerEvents, ReducerEvent } from "./types.ts";

export default function reducer<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(
  state: ReducerState<M, A, R>,
  event: ReducerEvents<M>,
): ReducerState<M, A, R> {
  switch (event.type) {
    case ReducerEvent.AttachElement:
      return { ...state, element: event.payload };

    case ReducerEvent.UpdateModel:
      return { ...state, model: event.payload };

    case ReducerEvent.QueueUpdate:
      return {
        ...state,
        dispatchQueue: [
          ...state.dispatchQueue,
          { id: event.payload, result: null },
        ],
      };

    case ReducerEvent.MutationRecords:
      return {
        ...state,
        mutationRecords: {
          ...state.mutationRecords,
          [event.payload.dispatchId]: event.payload.mutationRecords,
        },
      };
  }
}
