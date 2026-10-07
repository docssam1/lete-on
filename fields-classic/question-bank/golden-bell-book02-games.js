import { esc, reduced } from "./golden-bell-game-fx.js?v=20261004a";
import { MATRIX, BALANCE, PATTERN, SUDOKU, SHAPES, COLORS, BALANCE_ITEMS, beadAt, beadName, matrixHolds, sudokuValid } from "./golden-bell-book02-game-models.js?v=20261004a";

// 2권 레벨 게임 4종의 화면. 문제 규칙은 golden-bell-book02-game-models.js, 틀(레벨·별·저장)은 golden-bell-level-game.js.

const HEX = { red: "#e2504c", blue: "#2f7de1", yellow: "#f2b52e", green: "#2fb36b", purple: "#9b6bdf", ink: "#1d3446" };
const SHAPE_NAME = Object.fromEntries(SHAPES.map((s) => [s.id, s.name]));
const COLOR_NAME = Object.fromEntries(COLORS.map((c) => [c.id, c.name]));
const SHAPE_COLOR = { circle: "#2f7de1", triangle: "#e5781a", square: "#2fb36b", star: "#d4a017", heart: "#e2504c" };
const PATHS = {
  circle: '<circle cx="50" cy="50" r="38"/>',
  triangle: '<path d="M50 12 L88 82 H12 Z"/>',
  square: '<rect x="15" y="15" width="70" height="70" rx="8"/>',
  star: '<path d="M50 8 L61 38 L93 39 L68 59 L77 90 L50 72 L23 90 L32 59 L7 39 L39 38 Z"/>',
  heart: '<path d="M50 86 C20 64 8 46 14 30 C20 14 42 12 50 28 C58 12 80 14 86 30 C92 46 80 64 50 86 Z"/>'
};
export const shapeSvg = (shape, color = SHAPE_COLOR[shape], label = SHAPE_NAME[shape]) => `<svg class="lg-shape" viewBox="0 0 100 100" role="img" aria-label="${esc(label)}"><g fill="${color}" stroke="rgba(0,0,0,.22)" stroke-width="4" stroke-linejoin="round">${PATHS[shape]}</g><ellipse cx="38" cy="32" rx="14" ry="8" fill="#fff" opacity=".35"/></svg>`;
const beadSvg = (b) => shapeSvg(b.shape, HEX[b.color], beadName(b));
const pad = (values, attr, { disabled = false } = {}) => `<div class="lg-pad" role="group" aria-label="수 고르기">${values.map((v) => `<button type="button" class="lg-key" ${attr}="${v}" ${disabled ? "disabled" : ""}>${v}</button>`).join("")}</div>`;
const josaI = (n) => `${n}${[2, 4, 5, 9].includes(n % 10) && n !== 10 ? "" : "이"}`;

