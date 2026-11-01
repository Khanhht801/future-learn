const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1536, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/dashboard/math/mercury/');
    await page.evaluate(() => localStorage.setItem('futurelearn.math.mercury.v3', '[10,10,0,0,0,0]'));
    await page.reload();
    for (const width of [320,390,768,1024,1536]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
      assert(await page.locator('.sequence-row').evaluate(row => {
        const r = row.getBoundingClientRect();
        return [...row.children].every(c => { const b = c.getBoundingClientRect(); return b.left >= r.left && b.right <= r.right && c.scrollWidth <= c.clientWidth; });
      }));
      assert.equal(await page.locator('.sequence-hint-toggle').isVisible(), true);
      if ([390,1536].includes(width)) await page.screenshot({ path: process.env.TEMP + '/sequence-redesign-' + width + '.png', fullPage: true });
    }
    for (let i = 0; i < 10; i++) {
      const tiles = await page.locator('.sequence-box').allTextContents();
      const blank = tiles.indexOf('?');
      const answer = blank === 0 ? Number(tiles[1]) - 1 : Number(tiles[blank-1]) + 1;
      const hint = page.locator('.sequence-hint-toggle');
      assert.equal(await hint.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#sequence-hint-detail').isHidden(), true);
      await hint.focus(); await page.keyboard.press('Enter');
      assert.equal(await hint.getAttribute('aria-expanded'), 'true');
      assert.match(await page.locator('#sequence-hint-detail').textContent(), blank === 0 ? /đứng ngay trước/ : /đứng ngay sau/);
      assert.equal(await page.locator('#score').textContent(), i + '/10');
      await hint.click();
      assert.equal(await page.locator('#sequence-hint-detail').isHidden(), true);
      const buttons = page.locator('.number-tile');
      await buttons.filter({ hasText: new RegExp('^(?!' + answer + '$)') }).first().click();
      await page.locator('.sequence-drop').click();
      assert.match(await page.locator('#feedback').textContent(), /Chưa đúng/);
      assert.equal(await page.locator('#score').textContent(), i + '/10');
      const correct = buttons.filter({ hasText: new RegExp('^' + answer + '$') });
      await correct.scrollIntoViewIfNeeded();
      const from = await correct.boundingBox(), to = await page.locator('.sequence-drop').boundingBox();
      await page.mouse.move(from.x + from.width/2, from.y + from.height/2); await page.mouse.down();
      await page.mouse.move(to.x + to.width/2, to.y + to.height/2, { steps: 8 }); await page.mouse.up();
      assert.equal(await page.locator('.sequence-drop').textContent(), String(answer));
      assert.equal(await page.locator('#score').textContent(), (i+1) + '/10');
      assert.equal(await correct.isDisabled(), true);
      await page.locator('#check').click();
    }
    assert.equal(await page.locator('.is-sequence-hint').count(), 0);
    assert.equal(await page.locator('.sequence-hint-toggle').count(), 0);
    assert.equal(await page.locator('.comparison-hint-toggle').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log('Passed: 10 sequences, mouse drag, wrong retry, contextual hints including first/last blank, keyboard toggle/reset, mission switch, 320–1536px, no JS errors.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
