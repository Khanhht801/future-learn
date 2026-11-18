const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1536, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/dashboard/math/mercury/');
    await page.evaluate(() => localStorage.setItem('futurelearn.math.mercury.v3', JSON.stringify([10,10,10,0,0,0])));
    await page.reload();
    await page.locator('.exercise-panel').waitFor();
    assert.equal(await page.locator('.is-comparison-exercise').count(), 1);
    assert.equal(await page.locator('#check').isHidden(), true);
    await page.locator('.comparison-slot').click();
    assert.match(await page.locator('#feedback').textContent(), /chọn một dấu/);
    for (const width of [1536, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
      const boxes = await page.locator('.comparison-number, .comparison-slot').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().width));
      assert(boxes.every(width => width > 40));
      assert.equal(await page.locator('.comparison-hint-toggle').isVisible(), true);
      if (width === 390) await page.screenshot({ path: process.env.TEMP + '/math-comparison-mobile.png', fullPage: true });
    }
    await page.setViewportSize({ width: 1536, height: 1000 });
    await page.screenshot({ path: process.env.TEMP + '/math-comparison-desktop.png', fullPage: true });
    for (let i = 0; i < 10; i++) {
      const [a,b] = (await page.locator('.comparison-number').allTextContents()).map(Number);
      const answer = a < b ? '<' : a > b ? '>' : '=';
      const hint = page.locator('.comparison-hint-toggle');
      assert.equal(await hint.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#comparison-hint-detail').isHidden(), true);
      await hint.focus(); await page.keyboard.press('Enter');
      assert.equal(await hint.getAttribute('aria-expanded'), 'true');
      const detail = await page.locator('#comparison-hint-detail').textContent();
      assert(detail.includes(String(a)) && detail.includes(String(b)));
      assert.match(detail, a === b ? /bằng nhau/ : a < b ? /bé hơn/ : /lớn hơn/);
      assert.equal(await page.locator('#score').textContent(), i + '/10');
      await hint.click();
      assert.equal(await page.locator('#comparison-hint-detail').isHidden(), true);
      const buttons = page.locator('.comparison-options button');
      const wrong = ['>', '<', '='].find(v => v !== answer);
      await buttons.filter({ hasText: wrong }).click();
      await page.locator('.comparison-slot').click();
      assert.match(await page.locator('#feedback').textContent(), /Chưa đúng/);
      assert.equal(await page.locator('#score').textContent(), i + '/10');
      const correct = buttons.filter({ hasText: answer });
      await correct.focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('[aria-pressed=true].choice-button').count(), 1);
      if (i % 2 === 0) {
        await correct.scrollIntoViewIfNeeded();
        const from = await correct.boundingBox(), to = await page.locator('.comparison-slot').boundingBox();
        await page.mouse.move(from.x + from.width/2, from.y + from.height/2);
        await page.mouse.down();
        await page.mouse.move(to.x + to.width/2, to.y + to.height/2, { steps: 8 });
        await page.mouse.up();
      } else {
        await page.locator('.comparison-slot').focus(); await page.keyboard.press('Enter');
      }
      assert.equal(await page.locator('.comparison-slot').textContent(), answer);
      assert.equal(await page.locator('#score').textContent(), (i+1) + '/10');
      assert.equal(await buttons.filter({ hasText: wrong }).isDisabled(), true);
      assert.equal(await page.locator('.comparison-slot').textContent(), answer);
      if (i < 9) await page.locator('#check').click();
      if (i === 4) { await page.reload(); assert.equal(await page.locator('#question-count').textContent(), 'Câu 6/10'); }
    }
    await page.locator('#check').click();
    assert.equal(await page.locator('.is-comparison-exercise').count(), 0);
    assert.equal(await page.locator('.is-comparison-hint').count(), 0);
    assert.equal(await page.locator('.comparison-hint-toggle').count(), 0);
    await page.evaluate(() => localStorage.setItem('futurelearn.math.mercury.v3', JSON.stringify([10,10,10,10,10,3])));
    await page.reload();
    await page.locator('.exercise-panel').waitFor();
    assert.equal(await page.locator('.is-comparison-exercise').count(), 1);
    assert.equal(await page.locator('.comparison-options button').count(), 3);
    assert.equal(await page.locator('.comparison-hint-toggle').getAttribute('aria-expanded'), 'false');
    const touchPage = await browser.newPage({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await touchPage.goto(base + '/dashboard/math/mercury/');
    await touchPage.evaluate(() => localStorage.setItem('futurelearn.math.mercury.v3', '[10,10,10,0,0,0]'));
    await touchPage.reload();
    await touchPage.locator('.exercise-panel').waitFor();
    const source = touchPage.locator('.comparison-options button').filter({ hasText: '<' });
    await source.scrollIntoViewIfNeeded();
    const from = await source.boundingBox(), to = await touchPage.locator('.comparison-slot').boundingBox();
    const session = await touchPage.context().newCDPSession(touchPage);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x + from.width/2, y: from.y + from.height/2 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: to.x + to.width/2, y: to.y + to.height/2 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.equal(await touchPage.locator('#score').textContent(), '1/10');
    assert.equal(await touchPage.locator('.number-drag-ghost').count(), 0);
    await page.evaluate(() => localStorage.setItem('futurelearn.math.mercury.v3', '[10,10,0,0,0,0]'));
    await page.reload();
    await page.locator('.exercise-panel').waitFor();
    await page.locator('.number-tile').filter({ hasText: /^4$/ }).click();
    await page.locator('.sequence-drop').click();
    assert.equal(await page.locator('#score').textContent(), '1/10');
    assert.equal(await page.locator('.sequence-drop').textContent(), '4');
    assert.deepEqual(errors, []);
    console.log('Passed: all 10 comparisons, immediate grading, mouse drag, touch drag, keyboard, locked result, resume, next mission, final challenge, sequence regression, 320–1536px, no JS errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
