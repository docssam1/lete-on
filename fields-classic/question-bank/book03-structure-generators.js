// 1과정 3권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK03_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK03_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK03_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK03_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//   verifyBook03Structure(problem) — 검사기(book03-audit.mjs)가 부르는 독립 검산(다시 풀어 답이 하나인지 본다)

import { dimArc } from "./length-dim.js?v=20261124h";
import { mixed } from "./math-markup.js";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const digitsOf = (value) => String(value).split("").map(Number);
// 받침 따라 조사(「8을」「2를」) — 숫자를 한국어로 읽은 끝소리로 정한다.
const BATCHIM_DIGIT = [true, true, false, true, false, false, true, true, true, false]; // 영 일 이 삼 사 오 육 칠 팔 구
const eul = (n) => `${n}${BATCHIM_DIGIT[Math.abs(n) % 10] ? "을" : "를"}`;
const eun = (n) => `${n}${BATCHIM_DIGIT[Math.abs(n) % 10] ? "은" : "는"}`;
const ro = (n) => `${n}${[0, 3, 6].includes(Math.abs(n) % 10) ? "으로" : "로"}`;
const iga = (n) => `${n}${BATCHIM_DIGIT[Math.abs(n) % 10] ? "이" : "가"}`;

// ───────────────────────────── 3단원 복면산 ─────────────────────────────
// 꼴마다 「가능한 모든 실제 덧셈」을 늘어놓고, 모양 칸끼리 같은 숫자인지(같은 모양) · 보이는 숫자는 그대로 적어
// 문제 모습(열쇠)을 만든다. 같은 열쇠가 딱 한 번 나오면 그 문제는 답이 하나뿐이다(같은 모습의 다른 덧셈이 없다).
// 그래서 따로 풀어 보지 않아도 답 하나가 보장되고, 꼴 안의 모든 문제를 고를 수 있다.

const SHAPES = ["○", "□", "◇", "△", "☆", "✚"];
const PLACE = ["일", "십", "백", "천"];
const familyCache = new Map();

function cryptFamily(name, build) {
  if (!familyCache.has(name)) familyCache.set(name, build());
  return familyCache.get(name);
}

// cases: 더할 수들의 배열을 차례로 내놓는 함수(그 꼴의 열쇠가 나올 수 있는 덧셈을 빠짐없이)
// masks: 자리 수 [행마다] → 행마다 "S"(모양)/"D"(보이는 숫자) 문자열 목록
// accept: 답이 하나인 문제 가운데 이 꼴에 맞는 것만 남긴다
function buildFamily({ cases, masks, accept }) {
  const byKey = new Map();
  for (const addends of cases()) {
    const sum = addends.reduce((total, value) => total + value, 0);
    const rowsDigits = [...addends.map(digitsOf), digitsOf(sum)];
    for (const mask of masks(rowsDigits.map((row) => row.length))) {
      if (!mask || mask.length !== rowsDigits.length || mask.some((row, index) => row.length !== rowsDigits[index].length)) continue;
      const letterOf = new Map();
      const rows = rowsDigits.map((digits, rowIndex) => digits.map((digit, column) => {
        if (mask[rowIndex][column] === "D") return { d: digit };
        if (!letterOf.has(digit)) letterOf.set(digit, letterOf.size);
        return { s: letterOf.get(digit) };
      }));
      const key = rows.map((row) => row.map((token) => ("d" in token ? String(token.d) : String.fromCharCode(65 + token.s))).join("")).join("|");
      const hit = byKey.get(key);
      if (hit) { hit.count += 1; continue; }
      const values = [];
      letterOf.forEach((letter, digit) => { values[letter] = digit; });
      byKey.set(key, { key, count: 1, rows, addends, sum, values });
    }
  }
  return [...byKey.values()].filter((entry) => entry.count === 1 && entry.values.length <= SHAPES.length && accept(entry));
}

const letters = (row) => row.filter((token) => "s" in token).map((token) => token.s);
const allShape = (row) => row.every((token) => "s" in token);
const sameLetter = (row) => allShape(row) && new Set(letters(row)).size === 1;
const letterCount = (entry) => entry.values.length;

const CRYPT_FAMILIES = {
  // AA + A = 보이는 수 (활동 1-4, 연습 5)
  "aa-plus-a": () => buildFamily({
    cases: () => range(1, 9).map((a) => [11 * a, a]),
    masks: ([, , sumLength]) => [["SS", "S", "D".repeat(sumLength)]],
    accept: (entry) => sameLetter(entry.rows[0]) && sameLetter(entry.rows[1])
  }),
  // 모양 + 숫자 = 다른 모양 (A + d = BB · AA + d = Bd) (활동 1-3, 연습 4)
  "shape-digit-sum": () => [
    ...buildFamily({
      cases: () => range(1, 9).flatMap((a) => range(1, 9).map((d) => [a, d])),
      masks: ([, , sumLength]) => sumLength === 2 ? [["S", "D", "SS"]] : [],
      accept: (entry) => sameLetter(entry.rows[2]) && entry.rows[2][0].s !== entry.rows[0][0].s
    }),
    ...buildFamily({
      cases: () => range(1, 9).flatMap((a) => range(2, 9).map((d) => [11 * a, d])),
      masks: ([, , sumLength]) => sumLength === 2 ? [["SS", "D", "SD"]] : [],
      accept: (entry) => sameLetter(entry.rows[0]) && entry.rows[2][0].s !== entry.rows[0][0].s
    })
  ],
  // AA + AA = 모양이 섞인 결과 (활동 1-2, 활동 2-2, 연습 3)
  "aa-double-shape": () => buildFamily({
    cases: () => range(1, 9).map((a) => [11 * a, 11 * a]),
    masks: ([, , sumLength]) => sumLength === 2 ? [["SS", "SS", "SD"]] : [["SS", "SS", "SSD"]],
    accept: (entry) => sameLetter(entry.rows[0]) && entry.rows[1][0].s === entry.rows[0][0].s
  }),
  // 한 자리 같은 모양 세 번 = 모양 + 숫자 (확인 1-3·1-4, 연습 8)
  "single-thrice": () => buildFamily({
    cases: () => range(1, 9).map((a) => [a, a, a]),
    masks: ([, , , sumLength]) => sumLength === 2 ? [["S", "S", "S", "SD"]] : [],
    accept: (entry) => entry.rows[3][0].s !== entry.rows[0][0].s
  }),
  // AB + AB = 모양이 섞인 결과 (CC d 꼴 등) (활동 2-1, 연습 17)
  "ab-double": () => buildFamily({
    cases: () => range(10, 99).map((n) => [n, n]),
    masks: ([, , sumLength]) => sumLength === 3 ? [["SS", "SS", "SSD"], ["SS", "SS", "SDS"], ["SS", "SS", "DSS"]] : [["SS", "SS", "SD"], ["SS", "SS", "DS"]],
    accept: (entry) => entry.rows[0][0].s !== entry.rows[0][1].s && letters(entry.rows[2]).length >= 2
  }),
  // 숫자가 섞인 세 자리 수 + AA (활동 2-3)
  "three-mixed-plus-aa": () => buildFamily({
    cases: () => range(100, 999).flatMap((a) => range(1, 9).map((k) => [a, 11 * k])),
    masks: ([, , sumLength]) => sumLength === 3 ? [["DSD", "SS", "DDS"], ["DSD", "SS", "DSD"], ["SDD", "SS", "DDS"], ["DDS", "SS", "DSD"]] : [],
    accept: (entry) => {
      const shapeOfFirst = letters(entry.rows[0]);
      return sameLetter(entry.rows[1]) && shapeOfFirst.length === 1 && shapeOfFirst[0] === entry.rows[1][0].s
        && letters(entry.rows[2]).some((letter) => letter !== shapeOfFirst[0]);
    }
  }),
  // 두 자리 + 한 자리, 모두 모양 → 세 자리 (확인 2-1)
  "two-one-three": () => buildFamily({
    cases: () => range(10, 99).flatMap((a) => range(1, 9).map((b) => [a, b])),
    masks: ([first, second, sumLength]) => sumLength === 3 ? [["S".repeat(first), "S".repeat(second), "SSS"]] : [],
    accept: (entry) => letterCount(entry) >= 3
  }),
  // 두 자리 + 한 자리 → 두 자리, 더하는 수는 모두 모양 (도전 3, AB + B = BA 꼴).
  // 모두 모양인 꼴은 답이 하나인 식이 하나뿐이라, 결과에 숫자 하나를 보인 꼴도 함께 둔다(결과에 더하는 수의 모양이 다시 나와야 한다).
  "two-one-two": () => buildFamily({
    cases: () => range(10, 99).flatMap((a) => range(1, 9).map((b) => [a, b])),
    masks: ([first, second, sumLength]) => sumLength === 2 ? [["SS", "S", "SS"], ["SS", "S", "SD"], ["SS", "S", "DS"]] : [],
    accept: (entry) => {
      const used = new Set([...letters(entry.rows[0]), ...letters(entry.rows[1])]);
      return letterCount(entry) >= 2 && letters(entry.rows[2]).some((letter) => used.has(letter)) && new Set(letters(entry.rows[0])).size === 2;
    }
  }),
  // 두 자리 + 두 자리, 모두 모양 → 세 자리 (확인 2-2~2-4, 연습 15)
  "two-two-three": () => buildFamily({
    cases: () => range(10, 99).flatMap((a) => range(10, 99).map((b) => [a, b])),
    masks: ([, , sumLength]) => sumLength === 3 ? [["SS", "SS", "SSS"]] : [],
    accept: (entry) => letterCount(entry) >= 3
  }),
  // 세 자리 + 두 자리, 모양에 숫자 하나 → 세 자리 (연습 13·16)
  "three-two-shape": () => buildFamily({
    cases: () => range(100, 999).flatMap((a) => range(10, 99).map((b) => [a, b])),
    masks: ([, , sumLength]) => sumLength === 3 ? [["SSS", "SS", "SSD"], ["SSS", "SS", "SDS"], ["SSS", "SS", "DSS"]] : [],
    accept: (entry) => letterCount(entry) >= 3 && letterCount(entry) <= 4
  }),
  // 세 자리 + 두 자리, 모두 모양 → 네 자리 (도전 1)
  "three-two-four": () => buildFamily({
    cases: () => range(901, 999).flatMap((a) => range(10, 99).filter((b) => a + b >= 1000).map((b) => [a, b])),
    masks: ([, , sumLength]) => sumLength === 4 ? [["SSS", "SS", "SSSS"]] : [],
    accept: (entry) => letterCount(entry) >= 4
  })
};

// 열쇠 모양을 다시 써서 답이 몇 개인지 직접 센다(검사기와 생성 뒤 재확인용 — 위 목록 만들기와 다른 방법).
const solutionCountCache = new Map();
export function countCryptSolutions(rows) {
  const key = rows.map((row) => row.map((token) => ("d" in token ? String(token.d) : String.fromCharCode(65 + token.s))).join("")).join("|");
  if (solutionCountCache.has(key)) return solutionCountCache.get(key);
  const letterTotal = Math.max(-1, ...rows.flat().filter((token) => "s" in token).map((token) => token.s)) + 1;
  const leading = new Set(rows.map((row) => row[0]).filter((token) => "s" in token).map((token) => token.s));
  const value = (row, assign) => row.reduce((total, token) => total * 10 + ("d" in token ? token.d : assign[token.s]), 0);
  let count = 0;
  const assign = [];
  const used = new Set();
  const walk = (index) => {
    if (count > 1) return;
    if (index === letterTotal) {
      const addends = rows.slice(0, -1).reduce((total, row) => total + value(row, assign), 0);
      if (addends === value(rows[rows.length - 1], assign)) count += 1;
      return;
    }
    for (let digit = leading.has(index) ? 1 : 0; digit <= 9; digit += 1) {
      if (used.has(digit)) continue;
      used.add(digit); assign[index] = digit;
      walk(index + 1);
      used.delete(digit);
    }
  };
  walk(0);
  solutionCountCache.set(key, count);
  return count;
}

// 일의 자리부터 한 자리씩 — 「일의 자리: ○ + ○ = 8 + 8 = 16, 6을 쓰고 1을 올립니다.」
function columnWalk(rows, glyph, values) {
  const addRows = rows.slice(0, -1);
  const width = Math.max(...rows.map((row) => row.length));
  const lines = [];
  let carry = 0;
  for (let place = 0; place < width; place += 1) {
    const tokens = addRows.map((row) => row[row.length - 1 - place]).filter(Boolean);
    if (!tokens.length) {
      if (carry) lines.push(`${PLACE[place]}의 자리: 올라온 ${iga(carry)} 그대로 내려옵니다.`);
      carry = 0;
      continue;
    }
    const names = tokens.map((token) => ("d" in token ? String(token.d) : glyph[token.s]));
    const nums = tokens.map((token) => ("d" in token ? token.d : values[token.s]));
    const total = nums.reduce((sum, value) => sum + value, 0) + carry;
    if (tokens.length === 1 && !carry) {
      lines.push(`${PLACE[place]}의 자리: ${"d" in tokens[0] ? "" : `${names[0]}=`}${iga(nums[0])} 그대로 내려옵니다.`);
      continue;
    }
    const shown = `${names.join(" + ")}${carry ? " + 올라온 " + carry : ""}`;
    const asNumbers = `${nums.join(" + ")}${carry ? " + " + carry : ""}`;
    const next = Math.floor(total / 10);
    lines.push(`${PLACE[place]}의 자리: ${shown} = ${asNumbers} = ${total}${next ? `, ${eul(total % 10)} 쓰고 ${eul(next)} 올립니다` : ""}.`);
    carry = next;
  }
  return lines;
}

function cryptProblem(entry, { ask = "all", family, typeHint }) {
  const glyph = shuffle(SHAPES).slice(0, entry.values.length);
  const toCells = (row) => row.map((token) => ("d" in token ? String(token.d) : glyph[token.s]));
  const addRows = entry.rows.slice(0, -1);
  const sumRow = entry.rows[entry.rows.length - 1];
  const longest = Math.max(...addRows.map((row) => row.length));
  const carryLead = addRows.length === 2 && sumRow.length > longest && "s" in sumRow[0] ? sumRow[0].s : -1;
  let askLetters;
  if (ask === "all") askLetters = entry.values.map((_, index) => index);
  else {
    // 한 모양만 묻는 꼴: 맨 앞 받아올림(늘 1) 말고 다른 모양을 묻는다.
    const pool = entry.values.map((_, index) => index).filter((index) => index !== carryLead);
    askLetters = [sample(pool.length ? pool : [0])];
  }
  const askText = askLetters.length === 1 ? `${glyph[askLetters[0]]}가 나타내는 숫자를 구하세요.` : "각 모양이 나타내는 숫자를 구하세요.";
  const answer = askLetters.length === 1
    ? String(entry.values[askLetters[0]])
    : askLetters.map((index) => `${glyph[index]}=${entry.values[index]}`).join(", ");
  const steps = [];
  if (carryLead >= 0) steps.push(`더한 결과가 한 자리 늘었으므로 맨 앞 ${glyph[carryLead]}는 받아올림 1입니다.`);
  if (typeHint) steps.push(typeHint(glyph, entry));
  steps.push(...columnWalk(entry.rows, glyph, entry.values));
  const naming = entry.values.map((value, index) => `${glyph[index]}=${value}`).join(", ");
  steps.push(`그래서 ${naming}이고, ${entry.addends.join(" + ")} = ${entry.sum}입니다.`);
  return {
    prompt: `다음 세로셈에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. ${askText}`,
    visual: { kind: "cryptarithm-vertical", addends: addRows.map(toCells), sum: toCells(sumRow) },
    answer,
    solution: steps.join(" "),
    meta: {
      family: "b3s-crypt",
      form: family,
      key: entry.key,
      rows: entry.rows,
      glyph,
      values: entry.values,
      askLetters,
      addends: entry.addends,
      sum: entry.sum,
      solutionCount: 1
    }
  };
}

function pickByDifficulty(list, difficulty, measure) {
  if (list.length < 6) return sample(list);
  const sorted = [...list].sort((a, b) => measure(a) - measure(b));
  const third = Math.max(2, Math.floor(sorted.length / 3));
  if (difficulty === 1) return sample(sorted.slice(0, Math.max(third, Math.ceil(sorted.length / 2))));
  if (difficulty === 3) return sample(sorted.slice(-Math.max(third, Math.ceil(sorted.length / 2))));
  return sample(sorted);
}

function cryptGenerator(family, { ask = "all", measure = (entry) => entry.sum, typeHint } = {}) {
  return ({ difficulty = 2 } = {}) => {
    const list = cryptFamily(family, CRYPT_FAMILIES[family]);
    if (!list.length) return null;
    const entry = pickByDifficulty(list, difficulty, measure);
    return cryptProblem(entry, { ask, family, typeHint });
  };
}

const sameDigitHint = (glyph, entry) => {
  const repeated = entry.rows[0][0];
  return "s" in repeated ? `${glyph[repeated.s]}${glyph[repeated.s]}는 ${glyph[repeated.s]}가 11번 있는 수입니다.` : "";
};

// ───────────────────────────── 4단원 마법카드 — 색칠한 칸으로 수 나타내기(새 배치) ─────────────────────────────
// 칸마다 자리값이 있고, 보기 그림 몇 개로 그 값을 알아내 다른 그림을 읽거나(읽기) 주어진 수가 되게 색칠한다(색칠).
// 배치(모눈 세로 3×2 · 가로 2×3 · 동그라미 표시 3×2 · 육각별 끝 · 오각별 끝 · 겹친 정사각형 고리)는 교재 꼴을 따르고,
// 자리값 순서·보기 수·물을 수는 새로 뽑는다. 보기만으로 모든 칸의 값이 하나로 정해지는지(풀어 가기) 확인한다.

const INK = "#5a5244";
const LINE = "#8e816b";
const FILL = "#f9d66c";
const fmt = (value) => Number(value.toFixed(2));
const pts = (list) => list.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");
const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

// 칸 목록: { poly: [[x,y]…] } 또는 { rect: [x,y,w,h], mark: "circle" } — 좌표는 100×100(또는 배치의 box) 안.
function gridCells(rows, columns, size, mark) {
  const cells = [];
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < columns; c += 1) cells.push({ rect: [c * size, r * size, size, size], mark, r, c });
  return cells;
}

const CELL_LAYOUTS = {
  grid32: { box: [60, 90], cells: () => gridCells(3, 2, 30, "fill"), rows: 3, columns: 2 },
  grid23: { box: [90, 60], cells: () => gridCells(2, 3, 30, "fill"), rows: 2, columns: 3 },
  circle32: { box: [60, 90], cells: () => gridCells(3, 2, 30, "circle"), rows: 3, columns: 2 },
  hexagram: {
    box: [100, 100],
    cells: () => range(0, 5).map((k) => {
      const angle = -90 + 60 * k;
      return { poly: [polar(50, 50, 48, angle), polar(50, 50, 48 / Math.sqrt(3), angle - 30), polar(50, 50, 48 / Math.sqrt(3), angle + 30)], k };
    }),
    outline: () => [[-90, 30, 150], [90, 210, 330]].map((tri) => tri.map((angle) => polar(50, 50, 48, angle)))
  },
  pentagram: {
    box: [100, 96],
    cells: () => range(0, 4).map((k) => {
      const angle = -90 + 72 * k;
      const inner = 48 * Math.cos((72 * Math.PI) / 180) / Math.cos((36 * Math.PI) / 180);
      return { poly: [polar(50, 52, 48, angle), polar(50, 52, inner, angle - 36), polar(50, 52, inner, angle + 36)], k };
    }),
    outline: () => [[0, 2, 4, 1, 3].map((k) => polar(50, 52, 48, -90 + 72 * k))]
  },
  nested: {
    box: [100, 100],
    // 겹친 정사각형 셋과 대각선 — 안쪽 네 삼각형, 가운데 고리 네 칸, 바깥 고리 네 칸
    cells: () => {
      const square = (half) => [[50 - half, 50 - half], [50 + half, 50 - half], [50 + half, 50 + half], [50 - half, 50 + half]];
      const [outer, middle, inner] = [square(48), square(32), square(16)];
      const cells = [];
      const sides = ["위", "오른쪽", "아래", "왼쪽"];
      for (let side = 0; side < 4; side += 1) {
        const a = side;
        const b = (side + 1) % 4;
        cells.push({ poly: [[50, 50], inner[a], inner[b]], ring: 0, side: sides[side] });
        cells.push({ poly: [inner[a], middle[a], middle[b], inner[b]], ring: 1, side: sides[side] });
        cells.push({ poly: [middle[a], outer[a], outer[b], middle[b]], ring: 2, side: sides[side] });
      }
      return cells;
    }
  }
};

