// 골든벨 10권 묶음 3: 교사용 지도서 3단원 「조건에 맞는 수」 78~104쪽.
// 보류 37건(3단원 전부)을 원본 문항으로 풀고, 장부에 없던 같은 쪽의 활동 문항 8개도 함께 넣는다.
// 새 단원 12 「숫자 카드와 경우의 수」(78~86쪽·연습 96~100쪽)와 13 「점점 커지는 수와 카드의 합」(87~95쪽·연습 101~104쪽)을
// 공개 단원 digit-card-four-place(79·87쪽) 바로 뒤에 둔다.
// 97쪽(연습 03·04)은 쪽 그림을 읽지 못해 옮기지 않았다(장부에도 없던 쪽). 지도서의 보라·빨강 글씨(답·풀이)는 옮기지 않는다.
// 이 스크립트에는 정답이 없다.  node patch-book10-batch3.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b10 = books.find((b) => b.id === "book-10");
const ids = ["digit-card-cases-source", "ordered-digit-sum-source"];
if (b10.lessons.some((l) => ids.includes(l.id))) throw new Error("already patched");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (b10.lessons.some((l) => [12, 13].includes(numberOf(l)))) throw new Error("lesson number 12/13 taken");
const anchor = b10.lessons.find((l) => l.id === "digit-card-four-place");
const heldU3 = b10.sourceHold.filter((h) => /^B10-U3-/.test(h.sourceNo));
if (heldU3.length !== 37) throw new Error(`unit 3 holds ${heldU3.length}`);

