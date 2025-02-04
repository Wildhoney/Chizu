import { ComponentChildren } from "preact";
import { Actions, Model, Routes } from "../../types/index.ts";
import { memo } from "preact/compat";
import render from "./utils.ts";
import { ModuleProps } from "./types.ts";

export default memo(
  function Tree<M extends Model, A extends Actions, R extends Routes>({
    moduleOptions,
  }: ModuleProps<M, A, R>): ComponentChildren {
    return render<M, A, R>({ moduleOptions });
  },
  () => true,
);
