(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_SH_R01_REVIEW_INVENTORY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "SH";
  const WRITER = "T";
  const ANSWER_STATUS = "found/pending";
  const CLASSIFICATION_STATUS = "draft";
  const RESOLUTION_STATUS = "pending";
  const CLASSIFICATION_AGENT_VERIFIED_ITEMS = Object.freeze([2, 6, 9, 14, 18, 21, 23, 24, 27, 28, 29, 36]);
  const RELEASE_BLOCKER_SUMMARY = Object.freeze({
    itemCount: 9,
    pending: 0,
    status: "corrections_agent_verified",
    items: Object.freeze([3, 4, 8, 10, 11, 30, 33, 34, 39]),
    answerReviewItems: Object.freeze([3, 4, 8, 10, 11, 30]),
    visualReviewItems: Object.freeze([33, 34, 39])
  });
  const AGENT_DECISION_SUMMARY = Object.freeze({
    status: "agent_verified",
    finalExamConfirmation: "pending",
    items: Object.freeze([
      Object.freeze({ number: 3, disposition: "replace", correctionKind: "same_type_same_difficulty", executionStatus: "replacement_verified" }),
      Object.freeze({ number: 4, disposition: "keep", correctionKind: "answer_key", executionStatus: "agent_verified" }),
      Object.freeze({ number: 8, disposition: "keep", correctionKind: "independent_answer_verification", executionStatus: "agent_verified" }),
      Object.freeze({ number: 10, disposition: "keep", correctionKind: "independent_answer_verification", executionStatus: "agent_verified" }),
      Object.freeze({ number: 11, disposition: "keep", correctionKind: "independent_answer_verification", executionStatus: "agent_verified" }),
      Object.freeze({ number: 30, disposition: "keep", correctionKind: "source_faithful_typo", executionStatus: "agent_verified" }),
      Object.freeze({ number: 33, disposition: "keep", correctionKind: "solution_typo", executionStatus: "agent_verified" }),
      Object.freeze({ number: 34, disposition: "keep", correctionKind: "solution_typo", executionStatus: "agent_verified" }),
      Object.freeze({ number: 39, disposition: "keep", correctionKind: "table_layout", executionStatus: "agent_verified" })
    ])
  });
  const CLASSIFICATION_REVIEW_SUMMARY = Object.freeze({
    candidateCount: 40,
    highConfidence: 28,
    agentVerified: 12,
    agentVerifiedItems: CLASSIFICATION_AGENT_VERIFIED_ITEMS,
    ownerReview: 0,
    ownerReviewItems: Object.freeze([]),
    finalExamConfirmation: "pending"
  });
  const RESPONSE_CANDIDATES = Object.freeze(["input", "multi_input", "ordered_list", "unordered_set"]);
  const ITEM_KEYS = Object.freeze([
    "id", "number", "sourcePage", "curriculumCandidate", "majorCandidate", "detailCandidate",
    "responseCandidate", "answerStatus", "classificationStatus", "resolutionStatus", "lineageRef"
  ]);
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl", "url", "uri"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;
  const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{1,31}$/;

  const SOURCE_EXAM_ID = core.createNeutralId("exam", MODE, "review:sh-r01:source-exam");
  const SOURCE_ASSET_ID = core.createNeutralId("source", MODE, "review:sh-r01:source-asset");

  const ROWS = Object.freeze([
    [1, 1, "G7-S1-LINK", "중1-1 연계", "ALG-LINEAR-EQ", "문자와 식·일차방정식", "DT-001", "시계 시간 오차 모델링", "input"],
    [2, 1, "G7-S1-EXT", "중1-1 확장", "NUM-PRIME-LCM-EXT", "소인수분해·최소공배수 인접 확장", "DT-002", "두 나머지 조건의 동시 만족", "input"],
    [3, 1, "G7-S1", "중1-1", "NUM-RATIONAL", "정수와 유리수", "DT-003", "유리수 혼합 계산", "input"],
    [4, 1, "G7-S1", "중1-1", "NUM-PRIME-EQ", "소인수분해·일차방정식", "DT-004", "소인수 조건식", "input"],
    [5, 1, "G7-S1", "중1-1", "ALG-EXPRESSION", "문자의 사용과 식", "DT-005", "두 용기 사이 2단계 농도 이동", "input"],
    [6, 1, "G7-S1-LINK", "중1-1 연계", "ALG-LINEAR-ANGLE", "일차방정식의 활용·각", "DT-006", "시침·분침 상대각의 시간 역산", "input"],
    [7, 2, "G7-S1", "중1-1", "FUNC-COORD-GRAPH", "좌표평면과 그래프", "DT-007", "반비례 그래프와 도형", "multi_input"],
    [8, 2, "G7-S2", "중1-2", "GEOM-BASIC", "기본도형", "DT-008", "직선과 평면의 위치 관계", "unordered_set"],
    [9, 2, "G7-S2-LINK", "중1-2 연계", "GEOM-PARALLEL-CONG", "평행선과 합동", "DT-009", "직사각형 연속 접기의 각 추적", "input"],
    [10, 2, "G7-S2", "중1-2", "GEOM-CONSTRUCTION", "작도와 합동", "DT-010", "삼각형 성립 조건", "unordered_set"],
    [11, 3, "G7-S2", "중1-2", "GEOM-PLANE-AREA", "평면도형", "DT-011", "부채꼴과 직사각형 넓이", "input"],
    [12, 3, "G7-S2", "중1-2", "GEOM-SOLID", "입체도형", "DT-012", "원기둥과 구의 부피", "input"],
    [13, 3, "G8-S1", "중2-1", "NUM-REPEAT-DEC", "유리수와 순환소수", "DT-013", "순환소수 반올림 조건", "input"],
    [14, 3, "G8-S1-LINK", "중2-1 연계", "ALG-SYSTEM-CASE", "연립일차방정식 인접 확장", "DT-014", "최댓값·최솟값 경우 분기와 순서쌍", "multi_input"],
    [15, 3, "G8-S1", "중2-1", "ALG-SYSTEM", "연립일차방정식", "DT-015", "매개변수 해 조건", "input"],
    [16, 3, "G8-S1", "중2-1", "ALG-SYSTEM-APP", "연립일차방정식의 활용", "DT-016", "이자 관계식 모델링", "input"],
    [17, 4, "G8-S1", "중2-1", "ALG-INEQUALITY", "일차부등식", "DT-017", "혼합 범위의 공통 조건", "input"],
    [18, 4, "G7-S1-EXT", "중1-1 확장", "NUM-PRIME-EXT", "소인수분해 인접 확장", "DT-018", "큰 거듭제곱 합의 최소 소인수", "input"],
    [19, 4, "G7S1-G8S1-LINK", "중1-1·중2-1 연계", "FUNC-COORD-LINEAR", "좌표평면·일차함수", "DT-019", "넓이 이등분 직선", "input"],
    [20, 4, "G8-S1", "중2-1", "FUNC-LINEAR", "일차함수", "DT-020", "직선의 기울기 관계", "input"],
    [21, 4, "G7S1-G8S2-EXT", "중1-1·중2-2 확장", "FUNC-COORD-PYTHAG-EXT", "좌표·피타고라스 정리 인접 확장", "DT-021", "두 좌표축을 차례로 거치는 반사 최단경로", "multi_input"],
    [22, 4, "G8-S2", "중2-2", "PROB-COUNT", "경우의 수와 확률", "DT-022", "남은 승패열의 경우 계수", "input"],
    [23, 5, "G8-S2-EXT", "중2-2 확장", "PROB-COUNT-EXT", "경우의 수 인접 확장", "DT-023", "조건이 다른 위원 선출 경우의 수 순서 비교", "ordered_list"],
    [24, 5, "G8-S2-EXT", "중2-2 확장", "GEOM-TRI-AREA-EXT", "삼각형의 성질·넓이 인접 확장", "DT-024", "이등변삼각형에서 수선 길이의 합", "input"],
    [25, 5, "G8-S2", "중2-2", "GEOM-INCENTER-PYTHAG", "내심·피타고라스 정리", "DT-025", "두 직각삼각형 내심의 위치·거리", "input"],
    [26, 5, "G8-S2", "중2-2", "GEOM-SIM-PARALLEL", "닮음·평행선 길이비", "DT-026", "평행선과 삼각형 넓이비", "input"],
    [27, 6, "G8-S2-EXT", "중2-2 확장", "GEOM-PARALLELOGRAM-EXT", "사각형의 성질 인접 확장", "DT-027", "평행사변형 꼭짓점의 한 직선까지 거리 관계", "input"],
    [28, 6, "G7-S2-EXT", "중1-2 확장", "GEOM-SOLID-NET-EXT", "입체도형의 성질·겉넓이 인접 확장", "DT-028", "원뿔대 옆면 전개의 최단거리", "input"],
    [29, 6, "G8-S2-EXT", "중2-2 확장", "GEOM-TRI-AREA-EXT", "삼각형 넓이비 인접 확장", "DT-029", "교차 선분과 분할 삼각형 넓이비", "input"],
    [30, 6, "G9-S1-LINK", "중3-1 연계", "NUM-RADICAL", "제곱근과 실수", "DT-030", "제곱근 반올림 구간", "input"],
    [31, 7, "G9-S1-EXT", "중3-1 확장", "NUM-RADICAL-CALC", "근호를 포함한 식의 계산", "DT-031", "완전제곱 변형·근호식 간단화", "input"],
    [32, 7, "G9-S1", "중3-1", "ALG-QUADRATIC-APP", "이차방정식의 활용", "DT-032", "두 단계 농도 치환 이차방정식", "input"],
    [33, 7, "G9-S1", "중3-1", "ALG-QUADRATIC", "이차방정식", "DT-033", "정수근 매개변수 조건", "input"],
    [34, 7, "G9-S1", "중3-1", "FUNC-QUADRATIC", "이차함수", "DT-034", "매개변수와 고정점", "input"],
    [35, 7, "G9-S1", "중3-1", "FUNC-QUADRATIC", "이차함수", "DT-035", "포물선 위 점과 넓이", "unordered_set"],
    [36, 7, "G7-S2-EXT", "중1-2 확장", "GEOM-SOLID-VOLUME-EXT", "입체도형의 성질·부피 인접 확장", "DT-036", "대각선 축 회전 합성 입체의 부피", "input"],
    [37, 8, "G9-S2", "중3-2", "GEOM-TRIG", "삼각비", "DT-037", "수선과 삼각비 관계", "input"],
    [38, 8, "G9-S2", "중3-2", "GEOM-TRIG-CIRCLE", "삼각비·원의 성질", "DT-038", "반원 접선과 길이비", "input"],
    [39, 8, "G9-S1", "중3-1", "ALG-FACT-INT", "인수분해·정수", "DT-039", "곱셈꼴 변형과 정수 순서쌍", "input"],
    [40, 8, "G8S2-G9S1-LINK", "중2-2·중3-1 연계", "PROB-QUADRATIC", "확률·이차방정식", "DT-040", "계수 순서쌍의 정수근 조건", "input"]
  ]);

  function freezeCandidate(code, label) {
    return Object.freeze({ code, label });
  }

  function createItem(row) {
    const number = row[0];
    const suffix = String(number).padStart(2, "0");
    const id = core.createNeutralId("question", MODE, `review:sh-r01:item:${suffix}`);
    return Object.freeze({
      id,
      number,
      sourcePage: row[1],
      curriculumCandidate: freezeCandidate(row[2], row[3]),
      majorCandidate: freezeCandidate(row[4], row[5]),
      detailCandidate: freezeCandidate(row[6], row[7]),
      responseCandidate: row[8],
      answerStatus: ANSWER_STATUS,
      classificationStatus: CLASSIFICATION_AGENT_VERIFIED_ITEMS.includes(number) ? "verified" : CLASSIFICATION_STATUS,
      resolutionStatus: RESOLUTION_STATUS,
      lineageRef: Object.freeze({
        sourceExamId: SOURCE_EXAM_ID,
        sourceAssetId: SOURCE_ASSET_ID,
        lineageId: core.createNeutralId("lineage", MODE, `review:sh-r01:lineage:${suffix}`),
        originalQuestionId: id,
        questionTypeId: core.createNeutralId("type", MODE, `review:sh-r01:type:${row[6]}`),
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
    if (!inventory || inventory.mode !== MODE) issues.push("inventory.mode");
    if (!inventory || inventory.writer !== WRITER) issues.push("inventory.writer");
    if (!inventory || !core.isNeutralId(inventory.sourceExamId, "exam", MODE)) issues.push("inventory.source_exam_id");
    const list = inventory && Array.isArray(inventory.items) ? inventory.items : [];
    if (list.length !== 40) issues.push("inventory.item_count");
    const seen = new Set();
    list.forEach(function (item, index) {
      const prefix = `item.${index + 1}`;
      if (!item || Object.keys(item).sort().join("|") !== ITEM_KEYS.slice().sort().join("|")) issues.push(`${prefix}.shape`);
      if (!item || item.number !== index + 1) issues.push(`${prefix}.number`);
      if (!item || !Number.isSafeInteger(item.sourcePage) || item.sourcePage < 1 || item.sourcePage > 8) issues.push(`${prefix}.source_page`);
      if (!item || !core.isNeutralId(item.id, "question", MODE) || seen.has(item.id)) issues.push(`${prefix}.id`);
      if (item && item.id) seen.add(item.id);
      ["curriculumCandidate", "majorCandidate", "detailCandidate"].forEach(function (field) {
        const candidate = item && item[field];
        if (!candidate || !CODE_PATTERN.test(candidate.code) || typeof candidate.label !== "string" || !candidate.label.trim()) {
          issues.push(`${prefix}.${field}`);
        }
      });
      if (!item || !RESPONSE_CANDIDATES.includes(item.responseCandidate)) issues.push(`${prefix}.response_candidate`);
      if (!item || item.answerStatus !== ANSWER_STATUS) issues.push(`${prefix}.answer_status`);
      const expectedClassificationStatus = CLASSIFICATION_AGENT_VERIFIED_ITEMS.includes(index + 1) ? "verified" : CLASSIFICATION_STATUS;
      if (!item || item.classificationStatus !== expectedClassificationStatus) issues.push(`${prefix}.classification_status`);
      if (!item || item.resolutionStatus !== RESOLUTION_STATUS) issues.push(`${prefix}.resolution_status`);
      const ref = item && item.lineageRef;
      if (!ref || ref.sourceExamId !== inventory.sourceExamId) issues.push(`${prefix}.lineage.source_exam`);
      if (!ref || ref.sourceAssetId !== inventory.sourceAssetId) issues.push(`${prefix}.lineage.source_asset`);
      if (!ref || !core.isNeutralId(ref.lineageId, "lineage", MODE)) issues.push(`${prefix}.lineage.id`);
      if (!ref || ref.originalQuestionId !== item.id || ref.relation !== "original") issues.push(`${prefix}.lineage.original`);
      if (!ref || !core.isNeutralId(ref.questionTypeId, "type", MODE)) issues.push(`${prefix}.lineage.type`);
    });
    const blockerSummary = inventory && inventory.releaseBlockerSummary;
    if (!blockerSummary || blockerSummary.itemCount !== 9 || blockerSummary.pending !== 0 || blockerSummary.status !== "corrections_agent_verified") {
      issues.push("inventory.release_blocker_summary");
    }
    const blockerItems = blockerSummary && Array.isArray(blockerSummary.items) ? blockerSummary.items : [];
    if (new Set(blockerItems).size !== 9 || blockerItems.some(function (number) { return !Number.isInteger(number) || number < 1 || number > 40; })) {
      issues.push("inventory.release_blocker_items");
    }
    const classificationSummary = inventory && inventory.classificationReviewSummary;
    const ownerReviewItems = classificationSummary && Array.isArray(classificationSummary.ownerReviewItems)
      ? classificationSummary.ownerReviewItems : [];
    const agentVerifiedItems = classificationSummary && Array.isArray(classificationSummary.agentVerifiedItems)
      ? classificationSummary.agentVerifiedItems : [];
    if (!classificationSummary || classificationSummary.ownerReview !== 0 || ownerReviewItems.length !== 0) {
      issues.push("inventory.classification_review_items");
    }
    if (!classificationSummary || classificationSummary.agentVerified !== 12
      || agentVerifiedItems.join(",") !== CLASSIFICATION_AGENT_VERIFIED_ITEMS.join(",")
      || classificationSummary.finalExamConfirmation !== "pending") {
      issues.push("inventory.classification_agent_verified_items");
    }
    const decisions = inventory && inventory.agentDecisionSummary;
    const decisionItems = decisions && Array.isArray(decisions.items) ? decisions.items : [];
    if (!decisions || decisions.status !== "agent_verified" || decisions.finalExamConfirmation !== "pending" || decisionItems.length !== 9) {
      issues.push("inventory.agent_decision_summary");
    }
    if (decisionItems.map(function (item) { return item.number; }).join(",") !== blockerItems.join(",") || decisionItems.some(function (item) {
      return !item || !["keep", "replace"].includes(item.disposition) || !["pending", "agent_verified", "replacement_verified"].includes(item.executionStatus);
    })) issues.push("inventory.agent_decision_items");
    const q3Decision = decisionItems.find(function (item) { return item.number === 3; });
    if (!q3Decision || q3Decision.disposition !== "replace" || q3Decision.executionStatus !== "replacement_verified") {
      issues.push("inventory.q3_replacement_status");
    }
    blockerItems.forEach(function (number) {
      const item = list[number - 1];
      if (!item || item.resolutionStatus !== "pending") issues.push(`item.${number}.release_blocker_pending`);
    });
    agentVerifiedItems.forEach(function (number) {
      const item = list[number - 1];
      if (!item || item.classificationStatus !== "verified" || item.resolutionStatus !== "pending") issues.push(`item.${number}.classification_agent_verified`);
    });
    rejectForbidden(inventory, "inventory", issues);
    return Object.freeze(issues.slice().sort());
  }

  function evaluateReviewGate(inventory) {
    const issues = Array.from(validateReviewInventory(inventory));
    const list = inventory && Array.isArray(inventory.items) ? inventory.items : [];
    if (list.some(function (item) { return item.answerStatus !== "verified"; })) issues.push("review.answer_not_verified");
    if (list.some(function (item) { return item.classificationStatus !== "verified"; })) issues.push("review.classification_not_verified");
    if (list.some(function (item) { return item.resolutionStatus !== "agent_verified" && item.resolutionStatus !== "replacement_verified" && item.resolutionStatus !== "scoring_excluded"; })) {
      issues.push("review.agent_resolution_pending");
    }
    if (inventory && inventory.releaseBlockerSummary && inventory.releaseBlockerSummary.pending) issues.push("review.release_blocker_pending");
    if (inventory && inventory.classificationReviewSummary && inventory.classificationReviewSummary.ownerReview) issues.push("review.classification_owner_review_pending");
    return Object.freeze({
      canAssemble: false,
      canRelease: false,
      issues: Object.freeze(Array.from(new Set(issues)).sort())
    });
  }

  const inventory = Object.freeze({
    id: core.createNeutralId("policy", MODE, "review:sh-r01:inventory"),
    reviewOnly: true,
    mode: MODE,
    writer: WRITER,
    roundCode: "SH-R01",
    releaseBlockerSummary: RELEASE_BLOCKER_SUMMARY,
    agentDecisionSummary: AGENT_DECISION_SUMMARY,
    classificationReviewSummary: CLASSIFICATION_REVIEW_SUMMARY,
    sourceExamId: SOURCE_EXAM_ID,
    sourceAssetId: SOURCE_ASSET_ID,
    items
  });

  return Object.freeze({
    ANSWER_STATUS,
    CLASSIFICATION_STATUS,
    RESOLUTION_STATUS,
    RELEASE_BLOCKER_SUMMARY,
    AGENT_DECISION_SUMMARY,
    CLASSIFICATION_REVIEW_SUMMARY,
    CLASSIFICATION_AGENT_VERIFIED_ITEMS,
    RESPONSE_CANDIDATES,
    FORBIDDEN_KEYS,
    inventory,
    validateReviewInventory,
    evaluateReviewGate
  });
});
