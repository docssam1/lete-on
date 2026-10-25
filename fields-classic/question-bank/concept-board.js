// 손글씨 판서 — 빈 칠판에 독쌤이 한 가지씩 써 가며 개념을 설명한다(원장 2026-10-24 「손글씨 개념부터」).
// 규약은 skills/concept-whiteboard-lesson: 한 비트에 한 가지만 그린다 · 자막이 원본(독쌤 말풍선 + 칠판 아래 자막) ·
// 음성은 덱의 say()(기기 음성, 켜고 끌 수 있음) · 비트는 그리기와 말이 끝나면 넘어간다 · 마지막 장면은 그대로 서 있어야 한다 ·
// 움직임 줄이기 설정이면 바로 완성 장면.
// 글자는 손글씨 글꼴(나눔펜, OFL · assets/fonts/nm-lesson-hand.woff2)을 펜이 지나가며 드러내고, 그림은 실제 선(stroke)을 펜이 그린다.
// 대본은 concept-boards.js(BOARDS). 숫자·정답은 대본의 규칙 함수로 계산한다(골든벨 정답 DB를 쓰지 않는다).
import { BOARDS } from "./concept-boards.js?v=20261025b";

const NS = "http://www.w3.org/2000/svg";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const el = (tag, attrs = {}, parent = null) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) node.setAttribute(k, String(v));
  if (parent) parent.append(node);
  return node;
};
const deg = (a) => (a * Math.PI) / 180;
// 시계 숫자 n의 자리(12시가 0°, 시계 방향)
export const clockPoint = (cx, cy, r, n) => [cx + r * Math.sin(deg(n * 30)), cy - r * Math.cos(deg(n * 30))];
const COLORS = { ink: "#23211c", gray: "#8a857a", red: "#c8442b", blue: "#2a5fb8", green: "#2f6b4a", gold: "#b07d12", pale: "#fbf4dc" };
const color = (c) => COLORS[c] || c || COLORS.ink;

// 비트의 그림 한 개를 SVG 원소로 만들고, 애니메이션(펜이 그리는 모습)을 돌린다.
// 모두 { node, len, final() }을 돌려준다 — final()은 즉시 완성 상태(되감기·움직임 줄이기용).
function arcPath(cx, cy, r, a0, a1, ccw = false) {
  // a0→a1 각도(도, 12시=0, 시계 방향 +). ccw면 반대로 돈다.
  let sweep = ccw ? ((a0 - a1) % 360 + 360) % 360 : ((a1 - a0) % 360 + 360) % 360;
  if (sweep === 0) sweep = 359.9;
  const [x0, y0] = [cx + r * Math.sin(deg(a0)), cy - r * Math.cos(deg(a0))];
  const end = ccw ? a0 - sweep : a0 + sweep;
  const [x1, y1] = [cx + r * Math.sin(deg(end)), cy - r * Math.cos(deg(end))];
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} ${ccw ? 0 : 1} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
function arrowHead(x, y, angleDeg, size, stroke) {
  // 진행 방향 angleDeg(도, 수학 각: 0=오른쪽, 반시계 +)으로 향한 화살촉
  const a = deg(angleDeg), s = size;
  const p1 = [x - s * Math.cos(a - 0.5), y + s * Math.sin(a - 0.5)];
  const p2 = [x - s * Math.cos(a + 0.5), y + s * Math.sin(a + 0.5)];
  return { d: `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)} L ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`, stroke };
}

