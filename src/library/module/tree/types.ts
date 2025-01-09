import { Actions, Model, Routes } from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { JSX } from "preact";

export type Props<M extends Model, A extends Actions, R extends Routes> = {
  moduleOptions: ModuleOptions<M, A, R> & {
    elementName: JSX.IntrinsicElements;
  };
};
