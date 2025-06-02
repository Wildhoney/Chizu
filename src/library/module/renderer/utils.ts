import * as React from "react";
import { ModuleDefinition } from "../../types";
import { ViewArgs } from "../../view/types";

export const config = {
  elementName: "x-chizu",
};

export const Context = React.createContext(
  null,
) as React.Context<ViewArgs<ModuleDefinition> | null>;

export function useScoped<M extends ModuleDefinition>() {
  const context = React.useContext(Context);
  if (!context)
    throw new Error("useScoped is not being used within a scoped module.");
  return context as ViewArgs<M>;
}
