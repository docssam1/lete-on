// 1과정 2권 1단원 「덧셈 매트릭스」 — 교재 번호마다 그 문제의 꼴(칸 수 · 모양 가짓수 · 빈칸 수)에 맞춘 생성기.
// 원장 2026-11-25 「모두 개념 연습 도전 심화에 다 같은 유형이야 1:1 매칭이 안되어 있어」 — 예전에는 활동·확인·연습·도전의
// 매트릭스 번호 19개가 모두 같은 2×2 표(같은 마름모 둘) 하나로 이어져 있었다.
// 교재의 모양 배치·수는 옮기지 않는다. 꼴만 맞추고 모양 배치와 수는 새로 뽑는다.
// 풀이는 아이가 하는 두 가지 생각으로만 풀리게 만든다:
//   ① 모르는 모양이 한 가지뿐인 줄 → 그 모양 값
//   ② 한 줄이 다른 줄을 품고 있으면(모양을 빼 보면) 남는 모양 한 가지 → 그 모양 값
// 이 두 가지로 모든 모양 값이 정해지지 않으면 다시 뽑는다(그래서 답은 늘 하나).

const SHAPES = Object.freeze(["circle", "square", "triangle", "diamond", "cross"]);
const SHAPE_NAME = Object.freeze({ circle: "○", square: "□", triangle: "△", diamond: "◇", cross: "✚" });
const MARKS = ["㉠", "㉡", "㉢", "㉣"];
const ORDINAL = ["첫째", "둘째", "셋째", "넷째"];

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function eul(n) {
  return [2, 4, 5, 9].includes(Math.abs(n) % 10) ? `${n}를` : `${n}을`;
}

function lineCells(grid, line) {
  return line.kind === "row" ? grid[line.index] : grid.map((row) => row[line.index]);
}

function lineName(line) {
  return `${ORDINAL[line.index]} ${line.kind === "row" ? "가로줄" : "세로줄"}`;
}

function counts(cells) {
  const map = new Map();
  cells.forEach((kind) => map.set(kind, (map.get(kind) || 0) + 1));
  return map;
}

function countText(map) {
  return [...map.entries()].map(([kind, n]) => (n === 1 ? SHAPE_NAME[kind] : `${SHAPE_NAME[kind]} ${n}개`)).join(", ");
}

