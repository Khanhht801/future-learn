const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) missing.push(response.url()); });
    await page.goto(base + '/dashboard/english/');
    await page.locator('#topic-fruit button').click();
    await page.waitForURL('**/fruit/');
    assert.equal(await page.locator('h1').textContent(), 'Vườn trái cây');
    assert.equal(await page.locator('.word-tile').count(), 10);
    const words = await page.evaluate(() => window.lessonWords);
    assert.equal(new Set(words.map(word => word.id)).size, 10);
    for (let i = 0; i < words.length; i++) {
      await page.locator('.word-dot').nth(i).click();
      assert.equal(await page.locator('[data-word]').textContent(), words[i].en);
      assert.equal(await page.locator('[data-translation]').textContent(), words[i].vi);
      assert.equal(await page.locator('[data-example] strong').textContent(), words[i].id);
      await page.locator('[data-animal-image]').evaluate(image => image.decode());
    }
    assert.equal(await page.locator('[data-ring-count]').textContent(), '0/10');
    for (const width of [1440, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
    }
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.locator('.word-dot').first().click();
    await page.evaluate(() => {
      window.__spoken = [];
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: function(text) { this.text = text; } });
      Object.defineProperty(window, 'speechSynthesis', { value: { cancel() {}, getVoices() { return []; }, speak(value) { window.__spoken.push(value.text); } } });
    });
    await page.locator('[data-speak]').click();
    assert.deepEqual(await page.evaluate(() => window.__spoken), ['Apple']);
    for (let i = 0; i < 10; i++) {
      assert.equal(await page.locator('[data-mode="practice"]').isDisabled(), true);
      await page.locator('[data-next]').click();
    }
    assert.equal(await page.locator('[data-completion]').isVisible(), true);
    await page.locator('[data-completion-practice]').click();
    // A wrong first answer must allow retry but must not receive a point.
    await page.locator('[data-answers] button').filter({ has: page.locator('img[alt="Quả chuối"]') }).click();
    assert.equal(await page.locator('[data-answer-dialog]').getAttribute('data-correct'), 'false');
    await page.locator('[data-answer-action]').click();
    for (const word of words) {
      await page.locator('[data-answers] button').filter({ has: page.locator(`img[alt="${word.vi}"]`) }).click();
      await page.locator('[data-answer-action]').click();
    }
    assert.equal(await page.evaluate(() => window.fruitProgress.read().results.practice.score), 9);
    await page.locator('[data-practice-quiz]').click();
    for (const word of words) {
      await page.locator('[data-answers] button').getByText(word.vi, { exact: true }).click();
      await page.locator('[data-question-next]').click();
    }
    assert.equal(await page.evaluate(() => window.fruitProgress.read().results.quiz.score), 10);
    assert.equal(await page.locator('[data-feedback]').textContent(), 'Bé đã đạt 10 điểm!');
    await page.reload();
    assert.equal(await page.locator('[data-ring-count]').textContent(), '10/10');
    await page.locator('[data-fullscreen]').click();
    await page.waitForFunction(() => document.querySelector('.flashcard').classList.contains('is-expanded'));
    assert.equal(await page.locator('.flashcard').evaluate(card => card.classList.contains('is-expanded')), true);
    await page.keyboard.press('Escape');
    await page.goto(base + '/dashboard/english/');
    assert.equal(await page.locator('#topic-fruit .topic-card__count').textContent(), '10/10 từ');
    assert.equal(await page.locator('#topic-animals .topic-card__count').textContent(), '0/10 từ');
    await page.goto(base + '/dashboard/english/animals/');
    assert.equal(await page.locator('[data-word]').textContent(), 'Dog');
    assert.equal(await page.locator('[data-ring-count]').textContent(), '0/10');
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    console.log('PASS: 10 fruit illustrations, translations, examples, speech, responsive widths, completion, practice retry, quiz, fullscreen, persistence, island routing and isolated animal progress.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
