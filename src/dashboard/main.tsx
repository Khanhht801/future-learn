import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { dashboardURL } from "./lib/navigation";

const pages = {
  "": lazy(() =>
    import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
  ),
  math: lazy(() =>
    import("./pages/MathPage").then((module) => ({ default: module.MathPage })),
  ),
  english: lazy(() =>
    import("./pages/EnglishPage").then((module) => ({
      default: module.EnglishPage,
    })),
  ),
  badges: lazy(() =>
    import("./pages/BadgesPage").then((module) => ({
      default: module.BadgesPage,
    })),
  ),
  parents: lazy(() =>
    import("./pages/ParentsPage").then((module) => ({
      default: module.ParentsPage,
    })),
  ),
  "math/mercury": lazy(() =>
    import("./pages/MercuryPage").then((module) => ({
      default: module.MercuryPage,
    })),
  ),
  "english/animals": lazy(() =>
    import("./pages/VocabularyPage").then((module) => ({
      default: module.VocabularyPage,
    })),
  ),
  "english/fruit": lazy(() =>
    import("./pages/VocabularyPage").then((module) => ({
      default: module.VocabularyPage,
    })),
  ),
  "english/colors": lazy(() =>
    import("./pages/VocabularyPage").then((module) => ({
      default: module.VocabularyPage,
    })),
  ),
};
const route = location.pathname
  .slice(dashboardURL.pathname.length)
  .replace(/index\.html$/, "")
  .replace(/\/$/, "");
const Page = pages[route as keyof typeof pages] || pages[""];
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<p role="status">Đang mở góc học tập…</p>}>
    <Page />
  </Suspense>,
);
