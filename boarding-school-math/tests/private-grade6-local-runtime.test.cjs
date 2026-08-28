"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const path = require("node:path");
const test = require("node:test");

const placement = require("../assessment/grade6-placement-plan.js");
const local = require("../assessment/private-grade6-local-runtime.cjs");

const projectRoot = path.resolve(__dirname, "..");
const privateDirectory = path.join(projectRoot, "private-authoring");
const teacherPin = "LOCAL-TEST-PIN-42";

function rawHttpRequest(port, options, body) {
  return new Promise(function (resolve, reject) {
    const request = require("node:http").request(Object.assign({ hostname: "127.0.0.1", port }, options), function (response) {
      const chunks = [];
      response.on("data", function (chunk) { chunks.push(chunk); });
      response.on("end", function () {
        resolve({ status: response.statusCode, body: Buffer.concat(chunks).toString("utf8") });
      });
    });
    request.on("error", reject);
    if (body) request.end(body);
    else request.end();
  });
}

function deterministicBytes(size, counter) {
  return Buffer.alloc(size, ((counter || 0) + 1) & 255);
}

function fixedClock() {
  return new Date("2026-08-29T03:00:00.000Z");
}

function runtime() {
  return local.createGrade6LocalRuntime({
    projectRoot,
    privateDirectory,
    teacherPin,
    qaOnly: true,
    randomBytes: deterministicBytes,
    now: fixedClock
  });
}

test("pending-review authoring requires an explicit local-QA acknowledgement", function () {
  assert.throws(function () {
    local.createGrade6LocalRuntime({ projectRoot, privateDirectory, teacherPin });
  }, /explicit qaOnly acknowledgement/);
  const app = runtime();
  assert.equal(app.releaseGate.qaOnly, true);
  assert.equal(app.releaseGate.authoringState, "draft-pending-independent-review");
  assert.equal(app.releaseGate.pendingItemCount, 42);
  assert.equal(app.releaseGate.studentOperationAuthorized, false);
});

function fixtureItems() {
  return local.loadPrivateAuthoring(privateDirectory).items;
}

function forbiddenKeyPaths(value, base) {
  const forbidden = new Set([
    "answer", "solutionByLocale", "expectedResponseByLocale", "rubricDraft", "privateDraft",
    "sourcePath", "errorSignals", "defaultErrorType", "rightsDraft", "verification"
  ]);
  const found = [];
  if (!value || typeof value !== "object") return found;
  Object.keys(value).forEach(function (key) {
    const location = base ? `${base}.${key}` : key;
    if (forbidden.has(key)) found.push(location);
    found.push(...forbiddenKeyPaths(value[key], location));
  });
  return found;
}

function answerFor(item) {
  if (item.privateDraft.answer) return item.privateDraft.answer.value;
  return `local response for ${item.itemId}`;
}

function completeResponses(items, overrides) {
  const replacements = overrides || new Map();
  return items.map(function (item) {
    return { itemId: item.itemId, value: replacements.has(item.itemId) ? replacements.get(item.itemId) : answerFor(item) };
  });
}

function fullCreditReviews(items) {
  return items.filter(function (item) { return ["short-answer", "constructed-response"].includes(item.responseType); }).map(function (item) {
    return { itemId: item.itemId, awardedPoints: 1, errorType: null };
  });
}

test("ignored authoring supplies the exact 42-slot order and only answer-free student items", function () {
  const items = fixtureItems();
  assert.equal(items.length, 42);
  assert.deepEqual(items.map(function (item) { return item.slotId; }), placement.plan.slots.map(function (slot) { return slot.slotId; }));
  assert.equal(items.filter(function (item) { return item.privateDraft.answer; }).length, 32);
  assert.equal(items.filter(function (item) { return !item.privateDraft.answer; }).length, 10);

  const session = runtime().start({ action: "start" });
  assert.equal(session.items.length, 42);
  assert.deepEqual(session.counts, { total: 42, automatic: 32, teacherReview: 10 });
  assert.deepEqual(forbiddenKeyPaths(session), []);
  assert.equal(session.items.some(function (item) { return item.assets.some(function (asset) { return asset.url.startsWith("/api/grade6-local/assets/"); }); }), true);
});

