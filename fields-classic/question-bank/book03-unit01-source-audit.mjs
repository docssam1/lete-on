import { GENERATORS } from "./generators.js";
import { CURRICULUM, typeById } from "./source-data.js";
import {
  partitionGeometryForAudit,
  tangramBoardGeometryForAudit,
  tangramCompositeGeometryForAudit
} from "./book03-renderers.js";

const iterations = Number.parseInt(process.argv[2] || "200", 10);
const difficulties = [1, 2, 3];

const UNIT01_TYPE_IDS = Object.freeze([
  "tangram-shape-composition",
  "tangram-piece-area",
  "unit-grid-area",
  "growing-shape-area-sum",
  "nested-square-outer-area",
  "equal-part-shaded-fraction",
  "equal-partition-drawing",
  "incomplete-partition-fraction",
  "oblique-square-grid-area"
]);

const UNSAFE = Object.freeze({});

const SAFE = Object.freeze({
  "tangram-shape-composition": {
    family: "tangram-composition",
    visualSubtype: "tangram-composition-source"
  },
  "tangram-piece-area": {
    family: "tangram-area",
    visualSubtype: "tangram-area-source"
  },
  "growing-shape-area-sum": {
    family: "shape-area-growth",
    visualSubtype: "shape-area-growth",
    allowedShapes: new Set(["triangle", "square"])
  },
  "nested-square-outer-area": {
    family: "nested-square-area",
    visualSubtype: "nested-square-area"
  },
  "unit-grid-area": {
    family: "unit-grid-area",
    visualSubtype: "unit-grid-area"
  },
  "equal-part-shaded-fraction": {
    family: "equal-fraction",
    visualSubtype: "equal-fraction-source"
  },
  "equal-partition-drawing": {
    family: "equal-partition-drawing",
    visualSubtype: "equal-partition-source"
  },
  "incomplete-partition-fraction": {
    family: "incomplete-fraction",
    visualSubtype: "incomplete-partition-source"
  },
  "oblique-square-grid-area": {
    family: "oblique-square-area",
    visualSubtype: "oblique-square-area"
  }
});

const DISALLOWED_UNIT01_FAMILIES = Object.freeze([
  "midpoint",
  "segment-chain",
  "equal-interval",
  "folded-strip",
  "step-ratio",
  "route-multiple",
  "rod-total",
  "unit-object",
  "equivalent-object",
  "proportional-rods",
  "meeting-distance",
  "mixed-interval",
  "difference-unit"
]);

const PARTITION_TEMPLATE_SPECS = Object.freeze({
  "triangle-3": { parts: 3, internalLines: 3 },
  "triangle-4": { parts: 4, internalLines: 3 },
  "triangle-6": { parts: 6, internalLines: 6 },
  "triangle-8": { parts: 8, internalLines: 7 },
  "triangle-12": { parts: 12, internalLines: 15 },
  "hexagon-12": { parts: 12, internalLines: 12 },
  "hexagon-18": { parts: 18, internalLines: 24 }
});

const TANGRAM_SOURCE_AREAS = Object.freeze({ 1: 4, 2: 4, 3: 2, 4: 1, 5: 2, 6: 1, 7: 2 });

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const polygonArea = (points) => Math.abs(points.reduce((sum, [x, y], index) => {
  const [nextX, nextY] = points[(index + 1) % points.length];
  return sum + x * nextY - nextX * y;
}, 0)) / 2;

const sideSignature = (points) => points.map(([x, y], index) => {
  const [nextX, nextY] = points[(index + 1) % points.length];
  return Math.hypot(nextX - x, nextY - y);
}).sort((a, b) => a - b);

function pointInPolygon([x, y], points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[previous];
    if ((y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) inside = !inside;
  }
  return inside;
}

