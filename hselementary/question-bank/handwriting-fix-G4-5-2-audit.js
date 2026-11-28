"use strict";
// 2026-11-28 hw-G4-5-2: 5-2 3단원 합동 문항을 책(생각하는 황소 5-2 심화)의 손글씨·선생님 채점 답과 대조해 고친 결과를 확인한다.
// 기준: 초등 합동 조건(세 변 SSS, 두 변과 끼인각 SAS, 한 변과 양 끝 각 ASA)만 인정하고,
// 긴 변의 대각이 주어지는 경우(SSA)는 삼각형이 하나로 정해지는 조건으로 인정하지 않는다.
// 실행: node handwriting-fix-G4-5-2-audit.js
const assert = require("node:assert/strict");

global.window = {};
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-u3-page24-example14-original.js");
require("./source-5-2-u3-page25-mission14-originals.js");
require("./source-5-2-u3-page27-originals.js");
require("./source-5-2-congruence-page87-practice.js");
const m5Synthetic = require("./source-5-2-u3-page25-mission5-synthetic.js");
const e14Synthetic = require("./source-5-2-u3-page24-example14-synthetic.js");
const m6Synthetic = require("./source-5-2-u3-page25-mission6-synthetic.js");
require("./source-5-2-u3-p86-q16-clarified-similar.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2");
const types = semester.units.flatMap(u => u.subunits.flatMap(su => su.types));
const text = html => String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const compact = s => text(s).replace(/\s+/g, "");

// 독립 검산 1: 그림 속 모든 삼각형의 합동 쌍(밑변 6등분, 꼭짓점 ㄱ 연결) = 9쌍, 작은 조각끼리만은 3쌍.
{
  const apex = { x: 165, y: 20 }, base = Array.from({ length: 7 }, (_, i) => ({ x: 30 + 45 * i, y: 180 }));
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  const tris = [];
  for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) tris.push([i, j]);
  const sig = ([i, j]) => [dist(apex, base[i]), dist(apex, base[j]), dist(base[i], base[j])].sort((a, b) => a - b).map(v => v.toFixed(6)).join(",");
  let pairs = 0, smallPairs = 0;
  for (let a = 0; a < tris.length; a++) for (let b = a + 1; b < tris.length; b++) if (sig(tris[a]) === sig(tris[b])) {
    pairs++;
    if (tris[a][1] - tris[a][0] === 1 && tris[b][1] - tris[b][0] === 1) smallPairs++;
  }
  assert.equal(tris.length, 21);
  assert.equal(pairs, 9, "그림 속 21개 삼각형의 합동 쌍은 9쌍");
  assert.equal(smallPairs, 3, "작은 조각 6개끼리만 세면 3쌍(예전 앱 범위)");
}

// 독립 검산 2: Mission 6 원문 그림(ㄱㄴ 3.5, ㄴㄷ 4, ㄱㄹ 2.5, 각 ㄷ 80°, ㄷㄹ 2)과 각 ㄴ·대각선 ㄱㄷ이 같은 다른 볼록사각형(ㄷㄹ 약 5.14).
{
  const c = Math.cos(80 * Math.PI / 180), s = Math.sin(80 * Math.PI / 180);
  const place = t => {
    const R = { x: 4 - t * c, y: t * s }, nr = Math.hypot(R.x, R.y), along = (3.5 ** 2 - 2.5 ** 2 + nr ** 2) / (2 * nr), off = Math.sqrt(3.5 ** 2 - along ** 2);
    return { R, G: { x: (along * R.x - off * R.y) / nr, y: (along * R.y + off * R.x) / nr } };
  };
  const fig = place(2), N = { x: 0, y: 0 }, D = { x: 4, y: 0 };
  const wx = 4 - fig.G.x, wy = -fig.G.y, proj = -c * wx + s * wy, disc = proj ** 2 - (wx ** 2 + wy ** 2 - 2.5 ** 2);
  const roots = [-proj - Math.sqrt(disc), -proj + Math.sqrt(disc)];
  assert(Math.abs(roots[0] - 2) < 1e-9 && Math.abs(roots[1] - 5.14) < 0.01, "같은 각 ㄴ·대각선 ㄱㄷ으로 ㄷㄹ 2cm와 약 5.14cm");
  const R2 = { x: 4 - roots[1] * c, y: roots[1] * s }, pts = [N, D, R2, fig.G];
  assert(pts.every((p, i) => { const q = pts[(i + 1) % 4], r = pts[(i + 2) % 4]; return (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x) > 0; }), "두 번째 사각형도 볼록");
}

// 독립 검산 3: Mission 5 원문 각 ㄴ 30°의 두 해, 예제 1-4 원문 각 ㄴ 100°의 두 볼록 사각형.
{
  const t = Math.PI / 6, r = Math.sqrt(16 - (7 * Math.sin(t)) ** 2);
  assert(Math.abs(7 * Math.cos(t) - r - 4.13) < 0.01 && Math.abs(7 * Math.cos(t) + r - 8.0) < 0.01);
  const u = { x: Math.cos(100 * Math.PI / 180), y: Math.sin(100 * Math.PI / 180) }, Dp = { x: 8, y: 5 };
  const bq = -2 * (u.x * Dp.x + u.y * Dp.y), cq = Dp.x ** 2 + Dp.y ** 2 - 81, sq = Math.sqrt(bq * bq - 4 * cq);
  const ab = [(-bq - sq) / 2, (-bq + sq) / 2];
  assert(Math.abs(ab[0] - 1.41) < 0.01 && Math.abs(ab[1] - 5.66) < 0.01);
}