const KO = { 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯" };
const cards = (digits, length, extra = {}) => ({ kind: "book10", subtype: "digit-slots", digits, length, ...extra });
const once = (digits, length) => `다음 ${KO[digits.length]} 장의 숫자 카드를 한 번씩만 써서 만들 수 있는 서로 다른 ${KO[length]} 자리 수는 모두 몇 개인지 구하시오.`;
const repeat = (digits, length) => `숫자 ${digits.join(", ")}${digits.at(-1) === 2 ? "를" : "을"} 사용하여 만들 수 있는 ${KO[length]} 자리 수는 모두 몇 개인지 구하시오. (단, 같은 숫자를 여러 번 사용할 수 있습니다.)`;
const range = (n) => Array.from({ length: n }, (_, i) => i + 1);
const LIST = " (여러 개이면 쉼표로 나누어 모두 쓰시오.)";
const SUMLIST = " (세 수는 작은 수부터 1+2+3처럼 쓰고, 여러 개이면 쉼표로 나누어 쓰시오.)";
const sumPrompt = (n, target, count = "세") => `다음 1부터 ${n}까지의 숫자 카드가 한 장씩 있습니다. ${count} 수의 합이 ${target}인 경우를 모두 구하시오. (단, 순서만 다른 경우는 한 가지로 봅니다.)`;
const targetCards = (n, target, pickCount = 3) => ({ kind: "book10", subtype: "target-cards", cards: range(n), pickCount, target });
const P = (id, label, unit) => ({ id, label, ...(unit ? { unit } : {}) });

// [단원, 쪽, 위치, 보류 sourceNo 또는 null(장부에 없던 문항), 유형, 물음, 그림, 답 방식]
// 답 방식: "개"·"가지"(수 하나) · "list"(여러 수를 쉼표로) · 배열(여러 칸)
const specs = [
  // ── 단원 12: 숫자 카드와 경우의 수 ──
  [12, 78, "① 학교·문구점·집", null, "여러 구간의 길 고르기", "다음 그림에서 학교에서 문구점을 거쳐 집까지 가는 길의 가짓수를 구하시오.",
    { kind: "book10", subtype: "route-stages", nodes: ["학교", "문구점", "집"], choices: [2, 3] }, "가지"],
  [12, 78, "② A·B·C·D", null, "여러 구간의 길 고르기", "다음 그림에서 A에서 B와 C를 거쳐 D까지 가는 길의 가짓수를 구하시오.",
    { kind: "book10", subtype: "route-stages", nodes: ["A", "B", "C", "D"], choices: [3, 2, 4] }, "가지"],
  [12, 78, "③ 옷차림", null, "옷차림 고르기", "예은이는 모자 2가지, 티셔츠 3가지, 치마 2가지를 가지고 있습니다. 서로 다른 옷차림을 하는 방법은 모두 몇 가지인지 구하시오.",
    { kind: "book10", subtype: "route-stages", groups: [{ label: "모자", count: 2 }, { label: "티셔츠", count: 3 }, { label: "치마", count: 2 }] }, "가지"],
  [12, 80, "활동 01", "B10-U3-digit-cards-03", "숫자 카드로 만드는 수", once([1, 2, 3], 3), cards([1, 2, 3], 3), "개"],
  [12, 80, "활동 02", "B10-U3-digit-cards-04", "숫자 카드로 만드는 수", once([1, 2, 4, 6, 8], 5), cards([1, 2, 4, 6, 8], 5), "개"],
  [12, 81, "활동 03", "B10-U3-digit-cards-05", "숫자 카드로 만드는 수", once([1, 2, 4, 8], 2), cards([1, 2, 4, 8], 2), "개"],
  [12, 81, "활동 04", "B10-U3-digit-cards-06", "숫자 카드로 만드는 수", once([1, 3, 5, 7, 9], 3), cards([1, 3, 5, 7, 9], 3), "개"],
  [12, 82, "활동 05", "B10-U3-digit-cards-07", "0이 있는 숫자 카드", once([0, 2, 4], 3), cards([0, 2, 4], 3), "개"],
  [12, 82, "활동 06", "B10-U3-digit-cards-08", "0이 있는 숫자 카드", once([0, 1, 2, 3], 4), cards([0, 1, 2, 3], 4), "개"],
  [12, 83, "활동 07", "B10-U3-digit-cards-09", "0이 있는 숫자 카드", once([0, 1, 3, 8], 2), cards([0, 1, 3, 8], 2), "개"],
  [12, 83, "활동 08", "B10-U3-digit-cards-10", "0이 있는 숫자 카드", once([0, 2, 4, 6, 8], 3), cards([0, 2, 4, 6, 8], 3), "개"],
  [12, 84, "2-01", null, "숫자를 여러 번 쓰는 수", "숫자 1, 2를 여러 번 사용하여 네 자리 수를 만들려고 합니다. 나뭇가지 그림으로 찾을 때, 천의 자리 숫자가 1인 경우는 모두 몇 개인지 구하시오.",
    cards([1, 2], 4, { fixed: [1], repeat: true }), "개"],
  [12, 84, "2-02", null, "숫자를 여러 번 쓰는 수", "천의 자리가 2인 경우도 천의 자리 숫자가 1인 경우와 같습니다. 각 자리에 들어갈 수 있는 숫자의 개수를 구하여, 숫자 1, 2로 만들 수 있는 네 자리 수가 모두 몇 개인지 구하시오. (단, 같은 숫자를 여러 번 사용할 수 있습니다.)",
    cards([1, 2], 4, { repeat: true }), "개"],
  [12, 85, "확인 01", "B10-U3-repeated-digits-01", "숫자를 여러 번 쓰는 수", repeat([1, 2, 3], 4), cards([1, 2, 3], 4, { repeat: true }), "개"],
  [12, 85, "확인 02", "B10-U3-repeated-digits-02", "숫자를 여러 번 쓰는 수", repeat([1, 2], 5), cards([1, 2], 5, { repeat: true }), "개"],
  [12, 86, "확인 03", "B10-U3-switches-01", "전구를 켜는 방법", "다음과 같이 전구 4개가 나란히 놓여 있습니다. 이 전구에 불을 켜는 서로 다른 방법은 모두 몇 가지인지 구하시오. (단, 불을 모두 끌 수도 있습니다.)",
    { kind: "book10", subtype: "switches", look: "bulb", switchCount: 4, allOffAllowed: true }, "가지"],
  [12, 86, "확인 04", "B10-U3-switches-02", "신호등의 신호", "민형이네 학교 앞 횡단보도에 다음과 같은 신호등이 있습니다. 이 신호등은 3개의 등으로 되어 있고, 각 등마다 켜질 수도 있고 꺼질 수도 있습니다. 이 신호등을 이용하여 몇 가지 신호를 보낼 수 있는지 구하시오. (단, 3개의 등은 동시에 모두 꺼질 수 없습니다.)",
    { kind: "book10", subtype: "switches", look: "signal", labels: ["초록", "노랑", "빨강"], excludeAllOff: true }, "가지"],
  [12, 96, "연습 01", "B10-U3-route-choice-01", "여러 구간의 길 고르기", "다음 그림에서 학교에서 문구점을 거쳐 집까지 가는 길의 가짓수를 구하시오.",
    { kind: "book10", subtype: "route-stages", nodes: ["학교", "문구점", "집"], choices: [3, 4] }, "가지"],
  [12, 96, "연습 02", "B10-U3-lineup-01", "한 줄 서기", "장훈, 혜령, 석영 세 사람이 버스를 타기 위해 줄을 서려고 합니다. 세 사람이 줄을 서는 방법은 모두 몇 가지인지 구하시오.",
    { kind: "book10", subtype: "lineup-slots", people: 3, names: ["장훈", "혜령", "석영"] }, "가지"],
  [12, 98, "연습 05", "B10-U3-digit-cards-11", "0이 있는 숫자 카드", once([1, 0, 3, 8], 4), cards([1, 0, 3, 8], 4), "개"],
  [12, 98, "연습 06", "B10-U3-digit-cards-12", "0이 있는 숫자 카드", once([1, 0, 2, 3, 4], 3), cards([1, 0, 2, 3, 4], 3), "개"],
  [12, 99, "연습 07", "B10-U3-repeated-digits-03", "숫자를 여러 번 쓰는 수", repeat([1, 2, 3], 3), cards([1, 2, 3], 3, { repeat: true }), "개"],
  [12, 99, "연습 08", "B10-U3-repeated-digits-04", "숫자를 여러 번 쓰는 수", repeat([1, 2], 4), cards([1, 2], 4, { repeat: true }), "개"],
  [12, 100, "연습 09", "B10-U3-switches-03", "전구를 켜는 방법", "다음과 같이 전구 5개가 나란히 놓여 있습니다. 이 전구에 불을 켜는 서로 다른 방법은 모두 몇 가지인지 구하시오. (단, 불을 모두 끌 수도 있습니다.)",
    { kind: "book10", subtype: "switches", look: "bulb", switchCount: 5, allOffAllowed: true }, "가지"],
  [12, 100, "연습 10", "B10-U3-switches-04", "동전 던지기", "10원, 50원, 100원짜리 동전 3개가 있습니다. 이 동전을 한 번에 던져서 숫자의 면이 나오면 그 액수만큼의 돈을 얻는다고 할 때, 얻을 수 있는 금액은 모두 몇 가지인지 구하시오. (이때, 0원도 포함합니다.)",
    { kind: "book10", subtype: "switches", look: "coin", labels: ["10원", "50원", "100원"], note: "숫자 면이 나온 동전의 돈을 얻어요" }, "가지"],
  // ── 단원 13: 점점 커지는 수와 카드의 합 ──
  [13, 87, "활동 02 ②", null, "점점 커지는 수 모두 쓰기", `다음 1, 2, 4, 7, 9 다섯 장의 숫자 카드로 세 자리 수를 만들 때, 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 커지는 수(점큰수)를 모두 구하시오.${LIST}`,
    cards([1, 2, 4, 7, 9], 3, { direction: "increasing" }), "list"],
  [13, 88, "활동 01", "B10-U3-place-direction-01", "점점 작아지는 수 모두 쓰기", `다음 네 장의 숫자 카드로 만들 수 있는 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 작아지는 수(점작수)를 모두 구하시오.${LIST}`,
    cards([2, 4, 6, 8], 3, { direction: "decreasing" }), "list"],
  [13, 88, "활동 02", "B10-U3-place-direction-02", "점점 작아지는 수 모두 쓰기", `1, 2, 3, 4, 5, 6 여섯 장의 숫자 카드로 만들 수 있는 600보다 큰 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 작아지는 수(점작수)를 모두 구하시오.${LIST}`,
    cards(range(6), 3, { direction: "decreasing", limit: "600보다 큰 수" }), "list"],
  [13, 89, "활동 03", null, "점점 커지는 수의 순서", "여섯 장의 숫자 카드 1, 2, 3, 4, 5, 6으로 만든 세 자리 자연수 중에서 자리 숫자가 점점 커지는 수들을 골라 가장 작은 수부터 차례대로 나열하였습니다. 5번째로 작은 세 자리 수와 10번째로 작은 세 자리 수를 각각 구하시오.",
    cards(range(6), 3, { direction: "increasing" }), [P("fifth", "(1) 5번째로 작은 수"), P("tenth", "(2) 10번째로 작은 수")]],
  [13, 90, "확인 01", "B10-U3-target-card-sum-01", "서로 다른 카드의 목표 합", `${sumPrompt(6, 9)}${SUMLIST}`, targetCards(6, 9), "list"],
  [13, 90, "확인 02", "B10-U3-target-card-sum-02", "서로 다른 카드의 목표 합", `${sumPrompt(7, 10)}${SUMLIST}`, targetCards(7, 10), "list"],
  [13, 91, "확인 03", "B10-U3-target-card-sum-03", "서로 다른 카드의 목표 합", `${sumPrompt(9, 12)}${SUMLIST}`, targetCards(9, 12), "list"],
  [13, 92, "확인 04", "B10-U3-target-card-sum-04", "서로 다른 카드의 목표 합", `${sumPrompt(9, 15)}${SUMLIST}`, targetCards(9, 15), "list"],
  [13, 93, "도전 1", "B10-U3-digit-sum-count-01", "자리 숫자 합이 같은 수의 개수", "각 자리 숫자의 합이 3인 세 자리 수를 큰 수부터 차례대로 쓰면 300, 210, 201, 120, 111, 102로 6개입니다. 각 자리 숫자의 합이 6인 세 자리 수는 모두 몇 개인지 구하시오.",
    { kind: "book10", subtype: "place-value-sum", target: 6, examples: [300, 210, 201, 120, 111, 102] }, "개"],
  [13, 93, "도전 2", "B10-U3-digit-sum-rank-01", "자리 숫자 합이 같은 수의 순서", "각 자리 숫자의 합이 9인 세 자리 수들을 큰 수부터 차례대로 쓸 때, 16번째 수를 구하시오.",
    { kind: "book10", subtype: "place-value-sum", target: 9, rank: 16, rankFrom: "large" }, null],
  [13, 94, "도전 3", "B10-U3-equal-difference-01", "이웃 자리의 차가 같은 수", "세 자리 수 123, 357, 258, 159는 각각 백의 자리 숫자, 십의 자리 숫자, 일의 자리 숫자가 같은 크기만큼 점점 커집니다. 이와 같은 규칙을 가지는 세 자리 수는 모두 몇 개인지 구하시오.",
    { kind: "book10", subtype: "step-digits", between: "같은 수만큼 커져요", examples: [123, 357, 258, 159] }, "개"],
  [13, 94, "도전 4", "B10-U3-descending-digits-01", "자리 숫자가 차례로 작아지는 수", "500보다 작은 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 작아지는 수는 모두 몇 개인지 구하시오.",
    { kind: "book10", subtype: "step-digits", between: ">", limit: "500보다 작은 수" }, "개"],
  [13, 95, "도전 5", "B10-U3-target-card-sum-05", "서로 다른 카드의 목표 합", `${sumPrompt(9, 15, "네")} (네 수는 작은 수부터 1+2+3+4처럼 쓰고, 여러 개이면 쉼표로 나누어 쓰시오.)`, targetCards(9, 15, 4), "list"],
  [13, 101, "연습 11", "B10-U3-place-direction-03", "점점 커지는 수 모두 쓰기", `다음 네 장의 숫자 카드로 만들 수 있는 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 커지는 수를 모두 구하시오.${LIST}`,
    cards([1, 3, 5, 7], 3, { direction: "increasing" }), "list"],
  [13, 101, "연습 12", "B10-U3-place-direction-04", "점점 커지는 수 모두 쓰기", `1, 2, 3, 4, 5, 6 여섯 장의 숫자 카드로 만들 수 있는 200보다 작은 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 커지는 수를 모두 구하시오.${LIST}`,
    cards(range(6), 3, { direction: "increasing", limit: "200보다 작은 수" }), "list"],
  [13, 102, "연습 13", "B10-U3-place-direction-05", "점점 작아지는 수 모두 쓰기", `다음 여섯 장의 숫자 카드로 만들 수 있는 800보다 큰 세 자리 수 중에서 백의 자리, 십의 자리, 일의 자리 순으로 자리 숫자가 점점 작아지는 수를 모두 구하시오.${LIST}`,
    cards([1, 2, 3, 5, 8, 9], 3, { direction: "decreasing", limit: "800보다 큰 수" }), "list"],
  [13, 103, "연습 14", "B10-U3-target-card-sum-06", "서로 다른 카드의 목표 합", `${sumPrompt(6, 10)}${SUMLIST}`, targetCards(6, 10), "list"],
  [13, 103, "연습 15", "B10-U3-target-card-sum-07", "서로 다른 카드의 목표 합", `${sumPrompt(8, 11)}${SUMLIST}`, targetCards(8, 11), "list"],
  [13, 104, "연습 16", "B10-U3-target-card-sum-08", "서로 다른 카드의 목표 합", `${sumPrompt(9, 14)}${SUMLIST}`, targetCards(9, 14), "list"]
];
const used = new Set(specs.map((s) => s[3]).filter(Boolean));
if (used.size !== 37 || heldU3.some((h) => !used.has(h.sourceNo))) throw new Error("hold mapping");

const build = (lessonNo, unitNo) => specs.filter((s) => s[0] === lessonNo).map(([, page, loc, holdNo, type, prompt, visual, mode], k) => {
  const answerRef = `/books/book-10/lessons/${lessonNo}/original/items/${k}`;
  const item = { id: `book10-guide-p${page}-${lessonNo}-${k + 1}`, unit: unitNo, sourcePage: page, sourceNo: holdNo || `B10-U3-P${page}-${loc.replace(/[^0-9A-Za-z가-힣]+/g, "-").replace(/^-|-$/g, "")}`,
    typeLabel: type, sourceLocator: `교사용 지도서 ${page}쪽 ${loc}`, printGroup: 800 + page, visual, prompt, answerRef };
  if (Array.isArray(mode)) item.parts = mode.map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else if (mode === "list") Object.assign(item, { answerMode: "input", inputMode: "text", resultContract: { type: "set" } });
  else Object.assign(item, { answerMode: "input", inputMode: "numeric", ...(mode ? { unit: mode } : {}) });
  return item;
});
const items12 = build(12, 3), items13 = build(13, 3);
const sample = anchor.experience;
const note = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
const lesson12 = {
  id: ids[0], unit: "조건에 맞는 수", title: "숫자 카드와 경우의 수", sourceLocator: "교사용 지도서 78~86쪽·96~100쪽 · 3단원 활동 01, 더클 확인문제, 더클 연습문제",
  sourceTypeIds: ["book10-digit-card-cases"],
  representativeConcept: "갈림길과 자리마다 고를 수 있는 가짓수를 곱하고, 0은 맨 앞자리에 올 수 없음을 따져 만들 수 있는 수를 셈",
  story: { title: "자리마다 몇 가지일까?", text: "길을 고르고, 숫자 카드를 놓고, 전구를 켜는 문제를 지도서 순서대로 풀어요.", mission: "자리마다 고를 수 있는 가짓수를 먼저 쓰고 곱해 보세요." },
  explanation: { headline: "자리마다 고를 수 있는 가짓수를 곱해요", steps: ["갈림길은 구간마다 고를 수 있는 길의 수를 곱합니다.", "카드를 한 번씩만 쓰면 다음 자리로 갈 때마다 고를 카드가 하나씩 줄어듭니다.", "0 카드는 맨 앞자리에 놓을 수 없으니 맨 앞자리에서 0을 빼고 셉니다.", "같은 숫자를 여러 번 써도 되면 자리마다 고를 수가 그대로입니다. 켜고 끄는 전구도 전구마다 2가지입니다."] },
  experience: { ...sample, family: "digit-card-cases-b10", title: "자리마다 고를 수 있는 카드를 세요",
    beats: [
      { id: "unit3-cases-step-1", action: "reveal", caption: "2, 5, 7 카드로 두 자리 수를 만들어요. 십의 자리에는 카드 3장 중 하나를 놓아요.", visual: cards([2, 5, 7], 2, { choiceCounts: [3, null] }) },
      { id: "unit3-cases-step-2", action: "highlight", caption: "한 장을 썼으니 일의 자리에는 남은 2장 중 하나를 놓아요.", visual: cards([2, 5, 7], 2, { choiceCounts: [3, 2] }) },
      { id: "unit3-cases-step-3", action: "verify", caption: "자리마다 가짓수를 곱하면 3 × 2 = 6개예요.", visual: note(["3 × 2 = 6", "25, 27, 52, 57, 72, 75"]) }
    ], hint: "맨 앞자리부터 고를 수 있는 카드 수를 써 보세요.",
    check: { prompt: "1, 4, 6, 9 카드를 한 번씩만 써서 만드는 두 자리 수는 모두 몇 개일까요?", options: ["8개", "12개", "16개"], answerRef: "/books/book-10/lessons/12/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items12.length, structureKey: ids[0], prompt: "지도서 3단원 활동·확인·연습 문항을 푸시오.", items: items12 },
  extension: { title: "추가 학습", structureKey: ids[0], story: "숫자 카드로 세 자리 수를 만듭니다.", prompt: "0, 3, 5, 7 네 장의 숫자 카드를 한 번씩만 써서 만들 수 있는 세 자리 수는 모두 몇 개인지 구하시오.",
    visual: cards([0, 3, 5, 7], 3), answerMode: "input", inputMode: "numeric", unit: "개", extensionKind: "source-structured-authored", answerRef: "/books/book-10/lessons/12/extension" }
};
const lesson13 = {
  id: ids[1], unit: "조건에 맞는 수", title: "점점 커지는 수와 카드의 합", sourceLocator: "교사용 지도서 87~95쪽·101~104쪽 · 3단원 활동 02, 더클 확인문제, 더클 도전문제, 더클 연습문제",
  sourceTypeIds: ["book10-ordered-digit-sum"],
  representativeConcept: "자리 숫자가 점점 커지거나 작아지는 수, 합이 정해진 카드 묶음을 작은 수부터 차례로 빠짐없이 찾음",
  story: { title: "빠짐없이, 겹치지 않게", text: "점점 커지는 수, 점점 작아지는 수, 합이 같은 카드 묶음을 나뭇가지처럼 차례로 찾아요.", mission: "맨 앞 숫자를 하나씩 정하고 그다음 숫자를 차례로 늘려 가세요." },
  explanation: { headline: "맨 앞 숫자를 정하고 차례로 찾아요", steps: ["점점 커지는 수는 고른 숫자를 작은 순서로 놓는 방법이 하나뿐입니다.", "맨 앞 숫자를 정하고 둘째 숫자를 차례로 늘려 가면 빠짐없이 찾을 수 있습니다.", "합이 정해진 카드 묶음도 가장 작은 카드부터 정하고 남은 합을 나누어 찾습니다.", "순서만 다른 묶음은 한 가지로 봅니다."] },
  experience: { ...sample, family: "ordered-digit-sum-b10", title: "맨 앞 카드를 정하고 차례로 찾아요",
    beats: [
      { id: "unit3-order-step-1", action: "reveal", caption: "1부터 5까지 카드 중 세 장의 합이 9인 묶음을 찾아요. 가장 작은 카드를 1로 정해요.", visual: targetCards(5, 9) },
      { id: "unit3-order-step-2", action: "highlight", caption: "1을 정하면 남은 두 장의 합은 8이에요. 3과 5가 돼요.", visual: note(["1 + 3 + 5 = 9"]) },
      { id: "unit3-order-step-3", action: "verify", caption: "가장 작은 카드를 2로 정하면 남은 합은 7, 3과 4가 돼요. 모두 2가지예요.", visual: note(["1 + 3 + 5 = 9", "2 + 3 + 4 = 9"]) }
    ], hint: "가장 작은 카드부터 정하고 남은 합을 나누어 보세요.",
    check: { prompt: "1, 3, 5, 8 카드로 만드는 세 자리 수 중 자리 숫자가 점점 커지는 수는 몇 개일까요?", options: ["4개", "6개", "24개"], answerRef: "/books/book-10/lessons/13/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items13.length, structureKey: ids[1], prompt: "지도서 3단원 활동·확인·도전·연습 문항을 푸시오.", items: items13 },
  extension: { title: "추가 학습", structureKey: ids[1], story: "숫자 카드로 점점 커지는 수를 만듭니다.", prompt: "2, 3, 5, 6, 9 다섯 장의 숫자 카드로 만들 수 있는 세 자리 수 중에서 자리 숫자가 점점 커지는 수는 모두 몇 개인지 구하시오.",
    visual: cards([2, 3, 5, 6, 9], 3, { direction: "increasing" }), answerMode: "input", inputMode: "numeric", unit: "개", extensionKind: "source-structured-authored", answerRef: "/books/book-10/lessons/13/extension" }
};
for (const l of [lesson12, lesson13]) delete l.experience.model;
for (const l of [lesson12, lesson13]) for (const key of ["visualProgression"]) if (key in l.experience) l.experience[key] = null;
b10.lessons.splice(b10.lessons.indexOf(anchor) + 1, 0, lesson12, lesson13);

// ── 장부: 3단원 보류 37건 해제, 장부에 없던 문항 8개 새로 셈 ──
const extra = specs.filter((s) => !s[3]).length;
b10.sourceHold = b10.sourceHold.filter((h) => !/^B10-U3-/.test(h.sourceNo));
const cov = b10.sourceCoverage;
const u3 = cov.byUnit.find((u) => u.unit === 3);
u3.public += u3.hold + extra; u3.total += extra; u3.hold = 0;
for (const c of cov.catalog.filter((c) => c.unit === 3)) { c.public += c.hold; c.hold = 0; }
cov.catalog.push({ unit: 3, unitTitle: u3.title, id: "guide-activity-extra-u3", label: "장부에 없던 지도서 활동 문항(78~89쪽)", total: extra, minimumArithmetic: false, public: extra, hold: 0 });
cov.total = cov.byUnit.reduce((n, u) => n + u.total, 0);
cov.public = cov.byUnit.reduce((n, u) => n + u.public, 0);
cov.hold = cov.byUnit.reduce((n, u) => n + u.hold, 0);
if (cov.hold !== b10.sourceHold.length) throw new Error(`hold count ${cov.hold} vs ${b10.sourceHold.length}`);
b10.source.note = `교사용 지도서의 활동 슬롯을 장부화했습니다. 2단원(52~66쪽)과 3단원(78~104쪽, 쪽 그림을 읽지 못한 97쪽 제외)은 원본 대조를 마쳐 보류가 없습니다. 전체 ${cov.total}개 중 공개 ${cov.public}개, 보류 ${cov.hold}개.`;
// 묶음 2 단원의 단원 표시가 숫자(2)로만 나오던 것을 단원 이름으로 바꾼다.
const batch2 = b10.lessons.find((l) => l.id === "sum-difference-activities-source");
if (batch2 && batch2.unit === 2) batch2.unit = "합과 차 문제 해결";

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book10 batch3 patched", { items12: items12.length, items13: items13.length, extra, holds: b10.sourceHold.length, total: cov.total, public: cov.public });