// ───────────────────────── 도형 값 찾기 ─────────────────────────
function matrixBoard({ stage, controls, sound }) {
  let p, api, values, active = 0, checking = false, locked = false;
  const draw = () => {
    const val = (s) => values[p.shapes.indexOf(s)];
    const known = (list) => list.every((s) => val(s) !== null);
    const mark = (ok, has) => (checking && has ? (ok ? " ok" : " no") : "");
    if (p.kind === "grid") {
      const n = p.grid.length;
      const cells = p.grid.map((row, r) => `${row.map((s) => `<div class="lg-cell">${shapeSvg(s)}${val(s) !== null ? `<b class="lg-cell-val">${val(s)}</b>` : ""}</div>`).join("")}<div class="lg-sum row${mark(row.reduce((a, s) => a + (val(s) ?? 0), 0) === p.rowSums[r], known(row))}">${p.rowSums[r]}</div>`).join("");
      const cols = p.colSums.map((sum, c) => `<div class="lg-sum col${mark(p.grid.reduce((a, row) => a + (val(row[c]) ?? 0), 0) === sum, known(p.grid.map((row) => row[c])))}">${sum}</div>`).join("");
      stage.innerHTML = `<div class="lg-matrix" style="--n:${n}" role="img" aria-label="${n}×${n} 표, 가로 합 ${p.rowSums.join(", ")}, 세로 합 ${p.colSums.join(", ")}">${cells}${cols}<div class="lg-sum corner" aria-hidden="true">합</div></div>`;
    } else {
      stage.innerHTML = `<div class="lg-eqs">${p.equations.map((e) => {
        const has = known([e.a, e.b]); const got = (val(e.a) ?? 0) + (e.op === "-" ? -(val(e.b) ?? 0) : (val(e.b) ?? 0));
        return `<div class="lg-eq${mark(got === e.result, has)}"><span class="lg-tok">${shapeSvg(e.a)}${val(e.a) !== null ? `<b>${val(e.a)}</b>` : ""}</span><span class="lg-op">${e.op === "-" ? "−" : "+"}</span><span class="lg-tok">${shapeSvg(e.b)}${val(e.b) !== null ? `<b>${val(e.b)}</b>` : ""}</span><span class="lg-op">=</span><span class="lg-res">${e.result}</span></div>`;
      }).join("")}</div>`;
    }
    const range = Array.from({ length: p.hi - p.lo + 1 }, (_, i) => p.lo + i);
    controls.innerHTML = `<p class="cg-ask">도형을 누르고 값을 고르세요.</p><div class="lg-slots" role="group" aria-label="도형 값">${p.shapes.map((s, i) => `<button type="button" class="lg-slot${i === active ? " active" : ""}" data-b2-slot="${i}" aria-pressed="${i === active}" aria-label="${SHAPE_NAME[s]} 값 ${values[i] ?? "빈칸"}" ${locked ? "disabled" : ""}>${shapeSvg(s)}<b>${values[i] ?? "?"}</b></button>`).join("")}</div>${pad(range, "data-b2-num", { disabled: locked })}<div class="cg-actions"><button type="button" class="cg-secondary" data-b2-clear ${locked ? "disabled" : ""}>지우기</button><button type="button" class="cg-primary" data-b2-check ${locked || values.some((v) => v === null) ? "disabled" : ""}>확인!</button></div>`;
  };
  const onClick = (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled || locked) return;
    if (t.dataset.b2Slot !== undefined) { active = Number(t.dataset.b2Slot); draw(); }
    else if (t.dataset.b2Num !== undefined) {
      sound.tick();
      values[active] = Number(t.dataset.b2Num);
      const nextEmpty = values.findIndex((v) => v === null);
      if (nextEmpty >= 0) active = nextEmpty;
      draw();
    } else if (t.dataset.b2Clear !== undefined) { values[active] = null; draw(); }
    else if (t.dataset.b2Check !== undefined) {
      const ok = MATRIX.check(p, values);
      if (!ok) { checking = true; draw(); }
      api.answer(ok, { values: [...values] });
    }
  };
  controls.addEventListener("click", onClick);
  return {
    show(problem, a) { p = problem; api = a; values = p.shapes.map(() => null); active = 0; checking = false; locked = false; draw(); },
    reveal(problem, done) { values = [...problem.answer]; checking = true; locked = true; draw(); setTimeout(done, reduced() ? 0 : 500); },
    lock(on) { locked = on; checking = checking || on; draw(); },
    dispose() { controls.removeEventListener("click", onClick); }
  };
}
const shapesText = (p) => p.shapes.map((s) => SHAPE_NAME[s]).join(", ");
const MATRIX_GAME = {
  ...MATRIX,
  coach: (p) => (p.kind === "grid" ? "같은 도형이 많이 있는 줄부터 봐. 그 줄로 한 도형의 값을 먼저 찾아." : "같은 도형 두 개가 더해진 식부터! 그 도형의 값을 먼저 알 수 있어."),
  mission: (p) => (p.kind === "grid" ? `가로 합과 세로 합을 보고 <b class="cw">${esc(shapesText(p))}</b>의 값을 찾으세요.` : `같은 도형은 같은 수예요. <b class="cw">${esc(shapesText(p))}</b>의 값을 찾으세요.`),
  hint: (p) => (p.kind === "grid" ? "초록은 맞는 합, 빨강은 안 맞는 합이야. 빨간 줄의 도형 값을 다시 생각해 봐." : "초록 식은 맞고 빨간 식이 안 맞아. 빨간 식에 들어간 도형을 다시 봐."),
  success: (p) => `맞았어! ${p.shapes.map((s, i) => `${SHAPE_NAME[s]} ${p.answer[i]}`).join(", ")}.`,
  reveal: (p) => `정답은 ${p.shapes.map((s, i) => `${SHAPE_NAME[s]} ${p.answer[i]}`).join(", ")}이야. 초록 줄이 모두 맞는지 봐.`,
  createBoard: matrixBoard
};

