import { Controller } from "../lib/controller";
import { Events, Model } from "./types";

export default class PersonController extends Controller<Model> {
  public model = {
    name: "Adam",
    age: 38,
  };

  public *[Events.ModifyName](attrs: { name: string }) {
    const name: string = yield this.io(async () => attrs.name);
    const age: number = yield this.io(() => 38);

    return this.produce((state) => {
      state.name = name;
      state.age = age;
    });
  }

  public *[Events.ModifyAge](attrs: { age: number }) {
    const age: number = yield this.io(async () => attrs.age);

    return this.produce((state) => {
      state.age = age;
    });
  }
}
