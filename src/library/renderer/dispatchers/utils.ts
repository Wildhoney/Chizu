import { Module } from "../../types/index.ts";
import { UseDispatchHandlerProps } from "./types.ts";

export function useDispatchHandler<M extends Module>(
  props: UseDispatchHandlerProps<M>,
) {
  return (name, ƒ) => {
    return async (payload): Promise<void> => {
      const io = new Set();

      function commit(model: M["Model"]): void {
        props.model.current = model;
        props.update.rerender();
      }

      const pass = ƒ(...payload);

      while (true) {
        const result = pass.next();

        if (result.done) {
          break;
        }

        io.add(result.value());
      }

      const secondPass = ƒ(...payload);

      // It's important we don't await if we don't need to, so that actions like
      // the `Lifecycle.Mount` can run synchronously.
      const results = io.size > 0 ? await Promise.allSettled(io) : [];

      const result = secondPass.next();

      if (result.done) return void commit(result.value?.[0]);

      results.forEach((io) => {
        const result =
          io.status === "fulfilled"
            ? secondPass.next(io.value)
            : secondPass.next(null);

        if (result.done && result.value != null && result.value?.[0] != null) {
          return void commit(result.value?.[0]);
        }
      });
    };
  };
}
