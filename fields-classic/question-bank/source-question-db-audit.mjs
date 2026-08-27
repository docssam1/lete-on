import {
  CURRICULUM,
  DIAGNOSTIC_EXAM_TYPES,
  EXAMS,
  FINAL_EXAM_TYPES,
  PRACTICE_EXAM_TYPES,
  SOURCE_QUESTION_INDEX,
  TEXTBOOK_STAGES,
  TYPES
} from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { writeFileSync } from "node:fs";

const failures = [];
const warnings = [];
const sourceKinds = new Set(["exam", "unit-test", "textbook"]);
const stageIds = new Set(TEXTBOOK_STAGES.map((stage) => stage.id));
const typeById = new Map(TYPES.map((type) => [type.id, type]));

const fail = (category, message) => failures.push({ category, message });
const warn = (category, message) => warnings.push({ category, message });
const list = (value) => [...new Set(value)].sort();
const keyFor = (sourceKind, sourceId, number) => `${sourceKind}:${sourceId}:q${number}`;
const typeIdsFor = (entry) => list(entry.typeIds || [entry.typeId, ...(entry.relatedTypeIds || [])].filter(Boolean));
const referenceNumbers = (reference) => reference.numbers
  || Array.from({ length: reference.to - (reference.from || 1) + 1 }, (_, index) => (reference.from || 1) + index);
const expectedRecordKey = (bookId, unitIndex, stageId, reference, number) =>
  `textbook:${bookId}:u${unitIndex + 1}:${stageId}:${reference.section}:${reference.group}:q${number}`;

const expected = [];
const addExpected = (record) => expected.push(record);

const examSources = [
  ...EXAMS.map((exam) => ({ ...exam, sourceGroup: "선발시험" })),
  ...DIAGNOSTIC_EXAM_TYPES.map((exam) => ({ ...exam, sourceGroup: "진단 모의고사" })),
  ...PRACTICE_EXAM_TYPES.map((exam) => ({ ...exam, sourceGroup: "실전 모의고사" })),
  ...FINAL_EXAM_TYPES.map((exam) => ({ ...exam, sourceGroup: "파이널 모의고사" }))
];

for (const exam of examSources) {
  if (!Array.isArray(exam.questions)) {
    fail("원본 배열", `${exam.id}: questions 배열이 없습니다.`);
    continue;
  }
  const numbers = exam.questions.map((entry) => entry.number);
  if (numbers.some((number) => !Number.isInteger(number) || number < 1)) {
    fail("원본 문항번호", `${exam.id}: 양의 정수가 아닌 문항번호가 있습니다: ${numbers.join(", ")}`);
  }
  if (new Set(numbers).size !== numbers.length) {
    fail("원본 중복", `${exam.id}: 원본 배열 안에 중복 문항번호가 있습니다: ${numbers.join(", ")}`);
  }
  for (const entry of exam.questions) {
    addExpected({
      sourceKey: keyFor("exam", exam.id, entry.number),
      sourceKind: "exam",
      sourceId: exam.id,
      sourceLabel: exam.label,
      number: entry.number,
      typeIds: typeIdsFor(entry),
      path: `${exam.label} ${entry.number}번`
    });
  }
}

for (const book of CURRICULUM) {
  const testQuestions = book.source?.unitTestQuestions;
  if (!Array.isArray(testQuestions)) {
    fail("단원 테스트", `${book.id}: source.unitTestQuestions 배열이 없습니다.`);
  } else {
    const numbers = testQuestions.map((entry) => entry.number);
    if (new Set(numbers).size !== numbers.length) {
      fail("단원 테스트 중복", `${book.id}: 단원 테스트 문항번호가 중복됩니다: ${numbers.join(", ")}`);
    }
    for (const entry of testQuestions) {
      addExpected({
        sourceKey: keyFor("unit-test", book.id, entry.number),
        sourceKind: "unit-test",
        sourceId: book.id,
        sourceLabel: `${book.label} 단원 테스트`,
        number: entry.number,
        typeIds: typeIdsFor(entry),
        path: `${book.label} 단원 테스트 ${entry.number}번`
      });
    }
  }

  for (const [unitIndex, unit] of book.units.entries()) {
    if (!unit.studyRefs || typeof unit.studyRefs !== "object") {
      fail("본문 참조", `${book.id} ${unit.label}: studyRefs가 없습니다.`);
      continue;
    }
    for (const stage of TEXTBOOK_STAGES) {
      const parentReferences = unit.studyRefs[stage.id];
      if (!Array.isArray(parentReferences)) {
        fail("본문 참조", `${book.id} ${unit.label} ${stage.id}: studyRefs 배열이 없습니다.`);
        continue;
      }
      for (const reference of parentReferences) {
        for (const number of referenceNumbers(reference)) {
          const key = expectedRecordKey(book.id, unitIndex, stage.id, reference, number);
          const detailedAssignments = [];
          if (unit.typeStudyRefs) {
            for (const typeId of unit.typeIds || []) {
              const references = unit.typeStudyRefs[typeId]?.[stage.id] || [];
              for (const detailedReference of references) {
                if (detailedReference.section === reference.section
                  && detailedReference.group === reference.group
                  && referenceNumbers(detailedReference).includes(number)) {
                  detailedAssignments.push(typeId);
                }
              }
            }
          } else {
            detailedAssignments.push(...(unit.typeIds || []));
          }
          addExpected({
            sourceKey: key,
            sourceKind: "textbook",
            sourceId: book.id,
            sourceLabel: `${book.label} ${unit.label}`,
            number,
            typeIds: list(detailedAssignments),
            bookId: book.id,
            unitIndex,
            unitLabel: unit.label,
            textbookStageId: stage.id,
            section: reference.section,
            group: reference.group,
            path: `${book.label} ${unit.label} ${stage.label} ${reference.section}-${reference.group} ${number}번`
          });
        }
      }
    }
  }
}

