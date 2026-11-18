/* Browser regression checks for the React dashboard against a production preview. */
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:4175";
const screenshotDir = process.env.SCREENSHOT_DIR;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL
      ? { channel: process.env.BROWSER_CHANNEL }
      : {}),
  });
  const errors = [],
    missing = new Set();
  function track(page) {
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.url().startsWith(base) && response.status() >= 400)
        missing.add(response.url());
    });
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  track(page);
  async function open(route) {
    await page.goto(base + "/dashboard/" + route);
    await page.locator("main").waitFor();
    await page.evaluate(() => document.fonts.ready);
  }
  async function noOverflow() {
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow: ${page.url()}`,
    );
  }
  try {
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
    if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await open(route);
        await noOverflow();
        assert.equal(await page.locator(".app-header").count(), 1);
        assert.equal(await page.locator(".sidebar").count(), 1);
        assert.equal(await page.locator(".bottom-nav").count(), 1);
        for (const selector of [".sidebar", "#mobile-drawer", ".bottom-nav"])
          assert.equal(
            await page.locator(selector + ' [aria-current="page"]').count(),
            1,
          );
        if (screenshotDir && [390, 768, 1440].includes(width))
          await page.screenshot({
            path: path.join(
              screenshotDir,
              (route.replaceAll("/", "-") || "home") + "-" + width + ".png",
            ),
            fullPage: true,
          });
      }
    }
    console.log("PASS: 9 React routes, assets and 320–1440px layouts");

    await open("");
    assert.equal(
      await page.locator("[data-math-count]").textContent(),
      "2/5 chặng",
    );
    assert.equal(
      await page.locator("[data-english-count]").textContent(),
      "9/30 từ",
    );
    await page.locator("[data-all-tasks]").click();
    assert.equal(await page.locator(".home-dialog__tasks li").count(), 3);
    await page.keyboard.press("Escape");
    assert(
      await page
        .locator("[data-all-tasks]")
        .evaluate((node) => node === document.activeElement),
    );
    await page.locator("[data-open-profile]").click();
    assert.match(
      await page.locator("[data-dialog-content]").textContent(),
      /hồ sơ minh họa của An/,
    );
    await page.keyboard.press("Escape");
    await page.locator("[data-sidebar-toggle]").click();
    const expanded = await page
      .locator("[data-sidebar-toggle]")
      .getAttribute("aria-expanded");
    await open("math/");
    assert.equal(
      await page.locator("[data-sidebar-toggle]").getAttribute("aria-expanded"),
      expanded,
    );
    await page
      .locator("[data-challenge-options] button")
      .filter({ hasText: /^11$/ })
      .click();
    assert.match(
      await page.locator("[data-challenge-feedback]").textContent(),
      /Chưa đúng/,
    );
    await page
      .locator("[data-challenge-options] button")
      .filter({ hasText: /^13$/ })
      .click();
    assert.match(
      await page.locator("[data-challenge-feedback]").textContent(),
      /Chính xác/,
    );
    await open("math/?lesson=geometry");
    assert.equal(
      await page.locator("[data-dialog-title]").textContent(),
      "Hình học",
    );
    await page.keyboard.press("Escape");
    await open("");
    assert.match(
      await page.locator("[data-resume-learning]").getAttribute("href"),
      /lesson=geometry/,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("[data-menu-button]").click();
    assert(await page.locator("main").evaluate((node) => node.inert));
    assert(
      await page
        .locator("[data-menu-close]")
        .evaluate((node) => node === document.activeElement),
    );
    await page.keyboard.press("Shift+Tab");
    assert(
      await page
        .locator("#mobile-drawer a")
        .last()
        .evaluate((node) => node === document.activeElement),
    );
    await page.keyboard.press("Escape");
    assert(!(await page.locator("main").evaluate((node) => node.inert)));
    await open("?panel=garden");
    await page.waitForURL("**/dashboard/badges/");
    await open("?panel=parents");
    await page.waitForURL("**/dashboard/parents/");
    console.log(
      "PASS: shared navigation, keyboard drawer, profile/tasks, resume and legacy links",
    );

    await page.setViewportSize({ width: 1440, height: 1000 });
    await open("parents/");
    assert.equal(await page.locator("[data-chart-table] tr").count(), 4);
    await page.locator("[data-chart-period]").selectOption("8");
    assert.equal(await page.locator("[data-chart-table] tr").count(), 8);
    await page.locator("[data-open-progress]").click();
    assert.equal(await page.locator(".report-items li").count(), 8);
    await page.keyboard.press("Shift+Tab");
    assert(
      await page
        .locator(".report-subject a")
        .last()
        .evaluate((node) => node === document.activeElement),
    );
    await page.keyboard.press("Escape");
    assert(
      await page
        .locator("[data-open-progress]")
        .evaluate((node) => node === document.activeElement),
    );
    await page.locator("[data-open-activities]").click();
    assert.equal(
      await page.locator("[data-dialog-content] .activity-list li").count(),
      6,
    );
    await page.keyboard.press("Escape");
    console.log("PASS: parent chart, accessible data, reports and modal focus");

    for (const topic of ["animals", "fruit", "colors"]) {
      const { words } = await import(
        pathToFileURL(
          path.resolve(__dirname, "../src/dashboard/data/" + topic + ".ts"),
        ).href
      );
      await open("english/?topic=" + topic);
      await page.waitForURL("**/dashboard/english/" + topic + "/");
      await page.locator(".word-tile").first().waitFor();
      assert.equal(await page.locator(".word-tile").count(), 10);
      assert.equal(
        await page.locator('[data-mode="practice"]').isDisabled(),
        true,
      );
      await page.locator(".word-dot").nth(5).click();
      assert.equal(
        await page.locator("[data-ring-count]").textContent(),
        "0/10",
      );
      await page.locator(".word-dot").first().click();
      await page.evaluate(() => {
        window.__spoken = [];
        Object.defineProperty(window, "SpeechSynthesisUtterance", {
          value: function (text) {
            this.text = text;
          },
          configurable: true,
        });
        Object.defineProperty(window, "speechSynthesis", {
          value: {
            cancel() {},
            getVoices() {
              return [];
            },
            speak(value) {
              window.__spoken.push(value.text);
            },
          },
          configurable: true,
        });
      });
      await page.locator("[data-speak]").click();
      assert.deepEqual(await page.evaluate(() => window.__spoken), [
        words[0].en,
      ]);
      for (const word of words) {
        assert.equal(await page.locator("[data-word]").textContent(), word.en);
        assert.equal(
          await page.locator("[data-example] strong").textContent(),
          word.id,
        );
        await page.locator("[data-next]").click();
      }
      assert(await page.locator("[data-completion]").isVisible());
      assert.equal(
        await page.locator("[data-ring-count]").textContent(),
        "10/10",
      );
      await page.locator("[data-completion-practice]").click();
      await page
        .locator("[data-answers] button")
        .filter({ has: page.locator(`img[alt="${words[1].vi}"]`) })
        .click();
      assert.equal(
        await page.locator("[data-answer-dialog]").getAttribute("data-correct"),
        "false",
      );
      await page.locator("[data-answer-action]").click();
      for (const word of words) {
        await page
          .locator("[data-answers] button")
          .filter({ has: page.locator(`img[alt="${word.vi}"]`) })
          .click();
        assert.equal(
          await page
            .locator("[data-answer-dialog]")
            .getAttribute("data-correct"),
          "true",
        );
        await page.locator("[data-answer-action]").click();
      }
      assert.equal(
        await page.locator("[data-feedback]").textContent(),
        "Bé đã luyện tập 10 từ mới!",
      );
      const saved = await page.evaluate(
        (topic) =>
          JSON.parse(localStorage.getItem(`futurelearn.english.${topic}.v1`)),
        topic,
      );
      assert.equal(saved.results.practice.score, 9);
      await page.reload();
      await page.locator("[data-ring-count]").waitFor();
      assert.equal(
        await page.locator("[data-ring-count]").textContent(),
        "10/10",
      );
      await open("english/");
      assert.equal(
        await page.locator(`#topic-${topic} .topic-card__count`).textContent(),
        "10/10 từ",
      );
    }
    console.log(
      "PASS: all 3 vocabulary topics, pronunciation, completion, retry scoring, storage and island integration",
    );

    const { words } = await import(
      pathToFileURL(path.resolve(__dirname, "../src/dashboard/data/animals.ts"))
        .href
    );
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await open("english/animals/");
      for (const expected of [0, 5, 6, 7, 8, 10]) {
        await page.locator('[data-mode="quiz"]').click();
        for (let i = 0; i < words.length; i++) {
          const options = page.locator("[data-answers] button");
          const button =
            i < expected
              ? options.filter({ hasText: words[i].vi })
              : options.filter({ hasNotText: words[i].vi }).first();
          await button.click();
          await page.locator("[data-question-next]").click();
        }
        assert.equal(
          await page.locator("[data-feedback]").textContent(),
          `Bé đã đạt ${expected} điểm!`,
        );
        assert.equal(
          await page.locator("[data-quiz-sad]").isVisible(),
          expected < 6,
        );
        assert.equal(
          await page.locator("[data-practice-celebration]").isVisible(),
          expected >= 6,
        );
        assert.equal(
          await page.locator("[data-quiz-encouragement]").isVisible(),
          expected < 8,
        );
        assert.equal(
          await page.locator("[data-quiz-new-topic]").isVisible(),
          expected >= 8,
        );
        assert(
          await page
            .locator(".flashcard")
            .evaluate((node) => node.scrollWidth <= node.clientWidth),
        );
        await noOverflow();
      }
    }
    console.log(
      "PASS: quiz result thresholds, retry and desktop/mobile result layouts",
    );

    for (const fallback of [false, true]) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await open("english/animals/");
      if (fallback)
        await page.locator(".flashcard").evaluate((node) => {
          node.requestFullscreen = () => Promise.reject(Error("denied"));
        });
      await page.locator("[data-fullscreen]").click();
      await page.waitForFunction(() =>
        document.querySelector(".flashcard").classList.contains("is-expanded"),
      );
      assert.equal(
        await page.evaluate(() => !!document.fullscreenElement),
        !fallback,
      );
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        const bounds = await page.locator(".flashcard").boundingBox();
        assert.equal(Math.round(bounds.width), width);
        assert.equal(Math.round(bounds.height), 1000);
        assert(
          await page
            .locator(".flashcard")
            .evaluate((node) => node.scrollWidth <= node.clientWidth),
        );
      }
      await page
        .locator('[data-mode="practice"]')
        .evaluate((node) => node.click());
      await page.locator("[data-answers] button").first().click();
      assert(await page.locator(".flashcard [data-answer-dialog]").isVisible());
      await page.locator("[data-answer-action]").click();
      if (fallback) await page.keyboard.press("Escape");
      else await page.evaluate(() => document.exitFullscreen());
      await page.waitForFunction(
        () =>
          !document
            .querySelector(".flashcard")
            .classList.contains("is-expanded"),
      );
      assert.equal(await page.locator("[inert]").count(), 0);
    }
    console.log(
      "PASS: native/fallback fullscreen, responsive exercise dialogs and cleanup",
    );

    await page.setViewportSize({ width: 1440, height: 1000 });
    await open("math/mercury/");
    const mercury = await import(
      pathToFileURL(path.resolve(__dirname, "../src/dashboard/data/mercury.ts"))
        .href
    );
    for (let mission = 0; mission < 6; mission++) {
      assert.equal(
        await page
          .locator('.mission-button[aria-current="step"] .mission-number')
          .textContent(),
        String(mission + 1),
      );
      for (let question = 0; question < 10; question++) {
        const type = mission === 5 ? question % 5 : mission;
        assert.equal(
          await page.locator("#question-count").textContent(),
          `Câu ${question + 1}/10`,
        );
        if (type === 0) {
          for (
            let index = 0;
            index < mercury.coloringTargets[question];
            index++
          )
            await page.locator(".star-button").nth(index).click();
        } else if (type === 1) {
          await page
            .locator(
              `.group-choice[data-count="${mercury.groupQuestions[question].target}"]`,
            )
            .click();
        } else if (type === 2 || type === 3) {
          const answer =
            type === 2
              ? mercury.sequenceQuestions[question].start +
                mercury.sequenceQuestions[question].blank
              : mercury.comparisonPairs[question][0] <
                  mercury.comparisonPairs[question][1]
                ? "<"
                : mercury.comparisonPairs[question][0] >
                    mercury.comparisonPairs[question][1]
                  ? ">"
                  : "=";
          await page
            .locator(
              type === 2
                ? ".number-tile"
                : ".comparison-options .choice-button",
            )
            .filter({ hasText: new RegExp("^" + answer + "$") })
            .click();
          await page
            .locator(type === 2 ? ".sequence-drop" : ".comparison-slot")
            .click();
          assert.equal(
            await page.locator("#score").textContent(),
            `${question + 1}/10`,
          );
        } else {
          for (const value of [...mercury.sortingSets[question]].sort(
            (a, b) => a - b,
          ))
            await page
              .locator(".answer-options .choice-button")
              .filter({ hasText: new RegExp("^" + value + "$") })
              .click();
        }
        if (type !== 2 && type !== 3) {
          await page.locator("#check").click();
          assert.equal(
            await page.locator("#score").textContent(),
            `${question + 1}/10`,
          );
        }
        assert.match(
          await page.locator("#feedback").textContent(),
          /Chính xác|hoàn thành|chinh phục/,
        );
        await page.locator("#check").click();
      }
    }
    assert.deepEqual(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("futurelearn.math.mercury.v3")),
      ),
      [10, 10, 10, 10, 10, 10],
    );
    await page.reload();
    await page.locator(".mission-button").first().waitFor();
    assert.equal(await page.locator(".mission-button:disabled").count(), 0);
    console.log(
      "PASS: all 60 Mercury questions, 6 missions, unlocks, mixed challenge and saved completion",
    );

    // Multi-page build must also work beneath a hosting prefix.
    await page.route(base + "/preview/**", async (route) => {
      const response = await route.fetch({
        url: route.request().url().replace("/preview/", "/"),
      });
      await route.fulfill({ response });
    });
    await page.goto(base + "/preview/dashboard/badges/");
    await page.locator(".badge-card").first().waitFor();
    assert.equal(
      new URL(
        await page.locator(".sidebar [aria-current]").getAttribute("href"),
      ).pathname,
      "/preview/dashboard/badges/",
    );
    await page.locator('.sidebar a[aria-label="Góc học tập"]').click();
    await page.waitForURL("**/preview/dashboard/");
    await page.locator("[data-resume-learning]").waitFor();
    await noOverflow();
    assert.deepEqual(errors, []);
    assert.deepEqual([...missing], []);
    console.log("PASS: prefix hosting, no console errors or missing assets");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
