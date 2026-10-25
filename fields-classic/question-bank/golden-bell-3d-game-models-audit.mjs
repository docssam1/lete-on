// 3D 게임(9권 쌓기나무·마방진)과 「유형별 예제」 규칙 검사 (2026-10-22) — 브라우저 없이.
//
// 1) 9권 게임: 레벨 1~13 × 여러 판을 만들어, 화면 코드와 따로 쓴 방법으로 답을 다시 구한다.
//    쌓기나무 — 0~5층 전수 대입으로 위·앞·옆 모양이 같은 쌓기를 모두 세어 가장 적은·많은 수를 맞춘다.
//    마방진   — 3칸은 (가운데, a, b) 전수 대입으로 보이는 수와 맞는 마방진을 모두 찾아 빈칸이 하나로 정해지는지,
//               4칸은 줄 방정식을 분수로 소거해 빈칸이 하나로 정해지는지 본다. 카드에 정답이 다 있는지도.
//    원본 그림(공개 visual)과 같은 판은 나오지 않는지(avoid).
// 2) 유형별 예제: 켜진 레슨의 모든 유형에 예제가 1~2개 있는지, 예제 답을 따로 다시 구해 맞는지,
//    원본 문항의 그림·수와 겹치지 않는지, 아이 말(각도·분수 말 없음)·회사 이름이 없는지.
// 3) 정답 보호: 새 파일이 비공개 답안·answerRef를 읽거나 쓰지 않는지.
//
// 실행: node fields-classic/question-bank/golden-bell-3d-game-models-audit.mjs

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { HANDS_ON_ACTIVITIES } from "./golden-bell-hands-on-models.js";
import { CUBES, MAGIC, cubeSignature, magicSignature, checkCubes, checkMagic, magicSquare3 } from "./golden-bell-book09-game-models.js";
import { TYPE_EXAMPLE_SETS, typeExampleGroups } from "./golden-bell-type-examples.js";
import { LESSON_FLOWS } from "./golden-bell-lesson-flow.js";

const here = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));
const lessonOf = (key) => { const [bookId, lessonId] = key.split("/"); return GOLDEN_BELL_BOOKS.find((b) => b.id === bookId).lessons.find((l) => l.id === lessonId); };
const book9 = GOLDEN_BELL_BOOKS.find((b) => b.id === "book-09");

// ───── 따로 쓴 계산 ─────
const viewsOf = (h) => {
  const rows = h.length, cols = h[0].length, front = [], side = [];
  for (let c = 0; c < cols; c++) { let m = 0; for (let r = 0; r < rows; r++) m = Math.max(m, h[r][c]); front.push(m); }
  for (let i = 0; i < rows; i++) side.push(Math.max(...h[rows - 1 - i]));
  return JSON.stringify({ top: h.map((row) => row.map((x) => (x ? 1 : 0))), front, side });
};
function bruteCubes(views) {
  const rows = views.top.length, cols = views.top[0].length, want = JSON.stringify({ top: views.top, front: views.front, side: views.side });
  const h = Array.from({ length: rows }, () => Array(cols).fill(0)), cells = [];
  views.top.forEach((row, r) => row.forEach((on, c) => { if (on) cells.push([r, c]); }));
  const top = Math.max(...views.front, ...views.side);
  let count = 0, min = Infinity, max = -Infinity;
  const rec = (k) => {
    if (k === cells.length) { if (viewsOf(h) === want) { const t = h.flat().reduce((a, b) => a + b, 0); count++; min = Math.min(min, t); max = Math.max(max, t); } return; }
    const [r, c] = cells[k];
    for (let v = 1; v <= top; v++) { h[r][c] = v; rec(k + 1); }
    h[r][c] = 0;
  };
  rec(0);
  return { count, min, max };
}
const LINES = (n) => {
  const out = [];
  for (let i = 0; i < n; i++) { out.push([...Array(n).keys()].map((j) => i * n + j)); out.push([...Array(n).keys()].map((j) => j * n + i)); }
  out.push([...Array(n).keys()].map((j) => j * n + j)); out.push([...Array(n).keys()].map((j) => j * n + n - 1 - j));
  return out;
};
const magicSum = (n, v) => { const s = LINES(n).map((l) => l.reduce((a, i) => a + v[i], 0)); return s.every((x) => x === s[0]) ? s[0] : null; };
// 3칸: 보이는 수와 맞는 모든 마방진(1~60)을 찾아 칸마다 가능한 값 모음.
function brute3(shown, sum = null) {
  const options = shown.map(() => new Set());
  let found = 0;
  for (let c = 1; c <= 40; c++) for (let a = -39; a <= 39; a++) for (let b = -39; b <= 39; b++) {
    const v = [c + a, c - a - b, c + b, c - a + b, c, c + a - b, c - b, c + a + b, c - a];
    if (v.some((x) => x < 1 || x > 60)) continue;
    if (sum !== null && 3 * c !== sum) continue;
    if (shown.some((s, i) => typeof s === "number" && s !== v[i])) continue;
    found++;
    v.forEach((x, i) => options[i].add(x));
  }
  return { found, options };
}
// 4칸 이상: 줄 방정식(모든 줄 = S)을 분수로 소거해, 칸 하나가 정해지는지(그 칸의 단위벡터가 행공간에 있는지) 본다.
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
function determined(n, shown, cell, sum = null) {
  const unknown = shown.map((v, i) => (typeof v === "number" ? -1 : i)).filter((i) => i >= 0);
  const vars = [...unknown, "S"], col = (x) => vars.indexOf(x);
  const rows = [];
  for (const line of LINES(n)) {
    const row = Array(vars.length + 1).fill(0n);
    let rhs = 0n;
    for (const i of line) { if (typeof shown[i] === "number") rhs -= BigInt(shown[i]); else row[col(i)] += 1n; }
    if (sum !== null) rhs += BigInt(sum); else row[col("S")] -= 1n;
    row[vars.length] = rhs;
    rows.push(row);
  }
  const rank = (m) => {
    m = m.map((r) => [...r]);
    let rk = 0;
    for (let c = 0; c < vars.length && rk < m.length; c++) {
      const p = m.findIndex((r, i) => i >= rk && r[c] !== 0n);
      if (p < 0) continue;
      [m[rk], m[p]] = [m[p], m[rk]];
      for (let i = 0; i < m.length; i++) if (i !== rk && m[i][c] !== 0n) {
        const f = m[i][c], g = m[rk][c];
        m[i] = m[i].map((x, j) => x * g - m[rk][j] * f);
        const d = m[i].reduce((acc, x) => gcd(acc, x), 0n) || 1n;
        m[i] = m[i].map((x) => x / d);
      }
      rk++;
    }
    return rk;
  };
  const coeff = rows.map((r) => r.slice(0, vars.length));
  const unit = vars.map((x) => (x === cell ? 1n : 0n));
  return rank(coeff) === rank([...coeff, unit]);
}