function cellFigure(layoutName, cells, on, { scale = 1, label = "", labelBelow = "", values = null } = {}) {
  const layout = CELL_LAYOUTS[layoutName];
  const [bw, bh] = layout.box;
  const pad = 3;
  const labelSpace = labelBelow ? 16 : 0;
  const width = (bw + pad * 2) * scale;
  const height = (bh + pad * 2 + labelSpace) * scale;
  const parts = [];
  cells.forEach((cell, index) => {
    const isOn = on.includes(index);
    if (cell.rect) {
      const [x, y, w, h] = cell.rect;
      const fill = cell.mark === "fill" && isOn ? FILL : "#fff";
      parts.push(`<rect x="${x + pad}" y="${y + pad}" width="${w}" height="${h}" fill="${fill}" stroke="${LINE}" stroke-width="1.4"/>`);
      if (cell.mark === "circle" && isOn) parts.push(`<circle cx="${x + pad + w / 2}" cy="${y + pad + h / 2}" r="${w * 0.3}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
    } else {
      const poly = cell.poly.map(([x, y]) => [x + pad, y + pad]);
      parts.push(`<polygon points="${pts(poly)}" fill="${isOn ? FILL : "#fff"}" stroke="${LINE}" stroke-width="1.2"/>`);
    }
  });
  if (layout.outline) layout.outline().forEach((poly) => parts.push(`<polygon points="${pts(poly.map(([x, y]) => [x + pad, y + pad]))}" fill="none" stroke="${LINE}" stroke-width="1.4"/>`));
  if (values) cells.forEach((cell, index) => {
    let cx; let cy;
    if (cell.rect) { cx = cell.rect[0] + cell.rect[2] / 2; cy = cell.rect[1] + cell.rect[3] / 2; } else {
      cx = cell.poly.reduce((sum, [x]) => sum + x, 0) / cell.poly.length;
      cy = cell.poly.reduce((sum, [, y]) => sum + y, 0) / cell.poly.length;
    }
    const small = layoutName === "nested" || layoutName === "pentagram" || layoutName === "hexagram";
    parts.push(`<text x="${fmt(cx + pad)}" y="${fmt(cy + pad + (small ? 3 : 4))}" text-anchor="middle" font-size="${small ? 8 : 11}" font-weight="700" fill="${INK}">${values[index]}</text>`);
  });
  if (label) parts.push(`<text x="${(bw + pad * 2) / 2}" y="${(bh + pad * 2) / 2 + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="${INK}">${label}</text>`);
  if (labelBelow) parts.push(`<text x="${(bw + pad * 2) / 2}" y="${bh + pad * 2 + 13}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${labelBelow}</text>`);
  return `<svg viewBox="0 0 ${bw + pad * 2} ${bh + pad * 2 + labelSpace}" style="width:${fmt(width)}px;max-width:100%;height:auto" role="img" aria-label="색칠한 칸으로 수 나타내기">${parts.join("")}</svg>`;
}

// 자리값 정하기: 칸 하나하나가 두 배씩(1, 2, 4, …) — 차례(시작 칸·방향)를 뽑는다. 겹친 정사각형은 고리마다 1·5·25(한 고리에 네 칸).
function cellWeights(layoutName, cells) {
  if (layoutName === "nested") return { weights: cells.map((cell) => [1, 5, 25][cell.ring]), groups: cells.map((cell) => cell.ring), groupValues: [1, 5, 25] };
  let order;
  const n = cells.length;
  if (cells[0].rect) {
    const { rows, columns } = CELL_LAYOUTS[layoutName];
    const columnMajor = Math.random() < 0.5;
    const fromRight = Math.random() < 0.5;
    const fromBottom = Math.random() < 0.5;
    const list = [];
    if (columnMajor) for (let c0 = 0; c0 < columns; c0 += 1) for (let r0 = 0; r0 < rows; r0 += 1) list.push([fromBottom ? rows - 1 - r0 : r0, fromRight ? columns - 1 - c0 : c0]);
    else for (let r0 = 0; r0 < rows; r0 += 1) for (let c0 = 0; c0 < columns; c0 += 1) list.push([fromBottom ? rows - 1 - r0 : r0, fromRight ? columns - 1 - c0 : c0]);
    order = list.map(([r, c]) => r * columns + c);
  } else {
    const start = randomInt(0, n - 1);
    const step = Math.random() < 0.5 ? 1 : n - 1;
    order = range(0, n - 1).map((index) => (start + index * step) % n);
  }
  const weights = [];
  order.forEach((cellIndex, rank) => { weights[cellIndex] = 2 ** rank; });
  return { weights, groups: range(0, n - 1), groupValues: weights };
}

// 보기만으로 모든 무리(칸 또는 고리)의 값이 하나로 풀리는지 — 모르는 것이 하나뿐인 보기부터 차례로 푼다.
function examplesDetermine(examples, groups, groupCount) {
  const known = new Map();
  let progress = true;
  while (progress) {
    progress = false;
    for (const example of examples) {
      const counts = new Map();
      example.on.forEach((cell) => counts.set(groups[cell], (counts.get(groups[cell]) || 0) + 1));
      const unknown = [...counts.keys()].filter((group) => !known.has(group));
      if (unknown.length !== 1) continue;
      const rest = [...counts.entries()].filter(([group]) => known.has(group)).reduce((sum, [group, count]) => sum + known.get(group) * count, 0);
      known.set(unknown[0], (example.value - rest) / counts.get(unknown[0]));
      progress = true;
    }
  }
  return known.size === groupCount;
}

function onCellsFor(value, weights, groups, layoutName) {
  if (layoutName === "nested") {
    // 고리마다 그 자리 숫자만큼 아무 칸이나 칠한다(색칠 자리는 뽑는다)
    const digits = [value % 5, Math.floor(value / 5) % 5, Math.floor(value / 25) % 5];
    return digits.flatMap((digit, ring) => shuffle(range(0, weights.length - 1).filter((cell) => groups[cell] === ring)).slice(0, digit)).sort((a, b) => a - b);
  }
  return range(0, weights.length - 1).filter((cell) => value & weights[cell]);
}

function cellCodeProblem(layoutName, { difficulty = 2 } = {}) {
  const layout = CELL_LAYOUTS[layoutName];
  const cells = layout.cells();
  const { weights, groups, groupValues } = cellWeights(layoutName, cells);
  const groupCount = groupValues.length;
  const maximum = layoutName === "nested" ? 124 : weights.reduce((sum, value) => sum + value, 0);
  const pieces = (value) => onCellsFor(value, weights, groups, layoutName).length;
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const exampleCount = randomInt(5, 7);
    const pool = range(1, maximum).filter((value) => pieces(value) <= (layoutName === "nested" ? 3 : 2));
    const values = shuffle(pool).slice(0, exampleCount).sort((a, b) => a - b);
    const examples = values.map((value) => ({ value, on: onCellsFor(value, weights, groups, layoutName) }));
    if (examples.filter((example) => example.on.length >= 2).length < (difficulty === 1 ? 1 : 2)) continue;
    if (!examplesDetermine(examples, groups, groupCount)) continue;
    const want = difficulty === 1 ? [2, 3] : difficulty === 2 ? [3, 4] : [4, 6];
    const targets = range(1, maximum).filter((value) => !values.includes(value) && pieces(value) >= want[0] && pieces(value) <= want[1]);
    if (!targets.length) continue;
    const target = sample(targets);
    const on = onCellsFor(target, weights, groups, layoutName);
    const mode = Math.random() < (difficulty === 1 ? 0.7 : 0.5) ? "read" : "color";
    const exampleSvgs = examples.map((example) => cellFigure(layoutName, cells, example.on, { scale: 0.62, labelBelow: String(example.value) }));
    const questionSvg = mode === "read"
      ? cellFigure(layoutName, cells, on, { scale: 1.05, labelBelow: "?" })
      : cellFigure(layoutName, cells, [], { scale: 1.05, labelBelow: String(target) });
    const parts = on.map((cell) => weights[cell]);
    const valueText = layoutName === "nested"
      ? "안쪽 삼각형 한 칸은 1, 가운데 고리 한 칸은 5, 바깥 고리 한 칸은 25"
      : `칸의 수는 ${[...weights].sort((a, b) => a - b).slice(0, -1).join(", ")}, ${ro(Math.max(...weights))} 한 칸 옮길 때마다 두 배`;
    const sumText = `${[...parts].sort((a, b) => b - a).join(" + ")} = ${target}`;
    const answerVisual = { kind: "fig", html: cellFigure(layoutName, cells, on, { scale: 1.05, labelBelow: String(target), values: weights }) };
    return {
      prompt: mode === "read"
        ? "보기는 칸에 색칠하여 수를 나타낸 것입니다. 규칙을 찾아 「?」 그림이 나타내는 수를 구하세요."
        : `보기는 칸에 색칠하여 수를 나타낸 것입니다. 규칙을 찾아 빈 그림이 ${target}${BATCHIM_DIGIT[target % 10] ? "이" : "가"} 되도록 색칠하세요.`,
      visual: { kind: "fig", html: `${exampleSvgs.join("")}${questionSvg}` },
      answer: mode === "read" ? String(target) : `${target}${BATCHIM_DIGIT[target % 10] ? "이" : "가"} 되도록 ${layoutName === "nested" ? `안쪽 ${target % 5}칸, 가운데 고리 ${Math.floor(target / 5) % 5}칸, 바깥 고리 ${Math.floor(target / 25)}칸` : [...parts].sort((a, b) => b - a).join("·") + " 칸"} 색칠`,
      answerVisual,
      responseKind: mode === "color" ? "drawing" : "text",
      solution: `한 칸만 색칠한 보기와 두 칸 이상 색칠한 보기를 견주면 ${valueText}입니다. ${mode === "read" ? "색칠한 칸의 수를 더하면" : `${target}${BATCHIM_DIGIT[target % 10] ? "은" : "는"}`} ${sumText}${mode === "read" ? "입니다." : "이므로 그 칸들을 색칠합니다."}`,
      meta: { family: "b3s-cell-code", layout: layoutName, weights, groups, examples, on, target, mode }
    };
  }
  return null;
}

// ───────────────────────────── 4단원 마방진 — 교재 꼴 넷 ─────────────────────────────
// ① 도움 칸(마름모)으로 3×3 만들기 ② 보이는 수로 한 줄의 합부터 구하고 모두 채우기
// ③ 수가 조금만 보이는 4×4에서 색칠한 칸 ④ 오각진의 줄 합이 14가 아닌 다른 합

const magicFlat = (grid) => grid.flat();
const MAGIC_LINES_3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const MAGIC_LINES_4 = [
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
  [0, 5, 10, 15], [3, 6, 9, 12]
];
const isMagic = (flat, lines) => {
  const sums = lines.map((line) => line.reduce((sum, index) => sum + flat[index], 0));
  return sums.every((sum) => sum === sums[0]) && new Set(flat).size === flat.length;
};

// ① 도움 칸 — 5×5 마름모 자리에 이어지는 아홉 수를 대각선으로 세 줄 쓰고, 3×3 밖으로 나간 수를 맞은편 안쪽으로 옮긴다.
//    마름모 자리: k번째 수(0~8) = (i, j) = (k÷3, k%3) → 행 i + j, 열 2 − i + j. 여덟 가지 방향은 마름모를 돌리고 뒤집어 만든다.
function diamondPositions(symmetry) {
  const base = range(0, 8).map((k) => { const i = Math.floor(k / 3); const j = k % 3; return [i + j, 2 - i + j]; });
  const turn = ([r, c]) => [c, 4 - r];
  const flip = ([r, c]) => [r, 4 - c];
  return base.map((point) => {
    let p = point;
    for (let t = 0; t < symmetry % 4; t += 1) p = turn(p);
    return symmetry >= 4 ? flip(p) : p;
  });
}
function helperSquare(start, step, symmetry) {
  const places = diamondPositions(symmetry);
  const grid = Array.from({ length: 3 }, () => Array(3).fill(null));
  places.forEach(([r, c], k) => {
    let rr = r; let cc = c;
    if (rr === 0) rr = 3; else if (rr === 4) rr = 1;
    if (cc === 0) cc = 3; else if (cc === 4) cc = 1;
    grid[rr - 1][cc - 1] = start + k * step;
  });
  return { grid, places };
}

function diamondFigure(places, values, shownCount) {
  const size = 34;
  const pad = 4;
  const parts = [];
  const inside = (r, c) => r >= 1 && r <= 3 && c >= 1 && c <= 3;
  const cells = new Set(places.map(([r, c]) => `${r},${c}`));
  for (let r = 0; r < 5; r += 1) for (let c = 0; c < 5; c += 1) {
    if (!inside(r, c) && !cells.has(`${r},${c}`)) continue;
    const x = pad + c * size; const y = pad + r * size;
    parts.push(inside(r, c)
      ? `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`
      : `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fffaf0" stroke="${LINE}" stroke-width="1.2" stroke-dasharray="4 3"/>`);
  }
  places.slice(0, shownCount).forEach(([r, c], k) => {
    parts.push(`<text x="${pad + c * size + size / 2}" y="${pad + r * size + size / 2 + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="${INK}">${values[k]}</text>`);
  });
  const total = pad * 2 + size * 5;
  return `<svg viewBox="0 0 ${total} ${total}" style="width:${total + 20}px;max-width:100%;height:auto" role="img" aria-label="도움 칸이 붙은 3×3 마방진">${parts.join("")}</svg>`;
}

function magicHelperCells({ difficulty = 2 } = {}) {
  const start = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 6 : 4);
  const step = difficulty === 3 ? randomInt(1, 2) : 1;
  const symmetry = randomInt(0, 7);
  const { grid, places } = helperSquare(start, step, symmetry);
  const values = range(0, 8).map((k) => start + k * step);
  const shownCount = difficulty === 1 ? 4 : 3;
  const lineSum = grid[0].reduce((sum, value) => sum + value, 0);
  const cards = values;
  return {
    prompt: `${values[0]}부터 ${values[8]}까지 ${step === 1 ? "이어지는" : `${step}씩 커지는`} 아홉 수를 보이는 수처럼 대각선 방향으로 차례로 쓰고, 점선 도움 칸에 들어간 수를 맞은편 안쪽 빈칸으로 옮겨 가로, 세로, 대각선의 합이 모두 같은 마방진을 완성하세요.`,
    visual: { kind: "fig", html: `${diamondFigure(places, values, shownCount)}` },
    answerVisual: { kind: "book3", subtype: "magic-grid", size: 3, cards: [], shown: magicFlat(grid), lineSum },
    answer: grid.map((row) => row.join(" ")).join(" / "),
    responseKind: "drawing",
    solution: `보이는 수 다음 수를 같은 대각선 방향으로 세 개씩 이어 씁니다. 3×3 밖 점선 칸의 수는 세 칸 건너 맞은편 안쪽으로 옮깁니다. 그러면 ${grid.map((row) => row.join(", ")).join(" / ")}이 되고 모든 줄의 합은 ${lineSum}입니다.`,
    meta: { family: "b3s-magic-helper", start, step, symmetry, grid, lineSum, shownCount, cards }
  };
}

// ② 한 줄의 합부터 — 마방진은 가운데 c와 두 수 a, b로 모두 쓸 수 있다(아래 자리별 식). 보이는 칸으로 c·a·b가 하나로 정해지면 답이 하나다.
const MAGIC3_FORM = [[1, 1, 0], [1, -1, -1], [1, 0, 1], [1, -1, 1], [1, 0, 0], [1, 1, -1], [1, 0, -1], [1, 1, 1], [1, -1, 0]]; // c, a, b 계수
function rank3(rows) {
  const m = rows.map((row) => [...row]);
  let rank = 0;
  for (let col = 0; col < 3 && rank < m.length; col += 1) {
    const pivot = m.findIndex((row, index) => index >= rank && Math.abs(row[col]) > 1e-9);
    if (pivot < 0) continue;
    [m[rank], m[pivot]] = [m[pivot], m[rank]];
    for (let r = 0; r < m.length; r += 1) if (r !== rank) {
      const f = m[r][col] / m[rank][col];
      for (let k = 0; k < 3; k += 1) m[r][k] -= f * m[rank][k];
    }
    rank += 1;
  }
  return rank;
}
function magicSquareFromParams(c, a, b) {
  return MAGIC3_FORM.map(([kc, ka, kb]) => kc * c + ka * a + kb * b);
}

function magicSumThenFill({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const step = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 3 : 2);
    const start = randomInt(1, difficulty === 3 ? 9 : 5);
    // 이어지는(또는 일정하게 커지는) 아홉 수의 마방진 — 가운데는 다섯째 수, a·b는 step의 배수
    const c = start + 4 * step;
    const [a, b] = sample([[1, 3], [-1, 3], [1, -3], [-1, -3], [3, 1], [-3, 1], [3, -1], [-3, -1]]).map((value) => value * step);
    const flat = magicSquareFromParams(c, a, b);
    if (!isMagic(flat, MAGIC_LINES_3) || Math.min(...flat) < 1) continue;
    // 보이는 칸: 한 줄 전부 + 다른 한 칸(교재 꼴) — 또는 가운데 + 두 칸
    const pattern = difficulty === 1 || Math.random() < 0.6 ? "line" : "center";
    let shownIdx;
    if (pattern === "line") {
      const line = sample(MAGIC_LINES_3.slice(0, 6));
      const other = sample(range(0, 8).filter((index) => !line.includes(index) && index !== 4));
      shownIdx = [...line, other];
    } else {
      shownIdx = [4, ...shuffle(range(0, 8).filter((index) => index !== 4)).slice(0, 2)];
    }
    if (rank3(shownIdx.map((index) => MAGIC3_FORM[index])) !== 3) continue;
    const lineSum = 3 * c;
    const shown = flat.map((value, index) => shownIdx.includes(index) ? value : null);
    const grid = [flat.slice(0, 3), flat.slice(3, 6), flat.slice(6, 9)];
    return {
      prompt: "가로, 세로, 대각선의 합이 모두 같도록 빈칸을 채우려고 합니다. 한 줄의 합을 먼저 구하고, 빈칸을 모두 채우세요.",
      visual: { kind: "book3", subtype: "magic-grid", size: 3, cards: [], shown, lineSum: null },
      answerVisual: { kind: "book3", subtype: "magic-grid", size: 3, cards: [], shown: flat, lineSum },
      answer: `합 ${lineSum} · ${grid.map((row) => row.join(" ")).join(" / ")}`,
      responseKind: "drawing",
      solution: pattern === "line"
        ? `세 칸이 모두 보이는 줄을 더하면 한 줄의 합은 ${lineSum}이고, 가운데 수는 그 합을 셋으로 나눈 ${c}입니다. 두 칸을 아는 줄부터 ${lineSum}에서 빼며 채우면 ${grid.map((row) => row.join(", ")).join(" / ")}입니다.`
        : `가운데 수 ${c}의 세 배인 ${lineSum}이 한 줄의 합입니다. 두 칸을 아는 줄부터 ${lineSum}에서 빼며 채우면 ${grid.map((row) => row.join(", ")).join(" / ")}입니다.`,
      meta: { family: "b3s-magic-fill", flat, shownIdx, lineSum, pattern }
    };
  }
  return null;
}

// ③ 4×4, 수가 조금만 보이는 마방진 — 1부터 16까지의 마방진을 찾아 두고(한 줄 34), 한 줄에 모르는 칸이 하나뿐이면 채우는 일을 되풀이해
//    색칠한 칸이 정해질 때까지 남기는 칸을 줄인다. 이렇게 채워지는 칸은 다른 답이 있을 수 없다.
let magicFourPool = null;
function findMagicFours(limit) {
  const found = [];
  const grid = Array(16).fill(0);
  const used = Array(17).fill(false);
  const order = shuffle(range(1, 16));
  const rowOk = (r) => grid[r * 4] + grid[r * 4 + 1] + grid[r * 4 + 2] + grid[r * 4 + 3] === 34;
  const walk = (index) => {
    if (found.length >= limit) return;
    if (index === 16) {
      if (isMagic(grid, MAGIC_LINES_4)) found.push([...grid]);
      return;
    }
    const r = Math.floor(index / 4); const c = index % 4;
    for (const value of order) {
      if (used[value]) continue;
      grid[index] = value;
      if (c === 3 && !rowOk(r)) continue;
      if (r === 3) {
        const colSum = grid[c] + grid[4 + c] + grid[8 + c] + value;
        if (colSum !== 34) continue;
        if (c === 0 && grid[3] + grid[6] + grid[9] + value !== 34) continue;
        if (c === 3 && grid[0] + grid[5] + grid[10] + value !== 34) continue;
      }
      if (c === 2) { const need = 34 - grid[r * 4] - grid[r * 4 + 1] - value; if (need < 1 || need > 16 || used[need] || need === value) continue; }
      used[value] = true;
      walk(index + 1);
      used[value] = false;
      if (found.length >= limit) return;
    }
    grid[index] = 0;
  };
  walk(0);
  return found;
}
function propagateFour(shown) {
  const values = [...shown];
  let progress = true;
  while (progress) {
    progress = false;
    for (const line of MAGIC_LINES_4) {
      const unknown = line.filter((index) => values[index] == null);
      if (unknown.length !== 1) continue;
      values[unknown[0]] = 34 - line.filter((index) => values[index] != null).reduce((sum, index) => sum + values[index], 0);
      progress = true;
    }
  }
  return values;
}
function magicFourSparse({ difficulty = 2 } = {}) {
  if (!magicFourPool) {
    magicFourPool = [];
    for (let round = 0; round < 6 && magicFourPool.length < 24; round += 1) magicFourPool.push(...findMagicFours(4));
  }
  const solution = sample(magicFourPool);
  const target = randomInt(0, 15);
  // 칸을 하나씩 지워 보며 색칠한 칸이 여전히 정해지면 지운다(지우는 차례는 뽑는다).
  let shown = [...solution];
  shown[target] = null;
  const keepAtLeast = difficulty === 1 ? 9 : difficulty === 2 ? 7 : 5;
  for (const index of shuffle(range(0, 15).filter((value) => value !== target))) {
    if (shown.filter((value) => value != null).length <= keepAtLeast) break;
    const trial = [...shown];
    trial[index] = null;
    if (propagateFour(trial)[target] === solution[target]) shown = trial;
  }
  const answer = solution[target];
  const display = shown.map((value, index) => (index === target ? "㉠" : value));
  return {
    prompt: "1부터 16까지의 수를 한 번씩 쓴 4×4 마방진입니다. 가로, 세로, 대각선의 네 수의 합이 모두 같을 때 ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "book3", subtype: "magic-grid", size: 4, cards: [], shown: display, lineSum: null },
    answerVisual: { kind: "book3", subtype: "magic-grid", size: 4, cards: [], shown: solution, lineSum: 34 },
    answer: String(answer),
    solution: `1부터 16까지의 합은 136이고 가로줄이 넷이므로 한 줄의 합은 136 ÷ 4 = 34입니다. 모르는 칸이 하나뿐인 줄부터 34에서 보이는 수를 빼며 채워 가면 ㉠은 ${answer}입니다.`,
    meta: { family: "b3s-magic-four", solution, shown, target, answer }
  };
}

// ④ 오각진 — 꼭짓점 다섯과 변 가운데 다섯에 1~10, 다섯 줄(꼭짓점–가운데–꼭짓점)의 합이 같다. 합 14·16·17·19 가운데 14가 아닌 합.
const RING_CACHE = new Map();
function ringSolutions(lineSum) {
  if (RING_CACHE.has(lineSum)) return RING_CACHE.get(lineSum);
  const list = [];
  const corners = [];
  const used = Array(11).fill(false);
  const walk = () => {
    if (corners.length === 5) {
      const mids = corners.map((value, index) => lineSum - value - corners[(index + 1) % 5]);
      const all = new Set([...corners, ...mids]);
      if (all.size === 10 && mids.every((value) => value >= 1 && value <= 10)) {
        const ring = [];
        corners.forEach((value, index) => ring.push(value, mids[index]));
        list.push(ring);
      }
      return;
    }
    for (let value = 1; value <= 10; value += 1) {
      if (used[value]) continue;
      used[value] = true; corners.push(value);
      walk();
      corners.pop(); used[value] = false;
    }
  };
  walk();
  RING_CACHE.set(lineSum, list);
  return list;
}
function ringOtherSum({ difficulty = 2 } = {}) {
  const lineSum = sample(difficulty === 1 ? [16, 17] : [16, 17, 19]);
  const all = ringSolutions(lineSum);
  const solution = sample(all);
  const order = shuffle(range(0, 9));
  const clues = [];
  const matches = () => all.filter((ring) => clues.every((index) => ring[index] === solution[index])).length;
  const start = difficulty === 1 ? 5 : difficulty === 2 ? 4 : 3;
  for (const index of order) {
    clues.push(index);
    if (clues.length >= start && matches() === 1) break;
  }
  // 줄이 되는 만큼 줄여 본다(교재처럼 적게 보이도록)
  for (const index of shuffle([...clues])) {
    if (clues.length <= 3) break;
    const keep = clues.filter((value) => value !== index);
    if (all.filter((ring) => keep.every((i) => ring[i] === solution[i])).length === 1) clues.splice(clues.indexOf(index), 1);
  }
  const shown = solution.map((value, index) => (clues.includes(index) ? value : null));
  return {
    prompt: `1부터 10까지의 수를 한 번씩 넣어 오각형의 한 줄 위에 있는 세 수의 합이 모두 ${lineSum}${BATCHIM_DIGIT[lineSum % 10] ? "이" : "가"} 되게 빈 원을 채우세요.`,
    visual: { kind: "book3", subtype: "polygon-ring", cards: range(1, 10), shown, lineSum },
    answerVisual: { kind: "book3", subtype: "polygon-ring", cards: [], shown: solution, lineSum },
    answer: solution.join(", "),
    responseKind: "drawing",
    solution: `다섯 줄의 합을 모두 더하면 1부터 10까지의 합 55에 꼭짓점 수가 한 번 더 들어가므로, 꼭짓점 다섯 수의 합은 ${lineSum} × 5 − 55 = ${lineSum * 5 - 55}입니다. 두 수를 아는 줄부터 ${lineSum}에서 빼며 채우면 ${solution.join(", ")} 차례가 됩니다.`,
    meta: { family: "b3s-ring", solution, lineSum, clues }
  };
}

