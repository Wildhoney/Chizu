import { Actions, Model } from "../types";

export type ActionClass<M extends Model, A extends Actions> = new (model: M) => A;


export type UseActions<Model, Actions> = [
  Model,
  {
    dispatch: (action: Actions) => void;
  },
];

