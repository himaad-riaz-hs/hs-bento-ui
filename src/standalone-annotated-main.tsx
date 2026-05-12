import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tokens/index.css";
import { TagInteractivePrototype } from "./features/TagManagement/TagInteractivePrototype";

/** Annotated build: starts with “Call feedback changes” overlay turned on. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TagInteractivePrototype />
  </StrictMode>
);
