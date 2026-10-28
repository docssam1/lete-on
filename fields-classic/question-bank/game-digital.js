// 디지털 숫자 공방 — 1권 1단원 2차시 「디지털 숫자를 뒤집고 돌려요」 게임(학생 차시 덱 study.html 안에 바로 뜬다).
// 원장(2026-10-24): 「우리 걸 써야 돼. 그걸 발전시켜 우리 학습에 맞는 게임으로」 → 「너무 쉬워. 실제 문제를」.
//  · 문제는 본책·문제은행 실제 문제의 네 가지다: 숫자 하나 뒤집기·반 바퀴 / 두 자리 수(자리 순서까지) / 숫자판을 돌렸을 때 똑바로 서는 수의 합 /
//    원래 수 + 뒤집어(돌려) 읽은 수. 숫자가 바뀌는 규칙은 문제은행 생성기의 함수(book01-generators.js transformDigit·transformDisplay)와 같다.
//    막대 옮기기 표(SEGMENT_MAPS)는 같은 막대 이름(a 위 · b 오른쪽 위 · c 오른쪽 아래 · d 아래 · e 왼쪽 아래 · f 왼쪽 위 · g 가운데)으로 이 파일에 두고,
//    검사기(game-digital.selftest.mjs)가 모든 숫자에서 문제은행 함수와 같은 숫자가 되는지 확인한다.
//  · 풀이를 행동으로: 「켜진 막대를 옮긴다 → 자리 순서까지 확인한다 → 읽는다」. 켜진 막대를 하나 골라 옮겨 갈 자리를 누르기를 막대마다 하고,
//    다 옮긴 뒤 「확인」. 맞으면 만든 숫자를 읽어 쓴다. 숫자판은 똑바로 설 숫자를 먼저 고르고, 판을 돌려 확인한 뒤 합을 쓴다.
//  · 틀리면 실수의 종류를 말하고(위아래·좌우를 바꿈, 자리 순서, 누운 방향), 두 번 틀리면 「풀이 보기」.
import { BOOK01_INTERNALS } from "./book01-generators.js?v=20261023h";

