// 골든벨 10권 묶음 5: 교사용 지도서 1단원 「연속수의 합」 6~49쪽을 원본에서 다시 옮긴다.
// 옛 단원 0·1·2(napier-multiplication · even-consecutive-sum · consecutive-page-range)의 문항 55개는 지도서와 어긋난 곳이 많았다
// (쪽 번호 없음, 그림이 답을 보여 줌 — 예: 14를 4개의 연속수로 나타내는 문항에 2부터 5까지 카드가 그려져 있었다).
// 그래서 세 단원의 원본 문항은 통째로 새로 쓰고, 단원 번호·개념·추가 학습은 그대로 둔다.
// 새 단원 17 「곱셈 규칙으로 간단히 계산해요」, 18 「두 수의 곱과 약수」, 19 「달력과 쪽수로 연속수 찾기」,
// 20 「수 배열표와 달력 묶음의 합」, 21 「여러 가지 방법의 연속수의 합」, 22 「연속 홀수·짝수와 도전 문제」.
// 1단원 보류 6건을 풀고, 1단원 장부를 원본 문항 수대로 다시 센다.
// 개념 그림·확인 문제가 원본 문항의 답을 보여 주던 곳(단원 0·1·2·9·10)은 원본에 없는 예로 바꾼다.
// 이 스크립트에는 정답이 없다.  node patch-book10-batch5.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b10 = books.find((b) => b.id === "book-10");
const newIds = ["multiplication-rule-source", "factor-pairs-source", "calendar-page-source", "number-grid-sum-source", "consecutive-ways-source", "odd-even-consecutive-source"];
if (b10.lessons.some((l) => newIds.includes(l.id))) throw new Error("already patched");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (b10.lessons.some((l) => numberOf(l) >= 17)) throw new Error("lesson number 17+ taken");
const L = (id) => b10.lessons.find((l) => l.id === id);
const [l0, l1, l2] = ["napier-multiplication", "even-consecutive-sum", "consecutive-page-range"].map(L);
if ([l0, l1, l2].map(numberOf).join() !== "0,1,2") throw new Error("lesson 0/1/2 moved");
const heldU1 = b10.sourceHold.filter((h) => /^B10-U1-/.test(h.sourceNo));
if (heldU1.length !== 6) throw new Error(`unit 1 holds ${heldU1.length}`);

const range = (a, b, step = 1) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => a + i * step);
const ORDINAL = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째", "열째", "열한째", "열두째"];
const P = (id, label, unit, extra = {}) => ({ id, label, ...(unit ? { unit } : {}), ...extra });
const v = (subtype, data) => ({ kind: "book10", subtype, ...data });
const note = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
const op = (expression) => v("operation", { expression });
const plus = (a, b) => range(a, b).join(" + ");
const dots = (a, b) => `${a} + ${a + 1} + ${a + 2} + … + ${b}`;

// ── 그림 ──
const napier = (first, second) => v("napier-grid", { first, second, blankCells: true });
const tile = (first, second) => v("area-model", { first, second, revealProducts: false });
const cells = (first, second, given = "____", workRows = 0) => v("product-cells", { first, second, cells: given.split("").map((c) => (c === "_" ? "" : c)), ...(workRows ? { workRows } : {}) });
const factor = (target, rows, given) => v("factor-rows", { target, rows, ...(given ? { given } : {}) });
const blanks = (total, count, label) => v("consecutive-blanks", { total, count, ...(label ? { label } : {}) });
const pages = (count, total) => v("page-strip", { count, total });
const week = (month, sum, shadeRow, shadeFrom) => v("blank-calendar", { month, sum, rows: 5, shadeRow, shadeFrom, shadeTo: 6 });
const grid = (cols, rows, on) => {
  const values = range(0, rows - 1).map((r) => range(1, cols).map((c) => r * cols + c));
  return v("number-grid", { values, highlighted: on.map((n) => n - 1) });
};
const calendarOn = (on) => v("calendar", { dayOne: 2, days: 31, highlighted: on });

// ── 답 방식 ──
const N = (unit) => ({ unit });                     // 수 하나
const TERMS = (count) => range(0, count - 1).map((i) => P(`term-${i + 1}`, `${ORDINAL[i]} 수`)); // 동그라미마다
const DIVISORS = [P("divisors", "약수(쉼표로 나누어 모두)", null, { inputMode: "text", resultContract: { type: "set" } }), P("count", "약수의 개수", "개")];
const PAGES = [P("first", "처음 쪽", "쪽"), P("last", "마지막 쪽", "쪽")];
const WEEKDAY = { text: true };
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

