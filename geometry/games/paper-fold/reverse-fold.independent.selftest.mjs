/* 레벨 3 · 접는 방법 거꾸로 찾기 — 독립 검산 (D5).

   reverse-fold.js를 가져오지 않는다. levels.js에서 문제 데이터(종이 꼭짓점,
   후보 선의 양 끝점, 보여 주는 결과 조각)만 읽고, 접기는 여기서 따로 계산한다.

   접기 모형(다각형 자르기 없이 점마다 판정):
     접은 결과 = { 점 q : q가 고정되는 쪽 반평면에 있고, q 또는 q의 반사점이 종이 안 }
   종이를 접는 선에 대해 반사하는 것과 같다. 모양은 같은 격자의 칸으로 비교한다.

   검산하는 주장
   1. 손 계산 예: 직사각형 종이를 세로 가운데 선으로 접으면 오른쪽 반만 남는다.
      이 모형이 넓이를 손 계산과 같게 내는지 먼저 확인한다.
   2. 접는 선 고르기 12문항: 정답 선으로 접으면 보여 준 모양이 나오고, 다른 두 후보
      선으로는 어느 쪽을 접어도 그 모양이 나오지 않는다.
   3. 같은 12문항: 각도 1° · 오프셋 120단계로 모든 선을 훑어도, 정답 선과 다른 선은
      보여 준 모양에 가까이 가지 않는다(정답 선의 유일성, 유한 표본 범위 안에서).
   4. 모두 고르기 12문항: 정답 보기는 어떤 한 번 접기로 나오고, 오답 보기는 훑은
      모든 접기와 멀다(불가능, 유한 표본 범위 안에서).

   한계: 3과 4는 1° 간격 · 유한 오프셋의 표본 검사다. 연속적인 모든 선에 대한
   증명이 아니다. 대신 판정 문턱과 실제 여유를 함께 출력해 얼마나 떨어져 있는지
   보이게 한다. */

import assert from "node:assert/strict";
import { levels } from "./levels.js";
import { pickCrease, CREASE_TOUCH } from "./crease-touch.js";

const DOMAIN = { min: -0.15, max: 1.15 };
const N = 81;                       // 격자 한 변의 칸 수
const ANGLES = 180;                 // 0°..179°
const OFFSETS = 120;                // 종이 투영 범위 안쪽 오프셋 수
const cell = (DOMAIN.max - DOMAIN.min) / N;
const xs = Array.from({ length: N }, (_, index) => DOMAIN.min + (index + 0.5) * cell);

function inside(polygon, x, y) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) result = !result;
  }
  return result;
}

function rasterPieces(pieces) {
  const mask = new Uint8Array(N * N);
  for (let row = 0; row < N; row += 1) for (let col = 0; col < N; col += 1) {
    if (pieces.some((piece) => inside(piece, xs[col], xs[row]))) mask[row * N + col] = 1;
  }
  return mask;
}

/* 선: nx*x + ny*y = offset. keep = +1이면 nx*x+ny*y >= offset 쪽이 고정된다. */
function foldMask(paper, nx, ny, offset, keep, out = new Uint8Array(N * N)) {
  for (let row = 0; row < N; row += 1) {
    const y = xs[row];
    for (let col = 0; col < N; col += 1) {
      const x = xs[col];
      const signed = nx * x + ny * y - offset;
      let value = 0;
      if (keep * signed >= 0) {
        if (inside(paper, x, y)) value = 1;
        else if (inside(paper, x - 2 * signed * nx, y - 2 * signed * ny)) value = 1;
      }
      out[row * N + col] = value;
    }
  }
  return out;
}

const count = (mask) => mask.reduce((sum, value) => sum + value, 0);
const difference = (a, b) => { let total = 0; for (let index = 0; index < a.length; index += 1) total += a[index] !== b[index]; return total; };

function lineFromChord([a, b]) {
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const nx = -(b.y - a.y) / length;
  const ny = (b.x - a.x) / length;
  return { nx, ny, offset: nx * a.x + ny * a.y };
}

/* 두 선이 사실상 같은 선인지: 종이 꼭짓점마다 두 선까지의 부호 있는 거리 차이를
   재어 가장 큰 값이 0.1 미만이면 같은 선으로 본다. 후보 선끼리 서로 달라야 한다는
   기준(종이 위에서 0.1 이상 떨어짐)과 같은 크기다. */
