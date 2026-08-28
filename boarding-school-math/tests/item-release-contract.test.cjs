const test = require("node:test");
const assert = require("node:assert/strict");
const contract = require("../question-bank/item-release-contract.js");
const delivery = require("../shared/learning-delivery-contract.js");

const PUBLIC_HASH = "a".repeat(64);
const PRIVATE_HASH = "b".repeat(64);
const RIGHTS_HASH = "c".repeat(64);
const RUBRIC_HASH = "f".repeat(64);

function publicItem(overrides) {
  return Object.assign({
    schemaVersion: contract.SCHEMA_VERSION,
    itemId: "qst-bnk-0123456789abcdef",
    itemVersion: 1,
    publicRevisionId: "rev-bnk-0123456789abcdef",
    publicPayloadSha256: PUBLIC_HASH,
    visibilityClass: "authenticated-assessment",
    programId: "us-core-k8",
    targetGrade: 6,
    domainId: "G6-RP",
    clusterId: "6.RP.A",
    skillId: "grade6:ccss-6-rp-a:unit-rate",
    difficulty: "core",
    responseType: "multiple-choice",
    maxPoints: 1,
    assessmentBinding: {
      blueprintId: "asm-bdg-grade6-entry-plan-v1",
      blueprintVersion: 1,
      blueprintContractSha256: "a449bc7e0c50ff74af18fca0a648763ae1cfa0e1bdab21c13686dfb6d2547dab",
      purpose: "course-placement",
      slotId: "slot-bdg-g6-rp-a-03",
      unitId: "ccss-6-rp-a",
      standardRange: "6.RP.A.1-3"
    },
    promptBlocks: [
      { type: "text", valueByLocale: { ko: "같은 비율을 나타내는 식을 고르세요.", en: "Choose the expression with the same ratio." } },
      { type: "math", latex: "3:5" }
    ],
    options: [
      { optionId: "A", labelByLocale: { ko: "6:10", en: "6:10" } },
      { optionId: "B", labelByLocale: { ko: "6:8", en: "6:8" } }
    ],
    assets: [],
    responseUi: { inputKind: "choice", displayUnit: null, inputHintByLocale: null },
    rightsRecordId: "rgt-bnk-0123456789abcdef"
  }, overrides);
}

function privateSpec(item, overrides) {
  return Object.assign({
    schemaVersion: contract.SCHEMA_VERSION,
    scoringSpecId: "scr-bnk-0123456789abcdef",
    specVersion: 1,
    itemId: item.itemId,
    itemVersion: item.itemVersion,
    publicPayloadSha256: item.publicPayloadSha256,
    privateSpecSha256: PRIVATE_HASH,
    scoringMode: "automatic",
    maxPoints: item.maxPoints,
    answer: { kind: "option-id", value: "A", acceptedAlternatives: [], tolerance: null, unitRule: null },
    normalizationVersion: "choice-v1",
    solutionRef: "private://solutions/qst-bnk-0123456789abcdef/v1",
    rubricId: null,
    rubricVersion: null,
    rubricSha256: null,
    errorSignals: [{
      code: "ratio-not-equivalent",
      observedValue: "B",
      errorType: "concept-gap",
      rationaleByLocale: { ko: "같은 비를 만들지 못했습니다.", en: "The response does not form an equivalent ratio." }
    }],
    defaultErrorType: "concept-gap",
    state: "in-review"
  }, overrides);
}

function rightsRecord(item, overrides) {
  return Object.assign({
    schemaVersion: contract.SCHEMA_VERSION,
    rightsRecordId: item.rightsRecordId,
    rightsVersion: 1,
    rightsRecordSha256: RIGHTS_HASH,
    itemId: item.itemId,
    itemVersion: item.itemVersion,
    assetId: null,
    mode: "owned_original",
    originType: "gfield-authored",
    authority: "GFIELD",
    sourceTitle: "GFIELD Grade 6 Diagnostic Draft",
    sourceUrl: null,
    documentRevision: "v1",
    sourceLocator: "item qst-bnk-0123456789abcdef",
    licenseId: null,
    licenseUrl: null,
    permissionRecordId: null,
    allowedScopes: ["authenticated", "translation", "derivative", "print"],
    translationAllowed: true,
    derivativeAllowed: true,
    expiresAt: null,
    attribution: "GFIELD",
    reviewedBy: "gmt-rights-0123456789abcdef",
    reviewedAt: "2026-08-26T09:00:00Z",
    decision: "approved"
  }, overrides);
}

