import { create } from "../../library/index.ts";
import { Route, Routes } from "../types.ts";
import { Actions, Model, Events } from "./types.ts";

export default create.controller<Model, Actions, Routes, Route.Dashboard>(
  (controller) => {
    return {
      // *[Lifecycle.Mount]() {
      //   // const name: string = yield controller.io(async () => "Maria");
      //   // return controller.produce((draft) => {
      //   //   draft.name = name;
      //   // });
      // },

      // *[Lifecycle.Element]() {
      //   console.log(element?.innerHTML);
      // },

      // *[Lifecycle.Mount]() {
      //   console.log(controller.element, "Mount");
      // },

      // *[Lifecycle.Unmount]() {
      //   console.log(controller.element, "Unmount");
      // },

      // *[DistributedEvents.UpdateName](name) {
      //   const random: string = yield actions.io(() => name);

      //   return actions.produce((draft) => {
      //     draft.name = random;
      //     // draft.name = actions.optimistic(random, name);
      //   });
      // },

      *[Events.ChangeProfile]() {
        const name: string = yield controller.io(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve("Maria");
              }, 2000);
            }),
        );

        return controller.produce((draft) => {
          draft.name = name;
          draft.age = 24;
        });
      },
    };
  },
);
