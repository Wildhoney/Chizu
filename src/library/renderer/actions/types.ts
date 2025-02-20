import { ControllerArgs } from "../../controller/types.ts";
import { Module } from "../../types/index.ts";
import { ViewArgs } from "../../view/types.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseModel } from "../model/types.ts";
import useActions from "./index.ts";

export type Props = {
  model: UseModel;
  dispatchers: UseDispatchers;
};

export type UseActions = ReturnType<typeof useActions>;

export type Return<M extends Module> = {
  view: ViewArgs<M>;
  controller: ControllerArgs<M>;
};
