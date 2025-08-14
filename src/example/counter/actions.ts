import { createAction, useAction, useActions } from "../../library/index.ts";
import { Model } from "./types.ts";

const model: Model = {
  count: 1,
};

export class Actions {
  static Increment = createAction();
  static Decrement = createAction();
}

export default function useCounterActions() {
  const incrementAction = useAction<Model, typeof Actions, "Increment">(
    (context) => {
      context.actions.dispatch(Actions.Increment);

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

  return useActions<Model, typeof Actions>(
    model,
    class {
      Increment = incrementAction;
      Decrement = decrementAction;
    },
  );
}
