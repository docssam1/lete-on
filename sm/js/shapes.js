// A1-2 1단원(도형 마을)·2단원(입체도형) 평면 부품 — 원본 8~50쪽 활동을 화면으로.
//  도형 그림, 점 이어 도형 만들기, 여럿 고르기, 규칙대로 색칠, 마을(칸)로 보내기, 겹친 도형 그림자, 동그라미 그리기.
//  독쌤 말은 정해진 문장만(바뀌는 수·이름을 넣지 않음) → 모두 독쌤 목소리로 미리 만든다.
import { scene, onHit, esc } from "./numbers.js?v=20261117a";

const sleep = (ctx, ms) => ctx.wait(ms);
const svgEl = (tag, attrs = {}) => { const el = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); return el; };
const shake = (el) => { el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no"); };

// ── 도형 그림: kind = circle | tri | rtri | rect | square | trap | para | rhombus | kite | poly(pts) ──
//  (x, y) 가운데, s 크기(대략 지름), rot 도, 꼭짓점 목록을 돌려주는 shapePts도 함께
export function shapePts(kind, x, y, s, rot = 0) {
  const h = s / 2;
  const P = {
    tri: [[0, -h], [h * 0.95, h * 0.72], [-h * 0.95, h * 0.72]],
    rtri: [[-h * 0.8, -h], [-h * 0.8, h * 0.8], [h * 0.9, h * 0.8]],
    rect: [[-h, -h * 0.6], [h, -h * 0.6], [h, h * 0.6], [-h, h * 0.6]],
    square: [[-h * 0.8, -h * 0.8], [h * 0.8, -h * 0.8], [h * 0.8, h * 0.8], [-h * 0.8, h * 0.8]],
    tall: [[-h * 0.42, -h], [h * 0.42, -h], [h * 0.42, h], [-h * 0.42, h]],
    trap: [[-h * 0.55, -h * 0.6], [h * 0.55, -h * 0.6], [h, h * 0.6], [-h, h * 0.6]],
    para: [[-h * 0.5, -h * 0.55], [h, -h * 0.55], [h * 0.5, h * 0.55], [-h, h * 0.55]],
    rhombus: [[0, -h * 0.62], [h, 0], [0, h * 0.62], [-h, 0]],
    kite: [[0, -h], [h * 0.6, -h * 0.1], [0, h], [-h * 0.6, -h * 0.1]],
    flat: [[-h, -h * 0.25], [0, -h * 0.75], [h, -h * 0.25], [-h * 0.0, h * 0.0]]
  }[kind];
  if (!P) return null;
  const a = rot * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  return P.map(([px, py]) => [x + px * c - py * sn, y + px * sn + py * c]);
}
export function shape(kind, x, y, s, { fill = "#7fb2e8", stroke = "rgba(0,0,0,.18)", sw = 2, rot = 0, face = false, cls = "", attrs = "" } = {}) {
  let body;
  if (kind === "circle") body = `<circle cx="${x}" cy="${y}" r="${s / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  else if (kind === "oval") body = `<ellipse cx="${x}" cy="${y}" rx="${s / 2}" ry="${s / 3}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(${rot} ${x} ${y})"/>`;
  else if (kind === "semi") { const r = s / 2; body = `<path d="M${x - r} ${y + r * 0.3} A${r} ${r} 0 0 1 ${x + r} ${y + r * 0.3}Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(${rot} ${x} ${y})"/>`; }
  else body = `<polygon points="${shapePts(kind, x, y, s, rot).map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const f = face ? `<circle cx="${x - s * 0.12}" cy="${y - s * 0.02}" r="${s * 0.035}" fill="#25324a"/><circle cx="${x + s * 0.12}" cy="${y - s * 0.02}" r="${s * 0.035}" fill="#25324a"/><path d="M${x - s * 0.1} ${y + s * 0.1} q${s * 0.1} ${s * 0.09} ${s * 0.2} 0" stroke="#25324a" stroke-width="${Math.max(2, s * 0.025)}" fill="none" stroke-linecap="round"/>` : "";
  return `<g class="${cls}" ${attrs}>${body}${f}</g>`;
}
// 도형 친구(팔다리 달린 도형, 원본 9~13쪽처럼)
export function shapeFriend(kind, x, y, s, fill, rot = 0) {
  const leg = (dx) => `<path d="M${x + dx} ${y + s * 0.38} l${dx * 0.3} ${s * 0.42}" stroke="#25324a" stroke-width="2.5"/><ellipse cx="${x + dx * 1.3}" cy="${y + s * 0.82}" rx="${s * 0.07}" ry="${s * 0.035}" fill="#25324a"/>`;
  const arm = (dx) => `<path d="M${x + dx * 0.45} ${y} l${dx * 0.5} ${-s * 0.12}" stroke="#25324a" stroke-width="2.5"/><circle cx="${x + dx * 0.95}" cy="${y - s * 0.12}" r="${s * 0.035}" fill="#25324a"/>`;
  return `<g>${leg(-s * 0.18)}${leg(s * 0.18)}${arm(-s)}${arm(s)}${shape(kind, x, y, s, { fill, rot, face: true, stroke: "rgba(0,0,0,.12)" })}</g>`;
}
// 도형 이름(독쌤 말과 화면 이름 — 원본 12쪽 「동그라미·세모·네모」)
export const FAMILY = { circle: "round", oval: "round", semi: "round", tri: "tri", rtri: "tri", rect: "quad", square: "quad", tall: "quad", trap: "quad", para: "quad", rhombus: "quad", kite: "quad" };

// ── 여럿 고르기(원본 16·18·24·25·40·48쪽 「모두 ○표」): 고른 것을 다시 누르면 취소, 「다 골랐어요」로 확인 ──
//  items: [{value, art, name}], answer: 고를 값 목록
export async function chooseAll(ctx, items, answer, { host = ctx.dock, say = null, wrongSay = "다시 볼까요? 빠진 것이나 아닌 것이 있어요.", hint = null } = {}) {
  host.innerHTML = `<div class="col"><div class="sm-tray ${items.length > 6 ? "compact" : ""}" data-c>${items.map((c) => `<button class="sm-pick" type="button" data-value="${esc(c.value)}" aria-pressed="false"><span class="art" aria-hidden="true">${c.art || ""}</span>${c.name ? `<span class="name">${esc(c.name)}</span>` : ""}</button>`).join("")}</div>
    <button class="sm-btn go big" type="button" data-ok><span class="ico">✔</span> 다 골랐어요</button></div>`;
  if (say) ctx.guide.say(say);
  const want = new Set(answer.map(String)); let wrong = 0;
  await new Promise((resolve) => {
    host.addEventListener("click", function onClick(e) {
      const b = e.target.closest(".sm-pick");
      if (b && !b.disabled) { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("is-on", on); ctx.fx.sound[on ? "pop" : "tap"](); return; }
      if (!e.target.closest("[data-ok]")) return;
      const got = new Set([...host.querySelectorAll('.sm-pick[aria-pressed="true"]')].map((x) => x.dataset.value));
      const ok = got.size === want.size && [...want].every((v) => got.has(v));
      if (ok) { host.removeEventListener("click", onClick); host.querySelectorAll(".sm-pick").forEach((x) => { x.disabled = true; if (want.has(x.dataset.value)) x.classList.add("is-right"); }); ctx.fx.cheer(host.querySelector("[data-ok]")); resolve(); return; }
      wrong++; ctx.mistake(); ctx.fx.sound.bad();
      if (wrong >= 2 && hint) hint(wrong); else ctx.guide.encourage(wrongSay);
      if (wrong >= 3) host.querySelectorAll(".sm-pick").forEach((x) => { if (want.has(x.dataset.value) && x.getAttribute("aria-pressed") !== "true") x.classList.add("nm-glow-btn"); });
    });
  });
}

// ── 점 이어 도형 만들기(원본 14·22·23쪽) ──
//  dots: [{x, y, mark?}], 점을 차례로 눌러 잇고 처음 점을 다시 누르면 닫힌다. check(idx목록) → true면 인정
//  goals: [{ n: 3|4, ok: (idx[]) => bool, say }] 차례로 만든다.
export async function dotShapes(ctx, svg, dots, goals, { color = "#e8417f", markArt = null } = {}) {
  const g = svgEl("g", { class: "ds" }); svg.append(g);
  const lines = svgEl("g"); g.append(lines);
  const dotG = svgEl("g"); g.append(dotG);
  dots.forEach((d, i) => { const el = svgEl("g", { class: "nm-hit ds-dot", "data-i": i }); el.innerHTML = `<circle cx="${d.x}" cy="${d.y}" r="26" fill="transparent"/>${markArt ? markArt(d) : `<circle cx="${d.x}" cy="${d.y}" r="9" fill="${d.color || "#25324a"}"/>`}`; dotG.append(el); });
  const done = [];
  for (const goal of goals) {
    if (goal.say) ctx.guide.say(goal.say);
    g.__goal = goal;   // 점검 도구가 알맞은 점을 찾을 때 씀(화면에는 영향 없음)
    let path = [];
    const live = svgEl("polyline", { fill: "none", stroke: color, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }); lines.append(live);
    const draw = () => live.setAttribute("points", path.map((i) => `${dots[i].x},${dots[i].y}`).join(" "));
    await new Promise((resolve) => {
      const off = onHit(g, ".ds-dot", (el) => {
        const i = Number(el.dataset.i);
        if (path.length >= 3 && i === path[0]) {
          if (path.length === goal.n && goal.ok(path)) {
            off(); live.remove(); const poly = svgEl("polygon", { points: path.map((k) => `${dots[k].x},${dots[k].y}`).join(" "), fill: goal.fill || "rgba(232,65,127,.18)", stroke: goal.stroke || color, "stroke-width": 6, "stroke-linejoin": "round" }); lines.append(poly);
            done.push([...path]); ctx.fx.sound.good(); ctx.fx.burstAt(el, { power: 0.8 }); resolve(); return;
          }
          ctx.mistake(); ctx.fx.sound.bad(); ctx.guide.encourage(goal.wrong || "다시 해 볼까요? 알맞은 점을 이어요."); path = []; draw(); return;
        }
        if (path.includes(i)) return;
        if (path.length >= goal.n) { ctx.fx.sound.bad(); ctx.guide.encourage("처음 점을 누르면 도형이 닫혀요."); return; }
        path.push(i); draw(); ctx.fx.sound.tap(); el.querySelector("circle:last-child")?.setAttribute("r", "12");
      });
    });
  }
  g.__goal = null;
  return done;
}

// ── 규칙대로 색칠(원본 14·19·45쪽): palette에서 색을 고르고 도형을 누른다 ──
//  items: [{el 선택자 data-k, want: 색 키}], palette: [{key, color, name}]
export async function paintByRule(ctx, svg, items, palette, { host = ctx.dock, say = null, wrongSay = "규칙을 다시 볼까요? 모양에 맞는 색을 골라요." } = {}) {
  let cur = palette[0].key;
  host.innerHTML = `<div class="nm-padwrap"><div class="sp-pal">${palette.map((p) => `<button class="sm-btn sp-col ${p.key === cur ? "is-on" : ""}" type="button" data-col="${p.key}" style="--c:${p.color}"><span class="sw"></span>${esc(p.name)}</button>`).join("")}</div></div>`;
  host.querySelectorAll("[data-col]").forEach((b) => b.addEventListener("click", () => { cur = b.dataset.col; host.querySelectorAll("[data-col]").forEach((x) => x.classList.toggle("is-on", x === b)); ctx.fx.sound.tap(); }));
  if (say) ctx.guide.say(say);
  const left = new Set(items.map((it) => it.k));
  await new Promise((resolve) => {
    const off = onHit(svg, ".sp-item", (el) => {
      const it = items.find((x) => x.k === el.dataset.k); if (!it || !left.has(it.k)) return;
      if (it.want !== cur) { ctx.mistake(); ctx.fx.sound.bad(); shake(el); ctx.guide.encourage(wrongSay); return; }
      const col = palette.find((p) => p.key === cur).color;
      el.querySelectorAll("[data-paint]").forEach((p) => p.setAttribute("fill", col));
      el.classList.add("sp-done"); left.delete(it.k); ctx.fx.sound.pop(); ctx.fx.burstAt(el, { power: 0.5 });
      if (!left.size) { off(); resolve(); }
    });
  });
  host.innerHTML = "";
  ctx.fx.cheer(null, { big: true });
}

// ── 칸(마을·상자)으로 보내기(원본 9·11·12·13·39쪽): 물건을 누르고 칸을 누른다 ──
//  items: [{k, bin}] (svg 안 .sb-item[data-k]), bins: svg 안 .sb-bin[data-bin]. placeAt(bin, n) → [x, y] 놓일 자리
export async function sortToBins(ctx, svg, items, { placeAt, say = null, wrongSay = "그 마을이 아니에요. 모양을 다시 봐요.", hint = null } = {}) {
  if (say) ctx.guide.say(say);
  let sel = null; const count = {}; const left = new Set(items.map((i) => i.k)); let wrong = 0;
  await new Promise((resolve) => {
    const off = onHit(svg, ".sb-item, .sb-bin", (el) => {
      if (el.classList.contains("sb-item")) {
        if (!left.has(el.dataset.k)) return;
        svg.querySelectorAll(".sb-item").forEach((x) => x.classList.remove("nm-sel")); el.classList.add("nm-sel"); sel = el; ctx.fx.sound.tap(); return;
      }
      if (!sel) { ctx.guide.encourage("먼저 도형을 하나 눌러요."); return; }
      const it = items.find((x) => x.k === sel.dataset.k), bin = el.dataset.bin;
      if (it.bin !== bin) { wrong++; ctx.mistake(); ctx.fx.sound.bad(); shake(sel); if (hint && wrong >= 2) hint(it); else ctx.guide.encourage(wrongSay); return; }
      count[bin] = (count[bin] || 0) + 1;
      const [tx, ty] = placeAt(bin, count[bin] - 1); const bb = sel.getBBox(); const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
      sel.style.transition = "transform .45s cubic-bezier(.3,1.4,.5,1)"; sel.style.transform = `translate(${tx - cx}px, ${ty - cy}px) scale(.7)`; sel.style.transformBox = "view-box"; sel.style.transformOrigin = `${cx}px ${cy}px`;
      sel.classList.remove("nm-sel", "nm-hit"); left.delete(it.k); sel = null; ctx.fx.sound.pop(); ctx.fx.burstAt(el, { power: 0.5 });
      if (!left.size) { off(); resolve(); }
    });
  });
  ctx.fx.cheer(null, { big: true });
}

// ── 겹친 도형 그림자(원본 16~18·24~27쪽) ──
//  parts: [{kind, x, y, s, rot}] — 같은 회색으로 겹쳐 그리면 겹친 모양의 그림자가 된다.
export const shadowOf = (parts, fill = "#b9bec6") => parts.map((p) => shape(p.kind, p.x, p.y, p.s, { fill, stroke: "none", rot: p.rot || 0 })).join("");
export const shapeCard = (kind, fill, size = 76, rot = 0) => `<svg width="${size}" height="${size}" viewBox="-50 -50 100 100" aria-hidden="true">${shape(kind, 0, 0, 84, { fill, rot })}</svg>`;
export const shadowCard = (parts, size = 110, vb = "0 0 200 200") => `<svg width="${size}" height="${size}" viewBox="${vb}" aria-hidden="true"><rect x="4" y="4" width="192" height="192" rx="14" fill="#fff" stroke="#d6dbe3" stroke-width="4"/>${shadowOf(parts)}</svg>`;

// ── 동그라미 그리기(원본 28쪽): 띠의 한쪽 끝(핀)을 누르고 다른 끝 연필을 돌려 원을 그린다 ──
//  len: 띠 길이(cm 보기용), r: 화면 반지름. 끌거나 누르고 있으면 연필이 돌며 선이 그려진다.
export async function drawCircle(ctx, svg, { cx, cy, r, color = "#e8417f", strip = "#ffb347", label = "" }) {
  const g = svgEl("g"); svg.append(g);
  g.innerHTML = `<path class="trace" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
    <g class="arm"><rect x="${cx - 14}" y="${cy - 14}" width="${r + 28}" height="28" rx="6" fill="${strip}" stroke="#d98a2b" stroke-width="2"/>${label ? `<text x="${cx + r / 2}" y="${cy + 7}" text-anchor="middle" font-size="18" font-weight="800" fill="#7a4a12">${label}</text>` : ""}
      <circle cx="${cx}" cy="${cy}" r="6" fill="#fff" stroke="#7a4a12" stroke-width="2"/><g transform="translate(${cx + r} ${cy})"><rect x="-7" y="-46" width="14" height="40" fill="#ffd23f" stroke="#25324a" stroke-width="2"/><path d="M-7 -6 L0 8 L7 -6Z" fill="#f2d5a8" stroke="#25324a" stroke-width="2"/><circle cx="0" cy="6" r="2.5" fill="#25324a"/></g></g>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#e8417f"/><circle class="nm-hit grip" cx="${cx + r}" cy="${cy}" r="40" fill="rgba(255,210,63,.25)" stroke="#ffb627" stroke-width="3" stroke-dasharray="6 5"/>`;
  const arm = g.querySelector(".arm"), trace = g.querySelector(".trace"), grip = g.querySelector(".grip");
  let ang = 0, swept = 0; const pts = [[cx + r, cy]];
  const set = (a) => { arm.setAttribute("transform", `rotate(${a * 180 / Math.PI} ${cx} ${cy})`); grip.setAttribute("cx", cx + r * Math.cos(a)); grip.setAttribute("cy", cy + r * Math.sin(a)); };
  const toUser = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  await new Promise((resolve) => {
    let dragging = false, holdTimer = 0;
    const step = (na) => {
      let d = na - ang; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      if (Math.abs(d) > 1.2) return;
      ang += d; swept += Math.abs(d); set(ang);
      pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]); trace.setAttribute("d", `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L")}`);
      if (swept >= Math.PI * 2 - 0.05) { finish(); }
    };
    const finish = () => { if (holdTimer) clearInterval(holdTimer); svg.removeEventListener("pointermove", move); svg.removeEventListener("pointerup", up); grip.remove(); trace.setAttribute("d", `M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx + r - 0.01} ${cy}`); ctx.fx.sound.good(); resolve(); };
    const move = (e) => { if (!dragging) return; const p = toUser(e); step(Math.atan2(p.y - cy, p.x - cx)); };
    const up = () => { dragging = false; };
    grip.addEventListener("pointerdown", (e) => { dragging = true; grip.setPointerCapture?.(e.pointerId); e.preventDefault(); });
    svg.addEventListener("pointermove", move); svg.addEventListener("pointerup", up);
    // 끌기가 어려운 아이: 연필을 누르기만 해도 조금씩 돌아간다
    grip.addEventListener("click", () => { if (holdTimer) return; holdTimer = setInterval(() => step(ang + 0.12), 40); });
  });
  return g;
}

// ── 도형 마을(원본 8~13쪽): 호호 마을(동그라미) · 송송 마을(세모) · 토토 마을(네모) ──
export const VILLAGE = {
  round: { name: "호호 마을", house: "#ff6b4a", grass: "#a8e07a" },
  tri: { name: "송송 마을", house: "#4a6fd6", grass: "#b6e88a" },
  quad: { name: "토토 마을", house: "#9b6ad6", grass: "#a8e07a" }
};
// 마을 섬(언덕 + 그 마을 모양 집 + 팻말). (x, y) 가운데, w 너비
export function villageArt(key, x, y, w, { sign = true } = {}) {
  const v = VILLAGE[key], h = w * 0.62, s = w * 0.3;
  const house = key === "round"
    ? `<circle cx="${x - w * 0.12}" cy="${y - h * 0.18}" r="${s * 0.62}" fill="${v.house}"/><circle cx="${x - w * 0.12}" cy="${y - h * 0.2}" r="${s * 0.26}" fill="#ffd23f"/><circle cx="${x - w * 0.25}" cy="${y - h * 0.36}" r="${s * 0.12}" fill="#fff" stroke="#25324a" stroke-width="1.5"/>`
    : key === "tri"
      ? `<polygon points="${x - w * 0.12},${y - h * 0.62} ${x + w * 0.12},${y - h * 0.02} ${x - w * 0.36},${y - h * 0.02}" fill="${v.house}" stroke="#25324a" stroke-width="2"/><polygon points="${x - w * 0.12},${y - h * 0.4} ${x - w * 0.04},${y - h * 0.08} ${x - w * 0.2},${y - h * 0.08}" fill="#ffd23f"/>`
      : `<rect x="${x - w * 0.3}" y="${y - h * 0.56}" width="${s * 0.95}" height="${s * 1.05}" fill="${v.house}" stroke="#25324a" stroke-width="2"/><rect x="${x - w * 0.26}" y="${y - h * 0.5}" width="${s * 0.3}" height="${s * 0.3}" fill="#fff" stroke="#25324a" stroke-width="1.5"/><rect x="${x - w * 0.12}" y="${y - h * 0.26}" width="${s * 0.26}" height="${s * 0.38}" fill="#ffd23f"/>`;
  const friends = key === "round" ? shape("circle", x + w * 0.18, y - h * 0.08, s * 0.42, { fill: "#ffb3c8", face: true }) + shape("circle", x + w * 0.32, y - h * 0.02, s * 0.32, { fill: "#ff9a5a", face: true })
    : key === "tri" ? shape("tri", x + w * 0.18, y - h * 0.1, s * 0.46, { fill: "#5aa0f0", face: true }) + shape("tri", x + w * 0.32, y - h * 0.02, s * 0.34, { fill: "#8fd0ff", face: true })
      : shape("square", x + w * 0.16, y - h * 0.08, s * 0.44, { fill: "#ff9ec7", face: true }) + shape("square", x + w * 0.32, y - h * 0.02, s * 0.34, { fill: "#f7b8d6", face: true });
  return `<g><ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h * 0.42}" fill="${v.grass}" stroke="#7cc35a" stroke-width="3"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${x - w * 0.36 + i * w * 0.08}" y="${y + h * 0.06}" width="${w * 0.04}" height="${h * 0.16}" rx="2" fill="#fff" stroke="#c9cfd8"/>`).join("")}${house}${friends}
    ${sign ? `<rect x="${x - w * 0.18}" y="${y + h * 0.22}" width="${w * 0.36}" height="${h * 0.2}" rx="6" fill="#c8955f" stroke="#7a4a22" stroke-width="2"/><text x="${x}" y="${y + h * 0.37}" text-anchor="middle" font-size="${h * 0.13}" font-weight="900" fill="#fff">${v.name}</text>` : ""}</g>`;
}

// 점 목록이 꼬이지 않은 도형인가(세모: 넓이 있음, 네모: 변끼리 엇갈리지 않고 세 점이 한 줄이 아님)
const area = (pts) => pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const segX = (p1, p2, p3, p4) => cross(p1, p2, p3) * cross(p1, p2, p4) < 0 && cross(p3, p4, p1) * cross(p3, p4, p2) < 0;
// 점 목록 → 꼬이지 않은 도형인가(세모: 넓이 있음, 네모: 변끼리 엇갈리지 않고 세 점이 한 줄이 아님)
export const simplePoly = (pts) => {
  if (Math.abs(area(pts)) < 200) return false;
  for (let i = 0; i < pts.length; i++) if (Math.abs(cross(pts[i], pts[(i + 1) % pts.length], pts[(i + 2) % pts.length])) < 120) return false;
  if (pts.length === 4 && (segX(pts[0], pts[1], pts[2], pts[3]) || segX(pts[1], pts[2], pts[3], pts[0]))) return false;
  return true;
};


// 물건 그림(원본 109쪽 그림 카드 등) — 입체도형 빙고(3단원)에도 같은 그림을 쓴다
export const OBJ_PIC = {
  sphere: `<circle r="34" fill="#fff" stroke="#25324a" stroke-width="3"/><path d="M0 -11 L10.5 -3.4 L6.5 8.9 L-6.5 8.9 L-10.5 -3.4Z" fill="#25324a"/>${[0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a})"><path d="M0 -11 V-22" stroke="#25324a" stroke-width="2.5"/><path d="M-8 -34 L-7 -24 L0 -21 L7 -24 L8 -34 Q0 -36 -8 -34Z" fill="#25324a"/></g>`).join("")}`,
  pyramid: `<path d="M-40 28 L0 -34 L40 28Z" fill="#ffd29c" stroke="#d98a2b" stroke-width="3"/><path d="M0 -34 L10 28" stroke="#d98a2b" stroke-width="2"/>${[-20, -6, 8, 20].map((y) => `<path d="M${-40 + (y + 34) * 0.62} ${y} H${40 - (y + 34) * 0.62}" stroke="#e6a860" stroke-width="2"/>`).join("")}`,
  cube: `<rect x="-28" y="-22" width="44" height="44" rx="6" fill="#fff" stroke="#55b047" stroke-width="3"/><path d="M-28 -22 l12 -10 h44 l-12 10z M16 -22 l12 -10 v44 l-12 10z" fill="#d6f2cc" stroke="#55b047" stroke-width="3"/>${[[-17, -11], [5, -11], [-17, 11], [5, 11], [-6, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#25324a"/>`).join("")}`,
  cone: `<path d="M-30 32 L0 -38 L30 32Z" fill="#7fb2e8" stroke="#3d6fc4" stroke-width="3"/><circle cx="0" cy="-38" r="6" fill="#ffd23f"/><path d="M-14 0 q8 -6 16 0 M-20 18 q10 -6 22 2" stroke="#ffd23f" stroke-width="3" fill="none"/>`,
  hemi: `<path d="M-38 -6 A38 34 0 0 0 38 -6Z" fill="#3c8a3a"/><path d="M-32 -6 A32 26 0 0 0 32 -6Z" fill="#f0414f"/><ellipse cx="0" cy="-6" rx="38" ry="6" fill="#f0414f"/>${[-16, -4, 8, 18].map((x) => `<ellipse cx="${x}" cy="6" rx="2" ry="3" fill="#25324a"/>`).join("")}`,
  cylinder: `<rect x="-24" y="-30" width="48" height="60" fill="#ffe066" stroke="#d9a400" stroke-width="3"/><ellipse cx="0" cy="-30" rx="24" ry="8" fill="#e8ecf2" stroke="#8a93a3" stroke-width="3"/><circle cx="-6" cy="6" r="10" fill="#f0414f"/><circle cx="10" cy="12" r="9" fill="#f0414f"/>`,
  triPrism: `<path d="M-26 34 L-26 -24 L6 -30 L6 30Z" fill="#ffb3c8" stroke="#e06f9e" stroke-width="3"/><path d="M6 -30 L26 -18 L26 40 L6 30Z" fill="#f47aa8" stroke="#e06f9e" stroke-width="3"/>${[-20, -14, -8, -2, 4].map((x) => `<path d="M${x} -26 v-12" stroke="${["#f0414f", "#ffd23f", "#4fae40", "#2a6fc4", "#9b7be0"][Math.abs(x) % 5]}" stroke-width="3"/>`).join("")}`,
  hexPrism: `<path d="M-30 -16 L-15 -26 L15 -26 L30 -16 L15 -6 L-15 -6Z" fill="#ffe98a" stroke="#d9a400" stroke-width="3"/><path d="M-30 -16 L-30 22 L-15 32 L15 32 L30 22 L30 -16 L15 -6 L-15 -6Z" fill="#ffd84a" stroke="#d9a400" stroke-width="3"/><path d="M0 -26 V32" stroke="#f05a8a" stroke-width="5"/><path d="M0 -26 q-14 -12 -18 0 q10 6 18 0 q14 -12 18 0 q-10 6 -18 0" fill="#f05a8a"/>`,
  cuboid: `<rect x="-14" y="-40" width="28" height="80" fill="#9aa1ad" stroke="#4a5262" stroke-width="3"/>${Array.from({ length: 7 }, (_, i) => `<path d="M-10 ${-34 + i * 10} h20" stroke="#4a5262" stroke-width="2"/>`).join("")}<path d="M-14 -40 l8 -6 h28 l-8 6z" fill="#c8ced8" stroke="#4a5262" stroke-width="2"/>`
};

// 입체도형 그림(2D, 색을 바꿀 수 있음) — 고르기 단추·스티커용. 가운데 (0,0), 대략 지름 80
const shade = (c, k) => { const n = parseInt(c.slice(1), 16), f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`; };
export function solidArt(kind, c = "#5aa0f0") {
  const L = shade(c, 1.18), D = shade(c, 0.78), st = 'stroke="rgba(0,0,0,.28)" stroke-width="2" stroke-linejoin="round"';
  switch (kind) {
    case "cube": return `<path d="M-30 -14 L0 -30 L30 -14 L0 2Z" fill="${L}" ${st}/><path d="M-30 -14 L0 2 L0 36 L-30 20Z" fill="${c}" ${st}/><path d="M30 -14 L0 2 L0 36 L30 20Z" fill="${D}" ${st}/>`;
    case "cuboid": return `<path d="M-18 -36 L2 -44 L22 -36 L2 -28Z" fill="${L}" ${st}/><path d="M-18 -36 L2 -28 L2 42 L-18 34Z" fill="${c}" ${st}/><path d="M22 -36 L2 -28 L2 42 L22 34Z" fill="${D}" ${st}/>`;
    case "board": return `<path d="M-42 0 L6 -18 L44 -4 L-4 14Z" fill="${L}" ${st}/><path d="M-42 0 L-4 14 L-4 24 L-42 10Z" fill="${c}" ${st}/><path d="M44 -4 L-4 14 L-4 24 L44 6Z" fill="${D}" ${st}/>`;
    case "cylinder": return `<path d="M-26 -26 L-26 26 A26 9 0 0 0 26 26 L26 -26Z" fill="${c}" ${st}/><ellipse cx="0" cy="-26" rx="26" ry="9" fill="${L}" ${st}/>`;
    case "disc": return `<path d="M-40 -4 L-40 8 A40 13 0 0 0 40 8 L40 -4Z" fill="${c}" ${st}/><ellipse cx="0" cy="-4" rx="40" ry="13" fill="${L}" ${st}/>`;
    case "triPrism": return `<path d="M-34 30 L-14 -30 L6 30Z" fill="${c}" ${st}/><path d="M-14 -30 L22 -38 L40 22 L6 30Z" fill="${D}" ${st}/>`;
    case "pentPrism": return `<path d="M-28 -8 L-28 34 L0 40 L0 -2Z" fill="${c}" ${st}/><path d="M0 -2 L0 40 L28 34 L28 -8Z" fill="${D}" ${st}/><path d="M-28 -8 L0 -2 L28 -8 L14 -36 L-14 -36Z" fill="${L}" ${st}/>`;
    case "hexPrism": return `<path d="M-30 -16 L-15 -26 L15 -26 L30 -16 L15 -6 L-15 -6Z" fill="${L}" ${st}/><path d="M-30 -16 L-15 -6 L-15 30 L-30 20Z" fill="${c}" ${st}/><path d="M-15 -6 L15 -6 L15 30 L-15 30Z" fill="${c}" ${st}/><path d="M15 -6 L30 -16 L30 20 L15 30Z" fill="${D}" ${st}/>`;
    case "cone": return `<path d="M-30 26 L0 -38 L30 26Z" fill="${c}" ${st}/><ellipse cx="0" cy="26" rx="30" ry="9" fill="${D}" ${st}/>`;
    case "sqPyramid": return `<path d="M-36 18 L6 30 L0 -36Z" fill="${c}" ${st}/><path d="M6 30 L38 12 L0 -36Z" fill="${D}" ${st}/>`;
    case "triPyramid": return `<path d="M-34 22 L8 28 L0 -34Z" fill="${c}" ${st}/><path d="M8 28 L34 12 L0 -34Z" fill="${D}" ${st}/>`;
    case "sphere": return `<circle r="34" fill="${c}" ${st}/><ellipse cx="-11" cy="-12" rx="11" ry="8" fill="#fff" opacity=".45"/>`;
    case "hemi": return `<path d="M-36 4 A36 36 0 0 0 36 4Z" fill="${c}" ${st}/><ellipse cx="0" cy="4" rx="36" ry="11" fill="${L}" ${st}/>`;
    case "pencil": return `<path d="M-14 -4 L0 -10 L14 -4 L0 2Z" fill="${L}"/><path d="M-14 -4 L0 2 L0 40 L-14 34Z" fill="${c}" ${st}/><path d="M14 -4 L0 2 L0 40 L14 34Z" fill="${D}" ${st}/><path d="M-14 -4 L0 2 L0 -40Z" fill="${c}" ${st}/><path d="M14 -4 L0 2 L0 -40Z" fill="${D}" ${st}/>`;
    default: return "";
  }
}
export const solidIcon = (kind, c, size = 80) => `<svg width="${size}" height="${size}" viewBox="-50 -50 100 100" aria-hidden="true">${solidArt(kind, c)}</svg>`;
// 물건 그림 더하기(원본 34·42~44쪽)
Object.assign(OBJ_PIC, {
  globe: `<circle cy="-6" r="28" fill="#5aa0f0" stroke="#2a6fc4" stroke-width="3"/><path d="M-18 -22 q10 6 6 16 q-10 4 -8 14 M8 -30 q10 10 2 20 q8 6 14 4" fill="#7bd36a" stroke="none"/><path d="M-30 -6 A30 30 0 0 0 26 18" fill="none" stroke="#c98a2b" stroke-width="4"/><path d="M0 22 v10 M-16 36 h32" stroke="#8a5a32" stroke-width="5"/>`,
  snow: `<path d="M-32 18 A32 32 0 0 1 32 18Z" fill="#dff3ff" stroke="#8ab8d8" stroke-width="3"/><circle cx="0" cy="6" r="8" fill="#fff" stroke="#9aa6b8"/><circle cx="0" cy="-6" r="6" fill="#fff" stroke="#9aa6b8"/><rect x="-34" y="18" width="68" height="12" rx="4" fill="#c0392b"/>`,
  trash: `<path d="M-22 -26 L22 -26 L18 34 L-18 34Z" fill="#7fc8b8" stroke="#3f8a7a" stroke-width="3"/><ellipse cx="0" cy="-26" rx="22" ry="6" fill="#bfe8de" stroke="#3f8a7a" stroke-width="3"/>`,
  basketball: `<circle r="32" fill="#f08a3c" stroke="#7a3a12" stroke-width="3"/><path d="M-32 0 H32 M0 -32 V32 M-22 -22 q22 22 0 44 M22 -22 q-22 22 0 44" fill="none" stroke="#7a3a12" stroke-width="2.5"/>`,
  baseball: `<circle r="28" fill="#fffaf0" stroke="#c9cfd8" stroke-width="3"/><path d="M-16 -22 q10 22 0 44 M16 -22 q-10 22 0 44" fill="none" stroke="#e8417f" stroke-width="2.5" stroke-dasharray="4 3"/>`,
  watermelon: `<circle r="34" fill="#3c8a3a" stroke="#1f4a1e" stroke-width="3"/><path d="M-18 -29 q-10 29 0 58 M0 -34 v68 M18 -29 q10 29 0 58" stroke="#174016" stroke-width="5" fill="none"/>`,
  candle: `<rect x="-12" y="-24" width="24" height="56" rx="3" fill="#ffd6e6" stroke="#e06f9e" stroke-width="2"/>${[-14, -2, 10, 22].map((y) => `<path d="M-12 ${y} h24" stroke="#7fb2e8" stroke-width="5"/>`).join("")}<path d="M0 -24 v-8" stroke="#25324a" stroke-width="2"/><path d="M0 -44 q-6 8 0 12 q6 -4 0 -12z" fill="#ffb627"/>`,
  eraser: `<path d="M-34 4 L6 -14 L34 -4 L-6 14Z" fill="#fff" stroke="#9aa6b8" stroke-width="2"/><path d="M-34 4 L-6 14 L-6 26 L-34 16Z" fill="#7fb2e8"/><path d="M34 -4 L-6 14 L-6 26 L34 8Z" fill="#ffd23f"/>`,
  apple: `<path d="M0 -18 C-16 -30 -38 -20 -36 4 C-34 28 -16 40 0 32 C16 40 34 28 36 4 C38 -20 16 -30 0 -18z" fill="#f0414f"/><path d="M0 -18 q-2 -10 6 -16" stroke="#7a4a22" stroke-width="4" fill="none"/><path d="M6 -30 q12 -8 18 2 q-10 6 -18 -2z" fill="#3fae49"/>`,
  glue: `<rect x="-12" y="-30" width="24" height="62" rx="4" fill="#ffd23f" stroke="#c9a400" stroke-width="2"/><rect x="-12" y="-6" width="24" height="16" fill="#3fae49"/><rect x="-12" y="-36" width="24" height="10" rx="3" fill="#2a6fc4"/>`,
  brick: `<path d="M-36 0 L6 -16 L36 -4 L-6 12Z" fill="#e0905a" stroke="#8a4a22" stroke-width="2"/><path d="M-36 0 L-6 12 L-6 30 L-36 18Z" fill="#c8703a" stroke="#8a4a22" stroke-width="2"/><path d="M36 -4 L-6 12 L-6 30 L36 14Z" fill="#a85a2a" stroke="#8a4a22" stroke-width="2"/><circle cx="2" cy="-4" r="4" fill="#8a4a22"/><circle cx="16" cy="-8" r="4" fill="#8a4a22"/>`,
  box: `<path d="M-28 -12 L0 -26 L28 -12 L0 2Z" fill="#ffe0a0" stroke="#d98a2b" stroke-width="2"/><path d="M-28 -12 L0 2 L0 34 L-28 20Z" fill="#ffc870" stroke="#d98a2b" stroke-width="2"/><path d="M28 -12 L0 2 L0 34 L28 20Z" fill="#f0a850" stroke="#d98a2b" stroke-width="2"/><path d="M-14 -19 L14 -5 M14 -19 L-14 -5" stroke="#f05a8a" stroke-width="4"/><path d="M0 -12 q-12 -14 -16 -4 q8 6 16 4 q12 -14 16 -4 q-8 6 -16 4" fill="#f05a8a"/>`,
  tomatoCan: `<rect x="-22" y="-26" width="44" height="56" fill="#ffe066" stroke="#c9a400" stroke-width="2"/><ellipse cx="0" cy="-26" rx="22" ry="6" fill="#e8ecf2" stroke="#8a93a3" stroke-width="2"/><circle cx="-6" cy="4" r="9" fill="#f0414f"/><circle cx="8" cy="10" r="8" fill="#f0414f"/>`,
  dicePink: `<path d="M-28 -12 L0 -26 L28 -12 L0 2Z" fill="#ffe0ec" stroke="#e06f9e" stroke-width="2"/><path d="M-28 -12 L0 2 L0 34 L-28 20Z" fill="#ffc6de" stroke="#e06f9e" stroke-width="2"/><path d="M28 -12 L0 2 L0 34 L28 20Z" fill="#f4a3c4" stroke="#e06f9e" stroke-width="2"/>${[[-14, 4], [-14, 22], [14, 4], [14, 22], [0, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#e8417f"/>`).join("")}`
});
export const objIcon = (k, size = 80) => `<svg width="${size}" height="${size}" viewBox="-50 -50 100 100" aria-hidden="true">${OBJ_PIC[k]}</svg>`;
