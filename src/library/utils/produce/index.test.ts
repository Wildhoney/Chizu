// import { prune, track } from ".";
// import { Models } from "../../__module/renderer/model/utils.ts";
// import { Process, State } from "../../types/index.ts";
// import { Annotation, annotate, config } from "./utils.ts";
// import { describe, expect, it } from "@jest/globals";

// const process: Process = Symbol("process");

// const model = {
//   name: { first: "Adam" },
//   location: { area: "Brighton" },
//   children: [{ name: "Imogen" }],
// };

// describe("track", () => {
//   it("transforms the model with simple primitives", () => {
//     const models = new Models(model);

//     const a = track(models, process, (draft) => {
//       draft.name.first = "Maria";
//       draft.location = { area: "Watford" };
//       draft.children.push({ name: "Phoebe" });
//     });

//     expect(a.stateless).toEqual(
//       expect.objectContaining({
//         name: { first: "Maria" },
//         location: { area: "Watford" },
//         children: [{ name: "Imogen" }, { name: "Phoebe" }],
//       }),
//     );

//     expect(a.stateful).toEqual(
//       expect.objectContaining({
//         name: { first: "Maria" },
//         location: { area: "Watford" },
//         children: [{ name: "Imogen" }, { name: "Phoebe" }],
//       }),
//     );
//   });

//   it("transforms the model with state operations", () => {
//     const models = new Models(model);

//     const a = track(models, process, (draft) => {
//       draft.name.first = annotate("Maria", [State.Operation.Updating]);
//       draft.location = annotate({ area: "Watford" }, [
//         State.Operation.Replacing,
//       ]);
//       draft.children.push(
//         annotate({ name: "Phoebe" }, [State.Operation.Adding]),
//       );
//     });

//     expect(a.stateless).toEqual(
//       expect.objectContaining({
//         name: { first: "Maria" },
//         location: { area: "Watford" },
//         children: [{ name: "Imogen" }, { name: "Phoebe" }],
//       }),
//     );

//     expect(a.stateful).toEqual(
//       expect.objectContaining({
//         name: {
//           first: "Maria",
//           [config.annotations]: [expect.any(Annotation)],
//         },
//         location: {
//           area: "Watford",
//           [config.annotations]: [expect.any(Annotation)],
//         },
//         children: [
//           { name: "Imogen" },
//           { name: "Phoebe", [config.annotations]: [expect.any(Annotation)] },
//         ],
//       }),
//     );
//   });

//   it("transforms the model with chained state operations", () => {
//     const models = new Models(model);

//     const a = track(models, process, (draft) => {
//       draft.name.first = annotate("Maria", [State.Operation.Updating]);
//       draft.location = annotate({ area: "Horsham" }, [
//         State.Operation.Updating,
//       ]);
//       draft.children.push(
//         annotate({ name: "Phoebe" }, [State.Operation.Adding]),
//       );
//     });

//     expect(a.stateful).toEqual(
//       expect.objectContaining({
//         name: {
//           first: "Maria",
//           [config.annotations]: [expect.any(Annotation)],
//         },
//         location: {
//           area: "Horsham",
//           [config.annotations]: [expect.any(Annotation)],
//         },
//         children: [
//           { name: "Imogen" },
//           { name: "Phoebe", [config.annotations]: [expect.any(Annotation)] },
//         ],
//       }),
//     );
//     expect(a.validatable.location.is(State.Operation.Updating)).toBe(true);
//     expect(a.validatable.location.is(State.Operation.Replacing)).toBe(false);

//     const b = track(a, process, (draft) => {
//       draft.name.first = annotate("Adam", [State.Operation.Updating]);
//       draft.location = annotate({ area: "Watford" }, [
//         State.Operation.Replacing,
//       ]);
//     });

//     expect(b.stateful).toEqual(
//       expect.objectContaining({
//         name: {
//           first: "Adam",
//           [config.annotations]: [
//             expect.any(Annotation),
//             expect.any(Annotation),
//           ],
//         },
//         location: {
//           area: "Watford",
//           [config.annotations]: [
//             expect.any(Annotation),
//             expect.any(Annotation),
//           ],
//         },
//         children: [
//           { name: "Imogen" },
//           { name: "Phoebe", [config.annotations]: [expect.any(Annotation)] },
//         ],
//       }),
//     );
//     expect(b.validatable.location.is(State.Operation.Updating)).toBe(true);
//     expect(b.validatable.location.is(State.Operation.Replacing)).toBe(true);
//   });
// });

// describe("prune", () => {
//   it("transforms the model by cleaning up state processes", () => {
//     const models = new Models(model);

//     const a = prune(
//       track(models, process, (draft) => {
//         draft.name.first = annotate("Maria", [State.Operation.Updating]);
//         draft.location = annotate({ area: "Watford" }, [
//           State.Operation.Replacing,
//         ]);
//         draft.children.push(
//           annotate({ name: "Phoebe" }, [State.Operation.Adding]),
//         );
//       }),
//       process,
//     );

//     expect(a.stateful).toEqual(
//       expect.objectContaining({
//         name: { first: "Maria", [config.annotations]: [] },
//         location: { area: "Watford", [config.annotations]: [] },
//         children: [
//           { name: "Imogen" },
//           { name: "Phoebe", [config.annotations]: [] },
//         ],
//       }),
//     );
//   });
// });

// describe("validatable", () => {
//   it("transforms the model with validatable operations", () => {
//     const models = new Models(model);

//     const a = track(models, process, (draft) => {
//       draft.name.first = annotate("Maria", [State.Operation.Updating]);
//       draft.location = annotate({ area: "Watford" }, [
//         State.Operation.Replacing,
//         State.Draft("Maybe Watford"),
//       ]);
//       draft.children.push(
//         annotate({ name: "Phoebe" }, [State.Operation.Adding]),
//       );
//     });

//     expect(a.validatable.name.first.pending()).toBe(true);
//     expect(a.validatable.name.first.is(State.Operation.Updating)).toBe(true);

//     expect(a.validatable.location.pending()).toBe(true);
//     expect(a.validatable.location.is(State.Operation.Replacing)).toBe(true);
//     expect(a.validatable.location.draft()).toBe("Maybe Watford");

//     expect(a.validatable.children[0].pending()).toBe(false);
//     expect(a.validatable.children[0].is(State.Operation.Adding)).toBe(false);

//     expect(a.validatable.children[1].pending()).toBe(true);
//     expect(a.validatable.children[1].is(State.Operation.Adding)).toBe(true);
//   });
// });
