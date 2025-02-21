import { Absent, Present } from "../../functor/maybe/index.ts";
import { Module } from "../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { GeneratorFn, UseDispatchHandlerProps } from "./types.ts";

export function useDispatchHandler<M extends Module>(props: UseDispatchHandlerProps<M>) {
  return (name: Head<M["Actions"]>, ƒ: GeneratorFn) => {
    return async (payload: Tail<M["Actions"]>): Promise<void> => {
      if (props.queue.current.size > 0) {
        await Promise.allSettled([...props.queue.current].slice(1));
      }

      const model = props.model.current;

      const task = Promise.withResolvers<void>();
      props.queue.current.add(task.promise);

      function commit(model: M["Model"], duration: null | number, end: boolean): void {
        props.model.current = model;
        props.update.rerender();

        task.resolve();

        if (end) {
          props.queue.current.delete(task.promise);
          props.logger.finalPass({ event: name, model, duration });
        }
      }

      if (typeof ƒ !== "function") return;

      const io = new Set();

      const analysePass = {
        duration: performance.now(),
        generator: ƒ(...payload),
      };

      while (true) {
        const result = analysePass.generator.next(new Absent());

        if (result.done) {
          props.logger.analysePass({
            event: name,
            payload,
            io,
            duration: analysePass.duration,
            mutations: result.value?.[1],
          });

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
            ? finalPass.generator.next(new Present(io.value))
            : finalPass.generator.next(new Absent());

        if (result.done && result.value != null) {
          return void commit(result.value(model)[0], finalPass.duration, true);
        }
      });
    };
  };
}
