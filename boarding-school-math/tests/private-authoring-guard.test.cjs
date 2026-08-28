const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const test = require("node:test");
const placement = require("../assessment/grade6-placement-plan.js");
const releaseContract = require("../question-bank/item-release-contract.js");
const privateAuthoring = require("../scripts/validate-private-grade6-authoring.cjs");
const privatePreview = require("../scripts/render-private-grade6-assessment-preview.cjs");

const projectRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(projectRoot, "..");

test("private authoring stays ignored, untracked, and backed by a local preflight", function () {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  const ignoreRules = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8");
  const publicAudit = fs.readFileSync(path.join(projectRoot, "scripts", "audit-public-exposure.cjs"), "utf8");

  assert.match(ignoreRules, /^private-authoring\/\s*$/m);
  assert.equal(packageJson.scripts["validate:private-grade6"], "node scripts/validate-private-grade6-authoring.cjs private-authoring");
  assert.equal(fs.existsSync(path.join(projectRoot, "scripts", "validate-private-grade6-authoring.cjs")), true);
  assert.match(publicAudit, /PRIVATE_AUTHORING_TRACKED/);

  const tracked = execFileSync(
    "git",
    ["ls-files", "-z", "--", "boarding-school-math/private-authoring"],
    { cwd: repositoryRoot, encoding: "utf8" }
  );
  assert.equal(tracked, "");
});

test("private authoring synthesizes the exact authenticated assessment binding", function () {
  const slot = placement.plan.slots[0];
  const item = {
    slotId: slot.slotId,
    itemId: "qst-bnk-0000000000000001",
    clusterId: slot.clusterId,
    domainId: slot.domainId,
    skillId: slot.skillId,
    difficulty: slot.difficulty,
    responseType: slot.responseType,
    publicDraft: {
      promptBlocks: [{ type: "text", valueByLocale: { ko: "두 양의 정수의 비를 고르세요.", en: "Choose the ratio of two positive integers." } }],
      options: [
        { optionId: "A", labelByLocale: { ko: "2:3", en: "2:3" } },
        { optionId: "B", labelByLocale: { ko: "3:2", en: "3:2" } }
      ],
      assets: [],
      responseUi: { inputKind: "choice" }
    }
  };
  const publicItem = privateAuthoring.syntheticPublicItem(item, slot);

  assert.deepEqual(publicItem.assessmentBinding, {
    blueprintId: placement.plan.id,
    blueprintVersion: placement.plan.blueprintVersion,
    blueprintContractSha256: placement.plan.blueprintContractSha256,
    purpose: placement.plan.purpose,
    slotId: slot.slotId,
    unitId: slot.unitId,
    standardRange: slot.standardRange
  });
  assert.equal(releaseContract.validatePublicItem(publicItem), true);
});

