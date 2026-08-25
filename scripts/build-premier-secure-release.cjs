"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const defaultOutput = path.join(
  "G:\\내 드라이브\\코딩관련\\hyper-focus-variant-2",
  "premier-secure-release"
);
const outputRoot = path.resolve(process.argv[2] || defaultOutput);
const selectedSlug = String(process.argv[3] || "premier-utilization-01");
const revision = 1;

const AREA_KEYS = Object.freeze({
  "수와 연산": "arithmetic",
  "공간과 도형": "spatial",
  "규칙과 관계": "pattern",
  "논리와 관계": "logic",
  "경우의 수": "combinatorics",
  "측정과 시간": "measurement"
});

const SERIES = Object.freeze([
  Object.freeze({ key: "utilization", source: "utilization", count: 8, label: "프리미어 활용 모의고사" }),
  Object.freeze({ key: "final", source: "final", count: 3, label: "프리미어 파이널 모의고사" }),
  Object.freeze({ key: "last", source: "last", count: 4, label: "프리미어 최종 모의고사" })
]);

function loadBrowserData(relativeFile, globalName) {
  const context = {};
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, relativeFile), "utf8"), context, {
    filename: relativeFile
  });
  if (!context[globalName]) throw new Error(`${relativeFile}: ${globalName}을 찾지 못했습니다.`);
  return JSON.parse(JSON.stringify(context[globalName]));
}

