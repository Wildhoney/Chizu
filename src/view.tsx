import Controller from "./controller";
import { states } from "./lib/controller";
import { Name, Property } from "./lib/view";

@Name("x-person")
// ---

@Property("person.name.first", (state) => {
  switch (state) {
    case states.pending:
      return "...";

    case states.error:
      return "Error";
  }
})

// ---
export default class View extends Controller {
  public render() {
    return (
      <p>
        Hello {this.model.person.name.first} {this.model.person.name.last}!
      </p>
    );
  }
}
