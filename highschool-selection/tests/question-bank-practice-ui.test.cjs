const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const schemaSource = fs.readFileSync(path.join(root, "data", "question-bank-schema.js"), "utf8");
const engagementSource = fs.readFileSync(path.join(root, "data", "academy-engagement.js"), "utf8");
const pageSource = fs.readFileSync(path.join(root, "question-bank", "index.html"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(schemaSource, context);
vm.runInNewContext(engagementSource, context);
const bank = context.globalThis.HIGHSELECT_QUESTION_BANK;
const engagement = context.globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT;

test("practice bank keeps SH middle cumulative taxonomy inside a multi-track selector", () => {
  assert.deepEqual(Array.from(bank.curriculum.middle, item => item.id), ["M1", "M2", "M3"]);
  assert.equal(pageSource.includes("출제 모드와 목표 과정을 고릅니다"), true);
  assert.equal(pageSource.includes("scope-exam"), true);
  assert.equal(pageSource.includes("elementary-cumulative"), true);
  assert.equal(pageSource.includes("middle-cumulative"), true);
  assert.equal(pageSource.includes("selection-tracks.js"), true);
  assert.equal(pageSource.includes("academy-mode"), true);
  assert.equal(pageSource.includes("academy-target"), true);
  assert.equal(pageSource.includes("Scorecard Blueprint"), true);
  assert.equal(pageSource.includes("원본 문제 유형"), true);
  assert.equal(pageSource.includes("dp-original-question-types.js"), true);
});

test("academy profiles select report axes and type priorities without publishing source material", () => {
  assert.deepEqual(Array.from(bank.academyProfiles, profile => profile.id), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  const dp = bank.academyProfiles.find(profile => profile.id === "DP");
  assert.equal(pageSource.includes("{label:'일차함수',state:'종료 단원'}"), true);
  const transfer = dp.targets.find(target => target.id === "middle2-2-transfer");
  assert.equal(transfer.scopeKey, "middle1-1-to-linear-function");
  assert.equal(transfer.scopeKind, "terminal-unit");
  assert.equal(transfer.terminalUnit.unit, "일차함수");
  assert.equal(transfer.state, "scope-reassembly-required");
  assert.equal(transfer.label, "중2-2 입반 대비");
  assert.equal(transfer.difficultyPlan.includes("전 범위형 원본을 우선 사용"), true);
  const officialDolpaTargets = dp.targets.filter(target => target.officialProcess).map(target => target.id);
  assert.deepEqual(Array.from(officialDolpaTargets), [
    "middle-entry",
    "common1-entry",
    "common2-basic-entry",
    "common1-skill-entry",
    "common2-skill-entry",
    "algebra-basic-entry"
  ]);
  const director = dp.targets.find(target => target.id === "director-advanced");
  assert.equal(director.officialProcess, false);
  assert.deepEqual(Array.from(director.sourcePoolIds), ["ndh-advanced-mocks"]);
  assert.equal(director.difficultyPlan.includes("기본반 혼입 금지"), true);
  assert.equal(dp.targets.find(target => target.id === "common1-entry").recommendedExamId, "dp-common1-entry-202405");
  assert.equal(pageSource.includes("target.recommendedExamId"), true);
  assert.equal(dp.typeEmphasis.includes("그래프 해석"), true);
  assert.equal(dp.scorePolicy.includes("원본 배점·컷"), true);
});

test("one shared question registry can serve every academy blueprint", () => {
  assert.equal(bank.sharedRegistry.identityPolicy.includes("하나의 ID"), true);
  assert.deepEqual(Array.from(bank.sharedRegistry.consumers), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  const hwangso = bank.sharedRegistry.sourcePriorities.find(source => source.id === "hwangso-middle-textbooks");
  assert.deepEqual(Array.from(hwangso.priorityFor), ["SH"]);
  assert.deepEqual(Array.from(hwangso.reusableFor), ["DP", "WM", "ED", "DG", "SM"]);
  assert.equal(hwangso.sourceDifficultyBand, "high");
  assert.equal(hwangso.sourceRole, "academy-textbook-base");
  assert.equal(bank.sharedRegistry.academyStyleTagPolicy.cardinality, "many-to-many");
  assert.deepEqual(Array.from(bank.sharedRegistry.academyStyleTagPolicy.requiredFields), ["sourceFamilyId", "sourceDifficultyBand", "academyStyleTags", "academyFitDifficulty"]);
  assert.equal(bank.sharedRegistry.academyStyleTagPolicy.rule.includes("출처나 원천 난도를 바꾸지 않는다"), true);
  const ndh = bank.sharedRegistry.sourcePriorities.find(source => source.id === "ndh-advanced-mocks");
  assert.deepEqual(Array.from(ndh.priorityFor), ["DP"]);
  assert.deepEqual(Array.from(ndh.reusableFor), ["SH", "WM", "ED", "DG", "SM"]);
  assert.equal(ndh.sourceSummary, "수학(상) 17회분 · 수학(하) 19회분");
  assert.equal(ndh.reuseBand, "advanced");
  assert.equal(ndh.rule.includes("다른 학원형 심화 세트에도 공유"), true);
  assert.equal(ndh.rule.includes("기본반에는 자동으로 섞지 않는다"), true);
  assert.equal(bank.sharedRegistry.scopeIdentityPolicy.startsWith("지원 과정·시험 회차·실제 시험 범위"), true);
  assert.equal(bank.sharedRegistry.scopeIdentityPolicy.includes("응시 학년은 자격 조건"), true);
  assert.equal(bank.sharedRegistry.legacyCurriculumRemap.moved.some(rule => rule.includes("경우의 수")), true);
  assert.equal(bank.sharedRegistry.legacyCurriculumRemap.newlyRequired.includes("행렬: 공통수학1 현행 범위"), true);
  assert.equal(bank.sharedRegistry.compatibilityChecks.some(rule => rule.includes("2022 개정")), true);
  assert.equal(bank.sharedRegistry.perExamOverrides.includes("커트라인·과락"), true);
  assert.deepEqual(Array.from(bank.academyDifficultyOrder.order), ["WM", "DP", "ED"]);
  assert.deepEqual(Array.from(bank.academyDifficultyOrder.tiers, tier => [tier.academyId, tier.relativeDifficulty]), [["WM", 1], ["DP", 2], ["ED", 3]]);
  assert.equal(bank.academyDifficultyOrder.evidenceModel.rule.includes("체감 후기와 문항 자체 난도를 별도로 저장"), true);
  assert.equal(bank.academyDifficultyOrder.evidenceModel.rule.includes("공식 컷이나 기출 난도로 표시하지 않음"), true);
  assert.equal(bank.academyDifficultyOrder.note.includes("황소 교재 기반 고난도 출처군"), true);
});

test("every advertised academy course maps to one problem-bank target", () => {
  const profileById = new Map(bank.academyProfiles.map(profile => [profile.id, profile]));
  for (const program of engagement.programs) {
    const profile = profileById.get(program.code);
    assert.ok(profile, `${program.code} profile missing`);
    for (const course of program.courses) {
      const matches = profile.targets.filter(target => target.courseCode === course.id);
      assert.equal(matches.length, 1, `${program.code}.${course.id} target count`);
    }
  }
  assert.match(pageSource, /standardPolicy\.resolve/);
  assert.match(pageSource, /standard\.canApply/);
  assert.match(pageSource, /standard\.responseMixLabel/);
});

test("DOLPA keeps the middle1 course separate from applicant grade and other official courses", () => {
  const dp = bank.academyProfiles.find(profile => profile.id === "DP");
  const middle1 = dp.targets.find(item => item.id === "middle-entry");
  assert.equal(middle1.label, "중1 과정 입학");
  assert.equal(middle1.courseCode, "middle1");
  assert.equal(middle1.officialProcess, true);
  assert.equal(middle1.observedScope, "초5-1~초6-2 누적");
  assert.equal(Object.hasOwn(middle1, "applicantStages"), false);
  const common1 = dp.targets.find(item => item.id === "common1-entry");
  const common2 = dp.targets.find(item => item.id === "common2-basic-entry");
  assert.equal(common1.courseCode, "common1-basic");
  assert.equal(common1.scopeKey, "middle2-1-to-middle3-2");
  assert.equal(common2.courseCode, "common2-basic");
  assert.equal(common2.scopeKey, "common-math-1-basic-full");
  assert.equal(pageSource.includes("초5 누적"), true);
  assert.equal(pageSource.includes("초6 누적"), true);
});

test("Hwangso transfer is a real branch-and-month specific target", () => {
  const sh = bank.academyProfiles.find(profile => profile.id === "SH");
  const middleTransfer = sh.targets.find(target => target.id === "middle-transfer");
  const highTransfer = sh.targets.find(target => target.id === "high-transfer");
  assert.equal(middleTransfer.state, "official-process-verified-scope-dynamic");
  assert.equal(highTransfer.state, "official-process-verified-scope-dynamic");
  assert.deepEqual(Array.from(highTransfer.placementLevels), ["기본정석 Light", "기본정석 Plus", "실력정석"]);
  assert.equal(highTransfer.difficultyPlan.includes("지점별 배정 기준 자동 환산 금지"), true);
  assert.equal(pageSource.includes("중등 편입 대상 과정"), true);
  assert.equal(pageSource.includes("고등 편입 대상 과정"), true);
});

test("practice bank is student-session gated and exposes no admin route", () => {
  assert.equal(pageSource.includes("../shared/runtime.js"), true);
  assert.equal(pageSource.includes("../shared/auth.js"), true);
  assert.equal(pageSource.includes("HIGHSELECT_AUTH.requireSession('../login.html')"), true);
  assert.equal(pageSource.includes("../admin/"), false);
  assert.equal(pageSource.includes("승인 관리"), false);
});

test("repeat practice keeps original, twin, similar, and mastery stages", () => {
  assert.deepEqual(Array.from(bank.practice.stages, item => item.id), ["original", "twin", "similar", "mastery"]);
  assert.deepEqual(Array.from(bank.practice.bands, item => item.id), ["lowered", "standard", "raised"]);
  assert.equal(bank.practice.releaseRules.some(rule => rule.includes("같은 수치만 반복하지 않음")), true);
  assert.equal(bank.practice.releaseRules.some(rule => rule.includes("최근 풀이 이력")), true);
  assert.equal(pageSource.includes("exam.releaseStatus==='released'"), true);
  assert.equal(pageSource.includes("exam.classificationStatus==='verified'"), true);
  assert.equal(pageSource.includes("exam.answerStatus==='verified'"), true);
  assert.equal(pageSource.includes("쌍둥이·유사문제, 표준 시험지 승인이 모두 끝나기 전에는 연습 세트를 열지 않습니다"), true);
});

test("practice page exposes no original, answer, or private path payload", () => {
  const serialized = schemaSource + "\n" + pageSource;
  ["questionText", "answerKey", "correctAnswer", "G:\\\\", "C:\\\\Users", ".pdf"].forEach(term => {
    assert.equal(serialized.includes(term), false, `${term} must stay private`);
  });
  assert.equal(pageSource.includes("hsmiddle/data.js"), false, "hsmiddle student and answer data must not be imported");
});
