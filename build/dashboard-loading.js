import { readFileSync } from "node:fs";

/** One HTML/CSS template serves the dev server and every built dashboard entry. */
export function dashboardLoading() {
  return {
    name: "dashboard-loading",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (!html.includes("/src/dashboard/entries/")) return html;
        const template = readFileSync(
          new URL("../dashboard/shared/loading.html", import.meta.url),
          "utf8",
        );
        const styles = readFileSync(
          new URL("../dashboard/shared/loading.css", import.meta.url),
          "utf8",
        );
        const area = html.match(/data-dashboard="([^"]+)"/)?.[1];
        const lesson = html.includes("/entries/vocabulary.tsx");
        const layout = lesson
          ? "lesson"
          : area === "home" || area === "parents"
            ? area
            : "overview";
        // Match the saved sidebar width before React mounts to avoid a content jump.
        const bootstrap = `(()=>{let saved=null;try{saved=localStorage.getItem('futurelearn-sidebar-collapsed');}catch{}document.documentElement.classList.toggle('sidebar-is-collapsed',saved===null?matchMedia('(max-width: 1023.98px)').matches:saved==='true');const fonts=document.querySelector('[data-dashboard-fonts]');if(fonts){if(fonts.sheet)fonts.media='all';else fonts.addEventListener('load',()=>{fonts.media='all'},{once:true});}})();`;
        return (
          html
            .replace(
              '<div id="root"></div>',
              `<div id="root">${template.replace("__LAYOUT__", layout)}</div>`,
            )
            // Web fonts must not hold the initial skeleton/page behind an external CSS request.
            .replace(
              /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="https:\/\/fonts\.googleapis\.com)[^>]*>/,
              (link) =>
                link.replace(/>$/, ' media="print" data-dashboard-fonts>'),
            )
            .replace(
              "</head>",
              `<style>${styles}</style><script>${bootstrap}</script></head>`,
            )
        );
      },
    },
  };
}
