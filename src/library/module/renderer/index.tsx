import { useApp } from "../../app/index.tsx";
import { ModuleDefinition } from "../../types/index.ts";
import useActions from "./actions/index.ts";
import useController from "./controller/index.ts";
import useDispatchers from "./dispatchers/index.ts";
import useElements from "./elements/index.ts";
import useLifecycles from "./lifecycles/index.ts";
import useLogger from "./logger/index.ts";
import useModel from "./model/index.ts";
import useMutations from "./mutations/index.ts";
import useProcess from "./process/index.ts";
import useQueue from "./queue/index.ts";
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
  const mutations = useMutations();
  const elements = useElements();
  const process = useProcess();

  const model = useModel({ options });
  const logger = useLogger({ options, elements });

  const dispatchers = useDispatchers({
    app,
    options,
    update,
    model,
    logger,
    queue,
    mutations,
    process,
  });

  const actions = useActions<M>({
    app,
    options,
    model,
    dispatchers,
    mutations,
    process,
  });

  useController({ options, dispatchers, actions });
  useLifecycles({ options, dispatchers });

  return React.useMemo(() => {
    logger.output({});

    return React.createElement(options.name, {
      ref: elements.customElement,
      children: options.view(actions.view),
    });
  }, [update.hash]);
}
