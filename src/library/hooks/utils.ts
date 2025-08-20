import * as immer from "immer";
import { RefObject } from "react";
import { Props } from "../types";
import * as React from "react";

export const config = {
  immer: new immer.Immer(),
};

immer.enablePatches();
config.immer.setAutoFreeze(false);

/**
 * @name withGetters
 * @description This function creates a new object with getters for each property of the input object.
 * The getters retrieve the current value from a ref, ensuring that the latest value is always accessed.
 * @param {P} a The object to create getters for.
 * @param {RefObject<P>} b The ref object containing the current values.
 * @returns {P} A new object with getters that access the current values from the ref.
 */
export function withGetters<P extends Props>(a: P, b: RefObject<P>): P {
  return Object.keys(a).reduce(
    (proxy, key) => {
      Object.defineProperty(proxy, key, {
        get() {
          return b.current[key];
        },
        enumerable: true,
      });

      return proxy;
    },
    <P>{},
  );
}
/**
 * @name isGenerator
 * @description Checks if the given result is a generator or async generator.
 * @param result The result to check.
 * @returns {boolean} True if the result is a generator or async generator, false otherwise.
 */
export function isGenerator(
  result: unknown,
): result is Generator | AsyncGenerator {
  if (!result) return false;
  if (typeof result !== "object" || result === null) return false;
  const name = (result as object).constructor.name;
  return name === "Generator" || name === "AsyncGenerator";
}

/**
 * Returns the appropriate callback function based on the React version.
 * @returns {typeof React.useCallback} The callback function.
 */
export function getCallbackFunction(): typeof React.useCallback {
  if ("experimental_useEffectEvent" in React) {
    return React.experimental_useEffectEvent as typeof React.useCallback;
  } else if ("useEffectEvent" in React) {
    return React.useEffectEvent as typeof React.useCallback;
  }

  return React.useCallback;
}
