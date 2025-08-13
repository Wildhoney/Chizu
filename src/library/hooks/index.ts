import * as React from "react";
import * as immer from "immer";
import { ActionClass, UseActions } from "./types.ts";
import { withGetters } from "./utils.ts";
import {
  Actions,
  Context,
  PayloadKey,
  Lifecycle,
  Model,
  Payload,
} from "../types/index.ts";
import EventEmitter from "eventemitter3";
import { useBroadcast } from "../broadcast/index.tsx";
import { isDistributedAction } from "../action/index.ts";

/**
 * Memoizes an action handler for performance optimization.
 *
 * @template Model The type of the model.
 * @template Actions The type of the actions.
 * @template Action The specific action being handled.
 * @param {(context: Context<Model, Actions>, name: Action) => void} action The action handler function.
 * @returns {React.useCallback} The memoized action handler.
 */
export function useAction<
  M extends Model,
  A extends Actions,
  P extends Payload = never,
>(action: (context: Context<M, A>, payload: P[typeof PayloadKey]) => void) {
  return React.useCallback(action, []);
}

/**
 * A hook for managing state with actions.
 *
 * @template M The type of the model.
 * @template A The type of the actions.
 * @param {M} model The initial model.
 * @param {ActionClass<M, A>} ActionClass The class defining the actions.
 * @returns {UseActions<M, A>} A tuple containing the state and action handlers.
 */
export function useActions<M extends Model, A extends Actions>(
  model: M,
  ActionClass: ActionClass<M, A>,
): UseActions<M, A> {
  const broadcast = useBroadcast();
  const [state, setState] = React.useState<M>(model);

  const snapshot = useSnapshot({ state });
  const unicast = React.useMemo(() => new EventEmitter(), []);

  const context = React.useMemo(() => {
    // const process = Symbol("chizu.process");
    const controller = new AbortController();

    return {
      signal: controller.signal,
      actions: {
        produce(f) {
          const newState = immer.produce(snapshot.state, f);
          setState(newState);
        },
        // annotate<T>(value: T, operations: (Operation | Draft<T>)[]): T {
        //   // return annotate(value, operations);
        // },
      },
    } as Context<M, A>;
  }, [snapshot.state]);

  const instance = React.useMemo(() => {
    const actions = new ActionClass(model);

    Object.getOwnPropertySymbols(actions).forEach((action) => {
      if (isDistributedAction(action))
        broadcast.instance.on(action, (payload) =>
          actions[action](context, payload),
        );
      else unicast.on(action, (payload) => actions[action](context, payload));
    });

    return actions;
  }, [unicast]);

  React.useLayoutEffect(() => {
    instance[Lifecycle.Mount]?.(context);
    return () => void instance[Lifecycle.Unmount]?.(context);
  }, []);

  return React.useMemo(
    () => [
      state,
      {
        dispatch(action) {
          if (isDistributedAction(action)) broadcast.instance.emit(action, []);
          else unicast.emit(action, []);
        },
        consume() {},
        // get validate() {
        //   return null;
        // },
      },
    ],
    [state, unicast],
  );
}

/**
 * Creates a snapshot of a given object, returning a memoized version.
 * The snapshot provides stable access to the object's properties,
 * even as the original object changes across renders.
 *
 * @template T The type of the object.
 * @param {T} props The object to create a snapshot of.
 * @returns {T} A memoized snapshot of the object.
 */
export function useSnapshot<T extends object>(props: T): T {
  const ref = React.useRef<T>(props);

  React.useLayoutEffect((): void => {
    ref.current = props;
  }, [props]);

  return React.useMemo(() => withGetters(props, ref), [props]);
}
