#!/usr/bin/env node
// 과학 탐구 랩 3D 검사 — science-lab/3D-RULES.md 의 규칙을 실제 브라우저에서 확인한다.
//
//   node scripts/check-science-3d.mjs              # 전체(5실험 × 7화면)
//   node scripts/check-science-3d.mjs s41-u03b     # 지정 단원만
//   SHOTS=/tmp/3d node scripts/check-science-3d.mjs # 화면마다 캡처도 저장
//
// 확인하는 것(하나라도 어기면 exit 1):
//   ① 잘림   — 맞춤 대상 점이 전부 캔버스 안(NDC ±1.0)에 든다
//   ② 크기   — 너무 작지 않다: 가로나 세로 중 한쪽을 60% 이상 채운다
//   ③ 맞춤   — 화면 비율이 바뀐 뒤(전체 화면 포함) 다시 맞췄다(_needFit 없음, 비율 일치)
//   ④ 처음 시점 — 끌어서 돌리면 「↺ 처음 시점」이 뜨고, 누르면 home 으로 돌아간다(PC 실험 화면에서만)
//   ⑤ 화산 초기 상태 — 버튼을 누르기 전 포일·비커가 보이지 않는다
//   ⑥ 페이지 오류 — pageerror 0 (외부 글꼴·CDN 네트워크 오류는 뺀다)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

// 3D 실험실이 있는 단원 — science-lab/v2/home.js 의 LABS 와 같아야 한다(새 실험을 넣으면 여기도)
const ALL = ['s41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05'];
const UNITS = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
const SHOTS = process.env.SHOTS || '';
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.glb': 'model/gltf-binary', '.hdr': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (p.startsWith(ROOT) && fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/science-lab/v2/`;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const fails = []; let checks = 0;
const fail = (where, msg) => { fails.push(`${where}: ${msg}`); console.log(`  ✗ ${msg}`); };

