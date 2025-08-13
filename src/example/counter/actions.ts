import { createAction, useAction, useActions } from "../../library/index.ts";
import { State } from "../../library/types/index.ts";

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
    async (context) => {
      context.actions.produce((draft) => {
        draft.count = context.actions.annotate(draft.count, [State.Operation.Updating]);
      });

      await 5;

      context.actions.produce((draft) => {
        console.log(draft.count);
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
