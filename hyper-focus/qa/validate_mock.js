const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..", "..");
function load(relativePath) {
  const filename = path.join(root, relativePath);
  vm.runInThisContext(fs.readFileSync(filename, "utf8"), { filename });
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

load("hyper-focus/generator/q01.js");
load("hyper-focus/generator/stacking.js");
load("hyper-focus/generator/spatial.js");
load("hyper-focus/mock/exam-blueprints.js");
load("hyper-focus/mock/variation-bank.js");

const generatorStatus = JSON.parse(fs.readFileSync(path.join(root, "hyper-focus/qa/generator-status.json"), "utf8"));
const readyBankTypes = generatorStatus.variationBank.viewerReadyTypes;
const computedReadyTypes = [];
const computedRejectedIds = [];
let computedVariationCount = 0;
for (let typeId = 10; typeId <= 54; typeId += 1) {
  const code = `q${String(typeId).padStart(2, "0")}`;
  const variations = ["var01", "var02"].map((suffix) => JSON.parse(
    fs.readFileSync(path.join(root, `hyper-focus/data/variations/${code}_${suffix}.json`), "utf8")
  ));
  computedVariationCount += variations.length;
  variations.filter((variation) => variation.status === "rejected").forEach((variation) => computedRejectedIds.push(variation.variationId));
  const ready = variations.every((variation) => {
    const textOnly = variation.presentation && variation.presentation.mode === "text-only";
    const source = String(variation.source && variation.source.problemImage || "");
    const asset = source.startsWith("./assets/")
      ? path.join(root, "hyper-focus", source.slice(2))
      : "";
    return Boolean(
      variation.status !== "rejected" &&
      variation.problem && variation.problem.prompt &&
      variation.solutionHint &&
      (textOnly || (source && fs.existsSync(asset))) &&
      variation.answerValidation && Object.prototype.hasOwnProperty.call(variation.answerValidation, "expectedAnswer")
    );
  });
  if (ready) computedReadyTypes.push(typeId);
}
assert(computedVariationCount === generatorStatus.variationBank.variationCount, "상태 원장과 전체 variation 수 불일치");
assert(JSON.stringify(computedReadyTypes) === JSON.stringify(readyBankTypes), "상태 원장과 실제 뷰어 준비 유형 불일치");
assert(JSON.stringify(computedRejectedIds.sort()) === JSON.stringify(generatorStatus.variationBank.rejectedVariationIds.slice().sort()), "상태 원장과 rejected variation 불일치");
assert(
  generatorStatus.variationBank.viewerReadyVariationCount + generatorStatus.variationBank.rejectedVariationCount + generatorStatus.variationBank.viewerPendingVariationCount === generatorStatus.variationBank.variationCount,
  "준비·폐기·대기 variation 합계 불일치"
);
let readyBankVariationCount = 0;
readyBankTypes.forEach((typeId) => {
  const code = `q${String(typeId).padStart(2, "0")}`;
  const canonical = JSON.parse(fs.readFileSync(path.join(root, `hyper-focus/data/canonical/${code}.json`), "utf8"));
  const variations = ["var01", "var02"].map((suffix) => JSON.parse(
    fs.readFileSync(path.join(root, `hyper-focus/data/variations/${code}_${suffix}.json`), "utf8")
  ));
  const count = globalThis.HFVariationBank.registerType(canonical, variations);
  assert(count === 2, `${code}: 뷰어 준비 유사문제 2개 등록 실패`);
  readyBankVariationCount += count;
});
assert(readyBankVariationCount === generatorStatus.variationBank.viewerReadyVariationCount, "상태 원장과 준비된 유사문제 수 불일치");
load("hyper-focus/mock/mock-core.js");

const reviewId = globalThis.HFMockBlueprints.reviewExamId;
const blueprint = globalThis.HFMockBlueprints.getExam(reviewId);
assert(blueprint && blueprint.status === "review", "검수용 시험 구성표 없음");
assert(globalThis.HFMockBlueprints.publishedExamId === null, "승인되지 않은 정식 시험 id가 공개됨");
const variationReviewId = globalThis.HFMockBlueprints.variationReviewExamId;
const variationBlueprint = globalThis.HFMockBlueprints.getExam(variationReviewId);
assert(variationBlueprint && variationBlueprint.status === "review", "기존 유사문제 검수 구성표 없음");
assert(variationBlueprint.slots.length === readyBankVariationCount, "기존 유사문제 검수 구성표 문항 수 불일치");
assert(
  globalThis.HFQ03.enumerateQ03AnswerCandidates({ map: [[1, 2]], width: 2, depth: 1 }).length === 2,
  "q03: 기준 색이 없을 때 복수 후보를 찾지 못함"
);
assert(
  globalThis.HFQ05.enumerateQ05AnswerCandidates({ map: [[2, 2, 2], [2, 2, 2], [2, 2, 2]], width: 3, depth: 3 }).length === 2,
  "q05: 벽 조건이 없을 때 복수 후보를 찾지 못함"
);
const canonicalQ08 = JSON.parse(fs.readFileSync(path.join(root, "hyper-focus/data/canonical/q08.json"), "utf8"));
const canonicalFaces = canonicalQ08.machineReadable.payload.startState.knownFaces;
assert(canonicalFaces.top === 1 && canonicalFaces.front === 2 && canonicalFaces.right === 3, "q08: 원본 시작 면 교차검증 실패");
let canonicalDie = { top: 1, bottom: 6, front: 2, back: 5, right: 3, left: 4 };
["right", "down", "right", "right"].forEach((move) => { canonicalDie = globalThis.HFQ08.rollDie(canonicalDie, move); });
assert(canonicalDie.bottom === 5, "q08: 원본 정답 5 재현 실패");
const canonicalQ09Clues = { top: [[1, 0], [1, 1], [1, 0]], frontHeights: [3, 1], rightHeights: [3, 1, 1] };
const canonicalQ09Maps = globalThis.HFQ09.enumerateQ09Maps(canonicalQ09Clues);
assert(canonicalQ09Maps.maps.length === 1 && canonicalQ09Maps.maps[0].flat().reduce((sum, value) => sum + value, 0) === 6, "q09: 원본 정답 6 재현 실패");

const answerSets = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => [id, new Set()]));
let questionCount = 0;
let uniqueCandidateChecks = 0;
for (let seed = 1; seed <= 250; seed += 1) {
  const examA = globalThis.HFMock.createExam(reviewId, seed);
  const examB = globalThis.HFMock.createExam(reviewId, seed);
  assert(examA.questions.length === blueprint.slots.length, `seed ${seed}: 구성표 문항 수 불일치`);
  assert(
    JSON.stringify(examA.questions.map((q) => q.payload)) === JSON.stringify(examB.questions.map((q) => q.payload)),
    `seed ${seed}: 재현성 실패`
  );
  examA.questions.forEach((question) => {
    questionCount += 1;
    assert(question.problemHtml.includes("<svg"), `${question.typeCode}: SVG 없음`);
    assert(question.answer !== undefined && question.answer !== null, `${question.typeCode}: 정답 없음`);
    answerSets[question.typeId].add(JSON.stringify(question.answer));
    if ([2, 3, 4, 5, 6, 7, 8, 9].includes(question.typeId)) {
      uniqueCandidateChecks += 1;
      assert(Array.isArray(question.answerCandidates) && question.answerCandidates.length === 1, `${question.typeCode}: 단일 정답 후보 실패`);
      if (question.typeId === 2) {
        assert(question.payload.viewpoint === "elevated-open-box", "q02: 높은 열린 상자 시점 아님");
        assert(question.problemHtml.includes("위에서 비스듬히 내려다본 모습"), "q02: 시점 안내 없음");
        assert(globalThis.HFQ02.isQ02ColumnReadable(question.payload), "q02: 가려지는 기둥 발생");
        assert(globalThis.HFQ02.enumerateQ02AnswerCandidates(question.payload).length === 1, "q02: 후보 전수검사 실패");
      } else if (question.typeId === 3) {
        assert(question.problemHtml.includes("hf-numgrid"), "q03: 높이 바탕그림 없음");
        assert(question.prompt.includes("왼쪽 위 칸의 맨 아래"), "q03: 기준 색 단서 없음");
        assert(question.prompt.includes("전체 흰색과 검은색"), "q03: 전체 색 개수 범위 불명확");
        if (question.payload.difficulty === "hard") {
          assert(question.payload.viewpoint === "elevated-color-stack", "q03 어렵게: 높은 시점 아님");
          assert(question.problemHtml.includes("hf-elevated-iso"), "q03 어렵게: 높은 시점 SVG 없음");
          assert(question.problemHtml.includes("위에서 비스듬히 내려다본"), "q03 어렵게: 시점 안내 없음");
        }
        assert(globalThis.HFQ03.enumerateQ03AnswerCandidates(question.payload).length === 1, "q03: 후보 전수검사 실패");
      } else if (question.typeId === 4) {
        const p = question.payload;
        assert(globalThis.HFQ04.enumerateQ04AnswerCandidates(p).length === 1, "q04: 후보 전수검사 실패");
        assert(p.tunnels.every((tunnel) => {
          if (tunnel.axis === "y") return tunnel.a > 0 && tunnel.a < p.width - 1 && tunnel.b > 0 && tunnel.b < p.depth - 1;
          if (tunnel.axis === "x") return tunnel.a > 0 && tunnel.a < p.boxH - 1 && tunnel.b > 0 && tunnel.b < p.depth - 1;
          return tunnel.a > 0 && tunnel.a < p.width - 1 && tunnel.b > 0 && tunnel.b < p.boxH - 1;
        }), "q04: 바깥 테두리 구멍 발생");
        if (p.difficulty === "easy") assert(p.axisCount === 1 && p.tunnels.length === 1 && p.intersectionCells === 0, "q04 쉽게: 난도 규칙 실패");
        if (p.difficulty === "same") assert(p.axisCount === 2 && p.tunnels.length >= 4 && p.intersectionCells >= 2, "q04 같게: 난도 규칙 실패");
        if (p.difficulty === "hard") assert(p.axisCount === 3 && p.tunnels.length >= 6 && p.tripleIntersectionCells >= 1, "q04 어렵게: 난도 규칙 실패");
      } else if (question.typeId === 5) {
        assert(question.problemHtml.includes("hf-numgrid"), "q05: 높이 바탕그림 없음");
        const expectedDirections = question.payload.walled ? "위·앞·오른쪽" : "위·앞·뒤·왼쪽·오른쪽";
        assert(question.prompt.includes(expectedDirections), "q05: 관찰 방향 단서 없음");
        assert(question.prompt.includes(question.payload.walled ? "뒤와 왼쪽에 벽" : "벽이 없습니다"), "q05: 벽 조건 불명확");
        assert(globalThis.HFQ05.enumerateQ05AnswerCandidates(question.payload).length === 1, "q05: 후보 전수검사 실패");
      } else if (question.typeId === 6) {
        assert(question.problemHtml.includes("hf-color-solid") && question.problemHtml.includes("hf-option-grid"), "q06: 회전 보기 렌더 없음");
        assert(question.prompt.includes("거울처럼 뒤집지는"), "q06: 회전/반사 기준 없음");
        assert(globalThis.HFQ06.enumerateQ06AnswerCandidates(question.payload).length === 1, "q06: 후보 전수검사 실패");
      } else if (question.typeId === 7) {
        assert(question.problemHtml.includes("hf-net") && question.problemHtml.includes("hf-marked-cube"), "q07: 전개도/입체 렌더 없음");
        assert(question.payload.oppositePairs.length === 3, "q07: 마주 보는 면 3쌍 아님");
        assert(globalThis.HFQ07.enumerateQ07AnswerCandidates(question.payload).length === 1, "q07: 후보 전수검사 실패");
      } else if (question.typeId === 8) {
        assert(question.problemHtml.includes("hf-die") && question.problemHtml.includes("hf-dice-path"), "q08: 주사위/경로 렌더 없음");
        assert(globalThis.HFQ08.enumerateQ08AnswerCandidates(question.payload).length === 1, "q08: 시작 면으로 상태가 하나가 아님");
      } else if (question.typeId === 9) {
        assert(question.problemHtml.includes("hf-three-views"), "q09: 세 방향 렌더 없음");
        const maps = globalThis.HFQ09.enumerateQ09Maps(question.payload);
        const min = Math.min(...maps.maps.map((map) => map.flat().reduce((sum, value) => sum + value, 0)));
        assert(maps.maps.filter((map) => map.flat().reduce((sum, value) => sum + value, 0) === min).length === 1, "q09: 최소 구조가 하나가 아님");
      }
    }
  });
}

