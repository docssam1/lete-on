#!/usr/bin/env node
/* ============================================================
   수학 이야기 3D — 움직임·자막을 눈으로 보기 위한 프레임 찍기(2026-09-26)
   앱과 같은 app/hero3d/live.js 로 장면을 띄우고(scripts/hero3d/live-test.html), 한 바퀴 동안 6장을 찍는다.
   각 장은 그림 + 그 순간의 자막 띠. 검사기가 아니라 **사람(또는 에이전트)이 보고 판단**하기 위한 도구.
     node scripts/hero3d-live-shots.js M-10 M-11            # ko
     node scripts/hero3d-live-shots.js M-10:en --out=/tmp/x
   출력: <out>/<유닛>-<lang>-<0..5>.png (기본 out = OS 임시 폴더/hero3d-shots). 오류가 있으면 끝에 적고 exit 1.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const { chromium } = require('./lib/playwright');
const APP = path.resolve(__dirname, '..'), ROOT = path.resolve(APP, '..');
const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(os.tmpdir(), 'hero3d-shots');
fs.mkdirSync(OUT, { recursive:true });
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type':TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
const jobs = process.argv.slice(2).filter(a => /^[A-Z]-\d+(:(ko|en|zh))?$/.test(a)).map(a => a.split(':'));
server.listen(0, async () => {
  const browser = await chromium.launch({ args:['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const bad = [];
  for(const [u, lang = 'ko'] of jobs){
    const page = await browser.newPage({ viewport:{ width:820, height:680 } });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
    await page.goto(`http://localhost:${server.address().port}/number_magic/scripts/hero3d/live-test.html?u=${u}&lang=${lang}`);
    try { await page.waitForFunction(() => window.__live !== undefined || window.__liveErr, null, { timeout:90000 }); }
    catch(e){ bad.push(`${u}: 90초 안에 뜨지 않음`); await page.close(); continue; }
    const st = await page.evaluate(() => ({ live:window.__live, err:window.__liveErr }));
    if(!st.live || st.err){ bad.push(`${u}: 3D 를 못 띄움 ${st.err || ''}`); await page.close(); continue; }
    /* 한 바퀴(caps.P) 동안 고르게 6장. 첫 프레임을 그리기까지 시간이 걸리므로 2초 기다린 뒤부터 */
    const P = await page.evaluate(async u => { const m = await import('../../app/hero3d/scenes.js'); const d = m.SCENES[u]; return (d && d.caps && d.caps.P) || 8; }, u);
    await page.waitForTimeout(2000);
    const fig = await page.$('.nm-mzu-hero');
    for(let i = 0; i < 6; i++){ if(i) await page.waitForTimeout(P * 1000 / 6); await fig.screenshot({ path:path.join(OUT, `${u}-${lang}-${i}.png`) }); }
    if(errs.length) bad.push(`${u}: ${errs[0]}`);
    console.log(`${u} ${lang} — 한 바퀴 ${P}초, 6장 → ${OUT}`);
    await page.close();
  }
  await browser.close(); server.close();
  if(bad.length){ console.log('\n✗\n  ' + bad.join('\n  ')); process.exitCode = 1; }
});
