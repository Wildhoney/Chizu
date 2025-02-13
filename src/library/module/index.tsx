import { Stitched } from "../types/index.ts";
import { Options } from "./types.ts";
import { ElementName } from "./tree/types.ts";
import * as React from "react";
import renderer from "../renderer/index.tsx";

export default function module<S extends Stitched>(name: TemplateStringsArray) {
  return (options: Options<S>): React.ElementType<S["Props"]> => {
    return React.memo(
      (attributes) =>
        renderer<S>({
          name: name.join("") as ElementName,
          attributes,
          options,
        }),
      (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
  };
}
