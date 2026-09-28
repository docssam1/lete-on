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
const quick = process.argv.includes('--quick');   /* 스크린샷만(누르기·Tab 검사 생략) */
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
  { name:'desk-still', w:1280, h:800, lang:'ko', q:'&still=1' },
  { name:'phone-raw', w:390, h:844, lang:'ko', q:'&raw=1' },
  { name:'phone-land', w:844, h:390, lang:'ko', mobile:true },
  /* 3D 캐릭터 바꿔 끼우기(app/char3d — 다른 작업이 만드는 중이라 여기서 난 오류는 경고로만) */
  { name:'desk-char3d', w:1280, h:800, lang:'ko', q:'&char3d=boy', soft:true },
  { name:'desk-model', w:1280, h:800, lang:'ko', q:'&model=boy', soft:true, wave:true },
  { name:'phone-model', w:390, h:844, lang:'ko', q:'&model=girl', mobile:true, soft:true },
].filter(c => !only || only.slice(7).split(',').includes(c.name));
/* 웹 글꼴(Google Fonts · Pretendard) — 이 검사 브라우저는 에이전트 프록시의 인증서를 믿지 않아 직접 못 받는다.
   curl(프록시·인증서 설정을 따른다)로 받아 넘겨 준다. 못 받으면 그 요청만 끊고 대체 글꼴로 검사한다. */
const { execFileSync } = require('child_process');
const fontCache = new Map();
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
async function routeFonts(ctx){
  await ctx.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)\//, async route => {
    const url = route.request().url();
    try {
      if(!fontCache.has(url)) fontCache.set(url, execFileSync('curl', ['-sSfL', '--max-time', '25', '-A', UA, url], { maxBuffer:64 << 20, stdio:['ignore', 'pipe', 'ignore'] }));
      const ext = (url.split('?')[0].match(/\.(\w+)$/) || [])[1];
      const type = /googleapis/.test(url) || ext === 'css' ? 'text/css' : ext === 'woff' ? 'font/woff' : ext === 'ttf' ? 'font/ttf' : 'font/woff2';
      await route.fulfill({ status:200, body:fontCache.get(url), headers:{ 'content-type':type, 'access-control-allow-origin':'*' } });
    } catch(e){ fontsMissed.add(url.replace(/\?.*/, '')); await route.abort(); }
  });
}
const fontsMissed = new Set();
const IDS = ['continue', 'diag', 'game', 'sheet', 'road', 'story', 'dex', 'hist', 'magazine'];
server.listen(0, async () => {
  const browser = await chromium.launch({ args:['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const bad0 = [], warn = [];
  for(const c of cases){
    const bad = c.soft ? warn : bad0;
    const ctx = await browser.newContext({ viewport:{ width:c.w, height:c.h }, deviceScaleFactor:1, hasTouch:!!c.mobile });
    await routeFonts(ctx);
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource|fonts\.g/.test(m.text())) errs.push(m.text()); });
    await page.goto(`http://localhost:${server.address().port}/number_magic/scripts/title3d/test.html?lang=${c.lang}${c.q || ''}`);
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
    if(!quick && (c.name === 'desk-ko' || c.name === 'phone-ko')){
      /* 버튼 클릭 */
      for(const id of IDS){ await page.evaluate(() => { window.__picks = []; }); await page.waitForTimeout(450);
        await page.click(`.t3d-btn[data-id="${id}"]`); const p = await page.evaluate(() => window.__picks.slice());
        if(p[0] !== id) bad.push(`${c.name}: 버튼 ${id} → ${JSON.stringify(p)}`); }
      /* 3D 물건 클릭(버튼과 안 겹치는 물건의 윗부분) */
      for(const id of IDS){
        await page.evaluate(() => { window.__picks = []; }); await page.waitForTimeout(450);
        /* 물건의 화면 상자 안을 훑어, 캔버스가 드러나 있고 레이캐스트가 그 물건을 맞히는 점을 찾는다 */
        const pt = await page.evaluate(id => { const d = window.__t3d._debug, o = d.objs[id];
          let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; o.box.forEach(p => { const [x, y] = d.proj(p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
          for(let j = 1; j < 12; j++) for(let i = 1; i < 12; i++){ const x = x0 + (x1 - x0) * i / 12, y = y0 + (y1 - y0) * j / 12;
            /* 가장자리 한 점은 정수 좌표로 누를 때 빗나갈 수 있다 — 둘레 3px 도 같은 물건인 점만 */
            const ok = (px, py) => { const el = document.elementFromPoint(px, py); return el && /t3d-gl/.test(el.className) && d.hitAt(px, py) === id; };
            const X = Math.round(x), Y = Math.round(y);
            if(ok(X, Y) && ok(X - 3, Y) && ok(X + 3, Y) && ok(X, Y - 3) && ok(X, Y + 3)) return [X, Y]; }
          return null; }, id);
        if(!pt){ bad.push(`${c.name}: 3D ${id} 누를 자리 없음`); continue; }
        await page.mouse.move(pt[0], pt[1]); await page.waitForTimeout(120);
        const lit = await page.evaluate(id => document.querySelector(`.t3d-btn[data-id="${id}"]`).classList.contains('on'), id);
        if(!lit) bad.push(`${c.name}: 3D ${id} 위에 올려도 버튼 강조 없음`);
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
    if(!quick && c.name === 'desk-still'){
      /* 크기 바꾸기 → 다시 구도, 언어 바꾸기, 해제 */
      await page.setViewportSize({ width:600, height:900 }); await page.waitForTimeout(900);
      await page.screenshot({ path:path.join(OUT, c.name + '-resized.png') });
      await page.evaluate(() => window.__t3d.setLang('en')); await page.waitForTimeout(500);
      const lab = await page.evaluate(() => document.querySelector('.t3d-btn[data-id="sheet"] b').textContent);
      if(lab !== 'Worksheet Mode') bad.push(`${c.name}: setLang 안 됨 (${lab})`);
      await page.evaluate(() => window.__t3d.dispose());
      const left = await page.evaluate(() => document.querySelectorAll('.t3d').length);
      if(left) bad.push(`${c.name}: dispose 뒤에도 .t3d 남음`);
    }
    if(c.wave){
      /* 이어서 모험에 올리면 손 흔들기 — 흔드는 중간을 찍어 눈으로 확인 */
      await page.hover('.t3d-btn[data-id="continue"]'); await page.waitForTimeout(650);
      await page.screenshot({ path:path.join(OUT, c.name + '-wave.png') });
    }
    if(errs.length) bad.push(`${c.name}: ${errs.join(' | ')}`);
    console.log(`${c.name} ✓ shot`);
    await ctx.close();
  }
  await browser.close(); server.close();
  if(fontsMissed.size) console.log('\n(웹 글꼴을 못 받음 — 대체 글꼴로 검사함)\n  ' + [...fontsMissed].slice(0, 6).join('\n  '));
  if(warn.length) console.log('\n(경고 — 3D 캐릭터 쪽)\n  ' + warn.join('\n  '));
  if(bad0.length){ console.log('\n✗\n  ' + bad0.join('\n  ')); process.exitCode = 1; } else console.log('\nall ok');
});
