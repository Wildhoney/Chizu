import { useBroadcast } from "../../broadcast/index.tsx";
import { useOptimisedMemo } from "../../hooks/index.ts";
import { ModuleDefinition } from "../../types/index.ts";
import { hash } from "../../utils/index.ts";
import useActions from "./actions/index.ts";
import useController from "./controller/index.ts";
import useDispatchers from "./dispatchers/index.ts";
import useElements from "./elements/index.ts";
import useLifecycles from "./lifecycles/index.ts";
import useModel from "./model/index.ts";
import useQueue from "./queue/index.ts";
import { Props } from "./types.ts";
import useUpdate from "./update/index.ts";
import * as React from "react";
import { Context } from "./utils.ts";
import ErrorBoundary from "../../errors/index.ts";
import { ViewArgs } from "../../view/types.ts";

export default function Renderer<M extends ModuleDefinition>({
  options,
}: Props<M>): React.ReactNode {
  const update = useUpdate();
  const queue = useQueue();
  const elements = useElements();
  const broadcast = useBroadcast();
  const model = useModel({ options });
  const dispatchers = useDispatchers({
    broadcast,
    options,
    update,
    model,
    queue,
  });
  const actions = useActions<M>({ broadcast, options, model, dispatchers });

  useController({ options, dispatchers, actions });
  useLifecycles({ options, dispatchers, elements, update });

  return useOptimisedMemo(() => {
    // eslint-disable-next-line react/no-children-prop
    return React.createElement(ErrorBoundary, {
      module: actions.view,
      children(props) {
        const args = <ViewArgs<M>>{
          ...actions.view,
          error: props.error,
          actions: {
            ...actions.view.actions,
            retry: props.retry,
            remount: options.remount,
          },
        };

        // eslint-disable-next-line react/no-children-prop
        return React.createElement(Context.Provider, {
          value: args,
          // eslint-disable-next-line react/no-children-prop
          children: React.createElement("x-chizu", {
            ref: elements.customElement,
            style: { display: "contents" },
            children: options.children(args),
          }),
        });
      },
    });
  }, [update.hash, hash(options.using.props)]);
}