export function mountConceptBoard(host, { say = () => Promise.resolve(), onDone = () => {}, board: boardId } = {}) {
  const script = BOARDS[boardId];
  if (!script) { host.innerHTML = `<p class="cb-missing">판서 대본이 없어요: ${esc(boardId)}</p>`; return { dispose() {} }; }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pref = (() => { try { return JSON.parse(localStorage.getItem("fc.board.pref") || "{}"); } catch { return {}; } })();
  let speed = pref.speed || 1;
  const savePref = () => { try { localStorage.setItem("fc.board.pref", JSON.stringify({ speed })); } catch {} };
  const beats = script.beats;
  const W = script.width || 1000, H = script.height || 600;
  let at = 0;            // 지금 진행 중이거나 다음에 그릴 비트
  let playing = !reduced;
  let runId = 0;         // 되감기·건너뛰기 때 진행 중인 애니메이션을 끊는 표
  let finished = false;
  let checkState = null; // { tries, solved }

  host.innerHTML = `<div class="cb" data-board="${esc(boardId)}">
    <div class="cb-top"><span class="cb-kicker">${esc(script.kicker || "개념 배우기")}</span><strong class="cb-title">${esc(script.title)}</strong><span class="cb-step" data-cb-step></span></div>
    <div class="cb-row"><div class="cb-paper"><svg class="cb-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(script.title)} 판서"><defs></defs><g data-cb-layer></g><g data-cb-pen class="cb-pen" hidden><path d="M -2 -22 L 6 -14 L -12 4 L -20 6 L -18 -2 Z" /><path d="M -12 4 L -20 6 L -18 -2 Z" class="cb-pen-tip" /></g></svg></div>
    <div class="cb-check" data-cb-check hidden></div></div>
    <p class="cb-cap" data-cb-cap aria-live="polite"></p>
    <div class="cb-ctl" role="group" aria-label="판서 조절">
      <button type="button" class="cb-btn" data-cb="prev" aria-label="앞 장면">‹</button>
      <button type="button" class="cb-btn primary" data-cb="toggle" aria-label="멈추기">❚❚</button>
      <button type="button" class="cb-btn" data-cb="next" aria-label="다음 장면">›</button>
      <button type="button" class="cb-btn" data-cb="restart" aria-label="처음부터">↺</button>
      <span class="cb-speed" role="group" aria-label="빠르기">${[1, 1.5, 2].map((v) => `<button type="button" data-cb-speed="${v}" aria-pressed="${v === speed}">${v}×</button>`).join("")}</span>
    </div>
  </div>`;
  const root = host.firstElementChild;
  const svg = root.querySelector(".cb-svg"), layer = root.querySelector("[data-cb-layer]"), pen = root.querySelector("[data-cb-pen]");
  const defs = svg.querySelector("defs");
  const cap = root.querySelector("[data-cb-cap]"), stepEl = root.querySelector("[data-cb-step]"), checkBox = root.querySelector("[data-cb-check]");
  const clipIds = { n: 0 };

  const penTo = (x, y) => { pen.hidden = false; pen.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`); };
  const penOff = () => { pen.hidden = true; };
  const dur = (ms) => Math.max(120, ms / speed);
  const waitFrame = () => new Promise((r) => requestAnimationFrame(r));
  async function animate(ms, step) {   // step(t) t∈[0,1]; runId가 바뀌면 끝낸다
    const my = runId, t0 = performance.now(), total = dur(ms);
    for (;;) {
      const t = Math.min(1, (performance.now() - t0) / total);
      step(t);
      if (t >= 1 || my !== runId) return my === runId;
      await waitFrame();
    }
  }
  function textNode(item) {
    const g = el("g", { class: `cb-text ${item.font === "sans" ? "sans" : "hand"}` }, layer);
    const t = el("text", { x: item.x, y: item.y, "font-size": item.size || 40, fill: color(item.color), "text-anchor": item.align === "center" ? "middle" : item.align === "right" ? "end" : "start" }, g);
    t.textContent = item.text;
    return { g, t };
  }
  async function drawText(item, instant) {
    const { g, t } = textNode(item);
    if (instant) return;
    const bb = t.getBBox();
    const id = `cbclip${++clipIds.n}`;
    const clip = el("clipPath", { id }, defs);
    const rect = el("rect", { x: bb.x - 4, y: bb.y - 6, width: 0, height: bb.height + 12 }, clip);
    g.setAttribute("clip-path", `url(#${id})`);
    const ms = Math.max(500, String(item.text).length * 150);
    const ok = await animate(ms, (p) => { rect.setAttribute("width", (bb.width + 8) * p); penTo(bb.x + bb.width * p, bb.y + bb.height * 0.75); });
    rect.setAttribute("width", bb.width + 8);
    return ok;
  }
  async function drawPath(d, attrs, instant, msPerUnit = 1.6) {
    const p = el("path", { d, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", ...attrs }, layer);
    if (instant) return true;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`;
    const ok = await animate(Math.max(260, len * msPerUnit), (t) => {
      p.style.strokeDashoffset = `${len * (1 - t)}`;
      const pt = p.getPointAtLength(len * t); penTo(pt.x, pt.y);
    });
    p.style.strokeDasharray = ""; p.style.strokeDashoffset = "";
    return ok;
  }
  async function drawRectFill(item, instant) {
    const r = el("rect", { x: item.x, y: item.y, width: item.w, height: item.h, rx: item.rx ?? 4, fill: color(item.fill), opacity: 0.92 }, layer);
    if (instant) return true;
    const id = `cbclip${++clipIds.n}`;
    const clip = el("clipPath", { id }, defs);
    const rect = el("rect", { x: item.x, y: item.y, width: 0, height: item.h }, clip);
    r.setAttribute("clip-path", `url(#${id})`);
    const ok = await animate(420, (p) => { rect.setAttribute("width", item.w * p); penTo(item.x + item.w * p, item.y + item.h * 0.5); });
    rect.setAttribute("width", item.w);
    return ok;
  }
  // 복합 그림을 기본 그림 목록으로 푼다
  function expand(item) {
    const k = item.kind;
    if (k === "clock") {
      const { cx, cy, r } = item, out = [];
      out.push({ kind: "path", d: arcPath(cx, cy, r, 0, 360), stroke: "ink", width: 4 });
      for (let n = 1; n <= 12; n++) {
        const [x0, y0] = clockPoint(cx, cy, r - 12, n), [x1, y1] = clockPoint(cx, cy, r - 2, n);
        out.push({ kind: "path", d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)}`, stroke: "ink", width: 3, quick: true });
      }
      for (let n = 1; n <= 12; n++) { const [x, y] = clockPoint(cx, cy, r - 38, n); out.push({ kind: "text", x, y: y + 11, text: String(n), size: 30, align: "center", font: "hand", quick: true }); }
      out.push({ kind: "path", d: arcPath(cx, cy, 5, 0, 360), stroke: "ink", width: 5, quick: true });
      if (item.hand != null) out.push({ kind: "hand", cx, cy, r, to: item.hand, color: item.handColor || "gray" });
      return out;
    }
    if (k === "hand") {
      const [x, y] = clockPoint(item.cx, item.cy, item.r * 0.68, item.to);
      const ang = Math.atan2(-(y - item.cy), x - item.cx) * 180 / Math.PI;
      return [{ kind: "path", d: `M ${item.cx} ${item.cy} L ${x.toFixed(1)} ${y.toFixed(1)}`, stroke: item.color || "red", width: 7 },
        { kind: "path", ...arrowHead(x, y, ang, 16, item.color || "red"), width: 6, quick: true }];
    }
    if (k === "arc") {   // 시계판 바깥 호 화살표: from·to는 시계 숫자, ccw면 반대 방향
      const a0 = item.from * 30, a1 = item.to * 30;
      const d = arcPath(item.cx, item.cy, item.r, a0, a1, item.ccw);
      const sweep = item.ccw ? ((a0 - a1) % 360 + 360) % 360 || 359.9 : ((a1 - a0) % 360 + 360) % 360 || 359.9;
      const end = item.ccw ? a0 - sweep : a0 + sweep;
      const [ex, ey] = [item.cx + item.r * Math.sin(deg(end)), item.cy - item.r * Math.cos(deg(end))];
      const tangent = item.ccw ? end + 90 : end - 90;          // 진행 방향(시계 각) → 수학 각으로
      const mathAng = 90 - tangent;
      return [{ kind: "path", d, stroke: item.color || "red", width: 5, dash: item.dash },
        { kind: "path", ...arrowHead(ex, ey, mathAng, 18, item.color || "red"), width: 5, quick: true }];
    }
    if (k === "grid") {
      const { x, y, cols, rows, cell } = item, out = [];
      for (let r = 0; r <= rows; r++) out.push({ kind: "path", d: `M ${x} ${y + r * cell} L ${x + cols * cell} ${y + r * cell}`, stroke: item.color || "gray", width: 2.5, quick: true });
      for (let c = 0; c <= cols; c++) out.push({ kind: "path", d: `M ${x + c * cell} ${y} L ${x + c * cell} ${y + rows * cell}`, stroke: item.color || "gray", width: 2.5, quick: true });
      return out;
    }
    if (k === "cells") return item.cells.map(([r, c]) => ({ kind: "fill", x: item.x + c * item.cell + 3, y: item.y + r * item.cell + 3, w: item.cell - 6, h: item.cell - 6, fill: item.fill || "blue" }));
    if (k === "box") return [{ kind: "path", d: `M ${item.x} ${item.y} h ${item.w} v ${item.h} h ${-item.w} Z`, stroke: item.color || "gold", width: 3.5, dash: item.dash }];
    if (k === "line") return [{ kind: "path", d: `M ${item.x1} ${item.y1} L ${item.x2} ${item.y2}`, stroke: item.color || "ink", width: item.width || 3, dash: item.dash }];
    if (k === "arrow") {
      const ang = Math.atan2(-(item.y2 - item.y1), item.x2 - item.x1) * 180 / Math.PI;
      const d = item.bend ? `M ${item.x1} ${item.y1} Q ${(item.x1 + item.x2) / 2} ${Math.min(item.y1, item.y2) - item.bend} ${item.x2} ${item.y2}` : `M ${item.x1} ${item.y1} L ${item.x2} ${item.y2}`;
      const headAng = item.bend ? Math.atan2(-(item.y2 - (Math.min(item.y1, item.y2) - item.bend)), item.x2 - (item.x1 + item.x2) / 2) * 180 / Math.PI : ang;
      return [{ kind: "path", d, stroke: item.color || "red", width: item.width || 4 }, { kind: "path", ...arrowHead(item.x2, item.y2, headAng, 14, item.color || "red"), width: 4, quick: true }];
    }
    if (k === "ring") return [{ kind: "path", d: arcPath(item.cx, item.cy, item.r, -20, 340), stroke: item.color || "red", width: 4 }];
    return [item];
  }
  async function drawItem(item, instant) {
    for (const prim of expand(item)) {
      let ok = true;
      if (prim.kind === "text") ok = await drawText(prim, instant);
      else if (prim.kind === "fill") ok = await drawRectFill(prim, instant);
      else if (prim.kind === "path") ok = await drawPath(prim.d, { stroke: color(prim.stroke), "stroke-width": prim.width || 3, "stroke-dasharray": prim.dash ? "10 9" : undefined }, instant, prim.quick ? 0.6 : 1.6);
      if (!ok) return false;
    }
    return true;
  }

  // 확인 문제(비트의 check): 보기는 글 또는 작은 모눈. 정답은 대본의 규칙 함수가 계산한다.
  function renderCheck(check) {
    checkState = { tries: 0, solved: false, check };
    const options = check.options.map((opt, i) => typeof opt === "string"
      ? `<button type="button" class="cb-opt" data-cb-opt="${i}">${esc(opt)}</button>`
      : `<button type="button" class="cb-opt cb-opt-grid" data-cb-opt="${i}" aria-label="보기 ${i + 1}">${miniGrid(opt)}</button>`);
    checkBox.innerHTML = `<p class="cb-q">${esc(check.question)}</p><div class="cb-opts">${options.join("")}</div><p class="cb-verdict" data-cb-verdict aria-live="polite"></p>`;
    checkBox.hidden = false;
  }
  function miniGrid(opt) {
    const cell = 20, w = opt.cols * cell, h = opt.rows * cell;
    const cells = opt.cells.map(([r, c]) => `<rect x="${c * cell + 2}" y="${r * cell + 2}" width="${cell - 4}" height="${cell - 4}" rx="3" fill="${color(opt.fill || "blue")}" />`).join("");
    let lines = "";
    for (let r = 0; r <= opt.rows; r++) lines += `<line x1="0" y1="${r * cell}" x2="${w}" y2="${r * cell}" />`;
    for (let c = 0; c <= opt.cols; c++) lines += `<line x1="${c * cell}" y1="0" x2="${c * cell}" y2="${h}" />`;
    return `<svg viewBox="-1 -1 ${w + 2} ${h + 2}" width="${w + 2}" height="${h + 2}" aria-hidden="true"><g stroke="#8a857a" stroke-width="1.5">${lines}</g>${cells}</svg>`;
  }
  async function answerCheck(i) {
    if (!checkState || checkState.solved) return;
    const { check } = checkState, verdict = checkBox.querySelector("[data-cb-verdict]"), buttons = [...checkBox.querySelectorAll(".cb-opt")];
    if (i === check.answer) {
      checkState.solved = true;
      buttons.forEach((b, k) => { b.disabled = true; b.classList.toggle("right", k === i); });
      verdict.textContent = check.right || "맞았어요!";
      await say(check.sayRight || "맞았어요! 개념을 잘 익혔어요.", "praise");
      finish();
      return;
    }
    checkState.tries += 1;
    buttons[i].classList.add("wrong"); buttons[i].disabled = true;
    if (checkState.tries >= 2) {
      buttons.forEach((b, k) => { b.disabled = true; b.classList.toggle("right", k === check.answer); });
      verdict.textContent = check.reveal || "정답을 표시했어요. 왜 그런지 판서를 다시 봐요.";
      await say(check.sayReveal || "정답을 표시했어요. 판서를 다시 보고 왜 그런지 생각해 봐요.", "think");
      checkState.solved = true;
      finish();
      return;
    }
    verdict.textContent = check.hint || "다시 생각해 봐요.";
    say(check.sayHint || check.hint || "다시 생각해 봐요.", "think");
  }
  function finish() { if (finished) return; finished = true; stepEl.textContent = `${beats.length} / ${beats.length}`; root.classList.add("is-done"); onDone(); }

  // 비트 실행: 그림과 말을 같이 시작해, 둘 다 끝나면 다음으로
  function setCaption(beat, k) { cap.textContent = beat.say || ""; stepEl.textContent = `${Math.min(k + 1, beats.length)} / ${beats.length}`; }
  async function playBeat(k) {
    const beat = beats[k], my = runId;
    setCaption(beat, k);
    const sayP = beat.say ? say(beat.say, beat.mood || "talk") : Promise.resolve();
    for (const item of beat.items || []) { const ok = await drawItem(item, false); if (!ok || my !== runId) return false; }
    penOff();
    if (beat.check) { renderCheck(beat.check); await sayP; return my === runId; }
    await sayP;
    if (my !== runId) return false;
    await sleep(dur(900));   // 비트 사이 숨 고르기(천천히)
    return my === runId;
  }
  function renderUpTo(k) {   // 0..k-1 비트를 즉시 완성 상태로
    runId += 1; layer.replaceChildren(); defs.replaceChildren(); penOff(); checkBox.hidden = true; checkState = null; finished = false; root.classList.remove("is-done");
    for (let i = 0; i < k; i++) for (const item of beats[i].items || []) drawItem(item, true);
    if (k > 0 && beats[k - 1].check) { setCaption(beats[k - 1], k - 1); renderCheck(beats[k - 1].check); }
  }
  let loop = null;
  async function run() {
    if (loop) return;
    loop = (async () => {
      while (playing && at < beats.length) {
        const k = at;
        const ok = await playBeat(k);
        if (!ok) break;
        at = k + 1;
        if (beats[k].check) { playing = false; paintToggle(); break; }  // 확인 문제는 학생이 답할 때까지 기다린다
      }
      if (at >= beats.length && !beats[beats.length - 1]?.check) finish();
      if (at >= beats.length) { playing = false; paintToggle(); }
      loop = null;
    })();
    await loop;
  }
  function paintToggle() {
    const b = root.querySelector('[data-cb="toggle"]');
    b.textContent = playing ? "❚❚" : "▶"; b.setAttribute("aria-label", playing ? "멈추기" : "이어서 보기");
  }
  function jump(k, { autoplay = true } = {}) {
    k = Math.max(0, Math.min(beats.length, k));
    renderUpTo(k); at = k;
    const shown = Math.max(0, k - 1); setCaption(beats[shown], shown);   // 멈춘 채로 보면 「k / 전체」 = 지금까지 그린 비트 수
    if (k >= beats.length) { if (!beats[beats.length - 1].check) finish(); playing = false; paintToggle(); return; }
    playing = autoplay && !reduced; paintToggle();
    if (playing) run();
  }

  const onClick = (event) => {
    const b = event.target.closest("[data-cb],[data-cb-speed],[data-cb-opt]");
    if (!b || !root.contains(b)) return;
    event.stopPropagation();
    if (b.dataset.cbOpt !== undefined) { answerCheck(Number(b.dataset.cbOpt)); return; }
    if (b.dataset.cbSpeed) { speed = Number(b.dataset.cbSpeed); savePref(); root.querySelectorAll("[data-cb-speed]").forEach((x) => x.setAttribute("aria-pressed", String(Number(x.dataset.cbSpeed) === speed))); return; }
    const act = b.dataset.cb;
    if (act === "toggle") { if (playing) { playing = false; runId += 1; renderUpTo(at); paintToggle(); } else if (at < beats.length) { playing = true; paintToggle(); run(); } return; }
    if (act === "next") { runId += 1; jump(Math.min(beats.length, at + 1), { autoplay: playing }); return; }
    if (act === "prev") { runId += 1; jump(Math.max(0, at - 1), { autoplay: playing }); return; }
    if (act === "restart") { runId += 1; jump(0, { autoplay: true }); }
  };
  root.addEventListener("click", onClick);

  if (reduced) jump(beats.length, { autoplay: false });
  else run();
  return { dispose() { runId += 1; playing = false; root.removeEventListener("click", onClick); } };
}
