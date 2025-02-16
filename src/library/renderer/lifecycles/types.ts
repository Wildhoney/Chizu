import { Module } from "../../types/index.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UsePhase } from "../phase/types.ts";
import { UseOptions } from "../types.ts";
import useElements from "./index.ts";

export type Props<M extends Module> = {
  options: UseOptions<M>;
  dispatchers: UseDispatchers;
  phase: UsePhase;
};

export type UseElements = ReturnType<typeof useElements>;