test("exact numeric scoring treats equivalent integers, decimals, and fractions rationally", function () {
  assert.equal(local.rationalEqual("2/4", "0.5"), true);
  assert.equal(local.rationalEqual(".5", "1/2"), true);
  assert.equal(local.rationalEqual("5.", "5"), true);
  assert.equal(local.rationalEqual("10/2", "5"), true);
  assert.equal(local.rationalEqual("1/3", "0.3333333333333333"), false);
  assert.equal(local.rationalEqual("1/0", "0"), false);

  const items = fixtureItems();
  const numeric = items.find(function (item) { return item.privateDraft.answer && item.privateDraft.answer.kind === "numeric-exact"; });
  const parsed = local.parseExactRational(numeric.privateDraft.answer.value);
  const equivalent = `${parsed.numerator * 7n}/${parsed.denominator * 7n}`;
  const app = runtime();
  const session = app.start({ action: "start" });
  app.save({ action: "save", attemptId: session.attemptId, responses: completeResponses(items, new Map([[numeric.itemId, equivalent]])) }, session.studentToken);
  const submitted = app.submit({ action: "submit", attemptId: session.attemptId }, session.studentToken);
  assert.equal(submitted.automaticScoredCount, 32);
  const opened = app.teacherOpen({ action: "teacher-open", attemptId: session.attemptId, pin: teacherPin });
  assert.equal(opened.summary.automaticEarnedPoints, 32);
});

test("submission rejects missing work, wrong-answer signals map, and teacher PIN is enforced", function () {
  const items = fixtureItems();
  const app = runtime();
  const incomplete = app.start({ action: "start" });
  app.save({ action: "save", attemptId: incomplete.attemptId, responses: completeResponses(items).slice(0, 41) }, incomplete.studentToken);
  assert.throws(
    function () { app.submit({ action: "submit", attemptId: incomplete.attemptId }, incomplete.studentToken); },
    function (error) { return error && error.code === "INCOMPLETE_ATTEMPT"; }
  );

  const wrongItem = items.find(function (item) { return item.privateDraft.answer && item.privateDraft.errorSignals.length; });
  const wrongSignal = wrongItem.privateDraft.errorSignals[0];
  const session = app.start({ action: "start" });
  app.save({
    action: "save",
    attemptId: session.attemptId,
    responses: completeResponses(items, new Map([[wrongItem.itemId, wrongSignal.observedValue]]))
  }, session.studentToken);
  app.submit({ action: "submit", attemptId: session.attemptId }, session.studentToken);
  assert.throws(
    function () { app.teacherOpen({ action: "teacher-open", attemptId: session.attemptId, pin: "WRONG-PIN" }); },
    function (error) { return error && error.code === "TEACHER_PIN_REJECTED"; }
  );
  const finalized = app.teacherFinalize({
    action: "teacher-finalize",
    attemptId: session.attemptId,
    pin: teacherPin,
    reviews: fullCreditReviews(items)
  });
  const feedback = finalized.teacherReport.itemFeedback.find(function (item) { return item.itemId === wrongItem.itemId; });
  assert.equal(feedback.errorType, wrongSignal.errorType);
});

test("teacher finalization runs the existing engine and produces non-promoting reports and roadmaps", function () {
  const items = fixtureItems();
  const app = runtime();
  const session = app.start({ action: "start" });
  app.save({ action: "save", attemptId: session.attemptId, responses: completeResponses(items) }, session.studentToken);
  const submitted = app.submit({ action: "submit", attemptId: session.attemptId }, session.studentToken);
  assert.deepEqual(submitted, {
    attemptId: session.attemptId,
    status: "pending-teacher-review",
    automaticScoredCount: 32,
    teacherReviewCount: 10
  });
  const queue = app.teacherOpen({ action: "teacher-open", attemptId: session.attemptId, pin: teacherPin });
  assert.equal(queue.queue.length, 10);
  assert.equal(queue.queue.every(function (entry) { return entry.rubricDraft && entry.expectedResponseByLocale && entry.solutionByLocale; }), true);

  const finalized = app.teacherFinalize({
    action: "teacher-finalize",
    attemptId: session.attemptId,
    pin: teacherPin,
    reviews: fullCreditReviews(items)
  });
  assert.equal(finalized.studentReport.audience, "student");
  assert.equal(finalized.teacherReport.audience, "teacher");
  assert.equal(finalized.studentRoadmap.audience, "student");
  assert.equal(finalized.teacherRoadmap.audience, "teacher");
  assert.equal(finalized.studentReport.score.maxPoints, 42);
  assert.equal(finalized.studentReport.promotionReview.automaticPromotion, false);
  assert.equal(finalized.studentReport.promotionReview.finalDecision, "school-review-required");
  assert.equal(finalized.studentRoadmap.routes.length > 0, true);

  const student = app.studentResult(session.attemptId, session.studentToken);
  assert.equal(student.status, "finalized-school-review-required");
  assert.deepEqual(forbiddenKeyPaths(student), []);
  assert.equal(Object.prototype.hasOwnProperty.call(student, "teacherReport"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student, "teacherRoadmap"), false);
});