// 무대 상태: 맞춤이 끝났는지 + 맞춤 점들의 화면 위치(NDC)
const probe = (page) => page.evaluate(async () => {
  const { Stage } = await import('/science-lab/engine.js');
  const THREE = await import('/world-explorer/vendor/three.module.js');
  return [...Stage.live].filter((s) => s.canvas.isConnected && s.canvas.clientWidth > 0).map((s) => {
    s.camera.updateMatrixWorld(); s.camera.updateProjectionMatrix();
    const o = s.orbit, D = o.dist;
    const cam = new THREE.Vector3(o.target.x + D * Math.sin(o.phi) * Math.sin(o.theta), o.target.y + D * Math.cos(o.phi), o.target.z + D * Math.sin(o.phi) * Math.cos(o.theta));
    const c = s.camera.clone(); c.position.copy(cam); c.lookAt(o.target); c.updateMatrixWorld();
    let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (const p of s._framePoints()) { const v = p.clone().project(c); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
    return { x0, x1, y0, y1, fitted: !s._needFit && !s._glide && Math.abs(s.camera.aspect - s._fitAspect) < 0.03, aspect: s.camera.aspect, w: s.canvas.clientWidth, h: s.canvas.clientHeight, auto: s.autoFit };
  });
});

async function waitFitted(page, ms = 25000) {
  // 맞춤이 끝나고, 화면에 잡힌 범위가 1.2초 간격으로 두 번 같을 때까지(움직이던 물체가 자리 잡아 다시 맞추는 것까지) 기다린다
  const t0 = Date.now(); let prev = null, st = [];
  const sig = (a) => a.map((s) => [s.x0, s.x1, s.y0, s.y1].map((v) => v.toFixed(2)).join(',')).join('|');
  while (Date.now() - t0 < ms) {
    st = await probe(page);
    if (st.length && st.every((s) => s.fitted)) { if (prev !== null && sig(st) === prev) return st; prev = sig(st); } else prev = null;
    await page.waitForTimeout(1200);
  }
  return st;
}

function judge(where, st) {
  if (!st.length) { fail(where, '3D 무대를 찾지 못함(캔버스가 안 뜸)'); return; }
  if (process.env.DEBUG3D) console.log('    ', JSON.stringify(st.map((s) => [s.x0, s.x1, s.y0, s.y1].map((v) => +v.toFixed(2)))));
  for (const s of st) {
    checks++;
    const tag = `${s.w}×${s.h}`;
    if (!s.auto) continue;   // 자동 맞춤을 끈 무대는 검사하지 않는다
    if (!s.fitted) fail(where, `${tag} 비율이 바뀐 뒤 다시 맞추지 않음(aspect ${s.aspect.toFixed(2)})`);
    const E = 1.0;
    if (s.x0 < -E || s.x1 > E || s.y0 < -E || s.y1 > E) fail(where, `${tag} 잘림 — 화면 밖 NDC x ${s.x0.toFixed(2)}~${s.x1.toFixed(2)}, y ${s.y0.toFixed(2)}~${s.y1.toFixed(2)}`);
    const fill = Math.max((s.x1 - s.x0) / 2, (s.y1 - s.y0) / 2);
    if (fill < 0.6) fail(where, `${tag} 너무 작음 — 화면의 ${Math.round(fill * 100)}%만 채움`);
  }
}

async function open(vp, hash, { touch = false } = {}) {
  const page = await browser.newPage({ viewport: vp, hasTouch: touch });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE + hash, { waitUntil: 'networkidle' });
  return { page, errs };
}
async function shot(page, name) { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png') }); }
async function done(where, page, errs) { if (errs.length) fail(where, `페이지 오류 ${errs.length}건: ${errs[0]}`); await page.close(); }

// 덱의 「3D 실험실」 슬라이드 번호를 찾는다(순서가 바뀌어도 따라가게)
async function labSlide(u) {
  const { page } = await open({ width: 1440, height: 900 }, `#/${u}/lab-class/teach/1`);
  let found = 0;
  for (let i = 1; i <= 45 && !found; i++) {
    await page.evaluate((h) => { location.hash = h; }, `#/${u}/lab-class/teach/${i}`);
    await page.waitForTimeout(120);
    const t = await page.evaluate(() => document.querySelector('.dk-h')?.textContent || '');
    if (t.startsWith('3D 실험실')) found = i;
  }
  await page.close(); return found;
}

for (const u of UNITS) {
  console.log(`\n■ ${u}`);
  const n = await labSlide(u);
  const cases = [
    ['덱 실험 슬라이드', { width: 1440, height: 900 }, n ? `#/${u}/lab-class/teach/${n}` : null],
    ['5단계 실험(PC)', { width: 1280, height: 860 }, `#/${u}/2/lab`],
    ['5단계 실험(폰)', { width: 390, height: 844 }, `#/${u}/2/lab`, true],
    ['장면(PC)', { width: 1280, height: 860 }, `#/${u}/2/scene`],
    ['장면(폰)', { width: 390, height: 844 }, `#/${u}/2/scene`, true],
  ];
  for (const [name, vp, hash, touch] of cases) {
    const where = `${u} ${name}`; console.log(`  · ${name}`);
    if (!hash) { fail(where, '덱에서 「3D 실험실」 슬라이드를 찾지 못함'); continue; }
    const { page, errs } = await open(vp, hash, { touch });
    judge(where, await waitFitted(page));
    await shot(page, `${u}-${name}`);
    if (name === '5단계 실험(PC)') {
      // ⑤ 화산: 누르기 전에는 포일이 없다
      if (u === 's41-u03b') {
        checks++;
        const early = await page.evaluate(async () => {
          const { Stage } = await import('/science-lab/engine.js'); const THREE = await import('/world-explorer/vendor/three.module.js');
          const s = [...Stage.live][0], v = new THREE.Vector3(); let hi = 0;
          s.root.updateMatrixWorld(true); s.root.traverseVisible((m) => { if (m.isMesh && !m.isInstancedMesh) hi = Math.max(hi, m.getWorldPosition(v).y); });
          return hi;
        });
        if (early > 3.2) fail(where, `버튼을 누르기 전인데 높은 곳(y ${early.toFixed(1)})에 물체가 보임 — 포일/비커가 저절로 떨어지는지 확인`);
      }
      // ④ 처음 시점 단추
      checks++;
      const c = await page.$('canvas'); if (!c) { await done(where, page, errs); continue; }
      await c.scrollIntoViewIfNeeded(); const bb = await c.boundingBox();
      await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down();
      await page.mouse.move(bb.x + bb.width / 2 + 200, bb.y + bb.height / 2 + 40, { steps: 6 }); await page.mouse.up();
      await page.waitForTimeout(300);
      const shown = await page.evaluate(() => { const b = document.querySelector('.stage-home'); return !!b && getComputedStyle(b).display !== 'none'; });
      if (!shown) fail(where, '돌린 뒤 「↺ 처음 시점」 단추가 안 뜸');
      else {
        await page.click('.stage-home'); await page.waitForTimeout(1800);
        const back = await page.evaluate(async () => { const { Stage } = await import('/science-lab/engine.js'); const s = [...Stage.live][0], o = s.orbit, h = o.home; return Math.abs(o.theta - h.theta) + Math.abs(o.phi - h.phi) + Math.abs(o.dist - h.dist) / h.dist; });
        if (back > 0.02) fail(where, `「처음 시점」을 눌러도 원래 시점으로 안 돌아옴(차이 ${back.toFixed(3)})`);
      }
    }
    await done(where, page, errs);
  }
  // 전체 화면(PC·폰 가로·덱): 조작판이 옆에 붙어 캔버스 비율이 크게 바뀐다.
  // 덱은 실험 칸 규칙(캔버스 높이 36cqw !important·격자)이 전체 화면에 남아 아래 절반이 비었던 적이 있다(2026-10-06) → 화면을 채우는지도 잰다
  for (const [name, vp, touch, hash] of [['전체 화면(PC)', { width: 1280, height: 760 }], ['전체 화면(폰 가로)', { width: 844, height: 390 }, true], ['전체 화면(덱)', { width: 1440, height: 900 }, false, n ? `#/${u}/lab-class/teach/${n}` : null]]) {
    const where = `${u} ${name}`; console.log(`  · ${name}`);
    if (name === '전체 화면(덱)' && !hash) continue;
    const { page, errs } = await open(vp, hash || `#/${u}/2/lab`, { touch });
    await waitFitted(page);
    const btn = await page.$('.fl-open');
    if (!btn) { fail(where, '「전체 화면」 단추 없음'); await done(where, page, errs); continue; }
    await btn.click(); await page.waitForTimeout(500);
    judge(where, await waitFitted(page));
    checks++;
    const box = await page.evaluate(() => { const h = document.querySelector('.full-land'), c = h?.querySelector(':scope > canvas'), x = h?.querySelector('.fl-close'); if (!c || !x) return null; const r = c.getBoundingClientRect(); return { h: r.height, top: r.top, vh: innerHeight, closeX: x.getBoundingClientRect().left }; });
    if (!box) fail(where, '전체 화면에서 캔버스나 「닫기」를 찾지 못함');
    else {
      if (box.top > 2 || box.h < box.vh * 0.97) fail(where, `전체 화면인데 3D가 화면 높이를 다 채우지 않음(${Math.round(box.h)}/${box.vh}px)`);
      if (box.closeX > 40) fail(where, `「닫기」가 왼쪽 위가 아니라 x ${Math.round(box.closeX)}px에 있음(조작판을 가림)`);
    }
    await shot(page, `${u}-${name}`);
    await done(where, page, errs);
  }
}

await browser.close(); server.close();
console.log(`\n검사 ${checks}건 · 실패 ${fails.length}건`);
if (fails.length) { console.log(fails.map((f) => '  - ' + f).join('\n')); process.exit(1); }
