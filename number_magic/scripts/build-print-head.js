#!/usr/bin/env node
/* ============================================================
   data/print-head.js 생성기 (2026-09-25) — 브라우저
   학습지 첫 장은 머리(개념·기억 고리·예시·따라 풀기) 아래에 문항을 싣는다. 몇 줄을 싣는지는
   classifyRoundLayout 의 판정별 고정표(firstRows)였는데, 머리 높이는 유형·레벨마다 크게 달라서
   머리가 긴 레벨은 남은 높이를 1fr 로 나눠 받은 줄이 내용보다 낮아져 **문항이 겹쳐 찍혔다**
   (main 기준 20문항에서 312개 레벨, A4 PDF 에서 C29 DV8 L1 첫 장이 눈으로 보일 만큼 겹침).
   인쇄 시트는 화면에서 display:none 이라 앱이 인쇄 순간에 잴 수 없다. 그래서 여기서 한 번 잰다:
   유형·레벨마다 첫 장의 문항 칸이 쓸 수 있는 높이·머리 높이·문항 한 줄이 실제로 필요한 높이(줄 간격 포함)·
   가득 찬 장의 쓸 수 있는 높이(mm)를
   나이 밴드 3(young·mid·senior = grade 1·3·6) × 언어 3(ko·en·zh) × 시드 2 에서 재고, 가장 좁은 값을 적는다.
   renderRoundPages 가 장마다 줄 수를 floor(쓸 수 있는 높이 ÷ 한 줄 높이)로 줄인다 — 가득 찬 장도 판정표의 줄 수가
   내용보다 많으면(ML2·ML8 등) 칸이 눌려 겹쳤다.
   개념 문장·예시·따라 풀기·인쇄 CSS 를 바꾸면 다시 돌린다.
     node scripts/build-print-head.js
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  /* 잴 때는 지금 표를 비운다 — 표가 첫 장 줄 수를 바꾸면 머리 높이 자체는 같아도 잴 대상이 달라진다 */
  if(p.endsWith(path.join('data', 'print-head.js'))) return res.end('window.NM_PRINT_HEAD = {};');
  fs.createReadStream(p).pipe(res);
});
const BANDS = [['young', '1'], ['mid', '3'], ['senior', '6']];
server.listen(0, async () => {
  const browser = await chromium.launch();
  const table = {};
  let qr = 0;
  for(const lang of ['ko', 'en', 'zh']){
    const page = await browser.newPage({ viewport:{ width:1100, height:1100 } });
    await page.route('**/*', r => /jsdelivr|supabase|google/.test(r.request().url()) ? r.abort() : r.continue());
    await page.addInitScript(l => { window.NM_NO_AUTOPRINT = true; localStorage.setItem('nm_state_v1', JSON.stringify({ lang:l })); }, lang);
    await page.goto(`http://localhost:${server.address().port}/drill.html`);
    await page.emulateMedia({ media:'print' });
    await page.addStyleTag({ content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}' });
    /* 유닛 데이터(data/units/*.js)를 다 싣고 잰다 — 앱·주간 학습지는 유닛의 개념 문장을 머리에 싣는데
       drill.html 은 유닛을 안 불러서, 없이 재면 머리가 최대 60mm 짧게 잡혔다(MX6 L1 senior: 173 → 실제 약 230mm,
       주간 학습지 C31 첫 장 넘침). 유닛이 있는 쪽이 머리가 길다 — 드릴 인쇄에는 안전한 쪽. */
    for(const f of fs.readdirSync(path.join(ROOT, 'data', 'units')).filter(f => /^[A-Za-z0-9-]+\.js$/.test(f)))
      await page.addScriptTag({ url:'data/units/' + f });
    const r = await page.evaluate(async BANDS => {
      const mm = px => px / (96 / 25.4), out = {};
      let qr = 0;
      for(const t of Object.keys(NM_THREADS)) for(const l of NM_THREADS[t].levels){
        const row = [];
        for(const [band, grade] of BANDS) for(const seed of ['head', 'head-b']){
          /* 40문항 — 첫 장이 마지막 장이 되지 않게(재도전 QR 없이 잰다; QR 은 따로 잰 높이를 뺀다).
             적게 만들면 첫 장이 마지막 장이 되어 QR 높이만큼 좁게 잰다(안전한 쪽). */
          /* 서로 다른 문항이 적은 레벨은 40문항을 못 만든다 — 24·18·12 로 내려 가며 잰다 */
          let made = false;
          for(const count of [40, 24, 18, 12]){
            try { NM_EXAM.renderPrint({ thread:t, level:l.id, count, seed, grade }); made = true; break; } catch(e){}
          }
          if(!made){ row.push(null); continue; }
          await new Promise(requestAnimationFrame);
          const pages = [...document.querySelectorAll('.nm-print-sheet .nm-w2-page')];
          const p1 = pages[0];
          const gridOf = p => p.querySelector('.nm-w2-grid'), footOf = p => p.querySelector('.nm-w2-foot');
          /* 문항 칸이 끝날 수 있는 가장 아래 = 종이 아래 끝 − 아래 여백 − 바닥 줄 높이.
             바닥 줄 위치를 그대로 쓰면, 넘친 장에서는 바닥 줄이 종이 밖으로 밀려나 있어 높이를 부풀려 잰다. */
          const floorOf = p => { const r = p.getBoundingClientRect(), f = footOf(p);
            return r.bottom - (parseFloat(getComputedStyle(p).paddingBottom) || 0) - (f ? f.getBoundingClientRect().height + 1 : 0); };
          if(!pages.some(p => gridOf(p) && p.querySelector('.nm-w2-item'))){ row.push(null); continue; }
          /* 첫 장 — 문항 칸이 없는 머리 전용 장(저학년 세로셈 등)이면 첫 장 값은 비운다 */
          let avail = null, head = null;
          if(gridOf(p1) && footOf(p1)){
            const top = p1.getBoundingClientRect().top, g = gridOf(p1).getBoundingClientRect().top;
            avail = Math.floor(mm(floorOf(p1) - g)); head = Math.ceil(mm(g - top));
          }
          /* 가득 찬 장 — 첫 장 뒤에서 머리(따라 풀기 등)가 가장 적은 장, 즉 문항 칸이 가장 긴 장 */
          let full = null;
          pages.slice(1).forEach(p => { const g = gridOf(p), f = footOf(p); if(!g || !f || !p.querySelector('.nm-w2-item')) return;
            const v = Math.floor(mm(floorOf(p) - g.getBoundingClientRect().top)); full = full == null ? v : Math.max(full, v); });
          /* 따라 풀기와 연습을 한 장에 실은 장(중등 개념 쪽 뒤)의 문항 칸 높이 */
          let guideAvail = null;
          const gp = pages.slice(1).find(p => p.querySelector('.nm-w2-guide') && gridOf(p) && p.querySelector('.nm-w2-item'));
          if(gp) guideAvail = Math.floor(mm(floorOf(gp) - gridOf(gp).getBoundingClientRect().top));
          const grid = pages.map(gridOf).find(Boolean);
          /* 문항 한 칸이 실제로 필요한 높이 — 줄을 내용 높이(max-content)로 풀어 잰다 */
          const st = document.createElement('style');
          st.textContent = '.nm-w2-grid{grid-template-rows:none!important;grid-auto-rows:max-content!important;flex:0 0 auto!important;height:auto!important}.nm-w2-item.nm-print-item{overflow:visible!important;min-height:0!important}';
          document.head.appendChild(st);
          await new Promise(requestAnimationFrame);
          let need = 0; document.querySelectorAll('.nm-print-sheet .nm-w2-grid .nm-w2-item').forEach(e => { need = Math.max(need, e.getBoundingClientRect().height); });
          const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
          st.remove();
          /* 창의 연산(Training Course) 모양 — 칸 높이가 풀이 줄 수로 달라 따로 잰다: [5]=가장 큰 칸, [6]=첫 장 문항 칸 높이 */
          let trainMax = null, trainFirst = null;
          try {
            NM_EXAM.renderPrint({ thread:t, level:l.id, count:12, seed, grade, creative:true });
            await new Promise(requestAnimationFrame);
            const tp = [...document.querySelectorAll('.nm-print-sheet .nm-w2-page')];
            const cells = document.querySelectorAll('.nm-print-sheet .nm-w2-item-train');
            if(cells.length){
              const g1 = tp[0] && gridOf(tp[0]);
              if(g1) trainFirst = Math.floor(mm(floorOf(tp[0]) - g1.getBoundingClientRect().top));
              /* 칸은 내용 높이로 풀어 잰다 — 1fr 로 늘어난 칸을 재면 장이 남긴 공간까지 칸 높이로 잡힌다 */
              document.head.appendChild(st);
              await new Promise(requestAnimationFrame);
              cells.forEach(e => { trainMax = Math.max(trainMax || 0, Math.ceil(mm(e.getBoundingClientRect().height))); });
              st.remove();
            }
          } catch(e){}
          row.push([avail, head, Math.ceil(mm(need + gap) * 10) / 10, full, guideAvail, trainMax, trainFirst]);
          if(!qr){
            NM_EXAM.renderPrint({ thread:t, level:l.id, count:4, seed:'qr', grade });
            await new Promise(requestAnimationFrame);
            const q = document.querySelector('.nm-print-sheet .nm-w2-retry');
            if(q) qr = Math.ceil(mm(q.getBoundingClientRect().height)) + 2;
          }
        }
        /* 시드 두 개 중 좁은 쪽 — 한 시드만 재면 다른 시드의 긴 문항이 칸을 넘었다(DV5 L4·MD39 L1) */
        const lo = (a, b) => a == null ? b : b == null ? a : Math.min(a, b), hi = (a, b) => a == null ? b : b == null ? a : Math.max(a, b);
        const merged = [0, 1, 2].map(i => { const a = row[i * 2], b = row[i * 2 + 1]; if(!a || !b) return a || b || null;
          return [lo(a[0], b[0]), hi(a[1], b[1]), hi(a[2], b[2]), lo(a[3], b[3]), lo(a[4], b[4]), hi(a[5], b[5]), lo(a[6], b[6])]; });
        if(merged.some(Boolean)) out[t + '@' + l.id] = merged;
      }
      return { out, qr };
    }, BANDS);
    await page.close();
    qr = Math.max(qr, r.qr);
    for(const [k, row] of Object.entries(r.out)){
      const cur = table[k] || (table[k] = [null, null, null]);
      row.forEach((v, i) => {
        if(!v) return;
        /* 언어 중 가장 좁은 쪽(쓸 수 있는 높이 최소, 머리 높이 최대) */
        const lo = (a, b) => a == null ? b : b == null ? a : Math.min(a, b), hi = (a, b) => a == null ? b : b == null ? a : Math.max(a, b);
        cur[i] = cur[i] ? [lo(cur[i][0], v[0]), hi(cur[i][1], v[1]), hi(cur[i][2], v[2]), lo(cur[i][3], v[3]), lo(cur[i][4], v[4]), hi(cur[i][5], v[5]), lo(cur[i][6], v[6])] : v.slice();
      });
    }
    console.log(`${lang}: ${Object.keys(r.out).length}개 레벨`);
  }
  await browser.close(); server.close();
  const n = Object.keys(table).length;
  const body = `/* 생성 파일 — 손으로 고치지 말 것. node scripts/build-print-head.js (2026-09-25 신설)
   학습지 첫 장에서 문항 칸이 쓸 수 있는 높이와 머리(개념·예시·따라 풀기) 높이, mm.
   레벨마다 [young, mid, senior] 밴드별 [첫 장 쓸 수 있는 높이, 머리 높이, 한 줄 필요 높이, 가득 찬 장 쓸 수 있는 높이, 따라 풀기+연습 장 높이,
   창의 연산 가장 큰 칸, 창의 연산 첫 장 문항 칸 높이]
   — ko·en·zh 중 가장 좁은 값. renderRoundPages 가 장마다 줄 수를 줄여 문항이 겹치지 않게 한다. ${n}개. */
window.NM_PRINT_HEAD = ${JSON.stringify(table)};
window.NM_PRINT_HEAD_QR = ${qr};
`;
  fs.writeFileSync(path.join(ROOT, 'data', 'print-head.js'), body);
  console.log(`첫 장 머리 높이 ${n}개 레벨 → data/print-head.js (재도전 QR ${qr}mm)`);
});
