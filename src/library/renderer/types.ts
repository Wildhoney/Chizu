import { Options } from "../module/types";
import { Module } from "../types";

export type ElementName = string;

export type Props<M extends Module> = {
  options: UseOptions<M>;
};

export type UseOptions<M extends Module> = Options<M> & {
  name: ElementName;
  attributes: M["Attributes"];
};

export type Head<T extends any[]> = T extends [infer First, ...any[]] ? First : never;

export type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;