// ───────────────────────────── 1단원 — 바로 선·기운 정사각형이 번갈아 감싸며 넓이가 두 배 ─────────────────────────────
// 가장 작은 정사각형(바로 선)을 기운 정사각형이 꼭짓점에 닿게 감싸고, 그것을 다시 바로 선 정사각형이 감싼다 — 바깥 정사각형의 넓이는 늘 두 배.

function nestedDoublingFigure(level, cell) {
  // level번째 모양: 넓이 1, 2, 4, …, 2^(level-1)(칸 단위) 정사각형을 차례로 겹친다.
  const outerArea = 2 ** (level - 1);
  const half = (level - 1) % 2 === 0 ? Math.sqrt(outerArea) / 2 : Math.sqrt(outerArea / 2);
  const span = Math.max(2, Math.ceil(half * 2) + 2);
  const size = span * cell;
  const center = size / 2;
  const parts = [];
  for (let i = 0; i <= span; i += 1) {
    parts.push(`<line x1="${i * cell}" y1="0" x2="${i * cell}" y2="${size}" stroke="#d9d2c3" stroke-width="0.8"/>`);
    parts.push(`<line x1="0" y1="${i * cell}" x2="${size}" y2="${i * cell}" stroke="#d9d2c3" stroke-width="0.8"/>`);
  }
  for (let j = level - 1; j >= 0; j -= 1) {
    const area = 2 ** j;
    let poly;
    if (j % 2 === 0) {
      const h = (Math.sqrt(area) / 2) * cell;
      poly = [[center - h, center - h], [center + h, center - h], [center + h, center + h], [center - h, center + h]];
    } else {
      const d = Math.sqrt(area / 2) * cell;
      poly = [[center, center - d], [center + d, center], [center, center + d], [center - d, center]];
    }
    const fill = j === level - 1 && level > 1 ? "#e3f0ea" : j === 0 ? FILL : "none";
    parts.push(`<polygon points="${pts(poly)}" fill="${fill}" stroke="${j === 0 ? "#b03a2e" : INK}" stroke-width="${j === 0 ? 1.8 : 1.4}"/>`);
  }
  return { svg: parts.join(""), size };
}

function nestedSquareDoubling({ difficulty = 2 } = {}) {
  const unit = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 5 : 3);
  const askSum = difficulty === 1 ? Math.random() < 0.4 : Math.random() < 0.6;
  const target = difficulty === 1 ? randomInt(5, 6) : difficulty === 2 ? randomInt(5, 7) : randomInt(6, 9);
  const cell = 14;
  const figures = range(1, 4).map((level) => nestedDoublingFigure(level, cell));
  const gap = 18;
  const height = Math.max(...figures.map((f) => f.size)) + 22;
  let x = 0;
  const groups = figures.map((figure, index) => {
    const y = (height - 22 - figure.size) / 2;
    const out = `<g transform="translate(${x},${y})">${figure.svg}</g><text x="${x + figure.size / 2}" y="${height - 4}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${index + 1}번째</text>`;
    x += figure.size + gap;
    return out;
  });
  const width = x + 20;
  groups.push(`<text x="${x - 2}" y="${(height - 22) / 2 + 5}" font-size="16" font-weight="700" fill="${INK}">…</text>`);
  const svg = `<svg viewBox="0 0 ${width} ${height}" style="width:${Math.min(width, 560)}px;max-width:100%;height:auto" role="img" aria-label="바로 선 정사각형과 기운 정사각형이 번갈아 감싸는 모양">${groups.join("")}</svg>`;
  const areas = range(1, target).map((k) => unit * 2 ** (k - 1));
  const total = areas.reduce((sum, value) => sum + value, 0);
  const answer = askSum ? total : areas[target - 1];
  return {
    prompt: askSum
      ? `모눈 위에 같은 규칙으로 정사각형을 겹쳐 그렸습니다. 가장 작은 정사각형의 넓이가 ${unit}일 때, 1번째부터 ${target}번째까지 가장 바깥에 있는 정사각형 넓이의 합을 구하세요.`
      : `모눈 위에 같은 규칙으로 정사각형을 겹쳐 그렸습니다. 가장 작은 정사각형의 넓이가 ${unit}일 때, ${target}번째 모양에서 가장 바깥에 있는 정사각형의 넓이를 구하세요.`,
    visual: { kind: "fig", html: svg },
    answer: String(answer),
    solution: `감싸는 정사각형은 안쪽 정사각형을 반으로 접은 삼각형 네 개를 바깥에 더 붙인 것이라 넓이가 두 배입니다. 가장 바깥 정사각형의 넓이는 ${areas.join(", ")}${askSum ? `이고, 모두 더하면 ${total}입니다.` : `이므로 ${target}번째는 ${answer}입니다.`}`,
    meta: { family: "b3s-nested-doubling", unit, target, askSum, areas, answer }
  };
}

// ───────────────────────────── 2단원 — 같은 길이의 줄에 막대를 여러 개씩(막대 사슬) ─────────────────────────────
// 줄마다 같은 전체 길이를 서로 다른 막대로 채운다. 한 막대의 길이를 알려 주고 나머지 막대의 길이를 묻는다.
const ROD_NAMES = ["㉠", "㉡", "㉢", "㉣", "㉤"];

function rodRowsFigure(rows, total, givenText) {
  const width = 300;
  const rowHeight = 30;
  const parts = [];
  rows.forEach((row, r) => {
    let x = 0;
    row.forEach((piece) => {
      const w = (piece.length / total) * width;
      parts.push(`<rect x="${fmt(x + 2)}" y="${r * rowHeight + 2}" width="${fmt(w)}" height="${rowHeight}" fill="#eef5f1" stroke="${INK}" stroke-width="1.4"/>`);
      const label = givenText && piece.name === givenText.name && !givenText.used ? `${piece.name}=${givenText.value}cm` : piece.name;
      if (label !== piece.name) givenText.used = true;
      parts.push(`<text x="${fmt(x + 2 + w / 2)}" y="${r * rowHeight + 2 + rowHeight / 2 + 5}" text-anchor="middle" font-size="${label.length > 3 ? 12 : 14}" font-weight="700" fill="${INK}">${label}</text>`);
      x += w;
    });
  });
  return `<svg viewBox="0 0 ${width + 4} ${rows.length * rowHeight + 4}" style="width:${width + 40}px;max-width:100%;height:auto" role="img" aria-label="같은 길이의 줄을 서로 다른 막대로 채운 그림">${parts.join("")}</svg>`;
}

// 줄마다 한 가지 막대를 여러 개(연습 14 꼴)
function rodRowsCounts({ difficulty = 2 } = {}) {
  const rowsCount = difficulty === 1 ? 3 : 4;
  const counts = shuffle(difficulty === 3 ? range(2, 6) : range(1, 5)).slice(0, rowsCount).sort((a, b) => a - b);
  const lcm = counts.reduce((acc, value) => (acc * value) / gcdInt(acc, value), 1);
  const scale = randomInt(1, difficulty === 3 ? 3 : 2);
  const total = lcm * scale;
  const rods = counts.map((count, index) => ({ name: ROD_NAMES[index], count, length: total / count }));
  const given = sample(rods);
  const rows = rods.map((rod) => Array.from({ length: rod.count }, () => ({ name: rod.name, length: rod.length })));
  const others = rods.filter((rod) => rod !== given);
  return {
    prompt: `길이가 다른 막대 ${rowsCount}가지를 같은 길이의 줄에 늘어놓았습니다. 막대 ${given.name}의 길이가 ${given.length}cm일 때, 나머지 막대의 길이를 각각 구하세요.`,
    visual: { kind: "fig", html: rodRowsFigure(rows, total, { name: given.name, value: given.length }) },
    answer: others.map((rod) => `${rod.name}=${rod.length}cm`).join(", "),
    solution: `막대 ${given.name} ${given.count}개가 한 줄이므로 한 줄의 길이는 ${given.length} × ${given.count} = ${total}cm입니다. 한 줄을 다른 막대의 개수로 나누면 ${others.map((rod) => `${rod.name}은 ${total} ÷ ${rod.count} = ${rod.length}cm`).join(", ")}입니다.`,
    meta: { family: "b3s-rod-rows", total, rods, given: given.name }
  };
}

// 첫 줄이 「긴 막대 하나 + 짧은 막대 여럿」(연습 13 꼴) — 짧은 막대 몇 개가 아래 줄 막대 하나와 끝이 맞는다.
function rodRowsMixed({ difficulty = 2 } = {}) {
  const middleCount = sample(difficulty === 1 ? [3] : [3, 4]);           // 둘째 줄 막대 개수
  const shortPerMiddle = sample(difficulty === 3 ? [2, 3] : [2]);       // 짧은 막대 몇 개 = 둘째 줄 막대 하나
  const lastCount = sample(range(2, 6).filter((value) => value !== middleCount));
  const shortLength = randomInt(1, difficulty === 3 ? 4 : 3);
  const middleLength = shortLength * shortPerMiddle;
  const total = middleLength * middleCount;
  const longLength = total - middleLength;
  // 네 막대 길이가 모두 다르고 ㉣도 자연수일 때만(같은 길이 둘이면 그림에서 구별이 흐려진다)
  if (total % lastCount || new Set([shortLength, longLength, middleLength, total / lastCount]).size !== 4) return rodRowsMixed({ difficulty });
  const rods = [
    { name: "㉠", length: shortLength },
    { name: "㉡", length: longLength },
    { name: "㉢", length: middleLength },
    { name: "㉣", length: total / lastCount }
  ];
  const rows = [
    [{ name: "㉡", length: longLength }, ...Array.from({ length: shortPerMiddle }, () => ({ name: "㉠", length: shortLength }))],
    Array.from({ length: middleCount }, () => ({ name: "㉢", length: middleLength })),
    Array.from({ length: lastCount }, () => ({ name: "㉣", length: total / lastCount }))
  ];
  const others = rods.slice(1);
  return {
    prompt: `여러 개의 막대가 같은 길이의 줄에 놓여 있습니다. 막대 ㉠의 길이가 ${shortLength}cm일 때, 막대 ㉡, ㉢, ㉣의 길이를 각각 구하세요.`,
    visual: { kind: "fig", html: rodRowsFigure(rows, total, null) },
    answer: others.map((rod) => `${rod.name}=${rod.length}cm`).join(", "),
    solution: `막대 ㉠ ${shortPerMiddle}개와 막대 ㉢ 1개의 끝이 맞으므로 ㉢은 ${shortLength} × ${shortPerMiddle} = ${middleLength}cm, 한 줄은 ${middleLength} × ${middleCount} = ${total}cm입니다. ㉡은 ${total} − ${middleLength} = ${longLength}cm, ㉣은 ${total} ÷ ${lastCount} = ${total / lastCount}cm입니다.`,
    meta: { family: "b3s-rod-rows", total, rods, given: "㉠", rows }
  };
}

function gcdInt(a, b) { let x = Math.abs(a); let y = Math.abs(b); while (y) [x, y] = [y, x % y]; return x || 1; }

// ───────────────────────────── 1단원 — 조각 나누기와 분수(공용 도구) ─────────────────────────────
// 도형을 「모양과 크기가 같은 가장 작은 조각(칸)」으로 나눈 틀을 만들고, 이웃한 칸을 볼록한 모양으로만 합쳐 그림의 조각을 만든다.
// 그림에는 조각의 경계만 긋는다(빠진 선). 칸 하나짜리 조각을 꼭 남겨 「가장 작은 조각」이 그림에 보이게 한다.
// 답 = 색칠한 칸 수 / 전체 칸 수. 검사기는 넓이(신발끈 공식)로 따로 셈한다.

const SQ3 = Math.sqrt(3);
const r6 = (value) => Math.round(value * 1e6) / 1e6;
const SHADE = "#f7d878";
const ADDED = "#c0392b";
const vkey = ([x, y]) => `${Math.round(x * 1e4)},${Math.round(y * 1e4)}`;
const ekey = (a, b) => { const p = vkey(a); const q = vkey(b); return p < q ? `${p}|${q}` : `${q}|${p}`; };
const signedArea = (poly) => poly.reduce((sum, [x, y], index) => { const [u, v] = poly[(index + 1) % poly.length]; return sum + x * v - u * y; }, 0) / 2;
const areaOf = (poly) => Math.abs(signedArea(poly));
const meanPoint = (poly) => [poly.reduce((s, [x]) => s + x, 0) / poly.length, poly.reduce((s, [, y]) => s + y, 0) / poly.length];
const midOf = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const CIRCLED = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];

function hullArea(points) {
  const hull = hullPoints(points);
  return hull.length < 3 ? 0 : areaOf(hull);
}
function hullPoints(points) {
  const unique = [...new Map(points.map((p) => [vkey(p), p])).values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (unique.length < 3) return unique;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of unique) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 1e-9) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of [...unique].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 1e-9) upper.pop(); upper.push(p); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

// 세 꼭짓점 A·B·C 삼각형을 같은 간격 n등분 — n×n개의 닮은 작은 삼각형(정삼각형이면 모두 정삼각형)
function subdivideTriangle(A, B, C, n) {
  const P = (i, j) => [A[0] + ((B[0] - A[0]) * i) / n + ((C[0] - B[0]) * j) / n, A[1] + ((B[1] - A[1]) * i) / n + ((C[1] - B[1]) * j) / n];
  const cells = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) cells.push([P(i, j), P(i + 1, j), P(i + 1, j + 1)]);
    for (let j = 0; j < i; j += 1) cells.push([P(i, j), P(i + 1, j + 1), P(i, j + 1)]);
  }
  return cells;
}
const splitThree = (cell) => { const g = meanPoint(cell); return cell.map((v, k) => [v, cell[(k + 1) % 3], g]); };
const splitSix = (cell) => { const g = meanPoint(cell); return cell.flatMap((v, k) => { const w = cell[(k + 1) % 3]; const m = midOf(v, w); return [[v, m, g], [m, w, g]]; }); };
const hexVertex = (r, k) => [r * Math.cos(((-90 + 60 * k) * Math.PI) / 180), r * Math.sin(((-90 + 60 * k) * Math.PI) / 180)];

// 틀(가장 작은 조각들). 이름은 meta에 남는다.
const LATTICES = {
  tri: (n) => subdivideTriangle([0, 0], [-n / 2, (n * SQ3) / 2], [n / 2, (n * SQ3) / 2], n),
  triThirds: (n) => LATTICES.tri(n).flatMap(splitThree),
  triSixths: (n) => LATTICES.tri(n).flatMap(splitSix),
  grid: (n) => { const cells = []; for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) cells.push([[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]]); return cells; },
  strips: (n) => range(0, n - 1).map((x) => [[x, 0], [x + 1, 0], [x + 1, n], [x, n]]),
  halves: (dir) => (dir === "v" ? [[[0, 0], [1, 0], [1, 2], [0, 2]], [[1, 0], [2, 0], [2, 2], [1, 2]]] : [[[0, 0], [2, 0], [2, 1], [0, 1]], [[0, 1], [2, 1], [2, 2], [0, 2]]]),
  sqHalf: (n, dir = 0) => {
    const cells = [];
    for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) {
      if (dir === 0) cells.push([[x, y], [x + 1, y], [x + 1, y + 1]], [[x, y], [x + 1, y + 1], [x, y + 1]]);
      else cells.push([[x, y], [x + 1, y], [x, y + 1]], [[x + 1, y], [x + 1, y + 1], [x, y + 1]]);
    }
    return cells;
  },
  sqQuarter: (n) => {
    const cells = [];
    for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) {
      const c = [x + 0.5, y + 0.5];
      const q = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
      q.forEach((v, k) => cells.push([v, q[(k + 1) % 4], c]));
    }
    return cells;
  },
  sqEighth: () => LATTICES.sqQuarter(1).flatMap(([a, b, c]) => { const m = midOf(a, b); return [[a, m, c], [m, b, c]]; }),
  // 직각이등변삼각형(직각은 왼쪽 아래, 빗변은 (0,0)–(n,n))
  rightHalf: (n) => LATTICES.sqHalf(n, 0).filter((cell) => { const [x, y] = meanPoint(cell); return y > x; }),
  rightQuarter: (n) => LATTICES.sqQuarter(n).filter((cell) => { const [x, y] = meanPoint(cell); return y > x; }),
  hex: (n) => range(0, 5).flatMap((k) => subdivideTriangle([0, 0], hexVertex(n, k), hexVertex(n, k + 1), n)),
  hexHalves: () => range(0, 5).flatMap((k) => { const a = hexVertex(1, k); const b = hexVertex(1, k + 1); const m = midOf(a, b); return [[[0, 0], a, m], [[0, 0], m, b]]; }),
  hexThirds: () => LATTICES.hex(1).flatMap(splitThree),
  hexEars: () => {
    const V = (k) => hexVertex(1, k);
    return [[V(0), V(1), V(2)], [V(2), V(3), V(4)], [V(4), V(5), V(0)], [[0, 0], V(0), V(2)], [[0, 0], V(2), V(4)], [[0, 0], V(4), V(0)]];
  },
  hexRhombi: () => [0, 2, 4].map((k) => [[0, 0], hexVertex(1, k), hexVertex(1, k + 1), hexVertex(1, k + 2)]),
  hexagram: () => [
    ...LATTICES.hex(1),
    ...range(0, 5).map((k) => { const a = hexVertex(1, k); const b = hexVertex(1, k + 1); return [a, [a[0] + b[0], a[1] + b[1]], b]; })
  ]
};

// 넓이 무게 중심을 가운데로 놓고 돌리고(도) 뒤집는다.
function placeCells(cells, { turn = 0, mirror = false } = {}) {
  let cx = 0; let cy = 0; let total = 0;
  cells.forEach((cell) => { const a = areaOf(cell); const [x, y] = meanPoint(cell); cx += x * a; cy += y * a; total += a; });
  cx /= total; cy /= total;
  const rad = (turn * Math.PI) / 180;
  const cos = Math.cos(rad); const sin = Math.sin(rad);
  const out = cells.map((cell) => cell.map(([x, y]) => {
    const dx = (mirror ? -1 : 1) * (x - cx); const dy = y - cy;
    return [r6(dx * cos - dy * sin), r6(dx * sin + dy * cos)];
  }));
  return out.map((cell) => (mirror ? [...cell].reverse() : cell));
}

function edgeOwners(cells) {
  const owners = new Map();
  cells.forEach((cell, index) => cell.forEach((v, k) => {
    const w = cell[(k + 1) % cell.length];
    const key = ekey(v, w);
    if (!owners.has(key)) owners.set(key, { a: v, b: w, cells: [] });
    owners.get(key).cells.push(index);
  }));
  return owners;
}

function isConvexUnion(cells, indices) {
  const total = indices.reduce((sum, index) => sum + areaOf(cells[index]), 0);
  return Math.abs(hullArea(indices.flatMap((index) => cells[index])) - total) < 1e-6;
}

// 이웃 칸을 볼록하게만 합쳐 조각을 만든다. fixed: 미리 정한 조각(칸 번호 목록들)
function randomPieces(cells, { maxCells = 4, rounds = 12, fixed = [] } = {}) {
  const owners = edgeOwners(cells);
  const neighbors = cells.map(() => new Set());
  owners.forEach(({ cells: list }) => { if (list.length === 2) { neighbors[list[0]].add(list[1]); neighbors[list[1]].add(list[0]); } });
  const pieceOf = cells.map((_, index) => index);
  const members = new Map(cells.map((_, index) => [index, [index]]));
  const locked = new Set();
  fixed.forEach((group) => {
    const id = group[0];
    group.forEach((cell) => { members.delete(pieceOf[cell]); pieceOf[cell] = id; });
    members.set(id, [...group]);
    locked.add(id);
  });
  for (let round = 0; round < rounds; round += 1) {
    const ids = [...members.keys()].filter((id) => !locked.has(id));
    if (!ids.length) break;
    const id = sample(ids);
    const near = [...new Set(members.get(id).flatMap((cell) => [...neighbors[cell]].map((other) => pieceOf[other])))].filter((other) => other !== id && !locked.has(other));
    if (!near.length) continue;
    const other = sample(near);
    const union = [...members.get(id), ...members.get(other)];
    if (union.length > maxCells || !isConvexUnion(cells, union)) continue;
    members.get(other).forEach((cell) => { pieceOf[cell] = id; });
    members.set(id, union);
    members.delete(other);
  }
  return [...members.values()].map((list) => [...list].sort((a, b) => a - b));
}

