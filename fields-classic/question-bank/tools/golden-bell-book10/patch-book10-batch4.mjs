// 골든벨 10권 묶음 4: 교사용 지도서 4단원 「숫자 야구게임 · 수와 숫자의 개수」 108~132쪽.
// 보류 39건(4단원 전부)을 원본 문항으로 풀고, 장부에 없던 같은 쪽 문항 10개도 함께 넣는다.
// 새 단원 14 「숫자 야구게임 활동」(109~110·122~124쪽), 15 「숫자가 나오는 횟수」(111~113·120·125~126쪽),
// 16 「수와 숫자의 개수 활동」(114~118·121·127~132쪽). 14는 공개 단원 number-baseball-secret 뒤, 15·16은 number-digit-range-count 뒤.
// 108쪽의 297 예시 판은 설명용 보기라 문항으로 옮기지 않는다. 지도서의 보라·빨강 글씨(답·풀이·지운 숫자)는 옮기지 않는다.
// 이 스크립트에는 정답이 없다.  node patch-book10-batch4.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b10 = books.find((b) => b.id === "book-10");
const ids = ["number-baseball-source", "digit-occurrence-source", "digit-count-source"];
if (b10.lessons.some((l) => ids.includes(l.id))) throw new Error("already patched");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (b10.lessons.some((l) => [14, 15, 16].includes(numberOf(l)))) throw new Error("lesson number 14~16 taken");
const baseballLesson = b10.lessons.find((l) => l.id === "number-baseball-secret");
const countLesson = b10.lessons.find((l) => l.id === "number-digit-range-count");
const heldU4 = b10.sourceHold.filter((h) => /^B10-U4-/.test(h.sourceNo));
if (heldU4.length !== 39) throw new Error(`unit 4 holds ${heldU4.length}`);

const RULE = "S: 숫자와 자리가 모두 같아요 · B: 숫자는 같은데 자리가 달라요";
const ball = (rows, extra = {}) => ({ kind: "book10", subtype: "number-baseball", showCards: true, clues: rows.map(([g, s, b]) => ({ guess: String(g).split("").map(Number), strikes: s, balls: b })), note: RULE, ...extra });
const BALL = "다음 숫자 야구게임의 과정입니다. 판정 결과를 보고 술래가 생각한 세 자리 수를 구하시오.";
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const seq = (to, headTo = 14) => ({ kind: "book10", subtype: "number-sequence", head: range(1, headTo), tail: range(to - 2, to) });
const seqLast = (total) => ({ kind: "book10", subtype: "number-sequence", head: range(1, 12), last: "?", total });
const occ = (from, to, digit) => ({ kind: "book10", subtype: "digit-range", from, to, digit });
const LIST1 = (to) => `다음은 1부터 ${to}까지 모든 수들을 나열한 것입니다. 1부터 ${to}까지 모든 숫자의 개수를 구하시오.`;
const LAST = (total) => `다음과 같이 1부터 차례대로 자연수를 나열하였더니 모든 숫자의 개수가 ${total}개였습니다. 마지막 수를 구하시오.`;
const OCC = (from, to, digit) => `${from}부터 ${to}까지 차례대로 수를 써 나갈 때, 숫자 ${digit}는 모두 몇 번 나오는지 구하시오.`.replace(/숫자 ([0136])는/, "숫자 $1은");
const ROW = "다음 주어진 수의 범위에서 수의 개수와 숫자의 개수를 각각 구하시오.";
const P = (id, label, unit) => ({ id, label, ...(unit ? { unit } : {}) });
const ROWPARTS = [P("numbers", "수의 개수", "개"), P("digits", "숫자의 개수", "개")];
const rowVisual = (a, b) => ({ kind: "book10", subtype: "digit-range", from: a, to: b, label: "수의 개수와 숫자의 개수" });

