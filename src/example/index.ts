import { create } from "../library/index.ts";
import person from "./person/index.ts";

export default create.app({
  routes: {
    "/": person,
  },
});
