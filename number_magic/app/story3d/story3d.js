/* ============================================================
   수의 마법 — 3D 스토리 모드 머리 그림(마법 학습 여행 · S.view==='roadmap')
   2026-09-26 첫판(어두운 책상 위 그림책) → 같은 날 다시 그림(원장 "좀 밝으면서 신비롭고…
   90년대 파이널 판타지 rpg 같아" · "숲이라든지 하늘도 있고 좀 밝아야" · "스토리가 있어야지").
   지금: 밝은 아침 책상 위에 **90° 로 펼친 팝업 그림책** 한 권. 뒤쪽 쪽은 일어서서 하늘이 되고
   (구름·해무리·옅은 별자리), 앞쪽 쪽은 누워서 들판이 된다(숲·강·다리·구불구불한 길).
   책을 여는 순간 종이 숲과 이정표가 차례로 일어서고(팝업), 아이(app/char3d)가 앞 장에서
   지금 장까지 길을 걸어온다. 장(章) = 단계(data/stages.js):
     수의 나라 = 숫자 나무 블록과 병아리 · 새싹 = 화분의 새싹 · 도약 = 로켓 · 정복 = 왕관 · 경시의 탑 = 탑 ·
     중학교 = x 가 얹힌 책 더미(동쪽 다리 건너) · 고등 = 구름 걸린 봉우리 (모르는 key 는 빛나는 오벨리스크)
   이정표 받침 둘레의 금빛 호 = 그 단계의 진도. 지나온 길은 금빛 점, 남은 길은 옅은 먹 점선.
   왼쪽 위 이야기 쪽지(서리 유리 카드)가 지금 장의 이야기를 들려주고, 이정표에 올리면 그 장 이야기로 바뀐다.
   잠금은 없다(자유 선택 원칙) — 어느 이정표든 누르면 그 단계로 간다.
   HTML 은 "밝은 신비(Luminous Arcana)" 규칙: 서리 유리 카드 · 진주 알약 버튼 · 세리프 제목 · 선 아이콘.

   ── 인터페이스 ──────────────────────────────────────────
   import { mountStory3D } from './story3d/story3d.js';
   const ctl = await mountStory3D(container, {
     lang: 'ko'|'en'|'zh',
     stages: [{ key, name, band, accent, pct, beat? }, …],  // 이미 번역된 문자열. 순서 = 이야기 순서(장)
     current: 'middle',                                    // 아이가 서 있는 단계 key(없으면 첫 단계)
     here: { label:'여기부터!', sub:'정수 개념·수직선' } | null, // 진주 알약 — 누르면 onHere()
     avatar: { kind:'boy'|'girl' },
     onStage: key => {},     // 이정표·꼬리표를 눌렀을 때
     onHere: () => {},       // 진주 알약을 눌렀을 때
     reducedMotion: bool?    // 생략하면 prefers-reduced-motion
   });
   // ctl === null → WebGL 없음·생성 실패(2D 가 그대로 남는다).  ctl.dispose() — 모든 자원·리스너·DOM 해제.
   container 는 높이가 있는 요소. 안에 .sd3 를 채운다.
   성능 규칙(town3d·title3d 와 같다): pixelRatio ≤ 1.5, 그림자 1024, 화면 밖·탭 숨김이면 멈춤,
   동작 줄이기면 움직임 없이(팝업·걷기 없이 최종 모습) 필요할 때만 그린다.
   ============================================================ */
import { makeKit, fontsReady, THREE } from '../hero3d/kit.js';

const TXT = {
  hint:{ ko:'이정표를 누르면 그 장으로 가요', en:'Tap a landmark to open that chapter', zh:'点路标，就能翻到那一章' },
  here:{ ko:'지금 여기', en:'You are here', zh:'你在这里' },
  chap:{ ko:n => `제${n}장`, en:n => `Chapter ${n}`, zh:n => `第${n}章` },
  prev:{ ko:'앞 장 보기', en:'Show earlier chapters', zh:'看前面的章节' },
  next:{ ko:'다음 장 보기', en:'Show later chapters', zh:'看后面的章节' },
  map:{ ko:'마법 학습 여행 이야기 지도', en:'Magic learning journey story map', zh:'魔法学习之旅故事地图' },
};
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const tr = (v, lang) => v == null ? '' : typeof v === 'string' ? v : (v[lang] != null ? v[lang] : v.ko || '');
const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };

/* ---------- 스타일(한 번만) — 전부 .sd3 아래로. 밝은 신비(Luminous Arcana) 토큰 ---------- */
const CSS = `
.sd3{position:absolute;inset:0;overflow:hidden;background:#eef1f6;font-family:'Pretendard',var(--font-game,'Jua'),system-ui,sans-serif;
  --la-ink:#26304a;--la-ink-2:#5a6380;--la-gold:#c9a44c;--la-glow-a:#b9a7ff;--la-glow-b:#8fe3d2;--la-glow-c:#9cc8ff;
  --la-serif:"Hahmlet","Gowun Batang","Noto Serif KR","Nanum Myeongjo",Georgia,"Times New Roman",serif;
  --la-pearl:linear-gradient(135deg,#ffffff 0%,#f4efff 35%,#e9fbf6 70%,#fff8e8 100%);
  -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;color:var(--la-ink)}
.sd3 canvas.sd3-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .7s ease;touch-action:pan-y}
.sd3 canvas.sd3-gl.on{opacity:1}
.sd3 canvas.sd3-gl.hot{cursor:pointer}
.sd3 canvas.sd3-gl.grab{cursor:grab}
.sd3-vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 90% 85% at 50% 48%,rgba(238,241,246,0) 62%,rgba(238,241,246,.75) 100%),linear-gradient(180deg,rgba(255,255,255,.25),rgba(255,255,255,0) 22%)}
.sd3-ui{position:absolute;inset:0;pointer-events:none}
/* 이정표 꼬리표 = 서리 유리 알약 */
.sd3-tag{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;margin:0;font:inherit;color:var(--la-ink);will-change:transform;
  display:flex;flex-direction:column;align-items:flex-start;justify-content:center;text-align:left;word-break:keep-all;min-height:44px;padding:5px 13px 5px 12px;
  background:rgba(255,255,255,.78);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(201,164,76,.38);border-radius:14px;
  box-shadow:0 6px 18px rgba(38,48,74,.12),0 1px 0 rgba(255,255,255,.9) inset;transition:box-shadow .2s,translate .2s,background .2s;outline:none;white-space:nowrap}
.sd3-tag b{display:flex;align-items:center;gap:6px;font-family:var(--la-serif);font-weight:600;font-size:15px;line-height:1.2;letter-spacing:-.005em}
.sd3-tag b i{font-style:normal;width:8px;height:8px;border-radius:50%;background:var(--ac,#26304a);box-shadow:0 0 0 2.5px rgba(255,255,255,.9),0 0 0 3.5px rgba(38,48,74,.18);flex:none}
.sd3-tag small{display:block;font-size:11.5px;line-height:1.25;color:var(--la-ink-2);margin-top:1px}
.sd3-tag .ch{display:block;font-size:10.5px;letter-spacing:.08em;color:var(--la-ink-2);margin-bottom:1px}
.sd3-tag.here{background:var(--la-pearl);border-color:rgba(201,164,76,.6);box-shadow:0 0 0 3px rgba(185,167,255,.28),0 8px 22px rgba(120,110,200,.22)}
.sd3-tag .sd3-here{display:inline-flex;align-items:center;gap:4px;margin-top:3px;padding:1px 8px 1px 6px;border-radius:999px;font-size:11px;font-weight:700;color:var(--la-ink);
  background:linear-gradient(90deg,rgba(185,167,255,.35),rgba(143,227,210,.35),rgba(156,200,255,.35));border:1px solid rgba(255,255,255,.9)}
.sd3-tag .sd3-here svg{width:10px;height:10px;color:var(--la-gold)}
.sd3-tag.on,.sd3-tag:hover{translate:0 -2px;background:rgba(255,255,255,.95);box-shadow:0 0 0 3px rgba(156,200,255,.35),0 10px 24px rgba(38,48,74,.18)}
.sd3-tag.here.on,.sd3-tag.here:hover{background:var(--la-pearl)}
.sd3-tag:focus-visible{outline:2.5px solid var(--la-ink);outline-offset:3px}
.sd3-tag.off{visibility:hidden}
.sd3.narrow .sd3-tag{padding:4px 11px 4px 10px;border-radius:12px}
.sd3.narrow .sd3-tag b{font-size:13.5px}
.sd3.narrow .sd3-tag small{font-size:10.5px}
.sd3.narrow .sd3-tag small .bd,.sd3.narrow .sd3-tag .ch{display:none}
/* 이야기 쪽지 — 서리 유리 카드 */
.sd3-story{position:absolute;left:16px;top:14px;width:min(340px,calc(100% - 32px));padding:12px 16px 12px;border-radius:14px;pointer-events:none;
  background:rgba(255,255,255,.74);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(201,164,76,.35);box-shadow:0 6px 24px rgba(38,48,74,.10)}
.sd3-story .eb{display:flex;align-items:center;gap:7px;font-size:11px;letter-spacing:.14em;color:var(--la-ink-2);font-weight:600}
.sd3-story .eb::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(201,164,76,.7),rgba(201,164,76,0))}
.sd3-story .eb svg{width:11px;height:11px;color:var(--la-gold);flex:none}
.sd3-story h3{margin:4px 0 3px;font-family:var(--la-serif);font-weight:600;font-size:20px;line-height:1.25;color:var(--la-ink);letter-spacing:-.01em}
.sd3-story p{margin:0;font-size:14px;line-height:1.55;color:var(--la-ink)}
.sd3-story .hint{margin-top:6px;font-size:11.5px;color:var(--la-ink-2)}
.sd3.narrow .sd3-story{left:10px;top:10px;width:calc(100% - 20px);padding:9px 13px 9px}
.sd3.narrow .sd3-story h3{font-size:17px;margin:2px 0 2px}
.sd3.narrow .sd3-story p{font-size:13px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sd3.narrow .sd3-story .hint{display:none}
/* 여기부터 — 진주 알약 + 무지갯빛 후광 */
.sd3-go{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);pointer-events:auto;cursor:pointer;margin:0;font:inherit;color:var(--la-ink);isolation:isolate;
  display:flex;align-items:center;gap:11px;min-height:50px;max-width:calc(100% - 28px);padding:7px 22px 7px 8px;border-radius:999px;text-align:left;
  background:var(--la-pearl);border:1px solid rgba(201,164,76,.55);box-shadow:0 8px 26px rgba(90,80,160,.20),0 1px 0 #fff inset;transition:translate .2s,box-shadow .2s}
.sd3-go::before{content:"";position:absolute;inset:-10px;z-index:-1;border-radius:999px;filter:blur(14px);opacity:.75;
  background:conic-gradient(from var(--sd3-a,0deg),var(--la-glow-a),var(--la-glow-b),var(--la-glow-c),var(--la-glow-a));animation:sd3Halo 6s linear infinite}
@property --sd3-a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes sd3Halo{to{--sd3-a:360deg}}
.sd3-go:hover{translate:0 -2px;box-shadow:0 12px 30px rgba(90,80,160,.26),0 1px 0 #fff inset}
.sd3-go:focus-visible{outline:2.5px solid var(--la-ink);outline-offset:4px}
.sd3-go .star{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:var(--la-gold);
  background:radial-gradient(circle at 35% 30%,#fff 0%,#f1ecff 60%,#e3f6f2 100%);border:1px solid rgba(201,164,76,.5)}
.sd3-go .star svg{width:18px;height:18px}
.sd3-go b{display:block;font-family:var(--la-serif);font-weight:600;font-size:17px;line-height:1.15}
.sd3-go small{display:block;font-size:12px;line-height:1.25;color:var(--la-ink-2);margin-top:2px;max-width:56vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sd3.narrow .sd3-go{bottom:10px;padding:6px 18px 6px 7px;gap:9px;min-height:48px}
.sd3.narrow .sd3-go b{font-size:15.5px}
/* 좌우 서리 유리 단추 */
.sd3-arrow{position:absolute;top:58%;margin-top:-22px;width:44px;height:44px;border-radius:50%;padding:0;cursor:pointer;pointer-events:auto;display:none;place-items:center;color:var(--la-ink);
  background:rgba(255,255,255,.8);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(201,164,76,.4);box-shadow:0 6px 16px rgba(38,48,74,.14)}
.sd3-arrow svg{width:20px;height:20px}
.sd3-arrow.l{left:8px}.sd3-arrow.r{right:8px}
.sd3.narrow .sd3-arrow{display:grid}
.sd3-arrow[disabled]{opacity:.35;cursor:default}
.sd3-arrow:focus-visible{outline:2.5px solid var(--la-ink);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.sd3 canvas.sd3-gl,.sd3-tag,.sd3-go{transition:none}.sd3-go::before{animation:none}}
@media (forced-colors:active){.sd3-tag,.sd3-go,.sd3-arrow{border:2px solid ButtonText;background:ButtonFace;color:ButtonText}.sd3-go::before{display:none}}
`;
function injectCss(){
  if(document.getElementById('story3d-style')) return;
  const s = document.createElement('style'); s.id = 'story3d-style'; s.textContent = CSS; document.head.appendChild(s);
}
const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l1.9 6.2 6.6.1-5.3 3.9 2 6.3L12 15.2 6.8 19l2-6.3L3.5 8.8l6.6-.1z"/></svg>';
const SPARK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5c.6 5.4 3.9 8.8 9.5 10.5-5.6 1.7-8.9 5.1-9.5 10.5-.6-5.4-3.9-8.8-9.5-10.5C8.1 10.3 11.4 6.9 12 1.5z"/></svg>';

