// 1과정 3권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK03_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK03_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK03_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK03_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//   verifyBook03Structure(problem) — 검사기(book03-audit.mjs)가 부르는 독립 검산(다시 풀어 답이 하나인지 본다)

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
  b3sRingOtherSum: ringOtherSum
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
  magicRow("ring-other-sum-b3", "오각진의 세 수 합을 정해진 합으로 맞추기", "b3sRingOtherSum", ["오각진", "합 19"])
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
  "ring-other-sum-b3": "꼭짓점 다섯 수의 합은 (한 줄의 합) × 5 − 55입니다. 두 수를 아는 줄부터 빼서 채웁니다."
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
  ["book-03", 4, "practice", 1, [15], "ring-other-sum-b3"]
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
  return `모르는 꼴 ${meta.family}`;
}
