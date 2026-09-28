const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:18940';
(async()=>{
const browser=await chromium.launch({args:['--no-sandbox']});
const cases=[['zh-TW','zh-Hant'],['zh-HK','zh-Hant'],['zh-MO','zh-Hant'],['zh-CN','zh-Hans'],['zh-SG','zh-Hans'],['zh-Hant-CN','zh-Hant'],['zh-Hans-TW','zh-Hans'],['en-US','en'],['fr-FR','en']];
for(const [locale,expected] of cases){
 const context=await browser.newContext({locale,viewport:{width:390,height:844},colorScheme:'dark'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('lang'),expected);assert.equal(await page.title(),'Wayne Club — Wayne Wei');assert.equal(await page.locator('.brand-logo').count(),2);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),locale+' overflow');
 assert.equal(await page.locator('.project:visible').count(),4);
 await page.locator('[data-filter=apps]').click();assert.equal(await page.locator('.project:visible').count(),2);
 await page.locator('.project:visible').first().click();assert(await page.locator('#project-sheet').evaluate(d=>d.open));assert.match(await page.locator('#project-github').getAttribute('href'),/PassBar/);
 await page.keyboard.press('Escape');assert(!(await page.locator('#project-sheet').evaluate(d=>d.open)));
 await page.locator('.disclosure').first().click();assert.equal(await page.locator('.disclosure').first().getAttribute('aria-expanded'),'true');assert(await page.locator('#achievements-0').isVisible());
 await page.locator('.settings-button').click();await page.locator('#language-select').selectOption('en');assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('.disclosure').first().innerText(),'Hide achievements');
 await page.locator('#appearance-select').selectOption('light');assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(250, 251, 254)');
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('html').getAttribute('data-appearance'),'light');
 await page.locator('.settings-button').click();await page.locator('#language-select').selectOption('auto');assert.equal(await page.locator('html').getAttribute('lang'),expected);assert.equal(await page.title(),'Wayne Club — Wayne Wei');assert.equal(await page.locator('.brand-logo').count(),2);
 await page.keyboard.press('Escape');assert.deepEqual(errors,[]);await context.close();console.log('PASS locale / interactions:',locale);
}
const context=await browser.newContext({locale:'zh-TW',viewport:{width:320,height:740},reducedMotion:'reduce',colorScheme:'light'});const page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('.reveal').first().evaluate(e=>getComputedStyle(e).opacity),'1');
assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(250, 251, 254)');
await page.evaluate(()=>{Object.defineProperty(navigator,'languages',{configurable:true,value:['de-DE','zh-HK','en-US']});dispatchEvent(new Event('languagechange'));});assert.equal(await page.locator('html').getAttribute('lang'),'zh-Hant');
await page.evaluate(()=>{Object.defineProperty(navigator,'languages',{configurable:true,value:['en-GB','zh-TW']});dispatchEvent(new Event('languagechange'));});assert.equal(await page.locator('html').getAttribute('lang'),'en');
await context.close();console.log('PASS 320px / reduced motion / system theme / language priority');
const blocked=await browser.newContext({locale:'zh-CN'});await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('disabled')}})});const bp=await blocked.newPage();await bp.goto(base,{waitUntil:'networkidle'});assert.equal(await bp.locator('html').getAttribute('lang'),'zh-Hans');await blocked.close();console.log('PASS blocked storage');
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
