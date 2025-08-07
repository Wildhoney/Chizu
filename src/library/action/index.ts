import { Action } from "./types";

/**
 * Defines a new action with a given payload type.
 *
 * @template T The type of the payload that the action will carry.
 * @param {string} [name] An optional name for the action, used for debugging purposes.
 * @returns {Action<T>} A new action object.
 */
export default function action<T = unknown>(name?: string): Action<T> {
  return Symbol(`chizu/action::${name}`) as unknown as Action<T>;
}

/**
 * Defines a new distributed action with a given payload type.
 * Distributed actions can be shared across different modules.
 *
 * @template T The type of the payload that the action will carry.
 * @param {string} [name] An optional name for the action, used for debugging purposes.
 * @returns {Action<T>} A new distributed action object.
 */
action.distributed = <T = unknown>(name?: string): Action<T> => {
  return Symbol.for(`chizu/action/distributed::${name}`) as unknown as Action<T>;
};
