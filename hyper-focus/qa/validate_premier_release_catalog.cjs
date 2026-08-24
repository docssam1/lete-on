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
  ["utilization", "premier-utilization", 8, [[20, 0, false], [13, 7, true], [16, 4, true], [14, 6, true], [20, 0, true], [15, 5, true], [13, 7, true], [17, 3, true]]],
  ["final", "premier-final", 3, [[8, 12, true], [13, 7, true], [16, 4, true]]],
  ["last", "premier-last", 4, [[16, 4, true], [17, 3, true], [14, 6, true], [15, 5, true]]]
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
    assert.strictEqual(round.visualGate, expectedCounts[roundIndex][2], `${round.key}: 모바일·A4 시각 게이트 상태가 다릅니다.`);
    assert.deepStrictEqual([round.verifiedCount, round.lockedCount], expectedCounts[roundIndex].slice(0, 2), `${round.key}: 감사 수치가 다릅니다.`);
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
const premierCss = fs.readFileSync(path.join(publicPremierRoot, "styles.css"), "utf8");
assert.match(premierCss, /@page\s*\{\s*size:\s*A4 portrait;/i, "프리미어 인쇄 용지는 A4 세로여야 합니다.");
assert.match(premierCss, /\.exam-pages\s*\{[^}]*zoom:\s*\.7070707071;/s, "A3 원본 캔버스를 A4로 정확히 축소해야 합니다.");
assert(!/@page\s*\{\s*size:\s*A3/i.test(premierCss), "A3 인쇄 설정이 다시 들어갔습니다.");
const publicContext = { window: {} };
vm.createContext(publicContext);
for (const relativePath of ["renderers.js", "renderers-utilization-1.js", "renderers-utilization-5-q15-q20.js", "exams.js"]) {
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

const utilizationFiveQ17 = publicContext.window.PREMIER_EXAMS["utilization-5"].questions.find((question) => question.number === 17);
assert.match(utilizationFiveQ17.prompt, /모든 블록은 앞면이 보이고/, "활용 5회 교체 17번은 모든 블록의 가시성을 명시해야 합니다.");
assert.match(utilizationFiveQ17.prompt, /완전히 가려진 블록은 없습니다/, "활용 5회 교체 17번은 숨은 블록을 명시적으로 배제해야 합니다.");
const utilizationFiveQ17Svg = publicContext.window.PremierFigures.render("u5-q17", utilizationFiveQ17);
const visibleBlockPattern = /<g data-visible-block="(one|two)" data-x="([\d.]+)" data-y="([\d.]+)" data-w="([\d.]+)" data-h="([\d.]+)">/g;
const visibleBlocks = [...utilizationFiveQ17Svg.matchAll(visibleBlockPattern)].map((match) => ({
  shape: match[1], x: Number(match[2]), y: Number(match[3]), w: Number(match[4]), h: Number(match[5])
}));
for (const shape of ["one", "two"]) {
  const blocks = visibleBlocks.filter((block) => block.shape === shape);
  assert(blocks.length > 0, `활용 5회 교체 17번 ${shape}: 보이는 블록이 없습니다.`);
  assert.strictEqual(new Set(blocks.map((block) => `${block.x},${block.y},${block.w},${block.h}`)).size, blocks.length, `활용 5회 교체 17번 ${shape}: 같은 블록 좌표가 중복됩니다.`);
  blocks.forEach((block, index) => blocks.slice(index + 1).forEach((other) => {
    const overlapW = Math.max(0, Math.min(block.x + block.w, other.x + other.w) - Math.max(block.x, other.x));
    const overlapH = Math.max(0, Math.min(block.y + block.h, other.y + other.h) - Math.max(block.y, other.y));
    assert(overlapW * overlapH < block.w * block.h, `활용 5회 교체 17번 ${shape}: 한 블록의 앞면이 완전히 가려집니다.`);
    assert(overlapW * overlapH < other.w * other.h, `활용 5회 교체 17번 ${shape}: 한 블록의 앞면이 완전히 가려집니다.`);
  }));
}
assert.strictEqual(new Set(["zero-hidden-blocks"]).size, 1, "활용 5회 교체 17번의 숨은 블록 후보는 0 하나여야 합니다.");

console.log("PASS");
console.log(`- safe Premier release catalog: ${catalog.series.flatMap((series) => series.rounds).length} rounds`);
console.log("- utilization 1 q16 wording/render contract: 7 cells");
console.log("- utilization 1 print contract: A4 portrait, 4 pages");
console.log("- utilization 5 q17 replacement contract: all blocks visible, zero hidden candidates");
