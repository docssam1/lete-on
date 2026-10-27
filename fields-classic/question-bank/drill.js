// 연습 공방 — 학생 차시 덱(study.html)의 「게임하기」에 뜨는 문제은행 연습 게임(drill.html 안에서 돈다).
// 우리 게임이 아직 없는 차시에 쓴다. 문제는 문제은행 생성기(bookNN-generators.js)가 그 자리에서 만든 실제 유형 문제이고,
// 그림도 문제은행과 같은 그리기(bookNN-renderers.js)를 쓴다 — 본책·문제은행과 어긋날 수 없다.
//  · 세 단계: 연습(난이도 1) → 실전(2) → 도전(3). 단계마다 세 문제, 차시에 붙인 유형을 번갈아 낸다(drill-recipes.js).
//  · 숫자판으로 답을 쓴다(요일·이름·자리처럼 낱말 답은 보기 단추로 고르고, 가쿠로는 칸에 수 카드를 놓는다). 한 번 틀리면 풀이의 첫 걸음을 귀띔하고, 두 번 틀리면 풀이와 답을 보여 주고 넘어간다.
//  · 처음에 바로 맞히면 별 하나. 다 마치면 덱에 「끝」을 알린다(postMessage type "fc-drill").
import { typeById } from "./source-data.js?v=20261028u1";
import { GENERATORS } from "./generators.js?v=20261028u1";
import { DRILL_TYPES } from "./drill-generators.js?v=20261027a";
import { DRILL_RECIPES } from "./drill-recipes.js?v=20261027m";
import { jo } from "./concept-board-kit.js?v=20261026b";
import * as B2 from "./book02-visuals.js?v=20261027b";
import * as FOLD from "./fold-visuals.js?v=20261027a";
import { makeGeometryWorksheetProblem, geometryWorksheetMarkup } from "./geometry-worksheet-problem.js?v=20261027a";

// 유형 → 문제 만들기: 공방 전용(make) · 문제은행 생성기(generator) · 쌓기나무 엔진(worksheetCode, 문제은행 화면과 같은 부르기)
export const drillGenerator = (type) => type.make
  || GENERATORS[type.generator]
  || (type.worksheetCode ? ({ difficulty }, attempt = 0) => makeGeometryWorksheetProblem(type, difficulty, 0, null, attempt) : null);
// 2권·접기·쌓기나무 그림: 문제은행 화면(app.js visualMarkup)과 같은 감싸는 class로 그린다
export const EXTRA_VISUALS = Object.freeze({
  "equal-partition-tree": ["equal-partition-visual", B2.equalPartitionTreeMarkup], "shape-sum-table": ["shape-sum-visual", B2.shapeSumTableMarkup],
  "equalize-bags": ["equalize-visual", B2.equalizeBagsMarkup], "total-difference-bars": ["total-difference-bars-visual", B2.totalDifferenceBarsMarkup],
  "balance-unit-equations": ["balance-unit-visual", B2.balanceUnitEquationsMarkup], "distinct-shape-equations": ["distinct-shape-visual", B2.distinctShapeEquationsMarkup],
  "number-sequences": ["number-sequences-visual", B2.numberSequencesMarkup], "progressive-number-table": ["progressive-table-visual", B2.progressiveNumberTableMarkup],
  "book2-growth": ["book2-growth-visual", B2.book2GrowthMarkup], "center-number-rule": ["center-number-rule-visual", B2.centerNumberRuleMarkup],
  "number-rule-grid": ["number-rule-grid-visual", B2.numberRuleGridMarkup], "two-digit-compose-rule": ["two-digit-compose-visual", B2.twoDigitComposeRuleMarkup],
  "sudoku-grid": ["sudoku-grid-visual", B2.sudokuGridMarkup], "symbol-pattern-sequence": ["symbol-pattern-visual", B2.symbolPatternSequenceMarkup],
  "paper-fold": ["paper-fold-visual", FOLD.paperFoldMarkup], "fold-cut-pieces": ["fold-pieces-visual", FOLD.foldCutPiecesMarkup],
  "fold-diagonal-grid": ["fold-diagonal-visual", FOLD.foldDiagonalGridMarkup], "fold-two-diagonal-grid": ["fold-diagonal-visual", FOLD.foldTwoDiagonalGridMarkup],
  "geometry-worksheet": ["geometry-worksheet-visual", geometryWorksheetMarkup]
});