function review(item, spec, type, index, overrides) {
  const roleByType = {
    "math-correctness": "math-reviewer", "answer-uniqueness": "math-reviewer",
    "age-appropriateness": "curriculum-reviewer", "translation-ko": "translator-reviewer",
    "translation-en": "translator-reviewer", "translation-zh-Hans": "translator-reviewer",
    rights: "rights-reviewer", "asset-rights": "rights-reviewer", "scoring-rubric": "scoring-reviewer",
    "visual-evidence": "visual-reviewer", "student-payload-safety": "security-reviewer"
  };
  return Object.assign({
    schemaVersion: contract.SCHEMA_VERSION,
    reviewId: `rvw-bnk-${String(index).padStart(16, "0")}`,
    reviewRecordSha256: (((index % 15) + 1).toString(16)).repeat(64),
    type,
    decision: "approved",
    authorId: "gmt-author-0123456789abcdef",
    reviewerId: `gmt-reviewer-${String(index).padStart(16, "0")}`,
    reviewerRole: roleByType[type],
    reviewedAt: "2026-08-26T10:00:00Z",
    itemId: item.itemId,
    itemVersion: item.itemVersion,
    reviewedPublicHash: item.publicPayloadSha256,
    reviewedPrivateHash: ["math-correctness", "answer-uniqueness", "scoring-rubric", "student-payload-safety"].includes(type) ? spec.privateSpecSha256 : null,
    reviewedRubricHash: type === "scoring-rubric" ? spec.rubricSha256 : null,
    rightsRecordId: type === "rights" ? item.rightsRecordId : null,
    reviewedRightsHash: type === "rights" ? RIGHTS_HASH : null,
    locale: type.startsWith("translation-") ? type.slice("translation-".length) : null,
    evidenceRef: `private://reviews/${type}`
  }, overrides);
}

function bundle(overrides) {
  const item = publicItem();
  const spec = privateSpec(item);
  const types = contract.requiredReviewTypes(item);
  return Object.assign({
    publicItem: item,
    privateSpec: spec,
    rubric: null,
    rightsRecord: rightsRecord(item),
    assetRightsRecords: [],
    reviews: types.map(function (type, index) { return review(item, spec, type, index + 1); }),
  }, overrides);
}

test("student-safe item payload validates without carrying any scoring answer", function () {
  const item = publicItem();
  assert.equal(contract.validatePublicItem(item), true);
  const serialized = JSON.stringify(item).toLowerCase();
  ["answerkey", "correctoption", "iscorrect", "privatespecsha256", "scoringspecid"].forEach(function (secretField) {
    assert.equal(serialized.includes(secretField), false);
  });
});

test("authenticated assessment items require one signed-payload blueprint and slot binding", function () {
  const missing = publicItem();
  delete missing.assessmentBinding;
  assert.throws(function () { contract.validatePublicItem(missing); }, /assessmentBinding/);

  const wrongSlot = publicItem();
  wrongSlot.assessmentBinding.slotId = "slot-bdg-g6-rp-a-06";
  assert.equal(contract.validatePublicItem(wrongSlot), true);

  const practice = publicItem({ visibilityClass: "public-practice", assessmentBinding: null });
  assert.equal(contract.validatePublicItem(practice), true);
});

test("nested or obvious answers, sparse payloads, mismatched lineage, and mismatched response UI stay blocked", function () {
  const leaked = publicItem();
  leaked.options[0] = Object.assign({}, leaked.options[0], { isCorrect: true });
  assert.throws(function () { contract.validatePublicItem(leaked); }, /private scoring data/);
  const obvious = publicItem();
  obvious.promptBlocks[0] = { type: "text", valueByLocale: { ko: "정답은 A", en: "The correct answer is A" } };
  assert.throws(function () { contract.validatePublicItem(obvious); }, /answer-revealing text/);
  const colonAnswer = publicItem();
  colonAnswer.promptBlocks[0] = { type: "text", valueByLocale: { ko: "답을 쓰세요.", en: "Answer: A" } };
  assert.throws(function () { contract.validatePublicItem(colonAnswer); }, /answer-revealing text/);
  assert.throws(function () { contract.validatePublicItem(publicItem({ promptBlocks: new Array(1) })); }, /sparse entries/);
  assert.throws(function () { contract.validatePublicItem(publicItem({ clusterId: "6.NS.A" })); }, /same CCSS lineage/);
  assert.throws(function () { contract.validatePublicItem(publicItem({ responseUi: { inputKind: "number" } })); }, /must match responseType/);
});

