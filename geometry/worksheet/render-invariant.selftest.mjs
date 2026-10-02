// GW render-invariant self-test.
//
// WHY this file exists: the "그림 품질" pass in this branch only touches
// render.js / card.js / styles.css. It must be provably true that the
// worksheet's MATH did not move a single bit — every generated problem and
// every answer generateWorksheet() produces has to stay byte-for-byte the
// same as origin/main's generators.js. This test does not re-derive that
// from reading the diff; it runs BOTH copies of generators.js (origin/main's
// and this worktree's) side by side in two isolated vm contexts, each with
// its own shared/question-bank.js dependency loaded the same way, and deep-
// compares generateWorksheet(...) across many seeds / levels / intensities /
// arrangements / type combinations. Any accidental math edit — even one that
// only changes a problem in a rarely-hit branch — fails a comparison here.
//
// Loading strategy: both generators.js and shared/question-bank.js are
// classic "(function (global) {...})(typeof window !== "undefined" ? window
// : globalThis)" browser scripts (see generators.js's own file-top comment:
// it must run identically under Node for its own .selftest.mjs). Running
// each pair of sources in its own vm.createContext(...) sandbox gives every
// side its own GW_GEN / GFIELD_GEOMETRY_QUESTION_BANK globals, so the "old"
// and "new" copies can never clobber each other the way two plain `require`
// calls of files with the same basename would risk under Node's module
// cache.
"use strict";

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import assert from "node:assert/strict";
import test from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CURRENT_GENERATORS_PATH = path.join(__dirname, "generators.js");
const CURRENT_QUESTION_BANK_PATH = path.join(__dirname, "..", "shared", "question-bank.js");
const REPO_GENERATORS_REF = "geometry/worksheet/generators.js";
const REPO_QUESTION_BANK_REF = "geometry/shared/question-bank.js";

function gitShow(ref, repoPath) {
  return execSync("git show " + ref + ":" + repoPath, { cwd: __dirname, maxBuffer: 1024 * 1024 * 16 }).toString("utf8");
}

// Runs shared/question-bank.js then generators.js in one fresh sandbox and
// returns the resulting GW_GEN. Any load-time throw (e.g. a syntax error in
// whichever source string was handed in) is rethrown with the label so a
// failure says plainly which side (origin/main vs current worktree) broke.
function loadGenerators(label, questionBankSrc, generatorsSrc) {
  const sandbox = { console };
  vm.createContext(sandbox);
  try {
    vm.runInContext(questionBankSrc, sandbox, { filename: label + ":question-bank.js" });
    vm.runInContext(generatorsSrc, sandbox, { filename: label + ":generators.js" });
  } catch (err) {
    throw new Error("failed to load " + label + "'s generators.js: " + err.message);
  }
  if (!sandbox.GW_GEN || typeof sandbox.GW_GEN.generateWorksheet !== "function") {
    throw new Error(label + ": GW_GEN.generateWorksheet missing after load");
  }
  return sandbox.GW_GEN;
}

const currentQuestionBankSrc = readFileSync(CURRENT_QUESTION_BANK_PATH, "utf8");
const currentGeneratorsSrc = readFileSync(CURRENT_GENERATORS_PATH, "utf8");
const originQuestionBankSrc = gitShow("origin/main", REPO_QUESTION_BANK_REF);
const originGeneratorsSrc = gitShow("origin/main", REPO_GENERATORS_REF);

const CURRENT = loadGenerators("current worktree", currentQuestionBankSrc, currentGeneratorsSrc);
const ORIGIN = loadGenerators("origin/main", originQuestionBankSrc, originGeneratorsSrc);

// Sanity check the two sources actually differ from each other in at least
// one of the two files -- otherwise this whole test would trivially pass
// even if origin/main could not be fetched (e.g. a shallow clone), which
// would silently turn every comparison below into "identical string compared
// to itself" instead of a real cross-check. It's fine (expected, even) for
// generators.js to be byte-identical since this branch must not touch it;
// what must NOT happen is both files being identical because the git show
// failed and returned an empty string, or some other loading collapse.
assert.ok(currentGeneratorsSrc.length > 1000, "current generators.js looks suspiciously small/empty");
assert.ok(originGeneratorsSrc.length > 1000, "origin/main generators.js looks suspiciously small/empty");
assert.ok(currentQuestionBankSrc.length > 100, "current question-bank.js looks suspiciously small/empty");
assert.ok(originQuestionBankSrc.length > 100, "origin/main question-bank.js looks suspiciously small/empty");

// WHY JSON.stringify rather than assert.deepStrictEqual on the raw objects:
// CURRENT and ORIGIN each come from their own vm.createContext(...) realm,
// so even a wholly identical plain object/array from one side has a
// DIFFERENT Array.prototype/Object.prototype than the other side's --
// assert's *strict* variant treats that as "not the same kind of thing" and
// fails every single comparison regardless of content (confirmed empirically
// here). Each context's own JSON.stringify, though, always produces a plain
// string (a primitive has no realm), so stringifying inside each side first
// and comparing the two strings is both realm-safe and literally the
// "JSON 완전 비교" (full JSON comparison) this test is asked to do.
function compare(label, opts) {
  test(label + " " + JSON.stringify(opts), () => {
    const fromCurrent = JSON.stringify(CURRENT.generateWorksheet(opts));
    const fromOrigin = JSON.stringify(ORIGIN.generateWorksheet(opts));
    assert.strictEqual(fromCurrent, fromOrigin, label + ": generateWorksheet(" + JSON.stringify(opts) + ") diverged from origin/main");
  });
}

