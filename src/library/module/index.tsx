import renderer from "../module/renderer/index.tsx";
import { ModuleDefinition } from "../types/index.ts";
import { ElementName, Options } from "./types.ts";
import * as React from "react";

export default function module<M extends ModuleDefinition>(
  name: TemplateStringsArray,
) {
  return (options: Options<M>): React.ElementType<M["Attributes"]> => {
    return React.memo(
      (attributes: M["Attributes"]) =>
        renderer<M>({
          options: {
            ...options,
            name: name.join("") as ElementName,
            attributes,
          },
        }),
      (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
  };
}