/* ============================================================ */
export async function mountStory3D(container, opts){
  opts = opts || {};
  const stages = (opts.stages || []).filter(s => s && s.key);
  if(!container || !stages.length || !glOK()) return null;
  injectCss();
  const lang = opts.lang || 'ko';
  const reduce = opts.reducedMotion != null ? !!opts.reducedMotion : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const curIdx = Math.max(0, stages.findIndex(s => s.key === opts.current));
  const chapOf = i => (TXT.chap[lang] || TXT.chap.ko)(i + 1);

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
  /* 아이 — char3d(진짜 3D). 못 만들면 진주빛 말 */
  let kid = null;
  try {
    const m = await import('../char3d/char3d.js');
    const kind = opts.avatar && opts.avatar.kind === 'girl' ? 'girl' : 'boy';
    kid = m.makeCharacter(THREE, { kind, height:0.5, blob:false });
  } catch(e){ console.warn('[story3d] char3d', e); kid = null; }
  if(!root.isConnected){ if(kid) kid.dispose(); return null; }

  let k;
  try { k = makeKit(23, { live:true, canvas, width:VW, height:VH }); }
  catch(e){ if(kid) kid.dispose(); root.remove(); return null; }
  const { r, scene, cam } = k;
  let W;
  try { W = buildWorld(k, stages, curIdx, kid, reduce); }
  catch(e){ console.error('[story3d]', e); if(kid) kid.dispose(); try { r.dispose(); } catch(_){} root.remove(); return null; }

  /* ---------- HTML 겹 ---------- */
  const story = document.createElement('div'); story.className = 'sd3-story'; story.setAttribute('aria-live', 'polite');
  ui.appendChild(story);
  let storyIdx = -1;
  function showStory(i){
    if(i === storyIdx || !stages[i]) return; storyIdx = i;
    const s = stages[i];
    story.innerHTML = `<div class="eb">${SPARK}<span>${esc(chapOf(i))}${i === curIdx ? ' · ' + esc(tr(TXT.here, lang)) : ''}</span></div>`
      + `<h3>${esc(s.name)}</h3>${s.beat ? `<p>${esc(s.beat)}</p>` : ''}<div class="hint">${esc(tr(TXT.hint, lang))}</div>`;
  }
  showStory(curIdx);
  const tags = stages.map((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sd3-tag' + (i === curIdx ? ' here' : '');
    b.style.setProperty('--ac', s.accent || '#26304a');
    const pct = Math.max(0, Math.min(100, Math.round(s.pct || 0)));
    b.innerHTML = `<span class="ch">${esc(chapOf(i))}</span><b><i aria-hidden="true"></i>${esc(s.name)}</b><small>${s.band ? `<span class="bd">${esc(s.band)} · </span>` : ''}${pct}%</small>`
      + (i === curIdx ? `<span class="sd3-here">${STAR}${esc(tr(TXT.here, lang))}</span>` : '');
    b.setAttribute('aria-label', `${chapOf(i)} · ${s.name}${s.band ? ' — ' + s.band : ''} · ${pct}%${i === curIdx ? ' · ' + tr(TXT.here, lang) : ''}`);
    b.addEventListener('pointerenter', () => setHot(i, 'btn'));
    b.addEventListener('pointerleave', () => { if(hotSrc === 'btn') setHot(-1); });
    b.addEventListener('focus', () => { setHot(i, 'focus'); if(narrow) panTo(W.stops[i].x); });
    b.addEventListener('blur', () => { if(hotSrc === 'focus') setHot(-1); });
    b.addEventListener('click', () => pickStage(i));
    ui.appendChild(b); return b;
  });
  const arrowSvg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const aL = document.createElement('button'); aL.type = 'button'; aL.className = 'sd3-arrow l'; aL.innerHTML = arrowSvg('M14.5 6l-6 6 6 6'); aL.setAttribute('aria-label', tr(TXT.prev, lang));
  const aR = document.createElement('button'); aR.type = 'button'; aR.className = 'sd3-arrow r'; aR.innerHTML = arrowSvg('M9.5 6l6 6-6 6'); aR.setAttribute('aria-label', tr(TXT.next, lang));
  aL.addEventListener('click', () => panBy(-1)); aR.addEventListener('click', () => panBy(1));
  ui.append(aL, aR);
  let goBtn = null;
  if(opts.here && opts.here.label){
    goBtn = document.createElement('button'); goBtn.type = 'button'; goBtn.className = 'sd3-go';
    goBtn.innerHTML = `<span class="star" aria-hidden="true">${STAR}</span><span><b>${esc(opts.here.label)}</b>${opts.here.sub ? `<small>${esc(opts.here.sub)}</small>` : ''}</span>`;
    goBtn.setAttribute('aria-label', opts.here.sub ? `${opts.here.label} — ${opts.here.sub}` : opts.here.label);
    goBtn.addEventListener('click', () => { try { opts.onHere && opts.onHere(); } catch(e){ console.warn(e); } });
    ui.appendChild(goBtn);
  }

  /* ---------- 강조 ---------- */
  let hot = -1, hotSrc = null;
  function setHot(i, src){
    hot = i; hotSrc = i >= 0 ? src : null;
    tags.forEach((b, j) => b.classList.toggle('on', j === i));
    canvas.classList.toggle('hot', i >= 0 && src === 'gl');
    showStory(i >= 0 ? i : curIdx);
    wake();
  }
  let pickLock = false;
  function pickStage(i){
    if(pickLock || disposed || !stages[i]) return; pickLock = true;
    setTimeout(() => { pickLock = false; }, 350);
    try { opts.onStage && opts.onStage(stages[i].key); } catch(e){ console.warn(e); }
  }

  /* ---------- 구도 ---------- */
  const PITCH = 36;
  let narrow = false, dist = 10, panX = 0, panGoal = 0, panMin = 0, panMax = 0, fitCX = 0, fitCY = 0, fitCZ = 0;
  const T = new THREE.Vector3(), dir = new THREE.Vector3(), _v = new THREE.Vector3();
  const proj = p => { _v.copy(p).project(cam); return [(_v.x + 1) / 2 * VW, (1 - _v.y) / 2 * VH, _v.z]; };
  function place(x){ T.set(x + fitCX, fitCY, fitCZ); cam.position.copy(T).addScaledVector(dir, dist); cam.lookAt(T); cam.updateMatrixWorld(true); }
  let tagSize = [];
  function relayout(){
    [VW, VH] = sizeOf();
    r.setSize(VW, VH, false);
    cam.aspect = VW / VH; cam.fov = 30; cam.updateProjectionMatrix();
    narrow = VW < 640 || VW / VH < 1.15;
    root.classList.toggle('narrow', narrow);
    tagSize = tags.map(b => [b.offsetWidth || 120, b.offsetHeight || 44]);
    const p = THREE.MathUtils.degToRad(narrow ? PITCH - 4 : PITCH);
    dir.set(0, Math.sin(p), Math.cos(p));
    /* 넓으면 이야기 쪽지는 왼쪽 위 구석(하늘 위)에 얹히고, 좁으면 쪽지 밑에서 그림이 시작한다 */
    /* 넓으면 왼쪽 기둥 = 이야기 쪽지 + 그 밑의 진주 알약, 오른쪽 = 그림책. 좁으면 위 = 쪽지, 아래 = 알약 */
    if(goBtn){
      if(narrow){ goBtn.style.left = ''; goBtn.style.top = ''; goBtn.style.bottom = ''; goBtn.style.transform = ''; }
      else { goBtn.style.left = story.offsetLeft + 'px'; goBtn.style.top = (story.offsetTop + story.offsetHeight + 16) + 'px'; goBtn.style.bottom = 'auto'; goBtn.style.transform = 'none'; }
    }
    const topPad = narrow ? story.offsetTop + story.offsetHeight + 8 : 16;
    const botPad = narrow ? (goBtn ? goBtn.offsetHeight + 22 : 12) + 4 : 16, side = narrow ? 56 : 20;
    /* 넓으면 왼쪽 이야기 쪽지 자리를 비우고 그 오른쪽에 책을 놓는다 */
    const leftPad = narrow ? side : Math.max(side, story.offsetLeft + Math.max(story.offsetWidth, goBtn ? goBtn.offsetWidth : 0) + 18);
    const availW = VW - leftPad - side, availH = VH - topPad - botPad;
    const half = narrow ? Math.min(W.halfW, 1.15) : W.halfW + 0.05;
    const pts = [];
    [-half, half].forEach(x => { pts.push(new THREE.Vector3(x, 0.05, W.z1 + 0.06)); pts.push(new THREE.Vector3(x, W.skyTop, W.z0)); });
    fitCX = 0; fitCY = 0.55; fitCZ = (W.z0 + W.z1) / 2 + 0.1; dist = 9;
    for(let it = 0; it < 18; it++){
      place(0);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      const add = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
      pts.forEach(q => { const [x, y] = proj(q); add(x, y); });
      W.stops.forEach((s, i) => { if(narrow && Math.abs(s.x) > half) return;
        const [ax, ay] = proj(s.anchor(0)); const ts = tagSize[i]; const [lx, ly] = tagPos(s, ax, ay, ts);
        if(narrow){ add(ax, ly); add(ax, ly + ts[1]); } else { add(lx, ly); add(lx + ts[0], ly + ts[1]); } });
      const sc = Math.max((x1 - x0) / availW, (y1 - y0) / availH);
      dist *= 1 + (sc - 1) * 0.85;
      const wpp = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) / VH;
      const cy = (y0 + y1) / 2 - (topPad + availH / 2);
      fitCZ += cy * wpp * 0.9 / Math.sin(p);
      if(!narrow) fitCX += ((x0 + x1) / 2 - (leftPad + availW / 2)) * wpp * 0.9;
    }
    const visHalf = dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.aspect * 0.9;
    panMax = narrow ? Math.max(0, W.halfW + 0.2 - visHalf) : 0; panMin = -panMax;
    panGoal = clampPan(narrow ? W.stops[curIdx].x : 0);
    if(!introDone || reduce) panX = panGoal; else panX = clampPan(panX);
    updateArrows();
    wake();
  }
  const clampPan = x => Math.max(panMin, Math.min(panMax, x));
  function panTo(x){ panGoal = clampPan(x); if(reduce) panX = panGoal; updateArrows(); wake(); }
  function panBy(d){
    let near = 0, best = 1e9; W.stops.forEach((s, i) => { const dd = Math.abs(s.x - panGoal); if(dd < best){ best = dd; near = i; } });
    panTo(W.stops[Math.max(0, Math.min(W.stops.length - 1, near + d * 2))].x);
  }
  function updateArrows(){ aL.disabled = panGoal <= panMin + 0.01; aR.disabled = panGoal >= panMax - 0.01; }

  /* 꼬리표 자리 — 뒷줄 이정표는 소품 위, 앞줄은 받침 아래 */
  function tagPos(s, ax, ay, ts){ return s.up ? [ax - ts[0] / 2, ay - ts[1] - 4] : [ax - ts[0] / 2, ay + 4]; }
  const box = el => el ? [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight] : null;
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
    const gb = box(goBtn), sb = box(story), al = narrow ? box(aL) : null, ar = narrow ? box(aR) : null;
    rects.forEach(R => {
      const b = tags[R.i];
      const x = Math.max(4, Math.min(VW - R.w - 4, R.x)), y = Math.max(4, Math.min(VH - R.h - 4, R.y));
      const inter = q => q && x < q[0] + q[2] && q[0] < x + R.w && y < q[1] + q[3] && q[1] < y + R.h;
      /* 가장자리 밖이거나 알약·이야기 쪽지와 겹치면 숨긴다(포커스를 받으면 panTo 로 불러와 다시 보인다) */
      const hide = R.cx < -10 || R.cx > VW + 10 || (narrow && (R.cx < 30 || R.cx > VW - 30)) || inter(gb) || inter(sb) || inter(al) || inter(ar);
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
    let moving = false, dMul = 1, xNow;
    /* 들어올 때(벽시계 기준): 넓은 화면은 지금 장 가까이에서 출발해 책 전체로 물러난다 */
    if(!introStart) introStart = now;
    const it = reduce ? 99 : (now - introStart) / 1000;
    if(!introDone){
      const u = Math.min(1, it / 2.6); const e = u < 0.25 ? 0 : 1 - Math.pow(1 - (u - 0.25) / 0.75, 3);
      if(narrow){ xNow = panX; dMul = 0.86 + 0.14 * e; }
      else { xNow = W.stops[curIdx].x * 0.6 * (1 - e); dMul = 0.62 + 0.38 * e; }
      if(u >= 1) introDone = true; moving = true;
    } else {
      const dx = panGoal - panX; if(Math.abs(dx) > 0.001){ panX += dx * Math.min(1, dt * 7); moving = true; } else panX = panGoal;
      xNow = panX;
    }
    const d0 = dist; dist = d0 * dMul; place(xNow); dist = d0;
    if(W.animate(t, dt, it, reduce, hot)) moving = true;
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
        if(mm.uniforms) Object.values(mm.uniforms).forEach(u => { if(u && u.value && u.value.isTexture) u.value.dispose(); });
        mm.dispose(); });
    });
    if(scene.environment) scene.environment.dispose();
    try { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } catch(e){}
    root.remove();
  }

  relayout();
  wake();
  return {
    dispose,
    /* 화면 쪽에서 단계를 알려 주면 좁은 화면은 그쪽으로 옮겨 간다 */
    focusStage(key){ const i = stages.findIndex(s => s.key === key); if(i >= 0 && narrow) panTo(W.stops[i].x); },
    _debug:{ cam, proj:p => proj(p), stops:W.stops, tags, hitAt:(x, y) => hitAt({ clientX:x, clientY:y }), get narrow(){ return narrow; }, get pan(){ return [panMin, panGoal, panMax, dist]; } },
  };
}