Object.entries(answerSets).forEach(([typeId, answers]) => {
  assert(answers.size >= 3, `q${String(typeId).padStart(2, "0")}: 정답 다양성 ${answers.size}종`);
});

let q02VisibilityChecks = 0;
["easy", "same", "hard"].forEach((difficulty) => {
  for (let seed = 1; seed <= 1000; seed += 1) {
    const payload = globalThis.HFQ02.generateQ02(difficulty, seed);
    assert(payload.seed !== "fallback", `q02 ${difficulty}: fallback 발생 seed ${seed}`);
    assert(globalThis.HFQ02.validateQ02(payload), `q02 ${difficulty}: 성립 실패 seed ${seed}`);
    assert(globalThis.HFQ02.isQ02ColumnReadable(payload), `q02 ${difficulty}: 시점 가시성 실패 seed ${seed}`);
    assert(globalThis.HFQ02.enumerateQ02AnswerCandidates(payload).length === 1, `q02 ${difficulty}: 정답 후보 1개 아님 seed ${seed}`);
    q02VisibilityChecks += 1;
  }
});

let q03HardVisibilityChecks = 0;
for (let seed = 1; seed <= 1000; seed += 1) {
  const payload = globalThis.HFQ03.generateQ03("hard", seed);
  assert(payload.seed !== "fallback", `q03 hard: fallback 발생 seed ${seed}`);
  assert(payload.viewpoint === "elevated-color-stack", `q03 hard: 시점 실패 seed ${seed}`);
  assert(globalThis.HFQ03.validateQ03(payload), `q03 hard: 성립 실패 seed ${seed}`);
  assert(globalThis.HFQ03.enumerateQ03AnswerCandidates(payload).length === 1, `q03 hard: 정답 후보 1개 아님 seed ${seed}`);
  const problemHtml = globalThis.HFQ03.renderQ03Problem(payload);
  assert(problemHtml.includes("hf-elevated-iso") && problemHtml.includes("hf-numgrid"), `q03 hard: 높은 그림/높이표 불일치 seed ${seed}`);
  q03HardVisibilityChecks += 1;
}

