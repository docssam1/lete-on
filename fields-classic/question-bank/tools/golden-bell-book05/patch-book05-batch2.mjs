// 골든벨 5권 묶음 2: 교사용 슬라이드 11~15 「달력 연산·요일」 29문항.
// 이 스크립트에는 정답이 없다(정답은 비공개 DB에만). node patch-book05-batch2.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
const book7 = books.find((b) => b.id === "book-07");
if (book.lessons.some((l) => l.id === "calendar-arithmetic-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");

const ref = (lesson, index) => `/books/book-05/lessons/${lesson}/original/items/${index}`;
const withParts = (item, parts) => ({ ...item, parts: parts.map((part, k) => ({ id: String.fromCharCode(97 + k), ...(typeof part === "string" ? { label: part } : part), answerRef: `${item.answerRef}/parts/${k}` })) });
const buildItems = (lessonNo, lessonId, specs) => specs.map((spec, index) => {
  let item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: spec.text ? "text" : "numeric", prompt: spec.prompt, visual: spec.visual, answerRef: ref(lessonNo, index) };
  if (spec.set) item.resultContract = { type: "set" };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});

// ── 단원 6: 달력 속 두 수의 합 (슬라이드 11, 18문항) ──
const sumPair = (rows, sum, extra = {}) => ({ kind: "book5", subtype: "source-sum-pair", rows, sum, ...extra });
const cells = (shape, sum, rows = 2) => ({ kind: "book5", subtype: "source-calendar-cells", shape, rows, sum });
const PAIR_PROMPT = "A, B에 알맞은 수를 구하시오.";
const CELL_PROMPT = (sum) => `달력에서 색칠한 두 칸에 있는 수의 합이 ${sum}입니다. 두 수를 구하시오.`;
const pairSpecs = [
  [[{ label: "A" }, { label: "B", offset: "+7" }], 27],
  [[{ label: "A" }, { label: "B", offset: "+11" }], 35],
  [[{ label: "A" }, { label: "B", offset: "+14" }], 50],
  [[{ label: "A", offset: "+7" }, { label: "B", offset: "+14" }], 55],
  [[{ label: "A", offset: "+14" }, { label: "B", offset: "+21" }], 39]
].map(([rows, sum], k) => ({ no: `GB5-S11-01-${k + 1}`, loc: `교사용 슬라이드 11 연산골든벨 (${k + 1})`, group: 1, type: "합과 차로 두 수 찾기", prompt: PAIR_PROMPT, visual: sumPair(rows, sum), parts: ["A", "B"] }));
const cellSpecs = [
  ...[11, 15, 13, 17, 21, 37, 41, 51].map((sum) => ["vertical", sum, 2]),
  ...[20, 36].map((sum) => ["vertical", sum, 3]),
  ...[22, 42, 38].map((sum) => ["diagonal", sum, 2])
].map(([shape, sum, rows], k) => ({ no: `GB5-S11-02-${k + 1}`, loc: `교사용 슬라이드 11 달력 칸 (${k + 1})`, group: 2, type: shape === "diagonal" ? "달력 대각선 두 칸" : rows === 3 ? "달력 두 주 차이 두 칸" : "달력 위아래 두 칸",
  prompt: CELL_PROMPT(sum), visual: cells(shape, sum, rows), parts: shape === "diagonal" ? ["왼쪽 위 칸", "오른쪽 아래 칸"] : ["위 칸", "아래 칸"] }));
