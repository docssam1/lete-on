const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const guardUrl = pathToFileURL(path.join(
  __dirname,
  "..",
  "question-bank",
  "boarding-signer-payload-guard.mjs",
)).href;

async function guard() {
  return import(guardUrl);
}

const IDs = Object.freeze({
  item: "qst-bnk-0123456789abcdef",
  revision: "rev-bnk-0123456789abcdef",
  scoring: "scr-bnk-0123456789abcdef",
  rubric: "rub-bnk-0123456789abcdef",
  rights: "rgt-bnk-0123456789abcdef",
  review: "rvw-bnk-0123456789abcdef",
});
const PUBLIC_HASH = "a".repeat(64);
const PRIVATE_HASH = "b".repeat(64);
const REVIEW_HASH = "c".repeat(64);
const RIGHTS_HASH = "d".repeat(64);
const RUBRIC_HASH = "f".repeat(64);
const AUTHOR_ID = "11111111-1111-4111-8111-111111111111";
const REVIEWER_ID = "22222222-2222-4222-8222-222222222222";
const APPROVER_ID = "33333333-3333-4333-8333-333333333333";

function publicPayload(overrides = {}) {
  return Object.assign({
    schemaVersion: "gfield-item-bank-v1",
    itemId: IDs.item,
    itemVersion: 1,
    publicRevisionId: IDs.revision,
    publicPayloadSha256: PUBLIC_HASH,
    visibilityClass: "authenticated-assessment",
    programId: "us-core-k8",
    targetGrade: 6,
    domainId: "G6-RP",
    clusterId: "6.RP.A",
    skillId: "ratio-language",
    difficulty: "foundation",
    responseType: "multiple-choice",
    maxPoints: 1,
    assessmentBinding: {
      blueprintId: "asm-bdg-grade6-placement-v1",
      blueprintVersion: 1,
      blueprintContractSha256: "e".repeat(64),
      purpose: "course-placement",
      slotId: "slot-bdg-g6-rp-a-01",
      unitId: "grade6-ratios",
      standardRange: "6.RP.A.1-3",
    },
    promptBlocks: [{ type: "text", valueByLocale: { ko: "비를 고르세요.", en: "Choose the ratio." } }],
    options: [
      { optionId: "A", labelByLocale: { ko: "첫째", en: "First" } },
      { optionId: "B", labelByLocale: { ko: "둘째", en: "Second" } },
    ],
    assets: [],
    responseUi: { inputKind: "choice", displayUnit: null, inputHintByLocale: null },
    rightsRecordId: IDs.rights,
  }, overrides);
}

function privatePayload(overrides = {}) {
  return Object.assign({
    schemaVersion: "gfield-item-bank-v1",
    scoringSpecId: IDs.scoring,
    specVersion: 1,
    itemId: IDs.item,
    itemVersion: 1,
    publicPayloadSha256: PUBLIC_HASH,
    privateSpecSha256: PRIVATE_HASH,
    scoringMode: "automatic",
    maxPoints: 1,
    answer: {
      kind: "option-id",
      value: "A",
      acceptedAlternatives: [],
      tolerance: null,
      unitRule: null,
    },
    normalizationVersion: "option-id-v1",
    solutionRef: "private://grade6/item-1",
    rubricId: null,
    rubricVersion: null,
    rubricSha256: null,
    errorSignals: [{
      code: "ratio-order-reversed",
      observedValue: "B",
      errorType: "representation-error",
      rationaleByLocale: {
        ko: "비의 순서를 반대로 보았습니다.",
        en: "The ratio order was reversed.",
      },
    }],
    defaultErrorType: "representation-error",
    state: "in-review",
  }, overrides);
}

function itemInput(overrides = {}) {
  return Object.assign({
    row: {
      itemId: IDs.item,
      itemVersion: 1,
      programId: "us-core-k8",
      targetGrade: "6",
      visibilityClass: "authenticated-assessment",
      publicHash: PUBLIC_HASH,
      privateHash: PRIVATE_HASH,
      rubricHash: null,
    },
    publicPayload: publicPayload(),
    privatePayload: privatePayload(),
    rubricPayload: null,
  }, overrides);
}

test("signer guard accepts one internally bound answer-free public and automatic private pair", async function () {
  const module = await guard();
  const result = module.validateSignerItemPayloads(itemInput());
  assert.equal(result.publicItem.itemId, IDs.item);
  assert.equal(result.privateSpec.scoringMode, "automatic");
});

