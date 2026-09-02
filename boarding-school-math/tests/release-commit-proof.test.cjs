const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const moduleUrl = pathToFileURL(path.join(
  __dirname,
  "..",
  "question-bank",
  "release-commit-proof.mjs",
)).href;

async function proofModule() {
  return import(moduleUrl);
}

const TEST_HMAC_KEY = "gfield-release-proof-test-key-0123456789abcdef";
const GOLDEN_INPUT = Object.freeze({
  manifestSha256: "a".repeat(64),
  signatureBase64url: "A".repeat(86),
  signingKeyId: "gfield-boarding-ed25519-v1",
  signedBy: "123e4567-e89b-42d3-a456-426614174000",
  signedAt: "2026-08-28T12:34:56.789Z",
  manifestCanonicalJson: '{"itemId":"qst-bnk-g6rp01draft001","label":"수학 π"}',
});
const GOLDEN_MATERIAL = `64:${"a".repeat(64)}` +
  `86:${"A".repeat(86)}` +
  "26:gfield-boarding-ed25519-v1" +
  "36:123e4567-e89b-42d3-a456-426614174000" +
  "24:2026-08-28T12:34:56.789Z" +
  '55:{"itemId":"qst-bnk-g6rp01draft001","label":"수학 π"}';
const GOLDEN_PROOF = "6SY-ZRFr3HOISOUegXnre5_DoiFgr6lpHvAb1kUYSw8";

test("commit proof material follows the fixed length-prefixed field order", async function () {
  const module = await proofModule();
  assert.deepEqual([...module.RELEASE_COMMIT_PROOF_FIELDS], [
    "manifestSha256",
    "signatureBase64url",
    "signingKeyId",
    "signedBy",
    "signedAt",
    "manifestCanonicalJson",
  ]);
  assert.equal(
    module.releaseCommitProofMaterial(GOLDEN_INPUT),
    GOLDEN_MATERIAL,
  );
  assert.equal(module.RELEASE_COMMIT_PROOF_SECRET_MIN_LENGTH, 32);
});

test("WebCrypto HMAC matches an independent Node crypto golden vector", async function () {
  const module = await proofModule();
  const independentlyComputed = crypto
    .createHmac("sha256", TEST_HMAC_KEY)
    .update(GOLDEN_MATERIAL, "utf8")
    .digest("base64url");
  assert.equal(independentlyComputed, GOLDEN_PROOF);
  assert.equal(
    await module.createReleaseCommitProofBase64url(
      GOLDEN_INPUT,
      TEST_HMAC_KEY,
    ),
    GOLDEN_PROOF,
  );
  assert.match(GOLDEN_PROOF, /^[A-Za-z0-9_-]{43}$/);
  assert.doesNotMatch(GOLDEN_PROOF, /=/);
});

test("input key order cannot change the commit proof material", async function () {
  const module = await proofModule();
  const reordered = {
    signedAt: GOLDEN_INPUT.signedAt,
    signedBy: GOLDEN_INPUT.signedBy,
    signingKeyId: GOLDEN_INPUT.signingKeyId,
    signatureBase64url: GOLDEN_INPUT.signatureBase64url,
    manifestSha256: GOLDEN_INPUT.manifestSha256,
    manifestCanonicalJson: GOLDEN_INPUT.manifestCanonicalJson,
  };
  assert.equal(module.releaseCommitProofMaterial(reordered), GOLDEN_MATERIAL);
});

test("commit proof binds the exact canonical manifest JSON against replay", async function () {
  const module = await proofModule();
  const alteredManifest = {
    ...GOLDEN_INPUT,
    manifestCanonicalJson:
      '{"itemId":"qst-bnk-g6rp01draft001","label":"수학 e"}',
  };
  assert.notEqual(
    module.releaseCommitProofMaterial(alteredManifest),
    GOLDEN_MATERIAL,
  );
  assert.notEqual(
    await module.createReleaseCommitProofBase64url(
      alteredManifest,
      TEST_HMAC_KEY,
    ),
    GOLDEN_PROOF,
  );
});

