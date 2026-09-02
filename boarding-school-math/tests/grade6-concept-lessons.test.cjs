const test = require("node:test");
const assert = require("node:assert/strict");
const registry = require("../curriculum/us-k8-content-registry.js");
const placement = require("../assessment/grade6-placement-plan.js");
const resources = require("../resources/k8-resource-plan.js");
const content = require("../learning/grade6-concept-lessons.js");

function walk(value, visit, path = "root") {
  visit(value, path);
  if (Array.isArray(value)) {
    value.forEach(function (entry, index) { walk(entry, visit, `${path}[${index}]`); });
  } else if (value && typeof value === "object") {
    Object.keys(value).forEach(function (key) { walk(value[key], visit, `${path}.${key}`); });
  }
}

function gcd(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a;
}

function normalized(value) {
  const divisor = gcd(value.numerator, value.denominator) || 1;
  const sign = value.denominator < 0 ? -1 : 1;
  return [sign * value.numerator / divisor, sign * value.denominator / divisor];
}

function exactMean(values) {
  return normalized({ numerator: values.reduce(function (sum, value) { return sum + value; }, 0), denominator: values.length });
}

function exactMedian(values) {
  const sorted = values.slice().sort(function (a, b) { return a - b; });
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? [sorted[middle], 1]
    : normalized({ numerator: sorted[middle - 1] + sorted[middle], denominator: 2 });
}

function shoelaceTwiceArea(vertices) {
  return Math.abs(vertices.reduce(function (total, vertex, index) {
    const next = vertices[(index + 1) % vertices.length];
    return total + vertex[0] * next[1] - next[0] * vertex[1];
  }, 0));
}

function independentlyVerify(check) {
  if (check.kind === "ratio-scaling") {
    return check.totalValue.numerator * check.targetQuantity.numerator * check.sourceQuantity.denominator * check.expectedValue.denominator ===
      check.expectedValue.numerator * check.totalValue.denominator * check.targetQuantity.denominator * check.sourceQuantity.numerator;
  }
  if (check.kind === "fraction-division") {
    return check.dividend.numerator * check.divisor.denominator * check.expectedQuotient.denominator ===
      check.expectedQuotient.numerator * check.dividend.denominator * check.divisor.numerator;
  }
  if (check.kind === "greatest-common-factor") return gcd(check.left, check.right) === check.expectedGcf;
  if (check.kind === "rational-comparison") {
    return Math.sign(check.left.numerator * check.right.denominator - check.right.numerator * check.left.denominator) === check.expectedSign;
  }
  if (check.kind === "power-expression") {
    return check.coefficient * (check.base ** check.exponent + check.insideAddend) + check.outsideAddend === check.expectedValue;
  }
  if (check.kind === "linear-equation") return check.coefficient * check.expectedX + check.constant === check.rightSide;
  if (check.kind === "linear-function") return check.slope * check.x + check.intercept === check.expectedY;
  if (check.kind === "polygon-area") {
    return normalized({ numerator: shoelaceTwiceArea(check.vertices), denominator: 2 }).join("/") === normalized(check.expectedArea).join("/");
  }
  if (check.kind === "mean-mad-comparison") {
    const verifiedSets = check.dataSets.every(function (set) {
      const [meanNumerator, meanDenominator] = exactMean(set.values);
      const totalDistanceNumerator = set.values.reduce(function (sum, value) {
        return sum + Math.abs(value * meanDenominator - meanNumerator);
      }, 0);
      const exactMad = normalized({ numerator: totalDistanceNumerator, denominator: meanDenominator * set.values.length });
      return [meanNumerator, meanDenominator].join("/") === normalized(set.expectedMean).join("/") &&
        exactMad.join("/") === normalized(set.expectedMad).join("/");
    });
    const ordered = check.dataSets.slice().sort(function (left, right) {
      return right.expectedMad.numerator * left.expectedMad.denominator - left.expectedMad.numerator * right.expectedMad.denominator;
    });
    return verifiedSets && ordered[0].label === check.expectedMoreVariable;
  }
  if (check.kind === "distribution-summary") {
    return exactMean(check.values).join("/") === normalized(check.expectedMean).join("/") &&
      exactMedian(check.values).join("/") === normalized(check.expectedMedian).join("/") &&
      Math.max(...check.values) - Math.min(...check.values) === check.expectedRange;
  }
  return false;
}

