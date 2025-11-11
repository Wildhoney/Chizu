/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { config, useActionCallback, withGetters } from "./utils.ts";
import {
  Context,
  Lifecycle,
  Model,
  Payload,
  Props,
  ActionsClass,
  Actions,
  Operations,
  Process,
  Action,
} from "../types/index.ts";
import EventEmitter from "eventemitter3";
import { useBroadcast } from "../broadcast/index.tsx";
import { isDistributedAction } from "../action/index.ts";
import { useActionError } from "../error/index.tsx";
import { Store } from "./types.ts";
import { Annotation, reconcile } from "../annotate/utils.ts";
import { validateable } from "../annotate/index.ts";

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
  K extends never | Exclude<keyof AC, "prototype"> = never,
>(
  handler: (
    context: Context<M, AC>,
    payload: AC[K] extends Payload<infer P> ? P : never,
  ) => void | Promise<void> | AsyncGenerator | Generator,
) {
  const handleError = useActionError();

  return useActionCallback(
    async (
      context: Context<M, AC>,
      payload: AC[K] extends Payload<infer P> ? P : never,
    ) => {
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
        console.error("Chizu\n\n", error);
        handleError?.(error as Error);
      }
    },
    [handler, handleError],
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
export function useActions<M extends Model, AC extends Actions<M, AC>>(
  initialModel: M,
  ActionClass: AC,
) {
  const broadcast = useBroadcast();
  const [model, setModel] = React.useState<M>(initialModel);

  const refs = {
    model: React.useRef<M>(initialModel),
    store: React.useRef<Store>({}),
  };

  const snapshot = useSnapshot({ model });
  const unicast = React.useMemo(() => new EventEmitter(), []);

  const getContext = React.useCallback(
    (process: Process) => {
      const controller = new AbortController();

      return <Context<M, AC>>{
        signal: controller.signal,
        actions: {
          produce(f) {
            const model = config.immer.produce(refs.model.current, () =>
              f(refs.model.current),
            );

            refs.model.current = reconcile(model, refs.store);

            setModel(refs.model.current);
          },
          dispatch(...[action, payload]: [action: any, payload?: any]) {
            if (isDistributedAction(action))
              broadcast.instance.emit(action, payload);
            else unicast.emit(action, payload);
          },
          annotate<T>(value: T, operations: Operations<T>): T {
            return new Annotation<T>(value, operations, process) as T;
          },
        },
      };
    },
    [snapshot.model],
  );

  React.useLayoutEffect(() => {
    const actions = new ActionClass();

    Object.getOwnPropertySymbols(actions).forEach((action) => {
      const key = action as keyof typeof actions;

      if (isDistributedAction(action)) {
        return void broadcast.instance.on(action, async (payload) => {
          const task = Promise.withResolvers<void>();
          const process = Symbol("chizu/process");

          await (actions[key] as Function)(getContext(process), payload);
          for (const x of Object.values(refs.store.current)) x?.clean(process);
          task.resolve();
        });
      }

      unicast.on(action, async (payload) => {
        const task = Promise.withResolvers<void>();
        const process = Symbol("chizu/process");
        await (actions[key] as Function)(getContext(process), payload);
        for (const x of Object.values(refs.store.current)) x?.clean(process);
        task.resolve();
      });
    });
  }, [unicast]);

  React.useLayoutEffect(() => {
    unicast.emit(Lifecycle.Mount);
    return () => void unicast.emit(Lifecycle.Unmount);
  }, []);

  return React.useMemo(
    () => [
      model,
      {
        dispatch(...[action, payload]: [action: Action, payload?: Payload]) {
          if (isDistributedAction(action))
            broadcast.instance.emit(action, payload);
          else unicast.emit(action, payload);
        },
        consume() {},
        get validate() {
          return validateable(model);
        },
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
