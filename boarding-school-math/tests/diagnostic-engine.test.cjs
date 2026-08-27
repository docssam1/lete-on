const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assessment/diagnostic-engine.js");

function item(index, overrides) {
  const lineages = [
    { domainId: "G6-RP", unitId: "ccss-6-rp-a", clusterId: "6.RP.A", standardRange: "6.RP.A.1-3" },
    { domainId: "G6-NS", unitId: "ccss-6-ns-a", clusterId: "6.NS.A", standardRange: "6.NS.A.1" },
    { domainId: "G6-EE", unitId: "ccss-6-ee-a", clusterId: "6.EE.A", standardRange: "6.EE.A.1-4" },
    { domainId: "G6-G", unitId: "ccss-6-g-a", clusterId: "6.G.A", standardRange: "6.G.A.1-4" },
    { domainId: "G6-SP", unitId: "ccss-6-sp-a", clusterId: "6.SP.A", standardRange: "6.SP.A.1-3" },
    { domainId: "MP", unitId: "gfield-6-mp-a", clusterId: "6.MP.A", standardRange: "6.MP.A.1" }
  ];
  const responseTypes = ["multiple-choice", "numeric", "short-answer", "constructed-response"];
  const responseType = responseTypes[index % responseTypes.length];
  const lineage = lineages[index % lineages.length];
  return Object.assign({
    itemId: `qst-bnk-${String(index).padStart(16, "0")}`,
    unitId: lineage.unitId,
    clusterId: lineage.clusterId,
    standardRange: lineage.standardRange,
    skillId: `grade6:skill-${index}`,
    domainId: lineage.domainId,
    maxPoints: responseType === "constructed-response" ? 3 : index % 3 === 0 ? 2 : 1,
    responseType,
    difficulty: engine.DIFFICULTIES[index % engine.DIFFICULTIES.length],
    scoringMode: responseType === "constructed-response" ? "teacher" : "automatic",
    reviewState: "approved"
  }, overrides);
}

function blueprint(count, purpose) {
  return {
    schemaVersion: engine.SCHEMA_VERSION,
    id: `asm-bdg-grade6-entry-v1`,
    programId: "us-core-k8",
    targetGrade: 6,
    version: 1,
    purpose: purpose || "course-placement",
    items: Array.from({ length: count }, function (_, index) { return item(index + 1); })
  };
}

function policy() {
  return {
    id: "pol-bdg-campus-a-2026",
    version: 1,
    owner: "GFIELD Campus A",
    schoolId: "sch-bdg-0123456789abcdef",
    programId: "us-core-k8",
    targetGrade: 6,
    effectiveFrom: "2026-08-26",
    claimsNationalOfficialCut: false,
    teacherReviewRequired: true,
    bands: [
      { id: "foundation", minPercent: 0 },
      { id: "developing", minPercent: 55 },
      { id: "proficient", minPercent: 75 },
      { id: "advanced", minPercent: 90 }
    ],
    promotionReview: { minimumBandId: "proficient", minDomainPercent: 65, maxPrerequisiteGaps: 0 },
    evidenceRequired: ["diagnostic", "unit-mastery", "retention-check", "teacher-review"]
  };
}

function attemptFor(source, scoreForIndex) {
  return {
    id: "att-bdg-0123456789abcdef",
    blueprintId: source.id,
    blueprintVersion: source.version,
    learnerId: "lrm-bdg-0123456789abcdef",
    schoolId: "sch-bdg-0123456789abcdef",
    policyId: "pol-bdg-campus-a-2026",
    policyVersion: 1,
    completedAt: "2026-08-26T10:00:00Z",
    itemResults: source.items.map(function (sourceItem, index) {
      const result = scoreForIndex(sourceItem, index);
      return {
        itemId: sourceItem.itemId,
        awardedPoints: result.awardedPoints,
        errorType: result.errorType == null ? null : result.errorType,
        scoringReview: sourceItem.scoringMode === "teacher" ? {
          reviewId: `grd-bdg-${String(index + 1).padStart(16, "0")}`,
          reviewerId: "gmt-0123456789abcdef",
          reviewedAt: "2026-08-26T11:00:00Z",
          attemptId: "att-bdg-0123456789abcdef",
          itemId: sourceItem.itemId
        } : null
      };
    })
  };
}

