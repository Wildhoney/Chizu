import { ControllerArgs } from "../../controller/types.ts";
import { Module } from "../../types/index.ts";
import { ViewArgs } from "../../view/types.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseModel } from "../model/types.ts";

export type Props = {
  model: UseModel;
  dispatchers: UseDispatchers;
};

export type UseActions<M extends Module> = {
  view: ViewArgs<M>;
  controller: ControllerArgs<M>;
};
