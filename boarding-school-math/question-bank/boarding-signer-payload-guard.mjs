const ITEM_SCHEMA_VERSION = "gfield-item-bank-v1";
const ITEM_ID = /^qst-bnk-[a-z0-9]{16}$/;
const REVISION_ID = /^rev-bnk-[a-z0-9]{16}$/;
const SCORING_ID = /^scr-bnk-[a-z0-9]{16}$/;
const RUBRIC_ID = /^rub-bnk-[a-z0-9]{16}$/;
const RIGHTS_ID = /^rgt-bnk-[a-z0-9]{16}$/;
const REVIEW_ID = /^rvw-bnk-[a-z0-9]{16}$/;
const ASSET_ID = /^ast-bnk-[a-z0-9]{16}$/;
const HASH = /^[a-f0-9]{64}$/;

const VISIBILITY_CLASSES = new Set([
  "public-practice",
  "authenticated-assessment",
  "teacher-only",
]);
const RESPONSE_TYPES = new Set([
  "multiple-choice",
  "numeric",
  "short-answer",
  "constructed-response",
]);
const SCORING_MODES = new Set(["automatic", "teacher"]);
const DIFFICULTIES = new Set(["foundation", "core", "advanced"]);
const ASSESSMENT_PURPOSES = new Set([
  "unit-screener",
  "course-placement",
  "competition-benchmark",
]);
const RIGHTS_MODES = new Set([
  "owned_original",
  "permissive_reviewed",
  "private_licensed",
  "noncommercial_reference",
  "permission_required",
  "provenance_review",
]);
const RELEASEABLE_RIGHTS_MODES = new Set([
  "owned_original",
  "permissive_reviewed",
  "private_licensed",
]);
const RIGHTS_SCOPES = new Set([
  "web-public",
  "authenticated",
  "print",
  "translation",
  "derivative",
]);
const ASSET_MIME_TYPES = new Set([
  "image/svg+xml",
  "image/png",
  "image/webp",
]);
const INPUT_KIND_BY_RESPONSE = Object.freeze({
  "multiple-choice": "choice",
  numeric: "number",
  "short-answer": "text",
  "constructed-response": "workpad",
});
const MAX_ARRAY_ENTRIES = 1000;
const ERROR_TYPES = new Set([
  "prerequisite-gap",
  "concept-gap",
  "representation-error",
  "calculation-error",
  "condition-missed",
  "strategy-gap",
  "explanation-incomplete",
]);

export const REVIEWER_ROLE_BY_TYPE = Object.freeze({
  "math-correctness": "math-reviewer",
  "age-appropriateness": "curriculum-reviewer",
  "answer-uniqueness": "math-reviewer",
  "translation-ko": "translator-reviewer",
  "translation-en": "translator-reviewer",
  "translation-zh-Hans": "translator-reviewer",
  rights: "rights-reviewer",
  "asset-rights": "rights-reviewer",
  "scoring-rubric": "scoring-reviewer",
  "visual-evidence": "visual-reviewer",
  "student-payload-safety": "security-reviewer",
});

const PUBLIC_FIELDS = new Set([
  "schemaVersion",
  "itemId",
  "itemVersion",
  "publicRevisionId",
  "publicPayloadSha256",
  "visibilityClass",
  "programId",
  "targetGrade",
  "domainId",
  "clusterId",
  "skillId",
  "difficulty",
  "responseType",
  "maxPoints",
  "assessmentBinding",
  "promptBlocks",
  "options",
  "assets",
  "responseUi",
  "rightsRecordId",
]);
const PRIVATE_FIELDS = new Set([
  "schemaVersion",
  "scoringSpecId",
  "specVersion",
  "itemId",
  "itemVersion",
  "publicPayloadSha256",
  "privateSpecSha256",
  "scoringMode",
  "maxPoints",
  "answer",
  "normalizationVersion",
  "solutionRef",
  "rubricId",
  "rubricVersion",
  "rubricSha256",
  "errorSignals",
  "defaultErrorType",
  "state",
]);
const RUBRIC_FIELDS = new Set([
  "schemaVersion",
  "rubricId",
  "rubricVersion",
  "rubricSha256",
  "itemId",
  "itemVersion",
  "publicPayloadSha256",
  "privateSpecSha256",
  "maxPoints",
  "allowedPointIncrements",
  "criteria",
  "humanReviewRequired",
  "secondReviewPolicy",
  "state",
]);
const RIGHTS_FIELDS = new Set([
  "schemaVersion",
  "rightsRecordId",
  "rightsVersion",
  "rightsRecordSha256",
  "itemId",
  "itemVersion",
  "assetId",
  "mode",
  "originType",
  "authority",
  "sourceTitle",
  "sourceUrl",
  "documentRevision",
  "sourceLocator",
  "licenseId",
  "licenseUrl",
  "permissionRecordId",
  "allowedScopes",
  "translationAllowed",
  "derivativeAllowed",
  "expiresAt",
  "attribution",
  "reviewedBy",
  "reviewedAt",
  "decision",
]);
const REVIEW_FIELDS = new Set([
  "schemaVersion",
  "reviewId",
  "reviewRecordSha256",
  "type",
  "decision",
  "authorId",
  "reviewerId",
  "reviewerRole",
  "reviewedAt",
  "itemId",
  "itemVersion",
  "reviewedPublicHash",
  "reviewedPrivateHash",
  "reviewedRubricHash",
  "rightsRecordId",
  "reviewedRightsHash",
  "locale",
  "evidenceRef",
]);
const ASSESSMENT_BINDING_FIELDS = new Set([
  "blueprintId",
  "blueprintVersion",
  "blueprintContractSha256",
  "purpose",
  "slotId",
  "unitId",
  "standardRange",
]);
const RESPONSE_UI_FIELDS = new Set([
  "inputKind",
  "displayUnit",
  "inputHintByLocale",
]);
const ASSET_FIELDS = new Set([
  "assetId",
  "sha256",
  "mimeType",
  "altByLocale",
  "rightsRecordId",
]);
const CRITERION_FIELDS = new Set([
  "criterionId",
  "maxPoints",
  "levels",
  "requiredEvidence",
  "errorCodes",
]);
const LEVEL_FIELDS = new Set(["points", "observableEvidenceByLocale"]);

