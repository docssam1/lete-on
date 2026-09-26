/* ============================================================
   수의 마법 — 3D 연산 로드맵(길 지도) 머리 그림
   2026-09-26 원장 "로드맵도 이제 이런 느낌으로 수정해야지" — 3D 모드 선택(title3d)의 **마법사의 수학 작업 책상**과
   같은 세계에서, 책상 위에 **길게 펼친 양피지 길 지도(보드게임 판)**를 내려다본다.
     · 과정 C0…C47 = 구불구불한 길 위의 번호 이정표 돌(윗면에 KaTeX 숫자, 바로 선 글자)
     · 등급 구간(수의 나라 … 미적분Ⅰ) = 지도 위 옅은 색 구역 + 구간마다 작은 랜드마크 소품 + 가죽·금박 이름표
     · 지금 여기 = 아이 말(app/char3d, 실패하면 놋쇠 말)   다음 목표 = 빨간 깃발
     · 연산 점검(과정 3개마다) = 길가의 나무 도장(끝냈으면 지도에 빨간 도장 자국)
   글자는 전부 HTML(번역·키보드·스크린리더). 이정표마다 <button>(로빙 tabindex, ←/→ 로 옮겨 다닌다).
   끌기(마우스·손가락 가로) · 가로 휠(shift+휠) · ◀ ▶ 버튼 · 방향키로 길을 따라 움직인다.
   세로 휠·세로 손가락 끌기는 페이지를 스크롤한다(머리 그림이 페이지 스크롤을 가로채지 않게).
   잠금은 없다 — 어떤 과정이든 누를 수 있다(자유 선택 원칙).

   ── 연결 약속 ─────────────────────────────────────────────
   import { mountRoad3D } from './road3d/road3d.js';
   const ctl = await mountRoad3D(container, {
     lang:'ko'|'en'|'zh',
     courses:[{ id:'C0', num:0, title:'번역된 제목', band:'level0', state:'done'|'now'|'goal'|'doing'|'ahead', boss?, tower? }],  // 번호순
     bands:{ level0:{ name:'수의 나라', color:'#6FA85B' }, … },   // 이름은 번역된 문자열, 색은 #hex
     checkups:[{ num:3, from:1, to:3, state:'done'|'due'|'ahead' }],  // 과정 num 뒤에 선다
     current:'C29', goal:'C30'|null, focus:'C29'|null,              // focus = 처음에 비출 과정(없으면 current)
     avatar:{ kind:'boy'|'girl' },
     onCourse:id=>{}, onCheckup:num=>{},
     reducedMotion?:bool
   });
   // ctl === null → WebGL 없음/실패. 2D 목록만 쓰면 된다.
   // ctl.focusCourse(id, instant?)  ctl.dispose()  ctl._debug
   container 는 크기가 정해진 요소(높이 필수). 안에 .r3d 를 채운다.
   ============================================================ */
import { makeKit, fontsReady, THREE } from '../hero3d/kit.js';

const T = {
  here:{ ko:'지금 여기', en:'You are here', zh:'当前位置' },
  goal:{ ko:'다음 목표', en:'Next goal', zh:'下一个目标' },
  course:{ ko:'과정', en:'Course', zh:'课程' },
  check:{ ko:'연산 점검', en:'Check-up', zh:'运算检查' },
  checkShort:{ ko:'점검', en:'Check', zh:'检查' },
  done:{ ko:'정복함', en:'Conquered', zh:'已征服' },
  due:{ ko:'지금 할 차례', en:'Your turn now', zh:'轮到你了' },
  goHere:{ ko:'지금 여기로', en:'Back to me', zh:'回到当前' },
  drag:{ ko:'끌어서 길을 둘러봐요', en:'Drag to explore the road', zh:'拖动来看这条路' },
  prev:{ ko:'앞쪽 과정 보기', en:'Show earlier courses', zh:'看前面的课程' },
  next:{ ko:'뒤쪽 과정 보기', en:'Show later courses', zh:'看后面的课程' },
  map:{ ko:'연산 로드맵 지도 — 이정표를 누르면 아래 목록에서 그 과정을 보여 줘요. 왼쪽·오른쪽 방향키로 옮겨 다녀요.',
        en:'Course road map — pick a milestone to see that course in the list below. Use the left and right arrow keys to move.',
        zh:'运算路线图 — 点路标，下面的列表就会显示那个课程。用左右方向键移动。' },
  again:{ ko:'이어서', en:'continued', zh:'续' },
};
const tr = (v, lang) => v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : (v[lang] != null ? v[lang] : v.ko != null ? v.ko : '');
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .24  0 0 0 0 .12  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ---------- 스타일(한 번만) — 전부 .r3d 아래 ---------- */
const CSS = `
.r3d{position:absolute;inset:0;overflow:hidden;background:#4a2f1b;font-family:var(--font-game,'Fredoka','Jua','Pretendard',sans-serif);
  --r3d-ink:#33230f;--r3d-ink2:#6a5231;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;touch-action:pan-y}
.r3d canvas.r3d-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s ease}
.r3d canvas.r3d-gl.on{opacity:1}
.r3d.drag,.r3d.drag *{cursor:grabbing!important}
.r3d canvas.r3d-gl.hot{cursor:pointer}
.r3d-vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 22% 0%,rgba(255,236,196,.16),rgba(255,236,196,0) 48%),radial-gradient(ellipse 90% 85% at 50% 50%,rgba(0,0,0,0) 60%,rgba(30,14,4,.40) 100%)}
.r3d-ui{position:absolute;inset:0;pointer-events:none}
.r3d-ui>*{pointer-events:auto}

/* 이정표 — 돌 위에 겹친 투명 버튼(돌 자체가 그림이다). 포커스하면 금빛 고리 */
.r3d-stone{position:absolute;left:0;top:0;border:0;margin:0;padding:0;background:none;border-radius:50%;cursor:pointer;will-change:transform;
  min-width:44px;min-height:44px;color:transparent;font-size:1px;outline:none}
.r3d-stone:focus-visible{box-shadow:0 0 0 3px #fff3c4,0 0 0 6px rgba(40,20,4,.6)}
.r3d-stone.off{opacity:0;pointer-events:none!important}

/* 떠 있는 이름 쪽지(올리기·포커스) */
.r3d-tip{position:absolute;left:0;top:0;pointer-events:none!important;max-width:min(300px,78vw);white-space:normal;word-break:keep-all;
  color:var(--r3d-ink);font-size:13.5px;line-height:1.3;padding:6px 11px 6px;border-radius:2px;
  background:${GRAIN},linear-gradient(180deg,#fbf4e2,#efe2c3);box-shadow:0 1px 0 rgba(90,60,25,.35),0 5px 10px rgba(25,12,3,.35);
  opacity:0;transition:opacity .15s}
.r3d-tip.on{opacity:1}
.r3d-tip::before{content:"";position:absolute;left:50%;top:-6px;width:34px;height:12px;transform:translateX(-50%) rotate(-3deg);background:rgba(236,226,196,.62);border-radius:1px}
.r3d-tip b{font-family:"KaTeX_Main",Georgia,serif;font-weight:700;margin-right:6px}
.r3d-tip small{display:block;color:var(--r3d-ink2);font-size:11.5px;margin-top:1px}

/* 구간 이름표 — 가죽 + 금박(지도 위쪽 가장자리에 탭처럼) */
.r3d-band{position:absolute;left:0;top:0;pointer-events:none!important;white-space:nowrap;will-change:transform;text-align:center;
  padding:5px 12px 6px;border-radius:3px;
  background:${GRAIN},radial-gradient(120% 140% at 30% 10%,#7a2b22 0%,#5a1b16 55%,#3e110e 100%);
  box-shadow:inset 0 0 0 1px rgba(20,4,2,.55),inset 0 1px 1px rgba(255,200,170,.18),0 2px 0 rgba(20,6,2,.55),0 5px 9px rgba(25,10,2,.4)}
.r3d-band::before{content:"";position:absolute;inset:3px;border:1px solid rgba(233,196,106,.7);border-radius:2px;pointer-events:none}
.r3d-band::after{content:"";position:absolute;left:10px;right:10px;bottom:-4px;height:4px;border-radius:0 0 2px 2px;background:var(--acc,#c9a063);box-shadow:0 1px 2px rgba(0,0,0,.35)}
.r3d-band b{display:block;font-size:14.5px;font-weight:400;letter-spacing:.02em;line-height:1.15;
  background:linear-gradient(180deg,#fff4c8 0%,#f2cf74 34%,#c99434 62%,#f0d182 86%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 1px 0 rgba(30,6,2,.85))}
.r3d-band small{display:block;font-size:10.5px;color:#f1dcae;letter-spacing:.04em;margin-top:1px;text-shadow:0 1px 0 rgba(20,4,2,.8)}
.r3d-band small i{font-style:normal;font-family:"KaTeX_Main",Georgia,serif}
.r3d-band.off{visibility:hidden}

/* 공통 꼬리표 버튼(끈 구멍 달린 종이) */
.r3d-tag{position:absolute;left:0;top:0;border:0;margin:0;font:inherit;color:var(--r3d-ink);cursor:pointer;will-change:transform;isolation:isolate;
  display:flex;align-items:center;gap:7px;text-align:left;word-break:keep-all;min-height:44px;padding:5px 12px 5px 25px;background:none;white-space:nowrap;
  filter:drop-shadow(0 1.5px 0 rgba(70,42,14,.55)) drop-shadow(0 5px 7px rgba(28,13,2,.38));transition:filter .15s,translate .15s;outline:none}
.r3d-tag::before{content:"";position:absolute;inset:0;z-index:-1;background:${GRAIN},linear-gradient(180deg,#fcf6e6 0%,#f1e4c4 100%);
  clip-path:polygon(14px 0,100% 0,100% 100%,14px 100%,0 calc(100% - 12px),0 12px)}
.r3d-tag::after{content:"";position:absolute;left:7px;top:50%;width:9px;height:9px;margin-top:-4.5px;border-radius:50%;
  background:radial-gradient(circle,#3a2a18 0 2.2px,#f6d98e 2.6px,#b98a33 4px,#7c5518 4.5px)}
.r3d-tag:hover,.r3d-tag:focus-visible{translate:0 -2px;filter:drop-shadow(0 1.5px 0 rgba(70,42,14,.55)) drop-shadow(0 0 7px rgba(255,214,120,.95)) drop-shadow(0 9px 10px rgba(28,13,2,.4))}
.r3d-tag:focus-visible{outline:3px solid #fff3c4;outline-offset:3px}
.r3d-tag b{font-weight:400;font-size:14.5px;line-height:1.15}
.r3d-tag small{display:block;font-size:11.5px;color:var(--r3d-ink2);line-height:1.2;margin-top:1px;max-width:220px;overflow:hidden;text-overflow:ellipsis}
.r3d-tag .n{font-family:"KaTeX_Main",Georgia,serif;font-weight:700}
.r3d-tag.off{visibility:hidden}
/* 지금 여기 — 놋쇠 명판 + 빨간 밀랍 */
.r3d-tag.now{padding:6px 14px 6px 7px;gap:9px;color:#3a2206;filter:drop-shadow(0 2px 0 rgba(70,40,6,.7)) drop-shadow(0 7px 11px rgba(28,13,2,.45))}
.r3d-tag.now::before{clip-path:none;border-radius:8px;
  background:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,250,225,.45) 42%,rgba(255,255,255,0) 54%),linear-gradient(180deg,#fbe8ae 0%,#e9c46c 24%,#cf9c42 56%,#e8c572 80%,#b8883a 100%);
  box-shadow:inset 0 1px 0 rgba(255,250,220,.9),inset 0 -2px 0 rgba(110,70,12,.55),inset 0 0 0 1px rgba(120,80,20,.7),inset 0 0 0 4px rgba(255,236,180,.22),inset 0 0 0 5px rgba(120,80,20,.3)}
.r3d-tag.now::after{display:none}
.r3d-tag.now .seal{flex:none;width:32px;height:32px;border-radius:48% 52% 50% 50%/52% 47% 53% 48%;display:grid;place-items:center;color:#ffe9d9;font-size:15px;
  background:radial-gradient(circle at 36% 30%,#e8645a 0%,#c3332a 45%,#8c1a14 100%);
  box-shadow:inset 0 0 0 2.5px rgba(120,20,14,.55),inset 0 -3px 4px rgba(60,6,4,.45),0 2px 2px rgba(50,10,4,.4)}
.r3d-tag.now b{font-size:15.5px;color:#321c03;text-shadow:0 1px 0 rgba(255,242,200,.75)}
.r3d-tag.now small{color:#4d3409;text-shadow:0 1px 0 rgba(255,242,200,.6)}
.r3d-tag.goal b{color:#7a1e16}
.r3d-tag.goal .flag{flex:none;width:14px;height:18px;position:relative}
.r3d-tag.goal .flag::before{content:"";position:absolute;left:1px;top:0;width:2px;height:18px;background:#8a6a30;border-radius:1px}
.r3d-tag.goal .flag::after{content:"";position:absolute;left:3px;top:1px;width:11px;height:8px;background:#c3362c;clip-path:polygon(0 0,100% 50%,0 100%)}
/* 점검 — 크라프트지 쪽지 */
.r3d-tag.chk{min-height:44px;padding:4px 10px 4px 22px;gap:5px}
.r3d-tag.chk::before{background:${GRAIN},linear-gradient(180deg,#e2c697 0%,#d2b07a 100%);clip-path:polygon(12px 0,100% 0,100% 100%,12px 100%,0 calc(100% - 11px),0 11px)}
.r3d-tag.chk::after{left:6px;width:8px;height:8px;margin-top:-4px}
.r3d-tag.chk b{font-size:12.5px}
.r3d-tag.chk .n{font-size:12.5px}
.r3d-tag.chk.due b{color:#8c1a14}
.r3d-tag.chk.done{opacity:.92}

/* 아래 조작 줄 */
.r3d-ctl{position:absolute;left:0;right:0;bottom:10px;display:flex;align-items:center;justify-content:center;gap:12px;pointer-events:none!important}
.r3d-ctl>*{pointer-events:auto}
.r3d-arrow{flex:none;width:46px;height:46px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;color:#4a2f0c;padding:0;
  background:radial-gradient(circle at 34% 28%,#fff4cc 0%,#e7c168 38%,#b5842f 78%,#8a5e1c 100%);
  box-shadow:inset 0 0 0 1.5px rgba(95,62,14,.55),inset 0 -2px 3px rgba(80,48,8,.35),inset 0 1px 1px rgba(255,255,255,.6),0 2px 0 rgba(40,20,0,.45),0 6px 10px rgba(25,12,3,.4)}
.r3d-arrow svg{width:20px;height:20px}
.r3d-arrow:hover{filter:brightness(1.07) drop-shadow(0 0 6px rgba(255,214,120,.9))}
.r3d-arrow:focus-visible{outline:3px solid #fff3c4;outline-offset:3px}
.r3d-arrow:disabled{opacity:.45;cursor:default;filter:saturate(.6)}
.r3d-me{position:relative;border:0;cursor:pointer;min-height:44px;padding:5px 14px 6px;color:var(--r3d-ink);font:inherit;text-align:center;border-radius:2px;
  background:${GRAIN},linear-gradient(180deg,#fbf4e2,#efe2c3);box-shadow:0 1px 0 rgba(90,60,25,.35),0 5px 9px rgba(25,12,3,.38);transform:rotate(-.8deg)}
.r3d-me::before{content:"";position:absolute;left:50%;top:-6px;width:34px;height:12px;transform:translateX(-50%) rotate(-3deg);background:rgba(236,226,196,.62);border-radius:1px}
.r3d-me b{display:block;font-weight:400;font-size:14.5px;line-height:1.2}
.r3d-me small{display:block;font-size:11px;color:var(--r3d-ink2);line-height:1.2}
.r3d-me:hover{filter:drop-shadow(0 0 6px rgba(255,214,120,.9))}
.r3d-me:focus-visible{outline:3px solid #fff3c4;outline-offset:3px}
.r3d-hint{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.r3d.narrow .r3d-band{padding:4px 9px 5px}
.r3d.narrow .r3d-band b{font-size:13px}
.r3d.narrow .r3d-band small{font-size:9.5px}
.r3d.narrow .r3d-tag b{font-size:13.5px}
.r3d.narrow .r3d-tag small{max-width:150px}
.r3d.narrow .r3d-tag.now small,.r3d.narrow .r3d-tag.goal small{display:none}
.r3d.narrow .r3d-tag.now{padding:4px 12px 4px 6px}
.r3d.narrow .r3d-tag.now b{font-size:14.5px}
.r3d.narrow .r3d-tag.now .seal{width:28px;height:28px;font-size:13px}
.r3d.narrow .r3d-ctl{bottom:8px;gap:10px}
@media (prefers-reduced-motion:reduce){.r3d canvas.r3d-gl,.r3d-tag,.r3d-tip{transition:none}}
@media (forced-colors:active){.r3d-tag,.r3d-me,.r3d-arrow{border:2px solid ButtonText;background:ButtonFace;color:ButtonText}.r3d-tag::before{display:none}.r3d-stone:focus{outline:3px solid Highlight}}
`;
function injectCss(){
  if(document.getElementById('road3d-style')) return;
  const s = document.createElement('style'); s.id = 'road3d-style'; s.textContent = CSS; document.head.appendChild(s);
}

