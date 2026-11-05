(function (root) {
  "use strict";
  // Official intake facts are scoped by branch, course and cohort. They do not
  // change releases, student grants, answer keys or automatic pass decisions.
  root.HIGHSELECT_OFFICIAL_EXAM_SPECS = {
    checkedAt: "2026-11-06",
    courses: {
      "SH:high-selection": {
        branch: "대치", cohort: "2026년 고등과정 시작반 편입",
        scope: "중등 1~3과정", durationMinutes: null, questionCount: null,
        durationState: "unconfirmed", mockDurationMinutes: 110,
        sourceUrl: "https://blog.naver.com/sharpedu/224086447021",
        note: "대치 공식 범위 · 110분은 모의고사 운영 시간"
      },
      "DP:common1-basic": {
        branch: "대치", cohort: "2026년 12월 개강",
        scope: "중2·중3 전 과정", durationMinutes: 150, questionCount: 30,
        durationState: "official",
        sourceUrl: "https://blog.naver.com/dpmath/224407474293",
        note: "대치 · 2026년 12월 개강 기준"
      },
      "WM:middle21-basic": {
        branch: "대치", cohort: "2026년 10월 개강",
        scope: "중1 대수·기하 · 통계 제외", durationMinutes: 140,
        questionCount: 50, sectionCounts: { ALG: 25, GEO: 25 },
        sectionMinutes: { ALG: 70, GEO: 70 }, breakMinutes: 20,
        durationState: "official",
        sourceUrl: "https://blog.naver.com/wonmath563/224393421982",
        note: "대치 · 2026년 10월 개강 기준 · 휴식 20분 별도"
      },
      "WM:common1-basic": {
        branch: "대치", cohort: "2026년 12월 개강",
        scope: "중2-1·중3-1 대수 / 중2-2·중3-2 기하 · 확률 포함",
        durationMinutes: 180, questionCount: 50,
        sectionCounts: { ALG: 25, GEO: 25 }, sectionMinutes: { ALG: 90, GEO: 90 }, breakMinutes: 20,
        durationState: "official",
        sourceUrl: "https://blog.naver.com/wonmath563/224443076138",
        note: "대치 · 2026년 12월 개강 기준 · 중2-1 입반 시험과 구분"
      },
      "ED:high-advance": {
        branch: "대치", cohort: "2026년 12월 공통수학1 기본반 개강",
        scope: "중2·중3 전 과정", durationMinutes: 100, questionCount: 30,
        sectionCounts: { ALG: 20, GEO: 10 }, durationState: "official",
        sourceUrl: "https://blog.naver.com/edenmath/224434054175",
        note: "대치 · 2026년 12월 공통수학1 기본반 기준"
      },
      "DG:pre-high1": {
        branch: "대치", cohort: "2027 예비고1",
        scope: "공통수학1 + 공통수학2 도형의 방정식", durationMinutes: 90, questionCount: 30,
        durationState: "official",
        sourceUrl: "https://apply.dailystudy.com/entrance-test/info/?academy=master&grade=M3",
        durationSourceUrl: "https://www.dailystudy.com/branches/a_daechi/guide/contents/4",
        note: "대치 · 2027 예비고1 기준"
      },
      "DG:middle1": {
        branch: "대치 초등관", cohort: "보유 중1 시작반 1·2회",
        scope: "초5·초6 누적", scopeState: "source-paper",
        durationMinutes: 70, questionCount: 30, durationState: "official",
        sourceUrl: "https://www.dailystudy.com/branches/a_daechi/guide/contents/4",
        note: "초등관 보유 시험지 기준 · 2027 예비중1 A·B형과 구분"
      },
      "SM:common1-basic": {
        branch: "대치 본관", cohort: "2026년 10월 예비중1 공통수학1 기본반 개강",
        scope: "중2-2·중3-1·중3-2", durationMinutes: 180, questionCount: 30,
        sectionCounts: { ALG: 15, GEO: 15 }, durationState: "official",
        sourceUrl: "https://blog.naver.com/won1934/224405763544",
        note: "대치 본관 · 예비중1 공통수학1 기본반 기준"
      }
    },
    branchChecks: [
      { programId: "DP", branch: "분당", scope: "공통수학1 기본반: 중2-1~중3-2 · 다른 반은 진도표·종료 단원별 확인", durationMinutes: 150,
        durationScope: "중2-1부터 대수까지 · 미적분1 포함 시험은 180분",
        sourceUrl: "https://blog.naver.com/dpmath/224416048124" },
      { programId: "DG", branch: "분당", scope: null, durationMinutes: null,
        state: "no-published-range", sourceUrl: "https://apply.dailystudy.com/entrance-test/info/?academy=bundang",
        note: "예비고1(현재 중3) 공식 범위 조회에 등록값 없음 · 대치 수치를 분당에 적용하지 않음" }
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
