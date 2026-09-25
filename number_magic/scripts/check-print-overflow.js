#!/usr/bin/env node
/* ============================================================
   인쇄 지면 겹침 검사 (2026-09-25) — 브라우저, 인쇄 매체·A4 폭(190mm)
   모든 유형·레벨을 12·18·24문항으로 인쇄해, 문항 칸이 내용보다 낮아 **글자가 겹치거나 잘리는** 곳과
   문항이 종이 아래로 나가는 곳을 찾는다. check-print 는 풀 수 있는지만 봐서 이것을 못 잡았다 —
   main 기준 20문항에서 312개 레벨의 첫 장이 겹쳐 찍혔다(A4 PDF 에서 C29 DV8 L1 로 확인).
   첫 장·가득 찬 장의 줄 수는 data/print-head.js(scripts/build-print-head.js)가 잰 높이로 정한다 —
   개념 문장·예시·인쇄 CSS 를 바꿨는데 여기서 실패하면 그 생성기를 다시 돌린다.
   레벨의 서로 다른 문항보다 많이 달라는 경우(COUNT_CAP 초과·풀 부족)는 앱도 그렇게 부르지 않으므로 건너뛴다.
     node scripts/check-print-overflow.js            # 전체(약 5분)
     node scripts/check-print-overflow.js ML2 MD83   # 지정 유형만
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const only = process.argv.slice(2).filter(a => /^[A-Z]+\d+$/.test(a));
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{ width:1100, height:1100 } });
  await page.route('**/*', r => /jsdelivr|supabase|google/.test(r.request().url()) ? r.abort() : r.continue());
  await page.addInitScript(() => { window.NM_NO_AUTOPRINT = true; });
  await page.goto(`http://localhost:${server.address().port}/drill.html`);
  await page.emulateMedia({ media:'print' });
  await page.addStyleTag({ content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}' });
  const r = await page.evaluate(async only => {
    const bad = [], skipped = []; let sets = 0;
    const cap = window.NM_COUNT_CAP || {};
    for(const t of Object.keys(NM_THREADS)){
      if(only.length && !only.includes(t)) continue;
      for(const l of NM_THREADS[t].levels) for(const count of [12, 18, 24]){
        const k = t + '@' + l.id;
        if(cap[k] && count > cap[k]){ skipped.push(k + '×' + count); continue; }
        try { NM_EXAM.renderPrint({ thread:t, level:l.id, count, seed:'ovf' + count }); }
        catch(e){
          /* 서로 다른 문항이 모자란 것은 이 검사의 대상이 아니다(무중복 검사가 본다) — 건너뛴 수로만 센다 */
          if(e && e.code === 'NM_UNIQUE_POOL_EXHAUSTED'){ skipped.push(k + '×' + count); continue; }
          bad.push(`${k}×${count}: ${String(e.message).slice(0, 60)}`); continue; }
        await new Promise(requestAnimationFrame);
        sets++;
        document.querySelectorAll('.nm-print-sheet .nm-w2-page').forEach((p, pi) => {
          const pb = p.getBoundingClientRect().bottom; let worst = 0, below = 0;
          p.querySelectorAll('.nm-w2-item').forEach(e => { worst = Math.max(worst, e.scrollHeight - e.clientHeight); below = Math.max(below, e.getBoundingClientRect().bottom - pb); });
          if(worst > 3 || below > 3) bad.push(`${k}×${count} ${pi + 1}쪽: 칸보다 ${Math.round(worst)}px 높음${below > 3 ? ` · 종이 밖 ${Math.round(below)}px` : ''}`);
        });
      }
    }
    return { sets, bad, skipped:skipped.length };
  }, only);
  await browser.close(); server.close();
  console.log(`인쇄 ${r.sets}벌(12·18·24문항) · 서로 다른 문항이 모자라 건너뜀 ${r.skipped}`);
  if(r.bad.length){ console.log(`\n✗ 실패 ${r.bad.length}건`); r.bad.slice(0, 60).forEach(b => console.log('  ' + b)); process.exit(1); }
  console.log('통과 — 모든 유형·레벨의 인쇄 지면에서 문항 칸이 겹치거나 종이 밖으로 나가지 않는다.');
});
