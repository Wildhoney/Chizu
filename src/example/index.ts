import { create } from "../library/index.ts";
import todo from "./github-followers/index.ts";
import { Routes } from "./types.ts";

export default create.app<Routes>({
  routes: {
    "/": todo,
  },
});