function lineGap(left, right, paper) {
  const sign = left.nx * right.nx + left.ny * right.ny >= 0 ? 1 : -1;
  return Math.max(...paper.map((point) => Math.abs(
    (left.nx * point.x + left.ny * point.y - left.offset) - sign * (right.nx * point.x + right.ny * point.y - right.offset)
  )));
}
const SAME_LINE_GAP = 0.1;

/* 1. 손 계산 예. 직사각형 (0.12,0.22)-(0.88,0.78)을 x = 0.5에서 접고 오른쪽을
   고정하면 0.38 x 0.56 = 0.2128만 남는다. */
{
  const rectangle = [{ x: 0.12, y: 0.22 }, { x: 0.88, y: 0.22 }, { x: 0.88, y: 0.78 }, { x: 0.12, y: 0.78 }];
  const folded = foldMask(rectangle, 1, 0, 0.5, 1);
  const area = count(folded) * cell * cell;
  assert.ok(Math.abs(area - 0.38 * 0.56) < 0.012, `hand example: area ${area.toFixed(4)} should be 0.2128`);
  const left = foldMask(rectangle, 1, 0, 0.5, -1);
  /* 접는 선 위의 한 열은 반올림에 따라 한쪽에만 들어갈 수 있다. */
  assert.ok(Math.abs(count(left) - count(folded)) <= N, "hand example: both halves of a centred fold are equal");
}

const level = levels[2];
const linePick = level.problems.filter((problem) => problem.interaction === "fold-line-pick");
const multi = level.problems.filter((problem) => problem.interaction === "fold-result-multi");
assert.equal(linePick.length, 12);
assert.equal(multi.length, 12);

/* 같은 종이의 모든 접기를 한 번만 계산해 둔다. */
const sweeps = new Map();
function sweepFor(paper) {
  const key = JSON.stringify(paper);
  if (sweeps.has(key)) return sweeps.get(key);
  const folds = [];
  for (let step = 0; step < ANGLES; step += 1) {
    const angle = (step * Math.PI) / ANGLES;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const projections = paper.map((point) => nx * point.x + ny * point.y);
    const low = Math.min(...projections);
    const high = Math.max(...projections);
    for (let index = 1; index <= OFFSETS; index += 1) {
      const offset = low + ((high - low) * index) / (OFFSETS + 1);
      for (const keep of [1, -1]) folds.push({ line: { nx, ny, offset }, keep, mask: foldMask(paper, nx, ny, offset, keep) });
    }
  }
  sweeps.set(key, folds);
  return folds;
}

const frameCells = N * N;
const margins = { answerMax: 0, distractorMin: Infinity, farMin: Infinity, correctMax: 0, wrongMin: Infinity };

/* 판정 문턱(격자 칸 수). 정답 쪽은 경계 칸 반올림만 허용하고, 다른 쪽은
   문턱보다 충분히 멀어야 한다. 실제 값은 끝에 출력한다. */
const SAME = Math.round(frameCells * 0.004);   // 같은 모양으로 볼 최대 차이
const APART = Math.round(frameCells * 0.012);  // 다른 모양으로 볼 최소 차이
/* 정답과 다른 선 중 가장 가까운 접기는 정답 모양과 1% 안팎까지 다가갈 수 있다
   (모서리 근처를 아주 조금 접는 선). 유일성 판정은 이 값이 정답 선의 오차(SAME)보다
   충분히 큰지로 본다. */
const FAR = Math.round(frameCells * 0.006);

for (const problem of linePick) {
  const shown = rasterPieces(problem.resultPieces);
  const answer = problem.lineChoices.find((choice) => choice.key === problem.answerKey);
  const answerLine = lineFromChord(answer.chord);
  const answerBest = Math.min(...[1, -1].map((keep) => difference(foldMask(problem.paper, answerLine.nx, answerLine.ny, answerLine.offset, keep), shown)));
  assert.ok(answerBest <= SAME, `${problem.id}: folding on the answer crease gives a different shape (${answerBest} cells)`);
  margins.answerMax = Math.max(margins.answerMax, answerBest);

  for (const choice of problem.lineChoices.filter((item) => item.key !== problem.answerKey)) {
    const line = lineFromChord(choice.chord);
    const best = Math.min(...[1, -1].map((keep) => difference(foldMask(problem.paper, line.nx, line.ny, line.offset, keep), shown)));
    assert.ok(best >= APART, `${problem.id}: crease ${choice.key} also makes the shown shape (${best} cells)`);
    margins.distractorMin = Math.min(margins.distractorMin, best);
  }

  let far = Infinity;
  for (const fold of sweepFor(problem.paper)) {
    if (lineGap(fold.line, answerLine, problem.paper) < SAME_LINE_GAP) continue;
    far = Math.min(far, difference(fold.mask, shown));
  }
  assert.ok(far >= FAR, `${problem.id}: a different crease comes within ${far} cells of the shown shape`);
  margins.farMin = Math.min(margins.farMin, far);
}

