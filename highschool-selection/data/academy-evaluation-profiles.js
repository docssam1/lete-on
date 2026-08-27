(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_ACADEMY_EVALUATION_PROFILES = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const profiles = Object.freeze({
    SH: Object.freeze({
      programId: "SH",
      displayName: "황소 고등",
      paperStyle: "중등 전 범위를 한 회차에 누적 배치하는 40문항 선발형",
      defaultDuration: "110분 · 우리 판매용 모의고사",
      difficultyFlow: "기본 정확도에서 복합 조건·도형 추론까지 누적 변별",
      reportTitle: "황소 고등 선발 진단",
      primaryAxes: Object.freeze(["중등 누적 영역", "학년·학기·단원", "세부유형", "난이도", "취약 유형 우선순위"]),
      evaluationCriteria: Object.freeze([
        "40문항 전체의 문항별 정확도와 풀이 구조 안정성을 함께 평가",
        "수·식, 함수·좌표, 평면·입체도형, 경우의 수·확률의 누적 균형을 평가",
        "공개 레벨 컷은 지점·과정·회차가 일치해 별도 승인된 경우에만 판정에 사용"
      ]),
      decisionPolicy: "현재 1회는 진단 우선이며 외부 레벨 컷을 자동 적용하지 않음"
    }),
    DP: Object.freeze({
      programId: "DP",
      displayName: "돌파",
      paperStyle: "입학·편입 종료 단원에 맞춘 30문항 과정별 시험형",
      defaultDuration: "회차별 실제 공지·원본 시간 분리",
      difficultyFlow: "초반 계산 정확도, 후반 조건 분기·그래프·조합 결합 변별",
      reportTitle: "돌파 입학·편입 진단",
      primaryAxes: Object.freeze(["지원 과정", "종료 단원 도달도", "전·후반 난도", "세부유형", "취약 유형 우선순위"]),
      evaluationCriteria: Object.freeze([
        "중1 입학, 중등 편입, 공통수학 입학을 서로 다른 범위로 평가",
        "편입형은 시작 학기명이 아니라 시험 범위가 끝나는 단원으로 관리",
        "원장반·상위반은 복합 조건과 경계·그래프 감사 비중을 높여 별도 평가"
      ]),
      decisionPolicy: "실제 회차의 기준이 일치하고 승인된 경우에만 합격 판정"
    }),
    WM: Object.freeze({
      programId: "WM",
      displayName: "원수학",
      paperStyle: "지원 과정에 맞춰 대수와 기하를 분리하는 입학·승급형",
      defaultDuration: "과정별 공개 규격 분리",
      difficultyFlow: "기본 정석 안정성과 두 영역의 누적 공백을 독립 확인",
      reportTitle: "원수학 대수·기하 진단",
      primaryAxes: Object.freeze(["대수 수행률", "기하 수행률", "영역별 과락 위험", "단원·세부유형", "누적 공백"]),
      evaluationCriteria: Object.freeze([
        "전체 점수와 대수·기하 영역 점수를 분리 평가",
        "중2-1 신입 20+20과 공통수학1 입학 25+25를 서로 다른 시험으로 조립",
        "영역 최소 기준은 승인된 동일 회차에서만 표시"
      ]),
      decisionPolicy: "동일 과정·회차의 원본과 기준이 확인되기 전 합격 판정 잠금"
    }),
    ED: Object.freeze({
      programId: "ED",
      displayName: "이든",
      paperStyle: "중1 시작반과 고등선행을 분리하는 학년·학기 누적형",
      defaultDuration: "현재 공식 시간 확인 필요 · 과거 공개 사례 100분",
      difficultyFlow: "학년별 기본 정확도에서 중등 심화·고등선행 연결로 확장",
      reportTitle: "이든 학년·학기 누적 진단",
      primaryAxes: Object.freeze(["학년별 정답 수", "학기별 수행률", "단원 공백", "심화 연결", "재도전 우선순위"]),
      evaluationCriteria: Object.freeze([
        "중1 시작반은 초5·초6 선수과정을 분리 평가",
        "고등선행은 중2-1·3-1·2-2·3-2 수행을 분리 평가",
        "익명 결과의 불합격 점수는 공식 커트라인으로 추정하지 않음"
      ]),
      decisionPolicy: "최신 공식 기준 확보 전 점수·진단만 제공"
    }),
    DG: Object.freeze({
      programId: "DG",
      displayName: "깊생",
      paperStyle: "중3-1·공통수학1·공통수학2 연결형 심화 입학 시험",
      defaultDuration: "확인 필요",
      difficultyFlow: "이차함수와 여러 가지 부등식의 연결, 도형의 방정식까지 심화",
      reportTitle: "깊생 심화 연결 진단",
      primaryAxes: Object.freeze(["과정별 수행률", "개념 연결", "복합 조건", "세부유형", "심화 난도"]),
      evaluationCriteria: Object.freeze([
        "중3 이차함수와 공통수학1의 중복·연결 개념을 함께 평가",
        "여러 가지 부등식과 함수 해석의 연결 구조를 별도 평가",
        "원본 시험·답안 확보 전에는 공식 레벨 판정을 만들지 않음"
      ]),
      decisionPolicy: "범위는 근거로 사용하되 공식 문항 수·컷은 확인 필요"
    }),
    SM: Object.freeze({
      programId: "SM",
      displayName: "생수",
      paperStyle: "추천 샘플을 현행 교육과정으로 재분류한 공통수학 진단형",
      defaultDuration: "확인 필요",
      difficultyFlow: "삼각비·부등식의 기본에서 응용 심화까지 단계화",
      reportTitle: "생수 추천문제 진단",
      primaryAxes: Object.freeze(["단원 도달도", "세부유형", "풀이 구조", "난이도", "유사문제 준비도"]),
      evaluationCriteria: Object.freeze([
        "샘플 3회는 공식 실제 기출과 구분해 평가",
        "현행 교육과정의 대단원·소단원·세부유형으로 다시 분류",
        "공식 상품명·시간·커트 확인 전에는 합격 판정을 표시하지 않음"
      ]),
      decisionPolicy: "추천 진단 전용 · 공식 입학 판정 없음"
    })
  });

  const examOverrides = Object.freeze({
    "sh-selection-r01": Object.freeze({ scope: "중등 누적 40문항", duration: "110분", paperVariant: "황소 고등 선발 1회" }),
    "dp-middle1-entry": Object.freeze({ scope: "초5-1~초6-2 누적", duration: "확인 필요", paperVariant: "돌파 중1 입학" }),
    "dp-middle2-2-transfer": Object.freeze({ scope: "중1-1~중2-1 전 범위(일차함수까지)", duration: "현재 회차 확인 필요", paperVariant: "돌파 중2-2 입반 대비" }),
    "dp-common1-entry-202405": Object.freeze({ scope: "중2-1~중3-2", duration: "회차 확인 필요", paperVariant: "돌파 공통수학1 입학" }),
    "wm-middle21-basic-entry-r01": Object.freeze({ scope: "중1 대수 20 + 중1 기하 20 · 통계 제외", duration: "각 50분 · 전체 전형 창 120분", paperVariant: "원수학 중2-1 기본반 신입" }),
    "wm-algebra-geometry-diagnostic": Object.freeze({ scope: "중등대수 25 + 중등기하 25 목표", duration: "90분 + 20분 + 90분 공개 사례", paperVariant: "원수학 대수·기하" }),
    "ed-middle1-entry": Object.freeze({ scope: "초5 12 + 초6 18", duration: "확인 필요", paperVariant: "이든 중1 시작" }),
    "ed-high-advance-entry": Object.freeze({ scope: "중2·중3 학기별 누적", duration: "확인 필요", paperVariant: "이든 고등선행" })
  });

  function resolve(examId, programId) {
    const profile = profiles[String(programId || "")];
    if (!profile) return null;
    return Object.freeze({ profile, exam: examOverrides[String(examId || "")] || null });
  }

  return Object.freeze({ updatedAt: "2026-08-24", profiles, examOverrides, resolve });
});
