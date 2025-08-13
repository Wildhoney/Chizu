import { Actions, Context, Model, Payload, Pk } from "../types/index.ts";

export { default as sleep } from "./sleep/index.ts";

/**
 * Generates a unique primary key.
 * @returns A new unique symbol representing the primary key.
 */
export function pk(): symbol;
/**
 * Checks if the provided ID is a valid primary key.
 * A valid primary key is considered any value that is not a symbol.
 * @template T The type of the object.
 * @param id The primary key to validate.
 * @returns `true` if the ID is valid, `false` otherwise.
 */
export function pk<T>(id: Pk<T>): boolean;
export function pk<T>(id?: Pk<T>): boolean | symbol {
  if (id) return Boolean(id && typeof id !== "symbol");
  return Symbol(`pk.${Date.now()}.${crypto.randomUUID()}`);
}

/**
 * Creates a generic "setter" action that updates a specific property in the state.
 * This is a higher-order function that takes a property name and returns an action function.
 * The returned action, when called, will update the state with the provided payload for the specified property.
 * It uses `produce` to handle immutable state updates.
 *
 * @template M The model (state) type.
 * @template A The actions type.
 * @param property The name of the property in the state to update.
 * @returns An action function that takes the context and a payload, and updates the state.
 */
export function set<M extends Model, A extends Actions>(property: string) {
  return (context: Context<M, A>, payload: Payload): void => {
    context.actions.produce((draft: M) => {
      (draft as Record<string, Payload>)[property] = payload;
    });
  };
}