let q04DifficultyChecks = 0;
const q04Complexities = { easy: [], same: [], hard: [] };
["easy", "same", "hard"].forEach((difficulty) => {
  for (let seed = 1; seed <= 1000; seed += 1) {
    const payload = globalThis.HFQ04.generateQ04(difficulty, seed);
    assert(payload.seed !== "fallback", `q04 ${difficulty}: fallback 발생 seed ${seed}`);
    assert(globalThis.HFQ04.validateQ04(payload), `q04 ${difficulty}: 성립 실패 seed ${seed}`);
    assert(globalThis.HFQ04.enumerateQ04AnswerCandidates(payload).length === 1, `q04 ${difficulty}: 정답 후보 1개 아님 seed ${seed}`);
    q04Complexities[difficulty].push(payload.complexityScore);
    q04DifficultyChecks += 1;
  }
});
assert(Math.max(...q04Complexities.easy) < Math.min(...q04Complexities.same), "q04: 쉽게/같게 복잡도 구간 겹침");
assert(Math.max(...q04Complexities.same) < Math.min(...q04Complexities.hard), "q04: 같게/어렵게 복잡도 구간 겹침");

let q05DifficultyChecks = 0;
const q05HiddenRanges = {
  open: { easy: [], same: [], hard: [] },
  walled: { easy: [], same: [], hard: [] }
};
["easy", "same", "hard"].forEach((difficulty) => {
  for (let seed = 1; seed <= 1000; seed += 1) {
    const payload = globalThis.HFQ05.generateQ05(difficulty, seed);
    assert(payload.seed !== "fallback", `q05 ${difficulty}: fallback 발생 seed ${seed}`);
    assert(globalThis.HFQ05.validateQ05(payload), `q05 ${difficulty}: 성립 실패 seed ${seed}`);
    assert(globalThis.HFQ05.enumerateQ05AnswerCandidates(payload).length === 1, `q05 ${difficulty}: 정답 후보 1개 아님 seed ${seed}`);
    q05HiddenRanges[payload.walled ? "walled" : "open"][difficulty].push(payload.hidden);
    q05DifficultyChecks += 1;
  }
});
["open", "walled"].forEach((mode) => {
  assert(Math.max(...q05HiddenRanges[mode].easy) < Math.min(...q05HiddenRanges[mode].same), `q05 ${mode}: 쉽게/같게 범위 겹침`);
  assert(Math.max(...q05HiddenRanges[mode].same) < Math.min(...q05HiddenRanges[mode].hard), `q05 ${mode}: 같게/어렵게 범위 겹침`);
});
const q05AllRanges = Object.fromEntries(["easy", "same", "hard"].map((difficulty) => [
  difficulty,
  [...q05HiddenRanges.open[difficulty], ...q05HiddenRanges.walled[difficulty]]
]));
assert(Math.max(...q05AllRanges.easy) < Math.min(...q05AllRanges.same), "q05 전체: 쉽게/같게 범위 겹침");
assert(Math.max(...q05AllRanges.same) < Math.min(...q05AllRanges.hard), "q05 전체: 같게/어렵게 범위 겹침");
const q05Fallback = globalThis.HFQ05.generateQ05("same", 1);
q05Fallback.seed = "fallback";
assert(!globalThis.HFQ05.validateQ05(q05Fallback), "q05: fallback 문제를 정상 출제로 허용함");

