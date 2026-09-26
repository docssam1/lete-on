#!/usr/bin/env node
/* ============================================================
   수의 마법 쇼릴 — 장면 찍기 (2026-09-26, 원장 "다 진행 후 우리 쇼릴도 만들자")
   swiftshader 는 3D 를 실시간으로 못 그리므로(마을 <1fps) 가짜 시계로 1/30초씩 밀며 한 장씩 찍는다(lib.js).
   장면마다 중간 영상 seg-<이름>.mp4(1920×1080·30fps, 무손실에 가까운 crf 14)를 만든다 → compose.js 가 잇는다.

     node scripts/showreel/capture.js                       # 전 장면 (한 시간 남짓)
     node scripts/showreel/capture.js village story         # 골라서
     node scripts/showreel/capture.js --out=/tmp/reel       # 출력 폴더(기본 OS 임시/nm-showreel)
     SR_FPS=10 node scripts/showreel/capture.js road        # 동선만 빨리 확인(10fps)

   장면(v2 순서): title · philosophy(about.html) · village · story · road · pace · notify · hero-M-14/19/80 · sheetsSrc → creative · sheets · end
   다 찍은 뒤: node scripts/showreel/compose.js --out=<같은 폴더> [--voice=omnivoice|ko-KR-Chirp3-HD-Leda] [--dry] [--no-bed]
     → numbers-of-magic-showreel-v2.mp4 · -v2-voiceonly.mp4 · numbers-of-magic-preview-10s.mp4 · numbers-of-magic-contact-sheet.png
   목소리를 바꿀 때는 compose.js 만 다시 돌린다(장면 길이는 내레이션 파일 길이로 다시 정해진다).
   ffmpeg 는 libx264 가 든 것(FFMPEG=경로, 기본은 이 세션의 imageio_ffmpeg 바이너리). 만든 영상·프레임은 저장소에 넣지 않는다.
   파일: lib.js(서버·가짜 시계·인코더·글꼴) · caption.html(자막 PNG) · stage-hero/sheets/creative/notify.html · endcard.html · ambient-bed.py(배경 소리)
   앱 코드는 건드리지 않는다. 마을 카메라만은 찍는 동안에 한해 town3d.js 응답 끝의 ctl 을 window 에 걸어 쓴다(route).
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const L = require('./lib');
const FPS = +(process.env.SR_FPS || L.FPS);
const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(os.tmpdir(), 'nm-showreel');
fs.mkdirSync(OUT, { recursive:true });
const W = 1920, H = 1080, CW = 1280, CH = 720, DPR = 1.5;   /* CSS 1280×720 배치를 1.5배로 = 1920×1080 */
/* 유닛 → 찍기 시작하는 장면 시각(초). 한 바퀴 중 움직임이 가장 잘 보이는 대목부터 */
const HEROES = { 'M-14':2.6, 'M-19':0.9, 'M-80':2.2, 'M-73':1.5, 'M-86':0.8 };   /* v2 릴은 앞의 셋만 쓴다(compose.js) */

/* ---------- 공용: 커서·탭 물결(찍는 동안에만 문서에 얹는 DOM) ---------- */
async function cursorInit(page){
  await page.evaluate(() => {
    if(document.getElementById('__srCur')) return;
    const c = document.createElement('div'); c.id = '__srCur';
    c.innerHTML = '<svg width="30" height="36" viewBox="0 0 34 40"><path d="M4 2.5 L4 31 L11.5 24.8 L16.6 36.2 L22.3 33.7 L17.1 22.6 L27 22.6 Z" fill="#fff" stroke="#26304a" stroke-width="2.4" stroke-linejoin="round"/></svg>';
    c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;filter:drop-shadow(0 5px 7px rgba(20,30,60,.35));transform:translate(-200px,-200px);opacity:0';
    const r = document.createElement('div'); r.id = '__srRip';
    r.style.cssText = 'position:fixed;left:0;top:0;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;border:3px solid rgba(201,164,76,.95);box-shadow:0 0 22px rgba(185,167,255,.85),inset 0 0 14px rgba(143,227,210,.6);pointer-events:none;z-index:2147483646;opacity:0';
    document.documentElement.append(r, c);
  });
}
function mkCursor(){
  const st = { x:-200, y:-200, op:0, mv:null, fade:null, rip:null };
  return {
    st,
    at(x, y){ st.x = x; st.y = y; st.mv = null; },
    move(t, x, y, dur = 0.8){ st.mv = { t0:t, dur, fx:st.x, fy:st.y, tx:x, ty:y }; },
    show(t, on, dur = 0.35){ st.fade = { t0:t, dur, from:st.op, to:on ? 1 : 0 }; },
    tap(t){ st.rip = { t0:t, x:st.x, y:st.y }; },
    state(t){
      if(st.mv){ const u = L.ease((t - st.mv.t0) / st.mv.dur); st.x = L.lerp(st.mv.fx, st.mv.tx, u); st.y = L.lerp(st.mv.fy, st.mv.ty, u); if(u >= 1) st.mv = null; }
      if(st.fade){ const u = Math.min(1, (t - st.fade.t0) / st.fade.dur); st.op = L.lerp(st.fade.from, st.fade.to, u); if(u >= 1) st.fade = null; }
      let rip = null;
      if(st.rip){ const u = (t - st.rip.t0) / 0.6; if(u >= 1) st.rip = null; else rip = { x:st.rip.x, y:st.rip.y, s:0.35 + 1.05 * L.ease(u), o:1 - u }; }
      const press = st.rip ? Math.max(0, 1 - Math.abs((t - st.rip.t0) - 0.06) / 0.12) : 0;
      return { x:st.x, y:st.y, o:st.op, rip, press };
    },
  };
}
async function paintCursor(page, s){
  await page.evaluate(s => {
    const c = document.getElementById('__srCur'), r = document.getElementById('__srRip');
    if(!c) return;
    c.style.opacity = s.o; c.style.transform = `translate(${s.x - 4}px,${s.y - 2}px) scale(${1 - 0.12 * s.press})`;
    if(s.rip){ r.style.opacity = s.rip.o; r.style.transform = `translate(${s.rip.x}px,${s.rip.y}px) scale(${s.rip.s})`; } else r.style.opacity = 0;
  }, s);
}
const center = async (page, sel, dy = 0) => page.evaluate(([sel, dy]) => {
  const e = typeof sel === 'string' ? document.querySelector(sel) : null; if(!e) return null;
  const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2 + dy];
}, [sel, dy]);

