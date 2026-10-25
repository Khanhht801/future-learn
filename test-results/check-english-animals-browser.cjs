const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4175';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: {width:1586,height:992}, reducedMotion:'reduce' });
  const page = await context.newPage();
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)missing.push(r.url())});
  const url=base+'/dashboard/english/animals/';
  await page.goto(url);
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('[data-animal-image]').evaluate(img=>img.decode());
  assert.equal(await page.locator('.lesson-progress, [data-count], progress').count(),0);
  assert.equal(await page.locator('.word-tile').count(),10);
  assert.equal(await page.locator('.word-dot').count(),10);
  assert.equal(await page.locator('[data-example] strong').textContent(),'dog');
  assert.equal((await page.locator('[data-next]').innerText()).trim(),'Tiếp theo');
  assert.equal(await page.locator('[data-mode="practice"]').isDisabled(),true);
  assert.equal(await page.locator('[data-lock]:visible').count(),6);
  assert.match(await page.locator('[data-reward]').innerText(),/\+20 sao/);
  const align=await page.locator('.speaker').evaluate(button=>{
    const outer=button.getBoundingClientRect(),inner=button.querySelector('svg').getBoundingClientRect();
    return {x:Math.abs(outer.x+outer.width/2-inner.x-inner.width/2),y:Math.abs(outer.y+outer.height/2-inner.y-inner.height/2)};
  });
  assert.ok(align.x<1&&align.y<1,JSON.stringify(align));
  await page.screenshot({path:path.join(__dirname,'english-animals-desktop.png'),fullPage:true});
  for(const width of [1280,820,390,320]) {
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'overflow at '+width);
    if(width===390||width===820)await page.screenshot({path:path.join(__dirname,'english-animals-'+(width===390?'mobile':'tablet')+'.png'),fullPage:true});
  }
  await page.setViewportSize({width:1586,height:992});
  await page.locator('.word-tile').nth(5).click();
  assert.equal(await page.locator('[data-ring-count]').textContent(),'0/10');
  await page.locator('.word-dot').nth(0).click();
  await page.evaluate(()=>{
    window.__spoken=[];
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:function(text) { this.text=text; },configurable:true});
    Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{lang:'en-US'}]},speak(u){window.__spoken.push({text:u.text,lang:u.lang})}},configurable:true});
  });
  await page.locator('[data-speak]').click();
  assert.deepEqual(await page.evaluate(()=>window.__spoken),[{text:'Dog',lang:'en-US'}]);
  for(let i=0;i<9;i++) {
    await page.locator('[data-next]').click();
    assert.equal(await page.locator('[data-example] strong').textContent(),['cat','bird','fish','rabbit','lion','elephant','monkey','tiger','duck'][i]);
  }
  assert.equal(await page.locator('[data-ring-count]').textContent(),'9/10');
  assert.equal(await page.locator('[data-mode="practice"]').isDisabled(),true);
  await page.locator('[data-next]').click();
  assert.equal(await page.locator('[data-ring-count]').textContent(),'10/10');
  assert.equal(await page.locator('[data-mode="practice"]').isDisabled(),false);
  assert.equal(await page.locator('[data-lock]:visible').count(),0);
  assert.match(await page.locator('[data-reward]').innerText(),/đã nhận/);
  await page.locator('[data-mode="learn"]').click();
  await page.reload();
  assert.equal(await page.locator('[data-ring-count]').textContent(),'10/10');
  assert.equal(await page.locator('[data-lock]:visible').count(),0);
  await page.goto(base+'/dashboard/english/');
  assert.equal(await page.locator('#topic-animals .topic-card__count').textContent(),'10/10 từ');
  await page.locator('#topic-animals button').click();
  assert.equal(page.url(),url);
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('PASS: desktop/tablet/mobile/320px, 10 WebP assets, word highlights, speaker alignment/call, locked/unlocked controls, progress persistence and island integration.');
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
