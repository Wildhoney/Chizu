import { Events, Handle } from "./types";
import PersonController from "./controller";
import { View } from "../lib/view";

@Handle.Pending("name", () => {
  return <p>...</p>;
})
@Handle.Error("age", ({ error }) => {
  return <p>{error.message}</p>;
})
export default class PersonView extends View<typeof PersonController> {
  protected name = "x-person";

  protected styles = import("./styles.css");

  private handleModifyName(event: MouseEvent) {
    this.dispatch(Events.ModifyName, { name: "Maria" });
  }

  public render() {
    <>
      <h1>
        Hello {this.model.name}, you are {this.model.age}!
      </h1>

      <button onClick={this.handleModifyName}>Update name</button>
    </>;
  }
}
