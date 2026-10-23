"use strict";

// Source identity, user-authorized verification metadata, and legacy lock audit.
// Per-source mathematics is independently checked by the corresponding focused audits.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const repoRoot = path.resolve(__dirname, "..", "..");
const curriculumPath = "hselementary/question-bank/curriculum.js";
const expected = [
  ["exploration", "개념탐구 1", "수의 범위를 말과 수직선으로 나타내기", "exploration", true],
  ["example-1-1", "예제 1-1", "자연수의 개수로 범위의 시작 수를 가장 크게 하기", "example", false],
  ["example-1-2", "예제 1-2", "앉는 인원과 필요한 의자 수로 전체 인원의 범위 구하기", "example", false],
  ["example-1-3", "예제 1-3", "두 조건을 모두 만족하는 사람 수의 범위 구하기", "example", false],
  ["example-1-4", "예제 1-4", "상자마다 담는 개수로 상자 수의 범위 구하기", "example", false]
];
const expectedKeys = ["source52RangeExploration", "source52RangeMaxStart", "source52RangeSeats", "source52RangeOverlap", "source52RangeBoxes"];
const expectedIds = expected.map(([suffix]) => `5-2-u1-e1-${suffix}`);
const missionIds = [1, 2, 3, 4, 5, 6].map(number => `5-2-u1-e1-mission-${number}`);
const roundingIds = ["exploration", "example-2-1", "example-2-2", "example-2-3", "example-2-4"].map(suffix => `5-2-u1-e2-${suffix}`);
const roundingMissionIds = [1, 2, 3, 4, 5, 6].map(number => `5-2-u1-e2-mission-${number}`);
const applicationExplorationIds = ["round-up", "round-down", "round-nearest"].map(suffix => `5-2-u1-e3-exploration-${suffix}`);
const applicationMissionOneId = "5-2-u1-e3-mission-1-box-count";
const applicationMissionTwoId = "5-2-u1-e3-mission-2-perimeter";
const applicationMissionThreeId = "5-2-u1-e3-mission-3-cube-box-count";
const applicationMissionFourId = "5-2-u1-e3-mission-4-mat-cost";
const applicationMissionFiveId = "5-2-u1-e3-mission-5-bar-graph-length";
const applicationMissionSixId = "5-2-u1-e3-mission-6-citrus-sales";
const roundedRangeIds = ["5-2-u1-e4-exploration-rounded-range", "5-2-u1-e4-example-1"];
const allNewSourceIds = [...expectedIds, ...missionIds, ...roundingIds, ...roundingMissionIds, ...applicationExplorationIds, applicationMissionOneId, applicationMissionTwoId, applicationMissionThreeId, applicationMissionFourId, applicationMissionFiveId, applicationMissionSixId, ...roundedRangeIds, "5-2-u1-e4-example-2", "5-2-u1-e4-example-3", "5-2-u1-e4-example-4"];
const flatten = curriculum => curriculum.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types)));
const plain = value => JSON.parse(JSON.stringify(value));

function load(curriculumSource) {
  const context = vm.createContext({ window: {} });
  for (const file of ["source-inventory-4-1.js", "source-inventory-4-2-quadrilateral.js", "source-inventory-grade6.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context, { filename: file });
  }
  vm.runInContext(curriculumSource, context, { filename: "curriculum.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "generators.js"), "utf8"), context, { filename: "generators.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-range-e1.js"), "utf8"), context, { filename: "source-5-2-range-e1.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-range-missions.js"), "utf8"), context, { filename: "source-5-2-range-missions.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounding-e2.js"), "utf8"), context, { filename: "source-5-2-rounding-e2.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounding-missions.js"), "utf8"), context, { filename: "source-5-2-rounding-missions.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounding-application-e3.js"), "utf8"), context, { filename: "source-5-2-rounding-application-e3.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-packing-mission1.js"), "utf8"), context, { filename: "source-5-2-packing-mission1.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-perimeter-mission2.js"), "utf8"), context, { filename: "source-5-2-perimeter-mission2.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-cube-box-mission3.js"), "utf8"), context, { filename: "source-5-2-cube-box-mission3.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-supply-cost-mission4.js"), "utf8"), context, { filename: "source-5-2-supply-cost-mission4.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-population-bar-length.js"), "utf8"), context, { filename: "source-5-2-population-bar-length.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-citrus-sales-mission6.js"), "utf8"), context, { filename: "source-5-2-citrus-sales-mission6.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounded-range-e4.js"), "utf8"), context, { filename: "source-5-2-rounded-range-e4.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounded-range-e42.js"), "utf8"), context, { filename: "source-5-2-rounded-range-e42.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounded-range-e43.js"), "utf8"), context, { filename: "source-5-2-rounded-range-e43.js" });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-5-2-rounded-range-e44.js"), "utf8"), context, { filename: "source-5-2-rounded-range-e44.js" });
  return { curriculum: plain(context.window.HSE_CURRICULUM), api: context.window.HSE_GENERATORS };
}

