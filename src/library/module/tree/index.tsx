import { Stitched } from "../../types/index.ts";
import * as React from "react";
import { TreeProps } from "./types.ts";
import { renderer } from "../../renderer/index.tsx";

export default function Tree<S extends Stitched>(
  props: TreeProps<S>,
): React.ReactNode {
  return renderer<S>(props);
}
