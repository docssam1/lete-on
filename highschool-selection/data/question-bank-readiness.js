(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_QUESTION_BANK_READINESS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // Counts are deliberately split by grain. A located crop candidate is not a
  // reusable bank item until curriculum, answer and release checks are done.
  const gradeInventory = Object.freeze([
    Object.freeze({
      gradeCode: "M1",
      label: "중1",
      indexedCandidates: 1656,
      curriculumClassified: 0,
      answerVerified: 160,
      uniqueReusablePrivateDrafts: 160,
      ownerApproved: 0,
      candidateBreakdown: Object.freeze({ firstSemester: 1010, secondSemester: 646 }),
      note: "황소 중1 교재 위치 후보 1,656개와 원수학 중2-1 기본반 4회에 배치·독립 검산된 고유 문항 160개를 서로 다른 단계로 센다."
    }),
    Object.freeze({
      gradeCode: "M2",
      label: "중2",
      indexedCandidates: 2356,
      curriculumClassified: 0,
      answerVerified: 0,
      uniqueReusablePrivateDrafts: 0,
      ownerApproved: 0,
      candidateBreakdown: Object.freeze({ firstSemester: 1162, secondSemester: 1194 }),
      note: "황소 중2 교재에서 위치 후보는 확보했지만 문항별 현행 분류와 답안 검산이 끝나지 않아 재사용 가능 수에는 넣지 않는다."
    }),
    Object.freeze({
      gradeCode: "M3",
      label: "중3",
      indexedCandidates: 0,
      curriculumClassified: 0,
      answerVerified: 0,
      uniqueReusablePrivateDrafts: 0,
      ownerApproved: 0,
      candidateBreakdown: Object.freeze({ firstSemester: 0, secondSemester: 0 }),
      note: "중3 누적 시험 원본은 있으나 학년별 고유 문항 DB로 분리·등록된 수는 아직 0이다."
    }),
    Object.freeze({
      gradeCode: "CM",
      label: "공통수학",
      indexedCandidates: 0,
      curriculumClassified: 0,
      answerVerified: 0,
      uniqueReusablePrivateDrafts: 0,
      ownerApproved: 0,
      candidateBreakdown: Object.freeze({ commonMath1Types: 38, commonMath2Types: 31 }),
      note: "69개 세부유형과 349개 근거 문항 표시는 유형 조사량이며, 중복 제거된 문항 DB 수가 아니므로 문항 수에 합산하지 않는다."
    })
  ]);

  const cumulativeSourceBackedExams = Object.freeze([
    Object.freeze({ examId: "sh-selection-r01", itemCount: 40, scope: "중등 누적", allocation: "학년별 분리 전" }),
    Object.freeze({ examId: "dp-middle2-2-transfer", itemCount: 30, scope: "중1-1~중2-2 누적", allocation: "학년별 분리 전" }),
    Object.freeze({ examId: "dp-common1-entry-202405", itemCount: 30, scope: "중2-1~중3-2 누적", allocation: "학년별 분리 전" })
  ]);

  const countingRules = Object.freeze({
    indexedCandidates: "페이지와 문항 위치를 찾은 수. 정답·교육과정·공개 가능 여부는 보장하지 않는다.",
    uniqueReusablePrivateDrafts: "시험지 간 중복을 제거하고 원답 대조와 독립 검산을 통과한 비공개 문항 수.",
    ownerApproved: "사용자가 최종 승인해 판매·서비스 기본 세트에 확정한 수.",
    cumulativeSourceBackedExams: "시험 전체는 검수됐지만 문항별 학년 DB로 아직 분해하지 않은 별도 재고."
  });

  function getGradeInventory(gradeCode) {
    return gradeInventory.find(item => item.gradeCode === gradeCode) || null;
  }

  return Object.freeze({
    schemaVersion: 1,
    updatedAt: "2026-08-25",
    countingRules,
    gradeInventory,
    cumulativeSourceBackedExams,
    getGradeInventory
  });
});