// ── 문장 ──
const NAPIER = "네이피어 곱셈법을 이용하여 다음 곱셈을 하시오.";
const TILE = "타일그림을 이용하여 다음 곱셈을 하시오.";
const RULE_T = "다음 십의 자리 숫자가 같고 일의 자리 숫자의 합이 10인 두 자리 수의 곱셈식을 계산하시오. (계산 결과의 규칙도 찾아 보세요.)";
const RULE_T2 = "확인 01에서 찾은 규칙을 이용하여 다음 십의 자리 숫자가 같고 일의 자리 숫자의 합이 10인 두 자리 수의 곱셈식을 간단하게 계산하시오.";
const RULE_O = "다음 일의 자리 숫자가 같고 십의 자리 숫자의 합이 10인 두 자리 수의 곱셈식을 계산하시오. (계산 결과의 규칙도 찾아 보세요.)";
const RULE_O2 = "확인 03에서 찾은 규칙을 이용하여 다음 일의 자리 숫자가 같고 십의 자리 숫자의 합이 10인 두 자리 수의 곱셈식을 간단하게 계산하시오.";
const RULE_TP = "다음은 십의 자리 숫자가 같고 일의 자리 숫자의 합이 10인 두 자리 수의 곱셈식입니다. 계산 결과의 규칙을 찾아 간편하게 계산하시오.";
const RULE_OP = "다음은 일의 자리 숫자가 같고 십의 자리 숫자의 합이 10인 두 자리 수의 곱셈식입니다. 계산 결과의 규칙을 찾아 간편하게 계산하시오.";
const FACTOR = "다음 주어진 수를 두 수의 곱으로 나타내고, 주어진 수를 나누어떨어지게 하는 수(약수)의 개수를 구하시오. 곱에 쓰인 수(약수)는 쉼표로 나누어 모두 쓰시오.";
const GAUSS = "가우스 계산의 원리를 이용하여 다음 연속수의 합을 구하시오.";
const SUM = "다음 연속수의 합을 구하시오.";
const EXPRESS = "다음 주어진 수를 연속수의 합으로 나타내시오.";
const eul = (n) => `${n}${[0, 1, 3, 6, 7, 8].includes(n % 10) ? "을" : "를"}`;
const AS = (n, counts, k) => `${eul(n)} ${counts.join("개, ")}개의 연속수의 합으로 나타낸 것입니다. ○ 안에 알맞은 수를 써넣으시오. (${k}) ${counts[k - 1]}개`;
const CAL = (month, sum, from, holiday, day) => `어느 해 ${month}월의 달력에서 어느 주 ${from}요일부터 토요일까지 날짜 수를 모두 더하였더니 ${sum}${/[0-9]*[2459]$/.test(String(sum)) ? "가" : "이"} 되었습니다. 그 해의 ${holiday}(${month}월 ${day}일)은 무슨 요일인지 구하시오.`;
const READ = {
  p20: "재욱이는 동화책을 매일 8쪽씩 읽기로 하였습니다. 오늘 읽은 8쪽 쪽수의 합이 100일 때, 오늘은 몇 쪽부터 몇 쪽까지 읽었는지 구하시오.",
  p26: "나연이는 《해리포터와 마법사의 돌》을 매일 9쪽씩 읽기로 하였습니다. 오늘 읽은 책의 쪽수의 합이 126일 때, 오늘은 몇 쪽부터 몇 쪽까지 읽었는지 구하시오.",
  p42: "재윤이는 동화책을 매일 6쪽씩 읽기로 하였습니다. 오늘 읽은 쪽수의 합이 75일 때, 오늘은 몇 쪽부터 몇 쪽까지 읽었는지 구하시오.",
  p46: "윤아는 《마법천자문》을 매일 9쪽씩 읽기로 하였습니다. 오늘 읽은 쪽수의 합이 144일 때, 오늘은 몇 쪽부터 몇 쪽까지 읽었는지 구하시오."
};
const WAYS42 = "다음은 42를 여러 가지 방법으로 연속수의 합으로 나타낸 것입니다. 42 = 13 + 14 + 15, 42 = 9 + 10 + 11 + 12, 42 = 3 + 4 + 5 + 6 + 7 + 8 + 9. 같은 방법으로 90을 여러 가지 방법의 연속수의 합으로 나타내시오.";
const WAYS126 = "다음은 126을 여러 가지 방법으로 연속수의 합으로 나타낸 것입니다. ○ 안에 알맞은 수를 써넣으시오.";
const WAYS45 = "다음은 45를 2개, 3개, 5개, 6개, 9개의 연속수의 합으로 나타낸 것입니다. ○ 안에 알맞은 수를 써넣으시오.";
const ODD = "오른쪽 식은 21을 연속한 3개의 홀수들의 합으로 나타낸 것입니다(21 = 5 + 7 + 9). 같은 방법으로 주어진 수를 연속한 홀수들의 합으로 나타내시오.";
const EVEN = "다음 주어진 수를 연속한 짝수들의 합으로 나타내시오.";
const DIFF = (k, kind) => `다음과 같이 1부터 ㉠까지의 자연수 중에서 짝수 전체의 합과 홀수 전체의 합의 차가 10입니다. (${k}) 끝수 ㉠이 ${kind}일 때, ㉠은 얼마인지 구하시오.`;
const MASKED = (k) => `다음은 연속하는 세 수의 덧셈을 나타낸 것입니다. 빈칸에 알맞은 숫자를 써넣으시오. (단, 백의 자리 숫자는 0이 아닙니다.) (${k})`;
const MASKPARTS = [P("first", "첫째 수"), P("second", "둘째 수"), P("third", "셋째 수"), P("hundreds", "합의 백의 자리 숫자")];
const gaussRows = (ends, firstTwo) => ends.map((end, i) => ({ label: CIRCLED[i], expr: i < 2 ? plus(1, end).replaceAll(" ", "") : `1+2+3+ … +${end}`, ...(i < 2 ? { process: firstTwo[i] } : {}) }));
const oddRows = (ends) => ends.map((end, i) => ({ label: CIRCLED[i], expr: i < 2 ? plus(1, end).replaceAll(" ", "") : `1+2+3+…+□+…+${end - 2}+${end - 1}+${end}`, ...(i < 2 ? { process: `${(end + 1) / 2}×${end} = □` } : {}) }));
const ODD_ENDS = [9, 11, 13, 15, 17, 19, 39, 59, 79, 99];

