import * as React from "react";
import { useOptimisedMemo } from "../hooks";
import { Context } from "../types/index.ts";

export default function useContext<C extends Context>() {
  const use = React.useRef<Context>({});
  const registry = React.useRef<Context>({});

  function update() {
    registry.current = Object.fromEntries(
      Object.entries(use.current).map(([key, value]) => {
        return [key, React.use(value as React.Usable<C>)];
      }),
    );
  }

  update();

  return useOptimisedMemo(() => ({ use, registry, update }), []);
}