function evidenceFor(source, attempt, activePolicy) {
  return Object.fromEntries(["unit-mastery", "retention-check", "teacher-review"].map(function (type, index) {
    return [type, {
      recordId: `evd-bdg-${String(index + 1).padStart(16, "0")}`,
      type,
      learnerId: attempt.learnerId,
      schoolId: attempt.schoolId,
      programId: source.programId,
      attemptId: attempt.id,
      blueprintId: source.id,
      blueprintVersion: source.version,
      policyId: activePolicy.id,
      policyVersion: activePolicy.version,
      verifiedAt: "2026-08-26T12:00:00Z",
      verifiedBy: "gmt-0123456789abcdef"
    }];
  }));
}

test("a 12-item pilot is allowed only as a screener, never as course placement", function () {
  assert.throws(function () { engine.validateBlueprint(blueprint(12)); }, /requires 36-60 items/);
  assert.equal(engine.validateBlueprint(blueprint(12, "unit-screener")), true);
  assert.equal(engine.PURPOSE_RULES["unit-screener"].placementCapable, false);
});

test("a 42-item multi-domain approved blueprint passes the placement contract", function () {
  const source = blueprint(42);
  assert.equal(engine.validateBlueprint(source), true);
  assert.equal(new Set(source.items.map(function (row) { return row.domainId; })).size, 6);
  assert.deepEqual(new Set(source.items.map(function (row) { return row.difficulty; })), new Set(engine.DIFFICULTIES));
});

test("placement blueprints reject token domain coverage and token difficulty coverage", function () {
  const domainSkew = blueprint(42);
  const lineageByDomain = {
    "G6-RP": { unitId: "ccss-6-rp-a", clusterId: "6.RP.A", standardRange: "6.RP.A.1-3" },
    "G6-NS": { unitId: "ccss-6-ns-a", clusterId: "6.NS.A", standardRange: "6.NS.A.1" },
    "G6-EE": { unitId: "ccss-6-ee-a", clusterId: "6.EE.A", standardRange: "6.EE.A.1-4" },
    "G6-G": { unitId: "ccss-6-g-a", clusterId: "6.G.A", standardRange: "6.G.A.1-4" }
  };
  domainSkew.items = domainSkew.items.map(function (sourceItem, index) {
    const tailDomains = ["G6-NS", "G6-EE", "G6-G"];
    const domainId = index < 39 ? "G6-RP" : tailDomains[index - 39];
    return Object.assign({}, sourceItem, lineageByDomain[domainId], { domainId });
  });
  assert.throws(function () { engine.validateBlueprint(domainSkew); }, /at least 4 items per domain/);

  const difficultySkew = blueprint(42);
  difficultySkew.items = difficultySkew.items.map(function (sourceItem, index) {
    return Object.assign({}, sourceItem, { difficulty: index === 0 ? "foundation" : index === 1 ? "advanced" : "core" });
  });
  assert.throws(function () { engine.validateBlueprint(difficultySkew); }, /at least 9 foundation items/);
});

test("placement blueprints reject answer content, unapproved items, and automatic constructed scoring", function () {
  assert.throws(function () {
    engine.validateBlueprint(Object.assign({}, blueprint(42), { answerKey: ["A"] }));
  }, /blueprint has unsupported fields: answerKey/);

  const leaked = blueprint(42);
  leaked.items[0] = Object.assign({}, leaked.items[0], { answer: "7" });
  assert.throws(function () { engine.validateBlueprint(leaked); }, /unsupported fields: answer/);

  const locked = blueprint(42);
  locked.items[0] = Object.assign({}, locked.items[0], { reviewState: "pending" });
  assert.throws(function () { engine.validateBlueprint(locked); }, /reviewState must be approved/);

  const unsafeScoring = blueprint(42);
  const constructedIndex = unsafeScoring.items.findIndex(function (sourceItem) {
    return sourceItem.responseType === "constructed-response";
  });
  unsafeScoring.items[constructedIndex] = Object.assign({}, unsafeScoring.items[constructedIndex], { scoringMode: "automatic" });
  assert.throws(function () { engine.validateBlueprint(unsafeScoring); }, /constructed response must be teacher scored/);
});

test("attempt and policy contracts reject hidden answer or student fields", function () {
  const source = blueprint(42);
  const complete = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
  assert.throws(function () {
    engine.validateAttempt(source, Object.assign({}, complete, { studentName: "private" }));
  }, /attempt has unsupported fields: studentName/);
  assert.throws(function () {
    engine.validatePolicy(Object.assign({}, policy(), { officialUSCut: 80 }));
  }, /policy has unsupported fields: officialUSCut/);
});

