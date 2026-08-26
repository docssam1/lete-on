const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const validator = require("../scripts/validate-private-grade6-workbook.cjs");
const publicAudit = require("../scripts/audit-public-exposure.cjs");

function writeFixtureFile(root, relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function runFixtureGit(root, argumentsList) {
  return execFileSync("git", argumentsList, { cwd: root, encoding: "utf8" });
}

function createTempGitRepository() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-public-audit-"));
  assert.notEqual(path.resolve(root), repositoryRoot);
  runFixtureGit(root, ["init", "--quiet"]);
  runFixtureGit(root, ["config", "core.autocrlf", "false"]);
  runFixtureGit(root, ["config", "user.name", "GFIELD Test"]);
  runFixtureGit(root, ["config", "user.email", "gfield-test@example.invalid"]);
  writeFixtureFile(root, "README.md", "fixture\n");
  runFixtureGit(root, ["add", "--", "README.md"]);
  runFixtureGit(root, ["commit", "--quiet", "-m", "fixture baseline"]);
  return root;
}

function commitAllFixtureFiles(root, message) {
  runFixtureGit(root, ["add", "--all"]);
  runFixtureGit(root, ["commit", "--quiet", "-m", message]);
}

function hasFinding(findings, code) {
  return findings.some(function (finding) { return finding.code === code; });
}

test("private workbook authoring requires an external JSON-only root and is never tracked", function () {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  const ignoreRules = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8");
  const validatorSource = fs.readFileSync(path.join(projectRoot, "scripts", "validate-private-grade6-workbook.cjs"), "utf8");
  const publicAuditSource = fs.readFileSync(path.join(projectRoot, "scripts", "audit-public-exposure.cjs"), "utf8");

  assert.match(ignoreRules, /^private-workbook-authoring\/\s*$/m);
  assert.equal(packageJson.scripts["validate:private-grade6-workbook"], "node scripts/validate-private-grade6-workbook.cjs");
  assert.match(validatorSource, /GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT/);
  assert.match(validatorSource, /PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY/);
  assert.match(validatorSource, /PRIVATE_WORKBOOK_PREFLIGHT_BLOCKED_IN_CI/);
  assert.match(validatorSource, /workbook-draft\\\.json/);
  assert.match(validatorSource, /TEACHING_COMPONENT_TYPES/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_AUTHORING_TRACKED/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_HISTORY_PRESENT/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_MARKER_TRACKED/);
  assert.match(publicAuditSource, /--cached/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT/);
  assert.match(publicAuditSource, /--is-shallow-repository/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_HISTORY_INCOMPLETE/);

  const tracked = execFileSync(
    "git",
    ["ls-files", "-z", "--", "boarding-school-math/private-workbook-authoring"],
    { cwd: repositoryRoot, encoding: "utf8" }
  );
  assert.equal(tracked, "");
  assert.throws(function () {
    validator.validateDirectory(projectRoot);
  }, /PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY/);
});

test("student answer disclosures fail closed without treating a condition number as an answer", function () {
  const blocked = [
    ["Find the result of 7 + 0.", "7"],
    ["결과： 7", "7"],
    ["Result: \\boxed{7}", "7"],
    ["结果 = 7", "7"],
    ["Result - 7", "7"],
    ["结果—7", "7"],
    ["Answer → 7", "7"],
    ["Answer ➜ 7", "7"],
    ["Result • 7", "7"],
    ["结果−7", "7"],
    ["Answer 7:11", "7:11"],
    ["Answer 7 : 11", "7:11"],
    ["Answer 7 ∶ 11", "7:11"],
    ["Answer 7 ⋮ 11", "7:11"],
    ["Answer\u200B7", "7"],
    ["Result\u20607", "7"],
    ["结果\u200e7", "7"],
    ["Answer\u00077", "7"],
    ["Answer\u034F7", "7"],
    ["Answer\uFE0F7", "7"],
    ["Answer \\to 7", "7"],
    ["Answer \\quad 7", "7"],
    ["$\\text{Answer}\\quad 7$", "7"],
    ["Answer 7\u200B:\u200B11", "7:11"],
    ["Answer 7\u034F:11", "7:11"],
    ["Answer 7\\colon 11", "7:11"],
    ["Answer 7\\mathbin{:}11", "7:11"],
    ["정답은 4:7", "4:7"]
  ];
  blocked.forEach(function (entry) {
    assert.throws(function () {
      validator.assertStudentContentDoesNotRevealAnswer(entry[0], entry[1], "synthetic-component");
    }, /STUDENT_ANSWER_LEAK/);
  });
  [
    ["The condition gives 117 as an input value.", "17"]
  ].forEach(function (entry) {
    assert.doesNotThrow(function () {
      validator.assertStudentContentDoesNotRevealAnswer(entry[0], entry[1], "synthetic-component");
    });
  });
});

