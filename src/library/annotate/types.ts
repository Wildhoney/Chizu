import { Draft, Operation as Op, Process } from "../types/index.ts";

export type Operation<T> = {
  operation: Op | Draft<T>;
  process: Process;
};

export type Validator = {
  pending: () => boolean;
};

export type Validateable<T> = T extends object
  ? {
      [P in keyof T]: T[P] extends (...args: unknown[]) => unknown
        ? T[P]
        : T[P] extends object
          ? Validateable<T[P]> | Validator
          : Validator;
    }
  : T;
