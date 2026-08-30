(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDClinicPaths = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const ANIMATED_BY_CLUSTER = Object.freeze({
    "6.RP.A": Object.freeze({ lessonId: "common-total-ratio", labelKo: "비율 막대 시각 강의", locale: "ko" })
  });

  function safeCluster(clusterId) {
    const value = String(clusterId || "");
    if (!/^6\.(?:RP|NS|EE|G|SP)\.[A-C]$/.test(value)) throw new Error("unsupported Grade 6 clinic cluster");
    return value;
  }

  function conceptUrl(clusterId, fromDiagnostic) {
    const cluster = safeCluster(clusterId);
    return "./concept-learning.html?cluster=" + encodeURIComponent(cluster) + (fromDiagnostic ? "&from=diagnostic" : "");
  }

  function routeFor(clusterId, options) {
    const settings = options || {};
    const cluster = safeCluster(clusterId);
    const animated = ANIMATED_BY_CLUSTER[cluster] || null;
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
      workbook: Object.freeze({ state: "locked-teacher-assignment", labelKo: "맞춤 워크북 · 교사 배정 후" }),
      recheck: Object.freeze({ state: "locked-after-learning", labelKo: "재확인 · 학습 완료 후" })
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

  return Object.freeze({ schemaVersion: 1, animatedByCluster: ANIMATED_BY_CLUSTER, conceptUrl: conceptUrl, routeFor: routeFor, validateAnimatedMapping: validateAnimatedMapping });
});
