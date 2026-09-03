const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const progression = require("../curriculum/grade5-8-reasoning-progression.js");
const registry = require("../curriculum/us-k8-content-registry.js");
const clinicPaths = require("../learning/clinic-paths.js");
const middleTypes = require("../../hsmiddle/question-bank/data/type-registry.js").types;
const middleItems = require("../../hsmiddle/question-bank/data/item-index.js").items;

test("Grade 5-8 reasoning progression covers every official cluster without inventing promotion cuts", function () {
  assert.deepEqual(progression.validate(), { valid: true, gradeCount: 4, clusterCount: 41, publicClinicCount: 8 });
  assert.deepEqual(progression.gradeProfiles.map(function (profile) { return profile.grade; }), [5, 6, 7, 8]);
  assert.deepEqual(progression.gradeProfiles.map(function (profile) { return profile.schoolClusterCount; }), [11, 10, 10, 10]);
  const official = registry.units.filter(function (unit) { return [5, 6, 7, 8].includes(Number(unit.grade)); }).map(function (unit) { return unit.clusterId; }).sort();
  assert.deepEqual(progression.clusterProfiles.map(function (profile) { return profile.clusterId; }).sort(), official);
  assert.equal(JSON.stringify(progression).includes("cutScore"), false);
  assert.equal(JSON.stringify(progression).includes("promotionCut"), false);
});

test("every learner-facing cluster metadata record carries the exact learner-fit contract", function () {
  progression.clusterProfiles.forEach(function (profile) {
    assert.match(profile.learnerStage, /^US Grade [5-8] ages \d{2}-\d{2}$/);
    assert.deepEqual(Object.keys(profile.learnerFitCriteria).sort(), ["language", "prerequisites", "reasoning-load", "representations", "response-mode"]);
    assert.ok(profile.learnerFitCriteria.prerequisites.length >= 3);
    assert.ok(profile.reasoningTags.length >= 2 && profile.reasoningTags.length <= 4);
    profile.reasoningTags.forEach(function (tag) { assert.ok(progression.dimensions[tag], `${profile.clusterId}: unknown reasoning tag`); });
    assert.equal(profile.answerContract, "declared-per-item");
  });
});

test("public clinic state is read from the real Grade 6 route registry", function () {
  const actual = Object.keys(clinicPaths.workbookByCluster).sort();
  const published = progression.clusterProfiles.filter(function (profile) { return profile.clinicState === "public-clinic"; }).map(function (profile) { return profile.clusterId; }).sort();
  assert.deepEqual(published, actual);
  assert.equal(progression.forGrade(6).publicClinicCount, actual.length);
  assert.equal(progression.forGrade(5).publicClinicCount, 0);
  assert.equal(progression.forGrade(7).publicClinicCount, 0);
  assert.equal(progression.forGrade(8).publicClinicCount, 0);
});

test("cross-program audit snapshots match current public code and retain conflicts", function () {
  assert.equal(middleTypes.length, 40);
  assert.equal(middleItems.length, 302);
  assert.equal(middleItems.filter(function (item) { return item.evidenceStatus === "verified"; }).length, 300);
  assert.equal(middleItems.filter(function (item) { return item.evidenceStatus === "conflict"; }).length, 2);

  const previousWindow = global.window;
  global.window = global;
  const numberMagic = require("../../number_magic/data/curriculum.js");
  const numberMagicUnitCount = numberMagic.tiers.reduce(function (total, tier) {
    return total + tier.levels.reduce(function (subtotal, level) { return subtotal + level.units.length; }, 0);
  }, 0);
  if (previousWindow === undefined) delete global.window;
  else global.window = previousWindow;
  assert.equal(numberMagic.tiers.length, 11);
  assert.equal(numberMagicUnitCount, 170);

  const fieldsSource = fs.readFileSync(path.resolve(__dirname, "../../fields-classic/question-bank/concept-data.js"), "utf8");
  assert.equal((fieldsSource.match(/id: "concept:[^"]+"/g) || []).length, 65);
  assert.equal((fieldsSource.match(/^  "[^"]+": sourceLesson\(/gm) || []).length, 71);

  const hwangsoSchema = fs.readFileSync(path.resolve(__dirname, "../../highschool-selection/data/question-bank-schema.js"), "utf8");
  ["original", "twin", "similar", "mastery", "lowered", "standard", "raised"].forEach(function (token) {
    assert.match(hwangsoSchema, new RegExp(`\\b${token}\\b`));
  });
});

test("reasoning progression publishes taxonomy only and contains no protected paths or answer records", function () {
  const serialized = JSON.stringify(progression);
  assert.doesNotMatch(serialized, /[A-Z]:\\|\/home\/|canonicalAnswer|studentName|accessCode|token/i);
  progression.sourceSnapshots.forEach(function (source) {
    assert.notEqual(source.sourceRole, "original-record");
    assert.ok(source.prohibited.length >= 2);
  });
});
