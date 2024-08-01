import { BaseController } from "./lib/controller";
import { Model } from "./types";

export default class Controller extends BaseController {
  public model: Model = {
    person: {
      name: {
        first: "John",
        last: "Doe",
      },
    },
  };

  // ---

  public *updateName() {
    const name = yield this.effect(async () => "Maria");

    this.apply((draft) => {
      draft.person.name.first = name;
    });

    console.log(this.model);
  }
}

const controller = new Controller();
controller.dispatch(controller.updateName.bind(controller));