let spatialDifficultyChecks = 0;
[6, 7, 8, 9].forEach((typeId) => {
  const code = String(typeId).padStart(2, "0"), mod = globalThis[`HFQ${code}`];
  ["easy", "same", "hard"].forEach((difficulty) => {
    const answers = new Set();
    for (let seed = 1; seed <= 200; seed += 1) {
      const payload = mod[`generateQ${code}`](difficulty, seed);
      assert(payload.seed !== "fallback", `q${code} ${difficulty}: fallback 발생 seed ${seed}`);
      assert(mod[`validateQ${code}`](payload), `q${code} ${difficulty}: 성립 실패 seed ${seed}`);
      const candidates = mod[`enumerateQ${code}AnswerCandidates`](payload);
      assert(candidates.length === 1, `q${code} ${difficulty}: 후보 ${candidates.length}개 seed ${seed}`);
      if (typeId === 6) {
        const expected = { easy: [4, 1], same: [6, 2], hard: [8, 4] }[difficulty];
        assert(payload.choices.length === expected[0] && payload.invalidChoices.length === expected[1], `q06 ${difficulty}: 보기/오답 수 실패`);
      } else if (typeId === 7) {
        const expected = { easy: [4, 2], same: [5, 3], hard: [6, 3] }[difficulty];
        assert(payload.choices.length === expected[0] && payload.validChoices.length === expected[1], `q07 ${difficulty}: 보기/정답 수 실패`);
      } else if (typeId === 8) {
        const expected = { easy: [[3, 4], [0, 1]], same: [[5, 6], [2, 3]], hard: [[7, 9], [4, 6]] }[difficulty];
        assert(payload.path.moves.length >= expected[0][0] && payload.path.moves.length <= expected[0][1], `q08 ${difficulty}: 이동 수 실패`);
        assert(payload.path.turns >= expected[1][0] && payload.path.turns <= expected[1][1], `q08 ${difficulty}: 꺾임 수 실패`);
      } else if (typeId === 9) {
        const expected = { easy: [3, 4], same: [5, 6], hard: [7, 9] }[difficulty];
        const occupied = payload.top.flat().reduce((sum, value) => sum + value, 0);
        assert(occupied >= expected[0] && occupied <= expected[1], `q09 ${difficulty}: 바닥 칸 수 실패`);
      }
      answers.add(JSON.stringify(mod[`deriveQ${code}Answer`](payload)));
      spatialDifficultyChecks += 1;
    }
    assert(answers.size >= 3, `q${code} ${difficulty}: 정답 다양성 ${answers.size}종`);
  });
});
const q09Fallback = globalThis.HFQ09.generateQ09("easy", 1);
q09Fallback.seed = "fallback";
assert(!globalThis.HFQ09.validateQ09(q09Fallback), "q09: fallback 문제를 정상 출제로 허용함");

