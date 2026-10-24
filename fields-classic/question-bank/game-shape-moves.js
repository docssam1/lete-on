// 뒤집고 돌리기 공방 — 1권 1단원 「도형 움직이기」 게임(학생 차시 덱 study.html 안에 바로 뜬다).
// 원장(2026-10-24): 「우리 걸 써야 돼. 그걸 발전시켜 우리 학습에 맞는 게임으로」 → 「너무 쉬워. 실제 문제를」.
//  · 문제 수준은 본책·문제은행 실제 문제 그대로다: 4×4 판, 흩어진 칸 5~6개, 「아래쪽으로 뒤집기」「왼쪽으로 반의 반 바퀴」「뒤집고 돌리기」.
//    칸을 옮기는 규칙은 문제은행 생성기와 같은 함수(book01-generators.js transformPattern)를 쓴다 — 본책 문제와 어긋날 수 없다.
//  · 고르기가 아니라 만들기다. 풀이(「각 칸을 옮기면」)를 행동으로: 처음 모양의 칸을 하나 골라 옮겨 갈 자리에 놓기를 칸마다 한다.
//    칸마다 맞았는지 알려 주지 않고, 다 옮긴 뒤 「확인」에서 채점한다. 뒤집고 돌리기는 중간 모양을 먼저 만들고 그 모양을 돌린다.
//  · 틀리면 어떤 실수인지 말한다(좌우·위아래를 바꿈, 반대 방향, 반 바퀴만큼 등). 한 번 틀린 뒤에는 고른 칸이 어디로 가는지 줄·칸으로 짚어 주고,
//    두 번 틀리면 「풀이 보기」로 칸이 하나씩 옮겨 가는 모습을 보여 준다.
//  · 생김새는 거울 저택(geometry/games/mirror-manor)의 유리 판·법랑 칸·은빛 거울선을 옮겨 온 것(game-shape-moves.css).
import { BOOK01_INTERNALS } from "./book01-generators.js?v=20261023h";

const { transformPattern, patternKey } = BOOK01_INTERNALS;
const N = 4;
// 뒤집기는 거울이 놓인 쪽이 넷이지만 결과는 둘(좌우 / 위아래)이다. 판도 그 쪽에 놓는다.
export const OPS = Object.freeze({
  "flip-right": { op: "mirror-left-right", label: "오른쪽으로 뒤집기", kind: "flip", side: "right" },
  "flip-left": { op: "mirror-left-right", label: "왼쪽으로 뒤집기", kind: "flip", side: "left" },
  "flip-down": { op: "mirror-top-bottom", label: "아래쪽으로 뒤집기", kind: "flip", side: "down" },
  "flip-up": { op: "mirror-top-bottom", label: "위쪽으로 뒤집기", kind: "flip", side: "up" },
  "rotate-right": { op: "rotate-right", label: "오른쪽으로 반의 반 바퀴", kind: "turn", note: "시계 방향" },
  "rotate-left": { op: "rotate-left", label: "왼쪽으로 반의 반 바퀴", kind: "turn", note: "시계 반대 방향" },
  "rotate-half": { op: "rotate-half", label: "반 바퀴", kind: "turn", note: "거꾸로" }
});
const RULE = {
  "mirror-left-right": "왼쪽과 오른쪽만 바뀌어요. 줄(높이)은 그대로예요. 오른쪽 끝에서 둘째 칸은 왼쪽 끝에서 둘째 칸으로 가요.",
  "mirror-top-bottom": "위와 아래만 바뀌어요. 칸(좌우)은 그대로예요. 맨 위에서 둘째 줄은 맨 아래에서 둘째 줄로 가요.",
  "rotate-right": "맨 윗줄이 맨 오른쪽 줄이 돼요. 윗줄을 왼쪽부터 읽은 순서대로 오른쪽 줄을 위에서부터 읽어요.",
  "rotate-left": "맨 윗줄이 맨 왼쪽 줄이 돼요. 윗줄을 왼쪽부터 읽은 순서대로 왼쪽 줄을 아래에서부터 읽어요.",
  "rotate-half": "위아래도 좌우도 모두 바뀌어요. 맨 위 왼쪽 칸은 맨 아래 오른쪽 칸으로 가요."
};
export const LEVELS = Object.freeze([
  { id: 1, title: "뒤집기", problems: [["flip-right"], ["flip-down"], ["flip-left"], ["flip-up"]], cells: 5 },
  { id: 2, title: "돌리기", problems: [["rotate-right"], ["rotate-left"], ["rotate-half"], ["rotate-left", "rotate-left"]], cells: 5 },
  { id: 3, title: "뒤집고 돌리기", problems: [["flip-down", "rotate-left"], ["flip-right", "rotate-right"], ["rotate-right", "flip-down", "rotate-half"]], cells: 6 }
]);
const key = (cells) => patternKey(cells);
const cid = ([r, c]) => `${r},${c}`;
const has = (cells, cell) => cells.some((x) => x[0] === cell[0] && x[1] === cell[1]);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const mapCell = (cell, op) => transformPattern([cell], op, N)[0];
const apply = (cells, name) => transformPattern(cells, OPS[name].op, N);

