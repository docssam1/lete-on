import { GENERATORS } from "./generators.js";
import { book03Markup } from "./book03-renderers.js";
import { CURRICULUM, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "500", 10);

const unit02Ids = [
  "folded-strip-length",
  "midpoint-number-line",
  "segment-chain-distance",
  "equal-interval-length",
  "walking-step-ratio",
  "route-distance-multiple",
  "rod-ratio-total-book3",
  "unit-object-length",
  "equivalent-object-length",
  "object-combination-equivalent-count",
  "proportional-rods-common-total",
  "number-line-six-points",
  "meeting-distance-ratio",
  "mixed-interval-distance",
  "difference-unit-measure"
];

const failures = [];

function addFailure(id, check, detail) {
  failures.push({ id, check, detail });
}

function expect(condition, id, check, detail) {
  if (!condition) addFailure(id, check, detail);
}

function getUnit02() {
  const book03 = CURRICULUM.find((book) => book.id === "book-03");
  return book03?.units?.[1];
}

function generate(id, difficulty) {
  const generatorName = typeById(id)?.generator;
  const generator = GENERATORS[generatorName];
  if (!generator) {
    addFailure(id, "generator", `missing generator ${generatorName || "(unmapped)"}`);
    return null;
  }
  return generator({ difficulty });
}

function auditMidpointMarker() {
  const id = "midpoint-number-line";
  for (const difficulty of [1, 2, 3]) {
    const problem = generate(id, difficulty);
    if (!problem) continue;
    const { visual } = problem;
    const markup = book03Markup(visual);
    expect(
      visual?.target === "middle" && visual.divisions % 2 === 0,
      id,
      `L${difficulty} central tick data`,
      `middle target needs an even division count; got divisions=${visual?.divisions}`
    );
    expect(
      markup.includes("㉠"),
      id,
      `L${difficulty} central marker render`,
      "rendered number line must show the unknown midpoint marker"
    );
  }
}

function auditRouteRatioData() {
  const id = "route-distance-multiple";
  for (const difficulty of [1, 2, 3]) {
    const problem = generate(id, difficulty);
    if (!problem) continue;
    const { meta, visual } = problem;
    const ratio = meta.second / meta.first;
    expect(
      ratio === meta.answer,
      id,
      `L${difficulty} route math`,
      `second/first ratio ${ratio} does not match answer ${meta.answer}`
    );
    expect(
      visual.ratio === meta.answer || visual.unitRatio === meta.answer,
      id,
      `L${difficulty} route ratio data`,
      "visual data must expose the asked route ratio, not only raw minute labels"
    );
    expect(
      book03Markup(visual).includes(`--weight:${visual.first}`) && book03Markup(visual).includes(`--weight:${visual.second}`),
      id,
      `L${difficulty} route segment data`,
      "renderer should carry both route segment values for proportional drawing"
    );
  }
}

function auditRodCommonUnitWidthData() {
  const id = "rod-ratio-total-book3";
  for (const difficulty of [1, 2, 3]) {
    const problem = generate(id, difficulty);
    if (!problem) continue;
    const { visual } = problem;
    const units = visual.rows?.map((row) => row.units) || [];
    expect(
      units.length === 2 && units.every((unit) => Number.isInteger(unit) && unit > 0),
      id,
      `L${difficulty} rod unit counts`,
      `invalid row unit counts: ${JSON.stringify(units)}`
    );
    expect(
      Number.isInteger(visual.maxUnits) || Number.isInteger(visual.commonUnitCount) || Number.isFinite(visual.unitWidth),
      id,
      `L${difficulty} common unit width data`,
      "visual data must include a shared scale so equal rod units render at the same width across rows"
    );
  }
}

function auditMixedIntervalInternalIndexes() {
  const id = "mixed-interval-distance";
  const boundaryExamples = [];
  for (const difficulty of [1, 2, 3]) {
    for (let index = 0; index < iterations; index += 1) {
      const problem = generate(id, difficulty);
      if (!problem) continue;
      const { meta } = problem;
      const leftInternal = meta.leftIndex > 0 && meta.leftIndex < meta.leftDivisions;
      const rightInternal = meta.rightIndex > 0 && meta.rightIndex < meta.rightDivisions;
      if (!leftInternal || !rightInternal) {
        boundaryExamples.push({
          difficulty,
          leftIndex: meta.leftIndex,
          leftDivisions: meta.leftDivisions,
          rightIndex: meta.rightIndex,
          rightDivisions: meta.rightDivisions
        });
        break;
      }
    }
  }
  expect(
    boundaryExamples.length === 0,
    id,
    "internal unknown indexes",
    `㉠/㉡ can overwrite endpoint labels: ${JSON.stringify(boundaryExamples)}`
  );
}

function auditDifferenceUnitDifferenceRodData() {
  const id = "difference-unit-measure";
  for (const difficulty of [1, 2, 3]) {
    const problem = generate(id, difficulty);
    if (!problem) continue;
    const { meta, visual } = problem;
    const markup = book03Markup(visual);
    expect(
      meta.difference === meta.firstLength - meta.secondLength,
      id,
      `L${difficulty} difference math`,
      "meta difference must equal first rod length minus second rod length"
    );
    expect(
      visual.difference === meta.difference || visual.differenceUnits === 1 || visual.differenceCount === 1,
      id,
      `L${difficulty} difference rod data`,
      "visual data must include the ㉢ difference rod made from ㉠ minus ㉡"
    );
    expect(
      markup.includes("㉢") || markup.includes("ㄷ"),
      id,
      `L${difficulty} difference rod render`,
      "rendered visual must show the difference rod target"
    );
  }
}

function auditEquivalentObjectRefs() {
  const id = "equivalent-object-length";
  const unit02 = getUnit02();
  const refs = unit02?.typeStudyRefs?.[id];
  const practiceNumbers = (refs?.practice || []).flatMap((reference) => reference.numbers || []);
  expect(
    !practiceNumbers.includes(12),
    id,
    "practice refs",
    `practice 12 is the recorder-to-matchsticks conversion structure, not equivalent-object-length; got [${practiceNumbers.join(", ")}]`
  );
}

function auditUnit02Coverage() {
  const unit02 = getUnit02();
  expect(Boolean(unit02), "book-03/unit-02", "unit lookup", "book-03 unit 02 missing");
  if (!unit02) return;
  expect(
    JSON.stringify(unit02.typeIds) === JSON.stringify(unit02Ids),
    "book-03/unit-02",
    "type order",
    `unexpected unit 02 typeIds: ${JSON.stringify(unit02.typeIds)}`
  );
}

auditUnit02Coverage();
auditMidpointMarker();
auditRouteRatioData();
auditRodCommonUnitWidthData();
auditMixedIntervalInternalIndexes();
auditDifferenceUnitDifferenceRodData();
auditEquivalentObjectRefs();

if (failures.length) {
  console.error(`BOOK03 unit 02 source audit failed: ${failures.length} issue(s)`);
  console.table(failures);
  process.exitCode = 1;
} else {
  console.log(`BOOK03 unit 02 source audit passed (${iterations} mixed-interval samples per difficulty).`);
}
