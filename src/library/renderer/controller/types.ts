import { Module } from "../../types/index.ts";
import { UseActions } from "../actions/types.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UsePhase } from "../phase/types.ts";
import { RendererOptions } from "../types.ts";
import useController from "./index.ts";

export type Props<M extends Module> = {
  phase: UsePhase;
  actions: UseActions;
  options: RendererOptions<M>;
  dispatchers: UseDispatchers;
};

export type UseController = ReturnType<typeof useController>;
