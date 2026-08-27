"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const [sourceRootArgument, inventoryArgument, queueArgument] = process.argv.slice(2);
if (!sourceRootArgument || !inventoryArgument || !queueArgument) {
  throw new Error("돌파 원본 폴더, 자료대장 JSON, PDF 변환 대기열 JSON 경로가 필요합니다.");
}

const sourceRoot = path.resolve(sourceRootArgument);
const inventoryPath = path.resolve(inventoryArgument);
const queuePath = path.resolve(queueArgument);
const LEGACY_PATTERN = /이전\s*버전|수정\s*전|다른\s*범위|구\s*버전|백업|사용\s*안\s*하는|사용하지\s*않는/i;
const ANSWER_PATTERN = /정답|해설|답지|답안/i;

function normalizeRelative(filePath) {
  return path.relative(sourceRoot, filePath).split(path.sep).join("/");
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name, "ko"))
    .flatMap(entry => {
      const filePath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(filePath) : [filePath];
    });
}

function fingerprint(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function familyFor(relativePath) {
  const top = relativePath.split("/")[0] || "";
  if (/^2관\s*돌파\s*입반시험지/.test(top)) return "입반시험";
  if (/모의고사/.test(top)) return "모의고사";
  return "분류 확인 필요";
}

function courseFor(fileName) {
  if (/공통수학\s*1/i.test(fileName)) return "공통수학1";
  if (/공통수학\s*2/i.test(fileName)) return "공통수학2";
  if (/수학\s*\(?상\)?|수\s*\(상\)|수상/i.test(fileName)) return "수학(상) 계열";
  if (/수학\s*\(?하\)?|수\s*\(하\)|수하/i.test(fileName)) return "수학(하) 계열";
  if (/미적분/i.test(fileName)) return "미적분";
  if (/수학\s*2|수2/i.test(fileName)) return "수학2";
  if (/수학\s*1|수1/i.test(fileName)) return "수학1";
  if (/3-2/.test(fileName)) return "중3-2";
  if (/3-1/.test(fileName)) return "중3-1";
  if (/2-2/.test(fileName)) return "중2-2";
  if (/2-1/.test(fileName)) return "중2-1";
  if (/1-2/.test(fileName)) return "중1-2";
  if (/1-1/.test(fileName)) return "중1-1";
  return "범위 확인 필요";
}

function aliasRank(alias) {
  return [
    alias.layer === "운영 폴더" ? 0 : 1,
    alias.relativePath.length,
    alias.relativePath
  ];
}

function compareAlias(left, right) {
  const leftRank = aliasRank(left);
  const rightRank = aliasRank(right);
  for (let index = 0; index < leftRank.length; index += 1) {
    if (leftRank[index] === rightRank[index]) continue;
    return typeof leftRank[index] === "number"
      ? leftRank[index] - rightRank[index]
      : leftRank[index].localeCompare(rightRank[index], "ko");
  }
  return 0;
}

function tally(values) {
  return Object.fromEntries([...new Set(values)].sort((left, right) => left.localeCompare(right, "ko")).map(value => [
    value,
    values.filter(candidate => candidate === value).length
  ]));
}

function matrixTally(entries) {
  return Object.fromEntries([...new Set(entries.map(entry => entry.family))]
    .sort((left, right) => left.localeCompare(right, "ko"))
    .map(family => [family, tally(entries.filter(entry => entry.family === family).map(entry => entry.course))]));
}

if (!fs.statSync(sourceRoot).isDirectory()) {
  throw new Error("돌파 원본 폴더를 찾지 못했습니다.");
}

const hwpFiles = listFiles(sourceRoot).filter(filePath => path.extname(filePath).toLowerCase() === ".hwp");
const byHash = new Map();

hwpFiles.forEach(filePath => {
  const stat = fs.statSync(filePath);
  const relativePath = normalizeRelative(filePath);
  const alias = {
    relativePath,
    fileName: path.basename(filePath),
    size: stat.size,
    modifiedAt: stat.mtime.toISOString(),
    familyHint: familyFor(relativePath),
    courseHint: courseFor(path.basename(filePath)),
    layer: LEGACY_PATTERN.test(relativePath) ? "과거·후보" : "운영 폴더",
    answerNameHint: ANSWER_PATTERN.test(path.basename(filePath))
  };
  const sha256 = fingerprint(filePath);
  if (!byHash.has(sha256)) byHash.set(sha256, []);
  byHash.get(sha256).push(alias);
});

const sources = [...byHash.entries()].map(([sha256, aliases]) => {
  const orderedAliases = [...aliases].sort(compareAlias);
  const canonical = orderedAliases[0];
  const familyHints = [...new Set(aliases.map(alias => alias.familyHint))].sort((a, b) => a.localeCompare(b, "ko"));
  const courseHints = [...new Set(aliases.map(alias => alias.courseHint))].sort((a, b) => a.localeCompare(b, "ko"));
  const sourceId = `DP-SRC-${sha256.slice(0, 12).toUpperCase()}`;
  return {
    sourceId,
    sha256,
    size: canonical.size,
    canonicalRelativePath: canonical.relativePath,
    canonicalSelection: "운영 폴더 우선, 짧은 상대경로 우선; 최신본 확정이 아님",
    aliasCount: aliases.length,
    aliases: orderedAliases,
    primaryFamilyHint: canonical.familyHint,
    primaryCourseHint: canonical.courseHint,
    primaryLayer: canonical.layer,
    familyHints,
    courseHints,
    reviewStatus: "파일명 기준 임시 분류",
    answerStatus: aliases.some(alias => alias.answerNameHint) ? "파일명에 정답·해설 표시" : "내용 확인 필요",
    pdfConversion: {
      status: "대기",
      outputRelativePath: `hwp-pdf/dolpa/${sourceId}.pdf`
    }
  };
}).sort((left, right) => left.sourceId.localeCompare(right.sourceId));

const COURSE_PRIORITY = new Map([
  ["중2-2", 0], ["중2-1", 1], ["중1-1", 2], ["중1-2", 3], ["중3-1", 4], ["중3-2", 5],
  ["공통수학1", 6], ["수학(상) 계열", 7], ["수학(하) 계열", 8], ["수학1", 9], ["수학2", 10],
  ["미적분", 11], ["범위 확인 필요", 12]
]);
const orderedSources = [...sources].sort((left, right) => {
  const familyDifference = (left.primaryFamilyHint === "입반시험" ? 0 : 1) - (right.primaryFamilyHint === "입반시험" ? 0 : 1);
  if (familyDifference) return familyDifference;
  const layerDifference = (left.primaryLayer === "운영 폴더" ? 0 : 1) - (right.primaryLayer === "운영 폴더" ? 0 : 1);
  if (layerDifference) return layerDifference;
  const courseDifference = (COURSE_PRIORITY.get(left.primaryCourseHint) ?? 99) - (COURSE_PRIORITY.get(right.primaryCourseHint) ?? 99);
  if (courseDifference) return courseDifference;
  return left.canonicalRelativePath.localeCompare(right.canonicalRelativePath, "ko");
});

const representativeFamilies = sources.map(source => source.familyHints[0]);
const representativeCourses = sources.map(source => source.courseHints[0]);
const representativeMatrix = sources.map(source => ({ family: source.familyHints[0], course: source.courseHints[0] }));
const inventory = {
  schemaVersion: 2,
  title: "돌파 HWP 원본 자료대장",
  generatedAt: new Date().toISOString(),
  sourceRootLabel: "돌파 시험대비 비공개 원본 폴더",
  rules: [
    "SHA-256이 같은 파일은 원본 ID 하나로 묶고 모든 경로를 별칭으로 보존한다.",
    "대표 경로는 운영 폴더와 짧은 상대경로를 우선하지만 최신본을 뜻하지 않는다.",
    "시험 종류와 과정은 파일명으로 찾은 임시 분류이며 원본 표지를 보기 전에는 확정하지 않는다.",
    "원본 HWP는 수정하거나 공개 저장소에 복사하지 않는다."
  ],
  summary: {
    hwpPathCount: hwpFiles.length,
    uniqueSourceCount: sources.length,
    duplicatePathCount: hwpFiles.length - sources.length,
    familyCounts: tally(representativeFamilies),
    courseCounts: tally(representativeCourses),
    familyCourseCounts: matrixTally(representativeMatrix),
    answerNameHintSourceCount: sources.filter(source => source.answerStatus !== "내용 확인 필요").length,
    conversionPendingCount: sources.length
  },
  sources
};

const queue = {
  schemaVersion: 1,
  title: "돌파 HWP 고유 원본 PDF 변환 대기열",
  generatedAt: inventory.generatedAt,
  updatedAt: inventory.generatedAt,
  sourceInventory: path.basename(inventoryPath),
  converter: {
    preferred: "nPDF",
    printerName: "nPDF로 변환하기",
    verification: "페이지 수, 첫 페이지, 글자 깨짐, 수식, 도형 누락을 확인"
  },
  summary: {
    pending: sources.length,
    completed: 0,
    failed: 0,
    skippedDuplicatePaths: hwpFiles.length - sources.length
  },
  jobs: orderedSources.map((source, index) => ({
    order: index + 1,
    sourceId: source.sourceId,
    inputRelativePath: source.canonicalRelativePath,
    outputRelativePath: source.pdfConversion.outputRelativePath,
    familyHint: source.primaryFamilyHint,
    courseHint: source.primaryCourseHint,
    layer: source.primaryLayer,
    status: "대기",
    reviewStatus: "변환 전",
    pageCount: null,
    outputSize: null,
    convertedAt: null,
    error: null
  }))
};

fs.mkdirSync(path.dirname(inventoryPath), { recursive: true });
fs.mkdirSync(path.dirname(queuePath), { recursive: true });
fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify(inventory.summary)}\n`);