// 그림 그리기는 문제은행 화면(app.js)과 같은 파일·같은 꼬리표로 불러온다
const RENDERER_TAG = { "01": "20261022a", "02": "20261023h", "03": "20261023h", "04": "20261023h", "05": "20261023h", "06": "20260905d", "07": "20261023h", "08": "20261027a", "09": "20261021d", "10": "20261023a" };

const params = new URLSearchParams(globalThis.location?.search || "");   // 검사기(node)에서도 불러올 수 있게
const bookId = params.get("book") || "", lessonId = params.get("lesson") || "";
const key = `${bookId}/${lessonId}`;
const LEVELS = [{ difficulty: 1, title: "연습" }, { difficulty: 2, title: "실전" }, { difficulty: 3, title: "도전" }];
const PER_LEVEL = 3;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const plain = (v) => String(v ?? "").replace(/<[^>]+>/g, "").trim();
const post = (message) => { if (parent !== window) parent.postMessage({ type: "fc-drill", lesson: lessonId, ...message }, location.origin); };
const say = (text, mood = "talk") => post({ event: "say", text, mood });

// 답의 꼴: 수 하나 · 수 + 단위(12㎠, 15개) · 쉼표로 쓴 수 여러 개 · 시각/걸린 시간(11시 30분, 2시간 25분) · 요일(토요일) · 분수(3/6) · 여러 칸((1) 29, (2) 36 / ㄱ=14, ㄴ=9)
export const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
export function answerShape(answer) {
  const a = plain(answer);
  let m;
  if (/^-?\d+$/.test(a)) return { kind: "int", values: [Number(a)], unit: "" };
  if ((m = a.match(/^(\d+)(시간?) (\d+)분$/u))) return { kind: "pair", values: [Number(m[1]), Number(m[3])], units: [m[2], "분"] };
  if ((m = a.match(/^([일월화수목금토])요일$/u))) return { kind: "weekday", values: [DAYS.indexOf(m[1])] };
  if ((m = a.match(/^(\d+)\/(\d+)$/u))) return { kind: "frac", values: [Number(m[1]), Number(m[2])] };
  // 여러 칸 답: 「(1) 29, (2) 36」 · 「ㄱ=14, ㄴ=9」 — 이름 차례대로 쉼표로 쓴다
  const parts = a.split(/\s*,\s*/);
  const numbered = parts.map((x) => x.match(/^\((\d+)\)\s*(-?\d+)$/u)), named = parts.map((x) => x.match(/^([가-힣ㄱ-ㅎA-Za-z]{1,2})\s*=\s*(-?\d+)$/u));
  if (numbered.every(Boolean)) return { kind: "parts", labels: numbered.map((x) => `(${x[1]})`), values: numbered.map((x) => Number(x[2])) };
  if (named.every(Boolean)) return { kind: "parts", labels: named.map((x) => x[1]), values: named.map((x) => Number(x[2])) };
  // 단위는 띄어 쓰지 않은 짧은 말 하나(「3번 딸기」처럼 낱말이 붙은 답은 받지 않는다)
  if ((m = a.match(/^(-?\d+)\s*([^\d\s,][^\d\s,]{0,3})$/u))) return { kind: "int", values: [Number(m[1])], unit: m[2] };
  if (/^-?\d+(\s*,\s*-?\d+)+$/.test(a)) return { kind: "list", values: a.split(",").map((x) => Number(x.trim())), unit: "" };
  return null;
}
// 낱말 답(이름·과일·직업·자리): 문제에 이미 나온 묶음(사람 · 물건 · 표의 줄과 칸 이름 · 원탁에 앉은 사람 · 자리 이름) 가운데
// 답이 든 묶음에서 고르게 한다. 원탁의 사람은 앉은 차례(meta.order)라 그대로 늘어놓으면 답이 보이므로 가나다순으로 둔다.
const seatLabels = (v) => {
  if (v.subtype !== "directional-seat") return null;
  const across = v.columns === 2 ? ["왼쪽", "오른쪽"] : ["왼쪽", "가운데", "오른쪽"];
  return (v.rows === 1 ? [""] : ["윗줄 ", "아랫줄 "]).flatMap((row) => across.map((col) => `${row}${col}`.trim()));
};
// 모양 반복마디: 보기는 반복마디의 모양들 + 답의 색을 바꾼 모양(같은 모양을 색으로 가려야 한다). 글은 생성기와 같은 이름이다.
const SHAPE_NAMES = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모", star: "별" };
const symbolName = (item) => `${item.filled ? "색칠한" : "색칠하지 않은"} ${SHAPE_NAMES[item.shape]} ${item.count}개`;
function symbolChoice(p) {
  const target = p.visual.target, items = [...(p.meta?.pattern || []), { ...target, filled: !target.filled }];
  const seen = new Map(); for (const item of items) seen.set(symbolName(item), item);
  const names = [...seen.keys()].sort((x, y) => x.localeCompare(y, "ko")), at = names.indexOf(plain(p.answer));
  if (at < 0 || names.length < 2) return null;
  return { kind: "choice", options: names, glyphs: names.map((n) => B2.symbolGroupMarkup(seen.get(n))), values: [at], hint: "반복마디가 몇 묶음마다 되풀이되는지 먼저 찾아 봐요." };
}
export function choiceShape(p) {
  const a = plain(p.answer), v = p.visual || {}, m = p.meta || {};
  if (v.kind === "symbol-pattern-sequence" && v.target) return symbolChoice(p);
  if (!a || /\d/.test(a)) return null;
  const ring = Array.isArray(m.order) && m.order.every((x) => typeof x === "string") ? [...m.order].sort((x, y) => x.localeCompare(y, "ko")) : null;
  const options = [v.items, v.names, v.places, v.columnLabels, v.rowLabels, m.items, m.names, m.places, seatLabels(v), ring].find((g) => Array.isArray(g) && g.includes(a));
  if (!options || options.length < 2 || options.length > 8 || new Set(options).size !== options.length) return null;
  return { kind: "choice", options: [...options], values: [options.indexOf(a)] };
}
// 가쿠로(수 카드를 빈칸에 놓아 가로·세로 합 맞추기): 칸을 누르고 카드를 놓는다. 채점은 합과 카드 쓰임으로 한다
// (생성기가 답이 하나뿐인 판만 낸다 — uniqueCount 1). st.typed에 빈칸 차례대로 「5,,2」처럼 둔다.
export function gridShape(p) {
  const v = p.visual || {}, m = p.meta || {};
  if (v.subtype !== "sum-grid" || m.uniqueCount !== 1 || !Array.isArray(m.hidden) || !Array.isArray(m.values) || !Array.isArray(m.cards)) return null;
  if (m.cards.length !== m.hidden.length) return null;
  return { kind: "grid", rows: v.rows, columns: v.columns, mask: v.mask, shown: v.shown, rowSums: v.rowSums, columnSums: v.columnSums, hidden: m.hidden, cards: [...m.cards].sort((a, b) => a - b), values: m.hidden.map((i) => m.values[i]) };
}
const ORDINAL = ["첫째", "둘째", "셋째", "넷째", "다섯째"];
export function gridMisses(shape, typed) {
  const fill = typed.split(","), cells = shape.shown.map((x, i) => { const k = shape.hidden.indexOf(i); return k >= 0 ? Number(fill[k] || 0) : Number(x || 0); });
  const miss = [], at = (r, c) => (shape.mask[r * shape.columns + c] ? cells[r * shape.columns + c] : 0);
  for (let r = 0; r < shape.rows; r++) if (Array.from({ length: shape.columns }, (_, c) => at(r, c)).reduce((a, b) => a + b, 0) !== shape.rowSums[r]) miss.push(`${ORDINAL[r]} 가로줄`);
  for (let c = 0; c < shape.columns; c++) if (Array.from({ length: shape.rows }, (_, r) => at(r, c)).reduce((a, b) => a + b, 0) !== shape.columnSums[c]) miss.push(`${ORDINAL[c]} 세로줄`);
  return miss;
}
// 쉼표로 쓴 수는 순서와 상관없이(답이 여러 개), 시각은 순서대로(시 · 분) 맞춘다
export const sameAnswer = (shape, typed) => {
  if (shape.kind === "choice") return typed === String(shape.values[0]);
  if (shape.kind === "grid") {
    const fill = typed.split(",");
    return fill.length === shape.hidden.length && fill.every(Boolean) && [...fill].map(Number).sort((a, b) => a - b).join() === shape.cards.join() && !gridMisses(shape, typed).length;
  }
  if (shape.kind === "frac") {   // 크기가 같은 분수도 맞다(3/6 = 1/2)
    const f = typed.match(/^(\d+)\/(\d+)$/);
    return Boolean(f) && Number(f[2]) > 0 && Number(f[1]) * shape.values[1] === Number(f[2]) * shape.values[0];
  }
  const got = typed.split(",").map((x) => x.trim()).filter(Boolean).map(Number);
  if (got.some(Number.isNaN) || got.length !== shape.values.length) return false;
  if (shape.kind !== "list") return got.join(",") === shape.values.join(",");
  const sort = (xs) => [...xs].sort((p, q) => p - q).join(",");
  return sort(got) === sort(shape.values);
};
const firstStep = (solution) => { const s = plain(solution).split(/(?<=[.다요])\s+/u)[0] || ""; return s.length > 70 ? `${s.slice(0, 70)}…` : s; };