test("visually duplicate localized choices cannot create more than one apparent answer", function () {
  const duplicateKorean = publicItem();
  duplicateKorean.options[1].labelByLocale.ko = duplicateKorean.options[0].labelByLocale.ko;
  assert.throws(function () { contract.validatePublicItem(duplicateKorean); }, /option labels contain ko duplicates/);

  const duplicateEnglish = publicItem();
  duplicateEnglish.options[1].labelByLocale.en = duplicateEnglish.options[0].labelByLocale.en.normalize("NFKD");
  assert.throws(function () { contract.validatePublicItem(duplicateEnglish); }, /option labels contain en duplicates/);
});

test("item inputs reject inherited, accessor, symbol, oversized, and circular structures", function () {
  const inherited = publicItem();
  inherited.assessmentBinding = Object.create(inherited.assessmentBinding);
  assert.throws(function () { contract.validatePublicItem(inherited); }, /plain object/);

  const accessor = publicItem();
  const binding = Object.assign({}, accessor.assessmentBinding);
  Object.defineProperty(binding, "slotId", {
    enumerable: true,
    get: function () { return "slot-bdg-g6-rp-a-03"; }
  });
  accessor.assessmentBinding = binding;
  assert.throws(function () { contract.validatePublicItem(accessor); }, /enumerable data field/);

  const symbolField = publicItem();
  symbolField.assessmentBinding[Symbol("hidden")] = "value";
  assert.throws(function () { contract.validatePublicItem(symbolField); }, /symbol fields/);

  const circular = publicItem();
  circular.assessmentBinding.loop = circular.assessmentBinding;
  assert.throws(function () { contract.validatePublicItem(circular); }, /circular references/);

  const oversized = publicItem();
  oversized.promptBlocks = new Array(1001).fill(oversized.promptBlocks[0]);
  assert.throws(function () { contract.validatePublicItem(oversized); }, /cannot exceed 1000 entries/);
});

test("private scoring is bound to one immutable public revision", function () {
  const item = publicItem();
  assert.equal(contract.validatePrivateSpec(privateSpec(item), item), true);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { publicPayloadSha256: "c".repeat(64) }), item);
  }, /exact public item revision/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { maxPoints: 2 }), item);
  }, /must match/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { answer: { kind: "option-id", value: "Z", acceptedAlternatives: [], tolerance: null, unitRule: null } }), item);
  }, /correct option must exist/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { answer: { kind: "numeric-exact", value: "6", acceptedAlternatives: [], tolerance: null, unitRule: null } }), item);
  }, /requires a numeric item/);
  const numericItem = publicItem({ responseType: "numeric", options: [], responseUi: { inputKind: "number" } });
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(numericItem, {
      answer: { kind: "numeric-exact", value: "1/0", acceptedAlternatives: [], tolerance: null, unitRule: null },
      normalizationVersion: "rational-v1"
    }), numericItem);
  }, /canonical finite/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(numericItem, {
      answer: { kind: "numeric-exact", value: "2/4", acceptedAlternatives: [], tolerance: null, unitRule: null },
      normalizationVersion: "rational-v1"
    }), numericItem);
  }, /canonical finite/);
});

test("private scoring preserves reviewed diagnostic signals and only the seven report error types", function () {
  assert.deepEqual(contract.SCORING_ERROR_TYPES, [
    "prerequisite-gap", "concept-gap", "representation-error", "calculation-error",
    "condition-missed", "strategy-gap", "explanation-incomplete"
  ]);
  assert.deepEqual(contract.SCORING_ERROR_TYPES, delivery.SCORING_ERROR_TYPES);
  const item = publicItem();
  assert.throws(function () {
    const spec = privateSpec(item);
    delete spec.defaultErrorType;
    contract.validatePrivateSpec(spec, item);
  }, /defaultErrorType is invalid/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [] }), item);
  }, /errorSignals is required/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { defaultErrorType: "other" }), item);
  }, /defaultErrorType is invalid/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { defaultErrorType: "strategy-gap" }), item);
  }, /defaultErrorType must be present in errorSignals/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [{
      code: "ratio-not-equivalent", observedValue: "B", errorType: "other",
      rationaleByLocale: { ko: "비가 다릅니다.", en: "The ratio differs." }
    }] }), item);
  }, /errorType is invalid/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [{
      code: "ratio-not-equivalent", observedValue: "B", errorType: "concept-gap",
      rationaleByLocale: { ko: "비가 다릅니다.", en: "The ratio differs.", "zh-Hans": "比例不同。" }
    }] }), item);
  }, /unsupported fields/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [{
      code: "ratio-not-equivalent", observedValue: "B", errorType: "concept-gap",
      rationaleByLocale: { ko: "비가 다릅니다.", en: "The ratio differs." }, notes: "private"
    }] }), item);
  }, /unsupported fields/);
});

