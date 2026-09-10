/* Hyper Focus 포털 공개 카탈로그.
 * 학생별 승인번호와 권한은 data.js에서, 공개 상품 설명은 이 파일에서 관리합니다.
 */
window.GFIELD_HF_PORTAL = {
  version: "2026-08-23",
  applicationUrl: "https://naver.me/xy7bsjyb",
  consultationUrl: "https://open.kakao.com/me/gfield",
  entryBanners: [
    { key: "hyperfocus", title: "하이퍼 포커스", href: "./diagnosis.html", permission: "hyperfocus" },
    { key: "premier-mock", title: "프리미어 모의고사", productKey: "mock", permission: "mock" },
    { key: "challenge", title: "챌린지 대비", subtitle: "2026년 9월 챌린지 대비", href: "./challenge/", parent: "hyperfocus", permissionMode: "challenge-granular", releaseStatus: "private-delivery-ready" }
  ],
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
      title: "프리미어\n모의고사",
      shortTitle: "프리미어 모의고사",
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
      key: "challenge",
      order: "03",
      eyebrow: "SEPTEMBER CHALLENGE",
      title: "2026년 9월\n챌린지 대비",
      shortTitle: "2026년 9월 챌린지 대비",
      description: "개념 문제은행과 온라인 모의고사 4회로 챌린지를 준비합니다.",
      permission: "challenge-granular",
      permissionMode: "challenge-granular",
      kind: "link",
      href: "./challenge/",
      accent: "green",
      status: "개념 문제은행 · 온라인 모의고사"
    },
    {
      key: "vip",
      order: "04",
      eyebrow: "CURATED FOR MEMBERS",
      title: "VIP\n라운지",
      shortTitle: "VIP 라운지",
      description: "황소 대비 핵심 자료·프리미엄 설명회·DOCSSAM 칼럼·교육 매거진을 한곳에서 봅니다.",
      permission: "vip",
      kind: "link",
      href: "./vip/",
      accent: "gold",
      status: "VIP 전용 콘텐츠"
    }
  ],
  vipSections: [
    { key: "resources", label: "자료실", description: "교재·워크시트·안내 자료" },
    { key: "seminar", label: "프리미엄 설명회", description: "설명회 영상과 연계 자료" },
    { key: "column", label: "DOCSSAM 칼럼", description: "학습 설계와 지도 칼럼" },
    { key: "magazine", label: "교육 매거진", description: "교육 이슈와 추천 콘텐츠" }
  ]
};
