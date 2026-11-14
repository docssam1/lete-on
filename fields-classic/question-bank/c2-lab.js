// 2과정 기하 체험(원장 2026-11-14 「기하는 어떻게 개념을 전달할지 · 게임은 필요 없잖아 체험형은 필요하고」).
// 점수·단계·시간 없이 아이가 직접 끌고 돌려 보고 결과만 보는 화면. 「맞았다/틀렸다」를 띄우지 않는다.
// 주소: c2-lab.html?tool=angles|clock|dots  (덱 안에 넣을 때 &embed=1 — 머리줄을 뺀다)
//   angles — 각 떼어 모으기: 삼각형(사각형) 꼭짓점을 끌어 모양을 바꾸고, 「각 모으기」로 각 조각을 한 점에 모은다(G1 3단원 · G2·G3·G4·G5 각)
//   clock  — 시계 바늘 각: 분침을 끌면 시침도 조금씩 따라 돌고, 두 바늘 사이 작은 쪽 각이 칠해진다(G1·G2·G3 시계)
//   dots   — 점판 위 정사각형: 한 꼭짓점을 끌면 기울어진 정사각형이 따라오고, 바깥 정사각형에서 삼각형 4개를 빼 넓이를 본다(G1 4단원 · G2)
// 그림 색은 워밍업 그림 색표(빨강 #e8503a · 초록 #2f9e5f · 파랑 #2f6fe0 · 보라 #8e5bd8 · 주황 #f39a1e), 화면 틀은 파란 결.
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const R = Math.PI / 180;
const C = { red: "#e8503a", green: "#2f9e5f", blue: "#2f6fe0", purple: "#8e5bd8", orange: "#f39a1e", ink: "#222", soft: "#c9bda2",
  redSoft: "#ffe1dc", greenSoft: "#dcf5e5", blueSoft: "#dde9ff", purpleSoft: "#ece0fb", orangeSoft: "#ffe9cc", paper: "#fffdf7" };
const WEDGE = [[C.red, C.redSoft], [C.green, C.greenSoft], [C.blue, C.blueSoft], [C.purple, C.purpleSoft]];
const f = (n) => (Math.round(n * 10) / 10).toString();
const el = (name, attrs = {}, parent) => {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
};
const textEl = (parent, x, y, value, { size = 15, weight = 700, fill = C.ink, anchor = "middle" } = {}) => {
  const t = el("text", { x: f(x), y: f(y), "text-anchor": anchor, "dominant-baseline": "central", style: `font-size:${size}px;font-weight:${weight};fill:${fill}` }, parent);
  t.textContent = value;
  return t;
};
// 화면 좌표 ↔ SVG 좌표
function svgPoint(svg, event) {
  const p = svg.createSVGPoint();
  p.x = event.clientX; p.y = event.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}
// 끌 수 있는 손잡이(마우스·손가락·키보드 화살표)
function draggable(svg, handle, { onMove, step = 6, getPos, keys = true }) {
  let dragging = false;
  handle.setAttribute("tabindex", "0");
  handle.style.cursor = "grab";
  handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); handle.style.cursor = "grabbing"; e.preventDefault(); });
  handle.addEventListener("pointermove", (e) => { if (dragging) onMove(svgPoint(svg, e)); });
  const stop = () => { dragging = false; handle.style.cursor = "grab"; };
  handle.addEventListener("pointerup", stop);
  handle.addEventListener("pointercancel", stop);
  if (keys) handle.addEventListener("keydown", (e) => {
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    const p = getPos();
    onMove({ x: p.x + d[0], y: p.y + d[1] });
  });
}
const say = (value) => { $("note").textContent = value; };

