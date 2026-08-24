(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_WM_MIDDLE21_BASIC_ENTRY_R01_BLUEPRINT = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourcePools = Object.freeze([
    Object.freeze({ id: "HS_G7", label: "중1 심화 교재군", role: "core-depth", status: "private-candidate-locked" }),
    Object.freeze({ id: "DP_G7", label: "중1 입학·편입 원본군", role: "entrance-structure", status: "private-candidate-locked" }),
    Object.freeze({ id: "AG_G7_OOP", label: "A급 중1 심화 절판 자료군", role: "advanced-types", status: "private-candidate-locked" }),
    Object.freeze({ id: "HX_G7_OOP", label: "중1 최고난도 절판 자료군", role: "raised-types", status: "private-candidate-locked" }),
    Object.freeze({ id: "SM_G7_OOP", label: "중1 심화 절판 자료군", role: "supplemental-types", status: "private-candidate-locked" })
  ]);

  const groups = Object.freeze([
    Object.freeze({ sectionId: "ALG", numbers: [1, 2, 3], semester: "중1-1", majorUnit: "수와 연산", minorUnit: "소인수분해", typeId: "M1-NUM-PF", typeLabel: "소인수분해와 약수 구조", difficulty: ["lowered", "standard", "raised"] }),
    Object.freeze({ sectionId: "ALG", numbers: [4, 5, 6, 7], semester: "중1-1", majorUnit: "수와 연산", minorUnit: "정수와 유리수", typeId: "M1-NUM-RAT", typeLabel: "절댓값·대소관계·혼합계산", difficulty: ["lowered", "standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "ALG", numbers: [8, 9, 10], semester: "중1-1", majorUnit: "문자와 식", minorUnit: "문자의 사용과 식의 계산", typeId: "M1-ALG-EXP", typeLabel: "식의 값과 일차식의 계산", difficulty: ["lowered", "standard", "raised"] }),
    Object.freeze({ sectionId: "ALG", numbers: [11, 12, 13, 14], semester: "중1-1", majorUnit: "문자와 식", minorUnit: "일차방정식", typeId: "M1-ALG-EQ", typeLabel: "일차방정식과 해의 조건", difficulty: ["standard", "standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "ALG", numbers: [15, 16, 17], semester: "중1-1", majorUnit: "문자와 식", minorUnit: "일차방정식의 활용", typeId: "M1-ALG-EQAPP", typeLabel: "거리·비율·수량 관계의 방정식", difficulty: ["standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "ALG", numbers: [18, 19, 20], semester: "중1-1", majorUnit: "좌표평면과 그래프", minorUnit: "좌표와 정비례·반비례", typeId: "M1-FUN-GRAPH", typeLabel: "좌표·그래프·관계식 해석", difficulty: ["standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "GEO", numbers: [21, 22, 23, 24], semester: "중1-2", majorUnit: "기본 도형", minorUnit: "점·선·면과 각", typeId: "M1-GEO-BASIC", typeLabel: "위치 관계와 각의 계산", difficulty: ["lowered", "standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "GEO", numbers: [25, 26], semester: "중1-2", majorUnit: "기본 도형", minorUnit: "작도와 합동", typeId: "M1-GEO-CONG", typeLabel: "작도 조건과 삼각형의 합동", difficulty: ["standard", "raised"] }),
    Object.freeze({ sectionId: "GEO", numbers: [27, 28, 29], semester: "중1-2", majorUnit: "평면도형", minorUnit: "다각형", typeId: "M1-GEO-POLY", typeLabel: "다각형의 각과 대각선", difficulty: ["standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "GEO", numbers: [30, 31, 32], semester: "중1-2", majorUnit: "평면도형", minorUnit: "원과 부채꼴", typeId: "M1-GEO-CIRCLE", typeLabel: "부채꼴의 호·넓이와 복합 도형", difficulty: ["standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "GEO", numbers: [33, 34, 35, 36], semester: "중1-2", majorUnit: "입체도형", minorUnit: "다면체와 회전체", typeId: "M1-GEO-SOLID", typeLabel: "다면체·회전체의 구성과 단면", difficulty: ["standard", "standard", "standard", "raised"] }),
    Object.freeze({ sectionId: "GEO", numbers: [37, 38, 39, 40], semester: "중1-2", majorUnit: "입체도형", minorUnit: "겉넓이와 부피", typeId: "M1-GEO-MEASURE", typeLabel: "겉넓이·부피와 복합 조건", difficulty: ["standard", "standard", "standard", "raised"] })
  ]);

  const items = Object.freeze(groups.flatMap(function (group) {
    return group.numbers.map(function (number, index) {
      return Object.freeze({
        id: "WM-M21-R01-Q" + String(number).padStart(2, "0"),
        number,
        sectionId: group.sectionId,
        semester: group.semester,
        majorUnit: group.majorUnit,
        minorUnit: group.minorUnit,
        typeId: group.typeId,
        typeLabel: group.typeLabel,
        difficultyBand: group.difficulty[index],
        responseMode: "confirmation-required",
        sourcePoolStatus: "candidate-not-selected",
        answerStatus: "not-authored",
        reviewStatus: "locked"
      });
    });
  }));

  const blueprint = Object.freeze({
    examId: "wm-middle21-basic-entry-r01",
    curriculumVersion: "2022-revised",
    questionCount: 40,
    sectionPlan: Object.freeze([
      Object.freeze({ id: "ALG", label: "중1 대수", questionCount: 20, minutes: 50, scope: "중1-1 전 과정" }),
      Object.freeze({ id: "GEO", label: "중1 기하", questionCount: 20, minutes: 50, scope: "중1-2 도형 영역" })
    ]),
    excludedUnits: Object.freeze(["중1 통계"]),
    scheduledWindowMinutes: 120,
    currentCutline: null,
    cutlineStatus: "confirmation-required",
    scorecardStatus: "confirmation-required",
    releaseStatus: "blocked",
    evidenceNote: "최초 25+25 공지는 시행 전 20+20으로 정정되었습니다. 실제 성적표·시험지 확보 전에는 문항과 합격선을 확정하지 않습니다."
  });

  const auditRules = Object.freeze([
    "원문은 비공개 보관하고 공개 데이터에는 지문·정답·로컬 경로를 기록하지 않음",
    "중1 통계와 중2 이상 개념을 제외하고 2022 개정 용어로 현행화",
    "A급·절판 자료는 세부유형 후보 검색에만 사용하고 문항별 원본 대조 후 별도 승인",
    "쌍둥이·유사 문항은 숫자만 바꾸지 않고 조건 수·추론 단계·보기 구조로 난도를 조절",
    "독립 계산 또는 전수 열거로 정답 유일성을 검산한 뒤에만 answerStatus를 전환"
  ]);

  return Object.freeze({ updatedAt: "2026-08-24", blueprint, sourcePools, groups, items, auditRules });
});
