import { Maybe } from "../../../index.ts";
import { ModuleDefinition, State } from "../../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { GeneratorFn, UseDispatchHandlerProps } from "./types.ts";

export function useDispatchHandler<M extends ModuleDefinition>(props: UseDispatchHandlerProps<M>) {
  return (_name: Head<M["Actions"]>, ƒ: GeneratorFn) => {
    return async (payload: Tail<M["Actions"]>): Promise<void> => {
      const task = Promise.withResolvers<void>();
      props.queue.current.add(task.promise);

      if (props.queue.current.size > 1) {
        await Promise.allSettled([...props.queue.current].slice(0, -1));
      }

      const model = props.model.current;

      function commit(model: M["Model"], _duration: null | number, end: boolean): void {
        props.model.current = model;
        props.update.rerender();

        if (end) {
          props.mutations.current = [];
          props.queue.current.delete(task.promise);
          task.resolve();
        }
      }

      if (typeof ƒ !== "function") return;

      const io = new Set();

      const analysePass = {
        duration: performance.now(),
        generator: ƒ(...payload),
      };

      while (true) {
        const result = analysePass.generator.next(Maybe.Absent());

        if (result.done) {
          const paths = result.value(model)[1].map((mutation) => mutation.path);
          props.mutations.current = paths.map((path) => ({ path, state: State.Pending }));
          commit(result.value(model)[0], null, io.size === 0);
          break;
        }

        io.add(result.value());
      }

      if (io.size === 0) return;

      const finalPass = {
        duration: performance.now(),
        generator: ƒ(...payload),
      };

      // It's important we don't await if we don't need to, so that actions like
      // the `Lifecycle.Mount` can run synchronously.
      const results = io.size > 0 ? await Promise.allSettled(io) : [];
      const result = finalPass.generator.next();

      if (result.done) return void commit(result.value(model)[0], finalPass.duration, true);

      results.forEach((io) => {
        const result =
          io.status === "fulfilled"
            ? finalPass.generator.next(Maybe.Present(io.value))
            : finalPass.generator.next(Maybe.Absent());

        if (result.done && result.value != null) {
          return void commit(result.value(model)[0], finalPass.duration, true);
        }
      });
    };
  };
}