// ── 각 떼어 모으기 ─────────────────────────────────────────────
function anglesTool(stage) {
  const W = 640, H = 520;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "lab-svg", role: "img", "aria-label": "각 떼어 모으기" }, stage);
  const shapes = {
    3: [{ x: 150, y: 250 }, { x: 470, y: 270 }, { x: 260, y: 60 }],
    4: [{ x: 120, y: 250 }, { x: 430, y: 280 }, { x: 500, y: 90 }, { x: 210, y: 60 }],
  };
  let n = 3, pts = shapes[3].map((p) => ({ ...p })), gathered = false, anim = 0;
  const layer = el("g", {}, svg), wedgeLayer = el("g", {}, svg), handleLayer = el("g", {}, svg);
  const G = { x: 320, y: 380 };
  // 각 꼭짓점의 안쪽 각: 시작 방향(화면 각, 시계 반대가 +)과 크기
  function interior() {
    const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % n]; return s + (p.x * q.y - q.x * p.y); }, 0);
    const ccwOnScreen = area < 0;   // SVG는 y가 아래라 넓이 부호가 뒤집힌다
    return pts.map((v, i) => {
      const prev = pts[(i + n - 1) % n], next = pts[(i + 1) % n];
      const a1 = Math.atan2(-(next.y - v.y), next.x - v.x) / R, a2 = Math.atan2(-(prev.y - v.y), prev.x - v.x) / R;
      let start = ccwOnScreen ? a1 : a2, end = ccwOnScreen ? a2 : a1;
      let span = ((end - start) % 360 + 360) % 360;
      return { v, start, span };
    });
  }
  const wedgePath = (cx, cy, r, start, span) => {
    const s = { x: cx + r * Math.cos(start * R), y: cy - r * Math.sin(start * R) }, e = { x: cx + r * Math.cos((start + span) * R), y: cy - r * Math.sin((start + span) * R) };
    return `M${f(cx)} ${f(cy)} L${f(s.x)} ${f(s.y)} A${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f(e.x)} ${f(e.y)} Z`;
  };
  function draw(t = gathered ? 1 : 0) {
    layer.innerHTML = ""; wedgeLayer.innerHTML = "";
    el("line", { x1: 40, y1: G.y, x2: W - 40, y2: G.y, stroke: C.soft, "stroke-width": 2, "stroke-dasharray": "6 6" }, layer);
    el("polygon", { points: pts.map((p) => `${f(p.x)},${f(p.y)}`).join(" "), fill: C.paper, stroke: C.ink, "stroke-width": 2.4, "stroke-linejoin": "round" }, layer);
    const angs = interior();
    let acc = 0;
    const total = angs.reduce((s, a) => s + a.span, 0);
    angs.forEach((a, i) => {
      const [stroke, fill] = WEDGE[i];
      const r = 46;
      // 제자리 조각(흐리게)
      el("path", { d: wedgePath(a.v.x, a.v.y, r, a.start, a.span), fill, stroke, "stroke-width": 1.4, opacity: t > 0 ? 0.35 : 1 }, wedgeLayer);
      // 움직이는 조각: 제자리 → 모으는 점 G에서 acc부터 이어 붙임
      const turn = (((acc - a.start) % 360) + 540) % 360 - 180;   // 가장 가까운 쪽으로 돌린다
      const cx = a.v.x + (G.x - a.v.x) * t, cy = a.v.y + (G.y - a.v.y) * t, start = a.start + turn * t;
      if (t > 0) el("path", { d: wedgePath(cx, cy, r + 8, start, a.span), fill, stroke, "stroke-width": 2 }, wedgeLayer);
      const mid = (t > 0 ? start : a.start) + a.span / 2, lx = (t > 0 ? cx : a.v.x) + (t > 0 ? 72 : 66) * Math.cos(mid * R), ly = (t > 0 ? cy : a.v.y) - (t > 0 ? 72 : 66) * Math.sin(mid * R);
      textEl(wedgeLayer, lx, ly, `${Math.round(a.span)}°`, { size: 18, fill: stroke });
      acc += a.span;
    });
    if (t >= 1) {
      el("circle", { cx: G.x, cy: G.y, r: 4, fill: C.ink }, wedgeLayer);
      textEl(wedgeLayer, G.x, H - 22, n === 3 ? `모두 모으면 ${Math.round(total)}° — 반 바퀴, 곧은 선` : `모두 모으면 ${Math.round(total)}° — 한 바퀴`, { size: 20, fill: C.ink });
    }
    handleLayer.querySelectorAll("circle").forEach((h, i) => { h.setAttribute("cx", f(pts[i].x)); h.setAttribute("cy", f(pts[i].y)); });
  }
  function handles() {
    handleLayer.innerHTML = "";
    pts.forEach((p, i) => {
      const h = el("circle", { r: 13, fill: "#fff", stroke: WEDGE[i][0], "stroke-width": 3, "aria-label": `꼭짓점 ${i + 1} 옮기기` }, handleLayer);
      draggable(svg, h, { getPos: () => pts[i], onMove: (q) => {
        pts[i] = { x: Math.max(30, Math.min(W - 30, q.x)), y: Math.max(30, Math.min(G.y - 70, q.y)) };
        if (gathered) { gathered = false; setButton(); }
        draw(0);
      } });
    });
  }
  function run(to) {
    cancelAnimationFrame(anim);
    const from = gathered ? 1 : 0;
    gathered = to === 1;
    setButton();
    if (reduce) { draw(to); return; }
    const t0 = performance.now(), dur = 1100;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      draw(from + (to - from) * e);
      if (k < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  }
  const setButton = () => {
    $("act").textContent = gathered ? "제자리로" : "각 모으기";
    if (gathered) say(n === 3 ? "세 각이 모여 곧은 선이 되었어요. 꼭짓점을 옮겨 다른 삼각형으로도 해 봐요." : "네 각이 모여 한 바퀴가 되었어요. 사각형을 삼각형 두 개로 나누어 생각해 봐요.");
  };
  $("controls").innerHTML = `<div class="lab-seg" role="group" aria-label="도형 고르기"><button type="button" data-n="3" aria-pressed="true">삼각형</button><button type="button" data-n="4" aria-pressed="false">사각형</button></div><button type="button" id="act" class="lab-btn primary">각 모으기</button>`;
  $("controls").querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", () => {
    n = Number(b.dataset.n); pts = shapes[n].map((p) => ({ ...p })); gathered = false; setButton();
    $("controls").querySelectorAll("[data-n]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    handles(); draw(0);
    say(n === 3 ? "꼭짓점을 끌어 삼각형 모양을 바꿔 보고, 「각 모으기」를 눌러 세 각을 한 점에 모아 봐요." : "사각형도 해 봐요. 네 각을 모으면 어떻게 될까요?");
  }));
  $("act").addEventListener("click", () => run(gathered ? 0 : 1));
  handles(); draw(0);
  say("꼭짓점을 끌어 삼각형 모양을 바꿔 보고, 「각 모으기」를 눌러 세 각을 한 점에 모아 봐요.");
}

