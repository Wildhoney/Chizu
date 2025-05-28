import { UseApp } from "../../../app/types.ts";
import { ControllerArgs } from "../../../controller/types.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { ViewArgs } from "../../../view/types.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseModel } from "../model/types.ts";
import { UseProps } from "../props/types.ts";
import { UseRouter } from "../router/types.ts";
import { UseOptions } from "../types.ts";

export type Props<M extends ModuleDefinition> = {
  app: UseApp;
  options: UseOptions<M>;
  model: UseModel;
  dispatchers: UseDispatchers;
  router: UseRouter;
  props: UseProps;
};

export type UseActions<M extends ModuleDefinition> = {
  controller: ControllerArgs<M>;
  view: ViewArgs<M>;
};
