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
  b3sCryptThreeTwoFour: cryptGenerator("three-two-four", { ask: "one", measure: letterCount })
};

const cryptRow = (id, label, generator, aliases = []) => ({
  id, domain: "number", middle: "복면산", label, generator,
  catalogGroup: "복면산", catalogStrategy: "받아올림 따라가기",
  searchAliases: ["복면산", "모양 덧셈", ...aliases]
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
  cryptRow("crypt-three-two-four-b3", "모두 모양인 세 자리 + 두 자리 = 네 자리", "b3sCryptThreeTwoFour", ["네 자리 결과"])
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
  "crypt-three-two-four-b3": "네 자리가 되었으니 맨 앞은 1, 세 자리 수의 백의 자리는 9입니다. 그다음 일의 자리부터 맞춥니다."
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
  ["book-03", 3, "advanced", 1, [3], "crypt-two-one-two-b3"]
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
  return `모르는 꼴 ${meta.family}`;
}
