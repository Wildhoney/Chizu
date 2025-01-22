import { ComponentChildren, h } from "preact";
import { Dispatchers, Props, State, Update } from "./types";
import { useContext, useMemo, useReducer, useRef } from "preact/hooks";
import {
  Actions,
  Data,
  Lifecycle,
  Model,
  Name,
  Parameters,
  Routes,
} from "../../types/index.ts";
import { ControllerInstance } from "../../controller/types.ts";
import { enablePatches, Immer } from "immer";
import { appContext } from "../../app/index.ts";
import EventEmitter from "eventemitter3";
import { Validation } from "../../view/types.ts";

const immer = new Immer();
enablePatches();

/**
 * Render the module tree with the given options.
 *
 * @param props {Props<M, A, R>}
 * @returns {ComponentChildren}
 */
export default function render<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(props: Props<M, A, R>): ComponentChildren {
  const bootstrapped = useRef<boolean>(false);
  const dispatchers = useDispatchers();
  const [index, update] = useReducer<number, void>((index) => index + 1, 0);
  const state = useRef<State<M, A, R>>(
    getState<M, A, R>(props.moduleOptions.model, dispatchers),
  );

  if (!bootstrapped.current) {
    bootstrapped.current = true;

    const controller = props.moduleOptions.controller(state.current.controller);
    bindActions(controller, state.current, dispatchers, update);
    // dispatchUpdate(<A>[Lifecycle.Mount], controller, state.current, update);
  }

  return useMemo(
    () =>
      h(props.moduleOptions.elementName, {
        ref(element: null | HTMLElement): void {
          state.current.controller.element = element;
          state.current.view.element = element;
        },
        children: props.moduleOptions.view(state.current.view),
      }),
    [index],
  );
}

/**
 * Get both the app dispatch from the app context and the module dispatcher.
 *
 * @returns {Dispatchers<A>}
 */
function useDispatchers() {
  const app = useContext(appContext);
  const moduleDispatcher = useRef(new EventEmitter());

  return useMemo(
    () => ({
      app,
      module: moduleDispatcher.current,
    }),
    [],
  );
}

/**
 * Get the initial state of the module.
 *
 * @param model {M}
 * @param dispatches {Dispatchers<A>}
 * @returns {State<M, A, R>}
 */
function getState<M extends Model, A extends Actions, R extends Routes>(
  model: M,
  dispatches: Dispatchers<A>,
): State<M, A, R> {
  return {
    controller: {
      element: null,
      model,
      actions: {
        io: <T>(ƒ: () => T): (() => T) => ƒ,
        produce: (ƒ) => immer.produceWithPatches(model, ƒ),
        dispatch([action, ...data]: A) {
          dispatches.module.emit(action, data);
        },
        navigate() {},
      },
    },
    view: {
      element: null,
      model,
      actions: {
        validate: <T>(ƒ: (model: Validation<M>) => T): T => ƒ(model),
        dispatch([action, ...data]: A) {
          dispatches.module.emit(action, data);
        },
        navigate() {},
      },
    },
  };
}

/**
 * Dispatch the update to the controller and synchronise the view.
 *
 * @param action {A}
 * @param controller {ControllerInstance<A, Parameters>}
 * @param state {State<M, A, R>}
 * @param update {Update}
 * @returns {void}
 */
function dispatchUpdate<M extends Model, A extends Actions, R extends Routes>(
  action: A,
  controller: ControllerInstance<A, Parameters>,
  state: State<M, A, R>,
  update: Update,
) {
  const [event, ...data] = action;
  const io = new Set();

  const passes = {
    first: controller[<Name<A>>event](...data),
    second: controller[<Name<A>>event](...data),
  };

  while (true) {
    const result = passes.first.next();

    if (result.done) {
      // const pending = (result.value[1].flatMap(value => value.path));
      break;
    }

    io.add(result.value());
  }

  update();

  Promise.allSettled(io).then((io) => {
    if (passes.second == null) return;

    passes.second.next();

    io.forEach((io) => {
      const result =
        io.status === "fulfilled"
          ? passes.second.next(io.value)
          : passes.second.next(null);

      if (result.done && result.value != null && result.value?.[0] != null) {
        const model = result.value[0];
        state.controller.model = model;
        state.view.model = model;
        update();
      }
    });
  });
}

/**
 * Bind the actions to the module.
 *
 * @param controller {ControllerInstance<A, Parameters>}
 * @param state {State<M, A, R>}
 * @param dispatches {Dispatchers<A>}
 * @param update {Update}
 * @returns {void}
 */
function bindActions<M extends Model, A extends Actions, R extends Routes>(
  controller: ControllerInstance<A, Parameters>,
  state: State<M, A, R>,
  dispatches: Dispatchers<A>,
  update: Update,
) {
  Object.keys(controller)
    .filter((action) => action !== Lifecycle.Mount)
    .forEach((action) => {
      dispatches.module.on(<Name<A>>action, (data: Data) => {
        dispatchUpdate(<A>[action, ...data], controller, state, update);
      });
    });
}
