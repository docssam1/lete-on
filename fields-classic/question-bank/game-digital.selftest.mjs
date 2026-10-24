// 디지털 숫자 공방 검사: node fields-classic/question-bank/game-digital.selftest.mjs
// ① 이 게임의 막대 옮기기 표가 모든 숫자·움직임에서 문제은행 함수(transformDigit)와 같은 숫자를 만든다
// ② 자리까지 옮기면 문제은행 transformDisplay와 같은 두 자리 수가 된다 ③ 문제 조건(바뀜·0으로 시작 안 함·자리 실수 구별)
// ④ 실수별 말: 자리 순서 그대로 / 다른 방향 ⑤ 숫자판: 고른 숫자 = 문제은행 규칙((누운 정도 + 돌린 정도) % 4 = 0)
import assert from "node:assert/strict";
import { DIGIT_SEGMENTS, SEGMENT_MAPS, LEVELS, makeProblem, diagnoseBuild, segTarget } from "./game-digital.js";
import { BOOK01_INTERNALS } from "./book01-generators.js";
const { transformDigit, transformDisplay } = BOOK01_INTERNALS;
const byShape = Object.fromEntries(Object.entries(DIGIT_SEGMENTS).map(([d, s]) => [[...s].sort().join(""), Number(d)]));
for (const op of Object.keys(SEGMENT_MAPS)) for (let d = 0; d <= 9; d++) {
  const moved = [...DIGIT_SEGMENTS[d]].map((s) => SEGMENT_MAPS[op][s]).sort().join("");
  assert.equal(byShape[moved] ?? null, transformDigit(d, op) ?? null, `${op} ${d}`);
}
let seed = 11; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
let n = 0;
for (let r = 0; r < 80; r++) for (const [level, lv] of LEVELS.entries()) for (const [index] of lv.problems.entries()) {
  const p = makeProblem(level, index, rand); n++;
  if (p.kind === "board") {
    const steps = { "rotate-right": 1, "rotate-left": 3, "rotate-half": 2 }[p.op];
    assert.deepEqual(p.targets, p.cells.map((c, i) => ((c.orientation + steps) % 4 === 0 ? i : -1)).filter((i) => i >= 0));
    assert.ok(p.targets.length >= 2 && p.targets.length <= 4);
    assert.equal(new Set(p.cells.map((c) => c.digit)).size, 9);
    continue;
  }
  assert.deepEqual(p.result, transformDisplay(p.digits, p.op) ?? [transformDigit(p.digits[0], p.op)]);
  assert.notEqual(p.result.join(""), p.digits.join(""));
  if (p.digits.length === 2) { assert.notEqual(p.digits[0], 0); assert.notEqual(p.result[0], 0); }
  const right = p.digits.flatMap((d, i) => [...DIGIT_SEGMENTS[d]].map((s) => segTarget(p.op, i, s, p.digits.length)));
  assert.equal(diagnoseBuild(p, right).ok, true);
  const shape = right.map(([j, t]) => [j, t]);
  // 화면에 만든 막대 = 정답 숫자
  for (let j = 0; j < p.digits.length; j++) assert.equal(byShape[shape.filter(([k]) => k === j).map(([, t]) => t).sort().join("")], p.result[j]);
  if (p.digits.length === 2 && p.op !== "mirror-top-bottom") {
    const noSwap = p.digits.flatMap((d, i) => [...DIGIT_SEGMENTS[d]].map((s) => [i, SEGMENT_MAPS[p.op][s]]));
    assert.match(diagnoseBuild(p, noSwap).say, /자리 순서/);
  }
  if (p.op === "mirror-left-right") {
    const other = p.digits.flatMap((d, i) => [...DIGIT_SEGMENTS[d]].map((s) => [p.digits.length - 1 - i, SEGMENT_MAPS["mirror-top-bottom"][s]]));
    const v = diagnoseBuild(p, other);
    if (!v.ok) assert.ok(/위와 아래|자리/.test(v.say) || v.wrong >= 0);
  }
  if (p.kind === "add") assert.equal(p.sum, p.value + p.read);
}
console.log(`DIGITAL_OK problems=${n} levels=${LEVELS.length}`);
