(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMOLocalPaperSession = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PACK_SCHEMA_VERSION = "gfield-private-sasmo-diagnostic-v2";
  const EVIDENCE_SCHEMA_VERSION = "gfield-competition-evidence-v2";
  const FORM_ID = "sasmo-2019-g6-baseline-a";
  const SOURCE_FINGERPRINT_SHA256 = "a2e7191c21d29fdfb5b9f8a0d08018df6d7c1b318d0e05207dcc522696074d6b";
  const ITEM_COUNT = 25;
  // The printed key can be used for the historical score, but Q19's finite
  // sequence does not establish a unique pattern rule from the prompt alone.
  const SCORE_ONLY_QUESTION_NUMBERS = Object.freeze([19]);
  const AXIS_IDS = Object.freeze([
    "number-operations", "patterns-algebra", "geometry-spatial",
    "combinatorics-logic", "data-probability", "problem-solving-strategies"
  ]);
  const RESPONSE_TYPES = Object.freeze(["multiple-choice", "numeric-exact"]);
  const ERROR_TYPE_IDS = Object.freeze([
    "prerequisite-gap", "conceptual-misunderstanding", "procedure-error", "representation-error",
    "reasoning-error", "careless-error", "time-management"
  ]);

  function fail(code) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
  function record(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
  function text(value) { return typeof value === "string" && value.trim() === value && value.length > 0; }
  function onlyKeys(value, allowed, code) {
    if (!record(value) || Object.keys(value).some(function (key) { return !allowed.includes(key); })) fail(code);
  }
  function dense(value, expected, code) {
    if (!Array.isArray(value) || value.length !== expected) fail(code);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(code);
    }
    return value;
  }
  function normalizedRational(value) {
    if (typeof value !== "string") return null;
    const match = /^([+-]?\d+)(?:\/(\d+))?$/.exec(value.trim());
    if (!match || match[2] === "0") return null;
    let numerator;
    let denominator;
    try {
      numerator = BigInt(match[1]);
      denominator = BigInt(match[2] || "1");
    } catch (error) {
      return null;
    }
    function gcd(left, right) {
      let a = left < 0n ? -left : left;
      let b = right < 0n ? -right : right;
      while (b) { const next = a % b; a = b; b = next; }
      return a || 1n;
    }
    const divisor = gcd(numerator, denominator);
    const sign = denominator < 0n ? -1n : 1n;
    return `${(numerator / divisor) * sign}/${(denominator / divisor) * sign}`;
  }

  function validatePaper(paper) {
    onlyKeys(paper, ["programId", "year", "levelId", "sourceType", "sourcePageUrl", "sourceFingerprintSha256", "rightsState"], "PAPER_SHAPE_INVALID");
    if (paper.programId !== "sasmo" || paper.year !== 2019 || paper.levelId !== "G6") fail("PAPER_NOT_SUPPORTED");
    if (paper.sourceType !== "third-party-public-reference" || paper.rightsState !== "private-reference-only") fail("PAPER_RIGHTS_INVALID");
    if (!text(paper.sourcePageUrl) || !/^https:\/\//.test(paper.sourcePageUrl)) fail("PAPER_SOURCE_INVALID");
    if (!/^[a-f0-9]{64}$/.test(paper.sourceFingerprintSha256)) fail("PAPER_FINGERPRINT_INVALID");
    if (paper.sourceFingerprintSha256 !== SOURCE_FINGERPRINT_SHA256) fail("PAPER_SOURCE_MISMATCH");
  }

  function validateItem(item, index) {
    const number = index + 1;
    onlyKeys(item, ["itemId", "sourceLocator", "axisId", "skillId", "responseType", "primaryErrorType", "answerProof", "privateScoring"], "ITEM_SHAPE_INVALID");
    if (item.itemId !== `sasmo-2019-g6-q${String(number).padStart(2, "0")}`) fail("ITEM_ID_INVALID");
    if (!text(item.sourceLocator) || !AXIS_IDS.includes(item.axisId) || !text(item.skillId) || !ERROR_TYPE_IDS.includes(item.primaryErrorType)) fail("ITEM_METADATA_INVALID");
    if (!RESPONSE_TYPES.includes(item.responseType)) fail("ITEM_RESPONSE_INVALID");
    if ((number <= 15 && item.responseType !== "multiple-choice") || (number > 15 && item.responseType !== "numeric-exact")) fail("ITEM_SECTION_RESPONSE_INVALID");
    onlyKeys(item.answerProof, ["answerProof", "publishedSolutionLocator", "independentSolveMethod", "independentSolveConfirmed"], "ANSWER_PROOF_SHAPE_INVALID");
    if (item.answerProof.answerProof !== "published-solution-plus-independent" || !text(item.answerProof.publishedSolutionLocator) || !text(item.answerProof.independentSolveMethod) || item.answerProof.independentSolveConfirmed !== true) fail("ANSWER_PROOF_UNVERIFIED");
    onlyKeys(item.privateScoring, ["answerKind", "answerValue"], "PRIVATE_SCORING_SHAPE_INVALID");
    if (!text(item.privateScoring.answerValue)) fail("PRIVATE_SCORING_INVALID");
    if (item.responseType === "multiple-choice" && (item.privateScoring.answerKind !== "option-id" || !/^[A-E]$/.test(item.privateScoring.answerValue))) fail("PRIVATE_SCORING_INVALID");
    if (item.responseType === "numeric-exact" && (item.privateScoring.answerKind !== "numeric-exact" || !normalizedRational(item.privateScoring.answerValue))) fail("PRIVATE_SCORING_INVALID");
  }

  function validatePack(pack) {
    onlyKeys(pack, ["schemaVersion", "paper", "items"], "PACK_SHAPE_INVALID");
    if (pack.schemaVersion !== PACK_SCHEMA_VERSION) fail("PACK_SCHEMA_INVALID");
    validatePaper(pack.paper);
    dense(pack.items, ITEM_COUNT, "PAPER_ITEM_COUNT_INVALID").forEach(validateItem);
    if (new Set(pack.items.map(function (item) { return item.itemId; })).size !== ITEM_COUNT) fail("ITEM_IDS_DUPLICATE");
    return Object.freeze({ valid: true, formId: FORM_ID, year: 2019, levelId: "G6", itemCount: ITEM_COUNT, sourceFingerprintSha256: pack.paper.sourceFingerprintSha256 });
  }

  function normalizeResponses(responses) {
    return Object.freeze(dense(responses, ITEM_COUNT, "RESPONSES_INVALID").map(function (value, index) {
      if (typeof value !== "string") fail("RESPONSE_VALUE_INVALID");
      const normalized = value.trim();
      if (index < 15 && normalized && !/^[A-Ea-e]$/.test(normalized)) fail("RESPONSE_VALUE_INVALID");
      if (index >= 15 && normalized && !normalizedRational(normalized)) fail("RESPONSE_VALUE_INVALID");
      return index < 15 ? normalized.toUpperCase() : normalized;
    }));
  }

  function outcomeFor(item, response) {
    if (!response) return "blank";
    if (item.privateScoring.answerKind === "option-id") return response === item.privateScoring.answerValue ? "correct" : "incorrect";
    return normalizedRational(response) === normalizedRational(item.privateScoring.answerValue) ? "correct" : "incorrect";
  }

  function answerSafeEvidence(analysis) {
    const evidence = {
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      programId: "sasmo",
      formId: analysis.form.formId,
      formVersion: analysis.form.formVersion,
      year: analysis.form.year,
      levelId: analysis.form.levelId,
      comparisonKey: analysis.form.comparisonKey,
      scoringFingerprintSha256: analysis.form.scoringFingerprintSha256,
      sourceFingerprintSha256: analysis.form.sourceFingerprintSha256,
      sourceState: analysis.form.sourceState,
      verifiedRealPaper: true,
      officialAwardPrediction: false,
      score: {
        rawScore: analysis.score.rawScore,
        maxScore: analysis.score.maxScore,
        percentOfMax: analysis.score.percentOfMax,
        correct: analysis.score.correct,
        incorrect: analysis.score.incorrect,
        blank: analysis.score.blank
      },
      axes: analysis.axes.map(function (axis) {
        return {
          axisId: axis.axisId,
          itemCount: axis.itemCount,
          correct: axis.correct,
          incorrect: axis.incorrect,
          blank: axis.blank,
          percentage: axis.percentage,
          evidenceState: axis.evidenceState
        };
      }),
      diagnosticAxes: analysis.diagnostic.axes.map(function (axis) {
        return {
          axisId: axis.axisId,
          itemCount: axis.itemCount,
          correct: axis.correct,
          incorrect: axis.incorrect,
          blank: axis.blank,
          percentage: axis.percentage,
          evidenceState: axis.evidenceState
        };
      }),
      scoreOnlyQuestionNumbers: analysis.diagnostic.scoreOnlyQuestionNumbers.slice(),
      // The 2019 paper's primary-axis mapping is still under curriculum review.
      // Preserve per-axis observations, but never turn them into prescriptions.
      strengths: [],
      weaknesses: [],
      priorityAxis: null,
      readinessBand: analysis.readiness.band.id,
      prediction: {
        state: analysis.prediction.state,
        officialAwardPrediction: false,
        expectedNextScoreRange: Array.isArray(analysis.prediction.expectedNextScoreRange) ? analysis.prediction.expectedNextScoreRange.slice() : null,
        confidence: analysis.prediction.confidence || null
      },
      recordedAt: new Date().toISOString()
    };
    const serialized = JSON.stringify(evidence);
    if (/answerValue|sourceLocator|publishedSolutionLocator|privateScoring|sourcePageUrl/.test(serialized)) fail("ANSWER_SAFE_EXPORT_FAILED");
    return Object.freeze(evidence);
  }

  function analyze(pack, responses, dependencies, options) {
    validatePack(pack);
    const normalized = normalizeResponses(responses);
    const catalog = dependencies && dependencies.catalog;
    const readiness = dependencies && dependencies.readiness;
    if (!catalog || !readiness || typeof catalog.getForm !== "function" || typeof readiness.analyzeAttempt !== "function") fail("DEPENDENCIES_MISSING");
    const form = catalog.getForm(FORM_ID);
    if (!form) fail("FORM_CATALOG_NOT_READY");
    if (form.sourceFingerprintSha256 !== pack.paper.sourceFingerprintSha256) fail("FORM_SOURCE_MISMATCH");
    pack.items.forEach(function (item, index) {
      if (!form.items[index] || item.axisId !== form.items[index].axisId || item.skillId !== form.items[index].skillId) fail("FORM_TAXONOMY_MISMATCH");
    });
    const attempt = {
      formId: FORM_ID,
      outcomes: pack.items.map(function (item, index) { return { questionNumber: index + 1, outcome: outcomeFor(item, normalized[index]) }; })
    };
    const settings = options || {};
    const policy = settings.policy || {
      bands: [
        { id: "foundation", minPercent: 0, label: "기초 보완" },
        { id: "core", minPercent: 45, label: "핵심 정착" },
        { id: "practice", minPercent: 65, label: "실전 진입" },
        { id: "challenge", minPercent: 82, label: "상위권 도전" }
      ]
    };
    const analysis = readiness.analyzeAttempt(form, attempt, policy, { history: settings.history || null, targetScore: settings.targetScore == null ? null : settings.targetScore, scoreOnlyQuestionNumbers: SCORE_ONLY_QUESTION_NUMBERS });
    const result = {
      schemaVersion: "gfield-sasmo-local-paper-report-v2",
      student: {
        score: analysis.score,
        readiness: analysis.readiness,
        axes: analysis.diagnostic.axes,
        scoreOnlyQuestionNumbers: analysis.diagnostic.scoreOnlyQuestionNumbers,
        taxonomyReviewState: "pending",
        strengths: [],
        weaknesses: [],
        prediction: analysis.prediction
      },
      teacher: {
        questionEvidence: form.items.map(function (item, index) {
          return { questionNumber: item.questionNumber, axisId: item.axisId, skillId: item.skillId, outcome: attempt.outcomes[index].outcome, diagnosticUse: !SCORE_ONLY_QUESTION_NUMBERS.includes(item.questionNumber), workReviewRequired: attempt.outcomes[index].outcome !== "correct" };
        }),
        followUpRule: "19번은 인쇄 정답 기준 점수에만 포함하고 패턴 진단에서 제외합니다. 다른 영역 이름도 원본 대비 분류 검수 중이므로 자동 약점 처방에 사용하지 않습니다. 오답과 미응답은 풀이 흔적과 시간을 확인한 뒤 오류 유형을 기록하세요."
      }
    };
    result.localEvidence = answerSafeEvidence(analysis);
    return Object.freeze(result);
  }

  return Object.freeze({
    PACK_SCHEMA_VERSION,
    EVIDENCE_SCHEMA_VERSION,
    FORM_ID,
    ITEM_COUNT,
    AXIS_IDS,
    validatePack,
    normalizeResponses,
    outcomeFor,
    analyze
  });
});
