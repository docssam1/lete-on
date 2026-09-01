#!/usr/bin/env node
'use strict';
/* 진단하기(나이별 배치 진단) 브라우저 스모크.
   사용법: node number_magic/scripts/smoke-placement.cjs [baseUrl]
   기본 http://127.0.0.1:8799/number_magic/index.html?enter=1 */

const path = require('path');
const { chromium } = require('playwright');

const BASE = process.argv[2] || process.env.BASE_URL ||
  'http://127.0.0.1:8799/number_magic/index.html?enter=1';
const OUT = process.env.SHOT_DIR || '/tmp/nm-shots';
const VIEWS = [
  { name: 'wide', viewport: { width: 1280, height: 900 } },
  { name: 'phone', viewport: { width: 430, height: 932 } }
];

const fail = [];
function check(cond, msg){ if(!cond) fail.push(msg); console.log((cond?'  ok   ':'  FAIL ')+msg); }

async function onboard(page, errors){
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#obName, #townCourseRoad, .nm-town', { timeout: 20000 });
  if (await page.$('#obName')){
    await page.fill('#obName', '진단이');
    await page.click('#obGo');
  }
  await page.waitForSelector('#townCourseRoad', { timeout: 30000 });
  check(true, 'onboarding → town reached');
}

/* 진단 첫 문항의 지문(스레드 이름 + 물음 + 식/위젯)을 문자열로 뽑는다. */
async function firstQuestion(page){
  await page.waitForSelector('.nm-dg-step', { timeout: 15000 });
  return page.evaluate(() => {
    const q = document.querySelector('.nm-dg-step');
    const b = document.querySelector('.nm-bubble');
    const e = document.querySelector('.nm-lab-expr');
    const w = document.querySelector('#dgWidget');
    return {
      step: q ? q.textContent.trim() : '',
      prompt: b ? b.textContent.trim() : '',
      body: (e ? e.textContent.trim() : '') || (w ? w.className + ':' + w.innerHTML.length : ''),
      widget: !!w
    };
  });
}

async function openDiag(page){
  if (await page.$('#dgBack')){ await page.click('#dgBack'); }
  await page.waitForSelector('#townCourseRoad', { timeout: 15000 });
  await page.click('#townCourseRoad');
  await page.waitForSelector('#crDiag', { timeout: 15000 });
  await page.click('#crDiag');
  await page.waitForSelector('.nm-dg-ages', { timeout: 15000 });
}

async function noOverflow(page, where){
  const over = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(over <= 1, `no horizontal overflow (${where}, ${over}px)`);
}

async function run(view){
  console.log(`\n===== ${view.name} ${view.viewport.width}x${view.viewport.height} =====`);
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  const ctx = await browser.newContext({ viewport: view.viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await onboard(page, errors);
  await openDiag(page);

  /* 나이 단계가 그려지는가 + 키보드로 닿는가 */
  const ages = await page.$$eval('.nm-dg-age', els => els.map(e => ({
    tag: e.tagName, age: e.dataset.age, entry: e.dataset.entry, txt: e.textContent.replace(/\s+/g,' ').trim()
  })));
  check(ages.length >= 4, `age step renders ${ages.length} options`);
  ages.forEach(a => console.log(`       · ${a.age} entry=${a.entry} — ${a.txt}`));
  check(ages.every(a => a.tag === 'BUTTON'), 'age options are real <button>s');
  const focusable = await page.evaluate(() => {
    const first = document.querySelector('.nm-dg-age');
    first.focus();
    return document.activeElement === first;
  });
  check(focusable, 'age option is keyboard-focusable');
  await noOverflow(page, 'age step');
  await page.screenshot({ path: path.join(OUT, `placement-age-${view.name}.png`), fullPage: true });

  /* 나이가 다르면 첫 문제가 실제로 달라지는가 */
  const seen = {};
  for (const a of ages){
    await page.click(`.nm-dg-age[data-age="${a.age}"]`);
    const q = await firstQuestion(page);
    seen[a.age] = q;
    console.log(`       ${a.age} → ${q.step} | ${q.prompt.slice(0,44)} | ${q.widget?'widget':'tex'} ${q.body.slice(0,40)}`);
    await noOverflow(page, 'question ' + a.age);
    await page.screenshot({ path: path.join(OUT, `placement-q-${a.age}-${view.name}.png`), fullPage: true });
    await openDiag(page);
  }
  const steps = Object.values(seen).map(q => q.step);
  const uniq = new Set(steps);
  check(uniq.size >= 3, `${uniq.size} distinct first questions across ${steps.length} ages (need ≥3)`);
  const bodies = new Set(Object.values(seen).map(q => q.prompt + '|' + q.body));
  check(bodies.size >= 3, `${bodies.size} distinct question bodies (need ≥3)`);
  check(seen.pre && seen.pre.widget, 'youngest age gets a 수의 나라 widget question, not 한 자리 덧셈');

  /* 건너뛰기가 여전히 맨 아래에서 시작하는가 */
  await page.click('#dgSkip');
  const skipQ = await firstQuestion(page);
  console.log(`       skip → ${skipQ.step}`);
  check(skipQ.step === seen.pre.step, '건너뛰기 starts at the bottom rung (same as youngest)');

  /* 끝까지 한 판 — 아무 답이나 넣어 결과까지 간다 */
  await openDiag(page);
  await page.click('.nm-dg-age[data-age="g2"]');
  let guard = 0, answered = 0;
  while (guard++ < 14){
    if (await page.$('.nm-dg-course')) break;
    if (await page.$('#dgWidget')){
      /* 위젯: 보기 버튼이 있으면 첫 보기, 없으면 제출 버튼 */
      const btn = await page.$('#dgWidget .nm-tc-choice')
               || await page.$('#dgWidget .nm-nb-done')
               || await page.$('#dgWidget .nm-key.ok')
               || await page.$('#dgWidget button:not([disabled])');
      if (btn){ await btn.click({ force: true }); answered++; }
    } else if (await page.$('#dgPad')){
      const keys = await page.$$('#dgPad .nm-key');
      if (keys[6]) await keys[6].click();
      const ok = await page.$('#dgPad .nm-key.ok');
      if (ok){ await ok.click(); answered++; }
    }
    await page.waitForTimeout(1000);
  }
  check(answered <= 6, `run stayed within the 6-question cap (${answered} answered)`);
  const done = await page.$('.nm-dg-course');
  check(!!done, 'a full run reaches a recommendation');
  if (done){
    const info = await page.evaluate(() => {
      const txt = document.querySelector('.nm-dg-course').textContent.trim();
      const key = 'C' + (txt.match(/(\d+)/) || [])[1];
      return { txt, key, valid: !!(window.NM_COURSES || {})[key],
               note: (document.querySelector('.nm-dg-agenote')||{}).textContent || '',
               free: !!document.querySelector('.nm-dg-free') };
    });
    console.log(`       result: ${info.txt} | key ${info.key} | agenote "${info.note.trim()}"`);
    check(info.valid, `recommended course key ${info.key} exists in NM_COURSES`);
    check(info.free, 'result still says the choice is free (no gating)');
    await noOverflow(page, 'result');
    await page.screenshot({ path: path.join(OUT, `placement-result-${view.name}.png`), fullPage: true });
  }

  check(errors.length === 0, `0 pageerror (${errors.length})`);
  errors.forEach(e => console.log('       ' + e));
  await browser.close();
}

(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  for (const v of VIEWS) await run(v);
  console.log(fail.length ? `\nFAILED ${fail.length}:\n - ` + fail.join('\n - ') : '\n모두 통과.');
  process.exit(fail.length ? 1 : 0);
})();
