"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const studioModule = require("../scripts/serve-private-sasmo-studio.cjs");

const repositoryRoot = path.resolve(__dirname, "..", "..");
const privateFiles = Object.freeze({
  paperFile: process.env.GFIELD_SASMO_2019_G6_PDF,
  packFile: process.env.GFIELD_SASMO_2019_G6_PACK,
  studentReviewFile: process.env.GFIELD_SASMO_2019_G6_STUDENT_REVIEW,
  teacherReviewFile: process.env.GFIELD_SASMO_2019_G6_TEACHER_REVIEW
});
const hasPrivateFiles = Object.values(privateFiles).every(function (file) { return Boolean(file && fs.existsSync(file)); });

test("private studio CLI requires four exact external inputs and a valid port", function () {
  const parsed = studioModule.parseArguments([
    "--paper", "paper.pdf", "--pack", "pack.json", "--student-review", "student.html", "--teacher-review", "teacher.html", "--port", "4319"
  ]);
  assert.equal(parsed.port, 4319);
  assert.equal(path.basename(parsed.studentReviewFile), "student.html");
  assert.throws(function () { studioModule.parseArguments(["--paper", "paper.pdf"]); }, /PRIVATE_STUDIO_COMMAND_INVALID/u);
  assert.throws(function () { studioModule.parseArguments(["--paper", "a", "--pack", "b", "--student-review", "c", "--teacher-review", "d", "--port", "70000"]); }, /PRIVATE_STUDIO_PORT_INVALID/u);
});

test("private studio never accepts a source file from inside the Git worktree", function () {
  assert.throws(function () {
    studioModule.prepareRuntime({ repositoryRoot, paperFile: __filename, packFile: __filename, studentReviewFile: __filename, teacherReviewFile: __filename });
  }, /PRIVATE_PAPER_INSIDE_GIT/u);
});

test("private studio QA output cannot resolve inside the Git worktree", function () {
  assert.throws(function () {
    studioModule.assertExternalOutputRoot(path.join(repositoryRoot, "boarding-school-math", "qa-private-studio"), repositoryRoot);
  }, /PRIVATE_STUDIO_QA_OUTPUT_INSIDE_GIT/u);
  const externalSibling = path.join(path.dirname(repositoryRoot), "private-sasmo-qa-output");
  assert.equal(studioModule.assertExternalOutputRoot(externalSibling, repositoryRoot), path.resolve(externalSibling));
});

test("token-gated localhost routes serve only the four verified private artifacts", { skip: !hasPrivateFiles }, async function () {
  const token = "A".repeat(32);
  const studio = studioModule.createPrivateSasmoStudio(Object.assign({ repositoryRoot, token }, privateFiles));
  await new Promise(function (resolve) { studio.server.listen(0, studioModule.HOST, resolve); });
  const base = `http://${studioModule.HOST}:${studio.server.address().port}`;
  try {
    const page = await fetch(`${base}/boarding-school-math/sasmo-real-paper.html`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /SASMO 실제 기출 진단실/u);
    for (const route of [
      "/boarding-school-math/learning-plan.html",
      "/boarding-school-math/concept-learning.html",
      "/boarding-school-math/unit-workbook.html",
      "/geometry/worksheet/render.js"
    ]) {
      const publicFlowAsset = await fetch(`${base}${route}`, { method: "HEAD" });
      assert.equal(publicFlowAsset.status, 200);
      assert.equal(publicFlowAsset.headers.get("cache-control"), "no-store");
    }
    const unrelatedRepositoryFile = await fetch(`${base}/boarding-school-math/package.json`);
    assert.equal(unrelatedRepositoryFile.status, 404);
    const ignoredPrivateDirectory = await fetch(`${base}/boarding-school-math/private-authoring/grade6-algebra-drafts.cjs`);
    assert.equal(ignoredPrivateDirectory.status, 404);

    const routes = ["paper.pdf", "pack.json", "review/student.html", "review/teacher.html"];
    for (const route of routes) {
      const response = await fetch(`${base}${studio.privateBase}/${route}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-gfield-private-studio"), "sasmo-2019-g6-v1");
      assert.equal(response.headers.get("cache-control"), "no-store");
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.ok(bytes.length > 0);
    }

    const student = await fetch(`${base}${studio.privateBase}/review/student.html`);
    assert.match(student.headers.get("content-security-policy"), /default-src 'none'/u);
    const studentHtml = await student.text();
    assert.match(studentHtml, /gfield-private-review-audience" content="student/u);
    assert.doesNotMatch(studentHtml, /(?:[A-Za-z]:\\|file:\/\/)/u);

    const wrongToken = await fetch(`${base}${studioModule.PRIVATE_ROUTE}${"B".repeat(32)}/pack.json`);
    assert.equal(wrongToken.status, 404);
    const traversal = await fetch(`${base}${studio.privateBase}/..%2F..%2Fboarding-school-math%2Fsasmo-real-paper.js`);
    assert.equal(traversal.status, 404);
    const post = await fetch(`${base}${studio.privateBase}/pack.json`, { method: "POST" });
    assert.equal(post.status, 405);
  } finally {
    await new Promise(function (resolve) { studio.server.close(resolve); });
  }
});
