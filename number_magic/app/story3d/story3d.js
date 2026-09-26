/* ============================================================
   수의 마법 — 3D 스토리 모드 머리 그림(마법 학습 여행 · S.view==='roadmap')
   2026-09-26, 원장 "모든 화면을 새 느낌(3D 모드 선택·3D 마을)으로".
   마법사의 수학 책상(app/title3d 와 같은 세계) 위에 **펼쳐진 여행 그림책** 한 권.
   두 쪽에 걸쳐 먹으로 그린 구불구불한 길이 있고, 길 위에 단계(data/stages.js)마다 작은 이정표 소품이 선다:
     수의 나라 = 숫자 나무 블록 · 새싹 = 화분의 새싹 · 도약 = 로켓 · 정복 = 왕관 · 경시의 탑 = 탑 ·
     중학교 = x 가 얹힌 책 더미 · 고등 = 깃발 꽂힌 봉우리 (모르는 key 는 놋쇠 오벨리스크)
   소품 받침 둘레의 금빛 호 = 그 단계의 진도(도장 받은 유닛 비율). 지나온 길은 금빛, 남은 길은 먹 점선.
   아이(app/char3d 캐릭터, 못 만들면 놋쇠 말)는 추천 위치의 단계 옆에 서 있고, 카메라도 거기서 출발한다.
   잠금은 없다(자유 선택 원칙) — 어느 이정표든 누르면 그 단계로 간다.

   ── 인터페이스 ──────────────────────────────────────────
   import { mountStory3D } from './story3d/story3d.js';
   const ctl = await mountStory3D(container, {
     lang: 'ko'|'en'|'zh',
     stages: [{ key, name, band, accent, pct, icon? }, …],   // 이미 번역된 문자열. 순서 = 여행 순서
     current: 'middle',                                     // 아이가 서 있는 단계 key(없으면 첫 단계)
     here: { label:'여기부터!', sub:'정수 개념·수직선' } | null,  // 놋쇠 명판(밀랍 봉인) — 누르면 onHere()
     avatar: { kind:'boy'|'girl' },
     onStage: key => {},     // 이정표·꼬리표를 눌렀을 때
     onHere: () => {},       // 놋쇠 명판을 눌렀을 때
     reducedMotion: bool?    // 생략하면 prefers-reduced-motion
   });
   // ctl === null → WebGL 없음·생성 실패(2D 가 그대로 남는다).  ctl.dispose() — 모든 자원·리스너·DOM 해제.
   container 는 높이가 있는 요소. 안에 .sd3 를 채운다.
   성능 규칙(town3d·title3d 와 같다): pixelRatio ≤ 1.5, 그림자 1024, 화면 밖·탭 숨김이면 멈춤,
   동작 줄이기면 움직임 없이 필요할 때만 그린다.
   ============================================================ */
import { makeKit, fontsReady, THREE } from '../hero3d/kit.js';

const TXT = {
  hint:{ ko:'책 속 이정표를 누르면 그 단계로 가요', en:'Tap a landmark to jump to that stage', zh:'点书中的路标，就能跳到那个阶段' },
  here:{ ko:'지금 여기', en:'You are here', zh:'你在这里' },
  prev:{ ko:'앞 단계 보기', en:'Show earlier stages', zh:'看前面的阶段' },
  next:{ ko:'다음 단계 보기', en:'Show later stages', zh:'看后面的阶段' },
  map:{ ko:'마법 학습 여행 지도', en:'Magic learning journey map', zh:'魔法学习之旅地图' },
};
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const tr = (v, lang) => v == null ? '' : typeof v === 'string' ? v : (v[lang] != null ? v[lang] : v.ko || '');
const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };

const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .24  0 0 0 0 .12  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ---------- 스타일(한 번만) — 전부 .sd3 아래로 ---------- */
const CSS = `
.sd3{position:absolute;inset:0;overflow:hidden;background:#4a2f1b;font-family:var(--font-game,'Fredoka','Jua','Pretendard',sans-serif);
  --sd3-ink:#33230f;--sd3-ink2:#5e4626;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.sd3 canvas.sd3-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s ease;touch-action:pan-y}
.sd3 canvas.sd3-gl.on{opacity:1}
.sd3 canvas.sd3-gl.hot{cursor:pointer}
.sd3 canvas.sd3-gl.grab{cursor:grab}
.sd3-vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 20% 0%,rgba(255,236,196,.18),rgba(255,236,196,0) 48%),radial-gradient(ellipse 88% 82% at 50% 50%,rgba(0,0,0,0) 60%,rgba(30,14,4,.45) 100%)}
.sd3-ui{position:absolute;inset:0;pointer-events:none}
.sd3-tag{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;border:0;margin:0;font:inherit;color:var(--sd3-ink);will-change:transform;isolation:isolate;
  display:flex;flex-direction:column;align-items:flex-start;justify-content:center;text-align:left;word-break:keep-all;min-height:44px;padding:5px 11px 5px 25px;background:none;
  filter:drop-shadow(0 1.5px 0 rgba(70,42,14,.55)) drop-shadow(0 4px 6px rgba(28,13,2,.4));transition:filter .15s,translate .15s;outline:none;white-space:nowrap}
.sd3-tag::before{content:"";position:absolute;inset:0;z-index:-1;background:${GRAIN},linear-gradient(180deg,#fcf6e6 0%,#f1e4c4 100%);
  clip-path:polygon(13px 0,100% 0,100% 100%,13px 100%,0 calc(100% - 11px),0 11px)}
.sd3-tag::after{content:"";position:absolute;left:6px;top:50%;width:9px;height:9px;margin-top:-4.5px;border-radius:50%;
  background:radial-gradient(circle,#3a2a18 0 2.2px,#f6d98e 2.6px,#b98a33 4px,#7c5518 4.5px)}
.sd3-tag b{display:flex;align-items:center;gap:5px;font-weight:400;font-size:15px;line-height:1.15}
.sd3-tag b i{font-style:normal;width:9px;height:9px;border-radius:50%;background:var(--ac,#0E2C57);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.5),0 0 0 1px rgba(40,20,4,.35);flex:none}
.sd3-tag small{display:block;font-size:11.5px;line-height:1.2;color:var(--sd3-ink2);margin-top:1px}
.sd3-tag.here::before{background:${GRAIN},linear-gradient(180deg,#fff7de 0%,#f3dfa8 100%)}
.sd3-tag .sd3-here{display:inline-block;margin-top:3px;padding:1px 7px 2px;border-radius:3px;font-size:11px;color:#3a2206;
  background:linear-gradient(180deg,#fbe8ae 0%,#e9c46c 30%,#cf9c42 62%,#e8c572 100%);box-shadow:inset 0 0 0 1px rgba(120,80,20,.6),0 1px 0 rgba(40,20,0,.3)}
.sd3-tag.on,.sd3-tag:hover{translate:0 -2px;filter:drop-shadow(0 1.5px 0 rgba(70,42,14,.55)) drop-shadow(0 0 7px rgba(255,214,120,.95)) drop-shadow(0 8px 9px rgba(28,13,2,.4))}
.sd3-tag:focus-visible{outline:3px solid #fff3c4;outline-offset:3px}
.sd3-tag.off{visibility:hidden}
.sd3.narrow .sd3-tag{padding:4px 9px 4px 22px}
.sd3.narrow .sd3-tag b{font-size:13.5px}
.sd3.narrow .sd3-tag small{font-size:10.5px}
.sd3.narrow .sd3-tag small .bd{display:none}
/* 테이프 쪽지(안내) */
.sd3-note{position:absolute;left:14px;top:14px;max-width:calc(100% - 28px);font-size:13px;line-height:1.3;color:var(--sd3-ink);padding:5px 12px;border-radius:2px;transform:rotate(-1.2deg);
  background:${GRAIN},linear-gradient(180deg,#fbf4e2,#efe2c3);box-shadow:0 1px 0 rgba(90,60,25,.35),0 4px 8px rgba(25,12,3,.32);pointer-events:none}
.sd3-note::before{content:"";position:absolute;left:50%;top:-6px;width:34px;height:12px;transform:translateX(-50%) rotate(-3deg);background:rgba(236,226,196,.62);border-radius:1px}
.sd3.narrow .sd3-note{left:10px;top:10px;font-size:12px;padding:4px 10px}
/* 놋쇠 명판 + 빨간 밀랍 봉인 */
.sd3-plate{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);pointer-events:auto;cursor:pointer;border:0;margin:0;font:inherit;color:#3a2206;
  display:flex;align-items:center;gap:11px;min-height:48px;max-width:calc(100% - 28px);padding:8px 22px 9px 9px;border-radius:9px;text-align:left;
  background:radial-gradient(circle at 9px 9px,#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),radial-gradient(circle at calc(100% - 9px) 9px,#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),
    radial-gradient(circle at 9px calc(100% - 9px),#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),radial-gradient(circle at calc(100% - 9px) calc(100% - 9px),#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),
    linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,250,225,.45) 42%,rgba(255,255,255,0) 54%),
    linear-gradient(180deg,#fbe8ae 0%,#e9c46c 24%,#cf9c42 56%,#e8c572 80%,#b8883a 100%);
  box-shadow:inset 0 1px 0 rgba(255,250,220,.9),inset 0 -2px 0 rgba(110,70,12,.55),inset 0 0 0 1px rgba(120,80,20,.7),inset 0 0 0 5px rgba(255,236,180,.22),inset 0 0 0 6px rgba(120,80,20,.35),
    0 2px 0 rgba(70,40,6,.7),0 8px 14px rgba(28,13,2,.45);transition:filter .15s,translate .15s}
.sd3-plate:hover{filter:brightness(1.06);translate:-0 -2px}
.sd3-plate:focus-visible{outline:3px solid #fff3c4;outline-offset:3px}
.sd3-seal{flex:none;width:36px;height:36px;border-radius:48% 52% 50% 50%/52% 47% 53% 48%;display:grid;place-items:center;color:#ffe9d9;
  background:radial-gradient(circle at 36% 30%,#e8645a 0%,#c3332a 45%,#8c1a14 100%);
  box-shadow:inset 0 0 0 3px rgba(120,20,14,.55),inset 0 0 0 5px rgba(240,120,100,.25),inset 0 -3px 4px rgba(60,6,4,.45),0 2px 2px rgba(50,10,4,.4)}
.sd3-seal svg{width:16px;height:16px}
.sd3-plate b{display:block;font-weight:400;font-size:18px;line-height:1.1;text-shadow:0 1px 0 rgba(255,242,200,.75)}
.sd3-plate small{display:block;font-size:12px;line-height:1.2;color:#5a3c0e;margin-top:1px;max-width:52vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sd3.narrow .sd3-plate{bottom:10px;padding:6px 16px 7px 7px;gap:9px}
.sd3.narrow .sd3-plate b{font-size:16px}
/* 좌우 놋쇠 단추(좁은 화면에서 길을 따라 옆으로) */
.sd3-arrow{position:absolute;top:50%;margin-top:-22px;width:44px;height:44px;border-radius:50%;border:0;padding:0;cursor:pointer;pointer-events:auto;display:none;place-items:center;color:#4a2f0c;
  background:radial-gradient(circle at 34% 28%,#fff4cc 0%,#e7c168 38%,#b5842f 78%,#8a5e1c 100%);
  box-shadow:inset 0 0 0 1.5px rgba(95,62,14,.55),inset 0 -2px 3px rgba(80,48,8,.35),inset 0 1px 1px rgba(255,255,255,.6),0 2px 0 rgba(20,6,2,.55),0 4px 8px rgba(0,0,0,.35)}
.sd3-arrow svg{width:20px;height:20px}
.sd3-arrow.l{left:8px}.sd3-arrow.r{right:8px}
.sd3.narrow .sd3-arrow{display:grid}
.sd3-arrow[disabled]{opacity:.35;cursor:default}
.sd3-arrow:focus-visible{outline:3px solid #fff3c4;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.sd3 canvas.sd3-gl,.sd3-tag,.sd3-plate{transition:none}}
@media (forced-colors:active){.sd3-tag,.sd3-plate{border:2px solid ButtonText;background:ButtonFace;color:ButtonText}.sd3-tag::before{display:none}}
`;
function injectCss(){
  if(document.getElementById('story3d-style')) return;
  const s = document.createElement('style'); s.id = 'story3d-style'; s.textContent = CSS; document.head.appendChild(s);
}

