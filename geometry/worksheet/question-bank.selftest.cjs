"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const QB = require("../shared/question-bank.js");
require("./generators.js");
const GEN = global.GW_GEN;
require("./render.js");
const REN = global.GW_RENDER;
require("./card.js");
const CARD = global.GW_CARD;

function example(overrides) {
  return Object.assign({
    type: "TC",
    prompt: "쌓기나무를 살펴보세요.",
    answerText: "6개",
    figures: {
      kind: "top-color",
      width: 2,
      depth: 2,
      numberGrid: true,
      map: [[2, 1], [1, 2]]
    },
    answer: { total: 6, askTotal: true },
    level: "L0",
    intensity: 3
  }, overrides || {});
}

test("question identity ignores copy and property order", () => {
  const first = example();
  const second = example({
    prompt: "Translated teacher-facing copy",
    answerText: "Total: 6",
    methodHint: "A changed hint",
    figures: {
      map: [[2, 1], [1, 2]],
      numberGrid: true,
      depth: 2,
      width: 2,
      kind: "top-color"
    }
  });
  const left = QB.createQuestionIdentity(first, { stage: "L0", difficulty: 3 });
  const right = QB.createQuestionIdentity(second, { stage: "L0", difficulty: 3 });
  assert.equal(left.questionId, right.questionId);
  assert.equal(left.familyId, right.familyId);
  assert.equal(left.placement.id, right.placement.id);
});

test("one question can occupy Kinder-high and Kids-low without being copied", () => {
  const problem = example();
  const kinder = QB.createQuestionIdentity(problem, { stage: "L0", difficulty: 3 });
  const kids = QB.createQuestionIdentity(problem, { stage: "L1", difficulty: 1 });
  assert.equal(kinder.questionId, kids.questionId);
  assert.equal(kinder.familyId, kids.familyId);
  assert.notEqual(kinder.placement.id, kids.placement.id);
  assert.deepEqual(QB.createPlacementIndex(kinder.questionId, [
    { stage: "L1", difficulty: 1 },
    { stage: "L0", difficulty: 3 }
  ]).map((entry) => [entry.stage, entry.difficulty]), [["L0", 3], ["L1", 1]]);
});

test("scaffolding creates a new item inside the same mathematical family", () => {
  const guided = example();
  const independent = example({
    figures: { ...guided.figures, numberGrid: false },
    answer: { ...guided.answer, askTotal: false }
  });
  const left = QB.createQuestionIdentity(guided, { stage: "L0", difficulty: 1 });
  const right = QB.createQuestionIdentity(independent, { stage: "L0", difficulty: 2 });
  assert.notEqual(left.questionId, right.questionId);
  assert.equal(left.familyId, right.familyId);
});

test("a mathematical change creates a different question and family", () => {
  const first = example();
  const second = example({
    figures: { ...first.figures, map: [[2, 1], [1, 3]] },
    answer: { total: 7, askTotal: true }
  });
  const left = QB.createQuestionIdentity(first, { stage: "L0", difficulty: 2 });
  const right = QB.createQuestionIdentity(second, { stage: "L0", difficulty: 2 });
  assert.notEqual(left.questionId, right.questionId);
  assert.notEqual(left.familyId, right.familyId);
});

test("a type-specific canonical family key can group equivalent rotations", () => {
  const first = example({ familyKey: { canonicalShape: "0,0;0,1;1,0" } });
  const second = example({
    familyKey: { canonicalShape: "0,0;0,1;1,0" },
    figures: { ...first.figures, map: [[1, 2], [2, 1]] }
  });
  const left = QB.createQuestionIdentity(first, { stage: "L2", difficulty: 2 });
  const right = QB.createQuestionIdentity(second, { stage: "L2", difficulty: 2 });
  assert.notEqual(left.questionId, right.questionId);
  assert.equal(left.familyId, right.familyId);
});

test("worksheet generation exposes deterministic stable IDs and keeps codes compatible", () => {
  const options = { types: ["TC", "IC"], count: 8, seed: 0x1234abcd, level: "L2", intensity: 2 };
  const first = GEN.generateWorksheet(options);
  const second = GEN.generateWorksheet(options);
  assert.equal(first.code, second.code);
  assert.deepEqual(first.questionBank, second.questionBank);
  assert.deepEqual(first.problems.map((problem) => problem.identity), second.problems.map((problem) => problem.identity));
  assert.deepEqual(first.questionBank.questionIds, first.problems.map((problem) => problem.identity.questionId));
  assert.ok(first.problems.every((problem) => QB.isId(problem.identity.questionId, "question")));
  assert.deepEqual(GEN.parseCode(first.code), {
    types: ["TC", "IC"],
    count: 8,
    seed: 0x1234abcd,
    level: "L2",
    intensity: 2,
    arrange: ""
  });
  const legacy = GEN.parseCode("#GW-TC-5x0abc");
  assert.equal(legacy.types[0], "TC");
  assert.equal(legacy.count, 5);
  assert.equal(legacy.seed, parseInt("abc", 36));
});

