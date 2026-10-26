#!/usr/bin/env node
'use strict';
/* 전 과정 주간 학습지를 글자본으로 뽑는다 (2026-10-26, 전체 학습지 검수).
   docs/worksheet-series-preview-20261024.html 이 ws.html 에 붙이는 값을 그대로 쓴다.
   - 초등(C0~C28): p=1&s=회차
   - 중등·고등(studyPlan): p=1&s=수업 시작 세션 + hp=1 (빼면 옛 세션 낱장이 나온다)
   - 선택 심화(M1E~M3E): c=기준 과정 + dv/dp/k/cad/amt (배달 계획)
   수식은 KaTeX 의 TeX 원문($...$)으로 바꿔 적는다.

   usage: node scripts/render-worksheet-text.js <출력 폴더> [과정 정규식] [--vary-week]
     --vary-week  회차마다 주차를 다르게(W43 + 회차-1) — 같은 주로 뽑으면 시드(주+과정+칸)가 같아
                  회차끼리 숫자가 똑같이 나온다. 실제 배달처럼 보려면 이 옵션을 쓴다.
   예: node scripts/render-worksheet-text.js /tmp/ws '^C(1|2|3)$' */
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('./lib/playwright');
const DP = require('../app/delivery-plan.js');
const ROOT = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const OUT = args[0];
if (!OUT) { console.error('usage: render-worksheet-text.js <out dir> [course regex] [--vary-week]'); process.exit(2); }
const only = args[1] && !args[1].startsWith('--') ? new RegExp(args[1]) : null;
const varyWeek = args.includes('--vary-week');
fs.mkdirSync(OUT, { recursive: true });
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((q, r) => {
  const f = path.resolve(ROOT, '.' + decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { r.writeHead(404); r.end(); return; }
  r.setHeader('content-type', mime[path.extname(f)] || 'application/octet-stream'); r.end(fs.readFileSync(f));
});
const isoWeek = d => { // ISO 8601 주차 — 해를 넘기면 2027-W01 로 이어진다
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
  return y + '-W' + String(w).padStart(2, '0');
};
const week = i => varyWeek ? isoWeek(new Date(Date.UTC(2026, 9, 19 + 7 * i))) : '2026-W43';
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true });
  const p0 = await browser.newPage();
  await p0.goto(base + '/number_magic/ws.html?c=C0&w=2026-W43&n=x&auto=0&p=1&s=1');
  await p0.waitForFunction(() => window.NM_WS_READY === true, null, { timeout: 90000 });
  const jobs = await p0.evaluate(() => {
    const label = v => typeof v === 'string' ? v : v && v.ko || '';
    const rows = c => c.studyPlan && c.studyPlan.lessons || c.sessions;
    const cs = Object.values(window.NM_COURSES).sort((a, b) => a.order - b.order).map(c => ({ ...c, id: 'C' + c.order }));
    const anchors = { 1: 'C31', 2: 'C34', 3: 'C37' };
    const ext = [1, 2, 3].map(g => ({ ...window.NM_MIDDLE_EXTENSION.course(g), anchor: anchors[g], id: 'M' + g + 'E' }));
    const out = [];
    for (const c of [...cs, ...ext]) rows(c).forEach((row, i) => out.push({
      id: c.id, title: label(c.title), r: i + 1, c: c.extensionGrade ? c.anchor : c.id,
      s: c.studyPlan ? row.startSession : i + 1, hp: !!c.studyPlan && !c.extensionGrade,
      ext: c.extensionGrade || 0, anchorLen: c.extensionGrade ? window.NM_COURSES[c.anchor].sessions.length : 0,
      test: !!row.test }));
    return out;
  });
  await p0.close();
  const todo = jobs.filter(j => !only || only.test(j.id));
  fs.writeFileSync(path.join(OUT, '_jobs.json'), JSON.stringify(todo));
  const urlOf = j => {
    const u = new URLSearchParams({ c: j.c, w: week(j.r - 1), n: 'x', auto: '0', p: '1', s: String(j.s) });
    if (j.hp) u.set('hp', '1');
    if (j.ext) {
      const plan = { courseKey: j.c, sessionIndex: j.anchorLen, startDate: '2026-10-19', speed: 1, amount: 1, cadence: 'w1', pace: 'p2',
        middleExtensions: { [j.ext]: '20261024-middle-extension1' }, extensionAnchor: { grade: j.ext, index: j.r - 1 } };
      for (const [k, v] of Object.entries({ dv: DP.VERSION, dp: DP.encode(plan), k: 1, cad: 'w1', amt: 1 })) u.set(k, v);
    }
    return base + '/number_magic/ws.html?' + u;
  };
  let k = 0, fail = 0;
  const worker = async () => {
    while (k < todo.length) {
      const j = todo[k++], name = j.id + '-r' + String(j.r).padStart(2, '0');
      const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
      try {
        await page.goto(urlOf(j));
        await page.waitForFunction(() => window.NM_WS_READY === true || window.NM_WS_READY === 'error', null, { timeout: 90000 });
        await page.waitForTimeout(500);
        const t = await page.evaluate(() => {
          const b = document.body.cloneNode(true);
          b.querySelectorAll('.katex').forEach(el => { const a = el.querySelector('annotation'); el.replaceWith(' $' + (a ? a.textContent : el.textContent) + '$ '); });
          b.querySelectorAll('script,style').forEach(e => e.remove());
          document.documentElement.appendChild(b); b.style.position = 'absolute';
          const text = b.innerText; b.remove();
          return { ready: window.NM_WS_READY, pages: document.querySelectorAll('.nm-w2-page').length, text };
        });
        if (t.ready !== true) fail++;
        fs.writeFileSync(path.join(OUT, name + '.txt'), '#' + JSON.stringify({ ...j, url: urlOf(j).replace(base, ''), ready: t.ready, pages: t.pages }) + '\n' + t.text);
      } catch (e) { fail++; fs.writeFileSync(path.join(OUT, name + '.err'), String(e)); }
      await page.close();
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  await browser.close(); server.close();
  console.log(`WORKSHEET_TEXT rounds=${todo.length} failed=${fail} out=${OUT}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