function assertSampledExactCover(label, outline, cells) {
  const minX = Math.min(...outline.map(([x]) => x));
  const maxX = Math.max(...outline.map(([x]) => x));
  const minY = Math.min(...outline.map(([, y]) => y));
  const maxY = Math.max(...outline.map(([, y]) => y));
  const step = 0.05;
  // x와 y의 시작점을 다르게 두어 공유 대각선 위의 점을 표본으로 잡지 않는다.
  for (let y = minY + step * 0.53; y < maxY; y += step) {
    for (let x = minX + step * 0.37; x < maxX; x += step) {
      if (!pointInPolygon([x, y], outline)) continue;
      const covering = cells.filter((cell) => pointInPolygon([x, y], cell.points)).length;
      assert(covering === 1, `${label} is not an exact one-piece cover near ${x.toFixed(2)},${y.toFixed(2)}: ${covering}`);
    }
  }
}

function assertTangramGeometry() {
  const board = tangramBoardGeometryForAudit();
  assert(board.cells.length === 7, `tangram board must have 7 pieces, got ${board.cells.length}`);
  assert(new Set(board.cells.map((cell) => cell.id)).size === 7, "tangram board piece ids must be unique");
  board.cells.forEach((cell) => {
    assert(Math.abs(polygonArea(cell.points) - TANGRAM_SOURCE_AREAS[cell.id]) < 0.001,
      `tangram board piece ${cell.id} area mismatch: ${polygonArea(cell.points)}`);
  });
  assert(Math.abs(board.cells.reduce((sum, cell) => sum + polygonArea(cell.points), 0) - polygonArea(board.outline)) < 0.001,
    "tangram board pieces do not cover the 4x4 square by area");
  assertSampledExactCover("tangram board", board.outline, board.cells);

  const expectedSets = { 3: [4, 6, 7], 5: [3, 4, 5, 6, 7] };
  for (const pieceCount of [3, 5]) {
    const composite = tangramCompositeGeometryForAudit(pieceCount);
    assert(composite?.cells.length === pieceCount, `${pieceCount}-piece square cell count mismatch`);
    assert(JSON.stringify(composite.cells.map((cell) => cell.id).sort()) === JSON.stringify(expectedSets[pieceCount]),
      `${pieceCount}-piece square uses wrong pieces`);
    const scales = composite.cells.map((cell) => polygonArea(cell.points) / TANGRAM_SOURCE_AREAS[cell.id]);
    assert(scales.every((scale) => Math.abs(scale - scales[0]) < 0.001), `${pieceCount}-piece square distorts relative piece areas`);
    assert(Math.abs(composite.cells.reduce((sum, cell) => sum + polygonArea(cell.points), 0) - polygonArea(composite.outline)) < 0.001,
      `${pieceCount}-piece square does not cover its outline by area`);
    assertSampledExactCover(`${pieceCount}-piece square`, composite.outline, composite.cells);
  }
}

function assertPartitionGeometry(template) {
  const spec = PARTITION_TEMPLATE_SPECS[template];
  assert(spec, `partition template spec missing: ${template}`);
  const geometry = partitionGeometryForAudit(template);
  assert(geometry.cells.length === spec.parts, `${template} cell count mismatch: ${geometry.cells.length}`);
  assert(geometry.segments.length === spec.internalLines, `${template} internal-line count mismatch: ${geometry.segments.length}`);
  const areas = geometry.cells.map(polygonArea);
  const firstArea = areas[0];
  assert(areas.every((area) => Math.abs(area - firstArea) < 0.001), `${template} cells are not equal-area`);
  const firstSides = sideSignature(geometry.cells[0]);
  assert(geometry.cells.every((cell) => sideSignature(cell).every((side, index) => Math.abs(side - firstSides[index]) < 0.001)), `${template} cells are not congruent`);
  const totalCellArea = areas.reduce((sum, area) => sum + area, 0);
  assert(Math.abs(totalCellArea - polygonArea(geometry.outline)) < 0.01, `${template} cells do not cover the whole outline`);
}

const fingerprint = (problem) => JSON.stringify({
  prompt: problem.prompt,
  visual: problem.visual,
  meta: problem.meta,
  responseKind: problem.responseKind
});

function unit01FromCurriculum() {
  const book = CURRICULUM.find((item) => item.id === "book-03");
  assert(book, "book-03 missing from curriculum");
  const unit = book.units?.[0];
  assert(unit?.label === "단위넓이와 분수", `unexpected book03 unit01 label: ${unit?.label}`);
  return unit.typeIds;
}

