import { ModuleDefinition } from "../../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { Context, GeneratorFn, UseDispatchHandlerProps } from "./types.ts";

export const tagProperty = "#id";

export function dispatcher<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
) {
  return (_name: Head<M["Actions"]>, ƒ: GeneratorFn<M>) => {
    return async (payload: Tail<M["Actions"]>): Promise<void> => {
      if (typeof ƒ !== "function") return;

      const process = Symbol(`process/${Math.random()}`);
      const task = Promise.withResolvers<void>();
      props.queue.current.add(task.promise);

      try {
        const context: Context<M> = { task, process, ƒ, payload, props };
        const ios = sync<M>(props, context, false);

        if (props.queue.current.size > 1) {
          await Promise.allSettled([...props.queue.current].slice(0, -1));
        }

        if (ios.size > 0) await async<M>(props, context, ios);
      } catch (error) {
        console.error("Error in dispatcher", error);
      } finally {
        props.queue.current.delete(task.promise);
        task.resolve();
      }
    };
  };
}

function sync<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
  context: Context<M>,
  pending: boolean,
) {
  const ios = new Set();
  const discovery = context.ƒ(...context.payload);

  while (true) {
    const result = discovery.next();

    if (result.done && result.value) {
      props.process.current = context.process;
      const model = result.value(context.props.model.current);
      context.props.model.current = model;
      props.process.current = null;
      context.props.update.rerender();

      return ios;
    }

    if (!pending) {
      props.process.current = context.process;
      ios.add(result.value());
      props.process.current = null;
    }
  }
}

async function async<M extends ModuleDefinition>(
  props: UseDispatchHandlerProps<M>,
  context: Context<M>,
  ios: Set<unknown>,
) {
  (await Promise.allSettled(ios)).forEach((io) => {
    props.process.current = context.process;

    const model =
      io.status === "fulfilled" && typeof io.value === "function"
        ? io.value(context.props.model.current)
        : null;

    context.props.model.current = model;
    props.process.current = null;
    props.mutations.current = new Set(
      [...props.mutations.current].filter(
        (mutation) => mutation.process !== context.process,
      ),
    );
    context.props.update.rerender();
  });
}
