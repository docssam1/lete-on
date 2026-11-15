// 그림 논증 판서(2과정 기하, 원장 2026-11-15 「2과정은 1과정보다 심화도 발달 단계도 높아진 거야 … 도형 문제는 논증이 제대로 그래픽으로 구현되어야 돼, 애니메이션처럼」).
// 1과정 판서(concept-board.js)는 「해 보니 그렇다」를 보여 주고, 2과정 논증 판서는 「왜 반드시 그런가」를 장면마다 주장 + 근거로 쌓는다.
//   - 그림은 진행값 k 하나의 순수 함수: proof.draw(f, k, p) — k = 장면 번호 + 그 장면 진행(0~1). 앞뒤로 가도, 움직임 줄이기여도 같은 그림.
//   - 오른쪽 「따져 보기」 칸에 지난 장면의 주장(line)과 근거(why)가 차례로 쌓인다(논증의 사슬).
//   - 「다른 모양으로」: 같은 논증을 다른 삼각형·다른 정다각형·다른 시각으로 다시 — 한 그림이 아니라 모든 경우에 맞는다는 것(일반화)을 눈으로 본다.
// 덱 안에서는 concept-board.js와 같은 약속: step(±1)이 장면을 넘기면 true, 끝이면 false.
export const C = {
  ink: "#26324a", soft: "#9aa6c4", paper: "#fffdf7", back: "#f3ead6", line: "#d9cfb8",
  red: "#e8503a", green: "#2f9e5f", blue: "#2f6fe0", purple: "#8e5bd8", orange: "#f39a1e", teal: "#1f9aa8",
  redSoft: "#ffe1dc", greenSoft: "#dcf5e5", blueSoft: "#dde9ff", purpleSoft: "#ece0fb", orangeSoft: "#ffe9cc",
};
// ── 기하 도구(화면 좌표, 각은 「수학 방향」: 오른쪽 0°, 시계 반대 +) ──
const R = Math.PI / 180;
export const P = (x, y) => ({ x, y });
export const add = (a, b) => P(a.x + b.x, a.y + b.y);
export const sub = (a, b) => P(a.x - b.x, a.y - b.y);
export const mul = (a, k) => P(a.x * k, a.y * k);
export const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
export const mid = (a, b) => lerp(a, b, 0.5);
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const dirDeg = (v, p) => Math.atan2(-(p.y - v.y), p.x - v.x) / R;
export const polar = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
export function rot(p, c, deg) {
  const dx = p.x - c.x, dy = -(p.y - c.y), cs = Math.cos(deg * R), sn = Math.sin(deg * R);
  return P(c.x + dx * cs - dy * sn, c.y - (dx * sn + dy * cs));
}
export function reflect(p, a, b) {
  const d = sub(b, a), len = Math.hypot(d.x, d.y), u = P(d.x / len, d.y / len);
  const k = (p.x - a.x) * u.x + (p.y - a.y) * u.y, foot = add(a, mul(u, k));
  return sub(mul(foot, 2), p);
}
// 종이 접기: 접는 선을 축으로 납작하게 넘어간다(t=1이면 거울에 비친 자리)
export const fold = (p, a, b, t) => lerp(p, reflect(p, a, b), t);
export function angleAt(v, p1, p2) {
  let d = Math.abs(dirDeg(v, p1) - dirDeg(v, p2)) % 360;
  return d > 180 ? 360 - d : d;
}
export const clamp = (t, a = 0, b = 1) => Math.max(a, Math.min(b, t));
export const ease = (t) => { t = clamp(t); return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; };
// k 안에서 장면 i의 진행(0~1), [a,b] 구간만 늘여 쓰기
export const phase = (k, i, a = 0, b = 1) => ease((clamp(k - i) - a) / (b - a));
const n1 = (v) => (Math.round(v * 10) / 10).toString();
const escText = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ── 그림 그리기(문자열을 모아 한 번에 넣는다) ──
let figN = 0;
export function figure() {
  const out = [];
  const uid = `pf${(figN += 1)}`;
  let clipN = 0;
  const st = ({ stroke = C.ink, w = 2.4, dash, opacity = 1, fill = "none", fillOpacity } = {}) =>
    `stroke="${stroke}" stroke-width="${w}" fill="${fill}"${fillOpacity != null ? ` fill-opacity="${fillOpacity}"` : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}${opacity < 1 ? ` opacity="${n1(Math.max(0, opacity))}"` : ""} stroke-linejoin="round" stroke-linecap="round"`;
  const drawn = (draw) => (draw != null && draw < 1 ? ` pathLength="1" stroke-dasharray="1" stroke-dashoffset="${n1(1 - draw)}"` : "");
  const f = {
    out,
    poly(pts, o = {}) {
      if (o.opacity === 0) return f;
      out.push(`<polygon points="${pts.map((p) => `${n1(p.x)},${n1(p.y)}`).join(" ")}" ${st({ fill: C.paper, ...o })}${drawn(o.draw)}/>`);
      return f;
    },
    path(pts, o = {}) {
      if (o.opacity === 0) return f;
      out.push(`<polyline points="${pts.map((p) => `${n1(p.x)},${n1(p.y)}`).join(" ")}" ${st(o)}${drawn(o.draw)}/>`);
      return f;
    },
    seg(a, b, o = {}) {
      if (o.opacity === 0) return f;
      const e = o.grow != null ? lerp(a, b, clamp(o.grow)) : b;
      out.push(`<line x1="${n1(a.x)}" y1="${n1(a.y)}" x2="${n1(e.x)}" y2="${n1(e.y)}" ${st(o)}/>`);
      return f;
    },
    circle(c, r, o = {}) {
      if (o.opacity === 0) return f;
      out.push(`<circle cx="${n1(c.x)}" cy="${n1(c.y)}" r="${n1(r)}" ${st(o)}${drawn(o.draw)}/>`);
      return f;
    },
    dot(p, { r = 4.5, fill = C.ink, opacity = 1 } = {}) {
      if (opacity <= 0) return f;
      out.push(`<circle cx="${n1(p.x)}" cy="${n1(p.y)}" r="${r}" fill="${fill}"${opacity < 1 ? ` opacity="${n1(opacity)}"` : ""}/>`);
      return f;
    },
    // 시작 방향(start°)에서 시계 반대로 span°만큼의 부채꼴
    wedge(v, start, span, { r = 34, color = C.red, fillOpacity = 0.3, w = 2, opacity = 1, label, labelR, size = 17, labelColor } = {}) {
      if (opacity <= 0 || span <= 0.05) return f;
      const s = polar(v, r, start), e = polar(v, r, start + span), big = span > 180 ? 1 : 0;
      out.push(`<path d="M${n1(v.x)} ${n1(v.y)} L${n1(s.x)} ${n1(s.y)} A${r} ${r} 0 ${big} 0 ${n1(e.x)} ${n1(e.y)} Z" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${w}"${opacity < 1 ? ` opacity="${n1(opacity)}"` : ""}/>`);
      if (label) f.label(polar(v, labelR || r + 17, start + span / 2), label, { color: labelColor || color, size, opacity });
      return f;
    },
    // 꼭짓점 v에서 p1, p2 쪽 두 변 사이의 작은 쪽 각
    arc(v, p1, p2, o = {}) {
      const a1 = dirDeg(v, p1), a2 = dirDeg(v, p2);
      let span = ((a2 - a1) % 360 + 360) % 360, start = a1;
      if (span > 180) { start = a2; span = 360 - span; }
      return f.wedge(v, start, span, o);
    },
    right(v, p1, p2, { size = 15, color = C.ink, opacity = 1 } = {}) {
      if (opacity <= 0) return f;
      const u1 = sub(p1, v), u2 = sub(p2, v), l1 = Math.hypot(u1.x, u1.y), l2 = Math.hypot(u2.x, u2.y);
      const a = add(v, mul(u1, size / l1)), b = add(v, mul(u2, size / l2)), c = add(a, mul(u2, size / l2));
      out.push(`<polyline points="${n1(a.x)},${n1(a.y)} ${n1(c.x)},${n1(c.y)} ${n1(b.x)},${n1(b.y)}" fill="none" stroke="${color}" stroke-width="1.8"${opacity < 1 ? ` opacity="${n1(opacity)}"` : ""}/>`);
      return f;
    },
    // 같은 길이 표시(눈금 n개)
    ticks(a, b, { n = 1, color = C.ink, opacity = 1, len = 9 } = {}) {
      if (opacity <= 0) return f;
      const m = mid(a, b), d = sub(b, a), l = Math.hypot(d.x, d.y), u = P(d.x / l, d.y / l), nrm = P(-u.y, u.x);
      for (let i = 0; i < n; i += 1) {
        const c = add(m, mul(u, (i - (n - 1) / 2) * 6));
        const p = add(c, mul(nrm, len)), q = sub(c, mul(nrm, len));
        out.push(`<line x1="${n1(p.x)}" y1="${n1(p.y)}" x2="${n1(q.x)}" y2="${n1(q.y)}" stroke="${color}" stroke-width="2.2"${opacity < 1 ? ` opacity="${n1(opacity)}"` : ""}/>`);
      }
      return f;
    },
    // 글자는 판서와 같은 손글씨(FC Hand, 원장 2026-11-15 「Manim보다 우리 손글씨 식이 낫지 않아?」). 손글씨 글꼴은 같은 크기에서 작아 보여 1.3배로 쓴다.
    // write(0~1)를 주면 펜이 왼쪽부터 써 나가듯 드러난다.
    label(p, text, { size = 17, color = C.ink, weight = 700, anchor = "middle", opacity = 1, halo = true, write, font = "hand" } = {}) {
      if (opacity <= 0 || write === 0) return f;
      const hand = font === "hand", fs = hand ? size * 1.3 : size;
      let clip = "";
      if (write != null && write < 1) {
        const w = String(text).length * fs * 0.62 + 8, x0 = anchor === "middle" ? p.x - w / 2 : anchor === "end" ? p.x - w : p.x - 4;
        const id = `${uid}c${(clipN += 1)}`;
        out.push(`<clipPath id="${id}"><rect x="${n1(x0)}" y="${n1(p.y - fs)}" width="${n1(w * clamp(write))}" height="${n1(fs * 2)}"/></clipPath>`);
        clip = ` clip-path="url(#${id})"`;
      }
      out.push(`<text x="${n1(p.x)}" y="${n1(p.y)}" text-anchor="${anchor}" dominant-baseline="central" font-size="${n1(fs)}" font-weight="${hand ? 400 : weight}"${hand ? ` class="pf-hand"` : ""} fill="${color}"${halo ? ` stroke="${C.paper}" stroke-width="${hand ? 5 : 4}" paint-order="stroke"` : ""}${opacity < 1 ? ` opacity="${n1(opacity)}"` : ""}${clip}>${escText(text)}</text>`);
      return f;
    },
    // ── 작도 도구(원장 2026-11-15 「유클리드 기하나 작도」) ──
    // 원호: 중심 c, 반지름 r, from°에서 to°까지(수학 방향). draw(0~1)만큼만 그린다 — 컴퍼스 연필 끝이 지나간 자리
    arcPath(c, r, from, to, o = {}) {
      if (o.opacity === 0) return f;
      const t = o.draw == null ? 1 : clamp(o.draw);
      if (t <= 0) return f;
      const end = from + (to - from) * t, n = Math.max(2, Math.ceil(Math.abs(end - from) / 3));
      const pts = []; for (let i = 0; i <= n; i += 1) pts.push(polar(c, r, from + ((end - from) * i) / n));
      out.push(`<polyline points="${pts.map((q) => `${n1(q.x)},${n1(q.y)}`).join(" ")}" ${st({ w: 2, ...o, fill: "none" })}/>`);
      return f;
    },
    // 컴퍼스: 바늘은 c, 연필 끝은 c에서 r만큼 deg° 방향. 두 다리 길이는 같고 손잡이는 위쪽으로 선다
    compass(c, r, deg, { opacity = 1, leg = 150 } = {}) {
      if (opacity <= 0) return f;
      const tip = polar(c, r, deg), m = mid(c, tip), half = Math.max(r / 2, 1);
      const L = Math.max(leg, half * 1.12), h = Math.sqrt(Math.max(L * L - half * half, 1));
      const u = P((tip.x - c.x) / (2 * half), (tip.y - c.y) / (2 * half));
      let nrm = P(u.y, -u.x); if (nrm.y > 0) nrm = P(-nrm.x, -nrm.y);
      if (m.y + nrm.y * h < 24) nrm = P(-nrm.x, -nrm.y);   // 위가 모자라면(종이 위쪽 막대를 잴 때) 손잡이를 아래로
      const hinge = add(m, mul(nrm, h)), top = add(hinge, mul(nrm, 22));
      const near = (a, b, d) => add(a, mul(sub(b, a), d / Math.max(dist(a, b), 1)));
      const pencil0 = near(tip, hinge, 34), lead = near(tip, hinge, 12);
      const op = opacity < 1 ? ` opacity="${n1(opacity)}"` : "";
      out.push(`<g class="pf-compass"${op}>`
        + `<line x1="${n1(hinge.x)}" y1="${n1(hinge.y)}" x2="${n1(c.x)}" y2="${n1(c.y)}" stroke="#7d8597" stroke-width="5" stroke-linecap="round"/>`
        + `<line x1="${n1(hinge.x)}" y1="${n1(hinge.y)}" x2="${n1(pencil0.x)}" y2="${n1(pencil0.y)}" stroke="#7d8597" stroke-width="5" stroke-linecap="round"/>`
        + `<line x1="${n1(pencil0.x)}" y1="${n1(pencil0.y)}" x2="${n1(lead.x)}" y2="${n1(lead.y)}" stroke="#f2b632" stroke-width="7" stroke-linecap="butt"/>`
        + `<line x1="${n1(lead.x)}" y1="${n1(lead.y)}" x2="${n1(tip.x)}" y2="${n1(tip.y)}" stroke="#3a3f4c" stroke-width="3" stroke-linecap="round"/>`
        + `<line x1="${n1(hinge.x)}" y1="${n1(hinge.y)}" x2="${n1(top.x)}" y2="${n1(top.y)}" stroke="#4b5366" stroke-width="7" stroke-linecap="round"/>`
        + `<circle cx="${n1(hinge.x)}" cy="${n1(hinge.y)}" r="6" fill="#4b5366"/>`
        + `<circle cx="${n1(c.x)}" cy="${n1(c.y)}" r="2.6" fill="#3a3f4c"/></g>`);
      return f;
    },
    // 자: a→b 직선 옆에 놓인 반투명 자(양쪽으로 margin만큼 더 길게). side 1 = a→b 진행 방향의 왼쪽(화면 위쪽)
    ruler(a, b, { opacity = 1, margin = 34, side = 1, width = 30 } = {}) {
      if (opacity <= 0) return f;
      const d = sub(b, a), l = Math.max(Math.hypot(d.x, d.y), 1), u = P(d.x / l, d.y / l);
      let nrm = P(u.y, -u.x); if (side < 0) nrm = P(-nrm.x, -nrm.y);
      const p0 = sub(a, mul(u, margin)), p1 = add(b, mul(u, margin));
      const q0 = add(p0, mul(nrm, 3)), q1 = add(p1, mul(nrm, 3)), q2 = add(p1, mul(nrm, 3 + width)), q3 = add(p0, mul(nrm, 3 + width));
      let marks = "";
      const total = l + margin * 2;
      for (let s = 0, i = 0; s <= total; s += 12, i += 1) {
        const m0 = add(q0, mul(u, s)), m1 = add(m0, mul(nrm, i % 5 === 0 ? 11 : 6));
        marks += `<line x1="${n1(m0.x)}" y1="${n1(m0.y)}" x2="${n1(m1.x)}" y2="${n1(m1.y)}" stroke="#7a6a3c" stroke-width="1.2"/>`;
      }
      out.push(`<g class="pf-ruler"${opacity < 1 ? ` opacity="${n1(opacity)}"` : ""}><polygon points="${[q0, q1, q2, q3].map((q) => `${n1(q.x)},${n1(q.y)}`).join(" ")}" fill="#f6e7b0" fill-opacity="0.78" stroke="#c9ad5c" stroke-width="1.5" stroke-linejoin="round"/>${marks}</g>`);
      return f;
    },
    // 그림 속 식 한 줄(아래쪽 흰 띠)
    note(p, text, { size = 20, color = C.ink, opacity = 1, anchor = "middle" } = {}) {
      return f.label(p, text, { size, color, opacity, anchor, weight: 800 });
    },
    raw(s) { out.push(s); return f; },
    svg() { return out.join(""); },
  };
  return f;
}

