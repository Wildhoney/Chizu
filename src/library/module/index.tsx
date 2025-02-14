import { Module } from "../types/index.ts";
import { Options } from "./types.ts";
import { ElementName } from "./tree/types.ts";
import * as React from "react";
import renderer from "../renderer/index.tsx";

export default function module<M extends Module>(name: TemplateStringsArray) {
  return (options: Options<M>): React.ElementType<M["Attributes"]> => {
    return React.memo(
      (attributes) =>
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
