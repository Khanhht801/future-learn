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
    assert.equal(await page.locator('.is-comparison-exercise').count(), 1);
    await page.locator('#check').click();
    assert.match(await page.locator('#feedback').textContent(), /chọn một đáp án/);
    for (const width of [1536, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
      const boxes = await page.locator('.comparison-number, .comparison-slot').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().width));
      assert(boxes.every(width => width > 40));
    }
    await page.setViewportSize({ width: 1536, height: 1000 });
    await page.screenshot({ path: process.env.TEMP + '/math-comparison-desktop.png', fullPage: true });
    for (let i = 0; i < 10; i++) {
      const [a,b] = (await page.locator('.comparison-number').allTextContents()).map(Number);
      const answer = a < b ? '<' : a > b ? '>' : '=';
      const buttons = page.locator('.comparison-options button');
      const wrong = ['>', '<', '='].find(v => v !== answer);
      await buttons.filter({ hasText: wrong }).click();
      await page.locator('#check').click();
      assert.match(await page.locator('#feedback').textContent(), /Chưa đúng/);
      assert.equal(await page.locator('#score').textContent(), i + '/10');
      const correct = buttons.filter({ hasText: answer });
      await correct.focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.comparison-slot').textContent(), answer);
      assert.equal(await page.locator('[aria-pressed=true].choice-button').count(), 1);
      await page.locator('#check').click();
      assert.equal(await page.locator('#score').textContent(), (i+1) + '/10');
      await buttons.filter({ hasText: wrong }).click();
      assert.equal(await page.locator('.comparison-slot').textContent(), answer);
      if (i < 9) await page.locator('#check').click();
      if (i === 4) { await page.reload(); assert.equal(await page.locator('#question-count').textContent(), 'Câu 6/10'); }
    }
    await page.locator('#check').click();
    assert.equal(await page.locator('.is-comparison-exercise').count(), 0);
    assert.equal(await page.locator('.is-comparison-hint').count(), 0);
    await page.evaluate(() => localStorage.setItem('futurelearn.math.mercury.v3', JSON.stringify([10,10,10,10,10,3])));
    await page.reload();
    assert.equal(await page.locator('.is-comparison-exercise').count(), 1);
    assert.equal(await page.locator('.comparison-options button').count(), 3);
    assert.deepEqual(errors, []);
    console.log('Passed: all 10 comparisons, missing/wrong answers, keyboard, locked result, resume, next mission, final challenge, 320–1536px, no JS errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
