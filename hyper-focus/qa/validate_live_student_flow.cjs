const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

const LIVE_CONFIRMATION = "HF_LIVE_STUDENT_E2E";
const origin = "https://lete-on.gfieldacademy.net";
const adminCode = String(process.env.HF_E2E_ADMIN_CODE || "");
const studentName = String(process.env.HF_E2E_STUDENT_NAME || "").trim();
let studentCode = String(process.env.HF_E2E_STUDENT_CODE || "").trim();
const studentOnly = process.env.HF_E2E_STUDENT_ONLY === "1";
const skipDirectLoad = process.env.HF_E2E_SKIP_DIRECT_LOAD === "1";
const mobileOnly = process.env.HF_E2E_MOBILE_ONLY === "1";
const keepMockBundle = process.env.HF_E2E_KEEP_MOCK_BUNDLE === "1";
const runId = crypto.randomUUID();
const artifactDirectory = path.join(os.tmpdir(), `hf-live-e2e-${runId}`);

function requiredEnvironment() {
  assert.equal(process.env.HF_E2E_CONFIRM_LIVE, LIVE_CONFIRMATION,
    `운영 E2E는 HF_E2E_CONFIRM_LIVE=${LIVE_CONFIRMATION} 확인이 필요합니다.`);
  if (!studentOnly) assert.ok(adminCode, "HF_E2E_ADMIN_CODE가 필요합니다.");
  assert.ok(studentName, "HF_E2E_STUDENT_NAME이 필요합니다.");
  if (!studentCode && !studentOnly) studentCode = `GF-${crypto.randomInt(1000, 10000)}`;
  assert.ok(studentCode, "학생 전용 검수에는 HF_E2E_STUDENT_CODE가 필요합니다.");
  assert.match(studentCode.toUpperCase(), /^GF-?\d{4}$/, "학생 승인번호는 GF-숫자4자리 형식이어야 합니다.");
  assert.notEqual(normalizeCode(studentCode), "GF7265", "공개 예시 번호 GF-7265는 실제 계정에 사용할 수 없습니다.");
}

function readPublicConfig() {
  const source = fs.readFileSync(path.join(__dirname, "..", "supabase-config.js"), "utf8");
  const read = name => {
    const match = source.match(new RegExp(`${name}:\\s*"([^"]+)"`));
    assert.ok(match, `${name} 공개 설정을 찾지 못했습니다.`);
    return match[1];
  };
  return { projectUrl: read("projectUrl"), publishableKey: read("publishableKey"), adminEmail: read("adminEmail") };
}

async function jsonRequest(url, options, expectedStatus = 200) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch (_) {
    body = { error: `invalid_json:${response.headers.get("content-type") || "unknown"}:${text.slice(0, 160)}` };
  }
  assert.equal(response.status, expectedStatus, `${url} 응답 ${response.status}: ${body.error || body.msg || "unknown"}`);
  return body;
}

function apiHeaders(config, token) {
  return {
    apikey: config.publishableKey,
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    origin
  };
}

async function passwordSession(config, email, password) {
  const body = await jsonRequest(`${config.projectUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: config.publishableKey, "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  assert.ok(body.access_token, "로그인 토큰이 없습니다.");
  return body.access_token;
}

async function invoke(config, functionName, token, body, expectedStatus = 200) {
  return jsonRequest(`${config.projectUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: apiHeaders(config, token),
    body: JSON.stringify(body)
  }, expectedStatus);
}

function normalizeCode(value) {
  return String(value).normalize("NFKC").toUpperCase().replace(/[\s-]+/gu, "");
}

function loginNameKey(value) {
  return String(value).normalize("NFKC").replace(/\s+/gu, "").trim().toLocaleLowerCase("ko-KR");
}

function deriveStudentPassword(name, approvalCode) {
  const material = `hf-login-v1\0${loginNameKey(name)}\0${normalizeCode(approvalCode)}`;
  return `${crypto.createHash("sha256").update(material).digest("base64url")}Aa1!`;
}

async function adminAction(config, adminToken, body) {
  return invoke(config, "admin-students", adminToken, body);
}

async function secureMockAction(config, studentToken, body, expectedStatus = 200) {
  return invoke(config, "secure-mock", studentToken, body, expectedStatus);
}

