import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";

/** Each HTML entry imports its own page, so Vite can preload the full module graph. */
export function mountDashboard(Page: ComponentType) {
  createRoot(document.getElementById("root")!).render(<Page />);
}