/* ============================================================
   3D 세계 — 밝은 책상 위, 90° 로 펼친 팝업 그림책(뒤 = 하늘, 앞 = 들판)
   ============================================================ */
function buildWorld(k, stages, curIdx, kid, reduce){
  const { scene, rnd, canvasTex, rbox, woodMat, metal, mathText, r } = k;
  const TAU = Math.PI * 2;
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const pop = u => { if(u <= 0) return 0; if(u >= 1) return 1; const s = 1.70158 * 1.4; const v = u - 1; return v * v * ((s + 1) * v + s) + 1; };   /* 살짝 튀어 오르는 팝업 */
  scene.background = new THREE.Color('#eef1f6');
  scene.fog = new THREE.Fog('#eef1f6', 18, 40);
  k.env({ wall:'#efe8dc', intensity:0.9 });
  r.toneMappingExposure = 1.0;

  /* 빛 — 높은 아침 햇살(부드러운 그림자) + 차가운 하늘빛 */
  scene.add(new THREE.HemisphereLight('#eaf2ff', '#efe2c8', 0.9));
  const sun = new THREE.DirectionalLight('#fff4e2', 2.2);
  sun.position.set(-3.5, 8, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left:-4.2, right:4.2, top:4, bottom:-3, near:1, far:22 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02; sun.shadow.radius = 6;
  scene.add(sun, sun.target);
  const skyL = new THREE.DirectionalLight('#cfe0ff', 0.55); skyL.position.set(5, 6, -2); scene.add(skyL);

  /* 공용 */
  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const cast = o => { o.traverse(m => { if(m.isMesh && !m.userData.noShadow){ m.castShadow = true; m.receiveShadow = true; } }); return o; };
  const brass = metal('#d8b766', 0.3), gold = metal('#e6c46e', 0.25);
  const std = (color, rough, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness:rough == null ? 0.6 : rough }, o || {}));
  const paint = c => new THREE.MeshPhysicalMaterial({ color:c, roughness:0.45, clearcoat:0.4, clearcoatRoughness:0.4 });
  const paperGrain = (g, w, h, n) => { for(let i = 0; i < (n || 4000); i++){ g.fillStyle = `rgba(${140 + rnd() * 60},${120 + rnd() * 50},${90 + rnd() * 40},${rnd() * 0.05})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 4); } };
  const blob = (g, x, y, rx, ry, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, rx); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rx, 0, TAU); g.fill(); g.restore(); };

  /* ---- 밝은 참나무 책상 ---- */
  const deskTex = canvasTex(1024, 1024, (g, w, h) => {
    const planks = 4, ph = h / planks;
    for(let p = 0; p < planks; p++){
      const tone = [[218, 190, 150], [208, 178, 138], [222, 196, 158], [212, 184, 144]][p];
      g.fillStyle = `rgb(${tone[0]},${tone[1]},${tone[2]})`; g.fillRect(0, p * ph, w, ph);
      for(let i = 0; i < 90; i++){
        const y = p * ph + rnd() * ph;
        g.strokeStyle = `rgba(${150 + rnd() * 30},${110 + rnd() * 20},${70 + rnd() * 20},${0.06 + rnd() * 0.16})`;
        g.lineWidth = 0.6 + rnd() * 2.2; g.beginPath(); g.moveTo(0, y);
        for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / (130 + p * 20) + i) * 4 + Math.sin(x / 33 + i * 3) * 1.2);
        g.stroke();
      }
      g.fillStyle = 'rgba(140,100,60,.35)'; g.fillRect(0, p * ph, w, 2);
      g.fillStyle = 'rgba(255,250,240,.3)'; g.fillRect(0, p * ph + 2, w, 2);
    }
  }, [4, 3]);
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(44, 32), std(0xffffff, 0.55, { map:deskTex }));
  desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);

  /* ---- 책(90° 로 펼침) — 앞 쪽이 들판, 뒤 쪽이 하늘 ---- */
  const HW = 2.75, GD = 2.8, SH = 2.35, TH = 0.07;       /* 반너비 · 들판 깊이 · 하늘 높이 · 들판 두께 */
  const Z0 = -GD / 2, Z1 = GD / 2;                          /* 제본(뒤) z · 앞 가장자리 z */
  const book = new THREE.Group(); scene.add(book);
  const clothTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d9def0'; g.fillRect(0, 0, w, h);
    for(let y = 0; y < h; y += 2){ g.fillStyle = `rgba(90,100,140,${0.03 + rnd() * 0.04})`; g.fillRect(0, y, w, 1); }
    for(let x = 0; x < w; x += 2){ g.fillStyle = `rgba(255,255,255,${0.03 + rnd() * 0.05})`; g.fillRect(x, 0, 1, h); } });
  clothTex.wrapS = clothTex.wrapT = THREE.RepeatWrapping; clothTex.repeat.set(4, 3);
  const cloth = std(0xffffff, 0.85, { map:clothTex });
  const coverB = new THREE.Mesh(rbox(HW * 2 + 0.2, 0.05, GD + 0.12, 0.05), cloth); coverB.position.set(0, 0, 0.03); coverB.receiveShadow = true; book.add(coverB);
  const coverS = new THREE.Mesh(new THREE.BoxGeometry(HW * 2 + 0.2, SH + 0.1, 0.05), cloth); coverS.position.set(0, SH / 2 + 0.03, Z0 - 0.06); coverS.castShadow = coverS.receiveShadow = true; book.add(coverS);
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, HW * 2 + 0.2, 20, 1, false, Math.PI, Math.PI / 2), cloth); spine.rotation.z = Math.PI / 2; spine.position.set(0, 0.03, Z0 - 0.02); book.add(spine);
  /* 들판 쪽 종이 뭉치(앞 가장자리 결) */
  const edgeTex = canvasTex(256, 32, (g, w, h) => { g.fillStyle = '#f8f2e4'; g.fillRect(0, 0, w, h); for(let y = 0; y < h; y += 2){ g.fillStyle = `rgba(170,140,100,${0.06 + rnd() * 0.12})`; g.fillRect(0, y, w, 1); } });
  const edgeM = std(0xffffff, 0.9, { map:edgeTex }), faceM = std('#faf5ea', 0.9);
  const stack = new THREE.Mesh(new THREE.BoxGeometry(HW * 2, TH, GD), [edgeM, edgeM, faceM, faceM, edgeM, edgeM]);
  stack.position.set(0, 0.05 + TH / 2, 0); stack.castShadow = stack.receiveShadow = true; book.add(stack);
  const GY = 0.05 + TH + 0.001;                             /* 들판 윗면 높이 */

  /* ---- 이정표 자리 — 들판 위 지그재그(뒷줄·앞줄 번갈아) ---- */
  const n = stages.length;
  const xs0 = -HW + 0.55, xs1 = HW - 0.55;
  const stops = stages.map((s, i) => {
    const x = n === 1 ? 0 : xs0 + (xs1 - xs0) * i / (n - 1);
    const up = i % 2 === 0;
    const z = (up ? -0.42 : 0.55) + Math.sin(i * 2.3) * 0.06;
    return { i, key:s.key, x, z, y:GY, up };
  });
  const ctrl = [V3(-HW + 0.05, 0, Z1 - 0.25), ...stops.map(s => V3(s.x, 0, s.z)), V3(HW - 0.1, 0, Z0 + 0.35)];
  const curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal');
  const NS = 500, samples = curve.getPoints(NS);
  const nearestU = (x, z) => { let best = 1e9, j0 = 0; samples.forEach((p, j) => { const d = Math.hypot(p.x - x, p.z - z); if(d < best){ best = d; j0 = j; } }); return j0; };
  const stopU = stops.map(s => nearestU(s.x, s.z));
  const curU = stopU[curIdx];
  /* 강 — 동쪽 다리(경시의 탑 → 중학교 사이)에서 길을 가로지른다. 중학교가 없으면 끝 두 장 사이 */
  const mi = stages.findIndex(s => s.key === 'middle');
  const riverAfter = Math.max(0, Math.min(n - 2, mi >= 1 ? mi - 1 : n - 2));
  const bridgeU = n > 1 ? Math.round((stopU[riverAfter] + stopU[riverAfter + 1]) / 2) : Math.round(NS * 0.7);
  const bp = samples[bridgeU], bt = curve.getTangentAt(bridgeU / NS);
  const bAng = Math.atan2(bt.x, bt.z);                      /* 길 방향 */
  const rvDir = V3(Math.cos(bAng), 0, -Math.sin(bAng));      /* 길에 수직 = 강 방향 */

  /* ---- 들판 그림 ---- */
  const CW = 1600, CH = Math.round(CW * GD / (HW * 2));
  const X = x => (x + HW) / (HW * 2) * CW, Zp = z => (z - Z0) / GD * CH;
  const pxPerW = CW / (HW * 2);
  const groundTex = canvasTex(CW, CH, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#c4dcc6'); bg.addColorStop(0.5, '#d3e5b8'); bg.addColorStop(1, '#e4ebc2'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 70; i++) blob(g, rnd() * w, rnd() * h, 40 + rnd() * 120, 20 + rnd() * 60, rnd() < 0.5 ? '130,180,105' : '190,215,140', 0.3);
    for(let i = 0; i < 26; i++) blob(g, rnd() * w, rnd() * h * 0.5, 60 + rnd() * 90, 30 + rnd() * 40, '160,200,210', 0.14);
    paperGrain(g, w, h, 6000);
    /* 강 */
    const rx0 = X(bp.x - rvDir.x * 4), rz0 = Zp(bp.z - rvDir.z * 4), rx1 = X(bp.x + rvDir.x * 4), rz1 = Zp(bp.z + rvDir.z * 4);
    g.lineCap = 'round'; g.lineJoin = 'round';
    const river = (wd, col) => { g.strokeStyle = col; g.lineWidth = wd; g.beginPath(); g.moveTo(rx0, rz0);
      const mx = (rx0 + rx1) / 2, mz = (rz0 + rz1) / 2; g.bezierCurveTo(mx - 60, mz - 30, mx + 60, mz + 30, rx1, rz1); g.stroke(); };
    river(110, 'rgba(160,205,235,.55)'); river(74, 'rgba(170,215,245,.9)'); river(18, 'rgba(255,255,255,.5)');
    /* 꽃 점 */
    for(let i = 0; i < 260; i++){ const c = ['rgba(255,255,255,.85)', 'rgba(255,214,120,.8)', 'rgba(210,190,255,.8)', 'rgba(255,190,200,.75)'][i % 4]; g.fillStyle = c; g.beginPath(); g.arc(rnd() * w, rnd() * h, 2 + rnd() * 2.5, 0, TAU); g.fill(); }
    /* 길 */
    const path = (from, to) => { g.beginPath(); for(let j = from; j <= to; j++){ const p = samples[j]; j === from ? g.moveTo(X(p.x), Zp(p.z)) : g.lineTo(X(p.x), Zp(p.z)); } };
    g.setLineDash([]); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 44; path(0, NS); g.stroke();
    g.strokeStyle = '#f6ecd4'; g.lineWidth = 34; path(0, NS); g.stroke();
    g.strokeStyle = 'rgba(190,160,110,.35)'; g.lineWidth = 2; g.setLineDash([2, 10]); path(0, NS); g.stroke();
    g.setLineDash([14, 14]); g.strokeStyle = 'rgba(90,99,128,.45)'; g.lineWidth = 4; path(curU, NS); g.stroke();
    g.setLineDash([]);
    if(curU > 0){ g.fillStyle = '#c9a44c'; for(let j = 0; j <= curU; j += 7){ const p = samples[j]; g.beginPath(); g.arc(X(p.x), Zp(p.z), 5.5, 0, TAU); g.fill(); } }
    /* 이정표 자리의 옅은 원 */
    stops.forEach(s => { g.strokeStyle = 'rgba(201,164,76,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(X(s.x), Zp(s.z), 0.36 * pxPerW, 0, TAU); g.stroke(); });
    /* 가장자리 금빛 실선 */
    g.strokeStyle = 'rgba(201,164,76,.55)'; g.lineWidth = 3; g.strokeRect(14, 14, w - 28, h - 28);
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, GD), std(0xffffff, 0.92, { map:groundTex }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = GY; ground.receiveShadow = true; book.add(ground);

  /* ---- 하늘 쪽(세운 페이지) ---- */
  const SW = 1600, SHp = Math.round(SW * SH / (HW * 2));
  const skyTex = canvasTex(SW, SHp, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#9fc4f2'); bg.addColorStop(0.45, '#cfe2f8'); bg.addColorStop(0.8, '#f1efe6'); bg.addColorStop(1, '#f7f0df'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    /* 해무리(오른쪽 위) */
    const sx = w * 0.8, sy = h * 0.2; const sg = g.createRadialGradient(sx, sy, 0, sx, sy, h * 0.5); sg.addColorStop(0, 'rgba(255,250,230,.95)'); sg.addColorStop(0.18, 'rgba(255,240,200,.6)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = sg; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(201,164,76,.55)'; g.lineWidth = 2; g.beginPath(); g.arc(sx, sy, h * 0.085, 0, TAU); g.stroke();
    g.strokeStyle = 'rgba(185,167,255,.35)'; g.lineWidth = 1.5; g.beginPath(); g.arc(sx, sy, h * 0.13, 0, TAU); g.stroke();
    /* 옅은 별자리(왼쪽 위) + 별가루 */
    const cons = [[0.08, 0.12], [0.15, 0.2], [0.23, 0.14], [0.3, 0.24], [0.4, 0.17], [0.47, 0.09]];
    g.strokeStyle = 'rgba(90,99,128,.3)'; g.lineWidth = 1.5; g.beginPath(); cons.forEach(([a, b], i) => { const x = a * w, y = b * h; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
    cons.forEach(([a, b]) => { const x = a * w, y = b * h; g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.arc(x, y, 4.5, 0, TAU); g.fill(); g.strokeStyle = 'rgba(201,164,76,.8)'; g.lineWidth = 1.5; g.stroke(); });
    for(let i = 0; i < 160; i++){ const x = rnd() * w, y = rnd() * h * 0.55; g.fillStyle = `rgba(255,255,255,${0.4 + rnd() * 0.5})`; g.beginPath(); g.arc(x, y, 0.8 + rnd() * 1.8, 0, TAU); g.fill(); }
    /* 초승달 선(왼쪽) */
    g.strokeStyle = 'rgba(201,164,76,.7)'; g.lineWidth = 2.5; g.beginPath(); g.arc(w * 0.06, h * 0.36, 26, -1.2, 1.9); g.stroke();
    /* 수채 구름 */
    for(let i = 0; i < 9; i++){ const cx = rnd() * w, cy = h * (0.25 + rnd() * 0.35); for(let j = 0; j < 5; j++) blob(g, cx + (j - 2) * 38, cy + Math.sin(j) * 10, 60 + rnd() * 40, 30 + rnd() * 16, '255,255,255', 0.55); }
    /* 먼 산 · 숲 실루엣 */
    const ridge = (base, amp, col, seed) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, h); for(let x = 0; x <= w; x += 16){ const y = h * base - (Math.sin(x / 190 + seed) * 0.5 + Math.sin(x / 71 + seed * 2) * 0.25 + 0.5) * amp * h; g.lineTo(x, y); } g.lineTo(w, h); g.closePath(); g.fill(); };
    ridge(0.86, 0.18, 'rgba(170,190,215,.55)', 1); ridge(0.93, 0.12, 'rgba(150,185,170,.55)', 3);
    for(let i = 0; i < 70; i++){ const x = rnd() * w, y = h * (0.9 + rnd() * 0.08), s = 10 + rnd() * 14; g.fillStyle = 'rgba(120,160,130,.55)'; g.beginPath(); g.moveTo(x, y - s * 2); g.lineTo(x - s * 0.7, y); g.lineTo(x + s * 0.7, y); g.closePath(); g.fill(); }
    paperGrain(g, w, h, 3000);
    g.strokeStyle = 'rgba(201,164,76,.55)'; g.lineWidth = 3; g.strokeRect(14, 14, w - 28, h - 28);
  });
  const skyPage = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, SH), new THREE.MeshBasicMaterial({ map:skyTex, color:'#f4f6fb', toneMapped:false }));
  skyPage.position.set(0, 0.05 + SH / 2, Z0 - 0.028); book.add(skyPage);   /* 칠한 하늘빛 그대로(톤 매핑 없이) — 밝고 맑게 */

  /* ---- 팝업 종이 — 오려 낸 산·숲 두 겹(책을 열면 일어선다) · 종이 나무 ---- */
  const layerY = (x, w, h, amp, seed) => h * (1 - amp * (0.55 + 0.3 * Math.sin(x / 150 + seed) + 0.15 * Math.sin(x / 47 + seed * 3)));
  const layerDraw = (fill, edge, amp, seed, trees) => (g, w, h) => {
    g.beginPath(); g.moveTo(0, h);
    for(let x = 0; x <= w; x += 8) g.lineTo(x, layerY(x, w, h, amp, seed));
    g.lineTo(w, h); g.closePath();
    g.fillStyle = fill; g.fill(); g.strokeStyle = edge; g.lineWidth = 6; g.stroke();
    if(trees){ for(let i = 0; i < trees; i++){ const x = (i + 0.5) / trees * w + (rnd() - 0.5) * 30, s = 16 + rnd() * 16, y = layerY(x, w, h, amp, seed) + 6;
      g.fillStyle = fill; g.beginPath(); g.moveTo(x, y - s * 2.2); g.lineTo(x - s * 0.8, y + 4); g.lineTo(x + s * 0.8, y + 4); g.closePath(); g.fill(); g.strokeStyle = edge; g.lineWidth = 4; g.stroke(); } }
  };
  const popups = [];   /* {obj, delay, kind:'rise'|'scale'} */
  const mkLayer = (z, ht, fill, edge, amp, seed, trees, delay) => {
    const tex = canvasTex(1024, Math.round(1024 * ht / (HW * 2)), layerDraw(fill, edge, amp, seed, trees));
    const m = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2 - 0.04, ht), new THREE.MeshStandardMaterial({ map:tex, transparent:true, alphaTest:0.3, roughness:0.9, side:THREE.DoubleSide }));
    m.geometry.translate(0, ht / 2, 0);
    const hinge = new THREE.Group(); hinge.position.set(0, GY, z); hinge.add(m); m.castShadow = true; m.receiveShadow = true; book.add(hinge);
    popups.push({ obj:hinge, delay, kind:'rise' });
  };
  mkLayer(Z0 + 0.14, 0.62, '#c9dcea', 'rgba(255,255,255,.95)', 0.8, 1.7, 0, 0.0);
  mkLayer(Z0 + 0.34, 0.46, '#b7d6b4', 'rgba(255,255,255,.95)', 0.7, 4.2, 26, 0.12);
  /* 종이 나무 — 길·이정표·강을 피해 흩어 심는다 */
  const treeTex = canvasTex(256, 384, (g, w, h) => {
    const edge = 'rgba(255,255,255,.98)';
    g.lineJoin = 'round';
    g.fillStyle = '#a57e56'; g.strokeStyle = edge; g.lineWidth = 10; g.beginPath(); g.rect(w * 0.44, h * 0.62, w * 0.12, h * 0.34); g.stroke(); g.fill();
    const puffs = [[0.5, 0.3, 0.3, '#8fc088'], [0.3, 0.46, 0.22, '#7fb47e'], [0.7, 0.46, 0.22, '#9ccb90'], [0.5, 0.52, 0.24, '#86bb83']];
    g.strokeStyle = edge; g.lineWidth = 12; puffs.forEach(([x, y, rr]) => { g.beginPath(); g.arc(x * w, y * h, rr * w, 0, TAU); g.stroke(); });
    puffs.forEach(([x, y, rr, c]) => { g.fillStyle = c; g.beginPath(); g.arc(x * w, y * h, rr * w, 0, TAU); g.fill(); });
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(w * 0.42, h * 0.24, w * 0.08, 0, TAU); g.fill();
  });
  const pineTex = canvasTex(256, 384, (g, w, h) => {
    g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,255,255,.98)'; g.lineWidth = 10;
    const tri = (y0, y1, hw, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(w / 2, y0); g.lineTo(w / 2 - hw, y1); g.lineTo(w / 2 + hw, y1); g.closePath(); g.stroke(); g.fill(); };
    g.fillStyle = '#9a7552'; g.fillRect(w * 0.45, h * 0.8, w * 0.1, h * 0.17);
    tri(h * 0.3, h * 0.84, w * 0.42, '#6fa889'); tri(h * 0.16, h * 0.62, w * 0.33, '#7db797'); tri(h * 0.04, h * 0.4, w * 0.24, '#8cc6a3');
  });
  const treeMats = [treeTex, pineTex].map(t => new THREE.MeshStandardMaterial({ map:t, transparent:true, alphaTest:0.4, roughness:0.9, side:THREE.DoubleSide }));
  const treeGeo = new THREE.PlaneGeometry(1, 1.5); treeGeo.translate(0, 0.75, 0);
  let planted = 0;
  for(let tries = 0; tries < 300 && planted < 22; tries++){
    const x = -HW + 0.25 + rnd() * (HW * 2 - 0.5), z = Z0 + 0.55 + rnd() * (GD - 0.75);
    if(stops.some(s => Math.hypot(s.x - x, s.z - z) < 0.5) || samples.some((p, j) => j % 5 === 0 && Math.hypot(p.x - x, p.z - z) < 0.28)) continue;
    /* 강 위는 피한다 — 강 중심선까지의 거리 */
    const dx = x - bp.x, dz = z - bp.z, al = dx * rvDir.x + dz * rvDir.z, perp = Math.hypot(dx - al * rvDir.x, dz - al * rvDir.z);
    if(perp < 0.3) continue;
    const s = 0.2 + rnd() * 0.16;
    const m = new THREE.Mesh(treeGeo, treeMats[rnd() < 0.45 ? 1 : 0]); m.scale.set(s, s, s); m.castShadow = true;
    const hinge = new THREE.Group(); hinge.position.set(x, GY, z); hinge.rotation.y = (rnd() - 0.5) * 0.5; hinge.add(m); book.add(hinge);
    popups.push({ obj:hinge, delay:0.15 + rnd() * 0.5, kind:'rise' });
    planted++;
  }
  /* 다리 — 길이 강을 건너는 자리(동쪽 다리) */
  {
    const br = new THREE.Group(), arc = 0.05;
    const plankM = woodMat('#e2c8a0', [150, 110, 70]);
    for(let j = 0; j < 7; j++){ const u = j / 6 - 0.5; const pl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.085), plankM); pl.position.set(0, 0.02 + arc * (1 - 4 * u * u), u * 0.6); pl.rotation.x = -u * 0.35; br.add(pl); }
    [-1, 1].forEach(sx => { for(let j = 0; j < 4; j++){ const u = j / 3 - 0.5; const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.09, 6), brass); post.position.set(sx * 0.105, 0.07 + arc * (1 - 4 * u * u), u * 0.56); br.add(post); }
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.58), brass); rail.position.set(sx * 0.105, 0.12 + arc * 0.6, 0); br.add(rail); });
    cast(br); br.position.set(bp.x, GY, bp.z); br.rotation.y = bAng; book.add(br);
    popups.push({ obj:br, delay:0.5, kind:'scale' });
  }

  /* ---- 이정표 소품 ---- */
  const faceTile = (txt, size, wood) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(rbox(size, size, size, size * 0.12), woodMat(wood || '#e8cfa6', [170, 130, 80])));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(size * 0.86, size * 0.86), std(0xffffff, 0.6, { map:canvasTex(128, 128, (c, w, h) => {
      c.fillStyle = '#f7ebd3'; c.fillRect(0, 0, w, h); c.fillStyle = '#26304a'; c.textBaseline = 'middle'; mathText(c, txt, w / 2, h / 2 + 4, 84, { align:'center' }); }) }));
    face.rotation.x = -Math.PI / 2; face.position.y = size + 0.002; g.add(face);
    const front = face.clone(); front.rotation.set(0, 0, 0); front.position.set(0, size / 2, size / 2 + 0.002); g.add(front);
    return g;
  };
  const props = {
    numberland(){ const g = new THREE.Group();
      const a = faceTile('1', 0.16, '#f0d9b0'); a.position.set(-0.09, 0, 0.04); a.rotation.y = 0.2;
      const b = faceTile('2', 0.16, '#e6c898'); b.position.set(0.09, 0, 0.02); b.rotation.y = -0.15;
      const c = faceTile('3', 0.16, '#f3dfba'); c.position.set(0.0, 0.16, 0.03); c.rotation.y = 0.05;
      /* 병아리 한 마리 */
      const chick = new THREE.Group(); const yel = paint('#ffd66b');
      const bd = new THREE.Mesh(new THREE.SphereGeometry(0.055, 18, 12), yel); bd.scale.set(1, 0.9, 1.1); bd.position.y = 0.05; chick.add(bd);
      const hd = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 10), yel); hd.position.set(0, 0.105, 0.03); chick.add(hd);
      const bk = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.025, 8), paint('#f0934a')); bk.rotation.x = Math.PI / 2; bk.position.set(0, 0.1, 0.07); chick.add(bk);
      [-1, 1].forEach(sx => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.0065, 8, 6), std('#26304a', 0.4)); e.position.set(sx * 0.016, 0.115, 0.06); chick.add(e); });
      const chickW = new THREE.Group(); chickW.add(chick); chickW.position.set(0.2, 0, 0.1); chickW.rotation.y = -0.4;
      g.add(a, b, c, chickW); return { g, h:0.34, bob:chick }; },
    sprout(){ const g = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.16, 24), paint('#e99a74')); pot.position.y = 0.08; g.add(pot);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 8, 24), paint('#f0ab88')); rim.rotation.x = Math.PI / 2; rim.position.y = 0.16; g.add(rim);
      const soil = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), std('#7a5a40', 0.95)); soil.rotation.x = -Math.PI / 2; soil.position.y = 0.155; g.add(soil);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.015, 0.2, 8), std('#6cae4e', 0.6)); stem.position.y = 0.25; g.add(stem);
      const leafG = new THREE.SphereGeometry(0.08, 16, 10); const leafM = paint('#86cf5c');
      const leaves = new THREE.Group(); leaves.position.y = 0.35; g.add(leaves);
      [-1, 1].forEach(sx => { const l = new THREE.Mesh(leafG, leafM); l.scale.set(1.1, 0.28, 0.6); l.position.set(sx * 0.072, 0, 0); l.rotation.z = sx * 0.45; leaves.add(l); });
      return { g, h:0.42, sway:leaves }; },
    leap(){ const g = new THREE.Group(); const body = new THREE.Group();
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.3, 24), paint('#fbf6ea')); tube.position.y = 0.2; body.add(tube);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 24), paint('#ef7b6c')); nose.position.y = 0.42; body.add(nose);
      const win = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 8, 20), gold); win.position.set(0, 0.25, 0.072); body.add(win);
      const glassM = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16), std('#9cc8ff', 0.15, { metalness:0.2, emissive:new THREE.Color('#9cc8ff'), emissiveIntensity:0.3 })); glassM.position.set(0, 0.25, 0.071); body.add(glassM);
      for(let j = 0; j < 3; j++){ const f = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.11, 0.08), paint('#7f95e6')); const a = j / 3 * TAU; f.position.set(Math.sin(a) * 0.075, 0.1, Math.cos(a) * 0.075); f.rotation.y = a; body.add(f); }
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 16), new THREE.MeshBasicMaterial({ color:'#ffc978' })); flame.rotation.x = Math.PI; flame.position.y = 0.0; flame.userData.noShadow = true; body.add(flame);
      body.position.y = 0.07; body.rotation.z = -0.18; g.add(body); return { g, h:0.52, hover:body, flame }; },
    mastery(){ const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.05, 32), std('#e6e2f4', 0.6)); base.position.y = 0.025; g.add(base);
      const cush = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 12), std('#b9a7ff', 0.7)); cush.scale.set(1, 0.5, 1); cush.position.y = 0.12; g.add(cush);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32, 1, true), new THREE.MeshPhysicalMaterial({ color:'#ecc977', roughness:0.3, metalness:0.35, clearcoat:0.8, side:THREE.DoubleSide })); band.position.y = 0.13; g.add(band);
      for(let j = 0; j < 5; j++){ const a = j / 5 * TAU; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 12), gold); sp.position.set(Math.sin(a) * 0.14, 0.23, Math.cos(a) * 0.14); g.add(sp);
        const gem = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), paint(['#8fe3d2', '#9cc8ff', '#b9a7ff'][j % 3])); gem.position.set(Math.sin(a) * 0.152, 0.13, Math.cos(a) * 0.152); g.add(gem);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), gold); ball.position.set(Math.sin(a) * 0.14, 0.29, Math.cos(a) * 0.14); g.add(ball); }
      return { g, h:0.33 }; },
    tower(){ const g = new THREE.Group(); const stone = std('#f1ebe0', 0.8);
      const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.34, 20), stone); t1.position.y = 0.17; g.add(t1);
      const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.2, 20), stone); t2.position.y = 0.44; g.add(t2);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.014, 8, 24), gold); ring.rotation.x = Math.PI / 2; ring.position.y = 0.34; g.add(ring);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 20), paint('#9d8ae8')); roof.position.y = 0.65; g.add(roof);
      for(let j = 0; j < 2; j++){ const wdw = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.06), std('#ffe7a8', 0.5, { emissive:new THREE.Color('#ffd36a'), emissiveIntensity:0.6 })); wdw.position.set(0, 0.15 + j * 0.29, (j ? 0.093 : 0.123)); g.add(wdw); }
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), brass); pole.position.y = 0.81; g.add(pole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.05), std('#c9a44c', 0.6, { side:THREE.DoubleSide })); flag.position.set(0.045, 0.845, 0); g.add(flag);
      return { g, h:0.88, flag }; },
    middle(){ const g = new THREE.Group();
      [['#7f95e6', 0, 0.12], ['#7cc6a8', 0.04, -0.2], ['#f0a58e', -0.02, 0.1]].forEach(([c, dx, ry], j) => {
        const cm = std(c, 0.6), pm = std('#fbf6ea', 0.9);
        const bk = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.22), [cm, cm, cm, pm, pm, pm]);
        bk.position.set(dx, 0.03 + j * 0.061, 0); bk.rotation.y = ry; g.add(bk); });
      const x = faceTile('x', 0.13, '#f0d9b0'); x.position.set(0, 0.183, 0.0); x.rotation.y = 0.35; g.add(x);
      return { g, h:0.33 }; },
    high(){ const g = new THREE.Group();
      const mg = new THREE.ConeGeometry(0.24, 0.46, 9, 4); const p = mg.attributes.position;
      for(let j = 0; j < p.count; j++){ const y = p.getY(j); if(y < 0.2){ const f = 1 + (Math.sin(j * 12.9) * 0.08); p.setX(j, p.getX(j) * f); p.setZ(j, p.getZ(j) * f); } }
      mg.computeVertexNormals();
      const mt = new THREE.Mesh(mg, std('#b8c3d6', 0.85, { flatShading:true })); mt.position.y = 0.23; g.add(mt);
      const snow = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 9), std('#ffffff', 0.6, { flatShading:true })); snow.position.y = 0.4; g.add(snow);
      const mt2 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.28, 8), std('#c6cfdf', 0.85, { flatShading:true })); mt2.position.set(0.2, 0.14, 0.05); g.add(mt2);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), brass); pole.position.y = 0.55; g.add(pole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.07), std('#b9a7ff', 0.6, { side:THREE.DoubleSide })); flag.position.set(0.06, 0.6, 0); g.add(flag);
      /* 봉우리 허리의 작은 구름 */
      const cl = new THREE.Group(); const cm = std('#ffffff', 0.9);
      [[0, 0, 0.07], [0.07, 0.01, 0.055], [-0.07, 0, 0.05]].forEach(([x, y, rr]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(rr, 14, 10), cm); s.position.set(x, y, 0); s.scale.y = 0.75; cl.add(s); });
      cl.position.set(-0.05, 0.3, 0.2); g.add(cl);
      return { g, h:0.66, flag, drift:cl }; },
  };
  const generic = () => { const g = new THREE.Group();
    const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.38, 4), std('#f4efff', 0.3, { emissive:new THREE.Color('#b9a7ff'), emissiveIntensity:0.25 })); ob.position.y = 0.19; ob.rotation.y = Math.PI / 4; g.add(ob);
    return { g, h:0.4 }; };

  /* 받침 판 — 흰 원판, 단계 색 가는 고리 + 금빛 진도 호 */
  const plateTex = (accent, pct) => canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#fdfbf6'; g.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    g.strokeStyle = accent; g.globalAlpha = 0.85; g.lineWidth = 9; g.beginPath(); g.arc(cx, cy, w * 0.44, 0, TAU); g.stroke(); g.globalAlpha = 1;
    g.strokeStyle = 'rgba(201,164,76,.35)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, w * 0.37, 0, TAU); g.stroke();
    if(pct > 0){ g.strokeStyle = '#d9b457'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, w * 0.44, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, pct / 100)); g.stroke(); }
  });
  const hits = [], holders = [], lifts = stops.map(() => 0), hotV = stops.map(() => 0), anims = [];
  const hitMat = new THREE.MeshBasicMaterial({ visible:false });
  const plateSide = std('#f3eee4', 0.7);
  stops.forEach((s, i) => {
    const st = stages[i];
    const holder = new THREE.Group(); holder.position.set(s.x, s.y, s.z); scene.add(holder);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.27, 0.028, 44), [plateSide, std(0xffffff, 0.7, { map:plateTex(st.accent || '#26304a', st.pct || 0) }), plateSide]);
    plate.position.y = 0.014; plate.receiveShadow = true; plate.castShadow = true; holder.add(plate);
    const lifter = new THREE.Group(); lifter.position.y = 0.028; holder.add(lifter);
    const popper = new THREE.Group(); lifter.add(popper);
    const made = (props[st.key] || generic)();
    cast(made.g); popper.add(made.g);
    const ph = i * 0.9;
    if(made.flag) anims.push(t => { made.flag.rotation.y = Math.sin(t * 2.4 + ph) * 0.35; });
    if(made.flame) anims.push(t => { const f = 0.8 + Math.sin(t * 17) * 0.15 + Math.sin(t * 7.3) * 0.1; made.flame.scale.set(1, f, 1); });
    if(made.hover) anims.push(t => { made.hover.position.y = 0.07 + Math.sin(t * 1.6 + ph) * 0.02; });
    if(made.sway) anims.push(t => { made.sway.rotation.z = Math.sin(t * 1.3 + ph) * 0.12; });
    if(made.bob) anims.push(t => { made.bob.position.y = Math.abs(Math.sin(t * 3 + ph)) * 0.025; });
    if(made.drift) anims.push(t => { made.drift.position.x = -0.05 + Math.sin(t * 0.5 + ph) * 0.05; });
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshBasicMaterial({ map:glowTex, color:'#b9a7ff', transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending }));
    hl.rotation.x = -Math.PI / 2; hl.position.y = 0.032; hl.renderOrder = 2; holder.add(hl);
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, Math.max(0.45, made.h + 0.1), 12), hitMat);
    hit.position.y = Math.max(0.45, made.h + 0.1) / 2; hit.userData.stop = i; holder.add(hit); hits.push(hit);
    holders.push({ holder, lifter, popper, hl, h:made.h });
    popups.push({ obj:popper, delay:0.35 + i * 0.14, kind:'scale' });
    const topY = made.h + 0.08;
    s.anchor = lift => s.up ? V3(s.x, s.y + topY + lift, s.z - 0.05) : V3(s.x, s.y + 0.03, s.z + 0.3);
  });

  /* ---- 지금 여기: 무지갯빛 후광 고리 + 걸어오는 아이 ---- */
  const cs = stops[curIdx];
  const haloTex = canvasTex(256, 256, (g, w, h) => {
    const cx = w / 2, cy = h / 2; const cols = ['#b9a7ff', '#8fe3d2', '#9cc8ff', '#fff2c8'];
    for(let a = 0; a < 360; a += 2){ g.strokeStyle = cols[Math.floor(a / 90) % 4]; g.lineWidth = 12; g.globalAlpha = 0.85; g.beginPath(); g.arc(cx, cy, w * 0.42, a * Math.PI / 180, (a + 2.5) * Math.PI / 180); g.stroke(); }
    g.globalAlpha = 1; const gr = g.createRadialGradient(cx, cy, w * 0.3, cx, cy, w * 0.5); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.78), new THREE.MeshBasicMaterial({ map:haloTex, transparent:true, opacity:0.9, depthWrite:false }));
  halo.rotation.x = -Math.PI / 2; halo.position.set(cs.x, cs.y + 0.03, cs.z); halo.renderOrder = 3; scene.add(halo);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#dcd2ff', transparent:true, opacity:0.25, depthWrite:false, blending:THREE.AdditiveBlending }));
  glow.scale.set(1.0, 1.0, 1); glow.position.set(cs.x, cs.y + 0.28, cs.z); scene.add(glow);
  const who = new THREE.Group(); scene.add(who);
  const standP = V3(cs.x + 0.3, GY, cs.z + (cs.up ? 0.2 : -0.1));
  /* 걷는 길: 앞 장(없으면 길 시작)에서 지금 장까지 곡선을 따라, 끝에서 받침 옆으로 한 걸음 */
  const fromU = curIdx > 0 ? stopU[curIdx - 1] : 0, toU = curU;
  const walkPts = [];
  for(let j = fromU; j <= toU; j += 2) walkPts.push(V3(samples[j].x, GY, samples[j].z));
  /* 받침 한가운데로 들어가지 않게 — 앞 받침·지금 받침 안쪽 점은 뺀다 */
  const inPlate = (p, s) => s && Math.hypot(p.x - s.x, p.z - s.z) < 0.34;
  const prevS = curIdx > 0 ? stops[curIdx - 1] : null;
  while(walkPts.length > 1 && inPlate(walkPts[0], prevS)) walkPts.shift();
  while(walkPts.length > 1 && inPlate(walkPts[walkPts.length - 1], cs)) walkPts.pop();
  if(!walkPts.length) walkPts.push(V3(standP.x - 0.3, GY, standP.z + 0.2));
  walkPts.push(standP);
  if(walkPts.length < 2) walkPts.unshift(standP.clone().add(V3(-0.2, 0, 0.1)));
  const segL = []; let totL = 0; for(let j = 1; j < walkPts.length; j++){ const d = walkPts[j].distanceTo(walkPts[j - 1]); segL.push(d); totL += d; }
  const along = u => { let d = u * totL; for(let j = 0; j < segL.length; j++){ if(d <= segL[j] || j === segL.length - 1){ const f = segL[j] ? Math.min(1, d / segL[j]) : 1; return [walkPts[j].clone().lerp(walkPts[j + 1], f), walkPts[j + 1].clone().sub(walkPts[j])]; } d -= segL[j]; } return [standP.clone(), V3(0, 0, 1)]; };
  let kidUpdate = null;
  if(kid && kid.object){ who.add(kid.object); kidUpdate = (t, dt) => { try { kid.update(dt, t); } catch(e){} }; }
  else {
    const pawn = new THREE.Group(); const pearl = new THREE.MeshPhysicalMaterial({ color:'#f7f3ff', roughness:0.2, clearcoat:1, sheen:1, sheenColor:new THREE.Color('#b9a7ff') });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.04, 24), pearl); base.position.y = 0.02; pawn.add(base);
    const bodyP = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 24), pearl); bodyP.position.y = 0.13; pawn.add(bodyP);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), pearl); head.position.y = 0.25; pawn.add(head);
    cast(pawn); who.add(pawn);
  }
  const whoShadow = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), new THREE.MeshBasicMaterial({ map:glowTex, color:'#6b7390', transparent:true, opacity:0.35, depthWrite:false }));
  whoShadow.rotation.x = -Math.PI / 2; whoShadow.renderOrder = 1; scene.add(whoShadow);
  const WALK0 = 1.0, WALK = Math.min(3.2, 0.9 + totL * 0.9);
  let walkState = 0;   /* 0 기다림 · 1 걷는 중 · 2 도착 */
  function placeWho(u){ const [p, d] = along(u); who.position.copy(p); whoShadow.position.set(p.x, GY + 0.004, p.z); return d; }
  placeWho(reduce ? 1 : 0);
  if(kid && kid.faceNow){ const d = along(0)[1]; kid.faceNow(reduce ? -0.3 : Math.atan2(d.x, d.z)); }

  /* ---- 떠 있는 구름 · 별가루 ---- */
  const clouds = [];
  { const cm = std('#ffffff', 0.95, { emissive:new THREE.Color('#ffffff'), emissiveIntensity:0.08 });
    [[-1.9, 1.75, Z0 + 0.35, 1], [0.3, 2.05, Z0 + 0.25, 0.8], [1.95, 1.55, Z0 + 0.4, 0.9], [-0.7, 1.35, Z0 + 0.55, 0.6]].forEach(([x, y, z, s], ci) => {
      const c = new THREE.Group();
      [[0, 0, 0.16], [0.16, 0.03, 0.12], [-0.16, 0.01, 0.12], [0.3, -0.02, 0.08], [-0.28, -0.02, 0.08], [0.05, 0.1, 0.1]].forEach(([a, b, rr]) => { const sp = new THREE.Mesh(new THREE.SphereGeometry(rr, 16, 12), cm); sp.position.set(a, b, 0); sp.scale.set(1, 0.8, 0.7); c.add(sp); });
      c.scale.setScalar(s); c.position.set(x, y, z); cast(c); book.add(c); clouds.push({ c, x, y, ph:ci * 1.7 });
    }); }
  const dust = (() => {
    const N = 64, pos = new Float32Array(N * 3), ph = new Float32Array(N), col = new Float32Array(N * 3);
    const cols = ['#b9a7ff', '#8fe3d2', '#9cc8ff', '#fff2c8', '#ffffff'].map(c => new THREE.Color(c));
    for(let i = 0; i < N; i++){ pos.set([(rnd() - 0.5) * HW * 2.05, 0.9 + rnd() * 1.5, Z0 + 0.05 + rnd() * 0.8], i * 3); ph[i] = rnd() * 100; const c = cols[i % cols.length]; col.set([c.r, c.g, c.b], i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); geo.setAttribute('col', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, uniforms:{ t:{ value:0 }, px:{ value:120 } },
      vertexShader:'attribute float ph; attribute vec3 col; uniform float t; uniform float px; varying vec3 vC; varying float vA; void main(){ vec3 p = position; p.y += sin(t * .35 + ph) * .06; p.x += cos(t * .27 + ph) * .05; vA = .35 + .65 * pow(.5 + .5 * sin(t * 1.7 + ph * 5.), 3.); vC = col; vec4 mv = modelViewMatrix * vec4(p, 1.); gl_PointSize = px * (.5 + fract(ph) * .7) / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader:'varying vec3 vC; varying float vA; void main(){ vec2 q = gl_PointCoord - .5; float d = length(q); float a = smoothstep(.5, 0., d); float cr = max(smoothstep(.06, 0., abs(q.x)), smoothstep(.06, 0., abs(q.y))) * smoothstep(.5, .1, d); a = max(a * a, cr * .8); gl_FragColor = vec4(vC * a * vA, a * vA); }' });
    const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; pts.renderOrder = 6; scene.add(pts);
    return mat;
  })();

  /* ---- 곁들이(누를 수 없음): 유리 잉크병과 흰 깃펜 · 숫자 블록 ---- */
  {
    const ink = new THREE.Group();
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.26, 28), new THREE.MeshPhysicalMaterial({ color:'#cfd8f2', roughness:0.06, transmission:0.8, thickness:0.3, transparent:true, opacity:0.7, clearcoat:1 }));
    bottle.position.y = 0.13; ink.add(bottle);
    const inkIn = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.12, 24), std('#3b4a7a', 0.3)); inkIn.position.y = 0.07; ink.add(inkIn);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.06, 20), gold); neck.position.y = 0.29; ink.add(neck);
    const quill = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.9), std('#ffffff', 0.7, { side:THREE.DoubleSide })); quill.position.set(0.1, 0.68, 0); quill.rotation.z = -0.4; ink.add(quill);
    cast(ink); ink.position.set(HW + 1.25, 0, Z1 + 0.1); scene.add(ink);
    const tiles = new THREE.Group();
    [['7', -0.2, 0, 0.3], ['+', 0.14, 0.05, -0.2], ['3', 0.02, 0.33, 0.5]].forEach(([t, x, z, ry]) => { const tl = faceTile(t, 0.24, '#f0d9b0'); tl.position.set(x, 0, z); tl.rotation.y = ry; tiles.add(tl); });
    cast(tiles); tiles.position.set(-HW - 0.75, 0, Z1 - 0.3); scene.add(tiles);
  }

  /* ---- 움직임 ---- */
  function animate(t, dt, it, reduce, hot){
    let moving = false;
    /* 팝업: 누워 있던 종이가 일어서고(rise), 이정표가 튀어 오른다(scale) */
    popups.forEach(p => {
      const u = reduce ? 1 : (it - p.delay) / 0.55;
      const e = pop(Math.max(0, Math.min(1, u)));
      if(p.kind === 'rise') p.obj.rotation.x = -Math.PI / 2 * (1 - e);
      else p.obj.scale.setScalar(Math.max(0.001, e));
      if(u < 1) moving = true;
    });
    holders.forEach((h, i) => {
      const goal = i === hot ? 1 : 0;
      const d = goal - hotV[i];
      if(Math.abs(d) > 0.002 && !reduce){ hotV[i] += d * Math.min(1, dt * 10); moving = true; } else hotV[i] = goal;
      lifts[i] = hotV[i] * 0.06;
      h.lifter.position.y = 0.028 + lifts[i];
      h.hl.material.opacity = hotV[i] * 0.95;
    });
    if(!reduce){
      /* 아이 걷기 */
      const u = (it - WALK0) / WALK;
      if(u <= 0) placeWho(0);
      else if(u < 1){
        if(walkState !== 1){ walkState = 1; if(kid && kid.setWalking) kid.setWalking(true, 1); }
        const e = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
        const d = placeWho(e);
        if(kid && kid.face && d.lengthSq() > 1e-6) kid.face(Math.atan2(d.x, d.z));
        moving = true;
      } else if(walkState !== 2){
        walkState = 2; placeWho(1);
        if(kid){ if(kid.setWalking) kid.setWalking(false); if(kid.face) kid.face(-0.3); if(kid.wave) kid.wave(); }
      }
      if(kidUpdate) kidUpdate(t, dt);
      else if(walkState === 2) who.position.y = GY + Math.abs(Math.sin(t * 2.2)) * 0.02;
      anims.forEach(f => f(t));
      halo.rotation.z = t * 0.25;
      halo.material.opacity = 0.7 + 0.2 * Math.sin(t * 2);
      glow.material.opacity = 0.18 + 0.08 * Math.sin(t * 2);
      clouds.forEach(c => { c.c.position.y = c.y + Math.sin(t * 0.6 + c.ph) * 0.04; c.c.position.x = c.x + Math.sin(t * 0.21 + c.ph) * 0.08; });
      dust.uniforms.t.value = t;
      moving = true;
    } else if(kidUpdate) kidUpdate(0, 0);
    return moving;
  }

  return { stops, hits, animate, lift:lifts, halfW:HW + 0.1, z0:Z0 - 0.08, z1:Z1 + 0.06, skyTop:0.05 + SH + 0.05 };
}
