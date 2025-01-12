import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import {
  Actions,
  Lifecycle,
  Model,
  Parameters,
  Routes,
  State,
} from "../../types/index.ts";
import { ModuleInstance, Props } from "./types.ts";
import dispatcher from "pubsub-js";
import { produce } from "immer";

export function useController<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>({ moduleOptions }: Props<M, A, R>) {
  const id = useId();
  const isMountInvoked = useRef<boolean>(false);
  const [model, setModel] = useState<M>(moduleOptions.model);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const actions = useMemo(
    () => ({
      controller: {
        produce(ƒ: (draft: M) => void): M {
          return produce(model, ƒ);
        },
        io(ƒ: any) {
          return ƒ;
        },
        optimistic() {},
        dispatch() {},
      },
      view: {
        dispatch<A extends Actions>([event, ...properties]: A) {
          const name = getEventName(id, event);
          dispatcher.publish(name, ...properties);
        },
        navigate() {},
      },
    }),
    [id],
  );

  const instance = useMemo(
    (): ModuleInstance<M, A, P> => ({
      id,
      controller: moduleOptions.controller({
        model,
        actions: actions.controller,
        element,
      }),
      setModel,
    }),
    [id, model, element, actions.controller],
  );

  useEffect((): void => {
    if (element && !isMountInvoked.current) {
      observeMethods(instance);
      actions.view.dispatch([Lifecycle.Mount, {}]);
      isMountInvoked.current = true;
    }
  }, [element, instance, actions.view]);

  useEffect(() => {
    return () => actions.view.dispatch([Lifecycle.Unmount, {}]);
  }, []);

  return useMemo(
    () => ({
      state: { model, element },
      actions: {
        setElement,
        viewActions: actions.view,
      },
    }),
    [model, setElement],
  );
}

/**
 * Get the event name of the subscription and dispatches.
 *
 * @param id {string}
 * @param event {string}
 * @returns {string}
 */
function getEventName(id: string, event: string) {
  return `${id}/${event}`;
}

/**
 * Iterate over the controller methods and apply the necessary subscriptions.
 *
 * @param instance {ModuleInstance<M, A, P>}
 * @returns {void}
 */
function observeMethods<
  M extends Model,
  A extends Actions,
  P extends Parameters,
>(instance: ModuleInstance<M, A, P>) {
  Object.keys(instance.controller).forEach((event) => {
    const name = getEventName(instance.id, event);

    dispatcher.subscribe(name, (_, ...data: []) =>
      updateView<M, A, P, typeof data>(instance, data, event),
    );
  });
}

/**
 * Update the view with the new model from the controller subscription.
 *
 * @param instance {ModuleInstance<M, A, P>}
 * @param data {D}
 * @param dispatchable {string}
 * @returns {void}
 */
function updateView<
  M extends Model,
  A extends Actions,
  P extends Parameters,
  D extends [],
>(instance: ModuleInstance<M, A, P>, data: D, dispatchable: string): void {
  const resolvers = new Set();
  const generator = instance.controller[dispatchable](...data);

  while (true) {
    const result = generator.next(State.Pending);

    if (!result.done) {
      resolvers.add(result.value());
      continue;
    }

    if (result.value != null) instance.setModel(result.value);
    break;
  }

  Promise.allSettled(resolvers).then((resolutions) => {
    const generator = instance.controller[dispatchable](...data);
    generator.next();

    resolutions.forEach((resolution) => {
      const result =
        resolution.status === "fulfilled"
          ? generator.next(resolution.value)
          : generator.next(State.Failed);

      if (result.done && result.value != null) instance.setModel(result.value);
    });
  });
}
