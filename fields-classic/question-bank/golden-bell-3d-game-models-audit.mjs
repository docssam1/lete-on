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
    const pairType = typeLabel === "가운데 수로 A + B" || typeLabel === "겹치는 세 줄로 두 도형의 합 찾기";
    const full = ex.steps.at(-1).figure.cells.map((c) => c.v);
    assert.equal(full.length, n * n);
    const S = pairType ? v.sum : magicSum(n, full);
    assert.ok(S !== null, `${ex.id}: 마지막 그림이 마방진`);
    const labels = Object.fromEntries(cells.map((c, i) => [c.label, i]).filter(([l]) => l));
    if (n === 3) {
      const { options } = brute3(shown);
      for (const [label, i] of Object.entries(labels)) {
        if (pairType) continue;
        assert.deepEqual([...options[i]], [full[i]], `${ex.id}: ${label}가 하나로 정해짐`);
        assert.equal(v[label], full[i]);
      }
      if (pairType) {
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
  } else if (setId === "digits") {
    // 문제 글의 수로 하나하나 세어 다시 구한다
    const nums = (ex.problem.match(/\d+/gu) || []).map(Number);
    const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
    if (typeLabel === "숫자와 수") assert.deepEqual(v, { numbers: 1, digits: String(nums[0]).length }, `${ex.id}: 수 1개, 숫자는 자릿수만큼`);
    else if (typeLabel === "수의 개수") assert.equal(v, range(nums[0], nums[1]).length, `${ex.id}: 수의 개수`);
    else if (typeLabel === "쓴 숫자의 개수") assert.equal(v, range(nums[0], nums[1]).reduce((t, n) => t + String(n).length, 0), `${ex.id}: 쓴 숫자의 개수`);
    else {
      const [, end, ...ds] = nums;
      const list = range(1, end);
      const want = typeLabel === "숫자가 들어간 수"
        ? list.filter((n) => ds.some((d) => String(n).includes(String(d)))).length
        : list.reduce((t, n) => t + String(n).split("").filter((ch) => ds.map(String).includes(ch)).length, 0);
      assert.equal(v, want, `${ex.id}: ${typeLabel}`);
      if (typeLabel === "여러 숫자의 개수") assert.ok(ds.length > 1, `${ex.id}: 여러 숫자`);
    }
    const norm = (t) => String(t).replace(/\s*\(\d+\)\s*$/u, "").replace(/^\(\d+\)\s*/u, "").replace(/\s+/gu, "");
    for (const item of lesson.original.items) {
      assert.notEqual(norm(ex.problem), norm(item.prompt), `${ex.id}: 원본 문장과 같음`);
      const o = (item.prompt.match(/\d+/gu) || []).map(Number).filter((n) => !/^\(\d+\)/u.test(item.prompt) || n !== Number(item.prompt.match(/^\((\d+)\)/u)?.[1]));
      if (/수의 개수|쓴 숫자/u.test(typeLabel) && o.length >= 2) assert.ok(!(o.includes(nums[0]) && o.includes(nums[1]) && nums.length === 2), `${ex.id}: 원본과 같은 범위`);
    }
  } else if (setId === "reverse") {
    // 찾은 처음 수로 앞에서부터 다시 계산(사슬)·다시 주고받기(구슬)해 문제의 결과가 되는지 본다
    if (v.ops) {
      const run = v.ops.reduce((x, [op, n]) => ({ "+": x + n, "−": x - n, "×": x * n, "÷": x / n })[op], v.start);
      assert.equal(run, v.end, `${ex.id}: 처음 수로 다시 계산`);
      assert.ok(ex.problem.includes(String(v.end)) || ex.figure.nodes.at(-1) === v.end, `${ex.id}: 결과가 문제에 있음`);
      for (const item of lesson.original.items) {
        const o = item.visual?.ops; if (o) assert.notEqual(JSON.stringify(o), JSON.stringify(v.ops.map(([op, n]) => `${op}${n}`)), `${ex.id}: 원본 사슬과 같음`);
        assert.ok(!item.prompt.replace(/\s+/gu, "").includes(ex.figure.equation?.replace(/\s+/gu, "") || "@@"), `${ex.id}: 원본 식과 같음`);
      }
    } else {
      let A = v.a, B = v.b;
      for (const mv of v.moves) { const have = { A, B }, n = mv.n === "have" ? have[mv.to] : mv.n; if (mv.from === "A") { A -= n; B += n; } else { B -= n; A += n; } assert.ok(A >= 0 && B >= 0, `${ex.id}: 구슬이 음수`); }
      if (v.ask === "end") assert.deepEqual([v.A, v.B], [A, B], `${ex.id}: 주고받은 뒤`);
      else { assert.equal(A, B, `${ex.id}: 끝에 같아짐`); assert.ok(ex.problem.includes(`${A}개씩`), `${ex.id}: 문제의 끝 개수`); assert.equal(v.A, v.a, `${ex.id}: 처음 A`); }
      const nums = (t) => (t.match(/\d+/gu) || []).map(Number);
      for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    }
  } else if (setId === "split-box") {
    // 나눈 칸이 자릿값 그대로인지, 칸마다의 곱을 모두 더하면 곱과 같은지, 원본과 같은 곱셈이 아닌지
    const f = ex.steps.at(-1).figure;
    assert.equal(f.cols.reduce((a, b) => a + b, 0), v.first, `${ex.id}: 곱해지는 수를 나눔`);
    assert.equal(f.rows.reduce((a, b) => a + b, 0), v.second, `${ex.id}: 곱하는 수를 나눔`);
    assert.ok(f.cols.every((c) => String(c).replace(/0+$/u, "").length === 1), `${ex.id}: 몇십·몇으로`);
    assert.equal(f.cells.flat().reduce((a, b) => a + b, 0), v.first * v.second, `${ex.id}: 칸의 합 = 곱`);
    assert.equal(v.total, v.first * v.second, `${ex.id}: 답`);
    if (/몇십/u.test(typeLabel)) assert.ok(v.second % 10 === 0 && v.second < 100, `${ex.id}: 몇십`);
    if (/한 자리/u.test(typeLabel)) assert.ok(v.second < 10, `${ex.id}: 한 자리`);
    if (/곱하는 수도/u.test(typeLabel)) assert.ok(f.rows.length > 1, `${ex.id}: 곱하는 수도 나눔`);
    for (const item of lesson.original.items) assert.ok(!(item.visual?.first === v.first && item.visual?.second === v.second), `${ex.id}: 원본과 같은 곱셈`);
  } else if (setId === "equalize") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    if (v.give !== undefined && v.big !== undefined) {
      // 하나씩 옮겨 보며 같아지는 개수를 찾는다
      let moved = 0, P = v.big, Q = v.small; while (P > Q) { P--; Q++; moved++; }
      assert.ok(P === Q && moved === v.give, `${ex.id}: 옮길 개수`);
      assert.ok(nums(ex.problem).includes(v.big) && nums(ex.problem).includes(v.small), `${ex.id}: 문제 글의 수`);
      for (const item of lesson.original.items) { const o = item.visual || {}; const pair = o.plates || (o.left !== undefined ? [o.left, o.right] : null); if (pair) assert.notEqual(JSON.stringify(pair), JSON.stringify([v.big, v.small]), `${ex.id}: 원본과 같은 두 수`); }
    } else if (v.gap !== undefined) {
      assert.equal(v.gap, (v.older + v.years) - (v.younger + v.years), `${ex.id}: 나이 차`);
      for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    } else if (v.pos) {
      assert.equal(v.d, v.pos[v.hi] - v.pos[v.lo], `${ex.id}: 두 사람의 차`);
      if (v.give) { assert.equal(v.d % 2, 0); assert.ok(ex.answer.includes(`${v.d / 2}개`), `${ex.id}: 차의 반을 줌`); }
      for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    } else {
      // 합과 차(동그라미): 동그라미 하나의 값을 모두 대입
      const fits = []; for (let u = 1; u <= 300; u++) if (u + u + v.extra === v.sum) fits.push(u);
      assert.deepEqual(fits, [v.A], `${ex.id}: 작은 수가 하나로 정해짐`);
      assert.ok(nums(ex.problem).includes(v.sum) && nums(ex.problem).includes(v.extra), `${ex.id}: 문제 글의 합·차`);
      for (const item of lesson.original.items) { const o = item.visual || {}; assert.ok(!(o.total === v.sum && o.difference === v.extra), `${ex.id}: 원본과 같은 합·차`); }
    }
  } else if (setId === "calendar") {
    // 달력은 실제 날짜(윤년이 아닌 2023년)로 다시 센다. 달의 시작 요일을 0~6 모두 넣어 보아 답이 하나로 정해지는지도 본다.
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    const WD = ["일", "월", "화", "수", "목", "금", "토"];
    const dayNo = (m, d) => Date.UTC(2023, m - 1, d) / 864e5;
    const monthLen = (m) => new Date(Date.UTC(2023, m, 0)).getUTCDate();
    const wdOf = (start, d) => (start + d - 1) % 7;
    if (nums(ex.problem).length) for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    if (v.kind === "cells") {
      const pos = (d) => ({ r: Math.floor((v.start + d - 1) / 7), c: wdOf(v.start, d) });
      const fits = (x, y) => { const a = pos(x), b = pos(y); return v.gap === 8 ? b.c === a.c + 1 && b.r === a.r + 1 : b.c === a.c && b.r === a.r + v.gap / 7; };
      const found = []; for (let x = 1; x <= monthLen(v.month); x++) for (let y = x + 1; y <= monthLen(v.month); y++) if (x + y === v.sum && fits(x, y)) found.push([x, y]);
      assert.deepEqual(found, [[v.small, v.big]], `${ex.id}: 색칠한 두 칸이 하나로 정해짐`);
      assert.ok(ex.answer.includes(String(v.small)) && ex.answer.includes(String(v.big)), `${ex.id}: 답`);
      const shape = v.gap === 8 ? "diagonal" : "vertical", rows = v.gap === 14 ? 3 : 2;
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-calendar-cells") assert.ok(!(o.shape === shape && o.rows === rows && o.sum === v.sum), `${ex.id}: 원본과 같은 합`); }
    } else if (v.kind === "months") {
      const lens = Array.from({ length: 12 }, (_, i) => monthLen(i + 1));
      const total = v.ask.count ? lens.filter((n) => n === v.ask.count).length : lens.slice(v.ask.from - 1, v.ask.to).reduce((a, b) => a + b, 0);
      assert.equal(v.total, total, `${ex.id}: 날짜 수`); assert.ok(nums(ex.answer).includes(total), `${ex.id}: 답`);
    } else if (v.kind === "list") {
      const list = []; for (let d = 1; d <= monthLen(v.month); d++) if (wdOf(v.start, d) === v.wd) list.push(d);
      assert.deepEqual(v.list, list, `${ex.id}: 같은 요일 날짜`); assert.deepEqual(nums(ex.answer), list, `${ex.id}: 답`);
    } else if (v.kind === "weekday") {
      const real = ((v.from.wd + dayNo(v.to.m, v.to.d) - dayNo(v.from.m, v.from.d)) % 7 + 7) % 7;
      assert.equal(v.wd, real, `${ex.id}: 요일`); assert.ok(ex.answer.startsWith(`${WD[real]}요일`), `${ex.id}: 답`);
      if (/한 달 안/u.test(typeLabel)) assert.equal(v.from.m, v.to.m, `${ex.id}: 한 달 안`);
      if (/한 달 뒤/u.test(typeLabel)) assert.ok(v.to.m === v.from.m % 12 + 1 && v.to.d === v.from.d, `${ex.id}: 한 달 뒤 같은 날`);
      if (/한 달 이상/u.test(typeLabel)) assert.ok(dayNo(v.to.m, v.to.d) - dayNo(v.from.m, v.from.d) > 31, `${ex.id}: 한 달 넘게`);
      for (const item of lesson.original.items) { const r = item.visual?.subtype === "source-date-ladder" && item.visual.rows; if (r) assert.notEqual(JSON.stringify([r[0].date, r[0].day, r.at(-1).date]), JSON.stringify([`${v.from.m}월 ${v.from.d}일`, WD[v.from.wd], `${v.to.m}월 ${v.to.d}일`]), `${ex.id}: 원본 사다리와 같음`); }
    } else if (v.kind === "sum-date" || v.kind === "sum-day") {
      const answers = new Set();
      for (let start = 0; start < 7; start++) {
        const same = []; for (let d = 1; d <= monthLen(v.month); d++) if (wdOf(start, d) === v.wd) same.push(d);
        if (same[v.nth - 1] + same[v.nth] !== v.sum) continue;
        if (v.kind === "sum-date") { const t = []; for (let d = 1; d <= monthLen(v.month); d++) if (wdOf(start, d) === v.ask.wd) t.push(d); answers.add(t[v.ask.nth - 1]); }
        else answers.add(wdOf(start, v.ask.day));
      }
      assert.equal(answers.size, 1, `${ex.id}: 달력이 하나로 정해짐`);
      const [only] = answers;
      if (v.kind === "sum-date") { assert.equal(v.target, only, `${ex.id}: 날짜`); assert.ok(nums(ex.answer).includes(only), `${ex.id}: 답`); }
      else { assert.equal(v.res, only, `${ex.id}: 요일`); assert.ok(ex.answer.includes(`${WD[only]}요일`), `${ex.id}: 답`); }
    } else {
      // 합과 차(동그라미)
      const fits = []; for (let u = 1; u <= 300; u++) if (u + u + v.extra === v.sum) fits.push(u);
      assert.deepEqual(fits, [v.A], `${ex.id}: 작은 수가 하나로 정해짐`);
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-sum-pair") assert.ok(!(o.sum === v.sum && (o.rows || []).some((r) => r.offset === `+${v.extra}`)), `${ex.id}: 원본과 같은 합·차`); }
    }
  } else if (setId === "figure-numbers") {
    // 점·돌·사람·선을 하나하나 세어 다시 구한다(공식을 쓰지 않는다).
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    const has = (n) => nums(ex.answer).includes(n);
    if (nums(ex.problem).length) for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    const squareDots = (n) => { let c = 0; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) c++; return c; };
    const triDots = (n) => { let c = 0; for (let y = 0; y < n; y++) for (let x = 0; x <= y; x++) c++; return c; };
    const pairsOf = (n) => { let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++; return c; };
    if (typeof v === "number") {
      // 1부터의 합(연속수 예제 재사용): 그림의 from~to를 하나씩 더한다
      let s = 0; for (let x = ex.figure.from; x <= ex.figure.to; x++) s += x;
      assert.equal(ex.figure.from, 1, `${ex.id}: 1부터`); assert.equal(v, s, `${ex.id}: 합`); assert.ok(has(s), `${ex.id}: 답`);
      if (/짝수 개/u.test(typeLabel)) assert.equal(ex.figure.to % 2, 0, `${ex.id}: 짝수 개`);
      if (/홀수 개/u.test(typeLabel)) assert.equal(ex.figure.to % 2, 1, `${ex.id}: 홀수 개`);
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-sum-line") assert.notEqual(o.n, ex.figure.to, `${ex.id}: 원본과 같은 △`); }
    } else if (v.kind === "square") { let s = 0; for (let k = 1, c = 0; c < v.n; k += 2, c++) s += k; assert.equal(s, squareDots(v.n)); assert.equal(v.total, s, `${ex.id}: 사각수`); assert.ok(has(s), `${ex.id}: 답`); }
    else if (v.kind === "grow-square") { assert.equal(v.add, squareDots(v.n) - squareDots(v.n - 1), `${ex.id}: 늘어난 점`); assert.ok(has(v.add)); }
    else if (v.kind === "grow-tri") { assert.equal(v.add, triDots(v.n) - triDots(v.n - 1), `${ex.id}: 늘어난 점`); assert.ok(has(v.add)); }
    else if (v.kind === "odd-sum") { let s = 0; for (let k = 1; k <= v.last; k += 2) s += k; assert.equal(v.total, s, `${ex.id}: 홀수의 합`); assert.ok(has(s)); }
    else if (v.kind === "last-odd") { let s = 0, k = -1; while (s < v.total) { k += 2; s += k; } assert.ok(s === v.total && k === v.last, `${ex.id}: 마지막 홀수`); assert.ok(has(k)); }
    else if (v.kind === "seq") {
      // 차가 다음 홀수씩 커지는지 확인하고, 그대로 늘려 nth번째를 얻는다
      const seq = [...v.values]; for (let i = 2; i < seq.length; i++) assert.equal(seq[i] - seq[i - 1], seq[i - 1] - seq[i - 2] + 2, `${ex.id}: 사각수 수열`);
      while (seq.length < v.nth) seq.push(2 * seq.at(-1) - seq.at(-2) + 2);
      assert.equal(v.at, seq[v.nth - 1], `${ex.id}: ${v.nth}번째`); assert.ok(has(v.at));
    } else if (v.kind === "sum-squares") { let s = 0; for (let k = 1; k <= v.nth; k++) s += squareDots(k); assert.equal(v.at, s, `${ex.id}: 사각수의 합`); assert.ok(has(s)); }
    else if (v.kind === "stones") {
      let row = 1, total = 0, b = 0, w = 0, black = true; while (total < v.total) { total += row; if (black) b += row; else w += row; row += 2; black = !black; }
      assert.ok(total === v.total && b === v.black && w === v.white, `${ex.id}: 검은 돌·흰 돌`); assert.ok(has(Math.abs(b - w)));
    } else if (v.kind === "hand-new") { let c = 0; for (let i = 0; i < v.n - 1; i++) c++; assert.equal(v.count, c); assert.ok(has(c)); }
    else if (v.kind === "hand-total" || v.kind === "pairs") { assert.equal(v.total, pairsOf(v.n), `${ex.id}: 두 사람(점·카드) 짝의 수`); assert.ok(has(v.total)); if (v.last !== undefined) assert.ok(has(v.n - 1)); }
    else if (v.kind === "hand-reverse") { const fits = []; for (let n = 2; n < 60; n++) if (pairsOf(n) === v.total) fits.push(n); assert.deepEqual(fits, [v.count], `${ex.id}: 사람 수가 하나로 정해짐`); assert.ok(has(v.count)); }
    else if (v.kind === "fan") {
      // 선 고르기: 꼭짓점을 지나는 선 k + 1개 중 둘 + 가로선 하나면 삼각형(세 선이 한 점에서 만나거나 둘이 나란하면 아님)
      const lines = [...Array.from({ length: v.k + 1 }, () => "ray"), "base", ...(v.cross ? ["cross"] : [])];
      let c = 0; for (let a = 0; a < lines.length; a++) for (let b = a + 1; b < lines.length; b++) for (let d = b + 1; d < lines.length; d++) { const rays = [a, b, d].filter((i) => lines[i] === "ray").length; if (rays === 2) c++; }
      assert.equal(v.total, c, `${ex.id}: 삼각형 수`); assert.ok(has(c));
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-fan-triangle") assert.ok(!(o.cells === v.k && Boolean(o.cross) === v.cross), `${ex.id}: 원본 그림과 같음`); }
    } else if (v.kind === "odd-rows") { let s = 0; for (let r = 0; r < v.n; r++) s += 2 * r + 1; assert.equal(v.total, s); assert.ok(has(s)); }
    else if (v.kind === "tri-layers") { let s = 0; for (let l = 1; l <= v.n; l++) s += triDots(l); assert.equal(v.total, s, `${ex.id}: 쌓기나무 수`); assert.ok(has(s)); for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-cube-stair") assert.notEqual(o.stage, v.n, `${ex.id}: 원본과 같은 층`); } }
    else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "outline") {
    // 길이는 좌표로 다시 잰다. 바깥 둘레 = 도형마다 둘레 − 다른 도형의 변과 겹친(맞닿은) 부분. 모눈은 칸을 하나하나 놓아 같은 방법으로.
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 0.02, `${ex.id}: ${msg} (${a} ≠ ${b})`);
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const edgesOf = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
    const perim = (pts) => edgesOf(pts).reduce((s, [a, b]) => s + dist(a, b), 0);
    const overlap = ([a, b], [c, d]) => {
      const L = dist(a, b), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, cross = (p) => (p[0] - a[0]) * uy - (p[1] - a[1]) * ux;
      if (Math.abs(cross(c)) > 1e-6 || Math.abs(cross(d)) > 1e-6) return 0;
      const t = (p) => (p[0] - a[0]) * ux + (p[1] - a[1]) * uy, [lo, hi] = [Math.min(t(c), t(d)), Math.max(t(c), t(d))];
      return Math.max(0, Math.min(L, hi) - Math.max(0, lo));
    };
    const outline = (polys) => polys.reduce((s, pts, i) => s + edgesOf(pts).reduce((t, e) => t + dist(...e) - polys.reduce((o, other, j) => (j === i ? o : o + edgesOf(other).reduce((q, f) => q + overlap(e, f), 0)), 0), 0), 0);
    const onBoundary = (polys, a, b) => polys.some((pts) => edgesOf(pts).some((e) => Math.abs(overlap(e, [a, b]) - dist(a, b)) < 1e-6));
    const labelTexts = (ex.figure.labels || []).map((l) => l.text);
    // 정사각형 나누기·모눈은 문제 글이 늘 「한 변은 1」이라 수 대신 나눈 모양·모눈을 원본과 비교한다(아래)
    if (nums(ex.problem).length && !v.split && !v.grid) for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    if (v.geo) {
      const polys = v.geo.shapes;
      const measure = (q) => (q.what === "edge" ? (assert.ok(onBoundary(polys, q.a, q.b), `${ex.id}: 그 변이 도형에 있음`), dist(q.a, q.b)) : q.what === "perimeter" ? perim(polys[q.shape]) : outline(polys));
      for (const q of v.geo.given) { close(measure(q), q.value, "문제에 쓴 길이"); assert.ok(nums(ex.problem).includes(q.value) || labelTexts.includes(`${q.value}cm`), `${ex.id}: 주어진 ${q.value}이 문제나 그림에 있음`); }
      for (const q of v.geo.ask) { close(measure(q), q.value, "답"); assert.ok(nums(ex.answer).includes(q.value), `${ex.id}: 답 ${q.value}`); }
      for (const pts of polys) if (pts.length === 4 && /마름모|정사각형/u.test(ex.problem) && new Set(edgesOf(pts).map((e) => dist(...e).toFixed(2))).size === 1) close(perim(pts) / 4, dist(pts[0], pts[1]), "네 변이 같음");
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-ortho") for (const sh of o.shapes || []) assert.notEqual(JSON.stringify(sh.points), JSON.stringify(polys[0]), `${ex.id}: 원본 도형과 같음`); }
    } else if (v.split) {
      const sq = v.split.squares, area = sq.reduce((s, [, , k]) => s + k * k, 0);
      const W = Math.max(...sq.map(([x, , k]) => x + k)), H = Math.max(...sq.map(([, y, k]) => y + k));
      assert.equal(area, W * H, `${ex.id}: 정사각형이 직사각형을 꼭 채움`);
      for (let i = 0; i < sq.length; i++) for (let j = i + 1; j < sq.length; j++) { const [a, b] = [sq[i], sq[j]]; const ox = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]), oy = Math.min(a[1] + a[2], b[1] + b[2]) - Math.max(a[1], b[1]); assert.ok(ox <= 0 || oy <= 0, `${ex.id}: 겹치는 칸 없음`); }
      assert.equal(Math.min(...sq.map((q) => q[2])), 1, `${ex.id}: 가장 작은 정사각형 1`);
      for (const [name, side] of Object.entries(v.split.named)) { assert.equal(sq.find((q) => q[3] === name)[2], side); assert.match(ex.answer, new RegExp(`${name}[은는] ${side}\\b`, "u"), `${ex.id}: ${name}`); }
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-square-split" && o.squares) assert.notEqual(JSON.stringify(o.squares.map((q) => q.slice(0, 3))), JSON.stringify(sq.map((q) => q.slice(0, 3))), `${ex.id}: 원본 나누기와 같음`); }
    } else if (v.cut) {
      // 남은 직사각형에서 짧은 변만큼의 정사각형을 차례로 떼어 본다
      let W = v.cut.w, H = v.cut.h; const sides = [];
      while (sides.length < v.cut.sides.length) { const s = Math.min(W, H); sides.push(s); if (W >= H) W -= s; else H -= s; }
      assert.deepEqual(v.cut.sides, sides, `${ex.id}: 잘라 낸 정사각형`);
      if (v.cut.perims) for (const p of v.cut.perims) assert.ok(nums(ex.answer).includes(p), `${ex.id}: 둘레 ${p}`);
      if (v.cut.diff !== undefined) { assert.equal(v.cut.diff, 2 * (v.cut.w + v.cut.h) - 4 * sides[0], `${ex.id}: 둘레의 차`); assert.ok(nums(ex.answer).includes(v.cut.diff)); }
      for (const item of lesson.original.items) { const o = item.visual || {}; assert.ok(!(o.w === v.cut.w && o.h === v.cut.h), `${ex.id}: 원본과 같은 직사각형`); }
    } else if (v.grid) {
      const cells = v.grid.rows.flatMap((row, y) => [...row].map((ch, x) => (ch === "#" ? [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] : null)).filter(Boolean));
      close(outline(cells), v.grid.total, "모눈 둘레"); assert.ok(nums(ex.answer).includes(v.grid.total));
      const mirror = v.grid.rows.map((r) => [...r].reverse().join(""));
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.rows) { assert.notEqual(o.rows.join("/"), v.grid.rows.join("/"), `${ex.id}: 원본 모눈과 같음`); assert.notEqual(o.rows.join("/"), mirror.join("/"), `${ex.id}: 원본 모눈을 뒤집은 것`); } }
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "b4-balance") {
    // 모양마다 무게 1~24g을 모두 넣어 보아 저울이 다 평평한 경우만 남기고, 그때마다 물은 것이 단위 모양 n개와 같은지 본다
    const shapes = [...new Set(v.eqs.flatMap((e) => [...Object.keys(e.left), ...Object.keys(e.right)]).concat(Object.keys(v.ask.of), v.ask.unit))];
    const wsum = (m, w) => Object.entries(m).reduce((s, [t, n]) => s + w[t] * n, 0);
    let fits = 0;
    const tryAll = (i, w) => {
      if (i === shapes.length) { if (v.eqs.every((e) => wsum(e.left, w) === wsum(e.right, w))) { fits++; assert.equal(wsum(v.ask.of, w), v.ask.n * w[v.ask.unit], `${ex.id}: 무게 ${JSON.stringify(w)}`); } return; }
      for (let g = 1; g <= 24; g++) tryAll(i + 1, { ...w, [shapes[i]]: g });
    };
    tryAll(0, {});
    assert.ok(fits > 0, `${ex.id}: 평평해지는 무게가 있음`);
    assert.ok(ex.answer.includes(`${v.ask.n}개`), `${ex.id}: 답`);
    const KO = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모", star: "별" };
    const ko = (m) => JSON.stringify(Object.fromEntries(Object.entries(m).map(([k, n]) => [KO[k] || k, n])));
    for (const item of lesson.original.items) for (const e of item.visual?.equations || []) for (const mine of v.eqs) assert.ok(!(JSON.stringify(e.left) === ko(mine.left) && JSON.stringify(e.right) === ko(mine.right)), `${ex.id}: 원본 저울과 같음`);
  } else if (setId === "relations") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    if (v.kind === "cards") {
      // 남은 카드를 하나씩 짝지어 보며 결과 칸을 다 채우는 모든 방법을 찾고, 그때 남는 카드가 늘 같은지
      const rest = Array.from({ length: v.n }, (_, i) => i + 1).filter((x) => !v.sums.includes(x)), lefts = new Set();
      const fill = (k, free) => { if (k === v.sums.length) { lefts.add(free.join()); return; } for (const a of free) for (const b of free) if (a < b && a + b === v.sums[k]) fill(k + 1, free.filter((x) => x !== a && x !== b)); };
      fill(0, rest);
      assert.deepEqual([...lefts], [v.left.join()], `${ex.id}: 남는 카드가 하나로 정해짐`);
      assert.ok(nums(ex.answer).join() === v.left.join(), `${ex.id}: 답`);
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-number-cards") assert.ok(!(o.count === v.n && JSON.stringify(o.sums) === JSON.stringify(v.sums)), `${ex.id}: 원본과 같은 카드`); }
    } else {
      for (const [x, y, d] of v.rels) { assert.equal(v.val[x], v.val[y] + d, `${ex.id}: ${x} = ${y} + ${d}`); assert.ok(nums(ex.problem).includes(Math.abs(d)), `${ex.id}: 문제에 ${Math.abs(d)}`); }
      // 다른 이름에 다른 수(100)를 넣어 다시 퍼뜨린다
      const names = Object.keys(v.val), other = names.at(-1), w = { [other]: 100 };
      for (let g = 0; g < 10; g++) for (const [x, y, d] of v.rels) { if (w[y] !== undefined && w[x] === undefined) w[x] = w[y] + d; if (w[x] !== undefined && w[y] === undefined) w[y] = w[x] - d; }
      assert.equal(Object.keys(w).length, names.length, `${ex.id}: 모두 정해짐`);
      const sorted = [...names].sort((a, b) => w[a] - w[b]);
      if (v.kind === "asc") assert.deepEqual(v.seq, sorted, `${ex.id}: 작은 순서`);
      if (v.kind === "desc") assert.deepEqual(v.seq, [...sorted].reverse(), `${ex.id}: 큰 순서`);
      if (v.kind === "min") assert.equal(v.who, sorted[0]);
      if (v.kind === "max") assert.equal(v.who, sorted.at(-1));
      if (v.kind === "diff") assert.equal(Math.abs(w[v.pair[0]] - w[v.pair[1]]), v.d, `${ex.id}: ${v.pair.join("와 ")}의 차`);
      if (v.kind === "asc" || v.kind === "desc") assert.ok(ex.answer.startsWith(v.seq.join(v.kind === "asc" ? " < " : " > ")), `${ex.id}: 답`);
      if (v.kind === "diff") assert.ok(nums(ex.answer).includes(v.d), `${ex.id}: 답`);
      if (v.kind === "min" || v.kind === "max") assert.ok(ex.answer.includes(v.who), `${ex.id}: 답`);
      const SYM = { "○": "circle", "△": "triangle", "□": "square", "◇": "diamond" }, sig = (rows) => rows.map((r) => r.join(",")).sort().join("/");
      const mine = sig(v.rels.map(([x, y, d]) => [SYM[x] || x, "=", SYM[y] || y, d > 0 ? "+" : "-", Math.abs(d)]));
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.rows) assert.notEqual(sig(o.rows), mine, `${ex.id}: 원본 식과 같음`); if (o.clues) assert.notEqual(nums(o.clues.join(" ")).join(), v.rels.map((r) => Math.abs(r[2])).join(), `${ex.id}: 원본 조건과 같은 수`); }
    }
  } else if (setId === "logic") {
    // 모든 배치를 다 넣어 보아(순열) 조건에 맞는 것이 하나뿐인지, 그 하나가 답과 같은지
    const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((r) => [x, ...r])));
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    for (const item of lesson.original.items) for (const c of item.visual?.clues || []) assert.ok(!ex.problem.includes(c.replace(/[.。]$/u, "")), `${ex.id}: 원본 조건 문장과 같음`);
    if (v.kind === "order") {
      const ok = (seq) => v.clues.every((c) => { const at = (p) => seq.indexOf(p); return c.t === "only" ? at(c.b) === 0 && at(c.a) === 1 : c.t === "next" ? at(c.b) === at(c.a) + 1 : c.t === "first" ? at(c.p) === 0 : c.t === "last" ? at(c.p) === seq.length - 1 : c.t === "notLast" ? at(c.p) !== seq.length - 1 : c.t === "before" ? at(c.a) < at(c.b) : Math.min(at(c.a), at(c.b)) < at(c.p) && at(c.p) < Math.max(at(c.a), at(c.b)); });
      const fits = perms(v.people).filter(ok);
      assert.deepEqual(fits, [v.seq], `${ex.id}: 순서가 하나로 정해짐`); assert.ok(ex.answer.startsWith(v.seq.join(", ")));
    } else if (v.kind === "linecount") {
      // 뒤에서 k번째는 줄을 뒤집어 앞에서 k번째
      const line = v.from === "front" ? v.names : [...v.names].reverse();
      assert.equal(line[v.k - 1], v.ans, `${ex.id}: ${v.from === "front" ? "앞" : "뒤"}에서 ${v.k}번째`); assert.ok(ex.answer.startsWith(v.ans));
    } else if (v.kind === "row") {
      const fits = [];
      for (let n = 1; n <= 80; n++) {
        const pos = (c) => (c.from === "front" ? c.k : n - c.k + 1);
        if (v.cons.some((c) => pos(c) < 1 || pos(c) > n)) continue;
        const byWho = {}; let good = true; for (const c of v.cons) { if (byWho[c.who] !== undefined && byWho[c.who] !== pos(c)) good = false; byWho[c.who] = pos(c); }
        if (v.between) good &&= Math.abs(byWho[v.between.a] - byWho[v.between.b]) - 1 === v.between.count;
        if (good) fits.push(n);
      }
      assert.deepEqual(fits, [v.n], `${ex.id}: 사람 수가 하나로 정해짐`); assert.ok(nums(ex.answer).includes(v.n));
    } else if (v.kind === "compass") {
      const D = { 북: [-1, 0], 남: [1, 0], 서: [0, -1], 동: [0, 1] };
      v.asks.forEach(([of, dir], i) => { const r = v.rows.findIndex((row) => row.includes(of)), c = v.rows[r].indexOf(of); assert.equal(v.answers[i], v.rows[r + D[dir][0]][c + D[dir][1]], `${ex.id}: ${of}의 ${dir}쪽`); assert.ok(ex.answer.includes(`(${i + 1}) ${v.answers[i]}`)); });
    } else if (v.kind === "place") {
      const D = { 북: [-1, 0], 남: [1, 0], 서: [0, -1], 동: [0, 1] }, cells = [[0, 0], [0, 1], [1, 0], [1, 1]];
      const fits = perms(v.places).filter((arr) => { const at = (p) => cells[arr.indexOf(p)]; return v.clues.every(([a, dir, b]) => at(a)[0] === at(b)[0] + D[dir][0] && at(a)[1] === at(b)[1] + D[dir][1]); });
      assert.equal(fits.length, 1, `${ex.id}: 자리가 하나로 정해짐`);
      assert.equal(fits[0][cells.findIndex(([r, c]) => r === v.ask[0] && c === v.ask[1])], v.ans, `${ex.id}: 물은 칸`); assert.ok(ex.answer.includes(v.ans));
    } else if (v.kind === "round") {
      // 자리 번호는 맨 위부터 시계 바늘이 도는 쪽. 가운데를 보고 앉으면 왼쪽 = 번호 + 1
      const n = v.seats.length, freeSeats = [...Array(n).keys()].filter((i) => !Object.values(v.fixed).includes(i));
      const fits = perms(freeSeats).map((arr) => ({ ...v.fixed, ...Object.fromEntries(v.names.map((nm, i) => [nm, arr[i]])) })).filter((at) => v.clues.every((c) => (c.t === "opp" ? at[c.a] === (at[c.b] + n / 2) % n : c.t === "left" ? at[c.a] === (at[c.b] + 1) % n : at[c.a] === (at[c.b] - 1 + n) % n)));
      assert.equal(fits.length, 1, `${ex.id}: 자리가 하나로 정해짐`); assert.equal(v.seats[fits[0][v.ask]], v.ans, `${ex.id}: 물은 사람의 자리`);
      const last = ex.steps.at(-1).figure.seats; assert.ok(last.every((s, i) => !s.name || fits[0][s.name] === i), `${ex.id}: 마지막 그림의 자리`);
    } else if (v.kind === "ox") {
      const fits = perms(v.choices).filter((arr) => v.clues.every((c) => { const got = arr[v.people.indexOf(c.p)]; return c.t === "is" ? got === c.c : c.t === "not" ? got !== c.c : c.cs.includes(got); }));
      assert.equal(fits.length, 1, `${ex.id}: 고른 것이 하나로 정해짐`); assert.equal(fits[0][v.people.indexOf(v.ask)], v.ans, `${ex.id}: 답`);
      const marks = ex.steps.at(-1).figure.marks;
      for (const [k, m] of Object.entries(marks)) { const [p, c] = k.split("|"); assert.equal(m === "O", fits[0][v.people.indexOf(p)] === c, `${ex.id}: 마지막 표 ${k}`); }
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "crypt") {
    // 모양마다·빈칸마다 0~9를 모두 넣어 덧셈이 맞는 경우를 다 찾는다(맨 앞자리 0 금지, 다른 모양은 다른 수, pool이면 그 숫자를 한 번씩)
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    const { addends, sum, distinct, pool } = v.puzzle, rows = [...addends, sum];
    const syms = [...new Set(rows.join("").split("").filter((ch) => !/\d|_|㉠/u.test(ch)))];
    const holes = rows.flatMap((r, i) => [...r].map((ch, j) => (ch === "_" || ch === "㉠" ? `${i},${j}` : null)).filter(Boolean));
    const sols = [], pick = [];
    const run = (k) => {
      if (k === syms.length + holes.length) {
        const val = Object.fromEntries(syms.map((sy, i) => [sy, pick[i]])), hv = Object.fromEntries(holes.map((h, i) => [h, pick[syms.length + i]]));
        const ds = rows.map((r, i) => [...r].map((ch, j) => (/\d/u.test(ch) ? Number(ch) : hv[`${i},${j}`] ?? val[ch])));
        if (ds.some((d) => d[0] === 0)) return;
        const n = (d) => d.reduce((x, y) => x * 10 + y, 0);
        if (ds.slice(0, -1).reduce((x, d) => x + n(d), 0) !== n(ds.at(-1))) return;
        if (pool && ds.flat().sort().join() !== pool.map(Number).sort().join()) return;
        sols.push({ val, holes: holes.map((h) => hv[h]), mark: holes.findIndex((h) => { const [i, j] = h.split(",").map(Number); return [...rows[i]][j] === "㉠"; }) });
        return;
      }
      for (let d = 0; d <= 9; d++) { if (distinct && k < syms.length && pick.slice(0, k).includes(d)) continue; pick[k] = d; run(k + 1); }
    };
    run(0);
    assert.ok(sols.length > 0, `${ex.id}: 풀이가 있음`);
    if (v.ask.kind === "all") {
      assert.equal(sols.length, 1, `${ex.id}: 답이 하나로 정해짐`);
      assert.deepEqual(sols[0].val, Object.fromEntries(syms.map((sy) => [sy, v.sol[sy]])), `${ex.id}: 답`);
      for (const [sy, d] of Object.entries(v.sol)) assert.match(ex.answer, new RegExp(`${sy}[은는] ${d}\\D`, "u"), `${ex.id}: 답 글 ${sy}`);
      const last = ex.steps.findLast((st) => st.figure.reveal)?.figure.reveal; if (last) assert.deepEqual(Object.fromEntries(Object.entries(last).sort()), Object.fromEntries(Object.entries(v.sol).sort()), `${ex.id}: 마지막 그림`);
    } else if (v.ask.kind === "max") assert.equal(nums(ex.answer).at(-1), Math.max(...sols.map((x) => x.val[v.ask.sym])), `${ex.id}: 가장 큰 ${v.ask.sym}`);
    else if (v.ask.kind === "blankSum") { const totals = [...new Set(sols.map((x) => x.holes.reduce((a, b) => a + b, 0)))].sort((a, b) => a - b); assert.deepEqual(nums(ex.answer).filter((x) => totals.includes(x) || x > 2).sort((a, b) => a - b), totals, `${ex.id}: 빈칸의 합`); }
    else if (v.ask.kind === "mark") { const ms = [...new Set(sols.map((x) => x.holes[x.mark]))]; assert.equal(ms.length, 1, `${ex.id}: ㉠이 하나로 정해짐`); assert.ok(nums(ex.answer).includes(ms[0]), `${ex.id}: ㉠`); }
    // 단계 그림의 빈칸은 실제 풀이여야 한다(빈칸을 다 채운 그림만)
    for (const st of ex.steps) { const b = st.figure.blanks; if (b && b.length === holes.length) assert.ok(sols.some((x) => x.holes.join() === b.join()), `${ex.id}: 그림의 빈칸이 맞는 식`); }
    const sig = (adds, sm) => `${adds.join("+")}=${sm}`, mine = sig(addends, sum);
    for (const item of lesson.original.items) { const o = item.visual || {}; if (o.addends) assert.notEqual(sig(o.addends.map((a) => a.join("")), o.sum.join("")), mine, `${ex.id}: 원본 식과 같음`); if (o.rows) assert.notEqual(sig(o.rows, o.result), mine, `${ex.id}: 원본 식과 같음`); }
  } else if (setId === "matrix") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    // 모르는 것마다 수를 모두 넣어 보는 탐색(lo~hi)
    const search = (keys, lo, hi, ok) => { const out = [], cur = {}; const go = (k) => { if (k === keys.length) { if (ok(cur)) out.push({ ...cur }); return; } for (let d = lo; d <= hi; d++) { cur[keys[k]] = d; go(k + 1); } }; go(0); return out; };
    if (v.kind === "shape-eqs") {
      const shapes = [...new Set(v.eqs.flatMap((e) => e.terms))];
      const fits = search(shapes, 1, 30, (w) => v.eqs.every((e) => e.terms.reduce((a, t) => a + w[t], 0) === e.total));
      assert.equal(fits.length, 1, `${ex.id}: 모양 값이 하나로 정해짐`); assert.deepEqual(fits[0], v.values, `${ex.id}: 모양 값`);
      assert.deepEqual(nums(ex.answer), v.ask.map((a) => fits[0][a]), `${ex.id}: 답`);
      for (const item of lesson.original.items) assert.notEqual(nums(item.prompt).join(), nums(ex.problem).join(), `${ex.id}: 원본과 같은 수`);
    } else if (v.kind === "sum-grid") {
      const shapes = [...new Set(v.cells.flat())];
      const ok = (w) => v.rowVals.every((t, r) => t === null || t === "" || v.cells[r].reduce((a, sy) => a + w[sy], 0) === t) && v.colVals.every((t, c) => t === null || t === "" || v.cells.reduce((a, row) => a + w[row[c]], 0) === t);
      const fits = search(shapes, 1, 20, ok);
      assert.equal(fits.length, 1, `${ex.id}: 모양 값이 하나로 정해짐`);
      const w = fits[0], total = v.ask.row !== undefined ? v.cells[v.ask.row].reduce((a, sy) => a + w[sy], 0) : v.cells.reduce((a, row) => a + w[row[v.ask.col]], 0);
      assert.equal(v.total, total, `${ex.id}: ?의 합`); assert.ok(nums(ex.answer).includes(total));
      assert.deepEqual(ex.steps.at(-1).figure.reveal, w, `${ex.id}: 마지막 그림의 값`);
      for (const item of lesson.original.items) if (item.visual?.cells) assert.notEqual(JSON.stringify(item.visual.cells), JSON.stringify(v.cells), `${ex.id}: 원본 매트릭스와 같음`);
    } else if (v.kind === "times") {
      const prods = Array.from({ length: 9 }, (_, i) => v.n * (i + 1));
      if (v.ask === "digitSum") assert.deepEqual(v.result, [...new Set(prods.map((p) => [...String(p)].reduce((a, ch) => a + Number(ch), 0)))], `${ex.id}: 자리 숫자의 합`);
      else { const ones = prods.map((p) => p % 10); const k = v.result.length; assert.ok(ones.every((d, i) => d === v.result[i % k]) && new Set(v.result).size === k, `${ex.id}: 일의 자리 되풀이`); }
      assert.ok(v.result.every((d) => nums(ex.answer).includes(d)), `${ex.id}: 답`);
    } else if (v.kind === "pairs") {
      const fits = search(["a", "b"], 1, 9, (w) => w.a < w.b && w.a * w.b === v.product).map((w) => [w.a, w.b]);
      assert.deepEqual(fits, v.pairs, `${ex.id}: 짝`); for (const [a, b] of fits) assert.ok(ex.answer.includes(`A = ${a}, B = ${b}`));
      for (const item of lesson.original.items) assert.notEqual(item.visual?.product, v.product, `${ex.id}: 원본과 같은 곱`);
    } else if (v.kind === "ring") {
      const n = v.full.length, unknown = [...Array(n).keys()].filter((i) => !v.given.includes(i));
      const fits = search(unknown.map(String), 2, 9, (w) => { const c = v.full.map((x, i) => (v.given.includes(i) ? x : w[i])); return v.squares.every((sq, i) => c[i] * c[(i + 1) % n] === sq); });
      assert.equal(fits.length, 1, `${ex.id}: 동그라미가 하나로 정해짐`);
      for (const i of unknown) { assert.equal(fits[0][i], v.full[i]); assert.ok(ex.answer.includes(`${v.names[i]} = ${v.full[i]}`), `${ex.id}: 답 ${v.names[i]}`); }
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.products) assert.notEqual([...o.products].sort().join(), [...v.squares].sort().join(), `${ex.id}: 원본 곱과 같음`); if (o.squares) assert.notEqual(o.squares.join(), v.squares.join(), `${ex.id}: 원본 고리와 같음`); }
    } else if (v.kind === "pgrid") {
      const letters = Object.keys(v.values);
      const fits = search(letters, 1, 9, (w) => { const val = (x) => (/^\d+$/u.test(x) ? Number(x) : w[x]); return v.cells.every((r, i) => r.reduce((a, x) => a * val(x), 1) === v.rows[i]) && v.cells[0].every((_, c) => v.cells.reduce((a, r) => a * val(r[c]), 1) === v.cols[c]); });
      assert.equal(fits.length, 1, `${ex.id}: 빈칸이 하나로 정해짐`); assert.deepEqual(fits[0], v.values);
      for (const l of letters) assert.match(ex.answer, new RegExp(`${l}[은는] ${v.values[l]}\\D`, "u"), `${ex.id}: 답 ${l}`);
      for (const item of lesson.original.items) if (item.visual?.letters) assert.notEqual(JSON.stringify(item.visual.letters), JSON.stringify(v.cells), `${ex.id}: 원본 표와 같음`);
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "pmatrix") {
    // 자리(줄마다 두 칸)와 수(2~9 한 번씩)를 줄의 곱에 맞게 하나씩 채워 보며 모든 판을 찾는다
    const N = [2, 3, 4, 5, 6, 7, 8, 9], all = [];
    const colsChoice = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    const fill = (r, used, board, colCount) => {
      if (r === 4) { if ([0, 1, 2, 3].every((c) => colCount[c] === 2 && [0, 1, 2, 3].reduce((a, rr) => a * (board[`${rr},${c}`] ?? 1), 1) === v.colP[c])) all.push({ ...board }); return; }
      for (const [c1, c2] of colsChoice) {
        if (colCount[c1] >= 2 || colCount[c2] >= 2) continue;
        if (v.mode === "known" && !(Object.hasOwn(v.grid, `${r},${c1}`) && Object.hasOwn(v.grid, `${r},${c2}`))) continue;
        if (v.mode === "holes" && !(Object.hasOwn(v.grid, `${r},${c1}`) && Object.hasOwn(v.grid, `${r},${c2}`))) continue;
        for (const a of N) for (const b of N) {
          if (a === b || used.has(a) || used.has(b) || a * b !== v.rowP[r]) continue;
          const cc = [...colCount]; cc[c1]++; cc[c2]++;
          fill(r + 1, new Set([...used, a, b]), { ...board, [`${r},${c1}`]: a, [`${r},${c2}`]: b }, cc);
        }
      }
    };
    fill(0, new Set(), {}, [0, 0, 0, 0]);
    const sortObj = (o) => JSON.stringify(Object.fromEntries(Object.entries(o).sort()));
    const pairsOf = (b) => JSON.stringify([[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => b[`${r},${c}`]).filter(Boolean).sort((x, y) => x - y)), [0, 1, 2, 3].map((c) => [0, 1, 2, 3].map((r) => b[`${r},${c}`]).filter(Boolean).sort((x, y) => x - y))]);
    assert.ok(all.some((b) => sortObj(b) === sortObj(v.grid)), `${ex.id}: 예제 판이 조건에 맞음`);
    if (v.ask === "pairs") { assert.deepEqual([...new Set(all.map(pairsOf))], [pairsOf(v.grid)], `${ex.id}: 줄마다 두 수가 하나로 정해짐`); for (const [a, b] of [...v.rowPair, ...v.colPair]) assert.ok(ex.answer.includes(`(${a}, ${b})`)); }
    else { assert.equal(all.length, 1, `${ex.id}: 판이 하나로 정해짐`); }
    if (v.ask === "letters") for (const [k, l] of Object.entries(v.letters)) assert.match(ex.answer, new RegExp(`${l}[은는] ${v.grid[k]}\\D`, "u"), `${ex.id}: ${l}`);
    if (v.ask === "full") for (const r of [0, 1, 2, 3]) assert.ok(ex.answer.includes([0, 1, 2, 3].map((c) => v.grid[`${r},${c}`] ?? "빈칸").join(", ")), `${ex.id}: ${r + 1}째 줄`);
    for (const item of lesson.original.items) { const o = item.visual || {}; if (o.rowProducts) assert.ok(!(o.rowProducts.join() === v.rowP.join() && o.columnProducts.join() === v.colP.join()), `${ex.id}: 원본과 같은 곱`); }
  } else if (setId === "seq2") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), has = (n) => nums(ex.answer).includes(n);
    const origVals = lesson.original.items.map((it) => JSON.stringify(it.visual?.values ?? it.visual?.stages ?? it.visual?.value ?? it.visual?.lines ?? null));
    if (v.kind === "split") { let x = v.value; for (const p of v.parts) { assert.equal(x % p, 0); x /= p; } assert.equal(v.one, x); assert.ok(has(x)); assert.ok(!origVals.includes(String(v.value)), `${ex.id}: 원본과 같은 수`); }
    else if (v.kind === "repeat") { let t = 0; for (let i = 0; i < v.times; i++) t += v.n; assert.equal(v.total, t); assert.ok(has(t)); }
    else if (v.kind === "cards2") { const fits = []; for (const a of v.cards) for (const b of v.cards) if (a !== b && Array(v.times).fill(a).reduce((x, y) => x + y, 0) === b) fits.push([a, b]); assert.deepEqual(fits, [[v.a, v.b]], `${ex.id}: 카드가 하나로 정해짐`); assert.ok(ex.answer.includes(`○는 ${v.a}`) && has(v.b)); }
    else if (v.kind === "chain") {
      const val = {};
      for (const [sym, e] of v.lines) { const t = e.split(" "); let acc = Number(val[t[0]] ?? t[0]); for (let i = 1; i < t.length; i += 2) { const n = Number(val[t[i + 1]] ?? t[i + 1]); acc = t[i] === "+" ? acc + n : acc - n; } val[sym] = acc; }
      assert.deepEqual(val, v.val, `${ex.id}: 도형 값`); for (const [sy, n] of Object.entries(val)) assert.match(ex.answer, new RegExp(`${sy}[은는] ${n}\\D`, "u"));
      for (const item of lesson.original.items) assert.notEqual(JSON.stringify(item.visual?.lines), JSON.stringify(v.lines.map(([sy, e]) => `${e.replace(/ /gu, "")}=${sy}`)), `${ex.id}: 원본 식과 같음`);
    } else if (v.kind === "arith") { const d = v.values[1] - v.values[0]; assert.ok(v.values.every((x, i) => !i || x - v.values[i - 1] === d)); let x = v.values[0]; for (let i = 1; i < v.nth; i++) x += d; assert.equal(v.at, x); assert.ok(has(x)); assert.ok(!origVals.includes(JSON.stringify(v.values))); }
    else if (v.kind === "rule") {
      const a = v.values, L = a.length; let next;
      if (v.rule === "period") { let p = 1; while (!a.every((x, i) => i < p || x === a[i - p])) p++; assert.ok(p < L, "마디가 보임"); next = a[L - p]; }
      else if (v.rule === "arith") { const d = a[1] - a[0]; assert.ok(a.every((x, i) => !i || x - a[i - 1] === d)); next = a[L - 1] + d; }
      else if (v.rule === "geom") { const r = a[1] / a[0]; assert.ok(a.every((x, i) => !i || x === a[i - 1] * r)); next = a[L - 1] * r; }
      else if (v.rule === "diff") { const ds = a.slice(1).map((x, i) => x - a[i]); assert.ok(ds.every((x, i) => !i || x - ds[i - 1] === ds[1] - ds[0])); next = a[L - 1] + ds.at(-1) + (ds[1] - ds[0]); }
      else if (v.rule === "fib") { assert.ok(a.every((x, i) => i < 2 || x === a[i - 1] + a[i - 2])); next = a[L - 1] + a[L - 2]; }
      else if (v.rule === "skip") { const sub = (k) => a.filter((_, i) => i % 2 === k); for (const k of [0, 1]) { const q = sub(k); assert.ok(q.every((x, i) => !i || x - q[i - 1] === q[1] - q[0])); } const q = sub(L % 2); next = q.at(-1) + (q[1] - q[0]); }
      else if (v.rule === "group") { const g = []; for (let i = 0; i < L; i += 2) g.push(a.slice(i, i + 2)); const full = g.filter((x) => x.length === 2); assert.ok(full.every((x, i) => x[1] - x[0] === full[0][1] - full[0][0] && (!i || x[0] - full[i - 1][0] === full[1][0] - full[0][0]))); next = L % 2 ? a[L - 1] + (full[0][1] - full[0][0]) : full.at(-1)[0] + (full[1][0] - full[0][0]); }
      assert.equal(v.next, next, `${ex.id}: 다음 수`); assert.ok(has(next));
      for (const item of lesson.original.items) { const o = item.visual?.values; if (Array.isArray(o)) assert.notEqual(JSON.stringify(o.filter((x) => x !== null)), JSON.stringify(a), `${ex.id}: 원본 수열과 같음`); }
    } else if (v.kind === "stages") { const last = v.first.flat().map((x) => x + 3 * v.d); assert.deepEqual(v.last, last); assert.ok(last.every((x) => has(x))); }
    else if (v.kind === "match") { const sticks = (n) => { const set = new Set(); for (let i = 0; i < n; i++) for (const e of [`h${i},0`, `h${i},1`, `v${i}`, `v${i + 1}`]) set.add(e); return set.size; }; assert.deepEqual(v.counts, [1, 2, 3, 4].map(sticks)); assert.equal(v.at, sticks(v.nth)); assert.ok(has(v.at)); }
    else if (v.kind === "promise") {
      const rule = (d) => d.left * d.right + d.bottom;
      assert.ok(v.items.every((d) => d.top === rule(d)), `${ex.id}: 약속이 세 그림에 맞음`); assert.ok(v.items.some((d) => d.top !== d.left + d.right + d.bottom), `${ex.id}: 더하기로는 안 맞음`);
      assert.equal(v.top, rule(v.ask)); assert.ok(has(v.top));
      for (const item of lesson.original.items) for (const e of item.visual?.examples || []) assert.ok(!v.items.some((d) => d.left === e.left && d.right === e.right && d.bottom === e.bottom), `${ex.id}: 원본 그림과 같은 수`);
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "calc6") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), has = (n) => nums(ex.answer).includes(n);
    const tokSig = (t) => JSON.stringify(t.filter((x) => x !== null && /^\*?\d+$/u.test(String(x))).map((x) => String(x).replace("*", "")));
    const mineNums = JSON.stringify(nums(ex.problem).map(String));
    for (const item of lesson.original.items) { const t = item.visual?.tokens; if (t) assert.notEqual(tokSig(t), mineNums, `${ex.id}: 원본 식과 같은 수`); }
    if (typeof v === "object" && v.cols) { let t = 0; for (let i = 0; i < v.second; i++) t += v.first; assert.equal(v.total, t); assert.ok(has(t)); for (const item of lesson.original.items) { const o = item.visual || {}; if (o.tens !== undefined) assert.ok(!(o.tens + o.ones === v.first && o.m === v.second), `${ex.id}: 원본 타일과 같음`); } }
    else if (v.kind === "sum") { let t = 0; for (const n of v.nums) t += n; assert.equal(v.total, t); assert.ok(has(t)); }
    else if (v.kind === "blank") { let t = 0; for (const n of v.nums) t += n; assert.equal(v.need, v.target - t); assert.ok(has(v.need)); }
    else if (v.kind === "repeat") { assert.equal(v.total, v.n * v.times); assert.ok(has(v.total)); }
    else if (v.kind === "factor") { const t = v.a * v.b + v.a * v.c; assert.equal(v.total, t); assert.ok(has(t)); }
    else if (v.kind === "near") { const t = v.op === "×" ? v.a * v.b : v.a + v.b; assert.equal(v.total, t); assert.ok(has(t)); assert.ok(/^9+$/u.test(String(v.op === "×" ? v.b : v.a)), `${ex.id}: 9에 가까운 수`); }
    else if (v.kind === "fblank") { assert.ok(has(v.n / v.a) && has(v.n / v.b) && v.n % v.a === 0 && v.n % v.b === 0); }
    else if (v.kind === "split") { let x = v.value; for (const p of v.parts) { assert.equal(x % p, 0); x /= p; } assert.equal(v.one, x); assert.ok(has(x)); for (const item of lesson.original.items) assert.notEqual(item.visual?.top, v.value, `${ex.id}: 원본과 같은 수`); }
    else if (v.kind === "make") {
      // 숫자 사이 칸마다 (붙이기 · + · −)를 모두 넣어 계산해 본다
      const outs = [];
      const go = (i, expr) => { if (i === v.digits.length) { const val = expr.match(/[+−]?\d+/gu).reduce((a, t) => a + (t[0] === "−" ? -Number(t.slice(1)) : Number(t.replace("+", ""))), 0); if (val === v.target && (!v.signsOnly || expr.replace(/\d/gu, "").length === v.digits.length - 1)) outs.push(expr); return; } for (const o of ["", ...v.ops]) go(i + 1, expr + o + v.digits[i]); };
      go(1, String(v.digits[0]));
      assert.deepEqual(outs, [v.ans], `${ex.id}: 식이 하나뿐`); assert.ok(ex.answer.replace(/ /gu, "").startsWith(v.ans), `${ex.id}: 답 식`);
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "count5") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), has = (n) => nums(ex.answer).includes(n);
    if (v.kind === "route") {
      // 오른쪽·아래·대각선으로 가는 길을 모두 나열하고 길이가 가장 짧은 것만 센다
      const ok = new Set(v.edges.map((e) => e.join())), dg = new Set((v.diags || []).map((d) => d.join())), paths = [];
      const walk = (r, c, len, seen, end) => { if (r === end[0] && c === end[1]) { paths.push({ len, seen }); return; } if (c < v.cols && ok.has([r, c, r, c + 1].join())) walk(r, c + 1, len + 1, seen || (v.via && r === v.via[0] && c + 1 === v.via[1]), end); if (r < v.rows && ok.has([r, c, r + 1, c].join())) walk(r + 1, c, len + 1, seen || (v.via && r + 1 === v.via[0] && c === v.via[1]), end); if (dg.has([r, c].join())) walk(r + 1, c + 1, len + Math.SQRT2, seen || (v.via && r + 1 === v.via[0] && c + 1 === v.via[1]), end); };
      walk(0, 0, 0, false, [v.rows, v.cols]);
      const pool = v.via ? paths.filter((p) => p.seen) : paths, m = Math.min(...pool.map((p) => p.len));
      const count = pool.filter((p) => Math.abs(p.len - m) < 1e-9).length;
      assert.equal(v.total, count, `${ex.id}: 가장 짧은 길의 가짓수`); assert.ok(has(count));
      const full = v.edges.length === 2 * v.rows * v.cols + v.rows + v.cols;
      for (const item of lesson.original.items) { const o = item.visual || {}; if (o.subtype === "source-route") assert.ok(!(o.rows === v.rows && o.cols === v.cols && full && !o.cells && !o.bold && !o.diagonals && !(v.diags || []).length && !v.via), `${ex.id}: 원본과 같은 격자`); }
    } else if (v.kind === "roads") { let n = 0; const go = (i) => { if (i === v.ways.length) { n++; return; } for (let k = 0; k < v.ways[i]; k++) go(i + 1); }; go(0); assert.equal(v.total, n); assert.ok(has(n)); }
    else if (v.kind === "cards-count" || v.kind === "cards-rank") {
      const list = []; const go = (pre, rest) => { if (pre.length === v.digits) { if (pre[0] !== 0) list.push(Number(pre.join(""))); return; } rest.forEach((x, i) => go([...pre, x], rest.filter((_, j) => j !== i))); }; go([], v.cards);
      list.sort((a, b) => a - b);
      if (v.kind === "cards-count") { assert.equal(v.total, list.length); assert.ok(has(list.length)); } else { assert.equal(v.at, list[v.k - 1]); assert.ok(has(v.at)); }
      for (const item of lesson.original.items) assert.notEqual(JSON.stringify(item.visual?.digits), JSON.stringify(v.cards), `${ex.id}: 원본과 같은 카드`);
    } else if (v.kind === "two-rel") { const list = []; for (let n = 10; n <= 99; n++) if (Math.floor(n / 10) - (n % 10) === v.rel) list.push(n); assert.deepEqual(v.list, list); assert.deepEqual(nums(ex.answer), list); }
    else if (v.kind === "two-fix") { const list = []; for (let n = 10; n <= 99; n++) { const t = Math.floor(n / 10), o = n % 10; if (t === v.times * o && t + o === v.total) list.push(n); } assert.deepEqual(list, [v.n]); assert.ok(has(v.n)); }
    else if (v.kind === "snake") {
      // 1부터 차례로 걸어가며 칸을 채운다(줄 끝에서 방향을 바꾼다)
      const g = Array.from({ length: v.rows }, () => []); let n = 1; for (let r = 0; r < v.rows; r++) for (let k = 0; k < v.cols; k++) g[r][r % 2 ? v.cols - 1 - k : k] = n++;
      assert.equal(v.v, g[v.ask[0]][v.ask[1]]); assert.ok(has(v.v));
      for (const item of lesson.original.items) assert.notEqual(JSON.stringify(item.visual?.cells?.[0]), JSON.stringify(g[0].map(String)), `${ex.id}: 원본 표와 같은 첫 줄`);
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "misc") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), has = (n) => nums(ex.answer).includes(n);
    // 테이프 문제의 수는 「모눈 한 칸 1cm」뿐이라 수 비교에서 뺀다(모양은 새로 그린 꺾은선)
    if (nums(ex.problem).length && v.kind !== "tape") for (const item of lesson.original.items) assert.notEqual(nums(ex.problem).join(), nums(item.prompt).join(), `${ex.id}: 원본과 같은 수`);
    if (v.kind === "clock") { assert.ok(v.h >= 1 && v.h <= 12 && v.m % 5 === 0 && v.m < 60); const hourDeg = (v.h % 12) * 30 + v.m / 2; assert.equal(Math.floor(hourDeg / 30) % 12, v.h % 12, `${ex.id}: 짧은 바늘이 ${v.h}과 다음 숫자 사이`); assert.ok(ex.answer.startsWith(`${v.h}시 ${v.m}분`)); for (const item of lesson.original.items) for (const c of item.visual?.clocks || []) assert.notEqual(c.total, v.h * 60 + v.m, `${ex.id}: 원본과 같은 시각`); }
    else if (v.kind === "venn") {
      // 네 칸(왼쪽만·둘 다·오른쪽만·바깥)에 수를 모두 넣어 보아 주어진 수와 맞는 것을 찾는다
      const fits = [];
      for (let x = 0; x <= 60; x++) for (let y = 0; y <= 60; y++) for (let z = 0; z <= 60; z++) for (let w = 0; w <= (v.ask === "both" || v.ask === "total" ? 0 : 60); w++) {
        const g = { a: x + y, b: y + z, both: y, out: w, total: x + y + z + w };
        const given = v.ask === "both" ? ["a", "b", "total"] : v.ask === "total" ? ["a", "b", "both"] : v.ask === "out" ? ["a", "b", "both", "total"] : ["a", "b", "out", "total"];
        if (given.every((k) => g[k] === v[k])) fits.push(v.ask === "only" ? x + z : g[v.ask]);
      }
      assert.ok(fits.length && new Set(fits).size === 1, `${ex.id}: 답이 하나로 정해짐`); assert.ok(has(fits[0]), `${ex.id}: 답`);
    } else if (v.kind === "bundle2") { const fits = []; for (let x = 1; x <= 60; x++) for (let y = 1; y <= 60; y++) if (x + y === v.s1 && 2 * x + y === v.s2) fits.push([x, y]); assert.deepEqual(fits, [[v.x, v.y]]); assert.ok(has(v.y)); }
    else if (v.kind === "part") { assert.equal(v.rest, v.whole - v.part); assert.ok(v.part < v.whole && has(v.rest)); }
    else if (v.kind === "chain4") { const [A, , , D] = v.pos, AD = D - A, AC = v.pos[2] - A, BD = D - v.pos[1]; const fits = []; for (let b = 1; b < AD; b++) for (let c = b + 1; c < AD; c++) if (c === AC && AD - b === BD) fits.push([b, c - b, AD - c]); assert.deepEqual(fits, [[v.AB, v.BC, v.CD]]); for (const x of [v.AB, v.BC, v.CD]) assert.ok(has(x)); }
    else if (v.kind === "tape") { let t = 0; for (let i = 1; i < v.pts.length; i++) { const [p, q] = [v.pts[i - 1], v.pts[i]]; assert.ok(p[0] === q[0] || p[1] === q[1], `${ex.id}: 꺾인 곳은 직각`); t += Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]); } assert.equal(v.total, t); assert.ok(has(t)); }
    else if (v.kind === "mid") { assert.equal(v.ans - v.lo, v.hi - v.ans, `${ex.id}: 한가운데`); assert.ok(has(v.ans)); }
    else if (v.kind === "interval") { assert.equal(v.ans * v.parts, v.hi - v.lo); assert.ok(has(v.ans)); }
    else if (v.kind === "times") { let n = 0, s = 0; while (s < v.b) { s += v.a; n++; } assert.ok(s === v.b && n === v.k); assert.ok(has(n)); }
    else if (v.kind === "len") { assert.equal(v.lenB * v.a, v.lenA * v.b); assert.ok(has(v.lenB)); }
    else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "book1" || setId === "arrange") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), has = (n) => nums(ex.answer).includes(n);
    const add = (xs) => xs.reduce((a, b) => a + b, 0);
    // 원본 그림의 수(가쿠로 합·나눌 수 묶음·조건 카드)와 예제 문제의 수가 통째로 같으면 안 된다
    for (const item of lesson.original.items) { const vis = (item.visual || [])[0] || {}; if (vis.cells && v.cells) assert.notEqual(JSON.stringify(vis.cells), JSON.stringify(v.cells), `${ex.id}: 원본과 같은 삼각진`); const src = vis.rowSums ? [...vis.rowSums, ...vis.columnSums] : vis.values || vis.cards || nums((vis.clues || []).join(" ")); if (src.length) assert.notEqual(nums(ex.problem).join(), src.join(), `${ex.id}: 원본과 같은 수`); }
    if (v.kind === "gakuro") {
      assert.deepEqual(v.rows, v.grid.map(add), `${ex.id}: 가로 합`); assert.deepEqual(v.cols, v.grid[0].map((_, j) => add(v.grid.map((r) => r[j]))), `${ex.id}: 세로 합`);
      const blanks = v.known.flatMap((r, i) => r.map((x, j) => (x === null ? [i, j] : null)).filter(Boolean));
      const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((r) => [x, ...r])));
      // 카드를 빈칸에 넣는 모든 순서를 해 보아 합이 다 맞는 것이 하나뿐인지
      const fits = perms(v.cards).map((arr) => { const g = v.known.map((r) => [...r]); blanks.forEach(([i, j], k) => { g[i][j] = arr[k]; }); return g; }).filter((g) => g.every((r, i) => add(r) === v.rows[i]) && g[0].every((_, j) => add(g.map((r) => r[j])) === v.cols[j]));
      assert.equal(new Set(fits.map((g) => g.flat().join())).size, 1, `${ex.id}: 칸이 하나로 정해짐`); assert.equal(fits[0].flat().join(), v.grid.flat().join(), `${ex.id}: 답`);
      assert.deepEqual(ex.steps.at(-1).figure.cells, v.grid.map((r) => r.map(String)), `${ex.id}: 마지막 그림`);
      assert.equal(nums(ex.answer).join(), v.grid.flat().join(), `${ex.id}: 답 문장`);
    } else if (v.kind === "parts") { const outs = v.values.map((x) => x / v.parts); assert.ok(outs.every(Number.isInteger), `${ex.id}: 나누어떨어짐`); assert.equal(nums(ex.answer).join(), outs.join(), `${ex.id}: 답`); }
    else if (v.kind === "cond") {
      // 조건마다 따로 다시 판단한다(예제 쪽 test 함수는 쓰지 않는다)
      const ok = (n, c) => { const d = [...String(n)].map(Number); return c.kind === "sum" || c.kind === "digitSum" ? add(d) === c.k : c.kind === "even" ? d.at(-1) % 2 === 0 : c.kind === "over" ? n > c.k : c.kind === "onesLess" ? d[0] - d[1] === c.k : c.kind === "down" ? d.every((x, i) => i === 0 || d[i - 1] - x === c.k) : c.kind === "ones" ? d.at(-1) === c.k : c.kind === "allEven" ? d.every((x) => x % 2 === 0) : c.kind === "incr" ? d[0] < d[1] && d[1] < d[2] : assert.fail(`${ex.id}: 모르는 조건 ${c.kind}`); };
      const list = []; for (let n = 10 ** (v.digits - 1); n < 10 ** v.digits; n++) if (v.conds.every((c) => ok(n, c))) list.push(n);
      assert.deepEqual(v.list, list, `${ex.id}: 조건에 맞는 수`); assert.equal(nums(ex.answer).join(), list.join(), `${ex.id}: 답`);
    } else if (v.kind === "place") { const n = Number(v.counts.join("")); assert.ok(v.counts.every((c) => c >= 0 && c <= 9)); assert.equal(v.n, n, `${ex.id}: 수`); assert.deepEqual(nums(ex.answer), [n, v.counts[v.ask]], `${ex.id}: 답`); }
    else if (v.kind === "dcount") { assert.equal(v.count, v.nums.filter((n) => String(n).length === v.digits).length); assert.ok(has(v.count)); }
    else if (v.kind === "center") {
      // 가운데마다 남은 네 장을 두 팔(두 장씩)에 나누는 모든 경우를 해 보아 두 팔의 합이 같을 수 있는지
      const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((r) => [x, ...r])));
      const centers = v.cards.filter((c) => perms(v.cards.filter((x) => x !== c)).some(([a, b, x, y]) => a + b === x + y));
      assert.deepEqual(v.centers, centers, `${ex.id}: 가운데 후보`); assert.deepEqual(nums(ex.answer), centers, `${ex.id}: 답`);
    } else if (v.kind === "line-cards") {
      const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((r) => [x, ...r])));
      const blanks = v.full.map((_, i) => i).filter((i) => v.shown[i] === undefined), lines = ex.figure.lines;
      const fits = perms(v.cards).map((arr) => v.full.map((x, i) => (v.shown[i] !== undefined ? v.shown[i] : arr[blanks.indexOf(i)]))).filter((g) => new Set(lines.map((ln) => add(ln.map((i) => g[i])))).size === 1);
      assert.equal(new Set(fits.map((g) => g.join())).size, 1, `${ex.id}: 카드 자리가 하나로 정해짐`); assert.equal(fits[0].join(), v.full.join(), `${ex.id}: 자리`);
      assert.equal(add(lines[0].map((i) => fits[0][i])), v.lineSum); assert.ok(has(v.lineSum), `${ex.id}: 답`);
    } else if (["tri-blank", "tri-shared", "tri-extreme"].includes(v.kind)) {
      // 삼각진: 세 변 [맨 위, 왼쪽 가운데, 왼쪽 아래] · [맨 위, 오른쪽 가운데, 오른쪽 아래] · [왼쪽 아래, 아래 가운데, 오른쪽 아래]
      const sides = [[0, 1, 3], [0, 2, 5], [3, 4, 5]], equal = (g) => new Set(sides.map((sd) => add(sd.map((i) => g[i])))).size === 1;
      if (v.kind === "tri-extreme") {
        const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((r) => [x, ...r])));
        const sums = perms(v.cards).filter(equal).map((g) => add(sides[0].map((i) => g[i])));
        assert.deepEqual([v.min, v.max], [Math.min(...sums), Math.max(...sums)], `${ex.id}: 가장 작은 합·큰 합`); assert.deepEqual(nums(ex.answer), [v.min, v.max]);
      } else {
        // 모르는 칸(빈칸과 □)에 1~20을 모두 넣어 세 변이 같아지는 경우의 □ 값을 모은다
        const ask = v.kind === "tri-blank" ? v.blank : v.ask, base = v.kind === "tri-blank" ? v.cells.map((x, i) => (i === ask ? null : x)) : v.cells, free = base.map((x, i) => (x === null || i === ask ? i : -1)).filter((i) => i >= 0);
        const got = new Set(), g = [...base];
        const go = (k) => { if (k === free.length) { if (equal(g)) got.add(g[ask]); return; } for (let d = 1; d <= 20; d++) { g[free[k]] = d; go(k + 1); } };
        go(0);
        const want = v.kind === "tri-blank" ? v.cells[ask] : v.value;
        assert.deepEqual([...got], [want], `${ex.id}: □가 하나로 정해짐`); assert.ok(has(want), `${ex.id}: 답`);
      }
    } else if (v.kind === "dsum") {
      v.sums.forEach((k, i) => { const list = []; for (let n = 10; n <= 99; n++) if (Math.floor(n / 10) + (n % 10) === k) list.push(n); assert.deepEqual(v.lists[i], list, `${ex.id}: 합 ${k}`); assert.ok(ex.answer.includes(`합 ${k}: ${list.length}개`)); });
    }
    else if (v.kind === "cross") { assert.equal(v.t + v.c + v.b, v.l + v.c + v.r, `${ex.id}: 두 줄의 합`); assert.ok(v.b > 0 && has(v.b)); }
    else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "book3") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), add = (xs) => xs.reduce((a, b) => a + b, 0);
    for (const item of lesson.original.items) { const vis = (item.visual || [])[0] || {}; if (vis.weights && v.weights) assert.notEqual(JSON.stringify(vis.weights), JSON.stringify(v.weights), `${ex.id}: 원본과 같은 칸`); }
    // 칸을 고르는 모든 경우(2^n)의 합을 모아 본다
    const subsetSums = (ws) => { const out = []; for (let m = 0; m < 1 << ws.length; m++) out.push(add(ws.filter((_, i) => m >> i & 1))); return out; };
    const covers = (ws) => { const got = new Set(subsetSums(ws)), max = add(ws); return [...Array(max + 1).keys()].every((x) => got.has(x)); };
    if (v.kind === "strip-fill") {
      assert.ok(v.full.every((w, i) => v.weights[i] === "?" || v.weights[i] === w), `${ex.id}: 보이는 칸 그대로`); assert.ok(covers(v.full), `${ex.id}: 0부터 빠짐없이`);
      // 빈칸이 하나 더 크면 빠지는 수가 생긴다(가장 크게 고른 값인지)
      assert.ok(!covers(v.full.map((w, i) => (v.weights[i] === "?" ? w + 1 : w))), `${ex.id}: 빈칸이 가장 큰 값`);
      assert.deepEqual(nums(ex.answer), [v.missing, add(v.full)], `${ex.id}: 답`);
    } else if (v.kind === "strip-max") {
      const ws = Array.from({ length: v.cells }, (_, i) => 2 ** i); assert.ok(covers(ws)); assert.equal(v.max, add(ws)); assert.ok(nums(ex.answer).includes(v.max));
    } else if (v.kind === "strip-read") { assert.equal(v.value, add(v.on.map((i) => v.weights[i]))); assert.ok(nums(ex.answer).includes(v.value)); }
    else if (v.kind === "strip-make") {
      const ways = []; for (let m = 0; m < 1 << v.weights.length; m++) if (add(v.weights.filter((_, i) => m >> i & 1)) === v.target) ways.push(v.weights.map((_, i) => i).filter((i) => m >> i & 1));
      assert.deepEqual(ways, [v.pick], `${ex.id}: 고르는 칸이 하나뿐`); assert.deepEqual(nums(ex.answer), v.pick.map((i) => v.weights[i]));
    } else if (v.kind === "cell-read") { const n = v.weights.length; assert.equal(v.value, add(v.on.map((k) => v.weights[k % n]))); assert.ok(nums(ex.answer).includes(v.value)); }
    else if (v.kind === "cell-max") { assert.equal(v.max, Math.max(...subsetSums([...v.weights, ...v.weights]))); assert.ok(nums(ex.answer).includes(v.max)); }
    else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "measure") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    for (const item of lesson.original.items) assert.notEqual(nums(item.prompt).join(), nums(ex.problem).join(), `${ex.id}: 원본과 같은 수`);
    if (v.kind === "pencil") {
      let len = v.L; if (len === null) { len = 1; while (len % v.a || len % v.b) len++; }
      const A = len / v.a, B = len / v.b; assert.ok(Number.isInteger(A) && Number.isInteger(B));
      assert.deepEqual(nums(ex.answer), [...(v.L === null ? [len] : []), A, B, A - B], `${ex.id}: 답`);
    } else if (v.kind === "measure") { assert.equal(v.k * v.len2, v.total); assert.ok(nums(ex.answer).includes(v.k)); }
    else if (v.kind === "measure-ratio") { assert.equal(v.k * v.count2, v.count1); assert.ok(nums(ex.answer).includes(v.k)); }
    else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "book2") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number);
    for (const item of lesson.original.items) { const vis = (item.visual || [])[0] || {}; if (vis.values) assert.notEqual(JSON.stringify(vis.values), JSON.stringify(ex.figure.values), `${ex.id}: 원본과 같은 수열`); if (vis.cells && v.kind === "sudoku") assert.notEqual(JSON.stringify(vis.cells), JSON.stringify(v.solution.map((x, i) => (v.blanks.includes(i) ? null : x))), `${ex.id}: 원본과 같은 판`); }
    if (v.kind === "period") {
      // 가장 짧은 마디인지, n번째를 처음부터 하나씩 늘어놓아 센다
      const len = v.period.length; assert.ok([...Array(len - 1).keys()].every((d) => v.period.some((x, i) => x !== v.period[(i + d + 1) % len])), `${ex.id}: 가장 짧은 마디`);
      const long = []; while (long.length < v.n) long.push(...v.period);
      assert.equal(long[v.n - 1], v.ans, `${ex.id}: ${v.n}번째`); assert.ok(ex.answer.startsWith(String(v.ans)));
    } else if (v.kind === "dual") {
      // 처음부터 하나씩 늘어놓아 n번째를 센다
      const FILL = { "○": "●", "□": "■", "△": "▲", "◇": "◆" }, line = [];
      for (let k = 0; k < v.n; k++) { const sh = v.shapes[k % v.shapes.length]; line.push(v.colors[k % v.colors.length] ? FILL[sh] : sh); }
      assert.equal(line.at(-1), v.ans, `${ex.id}: ${v.n}번째`); assert.ok(ex.answer.includes(v.ans)); assert.deepEqual(ex.figure.values, line.slice(0, 8));
    } else if (v.kind === "sudoku") {
      const n = v.n, ok = (g) => { for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const x = g[r * n + c]; if (!x) continue; for (let k = 0; k < n; k++) { if (k !== c && g[r * n + k] === x) return false; if (k !== r && g[k * n + c] === x) return false; } if (n === 4) for (let rr = r - (r % 2); rr < r - (r % 2) + 2; rr++) for (let cc = c - (c % 2); cc < c - (c % 2) + 2; cc++) if ((rr !== r || cc !== c) && g[rr * n + cc] === x) return false; } return true; };
      const sols = [], g = v.solution.map((x, i) => (v.blanks.includes(i) ? 0 : x));
      const go = (k) => { if (sols.length > 1) return; if (k === v.blanks.length) { sols.push([...g]); return; } for (let d = 1; d <= n; d++) { g[v.blanks[k]] = d; if (ok(g)) go(k + 1); g[v.blanks[k]] = 0; } };
      go(0);
      assert.equal(sols.length, 1, `${ex.id}: 답이 하나뿐`); assert.equal(sols[0].join(), v.solution.join(), `${ex.id}: 답`);
      assert.deepEqual(nums(ex.answer), v.blanks.map((i) => sols[0][i]), `${ex.id}: 답 문장`);
      assert.deepEqual(ex.steps.at(-1).figure.cells, sols[0].map(String), `${ex.id}: 마지막 그림`);
    } else assert.fail(`${ex.id}: 모르는 예제`);
  } else if (setId === "cubes") {
    const nums = (t) => (String(t).match(/\d+/gu) || []).map(Number), add = (xs) => xs.reduce((a, b) => a + b, 0);
    // 원본 그림의 쌓기나무 배치(층수 표·층별 그림)와 같으면 안 된다
    const mapsOf = (vis) => [vis.map, ...(vis.figures || []).map((f) => f.map), vis.layers].filter(Boolean).map((m) => JSON.stringify(m));
    const mine = [v.map, v.heights, v.from, v.to].filter(Boolean).map((m) => JSON.stringify(m));
    for (const item of lesson.original.items) for (const vis of [].concat(item.visual || [])) for (const m of mapsOf(vis)) assert.ok(!mine.includes(m), `${ex.id}: 원본과 같은 쌓기나무`);
    if (v.kind === "cube-sum") { assert.equal(v.total, add(v.map.flat())); assert.deepEqual(nums(ex.answer), [v.total]); }
    else if (v.kind === "cube-hidden") {
      // 쌓기나무 하나하나: 오른쪽 칸·앞 칸(같은 층)과 바로 위가 모두 차 있으면 어느 면도 안 보인다
      const h = (r, c) => v.map[r]?.[c] ?? 0; let hidden = 0;
      for (let r = 0; r < v.map.length; r++) for (let c = 0; c < v.map[r].length; c++) for (let z = 0; z < h(r, c); z++) if (h(r, c + 1) > z && h(r + 1, c) > z && h(r, c) > z + 1) hidden++;
      const total = add(v.map.flat());
      assert.deepEqual([v.total, v.hidden, v.seen], [total, hidden, total - hidden], `${ex.id}: 전체·숨은·보이는`);
      assert.deepEqual(nums(ex.answer), v.ask === "all" ? [total, total - hidden, hidden] : [hidden], `${ex.id}: 답`);
    } else if (v.kind === "cube-box") {
      const [W, H, D] = v.dims; assert.ok(v.map.length === D && v.map.every((row) => row.length === W && row.every((x) => x <= H)), `${ex.id}: 상자 안`);
      assert.equal(v.need, W * H * D - add(v.map.flat())); assert.deepEqual(nums(ex.answer), [v.need]);
    } else if (v.kind === "cube-remove") {
      assert.ok(v.to.every((row, r) => row.every((x, c) => x <= v.from[r][c])), `${ex.id}: 빼서 만들 수 있음`); assert.equal(v.diff, add(v.from.flat()) - add(v.to.flat())); assert.deepEqual(nums(ex.answer), [v.diff]);
    } else if (v.kind === "cube-parts") { assert.equal(v.vertices - v.edges + v.faces, 2, `${ex.id}: 꼭짓점 − 모서리 + 면 = 2`); assert.deepEqual(nums(ex.answer), [6, 12, 8]); }
    else if (v.kind === "cube-paint") {
      // n × n × n의 쌓기나무를 하나씩 보며 바깥에 닿은 면을 센다
      const n = v.n, counts = [0, 0, 0, 0];
      for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) { const k = [x, y, z].filter((t) => t === 0 || t === n - 1).length; counts[3 - k]++; }
      assert.deepEqual(v.counts, counts, `${ex.id}: 칠해진 면의 수별 개수`); assert.deepEqual(nums(ex.answer), counts);
    } else if (v.kind === "cube-views") {
      const front = v.heights[0].map((_, c) => Math.max(...v.heights.map((row) => row[c]))), side = [...v.heights].reverse().map((row) => Math.max(...row));
      assert.deepEqual([v.front, v.side], [front, side], `${ex.id}: 앞·옆에서 본 층수`); assert.deepEqual(nums(ex.answer), [...front, ...side]);
      if (ex.figure.kind === "b4-layers") { const L = ex.figure.layers; assert.deepEqual(v.heights, L[0].map((row, r) => row.map((_, c) => add(L.map((l) => l[r][c])))), `${ex.id}: 층을 겹친 층수`); L.slice(1).forEach((l, k) => l.forEach((row, r) => row.forEach((x, c) => assert.ok(!x || L[k][r][c], `${ex.id}: 아래층이 받친다`)))); }
    } else assert.fail(`${ex.id}: 모르는 예제`);
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
