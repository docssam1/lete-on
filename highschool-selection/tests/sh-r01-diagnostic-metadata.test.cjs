const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const diagnostic = require("../data/sh-r01-diagnostic-metadata.js");
const review = require("../data/review-only/sh-r01-inventory.js");

test("SH-R01 diagnostic metadata is a complete ordered 40-item public packet", () => {
  assert.deepEqual(diagnostic.validate(diagnostic.metadata), []);
  assert.equal(diagnostic.metadata.mode, "SH");
  assert.equal(diagnostic.metadata.roundCode, "SH-R01");
  assert.equal(diagnostic.items.length, 40);
  assert.deepEqual(
    diagnostic.items.map(item => item.number),
    Array.from({ length: 40 }, (_, index) => index + 1)
  );
  assert.equal(new Set(diagnostic.items.map(item => item.id)).size, 40);
  diagnostic.items.forEach(item => {
    assert.equal(core.isNeutralId(item.id, "question", "SH"), true);
    assert.equal(core.isNeutralId(item.domainId, "type", "SH"), true);
    assert.equal(core.isNeutralId(item.gradeSemesterUnitId, "type", "SH"), true);
    assert.equal(core.isNeutralId(item.detailTypeId, "type", "SH"), true);
  });
});

test("verified curriculum, major, and detail candidates are reused without relabeling", () => {
  diagnostic.items.forEach((item, index) => {
    const candidate = review.inventory.items[index];
    assert.equal(item.id, candidate.id);
    assert.equal(item.curriculumCode, candidate.curriculumCandidate.code);
    assert.equal(item.majorCode, candidate.majorCandidate.code);
    assert.equal(item.majorUnit, candidate.majorCandidate.label);
    assert.equal(item.detailCode, candidate.detailCandidate.code);
    assert.equal(item.detailType, candidate.detailCandidate.label);
    assert.equal(item.minorUnit, candidate.detailCandidate.label);
    assert.equal(
      item.gradeSemesterUnit,
      [item.gradeBand, item.semester, item.majorUnit, item.minorUnit].join(" · ")
    );
    assert.equal(item.reviewStatus, "verified");
    assert.equal(item.classificationStatus, "verified");
  });
});

test("difficulty rubric deterministically reproduces every reviewed item band", () => {
  const expected = [
    "standard", "raised", "lowered", "lowered", "standard", "standard", "raised", "standard", "standard", "standard",
    "standard", "standard", "standard", "raised", "lowered", "standard", "standard", "raised", "standard", "lowered",
    "raised", "standard", "raised", "raised", "raised", "standard", "raised", "raised", "standard", "lowered",
    "raised", "raised", "standard", "raised", "raised", "raised", "standard", "raised", "raised", "raised"
  ];
  assert.deepEqual(diagnostic.items.map(item => item.difficulty), expected);
  diagnostic.items.forEach(item => {
    const score = diagnostic.difficultyScore(item.difficultyIndicators);
    assert.equal(score, item.difficultyScore);
    assert.equal(diagnostic.bandForScore(score), item.difficulty);
    assert.equal(item.difficultyStatus, "verified");
  });
  assert.deepEqual(
    diagnostic.items.reduce((counts, item) => {
      counts[item.difficulty] += 1;
      return counts;
    }, { lowered: 0, standard: 0, raised: 0 }),
    { lowered: 5, standard: 17, raised: 18 }
  );
  assert.equal(diagnostic.DIFFICULTY_RUBRIC.officialDifficulty, false);
  assert.equal(diagnostic.DIFFICULTY_RUBRIC.scope, "round-relative-internal");
});

test("equal weighting is explicitly internal and no unapproved cutline section is invented", () => {
  assert.deepEqual(
    {
      pointsPerItem: diagnostic.POINT_POLICY.pointsPerItem,
      totalPoints: diagnostic.POINT_POLICY.totalPoints,
      officialWeight: diagnostic.POINT_POLICY.officialWeight
    },
    { pointsPerItem: 1, totalPoints: 40, officialWeight: false }
  );
  diagnostic.items.forEach(item => {
    assert.equal(item.points, 1);
    assert.equal(item.officialWeight, false);
    assert.equal(item.cutlineSectionId, null);
  });
});

test("report adapter exposes the diagnostic engine fields but no protected material", () => {
  diagnostic.items.forEach(item => {
    const reportItem = diagnostic.reportMetadataFor(item.number);
    assert.equal(reportItem.number, item.number);
    assert.equal(reportItem.domain, item.domain);
    assert.equal(reportItem.gradeSemesterUnit, item.gradeSemesterUnit);
    assert.equal(reportItem.detailType, item.detailType);
    assert.equal(reportItem.difficulty, item.difficulty);
    assert.equal(reportItem.points, 1);
    assert.equal(reportItem.cutlineSectionId, null);
    assert.equal(reportItem.reviewStatus, "verified");
    assert.equal(reportItem.classificationStatus, "verified");
    assert.equal(reportItem.classificationEvidence.length, 2);
  });
  assert.throws(() => diagnostic.reportMetadataFor(0), /out of range/);
  assert.throws(() => diagnostic.reportMetadataFor(41), /out of range/);
});

test("public metadata is neutral and contains no responses, source copy, location, or fingerprint", () => {
  const serialized = JSON.stringify(diagnostic.metadata);
  const institutions = ["황소", "돌파", "원수학", "이든", "깊은생각", "깊생", "생수"];
  institutions.forEach(name => assert.equal(serialized.includes(name), false));
  assert.equal(/(?:answer|solution|explanation|questionText|prompt|correctAnswer)/i.test(serialized), false);
  assert.equal(/[A-Za-z]:[\\/]/.test(serialized), false);
  assert.equal(/file:\/\//i.test(serialized), false);
  assert.equal(/\\\\[^\\]+\\/.test(serialized), false);
  assert.equal(/\.(?:pdf|hwp)(?:["?#])/i.test(serialized), false);
  assert.equal(/(?:sha-?256|fingerprint|hash)/i.test(serialized), false);

  const moduleSource = fs.readFileSync(path.join(__dirname, "..", "data", "sh-r01-diagnostic-metadata.js"), "utf8");
  assert.equal(moduleSource.includes("sh-r01-inventory"), false);
  assert.equal(moduleSource.includes("review-only/"), false);
});