/* ---------- 지도 배치(순수 계산) ---------- */
const SP = 1.55, GAP = 0.95, MAPD = 5.0;
const roadZ = x => 0.95 * Math.sin(x * 0.52 + 0.4) + 0.12 * Math.sin(x * 1.37);
function layoutRoad(courses){
  let x = 0; const pos = [];
  courses.forEach((c, i) => {
    if(i > 0){ x += SP; if(c.band !== courses[i - 1].band) x += GAP; }
    pos.push(x);
  });
  /* 연속 구간(같은 등급이 끊기면 따로) */
  const runs = []; const seen = {};
  courses.forEach((c, i) => {
    const last = runs[runs.length - 1];
    if(last && last.band === c.band){ last.to = i; }
    else { runs.push({ band:c.band, from:i, to:i, again:!!seen[c.band] }); seen[c.band] = true; }
  });
  runs.forEach(r => { r.x0 = pos[r.from] - (r.from === 0 ? SP * 0.9 : (SP + GAP) / 2); r.x1 = pos[r.to] + (r.to === courses.length - 1 ? SP * 0.9 : (SP + GAP) / 2); });
  return { pos, runs, x0:pos[0] - SP * 1.3, x1:pos[pos.length - 1] + SP * 1.3 };
}

/* ============================================================ */
export async function mountRoad3D(container, opts){
  opts = opts || {};
  const courses = (opts.courses || []).slice();
  if(!container || !courses.length || !glOK()) return null;
  injectCss();
  const lang = opts.lang || 'ko';
  const L = v => tr(v, lang);
  const bands = opts.bands || {};
  const reduce = opts.reducedMotion != null ? !!opts.reducedMotion : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const idx = {}; courses.forEach((c, i) => { idx[c.id] = i; });
  const curI = idx[opts.current] != null ? idx[opts.current] : 0;
  const goalI = opts.goal != null && idx[opts.goal] != null ? idx[opts.goal] : -1;

  const root = document.createElement('div'); root.className = 'r3d';
  root.setAttribute('role', 'region');
  root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang);
  const canvas = document.createElement('canvas'); canvas.className = 'r3d-gl'; canvas.setAttribute('aria-hidden', 'true');
  const vig = document.createElement('div'); vig.className = 'r3d-vig'; vig.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.className = 'r3d-ui';
  root.append(canvas, vig, ui);
  container.appendChild(root);
  const hintId = 'r3dHint' + Math.random().toString(36).slice(2, 7);
  root.setAttribute('aria-label', L(T.map).split(' — ')[0]);

  const sizeOf = () => [Math.max(240, root.clientWidth || container.clientWidth || 800), Math.max(200, root.clientHeight || container.clientHeight || 400)];
  let [VW, VH] = sizeOf();

  await fontsReady();
  if(!root.isConnected){ root.remove(); return null; }
  let k;
  try { k = makeKit(23, { live:true, canvas, width:VW, height:VH }); }
  catch(e){ root.remove(); return null; }
  const { r, scene, cam } = k;
  const lay = layoutRoad(courses);

  let world;
  try { world = buildWorld(k, courses, bands, lay, opts, curI, goalI); }
  catch(e){ console.error('[road3d]', e); try { r.dispose(); } catch(_){} root.remove(); return null; }
  /* 3D 아이(char3d) — 실패하면 놋쇠 말 그대로 */
  let kid = null;
  try {
    const m = await import('../char3d/char3d.js');
    if(root.isConnected){
      kid = m.makeCharacter(THREE, { kind:(opts.avatar && opts.avatar.kind) === 'girl' ? 'girl' : 'boy', height:1.4, blob:false });
      world.setPawn(kid);
    }
  } catch(e){ console.warn('[road3d] char3d', e); kid = null; }
  if(!root.isConnected){
    try { kid && kid.dispose(); } catch(_){}
    try { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } catch(_){}
    root.remove(); return null;
  }

  /* ---------- HTML 겹 ---------- */
  const hint = document.createElement('p'); hint.className = 'r3d-hint'; hint.id = hintId; hint.textContent = L(T.map);
  root.setAttribute('aria-describedby', hintId);
  const tip = document.createElement('div'); tip.className = 'r3d-tip'; tip.setAttribute('aria-hidden', 'true');
  const bandEls = lay.runs.map(run => {
    const el = document.createElement('div'); el.className = 'r3d-band'; el.setAttribute('aria-hidden', 'true');
    const bd = bands[run.band] || {};
    el.style.setProperty('--acc', bd.color || '#c9a063');
    const a = courses[run.from].num, b = courses[run.to].num;
    /* 돌 하나 = 과정 하나(여러 주), 한 주가 아니다 — 원장 "중학교 1학년이 3번 만에 끝나?"(2026-09-26).
       그래서 이름표에 그 구간의 수업 횟수를 함께 적는다(주기와 무관한 값이라 주 1·2회를 바꿔도 맞다). */
    let nSess = 0; for(let k = run.from; k <= run.to; k++) nSess += courses[k].sessions || 0;
    const sessTxt = nSess ? ' · ' + (lang === 'en' ? nSess + ' lessons' : lang === 'zh' ? nSess + '次课' : '수업 ' + nSess + '회') : '';
    el.innerHTML = `<b>${esc(bd.name || run.band)}</b><small>${esc(L(T.course))} <i>${a === b ? a : a + '–' + b}</i>${esc(sessTxt)}${run.again ? ' · ' + esc(L(T.again)) : ''}</small>`;
    return el;
  });
  const stoneEls = courses.map((c, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'r3d-stone';
    b.dataset.c = c.id; b.tabIndex = i === curI ? 0 : -1;
    const st = c.state === 'done' ? L(T.done) : c.state === 'now' ? L(T.here) : c.state === 'goal' ? L(T.goal) : '';
    b.setAttribute('aria-label', `${L(T.course)} ${c.num} · ${c.title}${st ? ' · ' + st : ''}`);
    b.textContent = String(c.num);
    return b;
  });
  const nowEl = document.createElement('button'); nowEl.type = 'button'; nowEl.className = 'r3d-tag now';
  const cc = courses[curI];
  nowEl.innerHTML = `<span class="seal" aria-hidden="true">${pinSvg()}</span><span><b>${esc(L(T.here))}</b><small><span class="n">${cc.num}</span> · ${esc(cc.title)}</small></span>`;
  nowEl.setAttribute('aria-label', `${L(T.here)} — ${L(T.course)} ${cc.num} · ${cc.title}`);
  let goalEl = null;
  if(goalI >= 0){
    const gc = courses[goalI];
    goalEl = document.createElement('button'); goalEl.type = 'button'; goalEl.className = 'r3d-tag goal';
    goalEl.innerHTML = `<span class="flag" aria-hidden="true"></span><span><b>${esc(L(T.goal))} <span class="n">${gc.num}</span></b><small>${esc(gc.title)}</small></span>`;
    goalEl.setAttribute('aria-label', `${L(T.goal)} — ${L(T.course)} ${gc.num} · ${gc.title}`);
  }
  const chkEls = world.checks.map(ch => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'r3d-tag chk ' + ch.state;
    b.innerHTML = `<b>${esc(L(T.checkShort))}</b><span class="n">${ch.from}–${ch.to}</span>`;
    b.setAttribute('aria-label', `${L(T.check)} · ${L(T.course)} ${ch.from}~${ch.to}${ch.state === 'done' ? ' · ✓' : ch.state === 'due' ? ' · ' + L(T.due) : ''}`);
    b.tabIndex = -1;
    b.addEventListener('click', () => { if(!swallow()) opts.onCheckup && opts.onCheckup(ch.num); });
    return b;
  });
  const ctl = document.createElement('div'); ctl.className = 'r3d-ctl';
  const arrow = (dir) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'r3d-arrow';
    b.setAttribute('aria-label', L(dir < 0 ? T.prev : T.next));
    b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${dir < 0 ? 'M14.5 5.5L8 12l6.5 6.5' : 'M9.5 5.5L16 12l-6.5 6.5'}"/></svg>`;
    return b; };
  const prevB = arrow(-1), nextB = arrow(1);
  const meB = document.createElement('button'); meB.type = 'button'; meB.className = 'r3d-me';
  meB.innerHTML = `<b>📍 ${esc(L(T.goHere))}</b><small>${esc(L(T.drag))}</small>`;
  ctl.append(prevB, meB, nextB);
  /* 탭 순서: 지금 여기 → 다음 목표 → (이정표 한 자리) → ◀ 📍 ▶ */
  ui.append(hint, ...bandEls, ...chkEls, ...stoneEls, tip, nowEl);
  if(goalEl) ui.append(goalEl);
  ui.append(ctl);

  /* ---------- 카메라 ---------- */
  const PITCH = THREE.MathUtils.degToRad(56);
  const dir = new THREE.Vector3(0, Math.sin(PITCH), Math.cos(PITCH));
  let camD = 10, visW = 10;
  const camT = { x:0, goal:0, vel:0 };
  const tz = 0.25;
  const _v = new THREE.Vector3();
  const proj = (x, y, z) => { _v.set(x, y, z).project(cam); return [(_v.x + 1) / 2 * VW, (1 - _v.y) / 2 * VH, _v.z]; };
  function placeCam(){
    cam.position.set(camT.x, 0, tz).addScaledVector(dir, camD);
    cam.lookAt(camT.x, 0, tz); cam.updateMatrixWorld(true);
    world.follow(camT.x);
  }
  let narrow = false, topPad = 40, botPad = 64;
  function relayout(){
    [VW, VH] = sizeOf();
    r.setSize(VW, VH, false);
    cam.aspect = VW / VH; cam.fov = 34; cam.updateProjectionMatrix();
    narrow = VW < 560;
    root.classList.toggle('narrow', narrow);
    topPad = narrow ? 34 : 40; botPad = narrow ? 58 : 64;
    /* 지도 깊이(가장자리 + 이름표 자리)가 위아래 여백 안에 들어오는 가장 가까운 거리 */
    let lo = 2, hi = 60;
    for(let it = 0; it < 22; it++){
      camD = (lo + hi) / 2; placeCam();
      const top = proj(camT.x, 0, -MAPD / 2 - 0.05)[1], bot = proj(camT.x, 0, MAPD / 2 + 0.05)[1];
      if(top >= topPad && bot <= VH - botPad) hi = camD; else lo = camD;
    }
    camD = hi;
    /* 넓은 화면에서 너무 멀리 보이지 않게 — 한 화면에 이정표가 12개 넘게 들어오면 당긴다 */
    placeCam();
    const wAt = () => { const a = proj(camT.x - 1, 0, 0)[0], b = proj(camT.x + 1, 0, 0)[0]; return VW / ((b - a) / 2); };
    visW = wAt();
    if(visW > SP * 12){ camD *= SP * 12 / visW; placeCam(); visW = wAt(); }
    clampCam(true);
    placeCam();
    dirty = true; wake();
  }
  const minX = () => Math.min(lay.pos[0] + visW * 0.32, (lay.x0 + lay.x1) / 2);
  const maxX = () => Math.max(lay.pos[lay.pos.length - 1] - visW * 0.32, (lay.x0 + lay.x1) / 2);
  function clampCam(both){ camT.goal = clamp(camT.goal, minX(), maxX()); if(both) camT.x = clamp(camT.x, minX(), maxX()); }
  function aimAt(i, instant){
    const x = lay.pos[clamp(i, 0, courses.length - 1)];
    camT.goal = x + visW * 0.08; clampCam();
    if(instant || reduce){ camT.x = camT.goal; camT.vel = 0; placeCam(); }
    dirty = true; wake();
  }

  /* ---------- 강조 · 쪽지 ---------- */
  let hot = -1;
  function setHot(i){
    if(hot === i) return;
    hot = i; world.setHot(i);
    if(i >= 0){ const c = courses[i];
      const st = c.state === 'done' ? L(T.done) : c.state === 'now' ? L(T.here) : c.state === 'goal' ? L(T.goal) : c.state === 'doing' ? '…' : '';
      tip.innerHTML = `<b>${c.num}</b>${esc(c.title)}${st && st !== '…' ? `<small>${esc(st)}</small>` : ''}`; }
    tip.classList.toggle('on', i >= 0);
    dirty = true; wake();
  }

  /* ---------- 입력 ---------- */
  let dragS = null, justDragged = 0;
  const swallow = () => performance.now() - justDragged < 350;
  const choose = i => { if(i < 0 || swallow()) return; opts.onCourse && opts.onCourse(courses[i].id); };
  stoneEls.forEach((b, i) => {
    b.addEventListener('click', () => choose(i));
    b.addEventListener('pointerenter', e => { if(e.pointerType !== 'touch') setHot(i); });
    b.addEventListener('pointerleave', () => { if(hot === i && document.activeElement !== b) setHot(-1); });
    b.addEventListener('focus', () => { roving(i); setHot(i); ensureVisible(i); });
    b.addEventListener('blur', () => { if(hot === i) setHot(-1); });
    b.addEventListener('keydown', e => {
      let j = -1;
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown') j = i + 1; else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = i - 1;
      else if(e.key === 'Home') j = 0; else if(e.key === 'End') j = courses.length - 1; else return;
      e.preventDefault(); j = clamp(j, 0, courses.length - 1); stoneEls[j].focus({ preventScroll:true });
    });
  });
  function roving(i){ stoneEls.forEach((b, j) => { b.tabIndex = j === i ? 0 : -1; }); }
  function ensureVisible(i){
    const x = lay.pos[i];
    if(Math.abs(x - camT.goal) > visW * 0.36){ camT.goal = x; clampCam(); dirty = true; wake(); }
  }
  nowEl.addEventListener('click', () => choose(curI));
  if(goalEl) goalEl.addEventListener('click', () => choose(goalI));
  prevB.addEventListener('click', () => { camT.goal -= visW * 0.7; clampCam(); if(reduce) camT.x = camT.goal; dirty = true; wake(); });
  nextB.addEventListener('click', () => { camT.goal += visW * 0.7; clampCam(); if(reduce) camT.x = camT.goal; dirty = true; wake(); });
  meB.addEventListener('click', () => { aimAt(curI); if(kid && kid.wave && !reduce) kid.wave(); });

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function hitAt(cx, cy){
    const b = canvas.getBoundingClientRect();
    ndc.set(((cx - b.left) / b.width) * 2 - 1, -((cy - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const h = ray.intersectObjects(world.hits, false)[0];
    if(!h) return null;
    return h.object.userData;
  }
  const isCtl = t => t && t.closest && t.closest('.r3d-ctl, .r3d-tag');
  const onDown = e => {
    if(e.button != null && e.button !== 0) return;
    if(isCtl(e.target)) return;
    dragS = { id:e.pointerId, x:e.clientX, y:e.clientY, cx:camT.x, moved:false, lastX:e.clientX, lastT:performance.now(), v:0, touch:e.pointerType === 'touch' };
  };
  const onMove = e => {
    if(dragS && e.pointerId === dragS.id){
      const dx = e.clientX - dragS.x, dy = e.clientY - dragS.y;
      if(!dragS.moved){
        if(Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.1){ dragS.moved = true; root.classList.add('drag'); try { root.setPointerCapture(e.pointerId); } catch(_){} setHot(-1); }
        else if(dragS.touch && Math.abs(dy) > 10){ dragS = null; return; }
      }
      if(dragS.moved){
        const wpp = visW / VW;
        camT.x = camT.goal = clamp(dragS.cx - dx * wpp, minX() - visW * 0.06, maxX() + visW * 0.06);
        const now = performance.now(), dt = Math.max(1, now - dragS.lastT);
        dragS.v = (e.clientX - dragS.lastX) / dt * wpp * -1000; dragS.lastX = e.clientX; dragS.lastT = now;
        placeCam(); dirty = true; wake();
      }
      return;
    }
    if(e.pointerType === 'touch' || e.target !== canvas) return;
    const h = hitAt(e.clientX, e.clientY);
    const i = h && h.courseI != null ? h.courseI : -1;
    canvas.classList.toggle('hot', !!h);
    if(i !== hot && !(i < 0 && stoneEls[hot] === document.activeElement)) setHot(i);
  };
  const onUp = e => {
    if(!dragS || e.pointerId !== dragS.id) return;
    const d = dragS; dragS = null;
    if(d.moved){
      justDragged = performance.now(); root.classList.remove('drag');
      camT.vel = reduce ? 0 : clamp(d.v, -visW * 3, visW * 3);
      if(performance.now() - d.lastT > 90) camT.vel = 0;
      camT.goal = camT.x; clampCam(); dirty = true; wake();
      return;
    }
    if(e.target === canvas){
      const h = hitAt(e.clientX, e.clientY);
      if(h && h.courseI != null) choose(h.courseI);
      else if(h && h.checkNum != null && opts.onCheckup) opts.onCheckup(h.checkNum);
    }
  };
  const onCancel = e => { if(dragS && e.pointerId === dragS.id){ if(dragS.moved){ justDragged = performance.now(); camT.goal = camT.x; clampCam(); } dragS = null; root.classList.remove('drag'); } };
  const onWheel = e => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if(!dx) return;   /* 세로 휠은 페이지 스크롤 */
    e.preventDefault();
    const px = e.deltaMode === 1 ? dx * 16 : dx;
    camT.goal += px * visW / VW; clampCam(); if(reduce) camT.x = camT.goal; dirty = true; wake();
  };
  const onLeave = () => { canvas.classList.remove('hot'); if(hot >= 0 && stoneEls[hot] !== document.activeElement) setHot(-1); };
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onCancel);
  root.addEventListener('wheel', onWheel, { passive:false });
  /* Tab 으로 화면 밖 이정표에 포커스가 가면 브라우저가 overflow:hidden 층을 스크롤한다 — 되돌리고 카메라가 따라간다 */
  const onScrollFix = () => { if(root.scrollLeft || root.scrollTop){ root.scrollLeft = 0; root.scrollTop = 0; } if(ui.scrollLeft || ui.scrollTop){ ui.scrollLeft = 0; ui.scrollTop = 0; } };
  root.addEventListener('scroll', onScrollFix, true);
  canvas.addEventListener('pointerleave', onLeave);

  /* ---------- 라벨 자리(카메라가 움직였을 때만) ---------- */
  const rectOf = el => [el.offsetWidth, el.offsetHeight];
  let sizes = null;
  function measure(){
    sizes = { bands:bandEls.map(rectOf), chks:chkEls.map(rectOf), now:rectOf(nowEl), goal:goalEl ? rectOf(goalEl) : null, tip:null };
  }
  function place(el, x, y, w, h, show){
    const on = show && x + w > -4 && x < VW + 4 && y + h > -4 && y < VH + 4;
    el.classList.toggle('off', !on);
    if(on) el.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
    return on;
  }
  function placeLabels(){
    if(!sizes) measure();
    const ov = (a, b2, pad) => a[0] < b2[0] + b2[2] + pad && b2[0] < a[0] + a[2] + pad && a[1] < b2[1] + b2[3] + pad && b2[1] < a[1] + a[3] + pad;
    const inView = rc => rc[0] >= 4 && rc[1] >= 2 && rc[0] + rc[2] <= VW - 4 && rc[1] + rc[3] <= VH - 4;
    /* 이정표 버튼 — 돌의 화면 지름 */
    const stoneRects = [];
    courses.forEach((c, i) => {
      const p = world.stoneAt(i);
      const [x, y] = proj(p.x, p.y, p.z);
      const [x2] = proj(p.x + world.stoneR(i), p.y, p.z);
      const d = Math.max(44, (x2 - x) * 2);
      const b = stoneEls[i];
      b.style.width = b.style.height = Math.round(d) + 'px';
      if(place(b, x - d / 2, y - d / 2, d, d, true)) stoneRects.push([x - d * 0.42, y - d * 0.36, d * 0.84, d * 0.72, i]);
      if(i === hot){
        const tw = tip.offsetWidth || 160, th = tip.offsetHeight || 34;
        const tx = clamp(x - tw / 2, 6, VW - tw - 6), ty = y + d / 2 + 8 + th > VH - botPad + 6 ? y - d / 2 - th - 10 : y + d / 2 + 8;
        tip.style.transform = `translate3d(${Math.round(tx)}px,${Math.round(ty)}px,0)`;
      }
    });
    /* 피해야 할 자리: 아래 조작 줄 · 아이 몸 · (점검·목표 쪽지는) 이정표 돌 */
    const occ = [];
    if(prevB.offsetParent){ const x0 = prevB.offsetLeft - 6, x1 = nextB.offsetLeft + nextB.offsetWidth + 6, y0 = ctl.offsetTop + Math.min(prevB.offsetTop, meB.offsetTop) - 4;
      occ.push([x0, y0, x1 - x0, VH - y0]); }
    const pt = world.pawnTop(), pf = world.pawnFoot();
    const [hx, hy] = proj(pt.x, pt.y - 0.1, pt.z), [fx0, fy0] = proj(pf.x, pf.y, pf.z);
    const pw = Math.max(26, (fy0 - hy) * 0.5);
    const pawnRect = [hx - pw / 2, hy, pw, Math.max(10, fy0 - hy)];
    const free = (rc, avoidStones, skipStone) => inView(rc) && !occ.some(o => ov(rc, o, 3)) && !ov(rc, pawnRect, 2)
      && !(avoidStones && stoneRects.some(sr => sr[4] !== skipStone && ov(rc, sr, 1)));
    const put = (el, rc) => { el.classList.remove('off'); el.style.transform = `translate3d(${Math.round(rc[0])}px,${Math.round(rc[1])}px,0)`; occ.push(rc); };
    /* 지금 여기 — 아이 머리 위(화면 밖이면 가장자리에 붙여 방향을 알려 준다) */
    { const [w, h] = sizes.now;
      if(hx < -20 || hx > VW + 20){ const y = clamp(hy - h - 10, 6, VH - botPad - h - 6); put(nowEl, [hx < 0 ? 8 : VW - w - 8, y, w, h]); nowEl.dataset.edge = hx < 0 ? 'l' : 'r'; }
      else {
        delete nowEl.dataset.edge;
        const cands = [[hx - w / 2, hy - h - 12], [hx - w * 0.15, hy - h - 12], [hx - w * 0.85, hy - h - 12], [hx + pw / 2 + 6, hy - 4], [hx - pw / 2 - w - 6, hy - 4]]
          .map(([x, y]) => [clamp(x, 6, VW - w - 6), Math.max(4, y), w, h]);
        const rc = cands.find(c => free(c, true)) || cands.find(c => free(c, false)) || cands[0];
        put(nowEl, rc);
      } }
    /* 다음 목표 — 깃발 곁 */
    if(goalEl){ const [w, h] = sizes.goal; const p = world.flagTop(); const [fx, fy] = proj(p.x, p.y, p.z);
      const gp = world.stoneAt(goalI); const [gx, gy] = proj(gp.x, gp.y, gp.z);
      if(fx < -40 || fx > VW + 40) goalEl.classList.add('off');
      else {
        const cands = [[fx - w * 0.3, fy - h - 4], [fx + 8, fy - 2], [fx - w - 8, fy - 2], [gx - w / 2, gy + 26], [fx - w / 2, fy - h - 30]]
          .map(([x, y]) => [clamp(x, 6, VW - w - 6), Math.max(4, y), w, h]);
        const rc = cands.find(c => free(c, true, goalI)) || cands.find(c => free(c, false));
        if(rc) put(goalEl, rc); else goalEl.classList.add('off');
      } }
    /* 점검 쪽지 — 도장 곁, 돌·다른 쪽지와 안 겹치는 자리가 없으면 숨긴다(도장은 그대로 누를 수 있다) */
    world.checks.forEach((ch, j) => { const [w, h] = sizes.chks[j]; const [sx, sy] = proj(ch.x, 0.2, ch.z);
      const el = chkEls[j];
      if(sx < -w || sx > VW + w){ el.classList.add('off'); return; }
      const cands = [[sx - w / 2, sy + 14], [sx - w / 2, sy - h - 22], [sx + 18, sy - h / 2], [sx - w - 18, sy - h / 2]].map(([x, y]) => [x, y, w, h]);
      const rc = cands.find(c => free(c, true));
      if(rc) put(el, rc); else el.classList.add('off'); });
    /* 구간 이름표 — 지도 위 가장자리, 구간 가운데(화면 안의 구간이면 보이는 부분 가운데) */
    let lastR = -1e9;
    lay.runs.forEach((run, j) => {
      const [ax] = proj(run.x0, 0, -MAPD / 2), [bx] = proj(run.x1, 0, -MAPD / 2);
      const [w, h] = sizes.bands[j];
      const vis0 = Math.max(ax, 6), vis1 = Math.min(bx, VW - 6);
      const cx = vis1 - vis0 > w ? (vis0 + vis1) / 2 : (ax + bx) / 2;
      const [, y] = proj((run.x0 + run.x1) / 2, 0, -MAPD / 2 + 0.05);
      const ty = Math.max(4, y - h * 0.62);
      /* 가운데가 막혀 있으면(지금 여기 쪽지 등) 구간 안에서 옆으로 비켜 본다 */
      const xs = [cx - w / 2, vis0, vis1 - w, vis0 + (vis1 - vis0 - w) * 0.25, vis0 + (vis1 - vis0 - w) * 0.75].map(x => clamp(x, ax, Math.max(ax, bx - w)));
      const fit = bx - ax > w * 0.55 ? xs.find(x => x > lastR + 6 && x + w > 0 && x < VW && !occ.some(o => ov([x, ty, w, h], o, 2))) : undefined;
      if(place(bandEls[j], fit == null ? 0 : fit, ty, w, h, fit != null)) lastR = fit + w;
    });
    prevB.disabled = camT.goal <= minX() + 0.01;
    nextB.disabled = camT.goal >= maxX() - 0.01;
  }

  /* ---------- 루프 ---------- */
  let raf = 0, running = !document.hidden, visible = true, disposed = false, dirty = true, shown = false, last = performance.now(), t0 = last, last0 = last;
  function frame(){
    raf = 0; if(disposed) return;
    if(!root.isConnected){ dispose(); return; }
    const now = performance.now(), dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
    const t = (now - t0) / 1000;
    const dtr = Math.max(0, Math.min(0.25, (now - last0) / 1000)); last0 = now;   /* 카메라는 실제 시간으로(느린 기기에서도 제때 도착) */
    let moving = false;
    if(!dragS || !dragS.moved){
      if(camT.vel){ camT.goal += camT.vel * dtr; camT.vel *= Math.pow(0.04, dtr); if(Math.abs(camT.vel) < 0.05) camT.vel = 0; clampCam(); moving = true; }
      const dx = camT.goal - camT.x;
      if(Math.abs(dx) > 0.002){ camT.x += reduce ? dx : dx * Math.min(1, dtr * 7); moving = true; placeCam(); }
      else if(camT.x !== camT.goal){ camT.x = camT.goal; placeCam(); }
    }
    const anim = !reduce && world.animate(t, dt);
    if(kid && !reduce) kid.update(dt, t);
    if(moving || dirty || anim || kid){
      placeLabels(); dirty = false;
      r.render(scene, cam);
      if(!shown){ shown = true; canvas.classList.add('on'); }
    }
    if(running && visible && (!reduce || moving || (dragS && dragS.moved))) raf = requestAnimationFrame(frame);
  }
  function wake(){ if(!raf && running && visible && !disposed){ last = last0 = performance.now(); raf = requestAnimationFrame(frame); } }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { visible = es.some(x => x.isIntersecting); if(visible) wake(); }) : null;
  if(io) io.observe(root);
  const onVis = () => { running = !document.hidden; if(running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { if(!disposed){ sizes = null; relayout(); } }, 60); };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
  if(ro) ro.observe(root); else window.addEventListener('resize', onResize);

  function dispose(){
    if(disposed) return; disposed = true;
    if(raf) cancelAnimationFrame(raf); raf = 0;
    clearTimeout(rt);
    if(io) io.disconnect(); if(ro) ro.disconnect(); else window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    root.removeEventListener('pointerdown', onDown); root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp); root.removeEventListener('pointercancel', onCancel);
    root.removeEventListener('wheel', onWheel); root.removeEventListener('scroll', onScrollFix, true); canvas.removeEventListener('pointerleave', onLeave);
    /* char3d 는 지오메트리·재질을 캐릭터끼리 나눠 쓴다 — 먼저 떼어 내 공용 자원을 건드리지 않게 */
    if(kid){ try { kid.dispose(); } catch(e){} if(kid.object && kid.object.parent) kid.object.parent.remove(kid.object); kid = null; }
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
  const fi = opts.focus != null && idx[opts.focus] != null ? idx[opts.focus] : curI;
  aimAt(fi, true);
  wake();
  return {
    focusCourse(id, instant){ if(disposed || idx[id] == null) return; aimAt(idx[id], instant); },
    dispose,
    get disposed(){ return disposed; },
    _debug:{ cam, proj:(x, y, z) => proj(x, y, z), world, hitAt, get camX(){ return camT.x; }, get visW(){ return visW; }, renderer:r },
  };
}