// 줄의 합만 보고 모양 값을 차례로 정한다. steps에 아이 말로 적는다.
// 쓰는 생각 세 가지:
//   ① 모르는 모양이 한 가지뿐인 식 → 그 모양 값
//   ② 모르는 모양마다 개수가 같은 식(○ 2개, ◇ 2개) → 한 묶음(○ + ◇)의 합 = 합 ÷ 개수
//   ③ 한 식이 다른 식을 품고 있으면 빼서 남는 모양의 합
function deduce(grid, given, kinds) {
  const known = new Map();
  const steps = [];
  let compareSteps = 0;
  // eqs: { terms: Map(kind → 개수), sum, name }
  const eqs = given.map((item) => ({ terms: counts(lineCells(grid, item.line)), sum: item.sum, name: lineName(item.line), line: true }));
  const reduced = (eq) => {
    const terms = new Map();
    let rest = 0;
    eq.terms.forEach((n, kind) => {
      if (known.has(kind)) rest += known.get(kind) * n;
      else terms.set(kind, n);
    });
    return { terms, rest, sum: eq.sum - rest };
  };
  const keyOf = (terms) => [...terms.entries()].sort().map(([k, n]) => `${k}${n}`).join("|");
  const seen = new Set(eqs.map((eq) => keyOf(eq.terms)));
  const solveFrom = (eq) => {
    const r = reduced(eq);
    if (r.terms.size !== 1) return false;
    const [kind, n] = [...r.terms.entries()][0];
    const value = r.sum / n;
    if (!Number.isInteger(value) || value <= 0) return false;
    known.set(kind, value);
    const what = n === 1 ? SHAPE_NAME[kind] : `${SHAPE_NAME[kind]} ${n}개`;
    if (!r.rest && !eq.line && n === 1) return true;
    if (!r.rest) steps.push(eq.line ? `${eq.name}은 ${what}의 합이 ${eq.sum}이므로 ${SHAPE_NAME[kind]}는 ${value}입니다.` : (n === 1 ? "" : `${what}가 ${eq.sum}이므로 ${SHAPE_NAME[kind]}는 ${value}입니다.`));
    else if (n === 1) steps.push(`${eq.line ? `${eq.name}의 합` : `${sumText(eq.terms)} =`} ${eq.sum}에서 알고 있는 수 ${eul(r.rest)} 빼면 ${SHAPE_NAME[kind]}는 ${value}입니다.`);
    else steps.push(`${eq.line ? `${eq.name}의 합` : `${sumText(eq.terms)} =`} ${eq.sum}에서 알고 있는 수 ${eul(r.rest)} 빼면 ${what}가 ${r.sum}이므로 ${SHAPE_NAME[kind]}는 ${value}입니다.`);
    return true;
  };
  const sumText = (terms) => [...terms.entries()].flatMap(([kind, n]) => Array.from({ length: n }, () => SHAPE_NAME[kind])).join(" + ");
  const subtract = (want) => {
    for (const big of eqs) {
      for (const small of eqs) {
        if (big === small) continue;
        const a = reduced(big);
        const b = reduced(small);
        if (!b.terms.size) continue;
        let contains = true;
        b.terms.forEach((n, kind) => { if ((a.terms.get(kind) || 0) < n) contains = false; });
        if (!contains) continue;
        const terms = new Map();
        a.terms.forEach((n, kind) => {
          const d = n - (b.terms.get(kind) || 0);
          if (d > 0) terms.set(kind, d);
        });
        if (terms.size !== want || seen.has(keyOf(terms))) continue;
        const diff = a.sum - b.sum;
        if (diff <= 0) continue;
        compareSteps += 1;
        const from = big.line ? `${big.name} ${sumText(a.terms)} = ${a.sum}` : `${sumText(a.terms)} = ${a.sum}`;
        const take = small.line ? `${small.name} ${sumText(b.terms)} = ${eul(b.sum)}` : `${sumText(b.terms)} = ${eul(b.sum)}`;
        steps.push(`${from}에서 ${take} 빼면 ${sumText(terms)} = ${diff}입니다.`);
        return { terms, sum: diff, name: sumText(terms) };
      }
    }
    return null;
  };
  const group = () => {
    for (const eq of eqs) {
      const r = reduced(eq);
      const ns = [...r.terms.values()];
      if (r.terms.size < 2 || ns[0] < 2 || !ns.every((n) => n === ns[0]) || r.sum % ns[0]) continue;
      const terms = new Map([...r.terms.keys()].map((kind) => [kind, 1]));
      if (seen.has(keyOf(terms))) continue;
      const restText = r.rest ? `알고 있는 수를 빼면 ` : "";
      steps.push(`${eq.line ? `${eq.name} ` : ""}${restText}${sumText(r.terms)} = ${r.sum}에서 같은 묶음이 ${ns[0]}번이므로 ${sumText(terms)} = ${r.sum / ns[0]}입니다.`);
      return { terms, sum: r.sum / ns[0], name: sumText(terms) };
    }
    return null;
  };
  for (let guard = 0; guard < 40 && known.size < kinds.length; guard += 1) {
    if (eqs.some((eq) => solveFrom(eq))) continue;
    const made = subtract(1) || group() || subtract(2);
    if (!made) break;
    seen.add(keyOf(made.terms));
    eqs.push(made);
  }
  return { known, steps, compareSteps, solved: known.size === kinds.length };
}

