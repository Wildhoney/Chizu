import { Maybe } from "../../../index.ts";
import {
  ModuleDefinition,
  Operation,
  State,
  Target,
} from "../../../types/index.ts";
import { Mutations } from "../mutations/types.ts";
import { Head, Tail } from "../types.ts";
import { GeneratorFn, UseDispatchHandlerProps } from "./types.ts";
import { create } from "jsondiffpatch";

export const idAttribute = "#id";

export const patcher = create({
  objectHash(obj): undefined | string {
    return idAttribute in obj ? (obj[idAttribute] as string) : undefined;
  },
});

export function determineState(process: Symbol, x: any): Mutations {
  const mutations = new Map<string, State | Operation | Target>();
  const optimistics = new Map<string, unknown>();

  function traverse(obj: any, path: string[] = []) {
    if (!obj || typeof obj !== "object") return;

    if (obj._t === "a") {
      for (const key in obj) {
        if (key === "_t") continue;

        const key0 = key.match(/^_(\d+)/)?.[1];

        if (!Array.isArray(obj[key])) {
          for (const _ in obj[key]) {
            traverse(obj[key], [...path, key]);
          }
          continue;
        }

        if (key0) {
          const path0 = [...path, key0].join(".");
          const mutation = mutations.get(path0) ?? State.Pending;

          if (obj[key0] && obj[key0][0]) {
            mutations.set(path0, mutation | Operation.Updating);
            optimistics.set(path0, obj[key0][0]);
          } else {
            mutations.set(path0, mutation | Operation.Removing);
          }
        } else if (!key.startsWith("_")) {
          if (obj[`_${key}`]) {
            continue;
          }

          const path0 = [...path, key].join(".");
          const mutation = mutations.get(path0) ?? State.Pending;
          mutations.set(path0, mutation | Operation.Adding);
          optimistics.set(path0, obj[key][0]);
        }
      }
      return;
    }

    if (Array.isArray(obj)) {
      const isAdding = obj.length === 1;
      const isRemoving = obj.length === 3;

      const path0 = path.join(".");
      const mutation = mutations.get(path0) ?? State.Pending;
      const operation = isAdding
        ? Operation.Adding
        : isRemoving
          ? Operation.Removing
          : Operation.Updating;

      mutations.set(path0, mutation | operation);
      optimistics.set(path.join("."), isAdding ? obj[0] : obj[1]);
      return;
    }

    for (const key in obj) {
      traverse(obj[key], [...path, key]);
    }
  }

  traverse(x);

  return [...mutations.entries()].map(([path, state]) => ({
    path,
    state,
    value: optimistics.get(path),
    process,
  }));
}

export function tag<T>(model: T): T {
  if (Array.isArray(model)) {
    return model.map((item) => tag(item)) as T;
  }

  if (model && typeof model === "object") {
    const result = { ...model };
    if (!(idAttribute in result)) {
      result[idAttribute] = Symbol();
    }
    for (const key in model) {
      result[key] = tag(model[key]);
    }
    return result;
  }

  return model;
}

export function useDispatchHandler<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
) {
  return (_name: Head<M["Actions"]>, ƒ: GeneratorFn) => {
    return async (payload: Tail<M["Actions"]>): Promise<void> => {
      const process = Symbol("process");
      const task = Promise.withResolvers<void>();
      props.queue.current.add(task.promise);

      if (props.queue.current.size > 1) {
        const pendingPass = {
          duration: performance.now(),
          generator: ƒ(...payload),
        };

        while (true) {
          const result = pendingPass.generator.next(Maybe.Absent());

          if (result.done) {
            const model = props.model.current;
            // const paths = result.value(model)[1].map((mutation) => mutation.path);
            // props.mutations.current = [
            //   ...props.mutations.current,
            //   ...paths.map((path) => ({ path, state: State.Pending, process })),
            // ];
            props.update.rerender();
            break;
          }
        }

        await Promise.allSettled([...props.queue.current].slice(0, -1));
      }

      if (typeof ƒ !== "function") return;

      const io = new Set();
      const model = props.model.current;
      const discovery = ƒ(...payload);

      while (true) {
        const result = discovery.next(Maybe.Absent());

        if (result.done) {
          const x = patcher.diff(model, result.value(model));

          if (x) {
            props.mutations.current = [
              ...props.mutations.current,
              ...determineState(
                process,
                patcher.diff(model, result.value(model)),
              ),
            ];
          }
          // const differences: Record<string, unknown> = flatten(diff(model, result.value(model)));

          // props.mutations.current = [
          //   ...props.mutations.current,
          //   ...Object.entries(differences).map(([path, value]) => ({ path, state: State.Pending, process })),
          // ];

          if (io.size === 0) {
            props.model.current = tag(result.value(model));
            props.queue.current.delete(task.promise);
            task.resolve();
          }

          props.update.rerender();

          break;
        }

        io.add(result.value());
      }

      if (io.size === 0) return;

      const ios = await Promise.allSettled(io);
      const update = ƒ(...payload);
      update.next();

      ios.forEach((io) => {
        const result =
          io.status === "fulfilled"
            ? update.next(Maybe.Present(io.value))
            : update.next(Maybe.Absent());

        if (result.done) {
          props.mutations.current = props.mutations.current.filter(
            (mutation) => mutation.process !== process,
          );
          props.model.current = tag(result.value(model));
          props.queue.current.delete(task.promise);
          props.update.rerender();
          return void task.resolve();
        }
      });
    };
  };
}