// [단원, 쪽, 위치, 보류 sourceNo 또는 null, 유형, 물음, 그림, 답 방식(단위·칸 배열·글자)]
const specs = [
  // ── 단원 0: 곱셈을 여러 방법으로 ──
  [0, 7, "활동 01 (1)", null, "네이피어 곱셈", NAPIER, napier(46, 35), N()],
  [0, 7, "활동 01 (2)", null, "네이피어 곱셈", NAPIER, napier(574, 93), N()],
  [0, 8, "활동 02 (1)", null, "타일그림 곱셈", TILE, tile(36, 25), N()],
  [0, 8, "활동 02 (2)", null, "타일그림 곱셈", TILE, tile(75, 56), N()],
  [0, 9, "활동 03", null, "여러 방법으로 곱하기", "곱셈식 57×34를 타일그림 곱셈과 네이피어 곱셈, 세로셈을 이용하여 각각 구하시오.", tile(57, 34), N()],
  [0, 34, "연습 01 (1)", null, "네이피어 곱셈", NAPIER, napier(49, 27), N()],
  [0, 34, "연습 01 (2)", null, "네이피어 곱셈", NAPIER, napier(365, 24), N()],
  [0, 34, "연습 02 (1)", null, "타일그림 곱셈", TILE, tile(48, 35), N()],
  [0, 34, "연습 02 (2)", null, "타일그림 곱셈", TILE, tile(65, 32), N()],
  // ── 단원 17: 곱셈 규칙 ──
  ...[[14, 16], [29, 21], [43, 47], [72, 78]].map(([a, b], i) => [17, 10, `확인 01 ${CIRCLED[i]}`, null, "십의 자리가 같은 곱셈", RULE_T, cells(a, b, "____", 2), N()]),
  ...[[36, 34, "__24"], [48, 42, "20__"], [74, 76], [97, 93], [25, 25, "6__"], [35, 35, "__25"], [45, 45], [75, 75]].map(([a, b, g], i) => [17, 10, `확인 02 ${CIRCLED[i]}`, null, "십의 자리가 같은 곱셈", RULE_T2, cells(a, b, g), N()]),
  ...[[43, 63], [24, 84], [65, 45], [76, 36]].map(([a, b], i) => [17, 11, `확인 03 ${CIRCLED[i]}`, null, "일의 자리가 같은 곱셈", RULE_O, cells(a, b, "____", 2), N()]),
  ...[[24, 84, "__16"], [38, 78, "29__"], [47, 67], [16, 96], [53, 53, "28__"], [54, 54, "__16"], [56, 56], [58, 58]].map(([a, b, g], i) => [17, 11, `확인 04 ${CIRCLED[i]}`, null, "일의 자리가 같은 곱셈", RULE_O2, cells(a, b, g), N()]),
  ...[[47, 43, "__21"], [56, 54, "30__"], [72, 78], [94, 96], [35, 35, "12__"], [65, 65, "__25"], [85, 85], [95, 95]].map(([a, b, g], i) => [17, 35, `연습 03 ${CIRCLED[i]}`, null, "십의 자리가 같은 곱셈", RULE_TP, cells(a, b, g), N()]),
  ...[[43, 63, "__09"], [89, 29, "25__"], [34, 74], [17, 97], [52, 52, "27__"], [55, 55, "__25"], [57, 57], [59, 59]].map(([a, b, g], i) => [17, 36, `연습 04 ${CIRCLED[i]}`, null, "일의 자리가 같은 곱셈", RULE_OP, cells(a, b, g), N()]),
  // ── 단원 18: 두 수의 곱과 약수 ──
  ...[[12, 3, [[1, 12], [2, null]]], [16, 3, [[1, 16]]], [30, 4], [36, 5]].map(([t, r, g], i) => [18, 13, `활동 01 ${CIRCLED[i]}`, null, "두 수의 곱과 약수", FACTOR, factor(t, r, g), DIVISORS]),
  ...[[60, 6], [90, 6], [100, 5], [126, 6]].map(([t, r], i) => [18, 14, `활동 02 ${CIRCLED[i]}`, null, "두 수의 곱과 약수", FACTOR, factor(t, r), DIVISORS]),
  ...[[18, 3, [[1, 18], [2, null]]], [24, 4], [45, 3], [48, 5]].map(([t, r, g], i) => [18, 37, `연습 05 ${CIRCLED[i]}`, null, "두 수의 곱과 약수", FACTOR, factor(t, r, g), DIVISORS]),
  ...[[64, 4], [80, 5], [84, 6], [105, 4]].map(([t, r], i) => [18, 38, `연습 06 ${CIRCLED[i]}`, null, "두 수의 곱과 약수", FACTOR, factor(t, r), DIVISORS]),
  // ── 단원 1: 짝수 개 연속수의 합 ──
  [1, 15, "가우스의 원리", null, "짝지어 곱하기", "가우스가 합을 구한 원리는 두 개씩 짝지어 합이 101이 되게 만든 후 곱셈으로 구한 것입니다. 1에서 100까지의 합을 구하시오.", op("1 + 2 + 3 + … + 50 + 51 + … + 98 + 99 + 100 = 101 × □ = □"), [P("times", "101에 곱하는 수"), P("sum", "합")]],
  [1, 16, "활동 03", "B10-U1-source-format-hold-01", "가우스 표", "가우스 계산의 원리를 이용하여 다음 연속수의 합을 구하시오. 표의 ①~⑩ 연속수의 합을 차례대로 쓰시오.",
    v("sum-table", { rows: gaussRows([8, 10, 12, 14, 16, 18, 20, 40, 60, 80], ["(1+8)×4 = □", "(1+10)×5 = □"]) }), CIRCLED.map((c, i) => P(`sum-${i + 1}`, c))],
  ...[[4, 11], [6, 15], [2, 13], [5, 16]].map(([a, b], i) => [1, 17, `활동 04 (${i + 1})`, null, "짝수 개 연속수의 합", GAUSS, op(`${plus(a, b)} = □ × □ = □`), N()]),
  ...[14, 20, 60].map((end, i) => [1, 39, `연습 07 (${i + 1})`, null, "짝수 개 연속수의 합", GAUSS, op(dots(1, end)), N()]),
  ...[[3, 10], [7, 16], [10, 19]].map(([a, b], i) => [1, 39, `연습 08 (${i + 1})`, null, "짝수 개 연속수의 합", GAUSS, op(`${plus(a, b)} = □ × □ = □`), N()]),
  ...[[18, "활동 05 (1)", 14, 4], [18, "활동 05 (2)", 30, 4], [18, "활동 06 (1)", 39, 6], [18, "활동 06 (2)", 57, 6], [19, "확인 01 (1)", 84, 8], [19, "확인 01 (2)", 95, 10]].map(([p, loc, t, c]) => [1, p, loc, null, "짝수 개 연속수로 나타내기", EXPRESS, blanks(t, c), TERMS(c)]),
  ...[6, 10].map((c, i) => [1, 19, `확인 02 (${i + 1})`, null, "짝수 개 연속수로 나타내기", AS(75, [6, 10], i + 1), blanks(75, c), TERMS(c)]),
  ...[[40, "연습 09 (1)", 18, 4], [40, "연습 09 (2)", 34, 4], [40, "연습 10 (1)", 69, 6], [40, "연습 10 (2)", 81, 6], [41, "연습 11 (1)", 68, 8], [41, "연습 11 (2)", 125, 10]].map(([p, loc, t, c]) => [1, p, loc, null, "짝수 개 연속수로 나타내기", EXPRESS, blanks(t, c), TERMS(c)]),
  ...[6, 10].map((c, i) => [1, 41, `연습 12 (${i + 1})`, null, "짝수 개 연속수로 나타내기", AS(105, [6, 10], i + 1), blanks(105, c), TERMS(c)]),
  // ── 단원 2: 홀수 개 연속수의 합 ──
  [2, 21, "중간수 만들기", null, "가운데 수로 곱하기", "연속수가 홀수 개일 때는 중간수를 중심으로 주고받기를 하면 모두 중간수를 만들 수 있습니다. □ 안에 알맞은 수를 써넣으시오.", op("2 + 3 + 4 + 5 + 6 = 4 + 4 + 4 + 4 + 4 = 4 × □ = □"), [P("times", "4에 곱하는 수"), P("sum", "합")]],
  [2, 22, "활동 01 가운데 수", null, "가운데 수 찾기", "다음 연속수의 합을 구하려고 합니다. 표의 ③~⑩에서 □에 들어갈 가운데 수를 차례대로 쓰시오.", v("sum-table", { rows: oddRows(ODD_ENDS) }), CIRCLED.slice(2).map((c, i) => P(`middle-${i + 3}`, c))],
  [2, 22, "활동 01 합", "B10-U1-source-format-hold-02", "홀수 개 연속수의 합", "다음 연속수의 합을 구하시오. 표의 ①~⑩ 연속수의 합을 차례대로 쓰시오.", v("sum-table", { rows: oddRows(ODD_ENDS) }), CIRCLED.map((c, i) => P(`sum-${i + 1}`, c))],
  ...[[6, 10], [3, 9], [3, 11], [4, 16]].map(([a, b], i) => [2, 23, `활동 02 (${i + 1})`, null, "홀수 개 연속수의 합", SUM, op(`${plus(a, b)} = □ × □ = □`), N()]),
  ...[17, 39, 99].map((end, i) => [2, 43, `연습 15 (${i + 1})`, null, "홀수 개 연속수의 합", SUM, op(dots(1, end)), N()]),
  ...[[4, 8], [2, 8], [5, 13]].map(([a, b], i) => [2, 43, `연습 16 (${i + 1})`, null, "홀수 개 연속수의 합", SUM, op(`${plus(a, b)} = □ × □ = □`), N()]),
  ...[[24, "활동 03 (1)", 36, 3], [24, "활동 03 (2)", 51, 3], [24, "활동 03 (3)", 84, 3], [24, "활동 04 (1)", 20, 5], [24, "활동 04 (2)", 60, 5], [24, "활동 04 (3)", 85, 5], [25, "활동 05 (1)", 126, 7], [25, "활동 05 (2)", 117, 9]].map(([p, loc, t, c]) => [2, p, loc, null, "홀수 개 연속수로 나타내기", EXPRESS, blanks(t, c), TERMS(c)]),
  ...[3, 7, 9].map((c, i) => [2, 25, `활동 06 (${i + 1})`, null, "홀수 개 연속수로 나타내기", AS(63, [3, 7, 9], i + 1), blanks(63, c), TERMS(c)]),
  ...[[44, "연습 17 (1)", 48, 3], [44, "연습 17 (2)", 57, 3], [44, "연습 17 (3)", 72, 3], [44, "연습 18 (1)", 40, 5], [44, "연습 18 (2)", 70, 5], [44, "연습 18 (3)", 95, 5], [45, "연습 19 (1)", 98, 7], [45, "연습 19 (2)", 135, 9]].map(([p, loc, t, c]) => [2, p, loc, null, "홀수 개 연속수로 나타내기", EXPRESS, blanks(t, c), TERMS(c)]),
  ...[3, 5, 7].map((c, i) => [2, 45, `연습 20 (${i + 1})`, null, "홀수 개 연속수로 나타내기", AS(105, [3, 5, 7], i + 1), blanks(105, c), TERMS(c)]),
  // ── 단원 19: 달력과 쪽수 ──
  [19, 20, "확인 03", null, "달력 한 주의 합", CAL(12, 141, "월", "크리스마스", 25), week(12, 141, 3, 1), WEEKDAY],
  [19, 20, "확인 04", null, "읽은 쪽수의 합", READ.p20, pages(8, 100), PAGES],
  [19, 26, "활동 07", null, "달력 한 주의 합", CAL(5, 91, "일", "어린이날", 5), week(5, 91, 2, 0), WEEKDAY],
  [19, 26, "활동 08", null, "읽은 쪽수의 합", READ.p26, pages(9, 126), PAGES],
  [19, 42, "연습 13", null, "달력 한 주의 합", CAL(3, 51, "월", "삼일절", 1), week(3, 51, 1, 1), WEEKDAY],
  [19, 42, "연습 14", null, "읽은 쪽수의 합", READ.p42, pages(6, 75), PAGES],
  [19, 46, "연습 21", null, "달력 한 주의 합", CAL(8, 84, "일", "광복절", 15), week(8, 84, 2, 0), WEEKDAY],
  [19, 46, "연습 22", null, "읽은 쪽수의 합", READ.p46, pages(9, 144), PAGES],
  // ── 단원 20: 수 배열표와 달력 묶음 ──
  [20, 27, "확인 02", null, "수 배열표의 합", "다음 수 배열표에서 색칠된 9개의 수들의 합을 구하시오.", grid(8, 5, [11, 12, 13, 19, 20, 21, 27, 28, 29]), N()],
  [20, 28, "확인 03 ㉮", null, "수 배열표의 합", "다음 수 배열표에서 색칠된 부분 ㉮의 수의 합을 구하시오.", grid(15, 5, [18, 19, 20, 33, 34, 35, 48, 49, 50]), N()],
  [20, 28, "확인 03 ㉯", null, "수 배열표의 합", "다음 수 배열표에서 색칠된 부분 ㉯(십자 모양)의 수의 합을 구하시오.", grid(15, 5, [10, 24, 25, 26, 38, 39, 40, 41, 42, 54, 55, 56, 70]), N()],
  [20, 29, "확인 04 (1)", "B10-U1-calendar-block-01", "달력 묶음의 합", "다음 달력을 보고 물음에 답하시오. (1) 달력에서 색칠된 부분의 9개의 수들의 합을 구하시오.", calendarOn([8, 9, 10, 15, 16, 17, 22, 23, 24]), N()],
  [20, 29, "확인 04 (2)", null, "달력 묶음에서 수 찾기", "(2) 달력에서 색칠된 사각형에 있는 9개의 수의 합이 90이라면, 9개의 수 중에서 가장 작은 수는 얼마인지 구하시오.", calendarOn([8, 9, 10, 15, 16, 17, 22, 23, 24]), N()],
  [20, 29, "확인 04 (3)", null, "달력 묶음에서 수 찾기", "(3) 달력에서 색칠된 사각형에 있는 9개의 수의 합이 126이라면, 9개의 수 중에서 가장 큰 수는 얼마인지 구하시오.", calendarOn([8, 9, 10, 15, 16, 17, 22, 23, 24]), N()],
  [20, 30, "도전 2 (1)", null, "수 배열표의 합", "다음 수 배열표를 보고 물음에 답하시오. (1) 색칠된 부분에 있는 8개의 수의 합을 구하시오.", grid(10, 5, [14, 15, 16, 24, 26, 34, 35, 36]), N()],
  [20, 30, "도전 2 (2)", null, "수 배열표에서 수 찾기", "(2) 수 배열표에서 색칠된 8개의 수의 합이 120이라면, 8개의 수 중 가장 작은 수는 얼마인지 구하시오.", grid(10, 5, [14, 15, 16, 24, 26, 34, 35, 36]), N()],
  [20, 47, "연습 24", "B10-U1-colored-number-grid-03", "수 배열표의 합", "다음 수 배열표에서 색칠된 부분에 있는 13개의 수의 합을 구하시오.", grid(12, 5, [6, 17, 18, 19, 28, 29, 30, 31, 32, 41, 42, 43, 54]), N()],
  [20, 48, "연습 25 (1)", null, "달력 묶음의 합", "다음 달력을 보고 물음에 답하시오. (1) 색칠된 부분에 있는 9개의 수의 합을 구하시오.", calendarOn([7, 8, 9, 14, 15, 16, 21, 22, 23]), N()],
  [20, 48, "연습 25 (2)", null, "달력 묶음에서 수 찾기", "(2) 달력에서 색칠된 9개의 수의 합이 207이라면 9개의 수 중 가장 큰 수는 얼마인지 구하시오.", calendarOn([7, 8, 9, 14, 15, 16, 21, 22, 23]), N()],
  // ── 단원 21: 여러 가지 방법의 연속수의 합 ──
  ...[3, 4, 5, 9, 12].map((c) => [21, 31, `도전 3 · ${c}개`, null, "여러 가지 연속수의 합", `${WAYS42} (${c}개의 연속수)`, blanks(90, c), TERMS(c)]),
  ...[3, 4, 7, 9, 12].map((c) => [21, 32, `도전 4 · ${c}개`, null, "여러 가지 연속수의 합", `${WAYS126} (${c}개의 연속수)`, blanks(126, c), TERMS(c)]),
  ...[2, 3, 5, 6, 9].map((c, i) => [21, 49, `연습 26 (${i + 1})`, null, "여러 가지 연속수의 합", `${WAYS45} (${i + 1}) ${c}개`, blanks(45, c), TERMS(c)]),
  // ── 단원 22: 연속 홀수·짝수와 도전 문제 ──
  ...[[45, 5], [91, 7]].map(([t, c], i) => [22, 27, `확인 01 (${i + 1})`, null, "연속한 홀수의 합", ODD, blanks(t, c, "연속한 홀수"), TERMS(c)]),
  ...[[42, 3], [80, 5], [112, 7]].map(([t, c], i) => [22, 47, `연습 23 (${i + 1})`, null, "연속한 짝수의 합", EVEN, blanks(t, c, "연속한 짝수"), TERMS(c)]),
  [22, 30, "도전 1 (1)", null, "짝수 합과 홀수 합의 차", DIFF(1, "짝수"), v("number-sequence", { head: [1, 2, 3, 4], last: "?" }), N()],
  [22, 30, "도전 1 (2)", null, "짝수 합과 홀수 합의 차", DIFF(2, "홀수"), v("number-sequence", { head: [1, 2, 3, 4], last: "?" }), N()],
  [22, 33, "도전 5", "B10-U1-three-consecutive-digit-sum-02", "십의 자리 숫자의 합", "연속하는 3개의 두 자리 수가 있습니다. 이 세 수의 십의 자리 숫자의 합이 11일 때, 연속하는 세 수의 합을 구하시오.", op("□□ + □□ + □□ = □"), N()],
  ...[["31", "B10-U1-masked-consecutive-column-01"], ["07", null], ["40", null]].map(([tail, hold], i) => [22, 33, `도전 6 (${i + 1})`, hold, "가려진 세 수의 덧셈", MASKED(i + 1), v("masked-addition", { tail }), MASKPARTS])
];
const used = new Set(specs.map((s) => s[3]).filter(Boolean));
if (used.size !== 6 || heldU1.some((h) => !used.has(h.sourceNo))) throw new Error(`hold mapping ${used.size}`);

