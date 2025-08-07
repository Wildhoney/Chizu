import { Payload } from "../types";

/**
 * Defines a new action with a given payload type.
 *
 * @template T The type of the payload that the action will carry.
 * @param {string} [name] An optional name for the action, used for debugging purposes.
 * @returns {Payload<T>} A new action object.
 */
export function createAction<T = unknown>(name?: string): Payload<T> {
  return Symbol(`chizu/action::${name}`) as unknown as Payload<T>;
}

/**
 * Defines a new distributed action with a given payload type.
 * Distributed actions can be shared across different modules.
 *
 * @template T The type of the payload that the action will carry.
 * @param {string} [name] An optional name for the action, used for debugging purposes.
 * @returns {Payload<T>} A new distributed action object.
 */
export function createDistributedAction<T = unknown>(
  name?: string,
): Payload<T> {
  return Symbol.for(
    `chizu/action/distributed::${name}`,
  ) as unknown as Payload<T>;
}