function generate(typeId, difficulty) {
  const type = typeById(typeId);
  assert(type, `type missing: ${typeId}`);
  const generator = GENERATORS[type.generator];
  assert(generator, `generator missing: ${typeId}:${type.generator}`);
  const problem = generator({ difficulty });
  assert(problem, `generator returned empty problem: ${typeId}/L${difficulty}`);
  assert(problem.prompt?.trim(), `prompt missing: ${typeId}/L${difficulty}`);
  assert(problem.visual, `visual missing: ${typeId}/L${difficulty}`);
  assert(problem.meta, `meta missing: ${typeId}/L${difficulty}`);
  return { type, problem };
}

function assertUnsafeStaysUnsafe(typeId, type, problem) {
  assert(UNSAFE[typeId], `unsafe policy missing for ${typeId}`);
  assert(type.sourceAuditBlocked === true, `${typeId} must remain sourceAuditBlocked until its source structure is rebuilt`);
  assert(problem.meta?.sourceReady !== true, `${typeId} must not declare meta.sourceReady=true while marked UNSAFE`);
  assert(problem.meta?.ready !== true, `${typeId} must not declare meta.ready=true while marked UNSAFE`);
  assert(problem.visual?.sourceReady !== true, `${typeId} must not declare visual.sourceReady=true while marked UNSAFE`);
  assert(!/\bsource[- ]?ready\b/i.test(problem.prompt), `${typeId} prompt must not claim source ready`);
}

function assertNoUnit02Leak(typeId, problem, difficulty) {
  const family = problem.meta?.family;
  assert(!DISALLOWED_UNIT01_FAMILIES.includes(family), `${typeId}/L${difficulty} leaked non-unit01 family: ${family}`);
  assert(problem.visual?.subtype !== "number-line", `${typeId}/L${difficulty} leaked number-line visual`);
  assert(!/중간수|수직선|걸음|길이|cm|테이프|리본|막대|성냥개비|연필|통나무/.test(problem.prompt),
    `${typeId}/L${difficulty} prompt looks like a non-unit01 length problem: ${problem.prompt}`);
}

