// GW_GEN 분류 애드온 — 쌓기나무 유형의 대영역·소영역·세부유형.
//
// WHY 별도 파일: 분류표는 generators.js의 TYPES 배열에 기대는 순수 데이터라
// 그 파일 안에 두어도 동작은 같다. 그런데 generators.js는 이미 150KB가 넘어
// 배포 경로에서 한 번에 전송되지 않는 크기라, 분류를 고칠 때마다 생성기
// 본문 전체를 다시 실어 보내야 한다. 분류축(무엇을 연습하는가)은 생성기
// 본문(어떻게 문제를 만드는가)과 바뀌는 이유가 전혀 다르므로, 파일을 나눠도
// 응집도가 떨어지지 않는다 — 오히려 생성기 코드를 건드리지 않고 분류만
// 바꿀 수 있어 학습지 결과가 바뀌지 않는다는 점을 눈으로 확인하기 쉽다.
//
// 로드 순서: generators.js 다음. window.GW_GEN이 없으면 바로 죽는다 —
// 순서를 잘못 쓴 페이지가 "분류가 그냥 안 보이는" 상태로 조용히 출시되는
// 것을 막는다. 이 파일은 DOM을 건드리지 않아 node에서도 그대로 불린다
// (taxonomy.selftest.mjs).
(function (global) {
  "use strict";

  const GEN = global.GW_GEN;
  if (!GEN) {
    throw new Error("taxonomy.js: GW_GEN이 먼저 로드되어야 한다 (generators.js 다음에 놓을 것)");
  }
  const TYPES = GEN.TYPES;
  const typeInfo = GEN.typeInfo;

  // ---------------------------------------------------------------------
  // 대영역·소영역·세부유형 분류 (taxonomy) — theme(그림 렌더링 계열: 표지
  // 색·캐릭터를 정하는 축)과는 다른, "학생이 무엇을 연습하는가"를 가리키는
  // 별도 축이다. 난이도(강도 1/2/3)와도 완전히 독립이다 — 같은 세부유형이
  // 난이도 1~3을 모두 만들 수 있어야 하고(각 생성기는 그대로 (rng, level,
  // intensity)만 받는다), 이 분류는 난이도 숫자를 전혀 참조하지 않는다.
  //
  //   대영역(domain) — 입체 / 평면 / 변환 / 측정 / 규칙 중 하나. 생성기가
  //     만드는 19개 유형은 전부 쌓기나무 소재라 대부분 "입체"이지만, SQ(쌓기
  //     나무 규칙 찾기)만은 예외다. SQ가 묻는 것은 "쌓기나무를 세는 방법"이
  //     아니라 "모양이 늘어나는 규칙을 읽는 방법"이라 매체(쌓기나무·평면
  //     도형 등)와 무관한 대영역 "규칙"에 속한다고 보는 편이 더 정확하다.
  //     나머지 18개는 모두 같은 쌓기나무 입체를 보고/세고/조립/색칠하는
  //     문제이므로 "입체" 하나로 묶는다 — 억지로 여러 대영역에 나눠 담지
  //     않는다.
  //   소영역(area) — 대영역 안의 활동 묶음. docs/14_STAGE_DIFFICULTY_PROFILE.md
  //     4절 "유형별 시작 단계" 표가 이미 유형들을 이 다섯 묶음으로 서술하고
  //     있어(여러 방향에서 본 모양 / 직접 세기·숨은 개수·비교 / 상자 채우기·
  //     정육면체 완성 / 한 개 옮기기·합치기·불가능한 입체·조각 찾기 / 색칠·
  //     흑백·구멍) 그 서술을 그대로 소영역 이름으로 옮겼다. "조각과 재구성"만
  //     이 파일에서 새로 붙인 이름이다 — MV·CJ·CP·PS 네 유형은 상자 채우기나
  //     단순 개수 세기 어디에도 억지로 들어가지 않는, 조각을 옮기거나
  //     합치거나 맞춰 보는 같은 결의 문제라 별도 소영역으로 남긴다.
  //   세부유형(type) — 지금까지의 label이 곧 세부유형 이름이다. 새로 만들지
  //     않는다.
  const DOMAIN_SOLID_3D = "입체";
  const DOMAIN_RULE = "규칙";

  const AREA_VIEWS = "바탕그림";
  const AREA_COUNT = "개수 세기";
  const AREA_BOX = "상자와 완성";
  const AREA_PIECES = "조각과 재구성";
  const AREA_PAINT = "색칠과 무늬";
  const AREA_CUBE_RULE = "쌓기나무 규칙";

  // 화면에 보여 줄 대영역·소영역 순서의 유일한 근거. TYPES 배열 자체의 순서는
  // (옛 학습지 코드 호환을 위해) 그대로 두므로 이 목록과 다를 수 있다.
  const TAXONOMY_ORDER = [
    { domain: DOMAIN_SOLID_3D, areas: [AREA_VIEWS, AREA_COUNT, AREA_BOX, AREA_PIECES, AREA_PAINT] },
    { domain: DOMAIN_RULE, areas: [AREA_CUBE_RULE] }
  ];

  const TYPE_TAXONOMY = {
    TC: { domain: DOMAIN_SOLID_3D, area: AREA_VIEWS },
    VC: { domain: DOMAIN_SOLID_3D, area: AREA_VIEWS },
    VM: { domain: DOMAIN_SOLID_3D, area: AREA_VIEWS },
    VP: { domain: DOMAIN_SOLID_3D, area: AREA_VIEWS },
    IC: { domain: DOMAIN_SOLID_3D, area: AREA_COUNT },
    IH: { domain: DOMAIN_SOLID_3D, area: AREA_COUNT },
    IN: { domain: DOMAIN_SOLID_3D, area: AREA_COUNT },
    CO: { domain: DOMAIN_SOLID_3D, area: AREA_COUNT },
    HC: { domain: DOMAIN_SOLID_3D, area: AREA_COUNT },
    FB: { domain: DOMAIN_SOLID_3D, area: AREA_BOX },
    CU: { domain: DOMAIN_SOLID_3D, area: AREA_BOX },
    MV: { domain: DOMAIN_SOLID_3D, area: AREA_PIECES },
    CJ: { domain: DOMAIN_SOLID_3D, area: AREA_PIECES },
    CP: { domain: DOMAIN_SOLID_3D, area: AREA_PIECES },
    PS: { domain: DOMAIN_SOLID_3D, area: AREA_PIECES },
    PN: { domain: DOMAIN_SOLID_3D, area: AREA_PAINT },
    BW: { domain: DOMAIN_SOLID_3D, area: AREA_PAINT },
    HL: { domain: DOMAIN_SOLID_3D, area: AREA_PAINT },
    SQ: { domain: DOMAIN_RULE, area: AREA_CUBE_RULE }
  };

  // TYPES 항목마다 domain·area를 붙인다. theme는 그대로 둔 채 새 필드만
  // 더하므로 기존 theme 소비자(themeForTypes 등)는 바뀌지 않는다. 분류가
  // 빠진 유형이 하나라도 있으면 바로 죽어서, 유형을 추가하고 taxonomy를
  // 잊는 실수를 이 자리에서 막는다.
  TYPES.forEach((t) => {
    const tax = TYPE_TAXONOMY[t.code];
    if (!tax) throw new Error("GW_GEN: type " + t.code + " has no domain/area taxonomy entry");
    t.domain = tax.domain;
    t.area = tax.area;
  });

  function domains() {
    return TAXONOMY_ORDER.map((d) => d.domain);
  }

  function areasOf(domain) {
    const entry = TAXONOMY_ORDER.filter((d) => d.domain === domain)[0];
    return entry ? entry.areas.slice() : [];
  }

  function typesOf(domain, area) {
    return TYPES.filter((t) => t.domain === domain && (area === undefined || area === null || t.area === area))
      .map((t) => t.code);
  }

  function taxonomyOf(code) {
    const info = typeInfo(code);
    if (!info) return null;
    return { code: info.code, domain: info.domain, area: info.area, type: info.label };
  }

  // 생성기 쪽 API에 그대로 얹는다 — 호출하는 화면은 이 함수들이 어느 파일에서
  // 왔는지 알 필요가 없다.
  GEN.domains = domains;
  GEN.areasOf = areasOf;
  GEN.typesOf = typesOf;
  GEN.taxonomyOf = taxonomyOf;
})(typeof window !== "undefined" ? window : globalThis);
