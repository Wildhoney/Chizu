import {
  createAction,
  useAction,
  useActions,
  Handlers,
} from "../../library/index.ts";
import { Model } from "./types.ts";

const model: Model = {
  count: 1,
};

export class Actions {
  static Set = createAction<number>();
  static Increment = createAction();
  static Decrement = createAction();
}

export default function useCounterActions() {
  const setAction = useAction<Model, typeof Actions, "Set">(
    (context, payload) => {
      context.actions.produce((draft) => {
        draft.count = payload;
      });
    },
  );

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
      [Actions.Set] = setAction;
      [Actions.Increment] = incrementAction;
      [Actions.Decrement] = decrementAction;
    },
  );
}