function assertReadyStructure(typeId, problem, difficulty) {
  const policy = SAFE[typeId];
  assert(policy, `${typeId} is not in SAFE and must not be audited as ready`);
  assert(problem.meta.family === policy.family, `${typeId}/L${difficulty} family mismatch: ${problem.meta.family}`);
  assert(problem.visual.kind === "book3", `${typeId}/L${difficulty} visual kind mismatch: ${problem.visual.kind}`);
  assert(problem.visual.subtype === policy.visualSubtype, `${typeId}/L${difficulty} visual subtype mismatch: ${problem.visual.subtype}`);

  if (typeId === "tangram-shape-composition") {
    assert(problem.meta.template === "five-piece-square", `${typeId}/L${difficulty} must use the source five-piece square`);
    assert(JSON.stringify([...problem.meta.pieceIds].sort()) === JSON.stringify([3,4,5,6,7]), `${typeId}/L${difficulty} must use the five non-large pieces`);
    assert(problem.meta.fixedPieceIds.every((id) => problem.meta.pieceIds.includes(id)), `${typeId}/L${difficulty} fixed piece is not in the inventory`);
    assert(problem.visual.complete === false, `${typeId}/L${difficulty} question must leave lines to draw`);
    assert(problem.answerVisual?.complete === true, `${typeId}/L${difficulty} answer must show all five pieces`);
    assert(problem.responseKind === "drawing", `${typeId}/L${difficulty} must be answered by drawing`);
    assert(problem.answer === "그림과 같이 5조각으로 정사각형 완성", `${typeId}/L${difficulty} drawing answer mismatch`);
  }

  if (typeId === "tangram-piece-area") {
    const expectedMode = difficulty === 1 ? "piece" : difficulty === 2 ? "three-piece-square" : "five-piece-square";
    const expectedPieces = difficulty === 1 ? null : difficulty === 2 ? [4,6,7] : [3,4,5,6,7];
    assert(problem.meta.askMode === expectedMode, `${typeId}/L${difficulty} ask mode mismatch: ${problem.meta.askMode}`);
    if (expectedPieces) assert(JSON.stringify([...problem.meta.selected].sort()) === JSON.stringify(expectedPieces), `${typeId}/L${difficulty} wrong composed-square pieces`);
    else assert(problem.meta.selected.length === 1, `${typeId}/L1 must ask one numbered piece`);
    assert(problem.visual.pieceAreas === undefined, `${typeId}/L${difficulty} must not print the answer table in the question`);
    const total = problem.meta.selected.reduce((sum, id) => sum + TANGRAM_SOURCE_AREAS[id] * problem.meta.unitArea, 0);
    assert(problem.answer === String(total), `${typeId}/L${difficulty} area answer mismatch`);
  }

  if (typeId === "growing-shape-area-sum") {
    assert(policy.allowedShapes.has(problem.meta.shape), `${typeId}/L${difficulty} source allows only triangle/square, got ${problem.meta.shape}`);
    assert(policy.allowedShapes.has(problem.visual.shape), `${typeId}/L${difficulty} visual allows only triangle/square, got ${problem.visual.shape}`);
    assert(problem.meta.start === 1, `${typeId}/L${difficulty} source growth must start at 1, got ${problem.meta.start}`);
    assert(problem.meta.areas.every((area, index) => area === (index + 1) ** 2), `${typeId}/L${difficulty} growth areas must be 1,4,9...`);
  }

  if (typeId === "nested-square-outer-area") {
    assert(problem.meta.step === 1, `${typeId}/L${difficulty} source nested square step must be 1, got ${problem.meta.step}`);
    assert(problem.meta.firstSide === 1, `${typeId}/L${difficulty} source nested square first side must be 1, got ${problem.meta.firstSide}`);
    assert(problem.meta.areas.every((area, index) => area === (index + 1) ** 2 * problem.meta.unitArea), `${typeId}/L${difficulty} nested square areas must follow 1,4,9... times the shown unit area`);
    assert(problem.meta.askSum === false || problem.meta.count === 6, `${typeId}/L${difficulty} source sum form is the 1st-6th outer-square sum`);
  }

  if (typeId === "unit-grid-area") {
    assert(problem.meta.connected === true, `${typeId}/L${difficulty} must be one connected source-style silhouette`);
    assert(problem.meta.areaTwice > 0, `${typeId}/L${difficulty} must have positive area`);
    assert(problem.visual.points.length >= 3, `${typeId}/L${difficulty} must draw one polygon`);
    assert(problem.answer === (problem.meta.areaTwice % 2 === 0 ? String(problem.meta.areaTwice / 2) : `${Math.floor(problem.meta.areaTwice / 2)}와 1/2`), `${typeId}/L${difficulty} area answer mismatch`);
  }

  if (typeId === "equal-part-shaded-fraction") {
    assert(problem.meta.equalParts === true, `${typeId}/L${difficulty} must use equal-size partitions`);
    assert(["circle-radial", "triangle-grid", "hexagon-radial"].includes(problem.meta.template), `${typeId}/L${difficulty} unsupported source partition`);
    assert(problem.answer === `${problem.meta.shaded}/${problem.meta.parts}`, `${typeId}/L${difficulty} fraction answer mismatch`);
    if (problem.meta.template === "triangle-grid") {
      const order = Math.sqrt(problem.meta.parts);
      assert(Number.isInteger(order), `${typeId}/L${difficulty} triangle partition must have n² equal cells`);
    }
  }

  if (typeId === "equal-partition-drawing") {
    const allowedByDifficulty = {
      1: new Set(["triangle-3", "triangle-4"]),
      2: new Set(["triangle-6", "triangle-8", "hexagon-12"]),
      3: new Set(["triangle-12", "hexagon-18"])
    };
    assert(allowedByDifficulty[difficulty].has(problem.meta.template), `${typeId}/L${difficulty} unsupported source template: ${problem.meta.template}`);
    assert(problem.meta.equalParts === true, `${typeId}/L${difficulty} must use congruent source partitions`);
    assert(problem.answerVisual?.complete === true, `${typeId}/L${difficulty} answer must show the completed construction`);
    assert(problem.answerVisual?.parts === problem.meta.parts, `${typeId}/L${difficulty} answer visual part count mismatch`);
    assert(problem.answer === `${problem.meta.parts}조각으로 나누고 ${problem.meta.shaded}조각 색칠`, `${typeId}/L${difficulty} drawing answer mismatch`);
  }

  if (typeId === "incomplete-partition-fraction") {
    assert(problem.meta.equalParts === true, `${typeId}/L${difficulty} must use congruent source partitions`);
    assert(problem.meta.visibleLines > 0, `${typeId}/L${difficulty} must preserve source guide lines`);
    assert(problem.meta.visibleLines < problem.meta.internalLines, `${typeId}/L${difficulty} must hide at least one necessary line`);
    assert(problem.visual.complete === false, `${typeId}/L${difficulty} question visual must remain incomplete`);
    assert(problem.answerVisual?.complete === true, `${typeId}/L${difficulty} answer must complete every missing line`);
    assert(problem.answer === `${problem.meta.shaded}/${problem.meta.parts}`, `${typeId}/L${difficulty} fraction answer mismatch`);
  }

  if (typeId === "oblique-square-grid-area" && difficulty === 3) {
    assert(problem.meta.areas.length === 2, `${typeId}/L3 must show two tilted squares`);
    assert(problem.answer === `㉠=${problem.meta.areas[0]}, ㉡=${problem.meta.areas[1]}`, `${typeId}/L3 must ask for both areas separately`);
    assert(problem.responseKind === "list", `${typeId}/L3 needs two visible answer entries`);
  }
}

