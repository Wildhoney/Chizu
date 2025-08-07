import { useBroadcast } from "../../../broadcast/index.tsx";
import { isBroadcastAction } from "../../../broadcast/utils.ts";
import { ActionEvent } from "../../../controller/types.ts";
import { useOptimisedMemo } from "../../../hooks/index.ts";
import { ModuleDefinition, Task } from "../../../types/index.ts";
import { Head, Tail } from "../types.ts";
import { Props } from "./types.ts";
import { useDispatcher } from "./utils.ts";
import EventEmitter from "eventemitter3";

/**
 * @param props {Props<M>}
 * @returns { attach: (action: Head<M["Actions"]>, ƒ: F) => void; dispatch: (action: Head<M["Actions"]>, data: Tail<M["Actions"]>) => void; }
 */
export default function useDispatchers<M extends ModuleDefinition>(
  props: Props<M>,
) {
  const broadcast = useBroadcast();
  const unicast = useOptimisedMemo(() => new EventEmitter(), []);
  const dispatcher = useDispatcher({ ...props, unicast });

  return useOptimisedMemo(() => {
    return {
      attach<F extends ActionEvent<M>>(action: Head<M["Actions"]>, ƒ: F) {
        const name = String(action);

        isBroadcastAction(name)
          ? broadcast.instance.on(name, dispatcher(action, ƒ))
          : unicast.on(name, dispatcher(action, ƒ));
      },
      dispatch(
        action: Head<M["Actions"]>,
        data: Tail<M["Actions"]>,
        task?: Task,
      ) {
        const name = String(action);

        isBroadcastAction(name)
          ? broadcast.instance.emit(name, task, data)
          : unicast.emit(name, task, data);
      },
    };
  }, []);
}