// [단원, 쪽, 위치, 보류 sourceNo 또는 null(장부에 없던 문항), 유형, 물음, 그림, 답 방식(단위 또는 칸 배열)]
const specs = [
  // ── 단원 14: 숫자 야구게임 활동 ──
  [14, 109, "활동 02", "B10-U4-baseball-02", "스트라이크와 볼 단서", BALL, ball([[481, 1, 0], [462, 1, 1], [984, 0, 0]]), null],
  [14, 110, "활동 03", "B10-U4-baseball-03", "스트라이크와 볼 단서", BALL, ball([[716, 1, 0], [729, 1, 0], [735, 1, 1], [743, 1, 0]]), null],
  [14, 110, "활동 04", "B10-U4-baseball-04", "스트라이크와 볼 단서", BALL, ball([[926, 0, 0], [374, 2, 0], [378, 1, 0], [314, 1, 0]]), null],
  [14, 122, "도전 5", "B10-U4-baseball-05", "기호로 쓴 단서", "술래가 생각하고 있는 세 자리 수를 다른 학생들이 찾으려고 합니다. 학생이 세 자리 수를 쓰면 술래는 그 수 옆에 □와 △를 씁니다. □는 술래가 생각하고 있는 수와 같은 자리에, △는 다른 자리에 숫자가 있다는 기호입니다. 예를 들어 술래가 생각한 수가 234이고 학생이 314를 쓰면 술래는 □△를 씁니다. 여기에서 □는 숫자 4를, △는 숫자 3을 나타냅니다. 세 학생이 쓴 수 옆에 술래가 다음과 같이 기호를 썼다면 술래가 생각하고 있는 수는 무엇인지 구하시오.",
    ball([[236, 1, 1], [834, 2, 0], [832, 1, 0]], { notation: "symbols", showCards: false, note: "□: 같은 자리에 있는 숫자 · △: 다른 자리에 있는 숫자" }), null],
  [14, 123, "연습 01", "B10-U4-baseball-06", "스트라이크와 볼 단서", BALL, ball([[387, 1, 0], [781, 1, 1], [389, 2, 0]]), null],
  [14, 123, "연습 02", "B10-U4-baseball-07", "스트라이크와 볼 단서", BALL, ball([[439, 0, 0], [936, 1, 0], [917, 1, 1]]), null],
  [14, 124, "연습 03", "B10-U4-baseball-08", "스트라이크와 볼 단서", BALL, ball([[386, 0, 0], [279, 0, 1], [754, 0, 3]]), null],
  [14, 124, "연습 04", "B10-U4-baseball-09", "스트라이크와 볼 단서", BALL, ball([[471, 0, 0], [829, 2, 0], [823, 1, 0], [869, 1, 0]]), null],
  // ── 단원 15: 숫자가 나오는 횟수 ──
  [15, 111, "확인 1-01", null, "자리별로 숫자 세기", "1부터 365까지 차례대로 수를 써 나갈 때, 앞자리에 숫자 0을 넣을 수 있다고 하면 일의 자리, 십의 자리, 백의 자리에 숫자 3이 몇 번 나오는지 각각 구하시오. (예: 3은 003, 13은 013으로 봅니다.)",
    occ(1, 365, 3), [P("ones", "일의 자리", "번"), P("tens", "십의 자리", "번"), P("hundreds", "백의 자리", "번")]],
  [15, 111, "확인 1-03", null, "특정 숫자가 나타난 횟수", "1부터 365까지 차례대로 수를 써 나갈 때, 숫자 3은 모두 몇 번 나오는지 구하시오.", occ(1, 365, 3), "번"],
  [15, 112, "확인 01", "B10-U4-digit-occurrence-01", "특정 숫자가 나타난 횟수", OCC(1, 435, 4), occ(1, 435, 4), "번"],
  [15, 112, "확인 02", "B10-U4-digit-occurrence-02", "특정 숫자가 나타난 횟수", OCC(1, 554, 5), occ(1, 554, 5), "번"],
  [15, 113, "확인 03", "B10-U4-most-frequent-digit-01", "가장 많이 쓰인 숫자", "1부터 325까지 차례대로 수를 써 나갈 때, 가장 많이 나오는 숫자는 무엇인지 구하시오. 또, 그 숫자는 모두 몇 번 나오는지 구하시오.",
    { kind: "book10", subtype: "digit-range", from: 1, to: 325, label: "가장 많이 나오는 숫자" }, [P("digit", "가장 많이 나오는 숫자"), P("times", "나오는 횟수", "번")]],
  [15, 113, "확인 04", "B10-U4-digit-occurrence-03", "특정 숫자가 나타난 횟수", OCC(1, 369, 2), occ(1, 369, 2), "번"],
  [15, 120, "도전 1", "B10-U4-positive-range-occurrence-01", "양의 수 구간의 특정 숫자", OCC(200, 400, 2), occ(200, 400, 2), "번"],
  [15, 120, "도전 2", "B10-U4-positive-range-occurrence-02", "양의 수 구간의 특정 숫자", OCC(500, 650, 6), occ(500, 650, 6), "번"],
  [15, 125, "연습 05", "B10-U4-digit-occurrence-04", "특정 숫자가 나타난 횟수", OCC(1, 321, 1), occ(1, 321, 1), "번"],
  [15, 125, "연습 06", "B10-U4-digit-occurrence-05", "특정 숫자가 나타난 횟수", OCC(1, 444, 4), occ(1, 444, 4), "번"],
  [15, 126, "연습 07", "B10-U4-digit-occurrence-06", "특정 숫자가 나타난 횟수", OCC(1, 625, 5), occ(1, 625, 5), "번"],
  [15, 126, "연습 08", "B10-U4-digit-occurrence-07", "특정 숫자가 나타난 횟수", OCC(1, 332, 3), occ(1, 332, 3), "번"],
  // ── 단원 16: 수와 숫자의 개수 활동 ──
  [16, 114, "활동 (2)", "B10-U4-written-digit-count-04", "수의 개수와 숫자의 개수", `${ROW} (2) 28~53`, rowVisual(28, 53), ROWPARTS],
  [16, 114, "활동 (3)", "B10-U4-written-digit-count-05", "수의 개수와 숫자의 개수", `${ROW} (3) 10~99`, rowVisual(10, 99), ROWPARTS],
  [16, 114, "활동 (4)", "B10-U4-written-digit-count-06", "수의 개수와 숫자의 개수", `${ROW} (4) 100~999`, rowVisual(100, 999), ROWPARTS],
  [16, 115, "활동 01", "B10-U4-written-digit-count-07", "쓴 숫자의 전체 개수", LIST1(99), seq(99), "개"],
  [16, 115, "활동 02 (1)", "B10-U4-written-digit-count-08", "쓴 숫자의 전체 개수", "다음 주어진 수의 범위에서 모든 숫자의 개수를 구하시오. (1) 1~37", seq(37), "개"],
  [16, 115, "활동 02 (2)", "B10-U4-written-digit-count-09", "쓴 숫자의 전체 개수", "다음 주어진 수의 범위에서 모든 숫자의 개수를 구하시오. (2) 1~80", seq(80), "개"],
  [16, 116, "활동 03", "B10-U4-range-from-digit-count-01", "숫자 개수로 끝 수 찾기", LAST(51), seqLast(51), null],
  [16, 116, "활동 04", "B10-U4-range-from-digit-count-02", "숫자 개수로 끝 수 찾기", LAST(77), seqLast(77), null],
  [16, 117, "활동 05", "B10-U4-range-from-digit-count-03", "숫자 개수로 끝 수 찾기", LAST(109), seqLast(109), null],
  [16, 117, "활동 06", "B10-U4-range-from-digit-count-04", "숫자 개수로 끝 수 찾기", LAST(151), seqLast(151), null],
  [16, 118, "확인 01", "B10-U4-written-digit-count-10", "쓴 숫자의 전체 개수", LIST1(999), seq(999, 12), "개"],
  [16, 118, "확인 02", "B10-U4-written-digit-count-11", "쓴 숫자의 전체 개수", LIST1(300), seq(300, 12), "개"],
  [16, 121, "도전 3", "B10-U4-positive-range-digit-count-01", "네 자리까지의 숫자 개수", LIST1(9999), seq(9999, 12), "개"],
  [16, 121, "도전 4", "B10-U4-range-from-digit-count-05", "숫자 개수로 끝 수 찾기", LAST(492), seqLast(492), null],
  [16, 127, "연습 09 ①", null, "수의 개수와 숫자의 개수", `${ROW} ① 18~42`, rowVisual(18, 42), ROWPARTS],
  [16, 127, "연습 09 ②", null, "수의 개수와 숫자의 개수", `${ROW} ② 37~72`, rowVisual(37, 72), ROWPARTS],
  [16, 127, "연습 09 ③", null, "수의 개수와 숫자의 개수", `${ROW} ③ 10~49`, rowVisual(10, 49), ROWPARTS],
  [16, 127, "연습 09 ④", null, "수의 개수와 숫자의 개수", `${ROW} ④ 100~499`, rowVisual(100, 499), ROWPARTS],
  [16, 127, "연습 10", "B10-U4-written-digit-count-12", "쓴 숫자의 전체 개수", LIST1(49), seq(49), "개"],
  [16, 128, "연습 11", "B10-U4-written-digit-count-13", "쓴 숫자의 전체 개수", LIST1(30), seq(30), "개"],
  [16, 128, "연습 12", "B10-U4-written-digit-count-14", "쓴 숫자의 전체 개수", LIST1(73), seq(73), "개"],
  [16, 129, "연습 13", "B10-U4-range-from-digit-count-06", "숫자 개수로 끝 수 찾기", LAST(71), seqLast(71), null],
  [16, 129, "연습 14", "B10-U4-range-from-digit-count-07", "숫자 개수로 끝 수 찾기", LAST(55), seqLast(55), null],
  [16, 130, "연습 15", "B10-U4-range-from-digit-count-08", "숫자 개수로 끝 수 찾기", LAST(119), seqLast(119), null],
  [16, 130, "연습 16", "B10-U4-range-from-digit-count-09", "숫자 개수로 끝 수 찾기", LAST(171), seqLast(171), null],
  [16, 131, "연습 17", null, "쓴 숫자의 전체 개수", LIST1(199), seq(199, 12), "개"],
  [16, 131, "연습 18", null, "쓴 숫자의 전체 개수", LIST1(500), seq(500, 12), "개"],
  [16, 132, "연습 19", null, "쓴 숫자의 전체 개수", LIST1(210), seq(210, 12), "개"],
  [16, 132, "연습 20", null, "쓴 숫자의 전체 개수", LIST1(432), seq(432, 12), "개"]
];
const used = new Set(specs.map((s) => s[3]).filter(Boolean));
if (used.size !== 39 || heldU4.some((h) => !used.has(h.sourceNo))) throw new Error(`hold mapping ${used.size} ${heldU4.filter((h) => !used.has(h.sourceNo)).map((h) => h.sourceNo)}`);

