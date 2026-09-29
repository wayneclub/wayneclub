const {chromium}=require('playwright');const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:18940';
(async()=>{const browser=await chromium.launch({args:['--no-sandbox']});
for(const [locale,expected] of [['zh-TW','zh-Hant'],['zh-HK','zh-Hant'],['zh-MO','zh-Hant'],['zh-CN','zh-Hans'],['zh-SG','zh-Hans'],['zh-Hant-CN','zh-Hant'],['zh-Hans-TW','zh-Hans'],['en-US','en'],['fr-FR','en']]){
 const page=await browser.newPage({locale,viewport:{width:390,height:844},colorScheme:'light'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('lang'),expected);await page.locator('[data-consent=denied]').click();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('.brand-logo').count(),2);assert.equal(await page.locator('.project:visible').count(),8);
 await page.locator('[data-filter=play]').click();assert.equal(await page.locator('.project:visible').count(),2);await page.locator('.project:visible .project-open').first().click();assert.match(await page.locator('#project-github').getAttribute('href'),/PassBar/);await page.keyboard.press('Escape');
 await page.locator('[data-filter=all]').click();
 await page.locator('.disclosure').first().click();assert.equal(await page.locator('.disclosure').first().getAttribute('aria-expanded'),'true');
 await page.locator('.language-button').click();await page.locator('[data-language=en]').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('.disclosure').first().innerText(),'Hide achievements');
 assert.equal(await page.locator('.language-links a').first().innerText(),'English');assert.equal(await page.locator('.language-links a').nth(1).innerText(),'繁體中文');
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(new URL(page.url()).pathname,'/en/');assert.deepEqual(errors,[]);await page.close();console.log('PASS locale, filters, sheets, disclosures, language persistence',locale);
}
// Interactive miniatures
const page=await browser.newPage({locale:'en-US',viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base,{waitUntil:'networkidle'});await page.locator('[data-consent=denied]').click();
await page.locator('[data-track=ja]').click();assert.equal(await page.locator('.sub-primary').getAttribute('lang'),'ja');
await page.locator('.player-demo .switch').click();assert(await page.locator('.sub-secondary').isHidden());
await page.locator('.dict-suggest button',{hasText:'latency'}).click();assert.equal(await page.locator('.dict-word').innerText(),'latency');
await page.locator('#dict-input').fill('unknownword');await page.locator('#dict-input').press('Enter');assert.match(await page.locator('.dict-def').innerText(),/pocket edition/);
await page.locator('.dict-demo .switch').click();assert(await page.locator('.dict-demo').evaluate(e=>e.classList.contains('night')));
await page.locator('#convert-input').fill('网络数据库支持简体');assert.equal(await page.locator('.convert-output').innerText(),'網路資料庫支援簡體');
await page.locator('.quiz-options [data-correct=false]').first().click();assert.match(await page.locator('.quiz-feedback').innerText(),/Not quite/);
await page.locator('.quiz-options [data-correct=true]').click();assert.match(await page.locator('.quiz-feedback').innerText(),/Correct/);
for(const letter of 'LENS')await page.locator('.word-blocks button:not([disabled])',{hasText:letter}).first().click();
assert(await page.locator('.word-demo').evaluate(e=>e.classList.contains('win')));
await page.locator('[data-aspect=atmosphere]').first().click();assert.equal(await page.locator('.review').getAttribute('data-active'),'atmosphere');
await page.locator('.fetch-meta').click();assert.equal(await page.locator('.shelf').getAttribute('data-filled'),'true');
const before=await page.locator('.lens').evaluate(e=>e.style.getPropertyValue('--lx'));await page.locator('.lens').focus();await page.keyboard.press('ArrowLeft');assert.notEqual(await page.locator('.lens').evaluate(e=>e.style.getPropertyValue('--lx')),before);
await page.locator('.play-toggle').click();assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');assert.equal(await page.locator('.play-toggle').getAttribute('aria-label'),'Play motion');
await page.locator('.appearance-button').click();assert.equal(await page.locator('html').getAttribute('data-appearance'),'light');await page.locator('.appearance-button').click();assert.equal(await page.locator('html').getAttribute('data-appearance'),'dark');
await page.locator('.chapter[href="#experience"]').click();await page.waitForTimeout(900);assert.equal(await page.locator('.nav-links a[href="#experience"]').getAttribute('aria-current'),'location');
assert.deepEqual(errors,[]);await page.close();console.log('PASS player, dictionary, converter, quiz, word game, aspects, posters, lens keyboard, motion, appearance, chapters');
const c=await browser.newContext({locale:'zh-TW',viewport:{width:320,height:800},reducedMotion:'reduce'});await c.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('disabled')}})});const p=await c.newPage();await p.goto(base,{waitUntil:'networkidle'});assert.equal(await p.locator('html').getAttribute('lang'),'zh-Hant');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await p.locator('.reveal').first().evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await p.locator('html').getAttribute('data-motion'),'paused');await c.close();console.log('PASS blocked storage, reduced motion starts paused, 320px');await browser.close()})().catch(e=>{console.error(e);process.exit(1)});
