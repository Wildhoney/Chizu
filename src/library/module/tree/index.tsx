import { Stitched } from "../../types/index.ts";
import * as React from "react";
import render from "./utils.ts";
import { ModuleProps } from "./types.ts";

export default React.memo(
  function Tree<S extends Stitched>({
    moduleOptions,
  }: ModuleProps<S>): React.ReactNode {
    return render<S>({ moduleOptions });
  },
  (a, b) => JSON.stringify(a) === JSON.stringify(b),
);
