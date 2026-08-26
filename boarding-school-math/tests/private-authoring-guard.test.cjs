const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(projectRoot, "..");

test("private authoring stays ignored, untracked, and backed by a local preflight", function () {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  const ignoreRules = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8");
  const publicAudit = fs.readFileSync(path.join(projectRoot, "scripts", "audit-public-exposure.cjs"), "utf8");

  assert.match(ignoreRules, /^private-authoring\/\s*$/m);
  assert.equal(packageJson.scripts["validate:private-grade6"], "node scripts/validate-private-grade6-authoring.cjs private-authoring");
  assert.equal(fs.existsSync(path.join(projectRoot, "scripts", "validate-private-grade6-authoring.cjs")), true);
  assert.match(publicAudit, /PRIVATE_AUTHORING_TRACKED/);

  const tracked = execFileSync(
    "git",
    ["ls-files", "-z", "--", "boarding-school-math/private-authoring"],
    { cwd: repositoryRoot, encoding: "utf8" }
  );
  assert.equal(tracked, "");
});
