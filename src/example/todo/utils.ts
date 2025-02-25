import { TaskWithoutId } from "./types.ts";
import { Dexie, Table } from "dexie";

export class Db extends Dexie {
  todos!: Table<TaskWithoutId>;

  constructor() {
    super("todos");

    this.version(1).stores({
      todos: `++id, task, date, completed`,
    });
  }
}
