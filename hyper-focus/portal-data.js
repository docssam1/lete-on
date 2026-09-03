/* Hyper Focus 포털 공개 카탈로그.
 * 학생별 승인번호와 권한은 data.js에서, 공개 상품 설명은 이 파일에서 관리합니다.
 */
window.GFIELD_HF_PORTAL = {
  version: "2026-08-23",
  applicationUrl: "https://naver.me/xy7bsjyb",
  consultationUrl: "https://open.kakao.com/me/gfield",
  products: [
    {
      key: "hyperfocus",
      order: "01",
      eyebrow: "54 TYPE DIAGNOSIS",
      title: "Hyper Focus\n문항 진단",
      shortTitle: "하이퍼 포커스",
      description: "54개 필수 유형을 진단하고 약점 유형별 맞춤 시험지를 만듭니다.",
      permission: "hyperfocus",
      kind: "link",
      href: "./diagnosis.html",
      accent: "red",
      status: "운영 중"
    },
    {
      key: "mock",
      order: "02",
      eyebrow: "PREMIER MOCK EXAMS",
      title: "온라인\n모의고사",
      shortTitle: "온라인 모의고사",
      description: "회차를 선택해 응시하고 채점·유형 진단까지 한 흐름으로 확인합니다.",
      permission: "mock",
      kind: "collection",
      accent: "navy",
      status: "15회 비공개 연결",
      groups: [
        { key: "utilization", label: "활용 모의고사", count: 8, note: "1~8회", items: [] },
        { key: "final", label: "파이널 모의고사", count: 3, note: "1~3회", items: [] },
        { key: "last", label: "최종 모의고사", count: 4, note: "1~4회", items: [] }
      ]
    },
    {
      key: "vip",
      order: "03",
      eyebrow: "CURATED FOR MEMBERS",
      title: "VIP\n라운지",
      shortTitle: "VIP 라운지",
      description: "자료실·프리미엄 설명회·DOCSSAM 칼럼·교육 매거진을 연결해 봅니다.",
      permission: "vip",
      kind: "link",
      href: "./vip/",
      accent: "gold",
      status: "관리자 업로드 연결"
    },
    {
      key: "problem-bank",
      order: "04",
      eyebrow: "PERSONAL WORKSHEET",
      title: "맞춤\n문제 은행",
      shortTitle: "문제 은행",
      description: "선택한 유형과 난이도로 학생별 시험지를 자동 생성합니다.",
      permission: "problem-bank",
      kind: "link",
      href: "./diagnosis.html?section=similar",
      accent: "green",
      status: "54유형 · 난이도별 2문항"
    }
  ],
  vipSections: [
    { key: "resources", label: "자료실", description: "교재·워크시트·안내 자료" },
    { key: "seminar", label: "프리미엄 설명회", description: "설명회 영상과 연계 자료" },
    { key: "column", label: "DOCSSAM 칼럼", description: "학습 설계와 지도 칼럼" },
    { key: "magazine", label: "교육 매거진", description: "교육 이슈와 추천 콘텐츠" }
  ]
};
