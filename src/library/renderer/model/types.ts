import useModel from ".";
import { Options } from "../../module/types.ts";
import { Module } from "../../types/index.ts";

export type Props<M extends Module> = {
  options: Options<M>;
};

export type UseModel = ReturnType<typeof useModel>;
