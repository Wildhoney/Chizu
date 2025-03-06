import { ModuleDefinition } from "../../types/index.ts";
import { Options } from "../types.ts";

export type ElementName = string;

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

export type UseOptions<M extends ModuleDefinition> = Options<M> & {
  name: ElementName;
  attributes: M["Attributes"];
};

export type Head<T extends any[]> = T extends [infer First, ...any[]]
  ? First
  : never;

export type Tail<T extends any[]> = T extends [any, ...infer Rest]
  ? Rest
  : never;
