import * as React from "react";
import { Props, State } from "./types.ts";
import { Lifecycle, ModuleDefinition } from "../types/index.ts";
import { intoError } from "./utils.ts";

export default class ErrorBoundary<
  M extends ModuleDefinition,
> extends React.Component<Props<M>, State> {
  constructor(props: Props<M>) {
    super(props);
    this.state = { errored: false };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { errored: true };
  }

  componentDidCatch(error: unknown) {
    this.props.module.actions.dispatch([Lifecycle.Error, [intoError(error)]]);
  }

  render() {
    const retry = (): void => this.setState({ errored: false });

    return this.props.children({ error: this.state.errored, retry });
  }
}