const FORBIDDEN_PUBLIC_KEYS = new Set([
  "answer",
  "answerkey",
  "correctanswer",
  "correctoption",
  "iscorrect",
  "solution",
  "solutionref",
  "rubric",
  "tolerance",
  "acceptedalternatives",
  "errormapping",
  "errormappings",
  "errorsignal",
  "errorsignals",
  "errortype",
  "defaulterrortype",
  "privatespec",
  "privatespecsha256",
  "scoringspec",
  "scoringspecid",
  "distractorrationale",
  "reviewernotes",
  "awardedpoints",
]);

const OBVIOUS_ANSWER_LEAK = new RegExp(
  [
    "(?:correct\\s+(?:answer|option)\\s*(?:is|[:=])\\s*(?:[A-F](?:\\b|\\.)|[-+]?\\d|[\"']))",
    "(?:answer\\s+is\\s*(?:[A-F](?:\\b|\\.)|[-+]?\\d|[\"']))",
    "(?:answers?\\s*[:：-]\\s*(?:option\\s+|choice\\s+)?[A-Z0-9])",
    "(?:answer\\s*key\\s*(?:is|[:=]))",
    "(?:solution\\s*(?:is|[:=])\\s*(?:[A-F](?:\\b|\\.)|[-+]?\\d|[\"']))",
    "(?:(?:choose|select|pick)\\s+(?:option|choice)\\s+[A-Z])",
    "(?:정답\\s*(?:은|는|[:=])\\s*(?:[A-F](?:번|\\b)|[-+]?\\d|[\"']))",
    "(?:답은\\s*(?:[A-F](?:번|\\b)|[-+]?\\d|[\"']))",
    "(?:(?:선택지|보기)\\s*[A-Z가-힣0-9]+\\s*(?:를|을)?\\s*(?:고르|선택))",
    "(?:正确答案\\s*(?:是|[:=]))",
    "(?:答案是)",
    "(?:答案\\s*[:=])",
  ].join("|"),
  "iu",
);

function fail(code) {
  throw new Error(code);
}

function normalizedKey(value) {
  return String(value).replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function record(value, code) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(code);
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) fail(code);
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.some((key) => typeof key !== "string")) fail(code);
  ownKeys.forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (
      !descriptor || !("value" in descriptor) || descriptor.enumerable !== true
    ) fail(code);
  });
  return value;
}

function array(value, code) {
  if (
    !Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype
  ) {
    fail(code);
  }
  if (
    !Number.isSafeInteger(value.length) || value.length > MAX_ARRAY_ENTRIES ||
    Reflect.ownKeys(value).some((key) => {
      if (key === "length") return false;
      if (typeof key !== "string" || !/^(?:0|[1-9]\d*)$/.test(key)) {
        return true;
      }
      const index = Number(key);
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      return !Number.isSafeInteger(index) || index >= value.length ||
        String(index) !== key || !descriptor || !("value" in descriptor) ||
        descriptor.enumerable !== true;
    })
  ) fail(code);
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) fail(code);
  }
  return value;
}

function exactFields(value, allowed, code) {
  const candidate = record(value, code);
  if (Object.keys(candidate).some((key) => !allowed.has(key))) fail(code);
  return candidate;
}

function text(value, pattern, code) {
  if (typeof value !== "string" || !value || value !== value.trim()) fail(code);
  if (pattern && !pattern.test(value)) fail(code);
  return value;
}

function positiveInteger(value, code) {
  if (!Number.isInteger(value) || value < 1) fail(code);
  return value;
}

function finiteNumber(value, minimum, maximum, code) {
  if (
    typeof value !== "number" || !Number.isFinite(value) || value < minimum ||
    value > maximum
  ) fail(code);
  return value;
}

function httpsUrl(value, code) {
  text(value, null, code);
  let parsed;
  try {
    parsed = new URL(value);
  } catch (_) {
    fail(code);
  }
  if (
    parsed.protocol !== "https:" || !parsed.hostname || parsed.username ||
    parsed.password
  ) fail(code);
  return value;
}

function strictTimestamp(value, code) {
  text(
    value,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
    code,
  );
  const parsed = new Date(value);
  const normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== normalized) {
    fail(code);
  }
  return parsed.getTime();
}