/* 한 장면 돌리기: dur 초 동안 매 프레임 (events → perFrame → 시간 1/FPS → rAF → 커서 → 캡처) */
async function runScene(name, page, { dur, events = [], perFrame, cursor }){
  const cdp = await page.context().newCDPSession(page);
  const enc = L.encoder(path.join(OUT, `seg-${name}.mp4`), W, H, FPS);
  const n = Math.round(dur * FPS), step = 1000 / FPS;
  const evs = events.slice().sort((a, b) => a[0] - b[0]);
  const t0 = Date.now();
  for(let i = 0; i < n; i++){
    const t = i / FPS;
    while(evs.length && evs[0][0] <= t + 1e-6){ const [, fn] = evs.shift(); await fn(t); }
    if(perFrame) await perFrame(t);
    await page.clock.runFor(step);
    await page.evaluate(s => window.__srFlush && window.__srFlush(s), step);
    if(cursor) await paintCursor(page, cursor.state(t));
    const r = await cdp.send('Page.captureScreenshot', { format:'jpeg', quality:94 });
    await enc.push(Buffer.from(r.data, 'base64'));
    if(i % 30 === 29) process.stdout.write(`  ${name} ${i + 1}/${n}  ${((Date.now() - t0) / (i + 1) / 1000).toFixed(2)}s/f\n`);
  }
  await enc.close();
  if(page.__errs.length) console.log(`  (${name} 페이지 오류) ` + page.__errs.slice(0, 3).join(' | '));
  console.log(`✓ seg-${name}.mp4  ${n} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
/* 가상 시간을 조건이 설 때까지 민다(찍지 않음) */
async function until(page, fn, arg, maxMs = 60000, step = 100){
  for(let t = 0; t < maxMs; t += step){
    if(await page.evaluate(fn, arg)) return true;
    await L.advance(page, step, step);
    await new Promise(r => setTimeout(r, 30));   /* 모듈·글꼴 로딩(실시간)에 틈을 준다 */
  }
  throw new Error('시간 초과: ' + fn.toString().slice(0, 80));
}

/* 앱 열기(타이틀) — 필요하면 모드 버튼까지 */
async function openApp(browser, base, btn, state){
  const { ctx, page } = await L.newPage(browser, { w:CW, h:CH, dpr:DPR, state:state || L.STATE });
  /* 찍는 동안에만: 3D 마을 ctl 을 window.__srTown 에 건다(카메라를 천천히 움직이려고). 앱 파일은 그대로. */
  await ctx.route(/\/number_magic\/app\/town3d\/town3d\.js/, async route => {
    const src = fs.readFileSync(path.join(L.APP, 'app/town3d/town3d.js'), 'utf8').replace('  return {\n    dispose,\n    setLang(l){ lang', '  return window.__srTown = {\n    dispose,\n    setLang(l){ lang');
    await route.fulfill({ status:200, body:src, headers:{ 'content-type':'text/javascript' } });
  });
  await L.virtualTime(page);
  await page.goto(base + '/number_magic/index.html?enter=1');
  await until(page, () => !!document.querySelector('.nm-title3d .t3d-btn') && document.querySelector('.nm-title3d').style.visibility !== 'hidden', null, 90000);
  await L.advance(page, 1500, 100);
  if(btn){ await page.evaluate(b => document.getElementById(b).click(), btn); }
  await cursorInit(page);
  return { ctx, page };
}

const SCENES = {
  /* 1. 타이틀 책상 — 반짝임, 커서가 '이어서 모험'에 올라간다 */
  async title(browser, base){
    const { ctx, page } = await openApp(browser, base);
    const cur = mkCursor(); cur.at(980, 640);
    const cont = await center(page, '.t3d-btn[data-id="continue"]');
    await runScene('title', page, { dur:6.6, cursor:cur, events:[
      [1.6, t => { cur.show(t, true); cur.move(t, cont[0] + 30, cont[1] + 8, 1.5); }],
      [3.1, async () => { await page.evaluate(() => document.querySelector('.t3d-btn[data-id="continue"]').dispatchEvent(new PointerEvent('pointerenter'))); }],
    ] });
    await ctx.close();
  },

  /* 2. 3D 마을 — 넓게 → 아이가 광장에서 걸어가고 카메라가 다가감 → 독쌤을 누르면 말풍선 + 손 흔들기 */
  async village(browser, base){
    const { ctx, page } = await openApp(browser, base, 'ttGame');
    await until(page, () => !!(window.__srTown && document.querySelector('#townVp.is-3d')), null, 120000);
    await L.advance(page, 2500, 100);
    const cam = () => page.evaluate(() => { const c = window.__srTown.debug.cam; return { x:c.x, z:c.z, d:c.d }; });
    const c0 = await cam();
    const setCam = (o) => page.evaluate(o => { const d = window.__srTown.debug; if(o.x != null){ d.cam.x = o.x; d.cam.z = o.z; } d.cam.d = o.d; d.placeCam(); }, o);
    /* 월드 → 화면(css px) */
    const proj = (x, y, z) => page.evaluate(([x, y, z]) => { const d = window.__srTown.debug, c = d.camera, cv = d.renderer.domElement.getBoundingClientRect();
      const v = new c.position.constructor(x, y, z).project(c); return [cv.left + (v.x * 0.5 + 0.5) * cv.width, cv.top + (-v.y * 0.5 + 0.5) * cv.height]; }, [x, y, z]);
    const docPos = () => page.evaluate(() => { const d = window.__srTown.debug; const ch = d.chars.find(c => c.def && c.def.id === 'doc');
      const o = ch.model ? ch.model.object || ch.model.group || ch.model.root : ch.spr; const p = o.getWorldPosition(new o.position.constructor());
      const c = d.camera, cv = d.renderer.domElement.getBoundingClientRect(); const v = p.clone(); v.y += ch.model ? 0.9 : 0.6; v.project(c);
      return [cv.left + (v.x * 0.5 + 0.5) * cv.width, cv.top + (-v.y * 0.5 + 0.5) * cv.height]; });
    const cur = mkCursor(); cur.at(1180, 690);
    let walking = false, tgt = null;
    const A = { x:c0.x, z:c0.z, d:c0.d }, B = { x:c0.x + 2.2, z:c0.z + 2.4, d:c0.d * 0.84 };
    /* v2(2026-09-26): 9.6초로 줄임 — 0.3 커서 → 1.35 땅 누르기(걷기) → 5.2 독쌤 누르기(말풍선·손 흔들기) */
    await runScene('village', page, { dur:9.6, cursor:cur,
      perFrame: async t => {
        if(!walking){ const u = L.ease(t / 2.6); await setCam({ x:L.lerp(A.x, B.x, u), z:L.lerp(A.z, B.z, u), d:L.lerp(A.d, B.d, u) }); }
        else { const u = L.ease((t - 1.35) / 4.6); const w = L.ease(t / 2.6);
          await setCam({ d:L.lerp(L.lerp(A.d, B.d, w), c0.d * 0.5, u) }); }
      },
      events:[
        [0.2, async t => { tgt = await proj(4.3, 0.6, -2.3); cur.show(t, true); cur.move(t, tgt[0], tgt[1], 1.0); }],
        [1.35, async t => { tgt = await proj(4.3, 0.6, -2.3); cur.at(tgt[0], tgt[1]); cur.tap(t); await page.mouse.move(tgt[0], tgt[1]); await page.mouse.down(); await page.mouse.up(); walking = true; }],
        [1.7, async t => { cur.move(t, cur.st.x + 140, cur.st.y + 90, 1.2); }],
        [4.3, async t => { const p = await docPos(); cur.move(t, p[0], p[1], 0.8); }],
        [5.2, async t => { const p = await docPos(); cur.at(p[0], p[1]); cur.tap(t); await page.mouse.move(p[0], p[1]); await page.mouse.down(); await page.mouse.up(); }],
        [5.8, async t => { cur.move(t, cur.st.x + 120, cur.st.y + 130, 1.1); }],
        [8.2, t => cur.show(t, false, 0.6)],
      ] });
    await ctx.close();
  },

  /* v3 인트로 뒤 — 영상이 걷히면 3D 마을 지도가 드러난다: 광장 가까이에서 마을 전체로 천천히 물러나는 한 컷(커서 없음) */
  async mapreveal(browser, base){
    const { ctx, page } = await openApp(browser, base, 'ttGame');
    await until(page, () => !!(window.__srTown && document.querySelector('#townVp.is-3d')), null, 120000);
    await L.advance(page, 2500, 100);
    const c0 = await page.evaluate(() => { const c = window.__srTown.debug.cam; return { x:c.x, z:c.z, d:c.d }; });
    await runScene('mapreveal', page, { dur:6.4, perFrame: t => { const u = L.ease(t / 6.0);
      return page.evaluate(o => { const d = window.__srTown.debug; d.cam.x = o.x; d.cam.z = o.z; d.cam.d = o.d; d.placeCam(); },
        { x:L.lerp(c0.x + 3.0, c0.x, u), z:L.lerp(c0.z + 3.2, c0.z, u), d:L.lerp(c0.d * 0.5, c0.d * 1.02, u) }); } });
    await ctx.close();
  },

  /* v3 진단하기 — 타이틀 '진단하기' → 나이 고르기 → 첫 문제 */
  async diagnose(browser, base){
    const { ctx, page } = await openApp(browser, base, 'ttDiag');
    await until(page, () => !!document.querySelector('#dgSkip'), null, 60000);
    await L.advance(page, 800, 100);
    const cur = mkCursor(); cur.at(900, 640);
    const card = () => page.evaluate(() => { const b = [...document.querySelectorAll('#screen button')].find(x => /2학년 말/.test(x.textContent)); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    await runScene('diagnose', page, { dur:5.6, cursor:cur,
      perFrame: t => page.evaluate(t => { const u = Math.max(0, Math.min(1, (t - 1.5) / 1.1)), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, S = 1 + 0.4 * e;
        document.body.style.transformOrigin = '50% 32%'; document.body.style.transform = `scale(${S})`; }, t),
      events:[
      [0.2, async t => { const p = await card(); cur.show(t, true); cur.move(t, p[0], p[1] + 6, 0.8); }],
      [1.15, async t => { cur.tap(t); await page.evaluate(() => { const b = [...document.querySelectorAll('#screen button')].find(x => /2학년 말/.test(x.textContent)); b.click(); }); }],
      [1.6, t => cur.move(t, cur.st.x + 260, cur.st.y + 120, 1.0)],
      [4.6, t => cur.show(t, false, 0.5)],
    ] });
    await ctx.close();
  },

  /* v3 창의 연산 — 유닛 C-02 '곱해서 10 만들기': 매직 랩(짝 찾기 타일)에서 곱해서 10 인 두 수를 고르고,
     마법 노트 계단식 수식으로 4×7×5 = (4×5)×7 = 20×7 = 140. 이 계단 한 줄만은 찍는 동안에 한해 첫 예(3×2×5)를
     4×7×5 로 바꿔 보여 준다(같은 유닛 ③ 에 있는 예 5×4×7→(4×5)×7=140 과 같은 계산, 앱 파일은 그대로). */
  async creative3(browser, base){
    const st = Object.assign({}, L.STATE, { progress:{ 'C-02':{ touchedAt:Date.now() } } });
    const { ctx, page } = await L.newPage(browser, { w:CW, h:CH, dpr:DPR, state:st });
    await L.virtualTime(page);
    await page.goto(base + '/number_magic/index.html?enter=1');
    await until(page, () => !!window.NM_AVATAR && !!document.getElementById('ttContinue'), null, 90000);
    /* 새 친구 도착 모달이 줄줄이 뜨지 않게 — 이미 연 것으로 해 둔다 */
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('nm_state_v1')); s.character_unlocked = s.character_unlocked || {};
      (NM_AVATAR.numbers || []).forEach(i => { s.character_unlocked['number_' + i.id] = true; }); (NM_AVATAR.symbols || []).forEach(i => { s.character_unlocked['symbol_' + i.id] = true; });
      localStorage.setItem('nm_state_v1', JSON.stringify(s)); });
    await page.reload();
    await until(page, () => !!window.NM_UNITS && !!document.getElementById('ttContinue'), null, 90000);
    await page.evaluate(() => { window.NM_UNITS['C-02'].discover.stages[0].mathSteps = ['4 × 7 × 5', '= (4 × 5) × 7', '= 20 × 7', '= 140']; });
    await L.advance(page, 1200, 100);
    await page.evaluate(() => document.getElementById('ttContinue').click());
    await until(page, () => !!document.querySelector('[data-step="lab"]'), null, 60000);
    await page.evaluate(() => document.querySelector('[data-step="lab"]').click());
    await until(page, () => document.querySelectorAll('#expr .nm-tile').length > 1, null, 60000);
    await L.advance(page, 600, 100);
    await cursorInit(page);
    await page.evaluate(() => { const st = document.createElement('style'); st.textContent = `#srFlash{position:fixed;inset:0;background:radial-gradient(circle at 50% 45%,#fff,#f6f0ff 60%,#e9fbf6);opacity:0;pointer-events:none;z-index:2147483600}
      body{transform-origin:0 0} .sr-hide{opacity:0} .nm-mstep-line,.nm-mstep-arrow{will-change:transform,opacity}`; document.head.appendChild(st);
      const f = document.createElement('div'); f.id = 'srFlash'; document.documentElement.appendChild(f); });
    /* 곱해서 10 인 두 타일(문제는 앱이 무작위로 낸다) */
    const pair = await page.evaluate(() => { const t = [...document.querySelectorAll('#expr .nm-tile')].map(e => +e.textContent);
      for(let i = 0; i < t.length; i++) for(let j = i + 1; j < t.length; j++) if(t[i] * t[j] === 10) return [i, j]; return [0, 1]; });
    const tileAt = i => page.evaluate(i => { const r = document.querySelectorAll('#expr .nm-tile')[i].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, i);
    const cur = mkCursor(); cur.at(900, 620);
    let steps = null, flashT = -9;
    await runScene('creative3', page, { dur:12.4, cursor:cur,
      perFrame: async t => {
        await page.evaluate(([t, flashT]) => { const f = document.getElementById('srFlash'); const k = (t - flashT) / 0.5; f.style.opacity = k < 0 || k > 1 ? 0 : Math.sin(Math.PI * k) * 0.95; }, [t, flashT]);
        if(steps){ await page.evaluate(([t, s]) => {
          const box = document.querySelector('.nm-mstep-box'); if(!box) return;
          const kids = [...box.children];   /* 줄·화살표 번갈아 */
          const lines = kids.filter(e => e.classList.contains('nm-mstep-line'));
          kids.forEach(e => { const li = e.classList.contains('nm-mstep-line') ? lines.indexOf(e) : lines.indexOf(e.nextElementSibling);
            const t0 = s.t0 + li * 0.62 - (e.classList.contains('nm-mstep-arrow') ? 0.15 : 0);
            const u = Math.max(0, Math.min(1, (t - t0) / 0.35)); const c = 1.7, b = 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
            e.style.opacity = u; e.style.transform = `translateY(${(1 - b) * 14}px) scale(${0.85 + 0.15 * b})`; });
          lines[1] && (lines[1].style.textShadow = t > s.t0 + 0.9 ? '0 0 14px rgba(245,217,139,.95)' : '');
          lines[3] && (lines[3].style.color = t > s.t0 + 2.2 ? '#8a6a1f' : '');
          /* 카메라: 계단 상자로 1.45배 */
          const r0 = s.r, S = 1 + 1.05 * Math.min(1, Math.max(0, (t - s.t0 + 0.4) / 0.8)) ** 0.6;
          const cx = r0[0], cy = r0[1];
          document.body.style.transform = `translate(${innerWidth / 2 - cx * S + (cx - innerWidth / 2) * 0}px,${innerHeight / 2 - cy * S}px) scale(${S})`;
        }, [t, steps]); }
      },
      events:[
        [0.2, async t => { const p = await tileAt(pair[0]); cur.show(t, true); cur.move(t, p[0], p[1] + 8, 0.7); }],
        [1.0, async t => { cur.tap(t); await page.evaluate(i => document.querySelectorAll('#expr .nm-tile')[i].click(), pair[0]); }],
        [1.1, async t => { const p = await tileAt(pair[1]); cur.move(t, p[0], p[1] + 8, 0.5); }],
        [1.7, async t => { cur.tap(t); await page.evaluate(i => document.querySelectorAll('#expr .nm-tile')[i].click(), pair[1]); }],
        [1.9, async t => { const p = await center(page, '#pick'); if(p) cur.move(t, p[0], p[1] + 6, 0.45); }],
        [2.45, async t => { cur.tap(t); await page.evaluate(() => { const b = document.getElementById('pick'); if(b && !b.disabled) b.click(); }); }],
        [3.3, t => { cur.show(t, false, 0.3); flashT = t; }],
        [3.55, async t => {
          await page.evaluate(() => document.querySelector('[data-step="discover"]').click());
          await L.advance(page, 200, 100);
          const r = await page.evaluate(() => { const b = document.querySelector('.nm-mstep-box'); let p = b.parentElement; while(p && !(p.scrollHeight > p.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(p).overflowY))) p = p.parentElement;
            if(p){ p.style.scrollBehavior = 'auto'; const q0 = b.getBoundingClientRect(); p.scrollTop += q0.top + q0.height / 2 - innerHeight * 0.55; } const q = b.getBoundingClientRect();
            [...b.children].forEach(e => { e.style.opacity = 0; }); return [q.left + q.width / 2, q.top + q.height / 2]; });
          steps = { t0:t + 0.55, r };
        }],
      ] });
    await ctx.close();
  },

  /* v3 속도 비교 진단(연산 로드맵 '속도 비교 진단' 카드, app/pace-compare.js) — 6세 · 과정 10 · 주 1회 표준.
     판정 사다리 → 언제 닿을까요 → '상위 레벨이 되려면' 속도 1.25배 '이 설정으로 바꾸기' → 판정이 KMO 로 바뀐다 */
  async compare(browser, base){
    const st = Object.assign({}, L.STATE, { placement:{ course:'C10', self:true }, schoolAge:{ entryYear:2028, setAt:Date.now() }, roadCadence:'w1', roadPace:'p2', roadSpeed:1 });
    const { ctx, page } = await openApp(browser, base, 'ttRoad', st);
    await until(page, () => !!document.querySelector('#crPaceCmp .nm-pc-apply') && !!document.querySelector('.r3d .r3d-arrow'), null, 120000);
    await L.advance(page, 1000, 100);
    const S = 1.42;
    const geo = await page.evaluate(S => { const c = document.querySelector('#crPaceCmp'); let p = c.parentElement;
      while(p && !(p.scrollHeight > p.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(p).overflowY))) p = p.parentElement;
      window.__sp = p; p.style.scrollBehavior = 'auto';
      const pr = p.getBoundingClientRect(), y = e => p.scrollTop + e.getBoundingClientRect().top - pr.top;
      const q = sel => c.querySelector(sel);
      const cr = c.getBoundingClientRect();
      const g = { top:y(c) - 10, tl:y(q('.nm-pc-tl')) - 30, up:y(q('.nm-pc-up')) - 60 };
      document.body.style.transformOrigin = '0 0';
      const cx = cr.left + cr.width / 2, cy = pr.top + (innerHeight / S) / 2;
      document.body.style.transform = `translate(${innerWidth / 2 - cx * S}px,${innerHeight / 2 - cy * S}px) scale(${S})`;
      const st = document.createElement('style'); st.textContent = '.sr-glow{box-shadow:0 0 0 3px rgba(201,164,76,.7),0 0 26px rgba(245,217,139,.9)!important;transition:none}'; document.head.appendChild(st);
      return g;
    }, S);
    await page.evaluate(y => { window.__sp.scrollTop = y; }, geo.top);
    await L.advance(page, 300, 100);
    const cur = mkCursor(); cur.at(1000, 650);
    const K = [[0, geo.top], [2.6, geo.top], [3.6, geo.tl], [5.8, geo.tl], [6.8, geo.up], [8.9, geo.up], [9.8, geo.top], [13, geo.top]];
    const scrollAt = t => { let i = 0; while(i < K.length - 2 && K[i + 1][0] <= t) i++; const a = K[i], b = K[i + 1]; return L.lerp(a[1], b[1], L.ease((t - a[0]) / (b[0] - a[0]))); };
    const pos = sel => page.evaluate(sel => { const e = document.querySelector(sel); if(!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
    const APPLY = '#crPaceCmp [data-pc-apply][data-speed="1.25"]';
    await runScene('compare', page, { dur:12.8, cursor:cur,
      perFrame: t => page.evaluate(([y, t]) => { window.__sp.scrollTop = y;
        const v = document.querySelector('#crPaceCmp .nm-pc-verdict'); if(v) v.classList.toggle('sr-glow', (t > 0.4 && t < 1.8) || t > 10.0); }, [scrollAt(t), t]),
      events:[
        [0.5, async t => { const p = await pos('#crPaceCmp .nm-pc-ladder, #crPaceCmp .nm-pc-rung'); cur.show(t, true); if(p) cur.move(t, p[0], p[1] + 10, 0.9); }],
        [2.4, t => cur.show(t, false, 0.3)],
        [6.9, async t => { const p = await pos(APPLY) || await pos('#crPaceCmp .nm-pc-apply'); cur.show(t, true); if(p) cur.move(t, p[0], p[1] + 6, 0.9); }],
        [8.1, async t => { cur.tap(t); await page.evaluate(sel => { const b = document.querySelector(sel) || document.querySelector('#crPaceCmp .nm-pc-apply'); b.click(); }, APPLY); }],
        [8.8, t => cur.show(t, false, 0.4)],
      ] });
    await ctx.close();
  },

  /* 3. 스토리 모드 — 팝업 그림책이 펼쳐지고(인트로), 장(章)을 차례로 짚는다 */
  async story(browser, base){
    const { ctx, page } = await openApp(browser, base, 'ttStory');
    await until(page, () => !!document.querySelector('.sd3 canvas.sd3-gl.on'), null, 120000, 50);
    const cur = mkCursor(); cur.at(1100, 650);
    const tags = await page.evaluate(() => document.querySelectorAll('.sd3-tag').length);
    const ev = [];
    const T0 = 3.3, DT = 0.9;
    ev.push([T0 - 1.0, async t => { const p = await center(page, '.sd3-tag'); cur.show(t, true); cur.move(t, p[0], p[1] + 6, 0.9); }]);
    for(let i = 0; i < tags; i++){
      ev.push([T0 + i * DT - 0.45, async t => { const p = await page.evaluate(i => { const r = document.querySelectorAll('.sd3-tag')[i].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2 + 6]; }, i); cur.move(t, p[0], p[1], 0.45); }]);
      ev.push([T0 + i * DT, async () => { await page.evaluate(i => { const b = document.querySelectorAll('.sd3-tag'); if(i) b[i - 1].dispatchEvent(new PointerEvent('pointerleave')); b[i].dispatchEvent(new PointerEvent('pointerenter')); }, i); }]);
    }
    ev.push([T0 + tags * DT + 0.2, t => cur.show(t, false, 0.5)]);
    await runScene('story', page, { dur:Math.max(10.6, T0 + tags * DT + 1.2), cursor:cur, events:ev });
    await ctx.close();
  },

  /* 4. 연산 로드맵 — 처음부터 길을 따라 → '지금 여기로' 한 번에 날아간다 */
  async road(browser, base){
    const { ctx, page } = await openApp(browser, base, 'ttRoad');
    await until(page, () => !!document.querySelector('.r3d .r3d-arrow'), null, 120000);
    await L.advance(page, 1500, 100);
    for(let i = 0; i < 14; i++){ await page.evaluate(() => { const a = document.querySelectorAll('.r3d-arrow')[0]; if(!a.disabled) a.click(); }); await L.advance(page, 200, 100); }
    await L.advance(page, 2500, 100);
    const cur = mkCursor(); cur.at(900, 640);
    const nextC = () => page.evaluate(() => { const a = document.querySelectorAll('.r3d-arrow'); const r = a[a.length - 1].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    const click = sel => async t => { cur.tap(t); await page.evaluate(sel => { const a = document.querySelectorAll(sel); a[a.length - 1].click(); }, sel); };
    const ev = [[0.3, async t => { const p = await nextC(); cur.show(t, true); cur.move(t, p[0], p[1], 0.8); }]];
    for(const tt of [1.2, 3.4, 5.6]) ev.push([tt, click('.r3d-arrow')]);
    ev.push([6.8, async t => { const p = await center(page, '.r3d-me'); cur.move(t, p[0], p[1], 0.7); }]);
    ev.push([7.6, click('.r3d-me')]);
    ev.push([8.3, t => { cur.move(t, cur.st.x + 160, cur.st.y + 60, 1.0); cur.show(t, false, 1.0); }]);
    await runScene('road', page, { dur:10.6, cursor:cur, events:ev });
    await ctx.close();
  },

  /* 5. 수학 이야기 3D — 유닛 하나씩(scripts/showreel/stage-hero.html) */
  async hero(browser, base, u){
    const { ctx, page } = await L.newPage(browser, { w:CW, h:CH, dpr:DPR, state:null });
    await L.virtualTime(page);
    await page.goto(`${base}/number_magic/scripts/showreel/stage-hero.html?u=${u}`);
    await until(page, () => window.__live === true || !!window.__liveErr, null, 120000, 50);
    if(await page.evaluate(() => window.__liveErr)) throw new Error(u + ' ' + await page.evaluate(() => window.__liveErr));
    await L.advance(page, Math.round((HEROES[u] || 0.6) * 1000), 100);
    await runScene('hero-' + u, page, { dur:4.1, perFrame:t => page.evaluate(t => window.__zoom && window.__zoom(t), t) });
    await ctx.close();
  },

  /* 학습지 원본 쪽 찍기(sheets·creative 공용) — ws.html 의 진짜 인쇄 쪽 PNG + Training Course 빈칸 위치(JSON) */
  async sheetsSrc(browser, base){
    const src = path.join(OUT, 'sheets-src'); fs.mkdirSync(src, { recursive:true });
    const { ctx, page } = await L.newPage(browser, { w:1100, h:1400, dpr:2.4, state:null });
    await page.goto(base + '/number_magic/ws.html?w=2026-W39&c=C21&n=%EB%AF%BC%EC%A4%80&k=1&cad=w2&auto=0', { waitUntil:'load' });
    await page.waitForTimeout(5000);
    const els = await page.$$('.nm-print-cover, .nm-w2-page, .nm-print-answer-key');
    const pick = { cover:0, concept:10, training:15, story:24, key:27 };
    for(const [k, i] of Object.entries(pick)) await els[i].screenshot({ path:path.join(src, k + '.png') });
    /* Training Course(창의 연산) 쪽의 □ 칸 — 쪽 기준 비율 좌표 */
    const boxes = await els[pick.training].evaluate(pg => { const P = pg.getBoundingClientRect();
      return [...pg.querySelectorAll('.fbox')].map(e => { const r = e.getBoundingClientRect(); return { x:(r.left - P.left) / P.width, y:(r.top - P.top) / P.height, w:r.width / P.width, h:r.height / P.height }; }); });
    fs.writeFileSync(path.join(src, 'training-boxes.json'), JSON.stringify(boxes));
    console.log(`✓ sheets-src (Training Course 칸 ${boxes.length}개)`);
    await ctx.close();
  },
  /* 6. 학습지 — 책상 위에서 천천히 훑는다(stage-sheets.html) */
  async sheets(browser, base){ await stageScene(browser, base, 'sheets', 'stage-sheets.html?src=/__sheets/', 10.8); },
  /* 창의 연산 — Training Course 칸을 손글씨로 한 칸씩 채운다(stage-creative.html) */
  async creative(browser, base){ await stageScene(browser, base, 'creative', 'stage-creative.html?src=/__sheets/', 12.6); },
  /* 7. 끝 카드 */
  async end(browser, base){ await stageScene(browser, base, 'end', 'endcard.html', 9.0); },

  /* 독쌤의 철학 — about.html 을 그대로 띄우고, 카메라로 짚으며 핵심 구절에 금빛 형광을 긋는다.
     v4: 두 장면(n02 → philosophy, n03 → philosophy2). 형광·카메라 박자는 그 줄의 길이에 비례(narrDur) — compose.js 가
     실제 목소리 길이에 맞춰 이 클립을 살짝 늘리거나 줄이므로(stretch) 목소리를 바꿔도 다시 찍지 않아도 된다. */
  async philosophy(browser, base){ await philoScene(browser, base, 'philosophy', 'n02', 1); },
  async philosophy2(browser, base){ await philoScene(browser, base, 'philosophy2', 'n03', 2); },


  /* 학습 속도 — 연산 로드맵 아래 '학습 속도' 카드에서 주 1회반→주 2회반 · 목표 빠르기 · 속도/양을 눌러 주·개월이 바뀌는 모습 */
  async pace(browser, base){
    const { ctx, page } = await openApp(browser, base, 'ttRoad');
    await until(page, () => !!document.querySelector('#crPace') && !!document.querySelector('.r3d .r3d-arrow'), null, 120000);
    await L.advance(page, 1200, 100);
    const sc = await page.evaluate(() => { const c = document.querySelector('#crPace'); let p = c.parentElement;
      while(p && !(p.scrollHeight > p.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(p).overflowY))) p = p.parentElement;
      window.__sp = p; p.style.scrollBehavior = 'auto';
      const top = p.scrollTop + c.getBoundingClientRect().top - p.getBoundingClientRect().top - 14;
      const est = document.querySelector('.nm-cr-est'); const end = p.scrollTop + est.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom + 24;
      p.scrollTop = top;
      /* 찍는 동안에만: 카드 쪽으로 1.36배 — 카드 위 끝(스크롤 상자 윗변)부터 보이게 */
      const cr = c.getBoundingClientRect(), pr = p.getBoundingClientRect(), S = 1.36;
      const cx = cr.left + cr.width / 2, cy = pr.top + (innerHeight / S) / 2;
      document.body.style.transformOrigin = '0 0';
      document.body.style.transform = `translate(${innerWidth / 2 - cx * S}px,${innerHeight / 2 - cy * S}px) scale(${S})`;
      return { top, end:end + (innerHeight - pr.top - innerHeight / S) + 16 }; });
    await L.advance(page, 400, 100);
    const cur = mkCursor(); cur.at(1000, 600);
    const pos = sel => page.evaluate(sel => { const e = document.querySelector(sel); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
    const go = (t, sel, d = 0.6) => pos(sel).then(p => cur.move(t, p[0], p[1] + 4, d));
    const press = sel => async t => { const p = await pos(sel); cur.at(p[0], p[1] + 4); cur.tap(t); await page.evaluate(sel => document.querySelector(sel).click(), sel); };
    let scrollT = null;
    await runScene('pace', page, { dur:9.6, cursor:cur,
      perFrame: async t => { if(t >= 3.9 && t <= 5.3){ const u = L.ease((t - 3.9) / 1.4); await page.evaluate(y => { window.__sp.scrollTop = y; }, L.lerp(sc.top, sc.end, u)); } },
      events:[
        [0.2, async t => { cur.show(t, true); await go(t, '.nm-cr-seg button[data-cad="w2"]', 0.9); }],
        [1.55, press('.nm-cr-seg button[data-cad="w2"]')],
        [2.2, t => go(t, '.nm-cr-pacebtn[data-pace]', 0.7)],
        [3.05, press('.nm-cr-pacebtn[data-pace]')],
        [3.9, t => cur.move(t, cur.st.x + 240, cur.st.y + 40, 1.3)],
        [5.3, t => go(t, '.nm-cr-seg button[data-speed="1.25"]', 0.5)],
        [5.85, press('.nm-cr-seg button[data-speed="1.25"]')],
        [6.2, t => go(t, '.nm-cr-seg button[data-amount="1.25"]', 0.45)],
        [6.7, press('.nm-cr-seg button[data-amount="1.25"]')],
        [7.5, t => cur.show(t, false, 0.6)],
      ] });
    await ctx.close();
  },

  /* 학부모 알림 — 무대(stage-notify.html)의 왼쪽 휴대폰 안에 진짜 앱(iframe)을 띄워
     옷장 › 계정·알림 설정 › '학부모 알림 받기' 카드에 번호(가짜 010-0000-0000)를 치고 요일·동의를 고른다.
     오른쪽 휴대폰은 그 번호로 가는 문자의 모양(weekly-notify 단문 형식). 알림톡은 아직 미개통이라 쓰지 않는다. */
  async notify(browser, base){
    const { ctx, page } = await L.newPage(browser, { w:CW, h:CH, dpr:DPR });
    await L.virtualTime(page);
    await page.goto(`${base}/number_magic/scripts/showreel/stage-notify.html`);
    const app = () => page.frames().find(f => /index\.html/.test(f.url()));
    const step = async (ms) => { await page.clock.runFor(ms); for(const f of page.frames()){ try { await f.evaluate(s => window.__srFlush && window.__srFlush(s), ms); } catch(e){} } };
    const wait = async (fn, max = 90000) => { for(let t = 0; t < max; t += 100){ const f = app(); if(f){ try { if(await f.evaluate(fn)) return; } catch(e){} } await step(100); await new Promise(r => setTimeout(r, 30)); } throw new Error('notify: 시간 초과 ' + fn); };
    await wait(() => !!document.getElementById('ttRoad') && !!document.querySelector('.nm-title3d .t3d-btn'));
    await step(800);
    await app().evaluate(() => document.getElementById('ttRoad').click());
    await wait(() => !!document.querySelector('#charChipBtn'));
    await app().evaluate(() => document.querySelector('#charChipBtn').click());
    await wait(() => !!document.querySelector('.nm-notify-card #nmNotifyPhone'));
    for(let i = 0; i < 20; i++) await step(100);
    await app().evaluate(() => {
      const det = document.querySelector('.nm-closet-settings');
      det.open = true; det.style.flexShrink = '0';   /* 앱 버그 우회: 세로 flex 안에서 details 가 2px 로 눌려 펼쳐도 안 보인다 */
      const card = document.querySelector('.nm-notify-card');
      let p = card.parentElement; while(p && !(p.scrollHeight > p.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(p).overflowY))) p = p.parentElement;
      if(p){ p.style.scrollBehavior = 'auto'; p.scrollTop += card.getBoundingClientRect().top - 230; }
      const st = document.createElement('style'); st.textContent = '#nmNotifyDow.sr-pick,#nmNotifyPhone.sr-pick{box-shadow:0 0 0 3px rgba(201,164,76,.5)}'; document.head.appendChild(st);
    });
    for(let i = 0; i < 6; i++) await step(100);
    { const r = await app().evaluate(() => { const e = document.querySelector('.nm-notify-card').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; });
      await page.evaluate(([x, y]) => { const p = window.toStage(x, y); window.setFocus(p[0], p[1]); }, r); }
    const at = async sel => { const r = await app().evaluate(sel => { const e = document.querySelector(sel).getBoundingClientRect(); return [e.left + Math.min(e.width / 2, 90), e.top + e.height / 2]; }, sel);
      return page.evaluate(([x, y]) => window.toStage(x, y), r); };
    const tapAt = async (t, sel) => { const p = await at(sel); await page.evaluate(([t, x, y]) => window.tap(t, x, y), [t, p[0], p[1]]); };
    const PHONE = '010-0000-0000';
    const ev = [
      [0.9, async t => { await tapAt(t, '#nmNotifyPhone'); await app().evaluate(() => { const e = document.querySelector('#nmNotifyPhone'); e.focus(); e.classList.add('sr-pick'); }); }],
    ];
    [...PHONE].forEach((c, i) => ev.push([1.2 + i * 0.11, () => app().evaluate(v => { const e = document.querySelector('#nmNotifyPhone'); e.value = v; e.dispatchEvent(new Event('input', { bubbles:true })); }, PHONE.slice(0, i + 1))]));
    ev.push([2.9, async t => { await tapAt(t, '#nmNotifyDow'); await app().evaluate(() => { const s = document.querySelector('#nmNotifyDow'); s.value = '1'; s.dispatchEvent(new Event('change', { bubbles:true })); s.classList.add('sr-pick'); const e = document.querySelector('#nmNotifyPhone'); e.blur(); e.classList.remove('sr-pick'); }); }]);
    ev.push([3.6, async t => { await tapAt(t, '#nmNotifyConsent'); await app().evaluate(() => { document.querySelector('#nmNotifyConsent').checked = true; document.querySelector('#nmNotifyDow').classList.remove('sr-pick'); }); }]);
    const cdp = await page.context().newCDPSession(page);
    const dur = 9.2, n = Math.round(dur * FPS), ms = 1000 / FPS;
    const enc = L.encoder(path.join(OUT, 'seg-notify.mp4'), W, H, FPS);
    for(let i = 0; i < n; i++){
      const t = i / FPS;
      while(ev.length && ev[0][0] <= t + 1e-6){ const [, fn] = ev.shift(); await fn(t); }
      await page.evaluate(t => window.render(t), t);
      await step(ms);
      const r = await cdp.send('Page.captureScreenshot', { format:'jpeg', quality:94 });
      await enc.push(Buffer.from(r.data, 'base64'));
    }
    await enc.close(); console.log(`✓ seg-notify.mp4  ${n} frames`);
    if(page.__errs.length) console.log('  (notify 페이지 오류) ' + page.__errs.slice(0, 3).join(' | '));
    await ctx.close();
  },
};

/* about.html — 찍는 동안에만 쓰는 카메라·형광펜(앱·페이지 파일은 그대로) */
async function philoScene(browser, base, name, nid, part){
  const { ctx, page } = await L.newPage(browser, { w:CW, h:CH, dpr:DPR, state:null });
  await L.virtualTime(page);
  await page.goto(base + '/number_magic/about.html');
  await until(page, () => document.readyState === 'complete' && document.fonts.status === 'loaded', null, 60000);
  await L.advance(page, 800, 100);
  /* 줄 길이: 실제 파일이 있으면 그 길이, 없거나 짧으면 원고 글자 수로 어림(한국어 낭독 ≈ 0.15초/자) — 자리표시 목소리로 찍어도 박자가 크게 어긋나지 않게 */
  const txt = (JSON.parse(fs.readFileSync(path.join(__dirname, 'narration.json'), 'utf8')).lines.find(l => l.id === nid) || {}).text || '';
  const D = Math.max(narrDur(nid) || 0, txt.replace(/\s/g, '').length * 0.15);
  await page.evaluate(PHILO_SETUP, [D, part]);
  await runScene(name, page, { dur:0.5 + D + 0.9, perFrame:t => page.evaluate(t => window.__phRender(t), t) });
  await ctx.close();
}
function PHILO_SETUP([D, part]){
  const css = document.createElement('style');
  css.textContent = `.skipbtn,.lang-sw,.langsw,[class*="lang"]{visibility:hidden!important}
    html,body{overflow:hidden!important} body{transform-origin:0 0;will-change:transform}
    .reveal,.reveal *{opacity:1!important;transform:none!important;transition:none!important}
    .sr-hl{background-image:linear-gradient(transparent 58%,rgba(245,217,139,.75) 58%,rgba(245,217,139,.75) 92%,transparent 92%);background-repeat:no-repeat;background-size:0% 100%;-webkit-box-decoration-break:clone;box-decoration-break:clone}
    #srFade{position:fixed;inset:0;background:#faf8f3;opacity:0;pointer-events:none;z-index:99999}`;
  document.head.appendChild(css);
  const fade = document.createElement('div'); fade.id = 'srFade'; document.documentElement.appendChild(fade);
  window.scrollTo(0, 0);
  const wrapText = (root, phrase) => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while((n = w.nextNode())){ const i = n.data.indexOf(phrase); if(i < 0) continue;
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + phrase.length); const s = document.createElement('span'); s.className = 'sr-hl'; r.surroundContents(s); return [s]; }
    return []; };
  const wrapEl = el => { const s = document.createElement('span'); s.className = 'sr-hl'; while(el.firstChild) s.appendChild(el.firstChild); el.appendChild(s); return [s]; };
  const q = s => document.querySelector(s);
  const lead = q('[data-i18n="pLead"]'), phLead = q('[data-i18n="phLead"]');
  const G = {
    h2:wrapEl(q('[data-i18n="pH2"]')),
    phH2:wrapEl(q('[data-i18n="phH2"]')),
    grammar:wrapText(phLead, '단어와 문법(공식)을 외우기만 해서는'),
    free:wrapEl(phLead.querySelectorAll('b')[0]),
    many:wrapEl(phLead.querySelectorAll('b')[1]),
    unfold:wrapEl(lead.querySelectorAll('b')[1]),
    think:wrapText(lead, '수를 가지고 놀며 사고하는 과정'),
    conquer:[...wrapText(lead, '수를 정복하기 위한'), ...wrapEl(lead.querySelectorAll('b')[0]), ...wrapText(lead, '의 철학')],
    q1:wrapEl(q('[data-i18n="qLine1"]')),
    q2:wrapEl(q('[data-i18n="qLine2"]')),
  };
  const docRect = el => { const r = el.getBoundingClientRect(); return { x:r.left + scrollX, y:r.top + scrollY, w:r.width, h:r.height }; };
  const T = docRect(q('[data-i18n="ch1Thesis"]')), H = docRect(q('[data-i18n="pH2"]')), Ld = docRect(lead), PH = docRect(q('[data-i18n="phH2"]')), PL = docRect(phLead), PQ = docRect(q('.pullquote')), CT = docRect(q('.cta-body h2'));
  const W = innerWidth, Hh = innerHeight;
  const a0 = 0.5, at = f => a0 + f * D;
  const ease = t => { t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const camAt = (K, t) => { let i = 0; while(i < K.length - 2 && K[i + 1][0] <= t) i++; const a = K[i], b = K[i + 1] || a;
    const u = b === a ? 0 : ease((t - a[0]) / (b[0] - a[0])); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * u)]; };
  let K, HL, fades = [], glow = null;
  if(part === 1){
    /* n02: 답을 빨리 구하는 계산 학습이 아닙니다(0–.2) · 연산만/창의 연산만 아닙니다(.2–.42) · 수는 언어입니다(.42–.52) · 단어와 문법만(.52–.72) · 내 마음대로 펼칠 수 있어야(.72–1) */
    K = [
      [0.0,     H.x + H.w * 0.52, H.y + H.h * 0.5, 1.75],
      [at(.18), H.x + H.w * 0.56, H.y + H.h * 0.5, 1.82],
      [at(.405), H.x + H.w * 0.56, H.y + H.h * 0.5, 1.82],
      [at(.415), PH.x + 330, (PH.y + PL.y + PL.h) / 2 - 10, 1.5],
      [at(.72), PH.x + 340, (PH.y + PL.y + PL.h) / 2, 1.54],
      [at(1) + .9, PH.x + 340, (PH.y + PL.y + PL.h) / 2 + 4, 1.58],
    ];
    HL = [['h2', at(.02), 1.0], ['phH2', at(.44), 0.5], ['grammar', at(.53), 0.8], ['free', at(.74), 0.6], ['many', at(.86), 0.6]];
    fades = [[at(.37), at(.45)]];
  } else {
    /* n03: 내가 다루기 쉬운 수로 펼치고(0–.25) · 생각하는 힘과 문장을 읽는 힘(.25–.55) · 수를 정복해야 수학을 정복(.55–.78) · 이것이 독쌤의 철학(.78–1) */
    K = [
      [0.0,     Ld.x + Ld.w * 0.5 + 40, Ld.y + Ld.h * 0.45, 1.66],
      [at(.33), Ld.x + Ld.w * 0.5 + 40, Ld.y + Ld.h * 0.45, 1.72],
      [at(.34), PQ.x + 250, (PQ.y + CT.y + CT.h) / 2 + 8, 1.55],
      [at(.675), PQ.x + 250, (PQ.y + CT.y + CT.h) / 2 - 6, 1.62],
      [at(.685), Ld.x + Ld.w * 0.5 + 40, Ld.y + Ld.h * 0.42, 1.7],
      [at(1) + .9, Ld.x + Ld.w * 0.5 + 40, Ld.y + Ld.h * 0.42, 1.76],
    ];
    HL = [['unfold', at(.02), 0.8], ['think', at(.26), 0.8], ['q1', at(.36), 0.8], ['q2', at(.5), 0.8], ['conquer', at(.7), 0.9]];
    fades = [[at(.30), at(.37)], [at(.645), at(.715)]];
    glow = at(.86);
  }
  window.__phRender = t => {
    const [cx, cy, s] = camAt(K, t);
    document.body.style.transform = `translate(${W / 2 - cx * s}px,${Hh / 2 - cy * s}px) scale(${s})`;
    let f = 0; for(const [a, b] of fades){ const m = (a + b) / 2, d = (b - a) / 2; if(t > a && t < b) f = 1 - Math.abs(t - m) / d; }
    fade.style.opacity = f;
    for(const [k, t0, d] of HL){ const els = G[k]; const n = els.length;
      els.forEach((e, i) => { const u = Math.max(0, Math.min(1, ((t - t0) / d) * n - i)); e.style.backgroundSize = `${(u * 100).toFixed(1)}% 100%`; }); }
    if(glow != null){ const g = Math.max(0, 1 - Math.abs(t - glow) / 0.6); G.conquer.forEach(e => { e.style.textShadow = g > 0.01 ? `0 0 ${14 * g}px rgba(245,190,80,${0.9 * g})` : ''; }); }
  };
  window.__phRender(0);
}

