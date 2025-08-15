/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { config, withGetters } from "./utils.ts";
import {
  Context,
  Lifecycle,
  Model,
  Payload,
  Props,
  ActionsClass,
  ActionInstance,
  UseActions,
} from "../types/index.ts";
import EventEmitter from "eventemitter3";
import { useBroadcast } from "../broadcast/index.tsx";
import { isDistributedAction } from "../action/index.ts";
import { plain } from "../annotate/index.ts";
import { useActionError } from "../error/index.tsx";

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
  AC extends ActionsClass<any>,
  K extends Exclude<keyof AC, "prototype">,
>(
  handler: (
    context: Context<M, AC>,
    payload: AC[K] extends Payload<infer P> ? P : never,
  ) => void | Promise<void> | AsyncGenerator | Generator,
) {
  const handleError = useActionError();

  return React.useCallback(
    (
      context: Context<M, AC>,
      payload: AC[K] extends Payload<infer P> ? P : never,
    ) => {
      async function run() {
        const task = Promise.withResolvers<void>();

        const isGenerator =
          handler.constructor.name === "GeneratorFunction" ||
          handler.constructor.name === "AsyncGeneratorFunction";

        if (isGenerator) {
          const generator = handler(context, payload) as
            | Generator
            | AsyncGenerator;
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of generator) void 0;
          } catch (error) {
            if (handleError) handleError(error as Error);
            return void task.reject(error);
          }
          return;
        }

        try {
          await handler(context, payload);
        } catch (error) {
          if (handleError) handleError(error as Error);
          return void task.reject(error);
        }

        task.resolve();
      }

      run();
    },
    [handler, handleError],
  ) as ((
    context: Context<M, AC>,
    payload: AC[K] extends Payload<infer P> ? P : never,
  ) => void) & { _payload: AC[K] extends Payload<infer P> ? P : never };
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
export function useActions<M extends Model, AC extends ActionsClass<any>>(
  initialModel: M,
  ActionClass: new () => ActionInstance<M, AC>,
): UseActions<M, AC> {
  const ref = React.useRef<M>(initialModel);
  const broadcast = useBroadcast();
  const [model, setModel] = React.useState<M>(initialModel);

  const snapshot = useSnapshot({ model });
  const unicast = React.useMemo(() => new EventEmitter(), []);

  const context = React.useMemo(() => {
    const controller = new AbortController();

    return <Context<M, AC>>{
      signal: controller.signal,
      actions: {
        produce(f) {
          const [model] = config.immer.produceWithPatches(ref.current, f);
          ref.current = plain(model);
          setModel(ref.current);
        },
        dispatch(...[action, payload]: [action: any, payload?: any]) {
          if (isDistributedAction(action))
            broadcast.instance.emit(action, payload);
          else unicast.emit(action, payload);
        },
      },
    };
  }, [snapshot.model]);

  const instance = React.useMemo(() => {
    const actions = new ActionClass();

    Object.getOwnPropertySymbols(actions).forEach((action) => {
      const key = action as keyof typeof actions;

      if (isDistributedAction(action)) {
        broadcast.instance.on(action, (payload) =>
          (actions[key] as Function)(context, payload),
        );
      } else {
        unicast.on(action, (payload) =>
          (actions[key] as Function)(context, payload),
        );
      }
    });

    return actions;
  }, [unicast]);

  React.useLayoutEffect(() => {
    const lifecycles = instance as unknown as {
      [key: symbol]: (context: Context<M, AC>) => void;
    };
    lifecycles[Lifecycle.Mount]?.(context);
    return () => void lifecycles[Lifecycle.Unmount]?.(context);
  }, []);

  return React.useMemo(
    () => [
      model,
      {
        dispatch(...[action, payload]: [action: any, payload?: any]) {
          if (isDistributedAction(action))
            broadcast.instance.emit(action, payload);
          else unicast.emit(action, payload);
        },
        consume() {},
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
