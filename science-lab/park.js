// 자연관찰 공원 지도 — 자연관찰대회 폴더(#/contest/nature) 맨 위.
// 원장 2026-10-25: 「페이지에 들어오면 전체 지도가 줌인되면서 시작」 · 「두 친구의 아바타는? 돌아다니는 거 아니야?」.
// 전체 조감도 → 나래·도윤이 입구에서 광장으로 걸어 들어오고 지도는 광장 쪽으로 확대 → 지점마다 점 + 말꼬리 표.
// 표를 누르면 두 아이가 길을 따라 그 자리로 걸어가고(확대해 있으면 지도가 따라감), 도착하면 둘이 물음을 주고받고 그 자리의 관찰(연습 세트)이 열린다.
// 끌어서 둘러보기 · Ctrl+휠/두 손가락으로 확대 · 「전체 지도」로 다시 전체. 그림·좌표·길은 data/park-map.js. 표와 아이들은 그림을 확대해도 크기가 거의 그대로다.
import { PARK } from './data/park-map.js';
import { OBSERVE_SETS } from './data/observe-sets.js';
import { createCast, NPC_CAST } from './park-chars3d.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 두 아이(탐구 짝)가 그 자리에서 떠올린 물음 — 관찰의 출발점. 답은 연습 세트에서 직접 확인한다.
const ASK = {
  gate: ['나래', '오늘 과제는 어디서 받아?', '도윤', '안내부터 읽자. 시간·내는 것·심사 기준!'],
  pond: ['나래', '수련 잎은 왜 물에 안 가라앉지?', '도윤', '잎자루를 잘라 보면 알 수 있을까?'],
  meadow: ['도윤', '그늘엔 갈색 곤충, 햇빛엔 연두색 곤충?', '나래', '두 곳을 같은 방법으로 재 보자.'],
  flowers: ['나래', '국화랑 장미, 잎이 줄기에 붙는 차례가 달라!', '도윤', '마디마다 몇 장인지 세어 보자.'],
  litter: ['나래', '낙엽 아래 흙은 왜 이렇게 축축하지?', '도윤', '맨땅이랑 같은 틀로 흙 속 동물을 세어 보자.'],
  leaves: ['도윤', '이 두 잎, 눈으론 구분이 안 돼.', '나래', '길이랑 폭을 재서 비율로 바꿔 보자.'],
};
const HELLO = ['나래', '와, 대회장이다! 어디부터 가 볼까?', '도윤', '말꼬리 표를 누르면 같이 걸어갈게.'];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const key = (p) => `${p[0]},${p[1]}`;