/* 지금 쓰는 목소리 폴더(SR_VOICE, 기본 omnivoice)의 내레이션 길이(초) */
function narrDur(n){
  const cands = [process.env.SR_VOICE, 'omnivoice-rec', 'omnivoice', 'ko-KR-Chirp3-HD-Leda'].filter(Boolean).map(v => path.join(__dirname, 'narration', v, n + '.mp3'));
  const f = cands.find(p => fs.existsSync(p)); if(!f) return 0;
  const r = require('child_process').spawnSync(L.FF, ['-hide_banner', '-i', f], { encoding:'utf8' });
  const m = String(r.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
}

/* 무대 페이지(render(t) 를 가진 정적 페이지)를 한 장씩 */
async function stageScene(browser, base, name, url, dur){
  const { ctx, page } = await L.newPage(browser, { w:CW, h:CH, dpr:DPR, state:null });
  await page.goto(`${base}/number_magic/scripts/showreel/${url}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout:60000 });
  const cdp = await page.context().newCDPSession(page);
  const n = Math.round(dur * FPS);
  const enc = L.encoder(path.join(OUT, `seg-${name}.mp4`), W, H, FPS);
  for(let i = 0; i < n; i++){
    await page.evaluate(t => window.render(t), i / FPS);
    const r = await cdp.send('Page.captureScreenshot', { format:'jpeg', quality:95 });
    await enc.push(Buffer.from(r.data, 'base64'));
  }
  await enc.close(); console.log(`✓ seg-${name}.mp4  ${n} frames`);
  await ctx.close();
}

(async () => {
  const want = process.argv.slice(2).filter(a => !a.startsWith('--'));
  const all = ['mapreveal', 'diagnose', 'compare', 'creative3', 'title', 'philosophy', 'philosophy2', 'village', 'story', 'road', 'pace', 'notify', ...Object.keys(HEROES).map(u => 'hero-' + u), 'sheetsSrc', 'creative', 'sheets', 'end'];
  const list = want.length ? want : all;
  const { server, base } = await L.serve({ '/__sheets/':path.join(OUT, 'sheets-src') });
  const browser = await L.launch();
  let bad = 0;
  for(const s of list){
    console.log('▶ ' + s);
    try {
      if(s.startsWith('hero-')) await SCENES.hero(browser, base, s.slice(5));
      else await SCENES[s](browser, base);
    } catch(e){ bad++; console.log(`✗ ${s}: ${e.stack || e}`); }
  }
  await browser.close(); server.close();
  console.log(bad ? `\n${bad}개 장면 실패` : `\n완료 → ${OUT}`);
  process.exitCode = bad ? 1 : 0;
})();
