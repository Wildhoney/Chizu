import { Module } from "../../types/index.ts";
import { UseElements } from "../elements/types.ts";
import { UseModel } from "../model/types.ts";
import { UseOptions } from "../types.ts";
import { UseUpdate } from "../update/types.ts";
import useDispatchers from "./index.ts";

export type Props<M extends Module> = {
  options: UseOptions<M>;
  update: UseUpdate;
  model: UseModel;
  elements: UseElements;
};

export type UseDispatchers = ReturnType<typeof useDispatchers>;

export type UseDispatchHandlerProps<M extends Module> = Props<M>;