// ───────────────────────── 무게 줄 세우기 ─────────────────────────
const ITEM_HEX = ["#2f7de1", "#e5781a", "#2fb36b", "#9b6bdf", "#e2504c"];
const ballSvg = (i) => `<svg class="lg-ball" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" fill="${ITEM_HEX[i]}" stroke="rgba(0,0,0,.2)" stroke-width="3"/><ellipse cx="22" cy="20" rx="9" ry="5" fill="#fff" opacity=".4"/><text x="30" y="38" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">${BALANCE_ITEMS[i]}</text></svg>`;
// 접시 위 구슬은 저울 그림 안에 직접 그린다(겹친 svg는 위치가 틀어진다).
const panBall = (i, cx, cy) => `<circle cx="${cx}" cy="${cy}" r="15" fill="${ITEM_HEX[i]}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="${cx - 5}" cy="${cy - 6}" rx="6" ry="3.5" fill="#fff" opacity=".45"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">${BALANCE_ITEMS[i]}</text>`;
function scaleSvg(s, k) {
  const tilt = s.heavy === "left" ? -11 : 11;
  return `<figure class="lg-scale" style="--tilt:${tilt}deg;--delay:${k * 120}ms" role="img" aria-label="${BALANCE_ITEMS[s.left]}와 ${BALANCE_ITEMS[s.right]}를 단 저울, ${BALANCE_ITEMS[s.heavy === "left" ? s.left : s.right]} 쪽이 아래로"><svg viewBox="0 0 200 130"><path d="M100 44 L82 118 H118 Z" fill="#8a6a3d"/><rect x="70" y="114" width="60" height="10" rx="4" fill="#6b5130"/><g class="lg-beam"><rect x="22" y="38" width="156" height="9" rx="4" fill="#b88a4a"/><g class="lg-pan l"><path d="M34 46 L22 82 M34 46 L46 82" stroke="#6b5130" stroke-width="2"/><path d="M14 82 H54 Q50 96 34 96 Q18 96 14 82 Z" fill="#d9b679"/>${panBall(s.left, 34, 68)}</g><g class="lg-pan r"><path d="M166 46 L154 82 M166 46 L178 82" stroke="#6b5130" stroke-width="2"/><path d="M146 82 H186 Q182 96 166 96 Q150 96 146 82 Z" fill="#d9b679"/>${panBall(s.right, 166, 68)}</g></g><circle cx="100" cy="42" r="7" fill="#6b5130"/></svg></figure>`;
}
function balanceBoard({ stage, controls, sound }) {
  let p, api, slots = [], locked = false, wrongPick = new Set();
  const draw = (first = false) => {
    if (first) {
      stage.innerHTML = `<div class="lg-scales${p.scales.length > 4 ? " many" : ""}">${p.scales.map(scaleSvg).join("")}</div>`;
      if (!reduced()) requestAnimationFrame(() => stage.querySelectorAll(".lg-scale").forEach((f) => f.classList.add("tilted")));
      else stage.querySelectorAll(".lg-scale").forEach((f) => f.classList.add("tilted"));
    }
    const items = p.items;
    if (p.kind !== "order") {
      controls.innerHTML = `<p class="cg-ask">${p.kind === "pick" ? "더 무거운 것을 누르세요." : "가장 가벼운 것을 누르세요."}</p><div class="lg-items">${items.map((i) => `<button type="button" class="lg-item" data-b2-item="${i}" aria-label="${BALANCE_ITEMS[i]}" ${locked || wrongPick.has(i) ? "disabled" : ""} ${wrongPick.has(i) ? 'data-state="bad"' : ""}>${ballSvg(i)}</button>`).join("")}</div>`;
      return;
    }
    controls.innerHTML = `<p class="cg-ask">무거운 것부터 차례로 누르세요.</p><ol class="lg-podium" aria-label="무거운 순서">${items.map((_, k) => `<li><span class="lg-rank">${k === 0 ? "가장 무거움" : k === p.n - 1 ? "가장 가벼움" : `${k + 1}번째`}</span><button type="button" class="lg-podium-slot" data-b2-slot="${k}" aria-label="${k + 1}번째 자리 ${slots[k] === undefined ? "빈칸" : BALANCE_ITEMS[slots[k]]}" ${locked || slots[k] === undefined ? "disabled" : ""}>${slots[k] === undefined ? "" : ballSvg(slots[k])}</button></li>`).join("")}</ol><div class="lg-items">${items.map((i) => `<button type="button" class="lg-item" data-b2-item="${i}" aria-label="${BALANCE_ITEMS[i]}" ${locked || slots.includes(i) ? "disabled" : ""}>${ballSvg(i)}</button>`).join("")}</div><div class="cg-actions"><button type="button" class="cg-secondary" data-b2-clear ${locked || !slots.length ? "disabled" : ""}>다시 놓기</button><button type="button" class="cg-primary" data-b2-check ${locked || slots.length < p.n ? "disabled" : ""}>확인!</button></div>`;
  };
  const onClick = (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled || locked) return;
    if (t.dataset.b2Item !== undefined) {
      const i = Number(t.dataset.b2Item);
      sound.tick();
      if (p.kind !== "order") {
        const ok = i === p.answer;
        if (!ok) wrongPick.add(i);
        draw();
        api.answer(ok, { item: i });
        return;
      }
      slots.push(i);
      draw();
    } else if (t.dataset.b2Slot !== undefined) { slots = slots.slice(0, Number(t.dataset.b2Slot)); draw(); }
    else if (t.dataset.b2Clear !== undefined) { slots = []; draw(); }
    else if (t.dataset.b2Check !== undefined) api.answer(BALANCE.check(p, slots), { slots: [...slots] });
  };
  controls.addEventListener("click", onClick);
  return {
    show(problem, a) { p = problem; api = a; slots = []; locked = false; wrongPick = new Set(); draw(true); },
    reveal(problem, done) { slots = Array.isArray(problem.answer) ? [...problem.answer] : slots; locked = true; draw(); if (!Array.isArray(problem.answer)) controls.querySelector(`[data-b2-item="${problem.answer}"]`)?.setAttribute("data-state", "good"); setTimeout(done, reduced() ? 0 : 500); },
    lock(on) { locked = on; draw(); if (on && !Array.isArray(p.answer)) controls.querySelector(`[data-b2-item="${p.answer}"]`)?.setAttribute("data-state", "good"); },
    dispose() { controls.removeEventListener("click", onClick); }
  };
}
const BALANCE_GAME = {
  ...BALANCE,
  coach: (p) => (p.kind === "pick" ? "저울은 무거운 쪽이 아래로 내려가." : p.kind === "lightest" ? "한 번도 아래로 내려가지 않은 것이 가장 가벼울 수 있어. 저울을 하나씩 봐." : "한 번도 위로 올라가지 않은 것이 가장 무거워. 거기서부터 이어 봐."),
  mission: (p) => (p.kind === "pick" ? "어느 쪽이 더 무거울까요?" : p.kind === "lightest" ? `저울 ${p.scales.length}개를 보고 <b class="cw">가장 가벼운 것</b>을 찾으세요.` : `저울 ${p.scales.length}개를 보고 <b class="cw">무거운 순서</b>로 세우세요.`),
  hint: (p) => (p.kind === "order" ? "저울마다 아래로 내려간 쪽이 더 무거워. 첫 자리는 어떤 저울에서도 올라가지 않은 것이야." : "아래로 내려간 쪽을 다시 봐. 내려간 쪽이 더 무거워."),
  success: (p) => (p.kind === "order" ? `맞았어! ${p.answer.map((i) => BALANCE_ITEMS[i]).join(" > ")} 순서야.` : `맞았어! ${BALANCE_ITEMS[p.answer]}${p.kind === "pick" ? "가 더 무거워." : "가 가장 가벼워."}`),
  reveal: (p) => (p.kind === "order" ? `무거운 순서는 ${p.order.map((i) => BALANCE_ITEMS[i]).join(" > ")}이야. 저울을 하나씩 대어 봐.` : `정답은 ${BALANCE_ITEMS[p.answer]}야.`),
  createBoard: balanceBoard
};