function databaseTimestamp(value, code) {
  text(value, null, code);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) fail(code);
  return parsed.getTime();
}

export function selectSignerCredential(input) {
  const candidate = record(input, "reviewer_credential_invalid");
  const userId = text(
    candidate.userId,
    null,
    "reviewer_credential_invalid",
  );
  const reviewerRole = text(
    candidate.reviewerRole,
    null,
    "reviewer_credential_invalid",
  );
  if (!Object.values(REVIEWER_ROLE_BY_TYPE).includes(reviewerRole)) {
    fail("reviewer_credential_invalid");
  }
  const evidenceReviewedAtMs = databaseTimestamp(
    candidate.evidenceReviewedAt,
    "reviewer_credential_invalid",
  );
  const signedAtMs = finiteNumber(
    candidate.signedAtMs,
    0,
    Number.MAX_SAFE_INTEGER,
    "reviewer_credential_invalid",
  );
  if (evidenceReviewedAtMs > signedAtMs) {
    fail("reviewer_credential_invalid");
  }
  const credentials = array(
    candidate.credentials,
    "reviewer_credential_invalid",
  ).map((entry) => {
    const row = record(entry, "reviewer_credential_invalid");
    const expiresAtMs = row.expires_at === null
      ? null
      : databaseTimestamp(row.expires_at, "reviewer_credential_invalid");
    return {
      userId: text(row.user_id, null, "reviewer_credential_invalid"),
      reviewerRole: text(
        row.reviewer_role,
        null,
        "reviewer_credential_invalid",
      ),
      credentialVersion: positiveInteger(
        row.credential_version,
        "reviewer_credential_invalid",
      ),
      status: text(row.status, null, "reviewer_credential_invalid"),
      approvedBy: text(row.approved_by, null, "reviewer_credential_invalid"),
      approvedAtMs: databaseTimestamp(
        row.approved_at,
        "reviewer_credential_invalid",
      ),
      expiresAtMs,
    };
  });
  const revocations = array(
    candidate.revocations,
    "reviewer_credential_invalid",
  ).map((entry) => {
    const row = record(entry, "reviewer_credential_invalid");
    return {
      userId: text(row.user_id, null, "reviewer_credential_invalid"),
      reviewerRole: text(
        row.reviewer_role,
        null,
        "reviewer_credential_invalid",
      ),
      credentialVersion: positiveInteger(
        row.credential_version,
        "reviewer_credential_invalid",
      ),
      revokedAtMs: databaseTimestamp(
        row.revoked_at,
        "reviewer_credential_invalid",
      ),
    };
  });
  const selected =
    credentials.filter((credential) =>
      credential.userId === userId &&
      credential.reviewerRole === reviewerRole &&
      credential.status === "active" &&
      credential.approvedAtMs <= evidenceReviewedAtMs &&
      credential.approvedAtMs <= signedAtMs &&
      (credential.expiresAtMs === null ||
        (credential.expiresAtMs > evidenceReviewedAtMs &&
          credential.expiresAtMs > signedAtMs)) &&
      !revocations.some((revocation) =>
        revocation.userId === credential.userId &&
        revocation.reviewerRole === credential.reviewerRole &&
        revocation.credentialVersion === credential.credentialVersion
      )
    ).sort((left, right) =>
      right.credentialVersion - left.credentialVersion
    )[0];
  if (!selected) fail("reviewer_credential_invalid");
  return Object.freeze({
    reviewerCredentialVersion: selected.credentialVersion,
    credentialApprovedBy: selected.approvedBy,
    credentialApprovedAt: new Date(selected.approvedAtMs).toISOString(),
    credentialExpiresAt: selected.expiresAtMs === null
      ? null
      : new Date(selected.expiresAtMs).toISOString(),
  });
}

function sameTimestamp(left, right, code) {
  if (strictTimestamp(left, code) !== databaseTimestamp(right, code)) {
    fail(code);
  }
}

function greatestCommonDivisor(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function canonicalNumeric(value, code) {
  text(value, null, code);
  if (/^(?:0|-?[1-9]\d*)$/.test(value)) return value;
  if (/^-?(?:0|[1-9]\d*)\.\d*[1-9]$/.test(value)) return value;
  const fraction = value.match(/^(-?[1-9]\d*)\/([1-9]\d*)$/);
  if (
    fraction && BigInt(fraction[2]) > 1n &&
    greatestCommonDivisor(BigInt(fraction[1]), BigInt(fraction[2])) === 1n
  ) return value;
  fail(code);
}

function locales(value, code, exactBilingual = false) {
  const candidate = record(value, code);
  const keys = Object.keys(candidate);
  if (
    !keys.includes("ko") || !keys.includes("en") ||
    keys.some((key) => !["ko", "en", "zh-Hans"].includes(key)) ||
    (exactBilingual && (keys.length !== 2 || keys.includes("zh-Hans")))
  ) fail(code);
  keys.forEach((key) => text(candidate[key], null, code));
  return candidate;
}

function nullableText(value, pattern, code) {
  if (value === null) return null;
  return text(value, pattern, code);
}

function assertPublicTreeSafe(value, ancestors = new Set()) {
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail("public_payload_invalid");
    return;
  }
  if (typeof value === "string") {
    if (OBVIOUS_ANSWER_LEAK.test(value)) fail("public_answer_leak_detected");
    return;
  }
  if (typeof value !== "object" || ancestors.has(value)) {
    fail("public_payload_invalid");
  }
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      array(value, "public_payload_invalid").forEach((entry) =>
        assertPublicTreeSafe(entry, ancestors)
      );
      return;
    }
    const candidate = record(value, "public_payload_invalid");
    Object.keys(candidate).forEach((key) => {
      if (FORBIDDEN_PUBLIC_KEYS.has(normalizedKey(key))) {
        fail("public_answer_leak_detected");
      }
      assertPublicTreeSafe(candidate[key], ancestors);
    });
  } finally {
    ancestors.delete(value);
  }
}

