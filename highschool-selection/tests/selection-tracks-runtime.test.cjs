const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const contracts = require("../server/exam-contracts.js");

const SECRET = "track-test-session-secret-with-at-least-32-characters";

async function start() {
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: { schemaVersion: "highselect-private-config/v1", students: [], exams: {} },
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    cookieSecure: false,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

test("runtime exposes six neutral track definitions without academy or source payloads", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const response = await fetch(`${env.base}/selection-tracks`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const tracks = await response.json();
  assert.equal(tracks.length, 6);
  assert.deepEqual(Object.keys(tracks[0]).sort(), ["admissionKind", "label", "targetStage", "trackId"]);
  assert.equal(tracks.some(track => track.trackId === "middle-transfer"), true);
  assert.equal(/programCode|evidenceRefs|source|answer|path/i.test(JSON.stringify(tracks)), false);
});

test("program track response preserves scope evidence status and rejects unknown programs", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const dp = await fetch(`${env.base}/programs/dp/selection-tracks`);
  assert.equal(dp.status, 200);
  const packet = await dp.json();
  assert.equal(packet.programCode, "DP");
  assert.deepEqual(packet.tracks.map(track => track.trackId), ["middle-entry", "middle-transfer", "common-math-entry"]);
  assert.deepEqual(Object.keys(packet.tracks[0]).sort(), ["evidenceStatus", "scopeKey", "scopeLabel", "trackId"]);
  assert.equal(packet.tracks.find(track => track.trackId === "middle-transfer").scopeKey, "middle1-1-to-linear-function");

  const sm = await (await fetch(`${env.base}/programs/SM/selection-tracks`)).json();
  assert.equal(sm.tracks[0].evidenceStatus, "needs-review");
  assert.equal((await fetch(`${env.base}/programs/UNKNOWN/selection-tracks`)).status, 404);
});

test("every runnable exam contract has an explicit program and neutral track assignment", () => {
  assert.deepEqual(Object.values(contracts.EXAMS).map(exam => [exam.examId, exam.programCode, exam.trackId]), [
    ["sh-selection-r01", "SH", "high-selection"],
    ["dp-middle2-2-transfer", "DP", "middle-transfer"],
    ["dp-common1-entry-202405", "DP", "common-math-entry"]
  ]);
});
