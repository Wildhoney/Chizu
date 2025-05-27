import { create } from "../library/index.ts";
import todo from "./todo/index.ts";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

const App = create.app(todo);
const root = ReactDOM.createRoot(document.body);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
