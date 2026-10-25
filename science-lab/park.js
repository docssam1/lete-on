// 자연관찰 공원 지도 — 자연관찰대회 폴더(#/contest/nature) 맨 위.
// 원장 2026-10-25: 「페이지에 들어오면 전체 지도가 줌인되면서 시작」. 전체 조감도 → 광장 쪽으로 부드럽게 확대 → 지점마다 점 + 말꼬리 표.
// 끌어서 둘러보기 · Ctrl+휠/두 손가락으로 확대 · 「전체 지도」로 다시 전체. 표를 누르면 그 자리에서 할 관찰(연습 세트)이 열린다.
// 그림·좌표는 data/park-map.js. 표는 그림을 확대해도 같은 크기로 보인다.
import { PARK } from './data/park-map.js';
import { OBSERVE_SETS } from './data/observe-sets.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 두 아이(탐구 짝)가 그 자리에서 떠올린 물음 — 관찰의 출발점. 답은 연습 세트에서 직접 확인한다.
const ASK = {
  gate: ['나래', '오늘 과제는 어디서 받아?', '도윤', '안내부터 읽자. 시간·내는 것·심사 기준!'],
  pond: ['나래', '수련 잎은 왜 물에 안 가라앉지?', '도윤', '잎자루를 잘라 보면 알 수 있을까?'],
  meadow: ['도윤', '그늘엔 갈색 곤충, 햇빛엔 연두색 곤충?', '나래', '두 곳을 같은 방법으로 재 보자.'],
  flowers: ['나래', '국화랑 장미, 잎이 줄기에 붙는 차례가 달라!', '도윤', '마디마다 몇 장인지 세어 보자.'],
  leaves: ['도윤', '이 두 잎, 눈으론 구분이 안 돼.', '나래', '길이랑 폭을 재서 비율로 바꿔 보자.'],
  garden: ['나래', '그늘에 둔 콩이 제일 키가 커!', '도윤', '그럼 제일 튼튼한 걸까? 날마다 재 보자.'],
  picnic: ['도윤', '어제 남긴 빵에 하얀 게 생겼어.', '나래', '만지지 말고 날마다 넓이를 기록하자.'],
};
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function mountPark($host) {
  const sets = Object.fromEntries(OBSERVE_SETS.map((s) => [s.id, s]));
  $host.innerHTML = `<div class="pm-view" tabindex="0" aria-label="${esc(PARK.title)} 지도 — 끌어서 둘러보고, 말꼬리 표를 누르면 그 자리의 관찰이 열려요">
      <div class="pm-map"><img class="pm-img" alt="" draggable="false">
        ${PARK.spots.map((p) => `<button type="button" class="pk-pin" data-spot="${p.id}" aria-label="${esc(p.name)}"><span class="pk-tag"><i>${p.icon}</i><b class="full">${esc(p.name)}</b><b class="short">${esc(p.short)}</b></span><span class="pk-dot"></span></button>`).join('')}</div>
      <div class="pm-title"><b>${esc(PARK.title)}</b><span>지도를 끌어서 둘러보고, 말꼬리 표를 눌러요</span></div>
      <div class="pm-ctrl"><button type="button" data-z="1" aria-label="확대">＋</button><button type="button" data-z="-1" aria-label="축소">－</button><button type="button" data-z="0">전체 지도</button></div>
      ${PARK.placeholder ? '<span class="pm-temp">임시 그림 — 실사 조감도로 바뀔 자리</span>' : ''}
    </div>
    <div class="pk-panel" hidden aria-live="polite"></div>`;
  const $v = $host.querySelector('.pm-view'), $m = $host.querySelector('.pm-map'), $img = $host.querySelector('.pm-img'), $pins = [...$host.querySelectorAll('.pk-pin')], $panel = $host.querySelector('.pk-panel');
  let kind = '', I = null, s = 1, tx = 0, ty = 0, fit = 1, anim = 0, alive = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const apply = () => { $m.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`; $m.style.setProperty('--s', s); };
  // 그림이 화면을 벗어나 빈 곳이 보이지 않게(전체 지도일 때는 가운데)
  const clamp = () => { const W = $v.clientWidth, H = $v.clientHeight, w = I.w * s, h = I.h * s; tx = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, tx)); ty = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, ty)); };
  const view = (x, y, zs) => { const W = $v.clientWidth, H = $v.clientHeight; const ns = fit * zs; return { s: ns, tx: W / 2 - (x / 100) * I.w * ns, ty: H / 2 - (y / 100) * I.h * ns }; };
  const fly = (to, ms, done) => { cancelAnimationFrame(anim); const from = { s, tx, ty }, t0 = performance.now();
    const step = (now) => { if (!alive) return; const k = Math.min(1, (now - t0) / ms), e = ease(k); s = from.s + (to.s - from.s) * e; tx = from.tx + (to.tx - from.tx) * e; ty = from.ty + (to.ty - from.ty) * e; clamp(); apply(); if (k < 1) anim = requestAnimationFrame(step); else done?.(); };
    anim = requestAnimationFrame(step); };
  const zoomAt = (f, cx, cy) => { const ns = Math.max(fit, Math.min(fit * 4, s * f)); tx = cx - ((cx - tx) * ns) / s; ty = cy - ((cy - ty) * ns) / s; s = ns; clamp(); apply(); };
  const place = () => { $pins.forEach((b) => { const p = PARK.spots.find((x) => x.id === b.dataset.spot)[kind]; b.style.left = `${p[0]}%`; b.style.top = `${p[1]}%`; }); };
  const showPins = () => $pins.forEach((b, i) => setTimeout(() => b.classList.add('show'), reduced ? 0 : i * 130));
  const load = (intro) => {
    kind = $v.clientWidth / Math.max(1, $v.clientHeight) < 0.8 ? 'tall' : 'wide'; I = PARK.images[kind];
    $m.style.width = `${I.w}px`; $m.style.height = `${I.h}px`; place();
    fit = Math.min($v.clientWidth / I.w, $v.clientHeight / I.h);
    const st = PARK.start[kind], go = view(st[0], st[1], st[2]);
    if (!intro || reduced) { s = go.s; tx = go.tx; ty = go.ty; clamp(); apply(); showPins(); return; }
    // 시작: 전체 지도를 잠깐 보여 주고 → 광장 쪽으로 확대 → 표가 하나씩 떠오른다
    s = fit; tx = 0; ty = 0; clamp(); apply(); $pins.forEach((b) => b.classList.remove('show'));
    setTimeout(() => alive && fly(go, 2600, showPins), 900);
  };
  $img.onload = () => load(true);
  $img.src = PARK.images[$v.clientWidth / Math.max(1, $v.clientHeight) < 0.8 ? 'tall' : 'wide'].src;
  // 끌기·두 손가락 확대
  const pts = new Map(); let moved = 0, pinch = 0;
  $v.addEventListener('pointerdown', (e) => { if (e.target.closest('.pm-ctrl')) return; pts.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; cancelAnimationFrame(anim); if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  $v.addEventListener('pointermove', (e) => { const p = pts.get(e.pointerId); if (!p) return; const dx = e.clientX - p[0], dy = e.clientY - p[1];
    if (pts.size === 1) { moved += Math.abs(dx) + Math.abs(dy); if (moved > 6) { $v.setPointerCapture?.(e.pointerId); tx += dx; ty += dy; clamp(); apply(); } }
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), r = $v.getBoundingClientRect(); if (pinch) zoomAt(d / pinch, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); pinch = d; moved = 99; } });
  const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => $v.addEventListener(t, up));
  $v.addEventListener('wheel', (e) => { if (!e.ctrlKey) return; e.preventDefault(); const r = $v.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  $host.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => { const z = +b.dataset.z; if (!z) return fly({ s: fit, tx: 0, ty: 0 }, 700); zoomAt(z > 0 ? 1.4 : 1 / 1.4, $v.clientWidth / 2, $v.clientHeight / 2); }));
  // 표 → 그 자리의 관찰
  const open = (id) => {
    const p = PARK.spots.find((x) => x.id === id), S = p.set ? sets[p.set] : null, q = ASK[id] || [];
    $pins.forEach((b) => b.classList.toggle('on', b.dataset.spot === id));
    $panel.hidden = false;
    $panel.innerHTML = `<div class="pk-talk"><p><b>${esc(q[0])}</b>${esc(q[1])}</p><p><b>${esc(q[2])}</b>${esc(q[3])}</p></div>
      <h3><i>${p.icon}</i>${esc(p.name)}${S ? `<small>${S.level === 'mid' ? '중등' : '초등'} · ${esc(S.title)}</small>` : '<small>대회 안내</small>'}</h3>
      ${S ? `<p class="pk-lead">${esc(S.lead)}</p><ol class="pk-steps">${S.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <div class="pk-go"><a class="pk-btn" href="#/observe/${S.id}">이 자리에서 관찰하기 →</a><span>표본 ${S.mod.SPECIMENS.length}종 · 3D 모형 · 실사 사진 · 예시 보고서</span></div>`
        : `<p class="pk-lead">대회 날은 주제와 장소를 그 자리에서 받아요. 아래 안내에서 누가 나가는지, 얼마나 걸리는지, 무엇을 내는지, 심사에서 무엇을 보는지 먼저 읽어요.</p>
        <div class="pk-go"><a class="pk-btn" href="#/contest/nature" data-guide>대회 안내 읽기 ↓</a></div>`}`;
    $panel.querySelector('[data-guide]')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('ct-guide')?.scrollIntoView({ behavior: 'smooth' }); });
    $panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  };
  $pins.forEach((b) => b.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); return; } open(b.dataset.spot); }));
  // 화면 크기가 바뀌면(폰 돌리기 등) 그림을 다시 고르고 맞춘다
  let rt = 0; const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { if (!I) return; const want = $v.clientWidth / Math.max(1, $v.clientHeight) < 0.8 ? 'tall' : 'wide'; if (want !== kind) { $img.src = PARK.images[want].src; $img.onload = () => load(false); } else load(false); }, 150); };
  addEventListener('resize', onResize);
  return { destroy() { alive = false; cancelAnimationFrame(anim); removeEventListener('resize', onResize); } };
}