const build = (lessonNo) => specs.filter((s) => s[0] === lessonNo).map(([, page, loc, holdNo, type, prompt, visual, mode], k) => {
  const answerRef = `/books/book-10/lessons/${lessonNo}/original/items/${k}`;
  const item = { id: `book10-guide-p${page}-${lessonNo}-${k + 1}`, unit: 1, sourcePage: page, sourceNo: holdNo || `B10-U1-P${page}-${loc.replace(/[①-⑩]/g, (c) => String(CIRCLED.indexOf(c) + 1)).replace(/[^0-9A-Za-z가-힣㉮㉯]+/g, "-").replace(/^-|-$/g, "")}`,
    typeLabel: type, sourceLocator: `교사용 지도서 ${page}쪽 ${loc}`, printGroup: 800 + page, visual, prompt, answerRef };
  if (Array.isArray(mode)) item.parts = mode.map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else if (mode.text) Object.assign(item, { answerMode: "input", inputMode: "text" });
  else Object.assign(item, { answerMode: "input", inputMode: "numeric", ...(mode.unit ? { unit: mode.unit } : {}) });
  return item;
});
const items = Object.fromEntries([0, 1, 2, 17, 18, 19, 20, 21, 22].map((n) => [n, build(n)]));
const ids = new Set(Object.values(items).flat().map((it) => it.id));
if (ids.size !== Object.values(items).flat().length) throw new Error("duplicate item id");
const sourceNos = Object.values(items).flat().map((it) => it.sourceNo);
if (new Set(sourceNos).size !== sourceNos.length) throw new Error("duplicate sourceNo");
const originalOf = (lessonNo, structureKey, prompt) => ({ title: "골든벨", mode: "paged", sourceQuestionCount: items[lessonNo].length, structureKey, prompt, items: items[lessonNo] });