function validate(curriculum, api, baselineSemester) {
  const types = flatten(curriculum);
  assert.equal(types.length, 2041, "Whole-bank classification count");
  assert.equal(new Set(types.map(type => type.id)).size, types.length, "Unique runtime IDs");
  const semester = curriculum.semesters.find(item => item.id === "5-2");
  const semesterTypes = semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types));
  assert.equal(semesterTypes.length, 160, "Preserve 124 legacy records plus thirty-six source records");
  const restored = plain(semester);
  restored.units[0].subunits = restored.units[0].subunits.filter(group => !group.types.some(type => allNewSourceIds.includes(type.sourceItemId)));
  assert.deepEqual(restored, baselineSemester, "All 124 legacy records and their groups must stay identical to the Git baseline");
  const unit = semester.units.find(item => item.id === "5-2-u1");
  assert.equal(unit.subunits.length, 11);
  const legacy = unit.subunits.slice(0, 4).flatMap(group => group.types);
  assert.equal(legacy.length, 12);
  const legacyIds = [1, 2, 3, 4].flatMap(group => ["", "-2", "-3"].map(suffix => `5-2-u1-t${group}${suffix}`));
  assert.deepEqual(legacy.map(type => type.id), legacyIds);
  const added = unit.subunits[4].types;
  assert.deepEqual(added.map(type => type.id), expectedIds, "Exact new source runtime IDs");
  added.forEach((type, index) => {
    const [, label, name, section, figure] = expected[index];
    assert.equal(type.sourceItemId, expectedIds[index], "Exact source ID");
    assert.equal(type.sourceItemLabel, label);
    assert.equal(type.name, name);
    assert.equal(type.label, name);
    assert.equal(type.sourceSection, section);
    assert.equal(type.sourcePdfPage, 2, "PDF page must be 2");
    assert.equal(type.sourcePrintedPage, 4, "Printed page must be 4");
    assert.equal(type.sourceTier, "advanced");
    assert.equal(type.sourceVerified, true, "Independent source review required");
    assert.equal(type.publisherKeyVerified, false, "Independent calculation is not publisher verification");
    assert.equal(type.answerVerification, "independent-enumeration-user-authorized");
    assert.equal(type.reviewLocked, false);
    assert.equal(type.generationMode, "fixed-verified-pool");
    assert.equal(type.generatorKey, expectedKeys[index]);
    assert.equal(type.verifiedVariantTarget, 3);
    assert.equal(type.verifiedVariantCount, 3);
    assert.equal(type.answerVisualRequired, figure);
    assert.equal(type.answerVisualStatus, figure ? "verified" : "not-required");
    assert.match(type.reviewReason, /공식 답안/);
    assert.match(type.reviewReason, /독립 전수 검산/);
    assert.equal(api.generatorKey(type), expectedKeys[index]);
    for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant++) {
      const q = api.generate(type, 1, difficulty, 1, variant);
      assert(q && q.sourceItemId === type.sourceItemId && q.generator === type.generatorKey);
      assert.equal(q.verifiedPoolIndex, variant);
      assert.equal(q.verifiedVariantCount, 3);
      assert.equal(q.publisherKeyVerified, false);
    }
    assert.match(type.sourceEvidence, /^source-memory:/);
  });
  const roundingGroup = unit.subunits[5];
  assert.deepEqual(roundingGroup.types.map(type => type.id), roundingIds, "All five page-6 rounding source IDs are represented");
  const roundingKeys = ["source52RoundingExploration2", "source52RoundingExample21", "source52RoundingExample22", "source52RoundingExample23", ""];
  roundingGroup.types.forEach((type, index) => {
    assert.equal(type.sourceItemId, roundingIds[index]);
    assert.equal(type.sourcePdfPage, 4);
    assert.equal(type.sourcePrintedPage, 6);
    assert.equal(type.sourceTier, "advanced");
    assert.equal(type.sourceVerified, true);
    assert.equal(type.publisherKeyVerified, false);
    assert.equal(type.generatorKey, roundingKeys[index]);
    assert.equal(type.reviewLocked, index === 4, "Only ambiguous Example 2-4 stays locked");
    if (index < 4) {
      assert.equal(type.generationMode, "fixed-verified-pool");
      assert.equal(type.verifiedVariantTarget, 3);
      assert.equal(type.verifiedVariantCount, 3);
      assert.equal(type.answerVisualRequired, false);
      assert.equal(api.generatorKey(type), roundingKeys[index]);
      for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant++) {
        const question = api.generate(type, 1, difficulty, 1, variant);
        assert(question && question.sourceItemId === type.sourceItemId);
      }
    } else {
      assert.equal(type.answerVerification, "ambiguous-source-condition");
      assert.equal(api.generatorKey(type), "");
      for (const difficulty of [-1, 0, 1]) assert.equal(api.generate(type, 1, difficulty, 1, 0), null);
    }
  });
  for (const type of semesterTypes.filter(type => !allNewSourceIds.includes(type.id))) {
    assert.equal(type.reviewLocked, true, `${type.id}: lock must stay on`);
    assert.equal(type.generationMode, "review-locked");
    assert.equal(api.generatorKey(type), "", `${type.id}: no generator may be exposed`);
    for (const difficulty of [-1, 0, 1]) {
      assert.equal(api.generate(type, 0, difficulty, 1, 0), null, `${type.id}: direct generation must return null`);
    }
  }
  const roundingMissions = unit.subunits[6].types;
  assert.deepEqual(roundingMissions.map(type => type.id), roundingMissionIds, "Exact E2 Mission 1–6 IDs");
  const roundingMissionKeys = ["source52RoundingMissionOne", "source52RoundingMissionTwo", "source52RoundingMissionThree", "source52RoundingMissionFour", "source52RoundingMissionFive", "source52RoundingMissionSix"];
  roundingMissions.forEach((type, index) => {
    assert.equal(type.sourceItemId, roundingMissionIds[index]);
    assert.equal(type.sourcePdfPage, 5);
    assert.equal(type.sourcePrintedPage, 7);
    assert.equal(type.sourceTier, "advanced");
    assert.equal(type.sourceVerified, true);
    assert.equal(type.publisherKeyVerified, false);
    assert.equal(type.answerVerification, "independent-enumeration-user-authorized");
    assert.equal(type.generatorKey, roundingMissionKeys[index]);
    assert.equal(type.reviewLocked, false);
    assert.equal(type.generationMode, "fixed-verified-pool");
    assert.equal(type.verifiedVariantCount, 3);
    assert.equal(type.verifiedVariantTarget, 3);
    assert.equal(type.answerVisualRequired, index === 0);
    assert.equal(api.generatorKey(type), roundingMissionKeys[index]);
    for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant++) {
      const question = api.generate(type, 1, difficulty, 1, variant);
      assert(question && question.sourceItemId === type.sourceItemId);
      assert.equal(question.verifiedPoolIndex, variant);
      assert.equal(question.publisherKeyVerified, false);
    }
  });
  const remainingMissions = unit.subunits[7].types;
  assert.deepEqual(remainingMissions.map(type => type.id), missionIds, "Previously released E1 Mission IDs stay intact");
  const applicationExploration = unit.subunits[8].types;
  const applicationKeys = ["source52ApplicationExplorationRoundUp", "source52ApplicationExplorationRoundDown", "source52ApplicationExplorationRoundNearest"];
  assert.deepEqual(applicationExploration.map(type => type.id), applicationExplorationIds, "Exact E3 Exploration source IDs");
  applicationExploration.forEach((type, index) => {
    assert.equal(type.sourceItemId, applicationExplorationIds[index]);
    assert.equal(type.sourcePdfPage, 6);
    assert.equal(type.sourcePrintedPage, 8);
    assert.equal(type.sourceTier, "advanced");
    assert.equal(type.sourceVerified, true);
    assert.equal(type.publisherKeyVerified, false);
    assert.equal(type.answerVerification, "independent-calculation-user-authorized");
    assert.equal(type.generatorKey, applicationKeys[index]);
    assert.equal(type.reviewLocked, false);
    assert.equal(type.generationMode, "fixed-verified-pool");
    assert.equal(type.verifiedVariantCount, 3);
    assert.equal(type.verifiedVariantTarget, 3);
    assert.equal(type.answerVisualRequired, false);
    assert.equal(api.generatorKey(type), applicationKeys[index]);
    for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant++) {
      const question = api.generate(type, 1, difficulty, 1, variant);
      assert(question && question.sourceItemId === type.sourceItemId);
      assert.equal(question.verifiedPoolIndex, variant);
      assert.equal(question.publisherKeyVerified, false);
    }
  });
  const applicationMissionOne = unit.subunits[9].types;
  assert.deepEqual(applicationMissionOne.map(type => type.sourceItemId), [applicationMissionOneId, applicationMissionTwoId, applicationMissionThreeId, applicationMissionFourId, applicationMissionFiveId, applicationMissionSixId], "Only directly verified next-source Missions 1–6 are connected");
  const packingType = applicationMissionOne[0];
  assert.equal(packingType.id, applicationMissionOneId);
  assert.equal(packingType.sourcePdfPage, 7);
  assert.equal(packingType.sourcePrintedPage, 9);
  assert.equal(packingType.sourceSection, "mission");
  assert.equal(packingType.sourceVerified, true);
  assert.equal(packingType.publisherKeyVerified, false);
  assert.equal(packingType.reviewLocked, false);
  assert.equal(packingType.answerVisualRequired, false);
  assert.equal(packingType.verifiedVariantCount, 3);
  assert.equal(packingType.verifiedVariantTarget, 3);
  assert.equal(packingType.generatorKey, "source52ApplicationMissionOneBooks");
  const perimeterType = types.find(type => type.sourceItemId === "5-2-u1-e3-mission-2-perimeter");
  assert(perimeterType, "Grade 5-2 Exploration 3 Mission 2 mapping");
  assert.equal(perimeterType.generatorKey, "source52ApplicationMissionTwoPerimeter");
  const cubeBoxType = applicationMissionOne[2];
  assert.equal(cubeBoxType.id, applicationMissionThreeId);
  assert.equal(cubeBoxType.generatorKey, "source52ApplicationMissionThreeCubeBoxes");
  assert.equal(cubeBoxType.reviewLocked, false);
  assert.equal(cubeBoxType.answerVisualStatus, "not-required");
  const cubeBoxGenerator = require("./source-5-2-cube-box-mission3.js");
  for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
    const question = cubeBoxGenerator.getQuestion(variant, difficulty);
    assert(question && question.sourceItemId === applicationMissionThreeId);
    const [a, b, c] = question.answerModel.axisCounts;
    assert.equal(question.answerModel.boxes, a * b * c);
    assert(question.prompt.includes("source52-cube-box-diagram"));
  }
  const citrusType = applicationMissionOne[5];
  assert.equal(citrusType.id, applicationMissionSixId);
  assert.equal(citrusType.sourcePdfPage, 7);
  assert.equal(citrusType.sourcePrintedPage, 9);
  assert.equal(citrusType.sourceVerified, true);
  assert.equal(citrusType.publisherKeyVerified, false);
  assert.equal(citrusType.reviewLocked, false);
  assert.equal(citrusType.generatorKey, "source52ApplicationMissionSixCitrusSales");
  const citrusGenerator = require("./source-5-2-citrus-sales-mission6.js");
