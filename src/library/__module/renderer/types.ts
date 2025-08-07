import { ModuleDefinition } from "../../types/index.ts";
import { UseOptions } from "../types.ts";

import * as React from "react";
export type ElementName = string;

export type Remount = React.ActionDispatch<[]>;

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Head<T extends any[]> = T extends [infer X, ...any[]] ? X : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tail<T extends any[]> = T extends [any, ...infer XS] ? XS : never;