function validatePublicPayload(row, payload) {
  const item = exactFields(payload, PUBLIC_FIELDS, "public_payload_invalid");
  assertPublicTreeSafe(item);
  if (
    item.schemaVersion !== ITEM_SCHEMA_VERSION ||
    text(item.itemId, ITEM_ID, "public_payload_invalid") !== row.itemId ||
    positiveInteger(item.itemVersion, "public_payload_invalid") !==
      row.itemVersion ||
    text(item.publicRevisionId, REVISION_ID, "public_payload_invalid") === "" ||
    text(item.publicPayloadSha256, HASH, "public_payload_invalid") !==
      row.publicHash ||
    !VISIBILITY_CLASSES.has(item.visibilityClass) ||
    item.visibilityClass !== row.visibilityClass ||
    !RESPONSE_TYPES.has(item.responseType) ||
    !DIFFICULTIES.has(item.difficulty) ||
    !Number.isInteger(item.maxPoints) || item.maxPoints < 1 ||
    item.maxPoints > 4
  ) fail("public_payload_invalid");
  if (
    text(
        item.programId,
        /^[a-z0-9][a-z0-9-]{2,63}$/,
        "public_payload_invalid",
      ) !== row.programId ||
    !(
      item.targetGrade === "K" ||
      (Number.isInteger(item.targetGrade) && item.targetGrade >= 1 &&
        item.targetGrade <= 8)
    ) || String(item.targetGrade) !== row.targetGrade
  ) fail("public_payload_invalid");
  text(item.domainId, /^G(?:K|[1-8])-[A-Z]{1,4}$/, "public_payload_invalid");
  text(
    item.clusterId,
    /^(?:K|[1-8])\.[A-Z]{1,4}\.[A-Z]$/,
    "public_payload_invalid",
  );
  const clusterParts = item.clusterId.split(".");
  if (
    clusterParts[0] !== String(item.targetGrade) ||
    item.domainId !== `G${String(item.targetGrade)}-${clusterParts[1]}`
  ) fail("public_payload_invalid");
  text(
    item.skillId,
    /^[a-z0-9][a-z0-9:-]{2,127}$/,
    "public_payload_invalid",
  );
  text(item.rightsRecordId, RIGHTS_ID, "public_payload_invalid");

  if (item.visibilityClass === "authenticated-assessment") {
    const binding = exactFields(
      item.assessmentBinding,
      ASSESSMENT_BINDING_FIELDS,
      "public_payload_invalid",
    );
    text(
      binding.blueprintId,
      /^asm-bdg-[a-z0-9-]{4,64}$/,
      "public_payload_invalid",
    );
    positiveInteger(binding.blueprintVersion, "public_payload_invalid");
    text(
      binding.blueprintContractSha256,
      HASH,
      "public_payload_invalid",
    );
    if (!ASSESSMENT_PURPOSES.has(binding.purpose)) {
      fail("public_payload_invalid");
    }
    text(
      binding.slotId,
      /^slot-bdg-[a-z0-9-]{4,64}$/,
      "public_payload_invalid",
    );
    text(
      binding.unitId,
      /^[a-z0-9][a-z0-9-]{2,63}$/,
      "public_payload_invalid",
    );
    text(
      binding.standardRange,
      /^(?:K|[1-8])\.[A-Z]{1,4}\.[A-Z]\.\d+(?:-\d+)?$/,
      "public_payload_invalid",
    );
  } else if (item.assessmentBinding != null) {
    fail("public_payload_invalid");
  }

  const promptBlocks = array(item.promptBlocks, "public_payload_invalid");
  if (!promptBlocks.length) fail("public_payload_invalid");
  promptBlocks.forEach((block) => {
    const candidate = record(block, "public_payload_invalid");
    if (candidate.type === "text") {
      exactFields(
        candidate,
        new Set(["type", "valueByLocale"]),
        "public_payload_invalid",
      );
      locales(candidate.valueByLocale, "public_payload_invalid");
    } else if (candidate.type === "math") {
      exactFields(
        candidate,
        new Set(["type", "latex"]),
        "public_payload_invalid",
      );
      text(candidate.latex, null, "public_payload_invalid");
    } else if (candidate.type === "diagram") {
      exactFields(
        candidate,
        new Set(["type", "assetId"]),
        "public_payload_invalid",
      );
      text(candidate.assetId, ASSET_ID, "public_payload_invalid");
    } else {
      fail("public_payload_invalid");
    }
  });

  const options = array(item.options, "public_payload_invalid");
  options.forEach((option) => {
    const candidate = exactFields(
      option,
      new Set(["optionId", "labelByLocale"]),
      "public_payload_invalid",
    );
    text(candidate.optionId, /^[A-Z][A-Z0-9]{0,7}$/, "public_payload_invalid");
    locales(candidate.labelByLocale, "public_payload_invalid");
  });
  if (
    new Set(options.map((option) => option.optionId)).size !== options.length
  ) fail("public_payload_invalid");
  ["ko", "en"].forEach((locale) => {
    const labels = options.map((option) =>
      option.labelByLocale[locale].normalize("NFKC").replace(/\s+/g, " ").trim()
    );
    if (new Set(labels).size !== labels.length) fail("public_payload_invalid");
  });
  if (
    (item.responseType === "multiple-choice" &&
      (options.length < 2 || options.length > 6)) ||
    (item.responseType !== "multiple-choice" && options.length !== 0)
  ) fail("public_payload_invalid");

  const assets = array(item.assets, "public_payload_invalid");
  assets.forEach((asset) => {
    const candidate = exactFields(
      asset,
      ASSET_FIELDS,
      "public_payload_invalid",
    );
    text(candidate.assetId, ASSET_ID, "public_payload_invalid");
    text(candidate.rightsRecordId, RIGHTS_ID, "public_payload_invalid");
    text(candidate.sha256, HASH, "public_payload_invalid");
    if (!ASSET_MIME_TYPES.has(candidate.mimeType)) {
      fail("public_payload_invalid");
    }
    locales(candidate.altByLocale, "public_payload_invalid");
  });
  const assetIds = assets.map((asset) => asset.assetId);
  if (new Set(assetIds).size !== assetIds.length) {
    fail("public_payload_invalid");
  }
  const diagramIds = promptBlocks.filter((block) => block.type === "diagram")
    .map((block) => block.assetId);
  if (
    diagramIds.some((assetId) => !assetIds.includes(assetId)) ||
    assetIds.some((assetId) => !diagramIds.includes(assetId))
  ) fail("public_payload_invalid");

  const responseUi = exactFields(
    item.responseUi,
    RESPONSE_UI_FIELDS,
    "public_payload_invalid",
  );
  if (responseUi.inputKind !== INPUT_KIND_BY_RESPONSE[item.responseType]) {
    fail("public_payload_invalid");
  }
  nullableText(responseUi.displayUnit, null, "public_payload_invalid");
  if (responseUi.inputHintByLocale !== null) {
    locales(responseUi.inputHintByLocale, "public_payload_invalid");
  }
  return item;
}