function pinSvg(){
  return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.8a6.2 6.2 0 0 0-6.2 6.2c0 4.6 6.2 12.2 6.2 12.2s6.2-7.6 6.2-12.2A6.2 6.2 0 0 0 12 2.8z" fill="#fff0e0" stroke="#7c1a12" stroke-width="1.2"/><circle cx="12" cy="9" r="2.4" fill="#b8302a"/></svg>';
}

/* ============================================================
   3D 세계 — 책상 위의 긴 양피지 길 지도
   ============================================================ */
function buildWorld(k, courses, bands, lay, opts, curI, goalI){
  const { scene, rnd, canvasTex, rbox, woodMat, metal, lacquer, mathText, r } = k;
  const TAU = Math.PI * 2;
  scene.background = new THREE.Color('#3a2414');
  k.env({ wall:'#8b6a4c', intensity:0.85 });
  r.toneMappingExposure = 1.02;
  const col = key => (bands[key] && bands[key].color) || '#8a6a40';

  /* 빛 — 왼쪽 뒤 창의 낮빛(그림자는 카메라를 따라 옮긴다) */
  scene.add(new THREE.HemisphereLight('#fff4e2', '#5a3a22', 0.66));
  const sun = new THREE.DirectionalLight('#fff0d8', 2.5);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left:-9, right:9, top:6, bottom:-6, near:1, far:30 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.025; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#dfe8ff', 0.35); scene.add(fill, fill.target);
  const follow = x => {
    sun.position.set(x - 5, 11, 6); sun.target.position.set(x, 0, 0); sun.target.updateMatrixWorld();
    fill.position.set(x + 8, 6, 8); fill.target.position.set(x, 0, 0); fill.target.updateMatrixWorld();
  };

  const cast = o => { o.traverse(m => { if(m.isMesh && !m.userData.noShadow){ m.castShadow = true; m.receiveShadow = true; } }); return o; };
  const flat = (mesh, y) => { mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; return mesh; };
  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const shadowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(30,14,4,.5)'); gr.addColorStop(0.55, 'rgba(30,14,4,.2)'); gr.addColorStop(1, 'rgba(30,14,4,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const blobGeo = new THREE.PlaneGeometry(1, 1);
  const blob = (x, z, sx, sz, op) => { const m = new THREE.Mesh(blobGeo, new THREE.MeshBasicMaterial({ map:shadowTex, transparent:true, opacity:op == null ? 0.8 : op, depthWrite:false }));
    flat(m, 0.03); m.scale.set(sx, sz, 1); m.position.x = x; m.position.z = z; m.renderOrder = 1; scene.add(m); return m; };

  /* ---- 책상 ---- */
  const deskTex = canvasTex(1024, 1024, (g, w, h) => {
    const planks = 4, ph = h / planks;
    for(let p = 0; p < planks; p++){
      const tone = [[108, 66, 36], [98, 59, 31], [113, 70, 39], [102, 62, 33]][p];
      g.fillStyle = `rgb(${tone[0]},${tone[1]},${tone[2]})`; g.fillRect(0, p * ph, w, ph);
      for(let i = 0; i < 120; i++){
        const y = p * ph + rnd() * ph;
        g.strokeStyle = `rgba(${55 + rnd() * 30},${30 + rnd() * 18},${12 + rnd() * 10},${0.1 + rnd() * 0.28})`;
        g.lineWidth = 0.6 + rnd() * 2.6; g.beginPath(); g.moveTo(0, y);
        for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / (120 + p * 20) + i) * 4 + Math.sin(x / 33 + i * 3) * 1.4);
        g.stroke();
      }
      if(p % 2 === 0){ const kx = rnd() * w, ky = p * ph + ph * (0.3 + rnd() * 0.4);
        for(let j = 0; j < 7; j++){ g.strokeStyle = `rgba(60,32,14,${0.25 - j * 0.03})`; g.lineWidth = 2; g.beginPath(); g.ellipse(kx, ky, 8 + j * 9, 4 + j * 3.5, 0, 0, TAU); g.stroke(); } }
      g.fillStyle = 'rgba(40,20,8,.75)'; g.fillRect(0, p * ph, w, 3);
      g.fillStyle = 'rgba(255,220,180,.10)'; g.fillRect(0, p * ph + 3, w, 2);
    }
  });
  const DW = lay.x1 - lay.x0 + 60;
  deskTex.wrapS = deskTex.wrapT = THREE.MirroredRepeatWrapping; deskTex.repeat.set(DW / 16, 30 / 12);
  const desk = flat(new THREE.Mesh(new THREE.PlaneGeometry(DW, 30), new THREE.MeshStandardMaterial({ map:deskTex, roughness:0.5 })), 0);
  desk.position.x = (lay.x0 + lay.x1) / 2; desk.position.z = -2; desk.receiveShadow = true; scene.add(desk);

  /* ---- 양피지 지도(조각 텍스처를 월드 좌표로 이어 그린다) ---- */
  const MX0 = lay.x0 - 0.4, MX1 = lay.x1 + 0.4, MD = MAPD;
  const PPU = 104, SEGW = 8;
  const roadPts = []; for(let x = lay.pos[0]; x <= lay.pos[lay.pos.length - 1] + 0.001; x += 0.08) roadPts.push([x, roadZ(x)]);
  const xNow = lay.pos[curI];
  /* 구간 지형 무늬 — 등급마다 다른 작은 도장(나무·풀·산·별) */
  const stamps = [];
  lay.runs.forEach((run, ri) => {
    const n = Math.max(3, Math.round((run.x1 - run.x0) * 2.2));
    for(let i = 0; i < n; i++){
      const x = run.x0 + 0.2 + rnd() * (run.x1 - run.x0 - 0.4);
      let z = (rnd() - 0.5) * (MD - 0.9);
      if(Math.abs(z - roadZ(x)) < 0.75) z = roadZ(x) + (z > roadZ(x) ? 0.8 : -0.8) + (rnd() - 0.5) * 0.3;
      if(Math.abs(z) > MD / 2 - 0.35) continue;
      stamps.push({ x, z, s:0.14 + rnd() * 0.12, kind:run.band, ri });
    }
  });
  const checks = [];
  (opts.checkups || []).forEach(ch => {
    const i = courses.findIndex(c => c.num === ch.num);
    if(i < 0) return;
    const xa = lay.pos[i], xb = i + 1 < lay.pos.length ? lay.pos[i + 1] : xa + SP;
    const x = (xa + xb) / 2, zr = roadZ(x);
    const z = zr + (zr > 0 ? -0.78 : 0.78);
    checks.push({ num:ch.num, from:ch.from, to:ch.to, state:ch.state, x, z });
  });
  const paint = (g, x0) => {
    const w = SEGW * PPU, h = MD * PPU;
    /* 종이 결 */
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#ecdcb5'; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 6500; i++){ g.fillStyle = `rgba(${120 + rnd() * 60},${95 + rnd() * 50},${60 + rnd() * 30},${rnd() * 0.07})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2.5, 1 + rnd() * 6); }
    /* 위아래 가장자리 그을음 */
    let gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, 'rgba(120,78,30,.42)'); gr.addColorStop(0.1, 'rgba(120,78,30,0)'); gr.addColorStop(0.9, 'rgba(120,78,30,0)'); gr.addColorStop(1, 'rgba(120,78,30,.42)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.setTransform(PPU, 0, 0, PPU, -x0 * PPU, (MD / 2) * PPU);   /* 이제부터 월드 단위(x, z) */
    /* 구간 색 물들이기 */
    lay.runs.forEach(run => {
      const c = new THREE.Color(col(run.band));
      const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
      const lg = g.createLinearGradient(run.x0, 0, run.x1, 0);
      lg.addColorStop(0, `rgba(${rgb},0.02)`); lg.addColorStop(0.12, `rgba(${rgb},0.13)`); lg.addColorStop(0.88, `rgba(${rgb},0.13)`); lg.addColorStop(1, `rgba(${rgb},0.02)`);
      g.fillStyle = lg; g.fillRect(run.x0, -MD / 2, run.x1 - run.x0, MD);
      /* 구간 경계 — 먹 점선 + 작은 마름모 */
      if(run.from > 0){
        g.strokeStyle = 'rgba(70,45,20,.45)'; g.lineWidth = 0.022; g.setLineDash([0.09, 0.08]);
        g.beginPath(); g.moveTo(run.x0, -MD / 2 + 0.25); g.lineTo(run.x0, MD / 2 - 0.25); g.stroke(); g.setLineDash([]);
        [-MD / 2 + 0.22, MD / 2 - 0.22].forEach(z => { g.fillStyle = 'rgba(70,45,20,.55)'; g.beginPath(); g.moveTo(run.x0, z - 0.07); g.lineTo(run.x0 + 0.05, z); g.lineTo(run.x0, z + 0.07); g.lineTo(run.x0 - 0.05, z); g.closePath(); g.fill(); });
      }
    });
    /* 지형 도장 */
    stamps.forEach(s => {
      if(s.x < x0 - 1 || s.x > x0 + SEGW + 1) return;
      const c = new THREE.Color(col(s.kind)).lerp(new THREE.Color('#4f6b3e'), 0.45);
      g.fillStyle = `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},.42)`;
      g.strokeStyle = 'rgba(60,40,18,.35)'; g.lineWidth = 0.012;
      const { x, z } = s, sz = s.s;
      if(/^level[01]/.test(s.kind)){ /* 풀·새싹 */
        for(let q = -1; q <= 1; q++){ g.beginPath(); g.ellipse(x + q * sz * 0.35, z, sz * 0.18, sz * 0.5, q * 0.5, 0, TAU); g.fill(); }
      } else if(/^(level2|level3|challenge)/.test(s.kind)){ /* 산 */
        g.beginPath(); g.moveTo(x - sz, z + sz * 0.5); g.lineTo(x, z - sz * 0.7); g.lineTo(x + sz, z + sz * 0.5); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,250,235,.55)'; g.beginPath(); g.moveTo(x - sz * 0.28, z - sz * 0.3); g.lineTo(x, z - sz * 0.7); g.lineTo(x + sz * 0.28, z - sz * 0.3); g.closePath(); g.fill();
      } else if(/^middle/.test(s.kind)){ /* 나무 */
        g.fillStyle = 'rgba(78,118,62,.5)';
        g.beginPath(); g.arc(x, z - sz * 0.2, sz * 0.5, 0, TAU); g.fill(); g.stroke();
        g.fillStyle = 'rgba(90,60,30,.5)'; g.fillRect(x - sz * 0.05, z + sz * 0.2, sz * 0.1, sz * 0.35);
      } else { /* 별(고등) */
        g.beginPath(); for(let q = 0; q < 10; q++){ const a = -Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? sz * 0.22 : sz * 0.55; const px = x + Math.cos(a) * rr, pz = z + Math.sin(a) * rr; q ? g.lineTo(px, pz) : g.moveTo(px, pz); } g.closePath(); g.fill();
      }
    });
    /* 길 */
    const path = (from, to) => { g.beginPath(); let st = false; roadPts.forEach(([x, z]) => { if(x < from - 0.05 || x > to + 0.05) return; st ? g.lineTo(x, z) : g.moveTo(x, z); st = true; }); };
    g.lineCap = 'round'; g.lineJoin = 'round';
    path(-1e9, 1e9); g.strokeStyle = 'rgba(110,72,34,.85)'; g.lineWidth = 0.5; g.stroke();
    path(-1e9, 1e9); g.strokeStyle = '#dcbd86'; g.lineWidth = 0.38; g.stroke();
    /* 지나온 길 — 금빛 */
    path(-1e9, xNow); g.strokeStyle = 'rgba(214,160,58,.9)'; g.lineWidth = 0.3; g.stroke();
    path(-1e9, 1e9); g.strokeStyle = 'rgba(255,248,225,.9)'; g.lineWidth = 0.035; g.setLineDash([0.13, 0.12]); g.stroke(); g.setLineDash([]);
    /* 연산 점검 — 끝냈으면 빨간 도장 자국, 할 차례면 점선 동그라미 */
    checks.forEach(ch => {
      if(ch.x < x0 - 1 || ch.x > x0 + SEGW + 1) return;
      const cx = ch.x + 0.34, cz = ch.z - 0.02;
      if(ch.state === 'done'){
        g.save(); g.translate(cx, cz); g.rotate(-0.25);
        g.strokeStyle = 'rgba(184,40,32,.72)'; g.lineWidth = 0.03; g.beginPath(); g.arc(0, 0, 0.2, 0, TAU); g.stroke();
        g.lineWidth = 0.012; g.beginPath(); g.arc(0, 0, 0.16, 0, TAU); g.stroke();
        g.lineWidth = 0.045; g.beginPath(); g.moveTo(-0.09, 0.0); g.lineTo(-0.02, 0.07); g.lineTo(0.1, -0.07); g.stroke();
        g.restore();
      } else {
        g.strokeStyle = ch.state === 'due' ? 'rgba(184,40,32,.55)' : 'rgba(90,60,30,.35)'; g.lineWidth = 0.02; g.setLineDash([0.05, 0.04]);
        g.beginPath(); g.arc(cx, cz, 0.2, 0, TAU); g.stroke(); g.setLineDash([]);
      }
    });
    /* 출발점 나침반 장미 */
    if(lay.x0 >= x0 - 3 && lay.x0 <= x0 + SEGW + 3){
      const cx = lay.pos[0] - 0.2, cz = roadZ(lay.pos[0]) + (roadZ(lay.pos[0]) > 0 ? -1.35 : 1.35);
      g.strokeStyle = 'rgba(70,45,20,.6)'; g.fillStyle = 'rgba(160,110,40,.45)'; g.lineWidth = 0.012;
      g.beginPath(); g.arc(cx, cz, 0.42, 0, TAU); g.stroke(); g.beginPath(); g.arc(cx, cz, 0.36, 0, TAU); g.stroke();
      for(let q = 0; q < 8; q++){ const a = q * Math.PI / 4, rr = q % 2 ? 0.2 : 0.38;
        g.beginPath(); g.moveTo(cx, cz); g.lineTo(cx + Math.cos(a - 0.2) * 0.07, cz + Math.sin(a - 0.2) * 0.07); g.lineTo(cx + Math.cos(a) * rr, cz + Math.sin(a) * rr); g.lineTo(cx + Math.cos(a + 0.2) * 0.07, cz + Math.sin(a + 0.2) * 0.07); g.closePath();
        g.fillStyle = q % 2 ? 'rgba(90,60,30,.45)' : 'rgba(170,120,40,.6)'; g.fill(); g.stroke(); }
    }
  };
  const segMat = [];
  const segGeo = (x0) => {
    const pg = new THREE.PlaneGeometry(SEGW, MD, 24, 14); const p = pg.attributes.position;
    for(let i = 0; i < p.count; i++){ const wx = p.getX(i) + x0 + SEGW / 2, wz = -p.getY(i);
      p.setZ(i, 0.018 + Math.sin(wx * 1.1) * 0.006 + Math.cos(wz * 2.3 + wx * 0.4) * 0.005); }
    pg.computeVertexNormals(); return pg;
  };
  for(let x0 = MX0; x0 < MX1 - 0.001; x0 += SEGW){
    const segW = SEGW;
    const tex = canvasTex(segW * PPU, MD * PPU, g => paint(g, x0));
    const m = new THREE.MeshStandardMaterial({ map:tex, roughness:0.93 }); segMat.push(m);
    const mesh = flat(new THREE.Mesh(segGeo(x0), m), 0); mesh.position.x = x0 + segW / 2; mesh.receiveShadow = true; scene.add(mesh);
  }
  /* 지도가 MX1 을 조금 넘어가도 끝은 두루마리가 덮는다 */
  const mapEndX = MX0 + Math.ceil((MX1 - MX0) / SEGW - 0.0001) * SEGW;
  const rollMat = new THREE.MeshStandardMaterial({ map:canvasTex(256, 64, (gg, w, h) => { gg.fillStyle = '#e2cf9f'; gg.fillRect(0, 0, w, h); for(let y = 0; y < h; y += 6){ gg.fillStyle = 'rgba(120,85,40,.14)'; gg.fillRect(0, y, w, 2); } }), roughness:0.9 });
  const capMat = new THREE.MeshStandardMaterial({ color:'#d6c08c', roughness:0.9, side:THREE.DoubleSide });
  [MX0, mapEndX].forEach(x => {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, MD + 0.1, 28), rollMat);
    roll.rotation.x = Math.PI / 2; roll.position.set(x, 0.22, 0); cast(roll); scene.add(roll);
    [-1, 1].forEach(s => { const cap = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.22, 28), capMat); cap.position.set(x, 0.22, s * (MD / 2 + 0.051)); if(s < 0) cap.rotation.y = Math.PI; scene.add(cap);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), woodMat('#7a4a26', [60, 30, 12])); knob.position.set(x, 0.22, s * (MD / 2 + 0.14)); cast(knob); scene.add(knob); });
  });

  /* ---- 이정표 돌 ---- */
  const hits = [];
  const stoneGeo = new THREE.CylinderGeometry(0.4, 0.46, 0.17, 36);
  const bigGeo = new THREE.CylinderGeometry(0.5, 0.57, 0.2, 40);
  const stoneTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b9ad98'; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 2500; i++){ const v = rnd(); g.fillStyle = v < 0.5 ? `rgba(60,50,40,${rnd() * 0.18})` : `rgba(255,250,235,${rnd() * 0.16})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 3); } });
  const stoneMat = new THREE.MeshStandardMaterial({ map:stoneTex, roughness:0.82 });
  const stoneMatDone = new THREE.MeshStandardMaterial({ map:stoneTex, color:'#f7cf6e', roughness:0.5, metalness:0.25 });
  const goldM = metal('#e2b457', 0.28), brass = metal('#c9a050', 0.32);
  const ringGeo = new THREE.TorusGeometry(0.405, 0.035, 10, 40), bigRingGeo = new THREE.TorusGeometry(0.505, 0.042, 10, 44);
  const faceGeo = new THREE.CircleGeometry(0.34, 36), bigFaceGeo = new THREE.CircleGeometry(0.43, 40);
  const lacq = {}; const lq = c => lacq[c] || (lacq[c] = lacquer(c));
  const stones = [];
  courses.forEach((c, i) => {
    const x = lay.pos[i], z = roadZ(x);
    const big = c.state === 'now' || c.boss;
    const g = new THREE.Group(); g.position.set(x, 0.02, z);
    const body = new THREE.Mesh(big ? bigGeo : stoneGeo, c.state === 'done' ? stoneMatDone : stoneMat);
    const hh = big ? 0.2 : 0.17;
    body.position.y = hh / 2; g.add(body);
    body.userData = { courseI:i };
    hits.push(body);
    const ringColor = c.state === 'done' || c.state === 'now' ? null : c.state === 'goal' ? '#c3362c' : col(c.band);
    const ring = new THREE.Mesh(big ? bigRingGeo : ringGeo, ringColor ? lq(ringColor) : goldM);
    ring.rotation.x = Math.PI / 2; ring.position.y = hh - 0.005; g.add(ring);
    const faceT = canvasTex(192, 192, (gg, w, h) => {
      const done = c.state === 'done', ahead = c.state === 'ahead';
      const rg = gg.createRadialGradient(w * 0.42, h * 0.36, 4, w / 2, h / 2, w * 0.56);
      rg.addColorStop(0, done ? '#fff6da' : '#fbf5e4'); rg.addColorStop(1, done ? '#ecd49a' : ahead ? '#e2d6bb' : '#eadcb8');
      gg.fillStyle = rg; gg.fillRect(0, 0, w, h);
      for(let q = 0; q < 500; q++){ gg.fillStyle = `rgba(120,90,50,${rnd() * 0.06})`; gg.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 4); }
      gg.strokeStyle = done ? 'rgba(150,110,30,.6)' : 'rgba(90,65,35,.35)'; gg.lineWidth = 4; gg.beginPath(); gg.arc(w / 2, h / 2, w * 0.44, 0, TAU); gg.stroke();
      gg.textBaseline = 'middle';
      gg.fillStyle = done ? '#6a4a0e' : c.state === 'goal' ? '#7a1e16' : ahead ? '#5d4c36' : '#2c1d10';
      const s = String(c.num); mathText(gg, s, w / 2, h / 2 + 6, s.length > 1 ? 92 : 108, { align:'center' });
      if(done){ gg.strokeStyle = '#b8862e'; gg.lineWidth = 7; gg.lineCap = 'round'; gg.beginPath(); gg.moveTo(w * 0.36, h * 0.83); gg.lineTo(w * 0.46, h * 0.9); gg.lineTo(w * 0.64, h * 0.76); gg.stroke(); }
    });
    faceT.anisotropy = 4;
    const face = flat(new THREE.Mesh(big ? bigFaceGeo : faceGeo, new THREE.MeshStandardMaterial({ map:faceT, roughness:0.75 })), hh + 0.002);
    face.receiveShadow = true; g.add(face);
    /* 정복한 과정 — 작은 금 별 핀 */
    if(c.state === 'done'){
      const star = new THREE.Shape(); for(let q = 0; q < 10; q++){ const a = Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 0.06 : 0.15; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; q ? star.lineTo(px, py) : star.moveTo(px, py); }
      const sm = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth:0.04, bevelEnabled:false }), lq('#c3362c'));
      sm.rotation.x = -Math.PI / 2; sm.position.set(0.34, hh + 0.012, 0.26); g.add(sm);
    }
    if(c.boss){ /* 마무리 관문 — 작은 금관 */
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 16, 1, true), goldM); crown.position.set(0, hh + 0.12, -0.52); g.add(crown);
      for(let q = 0; q < 5; q++){ const a = q / 5 * TAU; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), goldM); sp.position.set(Math.cos(a) * 0.13, hh + 0.2, -0.52 + Math.sin(a) * 0.13); g.add(sp); }
    }
    cast(g); face.castShadow = false;
    scene.add(g);
    stones.push({ g, hh, r:big ? 0.52 : 0.42, lift:0, x, z });
  });

  /* 지금 여기 빛 */
  const nowS = stones[curI];
  const nowGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#ffcf6a', transparent:true, opacity:0.55, depthWrite:false, blending:THREE.AdditiveBlending }));
  nowGlow.scale.set(1.9, 1.9, 1); nowGlow.position.set(nowS.x, 0.12, nowS.z); nowGlow.renderOrder = 3; scene.add(nowGlow);

  /* ---- 아이 말: 놋쇠 말(char3d 가 오면 바꾼다) ---- */
  const pawnSpot = { x:nowS.x - 0.38, z:nowS.z - 0.6 };
  const pawnGrp = new THREE.Group(); pawnGrp.position.set(pawnSpot.x, 0.02, pawnSpot.z); scene.add(pawnGrp);
  const tokenGeo = new THREE.LatheGeometry([[0, 0], [0.2, 0], [0.2, 0.05], [0.1, 0.13], [0.085, 0.36], [0.14, 0.43], [0.1, 0.5], [0, 0.56]].map(([x, y]) => new THREE.Vector2(x, y)), 24);
  const token = new THREE.Mesh(tokenGeo, goldM); const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), goldM); head.position.y = 0.64;
  const brassPawn = new THREE.Group(); brassPawn.add(token, head); cast(brassPawn); pawnGrp.add(brassPawn);
  const pawnShadow = blob(pawnSpot.x, pawnSpot.z, 0.9, 0.55, 0.7);
  let pawnH = 0.8, kidObj = null;
  const setPawn = c => {
    if(!c || !c.object) return;
    pawnGrp.remove(brassPawn);
    kidObj = c.object; kidObj.rotation.y = 0.2; cast(kidObj); pawnGrp.add(kidObj); pawnH = 1.47;
    /* 작은 나무 받침 */
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.07, 28), woodMat('#9a6a3c', [80, 45, 20])); base.position.y = 0.035; cast(base); pawnGrp.add(base);
    kidObj.position.y = 0.07;
  };

  /* ---- 다음 목표 깃발 ---- */
  let flag = null, flagTopP = null;
  if(goalI >= 0){
    const gs = stones[goalI];
    const fx = gs.x + 0.12, fz = gs.z - 0.55;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 1.05, 10), brass); pole.position.set(fx, 0.54, fz); cast(pole); scene.add(pole);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), goldM); knob.position.set(fx, 1.08, fz); scene.add(knob);
    const fg = new THREE.PlaneGeometry(0.56, 0.34, 10, 1); fg.translate(0.28, 0, 0);
    const flagT = canvasTex(256, 160, (gg, w, h) => { gg.fillStyle = '#c3362c'; gg.fillRect(0, 0, w, h);
      for(let q = 0; q < 600; q++){ gg.fillStyle = `rgba(0,0,0,${rnd() * 0.08})`; gg.fillRect(rnd() * w, rnd() * h, 1, 2 + rnd() * 4); }
      gg.fillStyle = '#f7da86'; gg.textBaseline = 'middle'; mathText(gg, String(courses[goalI].num), w / 2, h / 2 + 6, 104, { align:'center' }); });
    flag = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map:flagT, roughness:0.7, side:THREE.DoubleSide }));
    flag.position.set(fx + 0.03, 0.87, fz); flag.castShadow = true; scene.add(flag);
    blob(fx, fz, 0.35, 0.25, 0.6);
    flagTopP = new THREE.Vector3(fx, 1.2, fz);
    flag.userData.x0 = Float32Array.from({ length:fg.attributes.position.count }, (_, i) => fg.attributes.position.getX(i));
  }

  /* ---- 연산 점검 도장 ---- */
  const stampHandle = woodMat('#8a5a30', [70, 38, 16]);
  checks.forEach(ch => {
    const g = new THREE.Group(); g.position.set(ch.x, 0.02, ch.z);
    const standing = ch.state !== 'done';
    const base = new THREE.Mesh(rbox(0.3, 0.1, 0.3, 0.04), lq(ch.state === 'ahead' ? '#8e6b5a' : '#a3291f'));
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.16, 14), stampHandle); neck.position.y = 0.18;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), stampHandle); knob.position.y = 0.3;
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), brass); ringB.rotation.x = Math.PI / 2; ringB.position.y = 0.11;
    const st = new THREE.Group(); st.add(base, neck, knob, ringB);
    if(!standing){ st.rotation.z = Math.PI / 2; st.position.set(-0.1, 0.1, 0); }
    g.add(st); cast(g);
    [base, neck, knob].forEach(m => { m.userData = { checkNum:ch.num }; hits.push(m); });
    scene.add(g);
    if(ch.state === 'due'){ const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#ff9a6a', transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending }));
      gl.scale.set(1, 1, 1); gl.position.set(ch.x, 0.15, ch.z); scene.add(gl); ch.glow = gl; }
  });

  /* ---- 구간 랜드마크 ---- */
  const L = makeLandmarks(k, { cast, lq, goldM, brass, glowTex });
  lay.runs.forEach((run, ri) => {
    if(run.again) return;
    const fn = L[run.band] || L._tree;
    /* 구간 안에서 길이 가까이(아래쪽) 도는 자리의 먼 쪽(위쪽)에 세운다 — 앞의 돌을 가리지 않게 */
    let bx = (run.x0 + run.x1) / 2, best = -1e9;
    for(let x = run.x0 + 0.5; x <= run.x1 - 0.5; x += 0.1){ const sc = roadZ(x) - Math.abs(x - (run.x0 + run.x1) / 2) * 0.15; if(sc > best){ best = sc; bx = x; } }
    const bz = Math.min(roadZ(bx) - 1.25, -1.35);
    const o = fn(courses[run.from].band, col(run.band));
    o.position.set(bx, 0.02, Math.max(bz, -MD / 2 + 0.55));
    scene.add(o);
    blob(bx, o.position.z + 0.05, 1.3, 0.8, 0.55);
  });
  /* 작은 나무 몇 그루 — 먼 가장자리 */
  for(let i = 0; i < Math.round((lay.x1 - lay.x0) / 3.2); i++){
    const x = lay.x0 + 1 + rnd() * (lay.x1 - lay.x0 - 2), z = -MD / 2 + 0.45 + rnd() * 0.3;
    if(z > roadZ(x) - 0.9) continue;
    const t = L._tree(null, null, 0.55 + rnd() * 0.3); t.position.set(x, 0.02, z); scene.add(t);
  }

  /* ---- 애니메이션 ---- */
  let hot = -1;
  const setHot = i => { hot = i; };
  function animate(t, dt){
    stones.forEach((s, i) => { const want = i === hot ? 0.08 : 0; if(Math.abs(s.lift - want) > 0.001){ s.lift += (want - s.lift) * Math.min(1, dt * 12); s.g.position.y = 0.02 + s.lift; } });
    nowGlow.material.opacity = 0.42 + Math.sin(t * 2.2) * 0.14;
    const sc = 1.8 + Math.sin(t * 2.2) * 0.12; nowGlow.scale.set(sc, sc, 1);
    if(flag){ const fp = flag.geometry.attributes.position, x0 = flag.userData.x0; for(let i = 0; i < fp.count; i++){ const x = x0[i]; fp.setZ(i, Math.sin(x * 9 - t * 4) * 0.045 * x / 0.56); } fp.needsUpdate = true; }
    checks.forEach(ch => { if(ch.glow) ch.glow.material.opacity = 0.3 + Math.sin(t * 2.6 + ch.num) * 0.15; });
    if(!kidObj) brassPawn.position.y = Math.abs(Math.sin(t * 1.6)) * 0.03;
    return true;
  }
  follow(0);

  return {
    hits, checks, follow, animate, setHot, setPawn,
    stoneAt:i => { const s = stones[i]; return new THREE.Vector3(s.x, s.g.position.y + s.hh, s.z); },
    stoneR:i => stones[i].r,
    pawnTop:() => new THREE.Vector3(pawnSpot.x, pawnH + 0.15, pawnSpot.z),
    pawnFoot:() => new THREE.Vector3(pawnSpot.x, 0.05, pawnSpot.z),
    flagTop:() => flagTopP,
    pos:lay.pos,
  };
}

