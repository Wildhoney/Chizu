import { ReactElement } from "react";
import { Module } from "../types";
import * as React from "react";
import * as ReactDOM from "react-dom";
import useElements from "./elements/index.ts";
import useActions from "./actions/index.ts";
import useUpdate from "./update/index.ts";
import useModel from "./model/index.ts";
import usePhase from "./phase/index.ts";
import { Props } from "./types.ts";
import useAttributes from "./attributes/index.ts";
import useDispatchers from "./dispatchers/index.ts";
import useController from "./controller/index.ts";

export default function renderer<M extends Module>({
  options,
}: Props<M>): ReactElement {
  const phase = usePhase();
  const update = useUpdate();
  const elements = useElements({ update });

  const model = useModel({ options });
  const dispatchers = useDispatchers({ options, update, model });
  const actions = useActions({ model, dispatchers });
  const controller = useController({ options, phase, dispatchers, actions });
  const attributes = useAttributes({ options, update });

  return React.useMemo(
    () =>
      React.createElement(options.name, {
        ref: elements.customElement,
        children:
          elements.shadowBoundary.current &&
          ReactDOM.createPortal(
            options.view(actions.view),
            elements.shadowBoundary.current,
          ),
      }),
    [update.hash],
  );
}