// ───────────────────────── 무늬 기차 ─────────────────────────
function patternBoard({ stage, controls, sound }) {
  let p, api, locked = false, pickShape = null, pickColor = null, wrong = new Set(), revealUnits = false;
  const draw = () => {
    const show = Array.from({ length: p.shown }, (_, i) => beadAt(p, i + 1));
    const unitLen = p.dual ? null : p.unit.length;
    const cars = show.map((b, i) => `<li class="lg-car${revealUnits && unitLen && i % unitLen === 0 ? " unit-start" : ""}"><span class="lg-car-no">${i + 1}</span>${beadSvg(b)}</li>`).join("");
    const gap = p.n > p.shown + 1 ? '<li class="lg-car gap" aria-hidden="true">…</li>' : "";
    const answerShown = locked && p.kind !== "count";
    const mystery = p.kind === "count" ? "" : `<li class="lg-car mystery${answerShown ? " solved" : ""}"><span class="lg-car-no">${p.n}</span>${answerShown ? beadSvg(p.answer) : '<span class="lg-q">?</span>'}</li>`;
    stage.innerHTML = `${p.kind === "count" ? `<p class="lg-target">${beadSvg(p.target)}<span>이 구슬이 <b>1번부터 ${p.n}번까지</b> 몇 개?</span></p>` : ""}<ol class="lg-train" aria-label="구슬 기차">${cars}${gap}${mystery}</ol>${revealUnits && unitLen ? `<p class="lg-unit-note">${unitLen}개씩 한 마디. ${p.n}번째는 ${Math.ceil(p.n / unitLen)}번째 마디의 ${(p.n - 1) % unitLen + 1}번째 구슬.</p>` : ""}${revealUnits && p.dual ? `<p class="lg-unit-note">모양은 ${p.shapeCycle.length}개마다, 색은 ${p.colorCycle.length}개마다 되풀이. ${p.n}번째: 모양 ${(p.n - 1) % p.shapeCycle.length + 1}번째, 색 ${(p.n - 1) % p.colorCycle.length + 1}번째.</p>` : ""}`;
    if (p.kind === "count") {
      controls.innerHTML = `<p class="cg-ask">개수를 고르세요.</p>${pad(p.choices, "data-b2-count", { disabled: locked })}`;
      wrong.forEach((v) => controls.querySelector(`[data-b2-count="${v}"]`)?.setAttribute("disabled", ""));
    } else if (p.kind === "dual") {
      controls.innerHTML = `<p class="cg-ask">${p.n}번째 구슬의 모양과 색을 골라요.</p><div class="lg-pick-row" role="group" aria-label="모양">${p.shapeCycle.map((s) => `<button type="button" class="lg-choice${pickShape === s ? " on" : ""}" data-b2-shape="${s}" aria-pressed="${pickShape === s}" ${locked ? "disabled" : ""}>${shapeSvg(s, "#8a99a6")}<span>${SHAPE_NAME[s]}</span></button>`).join("")}</div><div class="lg-pick-row" role="group" aria-label="색">${p.colorCycle.map((c) => `<button type="button" class="lg-choice swatch${pickColor === c ? " on" : ""}" data-b2-color="${c}" aria-pressed="${pickColor === c}" ${locked ? "disabled" : ""}><i style="background:${HEX[c]}"></i><span>${COLOR_NAME[c]}</span></button>`).join("")}</div><div class="cg-actions"><button type="button" class="cg-primary" data-b2-check ${locked || !pickShape || !pickColor ? "disabled" : ""}>확인!</button></div>`;
    } else {
      controls.innerHTML = `<p class="cg-ask">${p.n}번째 구슬을 고르세요.</p><div class="lg-pick-row">${p.choices.map((b, i) => `<button type="button" class="lg-choice bead" data-b2-choice="${i}" aria-label="${beadName(b)}" ${locked || wrong.has(i) ? "disabled" : ""} ${wrong.has(i) ? 'data-state="bad"' : ""}>${beadSvg(b)}</button>`).join("")}</div>`;
    }
  };
  const onClick = (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled || locked) return;
    const d = t.dataset;
    if (d.b2Count !== undefined) { sound.tick(); const v = Number(d.b2Count); const ok = PATTERN.check(p, v); if (!ok) wrong.add(v); draw(); api.answer(ok, { value: v }); }
    else if (d.b2Choice !== undefined) { sound.tick(); const i = Number(d.b2Choice); const ok = PATTERN.check(p, p.choices[i]); if (!ok) wrong.add(i); draw(); api.answer(ok, { bead: p.choices[i] }); }
    else if (d.b2Shape !== undefined) { sound.tick(); pickShape = d.b2Shape; draw(); }
    else if (d.b2Color !== undefined) { sound.tick(); pickColor = d.b2Color; draw(); }
    else if (d.b2Check !== undefined) { const b = { shape: pickShape, color: pickColor }; api.answer(PATTERN.check(p, b), { bead: b, shapeOk: b.shape === p.answer.shape, colorOk: b.color === p.answer.color }); }
  };
  controls.addEventListener("click", onClick);
  return {
    show(problem, a) { p = problem; api = a; locked = false; pickShape = null; pickColor = null; wrong = new Set(); revealUnits = false; draw(); },
    reveal(problem, done) { locked = true; revealUnits = true; draw(); setTimeout(done, reduced() ? 0 : 600); },
    lock(on) { locked = on; if (on) revealUnits = true; draw(); },
    dispose() { controls.removeEventListener("click", onClick); }
  };
}
const PATTERN_GAME = {
  ...PATTERN,
  coach: (p) => (p.dual ? "모양만 따로 보고, 색만 따로 봐. 둘은 되풀이되는 길이가 달라." : p.kind === "next" ? "처음부터 같은 모양이 다시 나오는 곳을 찾아 봐. 거기까지가 한 마디야." : "한 마디가 몇 개인지 세고, 그 수로 묶어서 세어 봐."),
  mission: (p) => (p.kind === "count" ? `구슬이 되풀이되며 이어져요. <b class="cw">${p.n}번째까지</b> 이 구슬은 몇 개일까요?` : p.kind === "next" ? "다음에 올 구슬은 무엇일까요?" : `<b class="cw">${p.n}번째</b> 구슬은 무엇일까요?`),
  hint: (p, info) => (p.dual ? (info?.shapeOk ? "모양은 맞았어! 색만 따로 세어 봐." : info?.colorOk ? "색은 맞았어! 모양만 따로 세어 봐." : "모양이 몇 개마다, 색이 몇 개마다 되풀이되는지 따로 세어 봐.") : p.kind === "count" ? "한 마디 안에 그 구슬이 몇 개인지 세고, 마디가 몇 번 들어가는지 곱해 봐. 남는 칸도 잊지 말고!" : "한 마디의 길이를 다시 세어 봐. 마디 수로 나누고 남는 자리를 봐."),
  success: (p) => (p.kind === "count" ? `맞았어! ${p.n}번째까지 ${p.answer}개야.` : `맞았어! ${p.n}번째는 ${beadName(p.answer)}야.`),
  reveal: (p) => (p.kind === "count" ? `정답은 ${p.answer}개야. 마디마다 몇 개씩 있는지 세어 봐.` : `${p.n}번째는 ${beadName(p.answer)}야. 마디로 묶은 선을 봐.`),
  createBoard: patternBoard
};

