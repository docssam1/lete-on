// 골든벨 10권을 골든벨 판서 단원만 남기도록 정리한다(2026-10-23, 원장 확인).
// 골든벨은 사전 학습이라 원본이 골든벨 판서(9권 판서 파일 10~11쪽)뿐이다. 그동안 10권 골든벨에 들어 있던
// 교사용 지도서(본교재) 단원 19개는 본교재 문항이라 골든벨에서 뺀다. 본교재 10권의 활동·확인·도전·연습 문항은
// 문제은행 10권(source-data.js CURRICULUM book-10, 네 단원 문항 번호 전부)에 이미 유형으로 연결돼 있다.
// 남기는 단원: 7 napier-split-source · 8 number-count-source · 9 consecutive-even-source · 10 consecutive-odd-source.
// 뺀 단원의 공개 데이터는 git 이력과 patch-book10-batch1~5.mjs에 남는다. 비공개 답안 DB의 키는 지우지 않는다.
// 이 스크립트에는 정답이 없다.  node patch-book10-goldenbell-only.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b10 = books.find((b) => b.id === "book-10");
const keep = ["napier-split-source", "number-count-source", "consecutive-even-source", "consecutive-odd-source"];
if (b10.lessons.length === keep.length) throw new Error("already patched");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
const kept = keep.map((id) => b10.lessons.find((l) => l.id === id));
if (kept.some((l) => !l)) throw new Error("a golden bell lesson is missing");
if (kept.map(numberOf).join() !== "7,8,9,10") throw new Error("golden bell lesson numbers moved");
const ledger = b10.sourceCoverage.goldenBell;
if (!ledger || ledger.lessons.join() !== keep.join()) throw new Error("golden bell ledger changed");
const publicItems = kept.reduce((n, l) => n + l.original.items.length, 0);
if (publicItems !== ledger.publicItems) throw new Error(`public items ${publicItems} vs ${ledger.publicItems}`);

for (const l of kept) {
  // 인쇄 단원 묶기는 단원 이름(문자열)으로 문제은행 단원과 맞춘다. 숫자 1로 들어가 있어 10권 인쇄가 멈췄다.
  l.unit = "연속수의 합";
  if (l.experience?.learnerFit) l.experience.learnerFit.representations = "골든벨 판서의 연속수·네이피어·수의 개수 구조";
}
b10.lessons = kept;
// 옛 제목의 「문제 해결」은 빼는 본교재 2단원(합과 차) 이름이다. 판서 내용(네이피어 곱셈·연속수의 합)으로 바꾼다.
b10.title = "곱셈과 연속수의 합";
b10.source = {
  file: "교사용 골든벨 10권",
  verified: true,
  note: `10권 골든벨 판서는 9권 판서 파일 끝 10~11쪽(「<10권> 01. 연속수의 합」)에 있습니다. 네이피어 곱셈·수의 개수·짝수 개와 홀수 개 연속수의 합 ${publicItems}문항을 원본 대조했습니다. 본교재(교사용 지도서) 문항은 골든벨이 아니라 문제은행 10권에 있습니다.`
};
b10.sourceCoverage = { ...ledger };
b10.sourceHold = [];
b10.sourceQuestionCount = publicItems;
b10.sourceExpansionVersion = "book10-golden-bell-v1";
b10.dailyPractice = { ...b10.dailyPractice, problemCount: Math.min(b10.dailyPractice.problemCount, publicItems) };

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book10 golden bell only", { lessons: kept.map((l) => `${numberOf(l)}:${l.id}:${l.original.items.length}`), publicItems });
