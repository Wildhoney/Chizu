import { Options } from "../module/types";
import { Module } from "../types";

export type ElementName = string;

export type Props<M extends Module> = {
  options: RendererOptions<M>;
};

export type RendererOptions<M extends Module> = Options<M> & {
  name: ElementName;
  attributes: M["Attributes"];
};
