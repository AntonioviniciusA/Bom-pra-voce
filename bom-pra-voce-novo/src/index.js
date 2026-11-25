import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRoutes from "./Routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><AppRoutes /></React.StrictMode>
);

// O loading inicial vive no HTML para ser exibido antes do bundle principal.
// Remova-o somente depois que o React concluir a primeira renderização.
const removeInitialLoading = () => {
  const minimumLoadingTime = 1200;
  const startedAt = window.__initialLoadingStartedAt ?? performance.now();
  const elapsedTime = performance.now() - startedAt;
  const reactIsReady = document.getElementById("root")?.hasChildNodes();

  if (!reactIsReady || elapsedTime < minimumLoadingTime) {
    requestAnimationFrame(removeInitialLoading);
    return;
  }
  window.clearInterval(window.__initialLoadingTimer);
  document.getElementById("initial-loading")?.remove();
};
requestAnimationFrame(removeInitialLoading);
