const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const moduleUrl = pathToFileURL(path.join(
  __dirname,
  "..",
  "question-bank",
  "release-payload-hash.mjs",
)).href;

async function hashModule() {
  return import(moduleUrl);
}

const GOLDEN_MATERIAL = '{"alpha":null,"nested":{"a":[3,{"a":true,"é":"x"}],"publicPayloadSha256":"nested-stays"},"z":9}';
const GOLDEN_SHA256 = "573b2c7f54b458818487cb2c548dfc7b70e5b9d8cc2e543a47c96e6fa84376b7";

function goldenPayload(hash = "0".repeat(64)) {
  return {
    z: 9,
    publicPayloadSha256: hash,
    nested: {
      publicPayloadSha256: "nested-stays",
      a: [3, { é: "x", a: true }],
    },
    alpha: null,
  };
}

test("canonical release payload uses the independently fixed golden vector", async function () {
  const module = await hashModule();
  const payload = goldenPayload();
  assert.equal(module.canonicalReleasePayloadMaterial("public-payload", payload), GOLDEN_MATERIAL);
  assert.equal(
    crypto.createHash("sha256").update(GOLDEN_MATERIAL, "utf8").digest("hex"),
    GOLDEN_SHA256,
  );
  assert.equal(await module.sha256ReleasePayload("public-payload", payload), GOLDEN_SHA256);
});

test("canonical release hash is invariant to key order", async function () {
  const module = await hashModule();
  const reordered = {
    nested: { a: [3, { a: true, é: "x" }], publicPayloadSha256: "nested-stays" },
    alpha: null,
    publicPayloadSha256: "f".repeat(64),
    z: 9,
  };
  assert.equal(await module.sha256ReleasePayload("public-payload", reordered), GOLDEN_SHA256);
});

test("only the payload root self hash is excluded and input remains unchanged", async function () {
  const module = await hashModule();
  const payload = goldenPayload();
  const before = structuredClone(payload);
  const material = module.canonicalReleasePayloadMaterial("public-payload", payload);
  assert.match(material, /"publicPayloadSha256":"nested-stays"/);
  assert.doesNotMatch(material, new RegExp(`"publicPayloadSha256":"${"0".repeat(64)}"`));
  assert.deepEqual(payload, before);
});

test("all five payload kinds share the same explicit root-only rule", async function () {
  const module = await hashModule();
  const expectedFields = {
    "public-payload": "publicPayloadSha256",
    "private-spec": "privateSpecSha256",
    rubric: "rubricSha256",
    "rights-record": "rightsRecordSha256",
    "review-record": "reviewRecordSha256",
  };
  assert.deepEqual({ ...module.RELEASE_PAYLOAD_HASH_FIELDS }, expectedFields);
  for (const [kind, field] of Object.entries(expectedFields)) {
    const payload = { stable: { [field]: "nested-stays" }, [field]: "0".repeat(64) };
    assert.equal(
      module.canonicalReleasePayloadMaterial(kind, payload),
      `{"stable":{"${field}":"nested-stays"}}`,
    );
  }
});

test("embedded, database, and recomputed hashes must all match", async function () {
  const module = await hashModule();
  const payload = goldenPayload(GOLDEN_SHA256);
  assert.equal(
    await module.assertReleasePayloadHash("public-payload", payload, GOLDEN_SHA256),
    GOLDEN_SHA256,
  );
  await assert.rejects(
    module.assertReleasePayloadHash("public-payload", payload, "a".repeat(64)),
    /release_payload_hash_mismatch/,
  );
  payload.z = 10;
  await assert.rejects(
    module.assertReleasePayloadHash("public-payload", payload, GOLDEN_SHA256),
    /release_payload_hash_mismatch/,
  );
});

test("unknown payload kinds and non-JSON material fail closed", async function () {
  const module = await hashModule();
  assert.throws(
    function () { module.canonicalReleasePayloadMaterial("manifest", {}); },
    /release_payload_hash_kind_invalid/,
  );
  await assert.rejects(
    module.assertReleasePayloadHash("unknown", {}, "0".repeat(64)),
    /release_payload_hash_kind_invalid/,
  );
  assert.throws(
    function () {
      module.canonicalReleasePayloadMaterial("public-payload", {
        publicPayloadSha256: "0".repeat(64),
        invalid: undefined,
      });
    },
    /release_payload_hash_payload_invalid/,
  );
});
