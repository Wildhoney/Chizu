import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { Actions, Lifecycle, Model, Routes, State } from "../../types/index.ts";
import { Props } from "./types.ts";
import dispatcher from "pubsub-js";
import { produce } from "immer";

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
    const dispatchables = Object.keys(controller).forEach((dispatchable) => {
      const event = `${id}::${dispatchable}`;
      dispatcher.subscribe(event, (event, ...properties) => {
        const resolvers = new Set();

        const generator = controller[dispatchable](...properties);

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
          const generator = controller[dispatchable](...properties);
          generator.next();

          resolutions.forEach((resolution) => {
            const result = generator.next(resolution.value);
            if (result.done) setModel(result.value);
          });
        });
      });
    });
  }, []);

  return useMemo(
    () => ({
      state: { model, element },
      actions: {
        setElement,
        viewActions: {
          dispatch([event, ...properties]: A) {
            dispatcher.publish(`${id}::${event}`, ...properties);
          },
          navigate() {},
        },
      },
    }),
    [model, setElement],
  );
}
