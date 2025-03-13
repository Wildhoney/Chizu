import { ModuleDefinition } from "../../../types/index.ts";
import { inspect } from "../../../utils/mark/index.ts";
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

      try {
        const context: Context<M> = { task, process, ƒ, payload, props };
        const ios = sync<M>(context, false);

        if (props.queue.current.size > 1) {
          await Promise.allSettled([...props.queue.current].slice(0, -1));
        }

        if (ios.size > 0) await async<M>(context, ios);
      } catch (error) {
        console.error("Error in dispatcher", error);
      } finally {
        props.queue.current.delete(task.promise);
        task.resolve();
      }
    };
  };
}

export const patcher = create({
  objectHash(obj): undefined | string {
    return tagProperty in obj ? (obj[tagProperty] as string) : undefined;
  },
});

function sync<M extends ModuleDefinition>(
  context: Context<M>,
  pending: boolean,
) {
  const ios = new Set();
  const discovery = context.ƒ(...context.payload);

  while (true) {
    const result = discovery.next();

    if (result.done) {
      // if (differences && ios.size > 0) {
      // context.props.mutations.current = [
      //   ...context.props.mutations.current,
      //   ...mutations(context.process, differences),
      // ];
      // }

      const mutations = new Set<string>();
      context.props.model.current = inspect(
        result.value(context.props.model.current),
        "",
        mutations,
      );
      console.log(mutations);
      context.props.update.rerender();
      return ios;
    }

    if (!pending) ios.add(result.value());
  }
}

async function async<M extends ModuleDefinition>(
  context: Context<M>,
  ios: Set<unknown>,
) {
  (await Promise.allSettled(ios)).forEach((io) => {
    const model =
      io.status === "fulfilled" && typeof io.value === "function"
        ? io.value(context.props.model.current)
        : null;

    if (model) {
      context.props.model.current = inspect(model);
      context.props.update.rerender();
    }
  });

  // context.props.mutations.current = context.props.mutations.current.filter(
  //   (mutation) => mutation.process !== context.process,
  // );
}