async function ensureStudent(config, adminToken) {
  const before = await adminAction(config, adminToken, { action: "list" });
  let student = (before.students || []).find(row => row.name === studentName);
  let created = false;
  if (!student) {
    const result = await adminAction(config, adminToken, {
      action: "create",
      name: studentName,
      studentType: "internal",
      approvalCode: studentCode
    });
    assert.equal(normalizeCode(result.oneTimeApprovalCode), normalizeCode(studentCode), "발급 승인번호가 요청값과 다릅니다.");
    created = true;
    const after = await adminAction(config, adminToken, { action: "list" });
    student = (after.students || []).find(row => row.name === studentName);
  }
  assert.ok(student?.id, "검수 학생을 확인하지 못했습니다.");
  assert.equal(student.status, "active", "검수 학생이 활성 상태가 아닙니다.");
  assert.ok(student.permissions.includes("hyperfocus"), "기본 Hyper Focus 권한이 없습니다.");
  return { student, created };
}

async function setUtilizationBundle(config, adminToken, studentId, enabled) {
  const result = await adminAction(config, adminToken, {
    action: "set_mock_bundle",
    studentId,
    bundleKey: "premier-utilization",
    enabled
  });
  assert.equal(result.enabled, enabled);
  assert.equal(result.bundleKey, "premier-utilization");
  return result;
}

async function verifySignedPages(exam) {
  assert.equal(exam.deliveryMode, "page_images");
  assert.equal(exam.questionCount, 20);
  assert.equal(exam.pages.length, 4);
  for (const page of exam.pages) {
    const response = await fetch(page.signedAssetUrl, { headers: { referer: `${origin}/hyper-focus/mock/viewer.html` } });
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200, `page ${page.pageNumber} signed URL`);
    assert.match(response.headers.get("content-type") || "", /^image\//);
    assert.ok(bytes.length > 10000, `page ${page.pageNumber} image too small`);
  }
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch (_) {
    return chromium.launch({ headless: true });
  }
}

async function loginPortal(page) {
  await page.goto(`${origin}/hyper-focus/?login=1&v=${Date.now()}`, { waitUntil: "networkidle" });
  if (await page.locator("#loginModal").getAttribute("hidden") !== null) {
    await page.locator("[data-login-open]").first().click();
  }
  await page.locator("#loginName").fill(studentName);
  await page.locator("#loginCode").fill(studentCode);
  await page.locator("#loginForm button[type=submit]").click();
  await page.locator("#libraryHome:not([hidden])").waitFor({ timeout: 20000 });
  await page.locator("#loginModal").waitFor({ state: "hidden", timeout: 20000 });
  assert.equal(await page.locator("#loginCode").getAttribute("type"), "text");
}

async function browserFlow() {
  fs.mkdirSync(artifactDirectory, { recursive: true });
  const browser = await launchBrowser();
  try {
    if (mobileOnly) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await loginPortal(page);
      const overflow = await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `mobile horizontal overflow: ${overflow}`);
      await page.screenshot({ path: path.join(artifactDirectory, "mobile-library.png"), fullPage: true });
      await context.close();
      return;
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    await loginPortal(page);
    const mockBook = page.locator('.library-book[data-product="mock"]').first();
    await mockBook.waitFor({ state: "visible", timeout: 20000 });
    const mockBookClass = await mockBook.getAttribute("class") || "";
    const mockBookLabel = await mockBook.getAttribute("aria-label") || "";
    assert.ok(mockBookClass.includes("unlocked"), `mock book locked: class=${mockBookClass}, label=${mockBookLabel}`);
    await mockBook.click();
    const round = page.getByRole("link", { name: /활용 모의고사 1회 응시하기/ });
    await round.waitFor({ timeout: 20000 });
    assert.equal(await page.getByRole("link", { name: /응시하기/ }).count(), 1);
    await Promise.all([page.waitForURL(/hyper-focus\/mock\/\?exam=premier-utilization-01/), round.click()]);
    await page.locator("#app").waitFor({ state: "visible", timeout: 30000 });
    assert.equal(await page.locator(".qcard").count(), 20);

    const viewerHref = await page.locator("#viewerLink").getAttribute("href");
    assert.ok(viewerHref, "시험지 뷰어 주소가 없습니다.");
    await page.locator("#viewerLink").evaluate(link => { link.target = "_self"; });
    await Promise.all([page.waitForURL(/viewer\.html/), page.locator("#viewerLink").click()]);
    await page.locator(".secure-page-image").first().waitFor({ timeout: 30000 });
    assert.equal(await page.locator(".secure-page-image").count(), 4);
    await page.waitForFunction(() => Array.from(document.querySelectorAll(".secure-page-image")).every(image => image.complete && image.naturalWidth > 1000));
    const videoLink = page.locator("#videoLink");
    assert.equal(await videoLink.isVisible(), true, "해설 영상 링크가 보이지 않습니다.");
    assert.match(await videoLink.getAttribute("href"), /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=/, "해설 영상 주소가 올바르지 않습니다.");
    await page.screenshot({ path: path.join(artifactDirectory, "desktop-viewer.png"), fullPage: true });
    await page.goBack({ waitUntil: "networkidle" });
    await page.locator("#app").waitFor({ state: "visible", timeout: 30000 });
    await page.locator(".qcard").first().waitFor({ timeout: 30000 });

    for (const card of await page.locator(".qcard").all()) await card.locator(".ox button").first().click();
    await page.locator("#submitBtn").click();
    await page.locator("#result").waitFor({ state: "visible", timeout: 30000 });
    assert.equal((await page.locator("#result .score").textContent()).trim(), "100");
    await page.screenshot({ path: path.join(artifactDirectory, "desktop-result.png"), fullPage: true });

    const mobile = await context.newPage();
    await mobile.setViewportSize({ width: 390, height: 844 });
    await loginPortal(mobile);
    const overflow = await mobile.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, `mobile horizontal overflow: ${overflow}`);
    await mobile.screenshot({ path: path.join(artifactDirectory, "mobile-library.png"), fullPage: true });
    await context.close();
  } finally {
    await browser.close();
  }
}

