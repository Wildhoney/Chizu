import useElements from ".";
import { UseUpdate } from "../update/types";

export type Props = {
  update: UseUpdate;
};

export type UseElements = ReturnType<typeof useElements>;
