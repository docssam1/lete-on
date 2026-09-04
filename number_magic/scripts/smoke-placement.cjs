#!/usr/bin/env node
'use strict';
/* 진단하기 v2(나이별 배치 진단 + 세부 스킬 체크) + 시작점 고르기 브라우저 스모크.
   사용법: node number_magic/scripts/smoke-placement.cjs [baseUrl]
   기본 http://127.0.0.1:8799/number_magic/index.html?enter=1
   서버는 이 스크립트가 띄우지 않는다 — 먼저
     cd /home/user/lete-on && nohup python3 -m http.server 8799 >/dev/null 2>&1 &
   로 띄워 둘 것. */

const path = require('path');
function loadPlaywright(){
  for (const c of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(c); } catch (e) {}
  }
  console.error('playwright를 찾지 못했습니다.');
  process.exit(2);
}
const { chromium } = loadPlaywright();

const BASE = process.argv[2] || process.env.BASE_URL ||
  'http://127.0.0.1:8799/number_magic/index.html?enter=1';
const OUT = process.env.SHOT_DIR || '/tmp/nm-shots';
const CHROMIUM = process.env.PW_CHROMIUM || process.env.NM_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const VIEWS = [
  { name: 'wide', viewport: { width: 1280, height: 900 } },
  { name: 'phone', viewport: { width: 430, height: 932 } }
];

const fail = [];
function check(cond, msg){ if(!cond) fail.push(msg); console.log((cond?'  ok   ':'  FAIL ')+msg); }

async function onboard(page){
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.nm-av-card, #obName, #ttGame, #townCourseRoad, .nm-town', { timeout: 20000 });
  if (await page.$('.nm-av-card')){
    await page.click('.nm-av-card');
    await page.click('#obAvNext');
    await page.waitForSelector('#obName', { timeout: 10000 });
  }
  if (await page.$('#obName')){
    await page.fill('#obName', '진단이');
    await page.click('#obGo');
  }
  const tt = await page.waitForSelector('#ttGame, #townCourseRoad', { timeout: 30000 });
  if (await page.$('#ttGame')) await page.click('#ttGame');
  await page.waitForSelector('#townCourseRoad', { timeout: 30000 });
  for (let i = 0; i < 4; i++){ const c = await page.$('#nmUnlockOverlayClose, .nm-attend-card'); if(!c) break; await c.click().catch(()=>{}); await page.waitForTimeout(200); }
  check(true, 'onboarding → town reached');
}

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

/* 한 문제를 "일부러 틀리게" 답한다 — 숫자패드면 순수 숫자 키(보통 '1') 하나 찍고
   제출, 위젯(수의 나라 4칸에서만 등장)이면 처음 눌리는 상호작용을 그대로
   누른다(우연히 맞을 수 있지만, 전체 실행에서 오답 위주로 흘러가면 세부 진단·
   ❌ 칩이 충분히 나온다는 걸로 충분하다). */
async function answerWrong(page){
  if (await page.$('#dgWidget')){
    const btn = await page.$('#dgWidget .nm-tc-choice')
             || await page.$('#dgWidget .nm-nb-done')
             || await page.$('#dgWidget .nm-key.ok')
             || await page.$('#dgWidget button:not([disabled])');
    if (btn){ await btn.click({ force: true }); return true; }
    return false;
  }
  if (await page.$('#dgPad')){
    const keys = await page.$$('#dgPad .nm-key');
    let digitKey = null;
    for (const k of keys){
      const cls = (await k.getAttribute('class')) || '';
      if (!/\bok\b|\bdel\b|\bdot\b|\bneg\b|\bcomma\b/.test(cls)){ digitKey = k; break; }
    }
    if (digitKey) await digitKey.click();
    const ok = await page.$('#dgPad .nm-key.ok');
    if (ok){ await ok.click(); return true; }
  }
  return false;
}
async function isFineStage(page){ return !!(await page.$('.nm-dg-finesub')); }
async function atResult(page){ return !!(await page.$('.nm-dg-course')); }

