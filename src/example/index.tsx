import App from "./todo/index.tsx";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.body);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
