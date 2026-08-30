(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDClinicPaths = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const ANIMATED_BY_CLUSTER = Object.freeze({
    "6.RP.A": Object.freeze({ lessonId: "common-total-ratio", labelKo: "비율 막대 시각 강의", locale: "ko" }),
    "6.NS.A": Object.freeze({ lessonId: "fraction-division-eighths", labelKo: "분수 나눗셈 시각 강의", locale: "ko" })
  });
  const WORKBOOK_BY_CLUSTER = Object.freeze({
    "6.RP.A": Object.freeze({ packId: "gfield-grade6-rp-a-clinic-v1", labelKo: "비·비율 클리닉 워크북" }),
    "6.NS.A": Object.freeze({ packId: "gfield-grade6-ns-a-clinic-v1", labelKo: "분수 나눗셈 클리닉 워크북" })
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
    return "./clinic-practice.html?" + query.toString();
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
        labelKo: workbook.labelKo,
        url: workbookUrl(cluster, "workbook", "student", "ko"),
        teacherUrl: workbookUrl(cluster, "workbook", "teacher", "ko")
      }) : Object.freeze({ state: "review-pending", packId: "", labelKo: "맞춤 워크북 검수 대기", url: "", teacherUrl: "" }),
      recheck: workbook && workbookCompleted ? Object.freeze({
        state: "available",
        labelKo: "4영역 재확인",
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

  return Object.freeze({ schemaVersion: 3, animatedByCluster: ANIMATED_BY_CLUSTER, workbookByCluster: WORKBOOK_BY_CLUSTER, conceptUrl: conceptUrl, workbookUrl: workbookUrl, completionKey: completionKey, routeFor: routeFor, validateAnimatedMapping: validateAnimatedMapping });
});
