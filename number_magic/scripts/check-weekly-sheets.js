#!/usr/bin/env node
/* ============================================================
   주간 학습지 전 과정 인쇄 검사 (2026-09-25) — 브라우저
   ws.html 을 과정 0~47 × 첫째·둘째 장(k=1,2)으로 실제로 열어, 학습지가 끝까지 만들어지는지 본다.
   2026-09-24 배포부터 "같은 문항을 다시 뽑지 않고, 모자라면 실패" 규칙이 들어가
   96장 중 21장이 "중복 없는 새 문항을 확보하지 못했습니다"로 통째로 안 나왔다. 단위 검사는
   유형 하나씩만 보므로 이것을 못 잡는다 — 한 장 안에서 예시·따라 풀기·문장제·심화가 같은
   유형을 나눠 쓰기 때문이다.
     node scripts/check-weekly-sheets.js            # 전체(약 2~4분)
     node scripts/check-weekly-sheets.js C24 C29     # 지정 과정만
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const only = process.argv.slice(2).filter(a => /^C\d+$/.test(a));
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const courses = only.length ? only : Array.from({ length:48 }, (_, i) => 'C' + i);
  const bad = []; let ok = 0;
  for(const c of courses) for(const k of [1, 2]){
    await page.goto(`http://localhost:${port}/ws.html?w=2026-W39&c=${c}&n=check&k=${k}&cad=w2&auto=0`);
    let txt = '';
    for(let i = 0; i < 40; i++){ await page.waitForTimeout(250); txt = await page.evaluate(() => document.body.innerText); if(/문제가 생겼어요|정답지/.test(txt)) break; }
    const m = txt.match(/문제가 생겼어요:([^\n]*)/);
    if(m) bad.push(`${c} k${k}: ${m[1].trim()}`);
    else if(!/정답지/.test(txt)) bad.push(`${c} k${k}: 10초 안에 학습지가 완성되지 않음`);
    else ok++;
  }
  await browser.close(); server.close();
  console.log(`주간 학습지 ${ok + bad.length}장 중 ${ok}장 정상`);
  if(bad.length){ console.log(`\n✗ 실패 ${bad.length}장`); bad.forEach(b => console.log('  ' + b)); process.exit(1); }
  console.log('통과 — 모든 과정의 주간 학습지가 끝까지 만들어진다.');
});