const { transformDigit, transformDisplay } = BOOK01_INTERNALS;
export const DIGIT_SEGMENTS = Object.freeze({ 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" });
export const SEGMENT_MAPS = Object.freeze({
  "mirror-left-right": { a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" },
  "mirror-top-bottom": { a: "d", b: "c", c: "b", d: "a", e: "f", f: "e", g: "g" },
  "rotate-half": { a: "d", b: "e", c: "f", d: "a", e: "b", f: "c", g: "g" }
});
export const OP_LABEL = { "mirror-left-right": "오른쪽으로 뒤집기", "mirror-top-bottom": "아래쪽으로 뒤집기", "rotate-half": "반 바퀴 돌리기" };
const OP_READ = { "mirror-left-right": "오른쪽으로 뒤집어 읽은 수", "rotate-half": "반 바퀴 돌려 읽은 수" };
const TURN = { "rotate-right": { steps: 1, label: "오른쪽으로 반의 반 바퀴", lie: "왼쪽" }, "rotate-left": { steps: 3, label: "왼쪽으로 반의 반 바퀴", lie: "오른쪽" }, "rotate-half": { steps: 2, label: "반 바퀴", lie: "거꾸로" } };
// 판 전체를 움직일 때 자리도 움직인다: 좌우 뒤집기·반 바퀴는 자리가 바뀌고, 위아래 뒤집기는 그대로
export const placeOf = (op, i, count) => (op === "mirror-top-bottom" ? i : count - 1 - i);
export const LEVELS = Object.freeze([
  { id: 1, title: "숫자 하나", kind: "build", problems: ["mirror-left-right", "mirror-top-bottom", "rotate-half"] },
  { id: 2, title: "두 자리 수", kind: "build", problems: ["mirror-left-right", "mirror-top-bottom", "rotate-half"] },
  { id: 3, title: "숫자판 돌리기", kind: "board", problems: ["rotate-right", "rotate-left", "rotate-half"] },
  { id: 4, title: "뒤집은 수 더하기", kind: "add", problems: ["mirror-left-right", "rotate-half"] }
]);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pick = (list, rand) => list[Math.floor(rand() * list.length)];
const shuffle = (list, rand) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// 문제 만들기(문제은행 생성기와 같은 조건: 바뀐 숫자가 디지털 숫자여야 하고, 두 자리 수는 0으로 시작하지 않고 바뀌어야 한다)
export function makeProblem(level, index, rand = Math.random) {
  const lv = LEVELS[level], op = lv.problems[index];
  if (lv.kind === "build" && lv.id === 1) {
    const pairs = Object.keys(DIGIT_SEGMENTS).map(Number).filter((d) => { const r = transformDigit(d, op); return r != null && r !== d; });
    const digit = pick(pairs, rand);
    return { kind: "build", op, digits: [digit], result: [transformDigit(digit, op)] };
  }
  if (lv.kind === "build" || lv.kind === "add") {
    const ok = Object.keys(DIGIT_SEGMENTS).map(Number).filter((d) => transformDigit(d, op) != null);
    for (let t = 0; t < 200; t++) {
      const digits = [pick(ok, rand), pick(ok, rand)];
      if (digits[0] === 0 || digits[0] === digits[1]) continue;
      const result = transformDisplay(digits, op);
      if (!result || result[0] === 0 || result.join("") === digits.join("")) continue;
      // 자리 순서 실수를 가려낼 수 있게: 순서를 안 바꾼 답이 정답과 달라야 한다(좌우·반 바퀴)
      if (op !== "mirror-top-bottom" && result[0] === result[1]) continue;
      const value = Number(digits.join("")), read = Number(result.join(""));
      return { kind: lv.kind, op, digits, result, value, read, sum: value + read };
    }
  }
  // 숫자판: 1~9를 3×3에 놓고, 돌린 뒤 똑바로 설 숫자를 2~4개 둔다
  const turn = TURN[op], digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rand), before = (4 - turn.steps) % 4;
  const count = 2 + Math.floor(rand() * 3);
  const upright = new Set(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], rand).slice(0, count));
  const cells = digits.map((digit, i) => ({ digit, orientation: upright.has(i) ? before : pick([0, 1, 2, 3].filter((o) => o !== before), rand) }));
  const targets = cells.map((c, i) => ((c.orientation + turn.steps) % 4 === 0 ? i : -1)).filter((i) => i >= 0);
  return { kind: "board", op, cells, targets, sum: targets.reduce((s, i) => s + cells[i].digit, 0) };
}

