#!/usr/bin/env node
/* char3d 시험대 스크린샷 — node scripts/char3d/shots.js [--out=DIR] [view …]
   view 예: lineup  close  small  walk  hats  digits  syms  side  wave  (기본: 전부)
   각 view = test.html 쿼리. 콘솔 오류가 있으면 exit 1. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const { chromium } = require('../lib/playwright');
const APP = path.resolve(__dirname, '..', '..'), ROOT = path.resolve(APP, '..');
const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(os.tmpdir(), 'char3d-shots');
fs.mkdirSync(OUT, { recursive:true });
const VIEWS = {
  lineup:{ q:'', w:1600, h:620 },
  close:{ q:'cam=close&only=boy,girl,elder,doc', w:1400, h:700 },
  closeb:{ q:'cam=close&only=b0,b3,b8,b7,b10,plus', w:1400, h:600 },
  small:{ q:'cam=small', w:720, h:300 },
  walk:{ q:'walk=1', w:1600, h:620, step:0.37 },
  hats:{ q:'hats=1&only=b3,b8,b7,b10,plus', w:1300, h:560 },
  digits:{ q:'set=digits&hats=1', w:1300, h:560 },
  syms:{ q:'set=syms', w:1600, h:520 },
  side:{ q:'turn=0.9', w:1600, h:620 },
  wave:{ q:'', w:1600, h:620, wave:0.55 },
};
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.png':'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type':TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
const want = process.argv.slice(2).filter(a => !a.startsWith('--'));
server.listen(0, async () => {
  const browser = await chromium.launch({ args:['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const bad = [];
  for(const [name, v] of Object.entries(VIEWS)){
    if(want.length && !want.includes(name)) continue;
    const page = await browser.newPage({ viewport:{ width:v.w, height:v.h }, deviceScaleFactor:1 });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if(m.type() === 'error') errs.push(m.text()); });
    await page.goto(`http://localhost:${server.address().port}/number_magic/scripts/char3d/test.html?${v.q}`);
    await page.waitForFunction(() => window.__ready, null, { timeout:120000 });
    const e2 = await page.evaluate(() => window.__errs); errs.push(...e2);
    if(v.step) await page.evaluate(s => window.__step(s), v.step);
    if(v.wave){ await page.evaluate(() => window.__wave()); await page.evaluate(s => window.__step(s), v.wave); }
    await page.waitForTimeout(300);
    await page.screenshot({ path:path.join(OUT, name + '.png') });
    const st = await page.evaluate(() => window.__stats);
    console.log(name, '→', path.join(OUT, name + '.png'), st ? st.map(s => `${s.id}:${s.tris}t/${s.mats}m/${s.meshes}d`).join(' ') : '');
    if(errs.length) bad.push(name + ': ' + errs.join(' | '));
    await page.close();
  }
  await browser.close(); server.close();
  if(bad.length){ console.log('\n✗\n  ' + bad.join('\n  ')); process.exitCode = 1; }
});
