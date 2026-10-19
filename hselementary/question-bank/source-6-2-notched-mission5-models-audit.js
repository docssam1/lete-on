"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const models = require("./source-6-2-notched-mission5-models.js");
const sourceItemId = "6-2-u3-e2-mission-5";
const sourceSha256 = "69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE";
const cropSha256 = "E96A0E7BDCFCCC149D886E440768E03E01F47393BBC4E3CEA861F3AAB9EE9D48";
// Enumerate horizontal layers directly, without the implementation's height expression.
function independent(n, filled = false) {
  assert(Number.isSafeInteger(n) && n >= 1 && n <= 7);
  assert.equal(typeof filled, "boolean");
  const cubes = [], layers = [], H = Array.from({ length: n }, () => Array(n).fill(0));
  for (let layer = 1; layer <= n; layer++) {
    const side = n + 1 - layer, cells = [];
    for (let x = 0; x < side; x++) for (let z = 0; z < side; z++) {
      if (!filled && side > 1 && x === side - 1 && z === side - 1) continue;
      cells.push([x, z]); cubes.push([x, layer - 1, z]); H[z][x]++;
    }
    layers.push({ layer, y: layer - 1, side, cells, visibleCells: [], hiddenCells: [],
      occupied: cells.length, count: cells.length });
  }
  const occupied = new Set(cubes.map(cube => cube.join(",")));
  const classified = cubes.map(cube => {
    const [x, y, z] = cube;
    const neighbors = { left: [x - 1, y, z], right: [x + 1, y, z],
      bottom: [x, y - 1, z], top: [x, y + 1, z], back: [x, y, z - 1], front: [x, y, z + 1] };
    const faces = Object.keys(neighbors).filter(face => !occupied.has(neighbors[face].join(",")));
    const hidden = faces.length === 0;
    layers[y][hidden ? "hiddenCells" : "visibleCells"].push([x, z]);
    return { cube, faces, hidden, visible: !hidden, contacts: 6 - faces.length,
      exposedFaces: faces.map(face => ({ face, reason: face === "bottom" && y === 0 ? "ground" : "exterior" })) };
  });
  const total = layers.reduce((a, layer) => a + layer.cells.length, 0);
  const hidden = classified.filter(cube => cube.hidden).length, visible = total - hidden;
  return { n, filled, H, cubes, layers, classified, counts: { total, hidden, visible, difference: visible - hidden } };
}
const keys = cells => cells.map(cell => cell.join(",")).sort();
function auditModel(actual, n, filled = false) {
  const expected = independent(n, filled);
  assert.equal(actual.sourceItemId, sourceItemId);
  assert.equal(actual.n, n); assert.equal(actual.filled, filled);
  assert.deepEqual(actual.H, expected.H);
  assert.deepEqual(keys(actual.cubes), keys(expected.cubes));
  assert.equal(new Set(keys(actual.cubes)).size, actual.cubes.length);
  assert.deepEqual(actual.counts, expected.counts);
  for (const name of ["total", "visible", "hidden", "difference"]) assert.equal(actual[name], expected.counts[name]);
  assert.equal(actual.sourceTotal, expected.layers.reduce((a, layer) => a + layer.cells.length, 0));
  assert.equal(actual.layers.length, n);
  for (let y = 0; y < n; y++) {
    const a = actual.layers[y], e = expected.layers[y];
    for (const name of ["layer", "y", "side", "occupied", "count"]) assert.equal(a[name], e[name]);
    for (const name of ["cells", "hiddenCells", "visibleCells"]) assert.deepEqual(keys(a[name]), keys(e[name]));
    assert.equal(a.cells.length, a.visibleCells.length + a.hiddenCells.length);
    assert.equal(a.cells.some(([x, z]) => x === a.side - 1 && z === a.side - 1), filled || a.side === 1);
  }
  assert.equal(actual.exposedByCube.length, expected.cubes.length);
  const records = new Map(actual.exposedByCube.map(record => [record.cube.join(","), record]));
  assert.equal(records.size, expected.cubes.length);
  const occupied = new Set(keys(actual.cubes));
  for (const e of expected.classified) {
    const a = records.get(e.cube.join(","));
    assert(a);
    assert.deepEqual([...a.faces].sort(), [...e.faces].sort());
    assert.deepEqual(a.exposedFaces.map(f => `${f.face}:${f.reason}`).sort(), e.exposedFaces.map(f => `${f.face}:${f.reason}`).sort());
    for (const name of ["visible", "hidden", "contacts"]) assert.equal(a[name], e[name]);
    const [x, y, z] = a.cube;
    if (y > 0) assert(occupied.has([x, y - 1, z].join(",")), "Floating cubes are not allowed");
    if (a.hidden) assert.equal(a.contacts, 6);
    if (y === 0) assert(a.faces.includes("bottom") && a.visible);
  }
  return expected;
}
function assertFrozen(value) {
  if (value && typeof value === "object") {
    assert(Object.isFrozen(value)); Object.values(value).forEach(assertFrozen);
  }
}
function privateFile(value, kind, requireE) {
  assert.equal(typeof value, "string", `Missing ${kind} environment value`);
  assert(path.win32.isAbsolute(value) && (!requireE || /^E:[\\/]/i.test(value)), `Invalid ${kind} path`);
  const resolved = fs.realpathSync(value);
  if (requireE) assert(/^E:[\\/]/i.test(resolved), "Private evidence must resolve on E:");
  const relative = path.relative(path.resolve(__dirname, "../.."), resolved);
  assert(relative.startsWith("..") || path.isAbsolute(relative), "Source evidence must stay outside the repository");
  return resolved;
}
function auditPrivateEvidence(env = process.env, required = false) {
  const dir = env.NOTCHED_MISSION5_PRIVATE_EVIDENCE_DIR;
  const pdf = env.NOTCHED_MISSION5_SOURCE_PDF_PATH;
  if (!dir && !pdf) {
    assert(!required, "Explicit private evidence environment values are required");
    return { status: "pending", reason: "private environment not supplied", browserVerified: false };
  }
  const directory = privateFile(dir, "private E evidence directory", true);
  const pdfFile = privateFile(pdf, "read-only source PDF", false);
  const crop = privateFile(path.join(directory, "mission5-source.png"), "private E crop", true);
  const evidenceFile = privateFile(path.join(directory, "source-evidence.json"), "private E metadata", true);
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, "utf8"));
  const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
  assert.equal(evidence.pdfPage, 33); assert.equal(evidence.printedPage, 35);
  assert.equal(evidence.sourceSha256.toUpperCase(), sourceSha256);
  assert.equal(evidence.cropSha256.toUpperCase(), cropSha256);
  assert.equal(evidence.originalModified, false);
  assert.equal(evidence.cropRectPt.length, 4);
  assert(evidence.cropRectPt.every(Number.isFinite));
  assert(evidence.cropRectPt[0] < evidence.cropRectPt[2] && evidence.cropRectPt[1] < evidence.cropRectPt[3]);
  assert.equal(hash(crop), cropSha256); assert.equal(hash(pdfFile), sourceSha256);
  assert.equal(fs.readFileSync(crop).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(fs.readFileSync(pdfFile).subarray(0, 5).toString("ascii"), "%PDF-");
  assert.equal(hash(pdfFile), sourceSha256); assert.equal(hash(crop), cropSha256);
  return { status: "passed", hashChecks: 4, metadataChecks: 8, pdfPage: 33, printedPage: 35,
    sourceSha256, cropSha256, sourceFilesModified: false, browserVerified: false,
    sourceStructureSightVerified: false, independentMathReviewVerified: false, humanApproved: false };
}
function run() {
  let modelCases = 0, voxels = 0, faceChecks = 0, layerCases = 0;
  for (let n = 1; n <= 7; n++) for (const filled of [false, true]) {
    const actual = models.build(n, filled), e = auditModel(actual, n, filled);
    assertFrozen(actual); voxels += e.cubes.length; faceChecks += e.cubes.length * 6;
    layerCases += n; modelCases++;
    for (const [flag, value] of Object.entries(models.verification)) assert.equal(actual[flag], value);
    assert.equal(actual.sourceRef.sourceSha256, sourceSha256); assert.equal(actual.sourceRef.cropSha256, cropSha256);
    assert.equal(actual.conditionPolicy.groundBottomCountedVisible, true);
    assert.equal(actual.conditionPolicy.cameraOcclusionDefinesVisibility, false);
  }
  const upper = [
    [[1]], [[1, 1], [1, 0]], [[1, 1, 1], [1, 1, 1], [1, 1, 0]],
    [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 0]]
  ];
  const source = models.build(6);
  upper.forEach((grid, index) => {
    const layer = source.layers[5 - index], cells = new Set(keys(layer.cells));
    assert.deepEqual(grid.map((row, z) => row.map((_, x) => +cells.has([x, z].join(",")))), grid);
    assert.equal(layer.layer, 6 - index); assert.equal(layer.count, [1, 3, 8, 15][index]);
  });
  for (let n = 1; n <= 7; n++) {
    const before = independent(n), after = models.build(n, true), old = new Set(keys(before.cubes));
    const added = after.cubes.filter(cube => !old.has(cube.join(",")));
    assert.deepEqual(keys(added), keys(Array.from({ length: n - 1 }, (_, i) => [i + 1, n - i - 2, i + 1])));
    assert.equal(after.total - before.counts.total, n - 1);
  }
  assert.deepEqual(models.pools, [6, 5, 7]);
  for (let variant = 0; variant < 3; variant++) auditModel(models.solve(variant), [6, 5, 7][variant]);
  const invalidN = [undefined, null, NaN, Infinity, -Infinity, -1, 0, 8, 1.5, "6", true, {}, [], 6n];
  const invalidFilled = [null, 0, 1, "false", {}, []];
  const invalidVariant = [null, NaN, Infinity, -1, 3, 1.5, "0", true, {}, [], 0n];
  let invalidParameters = 0;
  for (const n of invalidN) { assert.throws(() => models.build(n), RangeError); invalidParameters++; }
  for (const filled of invalidFilled) { assert.throws(() => models.build(6, filled), RangeError); invalidParameters++; }
  for (const v of invalidVariant) { assert.throws(() => models.solve(v), RangeError); invalidParameters++; }
  const mutations = [
    m => { m.H[1][1]++; }, m => { m.cubes.pop(); }, m => { m.cubes.push(m.cubes[0]); },
    m => { m.layers[1].cells.pop(); }, m => { m.layers[1].layer++; }, m => { m.layers[1].hiddenCells.pop(); },
    m => { m.counts.hidden++; }, m => { m.visible--; }, m => { m.sourceTotal++; },
    m => { m.exposedByCube.pop(); }, m => { m.exposedByCube[0].faces = []; },
    m => { m.exposedByCube[0].exposedFaces[0].reason = "camera"; },
    m => { m.exposedByCube[0].contacts++; }, m => { m.exposedByCube[0].visible = false; },
    m => { m.layers[0].occupied--; }
  ];
  for (const mutate of mutations) {
    const changed = JSON.parse(JSON.stringify(source)); mutate(changed);
    assert.throws(() => auditModel(changed, 6));
  }
  assert.throws(() => auditModel(models.build(6, true), 6, false));
  const rearOnly = source.exposedByCube.find(item => item.cube.join(",") === "0,1,0");
  assert(rearOnly.visible && !rearOnly.faces.some(face => ["top", "front", "right"].includes(face)));
  const groundOnly = source.exposedByCube.find(item => item.cube.join(",") === "2,0,2");
  assert.deepEqual(groundOnly.faces, ["bottom"]); assert(groundOnly.visible);
  const cameraVisible = source.exposedByCube.filter(item => item.faces.some(face => ["top", "front", "right"].includes(face))).length;
  const withoutGround = source.exposedByCube.filter(item => item.exposedFaces.some(face => face.reason !== "ground")).length;
  assert.notEqual(cameraVisible, source.visible); assert.notEqual(withoutGround, source.visible);
  let immutableMutations = 0;
  for (const mutate of [() => { source.H[0][0] = 0; }, () => { source.cubes.push([9, 9, 9]); },
    () => { source.layers[0].cells[0][0] = 9; }, () => { source.counts.total = 0; },
    () => { models.pools[0] = 4; }, () => { source.exposedByCube[0].exposedFaces[0].reason = "camera"; }]) {
    assert.throws(mutate, TypeError); immutableMutations++;
  }
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, "source-6-2-notched-mission5-models.js"), "utf8"), context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_MODELS.solve(0))), models.solve(0));
  let evidenceNegatives = 0;
  for (const env of [{ NOTCHED_MISSION5_PRIVATE_EVIDENCE_DIR: "C:\\private" },
    { NOTCHED_MISSION5_SOURCE_PDF_PATH: "relative.pdf" },
    { NOTCHED_MISSION5_PRIVATE_EVIDENCE_DIR: "relative" }]) {
    assert.throws(() => auditPrivateEvidence(env)); evidenceNegatives++;
  }
  assert.throws(() => auditPrivateEvidence({}, true)); evidenceNegatives++;
  const evidence = auditPrivateEvidence(process.env, process.argv.includes("--require-private"));
  return { status: "passed", modelCases, variantCases: 3, layerCases, voxels, faceChecks,
    sourceUpperGridCases: 4, fillingCases: 7, invalidParameters,
    rejectedModelMutations: mutations.length, wrongInterpretationControls: 3, immutableMutations,
    umdCases: 1, evidenceNegatives, privateEvidence: evidence,
    originalSourceReleaseStatus: "locked", officialAnswerVerified: false, teacherReleaseVerified: false,
    learnerReleaseVerified: false, humanApproved: false, independentMathReviewVerified: false,
    browserVerified: false, renderedFidelityVerified: false };
}
module.exports = { independent, auditModel, assertFrozen, auditPrivateEvidence, run };
if (require.main === module) console.log(JSON.stringify(run()));
