import { hash } from "../utils/index.ts";
import * as React from "react";
import { ActionClass, UseActions } from "./types.ts";
import { withGetters } from "./utils.ts";
import { Actions, Context, Lifecycle, Model } from "../types/index.ts";
import * as immer from "immer"
import EventEmitter from "eventemitter3";



export function useAction<Model, Actions, const Action extends String<unknown>>(
  action: (context: Context<Model, Actions>, name: Action[typeof key]) => void,
) {
  return  React.useCallback(action, []);
}


export function useActions<M extends Model, A extends Actions>(
  model: M,
  ActionClass: ActionClass<M, A>,
): UseActions<M, A> {
  const [state, setState] = React.useState(model);
  const snapshot = useSnapshot({state});

  const unicast = useOptimisedMemo(() => new EventEmitter(), []);

  const instance = useOptimisedMemo(() => {
    const actions = new ActionClass(model);

    Object.getOwnPropertySymbols(actions).forEach((key) => {
      unicast.on(key, () => {
        actions[key]({
          actions: {
            produce(f) {
              const model = immer.produce(snapshot.state, f);
              setState(model);
            },
          },
        });
      });
    });

    return actions;
  }, [unicast]);

  useOptimisedEffect(() => {
    instance[Lifecycle.Mount]?.();

    return () => {
      instance[Lifecycle.Unmount]?.();
    };
  }, []);

  return React.useMemo(
    () => [
      state,
      {
        dispatch(action) {
          unicast.emit(action, []);
        },
        consume() {},
        annotate() {},
      },
    ],
    [state, unicast],
  );
}



export function useSnapshot<T extends object>(props: T): T {
  const ref = React.useRef<T>(props);

  useOptimisedEffect(() => {
    ref.current = props;
  }, [props]);

  return React.useMemo(() => withGetters(props, ref), [props]);
}





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
