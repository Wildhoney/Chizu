import { UseDispatchers } from "../dispatchers/types.ts";
import { UseModel } from "../model/types.ts";
import useActions from "./index.ts";

export type Props = {
  model: UseModel;
  dispatchers: UseDispatchers;
};

export type UseActions = ReturnType<typeof useActions>;
