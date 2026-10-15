// 골든벨 5권 묶음 4: 교사용 슬라이드 26~32 「숫자 카드·조건에 맞는 두 자리 수」 48문항.
// 이 스크립트에는 정답이 없다(정답은 비공개 DB에만). node patch-book05-batch4.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
if (book.lessons.some((l) => l.id === "two-digit-condition-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");
const L1 = book.lessons.find((l) => l.id === "digit-card-ranked-number");

const cards = (digits, ask) => ({ kind: "book5", subtype: "source-digit-cards", digits, ...(ask ? { ask } : {}) });
const COUNT = "다음 숫자카드가 1장씩만 있을 때, 조건에 맞는 수의 개수를 구하시오.";
const MAKE = "다음 세 장의 숫자카드를 한 번씩만 써서 만들 수 있는 서로 다른 수의 개수를 모두 구하시오.";
const RANK3 = "다음 세 장의 숫자카드를 한 번씩만 써서 수를 만듭니다.";
const CHALLENGE = "도전 다음 숫자카드가 1장씩만 있을 때 물음에 답하시오.";
const L1Specs = [
  ...["한 자리 수", "두 자리 수", "세 자리 수", "네 자리 수"].map((ask, k) => ({ no: `GB5-S26-01-${k + 1}`, loc: `교사용 슬라이드 26 활동 01 (3) ${ask}`, group: 3, type: "숫자 카드로 만든 수의 개수",
    prompt: `(3) ${COUNT} — ${ask}`, visual: cards([1, 2, 3, 4], ask) })),
  ...["두 자리 수 중 6번째로 큰 수", "세 자리 수 중 5번째로 작은 수", "세 자리 수 중 8번째로 큰 수", "네 자리 수 중 10번째로 작은 수"].map((ask, k) => ({ no: `GB5-S26-01-${k + 5}`, loc: `교사용 슬라이드 26 활동 01 (3) Q${k + 1}`, group: 3, type: "숫자 카드로 만든 수의 차례",
    prompt: `(3) 숫자카드 1, 2, 3, 4가 1장씩 있을 때, 만들 수 있는 ${ask}는?`, visual: cards([1, 2, 3, 4]) })),
  ...["두 자리 수", "세 자리 수"].map((ask, k) => ({ no: `GB5-S27-02-${k + 1}`, loc: `교사용 슬라이드 27 활동 02 (${k + 1})`, group: 4, type: "숫자 카드로 만든 수의 개수", prompt: `(${k + 1}) ${MAKE} — ${ask}`, visual: cards([0, 1, 2], ask) })),
  ...[4, 3].map((n, k) => ({ no: `GB5-S27-03-${k + 1}`, loc: `교사용 슬라이드 27 활동 03 (${k + 1})`, group: 4, type: "숫자 카드로 만든 수의 차례", prompt: `${RANK3} (${k + 1}) 만들 수 있는 세 자리 수 중 ${n}번째로 작은 수는?`, visual: cards([1, 2, 3]) })),
  { no: "GB5-S28-04-1", loc: "교사용 슬라이드 28 활동 04 (1)", group: 5, type: "숫자 카드로 만든 수의 차례", prompt: "(1) 다음 숫자카드를 한 번씩만 써서 만들 수 있는 세 자리 수 중 5번째로 큰 수는?", visual: cards([3, 6, 9]) },
  { no: "GB5-S28-04-2", loc: "교사용 슬라이드 28 활동 04 (2)", group: 5, type: "숫자 카드로 만든 수의 차례", prompt: "(2) 다음 숫자카드를 한 번씩만 써서 만들 수 있는 세 자리 수 중 8번째로 작은 수는?", visual: cards([0, 2, 5, 9]),
    discrepancy: "원본은 이 물음의 번호를 (1)로 적었지만 04의 두 번째 물음이라 (2)로 고쳤습니다." },
  { no: "GB5-S29-04", loc: "교사용 슬라이드 29 (4)", group: 6, type: "숫자 카드로 만든 수의 차례", prompt: "(4) 다음 숫자카드 5장 중 4장을 이용해서 네 자리 수를 만들 때 6번째로 큰 수는?", visual: cards([1, 3, 5, 7, 9]) },
  ...["한 자리 수의 개수", "두 자리 수의 개수", "세 자리 수의 개수", "네 자리 수의 개수",
    "두 자리 수 중 5번째로 작은 수", "두 자리 수 중 10번째로 작은 수", "두 자리 수 중 4번째로 큰 수", "두 자리 수 중 12번째로 큰 수",
    "세 자리 수 중 7번째로 작은 수", "세 자리 수 중 13번째로 작은 수", "세 자리 수 중 6번째로 큰 수", "세 자리 수 중 12번째로 큰 수",
    "네 자리 수 중 5번째로 작은 수", "네 자리 수 중 5번째로 큰 수"].map((ask, k) => ({ no: `GB5-S30-${String(k + 1).padStart(2, "0")}`, loc: `교사용 슬라이드 30 도전 (${k + 1})`, group: 7,
    type: k < 4 ? "숫자 카드로 만든 수의 개수" : "숫자 카드로 만든 수의 차례", prompt: `${CHALLENGE} (${k + 1}) ${ask}${k < 4 ? "는?" : "는?"}`, visual: cards([1, 3, 5, 7, 9]),
    discrepancy: k === 6 ? "원본은 이 물음의 번호를 (6)으로 한 번 더 적었지만 (7)로 고쳤습니다." : undefined }))
];
const start = L1.original.items.length;
const newItems = L1Specs.map((spec, k) => {
  const item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId: L1.id, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: "numeric", prompt: spec.prompt, visual: spec.visual, answerRef: `/books/book-05/lessons/1/original/items/${start + k}` };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  return item;
});
// 슬라이드 순서로 다시 놓는다(answerRef는 그대로라 답 연결은 바뀌지 않는다).
const slideOrder = (item) => Number(item.sourceNo.match(/S(\d+)/)[1]) * 1000 + (item.sourceNo === "GB5-S29-01" ? 1 : item.sourceNo === "GB5-S29-04" ? 2 : 0);
L1.original.items = [...L1.original.items, ...newItems].sort((a, b) => slideOrder(a) - slideOrder(b));
// 인쇄 묶음도 쪽 순서로(예전 S29-01이 S25 묶음에 들어 있어 순서가 섞였다).
L1.original.items.forEach((item) => { item.printGroup = Number(item.sourceNo.match(/S(\d+)/)[1]) - 24; });
L1.original.mode = "paged";
L1.original.sourceQuestionCount = L1.original.items.length;
delete L1.sourceHold;
Object.assign(L1, { sourceLocator: "교사용 슬라이드 25~30 활동 01~04·도전" });