let missingCountRejected = false;
try {
  globalThis.HFMock.createPractice([6, 7, 8, 9], { seed: 777, difficulty: "mixed" });
} catch (error) {
  missingCountRejected = /직접 정해/.test(error.message);
}
assert(missingCountRejected, "약점 문제 수의 임의 기본값이 남아 있음");

const oneEach = globalThis.HFMock.createPractice([6, 7, 8, 9], {
  seed: 777,
  countPerType: 1,
  difficulty: "mixed"
});
const sevenEach = globalThis.HFMock.createPractice([6, 7, 8, 9], {
  seed: 777,
  countPerType: 7,
  difficulty: "mixed"
});
assert(oneEach.questions.length === 4, "유형별 1문항 선택 반영 실패");
assert(sevenEach.questions.length === 28, "유형별 7문항 선택 반영 실패");
assert(new Set(sevenEach.questions.map((q) => q.typeId)).size === 4, "약점 유형 누락");

const exam = globalThis.HFMock.createExam(reviewId, 12345);
const marks = Object.fromEntries(exam.questions.map((q) => [String(q.number), q.typeId % 2 ? "x" : "o"]));
const result = globalThis.HFMock.resultFromMarks(exam, marks);
const expectedCorrect = exam.questions.filter((q) => q.typeId % 2 === 0).length;
const expectedWrongTypes = [...new Set(exam.questions.filter((q) => q.typeId % 2 === 1).map((q) => q.typeId))];
assert(result.total === exam.questions.length, "채점 총문항 집계 불일치");
assert(result.correctCount === expectedCorrect && result.wrongCount === exam.questions.length - expectedCorrect, "채점 정오 집계 불일치");
assert(result.wrongTypeIds.join(",") === expectedWrongTypes.join(","), "오답 유형 집계 불일치");

