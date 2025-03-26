import { State } from "../../../../library";
import { Events } from "../../types";
import { Button, Container, Input } from "./styles";
import { Props } from "./types";
import { CirclePlus, LoaderPinwheel } from "lucide-react";
import { ReactElement } from "react";

export default function Form({ self }: Props): ReactElement {
  return (
    <Container>
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={self.model.task ?? ""}
        onChange={(event) =>
          self.actions.dispatch([Events.Task, event.currentTarget.value])
        }
      />

      <Button
        disabled={!self.model.task}
        onClick={() => self.actions.dispatch([Events.Add])}
      >
        {self.validate.tasks.is(State.Updating) ? (
          <>
            Adding task&hellip; <LoaderPinwheel size={20} />
          </>
        ) : (
          <>
            Add task <CirclePlus size={20} />
          </>
        )}
      </Button>
    </Container>
  );
}
