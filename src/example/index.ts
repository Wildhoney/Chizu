import { create } from "../library/index.ts";
import person from "./person/index.ts";
import { Routes } from "./types.ts";

export default create.app<Routes>({
  routes: {
    "/": person,
  },
});
