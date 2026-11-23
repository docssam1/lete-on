"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const validator = require("../scripts/validate-private-grade7-ns-a-authoring.cjs");
const { plan } = require("../assessment/grade7-ns-a-screener-plan.js");

// Synthetic contract fixtures only: these are not authored assessment items,
// answer keys, mathematical review evidence, or release records.
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M1 5H9"/></svg>';
const SVG_HASH = crypto.createHash("sha256").update(SVG).digest("hex");
function localized(value) { return { ko: value, en: value, "zh-Hans": value }; }
function replaceBlankLocales(value) {
  if (!value || typeof value !== "object") return;
  if (Object.hasOwn(value, "ko") && Object.hasOwn(value, "en")) Object.keys(value).forEach(locale => { value[locale] = "Synthetic evidence fixture."; });
  else Object.values(value).forEach(replaceBlankLocales);
}
function fixture() {
  const pack = validator.createDraftSkeleton({ actorId: "synthetic-author", provider: "fixture", model: "fixture", environment: "local-test" });
  replaceBlankLocales(pack);
  pack.items.forEach((item, index) => {
    const suffix = String(index + 1).padStart(16, "0");
    item.itemId = `qst-bnk-${suffix}`;
    item.publicDraft.promptBlocks[0].valueByLocale = localized(`Synthetic prompt fixture ${index + 1}.`);
    const errorType = item.scoringMode === "teacher" ? "explanation-incomplete" : "calculation-error";
    item.privateDraft.defaultErrorType = errorType;
    item.privateDraft.errorSignals = [{ code: "synthetic-error", observedValue: item.responseType === "multiple-choice" ? "B" : "synthetic-observation", errorType, rationaleByLocale: { ko: "Synthetic error fixture.", en: "Synthetic error fixture." } }];
    if (item.responseType === "multiple-choice") {
      item.publicDraft.options = [{ optionId: "A", labelByLocale: localized("Synthetic candidate alpha") }, { optionId: "B", labelByLocale: localized("Synthetic candidate beta") }];
      item.privateDraft.answer.value = "A";
      item.verification.candidateCheck.totalCandidates = 2;
    } else if (item.responseType === "numeric") item.privateDraft.answer.value = "0";
    else item.privateDraft.rubricDraft.criteria = [{ criterionId: "synthetic-criterion", maxPoints: 1, levels: [{ points: 0, observableEvidenceByLocale: localized("Synthetic absent evidence.") }, { points: 1, observableEvidenceByLocale: localized("Synthetic present evidence.") }], requiredEvidence: ["synthetic-evidence"], errorCodes: [errorType] }];
    if (plan.slots[index].visualRequirement === "calculated-number-line-required") {
      const assetId = `ast-bnk-${suffix}`;
      item.numberLineModel = { minimum: "-1", maximum: "1", tickStep: "1/2", points: [{ label: "synthetic-given", value: "0" }], movements: [], studentTargetMarkerPresent: false };
      item.publicDraft.promptBlocks.push({ type: "diagram", assetId });
      item.publicDraft.assets.push({ assetId, sha256: SVG_HASH, mimeType: "image/svg+xml", altByLocale: localized("Synthetic line fixture."), rightsRecordId: `rgt-bnk-${suffix}` });
      item.assetDrafts.push({ assetId, sourcePath: `assets/${assetId}.svg`, rightsDraft: { ...item.rightsDraft } });
    }
  });
  return pack;
}
function temporaryRoot(t) {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "gfield-grade7-preflight-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function writeFixture(root, pack = fixture()) {
  fs.writeFileSync(path.join(root, validator.PACK_FILE), JSON.stringify(pack));
  fs.mkdirSync(path.join(root, "assets"), { recursive: true });
  pack.items.forEach(item => item.assetDrafts.forEach(asset => fs.writeFileSync(path.join(root, asset.sourcePath), SVG)));
  return pack;
}
function rejectEdit(edit, expectedCode) {
  const pack = fixture();
  edit(pack);
  assert.throws(() => validator.validatePack(pack), error => error.code === expectedCode);
}

