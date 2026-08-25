(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_DP_MIDDLE22_ENTRY_202404_REVIEW_INVENTORY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "DP";
  const ROUND_CODE = "DP-M22-202404";
  const TRACK_CODE = "MIDDLE22_TRANSFER";
  const DIFFICULTIES = Object.freeze(["standard", "advanced"]);
  const RESPONSE_TYPES = Object.freeze(["input", "multi_input", "unordered_set"]);
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl", "url", "uri", "sha256"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;
  const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{1,47}$/;

  const SOURCE_EXAM_ID = core.createNeutralId("exam", MODE, "review:middle22-entry:202404:source-exam");
  const SOURCE_ASSET_ID = core.createNeutralId("source", MODE, "review:middle22-entry:202404:source-asset");

  // number, source page, curriculum, major, detail, difficulty, response type, slot count
  const ROWS = Object.freeze([
    [1, 3, "G7-S2", "중1-2", "GEOM-CONSTRUCTION", "기본도형과 작도", "DT-001", "원의 중심을 찾는 작도 절차 판별", "standard", "input", 1],
    [2, 3, "G7-S1", "중1-1", "NUM-PRIME-EXP", "소인수분해", "DT-002", "연속곱의 소인수 지수와 서로소 조건", "standard", "input", 1],
    [3, 3, "G8-S1", "중2-1", "FUNC-LINEAR-GRAPH", "일차함수", "DT-003", "두 일차함수의 절편과 길이비 연결", "standard", "input", 1],
    [4, 3, "G8-S2", "중2-2", "GEOM-SIM-RIGHT", "도형의 닮음", "DT-004", "직각삼각형 속 정사각형의 넓이", "standard", "input", 1],
    [5, 4, "ENRICH-COUNT", "중등 심화", "COUNT-CONSTRAINED", "경우의 수", "DT-005", "세 종류에서 모두 고르는 제한 선택", "advanced", "input", 1],
    [6, 4, "G8-S1", "중2-1", "ALG-EXPRESSION", "식의 계산", "DT-006", "분수식이 포함된 다항식 계산", "standard", "input", 1],
    [7, 4, "G8-S1", "중2-1", "ALG-SYSTEM-RATE", "연립일차방정식의 활용", "DT-007", "왕복 속력으로 흐르는 물의 속력 구하기", "standard", "input", 1],
    [8, 4, "G8-S2", "중2-2", "GEOM-SIM-TRAPEZOID", "도형의 닮음", "DT-008", "사다리꼴 대각선과 평행선의 길이비", "advanced", "input", 1],
    [9, 5, "G8-S2", "중2-2", "GEOM-CENTROID", "삼각형의 성질", "DT-009", "두 중선과 중점으로 만든 선분 길이", "standard", "input", 1],
    [10, 5, "G8-S2", "중2-2", "GEOM-RIGHT-COMPOSITE", "피타고라스 정리", "DT-010", "직교 조건이 겹친 합성도형의 길이", "advanced", "input", 1],
    [11, 5, "G8-S2", "중2-2", "GEOM-TRI-CENTER", "삼각형의 성질", "DT-011", "내심과 외심을 연결한 각 추적", "advanced", "input", 1],
    [12, 5, "G8-S1", "중2-1", "ALG-MULTIPLE-PATTERN", "일차방정식의 활용", "DT-012", "달력 배열과 배수 조건", "standard", "input", 1],
    [13, 6, "ENRICH-SERIES", "중등 심화", "NUM-SERIES-PATTERN", "수와 식의 규칙", "DT-013", "분모 규칙을 가진 무한합의 분수 표현", "advanced", "input", 1],
    [14, 6, "G8-S2", "중2-2", "GEOM-PARALLELOGRAM-ANGLE", "사각형의 성질", "DT-014", "평행사변형의 수선과 각 추적", "standard", "input", 1],
    [15, 6, "G8-S1", "중2-1", "ALG-SYSTEM-MOTION", "연립일차방정식의 활용", "DT-015", "두 사람과 왕복 이동체의 이동거리", "standard", "input", 1],
    [16, 6, "G8-S1", "중2-1", "FUNC-LINEAR-AREA", "일차함수", "DT-016", "직선 위 점과 고정 삼각형 넓이 조건", "advanced", "unordered_set", 2],
    [17, 7, "G8-S2", "중2-2", "GEOM-BISECTOR-AREA", "삼각형의 성질", "DT-017", "각의 이등분선과 넓이비", "advanced", "input", 1],
    [18, 7, "G8-S2", "중2-2", "GEOM-RECT-AREA-BISECT", "도형의 닮음", "DT-018", "직사각형을 이등분하는 선분의 길이", "advanced", "input", 1],
    [19, 7, "G8-S2", "중2-2", "GEOM-SIM-PARALLEL", "도형의 닮음", "DT-019", "평행한 세 선과 연속 길이비", "advanced", "input", 1],
    [20, 7, "G8-S2", "중2-2", "PROB-SEQUENTIAL", "경우의 수와 확률", "DT-020", "비복원 순차 추출 게임의 승리 확률", "advanced", "input", 1],
    [21, 8, "G7-S2", "중1-2", "GEOM-CIRCLE-SWEPT", "평면도형의 성질", "DT-021", "정사각형 둘레를 도는 원의 자취 넓이", "advanced", "input", 1],
    [22, 8, "G8-S2", "중2-2", "GEOM-PARALLELOGRAM-SIM", "도형의 닮음", "DT-022", "평행사변형의 연장선과 닮음 길이", "advanced", "input", 1],
    [23, 8, "G8-S2", "중2-2", "GEOM-CEVIAN-RATIO", "도형의 닮음", "DT-023", "삼등분점과 중점으로 만든 교점 길이", "advanced", "input", 1],
    [24, 8, "G8-S2", "중2-2", "GEOM-SQUARE-AREA", "피타고라스 정리", "DT-024", "직각이등변삼각형 속 정사각형 넓이", "advanced", "input", 1],
    [25, 9, "G7-S2", "중1-2", "GEOM-PARALLEL-ANGLE", "기본도형", "DT-025", "평행선과 꺾은선의 연속 각 추적", "standard", "input", 1],
    [26, 9, "G8-S2", "중2-2", "GEOM-PYTHAG-ALTITUDE", "피타고라스 정리", "DT-026", "직각삼각형의 중점과 수선 길이", "advanced", "input", 1],
    [27, 9, "G8-S1", "중2-1", "FUNC-COORD-AREA", "일차함수", "DT-027", "좌표 오각형 넓이를 이등분하는 직선", "advanced", "multi_input", 2],
    [28, 9, "G8-S2", "중2-2", "GEOM-AREA-RATIO", "도형의 닮음", "DT-028", "삼각형 내부 교점과 넓이비", "advanced", "input", 1],
    [29, 10, "G8-S1", "중2-1", "FUNC-LINEAR-AREA-RATIO", "일차함수", "DT-029", "두 직선 사이 점과 직사각형 넓이비", "advanced", "input", 1],
    [30, 10, "G8-S1", "중2-1", "ALG-SYSTEM-MOTION", "연립일차방정식의 활용", "DT-030", "차량 왕복과 보행의 동시 도착 조건", "advanced", "multi_input", 2]
  ]);

  function freezeCandidate(code, label) {
    return Object.freeze({ code, label });
  }

  function createItem(row) {
    const number = row[0];
    const suffix = String(number).padStart(2, "0");
    const id = core.createNeutralId("question", MODE, `review:middle22-entry:202404:item:${suffix}`);
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
      responseCandidate: row[9],
      responseSlotCount: row[10],
      answerStatus: number === 1 ? "key_completed_private" : "verified_private",
      classificationStatus: "agent_verified",
      resolutionStatus: "agent_verified",
      lineageRef: Object.freeze({
        sourceExamId: SOURCE_EXAM_ID,
        sourceAssetId: SOURCE_ASSET_ID,
        lineageId: core.createNeutralId("lineage", MODE, `review:middle22-entry:202404:lineage:${suffix}`),
        originalQuestionId: id,
        questionTypeId: core.createNeutralId("type", MODE, `review:middle22-entry:202404:type:${row[6]}`),
        relation: "original"
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
    if (!inventory || inventory.mode !== MODE || inventory.roundCode !== ROUND_CODE || inventory.trackCode !== TRACK_CODE) issues.push("inventory.identity");
    if (!inventory || inventory.durationMinutes !== 150 || inventory.durationScope !== "source_revision_only") issues.push("inventory.duration");
    if (!inventory || !inventory.cutlineCandidate || inventory.cutlineCandidate.value !== 20
      || inventory.cutlineCandidate.basis !== "correct_count" || inventory.cutlineCandidate.scope !== "source_revision_only"
      || inventory.cutlineCandidate.approved !== false) issues.push("inventory.cutline");
    if (!inventory || !inventory.sourceLayout || inventory.sourceLayout.renderedPageCount !== 11
      || inventory.sourceLayout.coverPage !== 1 || inventory.sourceLayout.blankPages.join(",") !== "2"
      || inventory.sourceLayout.questionPages.join(",") !== "3,4,5,6,7,8,9,10"
      || inventory.sourceLayout.answerPage !== 11) issues.push("inventory.source_layout");
    if (!inventory || !inventory.answerAvailability || inventory.answerAvailability.itemCount !== 30
      || inventory.answerAvailability.sourceKeyValues !== 29
      || inventory.answerAvailability.missingSourceKeys !== 1
      || inventory.answerAvailability.privateCompletions !== 1
      || inventory.answerAvailability.detailedSolutions !== false
      || inventory.answerAvailability.independentCheck !== "verified_private") issues.push("inventory.answer_availability");
    if (!inventory || !inventory.correctionSummary || inventory.correctionSummary.count !== 1
      || inventory.correctionSummary.itemNumbers.join(",") !== "1"
      || inventory.correctionSummary.type !== "missing_source_key_completion"
      || inventory.correctionSummary.protectedArtifactRequired !== true) issues.push("inventory.correction_summary");
    if (!inventory || !inventory.artifactStatus
      || inventory.artifactStatus.protectedScorer !== "verified"
      || inventory.artifactStatus.printAudit !== "passed"
      || inventory.artifactStatus.signedPageAssets !== "verified") issues.push("inventory.artifact_status");
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
      if (!item || !RESPONSE_TYPES.includes(item.responseCandidate)) issues.push(`${prefix}.response`);
      if (!item || !Number.isSafeInteger(item.responseSlotCount) || item.responseSlotCount < 1 || item.responseSlotCount > 4) issues.push(`${prefix}.response_slots`);
      if (item && item.responseCandidate === "input" && item.responseSlotCount !== 1) issues.push(`${prefix}.input_slots`);
      if (!item || item.pointCandidate !== 1 || item.officialWeight !== false) issues.push(`${prefix}.point`);
      const expectedAnswerStatus = item && item.number === 1 ? "key_completed_private" : "verified_private";
      if (!item || item.answerStatus !== expectedAnswerStatus) issues.push(`${prefix}.answer_status`);
      if (!item || item.classificationStatus !== "agent_verified" || item.resolutionStatus !== "agent_verified") issues.push(`${prefix}.review_status`);
      const ref = item && item.lineageRef;
      if (!ref || ref.sourceExamId !== inventory.sourceExamId || ref.sourceAssetId !== inventory.sourceAssetId) issues.push(`${prefix}.lineage.source`);
      if (!ref || !core.isNeutralId(ref.lineageId, "lineage", MODE) || !core.isNeutralId(ref.questionTypeId, "type", MODE)) issues.push(`${prefix}.lineage.id`);
      if (!ref || ref.originalQuestionId !== item.id || ref.relation !== "original") issues.push(`${prefix}.lineage.original`);
    });
    rejectForbidden(inventory, "inventory", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function evaluateReviewGate(inventory) {
    const issues = Array.from(validateReviewInventory(inventory));
    issues.push("review.final_exam_confirmation_pending");
    return Object.freeze({ canAssemble: issues.length === 1, canRelease: false, issues: Object.freeze(Array.from(new Set(issues)).sort()) });
  }

  const inventory = Object.freeze({
    id: core.createNeutralId("policy", MODE, "review:middle22-entry:202404:inventory"),
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
    answerAvailability: Object.freeze({
      itemCount: 30,
      sourceKeyValues: 29,
      missingSourceKeys: 1,
      privateCompletions: 1,
      detailedSolutions: false,
      independentCheck: "verified_private"
    }),
    correctionSummary: Object.freeze({
      count: 1,
      itemNumbers: Object.freeze([1]),
      type: "missing_source_key_completion",
      protectedArtifactRequired: true
    }),
    artifactStatus: Object.freeze({
      protectedScorer: "verified",
      printAudit: "passed",
      signedPageAssets: "verified"
    }),
    sourceExamId: SOURCE_EXAM_ID,
    sourceAssetId: SOURCE_ASSET_ID,
    items
  });

  return Object.freeze({
    MODE,
    ROUND_CODE,
    TRACK_CODE,
    DIFFICULTIES,
    RESPONSE_TYPES,
    inventory,
    validateReviewInventory,
    evaluateReviewGate
  });
});
