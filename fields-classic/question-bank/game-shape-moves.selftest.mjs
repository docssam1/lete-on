// 뒤집고 돌리기 공방 검사: node fields-classic/question-bank/game-shape-moves.selftest.mjs
// ① 칸 옮기기는 문제은행 생성기(book01-generators.js transformPattern)와 같다 ② 만든 모양마다 일곱 움직임의 결과가 서로 다르다(실수를 가려낼 수 있다)
// ③ 흔한 실수마다 알맞은 말을 한다 ④ 정답은 정답으로 받는다
import assert from "node:assert/strict";
import { LEVELS, OPS, makeProblem, diagnose } from "./game-shape-moves.js";
import { BOOK01_INTERNALS } from "./book01-generators.js";
const { transformPattern, patternKey } = BOOK01_INTERNALS;
let seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
let checked = 0;
for (let round = 0; round < 60; round++) for (const [level, lv] of LEVELS.entries()) for (const [index, names] of lv.problems.entries()) {
  const p = makeProblem(level, index, rand);
  assert.equal(p.source.length, lv.cells);
  const keys = new Set([p.source, ...["mirror-left-right", "mirror-top-bottom", "rotate-left", "rotate-right", "rotate-half"].map((op) => transformPattern(p.source, op, 4))].map(patternKey));
  assert.equal(keys.size, 6, "처음 모양은 어느 움직임에도 겹치지 않는다");
  names.forEach((name, k) => {
    const from = p.boards[k], want = p.boards[k + 1];
    assert.equal(patternKey(want), patternKey(transformPattern(from, OPS[name].op, 4)));
    assert.equal(diagnose(from, want, name).ok, true);
    assert.equal(diagnose(from, from, name).ok, false);
    checked++;
  });
}
const shape = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]];
const T = (op) => transformPattern(shape, op, 4);
assert.match(diagnose(shape, T("mirror-left-right"), "flip-down").say, /좌우를 바꿨어요/);
assert.match(diagnose(shape, T("mirror-top-bottom"), "flip-right").say, /위아래를 바꿨어요/);
assert.match(diagnose(shape, T("rotate-left"), "rotate-right").say, /반대 방향/);
assert.match(diagnose(shape, T("rotate-half"), "rotate-left").say, /반 바퀴만큼/);
assert.match(diagnose(shape, T("rotate-right"), "rotate-half").say, /반의 반 바퀴만/);
assert.match(diagnose(shape, T("mirror-top-bottom"), "rotate-right").say, /뒤집은 모양/);
assert.match(diagnose(shape, T("rotate-right"), "flip-left").say, /돌린 모양/);
assert.equal(diagnose(shape, T("mirror-left-right"), "flip-left").ok, true, "왼쪽으로 뒤집기 = 오른쪽으로 뒤집기의 결과");
console.log(`SHAPE_MOVES_OK steps=${checked} levels=${LEVELS.length} problems=${LEVELS.reduce((s, l) => s + l.problems.length, 0)}`);
