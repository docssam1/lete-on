// 골든벨 5권 묶음 7(마지막): 교사용 슬라이드 16·33·51~58·60 「삼각수와 악수하기·둘레·사각수와 제곱수·똑같이 가르기」.
// 이 스크립트에는 정답이 없다(고르기형 보기는 공개, 정답 보기는 비공개 DB에만). node patch-book05-batch7.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
if (book.lessons.some((l) => l.id === "triangle-number-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs) => specs.map((spec, k) => {
  let item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: spec.options ? "choice" : "input", ...(spec.options ? { options: spec.options } : { inputMode: "numeric" }), prompt: spec.prompt, answerRef: `/books/book-05/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const experience = (lessonNo, family, title, beats, hint, check) => ({
  ...JSON.parse(JSON.stringify(L0.experience)), family, title, beats, hint, check: { ...check, answerRef: `/books/book-05/lessons/${lessonNo}/experience/check` }
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const L14No = book.lessons.length, L15No = L14No + 1, L16No = L14No + 2, L17No = L14No + 3;
const TABLE_NOTE = "원본은 교사가 설명할 때 쓰는 표라 화면에서는 고르기 물음으로 바꿨습니다.";

// ── 단원 14: 삼각수와 악수하기 (33·51~55쪽) ──
const triTable = V("source-text-table", { cells: [["", "1부터 연속한 자연수의 합", "삼각수"], ["△1", "1", "1"], ["△2", "1+2", "3"], ["△3", "1+2+3", "6"], ["△4", "1+2+3+4", "10"], ["△5", "1+2+3+4+5", "15"]] });
const sum = (n, parity, total, example) => V("source-sum-line", { n, parity, ...(total == null ? {} : { total }), ...(example ? { example } : {}) });
const EVEN = "삼각수 계산 연습 ① 짝수 개: 앞뒤에서 하나씩 짝지어 더합니다. □에는 짝지은 두 수의 합, △에는 짝의 개수를 쓰시오.";
const ODD = "삼각수 계산 연습 ② 홀수 개: □에는 가운데 수, △에는 더한 수의 개수를 쓰고, 계산한 값을 구하시오.";
const HAND = "악수하기: 모인 사람이 서로 한 번씩 악수합니다.";
const RPS = "A, B, C, D가 서로 한 번씩 빠짐없이 가위바위보를 하려고 합니다.";
const L14Specs = [
  { no: "GB5-S33-01-1", loc: "교사용 슬라이드 33 연산골든벨 4호 삼각수 연습 표", group: 1, type: "삼각수 표", visual: triTable, discrepancy: TABLE_NOTE,
    prompt: "1부터 연속한 자연수의 합을 삼각수라고 합니다. △4 = 1+2+3+4를 짝수 개 계산법(앞뒤로 짝짓기)으로 나타낸 것은?", options: ["4 × 3", "5 × 2", "2 × 4"] },
  { no: "GB5-S33-01-2", loc: "교사용 슬라이드 33 연산골든벨 4호 삼각수 연습 표", group: 1, type: "삼각수 표", visual: triTable,
    prompt: "△5 = 1+2+3+4+5를 홀수 개 계산법(가운데 수 × 개수)으로 나타낸 것은?", options: ["5 × 2", "4 × 4", "3 × 5"] },
  { no: "GB5-S51-01-1", loc: "교사용 슬라이드 51 활동 01 삼각수 개념", group: 2, type: "삼각수 규칙", visual: V("source-dot-figures", { shape: "triangle", counts: [1, 2, 3, 4] }),
    prompt: "다음 모양들의 점의 개수는 어떤 규칙으로 늘어날까요?", options: ["1, 1+2, 1+2+3, 1+2+3+4처럼 1부터 차례로 더합니다.", "1, 2, 4, 8처럼 두 배씩 늘어납니다.", "1, 3, 5, 7처럼 2씩 늘어납니다."],
    discrepancy: "원본은 말로 답하는 물음이라 화면에서는 고르기형으로 바꿨습니다." },
  { no: "GB5-S51-01-2", loc: "교사용 슬라이드 51 활동 01 △8", group: 2, type: "삼각수 구하기", visual: V("source-text-table", { cells: [["△1", "1"], ["△2", "3"], ["△3", "6"], ["△4", "10"]] }),
    prompt: "위와 같이 1부터 연속된 자연수의 합을 삼각수라고 합니다. △8은 얼마일까요?" },
  { no: "GB5-S51-02-1", loc: "교사용 슬라이드 51 삼각수 계산연습 ① △8", group: 3, type: "짝수 개 계산", visual: sum(8, "even", 36), prompt: `${EVEN} (△8)`, parts: ["□", "△"] },
  { no: "GB5-S51-02-2", loc: "교사용 슬라이드 51 삼각수 계산연습 ① △10", group: 3, type: "짝수 개 계산", visual: sum(10, "even", 55), prompt: `${EVEN} (△10)`, parts: ["□", "△"] },
  { no: "GB5-S51-03-1", loc: "교사용 슬라이드 51 삼각수 계산연습 ② △3", group: 3, type: "홀수 개 계산", visual: sum(3, "odd"), prompt: `${ODD} (△3)`, parts: ["□", "△", "값"],
    discrepancy: "원본 ② 홀수 개 줄에는 □ × △ 칸이 교사용 표시로만 있어, 화면에서는 「□ × △ = ?」 칸을 넣었습니다." },
  { no: "GB5-S51-03-2", loc: "교사용 슬라이드 51 삼각수 계산연습 ② △5", group: 3, type: "홀수 개 계산", visual: sum(5, "odd"), prompt: `${ODD} (△5)`, parts: ["□", "△", "값"] },
  { no: "GB5-S51-03-3", loc: "교사용 슬라이드 51 삼각수 계산연습 ② △7", group: 3, type: "홀수 개 계산", visual: sum(7, "odd"), prompt: `${ODD} (△7)`, parts: ["□", "△", "값"] },
  { no: "GB5-S52-01-1", loc: "교사용 슬라이드 52 활동 01 악수하기 (1)", group: 4, type: "악수 횟수", visual: V("source-handshake", { nodes: ["A", "B"], newNode: "C", caption: "2명 → 1번" }), prompt: `${HAND} 이때 C가 온다면 C는 몇 번 악수할까요?` },
  { no: "GB5-S52-01-2", loc: "교사용 슬라이드 52 활동 01 악수하기 (2)", group: 4, type: "악수 횟수", visual: V("source-handshake", { nodes: ["A", "B", "C"], newNode: "D", caption: "3명 → 3번" }), prompt: `${HAND} 이때 D가 온다면 D는 몇 번 악수할까요?` },
  { no: "GB5-S52-01-3", loc: "교사용 슬라이드 52 활동 01 악수하기 (3)", group: 4, type: "악수 횟수", visual: V("source-handshake", { nodes: ["A", "B", "C", "D"], newNode: "E", caption: "4명 → 6번" }), prompt: `${HAND} 이때 E가 온다면 E는 몇 번 악수할까요?` },
  ...[[8, 28], [11, 55]].map(([people, total], k) => ({ no: `GB5-S52-01-${k + 4}`, loc: "교사용 슬라이드 52 활동 01 사람 수와 악수 횟수", group: 4, type: "악수 횟수와 삼각수",
    visual: V("source-text-table", { cells: [["사람 수", "악수 횟수", ""], ["2명", "1", "1번"], ["3명", "1+2", "3번"], ["4명", "1+2+3", "6번"], ["5명", "1+2+3+4", "10번"], [`${people}명`, "1+2+3+…+□", `${total}번`]] }),
    prompt: `사람 수와 악수 횟수를 정리한 표입니다. ${people}명일 때 1+2+3+…+□에서 □에 알맞은 수는?` })),
  { no: "GB5-S53-02-1", loc: "교사용 슬라이드 53 활동 02 (1)", group: 5, type: "가위바위보 횟수", prompt: `(1) ${RPS} 가위바위보를 총 몇 번 하게 될까요?` },
  { no: "GB5-S53-02-2", loc: "교사용 슬라이드 53 활동 02 (2)", group: 5, type: "가위바위보 횟수", prompt: "(2) A, B, C, D, E, F, G 총 7명이 서로 한 번씩 빠짐없이 가위바위보를 하면 총 몇 번 하게 될까요?" },
  { no: "GB5-S53-02-3", loc: "교사용 슬라이드 53 활동 02 (3)", group: 5, type: "악수 횟수", prompt: "(3) A, B, C, D, E, F가 서로 한 번씩 빠짐없이 악수를 하려고 합니다. 악수는 모두 몇 번 하게 될까요?" },
  { no: "GB5-S53-02-4", loc: "교사용 슬라이드 53 활동 02 (4)", group: 5, type: "악수 횟수로 사람 수", visual: V("source-text-table", { cells: [["△ (모두 한 악수)", "□ (학생 수)"], ["21번", "가"], ["28번", "나"], ["55번", "다"]] }),
    prompt: "(4) □명의 학생이 서로 한 번씩 악수를 합니다. 모두 △번 했을 때 학생 수는 몇 명일까요?", parts: ["가", "나", "다"] },
  ...[6, 12, 15].map((dots, k) => ({ no: `GB5-S54-03-${k + 1}`, loc: `교사용 슬라이드 54 활동 03 (${k + 1})`, group: 6, type: "두 점을 잇는 선분", prompt: `□개의 점 중 두 점을 연결한 선분의 개수를 구하시오. (${k + 1}) □ = ${dots}` })),
  ...[3, 4, 5, 6, 7, 8, 9, 10].map((n, k) => ({ no: `GB5-S54-04-${k + 1}`, loc: `교사용 슬라이드 54 활동 04 (${k + 1})`, group: 6, type: "두 장 뽑는 경우의 수",
    prompt: `N장의 숫자 카드 중에서 서로 다른 두 장을 뽑는 경우의 수를 구하시오. (${k + 1}) ${n}장`, visual: n <= 5 ? V("source-digit-cards", { digits: Array.from({ length: n }, (_, i) => String(i + 1)) }) : undefined })),
  ...[[28, "05"], [15, "05 Q1"], [21, "05 Q2"]].map(([ways, label], k) => ({ no: `GB5-S55-05-${k + 1}`, loc: `교사용 슬라이드 55 활동 ${label}`, group: 7, type: "경우의 수로 카드 장수",
    prompt: `숫자 카드 중에서 서로 다른 2장을 뽑는 방법이 ${ways}가지일 때 숫자 카드는 모두 몇 장일까요?` })),
  ...[[4, false], [6, false], [4, true], [6, true]].map(([cells, cross], k) => ({ no: `GB5-S55-06-${k + 1}`, loc: `교사용 슬라이드 55 활동 06 ${cross ? "SE " : ""}그림 ${k % 2 + 1}`, group: 7, type: "크고 작은 삼각형",
    prompt: `다음 그림에서 찾을 수 있는 크고 작은 삼각형의 개수를 구하시오. (${cross ? "도전 " : ""}그림 ${k % 2 + 1})`, visual: V("source-fan-triangle", { cells, cross }),
    discrepancy: cross && k === 2 ? "원본의 「SE」 그림 두 개는 물음 문장이 없어 06과 같은 물음을 붙였습니다." : undefined }))
];
const L14 = {
  id: "triangle-number-source", unit: "삼각수와 악수하기", title: "삼각수와 악수하기", sourceLocator: "교사용 슬라이드 33·51~55 활동 01~06",
  sourceTypeIds: ["triangle-number-source"], representativeConcept: "1부터 연속한 자연수의 합(삼각수)을 짝짓기로 계산하고, 악수·가위바위보·선분·두 장 뽑기의 수가 삼각수와 같음을 앎",
  story: { title: "교실에 한 명씩 들어와요", text: "새로 온 친구는 먼저 와 있던 친구 모두와 한 번씩 악수합니다.", mission: "사람이 늘 때마다 악수가 몇 번 늘어나는지 세어 보세요." },
  explanation: { headline: "1부터 차례로 더한 수가 삼각수이고, 악수·가위바위보·선분·두 장 뽑기의 수는 모두 삼각수입니다.",
    steps: ["1부터 차례로 더한 수를 삼각수라고 합니다.", "짝수 개는 앞뒤로 짝지어 (두 수의 합) × (짝의 개수)로 계산합니다.", "홀수 개는 (가운데 수) × (더한 수의 개수)로 계산합니다.", "N명이 한 번씩 악수하면 1부터 N-1까지 더한 수만큼 악수합니다."] },
  experience: experience(L14No, "triangle-number", "삼각수를 알아봐요", [
    { id: "triangle-number-step-1", action: "reveal", caption: "점을 삼각형으로 놓으면 1, 1+2, 1+2+3, 1+2+3+4개입니다. 이런 수를 삼각수라고 합니다.", visual: V("source-dot-figures", { shape: "triangle", counts: [1, 2, 3, 4] }) },
    { id: "triangle-number-step-2", action: "highlight", caption: "1+2+3+4는 앞뒤로 짝지으면 1+4, 2+3으로 5가 2개입니다.", visual: sum(4, "even", 10) },
    { id: "triangle-number-step-3", action: "verify", caption: "5 × 2 = 10이므로 △4는 10입니다.", visual: sum(4, "even", 10, [5, 2]) }
  ], "짝수 개는 앞뒤로 짝지어 더하면 쉽습니다.", { prompt: "△5 = 1+2+3+4+5는 얼마일까요?", options: ["10", "15", "21"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L14Specs.length, structureKey: "triangle-number-source", prompt: EVEN, visual: V("source-dot-figures", { shape: "triangle", counts: [1, 2, 3, 4] }), items: build(L14No, "triangle-number-source", L14Specs) },
  extension: { title: "추가 학습", structureKey: "triangle-number-source", story: "모인 사람이 서로 한 번씩 악수합니다.", prompt: "9명이 서로 한 번씩 악수하면 모두 몇 번 악수할까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L14No}/extension` }
};