test("signer guard rejects row visibility drift and recursive or textual answer leaks", async function () {
  const module = await guard();
  const visibilityDrift = itemInput();
  visibilityDrift.publicPayload.visibilityClass = "public-practice";
  assert.throws(
    () => module.validateSignerItemPayloads(visibilityDrift),
    /public_payload_invalid/,
  );

  const nestedLeak = itemInput();
  nestedLeak.publicPayload.promptBlocks[0].valueByLocale.hidden = {
    correct_answer: "A",
  };
  assert.throws(
    () => module.validateSignerItemPayloads(nestedLeak),
    /public_answer_leak_detected/,
  );

  const textualLeak = itemInput();
  textualLeak.publicPayload.promptBlocks[0].valueByLocale.en =
    "The correct answer is A.";
  assert.throws(
    () => module.validateSignerItemPayloads(textualLeak),
    /public_answer_leak_detected/,
  );
});

test("signer guard rejects private scoring and rubric relationship drift", async function () {
  const module = await guard();
  const wrongPublicHash = itemInput();
  wrongPublicHash.privatePayload.publicPayloadSha256 = "f".repeat(64);
  assert.throws(
    () => module.validateSignerItemPayloads(wrongPublicHash),
    /private_payload_invalid/,
  );

  const automaticRubric = itemInput({ rubricPayload: {} });
  assert.throws(
    () => module.validateSignerItemPayloads(automaticRubric),
    /private_payload_invalid/,
  );

  const unreviewedDefault = itemInput();
  unreviewedDefault.privatePayload.defaultErrorType = "condition-missed";
  assert.throws(
    () => module.validateSignerItemPayloads(unreviewedDefault),
    /private_payload_invalid/,
  );
});

test("signer guard enforces the exact public lineage, assessment, option, and response contracts", async function () {
  const module = await guard();
  const wrongProgram = itemInput();
  wrongProgram.row.programId = "different-program";
  assert.throws(
    () => module.validateSignerItemPayloads(wrongProgram),
    /public_payload_invalid/,
  );

  const wrongLineage = itemInput();
  wrongLineage.publicPayload.domainId = "G6-NS";
  assert.throws(
    () => module.validateSignerItemPayloads(wrongLineage),
    /public_payload_invalid/,
  );

  const incompleteBinding = itemInput();
  delete incompleteBinding.publicPayload.assessmentBinding.unitId;
  assert.throws(
    () => module.validateSignerItemPayloads(incompleteBinding),
    /public_payload_invalid/,
  );

  const duplicateOption = itemInput();
  duplicateOption.publicPayload.options[1].labelByLocale.en = "First";
  assert.throws(
    () => module.validateSignerItemPayloads(duplicateOption),
    /public_payload_invalid/,
  );

  const wrongInput = itemInput();
  wrongInput.publicPayload.responseUi.inputKind = "number";
  assert.throws(
    () => module.validateSignerItemPayloads(wrongInput),
    /public_payload_invalid/,
  );
});

test("signer guard binds automatic answer kinds and every MC distractor exactly", async function () {
  const module = await guard();
  const missingAnswerOption = itemInput();
  missingAnswerOption.privatePayload.answer.value = "C";
  assert.throws(
    () => module.validateSignerItemPayloads(missingAnswerOption),
    /private_payload_invalid/,
  );

  const mapsCorrectOption = itemInput();
  mapsCorrectOption.privatePayload.errorSignals[0].observedValue = "A";
  assert.throws(
    () => module.validateSignerItemPayloads(mapsCorrectOption),
    /private_payload_invalid/,
  );

  const numeric = itemInput({
    publicPayload: publicPayload({
      responseType: "numeric",
      options: [],
      responseUi: {
        inputKind: "number",
        displayUnit: null,
        inputHintByLocale: null,
      },
    }),
    privatePayload: privatePayload({
      answer: {
        kind: "numeric-exact",
        value: "01",
        acceptedAlternatives: [],
        tolerance: null,
        unitRule: null,
      },
      normalizationVersion: "numeric-exact-v1",
      errorSignals: [{
        code: "place-value",
        observedValue: "1.0",
        errorType: "representation-error",
        rationaleByLocale: { ko: "표현 오류입니다.", en: "The representation is invalid." },
      }],
    }),
  });
  assert.throws(
    () => module.validateSignerItemPayloads(numeric),
    /private_payload_invalid/,
  );
});

