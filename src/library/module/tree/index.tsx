import { ComponentChildren } from "preact";
import { Stitched } from "../../types/index.ts";
import { memo } from "preact/compat";
import render from "./utils.ts";
import { ModuleProps } from "./types.ts";

export default memo(
  function Tree<S extends Stitched>({
    moduleOptions,
  }: ModuleProps<S>): ComponentChildren {
    return render<S>({ moduleOptions });
  },
  (a, b) => JSON.stringify(a) === JSON.stringify(b),
);
