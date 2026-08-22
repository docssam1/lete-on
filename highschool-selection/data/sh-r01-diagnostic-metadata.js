(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_SH_R01_DIAGNOSTIC_METADATA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "SH";
  const ROUND_CODE = "SH-R01";
  const DIFFICULTY_BANDS = Object.freeze(["lowered", "standard", "raised"]);
  const DIFFICULTY_LABELS = Object.freeze({
    lowered: "기본",
    standard: "심화",
    raised: "최상"
  });
  const INDICATOR_WEIGHTS = Object.freeze({
    DIRECT_PROCEDURE: 0,
    LINKED_PROCEDURE: 1,
    MODEL_TRANSLATION: 1,
    REPRESENTATION_SHIFT: 1,
    MULTI_CONCEPT: 1,
    CASE_SPLIT: 1,
    NONROUTINE_INSIGHT: 2,
    SPATIAL_TRANSFORMATION: 2,
    EXTENDED_DERIVATION: 2,
    EXHAUSTIVE_ENUMERATION: 2
  });
  const DIFFICULTY_RUBRIC = Object.freeze({
    id: core.createNeutralId("policy", MODE, "diagnostic:sh-r01:difficulty-rubric:v1"),
    version: "1.0.0",
    scope: "round-relative-internal",
    officialDifficulty: false,
    bands: Object.freeze({
      lowered: Object.freeze({ label: DIFFICULTY_LABELS.lowered, minimumScore: 0, maximumScore: 1 }),
      standard: Object.freeze({ label: DIFFICULTY_LABELS.standard, minimumScore: 2, maximumScore: 3 }),
      raised: Object.freeze({ label: DIFFICULTY_LABELS.raised, minimumScore: 4, maximumScore: null })
    }),
    indicatorWeights: INDICATOR_WEIGHTS,
    note: "이 회차 안에서 풀이 구조를 비교하는 내부 진단용 난이도이며 외부 기관의 공식 난이도가 아닙니다."
  });
  const POINT_POLICY = Object.freeze({
    id: core.createNeutralId("policy", MODE, "diagnostic:sh-r01:equal-weight:v1"),
    version: "1.0.0",
    pointsPerItem: 1,
    totalPoints: 40,
    officialWeight: false,
    note: "문항별 1점의 내부 동일가중 진단점수이며 외부 기관의 공식 배점이 아닙니다."
  });

  const DOMAIN_LABELS = Object.freeze({
    "D-NUM": "수와 연산",
    "D-ALG": "문자와 식",
    "D-FUNC": "함수",
    "D-GEOM": "기하",
    "D-PROB": "확률과 통계"
  });

  /*
   * Row shape:
   * number, domainCode, curriculumCode, gradeBand, semester,
   * majorCode, majorLabel, detailCode, detailLabel,
   * difficultyBand, difficultyIndicators.
   *
   * Only classification metadata is stored here. Problem text, response values,
   * worked solutions, original locations, and binary fingerprints are deliberately absent.
   */
  const ROWS = Object.freeze([
    [1, "D-ALG", "G7-S1-LINK", "중1", "1학기", "ALG-LINEAR-EQ", "문자와 식·일차방정식", "DT-001", "시계 시간 오차 모델링", "standard", ["MODEL_TRANSLATION", "LINKED_PROCEDURE", "REPRESENTATION_SHIFT"]],
    [2, "D-NUM", "G7-S1-EXT", "중1", "1학기", "NUM-PRIME-LCM-EXT", "소인수분해·최소공배수 인접 확장", "DT-002", "두 나머지 조건의 동시 만족", "raised", ["NONROUTINE_INSIGHT", "CASE_SPLIT", "LINKED_PROCEDURE"]],
    [3, "D-NUM", "G7-S1", "중1", "1학기", "NUM-RATIONAL", "정수와 유리수", "DT-003", "유리수 혼합 계산", "lowered", ["DIRECT_PROCEDURE"]],
    [4, "D-NUM", "G7-S1", "중1", "1학기", "NUM-PRIME-EQ", "소인수분해·일차방정식", "DT-004", "소인수 조건식", "lowered", ["LINKED_PROCEDURE"]],
    [5, "D-ALG", "G7-S1", "중1", "1학기", "ALG-EXPRESSION", "문자의 사용과 식", "DT-005", "두 용기 사이 2단계 농도 이동", "standard", ["MODEL_TRANSLATION", "LINKED_PROCEDURE"]],
    [6, "D-ALG", "G7-S1-LINK", "중1", "1학기", "ALG-LINEAR-ANGLE", "일차방정식의 활용·각", "DT-006", "시침·분침 상대각의 시간 역산", "standard", ["MODEL_TRANSLATION", "REPRESENTATION_SHIFT", "LINKED_PROCEDURE"]],
    [7, "D-FUNC", "G7-S1", "중1", "1학기", "FUNC-COORD-GRAPH", "좌표평면과 그래프", "DT-007", "반비례 그래프와 도형", "raised", ["MULTI_CONCEPT", "REPRESENTATION_SHIFT", "EXTENDED_DERIVATION"]],
    [8, "D-GEOM", "G7-S2", "중1", "2학기", "GEOM-BASIC", "기본도형", "DT-008", "직선과 평면의 위치 관계", "standard", ["SPATIAL_TRANSFORMATION", "CASE_SPLIT"]],
    [9, "D-GEOM", "G7-S2-LINK", "중1", "2학기", "GEOM-PARALLEL-CONG", "평행선과 합동", "DT-009", "직사각형 연속 접기의 각 추적", "standard", ["SPATIAL_TRANSFORMATION", "LINKED_PROCEDURE"]],
    [10, "D-GEOM", "G7-S2", "중1", "2학기", "GEOM-CONSTRUCTION", "작도와 합동", "DT-010", "삼각형 성립 조건", "standard", ["SPATIAL_TRANSFORMATION", "CASE_SPLIT"]],
    [11, "D-GEOM", "G7-S2", "중1", "2학기", "GEOM-PLANE-AREA", "평면도형", "DT-011", "부채꼴과 직사각형 넓이", "standard", ["REPRESENTATION_SHIFT", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [12, "D-GEOM", "G7-S2", "중1", "2학기", "GEOM-SOLID", "입체도형", "DT-012", "원기둥과 구의 부피", "standard", ["MODEL_TRANSLATION", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [13, "D-NUM", "G8-S1", "중2", "1학기", "NUM-REPEAT-DEC", "유리수와 순환소수", "DT-013", "순환소수 반올림 조건", "standard", ["MODEL_TRANSLATION", "CASE_SPLIT", "LINKED_PROCEDURE"]],
    [14, "D-ALG", "G8-S1-LINK", "중2", "1학기", "ALG-SYSTEM-CASE", "연립일차방정식 인접 확장", "DT-014", "최댓값·최솟값 경우 분기와 순서쌍", "raised", ["CASE_SPLIT", "NONROUTINE_INSIGHT", "MULTI_CONCEPT"]],
    [15, "D-ALG", "G8-S1", "중2", "1학기", "ALG-SYSTEM", "연립일차방정식", "DT-015", "매개변수 해 조건", "lowered", ["LINKED_PROCEDURE"]],
    [16, "D-ALG", "G8-S1", "중2", "1학기", "ALG-SYSTEM-APP", "연립일차방정식의 활용", "DT-016", "이자 관계식 모델링", "standard", ["MODEL_TRANSLATION", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [17, "D-ALG", "G8-S1", "중2", "1학기", "ALG-INEQUALITY", "일차부등식", "DT-017", "혼합 범위의 공통 조건", "standard", ["MODEL_TRANSLATION", "CASE_SPLIT", "LINKED_PROCEDURE"]],
    [18, "D-NUM", "G7-S1-EXT", "중1", "1학기", "NUM-PRIME-EXT", "소인수분해 인접 확장", "DT-018", "큰 거듭제곱 합의 최소 소인수", "raised", ["NONROUTINE_INSIGHT", "CASE_SPLIT", "MULTI_CONCEPT"]],
    [19, "D-FUNC", "G7S1-G8S1-LINK", "중1·중2", "1학기 연계", "FUNC-COORD-LINEAR", "좌표평면·일차함수", "DT-019", "넓이 이등분 직선", "standard", ["REPRESENTATION_SHIFT", "MODEL_TRANSLATION", "MULTI_CONCEPT"]],
    [20, "D-FUNC", "G8-S1", "중2", "1학기", "FUNC-LINEAR", "일차함수", "DT-020", "직선의 기울기 관계", "lowered", ["REPRESENTATION_SHIFT"]],
    [21, "D-FUNC", "G7S1-G8S2-EXT", "중1·중2", "1·2학기 연계", "FUNC-COORD-PYTHAG-EXT", "좌표·피타고라스 정리 인접 확장", "DT-021", "두 좌표축을 차례로 거치는 반사 최단경로", "raised", ["SPATIAL_TRANSFORMATION", "NONROUTINE_INSIGHT", "MULTI_CONCEPT"]],
    [22, "D-PROB", "G8-S2", "중2", "2학기", "PROB-COUNT", "경우의 수와 확률", "DT-022", "남은 승패열의 경우 계수", "standard", ["CASE_SPLIT", "MODEL_TRANSLATION", "LINKED_PROCEDURE"]],
    [23, "D-PROB", "G8-S2-EXT", "중2", "2학기", "PROB-COUNT-EXT", "경우의 수 인접 확장", "DT-023", "조건이 다른 위원 선출 경우의 수 순서 비교", "raised", ["EXHAUSTIVE_ENUMERATION", "CASE_SPLIT", "MULTI_CONCEPT"]],
    [24, "D-GEOM", "G8-S2-EXT", "중2", "2학기", "GEOM-TRI-AREA-EXT", "삼각형의 성질·넓이 인접 확장", "DT-024", "이등변삼각형에서 수선 길이의 합", "raised", ["NONROUTINE_INSIGHT", "SPATIAL_TRANSFORMATION"]],
    [25, "D-GEOM", "G8-S2", "중2", "2학기", "GEOM-INCENTER-PYTHAG", "내심·피타고라스 정리", "DT-025", "두 직각삼각형 내심의 위치·거리", "raised", ["SPATIAL_TRANSFORMATION", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [26, "D-GEOM", "G8-S2", "중2", "2학기", "GEOM-SIM-PARALLEL", "닮음·평행선 길이비", "DT-026", "평행선과 삼각형 넓이비", "standard", ["REPRESENTATION_SHIFT", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [27, "D-GEOM", "G8-S2-EXT", "중2", "2학기", "GEOM-PARALLELOGRAM-EXT", "사각형의 성질 인접 확장", "DT-027", "평행사변형 꼭짓점의 한 직선까지 거리 관계", "raised", ["NONROUTINE_INSIGHT", "SPATIAL_TRANSFORMATION"]],
    [28, "D-GEOM", "G7-S2-EXT", "중1", "2학기", "GEOM-SOLID-NET-EXT", "입체도형의 성질·겉넓이 인접 확장", "DT-028", "원뿔대 옆면 전개의 최단거리", "raised", ["SPATIAL_TRANSFORMATION", "NONROUTINE_INSIGHT", "EXTENDED_DERIVATION"]],
    [29, "D-GEOM", "G8-S2-EXT", "중2", "2학기", "GEOM-TRI-AREA-EXT", "삼각형 넓이비 인접 확장", "DT-029", "교차 선분과 분할 삼각형 넓이비", "standard", ["REPRESENTATION_SHIFT", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [30, "D-NUM", "G9-S1-LINK", "중3", "1학기", "NUM-RADICAL", "제곱근과 실수", "DT-030", "제곱근 반올림 구간", "lowered", ["LINKED_PROCEDURE"]],
    [31, "D-NUM", "G9-S1-EXT", "중3", "1학기", "NUM-RADICAL-CALC", "근호를 포함한 식의 계산", "DT-031", "완전제곱 변형·근호식 간단화", "raised", ["NONROUTINE_INSIGHT", "EXTENDED_DERIVATION", "MULTI_CONCEPT"]],
    [32, "D-ALG", "G9-S1", "중3", "1학기", "ALG-QUADRATIC-APP", "이차방정식의 활용", "DT-032", "두 단계 농도 치환 이차방정식", "raised", ["MODEL_TRANSLATION", "EXTENDED_DERIVATION", "MULTI_CONCEPT"]],
    [33, "D-ALG", "G9-S1", "중3", "1학기", "ALG-QUADRATIC", "이차방정식", "DT-033", "정수근 매개변수 조건", "standard", ["CASE_SPLIT", "LINKED_PROCEDURE", "MULTI_CONCEPT"]],
    [34, "D-FUNC", "G9-S1", "중3", "1학기", "FUNC-QUADRATIC", "이차함수", "DT-034", "매개변수와 고정점", "raised", ["NONROUTINE_INSIGHT", "CASE_SPLIT", "EXTENDED_DERIVATION"]],
    [35, "D-FUNC", "G9-S1", "중3", "1학기", "FUNC-QUADRATIC", "이차함수", "DT-035", "포물선 위 점과 넓이", "raised", ["REPRESENTATION_SHIFT", "CASE_SPLIT", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [36, "D-GEOM", "G7-S2-EXT", "중1", "2학기", "GEOM-SOLID-VOLUME-EXT", "입체도형의 성질·부피 인접 확장", "DT-036", "대각선 축 회전 합성 입체의 부피", "raised", ["SPATIAL_TRANSFORMATION", "NONROUTINE_INSIGHT", "EXTENDED_DERIVATION"]],
    [37, "D-GEOM", "G9-S2", "중3", "2학기", "GEOM-TRIG", "삼각비", "DT-037", "수선과 삼각비 관계", "standard", ["MULTI_CONCEPT", "REPRESENTATION_SHIFT", "LINKED_PROCEDURE"]],
    [38, "D-GEOM", "G9-S2", "중3", "2학기", "GEOM-TRIG-CIRCLE", "삼각비·원의 성질", "DT-038", "반원 접선과 길이비", "raised", ["SPATIAL_TRANSFORMATION", "MULTI_CONCEPT", "LINKED_PROCEDURE"]],
    [39, "D-ALG", "G9-S1", "중3", "1학기", "ALG-FACT-INT", "인수분해·정수", "DT-039", "곱셈꼴 변형과 정수 순서쌍", "raised", ["CASE_SPLIT", "EXHAUSTIVE_ENUMERATION", "LINKED_PROCEDURE"]],
    [40, "D-PROB", "G8S2-G9S1-LINK", "중2·중3", "2·1학기 연계", "PROB-QUADRATIC", "확률·이차방정식", "DT-040", "계수 순서쌍의 정수근 조건", "raised", ["CASE_SPLIT", "EXHAUSTIVE_ENUMERATION", "MULTI_CONCEPT"]]
  ]);

  function difficultyScore(indicators) {
    if (!Array.isArray(indicators) || !indicators.length) return null;
    let score = 0;
    const seen = new Set();
    for (const indicator of indicators) {
      if (!Object.prototype.hasOwnProperty.call(INDICATOR_WEIGHTS, indicator) || seen.has(indicator)) return null;
      seen.add(indicator);
      score += INDICATOR_WEIGHTS[indicator];
    }
    return score;
  }

  function bandForScore(score) {
    if (!Number.isSafeInteger(score) || score < 0) return null;
    if (score <= 1) return "lowered";
    if (score <= 3) return "standard";
    return "raised";
  }

  function createItem(row) {
    const number = row[0];
    const suffix = String(number).padStart(2, "0");
    const domainCode = row[1];
    const curriculumCode = row[2];
    const gradeBand = row[3];
    const semester = row[4];
    const majorCode = row[5];
    const majorUnit = row[6];
    const detailCode = row[7];
    const detailType = row[8];
    const difficulty = row[9];
    const difficultyIndicators = Object.freeze(row[10].slice());
    const score = difficultyScore(difficultyIndicators);
    const itemId = core.createNeutralId("question", MODE, `review:sh-r01:item:${suffix}`);
    const detailTypeId = core.createNeutralId("type", MODE, `review:sh-r01:type:${detailCode}`);
    const gradeSemesterUnit = [gradeBand, semester, majorUnit, detailType].join(" · ");
    return Object.freeze({
      id: itemId,
      number,
      domainId: core.createNeutralId("type", MODE, `diagnostic:domain:${domainCode}`),
      domainCode,
      domain: DOMAIN_LABELS[domainCode],
      gradeSemesterUnitId: core.createNeutralId("type", MODE, `diagnostic:unit:${curriculumCode}:${majorCode}`),
      curriculumCode,
      gradeBand,
      semester,
      majorCode,
      majorUnit,
      minorUnit: detailType,
      gradeSemesterUnit,
      detailTypeId,
      detailCode,
      detailType,
      difficulty,
      difficultyLabel: DIFFICULTY_LABELS[difficulty],
      difficultyScore: score,
      difficultyIndicators,
      points: POINT_POLICY.pointsPerItem,
      officialWeight: false,
      cutlineSectionId: null,
      reviewStatus: "verified",
      classificationStatus: "verified",
      difficultyStatus: "verified",
      classificationEvidence: Object.freeze([
        core.createNeutralId("policy", MODE, `diagnostic:sh-r01:item:${suffix}:curriculum-evidence`),
        core.createNeutralId("policy", MODE, `diagnostic:sh-r01:item:${suffix}:difficulty-evidence`)
      ])
    });
  }

  const items = Object.freeze(ROWS.map(createItem));

  const FORBIDDEN_DATA_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl",
    "sourcePage", "sourceLocator", "fingerprint", "hash", "url", "uri"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;

  function inspectPublicData(value, location, issues) {
    if (typeof value === "string") {
      if (PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
      return;
    }
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_DATA_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      inspectPublicData(value[key], `${location}.${key}`, issues);
    });
  }

  function validate(metadata) {
    const issues = [];
    if (!metadata || metadata.mode !== MODE) issues.push("metadata.mode");
    if (!metadata || metadata.roundCode !== ROUND_CODE) issues.push("metadata.round_code");
    if (!metadata || metadata.pointPolicy !== POINT_POLICY) issues.push("metadata.point_policy");
    if (!metadata || metadata.difficultyRubric !== DIFFICULTY_RUBRIC) issues.push("metadata.difficulty_rubric");
    const list = metadata && Array.isArray(metadata.items) ? metadata.items : [];
    if (list.length !== 40) issues.push("metadata.item_count");
    const ids = new Set();
    list.forEach(function (item, index) {
      const prefix = `item.${index + 1}`;
      if (!item || item.number !== index + 1) issues.push(`${prefix}.number`);
      if (!item || !core.isNeutralId(item.id, "question", MODE) || ids.has(item.id)) issues.push(`${prefix}.id`);
      if (item && item.id) ids.add(item.id);
      if (!item || !core.isNeutralId(item.domainId, "type", MODE) || DOMAIN_LABELS[item.domainCode] !== item.domain) issues.push(`${prefix}.domain`);
      if (!item || !core.isNeutralId(item.gradeSemesterUnitId, "type", MODE)) issues.push(`${prefix}.grade_semester_unit_id`);
      if (!item || item.gradeSemesterUnit !== [item.gradeBand, item.semester, item.majorUnit, item.minorUnit].join(" · ")) issues.push(`${prefix}.grade_semester_unit`);
      if (!item || !core.isNeutralId(item.detailTypeId, "type", MODE) || !item.detailType || item.minorUnit !== item.detailType) issues.push(`${prefix}.detail_type`);
      if (!item || !DIFFICULTY_BANDS.includes(item.difficulty) || item.difficultyLabel !== DIFFICULTY_LABELS[item.difficulty]) issues.push(`${prefix}.difficulty`);
      const score = item && difficultyScore(item.difficultyIndicators);
      if (!item || score == null || score !== item.difficultyScore || bandForScore(score) !== item.difficulty) issues.push(`${prefix}.difficulty_rubric`);
      if (!item || item.points !== 1 || item.officialWeight !== false || item.cutlineSectionId !== null) issues.push(`${prefix}.points_or_cutline`);
      if (!item || item.reviewStatus !== "verified" || item.classificationStatus !== "verified" || item.difficultyStatus !== "verified") issues.push(`${prefix}.verification_status`);
      if (!item || !Array.isArray(item.classificationEvidence) || item.classificationEvidence.length !== 2 || item.classificationEvidence.some(function (id) {
        return !core.isNeutralId(id, "policy", MODE);
      })) issues.push(`${prefix}.classification_evidence`);
    });
    inspectPublicData(metadata, "metadata", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function reportMetadataFor(number) {
    if (!Number.isSafeInteger(number) || number < 1 || number > items.length) throw new RangeError("question number is out of range");
    const item = items[number - 1];
    return Object.freeze({
      number: item.number,
      points: item.points,
      domain: item.domain,
      gradeBand: item.gradeBand,
      semester: item.semester,
      majorUnit: item.majorUnit,
      minorUnit: item.minorUnit,
      gradeSemesterUnit: item.gradeSemesterUnit,
      detailType: item.detailType,
      difficulty: item.difficulty,
      cutlineSectionId: item.cutlineSectionId,
      reviewStatus: item.reviewStatus,
      classificationStatus: item.classificationStatus,
      classificationEvidence: item.classificationEvidence
    });
  }

  const metadata = Object.freeze({
    id: core.createNeutralId("policy", MODE, "diagnostic:sh-r01:metadata:v1"),
    mode: MODE,
    roundCode: ROUND_CODE,
    version: "1.0.0",
    pointPolicy: POINT_POLICY,
    difficultyRubric: DIFFICULTY_RUBRIC,
    items
  });

  return Object.freeze({
    MODE,
    ROUND_CODE,
    DOMAIN_LABELS,
    DIFFICULTY_BANDS,
    DIFFICULTY_LABELS,
    INDICATOR_WEIGHTS,
    DIFFICULTY_RUBRIC,
    POINT_POLICY,
    FORBIDDEN_DATA_KEYS,
    items,
    metadata,
    difficultyScore,
    bandForScore,
    reportMetadataFor,
    validate
  });
});