const ALL_CODES = CURRENT.TYPES.map((t) => t.code);
// CJ/CP/PS enumerate rotations/packings exhaustively while building a
// problem (seen directly: ~1s for PS at count=6) -- real math coverage of
// them lives in the per-type sweep below (once per seed), just not repeated
// across every axis-sweep config, so this whole file finishes in a
// reasonable time instead of multiplying that cost by every level/count/
// arrange/seed combination.
const SLOW_CODES = new Set(["CJ", "CP", "PS"]);
const FAST_CODES = ALL_CODES.filter((c) => !SLOW_CODES.has(c));

// --- 1. every problem type, at a level it actually supports, across a few
//        seeds/intensities -- this is the "did any single generator's math
//        change" sweep. ---------------------------------------------------
ALL_CODES.forEach((code) => {
  const info = CURRENT.typeInfo(code);
  [
    { seed: 1, intensity: 1 },
    { seed: 12345, intensity: 3 }
  ].forEach(({ seed, intensity }) => {
    compare("type sweep " + code, {
      types: [code],
      count: 6,
      seed,
      level: info.levels[0],
      intensity,
      arrange: ""
    });
    // Also the type's HIGHEST supported level, so a level-specific branch
    // (e.g. a type only unlocking a harder variant at L5) gets exercised
    // too, not just its lowest.
    compare("type sweep " + code + " (top level)", {
      types: [code],
      count: 6,
      seed,
      level: info.levels[info.levels.length - 1],
      intensity,
      arrange: ""
    });
  });
});

// --- 2. default worksheet (no explicit types -- whatever ships defaultOn)
//        across every level / intensity / arrangement / count / seed axis,
//        one axis varied at a time from a fixed baseline. -----------------
const LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5", "ALL"];
const INTENSITIES = [1, 2, 3];
const ARRANGES = ["", "type", "diff"];
const COUNTS = [6, 9, 12, 15, 20, 30, 50];
const SEEDS = [1, 2, 3, 42, 999, 12345, 987654321 >>> 0];

const defaultBaseline = { count: 9, seed: 1, level: "L4", intensity: 2, arrange: "" };

LEVELS.forEach((level) => compare("default types / level", Object.assign({}, defaultBaseline, { level })));
INTENSITIES.forEach((intensity) => compare("default types / intensity", Object.assign({}, defaultBaseline, { intensity })));
ARRANGES.forEach((arrange) => compare("default types / arrange", Object.assign({}, defaultBaseline, { arrange })));
COUNTS.forEach((count) => compare("default types / count", Object.assign({}, defaultBaseline, { count })));
SEEDS.forEach((seed) => compare("default types / seed", Object.assign({}, defaultBaseline, { seed })));

// --- 3. every FAST type mixed together (their interaction -- assignment,
//        grouping badges, cover theme -- is its own source of bugs), same
//        one-axis-at-a-time sweep. -----------------------------------------
const mixedBaseline = { types: FAST_CODES, count: 20, seed: 7, level: "ALL", intensity: 2, arrange: "" };

LEVELS.forEach((level) => compare("fast-type mix / level", Object.assign({}, mixedBaseline, { level })));
INTENSITIES.forEach((intensity) => compare("fast-type mix / intensity", Object.assign({}, mixedBaseline, { intensity })));
ARRANGES.forEach((arrange) => compare("fast-type mix / arrange", Object.assign({}, mixedBaseline, { arrange })));
COUNTS.forEach((count) => compare("fast-type mix / count", Object.assign({}, mixedBaseline, { count })));
SEEDS.slice(0, 5).forEach((seed) => compare("fast-type mix / seed", Object.assign({}, mixedBaseline, { seed })));

// --- 4. every type (including the slow ones) mixed together, a handful of
//        full configs -- the realistic "전체(단계 혼합)" worksheet. ---------
[
  { types: ALL_CODES, count: 20, seed: 777, level: "ALL", intensity: 3, arrange: "type" },
  { types: ALL_CODES, count: 15, seed: 55, level: "ALL", intensity: 1, arrange: "diff" },
  { types: ALL_CODES, count: 9, seed: 2024, level: "L4", intensity: 2, arrange: "" }
].forEach((opts) => compare("all-type mix", opts));

// --- 5. explicit edge cases: empty type list, and a level with no
//        supported types at all in the request. ----------------------------
compare("empty types", { types: [], count: 9, seed: 1, level: "L4", intensity: 2, arrange: "" });
compare("unsupported-for-level types", { types: ["PN"], count: 9, seed: 1, level: "L0", intensity: 2, arrange: "" });
