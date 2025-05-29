import { ModuleDefinition } from "../../types/index.ts";
import { UseOptions } from "../types.ts";

export type ElementName = string;

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

export type Head<T extends any[]> = T extends [infer X, ...any[]] ? X : never;

export type Tail<T extends any[]> = T extends [any, ...infer XS] ? XS : never;
