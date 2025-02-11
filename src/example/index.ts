import { create } from "../library/index.ts";
import todo from "./todo/index.ts";
import { DistributedEvents, Routes } from "./types.ts";

export default create.app<Routes, typeof DistributedEvents>({
  routes: {
    "/": todo,
  },
  distributedEvents: DistributedEvents,
});