// 처음 모양: 흩어진 칸 5~6개. 뒤집기·돌리기 결과가 모두 서로 다르고(대칭 아님) 처음 모양과도 달라야 실수를 가려낼 수 있다.
function randomShape(count, rand) {
  for (let tries = 0; tries < 500; tries++) {
    const cells = [];
    while (cells.length < count) {
      const cell = [Math.floor(rand() * N), Math.floor(rand() * N)];
      if (!has(cells, cell)) cells.push(cell);
    }
    const rows = new Set(cells.map(([r]) => r)).size, cols = new Set(cells.map(([, c]) => c)).size;
    if (rows < 3 || cols < 3) continue;
    const keys = [cells, ...Object.values(OPS).map((o) => transformPattern(cells, o.op, N))].map(key);
    if (new Set(keys).size === 6) return cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  return [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]];
}
export function makeProblem(level, index, rand = Math.random) {
  const names = LEVELS[level].problems[index];
  const source = randomShape(LEVELS[level].cells, rand);
  const boards = [source];
  for (const name of names) boards.push(apply(boards.at(-1), name));
  return { names, source, boards };
}
// 틀린 결과가 어떤 실수인지(다른 움직임을 한 것과 같은지)
export function diagnose(from, built, name) {
  const want = apply(from, name), k = key(built);
  if (k === key(want)) return { ok: true };
  if (k === key(from)) return { ok: false, say: "처음과 같은 자리에 놓았어요. 움직이면 자리가 바뀌어요." };
  const o = OPS[name];
  const other = (op) => k === key(transformPattern(from, op, N));
  if (o.op === "mirror-left-right" && other("mirror-top-bottom")) return { ok: false, say: "위아래를 바꿨어요. 이 거울은 옆에 있어서 왼쪽과 오른쪽만 바꿔요." };
  if (o.op === "mirror-top-bottom" && other("mirror-left-right")) return { ok: false, say: "좌우를 바꿨어요. 이 거울은 위아래에 있어서 위와 아래만 바꿔요." };
  if (o.kind === "flip" && (other("rotate-right") || other("rotate-left") || other("rotate-half"))) return { ok: false, say: "돌린 모양을 만들었어요. 뒤집기는 거울에 비친 모양이에요 — 돌리지 않아요." };
  if (o.op === "rotate-right" && other("rotate-left")) return { ok: false, say: "반대 방향으로 돌렸어요. 오른쪽으로 반의 반 바퀴는 시계 방향이에요." };
  if (o.op === "rotate-left" && other("rotate-right")) return { ok: false, say: "반대 방향으로 돌렸어요. 왼쪽으로 반의 반 바퀴는 시계 반대 방향이에요." };
  if (o.op !== "rotate-half" && o.kind === "turn" && other("rotate-half")) return { ok: false, say: "반 바퀴만큼 돌렸어요. 반의 반 바퀴는 그 절반이에요." };
  if (o.op === "rotate-half" && (other("rotate-left") || other("rotate-right"))) return { ok: false, say: "반의 반 바퀴만 돌렸어요. 반 바퀴는 반의 반 바퀴를 두 번 돌린 거예요." };
  if (o.kind === "turn" && (other("mirror-left-right") || other("mirror-top-bottom"))) return { ok: false, say: "뒤집은 모양을 만들었어요. 돌리기는 판을 통째로 돌려요 — 거울처럼 뒤집지 않아요." };
  const wrong = built.filter((cell) => !has(want, cell)).length;
  return { ok: false, wrong, say: `옮긴 칸 중 ${wrong}칸의 자리가 달라요. 규칙을 다시 읽고 한 칸씩 확인해 봐요.` };
}

