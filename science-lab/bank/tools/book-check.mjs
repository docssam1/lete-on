// 실험 교재 화면 검사: node science-lab/bank/tools/book-check.mjs s41-u01 [s41-u02 …]
// 전제: 저장소 루트에서 python3 -m http.server 8765 가 떠 있을 것.
// 검사: 학생용·강사용 A4 교재가 뜨는지, 쪽 수, 쪽마다 넘침(fitPages 뒤에도 본문이 칸을 넘는지), 수업 화면(가르치기·스스로) 렌더,
//       390px 가로 넘침, 페이지 오류. 결과 스크린샷은 --shots <폴더> 로.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const args = process.argv.slice(2), si = args.indexOf('--shots');
const shots = si >= 0 ? args.splice(si, 2)[1] : null; if (shots) mkdirSync(shots, { recursive: true });
const units = args;
const base = 'http://127.0.0.1:8765/science-lab/v2/index.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
let bad = 0;
for (const u of units) {
  const errs = [];
  const watch = (p) => { p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_CERT|Failed to load resource/.test(m.text())) errs.push(m.text()); }); };
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); watch(p);
  const out = [];
  for (const mode of ['student', 'teacher']) {
    await p.goto(`${base}#/${u}/lab-book/${mode}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const pages = [...document.querySelectorAll('.bk-page')];
      const over = pages.map((pg, i) => { const g = pg.querySelector('.bk-grid'), m = pg.querySelector('.bk-main'); if (!g || !m) return null;
        const avail = g.clientHeight - parseFloat(getComputedStyle(g).paddingTop); return m.scrollHeight > avail + 2 ? `${i + 1}쪽(+${Math.round(m.scrollHeight - avail)}px)` : null; }).filter(Boolean);
      return { n: pages.length, over, empty: !pages.length ? document.querySelector('main')?.textContent.slice(0, 60) : '' };
    });
    out.push(`${mode} ${r.n}쪽${r.over.length ? ` 넘침 ${r.over.join(',')}` : ''}${r.empty ? ` [${r.empty}]` : ''}`);
    if (!r.n || r.over.length) bad++;
    if (shots) { const pgs = await p.$$('.bk-page'); for (let i = 0; i < pgs.length; i++) await pgs[i].screenshot({ path: `${shots}/${u}-${mode}-${String(i + 1).padStart(2, '0')}.png` }); }
  }
  for (const c of ['teach', 'self']) {
    await p.goto(`${base}#/${u}/lab-class/${c}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
    const t = (await p.textContent('body')).replace(/\s+/g, ' ').trim();
    const ok = t.length > 80 && !/준비 중이에요/.test(t); out.push(`수업 ${c} ${ok ? 'OK' : 'FAIL'}`); if (!ok) bad++;
  }
  const m = await b.newPage({ viewport: { width: 390, height: 844 } }); watch(m);
  await m.goto(`${base}#/${u}/lab-book/student`, { waitUntil: 'networkidle' }); await m.waitForTimeout(800);
  const ox = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth); out.push(`390px 가로넘침 ${ox}px`); if (ox > 0) bad++;
  if (errs.length) bad++;
  console.log(`${u}: ${out.join(' · ')} · 오류 ${errs.length ? errs.join(' | ') : 0}`);
  await p.close(); await m.close();
}
await b.close();
process.exit(bad ? 1 : 0);
