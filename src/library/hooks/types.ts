import { Actions, Model } from "../types";

export type ActionClass<M extends Model, A extends Actions> = new (
  model: M,
) => A;

export type UseActions<Model, Actions> = [
  Model,
  {
    /**
     * Dispatches an action to update the model.
     * @param action The action to dispatch.
     */
    dispatch(action: Actions): void;
    /**
     * Validates the current model state.
     */
    validate(): void;
    /**
     * Annotates the current model state.
     */
    annotate(): void;
    /**
     * Consumes the current model state.
     */
    consume(): void;
  },
];
