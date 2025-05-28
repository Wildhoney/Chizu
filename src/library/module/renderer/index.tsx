import { useApp } from "../../app/index.tsx";
import { useOptimisedMemo } from "../../hooks/index.ts";
import { ModuleDefinition } from "../../types/index.ts";
import useActions from "./actions/index.ts";
import useController from "./controller/index.ts";
import useDispatchers from "./dispatchers/index.ts";
import useElements from "./elements/index.ts";
import useLifecycles from "./lifecycles/index.ts";
import useModel from "./model/index.ts";
import useQueue from "./queue/index.ts";
import { Router, useRouter } from "./router/index.tsx";
import { Props } from "./types.ts";
import useUpdate from "./update/index.ts";
import { ReactElement } from "react";
import * as React from "react";

export default function renderer<M extends ModuleDefinition>({
  options,
}: Props<M>): ReactElement {
  const app = useApp();
  const update = useUpdate();
  const queue = useQueue();
  const elements = useElements();
  const router = useRouter();
  const model = useModel({ options });
  const dispatchers = useDispatchers({ app, options, update, model, queue });
  const actions = useActions<M>({ app, options, model, dispatchers, router });

  useController({ options, dispatchers, actions });
  useLifecycles({ options, dispatchers, elements, router, update });

  return useOptimisedMemo(() => {
    return React.createElement(options.name, {
      ref: elements.customElement,
      style: { display: "contents" },
      children: (
        <Router using={router}>{() => options.view(actions.view)}</Router>
      ),
    });
  }, [update.hash]);
}
