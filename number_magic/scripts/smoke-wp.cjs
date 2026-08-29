#!/usr/bin/env node
/* ============================================================
   문장제(WP) 스모크 — 실제 브라우저로 끝까지 풀고, 인쇄물을 눈으로 본다
   ============================================================
   2026-08-29. 검사기 두 개(check-print·check-answerable)는 486개 유형을 훑느라
   한 유형을 얕게만 본다. WP는 **화면에도 인쇄에도 새 렌더 경로**(word·wordAsk·
   choices)를 쓰므로, 그 경로가 실제 브라우저에서 그려지는지 따로 본다.

     · 새 프로필 온보딩부터 시작(#obName → #obGo)
     · WP1·WP3의 여섯 레벨을 문제은행 UI에서 골라 끝까지 풀어 만점
     · 인쇄 학습지를 실제로 렌더해 본문·물음·보기·정답지가 다 있는지 확인
     · 데스크톱 1280 · 모바일 430 양쪽, pageerror 0건, 가로 넘침 0건
     · 스크린샷을 남긴다(--out 디렉터리)

   쓰는 법: node scripts/smoke-wp.cjs [--out DIR]
   ============================================================ */
'use strict';

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.NM_SMOKE_PORT || 8794;
const outIdx = process.argv.indexOf('--out');
const OUT = outIdx > 0 ? process.argv[outIdx + 1] : null;

function loadPlaywright() {
  for (const c of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(c); } catch (e) {}
  }
  console.error('playwright를 찾지 못했습니다.');
  process.exit(2);
}

function serve() {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
    py.on('error', reject);
    const t0 = Date.now();
    (function ping() {
      http.get(`http://localhost:${PORT}/drill.html`, r => { r.resume(); resolve(py); })
        .on('error', () => {
          if (Date.now() - t0 > 8000) return reject(new Error('정적 서버 기동 실패'));
          setTimeout(ping, 150);
        });
    })();
  });
}

const TARGETS = [['WP1', 1], ['WP1', 2], ['WP1', 3], ['WP3', 1], ['WP3', 2], ['WP3', 3]];
const fails = [];

