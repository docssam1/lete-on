/* ============================================================
   수의 마법 — 3D 모드 선택(타이틀) 화면 (2026-09-25, 원장 "학습지 모드, 게임모드 이런 것들 고르는 화면서 3d로 제대로 구현")
   보라빛 밤의 떠 있는 섬. 모드마다 실제 물건/장소가 하나씩 서 있고, 아이는 그걸 골라 들어간다.
     continue → 빛이 쏟아지는 돌 아치 문(가장 크고 가운데, 금빛 버튼)
     diag     → 나침반 탑           game  → 줄무늬 천막 + 떠다니는 숫자 주사위
     sheet    → 학습지가 놓인 책상   road  → 이정표가 선 구불구불한 길
     story·dex·hist·magazine → 앞줄의 작은 소품(두루마리 지도 · 책 받침대 · 기둥 · 잡지 가판대)
   글자(로고·버튼)는 전부 HTML — 선명하고, 번역되고, 키보드·스크린리더로 쓸 수 있다.
   버튼은 매 프레임 자기 물건 위치로 따라간다(3D → 화면 투영). 버튼에 올리거나 포커스하면
   물건이 떠오르고 발밑에 금빛 고리가 켜진다. 물건을 직접 눌러도(레이캐스트) 같은 선택이 된다.

   ── 통합 인터페이스 ──────────────────────────────────────────
   import { mountTitle3D, DEFAULT_CHOICES } from './title3d/title3d.js';
   const ctl = await mountTitle3D(container, {
     lang:    'ko' | 'en' | 'zh',
     choices: [{ id, icon, label:{ko,en,zh}, sub:{ko,en,zh}?, primary?:bool }, …]
              // 생략하면 DEFAULT_CHOICES. 아는 id: continue diag game sheet road story dex hist magazine
              // (모르는 id 는 작은 표지판 소품으로 앞줄에 선다). primary 가 true 인 것이 가운데 문.
              // sub 는 문자열이어도 된다(이어서 모험의 진행 요약처럼 이미 번역된 한 줄).
     onPick:  id => {},                      // 버튼 또는 3D 물건을 눌렀을 때(한 번만 부른다)
     player:  '<div class="nm-party">…'       // renderPartyHtml(...) 결과 HTML, 또는 (px)=>HTML 함수.
                                             // 그 안의 <img>/<svg> 를 캔버스로 찍어 3D 무대에 세운다.
     name:    '민준',                         // 인사말·이름표
     coins:   120,                           // 🪙 칩
     chips:   [{icon:'📅', text:{ko:'5일',en:'Day 5',zh:'第5天'}}, {icon:'🏅', text:'…', gold:true}],
     extraHtml: '',                          // (선택) 인사 아래 덧붙일 HTML(계보 배지 줄 등, 호출자가 이스케이프)
     reducedMotion: bool?                    // (선택) 강제. 생략하면 prefers-reduced-motion
   });
   // ctl === null → WebGL 불가 · 생성 실패. 기존 2D 타이틀을 그대로 쓰면 된다.
   // ctl.setLang('en')  — 로고·버튼·칩 글자를 바꾼다.   ctl.dispose() — 모든 자원·리스너·DOM 해제.
   container 는 크기가 있는 요소(예: position:fixed; inset:0). 안에 .t3d 를 채워 넣는다.
   ============================================================ */
import { makeKit, fontsReady, THREE } from '../hero3d/kit.js';

export const DEFAULT_CHOICES = [
  { id:'continue', icon:'▶', primary:true, label:{ ko:'이어서 모험', en:'Continue Adventure', zh:'继续冒险' } },
  { id:'diag',  icon:'🧭', label:{ ko:'진단하기', en:'Level Check', zh:'水平测评' }, sub:{ ko:'어디서 시작할지 찾아요', en:'Find where to start', zh:'找到起点' } },
  { id:'game',  icon:'🎮', label:{ ko:'게임 모드', en:'Game Mode', zh:'游戏模式' }, sub:{ ko:'수를 체험해요', en:'Experience numbers', zh:'体验数字' } },
  { id:'sheet', icon:'📄', label:{ ko:'학습지 모드', en:'Worksheet Mode', zh:'学习单模式' }, sub:{ ko:'종이로 공부해요', en:'Study on paper', zh:'用纸来学习' } },
  { id:'road',  icon:'🛤️', label:{ ko:'연산 로드맵', en:'Course Road', zh:'运算路线图' }, sub:{ ko:'순서대로 공부해요', en:'Study in order', zh:'按顺序学习' } },
  { id:'story', icon:'🗺', label:{ ko:'스토리 모드', en:'Story Mode', zh:'故事模式' } },
  { id:'dex',   icon:'📖', label:{ ko:'기호 도감', en:'Symbol Dex', zh:'符号图鉴' } },
  { id:'hist',  icon:'🏛️', label:{ ko:'수학사 퀴즈', en:'Math History Quiz', zh:'数学史问答' } },
  { id:'magazine', icon:'📰', label:{ ko:'매거진', en:'Magazine', zh:'杂志' } },
];
const MODE_IDS = ['diag', 'game', 'sheet', 'road'];

const LOGO = { ko:['수의 마법', 'NUMBERS OF MAGIC'], en:['Numbers of Magic', 'NUMBER VILLAGE · DOCSSAM'], zh:['数字魔法', 'NUMBERS OF MAGIC'] };
const HELLO = { ko:'다시 만나서 반가워요!', en:'Welcome back!', zh:'欢迎回来！' };
const PICK_HINT = { ko:'어디로 갈까요?', en:'Where to?', zh:'去哪里？' };

const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const tr = (v, lang) => v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : (v[lang] != null ? v[lang] : v.ko != null ? v.ko : '');
const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };

/* ---------- 스타일(한 번만 주입) — 전부 .t3d 아래로 한정 ---------- */
const CSS = `
.t3d{position:absolute;inset:0;overflow:hidden;background:#1a1040;font-family:var(--font-game,'Fredoka','Jua','Pretendard',sans-serif);
  -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.t3d canvas.t3d-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s ease;touch-action:manipulation}
.t3d canvas.t3d-gl.on{opacity:1}
.t3d canvas.t3d-gl.hot{cursor:pointer}
.t3d-ui{position:absolute;inset:0;pointer-events:none}
.t3d-logo{position:absolute;left:50%;top:14px;transform:translateX(-50%);text-align:center;white-space:nowrap}
.t3d-logo-kr{position:relative;display:inline-block;font-family:var(--font-game,'Fredoka','Jua',sans-serif);font-weight:400;
  font-size:var(--t3d-logo,64px);letter-spacing:.01em;line-height:1.06;color:#fff;-webkit-text-stroke:calc(var(--t3d-logo,64px)*.09) #fff;
  filter:drop-shadow(0 4px 0 rgba(58,26,110,.5)) drop-shadow(0 12px 26px rgba(128,70,225,.6))}
.t3d-logo-kr::before{content:attr(data-text);position:absolute;left:0;top:0;width:100%;-webkit-text-stroke:0;
  background:linear-gradient(180deg,#7FE0FF 0%,#2E9BF2 28%,#4A5FE6 56%,#8B37E0 82%,#C734D6 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.t3d-logo-sub{font-weight:400;font-size:var(--t3d-logosub,13px);letter-spacing:.24em;color:#EEDCFF;margin-top:2px;
  text-shadow:0 2px 0 rgba(48,20,96,.55),0 0 14px rgba(186,126,255,.55)}
.t3d-hud{position:absolute;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:auto}
.t3d-hello{font-size:15px;color:#EAF2FF;text-shadow:0 2px 6px rgba(2,10,26,.7);white-space:nowrap}
.t3d-chips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.t3d-chip{font-size:13.5px;color:#fff;padding:4px 11px;border-radius:999px;white-space:nowrap;
  background:linear-gradient(180deg,rgba(255,255,255,.24),rgba(255,255,255,.08));border:1px solid rgba(255,255,255,.24);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 3px 0 rgba(8,10,44,.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.t3d-chip.gold{background:linear-gradient(180deg,#FFE9A8,#E7B85A);color:#4a2c00;border-color:#fff3c8;box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 3px 0 #9A7430}
.t3d-tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);font-size:13px;color:#fff;padding:3px 10px;border-radius:999px;
  background:rgba(40,22,92,.72);border:1px solid rgba(214,190,255,.45);white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,.4);will-change:transform}
.t3d-btn{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;border:0;margin:0;font:inherit;color:#fff;will-change:transform;
  display:flex;align-items:center;gap:9px;text-align:left;min-height:44px;min-width:44px;border-radius:16px;padding:7px 14px 8px 8px;
  background:linear-gradient(180deg,rgba(128,96,214,.86),rgba(62,38,142,.9));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.4),inset 0 -2px 0 rgba(20,8,60,.35),0 4px 0 rgba(22,10,64,.55),0 10px 22px rgba(8,2,30,.45);
  border:1px solid rgba(226,206,255,.42);transition:filter .15s,box-shadow .15s,background .15s;outline:none}
.t3d-btn .t3d-ico{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:17px;line-height:1;
  background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),rgba(255,255,255,.12) 70%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}
.t3d-btn b{display:block;font-weight:400;font-size:17px;line-height:1.15;letter-spacing:.01em}
.t3d-btn small{display:block;font-size:12px;line-height:1.25;color:rgba(236,226,255,.86);margin-top:2px}
.t3d-btn.on,.t3d-btn:hover{filter:brightness(1.12);background:linear-gradient(180deg,rgba(150,116,236,.95),rgba(84,52,176,.95));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 4px 0 rgba(22,10,64,.55),0 0 0 2px rgba(255,226,140,.85),0 0 26px rgba(255,210,120,.55)}
.t3d-btn:focus-visible{box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 4px 0 rgba(22,10,64,.55),0 0 0 3px #fff,0 0 0 6px #F2B84B}
.t3d-btn:active{filter:brightness(.96)}
.t3d-btn.primary{padding:10px 22px 11px 12px;border-radius:22px;color:#3a2200;gap:12px;
  background:linear-gradient(180deg,#FFF6D6 0%,#FFE08A 38%,#F0B94E 100%);border:1px solid #fff7d8;
  box-shadow:inset 0 1px 0 #fff,inset 0 -3px 0 rgba(150,90,10,.35),0 5px 0 #9A6A1E,0 12px 30px rgba(255,190,80,.45),0 0 44px rgba(255,214,120,.45)}
.t3d-btn.primary .t3d-ico{width:40px;height:40px;font-size:18px;color:#fff;background:radial-gradient(circle at 35% 30%,#ffb54d,#d9761a);box-shadow:inset 0 0 0 2px rgba(255,255,255,.7),0 2px 0 #8a4d0c}
.t3d-btn.primary b{font-size:22px;color:#3a2200}
.t3d-btn.primary small{color:#6b4a14;font-size:12.5px}
.t3d-btn.primary.on,.t3d-btn.primary:hover{filter:brightness(1.06);background:linear-gradient(180deg,#FFFBEA 0%,#FFE79E 38%,#F5C35C 100%);
  box-shadow:inset 0 1px 0 #fff,0 5px 0 #9A6A1E,0 0 0 3px rgba(255,255,255,.85),0 0 60px rgba(255,220,130,.8)}
.t3d-btn.primary:focus-visible{box-shadow:inset 0 1px 0 #fff,0 5px 0 #9A6A1E,0 0 0 3px #fff,0 0 0 6px #8B37E0}
.t3d-btn.pill{padding:6px 12px 7px 9px;border-radius:14px;gap:6px;background:linear-gradient(180deg,rgba(78,56,150,.84),rgba(42,24,98,.9))}
.t3d-btn.pill .t3d-ico{width:auto;height:auto;background:none;box-shadow:none;font-size:15px}
.t3d-btn.pill b{font-size:14px}
.t3d.narrow .t3d-btn{padding:6px 10px 7px 7px;gap:7px;border-radius:14px}
.t3d.narrow .t3d-btn .t3d-ico{width:28px;height:28px;font-size:15px}
.t3d.narrow .t3d-btn b{font-size:15.5px}
.t3d.narrow .t3d-btn small{font-size:11px}
.t3d.narrow .t3d-btn.primary{padding:9px 18px 10px 10px;gap:10px}
.t3d.narrow .t3d-btn.primary .t3d-ico{width:36px;height:36px}
.t3d.narrow .t3d-btn.primary b{font-size:20px}
.t3d.narrow .t3d-btn.pill{flex-direction:column;gap:1px;padding:5px 6px 6px;text-align:center;justify-content:center}
.t3d.narrow .t3d-btn.pill .t3d-ico{width:auto;height:auto;font-size:16px}
.t3d.narrow .t3d-btn.pill b{font-size:12.5px;line-height:1.15}
.t3d-hint{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.t3d.short .t3d-btn{padding:4px 11px 5px 5px;gap:6px;border-radius:13px}
.t3d.short .t3d-btn small{display:none}
.t3d.short .t3d-btn .t3d-ico{width:26px;height:26px;font-size:14px}
.t3d.short .t3d-btn b{font-size:14.5px}
.t3d.short .t3d-btn.primary{padding:6px 16px 6px 7px}
.t3d.short .t3d-btn.primary small{display:block;font-size:11px}
.t3d.short .t3d-btn.primary .t3d-ico{width:32px;height:32px}
.t3d.short .t3d-btn.primary b{font-size:18px}
.t3d.short .t3d-hello{font-size:13px}
.t3d.short .t3d-chip{font-size:12px;padding:2px 9px}
@media (prefers-reduced-motion:reduce){.t3d canvas.t3d-gl{transition:none}}
.t3d-raster{position:fixed;left:-10000px;top:0;pointer-events:none}
.t3d-raster .nm-human img{width:100%;height:100%;object-fit:contain;display:block}
.t3d-raster .nm-party{position:relative;display:inline-block}
.t3d-raster .nm-party .nm-party-buddy{position:absolute;right:-22%;bottom:0}
`;
function injectCss(){
  if(document.getElementById('t3d-style')) return;
  const s = document.createElement('style'); s.id = 't3d-style'; s.textContent = CSS; document.head.appendChild(s);
}