test("automatic MC maps every wrong option exactly once while numeric and teacher modes use a fallback", function () {
  const item = publicItem({
    options: publicItem().options.concat([{ optionId: "C", labelByLocale: { ko: "9:10", en: "9:10" } }])
  });
  const completeSignals = [
    { code: "ratio-not-equivalent", observedValue: "B", errorType: "concept-gap", rationaleByLocale: { ko: "비가 다릅니다.", en: "The ratio differs." } },
    { code: "scale-mismatch", observedValue: "C", errorType: "calculation-error", rationaleByLocale: { ko: "두 항을 같은 배수로 바꾸지 않았습니다.", en: "The two terms were not scaled by the same factor." } }
  ];
  assert.equal(contract.validatePrivateSpec(privateSpec(item, { errorSignals: completeSignals }), item), true);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item), item);
  }, /map every wrong optionId exactly once/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [completeSignals[0], Object.assign({}, completeSignals[1], { observedValue: "A" })] }), item);
  }, /exclude the correct optionId/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [completeSignals[0], Object.assign({}, completeSignals[1], { code: completeSignals[0].code })] }), item);
  }, /duplicate codes/);
  assert.throws(function () {
    contract.validatePrivateSpec(privateSpec(item, { errorSignals: [completeSignals[0], Object.assign({}, completeSignals[1], { observedValue: "B" })] }), item);
  }, /duplicate observed values/);

  const numericItem = publicItem({ responseType: "numeric", options: [], responseUi: { inputKind: "number" } });
  assert.equal(contract.validatePrivateSpec(privateSpec(numericItem, {
    answer: { kind: "numeric-exact", value: "6", acceptedAlternatives: [], tolerance: null, unitRule: null },
    normalizationVersion: "rational-v1"
  }), numericItem), true);

  const teacherItem = publicItem({ responseType: "constructed-response", options: [], responseUi: { inputKind: "workpad", displayUnit: null, inputHintByLocale: null } });
  assert.equal(contract.validatePrivateSpec(privateSpec(teacherItem, {
    scoringMode: "teacher", answer: null, normalizationVersion: null,
    rubricId: "rub-bnk-0123456789abcdef", rubricVersion: 1, rubricSha256: RUBRIC_HASH,
    errorSignals: [{ code: "missing-evidence", observedValue: "teacher-review", errorType: "explanation-incomplete", rationaleByLocale: { ko: "근거가 충분하지 않습니다.", en: "The supporting evidence is incomplete." } }],
    defaultErrorType: "explanation-incomplete"
  }), teacherItem), true);
});

test("rights modes and delivery scopes prevent unlicensed public or authenticated release", function () {
  const item = publicItem();
  assert.equal(contract.validateRightsRecord(rightsRecord(item), item), true);
  assert.throws(function () {
    contract.validateRightsRecord(rightsRecord(item, { mode: "permission_required" }), item);
  }, /cannot release/);
  assert.throws(function () {
    contract.validateRightsRecord(rightsRecord(item, { allowedScopes: ["web-public", "translation"] }), item);
  }, /must allow authenticated/);
  const practice = publicItem({ visibilityClass: "public-practice", assessmentBinding: null });
  assert.throws(function () {
    contract.validateRightsRecord(rightsRecord(practice, { mode: "private_licensed" }), practice);
  }, /require a license or permission record/);
  assert.throws(function () {
    contract.validateRightsRecord(rightsRecord(practice, { mode: "private_licensed", licenseId: "license-1", licenseUrl: "https://example.org/license" }), practice);
  }, /reviewed public rights/);
  assert.throws(function () {
    contract.validateRightsRecord(rightsRecord(item, { mode: "permissive_reviewed", licenseId: {}, licenseUrl: {} }), item);
  }, /licenseId must be a non-blank trimmed string/);
  assert.throws(function () {
    contract.validateRightsRecord(rightsRecord(item, { mode: "permissive_reviewed", licenseId: "license-1", licenseUrl: "https://" }), item);
  }, /valid HTTPS URL/);
});