async function main() {
  requiredEnvironment();
  const config = readPublicConfig();
  const adminToken = studentOnly ? "" : await passwordSession(config, config.adminEmail, adminCode);
  const ensured = studentOnly ? { student: null, created: false } : await ensureStudent(config, adminToken);
  const { student, created } = ensured;
  let granted = false;
  try {
    if (!studentOnly) {
      await setUtilizationBundle(config, adminToken, student.id, true);
      granted = true;
    }
    const body = normalizeCode(studentCode).slice(2);
    const studentToken = await passwordSession(
      config,
      `hf.${body.toLowerCase()}@auth.gfieldacademy.net`,
      deriveStudentPassword(studentName, studentCode)
    );
    const available = await secureMockAction(config, studentToken, { action: "listExams" });
    assert.deepEqual((available.exams || []).map(exam => exam.id), ["premier-utilization-01"]);
    if (!skipDirectLoad) {
      const exam = await secureMockAction(config, studentToken, {
        action: "loadExam",
        examId: "premier-utilization-01",
        loadEventId: crypto.randomUUID()
      });
      await verifySignedPages(exam);
    }
    await browserFlow();

    const unauthenticated = await fetch(`${config.projectUrl}/functions/v1/secure-mock`, {
      method: "POST",
      headers: { apikey: config.publishableKey, "content-type": "application/json", origin },
      body: JSON.stringify({ action: "listExams" })
    });
    assert.equal(unauthenticated.status, 401);
  } finally {
    if (granted && !keepMockBundle) await setUtilizationBundle(config, adminToken, student.id, false);
  }

  if (!studentOnly) {
    const current = await adminAction(config, adminToken, { action: "list" });
    const verified = (current.students || []).find(row => row.id === student.id);
    assert.ok(verified);
    if (!keepMockBundle) assert.equal(verified.mockBundles?.utilization?.state, "none");
  }
  console.log(JSON.stringify({
    status: "PASS",
    mode: studentOnly ? "student-only" : "admin-and-student",
    studentCreated: created,
    oneTimeApprovalCode: created ? studentCode : "기존 번호 유지",
    defaultHyperFocusPermission: true,
    publishedEntitledExamCount: 1,
    pageImages: 4,
    solutionVideoLink: true,
    oxSubmissionStored: true,
    unauthenticatedSecureMockStatus: 401,
    utilizationBundleAfterTest: studentOnly || keepMockBundle ? "kept" : "revoked",
    artifacts: artifactDirectory
  }, null, 2));
}

main().catch(error => {
  console.error(`HF live student E2E: FAIL\n${error.stack || error.message}`);
  process.exitCode = 1;
});
