const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
const screenshotDirectory = process.env.SCREENSHOT_DIR || __dirname;

(async function () {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1448, height: 1086 } });
  const page = await context.newPage();
  const errors = [];
  const missing = new Set();
  function track(target) {
    target.on('pageerror', error => errors.push(error.message));
    target.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) missing.add(response.url());
    });
  }
  track(page);
  const badge = id => page.locator('[data-badge-id="' + id + '"]');
  async function showAllBadges() {
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-all-badges]').click();
    await page.setViewportSize(viewport);
  }
  try {
    await page.goto(base + '/dashboard/badges/');
    await page.locator('[data-badge-id="first-steps"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('img[src]')].filter(el => el.loading !== 'lazy').every(el => el.complete && el.naturalWidth > 0));
    assert.equal(await page.locator('.badge-card').count(), 6);
    assert.equal(await page.locator('[data-earned-count]').textContent(), '2');
    assert.equal(await page.evaluate(() => localStorage.getItem('futurelearn-demo-badges-v1')), null);
    assert.equal(await page.locator('[data-reward-count]').textContent(), '120');
    assert.equal(await page.locator('[data-goal-count]').textContent(), '2/3');
    assert.match(await page.locator('[data-next-title]').textContent(), /^Chăm chỉ/);
    assert.equal(await page.locator('.is-celebrating').count(), 0);
    await page.screenshot({ path: path.join(screenshotDirectory, 'badges-desktop.png'), fullPage: true, animations: 'disabled' });

    await badge('explorer').click();
    assert.equal(await page.locator('[data-claim-badge]').isVisible(), false);
    assert.equal(await page.locator('[data-dialog-learn]').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await badge('explorer').evaluate(el => el === document.activeElement), true);

    await badge('first-steps').click();
    assert.equal(await page.locator('[data-claim-badge]').evaluate(el => el === document.activeElement), true);
    await page.locator('[data-claim-badge]').click();
    assert.equal(await page.locator('[data-badge-dialog]').evaluate(el => el.classList.contains('is-celebrating')), true);
    assert.equal(await page.locator('[data-confetti] i').count(), 28);
    assert.equal(await page.locator('[data-earned-count]').textContent(), '3');
    assert.equal(await page.locator('[data-claim-badge]').isVisible(), false);
    assert.equal(await page.locator('[data-reward-count]').textContent(), '120');
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(screenshotDirectory, 'badges-reward.png') });
    await page.locator('[data-reward-done]').click();
    await page.waitForFunction(() => document.activeElement.dataset.badgeId === 'first-steps');
    assert.equal(await badge('first-steps').evaluate(el => el === document.activeElement), true);
    await page.reload();
    assert.equal(await page.locator('[data-earned-count]').textContent(), '3');
    assert.equal(await page.locator('.is-celebrating').count(), 0);
    await badge('first-steps').click();
    assert.equal(await page.locator('[data-claim-badge]').isVisible(), false);
    await page.locator('[data-replay-reward]').click();
    assert.equal(await page.locator('[data-earned-count]').textContent(), '3');
    await page.keyboard.press('Escape');

    await showAllBadges();
    assert.equal(await page.locator('.badge-card').count(), 12);
    await page.locator('[data-filter="earned"]').click();
    assert.equal(await page.locator('.badge-card').count(), 3);
    await page.locator('[data-filter="locked"]').click();
    assert.equal(await page.locator('.badge-card').count(), 2);
    await page.locator('[data-filter="progress"]').click();
    assert.equal(await page.locator('.badge-card').count(), 7);
    await page.locator('[data-my-badges]').click();
    assert.equal(await page.locator('[data-filter="earned"]').getAttribute('aria-pressed'), 'true');

    // A second tab receives the saved claim without another animation or point award.
    const second = await context.newPage();
    track(second);
    await second.goto(base + '/dashboard/badges/');
    await page.evaluate(() => localStorage.setItem('futurelearn-demo-badges-v1', '[]'));
    await second.waitForFunction(() => document.querySelector('[data-earned-count]').textContent === '2');
    assert.equal(await second.locator('.is-celebrating').count(), 0);
    await second.close();

    for (const width of [320, 390, 768, 900, 1448]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + '/dashboard/badges/');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Overflow at ' + width);
      for (const selector of ['.sidebar', '#mobile-drawer', '.bottom-nav']) {
        assert.equal(await page.locator(selector + ' [aria-current="page"]').count(), 1);
      }
      if (width === 390) {
        await page.screenshot({ path: path.join(screenshotDirectory, 'badges-mobile.png'), fullPage: true, animations: 'disabled' });
        await page.locator('[data-menu-button]').click();
        assert.equal(await page.locator('main').evaluate(el => el.inert), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('main').evaluate(el => el.inert), false);
        await badge('first-steps').click();
        await page.locator('[data-claim-badge]').click();
        assert.equal(await page.locator('[data-reward-done]').isVisible(), true);
        assert.equal(await page.locator('[data-badge-dialog]').evaluate(el => el.scrollWidth <= el.clientWidth), true);
        await page.locator('[data-reward-done]').click();
      }
    }

    await page.setViewportSize({ width: 1448, height: 1086 });
    await page.goto(base + '/dashboard/?panel=garden');
    await page.waitForURL('**/dashboard/badges/');
    for (const subject of ['', 'math/', 'english/']) {
      await page.goto(base + '/dashboard/' + subject);
      await page.locator('.sidebar a[aria-label="Bộ sưu tập huy hiệu"]').click();
      await page.waitForURL('**/dashboard/badges/');
    }
    await page.goto(base + '/dashboard/');
    await page.locator('.task-card--badges a').click();
    await page.waitForURL('**/dashboard/badges/');

    // Prefix hosting checks relative navigation and every generated asset URL.
    await page.route(base + '/preview/**', async route => {
      const response = await route.fetch({ url: route.request().url().replace('/preview/', '/') });
      await route.fulfill({ response });
    });
    await page.goto(base + '/preview/dashboard/badges/');
    assert.equal(new URL(await page.locator('.sidebar [aria-current="page"]').getAttribute('href')).pathname, '/preview/dashboard/badges/');
    assert.equal(await page.locator('.badge-hero__art').evaluate(el => el.complete && el.naturalWidth > 0), true);
    await showAllBadges();
    await page.locator('.badge-card').last().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.badge-card__art')].every(el => el.complete && el.naturalWidth > 0));

    const blocked = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    await blocked.addInitScript(() => {
      Storage.prototype.getItem = function () { throw Error('Storage blocked'); };
      Storage.prototype.setItem = function () { throw Error('Storage blocked'); };
    });
    const blockedPage = await blocked.newPage();
    track(blockedPage);
    await blockedPage.goto(base + '/dashboard/badges/');
    await blockedPage.locator('[data-badge-id="first-steps"]').click();
    await blockedPage.locator('[data-claim-badge]').click();
    assert.match(await blockedPage.locator('[data-dialog-note]').textContent(), /chặn lưu trữ/);
    assert.equal(await blockedPage.locator('.reward-art').evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await blockedPage.locator('[data-earned-count]').textContent(), '3');
    await blocked.close();

    await page.goto(base + '/dashboard/badges/');
    await page.evaluate(() => localStorage.setItem('futurelearn-demo-badges-v1', '{broken'));
    await page.reload();
    assert.equal(await page.locator('.badge-card').count(), 6);
    assert.equal(await page.locator('[data-earned-count]').textContent(), '2');
    await page.evaluate(() => localStorage.setItem('futurelearn-demo-badges-v1', '["explorer","unknown","first-steps"]'));
    await page.reload();
    assert.equal(await page.locator('[data-earned-count]').textContent(), '3');
    assert.equal(await badge('explorer').evaluate(el => el.classList.contains('badge-card--locked')), true);

    assert.deepEqual(errors, []);
    assert.deepEqual([...missing], []);
    console.log('PASS: badge filters, locked/ready/earned details, explicit claim and replay, persistence, cross-tab sync, no duplicate rewards, keyboard focus, legacy and subject links, 320–1448px, prefix hosting, assets, blocked/corrupt storage and reduced motion.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
