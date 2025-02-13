import useActions from ".";
import { UseModel } from "../model/types";

export type Props = {
  model: UseModel;
};

export type UseActions = ReturnType<typeof useActions>;