// 한 표 만들기. spec: { rows, cols, kinds, blanks, maxValue, needCompare, blankKinds }
function makeGrid(spec) {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const kinds = shuffle(SHAPES.slice(0, spec.kinds >= 5 ? 5 : 4)).slice(0, spec.kinds);
    const values = shuffle(Array.from({ length: spec.maxValue }, (_, i) => i + 1)).slice(0, kinds.length);
    const valueOf = new Map(kinds.map((kind, i) => [kind, values[i]]));
    const grid = Array.from({ length: spec.rows }, () => Array.from({ length: spec.cols }, () => kinds[randomInt(0, kinds.length - 1)]));
    // 한 가지 모양만 있는 줄 하나에서 시작한다(교재 매트릭스는 늘 그런 줄이 있다).
    if (!spec.needCompare) {
      const start = Math.random() < 0.5 ? { kind: "row", index: randomInt(0, spec.rows - 1) } : { kind: "col", index: randomInt(0, spec.cols - 1) };
      const kind = kinds[randomInt(0, kinds.length - 1)];
      if (start.kind === "row") grid[start.index] = grid[start.index].map(() => kind);
      else grid.forEach((row) => { row[start.index] = kind; });
    }
    if (new Set(grid.flat()).size !== kinds.length) continue;
    const lines = [
      ...Array.from({ length: spec.rows }, (_, index) => ({ kind: "row", index })),
      ...Array.from({ length: spec.cols }, (_, index) => ({ kind: "col", index }))
    ];
    const mono = lines.filter((line) => new Set(lineCells(grid, line)).size === 1).length;
    if (mono !== (spec.needCompare ? 0 : 1)) continue;
    const pool = spec.blankKinds ? lines.filter((line) => spec.blankKinds.includes(line.kind)) : lines;
    const blanks = shuffle(pool).slice(0, spec.blanks);
    const sumOf = (line) => lineCells(grid, line).reduce((total, kind) => total + valueOf.get(kind), 0);
    const given = lines.filter((line) => !blanks.includes(line)).map((line) => ({ line, sum: sumOf(line) }));
    const result = deduce(grid, given, kinds);
    if (!result.solved) continue;
    if (spec.needCompare && !result.compareSteps) continue;
    if (!spec.needCompare && result.compareSteps) continue;
    if (spec.minSteps && result.steps.length < spec.minSteps) continue;
    if (result.steps.length > (spec.maxSteps || 7)) continue;
    // 빈칸 줄이 한 가지 모양뿐이면 너무 쉽다.
    if (blanks.some((line) => new Set(lineCells(grid, line)).size === 1)) continue;
    const order = (line) => (line.kind === "row" ? line.index : spec.rows + line.index);
    const sortedBlanks = [...blanks].sort((a, b) => order(a) - order(b));
    return {
      grid,
      valueOf,
      kinds,
      blanks: sortedBlanks.map((line) => ({ ...line, sum: sumOf(line) })),
      rowSums: Array.from({ length: spec.rows }, (_, index) => sumOf({ kind: "row", index })),
      colSums: Array.from({ length: spec.cols }, (_, index) => sumOf({ kind: "col", index })),
      steps: result.steps
    };
  }
  return null;
}

// ── 그림 ─────────────────────────────────────────────

function shapeSvg(kind, cx, cy, r) {
  const line = `fill="#fff" stroke="#2f2a24" stroke-width="1.7" stroke-linejoin="round"`;
  if (kind === "circle") return `<circle cx="${cx}" cy="${cy}" r="${r}" ${line}/>`;
  if (kind === "square") return `<rect x="${cx - r * 0.9}" y="${cy - r * 0.9}" width="${r * 1.8}" height="${r * 1.8}" ${line}/>`;
  if (kind === "triangle") return `<polygon points="${cx},${cy - r} ${cx + r * 1.05},${cy + r * 0.8} ${cx - r * 1.05},${cy + r * 0.8}" ${line}/>`;
  if (kind === "diamond") return `<polygon points="${cx},${cy - r * 1.05} ${cx + r * 1.05},${cy} ${cx},${cy + r * 1.05} ${cx - r * 1.05},${cy}" ${line}/>`;
  const a = r * 0.36;
  const b = r * 0.98;
  const pts = [[-a, -b], [a, -b], [a, -a], [b, -a], [b, a], [a, a], [a, b], [-a, b], [-a, a], [-b, a], [-b, -a], [-a, -a]]
    .map(([x, y]) => `${(cx + x).toFixed(1)},${(cy + y).toFixed(1)}`).join(" ");
  return `<polygon points="${pts}" ${line}/>`;
}