let correctOptions = 0;
let wrongOptions = 0;
for (const problem of multi) {
  const folds = sweepFor(problem.paper);
  for (const option of problem.resultOptions) {
    const mask = rasterPieces(option.pieces);
    let best = Infinity;
    for (const fold of folds) {
      const value = difference(fold.mask, mask);
      if (value < best) best = value;
      if (best === 0) break;
    }
    const correct = problem.answerKeys.includes(option.key);
    if (correct) {
      /* 1° 표본이라 정답 선과 정확히 같은 선이 없을 수 있다. 문턱을 조금 넓게 둔다. */
      assert.ok(best <= SAME * 3, `${problem.id}:${option.key} is marked possible but no sampled fold makes it (${best} cells)`);
      margins.correctMax = Math.max(margins.correctMax, best);
      correctOptions += 1;
    } else {
      assert.ok(best >= APART, `${problem.id}:${option.key} is marked impossible but a fold comes within ${best} cells`);
      margins.wrongMin = Math.min(margins.wrongMin, best);
      wrongOptions += 1;
    }
  }
  assert.equal(problem.answerKeys.length, 2, `${problem.id}: the multi-answer contract is two answers`);
}

/* 5. 접는 선 터치 규칙(D3, crease-touch.js). 1단위 = 200px로 놓고 두 선이 X자로
   만나는 경우를 직접 계산한다. */
{
  const choices = [
    { key: "a", chord: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },
    { key: "b", chord: [{ x: 0, y: 1 }, { x: 1, y: 0 }] }
  ];
  const px = 200;
  assert.equal(pickCrease({ x: 0.5, y: 0.5 }, choices, px).kind, "tie", "touch: the crossing point is not judged");
  assert.equal(pickCrease({ x: 0.52, y: 0.5 }, choices, px).kind, "tie", "touch: 4px from the crossing is not judged");
  assert.deepEqual(pickCrease({ x: 0.2, y: 0.25 }, choices, px).key, "a", "touch: near line a picks a");
  assert.equal(pickCrease({ x: 0.5, y: 0.1 }, choices, px).kind, "miss", "touch: far from both lines picks nothing");
  const edge = CREASE_TOUCH.radiusPx / px;
  assert.equal(pickCrease({ x: 0.2 + edge * 0.9 * Math.SQRT1_2, y: 0.2 - edge * 0.9 * Math.SQRT1_2 }, choices, px).key, "a", "touch: just inside the radius picks the line");
  assert.equal(pickCrease({ x: 0.2 + edge * 1.1 * Math.SQRT1_2, y: 0.2 - edge * 1.1 * Math.SQRT1_2 }, choices, px).kind, "miss", "touch: just outside the radius picks nothing");
}

const percent = (cells) => `${((cells / frameCells) * 100).toFixed(2)}%`;
console.log([
  `Reverse fold independent check passed (no reverse-fold.js): hand example, ${linePick.length} crease picks, ${multi.length} multi-answer sets, crease touch rule (crossing, near, far, radius edge).`,
  `Grid ${N}x${N}, ${ANGLES} angles x ${OFFSETS} offsets x 2 sides per paper, ${sweeps.size} papers.`,
  `Thresholds: same <= ${SAME} cells (${percent(SAME)}), other candidate or impossible >= ${APART} (${percent(APART)}), other swept crease >= ${FAR} (${percent(FAR)}).`,
  `Margins: answer crease <= ${margins.answerMax}, other candidate creases >= ${margins.distractorMin}, every other swept crease >= ${margins.farMin},`,
  `${correctOptions} possible options <= ${margins.correctMax}, ${wrongOptions} impossible options >= ${margins.wrongMin} cells.`,
  "Claims 3 and 4 are finite-sample checks (1 degree, fixed offsets), not a proof over every continuous line."
].join(" "));
