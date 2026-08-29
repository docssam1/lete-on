const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const validator = require("../scripts/validate-private-sasmo-diagnostic.cjs");

const projectRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(projectRoot, "..");

function item(year, levelId, index) {
  return {
    itemId: `sasmo-${year}-${levelId.toLowerCase()}-q${String(index + 1).padStart(2, "0")}`,
    sourceLocator: `page ${Math.ceil((index + 1) / 5)}, question ${index + 1}`,
    axisId: ["number-operations", "patterns-algebra", "geometry-spatial", "combinatorics-logic", "data-probability", "problem-solving-strategies"][index % 6],
    skillId: `skill-${index + 1}`,
    responseType: "multiple-choice",
    primaryErrorType: "reasoning-error",
    answerProof: { answerProof: "official-answer-and-solution", officialLocator: `solution page ${Math.ceil((index + 1) / 5)}` },
    privateScoring: { answerKind: "option-id", answerValue: "B" }
  };
}

function pack(overrides) {
  const year = 2020;
  const levelId = "G6";
  return Object.assign({
    schemaVersion: validator.SCHEMA_VERSION,
    paper: {
      programId: "sasmo",
      year,
      levelId,
      sourcePageUrl: "https://form.simcc.org/2020-sasmo-past-year-paper/",
      sourceFingerprintSha256: "a".repeat(64)
    },
    items: Array.from({ length: 25 }, function (_, index) { return item(year, levelId, index); })
  }, overrides || {});
}

test("private SASMO intake requires one complete 25-question verified G2-G10 paper", function () {
  const result = validator.validatePack(pack());
  assert.equal(result.valid, true);
  assert.equal(result.itemCount, 25);
  assert.match(result.intakeFingerprint, /^[a-f0-9]{64}$/);
  assert.throws(function () { validator.validatePack(pack({ items: pack().items.slice(0, 24) })); }, /PAPER_ITEM_COUNT_INVALID/);
  const unverified = pack();
  unverified.items[3].answerProof = { answerProof: "unverified" };
  assert.throws(function () { validator.validatePack(unverified); }, /ANSWER_PROOF_UNVERIFIED/);
});

test("private SASMO authoring stays ignored and is covered by the public exposure audit", function () {
  const ignoreRules = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8");
  const publicAudit = fs.readFileSync(path.join(projectRoot, "scripts", "audit-public-exposure.cjs"), "utf8");
  assert.match(ignoreRules, /^private-sasmo-authoring\/\s*$/m);
  assert.match(publicAudit, /PRIVATE_SASMO_AUTHORING_TRACKED/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")).scripts["validate:private-sasmo"], "node scripts/validate-private-sasmo-diagnostic.cjs");
  const tracked = require("node:child_process").execFileSync(
    "git", ["ls-files", "-z", "--", "boarding-school-math/private-sasmo-authoring"], { cwd: repositoryRoot, encoding: "utf8" }
  );
  assert.equal(tracked, "");
});

test("private SASMO intake accepts an independently solved item only after two distinct matching solves", function () {
  const candidate = pack();
  candidate.items[0].answerProof = { answerProof: "independent-dual-solve", independentSolverIds: ["solver-a", "solver-b"], solversAgree: true };
  assert.equal(validator.validatePack(candidate).valid, true);
  candidate.items[0].answerProof = { answerProof: "independent-dual-solve", independentSolverIds: ["solver-a", "solver-a"], solversAgree: true };
  assert.throws(function () { validator.validatePack(candidate); }, /INDEPENDENT_SOLVERS_INVALID/);
});

test("private SASMO intake never makes an answer-bearing public manifest and rejects repository roots", function () {
  const manifest = validator.publicManifest(pack());
  const serialized = JSON.stringify(manifest);
  assert.equal(serialized.includes("privateScoring"), false);
  assert.equal(serialized.includes("answerValue"), false);
  assert.equal(serialized.includes("officialLocator"), false);
  assert.throws(function () { validator.assertExternalPrivateRoot(path.resolve(__dirname, "..")); }, /PRIVATE_ROOT_INSIDE_REPOSITORY/);
});

test("private SASMO intake loads only a fixed local filename from an external non-Git root", function () {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-sasmo-intake-"));
  try {
    const fileName = "sasmo-2020-g6-diagnostic.json";
    fs.writeFileSync(path.join(root, fileName), JSON.stringify(pack()), "utf8");
    assert.equal(validator.loadPrivatePack(root, fileName).validation.valid, true);
    assert.throws(function () { validator.loadPrivatePack(root, "anything.json"); }, /PRIVATE_PACK_FILENAME_INVALID/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
