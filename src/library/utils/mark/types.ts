import { State } from "../../types/index.ts";

export type Mutation = {
  path: string;
  state: State;
};