/* ============================================================ */
export async function mountStory3D(container, opts){
  opts = opts || {};
  const stages = (opts.stages || []).filter(s => s && s.key);
  if(!container || !stages.length || !glOK()) return null;
  injectCss();
  const lang = opts.lang || 'ko';
  const reduce = opts.reducedMotion != null ? !!opts.reducedMotion : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  let curIdx = Math.max(0, stages.findIndex(s => s.key === opts.current));

  const root = document.createElement('div'); root.className = 'sd3';
  root.setAttribute('role', 'region'); root.setAttribute('aria-label', tr(TXT.map, lang));
  root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang);
  const canvas = document.createElement('canvas'); canvas.className = 'sd3-gl'; canvas.setAttribute('aria-hidden', 'true');
  const vig = document.createElement('div'); vig.className = 'sd3-vig'; vig.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.className = 'sd3-ui';
  root.append(canvas, vig, ui);
  container.appendChild(root);
  const sizeOf = () => [Math.max(240, root.clientWidth || container.clientWidth || 800), Math.max(220, root.clientHeight || container.clientHeight || 420)];
  let [VW, VH] = sizeOf();

  await fontsReady();
  /* 아이 — char3d(진짜 3D). 못 만들면 놋쇠 말 */
  let kid = null;
  try {
    const m = await import('../char3d/char3d.js');
    const kind = opts.avatar && opts.avatar.kind === 'girl' ? 'girl' : 'boy';
    kid = m.makeCharacter(THREE, { kind, height:0.56, blob:false });
  } catch(e){ console.warn('[story3d] char3d', e); kid = null; }
  if(!root.isConnected){ if(kid) kid.dispose(); return null; }

  let k;
  try { k = makeKit(23, { live:true, canvas, width:VW, height:VH }); }
  catch(e){ if(kid) kid.dispose(); root.remove(); return null; }
  const { r, scene, cam } = k;
  let W;
  try { W = buildWorld(k, stages, curIdx, kid); }
  catch(e){ console.error('[story3d]', e); if(kid) kid.dispose(); try { r.dispose(); } catch(_){} root.remove(); return null; }

  /* ---------- HTML 겹 ---------- */
  const note = document.createElement('div'); note.className = 'sd3-note'; note.textContent = tr(TXT.hint, lang);
  ui.appendChild(note);
  const tags = stages.map((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sd3-tag' + (i === curIdx ? ' here' : '');
    b.style.setProperty('--ac', s.accent || '#0E2C57');
    const pct = Math.max(0, Math.min(100, Math.round(s.pct || 0)));
    b.innerHTML = `<b><i aria-hidden="true"></i>${esc(s.name)}</b><small>${s.band ? `<span class="bd">${esc(s.band)} · </span>` : ''}${pct}%</small>`
      + (i === curIdx ? `<span class="sd3-here">${esc(tr(TXT.here, lang))}</span>` : '');
    b.setAttribute('aria-label', `${s.name}${s.band ? ' — ' + s.band : ''} · ${pct}%${i === curIdx ? ' · ' + tr(TXT.here, lang) : ''}`);
    b.addEventListener('pointerenter', () => setHot(i, 'btn'));
    b.addEventListener('pointerleave', () => { if(hotSrc === 'btn') setHot(-1); });
    b.addEventListener('focus', () => { setHot(i, 'focus'); if(narrow) panTo(W.stops[i].x); });
    b.addEventListener('blur', () => { if(hotSrc === 'focus') setHot(-1); });
    b.addEventListener('click', () => pickStage(i));
    ui.appendChild(b); return b;
  });
  const arrowSvg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const aL = document.createElement('button'); aL.type = 'button'; aL.className = 'sd3-arrow l'; aL.innerHTML = arrowSvg('M14.5 6l-6 6 6 6'); aL.setAttribute('aria-label', tr(TXT.prev, lang));
  const aR = document.createElement('button'); aR.type = 'button'; aR.className = 'sd3-arrow r'; aR.innerHTML = arrowSvg('M9.5 6l6 6-6 6'); aR.setAttribute('aria-label', tr(TXT.next, lang));
  aL.addEventListener('click', () => panBy(-1)); aR.addEventListener('click', () => panBy(1));
  ui.append(aL, aR);
  let plate = null;
  if(opts.here && opts.here.label){
    plate = document.createElement('button'); plate.type = 'button'; plate.className = 'sd3-plate';
    plate.innerHTML = `<span class="sd3-seal" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.6 6.2l9 5.8-9 5.8z" fill="currentColor"/></svg></span><span><b>${esc(opts.here.label)}</b>${opts.here.sub ? `<small>${esc(opts.here.sub)}</small>` : ''}</span>`;
    plate.setAttribute('aria-label', opts.here.sub ? `${opts.here.label} — ${opts.here.sub}` : opts.here.label);
    plate.addEventListener('click', () => { try { opts.onHere && opts.onHere(); } catch(e){ console.warn(e); } });
    ui.appendChild(plate);
  }

  /* ---------- 강조 ---------- */
  let hot = -1, hotSrc = null;
  function setHot(i, src){
    hot = i; hotSrc = i >= 0 ? src : null;
    tags.forEach((b, j) => b.classList.toggle('on', j === i));
    canvas.classList.toggle('hot', i >= 0 && src === 'gl');
    wake();
  }
  let pickLock = false;
  function pickStage(i){
    if(pickLock || disposed || !stages[i]) return; pickLock = true;
    setTimeout(() => { pickLock = false; }, 350);
    try { opts.onStage && opts.onStage(stages[i].key); } catch(e){ console.warn(e); }
  }

  /* ---------- 구도 ---------- */
  const PITCH = 56;
  let narrow = false, dist = 10, panX = 0, panGoal = 0, panMin = 0, panMax = 0, fitCY = 0, fitCZ = 0;
  const T = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const _v = new THREE.Vector3();
  const proj = p => { _v.copy(p).project(cam); return [(_v.x + 1) / 2 * VW, (1 - _v.y) / 2 * VH, _v.z]; };
  function place(x){ T.set(x, fitCY, fitCZ); cam.position.copy(T).addScaledVector(dir, dist); cam.lookAt(T); cam.updateMatrixWorld(true); }
  function measureTags(){ return tags.map(b => [b.offsetWidth || 120, b.offsetHeight || 44]); }
  let tagSize = [];
  function relayout(){
    [VW, VH] = sizeOf();
    r.setSize(VW, VH, false);
    cam.aspect = VW / VH; cam.fov = 30; cam.updateProjectionMatrix();
    narrow = VW < 640 || VW / VH < 1.15;
    root.classList.toggle('narrow', narrow);
    tagSize = measureTags();
    const p = THREE.MathUtils.degToRad(narrow ? PITCH - 6 : PITCH);
    dir.set(0, Math.sin(p), Math.cos(p));
    /* 맞출 점: 넓으면 책 전체(+꼬리표), 좁으면 책의 앞뒤 깊이와 가운데 폭 일부 */
    const topPad = (note.offsetHeight || 24) + 20, botPad = (plate ? plate.offsetHeight + 22 : 12) + 4, side = narrow ? 58 : 20;
    const availW = VW - side * 2, availH = VH - topPad - botPad;
    const half = narrow ? Math.min(W.bookHalfW, 1.05) : W.bookHalfW + 0.1;
    const pts = [];
    [-half, half].forEach(x => [W.bookZ0 - 0.05, W.bookZ1 + 0.05].forEach(z => pts.push(new THREE.Vector3(x, 0.05, z))));
    fitCY = 0.2; fitCZ = (W.bookZ0 + W.bookZ1) / 2; dist = 9;
    for(let it = 0; it < 18; it++){
      place(0);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      const add = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
      pts.forEach(q => { const [x, y] = proj(q); add(x, y); });
      W.stops.forEach((s, i) => { if(narrow && Math.abs(s.x) > half) return;
        const [ax, ay] = proj(s.anchor(0)); const ts = tagSize[i]; const [lx, ly] = tagPos(s, ax, ay, ts);
        /* 좁은 화면은 꼬리표의 높이만 맞춘다(옆은 팬이 맡는다) */
        if(narrow){ add(ax, ly); add(ax, ly + ts[1]); } else { add(lx, ly); add(lx + ts[0], ly + ts[1]); } });
      const sc = Math.max((x1 - x0) / availW, (y1 - y0) / availH);
      dist *= 1 + (sc - 1) * 0.85;
      const wpp = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) / VH;
      const cy = (y0 + y1) / 2 - (topPad + availH / 2);
      /* 세로 치우침만 고친다(가로는 팬이 맡는다) — 화면 아래로 = 월드 +z 쪽 */
      fitCZ += cy * wpp * 0.9 / Math.sin(p);
    }
    /* 팬 범위: 보이는 폭의 반만큼 안쪽까지 */
    const visHalf = dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.aspect * 0.92;
    panMax = Math.max(0, W.bookHalfW + 0.25 - visHalf); panMin = -panMax;
    if(!narrow){ panMin = panMax = 0; }
    panGoal = clampPan(narrow ? W.stops[curIdx].x : 0);
    if(!introDone) panX = narrow ? panGoal : 0; else panX = clampPan(panX);
    updateArrows();
    wake();
  }
  const clampPan = x => Math.max(panMin, Math.min(panMax, x));
  function panTo(x){ panGoal = clampPan(x); if(reduce) panX = panGoal; updateArrows(); wake(); }
  function panBy(d){
    /* 지금 가운데에 가장 가까운 단계에서 한 칸 */
    let near = 0, best = 1e9; W.stops.forEach((s, i) => { const dd = Math.abs(s.x - panGoal); if(dd < best){ best = dd; near = i; } });
    const j = Math.max(0, Math.min(W.stops.length - 1, near + d * 2));
    panTo(W.stops[j].x);
  }
  function updateArrows(){ aL.disabled = panGoal <= panMin + 0.01; aR.disabled = panGoal >= panMax - 0.01; }

  /* 꼬리표 자리 — 윗줄 이정표는 소품 위, 아랫줄은 받침 아래 */
  function tagPos(s, ax, ay, ts){ return s.up ? [ax - ts[0] / 2, ay - ts[1] - 4] : [ax - ts[0] / 2, ay + 4]; }
  function placeTags(){
    const rects = [];
    W.stops.forEach((s, i) => {
      const [ax, ay] = proj(s.anchor(W.lift[i]));
      const ts = tagSize[i] || [120, 44];
      const [x, y] = tagPos(s, ax, ay, ts);
      rects.push({ i, x, y, w:ts[0], h:ts[1], cx:ax });
    });
    for(let pass = 0; pass < 4; pass++){
      for(let a = 0; a < rects.length; a++) for(let b = a + 1; b < rects.length; b++){
        const A = rects[a], B = rects[b];
        if(A.x < B.x + B.w + 4 && B.x < A.x + A.w + 4 && A.y < B.y + B.h + 3 && B.y < A.y + A.h + 3){
          const ov = Math.min(A.x + A.w + 4 - B.x, B.x + B.w + 4 - A.x) / 2;
          if(A.x <= B.x){ A.x -= ov; B.x += ov; } else { A.x += ov; B.x -= ov; }
        }
      }
    }
    const pl = plate ? [plate.offsetLeft, plate.offsetTop, plate.offsetWidth, plate.offsetHeight] : null;
    const nt = [note.offsetLeft, note.offsetTop, note.offsetWidth, note.offsetHeight];
    rects.forEach(R => {
      const b = tags[R.i];
      const off = R.cx < -10 || R.cx > VW + 10;
      const x = Math.max(4, Math.min(VW - R.w - 4, R.x)), y = Math.max(4, Math.min(VH - R.h - 4, R.y));
      const inter = q => q && x < q[0] + q[2] && q[0] < x + R.w && y < q[1] + q[3] && q[1] < y + R.h;
      /* 좁은 화면: 가장자리 밖이거나 명판·쪽지와 겹치면 숨긴다(스크린리더·키보드는 그대로 닿는다 — visibility 로 숨기므로 포커스는 panTo 로 불러온다) */
      const hide = off || (narrow && (R.cx < 30 || R.cx > VW - 30)) || inter(pl) || (narrow && inter(nt));
      b.classList.toggle('off', hide && document.activeElement !== b);
      b.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
    });
  }

  /* ---------- 포인터: 레이캐스트 · 끌어서 옆으로 ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function hitAt(ev){
    const b = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - b.left) / b.width) * 2 - 1, -((ev.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const h = ray.intersectObjects(W.hits, false)[0];
    return h ? h.object.userData.stop : -1;
  }
  let drag = null;
  const onDown = ev => { drag = { x:ev.clientX, y:ev.clientY, px:panGoal, moved:false, id:ev.pointerId }; };
  const onMove = ev => {
    if(drag && narrow){
      const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      if(!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)){ drag.moved = true; try { canvas.setPointerCapture(drag.id); } catch(e){} canvas.classList.add('grab'); }
      if(drag.moved){
        const wpp = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) / VH;
        panGoal = clampPan(drag.px - dx * wpp); panX = panGoal; updateArrows(); wake();
      }
      return;
    }
    if(ev.pointerType === 'touch') return;
    const i = hitAt(ev);
    if(i !== (hotSrc === 'gl' ? hot : -1) && (hotSrc !== 'btn' && hotSrc !== 'focus' || i >= 0)) setHot(i, 'gl');
  };
  const onUp = ev => {
    const d = drag; drag = null; canvas.classList.remove('grab');
    if(d && d.moved) return;
    if(d && Math.hypot(ev.clientX - d.x, ev.clientY - d.y) > 8) return;
    const i = hitAt(ev); if(i >= 0) pickStage(i);
  };
  const onLeave = () => { if(hotSrc === 'gl') setHot(-1); };
  const onCancel = () => { drag = null; canvas.classList.remove('grab'); };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onLeave);

  /* ---------- 루프 ---------- */
  let raf = 0, running = !document.hidden, visible = true, disposed = false, shown = false, settle = 0;
  const t0 = performance.now(); let last = t0;
  let introDone = reduce, introStart = 0;
  function frame(){
    const now = performance.now();
    raf = 0; if(disposed) return;
    if(!root.isConnected){ dispose(); return; }
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
    const t = reduce ? 0 : (now - t0) / 1000;
    let moving = false;
    /* 들어올 때: 넓은 화면은 추천 단계 가까이에서 출발해 책 전체로 물러난다 */
    let dMul = 1, xNow;
    if(!introDone){
      if(!introStart) introStart = now;
      const u = Math.min(1, (now - introStart) / 2000); const e = u < 0.18 ? 0 : 1 - Math.pow(1 - (u - 0.18) / 0.82, 3);
      if(narrow){ xNow = panX; dMul = 0.8 + 0.2 * e; }
      else { xNow = W.stops[curIdx].x * (1 - e); dMul = 0.5 + 0.5 * e; }
      if(u >= 1) introDone = true; moving = true;
    } else {
      const dx = panGoal - panX; if(Math.abs(dx) > 0.001){ panX += dx * Math.min(1, dt * 7); moving = true; } else panX = panGoal;
      xNow = panX;
    }
    const d0 = dist; dist = d0 * dMul; place(xNow); dist = d0;
    if(W.animate(t, dt, reduce, hot)) moving = true;
    placeTags();
    r.render(scene, cam);
    if(!shown){ shown = true; canvas.classList.add('on'); }
    if(moving) settle = now;
    if(running && visible && (!reduce || now - settle < 600)) raf = requestAnimationFrame(frame);
  }
  function wake(){ if(!raf && running && visible && !disposed){ last = performance.now(); settle = last; raf = requestAnimationFrame(frame); } }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { visible = es.some(x => x.isIntersecting); if(visible) wake(); }) : null;
  if(io) io.observe(root);
  const onVis = () => { running = !document.hidden; if(running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { if(!disposed) relayout(); }, 60); };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
  if(ro) ro.observe(root); else window.addEventListener('resize', onResize);

  function dispose(){
    if(disposed) return; disposed = true;
    if(raf) cancelAnimationFrame(raf); raf = 0;
    clearTimeout(rt);
    if(io) io.disconnect(); if(ro) ro.disconnect(); else window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onCancel); canvas.removeEventListener('pointerleave', onLeave);
    /* 캐릭터 재질은 마을·타이틀과 나눠 쓴다 — 먼저 떼어 낸 뒤 장면을 비운다 */
    if(kid){ try { kid.dispose(); } catch(e){} }
    const seen = new Set();
    scene.traverse(o => {
      if(o.geometry && !seen.has(o.geometry)){ seen.add(o.geometry); o.geometry.dispose(); }
      const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(mm => { if(seen.has(mm)) return; seen.add(mm);
        for(const key in mm){ const v = mm[key]; if(v && v.isTexture) v.dispose(); }
        mm.dispose(); });
    });
    if(scene.environment) scene.environment.dispose();
    try { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } catch(e){}
    root.remove();
  }

  relayout();
  wake();
  const api = {
    dispose,
    /* 화면 쪽에서 단계를 알려 주면(목록 스크롤 등) 좁은 화면은 그쪽으로 옮겨 간다 */
    focusStage(key){ const i = stages.findIndex(s => s.key === key); if(i >= 0 && narrow) panTo(W.stops[i].x); },
    _debug:{ cam, proj:p => proj(p), stops:W.stops, tags, hitAt:(x, y) => hitAt({ clientX:x, clientY:y }), get narrow(){ return narrow; }, get pan(){ return [panMin, panGoal, panMax, dist]; } },
  };
  root._sd3dbg = api._debug;   /* DBGTMP */
  return api;
}

