import {
  Dispatch,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from "preact/hooks";
import {
  Actions,
  Lifecycle,
  Model,
  Parameters,
  Routes,
  State,
} from "../../types/index.ts";
import { Props, UseBindActionsReturn } from "./types.ts";
import dispatcher from "pubsub-js";
import { Immer, enablePatches } from "immer";
import { Validation, ViewActions } from "../../view/types.ts";
import {
  ControllerActions,
  ControllerInstance,
} from "../../controller/types.ts";
import * as proxies from "./proxies/index.ts";
import reducer from "./reducer/index.ts";
import { ReducerEvents, ReducerState } from "./reducer/types.ts";
import { ModuleOptions } from "../types.ts";

const immer = new Immer();
enablePatches();

/**
 * Controller hook that manages the lifecycle of the module.
 *
 * @param param0 {Props<M, A, R>}
 */
export function useController<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>({ moduleOptions: options }: Props<M, A, R>) {
  const id = useId();

  const [state, dispatch] = useReducer<ReducerState<M, A, R>, ReducerEvents<M>>(
    reducer,
    {
      id,
      model: options.model,
      options,
      element: null,
      pending: [],
    },
  );

  const actions = useBindActions(state);
  useBindController<M, A, R, P>(state, actions, options, dispatch);

  return useMemo(
    () => ({
      state: {
        model: state.model,
        element: state.element,
        actions: actions.view,
      },
      actions: {
        attachElement(element: HTMLElement) {
          dispatch({ type: "element", payload: element });
        },
      },
    }),
    [state.model, state.element],
  );
}

/**
 * Bind the controller to the module and dispatch the lifecycle events.
 *
 * @param state {ReducerState<M, A, R>}
 * @param actions {UseBindActionsReturn<M, A, R>}
 * @param options {ModuleOptions<M, A, R>}
 * @param dispatch {Dispatch<ReducerEvents<M>>}
 * @returns {ControllerInstance<A, P>}
 */
function useBindController<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>(
  state: ReducerState<M, A, R>,
  actions: UseBindActionsReturn<M, A, R>,
  options: ModuleOptions<M, A, R>,
  dispatch: Dispatch<ReducerEvents<M>>,
) {
  const controller = useMemo(
    () =>
      options.controller({
        actions: actions.controller,
        model: state.model,
        element: state.element as HTMLElement,
      }),
    [options.controller, actions.controller, state.model, state.element],
  );

  useDispatchLifecycleEvents<M, A, R, P>(state, actions, controller, dispatch);

  return controller;
}

/**
 * Bind the actions to the module.
 *
 * @param state {ReducerState<M, A, R>}
 * @returns {UseBindActionsReturn<M, A, R>}
 */
function useBindActions<M extends Model, A extends Actions, R extends Routes>(
  state: ReducerState<M, A, R>,
): UseBindActionsReturn<M, A, R> {
  return useMemo(
    () => ({
      controller: <ControllerActions<M, A, R>>{
        io: (ƒ) => ƒ,
        produce: (ƒ) => immer.produceWithPatches(state.model, ƒ),
        optimistic() {},
        dispatch() {},
        navigate() {},
      },
      view: <ViewActions<M, A, R>>{
        dispatch([event, ...properties]) {
          const name = getEventName(state.id, event);
          dispatcher.publish(name, ...properties);
        },
        navigate() {},
        validate: (ƒ: (model: Validation<M>) => boolean) =>
          ƒ(proxies.validate(state.model, state.pending)),
      },
    }),
    [state.id, state.pending],
  );
}

/**
 * Dispatch the lifecycle events when the component mounts and unmounts.
 *
 * @param state {ReducerState<M, A, R>}
 * @param actions {UseBindActionsReturn<M, A, R>}
 * @param controller {ControllerInstance<A, P>}
 * @param dispatch {Dispatch<ReducerEvents<M>>}
 * @returns {void}
 */
function useDispatchLifecycleEvents<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>(
  state: ReducerState<M, A, R>,
  actions: UseBindActionsReturn<M, A, R>,
  controller: ControllerInstance<A, P>,
  dispatch: Dispatch<ReducerEvents<M>>,
): void {
  const invoked = useRef<boolean>(false);

  useEffect((): void => {
    if (state.element && !invoked.current) {
      attachControllerMethods(state, controller, dispatch);
      actions.view.dispatch([Lifecycle.Mount, {}]);
      invoked.current = true;
    }
  }, [state.element]);

  useEffect(() => {
    return () => actions.view.dispatch([Lifecycle.Unmount, {}]);
  }, []);
}

/**
 * Get the event name of the subscription and dispatches.
 *
 * @param id {string}
 * @param event {string}
 * @returns {string}
 */
function getEventName(id: string, event: string): string {
  return `${id}/${event}`;
}

/**
 * Iterate over the controller methods and apply the necessary subscriptions.
 *
 * @param state {ReducerState<M, A, R>}
 * @param controller {ControllerInstance<A, P>}
 * @param dispatch {Dispatch<ReducerEvents<M>>}
 * @returns {void}
 */
function attachControllerMethods<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>(
  state: ReducerState<M, A, R>,
  controller: ControllerInstance<A, P>,
  dispatch: Dispatch<ReducerEvents<M>>,
) {
  Object.keys(controller).forEach((event) => {
    const name = getEventName(state.id, event);

    dispatcher.subscribe(name, (_, ...data: []) =>
      updateView<M, A, R, P, typeof data>(
        state,
        controller,
        data,
        event,
        dispatch,
      ),
    );
  });
}

/**
 * Update the view with the new model from the controller subscription.
 *
 * @param state {ReducerState<M, A, R>}
 * @param controller {ControllerInstance<A, P>}
 * @param data {D}
 * @param event {string}
 * @param dispatch {Dispatch<ReducerEvents<M>>}
 * @returns {void}
 */
function updateView<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
  D extends [],
>(
  state: ReducerState<M, A, R>,
  controller: ControllerInstance<A, P>,
  data: D,
  event: string,
  dispatch: Dispatch<ReducerEvents<M>>,
): void {
  const resolvers = new Set();
  const generator = controller[event](...data);

  while (true) {
    const result = generator.next(proxies.state(state.model, State.Pending));
    if (result.done) {
      if (result.value) {
        // const pending = result.value[1].flatMap((value) => value.path);
        // instance.setPending(pending);
      }
      break;
    }
    resolvers.add(result.value());
  }

  Promise.allSettled(resolvers).then((resolutions) => {
    const generator = controller[event](...data);
    generator.next();

    resolutions.forEach((resolution) => {
      const result =
        resolution.status === "fulfilled"
          ? generator.next(resolution.value)
          : generator.next(State.Failed);

      if (result.done && result.value != null) {
        // instance.setPending([]);
        dispatch({ type: "model", payload: result.value[0] });
      }
    });
  });
}
