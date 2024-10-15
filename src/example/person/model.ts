import { create } from "../../library/index.ts";
import { Model } from "./types.ts";

export default create.model<Model>({
  name: "Adam",
  age: 16,
  displayParentalPermission: false,
});