async function main() {
  const root = document.getElementById("drill");
  const types = DRILL_RECIPES[key];
  if (!types) { root.innerHTML = `<p class="dr-missing">이 차시의 연습 공방은 아직 준비 중이에요.</p>`; return; }
  // 그림은 문제의 visual.kind(book5 등)로 그린다 — 다른 권의 그림을 빌려 쓰는 유형이 있다
  const renderers = {};
  await Promise.all(Object.entries(RENDERER_TAG).map(async ([nn, tag]) => { renderers[`book${Number(nn)}`] = { nn, markup: (await import(`./book${nn}-renderers.js?v=${tag}`))[`book${nn}Markup`] }; }));
  const visualOf = (visual) => {
    if (!visual) return "";
    const extra = EXTRA_VISUALS[visual.kind]; if (extra) return `<div class="visual ${extra[0]}">${extra[1](visual)}</div>`;
    const r = renderers[visual.kind]; return r ? `<div class="visual book${r.nn}-visual">${r.markup(visual)}</div>` : "";
  };

  const make = (level, index) => {
    const typeId = types[(level * PER_LEVEL + index) % types.length], type = DRILL_TYPES[typeId] || typeById(typeId), gen = drillGenerator(type);
    for (let t = 0; t < 200; t++) {
      const p = gen({ max: 30, difficulty: LEVELS[level].difficulty }, t);   // 문제은행과 같은 부르기(조건이 안 맞으면 null — 다시 뽑는다)
      if (!p) continue;
      const shape = answerShape(p.answer) || choiceShape(p) || gridShape(p);
      if (shape) return { ...p, shape, type, typeId };
    }
    throw new Error(`답 꼴이 맞는 문제를 만들지 못했어요: ${typeId}`);
  };
  const st = { level: 0, index: 0, stars: LEVELS.map(() => 0), typed: "", tries: 0, phase: "ask", p: null, note: "", finale: false, sel: 0, reveal: false };
  const blank = (shape) => (shape.kind === "grid" ? shape.hidden.map(() => "").join(",") : "");
  const fresh = () => { st.p = make(st.level, st.index); st.typed = blank(st.p.shape); st.tries = 0; st.phase = "ask"; st.note = ""; st.sel = 0; st.reveal = false; render(); };
  if (params.get("test") === "1") globalThis.__drill = st;   // 브라우저 검사용(정답을 읽는다) — 학생 화면에는 붙지 않는다
  // 창이 다시 만들어져도(골든벨 화면이 정답 자료를 받은 뒤 다시 그릴 때 등) 하던 문제에서 이어 간다.
  // 탭이 열려 있는 동안·한 시간 안만(sessionStorage). 유형(type)은 함수를 품을 수 있어 id로 다시 찾는다.
  const SAVE_KEY = `fc-drill:${key}`;
  const save = () => { try { sessionStorage.setItem(SAVE_KEY, JSON.stringify({ ...st, p: st.p && { ...st.p, type: undefined }, at: Date.now() })); } catch { /* 저장 못 해도 공방은 돈다 */ } };
  const restore = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SAVE_KEY) || "null");
      const type = saved?.p && (DRILL_TYPES[saved.p.typeId] || typeById(saved.p.typeId));
      if (!type || Date.now() - saved.at > 3600e3) return false;
      delete saved.at;
      Object.assign(st, saved, { p: { ...saved.p, type } });
      return true;
    } catch { return false; }
  };

  function render() {
    save();
    if (st.finale) return renderFinale();
    const p = st.p;
    root.innerHTML = `<div class="dr">
      <div class="dr-top"><div class="dr-levels">${LEVELS.map((l, k) => `<button type="button" data-level="${k}" class="${k === st.level ? "on" : ""}"><b>${k + 1}</b>${l.title}${st.stars[k] ? ` <small>★${st.stars[k]}</small>` : ""}</button>`).join("")}</div>
        <div class="dr-right"><div class="dr-dots">${Array.from({ length: PER_LEVEL }, (_, i) => `<i class="${i < st.index ? "done" : i === st.index ? "on" : ""}"></i>`).join("")}</div>${st.phase === "done" ? "" : '<button type="button" class="dr-skip" data-dr="skip">넘어가기 ›</button>'}</div></div>
      <p class="dr-kind">${esc(p.type.label)}</p>
      <div class="dr-card"><p class="dr-prompt">${esc(plain(p.prompt)).replaceAll("\n", "<br>")}</p>${p.shape.kind !== "grid" ? visualOf(p.visual) : st.reveal ? visualOf(p.answerVisual) : gridBoard(p.shape)}</div>
      ${st.note ? `<p class="dr-note${st.phase === "done" ? " good" : ""}" role="status">${st.note}</p>` : ""}
      ${st.phase === "done"
        ? `<div class="dr-actions"><button type="button" class="dr-btn primary" data-dr="next">${nextLabel()} →</button></div>`
        : pad(p.shape)}
    </div>`;
  }
  // 가쿠로 판: 빈칸은 누르는 단추, 주어진 수는 굵게, 오른쪽에 가로 합 · 아래에 세로 합
  function gridBoard(shape) {
    const fill = st.typed.split(","), cells = [];
    for (let r = 0; r < shape.rows; r++) {
      for (let c = 0; c < shape.columns; c++) {
        const i = r * shape.columns + c, k = shape.hidden.indexOf(i);
        cells.push(!shape.mask[i] ? '<i class="gap"></i>' : k >= 0
          ? `<button type="button" class="cell${st.sel === k && st.phase !== "done" ? " sel" : ""}" data-cell="${k}" aria-label="빈칸">${esc(fill[k] || "")}</button>`
          : `<b>${esc(shape.shown[i])}</b>`);
      }
      cells.push(`<em>${shape.rowSums[r]}</em>`);
    }
    shape.columnSums.forEach((v) => cells.push(`<em>${v}</em>`));
    cells.push('<em class="sum">합</em>');
    return `<div class="dr-gakuro" style="--cols:${shape.columns + 1}">${cells.join("")}</div>`;
  }
  // 답 쓰는 곳: 요일은 일~토 단추, 시각은 「시(시간)」 단추로 시와 분을 나누고, 나머지는 숫자판
  function pad(shape) {
    const submit = `<button type="button" class="dr-btn primary" data-dr="answer" ${st.typed ? "" : "disabled"}>답 내기</button>`;
    if (shape.kind === "grid") {
      const fill = st.typed.split(","), used = new Set(fill.filter(Boolean)), full = fill.every(Boolean);
      return `<div class="dr-pad dr-cards">${shape.cards.map((c) => `<button type="button" class="dr-key card" data-card="${c}" ${used.has(String(c)) ? "disabled" : ""}>${c}</button>`).join("")}
        <button type="button" class="dr-key wide" data-key="del">지우기</button><button type="button" class="dr-btn primary" data-dr="answer" ${full ? "" : "disabled"}>답 내기</button></div>
        <p class="dr-tip">빈칸을 누르고 수 카드를 놓아요. 놓은 칸을 다시 누르면 카드가 돌아와요.</p>`;
    }
    if (shape.kind === "choice") return `<div class="dr-pad dr-days dr-choices">${shape.options.map((o, i) => `<button type="button" class="dr-key day${st.typed === String(i) ? " on" : ""}" data-pick="${i}">${shape.glyphs ? `${shape.glyphs[i]}<small>${esc(o)}</small>` : esc(o)}</button>`).join("")}${submit}</div>`;
    if (shape.kind === "weekday") return `<div class="dr-pad dr-days">${DAYS.map((d, i) => `<button type="button" class="dr-key day${st.typed === String(i) ? " on" : ""}" data-day="${i}">${d}요일</button>`).join("")}${submit}</div>`;
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => `<button type="button" class="dr-key" data-key="${n}">${n}</button>`).join("");
    if (shape.kind === "pair") {
      const [h, m] = st.typed.split(","), [u1, u2] = shape.units;
      const shown = `${esc(h || "")}<small>${u1}</small> ${m !== undefined ? `${esc(m)}<small>${u2}</small>` : ""}`;
      return `<div class="dr-pad"><span class="dr-typed">${st.typed ? shown : "&nbsp;"}</span>${keys}
        <button type="button" class="dr-key wide" data-key="," ${!h || m !== undefined ? "disabled" : ""}>${u1} →</button><button type="button" class="dr-key wide" data-key="del">지우기</button>${submit}</div>
        <p class="dr-tip">${u1 === "시간" ? "몇 시간을" : "몇 시를"} 쓰고 「${u1} →」를 누른 뒤 몇 분을 써요.</p>`;
    }
    if (shape.kind === "frac") {
      const slash = st.typed.includes("/");
      return `<div class="dr-pad"><span class="dr-typed">${esc(st.typed) || "&nbsp;"}</span>${keys}
        <button type="button" class="dr-key" data-key="/" ${!st.typed || slash ? "disabled" : ""}>/</button><button type="button" class="dr-key wide" data-key="del">지우기</button>${submit}</div>
        <p class="dr-tip">분자를 쓰고 「/」를 누른 뒤 분모를 써요. 예: 3/5</p>`;
    }
    if (shape.kind === "parts") {
      const got = st.typed ? st.typed.split(",") : [];
      const shown = got.map((v, i) => `<small>${esc(shape.labels[i] || "")}</small>${esc(v)}`).join(" ");
      return `<div class="dr-pad"><span class="dr-typed">${st.typed ? shown : "&nbsp;"}</span>${keys}
        <button type="button" class="dr-key" data-key="," ${!st.typed || st.typed.endsWith(",") || got.length >= shape.values.length ? "disabled" : ""}>,</button><button type="button" class="dr-key wide" data-key="del">지우기</button>${submit}</div>
        <p class="dr-tip">${shape.labels.join(", ")} 차례로 쉼표(,)로 나누어 써요.</p>`;
    }
    const list = shape.kind === "list";
    return `<div class="dr-pad"><span class="dr-typed">${esc(st.typed) || "&nbsp;"}${shape.unit ? `<small>${esc(shape.unit)}</small>` : ""}</span>${keys}
      ${list ? '<button type="button" class="dr-key" data-key=",">,</button>' : ""}<button type="button" class="dr-key wide" data-key="del">지우기</button>${submit}</div>
      ${list ? `<p class="dr-tip">답이 ${shape.values.length}개예요. 쉼표(,)로 나누어 써요.</p>` : ""}`;
  }
  function nextLabel() {
    if (st.index < PER_LEVEL - 1) return "다음 문제";
    return st.level < LEVELS.length - 1 ? `${st.level + 2}단계 ${LEVELS[st.level + 1].title}` : "마치기";
  }
  function renderFinale() {
    const stars = st.stars.reduce((a, b) => a + b, 0), total = LEVELS.length * PER_LEVEL;
    root.innerHTML = `<div class="dr dr-finale"><p class="dr-kick">연습 공방 · 완성</p><h3>세 단계를 모두 마쳤어요!</h3>
      <p class="dr-score">처음에 바로 맞힌 문제 <b>${stars}</b> / ${total}</p>
      <ul class="dr-rules">${LEVELS.map((l, k) => `<li><b>${k + 1}단계 ${l.title}</b> ★ ${st.stars[k]} / ${PER_LEVEL}</li>`).join("")}</ul>
      <div class="dr-actions"><button type="button" class="dr-btn" data-dr="restart">처음부터 다시</button>${parent !== window ? '<button type="button" class="dr-btn primary" data-dr="done">골든벨 문제로 →</button>' : ""}</div></div>`;
  }
  function answer() {
    const p = st.p;
    if (sameAnswer(p.shape, st.typed)) {
      if (st.tries === 0) st.stars[st.level] += 1;
      st.phase = "done"; st.note = `${st.tries === 0 ? "정답! 한 번에 맞혔어요." : "맞았어요!"} <b>풀이</b> ${esc(plain(p.solution))}`;
      render(); say(st.tries === 0 ? "정답이에요! 한 번에 맞혔어요." : "맞았어요! 잘 고쳐 풀었어요.", "praise"); return;
    }
    st.tries += 1;
    if (p.shape.kind === "grid") {
      if (st.tries === 1) {   // 놓은 카드는 그대로 두고, 합이 안 맞는 줄만 알려 준다
        const miss = gridMisses(p.shape, st.typed);
        st.note = `다시 생각해 봐요. <b>첫 걸음</b> ${miss.length ? `${esc(miss.join(", "))}의 합이 맞지 않아요.` : "카드를 한 번씩만 썼는지 확인해 봐요."}`;
        render(); say("합이 안 맞는 줄부터 다시 봐요.", "think"); return;
      }
      st.phase = "done"; st.reveal = true; st.note = `정답은 그림처럼 채워요. <b>풀이</b> ${esc(plain(p.solution))}`;
      render(); say("정답 판을 같이 보고 다음 문제로 가요.", "talk"); return;
    }
    st.typed = "";
    if (st.tries === 1) {
      // 첫 걸음에 답이 그대로 나오면 그 수를 □로 가린다(거꾸로 풀기는 첫 문장이 곧 답인 때가 있다)
      const step = p.shape.hint || (p.shape.kind === "choice"
        ? firstStep(p.solution).replaceAll(p.shape.options[p.shape.values[0]], "□")
        : p.shape.values.reduce((t, v) => t.replace(new RegExp(`(?<![\\d/])${v}(?![\\d/])`, "g"), "□"), firstStep(p.solution)));
      st.note = `다시 생각해 봐요. ${step ? `<b>첫 걸음</b> ${esc(step)}` : ""}`;
      render(); say("다시 생각해 봐요. 풀이의 첫 걸음을 보고 한 번 더 해 봐요.", "think"); return;
    }
    st.phase = "done"; st.note = `정답은 <b>${esc(jo(plain(p.answer), "이에요"))}</b>. <b>풀이</b> ${esc(plain(p.solution))}`;
    render(); say("풀이를 같이 보고 다음 문제로 가요.", "talk");
  }
  function next() {
    if (st.index < PER_LEVEL - 1) { st.index += 1; return fresh(); }
    if (st.level < LEVELS.length - 1) { st.level += 1; st.index = 0; return fresh(); }
    st.finale = true; render(); say("세 단계를 모두 마쳤어요! 이제 골든벨 문제로 가요.", "praise");
  }
  root.addEventListener("click", (event) => {
    const b = event.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.level) { st.level = Number(b.dataset.level); st.index = 0; st.finale = false; return fresh(); }
    if (b.dataset.day) { st.typed = b.dataset.day; return render(); }
    if (b.dataset.pick) { st.typed = b.dataset.pick; return render(); }
    if (st.p?.shape.kind === "grid" && st.phase !== "done" && (b.dataset.cell || b.dataset.card || b.dataset.key === "del")) {
      const fill = st.typed.split(","), next = () => { const e = fill.findIndex((x, k) => !x && k > st.sel); st.sel = e >= 0 ? e : Math.max(0, fill.findIndex((x) => !x)); };
      if (b.dataset.cell) { const k = Number(b.dataset.cell); if (fill[k] && st.sel === k) fill[k] = ""; st.sel = k; }
      else if (b.dataset.card) { fill[st.sel] = b.dataset.card; next(); }   // 고른 칸에 놓는다(있던 카드는 돌아온다)
      else fill[st.sel] = "";
      st.typed = fill.join(","); return render();
    }
    if (b.dataset.key) { const k = b.dataset.key; st.typed = k === "del" ? st.typed.slice(0, -1) : st.typed.length < 12 ? st.typed + k : st.typed; return render(); }
    const act = b.dataset.dr;
    if (act === "answer") answer(); else if (act === "next" || act === "skip") next();   // 넘어가기: 별 없이 다음 문제로
    else if (act === "restart") { st.level = 0; st.index = 0; st.stars = LEVELS.map(() => 0); st.finale = false; fresh(); }
    else if (act === "done") post({ event: "done" });
  });
  if (restore()) render();
  else { fresh(); say("연습 공방이에요. 개념에서 본 풀이로 실제 문제를 풀어 봐요.", "talk"); }
}
if (typeof document !== "undefined") main().catch((error) => { document.getElementById("drill").innerHTML = `<p class="dr-missing">연습 공방을 열지 못했어요: ${esc(error.message)}</p>`; });