function gridSvg(made, { label = "", marked = false } = {}) {
  const cell = 46;
  const rows = made.grid.length;
  const cols = made.grid[0].length;
  const top = label ? 22 : 2;
  const left = 2;
  const width = left + (cols + 1) * cell + 2;
  const height = top + (rows + 1) * cell + 2;
  const blankKey = (kind, index) => made.blanks.findIndex((line) => line.kind === kind && line.index === index);
  let parts = "";
  if (label) parts += `<text x="${left}" y="15" font-size="15" font-weight="700" fill="#2f2a24" style="font-family:'Noto Sans KR',sans-serif">${label}</text>`;
  const sumCell = (x, y, value, blankIndex) => {
    const blank = blankIndex >= 0;
    let s = `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:${blank ? "#f6e4a8" : "#e9f1ea"};stroke:#7d9a86;stroke-width:1.2"/>`;
    if (!blank) s += `<text x="${x + cell / 2}" y="${y + cell / 2 + 7}" text-anchor="middle" font-size="20" style="fill:#1f2a22;font-family:'Noto Sans KR',sans-serif">${value}</text>`;
    else if (marked) s += `<text x="${x + cell / 2}" y="${y + cell / 2 + 7}" text-anchor="middle" font-size="19" style="fill:#8a6413;font-family:'Noto Sans KR',sans-serif">${MARKS[blankIndex]}</text>`;
    return s;
  };
  made.grid.forEach((row, r) => {
    row.forEach((kind, c) => {
      const x = left + c * cell;
      const y = top + r * cell;
      parts += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:#fff;stroke:#7d9a86;stroke-width:1.2"/>`;
      parts += shapeSvg(kind, x + cell / 2, y + cell / 2, 14);
    });
    parts += sumCell(left + cols * cell, top + r * cell, made.rowSums[r], blankKey("row", r));
  });
  made.colSums.forEach((value, c) => {
    parts += sumCell(left + c * cell, top + rows * cell, value, blankKey("col", c));
  });
  return `<svg class="shape-matrix-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="width:${width}px;max-width:100%;height:auto;flex:none" role="img" aria-label="덧셈 매트릭스">${parts}</svg>`;
}

const PROMPT_ONE = "같은 모양은 같은 수, 다른 모양은 다른 수를 나타냅니다. 오른쪽과 아래의 수는 그 줄에 있는 수의 합입니다. 색칠된 빈칸에 알맞은 수를 구하세요.";
const PROMPT_MANY = "같은 모양은 같은 수, 다른 모양은 다른 수를 나타냅니다. 오른쪽과 아래의 수는 그 줄에 있는 수의 합입니다. 색칠된 빈칸 ㉠, ㉡, ㉢에 알맞은 수를 구하세요.";

function valuesLine(made) {
  return made.kinds.map((kind) => `${SHAPE_NAME[kind]} = ${made.valueOf.get(kind)}`).join(", ");
}

function blankLine(made, line) {
  const cells = lineCells(made.grid, line);
  return `${cells.map((kind) => made.valueOf.get(kind)).join(" + ")} = ${line.sum}`;
}

function singleProblem(spec, kindLabel) {
  const made = makeGrid(spec);
  if (!made) return null;
  const many = made.blanks.length > 1;
  const html = `<div class="shape-matrix-row">${gridSvg(made, { marked: many })}</div>`;
  const answer = many
    ? made.blanks.map((line, i) => `${MARKS[i]} ${line.sum}`).join(", ")
    : String(made.blanks[0].sum);
  const finish = made.blanks.map((line, i) => `${many ? `${MARKS[i]}은 ` : "빈칸은 "}${lineName(line)}의 합이므로 ${blankLine(made, line)}입니다.`).join(" ");
  return {
    prompt: many ? PROMPT_MANY.replace("㉠, ㉡, ㉢", MARKS.slice(0, made.blanks.length).join(", ")) : PROMPT_ONE,
    visual: { kind: "shape-matrix", html },
    answer,
    solution: `${made.steps.join(" ")} ${finish}`,
    meta: { kindLabel, rows: spec.rows, cols: spec.cols, kinds: spec.kinds, blanks: made.blanks.map(({ kind, index, sum }) => ({ kind, index, sum })), values: Object.fromEntries(made.valueOf) }
  };
}