/* ============================================================
   3D 세계 — 책상 위에 펼친 여행 그림책
   ============================================================ */
function buildWorld(k, stages, curIdx, kid){
  const { scene, rnd, canvasTex, rbox, woodMat, metal, lacquer, mathText, r } = k;
  const TAU = Math.PI * 2;
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  scene.background = new THREE.Color('#3a2414');
  k.env({ wall:'#8b6a4c', intensity:0.85 });
  r.toneMappingExposure = 1.02;

  /* 빛 — 왼쪽 뒤 창의 낮빛(그림자 1024) + 방 반구광 */
  scene.add(new THREE.HemisphereLight('#fff4e2', '#5a3a22', 0.66));
  const sun = new THREE.DirectionalLight('#fff0d8', 2.6);
  sun.position.set(-4, 8, -2.5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left:-4.5, right:4.5, top:3.5, bottom:-3.5, near:1, far:20 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#dfe8ff', 0.4); fill.position.set(6, 5, 7); scene.add(fill);

  /* 공용 */
  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const shadowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(30,14,4,.55)'); gr.addColorStop(0.55, 'rgba(30,14,4,.22)'); gr.addColorStop(1, 'rgba(30,14,4,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const blob = (sx, sz, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), new THREE.MeshBasicMaterial({ map:shadowTex, transparent:true, opacity:op == null ? 1 : op, depthWrite:false })); m.rotation.x = -Math.PI / 2; m.renderOrder = 1; return m; };
  const cast = o => { o.traverse(m => { if(m.isMesh && !m.userData.noShadow){ m.castShadow = true; m.receiveShadow = true; } }); return o; };
  const brass = metal('#c9a050', 0.32), gold = metal('#e2b457', 0.25);
  const std = (color, rough, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness:rough == null ? 0.6 : rough }, o || {}));
  const paperBase = (g, w, h, base, fib) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(let i = 0; i < (fib || 5000); i++){ g.fillStyle = `rgba(${120 + rnd() * 60},${95 + rnd() * 50},${60 + rnd() * 30},${rnd() * 0.06})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2.5, 1 + rnd() * 6); }
  };

  /* ---- 책상 판자 ---- */
  const deskTex = canvasTex(1024, 1024, (g, w, h) => {
    const planks = 4, ph = h / planks;
    for(let p = 0; p < planks; p++){
      const tone = [[108, 66, 36], [98, 59, 31], [113, 70, 39], [102, 62, 33]][p];
      g.fillStyle = `rgb(${tone[0]},${tone[1]},${tone[2]})`; g.fillRect(0, p * ph, w, ph);
      for(let i = 0; i < 110; i++){
        const y = p * ph + rnd() * ph;
        g.strokeStyle = `rgba(${55 + rnd() * 30},${30 + rnd() * 18},${12 + rnd() * 10},${0.1 + rnd() * 0.28})`;
        g.lineWidth = 0.6 + rnd() * 2.6; g.beginPath(); g.moveTo(0, y);
        for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / (120 + p * 20) + i) * 4 + Math.sin(x / 33 + i * 3) * 1.4);
        g.stroke();
      }
      if(p % 2 === 1){ const kx = rnd() * w, ky = p * ph + ph * (0.3 + rnd() * 0.4);
        for(let j = 0; j < 7; j++){ g.strokeStyle = `rgba(60,32,14,${0.25 - j * 0.03})`; g.lineWidth = 2; g.beginPath(); g.ellipse(kx, ky, 8 + j * 9, 4 + j * 3.5, 0, 0, TAU); g.stroke(); } }
      g.fillStyle = 'rgba(40,20,8,.75)'; g.fillRect(0, p * ph, w, 3);
      g.fillStyle = 'rgba(255,220,180,.10)'; g.fillRect(0, p * ph + 3, w, 2);
    }
  }, [4, 3]);
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), std(0xffffff, 0.5, { map:deskTex }));
  desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);

  /* ---- 책 ---- */
  const PW = 2.55, PD = 3.1, N = 40;
  const top = u => 0.19 + 0.07 * Math.sin(Math.min(1, u * 2.1) * Math.PI / 2) - 0.02 * u;   /* 제본 쪽이 낮고 가운데가 부푼 책장 */
  const pageY = x => top(Math.min(1, Math.abs(x) / PW));
  const book = new THREE.Group(); scene.add(book);
  const coverMat = std('#6b2a1f', 0.62);
  [-1, 1].forEach(sx => { const c = new THREE.Mesh(rbox(PW + 0.18, 0.05, PD + 0.24, 0.06), coverMat); c.position.set(sx * (PW + 0.18) / 2, 0, 0); c.castShadow = c.receiveShadow = true; book.add(c); });
  /* 표지 가장자리 금박 줄 */
  [-1, 1].forEach(sx => { const ln = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.1, 0.008, 0.02), gold); ln.position.set(sx * (PW + 0.18) / 2, 0.052, PD / 2 + 0.085); book.add(ln);
    const ln2 = ln.clone(); ln2.position.z = -PD / 2 - 0.085; book.add(ln2); });
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, PD + 0.24, 16, 1, false, Math.PI / 2, Math.PI), std('#5a2019', 0.6));
  spine.rotation.x = Math.PI / 2; spine.position.y = 0.05; book.add(spine);
  const edgeTex = canvasTex(64, 256, (g, w, h) => { g.fillStyle = '#efe3c4'; g.fillRect(0, 0, w, h); for(let y = 0; y < h; y += 3){ g.fillStyle = `rgba(150,115,70,${0.08 + rnd() * 0.18})`; g.fillRect(0, y, w, 1); } });
  const edgeMat = std(0xffffff, 0.9, { map:edgeTex });
  [-1, 1].forEach(sx => {
    const sh = new THREE.Shape(); sh.moveTo(0, 0.05); sh.lineTo(sx * PW, 0.05);
    for(let i = N; i >= 0; i--){ const u = i / N; sh.lineTo(sx * u * PW, top(u) - 0.004); }
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth:PD, bevelEnabled:false, curveSegments:4 }); geo.translate(0, 0, -PD / 2);
    const m = new THREE.Mesh(geo, edgeMat); m.castShadow = true; m.receiveShadow = true; book.add(m);
  });
  /* 책갈피 끈 */
  const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.62), std('#a8231b', 0.7, { side:THREE.DoubleSide }));
  ribbon.rotation.x = -Math.PI / 2; ribbon.rotation.z = 0.15; ribbon.position.set(0.06, 0.03, PD / 2 + 0.36); book.add(ribbon);

  /* ---- 이정표 자리 — 두 쪽에 걸친 구불구불한 길(제본 골은 건너뛴다) ---- */
  const n = stages.length;
  const XL0 = -PW + 0.5, XL1 = -0.42, XR0 = 0.42, XR1 = PW - 0.5;
  const span = (XL1 - XL0) + (XR1 - XR0);
  const stops = stages.map((s, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    let d = u * span, x = d <= (XL1 - XL0) ? XL0 + d : XR0 + (d - (XL1 - XL0));
    const up = i % 2 === 0;
    const z = (up ? -0.62 : 0.52) + Math.sin(i * 2.3) * 0.08;
    return { i, key:s.key, x, z, y:pageY(x), up };
  });
  /* 길 곡선(캣멀롬) — 시작 앞과 끝 뒤를 조금 늘린다 */
  const ctrl = [V3(stops[0].x - 0.45, 0, stops[0].z + 0.5), ...stops.map(s => V3(s.x, 0, s.z)), V3(stops[n - 1].x + 0.35, 0, stops[n - 1].z - 0.45)];
  const curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal');
  const samples = curve.getPoints(400);
  /* 곡선에서 지금 단계까지의 비율 */
  let curU = 0; { let best = 1e9; samples.forEach((p, j) => { const dd = Math.hypot(p.x - stops[curIdx].x, p.z - stops[curIdx].z); if(dd < best){ best = dd; curU = j; } }); }

  /* ---- 책장 그림: 먹 지도 ---- */
  const CW = 1200, CH = Math.round(CW * PD / PW);
  const pageArt = side => canvasTex(CW, CH, (g, w, h) => {
    const x0 = side < 0 ? -PW : 0;
    const X = x => (x - x0) / PW * w, Z = z => (z + PD / 2) / PD * h;
    paperBase(g, w, h, '#f3e8cc', 6000);
    const ag = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.72); ag.addColorStop(0, 'rgba(0,0,0,0)'); ag.addColorStop(1, 'rgba(120,78,30,.3)'); g.fillStyle = ag; g.fillRect(0, 0, w, h);
    /* 제본 쪽 그늘 */
    const gx = side > 0 ? 0 : w, gr = g.createLinearGradient(gx, 0, gx + side * w * 0.14, 0); gr.addColorStop(0, 'rgba(90,60,25,.38)'); gr.addColorStop(1, 'rgba(90,60,25,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.lineCap = 'round'; g.lineJoin = 'round';
    const ink = a => `rgba(52,34,18,${a})`;
    /* 가는 테두리 두 줄 */
    g.strokeStyle = ink(0.5); g.lineWidth = 3; g.strokeRect(w * 0.04, h * 0.03, w * 0.92, h * 0.94);
    g.strokeStyle = ink(0.25); g.lineWidth = 1.5; g.strokeRect(w * 0.055, h * 0.042, w * 0.89, h * 0.916);
    /* 풍경 스케치(먹) — 언덕·나무·물결. 이정표 자리는 피한다 */
    const near = (px, pz, rr) => stops.some(s => Math.hypot(s.x - px, s.z - pz) < rr) || samples.some((p, j) => j % 6 === 0 && Math.hypot(p.x - px, p.z - pz) < rr * 0.55);
    const hill = (cx, cy, s) => { g.strokeStyle = ink(0.55); g.lineWidth = 3; g.beginPath(); g.moveTo(cx - s, cy); g.quadraticCurveTo(cx - s * 0.3, cy - s * 1.1, cx, cy - s * 0.75); g.quadraticCurveTo(cx + s * 0.5, cy - s * 1.05, cx + s * 1.1, cy); g.stroke();
      g.lineWidth = 1.5; for(let j = 0; j < 4; j++){ g.beginPath(); g.moveTo(cx - s * 0.2 + j * s * 0.18, cy - s * 0.55 + j * 0.06 * s); g.lineTo(cx - s * 0.05 + j * s * 0.18, cy - s * 0.15); g.stroke(); } };
    const tree = (cx, cy, s) => { g.fillStyle = 'rgba(96,120,70,.28)'; g.beginPath(); g.arc(cx, cy - s, s * 0.62, 0, TAU); g.fill();
      g.strokeStyle = ink(0.6); g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy - s, s * 0.62, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(cx, cy - s * 0.4); g.lineTo(cx, cy + s * 0.2); g.stroke(); };
    const waves = (cx, cy, s) => { g.strokeStyle = 'rgba(40,80,120,.45)'; g.lineWidth = 2.2; for(let j = 0; j < 3; j++){ g.beginPath(); for(let q = 0; q <= 4; q++){ const px = cx - s + q * s * 0.5, py = cy + j * s * 0.32; q ? g.quadraticCurveTo(px - s * 0.25, py - s * 0.18, px, py) : g.moveTo(px, py); } g.stroke(); } };
    for(let tries = 0; tries < 70; tries++){
      const wx = x0 + 0.2 + rnd() * (PW - 0.4), wz = -PD / 2 + 0.25 + rnd() * (PD - 0.5);
      if(Math.abs(wx) < 0.25 || near(wx, wz, 0.42)) continue;
      const kind = rnd(), s = 26 + rnd() * 26;
      if(kind < 0.45) tree(X(wx), Z(wz), s); else if(kind < 0.8) hill(X(wx), Z(wz), s * 1.3); else waves(X(wx), Z(wz), s * 1.2);
    }
    /* 나침반 장미(오른쪽 위) · 출발 표시(왼쪽 아래) */
    if(side > 0){ const cx = w * 0.84, cy = h * 0.12, R0 = w * 0.07;
      g.strokeStyle = ink(0.6); g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy, R0, 0, TAU); g.stroke();
      g.fillStyle = 'rgba(184,134,46,.75)'; for(let j = 0; j < 4; j++){ const a = j * Math.PI / 2 - Math.PI / 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R0 * 1.25, cy + Math.sin(a) * R0 * 1.25); g.lineTo(cx + Math.cos(a + 0.5) * R0 * 0.25, cy + Math.sin(a + 0.5) * R0 * 0.25); g.lineTo(cx + Math.cos(a - 0.5) * R0 * 0.25, cy + Math.sin(a - 0.5) * R0 * 0.25); g.closePath(); g.fill(); }
      g.fillStyle = ink(0.8); mathText(g, 'N', cx, cy - R0 * 1.55, 30, { align:'center', upright:true }); }
    /* 길: 남은 길 = 먹 점선, 지나온 길 = 금빛 실선 */
    const path = (from, to) => { g.beginPath(); for(let j = from; j <= to; j++){ const p = samples[j]; j === from ? g.moveTo(X(p.x), Z(p.z)) : g.lineTo(X(p.x), Z(p.z)); } };
    g.setLineDash([]); g.strokeStyle = 'rgba(250,240,215,.9)'; g.lineWidth = 24; path(0, samples.length - 1); g.stroke();
    g.setLineDash([16, 14]); g.strokeStyle = ink(0.7); g.lineWidth = 6; path(curU, samples.length - 1); g.stroke();
    g.setLineDash([]);
    if(curU > 0){ g.strokeStyle = 'rgba(120,70,10,.55)'; g.lineWidth = 12; path(0, curU); g.stroke(); g.strokeStyle = '#d9a441'; g.lineWidth = 7; path(0, curU); g.stroke(); }
    /* 출발점 X · 끝 깃발 점 */
    const s0 = samples[0]; g.strokeStyle = '#a8231b'; g.lineWidth = 6; const sx0 = X(s0.x), sz0 = Z(s0.z);
    g.beginPath(); g.moveTo(sx0 - 14, sz0 - 14); g.lineTo(sx0 + 14, sz0 + 14); g.moveTo(sx0 + 14, sz0 - 14); g.lineTo(sx0 - 14, sz0 + 14); g.stroke();
    /* 이정표 둘레의 먹 동그라미(받침이 놓일 자리) */
    stops.forEach(s => { g.strokeStyle = ink(0.35); g.lineWidth = 2; g.beginPath(); g.arc(X(s.x), Z(s.z), 0.34 / PW * w, 0, TAU); g.stroke(); });
  });
  [-1, 1].forEach(side => {
    const geo = new THREE.PlaneGeometry(PW, PD, 48, 6); const pos = geo.attributes.position;
    for(let j = 0; j < pos.count; j++){ const lx = pos.getX(j) + side * PW / 2; pos.setZ(j, pageY(lx)); }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, std(0xffffff, 0.92, { map:pageArt(side) }));
    m.rotation.x = -Math.PI / 2; m.position.x = side * PW / 2; m.receiveShadow = true; book.add(m);
  });

  /* ---- 이정표 소품 ---- */
  const paintMat = c => new THREE.MeshPhysicalMaterial({ color:c, roughness:0.4, clearcoat:0.5, clearcoatRoughness:0.35 });
  const faceTile = (txt, size, wood) => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(rbox(size, size, size, size * 0.12), woodMat(wood || '#d9b27c'));
    g.add(body);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(size * 0.86, size * 0.86), std(0xffffff, 0.6, { map:canvasTex(128, 128, (c, w, h) => {
      c.fillStyle = '#ecd2a2'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a2412'; c.textBaseline = 'middle'; mathText(c, txt, w / 2, h / 2 + 4, 84, { align:'center' }); }) }));
    face.rotation.x = -Math.PI / 2; face.position.y = size + 0.002; g.add(face);
    const front = face.clone(); front.rotation.set(0, 0, 0); front.position.set(0, size / 2, size / 2 + 0.002); g.add(front);
    return g;
  };
  const props = {
    numberland(){ const g = new THREE.Group();
      const a = faceTile('1', 0.17, '#e0bb86'); a.position.set(-0.1, 0, 0.04); a.rotation.y = 0.2;
      const b = faceTile('2', 0.17, '#d4a870'); b.position.set(0.1, 0, 0.02); b.rotation.y = -0.15;
      const c = faceTile('3', 0.17, '#e6c492'); c.position.set(0.0, 0.17, 0.03); c.rotation.y = 0.05;
      g.add(a, b, c); return { g, h:0.36 }; },
    sprout(){ const g = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.095, 0.17, 24), std('#b8643a', 0.75)); pot.position.y = 0.085; g.add(pot);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 8, 24), std('#c8744a', 0.7)); rim.rotation.x = Math.PI / 2; rim.position.y = 0.17; g.add(rim);
      const soil = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), std('#4a2e1a', 0.95)); soil.rotation.x = -Math.PI / 2; soil.position.y = 0.165; g.add(soil);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.2, 8), std('#5c9a3c', 0.6)); stem.position.y = 0.26; g.add(stem);
      const leafG = new THREE.SphereGeometry(0.08, 16, 10); const leafM = paintMat('#6fbf45');
      [-1, 1].forEach(sx => { const l = new THREE.Mesh(leafG, leafM); l.scale.set(1.1, 0.28, 0.6); l.position.set(sx * 0.075, 0.36, 0); l.rotation.z = sx * 0.45; g.add(l); });
      return { g, h:0.42 }; },
    leap(){ const g = new THREE.Group(); const body = new THREE.Group();
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.3, 24), paintMat('#f1e6cc')); tube.position.y = 0.2; body.add(tube);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 24), paintMat('#c3332a')); nose.position.y = 0.42; body.add(nose);
      const win = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 8, 20), brass); win.position.set(0, 0.25, 0.072); body.add(win);
      const glassM = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16), std('#5fa6d6', 0.2, { metalness:0.3 })); glassM.position.set(0, 0.25, 0.071); body.add(glassM);
      for(let j = 0; j < 3; j++){ const f = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.11, 0.08), paintMat('#16417C')); const a = j / 3 * TAU; f.position.set(Math.sin(a) * 0.075, 0.1, Math.cos(a) * 0.075); f.rotation.y = a; body.add(f); }
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 16), new THREE.MeshBasicMaterial({ color:'#ffb347' })); flame.rotation.x = Math.PI; flame.position.y = 0.0; flame.userData.noShadow = true; body.add(flame);
      body.position.y = 0.06; body.rotation.z = -0.18; g.add(body); return { g, h:0.5, spin:body, flame }; },
    mastery(){ const g = new THREE.Group();
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32, 1, true), gold); band.position.y = 0.1; band.material.side = THREE.DoubleSide; g.add(band);
      const cush = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 12), std('#7a1e28', 0.8)); cush.scale.set(1, 0.55, 1); cush.position.y = 0.1; g.add(cush);
      for(let j = 0; j < 5; j++){ const a = j / 5 * TAU; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 12), gold); sp.position.set(Math.sin(a) * 0.14, 0.2, Math.cos(a) * 0.14); g.add(sp);
        const gem = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), paintMat(j % 2 ? '#2f86c8' : '#c3332a')); gem.position.set(Math.sin(a) * 0.152, 0.1, Math.cos(a) * 0.152); g.add(gem);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), gold); ball.position.set(Math.sin(a) * 0.14, 0.26, Math.cos(a) * 0.14); g.add(ball); }
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.05, 32), std('#5a1b16', 0.7)); base.position.y = 0.025; g.add(base);
      g.children.forEach(c => { if(c !== base) c.position.y += 0.03; });
      return { g, h:0.33 }; },
    tower(){ const g = new THREE.Group(); const stone = std('#d8cbb2', 0.85);
      const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.32, 20), stone); t1.position.y = 0.16; g.add(t1);
      const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.18, 20), stone); t2.position.y = 0.41; g.add(t2);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.018, 8, 24), brass); ring.rotation.x = Math.PI / 2; ring.position.y = 0.32; g.add(ring);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 20), paintMat('#5b2d80')); roof.position.y = 0.6; g.add(roof);
      for(let j = 0; j < 2; j++){ const wdw = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.06), std('#3a2412', 0.9)); wdw.position.set(0, 0.14 + j * 0.27, (j ? 0.093 : 0.123)); g.add(wdw); }
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), brass); pole.position.y = 0.75; g.add(pole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.05), std('#c9a063', 0.6, { side:THREE.DoubleSide })); flag.position.set(0.045, 0.785, 0); g.add(flag);
      return { g, h:0.82, flag }; },
    middle(){ const g = new THREE.Group();
      [['#1f4f7a', 0, 0.12], ['#2f6b46', 0.04, -0.2], ['#7a2b22', -0.02, 0.1]].forEach(([c, dx, ry], j) => {
        const bk = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.22), [std(c, 0.6), std(c, 0.6), std(c, 0.6), std('#efe3c4', 0.9), std('#efe3c4', 0.9), std('#efe3c4', 0.9)]);
        bk.position.set(dx, 0.03 + j * 0.061, 0); bk.rotation.y = ry; g.add(bk); });
      const x = faceTile('x', 0.13, '#e0bb86'); x.position.set(0, 0.183, 0.0); x.rotation.y = 0.35; g.add(x);
      return { g, h:0.33 }; },
    high(){ const g = new THREE.Group();
      const mg = new THREE.ConeGeometry(0.24, 0.42, 9, 4); const p = mg.attributes.position;
      for(let j = 0; j < p.count; j++){ const y = p.getY(j); if(y < 0.2){ const f = 1 + (Math.sin(j * 12.9) * 0.08); p.setX(j, p.getX(j) * f); p.setZ(j, p.getZ(j) * f); } }
      mg.computeVertexNormals();
      const mt = new THREE.Mesh(mg, std('#8a8f86', 0.9, { flatShading:true })); mt.position.y = 0.21; g.add(mt);
      const snow = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.13, 9), std('#f5f3ee', 0.7, { flatShading:true })); snow.position.y = 0.365; g.add(snow);
      const mt2 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.26, 8), std('#7d8278', 0.9, { flatShading:true })); mt2.position.set(0.2, 0.13, 0.05); g.add(mt2);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), brass); pole.position.y = 0.5; g.add(pole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.07), std('#c3332a', 0.6, { side:THREE.DoubleSide })); flag.position.set(0.06, 0.555, 0); g.add(flag);
      return { g, h:0.6, flag }; },
  };
  const generic = () => { const g = new THREE.Group();
    const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.38, 4), brass); ob.position.y = 0.19; ob.rotation.y = Math.PI / 4; g.add(ob);
    return { g, h:0.4 }; };

  /* 받침 판 — 종이 원판 둘레에 단계 색 고리 + 금빛 진도 호 */
  const plateTex = (accent, pct) => canvasTex(256, 256, (g, w, h) => {
    paperBase(g, w, h, '#f6ecd3', 1500);
    const cx = w / 2, cy = h / 2;
    g.strokeStyle = accent; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, w * 0.43, 0, TAU); g.stroke();
    g.strokeStyle = 'rgba(40,20,4,.25)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, w * 0.43 - 9, 0, TAU); g.stroke();
    if(pct > 0){ g.strokeStyle = '#f2cf74'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, w * 0.43, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, pct / 100)); g.stroke(); }
  });
  const hits = [], holders = [], lifts = stops.map(() => 0), hotV = stops.map(() => 0), anims = [];
  const hitMat = new THREE.MeshBasicMaterial({ visible:false });
  stops.forEach((s, i) => {
    const st = stages[i];
    const holder = new THREE.Group(); holder.position.set(s.x, s.y, s.z); scene.add(holder);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.27, 0.03, 40), [std('#e8d9b8', 0.85), std(0xffffff, 0.8, { map:plateTex(st.accent || '#0E2C57', st.pct || 0) }), std('#e8d9b8', 0.85)]);
    plate.position.y = 0.015; plate.receiveShadow = true; plate.castShadow = true; holder.add(plate);
    const lifter = new THREE.Group(); lifter.position.y = 0.03; holder.add(lifter);
    const made = (props[st.key] || generic)();
    cast(made.g); lifter.add(made.g);
    if(made.flag) anims.push(t => { made.flag.rotation.y = Math.sin(t * 2.4 + i) * 0.35; });
    if(made.flame) anims.push(t => { const f = 0.8 + Math.sin(t * 17) * 0.15 + Math.sin(t * 7.3) * 0.1; made.flame.scale.set(1, f, 1); });
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), new THREE.MeshBasicMaterial({ map:glowTex, color:'#ffcc6a', transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending }));
    hl.rotation.x = -Math.PI / 2; hl.position.y = 0.035; hl.renderOrder = 2; holder.add(hl);
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, Math.max(0.45, made.h + 0.1), 12), hitMat);
    hit.position.y = Math.max(0.45, made.h + 0.1) / 2; hit.userData.stop = i; holder.add(hit); hits.push(hit);
    holders.push({ holder, lifter, hl, h:made.h });
    const topY = made.h + 0.08;
    s.anchor = lift => s.up ? V3(s.x, s.y + topY + lift, s.z - 0.05) : V3(s.x, s.y + 0.03, s.z + 0.3);
  });

  /* ---- 지금 여기: 금빛 고리 + 아이(또는 놋쇠 말) ---- */
  const cs = stops[curIdx];
  const ringM = new THREE.MeshBasicMaterial({ color:'#ffd27a', transparent:true, opacity:0.85, blending:THREE.AdditiveBlending, depthWrite:false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.29, 0.34, 48), ringM); ring.rotation.x = -Math.PI / 2; ring.position.set(cs.x, cs.y + 0.012, cs.z); ring.renderOrder = 3; scene.add(ring);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#ffcf6a', transparent:true, opacity:0.55, depthWrite:false, blending:THREE.AdditiveBlending }));
  glow.scale.set(1.1, 1.1, 1); glow.position.set(cs.x, cs.y + 0.2, cs.z); scene.add(glow);
  const who = new THREE.Group();
  const standX = cs.x + 0.3, standZ = cs.z + (cs.up ? 0.2 : -0.12);
  who.position.set(standX, pageY(standX), standZ); scene.add(who);
  let kidUpdate = null;
  if(kid && kid.object){
    who.add(kid.object); kid.faceNow && kid.faceNow(-0.35);
    kidUpdate = (t, dt) => { try { kid.update(dt, t); } catch(e){} };
  } else {
    const pawn = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.05, 24), brass); base.position.y = 0.025; pawn.add(base);
    const bodyP = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 24), brass); bodyP.position.y = 0.15; pawn.add(bodyP);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 14), brass); head.position.y = 0.28; pawn.add(head);
    cast(pawn); who.add(pawn);
  }
  const whoShadow = blob(0.45, 0.3, 0.6); whoShadow.position.set(standX, pageY(standX) + 0.006, standZ); scene.add(whoShadow);

  /* ---- 곁들이: 잉크병과 깃펜 · 숫자 블록 · 놋쇠 돋보기(누를 수 없음) ---- */
  {
    const ink = new THREE.Group();
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.3, 28), new THREE.MeshPhysicalMaterial({ color:'#1b2a3a', roughness:0.08, clearcoat:1, transmission:0.2, transparent:true, opacity:0.95 }));
    bottle.position.y = 0.15; ink.add(bottle);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 20), brass); neck.position.y = 0.34; ink.add(neck);
    const quill = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.0), std('#f2ecdf', 0.7, { side:THREE.DoubleSide })); quill.position.set(0.1, 0.75, 0); quill.rotation.z = -0.4; ink.add(quill);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.1, 6), std('#d9d0bc', 0.6)); shaft.position.set(0.08, 0.7, 0); shaft.rotation.z = -0.4; ink.add(shaft);
    cast(ink); ink.scale.setScalar(0.7); ink.position.set(PW + 0.75, 0, -1.2); scene.add(ink);
    const tiles = new THREE.Group();
    [['7', -0.2, 0, 0.3], ['+', 0.14, 0.05, -0.2], ['3', 0.02, 0.33, 0.5]].forEach(([t, x, z, ry]) => { const tl = faceTile(t, 0.26, '#d9b27c'); tl.position.set(x, 0, z); tl.rotation.y = ry; tiles.add(tl); });
    cast(tiles); tiles.position.set(-PW - 0.75, 0, 0.9); scene.add(tiles);
    const mag = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 12, 40), brass); rim.rotation.x = Math.PI / 2; rim.position.y = 0.04; mag.add(rim);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.29, 32), new THREE.MeshPhysicalMaterial({ color:'#ffffff', roughness:0.05, transmission:0.9, transparent:true, opacity:0.35 })); lens.rotation.x = -Math.PI / 2; lens.position.y = 0.04; mag.add(lens);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.55, 12), std('#3a2412', 0.5)); handle.rotation.z = Math.PI / 2; handle.position.set(0.58, 0.04, 0); mag.add(handle);
    cast(mag); mag.rotation.y = -0.6; mag.position.set(-PW - 0.7, 0, -1.1); scene.add(mag);
  }

  /* ---- 움직임 ---- */
  function animate(t, dt, reduce, hot){
    let moving = false;
    holders.forEach((h, i) => {
      const goal = i === hot ? 1 : 0;
      const d = goal - hotV[i];
      if(Math.abs(d) > 0.002){ hotV[i] += d * Math.min(1, dt * 10); moving = true; } else hotV[i] = goal;
      if(reduce) hotV[i] = goal;
      lifts[i] = hotV[i] * 0.06;
      h.lifter.position.y = 0.03 + lifts[i];
      h.hl.material.opacity = hotV[i] * 0.9;
    });
    if(!reduce){
      anims.forEach(f => f(t));
      ringM.opacity = 0.6 + 0.3 * Math.sin(t * 2.4);
      glow.material.opacity = 0.4 + 0.18 * Math.sin(t * 2.4);
      if(kidUpdate) kidUpdate(t, dt);
      else who.position.y = pageY(standX) + Math.abs(Math.sin(t * 2.2)) * 0.03;
      moving = true;
    } else if(kidUpdate) kidUpdate(0, 0);
    return moving;
  }

  return { stops, hits, animate, lift:lifts, bookHalfW:PW + 0.18, bookZ0:-PD / 2 - 0.12, bookZ1:PD / 2 + 0.12 };
}
