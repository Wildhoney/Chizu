/**
 * Check if the name is a broadcast action.
 *
 * @param name {string}
 * @returns {boolean}
 */
export function isBroadcastAction(name: string): boolean {
  return name.startsWith("distributed");
}