test("school policy is versioned, teacher-owned, and cannot claim a national cut", function () {
  assert.equal(engine.validatePolicy(policy()), true);
  assert.throws(function () {
    engine.validatePolicy(Object.assign({}, policy(), { claimsNationalOfficialCut: true }));
  }, /cannot claim a national official cut/);
  assert.throws(function () {
    engine.validatePolicy(Object.assign({}, policy(), { teacherReviewRequired: false }));
  }, /teacherReviewRequired must be true/);
  assert.throws(function () {
    engine.validatePolicy(Object.assign({}, policy(), { evidenceRequired: ["diagnostic", "teacher-review"] }));
  }, /must require all four evidence types/);
  assert.throws(function () {
    engine.validatePolicy(Object.assign({}, policy(), { owner: { studentName: "private", answerKey: ["A"] } }));
  }, /owner must be a string/);
  const nanBand = policy();
  nanBand.bands = nanBand.bands.map(function (band, index) {
    return index === 2 ? Object.assign({}, band, { minPercent: Number.NaN }) : band;
  });
  assert.throws(function () { engine.validatePolicy(nanBand); }, /finite number/);
  const nanDomain = policy();
  nanDomain.promotionReview = Object.assign({}, nanDomain.promotionReview, { minDomainPercent: Number.NaN });
  assert.throws(function () { engine.validatePolicy(nanDomain); }, /finite number/);
  assert.throws(function () {
    engine.validatePolicy(Object.assign({}, policy(), { effectiveFrom: "2026-02-30" }));
  }, /not a real date/);
});

test("every lost point needs an error type and every constructed response needs teacher review", function () {
  const source = blueprint(42);
  const missingError = attemptFor(source, function (sourceItem, index) {
    return index === 0 ? { awardedPoints: 0 } : { awardedPoints: sourceItem.maxPoints };
  });
  assert.throws(function () { engine.validateAttempt(source, missingError); }, /errorType is required/);

  const unreviewed = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
  const teacherIndex = source.items.findIndex(function (sourceItem) { return sourceItem.scoringMode === "teacher"; });
  unreviewed.itemResults[teacherIndex].scoringReview = null;
  assert.throws(function () { engine.validateAttempt(source, unreviewed); }, /requires a bound teacher scoring review/);

  const duplicateReview = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
  const teacherIndexes = source.items.map(function (sourceItem, index) {
    return sourceItem.scoringMode === "teacher" ? index : -1;
  }).filter(function (index) { return index >= 0; });
  duplicateReview.itemResults[teacherIndexes[1]].scoringReview.reviewId =
    duplicateReview.itemResults[teacherIndexes[0]].scoringReview.reviewId;
  assert.throws(function () { engine.validateAttempt(source, duplicateReview); }, /teacher scoring review ids contains duplicates/);
});

test("attempt results must be dense and cannot omit a scored item through an empty array slot", function () {
  const source = blueprint(42);
  const sparse = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
  delete sparse.itemResults[0];
  assert.equal(sparse.itemResults.length, 42);
  assert.throws(function () { engine.validateAttempt(source, sparse); }, /dense array without empty slots/);
});

test("analysis rebinds stored results to immutable blueprint order and retains cluster-level evidence", function () {
  const source = blueprint(42);
  const activePolicy = policy();
  const reversed = attemptFor(source, function (sourceItem, index) {
    return index % 5 === 0
      ? { awardedPoints: 0, errorType: "concept-gap" }
      : { awardedPoints: sourceItem.maxPoints };
  });
  reversed.itemResults.reverse();
  const report = engine.analyzeAttempt(source, reversed, activePolicy, evidenceFor(source, reversed, activePolicy));

  assert.deepEqual(report.itemFeedback.map(function (row) { return row.itemId; }), source.items.map(function (row) { return row.itemId; }));
  assert.equal(report.itemFeedback[0].unitId, source.items[0].unitId);
  assert.equal(report.itemFeedback[0].clusterId, source.items[0].clusterId);
  assert.equal(report.itemFeedback[0].standardRange, source.items[0].standardRange);
  assert.equal(report.itemFeedback[0].difficulty, source.items[0].difficulty);
  assert.equal(report.clusters.length, 6);
  assert.equal(report.clusterPriorities.length, 6);
  report.clusterPriorities.forEach(function (priority) {
    assert.equal(priority.evidenceState, "cluster-range-only-pending-teacher-confirmation");
    assert.ok(priority.itemCount > 0);
    assert.deepEqual(Object.keys(priority.difficultyEvidence).sort(), engine.DIFFICULTIES.slice().sort());
  });
});

