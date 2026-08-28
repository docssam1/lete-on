(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_WM_CM1_BASIC_ENTRY_R01_INVENTORY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "WM";
  const EXAM_ID = "wm-algebra-geometry-diagnostic";
  const ROUND_CODE = "WM-CM1-BASIC-R01";
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "downloadUrl", "storageUrl", "url", "uri", "sha256"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;

  const ALGEBRA_TYPES = Object.freeze([
    "유리수 필수개념",
    "유한소수·순환소수",
    "제곱근의 뜻",
    "제곱근의 성질",
    "실수와 수직선·정수부분과 소수부분",
    "지수법칙",
    "등식의 변형",
    "곱셈공식 변형·식의 값",
    "인수분해",
    "인수분해의 응용",
    "연립일차방정식 풀이",
    "부등식의 성질",
    "일차부등식·연립부등식",
    "이차방정식 풀이",
    "판별식",
    "근과 계수의 관계",
    "이차방정식의 활용",
    "일차함수 필수개념",
    "직선의 위치관계",
    "일차함수 그래프 해석",
    "이차함수 필수개념",
    "이차함수의 식·그래프의 평행이동",
    "이차함수의 최대·최소",
    "이차함수 그래프 해석",
    "일차함수와 이차함수의 그래프 해석"
  ]);

  const GEOMETRY_TYPE_CANDIDATES = Object.freeze([
    "확인 필요(원자료 표기 재검수)",
    "외심과 내심",
    "각의 이등분선의 성질",
    "사각형의 성질",
    "사각형 넓이의 비",
    "등적변형",
    "삼각형의 닮음 조건",
    "내각·외각의 이등분선",
    "무게중심·닮은 도형",
    "선분의 비·넓이의 비",
    "입체도형의 부피의 비",
    "색칠하기·도형의 개수",
    "사건과 경우의 수",
    "유클리드 호제법",
    "접은 도형·최단거리",
    "피타고라스 정리의 활용",
    "특수각의 삼각비",
    "삼각비의 활용",
    "삼각비의 입체도형 활용",
    "내접하기 위한 조건",
    "접선·원주각",
    "공통현",
    "공통접선·내접·외접",
    "원주각과 중심각의 활용",
    "두 원에 내접하는 사각형·삼각형"
  ]);

  function makeItem(sectionId, sectionPosition, typeLabel) {
    const number = sectionId === "ALG" ? sectionPosition : 25 + sectionPosition;
    const suffix = String(number).padStart(2, "0");
    return Object.freeze({
      id: core.createNeutralId("question", MODE, `review:cm1-basic:r01:item:${suffix}`),
      number,
      sectionId,
      sectionPosition,
      typeLabel,
      typeStatus: sectionId === "ALG" ? "verified_internal_variant" : "candidate_from_type_table",
      sourceStatus: sectionId === "ALG" ? "audited_internal_variant" : "missing_exact_25_item_source",
      answerAuditStatus: sectionId === "ALG" ? "source_present_review_pending" : "missing",
      responseContractStatus: "pending",
      difficultyStatus: "pending",
      releaseStatus: "locked"
    });
  }

  const items = Object.freeze(ALGEBRA_TYPES.map(function (label, index) {
    return makeItem("ALG", index + 1, label);
  }).concat(GEOMETRY_TYPE_CANDIDATES.map(function (label, index) {
    return makeItem("GEO", index + 1, label);
  })));

  function rejectForbidden(value, location, issues) {
    if (typeof value === "string" && PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      rejectForbidden(value[key], `${location}.${key}`, issues);
    });
  }

  function validateInventory(candidate) {
    const issues = [];
    if (!candidate || candidate.reviewOnly !== true || candidate.mode !== MODE || candidate.examId !== EXAM_ID) issues.push("inventory.identity");
    if (!candidate || candidate.questionCount !== 50 || candidate.sectionMinutes !== 90 || candidate.breakMinutes !== 20) issues.push("inventory.structure");
    if (!candidate || !candidate.referenceDecision || candidate.referenceDecision.status !== "reference_only") issues.push("inventory.reference_decision");
    const list = candidate && Array.isArray(candidate.items) ? candidate.items : [];
    if (list.length !== 50) issues.push("inventory.item_count");
    const seen = new Set();
    list.forEach(function (item, index) {
      const prefix = `item.${index + 1}`;
      if (!item || item.number !== index + 1 || !core.isNeutralId(item.id, "question", MODE) || seen.has(item.id)) issues.push(`${prefix}.identity`);
      if (item && item.id) seen.add(item.id);
      const expectedSection = index < 25 ? "ALG" : "GEO";
      const expectedPosition = index < 25 ? index + 1 : index - 24;
      if (!item || item.sectionId !== expectedSection || item.sectionPosition !== expectedPosition) issues.push(`${prefix}.section`);
      if (!item || typeof item.typeLabel !== "string" || !item.typeLabel.trim()) issues.push(`${prefix}.type`);
      if (!item || item.releaseStatus !== "locked" || item.responseContractStatus !== "pending" || item.difficultyStatus !== "pending") issues.push(`${prefix}.gate`);
      if (expectedSection === "ALG" && (!item || item.sourceStatus !== "audited_internal_variant" || item.answerAuditStatus !== "source_present_review_pending")) issues.push(`${prefix}.algebra_source`);
      if (expectedSection === "GEO" && (!item || item.sourceStatus !== "missing_exact_25_item_source" || item.answerAuditStatus !== "missing")) issues.push(`${prefix}.geometry_source`);
    });
    rejectForbidden(candidate, "inventory", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function evaluateReviewGate(candidate) {
    const issues = Array.from(validateInventory(candidate));
    if (candidate && candidate.items.some(function (item) { return item.sourceStatus === "missing_exact_25_item_source"; })) issues.push("review.geometry_source_missing");
    if (candidate && candidate.items.some(function (item) { return item.answerAuditStatus !== "verified_private"; })) issues.push("review.answer_audit_pending");
    issues.push("review.response_contract_pending", "review.difficulty_audit_pending", "review.owner_confirmation_pending");
    return Object.freeze({ canAssemble: false, canRelease: false, issues: Object.freeze(Array.from(new Set(issues)).sort()) });
  }

  const inventory = Object.freeze({
    id: core.createNeutralId("policy", MODE, "review:cm1-basic:r01:inventory"),
    reviewOnly: true,
    mode: MODE,
    examId: EXAM_ID,
    roundCode: ROUND_CODE,
    title: "원수학 공통수학1 기본반 입학 대비 1회",
    questionCount: 50,
    sectionMinutes: 90,
    breakMinutes: 20,
    referenceDecision: Object.freeze({
      status: "reference_only",
      minimumCorrect: 35,
      reviewFrom: 32,
      sectionMinimums: Object.freeze({ ALG: 17, GEO: 15 })
    }),
    items
  });

  return Object.freeze({
    MODE,
    EXAM_ID,
    ROUND_CODE,
    ALGEBRA_TYPES,
    GEOMETRY_TYPE_CANDIDATES,
    FORBIDDEN_KEYS,
    inventory,
    validateInventory,
    evaluateReviewGate
  });
});