function teacherItemInput() {
  const publicItem = publicPayload({
    responseType: "constructed-response",
    options: [],
    responseUi: {
      inputKind: "workpad",
      displayUnit: null,
      inputHintByLocale: null,
    },
  });
  const privateSpec = privatePayload({
    scoringMode: "teacher",
    answer: null,
    normalizationVersion: null,
    rubricId: IDs.rubric,
    rubricVersion: 1,
    rubricSha256: RUBRIC_HASH,
    errorSignals: [{
      code: "missing-evidence",
      observedValue: "teacher-review",
      errorType: "explanation-incomplete",
      rationaleByLocale: {
        ko: "근거가 부족합니다.",
        en: "The evidence is incomplete.",
      },
    }],
    defaultErrorType: "explanation-incomplete",
  });
  const rubric = {
    schemaVersion: "gfield-item-bank-v1",
    rubricId: IDs.rubric,
    rubricVersion: 1,
    rubricSha256: RUBRIC_HASH,
    itemId: IDs.item,
    itemVersion: 1,
    publicPayloadSha256: PUBLIC_HASH,
    privateSpecSha256: PRIVATE_HASH,
    maxPoints: 1,
    allowedPointIncrements: [0, 1],
    criteria: [{
      criterionId: "reasoning",
      maxPoints: 1,
      levels: [
        { points: 0, observableEvidenceByLocale: { ko: "근거 없음", en: "No evidence" } },
        { points: 1, observableEvidenceByLocale: { ko: "근거 제시", en: "Evidence shown" } },
      ],
      requiredEvidence: ["reasoning"],
      errorCodes: ["explanation-incomplete"],
    }],
    humanReviewRequired: true,
    secondReviewPolicy: "boundary-and-high-stakes-required",
    state: "in-review",
  };
  return itemInput({
    publicPayload: publicItem,
    privatePayload: privateSpec,
    rubricPayload: rubric,
    row: {
      itemId: IDs.item,
      itemVersion: 1,
      programId: "us-core-k8",
      targetGrade: "6",
      visibilityClass: "authenticated-assessment",
      publicHash: PUBLIC_HASH,
      privateHash: PRIVATE_HASH,
      rubricHash: RUBRIC_HASH,
    },
  });
}

test("signer guard validates teacher rubric increments, levels, totals, and error taxonomy", async function () {
  const module = await guard();
  assert.equal(
    module.validateSignerItemPayloads(teacherItemInput()).rubric.criteria.length,
    1,
  );
  const emptyCriteria = teacherItemInput();
  emptyCriteria.rubricPayload.criteria = [];
  assert.throws(
    () => module.validateSignerItemPayloads(emptyCriteria),
    /rubric_payload_invalid/,
  );
  const mismatchedErrorType = teacherItemInput();
  mismatchedErrorType.rubricPayload.criteria[0].errorCodes = ["concept-gap"];
  assert.throws(
    () => module.validateSignerItemPayloads(mismatchedErrorType),
    /rubric_payload_invalid/,
  );
});

test("signer guard keeps every asset-bearing release locked until bytes can be reloaded", async function () {
  const module = await guard();
  const withAsset = itemInput();
  withAsset.publicPayload.assets = [{
    assetId: "ast-bnk-0123456789abcdef",
    sha256: "9".repeat(64),
    mimeType: "image/svg+xml",
    altByLocale: { ko: "도형", en: "Diagram" },
    rightsRecordId: "rgt-bnk-fedcba9876543210",
  }];
  withAsset.publicPayload.promptBlocks.push({
    type: "diagram",
    assetId: "ast-bnk-0123456789abcdef",
  });
  assert.throws(
    () => module.validateSignerItemPayloads(withAsset),
    /asset_bytes_verification_unavailable/,
  );
});

function rightsPayload(overrides = {}) {
  return Object.assign({
    schemaVersion: "gfield-item-bank-v1",
    rightsRecordId: IDs.rights,
    rightsVersion: 1,
    rightsRecordSha256: RIGHTS_HASH,
    itemId: IDs.item,
    itemVersion: 1,
    assetId: null,
    mode: "owned_original",
    originType: "gfield-authored",
    authority: "GFIELD",
    sourceTitle: "GFIELD authored item",
    sourceUrl: null,
    documentRevision: "v1",
    sourceLocator: "private item revision",
    licenseId: null,
    licenseUrl: null,
    permissionRecordId: null,
    allowedScopes: ["authenticated", "translation", "print"],
    translationAllowed: true,
    derivativeAllowed: true,
    expiresAt: null,
    attribution: "GFIELD",
    reviewedBy: REVIEWER_ID,
    reviewedAt: "2026-08-28T10:00:00Z",
    decision: "approved",
  }, overrides);
}

