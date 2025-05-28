import renderer from "../module/renderer/index.tsx";
import { ModuleDefinition } from "../types/index.ts";
import { hash } from "../utils/index.ts";
import { ElementName, Options } from "./types.ts";
import * as React from "react";

export default function module<M extends ModuleDefinition>(
  name: TemplateStringsArray,
) {
  return (options: Options<M>): React.ComponentType<M["Props"]> => {
    return React.memo(
      (props: M["Props"]) =>
        renderer<M>({
          options: {
            ...options,
            name: name.join("") as ElementName,
            props,
          },
        }),
      (a, b) => hash(a) === hash(b),
    );
  };
}
