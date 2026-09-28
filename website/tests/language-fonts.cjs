const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:18940';
(async () => {
  const browser = await chromium.launch({args:['--no-sandbox']});
  for (const width of [1440,390,320]) {
    const page = await browser.newPage({viewport:{width,height:900},locale:'zh-TW'});
    const errors = [], externalFonts = [], failedFonts = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => {if (/fonts.googleapis|fonts.gstatic/.test(r.url())) externalFonts.push(r.url());});
    page.on('response', r => {if(r.url().includes('.woff2') && r.status()!==200) failedFonts.push(r.url());});
    await page.goto(base, {waitUntil:'networkidle'});
    await page.locator('[data-consent=denied]').click();
    assert.equal(await page.locator('.glass-object').count(),0);
    for (const [lang,code,font] of [['en','EN','Inter Variable'],['zh-Hans','简','Noto Sans SC Variable'],['zh-Hant','繁','Noto Sans TC Variable']]) {
      await page.locator('.language-button').focus();
      await page.keyboard.press('Enter');
      await page.locator(`[data-language="${lang}"]`).click();
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.equal(await page.locator('.language-code').innerText(),code);
      assert(await page.locator('.language-button').evaluate(e=>e===document.activeElement));
      assert(await page.evaluate(f=>[...document.fonts].some(x=>x.family.replaceAll('"','')===f && x.status==='loaded'),font),font+' loaded');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('.language-code').innerText(),'繁');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.deepEqual(errors,[]);assert.deepEqual(externalFonts,[]);assert.deepEqual(failedFonts,[]);
    console.log('PASS language menu, persisted choice, local fonts, reflow',width);
    await page.screenshot({path:'/home/ubuntu/wayne-type-'+width+'.png'});
    await page.close();
  }
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
