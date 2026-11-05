(function (root) {
  "use strict";

  const programs = [
    {
      code: "SH",
      shortName: "황소",
      publicName: "생각하는황소",
      accent: "#c06738",
      examNature: "중등 전 범위를 한 번에 연결해 정확도와 심화 해결력을 함께 보는 누적 선발형",
      preparation: ["중등 전 단원의 빈칸을 먼저 점검", "서술 과정과 조건 누락을 함께 교정", "후반 복합 도형·함수 문항의 시간 배분 연습"],
      courses: [
        { id: "high-selection", label: "고등과정 시작·선발", scope: "중등 누적", status: "guide" },
        { id: "middle-transfer", label: "중등과정 편입", scope: "지점·월·현재 진도별 확인", status: "guide" },
        { id: "high-transfer", label: "고등과정 편입", scope: "현재 반 진도와 배정 과정별 확인", status: "guide" }
      ],
      relatedPrograms: [
        { label: "생각하는 황소 중등대비", url: "https://lete-on.gfieldacademy.net/hsmiddle/" },
        { label: "생각하는 황소 초등대비", url: "https://hs.gfieldacademy.net/promo/" }
      ],
      channel: { label: "공식 홈페이지 공지", url: "https://www.thinking-bull.com/notice", status: "official" },
      updates: [
        { date: "2025-07-22", title: "고등과정 개편 안내", url: "https://www.thinking-bull.com/notice/?bmode=view&idx=166962077", sourceKind: "공식" }
      ]
    },
    {
      code: "DP",
      shortName: "돌파",
      publicName: "돌파수학",
      accent: "#315c85",
      examNature: "지원 과정에 맞는 선수 범위를 30문항으로 확인하고 후반 조건 분기·그래프 문항으로 변별하는 과정별 입학형",
      preparation: ["응시 학년보다 지원 과정명을 먼저 확정", "시작반과 중간 편입을 구분해 해당 회차의 범위·마지막 단원을 확인", "기본 정확도 뒤에 조건 결합·그래프·경우 나누기 연습", "수업 속도·과제·보충 방식은 지원할 지점과 반에 직접 확인"],
      courses: [
        { id: "middle1", label: "중1 과정 입학", scope: "초등 누적 · 회차별 확인", status: "guide" },
        { id: "common1-basic", label: "공통수학1 기본", scope: "중2·중3 전 과정 · 대치 2026년 12월 개강", status: "guide" },
        { id: "common2-basic", label: "공통수학2 기본", scope: "지원 반의 공식 진도표·종료 단원 확인", status: "guide" },
        { id: "common1-skill", label: "공통수학1 실력", scope: "회차별 공식 범위", status: "guide" },
        { id: "common2-skill", label: "공통수학2 실력", scope: "회차별 공식 범위", status: "guide" },
        { id: "algebra-basic", label: "대수 기본", scope: "회차별 공식 범위", status: "guide" },
        { id: "middle-transfer", label: "중간 편입", scope: "현재 반 진도와 종료 단원", status: "guide" }
      ],
      channel: { label: "돌파수학 공식 블로그", url: "https://blog.naver.com/dpmath", status: "official" },
      updates: [
        { date: "2026-09-01", title: "대치 중등관 초6 10월 공통수학1 기본 개강", url: "https://blog.naver.com/dpmath/224397245808", sourceKind: "공식" },
        { date: "2026-08-31", title: "대치 제로관 개관 및 과정별 입반테스트", url: "https://blog.naver.com/dpmath/224396287609", sourceKind: "공식" },
        { date: "2026-08-14", title: "중1 공통수학2 기본 개강 안내", url: "https://blog.naver.com/dpmath/224378545546", sourceKind: "공식" }
      ]
    },
    {
      code: "WM",
      shortName: "원수학",
      publicName: "원수학",
      accent: "#35705a",
      examNature: "대수와 기하를 분리해 전체 점수와 영역별 최소 기준을 함께 보는 입학·편입형",
      preparation: ["대수와 기하를 따로 시간 재서 점검", "심화 문제를 정확한 풀이 과정으로 완성", "한 영역의 약점이 전체 합격을 가리지 않도록 과락 위험 교정", "기본반·실력 듀얼과 신입·중간 편입을 구분하고 반별 운영 방식을 확인"],
      courses: [
        { id: "middle21-basic", label: "중2-1 기본반 신입", scope: "중1 대수·기하 · 통계 제외", status: "guide" },
        { id: "common1-basic", label: "공통수학1 기본반 입학", scope: "중2·중3 대수·기하 · 확률 포함 · 각 90분", status: "guide" },
        { id: "middle-transfer", label: "중등 기본반 편입", scope: "과정·회차별 대수·기하", status: "guide" },
        { id: "high-dual", label: "실력공수1·2 듀얼", scope: "공통수학1·2 기본 이수 후", status: "guide" }
      ],
      channel: { label: "원수학 대치 공식 블로그", url: "https://blog.naver.com/wonmath563", status: "official" },
      updates: [
        { date: "2026-08-28", title: "10월 중2-1 기본반 신입 · 각70분·25문항", url: "https://blog.naver.com/wonmath563/224393421982", sourceKind: "공식" },
        { date: "2026-11-06", title: "12월 공통수학1 기본반 신입 · 각90분·25문항", url: "https://blog.naver.com/wonmath563/224443076138", sourceKind: "공식" }
      ]
    },
    {
      code: "ED",
      shortName: "이든",
      publicName: "이든수학",
      accent: "#775c8d",
      examNature: "중1 시작은 초5·초6, 공통수학1 기본반은 중2·중3 전 과정의 서술형 입반 테스트",
      preparation: ["지원 과정의 학기별 범위를 나눠 점검", "오답을 다시 풀고 설명할 수 있을 때까지 반복", "긴 시험에서 학기별 시간 편차를 기록", "시작반·편입반의 현재 진도와 과제·클리닉 운영을 별도로 확인"],
      courses: [
        { id: "middle1", label: "중1 시작", scope: "초5·초6 전 과정 · 30문항 · 100분", status: "guide" },
        { id: "high-advance", courseCode: "common1-basic", label: "공통수학1 기본반", scope: "중2·중3 전 과정 · 대수 20 + 기하 10 · 100분", status: "guide" },
        { id: "common2-skill", label: "공통수학2 실력반", scope: "공통수학1 실력 + 공통수학2 기본 · 공식 FAQ 범위 예시", status: "guide" },
        { id: "algebra-basic", label: "대수 기본반", scope: "공통수학1·2 실력 · 공식 FAQ 범위 예시", status: "guide" }
      ],
      channel: { label: "이든수학 공식 블로그", url: "https://blog.naver.com/edenmath", status: "verified" },
      updates: [{ date: "2026-10-07", title: "공통수학1 기본반 12월 개강·입반 테스트", url: "https://blog.naver.com/edenmath/224434054175", sourceKind: "공식 블로그" }]
    },
    {
      code: "DG",
      shortName: "깊생",
      publicName: "깊은생각",
      accent: "#8a6730",
      examNature: "중1 시작반은 초5·초6 누적, 예비고1은 공통수학 연결형 입반 테스트",
      preparation: ["단원별 풀이보다 개념 사이 연결을 설명", "함수 그래프와 부등식 조건을 함께 해석", "한 문제 안에서 여러 경우를 끝까지 검토"],
      courses: [
        { id: "middle1", label: "중1 시작반", scope: "초5·초6 누적 · 각 30문항 · 70분", status: "guide" },
        { id: "level-entry", label: "레벨 입학", scope: "중3 심화·공통수학 연결", status: "guide" },
        { id: "pre-high1", label: "예비고1 입학", scope: "공통수학1·공통수학2 도형의 방정식", status: "guide" }
      ],
      channel: { label: "깊은생각 공식 입학테스트 안내", url: "https://apply.dailystudy.com/entrance-test/info/?academy=master", status: "official" },
      updates: []
    },
    {
      code: "SM",
      shortName: "생수",
      publicName: "생각하는수학",
      accent: "#286d75",
      examNature: "대수 15문항과 기하 15문항을 나누어 중등 누적 정확도와 조건 결합을 함께 보는 공통수학 입반형",
      preparation: ["대수·기하를 각각 15문항 단위로 점검", "구판보다 강화된 조건 결합과 표현 전환 연습", "삼각비·원·함수 등 기하 추론의 풀이 근거를 남김", "지원 과정과 반을 확정한 뒤 수업 속도·과제·보충 방식을 직접 확인"],
      courses: [
        { id: "common1-basic", label: "공통수학1 기본 입반", scope: "중2-2·중3-1·중3-2", status: "guide" },
        { id: "common2", label: "공통수학2 과정", scope: "회차별 공식 범위 확인", status: "guide" }
      ],
      channel: { label: "생각하는수학 공식 블로그", url: "https://blog.naver.com/won1934", status: "official" },
      updates: []
    }
  ];

  root.HIGHSELECT_ACADEMY_ENGAGEMENT = {
    updatedAt: "2026-11-06",
    standardExamPolicy: {
      required: true,
      rule: "모든 대비과정은 승인된 표준 시험지 한 회 이상이 있어야 신청과 판매를 열 수 있습니다.",
      supplementalSource: "표준 구성에 부족한 세부유형은 매쓰플랫에서 후보로 선택할 수 있지만, 검수와 사용자 승인 전에는 시험지에 포함하지 않습니다."
    },
    application: {
      surveyUrl: "",
      status: "configuration-required",
      note: "운영 설문 URL을 등록하면 모든 학원·과정의 신청 버튼이 활성화됩니다."
    },
    noticeRefresh: {
      cadence: "17:00 daily (Asia/Seoul)",
      branchFilter: "대치·분당 (황소는 대치만)",
      publicFields: ["제목", "날짜", "원문 링크", "출처", "대상 과정"],
      rule: "공식 원문과 공식 게시물 미러를 구분하고, 본문을 복사하지 않고 원문 링크만 제공합니다.",
      feed: "data/academy-notices.js",
      status: "github-actions-scheduled"
    },
    educationNews: {
      label: "교육 뉴스",
      sourceLabel: "유라 초등 황소",
      sourceUrl: "",
      status: "source-url-required",
      items: [],
      note: "정확한 원문 주소가 확인되면 제목·날짜·원문 링크만 매일 갱신합니다."
    },
    dashboardServices: [
      { id: "course-prep", label: "수강 대비 강좌", description: "승인된 과정의 범위·시험 성격·준비 순서를 확인", href: "#course-prep" },
      { id: "personal-bank", label: "나만의 문제은행", description: "권한 범위에서 난이도·문항 형식을 골라 시험 구성", href: "./my-exams.html" },
      { id: "diagnostic", label: "진단 분석지", description: "최근 결과와 단원·세부유형별 약점 확인", href: "./report.html" },
      { id: "exam-library", label: "내 모의시험", description: "승인된 시험과 준비 상태를 한곳에서 확인", href: "#exam-library" }
    ],
    programs
  };
})(typeof window !== "undefined" ? window : globalThis);