// ── 시계 바늘 각 ───────────────────────────────────────────────
function clockTool(stage) {
  const S = 400, c = { x: 200, y: 200 }, R0 = 160;
  const svg = el("svg", { viewBox: `0 0 ${S} ${S}`, class: "lab-svg lab-square", role: "img", "aria-label": "시계" }, stage);
  let total = 4 * 60 + 20;   // 0~719분(12시간), 끌 때는 이어서 센다
  el("circle", { cx: c.x, cy: c.y, r: R0 + 12, fill: "#fff", stroke: C.ink, "stroke-width": 3 }, svg);
  for (let i = 0; i < 60; i += 1) {
    const a = (90 - i * 6) * R, big = i % 5 === 0, r1 = R0 + 4, r2 = big ? R0 - 12 : R0 - 4;
    el("line", { x1: f(c.x + r1 * Math.cos(a)), y1: f(c.y - r1 * Math.sin(a)), x2: f(c.x + r2 * Math.cos(a)), y2: f(c.y - r2 * Math.sin(a)), stroke: C.ink, "stroke-width": big ? 3 : 1.2 }, svg);
    if (big) textEl(svg, c.x + (R0 - 32) * Math.cos(a), c.y - (R0 - 32) * Math.sin(a), String(i / 5 || 12), { size: 20 });
  }
  const sector = el("path", { fill: C.orangeSoft, stroke: C.orange, "stroke-width": 1.5, opacity: 0.85 }, svg);
  const label = textEl(svg, c.x, c.y, "", { size: 16, fill: "#c56a00" });
  const hour = el("line", { stroke: C.ink, "stroke-width": 9, "stroke-linecap": "round" }, svg);
  const minute = el("line", { stroke: C.blue, "stroke-width": 5, "stroke-linecap": "round" }, svg);
  el("circle", { cx: c.x, cy: c.y, r: 7, fill: C.ink }, svg);
  const knob = el("circle", { r: 14, fill: "#fff", stroke: C.blue, "stroke-width": 3, "aria-label": "분침 돌리기" }, svg);
  const handAngle = (deg) => (90 - deg) * R;   // 12시 = 0°, 시계 방향
  function draw() {
    const m = ((total % 60) + 60) % 60, h = (((total / 60) % 12) + 12) % 12;
    const ma = m * 6, ha = h * 30;
    const mp = { x: c.x + (R0 - 18) * Math.cos(handAngle(ma)), y: c.y - (R0 - 18) * Math.sin(handAngle(ma)) };
    const hp = { x: c.x + (R0 - 70) * Math.cos(handAngle(ha)), y: c.y - (R0 - 70) * Math.sin(handAngle(ha)) };
    minute.setAttribute("x1", c.x); minute.setAttribute("y1", c.y); minute.setAttribute("x2", f(mp.x)); minute.setAttribute("y2", f(mp.y));
    hour.setAttribute("x1", c.x); hour.setAttribute("y1", c.y); hour.setAttribute("x2", f(hp.x)); hour.setAttribute("y2", f(hp.y));
    knob.setAttribute("cx", f(mp.x)); knob.setAttribute("cy", f(mp.y));
    let diff = ((ma - ha) % 360 + 360) % 360;
    let from = ha, span = diff;
    if (diff > 180) { from = ma; span = 360 - diff; }
    const r = 62, s = handAngle(from), e = handAngle(from + span);
    sector.setAttribute("d", span < 0.01 ? "" : `M${c.x} ${c.y} L${f(c.x + r * Math.cos(s))} ${f(c.y - r * Math.sin(s))} A${r} ${r} 0 0 1 ${f(c.x + r * Math.cos(e))} ${f(c.y - r * Math.sin(e))} Z`);
    const mid = handAngle(from + span / 2);
    label.setAttribute("x", f(c.x + 88 * Math.cos(mid))); label.setAttribute("y", f(c.y - 88 * Math.sin(mid)));
    label.textContent = `${Math.round(span * 10) / 10}°`;
    const hh = Math.floor(h) || 12, mm = Math.round(m);
    $("readout").innerHTML = `<b>${hh}시 ${mm}분</b><span>분침 ${f(ma)}° · 시침 ${f(ha)}° · 두 바늘 사이 ${Math.round(span * 10) / 10}°</span>`;
  }
  draggable(svg, knob, { keys: false, getPos: () => ({ x: Number(knob.getAttribute("cx")), y: Number(knob.getAttribute("cy")) }), onMove: (p) => {
    const deg = ((90 - Math.atan2(-(p.y - c.y), p.x - c.x) / R) % 360 + 360) % 360;   // 12시에서 시계 방향
    const cur = ((total % 60) + 60) % 60 * 6;
    let d = deg - cur;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    total = ((total + d / 6) % 720 + 720) % 720;
    draw();
  } });
  knob.addEventListener("keydown", (e) => { const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (d) { e.preventDefault(); total = ((Math.round(total) + d) % 720 + 720) % 720; draw(); } });
  $("controls").innerHTML = `<button type="button" class="lab-btn" data-step="-60">1시간 전</button><button type="button" class="lab-btn" data-step="-5">5분 전</button><button type="button" class="lab-btn" data-step="5">5분 뒤</button><button type="button" class="lab-btn" data-step="60">1시간 뒤</button><button type="button" class="lab-btn" data-step="round">정각으로</button><p id="readout" class="lab-readout" aria-live="polite"></p>`;
  $("controls").querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    total = b.dataset.step === "round" ? Math.round(total / 60) * 60 % 720 : ((Math.round(total) + Number(b.dataset.step)) % 720 + 720) % 720;
    draw();
  }));
  draw();
  say("파란 분침 끝을 끌어 돌려 봐요. 분침이 한 바퀴 돌 때 시침은 어디까지 움직이나요? 두 바늘 사이 작은 쪽 각이 칠해져요.");
}

