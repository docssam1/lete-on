const test = require("node:test");
const assert = require("node:assert/strict");

delete global.HIGHSELECT_PUBLIC_PROFILES;
require("../data/public-exam-profiles.js");
const data = global.HIGHSELECT_PUBLIC_PROFILES;

test("advertising profiles cover all six isolated program codes", () => {
  assert.deepEqual(data.profiles.map(profile => profile.code), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  assert.equal(new Set(data.profiles.map(profile => profile.publicName)).size, 6);
});

test("every advertising fact exposes its evidence state and source ids", () => {
  const states = new Set(["verified", "observed", "confirmed", "needs-review"]);
  data.profiles.forEach(profile => {
    assert.ok(profile.summary);
    assert.ok(profile.style);
    assert.ok(profile.caveat);
    assert.ok(profile.cutline);
    assert.ok(states.has(profile.cutline.state));
    assert.ok(profile.cutline.display);
    assert.ok(profile.cutline.context);
    assert.ok(Array.isArray(profile.cutline.sourceIds));
    profile.cutline.sourceIds.forEach(id => assert.ok(data.sources[id], `missing cutoff source ${id}`));
    if (profile.cutline.state === "verified") {
      assert.ok(profile.cutline.branch, `${profile.code} verified cutoff needs a branch`);
      assert.ok(profile.cutline.course, `${profile.code} verified cutoff needs a course`);
      assert.ok(profile.cutline.round, `${profile.code} verified cutoff needs a round`);
      assert.ok(profile.cutline.sourceIds.length, `${profile.code} verified cutoff needs a public source`);
    }
    assert.ok(profile.facts.length >= 3);
    profile.facts.forEach(fact => {
      assert.ok(fact.label);
      assert.ok(fact.value);
      assert.ok(states.has(fact.state));
      assert.ok(Array.isArray(fact.sourceIds));
      fact.sourceIds.forEach(id => assert.ok(data.sources[id], `missing source ${id}`));
      if (fact.state === "verified") assert.ok(fact.sourceIds.length, `${profile.code} verified fact needs a public source`);
      if (fact.state === "confirmed") assert.equal(fact.sourceIds.length, 0, `${profile.code} product confirmation must not cite an external source`);
    });
  });
});

test("cutoffs are scoped records and never a global academy number", () => {
  assert.equal(Object.prototype.hasOwnProperty.call(data, "cutline"), false);
  data.profiles.forEach(profile => {
    if (profile.cutline.state === "verified") {
      assert.equal(typeof profile.cutline.branch, "string");
      assert.equal(typeof profile.cutline.course, "string");
      assert.equal(typeof profile.cutline.round, "string");
    } else {
      assert.equal(profile.cutline.display, "확인 필요");
    }
  });
});

test("WM advertising uses the current middle2-1 cutoff and preserves round changes", () => {
  const wm = data.profiles.find(profile => profile.code === "WM");
  const middleFact = wm.facts.find(fact => fact.label === "중2-1 기본반 현행 구조");
  assert.equal(middleFact.value, "중1 대수 20 + 중1 기하 20 · 각 50분 · 통계 제외");
  assert.deepEqual(middleFact.sourceIds, ["WM-M21-JULY-2026"]);
  assert.equal(wm.cutline.course, "중2-1 기본반 신입");
  assert.equal(wm.cutline.display.startsWith("28 / 40문항"), true);
  assert.deepEqual(wm.roundProfiles.map(round => [round.id, round.questionCount, round.minimum]), [
    ["WM-CM1-BASIC-ENTRY-2025-09", 50, 35],
    ["WM-M21-BASIC-ENTRY-2026-07", 40, 28],
    ["WM-M22-BASIC-TRANSFER-2026-05", 45, 32],
    ["WM-M22-BASIC-TRANSFER-2026-09", 50, 35],
    ["WM-M31-BASIC-TRANSFER-2026-07", 50, 35],
    ["WM-M32-BASIC-TRANSFER-2026-06", 50, 35]
  ]);
  assert.equal(wm.roundProfiles.at(-1).state, "superseded");
  assert.equal(wm.caveat.includes("중등 심화듀얼과 고등 실력공수 듀얼을 섞지 않고"), true);
});

test("SH historical textbook evidence remains superseded by the current course model", () => {
  const sh = data.profiles.find(profile => profile.code === "SH");
  assert.equal(sh.facts.find(fact => fact.label === "현재 과정").value, "기본정석 Light · 기본정석 Plus · 실력정석");
  assert.equal(sh.facts.find(fact => fact.label === "개편 전 퀵테스트 후기").state, "observed");
  assert.match(sh.caveat, /2026년 교재 개편 전 자료/);
});

test("private scorecards enrich observed formats without replacing scoped public cutoffs", () => {
  const dp = data.profiles.find(profile => profile.code === "DP");
  const wm = data.profiles.find(profile => profile.code === "WM");
  assert.equal(dp.facts.find(fact => fact.label === "예비중1 성적표 사례").value, "공통수학1 기본 · 30문항 · 60점 컷");
  assert.equal(dp.cutline.course, "공통수학2 기본반 입학");
  assert.equal(wm.facts.find(fact => fact.label === "공수1 결과분석 사례").value, "중등대수 30 + 중등 기하·종합 30 · 문항별 유형표");
  assert.equal(wm.cutline.course, "중2-1 기본반 신입");
});

test("ED testimonial assessment is not promoted to an admission cutoff", () => {
  const ed = data.profiles.find(profile => profile.code === "ED");
  const reviewRule = ed.facts.find(fact => fact.label === "재원 총괄평가 후기 기준");
  assert.equal(reviewRule.value, "총 42점 이상 + 최소 2회 14점 이상");
  assert.equal(reviewRule.state, "observed");
  assert.deepEqual(reviewRule.sourceIds, ["ED-HIGH-REVIEW-YT"]);
  assert.equal(ed.cutline.state, "needs-review");
  assert.equal(ed.cutline.display, "확인 필요");
  assert.match(ed.caveat, /입학 커트라인이나 현행 공식 규정으로 사용하지 않습니다/);
});

test("SM common1 entry keeps current public format separate from legacy reference difficulty", () => {
  const sm = data.profiles.find(profile => profile.code === "SM");
  assert.equal(sm.facts.find(fact => fact.label === "현재 시험 범위").value, "중2-2 · 중3-1 · 중3-2");
  assert.equal(sm.facts.find(fact => fact.label === "현재 시험 구성").value, "대수 15 + 기하 15 · 총 30문항 · 180분");
  assert.equal(sm.cutline.display, "20 / 30문항 이상");
  assert.equal(sm.cutline.course, "중1 공통수학1 기본 입반");
  assert.equal(sm.facts.find(fact => fact.label === "현행 난도 보정").state, "confirmed");
  assert.match(sm.facts.find(fact => fact.label === "현행 난도 보정").value, /사용자 관찰/);
  assert.match(sm.facts.find(fact => fact.label === "구판 참고지 감사").value, /후보 분류/);
  assert.match(sm.caveat, /구판 모의 참고지는 현행 공식 기출이 아닙니다/);
  assert.match(sm.caveat, /생수형 공통수학1 입반 대비 추정 구성/);
});

test("public sources are dated HTTPS pages and do not expose private assets", () => {
  Object.values(data.sources).forEach(source => {
    assert.match(source.url, /^https:\/\//);
    assert.match(source.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(["A", "B", "C"].includes(source.grade));
  });
  const serialized = JSON.stringify(data);
  ["G:\\\\", "C:\\\\Users", "sourceAssetId", "sourcePath", ".pdf", "approvalCode"].forEach(term => {
    assert.equal(serialized.includes(term), false, `must not leak ${term}`);
  });
});