// ── 옛 단원 0·1·2: 원본 문항을 새로 쓰고, 개념 그림이 원본 답을 보여 주던 곳을 바꾼다 ──
l0.sourceLocator = "교사용 지도서 6~9쪽·34쪽 · 1단원 활동 01~03, 더클 연습문제 01~02";
l0.original = originalOf(0, l0.original.structureKey, "지도서 1단원 네이피어 곱셈과 타일그림 곱셈 문항을 푸시오.");
l0.experience.beats[1] = { ...l0.experience.beats[1], caption: "67×34의 각 자리 곱을 칸에 나누어 쓰고 대각선 방향으로 더합니다.", visual: v("napier-grid", { first: 67, second: 34, revealResult: true }) };
l0.experience.beats[2] = { ...l0.experience.beats[2], caption: "43×25의 두 부분곱을 자리에 맞추어 세로로 더합니다.", visual: v("vertical-multiplication", { first: 43, second: 25, revealResult: true }) };
l0.experience.beats[3] = { ...l0.experience.beats[3], visual: v("multiplication-methods", { first: 43, second: 25 }) };
l1.sourceLocator = "교사용 지도서 15~19쪽·39~41쪽 · 1단원 활동 02, 더클 확인문제 01~02, 더클 연습문제 07~12";
l1.original = originalOf(1, l1.original.structureKey, "지도서 1단원 짝수 개 연속수의 합 문항을 푸시오.");
l1.experience.beats[1] = { ...l1.experience.beats[1], caption: "2부터 9까지 양끝 수를 짝지으면 모든 짝의 합이 11입니다.", visual: v("consecutive-pairing", { from: 2, to: 9 }) };
l1.experience.beats[2] = { ...l1.experience.beats[2], caption: "합이 11인 짝이 4개이므로 11×4=44입니다.", visual: v("consecutive-pairing", { from: 2, to: 9, revealResult: true }) };
l2.sourceLocator = "교사용 지도서 21~25쪽·43~45쪽 · 1단원 활동 03, 더클 연습문제 15~20";
l2.original = originalOf(2, l2.original.structureKey, "지도서 1단원 홀수 개 연속수의 합 문항을 푸시오.");
l2.experience.beats[0] = { ...l2.experience.beats[0], caption: "5부터 9까지에서 양쪽 짝의 한가운데 수는 7입니다.", visual: v("consecutive-pairing", { from: 5, to: 9 }) };
l2.experience.beats[1] = { ...l2.experience.beats[1], caption: "가운데 수 7이 다섯 개 있다고 생각하면 7×5=35입니다.", visual: v("consecutive-pairing", { from: 5, to: 9, revealResult: true }) };
l2.experience.beats[2] = { ...l2.experience.beats[2], caption: "합이 60이고 다섯 쪽이면 60÷5=12가 가운데 쪽이라 10쪽부터 14쪽까지입니다.", visual: pages(5, 60) };
l2.experience.check = { ...l2.experience.check, prompt: "4부터 10까지 일곱 수의 합은 얼마일까요?", options: ["42", "49", "56"] };
// 판서 단원 9·10의 확인 문제가 지도서 문항(1부터 8까지, 4부터 8까지)과 같아 다른 수로 바꾼다.
const l9 = L("consecutive-even-source"), l10 = L("consecutive-odd-source");
l9.experience.check = { ...l9.experience.check, prompt: "1부터 22까지의 합은 얼마일까요?", options: ["231", "253", "276"] };
l9.experience.beats = [
  { ...l9.experience.beats[0], caption: "1부터 50까지 더할 때 양끝 수를 짝지어요.", visual: op("1 + 2 + 3 + … + 48 + 49 + 50") },
  { ...l9.experience.beats[1], caption: "1 + 50, 2 + 49, 3 + 48 … 짝의 합이 모두 51이에요.", visual: note(["1 + 50 = 51", "2 + 49 = 51", "3 + 48 = 51"]) },
  { ...l9.experience.beats[2], caption: "수가 50개라 짝은 25개예요. 51 × 25가 전체 합이에요.", visual: note(["51 × 25 = 1275"]) }
];
l10.experience.check = { ...l10.experience.check, prompt: "3 + 4 + 5 + 6 + 7의 합은 얼마일까요?", options: ["20", "25", "30"] };

