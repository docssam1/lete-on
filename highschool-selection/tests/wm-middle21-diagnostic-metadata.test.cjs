const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const diagnostic = require("../data/wm-middle21-diagnostic-metadata.js");
const responseSchema = require("../data/review-only/wm-middle21-response-schema.js");
const privateScorer = require("../server/private-scorer.js");
const reportBuilder = require("../server/report-builder.js");
const reportSecurity = require("../shared/report-security.js");

const EXAM_IDS = Array.from({ length: 4 }, (_, index) =>
  `wm-middle21-basic-entry-r${String(index + 1).padStart(2, "0")}`
);

const EXPECTED_DIFFICULTIES = [
  { lowered: 4, standard: 24, raised: 12 },
  { lowered: 22, standard: 16, raised: 2 },
  { lowered: 7, standard: 24, raised: 9 },
  { lowered: 4, standard: 13, raised: 23 }
];

test("WM M2-1 representative rounds expose four ordered 40-item diagnostic packets", () => {
  assert.deepEqual(diagnostic.validate(), []);
  assert.equal(diagnostic.MODE, "WM");
  assert.deepEqual(Object.keys(diagnostic.rounds), EXAM_IDS);
  assert.equal(diagnostic.allItems.length, 160);

  EXAM_IDS.forEach(examId => {
    const round = diagnostic.rounds[examId];
    assert.equal(round.items.length, 40);
    assert.deepEqual(round.items.map(item => item.number), Array.from({ length: 40 }, (_, index) => index + 1));
    assert.equal(new Set(round.items.map(item => item.id)).size, 40);
    round.items.forEach(item => {
      assert.equal(core.isNeutralId(item.id, "question", "WM"), true);
      assert.equal(core.isNeutralId(item.domainId, "type", "WM"), true);
      assert.equal(core.isNeutralId(item.detailTypeId, "type", "WM"), true);
      assert.equal(item.reviewStatus, "verified");
      assert.equal(item.classificationStatus, "verified");
    });
  });
});

test("each representative round preserves the 20 algebra and 20 geometry score sections", () => {
  EXAM_IDS.forEach(examId => {
    const items = diagnostic.rounds[examId].items;
    assert.deepEqual(items.slice(0, 20).map(item => item.cutlineSectionId), Array(20).fill("ALG"));
    assert.deepEqual(items.slice(20).map(item => item.cutlineSectionId), Array(20).fill("GEO"));
    assert.deepEqual(items.slice(0, 20).map(item => item.domain), Array(20).fill("대수"));
    assert.deepEqual(items.slice(20).map(item => item.domain), Array(20).fill("기하"));
    assert.equal(items.some(item => /통계/.test(`${item.majorUnit} ${item.minorUnit} ${item.detailType}`)), false);
  });
});

test("reviewed round-relative difficulty bands match the final private package audit", () => {
  EXAM_IDS.forEach((examId, index) => {
    const counts = diagnostic.rounds[examId].items.reduce((result, item) => {
      result[item.difficulty] += 1;
      return result;
    }, { lowered: 0, standard: 0, raised: 0 });
    assert.deepEqual(counts, EXPECTED_DIFFICULTIES[index]);
  });
  assert.equal(diagnostic.POINT_POLICY.pointsPerItem, 1);
  assert.equal(diagnostic.POINT_POLICY.totalPoints, 40);
  assert.equal(diagnostic.POINT_POLICY.officialWeight, false);
});

test("report adapter supplies every analysis dimension and separate cutline section ids", () => {
  EXAM_IDS.forEach(examId => {
    for (let number = 1; number <= 40; number += 1) {
      const item = diagnostic.reportMetadataFor(examId, number);
      assert.equal(item.number, number);
      assert.equal(item.points, 1);
      assert.ok(item.domain);
      assert.equal(item.gradeBand, "중1");
      assert.ok(item.semester);
      assert.ok(item.majorUnit);
      assert.ok(item.minorUnit);
      assert.ok(item.detailType);
      assert.ok(["lowered", "standard", "raised"].includes(item.difficulty));
      assert.ok(["ALG", "GEO"].includes(item.cutlineSectionId));
      assert.equal(item.classificationEvidence.length, 2);
    }
  });
  assert.throws(() => diagnostic.reportMetadataFor("unknown", 1), /exam id is out of range/);
  assert.throws(() => diagnostic.reportMetadataFor(EXAM_IDS[0], 0), /question number is out of range/);
  assert.throws(() => diagnostic.reportMetadataFor(EXAM_IDS[0], 41), /question number is out of range/);
});

