import * as React from "react";
import { Props, State } from "./types.ts";
import { Lifecycle, ModuleDefinition } from "../types/index.ts";
import { intoError } from "./utils.ts";
import { Meta } from "../utils/index.ts";

export default class ErrorBoundary<
  M extends ModuleDefinition,
> extends React.Component<Props<M>, State> {
  constructor(props: Props<M>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error: intoError(error) };
  }

  componentDidUpdate(_: Props<M>, previous: State) {
    if (this.state.error && !previous.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      this.props.model.current.stateful[Meta.Error] = true;
      this.props.model.current.stateless[Meta.Error] = true;
      this.props.dispatchers.dispatch(Lifecycle.Error, [this.state.error]);
    }

    return this.props.children();
  }
}
