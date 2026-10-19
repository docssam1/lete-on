// 골든벨 7권 묶음 1a: 교사용 슬라이드 2~5 「달력 — 한 달 미만·한 달·한 달 이상·확인」.
// 단원 4(calendar-weekday)는 4·5쪽 원본 문항으로 새로 짜고, 2쪽·3쪽은 단원 11·12로 덧붙인다.
// 쪽 번호는 교사용 PDF 쪽 번호다(예전 기록의 「화면 3·4」는 실제 4·5쪽이었다).
// 이 스크립트에는 정답이 없다. node patch-book07-batch1a.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
if (book.lessons.some((l) => l.id === "calendar-within-month-source")) throw new Error("already patched");
const L4No = book.lessons.findIndex((l) => l.id === "calendar-weekday");
const L4 = book.lessons[L4No];
const template = L4.experience;

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs) => specs.map((spec, k) => {
  let item = { id: `book07-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic: "달력과 요일",
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "text", prompt: spec.prompt,
    answerRef: `/books/book-07/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const experience = (lessonNo, title, check) => ({ ...JSON.parse(JSON.stringify(template)), title, check: { ...check, answerRef: `/books/book-07/lessons/${lessonNo}/experience/check` } });
const ladder = (...rows) => ({ kind: "book5", subtype: "source-date-ladder", rows: rows.map(([date, day]) => (day === undefined ? { date } : { date, day })) });
const BLANK = null;
const WRITE = "빈칸에 알맞은 요일을 쓰시오.";
const partsOf = (v) => { const n = v.rows.filter((r) => r.day === null).length; return n > 1 ? ["가", "나", "다"].slice(0, n) : null; };
const spec = (no, loc, group, type, prompt, visual, extra = {}) => ({ no, loc, group, type, prompt, ...(visual ? { visual } : {}), ...(visual && partsOf(visual) ? { parts: partsOf(visual) } : {}), ...extra });

// ── 단원 11: 한 달 안에서 요일 찾기 (2쪽) ──
const L11No = book.lessons.length;
const P2 = [
  ladder(["1/1", "월"], ["1/5", BLANK]), ladder(["4/9", "금"], ["4/30", BLANK]), ladder(["6/15", "화"], ["6/30", BLANK]),
  ladder(["2/1", "수"], ["2/8", BLANK], ["2/15", BLANK]), ladder(["5/1", "일"], ["5/29", BLANK]), ladder(["7/1", "수"], ["7/24", BLANK]),
  ladder(["3/1", "화"], ["3/15", BLANK]), ladder(["6/3", "목"], ["6/11", BLANK]), ladder(["8/1", "목"], ["8/31", BLANK], ["9/1", BLANK])
];
const L11Specs = P2.map((v, k) => spec(`GB7-S02-01-${k + 1}`, `교사용 슬라이드 2 · 1. 한달 미만 ${Math.floor(k / 3) + 1}줄 ${k % 3 + 1}번째`, 1 + Math.floor(k / 3), "한 달 안에서 요일",
  `맨 위 날짜의 요일을 보고 ${WRITE} (${k + 1})`, v));
const L11 = {
  id: "calendar-within-month-source", unit: "달력과 시계", title: "한 달 안에서 요일 찾기", sourceLocator: "교사용 슬라이드 2 · 활동 01 달력의 역사 1. 한달 미만",
  sourceTypeIds: ["book07-calendar-within-month-source"], representativeConcept: "같은 달 안에서는 날짜 차를 7일씩 묶고 남는 날만큼 요일을 옮김",
  story: { title: "한 달 안의 요일", text: "1일이 무슨 요일인지 알면 그 달의 다른 날짜 요일도 알 수 있습니다.", mission: "7일마다 같은 요일이 돌아옵니다." },
  explanation: { headline: "날짜 차를 구해 7일씩 묶고, 남은 날만큼 요일을 옮깁니다.",
    steps: ["두 날짜의 차를 구합니다.", "7일씩 묶으면 같은 요일로 돌아옵니다.", "남은 날만큼 요일을 앞으로 옮깁니다.", "달력 줄에서 맞는지 확인합니다."] },
  experience: experience(L11No, "같은 달에서 요일 옮기기", { prompt: "수요일에서 10일 뒤는 무슨 요일일까요?", options: ["5", "6", "7"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L11Specs.length, structureKey: "calendar-within-month-source", prompt: "빈칸에 알맞은 요일을 쓰시오.", items: build(L11No, "calendar-within-month-source", L11Specs) },
  extension: { title: "추가 학습", structureKey: "calendar-within-month-source", story: "같은 달 안에서 요일을 옮겨 봅니다.", prompt: "3월 2일이 목요일일 때 3월 20일은 무슨 요일입니까?",
    visual: ladder(["3/2", "목"], ["3/20", BLANK]), answerMode: "input", inputMode: "text", extensionKind: "source-structured-authored", answerRef: `/books/book-07/lessons/${L11No}/extension` }
};

// ── 단원 12: 한 달 뒤 같은 날의 요일 (3쪽) ──
const L12No = L11No + 1;
const M28 = "2월은 28일까지 있습니다.", M30 = "4, 6, 9, 11월은 30일까지 있습니다.", M31 = "1, 3, 5, 7, 8, 10, 12월은 31일까지 있습니다.";
const P3 = [
  [1, M28, ladder(["2월 1일", "화"], ["3월 1일", BLANK])],
  [2, M30, ladder(["4월 1일", "월"], ["5월 1일", BLANK])], [2, M30, ladder(["6월 1일", "화"], ["7월 1일", BLANK])],
  [2, M30, ladder(["9월 1일", "토"], ["10월 1일", BLANK])], [2, M30, ladder(["11월 1일", "일"], ["12월 1일", BLANK])],
  [3, M31, ladder(["1월 1일", "월"], ["2월 1일", BLANK])], [3, M31, ladder(["3월 19일", "수"], ["4월 19일", BLANK])], [3, M31, ladder(["5월 8일", "금"], ["6월 8일", BLANK])],
  [3, M31, ladder(["7월 17일", "토"], ["8월 17일", BLANK])], [3, M31, ladder(["8월 15일", "일"], ["9월 15일", BLANK])], [3, M31, ladder(["10월 28일", "화"], ["11월 28일", BLANK])],
  [3, M31, ladder(["12월 25일", "목"], ["1월 25일", BLANK])], [3, M31, ladder(["7월 1일", "월"], ["8월 1일", BLANK], ["9월 1일", BLANK])],
  [3, M31, ladder(["7월 19일", "수"], ["8월 19일", BLANK], ["9월 19일", BLANK])]
];
const L12Specs = P3.map(([act, lead, v], k) => spec(`GB7-S03-0${act}-${k + 1}`, `교사용 슬라이드 3 · 2. 한달 확인 0${act}`, 1 + act, "한 달 뒤 같은 날", `${lead} ${WRITE} (${k + 1})`, v));
const L12 = {
  id: "calendar-next-month-source", unit: "달력과 시계", title: "한 달 뒤 같은 날의 요일", sourceLocator: "교사용 슬라이드 3 · 2. 한달",
  sourceTypeIds: ["book07-calendar-next-month-source"], representativeConcept: "달의 날짜 수(28·30·31일)를 7로 나눈 나머지만큼 다음 달 같은 날의 요일이 옮겨 감",
  story: { title: "다음 달 같은 날", text: "한 달이 지나면 그 달의 날짜 수만큼 날이 지납니다.", mission: "28일, 30일, 31일 달마다 요일이 몇 칸 옮겨 가는지 찾아보세요." },
  explanation: { headline: "28일은 4주라 그대로, 30일은 2칸, 31일은 3칸 옮겨 갑니다.",
    steps: ["처음 달이 며칠까지 있는지 봅니다.", "그 날짜 수를 7일씩 묶고 남는 날을 셉니다.", "남은 날만큼 요일을 옮깁니다.", "두 달 넘게 가면 한 달씩 차례로 옮깁니다."] },
  experience: experience(L12No, "한 달 뒤 요일 옮기기", { prompt: "토요일에서 30일 뒤는 무슨 요일일까요?", options: ["1", "2", "3"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L12Specs.length, structureKey: "calendar-next-month-source", prompt: "빈칸에 알맞은 요일을 쓰시오.", items: build(L12No, "calendar-next-month-source", L12Specs) },
  extension: { title: "추가 학습", structureKey: "calendar-next-month-source", story: "31일까지 있는 달에서 다음 달 같은 날로 갑니다.", prompt: "5월 10일이 수요일일 때 6월 10일은 무슨 요일입니까?",
    visual: ladder(["5월 10일", "수"], ["6월 10일", BLANK]), answerMode: "input", inputMode: "text", extensionKind: "source-structured-authored", answerRef: `/books/book-07/lessons/${L12No}/extension` }
};

// ── 단원 4: 한 달 이상 (4쪽 ①~⑩) + 확인 (5쪽 ①~⑬) ──
const ASK = "무슨 요일입니까?";
const P4 = [["9/1은 일요일일 때 11/1은"], ["3/1은 월요일일 때 5/1은"], ["1/1은 수요일일 때 4/1은", "(윤년이 아닌 해)"], ["5/11은 금요일일 때 제헌절(7/17)은"],
  ["4/6은 일요일일 때 5/16은"], ["5/16은 월요일일 때 6/28은", "", "원본 ⑥은 물음이 ⑤와 똑같이 적혀 있어, 교사용 풀이가 출발한 날짜와 요일로 물음을 고쳤습니다."],
  ["1/8은 목요일일 때 3/8은"], ["6/13은 금요일일 때 8/31은"], ["8/3은 토요일일 때 10/25은"], ["7/11은 일요일일 때 10/18은"]];
const CIRC = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬";
const p4Specs = P4.map(([q, tail = "", note], k) => spec(`GB7-S04-01-${k + 1}`, `교사용 슬라이드 4 · 3. 한달 이상 ${CIRC[k]}`, 1 + Math.floor(k / 2), "한 달 이상 지난 요일",
  `${CIRC[k]} ${q} ${ASK}${tail ? ` ${tail}` : ""}`, null, note ? { discrepancy: note } : {}));
const P5 = [
  ["1/29은 수요일일 때 2/8은", ladder(["1월 29일", "수"], ["2월 8일", BLANK])], ["4/17은 목요일일 때 5/8은", ladder(["4월 17일", "목"], ["5월 8일", BLANK])],
  ["8/21은 수요일일 때 9/6은", ladder(["8월 21일", "수"], ["9월 6일", BLANK])],
  ["어느 해의 11월 22일은 화요일입니다. 같은 해 12월 7일은"], ["어느 해의 4월 18일은 월요일입니다. 같은 해 5월 10일은"],
  ["어느 해의 7월 21일은 목요일입니다. 같은 해 8월 24일은"], ["어느 해의 9월 18일은 월요일입니다. 같은 해 10월 9일은"],
  ["1/25은 월요일일 때 2/5은", ladder(["1/25", "월"], ["2/5", BLANK]), "원본 그림에는 첫 날짜 옆에 물음 글과 다른 요일이 적혀 있어, 물음 글의 요일로 그렸습니다."],
  ["10/21은 수요일일 때 11/6은", ladder(["10/21", "수"], ["11/6", BLANK])], ["4/12은 월요일일 때 5/5은", ladder(["4/12", "월"], ["5/5", BLANK])],
  ["3/20은 화요일일 때 5/4은", ladder(["3/20", "화"], ["4/20"], ["5/4", BLANK])],
  ["4/22은 토요일일 때 6/6은", ladder(["4/22", "토"], ["5/22"], ["6/6", BLANK]), "원본 그림의 마지막 날짜가 다른 문항에서 옮겨 온 것이라 물음 글의 날짜로 고쳐 그렸습니다."],
  ["10/11은 수요일일 때 12/7은", ladder(["10/11", "수"], ["11/11"], ["12/7", BLANK]), "원본에 ⑫가 두 번 있어 뒤의 것을 ⑬으로 씁니다."]
];
const p5Specs = P5.map(([q, v, note], k) => spec(`GB7-S05-01-${k + 1}`, `교사용 슬라이드 5 · 4. 확인 01 ${CIRC[k]}`, 6 + Math.floor(k / 4), "날짜와 요일 확인",
  `${CIRC[k]} ${q} ${ASK}`, v || null, note ? { discrepancy: note } : {}));
const L4Specs = [...p4Specs, ...p5Specs];
Object.assign(L4, {
  sourceLocator: "교사용 슬라이드 4 · 3. 한달 이상, 슬라이드 5 · 4. 확인",
  representativeConcept: "한 달씩 차례로 옮기거나 전체 날짜 차를 7일씩 묶어 남는 날만큼 요일을 옮김"
});
L4.original = { ...L4.original, title: "골든벨", sourceQuestionCount: L4Specs.length, prompt: "다음 물음에 답하시오.", items: build(L4No, "calendar-weekday", L4Specs) };

book.lessons.push(L11, L12);

// 출처 장부: 2~5쪽을 원본 대조 끝으로 고치고 보류 기록을 지운다.
const units = (specs) => specs.reduce((n, s) => n + (s.parts ? s.parts.length : 1), 0);
const byPage = { 2: L11Specs, 3: L12Specs, 4: p4Specs, 5: p5Specs };
for (const [page, specs] of Object.entries(byPage)) {
  const entry = book.sourceCoverage.pageLedger.find((e) => e.page === Number(page));
  Object.assign(entry, { releasedItems: specs.length, releasedAnswerUnits: units(specs), heldRecords: 0, heldAnswerUnits: 0 });
}
book.sourceHold = book.sourceHold.filter((h) => ![2, 3, 4, 5].includes(h.sourcePage));
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, {
  sourceLessons: book.lessons.length,
  publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.filter((h) => h.sourceHold.itemCount > 0).length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0)
});
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book07 batch1a patched", { L4: L4.original.items.length, L11: L11.original.items.length, L12: L12.original.items.length, lessonNos: [L4No, L11No, L12No], holds: book.sourceHold.length, coverage: { ...book.sourceCoverage, pageLedger: undefined } });