function validatePrivatePayload(row, publicItem, payload, rubricPayload) {
  const spec = exactFields(payload, PRIVATE_FIELDS, "private_payload_invalid");
  if (
    spec.schemaVersion !== ITEM_SCHEMA_VERSION ||
    text(spec.scoringSpecId, SCORING_ID, "private_payload_invalid") === "" ||
    positiveInteger(spec.specVersion, "private_payload_invalid") < 1 ||
    spec.itemId !== row.itemId || spec.itemVersion !== row.itemVersion ||
    spec.publicPayloadSha256 !== row.publicHash ||
    text(spec.privateSpecSha256, HASH, "private_payload_invalid") !==
      row.privateHash ||
    !SCORING_MODES.has(spec.scoringMode) ||
    spec.maxPoints !== publicItem.maxPoints || spec.state !== "in-review"
  ) fail("private_payload_invalid");
  text(spec.solutionRef, null, "private_payload_invalid");
  if (
    publicItem.responseType === "constructed-response" &&
    spec.scoringMode !== "teacher"
  ) {
    fail("private_payload_invalid");
  }
  let automaticAnswer = null;
  if (spec.scoringMode === "automatic") {
    const answer = exactFields(
      spec.answer,
      new Set([
        "kind",
        "value",
        "acceptedAlternatives",
        "tolerance",
        "unitRule",
      ]),
      "private_payload_invalid",
    );
    if (!new Set(["option-id", "numeric-exact"]).has(answer.kind)) {
      fail("private_payload_invalid");
    }
    text(answer.value, null, "private_payload_invalid");
    const alternatives = array(
      answer.acceptedAlternatives,
      "private_payload_invalid",
    );
    alternatives.forEach((entry) =>
      text(entry, null, "private_payload_invalid")
    );
    text(spec.normalizationVersion, null, "private_payload_invalid");
    if (answer.kind === "option-id") {
      if (
        publicItem.responseType !== "multiple-choice" ||
        !publicItem.options.some((option) =>
          option.optionId === answer.value
        ) ||
        alternatives.length || answer.tolerance !== null ||
        answer.unitRule !== null
      ) fail("private_payload_invalid");
    } else if (
      publicItem.responseType !== "numeric" || alternatives.length ||
      answer.tolerance !== null
    ) {
      fail("private_payload_invalid");
    } else {
      canonicalNumeric(answer.value, "private_payload_invalid");
      nullableText(answer.unitRule, null, "private_payload_invalid");
    }
    if (
      rubricPayload !== null || spec.rubricId != null ||
      spec.rubricVersion != null || spec.rubricSha256 != null
    ) fail("private_payload_invalid");
    automaticAnswer = answer;
  } else {
    if (
      spec.answer != null || spec.normalizationVersion != null ||
      rubricPayload === null
    ) fail("private_payload_invalid");
    text(spec.rubricId, RUBRIC_ID, "private_payload_invalid");
    positiveInteger(spec.rubricVersion, "private_payload_invalid");
    text(spec.rubricSha256, HASH, "private_payload_invalid");
  }

  if (!ERROR_TYPES.has(spec.defaultErrorType)) fail("private_payload_invalid");
  const codes = new Set();
  const observedValues = new Set();
  const signalTypes = new Set();
  const signals = array(spec.errorSignals, "private_payload_invalid");
  if (!signals.length) fail("private_payload_invalid");
  signals.forEach((signal) => {
    const entry = exactFields(
      signal,
      new Set([
        "code",
        "observedValue",
        "errorType",
        "rationaleByLocale",
      ]),
      "private_payload_invalid",
    );
    text(entry.code, /^[a-z][a-z0-9-]{1,63}$/, "private_payload_invalid");
    text(entry.observedValue, null, "private_payload_invalid");
    if (
      !ERROR_TYPES.has(entry.errorType) || codes.has(entry.code) ||
      observedValues.has(entry.observedValue)
    ) fail("private_payload_invalid");
    codes.add(entry.code);
    observedValues.add(entry.observedValue);
    signalTypes.add(entry.errorType);
    locales(entry.rationaleByLocale, "private_payload_invalid", true);
  });
  if (!signalTypes.has(spec.defaultErrorType)) fail("private_payload_invalid");
  if (automaticAnswer?.kind === "option-id") {
    const expected = publicItem.options.filter((option) =>
      option.optionId !== automaticAnswer.value
    ).map((option) => option.optionId).sort();
    const observed = signals.map((signal) => signal.observedValue).sort();
    if (
      expected.length !== observed.length ||
      !expected.every((optionId, index) => optionId === observed[index])
    ) fail("private_payload_invalid");
  }
  return spec;
}

