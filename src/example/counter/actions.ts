import {
  createAction,
  useAction,
  useActions,
  Handlers,
  createDistributedAction,
} from "../../library/index.ts";
import { Model } from "./types.ts";

const model: Model = {
  count: 1,
};

export class Actions {
  static Increment = createAction();
  static Decrement = createDistributedAction();
}

export default function useCounterActions() {
  const incrementAction = useAction<Model, typeof Actions, "Increment">(
    (context) => {
      context.actions.produce((draft) => {
        draft.count += 1;
      });
    },
  );

  const decrementAction = useAction<Model, typeof Actions, "Decrement">(
    (context) => {
      context.actions.produce((draft) => {
        draft.count -= 1;
      });
    },
  );

  return useActions(
    model,
    <Handlers<Model, typeof Actions>>class {
      [Actions.Increment] = incrementAction;
      [Actions.Decrement] = decrementAction;
    },
  );
}
