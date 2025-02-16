import { Module } from "../../types/index.ts";
import { UseDispatchHandlerProps } from "./types.ts";

export function useDispatchHandler<M extends Module>(props: UseDispatchHandlerProps<M>) {
  const colour = [...Array(6)].map(() => Math.floor(Math.random() * 14).toString(16)).join("");

  function commit(model: M["Model"], log: boolean): void {
    if (log) {
      console.groupCollapsed(
        `Marea / %c ${props.options.name} - ${"xxx"} (2nd pass) `,
        `background: #${colour}; color: white; border-radius: 2px`,
      );
      console.log("Node", props.elements.customElement.current);
      // console.log("Event", event);
      // console.log("Time", `${performance.now() - now}ms`);
      console.log("Model", model.current);
      console.groupEnd();
    }

    props.model.current = model;
    props.update.rerender();
  }

  return (name, ƒ) => {
    return async (payload): Promise<void> => {
      const now = performance.now();

      if (typeof ƒ !== "function") return;

      const io = new Set();

      const pass = ƒ(...payload);

      while (true) {
        const result = pass.next();

        if (result.done) {
          console.groupCollapsed(
            `Marea / %c ${props.options.name} - ${"xxx"} (${io.size > 0 ? "1st" : "single"} pass) `,
            `background: #${colour}; color: white; border-radius: 2px`,
          );
          console.log("Node", props.elements.customElement.current);
          console.log("Event", name);
          console.log("Time", `${performance.now() - now}ms`);
          console.log("Actions", [...io]);
          console.log("Mutations", result.value?.[1]);
          console.groupEnd();

          if (io.size === 0) {
            return void commit(result.value?.[0], false);
          }

          break;
        }

        io.add(result.value());
      }

      if (io.size === 0) return;

      const secondPass = ƒ(...payload);

      // It's important we don't await if we don't need to, so that actions like
      // the `Lifecycle.Mount` can run synchronously.
      const results = io.size > 0 ? await Promise.allSettled(io) : [];

      const result = secondPass.next();

      if (result.done) return void commit(result.value?.[0], true);

      results.forEach((io) => {
        const result = io.status === "fulfilled" ? secondPass.next(io.value) : secondPass.next(null);

        if (result.done && result.value != null && result.value?.[0] != null) {
          return void commit(result.value?.[0], true);
        }
      });
    };
  };
}
