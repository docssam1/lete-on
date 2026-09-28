/* 레벨 3 · 접는 방법 거꾸로 찾기 검산.

   핵심은 전수 탐색이다. 각도 0~179도를 1도 간격, 오프셋을 그 각도의 투영 구간에서
   200단계로 훑어 한 번 접어 만들 수 있는 모든 모양을 구하고,
   (A) 정답 선과 멀리 떨어진 선으로는 그 결과가 나오지 않는다는 것,
   (B) 오답 후보는 어떤 접는 선으로도 만들 수 없다는 것을 확인한다.

   원본 33장의 도형과 보기는 대조하지 않았다. 여기서 증명하는 것은 학습 행동과
   수학 계약이며, 출처 대조는 `25_PAPER_FOLD_SOURCE_COVERAGE.md`에서 `부분`이다. */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { levels, validateLevels } from "./levels.js";
import { seededRandom, sessionQueue, visualProblemKey } from "./session-order.js";
import {
  PAPER_SHAPES, REVERSE_SHAPE_ORDER, REVERSE_VARIANTS, SIGNATURE_SIZES,
  buildFoldLineProblem, buildFoldResultProblem, foldOnce, lineGap, polygonArea, polygonCentroid,
  rasterBitmap, sameBitmap, signatureKey, sizeSignature, spanDifference, spanSetOf, sweepFolds
} from "./reverse-fold.js";

validateLevels();

const ANGLE_STEPS = 180;
const OFFSET_STEPS = 200;
const CLOSE_RATIO = 0.005;
const SAME_LINE_LIMIT = 0.05;

const level = levels[2];
assert.equal(level.id, 3);
assert.equal(level.strand, "reverse-fold");
assert.equal(level.title.ko, "접는 방법 거꾸로 찾기");
assert.equal(level.problems.length, REVERSE_SHAPE_ORDER.length * REVERSE_VARIANTS * 2);

const lineProblems = level.problems.filter((problem) => problem.interaction === "fold-line-pick");
const resultProblems = level.problems.filter((problem) => problem.interaction === "fold-result-multi");
assert.equal(lineProblems.length, REVERSE_SHAPE_ORDER.length * REVERSE_VARIANTS);
assert.equal(resultProblems.length, REVERSE_SHAPE_ORDER.length * REVERSE_VARIANTS);

/* 출처 표시: 학습 행동만 구현했으므로 어떤 문항도 full이 아니다. */
for (const problem of level.problems) {
  assert.equal(problem.sourceCoverage, "partial");
  assert.match(problem.sourceRef, /^user-reference\.paper-fold\.reverse-fold-/);
  assert.equal(problem.sourceAuditRefs.length, 1);
  assert.ok(["PF-C06", "PF-C07", "PF-C08"].includes(problem.sourceAuditRefs[0]));
  assert.ok(PAPER_SHAPES[problem.paperId], `unknown paper shape ${problem.paperId}`);
  for (const language of ["ko", "zh", "ja", "en"]) assert.ok(problem.paperLabel[language]);
}
assert.deepEqual(new Set(lineProblems.map((problem) => problem.sourceAuditRefs[0])), new Set(["PF-C06"]));
assert.deepEqual(new Set(resultProblems.map((problem) => problem.sourceAuditRefs[0])), new Set(["PF-C07", "PF-C08"]));

/* (A) 답 계약: 후보 선 셋 이상, 정답 하나. (B) 답 계약: 보기 넷, 정답 둘·오답 둘. */
for (const problem of lineProblems) {
  assert.equal(problem.answerContract, "single");
  assert.ok(problem.lineChoices.length >= 3);
  const correct = problem.lineChoices.filter((choice) => choice.correct);
  assert.equal(correct.length, 1);
  assert.equal(correct[0].key, problem.answerKey);
  assert.deepEqual(problem.lineChoices.map((choice) => choice.key), problem.lineChoices.map((_, index) => String.fromCharCode(97 + index)));
  assert.equal(problem.resultPieces.length, 2);
  assert.ok(problem.resultPieces.every((piece) => piece.length >= 3));
}
for (const problem of resultProblems) {
  assert.equal(problem.answerContract, "multiple");
  assert.equal(problem.resultOptions.length, 4);
  assert.equal(problem.answerKeys.length, 2);
  assert.equal(problem.resultOptions.filter((choice) => choice.correct).length, 2);
  assert.equal(problem.resultOptions.filter((choice) => !choice.correct).length, 2);
  assert.deepEqual(problem.resultOptions.filter((choice) => choice.correct).map((choice) => choice.key), problem.answerKeys);
  assert.equal(new Set(problem.resultOptions.map((choice) => choice.signature)).size, 4);
  assert.equal(problem.creaseHints.length, 2);
  for (const choice of problem.resultOptions) {
    assert.equal(choice.pieces.length, 2);
    assert.equal(choice.crease.length, 2);
  }
}

