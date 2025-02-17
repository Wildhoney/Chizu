import { Module } from "../../types/index.ts";
import { UseDispatchHandlerProps } from "./types.ts";

export function useDispatchHandler<M extends Module>(props: UseDispatchHandlerProps<M>) {
  const colour = [...Array(6)].map(() => Math.floor(Math.random() * 14).toString(16)).join("");

  return (name, ƒ) => {
    return async (payload): Promise<void> => {
      function commit(model: M["Model"], log: boolean, secondDuration: null | number): void {
        if (log) {
          console.group(
            `Marea / %cfinal pass`,
            `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
          );
          console.groupCollapsed(props.elements.customElement.current);
          console.log("Event", name);

          if (secondDuration) {
            console.log("Time", `${performance.now() - secondDuration}ms`);
          }

          console.log("Model", model.current);
          console.groupEnd();
          console.groupEnd();
        }

        props.model.current = model;
        props.update.rerender();
      }

      if (typeof ƒ !== "function") return;

      const io = new Set();
      const optimistics = new Set();

      const firstDuration = performance.now();
      const pass = ƒ(...payload);

      while (true) {
        const result = pass.next();

        if (result.done) {
          console.group(
            `Marea / %canalyse pass`,
            `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
          );
          console.groupCollapsed(props.elements.customElement.current);
          console.log("Node", props.elements.customElement.current);
          console.log("Event", name, payload);
          console.log("Time", `${performance.now() - firstDuration}ms`);
          console.log("Actions", [...io]);
          console.log("Mutations", result.value?.[1]);
          console.groupEnd();
          console.groupEnd();

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

      const thirdDuration = performance.now();
      const thirdPass = ƒ(...payload);
      thirdPass.next();

      optimistics.forEach((optimistic) => {
        const result = thirdPass.next(optimistic);

        if (result.done && result.value != null && result.value?.[0] != null) {
          console.group(
            `Marea / %coptimistic pass`,
            `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
          );
          console.groupCollapsed(props.elements.customElement.current);
          console.log("Node", props.elements.customElement.current);
          console.log("Event", name, payload);
          console.log("Time", `${performance.now() - firstDuration}ms`);
          console.log("Actions", [...io]);
          console.log("Mutations", result.value?.[1]);
          console.groupEnd();
          console.groupEnd();

          return void commit(result.value?.[0], false, thirdDuration);
        }
      });

      const secondDuration = performance.now();
      const secondPass = ƒ(...payload);

      // It's important we don't await if we don't need to, so that actions like
      // the `Lifecycle.Mount` can run synchronously.
      const results = io.size > 0 ? await Promise.allSettled(io) : [];

      const result = secondPass.next();

      if (result.done) return void commit(result.value?.[0], true, secondDuration);

      results.forEach((io) => {
        const result = io.status === "fulfilled" ? secondPass.next(io.value) : secondPass.next(null);

        if (result.done && result.value != null && result.value?.[0] != null) {
          return void commit(result.value?.[0], true, secondDuration);
        }
      });
    };
  };
}