test("structural eligibility requires exact-hash independent reviews and defers trusted checks to the signer", function () {
  const complete = bundle();
  const decision = contract.evaluateStructuralEligibility(complete);
  assert.equal(decision.state, "structurally-ready-for-authenticated-signer-verification");
  assert.equal(decision.automaticRelease, false);
  assert.equal(decision.requiresAuthenticatedSigner, true);
  assert.equal(decision.requiresAuthenticatedDelivery, true);
  assert.equal(decision.requiresCryptographicSignature, true);
  assert.deepEqual(decision.requiredSignerChecks, [
    "canonical-public-private-rights-rubric-review-sha256", "trusted-current-time-rights-expiry",
    "database-author-reviewer-role-and-evidence", "asset-byte-hash-and-sanitization", "answer-leakage-scan",
    "student-payload-safety-review",
    "release-manifest-signature"
  ]);

  const missing = bundle();
  missing.reviews = missing.reviews.filter(function (row) { return row.type !== "answer-uniqueness"; });
  assert.throws(function () { contract.evaluateStructuralEligibility(missing); }, /missing required review: answer-uniqueness/);

  const missingSafetyReview = bundle();
  missingSafetyReview.reviews = missingSafetyReview.reviews.filter(function (row) { return row.type !== "student-payload-safety"; });
  assert.throws(function () { contract.evaluateStructuralEligibility(missingSafetyReview); }, /missing required review: student-payload-safety/);

  const selfReviewed = bundle();
  const mathIndex = selfReviewed.reviews.findIndex(function (row) { return row.type === "math-correctness"; });
  selfReviewed.reviews[mathIndex] = Object.assign({}, selfReviewed.reviews[mathIndex], {
    reviewerId: selfReviewed.reviews[mathIndex].authorId
  });
  assert.throws(function () { contract.evaluateStructuralEligibility(selfReviewed); }, /independent reviewer/);

  const expired = bundle();
  expired.rightsRecord = Object.assign({}, expired.rightsRecord, { expiresAt: "2026-08-26T08:30:00Z" });
  assert.throws(function () { contract.evaluateStructuralEligibility(expired); }, /expires before or at its review time/);
});