// ── 새 단원 9: 조건에 맞는 두 자리 수 (슬라이드 31~32, 19문항) ──
const slots = (op, tail) => ({ kind: "book5", subtype: "source-place-slots", op, tail });
const P05 = "다음 조건에 알맞은 수를 구하시오.";
const L9Specs = [
  ...[
    "일의 자리 + 십의 자리 = 16이 되는 가장 큰 두 자리 수는?",
    "십의 자리 + 일의 자리 = 7이 되는 두 자리 수 중 6번째로 작은 수는?",
    "십의 자리 + 일의 자리 = 3인 두 자리 수 중 가장 작은 수는?",
    "십의 자리 + 일의 자리 = 4인 두 자리 수 중 4번째로 작은 수는?",
    "십의 자리 + 일의 자리 = 5인 두 자리 수 중 가장 작은 수는?",
    "십의 자리 + 일의 자리 = 5인 두 자리 수 중 3번째로 큰 수는?",
    "십의 자리 = 일의 자리 + 3인 두 자리 수 중 가장 작은 수는?",
    "십의 자리 = 일의 자리 + 4인 두 자리 수 중 5번째로 작은 수는?",
    "십의 자리 = 일의 자리 - 1인 두 자리 수 중 3번째로 큰 수는?",
    "십의 자리와 일의 자리의 차가 1인 두 자리 수 중 2번째로 작은 수는?",
    "십의 자리와 일의 자리의 차가 1인 두 자리 수 중 3번째로 큰 수는?",
    "일의 자리 숫자가 십의 자리 숫자의 2배가 되는 두 자리 수 중 3번째로 큰 수는?"
  ].map((q, k) => ({ no: `GB5-S31-05-${k + 1}`, loc: `교사용 슬라이드 31 활동 05 (${k + 1})`, group: 1, type: "자리 숫자 조건", prompt: `${P05} (${k + 1}) ${q}` })),
  { no: "GB5-S32-06-1", loc: "교사용 슬라이드 32 활동 06 (1)", group: 2, type: "자리 숫자 조건", prompt: `${P05} (1) 십의 자리 + 일의 자리 = 8일 때 6번째로 큰 수는?`, visual: slots("+", "= 8") },
  { no: "GB5-S32-06-2", loc: "교사용 슬라이드 32 활동 06 (2)", group: 2, type: "자리 숫자 조건", prompt: `${P05} (2) 십의 자리 + 일의 자리 = 11일 때 5번째로 작은 수는?`, visual: slots("+", "= 11") },
  { no: "GB5-S32-06-3", loc: "교사용 슬라이드 32 활동 06 (3)", group: 2, type: "자리 숫자 조건", prompt: `${P05} (3) 십의 자리 + 일의 자리 = 13일 때 5번째로 작은 수는?`, visual: slots("+", "= 13") },
  { no: "GB5-S32-06-4", loc: "교사용 슬라이드 32 활동 06 (4)", group: 3, type: "조건에 맞는 수 모두", prompt: `${P05} (4) 십의 자리 = 일의 자리 + 2인 수를 모두 쓰시오.`, visual: slots("=", "+ 2"), set: true },
  ...[2, 4, 5].map((d, k) => ({ no: `GB5-S32-06-${k + 5}`, loc: `교사용 슬라이드 32 활동 06 (${k + 5})`, group: 3, type: "조건에 맞는 수 모두", prompt: `${P05} (${k + 5}) 십의 자리와 일의 자리의 차가 ${d}인 수를 모두 쓰시오.`, set: true }))
];
const L9Items = L9Specs.map((spec, index) => {
  const item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId: "two-digit-condition-source", typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: spec.set ? "text" : "numeric", prompt: spec.prompt, ...(spec.visual ? { visual: spec.visual } : { noVisual: true }), answerRef: `/books/book-05/lessons/9/original/items/${index}` };
  if (spec.set) item.resultContract = { type: "set" };
  return item;
});
const L9 = {
  id: "two-digit-condition-source", unit: "최단거리와 숫자 카드", title: "조건에 맞는 두 자리 수", sourceLocator: "교사용 슬라이드 31~32 활동 05~06",
  sourceTypeIds: ["two-digit-condition-source"], representativeConcept: "십의 자리와 일의 자리 숫자의 합·차·배 조건에 맞는 두 자리 수를 작은 수부터(또는 큰 수부터) 빠짐없이 나열해 몇 번째 수를 찾음",
  story: { title: "자리 숫자 짝 찾기", text: "두 자리 수는 십의 자리 숫자와 일의 자리 숫자로 이루어집니다. 십의 자리에는 0이 올 수 없습니다.", mission: "조건에 맞는 짝을 십의 자리가 작은 것부터 빠짐없이 적어 보세요." },
  explanation: { headline: "십의 자리를 1부터 차례로 바꾸며 조건에 맞는 일의 자리를 찾으면 작은 수부터 나열됩니다.",
    steps: ["십의 자리에 1, 2, 3 …을 차례로 놓습니다(0은 안 됩니다).", "조건에 맞는 일의 자리 숫자를 찾습니다(0~9 중 하나).", "작은 수부터 적은 목록에서 몇 번째인지 셉니다. 큰 수부터는 목록을 거꾸로 셉니다.", "차가 같은 수는 십의 자리가 더 큰 것과 일의 자리가 더 큰 것을 모두 적습니다."] },
  experience: {
    ...JSON.parse(JSON.stringify(L0.experience)), family: "two-digit-condition", title: "자리 숫자 짝을 차례로 적어요",
    beats: [
      { id: "two-digit-condition-step-1", action: "reveal", caption: "두 자리 수의 십의 자리에는 1부터 9까지, 일의 자리에는 0부터 9까지 올 수 있습니다.", visual: slots("+", "= 6") },
      { id: "two-digit-condition-step-2", action: "highlight", caption: "합이 6이면 십의 자리를 1부터 바꾸며 15, 24, 33, 42, 51, 60을 차례로 적습니다.", visual: slots("+", "= 6") },
      { id: "two-digit-condition-step-3", action: "verify", caption: "작은 수부터 적었으니 앞에서부터 세면 몇 번째로 작은 수, 뒤에서부터 세면 몇 번째로 큰 수입니다.", visual: slots("+", "= 6") }
    ],
    hint: "십의 자리를 1부터 차례로 바꾸면 빠뜨리지 않습니다.",
    check: { prompt: "십의 자리 + 일의 자리 = 9인 두 자리 수 중 3번째로 작은 수는 얼마일까요?", options: ["36", "27", "45"], answerRef: "/books/book-05/lessons/9/experience/check" }
  },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L9Items.length, structureKey: "two-digit-condition-source", prompt: P05, visual: slots("+", "= 8"), items: L9Items },
  extension: { title: "추가 학습", structureKey: "two-digit-condition-source", story: "십의 자리 숫자와 일의 자리 숫자를 더하면 10입니다.", prompt: "이런 두 자리 수 중 4번째로 큰 수를 쓰세요.",
    visual: slots("+", "= 10"), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/9/extension" }
};
book.lessons.push(L9);

const cleared = new Set(["S26", "S27", "S28", "S29", "S30", "S31", "S32"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 7) throw new Error("hold count");
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch4 patched", { L1: L1.original.items.length, L9: L9Items.length, coverage: book.sourceCoverage });