test("score, domains, item comments, and lesson priorities are derived from one exact result set", function () {
  const source = blueprint(42);
  const activePolicy = policy();
  const attempt = attemptFor(source, function (sourceItem, index) {
    if (index % 6 === 0) return { awardedPoints: 0, errorType: "calculation-error" };
    if (index % 7 === 0) return { awardedPoints: Math.max(0.5, sourceItem.maxPoints - 1), errorType: "concept-gap" };
    return { awardedPoints: sourceItem.maxPoints };
  });
  const expectedEarned = attempt.itemResults.reduce(function (sum, row) { return sum + row.awardedPoints; }, 0);
  const expectedMax = source.items.reduce(function (sum, row) { return sum + row.maxPoints; }, 0);
  const report = engine.analyzeAttempt(source, attempt, activePolicy, evidenceFor(source, attempt, activePolicy));

  assert.equal(report.score.earnedPoints, expectedEarned);
  assert.equal(report.score.maxPoints, expectedMax);
  assert.equal(report.score.percentage, Math.round(1000 * expectedEarned / expectedMax) / 10);
  assert.equal(report.domains.length, 6);
  assert.equal(report.itemFeedback.length, 42);
  assert.equal(report.itemFeedback[0].commentCode, "calculation-error");
  assert.match(report.itemFeedback[0].comment.ko, /역산/);
  const partial = report.itemFeedback.find(function (row) { return row.outcomeCode === "partial-credit"; });
  assert.equal(partial.commentCode, "concept-gap");
  assert.match(partial.comment.en, /meaning of the concept/);
  assert.deepEqual(report.lessonPriorities.map(function (row) { return row.percentage; }),
    report.lessonPriorities.map(function (row) { return row.percentage; }).slice().sort(function (a, b) { return a - b; }));
});

test("policy and evidence records are bound to one school, learner, attempt, program, grade, and version", function () {
  const source = blueprint(42);
  const attempt = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
  const activePolicy = policy();
  const wrongSchoolPolicy = Object.assign({}, activePolicy, { schoolId: "sch-bdg-fedcba9876543210" });
  assert.throws(function () { engine.analyzeAttempt(source, attempt, wrongSchoolPolicy, {}); }, /policy must match/);
  const wrongGradePolicy = Object.assign({}, activePolicy, { targetGrade: 7 });
  assert.throws(function () { engine.analyzeAttempt(source, attempt, wrongGradePolicy, {}); }, /policy must match/);

  assert.throws(function () {
    engine.analyzeAttempt(source, attempt, activePolicy, {
      "unit-mastery": true,
      "retention-check": true,
      "teacher-review": true
    });
  }, /must be a bound evidence record object/);

  const mismatched = evidenceFor(source, attempt, activePolicy);
  mismatched["teacher-review"] = Object.assign({}, mismatched["teacher-review"], {
    learnerId: "lrm-bdg-fedcba9876543210"
  });
  assert.throws(function () { engine.analyzeAttempt(source, attempt, activePolicy, mismatched); }, /does not match/);

  const duplicateEvidence = evidenceFor(source, attempt, activePolicy);
  duplicateEvidence["teacher-review"].recordId = duplicateEvidence["unit-mastery"].recordId;
  assert.throws(function () { engine.analyzeAttempt(source, attempt, activePolicy, duplicateEvidence); }, /evidence record ids contains duplicates/);

  const futurePolicy = Object.assign({}, activePolicy, { effectiveFrom: "2026-08-27" });
  assert.throws(function () { engine.analyzeAttempt(source, attempt, futurePolicy, {}); }, /cannot take effect after/);
});

test("display rounding never changes a placement threshold decision", function () {
  const source = blueprint(42);
  const activePolicy = policy();
  activePolicy.promotionReview = { minimumBandId: "proficient", minDomainPercent: 0, maxPrerequisiteGaps: 99 };
  const maxPoints = source.items.reduce(function (sum, sourceItem) { return sum + sourceItem.maxPoints; }, 0);
  let remaining = maxPoints * 0.7496;
  const attempt = attemptFor(source, function (sourceItem) {
    const awardedPoints = Math.min(sourceItem.maxPoints, Math.max(0, remaining));
    remaining -= awardedPoints;
    return awardedPoints === sourceItem.maxPoints ? { awardedPoints } : { awardedPoints, errorType: "calculation-error" };
  });
  const report = engine.analyzeAttempt(source, attempt, activePolicy, evidenceFor(source, attempt, activePolicy));
  assert.equal(report.score.percentage, 75);
  assert.equal(report.score.performanceBand, "developing");
  assert.equal(report.promotionReview.status, "needs-more-learning");
  assert.ok(report.promotionReview.blockers.includes("overall-score-below-policy"));
});