// ── 새 단원 ──
const expOf = (sample, no, family, title, beats, hint, check) => ({ ...sample, family, title, beats, hint, check: { ...check, answerRef: `/books/book-10/lessons/${no}/experience/check` } });
const ext = (no, structureKey, story, prompt, visual, unit) => ({ title: "추가 학습", structureKey, story, prompt, visual, answerMode: "input", inputMode: "numeric", ...(unit ? { unit } : {}), extensionKind: "source-structured-authored", answerRef: `/books/book-10/lessons/${no}/extension` });
const unitName = l1.unit;
const lesson17 = {
  id: newIds[0], unit: unitName, title: "곱셈 규칙으로 간단히 계산해요", sourceLocator: "교사용 지도서 10~11쪽·35~36쪽 · 1단원 더클 확인문제 01~04, 더클 연습문제 03~04",
  sourceTypeIds: ["vertical-multiplication-b10"],
  representativeConcept: "십의 자리가 같고 일의 자리 합이 10이면 십의 자리 × (십의 자리 + 1)을 앞에, 일의 자리 곱을 뒤 두 자리에 쓰고, 일의 자리가 같고 십의 자리 합이 10이면 십의 자리끼리 곱에 일의 자리 수를 더해 앞에 씀",
  story: { title: "곱셈 지름길 찾기", text: "23×27처럼 십의 자리가 같고 일의 자리끼리 더해 10이 되는 곱셈에는 지름길이 있어요.", mission: "앞자리와 뒤 두 자리를 따로 구해 붙여 보세요." },
  explanation: { headline: "앞자리와 뒤 두 자리를 따로 구해 붙여요", steps: ["십의 자리가 같고 일의 자리 합이 10이면, 뒤 두 자리는 일의 자리끼리 곱한 값입니다(23×27이면 3×7=21).", "앞자리는 십의 자리 수 × (십의 자리 수 + 1)입니다(2×3=6). 그래서 23×27=621입니다.", "일의 자리가 같고 십의 자리 합이 10이면, 뒤 두 자리는 일의 자리끼리 곱한 값, 앞자리는 십의 자리끼리 곱한 값 + 일의 자리 수입니다(41×61이면 4×6+1=25, 1×1=01 → 2501).", "일의 자리 곱이 한 자리이면 앞에 0을 붙여 두 자리로 씁니다. 세로셈으로 한 번 계산해 확인합니다."] },
  experience: expOf(l0.experience, 17, "multiplication-rule-b10", "앞자리와 뒤 두 자리를 따로 구해요", [
    { id: "unit1-rule-step-1", action: "reveal", caption: "23×27은 십의 자리가 2로 같고, 일의 자리 3과 7을 더하면 10이에요.", visual: cells(23, 27) },
    { id: "unit1-rule-step-2", action: "highlight", caption: "뒤 두 자리는 3×7=21, 앞자리는 2×3=6이에요. 붙이면 621이에요.", visual: note(["3 × 7 = 21 → 뒤 두 자리", "2 × 3 = 6 → 앞자리", "23 × 27 = 621"]) },
    { id: "unit1-rule-step-3", action: "verify", caption: "41×61은 일의 자리가 1로 같고 십의 자리 합이 10이에요. 4×6+1=25, 1×1=01이라 2501이에요.", visual: note(["4 × 6 + 1 = 25 → 앞자리", "1 × 1 = 01 → 뒤 두 자리", "41 × 61 = 2501"]) }
  ], "일의 자리끼리 먼저 곱해 뒤 두 자리를 만들어 보세요.", { prompt: "62×68을 규칙으로 계산하면 얼마일까요?", options: ["3616", "4216", "4816"] }),
  original: originalOf(17, newIds[0], "지도서 1단원 곱셈 규칙 문항을 푸시오."),
  extension: ext(17, newIds[0], "새 곱셈을 규칙으로 계산합니다.", "83×87의 값을 규칙을 이용하여 구하시오.", cells(83, 87))
};
const lesson18 = {
  id: newIds[1], unit: unitName, title: "두 수의 곱과 약수", sourceLocator: "교사용 지도서 12~14쪽·37~38쪽 · 1단원 활동 01~02, 더클 연습문제 05~06",
  sourceTypeIds: ["factor-pairs-b10"],
  representativeConcept: "어떤 수를 두 자연수의 곱으로 빠짐없이 나타내면 곱에 쓰인 수가 모두 그 수의 약수이고, 같은 수끼리의 곱이 있으면 약수가 홀수 개가 됨",
  story: { title: "나누어떨어지게 하는 수", text: "28 = 4 × 7처럼 어떤 수를 두 수의 곱으로 나타내면, 곱한 두 수는 모두 28을 나누어떨어지게 해요.", mission: "1부터 차례로 곱의 짝을 찾고, 짝이 되풀이되기 시작하면 멈추세요." },
  explanation: { headline: "1부터 차례로 곱의 짝을 찾아요", steps: ["1 × (그 수)부터 시작해 2, 3, 4, …가 그 수를 나누어떨어지게 하는지 차례로 확인합니다.", "왼쪽 수가 오른쪽 수보다 커지려고 하면 이미 찾은 짝이 되풀이되므로 멈춥니다.", "곱에 쓰인 수를 모두 모으면 약수입니다. 짝 하나에 약수가 2개씩입니다.", "같은 수를 두 번 곱한 짝이 있으면 그 짝은 약수가 하나뿐이라, 약수의 개수가 홀수가 됩니다."] },
  experience: expOf(l1.experience, 18, "factor-pairs-b10", "곱의 짝으로 약수를 모아요", [
    { id: "unit1-factor-step-1", action: "reveal", caption: "28 = 1 × 28 = 2 × 14 = 4 × 7이에요. 곱에 쓰인 수가 28의 약수예요.", visual: factor(28, 3, [[1, 28], [2, 14], [4, 7]]) },
    { id: "unit1-factor-step-2", action: "highlight", caption: "20도 1부터 차례로 찾아요. 1 × 20, 2 × 10, 4 × 5예요. 3은 20을 나누어떨어지게 하지 못해요.", visual: factor(20, 3, [[1, 20], [2, 10], [4, 5]]) },
    { id: "unit1-factor-step-3", action: "verify", caption: "짝이 3개라 20의 약수는 1, 2, 4, 5, 10, 20으로 6개예요.", visual: note(["짝 3개 × 2 = 약수 6개", "1, 2, 4, 5, 10, 20"]) }
  ], "1, 2, 3, …으로 나누어떨어지는지 차례로 확인해 보세요.", { prompt: "49의 약수는 몇 개일까요?", options: ["2개", "3개", "4개"] }),
  original: originalOf(18, newIds[1], "지도서 1단원 두 수의 곱과 약수 문항을 푸시오."),
  extension: ext(18, newIds[1], "새 수를 두 수의 곱으로 나타냅니다.", "40을 두 수의 곱으로 나타내고, 40을 나누어떨어지게 하는 수(약수)의 개수를 구하시오.", factor(40, 4), "개")
};
const lesson19 = {
  id: newIds[2], unit: unitName, title: "달력과 쪽수로 연속수 찾기", sourceLocator: "교사용 지도서 20쪽·26쪽·42쪽·46쪽 · 1단원 더클 확인문제 03~04, 활동 07~08, 더클 연습문제 13~14·21~22",
  sourceTypeIds: ["consecutive-page-range-b10"],
  representativeConcept: "한 주의 날짜나 하루에 읽은 쪽수처럼 연속한 수의 합을 개수로 나누어 가운데 수를 찾고, 거기서 양쪽으로 펼쳐 날짜와 쪽수를 찾음",
  story: { title: "날짜와 쪽수 탐정", text: "달력의 한 주 날짜나 하루에 읽은 쪽수는 연속수예요. 합을 알면 가운데 수를 찾을 수 있어요.", mission: "합을 개수로 나누어 가운데를 찾고, 양쪽으로 펼쳐 보세요." },
  explanation: { headline: "합 ÷ 개수로 가운데부터 찾아요", steps: ["일요일부터 토요일까지 7일이면 합 ÷ 7이 수요일 날짜입니다.", "월요일부터 토요일까지 6일이면 합 ÷ 3이 가운데 두 날(수요일과 목요일)의 합입니다.", "찾은 날짜에서 7일씩 더하거나 빼면 같은 요일입니다.", "쪽수도 같습니다. 홀수 쪽이면 합 ÷ 쪽수가 가운데 쪽, 짝수 쪽이면 합 ÷ (쪽수 ÷ 2)가 가운데 두 쪽의 합입니다."] },
  experience: expOf(l2.experience, 19, "calendar-page-b10", "가운데 날짜에서 펼쳐요", [
    { id: "unit1-calendar-step-1", action: "reveal", caption: "어느 주 일요일부터 토요일까지 날짜의 합이 70이에요. 7일이니 70 ÷ 7 = 10, 수요일이 10일이에요.", visual: week(6, 70, 1, 0) },
    { id: "unit1-calendar-step-2", action: "highlight", caption: "수요일이 10일이면 17일, 24일도 수요일이에요. 7일씩 더하면 같은 요일이에요.", visual: note(["70 ÷ 7 = 10 → 수요일", "10 + 7 = 17 → 수요일"]) },
    { id: "unit1-calendar-step-3", action: "verify", caption: "5쪽을 읽은 쪽수의 합이 55이면 55 ÷ 5 = 11이 가운데 쪽이라 9쪽부터 13쪽까지예요.", visual: pages(5, 55) }
  ], "합을 날짜 수나 쪽수로 나누어 가운데를 찾아 보세요.", { prompt: "어느 주 일요일부터 토요일까지 날짜의 합이 133이면 그 주 수요일은 며칠일까요?", options: ["18일", "19일", "20일"] }),
  original: originalOf(19, newIds[2], "지도서 1단원 달력과 쪽수 문항을 푸시오."),
  extension: ext(19, newIds[2], "하루에 읽은 쪽수의 합을 봅니다.", "현우는 동화책을 매일 7쪽씩 읽기로 하였습니다. 오늘 읽은 쪽수의 합이 175일 때, 오늘 읽은 첫 쪽은 몇 쪽인지 구하시오.", pages(7, 175), "쪽")
};
const lesson20 = {
  id: newIds[3], unit: unitName, title: "수 배열표와 달력 묶음의 합", sourceLocator: "교사용 지도서 27~30쪽·47~48쪽 · 1단원 더클 확인문제 02~04, 더클 도전문제 2, 더클 연습문제 24~25",
  sourceTypeIds: ["odd-consecutive-sum-b10"],
  representativeConcept: "수 배열표와 달력에서 가운데 수를 둘러싸고 칠한 수들은 마주 보는 두 수의 합이 가운데 수의 2배라, 합은 가운데 수 × 개수이고 거꾸로 합 ÷ 개수로 가운데 수를 찾음",
  story: { title: "가운데 수가 대표예요", text: "수 배열표에서 가운데 수를 둘러싼 수들은 마주 보는 둘씩 더하면 모두 가운데 수의 2배가 돼요.", mission: "가운데 수를 찾고 칠한 칸의 개수를 곱해 보세요." },
  explanation: { headline: "가운데 수 × 칠한 칸의 개수", steps: ["수 배열표에서 위아래 수는 한 줄의 칸 수만큼, 왼쪽·오른쪽 수는 1만큼 차이 납니다(달력은 위아래가 7 차이).", "가운데 수를 사이에 두고 마주 보는 두 수의 합은 가운데 수의 2배입니다.", "그래서 칠한 칸의 합은 가운데 수 × 칠한 칸의 개수입니다. 가운데 칸을 칠하지 않았으면 그 칸은 세지 않습니다.", "합을 알면 합 ÷ 개수로 가운데 수를 찾고, 거기서 가장 작은 수와 가장 큰 수를 찾습니다."] },
  experience: expOf(l2.experience, 20, "number-grid-sum-b10", "마주 보는 두 수를 짝지어요", [
    { id: "unit1-grid-step-1", action: "reveal", caption: "5칸씩 놓은 수 배열표에서 13을 둘러싼 9칸을 칠했어요.", visual: grid(5, 5, [7, 8, 9, 12, 13, 14, 17, 18, 19]) },
    { id: "unit1-grid-step-2", action: "highlight", caption: "13을 사이에 두고 마주 보는 두 수는 7 + 19, 8 + 18, 9 + 17, 12 + 14로 모두 26이에요.", visual: note(["7 + 19 = 26", "8 + 18 = 26", "9 + 17 = 26", "12 + 14 = 26"]) },
    { id: "unit1-grid-step-3", action: "verify", caption: "9칸이 모두 13인 것과 같아요. 합은 13 × 9 = 117이에요.", visual: note(["13 × 9 = 117"]) }
  ], "가운데 수를 먼저 찾아 보세요.", { prompt: "달력에서 3×3 묶음 9칸의 합이 108이면 가운데 수는 얼마일까요?", options: ["11", "12", "13"] }),
  original: originalOf(20, newIds[3], "지도서 1단원 수 배열표와 달력 묶음 문항을 푸시오."),
  extension: ext(20, newIds[3], "달력에서 3×3 묶음을 봅니다.", "달력에서 3×3 사각형에 있는 9개의 수의 합이 171이라면, 9개의 수 중에서 가장 작은 수는 얼마인지 구하시오.", note(["3 × 3 사각형 9칸", "9개의 수의 합 171"]))
};
const lesson21 = {
  id: newIds[4], unit: unitName, title: "여러 가지 방법의 연속수의 합", sourceLocator: "교사용 지도서 31~32쪽·49쪽 · 1단원 더클 도전문제 3~4, 더클 연습문제 26",
  sourceTypeIds: ["odd-consecutive-sum-b10", "even-consecutive-sum-b10"],
  representativeConcept: "같은 수를 여러 개수의 연속수의 합으로 나타낼 때, 홀수 개면 합 ÷ 개수가 가운데 수, 짝수 개면 합 ÷ (개수 ÷ 2)가 가운데 두 수의 합이 되는지 보고 양쪽으로 펼침",
  story: { title: "한 수, 여러 가지 연속수", text: "42 = 13 + 14 + 15 = 9 + 10 + 11 + 12처럼 한 수를 여러 가지 연속수로 나눌 수 있어요.", mission: "개수를 정하고 가운데 수부터 찾아 양쪽으로 펼쳐 보세요." },
  explanation: { headline: "개수마다 가운데부터 찾아요", steps: ["3개, 5개, 7개처럼 홀수 개이면 합 ÷ 개수가 가운데 수입니다. 나누어떨어져야 합니다.", "4개, 6개처럼 짝수 개이면 합 ÷ (개수 ÷ 2)가 가운데 두 수의 합입니다. 그 합이 홀수여야 두 연속수로 나뉩니다.", "가운데에서 양쪽으로 1씩 작아지고 커지게 펼칩니다.", "펼친 수가 모두 1 이상인지 확인합니다."] },
  experience: expOf(l2.experience, 21, "consecutive-ways-b10", "개수를 바꾸어 나누어 봐요", [
    { id: "unit1-ways-step-1", action: "reveal", caption: "27을 3개의 연속수로 나누면 27 ÷ 3 = 9가 가운데라 8 + 9 + 10이에요.", visual: note(["27 ÷ 3 = 9", "27 = 8 + 9 + 10"]) },
    { id: "unit1-ways-step-2", action: "highlight", caption: "6개의 연속수로 나누면 27 ÷ 3 = 9가 가운데 두 수의 합이라 4와 5예요. 2 + 3 + 4 + 5 + 6 + 7이에요.", visual: note(["27 ÷ 3 = 9 = 4 + 5", "27 = 2 + 3 + 4 + 5 + 6 + 7"]) },
    { id: "unit1-ways-step-3", action: "verify", caption: "2개면 27 ÷ 1 = 27이 두 수의 합이라 13 + 14예요. 4개는 27 ÷ 2가 나누어떨어지지 않아 안 돼요.", visual: note(["27 = 13 + 14", "4개는 안 됨"]) }
  ], "홀수 개인지 짝수 개인지부터 보세요.", { prompt: "33을 3개의 연속수의 합으로 나타낼 때 가운데 수는 얼마일까요?", options: ["10", "11", "12"] }),
  original: originalOf(21, newIds[4], "지도서 1단원 여러 가지 연속수의 합 문항을 푸시오."),
  extension: ext(21, newIds[4], "새 수를 연속수로 나눕니다.", "66을 3개의 연속수의 합으로 나타낼 때 가장 작은 수를 구하시오.", blanks(66, 3))
};
const lesson22 = {
  id: newIds[5], unit: unitName, title: "연속 홀수·짝수와 도전 문제", sourceLocator: "교사용 지도서 27쪽·30쪽·33쪽·47쪽 · 1단원 더클 확인문제 01, 더클 도전문제 1·5·6, 더클 연습문제 23",
  sourceTypeIds: ["odd-consecutive-sum-b10"],
  representativeConcept: "연속한 홀수·짝수도 2씩 커지는 연속수라 합 ÷ 개수로 가운데 수를 찾고, 홀수 합과 짝수 합의 차와 가려진 덧셈은 연속수의 합 규칙으로 거꾸로 추론함",
  story: { title: "2씩 뛰는 연속수", text: "5, 7, 9처럼 2씩 커지는 수에도 가운데 수가 있어요. 21 = 5 + 7 + 9에서 가운데 7의 3배가 21이에요.", mission: "합 ÷ 개수로 가운데를 찾고 2씩 펼쳐 보세요." },
  explanation: { headline: "2씩 뛰어도 가운데 수는 그대로 대표예요", steps: ["연속한 홀수나 짝수도 가운데 수를 중심으로 같은 간격(2)으로 놓입니다.", "홀수 개이면 합 ÷ 개수가 가운데 수이고, 거기서 2씩 빼고 더해 펼칩니다.", "1부터 차례로 쓸 때 짝수와 바로 앞 홀수를 짝지으면(2 - 1, 4 - 3, …) 짝마다 차가 1씩 생깁니다.", "연속하는 세 수의 합은 가운데 수의 3배라서 3으로 나누어떨어집니다."] },
  experience: expOf(l2.experience, 22, "odd-even-consecutive-b10", "2씩 펼쳐요", [
    { id: "unit1-step2-step-1", action: "reveal", caption: "27을 연속한 홀수 3개로 나누면 27 ÷ 3 = 9가 가운데라 7 + 9 + 11이에요.", visual: note(["27 ÷ 3 = 9", "27 = 7 + 9 + 11"]) },
    { id: "unit1-step2-step-2", action: "highlight", caption: "54를 연속한 짝수 3개로 나누면 54 ÷ 3 = 18이라 16 + 18 + 20이에요.", visual: note(["54 ÷ 3 = 18", "54 = 16 + 18 + 20"]) },
    { id: "unit1-step2-step-3", action: "verify", caption: "연속하는 세 수의 합은 3으로 나누어떨어져요. 합이 □05이면 105, 205, … 중에서 3으로 나누어떨어지는 105를 골라 34 + 35 + 36을 찾아요.", visual: note(["105 ÷ 3 = 35", "34 + 35 + 36 = 105"]) }
  ], "합을 개수로 나누어 가운데 수부터 찾아 보세요.", { prompt: "15를 연속한 홀수 3개의 합으로 나타낼 때 가운데 수는 얼마일까요?", options: ["3", "5", "7"] }),
  original: originalOf(22, newIds[5], "지도서 1단원 연속 홀수·짝수와 도전 문제를 푸시오."),
  extension: ext(22, newIds[5], "연속한 홀수의 합을 봅니다.", "63을 연속한 홀수 3개의 합으로 나타낼 때 가장 큰 수를 구하시오.", blanks(63, 3, "연속한 홀수"))
};
const added = [lesson17, lesson18, lesson19, lesson20, lesson21, lesson22];
for (const l of added) delete l.experience.model;
b10.lessons.splice(b10.lessons.indexOf(l0) + 1, 0, lesson17);
b10.lessons.splice(b10.lessons.indexOf(l1), 0, lesson18);
b10.lessons.splice(b10.lessons.indexOf(l10) + 1, 0, lesson19, lesson20, lesson21, lesson22);