const L6Specs = [...pairSpecs, ...cellSpecs];
const bigCalendar = { kind: "book5", subtype: "source-month-grid", rows: 5, cells: [{ r: 0, c: 5, shaded: true }, { r: 1, c: 5, shaded: true }, { r: 3, c: 1, shaded: true }, { r: 4, c: 2, shaded: true }] };
const L6 = {
  id: "calendar-arithmetic-source", unit: "수 배열표와 달력", title: "달력 속 두 수의 합", sourceLocator: "교사용 슬라이드 11 연산골든벨",
  sourceTypeIds: ["calendar-arithmetic-source"], representativeConcept: "두 수의 합과 차(달력에서 바로 아래 칸은 7, 오른쪽 아래 칸은 8 차이)로 두 수를 구함",
  story: { title: "달력 속 짝꿍 수", text: "달력에서 바로 아래 칸은 일주일 뒤라 7 큰 수이고, 오른쪽 아래 칸은 8 큰 수입니다.", mission: "두 수의 합에서 차를 빼고 반으로 나누어 작은 수를 먼저 찾아보세요." },
  explanation: { headline: "합에서 차를 빼면 두 수가 같아지고, 그 반이 작은 수입니다.",
    steps: ["두 수가 얼마나 차이 나는지 찾습니다(위아래 칸은 7, 두 칸 아래는 14, 오른쪽 아래 칸은 8).", "합에서 그 차를 뺍니다.", "남은 수를 반으로 나누면 작은 수, 작은 수에 차를 더하면 큰 수입니다.", "두 수를 더해 합이 맞는지 확인합니다."] },
  experience: {
    ...JSON.parse(JSON.stringify(L0.experience)), family: "calendar-sum-pair", title: "합과 차로 두 수를 찾아요",
    beats: [
      { id: "calendar-sum-pair-step-1", action: "reveal", caption: "달력에서 바로 아래 칸은 일주일 뒤라 7 큰 수, 오른쪽 아래 칸은 8 큰 수입니다.", visual: bigCalendar },
      { id: "calendar-sum-pair-step-2", action: "highlight", caption: "합 19에서 B가 더 큰 만큼인 5를 빼면 14가 되어 두 수가 같아집니다.", visual: sumPair([{ label: "A" }, { label: "B", offset: "+5" }], 19) },
      { id: "calendar-sum-pair-step-3", action: "verify", caption: "14를 반으로 나누면 A는 7, 7에 5를 더하면 B는 12입니다. 7+12=19가 맞습니다.", visual: sumPair([{ label: "A" }, { label: "B", offset: "+5" }], 19, { values: [7, 12] }) }
    ],
    hint: "두 수의 합에서 차를 빼고 반으로 나누면 작은 수입니다.",
    check: { prompt: "합이 23이고 B가 A보다 7 크면 A는 얼마일까요?", options: ["8", "15", "9"], answerRef: "/books/book-05/lessons/6/experience/check" }
  },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L6Specs.length, structureKey: "calendar-arithmetic-source", prompt: PAIR_PROMPT, visual: bigCalendar, items: buildItems(6, "calendar-arithmetic-source", L6Specs) },
  extension: { title: "추가 학습", structureKey: "calendar-arithmetic-source", story: "B는 A보다 7 크고, 두 수를 더하면 31입니다.", prompt: "A에 알맞은 수를 쓰세요.",
    visual: sumPair([{ label: "A" }, { label: "B", offset: "+7" }], 31), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/6/extension" }
};