const expectedByKey = new Map();
for (const record of expected) {
  const records = expectedByKey.get(record.sourceKey) || [];
  records.push(record);
  expectedByKey.set(record.sourceKey, records);
}

for (const [sourceKey, records] of expectedByKey) {
  if (records.length > 1) {
    const assignments = list(records.flatMap((record) => record.typeIds));
    fail("원본 중복 sourceKey", `${sourceKey}: ${records.map((record) => record.path).join(" | ")} / 유형 ${assignments.join(", ") || "없음"}`);
  }
  const typeIds = list(records.flatMap((record) => record.typeIds));
  if (typeIds.length === 0) fail("원본 유형 누락", `${sourceKey}: 원본 참조 문항에 typeId가 없습니다.`);
}

const indexByKey = new Map();
for (const record of SOURCE_QUESTION_INDEX) {
  const records = indexByKey.get(record.sourceKey) || [];
  records.push(record);
  indexByKey.set(record.sourceKey, records);
}

for (const [sourceKey, records] of indexByKey) {
  if (records.length > 1) fail("색인 중복 sourceKey", `${sourceKey}: SOURCE_QUESTION_INDEX에 ${records.length}개 레코드가 있습니다.`);
}

const expectedKeys = new Set(expectedByKey.keys());
const indexedKeys = new Set(indexByKey.keys());
const missingKeys = list([...expectedKeys].filter((sourceKey) => !indexedKeys.has(sourceKey)));
const unexpectedKeys = list([...indexedKeys].filter((sourceKey) => !expectedKeys.has(sourceKey)));
for (const sourceKey of missingKeys) fail("색인 누락", sourceKey);
for (const sourceKey of unexpectedKeys) fail("예상 밖 색인", sourceKey);

const requiredRecordFields = [
  "sourceKey", "sourceKind", "sourceId", "sourceLabel", "number", "typeId", "typeIds",
  "label", "difficulty", "verified", "classification", "classifications"
];
const requiredClassificationFields = [
  "majorDomainId", "majorDomainLabel", "minorDomain", "detailedTypeId", "detailedTypeLabel",
  "representativeConceptId", "representativeConceptLabel", "academyStyleIds"
];

const routeForType = (typeId) => {
  const type = typeById.get(typeId);
  if (!type) return null;
  if (type.generator) return { kind: "generator", id: type.generator, exists: typeof GENERATORS[type.generator] === "function" };
  if (type.worksheetCode) return { kind: "worksheet", id: type.worksheetCode, exists: true };
  return null;
};

