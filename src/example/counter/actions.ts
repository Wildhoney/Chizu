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
  static Reset = createAction<number>();
  static Increment = createAction();
  static Decrement = createAction();
}

export default function useCounterActions() {
  const resetAction = useAction<Model, typeof Actions, "Reset">(
    (context, payload) => {
      context.actions.produce((model) => {
        model.count = payload;
      });
    },
  );

  const incrementAction = useAction<Model, typeof Actions, "Increment">(
    (context) => {
      context.actions.produce((model) => {
        model.count += 1;
      });
    },
  );

  const decrementAction = useAction<Model, typeof Actions, "Decrement">(
    (context) => {
      context.actions.produce((model) => {
        model.count -= 1;
      });
    },
  );

  return useActions(
    model,
    <Handlers<Model, typeof Actions>>class {
      [Actions.Reset] = resetAction;
      [Actions.Increment] = incrementAction;
      [Actions.Decrement] = decrementAction;
    },
  );
}
