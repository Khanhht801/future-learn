/* Exercise the real browser HTTP cache: request a CSS URL as JS, then as a stylesheet. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:5173";
const dev = process.env.DEV_SERVER === "1";

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL
      ? { channel: process.env.BROWSER_CHANNEL }
      : {}),
  });
  try {
    // Do not use request interception here: Playwright routing disables the HTTP cache.
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (
        response.url().startsWith(base) &&
        response.request().resourceType() === "stylesheet"
      ) {
        if (response.status() >= 400)
          errors.push(response.status() + " " + response.url());
        // A 304 reuses the cached response headers and has no Content-Type of its own.
        if (
          response.status() !== 304 &&
          !response.headers()["content-type"]?.startsWith("text/css")
        )
          errors.push("Wrong stylesheet MIME: " + response.url());
      }
    });
    const routes = [
      "/",
      "/dashboard/",
      "/dashboard/math/",
      "/dashboard/english/",
      "/dashboard/badges/",
      "/dashboard/parents/",
      "/dashboard/math/mercury/",
      "/dashboard/english/animals/",
      "/dashboard/english/fruit/",
      "/dashboard/english/colors/",
    ];
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "domcontentloaded" });
      await page.locator("main").waitFor();
      const styles = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="stylesheet"]')]
          .filter((link) => new URL(link.href).origin === location.origin)
          .map((link) => link.href),
      );
      assert(styles.length > 0, "Missing local styles: " + route);
      assert(
        styles.every((url) => !new URL(url).searchParams.has("v")),
        "Reserved Vite version query: " + route,
      );
      if (dev) {
        const responses = await page.evaluate(
          async (urls) =>
            Promise.all(
              urls.map(async (url) => {
                const response = await fetch(url, {
                  headers: { accept: "*/*" },
                  cache: "reload",
                });
                await response.text();
                return {
                  url,
                  type: response.headers.get("content-type"),
                  cache: response.headers.get("cache-control"),
                };
              }),
            ),
          styles,
        );
        assert(
          responses.every((response) => response.type?.includes("javascript")),
          "Exercise the JS response variant",
        );
        assert(
          responses.every((response) => !response.cache?.includes("immutable")),
          "Local CSS must revalidate in dev",
        );
        // Keep the previously broken version URLs cached, as in an existing user tab.
        await page.evaluate(async () => {
          for (const url of [
            "/public-home/css/style.css?v=1.2.1",
            "/public-home/css/home.css?v=1.4.9",
            "/dashboard/shared/layout.css?v=1.0.4",
          ]) {
            const response = await fetch(url, {
              headers: { accept: "*/*" },
              cache: "reload",
            });
            await response.text();
          }
        });
      }
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.locator("main").waitFor();
      const loadedStyles = await page.evaluate(() =>
        [...document.styleSheets]
          .filter(
            (sheet) =>
              sheet.href && new URL(sheet.href).origin === location.origin,
          )
          .map((sheet) => ({ href: sheet.href, rules: sheet.cssRules.length })),
      );
      assert(
        styles.every((url) =>
          loadedStyles.some((sheet) => sheet.href === url && sheet.rules > 0),
        ),
        "Stylesheet failed to parse after reload: " + route,
      );
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const header = page.locator(
          route === "/" ? ".site-header" : ".app-header",
        );
        assert.equal(
          await header.evaluate((node) => getComputedStyle(node).position),
          route === "/" ? "sticky" : "fixed",
          "Unstyled header: " + route,
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Horizontal overflow: " + route + " " + width,
        );
        if (route === "/" && width === 1440) {
          assert.equal(
            await page
              .locator(".site-header__menu")
              .evaluate((node) => getComputedStyle(node).display),
            "flex",
          );
          assert.equal(
            await page
              .locator(".site-header__inner")
              .evaluate((node) => getComputedStyle(node).display),
            "flex",
          );
        }
        if (
          process.env.SCREENSHOT_DIR &&
          ["/", "/dashboard/"].includes(route)
        ) {
          fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
          await page.screenshot({
            path: path.join(
              process.env.SCREENSHOT_DIR,
              `${dev ? "dev" : "build"}-${route === "/" ? "landing" : "dashboard"}-${width}.png`,
            ),
          });
        }
      }
      console.log(
        "PASS: " +
          route +
          " — styled after reload with warm HTTP cache, 320/768/1440px",
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: landing + 9 dashboard routes, CSS MIME types and cache recovery",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
