// import { it } from "@jest/globals";
// import * as immer from "immer";
// import { Actions } from "../example/counter/actions";
// import { set } from "lodash";

// immer.enablePatches();

// class Annotation {}

// const model = {
//   a: 1,
//   b: [2, 3, 4],
//   c: { d: 5 },
//   d: [{ e: 6, g: 7, i: 8 }],
// };

// const annotation = {
//   a: new Annotation(),
//   b: new Annotation(),
//   c: new Annotation(),
//   d: new Annotation(),
// };

// const annotations = {};

// // "model" is always the committed data
// // "draft" is always the current working copy

// // Search updated model and transfer all annotations

// it("works", () => {
//   const [draft, patches] = immer.produceWithPatches(model, (draft) => {
//     draft.a = model.a * 2;
//     draft.b.push(5);
//     draft.b.splice(0, 1);
//   });

//   Object.entries(patches).map(([key, value]) => {
//     const path = value.path.join(".");
//     set(annotations, path, new Annotation());
//   });

//   // console.log(mutations);

//   // Object.values(mutations).forEach((mutation) => {
//   //     console.log(mutation);
//   // });

//   console.log(annotations);

//   // set draft useRef after removing annotations
//   // update the annotations item
// });

// enum Mutation {
//   Proposal,
//   Commit,
// }

// // context.actions.mutate(Mutation.Proposal, draft => {
// //     draft.name = "Adam";
// // });

// // // ...

// // class Test {
// //     @WaitOn(Actions.Increment);
// //     public saveIncrement {

// //     }
// // }

// // name.commit();
// // name.rollback();