const expected = [
  ["5-2-u3-e1-mission-5-original", "①, ④", ["끼인각", "①, ④"], ["원 안에", "교점이 하나"]],
  ["5-2-u3-e1-mission-6-original", "①", ["5.14", "합동 조건"], ["0.45", "0.94", "교점은 하나"]],
  ["5-2-u3-e1-example-4-original", "변 ㄱㄴ, 각 ㄹ, 대각선 ㄱㄷ", ["각 ㄱㄹㄴ", "1.41", "합동 조건"], ["한 점에서 만", "안에 포함"]],
  ["5-2-u3-practice-10-original", "각 ㄱㄷㄴ", ["끼인각", "합동 조건"], ["또는", "한 번만", "원의 안쪽"]],
  ["5-2-u3-practice-13-original", "(1) 변 ㄴㄷ, (2) 변 ㅁㅂ", ["변 ㄴㄷ", "변 ㅁㅂ", "합동 조건"], ["한 점에서만", "두 변 중 하나", "원 안에"]],
  ["5-2-u3-practice-8-original", "③, ④", ["합동 조건"], ["일반적으로"]],
  ["5-2-u3-e2-mission-6-scope", "9쌍", ["21", "9쌍"], ["만든 6개의 삼각형 중에서"]],
];
let checks = 0;
for (const [id, answer, mustHave, mustNot] of expected) {
  const type = types.find(t => t.id === id);
  assert(type, `${id}: 유형이 있어야 합니다`);
  for (const difficulty of [-1, 0, 1]) for (const seed of [1, 7, 20261128]) {
    const q = api.generate(type, 3, difficulty, seed, type.variant || 0);
    assert(q, `${id} d${difficulty} s${seed}: 문항 생성`);
    assert.equal(q.answer, answer, `${id} d${difficulty}: 답`);
    const sol = text(q.solution), all = text(q.prompt) + " " + sol;
    assert(compact(q.solution).includes(compact(answer)), `${id}: 풀이에 답이 있어야 합니다`);
    for (const word of mustHave) assert(sol.includes(word), `${id}: 풀이에 「${word}」`);
    for (const word of mustNot) assert(!all.includes(word), `${id}: 「${word}」가 남아 있으면 안 됩니다`);
    checks++;
  }
}
// 목록 밖 유사문항 4개도 같은 기준(초등 합동 조건)으로: 세 변형 × 세 난이도.
{
  const marks = ["①", "②", "③", "④", "⑤", "⑥"];
  const sets = [
    ["5-2-u3-e1-mission-5", m5Synthetic, [0, 3]],          // 변 ㄱㄴ(SSS), 각 ㄴㄷㄱ(SAS). 각 ㄴㄱㄷ(SSA)은 뺌
    ["5-2-u3-e1-example-4", e14Synthetic, [0, 1, 3]],      // 변 ㄱㄴ, 대각선 ㄱㄷ, 각 ㄱㄹㄷ. 각 ㄴㄱㄹ(SSA)은 뺌
    ["5-2-u3-e1-mission-6", m6Synthetic, [0]],             // 변 ㄷㄹ만. 각 ㄱㄹㄷ은 합동 조건으로 정할 수 없어 뺌
  ];
  for (const [id, mod, keep] of sets) {
    const type = types.find(t => t.id === id);
    for (let v = 0; v < 3; v++) for (const difficulty of [-1, 0, 1]) {
      const q = api.generate(type, 3, difficulty, 1, v);
      const expectedAnswer = mod.pools[v].order.map((x, n) => keep.includes(x) ? marks[n] : null).filter(Boolean).join(", ");
      assert.equal(q.answer, expectedAnswer, `${id} v${v} d${difficulty}: 답`);
      assert(text(q.prompt).includes("합동 조건"), `${id}: 문장이 합동 조건 기준`);
      assert(!/항상 (한 가지|하나)로 정해지는지/.test(text(q.prompt)), `${id}: 옛 문장`);
      assert(compact(q.solution).includes(compact(expectedAnswer)), `${id}: 풀이에 답`);
      for (const word of ["한 점에서 만나", "가능한 교점은 한 개", "원과 한 점"]) assert(!text(q.solution).includes(word), `${id}: SSA 인정 문장 「${word}」`);
      checks++;
    }
  }
  const q16 = types.find(t => t.id === "5-2-u3-practice-16-clarified-similar");
  for (const difficulty of [-1, 0, 1]) {
    const q = api.generate(q16, 3, difficulty, 1, 0);
    assert.equal(q.answer, "ㄱ, ㅁ, ㅂ");
    assert(text(q.prompt).includes("합동 조건") && !text(q.prompt).includes("언제나"));
    assert(!text(q.solution).includes("한 점에서 만납니다") && text(q.solution).includes("55°"));
    checks++;
  }
}
// Mission 6(27쪽) 문장은 책처럼 범위를 따로 좁히지 않는다.
{
  const type = types.find(t => t.id === "5-2-u3-e2-mission-6-scope");
  const prompt = text(api.generate(type, 3, 0, 1, 0).prompt);
  assert(prompt.includes("6개의 삼각형을 만들었다. 합동인 삼각형은 모두 몇 쌍인가?"));
  assert(!/범위 명시/.test(type.name + type.sourceItemLabel));
}
console.log(`PASS: handwriting-fix-G4-5-2 (${checks} generated checks, 3 independent geometry checks)`);
