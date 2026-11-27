import {
  ACADEMY_STYLES,
  DIAGNOSTIC_EXAM_TYPES,
  DOMAINS,
  EXAMS,
  FINAL_EXAM_TYPES,
  PRACTICE_EXAM_TYPES,
  SOURCE_QUESTION_INDEX,
  typeById
} from "./source-data.js?v=20261127a";

const DOMAIN_BY_ID = new Map(DOMAINS.map((item) => [item.id, item]));
const STYLE_BY_ID = new Map(ACADEMY_STYLES.map((item) => [item.id, item]));
const TEXTBOOK_STAGE_ORDER = new Map(["concept", "type", "practice", "advanced"].map((id, index) => [id, index]));

export const RESULT_EXAM_GROUPS = Object.freeze([
  Object.freeze({ id: "diagnostic", label: "진단 모의고사", exams: DIAGNOSTIC_EXAM_TYPES }),
  Object.freeze({ id: "practice", label: "실전 모의고사", exams: PRACTICE_EXAM_TYPES }),
  Object.freeze({ id: "final", label: "파이널 모의고사", exams: FINAL_EXAM_TYPES }),
  Object.freeze({ id: "selection", label: "원본 선발시험", exams: EXAMS })
]);

export const RESULT_EXAMS = Object.freeze(RESULT_EXAM_GROUPS.flatMap((group) => group.exams.map((exam) => Object.freeze({
  ...exam,
  resultGroupId: group.id,
  resultGroupLabel: group.label
}))));

export const RESULT_EXAM_BY_ID = new Map(RESULT_EXAMS.map((exam) => [exam.id, exam]));

const textbookReferencesByType = (() => {
  const index = new Map();
  for (const record of SOURCE_QUESTION_INDEX) {
    if (record.sourceKind !== "textbook") continue;
    for (const typeId of record.typeIds || [record.typeId]) {
      const list = index.get(typeId) || [];
      list.push(record);
      index.set(typeId, list);
    }
  }
  return index;
})();

export function stageLabelForExam(exam) {
  const labels = {
    diagnostic: "진단 기준",
    k6_winter: "6세 12월~7세 2월",
    k7_spring: "7세 3월~5월",
    k7_summer: "7세 6월~8월",
    k7_november: "7세 9월~12월",
    k7_to_g1: "7세 12월~초1 2월",
    g1_spring: "초1 3월~5월",
    g1_summer: "초1 6월~8월",
    g1_fall: "초1 8월~10월",
    g1_winter: "초1 11월~1월",
    final: "시험 직전 점검"
  };
  return labels[exam?.stage] || exam?.resultGroupLabel || "시험 결과";
}

