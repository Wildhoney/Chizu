import { Actions, Model, Routes, State } from "../../../types/index.ts";
import { ModuleOptions } from "../../types.ts";

export type ReducerState<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  componentId: string;
  model: M;
  options: ModuleOptions<M, A, R>;
  element: null | HTMLElement;
  // pending: string[];
  dispatchQueue: DispatchQueue<M>[];
  mutationRecords: Record<string, MutationRecords>;
};

export type DispatchQueue<M> = {
  id: string;
  result: null | M;
};

export const enum ReducerEvent {
  AttachElement,
  UpdateModel,
  QueueUpdate,
  MutationRecords,
}

export type MutationRecords = { path: (string | number)[]; state: State[] }[];

export type ReducerEvents<M extends Model> =
  | {
      type: ReducerEvent.AttachElement;
      payload: HTMLElement;
    }
  | {
      type: ReducerEvent.UpdateModel;
      payload: M;
    }
  | {
      type: ReducerEvent.QueueUpdate;
      payload: string;
    }
  | {
      type: ReducerEvent.MutationRecords;
      payload: {
        dispatchId: string;
        mutationRecords: MutationRecords;
      };
    };
