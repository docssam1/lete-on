(function (root) {
  "use strict";

  const sources = {
    "SH-CURRICULUM-OFFICIAL": {
      title: "생각하는황소 고등과정",
      url: "https://www.thinking-bull.com/curriculum3",
      grade: "A",
      publishedAt: null,
      checkedAt: "2026-08-22"
    },
    "SH-REFORM-OFFICIAL": {
      title: "생각하는황소 고등과정 개편 안내",
      url: "https://www.thinking-bull.com/notice/?bmode=view&idx=166962077",
      grade: "A",
      publishedAt: "2025-07-22",
      checkedAt: "2026-08-22"
    },
    "SH-WIRYE-2026-06-MIRROR": {
      title: "생각하는황소 위례점 2026년 6월 고등과정 시작반 결과 미러",
      url: "https://academy.hakwonsin.co.kr/academy/lej2qvBe/%EC%83%9D%EA%B0%81%ED%95%98%EB%8A%94%ED%99%A9%EC%86%8C-%EC%9C%84%EB%A1%80%EC%A0%90",
      grade: "B",
      publishedAt: "2026-05-11",
      checkedAt: "2026-08-22"
    },
    "SH-SONGPA-2025-08-MIRROR": {
      title: "생각하는황소 송파학원 2025년 8월 편입·고등과정 입학시험 안내 미러",
      url: "https://www.gangmom.kr/news/6881a2a758e2e1569b75bf91",
      grade: "B",
      publishedAt: "2025-08",
      checkedAt: "2026-08-23"
    },
    "DP-ENTRY-MIRROR": {
      title: "돌파수학 2026년 8월 입반 공지 미러",
      url: "https://academy.prompie.com/academies/detail/6pm5v0k/%EB%8F%8C%ED%8C%8C%EC%88%98%ED%95%99%EC%84%9C%EC%B4%88%EA%B4%80%ED%95%99%EC%9B%90/",
      grade: "B",
      publishedAt: "2026-08-14",
      checkedAt: "2026-08-22"
    },
    "DP-TIMETABLE-OFFICIAL-2026-09": {
      title: "돌파수학 공식 채널 2026년 9월 분당관 과정·테스트 범위표",
      url: "https://blog.naver.com/dpmath/224366672272",
      grade: "A",
      publishedAt: "2026-08-03",
      checkedAt: "2026-08-27"
    },
    "WM-ENTRY-2025-MIRROR": {
      title: "원수학 공통수학1 기본반 입학전형 공지 미러",
      url: "https://www.gangmom.kr/news/687073e5431fcab188474d9f",
      grade: "B",
      publishedAt: "2025-07",
      checkedAt: "2026-08-22"
    },
    "WM-ENTRY-2025-REVIEW": {
      title: "원수학 레테에 합격하다 후기",
      url: "https://blog.naver.com/rubizzi/224102025195",
      grade: "C",
      publishedAt: "2025",
      checkedAt: "2026-08-24"
    },
    "WM-M21-INITIAL-2025": {
      title: "원수학 2026년 1월 중2-1 기본반 최초 입학전형 공지 미러",
      url: "https://www.gangmom.kr/news/6916927bf713b0cfec739b32",
      grade: "B",
      publishedAt: "2025-11",
      checkedAt: "2026-08-24"
    },
    "WM-M21-CHANGE-2025": {
      title: "원수학 중2-1 기본반 문항수·시험시간 변경 공지 미러",
      url: "https://www.gangmom.kr/news/692911a225d0669bb2ed8336",
      grade: "B",
      publishedAt: "2025-11",
      checkedAt: "2026-08-24"
    },
    "WM-M21-JULY-2026": {
      title: "원수학 2026년 7월 중2-1 기본반 신입생 입학테스트 공지 미러",
      url: "https://www.gangmom.kr/news/6a0fb52a1679e8440b3bcbf1",
      grade: "B",
      publishedAt: "2026-05",
      checkedAt: "2026-08-24"
    },
    "WM-MIDDLE-LAUNCH-2025": {
      title: "원수학 중등수학관 과정 구성 공지 미러",
      url: "https://www.gangmom.kr/news/6838ff501d3324234d1928fb",
      grade: "B",
      publishedAt: "2025-05",
      checkedAt: "2026-08-24"
    },
    "WM-M22-MAY-2026": {
      title: "원수학 2026년 5월 중2-2 기본반 편입테스트 공지 미러",
      url: "https://www.gangmom.kr/news/69f44076d692cfc9fdcc7a89",
      grade: "B",
      publishedAt: "2026-05",
      checkedAt: "2026-08-24"
    },
    "WM-M22-SEP-2026": {
      title: "원수학 2026년 9월 중2-2 기본반 편입테스트 수정 공지 미러",
      url: "https://www.gangmom.kr/news/6a753c571042abe5f053b14c",
      grade: "B",
      publishedAt: "2026-08",
      checkedAt: "2026-08-24"
    },
    "WM-M31-JULY-2026": {
      title: "원수학 2026년 7월 중3-1 기본반 편입테스트 공지 미러",
      url: "https://www.gangmom.kr/news/6a223d6f68333f66b83edc56",
      grade: "B",
      publishedAt: "2026-06",
      checkedAt: "2026-08-24"
    },
    "WM-M32-JUNE-2026": {
      title: "원수학 2026년 6월 중3-2 기본반 편입테스트 공지 미러",
      url: "https://www.gangmom.kr/news/69f440a415f0dadc06b9df6c",
      grade: "B",
      publishedAt: "2026-05",
      checkedAt: "2026-08-24"
    },
    "WM-MIDDLE-QA-2026-08": {
      title: "원수학 중등과정 자주 묻는 질문 공지 미러",
      url: "https://www.gangmom.kr/news/6a753cb21042abe5f053b2c6",
      grade: "B",
      publishedAt: "2026-08",
      checkedAt: "2026-08-24"
    },
    "WM-HIGH-DUAL-JULY-2026": {
      title: "원수학 2026년 7월 실력공수1,2 듀얼반 편입 공지 미러",
      url: "https://www.gangmom.kr/news/6a223d0d68333f66b83ed99a",
      grade: "B",
      publishedAt: "2026-06",
      checkedAt: "2026-08-24"
    },
    "DG-SCOPE-MIRROR": {
      title: "깊은생각 예비고1 입학테스트 범위 공지 미러",
      url: "https://www.gangmom.kr/news/6902cf1da52af7ec2ec7f57b",
      grade: "B",
      publishedAt: "2025-10",
      checkedAt: "2026-08-22"
    },
    "ED-2025-INDEPENDENT": {
      title: "이든수학 고등과정 운영 독립 정리",
      url: "https://dcsky.kincoding.com/entry/%EB%8B%A8%EB%8B%A8%ED%95%9C-%EA%B3%A0%EB%93%B1-%EC%88%98%ED%95%99-%EC%84%A0%ED%96%89-%EC%9B%90%EC%88%98%ED%95%99%EA%B3%BC-%EC%9D%B4%EB%93%A0%EC%88%98%ED%95%99?category=1155747",
      grade: "C",
      publishedAt: "2025-03-15",
      checkedAt: "2026-08-22"
    },
    "ED-HIGH-REVIEW-YT": {
      title: "이든수학 고등과정과 황소 고등과정 비교 후기 영상",
      url: "https://www.youtube.com/watch?v=g1b5jDkWTtw",
      grade: "C",
      publishedAt: null,
      checkedAt: "2026-08-24"
    }
  };

  const profiles = [
    {
      code: "SH",
      publicName: "생각하는황소 고등 선발",
      eyebrow: "중등 누적 선발",
      summary: "고등과정 입반을 목표로 중등 누적 심화 문제를 40문항 모의고사로 점검합니다.",
      facts: [
        { label: "현재 과정", value: "기본정석 Light · 기본정석 Plus · 실력정석", state: "verified", sourceIds: ["SH-CURRICULUM-OFFICIAL", "SH-REFORM-OFFICIAL"] },
        { label: "현행 과목", value: "공통수학1·2 병렬 운영", state: "verified", sourceIds: ["SH-CURRICULUM-OFFICIAL"] },
        { label: "우리 판매용 모의고사", value: "중등 누적 40문항 · 110분", state: "confirmed", sourceIds: [] },
        { label: "공개 시간 사례", value: "고등과정 입학시험 110분", state: "verified", sourceIds: ["SH-SONGPA-2025-08-MIRROR"] },
        { label: "개편 전 교재 후기", value: "상·하 본교재 + 홀짝 숙제교재 6권 · 첨삭 미션·보충 프린트", state: "observed", sourceIds: [] },
        { label: "개편 전 퀵테스트 후기", value: "서술형 2문항 · 10점 · 부분점수", state: "observed", sourceIds: [] }
      ],
      cutline: {
        state: "verified",
        display: "실력정석 70 · Plus 50 · Light 30점",
        context: "위례점 · 2026년 6월 고등과정 시작반 공개 결과",
        branch: "위례점",
        course: "고등과정 시작반",
        round: "2026-06",
        sourceIds: ["SH-WIRYE-2026-06-MIRROR"]
      },
      style: "중등 수·식, 함수·좌표, 평면·입체도형, 경우의 수·확률을 한 회차에 누적 배치합니다.",
      caveat: "우리 제작·보유 시험지를 기준으로 하며 공식 기출로 표시하지 않습니다. 110분은 우리 판매용 모의고사 운영 설정이고, 외부 공개 사례와 지점·회차별 커트라인은 별도 참고 근거로 관리합니다. 과거 기본정석 교재 6권과 퀵테스트 후기는 2026년 교재 개편 전 자료이므로 현행 교재 안내에 쓰지 않습니다."
    },
    {
      code: "DP",
      publicName: "돌파수학 입학·편입 대비",
      eyebrow: "30문항 누적형",
      summary: "지원 과정에 맞춰 중1 입학 선수 과정과 공통수학1 입학·편입을 분리해 준비합니다.",
      facts: [
        { label: "중1 입학 관찰 사례", value: "초5-1~초6-2 누적 · 30문항 · 2/3/4점", state: "observed", sourceIds: [] },
        { label: "예비중1 성적표 사례", value: "공통수학1 기본 · 30문항 · 60점 컷", state: "observed", sourceIds: [] },
        { label: "공개 범위 사례", value: "공통수학1 기본 전범위", state: "verified", sourceIds: ["DP-ENTRY-MIRROR"] },
        { label: "공개 규격 사례", value: "30문항 · 150분 · 20문항 기준", state: "verified", sourceIds: ["DP-ENTRY-MIRROR"] },
        { label: "중간반 대표 준비 범위", value: "중1-1~중2-1 전 범위(일차함수까지)", state: "confirmed", sourceIds: [] },
        { label: "원본 시험지 범위", value: "전 범위형과 중간 단원 종료형을 시험지별로 따로 기록", state: "confirmed", sourceIds: [] },
        { label: "공통수학1 입반 준비 범위", value: "중2-1~중3-2", state: "verified", sourceIds: ["DP-TIMETABLE-OFFICIAL-2026-09"] },
        { label: "실출제 경향", value: "후반 변별형·조건 분기·그래프/조합 결합", state: "observed", sourceIds: [] }
      ],
      cutline: {
        state: "verified",
        display: "20 / 30문항",
        context: "대치 · 2026년 공통수학2 기본반 입학 · 공통수학1 기본 전범위",
        branch: "대치",
        course: "공통수학2 기본반 입학",
        round: "2026-08-14 공지",
        sourceIds: ["DP-ENTRY-MIRROR"]
      },
      style: "초반 기본 정확도와 후반 복합 조건을 함께 보며, 공통수학1 실출제 원본은 별도 프로필로 관리합니다.",
      caveat: "공개 수치는 2026년 특정 지점·반 공지 기준입니다. 원본 시험지는 문항 원천으로 보존하되, 현재 지원 과정의 범위 밖 문항과 원본이 아닌 대체 문항은 새 시험 구성에서 제외합니다."
    },
    {
      code: "WM",
      publicName: "원수학 입학테스트 대비",
      eyebrow: "대수·기하 분리 평가",
      summary: "중2-1 기본반 신입과 공통수학1 기본반 입학의 서로 다른 대수·기하 평가 구조를 분리해 반영합니다.",
      facts: [
        { label: "중등과정", value: "중2·중3 각 기본 2+2개월 뒤 심화듀얼 2.5개월", state: "verified", sourceIds: ["WM-MIDDLE-LAUNCH-2025", "WM-MIDDLE-QA-2026-08"] },
        { label: "기본반 목적", value: "해당 학기를 처음 배우거나 개념을 처음부터 재정비", state: "verified", sourceIds: ["WM-M31-JULY-2026"] },
        { label: "중2-1 기본반 현행 구조", value: "중1 대수 20 + 중1 기하 20 · 각 50분 · 통계 제외", state: "verified", sourceIds: ["WM-M21-JULY-2026"] },
        { label: "공수1 결과분석 사례", value: "중등대수 30 + 중등 기하·종합 30 · 문항별 유형표", state: "observed", sourceIds: [] },
        { label: "중2-1 최신 전형 창", value: "2026년 7월 공지 기준 120분", state: "verified", sourceIds: ["WM-M21-JULY-2026"] },
        { label: "중2-1 공지 변경 이력", value: "최초 25+25 공지 후 같은 전형을 20+20으로 정정", state: "verified", sourceIds: ["WM-M21-INITIAL-2025", "WM-M21-CHANGE-2025"] },
        { label: "2025 공수1 난이도 후기", value: "대수·기하 25+25 · 극심화보다 심화 문제의 정확도 중심", state: "observed", sourceIds: ["WM-ENTRY-2025-REVIEW"] },
        { label: "중2-2 편입 개편", value: "2026년 5월 45문항에서 9월 50문항으로 변경", state: "verified", sourceIds: ["WM-M22-MAY-2026", "WM-M22-SEP-2026"] },
        { label: "고등 듀얼 분리", value: "실력공수1,2 듀얼은 공수1·2 기본 이수 뒤의 별도 고등과정", state: "verified", sourceIds: ["WM-HIGH-DUAL-JULY-2026"] }
      ],
      cutline: {
        state: "verified",
        display: "28 / 40문항 · 대수 13미만/기하 12미만 과락 · 25이상 풀이 검토",
        context: "대치 · 2026년 7월 중2-1 기본반 신입",
        branch: "대치",
        course: "중2-1 기본반 신입",
        round: "2026-07",
        sourceIds: ["WM-M21-JULY-2026"]
      },
      roundProfiles: [
        { id: "WM-CM1-BASIC-ENTRY-2025-09", course: "공통수학1 기본 입학", round: "2025-09", questionCount: 50, sectionCounts: [25, 25], sectionMinutes: [90, 90], minimum: 35, sectionMinimums: [17, 15], reviewFrom: 32, state: "verified", sourceIds: ["WM-ENTRY-2025-MIRROR", "WM-ENTRY-2025-REVIEW"] },
        { id: "WM-M21-BASIC-ENTRY-2026-07", course: "중2-1 기본 신입", round: "2026-07", questionCount: 40, sectionCounts: [20, 20], sectionMinutes: [50, 50], minimum: 28, sectionMinimums: [13, 12], reviewFrom: 25, state: "verified", sourceIds: ["WM-M21-JULY-2026"] },
        { id: "WM-M22-BASIC-TRANSFER-2026-05", course: "중2-2 기본 편입", round: "2026-05", questionCount: 45, sectionCounts: [25, 20], sectionMinutes: [70, 50], minimum: 32, sectionMinimums: [15, 13], reviewFrom: 28, state: "superseded", sourceIds: ["WM-M22-MAY-2026"] },
        { id: "WM-M22-BASIC-TRANSFER-2026-09", course: "중2-2 기본 편입", round: "2026-09", questionCount: 50, sectionCounts: [25, 25], sectionMinutes: [70, 70], minimum: 35, sectionMinimums: [17, 15], reviewFrom: 32, state: "verified", sourceIds: ["WM-M22-SEP-2026"] },
        { id: "WM-M31-BASIC-TRANSFER-2026-07", course: "중3-1 기본 편입", round: "2026-07", questionCount: 50, sectionCounts: [25, 25], sectionMinutes: [70, 70], minimum: 35, sectionMinimums: [17, 15], reviewFrom: 32, state: "verified", sourceIds: ["WM-M31-JULY-2026"] },
        { id: "WM-M32-BASIC-TRANSFER-2026-06", course: "중3-2 기본 편입", round: "2026-06", questionCount: 50, sectionCounts: [25, 25], sectionMinutes: [70, 70], minimum: 35, sectionMinimums: [17, 15], reviewFrom: 32, state: "superseded", sourceIds: ["WM-M32-JUNE-2026", "WM-M31-JULY-2026"] }
      ],
      style: "대수와 기하를 따로 진단하고 전체 점수뿐 아니라 영역별 누적 공백과 시간 안배를 설명합니다.",
      caveat: "모든 수치는 과정·회차별 참고 기준이며 자동 합격 판정에는 쓰지 않습니다. 중등 심화듀얼과 고등 실력공수 듀얼을 섞지 않고, 2026년 6월 중3-2 편입 사례는 7월의 편입 중단 정책으로 대체된 이력으로 표시합니다."
    },
    {
      code: "ED",
      publicName: "이든수학 입학테스트 대비",
      eyebrow: "학년·학기 누적형",
      summary: "중1 시작반과 고등선행 지원 과정에 맞춰 학년·학기별 누적 상태를 분리 진단합니다.",
      facts: [
        { label: "중1 시작 관찰 사례", value: "초5 12 + 초6 18, 총 30문항", state: "observed", sourceIds: [] },
        { label: "고등선행 관찰 사례", value: "2-1·3-1·2-2·3-2, 총 30문항", state: "observed", sourceIds: [] },
        { label: "공개 과거 운영 사례", value: "서술형 30문항 · 100분", state: "observed", sourceIds: ["ED-2025-INDEPENDENT"] },
        { label: "고등 수업 후기 사례", value: "주2회 4시간 + 토요일 의무 클리닉 2시간", state: "observed", sourceIds: ["ED-HIGH-REVIEW-YT"] },
        { label: "누적·총괄평가 후기", value: "매시간 누적 20문항 · 실력과정 총괄 3회(각 20점)", state: "observed", sourceIds: ["ED-HIGH-REVIEW-YT"] },
        { label: "재원 총괄평가 후기 기준", value: "총 42점 이상 + 최소 2회 14점 이상", state: "observed", sourceIds: ["ED-HIGH-REVIEW-YT"] },
        { label: "고등 교재 후기 사례", value: "학원 개념노트·정석 워크북·쎈·기본 수학의 정석", state: "observed", sourceIds: ["ED-HIGH-REVIEW-YT"] },
        { label: "합격 기준", value: "최신 공식 기준 확인 필요", state: "needs-review", sourceIds: [] }
      ],
      cutline: {
        state: "needs-review",
        display: "확인 필요",
        context: "익명 결과의 20/30·17/30 불합격은 관찰값이며 커트라인이 아닙니다.",
        branch: null,
        course: null,
        round: null,
        sourceIds: []
      },
      style: "문항 수가 다른 학기끼리는 정답 개수가 아니라 분모를 포함한 수행률로 비교합니다.",
      caveat: "익명 결과 문자는 시험 분포 근거일 뿐 일반 커트라인 근거가 아닙니다. 42점·14점 기준은 개인 후기에서 설명한 재원 중 실력과정 총괄평가 기준이며 입학 커트라인이나 현행 공식 규정으로 사용하지 않습니다."
    },
    {
      code: "DG",
      publicName: "깊은생각 입학테스트 대비",
      eyebrow: "중3 심화·고등 누적",
      summary: "예비고1 공개 범위에 맞춰 중3-1, 공통수학1, 공통수학2 도형의 방정식까지 점검합니다.",
      facts: [
        { label: "공개 범위 사례", value: "중3-1 + 공통수학1 전범위 + 공통수학2 도형의 방정식", state: "verified", sourceIds: ["DG-SCOPE-MIRROR"] },
        { label: "강조 유형", value: "이차함수·여러 가지 부등식의 연결", state: "observed", sourceIds: [] },
        { label: "문항·커트", value: "공식 최신 기준 확인 필요", state: "needs-review", sourceIds: [] }
      ],
      cutline: {
        state: "needs-review",
        display: "확인 필요",
        context: "대치 본원·지원 레벨·시험 회차가 일치하는 공식 판정 규칙이 필요합니다.",
        branch: null,
        course: null,
        round: null,
        sourceIds: []
      },
      style: "단원별 단순 완주보다 이차함수와 부등식처럼 여러 과정을 연결하는 고난도 문항을 강화합니다.",
      caveat: "지점·레벨별 차이가 크므로 공개 범위 외 문항 수와 커트라인은 확정하지 않습니다."
    },
    {
      code: "SM",
      publicName: "생수수학 추천문제 대비",
      eyebrow: "공통수학2 샘플 기반",
      summary: "제공받은 공통수학2 기본 입반 샘플을 회차별로 감사해 유형과 난도를 정리합니다.",
      facts: [
        { label: "보유 샘플", value: "중복 제외 3회", state: "observed", sourceIds: [] },
        { label: "확인 규격", value: "회차별 30문항·답안/해설 구간", state: "observed", sourceIds: [] },
        { label: "공식 시험 규정", value: "정확한 상품명·시간·커트 확인 필요", state: "needs-review", sourceIds: [] }
      ],
      cutline: {
        state: "needs-review",
        display: "확인 필요",
        context: "공식 상품명·지점·과정·회차가 확인되기 전에는 합격선을 표시하지 않습니다.",
        branch: null,
        course: null,
        round: null,
        sourceIds: []
      },
      style: "샘플 원문을 현행 교육과정의 대단원·소단원·세부유형으로 다시 분류합니다.",
      caveat: "공식 학원 공지를 확인하기 전에는 샘플 기반 추천 모드로만 표시합니다."
    }
  ];

  root.HIGHSELECT_PUBLIC_PROFILES = {
    updatedAt: "2026-08-24",
    evidencePolicy: "A=공식 원문, B=공식 게시물 미러, C=독립 정리, 관찰=사용자 제공 원본/익명 결과, 운영 확정=우리 모의고사 설정. 외부 수치는 해당 회차에만 적용.",
    sources,
    profiles
  };
})(typeof window !== "undefined" ? window : globalThis);
