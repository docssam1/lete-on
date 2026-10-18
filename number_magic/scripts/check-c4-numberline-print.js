#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('./lib/playwright');

const root = path.resolve(__dirname, '../..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); return res.end();
  }
  res.setHeader('Content-Type', ({ '.html':'text/html; charset=utf-8', '.js':'application/javascript',
    '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath:process.env.NM_CHROMIUM });
  try {
    const page = await browser.newPage({ viewport:{width:1280,height:1000} });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.route('**/*', route => {
      const u = new URL(route.request().url());
      return u.hostname === '127.0.0.1' ? route.continue() : route.abort();
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/number_magic/ws.html?w=2026-W42&c=C4`, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const sheet = document.querySelector('.nm-print-sheet');
      const lines = [...sheet.querySelectorAll('svg.nm-jump-nl')];
      const train = [...sheet.querySelectorAll('.nm-w2-item-train .nm-w2-train-step .nm-w2-tex[data-tex]')];
      const magic = [...sheet.querySelectorAll('.nm-w2-page-magic')];
      const numberlineFeature = sheet.querySelector('.nm-w2-editorial-study .nm-jump-nl');
      const pageOverflow = [...sheet.querySelectorAll('.nm-w2-page')].filter(p => p.scrollHeight > p.clientHeight + 2).length;
      const footerOverlap = magic.filter(p => {
        const last = p.querySelector('.nm-mn-open') || p.querySelector('.nm-mn-stage:last-child');
        const foot = p.querySelector('.nm-w2-foot');
        return last && foot && last.getBoundingClientRect().bottom > foot.getBoundingClientRect().top - 8;
      }).length;
      const trainOverlap = [...sheet.querySelectorAll('.nm-w2-page:has(.nm-w2-grid-train)')].filter(p => {
        const last = p.querySelector('.nm-w2-item-train:last-child');
        const end = p.querySelector('.nm-w2-retry') || p.querySelector('.nm-w2-foot');
        return last && end && last.getBoundingClientRect().bottom > end.getBoundingClientRect().top - 8;
      }).length;
      const teachingOverlap = [...sheet.querySelectorAll('.nm-w2-teaching-page')].filter(p => {
        const last = p.querySelector('.nm-w2-lesson-body > :last-child');
        const foot = p.querySelector('.nm-w2-foot');
        return last && foot && last.getBoundingClientRect().bottom > foot.getBoundingClientRect().top - 8;
      }).length;
      return {
        lineCount:lines.length,
        badLines:lines.filter(svg => svg.querySelectorAll('.nm-jump-nl-axis').length !== 1
          || svg.querySelectorAll('.nm-jump-nl-tick').length !== svg.querySelectorAll('.nm-jump-nl-hop').length + 1
          || [...svg.querySelectorAll('.nm-jump-nl-hop')].some(h => getComputedStyle(h).fill !== 'none')).length,
        oldTerm:sheet.textContent.includes('호의 수'),
        featureTicks:numberlineFeature ? [...numberlineFeature.querySelectorAll('text:not(.nm-jump-nl-step)')].map(x => x.textContent).join(',') : '',
        trainCount:train.length,
        trainUnderlines:train.filter(e => e.dataset.tex.includes('\\underline{')).length,
        trainBoxes:train.filter(e => e.dataset.tex.includes('\\boxed{') && !/\\[dt]?frac/.test(e.dataset.tex)).length,
        magicCount:magic.length,
        magicTextPx:magic[0] ? parseFloat(getComputedStyle(magic[0].querySelector('.nm-mn-desc')).fontSize) : 0,
        pageOverflow, footerOverlap, trainOverlap, teachingOverlap,
        questions:sheet.querySelectorAll('.nm-w2-item').length,
        keys:sheet.querySelectorAll('.nm-ak-item').length
      };
    });
    assert.ok(result.lineCount > 10, 'C4 must contain repeated number lines');
    assert.equal(result.badLines, 0, 'number lines need a visible axis, ticks and open curves');
    assert.equal(result.oldTerm, false);
    assert.equal(result.featureTicks, '0,2,4,6', 'the example must match this 2·5 times-table level');
    assert.ok(result.trainUnderlines > 0 && result.trainCount > 0);
    assert.equal(result.trainBoxes, 0, 'plain process blanks should sit on the formula baseline');
    assert.ok(result.magicTextPx >= 14);
    assert.equal(result.pageOverflow, 0);
    assert.equal(result.footerOverlap, 0);
    assert.equal(result.trainOverlap, 0);
    assert.equal(result.teachingOverlap, 0);
    assert.equal(result.questions, result.keys);
    assert.deepEqual(errors, []);
    console.log('PASS C4 number lines, age wording, writing lines and A4 page layout', result);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(err => { console.error(err); process.exitCode = 1; });
