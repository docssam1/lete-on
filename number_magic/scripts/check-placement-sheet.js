#!/usr/bin/env node
'use strict';
/* 학습 시작점 확인 시험지(placement-sheet.html) 검사 — 2026-10-04
 *   온라인 고정 20문항 진단(data/placement-plan.js)과 같은 문항을 종이용으로 그린 것이라, 다음을 본다.
 *     · 81개 시작 범위(유아 기초 8 + C1~C73) × ko/en/zh 모두 20문항이 나온다
 *     · 인쇄 매체·A4 폭에서 쪽 안이 넘치지 않는다(문항 칸·보호자 정답표 포함)
 *     · 지원하지 않는 표상(?), KaTeX 오류, undefined/NaN 글자가 없다
 *     · 정답표 쪽이 마지막에 있고 문항 번호와 정답이 20개다
 *   쓰는 법: node scripts/check-placement-sheet.js [--quick]   (--quick: 대표 8범위 × ko 만)
 *   브라우저 검사라 Playwright 가 필요하다(scripts/lib/playwright.js). 없으면 "미실행"으로 끝난다(통과 아님). */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.NM_CHECK_PORT_SHEET || 8814;
const QUICK = process.argv.includes('--quick');
const { chromium } = require('./lib/playwright.js');
const { browserArgs } = require('./lib/nm-onboard.js');

function serve(){
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
    py.on('error', reject);
    const t0 = Date.now();
    (function ping(){
      http.get(`http://localhost:${PORT}/placement-sheet.html`, r => { r.resume(); resolve(py); })
        .on('error', () => { if(Date.now() - t0 > 8000) return reject(new Error('정적 서버 기동 실패')); setTimeout(ping, 150); });
    })();
  });
}
(async () => {
  const py = await serve();
  const browser = await chromium.launch(browserArgs());
  const page = await browser.newPage({ viewport: { width: 900, height: 1250 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const bad = []; let n = 0;
  try {
    await page.goto(`http://localhost:${PORT}/placement-sheet.html?b=f-count5&seed=chk&l=ko`);
    await page.waitForFunction(() => window.NM_WS_READY, null, { timeout: 30000 });
    const ids = await page.evaluate(() => NM_PLACEMENT_PLAN.stages().map(s => s.id));
    if(ids.length < 81) bad.push('시작 범위가 81개보다 적다: ' + ids.length);
    const pick = QUICK ? ['f-count5', 'f-ten10', 'c1', 'c3', 'c12', 'c20', 'c40', 'c73'].filter(x => ids.includes(x)) : ids;
    for(const lang of QUICK ? ['ko'] : ['ko', 'en', 'zh']) for(const id of pick){
      await page.goto(`http://localhost:${PORT}/placement-sheet.html?b=${id}&seed=chk&l=${lang}`);
      await page.waitForFunction(() => window.NM_WS_READY, null, { timeout: 30000 }).catch(() => {});
      await page.emulateMedia({ media: 'print' });
      const tag = await page.addStyleTag({ content: 'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}' });
      const r = await page.evaluate(() => {
        const pages = [...document.querySelectorAll('.nm-print-sheet .nm-w2-page')], over = [];
        pages.forEach((p, i) => { let w = p.scrollHeight - p.clientHeight; p.querySelectorAll('.pl-q,.pl-key').forEach(e => { w = Math.max(w, e.scrollHeight - e.clientHeight); }); if(w > 3) over.push((i + 1) + '쪽 +' + Math.round(w) + 'px'); });
        const text = document.querySelector('.nm-print-sheet') ? document.querySelector('.nm-print-sheet').innerText : '';
        const last = pages[pages.length - 1];
        return { q: document.querySelectorAll('.pl-q').length, over,
          unsupported: !!document.querySelector('.pl-unsupported'), katexErr: document.querySelectorAll('.katex-error').length,
          untex: [...document.querySelectorAll('[data-tex]')].filter(e => !e.querySelector('.katex')).length,
          garbage: /NaN|\[object|(^|\n)\s*undefined\s*(\n|$)|null\s*null/.test(text)   /* 'undefined' 단어는 수학 설명문(예: 'undefined when m=n')에 정상으로 나온다 */, keyLast: !!(last && last.classList.contains('pl-keypage')),
          keyRows: last ? last.querySelectorAll('.pl-key tbody tr').length : 0 };
      });
      n++;
      const problems = [];
      if(r.q !== 20) problems.push('문항 ' + r.q + '개');
      if(r.over.length) problems.push('넘침 ' + r.over.join(','));
      if(r.unsupported) problems.push('지원하지 않는 표상');
      if(r.katexErr || r.untex) problems.push('수식 오류 ' + (r.katexErr + r.untex));
      if(r.garbage) problems.push('깨진 글자');
      if(!r.keyLast || r.keyRows !== 20) problems.push('정답표 쪽 이상 rows=' + r.keyRows);
      if(problems.length) bad.push(`${lang} ${id}: ${problems.join(' · ')}`);
      await tag.evaluate(e => e.remove()); await page.emulateMedia({ media: 'screen' });
    }
  } finally { await browser.close(); py.kill(); }
  if(errs.length) bad.push('페이지 오류 ' + errs.slice(0, 2).join(' | '));
  console.log(`시험지 ${n}장 검사${QUICK ? '(quick)' : ''}`);
  if(bad.length){ console.log('✗ 실패 ' + bad.length + '건'); bad.slice(0, 20).forEach(x => console.log('  ' + x)); process.exit(1); }
  console.log('통과 — 모든 시작 범위의 시험지가 20문항·A4 안·정답표까지 만들어진다.');
})().catch(e => { console.error(e); process.exit(1); });
