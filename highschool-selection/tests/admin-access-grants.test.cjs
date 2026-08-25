const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("../server/app.js");
const { hashApprovalCode, verifyApprovalCode } = require("../server/security.js");
const privateConfig = require("../server/private-config.js");

const SECRET = "admin-test-session-secret-with-at-least-32-characters";
const EXAM_ID = "sh-selection-r01";
const FIXED_NOW = Date.parse("2026-08-24T00:00:00.000Z");

function initialConfig(pageRoot) {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      {
        studentId: "admin_ops",
        name: "운영관리자",
        approvalCodeHash: hashApprovalCode("ADMIN-001", Buffer.alloc(16, 1).toString("base64url")),
        role: "admin",
        grants: []
      },
      {
        studentId: "student_existing",
        name: "기존학생",
        approvalCodeHash: hashApprovalCode("OLD-001", Buffer.alloc(16, 2).toString("base64url")),
        grants: []
      }
    ],
    exams: {
      [EXAM_ID]: {
        pageAssetRoot: pageRoot,
        pageCount: 8,
        questionCount: 40,
        releaseStatus: "review_pending",
        answerStatus: "verified",
        classificationStatus: "verified",
        responseSchemaStatus: "verified",
        scoringPolicyStatus: "verified",
        printAuditStatus: "passed",
        signedAssetsStatus: "verified",
        finalRoundConfirmation: false
      }
    }
  };
}

async function start(clock) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-admin-"));
  const pageRoot = path.join(root, "pages");
  fs.mkdirSync(pageRoot);
  const configPath = path.join(root, "private-config.json");
  fs.writeFileSync(configPath, `${JSON.stringify(initialConfig(pageRoot), null, 2)}\n`, "utf8");
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfigPath: configPath,
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    cookieSecure: false,
    now: () => clock ? clock.value : FIXED_NOW,
    staticRoot: path.join(__dirname, "..")
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, root, configPath, base: `http://127.0.0.1:${server.address().port}` };
}

function adminHeaders(cookie, origin) {
  return { Cookie: cookie, Origin: origin, "Content-Type": "application/json", "X-Highselect-Admin": "1" };
}

