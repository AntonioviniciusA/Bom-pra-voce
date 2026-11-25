import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {logPanelError} from './services/diagnostics';
import "./index.css";

window.addEventListener('error', event => logPanelError('renderer-error', event.error || new Error('Renderer error')));
window.addEventListener('unhandledrejection', event => logPanelError('renderer-rejection', event.reason));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