// ───── 1) 9권 게임 ─────
const sourceCube = new Set(), sourceMagic = new Set();
for (const lesson of book9.lessons) for (const item of lesson.original.items) {
  if (item.visual?.subtype === "cube-three-views") sourceCube.add(cubeSignature(item.visual));
  if (item.visual?.subtype === "magic-grid") sourceMagic.add(magicSignature(item.visual.size, item.visual.shown));
}
assert.ok(sourceCube.size >= 10 && sourceMagic.size >= 15, "원본 그림 서명을 모았다");
for (const s of sourceCube) CUBES.avoid.add(s);
for (const s of sourceMagic) MAGIC.avoid.add(s);
let cubeProblems = 0, magicProblems = 0;
for (let level = 1; level <= 13; level++) for (let seed = 1; seed <= 12; seed++) {
  for (const p of CUBES.build(level, { seed })) {
    cubeProblems++;
    const b = bruteCubes(p.views);
    assert.equal(b.min, p.min, `쌓기 L${level}: 가장 적은 수`);
    assert.equal(b.max, p.max, `쌓기 L${level}: 가장 많은 수`);
    assert.equal(p.kind === "exact", b.min === b.max, `쌓기 L${level}: ${p.kind} 종류와 개수가 맞음`);
    assert.equal(p.answer, p.kind === "max" ? b.max : b.min);
    assert.ok(checkCubes(p, p.answerMap).correct, "정답 쌓기를 받아 준다");
    assert.equal(viewsOf(p.answerMap), JSON.stringify(p.views));
    assert.ok(!sourceCube.has(cubeSignature(p.views)), "원본 그림과 같은 판이 나오지 않음");
    // 틀린 쌓기: 정답에 한 층을 더하면 모양이 바뀌거나(그대로·많이) 개수가 달라진다(적게) — 어느 쪽이든 틀림.
    for (let r = 0; r < p.rows; r++) for (let c = 0; c < p.cols; c++) if (p.answerMap[r][c]) {
      const wrong = p.answerMap.map((row) => [...row]);
      wrong[r][c] += 1;
      assert.equal(checkCubes(p, wrong).correct, false, `쌓기 L${level}: 한 층 더 쌓은 것은 틀림`);
    }
  }
  for (const p of MAGIC.build(level, { seed })) {
    magicProblems++;
    assert.equal(magicSum(p.n, p.full), p.sum, `마방진 L${level}: 판이 마방진`);
    assert.equal(new Set(p.full).size, p.n * p.n, "칸마다 다른 수");
    assert.ok(p.blanks.every((i) => p.shown[i] === null) && p.shown.every((v, i) => v === null || v === p.full[i]));
    if (p.n === 3) {
      const { found, options } = brute3(p.shown, p.sumShown ? p.sum : null);
      assert.ok(found >= 1);
      for (const i of p.blanks) assert.deepEqual([...options[i]], [p.full[i]], `마방진 L${level}: 빈칸 ${i}가 하나로 정해짐`);
    } else for (const i of p.blanks) assert.ok(determined(p.n, p.shown, i, p.sumShown ? p.sum : null), `4칸 L${level}: 빈칸 ${i}가 정해짐`);
    const spec = level <= MAGIC.levels.length ? MAGIC.levels[level - 1] : MAGIC.endless(level);
    assert.equal(p.cards.length, p.blanks.length + (spec.decoys ?? 0), `마방진 L${level}: 카드 수 = 빈칸 + 덤`);
    assert.ok(p.cards.filter((v) => !p.blanks.some((i) => p.full[i] === v)).every((v) => !p.full.includes(v)), "덤 카드는 판에 없는 수");
    const pool = [...p.cards];
    for (const i of p.blanks) { const k = pool.indexOf(p.full[i]); assert.ok(k >= 0, "카드에 정답 수가 있다"); pool.splice(k, 1); }
    assert.ok(checkMagic(p, p.full).correct);
    if (p.blanks.length >= 2 && p.full[p.blanks[0]] !== p.full[p.blanks[1]]) {
      const swapped = [...p.full]; [swapped[p.blanks[0]], swapped[p.blanks[1]]] = [swapped[p.blanks[1]], swapped[p.blanks[0]]];
      assert.equal(checkMagic(p, swapped).correct, magicSum(p.n, swapped) !== null && (!p.sumShown || magicSum(p.n, swapped) === p.sum));
    }
    assert.ok(!sourceMagic.has(magicSignature(p.n, p.shown)), "원본 그림과 같은 판이 나오지 않음");
  }
}
for (const g of [CUBES, MAGIC]) {
  assert.equal(g.levels.length, 10);
  assert.deepEqual([11, 12, 20, 30].map((l) => g.build(l, { seed: 5 }).length), [12, 14, 30, 30], `${g.id} 끝없는 도전 문제 수`);
}
console.log(`GOLDEN_BELL_3D_GAME_MODELS_OK cubes=${cubeProblems} magic=${magicProblems} levels=13`);

