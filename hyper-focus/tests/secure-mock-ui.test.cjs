"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const hyperFocusRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(hyperFocusRoot, "mock", "index.html"), "utf8");
const viewerHtml = fs.readFileSync(path.join(hyperFocusRoot, "mock", "viewer.html"), "utf8");
const flowSource = fs.readFileSync(path.join(hyperFocusRoot, "mock", "secure-flow.js"), "utf8");
const configSource = fs.readFileSync(path.join(hyperFocusRoot, "supabase-config.js"), "utf8");

function compileInlineScripts(html, name) {
  const scripts = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g), match => match[1]);
  assert(scripts.length, `${name}: inline script가 없습니다.`);
  scripts.forEach((script, index) => new vm.Script(script, { filename: `${name}#inline-${index + 1}.js` }));
}

function loadSecureFlow() {
  const context = {};
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(flowSource, context, { filename: "secure-flow.js" });
  return context.HFMockSecureFlow;
}

function testPureRemoteSummaryAndBothSubmissionPaths() {
  const flow = loadSecureFlow();
  assert.equal(flow.canGrade("in_progress"), true, "정답 미열람 상태에서도 직접 O/X 채점할 수 있어야 합니다.");
  assert.equal(flow.canGrade("grading"), true, "정답 열람 후에도 O/X 채점할 수 있어야 합니다.");
  assert.equal(flow.canGrade("submitted"), false, "제출 영수증을 받은 뒤 O/X를 다시 바꾸면 안 됩니다.");
  assert.equal(flow.canGrade("review_pending"), false);

  const document = {
    attemptId: "11111111-1111-4111-8111-111111111111",
    questions: [
      { number: 1, questionKey: "premier:final-01:q01", typeKey: "paper-folding", typeTitle: "색종이 접기", typeId: null },
      { number: 2, questionKey: "premier:final-01:q02", typeKey: "stacking-cubes", typeTitle: "쌓기나무", typeId: 2 },
      { number: 3, questionKey: "premier:final-01:q03", typeKey: "stacking-cubes", typeTitle: "쌓기나무", typeId: 2 }
    ]
  };
  const marks = { 1: "x", 2: "x", 3: "o" };
  const receipt = {
    attemptId: document.attemptId,
    status: "submitted",
    questionCount: 3,
    correctCount: 1,
    score: 33,
    wrongQuestionKeys: ["premier:final-01:q01", "premier:final-01:q02"],
    wrongTypeKeys: ["paper-folding", "stacking-cubes"]
  };

  const summary = flow.buildRemoteSummary(document, marks, receipt, 5);
  assert.equal(summary.score, 33);
  assert.equal(summary.wrongRows.length, 2);
  assert.deepEqual(Array.from(summary.wrongTypeIds), [2], "null typeId는 Hyper Focus 맞춤 링크로 보내면 안 됩니다.");
  assert.deepEqual(Array.from(summary.byType, row => [row.typeKey, row.correct, row.total]), [
    ["paper-folding", 0, 1],
    ["stacking-cubes", 1, 2]
  ]);

  assert.throws(
    () => flow.buildRemoteSummary(document, { ...marks, 1: "o" }, receipt, 5),
    error => error.code === "HF_SECURE_MOCK_UI_CONTRACT_INVALID"
  );
  assert.match(flow.gradingSignalKey(document.attemptId), /grading:v1:11111111/);
  assert.match(flow.marksStorageKey(document.attemptId), /marks:v1:11111111/);
}

