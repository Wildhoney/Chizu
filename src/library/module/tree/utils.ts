import {
  Dispatch,
  StateUpdater,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { Actions, Lifecycle, Model, Routes, State } from "../../types/index.ts";
import { Props } from "./types.ts";
import dispatcher from "pubsub-js";
import { produce } from "immer";
import { ControllerDefinition } from "../../controller/types.ts";
import { ModuleOptions } from "../types.ts";

export function useController<
  M extends Model,
  A extends Actions,
  R extends Routes,
>({ moduleOptions }: Props<M, A, R>) {
  const id = useId();
  const isMountInvoked = useRef<boolean>(false);
  const [model, setModel] = useState<M>(moduleOptions.model);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const controllerActions = useMemo(
    () => ({
      produce(ƒ: (draft: M) => void): M {
        return produce(model, ƒ);
      },
      io(ƒ: any) {
        return ƒ;
      },
      optimistic() {},
      dispatch() {},
    }),
    [],
  );

  const controller = useMemo(() => {
    return moduleOptions.controller({
      model,
      actions: controllerActions,
      element,
    });
  }, [model, element, controllerActions]);

  //   useEffect((): void => {
  //     if (element && !isMountInvoked.current) {
  //       controller.mount?.({}).next();
  //       isMountInvoked.current = true;
  //     }
  //   }, [element, controller]);

  //   useEffect(() => {
  //     return () => controller.unmount?.().next();
  //   }, []);

  useEffect((): void => {
    observeMethods(id, controller, setModel);
  }, []);

  return useMemo(
    () => ({
      state: { model, element },
      actions: {
        setElement,
        viewActions: {
          dispatch([event, ...properties]: A) {
            const name = getEventName(id, event);
            dispatcher.publish(name, ...properties);
          },
          navigate() {},
        },
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
 * Iterate over the controller methods and apply subscription.
 *
 * @param id {string}
 * @param controller {ControllerDefinition<M, A, R>}
 * @param setModel {Dispatch<StateUpdater<M>>}
 * @returns {void}
 */
function observeMethods<M extends Model, A extends Actions, R extends Routes>(
  id: string,
  controller: ControllerDefinition<M, A, R>,
  setModel: Dispatch<StateUpdater<M>>,
) {
  Object.keys(controller).forEach((event) => {
    const name = getEventName(id, event);

    dispatcher.subscribe(name, (name, ...data: []) => {
      updateView(controller, name, data, event, setModel);
    });
  });
}

/**
 * Update the view with the new model from the controller subscription.
 *
 * @param controller {ControllerDefinition<M, A, R>}
 * @param name {string}
 * @param data {D}
 * @param dispatchable {string}
 * @param setModel {Dispatch<StateUpdater<M>>}
 * @returns {void}
 */
function updateView<
  M extends Model,
  A extends Actions,
  R extends Routes,
  D extends [],
>(
  controller: ControllerDefinition<M, A, R>,
  name: string,
  data: D,
  dispatchable: string,
  setModel: Dispatch<StateUpdater<M>>,
): void {
  const resolvers = new Set();

  const generator = controller[dispatchable](...data);

  while (true) {
    const result = generator.next(State.Pending);

    if (!result.done) {
      resolvers.add(result.value());
      continue;
    }

    setModel(result.value);
    break;
  }

  Promise.allSettled(resolvers).then((resolutions) => {
    const generator = controller[dispatchable](...data);
    generator.next();

    resolutions.forEach((resolution) => {
      const result = generator.next(resolution.value);
      if (result.done) setModel(result.value);
    });
  });
}
