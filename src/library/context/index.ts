import * as React from "react";
import { useOptimisedMemo } from "../hooks";
import { Context, ContextType, ContextTypes } from "../types/index.ts";

export default function useContext<C extends Context>() {
  const use = React.useRef<C>({} as C);
  const values = React.useRef<ContextTypes<C>>({} as ContextTypes<C>);

  function update() {
    values.current = Object.fromEntries(
      Object.entries(use.current).map(([key, value]) => {
        return [key, React.use(value as React.Usable<ContextType<C>>)];
      }),
    ) as unknown as ContextTypes<C>;
  }

  update();

  return useOptimisedMemo(() => ({ use, values, update }), []);
}