export function mountShapeMoves(host, { say = () => {}, onDone = () => {} } = {}) {
  const listening = new AbortController();
  let alive = true, timer = 0;
  const st = { level: 0, index: 0, step: 0, problem: null, moves: [], pick: null, tries: 0, note: "", hinted: false, showing: false, stars: LEVELS.map(() => 0), firsts: true, finale: false, solved: false };

  const from = () => st.step === 0 ? st.problem.source : st.problem.boards[st.step];
  const name = () => st.problem.names[st.step];
  const built = () => st.moves.map((m) => m.to);

  function newProblem() {
    st.problem = makeProblem(st.level, st.index);
    st.step = 0; st.tries = 0; st.firsts = true; st.solved = false;
    resetStep();
    const n = st.problem.names.map((x) => OPS[x].label);
    say(n.length > 1 ? `처음 모양을 ${n.join(", 그다음 ")} 해 봐요. 중간 모양부터 차례로 만들어요.` : `처음 모양을 ${n[0]} 한 모양을 만들어 봐요. 칸을 하나 골라 옮겨 갈 자리에 놓아요.`, "talk");
  }
  function resetStep() { st.moves = []; st.pick = null; st.note = ""; st.hinted = st.tries > 0; st.showing = false; render(); }

  function grid(cells, opts) {
    const { role, done = [], marks = [], picked = null, wrong = [], center = false } = opts;
    let html = "";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const cell = [r, c], k = cid(cell);
      const on = has(cells, cell);
      const cls = ["smv-cell", on ? (role === "source" || role === "show-source" ? "given" : "painted") : "", done.includes(k) ? "moved" : "", picked === k ? "picked" : "", wrong.includes(k) ? "wrong" : "", marks.includes(k) ? "mark" : ""].filter(Boolean).join(" ");
      const can = !st.solved && !st.showing && ((role === "source" && on && !done.includes(k)) || (role === "target" && (on || st.pick)));
      html += `<button type="button" class="${cls}" data-role="${role}" data-r="${r}" data-c="${c}" ${can ? "" : "disabled"} aria-label="위에서 ${r + 1}째 줄, 왼쪽에서 ${c + 1}째 칸${on ? (role === "source" ? " · 처음 칸" : " · 칠함") : ""}"></button>`;
    }
    return `<div class="smv-grid${center ? " pin" : ""}">${html}</div>`;
  }
  function chip(n) {
    const o = OPS[n];
    const icon = o.kind === "flip"
      ? `<i class="smv-mirror-icon ${o.side === "left" || o.side === "right" ? "v" : "h"}"></i>`
      : `<svg class="smv-turn-icon" viewBox="0 0 40 40" aria-hidden="true"><path d="${o.op === "rotate-left" ? "M28 10 A12 12 0 1 0 32 22" : "M12 10 A12 12 0 1 1 8 22"}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>${o.op === "rotate-half" ? '<path d="M8 22 A12 12 0 0 0 32 22" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="2 5"/>' : ""}<path d="${o.op === "rotate-left" ? "M33 4 L28 10 L35 13" : "M7 4 L12 10 L5 13"}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return `<span class="smv-chip ${o.kind}">${icon}<b>${esc(o.label)}</b>${o.note ? `<small>${o.note}</small>` : ""}</span>`;
  }

  function render() {
    if (!alive) return;
    if (st.finale) return renderFinale();
    const p = st.problem, lv = LEVELS[st.level];
    const fromCells = from(), n = name(), o = OPS[n];
    const moved = st.moves.map((m) => cid(m.from));
    const toCells = built();
    const wrongCells = st.check?.wrongCells || [];
    const single = p.names.length === 1 && o.kind === "flip";
    // 앞에서 만든 중간 모양들(지난 단계)
    const past = p.names.slice(0, st.step).map((x, k) => `${k ? "" : `<figure class="smv-board small"><figcaption>처음 모양</figcaption>${grid(p.source, { role: "show-source" })}</figure>`}${chip(x)}<figure class="smv-board small"><figcaption>${k + 1}번째 결과</figcaption>${grid(p.boards[k + 1], { role: "x" })}</figure>`).join("");
    const pickHint = st.hinted && st.pick ? (() => {
      const [r, c] = st.pick.split(",").map(Number), to = mapCell([r, c], o.op);
      return `고른 칸: 위에서 ${r + 1}째 줄 · 왼쪽에서 ${c + 1}째 → ${esc(o.label)} 하면 위에서 ${to[0] + 1}째 줄 · 왼쪽에서 ${to[1] + 1}째`;
    })() : "";
    const ready = st.moves.length === fromCells.length;
    host.innerHTML = `<div class="smv">
      <header class="smv-top">
        <nav class="smv-levels">${LEVELS.map((l, k) => `<button type="button" class="${k === st.level ? "on" : ""}" data-level="${k}"><b>${l.id}</b>${l.title}${st.stars[k] ? ` <small>★${st.stars[k]}</small>` : ""}</button>`).join("")}</nav>
        <span class="smv-dots">${lv.problems.map((_, k) => `<i class="${k < st.index ? "done" : k === st.index ? "on" : ""}"></i>`).join("")}</span>
      </header>
      <p class="smv-mission">${p.names.length > 1 ? `처음 모양을 <b>${p.names.map((x) => esc(OPS[x].label)).join("</b> 하고 <b>")}</b> 했어요. ${st.step + 1}번째 움직임의 결과를 만들어요.` : `처음 모양을 <b>${esc(o.label)}</b> 했어요. 결과를 만들어요.`}</p>
      ${past ? `<div class="smv-past">${past}</div>` : ""}
      <div class="smv-work ${single ? `flip-${o.side}` : "row"}">
        <figure class="smv-board"><figcaption>${st.step ? `${st.step}번째 결과` : "처음 모양"} · 칸을 골라요</figcaption>${grid(fromCells, { role: "source", done: moved, picked: st.pick, marks: st.check?.wrongFrom || [], center: o.kind === "turn" })}</figure>
        ${single ? `<i class="smv-glass ${o.side === "left" || o.side === "right" ? "v" : "h"}" aria-hidden="true"></i>` : chip(n)}
        <figure class="smv-board target"><figcaption>${p.names.length > 1 ? `${st.step + 1}번째 결과` : "결과"} · 놓을 자리를 눌러요</figcaption>${grid(toCells, { role: "target", wrong: wrongCells, center: o.kind === "turn" })}</figure>
      </div>
      <p class="smv-rule"><b>규칙</b> ${esc(RULE[o.op])}</p>
      ${pickHint ? `<p class="smv-hint">${pickHint}</p>` : ""}
      ${st.note ? `<p class="smv-note${st.solved ? " good" : ""}" role="status">${esc(st.note)}</p>` : ""}
      <footer class="smv-actions">
        <span class="smv-count">옮긴 칸 <b>${st.moves.length}</b> / ${fromCells.length}</span>
        ${st.solved
          ? `<button type="button" class="smv-btn primary" data-smv="next">${nextLabel()} →</button>`
          : `<button type="button" class="smv-btn ghost" data-smv="undo" ${st.moves.length && !st.showing ? "" : "disabled"}>한 칸 되돌리기</button>
             ${st.tries >= 2 ? `<button type="button" class="smv-btn" data-smv="show" ${st.showing ? "disabled" : ""}>풀이 보기</button>` : ""}
             <button type="button" class="smv-btn primary" data-smv="check" ${ready && !st.showing ? "" : "disabled"}>맞는지 보기</button>`}
      </footer>
    </div>`;
  }
  function nextLabel() {
    const p = st.problem;
    if (st.step < p.names.length - 1) return "다음 움직임";
    if (st.index < LEVELS[st.level].problems.length - 1) return "다음 문제";
    return st.level < LEVELS.length - 1 ? `${LEVELS[st.level + 1].id}단계 ${LEVELS[st.level + 1].title}` : "마치기";
  }
  function renderFinale() {
    const total = LEVELS.reduce((s, l) => s + l.problems.length, 0), stars = st.stars.reduce((a, b) => a + b, 0);
    host.innerHTML = `<div class="smv smv-finale"><p class="smv-kick">뒤집고 돌리기 공방 · 완성</p><h3>세 단계를 모두 마쳤어요!</h3>
      <p class="smv-score">처음에 바로 맞힌 문제 <b>${stars}</b> / ${total}</p>
      <ul class="smv-rules">${LEVELS.map((l, k) => `<li><b>${l.id}단계 ${l.title}</b> ★ ${st.stars[k]} / ${l.problems.length}</li>`).join("")}
        <li><b>뒤집고 돌리기</b> 첫 번째 움직임의 결과를 먼저 만들고, 그 모양에 두 번째 움직임을 해요.</li></ul>
      <div class="smv-actions"><button type="button" class="smv-btn" data-smv="restart">처음부터 다시</button><button type="button" class="smv-btn primary" data-smv="done">골든벨 문제로 →</button></div></div>`;
  }

  function check() {
    const verdict = diagnose(from(), built(), name());
    if (verdict.ok) {
      st.check = null; st.solved = true;
      const last = st.step === st.problem.names.length - 1;
      if (last && st.firsts && !st.showedSolution) st.stars[st.level] += 1;
      st.note = last ? (st.firsts ? "정답! 처음에 바로 맞혔어요." : "정답! 이제 이 움직임을 알았어요.") : "중간 모양 완성! 이제 이 모양에 다음 움직임을 해요.";
      render();
      say(last ? (st.firsts ? "정답이에요! 한 번에 맞혔어요." : "맞았어요! 이제 잘 알겠죠?") : "중간 모양을 잘 만들었어요. 이제 이 모양을 움직여 봐요.", "praise");
      return;
    }
    st.tries += 1; st.firsts = false; st.hinted = true;
    const want = apply(from(), name());
    const wrongMoves = st.moves.filter((m) => !(m.to[0] === mapCell(m.from, OPS[name()].op)[0] && m.to[1] === mapCell(m.from, OPS[name()].op)[1]));
    st.check = { wrongCells: built().filter((c) => !has(want, c)).map(cid), wrongFrom: wrongMoves.map((m) => cid(m.from)) };
    st.note = `${verdict.say}${st.tries >= 2 ? " 「풀이 보기」로 칸이 옮겨 가는 모습을 볼 수 있어요." : " 이제 칸을 고르면 어디로 가는지 알려 줄게요."}`;
    render();
    say(verdict.say, "think");
  }
  function showSolution() {
    st.showing = true; st.showedSolution = true; st.firsts = false; st.moves = []; st.pick = null; st.check = null;
    const cells = from(), op = OPS[name()].op;
    let k = 0;
    const stepOne = () => {
      if (!alive) return;
      if (k >= cells.length) { st.showing = false; st.solved = true; st.note = "칸이 하나씩 이렇게 옮겨 가요. 같은 규칙으로 다음 문제를 풀어 봐요."; render(); return; }
      const cell = cells[k++];
      st.moves.push({ from: cell, to: mapCell(cell, op) });
      st.pick = null;
      render();
      timer = setTimeout(stepOne, 520);
    };
    say("한 칸씩 어디로 가는지 잘 봐요.", "talk");
    stepOne();
  }
  function next() {
    const p = st.problem;
    st.check = null;
    if (st.step < p.names.length - 1) { st.step += 1; st.solved = false; st.tries = 0; resetStep(); say(`이번에는 방금 만든 모양을 ${OPS[name()].label} 해 봐요.`, "talk"); return; }
    st.showedSolution = false;
    if (st.index < LEVELS[st.level].problems.length - 1) { st.index += 1; newProblem(); return; }
    if (st.level < LEVELS.length - 1) { st.level += 1; st.index = 0; newProblem(); return; }
    st.finale = true; render();
    say("세 단계를 모두 마쳤어요! 이제 골든벨 문제로 가요.", "praise");
  }

  host.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target || target.disabled || !host.contains(target)) return;
    if (target.dataset.level) { st.level = Number(target.dataset.level); st.index = 0; st.finale = false; newProblem(); return; }
    const role = target.dataset.role;
    if (role === "source") {
      const k = `${target.dataset.r},${target.dataset.c}`;
      st.pick = st.pick === k ? null : k;
      render(); return;
    }
    if (role === "target") {
      const cell = [Number(target.dataset.r), Number(target.dataset.c)];
      const at = st.moves.findIndex((m) => m.to[0] === cell[0] && m.to[1] === cell[1]);
      if (at >= 0) { st.moves.splice(at, 1); st.check = null; render(); return; }   // 놓은 칸을 다시 누르면 되돌린다
      if (!st.pick) return;
      const [r, c] = st.pick.split(",").map(Number);
      st.moves.push({ from: [r, c], to: cell });
      st.pick = null; st.check = null;
      render(); return;
    }
    const act = target.dataset.smv;
    if (act === "undo") { st.moves.pop(); st.check = null; render(); }
    else if (act === "check") check();
    else if (act === "show") showSolution();
    else if (act === "next") next();
    else if (act === "restart") { st.level = 0; st.index = 0; st.finale = false; st.stars = LEVELS.map(() => 0); newProblem(); }
    else if (act === "done") onDone();
  }, { signal: listening.signal });

  newProblem();
  return { dispose() { alive = false; clearTimeout(timer); listening.abort(); host.innerHTML = ""; } };
}
