import { GENERATORS } from "./generators.js";
import { CURRICULUM, typeById } from "./source-data.js";

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

const UNSAFE = Object.freeze({
  "tangram-shape-composition": "source uses multi-piece tangram composition/drawing; current generator is one-missing-piece multiple choice.",
  "tangram-piece-area": "source uses a 4x4 tangram table and composed-square area; current generator exposes per-piece areas and asks for a sum.",
  "unit-grid-area": "source uses coherent shaded grid figures; current generator is closer to random full/half cell sets.",
  "equal-part-shaded-fraction": "source has circle, triangular-grid, hexagon, star, and square partitions; current generator collapses them to radial common shapes.",
  "equal-partition-drawing": "source includes triangle 3/4/6/12 partitions and hexagon 12/18 partitions; current generator does not cover them exactly.",
  "incomplete-partition-fraction": "source relies on partial lines/internal-figure constraints; current generator collapses these to radial common shapes."
});

const SAFE = Object.freeze({
  "growing-shape-area-sum": {
    family: "shape-area-growth",
    visualSubtype: "shape-area-growth",
    allowedShapes: new Set(["triangle", "square"])
  },
  "nested-square-outer-area": {
    family: "nested-square-area",
    visualSubtype: "nested-square-area"
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

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

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

  if (typeId === "oblique-square-grid-area" && difficulty === 3) {
    assert(problem.meta.areas.length === 2, `${typeId}/L3 must show two tilted squares`);
    assert(problem.answer === `㉠=${problem.meta.areas[0]}, ㉡=${problem.meta.areas[1]}`, `${typeId}/L3 must ask for both areas separately`);
    assert(problem.responseKind === "list", `${typeId}/L3 needs two visible answer entries`);
  }
}

function audit() {
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
