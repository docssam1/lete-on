#!/usr/bin/env node
/* ============================================================
   수학 이야기 3D 대표 그림 굽기 (2026-09-26)
   원장 "좀 실사 느낌이 되었으면 좋겠어 막대도 실제 막대처럼 정 안되면 3d로".
   scripts/hero3d/scenes.js 의 장면을 헤드리스 Chromium(WebGL, swiftshader)으로 찍어
   assets/hero3d/<유닛>.webp(1600×1000)로 저장한다. 앱 발견 단계·인쇄 수학 이야기 쪽이
   data/hero3d.js 에 등록된 유닛만 싣는다(그림 설명 alt 는 거기 3개 언어로).
     node scripts/build-hero3d.js            # 전부
     node scripts/build-hero3d.js M-01 M-50  # 몇 개만
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('./lib/playwright');
const APP = path.resolve(__dirname, '..'), ROOT = path.resolve(APP, '..');
const OUT = path.join(APP, 'assets', 'hero3d');
const TYPES = { '.html':'text/html', '.js':'text/javascript' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type':TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  fs.mkdirSync(OUT, { recursive:true });
  const src = fs.readFileSync(path.join(__dirname, 'hero3d', 'scenes.js'), 'utf8');
  const all = [...src.matchAll(/^\s*'(M-\d+|[A-Z]-\d+)'\s*:/gm)].map(m => m[1]);
  const want = process.argv.slice(2).filter(a => /^[A-Z]-\d+$/.test(a));
  const ids = want.length ? want : all;
  const browser = await chromium.launch({ args:['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const bad = [];
  for(const id of ids){
    const page = await browser.newPage({ viewport:{ width:1600, height:1000 } });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(`http://localhost:${server.address().port}/number_magic/scripts/hero3d/hero.html?u=${id}`);
    await page.waitForFunction(() => window.__done, null, { timeout:180000 });
    const r = await page.evaluate(() => ({ url:window.__hero, err:window.__heroErr }));
    await page.close();
    if(!r.url || r.err || errs.length){ bad.push(`${id}: ${r.err || errs[0] || '그림 없음'}`); continue; }
    const buf = Buffer.from(r.url.split(',')[1], 'base64');
    fs.writeFileSync(path.join(OUT, id + '.webp'), buf);
    console.log(`${id}.webp ${Math.round(buf.length / 1024)}KB`);
  }
  await browser.close(); server.close();
  if(bad.length){ console.log('\n✗ 실패\n  ' + bad.join('\n  ')); process.exitCode = 1; }
});
