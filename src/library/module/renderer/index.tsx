import { ModuleDefinition } from "../../types/index.ts";
import useActions from "./actions/index.ts";
import useController from "./controller/index.ts";
import useDispatchers from "./dispatchers/index.ts";
import useElements from "./elements/index.ts";
import useLifecycles from "./lifecycles/index.ts";
import useLogger from "./logger/index.ts";
import useModel from "./model/index.ts";
import useMutations from "./mutations/index.ts";
import usePhase from "./phase/index.ts";
import useQueue from "./queue/index.ts";
import { Props } from "./types.ts";
import useUpdate from "./update/index.ts";
import { ReactElement } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";

export default function renderer<M extends ModuleDefinition>({ options }: Props<M>): ReactElement {
  const phase = usePhase();
  const update = useUpdate();
  const queue = useQueue();
  const mutations = useMutations();
  const elements = useElements({ update });

  const model = useModel({ options });
  const logger = useLogger({ options, elements });
  const dispatchers = useDispatchers({ options, update, model, elements, logger, queue, mutations });
  const actions = useActions<M>({ options, model, dispatchers, mutations });

  useController({ options, phase, dispatchers, actions });
  useLifecycles({ options, dispatchers, phase });

  return React.useMemo(() => {
    logger.output({});

    return React.createElement(options.name, {
      ref: elements.customElement,
      children:
        elements.shadowBoundary.current &&
        ReactDOM.createPortal(options.view(actions.view), elements.shadowBoundary.current),
    });
  }, [update.hash]);
}