const build = (lessonNo) => specs.filter((s) => s[0] === lessonNo).map(([, page, loc, holdNo, type, prompt, visual, mode], k) => {
  const answerRef = `/books/book-10/lessons/${lessonNo}/original/items/${k}`;
  const item = { id: `book10-guide-p${page}-${lessonNo}-${k + 1}`, unit: 4, sourcePage: page, sourceNo: holdNo || `B10-U4-P${page}-${loc.replace(/[^0-9A-Za-z가-힣]+/g, "-").replace(/^-|-$/g, "")}`,
    typeLabel: type, sourceLocator: `교사용 지도서 ${page}쪽 ${loc}`, printGroup: 800 + page, visual, prompt, answerRef };
  if (Array.isArray(mode)) item.parts = mode.map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else Object.assign(item, { answerMode: "input", inputMode: "numeric", ...(mode ? { unit: mode } : {}) });
  return item;
});
const [items14, items15, items16] = [14, 15, 16].map(build);
const note = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
const expOf = (sample, no, family, title, beats, hint, check) => ({ ...sample, family, title, beats, hint, check: { ...check, answerRef: `/books/book-10/lessons/${no}/experience/check` } });
const lesson14 = {
  id: ids[0], unit: baseballLesson.unit, title: "숫자 야구게임 활동", sourceLocator: "교사용 지도서 108~110쪽·122~124쪽 · 4단원 활동 01, 더클 도전문제, 더클 연습문제",
  sourceTypeIds: ["book10-number-baseball"],
  representativeConcept: "스트라이크와 볼 판정으로 들어 있는 숫자와 자리를 하나씩 좁혀 술래의 세 자리 수를 찾음",
  story: { title: "술래의 수를 찾아라", text: "술래는 0을 뺀 서로 다른 숫자 세 개로 세 자리 수를 만들어요. 학생들이 부른 수와 판정을 보고 술래의 수를 찾아요.", mission: "0S 0B인 수의 숫자부터 지우고, 2S인 수를 바탕으로 자리를 정해 보세요." },
  explanation: { headline: "지울 숫자부터 지우고, 자리를 정해요", steps: ["0S 0B이면 그 수의 세 숫자는 술래의 수에 하나도 없으니 모두 지웁니다.", "S는 숫자와 자리가 모두 같고, B는 숫자만 같고 자리는 다릅니다.", "두 수를 비교해 바뀐 숫자 하나 때문에 판정이 바뀌었으면, 그 숫자가 맞았는지 틀렸는지 알 수 있습니다.", "찾은 수를 모든 판정에 다시 넣어 맞는지 확인합니다."] },
  experience: expOf(baseballLesson.experience, 14, "number-baseball-activity-b10", "바뀐 숫자 하나로 판정을 비교해요", [
    { id: "unit4-ball-step-1", action: "reveal", caption: "586은 0S 0B예요. 술래의 수에는 5, 8, 6이 없어요.", visual: ball([[586, 0, 0]]) },
    { id: "unit4-ball-step-2", action: "highlight", caption: "213은 1S, 243은 2S예요. 1을 4로 바꾸었더니 S가 하나 늘었어요. 십의 자리는 4예요.", visual: ball([[586, 0, 0], [213, 1, 0], [243, 2, 0]]) },
    { id: "unit4-ball-step-3", action: "verify", caption: "찾은 수는 모든 판정에 다시 넣어 맞는지 확인해요.", visual: note(["0S 0B → 그 숫자 모두 지우기", "숫자 하나만 바꿔 판정 비교"]) }
  ], "0S 0B인 수의 숫자부터 지워 보세요.", { prompt: "말한 수 123의 판정이 1S 1B예요. 술래의 수에 1, 2, 3 중 몇 개가 들어 있을까요?", options: ["1개", "2개", "3개"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items14.length, structureKey: ids[0], prompt: "지도서 4단원 숫자 야구게임 문항을 푸시오.", items: items14 },
  extension: { title: "추가 학습", structureKey: ids[0], story: "새 숫자 야구게임 판정을 봅니다.", prompt: BALL, visual: ball([[273, 1, 0], [459, 1, 0], [184, 0, 2], [617, 0, 2]]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-10/lessons/14/extension" }
};
const lesson15 = {
  id: ids[1], unit: countLesson.unit, title: "숫자가 나오는 횟수", sourceLocator: "교사용 지도서 111~113쪽·120쪽·125~126쪽 · 4단원 더클 확인문제, 더클 도전문제, 더클 연습문제",
  sourceTypeIds: ["book10-digit-occurrence"],
  representativeConcept: "수를 차례로 쓸 때 한 숫자가 일·십·백의 자리에 각각 몇 번 나오는지 따로 세어 더함",
  story: { title: "숫자 하나를 자리별로 세요", text: "1부터 차례로 수를 쓰면 같은 숫자가 여러 자리에 나와요. 자리마다 따로 세면 빠뜨리지 않아요.", mission: "일의 자리, 십의 자리, 백의 자리를 차례로 세어 더해 보세요." },
  explanation: { headline: "자리마다 따로 세어 더해요", steps: ["앞자리에 0을 넣어 세 자리로 보면(예: 7 → 007) 자리마다 세기 쉽습니다.", "일의 자리에 그 숫자가 오는 수는 열 개마다 한 번씩 나옵니다.", "십의 자리에 그 숫자가 오는 수는 백 개마다 열 개씩 나옵니다.", "백의 자리에 그 숫자가 오는 수는 그 백 단위 안의 수 전부입니다. 세 자리 결과를 더합니다."] },
  experience: expOf(countLesson.experience, 15, "digit-occurrence-b10", "숫자 2를 자리별로 세요", [
    { id: "unit4-occ-step-1", action: "reveal", caption: "1부터 30까지 쓸 때 숫자 2를 세요. 일의 자리에는 2, 12, 22로 3번 나와요.", visual: occ(1, 30, 2) },
    { id: "unit4-occ-step-2", action: "highlight", caption: "십의 자리에는 20부터 29까지 10번 나와요.", visual: note(["일의 자리 3번", "십의 자리 10번"]) },
    { id: "unit4-occ-step-3", action: "verify", caption: "22는 일의 자리와 십의 자리에서 한 번씩 세었어요. 모두 더하면 13번이에요.", visual: note(["3 + 10 = 13"]) }
  ], "일의 자리, 십의 자리를 따로 세어 보세요.", { prompt: "1부터 50까지 쓸 때 숫자 4는 모두 몇 번 나올까요?", options: ["14번", "15번", "16번"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items15.length, structureKey: ids[1], prompt: "지도서 4단원 숫자가 나오는 횟수 문항을 푸시오.", items: items15 },
  extension: { title: "추가 학습", structureKey: ids[1], story: "1부터 수를 차례로 씁니다.", prompt: "1부터 250까지 차례대로 수를 써 나갈 때, 숫자 7은 모두 몇 번 나오는지 구하시오.", visual: occ(1, 250, 7), answerMode: "input", inputMode: "numeric", unit: "번", extensionKind: "source-structured-authored", answerRef: "/books/book-10/lessons/15/extension" }
};
const lesson16 = {
  id: ids[2], unit: countLesson.unit, title: "수와 숫자의 개수 활동", sourceLocator: "교사용 지도서 114~118쪽·121쪽·127~132쪽 · 4단원 활동 02, 더클 확인문제, 더클 도전문제, 더클 연습문제",
  sourceTypeIds: ["book10-digit-count"],
  representativeConcept: "한 자리·두 자리·세 자리 수가 몇 개인지 세어 자릿수를 곱해 숫자의 개수를 구하고, 거꾸로 숫자 개수로 마지막 수를 찾음",
  story: { title: "수는 몇 개, 숫자는 몇 개?", text: "수 23은 하나지만 숫자는 2와 3, 두 개예요. 자릿수가 같은 수끼리 묶어서 세요.", mission: "한 자리, 두 자리, 세 자리 수로 나누어 세어 보세요." },
  explanation: { headline: "자릿수가 같은 수끼리 묶어 세요", steps: ["수의 개수는 끝 수 - 처음 수 + 1입니다.", "1부터 9까지는 한 자리 수 9개, 10부터 99까지는 두 자리 수 90개, 100부터 999까지는 세 자리 수 900개입니다.", "묶음마다 수의 개수에 자릿수를 곱해 더하면 숫자의 개수입니다.", "숫자 개수로 마지막 수를 찾을 때는 한 자리 수 9개를 먼저 빼고, 남은 숫자를 자릿수로 나누어 몇 번째 수인지 셉니다."] },
  experience: expOf(countLesson.experience, 16, "digit-count-activity-b10", "숫자 개수로 마지막 수를 찾아요", [
    { id: "unit4-count-step-1", action: "reveal", caption: "1부터 차례로 썼더니 숫자가 39개였어요. 1부터 9까지가 숫자 9개예요.", visual: seqLast(39) },
    { id: "unit4-count-step-2", action: "highlight", caption: "남은 숫자 30개는 두 자리 수가 써요. 30 ÷ 2 = 15이니 두 자리 수 15개예요.", visual: note(["39 - 9 = 30", "30 ÷ 2 = 15"]) },
    { id: "unit4-count-step-3", action: "verify", caption: "10부터 15개를 세면 10, 11, …, 24예요. 마지막 수는 24예요.", visual: note(["10 + 15 - 1 = 24"]) }
  ], "한 자리 수 9개를 먼저 빼 보세요.", { prompt: "1부터 20까지 쓸 때 숫자는 모두 몇 개일까요?", options: ["29개", "31개", "40개"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items16.length, structureKey: ids[2], prompt: "지도서 4단원 수와 숫자의 개수 문항을 푸시오.", items: items16 },
  extension: { title: "추가 학습", structureKey: ids[2], story: "1부터 수를 차례로 씁니다.", prompt: LAST(87), visual: seqLast(87), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-10/lessons/16/extension" }
};
for (const l of [lesson14, lesson15, lesson16]) delete l.experience.model;
b10.lessons.splice(b10.lessons.indexOf(baseballLesson) + 1, 0, lesson14);
b10.lessons.splice(b10.lessons.indexOf(countLesson) + 1, 0, lesson15, lesson16);

// ── 장부: 4단원 보류 39건 해제, 장부에 없던 문항 10개 새로 셈 ──
const extra = specs.filter((s) => !s[3]).length;
b10.sourceHold = b10.sourceHold.filter((h) => !/^B10-U4-/.test(h.sourceNo));
const cov = b10.sourceCoverage;
const u4 = cov.byUnit.find((u) => u.unit === 4);
u4.public += u4.hold + extra; u4.total += extra; u4.hold = 0;
for (const c of cov.catalog.filter((c) => c.unit === 4)) { c.public += c.hold; c.hold = 0; }
cov.catalog.push({ unit: 4, unitTitle: u4.title, id: "guide-activity-extra-u4", label: "장부에 없던 지도서 활동 문항(111·127·131~132쪽)", total: extra, minimumArithmetic: false, public: extra, hold: 0 });
cov.total = cov.byUnit.reduce((n, u) => n + u.total, 0);
cov.public = cov.byUnit.reduce((n, u) => n + u.public, 0);
cov.hold = cov.byUnit.reduce((n, u) => n + u.hold, 0);
if (cov.hold !== b10.sourceHold.length) throw new Error(`hold count ${cov.hold} vs ${b10.sourceHold.length}`);
b10.source.note = `교사용 지도서의 활동 슬롯을 장부화했습니다. 2단원(52~66쪽)·3단원(78~104쪽, 쪽 그림을 읽지 못한 97쪽 제외)·4단원(108~132쪽)은 원본 대조를 마쳐 보류가 없습니다. 전체 ${cov.total}개 중 공개 ${cov.public}개, 보류 ${cov.hold}개.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book10 batch4 patched", { items14: items14.length, items15: items15.length, items16: items16.length, extra, holds: b10.sourceHold.length, total: cov.total, public: cov.public });
