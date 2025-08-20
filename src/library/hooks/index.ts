/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { config, getCallbackFunction, withGetters } from "./utils.ts";
import {
  Context,
  Lifecycle,
  Model,
  Payload,
  Props,
  ActionsClass,
  Handlers,
} from "../types/index.ts";
import EventEmitter from "eventemitter3";
import { useBroadcast } from "../broadcast/index.tsx";
import { isDistributedAction } from "../action/index.ts";
import { useActionError } from "../error/index.tsx";
import { Store } from "./types.ts";
import { reconcile } from "../annotate/utils.ts";

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
  return getCallbackFunction()(
    (
      context: Context<M, AC>,
      payload: AC[K] extends Payload<infer P> ? P : never,
    ) => {
      async function run() {
        const task = Promise.withResolvers<void>();

        try {
          const isGenerator =
            handler.constructor.name === "GeneratorFunction" ||
            handler.constructor.name === "AsyncGeneratorFunction";

          if (isGenerator) {
            const generator = handler(context, payload) as
              | Generator
              | AsyncGenerator;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of generator) void 0;
          } else {
            await handler(context, payload);
          }
        } catch (error) {
          if (handleError) handleError(error as Error);
        } finally {
          task.resolve();
        }
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
export function useActions<M extends Model, AC extends Handlers<M, AC>>(
  initialModel: M,
  ActionClass: AC,
) {
  const broadcast = useBroadcast();
  const [model, setModel] = React.useState<M>(initialModel);

  const refs = {
    viewModel: React.useRef<M>(initialModel),
    produceModel: React.useRef(initialModel),
    annotationStore: React.useRef<Store>({}),
  };

  const snapshot = useSnapshot({ model });
  const unicast = React.useMemo(() => new EventEmitter(), []);

  const context = React.useMemo(() => {
    const controller = new AbortController();

    return <Context<M, AC>>{
      signal: controller.signal,
      actions: {
        produce(f) {
          const model = config.immer.produce(refs.viewModel.current, () =>
            f(refs.viewModel.current, refs.produceModel.current),
          );
          refs.viewModel.current = reconcile(
            model,
            refs.produceModel,
            refs.annotationStore,
          );
          setModel(refs.viewModel.current);
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