require("./source-5-2-rounded-range-e4.js");
require("./source-5-2-rounded-range-e42.js");
require("./source-5-2-rounded-range-e43.js");
require("./source-5-2-rounded-range-e44.js");
  assert.equal(citrusGenerator.getQuestion(0, 0).answerModel.total, 9964);
  assert.equal(citrusGenerator.getQuestion(0, 0).answerModel.fullBoxes, 24);
  assert.equal(citrusGenerator.getQuestion(0, 0).answerModel.unpacked, 364);
  assert.equal(citrusGenerator.getQuestion(0, 0).answer, "2,880,000원");
  for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
    const question = citrusGenerator.getQuestion(variant, difficulty);
    assert(question && question.sourceItemId === applicationMissionSixId);
    assert.equal(question.answerModel.revenue, question.answerModel.fullBoxes * question.answerModel.boxPrice);
    assert.equal(question.answerModel.unpacked, question.answerModel.total % question.answerModel.boxSize);
    assert(question.solution.includes(`${question.answerModel.unpacked.toLocaleString("en-US")}개가 남습니다`));
    assert.equal(question.publisherKeyVerified, false);
  }
  const roundedRange = unit.subunits[10].types;
  assert.deepEqual(roundedRange.map(type => type.sourceItemId), [...roundedRangeIds, "5-2-u1-e4-example-2", "5-2-u1-e4-example-3", "5-2-u1-e4-example-4"], "Exact page-10 Exploration 4 and Examples 4-1–4-4 source IDs");
  const roundedRangeModule = require("./source-5-2-rounded-range-e4.js");
  roundedRange.forEach((type, index) => {
    if (index === 2) {
      const example42 = require("./source-5-2-rounded-range-e42.js");
      assert.equal(type.id, example42.sourceItemId);
      assert.equal(type.sourcePdfPage, 8);
      assert.equal(type.sourcePrintedPage, 10);
      assert.equal(type.sourceSection, "example");
      assert.equal(type.reviewLocked, false);
      assert.equal(type.sourceVerified, true);
      assert.equal(type.publisherKeyVerified, false);
      assert.equal(type.answerVisualRequired, false);
      assert.equal(api.generatorKey(type), example42.generatorKey);
      for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
        const question = api.generate(type, 1, difficulty, 1, variant);
        assert(question && question.sourceItemId === type.sourceItemId);
        assert.equal(question.answerVisualRequired, false);
        assert.equal(question.publisherKeyVerified, false);
        assert(question.answerModel.minimum < question.answerModel.upperExclusive);
      }
      return;
    }
    if (index === 3) {
      const example43 = require("./source-5-2-rounded-range-e43.js");
      assert.equal(type.id, example43.sourceItemId);
      assert.equal(type.sourcePdfPage, 8);
      assert.equal(type.sourcePrintedPage, 10);
      assert.equal(type.sourceSection, "example");
      assert.equal(type.reviewLocked, false);
      assert.equal(type.sourceVerified, true);
      assert.equal(type.publisherKeyVerified, false);
      assert.equal(type.answerVisualRequired, false);
      assert.equal(api.generatorKey(type), example43.generatorKey);
      for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
        const question = api.generate(type, 1, difficulty, 1, variant);
        assert(question && question.sourceItemId === type.sourceItemId);
        assert.equal(question.answerVisualRequired, false);
        assert.equal(question.publisherKeyVerified, false);
        assert(question.answerModel.minimum < question.answerModel.upperExclusive);
      }
      return;
    }
    if (index === 4) {
      const example44 = require("./source-5-2-rounded-range-e44.js");
      assert.equal(type.id, example44.sourceItemId);
      assert.equal(type.sourcePdfPage, 8);
      assert.equal(type.sourcePrintedPage, 10);
      assert.equal(type.sourceSection, "example");
      assert.equal(type.reviewLocked, false);
      assert.equal(type.sourceVerified, true);
      assert.equal(type.publisherKeyVerified, false);
      assert.equal(type.answerVisualRequired, true);
      assert.equal(type.answerVisualStatus, "verified-reconstruction");
      assert.equal(api.generatorKey(type), example44.generatorKey);
      for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
        const question = api.generate(type, 1, difficulty, 1, variant);
        assert(question && question.sourceItemId === type.sourceItemId);
        assert.equal(question.answerVisualRequired, true);
        assert.equal(question.publisherKeyVerified, false);
        assert.equal(question.questionModel.gaps.length, 6);
      }
      return;
    }
    const definition = roundedRangeModule.definitions[index];
    assert.equal(type.id, roundedRangeIds[index]);
    assert.equal(type.sourcePdfPage, 8);
    assert.equal(type.sourcePrintedPage, 10);
    assert.equal(type.sourceSection, index === 0 ? "exploration" : "example");
    assert.equal(type.sourceVerified, true);
    assert.equal(type.publisherKeyVerified, false);
    assert.equal(type.reviewLocked, false);
    assert.equal(type.answerVisualRequired, false, "The printed source page is text-only");
    assert.equal(type.answerVisualStatus, "not-required");
    assert.equal(type.generationMode, "fixed-verified-pool");
    assert.equal(type.verifiedVariantCount, 3);
    assert.equal(type.verifiedVariantTarget, 3);
    assert.equal(type.generatorKey, definition.generatorKey);
    assert.equal(api.generatorKey(type), definition.generatorKey);
    for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
      const question = api.generate(type, 1, difficulty, 1, variant);
      assert(question && question.sourceItemId === type.sourceItemId);
      assert.equal(question.verifiedPoolIndex, variant);
      assert.equal(question.publisherKeyVerified, false);
      assert.equal(question.handwrittenAnswerVerified, false);
      if (index === 0) {
        assert.equal(question.answerModel.count, 50, "Exploration intersection has exactly 50 natural numbers");
        assert.equal(question.answer, "50개");
        assert.equal(question.answerModel.intersectionEnd - question.answerModel.intersectionStart + 1, 50);
      } else {
        assert.equal(question.answer.replace(/,/g, ""), String(question.answerModel.minimum));
        assert.equal(question.answerModel.minimum, question.answerModel.target - 500);
        assert.equal(question.answerModel.hundredFloor, question.answerModel.hundredRound);
        assert.equal(question.answerModel.tenCeil, question.answerModel.tenRound);
      }
      assert(!/\b4,500\b|\b7,000\b/.test(question.prompt), "Synthetic prompts must exclude the source's exact numbers");
    }
  });
  const supplyCostType = applicationMissionOne[3];
  assert.equal(supplyCostType.id, applicationMissionFourId);
  assert.equal(supplyCostType.sourcePdfPage, 7);
  assert.equal(supplyCostType.sourcePrintedPage, 9);
  assert.equal(supplyCostType.sourceSection, "mission");
  assert.equal(supplyCostType.sourceVerified, true);
  assert.equal(supplyCostType.publisherKeyVerified, false);
  assert.equal(supplyCostType.reviewLocked, false);
  assert.equal(supplyCostType.verifiedVariantCount, 3);
  assert.equal(supplyCostType.verifiedVariantTarget, 3);
  assert.equal(supplyCostType.generatorKey, "source52ApplicationMissionFourSupplyCost");
  const supplyCostGenerator = require("./source-5-2-supply-cost-mission4.js");
  for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
    const question = supplyCostGenerator.getQuestion(variant, difficulty);
    assert(question && question.sourceItemId === applicationMissionFourId);
    assert.equal(question.verifiedPoolIndex, variant);
    assert.equal(question.publisherKeyVerified, false);
  }
  const populationType = applicationMissionOne[4];
  assert.equal(populationType.id, applicationMissionFiveId);
  assert.equal(populationType.sourcePdfPage, 7);
  assert.equal(populationType.sourcePrintedPage, 9);
  assert.equal(populationType.sourceSection, "mission");
  assert.equal(populationType.reviewLocked, false);
  assert.equal(populationType.publisherKeyVerified, false);
  assert.equal(populationType.generatorKey, "source52ApplicationMissionFivePopulationBarLength");
  const populationGenerator = require("./source-5-2-population-bar-length.js");
  for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
    const question = populationGenerator.getQuestion(variant, difficulty);
    assert(question && question.sourceItemId === applicationMissionFiveId);
    assert.equal(question.answerModel.cities.length, 3);
    assert.equal(question.publisherKeyVerified, false);
  }
  assert.equal(perimeterType.reviewLocked, false);
  assert.equal(perimeterType.sourceVerified, true);
  assert.equal(perimeterType.answerVisualRequired, false);
  assert.equal(perimeterType.sourcePdfPage, 7);
  assert.equal(perimeterType.sourcePrintedPage, 9);
  assert.equal(perimeterType.sourceSection, "mission");
  assert.equal(perimeterType.verifiedVariantCount, 3);
  assert.equal(perimeterType.verifiedVariantTarget, 3);
  assert.equal(perimeterType.generationMode, "fixed-verified-pool");
  for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant++) {
    const question = api.generate(packingType, 1, difficulty, 1, variant);
    assert(question && question.sourceItemId === applicationMissionOneId);
    assert.equal(question.verifiedPoolIndex, variant);
    assert.equal(question.publisherKeyVerified, false);
  }
  return { total: types.length, semesterTypes: semesterTypes.length, legacyPreserved: 124, classified: added.length, roundingSourceItems: 5, roundingNewlyAvailable: 4, e2MissionItems: roundingMissions.length, e3ExplorationItems: applicationExploration.length, e3MissionItems: applicationMissionOne.length, e4RoundRangeItems: roundedRange.length };
}