(async () => {
  const { chromium } = loadPlaywright();
  const server = await serve();
  const browser = await chromium.launch({
    executablePath: process.env.NM_CHROMIUM || '/opt/pw-browsers/chromium'
  });

  for (const width of [1280, 430]) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 430 ? 860 : 900 } });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    await page.addInitScript(() => { window.print = () => {}; });

    /* 온보딩 — 새 프로필은 이름부터 받는다(index.html?enter=1로 인트로 영상을 건너뛴다) */
    await page.goto(`http://localhost:${PORT}/index.html?enter=1`, { waitUntil: 'networkidle' });
    if (await page.$('#obName')) {
      await page.fill('#obName', '문장제스모크');
      await page.click('#obGo');
      await page.waitForTimeout(600);
    }
    const onboarded = !(await page.$('#obName'));
    if (!onboarded) fails.push(`W${width} 온보딩을 통과하지 못함`);

    /* 문제은행에서 실제로 풀기 */
    await page.goto(`http://localhost:${PORT}/drill.html`, { waitUntil: 'networkidle' });
    for (const [th, lv] of TARGETS) {
      const r = await page.evaluate(async ({ th, lv }) => {
        const N = 10;
        let box = document.getElementById('__wp__');
        if (!box) { box = document.createElement('div'); box.id = '__wp__'; document.body.appendChild(box); }
        box.innerHTML = '';
        const SEED = 'wpsmoke';
        const probs = NM_EXAM.buildProblems(th, lv, N, NM_RNG.hashSeed(SEED));
        const seenParts = { word: 0, ask: 0, choices: 0 };
        return await new Promise(resolve => {
          let done = false;
          const t = setTimeout(() => { if (!done) { done = true; resolve({ err: '시간 초과' }); } }, 6000);
          NM_EXAM.runExam({ thread: th, level: lv, count: N, timer: 0, seed: SEED }, box, res => {
            if (done) return; done = true; clearTimeout(t);
            resolve({ score: res.score, total: res.total, seenParts });
          });
          (function step(i) {
            if (done || i >= N) return;
            if (box.querySelector('.nm-ex-word')) seenParts.word++;
            if (box.querySelector('.nm-ex-wordask')) seenParts.ask++;
            if (box.querySelector('.nm-ex-choices li')) seenParts.choices++;
            const inp = box.querySelector('#nm-ex-ans');
            const btn = box.querySelector('#nm-ex-submit');
            if (!inp || !btn) { done = true; clearTimeout(t); return resolve({ err: '입력칸 없음' }); }
            inp.value = String(probs[i].answer);
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            btn.click();
            setTimeout(() => step(i + 1), 0);
          })(0);
        });
      }, { th, lv });

      const tag = `W${width} ${th}L${lv}`;
      if (r.err) fails.push(`${tag} — ${r.err}`);
      else {
        if (r.score !== r.total) fails.push(`${tag} — 정답을 넣었는데 ${r.score}/${r.total}`);
        if (r.seenParts.word !== 10) fails.push(`${tag} — 화면에 문장(.nm-ex-word)이 ${r.seenParts.word}/10`);
        if (r.seenParts.ask !== 10) fails.push(`${tag} — 화면에 물음(.nm-ex-wordask)이 ${r.seenParts.ask}/10`);
        console.log(`  ✓ ${tag} 만점 ${r.score}/${r.total} · 문장 ${r.seenParts.word} · 물음 ${r.seenParts.ask} · 보기 ${r.seenParts.choices}`);
      }
    }
    await page.evaluate(() => { const b = document.getElementById('__wp__'); if (b) b.remove(); });

    /* 인쇄 — 본문·물음·보기·정답지가 다 나오는가, 가로로 넘치지 않는가 */
    for (const [th, lv] of [['WP1', 1], ['WP3', 3]]) {
      const r = await page.evaluate(async ({ th, lv }) => {
        document.querySelectorAll('.nm-print-sheet').forEach(e => e.remove());
        NM_EXAM.renderPrint({ thread: th, level: lv, count: 8, seed: 'wpsmoke' });
        await new Promise(r => setTimeout(r, 400));
        const sh = document.querySelector('.nm-print-sheet');
        const cards = [...sh.querySelectorAll('.nm-print-item')];
        return {
          cards: cards.length,
          words: sh.querySelectorAll('.nm-print-word').length,
          asks: sh.querySelectorAll('.nm-print-wordask').length,
          blanks: sh.querySelectorAll('.nm-print-word-blank').length,
          keys: sh.querySelectorAll('.nm-ak-item').length,
          dupAsk: sh.querySelectorAll('.nm-print-ask').length,
          overflow: cards.filter(c => c.scrollWidth > c.clientWidth + 2).length,
          empty: cards.filter(c => !c.innerText.trim()).length
        };
      }, { th, lv });
      const tag = `W${width} 인쇄 ${th}L${lv}`;
      if (r.cards !== 8) fails.push(`${tag} — 카드 ${r.cards}/8`);
      if (r.words !== 8) fails.push(`${tag} — 본문 ${r.words}/8`);
      if (r.asks !== 8) fails.push(`${tag} — 물음 ${r.asks}/8`);
      if (r.blanks !== 8) fails.push(`${tag} — 답 칸 ${r.blanks}/8`);
      if (r.keys !== 8) fails.push(`${tag} — 정답지 ${r.keys}/8`);
      if (r.dupAsk) fails.push(`${tag} — 질문 줄이 중복으로 ${r.dupAsk}개 (본문과 두 번 찍힘)`);
      if (r.overflow) fails.push(`${tag} — 칸 넘침 ${r.overflow}`);
      if (r.empty) fails.push(`${tag} — 빈 카드 ${r.empty}`);
      console.log(`  ✓ ${tag} 카드 ${r.cards} · 본문 ${r.words} · 물음 ${r.asks} · 보기칸 ${r.blanks} · 정답 ${r.keys} · 중복질문 ${r.dupAsk} · 넘침 ${r.overflow}`);
      if (OUT) {
        await page.emulateMedia({ media: 'print' });
        await page.screenshot({ path: path.join(OUT, `wp-${th}L${lv}-${width}.png`), fullPage: true });
        await page.emulateMedia({ media: 'screen' });
      }
    }

    /* 가로 넘침 — 화면 쪽 */
    const over = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      return [...document.querySelectorAll('body *')].filter(e => {
        if (e.closest('.nm-print-sheet')) return false;
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > w + 1 || r.left < -1);
      }).length;
    });
    if (over) fails.push(`W${width} 가로 넘침 요소 ${over}개`);

    if (pageErrors.length) fails.push(`W${width} pageerror ${pageErrors.length}건: ${[...new Set(pageErrors)][0]}`);
    console.log(`  W${width} pageerror ${pageErrors.length}건 · 가로 넘침 ${over}건`);
    await ctx.close();
  }

  await browser.close();
  server.kill();

  if (fails.length) {
    console.log(`\n[FAIL] ${fails.length}건`);
    fails.forEach(f => console.log('   ' + f));
    process.exit(1);
  }
  console.log('\n통과 — WP 스레드가 화면·인쇄 양쪽에서 성립한다.');
})().catch(e => { console.error(e); process.exit(2); });
