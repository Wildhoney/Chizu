import * as React from "react";
import { ModuleDefinition } from "../types/index.ts";
import { ViewArgs } from "../view/types.ts";

export type Props<M extends ModuleDefinition> = {
  module: ViewArgs<M>;
  children(props: ChildrenProps): React.ReactNode;
};

export type State = { errored: boolean };

export type ChildrenProps = { error: boolean; retry: Retry };

export type Retry = () => void;