/* 모든 그림은 한 문제 안에서 같은 좌표 틀을 쓴다. 위치·회전이 답을 가르므로
   보기마다 축척이나 위치가 달라지면 안 된다. */
for (const problem of level.problems) {
  const shapes = problem.interaction === "fold-line-pick"
    ? [problem.paper, ...problem.resultPieces, ...problem.lineChoices.map((choice) => choice.band)]
    : [problem.paper, ...problem.resultOptions.flatMap((choice) => choice.pieces)];
  for (const shape of shapes) {
    for (const point of shape) {
      assert.ok(point.x >= problem.frame.x - 1e-6 && point.x <= problem.frame.x + problem.frame.size + 1e-6, `frame misses x in ${problem.id}`);
      assert.ok(point.y >= problem.frame.y - 1e-6 && point.y <= problem.frame.y + problem.frame.size + 1e-6, `frame misses y in ${problem.id}`);
      assert.ok(point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1, `figure leaves the picture in ${problem.id}`);
    }
  }
}

/* 접기 화살표는 처음 그림에만 놓고, 화살표 전체가 종이 안에 있어야 한다. */
for (const problem of lineProblems) {
  const arrow = problem.lineChoices.find((choice) => choice.correct).arrow;
  assert.ok(arrow && arrow.samples.length === 11, `missing fold arrow for ${problem.id}`);
}
for (const problem of resultProblems) {
  for (const hint of problem.creaseHints) assert.ok(hint.arrow && hint.arrow.samples.length === 11, `missing fold arrow for ${problem.id}`);
}

/* 래스터 서명은 두 해상도 모두 일치할 때만 같은 모양이다. */
let bitmapChecks = 0;
for (const problem of resultProblems) {
  for (const choice of problem.resultOptions) {
    for (const size of SIGNATURE_SIZES) {
      const fromPieces = rasterBitmap(choice.pieces, size);
      const fromSpans = rasterBitmap(choice.pieces.slice().reverse(), size);
      assert.ok(sameBitmap(fromPieces, fromSpans), `piece order changes the bitmap in ${problem.id}`);
      assert.equal(sizeSignature(choice.pieces, size), sizeSignature(choice.pieces.slice().reverse(), size));
      bitmapChecks += 1;
    }
    for (const other of problem.resultOptions) {
      if (other === choice) continue;
      const differsCoarse = !sameBitmap(rasterBitmap(choice.pieces, SIGNATURE_SIZES[0]), rasterBitmap(other.pieces, SIGNATURE_SIZES[0]));
      const differsFine = !sameBitmap(rasterBitmap(choice.pieces, SIGNATURE_SIZES[1]), rasterBitmap(other.pieces, SIGNATURE_SIZES[1]));
      assert.ok(differsCoarse && differsFine, `two choices share a shape in ${problem.id}`);
    }
  }
}
const parallelogram = PAPER_SHAPES.parallelogram.polygon;
const nudged = parallelogram.map((point, index) => (index ? point : { x: point.x + 0.02, y: point.y }));
assert.notEqual(signatureKey([parallelogram]), signatureKey([nudged]), "a moved vertex must change the signature");
for (const size of SIGNATURE_SIZES) {
  assert.ok(!sameBitmap(rasterBitmap([parallelogram], size), rasterBitmap([nudged], size)), `resolution ${size} is blind to a moved vertex`);
}

