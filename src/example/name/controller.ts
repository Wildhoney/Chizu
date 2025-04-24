import { Lifecycle, create } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

export default create.controller<Module>((self) => {
  return {
    *[Lifecycle.Derive](props) {
      return self.actions.produce((model) => {
        model.name = props.model.name;
      });
    },

    *[Events.UpdateName](event) {
      return self.actions.produce((model) => {
        model.name = event.target.value;
        model.isValid = /^[A-Za-z]+\s+[A-Za-z]+/.test(model.name);
      });
    },
  };
});