function validateRubricPayload(row, publicItem, privateSpec, payload) {
  if (privateSpec.scoringMode === "automatic") {
    if (payload !== null || row.rubricHash !== null) {
      fail("rubric_payload_invalid");
    }
    return null;
  }
  const rubric = exactFields(payload, RUBRIC_FIELDS, "rubric_payload_invalid");
  if (
    rubric.schemaVersion !== ITEM_SCHEMA_VERSION ||
    rubric.rubricId !== privateSpec.rubricId ||
    rubric.rubricVersion !== privateSpec.rubricVersion ||
    rubric.rubricSha256 !== row.rubricHash ||
    rubric.rubricSha256 !== privateSpec.rubricSha256 ||
    rubric.itemId !== row.itemId || rubric.itemVersion !== row.itemVersion ||
    rubric.publicPayloadSha256 !== row.publicHash ||
    rubric.privateSpecSha256 !== row.privateHash ||
    rubric.maxPoints !== publicItem.maxPoints ||
    rubric.humanReviewRequired !== true ||
    rubric.secondReviewPolicy !== "boundary-and-high-stakes-required" ||
    rubric.state !== "in-review"
  ) fail("rubric_payload_invalid");
  const increments = array(
    rubric.allowedPointIncrements,
    "rubric_payload_invalid",
  );
  if (!increments.length) fail("rubric_payload_invalid");
  increments.forEach((points) =>
    finiteNumber(points, 0, rubric.maxPoints, "rubric_payload_invalid")
  );
  if (
    !increments.includes(0) || !increments.includes(rubric.maxPoints) ||
    new Set(increments).size !== increments.length
  ) fail("rubric_payload_invalid");

  const criteria = array(rubric.criteria, "rubric_payload_invalid");
  if (!criteria.length) fail("rubric_payload_invalid");
  const rubricErrorTypes = new Set();
  criteria.forEach((criterion) => {
    const entry = exactFields(
      criterion,
      CRITERION_FIELDS,
      "rubric_payload_invalid",
    );
    text(
      entry.criterionId,
      /^[a-z][a-z0-9-]{1,31}$/,
      "rubric_payload_invalid",
    );
    finiteNumber(
      entry.maxPoints,
      Number.MIN_VALUE,
      rubric.maxPoints,
      "rubric_payload_invalid",
    );
    const levels = array(entry.levels, "rubric_payload_invalid");
    if (levels.length < 2) fail("rubric_payload_invalid");
    levels.forEach((level) => {
      const levelEntry = exactFields(
        level,
        LEVEL_FIELDS,
        "rubric_payload_invalid",
      );
      if (
        !increments.includes(levelEntry.points) ||
        levelEntry.points > entry.maxPoints
      ) fail("rubric_payload_invalid");
      locales(levelEntry.observableEvidenceByLocale, "rubric_payload_invalid");
    });
    const levelPoints = levels.map((level) => level.points);
    if (
      new Set(levelPoints).size !== levelPoints.length ||
      !levelPoints.includes(0) || !levelPoints.includes(entry.maxPoints)
    ) fail("rubric_payload_invalid");
    const requiredEvidence = array(
      entry.requiredEvidence,
      "rubric_payload_invalid",
    );
    if (!requiredEvidence.length) fail("rubric_payload_invalid");
    requiredEvidence.forEach((evidence) =>
      text(evidence, null, "rubric_payload_invalid")
    );
    const errorCodes = array(entry.errorCodes, "rubric_payload_invalid");
    if (!errorCodes.length) fail("rubric_payload_invalid");
    errorCodes.forEach((errorType) => {
      if (!ERROR_TYPES.has(errorType)) fail("rubric_payload_invalid");
      rubricErrorTypes.add(errorType);
    });
  });
  if (
    new Set(criteria.map((criterion) => criterion.criterionId)).size !==
      criteria.length ||
    criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0) !==
      rubric.maxPoints
  ) fail("rubric_payload_invalid");
  const signalTypes = new Set(
    privateSpec.errorSignals.map((signal) => signal.errorType),
  );
  if (
    signalTypes.size !== rubricErrorTypes.size ||
    [...signalTypes].some((errorType) => !rubricErrorTypes.has(errorType))
  ) fail("rubric_payload_invalid");
  return rubric;
}