test("hash, signature, key id, signer, and timestamp validation fail closed", async function () {
  const module = await proofModule();
  const invalid = [
    [
      "manifestSha256",
      "A".repeat(64),
      /release_commit_proof_manifest_hash_invalid/,
    ],
    [
      "signatureBase64url",
      `${"A".repeat(85)}B`,
      /release_commit_proof_signature_invalid/,
    ],
    [
      "signatureBase64url",
      `${"A".repeat(84)}==`,
      /release_commit_proof_signature_invalid/,
    ],
    ["signingKeyId", "key id", /release_commit_proof_key_id_invalid/],
    ["signingKeyId", "키-id", /release_commit_proof_key_id_invalid/],
    [
      "signedBy",
      "123E4567-E89B-42D3-A456-426614174000",
      /release_commit_proof_signer_invalid/,
    ],
    [
      "signedBy",
      "00000000-0000-0000-0000-000000000000",
      /release_commit_proof_signer_invalid/,
    ],
    [
      "signedAt",
      "2026-02-30T12:34:56.789Z",
      /release_commit_proof_signed_at_invalid/,
    ],
    [
      "signedAt",
      "2026-08-28T12:34:56Z",
      /release_commit_proof_signed_at_invalid/,
    ],
    [
      "signedAt",
      "2026-08-28T12:34:56.789+00:00",
      /release_commit_proof_signed_at_invalid/,
    ],
    ["manifestCanonicalJson", "", /release_commit_proof_manifest_json_invalid/],
    [
      "manifestCanonicalJson",
      " {}",
      /release_commit_proof_manifest_json_invalid/,
    ],
    [
      "manifestCanonicalJson",
      "[]",
      /release_commit_proof_manifest_json_invalid/,
    ],
    [
      "manifestCanonicalJson",
      "{invalid}",
      /release_commit_proof_manifest_json_invalid/,
    ],
  ];
  for (const [field, value, expected] of invalid) {
    assert.throws(
      function () {
        module.releaseCommitProofMaterial({ ...GOLDEN_INPUT, [field]: value });
      },
      expected,
    );
  }
});

test("length prefixes count UTF-8 bytes rather than JavaScript code units", async function () {
  const module = await proofModule();
  assert.equal(GOLDEN_INPUT.manifestCanonicalJson.length, 50);
  assert.equal(
    Buffer.byteLength(GOLDEN_INPUT.manifestCanonicalJson, "utf8"),
    55,
  );
  assert.match(
    module.releaseCommitProofMaterial(GOLDEN_INPUT),
    /55:\{"itemId":"qst-bnk-g6rp01draft001","label":"수학 π"\}$/,
  );
});

test("non-plain, accessor, missing, and extra input fields fail closed", async function () {
  const module = await proofModule();
  assert.throws(
    function () {
      module.releaseCommitProofMaterial(null);
    },
    /release_commit_proof_input_invalid/,
  );
  assert.throws(
    function () {
      module.releaseCommitProofMaterial({ ...GOLDEN_INPUT, unexpected: true });
    },
    /release_commit_proof_input_invalid/,
  );
  const hiddenExtra = { ...GOLDEN_INPUT };
  Object.defineProperty(hiddenExtra, "unexpected", { value: "hidden" });
  assert.throws(
    function () {
      module.releaseCommitProofMaterial(hiddenExtra);
    },
    /release_commit_proof_input_invalid/,
  );
  const missing = { ...GOLDEN_INPUT };
  delete missing.signedAt;
  assert.throws(
    function () {
      module.releaseCommitProofMaterial(missing);
    },
    /release_commit_proof_input_invalid/,
  );
  const accessor = { ...GOLDEN_INPUT };
  Object.defineProperty(accessor, "signedAt", {
    get() {
      return GOLDEN_INPUT.signedAt;
    },
  });
  assert.throws(
    function () {
      module.releaseCommitProofMaterial(accessor);
    },
    /release_commit_proof_input_invalid/,
  );
  assert.throws(
    function () {
      module.releaseCommitProofMaterial(
        Object.assign(Object.create({}), GOLDEN_INPUT),
      );
    },
    /release_commit_proof_input_invalid/,
  );
});

test("commit proof secrets must be non-whitespace ASCII and at least 32 characters", async function () {
  const module = await proofModule();
  await assert.rejects(
    module.createReleaseCommitProofBase64url(GOLDEN_INPUT, "x".repeat(31)),
    /release_commit_proof_secret_invalid/,
  );
  await assert.rejects(
    module.createReleaseCommitProofBase64url(
      GOLDEN_INPUT,
      `${"x".repeat(31)} `,
    ),
    /release_commit_proof_secret_invalid/,
  );
  await assert.rejects(
    module.createReleaseCommitProofBase64url(
      GOLDEN_INPUT,
      `${"x".repeat(31)}한`,
    ),
    /release_commit_proof_secret_invalid/,
  );
});