const variationExam = globalThis.HFMock.createExam(variationReviewId, 12345);
assert(variationExam.questions.length === readyBankVariationCount, "기존 유사문제 시험지 연결 수 불일치");
assert(new Set(variationExam.questions.map((question) => question.variationId)).size === readyBankVariationCount, "기존 유사문제 중복 노출");
variationExam.questions.forEach((question) => {
  assert(question.sourceMode === "variation-bank", `${question.typeCode}: 기존 문제은행 출처 누락`);
  assert(question.prompt && question.answerText && question.answer !== undefined, `${question.variationId}: 문장·정답·풀이 누락`);
  if (question.presentationMode === "text-only") {
    assert(question.problemHtml.includes("hf-variation-text-only"), `${question.variationId}: 문장형 풀이 공간 누락`);
    assert(!question.problemHtml.includes("<img"), `${question.variationId}: 문장형 문제에 가짜 그림 포함`);
    assert(/정답: .+(계단|명|일)\./.test(question.answerText), `${question.variationId}: 문장형 정답 단위 누락`);
  } else {
    assert(question.problemHtml.includes("hf-variation-problem"), `${question.variationId}: 문제 그림 누락`);
    const match = question.problemHtml.match(/src="([^"]+)"/);
    assert(match, `${question.variationId}: 그림 경로 누락`);
    const asset = path.resolve(root, "hyper-focus/mock", match[1]);
    assert(fs.existsSync(asset), `${question.variationId}: 그림 파일 없음 ${match[1]}`);
  }
});
const bankPractice = globalThis.HFMock.createPractice([10, 53], { seed: 20260820, countPerType: 2, difficulty: "mixed" });
assert(bankPractice.questions.length === 4, "기존 유사문제 약점 문제은행 연결 실패");
assert(new Set(bankPractice.questions.map((question) => question.variationId)).size === 4, "기존 유사문제 약점 문제은행 중복 발생");
let bankOverRequestRejected = false;
try {
  globalThis.HFMock.createPractice([10], { seed: 20260820, countPerType: 3, difficulty: "mixed" });
} catch (error) {
  bankOverRequestRejected = /2개만/.test(error.message);
}
assert(bankOverRequestRejected, "준비 수보다 많은 기존 유사문제 요청을 거부하지 않음");

