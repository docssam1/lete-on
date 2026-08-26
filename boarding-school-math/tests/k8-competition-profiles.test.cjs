const test = require("node:test");
const assert = require("node:assert/strict");
const catalog = require("../shared/program-catalog.js");
const data = require("../competition/k8-competition-profiles.js");

test("every K-8 competition catalog entry has one current official profile", function () {
  const competitionPrograms = catalog.programs.filter(function (program) { return program.pathway === "competition"; });
  const competitionIds = competitionPrograms.map(function (program) { return program.id; }).sort();
  assert.deepEqual(data.profiles.map(function (profile) { return profile.programId; }).sort(), competitionIds);
  assert.equal(new Set(data.profiles.map(function (profile) { return profile.id; })).size, data.profiles.length);
  competitionPrograms.forEach(function (program) {
    const profile = data.profiles.find(function (row) { return row.programId === program.id; });
    assert.equal(program.profileId, profile.id);
  });
});

test("Math Kangaroo preserves paired papers but separate student-grade ranking", function () {
  const profile = data.profiles.find(function (row) { return row.programId === "math-kangaroo-1-8"; });
  assert.deepEqual(profile.officialStudentGrades, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(profile.paperBands.map(function (band) { return band.grades; }), [[1, 2], [3, 4], [5, 6], [7, 8]]);
  assert.deepEqual(profile.paperBands.map(function (band) { return band.questionCount; }), [24, 24, 30, 30]);
  assert.deepEqual(profile.paperBands.map(function (band) { return band.scoreTiers; }), [[3, 4, 5], [3, 4, 5], [3, 4, 5], [3, 4, 5]]);
  assert.deepEqual(profile.paperBands.map(function (band) { return band.questionsPerTier; }), [8, 8, 10, 10]);
  assert.deepEqual(profile.paperBands.map(function (band) { return band.maxScore; }), [96, 96, 120, 120]);
  assert.equal(profile.durationMinutes, 75);
  assert.equal(profile.responseType, "multiple-choice");
  assert.equal(profile.kindergartenMayEnterGrade1Paper, true);
  assert.equal(profile.rankingSeparatesStudentGrades, true);
  assert.equal(profile.wrongAnswerPenalty, false);
  assert.equal(profile.calculatorAllowed, false);
  assert.equal(profile.curriculumIsGeneralGuideline, true);
  profile.paperBands.forEach(function (band) {
    const recomputed = band.scoreTiers.reduce(function (sum, points) {
      return sum + points * band.questionsPerTier;
    }, 0);
    assert.equal(recomputed, band.maxScore);
    assert.equal(band.questionsPerTier * band.scoreTiers.length, band.questionCount);
  });
});

test("SASMO keeps K2 separate from grade 1-8 formats and recomputes both maximum scores", function () {
  const profile = data.profiles.find(function (row) { return row.programId === "sasmo-k2-8"; });
  assert.equal(profile.officialGradeKeys[0], "K2");
  assert.equal(profile.officialGradeKeys.includes("K"), false);
  assert.deepEqual(profile.officialGradeKeys, ["K2", 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(profile.gradeSpecificPapers, true);
  assert.equal(profile.calculatorAllowed, false);
  profile.formats.forEach(function (format) {
    const recomputed = format.startingPoints + format.sections.reduce(function (sum, section) {
      return sum + section.questions * section.correctPoints;
    }, 0);
    assert.equal(recomputed, format.maxScore);
    assert.equal(format.sections.reduce(function (sum, section) { return sum + section.questions; }, 0), format.questionCount);
  });
  assert.deepEqual(profile.formats.map(function (format) { return [format.durationMinutes, format.questionCount]; }), [[60, 15], [90, 25]]);
  assert.deepEqual(profile.formats.map(function (format) { return format.startingPoints; }), [10, 15]);
  assert.deepEqual(profile.formats.map(function (format) {
    return format.sections.map(function (section) {
      return [section.id, section.responseType, section.questions, section.correctPoints, section.wrongPoints, section.blankPoints];
    });
  }), [
    [["A", "multiple-choice", 10, 4, -1, 0], ["B", "non-routine", 5, 7, 0, 0]],
    [["A", "multiple-choice", 15, 2, -1, 0], ["B", "non-routine", 10, 4, 0, 0]]
  ]);
});

test("AMC 8 current eligibility, format, and internal preparation band stay distinct", function () {
  const profile = data.profiles.find(function (row) { return row.programId === "amc-8"; });
  assert.deepEqual(profile.officialEligibility, { gradeMaximum: 8, ageExclusiveMaximum: 15.5 });
  assert.deepEqual(profile.gfieldPreparationGrades, [6, 7, 8]);
  assert.equal(profile.preparationBandIsOfficial, false);
  assert.equal(profile.questionCount, 25);
  assert.equal(profile.durationMinutes, 40);
  assert.equal(profile.maxScore, 25);
  assert.equal(profile.responseType, "five-choice-multiple-choice");
  assert.deepEqual([profile.correctPoints, profile.wrongPoints, profile.blankPoints], [1, 0, 0]);
  assert.equal(profile.calculatorAllowed, false);
  assert.equal(profile.remoteAdministrationAllowed, false);
  assert.deepEqual(profile.topicTags, [
    "counting-probability", "estimation", "proportional-reasoning", "elementary-geometry",
    "pythagorean-theorem", "spatial-visualization", "graphs-tables", "beginning-algebra"
  ]);
});

test("competition sources are HTTPS and original problem publication remains permission locked", function () {
  const expectedSources = {
    "math-kangaroo-usa-k8": [
      ["Math Kangaroo USA", "https://mathkangaroo.org/mks/faqs/about-the-test/"],
      ["Math Kangaroo USA", "https://mathkangaroo.org/mks/resources/math-kangaroo-curricula/"],
      ["Math Kangaroo USA", "https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/"]
    ],
    "sasmo-k2-8": [["Singapore and Asian Schools Math Olympiad", "https://sasmo.simcc.org/"]],
    "maa-amc-8": [
      ["Mathematical Association of America", "https://maa.org/student-programs/amc/"],
      ["Mathematical Association of America", "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/"],
      ["Mathematical Association of America", "https://maa.org/wp-content/uploads/2025/08/2026-AMC-8-Teachers-Manual.pdf"]
    ]
  };
  data.profiles.forEach(function (profile) {
    assert.deepEqual(profile.sources.map(function (row) { return [row.authority, row.url]; }), expectedSources[profile.id]);
    profile.sources.forEach(function (source) {
      assert.match(source.url, /^https:\/\//);
      assert.ok(source.documentRevision);
      assert.equal(source.lastVerified, "2026-08-26");
    });
    assert.equal(profile.contentRights.originalProblems, "permission-required");
    assert.equal(profile.contentRights.publicUse, "metadata-and-links-only");
  });
  catalog.programs.filter(function (program) { return program.pathway === "competition"; }).forEach(function (program) {
    assert.deepEqual(program.sources.map(function (row) { return [row.authority, row.url]; }), expectedSources[program.profileId]);
  });
});