// 옮긴 막대가 맞는지: 판 전체를 op 하면 (자리 i, 막대 s) → (자리 placeOf, 막대 SEGMENT_MAPS)
export const segTarget = (op, i, seg, count) => [placeOf(op, i, count), SEGMENT_MAPS[op][seg]];
export function diagnoseBuild(p, built) {
  const count = p.digits.length;
  const want = p.digits.map(() => new Set());
  p.digits.forEach((d, i) => [...DIGIT_SEGMENTS[d]].forEach((s) => { const [j, t] = segTarget(p.op, i, s, count); want[j].add(t); }));
  const got = p.digits.map(() => new Set());
  built.forEach(([j, t]) => got[j].add(t));
  const same = (a, b) => a.every((set, k) => set.size === b[k].size && [...set].every((x) => b[k].has(x)));
  if (same(got, want)) return { ok: true };
  // 다른 움직임(op)을 했거나 자리를 바꿨/안 바꿨을 때 나오는 막대
  const shape = (op, swapPlaces) => {
    const sets = p.digits.map(() => new Set());
    p.digits.forEach((d, i) => [...DIGIT_SEGMENTS[d]].forEach((s) => { const j = swapPlaces ? count - 1 - i : i; sets[j].add(SEGMENT_MAPS[op][s]); }));
    return sets;
  };
  if (count === 2 && p.op !== "mirror-top-bottom" && same(got, shape(p.op, false))) return { ok: false, say: "막대는 맞게 옮겼는데 자리 순서가 그대로예요. 판 전체를 움직이면 왼쪽 숫자가 오른쪽 자리로 가요." };
  if (count === 2 && p.op === "mirror-top-bottom" && same(got, shape(p.op, true))) return { ok: false, say: "아래쪽으로 뒤집으면 자리는 그대로예요. 왼쪽 숫자는 왼쪽 자리에 둬요." };
  for (const [op, say] of [["mirror-top-bottom", "위와 아래를 바꿨어요. 오른쪽으로 뒤집으면 왼쪽 막대와 오른쪽 막대만 바뀌어요."], ["mirror-left-right", "왼쪽과 오른쪽을 바꿨어요. 아래쪽으로 뒤집으면 위 막대와 아래 막대가 바뀌어요."], ["rotate-half", "반 바퀴를 돌렸어요. 뒤집기는 한 방향만 바꿔요."]]) {
    if (op === p.op) continue;
    for (const swap of [false, true]) if (same(got, shape(op, swap))) return { ok: false, say: p.op === "rotate-half" && op !== "rotate-half" ? "한 방향만 뒤집었어요. 반 바퀴는 위아래도 좌우도 모두 바뀌어요." : say };
  }
  const wrong = built.filter(([j, t]) => !want[j].has(t)).length;
  return { ok: false, wrong, say: `옮긴 막대 중 ${wrong}개의 자리가 달라요. 규칙을 보고 막대마다 다시 따라가 봐요.` };
}

// 7막대 숫자 그림. role: show(보기만) · source(옮길 막대 고르기) · target(놓기)
const SEG = { a: "12,6 48,6 44,12 16,12", b: "50,9 50,47 46,44 46,13", c: "50,53 50,91 46,87 46,56", d: "12,94 48,94 44,88 16,88", e: "10,53 14,56 14,87 10,91", f: "10,9 14,13 14,44 10,47", g: "14,50 18,46 42,46 46,50 42,54 18,54" };
function digitSvg({ lit = "", role = "show", place = 0, picked = null, moved = [], placed = [], wrong = [], small = false }) {
  const parts = Object.entries(SEG).map(([s, pts]) => {
    const on = lit.includes(s), isPlaced = placed.includes(s);
    const cls = ["seg", on ? "on" : "", isPlaced ? "placed" : "", moved.includes(s) ? "moved" : "", picked === `${place}${s}` ? "picked" : "", wrong.includes(s) ? "wrong" : ""].filter(Boolean).join(" ");
    const act = (role === "source" && on && !moved.includes(s)) || role === "target";
    return `<polygon class="${cls}" points="${pts}" data-s="${s}" ${act ? `data-seg="${s}" data-place="${place}" data-role="${role}" tabindex="0" role="button" aria-label="${place + 1}째 자리 ${s} 막대"` : ""}/>`;
  }).join("");
  return `<svg class="dg-digit${small ? " small" : ""}${role === "target" ? " target" : ""}" viewBox="0 0 60 100" aria-hidden="${role === "show" ? "true" : "false"}">${parts}</svg>`;
}

