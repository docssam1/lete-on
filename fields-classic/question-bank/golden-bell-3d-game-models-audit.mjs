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