export function textbookReferencesForType(typeId) {
  const seen = new Set();
  return (textbookReferencesByType.get(typeId) || [])
    .map((record) => ({
      bookId: record.bookId,
      bookLabel: record.sourceLabel?.split(" ")[0] || record.bookId,
      unitIndex: record.unitIndex,
      unitLabel: record.unitLabel,
      stageId: record.textbookStageId,
      stageLabel: record.textbookStageLabel,
      sourceLocator: record.sourceLocator
    }))
    .filter((record) => {
      const key = `${record.bookId}:${record.unitIndex}:${record.stageId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => String(a.bookId).localeCompare(String(b.bookId))
      || Number(a.unitIndex) - Number(b.unitIndex)
      || (TEXTBOOK_STAGE_ORDER.get(a.stageId) ?? 99) - (TEXTBOOK_STAGE_ORDER.get(b.stageId) ?? 99));
}

function questionMeta(question) {
  const type = typeById(question.typeId);
  const classification = question.classification || type?.classification || null;
  const academyStyleIds = [...new Set(classification?.academyStyleIds || type?.academyStyleIds || [])];
  return {
    question,
    type,
    classification,
    domain: DOMAIN_BY_ID.get(classification?.majorDomainId || type?.domain),
    academyStyleIds,
    academyStyleLabels: academyStyleIds.map((id) => STYLE_BY_ID.get(id)?.label || id)
  };
}

function addStat(map, key, seed, result) {
  if (!map.has(key)) map.set(key, { ...seed, total: 0, correct: 0, wrong: 0, unanswered: 0, numbers: [], wrongNumbers: [] });
  const row = map.get(key);
  row.total += 1;
  row.numbers.push(seed.number);
  if (result === "correct") row.correct += 1;
  else if (result === "incorrect") {
    row.wrong += 1;
    row.wrongNumbers.push(seed.number);
  } else row.unanswered += 1;
  return row;
}

export function analyzeExamResults(exam, responses = {}) {
  if (!exam) throw new Error("시험 정보가 없습니다.");
  const domainStats = new Map();
  const middleStats = new Map();
  const typeStats = new Map();
  const questionResults = exam.questions.map((question) => {
    const meta = questionMeta(question);
    const result = responses[question.number];
    const domainId = meta.classification?.majorDomainId || meta.type?.domain || "unclassified";
    const domainLabel = meta.classification?.majorDomainLabel || meta.domain?.label || "미분류";
    const middle = meta.classification?.minorDomain || meta.type?.middle || "미분류";
    const typeId = meta.classification?.detailedTypeId || meta.type?.id || question.typeId;
    const typeLabel = meta.classification?.detailedTypeLabel || meta.type?.label || question.note || "유형 확인 필요";

    addStat(domainStats, domainId, { id: domainId, label: domainLabel, number: question.number }, result);
    addStat(middleStats, `${domainId}:${middle}`, { id: `${domainId}:${middle}`, domainId, domainLabel, label: middle, number: question.number }, result);
    const typeRow = addStat(typeStats, typeId, {
      id: typeId,
      label: typeLabel,
      domainId,
      domainLabel,
      middle,
      representativeConceptLabel: meta.classification?.representativeConceptLabel || middle,
      academyStyleIds: meta.academyStyleIds,
      academyStyleLabels: meta.academyStyleLabels,
      textbookReferences: textbookReferencesForType(typeId),
      number: question.number
    }, result);
    typeRow.firstNumber = Math.min(typeRow.firstNumber ?? question.number, question.number);

    return {
      number: question.number,
      result: result === "correct" || result === "incorrect" ? result : "unanswered",
      note: question.note || typeLabel,
      difficulty: question.difficulty || "actual",
      typeId,
      typeLabel,
      middle,
      domainId,
      domainLabel,
      representativeConceptLabel: meta.classification?.representativeConceptLabel || middle,
      academyStyleLabels: meta.academyStyleLabels
    };
  });

  const correct = questionResults.filter((item) => item.result === "correct").length;
  const wrong = questionResults.filter((item) => item.result === "incorrect").length;
  const answered = correct + wrong;
  const total = questionResults.length;
  const withRates = (rows) => rows.map((row) => ({
    ...row,
    correctRate: row.total ? Math.round((row.correct / row.total) * 100) : 0,
    wrongRate: row.total ? Math.round((row.wrong / row.total) * 100) : 0
  }));
  const weaknessSort = (a, b) => b.wrong - a.wrong || b.wrongRate - a.wrongRate || a.firstNumber - b.firstNumber || a.label.localeCompare(b.label, "ko");

  return {
    exam,
    total,
    answered,
    correct,
    wrong,
    unanswered: total - answered,
    score: total ? Math.round((correct / total) * 100) : 0,
    complete: answered === total,
    questionResults,
    domainStats: withRates([...domainStats.values()]),
    middleStats: withRates([...middleStats.values()]).sort((a, b) => b.wrong - a.wrong || a.label.localeCompare(b.label, "ko")),
    weakTypes: withRates([...typeStats.values()]).filter((row) => row.wrong > 0).sort(weaknessSort)
  };
}

// options.paper — 문제은행 시험지로 바로(원장 2026-11-16 「문제은행식으로 시험지 형태로 나와야지」): build=1이면 고른 유형으로
//   문제를 만들어 곧장 3단계(시험지 미리보기·인쇄)를 연다. title: 시험지 머리 글. 없으면 예전처럼 유형이 미리 체크된 1단계.
export function remediationUrl(typeIds, student = "DEMO", count, options = {}) {
  const uniqueTypeIds = [...new Set(typeIds)].filter((id) => typeById(id));
  const params = new URLSearchParams({ student, mode: "type", types: uniqueTypeIds.join(",") });
  const targetCount = Number.isFinite(Number(count))
    ? Math.max(1, Math.min(50, Number(count)))
    : Math.max(10, Math.min(30, uniqueTypeIds.length * 5));
  params.set("count", String(targetCount));
  if (options.paper) {
    params.set("build", "1");
    params.set("form", "exam");   // 본문 꼴 = 시험지형(이번 한 번만, 저장된 선택은 그대로)
    params.set("cols", "2");      // 2단 · 쪽당 4문항(원장 2026-11-16 「4문제씩 정렬」)
    // 난이도(원장 2026-11-16 「더 어렵게 쉽게」): basic 더 쉽게 · actual 원본과 같게 · advanced 더 어렵게 — 문제은행 1단계의 난이도 단추와 같은 값
    if (["basic", "actual", "advanced"].includes(options.level)) params.set("level", options.level);
    if (options.title) params.set("title", options.title);
  }
  return `./index.html?${params.toString()}`;
}

export function resultStorageKey(student, examId) {
  return `fields-classic-result-diagnosis:${student || "DEMO"}:${examId}`;
}
