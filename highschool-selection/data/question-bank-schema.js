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
    sharedRegistry: {
      identityPolicy: "한 문항은 하나의 ID로 관리하고 학원별 시험지에 복제하지 않음",
      scopeIdentityPolicy: "지원 과정·시험 회차·실제 시험 범위·종료 단원을 각각 저장한다. 응시 학년은 자격 조건일 뿐 문제 분류 기준으로 사용하지 않음",
      academyStyleTagPolicy: {
        cardinality: "many-to-many",
        requiredFields: ["sourceFamilyId", "sourceDifficultyBand", "academyStyleTags", "academyFitDifficulty"],
        rule: "원출처와 원천 난도를 보존한 채 한 문항에 원수학형·돌파형·이든형 등 여러 학원형 태그를 함께 붙인다. 학원형 태그가 추가되어도 출처나 원천 난도를 바꾸지 않는다."
      },
      consumers: ["SH", "DP", "WM", "ED", "DG", "SM"],
      sourcePriorities: [
        {
          id: "hwangso-middle-textbooks",
          label: "황소 중등 교재",
          priorityFor: ["SH"],
          reusableFor: ["DP", "WM", "ED", "DG", "SM"],
          status: "private-source-indexing",
          sourceDifficultyBand: "high",
          sourceRole: "academy-textbook-base",
          rule: "황소 고등 선발의 중등 누적 유형을 우선 대조하고 다른 시험은 범위·난도·표기 호환성을 다시 검사"
        },
        {
          id: "wm-middle21-private-pools",
          label: "원수학 중2-1 입반 후보 풀",
          priorityFor: ["WM"],
          reusableFor: ["SH", "DP", "ED"],
          status: "private-candidate-locked",
          sourcePoolIds: ["HS_G7", "SW_G7", "DP_G7", "AG_G7_OOP", "BL_G7_2025", "LIMITED_G7_OOP", "SUPERMATH_G7_OOP", "MATHGOD_G7_OOP", "LINEUP_GEO_MIDDLE_OOP", "DD_HIGH_G7", "HX_G7_OOP", "INSIGHT_G7_OOP"],
          requiredSourceLineup: ["HS_G7", "SW_G7", "LIMITED_G7_OOP", "SUPERMATH_G7_OOP", "MATHGOD_G7_OOP", "DD_HIGH_G7"],
          minimumSourceFamiliesPerRound: 8,
          maximumItemsFromOneSourceFamilyPerRound: 6,
          difficultyMix: { standard: 16, raised: 24, lowered: 0 },
          rule: "중1-1 대수와 중1-2 기하만 사용하고 통계·학년 밖 기호·구교육과정 표현을 제외한다. 황소 중등·STARWARS·리미티드·SUPERMATH·수학의 신·최상위수학을 포함해 한 회에 여덟 출처 이상을 섞고 한 출처는 여섯 문항을 넘기지 않는다. 기준 심화 16문항·올림 24문항을 사용하며, 원문 대조와 정답 검산을 통과한 문항만 승인한다."
        },
        {
          id: "ndh-advanced-mocks",
          label: "노동현 수학(상)·수학(하) 실력 모의고사",
          priorityFor: ["DP"],
          reusableFor: ["SH", "WM", "ED", "DG", "SM"],
          status: "private-source-curriculum-remap-locked",
          sourceSummary: "수학(상) 17회분 · 수학(하) 19회분",
          reuseBand: "advanced",
          rule: "원장반·실력반 등 상위 심화 대비에 우선 사용한다. 각 문항은 공통수학1·2 단원으로 다시 태깅하고 범위·정답·난도를 검수하면 다른 학원형 심화 세트에도 공유할 수 있다. 기본반에는 자동으로 섞지 않는다."
        }
      ],
      legacyCurriculumRemap: {
        from: "2015 개정 수학(상)·수학(하)",
        to: "2022 개정 공통수학1·공통수학2",
        moved: [
          "경우의 수·순열과 조합: 수학(하)에서 공통수학1로 이동",
          "도형의 방정식: 수학(상)에서 공통수학2로 이동"
        ],
        newlyRequired: ["행렬: 공통수학1 현행 범위"],
        reuseRule: "같은 단원 문제는 재사용 후보로 유지하되 원문 동일 여부·현행 용어·범위·정답을 문항별 확인한 뒤 승인"
      },
      compatibilityChecks: [
        "2022 개정 교육과정 범위 일치",
        "학년·대단원·소단원·세부유형 일치",
        "핵심 조건과 풀이 구조 일치",
        "시험별 난도·배점·문항 위치 적합",
        "구교육과정 기호·용어·범위 제거 또는 현행화",
        "중1~중3 문제·선택지·해설에서 집합 기호로 교점이나 선분 위의 점을 나타내지 않았는지 확인",
        "정답·그림·수식 감사와 사용자 승인"
      ],
      perExamOverrides: ["배점", "문항 순서", "시험시간", "난도 곡선", "평가축", "커트라인·과락"]
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
      { id: "SH", label: "황소 고등형", rule: "고등과정 선발·중등 누적 심화" },
      { id: "DP", label: "돌파형", rule: "중1 과정, 공통수학1·2 기본/실력, 대수 기본과 중간 편입을 지원 과정별로 분리" },
      { id: "WM", label: "원수학형", rule: "기본/실력 승급형·전범위 누적" },
      { id: "ED", label: "이든형", rule: "중1 시작 초등 누적과 고등선행 중등 누적 분리" },
      { id: "DG", label: "깊생형", rule: "이차함수-부등식 연결·심화 수준" },
      { id: "SM", label: "생수형", rule: "공통수학1 입반 범위와 구판 참고 샘플의 현행 난도 보정 구조" }
    ],
    academyDifficultyOrder: {
      status: "owner-confirmed",
      order: ["WM", "DP", "ED"],
      tiers: [
        { academyId: "WM", label: "원수학", relativeDifficulty: 1 },
        { academyId: "DP", label: "돌파", relativeDifficulty: 2 },
        { academyId: "ED", label: "이든", relativeDifficulty: 3 }
      ],
      evidenceModel: {
        ownerDecision: "학원별 대비 시험의 상대 난도 순서",
        perceivedReports: "진도 속도·숙제·누적시험·수업 횟수·보조 학습 필요성",
        renderedItems: "문항 조건 수·풀이 단계·표현 전환·정답 유일성",
        rule: "체감 후기와 문항 자체 난도를 별도로 저장하고, 체감 후기를 공식 컷이나 기출 난도로 표시하지 않음"
      },
      note: "원수학을 가장 어렵게, 다음 돌파, 다음 이든 순으로 대비 난도를 설계한다. 중등 황소도 어려운 과정이지만 이 세 학원의 단순 순위에 끼워 넣지 않고 황소 교재 기반 고난도 출처군으로 따로 보존한다."
    },
    // The public bank stores a *blueprint*, not originals or answer keys.
    // A profile gives the planner its scope, report axes and type priorities.
    // It never turns an observed scope or a reference scorecard into an
    // approved admission rule.
    academyProfiles: [
      {
        id: "SH",
        reportModel: "selection-40",
        targets: [
          { id: "high-selection", courseCode: "high-selection", scopeKey: "middle-cumulative", state: "verified-structure", label: "고등 시작·선발" },
          {
            id: "middle-transfer",
            courseCode: "middle-transfer",
            scopeKey: "middle-transfer-current-progress",
            state: "official-process-verified-scope-dynamic",
            label: "중등과정 편입",
            difficultyPlan: "지점·월·과정별 공지 범위와 현재 진도에 맞춰 조립"
          },
          {
            id: "high-transfer",
            courseCode: "high-transfer",
            scopeKey: "high-transfer-current-progress",
            state: "official-process-verified-scope-dynamic",
            label: "고등과정 편입",
            placementLevels: ["기본정석 Light", "기본정석 Plus", "실력정석"],
            difficultyPlan: "기존 반의 현재 진도와 결원 과정 확인 후 조립 · 지점별 배정 기준 자동 환산 금지"
          }
        ],
        reportAxes: ["문항 O/X", "영역", "학년·학기·단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["중등 누적", "조건 해석", "대수·기하 연결"],
        scorePolicy: "원본 배점이 승인되기 전에는 문항별 진단만 제공"
      },
      {
        id: "DP",
        reportModel: "entry-transfer-30",
        targets: [
          {
            id: "middle-entry",
            courseCode: "middle1",
            scopeKey: "elementary-cumulative",
            state: "official-process-verified-scope-observed",
            label: "중1 과정 입학",
            officialProcess: true,
            officialEvidenceRefs: ["PUBLIC:DP-SEOCHO-ENTRY-2026-09"],
            observedScope: "초5-1~초6-2 누적",
            difficultyPlan: "중1 과정 입학용 초등 누적 범위를 회차별 확인하고 기준 중심·후반 변별형으로 조립"
          },
          {
            id: "middle2-2-transfer",
            courseCode: "middle-transfer",
            scopeKey: "middle1-1-to-linear-function",
            scopeKind: "terminal-unit",
            terminalUnit: { course: "중2-1", unit: "일차함수" },
            state: "scope-reassembly-required",
            label: "중2-2 입반 대비",
            recommendedExamId: "dp-middle2-2-transfer",
            difficultyPlan: "전 범위형 원본을 우선 사용 · 중간 단원 종료형은 부족한 유형 보완에만 사용 · 기준 우선 · 올림 유형으로 변별"
          },
          {
            id: "common1-entry",
            courseCode: "common1-basic",
            scopeKey: "middle2-1-to-middle3-2",
            state: "official-process-verified-source-reassembly-required",
            label: "공통수학1 기본 입학",
            recommendedExamId: "dp-common1-entry-202405",
            officialProcess: true,
            officialEvidenceRefs: ["PUBLIC:DP-G6-CM1-BASIC-2026-09-01"],
            difficultyPlan: "공식 범위인 중2·3 전 과정 안의 돌파 원본만 사용 · 원본 회차의 난도 배열 유지"
          },
          {
            id: "common2-basic-entry",
            courseCode: "common2-basic",
            scopeKey: "common-math-1-basic-full",
            state: "official-process-and-scope-verified-paper-pending",
            label: "공통수학2 기본 입학",
            officialProcess: true,
            officialEvidenceRefs: ["PUBLIC:DP-M1-CM2-BASIC-2026-08-14"],
            difficultyPlan: "공통수학1 기본 전범위의 정확도와 후반 변별 문항을 함께 확인"
          },
          { id: "common1-skill-entry", courseCode: "common1-skill", scopeKey: "course-round-specific", state: "official-process-verified-scope-dynamic", label: "공통수학1 실력 입학", officialProcess: true, officialEvidenceRefs: ["PUBLIC:DP-ZERO-OPEN-2026-08-31"], difficultyPlan: "회차별 공식 범위를 먼저 확인하고 기본반보다 조건 결합·경계·그래프 해석 비중을 높여 별도 조립" },
          { id: "common2-skill-entry", courseCode: "common2-skill", scopeKey: "course-round-specific", state: "official-process-verified-scope-dynamic", label: "공통수학2 실력 입학", officialProcess: true, officialEvidenceRefs: ["PUBLIC:DP-ZERO-OPEN-2026-08-31"], difficultyPlan: "회차별 공식 범위를 확인한 뒤 조립" },
          { id: "algebra-basic-entry", courseCode: "algebra-basic", scopeKey: "course-round-specific", state: "official-process-verified-scope-dynamic", label: "대수 기본 입학", officialProcess: true, officialEvidenceRefs: ["PUBLIC:DP-ZERO-OPEN-2026-08-31"], difficultyPlan: "회차별 공식 범위를 확인하고 상위 대수 진입 준비도를 평가" },
          {
            id: "director-advanced",
            scopeKey: "advanced-current-progress",
            state: "owner-confirmed-private-source",
            label: "원장반·상위 심화 대비",
            officialProcess: false,
            sourcePoolIds: ["ndh-advanced-mocks"],
            difficultyPlan: "노동현 실력 모의고사 우선 · 올림 난도 · 조건 결합·그래프·경계 전수 확인 · 기본반 혼입 금지"
          }
        ],
        reportAxes: ["문항 O/X", "과정", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["계산 정확도", "경우 나누기", "그래프 해석", "조건 결합", "도형·개수 세기"],
        scorePolicy: "회차별 원본 배점·컷이 승인된 경우에만 합격 판정을 표시"
      },
      {
        id: "WM",
        reportModel: "level-placement",
        targets: [
          {
            id: "middle21-basic-entry",
            courseCode: "middle21-basic",
            scopeKey: "middle1-algebra-geometry-no-statistics",
            state: "official-structure-verified",
            label: "중2-1 기본반 신입",
            recommendedExamId: "wm-middle21-basic-entry-r01",
            difficultyPlan: "기준 심화 중심 · 꼬리문항은 조건 결합과 시간 압박을 강화"
          },
          { id: "common-entry", courseCode: "common1-basic", scopeKey: "middle-algebra-geometry", state: "partial-audited", label: "공통수학1 기본반 입학" },
          { id: "middle-transfer", courseCode: "middle-transfer", scopeKey: "course-round-specific", state: "official-process-verified-scope-dynamic", label: "중등 기본반 편입", difficultyPlan: "지원 과정과 현재 진도의 대수·기하 범위를 따로 확인한 뒤 조립" },
          { id: "high-dual", courseCode: "high-dual", scopeKey: "common-math-dual-prerequisite", state: "official-process-verified-scope-dynamic", label: "실력공수1·2 듀얼", difficultyPlan: "공통수학1·2 기본 이수 여부와 회차별 입학 범위를 확인한 뒤 별도 조립" }
        ],
        reportAxes: ["문항 O/X", "대수·기하 영역", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["대수", "기하", "누적 복습", "정확한 개념 적용", "연결 소문항"],
        scorePolicy: "과정별 규격과 원본이 일치한 회차만 영역 최소 기준을 사용하며, 과거 50문항 컷을 현재 40문항 시험에 환산하지 않음"
      },
      {
        id: "ED",
        reportModel: "entry-advance",
        targets: [{ id: "middle-entry", courseCode: "middle1", scopeKey: "elementary-cumulative", state: "observed", label: "중1 시작" }, { id: "high-advance", courseCode: "high-advance", scopeKey: "middle-semester-cumulative", state: "audited", label: "고등선행" }],
        reportAxes: ["문항 O/X", "학년·학기", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["학년별 누적", "중등 심화", "고등선행 연결"],
        scorePolicy: "관찰된 결과 문자는 컷으로 추정하지 않음"
      },
      {
        id: "DG",
        reportModel: "advanced-entry",
        targets: [{ id: "level-entry", courseCode: "level-entry", scopeKey: "middle-common-math-mixed", state: "scope-verified", label: "레벨 입학" }, { id: "pre-high1", courseCode: "pre-high1", scopeKey: "middle-common-math-mixed", state: "observed-scope-paper-pending", label: "예비고1 입학", difficultyPlan: "동일 회차의 중3·공통수학 범위를 확인한 뒤 고난도 연결형으로 조립" }],
        reportAxes: ["문항 O/X", "과정", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["이차함수", "부등식 연결", "도형의 방정식"],
        scorePolicy: "원본 시험·답안이 확보되기 전에는 모의 진단만 제공"
      },
      {
        id: "SM",
        reportModel: "entry-30-algebra-geometry",
        targets: [
          {
            id: "common1-entry",
            courseCode: "common1-basic",
            scopeKey: "middle2-2-to-middle3-2",
            state: "verified-structure-owner-adjusted-difficulty",
            label: "공통수학1 기본 입반",
            recommendedExamId: "sm-common1-entry",
            difficultyPlan: "2022 구판 모의 참고지보다 조건 결합·풀이 단계·표현 전환을 강화"
          },
          { id: "common2", courseCode: "common2", scopeKey: "course-round-specific", state: "official-scope-pending", label: "공통수학2 과정", difficultyPlan: "동일 회차의 공식 범위와 원본 시험지를 확인한 뒤 조립" }
        ],
        reportAxes: ["문항 O/X", "대수·기하 영역", "학년·학기", "단원", "세부유형", "난이도", "취약 우선순위"],
        typeEmphasis: ["대수·기하 15문항 균형", "중2-2~중3-2 누적", "조건 결합", "기하 추론"],
        scorePolicy: "공통수학1 기본 입반의 동일 공지 범위에서만 20/30 기준을 표시하며 구판 샘플을 현행 공식 기출로 표시하지 않음"
      }
    ],
    safeguards: [
      "원문 문항을 학년→대단원→소단원→세부유형으로 먼저 분류",
      "핵심 조건과 풀이 구조를 기록",
      "숫자 치환형·전용 생성형·그림 전용형을 분리",
      "가능한 답을 전수 검사하고 정답이 하나일 때만 통과",
      "수식·표·그래프·전개도·입체도형은 전용 감사",
      "중등 문항은 P=AE∩BD·D∈BC 같은 집합식 표현을 금지하고 두 선분의 교점·선분 위의 점을 문장으로 표시",
      "사용자 검수 전 공개 금지"
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
