import { ControllerArgs } from "../../../controller/types.ts";
import { ModuleDefinition, State } from "../../../types/index.ts";
import { ViewArgs } from "../../../view/types.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseModel } from "../model/types.ts";
import { UseMutations } from "../mutations/types.ts";
import { Process, UseProcess } from "../process/types.ts";
import { UseOptions } from "../types.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
  model: UseModel;
  dispatchers: UseDispatchers;
  mutations: UseMutations;
  process: UseProcess;
};

export type UseActions<M extends ModuleDefinition> = {
  controller: ControllerArgs<M>;
  view: ViewArgs<M>;
};

export type Mutation = { state: State; process: Process };
