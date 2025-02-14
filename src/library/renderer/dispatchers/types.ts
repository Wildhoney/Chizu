import { Module } from "../../types/index.ts";
import { UseModel } from "../model/types.ts";
import { RendererOptions } from "../types.ts";
import { UseUpdate } from "../update/types.ts";
import useDispatchers from "./index.ts";

export type Props<M extends Module> = {
  options: RendererOptions<M>;
  update: UseUpdate;
  model: UseModel;
};

export type UseDispatchers = ReturnType<typeof useDispatchers>;

export type UseDispatchHandlerProps<M extends Module> = Props<M>;