for (const record of SOURCE_QUESTION_INDEX) {
  for (const field of requiredRecordFields) {
    if (record[field] === undefined || record[field] === null || record[field] === "") {
      fail("필수 메타데이터", `${record.sourceKey}: ${field} 누락`);
    }
  }
  if (!sourceKinds.has(record.sourceKind)) fail("sourceKind", `${record.sourceKey}: 알 수 없는 sourceKind ${record.sourceKind}`);
  if (!Number.isInteger(record.number) || record.number < 1) fail("문항번호", `${record.sourceKey}: 잘못된 number ${record.number}`);
  if (!Array.isArray(record.typeIds) || record.typeIds.length === 0) fail("세부유형", `${record.sourceKey}: typeIds가 비어 있습니다.`);
  const recordTypeIds = list(record.typeIds || []);
  if (record.typeId !== record.typeIds?.[0]) fail("대표 세부유형", `${record.sourceKey}: typeId와 typeIds[0]이 다릅니다.`);
  for (const typeId of recordTypeIds) {
    const type = typeById.get(typeId);
    if (!type) {
      fail("TYPES 누락", `${record.sourceKey}: ${typeId}`);
      continue;
    }
    const route = routeForType(typeId);
    if (!route) fail("생성기 ID 누락", `${record.sourceKey}: ${typeId}에 generator 또는 worksheetCode가 없습니다.`);
    else if (!route.exists) fail("생성기 연결 오류", `${record.sourceKey}: ${typeId} -> ${route.id}가 GENERATORS에 없습니다.`);
  }
  const classifications = Array.isArray(record.classifications) ? record.classifications : [];
  if (classifications.length !== recordTypeIds.length) {
    fail("분류 메타데이터", `${record.sourceKey}: classifications ${classifications.length}개 / typeIds ${recordTypeIds.length}개`);
  }
  for (const classification of [record.classification, ...classifications]) {
    if (!classification) continue;
    for (const field of requiredClassificationFields) {
      if (classification[field] === undefined || classification[field] === null || classification[field] === "") {
        fail("분류 메타데이터", `${record.sourceKey}: classification.${field} 누락`);
      }
    }
    if (!Array.isArray(classification.academyStyleIds) || classification.academyStyleIds.length === 0) {
      fail("학원 스타일", `${record.sourceKey}: academyStyleIds가 비어 있습니다.`);
    }
  }
  if (record.sourceKind === "exam" && !("stage" in record)) fail("시험 시기", `${record.sourceKey}: stage 누락`);
  if (record.sourceKind === "unit-test" && record.bookId !== record.sourceId) fail("단원 테스트 권", `${record.sourceKey}: bookId 불일치`);
  if (record.sourceKind === "textbook") {
    for (const field of ["bookId", "unitIndex", "unitLabel", "textbookStageId", "textbookStageLabel", "section", "group"]) {
      if (record[field] === undefined || record[field] === null || record[field] === "") {
        fail("교재 위치 메타데이터", `${record.sourceKey}: ${field} 누락`);
      }
    }
    if (!stageIds.has(record.textbookStageId)) fail("교재 단계", `${record.sourceKey}: 알 수 없는 단계 ${record.textbookStageId}`);
  }
}

const referencedTypeIds = new Set(expected.flatMap((record) => record.typeIds));
const missingReferencedTypes = list([...referencedTypeIds].filter((typeId) => !typeById.has(typeId)));
for (const typeId of missingReferencedTypes) fail("원본 참조 TYPES 누락", typeId);

const unroutedReferencedTypes = list([...referencedTypeIds].filter((typeId) => typeById.has(typeId) && !routeForType(typeId)));
for (const typeId of unroutedReferencedTypes) fail("원본 참조 생성기 누락", typeId);

const orphanUnroutedTypes = list(TYPES.filter((type) => !referencedTypeIds.has(type.id) && !routeForType(type.id)).map((type) => type.id));
for (const typeId of orphanUnroutedTypes) warn("미사용 분류 자리", typeId);

const duplicateTypeIds = TYPES.filter((type, index) => TYPES.findIndex((candidate) => candidate.id === type.id) !== index).map((type) => type.id);
for (const typeId of list(duplicateTypeIds)) fail("TYPES 중복 ID", typeId);

const unverified = SOURCE_QUESTION_INDEX
  .filter((record) => record.verified !== true)
  .map((record) => record.sourceKey);
for (const sourceKey of list(unverified)) warn("미검증 원본 문항", sourceKey);

const summary = {
  expectedRawReferences: expected.length,
  expectedUniqueSourceKeys: expectedKeys.size,
  indexedRecords: SOURCE_QUESTION_INDEX.length,
  missingSourceKeys: missingKeys,
  unexpectedSourceKeys: unexpectedKeys,
  duplicateIndexedSourceKeys: list([...indexByKey].filter(([, records]) => records.length > 1).map(([sourceKey]) => sourceKey)),
  referencedTypes: referencedTypeIds.size,
  totalTypes: TYPES.length,
  orphanUnroutedTypes,
  unverifiedSourceKeys: list(unverified),
  failures,
  warnings
};

