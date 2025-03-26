import { State } from "../../../../library";
import { pk } from "../../../../library/utils";
import { Events } from "../../types";
import { Button, Container, Details, Empty, Row, Summary } from "./styles";
import { Props } from "./types";
import { LoaderPinwheel, Trash2 } from "lucide-react";
import { ReactElement } from "react";

export default function List({ self }: Props): ReactElement {
  return (
    <Container>
      {self.model.tasks.length === 0 && (
        <Empty>
          {self.validate.tasks.is(State.Pending) ? (
            <>Please wait&hellip;</>
          ) : (
            "You have no tasks yet."
          )}
        </Empty>
      )}

      {self.model.tasks.map((task, index) => (
        <Row key={String(task.id)}>
          <Details pending={self.validate.tasks[index].is(State.Adding)}>
            <input
              id={String(task.id)}
              disabled={
                !pk(task.id) ||
                self.validate.tasks[index].completed.is(State.Pending)
              }
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                task.id && self.actions.dispatch([Events.Completed, task.id])
              }
            />{" "}
            <Summary htmlFor={String(task.id)} completed={task.completed}>
              {task.summary}
            </Summary>
          </Details>

          <Button
            disabled={
              !pk(task.id) || self.validate.tasks[index].is(State.Removing)
            }
            onClick={() =>
              task.id && self.actions.dispatch([Events.Remove, task.id])
            }
          >
            {self.validate.tasks[index].is(State.Removing) ? (
              <LoaderPinwheel size={20} />
            ) : (
              <Trash2 size={20} />
            )}
          </Button>
        </Row>
      ))}
    </Container>
  );
}
