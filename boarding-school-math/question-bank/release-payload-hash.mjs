const HASH_PATTERN = /^[a-f0-9]{64}$/;

export const RELEASE_PAYLOAD_HASH_FIELDS = Object.freeze({
  "public-payload": "publicPayloadSha256",
  "private-spec": "privateSpecSha256",
  rubric: "rubricSha256",
  "rights-record": "rightsRecordSha256",
  "review-record": "reviewRecordSha256",
});

function fail(code) {
  throw new Error(code);
}

function requireJsonRecord(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail("release_payload_hash_payload_invalid");
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    fail("release_payload_hash_payload_invalid");
  }
  return value;
}

function canonicalizeJsonInternal(value, ancestors) {
  if (
    value === null || typeof value === "boolean" || typeof value === "string"
  ) {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail("release_payload_hash_payload_invalid");
    return JSON.stringify(value);
  }
  if (typeof value !== "object") fail("release_payload_hash_payload_invalid");
  if (ancestors.has(value)) fail("release_payload_hash_payload_invalid");
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      const ownKeys = Object.keys(value);
      if (
        ownKeys.length !== value.length ||
        ownKeys.some((key, index) => key !== String(index))
      ) fail("release_payload_hash_payload_invalid");
      return `[${
        value.map((entry) => canonicalizeJsonInternal(entry, ancestors)).join(
          ",",
        )
      }]`;
    }
    const record = requireJsonRecord(value);
    if (Object.getOwnPropertySymbols(record).length) {
      fail("release_payload_hash_payload_invalid");
    }
    const fields = Object.keys(record).sort().map((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(record, key);
      if (!descriptor || !("value" in descriptor)) {
        fail("release_payload_hash_payload_invalid");
      }
      return `${JSON.stringify(key)}:${
        canonicalizeJsonInternal(descriptor.value, ancestors)
      }`;
    });
    return `{${fields.join(",")}}`;
  } finally {
    ancestors.delete(value);
  }
}

export function canonicalizeJson(value) {
  return canonicalizeJsonInternal(value, new Set());
}

export function releasePayloadSelfHashField(kind) {
  if (
    !Object.prototype.hasOwnProperty.call(RELEASE_PAYLOAD_HASH_FIELDS, kind)
  ) {
    fail("release_payload_hash_kind_invalid");
  }
  return RELEASE_PAYLOAD_HASH_FIELDS[kind];
}

export function canonicalReleasePayloadMaterial(kind, payload) {
  const selfHashField = releasePayloadSelfHashField(kind);
  const record = requireJsonRecord(payload);
  const material = Object.create(null);
  Object.keys(record).forEach((key) => {
    if (key === selfHashField) return;
    const descriptor = Object.getOwnPropertyDescriptor(record, key);
    if (!descriptor || !("value" in descriptor)) {
      fail("release_payload_hash_payload_invalid");
    }
    material[key] = descriptor.value;
  });
  return canonicalizeJson(material);
}

async function sha256Text(text) {
  const digest = new Uint8Array(
    await globalThis.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    ),
  );
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function sha256CanonicalJson(value) {
  return sha256Text(canonicalizeJson(value));
}

export async function sha256ReleasePayload(kind, payload) {
  return sha256Text(canonicalReleasePayloadMaterial(kind, payload));
}

export async function assertReleasePayloadHash(kind, payload, expectedSha256) {
  const record = requireJsonRecord(payload);
  const selfHashField = releasePayloadSelfHashField(kind);
  const embeddedSha256 =
    Object.prototype.hasOwnProperty.call(record, selfHashField)
      ? record[selfHashField]
      : null;
  if (
    typeof embeddedSha256 !== "string" ||
    !HASH_PATTERN.test(embeddedSha256) ||
    typeof expectedSha256 !== "string" ||
    !HASH_PATTERN.test(expectedSha256)
  ) fail("release_payload_hash_mismatch");
  const recomputedSha256 = await sha256ReleasePayload(kind, record);
  if (
    embeddedSha256 !== expectedSha256 ||
    expectedSha256 !== recomputedSha256
  ) fail("release_payload_hash_mismatch");
  return recomputedSha256;
}
