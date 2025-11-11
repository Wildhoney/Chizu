import { createAction, useAction, useActions } from "../../library/index.ts";
import { State } from "../../library/types/index.ts";
import { sleep } from "../../library/utils/index.ts";
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
    async (context) => {
      context.actions.produce((model) => {
        model.count = context.actions.annotate(model.count + 1, [
          State.Operation.Updating,
          State.Draft(5),
        ]);
      });

      await sleep(1000);

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
    class {
      [Actions.Reset] = resetAction;
      [Actions.Increment] = incrementAction;
      [Actions.Decrement] = decrementAction;
    },
  );
}
