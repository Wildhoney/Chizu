import { ReactElement } from "react";
import { Module } from "../types";
import { TreeProps } from "../module/tree/types";
import * as React from "react";
import useElements from "./elements";
import * as ReactDOM from "react-dom";
import useActions from "./actions";
import useUpdate from "./update";
import useModel from "./model";

export default function renderer<M extends Module>(
  props: TreeProps<M>,
): ReactElement {
  const model = useModel({ options: props.options });
  const update = useUpdate();
  const actions = useActions({ model });
  const elements = useElements({ update });

  return React.useMemo(
    () =>
      React.createElement(props.name, {
        ref: elements.customElement,
        children:
          elements.shadowBoundary.current &&
          ReactDOM.createPortal(
            props.options.view(actions.view),
            elements.shadowBoundary.current,
          ),
      }),
    [update.hash],
  );
}
