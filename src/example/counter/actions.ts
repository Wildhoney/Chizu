import { createAction, useAction, useActions } from "../../library/index.ts";

import { Model } from "./types.ts";

const model: Model = {
  count: 1,
};

export class Actions {
  static Decrement = createAction();
  static Increment = createAction();
}

export default function useCounterActions() {
  const increment = useAction<Model, Actions, typeof Actions.Increment>(
    (context) => {
      context.actions.produce((draft) => {
        draft.count += 1;
      });
    },
  );

  const decrement = useAction<Model, Actions, typeof Actions.Decrement>(
    (context) => {
      context.actions.produce((draft) => {
        draft.count -= 1;
      });
    },
  );

  return useActions<Model, Actions>(
    model,
    class {
      [Actions.Increment] = increment;
      [Actions.Decrement] = decrement;
    },
  );
}
