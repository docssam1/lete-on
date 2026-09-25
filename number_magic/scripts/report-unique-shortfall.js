#!/usr/bin/env node
/* ============================================================
   주간 학습지 "중복 없는 새 문항을 확보하지 못했습니다" 원인 분류 보고 (2026-09-25, GPT 요청)
   check-weekly-sheets 가 잡은 실패마다, 앱의 실제 함수(generateProblem · problemKey ·
   rampLevelFor · rampCount)로 그 유형·레벨의 서로 다른 문항 수를 센다.
     pool-shortage  : 그 레벨 자체의 서로 다른 문항 < 한 회차가 요구하는 수
     (램프 회차는 앞 레벨 18 · 램프 레벨 6 기준으로 같은 pool-shortage 판정)
     engine-conflict: 레벨 용량은 충분 — 한 장 안의 예시·따라 풀기·문장제·다른 회차가
                      공유 제외 집합으로 나눠 쓰다 모자란 것으로 추정(엔진 감사 대상)
   출력: 표 + docs/unique-shortfall-2026-09-25.json (기계 판독용). 판정만 하고 아무것도 고치지 않는다.
     node scripts/report-unique-shortfall.js
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  /* 보고용 서버에서만 exam.js 에 읽기 전용 고리를 단다 — 저장소 파일은 건드리지 않는다 */
  if(p.endsWith(path.join('app', 'exam.js'))){
    return res.end(fs.readFileSync(p, 'utf8').replace('window.NM_EXAM = NM_EXAM;',
      'window.NM_EXAM = NM_EXAM; window.__nmUnique = { problemKey, generateProblem, rampLevelFor, rampCount };'));
  }
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const rows = [];
  for(let c = 0; c <= 47; c++) for(const k of [1, 2]){
    await page.goto(`http://localhost:${port}/ws.html?w=2026-W39&c=C${c}&n=check&k=${k}&cad=w2&auto=0`);
    let txt = '';
    for(let i = 0; i < 40; i++){ await page.waitForTimeout(250); txt = await page.evaluate(() => document.body.innerText); if(/문제가 생겼어요|정답지/.test(txt)) break; }
    const m = txt.match(/문제가 생겼어요:\s*([A-Z]+\d+) · Lv\.(\d+)/);
    if(!m) continue;
    const t = m[1], L = +m[2];
    const r = await page.evaluate(([t, L]) => {
      const { problemKey, generateProblem, rampLevelFor, rampCount } = window.__nmUnique;
      const cap = lv => { if(lv == null) return null; const rng = NM_RNG.mulberry32(20260925); const s = new Set();
        for(let i = 0; i < 6000; i++) s.add(problemKey(generateProblem(t, lv, rng))); return s.size; };
      const prevRamp = rampLevelFor(t, L - 1) === L;
      const ownRamp = rampLevelFor(t, L);
      return { capLevel:cap(L), capPrev:prevRamp ? cap(L - 1) : null, isRampOfPrev:prevRamp,
        rampNext:ownRamp, rampShareOf20:rampCount(t, L, 20), capRampNext:cap(ownRamp) };
    }, [t, L]);
    /* 한 회차(20문항) + 예시 1 + 따라 풀기 3 을 한 레벨에서 뽑는다고 보면 24가 기준이다. */
    const need = 24;
    /* 실제 램프 계약: 연습 기본14·램프6, 예시는 램프, 따라풀기는 기본2·램프1.
       따라서 기본 레벨 16, 램프 레벨 8이 필요하다. */
    const verdict = r.isRampOfPrev
      ? ((r.capPrev < 16 || r.capLevel < 8) ? 'pool-shortage' : 'engine-conflict')
      : (r.capLevel < need ? 'pool-shortage' : 'engine-conflict');
    rows.push(Object.assign({ course:'C' + c, k, thread:t, level:L, verdict }, r));
  }
  await browser.close(); server.close();
  const out = path.join(ROOT, 'docs', 'unique-shortfall-2026-09-25.json');
  fs.writeFileSync(out, JSON.stringify({ generated:'2026-09-25', week:'2026-W39', note:'capLevel = 6000회 생성 중 서로 다른 problemKey 수(하한). 판정 기준: 한 레벨에서 20+예시1+따라 풀기3=24', rows }, null, 1) + '\n');
  const by = rows.reduce((a, r) => (a[r.verdict] = (a[r.verdict] || 0) + 1, a), {});
  console.log(`실패 ${rows.length}장 — ` + Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' · '));
  rows.forEach(r => console.log(`  ${r.course} k${r.k} ${r.thread}@${r.level}  용량 ${r.capLevel}${r.isRampOfPrev ? ` (L${r.level - 1} 의 램프, L${r.level - 1} 용량 ${r.capPrev})` : ''}  → ${r.verdict}`));
  console.log('\n→ ' + path.relative(ROOT, out));
});
