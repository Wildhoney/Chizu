export type Primitive = string | number | boolean | null;

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
