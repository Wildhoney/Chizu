import { Module } from "../../types/index.ts";
import { UseDispatchHandlerProps } from "./types.ts";

export function useDispatchHandler<M extends Module>(props: UseDispatchHandlerProps<M>) {
  const colour = [...Array(6)].map(() => Math.floor(Math.random() * 14).toString(16)).join("");

  return (name, ƒ) => {
    return async (payload): Promise<void> => {
      function commit(model: M["Model"], log: boolean, duration: null | number): void {
        if (log) {
          props.logger.finalPass();
        }

        props.model.current = model;
        props.update.rerender();
      }

      if (typeof ƒ !== "function") return;

      const io = new Set();
      const optimistics = new Set();

      const analysePass = {
        duration: performance.now(),
        generator: ƒ(...payload),
      };

      while (true) {
        const result = analysePass.generator.next();

        if (result.done) {
          props.logger.analysePass({
            event: name,
            payload,
            io,
            duration: analysePass.duration,
            mutations: result.value?.[1],
          });

          if (io.size === 0) {
            return void commit(result.value?.[0], false, null);
          }

          break;
        }

        const [ƒ, optimistic] = result.value;
        io.add(ƒ());
        optimistics.add(optimistic);
      }

      if (io.size === 0) return;

      const optimisticPass = {
        duration: performance.now(),
        generator: ƒ(...payload),
      };
      optimisticPass.generator.next();

      optimistics.forEach((optimistic) => {
        const result = optimisticPass.generator.next(optimistic);

        if (result.done && result.value != null && result.value?.[0] != null) {
          props.logger.optimisticPass({
            event: name,
            payload,
            io,
            duration: optimisticPass.duration,
            mutations: result.value,
          });

          return void commit(result.value?.[0], false, optimisticPass.duration);
        }
      });

      const finalPass = {
        duration: performance.now(),
        generator: ƒ(...payload),
      };

      // It's important we don't await if we don't need to, so that actions like
      // the `Lifecycle.Mount` can run synchronously.
      const results = io.size > 0 ? await Promise.allSettled(io) : [];
      const result = finalPass.generator.next();

      if (result.done) return void commit(result.value?.[0], true, finalPass.duration);

      results.forEach((io) => {
        const result = io.status === "fulfilled" ? finalPass.generator.next(io.value) : finalPass.generator.next(null);

        if (result.done && result.value != null && result.value?.[0] != null) {
          return void commit(result.value?.[0], true, finalPass.duration);
        }
      });
    };
  };
}