test("generated sample has no hash collision between different item payloads", () => {
  const payloadById = new Map();
  for (const type of GEN.TYPES) {
    for (let difficulty = 1; difficulty <= 3; difficulty += 1) {
      for (let seed = 1; seed <= 120; seed += 1) {
        const problem = GEN.make(
          type.code,
          GEN.createRng("identity-audit:" + type.code + ":" + difficulty + ":" + seed),
          type.levels[0],
          difficulty
        );
        const id = problem.identity.questionId;
        const payload = QB.stableSerialize(QB.questionPayload(problem, false));
        if (payloadById.has(id)) assert.equal(payloadById.get(id), payload, "different payloads share " + id);
        else payloadById.set(id, payload);
      }
    }
  }
  assert.ok(payloadById.size > 1000);
});

test("invalid IDs and duplicate placements are rejected", () => {
  const identity = QB.createQuestionIdentity(example(), { stage: "L0", difficulty: 1 });
  assert.throws(() => QB.createPlacement(identity.questionId, "KIDS", 1), /L0 through L8/);
  assert.throws(() => QB.createPlacement(identity.questionId, "L1", 4), /1, 2, or 3/);
  assert.throws(() => QB.createPlacementIndex(identity.questionId, [
    { stage: "L0", difficulty: 1 },
    { stage: "L0", difficulty: 1 }
  ]), /duplicate question placement/);
});

test("direct-count profiles satisfy every stage, difficulty, and visibility rule", () => {
  let checked = 0;
  for (let level = 0; level <= 5; level += 1) {
    for (let difficulty = 1; difficulty <= 3; difficulty += 1) {
      const stage = "L" + level;
      const profile = GEN.countingProfile(stage, difficulty);
      for (let seed = 1; seed <= 250; seed += 1) {
        const problem = GEN.make("IC", GEN.createRng("count-profile:" + stage + ":" + difficulty + ":" + seed), stage, difficulty);
        const validation = GEN.validateCountingMap(
          problem.figures.map,
          problem.figures.width,
          problem.figures.depth,
          profile
        );
        assert.equal(validation.ok, true, stage + " D" + difficulty + " seed " + seed + ": " + validation.errors.join(","));
        assert.equal(validation.visibility, "all-column-tops");
        assert.equal(validation.lineOfSight.ok, true);
        assert.equal(validation.lineOfSight.viewpoint, GEN.ISO_VIEWPOINT.code);
        assert.equal(validation.lineOfSight.checkedColumns, validation.columns);
        assert.deepEqual(validation.lineOfSight.axisBlockers, []);
        assert.deepEqual(validation.lineOfSight.topBlockers, []);
        assert.equal(problem.figures.visibility, "all-column-tops");
        assert.equal(problem.figures.viewpoint, GEN.ISO_VIEWPOINT.code);
        assert.match(problem.prompt, /모두 몇 개/);
        assert.doesNotMatch(problem.prompt, /최소 몇 개/);
        assert.ok(validation.peak >= 2, stage + " D" + difficulty + " must include a two-story stack");
        checked += 1;
      }
    }
  }
  assert.equal(checked, 4500);
});

test("isometric renderer and visibility audit share one explicit viewpoint", () => {
  const readable = [[3, 2], [2, 1]];
  const blocked = [[1, 3], [1, 1]];
  const sight = GEN.auditIsoLineOfSight(readable, 2, 2, GEN.ISO_VIEWPOINT.code);
  assert.equal(sight.ok, true);
  assert.deepEqual(sight.viewerVector, [1, 1, 1]);
  assert.deepEqual(sight.visibleFaces, ["top", "+x", "+z"]);
  const badSight = GEN.auditIsoLineOfSight(blocked, 2, 2, GEN.ISO_VIEWPOINT.code);
  assert.equal(badSight.ok, false);
  assert.ok(badSight.errors.includes("axis-occlusion"));
  const svg = REN.renderIso(readable, 2, 2, { viewpoint: GEN.ISO_VIEWPOINT.code });
  assert.match(svg, new RegExp('data-viewpoint="' + GEN.ISO_VIEWPOINT.code + '"'));
  assert.throws(() => REN.renderIso(readable, 2, 2, { viewpoint: "opposite-camera" }), /unsupported worksheet isometric viewpoint/);
});

