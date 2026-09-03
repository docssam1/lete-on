"use strict";

// Builds private Supabase Storage payloads for every Premier mock exam.
// Original pages and verified answers remain outside Git; only this builder is tracked.

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..", "..");
const requestedOutputRoot = process.argv[2] || process.env.HF_PREMIER_RELEASE_ROOT;
if (!requestedOutputRoot) throw new Error("출력 위치 인수 또는 HF_PREMIER_RELEASE_ROOT가 필요합니다.");
const outputRoot = path.resolve(requestedOutputRoot);
const privateCatalogPath = path.resolve(process.env.HF_PREMIER_PRIVATE_CATALOG || path.join(
  repoRoot,
  ".source-memory",
  "premier-private-local.json"
));
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
  Object.freeze({ key: "utilization", memoryKey: "util", count: 8, titlePrefix: "프리미어 활용 모의고사" }),
  Object.freeze({ key: "final", memoryKey: "final", count: 3, titlePrefix: "프리미어 파이널 모의고사" }),
  Object.freeze({ key: "last", memoryKey: "last", count: 4, titlePrefix: "프리미어 최종 모의고사" })
]);

function loadBrowserData(relativeFile, globalName) {
  const context = {};
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, relativeFile), "utf8"), context, { filename: relativeFile });
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
  const ascii = String(value || "").normalize("NFKD").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
  const candidate = ascii || fallback;
  const safe = /^[a-z]/.test(candidate) && candidate.length >= 2
    ? candidate
    : `source-${candidate}`;
  if (!/^[a-z][a-z0-9-]{1,79}$/.test(safe)) {
    throw new Error(`유형키를 안전한 형식으로 바꿀 수 없습니다: ${value || fallback}`);
  }
  return safe;
}

function slugFor(series, roundNo) {
  return `premier-${series}-${String(roundNo).padStart(2, "0")}`;
}

function diagnosisKey(series, roundNo) {
  return `premier-${series}-${roundNo}`;
}

function memoryId(series, roundNo, questionNo) {
  return `premier-${series.memoryKey}-${String(roundNo).padStart(2, "0")}.q${String(questionNo).padStart(2, "0")}`;
}

function prefixFor(series, roundNo) {
  return `premier/${series}/${String(roundNo).padStart(2, "0")}/revision-${revision}`;
}

function writeJson(file, value) {
  const buffer = Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.writeFileSync(file, buffer);
  return { byteSize: buffer.byteLength, sha256: sha256(buffer) };
}

function buildRound(series, roundNo, diagnosis, recordsById) {
  const slug = slugFor(series.key, roundNo);
  const exam = diagnosis.exams.find(item => item.key === diagnosisKey(series.key, roundNo));
  if (!exam || exam.questions.length !== 20 || exam.totalQuestions !== 20) throw new Error(`${slug}: 20문항 진단 자료가 없습니다.`);
  const sourceDir = path.join(repoRoot, "premier", "assets", "print", `${series.key}-${roundNo}`);
  const pageNames = fs.readdirSync(sourceDir).filter(name => /^page_\d{3}\.webp$/i.test(name)).sort();
  if (!pageNames.length || pageNames.some((name, index) => name !== `page_${String(index + 1).padStart(3, "0")}.webp`)) {
    throw new Error(`${slug}: 원본 쪽 이미지 순서가 연속적이지 않습니다.`);
  }
  const title = `${series.titlePrefix} ${roundNo}회`;
  const prefix = prefixFor(series.key, roundNo);
  const questions = exam.questions.map((question, index) => {
    if (question.number !== index + 1 || !AREA_KEYS[question.area]) throw new Error(`${slug} ${index + 1}번: 진단 분류가 올바르지 않습니다.`);
    const scoringEligible = question.scoringEligible === true && question.reviewStatus === "verified";
    return {
      number: question.number,
      questionKey: `premier:${series.key}-${String(roundNo).padStart(2, "0")}:q${String(question.number).padStart(2, "0")}`,
      revision,
      releaseStatus: scoringEligible ? "verified" : "excluded",
      scoringEligible,
      lockReasons: scoringEligible ? [] : ["source_review_excluded"],
      areaKey: AREA_KEYS[question.area],
      areaLabel: question.area,
      typeKey: normalizedKey(question.type, `${series.key}-${String(roundNo).padStart(2, "0")}-q${String(question.number).padStart(2, "0")}`),
      typeTitle: question.type,
      typeId: null,
      typeCode: `${series.key === "utilization" ? "U" : series.key === "final" ? "F" : "L"}${String(roundNo).padStart(2, "0")}-Q${String(question.number).padStart(2, "0")}`,
      difficultyLabel: "원본"
    };
  });
  const scoringQuestions = questions.filter(question => question.scoringEligible);
  const answers = scoringQuestions.map(question => {
    const record = recordsById.get(memoryId(series, roundNo, question.number));
    if (!record || record.status !== "verified" || record.sensitivity !== "private" || !String(record.summary || "").trim()) {
      throw new Error(`${slug} ${question.number}번: 비공개 검증 답안 근거가 없습니다.`);
    }
    const answerText = String(record.summary).trim();
    return {
      questionKey: question.questionKey,
      revision,
      answerType: "verified-summary",
      answer: answerText,
      answerText,
      answerCandidates: [answerText],
      verificationStatus: "verified"
    };
  });
  const manifest = {
    schemaVersion: 2,
    deliveryMode: "page_images",
    manifestRevision: revision,
    status: "published",
    examId: slug,
    title,
    subtitle: `원본 20문항 · 채점 ${scoringQuestions.length}문항`,
    description: "원본 시험지를 풀고 정답이 하나로 확인된 문항만 O/X로 기록합니다. 검수 제외 문항은 점수와 진단에 반영하지 않습니다.",
    durationMinutes: 60,
    questions,
    pages: pageNames.map((_, index) => ({
      number: index + 1,
      assetId: uuidFor(`${slug}:revision-${revision}:page-${index + 1}`),
      assetAlt: `${title} ${index + 1}쪽`
    }))
  };
  const answerManifest = { schemaVersion: 1, manifestRevision: revision, examId: slug, answers };
  return { slug, title, series, roundNo, sourceDir, pageNames, prefix, manifest, answerManifest, scoringQuestions };
}