export function validateSignerItemPayloads(input) {
  const candidate = record(input, "signer_guard_input_invalid");
  const row = record(candidate.row, "signer_guard_input_invalid");
  const normalizedRow = {
    itemId: text(row.itemId, ITEM_ID, "signer_guard_input_invalid"),
    itemVersion: positiveInteger(row.itemVersion, "signer_guard_input_invalid"),
    programId: text(
      row.programId,
      /^[a-z0-9][a-z0-9-]{2,63}$/,
      "signer_guard_input_invalid",
    ),
    targetGrade: text(
      row.targetGrade,
      /^(?:K|[1-8])$/,
      "signer_guard_input_invalid",
    ),
    visibilityClass: text(
      row.visibilityClass,
      null,
      "signer_guard_input_invalid",
    ),
    publicHash: text(row.publicHash, HASH, "signer_guard_input_invalid"),
    privateHash: text(row.privateHash, HASH, "signer_guard_input_invalid"),
    rubricHash: row.rubricHash === null
      ? null
      : text(row.rubricHash, HASH, "signer_guard_input_invalid"),
  };
  const publicItem = validatePublicPayload(
    normalizedRow,
    candidate.publicPayload,
  );
  const privateSpec = validatePrivatePayload(
    normalizedRow,
    publicItem,
    candidate.privatePayload,
    candidate.rubricPayload,
  );
  const rubric = validateRubricPayload(
    normalizedRow,
    publicItem,
    privateSpec,
    candidate.rubricPayload,
  );
  if (publicItem.assets.length > 0) {
    fail("asset_bytes_verification_unavailable");
  }
  return Object.freeze({ publicItem, privateSpec, rubric });
}

export function validateSignerRightsPayload(input) {
  const candidate = record(input, "rights_payload_invalid");
  const row = record(candidate.row, "rights_payload_invalid");
  const payload = exactFields(
    candidate.payload,
    RIGHTS_FIELDS,
    "rights_payload_invalid",
  );
  const expectedAssetId = candidate.assetKey === "__item__"
    ? null
    : text(candidate.assetKey, ASSET_ID, "rights_payload_invalid");
  const expectedRightsId = candidate.expectedRightsRecordId;
  const visibilityClass = text(
    candidate.visibilityClass,
    null,
    "rights_payload_invalid",
  );
  if (!VISIBILITY_CLASSES.has(visibilityClass)) fail("rights_payload_invalid");
  const trustedNowMs = finiteNumber(
    candidate.trustedNowMs,
    0,
    Number.MAX_SAFE_INTEGER,
    "rights_payload_invalid",
  );
  if (
    row.decision !== "approved" || payload.decision !== "approved" ||
    payload.schemaVersion !== ITEM_SCHEMA_VERSION ||
    payload.rightsRecordId !== row.rightsRecordId ||
    payload.rightsRecordId !== expectedRightsId ||
    payload.rightsVersion !== row.rightsVersion ||
    payload.itemId !== candidate.itemId || payload.itemId !== row.itemId ||
    payload.itemVersion !== candidate.itemVersion ||
    payload.itemVersion !== row.itemVersion ||
    payload.assetId !== expectedAssetId || row.assetId !== expectedAssetId ||
    payload.rightsRecordSha256 !== row.rightsHash ||
    payload.reviewedBy !== row.reviewedBy
  ) fail("rights_payload_invalid");
  text(payload.rightsRecordId, RIGHTS_ID, "rights_payload_invalid");
  positiveInteger(payload.rightsVersion, "rights_payload_invalid");
  text(payload.rightsRecordSha256, HASH, "rights_payload_invalid");
  if (
    !RIGHTS_MODES.has(payload.mode) ||
    !RELEASEABLE_RIGHTS_MODES.has(payload.mode)
  ) fail("rights_payload_invalid");
  text(payload.originType, null, "rights_payload_invalid");
  text(payload.authority, null, "rights_payload_invalid");
  text(payload.sourceTitle, null, "rights_payload_invalid");
  text(payload.documentRevision, null, "rights_payload_invalid");
  text(payload.sourceLocator, null, "rights_payload_invalid");
  text(payload.reviewedBy, null, "rights_payload_invalid");
  sameTimestamp(payload.reviewedAt, row.reviewedAt, "rights_payload_invalid");
  if (payload.sourceUrl !== null) {
    httpsUrl(payload.sourceUrl, "rights_payload_invalid");
  }
  nullableText(payload.licenseId, null, "rights_payload_invalid");
  if (payload.licenseUrl !== null) {
    httpsUrl(payload.licenseUrl, "rights_payload_invalid");
  }
  nullableText(payload.permissionRecordId, null, "rights_payload_invalid");
  nullableText(payload.attribution, null, "rights_payload_invalid");
  const scopes = array(payload.allowedScopes, "rights_payload_invalid");
  if (
    !scopes.length || new Set(scopes).size !== scopes.length ||
    scopes.some((scope) => !RIGHTS_SCOPES.has(scope)) ||
    typeof payload.translationAllowed !== "boolean" ||
    typeof payload.derivativeAllowed !== "boolean"
  ) fail("rights_payload_invalid");
  if (
    payload.mode === "permissive_reviewed" &&
    (!payload.licenseId || !payload.licenseUrl)
  ) fail("rights_payload_invalid");
  if (
    payload.mode === "private_licensed" && !payload.permissionRecordId &&
    (!payload.licenseId || !payload.licenseUrl)
  ) fail("rights_payload_invalid");
  if (
    visibilityClass === "public-practice" &&
    !new Set(["owned_original", "permissive_reviewed"]).has(payload.mode)
  ) fail("rights_payload_invalid");
  const requiredScope = visibilityClass === "public-practice"
    ? "web-public"
    : "authenticated";
  if (
    !scopes.includes(requiredScope) || !payload.translationAllowed ||
    !scopes.includes("translation") ||
    (payload.originType !== "gfield-authored" &&
      (!payload.derivativeAllowed || !scopes.includes("derivative")))
  ) fail("rights_payload_invalid");
  if ((payload.expiresAt === null) !== (row.expiresAt === null)) {
    fail("rights_payload_invalid");
  }
  if (payload.expiresAt !== null) {
    sameTimestamp(payload.expiresAt, row.expiresAt, "rights_payload_invalid");
    const expiryMs = strictTimestamp(
      payload.expiresAt,
      "rights_payload_invalid",
    );
    if (
      expiryMs <= trustedNowMs ||
      expiryMs <= strictTimestamp(payload.reviewedAt, "rights_payload_invalid")
    ) fail("rights_payload_invalid");
  }
  return payload;
}