// ── 판서 띄우기 ──
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const val = (v, p) => (typeof v === "function" ? v(p) : v);
export function mountProof(host, proof, { deckNav = false, onStep = () => {}, onDone = () => {}, atEnd = false } = {}) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = proof.width || 640, H = proof.height || 440;
  const scenes = proof.scenes;
  let seed = 0, p = proof.params(seed), k = 0, cur = 0, run = 0, playing = false;
  host.innerHTML = `<div class="pf${deckNav ? " is-deck-nav" : ""}">
    <div class="pf-board">
      <div class="pf-figure"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(proof.title)}"><g data-pf-fig></g></svg></div>
      <aside class="pf-ledger" aria-label="따져 보기"><h3>따져 보기</h3><ol data-pf-ledger></ol></aside>
    </div>
    <p class="pf-say" data-pf-say aria-live="polite"></p>
    <div class="pf-ctl" role="group" aria-label="판서 조절">
      ${deckNav ? "" : `<button type="button" class="pf-btn" data-pf="prev">‹ 앞 장면</button><button type="button" class="pf-btn primary" data-pf="next">다음 장면 ›</button>`}
      <button type="button" class="pf-btn" data-pf="again">↺ 이 장면 다시</button>
      ${proof.vary ? `<button type="button" class="pf-btn" data-pf="vary">${esc(proof.vary)}</button>` : ""}
      <span class="pf-scene" data-pf-scene></span>
    </div>
  </div>`;
  const root = host.firstElementChild;
  const figEl = root.querySelector("[data-pf-fig]"), ledger = root.querySelector("[data-pf-ledger]");
  const sayEl = root.querySelector("[data-pf-say]"), sceneEl = root.querySelector("[data-pf-scene]");
  const draw = () => { const f = figure(); proof.draw(f, k, p); figEl.innerHTML = f.svg(); };
  function texts() {
    const s = scenes[cur];
    sayEl.innerHTML = esc(val(s.say, p));
    ledger.innerHTML = scenes.slice(0, cur + 1).map((x, i) => {
      const line = val(x.line, p), why = val(x.why, p);
      if (!line) return "";
      return `<li class="${i === cur ? "is-now" : ""}"><span class="pf-line">${esc(line)}</span>${why ? `<span class="pf-why"><b>까닭</b>${esc(why)}</span>` : ""}</li>`;
    }).join("");
    const now = ledger.querySelector(".is-now");
    if (now) now.scrollIntoView({ block: "nearest" });
    sceneEl.textContent = `장면 ${cur + 1} / ${scenes.length}`;
    const prev = root.querySelector('[data-pf="prev"]'), next = root.querySelector('[data-pf="next"]');
    if (prev) prev.disabled = cur === 0;
    if (next) next.textContent = cur >= scenes.length - 1 ? "처음부터 ↺" : "다음 장면 ›";
    queueMicrotask(() => onStep());
  }
  function play(i, { animate = !reduced } = {}) {
    cur = i; run += 1; texts();
    const my = run, from = i, to = i + 1, ms = (scenes[i].ms || 2200);
    if (!animate) { k = to; draw(); if (i === scenes.length - 1) onDone(); return; }
    playing = true;
    const t0 = performance.now();
    const tick = (now) => {
      if (my !== run) return;
      const t = Math.min(1, (now - t0) / ms);
      k = from + t; draw();
      if (t < 1) requestAnimationFrame(tick);
      else { playing = false; if (i === scenes.length - 1) onDone(); }
    };
    k = from; draw();
    requestAnimationFrame(tick);
  }
  function step(dir) {
    if (dir > 0) { if (cur >= scenes.length - 1) return false; play(cur + 1); return true; }
    if (cur <= 0) return false;
    play(cur - 1); return true;
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pf]");
    if (!b) return;
    const act = b.dataset.pf;
    if (act === "next") { if (!step(1)) play(0); }
    if (act === "prev") step(-1);
    if (act === "again") play(cur);
    if (act === "vary") { seed += 1; p = proof.params(seed); play(cur); }
  });
  root.addEventListener("keydown", (e) => {
    if (deckNav) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); if (!step(1)) play(0); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); step(-1); }
  });
  if (atEnd) play(scenes.length - 1, { animate: false }); else play(0);
  return { step, hasNext: () => cur < scenes.length - 1, hasPrev: () => cur > 0, dispose() { run += 1; }, get playing() { return playing; } };
}