test("placement projection stays locked until an authenticated server signs the release", function () {
  const complete = bundle();
  const candidate = contract.buildLockedBlueprintCandidate(complete, "course-placement");
  assert.equal(candidate.reviewState, "pending-authenticated-signer-verification");
  assert.equal(candidate.purpose, "course-placement");
  assert.deepEqual(candidate.assessmentBinding, complete.publicItem.assessmentBinding);
  assert.equal(Object.isFrozen(candidate.assessmentBinding), true);
  assert.equal(candidate.structuralEligibility, "structurally-ready-for-authenticated-signer-verification");
  assert.notEqual(candidate.reviewState, "approved");
  assert.deepEqual({
    itemVersion: candidate.itemVersion,
    publicRevisionId: candidate.publicRevisionId,
    publicPayloadSha256: candidate.publicPayloadSha256,
    scoringSpecId: candidate.scoringSpecId,
    scoringSpecVersion: candidate.scoringSpecVersion,
    privateSpecSha256: candidate.privateSpecSha256,
    rubricId: candidate.rubricId,
    rubricVersion: candidate.rubricVersion,
    rubricSha256: candidate.rubricSha256,
    rightsVersion: candidate.rightsVersion,
    rightsRecordSha256: candidate.rightsRecordSha256,
    releaseId: candidate.releaseId,
    releaseManifestId: candidate.releaseManifestId
  }, {
    itemVersion: 1,
    publicRevisionId: "rev-bnk-0123456789abcdef",
    publicPayloadSha256: PUBLIC_HASH,
    scoringSpecId: "scr-bnk-0123456789abcdef",
    scoringSpecVersion: 1,
    privateSpecSha256: PRIVATE_HASH,
    rubricId: null,
    rubricVersion: null,
    rubricSha256: null,
    rightsVersion: 1,
    rightsRecordSha256: RIGHTS_HASH,
    releaseId: null,
    releaseManifestId: null
  });
  assert.deepEqual(candidate.assetRevisionBindings, []);
  assert.equal(candidate.reviewBindings.length, contract.requiredReviewTypes(complete.publicItem).length);
  assert.equal(JSON.stringify(candidate).includes("errorSignals"), false);
  assert.equal(JSON.stringify(candidate).includes("defaultErrorType"), false);

  assert.throws(function () {
    contract.buildLockedBlueprintCandidate(complete, "unit-screener");
  }, /purpose must match the signed public item binding/);
  const unitScreenerBundle = bundle();
  unitScreenerBundle.publicItem.assessmentBinding.purpose = "unit-screener";
  assert.throws(function () {
    contract.buildLockedBlueprintCandidate(unitScreenerBundle, "course-placement");
  }, /purpose must match the signed public item binding/);

  const practiceBundle = bundle();
  practiceBundle.publicItem = publicItem({ visibilityClass: "public-practice", assessmentBinding: null });
  practiceBundle.privateSpec = privateSpec(practiceBundle.publicItem);
  practiceBundle.rightsRecord = rightsRecord(practiceBundle.publicItem, { allowedScopes: ["web-public", "translation", "derivative"] });
  practiceBundle.reviews = contract.requiredReviewTypes(practiceBundle.publicItem).map(function (type, index) {
    return review(practiceBundle.publicItem, practiceBundle.privateSpec, type, index + 1);
  });
  assert.throws(function () {
    contract.buildLockedBlueprintCandidate(practiceBundle, "course-placement");
  }, /must use authenticated-assessment/);
  assert.throws(function () {
    contract.buildLockedBlueprintCandidate(practiceBundle, "unit-screener");
  }, /must use authenticated-assessment/);
  assert.throws(function () {
    contract.buildLockedBlueprintCandidate(practiceBundle);
  }, /assessment purpose is invalid/);
  assert.throws(function () {
    contract.buildLockedBlueprintCandidate(practiceBundle, "course-placement ");
  }, /assessment purpose is invalid/);
});

test("GitHub public payload remains locked until a verified signed release manifest exists", function () {
  assert.throws(function () {
    contract.buildLockedGitHubPublicPracticeCandidate(bundle());
  }, /public-practice items only/);
  const practiceBundle = bundle();
  practiceBundle.publicItem = publicItem({ visibilityClass: "public-practice", assessmentBinding: null });
  practiceBundle.privateSpec = privateSpec(practiceBundle.publicItem);
  practiceBundle.rightsRecord = rightsRecord(practiceBundle.publicItem, { allowedScopes: ["web-public", "translation", "derivative"] });
  practiceBundle.reviews = contract.requiredReviewTypes(practiceBundle.publicItem).map(function (type, index) {
    return review(practiceBundle.publicItem, practiceBundle.privateSpec, type, index + 1);
  });
  const candidate = contract.buildLockedGitHubPublicPracticeCandidate(practiceBundle);
  assert.equal(candidate.state, "locked-awaiting-verified-signed-public-release-manifest");
  assert.equal(candidate.publicPayloadIncluded, false);
  assert.equal(candidate.automaticExport, false);
  assert.equal(JSON.stringify(candidate).includes("Choose the expression"), false);
  const structural = contract.evaluateStructuralEligibility(practiceBundle);
  assert.equal(structural.requiresAuthenticatedSigner, true);
  assert.equal(structural.requiresAuthenticatedDelivery, false);
});

