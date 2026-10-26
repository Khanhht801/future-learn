const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    for (const fallback of [false, true]) {
      const page = await browser.newPage({viewport: {width: 1280, height: 800}});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/dashboard/english/animals/');
      if (fallback) await page.evaluate(() => { document.querySelector('.flashcard').requestFullscreen = () => Promise.reject(Error('denied')); });
      const button = page.locator('[data-fullscreen]');
      const word = await page.locator('[data-word]').textContent();
      await button.click();
      await page.waitForFunction(() => document.querySelector('.flashcard').classList.contains('is-expanded'));
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-word]').textContent(), word);
      assert.equal(await page.locator('[data-ring-count]').textContent(), '0/10');
      assert.equal(await page.evaluate(() => !!document.fullscreenElement), !fallback);
      if (fallback) {
        assert.equal(await page.locator('.word-library').evaluate(el => el.inert), true);
        await button.focus();
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.locator('[data-next]').evaluate(el => el === document.activeElement), true, 'trap backward Tab');
        await page.keyboard.press('Tab');
        assert.equal(await button.evaluate(el => el === document.activeElement), true, 'trap forward Tab');
      }
      for (const width of [1920, 1280, 820, 390, 320]) {
        await page.setViewportSize({width, height: 800});
        const bounds = await page.locator('.flashcard').boundingBox();
        assert.equal(Math.round(bounds.width), width);
        assert.equal(Math.round(bounds.height), 800);
        assert.equal(await page.locator('.flashcard').evaluate(el => el.scrollWidth <= el.clientWidth), true, `overflow at ${width}`);
        assert.equal(await button.isVisible(), fallback);
        if (fallback) assert.equal(await button.locator('svg').isVisible(), false);
      }
      await page.locator('[data-next]').click();
      assert.equal(await page.locator('[data-word]').textContent(), 'Cat');
      assert.equal(await page.locator('[data-ring-count]').textContent(), '1/10');
      if (fallback) {
        await page.keyboard.press('Escape');
      } else {
        // Simulate browser-controlled exit (same fullscreenchange event as Esc).
        await page.evaluate(() => document.exitFullscreen());
      }
      await page.waitForFunction(() => !document.querySelector('.flashcard').classList.contains('is-expanded'));
      assert.equal(await button.getAttribute('aria-pressed'), 'false');
      assert.equal(await button.evaluate(el => el === document.activeElement), true, 'restore focus');
      assert.equal(await page.locator('[data-word]').textContent(), 'Cat');
      assert.equal(await page.evaluate(() => document.querySelectorAll('[inert]').length), 0);
      await button.click();
      await page.waitForFunction(() => document.querySelector('.flashcard').classList.contains('is-expanded'));
      if (fallback) await button.click();
      else await page.evaluate(() => document.exitFullscreen());
      await page.waitForFunction(() => !document.querySelector('.flashcard').classList.contains('is-expanded'));
      // Exercise dialogs must remain reachable inside native fullscreen.
      await button.click();
      for (let i = 0; i < 9; i++) await page.locator('[data-next]').click();
      await page.locator('[data-completion-practice]').click();
      await page.locator('[data-answers] button').first().click();
      assert.equal(await page.locator('.flashcard [data-answer-dialog]').isVisible(), true);
      assert.deepEqual(errors, []);
      await page.close();
    }
    const unsupported = await browser.newPage();
    await unsupported.goto(base + '/dashboard/english/animals/');
    await unsupported.evaluate(() => { document.querySelector('.flashcard').requestFullscreen = undefined; });
    await unsupported.locator('[data-fullscreen]').click();
    assert.equal(await unsupported.locator('html').evaluate(el => el.classList.contains('lesson-fullscreen-open')), true);
    await unsupported.keyboard.press('Escape');
    assert.equal(await unsupported.locator('[data-fullscreen]').getAttribute('aria-pressed'), 'false');
    await unsupported.close();
    console.log('PASS: native fullscreen, rejected API fallback, exit/reentry, state retention, dialogs and responsive widths');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
