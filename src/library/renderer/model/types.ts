import useModel from ".";
import { Module } from "../../types/index.ts";
import { UseOptions } from "../types.ts";

export type Props<M extends Module> = {
  options: UseOptions<M>;
};

export type UseModel = ReturnType<typeof useModel>;
