import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { HANDS_ON_ACTIVITIES, HANDS_ON_UNITS } from "../../../fields-classic/question-bank/golden-bell-hands-on-models.js";
import { FIELDS_GAME_LESSONS, FIELDS_GAME_LIFETIME_SECONDS, FIELDS_GAME_MAX_TOKEN_LENGTH, FIELDS_GAME_CLOCK_SKEW_SECONDS, FIELDS_GAME_DOMAIN, FieldsGameCapabilityError, issueFieldsGameCapability, resolveFieldsGameCapability } from "./fields-game-capability.js";

const SECRET = "synthetic-game-test-key-not-a-credential";
const NOW = Date.parse("2030-10-03T10:20:30.456Z");
const SECOND = Math.floor(NOW / 1000);
const EXPIRY = SECOND + FIELDS_GAME_LIFETIME_SECONDS;

// Independent Node HMAC implementation, including adversarial compact messages.
function signed(activityId, exp, { domain = FIELDS_GAME_DOMAIN, secret = SECRET, rawKey = false, messageDomain = domain, prefix = "fcg1" } = {}) {
  const key = rawKey ? secret : createHmac("sha256", secret).update(`${domain}/signing-key`).digest();
  const message = `${prefix}.${activityId}.${exp}`;
  return `${message}.${createHmac("sha256", key).update(`${messageDomain}\0${message}`).digest("base64url")}`;
}

test("fixed seven mappings match the actual authored Book 1 models", () => {
  assert.equal(Object.keys(FIELDS_GAME_LESSONS).length, 7);
  assert.deepEqual(Object.keys(FIELDS_GAME_LESSONS).sort(), Object.keys(HANDS_ON_ACTIVITIES).sort());
  for (const [id, lesson] of Object.entries(FIELDS_GAME_LESSONS)) {
    assert.equal(lesson, HANDS_ON_ACTIVITIES[id].lesson);
    const unit = HANDS_ON_UNITS.find(item => item.activities.includes(id));
    assert.equal(unit.bookId, "book-01");
    assert.ok(unit.lessons.includes(lesson));
  }
});

for (const activityId of Object.keys(FIELDS_GAME_LESSONS)) {
  test(`compact ${activityId}: exact 365-day issuance and metadata-only resolve`, async () => {
    const link = await issueFieldsGameCapability(SECRET, activityId, NOW);
    assert.match(link.token, /^fcg1\.[a-z-]+\.\d+\.[A-Za-z0-9_-]{43}$/u);
    assert.ok(Buffer.byteLength(link.token) <= 80, "printable compact token budget");
    assert.ok(link.token.length <= FIELDS_GAME_MAX_TOKEN_LENGTH);
    assert.equal(link.token.split(".").length, 4);
    assert.equal(link.token.split(".")[1], activityId);
    assert.equal(Number(link.token.split(".")[2]), EXPIRY);
    assert.equal(FIELDS_GAME_LIFETIME_SECONDS, 31536000);
    assert.equal(Date.parse(link.expiresAt) - SECOND * 1000, 31536000000);
    assert.equal(signed(activityId, EXPIRY), link.token);
    const { token, ...metadata } = link;
    assert.deepEqual(Object.keys(metadata).sort(), ["activityId", "bookId", "expiresAt", "lessonId"]);
    assert.deepEqual(await resolveFieldsGameCapability(SECRET, token, NOW), metadata);
    assert.deepEqual(await resolveFieldsGameCapability(SECRET, token, Date.parse(link.expiresAt) - 1), metadata);
    await assert.rejects(() => resolveFieldsGameCapability(SECRET, token, Date.parse(link.expiresAt)), FieldsGameCapabilityError);
    await assert.rejects(() => resolveFieldsGameCapability(SECRET, token, Date.parse(link.expiresAt) + 1000), FieldsGameCapabilityError);
  });
}

test("same activity/expiry is deterministic and contains no redundant claims", async () => {
  const a = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  const b = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  assert.equal(a.token, b.token);
  assert.ok(!a.token.includes("book-01")); assert.ok(!a.token.includes("clock-turning"));
  const c = await issueFieldsGameCapability(SECRET, "turn-clock", NOW + 1000);
  assert.notEqual(a.token, c.token);
});

test("altered activity, expiry, signature, prefix, or server key fails", async () => {
  const { token } = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  const signature = token.split(".")[3];
  for (const value of [
    token.replace("turn-clock", "fold-once"),
    token.replace(String(EXPIRY), String(EXPIRY - 1)),
    `fcg1.turn-clock.${EXPIRY}.${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`,
    token.replace("fcg1.", "fcg2."),
  ]) await assert.rejects(() => resolveFieldsGameCapability(SECRET, value, NOW), FieldsGameCapabilityError);
  await assert.rejects(() => resolveFieldsGameCapability("other-synthetic-key", token, NOW), FieldsGameCapabilityError);
});

