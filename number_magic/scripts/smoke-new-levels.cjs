/* 신규 레벨 Playwright 스모크 — 1280px · 430px.
   ① index.html 새 프로필(온보딩) 진입 ② drill.html에서 신규 레벨을 실제 UI로
   골라 끝까지 풀기. pageerror·console error를 전 구간에서 모은다. */
'use strict';
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8799;
const OUT = process.env.SHOT_DIR || '/tmp/nm-shots';
require('fs').mkdirSync(OUT, { recursive: true });

function loadPW(){ for(const c of ['playwright','/opt/node22/lib/node_modules/playwright']){ try{return require(c);}catch(e){} } throw new Error('no playwright'); }
function serve(){ return new Promise((res, rej) => {
  const py = spawn('python3', ['-m','http.server',String(PORT)], { cwd: ROOT, stdio:'ignore' });
  const t0 = Date.now();
  (function ping(){ http.get(`http://localhost:${PORT}/drill.html`, r => { r.resume(); res(py); })
    .on('error', () => Date.now()-t0>8000 ? rej(new Error('server')) : setTimeout(ping,150)); })();
}); }

/* 이번에 추가한 유형·레벨 — drill.html TOPICS의 라벨로 고른다 */
const NEW = [
  { sec:'school', label:'연이은 덧셈 · 뺄셈 (세 수, 10까지)' },
  { sec:'school', label:'연이은 덧셈 · 뺄셈 (세 수, 20까지)' },
  { sec:'school', label:'연이은 덧셈 · 뺄셈 (네 수, 20까지)' },
  { sec:'school', label:'통분하기 (최소공배수)' },
  { sec:'school', label:'몫이 소수인 나눗셈 (자연수 ÷ 자연수)' },
  { sec:'school', label:'비례배분' },
  /* MX3는 '매직 계산법' 갈래라 Numbers of Magic 탭에 있다 */
  { sec:'magic',  label:'가장 간단한 자연수의 비' },
  { sec:'magic',  label:'비교하는 양 구하기' },
  { sec:'magic',  label:'기준량 구하기' },
];