export function validateSignerReviewPayload(input) {
  const candidate = record(input, "review_payload_invalid");
  const row = record(candidate.row, "review_payload_invalid");
  const payload = exactFields(
    candidate.payload,
    REVIEW_FIELDS,
    "review_payload_invalid",
  );
  const expectedRole = REVIEWER_ROLE_BY_TYPE[row.reviewType];
  if (
    !expectedRole || row.decision !== "approved" ||
    payload.schemaVersion !== ITEM_SCHEMA_VERSION ||
    payload.reviewId !== row.reviewId || payload.type !== row.reviewType ||
    payload.decision !== "approved" ||
    payload.reviewerId !== row.reviewerUserId ||
    payload.reviewerRole !== expectedRole ||
    payload.authorId !== candidate.authorUserId ||
    payload.itemId !== candidate.itemId || payload.itemId !== row.itemId ||
    payload.itemVersion !== candidate.itemVersion ||
    payload.itemVersion !== row.itemVersion ||
    payload.reviewRecordSha256 !== row.reviewHash ||
    payload.authorId === payload.reviewerId
  ) fail("review_payload_invalid");
  text(payload.reviewId, REVIEW_ID, "review_payload_invalid");
  text(payload.authorId, null, "review_payload_invalid");
  text(payload.reviewerId, null, "review_payload_invalid");
  text(payload.reviewerRole, null, "review_payload_invalid");
  text(payload.evidenceRef, null, "review_payload_invalid");
  text(payload.reviewRecordSha256, HASH, "review_payload_invalid");
  text(payload.reviewedPublicHash, HASH, "review_payload_invalid");
  nullableText(payload.reviewedPrivateHash, HASH, "review_payload_invalid");
  nullableText(payload.reviewedRubricHash, HASH, "review_payload_invalid");
  nullableText(payload.rightsRecordId, RIGHTS_ID, "review_payload_invalid");
  nullableText(payload.reviewedRightsHash, HASH, "review_payload_invalid");
  sameTimestamp(payload.reviewedAt, row.reviewedAt, "review_payload_invalid");
  if (payload.type.startsWith("translation-")) {
    if (payload.locale !== payload.type.slice("translation-".length)) {
      fail("review_payload_invalid");
    }
  } else if (payload.locale !== null) {
    fail("review_payload_invalid");
  }
  if (new Set(["rights", "asset-rights"]).has(payload.type)) {
    if (
      payload.rightsRecordId === null || payload.reviewedRightsHash === null
    ) {
      fail("review_payload_invalid");
    }
  } else if (
    payload.rightsRecordId !== null || payload.reviewedRightsHash !== null
  ) fail("review_payload_invalid");
  if (
    payload.type !== "scoring-rubric" && payload.reviewedRubricHash !== null
  ) fail("review_payload_invalid");
  return payload;
}
