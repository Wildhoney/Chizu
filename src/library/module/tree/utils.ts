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
import { Immer } from "immer";
import { Validation, ViewActions } from "../../view/types.ts";
import { ControllerActions } from "../../controller/types.ts";
import * as proxies from "./proxies/index.ts";

const immer = new Immer();

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
      controller: <ControllerActions<M, A, R>>{
        io: (ƒ) => ƒ,
        produce: (ƒ) => immer.produce(model, ƒ),
        optimistic() {},
        dispatch() {},
        navigate() {},
      },
      view: <ViewActions<M, A, R>>{
        dispatch([event, ...properties]) {
          const name = getEventName(id, event);
          dispatcher.publish(name, ...properties);
        },
        navigate() {},
        validate: (ƒ: (model: Validation<M>) => boolean) => ƒ(model),
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
      model,
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
      state: {
        model,
        element,
      },
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
    const result = generator.next(proxies.state(instance.model, State.Pending));
    if (result.done) break;
    resolvers.add(result.value());
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