test("another domain/scope, root key, or message domain cannot sign games", async () => {
  for (const options of [
    { domain: "fields-classic/answers/fcg1" },
    { domain: "fields-classic/game-only-capability/book-02/fcg1" },
    { rawKey: true },
    { messageDomain: "fields-classic/session/fcg1" },
  ]) await assert.rejects(() => resolveFieldsGameCapability(SECRET, signed("turn-clock", EXPIRY, options), NOW), FieldsGameCapabilityError);
});

test("correctly signed tokens require exact catalog activity and prefix", async () => {
  for (const activityId of ["unknown-game", "constructor", "__proto__", "clock-turning", "book-02", "Turn-clock", "turn-clock/answers", "", 1]) {
    await assert.rejects(() => resolveFieldsGameCapability(SECRET, signed(activityId, EXPIRY), NOW), FieldsGameCapabilityError);
  }
  await assert.rejects(() => resolveFieldsGameCapability(SECRET, signed("turn-clock", EXPIRY, { prefix: "fcg2" }), NOW), FieldsGameCapabilityError);
});

test("expiry horizon is bounded to now + 365 days + exactly 60 seconds of clock skew", async () => {
  assert.equal(FIELDS_GAME_CLOCK_SKEW_SECONDS, 60);
  for (const exp of [SECOND + 1, EXPIRY, EXPIRY + 60]) {
    assert.equal((await resolveFieldsGameCapability(SECRET, signed("turn-clock", exp), NOW)).expiresAt, new Date(exp * 1000).toISOString());
  }
  for (const exp of [SECOND, SECOND - 1, 0, EXPIRY + 61, EXPIRY + FIELDS_GAME_LIFETIME_SECONDS, Number.MAX_SAFE_INTEGER]) {
    await assert.rejects(() => resolveFieldsGameCapability(SECRET, signed("turn-clock", exp), NOW), FieldsGameCapabilityError);
  }
  const { token } = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  await resolveFieldsGameCapability(SECRET, token, NOW - 60000);
  await assert.rejects(() => resolveFieldsGameCapability(SECRET, token, NOW - 61000), FieldsGameCapabilityError);
});

test("noncanonical decimal, unsafe/negative/fractional/exponential expiry cannot be signed", async () => {
  for (const exp of [`0${EXPIRY}`, `+${EXPIRY}`, `-${EXPIRY}`, `${EXPIRY}.0`, `${EXPIRY}e0`, `${EXPIRY} `, ` ${EXPIRY}`, "01", "-0", "NaN", "Infinity", "9007199254740993", "\u0661\u0662", ""]) {
    await assert.rejects(() => resolveFieldsGameCapability(SECRET, signed("turn-clock", exp), NOW), FieldsGameCapabilityError);
  }
});

test("malformed, noncanonical signature, and oversized tokens fail uniformly", async () => {
  const { token } = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  const signature = token.split(".")[3];
  // Reject base64url aliases with nonzero padding bits and identical decoded bytes.
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const alias = signature.slice(0, -1) + alphabet[alphabet.indexOf(signature.at(-1)) + 1];
  assert.deepEqual(Buffer.from(alias, "base64url"), Buffer.from(signature, "base64url"));
  for (const invalid of [
    null, undefined, 42, {}, [], "", "fcg1", `${token}.extra`, `fcg1..${EXPIRY}.${signature}`,
    `fcg1.turn-clock..${signature}`, `fcg1.turn-clock.${EXPIRY}.`, `${token}=`,
    `fcg1.turn-clock.${EXPIRY}.${alias}`, `fcg1.turn-clock.${EXPIRY}.A`, ` ${token}`, `${token}\n`,
    "x".repeat(FIELDS_GAME_MAX_TOKEN_LENGTH + 1),
    `fcg1.${"a".repeat(FIELDS_GAME_MAX_TOKEN_LENGTH)}.${EXPIRY}.${signature}`,
    `fcg1.turn-clock.${EXPIRY}.${"A".repeat(44)}`,
  ]) await assert.rejects(() => resolveFieldsGameCapability(SECRET, invalid, NOW), FieldsGameCapabilityError);
});

test("issuance rejects invalid activity/time and missing server configuration", async () => {
  for (const id of ["", "constructor", "__proto__", "clock-turning", null, {}, "turn-clock/../answers"]) {
    await assert.rejects(() => issueFieldsGameCapability(SECRET, id, NOW), FieldsGameCapabilityError);
  }
  for (const now of [NaN, Infinity, -1, 8640000000000000]) {
    await assert.rejects(() => issueFieldsGameCapability(SECRET, "turn-clock", now), FieldsGameCapabilityError);
  }
  await assert.rejects(() => issueFieldsGameCapability("", "turn-clock", NOW), /server_not_ready/u);
});
