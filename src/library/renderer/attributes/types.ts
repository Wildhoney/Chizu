import useAttributes from ".";
import { Module } from "../../types/index.ts";
import { RendererOptions } from "../types.ts";
import { UseUpdate } from "../update/types.ts";

export type Props<M extends Module> = {
  options: RendererOptions<M>;
  update: UseUpdate;
};

export type UseAttributes = ReturnType<typeof useAttributes>;
