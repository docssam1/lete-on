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
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  // E: Windows 작업본처럼 이 저장소에 node_modules가 없을 때는 설치된 모듈 경로를 명시해 쓴다.
  const modulePath = process.env.SCIENCE_LAB_PLAYWRIGHT || '/opt/node22/lib/node_modules/playwright/index.mjs';
  ({ chromium } = await import(pathToFileURL(modulePath).href));
}

// 3D 실험실이 있는 단원 — science-lab/v2/home.js 의 LABS 와 같아야 한다(새 실험을 넣으면 여기도)
const ALL = ['c22-s42-u04', 'c22-s42-u01', 'c22-s32-u04', 'c22-s32-u01', 'c22-s32-u02', 'c22-s32-u03', 's41-u04', 's31-u01', 's41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05', 's52-u01'];
const UNITS = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
const labPath = u => `#/${u}/2/lab`;   // 2026-10-20부터 4-1 단원도 3D 실험이 기본(lab) — 기록 앱은 선택 기능
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
// 고리 자석 탑(2026-10-13 검수 PR #318): ① 첫 화면(스크롤 0)에서 「표에 적기」 가운데를 elementFromPoint로 짚어 하단 고정 막대에 가리지 않는지,
// 이어서 스크롤 없이 실제 마우스로 고르기 → 예상 → 뒤집기 → 적기를 누른다. ② WebGL이 없는 2D 실험실도 같은 흐름·같은 정답 비노출 규칙.
// (locator.click은 알아서 스크롤해 가림을 놓친다 — 2026-10-13 이 검사가 그 탓에 1280×860 가림을 통과시켰다.)
async function pressAt(page, sel) {
  const r = await page.evaluate((sel) => {
    const b = document.querySelector(sel); if (!b) return { why: '없음' };
    const q = b.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height / 2;
    if (y < 0 || y > innerHeight) return { why: `화면 밖(y ${Math.round(y)})` };
    const e = document.elementFromPoint(x, y);
    return e && e.closest(sel) === b ? { x, y } : { why: `가림(${e ? (e.closest('.bottom') ? '하단 막대' : e.className || e.tagName) : '없음'})` };
  }, sel);
  if (r.why) return r.why;
  await page.mouse.click(r.x, r.y); return '';
}
const ringState = (page) => page.evaluate(() => ({
  fl: document.querySelector('[data-r=floating]')?.textContent, h: document.querySelector('[data-r=height]')?.textContent,
  rec: document.querySelector('[data-act=record]')?.disabled, phase: document.querySelector('.lab3d--ring-tower')?.dataset.phase,
  poles: [...document.querySelectorAll('.rt2-pole')].length,
  ariaPole: [...document.querySelectorAll('.lab3d--ring-tower [aria-label]')].filter((e) => !e.matches('[data-act=inspect-pair]') && /[NS]극|윗면 [NS]/.test(e.getAttribute('aria-label'))).length,
}));
async function ringFlow(where, page, { strict }) {
  const press = async (sel, label, wait) => {
    let why = await pressAt(page, sel);
    if (why && !strict) { await page.locator(sel).first().scrollIntoViewIfNeeded(); why = await pressAt(page, sel); }
    if (why) { fail(where, `「${label}」을 스크롤 없이 누를 수 없음 — ${why}`); await page.locator(sel).first().click(); }
    await page.waitForTimeout(wait);
  };
  checks += 5;
  let s = await ringState(page);
  if (s.fl !== '?' || s.h !== '?' || !s.rec || s.poles || s.ariaPole) fail(where, `첫 화면에 답이 보임(${JSON.stringify(s)})`);
  if (strict) {   // 첫 화면: 아직 잠겨 있어도 「표에 적기」가 막대 밑에 숨어 있으면 안 된다
    const hid = await page.evaluate(() => { const b = document.querySelector('[data-act=record]'), q = b.getBoundingClientRect(), y = q.top + q.height / 2; if (y > innerHeight) return '화면 밖'; const e = document.elementFromPoint(q.left + q.width / 2, y); return e && e.closest('[data-act=record]') === b ? '' : (e?.closest('.bottom') ? '하단 막대' : (e?.className || '없음')); });
    if (hid) fail(where, `첫 화면에서 「표에 적기」가 가려짐 — ${hid}`);
  }
  const y0 = await page.evaluate(() => scrollY);
  await press('[data-flip="1"]', '2번', 500);
  if (!(await page.locator('.rt-card [data-pred]').count())) fail(where, '고리를 고르면 예상 고르기가 떠야 함');
  if (strict) {   // 예상 카드를 열 때 페이지가 크게 밀려 탑(캔버스 윗부분)이 화면 위로 나가면 안 된다(2026-10-13 검수: 267px)
    checks++;
    const m = await page.evaluate(() => ({ dy: scrollY, top: document.querySelector('.lab3d--ring-tower > canvas, .lab3d--ring-tower > .rt2-svg').getBoundingClientRect().top }));
    if (m.dy - y0 > 60 || m.top < 40) fail(where, `예상 카드를 열자 페이지가 ${Math.round(m.dy - y0)}px 밀려 탑 위쪽이 가림(캔버스 위 ${Math.round(m.top)}px)`);
  }
  await press('[data-pred="2"]', '예상', 300);
  const settled = () => page.waitForFunction(() => ['explore', 'battle'].includes(document.querySelector('.lab3d--ring-tower')?.dataset.phase), null, { timeout: 15000 }).catch(() => {});   // 느린 렌더러에서도 고정 대기 대신 내려앉을 때까지
  await press('[data-act="flip-sel"]', '뒤집어 보기', 300); await settled();
  s = await ringState(page);
  if (s.fl !== '?' || s.rec || s.poles || s.phase !== 'explore') fail(where, `뒤집은 뒤(적기 전) 상태가 틀림(${JSON.stringify(s)})`);
  await press('[data-act="record"]', '표에 적기', 900);
  if (strict) {   // 적은 뒤에도 탑(캔버스 위쪽)이 화면 안에 남아야 한다 — 자·집게를 보는 순간이다
    checks++;
    const top = await page.evaluate(() => document.querySelector('.lab3d--ring-tower > canvas, .lab3d--ring-tower > .rt2-svg').getBoundingClientRect().top);
    if (top < 40) fail(where, `적은 뒤 페이지가 밀려 탑 위쪽이 가림(캔버스 위 ${Math.round(top)}px)`);
  }
  s = await ringState(page);
  if (s.fl !== '2' || s.h !== '5.3' || s.phase !== 'revealed') fail(where, `적은 뒤 값이 모델과 다름(${JSON.stringify(s)})`);
  await press('[data-flip="3"]', '4번', 300); await settled();
  s = await ringState(page);
  if (s.fl !== '?' || s.poles) fail(where, `다시 뒤집었는데 값·극이 그대로 보임(${JSON.stringify(s)})`);
  await press('[data-act="record"]', '두 번째 적기', 900);
  await press('[data-act="compare"]', '두 탑 비교', 1500);
  s = await ringState(page);
  if (s.phase !== 'compare' || !s.rec) fail(where, `두 탑 비교가 열리지 않았거나 비교 중 적기가 열려 있음(${JSON.stringify(s)})`);
  await press('[data-act="compare"]', '실험으로 돌아가기', 800);
  if ((await page.locator('.lab-table tbody tr[data-row]').count()) !== 2) fail(where, '두 번 적었는데 표가 2줄이 아님');
}
async function ringTowerClicks(u) {
  for (const vp of [{ width: 1280, height: 860 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1024, height: 768 }]) {
    const where = `${u} 실제 클릭 ${vp.width}×${vp.height}`; console.log(`  · ${where.slice(u.length + 1)}`);
    const { page, errs } = await open(vp, labPath(u)); await page.waitForTimeout(3000);
    await ringFlow(where, page, { strict: true });
    await shot(page, `${u}-실제 클릭 ${vp.width}`);
    await done(where, page, errs);
  }
  // 두 팀 대결(전자칠판·태블릿): 처음과 두 팀 확정 뒤 모두 — 두 팀의 번호 단추·표에 적기·기록 고르기·확정·O/X가 대결 칸 안쪽 스크롤 없이 보이고 실제로 눌리는지,
  // 팀 칸 아래가 잘리지 않는지, 누르는 칸이 44px 이상인지. 4:3·16:10·낮은 화면은 16:9 틀을 풀어 남은 높이를 쓰고 교사 노트를 접는다(2026-10-14 검수).
  const n = await labSlide(u);
  const battleAudit = (page) => page.evaluate(() => {
    const box = document.querySelector('.dk-magnet-battle'); if (!box) return ['대결 화면 없음'];
    const b = box.getBoundingClientRect(), out = [];
    const hit = (el) => { const q = el.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height / 2; if (y < b.top || y > Math.min(b.bottom, innerHeight)) return false; const e = document.elementFromPoint(x, y); return !!e && (e === el || el.contains(e)); };
    for (const t of document.querySelectorAll('.mb-team')) {
      const name = t.querySelector('header b')?.textContent || '팀';
      const els = t.querySelectorAll('[data-flip], [data-act=record], [data-mb-pick], [data-mb-submit], .mb-actual:not([hidden]) button');
      if (els.length < 7) out.push(`${name} 조작부가 다 그려지지 않음(${els.length})`);
      for (const el of els) {
        if (!hit(el)) out.push(`${name} ${el.textContent.trim() || el.tagName} 가림`);
        if (el.matches('button') && el.getBoundingClientRect().height < 43.5) out.push(`${name} ${el.textContent.trim()} 높이 ${Math.round(el.getBoundingClientRect().height)}px`);
      }
      const tb = t.getBoundingClientRect(); if (tb.bottom > b.bottom + 1) out.push(`${name} 칸 아래 ${Math.round(tb.bottom - b.bottom)}px 잘림`);
    }
    return out;
  });
  const battleClick = async (page, sel) => { const r = await page.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return null; const q = b.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height / 2, e = document.elementFromPoint(x, y); return e && (e === b || b.contains(e)) ? { x, y } : null; }, sel); if (!r) return `「${sel}」 못 누름`; await page.mouse.click(r.x, r.y); return ''; };
  for (const [vp, gl] of [[{ width: 1920, height: 1080 }, true], [{ width: 1440, height: 900 }, true], [{ width: 1366, height: 768 }, true], [{ width: 1280, height: 800 }, true], [{ width: 1024, height: 768 }, true], [{ width: 1024, height: 768 }, false]]) {
    const where = `${u} 대결 ${vp.width}×${vp.height}${gl ? '' : ' 2D'}`; console.log(`  · ${where.slice(u.length + 1)}`);
    let br2 = null, page, errs;
    if (gl) ({ page, errs } = await open(vp, `#/${u}/lab-class/teach/${n}`));
    else { br2 = await chromium.launch({ args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis'] }); page = await br2.newPage({ viewport: vp }); errs = []; page.on('pageerror', (e) => errs.push(e.message)); await page.goto(BASE + `#/${u}/lab-class/teach/${n}`, { waitUntil: 'networkidle' }); }
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /배틀/ }).first().click();
    await page.waitForFunction(() => document.querySelectorAll('.mb-team [data-act=record]').length === 2, null, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    checks += 2;
    let bad = await battleAudit(page);
    if (bad.length) fail(where, `처음 화면: ${bad.join(', ')}`);
    const miss = [];
    for (const t of [0, 1]) {
      const T = `[data-mb-team="${t}"]`;
      for (const f of [0, 2]) {
        miss.push(await battleClick(page, `${T} [data-flip="${f}"]`));
        await page.waitForFunction((T) => /뒤집었어요/.test(document.querySelector(T + ' [data-r=tip]')?.textContent || ''), T, { timeout: 15000 }).catch(() => miss.push(`${t + 1}팀 뒤집기 안 끝남`));
        await page.evaluate((T) => { document.querySelector(T + ' [data-r=tip]').textContent = ''; }, T);
      }
      miss.push(await battleClick(page, `${T} [data-act=record]`)); await page.waitForTimeout(400);
      if (await page.locator(`[data-mb-pick="${t}"] option[value="0"]`).count()) await page.selectOption(`[data-mb-pick="${t}"]`, '0'); else miss.push(`${t + 1}팀 기록이 안 들어감`);
      await page.waitForTimeout(200); miss.push(await battleClick(page, `[data-mb-submit="${t}"]`)); await page.waitForTimeout(500);
    }
    miss.push(await battleClick(page, '[data-mb-mark="0:O"]'), await battleClick(page, '[data-mb-mark="1:X"]'));
    if (miss.filter(Boolean).length) fail(where, `실제 클릭 실패: ${miss.filter(Boolean).join(', ')}`);
    bad = await battleAudit(page);
    if (bad.length) fail(where, `두 팀 확정 뒤: ${bad.join(', ')}`);
    await shot(page, `${u}-대결 ${vp.width}${gl ? '' : ' 2D'}`);
    await done(where, page, errs); if (br2) await br2.close();
  }
  const gl0 = await chromium.launch({ args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis'] });
  for (const [name, vp, touch] of [['2D 대체(PC)', { width: 1280, height: 860 }], ['2D 대체(폰)', { width: 390, height: 844 }, true]]) {
    const where = `${u} ${name}`; console.log(`  · ${name}`);
    const page = await gl0.newPage({ viewport: vp, hasTouch: !!touch }), errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(BASE + labPath(u), { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    checks++;
    if (!(await page.locator('.lab3d--ring-tower .rt2-svg').count())) {
      const leak = await page.evaluate(() => [document.querySelector('[data-r=floating]')?.textContent, document.querySelector('[data-r=height]')?.textContent, document.querySelector('[data-act=record]')?.disabled, [...document.querySelectorAll('[aria-label]')].filter((e) => /윗면 [NS]극/.test(e.getAttribute('aria-label'))).length]);
      fail(where, `WebGL을 껐는데 새 2D 실험실이 아님 — 첫 화면 떠 있는 층 ${leak[0]} · 높이 ${leak[1]} · 적기 ${leak[2] ? '잠김' : '열림'} · 극 읽어 주기 ${leak[3]}개`);
      await done(where, page, errs); continue;
    }
    await ringFlow(where, page, { strict: !touch });
    await shot(page, `${u}-${name}`);
    await done(where, page, errs);
  }
  await gl0.close();
}

// 물의 상태 변화 시험관 실험(2026-10-15 지시서): 예상 → 빨간 선·저울·적기 → 얼리기 → 파란 선 → 저울(닦기 전 더 무거움, 적기 잠김) → 닦기 → 적기
// → 녹이기 → 자로 재기 → 닦기 → 저울 → 적기 → 비교. 고치기 전 실패(세 번째 기록이 사라짐 · 「표에 적기」 가림 · 재기 전 결론 문장 · 저울 0 g인데 화면 120 g)를 다시 잡는다.
const tubeState = (page) => page.evaluate(() => {
  const host = document.querySelector('.lab3d--tube'), q = (s) => host?.querySelector(s);
  return { ph: host?.dataset.phase, lcd: host?.dataset.lcd, h: q('[data-r=h]')?.textContent, m: q('[data-r=m]')?.textContent, tip: q('[data-r=tip]')?.textContent || '',
    busy: !!q('[data-act=step]') && q('[data-act=step]').disabled && q('[data-act=record]').disabled && host.dataset.phase !== 'compare' && host.dataset.phase !== 'predict',
    rec: q('[data-act=record]')?.disabled, rows: [...document.querySelectorAll('.ft-table tbody tr')].map((r) => [...r.cells].slice(1).map((c) => c.textContent)), card: q('.ft-card:not([hidden])')?.textContent || '' };
});
// 결론(높이가 올라감·무게가 같음)을 말하는 문장 — 비교 단계 전에는 안내 줄에 나오면 안 된다
const VERDICT = /높아졌|올라갔|올라왔|늘어났|그대로예요|그대로였|같아요|같았|돌아왔/;
async function tubeFlow(where, page, { strict, scope = '' }) {
  const S = (sel) => `${scope} ${sel}`.trim();
  const press = async (sel, label) => {
    let why = await pressAt(page, S(sel));
    if (why && !strict) { await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), S(sel)); await page.waitForTimeout(150); why = await pressAt(page, S(sel)); }   // 폰: 사람처럼 가운데로 올려 누른다
    if (why) { fail(where, `「${label}」을 스크롤 없이 누를 수 없음 — ${why}`); await page.locator(S(sel)).first().click(); }
  };
  const settle = () => page.waitForFunction((sc) => { const h = document.querySelector(`${sc} .lab3d--tube`.trim()); if (!h) return true; const a = h.querySelector('[data-act=step]'), r = h.querySelector('[data-act=record]'); return h.dataset.phase === 'compare' || !a.disabled || !r.disabled; }, scope, { timeout: 25000 }).catch(() => {});
  const consistent = async (tag) => { const s = await tubeState(page); checks++; if (s.m !== '?' && s.m !== s.lcd) fail(where, `${tag}: 무게 칸 ${s.m}인데 저울은 ${s.lcd}`); return s; };
  let s = await tubeState(page);
  checks += 3;
  if (!s.ph) { fail(where, '시험관 실험실이 뜨지 않음'); return; }
  if (s.h !== '?' || s.m !== '?' || !s.rec || VERDICT.test(s.tip)) fail(where, `첫 화면에 값·결론이 보임(${JSON.stringify(s)})`);
  if (strict) for (const sel of ['[data-act=step]', '[data-ph="1"]', '[data-pm="1"]']) {
    const hid = await page.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return '없음'; const q = b.getBoundingClientRect(), y = q.top + q.height / 2; if (y > innerHeight || y < 0) return `화면 밖(y ${Math.round(y)})`; const e = document.elementFromPoint(q.left + q.width / 2, y); return e && e.closest(sel) === b ? '' : (e?.closest('.bottom') ? '하단 막대' : (e?.className || '없음')); }, S(sel));
    if (hid) fail(where, `첫 화면에서 「${sel}」이 가려짐 — ${hid}`);
  }
  const y0 = await page.evaluate(() => scrollY);
  await press('[data-ph="0"]', '높이 예상'); await press('[data-pm="1"]', '무게 예상'); await press('[data-act=step]', '예상하고 시작'); await settle();
  const expect = [['mark1', 'step', '빨간 선 긋기'], ['weigh1', 'step', '저울에 올리기'], ['rec1', 'record', '표에 적기 ①'], ['freeze', 'step', '얼리기'], ['mark2', 'step', '파란 선 긋기'], ['weigh2', 'step', '저울에 올리기 ②'],
    ['wipe2', 'step', '수건으로 닦기'], ['rec2', 'record', '표에 적기 ②'], ['melt', 'step', '녹이기'], ['read3', 'step', '자로 높이 재기'], ['wipe3', 'step', '수건으로 닦기 ③'], ['weigh3', 'step', '저울에 올리기 ③'], ['rec3', 'record', '표에 적기 ③']];
  for (const [ph, act, label] of expect) {
    s = await tubeState(page);
    if (s.ph !== ph) { fail(where, `단계가 ${ph}가 아니라 ${s.ph}`); return; }
    checks++;
    if (ph !== 'rec3' && VERDICT.test(s.tip + s.card)) fail(where, `${ph}: 비교 전에 결론 문장이 나옴 — 「${s.tip}」`);
    if (ph === 'mark2' && s.h !== '?') fail(where, `얼린 뒤 선을 긋기 전에 높이가 보임(${s.h})`);
    if (ph === 'wipe2') { checks++; if (!s.rec || s.m !== '33.1') fail(where, `닦기 전 저울(${s.m} g)에서 「표에 적기」가 ${s.rec ? '잠김' : '열려 있음'} — 33.1 g · 잠김이어야 함`); }
    await press(`[data-act=${act}]`, label); await settle();
    await consistent(label);
  }
  s = await tubeState(page);
  checks += 2;
  const want = [['4.0', '32.5'], ['4.4', '32.5'], ['4.0', '32.5']];
  if (JSON.stringify(s.rows) !== JSON.stringify(want)) fail(where, `세 기록이 따로 남지 않음 — ${JSON.stringify(s.rows)}`);
  if (s.ph !== 'compare' || !/4\.0 → 4\.4 → 4\.0/.test(s.card) || !/모형 값/.test(s.card)) fail(where, `비교 카드가 기록에서 나오지 않음(${s.ph} · ${s.card.slice(0, 60)})`);
  if (strict) {   // 실험하는 동안 페이지가 밀려 시험관(캔버스 위쪽)이 머리띠 밑으로 들어가면 안 된다
    checks++; const m = await page.evaluate((sc) => ({ dy: scrollY, top: document.querySelector(`${sc} .lab3d--tube > canvas, ${sc} .lab3d--tube > .ft2-svg`.trim()).getBoundingClientRect().top }), scope);
    if (m.top < 40) fail(where, `실험하는 동안 페이지가 ${Math.round(m.dy - y0)}px 밀려 실험대 위쪽이 가림(캔버스 위 ${Math.round(m.top)}px)`);
  }
  if (strict) {   // 비교 단계: 추가 탐구·처음부터가 스크롤 없이 보이고 눌린다
    for (const sel of ['[data-act=extra]', '[data-act=restart]']) { checks++; const hid = await page.evaluate((sel) => { const b = document.querySelector(sel); if (!b || b.hidden) return '없음'; const q = b.getBoundingClientRect(), y = q.top + q.height / 2; if (y > innerHeight || y < 0) return `화면 밖(y ${Math.round(y)})`; const e = document.elementFromPoint(q.left + q.width / 2, y); return e && e.closest(sel) === b ? '' : (e?.closest('.bottom') ? '하단 막대' : (e?.className || '없음')); }, S(sel)); if (hid) fail(where, `비교 단계에서 「${sel}」이 가려짐 — ${hid}`); }
  }
  await shot(page, `${where.replace(/[^\w가-힣× ]/g, '')}-비교`);
  await press('[data-act=restart]', '처음부터');
  s = await tubeState(page);
  checks++;
  if (s.ph !== 'predict' || s.h !== '?' || s.m !== '?' || s.rows.some((r) => r.join() !== '—,—')) fail(where, `「처음부터」 뒤 표·값이 비지 않음(${JSON.stringify(s)})`);
}
async function tubeClicks(u) {
  for (const vp of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 1280, height: 860 }]) {
    const where = `${u} 실제 클릭 ${vp.width}×${vp.height}`; console.log(`  · ${where.slice(u.length + 1)}`);
    const { page, errs } = await open(vp, `#/${u}/2/lab`); await page.waitForFunction(() => document.querySelector('.lab3d--tube canvas'), null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(1500);
    await shot(page, `${u}-첫 화면 ${vp.width}`);
    await tubeFlow(where, page, { strict: true });
    await done(where, page, errs);
  }
  for (const [name, vp] of [['폰 세로', { width: 390, height: 844 }], ['폰 가로', { width: 844, height: 390 }]]) {
    const where = `${u} ${name}`; console.log(`  · ${name}`);
    const { page, errs } = await open(vp, `#/${u}/2/lab`, { touch: true }); await page.waitForTimeout(3000);
    await tubeFlow(where, page, { strict: false });
    await done(where, page, errs);
  }
  // 덱(가르치기): 전자칠판 1920×1080 · 노트북 · 4:3 — 교사가 한 단계씩 눌러 연다. 전자칠판은 전체 화면에서도.
  const n = await labSlide(u);
  for (const [vp, full] of [[{ width: 1920, height: 1080 }, false], [{ width: 1366, height: 768 }, false], [{ width: 1024, height: 768 }, false], [{ width: 1920, height: 1080 }, true]]) {
    const where = `${u} 덱 ${vp.width}×${vp.height}${full ? ' 전체 화면' : ''}`; console.log(`  · ${where.slice(u.length + 1)}`);
    const { page, errs } = await open(vp, `#/${u}/lab-class/teach/${n}`); await page.waitForTimeout(3500);
    if (full) { await page.click('.fl-open'); await page.waitForTimeout(1200); }
    await shot(page, `${u}-덱 ${vp.width}${full ? ' 전체' : ''} 첫 화면`);
    await tubeFlow(where, page, { strict: !full });
    await done(where, page, errs);
  }
  // 추가 탐구(병) ↔ 시험관: 기록이 섞이지 않고 돌아오면 시험관 기록이 그대로
  {
    const where = `${u} 추가 탐구`; console.log('  · 추가 탐구');
    const { page, errs } = await open({ width: 1440, height: 900 }, `#/${u}/2/lab`); await page.waitForTimeout(3000);
    await page.evaluate(() => { for (const b of document.querySelectorAll('.rt-opt')) if (/올라간다|그대로다/.test(b.textContent)) b.click(); });
    await page.evaluate(() => { const r = window.matchMedia; window.matchMedia = (q) => (/reduced-motion/.test(q) ? { matches: true, addEventListener() {}, removeEventListener() {} } : r(q)); });
    for (let i = 0; i < 20; i++) { const ph = await page.evaluate(() => document.querySelector('.lab3d--tube')?.dataset.phase); if (ph === 'compare') break; await page.evaluate(() => { const h = document.querySelector('.lab3d--tube'), a = h.querySelector('[data-act=step]'), r = h.querySelector('[data-act=record]'); (!r.disabled ? r : a).click(); }); await page.waitForTimeout(600); }
    await page.click('[data-act=extra]'); await page.waitForTimeout(2500);
    checks += 2;
    if (!(await page.locator('.lab3d--bottle').count()) || !(await page.locator('[data-act=back]').count())) fail(where, '추가 탐구(병 실험)가 열리지 않음');
    await shot(page, `${u}-추가 탐구`);
    await page.click('[data-act=back]'); await page.waitForTimeout(2500);
    const rows = await page.evaluate(() => [...document.querySelectorAll('.ft-table tbody tr[data-row]')].length);
    if (rows !== 3) fail(where, `시험관으로 돌아오니 기록이 ${rows}줄`);
    await done(where, page, errs);
  }
  // 두 팀 배틀은 병 실험 그대로(배틀 문제가 병 기록에 묶여 있다) — 병 실험이 뜨고, 얼리는 동안 결론을 먼저 말하지 않는지
  {
    const where = `${u} 대결`; console.log('  · 대결(병)');
    const { page, errs } = await open({ width: 1440, height: 900 }, `#/${u}/lab-class/teach/${n}`); await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /배틀/ }).first().click(); await page.waitForTimeout(800);
    for (const i of [0, 1]) { await page.selectOption(`[data-lb-predict="${i}"]`, '1'); await page.click(`[data-lb-lock="${i}"]`); }
    await page.waitForFunction(() => document.querySelectorAll('.dk-lab-battle .lab3d--bottle').length === 2, null, { timeout: 30000 }).catch(() => {});
    checks += 2;
    if ((await page.locator('.dk-lab-battle .lab3d--bottle').count()) !== 2 || (await page.locator('.dk-lab-battle .lab3d--tube').count())) fail(where, '두 팀 실험실이 병 실험이 아님');
    await page.locator('[data-team="1"] [data-act=toggle]').click();
    await page.waitForFunction(() => /표에 적어요/.test(document.querySelector('[data-team="1"] [data-r=tip]')?.textContent || ''), null, { timeout: 15000 }).catch(() => {});
    const tip = await page.locator('[data-team="1"] [data-r=tip]').textContent();
    if (VERDICT.test(tip) || /\d+칸/.test(tip)) fail(where, `병을 얼린 뒤 안내가 결론·값을 먼저 말함 — 「${tip}」`);
    await shot(page, `${u}-대결`);
    await done(where, page, errs);
  }
  const gl0 = await chromium.launch({ args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis'] });
  for (const [name, vp, touch] of [['2D 대체(PC)', { width: 1366, height: 768 }], ['2D 대체(폰)', { width: 390, height: 844 }, true]]) {
    const where = `${u} ${name}`; console.log(`  · ${name}`);
    const page = await gl0.newPage({ viewport: vp, hasTouch: !!touch }), errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(BASE + `#/${u}/2/lab`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    checks++;
    if (!(await page.locator('.lab3d--tube .ft2-svg').count())) { fail(where, 'WebGL을 껐는데 2D 시험관 실험실이 아님'); await done(where, page, errs); continue; }
    await tubeFlow(where, page, { strict: !touch });
    await done(where, page, errs);
  }
  await gl0.close();
}

async function labSlide(u) {
  const { page } = await open({ width: 1440, height: 900 }, `#/${u}/lab-class/teach/1`);
  await page.locator('.dk-foot').waitFor();
  const total = await page.locator('.dk-foot span:last-child').evaluate(e => Number(e.textContent.split('/')[1]));
  let found = 0;
  for (let i = 1; i <= total && !found; i++) {
    await page.evaluate((h) => { location.hash = h; }, `#/${u}/lab-class/teach/${i}`);
    await page.waitForFunction(n => document.querySelector('.dk-foot span:last-child')?.textContent.trim().startsWith(n + ' /'), i);
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
    ['5단계 실험(PC)', { width: 1280, height: 860 }, labPath(u)],
    ['5단계 실험(폰)', { width: 390, height: 844 }, labPath(u), true],
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
      if (u === 's41-u01') {
        // 2026-10-13 재설계: 예상 전에는 답을 보이지 않는다 → 고르고 예상 → 뒤집기 → 적어야 잰 값·극이 나온다.
        checks += 4;
        const val = (r) => page.locator(`[data-r="${r}"]`).first().textContent();
        const early = await page.evaluate(async () => { const { Stage } = await import('/science-lab/engine.js'); const s = [...Stage.live][0]; let n = 0; s.root.traverseVisible((o) => { if (o.isSprite && o.material?.map && o.parent?.parent?.userData?.top !== undefined) n++; }); return n; });
        if ((await val('floating')) !== '?' || (await val('height')) !== '?' || !(await page.locator('[data-act="record"]').isDisabled()) || await page.locator('[data-act="inspect-pair"]').isVisible() || early)
          fail(where, '첫 화면(예상 전)에 잰 값·극 표·기록 단추가 열려 있음 — 답이 먼저 보임');
        await page.locator('[data-flip="1"]').click(); await page.waitForTimeout(400);
        if (!(await page.locator('.rt-card [data-pred]').count())) fail(where, '고리를 고르면 「어디가 뜰까?」 예상 고르기가 떠야 함');
        await page.locator('[data-act="flip-sel"]').click(); await page.waitForTimeout(3600);
        if (await page.locator('[data-act="record"]').isDisabled()) fail(where, '뒤집어 내려앉은 뒤에도 「표에 적기」가 열리지 않음');
        await page.locator('[data-act="record"]').click(); await page.waitForTimeout(700);
        if ((await val('floating')) !== '2' || (await val('height')) !== '5.3' || (await val('facing')) !== 'N ↔ N') fail(where, `적은 뒤 공개된 값이 모델과 다름(${await val('floating')}곳 · ${await val('height')}칸 · ${await val('facing')})`);
        await page.locator('[data-act="inspect-pair"]').click();
        if ((await val('pair')) !== '2·3번 사이의 극 ↻' || (await val('facing')) !== 'S ↔ S') fail(where, '다음 고리 사이로 옮겨도 마주 보는 극이 갱신되지 않음');
        await page.evaluate(() => { const s = document.scrollingElement; s.scrollTop = 0; });
      }
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
  if (u === 's41-u01') await ringTowerClicks(u);
  if (u === 's41-u02') await tubeClicks(u);
  // 전체 화면(PC·폰 가로·덱): 조작판이 옆에 붙어 캔버스 비율이 크게 바뀐다.
  // 덱은 실험 칸 규칙(캔버스 높이 36cqw !important·격자)이 전체 화면에 남아 아래 절반이 비었던 적이 있다(2026-10-06) → 화면을 채우는지도 잰다
  for (const [name, vp, touch, hash] of [['전체 화면(PC)', { width: 1280, height: 760 }], ['전체 화면(폰 가로)', { width: 844, height: 390 }, true], ['전체 화면(덱)', { width: 1440, height: 900 }, false, n ? `#/${u}/lab-class/teach/${n}` : null]]) {
    const where = `${u} ${name}`; console.log(`  · ${name}`);
    if (name === '전체 화면(덱)' && !hash) continue;
    const { page, errs } = await open(vp, hash || labPath(u), { touch });
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
    if (u === 's41-u01') {   // 좁은 옆 조작판에서 번호 단추 글자가 넘치거나 겹치지 않게(2026-10-13 한 줄 배치가 전체 화면에도 걸렸다)
      checks++;
      const over = await page.evaluate(() => [...document.querySelectorAll('.full-land .rt-flip, .fl-panel .rt-flip, .full-land [data-act=record], .fl-panel [data-act=record]')].filter((b) => b.offsetWidth && b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim()));
      if (over.length) fail(where, `조작판 단추 글자가 넘침: ${over.join(', ')}`);
    }
    await shot(page, `${u}-${name}`);
    await done(where, page, errs);
  }
}

await browser.close(); server.close();
console.log(`\n검사 ${checks}건 · 실패 ${fails.length}건`);
if (fails.length) { console.log(fails.map((f) => '  - ' + f).join('\n')); process.exit(1); }
