(function (root) {
  "use strict";
  root.HIGHSELECT_QUESTION_BANK = {
    curriculum: {
      middle: [
        { id: "M1", label: "중1 누적", state: "분류 검수 중" },
        { id: "M2", label: "중2 누적", state: "분류 검수 중" },
        { id: "M3", label: "중3 누적", state: "분류 검수 중" }
      ],
      common1: ["다항식", "방정식과 부등식", "경우의 수", "행렬"],
      common2: ["도형의 방정식", "집합과 명제", "함수와 그래프"]
    },
    practice: {
      stages: [
        { id: "original", label: "본시험", description: "승인된 원본으로 현재 위치를 확인" },
        { id: "twin", label: "쌍둥이", description: "같은 핵심 조건과 풀이 구조를 다른 맥락으로 반복" },
        { id: "similar", label: "유사", description: "조건 결합과 표현을 바꿔 전이를 확인" },
        { id: "mastery", label: "유지 확인", description: "재응시 이력으로 흔들림과 해결 여부를 확인" }
      ],
      bands: [
        { id: "lowered", label: "낮춤", rule: "풀이 구조를 다시 세우는 단계" },
        { id: "standard", label: "기준", rule: "시험과 같은 핵심 사고를 확인" },
        { id: "raised", label: "올림", rule: "조건 결합과 고난도 전이를 확인" }
      ],
      releaseRules: [
        "원본·쌍둥이·유사 문항은 단계별로 따로 승인",
        "같은 문항 또는 같은 수치만 반복하지 않음",
        "오답 유형과 풀이 구조가 일치하는 문항만 배정",
        "최근 풀이 이력과 같은 문항군은 연속 배정하지 않음",
        "정답 유일성과 그림·수식 감사를 통과한 문항만 사용"
      ]
    },
    auditActions: ["KEEP_RETAG", "MOVE_COURSE", "REVISE", "EXCLUDE", "ADD_NEW"],
    generationKinds: ["parameterized", "bespoke", "figure_only"],
    difficultyBands: ["lowered", "standard", "raised"],
    modes: [
      { id: "SH", label: "SH 모드", rule: "고등과정 선발·중등 누적 심화" },
      { id: "DP", label: "DP 모드", rule: "중1 입학 선수 과정과 공통수학 입반을 시험별 분리" },
      { id: "WM", label: "WM 모드", rule: "기본/실력 승급형·전범위 누적" },
      { id: "ED", label: "ED 모드", rule: "중1 시작 초등 누적과 고등선행 중등 누적 분리" },
      { id: "DG", label: "DG 모드", rule: "이차함수-부등식 연결·심화 수준" },
      { id: "SM", label: "SM 모드", rule: "추천 샘플의 범위·난도 구조" }
    ],
    // The public bank stores a *blueprint*, not originals or answer keys.
    // A profile gives the planner its scope, report axes and type priorities.
    // It never turns an observed scope or a reference scorecard into an
    // approved admission rule.
    academyProfiles: [
      {
        id: "SH",
        reportModel: "selection-40",
        targets: [{ id: "high-selection", scopeKey: "middle-cumulative", state: "verified-structure", label: "고등 선발" }],
        reportAxes: ["문항 O/X", "영역", "학년·학기·단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["중등 누적", "조건 해석", "대수·기하 연결"],
        scorePolicy: "원본 배점이 승인되기 전에는 문항별 진단만 제공"
      },
      {
        id: "DP",
        reportModel: "entry-transfer-30",
        targets: [
          { id: "middle-entry", scopeKey: "elementary-cumulative", state: "observed", label: "중1 입학", difficultyPlan: "기준 중심 · 올림 유형은 선별" },
          { id: "middle2-2-transfer", scopeKey: "middle1-1-to-middle2-2", state: "user-confirmed", label: "중2-2 편입", difficultyPlan: "기준 우선 · 올림 유형으로 변별" },
          { id: "common1-entry", scopeKey: "common-math-1", state: "audited-revision", label: "공통수학1 입학", difficultyPlan: "원본 회차의 난도 배열 유지" },
          { id: "director-transfer", scopeKey: "target-class-confirmation", state: "observed", label: "원장반·상위 편입", difficultyPlan: "올림 우선 · 조건 결합·그래프·경계 전수 확인 강화" }
        ],
        reportAxes: ["문항 O/X", "과정", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["계산 정확도", "경우 나누기", "그래프 해석", "조건 결합", "도형·개수 세기"],
        scorePolicy: "회차별 원본 배점·컷이 승인된 경우에만 합격 판정을 표시"
      },
      {
        id: "WM",
        reportModel: "level-placement",
        targets: [{ id: "common-entry", scopeKey: "middle-algebra-geometry", state: "structure-conflict", label: "공통수학 입학·승급" }],
        reportAxes: ["문항 O/X", "대수·기하 영역", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["대수", "기하", "누적 복습"],
        scorePolicy: "규격과 원본이 일치한 회차만 영역 최소 기준을 사용"
      },
      {
        id: "ED",
        reportModel: "entry-advance",
        targets: [{ id: "middle-entry", scopeKey: "elementary-cumulative", state: "observed", label: "중1 시작" }, { id: "high-advance", scopeKey: "middle-semester-cumulative", state: "audited", label: "고등선행" }],
        reportAxes: ["문항 O/X", "학년·학기", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["학년별 누적", "중등 심화", "고등선행 연결"],
        scorePolicy: "관찰된 결과 문자는 컷으로 추정하지 않음"
      },
      {
        id: "DG",
        reportModel: "advanced-entry",
        targets: [{ id: "level-entry", scopeKey: "middle-common-math-mixed", state: "scope-verified", label: "레벨 입학" }],
        reportAxes: ["문항 O/X", "과정", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["이차함수", "부등식 연결", "도형의 방정식"],
        scorePolicy: "원본 시험·답안이 확보되기 전에는 모의 진단만 제공"
      },
      {
        id: "SM",
        reportModel: "sample-recommendation",
        targets: [{ id: "common2-sample", scopeKey: "common-math-sample", state: "sample", label: "공통수학2 샘플" }],
        reportAxes: ["문항 O/X", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["삼각비", "부등식", "공통수학2 기본"],
        scorePolicy: "추천 샘플은 실제 입학 기준으로 단정하지 않음"
      }
    ],
    safeguards: [
      "원문 문항을 학년→대단원→소단원→세부유형으로 먼저 분류",
      "핵심 조건과 풀이 구조를 기록",
      "숫자 치환형·전용 생성형·그림 전용형을 분리",
      "가능한 답을 전수 검사하고 정답이 하나일 때만 통과",
      "수식·표·그래프·전개도·입체도형은 전용 감사",
      "사용자 검수 전 공개 금지"
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
