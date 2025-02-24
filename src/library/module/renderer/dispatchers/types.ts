import { ModuleDefinition } from "../../../types/index.ts";
import { UseElements } from "../elements/types.ts";
import { UseLogger } from "../logger/types.ts";
import { UseModel } from "../model/types.ts";
import { UseMutations } from "../mutations/types.ts";
import { UseQueue } from "../queue/types.ts";
import { UseOptions } from "../types.ts";
import { UseUpdate } from "../update/types.ts";
import useDispatchers from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
  update: UseUpdate;
  model: UseModel;
  elements: UseElements;
  logger: UseLogger;
  queue: UseQueue;
  mutations: UseMutations;
};

export type UseDispatchers = ReturnType<typeof useDispatchers>;

export type UseDispatchHandlerProps<M extends ModuleDefinition> = Props<M>;

export type Fn = (...args: any[]) => void;

export type GeneratorFn = (...args: any[]) => Generator<any, any, any>;
