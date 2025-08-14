import * as immer from "immer";
import { RefObject } from "react";
import { Props } from "../types";

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