function breakExpectedValue(check) {
  const broken = structuredClone(check);
  if (broken.kind === "ratio-scaling") broken.expectedValue.numerator += 1;
  if (broken.kind === "fraction-division") broken.expectedQuotient.numerator += 1;
  if (broken.kind === "greatest-common-factor") broken.expectedGcf += 1;
  if (broken.kind === "rational-comparison") broken.expectedSign *= -1;
  if (broken.kind === "power-expression") broken.expectedValue += 1;
  if (broken.kind === "linear-equation") broken.expectedX += 1;
  if (broken.kind === "linear-function") broken.expectedY += 1;
  if (broken.kind === "polygon-area") broken.expectedArea.numerator += 1;
  if (broken.kind === "mean-mad-comparison") broken.dataSets[0].expectedMad.numerator += 1;
  if (broken.kind === "distribution-summary") broken.expectedRange += 1;
  return broken;
}

test("exactly one original public concept lesson covers each canonical Grade 6 cluster", function () {
  assert.equal(content.SCHEMA_VERSION, "gfield-grade6-concept-lessons-v1");
  assert.equal(content.lessons.length, 10);
  assert.equal(content.validateAllLessons(content.lessons), true);

  const expectedClusters = placement.clusterSpecs.map(function (spec) { return spec.clusterId; }).sort();
  const actualClusters = content.lessons.map(function (lesson) { return lesson.lineage.clusterId; }).sort();
  assert.deepEqual(actualClusters, expectedClusters);
  assert.equal(new Set(actualClusters).size, 10);

  content.lessons.forEach(function (lesson) {
    const unit = registry.units.find(function (candidate) { return candidate.grade === 6 && candidate.clusterId === lesson.lineage.clusterId; });
    assert.ok(unit);
    assert.equal(lesson.lineage.courseId, registry.COURSE_ID);
    assert.equal(lesson.lineage.unitId, unit.unitId);
    assert.equal(lesson.lineage.skillId, registry.skillIdForCluster(unit.clusterId));
    assert.equal(lesson.lineage.standardRange, unit.standardRange);
    assert.equal(lesson.lineage.domainCode, unit.domainCode);
    assert.equal(lesson.lineage.sessionId, "g6-w1-s2-concept-model");
    assert.equal(lesson.lineage.testType, "guided-practice");
    assert.equal(lesson.lineage.resourceType, "concept-workbook");

    const conceptResources = resources.buildUnitPlan(unit.unitId).resourcesByAudience.student.filter(function (resource) {
      return resource.sessionId === lesson.lineage.sessionId && resource.resourceType === "concept-workbook";
    });
    assert.ok(conceptResources.length >= 1);
  });
});

test("every lesson has the required concept-example-reflection structure without a graded checkpoint", function () {
  content.lessons.forEach(function (lesson) {
    assert.equal(content.validateLesson(lesson), true);
    assert.deepEqual(lesson.learningSequence, ["concept", "example", "guided-reflection"]);
    assert.ok(lesson.conceptExplanationKo.length >= 80);
    assert.ok(lesson.commonMisconceptionKo.length >= 30);
    assert.ok(lesson.representation.descriptionKo.length >= 20);
    assert.ok(lesson.representation.visibleFactsKo.length >= 3);
    assert.equal(lesson.workedExample.isAssessment, false);
    assert.equal(lesson.workedExample.responseRequired, false);
    assert.equal(lesson.workedExample.fullySolved, true);
    assert.equal(lesson.workedExample.containsAllNeededInformation, true);
    assert.equal(lesson.workedExample.methods.length, 2);
    lesson.workedExample.methods.forEach(function (method) { assert.ok(method.stepsKo.length >= 2); });
    assert.ok(lesson.workedExample.conclusionKo.length >= 15);
    assert.ok(lesson.workedExample.verificationKo.length >= 15);
    assert.equal(lesson.guidedReflection.responseRequired, false);
    assert.equal(lesson.guidedReflection.scoringEnabled, false);
    assert.equal(lesson.checkpointMetadata.checkpointState, "metadata-only-no-embedded-item");
    assert.equal(lesson.checkpointMetadata.containsPrompt, false);
    assert.equal(lesson.checkpointMetadata.responseCapture, false);
    assert.equal(lesson.checkpointMetadata.scoringEnabled, false);
    assert.equal(lesson.checkpointMetadata.separateReviewedItemRequired, true);
    assert.equal(lesson.checkpointMetadata.teacherAssignmentRequired, true);
    assert.equal(lesson.checkpointMetadata.automaticPromotion, false);
    assert.equal(lesson.checkpointMetadata.nextDecision, "teacher-assignment-required");
  });
});

test("all number examples use exact integer or rational metadata and pass two independent arithmetic checks", function () {
  const kinds = new Set();
  content.lessons.forEach(function (lesson) {
    const check = lesson.workedExample.arithmeticCheck;
    kinds.add(check.kind);
    walk(check, function (value, path) {
      if (typeof value === "number") assert.equal(Number.isSafeInteger(value), true, `${path} must use exact integer metadata`);
    });
    assert.equal(content.verifyArithmeticCheck(check), true, `${lesson.lessonId} module verification failed`);
    assert.equal(independentlyVerify(check), true, `${lesson.lessonId} independent verification failed`);
    assert.equal(content.verifyArithmeticCheck(breakExpectedValue(check)), false, `${lesson.lessonId} accepted a corrupted result`);
  });
  assert.deepEqual([...kinds].sort(), [
    "distribution-summary", "fraction-division", "greatest-common-factor", "linear-equation", "linear-function",
    "mean-mad-comparison", "polygon-area", "power-expression", "ratio-scaling", "rational-comparison"
  ]);
});

