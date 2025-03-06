import { Operation, State, Target } from "../../../types/index.ts";
import useMutations from "./index.ts";

export type UseMutations = ReturnType<typeof useMutations>;

export type Mutations = {
  path: string;
  state: State | Operation | Target;
  process: Symbol;
}[];
