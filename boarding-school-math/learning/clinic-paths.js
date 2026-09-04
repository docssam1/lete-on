(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDClinicPaths = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const ANIMATED_BY_CLUSTER = Object.freeze({
    "6.RP.A": Object.freeze({ lessonId: "common-total-ratio", labelKo: "비율 막대 시각 강의", locale: "ko" }),
    "6.NS.A": Object.freeze({ lessonId: "fraction-division-eighths", labelKo: "분수 나눗셈 시각 강의", locale: "ko" }),
    "6.NS.B": Object.freeze({ lessonId: "gcf-factor-chain", labelKo: "최대공약수 시각 강의", locale: "ko" }),
    "6.NS.C": Object.freeze({ lessonId: "signed-rational-number-line", labelKo: "음의 유리수 수직선 강의", locale: "ko" }),
    "6.EE.A": Object.freeze({ lessonId: "expression-structure-order", labelKo: "식의 구조와 연산 순서 강의", locale: "ko" }),
    "6.EE.B": Object.freeze({ lessonId: "equation-balance-groups", labelKo: "등식의 균형과 같은 묶음 강의", locale: "ko" }),
    "6.G.A": Object.freeze({ lessonId: "coordinate-l-shape-area", labelKo: "좌표 도형 분해 넓이 강의", locale: "ko" })
  });
  const WORKBOOK_BY_CLUSTER = Object.freeze({
    "6.RP.A": Object.freeze({ packId: "gfield-grade6-rp-a-clinic-v1", labelKo: "비·비율 12문항 클리닉" }),
    "6.NS.A": Object.freeze({ packId: "gfield-grade6-ns-a-clinic-v1", labelKo: "분수 나눗셈 12문항 클리닉" }),
    "6.NS.B": Object.freeze({ packId: "gfield-grade6-ns-b-clinic-v1", labelKo: "수 체계 계산 12문항 클리닉" }),
    "6.NS.C": Object.freeze({ packId: "gfield-grade6-ns-c-clinic-v1", labelKo: "음수·좌표평면 12문항 클리닉" }),
    "6.EE.A": Object.freeze({ packId: "gfield-grade6-ee-a-clinic-v1", labelKo: "식의 구조와 동치식 12문항 클리닉" }),
    "6.EE.B": Object.freeze({ packId: "gfield-grade6-ee-b-clinic-v1", labelKo: "방정식과 부등식 12문항 클리닉" }),
    "6.EE.C": Object.freeze({ packId: "gfield-grade6-ee-c-clinic-v1", labelKo: "변수 관계 12문항 클리닉" }),
    "6.G.A": Object.freeze({ packId: "gfield-grade6-g-a-clinic-v1", labelKo: "기하 측정 12문항 클리닉" }),
    "6.SP.A": Object.freeze({ packId: "gfield-grade6-sp-a-unit-workbook-v1", labelKo: "통계적 질문과 자료의 분포 단원 워크북", delivery: "unit-workbook" })
  });
  const COMPLETION_PREFIX = "gfield-clinic-workbook:";

  function safeCluster(clusterId) {
    const value = String(clusterId || "");
    if (!/^6\.(?:RP|NS|EE|G|SP)\.[A-C]$/.test(value)) throw new Error("unsupported Grade 6 clinic cluster");
    return value;
  }

  function conceptUrl(clusterId, fromDiagnostic) {
    const cluster = safeCluster(clusterId);
    return "./concept-learning.html?cluster=" + encodeURIComponent(cluster) + (fromDiagnostic ? "&from=diagnostic" : "");
  }

  function completionKey(clusterId) {
    return COMPLETION_PREFIX + safeCluster(clusterId) + ":v1";
  }

  function workbookUrl(clusterId, mode, audience, locale) {
    const cluster = safeCluster(clusterId);
    const query = new URLSearchParams({ cluster: cluster, mode: mode || "workbook", audience: audience || "student", locale: locale || "ko" });
    const workbook = WORKBOOK_BY_CLUSTER[cluster];
    return (workbook && workbook.delivery === "unit-workbook" ? "./unit-workbook.html?" : "./clinic-practice.html?") + query.toString();
  }

  function routeFor(clusterId, options) {
    const settings = options || {};
    const cluster = safeCluster(clusterId);
    const animated = ANIMATED_BY_CLUSTER[cluster] || null;
    const workbook = WORKBOOK_BY_CLUSTER[cluster] || null;
    const workbookCompleted = settings.workbookCompleted === true;
    return Object.freeze({
      clusterId: cluster,
      source: settings.fromDiagnostic ? "diagnostic-reviewed-route" : "concept-library",
      concept: Object.freeze({ state: "available", url: conceptUrl(cluster, Boolean(settings.fromDiagnostic)) }),
      animated: animated ? Object.freeze({
        state: "available",
        lessonId: animated.lessonId,
        labelKo: animated.labelKo,
        url: "./animated-math.html?lesson=" + encodeURIComponent(animated.lessonId) + "&cluster=" + encodeURIComponent(cluster) + "&locale=" + animated.locale
      }) : Object.freeze({ state: "review-pending", lessonId: "", labelKo: "시각 강의 검수 대기", url: "" }),
      workbook: workbook ? Object.freeze({
        state: "available",
        packId: workbook.packId,
        delivery: workbook.delivery || "clinic-practice",
        labelKo: workbook.labelKo,
        url: workbookUrl(cluster, "workbook", "student", "ko"),
        teacherUrl: workbookUrl(cluster, "workbook", "teacher", "ko")
      }) : Object.freeze({ state: "review-pending", packId: "", labelKo: "맞춤 워크북 검수 대기", url: "", teacherUrl: "" }),
      recheck: workbook && workbookCompleted ? Object.freeze({
        state: "available",
        labelKo: workbook.delivery === "unit-workbook" ? "5영역 재확인" : "4영역 재확인",
        url: workbookUrl(cluster, "recheck", "student", "ko")
      }) : Object.freeze({ state: workbook ? "locked-after-learning" : "review-pending", labelKo: workbook ? "재확인 · 워크북 완료 후" : "재확인 검수 대기", url: "" })
    });
  }

  function validateAnimatedMapping(animatedLessons) {
    if (!Array.isArray(animatedLessons)) throw new Error("animated lesson catalog is required");
    Object.keys(ANIMATED_BY_CLUSTER).forEach(function (clusterId) {
      const mapping = ANIMATED_BY_CLUSTER[clusterId];
      const lesson = animatedLessons.find(function (candidate) { return candidate.id === mapping.lessonId; });
      if (!lesson) throw new Error("mapped animated lesson is missing: " + mapping.lessonId);
      if (lesson.conceptClusterId !== clusterId) {
        throw new Error("animated lesson cluster mismatch: " + clusterId + " -> " + lesson.conceptClusterId);
      }
    });
    return true;
  }

  return Object.freeze({ schemaVersion: 8, animatedByCluster: ANIMATED_BY_CLUSTER, workbookByCluster: WORKBOOK_BY_CLUSTER, conceptUrl: conceptUrl, workbookUrl: workbookUrl, completionKey: completionKey, routeFor: routeFor, validateAnimatedMapping: validateAnimatedMapping });
});