// ── 점판 위 정사각형 ─────────────────────────────────────────────
function dotsTool(stage) {
  const N = 8, gap = 48, ox = 40, oy = 40, W = ox * 2 + gap * (N - 1);
  const svg = el("svg", { viewBox: `0 0 ${W} ${W}`, class: "lab-svg lab-square", role: "img", "aria-label": "점판 위 정사각형" }, stage);
  const P0 = { i: 2, j: 1 };   // 왼쪽 아래 꼭짓점(점판 칸 번호, j는 아래에서 위로)
  let v = { a: 3, b: 2 };      // P0 → P1 (오른쪽 a칸, 위로 b칸)
  const toXY = (i, j) => ({ x: ox + i * gap, y: oy + (N - 1 - j) * gap });
  const layer = el("g", {}, svg);
  for (let i = 0; i < N; i += 1) for (let j = 0; j < N; j += 1) { const p = toXY(i, j); el("circle", { cx: p.x, cy: p.y, r: 4, fill: "#9aa6c4" }, svg); }
  const top = el("g", {}, svg);
  const knob = el("circle", { r: 14, fill: "#fff", stroke: C.purple, "stroke-width": 3, "aria-label": "꼭짓점 옮기기" }, svg);
  let showSplit = true;
  function corners() {
    const { a, b } = v;
    return [[P0.i, P0.j], [P0.i + a, P0.j + b], [P0.i + a - b, P0.j + b + a], [P0.i - b, P0.j + a]];
  }
  const fits = (cs) => cs.every(([i, j]) => i >= 0 && j >= 0 && i < N && j < N);
  function draw() {
    layer.innerHTML = ""; top.innerHTML = "";
    const cs = corners(), xy = cs.map(([i, j]) => toXY(i, j));
    const a = Math.abs(v.a), b = Math.abs(v.b), side = a + b;
    if (showSplit && b > 0 && a > 0) {
      const is = cs.map((c) => c[0]), js = cs.map((c) => c[1]);
      const minI = Math.min(...is), maxI = Math.max(...is), minJ = Math.min(...js), maxJ = Math.max(...js);
      const bb = [toXY(minI, minJ), toXY(maxI, minJ), toXY(maxI, maxJ), toXY(minI, maxJ)];
      el("polygon", { points: bb.map((p) => `${p.x},${p.y}`).join(" "), fill: C.orangeSoft, stroke: C.orange, "stroke-width": 2, "stroke-dasharray": "6 5" }, layer);
    }
    el("polygon", { points: xy.map((p) => `${p.x},${p.y}`).join(" "), fill: C.purpleSoft, stroke: C.purple, "stroke-width": 3, "stroke-linejoin": "round" }, layer);
    xy.forEach((p) => el("circle", { cx: p.x, cy: p.y, r: 6, fill: C.purple }, top));
    knob.setAttribute("cx", xy[1].x); knob.setAttribute("cy", xy[1].y);
    const area = a * a + b * b;
    $("readout").innerHTML = b === 0 || a === 0
      ? `<b>똑바로 선 정사각형</b><span>한 변 ${a + b}칸 → 넓이 ${area}칸</span>`
      : `<b>기울어진 정사각형</b><span>바깥 정사각형 ${side}×${side} = ${side * side}칸에서 주황 삼각형 4개(각 ${a}×${b}÷2)를 빼면 ${side * side} − ${2 * a * b} = <strong>${area}칸</strong></span>`;
  }
  draggable(svg, knob, { step: gap, getPos: () => ({ x: Number(knob.getAttribute("cx")), y: Number(knob.getAttribute("cy")) }), onMove: (p) => {
    const i = Math.round((p.x - ox) / gap), j = N - 1 - Math.round((p.y - oy) / gap);
    const nv = { a: i - P0.i, b: j - P0.j };
    if (nv.a < 1 || nv.b < 0) return;   // 오른쪽·위쪽으로만(같은 정사각형을 두 번 세지 않게)
    const save = v; v = nv;
    if (!fits(corners())) { v = save; return; }
    draw();
  } });
  $("controls").innerHTML = `<label class="lab-check"><input type="checkbox" id="split" checked> 바깥 정사각형 보기</label><p id="readout" class="lab-readout" aria-live="polite"></p>`;
  $("split").addEventListener("change", (e) => { showSplit = e.target.checked; draw(); });
  draw();
  say("보라 꼭짓점을 점에서 점으로 끌어 봐요. 정사각형이 기울어져도 네 변의 길이는 같아요. 넓이는 몇 칸일까요?");
}

const TOOLS = {
  angles: { title: "각 떼어 모으기", run: anglesTool },
  clock: { title: "시계 바늘 각", run: clockTool },
  dots: { title: "점판 위 정사각형", run: dotsTool },
};
const tool = TOOLS[params.get("tool")] ? params.get("tool") : "angles";
if (params.get("embed") === "1") document.body.classList.add("is-embed");
document.title = `${TOOLS[tool].title} · 체험`;
$("tabs").innerHTML = Object.entries(TOOLS).map(([id, t]) => `<a href="?${new URLSearchParams({ ...Object.fromEntries(params), tool: id })}" ${id === tool ? 'aria-current="page"' : ""}>${t.title}</a>`).join("");
$("title").textContent = TOOLS[tool].title;
TOOLS[tool].run($("stage"));