const baselineRef = process.env.HSE_BASELINE_REF || "94a69f4bdda95c1d4e47494d3852f13c409165dc";
const baselineSource = execFileSync("git", ["show", `${baselineRef}:${curriculumPath}`], { cwd: repoRoot, encoding: "utf8" });
const baseline = load(baselineSource).curriculum.semesters.find(item => item.id === "5-2");
const currentSource = fs.readFileSync(path.join(__dirname, "curriculum.js"), "utf8");
const current = load(currentSource);
const result = validate(current.curriculum, current.api, baseline);
const negatives = [
  ["wrong-source-id", type => { type.sourceItemId = "5-2-u1-e1-example-9"; }],
  ["wrong-runtime-id", type => { type.id = "5-2-u1-t1"; }],
  ["wrong-pdf-page", type => { type.sourcePdfPage = 3; }],
  ["wrong-printed-page", type => { type.sourcePrintedPage = 5; }],
  ["missing-source-verification", type => { type.sourceVerified = false; }],
  ["false-publisher-verification", type => { type.publisherKeyVerified = true; }],
  ["wrong-pool-count", type => { type.verifiedVariantCount = 2; }]
];
for (const [name, mutate] of negatives) {
  const damaged = plain(current.curriculum);
  mutate(flatten(damaged).find(type => type.id === expectedIds[0]));
  assert.throws(() => validate(damaged, current.api, baseline), assert.AssertionError, `${name} must fail`);
}
const finalResult = { ...result, baselineRef, negativeControls: negatives.map(([name]) => name), status: "passed", officialAnswerVerified: false };
const output = process.env.HSE_AUDIT_OUTPUT;
if (output) {
  assert(path.isAbsolute(output), "Evidence output must be an absolute private path");
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "classification-audit.json"), JSON.stringify(finalResult, null, 2) + "\n");
}
  console.log(`5-2 source classification passed: ${result.classified} original-range records, ${result.roundingNewlyAvailable} unambiguous page-6 rounding records available, ${result.roundingSourceItems - result.roundingNewlyAvailable} ambiguous page-6 record locked, ${result.e2MissionItems} page-7 Missions available, ${result.e3ExplorationItems} page-8 Exploration 3 items, ${result.e3MissionItems} page-9 Missions verified, ${result.legacyPreserved} unchanged legacy records, ${negatives.length} rejected negative controls.`);
