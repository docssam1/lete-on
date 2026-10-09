// 4권 묶음 2: 원본 16~17쪽 쌓기나무 최소 개수, 18쪽 아래 보이지 않는 쌓기나무 그림 3개. 정답은 비공개 DB에만.
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-04");
const lesson = (id) => book.lessons.find((l) => l.id === id);
if (lesson("cube-min-count")) throw new Error("already patched");
const L11 = (i) => `/books/book-04/lessons/11/original/items/${i}`;

const ref = books.find((b) => b.id === "book-09").lessons.find((l) => l.id === "cube-map-total");
const experience = JSON.parse(JSON.stringify(ref.experience).replaceAll("/books/book-09/lessons/1/experience/", "/books/book-04/lessons/11/experience/"));
experience.learnerStage = "7세 8월부터 초등 1학년 초반 · FC 1과정 4권";
experience.model.visual.map = [[3, 2, 1], [2, 1, 0], [1, 0, 0]];

const FULL = "쌓기나무의 개수는 오른쪽 그림과 같이 가장 위에 있는 쌓기나무에 그 줄에 있는 쌓기나무의 개수를 써서 더하면 됩니다. 다음 그림에서 쌓기나무는 최소 몇 개인지 구하시오.";
const SHORT = "다음 그림에서 쌓기나무는 최소 몇 개인지 구하시오.";
const figures = [
  ["16-(1)", 1, [[2, 2], [2, 2]]],
  ["16-(2)", 1, [[3, 3, 3], [3, 3, 3], [3, 3, 3]]],
  ["16-(3)", 1, [[2, 1], [1, 0]]],
  ["17-(1)", 2, [[2, 2, 1], [2, 1, 0]]],
  ["17-(2)", 2, [[3, 1], [1, 2]]],
  ["17-(3)", 2, [[2, 1], [3, 2], [2, 0]]],
  ["17-(4)", 2, [[3, 2, 1], [2, 1, 0], [1, 0, 0]]]
];
let lastGroup = 0;
const items = figures.map(([sourceNo, printGroup, map], i) => {
  const example = printGroup !== lastGroup;
  lastGroup = printGroup;
  return { id: `cube-min-${i + 1}`, sourceNo, typeLabel: "윗면에 줄의 개수를 써서 더하기", sourceLocator: `학생용 ${sourceNo.slice(0, 2)}쪽 활동 02 ①`, printGroup,
    prompt: example ? FULL : SHORT, visual: { kind: "book4", subtype: "source-cube-topview", map, ...(example ? { example: true } : {}) },
    answerMode: "input", inputMode: "numeric", answerRef: L11(i) };
});
const newLesson = {
  id: "cube-min-count",
  unit: "색종이 접기와 쌓기나무",
  title: "쌓기나무의 개수를 세어요",
  sourceLocator: "학생용 16~17쪽 활동 02 ①",
  sourceTypeIds: ["cube-top-height-total"],
  representativeConcept: "가장 위에 있는 쌓기나무에 그 줄의 개수를 쓰고 모두 더하면, 가려진 것까지 센 최소 개수가 됨",
  experience,
  story: { title: "쌓기나무 줄 세기", text: "앞에 있는 쌓기나무에 가려 보이지 않는 쌓기나무도 위에 있는 쌓기나무를 받치고 있어야 합니다.", mission: "가장 위 쌓기나무마다 그 줄의 개수를 쓰고 모두 더하세요." },
  explanation: { headline: "줄마다 개수를 쓰고 더합니다.", steps: ["위에서 본 모양의 칸마다 그 자리에 쌓인 줄을 찾습니다.", "가장 위에 있는 쌓기나무에 그 줄의 개수를 씁니다.", "쓴 수를 모두 더하면 쌓기나무의 최소 개수입니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: items.length, structureKey: "cube-top-height-total-source-structure", prompt: "그림을 보고 쌓기나무가 최소 몇 개인지 구하세요.", items },
  extension: { title: "추가 학습", structureKey: "cube-top-height-total-source-structure", story: "민지가 쌓기나무로 계단을 만들었습니다.", prompt: "위에서 본 모양의 네 자리에 쌓기나무가 쌓여 있습니다. 쌓기나무는 최소 몇 개일까요?", visual: { kind: "book4", subtype: "source-cube-topview", map: [[3, 2], [2, 1]] }, answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/11/extension" }
};
book.lessons.splice(book.lessons.findIndex((l) => l.id === "hidden-cube-count"), 0, newLesson);

// 18쪽 아래 그림 3개 → 보이지 않는 쌓기나무 단원 끝
{
  const o = lesson("hidden-cube-count").original;
  const maps = [[[2, 2], [2, 1]], [[2, 1, 1], [1, 2, 0], [0, 1, 1]], Array.from({ length: 4 }, () => [4, 4, 4, 4])];
  maps.forEach((map, i) => {
    const n = o.items.length;
    o.items.push({ id: `hidden-${n + 1}`, sourceNo: `18-(${n + 1})`, typeLabel: "보이지 않는 쌓기나무 찾기", printGroup: 2, prompt: "다음 그림에서 보이지 않는 쌓기나무의 개수를 구하시오.",
      visual: { kind: "book4", subtype: "source-hidden-cube", single: true, map }, answerMode: "input", inputMode: "numeric",
      sourceLocator: `학생용 18쪽 활동 02 아래 그림 ${i + 1}`, answerRef: `/books/book-04/lessons/1/original/items/${n}` });
  });
  o.sourceQuestionCount = o.items.length;
}
const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("batch2 patched; lessons:", book.lessons.map((l) => l.id).join(" "));
