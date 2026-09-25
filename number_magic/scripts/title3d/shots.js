#!/usr/bin/env node
/* 3D 타이틀 확인용 — 스크린샷 + 클릭/키보드/오류 검사.
   node scripts/title3d/shots.js [--out=DIR]   (기본 OS 임시/title3d) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const { chromium } = require('../lib/playwright');
const APP = path.resolve(__dirname, '../..'), ROOT = path.resolve(APP, '..');
const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(os.tmpdir(), 'title3d');
const only = process.argv.find(a => a.startsWith('--only='));
fs.mkdirSync(OUT, { recursive:true });
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type':TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
const cases = [
  { name:'desk-ko', w:1280, h:800, lang:'ko' },
  { name:'phone-ko', w:390, h:844, lang:'ko', mobile:true },
  { name:'desk-en', w:1280, h:800, lang:'en' },
  { name:'phone-en', w:390, h:844, lang:'en', mobile:true },
  { name:'phone-zh', w:390, h:844, lang:'zh', mobile:true },
  { name:'tab-land', w:1024, h:640, lang:'ko' },
].filter(c => !only || only.slice(7).split(',').includes(c.name));
const IDS = ['continue', 'diag', 'game', 'sheet', 'road', 'story', 'dex', 'hist', 'magazine'];
server.listen(0, async () => {
  const browser = await chromium.launch({ args:['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const bad = [];
  for(const c of cases){
    const ctx = await browser.newContext({ viewport:{ width:c.w, height:c.h }, deviceScaleFactor:1, hasTouch:!!c.mobile });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource|fonts\.g/.test(m.text())) errs.push(m.text()); });
    await page.goto(`http://localhost:${server.address().port}/number_magic/scripts/title3d/test.html?lang=${c.lang}`);
    try { await page.waitForFunction(() => window.__ready, null, { timeout:90000 }); } catch(e){ bad.push(c.name + ': 시간 초과'); await ctx.close(); continue; }
    const rd = await page.evaluate(() => window.__ready);
    if(rd !== 'ok'){ bad.push(c.name + ': ' + rd); await ctx.close(); continue; }
    await page.waitForTimeout(2500);
    await page.screenshot({ path:path.join(OUT, c.name + '.png') });
    /* 버튼 상자: 화면 안, 44px 이상, 서로 안 겹침 */
    const rects = await page.evaluate(() => [...document.querySelectorAll('.t3d-btn')].map(b => { const r = b.getBoundingClientRect(); return { id:b.dataset.id, x:r.left, y:r.top, w:r.width, h:r.height }; }));
    const logoR = await page.evaluate(() => { const r = document.querySelector('.t3d-logo').getBoundingClientRect(); const h = document.querySelector('.t3d-hud').getBoundingClientRect(); return [r, h].map(q => ({ x:q.left, y:q.top, w:q.width, h:q.height })); });
    const all = rects.concat(logoR.map((r, i) => Object.assign({ id:i ? 'hud' : 'logo' }, r)));
    rects.forEach(r => { if(r.w < 44 || r.h < 44) bad.push(`${c.name}: ${r.id} 작음 ${r.w|0}x${r.h|0}`);
      if(r.x < 0 || r.y < 0 || r.x + r.w > c.w || r.y + r.h > c.h) bad.push(`${c.name}: ${r.id} 화면 밖`); });
    for(let i = 0; i < all.length; i++) for(let j = i + 1; j < all.length; j++){ const a = all[i], b = all[j];
      if(a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) bad.push(`${c.name}: 겹침 ${a.id}↔${b.id}`); }
    const hs = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if(hs > 0) bad.push(`${c.name}: 가로 스크롤 ${hs}px`);
    if(c.name === 'desk-ko' || c.name === 'phone-ko'){
      /* 버튼 클릭 */
      for(const id of IDS){ await page.evaluate(() => { window.__picks = []; }); await page.waitForTimeout(450);
        await page.click(`.t3d-btn[data-id="${id}"]`); const p = await page.evaluate(() => window.__picks.slice());
        if(p[0] !== id) bad.push(`${c.name}: 버튼 ${id} → ${JSON.stringify(p)}`); }
      /* 3D 물건 클릭(버튼과 안 겹치는 물건의 윗부분) */
      for(const id of IDS){
        await page.evaluate(() => { window.__picks = []; }); await page.waitForTimeout(450);
        const pt = await page.evaluate(id => { const d = window.__t3d._debug, o = d.objs[id]; const b = o.box; const THREEp = b[2].clone().lerp(b[5], 0.5); THREEp.y *= 0.7; THREEp.z = o.holder.position.z; return d.proj(THREEp); }, id);
        const under = await page.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.className : ''; }, pt);
        if(!/t3d-gl/.test(under)){ console.log(`  (${c.name} 3D ${id}: 그 점은 ${under} 가 덮음 — 건너뜀)`); continue; }
        await page.mouse.click(pt[0], pt[1]); const p = await page.evaluate(() => window.__picks.slice());
        if(p[0] !== id) bad.push(`${c.name}: 3D ${id} @${pt.map(v => v | 0)} → ${JSON.stringify(p)}`);
      }
      /* Tab 순서 */
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
      const seen = [];
      for(let i = 0; i < 12; i++){ await page.keyboard.press('Tab'); const id = await page.evaluate(() => document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.id : null); if(id && !seen.includes(id)) seen.push(id); }
      const miss = IDS.filter(i => !seen.includes(i)); if(miss.length) bad.push(`${c.name}: Tab 못 감 ${miss}`);
      console.log(`${c.name} tab: ${seen.join(' ')}`);
      /* 포커스 강조 스크린샷 */
      await page.evaluate(() => document.querySelector('.t3d-btn[data-id="sheet"]').focus()); await page.waitForTimeout(700);
      await page.screenshot({ path:path.join(OUT, c.name + '-focus-sheet.png') });
    }
    if(errs.length) bad.push(`${c.name}: ${errs.join(' | ')}`);
    console.log(`${c.name} ✓ shot`);
    await ctx.close();
  }
  await browser.close(); server.close();
  if(bad.length){ console.log('\n✗\n  ' + bad.join('\n  ')); process.exitCode = 1; } else console.log('\nall ok');
});
