#!/usr/bin/env node
/* ============================================================
   교과 드릴 레벨별 문항 수 상한 실측 (2026-09-25) — courses.js COUNT_CAP 의 근거
   과정 0~47 의 교과 칸(복습 제외)에 실리는 모든 유형·레벨을 앱의 실제 generateProblem·problemKey 로
   N회 생성해 서로 다른 문항 수를 센다. 상한 = (서로 다른 문항 수 − 예시·따라 풀기 4)를 6의 배수로 내림.
   36 미만인 것만 출력한다(36 은 회차 한 칸의 최대). 학습량 1.5배에서도 같은 문제를 다시 내지 않기 위한 값이다.
     node scripts/report-count-cap.js [--n=20000]
   출력은 courses.js COUNT_CAP 에 그대로 붙일 수 있는 줄이다. 판정만 하고 파일은 고치지 않는다.
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const N = +((process.argv.find(a => a.startsWith('--n=')) || '--n=20000').slice(4));
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  if(p.endsWith(path.join('app', 'exam.js'))) return res.end(fs.readFileSync(p, 'utf8').replace('window.NM_EXAM = NM_EXAM;',
    'window.NM_EXAM = NM_EXAM; window.__nmUnique = { problemKey, generateProblem };'));
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/ws.html?c=C1&auto=0`);
  await page.waitForFunction(() => window.__nmUnique && window.NM_COURSES, null, { timeout:20000 });
  const rows = await page.evaluate(N => {
    const keys = new Set();
    Object.values(NM_COURSES).forEach(c => (c.sessions || []).forEach(s => (s.school || []).forEach(d => { if(!d.review) keys.add(d.t + '@' + d.lv); })));
    const out = [];
    [...keys].sort().forEach(k => {
      const [t, l] = k.split('@'), rng = NM_RNG.mulberry32(20260925), seen = new Set();
      for(let i = 0; i < N; i++) seen.add(__nmUnique.problemKey(__nmUnique.generateProblem(t, +l, rng)));
      const cap = Math.floor((seen.size - 4) / 6) * 6;
      if(cap < 36) out.push({ k, distinct:seen.size, cap });
    });
    return { total:keys.size, out };
  }, N);
  await browser.close(); server.close();
  console.log(`교과 유형·레벨 ${rows.total}개 중 상한이 36 미만인 것 ${rows.out.length}개 (생성 ${N}회)`);
  rows.out.forEach(r => console.log(`  '${r.k}':${r.cap},   // 서로 다른 문항 ${r.distinct}`));
});