/* ---------- 캐릭터 HTML → 캔버스 (img·svg 를 화면에 놓인 그대로 찍는다) ---------- */
async function rasterizeMarkup(markup){
  if(!markup) return null;
  const host = document.createElement('div'); host.className = 't3d-raster'; host.innerHTML = markup;
  document.body.appendChild(host);
  try {
    const imgs = [...host.querySelectorAll('img')];
    await Promise.race([
      Promise.all(imgs.map(im => im.complete ? (im.decode ? im.decode().catch(() => null) : null) : new Promise(res => { im.addEventListener('load', res, { once:true }); im.addEventListener('error', res, { once:true }); }))),
      new Promise(res => setTimeout(res, 4000)),
    ]);
    await new Promise(res => requestAnimationFrame(() => res()));
    const root = host.firstElementChild || host;
    /* 동행 캐릭터가 오른쪽 아래로 삐져나오므로 모든 자식의 상자를 합친다 */
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    const parts = [];
    const vis = el => { for(let e = el; e && e !== host; e = e.parentElement){ const cs = getComputedStyle(e); if(cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
    host.querySelectorAll('img, svg').forEach(el => {
      if(el.tagName.toLowerCase() === 'svg' && el.parentElement && el.parentElement.closest('svg')) return;
      if(!vis(el)) return;
      if(el.tagName === 'IMG' && !(el.naturalWidth > 0)) return;
      const b = el.getBoundingClientRect(); if(b.width < 1 || b.height < 1) return;
      parts.push({ el, b });
      minX = Math.min(minX, b.left); minY = Math.min(minY, b.top); maxX = Math.max(maxX, b.right); maxY = Math.max(maxY, b.bottom);
    });
    if(!parts.length) return null;
    const rb = root.getBoundingClientRect();
    minX = Math.min(minX, rb.left); maxY = Math.max(maxY, rb.bottom);
    const pad = 8, S = 2;
    const cw = Math.ceil((maxX - minX + pad * 2) * S), ch = Math.ceil((maxY - minY + pad * 2) * S);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d');
    for(const { el, b } of parts){
      const x = (b.left - minX + pad) * S, y = (b.top - minY + pad) * S, w = b.width * S, h = b.height * S;
      if(el.tagName === 'IMG'){
        const cs = getComputedStyle(el);
        let dx = x, dy = y, dw = w, dh = h;
        if(cs.objectFit === 'contain'){
          const ar = el.naturalWidth / el.naturalHeight;
          if(w / h > ar){ dw = h * ar; dx = x + (w - dw) / 2; } else { dh = w / ar; dy = y + (h - dh) / 2; }
          if(cs.objectPosition && /bottom|100%$/.test(cs.objectPosition)) dy = y + h - dh;
        }
        g.save(); if(cs.filter && cs.filter !== 'none') g.filter = cs.filter.replace(/(-?\d*\.?\d+)px/g, (m, n) => (n * S) + 'px');
        try { g.drawImage(el, dx, dy, dw, dh); } catch(e){}
        g.restore();
      } else {
        const clone = el.cloneNode(true);
        clone.setAttribute('width', b.width); clone.setAttribute('height', b.height);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clone.removeAttribute('style');
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
        await new Promise(res => { const im = new Image(); im.onload = () => { try { g.drawImage(im, x, y, w, h); } catch(e){} res(); }; im.onerror = res; im.src = url; });
      }
    }
    /* 투명 캔버스로 나오면(그림을 하나도 못 찍음) 실패 */
    const d = g.getImageData(0, 0, cw, ch).data; let any = false;
    for(let i = 3; i < d.length; i += 64){ if(d[i] > 10){ any = true; break; } }
    return any ? c : null;
  } catch(e){ return null; }
  finally { host.remove(); }
}

/* ============================================================ */
export async function mountTitle3D(container, opts){
  opts = opts || {};
  if(!container || !glOK()) return null;
  injectCss();
  let lang = opts.lang || 'ko';
  const choices = (opts.choices && opts.choices.length ? opts.choices : DEFAULT_CHOICES).map(c => Object.assign({}, c));
  if(!choices.some(c => c.primary)){ const c0 = choices.find(c => c.id === 'continue') || choices[0]; c0.primary = true; }
  const reduce = opts.reducedMotion != null ? !!opts.reducedMotion : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const root = document.createElement('div'); root.className = 't3d';
  const canvas = document.createElement('canvas'); canvas.className = 't3d-gl';
  canvas.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.className = 't3d-ui';
  root.append(canvas, ui);
  container.appendChild(root);

  const sizeOf = () => [Math.max(240, root.clientWidth || container.clientWidth || 800), Math.max(320, root.clientHeight || container.clientHeight || 600)];
  let [VW, VH] = sizeOf();

  await fontsReady();
  let playerCanvas = null;
  try {
    const mk = typeof opts.player === 'function' ? opts.player(220) : opts.player;
    playerCanvas = await rasterizeMarkup(mk);
  } catch(e){ playerCanvas = null; }
  if(!root.isConnected) return null;

  let k;
  try { k = makeKit(11, { live:true, canvas, width:VW, height:VH }); }
  catch(e){ root.remove(); return null; }
  const { r, scene, cam, rnd } = k;
  let built;
  try { built = buildWorld(k, choices, playerCanvas); }
  catch(e){ console.error('[title3d]', e); try { r.dispose(); } catch(_){} root.remove(); return null; }
  const { objs, player, animate, applyLayout, placeSky, skyU } = built;

  /* ---------- HTML 겹 ---------- */
  const logo = document.createElement('div'); logo.className = 't3d-logo';
  const hud = document.createElement('div'); hud.className = 't3d-hud';
  const tag = document.createElement('div'); tag.className = 't3d-tag';
  const hint = document.createElement('h2'); hint.className = 't3d-hint';
  ui.append(hint, logo, hud);
  if(opts.name) ui.append(tag);
  const btns = {};
  choices.forEach(c => {
    const b = document.createElement('button'); b.type = 'button';
    b.className = 't3d-btn' + (c.primary ? ' primary' : MODE_IDS.includes(c.id) ? ' mode' : ' pill');
    b.dataset.id = c.id;
    b.addEventListener('pointerenter', () => setHot(c.id, 'btn'));
    b.addEventListener('pointerleave', () => { if(hot === c.id && hotSrc === 'btn') setHot(null); });
    b.addEventListener('focus', () => setHot(c.id, 'focus'));
    b.addEventListener('blur', () => { if(hot === c.id && hotSrc === 'focus') setHot(null); });
    b.addEventListener('click', () => pick(c.id));
    btns[c.id] = b;
  });
  /* 탭 순서 = 중요도(이어서 → 모드 4 → 소품) */
  const order = [...choices].sort((a, b) => rank(a) - rank(b));
  function rank(c){ return c.primary ? 0 : MODE_IDS.includes(c.id) ? 1 + MODE_IDS.indexOf(c.id) : 10; }
  order.forEach(c => ui.appendChild(btns[c.id]));

  function fillText(){
    const L = LOGO[lang] || LOGO.ko;
    logo.innerHTML = `<div class="t3d-logo-kr" data-text="${esc(L[0])}">${esc(L[0])}</div><div class="t3d-logo-sub">${esc(L[1])}</div>`;
    const chips = [];
    if(opts.coins != null) chips.push(`<span class="t3d-chip">🪙 ${esc(opts.coins)}</span>`);
    (opts.chips || []).forEach(ch => { if(!ch) return; const o = typeof ch === 'string' ? { text:ch } : ch;
      chips.push(`<span class="t3d-chip${o.gold ? ' gold' : ''}">${o.icon ? esc(o.icon) + ' ' : ''}${esc(tr(o.text, lang))}</span>`); });
    hud.innerHTML = `<div class="t3d-hello">${opts.name ? esc(opts.name) + ' — ' : ''}${esc(HELLO[lang] || HELLO.ko)}</div>`
      + (chips.length ? `<div class="t3d-chips">${chips.join('')}</div>` : '') + (opts.extraHtml || '');
    tag.textContent = opts.name || '';
    hint.textContent = PICK_HINT[lang] || PICK_HINT.ko;
    choices.forEach(c => {
      const b = btns[c.id], lab = tr(c.label, lang), sub = tr(c.sub, lang);
      b.innerHTML = `<span class="t3d-ico" aria-hidden="true">${esc(c.icon || '•')}</span><span class="t3d-txt"><b>${esc(lab)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>`;
      b.setAttribute('aria-label', sub ? `${lab} — ${sub}` : lab);
    });
    root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang);
  }

  /* ---------- 강조(hover/focus/3D hover) ---------- */
  let hot = null, hotSrc = null;
  function setHot(id, src){
    hot = id; hotSrc = id ? src : null;
    Object.keys(btns).forEach(k2 => btns[k2].classList.toggle('on', k2 === id));
    canvas.classList.toggle('hot', !!id && src === 'gl');
    Object.values(objs).forEach(o => { o.hotT = o.id === id ? 1 : 0; });
    wake();
  }
  let picked = false;
  function pick(id){
    if(picked || disposed) return; picked = true;
    try { opts.onPick && opts.onPick(id); } finally { setTimeout(() => { picked = false; }, 400); }
  }

  /* ---------- 레이캐스트 ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hitList = Object.values(objs).map(o => o.hit);
  function hitAt(ev){
    const b = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - b.left) / b.width) * 2 - 1, -((ev.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const h = ray.intersectObjects(hitList, false)[0];
    return h ? h.object.userData.choiceId : null;
  }
  const onMove = ev => { if(ev.pointerType === 'touch') return; const id = hitAt(ev); if(id !== (hotSrc === 'gl' ? hot : null) && (hotSrc !== 'btn' && hotSrc !== 'focus' || id)) setHot(id, 'gl'); };
  const onLeave = () => { if(hotSrc === 'gl') setHot(null); };
  const onClick = ev => { const id = hitAt(ev); if(id) pick(id); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  /* ---------- 구도(가로/세로) ---------- */
  let layout = null, narrow = false;
  const sizes = {};
  function measure(){
    Object.keys(btns).forEach(id => { const b = btns[id]; sizes[id] = [b.offsetWidth, b.offsetHeight]; });
    sizes._hud = [hud.offsetWidth, hud.offsetHeight];
    sizes._logo = [logo.offsetWidth, logo.offsetHeight];
  }
  function relayout(){
    [VW, VH] = sizeOf();
    r.setSize(VW, VH, false);
    cam.aspect = VW / VH;
    const portrait = VW / VH < 0.9;
    const short = !portrait && VH < 560;
    narrow = VW < 560;
    root.classList.toggle('narrow', narrow);
    root.classList.toggle('short', short);
    root.style.setProperty('--t3d-logo', (narrow ? Math.min(46, VW * 0.115) : short ? Math.max(30, VH * 0.085) : Math.min(64, Math.max(44, VH * 0.075))) + 'px');
    root.style.setProperty('--t3d-logosub', (narrow ? 11 : 13) + 'px');
    /* 버튼 폭 한도 — 세로: 모드 2칸, 소품 4칸 */
    choices.forEach(c => {
      const b = btns[c.id];
      if(portrait){
        b.style.maxWidth = c.primary ? (VW - 40) + 'px' : MODE_IDS.includes(c.id) ? Math.floor((VW - 36) / 2) + 'px' : Math.floor((VW - 28) / 4 - 4) + 'px';
        b.style.width = !c.primary && !MODE_IDS.includes(c.id) ? Math.floor((VW - 28) / 4 - 4) + 'px' : '';
      } else { b.style.maxWidth = c.primary ? '360px' : '250px'; b.style.width = ''; }
    });
    layout = portrait ? 'portrait' : short ? 'wide' : 'landscape';
    applyLayout(layout);
    /* HUD 자리: 가로 = 오른쪽 위 구석, 세로 = 로고 아래 가운데 */
    if(portrait){ hud.style.left = '50%'; hud.style.right = ''; hud.style.transform = 'translateX(-50%)'; }
    else { hud.style.left = ''; hud.style.right = short ? '12px' : '22px'; hud.style.transform = ''; hud.style.top = short ? '8px' : '20px'; }
    logo.style.top = (portrait ? 10 : short ? 6 : 14) + 'px';
    /* 로고가 폭을 넘으면(영어 긴 제목) 글자를 줄인다 */
    const lk = logo.querySelector('.t3d-logo-kr');
    if(lk){ const cur = parseFloat(getComputedStyle(root).getPropertyValue('--t3d-logo')) || 46; const lw = lk.offsetWidth;
      if(lw > VW - 28) root.style.setProperty('--t3d-logo', Math.floor(cur * (VW - 28) / lw) + 'px'); }
    measure();
    if(portrait) hud.style.top = (logo.offsetTop + sizes._logo[1] + 4) + 'px';
    fitCamera();
    wake(true);
  }

  /* 모든 물건 상자 + 버튼 상자가 화면 안(로고·인사 아래)에 들어오도록 거리와 시점을 맞춘다 */
  const _v = new THREE.Vector3();
  const proj = p => { _v.copy(p).project(cam); return [(_v.x + 1) / 2 * VW, (1 - _v.y) / 2 * VH]; };
  function fitCamera(){
    const L = built.layouts[layout];
    const pitch = THREE.MathUtils.degToRad(L.pitch), fov = L.fov;
    cam.fov = fov; cam.updateProjectionMatrix();
    const dir = new THREE.Vector3(0, Math.sin(pitch), Math.cos(pitch));
    const T = new THREE.Vector3(...L.target);
    let d = L.dist;
    const topPad = layout === 'portrait' ? (hud.offsetTop + sizes._hud[1] + 8) : (logo.offsetTop + sizes._logo[1] + 6);
    const side = 12, bot = 12;
    const availW = VW - side * 2, availH = VH - topPad - bot;
    const pts = [];
    Object.values(objs).forEach(o => { o.box.forEach(p => pts.push(p)); });
    for(let it = 0; it < 14; it++){
      cam.position.copy(T).addScaledVector(dir, d); cam.lookAt(T); cam.updateMatrixWorld(true);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      const add = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
      pts.forEach(p => { const [x, y] = proj(p); add(x, y); });
      Object.values(objs).forEach(o => {
        const s = sizes[o.id]; if(!s) return;
        const [ax, ay] = proj(o.anchorW);
        const [lx, ly] = labelPos(o, ax, ay, s);
        add(lx, ly); add(lx + s[0], ly + s[1]);
      });
      const s = Math.max((x1 - x0) / availW, (y1 - y0) / availH);
      d *= 1 + (s - 1) * 0.85;
      const wpp = 2 * d * Math.tan(THREE.MathUtils.degToRad(fov / 2)) / VH;
      const cx = (x0 + x1) / 2 - (side + availW / 2), cy = (y0 + y1) / 2 - (topPad + availH / 2);
      const right = new THREE.Vector3(1, 0, 0), up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
      T.addScaledVector(right, cx * wpp * 0.9).addScaledVector(up, -cy * wpp * 0.9);
    }
    cam.position.copy(T).addScaledVector(dir, d); cam.lookAt(T); cam.updateMatrixWorld(true);
    camBase.copy(cam.position); tgtBase.copy(T);
    placeSky(layout === 'portrait');
    skyU.res.value.set(r.domElement.width, r.domElement.height);
  }
  const camBase = new THREE.Vector3(), tgtBase = new THREE.Vector3();
  /* 버튼의 왼쪽 위 좌표 — 모드·소품은 물건 발밑, 이어서 모험은 문 가운데 */
  function labelPos(o, ax, ay, s){
    if(o.place === 'center' || o.place === 'top') return [ax - s[0] / 2, ay - s[1] / 2];
    if(o.place === 'left') return [ax - s[0] - 4, ay - s[1] / 2];
    if(o.place === 'right') return [ax + 4, ay - s[1] / 2];
    return [ax - s[0] / 2, ay + 4];
  }

  /* ---------- 버튼 위치(매 프레임) + 겹침 풀기 ---------- */
  function placeLabels(){
    const rects = [];
    Object.values(objs).forEach(o => {
      const s = sizes[o.id]; if(!s) return;
      const [ax, ay] = proj(o.anchorW);
      let [x, y] = labelPos(o, ax, ay, s);
      rects.push({ o, x, y, w:s[0], h:s[1] });
    });
    /* 겹치면 아래 것을 내린다 — 물건 발밑에 붙는 구도라 거의 안 겹치지만 좁은 폭·긴 번역에 대비 */
    rects.sort((a, b) => a.y - b.y);
    for(let pass = 0; pass < 6; pass++){
      for(let i = 0; i < rects.length; i++) for(let j = i + 1; j < rects.length; j++){
        const a = rects[i], b = rects[j];
        if(a.x < b.x + b.w + 4 && b.x < a.x + a.w + 4 && a.y < b.y + b.h + 4 && b.y < a.y + a.h + 4){
          /* 같은 줄이면 옆으로 벌리고, 아니면 아래 것을 내린다 */
          if(Math.abs(a.y - b.y) < Math.min(a.h, b.h) * 0.5){
            const L0 = a.x < b.x ? a : b, R0 = L0 === a ? b : a, ov = L0.x + L0.w + 6 - R0.x;
            if(ov > 0){ L0.x -= ov / 2; R0.x += ov / 2; }
          } else { const ov = a.y + a.h + 4 - b.y; if(ov > 0) b.y += ov; }
        }
      }
    }
    rects.forEach(R => {
      R.x = Math.max(6, Math.min(VW - R.w - 6, R.x)); R.y = Math.max(6, Math.min(VH - R.h - 6, R.y));
      const b = btns[R.o.id];
      b.style.transform = `translate3d(${Math.round(R.x)}px,${Math.round(R.y)}px,0)`;
    });
    if(opts.name && player){
      const [tx, ty] = proj(player.tagW);
      tag.style.transform = `translate3d(${Math.round(tx)}px,${Math.round(ty)}px,0) translate(-50%,-100%)`;
      /* 이름표가 버튼에 가리면 숨긴다(인사말에 이름이 이미 있다) */
      const tw = tag.offsetWidth || 60, th = tag.offsetHeight || 22, x0 = tx - tw / 2, y0 = ty - th;
      const hidden = rects.some(R => x0 < R.x + R.w && R.x < x0 + tw && y0 < R.y + R.h && R.y < y0 + th);
      tag.style.visibility = hidden ? 'hidden' : '';
    }
  }

  /* ---------- 루프 ---------- */
  let raf = 0, running = !document.hidden, visible = true, disposed = false, t0 = performance.now(), last = t0, shown = false, dirty = true, settle = 0;
  function frame(now){
    raf = 0; if(disposed) return;
    if(!root.isConnected){ dispose(); return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = reduce ? 0 : (now - t0) / 1000;
    const moving = animate(t, dt, reduce);
    placeLabels();
    r.render(scene, cam);
    if(!shown){ shown = true; canvas.classList.add('on'); }
    dirty = false;
    if(moving) settle = now;
    if(running && visible && (!reduce || now - settle < 700)) raf = requestAnimationFrame(frame);
  }
  function wake(force){ if(force) dirty = true; if(!raf && running && visible && !disposed){ last = performance.now(); settle = last; raf = requestAnimationFrame(frame); } }
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
    if(io) io.disconnect(); if(ro) ro.disconnect(); else window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('click', onClick);
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

  fillText();
  relayout();
  wake(true);
  return {
    setLang(l){ if(disposed) return; lang = l || 'ko'; fillText(); relayout(); },
    dispose,
    /* 검사용 */
    _debug:{ objs, cam, proj:p => proj(p), btns, hitAt:(x, y) => hitAt({ clientX:x, clientY:y }), get layout(){ return layout; } },
  };
}

/* ============================================================
   3D 세계
   ============================================================ */
function buildWorld(k, choices, playerCanvas){
  const { scene, cam, rnd, canvasTex, rbox, woodMat, metal, glass, lacquer, faceTex, mathText, MAIN } = k;
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  scene.background = new THREE.Color('#1b1147');
  scene.fog = new THREE.Fog('#2a1b62', 26, 70);
  k.env({ wall:'#3a2c78', intensity:0.55 });

  /* ---- 빛: 달빛(서늘한 라벤더, 그림자) + 보라 반구광 + 문에서 새는 금빛 ---- */
  scene.add(new THREE.HemisphereLight('#8f7ae6', '#221543', 0.95));
  const moon = new THREE.DirectionalLight('#c9baff', 1.7);
  moon.position.set(-7, 12, 8); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024);
  Object.assign(moon.shadow.camera, { left:-11, right:11, top:11, bottom:-11, near:1, far:40 });
  moon.shadow.radius = 5; moon.shadow.bias = -0.0006; moon.shadow.normalBias = 0.03;
  scene.add(moon, moon.target);
  const rim = new THREE.DirectionalLight('#ff9ad8', 0.45); rim.position.set(8, 5, -10); scene.add(rim);
  const warm = new THREE.PointLight('#ffc873', 26, 10, 1.5); scene.add(warm);

  /* ---- 하늘: 세로 그라데이션 구 + 반짝이는 별 + 달 ---- */
  /* 하늘은 화면 기준 그라데이션 — 섬이 밤하늘 한가운데 떠 있다(내려다봐도 위아래가 다 하늘) */
  const skyU = { res:{ value:new THREE.Vector2(800, 600) }, t:{ value:0 } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16), new THREE.ShaderMaterial({
    side:THREE.BackSide, depthWrite:false, fog:false, uniforms:skyU,
    vertexShader:'void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader:`uniform vec2 res; uniform float t;
      float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0., a = .5; for(int i = 0; i < 4; i++){ v += a * n2(p); p *= 2.03; a *= .5; } return v; }
      void main(){ vec2 uv = gl_FragCoord.xy / res; float asp = res.x / res.y;
        vec3 top = vec3(.055, .03, .17), mid = vec3(.20, .12, .47), low = vec3(.33, .19, .60), deep = vec3(.09, .05, .23);
        float y = uv.y; vec3 c = mix(low, mid, smoothstep(.25, .6, y)); c = mix(c, top, smoothstep(.6, 1., y)); c = mix(deep, c, smoothstep(0., .3, y));
        vec2 q = vec2(uv.x * asp, uv.y) * 2.2;
        float neb = fbm(q + vec2(t * .01, 0.)); float neb2 = fbm(q * 1.7 - vec2(3.1, t * .008));
        c += vec3(.42, .18, .55) * pow(neb, 3.) * .55 + vec3(.12, .25, .55) * pow(neb2, 4.) * .5;
        gl_FragColor = vec4(c, 1.); }`,
  }));
  sky.renderOrder = -10; scene.add(sky);

  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const glow = (color, size, opacity) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color, transparent:true, opacity:opacity == null ? 1 : opacity, depthWrite:false, blending:THREE.AdditiveBlending, fog:false })); s.scale.set(size, size, 1); return s; };

  const STARS = 700;
  { const pos = new Float32Array(STARS * 3), ph = new Float32Array(STARS), sz = new Float32Array(STARS);
    for(let i = 0; i < STARS; i++){ const a = rnd() * Math.PI * 2, y = rnd() * 2 - 1, rr = Math.sqrt(1 - y * y);
      pos.set([Math.cos(a) * rr * 70, y * 70, Math.sin(a) * rr * 70], i * 3); ph[i] = rnd() * 6.28; sz[i] = 1 + rnd() * rnd() * 3.2; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); geo.setAttribute('sz', new THREE.BufferAttribute(sz, 1));
    const mat = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, fog:false, uniforms:{ t:{ value:0 }, pr:{ value:1 } },
      vertexShader:'attribute float ph; attribute float sz; uniform float t; uniform float pr; varying float vA; void main(){ vA = .55 + .45 * sin(t * 1.7 + ph * 3.); gl_PointSize = sz * pr * (0.8 + .4 * vA); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader:'varying float vA; void main(){ vec2 d = gl_PointCoord - .5; float a = smoothstep(.5, 0., length(d)); gl_FragColor = vec4(vec3(1.,.96,.88) * a * vA, a * vA); }' });
    const pts = new THREE.Points(geo, mat); pts.renderOrder = -9; scene.add(pts); var starMat = mat; }

  const moonGrp = new THREE.Group();
  const moonTex = canvasTex(256, 256, (g, w, h) => { const cx = w / 2, cy = h / 2, R = w * 0.46;
    const gr = g.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R); gr.addColorStop(0, '#fffaf0'); gr.addColorStop(0.7, '#f3e6c8'); gr.addColorStop(1, '#d8c6a4');
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip();
    for(let i = 0; i < 14; i++){ const x = cx + (rnd() - 0.5) * R * 1.5, y = cy + (rnd() - 0.5) * R * 1.5, rr = 6 + rnd() * 22; g.fillStyle = `rgba(170,150,120,${0.12 + rnd() * 0.18})`; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    /* 초승달 느낌 — 오른쪽 아래를 보랏빛 그림자로 */
    const sh = g.createRadialGradient(cx + R * 0.55, cy + R * 0.35, R * 0.2, cx + R * 0.55, cy + R * 0.35, R * 1.2); sh.addColorStop(0, 'rgba(90,70,150,.45)'); sh.addColorStop(0.6, 'rgba(90,70,150,.12)'); sh.addColorStop(1, 'rgba(60,40,120,0)');
    g.fillStyle = sh; g.fillRect(0, 0, w, h); g.restore(); });
  const moonSp = new THREE.Sprite(new THREE.SpriteMaterial({ map:moonTex, transparent:true, fog:false, depthWrite:false })); moonSp.scale.set(4.2, 4.2, 1); moonGrp.add(moonSp);
  const mg = glow('#d9c4ff', 14, 0.55); moonGrp.add(mg);
  scene.add(moonGrp);
  /* 달·구름은 구도가 정해진 뒤 카메라 기준으로 놓는다(placeSky) */
  const cloudTex = canvasTex(256, 128, (g, w, h) => { for(let i = 0; i < 26; i++){ const x = w * (0.18 + rnd() * 0.64), y = h * (0.45 + rnd() * 0.25), rr = 18 + rnd() * 34;
      const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.42)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } });
  const clouds = [];
  for(let i = 0; i < 9; i++){ const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:cloudTex, color:i % 3 ? '#b59ae8' : '#e3b8f0', transparent:true, opacity:0.32 + rnd() * 0.2, depthWrite:false, fog:false }));
    scene.add(sp); clouds.push({ sp, a:rnd(), b:rnd(), s:0.7 + rnd() * 0.7 }); }

  /* ---- 떠 있는 섬: 풀밭 윗면 + 바위 밑동 ---- */
  const grassTex = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#3d6448'; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 26000; i++){ const x = rnd() * w, y = rnd() * h; g.fillStyle = `rgba(${40 + rnd() * 60},${80 + rnd() * 70},${50 + rnd() * 50},${0.12 + rnd() * 0.3})`; g.fillRect(x, y, 1.5, 2 + rnd() * 5); }
    for(let i = 0; i < 90; i++){ const x = rnd() * w, y = rnd() * h, rr = 20 + rnd() * 70; const gr = g.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, `rgba(${rnd() < .5 ? '30,50,40' : '90,120,80'},.22)`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  }, [3, 3]);
  const rockTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#4b3a6e'; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 5000; i++){ g.fillStyle = `rgba(${40 + rnd() * 60},${30 + rnd() * 40},${70 + rnd() * 60},${rnd() * 0.35})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 8, 1 + rnd() * 4); }
    for(let i = 0; i < 40; i++){ g.strokeStyle = 'rgba(20,10,40,.35)'; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); for(let x = 0; x <= w; x += 40) g.lineTo(x, y + (rnd() - 0.5) * 18); g.stroke(); } }, [3, 1]);
  const island = new THREE.Group(); scene.add(island);
  const top = new THREE.Mesh(new THREE.CircleGeometry(1, 72), new THREE.MeshStandardMaterial({ map:grassTex, roughness:0.95 }));
  top.rotation.x = -Math.PI / 2; top.receiveShadow = true; island.add(top);
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.97, 0.06, 72, 1, true), new THREE.MeshStandardMaterial({ color:'#2f5a3c', roughness:1 }));
  lip.position.y = -0.03; island.add(lip);
  const underGeo = new THREE.ConeGeometry(1, 1, 36, 6, true); underGeo.rotateX(Math.PI); underGeo.translate(0, -0.5, 0);
  { const p = underGeo.attributes.position; for(let i = 0; i < p.count; i++){ const y = p.getY(i); if(y < -0.02){ const f = 1 + (rnd() - 0.5) * 0.28; p.setX(i, p.getX(i) * f); p.setZ(i, p.getZ(i) * f); p.setY(i, y * (0.85 + rnd() * 0.3)); } } underGeo.computeVertexNormals(); }
  const under = new THREE.Mesh(underGeo, new THREE.MeshStandardMaterial({ map:rockTex, roughness:1, flatShading:true, side:THREE.DoubleSide }));
  under.position.y = -0.05; island.add(under);

  /* 가운데 광장(돌바닥) */
  const stoneTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#6d6391'; g.fillRect(0, 0, w, h);
    const n = 9; for(let yy = 0; yy < n; yy++) for(let xx = 0; xx < n; xx++){ const off = (yy % 2) * 0.5; const x = (xx + off) * w / n, y = yy * h / n;
      const c = 95 + rnd() * 40; g.fillStyle = `rgb(${c * 0.9},${c * 0.85},${c * 1.15})`; g.beginPath(); g.roundRect ? g.roundRect(x + 3, y + 3, w / n - 6, h / n - 6, 10) : g.rect(x + 3, y + 3, w / n - 6, h / n - 6); g.fill(); }
    for(let i = 0; i < 3000; i++){ g.fillStyle = `rgba(30,20,50,${rnd() * 0.15})`; g.fillRect(rnd() * w, rnd() * h, 2, 2); } }, [2, 2]);
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshStandardMaterial({ map:stoneTex, roughness:0.85 }));
  plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.012; plaza.receiveShadow = true; scene.add(plaza);

  /* ---- 공용 재질 ---- */
  const stoneBlockTex = canvasTex(256, 512, (g, w, h) => { g.fillStyle = '#8d82b0'; g.fillRect(0, 0, w, h);
    const rows = 8; for(let yy = 0; yy < rows; yy++){ const off = (yy % 2) * w / 4; for(let x = -w / 2; x < w; x += w / 2){ const c = 120 + rnd() * 40; g.fillStyle = `rgb(${c * .92},${c * .88},${c * 1.12})`; g.fillRect(x + off + 3, yy * h / rows + 3, w / 2 - 6, h / rows - 6); } }
    for(let i = 0; i < 2500; i++){ g.fillStyle = `rgba(40,30,70,${rnd() * 0.18})`; g.fillRect(rnd() * w, rnd() * h, 2, 2); } });
  const stone = new THREE.MeshStandardMaterial({ map:stoneBlockTex, roughness:0.85 });
  const stoneTorusTex = stoneBlockTex.clone(); stoneTorusTex.needsUpdate = true; stoneTorusTex.wrapS = stoneTorusTex.wrapT = THREE.RepeatWrapping; stoneTorusTex.repeat.set(4, 1);
  const stoneArch = new THREE.MeshStandardMaterial({ map:stoneTorusTex, roughness:0.85 });
  const gold = metal('#e2b457', 0.28);
  const brass = metal('#c89b4a', 0.38);
  const purpleLac = lacquer('#5a2fa8');
  const shadowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(10,4,30,.55)'); gr.addColorStop(1, 'rgba(10,4,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const blob = (sx, sz) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), new THREE.MeshBasicMaterial({ map:shadowTex, transparent:true, depthWrite:false })); m.rotation.x = -Math.PI / 2; m.position.y = 0.02; return m; };
  const ringMat = () => new THREE.MeshBasicMaterial({ color:'#ffd67a', transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide });
  const cast = o => { o.traverse(m => { if(m.isMesh){ m.castShadow = true; m.receiveShadow = true; } }); return o; };

  /* ============ 물건들 ============ */
  const makers = {};

  /* 이어서 모험 — 빛의 문 */
  makers.continue = () => {
    const g = new THREE.Group(); const anim = [];
    const s1 = new THREE.Mesh(rbox(4.2, 0.2, 1.9, 0.12), stone); g.add(s1);
    const s2 = new THREE.Mesh(rbox(3.5, 0.18, 1.45, 0.1), stone); s2.position.y = 0.2; g.add(s2);
    const base = 0.38;
    [-1.4, 1.4].forEach(x => {
      const p = new THREE.Mesh(rbox(0.78, 3.0, 0.82, 0.08), stone); p.position.set(x, base, 0); g.add(p);
      const cap = new THREE.Mesh(rbox(0.96, 0.18, 1.0, 0.06), stone); cap.position.set(x, base + 3.0, 0); g.add(cap);
      const band = new THREE.Mesh(rbox(0.84, 0.09, 0.88, 0.03), gold); band.position.set(x, base + 0.35, 0); g.add(band);
      /* 기둥의 등불 */
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshBasicMaterial({ color:'#ffe6a6' }));
      lamp.position.set(x, base + 2.2, 0.47); g.add(lamp);
      const lg = glow('#ffcf7a', 1.3, 0.85); lg.position.copy(lamp.position); g.add(lg);
      anim.push(t => { lg.material.opacity = 0.7 + Math.sin(t * 3 + x) * 0.12; });
    });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.4, 14, 40, Math.PI), stoneArch); arch.position.set(0, base + 3.18, 0); g.add(arch);
    const trim = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.05, 8, 48, Math.PI), gold); trim.position.set(0, base + 3.18, 0.42); g.add(trim);
    /* 쐐기돌의 별 */
    const star = new THREE.Shape(); for(let i = 0; i < 10; i++){ const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 0.17 : 0.4; i ? star.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : star.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    const sg = new THREE.ExtrudeGeometry(star, { depth:0.1, bevelEnabled:true, bevelThickness:0.03, bevelSize:0.03, bevelSegments:2 });
    const st = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color:'#ffd35a', metalness:0.8, roughness:0.25, emissive:'#9a6a10', emissiveIntensity:0.6 }));
    st.position.set(0, base + 4.95, 0.1); g.add(st);
    const sgl = glow('#ffe39a', 2.0, 0.8); sgl.position.set(0, base + 5.0, 0.3); g.add(sgl);
    anim.push(t => { st.rotation.y = Math.sin(t * 0.8) * 0.5; });
    /* 문 안쪽 — 소용돌이 빛 */
    const sh = new THREE.Shape(); sh.moveTo(-1.02, 0); sh.lineTo(1.02, 0); sh.lineTo(1.02, 3.18); sh.absarc(0, 3.18, 1.02, 0, Math.PI, false); sh.lineTo(-1.02, 0);
    const pg = new THREE.ShapeGeometry(sh, 24);
    const pmat = new THREE.ShaderMaterial({ uniforms:{ t:{ value:0 } }, fog:false,
      vertexShader:'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader:`uniform float t; varying vec2 vP;
        void main(){ vec2 p = (vP - vec2(0., 2.0)) / vec2(1.05, 2.3); float r = length(p); float a = atan(p.y, p.x);
          float sw = sin(a * 5. + r * 9. - t * 1.6) * .5 + .5; float sw2 = sin(a * 3. - r * 6. + t * 1.1) * .5 + .5;
          vec3 core = vec3(1.0, .97, .86), mid = vec3(1.0, .80, .42), edge = vec3(.78, .45, .95);
          vec3 c = mix(core, mid, smoothstep(0.05, .7, r)); c = mix(c, edge, smoothstep(.55, 1.15, r));
          c += (sw * .22 + sw2 * .12) * vec3(1., .75, .95) * smoothstep(.1, .8, r);
          gl_FragColor = vec4(c * (1.05 - r * .25), 1.); }` });
    const portal = new THREE.Mesh(pg, pmat); portal.position.set(0, base, 0.02); g.add(portal);
    anim.push(t => { pmat.uniforms.t.value = t; });
    const pgl = glow('#ffd889', 6.2, 0.55); pgl.position.set(0, base + 2.0, 0.6); g.add(pgl);
    anim.push(t => { pgl.material.opacity = 0.5 + Math.sin(t * 1.3) * 0.08; });
    /* 문에서 흘러나오는 빛 줄기(바닥) */
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 3.2), new THREE.MeshBasicMaterial({ map:glowTex, color:'#ffcf7a', transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending }));
    beam.rotation.x = -Math.PI / 2; beam.position.set(0, 0.03, 1.5); beam.scale.set(1.3, 1, 1); g.add(beam);
    cast(g); portal.castShadow = false; beam.castShadow = false; s1.castShadow = false;
    return { g, anim, h:5.4, w:4.2, d:1.9, anchor:V3(0, base + 1.35, 0.3), place:'center', anchorBelow:V3(0, 0, 1.0), anchorTop:V3(0, base + 3.05, 0.3) };
  };

  /* 진단하기 — 나침반 탑 */
  makers.diag = () => {
    const g = new THREE.Group(); const anim = [];
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.75, 2.4, 20), new THREE.MeshStandardMaterial({ map:stoneBlockTex, roughness:0.85 }));
    body.position.y = 1.2; g.add(body);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.07, 8, 32), gold); ring.rotation.x = Math.PI / 2; ring.position.y = 2.4; g.add(ring);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.2, 20), purpleLac); roof.position.y = 3.0; g.add(roof);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), gold); tip.position.y = 3.65; g.add(tip);
    const winMat = new THREE.MeshBasicMaterial({ color:'#ffd98a' });
    [[0.75, 0.2], [1.6, 0.22]].forEach(([y, w]) => { const wn = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 1.5), winMat); wn.position.set(0, y, 0.66); g.add(wn); });
    const door = new THREE.Mesh(rbox(0.46, 0.7, 0.08, 0.04), woodMat('#6b3f22', [40, 20, 8])); door.position.set(0, 0, 0.68); g.add(door);
    /* 떠 있는 나침반(세로 원판) */
    const cmp = new THREE.Group(); cmp.position.set(0, 4.55, 0);
    const faceT = canvasTex(512, 512, (gg, w, h) => { const cx = w / 2, cy = h / 2;
      const gr = gg.createRadialGradient(cx, cy, 10, cx, cy, w / 2); gr.addColorStop(0, '#fbf2dc'); gr.addColorStop(1, '#e2cf9e'); gg.fillStyle = gr; gg.fillRect(0, 0, w, h);
      gg.strokeStyle = '#7a5a2a'; gg.lineWidth = 6; gg.beginPath(); gg.arc(cx, cy, w * 0.44, 0, 7); gg.stroke();
      for(let i = 0; i < 32; i++){ const a = i / 32 * Math.PI * 2, r1 = w * 0.44, r2 = r1 - (i % 4 ? 12 : 26); gg.lineWidth = i % 4 ? 2 : 4; gg.beginPath(); gg.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); gg.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); gg.stroke(); }
      gg.fillStyle = '#5a3a14'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.font = `700 54px ${MAIN}`;
      [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]].forEach(([s, x, y]) => gg.fillText(s, cx + x * w * 0.31, cy + y * w * 0.31));
      gg.fillStyle = 'rgba(122,90,42,.25)'; gg.beginPath(); for(let i = 0; i < 8; i++){ const a = i / 8 * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? w * 0.08 : w * 0.24; i ? gg.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : gg.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } gg.fill(); });
    const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 40), [brass, new THREE.MeshStandardMaterial({ map:faceT, roughness:0.5 }), brass]);
    disk.rotation.x = Math.PI / 2; cmp.add(disk);
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.06, 10, 40), gold); cmp.add(bezel);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.6, 40), glass('#e8f0ff')); lens.position.z = 0.1; cmp.add(lens);
    const needle = new THREE.Group(); needle.position.z = 0.075;
    const nRed = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.48, 4), new THREE.MeshStandardMaterial({ color:'#d6312f', roughness:0.4, metalness:0.3 })); nRed.position.y = 0.24; needle.add(nRed);
    const nW = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.48, 4), new THREE.MeshStandardMaterial({ color:'#f3f0ea', roughness:0.4 })); nW.rotation.z = Math.PI; nW.position.y = -0.24; needle.add(nW);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12), gold); pin.rotation.x = Math.PI / 2; needle.add(pin);
    cmp.add(needle); g.add(cmp);
    const cgl = glow('#bfa8ff', 2.4, 0.45); cgl.position.set(0, 4.55, -0.2); g.add(cgl);
    anim.push(t => { needle.rotation.z = Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.3) * 0.12; cmp.position.y = 4.55 + Math.sin(t * 1.2) * 0.08; cmp.rotation.y = Math.sin(t * 0.5) * 0.25; });
    cast(g); lens.castShadow = false;
    return { g, anim, h:5.3, w:1.9, d:1.6, anchor:V3(0, 0, 0.9) };
  };

  /* 게임 모드 — 줄무늬 천막 + 떠다니는 숫자 주사위 */
  makers.game = () => {
    const g = new THREE.Group(); const anim = [];
    const stripe = (a, b, n) => canvasTex(512, 256, (gg, w, h) => { for(let i = 0; i < n; i++){ gg.fillStyle = i % 2 ? b : a; gg.fillRect(i * w / n, 0, w / n + 1, h); }
      for(let i = 0; i < 1500; i++){ gg.fillStyle = `rgba(0,0,0,${rnd() * 0.06})`; gg.fillRect(rnd() * w, rnd() * h, 2, 2); } });
    const cloth = new THREE.MeshStandardMaterial({ map:stripe('#e94b5b', '#fbeedd', 16), roughness:0.8, side:THREE.DoubleSide });
    const cloth2 = new THREE.MeshStandardMaterial({ map:stripe('#6a3fd0', '#fbeedd', 16), roughness:0.8 });
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.1, 1.3, 32, 1, true), cloth); wall.position.y = 0.65; g.add(wall);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.35, 32, 1, true), cloth2); roof.position.y = 1.97; g.add(roof);
    /* 천막 처마 장식(삼각 깃발) */
    const flapMat = new THREE.MeshStandardMaterial({ color:'#ffcf4a', roughness:0.6, side:THREE.DoubleSide });
    for(let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2; const f = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 3), flapMat);
      f.position.set(Math.sin(a) * 1.28, 1.2, Math.cos(a) * 1.28); f.rotation.x = Math.PI; f.rotation.y = a; g.add(f); }
    const entry = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0), new THREE.MeshBasicMaterial({ color:'#2a0f3a' }));
    entry.position.set(0, 0.5, 1.085); g.add(entry);
    const eg = glow('#ff9ad8', 1.4, 0.35); eg.position.set(0, 0.55, 1.2); g.add(eg);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 8), gold); pole.position.y = 2.95; g.add(pole);
    const flagGeo = new THREE.PlaneGeometry(0.55, 0.32, 8, 1); flagGeo.translate(0.275, 0, 0);
    const flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ color:'#ffcf4a', roughness:0.6, side:THREE.DoubleSide })); flag.position.set(0.02, 3.13, 0); g.add(flag);
    const fp = flagGeo.attributes.position, fx0 = Float32Array.from({ length:fp.count }, (_, i) => fp.getX(i));
    anim.push(t => { for(let i = 0; i < fp.count; i++){ const x = fx0[i]; fp.setZ(i, Math.sin(x * 9 - t * 5) * 0.06 * x / 0.55); } fp.needsUpdate = true; });
    /* 숫자 주사위 */
    const cubeCols = [['#ffffff', '#e2415a'], ['#fff7d6', '#2f6fe0'], ['#f6ecff', '#7a3fd6']];
    const nums = [['1', '2', '3', '4', '5', '6'], ['7', '8', '9', '+', '=', '0'], ['×', '÷', '2', '5', '7', '9']];
    [[-1.45, 2.3, 0.6, 0.55], [1.45, 1.95, 0.65, 0.5], [0.55, 3.6, 0.5, 0.42]].forEach(([x, y, z, s], i) => {
      const mats = nums[i].map(n => new THREE.MeshPhysicalMaterial({ map:faceTex(n, { bg:cubeCols[i][0], color:cubeCols[i][1], size:300 }), roughness:0.3, clearcoat:0.6 }));
      const c = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mats); c.position.set(x, y, z); c.castShadow = true; g.add(c);
      anim.push(t => { c.position.y = y + Math.sin(t * 1.4 + i * 2) * 0.13; c.rotation.x = t * 0.5 + i; c.rotation.y = t * 0.7 + i * 2; });
    });
    /* 전구 줄 */
    const bulbMat = [new THREE.MeshBasicMaterial({ color:'#ffe08a' }), new THREE.MeshBasicMaterial({ color:'#ff9ad8' }), new THREE.MeshBasicMaterial({ color:'#9ad8ff' })];
    const bulbs = [];
    for(let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), bulbMat[i % 3]); b.position.set(Math.sin(a) * 1.12, 1.36, Math.cos(a) * 1.12); g.add(b); bulbs.push(b); }
    cast(g); entry.castShadow = false;
    return { g, anim, h:3.4, w:2.8, d:2.4, anchor:V3(0, 0, 1.3) };
  };

  /* 학습지 모드 — 책상 + 학습지 + 잉크병·깃펜 + 등불 */
  makers.sheet = () => {
    const g = new THREE.Group(); const anim = [];
    const wood = woodMat('#8a5a34', [60, 34, 16]);
    const topM = new THREE.Mesh(rbox(2.1, 0.1, 1.15, 0.05), wood); topM.position.y = 0.95; g.add(topM);
    [[-0.95, -0.47], [0.95, -0.47], [-0.95, 0.47], [0.95, 0.47]].forEach(([x, z]) => { const l = new THREE.Mesh(rbox(0.09, 0.95, 0.09, 0.03), wood); l.position.set(x, 0, z); g.add(l); });
    const drawer = new THREE.Mesh(rbox(1.7, 0.2, 0.05, 0.02), wood); drawer.position.set(0, 0.72, 0.55); g.add(drawer);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), brass); knob.position.set(0, 0.82, 0.59); g.add(knob);
    const sheetTex = (lines) => canvasTex(512, 680, (gg, w, h) => { gg.fillStyle = '#fbf6ea'; gg.fillRect(0, 0, w, h);
      gg.fillStyle = '#8b5bd9'; gg.fillRect(0, 0, w, 64); gg.fillStyle = '#fff'; gg.font = `700 34px ${MAIN}`; gg.textBaseline = 'middle'; gg.fillText('★', 22, 34);
      gg.strokeStyle = 'rgba(80,110,200,.25)'; gg.lineWidth = 2; for(let y = 130; y < h - 20; y += 72){ gg.beginPath(); gg.moveTo(24, y + 26); gg.lineTo(w - 24, y + 26); gg.stroke(); }
      gg.fillStyle = '#2a2140'; lines.forEach((l, i) => mathText(gg, l, 40, 140 + i * 72, 40, { align:'left' }));
      gg.strokeStyle = 'rgba(214,49,47,.85)'; gg.lineWidth = 5; gg.beginPath(); gg.arc(w - 70, 150, 26, 0, 7); gg.stroke(); });
    const s1 = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.82), new THREE.MeshStandardMaterial({ map:sheetTex(['3 + 4 = 7', '12 − 5 = 7', '6 × 3 = 18', '20 ÷ 4 = 5', '1/2 + 1/4', '0.5 × 8']), roughness:0.9 }));
    s1.rotation.x = -Math.PI / 2; s1.rotation.z = 0.12; s1.position.set(-0.3, 1.056, 0.05); g.add(s1);
    const s0 = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.82), new THREE.MeshStandardMaterial({ map:sheetTex(['7 + 8 =', '15 − 9 =', '4 × 6 =', '36 ÷ 6 =']), roughness:0.9 }));
    s0.rotation.x = -Math.PI / 2; s0.rotation.z = -0.2; s0.position.set(-0.22, 1.053, 0.0); g.add(s0);
    /* 떠오르는 한 장(마법) */
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.77), new THREE.MeshStandardMaterial({ map:sheetTex(['9 + 6 =', '8 × 7 =', '45 ÷ 9 =', '2/3 of 12']), roughness:0.9, side:THREE.DoubleSide }));
    fl.position.set(0.35, 1.75, 0.05); fl.rotation.set(-0.5, 0.15, 0.08); g.add(fl);
    const flg = glow('#e6d4ff', 1.6, 0.35); flg.position.set(0.35, 1.75, -0.05); g.add(flg);
    anim.push(t => { fl.position.y = 1.75 + Math.sin(t * 1.1) * 0.1; fl.rotation.z = 0.08 + Math.sin(t * 0.8) * 0.08; flg.position.y = fl.position.y; });
    /* 잉크병 + 깃펜 */
    const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 16), glass('#6a5cff')); ink.position.set(0.55, 1.08, -0.25); g.add(ink);
    const inkIn = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.1, 16), new THREE.MeshStandardMaterial({ color:'#1a1440', roughness:0.2 })); inkIn.position.set(0.55, 1.06, -0.25); g.add(inkIn);
    const feather = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8), new THREE.MeshStandardMaterial({ color:'#f3ecff', roughness:0.7, side:THREE.DoubleSide }));
    feather.scale.set(0.08, 0.5, 0.012); feather.position.set(0.6, 1.4, -0.25); feather.rotation.z = -0.35; g.add(feather);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.6, 6), gold); shaft.position.set(0.58, 1.35, -0.25); shaft.rotation.z = -0.35; g.add(shaft);
    /* 등불 */
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.05, 16), brass); lampBase.position.set(0.8, 1.07, 0.3); g.add(lampBase);
    const lampGlass = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color:'#ffe2a0' })); lampGlass.position.set(0.8, 1.22, 0.3); g.add(lampGlass);
    const lgl = glow('#ffc86e', 1.5, 0.8); lgl.position.set(0.8, 1.22, 0.35); g.add(lgl);
    anim.push(t => { lgl.material.opacity = 0.7 + Math.sin(t * 6.1) * 0.05 + Math.sin(t * 9.7) * 0.04; });
    const chair = new THREE.Group();
    const seat = new THREE.Mesh(rbox(0.6, 0.07, 0.55, 0.03), wood); seat.position.y = 0.55; chair.add(seat);
    [[-0.25, -0.22], [0.25, -0.22], [-0.25, 0.22], [0.25, 0.22]].forEach(([x, z]) => { const l = new THREE.Mesh(rbox(0.06, 0.55, 0.06, 0.02), wood); l.position.set(x, 0, z); chair.add(l); });
    const back = new THREE.Mesh(rbox(0.6, 0.6, 0.06, 0.03), wood); back.position.set(0, 0.6, -0.25); chair.add(back);
    chair.position.set(-0.2, 0, -0.95); g.add(chair);
    cast(g);
    return { g, anim, h:2.2, w:2.3, d:2.4, anchor:V3(0, 0, 0.85) };
  };

  /* 연산 로드맵 — 구불구불한 길 + 이정표 + 깃발 */
  makers.road = () => {
    const g = new THREE.Group(); const anim = [];
    const curve = new THREE.CatmullRomCurve3([V3(-1.35, 0, 0.9), V3(-0.55, 0, 0.55), V3(0.15, 0, 0.9), V3(0.95, 0, 0.35), V3(0.7, 0, -0.35), V3(-0.2, 0, -0.55), V3(0.35, 0, -1.15)]);
    const N = 90, W = 0.27, pos = [], uv = [], idx = [];
    for(let i = 0; i <= N; i++){ const u = i / N, p = curve.getPointAt(u), tg = curve.getTangentAt(u); const nx = -tg.z, nz = tg.x;
      pos.push(p.x + nx * W, 0.025, p.z + nz * W, p.x - nx * W, 0.025, p.z - nz * W); uv.push(0, u * 8, 1, u * 8);
      if(i < N){ const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); rg.setIndex(idx); rg.computeVertexNormals();
    const cob = canvasTex(256, 256, (gg, w, h) => { gg.fillStyle = '#a58c68'; gg.fillRect(0, 0, w, h);
      for(let i = 0; i < 70; i++){ const x = rnd() * w, y = rnd() * h, rr = 10 + rnd() * 16, c = 175 + rnd() * 45; gg.fillStyle = `rgb(${c},${c * 0.88},${c * 0.68})`; gg.beginPath(); gg.ellipse(x, y, rr, rr * 0.8, rnd() * 3, 0, 7); gg.fill(); gg.strokeStyle = 'rgba(80,60,40,.35)'; gg.stroke(); } });
    cob.wrapS = cob.wrapT = THREE.RepeatWrapping;
    const mileStone = new THREE.MeshStandardMaterial({ map:stoneBlockTex, color:'#d8d0c8', roughness:0.85 });
    const road = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ map:cob, roughness:0.9 })); road.receiveShadow = true; g.add(road);
    /* 길가 이정표 1·2·3 */
    [[0.12, '1', '#7fd0ff'], [0.45, '2', '#ffd35a'], [0.75, '3', '#ff8fb8']].forEach(([u, n, col], i) => {
      const p = curve.getPointAt(u), tg = curve.getTangentAt(u); const side = i % 2 ? 1 : -1;
      const ms = new THREE.Group(); ms.position.set(p.x - tg.z * 0.55 * side, 0, p.z + tg.x * 0.55 * side);
      /* 네모 돌 기둥 — 윗면에 색 번호판(내려다보는 시점에서 읽힌다) */
      const st = new THREE.Mesh(rbox(0.36, 0.36, 0.36, 0.05), mileStone); ms.add(st);
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.29), new THREE.MeshStandardMaterial({ map:faceTex(n, { bg:col, color:'#2a1a50', size:330 }), roughness:0.5 }));
      plate.rotation.x = -Math.PI / 2; plate.position.set(0, 0.365, 0); ms.add(plate);
      ms.rotation.y = (rnd() - 0.5) * 0.4;
      g.add(ms);
    });
    /* 끝의 깃발 */
    const end = curve.getPointAt(1);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.35, 8), gold); pole.position.set(end.x, 0.675, end.z); g.add(pole);
    const fg = new THREE.PlaneGeometry(0.7, 0.42, 10, 1); fg.translate(0.35, 0, 0);
    const flagT = canvasTex(256, 160, (gg, w, h) => { gg.fillStyle = '#8b37e0'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#ffe08a'; gg.font = `700 110px ${MAIN}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('★', w / 2, h / 2 + 6); });
    const flag = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map:flagT, roughness:0.7, side:THREE.DoubleSide })); flag.position.set(end.x + 0.03, 1.13, end.z); g.add(flag);
    const fp = fg.attributes.position, fx0 = Float32Array.from({ length:fp.count }, (_, i) => fp.getX(i));
    anim.push(t => { for(let i = 0; i < fp.count; i++){ const x = fx0[i]; fp.setZ(i, Math.sin(x * 8 - t * 4.5) * 0.07 * x / 0.7); } fp.needsUpdate = true; });
    /* 길 위를 걷는 빛 구슬 */
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), new THREE.MeshBasicMaterial({ color:'#fff1c0' })); g.add(orb);
    const og = glow('#ffd36e', 0.8, 0.9); g.add(og);
    anim.push(t => { const u = (t * 0.09) % 1; const p = curve.getPointAt(u); orb.position.set(p.x, 0.22 + Math.abs(Math.sin(t * 5)) * 0.08, p.z); og.position.copy(orb.position); });
    cast(g); road.castShadow = false;
    return { g, anim, h:1.5, w:2.8, d:2.6, anchor:V3(0, 0, 1.25) };
  };

  /* 스토리 모드 — 표지판에 걸린 두루마리 지도 */
  makers.story = () => {
    const g = new THREE.Group(); const anim = [];
    const wood = woodMat('#7a4b2a', [50, 28, 12]);
    [-0.42, 0.42].forEach(x => { const p = new THREE.Mesh(rbox(0.08, 1.35, 0.08, 0.03), wood); p.position.x = x; g.add(p); });
    const bar = new THREE.Mesh(rbox(1.0, 0.07, 0.09, 0.03), wood); bar.position.y = 1.28; g.add(bar);
    const mapT = canvasTex(400, 320, (gg, w, h) => { gg.fillStyle = '#efdcb2'; gg.fillRect(0, 0, w, h);
      for(let i = 0; i < 1500; i++){ gg.fillStyle = `rgba(140,100,50,${rnd() * 0.1})`; gg.fillRect(rnd() * w, rnd() * h, 3, 3); }
      gg.fillStyle = 'rgba(90,150,110,.55)'; gg.beginPath(); gg.ellipse(120, 120, 90, 60, 0.3, 0, 7); gg.fill(); gg.beginPath(); gg.ellipse(290, 210, 80, 55, -0.4, 0, 7); gg.fill();
      gg.strokeStyle = '#8a3b1c'; gg.lineWidth = 5; gg.setLineDash([12, 10]); gg.beginPath(); gg.moveTo(60, 250); gg.bezierCurveTo(140, 180, 200, 280, 250, 170); gg.bezierCurveTo(280, 110, 330, 120, 340, 80); gg.stroke(); gg.setLineDash([]);
      gg.strokeStyle = '#c0281c'; gg.lineWidth = 8; gg.beginPath(); gg.moveTo(325, 65); gg.lineTo(355, 95); gg.moveTo(355, 65); gg.lineTo(325, 95); gg.stroke(); });
    const map = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.58), new THREE.MeshStandardMaterial({ map:mapT, roughness:0.9, side:THREE.DoubleSide }));
    map.position.set(0, 0.92, 0.05); g.add(map);
    [1.22, 0.62].forEach(y => { const rl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.8, 12), new THREE.MeshStandardMaterial({ color:'#e2cc9c', roughness:0.8 })); rl.rotation.z = Math.PI / 2; rl.position.set(0, y, 0.06); g.add(rl); });
    anim.push(t => { map.rotation.y = Math.sin(t * 1.3) * 0.08; });
    cast(g);
    return { g, anim, h:1.4, w:1.0, d:0.4, anchor:V3(0, 0, 0.3), small:true };
  };

  /* 기호 도감 — 책 받침대 위 펼친 책 */
  makers.dex = () => {
    const g = new THREE.Group(); const anim = [];
    const wood = woodMat('#6b3f22', [40, 20, 8]);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 12), wood); post.position.y = 0.45; g.add(post);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 20), wood); g.add(foot);
    const desk = new THREE.Group(); desk.position.y = 0.95; desk.rotation.x = 0.55; g.add(desk);
    const board = new THREE.Mesh(rbox(0.9, 0.05, 0.6, 0.03), wood); desk.add(board);
    const pageT = (syms) => canvasTex(256, 320, (gg, w, h) => { gg.fillStyle = '#fbf3de'; gg.fillRect(0, 0, w, h);
      gg.fillStyle = '#4a2a8a'; syms.forEach((s, i) => { gg.font = `700 66px ${MAIN}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(s, (i % 2 ? 0.7 : 0.3) * w, (0.25 + Math.floor(i / 2) * 0.28) * h); }); });
    const cover = new THREE.Mesh(rbox(0.84, 0.03, 0.54, 0.02), new THREE.MeshStandardMaterial({ color:'#7a2f9a', roughness:0.5 })); cover.position.y = 0.05; desk.add(cover);
    [[-0.2, ['+', '−', '×', '÷', '=', '<']], [0.2, ['π', '√', '%', '∞', '≠', 'Σ']]].forEach(([x, s], i) => {
      const pg = new THREE.PlaneGeometry(0.38, 0.5, 6, 1); const pp = pg.attributes.position; for(let j = 0; j < pp.count; j++){ const px = pp.getX(j); pp.setZ(j, Math.cos(px / 0.19 * Math.PI / 2 * (i ? 1 : -1) + (i ? -Math.PI / 2 : Math.PI / 2)) * 0.03 + 0.03); } pg.computeVertexNormals();
      const pgM = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ map:pageT(s), roughness:0.9 })); pgM.rotation.x = -Math.PI / 2; pgM.position.set(x, 0.07, 0); desk.add(pgM); });
    const bg = glow('#cbb3ff', 1.3, 0.4); bg.position.set(0, 1.25, 0.2); g.add(bg);
    anim.push(t => { bg.material.opacity = 0.32 + Math.sin(t * 2) * 0.1; });
    cast(g);
    return { g, anim, h:1.35, w:0.95, d:0.8, anchor:V3(0, 0, 0.45), small:true };
  };

  /* 수학사 퀴즈 — 대리석 기둥 + 월계관 */
  makers.hist = () => {
    const g = new THREE.Group(); const anim = [];
    const marbleT = canvasTex(256, 512, (gg, w, h) => { gg.fillStyle = '#ece6f4'; gg.fillRect(0, 0, w, h);
      for(let i = 0; i < 24; i++){ const x = (i + 0.5) * w / 24; const gr = gg.createLinearGradient(x - w / 48, 0, x + w / 48, 0); gr.addColorStop(0, 'rgba(90,70,130,.0)'); gr.addColorStop(0.5, 'rgba(90,70,130,.28)'); gr.addColorStop(1, 'rgba(90,70,130,0)'); gg.fillStyle = gr; gg.fillRect(x - w / 48, 0, w / 24, h); }
      for(let i = 0; i < 12; i++){ gg.strokeStyle = `rgba(150,130,180,${0.15 + rnd() * 0.2})`; gg.lineWidth = 1 + rnd() * 1.5; gg.beginPath(); let x = rnd() * w, y = 0; gg.moveTo(x, y); while(y < h){ x += (rnd() - 0.5) * 30; y += 20 + rnd() * 30; gg.lineTo(x, y); } gg.stroke(); } });
    const marble = new THREE.MeshStandardMaterial({ map:marbleT, roughness:0.35 });
    const plain = new THREE.MeshStandardMaterial({ color:'#e9e2f2', roughness:0.4 });
    const base = new THREE.Mesh(rbox(0.62, 0.12, 0.62, 0.03), plain); g.add(base);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 1.05, 24), marble); shaft.position.y = 0.645; g.add(shaft);
    const capM = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.12, 24), plain); capM.position.y = 1.23; g.add(capM);
    const abacus = new THREE.Mesh(rbox(0.66, 0.08, 0.66, 0.02), plain); abacus.position.y = 1.29; g.add(abacus);
    const laurel = new THREE.Group(); laurel.position.y = 1.62;
    const leaf = new THREE.MeshStandardMaterial({ color:'#e8c25e', metalness:0.7, roughness:0.3 });
    for(let i = 0; i < 18; i++){ const a = -Math.PI * 0.85 + i / 17 * Math.PI * 1.7; const l = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), leaf); l.scale.set(0.6, 1.4, 0.4);
      l.position.set(Math.sin(a) * 0.22, -Math.cos(a) * 0.22, 0); l.rotation.z = -a + (i % 2 ? 0.5 : -0.5); laurel.add(l); }
    const piT = canvasTex(128, 128, (gg, w, h) => { gg.fillStyle = '#ffd35a'; gg.font = `italic 700 100px ${MAIN}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('π', w / 2, h / 2 + 4); });
    const pi = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), new THREE.MeshBasicMaterial({ map:piT, transparent:true, side:THREE.DoubleSide })); laurel.add(pi);
    g.add(laurel);
    const lg = glow('#ffd35a', 0.9, 0.5); lg.position.y = 1.62; g.add(lg);
    anim.push(t => { laurel.rotation.y = Math.sin(t * 0.9) * 0.5; laurel.position.y = 1.62 + Math.sin(t * 1.5) * 0.04; lg.position.y = laurel.position.y; });
    cast(g); pi.castShadow = false;
    return { g, anim, h:1.9, w:0.7, d:0.7, anchor:V3(0, 0, 0.4), small:true };
  };

  /* 매거진 — 잡지 가판대 */
  makers.magazine = () => {
    const g = new THREE.Group(); const anim = [];
    const wood = woodMat('#9a6ad0', [60, 30, 110]);
    const bodyM = new THREE.Mesh(rbox(0.95, 0.6, 0.45, 0.04), wood); g.add(bodyM);
    const rack = new THREE.Group(); rack.position.set(0, 0.6, 0); rack.rotation.x = -0.35; g.add(rack);
    const back = new THREE.Mesh(rbox(0.95, 0.75, 0.05, 0.02), wood); back.position.z = -0.16; rack.add(back);
    const cov = (bg, fg2, n) => canvasTex(200, 260, (gg, w, h) => { gg.fillStyle = bg; gg.fillRect(0, 0, w, h);
      gg.fillStyle = fg2; gg.fillRect(0, 0, w, 58); gg.fillStyle = bg; gg.font = `700 38px ${MAIN}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('MAGIC', w / 2, 30);
      gg.fillStyle = fg2; gg.font = `700 110px ${MAIN}`; gg.fillText(n, w / 2, 160); gg.fillRect(20, 228, w - 40, 8); });
    [['#ffe08a', '#6a3fd0', '7', -0.3], ['#9ad8ff', '#1f3f99', 'π', 0], ['#ff9ab8', '#7a1f4a', '∞', 0.3]].forEach(([b, f, n, x], i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.36, 0.02), [plainMat(b), plainMat(b), plainMat(b), plainMat(b), new THREE.MeshStandardMaterial({ map:cov(b, f, n), roughness:0.45 }), plainMat(b)]);
      m.position.set(x, 0.3 + (i === 1 ? 0.05 : 0), -0.11); rack.add(m); });
    function plainMat(c){ return new THREE.MeshStandardMaterial({ color:c, roughness:0.6 }); }
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshStandardMaterial({ map:canvasTex(320, 80, (gg, w, h) => { gg.fillStyle = '#ffd35a'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#4a2a8a'; gg.font = `700 48px ${MAIN}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('NEWS ★', w / 2, h / 2 + 2); }), roughness:0.6 }));
    sign.position.set(0, 0.32, 0.229); g.add(sign);
    cast(g);
    return { g, anim, h:1.3, w:1.0, d:0.6, anchor:V3(0, 0, 0.4), small:true };
  };

  /* 모르는 id — 작은 표지판 */
  const generic = () => {
    const g = new THREE.Group();
    const wood = woodMat('#7a4b2a', [50, 28, 12]);
    const p = new THREE.Mesh(rbox(0.1, 1.2, 0.1, 0.03), wood); g.add(p);
    const b = new THREE.Mesh(rbox(0.8, 0.35, 0.07, 0.04), wood); b.position.set(0, 0.85, 0.06); g.add(b);
    cast(g);
    return { g, anim:[], h:1.3, w:0.8, d:0.3, anchor:V3(0, 0, 0.3), small:true };
  };

  /* ---- 만들고 등록 ---- */
  const objs = {};
  const allAnim = [];
  choices.forEach(c => {
    const kind = c.primary ? 'continue' : c.id;
    const o = (makers[kind] || generic)();
    const holder = new THREE.Group(); holder.add(o.g); scene.add(holder);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(o.w, o.h, o.d), new THREE.MeshBasicMaterial({ visible:false }));
    hit.position.y = o.h / 2; hit.userData.choiceId = c.id; holder.add(hit);
    const rm = ringMat();
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.82, 1.0, 48), rm); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.035;
    const rs = Math.max(o.w, o.d) * 0.62; ring.scale.set(rs, rs, 1); holder.add(ring);
    const sh = blob(o.w * 1.25, o.d * 1.25); holder.add(sh);
    o.anim.forEach(f => allAnim.push(f));
    objs[c.id] = { id:c.id, primary:!!c.primary, kind, holder, inner:o.g, hit, ring, rm, def:o, hotT:0, hotV:0, anchorW:new THREE.Vector3(), box:[], place:o.place || 'below' };
  });

  /* ---- 캐릭터(판 한 장, 늘 카메라를 본다) ---- */
  let player = null;
  if(playerCanvas){
    const tex = new THREE.CanvasTexture(playerCanvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const ar = playerCanvas.width / playerCanvas.height;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, alphaTest:0.02 }));
    sp.center.set(0.5, 0.02);
    const pg = new THREE.Group(); pg.add(sp);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.12, 40), new THREE.MeshStandardMaterial({ color:'#6d5aa8', roughness:0.5, metalness:0.2 }));
    pad.position.y = 0.06; pad.receiveShadow = true; pad.castShadow = true; pg.add(pad);
    const padRing = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.025, 8, 48), gold); padRing.rotation.x = Math.PI / 2; padRing.position.y = 0.12; pg.add(padRing);
    const sgl = glow('#cdb6ff', 2.2, 0.35); sgl.position.y = 1.0; pg.add(sgl);
    const shB = blob(1.6, 1.0); pg.add(shB);
    scene.add(pg);
    player = { g:pg, sp, ar, tagW:new THREE.Vector3(), h:2.2 };
  }

  /* ---- 떠다니는 빛가루(한 번의 드로우 콜) ---- */
  const NP = 160;
  const ppos = new Float32Array(NP * 3), pph = new Float32Array(NP), pcol = new Float32Array(NP * 3);
  const pal = [new THREE.Color('#ffe39a'), new THREE.Color('#d9c2ff'), new THREE.Color('#9fe2ff')];
  for(let i = 0; i < NP; i++){ ppos.set([(rnd() - 0.5) * 2, rnd(), (rnd() - 0.5) * 2], i * 3); pph[i] = rnd() * 100; const c = pal[i % 3]; pcol.set([c.r, c.g, c.b], i * 3); }
  const pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3)); pgeo.setAttribute('ph', new THREE.BufferAttribute(pph, 1)); pgeo.setAttribute('col', new THREE.BufferAttribute(pcol, 3));
  const pmat = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, fog:false,
    uniforms:{ t:{ value:0 }, box:{ value:new THREE.Vector3(10, 5, 8) }, ctr:{ value:new THREE.Vector3() }, px:{ value:300 } },
    vertexShader:`attribute float ph; attribute vec3 col; uniform float t; uniform vec3 box; uniform vec3 ctr; uniform float px; varying vec3 vC; varying float vA;
      void main(){ vec3 p = position; float y = fract(p.y + t * (.025 + fract(ph) * .03)); vec3 w = ctr + vec3(p.x * box.x + sin(t * .4 + ph) * .5, .15 + y * box.y, p.z * box.z + cos(t * .33 + ph) * .5);
        vA = sin(y * 3.14159) * (.55 + .45 * sin(t * 2.3 + ph * 7.)); vC = col; vec4 mv = modelViewMatrix * vec4(w, 1.); gl_PointSize = px * (.06 + fract(ph * 3.7) * .06) / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader:'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); a *= a; gl_FragColor = vec4(vC * a * vA, a * vA); }' });
  const motes = new THREE.Points(pgeo, pmat); motes.frustumCulled = false; scene.add(motes);

  /* ---- 나무(가장자리) ---- */
  const trees = [];
  const pineMat = new THREE.MeshStandardMaterial({ color:'#274d44', roughness:0.9, flatShading:true });
  const pineMat2 = new THREE.MeshStandardMaterial({ color:'#2f5c4c', roughness:0.9, flatShading:true });
  const trunkMat = new THREE.MeshStandardMaterial({ color:'#4a3024', roughness:1 });
  for(let i = 0; i < 16; i++){
    const t = new THREE.Group(); const s = 0.7 + rnd() * 0.6;
    const tr0 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.5, 6), trunkMat); tr0.position.y = 0.25; t.add(tr0);
    [[0.62, 0.95, 0.75], [0.48, 0.8, 1.25], [0.32, 0.65, 1.7]].forEach(([rr, hh, y], j) => { const c = new THREE.Mesh(new THREE.ConeGeometry(rr, hh, 7), j % 2 ? pineMat2 : pineMat); c.position.y = y; t.add(c); });
    t.scale.setScalar(s); cast(t); scene.add(t); trees.push({ t, a:rnd(), s });
  }

  /* 풀포기·빛나는 꽃 — 인스턴스 두 벌(드로우 콜 2) */
  const NG = 260, NF = 90;
  const tuftGeo = new THREE.ConeGeometry(0.05, 0.28, 4); tuftGeo.translate(0, 0.14, 0);
  const tufts = new THREE.InstancedMesh(tuftGeo, new THREE.MeshStandardMaterial({ color:'#4f8a5c', roughness:0.9 }), NG); tufts.receiveShadow = true; scene.add(tufts);
  const flowerGeo = new THREE.IcosahedronGeometry(0.05, 0); flowerGeo.translate(0, 0.12, 0);
  const flowers = new THREE.InstancedMesh(flowerGeo, new THREE.MeshBasicMaterial({ color:'#ffffff' }), NF); scene.add(flowers);
  const fcols = [new THREE.Color('#7fd8ff'), new THREE.Color('#ff7ecb'), new THREE.Color('#ffd35a'), new THREE.Color('#b48cff')];
  for(let i = 0; i < NF; i++) flowers.setColorAt(i, fcols[i % 4]);
  const scatterSeeds = Array.from({ length:NG + NF }, () => [rnd(), rnd(), rnd(), rnd()]);
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _t = new THREE.Vector3();
  function scatter(ix, iz, icx, icz, avoid){
    let gi = 0, fi = 0;
    for(let n = 0; n < scatterSeeds.length && (gi < NG || fi < NF); n++){
      const [a, b, c, d] = scatterSeeds[n];
      const ang = a * Math.PI * 2, rr = Math.sqrt(0.08 + b * 0.9) * 0.94;
      const x = icx + Math.cos(ang) * rr * ix, z = icz + Math.sin(ang) * rr * iz;
      if(avoid(x, z)) continue;
      _q.setFromAxisAngle(_t.set(0, 1, 0), c * 6.28);
      if(n % 4 === 3 && fi < NF){ _s.setScalar(0.7 + d * 0.8); _m.compose(_t.set(x, 0, z), _q, _s); flowers.setMatrixAt(fi++, _m); }
      else if(gi < NG){ _s.set(1, 0.6 + d, 1); _m.compose(_t.set(x, 0, z), _q, _s); tufts.setMatrixAt(gi++, _m); }
    }
    tufts.count = gi; flowers.count = fi;
    tufts.instanceMatrix.needsUpdate = true; flowers.instanceMatrix.needsUpdate = true;
  }

  /* 섬 가장자리의 등불 기둥 두 개 — 문으로 이어지는 길을 밝힌다 */
  const posts = [];
  for(let i = 0; i < 4; i++){
    const pg = new THREE.Group();
    const pst = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.1, 8), metal('#3a2e52', 0.5)); pst.position.y = 0.55; pg.add(pst);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color:'#ffe6a6' })); lamp.position.y = 1.15; pg.add(lamp);
    const lgw = glow('#ffcf7a', 1.0, 0.75); lgw.position.y = 1.15; pg.add(lgw);
    cast(pg); scene.add(pg); posts.push(pg);
  }

  /* ============ 구도 ============
     landscape: 문이 가운데 뒤, 모드 넷이 좌우로 두 줄, 소품 넷이 앞줄.
     portrait : 위에서 아래로 — 문(+캐릭터) / 모드 2칸 × 2줄 / 소품 4칸. 카메라를 더 내려다보게 해서
                깊이(z)가 화면의 세로가 되게 한다. */
  const layouts = {
    landscape:{ pitch:30, fov:34, dist:22, target:[0, 1, 0.5], island:[10.6, 8.0, 0, 0.6],
      pos:{ continue:[0, -2.6, 1], diag:[-6.9, -3.1, 0.95], game:[6.8, -2.9, 0.95], sheet:[-5.7, 3.3, 0.95], road:[5.8, 3.0, 0.95],
        story:[-3.0, 5.1, 0.95], dex:[-1.0, 5.3, 0.95], hist:[1.0, 5.3, 0.95], magazine:[3.0, 5.1, 0.95] },
      player:[-2.55, -1.4, 1], plaza:[0, -0.8, 3.6, 2.8], posts:[[-1.3, 1.0], [1.3, 1.0], [-1.9, 3.3], [1.9, 3.3]], motes:[9.5, 4.5, 6.5, 0, 0.6], place:{} },
    wide:{ pitch:34, fov:30, dist:26, target:[0, 1, 0.5], island:[13.2, 6.2, 0, 0.8],
      pos:{ continue:[0, -2.0, 1], diag:[-10.2, 0.2, 0.9], sheet:[-6.2, 0.9, 0.9], road:[6.2, 0.9, 0.9], game:[10.2, 0.2, 0.9],
        story:[-4.2, 4.3, 0.85], dex:[-1.4, 4.5, 0.85], hist:[1.4, 4.5, 0.85], magazine:[4.2, 4.3, 0.85] },
      player:[-2.6, -1.0, 1], plaza:[0, -0.6, 3.6, 2.6], posts:[[-1.3, 1.2], [1.3, 1.2], [-8.2, 3.0], [8.2, 3.0]], motes:[11, 4, 5.5, 0, 0.5], place:{} },
    portrait:{ pitch:46, fov:40, dist:24, target:[0, 0.5, 0.8], island:[5.4, 11.8, 0, 0.6],
      pos:{ continue:[-0.55, -8.0, 1.12], diag:[-2.3, -2.0, 0.72], game:[2.35, -2.0, 0.72], sheet:[-2.3, 3.0, 0.72], road:[2.35, 3.0, 0.72],
        story:[-3.15, 7.8, 0.66], dex:[-1.05, 7.8, 0.66], hist:[1.05, 7.8, 0.66], magazine:[3.15, 7.8, 0.66] },
      player:[-0.55, -6.15, 0.95], plaza:[-0.4, -6.2, 3.0, 2.3], posts:[[-0.9, -4.6], [2.1, -4.6], [-4.3, 0.6], [4.3, 0.6]], motes:[4.8, 4, 10, 0, 0.8], place:{ continue:'top' } },
  };
  let extra = 0;
  function applyLayout(name){
    const L = layouts[name];
    const [ix, iz, icx, icz] = L.island;
    island.scale.set(ix, 1.8 + ix * 0.25, iz); island.position.set(icx, 0, icz);
    top.scale.set(1, 1, 1); under.scale.set(1, 1, 1);
    plaza.position.set(L.plaza[0], 0.012, L.plaza[1]); plaza.scale.set(L.plaza[2], L.plaza[3], 1);
    extra = 0;
    Object.values(objs).forEach(o => {
      const key = o.primary ? 'continue' : o.id;
      let p = L.pos[key];
      if(!p){ const n = extra++; p = name === 'portrait' ? [-3 + (n % 4) * 2, 8.2 + Math.floor(n / 4) * 2, 0.6] : [-5 + n * 2.2, 6.6, 0.9]; }
      o.holder.position.set(p[0], 0, p[1]); o.holder.scale.setScalar(p[2]);
      o.baseScale = p[2];
      o.holder.updateMatrixWorld(true);
      o.place = (L.place && L.place[key]) || o.def.place || 'below';
      const anc = o.place === 'left' ? V3(-o.def.w * 0.42, o.def.h * 0.3, 0) : o.place === 'right' ? V3(o.def.w * 0.42, o.def.h * 0.3, 0)
        : o.place === 'below' && o.def.anchorBelow ? o.def.anchorBelow : o.place === 'top' && o.def.anchorTop ? o.def.anchorTop : o.def.anchor;
      o.anchorW.copy(anc).multiplyScalar(p[2]).add(o.holder.position);
      const hw = o.def.w / 2 * p[2], hh = o.def.h * p[2], hd = o.def.d / 2 * p[2], c = o.holder.position;
      o.box = [V3(c.x - hw, 0, c.z + hd), V3(c.x + hw, 0, c.z + hd), V3(c.x - hw, hh, c.z - hd), V3(c.x + hw, hh, c.z - hd), V3(c.x - hw, hh, c.z + hd), V3(c.x + hw, hh, c.z + hd)];
    });
    if(player){
      const s = L.player[2];
      player.g.position.set(L.player[0], 0, L.player[1]); player.g.scale.setScalar(s);
      const hgt = 2.6; player.sp.scale.set(hgt * player.ar, hgt, 1);
      player.tagW.set(L.player[0], (hgt + 0.25) * s, L.player[1]);
    }
    /* 문의 금빛 조명은 문 앞에 */
    const cObj = Object.values(objs).find(o => o.primary);
    if(cObj){ warm.position.copy(cObj.holder.position).add(V3(0, 2.2 * cObj.baseScale, 1.8 * cObj.baseScale)); }
    moon.target.position.set(0, 0, L.target[2]);
    /* 나무 — 섬 테두리를 따라, 물건 앞(카메라 쪽)은 비운다 */
    trees.forEach((tt, i) => {
      const a = Math.PI * (1.08 + (i / (trees.length - 1)) * 0.84) + (tt.a - 0.5) * 0.08;  /* 뒤쪽 반원 */
      const rr = 0.9 + tt.a * 0.06;
      const side = i % 2;
      let x, z;
      if(i < 11){ x = icx + Math.cos(a) * ix * rr; z = icz + Math.sin(a) * iz * rr; }
      else { const a2 = side ? -0.25 - (i - 11) * 0.1 : Math.PI + 0.25 + (i - 11) * 0.1; x = icx + Math.cos(a2) * ix * 0.9; z = icz + Math.sin(a2) * iz * 0.9; }
      tt.t.position.set(x, 0, z); tt.t.scale.setScalar(tt.s * (name === 'portrait' ? 0.8 : 1.1));
    });
    posts.forEach((pp, i) => { const q = L.posts[i]; pp.position.set(q[0], 0, q[1]); pp.scale.setScalar(name === 'portrait' ? 0.8 : 1); });
    const foot = Object.values(objs).map(o => [o.holder.position.x, o.holder.position.z, Math.max(o.def.w, o.def.d) * 0.62 * o.baseScale + 0.3]);
    if(player) foot.push([player.g.position.x, player.g.position.z, 0.9]);
    scatter(ix, iz, icx, icz, (x, z) => {
      const pdx = (x - L.plaza[0]) / (L.plaza[2] + 0.3), pdz = (z - L.plaza[1]) / (L.plaza[3] + 0.3); if(pdx * pdx + pdz * pdz < 1) return true;
      return foot.some(([fx, fz, fr]) => (x - fx) * (x - fx) + (z - fz) * (z - fz) < fr * fr); });
    pmat.uniforms.box.value.set(L.motes[0], L.motes[1], L.motes[2]); pmat.uniforms.ctr.value.set(L.motes[3], 0, L.motes[4]);
  }

  /* ---- 움직임 ---- */
  const lerp = (a, b, f) => a + (b - a) * f;
  function animate(t, dt, reduce){
    let moving = false;
    if(!reduce){ allAnim.forEach(f => f(t, dt)); starMat.uniforms.t.value = t; pmat.uniforms.t.value = t; skyU.t.value = t;
      clouds.forEach((c, i) => { if(c.base) c.sp.position.x = c.base.x + Math.sin(t * 0.05 + i) * 1.5; }); }
    starMat.uniforms.pr.value = k.r.getPixelRatio();
    pmat.uniforms.px.value = k.r.domElement.height * 0.9;
    Object.values(objs).forEach(o => {
      const target = o.hotT;
      const f = reduce ? 1 : Math.min(1, dt * 9);
      const nv = lerp(o.hotV, target, f);
      if(Math.abs(nv - o.hotV) > 1e-4) moving = true;
      o.hotV = nv;
      const s = o.baseScale || 1;
      const bob = !reduce && o.primary ? Math.sin(t * 1.6) * 0.02 : 0;
      o.inner.position.y = (o.hotV * 0.28 + bob) ;
      o.inner.scale.setScalar(1 + o.hotV * 0.05);
      const pulse = o.primary && !reduce ? 0.22 + Math.sin(t * 2) * 0.1 : o.primary ? 0.22 : 0;
      o.rm.opacity = Math.max(pulse, o.hotV * 0.95);
      o.ring.rotation.z = t * 0.3;
      void s;
    });
    if(player && !reduce){ player.sp.position.y = 0.12 + Math.abs(Math.sin(t * 2.2)) * 0.05; }
    else if(player) player.sp.position.y = 0.12;
    return moving;
  }

  /* 달은 화면 위 구석, 구름은 섬 아래·뒤로 — 카메라가 정해진 다음에 */
  const _p = new THREE.Vector3();
  function placeSky(portrait){
    const at = (nx, ny, dist) => { _p.set(nx, ny, 0.5).unproject(cam).sub(cam.position).normalize(); return cam.position.clone().addScaledVector(_p, dist); };
    moonGrp.position.copy(at(portrait ? 0.86 : -0.84, portrait ? 0.9 : 0.8, 60));
    const sc = portrait ? 0.75 : 1; moonGrp.scale.setScalar(sc);
    clouds.forEach((c, i) => {
      const nx = -1.05 + (i / (clouds.length - 1)) * 2.1 + (c.a - 0.5) * 0.2;
      const ny = portrait ? -0.92 + c.b * 0.18 : -0.85 + c.b * 0.25;
      c.sp.position.copy(at(nx, ny, 34 + c.b * 8)); const w = (portrait ? 12 : 18) * c.s; c.sp.scale.set(w, w / 2, 1);
      c.base = c.sp.position.clone();
    });
  }
  return { objs, player, animate, applyLayout, layouts, placeSky, skyU };
}
