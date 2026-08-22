const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const catalogSource = fs.readFileSync(path.join(root, "data", "catalog.js"), "utf8");
const trackSource = fs.readFileSync(path.join(root, "data", "selection-tracks.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(catalogSource, context);
vm.runInNewContext(trackSource, context);

const catalog = context.globalThis.HIGHSELECT_CATALOG;
const data = context.globalThis.SELECTION_TRACK_CATALOG;

test("neutral selection tracks cover high selection, middle entry/transfer, common math, and high advance/transfer", () => {
  const ids = Array.from(data.trackDefinitions, item => item.id);
  assert.deepEqual(ids, [
    "high-selection",
    "middle-entry",
    "middle-transfer",
    "common-math-entry",
    "high-advance",
    "high-transfer"
  ]);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Array.from(data.getTrack("middle-entry").aliases), ["start"]);
});

test("program identity and track identity are separate axes", () => {
  const programCodes = new Set(catalog.programs.map(program => program.id));
  const trackIds = new Set(data.trackDefinitions.map(track => track.id));

  data.programTrackBindings.forEach(binding => {
    assert.ok(programCodes.has(binding.programCode), `unknown program ${binding.programCode}`);
    assert.ok(trackIds.has(binding.trackId), `unknown track ${binding.trackId}`);
    assert.notEqual(binding.programCode, binding.trackId);
    assert.equal(binding.trackId.startsWith(`${binding.programCode.toLowerCase()}-`), false);
    assert.equal(binding.id, `${binding.programCode}:${binding.trackId}`);
  });
});

test("SH high selection is explicitly a middle cumulative scope", () => {
  const binding = data.programTrackBindings.find(item => item.id === "SH:high-selection");
  assert.equal(binding.trackId, "high-selection");
  assert.equal(binding.scopeKey, "middle-cumulative");
  assert.equal(binding.scopeLabel, "중등 누적");
  assert.equal(binding.evidenceStatus, "observed");

  const resolved = data.resolveExamTrack("sh-selection-r01");
  assert.equal(resolved.assignment.programCode, "SH");
  assert.equal(resolved.track.id, "high-selection");
  assert.equal(resolved.binding.scopeKey, "middle-cumulative");
});

test("the model supports non-high tracks without treating the whole product as high-only", () => {
  const middleEntryPrograms = Array.from(
    data.programTrackBindings
      .filter(item => item.trackId === "middle-entry")
      .map(item => item.programCode)
  );
  assert.deepEqual(middleEntryPrograms, ["DP", "ED"]);
  assert.ok(data.getTrack("middle-transfer"));
  assert.equal(data.getTrack("middle-entry").targetStage, "middle");
  assert.equal(data.getTrack("middle-transfer").targetStage, "middle");
});

test("non-cumulative program groups are not generically named cumulative diagnostics", () => {
  ["DP", "WM", "ED"].forEach(programId => {
    const program = catalog.programs.find(item => item.id === programId);
    assert.equal(program.name.includes("누적 진단"), false, `${programId} program name`);
  });
});

test("DP and ED middle-entry observations are separate locked exam cards", () => {
  const dp = catalog.exams.find(item => item.id === "dp-middle1-entry");
  const ed = catalog.exams.find(item => item.id === "ed-middle1-entry");
  assert.equal(dp.programId, "DP");
  assert.equal(dp.questionCount, 30);
  assert.equal(dp.sourceStatus, "observed_structure");
  assert.equal(dp.answerStatus, "missing");
  assert.equal(dp.releaseStatus, "blocked");
  assert.equal(data.resolveExamTrack(dp.id).track.id, "middle-entry");
  assert.equal(ed.programId, "ED");
  assert.equal(ed.questionCount, 30);
  assert.equal(ed.sourceStatus, "observed_structure");
  assert.equal(ed.answerStatus, "missing");
  assert.equal(ed.releaseStatus, "blocked");
  assert.equal(data.resolveExamTrack(ed.id).track.id, "middle-entry");
  assert.notEqual(dp.id, ed.id);
});

test("program-track scopes preserve their evidence status instead of inferring a generic transfer range", () => {
  const allowed = new Set(data.evidenceStatuses);
  data.programTrackBindings.forEach(binding => {
    assert.ok(allowed.has(binding.evidenceStatus));
    assert.ok(Array.isArray(binding.evidenceRefs));
    if (binding.evidenceStatus !== "needs-review") {
      assert.ok(binding.evidenceRefs.length > 0, `${binding.id} lacks evidence reference`);
    }
  });

  const transfer = data.programTrackBindings.find(item => item.id === "DP:middle-transfer");
  assert.equal(transfer.evidenceStatus, "observed");
  assert.equal(transfer.scopeKey, "middle1-1-to-middle2-2");
  assert.deepEqual(Array.from(transfer.evidenceRefs), ["USER:DP-MIDDLE2-2-TRANSFER-SCOPE"]);
  assert.equal(data.programTrackBindings.some(item => item.trackId === "high-transfer"), false);
});

test("DP middle2-2 transfer is a separate locked card and never inherits a generic cutoff", () => {
  const exam = catalog.exams.find(item => item.id === "dp-middle2-2-transfer");
  assert.equal(exam.programId, "DP");
  assert.equal(exam.questionCount, null);
  assert.equal(exam.sourceStatus, "candidate_scope_conflict");
  assert.equal(exam.releaseStatus, "blocked");
  const resolved = data.resolveExamTrack(exam.id);
  assert.equal(resolved.track.id, "middle-transfer");
  assert.equal(resolved.binding.scopeKey, "middle1-1-to-middle2-2");
});

test("all existing catalog exam IDs keep their program IDs and gain a compatible track assignment", () => {
  const catalogIds = Array.from(catalog.exams, exam => exam.id);
  const assignmentIds = Array.from(data.examTrackAssignments, item => item.examId);
  assert.deepEqual(assignmentIds, catalogIds);

  catalog.exams.forEach(exam => {
    const resolved = data.resolveExamTrack(exam.id);
    assert.ok(resolved, `missing assignment for ${exam.id}`);
    assert.equal(resolved.assignment.programCode, exam.programId);
    assert.ok(resolved.track);
    assert.ok(resolved.binding);
  });
  assert.equal(data.resolveExamTrack("unknown-exam"), null);
});

test("selection track data exposes no originals, answers, learner data, or private paths", () => {
  const serialized = JSON.stringify(data);
  [
    "G:\\\\",
    "C:\\\\Users",
    ".pdf",
    "sourcePath",
    "answerKey",
    "correctAnswer",
    "solution",
    "studentName",
    "approvalCode"
  ].forEach(term => assert.equal(serialized.includes(term), false, `must not expose ${term}`));
});