// ── 단원 15: 둘레 (56쪽) ──
const L15Specs = [
  { no: "GB5-S56-01-1", loc: "교사용 슬라이드 56 연산골든벨 01", group: 1, type: "같은 간격으로 자르기", prompt: "같은 간격으로 자를 때 한 조각의 길이는?", visual: V("source-segment", { pieces: 4, total: 40 }) },
  ...[24, 48, 52, 84].map((p, k) => ({ no: `GB5-S56-02-${k + 1}`, loc: `교사용 슬라이드 56 연산골든벨 02 (${k + 1})`, group: 2, type: "마름모 한 변의 길이",
    prompt: `마름모는 네 변의 길이가 같습니다. 둘레가 40이면 한 변은 10입니다. 둘레가 ${p}일 때 한 변의 길이는?`, visual: V("source-perimeter", { shape: "rhombus" }) })),
  ...[[5, 3], [8, 5]].map(([w, h], k) => ({ no: `GB5-S56-03-${k + 1}`, loc: `교사용 슬라이드 56 연산골든벨 03 그림 ${k + 1}`, group: 3, type: "직사각형의 둘레",
    prompt: `직사각형의 둘레는 (가로 + 세로) × 2입니다. 다음 직사각형의 둘레를 구하시오. (그림 ${k + 1})`, visual: V("source-perimeter", { shape: "rect", w, h }) }))
];
const L15 = {
  id: "perimeter-source", unit: "둘레", title: "둘레 구하기", sourceLocator: "교사용 슬라이드 56 연산골든벨 01~03",
  sourceTypeIds: ["perimeter-source"], representativeConcept: "네 변이 같은 마름모는 둘레를 4로 나누고, 직사각형은 (가로+세로)×2로 둘레를 구함",
  story: { title: "울타리 두르기", text: "도형의 테두리를 한 바퀴 두른 길이가 둘레입니다.", mission: "변의 길이를 모두 더해 둘레를 구해 보세요." },
  explanation: { headline: "둘레는 테두리 한 바퀴의 길이입니다.", steps: ["도형에 변이 몇 개인지 셉니다.", "마름모는 네 변의 길이가 모두 같습니다.", "직사각형은 가로 2개, 세로 2개입니다.", "모든 변을 더하면 둘레입니다."] },
  experience: experience(L15No, "perimeter", "둘레를 구해요", [
    { id: "perimeter-step-1", action: "reveal", caption: "마름모는 네 변의 길이가 같습니다. 둘레가 20이면 5+5+5+5=20이므로 한 변은 5입니다.", visual: V("source-perimeter", { shape: "rhombus" }) },
    { id: "perimeter-step-2", action: "highlight", caption: "직사각형은 가로와 세로가 2개씩 있습니다.", visual: V("source-perimeter", { shape: "rect", w: 4, h: 2 }) },
    { id: "perimeter-step-3", action: "verify", caption: "가로 4, 세로 2이면 (4+2)×2=12가 둘레입니다.", visual: V("source-perimeter", { shape: "rect", w: 4, h: 2 }) }
  ], "같은 길이의 변이 몇 개인지 먼저 세어 봅니다.", { prompt: "마름모의 둘레가 32일 때 한 변의 길이는 얼마일까요?", options: ["16", "8", "4"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L15Specs.length, structureKey: "perimeter-source", prompt: "둘레 구하기", visual: V("source-perimeter", { shape: "rect", w: 4, h: 2 }), items: build(L15No, "perimeter-source", L15Specs) },
  extension: { title: "추가 학습", structureKey: "perimeter-source", story: "직사각형의 둘레는 (가로 + 세로) × 2입니다.", prompt: "가로 6, 세로 4인 직사각형의 둘레를 쓰세요.",
    visual: V("source-perimeter", { shape: "rect", w: 6, h: 4 }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L15No}/extension` }
};

// ── 단원 16: 사각수와 제곱수 (16·57·58쪽) ──
const sqTable = V("source-text-table", { cells: [["", "1부터 연속한 홀수들의 합", "사각수"], ["□1", "1", "1"], ["□2", "1+3", "4"], ["□3", "1+3+5", "9"], ["□4", "1+3+5+7", "16"], ["□☆", "☆번째 홀수까지의 합", "?"]] });
const OS = "다음을 계산하시오.";
const L16Specs = [
  { no: "GB5-S16-01-1", loc: "교사용 슬라이드 16 연산골든벨 4호 사각수 연습 표", group: 1, type: "사각수 표", visual: sqTable, discrepancy: TABLE_NOTE,
    prompt: "1부터 연속한 홀수들의 합을 사각수라고 합니다. 1부터 ☆번째 홀수까지의 합은 어떤 수와 같을까요?", options: ["☆ + ☆", "☆ × ☆", "☆ × 2"] },
  { no: "GB5-S57-01-1", loc: "교사용 슬라이드 57 활동 01 사각수 개념", group: 2, type: "사각수 규칙", visual: V("source-dot-figures", { shape: "square", counts: [1, 2, 3, 4, 5], labels: ["1", "1+3", "1+3+5", "1+3+5+7", "1+3+5+7+9"] }),
    prompt: "다음 모양들의 점의 개수는 어떤 규칙으로 늘어날까요?", options: ["1, 2, 3, 4, 5처럼 하나씩 늘어납니다.", "1, 1+2, 1+2+3처럼 1부터 차례로 더합니다.", "1, 1+3, 1+3+5처럼 1부터 홀수를 차례로 더합니다."],
    discrepancy: "원본은 말로 답하는 물음이라 화면에서는 고르기형으로 바꿨습니다." },
  { no: "GB5-S57-01-2", loc: "교사용 슬라이드 57 활동 01 □6", group: 2, type: "사각수 구하기", visual: V("source-text-table", { cells: [["□1", "1"], ["□2", "1+3"], ["□3", "1+3+5"], ["□4", "1+3+5+7"]] }),
    prompt: "이와 같이 1부터 연속된 홀수들의 합을 사각수라고 합니다. □6은 얼마일까요?" },
  { no: "GB5-S57-02-1", loc: "교사용 슬라이드 57 활동 01 (1)", group: 3, type: "연속한 홀수의 합", prompt: `${OS} (1) 1+3+5+7` },
  { no: "GB5-S57-02-2", loc: "교사용 슬라이드 57 활동 01 (2)", group: 3, type: "연속한 홀수의 합", prompt: `${OS} (2) 1+3+5+…+11` },
  { no: "GB5-S57-02-3", loc: "교사용 슬라이드 57 활동 01 (3)", group: 3, type: "연속한 홀수의 합", prompt: `${OS} (3) 1+3+5+…+19` },
  { no: "GB5-S57-02-4", loc: "교사용 슬라이드 57 활동 01 (4)", group: 3, type: "합이 되는 마지막 홀수", prompt: "(4) 1+3+5+…+□ = 25에서 □에 알맞은 홀수는?" },
  { no: "GB5-S57-02-5", loc: "교사용 슬라이드 57 활동 01 (5)", group: 3, type: "합이 되는 마지막 홀수", prompt: "(5) 1+3+5+…+□ = 49에서 □에 알맞은 홀수는?" },
  { no: "GB5-S58-02-1", loc: "교사용 슬라이드 58 활동 02", group: 4, type: "사각수 수열", prompt: "다음과 같이 일정한 규칙으로 수를 나열할 때, 9번째 수는?", visual: V("source-sequence", { values: [1, 4, 9, 16, 25], more: true }) },
  { no: "GB5-S58-03-1", loc: "교사용 슬라이드 58 활동 03", group: 4, type: "사각수를 더한 수열", prompt: "다음과 같이 일정한 규칙으로 수를 나열할 때, 8번째 수는?", visual: V("source-sequence", { values: [0, 1, 5, 14, 30, 55], more: true }) },
  { no: "GB5-S58-04-1", loc: "교사용 슬라이드 58 활동 04", group: 4, type: "검은 돌과 흰 돌", visual: V("source-stone-rows", { rows: [1, 3, 5, 7] }),
    prompt: "다음과 같은 규칙으로 검은 돌, 흰 돌을 번갈아가며 놓았습니다. 검은 돌과 흰 돌을 합쳐 36개가 될 때 검은 돌과 흰 돌의 개수는 몇 개 차이날까요?" }
];
const L16 = {
  id: "square-number-source", unit: "사각수와 제곱수", title: "사각수와 제곱수", sourceLocator: "교사용 슬라이드 16·57·58 활동 01~04",
  sourceTypeIds: ["square-number-source"], representativeConcept: "1부터 연속한 홀수의 합(사각수)은 같은 수를 두 번 곱한 수이고, 홀수 개수로 합을 바로 구함",
  story: { title: "점으로 네모 만들기", text: "점 네모를 한 겹씩 크게 하면 홀수만큼 점이 늘어납니다.", mission: "홀수를 몇 개 더했는지 세어 사각수를 구해 보세요." },
  explanation: { headline: "1부터 홀수를 ☆개 더하면 ☆ × ☆입니다.", steps: ["점 네모를 한 겹 키울 때 늘어나는 점은 3, 5, 7, …개입니다.", "1부터 홀수를 몇 개 더했는지 셉니다.", "더한 개수를 두 번 곱하면 합입니다.", "합에서 거꾸로 개수를 찾으면 마지막 홀수도 알 수 있습니다."] },
  experience: experience(L16No, "square-number", "사각수를 알아봐요", [
    { id: "square-number-step-1", action: "reveal", caption: "점을 네모로 놓으면 1, 1+3, 1+3+5개입니다. 이런 수를 사각수라고 합니다.", visual: V("source-dot-figures", { shape: "square", counts: [1, 2, 3] }) },
    { id: "square-number-step-2", action: "highlight", caption: "1+3+5는 홀수 3개를 더한 것이고, 점이 가로 3줄, 세로 3줄입니다.", visual: V("source-dot-figures", { shape: "square", counts: [3] }) },
    { id: "square-number-step-3", action: "verify", caption: "3 × 3 = 9이므로 1+3+5는 9입니다.", visual: V("source-dot-figures", { shape: "square", counts: [3], labels: ["3 × 3 = 9"] }) }
  ], "홀수를 몇 개 더했는지 세면 바로 구할 수 있습니다.", { prompt: "1+3+5는 얼마일까요?", options: ["6", "9", "8"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L16Specs.length, structureKey: "square-number-source", prompt: OS, visual: V("source-dot-figures", { shape: "square", counts: [1, 2, 3] }), items: build(L16No, "square-number-source", L16Specs) },
  extension: { title: "추가 학습", structureKey: "square-number-source", story: "1부터 홀수를 차례로 더합니다.", prompt: "1+3+5+…+15는 얼마일까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L16No}/extension` }
};

// ── 단원 17: 똑같이 가르기 (60쪽) ──
const tree = (top, levels, values) => V("source-halving-tree", { top, levels, ...(values ? { values } : {}) });
const H1 = "윗수를 똑같이 둘로 가르시오.", H2 = "윗수를 똑같이 둘로 가르고, 가른 수를 또 똑같이 둘로 가르시오.";
const L17Specs = [
  ...[24, 68, 82, 106, 204, 38, 52, 76, 94, 116].map((top, k) => ({ no: `GB5-S60-01-${k + 1}`, loc: `교사용 슬라이드 60 연산골든벨 01 가르기 ${k + 1}`, group: k < 5 ? 1 : 2, type: "똑같이 가르기", prompt: `${H1} (${k + 1})`, visual: tree(top, 1), parts: ["가", "나"] })),
  ...[28, 52, 96, 116, 212].map((top, k) => ({ no: `GB5-S60-01-${k + 11}`, loc: `교사용 슬라이드 60 연산골든벨 01 가르기 ${k + 11}`, group: 3, type: "두 번 똑같이 가르기", prompt: `${H2} (${k + 11})`, visual: tree(top, 2), parts: ["가", "나", "다", "라", "마", "바"] }))
];
const L17 = {
  id: "halving-tree-source", unit: "똑같이 가르기", title: "똑같이 가르기", sourceLocator: "교사용 슬라이드 60 연산골든벨 01",
  sourceTypeIds: ["halving-tree-source"], representativeConcept: "십의 자리와 일의 자리를 각각 똑같이 나누어 수를 반씩 가르고, 가른 수를 또 반으로 가름",
  story: { title: "똑같이 나눠 먹기", text: "두 사람이 똑같이 나누면 둘 다 같은 수를 가집니다.", mission: "큰 수를 자리마다 나누어 똑같이 갈라 보세요." },
  explanation: { headline: "똑같이 가르면 두 수가 같고, 두 수를 더하면 윗수가 됩니다.", steps: ["윗수를 십의 자리와 일의 자리로 나누어 봅니다.", "각 자리를 똑같이 둘로 나눕니다.", "나눈 수를 다시 합쳐 한 쪽의 수를 구합니다.", "두 수를 더해 윗수가 되는지 확인합니다."] },
  experience: experience(L17No, "halving-tree", "똑같이 갈라요", [
    { id: "halving-tree-step-1", action: "reveal", caption: "40을 똑같이 가르면 20과 20입니다. 20+20=40입니다.", visual: tree(40, 1, [20, 20]) },
    { id: "halving-tree-step-2", action: "highlight", caption: "80을 똑같이 가르면 40과 40입니다.", visual: tree(80, 2, [40, 40]) },
    { id: "halving-tree-step-3", action: "verify", caption: "40을 또 똑같이 가르면 20과 20이므로 맨 아래는 모두 20입니다.", visual: tree(80, 2, [40, 40, 20, 20, 20, 20]) }
  ], "십의 자리와 일의 자리를 따로 나누면 쉽습니다.", { prompt: "60을 똑같이 둘로 가르면 한 쪽은 얼마일까요?", options: ["30", "20", "15"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L17Specs.length, structureKey: "halving-tree-source", prompt: H1, visual: tree(40, 1), items: build(L17No, "halving-tree-source", L17Specs) },
  extension: { title: "추가 학습", structureKey: "halving-tree-source", story: "윗수를 똑같이 두 번 가릅니다.", prompt: "84를 똑같이 두 번 가르면 맨 아래 칸의 수는 얼마일까요?",
    visual: tree(84, 2), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L17No}/extension` }
};
book.lessons.push(L14, L15, L16, L17);

const cleared = new Set(["S16", "S33", "S51", "S52", "S53", "S54", "S55", "S56", "S57", "S58", "S60"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 11) throw new Error(`hold count ${before - book.sourceHold.length}`);
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch7 patched", { L14: L14.original.items.length, L15: L15.original.items.length, L16: L16.original.items.length, L17: L17.original.items.length, lessonNos: [L14No, L15No, L16No, L17No], coverage: book.sourceCoverage });
