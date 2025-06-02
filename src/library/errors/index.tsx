import * as React from "react";
import type { Props } from "./types.ts";
import { Boundary, Lifecycle, ModuleDefinition } from "../types/index.ts";
import { Child, intoError } from "./utils.ts";
import { update } from "../utils/produce/index.ts";

export default class ErrorBoundary<
  M extends ModuleDefinition,
> extends React.Component<Props<M>> {
  constructor(props: Props<M>) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: unknown) {
    const process = Symbol("process");
    const models = update(this.props.model.current, process, (_, meta) => {
      meta.boundary = Boundary.Error;
    });

    this.props.model.current = models;
    this.props.update.rerender();

    this.props.dispatchers.dispatch(Lifecycle.Error, [intoError(error)]);
  }

  render() {
    return <Child>{this.props.children}</Child>;
  }
}
