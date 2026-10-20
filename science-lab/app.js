// 지필드 과학 탐구 랩 — 라우터·화면. 데이터는 data/curriculum.js, 3D는 engine.js + scenes/*.js
import { UNITS, unitById, DOMAINS, ORDERED, domainOf } from './data/curriculum.js';
import { Stage, Player } from './engine.js';

const $app = document.getElementById('app');
const STORE_KEY = 'sciLab.v1';
const store = {
  read() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (_) { return {}; } },
  write(d) { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (_) { /* private mode */ } },
  unit(id) { return this.read()[id] || {}; },
  patch(id, p) { const d = this.read(); d[id] = { ...(d[id] || {}), ...p, updatedAt: Date.now() }; this.write(d); },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = ['A', 'B', 'C', 'D'];

let stage = null, player = null; // 현재 유닛의 3D

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const m = h.match(/^u\/([\w-]+)/);
  teardown3D(); homeOff?.(); homeOff = null;
  if (m && unitById(m[1])) renderUnit(unitById(m[1])); else renderHome();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function teardown3D() { if (player) { player.stop(); if (player._offKey) player._offKey(); } if (stage) stage.dispose(); stage = null; player = null; }

function topbar(backHref) {
  const done = UNITS.filter((u) => store.unit(u.id).quizBest >= 2).length;
  return `<header class="topbar"><div class="wrap">
    <a class="brand" href="#/"><span class="mark">⚗</span>GFIELD<small>/SCIENCE-INQUIRY-LAB</small></a>
    <span class="spacer"></span>
    ${backHref ? `<a class="back" href="${backHref}">← 실험실</a>` : ''}
    <span class="progress-pill">확인 ${done}/${UNITS.length}</span>
  </div></header>`;
}
function footer() {
  return `<footer><div class="wrap">
    <p>교과 순서와 활동은 『2009 초등학교 과학탐구토론 지도자료』(서울특별시과학전시관)의 차례를 따르며, 개념 설명은 그 내용을 바탕으로 다시 썼습니다.</p>
    <p>3D 장면은 원본 도형으로만 그렸고 외부 저작물을 포함하지 않습니다. 음성은 기기의 읽어 주기 기능(Web Speech)을 씁니다.</p>
  </div></footer>`;
}