async function login(base, name, approvalCode) {
  const response = await fetch(`${base}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, approvalCode })
  });
  return { response, cookie: String(response.headers.get("set-cookie") || "").split(";")[0] };
}

test("admin access grants are stored as hashes and immediately drive student per-exam access", async t => {
  const env = await start();
  t.after(() => {
    env.server.close();
    fs.rmSync(env.root, { recursive: true, force: true });
  });

  const anonymous = await fetch(`${env.base}/admin/access-grants`);
  assert.equal(anonymous.status, 401);

  const ordinary = await login(env.base, "기존학생", "OLD-001");
  assert.equal(ordinary.response.status, 200);
  const forbidden = await fetch(`${env.base}/admin/access-grants`, { headers: { Cookie: ordinary.cookie } });
  assert.equal(forbidden.status, 403);

  const admin = await login(env.base, "운영관리자", "ADMIN-001");
  assert.equal(admin.response.status, 200);
  const csrfBlocked = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: { Cookie: admin.cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ studentName: "차단", approvalCode: "GF-CSRF-001", examIds: [EXAM_ID] })
  });
  assert.equal(csrfBlocked.status, 403);
  const hostileOrigin = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, "https://hostile.example"),
    body: JSON.stringify({ studentName: "차단", approvalCode: "GF-CSRF-002", examIds: [EXAM_ID] })
  });
  assert.equal(hostileOrigin.status, 403);
  const createdResponse = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "신규학생", approvalCode: "GF-NEW-001", examIds: [EXAM_ID], expiresAt: "2026-08-25" })
  });
  assert.equal(createdResponse.status, 201);
  assert.equal(createdResponse.headers.get("cache-control"), "no-store");
  const created = await createdResponse.json();
  assert.equal(created.studentName, "신규학생");
  assert.deepEqual(created.examIds, [EXAM_ID]);
  assert.equal(created.expiresAt, "2026-08-25");
  assert.equal(Object.prototype.hasOwnProperty.call(created, "approvalCode"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(created, "approvalCodeHash"), false);

  const stored = JSON.parse(fs.readFileSync(env.configPath, "utf8"));
  const student = stored.students.find(item => item.studentId === created.id);
  assert.equal(student.name, "신규학생");
  assert.equal(student.approvalCodeHash.includes("GF-NEW-001"), false);
  assert.equal(verifyApprovalCode("GF-NEW-001", student.approvalCodeHash), true);
  assert.deepEqual(student.grants, [EXAM_ID]);

  const studentLogin = await login(env.base, "신규학생", "GF-NEW-001");
  assert.equal(studentLogin.response.status, 200);
  assert.deepEqual((await studentLogin.response.json()).access, [EXAM_ID]);

  const updatedResponse = await fetch(`${env.base}/admin/access-grants/${encodeURIComponent(created.id)}`, {
    method: "PUT",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "신규학생", approvalCode: "GF-NEW-002", examIds: [EXAM_ID], expiresAt: null })
  });
  assert.equal(updatedResponse.status, 200);
  const updated = await updatedResponse.json();
  assert.equal(updated.id, created.id);
  assert.equal(updated.expiresAt, null);
  const staleSession = await fetch(`${env.base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: studentLogin.cookie } });
  assert.equal(staleSession.status, 401);
  assert.equal((await login(env.base, "신규학생", "GF-NEW-001")).response.status, 401);
  const currentLogin = await login(env.base, "신규학생", "GF-NEW-002");
  assert.equal(currentLogin.response.status, 200);

  const sameNameResponse = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "신규학생", approvalCode: "GF-OTHER-1", examIds: [EXAM_ID], expiresAt: null })
  });
  assert.equal(sameNameResponse.status, 201);
  assert.notEqual((await sameNameResponse.json()).id, created.id);
  assert.equal((await login(env.base, "신규학생", "GF-NEW-002")).response.status, 200);
  assert.equal((await login(env.base, "신규학생", "GF-OTHER-1")).response.status, 200);

  const duplicateCredential = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "신규학생", approvalCode: "GF-NEW-002", examIds: [EXAM_ID] })
  });
  assert.equal(duplicateCredential.status, 409);

  const listedResponse = await fetch(`${env.base}/admin/access-grants`, { headers: { Cookie: admin.cookie } });
  assert.equal(listedResponse.status, 200);
  const listed = await listedResponse.json();
  assert.equal(listed.some(item => item.id === created.id && item.studentName === "신규학생"), true);
  assert.equal(JSON.stringify(listed).includes("approvalCodeHash"), false);

  const revoked = await fetch(`${env.base}/admin/access-grants/${encodeURIComponent(created.id)}`, {
    method: "DELETE",
    headers: adminHeaders(admin.cookie, env.base)
  });
  assert.equal(revoked.status, 200);
  const revokedSession = await fetch(`${env.base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: currentLogin.cookie } });
  assert.equal(revokedSession.status, 401);
  const afterRevoke = await login(env.base, "신규학생", "GF-NEW-002");
  assert.equal(afterRevoke.response.status, 401);
});

test("expired student approvals fail closed and unknown exams cannot be granted", async t => {
  const env = await start();
  t.after(() => {
    env.server.close();
    fs.rmSync(env.root, { recursive: true, force: true });
  });
  const admin = await login(env.base, "운영관리자", "ADMIN-001");
  const unknown = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "차단학생", approvalCode: "GF-BLOCK-1", examIds: ["missing-exam"], expiresAt: null })
  });
  assert.equal(unknown.status, 400);

  const impossibleDate = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "날짜오류", approvalCode: "GF-DATE-001", examIds: [EXAM_ID], expiresAt: "2026-02-31" })
  });
  assert.equal(impossibleDate.status, 400);

  const expired = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "만료학생", approvalCode: "GF-EXPIRED-1", examIds: [EXAM_ID], expiresAt: "2026-08-23" })
  });
  assert.equal(expired.status, 201);
  const expiredLogin = await login(env.base, "만료학생", "GF-EXPIRED-1");
  assert.equal(expiredLogin.response.status, 401);

  const lockPath = `${env.configPath}.lock`;
  fs.writeFileSync(lockPath, "busy", "utf8");
  const busy = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "동시저장", approvalCode: "GF-BUSY-001", examIds: [EXAM_ID] })
  });
  assert.equal(busy.status, 409);
  assert.equal(fs.readdirSync(env.root).some(name => name.endsWith(".tmp")), false);
  fs.unlinkSync(lockPath);
});

test("same-date approval expires only after the Korea end-of-day boundary", async t => {
  const clock = { value: Date.parse("2026-08-24T14:59:59.999Z") };
  const env = await start(clock);
  t.after(() => {
    env.server.close();
    fs.rmSync(env.root, { recursive: true, force: true });
  });
  const admin = await login(env.base, "운영관리자", "ADMIN-001");
  const created = await fetch(`${env.base}/admin/access-grants`, {
    method: "POST",
    headers: adminHeaders(admin.cookie, env.base),
    body: JSON.stringify({ studentName: "경계학생", approvalCode: "GF-EDGE-001", examIds: [EXAM_ID], expiresAt: "2026-08-24" })
  });
  assert.equal(created.status, 201);
  const before = await login(env.base, "경계학생", "GF-EDGE-001");
  assert.equal(before.response.status, 200);
  clock.value += 1;
  const after = await fetch(`${env.base}/exams/${EXAM_ID}/response-schema`, { headers: { Cookie: before.cookie } });
  assert.equal(after.status, 401);
});

test("private config rejects unowned metadata instead of silently deleting it", () => {
  const config = initialConfig(path.resolve(os.tmpdir(), "highselect-pages-placeholder"));
  assert.throws(() => privateConfig.normalize(Object.assign({ operatorNote: "must-not-disappear" }, config)), /not allowed/);
  config.students[1].operatorNote = "must-not-disappear";
  assert.throws(() => privateConfig.normalize(config), /not allowed/);
});

test("a stale lock from a dead writer is quarantined without deleting a live lock", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-stale-lock-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const pageRoot = path.join(root, "pages");
  fs.mkdirSync(pageRoot);
  const configPath = path.join(root, "private-config.json");
  const config = privateConfig.normalize(initialConfig(pageRoot));
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  const lockPath = `${configPath}.lock`;
  fs.writeFileSync(lockPath, JSON.stringify({ pid: 999999999, createdAt: "2000-01-01T00:00:00.000Z" }), "utf8");
  const old = new Date(Date.now() - 2 * 60 * 1000);
  fs.utimesSync(lockPath, old, old);
  const writer = privateConfig.createWriter({ configPath, staleLockMs: 60 * 1000 });
  const saved = writer(config, privateConfig.revision(config));
  assert.equal(saved.schemaVersion, config.schemaVersion);
  assert.equal(fs.existsSync(lockPath), false);
  assert.equal(fs.readdirSync(root).some(name => name.includes(".stale.")), false);
});