// ───── 2) 유형별 예제 ─────
const ANGLE_FRACTION = /[°¼½¾]|(?:90|180|270|360)\s*도|\d\s*\/\s*\d/u;
const BRAND = /\bFC\b|필즈|FIELDS CLASSIC|Fields Classic/u;
const allText = (ex) => [ex.problem, ex.answer, ...ex.steps.map((s) => s.text)];
let exampleCount = 0;
for (const [key, flow] of Object.entries(LESSON_FLOWS)) {
  const lesson = lessonOf(key);
  assert.ok(lesson, `${key}: 레슨이 있다`);
  assert.ok(TYPE_EXAMPLE_SETS[flow.examples], `${key}: 예제 묶음`);
  const groups = typeExampleGroups(lesson, flow.examples);
  assert.equal(groups.reduce((s, g) => s + g.count, 0), lesson.original.items.length, `${key}: 원본 문항이 모두 유형에 들어감`);
  for (const group of groups) {
    assert.ok(group.examples.length >= 1 && group.examples.length <= 2, `${key} 「${group.typeLabel}」: 예제 1~2개`);
    for (const ex of group.examples) {
      exampleCount++;
      for (const t of allText(ex)) { assert.doesNotMatch(t, ANGLE_FRACTION, `${ex.id}: 각도·분수 말 — ${t}`); assert.doesNotMatch(t, BRAND, `${ex.id}: 회사 이름`); assert.doesNotMatch(t, /undefined|NaN|null/u, `${ex.id}: ${t}`); }
      assert.ok(ex.steps.length >= 2, `${ex.id}: 단계가 둘 이상`);
      assert.ok(ex.steps.every((s, i) => i === ex.steps.length - 1 || !s.text.includes(ex.answer)), `${ex.id}: 답 문장이 마지막 전에 그대로 나오지 않음`);
      verifyExample(flow.examples, group.typeLabel, ex, lesson);
    }
  }
}
function verifyExample(setId, typeLabel, ex, lesson) {
  const v = ex.value;
  if (setId === "b9-cube-min-max") {
    const views = ex.figure.views, b = bruteCubes(views);
    if (typeLabel === "세 방향 모양으로 개수") { assert.equal(b.min, b.max, `${ex.id}: 개수가 하나로 정해짐`); assert.equal(v.count, b.min); }
    else { assert.ok(b.min < b.max, `${ex.id}: 적을 때와 많을 때가 다름`); assert.equal(v.min, b.min); assert.equal(v.max, b.max); }
    for (const item of lesson.original.items) assert.notEqual(cubeSignature(views), cubeSignature(item.visual), `${ex.id}: 원본 그림과 같음`);
  } else if (setId === "b9-magic") {
    const n = ex.figure.n, cells = ex.figure.cells;
    const shown = cells.map((c) => (c.v === null ? null : c.v));
    // 「A + B」 예제는 판을 다 채우지 않는다(두 수의 합만 구한다). 나머지 유형은 마지막 그림이 다 채운 마방진.
    const pairType = typeLabel === "가운데 수로 A + B";
    const full = ex.steps.at(-1).figure.cells.map((c) => c.v);
    assert.equal(full.length, n * n);
    const S = pairType ? v.sum : magicSum(n, full);
    assert.ok(S !== null, `${ex.id}: 마지막 그림이 마방진`);
    const labels = Object.fromEntries(cells.map((c, i) => [c.label, i]).filter(([l]) => l));
    if (n === 3) {
      const { options } = brute3(shown);
      for (const [label, i] of Object.entries(labels)) {
        if (typeLabel === "가운데 수로 A + B") continue;
        assert.deepEqual([...options[i]], [full[i]], `${ex.id}: ${label}가 하나로 정해짐`);
        assert.equal(v[label], full[i]);
      }
      if (typeLabel === "가운데 수로 A + B") {
        const sums = new Set();
        for (let c = 1; c <= 40; c++) for (let a = -39; a <= 39; a++) for (let b = -39; b <= 39; b++) {
          const w = magicSquare3(c, a, b);
          if (w.some((x) => x < 1 || x > 60) || shown.some((s, i) => s !== null && s !== w[i])) continue;
          sums.add(w[labels.A] + w[labels.B]);
        }
        assert.deepEqual([...sums], [v.pair], `${ex.id}: A + B가 하나로 정해짐`);
      }
    } else for (const [label, i] of Object.entries(labels)) { assert.ok(determined(n, shown, i), `${ex.id}: ${label}가 정해짐`); assert.equal(v[label], full[i]); }
    if (v.sum !== undefined && !pairType) assert.equal(v.sum, S);
    if (pairType) assert.equal(v.sum, 3 * shown[4], `${ex.id}: 한 줄의 합 = 가운데 수를 세 번 더한 수`);
    if (typeLabel === "한 줄의 합과 빈칸") assert.ok(ex.steps.some((s) => /수가 다 보여요/u.test(s.text)), `${ex.id}: 한 줄의 합을 먼저 구함`);
    if (typeLabel === "가운데 수로 빈칸") assert.ok(ex.steps.some((s) => /가운데 수(?: \S+)?[은는] \d+/u.test(s.text)), `${ex.id}: 가운데 수로 구함`);
    if (/겹치는 칸/u.test(typeLabel)) assert.ok(ex.steps.some((s) => /같이 써요/u.test(s.text)), `${ex.id}: 겹치는 칸으로 구함`);
    if (typeLabel === "먼저 구할 칸 찾기") {
      // 먼저 구할 칸: 처음 보이는 수만으로 한 걸음에 구할 수 있는 칸. 다른 칸은 한 걸음에 안 된다.
      const oneStep = (i) => {
        const known = (j) => shown[j] !== null;
        const sumKnown = LINES(n).some((l) => l.every(known)) || (n === 3 && known(4));
        const viaLine = sumKnown && LINES(n).some((l) => l.includes(i) && l.filter((j) => !known(j)).length === 1);
        const viaPair = n === 3 && i === 4 && [0, 1, 2, 3].some((j) => known(j) && known(8 - j));
        return viaLine || viaPair;
      };
      const firstCell = labels[v.first], other = Object.entries(labels).find(([l]) => l !== v.first)[1];
      assert.ok(oneStep(firstCell) && !oneStep(other), `${ex.id}: 먼저 구할 칸이 ${v.first}`);
    }
    for (const item of lesson.original.items) {
      if (item.visual?.subtype !== "magic-grid") continue;
      assert.notEqual(magicSignature(n, shown), magicSignature(item.visual.size, item.visual.shown), `${ex.id}: 원본 그림과 같음`);
      const a = shown.filter((x) => x !== null).sort((x, y) => x - y).join(), b = item.visual.shown.filter((x) => typeof x === "number").sort((x, y) => x - y).join();
      assert.ok(!(item.visual.size === n && a === b), `${ex.id}: 원본과 같은 수 묶음`);
    }
  } else if (setId === "b1-clock") {
    const { start, quarters, end } = v;
    let at = start; for (let k = 0; k < Math.abs(quarters) * 3; k++) at = quarters > 0 ? at % 12 + 1 : (at + 10) % 12 + 1;
    assert.equal(end, at, `${ex.id}: 도착한 수`);
    assert.ok(/반대/u.test(typeLabel) === quarters < 0, `${ex.id}: 방향이 유형과 맞음`);
    const authored = HANDS_ON_ACTIVITIES["turn-clock"].rounds.map((r) => `${r.start}:${r.turns}`);
    assert.ok(!authored.includes(`${start}:${quarters}`) && start !== lesson.experience?.start, `${ex.id}: 체험·개념 장면과 다른 출발점`);
  } else if (setId === "b2-balance") {
    const scales = ex.figure.scales;
    const items = [...new Set(scales.flatMap((s) => [...s.left, ...s.right]))];
    // 1~9g 전수 대입: 저울을 모두 만족하는 무게마다 답이 같은지.
    const fits = [];
    const w = {};
    const rec = (k) => {
      if (k === items.length) {
        const ok = scales.every((s) => { const L = s.left.reduce((a, t) => a + w[t], 0), R = s.right.reduce((a, t) => a + w[t], 0); return s.heavy === "left" ? L > R : s.heavy === "right" ? R > L : L === R; });
        if (ok) fits.push({ ...w });
        return;
      }
      for (let x = 1; x <= 9; x++) { w[items[k]] = x; rec(k + 1); }
    };
    rec(0);
    assert.ok(fits.length > 0, `${ex.id}: 저울을 만족하는 무게가 있음`);
    const heavier = (a, b) => fits.every((f) => f[a] > f[b]);
    if (/바꾸어 넣기/u.test(typeLabel)) {
      // 묻는 것은 마지막 저울 왼쪽의 물건. 알려 준 무게를 넣으면 그 무게가 하나로 정해져야 한다.
      const known = ex.figure.weights, asked = scales.at(-1).left[0];
      const ok = fits.filter((f) => Object.entries(known).every(([k, x]) => f[k] === x));
      assert.ok(ok.length >= 1 && ok.every((f) => f[asked] === v), `${ex.id}: 바꾸어 넣은 무게 ${v}g이 하나로 정해짐`);
    } else if (Array.isArray(v) && /순으로/u.test(typeLabel)) {
      assert.equal(v.length, items.length);
      for (let i = 0; i + 1 < v.length; i++) assert.ok(heavier(v[i], v[i + 1]), `${ex.id}: 순서`);
    } else if (Array.isArray(v)) {
      // 「○보다 가벼운(무거운) 것 모두」: 남은 하나가 기준, 답에 든 것은 모두 기준보다 가볍고(무겁고), 빠진 것은 없다.
      const rest = items.filter((t) => !v.includes(t));
      assert.equal(rest.length, 1, `${ex.id}: 기준 물건 하나`);
      assert.ok(v.every((x) => (/가벼운/u.test(typeLabel) ? heavier(rest[0], x) : heavier(x, rest[0]))), `${ex.id}: 모두 찾기 답`);
    } else if (/가장 가벼운/u.test(typeLabel)) assert.ok(items.every((t) => t === v || heavier(t, v)), `${ex.id}: 가장 가벼운 것`);
    else assert.ok(items.every((t) => t === v || heavier(v, t)), `${ex.id}: 더 무거운 것`);
    for (const item of lesson.original.items) assert.notEqual(JSON.stringify(scales.map((s) => [s.left, s.right, s.heavy])), JSON.stringify((item.visual?.scales || []).map((s) => [s.left, s.right, s.heavier])), `${ex.id}: 원본 저울과 같음`);
  } else if (setId === "bundle-equations") {
    // □에 답을 넣어 식의 양쪽을 다시 계산한다. 묶음 수(유형 이름의 N)는 문제 식에 그 수가 쓰여 있어야 하고, 원본 식과 같으면 안 된다.
    const row = ex.figure.rows[0];
    const expr = row.items.map((it) => (typeof it === "string" ? it : it.v)).join("").replace(/\s+/gu, "");
    const calc = (side) => Function(`return (${side.replaceAll("□", `(${v})`).replaceAll("×", "*").replaceAll("−", "-")})`)();
    const [left, right] = expr.split("=");
    assert.ok(Number.isInteger(v) && v > 0, `${ex.id}: 답이 자연수`);
    assert.equal(calc(left), calc(right), `${ex.id}: ${expr}에 □=${v}을 넣으면 양쪽이 같음`);
    const base = Number(typeLabel.match(/^(\d+)의 배수/u)?.[1]);
    assert.ok(base && expr.includes(String(base)), `${ex.id}: ${base}의 묶음 식`);
    const norm = (t) => String(t || "").replace(/\s+/gu, "").replaceAll("?", "□").replaceAll("-", "−");
    for (const item of lesson.original.items) assert.notEqual(norm(expr), norm(item.visual?.expression), `${ex.id}: 원본 식과 같음`);
    // 마지막 그림은 □ 자리에 계산한 수(또는 같은 묶음 식)를 놓고 확인 색이다
    assert.equal(ex.steps.at(-1).figure.rows.at(-1).tone, "check", `${ex.id}: 마지막 그림이 확인 색`);
  } else if (setId === "consecutive") {
    // 답을 하나하나 더하거나 늘어놓아 다시 구한다. 원본의 수 범위(식 글자·그림 자료)와 같은 예제는 쓰지 않는다.
    const f = ex.figure;
    if (f.mode === "order") {
      const odd = f.odd, list = Array.from({ length: 200 }, (_, i) => (odd ? 2 * i + 1 : 2 * i + 2));
      const k = ex.steps.at(-1).figure.k, at = ex.steps.at(-1).figure.v;
      assert.equal(list[k - 1], at, `${ex.id}: ${k}번째 ${odd ? "홀수" : "짝수"}`);
      assert.equal(v, /순서/u.test(typeLabel) ? k : at, `${ex.id}: 답`);
      assert.ok(/홀수/u.test(typeLabel) === odd, `${ex.id}: 유형과 홀짝이 맞음`);
      assert.ok(k > 10, `${ex.id}: 원본(10번째까지)과 다른 번째`);
    } else {
      const nums = Array.from({ length: f.to - f.from + 1 }, (_, i) => f.from + i), total = nums.reduce((a, b) => a + b, 0);
      if (/개수/u.test(typeLabel)) assert.equal(v, nums.length, `${ex.id}: 수의 개수`);
      else if (/가운데 수 찾기/u.test(typeLabel)) { assert.equal(nums.length % 2, 1); assert.deepEqual(v, { middle: nums[(nums.length - 1) / 2], sum: total }, `${ex.id}: 가운데 수와 합`); }
      else { assert.equal(v, total, `${ex.id}: 합`); assert.equal(nums.length % 2, /짝수 개|1부터|중간부터/u.test(typeLabel) ? 0 : 1, `${ex.id}: 짝수 개·홀수 개가 유형과 맞음`); }
      const norm = (t) => String(t || "").replace(/\s+/gu, "");
      const mine = [norm(ex.problem.split("의 합")[0].split("에서")[0]), `${f.from}~${f.to}`];
      for (const item of lesson.original.items) {
        const vis = item.visual || {};
        assert.ok(!mine.includes(norm(vis.expression)), `${ex.id}: 원본 식과 같음`);
        assert.ok(!JSON.stringify(vis).includes(`[${f.from},${f.to}]`), `${ex.id}: 원본 그림과 같은 범위`);
      }
    }
  } else if (setId === "sum-multiple") {
    // 동그라미 하나의 값을 1~300에서 모두 대입해 조건에 맞는 값이 하나뿐인지, 그 값으로 낸 답이 같은지 본다.
    if (ex.figure.kind === "shape-eq" || typeLabel === "합과 차의 식") {
      const [[, , , , S], [, , , , D]] = ex.steps[0].figure.lines;
      const fits = [];
      for (let c = 0; c <= 200; c++) for (let t = 0; t <= 200; t++) if (c + t === S && c - t === D) fits.push([c, t]);
      assert.deepEqual(fits, [[v.circle, v.triangle]], `${ex.id}: ○·△가 하나로 정해짐`);
    } else {
      const f = ex.steps.find((st) => st.figure?.kind === "circles").figure, [rA, rB] = f.rows;
      const extra = rB.extra ? Number(rB.extra.replace("−", "-").replace(/\s+/gu, "")) : 0;
      const fits = [];
      for (let u = 1; u <= 300; u++) {
        const A = rA.n * u, B = rB.n * u + extra;
        if (B > 0 && (f.sum !== undefined ? A + B === f.sum : B - A === f.diff)) fits.push({ A, B });
      }
      assert.equal(fits.length, 1, `${ex.id}: 동그라미 하나의 값이 하나로 정해짐`);
      assert.equal(fits[0].A, v.A, `${ex.id}: A`); assert.equal(fits[0].B, v.B, `${ex.id}: B`);
      if (/배수|배보다/u.test(typeLabel)) assert.ok(rB.n > 1, `${ex.id}: 몇 배`); else assert.ok(rA.n === 1 && rB.n === 1 && extra > 0, `${ex.id}: 합차는 한 개씩 + 차`);
      if (/^몇 배보다 많은 수/u.test(typeLabel)) assert.ok(extra > 0, `${ex.id}: 몇 배보다 많음`);
      if (/^몇 배보다 적은 수/u.test(typeLabel)) assert.ok(extra < 0, `${ex.id}: 몇 배보다 적음`);
      if (/차와 배수/u.test(typeLabel)) assert.ok(f.diff !== undefined, `${ex.id}: 차가 주어짐`);
      if (/문장제|주고 받아/u.test(typeLabel)) {
        // 글에 쓴 합·차·몇 배·더 많은(적은) 수가 그림과 같아야 한다(글을 손으로 고치다 어긋나는 것을 막는다)
        const nums = (ex.problem.match(/\d+/gu) || []).map(Number);
        assert.ok(nums.includes(f.sum ?? f.diff), `${ex.id}: 글의 합·차`);
        if (rB.n > 1) assert.ok(nums.includes(rB.n), `${ex.id}: 글의 몇 배`);
        if (extra && !/주고 받아/u.test(typeLabel)) assert.ok(nums.includes(Math.abs(extra)), `${ex.id}: 글의 더 많은(적은) 수`);
        if (/주고 받아/u.test(typeLabel)) assert.ok(nums.includes(extra / 2), `${ex.id}: 글의 준 개수`);
        assert.ok(v.asked === v.A || v.asked === v.B, `${ex.id}: 물은 답`);
      }
      for (const item of lesson.original.items) {
        const o = item.visual || {};
        if (o.subtype !== "source-sumdiff") continue;
        const same = JSON.stringify(o.rows?.map((r) => [r.n, r.extra || ""])) === JSON.stringify(f.rows.map((r) => [r.n, (r.extra || "").replace("−", "-")])) && ((f.sum !== undefined && o.sum === f.sum) || (f.diff !== undefined && o.diff?.value === f.diff));
        assert.ok(!same, `${ex.id}: 원본 그림과 같음`);
      }
    }
    for (const item of lesson.original.items) assert.ok(!item.prompt.includes(ex.problem), `${ex.id}: 원본 문장과 같음`);
  } else if (setId === "time") {
    if (ex.figure.kind === "bundle") {
      // 단위 바꾸기: 큰 단위 하나가 작은 단위 몇인지는 정해진 값(1일 = 24시간 …)이다
      const K = { 일: 24, 시간: 60, 분: 60, 주일: 7, 년: 12 };
      assert.equal(v.k, K[v.big], `${ex.id}: 1${v.big} = ${K[v.big]}${v.small}`);
      assert.ok(v.rest >= 0 && v.rest < v.k, `${ex.id}: 남는 수가 한 단위보다 작음`);
      assert.equal(v.total, v.n * v.k + v.rest, `${ex.id}: 바꾼 값`);
      const lhs = ex.problem.split(" = ")[0].replace(/\s+/gu, "");
      for (const item of lesson.original.items) {
        const toks = (item.visual?.tokens || []).filter((t) => t !== null);
        assert.notEqual(lhs, String(toks[0] || "") + (toks[1] && toks[1] !== "=" ? toks[1] : ""), `${ex.id}: 원본 식과 같음`);
      }
      if (/주일|개월/u.test(typeLabel)) assert.ok(["주일", "년"].includes(v.big), `${ex.id}: 주일·개월 유형`);
      else assert.ok(["일", "시간", "분"].includes(v.big), `${ex.id}: 시간 단위 유형`);
    } else {
      const [t, b] = ex.figure.rows, at24 = (r) => r.h + (r.pre === "오후" && r.h !== 12 ? 12 : 0);
      for (const r of ex.figure.rows) assert.ok(r.m >= 0 && r.m < 60 && r.h >= 0 && r.h <= 12, `${ex.id}: 시·분 범위`);
      const minutes = ex.figure.op === "+" ? at24(t) * 60 + t.m + b.h * 60 + b.m : at24(t) * 60 + t.m - (at24(b) * 60 + b.m);
      assert.ok(minutes > 0 && minutes < 24 * 60, `${ex.id}: 하루 안의 시간`);
      assert.equal(v.minutes, minutes, `${ex.id}: 답을 분으로 다시 계산`);
      if (ex.figure.op === "−") assert.ok(/시간 \d+분이에요/u.test(ex.answer), `${ex.id}: 걸린 시간 답`);
      if (typeLabel === "오후 − 오전") assert.ok(t.pre === "오후" && b.pre === "오전", `${ex.id}: 오후 − 오전`);
      const nums = (ex.problem.match(/\d+/gu) || []).map(Number);
      for (const r of ex.figure.rows) assert.ok(nums.includes(r.h) && nums.includes(r.m), `${ex.id}: 문제 글에 그림의 수`);
      const sig = (rows) => JSON.stringify(rows.map((r) => [r.pre || "", Number(r.h), Number(r.m)]));
      for (const item of lesson.original.items) {
        const rows = item.visual?.rows;
        if (rows) assert.notEqual(sig(ex.figure.rows), sig(rows.map((r) => ({ pre: /오후/u.test(r.pre) ? "오후" : /오전/u.test(r.pre) ? "오전" : "", h: r.h, m: r.m }))), `${ex.id}: 원본 세로셈과 같음`);
        assert.ok(!item.prompt.includes(ex.problem), `${ex.id}: 원본 문장과 같음`);
      }
    }
  } else if (setId === "perimeter") {
    if (ex.figure.kind === "quad-gallery") {
      // 사각형의 성질(검사기가 따로 적은 표): 네 변이 같은 것 = 마름모·정사각형, 두 쌍이 평행한 것 = 사다리꼴만 빼고
      const truth = /네 변의 길이가 모두 같은/u.test(ex.problem) ? ["rhombus", "square"] : /두 쌍 모두 평행/u.test(ex.problem) ? ["para", "rhombus", "rect", "square"] : null;
      assert.ok(truth, `${ex.id}: 아는 조건`);
      assert.deepEqual([...v].sort(), [...truth].sort(), `${ex.id}: 고른 사각형`);
      for (const item of lesson.original.items) assert.notEqual(ex.problem, item.prompt, `${ex.id}: 원본 문장과 같음`);
    } else {
      const f0 = ex.figure, last = ex.steps.at(-1).figure, four = ["square", "rhombus"].includes(f0.shape);
      const num = (t) => Number(String(t).replace(/[^0-9]/gu, ""));
      if (/둘레$/u.test(typeLabel)) {
        const a = num(f0.top), b = four ? a : num(f0.right);
        assert.equal(v.P, four ? 4 * a : 2 * (a + b), `${ex.id}: 둘레`);
        assert.equal(num(last.inner), v.P, `${ex.id}: 마지막 그림의 둘레`);
      } else {
        const P = num(f0.inner);
        const known = four ? null : num(f0.top === "가" ? f0.right : f0.top);
        assert.equal(v.side, four ? P / 4 : P / 2 - known, `${ex.id}: 한 변`);
        assert.ok(Number.isInteger(v.side) && v.side > 0, `${ex.id}: 자연수 변`);
        assert.ok(f0.top === "가" || f0.right === "가", `${ex.id}: 처음 그림에 가`);
        assert.ok([last.top, last.right].includes(String(v.side)), `${ex.id}: 마지막 그림에 구한 변`);
      }
      const shapeOf = { "직사각형": "rect", "평행사변형": "para", "정사각형": "square", "마름모": "rhombus" }[typeLabel.replace(/의 (둘레|한 변)$/u, "")];
      if (shapeOf) assert.equal(f0.shape, shapeOf, `${ex.id}: 유형과 같은 모양`);
      const sig = (o) => JSON.stringify([o.shape, String(o.top ?? ""), String(o.right ?? o.side ?? ""), String(o.inner ?? "")]);
      for (const item of lesson.original.items) if (item.visual?.subtype === "source-quad") assert.notEqual(sig(f0), sig(item.visual), `${ex.id}: 원본 그림과 같음`);
    }
  } else if (setId === "planting") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    const k = { triangle: 3, square: 4 };
    // 다각형 둘레의 바둑돌: 변마다 n개를 놓고 꼭짓점이 겹치는 것을 지운 개수(점 자리로 센다)
    const stoneCount = (shape, n) => { const seen = new Set(); for (let s = 0; s < k[shape]; s++) for (let i = 0; i < n; i++) seen.add(i === n - 1 ? `c${(s + 1) % k[shape]}` : i === 0 ? `c${s}` : `${s}:${i}`); return seen.size; };
    const origNums = lesson.original.items.flatMap((item) => nums(item.prompt));
    if (/바둑돌/u.test(typeLabel)) {
      assert.equal(v.total, stoneCount(v.shape, v.n), `${ex.id}: 바둑돌 수`);
      if (/거꾸로/u.test(typeLabel)) { const ns = []; for (let n = 2; n < 100; n++) if (stoneCount(v.shape, n) === v.total) ns.push(n); assert.deepEqual(ns, [v.n], `${ex.id}: 한 변이 하나로 정해짐`); }
      else assert.equal(v.shape, /정삼각형/u.test(typeLabel) ? "triangle" : "square", `${ex.id}: 유형과 같은 모양`);
      const asked = /거꾸로/u.test(typeLabel) ? v.total : v.n;
      assert.ok(nums(ex.problem).includes(asked), `${ex.id}: 문제 글의 수`);
      for (const item of lesson.original.items) if (/바둑돌/u.test(item.prompt) && item.visual?.shape === v.shape) assert.ok(!nums(item.prompt).includes(asked), `${ex.id}: 원본과 같은 수`);
    } else if (/닫힌 도형/u.test(typeLabel)) {
      const f = ex.figure, P = f.shape === "rect" ? 2 * (f.w + f.h) : f.shape === "square" ? 4 * f.w : 3 * f.w;
      const spots = new Set(); for (let x = 0; x < P; x += f.gap) spots.add(x % P);   // 닫힌 둘레를 한 바퀴 돌며 나무 자리
      assert.equal(v.trees, spots.size, `${ex.id}: 나무 수`);
      const mine = JSON.stringify([f.shape, ...(f.shape === "rect" ? [f.w, f.h] : [f.w]), f.gap]);
      for (const item of lesson.original.items) if (item.visual?.subtype === "source-plot") assert.notEqual(mine, JSON.stringify([item.visual.shape, ...item.visual.lengths.map((l) => Number(l.replace("m", ""))), Number(item.visual.gap.replace("m", ""))]), `${ex.id}: 원본 땅과 같음`);
    } else {
      const lamps = v.C / v.gap;
      assert.ok(Number.isInteger(lamps) && lamps === v.lamps, `${ex.id}: 가로등 수 = 둘레 ÷ 간격`);
      if (v.between !== undefined && v.between) assert.ok(ex.problem.includes(`${v.between / v.lamps}개씩`), `${ex.id}: 사이마다 놓는 수`);
      // 호수 둘레는 둘레와 간격이 글에 있고, 둘레 거꾸로는 간격만 있다(둘레가 답)
      for (const n of /둘레 거꾸로/u.test(typeLabel) ? [v.gap] : [v.C, v.gap]) assert.ok(nums(ex.problem).includes(n), `${ex.id}: 문제 글의 수 ${n}`);
      if (/둘레 거꾸로/u.test(typeLabel)) assert.ok(!nums(ex.problem).includes(v.C), `${ex.id}: 답이 글에 없음`);
      assert.ok(!(origNums.includes(v.C) && origNums.includes(v.gap) && /호수 둘레/u.test(typeLabel)), `${ex.id}: 원본과 같은 둘레·간격`);
      for (const item of lesson.original.items) assert.ok(!item.prompt.includes(ex.problem), `${ex.id}: 원본 문장과 같음`);
    }
  } else if (setId === "distance") {
    const { pts, ask, given, kind } = v, d = ([a, b]) => Math.abs(pts[b] - pts[a]);
    assert.equal(v.v, d(ask), `${ex.id}: 묻는 거리`);
    // 주어진 거리만으로 답이 나와야 한다: 공식으로 다시 계산
    const g = given.map(d);
    const viaGiven = kind === "part" ? g[0] - g[1] : kind === "inner" ? g[1] + g[2] - g[0] : g[0] + g[1] - g[2];
    assert.equal(viaGiven, v.v, `${ex.id}: 주어진 거리로 다시 계산`);
    const order = Object.entries(pts).sort((a, b) => a[1] - b[1]).map(([l]) => l);
    assert.deepEqual(order, Object.keys(pts), `${ex.id}: 점이 왼쪽부터 차례로`);
    for (const item of lesson.original.items) {
      const arcs = (item.visual?.arcs || []).map((a) => a.label).filter(Boolean).map((l) => Number(String(l).replace("cm", ""))).sort((x, y) => x - y).join();
      assert.notEqual(g.slice().sort((x, y) => x - y).join(), arcs, `${ex.id}: 원본과 같은 거리들`);
    }
  } else assert.fail(`${setId}: 검사 규칙 없음`);
}
console.log(`GOLDEN_BELL_TYPE_EXAMPLES_OK lessons=${Object.keys(LESSON_FLOWS).length} examples=${exampleCount}`);

