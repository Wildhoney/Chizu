import { create } from "../library/index.ts";
import example from "./person/index.ts";

const app = create.app({});

app.register(example);

app.serve(example);
