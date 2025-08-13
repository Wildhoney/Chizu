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
  Props,
  Operations,
} from "../types/index.ts";
import EventEmitter from "eventemitter3";
import { useBroadcast } from "../broadcast/index.tsx";
import { isDistributedAction } from "../action/index.ts";
import {
  createAnnotation,
  recordAnnotations,
  stripAnnotations,
  transferAnnotations,
} from "../annotate/index.ts";

export const config = {
  immer: new immer.Immer(),
};

immer.enablePatches();
config.immer.setAutoFreeze(false);

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
  return React.useCallback(
    (context: Context<M, A>, payload: P[typeof PayloadKey]) =>
      void action(context, payload),
    [],
  );
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
  initialModel: M,
  ActionClass: ActionClass<M, A>,
): UseActions<M, A> {
  const ref = React.useRef<M>(initialModel);
  const annotations = React.useRef<M>(initialModel);
  const broadcast = useBroadcast();
  const [model, setModel] = React.useState<M>(initialModel);
  console.log(model);

  const snapshot = useSnapshot({ model });
  const unicast = React.useMemo(() => new EventEmitter(), []);

  const context = React.useMemo(() => {
    const process = Symbol("chizu.process");
    const controller = new AbortController();

    return <Context<M, A>>{
      signal: controller.signal,
      actions: {
        produce(f) {
          const [model, patches] = config.immer.produceWithPatches(stripAnnotations<M>(ref.current), f);
          ref.current = model;
          setModel(ref.current);
        },
        dispatch(action) {
          if (isDistributedAction(action)) broadcast.instance.emit(action, []);
          else unicast.emit(action, []);
        },
        annotate<T>(value: T, operations: Operations<T>): T {
          return createAnnotation<T>(value, operations, process);
        },
      },
    };
  }, [snapshot.model]);

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
      stripAnnotations<M>(model),
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
    [model, unicast],
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
export function useSnapshot<P extends Props>(props: P): P {
  const ref = React.useRef<P>(props);

  React.useLayoutEffect((): void => {
    ref.current = props;
  }, [props]);

  return React.useMemo(() => withGetters<P>(props, ref), [props]);
}
