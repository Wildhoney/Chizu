import { Property } from "../model";

export type Primitive = string | number | boolean | null;

export type Fn<A, R> = (...args: A[]) => R;

export type Tree = [
  keyof HTMLElementTagNameMap,
  Record<string, string>,
  Tree[] | Primitive,
];

// [
//     {
//         "op": "replace",
//         "path": [
//             "friends",
//             0,
//             "age"
//         ],
//         "value": 22
//     },
//     {
//         "op": "add",
//         "path": [
//             "friends",
//             3
//         ],
//         "value": {
//             "name": "Adam",
//             "age": 35
//         }
//     },
//     {
//         "op": "remove",
//         "path": [
//             "name"
//         ]
//     }
// ]