test("the skeleton binds 18 canonical slots but cannot pass as authored content", () => {
  const skeleton = validator.createDraftSkeleton();
  assert.deepEqual(skeleton.items.map(item => item.slotId), plan.slots.map(slot => slot.slotId));
  assert.equal(skeleton.items.filter(item => item.scoringMode === "teacher").length, 4);
  assert.equal(skeleton.items.every(item => item.itemId === "" && item.verification.reviewPending), true);
  assert.throws(() => validator.validatePack(skeleton), /AUTHOR_INVALID/);
});

test("structural success preserves every pending release and review boundary", t => {
  const pack = fixture();
  const structure = validator.validatePack(pack);
  assert.deepEqual([structure.itemCount, structure.automaticCount, structure.teacherCount], [18, 14, 4]);
  assert.equal(structure.assetBytesVerified, false);
  assert.equal(structure.mathematicsVerified, false);
  assert.equal(structure.independentReviewApproved, false);
  assert.equal(structure.studentOperationAuthorized, false);
  assert.equal(structure.deliveryState, "locked");
  const root = temporaryRoot(t);
  writeFixture(root, pack);
  assert.equal(validator.validateDirectory(root).assetBytesVerified, true);
});

test("exact plan fingerprint, granular focus, slot uniqueness, and response lineage are required", () => {
  rejectEdit(pack => { pack.planContractSha256 = "a".repeat(64); }, "PACK_PLAN_LINEAGE_INVALID");
  rejectEdit(pack => { pack.items[0].standardIds = ["7.NS.A.2b"]; }, "ITEM_STANDARD_FOCUS_INVALID");
  rejectEdit(pack => { pack.items[0].difficulty = "advanced"; }, "ITEM_PLAN_LINEAGE_INVALID");
  rejectEdit(pack => { pack.items[0].scoringMode = "teacher"; }, "ITEM_PLAN_LINEAGE_INVALID");
  rejectEdit(pack => { pack.items[1] = structuredClone(pack.items[0]); }, "DUPLICATE_ITEM_OR_SLOT");
  rejectEdit(pack => { pack.items.pop(); }, "PLANNED_ITEM_COUNT_INVALID");
});

test("all learner locales and localized rubric evidence are mandatory without altering bilingual scoring signals", () => {
  rejectEdit(pack => { delete pack.items[0].publicDraft.promptBlocks[0].valueByLocale["zh-Hans"]; }, "PUBLIC_LOCALES_INVALID");
  rejectEdit(pack => { pack.items[0].publicDraft.options[1].labelByLocale["zh-Hans"] = pack.items[0].publicDraft.options[0].labelByLocale["zh-Hans"]; }, "DUPLICATE_OPTION_LABEL");
  rejectEdit(pack => { delete pack.items[1].privateDraft.rubricDraft.criteria[0].levels[0].observableEvidenceByLocale["zh-Hans"]; }, "RUBRIC_LOCALES_INVALID");
  rejectEdit(pack => { pack.items[0].privateDraft.errorSignals[0].rationaleByLocale["zh-Hans"] = "Synthetic extra field."; }, "PRIVATE_SCORING_CONTRACT_INVALID");
});

test("teacher rubric, private answer type, and complete distractor mapping are enforced by shared contracts", () => {
  rejectEdit(pack => { delete pack.items[1].privateDraft.rubricDraft; }, "PRIVATE_DRAFT_INVALID");
  rejectEdit(pack => { pack.items[1].privateDraft.rubricDraft.criteria[0].maxPoints = 0.5; }, "TEACHER_RUBRIC_INVALID");
  rejectEdit(pack => { pack.items[1].privateDraft.answer = { kind: "numeric-exact", value: "0" }; }, "PRIVATE_DRAFT_INVALID");
  rejectEdit(pack => { pack.items[0].privateDraft.errorSignals[0].observedValue = "A"; }, "PRIVATE_SCORING_CONTRACT_INVALID");
  rejectEdit(pack => { pack.items[3].privateDraft.answer.value = "2/4"; }, "PRIVATE_SCORING_CONTRACT_INVALID");
  rejectEdit(pack => { pack.items[0].publicDraft.answer = "synthetic-private-value"; }, "PUBLIC_DRAFT_INVALID");
});