function audit() {
  assertTangramGeometry();
  Object.keys(PARTITION_TEMPLATE_SPECS).forEach(assertPartitionGeometry);
  const curriculumTypeIds = unit01FromCurriculum();
  assert(JSON.stringify(curriculumTypeIds) === JSON.stringify(UNIT01_TYPE_IDS),
    `book03 unit01 typeIds changed:\nexpected ${UNIT01_TYPE_IDS.join(", ")}\nactual   ${curriculumTypeIds.join(", ")}`);

  const unsafeIds = Object.keys(UNSAFE);
  const safeIds = Object.keys(SAFE);
  assert(unsafeIds.length + safeIds.length === UNIT01_TYPE_IDS.length, "SAFE/UNSAFE policy does not cover all unit01 types");

  const variants = new Map();
  const violations = new Set();
  let generated = 0;

  for (const typeId of UNIT01_TYPE_IDS) {
    for (const difficulty of difficulties) {
      const seen = new Set();
      for (let run = 0; run < iterations; run += 1) {
        const { type, problem } = generate(typeId, difficulty);
        assertNoUnit02Leak(typeId, problem, difficulty);
        if (UNSAFE[typeId]) assertUnsafeStaysUnsafe(typeId, type, problem);
        if (SAFE[typeId]) {
          try {
            assertReadyStructure(typeId, problem, difficulty);
          } catch (error) {
            violations.add(error.message);
          }
        }
        seen.add(fingerprint(problem));
        generated += 1;
      }
      variants.set(`${typeId}/L${difficulty}`, seen.size);
    }
  }

  assert(violations.size === 0, `source-ready structure violations:\n- ${[...violations].join("\n- ")}`);

  return {
    generated,
    safe: safeIds,
    unsafe: unsafeIds,
    minVariants: Math.min(...variants.values())
  };
}

const result = audit();
console.log(`BOOK03_UNIT01_SOURCE_AUDIT_OK generated=${result.generated} iterations=${iterations} safe=${result.safe.length} unsafe=${result.unsafe.length} minVariants=${result.minVariants}`);
console.log(`SAFE ${result.safe.join(", ")}`);
console.log(`UNSAFE ${result.unsafe.join(", ")}`);
