import { State } from "../../../../library/index.ts";
import { pk } from "../../../../library/utils/index.ts";
import { Events } from "../../types";
import {
  Button,
  Container,
  Date,
  Details,
  Empty,
  Name,
  Row,
  Task,
} from "./styles.ts";
import { Props } from "./types.ts";
import dayjs from "dayjs";
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
            <Task htmlFor={String(task.id)}>
              <Name completed={task.completed}>{task.summary}</Name>

              <Date>
                Added: {dayjs(task.date.toString()).format("DD/MM/YYYY")}
              </Date>
            </Task>
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
