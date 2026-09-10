const fs = require("fs");
const path = require("path");
const vm = require("vm");
require('../challenge/exam-editions.js');
require('../challenge/exam-replacements.js');
require('../challenge/exam-priority.js');
require('../challenge/exam-more.js');

const root = path.resolve(__dirname, "..", "..");
const source = fs.readFileSync(path.join(root, "hyper-focus/challenge/challenge-bank.js"), "utf8");
vm.runInThisContext(source, { filename: "challenge-bank.js" });

const bank = globalThis.HFChallengeBank;
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(bank, "HFChallengeBank 전역 모듈 없음");
assert(bank.learnerStage === "6세 챌린지 시험 준비 아동", "learner_stage 불일치");
assert(bank.listTypes().length === 20, "현재 검수 유형은 정확히 20개여야 함");
assert(bank.conceptSessions.length === 2, "호환용 개념 회차 API는 2개를 유지함");
assert(bank.conceptSessions[0].title === "수 · 규칙 · 순서와 논리", "개념 1회 제목 불일치");
assert(bank.conceptSessions[1].title === "도형과 공간", "개념 2회 제목 불일치");
assert(bank.types["mountain-digit-count"].maxMockPosition === 8, "산 모양 수 규칙은 실전 8번 이내여야 함");

let generated = 0;
let uniqueChecks = 0;
const diversity = new Map();

for (const type of bank.listTypes()) {
  diversity.set(type.id, new Set());
  assert(type.sourceState === "review", `${type.id}: 검수 상태가 아님`);
  for (const key of ["language", "representations", "prerequisites", "reasoningLoad", "responseMode"]) {
    assert(type.learnerFit && type.learnerFit[key], `${type.id}: learner-fit ${key} 없음`);
  }
  for (const difficulty of bank.difficulties) {
    for (let seed = 1; seed <= 120; seed += 1) {
      const question = bank.createQuestion(type.id, difficulty, seed * 97);
      const repeated = bank.createQuestion(type.id, difficulty, seed * 97);
      generated += 1;
      uniqueChecks += 1;
      assert(JSON.stringify(question.payload) === JSON.stringify(repeated.payload), `${type.id} ${difficulty} seed ${seed}: 재현성 실패`);
      assert(question.answerCandidates.length === 1, `${type.id} ${difficulty} seed ${seed}: 단일정답 실패`);
      assert(type.id === "line-position-total" ? question.problemHtml === "" : question.problemHtml.includes("<svg"), `${type.id} ${difficulty} seed ${seed}: 그림 계약 위반`);
      assert(!question.problemHtml.includes("undefined"), `${type.id} ${difficulty} seed ${seed}: SVG 값 누락`);
      assert(question.prompt && question.answerHtml, `${type.id} ${difficulty} seed ${seed}: 문장 또는 정답 없음`);
      diversity.get(type.id).add(JSON.stringify(question.answer));
    }
  }
}

for (const [typeId, answers] of diversity) {
  assert(answers.size >= 3, `${typeId}: 정답 다양성 부족 (${answers.size})`);
}

const numberQuestion = bank.createQuestion("split-merge-chain", "same", 3317);
const brokenNumber = JSON.parse(JSON.stringify(numberQuestion.payload));
brokenNumber.panels[0].nodes.total += 1;
assert(!bank.types["split-merge-chain"].validate(brokenNumber), "가르기·모으기 오답 음성 대조 실패");

const raceQuestion = bank.createQuestion("animal-race-order", "same", 7211);
const ambiguousRace = JSON.parse(JSON.stringify(raceQuestion.payload));
ambiguousRace.relations.pop();
assert(bank.enumerateRaceOrders(ambiguousRace).length > 1, "달리기 조건 부족 복수답 탐지 실패");
assert(!bank.types["animal-race-order"].validate(ambiguousRace), "달리기 복수답 거부 실패");

const sourceCardCase = { cards: [1, 1, 2, 2, 3, 4, 5], target: 6 };
assert(bank.enumerateCardSums(sourceCardCase).length === 5, "원본 숫자 카드 합 6은 5가지여야 함");
assert(JSON.stringify(bank.enumerateCardSums(sourceCardCase)) === JSON.stringify([[1, 5], [2, 4], [1, 1, 4], [1, 2, 3], [1, 1, 2, 2]]), "원본 숫자 카드 조합 대조 실패");