function main() {
  const diagnosis = loadBrowserData("premier/diagnosis-data.js", "PREMIER_DIAGNOSIS_DATA");
  const privateCatalog = JSON.parse(fs.readFileSync(privateCatalogPath, "utf8"));
  const recordsById = new Map(privateCatalog.records.map(record => [record.id, record]));
  const releaseRoot = path.join(outputRoot, "all-rounds", `revision-${revision}`);
  fs.mkdirSync(releaseRoot, { recursive: true });
  const rounds = [];
  for (const series of SERIES) for (let roundNo = 1; roundNo <= series.count; roundNo += 1) {
    const round = buildRound(series, roundNo, diagnosis, recordsById);
    const storageDir = path.join(releaseRoot, "storage", round.prefix);
    fs.mkdirSync(storageDir, { recursive: true });
    const manifestInfo = writeJson(path.join(storageDir, "manifest.json"), round.manifest);
    const answerInfo = writeJson(path.join(storageDir, "answers.json"), round.answerManifest);
    const pages = round.pageNames.map(name => {
      const source = path.join(round.sourceDir, name);
      const destination = path.join(storageDir, name);
      fs.copyFileSync(source, destination);
      const buffer = fs.readFileSync(destination);
      return { name, byteSize: buffer.byteLength, sha256: sha256(buffer) };
    });
    rounds.push({ ...round, manifestInfo, answerInfo, pages });
  }

  const examRows = rounds.map(round => `(${sqlText(uuidFor(`${round.slug}:exam`))}, ${sqlText(round.slug)}, ${sqlText(round.series.key)}, ${round.roundNo}, ${sqlText(round.title)}, 'reviewed', null, null, ${revision})`);
  const assetRows = rounds.flatMap(round => {
    const examId = uuidFor(`${round.slug}:exam`);
    const base = [
      `(${sqlText(uuidFor(`${round.slug}:revision-${revision}:manifest`))}, ${sqlText(examId)}, 'manifest', 'hf-mock-private', ${sqlText(`${round.prefix}/manifest.json`)}, 'application/json', ${revision}, ${sqlText(round.manifestInfo.sha256)}, ${round.manifestInfo.byteSize})`,
      `(${sqlText(uuidFor(`${round.slug}:revision-${revision}:answer`))}, ${sqlText(examId)}, 'answer', 'hf-mock-private', ${sqlText(`${round.prefix}/answers.json`)}, 'application/json', ${revision}, ${sqlText(round.answerInfo.sha256)}, ${round.answerInfo.byteSize})`
    ];
    return base.concat(round.pages.map((page, index) => `(${sqlText(uuidFor(`${round.slug}:revision-${revision}:page-${index + 1}`))}, ${sqlText(examId)}, 'page', 'hf-mock-private', ${sqlText(`${round.prefix}/${page.name}`)}, 'image/webp', ${revision}, ${sqlText(page.sha256)}, ${page.byteSize})`));
  });
  const sql = `begin;\n\ninsert into public.hf_mock_exams(id,slug,series,round_no,title,status,published_at,answers_released_at,current_revision) values\n  ${examRows.join(",\n  ")}\non conflict (slug) do update set series=excluded.series,round_no=excluded.round_no,title=excluded.title,current_revision=excluded.current_revision,updated_at=now();\n\ninsert into public.hf_mock_assets(id,mock_exam_id,asset_kind,bucket_id,object_path,mime_type,revision,sha256,byte_size) values\n  ${assetRows.join(",\n  ")}\non conflict (id) do update set mock_exam_id=excluded.mock_exam_id,asset_kind=excluded.asset_kind,bucket_id=excluded.bucket_id,object_path=excluded.object_path,mime_type=excluded.mime_type,revision=excluded.revision,sha256=excluded.sha256,byte_size=excluded.byte_size;\n\nupdate public.hf_mock_exams set status='published',published_at=coalesce(published_at,now()),answers_released_at=coalesce(answers_released_at,now()),updated_at=now() where slug like 'premier-%';\n\ncommit;\n`;
  fs.writeFileSync(path.join(releaseRoot, "seed-after-upload.sql"), sql, "utf8");
  const inventory = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    revision,
    rounds: rounds.map(round => ({
      slug: round.slug,
      title: round.title,
      sourceQuestions: 20,
      scoringQuestions: round.scoringQuestions.length,
      excludedQuestions: 20 - round.scoringQuestions.length,
      pages: round.pages.length,
      storagePrefix: round.prefix,
      files: [
        { name: "manifest.json", ...round.manifestInfo },
        { name: "answers.json", ...round.answerInfo },
        ...round.pages
      ]
    }))
  };
  writeJson(path.join(releaseRoot, "inventory.json"), inventory);
  const totalScoring = inventory.rounds.reduce((sum, round) => sum + round.scoringQuestions, 0);
  const totalExcluded = inventory.rounds.reduce((sum, round) => sum + round.excludedQuestions, 0);
  process.stdout.write(`${JSON.stringify({ output: releaseRoot, rounds: rounds.length, totalScoring, totalExcluded }, null, 2)}\n`);
}

main();