function uuidFor(label) {
  const bytes = crypto.createHash("sha256").update(`gfield-premier:${label}`).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function sqlText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function normalizedKey(value, fallback) {
  const ascii = String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return ascii || fallback;
}

function publicSlug(series, roundNo) {
  return `premier-${series}-${String(roundNo).padStart(2, "0")}`;
}

function sourceKey(series, roundNo) {
  return `premier-${series}-${roundNo}`;
}

function objectPrefix(series, roundNo) {
  return `premier/${series}/${String(roundNo).padStart(2, "0")}/revision-${revision}`;
}

function assertSelectedRound(diagnosis, documents) {
  const match = /^premier-(utilization|final|last)-(\d{2})$/.exec(selectedSlug);
  if (!match) throw new Error(`지원하지 않는 회차입니다: ${selectedSlug}`);
  const series = match[1];
  const roundNo = Number(match[2]);
  const source = sourceKey(series, roundNo);
  const diagnosisExam = diagnosis.exams.find(exam => exam.key === source);
  const document = documents[source];
  if (!diagnosisExam || !document) throw new Error(`${selectedSlug}: 진단 자료 또는 원본 문서 정보가 없습니다.`);
  if (diagnosisExam.totalQuestions !== 20 || diagnosisExam.questions.length !== 20) {
    throw new Error(`${selectedSlug}: 20문항 구조가 아닙니다.`);
  }
  diagnosisExam.questions.forEach((question, index) => {
    if (question.number !== index + 1 || question.scoringEligible !== true || question.reviewStatus !== "verified") {
      throw new Error(`${selectedSlug} ${index + 1}번: 검수 잠금이 남아 있어 공개 묶음을 만들 수 없습니다.`);
    }
    if (!AREA_KEYS[question.area]) throw new Error(`${selectedSlug} ${index + 1}번: 알 수 없는 영역입니다.`);
  });
  if (!Number.isInteger(document.pageCount) || document.pageCount < 1 || document.pageCount > 20) {
    throw new Error(`${selectedSlug}: 원본 쪽 수가 올바르지 않습니다.`);
  }
  const sourceDir = path.join(repoRoot, "premier", "assets", "print", `${series}-${roundNo}`);
  const pages = Array.from({ length: document.pageCount }, (_, index) => {
    const sourcePath = path.join(sourceDir, `page_${String(index + 1).padStart(3, "0")}.webp`);
    if (!fs.existsSync(sourcePath)) throw new Error(`${sourcePath}: 원본 쪽 이미지가 없습니다.`);
    return sourcePath;
  });
  return { series, roundNo, source, diagnosisExam, document, pages };
}

function buildManifest(round) {
  const prefix = objectPrefix(round.series, round.roundNo);
  return {
    schemaVersion: 2,
    deliveryMode: "page_images",
    manifestRevision: revision,
    status: "published",
    examId: selectedSlug,
    title: round.document.title,
    subtitle: "20문항",
    description: "원본 시험지를 풀고 해설 영상을 보며 문항별 O/X를 기록합니다.",
    durationMinutes: 60,
    questions: round.diagnosisExam.questions.map(question => ({
      number: question.number,
      questionKey: `premier:${round.series}-${String(round.roundNo).padStart(2, "0")}:q${String(question.number).padStart(2, "0")}`,
      revision,
      releaseStatus: "verified",
      lockReasons: [],
      areaKey: AREA_KEYS[question.area],
      areaLabel: question.area,
      typeKey: normalizedKey(question.type, `${round.series}-${String(round.roundNo).padStart(2, "0")}-q${String(question.number).padStart(2, "0")}`),
      typeTitle: question.type,
      typeId: null,
      typeCode: `${round.series === "utilization" ? "U" : round.series === "final" ? "F" : "L"}${String(round.roundNo).padStart(2, "0")}-Q${String(question.number).padStart(2, "0")}`,
      difficultyLabel: "원본"
    })),
    pages: round.pages.map((_, index) => ({
      number: index + 1,
      assetId: uuidFor(`${selectedSlug}:revision-${revision}:page-${index + 1}`),
      assetAlt: `${round.document.title} ${index + 1}쪽`
    })),
    _privateBuild: {
      objectPrefix: prefix,
      generatedFrom: "verified-diagnosis-and-original-page-images"
    }
  };
}

function buildCatalogSql(round, manifestBuffer, outputPages) {
  const catalogRows = [];
  SERIES.forEach(series => {
    for (let roundNo = 1; roundNo <= series.count; roundNo += 1) {
      const slug = publicSlug(series.key, roundNo);
      catalogRows.push(`(${sqlText(uuidFor(`${slug}:exam`))}, ${sqlText(slug)}, ${sqlText(series.key)}, ${roundNo}, ${sqlText(`${series.label} ${roundNo}회`)}, 'reviewed', null, null, ${revision})`);
    }
  });
  const examId = uuidFor(`${selectedSlug}:exam`);
  const prefix = objectPrefix(round.series, round.roundNo);
  const manifestId = uuidFor(`${selectedSlug}:revision-${revision}:manifest`);
  const assetRows = [
    `(${sqlText(manifestId)}, ${sqlText(examId)}, 'manifest', 'hf-mock-private', ${sqlText(`${prefix}/manifest.json`)}, 'application/json', ${revision}, ${sqlText(sha256(manifestBuffer))}, ${manifestBuffer.byteLength})`,
    ...outputPages.map((page, index) => `(${sqlText(uuidFor(`${selectedSlug}:revision-${revision}:page-${index + 1}`))}, ${sqlText(examId)}, 'page', 'hf-mock-private', ${sqlText(`${prefix}/page_${String(index + 1).padStart(3, "0")}.webp`)}, 'image/webp', ${revision}, ${sqlText(page.sha256)}, ${page.byteSize})`)
  ];

  return `begin;\n\ninsert into public.hf_mock_exams(\n  id, slug, series, round_no, title, status, published_at, answers_released_at, current_revision\n) values\n  ${catalogRows.join(",\n  ")}\non conflict (slug) do update set\n  series = excluded.series,\n  round_no = excluded.round_no,\n  title = excluded.title,\n  current_revision = excluded.current_revision,\n  updated_at = now();\n\ninsert into public.hf_mock_assets(\n  id, mock_exam_id, asset_kind, bucket_id, object_path, mime_type, revision, sha256, byte_size\n) values\n  ${assetRows.join(",\n  ")}\non conflict (id) do update set\n  mock_exam_id = excluded.mock_exam_id,\n  asset_kind = excluded.asset_kind,\n  bucket_id = excluded.bucket_id,\n  object_path = excluded.object_path,\n  mime_type = excluded.mime_type,\n  revision = excluded.revision,\n  sha256 = excluded.sha256,\n  byte_size = excluded.byte_size;\n\n-- Storage 업로드와 해시 검증을 끝낸 뒤에만 이 회차를 공개합니다.\nupdate public.hf_mock_exams\nset status = 'published', published_at = now(), answers_released_at = null, updated_at = now()\nwhere id = ${sqlText(examId)};\n\ncommit;\n`;
}

function main() {
  const diagnosis = loadBrowserData("premier/diagnosis-data.js", "PREMIER_DIAGNOSIS_DATA");
  const documents = loadBrowserData("fields-classic/print-viewer/documents.js", "GFIELD_PRINT_DOCUMENTS");
  const round = assertSelectedRound(diagnosis, documents);
  const releaseDir = path.join(outputRoot, selectedSlug, `revision-${revision}`);
  const storageDir = path.join(releaseDir, "storage");
  fs.mkdirSync(storageDir, { recursive: true });

  const manifest = buildManifest(round);
  delete manifest._privateBuild;
  const manifestBuffer = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(storageDir, "manifest.json"), manifestBuffer);

  const outputPages = round.pages.map((sourcePath, index) => {
    const buffer = fs.readFileSync(sourcePath);
    const name = `page_${String(index + 1).padStart(3, "0")}.webp`;
    fs.copyFileSync(sourcePath, path.join(storageDir, name));
    return { name, byteSize: buffer.byteLength, sha256: sha256(buffer) };
  });
  const sql = buildCatalogSql(round, manifestBuffer, outputPages);
  fs.writeFileSync(path.join(releaseDir, "seed-after-upload.sql"), sql, "utf8");

  const inventory = {
    exam: selectedSlug,
    revision,
    title: round.document.title,
    questions: manifest.questions.length,
    pages: outputPages.length,
    videoUrl: round.document.videoUrl || null,
    storagePrefix: objectPrefix(round.series, round.roundNo),
    files: [
      { name: "manifest.json", byteSize: manifestBuffer.byteLength, sha256: sha256(manifestBuffer) },
      ...outputPages
    ]
  };
  fs.writeFileSync(path.join(releaseDir, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ output: releaseDir, ...inventory }, null, 2)}\n`);
}

main();