async function run(view){
  console.log(`\n===== ${view.name} ${view.viewport.width}x${view.viewport.height} =====`);
  const browser = await chromium.launch({ executablePath: CHROMIUM });
  const ctx = await browser.newContext({ viewport: view.viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await onboard(page);
  await openDiag(page);

  /* 나이 단계 — 9개(수의 나라~공통수학1)로 늘었는가, 키보드로 닿는가 */
  const ages = await page.$$eval('.nm-dg-age', els => els.map(e => ({
    tag: e.tagName, age: e.dataset.age, entry: e.dataset.entry, txt: e.textContent.replace(/\s+/g,' ').trim()
  })));
  check(ages.length >= 8, `age step renders ${ages.length} options (need ≥8, now covers pre~hi)`);
  ages.forEach(a => console.log(`       · ${a.age} entry=${a.entry} — ${a.txt}`));
  check(ages.every(a => a.tag === 'BUTTON'), 'age options are real <button>s');
  const focusable = await page.evaluate(() => {
    const first = document.querySelector('.nm-dg-age');
    first.focus();
    return document.activeElement === first;
  });
  check(focusable, 'age option is keyboard-focusable');
  check(!!(await page.$('#dgSelfPick')), '"진단 없이 직접 고를래요" self-pick button present on age step');
  await noOverflow(page, 'age step');
  await page.screenshot({ path: path.join(OUT, `diag-age-${view.name}.png`), fullPage: true });

  /* 나이가 다르면 첫 문제가 실제로 달라지는가(대표로 4개만 표본) */
  const sample = ages.filter((a,i) => ['pre','g1','g2','hi'].includes(a.age) || i % 3 === 0).slice(0,5);
  const seen = {};
  for (const a of sample){
    await page.click(`.nm-dg-age[data-age="${a.age}"]`);
    const q = await firstQuestion(page);
    seen[a.age] = q;
    console.log(`       ${a.age} → ${q.step} | ${q.prompt.slice(0,40)} | ${q.widget?'widget':'tex'}`);
    await openDiag(page);
  }
  const uniqSteps = new Set(Object.values(seen).map(q => q.step));
  check(uniqSteps.size >= 3, `${uniqSteps.size} distinct first questions across ${Object.keys(seen).length} sampled ages (need ≥3)`);

  /* 건너뛰기가 여전히 맨 아래에서 시작하는가 */
  await page.click('.nm-dg-age[data-age="pre"]');
  const preQ = await firstQuestion(page);
  await openDiag(page);
  await page.click('#dgSkip');
  const skipQ = await firstQuestion(page);
  check(skipQ.step === preQ.step, '건너뛰기 starts at the bottom rung (same as youngest)');

  /* ── 끝까지 한 판: g2, 전부 "일부러 틀리게" → 세부 진단 → 결과까지 ── */
  await openDiag(page);
  await page.click('.nm-dg-age[data-age="g2"]');
  let guard = 0, bracketQ = 0, fineQ = 0;
  let shotBracket = false, shotFine = false, sawFineHeader = false;
  while (guard++ < 30){
    if (await atResult(page)) break;
    const fine = await isFineStage(page);
    if (fine) sawFineHeader = true;
    if (!shotBracket && !fine && await page.$('.nm-dg-step')){
      await page.screenshot({ path: path.join(OUT, `diag-bracket-q-${view.name}.png`), fullPage: true });
      shotBracket = true;
    }
    if (!shotFine && fine){
      await page.screenshot({ path: path.join(OUT, `diag-fine-q-${view.name}.png`), fullPage: true });
      shotFine = true;
    }
    const answered = await answerWrong(page);
    if (!answered) break;
    if (fine) fineQ++; else bracketQ++;
    await page.waitForTimeout(950);
  }
  check(sawFineHeader, 'fine-stage header (세부 진단 / Skill check) appeared during the run');
  check(bracketQ <= 9, `bracketing stayed within its 9-question cap (${bracketQ} asked)`);
  check(fineQ <= 8, `fine stage stayed within its 8-question cap (${fineQ} asked)`);
  const reachedResult = await atResult(page);
  check(reachedResult, 'a full run reaches a recommendation');

  let resultKey = null;
  if (reachedResult){
    const info = await page.evaluate(() => {
      const txt = document.querySelector('.nm-dg-course').textContent.trim();
      const key = 'C' + (txt.match(/(\d+)/) || [])[1];
      return {
        txt, key, valid: !!(window.NM_COURSES || {})[key],
        free: !!document.querySelector('.nm-dg-free'),
        weakChips: document.querySelectorAll('.nm-dg-skchip.weak').length,
        anyChips: document.querySelectorAll('.nm-dg-skchip').length,
        hasSkillList: !!document.querySelector('.nm-dg-skills')
      };
    });
    resultKey = info.key;
    console.log(`       result: ${info.txt} | key ${info.key} | skill chips ${info.anyChips} (weak ${info.weakChips})`);
    check(info.valid, `recommended course key ${info.key} exists in NM_COURSES`);
    check(info.free, 'result still says the choice is free (no gating)');
    check(info.hasSkillList, 'result shows a skill list (.nm-dg-skills)');
    check(info.weakChips > 0, `result shows at least one ❌ (needs-practice) chip from all-wrong answers (${info.weakChips})`);
    await noOverflow(page, 'result');
    await page.screenshot({ path: path.join(OUT, `diag-result-${view.name}.png`), fullPage: true });

    /* 로드맵 칩 — "연습 필요"가 붙는가 */
    await page.click('#dgGoRoad');
    await page.waitForSelector('.nm-cr-wrap', { timeout: 15000 });
    const chip = await page.evaluate(() => {
      const el = document.querySelector('.nm-cr-diagchip');
      return el ? el.textContent.trim() : '';
    });
    console.log(`       roadmap chip: ${chip}`);
    check(/연습 필요|needs practice|需要练习/.test(chip), 'roadmap chip shows "연습 필요" after an all-wrong run');
  }

  /* ── 시작점 고르기 ── */
  check(!!(await page.$('#crPick')), 'course road header has the 🎯 pick-your-start button');
  await page.click('#crPick');
  await page.waitForSelector('.nm-sp-tier', { timeout: 15000 });
  await noOverflow(page, 'startpick');
  await page.screenshot({ path: path.join(OUT, `diag-startpick-${view.name}.png`), fullPage: true });

  const tiers = await page.$$eval('.nm-sp-tier', els => els.map(e => ({
    open: e.open, cards: e.querySelectorAll('.nm-sp-card').length
  })));
  check(tiers.length >= 5, `self-pick renders ${tiers.length} tier sections`);
  check(tiers.some(t => t.open), 'at least one tier is open by default');

  /* level2 안에서 시작 가능한 과정 하나를 고른다(과정 11~16) */
  await page.evaluate(() => {
    const details = Array.from(document.querySelectorAll('.nm-sp-tier'));
    details.forEach(d => { d.open = true; });
  });
  const pickKey = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nm-sp-go'));
    const target = btns.find(b => { const n = parseInt(b.dataset.c.replace('C',''),10); return n>=11 && n<=16; });
    return target ? target.dataset.c : null;
  });
  check(!!pickKey, `found a level2 course card to pick (got ${pickKey})`);
  if (pickKey){
    await page.click(`.nm-sp-go[data-c="${pickKey}"]`);
    await page.waitForSelector('.nm-cr-wrap', { timeout: 15000 });
    const after = await page.evaluate((key) => {
      const chip = document.querySelector('.nm-cr-diagchip');
      const node = document.querySelector(`.nm-cr-node[data-c="${key}"]`);
      let centered = null;
      if (node){
        const r = node.getBoundingClientRect();
        const mid = r.top + r.height/2;
        centered = mid > 0 && mid < window.innerHeight; // 뷰포트 안에 들어와 있는가(스크롤 포커스 근사 확인)
      }
      return { chip: chip ? chip.textContent.trim() : '', hasNode: !!node, centered };
    }, pickKey);
    console.log(`       after pick: ${after.chip}`);
    check(/내가 고른 시작점|My chosen start|我选的起点/.test(after.chip), 'roadmap chip reads "내가 고른 시작점" after self-pick');
    check(after.hasNode, `picked course node ${pickKey} renders on the road`);
    check(after.centered !== false, `picked course node ${pickKey} scrolled into view`);
    await noOverflow(page, 'after self-pick focus');
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
