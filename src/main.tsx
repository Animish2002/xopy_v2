import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 1. Disable text selection via CSS
const style = document.createElement("style");
style.textContent = `
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`;
document.head.appendChild(style);

// 2. Disable right-click via JavaScript
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  return false;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
