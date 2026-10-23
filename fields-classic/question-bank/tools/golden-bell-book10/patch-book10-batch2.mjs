// 골든벨 10권 묶음 2: 교사용 지도서 2단원 활동·확인·도전 52~66쪽.
// 보류 20건(2단원 전부)을 원본 문항으로 풀고, 장부에 없던 같은 쪽의 활동 문항 13개도 함께 넣어 52~66쪽을 빠짐없이 옮긴다.
// 새 단원 11(번호) 「합과 차·따라잡기 활동」을 연습 단원(catch-up-acorns, 67~75쪽) 앞에 둔다.
// 지도서의 보라·빨강 글씨(답·풀이·묶음 표시)는 옮기지 않는다. 이 스크립트에는 정답이 없다.
// node patch-book10-batch2.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b10 = books.find((b) => b.id === "book-10");
const lessonId = "sum-difference-activities-source";
if (b10.lessons.some((l) => l.id === lessonId)) throw new Error("already patched");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (b10.lessons.some((l) => numberOf(l) === 11)) throw new Error("lesson number 11 taken");
const practice = b10.lessons.find((l) => l.id === "catch-up-acorns");
const heldU2 = b10.sourceHold.filter((h) => /^B10-U2-/.test(h.sourceNo));
if (heldU2.length !== 20) throw new Error(`unit 2 holds ${heldU2.length}`);

const SQ = { label: "네모", token: "■" }, CI = { label: "동그라미", token: "●" }, DI = { label: "마름모", token: "◆" };
const qe = (symbols, equations, unit = "g") => ({ kind: "book10", subtype: "quantity-equations", symbols, equations: equations.map(([terms, total]) => ({ terms, total })), unit });
const pairs = (labels, tokens, pairSums, unit = "") => ({ kind: "book10", subtype: "pair-sum-list", labels, ...(tokens ? { tokens } : {}), pairSums, unit });
const ring = (firstGap, secondGap, unit = "cm", perimeter = "?") => ({ kind: "book10", subtype: "spacing-ring", perimeter, firstGap, secondGap, unit });
const chase = (labels, starts, changes, unit) => ({ kind: "book10", subtype: "catch-up-table", labels, starts, changes, unit });
const op = (expression) => ({ kind: "book10", subtype: "operation", expression });
const P = (id, label, unit) => ({ id, label, ...(unit ? { unit } : {}) });
const SCALE = "같은 모양은 같은 무게, 다른 모양은 다른 무게를 나타냅니다.";