test("public audit checks staged index and all marker history without touching this repository", function () {
  const stagedRoot = createTempGitRepository();
  const historyRoot = createTempGitRepository();
  const shallowRoot = createTempGitRepository();
  try {
    writeFixtureFile(stagedRoot, "archive/draft.json", publicAudit.confidentialityMarker);
    runFixtureGit(stagedRoot, ["add", "--", "archive/draft.json"]);
    writeFixtureFile(stagedRoot, "archive/draft.json", "working-tree marker removed\n");
    const stagedFindings = publicAudit.collectFindings(stagedRoot);
    assert.equal(hasFinding(stagedFindings, "PRIVATE_WORKBOOK_MARKER_TRACKED"), true);
    assert.equal(hasFinding(stagedFindings, "PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT"), false);

    writeFixtureFile(historyRoot, "archive/deleted-draft.json", publicAudit.confidentialityMarker);
    commitAllFixtureFiles(historyRoot, "add private marker fixture");
    fs.rmSync(path.join(historyRoot, "archive", "deleted-draft.json"));
    commitAllFixtureFiles(historyRoot, "remove private marker fixture");
    const historyFindings = publicAudit.collectFindings(historyRoot);
    assert.equal(hasFinding(historyFindings, "PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT"), true);

    const shallowFindings = publicAudit.collectFindings(shallowRoot, function (root, argumentsList) {
      if (argumentsList[0] === "rev-parse" && argumentsList[1] === "--is-shallow-repository") {
        return { status: 0, stdout: "true\n" };
      }
      return spawnSync("git", argumentsList, { cwd: root, encoding: "utf8" });
    });
    assert.equal(hasFinding(shallowFindings, "PRIVATE_WORKBOOK_HISTORY_INCOMPLETE"), true);
  } finally {
    fs.rmSync(stagedRoot, { recursive: true, force: true });
    fs.rmSync(historyRoot, { recursive: true, force: true });
    fs.rmSync(shallowRoot, { recursive: true, force: true });
  }
});

test("private workbook preflight rejects CI, non-JSON files, and a nested junction path", function () {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-workbook-"));
  try {
    const nonJsonRoot = path.join(tempRoot, "non-json");
    fs.mkdirSync(nonJsonRoot);
    fs.writeFileSync(path.join(nonJsonRoot, "note.txt"), "x", "utf8");
    assert.throws(function () {
      validator.validateDirectory(nonJsonRoot);
    }, /PRIVATE_WORKBOOK_FILE_NAME_INVALID/);

    const originalCi = process.env.CI;
    process.env.CI = "1";
    try {
      assert.throws(function () {
        validator.validateDirectory(nonJsonRoot);
      }, /PRIVATE_WORKBOOK_PREFLIGHT_BLOCKED_IN_CI/);
    } finally {
      if (originalCi == null) delete process.env.CI;
      else process.env.CI = originalCi;
    }

    const targetRoot = path.join(tempRoot, "target", "drafts");
    fs.mkdirSync(targetRoot, { recursive: true });
    const junctionRoot = path.join(tempRoot, "junction");
    fs.symlinkSync(path.join(tempRoot, "target"), junctionRoot, "junction");
    assert.throws(function () {
      validator.validateDirectory(path.join(junctionRoot, "drafts"));
    }, /PRIVATE_WORKBOOK_ROOT_UNSAFE/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
