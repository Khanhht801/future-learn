/* Stall JS and web fonts to verify the initial HTML skeleton, then release React. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:4175";
const dev = process.env.DEV_SERVER === "1";

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL
      ? { channel: process.env.BROWSER_CHANNEL }
      : {}),
  });
  const routes = [
    "",
    "math/",
    "english/",
    "badges/",
    "parents/",
    "math/mercury/",
    "english/animals/",
    "english/fruit/",
    "english/colors/",
  ];
  try {
    for (const route of routes) {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      if (route === "parents/")
        await context.addInitScript(() => {
          localStorage.setItem("futurelearn-sidebar-collapsed", "true");
        });
      const page = await context.newPage();
      const errors = [],
        scripts = new Set();
      page.on("pageerror", (error) => errors.push(error.message));
      let releaseScripts, releaseFonts;
      const scriptGate = new Promise((resolve) => {
        releaseScripts = resolve;
      });
      const fontGate = new Promise((resolve) => {
        releaseFonts = resolve;
      });
      await page.route("**/*", async (request) => {
        const url = request.request().url();
        if (
          url.startsWith(base) &&
          (request.request().resourceType() === "script" ||
            new URL(url).pathname.endsWith(".js"))
        ) {
          scripts.add(url);
          await scriptGate;
        } else if (url.startsWith("https://fonts.googleapis.com/")) {
          await fontGate;
          return request.fulfill({
            contentType: "text/css",
            body: "/* Controlled font response. */",
          });
        }
        return request.continue();
      });
      try {
        await page.goto(base + "/dashboard/" + route, { waitUntil: "commit" });
        const skeleton = page.locator("[data-dashboard-loading]");
        await skeleton.waitFor({ state: "visible" });
        assert.equal(await skeleton.getAttribute("aria-busy"), "true");
        if (route === "parents/")
          assert(
            await page
              .locator("html")
              .evaluate((node) =>
                node.classList.contains("sidebar-is-collapsed"),
              ),
          );
        assert.equal(
          await page.locator("main").count(),
          0,
          "React must still be blocked",
        );
        assert.equal(
          await page.locator("[data-dashboard-fonts]").getAttribute("media"),
          "print",
        );
        for (const width of [320, 768, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            "skeleton overflow: " + route + width,
          );
          assert.equal(
            await page
              .locator(".dashboard-skeleton__shape")
              .first()
              .evaluate(
                (node) => getComputedStyle(node, "::after").animationName,
              ),
            "none",
          );
          if (
            process.env.SCREENSHOT_DIR &&
            ["", "english/animals/", "parents/"].includes(route)
          ) {
            fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
            await page.screenshot({
              path: path.join(
                process.env.SCREENSHOT_DIR,
                `loading-${route.replaceAll("/", "-") || "home"}-${width}.png`,
              ),
            });
          }
        }
        const preloaded = await page.evaluate(() =>
          [
            ...document.querySelectorAll(
              'link[rel="modulepreload"], script[type="module"][src]',
            ),
          ].map((node) => node.href || node.src),
        );
        releaseScripts();
        await page.locator("main").waitFor();
        assert.equal(await skeleton.count(), 0);
        assert.equal(
          await page.getByText("Đang mở góc học tập…", { exact: true }).count(),
          0,
        );
        // The app is already usable even though the Google Fonts CSS is still stalled.
        assert.equal(
          await page.locator("[data-dashboard-fonts]").getAttribute("media"),
          "print",
        );
        if (!dev)
          for (const script of scripts)
            assert(
              preloaded.includes(script),
              "module was not preloaded by the HTML: " + script,
            );
        releaseFonts();
        await page.waitForFunction(
          () =>
            document.querySelector("[data-dashboard-fonts]").media === "all",
        );
        assert.deepEqual(errors, []);
        console.log(
          "PASS: " +
            (route || "home") +
            ` — immediate skeleton, ${dev ? "direct entry" : "preloaded page"}, nonblocking fonts, clean React mount`,
        );
      } finally {
        releaseScripts();
        releaseFonts();
        await context.close();
      }
    }
    console.log(
      "PASS: all 9 routes, skeleton at 320/768/1440px and reduced motion",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