// [쪽, 위치, 보류 sourceNo 또는 null(장부에 없던 문항), 유형, 물음, 그림, 답 칸들(없으면 한 칸)]
const specs = [
  [52, "활동 01 (1)", "B10-U2-two-weight-03", "두 종류 물건의 무게식", `${SCALE} 네모 1개와 동그라미 2개는 11g, 네모 2개와 동그라미 1개는 13g입니다. 네모와 동그라미 하나씩, 네모 하나, 동그라미 하나의 무게를 각각 구하시오.`,
    qe([SQ, CI], [[[1, 2], 11], [[2, 1], 13]]), [P("pair", "네모+동그라미", "g"), P("square", "네모", "g"), P("circle", "동그라미", "g")]],
  [52, "활동 01 (2)", "B10-U2-two-weight-04", "두 종류 물건의 무게식", `${SCALE} 네모 1개와 동그라미 3개는 7g, 네모 3개와 동그라미 1개는 13g입니다. 네모와 동그라미 하나씩, 네모 하나, 동그라미 하나의 무게를 각각 구하시오.`,
    qe([SQ, CI], [[[1, 3], 7], [[3, 1], 13]]), [P("pair", "네모+동그라미", "g"), P("square", "네모", "g"), P("circle", "동그라미", "g")]],
  [53, "활동 01", null, "같은 모양을 빼고 구하기", `${SCALE} 네모 1개와 동그라미 1개는 8g, 네모 2개와 동그라미 1개는 13g입니다. 네모와 동그라미의 무게를 각각 구하시오.`,
    qe([SQ, CI], [[[1, 1], 8], [[2, 1], 13]]), [P("square", "네모", "g"), P("circle", "동그라미", "g")]],
  [53, "활동 02", "B10-U2-target-02", "두 과녁의 점수 차", "가와 나로 나뉜 과녁에 화살을 쏘아 점수를 계산하였습니다. A는 가에 두 번, 나에 한 번 맞혀서 18점, B는 가에 한 번, 나에 한 번 맞혀서 11점이 되었습니다. 나에 한 번 맞혔을 때의 점수를 구하시오.",
    { kind: "book10", subtype: "target-score", zones: [{ label: "가" }, { label: "나" }], attempts: [{ label: "A", hits: [2, 1], total: 18 }, { label: "B", hits: [1, 1], total: 11 }] }, [P("score", "나의 점수", "점")]],
  [54, "활동 03", null, "같은 구슬을 빼고 구하기", "주황 구슬 3개와 파란 구슬 2개의 무게는 170g이고, 주황 구슬 1개와 파란 구슬 2개의 무게는 110g입니다. 파란 구슬 한 개는 몇 g인지 구하시오.",
    qe([{ label: "주황 구슬", token: "●", className: "orange" }, { label: "파란 구슬", token: "●", className: "blue" }], [[[3, 2], 170], [[1, 2], 110]]), [P("blue", "파란 구슬", "g")]],
  [54, "활동 04", null, "늘어난 양을 빼서 빈 그릇값 찾기", "유리컵에 무게가 같은 구슬이 여러 개 담겨 있고, 무게는 180g입니다. 컵에 들어 있는 구슬의 수를 두 배로 하면 340g이 됩니다. 유리컵만의 무게를 구하시오.",
    qe([{ label: "유리컵", token: "컵" }, { label: "구슬 묶음", token: "●" }], [[[1, 1], 180], [[1, 2], 340]]), [P("cup", "유리컵", "g")]],
  [55, "확인 01", "B10-U2-pair-sums-05", "세 대상의 두 개씩 합", `${SCALE} 네모와 동그라미는 9g, 동그라미와 마름모는 10g, 마름모와 네모는 5g입니다. 세 모양을 합한 무게와 각 모양의 무게를 구하시오.`,
    pairs(["네모", "동그라미", "마름모"], ["■", "●", "◆"], [9, 10, 5], "g"), [P("all", "세 모양의 합", "g"), P("square", "네모", "g"), P("circle", "동그라미", "g"), P("diamond", "마름모", "g")]],
  [55, "확인 02", "B10-U2-pair-sums-06", "세 대상의 두 개씩 합", "같은 모양은 같은 수, 다른 모양은 다른 수를 나타냅니다. 동그라미+네모=12, 네모+마름모=13, 마름모+동그라미=7일 때 각 도형이 나타내는 수를 구하시오.",
    pairs(["동그라미", "네모", "마름모"], ["●", "■", "◆"], [12, 13, 7]), [P("circle", "동그라미"), P("square", "네모"), P("diamond", "마름모")]],
  [56, "확인 03", "B10-U2-pair-sums-07", "세 수의 두 수씩 합", "A, B, C 세 자연수를 각각 두 개씩 더했더니 A와 B의 합은 7, B와 C의 합은 9, C와 A의 합은 12였습니다. C를 구하시오.",
    pairs(["A", "B", "C"], null, [7, 9, 12]), null],
  [56, "확인 04", "B10-U2-pair-sums-08", "세 사람의 두 명씩 합", "형구와 도영이의 나이를 합하면 24살, 도영이와 재인이는 30살, 재인이와 형구는 20살입니다. 형구의 나이는 몇 살인지 구하시오.",
    pairs(["형구", "도영", "재인"], null, [24, 30, 20], "살"), [P("age", "형구", "살")]],
  [57, "활동 02 ① (1)", null, "닫힌 둘레의 말뚝 수", "둘레가 120m인 목장 주위에 정우는 20m 간격으로, 동재는 12m 간격으로 말뚝을 박으려고 합니다. 정우와 동재가 박은 말뚝의 개수를 각각 구하시오.",
    ring(20, 12, "m", 120), [P("jungwoo", "정우", "개"), P("dongjae", "동재", "개")]],
  [57, "활동 02 ① (2)", null, "닫힌 둘레의 말뚝 수", "둘레가 240m인 목장 주위에 정우는 20m 간격으로, 동재는 12m 간격으로 말뚝을 박으려고 합니다. 정우와 동재가 박은 말뚝의 개수를 각각 구하시오.",
    ring(20, 12, "m", 240), [P("jungwoo", "정우", "개"), P("dongjae", "동재", "개")]],
  [57, "활동 02 ① (3)", null, "둘레와 말뚝 수의 비", "목장의 둘레가 120m에서 240m로 두 배가 되면, 정우(20m 간격)와 동재(12m 간격)가 박은 말뚝 개수의 차이는 몇 배가 되는지 구하시오.",
    op("둘레 120m → 240m"), [P("times", "차이의", "배")]],
  [58, "1-01", null, "두 간격의 공배수", "연못 주위에 1m 간격과 80cm 간격으로 모두 나무를 심을 수 있도록 하려고 합니다. 연못의 둘레(cm)는 100으로도 80으로도 나누어떨어지는 수입니다. 연못의 둘레가 될 수 있는 수 중에서 가장 작은 수를 구하시오.",
    ring(100, 80, "cm"), [P("perimeter", "가장 작은 둘레", "cm")]],
  [58, "1-02", null, "두 간격의 나무 수 차", "연못의 둘레가 400cm일 때, 1m로 나무를 심는 경우와 80cm로 나무를 심는 경우 필요한 나무 수의 차이를 구하시오.",
    ring(100, 80, "cm", 400), [P("diff", "나무 수의 차이", "그루")]],
  [58, "1-03", null, "차이로 둘레 찾기", "연못 주위에 1m 간격으로 나무를 심으려고 합니다. 80cm 간격으로 하면 1m로 할 때보다 나무가 2그루 더 필요합니다. 둘레가 400cm일 때의 차이와 비교해서 연못의 둘레를 구하시오.",
    ring(100, 80, "cm"), [P("perimeter", "연못의 둘레", "m")]],
  [58, "1-04", null, "차이로 둘레 찾기", "연못 주위에 1m 간격으로 나무를 심으려고 합니다. 80cm 간격으로 하면 나무가 2그루 더 필요합니다. 연못 주위에 1m로 나무를 심으려면 나무가 몇 그루 필요한지 구하시오.",
    ring(100, 80, "cm"), [P("trees", "나무", "그루")]],
  [59, "활동 01", "B10-U2-closed-spacing-02", "닫힌 둘레의 간격", "연못 주위에 1m 간격으로 나무를 심으려고 합니다. 나무와 나무 사이의 간격을 60cm로 하면 간격을 1m로 할 때보다 나무가 4그루 더 필요합니다. 처음에 심으려고 했던 나무는 몇 그루인지, 연못의 둘레는 몇 m인지 구하시오.",
    ring(100, 60, "cm"), [P("trees", "나무", "그루"), P("perimeter", "연못의 둘레", "m")]],
  [59, "활동 02", "B10-U2-price-count-02", "같은 돈의 가격과 개수", "재욱이는 한 권에 2000원 하는 공책 몇 권을 사려고 했는데, 한 권에 1500원 하는 공책을 샀기 때문에 처음에 사려고 했던 공책 수보다 3권을 더 살 수 있었습니다. 돈이 남지 않았다고 할 때, 처음에 사려고 했던 공책은 몇 권인지, 처음에 가지고 있던 돈은 얼마인지 구하시오.",
    { kind: "book10", subtype: "commerce-equation", first: { label: "2000원 공책", price: 2000 }, second: { label: "1500원 공책", price: 1500 }, extra: 3 }, [P("books", "공책", "권"), P("money", "처음에 가지고 있던 돈", "원")]],
  [60, "활동 03", "B10-U2-equal-share-03", "사람 수가 바뀐 등분", "수인이네 동아리 학생들은 처음에 한 명이 구슬을 10개씩 나눠 가지기로 하였는데, 4명이 새로 들어와서 한 명이 구슬을 6개씩 나누어 가졌습니다. 처음 있던 동아리 학생 수와 구슬의 개수를 각각 구하시오.",
    { kind: "book10", subtype: "share-change-unknown", oldShare: 10, added: 4, newShare: 6, unit: "개" }, [P("students", "학생 수", "명"), P("marbles", "구슬 수", "개")]],
  [60, "활동 04", "B10-U2-equal-share-04", "사람 수가 바뀐 등분", "동재네 동아리 학생들이 처음에 카드를 9장씩 가질 수 있었는데, 2명이 새로 게임에 참가해서 카드를 6장씩 가지게 되었습니다. 처음 있던 동아리 학생 수와 카드의 개수를 각각 구하시오.",
    { kind: "book10", subtype: "share-change-unknown", oldShare: 9, added: 2, newShare: 6, unit: "장" }, [P("students", "학생 수", "명"), P("cards", "카드 수", "장")]],
  [61, "확인 2 (01·02)", null, "늘어나는 양의 따라잡기", "지금까지 주워 온 도토리는 엄마 다람쥐가 30개, 아빠 다람쥐가 50개입니다. 엄마 다람쥐는 하루에 7개씩, 아빠 다람쥐는 하루에 3개씩 주워 온다면, 며칠 후에 두 다람쥐가 주워 온 도토리의 개수가 같아지는지 구하시오.",
    chase(["엄마 다람쥐", "아빠 다람쥐"], [30, 50], [7, 3], "개/일"), [P("days", "같아지는 때", "일 후")]],
  [62, "확인 01", "B10-U2-growing-catch-up-03", "늘어나는 양의 따라잡기", "A회사에는 지금 104대의 스마트폰이 있고 B회사에는 160대의 스마트폰이 있습니다. A회사에서는 하루에 40대를 만들고 B회사에서는 33대를 만든다면 A와 B회사의 스마트폰 수가 같아지는 것은 며칠 후인지 구하시오.",
    chase(["A회사", "B회사"], [104, 160], [40, 33], "대/일"), [P("days", "같아지는 때", "일 후")]],
  [62, "확인 02", "B10-U2-growing-catch-up-04", "늘어나는 양의 따라잡기", "A, B 두 물탱크에 물이 각각 36L, 60L씩 들어 있습니다. 지금부터 A에는 매분 10L, B에는 매분 6L씩 물을 넣기 시작한다면 몇 분 후에 두 물탱크의 물이 같아지는지 구하시오.",
    chase(["A 물탱크", "B 물탱크"], [36, 60], [10, 6], "L/분"), [P("minutes", "같아지는 때", "분 후")]],
  [63, "확인 03", "B10-U2-shrinking-catch-up-02", "줄어드는 양의 따라잡기", "길이가 각각 20cm, 30cm인 두 개의 양초가 있습니다. 20cm인 양초는 1분마다 3cm씩 타고, 30cm인 양초는 1분에 5cm씩 탑니다. 두 양초에 동시에 불을 붙였을 때, 타고 남은 두 양초의 길이가 같아지는 것은 몇 분 후인지 구하시오.",
    chase(["20cm 양초", "30cm 양초"], [20, 30], [-3, -5], "cm/분"), [P("minutes", "같아지는 때", "분 후")]],
  [63, "확인 04", "B10-U2-distance-catch-up-02", "거리 차의 따라잡기", "재이와 준이가 달리기 경주를 합니다. 지금 재이는 출발선에서 32m 지점에 있고, 준이는 출발선에서 50m 지점에 있습니다. 재이가 1초에 9m를 달리고 준이는 1초에 6m를 달린다면 몇 초 후에 재이가 준이를 따라잡는지 구하시오.",
    chase(["재이", "준이"], [32, 50], [9, 6], "m/초"), [P("seconds", "따라잡는 때", "초 후")]],
  [64, "도전 1", "B10-U2-two-weight-05", "두 종류 물건의 무게식", "큐브 2개와 구슬 3개의 무게는 27g이고, 큐브 3개와 구슬 2개의 무게는 23g입니다. 큐브와 구슬 하나씩, 큐브 한 개, 구슬 한 개의 무게를 각각 구하시오.",
    qe([{ label: "큐브", token: "■" }, { label: "구슬", token: "●", className: "orange" }], [[[2, 3], 27], [[3, 2], 23]]), [P("pair", "큐브+구슬", "g"), P("cube", "큐브", "g"), P("ball", "구슬", "g")]],
  [64, "도전 2", "B10-U2-four-weight-01", "네 물건의 무게식", "주황 구슬, 마름모, 네모, 별을 저울에 올려놓고 무게를 재었더니 다음과 같았습니다. 각각의 무게를 구하시오.",
    qe([{ label: "구슬", token: "●", className: "orange" }, DI, SQ, { label: "별", token: "★" }], [[[2, 1, 1, 0], 22], [[1, 1, 0, 4], 14], [[1, 0, 1, 0], 12], [[1, 0, 3, 1], 23]]),
    [P("ball", "구슬", "g"), P("diamond", "마름모", "g"), P("square", "네모", "g"), P("star", "별", "g")]],
  [65, "도전 3", "B10-U2-pair-sums-09", "두 과목씩 평균", "유진이는 국어, 영어, 수학 세 과목의 시험을 쳤습니다. 두 과목씩의 평균점수가 다음과 같을 때, 유진이의 수학점수를 구하시오. (두 과목의 평균점수는 두 과목의 점수를 더한 값을 2로 나눈 것입니다.)",
    { kind: "book10", subtype: "statement-list", items: ["국어와 영어의 평균점수는 85점입니다.", "영어와 수학의 평균점수는 93점입니다.", "수학과 국어의 평균점수는 90점입니다."] }, [P("math", "수학점수", "점")]],
  [65, "도전 4", "B10-U2-delayed-saving-01", "늦게 시작한 저금", "윤성이는 1월부터 한 달에 4만원씩 저금을 하기 시작했고, 현석이는 4월부터 한 달에 6만원씩 저금을 하기 시작하였습니다. 윤성이와 현석이가 저금한 돈이 같아지는 것은 몇 월인지 구하시오.",
    { kind: "book10", subtype: "delayed-catch-up", names: ["윤성", "현석"], startLabels: ["윤성 1월 시작", "현석 4월 시작"], delay: 3, earlyRate: 4, lateRate: 6 }, [P("month", "같아지는 달", "월")]],
  [66, "도전 5 (1)", "B10-U2-closed-spacing-03", "닫힌 둘레의 간격", "둥근 연못 주위의 화단에 같은 간격으로 민들레 꽃을 심으려고 합니다. 꽃과 꽃 사이의 간격을 1m로 하면 간격을 120cm로 할 때보다 꽃이 5송이 더 필요합니다. 화단의 둘레는 몇 m인지 구하시오.",
    ring(100, 120, "cm"), [P("perimeter", "화단의 둘레", "m")]],
  [66, "도전 5 (2)", null, "닫힌 둘레의 간격", "둥근 연못 주위의 화단에 꽃을 심습니다. 간격을 1m로 하면 120cm로 할 때보다 꽃이 5송이 더 필요합니다. 처음 120cm 간격으로 심으려고 했던 꽃은 몇 송이인지 구하시오.",
    ring(100, 120, "cm"), [P("flowers", "120cm 간격의 꽃", "송이")]],
  [66, "도전 5 (3)", null, "닫힌 둘레의 간격", "둥근 연못 주위의 화단에 꽃을 심습니다. 간격을 1m로 하면 120cm로 할 때보다 꽃이 5송이 더 필요합니다. 만약 150cm 간격으로 꽃을 심는다면 몇 송이의 꽃이 필요한지 구하시오.",
    ring(100, 150, "cm"), [P("flowers", "150cm 간격의 꽃", "송이")]]
];
const used = new Set(specs.map((s) => s[2]).filter(Boolean));
if (used.size !== 20 || heldU2.some((h) => !used.has(h.sourceNo))) throw new Error("hold mapping");