test("every generated isometric cube figure records the renderer viewpoint", () => {
  let checked = 0;
  for (const type of GEN.TYPES) {
    for (const stage of type.levels) {
      for (let difficulty = 1; difficulty <= 3; difficulty += 1) {
        const problem = GEN.make(
          type.code,
          GEN.createRng("viewpoint-contract:" + type.code + ":" + stage + ":" + difficulty),
          stage,
          difficulty
        );
        const expected = GEN.figureViewpointCode(problem.figures);
        if (!expected) continue;
        assert.equal(problem.figures.viewpoint, expected, type.code + " " + stage + " D" + difficulty);
        checked += 1;
      }
    }
  }
  assert.ok(checked >= 80);
  assert.notEqual(GEN.ISO_TOP_VIEWPOINT.code, GEN.ISO_VIEWPOINT.code);
});

test("source-backed lower-stage placements stay separated by problem structure", () => {
  assert.deepEqual(GEN.typeInfo("IC").levels, ["L0", "L1", "L2", "L3", "L4", "L5"]);
  assert.deepEqual(GEN.typeInfo("SQ").levels, ["L1", "L2", "L3", "L4", "L5"]);
  assert.deepEqual(GEN.typeInfo("CU").levels, ["L2", "L3", "L4", "L5"]);
  assert.deepEqual(GEN.typeInfo("MV").levels, ["L2", "L3", "L4", "L5"]);
  assert.deepEqual(GEN.typesForLevel("L0"), ["IC"]);
  assert.ok(GEN.typesForLevel("L1").includes("SQ"));
  assert.ok(GEN.typesForLevel("L2").includes("CU"));
  assert.ok(GEN.typesForLevel("L2").includes("MV"));
  assert.equal(GEN.typeSupportsLevel("SQ", "L0"), false);
  assert.equal(GEN.typeSupportsLevel("CU", "L1"), false);
});

test("Kids cube sequences begin with the visible staircase rule", () => {
  for (let difficulty = 1; difficulty <= 3; difficulty += 1) {
    for (let seed = 1; seed <= 120; seed += 1) {
      const problem = GEN.make(
        "SQ",
        GEN.createRng("kids-sequence:" + difficulty + ":" + seed),
        "L1",
        difficulty
      );
      assert.equal(problem.answer.patternKind, "stair");
      assert.equal(problem.answer.mode, "nth");
      assert.deepEqual(problem.answer.stageTotals.slice(0, 4), [1, 3, 6, 10]);
      assert.ok(problem.answer.n >= 4 && problem.answer.n <= 6);
    }
  }
});

test("one-cube-move choices have one answer and preserve the explicit viewpoint", () => {
  const labels = ["가", "나", "다", "라"];
  let checked = 0;
  for (let level = 2; level <= 5; level += 1) {
    for (let difficulty = 1; difficulty <= 3; difficulty += 1) {
      const stage = "L" + level;
      for (let seed = 1; seed <= 120; seed += 1) {
        const problem = GEN.make(
          "MV",
          GEN.createRng("move-one-cube:" + stage + ":" + difficulty + ":" + seed),
          stage,
          difficulty
        );
        const figures = problem.figures;
        assert.equal(figures.kind, "iso-options");
        assert.equal(figures.viewpoint, GEN.ISO_VIEWPOINT.code);
        assert.equal(figures.choices.length, difficulty === 1 ? 3 : 4);
        assert.deepEqual(figures.labels, labels.slice(0, figures.choices.length));
        assert.equal(problem.answer.distances.filter((distance) => distance === 1).length, 1);
        assert.equal(problem.answer.distances[problem.answer.choiceIndex], 1);
        assert.equal(problem.answer.choice, labels[problem.answer.choiceIndex]);

        [figures.source].concat(figures.choices).forEach((map) => {
          assert.equal(GEN.mapTotal(map), problem.answer.sourceTotal);
          const sight = GEN.auditIsoLineOfSight(
            map,
            figures.width,
            figures.depth,
            figures.viewpoint
          );
          assert.equal(sight.ok, true, stage + " D" + difficulty + " seed " + seed);
          assert.deepEqual(sight.axisBlockers, []);
          assert.deepEqual(sight.topBlockers, []);
        });

        const html = CARD.renderFigures(problem);
        const viewpointMarks = html.match(/data-viewpoint="iso-plus-x-plus-z-v1"/g) || [];
        assert.equal(viewpointMarks.length, figures.choices.length + 1);
        checked += 1;
      }
    }
  }
  assert.equal(checked, 1440);
});