test("worked examples remain inside the claimed Grade 6 standard boundaries", function () {
  const gcfLesson = content.lessons.find(function (lesson) { return lesson.lineage.clusterId === "6.NS.B"; });
  const gcfCheck = gcfLesson.workedExample.arithmeticCheck;
  assert.equal(gcfCheck.kind, "greatest-common-factor");
  assert.ok(gcfCheck.left >= 1 && gcfCheck.left <= 100, "6.NS.B.4 left operand must be within 1–100");
  assert.ok(gcfCheck.right >= 1 && gcfCheck.right <= 100, "6.NS.B.4 right operand must be within 1–100");

  const equationLesson = content.lessons.find(function (lesson) { return lesson.lineage.clusterId === "6.EE.B"; });
  const equationCheck = equationLesson.workedExample.arithmeticCheck;
  assert.equal(equationCheck.kind, "linear-equation");
  assert.equal(equationCheck.constant, 0, "6.EE.B.7 example must stay in one-step px = q form");
  assert.ok(equationCheck.coefficient > 0 && equationCheck.rightSide > 0 && equationCheck.expectedX > 0);
  assert.equal(equationCheck.coefficient * equationCheck.expectedX, equationCheck.rightSide);
});

test("geometry and all other representations satisfy the visible single-interpretation contract", function () {
  content.lessons.forEach(function (lesson) {
    assert.equal(lesson.representation.singleInterpretation, true);
    assert.equal(lesson.representation.hiddenInferenceRequired, false);
    assert.equal(lesson.visibility.singleInterpretation, true);
    assert.equal(lesson.visibility.visibleInformationComplete, true);
    assert.equal(lesson.visibility.hiddenPartRequired, false);
    assert.equal(lesson.visibility.canonicalRepresentationRequired, true);
  });

  const geometry = content.lessons.find(function (lesson) { return lesson.lineage.clusterId === "6.G.A"; });
  assert.equal(geometry.representation.type, "fully-labeled-coordinate-polygon");
  assert.deepEqual(geometry.workedExample.arithmeticCheck.vertices, [[0, 0], [8, 0], [8, 4], [4, 4], [4, 6], [0, 6]]);
  assert.equal(shoelaceTwiceArea(geometry.workedExample.arithmeticCheck.vertices), 80);
  assert.deepEqual(normalized(geometry.workedExample.arithmeticCheck.expectedArea), [40, 1]);
});

test("public lesson payloads contain no private assessment binding, external workbook copy, or hidden key", function () {
  const forbiddenKeys = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "options", "itemid", "slotid", "releaseid",
    "rubric", "scoringspec", "privateanswer", "privatepayload", "awardedpoints", "isgraded"
  ]);
  content.lessons.forEach(function (lesson) {
    assert.equal(lesson.publicationState, "public-original-learning-content");
    assert.equal(lesson.contentOrigin, "original-authored-no-private-assessment-or-workbook-copy");
    assert.equal(lesson.sourcePolicy.publicExampleKind, "original-worked-example");
    assert.equal(lesson.sourcePolicy.privatePlacementItemCopied, false);
    assert.equal(lesson.sourcePolicy.externalWorkbookCopied, false);
    assert.equal(lesson.sourcePolicy.hiddenKeyPresent, false);
    walk(lesson, function (_value, path) {
      const key = path.split(".").pop().replace(/\[\d+\]$/, "").toLowerCase();
      assert.equal(forbiddenKeys.has(key), false, `${path} is forbidden`);
    });
    const serialized = JSON.stringify(lesson);
    assert.doesNotMatch(serialized, /(?:slot-bdg|qst-bnk|rel-bnk|blueprintContractSha256|private-grade6|workbook-page)/i);
  });
});

test("the exported lesson graph is deeply immutable and never grants automatic promotion", function () {
  assert.equal(Object.isFrozen(content), true);
  assert.equal(Object.isFrozen(content.lessons), true);
  content.lessons.forEach(function (lesson) {
    walk(lesson, function (value, path) {
      if (value && typeof value === "object") assert.equal(Object.isFrozen(value), true, `${path} must be frozen`);
    });
    assert.equal(lesson.checkpointMetadata.automaticPromotion, false);
    assert.equal(lesson.checkpointMetadata.nextDecision, "teacher-assignment-required");
  });
});