function testStaticUiSecurityContract() {
  compileInlineScripts(indexHtml, "mock/index.html");
  compileInlineScripts(viewerHtml, "mock/viewer.html");

  [indexHtml, viewerHtml].forEach((html, index) => {
    const label = index ? "viewer" : "index";
    assert.match(html, /<script src="\.\.\/secure-mock\.js"><\/script>/, `${label}: secure-mock.js 연결 누락`);
    assert.match(html, /<script src="\.\/secure-flow\.js"><\/script>/, `${label}: secure-flow.js 연결 누락`);
    assert.doesNotMatch(html, /canAccess\(portalSession\s*,\s*['"]mock['"]\)/, `${label}: 전역 mock 권한으로 선차단하면 안 됩니다.`);
    assert.doesNotMatch(html, /innerHTML\s*=.*(?:error\?\.|error\.message|String\(error)/, `${label}: 오류 문자열을 innerHTML에 넣으면 안 됩니다.`);
  });

  assert.match(indexHtml, /secureMock\.loadExam\(examId\)/);
  assert.doesNotMatch(indexHtml, /secureMock\.loadExam\(examId\s*,/);
  assert.match(viewerHtml, /secureMock\.loadExam\(examId\)/);
  assert.doesNotMatch(viewerHtml, /secureMock\.loadExam\(examId\s*,/);
  assert.match(viewerHtml, /secureMock\.loadAnswers\(doc\.attemptId\)/);
  assert.match(viewerHtml, /publicRelease\?\.answersAvailable===true/, "정답 자산이 없는 회차는 정답 버튼을 숨겨야 합니다.");
  assert.match(viewerHtml, /id="videoLink"[^>]*rel="noopener noreferrer"[^>]*hidden/, "영상 채점 링크는 새 창 보안 속성과 함께 기본 숨김이어야 합니다.");
  assert.match(viewerHtml, /publicRelease\?\.videoUrl/, "검수된 공개 카탈로그의 해설 영상만 연결해야 합니다.");
  assert.match(viewerHtml, /doc\.deliveryMode==='page_images'/, "원본 PDF 쪽 이미지 전달 분기가 누락되었습니다.");
  assert.match(viewerHtml, /doc\.pages\.map\(pageImageSheet\)/, "서명된 원본 쪽 이미지를 순서대로 렌더해야 합니다.");
  assert.match(viewerHtml, /class="secure-page-image"[\s\S]*referrerpolicy="no-referrer"/, "비공개 쪽 이미지는 referrer를 보내면 안 됩니다.");
  assert.match(viewerHtml, /\.sheet\.secure-page-sheet\{min-height:0;padding:0\}/, "원본 쪽 이미지는 HTML 문제지 여백으로 재편집하면 안 됩니다.");
  assert.match(indexHtml, /secureMock\.saveAttempt\(\{attemptId:exam\.attemptId,marks\}\)/);
  assert.doesNotMatch(indexHtml, /saveAttempt\(\{[^}]*\b(?:student|seed|score|correctCount|wrongTypeIds)\b/);

  assert.match(indexHtml, /secureFlow\.canGrade\(attemptStatus\)/);
  assert.match(indexHtml, /해설 영상 또는 정답·풀이를 보며 각 문항을 O\/X로 표시하세요/);
  assert.match(indexHtml, /attemptStatus==='submitted'\?'제출 완료'/, "제출 완료 응시는 버튼 문구도 잠겨야 합니다.");
  assert.match(indexHtml, /if\(remoteMode\)renderQuestions\(\)/, "서버 제출 영수증 뒤 O\/X와 제출 버튼을 즉시 잠가야 합니다.");
  assert.match(indexHtml, /secureFlow\.buildRemoteSummary\(exam,marks,receipt/);
  assert.match(indexHtml, /else\{summary=HFMock\.resultFromMarks\(exam,marks\)/, "로컬 채점 흐름은 유지해야 합니다.");
  assert.doesNotMatch(indexHtml, /if\(remoteMode\)[\s\S]{0,120}HFMock\.resultFromMarks/);
  assert.match(indexHtml, /if\(remoteMode\|\|exam\.questions\.every[^\n]+newExamBtn[^\n]+display='none'/);
  assert.match(viewerHtml, /if\(remoteExam\|\|doc\.questions\.every[^\n]+regenBtn[^\n]+display='none'/);
  assert.match(viewerHtml, /if\(remoteExam\)return;params\.set\('seed'/, "원격 regenerate 핸들러는 동작하면 안 됩니다.");

  assert.match(viewerHtml, /solutionHtml\(rows\)[\s\S]*esc\(row\.answerText\)/, "원격 answerText는 escape 후 렌더해야 합니다.");
  assert.match(viewerHtml, /setViewerError\([\s\S]*node\.textContent=/, "원격 오류는 textContent로 표시해야 합니다.");
  assert.match(viewerHtml, /remoteExam\?new URLSearchParams\(\{exam:doc\.id\}\)/, "원격 canonical URL에는 exam만 있어야 합니다.");
  assert.match(viewerHtml, /if\(remoteExam\)\{back\.searchParams\.set\('exam',doc\.id\)\}/, "원격 back URL에는 exam만 보존해야 합니다.");
  assert.match(indexHtml, /if\(!remoteMode\)\{url\.searchParams\.set\('student',student\);url\.searchParams\.set\('seed',exam\.seed\)\}/);
  assert.match(indexHtml, /new URLSearchParams\(\{exam:exam\.id\}\);if\(!remoteMode\)/);

  assert.match(indexHtml, /pageshow/);
  assert.match(indexHtml, /event\.persisted/);
  assert.match(viewerHtml, /gradingSignalKey\(doc\.attemptId\)/);
  assert.match(indexHtml, /gradingSignalKey\(exam\.attemptId\)/);
  assert.match(configSource, /secureMockDelivery:\s*true/, "검증된 보안형 모의고사 전달 기능을 사용해야 합니다.");
}

testPureRemoteSummaryAndBothSubmissionPaths();
testStaticUiSecurityContract();
console.log("Hyper Focus secure mock UI QA: PASS");
