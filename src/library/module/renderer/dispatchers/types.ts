import EventEmitter from "eventemitter3";
import { UseBroadcast } from "../../../broadcast/types.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { UseOptions } from "../../types.ts";
import { UseModel } from "../model/types.ts";
import { UseQueue } from "../queue/types.ts";
import { UseUpdate } from "../update/types.ts";
import useDispatchers from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  broadcast: UseBroadcast;
  options: UseOptions<M>;
  update: UseUpdate;
  model: UseModel;
  queue: UseQueue;
};

export type UseDispatchers = ReturnType<typeof useDispatchers>;

export type UseDispatchHandlerProps<M extends ModuleDefinition> = Props<M> & {
  unicast: EventEmitter;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fn = (...args: any[]) => void;