/* (A) 정답 선 하나만 그 결과를 만든다: 다른 후보는 어느 쪽을 접어도 다른 모양이다. */
let distractorChecks = 0;
for (const problem of lineProblems) {
  const target = SIGNATURE_SIZES.map((size) => spanSetOf(problem.resultPieces, size));
  const answer = problem.lineChoices.find((choice) => choice.correct);
  assert.equal(signatureKey(foldOnce(problem.paper, answer.line, answer.movingSign).pieces), problem.resultSignature);
  for (const choice of problem.lineChoices) {
    if (choice.correct) continue;
    for (const sign of [1, -1]) {
      const fold = foldOnce(problem.paper, choice.line, sign);
      if (!fold) continue;
      SIGNATURE_SIZES.forEach((size, index) => {
        assert.ok(spanDifference(spanSetOf(fold.pieces, size), target[index]) > 0, `distractor line reproduces the answer in ${problem.id}`);
      });
      distractorChecks += 1;
    }
  }
}

/* 전수 탐색. 종이 모양마다 한 번만 돌리고 그 모양을 쓰는 모든 문항의 검사 대상을
   함께 견준다. */
let sweptLines = 0;
let sweptFolds = 0;
let provedImpossible = 0;
let provedUnique = 0;
for (const shapeId of REVERSE_SHAPE_ORDER) {
  const polygon = PAPER_SHAPES[shapeId].polygon;
  const samples = [...polygon, polygonCentroid(polygon)];
  const targets = [];
  const answerLines = new Map();
  for (const problem of level.problems.filter((item) => item.paperId === shapeId)) {
    if (problem.interaction === "fold-line-pick") {
      targets.push({ id: `${problem.id}:answer`, pieces: problem.resultPieces });
      answerLines.set(`${problem.id}:answer`, problem.lineChoices.find((choice) => choice.correct).line);
      continue;
    }
    for (const choice of problem.resultOptions) targets.push({ id: `${problem.id}:${choice.key}:${choice.correct ? "correct" : "impossible"}`, pieces: choice.pieces });
  }
  const sweep = sweepFolds(polygon, targets, { angleSteps: ANGLE_STEPS, offsetSteps: OFFSET_STEPS, closeRatio: CLOSE_RATIO });
  assert.equal(sweep.lineCount, ANGLE_STEPS * (OFFSET_STEPS + 1));
  sweptLines += sweep.lineCount;
  sweptFolds += sweep.foldCount;
  for (const target of sweep.targets) {
    if (target.id.endsWith(":impossible")) {
      assert.ok(
        target.minDifference[0] > target.tolerance[0],
        `${target.id} is reachable by one fold (closest sweep difference ${target.minDifference[0]} px at ${SIGNATURE_SIZES[0]})`
      );
      assert.equal(target.closeLines.length, 0, `${target.id} must not match any swept fold`);
      provedImpossible += 1;
      continue;
    }
    /* 정답 후보는 탐색이 실제로 찾아내야 한다. 찾지 못하면 탐색이 너무 성겨서
       위의 불가능 판정도 믿을 수 없다. */
    assert.ok(target.closeLines.length > 0, `${target.id} was not reproduced by the sweep`);
    const line = answerLines.get(target.id);
    if (!line) continue;
    for (const match of target.closeLines) {
      assert.ok(
        lineGap(match.line, line, samples) <= SAME_LINE_LIMIT,
        `${target.id} is also made by a different line (gap ${lineGap(match.line, line, samples).toFixed(4)})`
      );
    }
    provedUnique += 1;
  }
}
assert.equal(sweptLines, REVERSE_SHAPE_ORDER.length * ANGLE_STEPS * (OFFSET_STEPS + 1));
assert.equal(provedImpossible, resultProblems.length * 2);
assert.equal(provedUnique, lineProblems.length);

/* 면적 불변식: 두 조각은 종이를 나눈 것이므로 넓이의 합이 종이와 같고,
   겹쳐 놓은 합집합은 종이보다 넓을 수 없다. */
for (const problem of resultProblems) {
  const paperArea = polygonArea(problem.paper);
  const paperSpans = spanSetOf([problem.paper], SIGNATURE_SIZES[0]);
  for (const choice of problem.resultOptions.filter((item) => item.correct)) {
    const parts = polygonArea(choice.pieces[0]) + polygonArea(choice.pieces[1]);
    assert.ok(Math.abs(parts - paperArea) < 1e-6, `the two pieces do not partition the paper in ${problem.id}`);
    assert.ok(spanSetOf(choice.pieces, SIGNATURE_SIZES[0]).filled <= paperSpans.filled, `folded area grew in ${problem.id}`);
  }
}