function rightsInput(overrides = {}) {
  return Object.assign({
    itemId: IDs.item,
    itemVersion: 1,
    visibilityClass: "authenticated-assessment",
    trustedNowMs: Date.parse("2026-08-28T11:00:00Z"),
    assetKey: "__item__",
    expectedRightsRecordId: IDs.rights,
    row: {
      rightsRecordId: IDs.rights,
      rightsVersion: 1,
      itemId: IDs.item,
      itemVersion: 1,
      assetId: null,
      rightsHash: RIGHTS_HASH,
      decision: "approved",
      expiresAt: null,
      reviewedBy: REVIEWER_ID,
      reviewedAt: "2026-08-28T10:00:00Z",
    },
    payload: rightsPayload(),
  }, overrides);
}

test("rights payload must bind the exact public rights id, row identity, and approval", async function () {
  const module = await guard();
  const input = rightsInput();
  assert.equal(module.validateSignerRightsPayload(input).decision, "approved");
  input.expectedRightsRecordId = "rgt-bnk-fedcba9876543210";
  assert.throws(
    () => module.validateSignerRightsPayload(input),
    /rights_payload_invalid/,
  );
});

test("rights payload rejects blocked modes, missing scopes, forged reviewer metadata, and expiry drift", async function () {
  const module = await guard();
  const blockedMode = rightsInput();
  blockedMode.payload.mode = "noncommercial_reference";
  assert.throws(
    () => module.validateSignerRightsPayload(blockedMode),
    /rights_payload_invalid/,
  );

  const missingScope = rightsInput();
  missingScope.payload.allowedScopes = ["translation", "print"];
  assert.throws(
    () => module.validateSignerRightsPayload(missingScope),
    /rights_payload_invalid/,
  );

  const forgedReviewer = rightsInput();
  forgedReviewer.payload.reviewedBy = AUTHOR_ID;
  assert.throws(
    () => module.validateSignerRightsPayload(forgedReviewer),
    /rights_payload_invalid/,
  );

  const expired = rightsInput();
  expired.payload.expiresAt = "2026-08-28T10:30:00Z";
  expired.row.expiresAt = "2026-08-28T10:30:00+00:00";
  assert.throws(
    () => module.validateSignerRightsPayload(expired),
    /rights_payload_invalid/,
  );

  const mismatchedExpiry = rightsInput();
  mismatchedExpiry.payload.expiresAt = "2026-08-29T10:30:00Z";
  mismatchedExpiry.row.expiresAt = "2026-08-30T10:30:00+00:00";
  assert.throws(
    () => module.validateSignerRightsPayload(mismatchedExpiry),
    /rights_payload_invalid/,
  );
});

function reviewPayload(overrides = {}) {
  return Object.assign({
    schemaVersion: "gfield-item-bank-v1",
    reviewId: IDs.review,
    reviewRecordSha256: REVIEW_HASH,
    type: "math-correctness",
    decision: "approved",
    authorId: AUTHOR_ID,
    reviewerId: REVIEWER_ID,
    reviewerRole: "math-reviewer",
    reviewedAt: "2026-08-28T10:00:00Z",
    itemId: IDs.item,
    itemVersion: 1,
    reviewedPublicHash: PUBLIC_HASH,
    reviewedPrivateHash: PRIVATE_HASH,
    reviewedRubricHash: null,
    rightsRecordId: null,
    reviewedRightsHash: null,
    locale: null,
    evidenceRef: "private://review-evidence/1",
  }, overrides);
}

test("review payload must bind row identity, reviewer identity, expected role, and evidence", async function () {
  const module = await guard();
  const input = {
    itemId: IDs.item,
    itemVersion: 1,
    authorUserId: AUTHOR_ID,
    row: {
      reviewId: IDs.review,
      itemId: IDs.item,
      itemVersion: 1,
      reviewType: "math-correctness",
      reviewHash: REVIEW_HASH,
      decision: "approved",
      reviewerUserId: REVIEWER_ID,
      reviewedAt: "2026-08-28T10:00:00Z",
    },
    payload: reviewPayload(),
  };
  assert.equal(
    module.validateSignerReviewPayload(input).reviewerRole,
    "math-reviewer",
  );
  input.payload.reviewerRole = "translator-reviewer";
  assert.throws(
    () => module.validateSignerReviewPayload(input),
    /review_payload_invalid/,
  );
  input.payload.reviewerRole = "math-reviewer";
  input.payload.evidenceRef = "";
  assert.throws(
    () => module.validateSignerReviewPayload(input),
    /review_payload_invalid/,
  );
  input.payload.evidenceRef = "private://review-evidence/1";
  input.payload.assetKey = "__item__";
  assert.throws(
    () => module.validateSignerReviewPayload(input),
    /review_payload_invalid/,
  );

  const safetyReview = {
    itemId: IDs.item,
    itemVersion: 1,
    authorUserId: AUTHOR_ID,
    row: {
      reviewId: IDs.review,
      itemId: IDs.item,
      itemVersion: 1,
      reviewType: "student-payload-safety",
      reviewHash: REVIEW_HASH,
      decision: "approved",
      reviewerUserId: REVIEWER_ID,
      reviewedAt: "2026-08-28T10:00:00+00:00",
    },
    payload: reviewPayload({
      type: "student-payload-safety",
      reviewerRole: "security-reviewer",
    }),
  };
  assert.equal(
    module.validateSignerReviewPayload(safetyReview).reviewerRole,
    "security-reviewer",
  );
});

