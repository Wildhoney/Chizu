import { Draft, Operation as Op, Process } from "../types/index.ts";

import { Node } from "./utils";

export type Operation<T> = {
  operation: Op | Draft<T>;
  process: Process;
};

// export type Validator = {
//   pending: () => boolean;
// };

// export type Validateable<T> = T extends object
//   ? {
//       [P in keyof T]: T[P] extends (...args: unknown[]) => unknown
//         ? T[P]
//         : T[P] extends object
//           ? Validateable<T[P]> | Validator
//           : Validator;
//     }
//   : T;

export type Nodeify<T> = T extends string | number | boolean | null | undefined
  ? Node<T>
  : T extends Array<infer U>
    ? Node<Nodeify<U>[]>
    : T extends object
      ? Node<{ [K in keyof T]: Nodeify<T[K]> }>
      : Node<T>;
