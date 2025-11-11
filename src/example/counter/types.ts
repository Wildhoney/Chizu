import { createAction } from "../../library/index.ts";

export type Model = {
  count: number;
};

export class Actions {
  static Reset = createAction<number>();
  static Increment = createAction();
  static Decrement = createAction();
}