function credential(version, overrides = {}) {
  return Object.assign({
    user_id: REVIEWER_ID,
    reviewer_role: "math-reviewer",
    credential_version: version,
    status: "active",
    approved_by: APPROVER_ID,
    approved_at: "2026-08-28T08:00:00+00:00",
    expires_at: null,
  }, overrides);
}

function revocation(version, revokedAt) {
  return {
    user_id: REVIEWER_ID,
    reviewer_role: "math-reviewer",
    credential_version: version,
    revoked_at: revokedAt,
  };
}

test("credential selector binds the highest version valid at review and signing time", async function () {
  const module = await guard();
  const selected = module.selectSignerCredential({
    userId: REVIEWER_ID,
    reviewerRole: "math-reviewer",
    evidenceReviewedAt: "2026-08-28T10:00:00+00:00",
    signedAtMs: Date.parse("2026-08-28T11:00:00Z"),
    credentials: [credential(1), credential(2, {
      approved_at: "2026-08-28T09:00:00+00:00",
      expires_at: "2026-08-29T00:00:00+00:00",
    })],
    revocations: [],
  });
  assert.deepEqual(selected, {
    reviewerCredentialVersion: 2,
    credentialApprovedBy: APPROVER_ID,
    credentialApprovedAt: "2026-08-28T09:00:00.000Z",
    credentialExpiresAt: "2026-08-29T00:00:00.000Z",
  });
});

test("credential selector rejects retroactive or future evidence, expiry, and any revocation", async function () {
  const module = await guard();
  const base = {
    userId: REVIEWER_ID,
    reviewerRole: "math-reviewer",
    evidenceReviewedAt: "2026-08-28T10:00:00+00:00",
    signedAtMs: Date.parse("2026-08-28T11:00:00Z"),
    revocations: [],
  };
  assert.throws(() => module.selectSignerCredential({
    ...base,
    credentials: [credential(1, {
      approved_at: "2026-08-28T10:00:01+00:00",
    })],
  }), /reviewer_credential_invalid/);
  assert.throws(() => module.selectSignerCredential({
    ...base,
    credentials: [credential(1, {
      expires_at: "2026-08-28T10:30:00+00:00",
    })],
  }), /reviewer_credential_invalid/);
  assert.throws(() => module.selectSignerCredential({
    ...base,
    credentials: [credential(1)],
    revocations: [revocation(1, "2026-08-28T10:30:00+00:00")],
  }), /reviewer_credential_invalid/);
  assert.throws(() => module.selectSignerCredential({
    ...base,
    evidenceReviewedAt: "2099-08-28T10:00:00+00:00",
    credentials: [credential(1, {
      approved_at: "2099-08-28T09:00:00+00:00",
    })],
  }), /reviewer_credential_invalid/);
  assert.throws(() => module.selectSignerCredential({
    ...base,
    credentials: [credential(1)],
    revocations: [revocation(1, "2099-08-28T10:30:00+00:00")],
  }), /reviewer_credential_invalid/);
});

test("credential selector falls back to an older still-valid immutable version", async function () {
  const module = await guard();
  const selected = module.selectSignerCredential({
    userId: REVIEWER_ID,
    reviewerRole: "math-reviewer",
    evidenceReviewedAt: "2026-08-28T10:00:00+00:00",
    signedAtMs: Date.parse("2026-08-28T11:00:00Z"),
    credentials: [credential(1), credential(2)],
    revocations: [revocation(2, "2026-08-28T10:30:00+00:00")],
  });
  assert.equal(selected.reviewerCredentialVersion, 1);
});
