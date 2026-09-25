#!/usr/bin/env node
/* ============================================================
   주간 학습지 전 과정 인쇄 검사 (2026-09-25) — 브라우저
   ws.html 을 과정 0~47 × 첫째·둘째 장(k=1,2)으로 실제로 열어, 학습지가 끝까지 만들어지는지와
   인쇄(A4 폭)에서 칸·장이 넘치지 않는지 본다(2026-09-25 넘침 추가).
   2026-09-24 배포부터 "같은 문항을 다시 뽑지 않고, 모자라면 실패" 규칙이 들어가
   96장 중 21장이 "중복 없는 새 문항을 확보하지 못했습니다"로 통째로 안 나왔다. 단위 검사는
   유형 하나씩만 보므로 이것을 못 잡는다 — 한 장 안에서 예시·따라 풀기·문장제·심화가 같은
   유형을 나눠 쓰기 때문이다.
     node scripts/check-weekly-sheets.js            # 전체(약 2~4분)
     node scripts/check-weekly-sheets.js C24 C29     # 지정 과정만
     node scripts/check-weekly-sheets.js --amt=1.5   # 학습량 배수(0.7·0.85·1·1.25·1.5)로 — 바꾼 문항 수도 중복 없이 채워지는지
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const only = process.argv.slice(2).filter(a => /^C\d+$/.test(a));
const amtArg = (process.argv.find(a => a.startsWith('--amt=')) || '').slice(6);
const amtQ = amtArg ? '&amt=' + encodeURIComponent(amtArg) : '';
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
  /* WS_DETAIL=1 이면 넘친 쪽의 종류(그리드 판정·쪽 클래스)를 함께 적는다 */
  await page.addInitScript(d => { window.__nmWsDetail = d; }, !!process.env.WS_DETAIL);
  for(const c of courses) for(const k of [1, 2]){
    await page.goto(`http://localhost:${port}/ws.html?w=2026-W39&c=${c}&n=check&k=${k}&cad=w2&auto=0${amtQ}`);
    let txt = '';
    for(let i = 0; i < 40; i++){ await page.waitForTimeout(250); txt = await page.evaluate(() => document.body.innerText); if(/문제가 생겼어요|정답지/.test(txt)) break; }
    const m = txt.match(/문제가 생겼어요:([^\n]*)/);
    if(m) bad.push(`${c} k${k}: ${m[1].trim()}`);
    else if(!/정답지/.test(txt)) bad.push(`${c} k${k}: 10초 안에 학습지가 완성되지 않음`);
    else {
      /* 지면 넘침(2026-09-25) — 인쇄 매체·A4 폭에서 칸이 내용보다 낮거나 장이 종이보다 길면 실패.
         한 유형씩 보는 check-print-overflow 는 주간 봉투의 묶음(장 전체 글씨 밴드·창의 연산 띠·재도전 QR)을 못 본다. */
      await page.emulateMedia({ media:'print' });
      const tag = await page.addStyleTag({ content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}' });
      await page.waitForTimeout(150);
      const over = await page.evaluate(() => {
        const all = [...document.querySelectorAll('.nm-print-sheet .nm-w2-page')], o = [];
        all.forEach((p, i) => {
          let worst = p.scrollHeight - p.clientHeight;
          p.querySelectorAll('.nm-w2-item').forEach(e => { worst = Math.max(worst, e.scrollHeight - e.clientHeight); });
          if(worst > 3) o.push(`${i + 1}쪽 +${Math.round(worst)}px${window.__nmWsDetail ? ' [' + (p.className.replace('nm-w2-page', '').trim() || (p.querySelector('.nm-w2-grid') ? 'grid-' + p.querySelector('.nm-w2-grid').className.split('nm-w2-grid-')[1] : '? ' + p.innerText.replace(/\s+/g, ' ').slice(0, 50))) + ']' : ''}`);
        });
        return o;
      });
      await tag.evaluate(e => e.remove()); await page.emulateMedia({ media:'screen' });
      if(over.length) bad.push(`${c} k${k}: 지면 넘침 ${over.slice(0, 4).join(', ')}${over.length > 4 ? ` 외 ${over.length - 4}` : ''}`);
      else ok++;
    }
  }
  await browser.close(); server.close();
  console.log(`주간 학습지 ${ok + bad.length}장 중 ${ok}장 정상${amtArg ? ' (학습량 ' + amtArg + '배)' : ''}`);
  if(bad.length){ console.log(`\n✗ 실패 ${bad.length}장`); bad.forEach(b => console.log('  ' + b)); process.exit(1); }
  console.log('통과 — 모든 과정의 주간 학습지가 끝까지 만들어진다.');
});