test("author attestations never bypass independent reviews or permit release flags", () => {
  rejectEdit(pack => { pack.state = "approved"; }, "PACK_RELEASE_STATE_INVALID");
  rejectEdit(pack => { pack.deliveryState = "released"; }, "PACK_RELEASE_STATE_INVALID");
  rejectEdit(pack => { pack.independentReviewApproved = true; }, "PACK_FIELDS_INVALID");
  rejectEdit(pack => { pack.items[0].verification.reviewPending = false; }, "AUTHOR_VERIFICATION_INVALID");
  rejectEdit(pack => { pack.items[0].learnerFitEvidence.reviewPending = false; }, "LEARNER_FIT_INVALID");
  rejectEdit(pack => { pack.items[0].rightsDraft.decision = "approved"; }, "RIGHTS_DRAFT_INVALID");
  rejectEdit(pack => { pack.items[0].itemIndependenceEvidence.workbookItemsReused = true; }, "ITEM_INDEPENDENCE_INVALID");
  rejectEdit(pack => { pack.items[0].verification.methods = [pack.items[0].verification.methods[0], pack.items[0].verification.methods[0]]; }, "AUTHOR_VERIFICATION_INVALID");
  rejectEdit(pack => { pack.items[0].verification.methods.pop(); }, "REQUIRED_PROOF_METHOD_MISSING");
  rejectEdit(pack => { pack.items[0].verification.methods[0].methodId = "unrelated-synthetic-method"; }, "REQUIRED_PROOF_METHOD_MISSING");
});

test("required number-line slots reject missing models, answer markers, invalid geometry and asset paths", () => {
  rejectEdit(pack => { pack.items[2].numberLineModel = null; }, "NUMBER_LINE_REQUIRED");
  rejectEdit(pack => { pack.items[2].numberLineModel.studentTargetMarkerPresent = true; }, "NUMBER_LINE_TARGET_MARKER_FORBIDDEN");
  rejectEdit(pack => { pack.items[2].numberLineModel.tickStep = "0"; }, "NUMBER_LINE_RANGE_INVALID");
  rejectEdit(pack => { pack.items[2].numberLineModel.points[0].value = "2"; }, "NUMBER_LINE_GIVEN_OUTSIDE_RANGE");
  rejectEdit(pack => { pack.items[2].numberLineModel.movements = [{ start: "0", displacement: "2" }]; }, "NUMBER_LINE_GIVEN_OUTSIDE_RANGE");
  rejectEdit(pack => { pack.items[2].assetDrafts[0].sourcePath = "../private.svg"; }, "ASSET_DRAFTS_INVALID");
});

test("external root rejects repository locations, relative paths, symlinks and other Git ancestry", t => {
  assert.throws(() => validator.assertExternalRoot(path.resolve(__dirname, "..")), /PRIVATE_ROOT_INSIDE_REPOSITORY/);
  assert.throws(() => validator.assertExternalRoot("relative-root"), /EXTERNAL_ROOT_REQUIRED/);
  const root = temporaryRoot(t);
  const linked = path.join(root, "linked");
  fs.symlinkSync(root, linked, "dir");
  assert.throws(() => validator.assertExternalRoot(linked), /PRIVATE_PATH_UNSAFE/);
  fs.writeFileSync(path.join(root, ".git"), "gitdir: synthetic-test-only\n");
  const child = path.join(root, "child"); fs.mkdirSync(child);
  assert.throws(() => validator.assertExternalRoot(child), /PRIVATE_ROOT_INSIDE_GIT/);
});

test("bounded reads reject linked packs, linked asset directories, oversized files, and unsafe asset bytes", t => {
  const root = temporaryRoot(t);
  const pack = writeFixture(root);
  const file = path.join(root, validator.PACK_FILE);
  const actual = path.join(root, "synthetic.json");
  fs.renameSync(file, actual); fs.symlinkSync(actual, file);
  assert.throws(() => validator.validateDirectory(root), /PRIVATE_FILE_UNSAFE/);
  fs.unlinkSync(file); fs.renameSync(actual, file);
  const originalAssets = path.join(root, "real-assets");
  fs.renameSync(path.join(root, "assets"), originalAssets); fs.symlinkSync(originalAssets, path.join(root, "assets"), "dir");
  assert.throws(() => validator.validateDirectory(root), /PRIVATE_PATH_UNSAFE/);
  fs.unlinkSync(path.join(root, "assets")); fs.renameSync(originalAssets, path.join(root, "assets"));
  const firstAsset = pack.items.find(item => item.assetDrafts.length).assetDrafts[0];
  fs.writeFileSync(path.join(root, firstAsset.sourcePath), "Synthetic invalid bytes.");
  assert.throws(() => validator.validateDirectory(root), /ASSET_HASH_MISMATCH/);
  fs.writeFileSync(file, " ".repeat(1024 * 1024 + 1));
  assert.throws(() => validator.validateDirectory(root), /PRIVATE_FILE_UNSAFE/);
});

