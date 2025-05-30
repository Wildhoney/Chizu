import * as React from "react";
import { ModuleDefinition } from "../../types";
import { ViewArgs } from "../../view/types";

export const Context = React.createContext(null);

export function useModule<M extends ModuleDefinition>() {
  const context = React.useContext(Context);
  if (!context) throw new Error("useModule must be used within a module.");
  return context as ViewArgs<M>;
}
