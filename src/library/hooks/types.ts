import { Actions, Model } from "../types";
import { Validatable } from "../utils/produce/types";

export type ActionClass<M extends Model, A extends Actions> = new (
  model: M,
) => A;

export type UseActions<M extends Model, A extends Actions> = [
  M,
  {
    /**
     * Dispatches an action to update the model.
     * @param action The action to dispatch.
     */
    dispatch(action: A): void;
    /**
     * Validates the current model state.
     */
    get validate(): Validatable<M>;
    /**
     * Consumes the current model state.
     */
    consume(): void;
  },
];
