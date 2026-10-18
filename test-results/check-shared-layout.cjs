const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async function () {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const missing = new Set();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) missing.add(new URL(response.url()).pathname);
  });
  const base = 'http://127.0.0.1:4173';

  async function verifyShell(subject, prefix = '') {
    assert.equal(await page.locator('.app-header').count(), 1);
    assert.equal(await page.locator('.sidebar').count(), 1);
    assert.equal(await page.locator('#mobile-drawer').count(), 1);
    assert.equal(await page.locator('.bottom-nav').count(), 1);
    for (const selector of ['.sidebar', '.mobile-drawer', '.bottom-nav']) {
      const active = page.locator(selector + ' [aria-current="page"]');
      assert.equal(await active.count(), 1);
      assert.equal(new URL(await active.getAttribute('href')).pathname, prefix + '/dashboard/' + (subject === 'home' ? '' : subject + '/'));
    }
    assert.equal(await page.locator('[data-reward-count]').textContent(), '120');
    assert.match(await page.locator('[data-reward-chip]').getAttribute('aria-label'), /^120 sao/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.equal(await page.locator('.sidebar-journey').getAttribute('href'), { home: '#daily-tasks', math: '#math-path', english: '#topics' }[subject]);
  }

  try {
    await page.goto(base + '/dashboard/english/');
    await verifyShell('english');
    assert.equal(await page.locator('.topic-card').count(), 3);
    await page.screenshot({ path: 'test-results/layout-after-desktop.png' });
    await page.locator('.topic-card button').first().click();
    assert.equal(await page.locator('[data-topic-dialog]').evaluate(el => el.open), true);
    await page.locator('[data-dialog-close]').click();
    await page.locator('[data-sidebar-toggle]').click();
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('sidebar-is-collapsed')), true);
    await page.locator('.sidebar a[aria-label="Hành tinh Toán"]').click();
    await page.waitForURL('**/dashboard/math/');
    await verifyShell('math');
    assert.equal(await page.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'false');
    await page.reload();
    assert.equal(await page.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'false');
    await page.locator('[data-sidebar-toggle]').click();
    assert.equal(await page.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'true');
    await page.locator('.sidebar a[aria-label="Đảo tiếng Anh"]').click();
    await page.waitForURL('**/dashboard/english/');
    assert.equal(await page.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'true');

    for (const subject of ['home', 'english', 'math']) {
      await page.goto(base + '/dashboard/' + (subject === 'home' ? '' : subject + '/'));
      await page.setViewportSize({ width: 900, height: 1000 });
      await verifyShell(subject);
      await page.setViewportSize({ width: 390, height: 844 });
      await verifyShell(subject);
      assert.equal(await page.locator('.sidebar').isVisible(), false);
      assert.equal(await page.locator('.bottom-nav').isVisible(), true);
      await page.locator('[data-menu-button]').click();
      assert.equal(await page.locator('#mobile-drawer').isVisible(), true);
      assert.equal(await page.locator('main').evaluate(el => el.inert), true);
      assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-menu-close')), true);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement === Array.from(document.querySelectorAll('#mobile-drawer a[href]')).at(-1)), true);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-menu-close')), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-drawer').isVisible(), false);
      assert.equal(await page.locator('main').evaluate(el => el.inert), false);
      assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-menu-button')), true);
      await page.locator('[data-menu-button]').click();
      await page.locator('[data-drawer-backdrop]').click({ position: { x: 380, y: 500 } });
      assert.equal(await page.locator('#mobile-drawer').isVisible(), false);
      await page.locator('[data-menu-button]').click();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.waitForFunction(() => document.querySelector('#mobile-drawer').hidden);
      assert.equal(await page.locator('main').evaluate(el => el.inert), false);
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/dashboard/english/');
    await page.screenshot({ path: 'test-results/layout-after-mobile.png' });
    await page.locator('.bottom-nav a[aria-label="Hành tinh Toán"]').click();
    await page.waitForURL('**/dashboard/math/');
    await verifyShell('math');

    // Host under a prefix to catch root-relative or page-relative asset mistakes.
    await page.route(base + '/preview/**', async route => {
      const response = await route.fetch({ url: route.request().url().replace('/preview/', '/') });
      await route.fulfill({ response });
    });
    await page.goto(base + '/preview/dashboard/english/');
    await verifyShell('english', '/preview');
    assert.equal(await page.locator('.brand img').evaluate(el => el.complete && el.naturalWidth > 0), true);

    const blocked = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await blocked.addInitScript(() => {
      Storage.prototype.getItem = function () { throw new Error('Storage blocked'); };
      Storage.prototype.setItem = function () { throw new Error('Storage blocked'); };
    });
    const noStoragePage = await blocked.newPage();
    noStoragePage.on('pageerror', error => errors.push(error.message));
    await noStoragePage.goto(base + '/dashboard/english/');
    await noStoragePage.locator('[data-sidebar-toggle]').click();
    assert.equal(await noStoragePage.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'false');
    await blocked.close();
    assert.deepEqual(errors, []);
    assert.deepEqual([...missing], []);
    console.log('PASS: shared shell, desktop/tablet/mobile, subject links, persisted sidebar, storage blocked, drawer keyboard/backdrop/resize, English preview and subdirectory hosting.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
