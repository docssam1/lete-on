// 생물과 환경 — 교과 연결 사고력 수업·교재(기본 수업 틀). scripts/gen-science-think-c22s42u02.mjs 가 만든다.
// 예전 탐구 기록 앱(활동 기록·보고서)은 선택 기능으로 옮겼다 — data/units/c22-s42-u02.records.js · #/c22-s42-u02/records
export const art = {
  "opener": "<figure class=\"bk-photo bk-render\"><img src=\"../assets/book/c22-s42-u02-md-hero.webp\" alt=\"풀밭 먹이 관계 — 풀이 자란 타원 풀밭에 토끼와 여우가 사는 3D 모형\" width=\"1800\" height=\"820\"></figure>",
  "step1": "<figure class=\"bk-photo bk-render\"><img src=\"../assets/book/c22-s42-u02-md-start.webp\" alt=\"풀밭 모형 — 풀 60포기, 토끼 12마리, 여우 3마리\" width=\"1280\" height=\"600\"></figure>",
  "row": "<figure class=\"bk-photo bk-render\"><img src=\"../assets/book/c22-s42-u02-md-row.webp\" alt=\"3년 뒤 비교 — 그대로인 풀밭과 여우가 사라진 풀밭\" width=\"1500\" height=\"720\"></figure>",
  "step2": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 220\" role=\"img\" aria-label=\"먹이 사슬: 풀 → 토끼 → 여우. 화살표는 먹히는 쪽에서 먹는 쪽을 향해요.\" font-family=\"Pretendard, sans-serif\"><defs><marker id=\"ca\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0 L10 5 L0 10z\" fill=\"#3d8a35\"/></marker></defs>\n    <rect width=\"640\" height=\"220\" rx=\"16\" fill=\"#fff\"/><text x=\"24\" y=\"40\" font-size=\"22\" font-weight=\"800\" fill=\"#1f2a44\">먹이 사슬 · 화살표는 먹히는 쪽 → 먹는 쪽</text>\n    <g transform=\"translate(40 80)\"><rect width=\"140\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#3d8a35\" stroke-width=\"2.5\"/><text x=\"70\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#3d8a35\" text-anchor=\"middle\">풀</text><text x=\"70\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">생산자</text></g><g transform=\"translate(250 80)\"><rect width=\"140\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#8a6a3a\" stroke-width=\"2.5\"/><text x=\"70\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#8a6a3a\" text-anchor=\"middle\">토끼</text><text x=\"70\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">소비자</text></g><g transform=\"translate(460 80)\"><rect width=\"140\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#c2581c\" stroke-width=\"2.5\"/><text x=\"70\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#c2581c\" text-anchor=\"middle\">여우</text><text x=\"70\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">소비자</text></g>\n    <path d=\"M186 117 H242\" stroke=\"#3d8a35\" stroke-width=\"4\" marker-end=\"url(#ca)\"/><path d=\"M396 117 H452\" stroke=\"#3d8a35\" stroke-width=\"4\" marker-end=\"url(#ca)\"/>\n    <text x=\"214\" y=\"182\" font-size=\"15\" fill=\"#5b6577\" text-anchor=\"middle\">토끼가 풀을 먹어요</text><text x=\"424\" y=\"182\" font-size=\"15\" fill=\"#5b6577\" text-anchor=\"middle\">여우가 토끼를 먹어요</text></svg>",
  "step3": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 220\" role=\"img\" aria-label=\"바꿀 것 네 가지: 그대로(비교의 기준), 여우가 사라짐, 토끼가 사라짐, 풀이 줄어듦(가뭄) — 한 번에 하나만 바꿔요.\" font-family=\"Pretendard, sans-serif\">\n    <rect width=\"640\" height=\"220\" rx=\"16\" fill=\"#fff\"/><text x=\"24\" y=\"40\" font-size=\"22\" font-weight=\"800\" fill=\"#1f2a44\">한 번에 하나만 바꾸기 · 3년 지켜보기</text>\n    <g transform=\"translate(20 74)\"><rect width=\"142\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#1f2a44\" stroke-width=\"2.5\"/><text x=\"71\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#1f2a44\" text-anchor=\"middle\">그대로</text><text x=\"71\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">비교의 기준</text></g><g transform=\"translate(172 74)\"><rect width=\"142\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#3d8a35\" stroke-width=\"2.5\"/><text x=\"71\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#3d8a35\" text-anchor=\"middle\">여우가 사라짐</text><text x=\"71\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">?</text></g><g transform=\"translate(324 74)\"><rect width=\"142\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#3d8a35\" stroke-width=\"2.5\"/><text x=\"71\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#3d8a35\" text-anchor=\"middle\">토끼가 사라짐</text><text x=\"71\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">?</text></g><g transform=\"translate(476 74)\"><rect width=\"142\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#3d8a35\" stroke-width=\"2.5\"/><text x=\"71\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#3d8a35\" text-anchor=\"middle\">풀이 줄어듦(가뭄)</text><text x=\"71\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">?</text></g>\n    <text x=\"320\" y=\"196\" font-size=\"15\" fill=\"#5b6577\" text-anchor=\"middle\">처음 수(풀 60·토끼 12·여우 3)와 기간(3년)은 늘 같게 해요</text></svg>",
  "step4": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 230\" role=\"img\" aria-label=\"기록표: 바꾼 것, 3년 뒤 풀·토끼·여우의 수, 그대로와 비교해 늘었는지 줄었는지를 적는 빈 표\" font-family=\"Pretendard, sans-serif\">\n    <rect width=\"640\" height=\"230\" rx=\"16\" fill=\"#fff\"/><text x=\"24\" y=\"40\" font-size=\"22\" font-weight=\"800\" fill=\"#1f2a44\">3년 뒤의 수를 적고 「그대로」와 비교하기</text>\n    <rect x=\"24\" y=\"60\" width=\"150\" height=\"38\" fill=\"#eef6e8\" stroke=\"#b9cfae\"/><text x=\"99\" y=\"85\" font-size=\"16\" font-weight=\"800\" fill=\"#2c4a1f\" text-anchor=\"middle\">바꾼 것</text><rect x=\"174\" y=\"60\" width=\"90\" height=\"38\" fill=\"#eef6e8\" stroke=\"#b9cfae\"/><text x=\"219\" y=\"85\" font-size=\"16\" font-weight=\"800\" fill=\"#2c4a1f\" text-anchor=\"middle\">풀</text><rect x=\"264\" y=\"60\" width=\"90\" height=\"38\" fill=\"#eef6e8\" stroke=\"#b9cfae\"/><text x=\"309\" y=\"85\" font-size=\"16\" font-weight=\"800\" fill=\"#2c4a1f\" text-anchor=\"middle\">토끼</text><rect x=\"354\" y=\"60\" width=\"90\" height=\"38\" fill=\"#eef6e8\" stroke=\"#b9cfae\"/><text x=\"399\" y=\"85\" font-size=\"16\" font-weight=\"800\" fill=\"#2c4a1f\" text-anchor=\"middle\">여우</text><rect x=\"444\" y=\"60\" width=\"172\" height=\"38\" fill=\"#eef6e8\" stroke=\"#b9cfae\"/><text x=\"530\" y=\"85\" font-size=\"16\" font-weight=\"800\" fill=\"#2c4a1f\" text-anchor=\"middle\">늘었나·줄었나</text>\n    <rect x=\"24\" y=\"98\" width=\"150\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><text x=\"99\" y=\"123\" font-size=\"15\" fill=\"#1f2a44\" text-anchor=\"middle\">그대로</text><rect x=\"174\" y=\"98\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"264\" y=\"98\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"354\" y=\"98\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"444\" y=\"98\" width=\"172\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"24\" y=\"136\" width=\"150\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><text x=\"99\" y=\"161\" font-size=\"15\" fill=\"#1f2a44\" text-anchor=\"middle\">여우가 사라짐</text><rect x=\"174\" y=\"136\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"264\" y=\"136\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"354\" y=\"136\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"444\" y=\"136\" width=\"172\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"24\" y=\"174\" width=\"150\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><text x=\"99\" y=\"199\" font-size=\"15\" fill=\"#1f2a44\" text-anchor=\"middle\">토끼가 사라짐</text><rect x=\"174\" y=\"174\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"264\" y=\"174\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"354\" y=\"174\" width=\"90\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/><rect x=\"444\" y=\"174\" width=\"172\" height=\"38\" fill=\"#fff\" stroke=\"#d6e2cf\"/></svg>",
  "roles": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 250\" role=\"img\" aria-label=\"생산자(풀) → 소비자(토끼·여우) → 분해자(곰팡이·세균)가 죽은 생물을 분해해 양분이 흙으로 돌아가 다시 풀이 자라요.\" font-family=\"Pretendard, sans-serif\"><defs><marker id=\"ra\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0 L10 5 L0 10z\" fill=\"#5b6577\"/></marker></defs>\n    <rect width=\"640\" height=\"250\" rx=\"16\" fill=\"#fff\"/><text x=\"24\" y=\"40\" font-size=\"22\" font-weight=\"800\" fill=\"#1f2a44\">생산자 · 소비자 · 분해자</text>\n    <g transform=\"translate(30 70)\"><rect width=\"170\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#3d8a35\" stroke-width=\"2.5\"/><text x=\"85\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#3d8a35\" text-anchor=\"middle\">생산자</text><text x=\"85\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">풀 · 나무</text></g><g transform=\"translate(235 70)\"><rect width=\"170\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#c2581c\" stroke-width=\"2.5\"/><text x=\"85\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#c2581c\" text-anchor=\"middle\">소비자</text><text x=\"85\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">토끼 · 여우</text></g><g transform=\"translate(440 70)\"><rect width=\"170\" height=\"74\" rx=\"14\" fill=\"#fff\" stroke=\"#7a5a3a\" stroke-width=\"2.5\"/><text x=\"85\" y=\"35\" font-size=\"20\" font-weight=\"800\" fill=\"#7a5a3a\" text-anchor=\"middle\">분해자</text><text x=\"85\" y=\"60\" font-size=\"14\" fill=\"#5b6577\" text-anchor=\"middle\">곰팡이 · 세균</text></g>\n    <path d=\"M206 107 H228\" stroke=\"#5b6577\" stroke-width=\"3.5\" marker-end=\"url(#ra)\"/><path d=\"M411 107 H433\" stroke=\"#5b6577\" stroke-width=\"3.5\" marker-end=\"url(#ra)\"/>\n    <path d=\"M525 150 C525 210 115 210 115 152\" fill=\"none\" stroke=\"#5b6577\" stroke-width=\"3\" stroke-dasharray=\"7 6\" marker-end=\"url(#ra)\"/>\n    <text x=\"320\" y=\"230\" font-size=\"15\" fill=\"#5b6577\" text-anchor=\"middle\">분해된 물질은 흙으로 돌아가 다시 풀이 자라는 데 쓰여요</text></svg>",
  "web": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 260\" role=\"img\" aria-label=\"먹이그물: 풀을 토끼와 들쥐가 먹고, 토끼와 들쥐를 여우와 매가 먹어요.\" font-family=\"Pretendard, sans-serif\"><defs><marker id=\"wa\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0 L10 5 L0 10z\" fill=\"#3d8a35\"/></marker></defs>\n    <rect width=\"640\" height=\"260\" rx=\"16\" fill=\"#fff\"/><text x=\"24\" y=\"40\" font-size=\"22\" font-weight=\"800\" fill=\"#1f2a44\">먹이그물 · 여러 사슬이 얽혀요</text>\n    <line x1=\"138.46424292014737\" y1=\"151.1527944199427\" x2=\"215.94372905060484\" y2=\"121.02188314698701\" stroke=\"#3d8a35\" stroke-width=\"3\" marker-end=\"url(#wa)\"/><line x1=\"140.76172712956554\" y1=\"181.28038380657011\" x2=\"213.38115050933072\" y2=\"197.41803344651794\" stroke=\"#3d8a35\" stroke-width=\"3\" marker-end=\"url(#wa)\"/><line x1=\"322\" y1=\"100\" x2=\"412\" y2=\"100\" stroke=\"#3d8a35\" stroke-width=\"3\" marker-end=\"url(#wa)\"/><line x1=\"315.56322725118565\" y1=\"184.9402250118479\" x2=\"419.1794772967545\" y2=\"127.95128748678505\" stroke=\"#3d8a35\" stroke-width=\"3\" marker-end=\"url(#wa)\"/><line x1=\"322\" y1=\"210\" x2=\"412\" y2=\"210\" stroke=\"#3d8a35\" stroke-width=\"3\" marker-end=\"url(#wa)\"/><line x1=\"315.56322725118565\" y1=\"125.0597749881521\" x2=\"419.1794772967545\" y2=\"182.04871251321495\" stroke=\"#3d8a35\" stroke-width=\"3\" marker-end=\"url(#wa)\"/>\n    <g><rect x=\"42\" y=\"148\" width=\"96\" height=\"44\" rx=\"12\" fill=\"#fff\" stroke=\"#3d8a35\" stroke-width=\"2.5\"/><text x=\"90\" y=\"177\" font-size=\"19\" font-weight=\"800\" fill=\"#1f2a44\" text-anchor=\"middle\">풀</text></g><g><rect x=\"222\" y=\"78\" width=\"96\" height=\"44\" rx=\"12\" fill=\"#fff\" stroke=\"#c2581c\" stroke-width=\"2.5\"/><text x=\"270\" y=\"107\" font-size=\"19\" font-weight=\"800\" fill=\"#1f2a44\" text-anchor=\"middle\">토끼</text></g><g><rect x=\"222\" y=\"188\" width=\"96\" height=\"44\" rx=\"12\" fill=\"#fff\" stroke=\"#c2581c\" stroke-width=\"2.5\"/><text x=\"270\" y=\"217\" font-size=\"19\" font-weight=\"800\" fill=\"#1f2a44\" text-anchor=\"middle\">들쥐</text></g><g><rect x=\"422\" y=\"78\" width=\"96\" height=\"44\" rx=\"12\" fill=\"#fff\" stroke=\"#c2581c\" stroke-width=\"2.5\"/><text x=\"470\" y=\"107\" font-size=\"19\" font-weight=\"800\" fill=\"#1f2a44\" text-anchor=\"middle\">여우</text></g><g><rect x=\"422\" y=\"188\" width=\"96\" height=\"44\" rx=\"12\" fill=\"#fff\" stroke=\"#c2581c\" stroke-width=\"2.5\"/><text x=\"470\" y=\"217\" font-size=\"19\" font-weight=\"800\" fill=\"#1f2a44\" text-anchor=\"middle\">매</text></g></svg>"
};
export const chapter = {
  "unit": "c22-s42-u02",
  "book": "지필드 실험 과학",
  "vol": "4-2",
  "no": 2,
  "title": "풀밭 먹이 관계 · 생물과 환경",
  "theme": "#3d8a35",
  "link": {
    "course": "4학년 2학기",
    "unit": "Ⅱ. 생물과 환경",
    "topics": [
      "생태계의 구성 요소",
      "생산자·소비자·분해자",
      "먹이 사슬과 먹이그물",
      "생태계 보전"
    ]
  },
  "skills": [
    "예상",
    "변인 통제",
    "관찰",
    "원인과 결과",
    "결론 도출"
  ],
  "wonderLate": true,
  "labTitle": "한 가지만 바꾸고 몇 해 동안 풀밭 지켜보기",
  "selfLink": "풀밭 실험 결과를 「한 생물이 사라지면 생태계에 어떤 일이 생길까」와 이어 설명했나요?",
  "summary": [
    "생태계는 <b>생물 요소</b>(풀·토끼·곰팡이)와 <b>비생물 요소</b>(햇빛·물·공기·흙)가 서로 영향을 주고받는 곳이에요.",
    "생물은 양분을 얻는 방법에 따라 <b>생산자</b>(스스로 만듦)·<b>소비자</b>(다른 생물을 먹음)·<b>분해자</b>(죽은 생물을 분해)로 나눠요.",
    "먹이 관계는 <b>먹이 사슬</b>·<b>먹이그물</b>로 나타내요(화살표: 먹히는 쪽 → 먹는 쪽). 한 생물이 사라지거나 줄면 이어진 생물도 영향을 받으므로, 서식지와 환경을 함께 지켜야 해요."
  ],
  "qr": {
    "scene": null,
    "lab": null,
    "kit": null
  },
  "intro": [
    "풀밭에 풀이 자라고, 토끼가 풀을 먹고, 여우가 토끼를 잡아먹어요. 여우가 없으면 토끼가 마음 놓고 살 수 있으니 풀밭이 더 좋아질까요?",
    "오늘은 풀 → 토끼 → 여우만 사는 풀밭 모형에서 한 가지만 바꾸고 몇 해 동안 지켜봐요."
  ],
  "think": [
    {
      "q": "토끼는 무엇을 먹고, 무엇에게 먹힐까요?",
      "a": "풀을 먹고 여우에게 먹혀요. 토끼는 풀과 여우 모두와 이어져 있어요."
    },
    {
      "q": "죽은 토끼나 떨어진 풀잎은 어떻게 될까요?",
      "a": "곰팡이·세균 같은 분해자가 분해해요. 그 물질은 흙으로 돌아가 다시 풀이 자라는 데 쓰여요."
    }
  ],
  "goal": "풀 → 토끼 → 여우만 사는 풀밭에서 한 가지만 바꾸고 몇 해 지켜보며, 먹이 관계로 이어진 생물이 서로 어떤 영향을 주는지 알아보자.",
  "materials": {
    "kit": [
      "풀밭 먹이 관계 3D 모형(풀·토끼·여우 수 모형)",
      "먹이 사슬 카드(풀·토끼·여우)"
    ],
    "student": [
      "기록지"
    ]
  },
  "hypothesis": {
    "hint": "여우가 모두 사라지면 몇 해 뒤 토끼와 풀은 어떻게 될까요?",
    "a": "여우가 사라지면 토끼는 늘어나고, 늘어난 토끼가 풀을 많이 먹어 풀은 줄어들 것이다."
  },
  "design": {
    "change": {
      "q": "바꿀 조건",
      "a": "풀밭에서 바꾸는 한 가지(여우가 사라짐 · 토끼가 사라짐 · 가뭄)"
    },
    "same": {
      "q": "같게 할 조건",
      "a": "처음 수(풀 60포기·토끼 12마리·여우 3마리), 지켜보는 기간(3년), 닫힌 풀밭"
    },
    "measure": {
      "q": "관찰할 것",
      "a": "3년 뒤 풀·토끼·여우의 수와 늘었는지 줄었는지"
    }
  },
  "steps": [
    {
      "art": "step1",
      "text": "풀밭 모형을 살펴요. 처음에는 풀 60포기, 토끼 12마리, 여우 3마리가 살아요.",
      "tip": "바깥에서 새 먹이가 들어오지 않는 닫힌 풀밭이에요."
    },
    {
      "art": "step2",
      "text": "누가 누구를 먹는지 화살표로 나타내요. 화살표는 먹히는 쪽에서 먹는 쪽을 향해요.",
      "tip": "풀 → 토끼 → 여우"
    },
    {
      "art": "step3",
      "text": "「그대로」를 먼저 지켜본 뒤, 바꿀 것을 한 번에 하나만 골라 3년 동안 지켜봐요.",
      "tip": "3D 실험실에서 바꿀 것을 고르고 「몇 해 지켜보기」를 눌러요."
    },
    {
      "art": "step4",
      "text": "3년 뒤 풀·토끼·여우의 수를 표에 적고, 「그대로」와 비교해 늘었는지 줄었는지 써요.",
      "tip": "수는 경향을 보여 주는 모형 값이에요."
    }
  ],
  "caution": [
    "실제 생물을 일부러 없애거나 잡아 오는 실험은 하지 않아요. 모형과 자료로 알아봐요.",
    "야외 조사는 선생님·보호자와 함께하고, 생물을 만진 뒤에는 손을 씻어요.",
    "모형의 수는 실제 풀밭의 조사값이 아니라는 것을 기록에 밝혀요."
  ],
  "results": [
    {
      "q": "3년 뒤 풀·토끼·여우의 수를 정리해요.",
      "table": [
        "바꾼 것",
        "풀",
        "토끼",
        "여우"
      ],
      "rows": [
        "그대로",
        "여우가 사라짐",
        "토끼가 사라짐"
      ],
      "a": "그대로: 토끼 12마리·풀 60포기 / 여우가 사라짐: 토끼 28마리·풀 28포기 / 토끼가 사라짐: 토끼 0마리·풀 80포기",
      "art": "row"
    },
    {
      "q": "가뭄으로 풀이 줄었을 때는 어땠나요?",
      "a": "풀이 30포기로 줄자 토끼는 6마리, 여우는 2마리로 줄었다."
    }
  ],
  "wonder": {
    "q": "가뭄으로 풀이 크게 줄었어요. 몇 해 뒤 토끼와 여우는 어떻게 될지, 먹이 관계를 근거로 써요.",
    "a": "풀이 줄면 토끼의 먹이가 부족해 토끼가 줄고, 토끼를 먹는 여우도 먹이가 줄어 여우도 줄어든다."
  },
  "conclusion": [
    {
      "q": "여우가 사라졌을 때 풀밭이 어떻게 달라졌는지 정리해요.",
      "a": "여우가 사라지자 토끼가 늘어났고, 늘어난 토끼가 풀을 많이 먹어 풀이 줄었다. 먹이 관계로 이어진 생물은 서로 영향을 준다."
    },
    {
      "q": "이 모형으로 알 수 있는 것과 알 수 없는 것을 하나씩 써요.",
      "a": "알 수 있는 것: 한 생물이 사라지면 먹이 관계로 이어진 다른 생물의 수도 달라진다. 알 수 없는 것: 실제 풀밭에서 정확히 몇 마리가 될지(실제 풀밭에는 더 많은 생물과 먹이 경로가 있다)."
    }
  ],
  "note": {
    "title": "생태계를 지키는 방법",
    "art": "roles",
    "table": {
      "head": [
        "오염·변화",
        "생태계에 주는 영향과 줄이는 방법"
      ],
      "rows": [
        [
          "대기 오염(자동차·공장 매연)",
          "생물이 숨쉬기 어려워져요 → 대중교통 이용, 매연 줄이기"
        ],
        [
          "수질 오염(생활 하수·쓰레기)",
          "물속 생물이 살기 어려워져요 → 세제 덜 쓰기, 쓰레기 줍기"
        ],
        [
          "토양 오염(쓰레기·농약)",
          "흙 속 생물이 줄어요 → 분리배출, 농약 덜 쓰기"
        ],
        [
          "서식지 파괴(도로·개발)",
          "생물이 살 곳을 잃어요 → 생태 통로, 보호 구역"
        ]
      ]
    },
    "points": [
      "생산자·소비자·분해자는 모두 생태계에 필요해요. 분해자가 없으면 죽은 생물이 쌓이고 흙으로 돌아가는 양분이 줄어요.",
      "생태계를 지키는 활동은 한 번으로 끝나지 않아요. 실제로 효과가 있는지 확인하고 고쳐 나가요."
    ],
    "plus": {
      "title": "먹이그물",
      "art": "web",
      "text": "실제 생태계에서는 여러 먹이 사슬이 그물처럼 얽혀 있어요. 들쥐도 풀을 먹고, 여우는 들쥐도 먹어요. 먹이 경로가 여러 개면 한 먹이가 줄어도 다른 먹이로 버틸 수 있지만, 영향이 아예 없지는 않아요."
    }
  },
  "creative": {
    "q": "우리 학교 화단이나 뒷산에 사는 생물로 먹이그물을 만들어요. 그중 한 생물이 사라지면 어떤 생물이 어떻게 영향을 받을지 화살표로 따라가 설명해요.",
    "a": "예: 풀 → 메뚜기 → 개구리 → 뱀, 풀 → 들쥐 → 뱀. 메뚜기가 사라지면 개구리의 먹이가 줄어 개구리가 줄 수 있고, 뱀은 들쥐를 더 먹게 될 수 있다."
  },
  "discuss": {
    "q": "학교 숲 옆에 새 주차장을 만들려고 해요. 숲의 생물과 사람의 편리를 함께 생각해 어떻게 하면 좋을지 이야기해요.",
    "a": "숲에 사는 생물과 이동 길을 먼저 조사한다. 숲을 덜 훼손하는 자리를 고르거나 생태 통로·나무 심기를 함께 계획하고, 만든 뒤에도 생물이 어떻게 지내는지 확인한다."
  },
  "gifted": {
    "title": "원인과 결과 이어 보기 — 생태계",
    "lead": "생태계와 관련된 원인과 결과를 이어 보세요. 사슬을 따라 두 단계 이상 이어지면 더 좋아요.",
    "rubric": [
      "알맞은 원인-결과 짝 하나에 1점",
      "영향을 사슬을 따라 두 단계 이상 이으면 1점 더",
      "한 생물만 바뀌고 나머지는 그대로라고 쓴 짝은 다시 생각해요"
    ],
    "rows": [
      "여우가 모두 사라졌다",
      "가뭄으로 풀이 줄었다",
      "분해자가 없어졌다"
    ],
    "a": {
      "여우가 모두 사라졌다": "결과: 토끼가 늘고, 늘어난 토끼가 풀을 먹어 풀이 줄어든다.",
      "가뭄으로 풀이 줄었다": "결과: 토끼의 먹이가 줄어 토끼가 줄고, 여우의 먹이도 줄어 여우가 줄어든다.",
      "분해자가 없어졌다": "결과: 죽은 생물과 배출물이 쌓이고, 흙으로 돌아가는 양분이 줄어 풀이 잘 자라지 못한다."
    }
  },
  "flow": [
    [
      "생태계",
      "생물 · 비생물 요소",
      "생산자 · 소비자 · 분해자"
    ],
    [
      "먹이 관계",
      "먹이 사슬 → 먹이그물",
      "한 생물이 바뀌면 이어진 생물도"
    ],
    [
      "보전",
      "오염·서식지 파괴 줄이기",
      "실천하고 확인하기"
    ]
  ],
  "concept": [
    {
      "tag": "A",
      "title": "생태계의 구성",
      "lines": [
        [
          "요소",
          "햇빛·물·흙은 {{비생물}} 요소예요."
        ],
        [
          "역할",
          "죽은 생물을 분해하는 생물은 {{분해자}}예요."
        ]
      ]
    },
    {
      "tag": "B",
      "title": "먹이 관계와 영향",
      "lines": [
        [
          "화살표",
          "토끼가 풀을 먹으면 풀 → {{토끼}}예요."
        ],
        [
          "영향",
          "여우가 사라지면 토끼가 늘고 풀은 {{줄어요}}."
        ]
      ]
    }
  ],
  "more": {
    "title": "더 알아보기 · 생태 통로",
    "text": "도로나 개발로 숲이 나뉘면 동물이 먹이와 짝을 찾아 이동하기 어려워져요. 도로 위나 아래로 동물이 건너가는 길을 만든 것이 생태 통로예요. 만든 뒤에는 무인 카메라로 실제로 이용하는지 확인해요."
  },
  "glossary": [
    [
      "생태계",
      "生態系",
      "날 생 · 모양 태 · 이을 계",
      "생물과 비생물 요소가 서로 영향을 주고받는 곳"
    ],
    [
      "생산자",
      "生産者",
      "날 생 · 낳을 산 · 사람 자",
      "햇빛을 이용해 양분을 스스로 만드는 생물"
    ],
    [
      "소비자",
      "消費者",
      "사라질 소 · 쓸 비 · 사람 자",
      "다른 생물을 먹어 양분을 얻는 생물"
    ],
    [
      "분해자",
      "分解者",
      "나눌 분 · 풀 해 · 사람 자",
      "죽은 생물·배출물을 분해해 양분을 얻는 생물"
    ],
    [
      "먹이그물",
      "—",
      "순우리말",
      "여러 먹이 사슬이 그물처럼 얽힌 것"
    ]
  ],
  "rail": {
    "1": [
      {
        "h": "오늘의 질문",
        "t": "여우가 사라지면 풀밭은 더 좋아질까요?"
      }
    ],
    "2": [
      {
        "h": "같게 할 조건",
        "t": "처음 수·지켜보는 기간은 같게, 바꾸는 것은 한 가지만."
      },
      {
        "g": [
          "생태계"
        ]
      }
    ],
    "3": [
      {
        "h": "모형과 실제",
        "t": "수는 경향을 보여 주는 모형 값이에요. 실제 풀밭에는 더 많은 생물이 살아요."
      }
    ],
    "4": [
      {
        "h": "집에서는",
        "t": "화단의 생물을 찾아 누가 누구를 먹는지 화살표로 이어 봐요."
      }
    ],
    "5": [
      {
        "g": [
          "생산자",
          "소비자",
          "분해자"
        ]
      }
    ],
    "6": [
      {
        "g": [
          "먹이그물"
        ]
      }
    ]
  },
  "check": [
    "c22-s42-u02-t06",
    "c22-s42-u02-t08",
    "c22-s42-u02-t09",
    "c22-s42-u02-b12",
    "c22-s42-u02-b41",
    "c22-s42-u02-t12"
  ],
  "formative": {
    "items": [
      "c22-s42-u02-t07",
      "c22-s42-u02-t10",
      "c22-s42-u02-b57",
      "c22-s42-u02-t11"
    ],
    "standards": [
      "생태계를 이루는 생물 요소와 비생물 요소를 구별하고, 생물을 생산자·소비자·분해자로 분류한다.",
      "먹이 사슬과 먹이그물을 나타내고, 한 생물의 변화가 먹이 관계로 이어진 생물에 주는 영향을 설명한다.",
      "사람의 활동이 생태계에 주는 영향을 알고, 생태계를 보전하는 방법을 실천하고 확인한다."
    ]
  }
};
export const plan = {
  "minutes": 80,
  "phases": [
    {
      "id": "open",
      "name": "도입",
      "min": 10,
      "aim": "풀밭의 생물 · 여우가 사라지면 좋아질까"
    },
    {
      "id": "design",
      "name": "탐구 설계",
      "min": 10,
      "aim": "가설과 바꿀·같게 할 조건 정하기"
    },
    {
      "id": "lab",
      "name": "실험",
      "min": 20,
      "aim": "풀밭 먹이 관계(3D) — 한 가지만 바꾸고 3년 지켜보기 · 두 팀 체험"
    },
    {
      "id": "result",
      "name": "결과·결론",
      "min": 15,
      "aim": "여우가 사라지면 토끼 늘고 풀 줄어듦 · 가뭄이면 모두 줄어듦"
    },
    {
      "id": "concept",
      "name": "개념",
      "min": 10,
      "aim": "생물·비생물 요소 · 생산자·소비자·분해자 · 먹이그물"
    },
    {
      "id": "extend",
      "name": "확장",
      "min": 10,
      "aim": "오염과 서식지 보전 · 생태 통로"
    },
    {
      "id": "check",
      "name": "확인",
      "min": 5,
      "aim": "먹이 화살표·영향 확인 문제"
    }
  ],
  "say": {
    "cover": "2022 [4과14]입니다. 기록 양식 대신 예상·관찰·설명으로 진행합니다. 풀밭의 수는 경향을 보여 주는 모형 값입니다.",
    "scene": "여우가 사라지면 어떻게 될지 먼저 고르게 하세요. 「토끼만 늘고 끝」이라고 생각하는 학생이 많을 수 있습니다 — 결과는 아직 말하지 않습니다.",
    "hypo": "「풀밭이 더 좋아질 것이다」도 조건과 결과를 이으면 가설입니다.",
    "design": "한 번에 하나만 바꾸고, 「그대로」를 기준으로 비교합니다.",
    "lab": "두 팀이 예상부터 고른 뒤 실험합니다. 실제 생물을 없애는 실험이 아님을 짚어 주세요.",
    "concl": "「토끼가 늘고 → 풀이 줄었다」처럼 영향이 사슬을 따라 이어지는 것을 스스로 말하게 합니다.",
    "gifted": "영향을 두 단계 이상 따라가 보게 합니다.",
    "test": "답을 먼저 공개하지 말고 학생의 응답 뒤 해설을 보여 주세요."
  }
};