test("diagnostic evidence never makes an automatic promotion decision", function () {
  const source = blueprint(42);
  const activePolicy = policy();
  const perfect = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
  const waiting = engine.analyzeAttempt(source, perfect, activePolicy, {});
  assert.equal(waiting.score.performanceBand, "advanced");
  assert.equal(waiting.promotionReview.status, "needs-more-evidence");
  assert.equal(waiting.promotionReview.automaticPromotion, false);
  assert.deepEqual(waiting.promotionReview.missingEvidence, ["unit-mastery", "retention-check", "teacher-review"]);

  const ready = engine.analyzeAttempt(source, perfect, activePolicy, evidenceFor(source, perfect, activePolicy));
  assert.equal(ready.promotionReview.status, "eligible-for-server-verification");
  assert.equal(ready.promotionReview.automaticPromotion, false);
  assert.equal(ready.promotionReview.requiresServerAuthorization, true);
  assert.equal(ready.promotionReview.serverAuthorizationVerified, false);
  assert.equal(ready.promotionReview.decisionAuthority, "pol-bdg-campus-a-2026");
  assert.equal(Object.hasOwn(ready.policy, "owner"), false);
});

test("a low domain or prerequisite gap stays blocked even when the total score is high", function () {
  const source = blueprint(42);
  const activePolicy = policy();
  const uneven = attemptFor(source, function (sourceItem) {
    if (sourceItem.domainId === "G6-RP") return { awardedPoints: 0, errorType: "prerequisite-gap" };
    return { awardedPoints: sourceItem.maxPoints };
  });
  const report = engine.analyzeAttempt(source, uneven, activePolicy, evidenceFor(source, uneven, activePolicy));
  assert.equal(report.promotionReview.status, "needs-more-learning");
  assert.ok(report.promotionReview.blockers.includes("domain-floor-not-met"));
  assert.ok(report.promotionReview.blockers.includes("prerequisite-gaps-exceed-policy"));
  assert.deepEqual(report.promotionReview.lowDomainIds, ["G6-RP"]);
  assert.equal(report.lessonPriorities[0].domainId, "G6-RP");
  assert.equal(report.lessonPriorities[0].mode, "repair");
});

test("screeners and competition benchmarks cannot be mislabeled as placement reports", function () {
  ["unit-screener", "competition-benchmark"].forEach(function (purpose) {
    const count = purpose === "unit-screener" ? 12 : 24;
    const source = blueprint(count, purpose);
    const perfect = attemptFor(source, function (sourceItem) { return { awardedPoints: sourceItem.maxPoints }; });
    assert.throws(function () { engine.analyzeAttempt(source, perfect, policy(), {}); }, /cannot produce a placement review/);
  });
});

test("independent randomized totals match the engine for 100 complete result sets", function () {
  const source = blueprint(42);
  const activePolicy = policy();
  let seed = 20260826;
  function next() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x100000000;
  }
  for (let run = 0; run < 100; run += 1) {
    const attempt = attemptFor(source, function (sourceItem) {
      const awardedPoints = Math.floor(next() * (sourceItem.maxPoints + 1));
      return awardedPoints === sourceItem.maxPoints
        ? { awardedPoints }
        : { awardedPoints, errorType: engine.ERROR_TYPES[Math.floor(next() * engine.ERROR_TYPES.length)] };
    });
    const report = engine.analyzeAttempt(source, attempt, activePolicy, evidenceFor(source, attempt, activePolicy));
    let independentEarned = 0;
    let independentMax = 0;
    const independentDomains = {};
    source.items.forEach(function (sourceItem, index) {
      const awarded = attempt.itemResults[index].awardedPoints;
      independentEarned += awarded;
      independentMax += sourceItem.maxPoints;
      if (!independentDomains[sourceItem.domainId]) independentDomains[sourceItem.domainId] = { earned: 0, max: 0 };
      independentDomains[sourceItem.domainId].earned += awarded;
      independentDomains[sourceItem.domainId].max += sourceItem.maxPoints;
    });
    assert.equal(report.score.earnedPoints, independentEarned);
    assert.equal(report.score.maxPoints, independentMax);
    report.domains.forEach(function (domain) {
      assert.equal(domain.earnedPoints, independentDomains[domain.domainId].earned);
      assert.equal(domain.maxPoints, independentDomains[domain.domainId].max);
    });
  }
});