// 조각 그림(SVG). pieces가 없으면 칸마다 조각(다 그은 그림). answer면 빠졌던 선을 빨갛게 긋는다.
function partitionSvg(cells, { pieces = null, shaded = new Set(), scale = 60, answer = false, label = "", maxWidth = 260 } = {}) {
  const pieceOf = new Map();
  (pieces || cells.map((_, index) => [index])).forEach((list, id) => list.forEach((cell) => pieceOf.set(cell, id)));
  const xs = cells.flat().map(([x]) => x); const ys = cells.flat().map(([, y]) => y);
  const minX = Math.min(...xs); const minY = Math.min(...ys);
  const pad = 4;
  const W = (Math.max(...xs) - minX) * scale + pad * 2;
  const bodyH = (Math.max(...ys) - minY) * scale + pad * 2;
  const H = bodyH + (label ? 20 : 0);
  const at = ([x, y]) => [fmt((x - minX) * scale + pad), fmt((y - minY) * scale + pad)];
  const parts = [];
  cells.forEach((cell, index) => {
    if (!shaded.has(index)) return;
    parts.push(`<polygon points="${cell.map((p) => at(p).join(",")).join(" ")}" fill="${SHADE}" stroke="${SHADE}" stroke-width="0.8"/>`);
  });
  const added = [];
  edgeOwners(cells).forEach(({ a, b, cells: list }) => {
    const boundary = list.length === 1 || pieceOf.get(list[0]) !== pieceOf.get(list[1]);
    const [x1, y1] = at(a); const [x2, y2] = at(b);
    if (boundary) parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`);
    else if (answer) added.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ADDED}" stroke-width="1.3" stroke-linecap="round"/>`);
  });
  parts.push(...added);
  if (label) parts.push(`<text x="${fmt(W / 2)}" y="${fmt(bodyH + 15)}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${label}</text>`);
  return `<svg viewBox="0 0 ${fmt(W)} ${fmt(H)}" style="width:${fmt(Math.min(W, maxWidth))}px;max-width:100%;height:auto" role="img" aria-label="조각으로 나눈 도형">${parts.join("")}</svg>`;
}

// 빠진 선 문제 하나 — lattice: 칸 목록, fixed: 꼭 둘 조각(예: 정사각형), shadeFixedOnly: 정해 둔 조각만 색칠
function incompletePartition({ cells, maxCells, rounds, fixed = [], shadeFixedOnly = false, scale }) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const pieces = randomPieces(cells, { maxCells, rounds: randomInt(Math.ceil(rounds / 3), rounds), fixed: fixed.length ? [fixed] : [] });
    const singles = pieces.filter((list) => list.length === 1).length;
    const merged = pieces.filter((list) => list.length > 1).length;
    if (!singles || !merged || pieces.length < 3) continue;
    let shadedPieces;
    if (shadeFixedOnly) shadedPieces = pieces.filter((list) => list[0] === [...fixed].sort((a, b) => a - b)[0]);
    else {
      const order = shuffle(pieces);
      const count = randomInt(1, Math.max(1, Math.min(order.length - 1, Math.ceil(order.length / 2))));
      shadedPieces = order.slice(0, count);
      if (!shadedPieces.some((list) => list.length > 1)) continue;
    }
    const shadedCells = shadedPieces.flat();
    if (!shadedCells.length || shadedCells.length >= cells.length) continue;
    const shaded = new Set(shadedCells);
    return {
      pieces,
      shadedPieces,
      shaded,
      svg: partitionSvg(cells, { pieces, shaded, scale }),
      answerSvg: partitionSvg(cells, { pieces, shaded, scale, answer: true })
    };
  }
  return null;
}

const FORM_WORDS = {
  tri: ["큰 정삼각형", "작은 정삼각형"],
  triThirds: ["큰 정삼각형", "작은 삼각형"],
  sqHalf: ["정사각형", "작은 삼각형"],
  sqQuarter: ["정사각형", "작은 삼각형"],
  rightHalf: ["직각이등변삼각형", "작은 삼각형"],
  rightQuarter: ["직각이등변삼각형", "작은 삼각형"],
  hexEars: ["정육각형", "작은 삼각형"],
  hexHalves: ["정육각형", "작은 삼각형"],
  hex: ["정육각형", "작은 정삼각형"],
  hexagram: ["육각별", "작은 정삼각형"]
};

function incompleteProblem({ form, size, cells, maxCells, rounds, scale, fixed, shadeFixedOnly, lead, turnNote }) {
  const made = incompletePartition({ cells, maxCells, rounds, fixed, shadeFixedOnly, scale });
  if (!made) return null;
  const [whole, piece] = FORM_WORDS[form];
  const total = cells.length;
  const shadedCount = made.shaded.size;
  const sizes = made.shadedPieces.map((list) => list.length).sort((a, b) => b - a);
  const answer = `${shadedCount}/${total}`;
  return {
    prompt: `${lead || `그림은 ${whole}을 몇 조각으로 나눈 것입니다.`} 빠진 선을 그어 ${whole} 전체를 모양과 크기가 같은 ${piece} 조각으로 나누고, 색칠한 부분을 분수로 나타내세요.`,
    visual: { kind: "fig", html: made.svg },
    answerVisual: { kind: "fig", html: made.answerSvg },
    answer,
    solution: `그림에서 가장 작은 조각 하나를 기준으로 빠진 선을 그으면 ${whole} 전체는 ${total}조각입니다.${turnNote ? ` ${turnNote}` : ""} 색칠한 부분은 ${sizes.length > 1 ? `${sizes.join(" + ")} = ${shadedCount}` : shadedCount}조각이므로 ${answer}입니다.`,
    meta: {
      family: "b3s-partition",
      form,
      size,
      cells: cells.map((cell) => cell.map(([x, y]) => [r6(x), r6(y)])),
      pieces: made.pieces,
      shaded: [...made.shaded].sort((a, b) => a - b),
      total,
      shadedCount
    }
  };
}

const TRI_TURNS = [0, 120, 240];

function partitionTriangleMixed({ difficulty = 2 } = {}) {
  const n = difficulty === 1 ? 3 : difficulty === 2 ? sample([3, 4]) : 4;
  const cells = placeCells(LATTICES.tri(n), { turn: sample(TRI_TURNS), mirror: Math.random() < 0.5 });
  return incompleteProblem({ form: "tri", size: n, cells, maxCells: difficulty === 3 ? 9 : 4, rounds: n * n * 2, scale: n === 3 ? 62 : 50 });
}

function partitionTriangleThirds({ difficulty = 2 } = {}) {
  const n = difficulty === 3 ? 3 : 2;
  const cells = placeCells(LATTICES.triThirds(n), { turn: sample(TRI_TURNS), mirror: Math.random() < 0.5 });
  return incompleteProblem({ form: "triThirds", size: n, cells, maxCells: difficulty === 1 ? 3 : 6, rounds: n * n * 5, scale: n === 2 ? 92 : 64 });
}

function partitionSquare({ difficulty = 2 } = {}) {
  const pick = difficulty === 1 ? { form: "sqHalf", n: 2 } : difficulty === 2 ? sample([{ form: "sqHalf", n: 3 }, { form: "sqQuarter", n: 2 }]) : sample([{ form: "sqQuarter", n: 2 }, { form: "sqHalf", n: 4 }]);
  const base = pick.form === "sqHalf" ? LATTICES.sqHalf(pick.n, randomInt(0, 1)) : LATTICES.sqQuarter(pick.n);
  const cells = placeCells(base, { turn: sample([0, 90, 180, 270]), mirror: Math.random() < 0.5 });
  return incompleteProblem({ form: pick.form, size: pick.n, cells, maxCells: pick.form === "sqQuarter" ? 4 : difficulty === 3 ? 8 : 4, rounds: cells.length * 2, scale: 180 / pick.n });
}

// 직각이등변삼각형 안의 정사각형 — 틀 안에서 칸의 합으로 딱 맞는 정사각형(바로 선 것·기운 것)을 모두 찾아 하나를 고른다.
const SQUARE_CACHE = new Map();
function squaresInLattice(cells) {
  const xs = cells.flat().map(([x]) => x); const ys = cells.flat().map(([, y]) => y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const found = [];
  const inside = (poly, [px, py]) => {
    // 볼록 다각형 안(경계 제외)
    let sign = 0;
    for (let k = 0; k < poly.length; k += 1) {
      const [ax, ay] = poly[k]; const [bx, by] = poly[(k + 1) % poly.length];
      const c = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
      if (Math.abs(c) < 1e-9) return false;
      if (!sign) sign = Math.sign(c); else if (Math.sign(c) !== sign) return false;
    }
    return true;
  };
  const tryPoly = (poly, kind) => {
    const members = cells.map((cell, index) => (inside(poly, meanPoint(cell)) ? index : -1)).filter((index) => index >= 0);
    if (!members.length || members.length === cells.length) return;
    const sum = members.reduce((s, index) => s + areaOf(cells[index]), 0);
    const onOrIn = ([px, py]) => poly.every(([ax, ay], k) => { const [bx, by] = poly[(k + 1) % poly.length]; return (bx - ax) * (py - ay) - (by - ay) * (px - ax) >= -1e-9; });
    if (Math.abs(sum - areaOf(poly)) < 1e-6 && members.every((index) => cells[index].every(onOrIn))) found.push({ members, kind, poly });
  };
  for (let s = 0.5; s <= x1 - x0; s += 0.5) for (let x = x0; x + s <= x1 + 1e-9; x += 0.5) for (let y = y0; y + s <= y1 + 1e-9; y += 0.5) {
    tryPoly([[x, y], [x + s, y], [x + s, y + s], [x, y + s]], "upright");
  }
  for (let h = 0.5; h <= (x1 - x0) / 2; h += 0.5) for (let cx = x0; cx <= x1; cx += 0.5) for (let cy = y0; cy <= y1; cy += 0.5) {
    tryPoly([[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]], "tilted");
  }
  return found;
}

function partitionRightTriangleSquare(options = {}) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const problem = rightTriangleSquareOnce(options);
    if (problem) return problem;
  }
  return null;
}

function rightTriangleSquareOnce({ difficulty = 2 } = {}) {
  const pick = difficulty === 1 ? { form: "rightHalf", n: sample([2, 3]) } : difficulty === 2 ? sample([{ form: "rightQuarter", n: 2 }, { form: "rightHalf", n: 4 }]) : { form: "rightQuarter", n: 3 };
  const base = LATTICES[pick.form](pick.n);
  const cacheKey = `${pick.form}-${pick.n}`;
  if (!SQUARE_CACHE.has(cacheKey)) SQUARE_CACHE.set(cacheKey, squaresInLattice(base).filter((square) => square.members.length * 2 <= base.length));
  const squares = SQUARE_CACHE.get(cacheKey);
  if (!squares.length) return null;
  const square = sample(squares);
  const mirror = Math.random() < 0.5;
  const cells = placeCells(base, { turn: 0, mirror });
  const problem = incompleteProblem({
    form: pick.form,
    size: pick.n,
    cells,
    maxCells: 4,
    rounds: cells.length * 2,
    scale: 180 / pick.n,
    fixed: square.members,
    shadeFixedOnly: true,
    lead: `그림은 직각이등변삼각형 안에 ${square.kind === "tilted" ? "기울어진 " : ""}정사각형을 그린 것입니다.`
  });
  if (problem) problem.meta.square = square.kind;
  return problem;
}

function partitionHexagon({ difficulty = 2 } = {}) {
  const form = difficulty === 1 ? "hexEars" : difficulty === 2 ? sample(["hexEars", "hexHalves"]) : sample(["hexHalves", "hex"]);
  const base = form === "hex" ? LATTICES.hex(2) : LATTICES[form]();
  const cells = placeCells(base, { turn: sample([0, 60, 120, 180, 240, 300]), mirror: Math.random() < 0.5 });
  return incompleteProblem({ form, size: form === "hex" ? 2 : 1, cells, maxCells: form === "hex" ? 4 : 3, rounds: cells.length * 2, scale: form === "hex" ? 48 : 90 });
}

function partitionHexagram({ difficulty = 2 } = {}) {
  const cells = placeCells(LATTICES.hexagram(), { turn: sample([30, 90, 150, 210, 270, 330]), mirror: Math.random() < 0.5 });
  return incompleteProblem({ form: "hexagram", size: 1, cells, maxCells: difficulty === 1 ? 2 : 6, rounds: difficulty === 3 ? 30 : 20, scale: 52 });
}

// ───────────── 1단원 — 다 나눈 도형 여러 개를 차례로(연습·활동의 한 줄 분수) ─────────────
// 같은 도형을 조각 수가 늘어나는 차례로 그리고, 칸 몇 개를 색칠해 그림마다 분수로 쓰게 한다.

function rowFractionProblem({ figures, prompt, whole, family, extra = {} }) {
  const svgs = [];
  const answers = [];
  figures.forEach((figure, index) => {
    svgs.push(partitionSvg(figure.cells, { shaded: figure.shaded, scale: figure.scale, label: CIRCLED[index], maxWidth: 150 }));
    answers.push(`${CIRCLED[index]} ${figure.shaded.size}/${figure.cells.length}`);
  });
  return {
    prompt,
    visual: { kind: "fig", html: svgs.join("") },
    answer: answers.join(", "),
    responseKind: "list",
    solution: `그림마다 ${whole} 전체가 같은 조각 몇 개로 나뉘었는지(분모) 세고, 색칠한 조각을 셉니다(분자). ${figures.map((figure, index) => `${CIRCLED[index]}은 ${figure.cells.length}조각 중 ${figure.shaded.size}조각`).join(", ")}이므로 ${answers.join(", ")}입니다.`,
    meta: {
      family,
      ...extra,
      figures: figures.map((figure) => ({ template: figure.template, cells: figure.cells.map((cell) => cell.map(([x, y]) => [r6(x), r6(y)])), shaded: [...figure.shaded].sort((a, b) => a - b) }))
    }
  };
}

const randomShade = (count, parts) => new Set(shuffle(range(0, parts - 1)).slice(0, count));

function squareGridRow({ difficulty = 2 } = {}) {
  const sizes = difficulty === 1 ? [2, 3, 4] : difficulty === 2 ? [2, 3, 4, 5] : [3, 4, 5, 6];
  const figures = sizes.map((n) => {
    const parts = n * n;
    return { template: `grid${n}`, cells: LATTICES.grid(n), shaded: randomShade(randomInt(1, parts - 1), parts), scale: 108 / n };
  });
  return rowFractionProblem({ figures, whole: "정사각형", family: "b3s-row-fraction", extra: { shape: "square-grid" }, prompt: "정사각형을 모양과 크기가 같은 작은 정사각형으로 나누었습니다. 그림마다 색칠한 부분을 분수로 나타내세요." });
}

const SQUARE_SPLITS = {
  2: [() => LATTICES.halves("v"), () => LATTICES.halves("h"), () => LATTICES.sqHalf(1, randomInt(0, 1)).map((cell) => cell.map(([x, y]) => [x * 2, y * 2]))],
  4: [() => LATTICES.grid(2), () => LATTICES.sqQuarter(1).map((cell) => cell.map(([x, y]) => [x * 2, y * 2])), () => LATTICES.strips(4).map((cell) => cell.map(([x, y]) => [x / 2, y / 2]))],
  8: [() => LATTICES.sqHalf(2, randomInt(0, 1)), () => LATTICES.sqEighth().map((cell) => cell.map(([x, y]) => [x * 2, y * 2]))],
  16: [() => LATTICES.sqQuarter(2), () => LATTICES.grid(4).map((cell) => cell.map(([x, y]) => [x / 2, y / 2]))]
};

function squareSplitRow({ difficulty = 2 } = {}) {
  const counts = difficulty === 1 ? [2, 4, 8] : difficulty === 2 ? [2, 4, 8, 16] : [4, 8, 16, 16];
  const used = new Set();
  const figures = counts.map((parts) => {
    let index;
    do index = randomInt(0, SQUARE_SPLITS[parts].length - 1); while (used.has(`${parts}-${index}`) && used.size < 6);
    used.add(`${parts}-${index}`);
    const cells = placeCells(SQUARE_SPLITS[parts][index](), { turn: sample([0, 90]) });
    return { template: `square-${parts}-${index}`, cells, shaded: randomShade(randomInt(1, parts - 1), parts), scale: 54 };
  });
  return rowFractionProblem({ figures, whole: "정사각형", family: "b3s-row-fraction", extra: { shape: "square-split" }, prompt: "정사각형을 모양과 크기가 같은 조각으로 나누었습니다. 그림마다 색칠한 부분을 분수로 나타내세요." });
}

const TRIANGLE_SPLITS = { 3: () => LATTICES.triThirds(1), 4: () => LATTICES.tri(2), 6: () => LATTICES.triSixths(1), 9: () => LATTICES.tri(3), 12: () => LATTICES.triThirds(2), 24: () => LATTICES.triSixths(2) };

function triangleSplitRow({ difficulty = 2 } = {}) {
  const counts = difficulty === 1 ? [3, 4, 6] : difficulty === 2 ? sample([[3, 4, 6, 12], [3, 4, 6, 9]]) : sample([[4, 6, 12, 24], [3, 6, 9, 12]]);
  const figures = counts.map((parts) => {
    const cells = placeCells(TRIANGLE_SPLITS[parts](), { turn: sample(TRI_TURNS) });
    const xs = cells.flat().map(([x]) => x);
    return { template: `triangle-${parts}`, cells, shaded: randomShade(randomInt(1, parts - 1), parts), scale: 118 / (Math.max(...xs) - Math.min(...xs)) };
  });
  return rowFractionProblem({ figures, whole: "정삼각형", family: "b3s-row-fraction", extra: { shape: "triangle-split" }, prompt: "정삼각형을 모양과 크기가 같은 조각으로 나누었습니다. 그림마다 색칠한 부분을 분수로 나타내세요." });
}

const HEXAGON_SPLITS = { 3: () => LATTICES.hexRhombi(), 6: () => LATTICES.hex(1), 12: () => LATTICES.hexHalves(), 18: () => LATTICES.hexThirds(), 24: () => LATTICES.hex(2).map((cell) => cell.map(([x, y]) => [x / 2, y / 2])) };

function hexagonSplitRow({ difficulty = 2 } = {}) {
  const counts = difficulty === 1 ? [3, 6, 12] : difficulty === 2 ? [3, 6, 12, 24] : sample([[6, 12, 18, 24], [3, 12, 18, 24]]);
  const figures = counts.map((parts) => {
    const cells = placeCells(HEXAGON_SPLITS[parts](), { turn: sample([0, 60, 120]) });
    return { template: `hexagon-${parts}`, cells, shaded: randomShade(randomInt(1, parts - 1), parts), scale: 58 };
  });
  return rowFractionProblem({ figures, whole: "정육각형", family: "b3s-row-fraction", extra: { shape: "hexagon-split" }, prompt: "정육각형을 모양과 크기가 같은 조각으로 나누었습니다. 그림마다 색칠한 부분을 분수로 나타내세요." });
}

// 원 — 같은 크기 부채꼴(조각) 그림
function circleSvg(parts, shadedList, { label = "", radius = 52, start = 0 } = {}) {
  const pad = 4; const size = radius * 2 + pad * 2;
  const cx = size / 2; const cy = radius + pad;
  const point = (k) => { const angle = -Math.PI / 2 + ((k + start) * Math.PI * 2) / parts; return [fmt(cx + radius * Math.cos(angle)), fmt(cy + radius * Math.sin(angle))]; };
  const out = [];
  shadedList.forEach((k) => {
    const [x1, y1] = point(k); const [x2, y2] = point(k + 1);
    out.push(`<path d="M${cx} ${cy}L${x1} ${y1}A${radius} ${radius} 0 0 1 ${x2} ${y2}Z" fill="${SHADE}" stroke="${SHADE}" stroke-width="0.6"/>`);
  });
  range(0, parts - 1).forEach((k) => { const [x, y] = point(k); out.push(`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${INK}" stroke-width="1.2"/>`); });
  out.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  if (label) out.push(`<text x="${cx}" y="${size + 12}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${label}</text>`);
  return `<svg viewBox="0 0 ${size} ${size + (label ? 18 : 0)}" style="width:${size}px;max-width:100%;height:auto" role="img" aria-label="원을 ${parts}조각으로 나눈 그림">${out.join("")}</svg>`;
}

// 연습 8 꼴 — 조각 수가 2배·3배인 원에 같은 크기만큼 색칠(같은 크기의 분수)
function circleEquivalentRow({ difficulty = 2 } = {}) {
  const base = difficulty === 1 ? sample([2, 3, 4]) : sample([3, 4, 5, 6]);
  const factors = difficulty === 3 && base <= 4 ? [1, 3, 4] : difficulty === 1 ? [1, 2, 3] : sample([[1, 2, 3], [1, 2, 4]]);
  const usable = factors.filter((factor) => base * factor <= 24);
  if (usable.length < 3) return null;
  const top = randomInt(1, base - 1);
  const start = randomInt(0, base - 1);
  const circles = usable.map((factor) => ({ parts: base * factor, shaded: top * factor, start: start * factor }));
  const svgs = circles.map((circle, index) => circleSvg(circle.parts, range(0, circle.shaded - 1), { label: CIRCLED[index], start: circle.start }));
  const answers = circles.map((circle, index) => `${CIRCLED[index]} ${circle.shaded}/${circle.parts}`);
  return {
    prompt: "원을 모양과 크기가 같은 조각으로 나누었습니다. 그림마다 색칠한 부분을 분수로 나타내세요.",
    visual: { kind: "fig", html: svgs.join("") },
    answer: answers.join(", "),
    responseKind: "list",
    solution: `원마다 전체 조각 수와 색칠한 조각 수를 셉니다. ${circles.map((circle, index) => `${CIRCLED[index]}은 ${circle.parts}조각 중 ${circle.shaded}조각`).join(", ")}입니다. 조각이 ${usable.slice(1).map((factor) => `${factor}배`).join("·")}로 잘게 나뉘면 색칠한 조각 수도 같은 배만큼 늘어나 색칠한 크기는 모두 같습니다.`,
    meta: { family: "b3s-circle-row", mode: "equivalent", circles }
  };
}

// 연습 9 꼴 — 조각이 반씩 작아지는 원에 한 조각만 색칠
function circleHalvingRow({ difficulty = 2 } = {}) {
  const base = difficulty === 1 ? sample([2, 3, 4]) : difficulty === 2 ? sample([2, 3]) : sample([3, 4]);
  const count = difficulty === 1 ? 3 : 4;
  const circles = range(0, count - 1).map((k) => ({ parts: base * 2 ** k, shaded: 1, start: randomInt(0, base * 2 ** k - 1) }));
  const svgs = circles.map((circle, index) => circleSvg(circle.parts, [0], { label: CIRCLED[index], start: circle.start }));
  const answers = circles.map((circle, index) => `${CIRCLED[index]} 1/${circle.parts}`);
  return {
    prompt: "원을 모양과 크기가 같은 조각으로 나누었습니다. 그림마다 색칠한 부분을 분수로 나타내세요.",
    visual: { kind: "fig", html: svgs.join("") },
    answer: answers.join(", "),
    responseKind: "list",
    solution: `원마다 같은 조각이 몇 개인지 셉니다. ${circles.map((circle, index) => `${CIRCLED[index]}은 ${circle.parts}조각 중 1조각`).join(", ")}입니다. 조각 수가 두 배가 될 때마다 한 조각의 크기는 반이 됩니다.`,
    meta: { family: "b3s-circle-row", mode: "halving", circles }
  };
}

