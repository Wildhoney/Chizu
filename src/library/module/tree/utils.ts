import { ComponentChildren, h } from "preact";
import {
  ModuleContext,
  ModuleDispatchers,
  Props,
  ModuleState,
  ModuleQueue,
} from "./types";
import {
  MutableRef,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "preact/hooks";
import {
  Actions,
  Data,
  Lifecycle,
  Model,
  Name,
  Routes,
  State,
} from "../../types/index.ts";
import { enablePatches, Immer } from "immer";
import { appContext } from "../../app/index.ts";
import EventEmitter from "eventemitter3";
import { Validation } from "../../view/types.ts";

const immer = new Immer();
enablePatches();

/**
 * Render the module tree with the given options.
 *
 * @param moduleOptions {ModuleOptions<M, A, R> & { elementName: ElementName }}
 * @returns {ComponentChildren}
 */
export default function render<
  M extends Model,
  A extends Actions,
  R extends Routes,
>({ moduleOptions }: Props<M, A, R>): ComponentChildren {
  const bootstrapped = useRef<boolean>(false);
  const dispatchers = useModuleDispatchers();
  const model = useRef<M>(moduleOptions.model);
  const element = useRef<null | HTMLElement>(null);
  const scene = useRef<number>(1_000);
  const queue = useRef<ModuleQueue>(new Set<Promise<void>>());
  const [index, update] = useReducer<number, void>((index) => index + 1, 0);
  const state = useRef<ModuleState<M, A, R>>(
    getModuleState<M, A, R>(model, element, dispatchers),
  );

  if (!bootstrapped.current) {
    bootstrapped.current = true;

    const controller = moduleOptions.controller(state.current.controller);
    const context = [model, controller, update, scene, queue] as ModuleContext<
      M,
      A
    >;
    bindActions(state, dispatchers, context);
    dispatchUpdate(<A>[Lifecycle.Mount], state, context);
  }

  useEffect(() => {
    dispatchers.module.emit(Lifecycle.DOM, []);
    return () => dispatchers.module.emit(Lifecycle.Unmount, []);
  }, []);

  return useMemo(
    () =>
      h(moduleOptions.elementName, {
        ref: element,
        children: moduleOptions.view(state.current.view),
      }),
    [index],
  );
}

/**
 * Get both the app dispatch from the app context and the module dispatcher.
 *
 * @returns {ModuleDispatchers<A>}
 */
function useModuleDispatchers() {
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
 * @param model {MutableRef<M>}
 * @param element {MutableRef<null | HTMLElement>}
 * @param dispatches {ModuleDispatchers<A>}
 * @returns {ModuleState<M, A, R>}
 */
function getModuleState<M extends Model, A extends Actions, R extends Routes>(
  model: MutableRef<M>,
  element: MutableRef<null | HTMLElement>,
  dispatches: ModuleDispatchers<A>,
): ModuleState<M, A, R> {
  return {
    controller: {
      get model() {
        return model.current;
      },
      get element() {
        return element.current;
      },
      actions: {
        io: <T>(ƒ: () => T): (() => T) => ƒ,
        produce: (ƒ) => immer.produceWithPatches(model.current, ƒ),
        dispatch([action, ...data]: A) {
          dispatches.module.emit(action, data);
        },
        navigate() {},
      },
    },
    view: {
      get model() {
        return model.current;
      },
      get element() {
        return element.current;
      },
      actions: {
        validate: <T>(ƒ: (model: Validation<M>) => T): T => ƒ(model.current),
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
 * @param state {MutableRef<ModuleState<M, A, R>>}
 * @param context {ModuleContext<M, A>}
 * @returns {void}
 */
async function dispatchUpdate<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(
  action: A,
  _state: MutableRef<ModuleState<M, A, R>>,
  [model, controller, update, scene, queue]: ModuleContext<M, A>,
) {
  const now = performance.now();

  const task = Promise.withResolvers<void>();
  queue.current.add(task.promise);

  const name = scene.current.toString(16);
  const [event, ...data] = action;
  const io = new Set();

  const passes = {
    first: controller[<Name<A>>event](...data),
    second: controller[<Name<A>>event](...data),
  };

  while (true) {
    const result = passes.first.next();

    if (result.done) {
      const mutations =
        result.value?.[1].flatMap((value) => ({
          path: value.path,
          state: State.Pending,
        })) ?? [];

      console.group(`${name} (1st pass)`);
      console.log(`Event: ${event}`);
      console.log(`Time: ${performance.now() - now}ms`);
      console.log("Mutations", mutations);
      console.groupEnd();
      break;
    }

    io.add(result.value());
  }

  update();

  await Promise.all([...queue.current].slice(0, -1));

  if (io.size === 0) {
    task.resolve();
    queue.current.delete(task.promise);
    return;
  }

  Promise.allSettled(io).then((io) => {
    if (passes.second == null) return;

    passes.second.next();

    io.forEach((io) => {
      const result =
        io.status === "fulfilled"
          ? passes.second.next(io.value)
          : passes.second.next(null);

      if (result.done && result.value != null && result.value?.[0] != null) {
        model.current = result.value[0];
        update();

        console.group(`${name} (2nd pass)`);
        console.log(`Event: ${event}`);
        console.log(`Time: ${performance.now() - now}ms`);
        console.log("Model", model.current);
        console.groupEnd();

        scene.current += 50;
      }

      if (result.done) {
        task.resolve();
        queue.current.delete(task.promise);
      }
    });
  });
}

/**
 * Bind the actions to the module.
 *
 * @param state {MutableRef<ModuleState<M, A, R>>}
 * @param dispatches {ModuleDispatchers<A>}
 * @param context {ModuleContext<M, A>}
 * @returns {void}
 */
function bindActions<M extends Model, A extends Actions, R extends Routes>(
  state: MutableRef<ModuleState<M, A, R>>,
  dispatches: ModuleDispatchers<A>,
  [model, controller, update, scene, queue]: ModuleContext<M, A>,
) {
  Object.keys(controller)
    .filter((action) => action !== Lifecycle.Mount)
    .forEach((action) => {
      dispatches.module.on(<Name<A>>action, (data: Data) => {
        dispatchUpdate(<A>[action, ...data], state, [
          model,
          controller,
          update,
          scene,
          queue,
        ]);
      });
    });
}
