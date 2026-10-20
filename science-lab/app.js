// 지필드 과학 탐구 랩 — 라우터·화면. 데이터는 data/curriculum.js, 3D는 engine.js + scenes/*.js
import { PARTS, UNITS, unitById } from './data/curriculum.js';
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
    <a class="brand" href="#/"><span class="mark">⚗</span>GFIELD<small>/SCIENCE-INQUIRY</small></a>
    <span class="spacer"></span>
    ${backHref ? `<a class="back" href="${backHref}">← 보관소</a>` : ''}
    <span class="progress-pill">확인 ${done}/${UNITS.length}</span>
  </div></header>`;
}
function footer() {
  return `<footer><div class="wrap">
    <p>교과 순서와 활동은 『2009 초등학교 과학탐구토론 지도자료』(서울특별시과학전시관)의 차례를 따르며, 개념 설명은 그 내용을 바탕으로 다시 썼습니다.</p>
    <p>3D 장면은 원본 도형으로만 그렸고 외부 저작물을 포함하지 않습니다. 음성은 기기의 읽어 주기 기능(Web Speech)을 씁니다.</p>
  </div></footer>`;
}

// 홈 = 과학 탐구 기록 보관소(2026-10-20 원장: hugh-kim.space 「THE ARCHIVE」 느낌을 과학 탐구 프로그램에).
// 어두운 보관소 복도에 실험 15건이 문서 카드로 줄지어 있다. 맨 앞 카드를 열면 그 실험(#/u/<id>)으로 간다.
// 넘기기: 휠·← →·↑ ↓·끌기(밀기)·뒤 카드 누르기. 거르기: 바닥의 PART 알약·검색. 진도(sciLab.v1)는 카드의 도장으로 보인다.
// 복도 배경은 실사 사진(assets/book/science-lab-v1-photo-archive-corridor.webp, 원장 맥에서 생성)이 있으면 그것, 없으면 아래 SVG 복도.
// 실사 복도 사진을 들여오면(scripts/import-book-photos.py archive-corridor=N) 아래를 그 경로로 바꾼다: './assets/book/science-lab-v1-photo-archive-corridor.webp'
const CORRIDOR = null;
let homeOff = null;
function corridorSvg() {
  const VX = 1170, VT = 250, VB = 300, W = 1600, H = 900, f = (k) => 1 - 0.78 ** k;   // 복도 원근: 소실점(VX, VT~VB)
  const frames = Array.from({ length: 14 }, (_, k) => { const t = f(k + 1), x = W - (W - VX - 40) * t, y1 = VT * t, y2 = H - (H - VB) * t; return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>`; }).join('');
  const shelves = [120, 230, 340, 450, 560, 670, 780].map((y) => `<line x1="${W}" y1="${y}" x2="${VX + 40}" y2="${VT + (y / H) * (VB - VT)}"/>`).join('');
  return `<svg class="arch-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .5 0 0 0 0 .45 0 0 0 .5 0"/></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
      <linearGradient id="wall" x1="0" x2="1"><stop offset="0" stop-color="#14120f"/><stop offset=".45" stop-color="#2b2723"/><stop offset=".8" stop-color="#1b1916"/><stop offset="1" stop-color="#0f0e0c"/></linearGradient>
      <linearGradient id="floor" y1="0" y2="1"><stop offset="0" stop-color="#0d0c0b"/><stop offset="1" stop-color="#26221d"/></linearGradient>
      <linearGradient id="glass" x1="1" x2="0"><stop offset="0" stop-color="#1c1a17"/><stop offset="1" stop-color="#0c0b0a"/></linearGradient>
      <radialGradient id="wash" cx=".38" cy=".38" r=".5"><stop offset="0" stop-color="#cdb79a" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="vig" cx=".55" cy=".45" r=".85"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#0b0a09"/>
    <polygon points="0,0 ${W},0 ${VX + 40},${VT} ${VX - 40},${VT}" fill="#0e0d0c"/>
    <polygon points="0,0 ${VX - 40},${VT} ${VX - 40},${VB} 0,${H}" fill="url(#wall)"/>
    <polygon points="0,0 ${VX - 40},${VT} ${VX - 40},${VB} 0,${H}" fill="url(#wash)"/>
    <polygon points="0,0 ${VX - 40},${VT} ${VX - 40},${VB} 0,${H}" filter="url(#grain)" opacity=".22"/>
    <polygon points="0,${H} ${VX - 40},${VB} ${VX + 40},${VB} ${W},${H}" fill="url(#floor)"/>
    <polygon points="${W},0 ${VX + 40},${VT} ${VX + 40},${VB} ${W},${H}" fill="url(#glass)"/>
    <g stroke="#6d6253" stroke-opacity=".55" stroke-width="2">${frames}</g>
    <g stroke="#4a4239" stroke-opacity=".7" stroke-width="1.4">${shelves}</g>
    <g stroke="#f3e2c4" stroke-width="3"><line x1="330" y1="0" x2="${VX - 30}" y2="${VT + 2}"/><line x1="1490" y1="0" x2="${VX + 30}" y2="${VT + 2}"/></g>
    <g stroke="#f3e2c4" stroke-width="9" opacity=".35" filter="url(#glow)"><line x1="330" y1="0" x2="${VX - 30}" y2="${VT + 2}"/><line x1="1490" y1="0" x2="${VX + 30}" y2="${VT + 2}"/></g>
    <g stroke="#f3e2c4" stroke-width="2" opacity=".18" filter="url(#glow)"><line x1="560" y1="${H}" x2="${VX - 20}" y2="${VB}"/><line x1="1450" y1="${H}" x2="${VX + 20}" y2="${VB}"/></g>
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
  </svg>`;
}
function stampsHtml(s) {
  const quiz = s.quizBest != null ? `확인 ${s.quizBest}/3` : '확인 전';
  return `<span class="stamps"><span class="stamp ${s.videoDone ? 'on' : ''}">${s.videoDone ? '3D 실험 봄' : '3D 실험 전'}</span><span class="stamp ${s.quizBest >= 2 ? 'gold' : s.quizBest != null ? 'on' : ''}">${quiz}</span></span>`;
}
function renderHome() {
  const done = UNITS.filter((u) => store.unit(u.id).quizBest >= 2).length;
  const partOf = (u) => PARTS.find((p) => p.id === u.part);
  const last = UNITS.map((u) => [u, store.unit(u.id).updatedAt || 0]).filter(([, t]) => t).sort((a, b) => b[1] - a[1])[0]?.[0];
  $app.innerHTML = `<header class="arch-top"><a class="arch-brand" href="#/"><b>GFIELD</b><span>/SCIENCE-INQUIRY</span></a>
      <label class="arch-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="실험 찾기… (Ctrl+/)" aria-label="실험 찾기" autocomplete="off"></label>
      <span class="arch-progress">확인 ${done}/${UNITS.length}</span></header>
  <main class="archive">
    <section class="arch-stage" aria-label="과학 탐구 기록 보관소 — 실험 카드">
      <div class="arch-bg">${corridorSvg()}<img class="arch-photo" alt="" hidden></div>
      <div class="arch-wall" aria-hidden="true"><small>GFIELD · SCIENCE INQUIRY RECORDS</small><b>THE INQUIRY ARCHIVE</b><span>과학 탐구 기록 보관소</span></div>
      <div class="arch-stack" tabindex="0" aria-roledescription="카드 넘기기" aria-label="실험 카드 묶음. 왼쪽·오른쪽 화살표로 넘기고 Enter로 열어요."></div>
      <nav class="arch-pills" aria-label="PART 거르기">${PARTS.map((p) => `<button type="button" data-part="${p.id}" style="--tab:${p.color}">PART ${p.id} <b>${UNITS.filter((u) => u.part === p.id).length}</b></button>`).join('')}<button type="button" data-part="" class="all on">ALL <b>${UNITS.length}</b></button></nav>
      <div class="arch-ctrl"><button type="button" data-step="-1" aria-label="앞 카드">‹</button><span class="arch-count" aria-live="polite"></span><button type="button" data-step="1" aria-label="뒤 카드">›</button><small>휠 · ← → · 밀기로 넘겨요</small></div>
      ${last ? `<a class="arch-resume" href="#/u/${last.id}">이어서 보기 <b>${esc(last.title)}</b></a>` : ''}
    </section>
    <section class="wrap arch-index" aria-label="전체 실험 목록">
      <h2>보관 목록 <small>실험 ${UNITS.length}건 · 출처 『2009 초등학교 과학탐구토론 지도자료』(서울특별시과학전시관)</small></h2>
      ${PARTS.map((p) => `<div class="arch-shelf" style="--tab:${p.color}"><h3><span>PART ${p.id}</span>${esc(p.title)} <small>${esc(p.sub)}</small></h3><ol>${UNITS.filter((u) => u.part === p.id).map((u) => `<li><a href="#/u/${u.id}"><span class="no">${p.id}-${u.no}</span><b>${esc(u.title)}</b><span class="exp">${esc(u.activity.title)}</span>${stampsHtml(store.unit(u.id))}</a></li>`).join('')}</ol></div>`).join('')}
    </section>
  </main>${footer()}`;

  const $stack = $app.querySelector('.arch-stack'), $count = $app.querySelector('.arch-count'), $q = $app.querySelector('.arch-search input');
  let list = UNITS.slice(), cur = 0, part = '', query = '';
  const cardHtml = (u) => { const p = partOf(u), s = store.unit(u.id);
    return `<article class="arch-card" data-id="${u.id}" style="--tab:${p.color}">
      <div class="ac-meta"><span><i></i>PART ${p.id} · ${esc(p.title)} · ${p.id}-${u.no}</span><span class="ac-src">지도자료 ${esc(u.source)}</span></div>
      <h3>${esc(u.title)}</h3><p class="ac-sub">${esc(u.sub)}</p><p class="ac-lead">${esc(u.concept.lead)}</p>
      <div class="ac-foot"><span class="ac-exp"><b>실험</b>${esc(u.activity.title)}</span>${stampsHtml(s)}<a class="ac-open" href="#/u/${u.id}">서류 열기 →</a></div>
    </article>`; };
  const layout = () => {
    const phone = innerWidth < 760, cards = [...$stack.children];
    cards.forEach((el, k) => {
      const d = k - cur, t = d < 0 ? 0 : 1 - 1 / (1 + 0.42 * d);
      const x = phone ? 0 : t * 30, y = phone ? -t * 46 : -t * 62, sc = 1 - t * 0.86;   // 소실점(오른쪽 위)으로 작아지며 물러난다
      el.style.transform = d < 0 ? 'translate3d(-6%, 30%, 0) scale(1.06)' : `translate3d(${x}vw, ${y}vh, 0) scale(${sc})`;
      el.style.opacity = d < 0 ? 0 : d > 9 ? 0 : 1;
      el.style.zIndex = 100 - Math.abs(d);
      el.style.filter = d > 0 ? `brightness(${Math.max(0.35, 1 - d * 0.12)})` : '';
      el.classList.toggle('front', d === 0); el.setAttribute('aria-hidden', String(d !== 0));
      el.querySelectorAll('a').forEach((a) => (a.tabIndex = d === 0 ? 0 : -1));
    });
    $count.textContent = list.length ? `${String(cur + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}` : '찾는 실험이 없어요';
  };
  const build = () => {
    list = UNITS.filter((u) => (!part || u.part === part) && (!query || `${u.title} ${u.sub} ${u.activity.title}`.includes(query)));
    cur = Math.min(cur, Math.max(0, list.length - 1));
    $stack.innerHTML = list.map(cardHtml).join(''); layout();
  };
  const go = (n) => { if (!list.length) return; cur = Math.max(0, Math.min(list.length - 1, cur + n)); layout(); };
  // 넘기기: 휠(한 번에 한 장), 화살표, 밀기, 뒤 카드 누르기
  let wheelLock = 0;
  $stack.addEventListener('wheel', (e) => { e.preventDefault(); const now = Date.now(); if (now - wheelLock < 380 || Math.abs(e.deltaY) < 8) return; wheelLock = now; go(e.deltaY > 0 ? 1 : -1); }, { passive: false });
  let sx = null, sy = null;
  $stack.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  $stack.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.max(Math.abs(dx), Math.abs(dy)) > 40) go((Math.abs(dx) > Math.abs(dy) ? -dx : -dy) > 0 ? 1 : -1); });
  $stack.addEventListener('click', (e) => { const card = e.target.closest('.arch-card'); if (!card) return; const k = [...$stack.children].indexOf(card); if (k !== cur) { e.preventDefault(); cur = k; layout(); } else if (!e.target.closest('a')) location.hash = `#/u/${card.dataset.id}`; });
  $app.querySelectorAll('.arch-ctrl [data-step]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.step)));
  $app.querySelectorAll('.arch-pills button').forEach((b) => b.addEventListener('click', () => { part = b.dataset.part; cur = 0; $app.querySelectorAll('.arch-pills button').forEach((x) => x.classList.toggle('on', x === b)); build(); }));
  // 검색은 전체 실험에서 찾는다(PART 거르기를 ALL로 되돌림)
  $q.addEventListener('input', () => { query = $q.value.trim(); cur = 0; if (query && part) { part = ''; $app.querySelectorAll('.arch-pills button').forEach((x) => x.classList.toggle('on', !x.dataset.part)); } build(); });
  $q.addEventListener('keydown', (e) => { if (e.key === 'Enter' && list[cur]) location.hash = `#/u/${list[cur].id}`; });
  const onKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); $q.focus(); return; }
    if (e.target.matches('input,select,textarea')) return;
    if (['ArrowRight', 'ArrowDown'].includes(e.key) && document.activeElement?.closest('.arch-stage')) { e.preventDefault(); go(1); }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key) && document.activeElement?.closest('.arch-stage')) { e.preventDefault(); go(-1); }
    if (e.key === 'Enter' && document.activeElement === $stack && list[cur]) location.hash = `#/u/${list[cur].id}`;
  };
  document.addEventListener('keydown', onKey); addEventListener('resize', layout);
  homeOff = () => { document.removeEventListener('keydown', onKey); removeEventListener('resize', layout); };
  // 실사 복도 사진이 있으면 SVG 위에 깐다(없으면 SVG 복도 그대로)
  if (CORRIDOR) { const $ph = $app.querySelector('.arch-photo'); $ph.onload = () => { $ph.hidden = false; $app.querySelector('.arch-stage').classList.add('has-photo'); }; $ph.src = CORRIDOR; }
  build();
}

function renderUnit(u) {
  const part = PARTS.find((p) => p.id === u.part);
  const idx = UNITS.indexOf(u), prev = UNITS[idx - 1], next = UNITS[idx + 1];
  const s = store.unit(u.id);
  $app.innerHTML = `${topbar('#/')}
  <main class="opened" style="--tab:${part.color}">
    <div class="wrap unit-head folder-label">
      <span class="label-tab">${part.id}-${u.no}</span>
      <div class="crumb"><span class="tag" style="background:${part.color};color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">PART ${part.id}</span><span>${esc(part.title)} · ${u.no}/${UNITS.filter((x) => x.part === u.part).length}</span><span>·</span><span>지도자료 ${esc(u.source)}</span></div>
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
      ${next ? `<a class="next" href="#/u/${next.id}"><b>다음 기록 →</b>${esc(next.title)}</a>` : `<a class="next" href="#/"><b>보관소로</b>전체 실험</a>`}
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