[
  ["hyper-focus/mock/index.html", ["spatial.js", "exam-blueprints.js", "variation-bank.js", "variation-bank-review", "review.html?mode=variation", "prepareExam", "questionList", "resultFromMarks", "practiceCount", "viewer.html"]],
  ["hyper-focus/mock/viewer.html", ["spatial.js", "exam-blueprints.js", "variation-bank.js", "preparePractice", "createPractice", "window.print", "solutions", "flex-wrap:nowrap"]],
  ["hyper-focus/review.html", ["spatial.js", "HFQ09", "generateQ09", "기존 variation 눈 검수표", "generator-status.json", "viewerReadyVariationCount", "원본 기준", "눈 검수"]],
  ["hyper-focus/index.html", ["mock/?exam=spatial-generator-review", "mock/?exam=variation-bank-review", "review.html?mode=variation", "공간지각 생성기 검수 세트", "기존 유사문제 문제은행 검수", "원본 비교 눈 검수표"]]
].forEach(([relativePath, needles]) => {
  const html = fs.readFileSync(path.join(root, relativePath), "utf8");
  needles.forEach((needle) => assert(html.includes(needle), `${relativePath}: ${needle} 계약 누락`));
  [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].forEach((match, index) => {
    if (match[1].trim()) new vm.Script(match[1], { filename: `${relativePath}#inline-${index + 1}` });
  });
  const documentDir = path.dirname(path.join(root, relativePath));
  const localRefs = [...html.matchAll(/(?:src|href)="([^"#?]+)[^"]*"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(?:https?:|#)/.test(ref) && !ref.includes("${"));
  localRefs.forEach((ref) => {
    const resolved = path.resolve(documentDir, ref);
    assert(fs.existsSync(resolved), `${relativePath}: 로컬 참조 없음 ${ref}`);
  });
});

const mockIndex = fs.readFileSync(path.join(root, "hyper-focus/mock/index.html"), "utf8");
assert(!mockIndex.includes("0/10"), "고정 10문항 진행률이 남아 있음");
assert(!mockIndex.includes("약점별 4문제"), "고정 4문항 문구가 남아 있음");
assert(!mockIndex.includes("set('count','4')"), "고정 4문항 URL이 남아 있음");

console.log("PASS");
console.log(`- blueprint-driven review questions: ${questionCount} across ${blueprint.slots.length} configured slots`);
console.log(`- q02-q09 single-answer candidate checks: ${uniqueCandidateChecks}`);
console.log(`- q02 elevated-view visibility checks without fallback: ${q02VisibilityChecks}`);
console.log(`- q03 hard elevated-view and height-grid checks without fallback: ${q03HardVisibilityChecks}`);
console.log(`- q04 separated difficulty checks without fallback: ${q04DifficultyChecks}`);
console.log(`- q05 separated wall/open difficulty checks without fallback: ${q05DifficultyChecks}`);
console.log(`- q06-q09 all-difficulty checks without fallback: ${spatialDifficultyChecks}`);
console.log(`- answer varieties: ${Object.entries(answerSets).map(([id, set]) => `q${String(id).padStart(2, "0")}=${set.size}`).join(", ")}`);
console.log(`- explicit practice counts: ${oneEach.questions.length} and ${sevenEach.questions.length} questions`);
console.log(`- scoring contract follows blueprint total: ${exam.questions.length} questions`);
console.log(`- existing variation bank: ${variationExam.questions.length} viewer-ready questions across ${readyBankTypes.length} types`);