const markdownReport = () => [
  "# Source Question DB Audit",
  "",
  `- 실행 명령: \`node fields-classic/question-bank/source-question-db-audit.mjs\``,
  `- 원본 참조 레코드: ${summary.expectedRawReferences}`,
  `- 고유 예상 sourceKey: ${summary.expectedUniqueSourceKeys}`,
  `- 실제 SOURCE_QUESTION_INDEX 레코드: ${summary.indexedRecords}`,
  `- 참조된 세부 유형: ${summary.referencedTypes} / 전체 TYPES: ${summary.totalTypes}`,
  `- 결과: ${summary.failures.length === 0 ? `PASS${summary.unverifiedSourceKeys.length ? ` (미검증 ${summary.unverifiedSourceKeys.length}문항은 의도적으로 선택 잠금)` : ""}` : "FAIL"}`,
  "",
  "## 누락·중복 대조",
  "",
  `- 색인 누락: ${summary.missingSourceKeys.length}건`,
  `- 예상 밖 색인: ${summary.unexpectedSourceKeys.length}건`,
  `- 색인 중복 sourceKey: ${summary.duplicateIndexedSourceKeys.length}건`,
  "",
  "## 필수 메타데이터 오류",
  "",
  ...(summary.failures.length ? summary.failures.map(({ category, message }) => `- [${category}] ${message}`) : ["- 없음"]),
  "",
  "## 미검증 원본 문항",
  "",
  ...(summary.unverifiedSourceKeys.length ? summary.unverifiedSourceKeys.map((sourceKey) => `- ${sourceKey}`) : ["- 없음"]),
  "",
  "## 미사용·미연결 분류 자리",
  "",
  "현재 어떤 시험·단원 테스트·교재 본문에도 참조되지 않고 생성기 또는 학습지 경로도 없는 TYPES입니다. 삭제하지 않고 다음 원본 대조 대상 후보로 보존합니다.",
  "",
  ...(summary.orphanUnroutedTypes.length ? summary.orphanUnroutedTypes.map((typeId) => `- ${typeId}`) : ["- 없음"]),
  "",
  "## 판정",
  "",
  summary.failures.length === 0
    ? summary.unverifiedSourceKeys.length
      ? `원본 문항 키와 필수 메타데이터는 모두 들어 있습니다. ${summary.unverifiedSourceKeys.join(", ")}은 공식 답 그림 또는 교사용 해설이 확보되지 않아 \`verified: false\`로 유지하며, 문제은행 선택 화면에서는 계속 잠급니다.`
      : "모든 원본 참조가 문항 DB에 연결되고 필수 메타데이터가 확인되었습니다."
    : "원본 문항 키 누락은 없지만, 위 필수 메타데이터 오류를 해결하기 전까지 전체 감사는 통과로 판정하지 않습니다.",
  ""
].join("\n");

console.log("SOURCE QUESTION DB AUDIT");
console.log(`expectedRawReferences=${summary.expectedRawReferences}`);
console.log(`expectedUniqueSourceKeys=${summary.expectedUniqueSourceKeys}`);
console.log(`indexedRecords=${summary.indexedRecords}`);
console.log(`referencedTypes=${summary.referencedTypes} totalTypes=${summary.totalTypes}`);
console.log(`missingSourceKeys=${summary.missingSourceKeys.length}`);
for (const sourceKey of summary.missingSourceKeys) console.log(`  MISSING ${sourceKey}`);
console.log(`unexpectedSourceKeys=${summary.unexpectedSourceKeys.length}`);
for (const sourceKey of summary.unexpectedSourceKeys) console.log(`  UNEXPECTED ${sourceKey}`);
console.log(`duplicateIndexedSourceKeys=${summary.duplicateIndexedSourceKeys.length}`);
for (const sourceKey of summary.duplicateIndexedSourceKeys) console.log(`  DUPLICATE ${sourceKey}`);
console.log(`orphanUnroutedTypes=${summary.orphanUnroutedTypes.length}`);
for (const typeId of summary.orphanUnroutedTypes) console.log(`  ORPHAN_TYPE ${typeId}`);
console.log(`unverifiedSourceKeys=${summary.unverifiedSourceKeys.length}`);
for (const sourceKey of summary.unverifiedSourceKeys) console.log(`  UNVERIFIED ${sourceKey}`);
console.log(`failures=${summary.failures.length}`);
for (const { category, message } of summary.failures) console.log(`  FAIL [${category}] ${message}`);
console.log(`warnings=${summary.warnings.length}`);
for (const { category, message } of summary.warnings) console.log(`  WARN [${category}] ${message}`);

if (process.argv.includes("--json")) console.log(JSON.stringify(summary, null, 2));
if (process.argv.includes("--write-report")) {
  writeFileSync(new URL("./SOURCE-QUESTION-DB-AUDIT.md", import.meta.url), markdownReport());
  console.log("report=SOURCE-QUESTION-DB-AUDIT.md");
}
if (failures.length > 0) process.exitCode = 1;