/* ---------- 구간 랜드마크(작은 탁상 소품) — 등급 키마다 하나 ---------- */
function makeLandmarks(k, h){
  const { rbox, woodMat, metal, lacquer, faceTex, canvasTex, mathText, rnd } = k;
  const { cast, lq, goldM, brass } = h;
  const TAU = Math.PI * 2;
  const G = () => new THREE.Group();
  const M = {};
  /* 나무(원뿔 두 겹) */
  M._tree = (_, __, s) => { s = s || 0.8; const g = G();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.07 * s, 0.35 * s, 8), woodMat('#7a4a26', [60, 30, 12])); trunk.position.y = 0.17 * s; g.add(trunk);
    const leaf = lq('#4f7a44');
    [[0.38, 0.55, 0.48], [0.3, 0.45, 0.75]].forEach(([rr, hh, y]) => { const c = new THREE.Mesh(new THREE.ConeGeometry(rr * s, hh * s, 10), leaf); c.position.y = y * s; g.add(c); });
    return cast(g); };
  /* 수의 나라 — 숫자 나무 블록 쌓기 */
  M.level0 = () => { const g = G();
    const side = woodMat('#e3c48e', [150, 105, 55]);
    [['1', -0.28, 0, 0.1], ['2', 0.24, 0.05, -0.15], ['3', -0.02, 0.3, 0.2]].forEach(([n, x, y, rot], i) => {
      const b = new THREE.Mesh(rbox(0.42, 0.36, 0.42, 0.05), side); b.position.set(x, y, i === 2 ? -0.02 : 0); b.rotation.y = rot; g.add(b);
      const top = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), new THREE.MeshStandardMaterial({ map:faceTex(n, { bg:'#f5e6c4', color:['#c3362c', '#2f6fb0', '#3f8f5a'][i], grain:true }), roughness:0.6 }));
      top.rotation.x = -Math.PI / 2; top.position.set(x, y + 0.362, i === 2 ? -0.02 : 0); top.rotation.z = rot; g.add(top); });
    return cast(g); };
  /* 계산의 새싹 — 화분의 새싹 */
  M.level1 = (_, c) => { const g = G();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.19, 0.32, 20), lq('#b8643a')); pot.position.y = 0.16; g.add(pot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 22), lq('#a25530')); rim.rotation.x = Math.PI / 2; rim.position.y = 0.32; g.add(rim);
    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.24, 20), new THREE.MeshStandardMaterial({ color:'#4a3020', roughness:1 })); soil.rotation.x = -Math.PI / 2; soil.position.y = 0.3; g.add(soil);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.4, 8), lq('#5f9a45')); stem.position.y = 0.5; g.add(stem);
    const leafG = new THREE.SphereGeometry(0.16, 16, 10); leafG.scale(1, 0.25, 0.55);
    [-1, 1].forEach(sx => { const l = new THREE.Mesh(leafG, lq('#6fa85b')); l.position.set(sx * 0.14, 0.7, 0); l.rotation.z = sx * 0.5; g.add(l); });
    return cast(g); };
  /* 계산의 도약 — 개울 위 나무 아치 다리 */
  M.level2 = (_, c) => { const g = G();
    const water = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.2), new THREE.MeshStandardMaterial({ color:'#6f9fc0', roughness:0.25, metalness:0.1, transparent:true, opacity:0.85 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.012; g.add(water);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 8, 24, Math.PI), woodMat('#9a6a3c', [80, 45, 20])); g.add(arc);
    const arc2 = arc.clone(); arc.position.z = -0.14; arc2.position.z = 0.14; g.add(arc2);
    for(let q = 1; q < 10; q++){ const a = q / 10 * Math.PI; const pl = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.36), woodMat('#b8864e', [100, 60, 25])); pl.position.set(Math.cos(a) * 0.5, Math.sin(a) * 0.5 + 0.03, 0); pl.rotation.z = a - Math.PI / 2; g.add(pl); }
    g.rotation.y = 0.1;
    return cast(g); };
  /* 계산의 정복 — 작은 성 */
  M.level3 = (_, c) => { const g = G();
    const stone = new THREE.MeshStandardMaterial({ map:canvasTex(128, 128, (gg, w, hh) => { gg.fillStyle = '#cfc2a6'; gg.fillRect(0, 0, w, hh); gg.strokeStyle = 'rgba(90,70,45,.45)'; gg.lineWidth = 2;
      for(let y = 0; y < hh; y += 16){ gg.beginPath(); gg.moveTo(0, y); gg.lineTo(w, y); gg.stroke(); for(let x = (y / 16) % 2 ? 0 : 16; x < w; x += 32){ gg.beginPath(); gg.moveTo(x, y); gg.lineTo(x, y + 16); gg.stroke(); } } }), roughness:0.85 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.28), stone); wall.position.y = 0.2; g.add(wall);
    for(let q = 0; q < 5; q++){ const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.28), stone); m.position.set(-0.36 + q * 0.18, 0.44, 0); g.add(m); }
    const roof = lq(c || '#0E2C57');
    [-0.5, 0.5].forEach(x => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.7, 16), stone); t.position.set(x, 0.35, 0); g.add(t);
      const r2 = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.32, 16), roof); r2.position.set(x, 0.86, 0); g.add(r2); });
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.22), new THREE.MeshStandardMaterial({ color:'#4a2c14', roughness:0.8 })); door.position.set(0, 0.11, 0.141); g.add(door);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass); pole.position.set(0.5, 1.15, 0); g.add(pole);
    const pen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.1), new THREE.MeshStandardMaterial({ color:'#c3362c', side:THREE.DoubleSide })); pen.position.set(0.59, 1.24, 0); g.add(pen);
    return cast(g); };
  /* 경시의 탑 — 높은 탑 + 금별 */
  M.challenge = (_, c) => { const g = G();
    const body = lq('#e6dcc8'), trim = lq(c || '#3d1a5c');
    [[0.3, 0.34, 0.5, 0.25], [0.24, 0.28, 0.45, 0.72], [0.18, 0.22, 0.4, 1.14]].forEach(([a, b, hh, y]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(a, b, hh, 18), body); m.position.y = y; g.add(m);
      const band = new THREE.Mesh(new THREE.TorusGeometry(b - 0.01, 0.025, 6, 22), trim); band.rotation.x = Math.PI / 2; band.position.y = y + hh / 2; g.add(band); });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.45, 18), trim); roof.position.y = 1.56; g.add(roof);
    const star = new THREE.Shape(); for(let q = 0; q < 10; q++){ const a = Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 0.045 : 0.1; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; q ? star.lineTo(px, py) : star.moveTo(px, py); }
    const sm = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth:0.025, bevelEnabled:false }), goldM); sm.position.set(0, 1.86, 0); g.add(sm);
    return cast(g); };
  /* 중학교 — 교과서 쌓기(학년마다 색이 다르다) */
  const books = cols => () => { const g = G();
    cols.forEach((cc, i) => { const b = new THREE.Mesh(rbox(0.72 - i * 0.06, 0.12, 0.5 - i * 0.03, 0.02), lq(cc)); b.position.set((rnd() - 0.5) * 0.06, i * 0.125, 0); b.rotation.y = (rnd() - 0.5) * 0.3; g.add(b);
      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.66 - i * 0.06, 0.09, 0.02), new THREE.MeshStandardMaterial({ color:'#f3e8cc', roughness:0.9 })); pages.position.set(b.position.x, i * 0.125 + 0.06, 0.245 - i * 0.015); pages.rotation.y = b.rotation.y; g.add(pages); });
    return cast(g); };
  M.middle1 = books(['#2f5d8a', '#c9a063', '#6f3a2a']);
  M.middle2 = books(['#3f7a5a', '#2f5d8a', '#c3362c', '#e2c697']);
  M.middle3 = books(['#6f3a2a', '#3f7a5a', '#2f5d8a', '#c9a063', '#4b2d6b']);
  /* 공통수학 — 놋쇠 컴퍼스 + 각도기 */
  const compass = withPro => () => { const g = G();
    const legG = new THREE.CylinderGeometry(0.018, 0.012, 0.9, 8);
    [-1, 1].forEach(s => { const l = new THREE.Mesh(legG, brass); l.position.set(s * 0.17, 0.42, 0); l.rotation.z = s * 0.4; g.add(l); });
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), goldM); hinge.rotation.x = Math.PI / 2; hinge.position.y = 0.84; g.add(hinge);
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 10), woodMat('#6a3a1e', [50, 25, 10])); knob.position.y = 0.94; g.add(knob);
    if(withPro){ const pro = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.015, 32, 1, false, 0, Math.PI), new THREE.MeshPhysicalMaterial({ color:'#f6edd6', roughness:0.2, transmission:0.5, transparent:true, opacity:0.75 }));
      pro.position.set(0.1, 0.01, 0.42); pro.rotation.y = Math.PI / 2; g.add(pro); }
    return cast(g); };
  M.highmath1 = compass(true);
  M.highmath2 = compass(false);
  /* 대수 — 놋쇠 사인 곡선 조형 */
  M.algebra = () => { const g = G();
    const pts = []; for(let q = 0; q <= 40; q++){ const u = q / 40; pts.push(new THREE.Vector3((u - 0.5) * 1.1, 0.45 + Math.sin(u * TAU * 1.5) * 0.22, 0)); }
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.028, 8, false), goldM); g.add(tube);
    const base = new THREE.Mesh(rbox(1.25, 0.08, 0.3, 0.03), woodMat('#6a3a1e', [50, 25, 10])); g.add(base);
    [-0.55, 0.55].forEach(x => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), brass); p.position.set(x, 0.3, 0); g.add(p); });
    return cast(g); };
  /* 미적분 — 모래시계(극한·변화) */
  M.calculus1 = () => { const g = G();
    const wood = woodMat('#7a4a26', [60, 30, 12]);
    [0.04, 0.86].forEach(y => { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.07, 24), wood); d.position.y = y; g.add(d); });
    for(let q = 0; q < 3; q++){ const a = q / 3 * TAU; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), wood); p.position.set(Math.cos(a) * 0.24, 0.45, Math.sin(a) * 0.24); g.add(p); }
    const prof = [[0.02, 0.08], [0.18, 0.1], [0.2, 0.22], [0.05, 0.43], [0.2, 0.66], [0.18, 0.79], [0.02, 0.82]].map(([x, y]) => new THREE.Vector2(x, y));
    const glassM = new THREE.MeshPhysicalMaterial({ color:'#ffffff', roughness:0.05, transmission:0.85, thickness:0.1, transparent:true, opacity:0.45 });
    const gl = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), glassM); gl.userData.noShadow = true; g.add(gl);
    const sand = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.14, 18), new THREE.MeshStandardMaterial({ color:'#e2b457', roughness:0.9 })); sand.position.y = 0.16; g.add(sand);
    return cast(g); };
  return M;
}
