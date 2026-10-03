// Only authored Book 1 games, never lesson content, answers, or account access.
export const FIELDS_GAME_LESSONS = Object.freeze({
  "turn-clock": "clock-turning",
  "mirror-tiles": "mirror-reflection",
  "fold-once": "fold-one-cut",
  "fold-twice": "fold-two-cut",
  "cross-sums": "equal-line-placement",
  "line-order": "relative-order-running",
  "share-equally": "book1-equalize-transfer",
});
export const FIELDS_GAME_LIFETIME_SECONDS = 365 * 24 * 60 * 60;
export const FIELDS_GAME_MAX_TOKEN_LENGTH = 96;
export const FIELDS_GAME_CLOCK_SKEW_SECONDS = 60;
export const FIELDS_GAME_DOMAIN = "fields-classic/game-only-capability/fcg1";
const PREFIX = "fcg1";
const encoder = new TextEncoder();

export class FieldsGameCapabilityError extends Error {
  constructor() { super("capability_invalid"); }
}

export function isFieldsGameActivity(activityId) {
  return typeof activityId === "string" && Object.hasOwn(FIELDS_GAME_LESSONS, activityId);
}

function encode(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/u, "");
}

function decode(value) {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) throw new FieldsGameCapabilityError();
  const padded = value.replace(/-/gu, "+").replace(/_/gu, "/") + "=".repeat((4 - value.length % 4) % 4);
  const bytes = Uint8Array.from(atob(padded), char => char.charCodeAt(0));
  if (encode(bytes) !== value) throw new FieldsGameCapabilityError();
  return bytes;
}

async function signingKey(secret) {
  if (typeof secret !== "string" || !secret) throw new Error("server_not_ready");
  const root = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  // Derive a game-only key as well as domain-separating the signed message.
  const derived = await crypto.subtle.sign("HMAC", root, encoder.encode(`${FIELDS_GAME_DOMAIN}/signing-key`));
  return crypto.subtle.importKey("raw", derived, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function currentSecond(now) {
  if (!Number.isFinite(now) || now < 0 || now > 8640000000000000 - FIELDS_GAME_LIFETIME_SECONDS * 1000) {
    throw new FieldsGameCapabilityError();
  }
  return Math.floor(now / 1000);
}

function metadata(activityId, exp) {
  return { activityId, bookId: "book-01", lessonId: FIELDS_GAME_LESSONS[activityId], expiresAt: new Date(exp * 1000).toISOString() };
}

export async function issueFieldsGameCapability(secret, activityId, now = Date.now()) {
  if (!isFieldsGameActivity(activityId)) throw new FieldsGameCapabilityError();
  const exp = currentSecond(now) + FIELDS_GAME_LIFETIME_SECONDS;
  const message = `${PREFIX}.${activityId}.${exp}`;
  const signature = await crypto.subtle.sign("HMAC", await signingKey(secret), encoder.encode(`${FIELDS_GAME_DOMAIN}\0${message}`));
  return { ...metadata(activityId, exp), token: `${message}.${encode(new Uint8Array(signature))}` };
}

export async function resolveFieldsGameCapability(secret, token, now = Date.now()) {
  try {
    if (typeof token !== "string" || token.length > FIELDS_GAME_MAX_TOKEN_LENGTH) throw new FieldsGameCapabilityError();
    const match = /^fcg1\.([a-z-]+)\.(0|[1-9][0-9]*)\.([A-Za-z0-9_-]{43})$/u.exec(token);
    if (!match) throw new FieldsGameCapabilityError();
    const [, activityId, expiry, encodedSignature] = match;
    const exp = Number(expiry);
    const second = currentSecond(now);
    // The fixed catalog is the entire scope; no caller-supplied book/lesson.
    if (!isFieldsGameActivity(activityId) || !Number.isSafeInteger(exp) || exp <= second
      || exp > second + FIELDS_GAME_LIFETIME_SECONDS + FIELDS_GAME_CLOCK_SKEW_SECONDS) {
      throw new FieldsGameCapabilityError();
    }
    const signature = decode(encodedSignature);
    if (signature.length !== 32) throw new FieldsGameCapabilityError();
    const message = `${PREFIX}.${activityId}.${expiry}`;
    const valid = await crypto.subtle.verify("HMAC", await signingKey(secret), signature, encoder.encode(`${FIELDS_GAME_DOMAIN}\0${message}`));
    if (!valid) throw new FieldsGameCapabilityError();
    return metadata(activityId, exp);
  } catch {
    throw new FieldsGameCapabilityError();
  }
}