// ───────────────────────── 빈칸 채우기 ─────────────────────────
function sudokuBoard({ stage, controls, sound }) {
  let p, api, grid, sel = null, locked = false, showWrong = false;
  const conflicts = () => {
    const bad = new Set(), n = p.size;
    const mark = (cells) => { const byVal = {}; for (const [r, c] of cells) { const v = grid[r][c]; if (v) (byVal[v] ||= []).push(`${r},${c}`); } for (const list of Object.values(byVal)) if (list.length > 1) list.forEach((k) => bad.add(k)); };
    for (let i = 0; i < n; i++) { mark([...Array(n).keys()].map((c) => [i, c])); mark([...Array(n).keys()].map((r) => [r, i])); }
    if (p.boxes) for (let br = 0; br < n; br += 2) for (let bc = 0; bc < n; bc += 2) mark([[br, bc], [br, bc + 1], [br + 1, bc], [br + 1, bc + 1]]);
    return bad;
  };
  const draw = () => {
    const bad = conflicts(), n = p.size;
    const cell = (r, c) => {
      const v = grid[r][c], given = p.puzzle[r][c] !== 0, key = `${r},${c}`;
      const cls = `lg-sq${given ? " given" : ""}${sel === key ? " sel" : ""}${bad.has(key) ? " bad" : ""}${showWrong && !given && v && v !== p.solution[r][c] ? " wrong" : ""}`;
      return given ? `<div class="${cls}" role="gridcell" aria-label="${r + 1}행 ${c + 1}열 ${v}">${v}</div>` : `<button type="button" role="gridcell" class="${cls}" data-b2-cell="${key}" aria-label="${r + 1}행 ${c + 1}열 ${v || "빈칸"}" ${locked ? "disabled" : ""}>${v || ""}</button>`;
    };
    // 상자 규칙 판은 상자(2×2)별로 묶어 그린다. 상자 순서: 왼쪽 위 → 오른쪽 위 → 왼쪽 아래 → 오른쪽 아래.
    const body = p.boxes
      ? [[0, 0], [0, 2], [2, 0], [2, 2]].map(([br, bc]) => `<div class="lg-box">${[[0, 0], [0, 1], [1, 0], [1, 1]].map(([dr, dc]) => cell(br + dr, bc + dc)).join("")}</div>`).join("")
      : grid.map((row, r) => row.map((_, c) => cell(r, c)).join("")).join("");
    stage.innerHTML = `<div class="lg-sudoku${p.boxes ? " boxes" : ""}" style="--n:${n}" role="grid" aria-label="${n}×${n} 빈칸 채우기${p.boxes ? ", 굵은 상자 넷" : ""}">${body}</div>`;
    const full = grid.every((row) => row.every((v) => v));
    controls.innerHTML = `<p class="cg-ask">${sel ? "넣을 수를 고르세요." : "빈칸을 먼저 누르세요."}</p>${pad([...Array(n).keys()].map((v) => v + 1), "data-b2-num", { disabled: locked || !sel })}<div class="cg-actions"><button type="button" class="cg-secondary" data-b2-erase ${locked || !sel ? "disabled" : ""}>지우기</button><button type="button" class="cg-primary" data-b2-check ${locked || !full ? "disabled" : ""}>확인!</button></div>`;
  };
  const firstBlank = () => { for (let r = 0; r < p.size; r++) for (let c = 0; c < p.size; c++) if (!grid[r][c]) return `${r},${c}`; return null; };
  const onClick = (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled || locked) return;
    const d = t.dataset;
    if (d.b2Cell !== undefined) { sel = d.b2Cell; draw(); }
    else if (d.b2Num !== undefined && sel) { sound.tick(); const [r, c] = sel.split(",").map(Number); grid[r][c] = Number(d.b2Num); sel = firstBlank() || sel; draw(); }
    else if (d.b2Erase !== undefined && sel) { const [r, c] = sel.split(",").map(Number); grid[r][c] = 0; draw(); }
    else if (d.b2Check !== undefined) { const ok = SUDOKU.check(p, grid); if (!ok) showWrong = !sudokuValid(p.size, p.boxes, grid) ? false : true; draw(); api.answer(ok, { conflicts: conflicts().size }); }
  };
  stage.addEventListener("click", onClick);
  controls.addEventListener("click", onClick);
  return {
    show(problem, a) { p = problem; api = a; grid = p.puzzle.map((row) => [...row]); sel = null; locked = false; showWrong = false; sel = firstBlank(); draw(); },
    reveal(problem, done) { grid = problem.solution.map((row) => [...row]); locked = true; sel = null; draw(); setTimeout(done, reduced() ? 0 : 500); },
    lock(on) { locked = on; if (on) sel = null; draw(); },
    dispose() { stage.removeEventListener("click", onClick); controls.removeEventListener("click", onClick); }
  };
}
const SUDOKU_GAME = {
  ...SUDOKU,
  coach: (p) => (p.boxes ? "가로줄, 세로줄, 굵은 상자 안에 1부터 4가 한 번씩이야. 빈칸이 하나뿐인 곳부터!" : `가로줄과 세로줄에 1부터 ${p.size}까지 한 번씩이야. 빈칸이 하나뿐인 줄부터 채워 봐.`),
  mission: (p) => `빈칸 ${p.blanks}개를 채우세요. ${p.boxes ? "가로·세로·굵은 상자" : "가로·세로"}에 1부터 ${p.size}까지 <b class="cw">한 번씩</b>!`,
  hint: (p, info) => (info?.conflicts ? "빨간 칸은 같은 줄이나 상자에 같은 수가 겹친 곳이야. 그 칸부터 고쳐 봐." : "한 줄에 빠진 수가 무엇인지 하나씩 확인해 봐."),
  success: (p) => `맞았어! 빈칸 ${p.blanks}개를 모두 채웠어.`,
  reveal: () => "정답 판이야. 줄마다 1부터 끝까지 한 번씩 있는지 확인해 봐.",
  createBoard: sudokuBoard
};

export const BOOK02_LEVEL_GAMES = Object.freeze({ "b2-matrix": MATRIX_GAME, "b2-balance": BALANCE_GAME, "b2-pattern": PATTERN_GAME, "b2-sudoku": SUDOKU_GAME });
export { matrixHolds };
