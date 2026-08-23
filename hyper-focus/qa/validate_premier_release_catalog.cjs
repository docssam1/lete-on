"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "mock", "premier-release-catalog.js");
const source = fs.readFileSync(sourcePath, "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: sourcePath });

const catalog = context.window.GFIELD_HF_PREMIER_RELEASE_CATALOG;
assert(catalog && typeof catalog === "object", "공개 회차 카탈로그를 찾을 수 없습니다.");
assert.deepStrictEqual(Object.keys(catalog).sort(), ["series", "version"], "카탈로그 최상위 필드가 안전 계약과 다릅니다.");
assert.strictEqual(catalog.series.length, 3, "회차 묶음은 활용·파이널·최종 세 개여야 합니다.");

const expected = [
  ["utilization", "premier-utilization", 8, [[20, 0], [13, 7], [16, 4], [14, 6], [19, 1], [15, 5], [13, 7], [17, 3]]],
  ["final", "premier-final", 3, [[8, 12], [13, 7], [16, 4]]],
  ["last", "premier-last", 4, [[16, 4], [17, 3], [14, 6], [15, 5]]]
];
const allowedSeriesKeys = ["key", "label", "rounds"];
const allowedRoundKeys = ["href", "key", "label", "lockedCount", "releaseStatus", "verifiedCount", "visualGate"];
const allowedStates = new Set(["review_pending", "locked"]);

catalog.series.forEach((series, seriesIndex) => {
  const [expectedKey, roundKeyPrefix, expectedLength, expectedCounts] = expected[seriesIndex];
  assert.deepStrictEqual(Object.keys(series).sort(), allowedSeriesKeys, `${expectedKey}: 민감 필드 또는 알 수 없는 필드가 있습니다.`);
  assert.strictEqual(series.key, expectedKey, "회차 묶음의 안정 키가 다릅니다.");
  assert.strictEqual(series.rounds.length, expectedLength, `${expectedKey}: 회차 수가 다릅니다.`);
  series.rounds.forEach((round, roundIndex) => {
    assert.deepStrictEqual(Object.keys(round).sort(), allowedRoundKeys, `${round.key}: 민감 필드 또는 알 수 없는 필드가 있습니다.`);
    assert(new RegExp(`^${roundKeyPrefix}-\\d{2}$`).test(round.key), `${round.key}: 안정 키 형식이 다릅니다.`);
    assert(allowedStates.has(round.releaseStatus), `${round.key}: 공개 가능한 상태 값이 아닙니다.`);
    assert.strictEqual(round.href, null, `${round.key}: 검수 전 링크는 항상 null이어야 합니다.`);
    assert.strictEqual(typeof round.visualGate, "boolean", `${round.key}: visualGate는 boolean이어야 합니다.`);
    assert.strictEqual(round.visualGate, true, `${round.key}: 원본 그림은 모바일 시각 게이트를 반드시 거쳐야 합니다.`);
    assert.deepStrictEqual([round.verifiedCount, round.lockedCount], expectedCounts[roundIndex], `${round.key}: 감사 수치가 다릅니다.`);
    assert.strictEqual(round.verifiedCount + round.lockedCount, 20, `${round.key}: 전체 문항 수는 20이어야 합니다.`);
  });
});

const prohibitedFieldNames = new Set([
  "answer", "answers", "answerText", "answerCandidates", "asset", "assets", "content",
  "image", "images", "path", "pdf", "question", "questions", "source", "sourcePath", "url"
]);
function inspect(value, trail) {
  if (Array.isArray(value)) return value.forEach((entry, index) => inspect(entry, `${trail}[${index}]`));
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, entry]) => {
    assert(!prohibitedFieldNames.has(key), `${trail}.${key}: 유료 원본 또는 정답 관련 필드는 공개 카탈로그에 둘 수 없습니다.`);
    inspect(entry, `${trail}.${key}`);
  });
}
inspect(catalog, "catalog");

const serialized = JSON.stringify(catalog).toLowerCase();
[
  "http://", "https://", "g:\\", ".pdf", "answer", "question", "source", "asset",
  "010", "@", "published"
].forEach((token) => assert(!serialized.includes(token), `공개 카탈로그에 금지된 값이 있습니다: ${token}`));

const publicPremierRoot = path.resolve(root, "..", "premier");
const publicContext = { window: {} };
vm.createContext(publicContext);
for (const relativePath of ["renderers.js", "renderers-utilization-1.js", "exams.js"]) {
  const filePath = path.join(publicPremierRoot, relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), publicContext, { filename: filePath });
}
const utilizationOne = publicContext.window.PREMIER_EXAMS["utilization-1"];
assert.strictEqual(utilizationOne.questions.length, 20, "활용 1회는 20문항이어야 합니다.");
const utilizationOneQ16 = utilizationOne.questions.find((question) => question.number === 16);
assert.match(utilizationOneQ16.prompt, /정사각형 7개/, "활용 1회 16번 문구는 실제 7칸 그림과 일치해야 합니다.");
assert(!/정사각형 9개/.test(utilizationOneQ16.prompt), "활용 1회 16번의 원본 오류 문구가 다시 들어갔습니다.");
const utilizationOneQ16Svg = publicContext.window.PremierFigures.render("u1-q16", utilizationOneQ16);
const q16Cells = new Set(
  [...utilizationOneQ16Svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="52" height="52"/g)]
    .map((match) => `${match[1]},${match[2]}`)
);
assert.strictEqual(q16Cells.size, 7, "활용 1회 16번 벡터 그림은 서로 다른 정사각형 7칸이어야 합니다.");
assert.match(utilizationOneQ16Svg, /<polygon points=/, "활용 1회 16번 색칠 영역이 누락되었습니다.");

console.log("PASS");
console.log(`- safe Premier release catalog: ${catalog.series.flatMap((series) => series.rounds).length} rounds`);
console.log("- utilization 1 q16 wording/render contract: 7 cells");