// 홈 = 과학 탐구 실험실(2026-10-20 원장: hugh-kim.space 「THE ARCHIVE」 느낌 → 「좀 실험실 느낌으로」).
// 어두운 실험실(유리 진열장·실험대·띠 조명)에 실험 15건이 문서 카드로 줄지어 있다. 맨 앞 카드를 열면 그 실험(#/u/<id>)으로 간다.
// 넘기기: 휠·← →·↑ ↓·끌기(밀기)·뒤 카드 누르기. 거르기: 바닥의 PART 알약·검색. 진도(sciLab.v1)는 카드의 도장으로 보인다.
// 배경은 실사 실험실 사진(원장 맥에서 생성)이 있으면 그것, 없으면 아래 SVG 실험실.
// 실사 실험실 사진을 들여오면(scripts/import-book-photos.py lab-room=N) 아래를 그 경로로 바꾼다: './assets/book/science-lab-v1-photo-lab-room.webp'
const CORRIDOR = null;
let homeOff = null;
function corridorSvg() {
  // 실험실 원근: 소실점 (VX, VY). 왼쪽 = 유리 진열장(유리 기구), 오른쪽 = 실험대(검은 상판·시약병·수도꼭지), 천장 = 띠 조명.
  const W = 1600, H = 900, VX = 1000, VY = 330, BL = 880, BR = 1120, BT = 250, BB = 420;
  const at = (x0, y0, t) => [x0 + (VX - x0) * t, y0 + (VY - y0) * t];          // 화면 끝점에서 소실점 쪽으로 t만큼
  const depth = (k) => 1 - 0.8 ** k;
  // 천장 띠 조명: 깊이마다 가로 막대
  const lights = Array.from({ length: 9 }, (_, k) => { const t = depth(k + 0.6), [x1, y] = at(640, 0, t), [x2] = at(1420, 0, t), hgt = 10 * (1 - t) + 1.5; return `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${hgt}" rx="${hgt / 2}"/>`; }).join('');
  // 왼쪽 진열장: 칸 기둥 + 선반 + 유리 기구
  const cabTop = 150, cabBot = 760, bays = 9;
  const posts = Array.from({ length: bays + 1 }, (_, k) => { const t = depth(k), [x, y1] = at(0, cabTop, t), [, y2] = at(0, cabBot, t); return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>`; }).join('');
  const shelvesY = [150, 300, 450, 600, 760];
  const shelves = shelvesY.map((y) => { const [x2, y2] = at(0, y, depth(bays)); return `<line x1="0" y1="${y}" x2="${x2}" y2="${y2}"/>`; }).join('');
  const ware = [];
  for (let k = 0; k < bays; k++) for (let j = 0; j < 4; j++) for (let n = 0; n < 3; n++) {
    const t = depth(k + 0.18 + n * 0.28), [x, yb] = at(0, shelvesY[j + 1], t), sc = (1 - t) * 1.35 + 0.05, kind = (k * 7 + j * 3 + n) % 4;
    const g = kind === 0 ? `<path d="M-9 0 h18 v-30 h2 v-3 h-22 v3 h2 z"/>` : kind === 1 ? `<path d="M-14 0 h28 l-9 -22 v-14 h3 v-3 h-16 v3 h3 v14 z"/>` : kind === 2 ? `<circle cx="0" cy="-13" r="13"/><path d="M-3 -24 v-16 h6 v16 z"/>` : `<path d="M-5 0 h10 v-44 h-10 z"/>`;
    ware.push(`<g transform="translate(${x + 26 * (1 - t)} ${yb - 3 * (1 - t)}) scale(${sc})">${g}</g>`);
  }
  // 오른쪽 실험대: 상판 띠 + 몸통, 위에 시약병·수도꼭지
  const [bx1, by1] = at(W, 610, 0.985), [bx2, by2] = at(W, 660, 0.985);
  const bottles = Array.from({ length: 11 }, (_, k) => { const t = depth(k + 0.5), [x, y] = at(W, 610, t), sc = (1 - t) * 1.5 + 0.05;
    return k % 3 === 2 ? `<g transform="translate(${x - 30 * (1 - t)} ${y}) scale(${sc})"><path d="M-3 0 v-60 q0 -10 14 -10 v6 q-8 0 -8 6 v58 z"/></g>` : `<g transform="translate(${x - 40 * (1 - t)} ${y}) scale(${sc})"><path d="M-12 0 h24 v-30 q0 -6 -6 -8 v-8 h-12 v8 q-6 2 -6 8 z"/></g>`; }).join('');
  return `<svg class="arch-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><filter id="glow"><feGaussianBlur stdDeviation="5"/></filter><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .6 0 0 0 0 .62 0 0 0 .45 0"/></filter>
      <linearGradient id="lw" x1="0" x2="1"><stop offset="0" stop-color="#0c1213"/><stop offset=".7" stop-color="#162123"/><stop offset="1" stop-color="#0d1314"/></linearGradient>
      <linearGradient id="rw" x1="1" x2="0"><stop offset="0" stop-color="#0b1011"/><stop offset="1" stop-color="#141c1d"/></linearGradient>
      <linearGradient id="fl" y1="0" y2="1"><stop offset="0" stop-color="#0d1314"/><stop offset="1" stop-color="#1d292b"/></linearGradient>
      <radialGradient id="back" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#bfe8ea" stop-opacity=".55"/><stop offset="1" stop-color="#1a2a2c" stop-opacity="0"/></radialGradient>
      <radialGradient id="vig" cx=".55" cy=".45" r=".85"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#081011"/>
    <polygon points="0,0 ${W},0 ${BR},${BT} ${BL},${BT}" fill="#0b1213"/>
    <polygon points="0,0 ${BL},${BT} ${BL},${BB} 0,${H}" fill="url(#lw)"/>
    <polygon points="${W},0 ${BR},${BT} ${BR},${BB} ${W},${H}" fill="url(#rw)"/>
    <polygon points="0,${H} ${BL},${BB} ${BR},${BB} ${W},${H}" fill="url(#fl)"/>
    <rect x="${BL}" y="${BT}" width="${BR - BL}" height="${BB - BT}" fill="#152224"/><rect x="${BL}" y="${BT}" width="${BR - BL}" height="${BB - BT}" fill="url(#back)"/>
    <polygon points="0,${cabTop} ${at(0, cabTop, depth(bays)).join(',')} ${at(0, cabBot, depth(bays)).join(',')} 0,${cabBot}" fill="#0f1b1d" opacity=".9"/>
    <g fill="#9fd8d6" fill-opacity=".16" stroke="#bfeeee" stroke-opacity=".5" stroke-width="1.6">${ware.join('')}</g>
    <g stroke="#3f5a5c" stroke-width="3">${posts}</g><g stroke="#4b6a6c" stroke-opacity=".8" stroke-width="2">${shelves}</g>
    <polygon points="0,${cabTop} ${at(0, cabTop, depth(bays)).join(',')} ${at(0, cabBot, depth(bays)).join(',')} 0,${cabBot}" fill="#bfeeee" opacity=".035"/>
    <polygon points="${W},610 ${bx1},${by1} ${bx2},${by2} ${W},660" fill="#1d2729"/>
    <polygon points="${W},660 ${bx2},${by2} ${bx2},${BB} ${W},${H}" fill="#0b1112"/>
    <line x1="${W}" y1="610" x2="${bx1}" y2="${by1}" stroke="#9fd8d6" stroke-opacity=".35" stroke-width="2"/>
    <g fill="#8fd0cc" fill-opacity=".14" stroke="#c9f2f0" stroke-opacity=".45" stroke-width="1.6">${bottles}</g>
    <g fill="#eaf8ff">${lights}</g><g fill="#d8f4ff" opacity=".45" filter="url(#glow)">${lights}</g>
    <g stroke="#cfeff2" stroke-width="2" opacity=".14" filter="url(#glow)"><line x1="520" y1="${H}" x2="${VX - 40}" y2="${BB}"/><line x1="1150" y1="${H}" x2="${VX + 40}" y2="${BB}"/></g>
    <rect width="${W}" height="${H}" filter="url(#grain)" opacity=".12"/>
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
  </svg>`;
}
function stampsHtml(s) {
  const quiz = s.quizBest != null ? `확인 ${s.quizBest}/3` : '확인 전';
  return `<span class="stamps"><span class="stamp ${s.videoDone ? 'on' : ''}">${s.videoDone ? '3D 실험 봄' : '3D 실험 전'}</span><span class="stamp ${s.quizBest >= 2 ? 'gold' : s.quizBest != null ? 'on' : ''}">${quiz}</span></span>`;
}
function renderHome() {
  const done = UNITS.filter((u) => store.unit(u.id).quizBest >= 2).length;
  const last = UNITS.map((u) => [u, store.unit(u.id).updatedAt || 0]).filter(([, t]) => t).sort((a, b) => b[1] - a[1])[0]?.[0];
  $app.innerHTML = `<header class="arch-top"><a class="arch-brand" href="#/"><b>GFIELD</b><span>/SCIENCE-INQUIRY-LAB</span></a>
      <label class="arch-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="실험 찾기… (Ctrl+/)" aria-label="실험 찾기" autocomplete="off"></label>
      <span class="arch-progress">확인 ${done}/${UNITS.length}</span></header>
  <main class="archive">
    <div class="arch-track"><section class="arch-stage" aria-label="과학 탐구 실험실 — 실험 카드">
      <div class="arch-bg">${corridorSvg()}<img class="arch-photo" alt="" hidden></div>
      <div class="arch-wall" aria-hidden="true"><small>GFIELD · SCIENCE INQUIRY LAB</small><b>THE INQUIRY LAB</b><span>과학 탐구 실험실</span></div>
      <div class="arch-stack" tabindex="0" aria-roledescription="카드 넘기기" aria-label="실험 카드 묶음. 왼쪽·오른쪽 화살표로 넘기고 Enter로 열어요."></div>
      <nav class="arch-pills" aria-label="영역 거르기">${DOMAINS.map((d) => { const n = ORDERED.filter((u) => domainOf(u) === d).length; return `<button type="button" data-dom="${d.id}" style="--tab:${d.color}"${n ? '' : ' disabled title="준비 중"'}>${esc(d.title)} <b>${n || '준비 중'}</b></button>`; }).join('')}<button type="button" data-dom="" class="all on">ALL <b>${UNITS.length}</b></button></nav>
      <div class="arch-ctrl"><button type="button" data-step="-1" aria-label="앞 카드">‹</button><span class="arch-count" aria-live="polite"></span><button type="button" data-step="1" aria-label="뒤 카드">›</button><small>스크롤 · 클릭 · ← →로 넘겨요</small></div>
      ${last ? `<a class="arch-resume" href="#/u/${last.id}">이어서 보기 <b>${esc(last.title)}</b></a>` : ''}
    </section></div>
    <section class="wrap arch-index" aria-label="전체 실험 목록">
      <h2>실험 목록 <small>실험 ${UNITS.length}건 · 출처 『2009 초등학교 과학탐구토론 지도자료』(서울특별시과학전시관)</small></h2>
      ${DOMAINS.map((d) => { const us = ORDERED.filter((u) => domainOf(u) === d); return `<div class="arch-shelf" style="--tab:${d.color}"><h3><span>${d.en}</span>${esc(d.title)} <small>실험 ${us.length}건</small></h3>${us.length ? `<ol>${us.map((u) => `<li><a href="#/u/${u.id}"><span class="no">${u.part}-${u.no}</span><b>${esc(u.title)}</b><span class="exp">${esc(u.activity.title)}</span>${stampsHtml(store.unit(u.id))}</a></li>`).join('')}</ol>` : '<p class="arch-empty">준비 중 — 지구와 우주 영역의 탐구 실험을 채울 자리예요.</p>'}</div>`; }).join('')}
    </section>
  </main>${footer()}`;

  const $stack = $app.querySelector('.arch-stack'), $count = $app.querySelector('.arch-count'), $q = $app.querySelector('.arch-search input');
  let list = ORDERED.slice(), cur = 0, dom = '', query = '';
  const cardHtml = (u) => { const d = domainOf(u), s = store.unit(u.id);
    return `<article class="arch-card" data-id="${u.id}" style="--tab:${d.color}">
      <div class="ac-meta"><span><i></i>${esc(d.title)} · ${d.en}</span><span class="ac-src">EXP-${String(ORDERED.indexOf(u) + 1).padStart(2, '0')} · 지도자료 ${u.part}-${u.no}</span></div>
      <h3>${esc(u.title)}</h3><p class="ac-sub">${esc(u.sub)}</p><p class="ac-lead">${esc(u.concept.lead)}</p>
      <div class="ac-foot"><span class="ac-exp"><b>실험</b>${esc(u.activity.title)}</span>${stampsHtml(s)}<a class="ac-open" href="#/u/${u.id}">실험 열기 →</a></div>
    </article>`; };
  // 카드 위치 = 스크롤(원장: "클릭으로도 움직이고 스크롤로도 움직이는 거야").
  // 실험실 화면은 위에 붙어 있고(sticky), 그 아래 트랙 높이만큼 스크롤하면 카드가 한 장씩 앞으로 온다. 마지막 카드 뒤에는 실험 목록이 이어진다.
  // 클릭: 뒤 카드 → 그 카드로, 맨 앞 카드 → 다음 카드로(마지막이면 실험 목록으로). 실험은 「실험 열기」로 연다.
  const $track = $app.querySelector('.arch-track');
  const STEP = () => innerHeight * (innerWidth < 760 ? 0.36 : 0.42);
  const base = () => $track.getBoundingClientRect().top + scrollY - 52;      // 위 막대(52px) 아래에 붙기 시작하는 스크롤 위치
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // pos = 스크롤이 가리키는 카드 자리(목표), shown = 화면에 그린 자리. shown이 pos를 부드럽게 따라가서 휠 한 칸에도 카드가 뚝뚝 끊기지 않고 미끄러진다.
  let pos = 0, shown = 0, anim = 0, lastT = 0, lift = 0;   // lift: 1 = 화면 아래에 내려가 있음 → 0 = 제자리(영역을 눌렀을 때 쑥 올라오기)
  const layout = () => {
    const phone = innerWidth < 760, cards = [...$stack.children];
    cards.forEach((el, k) => {
      const d = k - shown;
      if (d < 0) {   // 이미 지나간 카드: 앞으로 빠지며 사라진다
        const p = Math.min(1, -d);
        el.style.transform = `translate3d(${-6 * p}%, ${30 * p}%, 0) scale(${1 + 0.06 * p})`; el.style.opacity = Math.max(0, 1 - p * 1.3); el.style.filter = '';
      } else {       // 소실점 쪽으로 작아지며 물러난다
        const t = 1 - 1 / (1 + 0.42 * d), x = phone ? 0 : t * 8, y = phone ? -t * 44 : -t * 54, sc = 1 - t * 0.86;
        const up = lift * (70 + d * 6);   // 뒤 카드일수록 조금 늦게 올라와 묶음이 차례로 따라 선다
        el.style.transform = `translate3d(${x}vw, ${y + up}vh, 0) scale(${sc})`; el.style.opacity = d > 9 ? 0 : String(Math.max(0, 1 - lift * 1.1));
        el.style.filter = d > 0.02 ? `brightness(${Math.max(0.35, 1 - d * 0.12)})` : '';
      }
      el.style.zIndex = String(1000 - Math.round(Math.abs(d) * 10));
      el.classList.toggle('front', k === cur); el.setAttribute('aria-hidden', String(k !== cur));
      el.querySelectorAll('a').forEach((a) => (a.tabIndex = k === cur ? 0 : -1));
    });
    $count.textContent = list.length ? `${String(cur + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}` : '찾는 실험이 없어요';
  };
  const sizeTrack = () => { $track.style.height = `calc(100dvh - 52px + ${Math.max(0, list.length - 1) * STEP()}px)`; };
  let raf = 0;
  const tick = (t) => {
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000); lastT = t;
    shown += (pos - shown) * (1 - Math.exp(-dt * 9)); lift *= Math.exp(-dt * 7);
    if (Math.abs(pos - shown) < 0.002 && lift < 0.002) { shown = pos; lift = 0; anim = 0; lastT = 0; } else anim = requestAnimationFrame(tick);
    layout();
  };
  const glide = () => { if (reduced) { shown = pos; lift = 0; layout(); return; } if (!anim) anim = requestAnimationFrame(tick); };
  const fromScroll = () => { raf = 0; pos = list.length ? Math.max(0, Math.min(list.length - 1, (scrollY - base()) / STEP())) : 0; cur = Math.round(pos); glide(); };
  // 스크롤이 멈추면 가장 가까운 카드에 맞춘다(두 카드가 반쯤 겹친 채 멈추지 않게). 카드 구간 밖(아래 실험 목록)에서는 그대로 둔다.
  let settle = 0;
  const snap = () => { const p = (scrollY - base()) / STEP(); if (list.length > 1 && p > 0.02 && p < list.length - 1 - 0.02 && Math.abs(p - Math.round(p)) > 0.02) jump(Math.round(p)); };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(fromScroll); clearTimeout(settle); settle = setTimeout(snap, 160); };
  const jump = (k) => { if (!list.length) return; k = Math.max(0, Math.min(list.length - 1, k)); scrollTo({ top: base() + k * STEP(), behavior: reduced ? 'auto' : 'smooth' }); };
  const go = (n) => jump(cur + n);
  const build = (rise = false) => {
    list = ORDERED.filter((u) => (!dom || domainOf(u).id === dom) && (!query || `${u.title} ${u.sub} ${u.activity.title} ${domainOf(u).title}`.includes(query)));
    $stack.innerHTML = list.map(cardHtml).join(''); sizeTrack();
    if (scrollY > base()) scrollTo({ top: Math.max(0, base()), behavior: 'auto' });   // 거르기·검색을 바꾸면 첫 카드부터
    if (rise && !reduced) { shown = 0; lift = 1; layout(); }   // 영역을 누르면 그 영역의 첫 카드가 아래에서 쑥 올라와 맨 앞에 선다(원장 2026-10-20)
    fromScroll();
  };
  $stack.addEventListener('click', (e) => {
    const card = e.target.closest('.arch-card'); if (!card || e.target.closest('a')) return;
    const k = [...$stack.children].indexOf(card);
    if (k !== cur) jump(k); else if (cur < list.length - 1) go(1); else $app.querySelector('.arch-index').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
  $app.querySelectorAll('.arch-ctrl [data-step]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.step)));
  $app.querySelectorAll('.arch-pills button').forEach((b) => b.addEventListener('click', () => { dom = b.dataset.dom; $app.querySelectorAll('.arch-pills button').forEach((x) => x.classList.toggle('on', x === b)); build(true); }));
  // 검색은 전체 실험에서 찾는다(영역 거르기를 ALL로 되돌림)
  $q.addEventListener('input', () => { query = $q.value.trim(); if (query && dom) { dom = ''; $app.querySelectorAll('.arch-pills button').forEach((x) => x.classList.toggle('on', !x.dataset.dom)); } build(); });
  $q.addEventListener('keydown', (e) => { if (e.key === 'Enter' && list[cur]) location.hash = `#/u/${list[cur].id}`; });
  const onKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); $q.focus(); return; }
    if (e.target.matches('input,select,textarea')) return;
    if (['ArrowRight', 'ArrowDown'].includes(e.key) && document.activeElement?.closest('.arch-stage')) { e.preventDefault(); go(1); }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key) && document.activeElement?.closest('.arch-stage')) { e.preventDefault(); go(-1); }
    if (e.key === 'Enter' && document.activeElement === $stack && list[cur]) location.hash = `#/u/${list[cur].id}`;
  };
  const onResize = () => { sizeTrack(); fromScroll(); };
  document.addEventListener('keydown', onKey); addEventListener('resize', onResize); addEventListener('scroll', onScroll, { passive: true });
  homeOff = () => { clearTimeout(settle); cancelAnimationFrame(anim); document.removeEventListener('keydown', onKey); removeEventListener('resize', onResize); removeEventListener('scroll', onScroll); };
  // 실사 복도 사진이 있으면 SVG 위에 깐다(없으면 SVG 복도 그대로)
  if (CORRIDOR) { const $ph = $app.querySelector('.arch-photo'); $ph.onload = () => { $ph.hidden = false; $app.querySelector('.arch-stage').classList.add('has-photo'); }; $ph.src = CORRIDOR; }
  build();
}

