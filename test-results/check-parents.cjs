const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
const screenshotDirectory = process.env.SCREENSHOT_DIR || __dirname;

(async function () {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, reducedMotion: 'reduce' });
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
  async function openReport(prefix = '') {
    const response = await page.goto(base + prefix + '/dashboard/parents/');
    assert.equal(response.status(), 200);
    await page.locator('[data-subject="english"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
  }
  async function screenshot(name) {
    await page.screenshot({ path: path.join(screenshotDirectory, name), fullPage: true, animations: 'disabled' });
  }
  try {
    await openReport();
    assert.equal(await page.locator('[data-reward-count]').textContent(), '120');
    assert.equal(await page.locator('[data-parent-stars]').textContent(), '120');
    assert.equal(await page.locator('[data-streak]').textContent(), '3 ngày');
    assert.equal(await page.locator('[data-week-completed]').textContent(), '8/10');
    assert.equal(await page.locator('[data-recent-activities] li').count(), 4);
    const subjectProgress = await page.locator('[data-subject]').evaluateAll(elements => elements.map(el => [el.dataset.subject, el.value, el.max]));
    assert.deepEqual(subjectProgress, [['math', 2, 5], ['english', 9, 30]]);
    assert.equal(await page.locator('[data-chart-table] tr').count(), 4);
    assert.deepEqual(await page.locator('[data-chart-table] tr').last().locator('td').allTextContents(), ['40%', '30%']);
    await screenshot('parents-desktop.png');

    // Real user actions: change the chart, read accessible data, inspect subjects.
    const originalChart = await page.locator('.chart-series--math polyline').getAttribute('points');
    await page.locator('[data-chart-period]').selectOption('8');
    assert.equal(await page.locator('[data-chart-table] tr').count(), 8);
    assert.notEqual(await page.locator('.chart-series--math polyline').getAttribute('points'), originalChart);
    assert.match(await page.locator('[data-chart-status]').textContent(), /8 tuần/);
    await page.locator('.chart-data summary').click();
    assert.equal(await page.locator('.chart-data table').isVisible(), true);
    await page.locator('[data-chart-period]').selectOption('4');
    assert.equal(await page.locator('[data-chart-table] tr').count(), 4);

    await page.locator('[data-open-progress]').click();
    assert.equal(await page.locator('[data-parent-dialog]').evaluate(el => el.open), true);
    assert.equal(await page.locator('.report-items li').count(), 8);
    assert.match(await page.locator('.report-subject').first().textContent(), /2\/5 chặng/);
    assert.match(await page.locator('.report-subject').last().textContent(), /9\/30 từ vựng/);
    assert.equal(await page.locator('[data-dialog-close]').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('.report-subject a').last().evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('[data-dialog-close]').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-open-progress]').evaluate(el => el === document.activeElement), true);

    await page.locator('[data-open-activities]').click();
    assert.equal(await page.locator('[data-dialog-content] .activity-list li').count(), 6);
    await page.locator('[data-dialog-close]').click();
    assert.equal(await page.locator('[data-open-activities]').evaluate(el => el === document.activeElement), true);
    await page.locator('[data-open-profile]').click();
    assert.match(await page.locator('[data-dialog-content]').textContent(), /Nguyễn An/);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-open-profile]').evaluate(el => el === document.activeElement), true);
    // Viewing the report must not create rewards, resume records or progress.
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);

    for (const width of [320, 360, 390, 600, 768, 900, 1024, 1280, 1448, 1536]) {
      await page.setViewportSize({ width, height: 900 });
      await openReport();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Page overflow at ' + width);
      for (const selector of ['.sidebar', '#mobile-drawer', '.bottom-nav']) {
        const current = page.locator(selector + ' [aria-current="page"]');
        assert.equal(await current.count(), 1);
        assert.equal(await current.getAttribute('aria-label'), 'Góc phụ huynh');
      }
      assert.equal(await page.evaluate(() => {
        const name = document.querySelector('[data-learner-name]').getBoundingClientRect();
        const badge = document.querySelector('.learner-status').getBoundingClientRect();
        return name.right <= badge.left || name.left >= badge.right || name.bottom <= badge.top || name.top >= badge.bottom;
      }), true, 'Profile overlap at ' + width);
      await page.locator('[data-open-progress]').click();
      assert.equal(await page.locator('[data-parent-dialog]').evaluate(el => el.scrollWidth <= el.clientWidth), true, 'Dialog overflow at ' + width);
      await page.keyboard.press('Escape');
      if (width === 390) {
        await screenshot('parents-mobile.png');
        await page.locator('[data-menu-button]').click();
        assert.equal(await page.locator('main').evaluate(el => el.inert), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('main').evaluate(el => el.inert), false);
        await page.locator('[data-open-activities]').click();
        await page.locator('[data-dialog-content] .activity-link').first().click();
        await page.waitForURL('**/dashboard/english/?topic=animals');
        assert.equal(await page.locator('[data-topic-dialog]').evaluate(el => el.open), true);
      }
      if (width === 900) await screenshot('parents-tablet.png');
    }

    // Shared navigation from every existing page, including the mobile drawer.
    await page.setViewportSize({ width: 1448, height: 1000 });
    for (const subject of ['', 'math/', 'english/', 'badges/']) {
      await page.goto(base + '/dashboard/' + subject);
      await page.locator('.sidebar a[aria-label="Góc phụ huynh"]').click();
      await page.waitForURL('**/dashboard/parents/');
    }
    await page.goto(base + '/dashboard/?panel=parents');
    await page.waitForURL('**/dashboard/parents/');
    await page.locator('[data-sidebar-toggle]').click();
    assert.equal(await page.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'false');
    await page.reload();
    assert.equal(await page.locator('[data-sidebar-toggle]').getAttribute('aria-expanded'), 'false');
    await page.locator('[data-sidebar-toggle]').click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/dashboard/');
    await page.locator('[data-menu-button]').click();
    await page.locator('#mobile-drawer a[aria-label="Góc phụ huynh"]').click();
    await page.waitForURL('**/dashboard/parents/');

    // URL resolution under a deployment prefix, plus every local content link.
    await page.route(base + '/preview/**', async route => {
      const response = await route.fetch({ url: route.request().url().replace('/preview/', '/') });
      await route.fulfill({ response });
    });
    await openReport('/preview');
    assert.equal(new URL(await page.locator('.sidebar [aria-current="page"]').getAttribute('href')).pathname, '/preview/dashboard/parents/');
    const links = await page.locator('main a[href]').evaluateAll(elements => [...new Set(elements.map(el => el.href))]);
    for (const link of links) {
      assert.equal(link.startsWith(base + '/preview/dashboard/'), true);
      assert.equal((await context.request.get(link.replace(base + '/preview/', base + '/'))).status(), 200, link);
    }

    const blocked = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await blocked.addInitScript(() => {
      Storage.prototype.getItem = function () { throw Error('Storage blocked'); };
      Storage.prototype.setItem = function () { throw Error('Storage blocked'); };
    });
    const blockedPage = await blocked.newPage();
    track(blockedPage);
    await blockedPage.goto(base + '/dashboard/parents/');
    await blockedPage.locator('[data-chart-period]').selectOption('8');
    assert.equal(await blockedPage.locator('[data-chart-table] tr').count(), 8);
    await blockedPage.locator('[data-open-progress]').click();
    assert.equal(await blockedPage.locator('.report-items li').count(), 8);
    await blocked.close();
    assert.deepEqual(errors, []);
    assert.deepEqual([...missing], []);
    console.log('PASS: shared subject data, 4/8-week chart and accessible table, report/activity/profile dialogs, keyboard and focus, no progress/reward writes, 320–1536px, navigation from all pages and mobile, legacy redirect, sidebar persistence, prefix hosting, local links, blocked storage and reduced motion.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
