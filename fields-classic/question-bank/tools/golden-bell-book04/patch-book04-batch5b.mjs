// 4권 묶음 5-2: 원본 4쪽 연산 8문항 + 8쪽 디지털 숫자 21문항. 정답은 비공개 DB에만.
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-04");
if (book.lessons.some((l) => l.id === "digital-flip-source")) throw new Error("already patched");
const R = (i) => `/books/book-04/lessons/16/original/items/${i}`;
const items = [];
const add = (item) => { item.answerRef = R(items.length); items.push(item); return item; };

// 4쪽: 두 자리 수 덧셈·뺄셈 (원본 번호 그대로, (3)과 (7)은 원본에서도 같은 식)
["52+52", "28+82", "82-58", "69+69", "21-15", "62-29", "82-58", "92-26"].forEach((expr, i) => add({
  id: `ready-calc-${i + 1}`, sourceNo: `4-(${i + 1})`, typeLabel: "두 자리 수 덧셈·뺄셈", sourceLocator: `학생용 4쪽 ○3 (${i + 1})`,
  sourceDiscrepancy: i === 0 ? "원본 제목(다음 주 진도 연산 가능한지 확인)은 선생님 안내라 '계산하시오'로 씀" : undefined,
  printGroup: 1, prompt: `계산하시오. ${expr.replace("-", " − ").replace("+", " + ")} =`, noVisual: true, answerMode: "input", inputMode: "numeric"
}));

// 8쪽 ⑤: 원래 수 ± (오른쪽으로 뒤집은 수 / 반 바퀴 돌린 수)
const PROMPT = "다음은 디지털 시계에서 사용되는 10개의 디지털 숫자입니다. 식을 완성한 후 계산한 값을 구하시오.";
const groups = [
  ["(1)", "오른쪽으로 뒤집은 수", 2, [["8", "+"], ["2", "+"], ["18", "+"], ["25", "+"], ["58", "+"], ["81", "-"], ["51", "-"], ["82", "-"]]],
  ["(2)", "반 바퀴 돌린 수", 3, [["2", "+"], ["5", "+"], ["6", "+"], ["12", "+"], ["15", "+"], ["16", "+"], ["82", "+"], ["59", "+"], ["21", "-"], ["65", "-"], ["98", "-"], ["61", "-"]]]
];
groups.forEach(([no, label, printGroup, rows]) => rows.forEach(([number, op], j) => {
  const item = add({
    id: `digital-${printGroup === 2 ? "flip" : "half"}-${j + 1}`, sourceNo: `8-⑤${no}-${j + 1}`, typeLabel: printGroup === 2 ? "디지털 숫자 오른쪽으로 뒤집기" : "디지털 숫자 반 바퀴 돌리기", sourceLocator: `학생용 8쪽 ○5 ${no} ${j + 1}번째 줄`, printGroup,
    prompt: `${PROMPT} ${no} 원래 수와 ${label}`, visual: { kind: "book4", subtype: "source-seven-seg", legend: true, number, op, label, boxes: number.length }, answerMode: "input", inputMode: "numeric"
  });
  item.parts = [{ id: "part-1", label, answerRef: `${item.answerRef}/parts/0` }, { id: "part-2", label: "계산한 값", answerRef: `${item.answerRef}/parts/1` }];
}));
// 8쪽 ⑥
add({ id: "digital-card-952", sourceNo: "8-⑥", typeLabel: "디지털 숫자 카드 반 바퀴", sourceLocator: "학생용 8쪽 ○6", printGroup: 4,
  prompt: "세 자리 수가 적힌 숫자카드를 시계방향으로 180°만큼 돌렸을 때 만들어지는 수와 처음 수의 차는 얼마인가?", visual: { kind: "book4", subtype: "source-seven-seg", legend: true, card: "952" }, answerMode: "input", inputMode: "numeric" });
items.forEach((it) => { if (it.sourceDiscrepancy === undefined) delete it.sourceDiscrepancy; });

const ref = books.find((b) => b.id === "book-01").lessons.find((l) => l.id === "digital-turn-flip");
const experience = JSON.parse(JSON.stringify(ref.experience).replaceAll("/books/book-01/lessons/2/experience/", "/books/book-04/lessons/16/experience/"));
const lesson = {
  id: "digital-flip-source",
  unit: "도형 분할과 움직이기",
  title: "디지털 숫자를 뒤집고 돌려요",
  sourceLocator: "학생용 4쪽 ○3, 8쪽 활동 02 ⑤⑥",
  sourceTypeIds: ["digital-flip-source"],
  representativeConcept: "디지털 숫자는 켜진 막대 전체를 함께 움직여 읽고, 두 자리 수는 자리 순서도 함께 바뀜",
  experience,
  story: { title: "디지털 시계 숫자", text: "디지털 숫자는 7개의 막대로 이루어져 있습니다. 오른쪽으로 뒤집으면 2와 5가 서로 바뀌고, 반 바퀴 돌리면 6과 9가 서로 바뀝니다.", mission: "막대를 움직여 바뀐 수를 먼저 빈칸에 쓰고, 그다음 계산하세요." },
  explanation: { headline: "막대를 함께 움직이고 자리 순서도 바꿉니다.", steps: ["오른쪽으로 뒤집으면 왼쪽 막대와 오른쪽 막대가 바뀝니다. 2는 5, 5는 2가 됩니다.", "반 바퀴 돌리면 위아래와 좌우가 모두 바뀝니다. 6은 9, 9는 6이 되고 0·1·2·5·8은 그대로입니다.", "두 자리 수는 일의 자리와 십의 자리도 서로 자리를 바꿉니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: items.length, structureKey: "digital-flip-source-structure", prompt: PROMPT, items },
  extension: { title: "추가 학습", structureKey: "digital-flip-source-structure", story: "디지털 숫자 25가 적힌 카드를 반 바퀴 돌렸습니다.", prompt: "원래 수와 반 바퀴 돌린 수의 합을 구하시오.", visual: { kind: "book4", subtype: "source-seven-seg", number: "25", op: "+", label: "반 바퀴 돌린 수", boxes: 2 }, answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/16/extension" }
};
book.lessons.splice(book.lessons.findIndex((l) => l.id === "flip-rotate-source") + 1, 0, lesson);

const cov = book.sourceCoverage;
const fix = (pages, entry) => { const i = cov.findIndex((e) => e.pages.join() === pages.join()); if (i < 0) throw new Error(`coverage ${pages} not found`); cov.splice(i, 1, entry); };
fix([4], { pages: [4], lessonId: "digital-flip-source", status: "implemented" });
fix([8], { pages: [8], lessonId: "digital-flip-source", status: "implemented" });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("batch5b patched; items", items.length, "; lessons:", book.lessons.map((l) => l.id).slice(0, 4).join(" "));