/* 시드 고정 재현성: 문항 생성도 문제 배치도 다시 돌리면 같아야 한다. */
for (const shapeId of REVERSE_SHAPE_ORDER) {
  for (let variant = 0; variant < REVERSE_VARIANTS; variant += 1) {
    assert.deepEqual(buildFoldLineProblem(shapeId, variant), buildFoldLineProblem(shapeId, variant));
    assert.deepEqual(buildFoldResultProblem(shapeId, variant), buildFoldResultProblem(shapeId, variant));
  }
}
assert.equal(new Set(level.problems.map(visualProblemKey)).size, level.problems.length);
for (let seed = 0; seed < 20; seed += 1) {
  for (const count of [10, 20]) {
    const first = sessionQueue(level.problems, count, new Set(), seededRandom(seed)).map((item) => item.id);
    const second = sessionQueue(level.problems, count, new Set(), seededRandom(seed)).map((item) => item.id);
    assert.deepEqual(first, second, `seed ${seed} is not reproducible`);
    assert.equal(new Set(first).size, count);
  }
}
assert.throws(() => sessionQueue(level.problems, 10, new Set(level.problems.map((item) => item.id))), /POOL_EXHAUSTED/);

/* 네 언어 사전의 키 수가 같아야 한다. */
const appSource = await readFile(new URL("./app.js", import.meta.url), "utf8");
const dictionarySource = appSource.slice(appSource.indexOf("const text = {"), appSource.indexOf("\nconst t = ("));
const dictionary = new Function(`${dictionarySource.replace("const text = {", "return {").replace(/;\s*$/, "")}`)();
const languages = ["ko", "zh", "ja", "en"];
assert.deepEqual(Object.keys(dictionary).sort(), [...languages].sort());
const koreanKeys = Object.keys(dictionary.ko).sort();
for (const language of languages) {
  assert.equal(Object.keys(dictionary[language]).length, koreanKeys.length, `${language} dictionary size differs`);
  assert.deepEqual(Object.keys(dictionary[language]).sort(), koreanKeys, `${language} dictionary keys differ`);
}
const reverseKeys = koreanKeys.filter((key) => key.startsWith("reverse"));
assert.ok(reverseKeys.length >= 12);
for (const language of languages) {
  for (const key of reverseKeys) assert.ok(dictionary[language][key].trim().length > 0, `${language}.${key} is empty`);
  assert.equal(new Set(reverseKeys.map((key) => dictionary[language][key])).size, reverseKeys.length, `${language} repeats a reverse string`);
}
for (const key of reverseKeys) {
  assert.doesNotMatch(dictionary.en[key], /[가-힣]|[ぁ-ゟ゠-ヿ]|[一-鿿]/, `en.${key} is not English`);
  assert.match(dictionary.ko[key], /[가-힣]/, `ko.${key} is not Korean`);
}

/* 문서의 판정이 `부분`으로 남아 있어야 한다. 원본 33장과 대조하지 않았다. */
const coverage = await readFile(new URL("../../docs/25_PAPER_FOLD_SOURCE_COVERAGE.md", import.meta.url), "utf8");
for (const id of ["PF-C06", "PF-C07", "PF-C08"]) {
  const row = coverage.split("\n").find((line) => line.startsWith(`| ${id} |`));
  assert.ok(row, `${id} row is missing`);
  assert.match(row, /\| 부분: /, `${id} must stay partial`);
  assert.ok(row.includes("미대조"), `${id} must say the source pages were not compared`);
  assert.doesNotMatch(row, /\| ?지원/, `${id} must not claim full support`);
}
const areaRow = coverage.split("\n").find((line) => line.startsWith("| 접는 방법 거꾸로 찾기 |"));
assert.ok(areaRow && areaRow.includes("부분") && !areaRow.includes("미지원"), "the area table must move to 부분");

console.log([
  `Reverse fold self-test passed: ${level.problems.length} problems (${lineProblems.length} crease picks, ${resultProblems.length} multi-answer sets),`,
  `${sweptLines} swept fold lines and ${sweptFolds} swept folds over ${REVERSE_SHAPE_ORDER.length} papers,`,
  `${provedImpossible} impossible shapes proved unreachable, ${provedUnique} unique creases,`,
  `${distractorChecks} distractor folds, ${bitmapChecks} two-resolution bitmap checks, four dictionaries of ${koreanKeys.length} keys.`
].join(" "));
