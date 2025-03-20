import { State } from "../../../types/index.ts";
import { Process } from "../process/types.ts";
import useMutations from "./index.ts";

export type UseMutations = ReturnType<typeof useMutations>;

export type Mutation<T> = {
  key: null | symbol | string;
  value: T;
  type: "array" | "object";
  state: State;
  process: Process;
};

export type Mutations = Set<Mutation<unknown>>;
