import { Maybe } from "../../../index.ts";
import {
  ModuleDefinition,
  Operation,
  State,
  Target,
} from "../../../types/index.ts";
import { Mutations } from "../mutations/types.ts";
import { Head, Tail } from "../types.ts";
import { Context, GeneratorFn, UseDispatchHandlerProps } from "./types.ts";
import { create } from "jsondiffpatch";

export const tagProperty = "#id";

export function dispatcher<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
) {
  return (_name: Head<M["Actions"]>, ƒ: GeneratorFn) => {
    return async (payload: Tail<M["Actions"]>): Promise<void> => {
      if (typeof ƒ !== "function") return;

      const process = Symbol("process");
      const task = Promise.withResolvers<void>();
      props.queue.current.add(task.promise);

      const context: Context<M> = { task, process, ƒ, payload, props };

      // if (props.queue.current.size > 1) {
      //   collate<M>(context, props.model.current, true);
      //   await Promise.allSettled([...props.queue.current].slice(0, -1));
      // }

      const model = props.model.current;
      const io = collate<M>(context, model, false);

      if (props.queue.current.size > 1) {
        await Promise.allSettled([...props.queue.current].slice(0, -1));
      }

      if (io.size === 0) return;
      await apply<M>(context, model, io);
    };
  };
}

export const patcher = create({
  objectHash(obj): undefined | string {
    return tagProperty in obj ? (obj[tagProperty] as string) : undefined;
  },
});

export function mutations(process: Symbol, differences: any): Mutations {
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
            const isRemoving = obj[key][1] === 0 && obj[key][2] === 0;
            mutations.set(
              path0,
              mutation | (isRemoving ? Operation.Removing : Operation.Moving),
            );
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

  traverse(differences);

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
    if (!(tagProperty in result)) {
      result[tagProperty] = Symbol();
    }
    for (const key in model) {
      result[key] = tag(model[key]);
    }
    return result;
  }

  return model;
}

function collate<M extends ModuleDefinition>(
  context: Context<M>,
  model: M["Model"],
  pending: boolean,
) {
  const io = new Set();
  const discovery = context.ƒ(...context.payload);

  while (true) {
    const result = discovery.next(Maybe.Absent());

    if (result.done) {
      const differences = patcher.diff(model, result.value(model));

      if (differences) {
        context.props.mutations.current = [
          ...context.props.mutations.current,
          ...mutations(
            context.process,
            patcher.diff(model, result.value(model)),
          ),
        ];
      }

      context.props.model.current = tag(result.value(model));

      if (io.size === 0 && !pending) {
        context.props.queue.current.delete(context.task.promise);
        context.task.resolve();
      }

      context.props.update.rerender();

      return io;
    }

    if (!pending) io.add(result.value());
  }
}

async function apply<M extends ModuleDefinition>(
  context: Context<M>,
  model: M["Model"],
  io: Set<unknown>,
) {
  const ios = await Promise.allSettled(io);
  const update = context.ƒ(...context.payload);
  update.next();

  ios.forEach((io) => {
    const result =
      io.status === "fulfilled"
        ? update.next(Maybe.Present(io.value))
        : update.next(Maybe.Absent());

    if (result.done) {
      context.props.mutations.current = context.props.mutations.current.filter(
        (mutation) => mutation.process !== context.process,
      );
      context.props.model.current = tag(result.value(model));
      context.props.queue.current.delete(context.task.promise);
      context.props.update.rerender();
      return void context.task.resolve();
    }
  });
}