export function mountPark($host) {
  const sets = Object.fromEntries(OBSERVE_SETS.map((s) => [s.id, s]));
  $host.innerHTML = `<div class="pm-view" tabindex="0" aria-label="${esc(PARK.title)} 지도 — 끌어서 둘러보고, 말꼬리 표를 누르면 두 친구가 그 자리로 걸어가 관찰을 열어요">
      <div class="pm-map"><img class="pm-img" alt="" draggable="false">
        ${PARK.spots.map((p) => `<button type="button" class="pk-pin" data-spot="${p.id}" aria-label="${esc(p.name)}"><span class="pk-tag"><i>${p.icon}</i><b class="full">${esc(p.name)}</b><b class="short">${esc(p.short)}</b></span><span class="pk-dot"></span></button>`).join('')}
        ${Object.keys(PARK.npcs || {}).filter((id) => NPC_CAST[id]).map((id) => `<div class="pk-npc" data-npc="${id}" aria-hidden="true"><canvas width="132" height="120"></canvas></div>`).join('')}
        <div class="pk-kids" aria-hidden="true"><div class="pk-say" hidden></div><div class="pk-kid3d"><canvas width="132" height="120"></canvas><b class="nr">나래</b><b class="dy">도윤</b></div></div></div>
      <div class="pm-title"><b>${esc(PARK.title)}</b><span>지도를 끌어서 둘러보고, 말꼬리 표를 눌러요</span></div>
      <div class="pm-ctrl"><button type="button" data-z="1" aria-label="확대">＋</button><button type="button" data-z="-1" aria-label="축소">－</button><button type="button" data-z="0">전체 지도</button><button type="button" class="pm-big" data-big>⛶ 가로로 크게</button><button type="button" class="pm-close" data-close>✕ 닫기</button></div>
      ${PARK.placeholder ? '<span class="pm-temp">임시 그림 — 실사 조감도로 바뀔 자리</span>' : ''}
    </div>
    <div class="pk-panel" hidden aria-live="polite"></div>`;
  const $v = $host.querySelector('.pm-view'), $m = $host.querySelector('.pm-map'), $img = $host.querySelector('.pm-img'), $pins = [...$host.querySelectorAll('.pk-pin')], $panel = $host.querySelector('.pk-panel');
  const $kids = $host.querySelector('.pk-kids'), $say = $host.querySelector('.pk-say');
  let kind = '', I = null, s = 1, tx = 0, ty = 0, fit = 1, anim = 0, alive = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // --kk = 사람들이 화면에서 보이는 배율. 원장 「캐릭터가 더 작아야지」 → 전체 지도 0.42, 확대할수록 조금씩(최대 0.85)
  let KK = 0.42;
  // 지도 상자가 좁으면(폰 미리 보기) 그만큼 더 작게 — 상자 폭 900px 아래로는 폭에 비례
  const apply = () => { KK = Math.min(0.85, 0.42 * Math.sqrt(s / fit)) * Math.min(1, $v.clientWidth / 900); $m.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`; $m.style.setProperty('--s', s); $m.style.setProperty('--kk', KK); };
  // 그림이 화면을 벗어나 빈 곳이 보이지 않게(전체 지도일 때는 가운데)
  const clamp = () => { const W = $v.clientWidth, H = $v.clientHeight, w = I.w * s, h = I.h * s; tx = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, tx)); ty = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, ty)); };
  const view = (x, y, zs) => { const W = $v.clientWidth, H = $v.clientHeight; const ns = fit * zs; return { s: ns, tx: W / 2 - (x / 100) * I.w * ns, ty: H / 2 - (y / 100) * I.h * ns }; };
  const fly = (to, ms, done) => { cancelAnimationFrame(anim); const from = { s, tx, ty }, t0 = performance.now();
    const step = (now) => { if (!alive) return; const k = Math.min(1, (now - t0) / ms), e = ease(k); s = from.s + (to.s - from.s) * e; tx = from.tx + (to.tx - from.tx) * e; ty = from.ty + (to.ty - from.ty) * e; clamp(); apply(); if (k < 1) anim = requestAnimationFrame(step); else done?.(); };
    anim = requestAnimationFrame(step); };
  const zoomAt = (f, cx, cy) => { const ns = Math.max(fit, Math.min(fit * 4, s * f)); tx = cx - ((cx - tx) * ns) / s; ty = cy - ((cy - ty) * ns) / s; s = ns; clamp(); apply(); };
  const place = () => { $pins.forEach((b) => { const p = PARK.spots.find((x) => x.id === b.dataset.spot)[kind]; b.style.left = `${p[0]}%`; b.style.top = `${p[1]}%`; }); };
  const showPins = () => $pins.forEach((b, i) => setTimeout(() => b.classList.add('show'), reduced ? 0 : i * 130));

  // ── 두 아이: 길 그래프(입구·광장·지점마다 path의 이웃한 점끼리 이음) 위에서 가장 짧은 길로 걷는다
  const kid = { pos: [0, 0], spot: 'gate', walk: null, follow: false, raf: 0, sayT: 0 };
  const hub = () => PARK.walk.hub[kind];
  const stand = (id) => { const p = PARK.spots.find((x) => x.id === id)?.path?.[kind] || []; return p.length ? p[p.length - 1] : hub(); };
  const px = (a, b) => Math.hypot(((a[0] - b[0]) * I.w) / 100, ((a[1] - b[1]) * I.h) / 100);
  let G = null;
  const graph = () => { const N = new Map(), E = new Map();
    const link = (a, b) => { for (const p of [a, b]) { N.set(key(p), p); if (!E.has(key(p))) E.set(key(p), new Set()); } E.get(key(a)).add(key(b)); E.get(key(b)).add(key(a)); };
    const chain = (ps) => ps.forEach((p, i) => i && link(ps[i - 1], p));
    chain([...PARK.walk.entrance[kind], hub()]); PARK.spots.forEach((x) => chain([hub(), ...(x.path?.[kind] || [])]));
    return { N, E }; };
  // from(지금 자리)에서 이웃 점 links를 거쳐 to(점 key)까지 — 점이 수십 개라 단순 다익스트라
  const route = (from, links, to) => { const d = new Map([['@', 0]]), prev = new Map(), done = new Set(), nb = (k) => (k === '@' ? links : [...G.E.get(k)]), pt = (k) => (k === '@' ? from : G.N.get(k));
    for (;;) { let u = null; for (const [k, v] of d) if (!done.has(k) && (u === null || v < d.get(u))) u = k; if (u === null || u === to) break; done.add(u);
      for (const w of nb(u)) { const nd = d.get(u) + px(pt(u), pt(w)); if (nd < (d.get(w) ?? Infinity)) { d.set(w, nd); prev.set(w, u); } } }
    const out = []; for (let k = to; k !== undefined; k = prev.get(k)) out.unshift({ k, p: pt(k) }); return out[0]?.k === '@' ? out : [{ k: '@', p: from }, { k: to, p: G.N.get(to) }]; };
  const putKids = () => { $kids.style.left = `${(kid.pos[0] / 100) * I.w}px`; $kids.style.top = `${(kid.pos[1] / 100) * I.h}px`; };
  // 걷는 동안은 둘 다 가는 쪽을 보고, 서 있으면 서로 마주 본다
  const cast = createCast({ reduced });
  const K3 = cast.add($host.querySelector('.pk-kid3d canvas'), ['narae', 'doyun']);
  // ── 공원 안의 다른 사람들: 점 하나면 그 자리에 서 있고(가끔 손 흔듦), 둘 이상이면 그 길을 천천히 오간다
  const npcs = [...$host.querySelectorAll('.pk-npc')].map((el) => ({ id: el.dataset.npc, el, A: cast.add(el.querySelector('canvas'), NPC_CAST[el.dataset.npc]), pts: [], i: 0, dir: 1, t: 0, wait: Math.random() * 2, pos: [0, 0] }));
  const putNpc = (n) => { n.el.style.left = `${(n.pos[0] / 100) * I.w}px`; n.el.style.top = `${(n.pos[1] / 100) * I.h}px`; };
  const npcReset = () => npcs.forEach((n) => { n.pts = PARK.npcs[n.id]?.[kind] || []; n.i = 0; n.dir = 1; n.t = 0; n.pos = n.pts[0] || [0, 0]; n.A.setWalking(false); n.A.face(0); putNpc(n); });
  let npcRaf = 0, npcLast = performance.now(), waveT = 4;
  const npcStep = (now) => { if (!alive) return; const dt = Math.min(0.05, (now - npcLast) / 1000); npcLast = now;
    if (I && !reduced) {
      for (const n of npcs) {
        if (n.pts.length < 2) continue;
        if (n.wait > 0) { n.wait -= dt; if (n.wait <= 0) n.A.setWalking(true); continue; }
        const a = n.pts[n.i], b = n.pts[n.i + n.dir], seg = px(a, b) || 1; n.t += (14 * dt) / seg;
        n.pos = [a[0] + (b[0] - a[0]) * Math.min(1, n.t), a[1] + (b[1] - a[1]) * Math.min(1, n.t)]; putNpc(n); n.A.face((b[0] - a[0]) * I.w, (b[1] - a[1]) * I.h);
        if (n.t >= 1) { n.t = 0; n.i += n.dir; if (n.i <= 0 || n.i >= n.pts.length - 1) { n.dir = -n.dir; n.wait = 2 + Math.random() * 3; n.A.setWalking(false); n.A.face(0); } }
      }
      waveT -= dt; if (waveT < 0) { waveT = 6 + Math.random() * 6; const st = npcs.filter((n) => n.pts.length < 2); st[Math.floor(Math.random() * st.length)]?.A.wave(); }
    }
    npcRaf = requestAnimationFrame(npcStep); };
  npcRaf = requestAnimationFrame(npcStep);
  // 지도가 화면 밖이면 그리기를 쉰다
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => cast.pause(!es[es.length - 1].isIntersecting)) : null; io?.observe($v);
  const face = (dx, dy = 0) => K3.face(dx, dy);
  const say = (q) => { clearTimeout(kid.sayT); if (!q) { $say.hidden = true; return; }
    const line = (i) => { $say.innerHTML = `<b>${esc(q[i])}</b>${esc(q[i + 1])}`; $say.hidden = false; $say.style.marginLeft = '0px'; $say.style.setProperty('--tail', '50%');
      // 지도 가장자리에서는 말풍선을 안쪽으로 밀고 꼬리만 아이들 쪽에 남긴다(말풍선은 화면에서 --kk배 크기)
      // 말풍선은 아이들 배율(--kk)을 되돌려 늘 같은 크기 → 옮길 거리는 부모(아이들) 단위로 sh/KK, 꼬리는 말풍선 단위(=화면)로 sh
      const r = $say.getBoundingClientRect(), V = $v.getBoundingClientRect();
      const sh = rot ? (r.bottom > V.bottom - 8 ? V.bottom - 8 - r.bottom : r.top < V.top + 8 ? V.top + 8 - r.top : 0) : (r.right > V.right - 8 ? V.right - 8 - r.right : r.left < V.left + 8 ? V.left + 8 - r.left : 0);
      if (sh) { $say.style.marginLeft = `${sh / KK}px`; $say.style.setProperty('--tail', `calc(50% - ${sh}px)`); } };
    line(0); kid.sayT = setTimeout(() => { line(2); kid.sayT = setTimeout(() => { $say.hidden = true; }, 2600); }, 2600); };
  const stopWalk = () => { cancelAnimationFrame(kid.raf); kid.walk = null; $kids.classList.remove('walk'); K3.setWalking(false); };
  const walkTo = (toKey, ms, done) => {
    const w = kid.walk, links = w ? [w.pts[w.i].k, w.pts[w.i + 1].k].filter((k) => k !== '@') : [key(kid.pos)];
    stopWalk(); say(null);
    const pts = route(kid.pos, links.length ? links : (w?.links || [key(kid.pos)]), toKey), segs = pts.slice(1).map((q, i) => px(pts[i].p, q.p)), len = segs.reduce((a, b) => a + b, 0);
    if (reduced || len < 1) { kid.pos = pts[pts.length - 1].p; putKids(); face(0); done?.(); return; }
    // 화면에서 너무 느리지 않게: 긴 길도 5초 안쪽
    const v = ms ? len / (ms / 1000) : Math.max(520, len / 5);
    kid.walk = { pts, i: 0, d: 0, links: links.length ? links : w?.links }; $kids.classList.add('walk'); K3.setWalking(true);
    let last = performance.now();
    const step = (now) => { if (!alive || !kid.walk) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; const W = kid.walk; W.d += v * dt;
      while (W.i < segs.length - 1 && W.d > segs[W.i]) { W.d -= segs[W.i]; W.i++; }
      const a = pts[W.i].p, b = pts[W.i + 1].p, t = Math.min(1, W.d / (segs[W.i] || 1));
      kid.pos = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; putKids(); face((b[0] - a[0]) * I.w, (b[1] - a[1]) * I.h);
      // 확대해 둔 상태면 지도가 아이들을 따라간다(손으로 끌면 멈춤)
      if (kid.follow) { const g = view(kid.pos[0], kid.pos[1], s / fit); tx += (g.tx - tx) * Math.min(1, dt * 3); ty += (g.ty - ty) * Math.min(1, dt * 3); clamp(); apply(); }
      if (W.i >= segs.length - 1 && t >= 1) { stopWalk(); face(0); done?.(); return; }
      kid.raf = requestAnimationFrame(step); };
    kid.raf = requestAnimationFrame(step); };

  const load = (intro) => {
    // 그림은 가로 한 장 — 폰은 「가로로 크게」(가로 전체 화면)로 본다(원장 2026-10-27 「가로 모달로 하면 되지」)
    kind = 'wide'; I = PARK.images[kind]; G = graph();
    $m.style.width = `${I.w}px`; $m.style.height = `${I.h}px`; place();
    fit = Math.min($v.clientWidth / I.w, $v.clientHeight / I.h);
    const st = PARK.start[kind], go = view(st[0], st[1], st[2]);
    stopWalk(); kid.pos = intro && !reduced ? PARK.walk.entrance[kind][0] : stand(kid.spot); putKids(); face(0); npcReset();
    if (!intro || reduced) { s = go.s; tx = go.tx; ty = go.ty; clamp(); apply(); showPins(); return; }
    // 시작: 전체 지도를 잠깐 보여 주고 → 두 아이가 입구에서 광장으로 걸어 들어오는 동안 지도가 광장 쪽으로 확대 → 표가 하나씩 떠오른다
    s = fit; tx = 0; ty = 0; clamp(); apply(); $pins.forEach((b) => b.classList.remove('show'));
    setTimeout(() => { if (!alive) return; kid.follow = false; fly(go, 2600, showPins); kid.spot = 'gate'; $pins.forEach((b) => b.classList.toggle('here', b.dataset.spot === 'gate')); walkTo(key(hub()), 2500, () => say(HELLO)); }, 900);
  };
  $img.onload = () => load(true);
  $img.src = PARK.images.wide.src;
  // 끌기·두 손가락 확대
  // 세로로 든 폰에서 「가로로 크게」는 지도 상자를 90° 돌려 그린다 → 손가락 좌표를 상자 안 좌표로 바꿔 쓴다(돌린 상자: 안쪽 x = 화면 y, 안쪽 y = 화면 폭 − 화면 x)
  let rot = false;
  const loc = (e) => { if (rot) return [e.clientY, innerWidth - e.clientX]; const r = $v.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const pts = new Map(); let moved = 0, pinch = 0;
  $v.addEventListener('pointerdown', (e) => { if (e.target.closest('.pm-ctrl, .pk-panel')) return; pts.set(e.pointerId, loc(e)); moved = 0; cancelAnimationFrame(anim); kid.follow = false; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  $v.addEventListener('pointermove', (e) => { const p = pts.get(e.pointerId); if (!p) return; const q = loc(e), dx = q[0] - p[0], dy = q[1] - p[1];
    if (pts.size === 1) { moved += Math.abs(dx) + Math.abs(dy); if (moved > 6) { $v.setPointerCapture?.(e.pointerId); tx += dx; ty += dy; clamp(); apply(); } }
    pts.set(e.pointerId, q);
    if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) zoomAt(d / pinch, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); pinch = d; moved = 99; } });
  const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => $v.addEventListener(t, up));
  $v.addEventListener('wheel', (e) => { if (!e.ctrlKey) return; e.preventDefault(); const q = loc(e); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, q[0], q[1]); }, { passive: false });
  $host.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => { const z = +b.dataset.z; kid.follow = false; if (!z) return fly({ s: fit, tx: 0, ty: 0 }, 700); zoomAt(z > 0 ? 1.4 : 1 / 1.4, $v.clientWidth / 2, $v.clientHeight / 2); }));
  // 표 → 그 자리의 관찰
  const open = (id) => {
    const p = PARK.spots.find((x) => x.id === id), S = p.set ? sets[p.set] : null, q = ASK[id] || [];
    $panel.hidden = false;
    $panel.innerHTML = `<div class="pk-talk"><p><b>${esc(q[0])}</b>${esc(q[1])}</p><p><b>${esc(q[2])}</b>${esc(q[3])}</p></div>
      <h3><i>${p.icon}</i>${esc(p.name)}${S ? `<small>${S.level === 'mid' ? '중등' : '초등'} · ${esc(S.title)}</small>` : '<small>대회 안내</small>'}</h3>
      ${S ? `<p class="pk-lead">${esc(S.lead)}</p><ol class="pk-steps">${S.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <div class="pk-go"><a class="pk-btn" href="#/observe/${S.id}">이 자리에서 관찰하기 →</a><span>표본 ${S.mod.SPECIMENS.length}종 · 3D 모형 · 실사 사진 · 예시 보고서</span></div>`
        : `<p class="pk-lead">대회 날은 주제와 장소를 그 자리에서 받아요. 아래 안내에서 누가 나가는지, 얼마나 걸리는지, 무엇을 내는지, 심사에서 무엇을 보는지 먼저 읽어요.</p>
        <div class="pk-go"><a class="pk-btn" href="#/contest/nature" data-guide>대회 안내 읽기 ↓</a></div>`}`;
    $panel.querySelector('[data-guide]')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('ct-guide')?.scrollIntoView({ behavior: 'smooth' }); });
    say(q);
    if (!big) $panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }); else $panel.scrollTop = 0;
  };
  const go = (id) => {
    $pins.forEach((b) => b.classList.toggle('on', b.dataset.spot === id)); $pins.forEach((b) => b.classList.remove('here'));
    kid.spot = id; kid.follow = s > fit * 1.15;
    walkTo(key(stand(id)), 0, () => { if (kid.spot === id) open(id); });
  };
  $pins.forEach((b) => b.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); return; } go(b.dataset.spot); }));
  // 「가로로 크게」: 지도 상자가 화면을 다 덮는다. 안드로이드 등은 전체 화면 + 가로 고정, 안 되는 기기(아이폰)에서 세로로 들고 있으면 상자를 90° 돌려 그린다.
  // 관찰 패널도 그 안으로 옮겨 겹쳐 띄운다(닫으면 제자리).
  let big = false, fsOn = false;
  const portrait = () => innerHeight > innerWidth;
  const setRot = () => { rot = big && portrait(); $v.classList.toggle('rot', rot); };
  const enterBig = async () => {
    if (big) return; big = true; $v.classList.add('big'); document.documentElement.classList.add('pm-lock'); $v.appendChild($panel); $panel.classList.add('in-big');
    let fs = false;
    try { if ($v.requestFullscreen && portrait()) { await $v.requestFullscreen({ navigationUI: 'hide' }); await screen.orientation.lock('landscape'); fs = true; } } catch (_) { if (document.fullscreenElement) await document.exitFullscreen().catch(() => {}); }
    // 고정했다는데 화면이 실제로 안 돌아간 기기 — 전체 화면에서는 상자를 돌릴 수 없으니(브라우저가 막음) 전체 화면을 풀고 돌려 그린다
    if (fs) { await new Promise((r) => setTimeout(r, 700)); if (portrait()) { fs = false; try { screen.orientation.unlock?.(); } catch (_) {} await document.exitFullscreen?.().catch(() => {}); } }
    if (!fs && !portrait() && $v.requestFullscreen) { try { await $v.requestFullscreen({ navigationUI: 'hide' }); fs = true; } catch (_) {} }
    fsOn = fs; setRot(); load(false);
  };
  const exitBig = () => {
    if (!big) return; big = false; rot = false; fsOn = false; $v.classList.remove('big', 'rot'); document.documentElement.classList.remove('pm-lock'); $panel.classList.remove('in-big'); $v.after($panel);
    try { screen.orientation?.unlock?.(); } catch (_) {}
    if (document.fullscreenElement === $v) document.exitFullscreen?.().catch(() => {});
    load(false);
  };
  $host.querySelector('[data-big]').addEventListener('click', enterBig);
  $host.querySelector('[data-close]').addEventListener('click', exitBig);
  // 전체 화면이 밖에서 풀리면(뒤로 가기·쓸어내리기) 같이 닫는다 — 전체 화면을 못 써 돌려 그린 경우는 해당 없음
  const onFs = () => { if (big && fsOn && !document.fullscreenElement) exitBig(); };
  document.addEventListener('fullscreenchange', onFs);
  $v.addEventListener('keydown', (e) => { if (e.key === 'Escape') exitBig(); });
  // 화면 크기가 바뀌면(폰 돌리기 등) 다시 맞춘다 — 걷던 아이들은 가던 자리에 바로 선다
  let rt = 0; const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { if (!I) return; setRot(); load(false); }, 150); };
  addEventListener('resize', onResize);
  return { destroy() { alive = false; cancelAnimationFrame(anim); stopWalk(); clearTimeout(kid.sayT); removeEventListener('resize', onResize); document.removeEventListener('fullscreenchange', onFs); document.documentElement.classList.remove('pm-lock'); cancelAnimationFrame(npcRaf); io?.disconnect(); cast.dispose(); } };
}
