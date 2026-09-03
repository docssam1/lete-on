const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const builder = require("../scripts/build-highselect-edge-catalog.cjs");

const repoRoot = path.resolve(__dirname, "..", "..");
const functionRoot = path.join(repoRoot, "supabase", "functions", "highselect-catalog");

function sampleSnapshot() {
  return {
    schemaVersion: builder.SCHEMA_VERSION,
    snapshotRevision: "test",
    profiles: [{ profileId: "SM_STANDARD", programId: "SM", label: "생수형" }],
    representativeAnalyses: [{ profileId: "SM_STANDARD", publicLabel: "대표 분석", status: "locked", canCompose: false }],
    items: [
      { questionId: "safe-1", sourceLabel: "참고 자료", semester: "중3-1", majorUnit: "함수", minorUnit: "이차함수", typeId: "type-1", typeLabel: "그래프", domainGroup: "algebra", releaseEligible: false, profiles: [{ profileId: "SM_STANDARD", label: "생수형", status: "candidate" }] },
      { questionId: "safe-2", sourceLabel: "검수 자료", semester: "중3-2", majorUnit: "도형", minorUnit: "원", typeId: "type-2", typeLabel: "원주각", domainGroup: "geometry", releaseEligible: true, profiles: [{ profileId: "SM_STANDARD", label: "생수형", status: "approved" }] }
    ]
  };
}

test("edge catalog core filters locked candidates unless the administrator asks to include them", async () => {
  const core = await import(pathToFileURL(path.join(functionRoot, "core.mjs")).href);
  const normal = core.searchSnapshot(sampleSnapshot(), new URLSearchParams({ profiles: "SM_STANDARD", limit: "300" }));
  assert.deepEqual(normal.items.map(item => item.questionId), ["safe-2"]);
  const candidates = core.searchSnapshot(sampleSnapshot(), new URLSearchParams({ profiles: "SM_STANDARD", includeCandidates: "1", q: "이차함수", limit: "300" }));
  assert.deepEqual(candidates.items.map(item => item.questionId), ["safe-1"]);
  assert.equal(candidates.representativeAnalyses[0].canCompose, false);
});

test("edge catalog rejects unknown profiles, query keys, and unsafe limits", async () => {
  const core = await import(pathToFileURL(path.join(functionRoot, "core.mjs")).href);
  assert.throws(() => core.searchSnapshot(sampleSnapshot(), new URLSearchParams({ profiles: "UNKNOWN" })), /profiles_invalid/);
  assert.throws(() => core.searchSnapshot(sampleSnapshot(), new URLSearchParams({ profiles: "SM_STANDARD", path: "x" })), /query_invalid/);
  assert.throws(() => core.searchSnapshot(sampleSnapshot(), new URLSearchParams({ profiles: "SM_STANDARD", limit: "301" })), /limit_invalid/);
});

test("snapshot builder rejects originals, answers, paths, and URLs", () => {
  [
    { answer: "12" },
    { questionText: "문제" },
    { locator: "시험지 3쪽" },
    { harmless: "C:\\private\\source.pdf" },
    { harmless: "https://private.example/source" }
  ].forEach(value => assert.throws(() => builder.rejectProtectedPayload(value, "fixture"), /prohibited|protected/));
  assert.doesNotThrow(() => builder.rejectProtectedPayload({ reviewChecks: { locator: true } }, "fixture"));
  assert.doesNotThrow(() => builder.rejectProtectedPayload(sampleSnapshot(), "fixture"));
});

test("edge function remains admin-only and generated snapshot stays ignored", () => {
  const source = fs.readFileSync(path.join(functionRoot, "index.ts"), "utf8");
  const ignore = fs.readFileSync(path.join(repoRoot, ".gitignore"), "utf8");
  assert.match(source, /requireActiveAdmin/);
  assert.match(source, /service\.auth\.getUser\(token\)/);
  assert.match(source, /from\("hs_accounts"\)/);
  assert.match(source, /https:\/\/lete-on\.gfieldacademy\.net/);
  assert.doesNotMatch(source, /SUPABASE_(?:SERVICE_ROLE|SECRET)_KEY\s*[=:]\s*["'][^"']+/);
  assert.match(ignore, /\/supabase\/functions\/highselect-catalog\/catalog\.json/);
  const generatedPath = path.join(functionRoot, "catalog.json");
  if (fs.existsSync(generatedPath)) {
    const generated = JSON.parse(fs.readFileSync(generatedPath, "utf8"));
    assert.doesNotThrow(() => builder.rejectProtectedPayload(generated, "generated"));
    assert.equal(generated.schemaVersion, builder.SCHEMA_VERSION);
  }
});

test("static runtime uses cloud admin auth without putting access tokens in local storage", () => {
  const runtime = fs.readFileSync(path.join(repoRoot, "highschool-selection", "shared", "runtime.js"), "utf8");
  const auth = fs.readFileSync(path.join(repoRoot, "highschool-selection", "shared", "auth.js"), "utf8");
  assert.match(runtime, /lete-on\.gfieldacademy\.net/);
  assert.match(runtime, /functions\/v1\/hs-admin-session/);
  assert.match(runtime, /functions\/v1\/highselect-catalog/);
  assert.match(runtime, /sb_publishable_/);
  assert.match(auth, /sessionStorage\.setItem\(CLOUD_SESSION_KEY/);
  assert.doesNotMatch(auth, /localStorage\.setItem\(CLOUD_SESSION_KEY/);
  assert.match(auth, /grant_type=refresh_token/);
  assert.match(auth, /Authorization: `Bearer \$\{session\.accessToken\}`/);
  assert.doesNotMatch(runtime + auth, /service_role|SUPABASE_SERVICE_ROLE_KEY/);
});