(async () => {
  const { chromium } = loadPW();
  const server = await serve();
  const browser = await chromium.launch({ executablePath: process.env.NM_CHROMIUM || '/opt/pw-browsers/chromium' });
  const problems = [];
  const netErrs = [];
  let solvedTotal = 0;

  for (const vp of [{ w:1280, h:900, tag:'1280' }, { w:430, h:932, tag:'430' }]) {
    /* 매번 새 컨텍스트 = 새 프로필(localStorage 비어 있음) → 온보딩부터 */
    const ctx = await browser.newContext({ viewport:{ width:vp.w, height:vp.h } });
    const page = await ctx.newPage();
    /* pageerror(=자바스크립트 예외)만 실패로 본다. console의 리소스 로드 실패는
       이 샌드박스가 외부 네트워크(클라우드 동기화)를 막아 생기는 것이라 코드와 무관 —
       실패로 세지 않되 어떤 주소가 막혔는지는 남긴다. */
    page.on('pageerror', e => problems.push(`[${vp.tag}] pageerror: ${e.message}`));
    page.on('console', m => { if(m.type()==='error') netErrs.push(`[${vp.tag}] ${m.text()}`); });
    page.on('requestfailed', r => netErrs.push(`[${vp.tag}] ${r.failure() && r.failure().errorText} ${r.url().slice(0,110)}`));
    page.on('response', r => { if(r.status() >= 400) netErrs.push(`[${vp.tag}] HTTP ${r.status()} ${r.url().slice(0,110)}`); });

    /* ── ① 앱 온보딩 ── */
    /* ?enter=1 = 인트로 영상 건너뛰기(index.html 21행). 안 붙이면 온보딩 카드가
       전체화면 영상 뒤에 가려 클릭이 안 된다. 프로필은 여전히 비어 있어 온보딩부터다. */
    await page.goto(`http://localhost:${PORT}/index.html?enter=1`, { waitUntil:'networkidle' });
    await page.waitForSelector('#obName', { timeout: 10000 });
    await page.fill('#obName', '검사');
    await page.click('#obGo');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/app-${vp.tag}.png`, fullPage: false });

    /* ── ② drill.html에서 신규 레벨을 실제로 풀기 ── */
    for (const { sec, label } of NEW) {
      await page.goto(`http://localhost:${PORT}/drill.html`, { waitUntil:'networkidle' });
      if (sec !== 'school') { await page.click(`.dr-tab[data-sec="${sec}"]`); await page.waitForTimeout(250); }
      /* 서랍장에서 라벨로 주제 선택 */
      const btn = page.locator('.drawer-item', { hasText: label }).first();
      await btn.waitFor({ timeout: 8000 });
      await btn.click();
      await page.waitForTimeout(250);
      /* 이 화면이 낼 문항을 미리 만들어 두고(같은 seed) 그 정답을 그대로 입력한다 */
      const res = await page.evaluate(async () => {
        /* drill.html의 스크립트는 통째로 IIFE라 getConfig/state가 전역에 없다.
           대신 전역인 NM_EXAM.runExam을 한 겹 감싸 화면이 실제로 쓰는 cfg를 가로챈다 —
           그 cfg로 같은 문항을 다시 만들면 정답을 알 수 있다(seed가 같으므로). */
        let cfg = null;
        const orig = NM_EXAM.runExam;
        NM_EXAM.runExam = function (c, el, cb) { cfg = c; return orig.call(this, c, el, cb); };
        document.getElementById('dr-start-btn').click();
        await new Promise(r => setTimeout(r, 500));
        NM_EXAM.runExam = orig;
        if (!cfg) return { err: 'runExam이 불리지 않음(시작 버튼?)' };
        const probs = NM_EXAM.buildProblems(cfg.thread, cfg.level, cfg.count, NM_RNG.hashSeed(cfg.seed));

        const out = { thread: cfg.thread, level: cfg.level, asked: 0, first: null };
        for (let i = 0; i < probs.length; i++) {
          const inp = document.querySelector('#nm-ex-ans');
          const btn = document.querySelector('#nm-ex-submit');
          if (!inp || !btn) { out.err = `${i}번째에서 입력칸이 사라짐`; break; }
          const p = probs[i];
          const typed = Array.isArray(p.answer) ? p.answer.join(', ') : String(p.answer);
          if (i === 0) out.first = { tex: p.tex, typed };
          inp.value = typed;
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          if (inp.value !== typed) { out.err = `입력칸이 답을 못 담음(type=${inp.type}): "${typed}" → "${inp.value}"`; break; }
          out.asked++;
          btn.click();
          await new Promise(r => setTimeout(r, 40));
        }
        /* 결과 카드에 찍힌 점수 — 만점이라야 통과 */
        const el = document.querySelector('.nm-score-num');
        out.score = el ? el.textContent.trim() : null;
        return out;
      });
      if (res.err) problems.push(`[${vp.tag}] ${label} — ${res.err}`);
      if (!res.asked) problems.push(`[${vp.tag}] ${label} — 문항이 뜨지 않음`);
      const want = `${res.asked} / ${res.asked}`;
      if (res.score && res.score !== want)
        problems.push(`[${vp.tag}] ${label} — 정답을 넣었는데 ${res.score}`);
      if (!res.score) problems.push(`[${vp.tag}] ${label} — 결과 점수가 안 나옴`);
      solvedTotal += res.asked;
      console.log(`  [${vp.tag}] ${(res.thread + 'L' + res.level).padEnd(7)} ${label.padEnd(34)} ${res.score}` +
                  (res.first ? `  예: ${res.first.tex} → ${res.first.typed}` : ''));
      if (label === NEW[3].label || label === NEW[6].label)
        await page.screenshot({ path: `${OUT}/drill-${vp.tag}-${res.thread}L${res.level}.png` });
    }
    await ctx.close();
  }

  await browser.close(); server.kill();
  console.log(`\n제출한 문항 합계: ${solvedTotal}`);
  if (netErrs.length) { console.log(`\n[참고] 네트워크 리소스 실패(코드 무관) ${netErrs.length}건 — 서로 다른 주소:`); [...new Set(netErrs)].forEach(e => console.log('  ' + e)); }
  if (problems.length) { console.log(`\n[FAIL] ${problems.length}건`); [...new Set(problems)].forEach(p => console.log('  ' + p)); process.exit(1); }
  console.log('통과 — pageerror 0, 신규 레벨 전부 화면에서 풀림.');
})().catch(e => { console.error(e); process.exit(2); });