test("private authoring binds safe local diagram bytes to authenticated asset metadata", function () {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-grade6-asset-"));
  const assetDirectory = path.join(directory, "assets");
  fs.mkdirSync(assetDirectory);
  const assetId = "ast-bnk-0000000000000001";
  const sourcePath = `assets/${assetId}.svg`;
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect x="10" y="10" width="100" height="60" fill="none" stroke="#111827"/></svg>', "utf8");
  fs.writeFileSync(path.join(directory, ...sourcePath.split("/")), svg);
  const rightsDraft = {
    mode: "owned_original",
    originType: "gfield-authored",
    authority: "GFIELD",
    translationAllowed: true,
    derivativeAllowed: true,
    decision: "pending-independent-review",
    externalSourceUsed: false,
    contestWordingUsed: false,
    allowedScopes: ["authenticated", "print", "translation", "derivative"]
  };
  const item = {
    publicDraft: {
      assets: [{
        assetId,
        sha256: crypto.createHash("sha256").update(svg).digest("hex"),
        mimeType: "image/svg+xml",
        altByLocale: { ko: "치수가 표시된 직사각형", en: "A rectangle with visible dimensions" },
        rightsRecordId: "rgt-bnk-0000000000000001"
      }]
    },
    assetDrafts: [{ assetId, sourcePath, rightsDraft }]
  };

  try {
    assert.deepEqual(privateAuthoring.validateAssetDrafts(item, directory, "fixture"), [sourcePath]);
    item.publicDraft.assets[0].sha256 = "0".repeat(64);
    assert.throws(
      function () { privateAuthoring.validateAssetDrafts(item, directory, "fixture"); },
      function (error) { return error && error.code === "ASSET_HASH_MISMATCH"; }
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("private authoring requires unique individual standards inside the slot range", function () {
  const slot = placement.plan.slots.find(function (candidate) { return candidate.clusterId === "6.RP.A"; });
  const base = { standardIds: ["6.RP.A.1", "6.RP.A.3a"] };

  assert.doesNotThrow(function () { privateAuthoring.validateStandardIds(base, slot, "fixture"); });
  assert.throws(
    function () { privateAuthoring.validateStandardIds({ standardIds: ["6.NS.A.1"] }, slot, "fixture"); },
    function (error) { return error && error.code === "STANDARD_ID_LINEAGE_MISMATCH"; }
  );
  assert.throws(
    function () { privateAuthoring.validateStandardIds({ standardIds: ["6.RP.A.4"] }, slot, "fixture"); },
    function (error) { return error && error.code === "STANDARD_ID_OUTSIDE_SLOT_RANGE"; }
  );
  assert.throws(
    function () { privateAuthoring.validateStandardIds({ standardIds: ["6.RP.A.1", "6.RP.A.1"] }, slot, "fixture"); },
    function (error) { return error && error.code === "STANDARD_IDS_DUPLICATE"; }
  );
});

test("private authoring requires two author methods and exhaustive MC uniqueness before independent review", function () {
  const item = {
    responseType: "multiple-choice",
    publicDraft: { options: [{ optionId: "A" }, { optionId: "B" }, { optionId: "C" }] },
    verification: {
      state: "author-verified-pending-independent-review",
      reviewPending: true,
      methods: [
        { methodId: "direct-calculation", evidenceByLocale: { ko: "직접 계산으로 값을 확인했다.", en: "The value was checked by direct calculation." } },
        { methodId: "inverse-check", evidenceByLocale: { ko: "역연산으로 결과를 다시 확인했다.", en: "The result was checked again with the inverse operation." } }
      ],
      candidateCheck: { kind: "finite-enumeration", totalCandidates: 3, validAnswerCount: 1 }
    }
  };

  assert.doesNotThrow(function () { privateAuthoring.validateVerification(item, "fixture"); });
  item.verification.methods[1].methodId = "direct-calculation";
  assert.throws(
    function () { privateAuthoring.validateVerification(item, "fixture"); },
    function (error) { return error && error.code === "AUTHOR_VERIFICATION_METHODS_NOT_INDEPENDENT"; }
  );
  item.verification.methods[1].methodId = "inverse-check";
  item.verification.candidateCheck.validAnswerCount = 2;
  assert.throws(
    function () { privateAuthoring.validateVerification(item, "fixture"); },
    function (error) { return error && error.code === "CANDIDATE_CHECK_NOT_UNIQUE"; }
  );
});

test("private authoring maps detailed error signals to the shared report taxonomy", function () {
  const signal = {
    code: "ratio-order-reversed",
    observedValue: "3:2",
    errorType: "representation-error",
    rationaleByLocale: {
      ko: "요구된 비의 순서를 반대로 기록했다.",
      en: "The requested ratio was written in the reverse order."
    }
  };
  const item = {
    responseType: "numeric",
    publicDraft: { options: [] },
    privateDraft: {
      solutionByLocale: { ko: "두 항을 같은 수로 나눈다.", en: "Divide both terms by the same number." },
      uniquenessProofByLocale: { ko: "정확한 값은 하나이다.", en: "There is one exact value." },
      difficultyRationaleByLocale: { ko: "한 단계 비 계산이다.", en: "This is a one-step ratio calculation." },
      errorSignals: [signal],
      defaultErrorType: "concept-gap"
    },
    verification: {
      state: "author-verified-pending-independent-review",
      reviewPending: true,
      methods: [
        { methodId: "ratio-reduction", evidenceByLocale: { ko: "최대공약수로 약분했다.", en: "The ratio was reduced by its greatest common factor." } },
        { methodId: "cross-product", evidenceByLocale: { ko: "교차곱으로 확인했다.", en: "The result was checked with cross products." } }
      ]
    }
  };

  assert.doesNotThrow(function () { privateAuthoring.validateVerification(item, "fixture"); });
  assert.doesNotThrow(function () { privateAuthoring.validateErrorSignal(signal, "fixture"); });
  signal.errorType = "ratio-error";
  assert.throws(
    function () { privateAuthoring.validateErrorSignal(signal, "fixture"); },
    function (error) { return error && error.code === "ERROR_SIGNAL_TYPE_INVALID"; }
  );
});

test("private authoring source enforces exhaustive MC error mapping and teacher taxonomy alignment", function () {
  const source = fs.readFileSync(path.join(projectRoot, "scripts", "validate-private-grade6-authoring.cjs"), "utf8");
  assert.match(source, /MC_ERROR_SIGNAL_COVERAGE_INVALID/);
  assert.match(source, /TEACHER_ERROR_TAXONOMY_MISMATCH/);
  assert.match(source, /ERROR_SIGNAL_OBSERVED_VALUE_DUPLICATE/);
});

test("private authoring blocks drafts without an explicit reviewed fallback taxonomy", function () {
  const signal = {
    code: "ratio-order-reversed",
    observedValue: "3:2",
    errorType: "representation-error",
    rationaleByLocale: { ko: "비의 순서를 반대로 썼습니다.", en: "The ratio order was reversed." }
  };
  const item = {
    privateDraft: {
      solutionByLocale: { ko: "비를 순서대로 씁니다.", en: "Write the ratio in the requested order." },
      uniquenessProofByLocale: { ko: "정확한 비는 하나입니다.", en: "There is one exact ratio." },
      difficultyRationaleByLocale: { ko: "한 단계 비 표현입니다.", en: "This is a one-step ratio representation." },
      errorSignals: [signal]
    },
    responseType: "numeric",
    publicDraft: { options: [] },
    verification: {
      state: "author-verified-pending-independent-review", reviewPending: true,
      methods: [
        { methodId: "direct-check", evidenceByLocale: { ko: "직접 확인했습니다.", en: "Checked directly." } },
        { methodId: "inverse-check", evidenceByLocale: { ko: "역으로 확인했습니다.", en: "Checked inversely." } }
      ]
    }
  };
  assert.throws(
    function () { privateAuthoring.validateEvidenceDraft(item, "fixture"); },
    function (error) { return error && error.code === "DEFAULT_ERROR_TYPE_MISSING"; }
  );
  item.privateDraft.defaultErrorType = "other";
  assert.throws(
    function () { privateAuthoring.validateEvidenceDraft(item, "fixture"); },
    function (error) { return error && error.code === "DEFAULT_ERROR_TYPE_INVALID"; }
  );
  item.privateDraft.defaultErrorType = "strategy-gap";
  assert.throws(
    function () { privateAuthoring.validateEvidenceDraft(item, "fixture"); },
    function (error) { return error && error.code === "DEFAULT_ERROR_TYPE_NOT_REVIEWED"; }
  );
});

test("student QA preview renders 42 public projections without private scoring fields", function () {
  const fixture = Array.from({ length: 42 }, function (_, index) {
    return {
      slotId: `slot-bdg-g6-rp-a-${String(index + 1).padStart(2, "0")}`,
      itemId: `qst-bnk-${String(index + 1).padStart(16, "0")}`,
      domainId: "G6-RP",
      clusterId: "6.RP.A",
      standardIds: ["6.RP.A.1"],
      difficulty: "foundation",
      responseType: "multiple-choice",
      promptBlocks: [{ type: "text", valueByLocale: { ko: `비를 고르세요 ${index + 1}.`, en: `Choose the ratio ${index + 1}.` } }],
      options: [
        { optionId: "A", labelByLocale: { ko: "2:3", en: "2:3" } },
        { optionId: "B", labelByLocale: { ko: "3:2", en: "3:2" } }
      ],
      assets: [],
      responseUi: { inputKind: "choice" }
    };
  });
  const html = privatePreview.renderPreview(fixture);
  assert.match(html, /Private review · 42 items/);
  assert.match(html, /data-item="42"/);
  assert.match(html, /@media\(max-width:600px\)/);
  assert.doesNotMatch(html, /privateDraft|solutionByLocale|expectedResponseByLocale|rubricDraft|scoringSpec/i);
});