test("asset delivery is a private-path-free allowlist with verified SVG bytes", function () {
  const app = runtime();
  const publicAsset = app.publicItems.flatMap(function (item) { return item.assets; })[0];
  assert.ok(publicAsset);
  assert.deepEqual(forbiddenKeyPaths(publicAsset), []);
  const asset = app.getAsset(publicAsset.assetId);
  assert.equal(asset.mimeType, "image/svg+xml");
  assert.equal(crypto.createHash("sha256").update(asset.bytes).digest("hex"), publicAsset.sha256);
  assert.match(asset.bytes.toString("utf8"), /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i);
  assert.throws(
    function () { app.getAsset("ast-bnk-0000000000000000"); },
    function (error) { return error && error.code === "ASSET_NOT_FOUND"; }
  );
  assert.throws(
    function () { app.getAsset("../private-authoring"); },
    function (error) { return error && error.code === "ASSET_NOT_FOUND"; }
  );
});

test("HTTP contract is loopback-only, no-store, action-allowlisted, and blocks private paths", async function () {
  const app = runtime();
  const server = local.createGrade6LocalServer({ runtime: app, projectRoot, staticRoot: projectRoot, maxBodyBytes: 4096 });
  await new Promise(function (resolve, reject) {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(`${base}/api/grade6-local?action=health`);
    assert.equal(health.status, 200);
    assert.match(health.headers.get("cache-control"), /no-store/);
    const healthPayload = await health.json();
    assert.deepEqual(healthPayload.counts, { total: 42, automatic: 32, teacherReview: 10 });
    assert.equal(healthPayload.releaseGate.qaOnly, true);
    assert.equal(healthPayload.releaseGate.studentOperationAuthorized, false);

    const started = await fetch(`${base}/api/grade6-local`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "start" })
    });
    const session = await started.json();
    assert.equal(session.items.length, 42);
    assert.deepEqual(forbiddenKeyPaths(session), []);

    const reboundBody = JSON.stringify({ action: "start" });
    const rebound = await rawHttpRequest(server.address().port, {
      method: "POST",
      path: "/api/grade6-local",
      headers: {
        Host: `attacker.example:${server.address().port}`,
        Origin: `http://attacker.example:${server.address().port}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(reboundBody)
      }
    }, reboundBody);
    assert.equal(rebound.status, 403);
    assert.equal(JSON.parse(rebound.body).code, "HOST_REJECTED");

    const hostileOrigin = await rawHttpRequest(server.address().port, {
      method: "POST",
      path: "/api/grade6-local",
      headers: {
        Host: `127.0.0.1:${server.address().port}`,
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(reboundBody)
      }
    }, reboundBody);
    assert.equal(hostileOrigin.status, 403);
    assert.equal(JSON.parse(hostileOrigin.body).code, "ORIGIN_REJECTED");

    const sameOrigin = await rawHttpRequest(server.address().port, {
      method: "POST",
      path: "/api/grade6-local",
      headers: {
        Host: `127.0.0.1:${server.address().port}`,
        Origin: `http://127.0.0.1:${server.address().port}`,
        "Sec-Fetch-Site": "same-origin",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(reboundBody)
      }
    }, reboundBody);
    assert.equal(sameOrigin.status, 200);
    const sameOriginSession = JSON.parse(sameOrigin.body);
    assert.equal(sameOriginSession.items.length, 42);

    const invalidUtf8 = Buffer.concat([
      Buffer.from(`{"action":"save","attemptId":"${sameOriginSession.attemptId}","responses":[{"itemId":"${sameOriginSession.items[0].itemId}","value":"`, "utf8"),
      Buffer.from([0x80]),
      Buffer.from('"}]}', "utf8")
    ]);
    const invalidUtf8Response = await rawHttpRequest(server.address().port, {
      method: "POST",
      path: "/api/grade6-local",
      headers: {
        Host: `127.0.0.1:${server.address().port}`,
        Origin: `http://127.0.0.1:${server.address().port}`,
        "Sec-Fetch-Site": "same-origin",
        "Content-Type": "application/json",
        "Content-Length": invalidUtf8.length,
        "x-gfield-student-token": sameOriginSession.studentToken
      }
    }, invalidUtf8);
    assert.equal(invalidUtf8Response.status, 400);
    assert.equal(JSON.parse(invalidUtf8Response.body).code, "INVALID_JSON");

    const blocked = await fetch(`${base}/private-authoring/grade6-rp-drafts.cjs`);
    assert.equal(blocked.status, 404);
    const badMethod = await fetch(`${base}/api/grade6-local?action=health`, { method: "PUT" });
    assert.equal(badMethod.status, 405);
    const oversized = await fetch(`${base}/api/grade6-local`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "start", padding: "x".repeat(5000) })
    });
    assert.equal(oversized.status, 413);
  } finally {
    await new Promise(function (resolve) { server.close(resolve); });
  }
});