const sourcePlateCase = { total: 14, difference: 4 };
assert(JSON.stringify(bank.enumerateTotalDifference(sourcePlateCase)) === JSON.stringify([[9, 5]]), "원본 사탕 14개·차이 4 검산 실패");
assert(bank.mountainDigitCount(10, 5) === 11, "10번째 산 모양의 숫자 5 개수는 11이어야 함");

const conceptOne = bank.createConceptSession(1, 1901);
const conceptTwo = bank.createConceptSession(2, 2901);
assert(Object.keys(conceptOne.questions).join(",") === "warmup,example,practice,review", "개념 1회 4단계 구성 실패");
assert(Object.keys(conceptTwo.questions).join(",") === "warmup,example,practice,review", "개념 2회 4단계 구성 실패");

for (const round of [1, 2]) {
  const exam = bank.createMockExam(round, 8800);
  assert(exam.questionCount === 20 && exam.questions.length === 20, `모의고사 ${round}회 20문항 구성 실패`);
  assert(exam.layout.questionsPerPage === 3 && exam.layout.blankPage === 2, `모의고사 ${round}회 인쇄 계약 실패`);
  const mountain = exam.questions.find((question) => question.typeId === "mountain-digit-count");
  if(round===1)assert(mountain && mountain.number <= 8, `모의고사 ${round}회 산 모양 규칙 8번 이내 배치 실패`);
  if(round===2)assert(!mountain && exam.generationPolicy==='fixed-authored', '2회 별도 구성 실패');
  for(const question of exam.questions){
    if(question.answerCandidates)assert(question.answerCandidates.length===1,`모의고사 ${round}회 단일정답 실패`);
    else require('node:assert/strict').deepEqual(require('./validate_challenge_concepts.cjs').solveQuestion(question),question.answer,`별도 집필 문항 ${round}회 ${question.number}번 독립 검산 실패`);
  }
}

const reviewHtml = fs.readFileSync(path.join(root, "hyper-focus/challenge/review.html"), "utf8");
const reviewCss = fs.readFileSync(path.join(root, "hyper-focus/challenge/review.css"), "utf8");
const examHtml = fs.readFileSync(path.join(root, "hyper-focus/challenge/exam.html"), "utf8");
const examCss = fs.readFileSync(path.join(root, "hyper-focus/challenge/exam.css"), "utf8");
const examJs = fs.readFileSync(path.join(root, "hyper-focus/challenge/exam.js"), "utf8");
assert(reviewHtml.includes("challenge-bank.js") && reviewHtml.includes("review.js"), "검수 화면 스크립트 연결 실패");
assert(reviewCss.includes("repeat(3") && reviewCss.includes("size:A4 portrait"), "A4 3문항 인쇄 계약 없음");
assert(examHtml.includes("challenge-bank.js") && examHtml.includes("exam.js"), "시험지 화면 스크립트 연결 실패");
assert(examCss.includes("210mm") && examCss.includes("297mm") && examCss.includes("repeat(3"), "시험지 A4 3문항 레이아웃 없음");
assert(examJs.includes("blank-page") && examJs.includes("watermark") && examJs.includes("GFIELD · LETE-ON"), "빈 2쪽 또는 세 줄 워터마크 렌더 계약 없음");

console.log(JSON.stringify({
  passed: true,
  types: bank.listTypes().map((type) => type.id),
  difficulties: bank.difficulties,
  generated,
  uniqueChecks,
  diversity: Object.fromEntries([...diversity].map(([key, value]) => [key, value.size])),
  sourceChecks: ["cards-1-1-2-2-3-4-5-target-6", "candies-14-difference-4", "mountain-figure-10-digit-5"],
  mockExams: { rounds: 2, questionsPerRound: 20, questionsPerPage: 3, pageTwo: "blank" },
  negativeControls: ["inconsistent-number-given", "ambiguous-race-relations"],
  learnerStage: bank.learnerStage
}, null, 2));
