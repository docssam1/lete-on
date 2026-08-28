#!/usr/bin/env node
/* ============================================================
   학습지 인쇄 회귀 검사기 — 424개 유형·레벨 전수
   ============================================================
   2026-08-28. 인쇄 경로를 renderPrint 하나로 통합하면서 손으로 찾아낸 결함들이
   있다. 같은 것이 다시 새어 나가지 않도록 기계가 잡게 한다.

     [FAIL] 생성 실패 · 문항 수 불일치 · 정답 수 불일치
     [FAIL] 칸 넘침(문항이 칸 밖으로 나감)
     [FAIL] 질문 유실 — 빈칸 기호만 있고 관계식도 질문 줄도 없어 인쇄물로 못 푸는 문항
            (실제 사례: DV6 배수판별법이 `21□`만 찍혀 몇의 배수인지 알 수 없었다)
     [FAIL] 이중부호 — `(x - -9)`, `2 + -7 × -5` 같은 표기
            (실제 사례: MD29·MD6)
     [WARN] 정답 쏠림 — 한 레벨의 정답이 거의 한 값뿐
            (실제 사례: DV6 2·5·10 레벨의 정답이 400문항 전부 0이었다.
             0만 스무 번 쓰면 만점이라 학습지가 성립하지 않았다)

   쓰는 법:
     node scripts/check-print.js              # 전체
     node scripts/check-print.js NS2 DV6      # 지정 스레드만
   실패가 하나라도 있으면 exit 1.

   Playwright가 필요하다(브라우저에서 실제로 렌더해 봐야 칸 넘침을 알 수 있다).
   정적 서버를 스스로 띄우고 끝나면 내린다.
   ============================================================ */
'use strict';

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.NM_CHECK_PORT || 8791;
const ONLY = process.argv.slice(2).map(s => s.toUpperCase());

/* Playwright는 이 저장소에 없을 수도 있다(로컬 전역 설치를 씀) — 경로를 넓게 찾는다. */
function loadPlaywright(){
  const cands = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for(const c of cands){
    try { return require(c); } catch(e){}
  }
  console.error('playwright를 찾지 못했습니다. `npm i -D playwright` 후 다시 실행하세요.');
  process.exit(2);
}

function serve(){
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
    py.on('error', reject);
    const t0 = Date.now();
    (function ping(){
      http.get(`http://localhost:${PORT}/drill.html`, res => { res.resume(); resolve(py); })
        .on('error', () => {
          if(Date.now() - t0 > 8000) return reject(new Error('정적 서버 기동 실패'));
          setTimeout(ping, 150);
        });
    })();
  });
}

