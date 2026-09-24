#!/usr/bin/env node
'use strict';

/* Real Chromium/A4 + 390 px smoke gate for the three MD13 division levels.
 * Reuse the repository's existing Playwright installation through NODE_PATH and
 * set NM_CHROMIUM when the bundled browser lives elsewhere.
 */
const assert = require('assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); return res.end();
  }
  const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'}[path.extname(file)] || 'application/octet-stream';
  res.setHeader('Content-Type', mime); fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch(process.env.NM_CHROMIUM ? {executablePath:process.env.NM_CHROMIUM} : {});
    const page = await browser.newPage({viewport:{width:1100,height:1100}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => !['GET','HEAD'].includes(route.request().method()) ? route.abort() : route.continue());
    await page.addInitScript(() => { window.NM_NO_AUTOPRINT = true; });
    const url = `http://127.0.0.1:${server.address().port}`;
    await page.goto(url + '/drill.html', {waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});

    for(const cfg of [{level:4,count:12},{level:5,count:24},{level:6,count:24}]) {
      const stats = await page.evaluate(async cfg => {
        NM_EXAM.renderPrint({thread:'MD13',level:cfg.level,count:cfg.count,seed:`md13-browser-${cfg.level}`});
        await document.fonts.ready; await new Promise(requestAnimationFrame);
        const sheet = document.querySelector('.nm-print-sheet');
        const over = [...sheet.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')]
          .filter(el => el.scrollWidth > el.clientWidth + 3 || el.scrollHeight > el.clientHeight + 3 || (el.closest('.nm-w2-page') && el.getBoundingClientRect().bottom > el.closest('.nm-w2-page').getBoundingClientRect().bottom + 3))
          .map(el => el.className);
        return {
          concept:sheet.querySelectorAll('[data-middle-concept="MD13"]').length,
          example:sheet.querySelectorAll('.nm-w2-example').length,
          guides:sheet.querySelectorAll('.nm-w2-guide-item').length,
          guideKeys:sheet.querySelectorAll('.nm-ak-guide-item').length,
          questions:sheet.querySelectorAll('.nm-w2-item').length,
          keys:sheet.querySelectorAll('.nm-ak-item').length,
          katexErrors:sheet.querySelectorAll('.katex-error').length,
          practicePages:[...sheet.querySelectorAll('.nm-w2-page')].map(el => el.querySelectorAll('.nm-w2-item').length).filter(Boolean),
          over
        };
      }, cfg);
      assert.equal(stats.concept, 1, `MD13 L${cfg.level}: concept panel`);
      assert.equal(stats.example, 1, `MD13 L${cfg.level}: worked example`);
      assert.equal(stats.guides, 3, `MD13 L${cfg.level}: guided problems`);
      assert.equal(stats.guideKeys, 3, `MD13 L${cfg.level}: guided answers`);
      assert.equal(stats.questions, cfg.count, `MD13 L${cfg.level}: practice count`);
      assert.equal(stats.keys, cfg.count, `MD13 L${cfg.level}: answer count`);
      assert.equal(stats.katexErrors, 0, `MD13 L${cfg.level}: KaTeX errors`);
      assert.deepEqual(stats.over, [], `MD13 L${cfg.level}: A4 overflow`);
      assert(stats.practicePages.slice(0,-1).every(n => n >= 6), `MD13 L${cfg.level}: fewer than 6 questions before final practice page`);
      console.log(`PASS MD13 L${cfg.level} A4: ${cfg.count} questions, ${stats.practicePages.join('+')} per practice pages.`);
    }

    await page.emulateMedia({media:'screen'});
    await page.setViewportSize({width:390,height:900});
    await page.goto(url + '/index.html?enter=1', {waitUntil:'networkidle'});
    await page.evaluate(() => {
      localStorage.setItem('nm_state_v1', JSON.stringify({lang:'ko',onboarded:true,name:'검수용',avatar:{kind:'boy'},cloudLinked:false,progress:{},account:{status:'active'}}));
      NM_EXAM.openPrintEditor([{thread:'MD13',level:6,count:24,seed:'md13-mobile'}], 'MD13 나눗셈 검수', {count:24});
    });
    await page.waitForSelector('#nm-pe-overlay [data-middle-concept="MD13"]');
    assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(), 24);
    assert.equal(await page.locator('#nm-pe-overlay .katex-error').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, '390 px horizontal overflow');
    assert.deepEqual(errors, [], 'browser page errors');
    console.log('PASS MD13 mobile preview: 390 px, 24 questions, concept/example/guided flow, no horizontal overflow.');
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
