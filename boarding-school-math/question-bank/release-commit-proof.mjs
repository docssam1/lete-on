const COMMIT_PROOF_FIELDS = Object.freeze([
  "manifestSha256",
  "signatureBase64url",
  "signingKeyId",
  "signedBy",
  "signedAt",
  "manifestCanonicalJson",
]);

const SHA256 = /^[a-f0-9]{64}$/;
const ED25519_SIGNATURE_BASE64URL = /^[A-Za-z0-9_-]{86}$/;
const SIGNING_KEY_ID = /^[A-Za-z0-9._:-]{1,120}$/;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const EXACT_UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const ASCII_SECRET = /^[\x21-\x7e]{32,512}$/;
const BASE64URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export const RELEASE_COMMIT_PROOF_FIELDS = COMMIT_PROOF_FIELDS;
export const RELEASE_COMMIT_PROOF_SECRET_MIN_LENGTH = 32;

function fail(code) {
  throw new Error(code);
}

function requireExactRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    fail("release_commit_proof_input_invalid");
  }
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) {
    fail("release_commit_proof_input_invalid");
  }
  const ownKeys = Reflect.ownKeys(input);
  if (ownKeys.some((key) => typeof key !== "string")) {
    fail("release_commit_proof_input_invalid");
  }
  const keys = [...ownKeys].sort();
  if (
    keys.length !== COMMIT_PROOF_FIELDS.length ||
    keys.some((key, index) => key !== [...COMMIT_PROOF_FIELDS].sort()[index])
  ) fail("release_commit_proof_input_invalid");
  const values = Object.create(null);
  COMMIT_PROOF_FIELDS.forEach((field) => {
    const descriptor = Object.getOwnPropertyDescriptor(input, field);
    if (
      !descriptor || !("value" in descriptor) ||
      descriptor.enumerable !== true || typeof descriptor.value !== "string"
    ) fail("release_commit_proof_input_invalid");
    values[field] = descriptor.value;
  });
  return values;
}

function isCanonicalBase64Url(value) {
  if (!ED25519_SIGNATURE_BASE64URL.test(value)) return false;
  const finalIndex = BASE64URL_ALPHABET.indexOf(value.at(-1));
  return finalIndex >= 0 && (finalIndex & 0x0f) === 0;
}

function isExactUtcIso(value) {
  if (!EXACT_UTC_ISO.test(value)) return false;
  const instant = new Date(value);
  return Number.isFinite(instant.getTime()) && instant.toISOString() === value;
}

function assertCommitProofFields(input) {
  const values = requireExactRecord(input);
  if (!SHA256.test(values.manifestSha256)) {
    fail("release_commit_proof_manifest_hash_invalid");
  }
  if (!isCanonicalBase64Url(values.signatureBase64url)) {
    fail("release_commit_proof_signature_invalid");
  }
  if (!SIGNING_KEY_ID.test(values.signingKeyId)) {
    fail("release_commit_proof_key_id_invalid");
  }
  if (!UUID.test(values.signedBy)) {
    fail("release_commit_proof_signer_invalid");
  }
  if (!isExactUtcIso(values.signedAt)) {
    fail("release_commit_proof_signed_at_invalid");
  }
  if (
    !values.manifestCanonicalJson ||
    values.manifestCanonicalJson.trim() !== values.manifestCanonicalJson
  ) fail("release_commit_proof_manifest_json_invalid");
  try {
    const manifest = JSON.parse(values.manifestCanonicalJson);
    if (
      manifest === null || typeof manifest !== "object" ||
      Array.isArray(manifest)
    ) {
      fail("release_commit_proof_manifest_json_invalid");
    }
  } catch (_) {
    fail("release_commit_proof_manifest_json_invalid");
  }
  return values;
}

export function releaseCommitProofMaterial(input) {
  const values = assertCommitProofFields(input);
  const encoder = new TextEncoder();
  return COMMIT_PROOF_FIELDS.map((field) => {
    const value = values[field];
    return `${encoder.encode(value).length}:${value}`;
  }).join("");
}

function bytesToBase64Url(bytes) {
  let base64 = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const hasSecond = index + 1 < bytes.length;
    const hasThird = index + 2 < bytes.length;
    const second = hasSecond ? bytes[index + 1] : 0;
    const third = hasThird ? bytes[index + 2] : 0;
    const packed = (first << 16) | (second << 8) | third;
    base64 += BASE64URL_ALPHABET[(packed >>> 18) & 63];
    base64 += BASE64URL_ALPHABET[(packed >>> 12) & 63];
    if (hasSecond) base64 += BASE64URL_ALPHABET[(packed >>> 6) & 63];
    if (hasThird) base64 += BASE64URL_ALPHABET[packed & 63];
  }
  return base64;
}

export async function createReleaseCommitProofBase64url(input, secret) {
  if (typeof secret !== "string" || !ASCII_SECRET.test(secret)) {
    fail("release_commit_proof_secret_invalid");
  }
  if (!globalThis.crypto?.subtle) {
    fail("release_commit_proof_crypto_unavailable");
  }
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(
    await globalThis.crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(releaseCommitProofMaterial(input)),
    ),
  );
  return bytesToBase64Url(digest);
}