export function mountDigitalWorkshop(host, { say = () => {}, onDone = () => {} } = {}) {
  const listening = new AbortController();
  let alive = true, timer = 0;
  const st = { level: 0, index: 0, p: null, phase: "build", moves: [], pick: null, tries: 0, note: "", hint: "", typed: "", stars: LEVELS.map(() => 0), first: true, picked: new Set(), turned: false, finale: false };

  function newProblem() {
    st.p = makeProblem(st.level, st.index);
    st.phase = st.p.kind === "build" ? "build" : st.p.kind === "board" ? "choose" : "read";
    st.moves = []; st.pick = null; st.tries = 0; st.note = ""; st.hint = ""; st.typed = ""; st.first = true; st.picked = new Set(); st.turned = false; st.check = null;
    render();
    const p = st.p;
    say(p.kind === "build" ? `켜진 막대를 하나 골라서 ${OP_LABEL[p.op]} 하면 어디로 가는지 옮겨 놓아 봐요.` : p.kind === "board" ? `숫자판을 ${TURN[p.op].label} 돌리면 똑바로 서는 숫자를 모두 골라 봐요.` : `${p.value}을 ${OP_LABEL[p.op].replace(" 돌리기", " 돌려")} 읽은 수부터 써 봐요.`, "talk");
  }
  const lit = (i) => DIGIT_SEGMENTS[st.p.digits[i]];

  function render() {
    if (!alive) return;
    if (st.finale) return renderFinale();
    const p = st.p, lv = LEVELS[st.level];
    let body = "";
    if (p.kind === "build") {
      const count = p.digits.length;
      const moved = (i) => st.moves.filter((m) => m.from[0] === i).map((m) => m.from[1]);
      const placed = (j) => st.moves.filter((m) => m.to[0] === j).map((m) => m.to[1]);
      const wrongTo = (j) => (st.check?.wrongTo || []).filter(([k]) => k === j).map(([, s]) => s);
      const total = p.digits.reduce((s, d) => s + DIGIT_SEGMENTS[d].length, 0);
      const reading = st.phase === "read";
      body = `<p class="dg-mission">${count === 1 ? `디지털 숫자 <b>${p.digits[0]}</b>의 숫자판을 <b>${OP_LABEL[p.op]}</b> 했어요.` : `두 자리 수 <b>${p.digits.join("")}</b>의 숫자판을 <b>${OP_LABEL[p.op]}</b> 했어요.`} ${reading ? "만든 숫자를 읽어 써요." : "켜진 막대를 옮겨 결과를 만들어요."}</p>
        <div class="dg-work">
          <figure class="dg-panel"><figcaption>처음 · 막대를 골라요</figcaption><div class="dg-digits">${p.digits.map((d, i) => digitSvg({ lit: lit(i), role: reading ? "show" : "source", place: i, picked: st.pick, moved: moved(i) })).join("")}</div></figure>
          <span class="dg-op">${opIcon(p.op)}<b>${OP_LABEL[p.op]}</b><small>${p.op === "mirror-top-bottom" ? "자리는 그대로" : count === 2 ? "자리도 바뀌어요" : ""}</small></span>
          <figure class="dg-panel target"><figcaption>결과 · 놓을 자리를 눌러요</figcaption><div class="dg-digits">${p.digits.map((_, j) => digitSvg({ lit: placed(j).join(""), role: reading ? "show" : "target", place: j, placed: placed(j), wrong: wrongTo(j) })).join("")}</div></figure>
        </div>
        <p class="dg-rule"><b>규칙</b> ${p.op === "mirror-left-right" ? "왼쪽 막대 ↔ 오른쪽 막대(위·가운데·아래 막대는 그대로)" : p.op === "mirror-top-bottom" ? "위 막대 ↔ 아래 막대, 위쪽 세로 막대 ↔ 아래쪽 세로 막대(가운데는 그대로)" : "위 ↔ 아래, 왼쪽 위 ↔ 오른쪽 아래, 오른쪽 위 ↔ 왼쪽 아래(가운데는 그대로)"}${count === 2 && p.op !== "mirror-top-bottom" ? " · 자리도 바뀌어요." : ""}</p>
        ${reading ? keypad(count, "만든 숫자") : `<div class="dg-actions"><span class="dg-count">옮긴 막대 <b>${st.moves.length}</b> / ${total}</span><button type="button" class="dg-btn ghost" data-dg="undo" ${st.moves.length ? "" : "disabled"}>한 막대 되돌리기</button>${st.tries >= 2 ? '<button type="button" class="dg-btn" data-dg="show">풀이 보기</button>' : ""}<button type="button" class="dg-btn primary" data-dg="check" ${st.moves.length === total ? "" : "disabled"}>맞는지 보기</button></div>`}`;
    } else if (p.kind === "board") {
      const turn = TURN[p.op];
      body = `<p class="dg-mission">숫자판을 <b>${turn.label}</b> 돌렸을 때 ${st.phase === "sum" ? "똑바로 선 수들의 합을 써요." : "똑바로 서는 숫자를 모두 골라요."}</p>
        <div class="dg-work board">
          <div class="dg-board${st.turned ? " turned" : ""}" style="--turn:${turn.steps * 90}deg">${p.cells.map((c, i) => `<button type="button" class="dg-cell${st.picked.has(i) ? " picked" : ""}${st.turned && p.targets.includes(i) ? " upright" : ""}${(st.check?.wrong || []).includes(i) ? " wrong" : ""}" data-cell="${i}" ${st.phase === "choose" ? "" : "disabled"} aria-label="${c.digit}"><span style="--o:${c.orientation * 90}deg">${digitSvg({ lit: DIGIT_SEGMENTS[c.digit], small: true })}</span></button>`).join("")}</div>
          <span class="dg-op">${opIcon(p.op)}<b>${turn.label}</b><small>판 전체를</small></span>
        </div>
        <p class="dg-rule"><b>규칙</b> ${turn.label} 돌리면 똑바로 서는 숫자는 지금 <b>${turn.lie === "거꾸로" ? "거꾸로 선" : `머리가 ${turn.lie}을 향해 누운`}</b> 숫자예요.</p>
        ${st.phase === "sum" ? keypad(2, "합") : `<div class="dg-actions"><span class="dg-count">고른 숫자 <b>${st.picked.size}</b>개</span>${st.tries >= 2 ? '<button type="button" class="dg-btn" data-dg="show">풀이 보기</button>' : ""}<button type="button" class="dg-btn primary" data-dg="check" ${st.picked.size ? "" : "disabled"}>판 돌려 보기</button></div>`}`;
    } else {
      const label = OP_READ[p.op];
      body = `<p class="dg-mission">두 자리 수와 <b>${label}</b>를 더해요. ${st.phase === "read" ? `먼저 ${label}를 써요.` : "이제 덧셈 결과를 써요."}</p>
        <div class="dg-work add">
          <figure class="dg-panel"><figcaption>원래 수</figcaption><div class="dg-digits">${p.digits.map((d) => digitSvg({ lit: DIGIT_SEGMENTS[d] })).join("")}</div></figure>
          <span class="dg-plus">+</span>
          <figure class="dg-panel target"><figcaption>${label}</figcaption><div class="dg-digits">${st.phase === "sum" || st.phase === "done" ? p.result.map((d) => digitSvg({ lit: DIGIT_SEGMENTS[d], role: "show", placed: [...DIGIT_SEGMENTS[d]] })).join("") : '<span class="dg-q">?</span>'}</div></figure>
          <span class="dg-plus">=</span><span class="dg-q">${st.phase === "done" ? p.sum : "?"}</span>
        </div>
        <p class="dg-rule"><b>규칙</b> ${p.op === "mirror-left-right" ? "오른쪽으로 뒤집으면 막대가 좌우로 바뀌고, 자리도 바뀌어요." : "반 바퀴 돌리면 막대가 위아래·좌우로 모두 바뀌고, 자리도 바뀌어요."}</p>
        ${keypad(st.phase === "read" ? 2 : 3, st.phase === "read" ? label : "합")}`;
    }
    host.innerHTML = `<div class="dg">
      <header class="dg-top"><nav class="dg-levels">${LEVELS.map((l, k) => `<button type="button" class="${k === st.level ? "on" : ""}" data-level="${k}"><b>${l.id}</b>${l.title}${st.stars[k] ? ` <small>★${st.stars[k]}</small>` : ""}</button>`).join("")}</nav><span class="dg-right"><span class="dg-dots">${lv.problems.map((_, k) => `<i class="${k < st.index ? "done" : k === st.index ? "on" : ""}"></i>`).join("")}</span>${st.phase === "done" ? "" : '<button type="button" class="dg-skip" data-dg="skip">넘어가기 ›</button>'}</span></header>
      ${body}
      ${st.hint ? `<p class="dg-hint">${esc(st.hint)}</p>` : ""}
      ${st.note ? `<p class="dg-note${st.phase === "done" ? " good" : ""}" role="status">${esc(st.note)}</p>` : ""}
      ${st.phase === "done" ? `<div class="dg-actions"><button type="button" class="dg-btn primary" data-dg="next">${nextLabel()} →</button></div>` : ""}
    </div>`;
  }
  function keypad(maxLen, label) {
    if (st.phase === "done") return "";
    return `<div class="dg-pad"><span class="dg-typed" aria-label="${esc(label)}">${esc(st.typed) || "&nbsp;"}</span>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => `<button type="button" class="dg-key" data-key="${n}" ${st.typed.length >= maxLen ? "disabled" : ""}>${n}</button>`).join("")}<button type="button" class="dg-key" data-key="del">지우기</button><button type="button" class="dg-btn primary" data-dg="answer" ${st.typed ? "" : "disabled"}>답 내기</button></div>`;
  }
  function opIcon(op) {
    if (op === "mirror-left-right") return '<i class="dg-glass v"></i>';
    if (op === "mirror-top-bottom") return '<i class="dg-glass h"></i>';
    const left = op === "rotate-left";
    return `<svg class="dg-turn" viewBox="0 0 40 40" aria-hidden="true"><path d="${left ? "M28 10 A12 12 0 1 0 32 22" : "M12 10 A12 12 0 1 1 8 22"}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="${left ? "M33 4 L28 10 L35 13" : "M7 4 L12 10 L5 13"}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function nextLabel() {
    if (st.index < LEVELS[st.level].problems.length - 1) return "다음 문제";
    return st.level < LEVELS.length - 1 ? `${LEVELS[st.level + 1].id}단계 ${LEVELS[st.level + 1].title}` : "마치기";
  }
  function renderFinale() {
    const total = LEVELS.reduce((s, l) => s + l.problems.length, 0), stars = st.stars.reduce((a, b) => a + b, 0);
    host.innerHTML = `<div class="dg dg-finale"><p class="dg-kick">디지털 숫자 공방 · 완성</p><h3>네 단계를 모두 마쳤어요!</h3><p class="dg-score">처음에 바로 맞힌 문제 <b>${stars}</b> / ${total}</p>
      <ul class="dg-rules">${LEVELS.map((l, k) => `<li><b>${l.id}단계 ${l.title}</b> ★ ${st.stars[k]} / ${l.problems.length}</li>`).join("")}<li><b>기억해요</b> 판 전체를 오른쪽으로 뒤집거나 반 바퀴 돌리면 막대도, 자리 순서도 바뀌어요.</li></ul>
      <div class="dg-actions"><button type="button" class="dg-btn" data-dg="restart">처음부터 다시</button><button type="button" class="dg-btn primary" data-dg="done">워밍업 문제로 →</button></div></div>`;
  }
  function solved(msg) {
    st.phase = "done";
    if (st.first) st.stars[st.level] += 1;
    st.note = st.first ? `정답! ${msg}` : `맞았어요. ${msg}`;
    st.hint = ""; render();
    say(st.first ? "정답이에요! 한 번에 맞혔어요." : "맞았어요! 이제 알겠죠?", "praise");
  }
  function miss(text) {
    st.tries += 1; st.first = false;
    st.note = `${text}${st.tries >= 2 && st.phase !== "read" && st.phase !== "sum" ? " 「풀이 보기」를 누르면 풀이를 볼 수 있어요." : ""}`;
    render(); say(text, "think");
  }
  function checkBuild() {
    const v = diagnoseBuild(st.p, st.moves.map((m) => m.to));
    if (v.ok) { st.phase = "read"; st.typed = ""; st.note = "막대를 바르게 옮겼어요! 이제 만든 숫자를 읽어 써요."; st.check = null; st.hint = ""; render(); say("막대를 바르게 옮겼어요. 무슨 숫자가 됐는지 읽어 봐요.", "praise"); return; }
    st.check = { wrongTo: st.moves.filter((m) => { const [j, t] = segTarget(st.p.op, m.from[0], m.from[1], st.p.digits.length); return j !== m.to[0] || t !== m.to[1]; }).map((m) => m.to) };
    st.hint = "이제 막대를 고르면 어디로 가는지 알려 줄게요.";
    miss(v.say);
  }
  function answer() {
    const p = st.p, n = Number(st.typed);
    if (p.kind === "build") {
      const want = Number(p.result.join(""));
      if (n === want) return solved(`${p.digits.join("")} → ${OP_LABEL[p.op]} → ${want}`);
      st.typed = ""; return miss(p.digits.length === 2 && n === Number([...p.result].reverse().join("")) ? "만든 판을 왼쪽 자리부터 읽어요." : "만든 막대 모양을 다시 보고 읽어 봐요.");
    }
    if (p.kind === "board") {
      if (n === p.sum) return solved(`똑바로 선 수: ${p.targets.map((i) => p.cells[i].digit).join(" + ")} = ${p.sum}`);
      st.typed = ""; return miss("똑바로 선 숫자들만 다시 더해 봐요.");
    }
    if (st.phase === "read") {
      if (n === p.read) { st.phase = "sum"; st.typed = ""; st.note = `${p.value}의 ${OP_READ[p.op]}는 ${p.read}이에요. 이제 더해요.`; render(); say("맞아요. 이제 두 수를 더해 봐요.", "praise"); return; }
      st.typed = "";
      return miss(n === Number(p.result.slice().reverse().join("")) ? "숫자 하나하나는 맞았는데 자리 순서가 그대로예요. 판 전체를 움직이면 자리도 바뀌어요." : "막대를 하나씩 옮겨 본다고 생각하고 다시 읽어 봐요.");
    }
    if (n === p.sum) return solved(`${p.value} + ${p.read} = ${p.sum}`);
    st.typed = ""; miss("덧셈을 다시 해 봐요. 일의 자리부터 더해요.");
  }
  function checkBoard() {
    const p = st.p, chosen = [...st.picked];
    const missing = p.targets.filter((i) => !st.picked.has(i)), extra = chosen.filter((i) => !p.targets.includes(i));
    if (!missing.length && !extra.length) {
      st.turned = true; st.phase = "sum"; st.typed = ""; st.check = null; st.note = "맞아요! 판을 돌려 보니 고른 숫자가 똑바로 섰어요. 이제 합을 써요.";
      render(); say("판을 돌려 보니 고른 숫자가 똑바로 섰어요. 이제 더해 봐요.", "praise"); return;
    }
    st.check = { wrong: extra };
    miss(extra.length ? `${extra.length}개는 돌리면 똑바로 서지 않아요(표시한 숫자). ${missing.length ? `빠진 숫자도 ${missing.length}개 있어요.` : ""}` : `똑바로 서는 숫자가 ${missing.length}개 더 있어요.`);
  }
  function showSolution() {
    const p = st.p;
    st.first = false;
    if (p.kind === "board") { st.picked = new Set(p.targets); st.turned = true; st.phase = "sum"; st.typed = ""; st.check = null; st.note = `판을 돌리면 이 숫자들이 똑바로 서요. 이제 합을 써요.`; render(); return; }
    st.moves = []; st.check = null;
    const all = p.digits.flatMap((d, i) => [...DIGIT_SEGMENTS[d]].map((s) => [i, s]));
    let k = 0;
    const step = () => {
      if (!alive) return;
      if (k >= all.length) { st.phase = "read"; st.typed = ""; st.note = "막대가 이렇게 옮겨 가요. 만든 숫자를 읽어 써요."; render(); return; }
      const [i, s] = all[k++];
      st.moves.push({ from: [i, s], to: segTarget(p.op, i, s, p.digits.length) });
      render(); timer = setTimeout(step, 380);
    };
    say("막대가 하나씩 어디로 가는지 잘 봐요.", "talk"); step();
  }
  function next() {
    if (st.index < LEVELS[st.level].problems.length - 1) { st.index += 1; newProblem(); return; }
    if (st.level < LEVELS.length - 1) { st.level += 1; st.index = 0; newProblem(); return; }
    st.finale = true; render(); say("네 단계를 모두 마쳤어요! 이제 워밍업 문제로 가요.", "praise");
  }

  host.addEventListener("click", (event) => {
    const segEl = event.target.closest("[data-seg]");
    if (segEl && host.contains(segEl)) {
      const place = Number(segEl.dataset.place), seg = segEl.dataset.seg;
      if (segEl.dataset.role === "source") {
        const k = `${place}${seg}`;
        st.pick = st.pick === k ? null : k;
        if (st.pick && st.tries > 0) { const [j, t] = segTarget(st.p.op, place, seg, st.p.digits.length); st.hint = `고른 막대(${place + 1}째 자리 ${segName(seg)}) → ${OP_LABEL[st.p.op]} 하면 ${j + 1}째 자리 ${segName(t)}`; }
        render(); return;
      }
      const at = st.moves.findIndex((m) => m.to[0] === place && m.to[1] === seg);
      if (at >= 0) { st.moves.splice(at, 1); st.check = null; render(); return; }
      if (!st.pick) return;
      st.moves.push({ from: [Number(st.pick[0]), st.pick.slice(1)], to: [place, seg] });
      st.pick = null; st.check = null; render(); return;
    }
    const target = event.target.closest("button");
    if (!target || target.disabled || !host.contains(target)) return;
    if (target.dataset.level) { st.level = Number(target.dataset.level); st.index = 0; st.finale = false; newProblem(); return; }
    if (target.dataset.cell) { const i = Number(target.dataset.cell); st.picked.has(i) ? st.picked.delete(i) : st.picked.add(i); st.check = null; render(); return; }
    if (target.dataset.key) { st.typed = target.dataset.key === "del" ? st.typed.slice(0, -1) : st.typed + target.dataset.key; render(); return; }
    const act = target.dataset.dg;
    if (act === "undo") { st.moves.pop(); st.check = null; render(); }
    else if (act === "check") (st.p.kind === "board" ? checkBoard : checkBuild)();
    else if (act === "answer") answer();
    else if (act === "show") showSolution();
    else if (act === "next") next();
    else if (act === "skip") { clearTimeout(timer); next(); }   // 넘어가기: 별 없이 다음 문제로
    else if (act === "restart") { st.level = 0; st.index = 0; st.finale = false; st.stars = LEVELS.map(() => 0); newProblem(); }
    else if (act === "done") onDone();
  }, { signal: listening.signal });

  newProblem();
  return { dispose() { alive = false; clearTimeout(timer); listening.abort(); host.innerHTML = ""; } };
}
const SEG_NAME = { a: "위 막대", b: "오른쪽 위 막대", c: "오른쪽 아래 막대", d: "아래 막대", e: "왼쪽 아래 막대", f: "왼쪽 위 막대", g: "가운데 막대" };
const segName = (s) => SEG_NAME[s];
