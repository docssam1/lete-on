#!/usr/bin/env node
/* ============================================================
   data/wordable.js 생성기 (2026-09-25) — 브라우저
   초등 회차의 적용 칸은 "그 주 교과 드릴을 같은 계산의 문장제로" 싣는다. 어떤 유형·레벨이
   실제로 문장제로 바뀌는지는 이름으로 짐작할 수 없어서(짐작했더니 17개가 틀렸다), 앱의
   generateProblem·applyWordProblems 로 레벨마다 12문항을 만들어 **전부** 문장이 된 것만 적는다.
   courses.js 가 이 표를 읽어 문장제 칸을 고른다. 생성기나 문장 틀을 바꾸면 다시 돌린다.
   check-session-roles --browser 가 표와 실제가 어긋나면 잡는다.
     node scripts/build-wordable.js
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  if(p.endsWith(path.join('app', 'exam.js'))) return res.end(fs.readFileSync(p, 'utf8').replace('window.NM_EXAM = NM_EXAM;',
    'window.NM_EXAM = NM_EXAM; window.__nmWord = { generateProblem, applyWordProblems };'));
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/ws.html?w=2026-W39&c=C4&n=check&k=1&cad=w2&auto=0`);
  await page.waitForFunction(() => window.__nmWord, null, { timeout:20000 });
  const ok = await page.evaluate(() => {
    const out = [];
    for(const t of Object.keys(NM_THREADS)){
      if(/^(MD|WP|NL)/.test(t)) continue;           /* 중등은 적용 스레드, 유아는 이야기 셈, WP 는 그 자체가 문장제 */
      for(const l of NM_THREADS[t].levels){
        const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('wordable' + t + l.id)); const ps = [];
        try { for(let i = 0; i < 12; i++) ps.push(__nmWord.generateProblem(t, l.id, rng));
          __nmWord.applyWordProblems(ps, 'all', NM_RNG.hashSeed('wa' + t + l.id)); } catch(e){ continue; }
        if(ps.every(p => p.word)) out.push(t + '@' + l.id);
      }
    }
    return out;
  });
  await browser.close(); server.close();
  const body = `/* 생성 파일 — 손으로 고치지 말 것. node scripts/build-wordable.js (2026-09-25 신설)
   앱의 문장제 변환으로 레벨마다 12문항을 만들어 전부 문장이 된 초등 유형·레벨. courses.js 가 초등 회차의
   적용 칸(그 주 교과 드릴 → 같은 계산의 문장제)을 고를 때 쓴다. ${ok.length}개. */
window.NM_WORDABLE = ${JSON.stringify(ok.reduce((o, k) => (o[k] = 1, o), {}))};
`;
  fs.writeFileSync(path.join(ROOT, 'data', 'wordable.js'), body);
  console.log(`문장제로 바뀌는 초등 유형·레벨 ${ok.length}개 → data/wordable.js`);
});