(async () => {
  const { chromium } = loadPlaywright();
  const server = await serve();
  const browser = await chromium.launch({
    executablePath: process.env.NM_CHROMIUM || '/opt/pw-browsers/chromium'
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  await page.addInitScript(() => { window.print = () => {}; });
  await page.goto(`http://localhost:${PORT}/drill.html`, { waitUntil: 'networkidle' });

  /* 검사 대상 목록 */
  const targets = await page.evaluate(only => {
    const out = [];
    const TH = window.NM_THREADS || {};
    for(const id of Object.keys(TH)){
      if(only.length && !only.includes(id)) continue;
      const th = TH[id];
      for(const lv of (th.levels || [])){
        out.push({ id, lv: lv.id, name: (th.name && th.name.ko) || id,
                   lvLabel: (lv.label && lv.label.ko) || '' });
      }
    }
    return out;
  }, ONLY);

  if(!targets.length){
    console.error('검사 대상이 없습니다.' + (ONLY.length ? ` (${ONLY.join(', ')})` : ''));
    await browser.close(); server.kill(); process.exit(2);
  }

  const fails = [], warns = [];
  let done = 0;

  for(const t of targets){
    const r = await page.evaluate(async ({ id, lv }) => {
      const COUNT = 12;
      const res = { gen: null, cards: 0, keys: 0, overflow: 0, dblNeg: [], noAsk: [],
                    bareNoSteps: [], impMixed: [], answers: [] };

      /* 1) 생성 — 정답 쏠림 검사를 위해 여러 시드로 넉넉히 */
      let probs;
      try { probs = NM_EXAM.buildProblems(id, lv, COUNT, 4242); }
      catch(e){ res.gen = 'throw: ' + e.message; return res; }
      if(!probs || probs.length !== COUNT){ res.gen = `문항 ${probs ? probs.length : 0}/${COUNT}`; return res; }

      for(let s = 0; s < 20; s++){
        let ps; try { ps = NM_EXAM.buildProblems(id, lv, 10, s * 613 + 11); } catch(e){ break; }
        ps.forEach(p => res.answers.push(JSON.stringify(p.answer)));
      }

      /* 2) 표기 검사 */
      probs.forEach(p => {
        const tx = String(p.tex || '');
        /* 이중부호 — `(x - -9)`, `2 + -7 × -5` */
        if(/-\s*-|\+\s*-\d/.test(tx)) res.dblNeg.push(tx.slice(0, 60));
        /* 대분수의 분수부가 진분수가 아닌 것 — `2 4/4` (실제 사례: FR3L2) */
        const re = /(\d+)\\?frac\{(\d+)\}\{(\d+)\}/g; let m;
        while((m = re.exec(tx))) if(+m[2] >= +m[3]) res.impMixed.push(tx.slice(0, 60));
        /* 맨 식인데 단계 풀이도 없는 것 — 답 형식을 알 수 없어 인쇄물로 못 푼다
           (실제 사례: FR4가 정답이 "통분 후 분자"뿐인데 인쇄물엔 분모가 없었다) */
        const hasBlank0 = /\\square|\\bigcirc/.test(tx);
        const hasRel0   = /=|\\equiv|\\Rightarrow|<|>|\\ge|\\le/.test(tx);
        const hasSteps0 = Array.isArray(p.steps) && p.steps.some(s => s && s.tex);
        if(!hasBlank0 && !hasRel0 && !hasSteps0 && !p.word && !p.base10 && !p.numline)
          res.bareNoSteps.push(tx.slice(0, 60));
      });

      /* 3) 인쇄 — 실제로 렌더해야 칸 넘침을 알 수 있다 */
      document.querySelectorAll('.nm-print-sheet').forEach(e => e.remove());
      NM_EXAM.renderPrint({ thread: id, level: lv, count: COUNT, seed: 'chk1' });
      await new Promise(r => setTimeout(r, 60));

      const sheet = document.querySelector('.nm-print-sheet');
      if(!sheet){ res.gen = '인쇄 시트 없음'; return res; }
      const cards = [...sheet.querySelectorAll('.nm-print-item')];
      res.cards = cards.length;
      res.keys = sheet.querySelectorAll('.nm-ak-item').length;

      cards.forEach((c, i) => {
        if(c.scrollWidth > c.clientWidth + 2) res.overflow++;
        /* 4) 인쇄물만 보고 풀 수 있는가 — 렌더 결과로 판정한다(데이터가 아니라).
              관계식이 없는 문항은 그림·질문 줄·단계 줄 중 하나는 있어야 한다.
              빈칸만 덜렁 있는 것(`21□`)도, 맨 식(`2/3 - 1/2`)도 마찬가지다 —
              후자는 답 형식(분자만? 기약분수?)을 알 길이 없다. */
        const p = probs[i]; if(!p) return;
        const tx = String(p.tex || '');
        const hasRel   = /=|\\equiv|\\Rightarrow|<|>|\\ge|\\le/.test(tx);
        if(hasRel) return;
        const hasVisual = !!c.querySelector('.nm-bond, .nm-b10, .nm-nl');
        const hasAsk    = !!c.querySelector('.nm-print-ask');
        const hasSteps  = !!c.querySelector('.nm-print-steps');
        const isWord    = !!c.querySelector('.nm-print-word-blank');
        if(!hasVisual && !hasAsk && !hasSteps && !isWord) res.noAsk.push(tx.slice(0, 60));
      });
      return res;
    }, { id: t.id, lv: t.lv });

    const tag = `${t.id}L${t.lv} ${t.name}/${t.lvLabel}`;
    if(r.gen)            fails.push(`${tag} — 생성/인쇄 실패: ${r.gen}`);
    else {
      if(r.cards !== 12) fails.push(`${tag} — 인쇄 문항 ${r.cards}/12`);
      if(r.keys !== 12)  fails.push(`${tag} — 정답 ${r.keys}/12`);
      if(r.overflow)     fails.push(`${tag} — 칸 넘침 ${r.overflow}건`);
      if(r.dblNeg.length) fails.push(`${tag} — 이중부호: ${r.dblNeg[0]}`);
      if(r.noAsk.length)  fails.push(`${tag} — 질문 유실(인쇄물로 풀 수 없음): ${r.noAsk[0]}`);
      if(r.impMixed.length) fails.push(`${tag} — 대분수 분수부가 진분수가 아님: ${r.impMixed[0]}`);
      if(r.bareNoSteps.length) fails.push(`${tag} — 맨 식인데 단계도 없음(답 형식 불명): ${r.bareNoSteps[0]}`);
      /* 정답 쏠림 — 한 값이 90% 넘으면 경고 */
      if(r.answers.length >= 50){
        const d = {}; r.answers.forEach(a => d[a] = (d[a] || 0) + 1);
        const top = Object.keys(d).sort((a, b) => d[b] - d[a])[0];
        const ratio = d[top] / r.answers.length;
        if(ratio > 0.9) warns.push(`${tag} — 정답 ${ratio * 100 | 0}%가 ${top} 하나 (찍어도 통과)`);
      }
    }
    if(++done % 40 === 0) process.stdout.write(`  … ${done}/${targets.length}\n`);
  }

  await browser.close();
  server.kill();

  console.log(`\n검사한 유형·레벨: ${targets.length}`);
  if(pageErrors.length){
    console.log(`\n[FAIL] 페이지 에러 ${pageErrors.length}건`);
    [...new Set(pageErrors)].slice(0, 5).forEach(e => console.log('   ' + e));
  }
  if(warns.length){
    console.log(`\n[WARN] ${warns.length}건`);
    warns.forEach(w => console.log('   ' + w));
  }
  if(fails.length){
    console.log(`\n[FAIL] ${fails.length}건`);
    fails.forEach(f => console.log('   ' + f));
    process.exit(1);
  }
  console.log('\n통과 — 인쇄 결함 없음.');
  if(pageErrors.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(2); });
