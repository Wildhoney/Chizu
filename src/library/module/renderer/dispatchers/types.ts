import { UseApp } from "../../../app/types.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { UseLogger } from "../logger/types.ts";
import { UseModel } from "../model/types.ts";
import { Models } from "../model/utils.ts";
import { UseProcess } from "../process/types.ts";
import { UseQueue } from "../queue/types.ts";
import { UseOptions } from "../types.ts";
import { UseUpdate } from "../update/types.ts";
import useDispatchers from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  app: UseApp;
  options: UseOptions<M>;
  update: UseUpdate;
  model: UseModel;
  logger: UseLogger;
  queue: UseQueue;
  process: UseProcess;
};

export type UseDispatchers = ReturnType<typeof useDispatchers>;

export type UseDispatchHandlerProps<M extends ModuleDefinition> = Props<M>;

export type Fn = (...args: any[]) => void;

export type GeneratorFn<M extends ModuleDefinition> = (
  ...args: any[]
) => Generator<any, Models<M["Model"]>, any>;
