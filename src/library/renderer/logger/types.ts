import { Module } from "../../types/index.ts";
import { UseElements } from "../elements/types.ts";
import { UseOptions } from "../types.ts";
import useLogger from "./index.ts";

export type Props<M extends Module> = {
  options: UseOptions<M>;
  elements: UseElements;
};

export type UseLogger = ReturnType<typeof useLogger>;

export type AnalysePassProps = {
  event: string;
  payload: any;
  io: Set<any>;
  duration: number;
  mutations: any;
};

export type OptimisticPassProps = {
  event: string;
  payload: any;
  io: Set<any>;
  duration: number;
  mutations: any;
};

export type FinalPassProps = {
  event: string;
  model: any;
  duration: number;
};