test("public diagnostic metadata contains no protected source, answer, or file-location data", () => {
  const serialized = JSON.stringify({ rounds: diagnostic.rounds, pointPolicy: diagnostic.POINT_POLICY });
  [
    "bookId", "sourceItemNumber", "answerSpec", "answerKey", "correctAnswer", "solution",
    "questionText", "sourcePath", "filePath", "sourcePage", "fingerprint", "sha256"
  ].forEach(term => assert.equal(serialized.includes(term), false));
  assert.equal(/[A-Za-z]:[\\/]/.test(serialized), false);
  assert.equal(/file:\/\//i.test(serialized), false);
  assert.equal(/\\\\[^\\]+\\/.test(serialized), false);
  assert.equal(/\.(?:pdf|hwp)(?:["?#])/i.test(serialized), false);

  const source = fs.readFileSync(path.join(__dirname, "..", "data", "wm-middle21-diagnostic-metadata.js"), "utf8");
  assert.equal(source.includes("manifest-private"), false);
  assert.equal(source.includes("review-only/"), false);
});

test("private scorer derives WM report classification from the reviewed public packet", () => {
  const examId = EXAM_IDS[0];
  const raw = {
    schemaVersion: "highselect-private-scorer/v1",
    exams: {
      [examId]: {
        gradingVersion: "wm-m21-r01-v1",
        classificationStatus: "verified",
        items: Array.from({ length: 40 }, (_, index) => ({
          number: index + 1,
          responseType: "input",
          answerSpec: { type: "input", answers: [String(index + 1)] }
        }))
      }
    }
  };
  const normalized = privateScorer.normalize(raw);
  assert.equal(normalized.exams[examId].items.length, 40);
  normalized.exams[examId].items.forEach((item, index) => {
    const expected = diagnostic.reportMetadataFor(examId, index + 1);
    assert.equal(item.classification.domain, expected.domain);
    assert.equal(item.classification.detailType, expected.detailType);
    assert.equal(item.classification.difficulty, expected.difficulty);
    assert.equal(item.classification.cutlineSectionId, expected.cutlineSectionId);
  });

  raw.exams[examId].items[0].classification = {
    points: 1,
    domain: "잘못된 영역",
    gradeBand: "중1",
    semester: "1학기",
    majorUnit: "수와 연산",
    minorUnit: "소인수분해",
    detailType: "소인수분해와 약수 구조",
    difficulty: "lowered",
    cutlineSectionId: "ALG",
    evidence: ["pol-wm-test"]
  };
  assert.throws(() => privateScorer.normalize(raw), /private classification differs/);
});

test("all four representative rounds produce a complete printable diagnostic report", async () => {
  const scorerData = {
    schemaVersion: "highselect-private-scorer/v1",
    exams: Object.fromEntries(EXAM_IDS.map((examId, roundIndex) => [examId, {
      gradingVersion: `wm-m21-r${String(roundIndex + 1).padStart(2, "0")}-v1`,
      classificationStatus: "verified",
      items: Array.from({ length: 40 }, (_, index) => ({
        number: index + 1,
        responseType: "input",
        answerSpec: { type: "input", answers: [`key-${roundIndex + 1}-${index + 1}`] }
      }))
    }]))
  };
  const scorer = privateScorer.createAdapter({ data: scorerData });

  for (let roundIndex = 0; roundIndex < EXAM_IDS.length; roundIndex += 1) {
    const examId = EXAM_IDS[roundIndex];
    const schema = responseSchema.forStudent(examId, "student_wm");
    const answers = schema.questions.map(question => ({
      number: question.number,
      responseType: question.responseType,
      value: question.number % 4 === 0 ? "wrong" : `key-${roundIndex + 1}-${question.number}`
    }));
    const scored = await scorer.score(examId, answers, schema);
    const attemptId = `att_wm_${roundIndex + 1}`;
    const title = `원수학 중2-1 기본반 입학 대비 ${roundIndex + 1}회`;
    const report = reportBuilder.buildReport({
      attemptId,
      studentId: "student_wm",
      exam: { examId, title },
      submittedAt: "2026-08-25T09:00:00.000Z",
      scored
    });
    const validated = reportSecurity.validateReport(report, {
      attemptId,
      session: { studentId: "student_wm" },
      catalog: {
        exams: [{
          id: examId,
          title,
          questionCount: 40,
          programId: "WM",
          curriculumVersion: "2022-revised",
          releaseStatus: "released",
          answerStatus: "verified",
          classificationStatus: "verified"
        }]
      },
      cutlinePolicies: { referenceCutlines: [], examAssignments: [] }
    });

    assert.equal(validated.questionCount, 40);
    assert.equal(validated.correctCount, 30);
    assert.equal(validated.wrongCount, 10);
    assert.equal(validated.score, 30);
    assert.equal(validated.totalPoints, 40);
    assert.equal(validated.accuracy, 75);
    assert.deepEqual(validated.byDomain.map(row => [row.label, row.questionCount]), [["대수", 20], ["기하", 20]]);
    assert.ok(validated.byTermUnit.length > 1);
    assert.ok(validated.byType.length > 1);
    assert.ok(validated.byDifficulty.length >= 2);
    assert.ok(validated.weakPriorities.length > 0);
    assert.ok(validated.comments.some(comment => comment.type === "item-prescription"));
    assert.equal(validated.cutline.available, false);
  }
});
