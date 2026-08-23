"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const helperSource = fs.readFileSync(path.join(root, "portal-collection.js"), "utf8");
const portalSource = fs.readFileSync(path.join(root, "portal.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");

function helper() {
  const context = {};
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(helperSource, context, { filename: "portal-collection.js" });
  return context.GFieldHFPortalCollection;
}

function releaseCatalog(overrides = {}) {
  const definitions = [
    ["utilization", "활용 모의고사", 8],
    ["final", "파이널 모의고사", 3],
    ["last", "최종 모의고사", 4]
  ];
  return {
    series: definitions.map(([key, label, count]) => ({
      key,
      label,
      rounds: Array.from({ length: count }, (_, index) => {
        const slug = `premier-${key}-${String(index + 1).padStart(2, "0")}`;
        return {
          key: slug,
          label: `${label} ${index + 1}회`,
          releaseStatus: "review_pending",
          visualGate: true,
          ...(overrides[slug] || {})
        };
      })
    }))
  };
}

function flat(groups) {
  return groups.flatMap(group => group.rounds);
}

function testReleaseAndEntitlementIntersection() {
  const api = helper();
  const catalog = releaseCatalog({
    "premier-utilization-01": { releaseStatus: "published", visualGate: false },
    "premier-utilization-02": { releaseStatus: "release-ready", visualGate: false },
    "premier-utilization-03": { releaseStatus: "published", visualGate: true },
    "premier-final-01": { releaseStatus: "published", visualGate: false }
  });
  const exams = [
    { id: "premier-utilization-01", slug: "premier-utilization-01", series: "utilization", roundNo: 1, status: "published" },
    { id: "premier-utilization-02", slug: "premier-utilization-02", series: "utilization", roundNo: 2, status: "published" },
    { id: "premier-utilization-03", slug: "premier-utilization-03", series: "utilization", roundNo: 3, status: "published" },
    { id: "premier-last-01", slug: "premier-last-01", series: "wrong-series", roundNo: 1, status: "published" },
    { id: "premier-utilization-04", slug: "premier-utilization-04", series: "utilization", roundNo: 4, status: "published" }
  ];
  const rows = flat(api.buildGroups(catalog, exams, { remoteLoaded: true }));

  assert.equal(rows.length, 15, "활용 8회·파이널 3회·최종 4회가 항상 보여야 합니다.");
  assert.equal(rows[0].state, "open");
  assert.equal(rows[0].action, "응시하기");
  assert.equal(rows[0].href, "./mock/?exam=premier-utilization-01");
  assert(!/[?&](?:student|seed|attempt)=/i.test(rows[0].href));
  assert.equal(rows[1].state, "locked", "release-ready는 실제 published 전까지 열면 안 됩니다.");
  assert.equal(rows[2].state, "locked", "시각 검수 게이트가 남은 회차는 열면 안 됩니다.");
  assert.equal(rows[3].state, "review_pending", "검수 대기 회차는 RLS 목록에 있어도 열면 안 됩니다.");
  assert.equal(rows[8].state, "locked", "공개 상태여도 개인별 RLS 목록에 없으면 잠겨야 합니다.");

  const beforeRemote = flat(api.buildGroups(catalog, exams, { remoteLoaded: false }));
  assert.equal(beforeRemote[0].state, "locked", "권한 응답 전에는 공개 회차도 잠금 상태여야 합니다.");
  assert.equal(beforeRemote[3].state, "review_pending");
  assert.equal(flat(api.buildGroups(null, [], { remoteLoaded: false })).length, 15);
  assert(flat(api.buildGroups(null, [], { remoteLoaded: false })).every(row => row.state === "review_pending"));
}

async function testFeatureGateAndRequestDeduplication() {
  const api = helper();
  const remoteSession = { backend: "supabase", userId: "student-1" };
  const secureApi = { listExams() {} };
  assert.equal(api.canLoadRemote({ enabled: false, features: { secureMockDelivery: true } }, remoteSession, secureApi), false);
  assert.equal(api.canLoadRemote({ enabled: true, features: { secureMockDelivery: false } }, remoteSession, secureApi), false);
  assert.equal(api.canLoadRemote({ enabled: true, features: { secureMockDelivery: true } }, { backend: "legacy" }, secureApi), false);
  assert.equal(api.canLoadRemote({ enabled: true, features: { secureMockDelivery: true } }, remoteSession, secureApi), true);

  const loader = api.createExamLoader();
  let calls = 0;
  let release;
  const deferred = new Promise(resolve => { release = resolve; });
  const fetcher = () => { calls += 1; return deferred; };
  const first = loader.load(remoteSession, fetcher);
  const duplicate = loader.load(remoteSession, fetcher);
  assert.strictEqual(first, duplicate, "동시에 연 목록 요청은 하나의 Promise를 공유해야 합니다.");
  await Promise.resolve();
  assert.equal(calls, 1);
  release([{ id: "premier-utilization-01" }]);
  await first;
  await loader.load(remoteSession, fetcher);
  assert.equal(calls, 1, "같은 로그인에서는 성공한 목록을 다시 요청하지 않아야 합니다.");

  let failures = 0;
  loader.reset();
  await assert.rejects(loader.load(remoteSession, () => {
    failures += 1;
    return Promise.reject(new Error("private backend detail"));
  }));
  await loader.load(remoteSession, () => {
    failures += 1;
    return Promise.resolve([]);
  }, { force: true });
  assert.equal(failures, 2, "실패 후 명시적인 재시도는 가능해야 합니다.");

  loader.reset();
  await assert.rejects(loader.load(remoteSession, () => Promise.resolve({ exams: [] })),
    /응답 형식/, "비배열 응답을 빈 권한 목록 성공으로 캐시하면 안 됩니다.");

  loader.reset();
  const otherSession = { backend: "supabase", userId: "student-2" };
  let resolveOld;
  const oldRequest = loader.load(remoteSession, () => new Promise(resolve => { resolveOld = resolve; }));
  await Promise.resolve();
  const currentRows = await loader.load(otherSession, () => Promise.resolve([]));
  resolveOld([{ id: "premier-utilization-01" }]);
  await oldRequest;
  assert.equal(currentRows.length, 0);
  let currentOwnerCalls = 0;
  await loader.load(otherSession, () => { currentOwnerCalls += 1; return Promise.resolve([]); });
  assert.equal(currentOwnerCalls, 0, "이전 사용자의 늦은 응답이 현재 사용자의 캐시를 덮으면 안 됩니다.");
}

function testStaticPortalContract() {
  const releaseIndex = indexHtml.indexOf('<script src="./mock/premier-release-catalog.js"></script>');
  const secureIndex = indexHtml.indexOf('<script src="./secure-mock.js"></script>');
  const helperIndex = indexHtml.indexOf('<script src="./portal-collection.js"></script>');
  const portalIndex = indexHtml.indexOf('<script src="./portal.js"></script>');
  assert(releaseIndex > -1 && secureIndex > releaseIndex && helperIndex > secureIndex && portalIndex > helperIndex,
    "공개 카탈로그·보안 클라이언트·결합 모듈은 portal.js보다 먼저 로드해야 합니다.");
  assert.match(indexHtml, /id="collectionStatus"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(indexHtml, /id="collectionRetry"[^>]*hidden/);

  assert.match(portalSource, /auth\.canAccess\(session, product\.permission\)/,
    "큰 모의고사 책은 기존 상품 권한으로 제어해야 합니다.");
  assert.match(portalSource, /if \(!secureCollectionConfigured\(\)\) return;/,
    "기능 플래그가 꺼진 경우 목록 요청 전 즉시 중단해야 합니다.");
  assert.match(portalSource, /GFieldHFSecureMock\.listExams\(\)/,
    "개인별 회차 목록은 인자 없이 요청해야 합니다.");
  assert.doesNotMatch(portalSource, /listExams\([^)]*(?:student|seed|attempt|approval)/i);
  assert.doesNotMatch(portalSource, /innerHTML\s*=\s*[^;]*(?:error|message)/i,
    "서버 오류 문자열을 HTML로 렌더하면 안 됩니다.");
  assert.match(portalSource, /status\.textContent = String\(message \|\| ""\)/,
    "상태 메시지는 textContent로 표시해야 합니다.");
  assert.match(portalSource, /modal\.id === "collectionModal"\) closeCollection\(\)/,
    "Escape로 닫을 때도 진행 중인 회차 목록 응답을 무효화해야 합니다.");
}

async function main() {
  testReleaseAndEntitlementIntersection();
  await testFeatureGateAndRequestDeduplication();
  testStaticPortalContract();
  console.log("Hyper Focus secure Premier portal collection QA: PASS");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
