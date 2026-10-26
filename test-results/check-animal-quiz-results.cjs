const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    for (const width of [1920, 320]) {
      for (let score = 0; score <= 10; score++) {
        const page = await browser.newPage({viewport: {width, height: width === 1920 ? 1080 : 800}, reducedMotion: width === 320 ? 'reduce' : 'no-preference'});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base + '/dashboard/english/animals/', {waitUntil: 'domcontentloaded'});
        await page.evaluate(() => {
          for (let i = 0; i < 10; i++) document.querySelector('[data-next]').click();
          document.querySelector('[data-mode="quiz"]').click();
        });
        await page.locator('[data-fullscreen]').click();
        await page.evaluate(expected => {
          for (let i = 0; i < 10; i++) {
            const target = window.animalWords[i].vi;
            Array.from(document.querySelectorAll('[data-answers] button')).find(button => (button.textContent === target) === (i < expected)).click();
            document.querySelector('[data-question-next]').click();
          }
        }, score);
        assert.equal(await page.locator('[data-feedback]').textContent(), `Bé đã đạt ${score} điểm!`);
        assert.equal(await page.locator('[data-quiz-sad]').isVisible(), score < 6);
        assert.equal(await page.locator('[data-practice-celebration]').isVisible(), score >= 6);
        assert.equal(await page.locator('[data-quiz-encouragement]').isVisible(), score < 8);
        if (width === 1920 && score < 8) {
          assert.equal(await page.locator('[data-quiz-encouragement]').evaluate(el => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight) + 1), true, 'encouragement stays on one line when space permits');
        }
        assert.equal(await page.locator('[data-quiz-new-topic]').isVisible(), score >= 8);
        assert.equal(await page.locator('.flashcard').evaluate(el => el.scrollWidth <= el.clientWidth), true);
        assert.equal(await page.locator('[data-quiz-retry]').isVisible(), true);
        const decoration = page.locator(score < 6 ? '.quiz-sad-face svg' : '.practice-celebration svg');
        assert.equal(await decoration.evaluate(el => getComputedStyle(el).animationName === 'none'), width === 320);
        if (process.env.QUIZ_SCREENSHOT_DIR && [0, 7, 10].includes(score)) {
          await page.screenshot({path: `${process.env.QUIZ_SCREENSHOT_DIR}/quiz-result-${score}-${width}.png`});
        }
        if (score === 10 && width === 1920) {
          await page.locator('[data-quiz-new-topic]').click();
          await page.waitForURL(base + '/dashboard/english/#topics');
          assert.equal(await page.locator('#topics').isVisible(), true);
        } else {
          await page.locator('[data-quiz-retry]').click();
          assert.match(await page.locator('[data-question]').textContent(), /1\/10/);
          assert.equal(await page.locator('[data-quiz-actions]').isVisible(), false);
          assert.equal(await page.locator('[data-answers] img').count(), 4);
          assert.equal(await page.evaluate(() => !!document.fullscreenElement), true);
        }
        assert.deepEqual(errors, []);
        await page.close();
      }
    }
    console.log('PASS: all quiz scores, celebrations, encouragement, retry/topic navigation, fullscreen, reduced motion and desktop/mobile layout');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