test("teacher-scored constructed responses require an exact-revision rubric whose criteria sum to maxPoints", function () {
  const item = publicItem({
    responseType: "constructed-response",
    options: [],
    responseUi: { inputKind: "workpad", displayUnit: null, inputHintByLocale: null }
  });
  const spec = privateSpec(item, {
    scoringMode: "teacher",
    answer: null,
    normalizationVersion: null,
    rubricId: "rub-bnk-0123456789abcdef",
    rubricVersion: 1,
    rubricSha256: RUBRIC_HASH
  });
  const rubric = {
    schemaVersion: contract.SCHEMA_VERSION,
    rubricId: spec.rubricId,
    rubricVersion: spec.rubricVersion,
    rubricSha256: RUBRIC_HASH,
    itemId: item.itemId,
    itemVersion: item.itemVersion,
    publicPayloadSha256: item.publicPayloadSha256,
    privateSpecSha256: spec.privateSpecSha256,
    maxPoints: 1,
    allowedPointIncrements: [0, 0.5, 1],
    criteria: [{
      criterionId: "reasoning",
      maxPoints: 1,
      levels: [
        { points: 0, observableEvidenceByLocale: { ko: "근거가 없습니다.", en: "No supporting evidence is shown." } },
        { points: 0.5, observableEvidenceByLocale: { ko: "일부 근거가 맞습니다.", en: "Some supporting evidence is correct." } },
        { points: 1, observableEvidenceByLocale: { ko: "결론과 근거가 모두 맞습니다.", en: "The conclusion and evidence are both correct." } }
      ],
      requiredEvidence: ["written-reasoning"],
      errorCodes: ["explanation-incomplete"]
    }],
    humanReviewRequired: true,
    secondReviewPolicy: "boundary-and-high-stakes-required",
    state: "in-review"
  };
  assert.equal(contract.validateRubric(rubric, item, spec), true);
  const complete = {
    publicItem: item,
    privateSpec: spec,
    rubric,
    rightsRecord: rightsRecord(item),
    assetRightsRecords: [],
    reviews: contract.requiredReviewTypes(item).map(function (type, index) { return review(item, spec, type, index + 1); })
  };
  assert.equal(contract.evaluateStructuralEligibility(complete).automaticRelease, false);
  const broken = Object.assign({}, rubric, {
    criteria: [Object.assign({}, rubric.criteria[0], { maxPoints: 0.5, levels: rubric.criteria[0].levels.slice(0, 2) })]
  });
  assert.throws(function () { contract.validateRubric(broken, item, spec); }, /sum to maxPoints/);
  const missingMaxLevel = Object.assign({}, rubric, {
    criteria: [Object.assign({}, rubric.criteria[0], { levels: rubric.criteria[0].levels.slice(0, 2) })]
  });
  assert.throws(function () { contract.validateRubric(missingMaxLevel, item, spec); }, /include zero and criterion maxPoints/);
});

test("every diagram asset needs its own exact-hash rights record and independent review", function () {
  const assetRightsId = "rgt-bnk-fedcba9876543210";
  const assetRightsHash = "d".repeat(64);
  const item = publicItem({
    promptBlocks: [
      { type: "text", valueByLocale: { ko: "그림을 보고 같은 비율을 고르세요.", en: "Use the diagram to choose the same ratio." } },
      { type: "diagram", assetId: "ast-bnk-0123456789abcdef" }
    ],
    assets: [{
      assetId: "ast-bnk-0123456789abcdef",
      sha256: "e".repeat(64),
      mimeType: "image/svg+xml",
      altByLocale: { ko: "점이 표시된 비율 그림", en: "A ratio diagram with marked points" },
      rightsRecordId: assetRightsId
    }]
  });
  const spec = privateSpec(item);
  const assetRights = rightsRecord(item, {
    rightsRecordId: assetRightsId,
    rightsRecordSha256: assetRightsHash,
    assetId: item.assets[0].assetId,
    sourceLocator: "asset ast-bnk-0123456789abcdef"
  });
  const complete = {
    publicItem: item,
    privateSpec: spec,
    rubric: null,
    rightsRecord: rightsRecord(item),
    assetRightsRecords: [assetRights],
    reviews: contract.requiredReviewTypes(item).map(function (type, index) {
      return review(item, spec, type, index + 1, type === "asset-rights" ? {
        rightsRecordId: assetRightsId,
        reviewedRightsHash: assetRightsHash
      } : null);
    })
  };
  assert.equal(contract.evaluateStructuralEligibility(complete).automaticRelease, false);
  const missing = Object.assign({}, complete, { assetRightsRecords: [] });
  assert.throws(function () { contract.evaluateStructuralEligibility(missing); }, /every asset requires exactly one/);
});

test("Chinese in any student-visible field requires a Chinese translation review", function () {
  const item = publicItem();
  item.options[0] = { optionId: "A", labelByLocale: { ko: "6:10", en: "6:10", "zh-Hans": "6:10" } };
  assert.ok(contract.requiredReviewTypes(item).includes("translation-zh-Hans"));
  const spec = privateSpec(item);
  const wrongLocale = review(item, spec, "translation-en", 99, { locale: "ko" });
  assert.throws(function () { contract.validateReview(wrongLocale, item, spec, new Map()); }, /locale does not match/);
});