function setProblem(specs, kindLabel) {
  const labels = ["(1)", "(2)", "(3)", "(4)"];
  const made = [];
  for (const spec of specs) {
    const one = makeGrid(spec);
    if (!one) return null;
    made.push(one);
  }
  const html = `<div class="shape-matrix-row is-set">${made.map((one, i) => gridSvg(one, { label: labels[i] })).join("")}</div>`;
  return {
    prompt: PROMPT_ONE,
    visual: { kind: "shape-matrix", html },
    answer: made.map((one, i) => `${labels[i]} ${one.blanks[0].sum}`).join(", "),
    solution: made.map((one, i) => `${labels[i]} ${one.steps.join(" ")} 빈칸은 ${blankLine(one, one.blanks[0])}입니다.`).join(" "),
    meta: { kindLabel, parts: made.map((one) => ({ blanks: one.blanks.map(({ kind, index, sum }) => ({ kind, index, sum })), values: Object.fromEntries(one.valueOf) })) }
  };
}

const small = (difficulty) => (difficulty === 1 ? 6 : difficulty === 3 ? 12 : 9);
const big = (difficulty) => (difficulty === 1 ? 7 : difficulty === 3 ? 12 : 9);

// 빈칸이 가로줄·세로줄 어디에 오는지만 다르게 네 표.
function matrixTwoByTwoSet({ difficulty = 2 }) {
  const where = shuffle(["row", "row", "col", "col"]);
  return setProblem(where.map((kind) => ({ rows: 2, cols: 2, kinds: 3, blanks: 1, maxValue: small(difficulty), blankKinds: [kind] })), "2x2-set");
}

// 세 줄 세 칸 두 표: 하나는 세로줄, 하나는 가로줄이 빈칸.
function matrixThreeByThreePair({ difficulty = 2 }) {
  return setProblem([
    { rows: 3, cols: 3, kinds: 4, blanks: 1, maxValue: big(difficulty), blankKinds: ["col"], minSteps: 3 },
    { rows: 3, cols: 3, kinds: 4, blanks: 1, maxValue: big(difficulty), blankKinds: ["row"], minSteps: 3 }
  ], "3x3-pair");
}

const one = (spec, label) => ({ difficulty = 2 }) => singleProblem({ ...spec, maxValue: spec.maxValue || big(difficulty) }, label);

export const BOOK02_MATRIX_GENERATORS = Object.freeze({
  shapeMatrixTwoByTwoSet: matrixTwoByTwoSet,
  shapeMatrixThreeByThreePair: matrixThreeByThreePair,
  shapeMatrixThreeByThree: one({ rows: 3, cols: 3, kinds: 4, blanks: 1, minSteps: 3 }, "3x3"),
  shapeMatrixTwoByThree: one({ rows: 2, cols: 3, kinds: 3, blanks: 1, minSteps: 2 }, "2x3"),
  shapeMatrixTwoByThreeMulti: one({ rows: 2, cols: 3, kinds: 3, blanks: 2, blankKinds: ["col"], minSteps: 2 }, "2x3-multi"),
  shapeMatrixTwoByThreeCompare: one({ rows: 2, cols: 3, kinds: 4, blanks: 1, needCompare: true }, "2x3-compare"),
  shapeMatrixFourByFour: one({ rows: 4, cols: 4, kinds: 4, blanks: 1, minSteps: 3 }, "4x4"),
  shapeMatrixFourByFourCompare: one({ rows: 4, cols: 4, kinds: 4, blanks: 1, needCompare: true, minSteps: 3 }, "4x4-compare"),
  shapeMatrixFourByFourMulti: one({ rows: 4, cols: 4, kinds: 4, blanks: 3, minSteps: 3 }, "4x4-multi"),
  shapeMatrixFourByFourFive: one({ rows: 4, cols: 4, kinds: 5, blanks: 1, minSteps: 4 }, "4x4-five"),
  shapeMatrixThreeByFour: one({ rows: 3, cols: 4, kinds: 5, blanks: 1, minSteps: 4 }, "3x4-five")
});
