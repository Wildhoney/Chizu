import useActions from "./index.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseModel } from "../model/types.ts";

export type Props = {
  model: UseModel;
  dispatchers: UseDispatchers;
};

export type UseActions = ReturnType<typeof useActions>;