function renderUnit(u) {
  const d = domainOf(u), mine = ORDERED.filter((x) => domainOf(x) === d);
  const idx = ORDERED.indexOf(u), prev = ORDERED[idx - 1], next = ORDERED[idx + 1];   // 이전·다음도 영역 순서
  const s = store.unit(u.id);
  $app.innerHTML = `${topbar('#/')}
  <main class="opened" style="--tab:${d.color}">
    <div class="wrap unit-head folder-label">
      <span class="label-tab">${d.en}</span>
      <div class="crumb"><span class="tag" style="background:${d.color};color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">${esc(d.title)}</span><span>${mine.indexOf(u) + 1}/${mine.length}</span><span>·</span><span>지도자료 ${u.part}-${u.no} · ${esc(u.source)}</span></div>
      <h1>${esc(u.title)}</h1><p class="sub">${esc(u.sub)}</p>
      ${u.note ? `<div class="note">${esc(u.note)}</div>` : ''}
    </div>
    <nav class="tabs" aria-label="서류철 안의 자료"><div class="wrap">
      <a href="#/u/${u.id}" data-to="concept" class="on">① 개념</a><a href="#/u/${u.id}" data-to="video">② 3D 실험</a><a href="#/u/${u.id}" data-to="activity">③ 탐구 활동</a><a href="#/u/${u.id}" data-to="discuss">④ 토론</a><a href="#/u/${u.id}" data-to="quiz">⑤ 확인</a>
    </div></nav>
    <section class="wrap section sheet" id="concept"><h2><span class="step">STEP 1</span>개념</h2><p class="lead">${esc(u.concept.lead)}</p>
      <div class="points">${u.concept.points.map(([b, t]) => `<div class="point"><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join('')}</div>
      <div class="terms">${u.concept.terms.map(([t, d]) => `<span class="term"><b>${esc(t)}</b>${esc(d)}</span>`).join('')}</div>
    </section>
    <section class="wrap section sheet" id="video"><h2><span class="step">STEP 2</span>3D 실험 보기</h2><p class="lead">재생을 누르면 실험이 한 단계씩 그려집니다. 화면을 끌면 돌려 볼 수 있고, 자막을 누르면 그 장면으로 갑니다.</p>
      <div class="stage">
        <canvas id="stage" aria-label="3D 실험 장면"></canvas>
        <div class="caption" id="caption"><span class="idx">장면 1</span>불러오는 중…</div>
        <div class="dots" id="dots"></div>
        <div class="controls">
          <button class="btn primary" id="btnPlay">▶ 재생</button>
          <button class="btn" id="btnPrev" title="이전 장면">⏮</button>
          <button class="btn" id="btnNext" title="다음 장면">⏭</button>
          <button class="btn" id="btnReplay" title="처음부터">↺ 처음</button>
          <span class="sp"></span>
          <button class="btn" id="btnVoice" aria-pressed="false" title="읽어 주기">🔈 음성</button>
          <select id="speed" aria-label="속도"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select>
        </div>
      </div>
      <div class="transcript" id="transcript"></div>
      <p class="hint">자막이 원본입니다. 음성은 기기의 읽어 주기 기능이라 브라우저마다 목소리가 다를 수 있고, 꺼 두어도 학습에 지장이 없습니다.</p>
    </section>
    <section class="wrap section sheet" id="activity"><h2><span class="step">STEP 3</span>탐구 활동 — ${esc(u.activity.title)}</h2>
      <div class="activity">
        <div class="box"><h3>절차</h3><ol>${u.activity.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
        <div>
          <div class="box" style="margin-bottom:12px"><h3>준비물</h3><ul>${u.activity.materials.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
          <div class="box"><h3>변인표</h3><div class="vars">
            <div class="var diff"><b>다르게</b><span>${u.activity.vars.diff.map(esc).join(' / ')}</span></div>
            <div class="var measure"><b>측정</b><span>${u.activity.vars.measure.map(esc).join(' / ')}</span></div>
            <div class="var same"><b>같게</b><span>${u.activity.vars.same.map(esc).join(' / ')}</span></div>
          </div></div>
        </div>
      </div>
    </section>
    <section class="wrap section sheet" id="discuss"><h2><span class="step">STEP 4</span>토론 · 반론</h2><p class="lead">먼저 스스로 답을 말해 본 뒤 힌트를 엽니다. 반론은 "근거가 무엇입니까?", "그 실험만으로 알 수 있습니까?"에서 시작합니다.</p>
      <div class="discuss">${u.discuss.map((d) => `<details><summary>${esc(d.q)}</summary><p>${esc(d.hint)}</p></details>`).join('')}</div>
    </section>
    <section class="wrap section sheet" id="quiz"><h2><span class="step">STEP 5</span>확인 문제</h2><p class="lead">세 문제. 고르면 바로 풀이가 보입니다.${s.quizBest != null ? ` 최고 기록 ${s.quizBest}/3.` : ''}</p>
      <div class="quiz" id="quiz">${u.quiz.map((q, qi) => `<div class="q" data-q="${qi}"><p class="stem">${qi + 1}. ${esc(q.q)}</p><div class="choices">${q.c.map((c, ci) => `<button data-c="${ci}"><span class="l">${LETTERS[ci]}</span><span>${esc(c)}</span></button>`).join('')}</div><p class="why" hidden></p></div>`).join('')}</div>
      <p class="score" id="score"></p>
    </section>
    <div class="wrap unit-nav">
      ${prev ? `<a href="#/u/${prev.id}"><b>← 이전 기록</b>${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="#/u/${next.id}"><b>다음 기록 →</b>${esc(next.title)}</a>` : `<a class="next" href="#/"><b>실험실로</b>전체 실험</a>`}
    </div>
  </main>${footer()}`;

  // 탭: 같은 페이지 안의 섹션으로 스크롤
  const tabs = [...$app.querySelectorAll('.tabs a')];
  tabs.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(a.dataset.to)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  const io = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) tabs.forEach((a) => a.classList.toggle('on', a.dataset.to === en.target.id)); }); }, { rootMargin: '-40% 0px -55% 0px' });
  ['concept', 'video', 'activity', 'discuss', 'quiz'].forEach((id) => io.observe(document.getElementById(id)));

  mount3D(u);
  mountQuiz(u);
}

async function mount3D(u) {
  const canvas = document.getElementById('stage');
  const $cap = document.getElementById('caption'), $dots = document.getElementById('dots'), $tr = document.getElementById('transcript');
  const $play = document.getElementById('btnPlay'), $voice = document.getElementById('btnVoice'), $speed = document.getElementById('speed');
  let mod;
  try {
    stage = new Stage(canvas); player = new Player(stage);
    mod = (await import(`./scenes/${u.scene}.js`)).default;
    if (!stage) return; // 사이에 페이지를 떠났다
    await player.load(mod);
  } catch (err) {
    console.error(err); $cap.innerHTML = `<span class="idx">오류</span>3D 장면을 불러오지 못했습니다. (${esc(err.message)})`; return;
  }
  $tr.innerHTML = mod.beats.map((b, i) => `<button data-i="${i}"><span class="n">${i + 1}</span><span>${esc(b.text)}</span></button>`).join('');
  $dots.innerHTML = mod.beats.map(() => '<i></i>').join('');
  const sync = () => {
    const i = player.index, b = mod.beats[i];
    if (!b) return; // 빠르게 유닛을 넘길 때 앞 유닛의 재생기가 부르는 경우
    $cap.innerHTML = `<span class="idx">장면 ${i + 1}/${mod.beats.length}</span>${esc(b.text)}`;
    $play.textContent = player.playing ? '❚❚ 멈춤' : (player.done ? '↺ 다시' : '▶ 재생');
    [...$dots.children].forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'cur' : ''; });
    [...$tr.children].forEach((bt, k) => bt.classList.toggle('on', k === i));
    $voice.setAttribute('aria-pressed', String(player.voice));
    if (player.done && !store.unit(u.id).videoDone) { store.patch(u.id, { videoDone: true }); }
  };
  player.onChange = sync; sync();
  $play.onclick = () => player.toggle();
  document.getElementById('btnPrev').onclick = () => player.prev();
  document.getElementById('btnNext').onclick = () => player.next();
  document.getElementById('btnReplay').onclick = () => player.replay();
  $voice.onclick = () => player.setVoice(!player.voice);
  $speed.onchange = () => player.setSpeed(parseFloat($speed.value));
  $tr.onclick = (e) => { const bt = e.target.closest('button'); if (bt) player.goto(+bt.dataset.i, false); };
  document.addEventListener('keydown', onKey);
  function onKey(e) { if (!player || e.target.matches('input,select,textarea')) return; if (e.key === ' ') { e.preventDefault(); player.toggle(); } if (e.key === 'ArrowRight') player.next(); if (e.key === 'ArrowLeft') player.prev(); }
  player._offKey = () => document.removeEventListener('keydown', onKey);
}

function mountQuiz(u) {
  const $quiz = document.getElementById('quiz'), $score = document.getElementById('score');
  const answered = new Map();
  $quiz.addEventListener('click', (e) => {
    const bt = e.target.closest('button'); if (!bt) return;
    const $q = bt.closest('.q'); const qi = +$q.dataset.q; if (answered.has(qi)) return;
    const q = u.quiz[qi], ci = +bt.dataset.c; answered.set(qi, ci === q.a);
    [...$q.querySelectorAll('button')].forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add('correct'); else if (k === ci) b.classList.add('wrong'); });
    const $why = $q.querySelector('.why'); $why.hidden = false; $why.textContent = (ci === q.a ? '정답! ' : `아쉽네요. 정답은 ${LETTERS[q.a]}. `) + q.why;
    if (answered.size === u.quiz.length) {
      const score = [...answered.values()].filter(Boolean).length; const best = Math.max(score, store.unit(u.id).quizBest || 0);
      store.patch(u.id, { quizBest: best, lastScore: score });
      $score.textContent = `${score}/${u.quiz.length} ${score >= 2 ? '— 통과! 다음 단원으로 가도 좋아요.' : '— 개념을 한 번 더 읽고 다시 풀어 보세요.'}`; $score.className = 'score' + (score >= 2 ? ' pass' : '');
    }
  });
}

addEventListener('hashchange', route);
route();
