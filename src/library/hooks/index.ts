import { hash } from "../utils/index.ts";
import * as React from "react";

/**
 * Optimises the memoisation of a value based on its dependencies.
 *
 * @param factory {() => T}
 * @param dependencies {React.DependencyList}
 * @returns {T}
 */
export function useOptimisedMemo<T>(
  factory: () => T,
  dependencies: React.DependencyList,
): T {
  const cache = React.useRef<T | null>(null);
  const previousHash = React.useRef<string | null>(null);

  return React.useMemo(() => {
    const currentHash = hash(dependencies);

    if (previousHash.current !== currentHash) {
      previousHash.current = currentHash;
      const result = factory();
      cache.current = result;
      return result;
    }

    return cache.current as T;
  }, dependencies);
}

/**
 *  Optimises the execution of an effect based on its dependencies.
 *
 * @param effect {React.EffectCallback}
 * @param dependencies {React.DependencyList}
 */
export function useOptimisedEffect(
  effect: React.EffectCallback,
  dependencies: React.DependencyList,
): void {
  const previousHash = React.useRef<string | null>(null);

  React.useEffect(() => {
    const currentHash = hash(dependencies);

    if (previousHash.current !== currentHash) {
      previousHash.current = currentHash;
      return effect();
    }
  }, dependencies);
}