test("strict JSON rejects duplicate escaped keys, excessive nesting, and invalid text", () => {
  assert.throws(() => validator.parseStrictJson('{"synthetic":1,"synth\\u0065tic":2}'), /PRIVATE_JSON_DUPLICATE_KEY/);
  assert.throws(() => validator.parseStrictJson('{"nested":{"x":1,"x":2}}'), /PRIVATE_JSON_DUPLICATE_KEY/);
  assert.throws(() => validator.parseStrictJson("[".repeat(65) + "]".repeat(65)), /PRIVATE_JSON_TOO_DEEP/);
  assert.throws(() => validator.parseStrictJson('{"x":undefined}'), /PRIVATE_JSON_INVALID/);
  assert.deepEqual(validator.parseStrictJson('{"one":{"x":1},"two":{"x":2}}'), { one: { x: 1 }, two: { x: 2 } });
});

test("matching asset hashes cannot authorize active or namespace-qualified SVG", t => {
  const root = temporaryRoot(t);
  const candidates = [
    '<svg xmlns="http://www.w3.org/2000/svg"><script>synthetic()</script></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg"><s:script>synthetic()</s:script></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><set attributeName="href" to="javascript:synthetic()"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 5H9" onload="synthetic()"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 5H9" fill="u&#114;l(https://example.invalid/paint.svg#p)"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 5H9" fill="url&#40;https://example.invalid/paint.svg#p&#41;"/></svg>',
    String.raw`<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 5H9" stroke="u\72l(https://example.invalid/paint.svg#p)"/></svg>`
  ];
  candidates.forEach(svg => {
    const pack = fixture();
    const item = pack.items.find(candidate => candidate.assetDrafts.length);
    item.publicDraft.assets[0].sha256 = crypto.createHash("sha256").update(svg).digest("hex");
    writeFixture(root, pack);
    fs.writeFileSync(path.join(root, item.assetDrafts[0].sourcePath), svg);
    assert.throws(() => validator.validateDirectory(root), /ASSET_SVG_UNSAFE/);
  });
});

test("CLI status and failure logs expose no draft content or absolute private path", t => {
  const root = temporaryRoot(t);
  const pack = writeFixture(root);
  const script = path.resolve(__dirname, "../scripts/validate-private-grade7-ns-a-authoring.cjs");
  const run = () => spawnSync(process.execPath, [script, "--root", root], { encoding: "utf8" });
  let result = run();
  assert.equal(result.status, 0);
  assert.match(result.stdout, /^PRIVATE_GRADE7_NSA_PREFLIGHT_OK items=18 automatic=14 teacher=4 /);
  assert.equal(result.stderr, "");
  pack.items[0].publicDraft.promptBlocks[0].valueByLocale.en = "PRIVATE_SENTINEL_DO_NOT_ECHO";
  pack.items[0].privateDraft.answer.value = "PRIVATE_SENTINEL_DO_NOT_ECHO";
  fs.writeFileSync(path.join(root, validator.PACK_FILE), JSON.stringify(pack));
  result = run();
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^PRIVATE_GRADE7_NSA_PREFLIGHT_FAILED code=PRIVATE_SCORING_CONTRACT_INVALID ref=qst-bnk-[a-z0-9]{16}\n$/);
  assert.doesNotMatch(result.stderr, /PRIVATE_SENTINEL_DO_NOT_ECHO|Synthetic prompt|Error:| at /);
  assert.equal(result.stderr.includes(root), false);
  fs.writeFileSync(path.join(root, validator.PACK_FILE), '{"PRIVATE_SENTINEL_DO_NOT_ECHO":1,"PRIVATE_SENTINEL_DO_NOT_ECHO":2}');
  result = run();
  assert.equal(result.status, 1);
  assert.equal(result.stderr, "PRIVATE_GRADE7_NSA_PREFLIGHT_FAILED code=PRIVATE_JSON_DUPLICATE_KEY ref=pack\n");
});
