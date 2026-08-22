const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const catalogSource = fs.readFileSync(path.join(root, "data", "catalog.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(catalogSource, context);
const catalog = context.globalThis.HIGHSELECT_CATALOG;

test("first SH exam stays locked until answer and curriculum review", () => {
  const exam = catalog.exams.find(item => item.id === "sh-selection-r01");
  assert.equal(exam.questionCount, 40);
  assert.equal(exam.pageCount, 8);
  assert.equal(exam.sourcePageCount, 11);
  assert.equal(exam.privateAnswerPageCount, 3);
  assert.equal(exam.releaseStatus, "review_pending");
  assert.equal(exam.reviewProgress.answerReview, "blocked");
  assert.equal(exam.reviewProgress.answerReviewIssues, 5);
  assert.equal(exam.reviewProgress.curriculumReview, "draft");
  assert.equal(exam.reviewProgress.curriculumHighConfidence, 28);
  assert.equal(exam.reviewProgress.curriculumOwnerReview, 12);
  assert.equal(exam.reviewProgress.responseShapeReview, "draft");
  assert.equal(exam.reviewProgress.visualReview, "blocked");
  assert.equal(exam.reviewProgress.visualReviewIssues, 4);
  assert.equal(catalog.writer, "T");
});

test("version and structure conflicts remain blocked instead of being assembled as current exams", () => {
  const dp = catalog.exams.find(item => item.id === "dp-common1-entry");
  assert.equal(dp.sourceStatus, "version_unmatched");
  assert.equal(dp.releaseStatus, "blocked");
  const wm = catalog.exams.find(item => item.id === "wm-algebra-geometry-diagnostic");
  assert.equal(wm.questionCount, 50);
  assert.equal(wm.sourceStatus, "structure_conflict");
  assert.equal(wm.releaseStatus, "blocked");
  assert.deepEqual(Array.from(wm.sourceCandidates, item => item.questionCount), [25, 26]);
});

test("the audited DP source revision is a separate locked review round", () => {
  const exam = catalog.exams.find(item => item.id === "dp-common1-entry-202405");
  assert.equal(exam.programId, "DP");
  assert.equal(exam.questionCount, 30);
  assert.equal(exam.pageCount, 10);
  assert.equal(exam.sourcePageCount, 11);
  assert.equal(exam.privateAnswerPageCount, 1);
  assert.equal(exam.sourceStatus, "audited");
  assert.equal(exam.answerStatus, "found");
  assert.equal(exam.classificationStatus, "verified");
  assert.equal(exam.releaseStatus, "review_pending");
});

test("operational student pages use neutral program codes", () => {
  assert.deepEqual(Array.from(catalog.programs, item => item.id), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  const operationalSources = [
    catalogSource,
    fs.readFileSync(path.join(root, "index.html"), "utf8"),
    fs.readFileSync(path.join(root, "library.html"), "utf8"),
    fs.readFileSync(path.join(root, "exam.html"), "utf8"),
    fs.readFileSync(path.join(root, "report.html"), "utf8"),
    fs.readFileSync(path.join(root, "data", "question-bank-schema.js"), "utf8")
  ].join("\n");
  ["황소", "돌파", "원수학", "이든", "깊은생각", "깊생", "생수"].forEach(name => assert.equal(operationalSources.includes(name), false, `${name} 노출`));
});

test("shared product branding is multi-track rather than high-school-only", () => {
  const sharedPages = [
    "index.html",
    "login.html",
    "library.html",
    "exam.html",
    "report.html",
    path.join("question-bank", "index.html"),
    path.join("admin", "index.html"),
    path.join("admin", "review.html"),
    path.join("admin", "item-review.html")
  ].map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  assert.equal(sharedPages.includes("고등 선발 연구소"), false);
  assert.equal(sharedPages.includes("<span class=\"brand-mark\">HS</span>"), false);
  assert.equal(sharedPages.includes("<span class=\"brand-mark\">SL</span>"), true);
  assert.equal(sharedPages.includes("누테"), false);

  const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
  ["고등과정 선발", "중1 입학", "중등 편입", "공통수학 입반"].forEach(term => {
    assert.equal(home.includes(term), true, `${term} 공용 소개 누락`);
  });
});

test("public advertising may name academies but never leaks private exam data", () => {
  const promo = fs.readFileSync(path.join(root, "promo", "index.html"), "utf8");
  ["생각하는황소", "돌파", "원수학", "이든", "깊은생각", "생수"].forEach(name => assert.equal(promo.includes(name), true, `${name} 광고 누락`));
  ["sourceAssetId", "sourcePath", "G:\\", "approvalCode", "answerKey"].forEach(term => assert.equal(promo.includes(term), false, `${term} 광고 노출`));
});

test("static build contains no local approval preview bypass", () => {
  const admin = fs.readFileSync(path.join(root, "shared", "admin-page.js"), "utf8");
  const auth = fs.readFileSync(path.join(root, "shared", "auth.js"), "utf8");
  const login = fs.readFileSync(path.join(root, "login.html"), "utf8");
  assert.equal(admin.includes("preview-grants"), false);
  assert.equal(admin.includes("localWrite"), false);
  assert.equal(auth.includes("function preview"), false);
  assert.equal(auth.includes("function requireAdmin"), true);
  assert.equal(login.includes("preview-login"), false);
  assert.equal(login.includes("!next.startsWith('//')"), true);
  assert.equal(admin.includes("'GF-'"), true);
  assert.equal(admin.includes("'HS-'"), false);
});

test("SH answer sheet keeps the hsmiddle 40-item layout without video UI", () => {
  const examPage = fs.readFileSync(path.join(root, "shared", "exam-page.js"), "utf8");
  const examHtml = fs.readFileSync(path.join(root, "exam.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "shared", "app.css"), "utf8");
  assert.equal(examPage.includes("session.studentId}:${exam.id}:${number}"), true);
  assert.equal(css.includes(".answer-grid { display: grid; grid-template-columns: repeat(4, 1fr)"), true);
  assert.equal(examHtml.includes("영상"), false);
});
