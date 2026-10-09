// 4권 묶음 1: 원본 36·37·39·40·41·44쪽 논리 추리 문항을 넣는다. 정답은 비공개 DB에만.
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-04");
const lesson = (id) => book.lessons.find((l) => l.id === id);
if (lesson("order-logic-source")) throw new Error("already patched");
const parts = (base, labels) => labels.map((label, i) => ({ id: `part-${i + 1}`, label, answerRef: `${base}/parts/${i}` }));
const rank = (n) => Array.from({ length: n }, (_, i) => `${i + 1}등`);
const seat = (n) => ["왼쪽 첫째", "둘째", "셋째", "넷째", "다섯째"].slice(0, n);
const L10 = (i) => `/books/book-04/lessons/10/original/items/${i}`;

// 새 단원: 순서 정하기 (36·37·40·41쪽)
const ref = books.find((b) => b.id === "book-01").lessons.find((l) => l.id === "relative-order-running");
const experience = JSON.parse(JSON.stringify(ref.experience).replaceAll("/books/book-01/lessons/10/experience/", "/books/book-04/lessons/10/experience/"));
const q = (id, sourceNo, locator, printGroup, prompt, visual, extra) => ({ id, sourceNo, typeLabel: "조건으로 순서 정하기", sourceLocator: locator, printGroup, prompt, visual: { kind: "book4", subtype: "source-order-slots", ...visual }, ...extra });
const items = [
  q("order-run-3", "36-(1)", "학생용 36쪽 활동 01 규칙 익히기 ①", 1, "A, B, C 3명이 달리기를 하고 있습니다. 빠른 순서대로 구하시오.",
    { clues: ["C 앞에 달리는 사람은 없다.", "A는 B와 C 사이에서 달리고 있다."] }, { inputMode: "text", parts: parts(L10(0), rank(3)), answerRef: L10(0) }),
  q("order-run-4", "36-(2)", "학생용 36쪽 활동 01 규칙 익히기 ②", 2, "A, B, C, D 4명이 달리기를 하고 있습니다. 먼저 도착한 순서대로 구하시오.",
    { clues: ["B는 D보다 먼저 도착", "A보다 먼저 도착한 사람은 2명이다.", "C보다 늦은 사람은 2명이다."] }, { inputMode: "text", parts: parts(L10(1), rank(4)), answerRef: L10(1) }),
  q("order-seat-3", "37-(1)", "학생용 37쪽 활동 01 규칙 익히기 ④", 3, "A, B, C 3명이 다음과 같이 한 줄로 앉아있습니다. 각각 어디에 앉아 있는지 구하시오.",
    { clues: ["A는 B의 왼쪽에 있습니다.", "C는 B의 오른쪽에 있습니다."], slots: { count: 3 } }, { inputMode: "text", parts: parts(L10(2), seat(3)), answerRef: L10(2) }),
  q("order-seat-4", "37-(2)", "학생용 37쪽 활동 01 규칙 익히기 ⑤", 4, "A, B, C, D 4명이 다음과 같이 한 줄로 앉아있습니다. 각각 어디에 앉아 있는지 구하시오.",
    { clues: ["A와 B사이에 두 명이 있습니다.", "C는 A의 오른쪽에 있습니다.", "D는 C의 오른쪽에 있습니다."], slots: { count: 4 } }, { inputMode: "text", parts: parts(L10(3), seat(4)), answerRef: L10(3) }),
  q("order-race-second", "40-(1)", "학생용 40쪽 활동 03 순서 정하기 ①", 5, "치타, 곰, 늑대, 사자가 달리기 경주를 하고 있습니다. 동물들의 달리기 경주를 보고 2등으로 도착한 동물을 구하시오.",
    { clues: ["치타가 가장 먼저 도착하였습니다.", "곰은 늑대 다음으로 도착하였습니다.", "사자는 가장 마지막에 들어오지 않았습니다."] }, { answerMode: "input", inputMode: "text", answerRef: L10(4) }),
  q("order-line-position", "40-(2)", "학생용 40쪽 활동 03 순서 정하기 ②", 6, "미희, 윤주, 소정, 미호, 서현이가 한 줄로 서 있습니다. 소정이는 앞에서부터 몇 번째에 서 있습니까?",
    { clues: ["윤주 뒤로 두 번째에 소정이가 있습니다.", "서현이 앞에는 한 사람만 있습니다.", "미호 앞으로 세 번째에 미희가 있습니다."] }, { answerMode: "input", inputMode: "numeric", answerRef: L10(5) }),
  q("order-age-5", "41-(1)", "학생용 41쪽 활동 03 순서 정하기 ③", 7, "주미, 인성, 형민, 준혜, 기민 5명의 나이가 다음과 같습니다. 나이가 많은 순으로 이름을 쓰시오.",
    { clues: ["인성이는 형민이와 준혜보다 나이가 많습니다.", "기민이는 형민이보다 나이가 많지만 준혜보다는 어립니다.", "주미는 인성이보다 나이가 많습니다."] }, { inputMode: "text", parts: parts(L10(6), ["첫째", "둘째", "셋째", "넷째", "다섯째"]), answerRef: L10(6) }),
  q("order-swim-guess", "41-(2)", "학생용 41쪽 활동 03 순서 정하기 ④", 8, "사자, 소, 돼지, 양이 수영 경기를 했습니다. 경기를 본 친구들이 다음과 같이 예상하면서 말했습니다. 시합 결과 A와 D의 예상은 맞고, B와 C의 예상은 틀렸습니다. 수영 경기를 한 동물들의 순위를 구하시오. (단, 등수가 같은 동물은 없습니다.)",
    { clues: ["A : 사자는 2등도 3등도 아닐거야.", "B : 소는 1등이나 3등일 거야.", "C : 양은 사자보다 잘했을 거야.", "D : 돼지는 소보다 잘했지만 양보다는 못했을 거야."] }, { inputMode: "text", parts: parts(L10(7), rank(4)), answerRef: L10(7) })
];
const newLesson = {
  id: "order-logic-source",
  unit: "순서 논리",
  title: "조건으로 순서를 정해요",
  sourceLocator: "학생용 36~37쪽 활동 01, 40~41쪽 활동 03",
  sourceTypeIds: ["order-logic-source"],
  representativeConcept: "확정되는 조건부터 자리에 놓고, 나머지 조건으로 순서를 하나로 정함",
  experience,
  story: { title: "달리기와 한 줄 앉기", text: "누가 먼저인지, 누가 왼쪽인지 조건을 읽고 순서를 정합니다.", mission: "확실한 조건부터 자리에 놓고, 남은 조건으로 나머지 자리를 채우세요." },
  explanation: { headline: "확정되는 조건부터 놓습니다.", steps: ["맨 앞·맨 뒤·몇 번째처럼 자리가 바로 정해지는 조건을 먼저 놓습니다.", "'바로 다음', '사이' 조건으로 붙어 있는 사람을 묶습니다.", "남은 조건이 모두 맞는지 처음부터 다시 확인합니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: items.length, structureKey: "order-logic-source-source-structure", prompt: "각 문제의 조건을 읽고 바로 아래 답란에 답을 쓰세요.", items },
  extension: { title: "추가 학습", structureKey: "order-logic-source-source-structure", story: "가, 나, 다 3명이 달리기를 합니다.", prompt: "다 앞에 달리는 사람은 없고, 나는 가보다 늦게 달립니다. 1등은 누구일까요?", visual: { kind: "book4", subtype: "source-order-slots", clues: ["다 앞에 달리는 사람은 없다.", "나는 가보다 늦게 달린다."] }, answerMode: "input", inputMode: "text", extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/10/extension" }
};
book.lessons.splice(book.lessons.findIndex((l) => l.id === "table-logic-source"), 0, newLesson);

// 36쪽 동서남북 익히기 → 동서남북 단원 맨 앞
{
  const o = lesson("cardinal-placement").original;
  const base = "/books/book-04/lessons/7/original/items/2";
  o.items.unshift({ id: "direction-basics", sourceNo: "36-(3)", typeLabel: "동서남북 익히기", sourceLocator: "학생용 36쪽 활동 01 규칙 익히기 ③", printGroup: 0,
    prompt: "동·서·남·북 익히기: (1) D의 남쪽? (2) H의 북쪽? (3) F의 서쪽? (4) D의 동쪽?",
    visual: { kind: "book4", subtype: "source-compass-grid", labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I"] },
    inputMode: "text", parts: parts(base, ["(1) D의 남쪽", "(2) H의 북쪽", "(3) F의 서쪽", "(4) D의 동쪽"]), answerRef: base });
}
// 37쪽 3명 원탁 → 원탁 단원 맨 앞, 44쪽 원탁 5·6명 → 끝
{
  const o = lesson("circle-logic-source").original;
  const R = (i) => `/books/book-04/lessons/8/original/items/${i}`;
  const c = (id, sourceNo, locator, prompt, clues, seats, startAngle, answerRef) => ({ id, sourceNo, typeLabel: "원탁 이웃 자리 논리", sourceLocator: locator, printGroup: 1, prompt, visual: { kind: "book4", subtype: "source-circle-logic", seats, startAngle, clues }, answerMode: "input", inputMode: "text", answerRef });
  o.items.unshift(c("circle-seat-3", "37-(3)", "학생용 37쪽 활동 01 규칙 익히기 ⑥", "지원, 유진, 지은 3명이 둥근 식탁에 앉아 있습니다. 지은이는 어느 자리에 앉아 있습니까?",
    ["지원이는 유진이의 왼쪽에 있습니다.", "지은이는 유진이의 오른쪽에 있습니다."], [{ label: "지원" }, { label: "B" }, { label: "A" }], -150, R(2)));
  o.items.push(c("circle-seat-5-left", "44-(1)", "학생용 44쪽 활동 02 둥근 식탁 ③", "A, B, C, D, E가 둥근 식탁에 앉아 있습니다. D의 왼쪽에는 누가 앉아 있습니까?",
    ["B와 D는 나란히 앉아 있습니다.", "E는 C의 바로 오른쪽에 앉아 있습니다.", "B는 C와 나란히 앉아 있습니다."], [{}, {}, {}, {}, {}], -90, R(3)));
  o.items.push(c("circle-seat-6-left", "44-(2)", "학생용 44쪽 활동 02 둥근 식탁 ④", "A, B, C, D, E, F가 둥근 식탁에 앉아 있습니다. D의 왼쪽에는 누가 앉아 있습니까?",
    ["A : 나의 바로 오른쪽에 E가 앉아 있고 맞은 편에 F가 앉아 있습니다.", "C : 나는 D와 마주보고 앉아 있습니다.", "F : 나는 C의 오른쪽에 있습니다."], [{}, {}, {}, {}, {}, {}], -90, R(4)));
  o.items.forEach((it) => { it.inputMode = "text"; });
  o.sourceQuestionCount = o.items.length;
}
// 39쪽 꽃 표 → 표 단원 끝, 기존 표 문항도 글자 입력으로
{
  const o = lesson("table-logic-source").original;
  o.items.push({ id: "table-flower", sourceNo: "39-(2)", typeLabel: "가능한 선택을 지우는 표 논리", sourceLocator: "학생용 39쪽 활동 02 논리추리(표) ④", printGroup: 2,
    prompt: "예준, 승환, 수빈, 나경이는 각각 장미, 국화, 튤립, 백합 중 서로 다른 한 가지를 좋아합니다. 다음을 보고 예준이가 어떤 꽃을 좋아하는지 구하시오.",
    visual: { kind: "book4", subtype: "source-table-logic", people: ["예준", "승환", "수빈", "나경"], choices: ["장미", "국화", "튤립", "백합"], target: "예준",
      clues: ["승환이는 장미와 국화를 좋아하지 않습니다.", "튤립을 좋아하는 사람, 나경, 장미를 좋아하는 사람은 서로 친구입니다.", "예준이와 승환이는 튤립을 좋아하는 사람과 친구입니다."] },
    answerMode: "input", inputMode: "text", answerRef: "/books/book-04/lessons/6/original/items/3" });
  o.items.forEach((it) => { it.inputMode = "text"; });
  o.sourceQuestionCount = o.items.length;
}
const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("batch1 patched; lessons:", book.lessons.map((l) => l.id).join(" "));