// ── 장부: 1단원을 원본 문항 수대로 다시 센다 ──
b10.sourceHold = b10.sourceHold.filter((h) => !/^B10-U1-/.test(h.sourceNo));
const cov = b10.sourceCoverage;
const u1 = cov.byUnit.find((u) => u.unit === 1);
const unitItems = [0, 17, 18, 1, 2, 19, 20, 21, 22];
const labels = { 0: "네이피어·타일그림 곱셈(7~9·34쪽)", 17: "곱셈 규칙(10~11·35~36쪽)", 18: "두 수의 곱과 약수(13~14·37~38쪽)", 1: "짝수 개 연속수의 합(15~19·39~41쪽)", 2: "홀수 개 연속수의 합(21~25·43~45쪽)", 19: "달력과 쪽수(20·26·42·46쪽)", 20: "수 배열표와 달력 묶음(27~30·47~48쪽)", 21: "여러 가지 연속수의 합(31~32·49쪽)", 22: "연속 홀수·짝수와 도전 문제(27·30·33·47쪽)" };
cov.catalog = [...unitItems.map((n) => ({ unit: 1, unitTitle: u1.title, id: `guide-u1-lesson-${n}`, label: labels[n], total: items[n].length, minimumArithmetic: false, public: items[n].length, hold: 0 })), ...cov.catalog.filter((c) => c.unit !== 1)];
u1.total = unitItems.reduce((s, n) => s + items[n].length, 0); u1.public = u1.total; u1.hold = 0;
cov.total = cov.byUnit.reduce((n, u) => n + u.total, 0);
cov.public = cov.byUnit.reduce((n, u) => n + u.public, 0);
cov.hold = cov.byUnit.reduce((n, u) => n + u.hold, 0);
if (cov.hold !== b10.sourceHold.length) throw new Error(`hold count ${cov.hold} vs ${b10.sourceHold.length}`);
b10.source.note = `교사용 지도서의 활동 슬롯을 장부화했습니다. 1단원(6~49쪽)·2단원(52~66쪽)·3단원(78~104쪽, 쪽 그림을 읽지 못한 97쪽 제외)·4단원(108~132쪽)은 원본 대조를 마쳐 보류가 없습니다. 전체 ${cov.total}개 중 공개 ${cov.public}개, 보류 ${cov.hold}개.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book10 batch5 patched", Object.fromEntries(Object.entries(items).map(([n, list]) => [n, list.length])), { holds: b10.sourceHold.length, total: cov.total, public: cov.public });
