(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_DP_CM1_ENTRY_202405_REVIEW_INVENTORY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "DP";
  const ROUND_CODE = "DP-CM1-202405";
  const TRACK_CODE = "CM1_ENTRY";
  const RESPONSE_TYPES = Object.freeze(["input"]);
  const RESPONSE_FORMATS = Object.freeze(["single_choice", "short_answer"]);
  const DIFFICULTIES = Object.freeze(["standard", "advanced"]);
  const ANSWER_AUDIT_STATUSES = Object.freeze(["verified_private", "blocked_stem_ambiguity"]);
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl", "url", "uri", "sha256"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;
  const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{1,47}$/;

  const SOURCE_EXAM_ID = core.createNeutralId("exam", MODE, "review:cm1-entry:202405:source-exam");
  const SOURCE_ASSET_ID = core.createNeutralId("source", MODE, "review:cm1-entry:202405:source-asset");

  // number, rendered source page, curriculum, major, detail, difficulty, response format, answer-audit state
  const ROWS = Object.freeze([
    [1, 3, "G9-S2", "중3-2", "GEOM-TRIG", "삼각비", "DT-001", "특수각 삼각비 식의 참·거짓 판별", "standard", "single_choice", "verified_private"],
    [2, 3, "G8-S1", "중2-1", "NUM-REPEAT-DEC", "유리수와 순환소수", "DT-002", "무한소수의 분수 변환과 분자·분모 관계", "standard", "single_choice", "verified_private"],
    [3, 3, "G8-S1", "중2-1", "ALG-EXPONENT", "식의 계산", "DT-003", "지수법칙을 이용한 나눗셈 식의 역산", "standard", "single_choice", "verified_private"],
    [4, 3, "G8-S1", "중2-1", "ALG-SYSTEM-APP", "연립일차방정식의 활용", "DT-004", "승하차 인원과 구간 요금 모델링", "advanced", "single_choice", "verified_private"],
    [5, 4, "G8-S1", "중2-1", "FUNC-LINEAR-AREA", "일차함수", "DT-005", "두 직선의 교점과 좌표축 사이 넓이", "advanced", "single_choice", "verified_private"],
    [6, 4, "G8-S2", "중2-2", "GEOM-SIM-VOLUME", "도형의 닮음", "DT-006", "닮은 원뿔의 높이비와 부피비", "standard", "single_choice", "verified_private"],
    [7, 4, "G8-S2", "중2-2", "GEOM-TRI-CENTER", "삼각형의 성질", "DT-007", "내심·외심이 놓인 선분의 각 추적", "advanced", "single_choice", "verified_private"],
    [8, 4, "G7-S2", "중1-2", "GEOM-SOLID-SURFACE", "입체도형의 성질", "DT-008", "원기둥 관통 구멍에 따른 겉넓이 변화", "advanced", "single_choice", "verified_private"],
    [9, 5, "G8-S1", "중2-1", "FUNC-LINEAR-AREA", "일차함수", "DT-009", "직선이 나누는 좌표도형의 넓이 조건", "advanced", "short_answer", "verified_private"],
    [10, 5, "G8-S2", "중2-2", "GEOM-INCIRCLE-PYTHAG", "삼각형의 성질·피타고라스 정리", "DT-010", "두 직각삼각형 내접원의 접점 거리", "advanced", "single_choice", "verified_private"],
    [11, 5, "G8-S2", "중2-2", "GEOM-PARALLELOGRAM", "사각형의 성질", "DT-011", "움직이는 점과 평행사변형 각의 이등분선", "advanced", "single_choice", "verified_private"],
    [12, 5, "G8-S2", "중2-2", "GEOM-SQUARE-AREA", "사각형의 성질", "DT-012", "정사각형 중심에서 직교하는 두 선분의 넓이", "advanced", "single_choice", "verified_private"],
    [13, 6, "G9-S2", "중3-2", "GEOM-TRIG-SOLID", "삼각비", "DT-013", "직육면체의 면별 삼각비를 공간각에 연결", "advanced", "short_answer", "verified_private"],
    [14, 6, "G8-S1", "중2-1", "ALG-INEQUALITY-PERCENT", "일차부등식", "DT-014", "파손률과 목표 이익률의 최소 조건", "standard", "single_choice", "verified_private"],
    [15, 6, "G9-S2", "중3-2", "STAT-DISTRIBUTION-SD", "통계", "DT-015", "도수분포표의 평균 조건과 표준편차", "advanced", "short_answer", "verified_private"],
    [16, 6, "G8S2-G9S1-LINK", "중2-2·중3-1 연계", "PROB-RADICAL", "확률·제곱근과 실수", "DT-016", "주사위 곱이 완전제곱 조건을 만족할 확률", "advanced", "short_answer", "verified_private"],
    [17, 7, "G9-S2", "중3-2", "GEOM-CIRCLE-ARC", "원의 성질", "DT-017", "호의 중점과 교차 현의 각 추적", "advanced", "short_answer", "verified_private"],
    [18, 7, "G9-S2", "중3-2", "STAT-LINEAR-TRANSFORM", "통계", "DT-018", "일차변환된 자료의 평균과 분산", "standard", "single_choice", "verified_private"],
    [19, 7, "G9-S2", "중3-2", "GEOM-CIRCLE-TANGENT", "원의 성질", "DT-019", "두 원의 접선과 접현을 이용한 각 추적", "advanced", "short_answer", "verified_private"],
    [20, 7, "G8-S1", "중2-1", "FUNC-LINEAR-MOTION", "일차함수", "DT-020", "움직이는 점에 따른 두 삼각형 넓이의 합", "standard", "short_answer", "verified_private"],
    [21, 8, "G8S2-G9S2-LINK", "중2-2·중3-2 연계", "GEOM-CENTER-CIRCLE", "삼각형의 중심·원의 성질", "DT-021", "내심 직선과 외접원의 호 중점 성질", "advanced", "short_answer", "verified_private"],
    [22, 8, "G8-S2", "중2-2", "GEOM-PYTHAG-AREA", "피타고라스 정리", "DT-022", "사분원 내 직사각형의 넓이와 경로 길이", "standard", "single_choice", "verified_private"],
    [23, 8, "G8-S1", "중2-1", "ALG-EXPRESSION-AREA", "식의 계산", "DT-023", "잘라낸 도형의 넓이를 식으로 비교", "advanced", "single_choice", "verified_private"],
    [24, 8, "G9-S1", "중3-1", "ALG-QUADRATIC-FORMULA", "이차방정식", "DT-024", "잘못 적용한 근의 공식에서 원식의 근의 합 복원", "standard", "single_choice", "verified_private"],
    [25, 9, "G9-S1", "중3-1", "FUNC-QUADRATIC-SCALE", "이차함수", "DT-025", "원점을 지나는 직선과 두 포물선의 확대 관계", "advanced", "single_choice", "verified_private"],
    [26, 9, "G9-S1", "중3-1", "NUM-RADICAL-COUNT", "제곱근과 실수", "DT-026", "연속한 자연수 사이 무리수 제곱근의 개수", "standard", "single_choice", "verified_private"],
    [27, 9, "G8-S2", "중2-2", "PROB-COUNT-MOD", "경우의 수와 확률", "DT-027", "세 주사위 합을 정다각형 이동의 나머지와 연결", "advanced", "short_answer", "verified_private"],
    [28, 9, "G9-S1", "중3-1", "FUNC-QUADRATIC-MAX-AREA", "이차함수", "DT-028", "포물선과 할선 사이 삼각형 넓이의 최댓값", "advanced", "short_answer", "verified_private"],
    [29, 10, "G8-S2-LINK", "중2-2 연계", "GEOM-SIM-MODEL", "도형의 닮음", "DT-029", "높이 제한과 장애물 폭을 이용한 투척 거리 모델", "advanced", "short_answer", "verified_private"],
    [30, 10, "G8-S1", "중2-1", "ALG-SYSTEM-RATE", "연립일차방정식의 활용", "DT-030", "출발 시차·추월·도착 시차가 있는 속력 문제", "standard", "single_choice", "verified_private"]
  ]);

  function freezeCandidate(code, label) {
    return Object.freeze({ code, label });
  }

  function createItem(row) {
    const number = row[0];
    const suffix = String(number).padStart(2, "0");
    const id = core.createNeutralId("question", MODE, `review:cm1-entry:202405:item:${suffix}`);
    return Object.freeze({
      id,
      number,
      sourcePage: row[1],
      curriculumCandidate: freezeCandidate(row[2], row[3]),
      majorCandidate: freezeCandidate(row[4], row[5]),
      detailCandidate: freezeCandidate(row[6], row[7]),
      difficultyCandidate: row[8],
      pointCandidate: 1,
      officialWeight: false,
      responseCandidate: "input",
      responseFormatCandidate: row[9],
      answerAuditStatus: row[10],
      classificationStatus: "verified",
      resolutionStatus: number === 29
        ? "replacement_verified"
        : row[10] === "verified_private" ? "agent_verified" : "review_blocked",
      lineageRef: Object.freeze({
        sourceExamId: SOURCE_EXAM_ID,
        sourceAssetId: SOURCE_ASSET_ID,
        lineageId: core.createNeutralId("lineage", MODE, `review:cm1-entry:202405:lineage:${suffix}`),
        originalQuestionId: id,
        questionTypeId: core.createNeutralId("type", MODE, `review:cm1-entry:202405:type:${row[6]}`),
        relation: number === 29 ? "replacement" : "original"
      })
    });
  }

  const items = Object.freeze(ROWS.map(createItem));

  function rejectForbidden(value, location, issues) {
    if (typeof value === "string" && PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      rejectForbidden(value[key], `${location}.${key}`, issues);
    });
  }

  function validateReviewInventory(inventory) {
    const issues = [];
    if (!inventory || inventory.reviewOnly !== true) issues.push("inventory.review_only");
    if (!inventory || inventory.mode !== MODE) issues.push("inventory.mode");
    if (!inventory || inventory.roundCode !== ROUND_CODE || inventory.trackCode !== TRACK_CODE) issues.push("inventory.round_track");
    if (!inventory || inventory.durationMinutes !== 150 || inventory.durationScope !== "source_revision_only") issues.push("inventory.duration");
    if (!inventory || !inventory.cutlineCandidate || inventory.cutlineCandidate.basis !== "correct_count"
      || inventory.cutlineCandidate.value !== 20 || inventory.cutlineCandidate.scope !== "source_revision_only"
      || inventory.cutlineCandidate.approved !== false) issues.push("inventory.cutline");
    if (!inventory || !inventory.sourceLayout || inventory.sourceLayout.renderedPageCount !== 11
      || inventory.sourceLayout.coverPage !== 1 || inventory.sourceLayout.answerPage !== 11
      || inventory.sourceLayout.blankPages.join(",") !== "2"
      || inventory.sourceLayout.questionPages.join(",") !== "3,4,5,6,7,8,9,10") issues.push("inventory.source_layout");
    if (!inventory || !inventory.answerAvailability || inventory.answerAvailability.itemCount !== 30
      || inventory.answerAvailability.detailedSolutions !== false) issues.push("inventory.answer_availability");
    if (!inventory || !core.isNeutralId(inventory.sourceExamId, "exam", MODE)) issues.push("inventory.source_exam_id");
    const list = inventory && Array.isArray(inventory.items) ? inventory.items : [];
    if (list.length !== 30) issues.push("inventory.item_count");
    const seen = new Set();
    list.forEach(function (item, index) {
      const prefix = `item.${index + 1}`;
      if (!item || item.number !== index + 1) issues.push(`${prefix}.number`);
      if (!item || !Number.isSafeInteger(item.sourcePage) || item.sourcePage < 3 || item.sourcePage > 10) issues.push(`${prefix}.source_page`);
      if (!item || !core.isNeutralId(item.id, "question", MODE) || seen.has(item.id)) issues.push(`${prefix}.id`);
      if (item && item.id) seen.add(item.id);
      ["curriculumCandidate", "majorCandidate", "detailCandidate"].forEach(function (field) {
        const candidate = item && item[field];
        if (!candidate || !CODE_PATTERN.test(candidate.code) || typeof candidate.label !== "string" || !candidate.label.trim()) issues.push(`${prefix}.${field}`);
      });
      if (!item || !DIFFICULTIES.includes(item.difficultyCandidate)) issues.push(`${prefix}.difficulty`);
      if (!item || item.pointCandidate !== 1 || item.officialWeight !== false) issues.push(`${prefix}.point`);
      if (!item || !RESPONSE_TYPES.includes(item.responseCandidate) || !RESPONSE_FORMATS.includes(item.responseFormatCandidate)) issues.push(`${prefix}.response`);
      if (!item || !ANSWER_AUDIT_STATUSES.includes(item.answerAuditStatus)) issues.push(`${prefix}.answer_audit_status`);
      if (!item || item.classificationStatus !== "verified") issues.push(`${prefix}.classification_status`);
      const expectedResolution = item && item.number === 29
        ? "replacement_verified"
        : item && item.answerAuditStatus === "verified_private" ? "agent_verified" : "review_blocked";
      if (!item || item.resolutionStatus !== expectedResolution) issues.push(`${prefix}.resolution_status`);
      const ref = item && item.lineageRef;
      if (!ref || ref.sourceExamId !== inventory.sourceExamId || ref.sourceAssetId !== inventory.sourceAssetId) issues.push(`${prefix}.lineage.source`);
      if (!ref || !core.isNeutralId(ref.lineageId, "lineage", MODE) || !core.isNeutralId(ref.questionTypeId, "type", MODE)) issues.push(`${prefix}.lineage.id`);
      const expectedRelation = item && item.number === 29 ? "replacement" : "original";
      if (!ref || ref.originalQuestionId !== item.id || ref.relation !== expectedRelation) issues.push(`${prefix}.lineage.original`);
    });
    const blocked = list.filter(function (item) { return item.resolutionStatus === "review_blocked"; }).map(function (item) { return item.number; });
    if (blocked.length !== 0) issues.push("inventory.blocked_items");
    rejectForbidden(inventory, "inventory", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function evaluateReviewGate(inventory) {
    const issues = Array.from(validateReviewInventory(inventory));
    if (inventory && inventory.items.some(function (item) { return item.resolutionStatus === "review_blocked"; })) issues.push("review.answer_audit_blocked");
    const canAssemble = issues.length === 0;
    issues.push("review.final_exam_confirmation_pending");
    return Object.freeze({ canAssemble, canRelease: false, issues: Object.freeze(Array.from(new Set(issues)).sort()) });
  }

  const inventory = Object.freeze({
    id: core.createNeutralId("policy", MODE, "review:cm1-entry:202405:inventory"),
    reviewOnly: true,
    mode: MODE,
    roundCode: ROUND_CODE,
    trackCode: TRACK_CODE,
    durationMinutes: 150,
    durationScope: "source_revision_only",
    cutlineCandidate: Object.freeze({ basis: "correct_count", value: 20, scope: "source_revision_only", approved: false }),
    sourceLayout: Object.freeze({
      renderedPageCount: 11,
      coverPage: 1,
      blankPages: Object.freeze([2]),
      questionPages: Object.freeze([3, 4, 5, 6, 7, 8, 9, 10]),
      answerPage: 11
    }),
    answerAvailability: Object.freeze({ itemCount: 30, detailedSolutions: false }),
    sourceExamId: SOURCE_EXAM_ID,
    sourceAssetId: SOURCE_ASSET_ID,
    items
  });

  return Object.freeze({
    MODE,
    ROUND_CODE,
    TRACK_CODE,
    RESPONSE_TYPES,
    RESPONSE_FORMATS,
    DIFFICULTIES,
    ANSWER_AUDIT_STATUSES,
    FORBIDDEN_KEYS,
    inventory,
    validateReviewInventory,
    evaluateReviewGate
  });
});