// ── 단원 7: 달력에서 요일 찾기 (슬라이드 12~15, 11문항) ──
const month = (title, list) => ({ kind: "book5", subtype: "source-month-grid", title, rows: 5, cells: list });
const shadedPair = (c, r) => [{ r, c, shaded: true }, { r: r + 1, c, shaded: true }];
const nov = month("11월", [{ r: 1, c: 1, value: 8 }, { r: 1, c: 2, value: 9 }, { r: 1, c: 3, value: 10 }]);
const MONTH_STEM = "다음 달력을 보고 물음에 답하시오.";
const L7Specs = [
  { no: "GB5-S12-01", loc: "교사용 슬라이드 12 활동 01", group: 1, type: "각 월의 날짜 수", prompt: "달력을 관찰하고 각 월의 날짜 수를 찾아 쓰시오.",
    visual: { kind: "book5", subtype: "source-year-calendar", year: 2022 }, parts: Array.from({ length: 12 }, (_, m) => ({ label: `${m + 1}월`, unit: "일" })) },
  { no: "GB5-S13-02-1", loc: "교사용 슬라이드 13 활동 02 (1)", group: 2, type: "같은 요일 날짜", prompt: "다음은 어느 해 11월 달력입니다. (1) 토요일 날짜를 모두 쓰시오.", visual: nov, set: true, text: true },
  { no: "GB5-S13-02-2", loc: "교사용 슬라이드 13 활동 02 (2)", group: 2, type: "날짜의 요일", prompt: "다음은 어느 해 11월 달력입니다. (2) 11월 30일은 무슨 요일입니까?", visual: nov, text: true },
  { no: "GB5-S13-03-1", loc: "교사용 슬라이드 13 활동 03 (1)", group: 3, type: "합으로 날짜 찾기", prompt: `${MONTH_STEM} (1) 어느 해 7월의 첫 번째 월요일과 두 번째 월요일 날짜를 더하면 9일입니다. 두 번째 금요일은 며칠입니까?`, visual: month("7월", shadedPair(1, 0)) },
  { no: "GB5-S14-03-2", loc: "교사용 슬라이드 14 활동 03 (2)", group: 3, type: "합으로 요일 찾기", prompt: `${MONTH_STEM} (2) 어느 해 12월의 두 번째 수요일과 세 번째 수요일 날짜를 더하면 35일입니다. 크리스마스는 무슨 요일입니까?`, visual: month("12월", shadedPair(3, 1)), text: true },
  { no: "GB5-S14-03-3", loc: "교사용 슬라이드 14 활동 03 (3)", group: 4, type: "합으로 날짜 찾기", prompt: `${MONTH_STEM} (3) 어느 해 1월의 두 번째 금요일과 세 번째 금요일 날짜를 더하면 25일입니다. 1월의 마지막 화요일은 며칠입니까?`, visual: month("1월", shadedPair(5, 1)),
    discrepancy: "원본의 합 38은 같은 요일 두 날짜(7 차이)의 합이 될 수 없어(늘 홀수) 교사용 풀이와 맞는 25로 바로잡았습니다." },
  { no: "GB5-S14-03-4", loc: "교사용 슬라이드 14 활동 03 (4)", group: 4, type: "합으로 요일 찾기", prompt: `${MONTH_STEM} (4) 어느 해 10월의 세 번째 월요일과 네 번째 월요일 날짜를 더하면 47일입니다. 11월 1일은 무슨 요일입니까?`, visual: month("10월", shadedPair(1, 2)), text: true },
  ...[["(1) 4월 13일은 무슨 요일입니까?", "4월"], ["(2) 5월 5일은 무슨 요일입니까?", "5월"]].map(([q], k) => ({ no: `GB5-S15-04-${k + 1}`, loc: `교사용 슬라이드 15 활동 04 (${k + 1})`, group: 5, type: "합으로 요일 찾기",
    prompt: `어느 해 4월 첫 번째 월요일과 두 번째 월요일의 합은 13입니다. ${q}`, visual: sumPair([{}, { offset: "+7" }], 13), text: true })),
  ...[["(1) 9월 29일은 무슨 요일입니까?"], ["(2) 10월 19일은 무슨 요일입니까?"]].map(([q], k) => ({ no: `GB5-S15-05-${k + 1}`, loc: `교사용 슬라이드 15 활동 05 (${k + 1})`, group: 5, type: "합으로 요일 찾기",
    prompt: `어느 해 9월 두 번째 목요일과 세 번째 일요일의 합은 28입니다. ${q}`, visual: sumPair([{}, { offset: "+10" }], 28), text: true,
    discrepancy: k === 0 ? "원본 문장 「첫 번째 목요일과 두 번째 일요일」은 어떤 달에서도 합이 28이 될 수 없어, 원본 그림(차 10)과 교사용 풀이에 맞춰 「두 번째 목요일과 세 번째 일요일」로 바로잡았습니다." : undefined }))
];
const weekdaySource = book7.lessons.find((l) => l.id === "calendar-weekday").experience;
const L7 = {
  id: "calendar-weekday-source", unit: "수 배열표와 달력", title: "달력에서 요일 찾기", sourceLocator: "교사용 슬라이드 12~15 활동 01~05",
  sourceTypeIds: ["calendar-weekday-source"], representativeConcept: "같은 요일은 7일마다 돌아오는 것을 써서 날짜의 요일과 같은 요일의 날짜를 찾음",
  story: { title: "7일마다 돌아오는 요일", text: "달력에서 같은 요일은 7일마다 돌아옵니다. 그래서 같은 요일의 날짜끼리는 7씩 차이가 납니다.", mission: "주어진 날짜에서 7씩 더하거나 빼며 묻는 날짜의 요일을 찾아보세요." },
  explanation: { headline: "같은 요일은 7일마다 돌아오므로 7씩 건너뛰며 셉니다.",
    steps: ["같은 요일 두 날짜의 합이 주어지면 합에서 7을 빼고 반으로 나누어 앞 날짜를 찾습니다.", "찾은 날짜에서 7씩 더해 묻는 날짜 가까이 갑니다.", "남은 날만큼 요일을 옮깁니다.", "달이 바뀌면 그 달의 날짜 수(30일 또는 31일)를 넘겨 이어 셉니다."] },
  experience: { ...JSON.parse(JSON.stringify(weekdaySource)), learnerStage: L0.experience.learnerStage,
    check: { prompt: "화요일에서 10일 뒤는 무슨 요일일까요?", options: ["금요일", "토요일", "목요일"], answerRef: "/books/book-05/lessons/7/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L7Specs.length, structureKey: "calendar-weekday-source", prompt: MONTH_STEM, visual: nov, items: buildItems(7, "calendar-weekday-source", L7Specs) },
  extension: { title: "추가 학습", structureKey: "calendar-weekday-source", story: "어느 해 5월의 첫 번째 화요일과 두 번째 화요일 날짜를 더하면 15입니다.", prompt: "5월 20일은 무슨 요일인지 쓰세요.",
    visual: sumPair([{}, { offset: "+7" }], 15), answerMode: "input", inputMode: "text", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/7/extension" }
};
book.lessons.push(L6, L7);

// ── 보류 정리와 집계 ──
const cleared = new Set(["S11", "S12", "S13", "S14", "S15"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 5) throw new Error("hold count");
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch2 patched", { L6: L6.original.items.length, L7: L7.original.items.length, coverage: book.sourceCoverage });