// ───────────── 1단원 — 칠교 ─────────────
// 4×4 칠교(가장 큰 직각이등변삼각형 2조각 + 나머지 5조각). 큰 삼각형 2조각을 놓아 두고 나머지 5조각으로 채우기(활동 1-1),
// 5조각으로 만든 정사각형에 큰 삼각형 2조각을 붙여 여러 사각형·삼각형 만들기(활동 1-3).
const TANGRAM_COLORS = { big1: "#f2a7cd", big2: "#f5c84a", small1: "#8dd36a", square: "#f4a261", medium: "#b9a6e0", small2: "#ef8f80", para: "#a8dcc0" };
const TANGRAM_PIECES = {
  big1: [[0, 0], [4, 0], [2, 2]],
  big2: [[0, 0], [2, 2], [0, 4]],
  small1: [[4, 0], [4, 2], [3, 1]],
  square: [[2, 2], [3, 1], [4, 2], [3, 3]],
  medium: [[4, 2], [4, 4], [2, 4]],
  small2: [[2, 2], [3, 3], [1, 3]],
  para: [[0, 4], [1, 3], [3, 3], [2, 4]]
};
const TANGRAM_NAMES = { small1: "작은 삼각형", small2: "작은 삼각형", square: "정사각형", medium: "중간 삼각형", para: "평행사변형" };
const squareSymmetry = (k, side) => ([x, y]) => {
  let p = [x, y];
  for (let t = 0; t < k % 4; t += 1) p = [side - p[1], p[0]];
  return k >= 4 ? [side - p[0], p[1]] : p;
};

function gridDots(width, height, cell, pad) {
  const out = [];
  for (let i = 0; i <= width; i += 1) out.push(`<line x1="${pad + i * cell}" y1="${pad}" x2="${pad + i * cell}" y2="${pad + height * cell}" stroke="#c9bfa9" stroke-width="0.8" stroke-dasharray="3 3"/>`);
  for (let j = 0; j <= height; j += 1) out.push(`<line x1="${pad}" y1="${pad + j * cell}" x2="${pad + width * cell}" y2="${pad + j * cell}" stroke="#c9bfa9" stroke-width="0.8" stroke-dasharray="3 3"/>`);
  return out.join("");
}
const polySvg = (poly, cell, pad, fill, extra = "") => `<polygon points="${poly.map(([x, y]) => `${fmt(pad + x * cell)},${fmt(pad + y * cell)}`).join(" ")}" fill="${fill}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"${extra}/>`;

function tangramFillAroundBig({ difficulty = 2 } = {}) {
  const symmetry = randomInt(0, 7);
  const map = squareSymmetry(symmetry, 4);
  const pieces = Object.fromEntries(Object.entries(TANGRAM_PIECES).map(([name, poly]) => [name, poly.map(map)]));
  const rest = ["small1", "square", "medium", "small2", "para"];
  const preset = difficulty === 1 ? [sample(rest)] : [];
  const shown = ["big1", "big2", ...preset];
  const cell = 36; const pad = 6;
  const board = `<svg viewBox="0 0 ${cell * 4 + pad * 2} ${cell * 4 + pad * 2}" style="width:${cell * 4 + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="큰 삼각형 두 조각을 놓은 정사각형 판">${gridDots(4, 4, cell, pad)}${shown.map((name) => polySvg(pieces[name], cell, pad, TANGRAM_COLORS[name])).join("")}<rect x="${pad}" y="${pad}" width="${cell * 4}" height="${cell * 4}" fill="none" stroke="${INK}" stroke-width="2"/></svg>`;
  const left = rest.filter((name) => !preset.includes(name));
  // 남은 조각 보관함 — 조각마다 돌린 모양(그대로 맞춰 넣지 못하게 방향을 섞는다)
  const kit = left.map((name) => {
    const turned = TANGRAM_PIECES[name].map(squareSymmetry(difficulty === 3 ? randomInt(0, 7) : randomInt(0, 3), 4));
    const xs = turned.map(([x]) => x); const ys = turned.map(([, y]) => y);
    const shifted = turned.map(([x, y]) => [x - Math.min(...xs), y - Math.min(...ys)]);
    const w = Math.max(...xs) - Math.min(...xs); const h = Math.max(...ys) - Math.min(...ys);
    const c = cell; // 판과 같은 크기 — 조각 크기를 그대로 견주게
    return `<svg viewBox="0 0 ${w * c + 8} ${h * c + 8}" style="width:${w * c + 8}px;max-width:100%;height:auto" role="img" aria-label="${TANGRAM_NAMES[name]} 조각">${polySvg(shifted, c, 4, TANGRAM_COLORS[name])}</svg>`;
  });
  const full = `<svg viewBox="0 0 ${cell * 4 + pad * 2} ${cell * 4 + pad * 2}" style="width:${cell * 4 + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="칠교 일곱 조각으로 채운 정사각형">${gridDots(4, 4, cell, pad)}${Object.keys(pieces).map((name) => polySvg(pieces[name], cell, pad, TANGRAM_COLORS[name])).join("")}</svg>`;
  return {
    prompt: `칠교 조각 가운데 가장 큰 삼각형 2조각${preset.length ? `과 ${TANGRAM_NAMES[preset[0]]} 1조각` : ""}을 정사각형 판 위에 놓았습니다. 오른쪽의 남은 ${left.length}조각을 돌리거나 뒤집어 빈 곳을 빈틈없이 채우고, 조각 사이의 선을 그으세요.`,
    visual: { kind: "fig", html: `${board}${kit.join("")}` },
    answerVisual: { kind: "fig", html: full },
    answer: "그림과 같이 남은 조각으로 빈 곳을 채움",
    responseKind: "drawing",
    solution: `빈 곳의 넓이는 판 넓이의 반이고, 남은 조각(작은 삼각형 2, 중간 삼각형·정사각형·평행사변형 각 1)의 넓이를 모두 더한 것과 같습니다. 직각인 모서리에는 삼각형의 직각을, 기운 선에는 조각의 긴 변을 맞추며 넣으면 빈틈이 없습니다.`,
    meta: { family: "b3s-tangram-fill", symmetry, preset, pieces }
  };
}

// 5조각 정사각형(한 변 2칸)의 안쪽 선 — 중간 삼각형·정사각형·작은 삼각형 2·평행사변형
const FIVE_SQUARE = [[[0, 2], [2, 2], [1, 1]], [[1, 0], [2, 0], [2, 1], [1, 1]], [[1, 1], [2, 1], [2, 2]], [[0, 0], [1, 0], [0, 1]], [[0, 1], [1, 0], [1, 1], [0, 2]]];
const SQUARE_PLUS_TWO = {
  "직사각형": { outline: [[0, 0], [4, 0], [4, 2], [0, 2]], square: [0, 0], tris: [[[2, 0], [4, 0], [2, 2]], [[4, 0], [4, 2], [2, 2]]] },
  "평행사변형": { outline: [[2, 0], [6, 0], [4, 2], [0, 2]], square: [2, 0], tris: [[[0, 2], [2, 0], [2, 2]], [[4, 0], [6, 0], [4, 2]]] },
  "사다리꼴": { outline: [[2, 0], [4, 0], [6, 2], [0, 2]], square: [2, 0], tris: [[[0, 2], [2, 0], [2, 2]], [[4, 0], [6, 2], [4, 2]]] },
  "직각삼각형": { outline: [[0, 0], [4, 4], [0, 4]], square: [0, 2], tris: [[[0, 0], [2, 2], [0, 2]], [[2, 2], [4, 4], [2, 4]]] }
};

function tangramSquarePlusTwo({ difficulty = 2 } = {}) {
  const count = difficulty;
  const names = shuffle(Object.keys(SQUARE_PLUS_TWO)).slice(0, count);
  const cell = 26; const pad = 6;
  const kit = (() => {
    const sq = FIVE_SQUARE.map((poly, index) => polySvg(poly, cell, pad, Object.values(TANGRAM_COLORS)[2 + index])).join("");
    const t1 = polySvg([[3, 0], [5, 0], [3, 2]], cell, pad, TANGRAM_COLORS.big1);
    const t2 = polySvg([[6, 0], [8, 0], [6, 2]], cell, pad, TANGRAM_COLORS.big2);
    return `<svg viewBox="0 0 ${cell * 8 + pad * 2} ${cell * 2 + pad * 2}" style="width:${cell * 8 + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="5조각으로 만든 정사각형과 큰 삼각형 두 조각">${sq}${t1}${t2}</svg>`;
  })();
  const shapes = names.map((name, index) => {
    const spec = SQUARE_PLUS_TWO[name];
    const flipX = Math.random() < 0.5; const flipY = name !== "직사각형" && Math.random() < 0.5;
    const xs = spec.outline.map(([x]) => x); const ys = spec.outline.map(([, y]) => y);
    const w = Math.max(...xs); const h = Math.max(...ys);
    const map = ([x, y]) => [flipX ? w - x : x, flipY ? h - y : y];
    const outline = spec.outline.map(map);
    const [sx, sy] = spec.square;
    const squarePoly = [[sx, sy], [sx + 2, sy], [sx + 2, sy + 2], [sx, sy + 2]].map(map);
    const tris = spec.tris.map((tri) => tri.map(map));
    const view = `0 0 ${w * cell + pad * 2} ${h * cell + pad * 2 + 18}`;
    const label = `<text x="${(w * cell) / 2 + pad}" y="${h * cell + pad * 2 + 14}" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${CIRCLED[index]} ${name}</text>`;
    const question = `<svg viewBox="${view}" style="width:${w * cell + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="${name} 바깥선">${gridDots(w, h, cell, pad)}${polySvg(outline, cell, pad, "none", ' stroke-width="2"')}${label}</svg>`;
    const answer = `<svg viewBox="${view}" style="width:${w * cell + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="${name}을 채운 답">${gridDots(w, h, cell, pad)}${polySvg(squarePoly, cell, pad, TANGRAM_COLORS.square)}${tris.map((tri, k) => polySvg(tri, cell, pad, k ? TANGRAM_COLORS.big2 : TANGRAM_COLORS.big1)).join("")}${label}</svg>`;
    return { name, question, answer, outline, squarePoly, tris };
  });
  return {
    prompt: `칠교 7조각을 모두 써서 사각형·삼각형을 만들려고 합니다. 작은 5조각으로 만든 정사각형에 가장 큰 삼각형 2조각을 붙여 ${names.map((name, index) => `${CIRCLED[index]} ${name}`).join(", ")}${count > 1 ? "을 차례로" : "을"} 만들고, 조각을 놓은 자리에 선을 그으세요.`,
    visual: { kind: "fig", html: `${kit}${shapes.map((shape) => shape.question).join("")}` },
    answerVisual: { kind: "fig", html: shapes.map((shape) => shape.answer).join("") },
    answer: `${names.join(", ")} — 정사각형 1개와 큰 삼각형 2개로 채움`,
    responseKind: "drawing",
    solution: `5조각 정사각형의 한 변과 큰 삼각형의 짧은 변은 길이가 같습니다(모눈 2칸). 그래서 ${shapes.map((shape) => (shape.name === "직사각형" ? "직사각형은 정사각형 옆에 두 삼각형을 맞대 붙인 정사각형을" : shape.name === "평행사변형" ? "평행사변형은 정사각형 양쪽에 삼각형을 하나씩 같은 방향으로" : shape.name === "사다리꼴" ? "사다리꼴은 정사각형 양쪽에 삼각형을 하나씩 서로 마주 보게" : "직각삼각형은 정사각형의 두 변에 삼각형을 하나씩")).join(", ")} 붙여 만듭니다. 넓이는 모두 모눈 8칸입니다.`,
    meta: { family: "b3s-tangram-shapes", names, shapes: shapes.map(({ name, outline, squarePoly, tris }) => ({ name, outline, squarePoly, tris })) }
  };
}

// ───────────── 1단원 연습 2 — 모눈 위 삼각형(밑변·높이) ─────────────
function gridTriangleAreas({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const tris = range(0, 2).map(() => {
      const base = difficulty === 1 ? sample([2, 4, 6]) : randomInt(2, difficulty === 3 ? 7 : 6);
      // 너무 납작한 삼각형은 그림에서 읽기 어려워 밑변은 높이의 세 배까지만
      const height = randomInt(Math.max(1, Math.ceil(base / 3)), Math.max(Math.ceil(base / 3), difficulty === 1 ? 3 : 4));
      const apex = randomInt(0, base);
      return { base, height, apex };
    });
    // 기울기가 모두 반 바퀴의 반(45°)인 삼각형만 있으면 칸 세기로 끝나므로 다시
    if (tris.every(({ base, height, apex }) => apex === height && base - apex === height)) continue;
    if (tris.filter(({ base, height, apex }) => (apex === 0 || apex === base || Math.abs(apex - height) > 0 || Math.abs(base - apex - height) > 0)).length < 2) continue;
    if (new Set(tris.map(({ base, height, apex }) => `${base},${height},${apex}`)).size < 3) continue;
    const top = Math.max(...tris.map(({ height }) => height)) + 1;
    const cell = 22; const pad = 6;
    let x = 1;
    const placed = tris.map((tri) => {
      const points = [[x, top], [x + tri.base, top], [x + tri.apex, top - tri.height]];
      x += tri.base + 1;
      return { ...tri, points };
    });
    const width = x;
    const height = top + 1;
    const body = placed.map((tri, index) => {
      const cx = tri.points[0][0] + tri.base / 2;
      return `${polySvg(tri.points, cell, pad, SHADE)}<text x="${fmt(pad + cx * cell)}" y="${fmt(pad + (top + 0.8) * cell)}" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${CIRCLED[index]}</text>`;
    }).join("");
    const grid = [];
    for (let i = 0; i <= width; i += 1) grid.push(`<line x1="${pad + i * cell}" y1="${pad}" x2="${pad + i * cell}" y2="${pad + height * cell}" stroke="#cfc6b3" stroke-width="0.9"/>`);
    for (let j = 0; j <= height; j += 1) grid.push(`<line x1="${pad}" y1="${pad + j * cell}" x2="${pad + width * cell}" y2="${pad + j * cell}" stroke="#cfc6b3" stroke-width="0.9"/>`);
    const svg = `<svg viewBox="0 0 ${width * cell + pad * 2} ${height * cell + pad * 2}" style="width:${width * cell + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="모눈 위의 삼각형 세 개">${grid.join("")}${body}</svg>`;
    const areaText = (tri) => { const twice = tri.base * tri.height; return twice % 2 ? mixed(Math.floor(twice / 2), 1, 2) : String(twice / 2); };
    return {
      prompt: "모눈 한 칸의 넓이를 1이라고 할 때, 색칠한 삼각형 ㉠, ㉡, ㉢의 넓이를 각각 구하세요.",
      visual: { kind: "fig", html: svg },
      answer: placed.map((tri, index) => `${CIRCLED[index]} ${areaText(tri)}`).join(", "),
      responseKind: "list",
      solution: `삼각형을 꼭 감싸는 직사각형(밑변 × 높이)을 그리면, 꼭짓점에서 내린 세로선 양쪽이 각각 반씩 색칠되어 삼각형은 직사각형의 반입니다. ${placed.map((tri, index) => `${CIRCLED[index]}: ${tri.base} × ${tri.height}의 반 = ${areaText(tri)}`).join(", ")}입니다.`,
      meta: { family: "b3s-grid-triangle", tris: placed }
    };
  }
  return null;
}

// ───────────── 2단원 — 한 칸 폭 띠를 반의 반 바퀴로 꺾어 접기 ─────────────
// 띠의 가운데 선 길이 = 띠의 길이. 그림으로 보면 곧은 부분의 칸 수 + 접힌 모서리마다 한 칸(삼각형 하나가 한 칸).
const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function foldedTapeFigure(arms, turns) {
  // arms: 곧은 칸 수(첫 팔, 가운데…, 마지막 팔), turns: 접는 쪽(+1 왼쪽, −1 오른쪽)
  let dir = randomInt(0, 3);
  let pos = [0, 0];
  const pieces = [];
  arms.forEach((length, index) => {
    const [dx, dy] = DIRS[dir];
    const cells = [];
    for (let k = 0; k < length; k += 1) { cells.push(pos); pos = [pos[0] + dx, pos[1] + dy]; }
    pieces.push({ kind: "arm", cells, face: index % 2 });
    if (index < turns.length) {
      const nextDir = (dir + (turns[index] > 0 ? 3 : 1)) % 4;
      pieces.push({ kind: "corner", cell: pos, inDir: dir, outDir: nextDir, face: (index + 1) % 2 });
      const [ndx, ndy] = DIRS[nextDir];
      pos = [pos[0] + ndx, pos[1] + ndy];
      dir = nextDir;
    }
  });
  const all = pieces.flatMap((piece) => (piece.kind === "arm" ? piece.cells : [piece.cell]));
  if (new Set(all.map((cell) => cell.join(","))).size !== all.length) return null;
  const minX = Math.min(...all.map(([x]) => x)); const minY = Math.min(...all.map(([, y]) => y));
  pieces.forEach((piece) => {
    if (piece.kind === "arm") piece.cells = piece.cells.map(([x, y]) => [x - minX + 1, y - minY + 1]);
    else piece.cell = [piece.cell[0] - minX + 1, piece.cell[1] - minY + 1];
  });
  const width = Math.max(...all.map(([x]) => x)) - minX + 3;
  const height = Math.max(...all.map(([, y]) => y)) - minY + 3;
  return { pieces, width, height };
}

