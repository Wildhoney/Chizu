import { ComponentChildren } from "preact";
import { Actions, Model, Routes } from "../../types/index.ts";
import { Props } from "./types.ts";
import { memo } from "preact/compat";
import render from "./utils.ts";

export default memo(
  function Tree<M extends Model, A extends Actions, R extends Routes>({
    moduleOptions,
  }: Props<M, A, R>): ComponentChildren {
    return render<M, A, R>({ moduleOptions });
  },
  () => true,
);