// ───── 3) 정답 보호·문구 ─────
const NEW_FILES = ["golden-bell-3d-engine.js", "golden-bell-3d-balance.js", "golden-bell-3d-cubes.js", "golden-bell-3d-magic.js", "golden-bell-book09-game-models.js", "golden-bell-book09-games.js", "golden-bell-type-examples.js", "golden-bell-type-examples-view.js", "golden-bell-lesson-flow.js", "golden-bell-clock-dial.js"];
for (const file of NEW_FILES) {
  const text = readFileSync(here(file), "utf8");
  assert.doesNotMatch(text, /answerRef|golden_bell_answer_books|golden-bell-protected|hydrateProtected|supabase/iu, `${file}: 정답 보호 자료를 건드리지 않음`);
  const visible = text.split("\n").map((l) => l.replace(/\/\/.*$/u, "")).join("\n");
  assert.doesNotMatch(visible, /[°¼½¾]|(?:90|180|270|360)\s*도\b/u, `${file}: 각도·분수 말`);
  assert.doesNotMatch(visible, /"[^"]*\b(FC|필즈)\b[^"]*"|`[^`]*\b(FC|필즈)\b[^`]*`/u, `${file}: 화면 글자에 회사 이름`);
  assert.doesNotMatch(text, /cdn\.|unpkg|jsdelivr|https?:\/\//u, `${file}: 외부 주소를 부르지 않음`);
}
assert.match(readFileSync(here("golden-bell-3d-engine.js"), "utf8"), /from "\.\.\/\.\.\/world-explorer\/vendor\/three\.module\.js"/u, "Three.js는 저장소에 있는 것을 상대 경로로");
assert.doesNotMatch(readFileSync(here("game.html"), "utf8"), /<title>[^<]*FC|<strong>FC</u, "게임 페이지에 회사 이름 없음");
console.log("GOLDEN_BELL_3D_GAME_PROTECTION_OK files=" + NEW_FILES.length);
