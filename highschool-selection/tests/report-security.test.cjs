const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const security = require("../shared/report-security.js");

const context = {
  attemptId: "attempt-2026-001",
  session: { studentId: "student-1" },
  exams: [{
    id: "exam-1",
    title: "SH 진단 1회",
    questionCount: 2,
    releaseStatus: "released",
    answerStatus: "verified",
    classificationStatus: "verified"
  }]
};

function validReport() {
  return {
    attemptId: context.attemptId,
    studentId: context.session.studentId,
    examId: "exam-1",
    examTitle: "SH 진단 1회",
    submittedAt: "2026-08-22T01:02:03Z",
    gradingVersion: "grading-3",
    classificationStatus: "verified",
    questionCount: 2,
    correctCount: 1,
    wrongCount: 1,
    totalPoints: 5,
    score: 2,
    accuracy: 50,
    items: [
      {
        number: 1, state: "correct", points: 2, domain: "수와 연산", gradeBand: "중1", semester: "1학기",
        majorUnit: "수와 연산", minorUnit: "정수와 유리수", detailType: "유리수 계산", difficulty: "standard",
        reviewStatus: "verified", classificationEvidence: ["curriculum-map-1"]
      },
      {
        number: 2, state: "wrong", points: 3, domain: "기하", gradeBand: "중2", semester: "2학기",
        majorUnit: "도형의 성질", minorUnit: "삼각형", detailType: "조건 추론", difficulty: "raised",
        reviewStatus: "verified", classificationEvidence: ["curriculum-map-2"]
      }
    ],
    byDomain: [
      { label: "수와 연산", rate: 100, correctCount: 1, questionCount: 1 },
      { label: "기하", rate: 0, correctCount: 0, questionCount: 1 }
    ],
    weakPriorities: [{
      dimension: "domain", label: "기하", reason: "조건을 식으로 옮기는 연습이 필요합니다.", evidence: [2]
    }],
    previousAttempt: {
      attemptId: "attempt-2026-000",
      studentId: context.session.studentId,
      examId: "exam-1",
      submittedAt: "2026-08-21T01:02:03Z",
      questionCount: 2,
      correctCount: 0,
      totalPoints: 5,
      score: 0,
      accuracy: 0,
      items: [{ number: 1, state: "wrong" }, { number: 2, state: "wrong" }]
    },
    comments: [
      {
        type: "summary", title: "종합 진단", text: "전체 2문항 중 1문항을 해결했습니다.",
        evidence: { aggregate: { dimension: "overall", label: "전체", correctCount: 1, questionCount: 2, rate: 50, score: 2, totalPoints: 5 } }
      },
      {
        type: "strength", title: "강점", text: "수와 연산 수행이 안정적입니다.",
        evidence: { aggregate: { dimension: "domain", label: "수와 연산", correctCount: 1, questionCount: 1, rate: 100 } }
      },
      {
        type: "weakness", title: "약점", text: "기하 조건 추론을 보완해야 합니다.",
        evidence: { aggregate: { dimension: "domain", label: "기하", correctCount: 0, questionCount: 1, rate: 0 } }
      },
      {
        type: "domain-specific", title: "기하 영역", text: "도형 조건을 순서대로 표시해 보세요.",
        evidence: { aggregate: { dimension: "domain", label: "기하", correctCount: 0, questionCount: 1, rate: 0 } }
      },
      {
        type: "item-prescription", title: "2번 처방", text: "조건을 식으로 옮긴 뒤 검산하세요.",
        evidence: { itemNumbers: [2] }, similarProblemSet: { status: "approved", setId: "similar-set-2" }
      },
      {
        type: "next-action", title: "다음 행동", text: "2번 유형을 다시 풀어 보세요.",
        evidence: { itemNumbers: [2] }
      },
      {
        type: "round-comparison", title: "회차 변화", text: "직전보다 2점 올랐습니다.",
        evidence: { comparison: { category: "score-delta", previousScore: 0, currentScore: 2, delta: 2 } }
      }
    ]
  };
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

test("accepts only an exact student, attempt, and released verified exam report", () => {
  const report = security.validateReport(validReport(), context);
  assert.equal(report.examTitle, "SH 진단 1회");
  assert.equal(report.questionCount, 2);
  assert.equal(report.correctCount, 1);
  assert.equal(report.wrongCount, 1);
  assert.equal(report.totalPoints, 5);
  assert.equal(report.score, 2);
  assert.equal(report.accuracy, 50);
  assert.deepEqual(report.items.map(item => item.state), ["correct", "wrong"]);
  assert.equal(report.byTermUnit[1].label, "중2 · 2학기 · 도형의 성질 · 삼각형");
  assert.deepEqual(report.weakPriorities[0].evidence, [2]);
  assert.deepEqual(report.comments.map(comment => comment.type), [
    "summary", "strength", "weakness", "domain-specific", "item-prescription", "next-action", "round-comparison"
  ]);
  assert.deepEqual(report.previousAttempt.groups.resolved, [1]);
  assert.deepEqual(report.previousAttempt.groups.unresolved, [2]);
  assert.deepEqual(report.cutline, { available: false, message: "합격 기준 확인 필요 — 점수/진단만 제공" });
});

test("rejects mismatched student, attempt, exam title, and unverified exam gates", () => {
  const wrongStudent = validReport(); wrongStudent.studentId = "student-2";
  assert.throws(() => security.validateReport(wrongStudent, context));
  const wrongAttempt = validReport(); wrongAttempt.attemptId = "attempt-other";
  assert.throws(() => security.validateReport(wrongAttempt, context));
  const wrongTitle = validReport(); wrongTitle.examTitle = "다른 시험";
  assert.throws(() => security.validateReport(wrongTitle, context));
  const unverified = clone(context); unverified.exams[0].classificationStatus = "draft";
  assert.throws(() => security.validateReport(validReport(), unverified));
});

test("rejects missing, duplicate/out-of-order, or unverified item classification", () => {
  const missing = validReport(); missing.items.pop(); missing.questionCount = 1;
  assert.throws(() => security.validateReport(missing, context));
  const duplicate = validReport(); duplicate.items[1].number = 1;
  assert.throws(() => security.validateReport(duplicate, context));
  const incomplete = validReport(); delete incomplete.items[1].minorUnit;
  assert.throws(() => security.validateReport(incomplete, context));
  const unverified = validReport(); unverified.items[1].reviewStatus = "draft";
  assert.throws(() => security.validateReport(unverified, context));
  const noEvidence = validReport(); noEvidence.items[1].classificationEvidence = [];
  assert.throws(() => security.validateReport(noEvidence, context));
});

test("recomputes totals and all four analysis dimensions from item O/X", () => {
  const wrongScore = validReport(); wrongScore.score = 5;
  assert.throws(() => security.validateReport(wrongScore, context));
  const wrongAccuracy = validReport(); wrongAccuracy.accuracy = 49;
  assert.throws(() => security.validateReport(wrongAccuracy, context));
  const wrongAggregate = validReport(); wrongAggregate.byDomain[1].rate = 100;
  assert.throws(() => security.validateReport(wrongAggregate, context));
  const result = security.validateReport(validReport(), context);
  assert.deepEqual(result.byDomain.map(row => [row.label, row.rate]), [["수와 연산", 100], ["기하", 0]]);
  assert.deepEqual(result.byType.map(row => row.label), ["유리수 계산", "조건 추론"]);
  assert.deepEqual(result.byDifficulty.map(row => row.label), ["standard", "raised"]);
});

test("requires weak-priority evidence to be the exact wrong-item set", () => {
  const missingEvidence = validReport(); missingEvidence.weakPriorities[0].evidence = [1];
  assert.throws(() => security.validateReport(missingEvidence, context));
  const noPriorities = validReport(); noPriorities.weakPriorities = [];
  assert.throws(() => security.validateReport(noPriorities, context));
});

test("requires the full layered comment structure and rejects fabricated evidence", () => {
  const legacy = validReport(); legacy.comment = "단일 코멘트";
  assert.throws(() => security.validateReport(legacy, context));
  const missing = validReport(); missing.comments = missing.comments.filter(comment => comment.type !== "item-prescription");
  assert.throws(() => security.validateReport(missing, context));
  const wrongAggregate = validReport(); wrongAggregate.comments[2].evidence.aggregate.rate = 50;
  assert.throws(() => security.validateReport(wrongAggregate, context));
  const wrongItem = validReport(); wrongItem.comments[4].evidence.itemNumbers = [1];
  assert.throws(() => security.validateReport(wrongItem, context));
  const wrongComparison = validReport(); wrongComparison.comments[6].evidence.comparison.delta = 99;
  assert.throws(() => security.validateReport(wrongComparison, context));
  const crossedEvidence = validReport(); crossedEvidence.comments[4].evidence.aggregate = { dimension: "domain", label: "수와 연산", correctCount: 1, questionCount: 1, rate: 100 };
  assert.throws(() => security.validateReport(crossedEvidence, context));
});

test("derives round changes from an exact prior server attempt", () => {
  const wrongPriorState = validReport(); wrongPriorState.previousAttempt.items[0].number = 2;
  assert.throws(() => security.validateReport(wrongPriorState, context));
  const wrongPriorScore = validReport(); wrongPriorScore.previousAttempt.score = 2;
  assert.throws(() => security.validateReport(wrongPriorScore, context));
  const wrongPriorStudent = validReport(); wrongPriorStudent.previousAttempt.studentId = "other";
  assert.throws(() => security.validateReport(wrongPriorStudent, context));
});

test("allows only approved similar-problem set connection status on item prescriptions", () => {
  const pending = validReport(); pending.comments[4].similarProblemSet.status = "pending";
  assert.throws(() => security.validateReport(pending, context));
  const linkedElsewhere = validReport(); linkedElsewhere.comments[1].similarProblemSet = { status: "approved", setId: "bad-place" };
  assert.throws(() => security.validateReport(linkedElsewhere, context));
  const url = validReport(); url.comments[4].similarProblemSet.url = "https://example.test/set";
  assert.throws(() => security.validateReport(url, context));
});

function approvedCompositeContext() {
  const approved = clone(context);
  approved.exams[0].programId = "WM";
  approved.exams[0].curriculumVersion = "2022-revised";
  approved.cutlinePolicies = {
    referenceCutlines: [{
      id: "policy-wm-approved",
      programId: "WM",
      curriculumVersion: "2022-revised",
      evidenceStatus: "verified",
      usage: "exam-approved",
      rule: {
        kind: "composite-correct-count",
        minimum: 2,
        denominator: 2,
        reviewFrom: 1,
        sectionMinimums: [{ sectionId: "ALG", minimum: 1 }, { sectionId: "GEO", minimum: 1 }]
      }
    }],
    examAssignments: [{
      examId: "exam-1",
      policyId: "policy-wm-approved",
      status: "approved",
      approvedBy: "T",
      approvedAt: "2026-08-22T00:00:00Z"
    }]
  };
  return approved;
}

function withCompositeDecision() {
  const report = validReport();
  report.items[0].cutlineSectionId = "ALG";
  report.items[1].cutlineSectionId = "GEO";
  report.cutlineDecision = {
    policyId: "policy-wm-approved",
    kind: "composite-correct-count",
    approval: { status: "approved", approvalId: "approval-cutline-1", approvedBy: "T", approvedAt: "2026-08-22T00:00:00Z" },
    correctCount: 1,
    denominator: 2,
    outcome: "review",
    sections: [
      { sectionId: "ALG", correctCount: 1, questionCount: 1, minimum: 1, passed: true },
      { sectionId: "GEO", correctCount: 0, questionCount: 1, minimum: 1, passed: false }
    ]
  };
  return report;
}

test("never applies public reference-only or unapproved cutlines", () => {
  const referenceOnly = approvedCompositeContext();
  referenceOnly.cutlinePolicies.referenceCutlines[0].usage = "reference-only";
  assert.deepEqual(security.validateReport(withCompositeDecision(), referenceOnly).cutline, {
    available: false, message: "합격 기준 확인 필요 — 점수/진단만 제공"
  });
  const unapproved = approvedCompositeContext();
  unapproved.cutlinePolicies.examAssignments[0].status = "review-pending";
  assert.equal(security.validateReport(withCompositeDecision(), unapproved).cutline.available, false);
  const noUserMetadata = approvedCompositeContext();
  noUserMetadata.cutlinePolicies.examAssignments[0].approvedBy = null;
  assert.equal(security.validateReport(withCompositeDecision(), noUserMetadata).cutline.available, false);
});

test("revalidates approved composite total, section minimums, and review band", () => {
  const result = security.validateReport(withCompositeDecision(), approvedCompositeContext());
  assert.equal(result.cutline.available, true);
  assert.equal(result.cutline.outcome, "review");
  assert.equal(result.cutline.correctCount, 1);
  assert.equal(result.cutline.minimum, 2);
  assert.equal(result.cutline.reviewFrom, 1);
  assert.deepEqual(result.cutline.sections.map(section => [section.sectionId, section.passed]), [["ALG", true], ["GEO", false]]);

  const wrongSection = withCompositeDecision(); wrongSection.cutlineDecision.sections[1].correctCount = 1;
  assert.throws(() => security.validateReport(wrongSection, approvedCompositeContext()));
  const wrongOutcome = withCompositeDecision(); wrongOutcome.cutlineDecision.outcome = "pass";
  assert.throws(() => security.validateReport(wrongOutcome, approvedCompositeContext()));
  const wrongApproval = withCompositeDecision(); wrongApproval.cutlineDecision.approval.approvedBy = "other";
  assert.throws(() => security.validateReport(wrongApproval, approvedCompositeContext()));
});

test("allows academy names but rejects answer keys, private fields, and video fields recursively", () => {
  const answer = validReport(); answer.items[0].correctAnswer = "4";
  assert.throws(() => security.validateReport(answer, context));
  const answerImage = validReport(); answerImage.items[0].answerImageUrl = "https://example.test/answer.png";
  assert.throws(() => security.validateReport(answerImage, context));
  const privatePath = validReport(); privatePath.sourcePath = "private/original.pdf";
  assert.throws(() => security.validateReport(privatePath, context));
  const academy = validReport(); academy.comments[0].text = "황소 자료를 복습하세요.";
  assert.equal(security.validateReport(academy, context).comments[0].text, "황소 자료를 복습하세요.");
  const video = validReport(); video.videoUrl = "https://example.test/lesson";
  assert.throws(() => security.validateReport(video, context));
  const mediaText = validReport(); mediaText.comments[4].text = "풀이 영상을 보고 복습하세요.";
  assert.throws(() => security.validateReport(mediaText, context));
});

test("uses credentialed no-store requests and requires the server no-store header", () => {
  const options = security.requestOptions();
  assert.equal(options.method, "GET");
  assert.equal(options.credentials, "include");
  assert.equal(options.cache, "no-store");
  assert.equal(security.validateNoStoreResponse({ headers: { get: () => "private, no-store, max-age=0" } }), true);
  assert.throws(() => security.validateNoStoreResponse({ headers: { get: () => "private, max-age=60" } }));
});

test("report page has printable output and no local report/cache/answer fallback", () => {
  const root = path.join(__dirname, "..");
  const page = fs.readFileSync(path.join(root, "shared", "report-page.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "report.html"), "utf8");
  assert.equal(page.includes("localStorage"), false);
  assert.equal(page.includes("validateNoStoreResponse"), true);
  assert.equal(page.includes("validateReport"), true);
  assert.equal(html.includes("report-security.js"), true);
  assert.equal(html.includes("cutline-policies.js"), true);
  assert.equal(html.includes("academy-evaluation-profiles.js"), true);
  assert.equal(html.includes("window.print()"), true);
  assert.equal(html.includes("@media print"), true);
  assert.equal(page.includes('item.state === "correct" ? "○" : "×"'), true);
  assert.equal(page.includes("문항별 O/X"), false);
  assert.equal(page.includes("학원별 평가 프로필"), true);
  assert.equal(page.includes("HIGHSELECT_ACADEMY_EVALUATION_PROFILES.resolve"), true);
  assert.equal(page.includes("합격 기준 확인 필요 — 점수/진단만 제공"), false);
  ["영상", "correctAnswer", "answerSpec", "해설", "approvalCode"].forEach(value => assert.equal((page + html).includes(value), false));
});

test("report page localizes difficulty bands and hides the internal grading version", () => {
  const root = path.join(__dirname, "..");
  const page = fs.readFileSync(path.join(root, "shared", "report-page.js"), "utf8");
  assert.match(page, /lowered:\s*"낮춤"/);
  assert.match(page, /standard:\s*"기준"/);
  assert.match(page, /raised:\s*"올림"/);
  assert.match(page, /localizedDifficultyRows\(report\.byDifficulty\)/);
  assert.match(page, /difficultyLabel\(item\.difficulty\)/);
  assert.match(page, /검증 채점/);
  assert.doesNotMatch(page, /\$\{report\.gradingVersion\}/);
});