function foldedTapeSvg(figure, label) {
  const cell = 22; const pad = 4;
  const colors = ["#e9b949", "#fbe8b0"];
  const grid = [];
  for (let i = 0; i <= figure.width; i += 1) grid.push(`<line x1="${pad + i * cell}" y1="${pad}" x2="${pad + i * cell}" y2="${pad + figure.height * cell}" stroke="#cfc6b3" stroke-width="0.9"/>`);
  for (let j = 0; j <= figure.height; j += 1) grid.push(`<line x1="${pad}" y1="${pad + j * cell}" x2="${pad + figure.width * cell}" y2="${pad + j * cell}" stroke="#cfc6b3" stroke-width="0.9"/>`);
  const shapes = figure.pieces.map((piece) => {
    if (piece.kind === "arm") {
      if (!piece.cells.length) return "";
      const xs = piece.cells.map(([x]) => x); const ys = piece.cells.map(([, y]) => y);
      const x0 = Math.min(...xs); const y0 = Math.min(...ys);
      return `<rect x="${pad + x0 * cell}" y="${pad + y0 * cell}" width="${(Math.max(...xs) - x0 + 1) * cell}" height="${(Math.max(...ys) - y0 + 1) * cell}" fill="${colors[piece.face]}" stroke="${INK}" stroke-width="1.5"/>`;
    }
    // 모서리 칸: 바깥 모서리(들어온 쪽으로 더 가고, 나가는 쪽의 반대)를 잘라 낸 삼각형
    const [cx, cy] = piece.cell;
    const [ix, iy] = DIRS[piece.inDir]; const [ox, oy] = DIRS[piece.outDir];
    const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const outer = [0.5 + (ix - ox) / 2, 0.5 + (iy - oy) / 2];
    const kept = corners.filter(([x, y]) => !(x === outer[0] && y === outer[1]));
    return `<polygon points="${kept.map(([x, y]) => `${pad + (cx + x) * cell},${pad + (cy + y) * cell}`).join(" ")}" fill="${colors[piece.face]}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  });
  const w = figure.width * cell + pad * 2; const h = figure.height * cell + pad * 2;
  return `<svg viewBox="0 0 ${w} ${h + 18}" style="width:${w}px;max-width:100%;height:auto" role="img" aria-label="모눈 위에 접어 놓은 띠">${grid.join("")}${shapes.join("")}<text x="${w / 2}" y="${h + 14}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${label}</text></svg>`;
}

function foldedTapeProblem(folds, { difficulty = 2 } = {}) {
  const maxArm = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 7;
  const figures = [];
  for (let attempt = 0; attempt < 60 && figures.length < 2; attempt += 1) {
    const arms = range(0, folds).map(() => randomInt(1, maxArm));
    const turns = range(1, folds).map(() => (Math.random() < 0.5 ? 1 : -1));
    const figure = foldedTapeFigure(arms, turns);
    if (!figure || figure.width > 11 || figure.height > 9) continue;
    const length = arms.reduce((sum, value) => sum + value, 0) + folds;
    if (figures.some((other) => other.length === length && JSON.stringify(other.arms) === JSON.stringify(arms))) continue;
    figures.push({ figure, arms, turns, length });
  }
  if (figures.length < 2) return null;
  const svgs = figures.map((item, index) => foldedTapeSvg(item.figure, CIRCLED[index]));
  return {
    prompt: `한 칸의 길이가 1cm인 모눈 위에 폭이 한 칸인 띠를 ${folds === 1 ? "한 번" : "두 번"} 접어 놓았습니다. 띠 ㉠, ㉡을 펼쳤을 때의 길이는 각각 몇 cm인지 구하세요.`,
    visual: { kind: "fig", html: svgs.join("") },
    answer: figures.map((item, index) => `${CIRCLED[index]} ${item.length}cm`).join(", "),
    responseKind: "list",
    solution: `접힌 모서리의 삼각형은 띠 한 칸이 반으로 겹쳐 접힌 자리라 한 칸으로 셉니다. ${figures.map((item, index) => `${CIRCLED[index]}은 곧은 부분 ${item.arms.join(" + ")}칸에 접힌 곳 ${folds}칸을 더해 ${item.length}cm`).join(", ")}입니다.`,
    meta: { family: "b3s-folded-tape", folds, figures: figures.map(({ figure, arms, turns, length }) => ({ arms, turns, length, pieces: figure.pieces })) }
  };
}

// ───────────── 2단원 — 성냥개비로 잰 길이(점선 맞춤) ─────────────
// 위 줄: 긴 것 1개 + 성냥 a개, 아래 줄: 성냥 b개 + 같은 것 k개. 끝이 맞는 자리에 세로 점선이 있다.
// 성냥 한 개의 길이는 쓰지 않는다 — 마지막 물건 하나가 성냥 몇 개와 끝이 맞는지 그림에서 읽는다.
function matchRowsLayout({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const q = randomInt(2, difficulty === 3 ? 5 : 4);
    const k = difficulty === 3 ? sample([2, 3]) : 2;
    const a = randomInt(q, q + 3);
    const b = randomInt(1, 4);
    const r = b + k * q - a;
    if (r < 2 || r === q || r + a > 13) continue;
    const match = randomInt(2, difficulty === 1 ? 4 : 6);
    return { q, k, a, b, r, match };
  }
  return null;
}

function matchRowsSvg({ q, k, a, b, r }, { bigLabel, smallLabel, unit = 24, rods = false }) {
  const pad = 14; const rowH = 22; const top = 46;
  const total = r + a;
  const X = (u) => fmt(pad + u * unit);
  const W = total * unit + pad * 2;
  const y1 = top; const y2 = top + rowH + 16;
  const matchSvg = (u, y) => `<line x1="${X(u) + 2}" y1="${y + rowH / 2}" x2="${fmt(X(u + 1) - 4)}" y2="${y + rowH / 2}" stroke="#c99a5b" stroke-width="3.2" stroke-linecap="round"/><circle cx="${fmt(X(u + 1) - 4)}" cy="${y + rowH / 2}" r="3.4" fill="#c0392b"/>`;
  const parts = [];
  parts.push(`<rect x="${X(0)}" y="${y1}" width="${r * unit}" height="${rowH}" rx="${rods ? 2 : 9}" fill="${rods ? "#f6efdc" : "#ead2a8"}" stroke="${INK}" stroke-width="1.5"/><text x="${fmt(pad + (r * unit) / 2)}" y="${y1 + 15}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${bigLabel}</text>`);
  range(r, total - 1).forEach((u) => parts.push(matchSvg(u, y1)));
  range(0, b - 1).forEach((u) => parts.push(matchSvg(u, y2)));
  range(0, k - 1).forEach((j) => {
    const x0 = b + j * q;
    parts.push(rods
      ? `<rect x="${X(x0)}" y="${y2}" width="${q * unit}" height="${rowH}" rx="2" fill="#f6efdc" stroke="${INK}" stroke-width="1.5"/><text x="${fmt(pad + (x0 + q / 2) * unit)}" y="${y2 + 15}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${smallLabel}</text>`
      : `<polygon points="${X(x0)},${y2 + 4} ${fmt(X(x0 + q) - 9)},${y2 + 4} ${X(x0 + q)},${y2 + rowH / 2} ${fmt(X(x0 + q) - 9)},${y2 + rowH - 4} ${X(x0)},${y2 + rowH - 4}" fill="#9fc79a" stroke="${INK}" stroke-width="1.3"/><text x="${fmt(pad + (x0 + q / 2) * unit)}" y="${y2 + 15}" text-anchor="middle" font-size="11" font-weight="700" fill="${INK}">${smallLabel}</text>`);
  });
  // 끝이 맞는 자리 점선: 위 줄의 긴 것 시작·끝, 아래 줄 물건 경계 가운데 위 줄 성냥 자리에 오는 것
  const marks = new Set([0, r, total]);
  range(0, k).forEach((j) => { const u = b + j * q; if (u >= r) marks.add(u); });
  [...marks].forEach((u) => parts.push(`<line x1="${X(u)}" y1="${y1 - 8}" x2="${X(u)}" y2="${y2 + rowH + 8}" stroke="${LINE}" stroke-width="1" stroke-dasharray="3 3"/>`));
  const last = b + (k - 1) * q;
  return { parts, W, H: y2 + rowH + 40, last, X, y1, y2, rowH };
}

function matchLengthPicture(layout, { bigName, smallName, givenSide, givenValue, rods }) {
  const { parts, W, H, last, X, y1, y2, rowH } = matchRowsSvg(layout, { bigLabel: bigName, smallLabel: smallName, rods });
  const r = layout.r; const q = layout.q;
  if (givenSide === "big") {
    parts.push(dimArc(Number(X(0)), y1, Number(X(r)), y1, -12, `${givenValue}cm`));
    parts.push(dimArc(Number(X(last)), y2 + rowH, Number(X(last + q)), y2 + rowH, 12, "", { blank: true }));
  } else {
    parts.push(dimArc(Number(X(0)), y1, Number(X(r)), y1, -12, "", { blank: true }));
    parts.push(dimArc(Number(X(last)), y2 + rowH, Number(X(last + q)), y2 + rowH, 12, `${givenValue}cm`));
  }
  return `<svg viewBox="0 0 ${W} ${H}" style="width:${W}px;max-width:100%;height:auto" role="img" aria-label="두 줄로 늘어놓은 ${bigName}·${smallName}과 성냥개비">${parts.join("")}</svg>`;
}

function logMatchPencil({ difficulty = 2 } = {}) {
  const layout = matchRowsLayout({ difficulty });
  if (!layout) return null;
  const { q, k, a, b, r, match } = layout;
  const log = r * match; const pencil = q * match;
  const givenSide = difficulty === 1 ? "big" : sample(["big", "small"]);
  const givenValue = givenSide === "big" ? log : pencil;
  const answer = givenSide === "big" ? pencil : log;
  const html = matchLengthPicture(layout, { bigName: "통나무", smallName: "연필", givenSide, givenValue, rods: false });
  return {
    prompt: `통나무 1개와 성냥개비 ${a}개를 이은 길이는 성냥개비 ${b}개와 연필 ${k}자루를 이은 길이와 같습니다. ${givenSide === "big" ? `통나무 1개의 길이가 ${givenValue}cm일 때, 연필 1자루` : `연필 1자루의 길이가 ${givenValue}cm일 때, 통나무 1개`}의 길이를 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${answer}cm`,
    solution: `점선을 보면 마지막 연필 1자루는 위 줄의 성냥개비 ${q}개와 끝이 맞습니다. 아래 줄은 성냥개비 ${b} + ${q} × ${k} = ${b + q * k}개 길이이고, 위 줄은 통나무에 성냥개비 ${a}개를 이었으므로 통나무는 성냥개비 ${b + q * k} − ${a} = ${r}개 길이입니다. ${givenSide === "big" ? `성냥개비 1개는 ${log} ÷ ${r} = ${match}cm이고 연필은 ${match} × ${q} = ${pencil}cm` : `성냥개비 1개는 ${pencil} ÷ ${q} = ${match}cm이고 통나무는 ${match} × ${r} = ${log}cm`}입니다.`,
    meta: { family: "b3s-match-rows", ...layout, givenSide, givenValue, answer, rods: false }
  };
}

function rodMatchGuides({ difficulty = 2 } = {}) {
  const layout = matchRowsLayout({ difficulty });
  if (!layout) return null;
  const { q, k, a, b, r, match } = layout;
  const big = r * match; const small = q * match;
  const givenSide = difficulty === 1 ? "big" : sample(["big", "small"]);
  const givenValue = givenSide === "big" ? big : small;
  const answer = givenSide === "big" ? small : big;
  const html = matchLengthPicture(layout, { bigName: "㉠", smallName: "㉡", givenSide, givenValue, rods: true });
  return {
    prompt: `그림과 같이 위 줄에는 막대 ㉠과 성냥개비를, 아래 줄에는 성냥개비와 막대 ㉡을 늘어놓았더니 두 줄의 길이가 같습니다. 막대 ${givenSide === "big" ? "㉠" : "㉡"}의 길이가 ${givenValue}cm일 때, 막대 ${givenSide === "big" ? "㉡" : "㉠"}의 길이를 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${answer}cm`,
    solution: `두 줄에서 같은 수의 성냥개비를 지우고 생각합니다. 점선을 보면 마지막 막대 ㉡은 위 줄의 성냥개비 ${q}개와 끝이 맞습니다. 위 줄은 ㉠ + 성냥개비 ${a}개, 아래 줄은 성냥개비 ${b}개 + ㉡ ${k}개(성냥개비 ${q * k}개)이므로 ㉠은 성냥개비 ${b + q * k} − ${a} = ${r}개 길이입니다. ${givenSide === "big" ? `성냥개비 1개는 ${big} ÷ ${r} = ${match}cm, ㉡은 ${match} × ${q} = ${small}cm` : `성냥개비 1개는 ${small} ÷ ${q} = ${match}cm, ㉠은 ${match} × ${r} = ${big}cm`}입니다.`,
    meta: { family: "b3s-match-rows", ...layout, givenSide, givenValue, answer, rods: true }
  };
}

// ───────────── 2단원 — 수직선 위 점 사이의 거리(겹친 구간으로 구간 찾기) ─────────────
// 구간 [i, j]: i번째 점부터 j번째 점까지. 아는 구간끼리 「이어 붙이기·같은 끝에서 빼기」만으로 알아내는지 따라간다.
const POINT_NAMES = ["A", "B", "C", "D", "E", "F"];
const spanName = ([i, j]) => `${POINT_NAMES[i]}${POINT_NAMES[j]}`;

function deriveSpans(given) {
  const known = new Map(given.map(([i, j]) => [`${i},${j}`, [i, j]]));
  let grew = true;
  while (grew) {
    grew = false;
    const list = [...known.values()];
    for (const [a, b] of list) for (const [c, d] of list) {
      const add = (i, j) => { if (i < j && !known.has(`${i},${j}`)) { known.set(`${i},${j}`, [i, j]); grew = true; } };
      if (b === c) add(a, d);
      if (a === c && b !== d) add(Math.min(b, d), Math.max(b, d));
      if (b === d && a !== c) add(Math.min(a, c), Math.max(a, c));
    }
  }
  return known;
}

function numberLineSvg(gaps, spans, { blanks = [] } = {}) {
  const total = gaps.reduce((s, v) => s + v, 0);
  const width = 420; const pad = 24;
  const xs = [pad];
  gaps.forEach((gap) => xs.push(xs[xs.length - 1] + (gap / total) * width));
  const axisY = 96;
  const parts = [`<line x1="${pad - 12}" y1="${axisY}" x2="${fmt(xs[xs.length - 1] + 12)}" y2="${axisY}" stroke="${INK}" stroke-width="1.6"/>`];
  xs.forEach((x, index) => parts.push(`<circle cx="${fmt(x)}" cy="${axisY}" r="3.6" fill="${INK}"/><text x="${fmt(x)}" y="${axisY - 9}" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${POINT_NAMES[index]}</text>`));
  // 위·아래 줄(겹치면 다음 줄)
  const lanes = { up: [], down: [] };
  const overlap = ([a, b], [c, d]) => Math.max(a, c) < Math.min(b, d);
  spans.forEach((span, index) => {
    const side = span.side;
    let lane = 0;
    while ((lanes[side][lane] || []).some((other) => overlap(other, span.range))) lane += 1;
    (lanes[side][lane] = lanes[side][lane] || []).push(span.range);
    const [i, j] = span.range;
    const bend = (side === "up" ? -1 : 1) * (16 + lane * 17);
    const y = side === "up" ? axisY - 16 : axisY;
    parts.push(dimArc(xs[i], y, xs[j], y, bend, span.label, span.blank ? { blank: true } : { halo: true }));
    if (span.blank) blanks.push(index);
  });
  return `<svg viewBox="0 0 ${width + pad * 2} 190" style="width:${width + pad * 2}px;max-width:100%;height:auto" role="img" aria-label="수직선 위 점 사이의 거리">${parts.join("")}</svg>`;
}

const GAP_COMBOS = [
  { given: [[0, 2], [1, 3], [1, 2]], ask: [[0, 1], [2, 3], [0, 3]] },
  { given: [[0, 3], [0, 1], [2, 3]], ask: [[1, 2], [0, 2], [1, 3]] },
  { given: [[0, 2], [2, 3], [1, 3]], ask: [[0, 1], [1, 2], [0, 3]] }
];

function segmentChainInnerGiven({ difficulty = 2 } = {}) {
  const combo = difficulty === 3 ? sample(GAP_COMBOS) : GAP_COMBOS[0];
  const low = difficulty === 1 ? 3 : 5; const high = difficulty === 1 ? 12 : difficulty === 2 ? 20 : 30;
  const gaps = range(0, 2).map(() => randomInt(low, high));
  const length = ([i, j]) => gaps.slice(i, j).reduce((s, v) => s + v, 0);
  const sides = ["up", "up", "down"];
  const spans = combo.given.map((range, index) => ({ range, label: `${length(range)}cm`, side: combo === GAP_COMBOS[1] && index === 0 ? "down" : sides[index] }));
  const html = numberLineSvg(gaps, spans);
  const answer = combo.ask.map((span) => `${spanName(span)}=${length(span)}cm`).join(", ");
  const steps = [];
  if (combo === GAP_COMBOS[0]) steps.push(`AC에서 BC를 빼면 AB = ${length([0, 2])} − ${length([1, 2])} = ${gaps[0]}cm, BD에서 BC를 빼면 CD = ${length([1, 3])} − ${length([1, 2])} = ${gaps[2]}cm입니다. AD = AB + BD = ${gaps[0]} + ${length([1, 3])} = ${length([0, 3])}cm입니다.`);
  else if (combo === GAP_COMBOS[1]) steps.push(`AD에서 AB와 CD를 빼면 BC = ${length([0, 3])} − ${gaps[0]} − ${gaps[2]} = ${gaps[1]}cm입니다. AC = AB + BC = ${length([0, 2])}cm, BD = BC + CD = ${length([1, 3])}cm입니다.`);
  else steps.push(`BD에서 CD를 빼면 BC = ${length([1, 3])} − ${gaps[2]} = ${gaps[1]}cm, AC에서 BC를 빼면 AB = ${length([0, 2])} − ${gaps[1]} = ${gaps[0]}cm입니다. AD = AC + CD = ${length([0, 3])}cm입니다.`);
  return {
    prompt: `수직선 위 네 점 A, B, C, D 사이의 거리를 그림에 나타냈습니다. ${combo.ask.map((span) => `${span.map((index) => POINT_NAMES[index]).join("와 ")}`).join(", ")} 사이의 거리를 각각 구하세요.`,
    visual: { kind: "fig", html },
    answer,
    responseKind: "list",
    solution: steps.join(" "),
    meta: { family: "b3s-point-spans", gaps, given: combo.given, ask: combo.ask, values: combo.ask.map(length) }
  };
}

function sixPointsThreeGaps({ difficulty = 2 } = {}) {
  const pool = [];
  for (let i = 0; i < 6; i += 1) for (let j = i + 1; j < 6; j += 1) if (j - i >= 2 && j - i <= 4) pool.push([i, j]);
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const given = shuffle(pool).slice(0, 5);
    if (difficulty === 1 && Math.random() < 0.7) given[randomInt(0, 4)] = sample([[1, 2], [2, 3], [3, 4]]);
    const keys = new Set(given.map(([i, j]) => `${i},${j}`));
    if (keys.size < 5) continue;
    const known = deriveSpans(given);
    if (!range(0, 4).every((k) => known.has(`${k},${k + 1}`))) continue;
    // 하나라도 빼면 못 푸는(꼭 필요한 것만 준) 묶음
    if (given.some((_, index) => { const rest = given.filter((__, other) => other !== index); const k2 = deriveSpans(rest); return range(0, 4).every((k) => k2.has(`${k},${k + 1}`)); })) continue;
    const askable = range(0, 4).filter((k) => !keys.has(`${k},${k + 1}`));
    if (askable.length < 3) continue;
    const ask = shuffle(askable).slice(0, 3).sort((a, b) => a - b).map((k) => [k, k + 1]);
    const gaps = range(0, 4).map(() => randomInt(difficulty === 1 ? 6 : 8, difficulty === 3 ? 34 : 24));
    const length = ([i, j]) => gaps.slice(i, j).reduce((s, v) => s + v, 0);
    const spans = given.map((range, index) => ({ range, label: `${length(range)}cm`, side: index % 2 ? "down" : "up" }));
    const html = numberLineSvg(gaps, spans);
    return {
      prompt: `수직선 위 여섯 점 A, B, C, D, E, F 사이의 거리를 그림에 나타냈습니다. ${ask.map((span) => `두 점 ${POINT_NAMES[span[0]]}와 ${POINT_NAMES[span[1]]}`).join(", ")} 사이의 거리를 각각 구하세요.`,
      visual: { kind: "fig", html },
      answer: ask.map((span) => `${spanName(span)}=${length(span)}cm`).join(", "),
      responseKind: "list",
      solution: `한 끝이 같은 두 거리의 차는 나머지 구간의 거리이고, 이어진 두 거리의 합은 긴 구간의 거리입니다. 주어진 ${given.map((span) => `${spanName(span)} ${length(span)}cm`).join(", ")}에서 이렇게 차례로 구하면 AB = ${gaps[0]}, BC = ${gaps[1]}, CD = ${gaps[2]}, DE = ${gaps[3]}, EF = ${gaps[4]}(cm)입니다.`,
      meta: { family: "b3s-point-spans", gaps, given, ask, values: ask.map(length) }
    };
  }
  return null;
}

// ───────────── 3단원 도전 4 — 모양 관계식 + 같은 두 자리 수 여러 번 더하기 ─────────────
const RELATIONS = { double: { times: 2, text: (a, b) => `${a} + ${a} = ${b}` }, triple: { times: 3, text: (a, b) => `${a} + ${a} + ${a} = ${b}` } };
const relationCache = new Map();
function relationFamily(relation, pattern, count) {
  const key = `${relation}|${pattern}|${count}`;
  if (relationCache.has(key)) return relationCache.get(key);
  const byKey = new Map();
  const times = RELATIONS[relation].times;
  for (let A = 0; A <= 9; A += 1) {
    const B = A * times;
    if (B > 9 || B === A) continue;
    const digits = { A, B };
    const addend = pattern.split("").map((letter) => digits[letter]);
    if (addend[0] === 0) continue;
    const value = addend[0] * 10 + addend[1];
    const sum = value * count;
    const map = new Map([[A, "A"], [B, "B"]]);
    const extra = [];
    const sumTokens = String(sum).split("").map(Number).map((digit) => { if (!map.has(digit)) { const letter = ["C", "D", "E"][extra.length]; extra.push(digit); map.set(digit, letter); } return map.get(digit); });
    if (!extra.length) continue;
    const shape = sumTokens.join("");
    const entryKey = `${pattern}|${count}|${shape}`;
    const hit = byKey.get(entryKey);
    if (hit) { hit.count += 1; continue; }
    byKey.set(entryKey, { count: 1, A, B, pattern, sumTokens, extra, value, sum });
  }
  const list = [...byKey.values()].filter((entry) => entry.count === 1 && countRelationSolutions(relation, pattern, count, entry.sumTokens) === 1);
  relationCache.set(key, list);
  return list;
}

// 관계식과 세로셈을 모두 맞추는 숫자 배정을 처음부터 다시 센다(검산용).
export function countRelationSolutions(relation, pattern, count, sumTokens) {
  const times = RELATIONS[relation].times;
  const letters = [...new Set(["A", "B", ...sumTokens])];
  let found = 0;
  const assign = {};
  const used = new Set();
  const walk = (index) => {
    if (found > 1) return;
    if (index === letters.length) {
      if (assign.B !== assign.A * times) return;
      const addend = pattern.split("").map((letter) => assign[letter]);
      if (addend[0] === 0 || assign[sumTokens[0]] === 0) return;
      const sum = sumTokens.reduce((total, letter) => total * 10 + assign[letter], 0);
      if ((addend[0] * 10 + addend[1]) * count === sum) found += 1;
      return;
    }
    for (let digit = 0; digit <= 9; digit += 1) {
      if (used.has(digit)) continue;
      used.add(digit); assign[letters[index]] = digit;
      walk(index + 1);
      used.delete(digit);
    }
  };
  walk(0);
  return found;
}

function cryptRelationRepeat({ difficulty = 2 } = {}) {
  const options = [];
  const relations = difficulty === 1 ? ["double"] : ["double", "triple"];
  const counts = difficulty === 1 ? [2, 3] : difficulty === 2 ? [3] : [3, 4];
  relations.forEach((relation) => ["AB", "BA"].forEach((pattern) => counts.forEach((count) => relationFamily(relation, pattern, count).forEach((entry) => options.push({ relation, count, entry })))));
  if (!options.length) return null;
  const { relation, count, entry } = sample(options);
  const glyphs = shuffle(SHAPES);
  const glyph = { A: glyphs[0], B: glyphs[1], C: glyphs[2], D: glyphs[3], E: glyphs[4] };
  const askLetter = sample(entry.sumTokens.filter((letter) => !["A", "B"].includes(letter)));
  const digitOf = { A: entry.A, B: entry.B };
  entry.extra.forEach((digit, index) => { digitOf[["C", "D", "E"][index]] = digit; });
  const addRow = entry.pattern.split("").map((letter) => glyph[letter]);
  const relationText = RELATIONS[relation].text(glyph.A, glyph.B);
  return {
    prompt: `다음 식에서 ${relationText}이고, 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. ${glyph[askLetter]}가 나타내는 숫자를 구하세요.`,
    visual: { kind: "cryptarithm-vertical", addends: Array.from({ length: count }, () => [...addRow]), sum: entry.sumTokens.map((letter) => glyph[letter]) },
    answer: String(digitOf[askLetter]),
    solution: `${relationText}이므로 ${glyph.B}는 ${glyph.A}의 ${RELATIONS[relation].times}배입니다. 가능한 ${glyph.A}를 하나씩 넣어 보면 ${glyph.A}=${entry.A}일 때 ${glyph.B}=${entry.B}이고, ${addRow.join("")}는 ${entry.value}이므로 ${entry.value} × ${count} = ${entry.sum}입니다. 결과의 모양과 맞으므로 ${glyph[askLetter]}=${digitOf[askLetter]}입니다.`,
    meta: { family: "b3s-crypt-relation", relation, pattern: entry.pattern, count, sumTokens: entry.sumTokens, digits: digitOf, askLetter, glyph }
  };
}

// ───────────────────────────── 생성기 · 유형 · 안내 · 번호 ─────────────────────────────

export const BOOK03_STRUCTURE_GENERATORS = {
  b3sCryptAaPlusA: cryptGenerator("aa-plus-a", { typeHint: sameDigitHint }),
  b3sCryptShapeDigitSum: cryptGenerator("shape-digit-sum"),
  b3sCryptAaDoubleShape: cryptGenerator("aa-double-shape", { typeHint: sameDigitHint }),
  b3sCryptSingleThrice: cryptGenerator("single-thrice", { typeHint: (glyph, entry) => `${glyph[entry.rows[0][0].s]}를 세 번 더한 수의 일의 자리가 ${entry.rows[3][1].d}입니다.` }),
  b3sCryptAbDouble: cryptGenerator("ab-double", { ask: "one", measure: (entry) => letterCount(entry) * 1000 + entry.sum }),
  b3sCryptThreeMixedPlusAa: cryptGenerator("three-mixed-plus-aa", { ask: "one" }),
  b3sCryptTwoOneThree: cryptGenerator("two-one-three", { ask: "one", measure: letterCount }),
  b3sCryptTwoOneTwo: cryptGenerator("two-one-two", { ask: "one", measure: (entry) => entry.rows.flat().filter((token) => "s" in token).length }),
  b3sCryptTwoTwoThree: cryptGenerator("two-two-three", { ask: "one", measure: letterCount }),
  b3sCryptThreeTwoShape: cryptGenerator("three-two-shape", { ask: "one", measure: letterCount }),
  b3sCryptThreeTwoFour: cryptGenerator("three-two-four", { ask: "one", measure: letterCount }),
  b3sCellCodeGrid32: (options) => cellCodeProblem("grid32", options),
  b3sCellCodeGrid23: (options) => cellCodeProblem("grid23", options),
  b3sCellCodeCircle32: (options) => cellCodeProblem("circle32", options),
  b3sCellCodeHexagram: (options) => cellCodeProblem("hexagram", options),
  b3sCellCodePentagram: (options) => cellCodeProblem("pentagram", options),
  b3sCellCodeNested: (options) => cellCodeProblem("nested", options),
  b3sMagicHelperCells: magicHelperCells,
  b3sMagicSumThenFill: magicSumThenFill,
  b3sMagicFourSparse: magicFourSparse,
  b3sRingOtherSum: ringOtherSum,
  b3sNestedSquareDoubling: nestedSquareDoubling,
  b3sRodRowsCounts: rodRowsCounts,
  b3sRodRowsMixed: rodRowsMixed,
  b3sPartitionTriangleMixed: partitionTriangleMixed,
  b3sPartitionTriangleThirds: partitionTriangleThirds,
  b3sPartitionSquare: partitionSquare,
  b3sPartitionRightTriangleSquare: partitionRightTriangleSquare,
  b3sPartitionHexagon: partitionHexagon,
  b3sPartitionHexagram: partitionHexagram,
  b3sSquareGridRow: squareGridRow,
  b3sSquareSplitRow: squareSplitRow,
  b3sTriangleSplitRow: triangleSplitRow,
  b3sHexagonSplitRow: hexagonSplitRow,
  b3sCircleEquivalentRow: circleEquivalentRow,
  b3sCircleHalvingRow: circleHalvingRow,
  b3sTangramFillAroundBig: tangramFillAroundBig,
  b3sTangramSquarePlusTwo: tangramSquarePlusTwo,
  b3sGridTriangleAreas: gridTriangleAreas,
  b3sFoldedTapeOne: (options) => foldedTapeProblem(1, options),
  b3sFoldedTapeTwo: (options) => foldedTapeProblem(2, options),
  b3sLogMatchPencil: logMatchPencil,
  b3sRodMatchGuides: rodMatchGuides,
  b3sSegmentChainInnerGiven: segmentChainInnerGiven,
  b3sSixPointsThreeGaps: sixPointsThreeGaps,
  b3sCryptRelationRepeat: cryptRelationRepeat
};

const cryptRow = (id, label, generator, aliases = []) => ({
  id, domain: "number", middle: "복면산", label, generator,
  catalogGroup: "복면산", catalogStrategy: "받아올림 따라가기",
  searchAliases: ["복면산", "모양 덧셈", ...aliases]
});

const codeRow = (id, label, generator, aliases = []) => ({
  id, domain: "pattern", middle: "마법카드와 도형수", label, generator,
  catalogGroup: "마법카드와 도형수", catalogStrategy: "보기로 칸의 값 찾기",
  searchAliases: ["도형수", "색칠한 칸", "비밀 수", ...aliases]
});

const magicRow = (id, label, generator, aliases = []) => ({
  id, domain: "pattern", middle: "마방진", label, generator,
  catalogGroup: "마방진", catalogStrategy: "한 줄의 합 먼저",
  searchAliases: ["마방진", ...aliases]
});

const fractionRow = (id, label, generator, strategy, aliases = []) => ({
  id, domain: "geometry", middle: "도형의 분할과 분수", label, generator,
  catalogGroup: "단위넓이와 분수", catalogStrategy: strategy,
  searchAliases: ["분수", "도형 분할", ...aliases]
});

const lengthRow = (id, label, generator, strategy, aliases = []) => ({
  id, domain: "geometry", middle: "단위길이", label, generator,
  catalogGroup: "단위길이와 배수", catalogStrategy: strategy,
  searchAliases: ["길이", ...aliases]
});

export const BOOK03_STRUCTURE_TYPE_ROWS = [
  cryptRow("crypt-aa-plus-a-b3", "같은 모양 두 자리 수에 그 모양 한 자리 더하기", "b3sCryptAaPlusA", ["AA+A"]),
  cryptRow("crypt-shape-digit-sum-b3", "모양에 숫자를 더해 다른 모양 수 만들기", "b3sCryptShapeDigitSum", ["모양 + 숫자"]),
  cryptRow("crypt-aa-double-shape-b3", "같은 모양 두 자리 수 두 번 — 결과에도 모양", "b3sCryptAaDoubleShape", ["AA+AA"]),
  cryptRow("crypt-single-thrice-b3", "한 자리 같은 모양을 세 번 더하기", "b3sCryptSingleThrice", ["세 번 더하기"]),
  cryptRow("crypt-ab-double-b3", "두 모양 두 자리 수를 두 번 더해 모양 결과 만들기", "b3sCryptAbDouble", ["AB+AB"]),
  cryptRow("crypt-three-mixed-plus-aa-b3", "숫자가 섞인 세 자리 수에 같은 모양 두 자리 수 더하기", "b3sCryptThreeMixedPlusAa", ["세 자리 + AA"]),
  cryptRow("crypt-two-one-three-b3", "모두 모양인 두 자리 + 한 자리 = 세 자리", "b3sCryptTwoOneThree", ["두 자리 + 한 자리"]),
  cryptRow("crypt-two-one-two-b3", "모두 모양인 두 자리 + 한 자리 = 두 자리", "b3sCryptTwoOneTwo", ["AB+B"]),
  cryptRow("crypt-two-two-three-b3", "모두 모양인 두 자리 + 두 자리 = 세 자리", "b3sCryptTwoTwoThree", ["두 자리 + 두 자리"]),
  cryptRow("crypt-three-two-shape-b3", "모양 세 자리 + 모양 두 자리 = 숫자 하나 섞인 세 자리", "b3sCryptThreeTwoShape", ["세 자리 + 두 자리"]),
  cryptRow("crypt-three-two-four-b3", "모두 모양인 세 자리 + 두 자리 = 네 자리", "b3sCryptThreeTwoFour", ["네 자리 결과"]),
  codeRow("cell-code-grid32-b3", "세로 3×2 칸에 색칠해 수 나타내기", "b3sCellCodeGrid32", ["3×2 모눈"]),
  codeRow("cell-code-grid23-b3", "가로 2×3 칸에 색칠해 수 나타내기", "b3sCellCodeGrid23", ["2×3 모눈"]),
  codeRow("cell-code-circle32-b3", "3×2 칸에 동그라미를 그려 수 나타내기", "b3sCellCodeCircle32", ["동그라미 표시"]),
  codeRow("cell-code-hexagram-b3", "육각별 끝 삼각형에 색칠해 수 나타내기", "b3sCellCodeHexagram", ["육각별"]),
  codeRow("cell-code-pentagram-b3", "오각별 끝 삼각형에 색칠해 수 나타내기", "b3sCellCodePentagram", ["오각별", "별 모양"]),
  codeRow("cell-code-nested-square-b3", "겹친 정사각형 고리에 색칠해 수 나타내기", "b3sCellCodeNested", ["고리", "겹친 정사각형"]),
  magicRow("magic-helper-cells-b3", "도움 칸을 써서 3×3 마방진 만들기", "b3sMagicHelperCells", ["도움 칸", "보조 칸", "대각선으로 쓰기"]),
  magicRow("magic-sum-then-fill-b3", "한 줄의 합을 먼저 구해 3×3 마방진 모두 채우기", "b3sMagicSumThenFill", ["한 줄의 합"]),
  magicRow("magic-four-sparse-b3", "수가 조금만 보이는 4×4 마방진의 색칠한 칸", "b3sMagicFourSparse", ["4×4"]),
  magicRow("ring-other-sum-b3", "오각진의 세 수 합을 정해진 합으로 맞추기", "b3sRingOtherSum", ["오각진", "합 19"]),
  { id: "nested-square-doubling-b3", domain: "pattern", middle: "넓이 규칙", label: "바로 선·기운 정사각형이 번갈아 감싸 넓이가 두 배씩", generator: "b3sNestedSquareDoubling", catalogGroup: "단위넓이", catalogStrategy: "두 배씩 커지는 넓이", searchAliases: ["겹친 정사각형", "기운 정사각형", "넓이 두 배"] },
  { id: "rod-rows-counts-b3", domain: "geometry", middle: "막대와 배수", label: "같은 길이 줄을 막대 여러 가지로 채운 막대 사슬", generator: "b3sRodRowsCounts", catalogGroup: "단위길이와 배수", catalogStrategy: "한 줄의 길이 먼저", searchAliases: ["막대", "막대 사슬", "배수"] },
  { id: "rod-rows-mixed-b3", domain: "geometry", middle: "막대와 배수", label: "긴 막대와 짧은 막대가 섞인 줄의 막대 길이", generator: "b3sRodRowsMixed", catalogGroup: "단위길이와 배수", catalogStrategy: "끝이 맞는 막대 찾기", searchAliases: ["막대", "막대 사슬", "끝 맞추기"] },
  fractionRow("partition-triangle-mixed-b3", "크기가 다른 조각이 섞인 정삼각형 — 빠진 선 긋고 분수로", "b3sPartitionTriangleMixed", "빠진 선 긋기", ["빠진 선", "정삼각형 분할"]),
  fractionRow("partition-triangle-thirds-b3", "정삼각형 한 칸을 셋으로 나눈 조각 — 빠진 선 긋고 분수로", "b3sPartitionTriangleThirds", "빠진 선 긋기", ["빠진 선", "세 조각", "가운데 점"]),
  fractionRow("partition-square-b3", "정사각형을 작은 삼각형으로 — 빠진 선 긋고 분수로", "b3sPartitionSquare", "빠진 선 긋기", ["빠진 선", "정사각형 분할", "대각선"]),
  fractionRow("partition-right-triangle-square-b3", "직각이등변삼각형 안의 정사각형을 분수로", "b3sPartitionRightTriangleSquare", "빠진 선 긋기", ["빠진 선", "직각이등변삼각형", "안의 정사각형"]),
  fractionRow("partition-hexagon-b3", "정육각형을 작은 삼각형으로 — 빠진 선 긋고 분수로", "b3sPartitionHexagon", "빠진 선 긋기", ["빠진 선", "정육각형 분할"]),
  fractionRow("partition-hexagram-b3", "육각별을 작은 정삼각형으로 — 빠진 선 긋고 분수로", "b3sPartitionHexagram", "빠진 선 긋기", ["빠진 선", "육각별", "별 모양"]),
  fractionRow("square-grid-fraction-row-b3", "모눈으로 나눈 정사각형 여러 개의 색칠한 부분 분수", "b3sSquareGridRow", "전체와 부분 세기", ["모눈", "정사각형 분수"]),
  fractionRow("square-split-fraction-row-b3", "반·넷·여덟·열여섯으로 나눈 정사각형의 분수", "b3sSquareSplitRow", "전체와 부분 세기", ["정사각형 분수", "대각선"]),
  fractionRow("triangle-split-fraction-row-b3", "여러 가지로 나눈 정삼각형의 분수", "b3sTriangleSplitRow", "전체와 부분 세기", ["정삼각형 분수", "가운데 점"]),
  fractionRow("hexagon-split-fraction-row-b3", "마름모·삼각형으로 나눈 정육각형의 분수", "b3sHexagonSplitRow", "전체와 부분 세기", ["정육각형 분수", "마름모"]),
  fractionRow("circle-equivalent-fraction-row-b3", "조각이 2배·3배로 늘어난 원의 같은 크기 분수", "b3sCircleEquivalentRow", "전체와 부분 세기", ["원 분수", "같은 크기 분수"]),
  fractionRow("circle-halving-fraction-row-b3", "조각이 반씩 작아지는 원의 한 조각 분수", "b3sCircleHalvingRow", "전체와 부분 세기", ["원 분수", "단위분수"]),
  { id: "tangram-fill-around-big-b3", domain: "geometry", middle: "칠교와 넓이", label: "큰 삼각형 두 조각을 놓은 판을 남은 5조각으로 채우기", generator: "b3sTangramFillAroundBig", catalogGroup: "단위넓이", catalogStrategy: "넓이와 변 맞추기", searchAliases: ["칠교", "칠교 채우기"] },
  { id: "tangram-square-plus-two-b3", domain: "geometry", middle: "칠교와 넓이", label: "5조각 정사각형에 큰 삼각형 둘을 붙여 사각형 만들기", generator: "b3sTangramSquarePlusTwo", catalogGroup: "단위넓이", catalogStrategy: "넓이와 변 맞추기", searchAliases: ["칠교", "직사각형", "평행사변형", "사다리꼴"] },
  { id: "grid-triangle-areas-b3", domain: "geometry", middle: "단위넓이", label: "모눈 위 삼각형 세 개의 넓이(밑변과 높이)", generator: "b3sGridTriangleAreas", catalogGroup: "단위넓이", catalogStrategy: "감싸는 직사각형의 반", searchAliases: ["삼각형 넓이", "모눈"] },
  lengthRow("folded-tape-one-fold-b3", "한 번 접은 한 칸 폭 띠의 길이", "b3sFoldedTapeOne", "접힌 곳은 한 칸", ["색 테이프", "접은 띠"]),
  lengthRow("folded-tape-two-folds-b3", "두 번 접은 한 칸 폭 띠의 길이", "b3sFoldedTapeTwo", "접힌 곳은 한 칸", ["리본 끈", "접은 띠"]),
  lengthRow("log-match-pencil-guides-b3", "통나무·성냥개비·연필 두 줄 — 점선으로 성냥 수 읽기", "b3sLogMatchPencil", "끝이 맞는 점선 읽기", ["성냥개비", "통나무", "연필"]),
  lengthRow("rod-match-guides-b3", "막대와 성냥개비 두 줄 — 같은 성냥 지우고 막대 길이", "b3sRodMatchGuides", "끝이 맞는 점선 읽기", ["성냥개비", "막대"]),
  { ...lengthRow("segment-chain-inner-given-b3", "네 점 — 겹친 거리와 가운데 거리로 나머지 거리", "b3sSegmentChainInnerGiven", "겹친 구간 빼기", ["수직선", "점 사이 거리"]), middle: "수직선과 길이" },
  { ...lengthRow("six-points-three-gaps-b3", "여섯 점 — 겹친 거리 다섯으로 구간 세 개", "b3sSixPointsThreeGaps", "겹친 구간 빼기", ["수직선", "여섯 점"]), middle: "수직선과 길이" },
  cryptRow("crypt-relation-repeat-b3", "모양 관계식과 같은 두 자리 수 여러 번 더하기", "b3sCryptRelationRepeat", ["관계식", "여러 번 더하기"])
];

export const BOOK03_STRUCTURE_GUIDES = {
  "crypt-aa-plus-a-b3": "같은 모양이 세 번 더해지니 일의 자리부터 그 모양을 세 번 더한 끝 숫자를 봅니다.",
  "crypt-shape-digit-sum-b3": "더한 결과의 앞자리는 받아올림이라 1이고, 일의 자리 계산으로 나머지 모양을 찾습니다.",
  "crypt-aa-double-shape-b3": "같은 숫자를 네 번(일의 자리 두 번, 십의 자리 두 번) 더하는 것으로 보고 일의 자리 끝 숫자부터 맞춥니다.",
  "crypt-single-thrice-b3": "같은 숫자를 세 번 더해 일의 자리가 보이는 숫자가 되는 수를 찾고, 남는 수가 앞 모양입니다.",
  "crypt-ab-double-b3": "같은 수를 두 번 더하면 두 배이므로, 결과의 앞자리 받아올림부터 정하고 일의 자리 두 배를 봅니다.",
  "crypt-three-mixed-plus-aa-b3": "보이는 숫자로 자리마다 받아올림이 있는지 정하고, 같은 모양에는 같은 숫자를 넣어 맞춥니다.",
  "crypt-two-one-three-b3": "세 자리가 되려면 앞자리 받아올림이 1이고 두 자리 수의 십의 자리가 9여야 합니다.",
  "crypt-two-one-two-b3": "한 자리 수를 더해 십의 자리가 바뀌었는지(받아올림) 먼저 보고 일의 자리 식을 세웁니다.",
  "crypt-two-two-three-b3": "결과의 맨 앞은 받아올림 1이고, 같은 모양이 나오는 자리끼리 받아올림을 따져 차례로 정합니다.",
  "crypt-three-two-shape-b3": "보이는 숫자 자리부터 받아올림을 정하고, 같은 모양이 몇 번 쓰였는지 보며 왼쪽으로 갑니다.",
  "crypt-three-two-four-b3": "네 자리가 되었으니 맨 앞은 1, 세 자리 수의 백의 자리는 9입니다. 그다음 일의 자리부터 맞춥니다.",
  "cell-code-grid32-b3": "한 칸만 색칠한 보기로 칸의 수를 찾고, 두 칸짜리 보기에서 아는 칸을 빼 나머지 칸의 수를 찾습니다.",
  "cell-code-grid23-b3": "한 칸만 색칠한 보기로 칸의 수를 찾고, 칸의 수가 두 배씩 커지는 차례를 따라 나머지 칸을 채웁니다.",
  "cell-code-circle32-b3": "동그라미가 하나인 보기로 칸의 수를 찾고, 동그라미가 둘인 보기에서 아는 칸을 빼 나머지를 찾습니다.",
  "cell-code-hexagram-b3": "끝 삼각형 하나만 칠한 보기부터 보고, 별을 한 바퀴 돌며 칸의 수가 두 배씩 커지는지 확인합니다.",
  "cell-code-pentagram-b3": "끝 삼각형 하나만 칠한 보기부터 보고, 별을 한 바퀴 돌며 칸의 수가 두 배씩 커지는지 확인합니다.",
  "cell-code-nested-square-b3": "같은 고리의 칸은 같은 수입니다. 안쪽 칸 하나의 수부터 찾고 가운데·바깥 고리 한 칸의 수를 차례로 찾습니다.",
  "magic-helper-cells-b3": "수를 대각선으로 세 개씩 이어 쓰고, 네모 밖 도움 칸의 수는 맞은편 안쪽 빈칸으로 옮깁니다.",
  "magic-sum-then-fill-b3": "세 수가 다 보이는 줄로 한 줄의 합을 구하고(가운데 수의 세 배), 두 칸을 아는 줄부터 채웁니다.",
  "magic-four-sparse-b3": "한 줄의 합은 34입니다. 모르는 칸이 하나뿐인 줄부터 채우며 색칠한 칸까지 갑니다.",
  "ring-other-sum-b3": "꼭짓점 다섯 수의 합은 (한 줄의 합) × 5 − 55입니다. 두 수를 아는 줄부터 빼서 채웁니다.",
  "nested-square-doubling-b3": "감싸는 정사각형은 안쪽 정사각형의 넓이에 같은 넓이를 한 번 더 붙인 것이라 두 배씩 커집니다.",
  "rod-rows-counts-b3": "아는 막대로 한 줄의 길이를 먼저 구하고, 그 길이를 다른 막대의 개수로 나눕니다.",
  "rod-rows-mixed-b3": "끝이 맞는 곳을 찾아 짧은 막대 몇 개가 아래 막대 하나인지 보고, 한 줄의 길이를 구한 뒤 나머지를 뺍니다.",
  "partition-triangle-mixed-b3": "가장 작은 정삼각형 하나를 기준으로 큰 조각 안에 선을 그어, 큰 조각이 작은 조각 몇 개인지 셉니다.",
  "partition-triangle-thirds-b3": "셋으로 나뉜 한 칸을 보고 다른 칸도 가운데 점에서 꼭짓점으로 선을 그어 셋씩 나눈 뒤 셉니다.",
  "partition-square-b3": "가장 작은 삼각형과 같은 모양이 되도록 대각선과 가운데 선을 이어 긋고, 색칠한 조각이 작은 삼각형 몇 개인지 셉니다.",
  "partition-right-triangle-square-b3": "정사각형의 변을 늘이거나 대각선을 그어 작은 삼각형으로 나누고, 정사각형이 그 삼각형 몇 개인지 셉니다.",
  "partition-hexagon-b3": "가장 작은 삼각형을 찾아 같은 모양이 되도록 가운데 점과 꼭짓점을 잇는 선을 더 긋고 셉니다.",
  "partition-hexagram-b3": "별의 끝 삼각형과 같은 크기가 되도록 가운데 육각형을 정삼각형 여섯 개로 나누어 셉니다.",
  "square-grid-fraction-row-b3": "작은 정사각형이 모두 몇 개인지(가로 칸 수 × 세로 칸 수) 세어 분모로, 색칠한 칸 수를 분자로 씁니다.",
  "square-split-fraction-row-b3": "그림마다 정사각형이 같은 조각 몇 개로 나뉘었는지 세어 분모로, 색칠한 조각 수를 분자로 씁니다.",
  "triangle-split-fraction-row-b3": "그림마다 정삼각형이 같은 조각 몇 개로 나뉘었는지 세어 분모로, 색칠한 조각 수를 분자로 씁니다.",
  "hexagon-split-fraction-row-b3": "그림마다 정육각형이 같은 조각 몇 개로 나뉘었는지 세어 분모로, 색칠한 조각 수를 분자로 씁니다.",
  "circle-equivalent-fraction-row-b3": "조각이 두 배로 잘게 나뉘면 색칠한 조각 수도 두 배가 되어, 색칠한 크기는 그대로입니다.",
  "circle-halving-fraction-row-b3": "조각 수가 두 배가 될 때마다 한 조각은 반으로 작아집니다. 원마다 전체 조각 수를 분모로 씁니다.",
  "tangram-fill-around-big-b3": "빈 곳의 직각 모서리와 기운 선을 먼저 보고, 직각과 긴 변이 맞는 조각부터 돌리거나 뒤집어 넣습니다.",
  "tangram-square-plus-two-b3": "5조각 정사각형의 한 변과 큰 삼각형의 짧은 변 길이가 같다는 것을 이용해 맞대어 붙입니다.",
  "grid-triangle-areas-b3": "삼각형을 꼭 감싸는 직사각형을 그리면 삼각형은 그 직사각형의 반이므로 (밑변 × 높이)의 반입니다.",
  "folded-tape-one-fold-b3": "곧은 부분의 칸을 세고, 접힌 모서리의 삼각형은 한 칸으로 더합니다.",
  "folded-tape-two-folds-b3": "곧은 부분의 칸을 모두 세고, 접힌 곳마다 한 칸씩 더합니다.",
  "log-match-pencil-guides-b3": "점선으로 마지막 물건 하나가 성냥개비 몇 개인지 읽고, 두 줄의 같은 성냥개비를 지워 나머지를 성냥개비 수로 바꿉니다.",
  "rod-match-guides-b3": "두 줄에서 같은 수의 성냥개비를 지우고, 점선으로 막대 하나가 성냥개비 몇 개인지 읽어 길이를 구합니다.",
  "segment-chain-inner-given-b3": "한 끝이 같은 두 거리의 차가 남은 구간이고, 이어진 두 구간의 합이 긴 구간입니다.",
  "six-points-three-gaps-b3": "한 끝이 같은 거리끼리 빼서 짧은 구간을 하나씩 찾고, 찾은 구간을 다른 거리에서 다시 뺍니다.",
  "crypt-relation-repeat-b3": "관계식으로 두 모양의 짝(1과 2, 2와 4 …)을 먼저 좁히고, 하나씩 넣어 세로셈 결과의 모양과 맞는지 봅니다."
};

export const BOOK03_STRUCTURE_REMAPS = [
  // 3단원 복면산
  ["book-03", 3, "activity", 1, [2], "crypt-aa-double-shape-b3"],
  ["book-03", 3, "activity", 1, [3], "crypt-shape-digit-sum-b3"],
  ["book-03", 3, "activity", 1, [4], "crypt-aa-plus-a-b3"],
  ["book-03", 3, "activity", 2, [1], "crypt-ab-double-b3"],
  ["book-03", 3, "activity", 2, [2], "crypt-aa-double-shape-b3"],
  ["book-03", 3, "activity", 2, [3], "crypt-three-mixed-plus-aa-b3"],
  ["book-03", 3, "check", 1, [3, 4], "crypt-single-thrice-b3"],
  ["book-03", 3, "check", 2, [1], "crypt-two-one-three-b3"],
  ["book-03", 3, "check", 2, [2, 3, 4], "crypt-two-two-three-b3"],
  ["book-03", 3, "practice", 1, [3], "crypt-aa-double-shape-b3"],
  ["book-03", 3, "practice", 1, [4], "crypt-shape-digit-sum-b3"],
  ["book-03", 3, "practice", 1, [5], "crypt-aa-plus-a-b3"],
  ["book-03", 3, "practice", 1, [8], "crypt-single-thrice-b3"],
  ["book-03", 3, "practice", 1, [13, 16], "crypt-three-two-shape-b3"],
  ["book-03", 3, "practice", 1, [15], "crypt-two-two-three-b3"],
  ["book-03", 3, "practice", 1, [17], "crypt-ab-double-b3"],
  ["book-03", 3, "advanced", 1, [1], "crypt-three-two-four-b3"],
  ["book-03", 3, "advanced", 1, [3], "crypt-two-one-two-b3"],
  // 4단원 마법카드 — 색칠한 칸 새 배치
  ["book-03", 4, "activity", 1, [3], "cell-code-grid32-b3"],
  ["book-03", 4, "check", 1, [2], "cell-code-hexagram-b3"],
  ["book-03", 4, "practice", 1, [4], "cell-code-circle32-b3"],
  ["book-03", 4, "practice", 1, [5], "cell-code-grid23-b3"],
  ["book-03", 4, "practice", 1, [7], "cell-code-pentagram-b3"],
  ["book-03", 4, "advanced", 1, [4], "cell-code-nested-square-b3"],
  // 4단원 마방진
  ["book-03", 4, "activity", 2, [1], "magic-helper-cells-b3"],
  ["book-03", 4, "practice", 1, [9], "magic-helper-cells-b3"],
  ["book-03", 4, "activity", 2, [3], "magic-sum-then-fill-b3"],
  ["book-03", 4, "practice", 1, [11], "magic-sum-then-fill-b3"],
  ["book-03", 4, "check", 2, [3], "magic-four-sparse-b3"],
  ["book-03", 4, "practice", 1, [14], "magic-four-sparse-b3"],
  ["book-03", 4, "practice", 1, [15], "ring-other-sum-b3"],
  // 1단원 겹친 정사각형(두 배씩) · 2단원 막대 사슬
  ["book-03", 1, "check", 1, [4], "nested-square-doubling-b3"],
  ["book-03", 1, "practice", 1, [7], "nested-square-doubling-b3"],
  ["book-03", 2, "practice", 1, [13], "rod-rows-mixed-b3"],
  ["book-03", 2, "practice", 1, [14], "rod-rows-counts-b3"],
  // 1단원 칠교 · 삼각형 넓이 · 조각 나누기 분수
  ["book-03", 1, "activity", 1, [1], "tangram-fill-around-big-b3"],
  ["book-03", 1, "activity", 1, [3], "tangram-square-plus-two-b3"],
  ["book-03", 1, "activity", 2, [3], "hexagon-split-fraction-row-b3"],
  ["book-03", 1, "check", 2, [2], "partition-triangle-mixed-b3"],
  ["book-03", 1, "check", 2, [3, 4], "partition-square-b3"],
  ["book-03", 1, "practice", 1, [2], "grid-triangle-areas-b3"],
  ["book-03", 1, "practice", 1, [8], "circle-equivalent-fraction-row-b3"],
  ["book-03", 1, "practice", 1, [9], "circle-halving-fraction-row-b3"],
  ["book-03", 1, "practice", 1, [10], "square-grid-fraction-row-b3"],
  ["book-03", 1, "practice", 1, [11], "triangle-split-fraction-row-b3"],
  ["book-03", 1, "practice", 1, [12], "square-split-fraction-row-b3"],
  ["book-03", 1, "practice", 1, [13], "partition-hexagram-b3"],
  ["book-03", 1, "practice", 1, [16], "partition-hexagon-b3"],
  ["book-03", 1, "practice", 1, [18], "partition-triangle-mixed-b3"],
  ["book-03", 1, "practice", 1, [20], "partition-square-b3"],
  ["book-03", 1, "advanced", 1, [1], "partition-right-triangle-square-b3"],
  ["book-03", 1, "advanced", 1, [2], "partition-triangle-thirds-b3"],
  ["book-03", 1, "advanced", 1, [3], "partition-hexagon-b3"],
  // 2단원 접은 띠 · 점 사이 거리 · 성냥개비 두 줄
  ["book-03", 2, "activity", 1, [1], "folded-tape-one-fold-b3"],
  ["book-03", 2, "activity", 1, [2], "folded-tape-two-folds-b3"],
  ["book-03", 2, "practice", 1, [1], "folded-tape-one-fold-b3"],
  ["book-03", 2, "practice", 1, [2], "folded-tape-two-folds-b3"],
  ["book-03", 2, "check", 1, [2], "segment-chain-inner-given-b3"],
  ["book-03", 2, "practice", 1, [6], "segment-chain-inner-given-b3"],
  ["book-03", 2, "check", 2, [1], "log-match-pencil-guides-b3"],
  ["book-03", 2, "practice", 1, [15], "log-match-pencil-guides-b3"],
  ["book-03", 2, "check", 2, [2], "rod-match-guides-b3"],
  ["book-03", 2, "practice", 1, [16], "rod-match-guides-b3"],
  ["book-03", 2, "advanced", 1, [1], "six-points-three-gaps-b3"],
  // 3단원 도전 4
  ["book-03", 3, "advanced", 1, [4], "crypt-relation-repeat-b3"]
];

// 검사기용: 새 생성기 문항을 다른 방법으로 다시 풀어 본다. 틀리면 까닭을 글로 돌려준다(맞으면 "").
export function verifyBook03Structure(problem) {
  const meta = problem?.meta || {};
  if (meta.family === "b3s-crypt") {
    const value = (row) => row.reduce((total, token) => total * 10 + ("d" in token ? token.d : meta.values[token.s]), 0);
    const addRows = meta.rows.slice(0, -1);
    if (addRows.reduce((total, row) => total + value(row), 0) !== value(meta.rows[meta.rows.length - 1])) return "식이 성립하지 않음";
    if (new Set(meta.values).size !== meta.values.length) return "다른 모양에 같은 숫자";
    if (countCryptSolutions(meta.rows) !== 1) return "답이 하나가 아님";
    const cells = [...problem.visual.addends, problem.visual.sum];
    const expected = meta.rows.map((row) => row.map((token) => ("d" in token ? String(token.d) : meta.glyph[token.s])));
    if (JSON.stringify(cells) !== JSON.stringify(expected)) return "그림과 식이 다름";
    const want = meta.askLetters.length === 1 ? String(meta.values[meta.askLetters[0]]) : meta.askLetters.map((index) => `${meta.glyph[index]}=${meta.values[index]}`).join(", ");
    if (problem.answer !== want) return "답이 풀이와 다름";
    return "";
  }
  if (meta.family === "b3s-cell-code") {
    const total = (on) => on.reduce((sum, cell) => sum + meta.weights[cell], 0);
    if (meta.examples.some((example) => total(example.on) !== example.value)) return "보기 그림과 수가 다름";
    if (total(meta.on) !== meta.target) return "물은 그림의 수가 다름";
    if (!examplesDetermine(meta.examples, meta.groups, new Set(meta.groups).size)) return "보기만으로 칸의 수가 정해지지 않음";
    if (meta.examples.some((example) => example.value === meta.target)) return "물은 수가 보기에 있음";
    if (meta.layout !== "nested" && new Set(meta.weights).size !== meta.weights.length) return "칸의 수가 겹침";
    if (meta.mode === "read" && problem.answer !== String(meta.target)) return "답이 다름";
    return "";
  }
  if (meta.family === "b3s-magic-helper") {
    const flat = meta.grid.flat();
    if (!isMagic(flat, MAGIC_LINES_3)) return "마방진이 아님";
    if (JSON.stringify(helperSquare(meta.start, meta.step, meta.symmetry).grid) !== JSON.stringify(meta.grid)) return "도움 칸 방법과 다름";
    if (problem.answer !== meta.grid.map((row) => row.join(" ")).join(" / ")) return "답이 다름";
    return "";
  }
  if (meta.family === "b3s-magic-fill") {
    if (!isMagic(meta.flat, MAGIC_LINES_3)) return "마방진이 아님";
    if (rank3(meta.shownIdx.map((index) => MAGIC3_FORM[index])) !== 3) return "보이는 칸으로 정해지지 않음";
    if (meta.lineSum !== meta.flat[0] + meta.flat[1] + meta.flat[2]) return "합이 다름";
    return "";
  }
  if (meta.family === "b3s-magic-four") {
    if (!isMagic(meta.solution, MAGIC_LINES_4) || meta.solution.some((value) => value < 1 || value > 16)) return "1~16 마방진이 아님";
    if (propagateFour(meta.shown)[meta.target] !== meta.answer || meta.solution[meta.target] !== meta.answer) return "색칠한 칸이 정해지지 않음";
    if (meta.shown[meta.target] != null) return "답 칸이 보임";
    return "";
  }
  if (meta.family === "b3s-ring") {
    // 보이지 않는 자리를 남은 수로 모두 바꿔 넣어 보는 따로 된 검산
    const open = meta.solution.map((_, index) => index).filter((index) => !meta.clues.includes(index));
    const rest = range(1, 10).filter((value) => !meta.clues.some((index) => meta.solution[index] === value));
    let count = 0;
    const ring = meta.solution.map((value, index) => (meta.clues.includes(index) ? value : null));
    const used = new Set();
    const walk = (k) => {
      if (count > 1) return;
      if (k === open.length) {
        if (range(0, 4).every((i) => ring[2 * i] + ring[2 * i + 1] + ring[(2 * i + 2) % 10] === meta.lineSum)) count += 1;
        return;
      }
      for (const value of rest) { if (used.has(value)) continue; used.add(value); ring[open[k]] = value; walk(k + 1); used.delete(value); }
    };
    walk(0);
    return count === 1 ? "" : `답이 ${count}개`;
  }
  if (meta.family === "b3s-nested-doubling") {
    const areas = range(1, meta.target).map((k) => meta.unit * 2 ** (k - 1));
    const want = meta.askSum ? areas.reduce((sum, value) => sum + value, 0) : areas[meta.target - 1];
    return want === meta.answer && problem.answer === String(want) ? "" : "넓이가 다름";
  }
  if (meta.family === "b3s-rod-rows") {
    if (meta.rods.some((rod) => !Number.isInteger(rod.length) || rod.length <= 0)) return "막대 길이가 자연수가 아님";
    if (meta.rows && meta.rows.some((row) => row.reduce((sum, piece) => sum + piece.length, 0) !== meta.total)) return "줄 길이가 다름";
    if (!meta.rows && meta.rods.some((rod) => rod.count * rod.length !== meta.total)) return "줄 길이가 다름";
    if (new Set(meta.rods.map((rod) => rod.length)).size !== meta.rods.length) return "막대 길이가 겹침";
    return "";
  }
  if (meta.family === "b3s-partition") return checkPartition(meta, problem.answer);
  if (meta.family === "b3s-row-fraction") {
    const want = meta.figures.map((figure, index) => {
      const why = congruentCells(figure.cells);
      if (why) throw new Error(`${figure.template}: ${why}`);
      const shadedArea = figure.shaded.reduce((sum, cell) => sum + areaOf(figure.cells[cell]), 0);
      const totalArea = figure.cells.reduce((sum, cell) => sum + areaOf(cell), 0);
      if (Math.abs(shadedArea / totalArea - figure.shaded.length / figure.cells.length) > 1e-6) throw new Error("넓이 비가 다름");
      return `${CIRCLED[index]} ${figure.shaded.length}/${figure.cells.length}`;
    }).join(", ");
    return problem.answer === want ? "" : "답이 다름";
  }
  if (meta.family === "b3s-circle-row") {
    const values = meta.circles.map((circle) => circle.shaded / circle.parts);
    if (meta.mode === "equivalent" && values.some((value) => Math.abs(value - values[0]) > 1e-12)) return "같은 크기가 아님";
    if (meta.mode === "halving" && meta.circles.some((circle, index) => index && circle.parts !== meta.circles[index - 1].parts * 2)) return "반씩 작아지지 않음";
    const want = meta.circles.map((circle, index) => `${CIRCLED[index]} ${circle.shaded}/${circle.parts}`).join(", ");
    return problem.answer === want ? "" : "답이 다름";
  }
  if (meta.family === "b3s-tangram-fill") {
    const areas = Object.fromEntries(Object.entries(meta.pieces).map(([name, poly]) => [name, areaOf(poly)]));
    const expect = { big1: 4, big2: 4, small1: 1, small2: 1, square: 2, medium: 2, para: 2 };
    if (Object.entries(expect).some(([name, value]) => Math.abs(areas[name] - value) > 1e-9)) return "조각 넓이가 다름";
    if (Object.values(meta.pieces).flat().some(([x, y]) => x < 0 || y < 0 || x > 4 || y > 4)) return "판 밖으로 나감";
    // 겹침이 없으면 판을 잘게 나눈 점마다 딱 한 조각 안에 든다
    for (let i = 0; i < 16; i += 1) for (let j = 0; j < 16; j += 1) {
      const point = [(i + 0.5) / 4 + 1e-3, (j + 0.5) / 4 + 2e-3];
      const hits = Object.values(meta.pieces).filter((poly) => insideConvex(poly, point)).length;
      if (hits !== 1) return "조각이 겹치거나 빈틈";
    }
    return "";
  }
  if (meta.family === "b3s-tangram-shapes") {
    for (const shape of meta.shapes) {
      if (Math.abs(areaOf(shape.outline) - 8) > 1e-9) return "모양 넓이가 8이 아님";
      const pieces = [shape.squarePoly, ...shape.tris];
      if (Math.abs(areaOf(shape.squarePoly) - 4) > 1e-9 || shape.tris.some((tri) => Math.abs(areaOf(tri) - 2) > 1e-9)) return "조각 넓이가 다름";
      const xs = shape.outline.map(([x]) => x); const ys = shape.outline.map(([, y]) => y);
      for (let x = Math.min(...xs) + 0.13; x < Math.max(...xs); x += 0.25) for (let y = Math.min(...ys) + 0.17; y < Math.max(...ys); y += 0.25) {
        const inOutline = insideConvex(shape.outline, [x, y]);
        const hits = pieces.filter((poly) => insideConvex(poly, [x, y])).length;
        if ((inOutline ? 1 : 0) !== hits) return "모양을 채우지 못함";
      }
    }
    return "";
  }
  if (meta.family === "b3s-grid-triangle") {
    const want = meta.tris.map((tri, index) => {
      const twice = Math.round(areaOf(tri.points) * 2);
      if (twice !== tri.base * tri.height) throw new Error("넓이 식이 다름");
      return `${CIRCLED[index]} ${twice % 2 ? mixed(Math.floor(twice / 2), 1, 2) : twice / 2}`;
    }).join(", ");
    return problem.answer === want ? "" : "답이 다름";
  }
  if (meta.family === "b3s-folded-tape") {
    // 띠의 가운데 선을 따라가며 길이를 잰다(그림의 칸 수와 다른 방법)
    for (const figure of meta.figures) {
      const arms = figure.pieces.filter((piece) => piece.kind === "arm");
      const corners = figure.pieces.filter((piece) => piece.kind === "corner");
      if (corners.length !== meta.folds) return "접은 횟수가 다름";
      const center = ([x, y]) => [x + 0.5, y + 0.5];
      const path = [];
      const firstDir = DIRS[corners[0].inDir];
      const first = center(arms[0].cells[0]);
      path.push([first[0] - firstDir[0] / 2, first[1] - firstDir[1] / 2]);
      corners.forEach((corner) => path.push(center(corner.cell)));
      const lastDir = DIRS[corners[corners.length - 1].outDir];
      const lastArm = arms[arms.length - 1];
      const last = center(lastArm.cells[lastArm.cells.length - 1]);
      path.push([last[0] + lastDir[0] / 2, last[1] + lastDir[1] / 2]);
      const length = path.slice(1).reduce((sum, point, index) => sum + Math.hypot(point[0] - path[index][0], point[1] - path[index][1]), 0);
      if (Math.abs(length - figure.length) > 1e-9) return "띠 길이가 다름";
    }
    const want = meta.figures.map((figure, index) => `${CIRCLED[index]} ${figure.length}cm`).join(", ");
    return problem.answer === want ? "" : "답이 다름";
  }
  if (meta.family === "b3s-match-rows") {
    const { q, k, a, b, r, match } = meta;
    if (r + a !== b + k * q) return "두 줄 길이가 다름";
    if (b + (k - 1) * q < r) return "마지막 물건이 위 줄 성냥과 맞닿지 않음";
    const big = r * match; const small = q * match;
    const want = meta.givenSide === "big" ? small : big;
    if (meta.answer !== want || problem.answer !== `${want}cm`) return "답이 다름";
    if (problem.visual.html.includes(`>${want}cm<`) && want !== meta.givenValue) return "답이 그림에 보임";
    return "";
  }
  if (meta.family === "b3s-point-spans") {
    const length = ([i, j]) => meta.gaps.slice(i, j).reduce((sum, value) => sum + value, 0);
    const known = deriveSpans(meta.given);
    if (meta.ask.some(([i, j]) => !known.has(`${i},${j}`))) return "주어진 거리로 구할 수 없음";
    if (meta.ask.some(([i, j]) => meta.given.some(([g, h]) => g === i && h === j))) return "묻는 거리가 그림에 있음";
    const want = meta.ask.map((span) => `${spanName(span)}=${length(span)}cm`).join(", ");
    return problem.answer === want ? "" : "답이 다름";
  }
  if (meta.family === "b3s-crypt-relation") {
    if (countRelationSolutions(meta.relation, meta.pattern, meta.count, meta.sumTokens) !== 1) return "답이 하나가 아님";
    const d = meta.digits;
    if (d.B !== d.A * RELATIONS[meta.relation].times) return "관계식이 맞지 않음";
    const addend = meta.pattern.split("").reduce((total, letter) => total * 10 + d[letter], 0);
    if (addend * meta.count !== meta.sumTokens.reduce((total, letter) => total * 10 + d[letter], 0)) return "세로셈이 맞지 않음";
    if (problem.answer !== String(d[meta.askLetter])) return "답이 다름";
    return "";
  }
  return `모르는 꼴 ${meta.family}`;
}

function insideConvex(poly, [px, py]) {
  let sign = 0;
  for (let k = 0; k < poly.length; k += 1) {
    const [ax, ay] = poly[k]; const [bx, by] = poly[(k + 1) % poly.length];
    const c = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
    if (Math.abs(c) < 1e-12) return false;
    if (!sign) sign = Math.sign(c); else if (Math.sign(c) !== sign) return false;
  }
  return true;
}

// 칸이 모두 모양과 크기가 같은지 — 넓이와 변 길이(작은 것부터)가 같으면 같은 모양으로 본다.
function congruentCells(cells) {
  const sig = (cell) => cell.map((v, k) => Math.hypot(cell[(k + 1) % cell.length][0] - v[0], cell[(k + 1) % cell.length][1] - v[1])).sort((a, b) => a - b);
  const first = sig(cells[0]); const area0 = areaOf(cells[0]);
  for (const cell of cells) {
    if (Math.abs(areaOf(cell) - area0) > 1e-3) return "칸 넓이가 다름";
    const s = sig(cell);
    if (s.length !== first.length || s.some((value, index) => Math.abs(value - first[index]) > 1e-3)) return "칸 모양이 다름";
  }
  return "";
}

function checkPartition(meta, answer) {
  const why = congruentCells(meta.cells);
  if (why) return why;
  const seen = meta.pieces.flat();
  if (seen.length !== meta.cells.length || new Set(seen).size !== meta.cells.length) return "조각이 칸을 한 번씩 덮지 않음";
  if (!meta.pieces.some((piece) => piece.length === 1) || !meta.pieces.some((piece) => piece.length > 1)) return "가장 작은 조각·합친 조각이 함께 있지 않음";
  if (meta.pieces.some((piece) => !isConvexUnion(meta.cells, piece))) return "볼록하지 않은 조각";
  const shaded = new Set(meta.shaded);
  if (meta.pieces.some((piece) => piece.some((cell) => shaded.has(cell)) && !piece.every((cell) => shaded.has(cell)))) return "색칠이 조각 단위가 아님";
  const totalArea = meta.cells.reduce((sum, cell) => sum + areaOf(cell), 0);
  const shadedArea = meta.shaded.reduce((sum, cell) => sum + areaOf(meta.cells[cell]), 0);
  const [top, bottom] = String(answer).split("/").map(Number);
  if (bottom !== meta.cells.length || Math.abs(top / bottom - shadedArea / totalArea) > 1e-6) return "넓이 비와 답이 다름";
  if (top <= 0 || top >= bottom) return "색칠한 부분이 비었거나 전체";
  if (meta.square) {
    const hull = hullPoints(meta.shaded.flatMap((cell) => meta.cells[cell]));
    const sides = hull.map((p, k) => Math.hypot(hull[(k + 1) % hull.length][0] - p[0], hull[(k + 1) % hull.length][1] - p[1]));
    if (hull.length !== 4 || sides.some((side) => Math.abs(side - sides[0]) > 1e-4) || Math.abs(areaOf(hull) - sides[0] ** 2) > 1e-4) return "색칠한 조각이 정사각형이 아님";
  }
  return "";
}