const items = specs.map(([page, loc, holdNo, type, prompt, visual, parts], k) => {
  const answerRef = `/books/book-10/lessons/11/original/items/${k}`;
  const item = { id: `book10-guide-p${page}-${k + 1}`, unit: 2, sourcePage: page, sourceNo: holdNo || `B10-U2-P${page}-${loc.replace(/[^0-9A-Za-z가-힣]+/g, "-").replace(/-+$/, "")}`,
    typeLabel: type, sourceLocator: `교사용 지도서 ${page}쪽 ${loc}`, printGroup: 800 + page, visual, prompt, answerRef };
  if (parts && parts.length > 1) item.parts = parts.map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else Object.assign(item, { answerMode: "input", inputMode: "numeric", ...(parts?.[0]?.unit ? { unit: parts[0].unit } : {}) });
  return item;
});
const sample = practice.experience;
const lesson = {
  id: lessonId, unit: 2, title: "합과 차·따라잡기 활동", sourceLocator: "교사용 지도서 52~66쪽 · 2단원 활동 01·02, 더클 확인문제, 더클 도전문제",
  sourceTypeIds: ["book10-sum-difference-activities"],
  representativeConcept: "두 식을 합치거나 같은 부분을 빼서 하나씩 구하고, 차이가 줄어드는 빠르기로 따라잡는 때를 구함",
  story: { title: "합과 차로 푸는 문제", text: "저울, 과녁, 둘레, 따라잡기 문제를 지도서 활동 순서대로 풀어요.", mission: "같은 부분을 빼거나 모두 더해 보세요." },
  explanation: { headline: "모두 더하기, 같은 것 빼기, 차이 줄이기", steps: ["두 식을 모두 더하면 하나씩의 합이 몇 배인지 보입니다.", "같은 것이 들어 있는 두 식은 빼서 남은 것을 구합니다.", "두 쌍씩의 합 세 개를 모두 더하면 세 값의 합의 2배입니다.", "따라잡기는 처음 차이를 하루(1분)에 줄어드는 차이로 나눕니다."] },
  experience: { ...sample, family: "sum-difference-activity-b10", title: "같은 것을 빼고 남은 것을 구해요",
    beats: [
      { id: "unit2-activity-step-1", action: "reveal", caption: "네모 1개와 동그라미 1개는 9g, 네모 2개와 동그라미 1개는 14g이에요.", visual: qe([SQ, CI], [[[1, 1], 9], [[2, 1], 14]]) },
      { id: "unit2-activity-step-2", action: "highlight", caption: "두 저울에 똑같이 있는 네모 1개와 동그라미 1개를 빼면 네모 1개가 남아요.", visual: { kind: "book5", subtype: "source-note-box", lines: ["14 - 9 = 5", "네모 = 5g"] } },
      { id: "unit2-activity-step-3", action: "verify", caption: "처음 저울에 넣어 동그라미도 구해요.", visual: { kind: "book5", subtype: "source-note-box", lines: ["9 - 5 = 4", "동그라미 = 4g"] } }
    ], hint: "같은 것이 들어 있는 두 식은 빼 보세요.",
    check: { prompt: "A와 B의 합은 10, B와 C의 합은 12, C와 A의 합은 14입니다. A + B + C는 얼마일까요?", options: ["18", "36", "12"], answerRef: "/books/book-10/lessons/11/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items.length, structureKey: lessonId, prompt: "지도서 2단원 활동 문항을 푸시오.", items },
  extension: { title: "추가 학습", structureKey: lessonId, story: "저울로 두 모양의 무게를 구합니다.", prompt: `${SCALE} 네모 1개와 동그라미 2개는 16g, 네모 2개와 동그라미 1개는 20g입니다. 네모 하나의 무게를 구하시오.`,
    visual: qe([SQ, CI], [[[1, 2], 16], [[2, 1], 20]]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-10/lessons/11/extension" }
};
delete lesson.experience.model;
b10.lessons.splice(b10.lessons.indexOf(practice), 0, lesson);

// ── 장부: 2단원 보류 20건 해제, 장부에 없던 문항 13개 새로 셈 ──
const extra = specs.filter((s) => !s[2]).length;
b10.sourceHold = b10.sourceHold.filter((h) => !/^B10-U2-/.test(h.sourceNo));
const cov = b10.sourceCoverage;
const u2 = cov.byUnit.find((u) => u.unit === 2);
u2.public += u2.hold + extra; u2.total += extra; u2.hold = 0;
for (const c of cov.catalog.filter((c) => c.unit === 2)) { c.public += c.hold; c.hold = 0; }
cov.catalog.push({ unit: 2, unitTitle: u2.title, id: "guide-activity-extra", label: "장부에 없던 지도서 활동 문항(52~66쪽)", total: extra, minimumArithmetic: false, public: extra, hold: 0 });
cov.total = cov.byUnit.reduce((n, u) => n + u.total, 0);
cov.public = cov.byUnit.reduce((n, u) => n + u.public, 0);
cov.hold = cov.byUnit.reduce((n, u) => n + u.hold, 0);
if (cov.hold !== b10.sourceHold.length) throw new Error(`hold count ${cov.hold} vs ${b10.sourceHold.length}`);
b10.source.note = `교사용 지도서의 활동 슬롯을 장부화했습니다. 2단원(52~66쪽)은 원본 대조를 마쳐 보류가 없습니다. 전체 ${cov.total}개 중 공개 ${cov.public}개, 보류 ${cov.hold}개.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book10 batch2 patched", { items: items.length, extra, holds: b10.sourceHold.length, total: cov.total, public: cov.public });
