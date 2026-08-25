/*
 * 공개 포털용 프리미어 회차 목록입니다.
 *
 * 이 파일은 유료 원본을 전달하지 않습니다. 문항, 정답, 원본 위치, 자산 주소는
 * 비공개 보관소에서만 관리하고, 이 목록에는 학생 화면에 표시할 회차 상태만 둡니다.
 */
(function (root) {
  "use strict";

  const round = (key, label, verifiedCount, lockedCount, visualGate, options = {}) => Object.freeze({
    key,
    label,
    releaseStatus: options.releaseStatus || "review_pending",
    verifiedCount,
    lockedCount,
    visualGate,
    videoUrl: options.videoUrl || null,
    answersAvailable: options.answersAvailable === true,
    href: null
  });

  root.GFIELD_HF_PREMIER_RELEASE_CATALOG = Object.freeze({
    version: "2026-08-25",
    series: Object.freeze([
      Object.freeze({
        key: "utilization",
        label: "활용 모의고사",
        rounds: Object.freeze([
          round("premier-utilization-01", "활용 모의고사 1회", 20, 0, false, {
            releaseStatus: "published",
            videoUrl: "https://www.youtube.com/watch?v=iIlWZpVmdgY",
            answersAvailable: false
          }),
          round("premier-utilization-02", "활용 모의고사 2회", 14, 6, true),
          round("premier-utilization-03", "활용 모의고사 3회", 16, 4, true),
          round("premier-utilization-04", "활용 모의고사 4회", 13, 7, true),
          round("premier-utilization-05", "활용 모의고사 5회", 17, 3, true),
          round("premier-utilization-06", "활용 모의고사 6회", 13, 7, true),
          round("premier-utilization-07", "활용 모의고사 7회", 12, 8, true),
          round("premier-utilization-08", "활용 모의고사 8회", 16, 4, true)
        ])
      }),
      Object.freeze({
        key: "final",
        label: "파이널 모의고사",
        rounds: Object.freeze([
          round("premier-final-01", "파이널 모의고사 1회", 8, 12, true),
          round("premier-final-02", "파이널 모의고사 2회", 14, 6, true),
          round("premier-final-03", "파이널 모의고사 3회", 16, 4, true)
        ])
      }),
      Object.freeze({
        key: "last",
        label: "최종 모의고사",
        rounds: Object.freeze([
          round("premier-last-01", "최종 모의고사 1회", 16, 4, true),
          round("premier-last-02", "최종 모의고사 2회", 17, 3, true),
          round("premier-last-03", "최종 모의고사 3회", 14, 6, true),
          round("premier-last-04", "최종 모의고사 4회", 15, 5, true)
        ])
      })
    ])
  });
})(window);
