import { GENERATORS } from "./generators.js";
import { book07Markup } from "./book07-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const book = CURRICULUM.find((item) => item.id === "book-07");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const unitTestQuestions = book?.source?.unitTestQuestions || [];
const expectedUnitTestTypes = [
  "calendar-month-shift-weekday-b7", "calendar-cross-month-weekday-b7", "elapsed-time-analog-b7", "find-end-time-b7",
  "consecutive-full-month-reverse-b7", "arithmetic-sequence-nth-b7", "arithmetic-sequence-position-b7", "shared-polygon-matchsticks-b7",
  "two-score-value-assumption-b7", "correct-wrong-score-assumption-b7", "climb-slip-days-b7", "doubling-half-full-day-b7",
  "polygon-border-side-count-inverse-b7", "polygon-stakes-from-side-b7", "between-objects-subdivision-count-b7", "linked-sequence-correspondence-b7",
  "venn-overlap-with-neither-b7", "reversed-difference-largest-unit-test-book7", "clock-palindrome-unpadded-unit-test-book7",
  "three-digit-palindrome-digit-sum-b7", "mirror-clock-elapsed-b7", "shared-consumption-assumption-b7",
  "polygon-border-shape-conversion-b7", "four-group-three-clues-unit-test-book7", "reversed-digit-pair-range-b7"
];
const auditedTypeIds = [...new Set([...typeIds, ...unitTestQuestions.map((question) => question.typeId)])];
const expectedUnitCounts = [38, 52, 43, 47];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;
const same = (first, second) => JSON.stringify(first) === JSON.stringify(second);
const numericAnswer = (problem) => Number(String(problem.answer).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0]);
const fail = (id, difficulty, message) => { throw new Error(`${id} / L${difficulty}: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };
const isPalindrome = (value) => String(value) === [...String(value)].reverse().join("");
const pad2 = (value) => String(value).padStart(2, "0");

function dateSerial(month, date, leap = false) {
  const days = [...MONTH_DAYS];
  if (leap) days[1] = 29;
  return sum(days.slice(0, month - 1)) + date;
}

function clockText(totalMinutes) {
  const normalized = mod(totalMinutes, 720);
  const hour = normalized === 0 ? 12 : Math.floor(normalized / 60) || 12;
  return `${hour}시 ${normalized % 60}분`;
}

function allCalendarPalindromes(startMonth, endMonth) {
  const valid = [];
  for (let month = startMonth; month <= endMonth; month += 1) {
    for (let date = 1; date <= MONTH_DAYS[month - 1]; date += 1) {
      if (isPalindrome(`${pad2(month)}${pad2(date)}`)) valid.push(`${month}월 ${date}일`);
    }
  }
  return valid;
}

function allClockPalindromes(startHour, endHour) {
  const valid = [];
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += 1) {
      const text = `${pad2(hour)}${pad2(minute)}`;
      if (isPalindrome(text)) valid.push({ hour, minute, text });
    }
  }
  return valid;
}

function reverseDifferenceValues(difference) {
  const gap = difference / 9;
  const values = [];
  for (let ones = 1; ones + gap <= 9; ones += 1) values.push((ones + gap) * 10 + ones);
  return values;
}

function kaprekarStep(value) {
  const digits = String(value).padStart(3, "0").split("").sort();
  const small = Number(digits.join(""));
  const large = Number([...digits].reverse().join(""));
  return { value: large - small, large, small };
}

function validateSurface(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  const markup = book07Markup(problem.visual);
  assert(problem.prompt?.trim(), id, difficulty, "지문 없음");
  assert(String(problem.answer ?? "").trim(), id, difficulty, "정답 없음");
  assert(problem.solution?.trim(), id, difficulty, "풀이 없음");
  assert(problem.meta?.family, id, difficulty, "검산 유형 없음");
  assert(problem.visual?.kind === "book7", id, difficulty, "7권 전용 그림 아님");
  assert(markup, id, difficulty, "빈 그림");
  assert(!/undefined|NaN|null|\[object Object\]/.test(`${text} ${markup}`), id, difficulty, "잘못된 출력 토큰");
  assert(!/퍼뮤테이션|컴비네이션|팩토리얼|제곱|\^/.test(text), id, difficulty, "아동 지문 금지 표현");
  assert((problem.prompt.match(/\?/g) || []).length <= 1, id, difficulty, "한 카드에 질문이 두 개 이상");
}

// ── 교재 번호 꼴 새 유형(book07-structure-generators.js) — 생성기 풀이기와 따로 다시 센다 ──
const STRUCTURE_FAMILIES = new Set([
  "calendar-date-chain-b7", "calendar-remaining-days-b7", "elapsed-time-am-pm-b7", "time-column-sheet-b7",
  "find-end-time-draw-b7", "find-start-time-draw-b7", "time-unit-mixed-sheet-b7", "division-long-cryptarithm-b7",
  "sequence-strip-shaded-b7", "sequence-blank-start-nth-b7", "sequence-index-table-b7", "correct-wrong-zero-base-b7",
  "rect-perimeter-tree-count-b7", "loop-tree-flower-count-b7", "loop-spacing-from-count-b7", "exchange-only-count-b7",
  "doubling-before-full-b7", "doubling-frog-weed-steps-b7", "loop-lamp-bench-people-b7", "loop-total-trees-perimeter-b7",
  "palindrome-range-digit-sum-b7", "month-date-palindrome-b7", "date-palindrome-count-range-b7", "four-point-overlap-b7",
  "six-point-overlap-b7", "reversed-diff-both-ways-b7", "reversed-digit-grows-b7", "reversed-diff-smallest-b7",
  "venn-total-neither-one-b7", "branch-tree-two-level-b7", "branch-tree-three-level-b7", "disjoint-groups-rest-b7",
  "reverse-add-chain-b7", "kaprekar-fill-b7", "palindrome-card-adjacent-b7", "stone-triangle-flip-b7"
]);
const clock12 = (t) => { const x = mod(t, 720); return `${Math.floor(x / 60) || 12}시 ${x % 60}분`; };
const dur = (t) => `${Math.floor(t / 60)}시간 ${t % 60}분`;
const reverseOf = (n) => Number(String(n).split("").reverse().join(""));

// 나눗셈 세로식: 칸마다 숫자를 다시 만든다(생성기 함수를 쓰지 않음)
function longDivisionLayout(d, q) {
  const N = d * q;
  const head = Math.floor(N / 10);
  const q1 = Math.floor(q / 10);
  const q2 = q % 10;
  if (q1 < 1) return null;
  const firstProduct = d * q1;
  const rest = head - firstProduct;
  if (rest <= 0 || rest > 9) return null;
  const second = rest * 10 + (N % 10);
  if (second !== d * q2) return null;
  const cells = { d, q1, q2, r1: rest, u: N % 10 };
  String(N).split("").forEach((x, i) => { cells[`n${i}`] = Number(x); });
  const fp = String(firstProduct);
  fp.split("").forEach((x, i) => { cells[`p${fp.length - i}`] = Number(x); });
  String(second).padStart(2, "0").split("").forEach((x, i) => { cells[`s${i}`] = Number(x); });
  return { shape: `${String(N).length}-${fp.length}`, cells };
}

function stoneFlipBrute(n) {
  const up = [];
  for (let r = 0; r < n; r += 1) for (let c = 0; c <= r; c += 1) up.push(`${2 * c - r},${r}`);
  const upSet = new Set(up);
  let best = 0;
  for (let dx = -3 * n; dx <= 3 * n; dx += 1) for (let dy = -n; dy <= n; dy += 1) {
    if (mod(dx + dy - (n - 1), 2) !== 0) continue;
    let c = 0;
    for (let r = 0; r < n; r += 1) for (let k = 0; k < n - r; k += 1) if (upSet.has(`${2 * k - (n - 1 - r) + dx},${r + dy}`)) c += 1;
    best = Math.max(best, c);
  }
  return up.length - best;
}

// 유리수 소거로 목표 구간이 주어진 구간들의 합·차로 정해지는지(정해지면 값 하나)
function spanDetermined(given, target, values) {
  const vec = ([i, j]) => Array.from({ length: 5 }, (_, k) => (k >= i && k < j ? 1 : 0));
  const rows = given.map((g, k) => [...vec(g), values[k]]);
  const t = vec(target);
  // 목표 = Σ c_k g_k 를 풀기: 행렬 [g_1 … g_m | t] 의 열 공간
  const m = rows.length;
  const A = Array.from({ length: 5 }, (_, r) => [...rows.map((row) => row[r]), t[r]]);
  let rank = 0;
  const pivots = [];
  for (let col = 0; col < m && rank < 5; col += 1) {
    let p = -1;
    for (let r = rank; r < 5; r += 1) if (Math.abs(A[r][col]) > 1e-9) { p = r; break; }
    if (p < 0) continue;
    [A[rank], A[p]] = [A[p], A[rank]];
    const pv = A[rank][col];
    for (let c = 0; c <= m; c += 1) A[rank][c] /= pv;
    for (let r = 0; r < 5; r += 1) if (r !== rank && Math.abs(A[r][col]) > 1e-9) { const f = A[r][col]; for (let c = 0; c <= m; c += 1) A[r][c] -= f * A[rank][c]; }
    pivots.push(col);
    rank += 1;
  }
  for (let r = rank; r < 5; r += 1) if (Math.abs(A[r][m]) > 1e-9) return null;
  const coef = Array(m).fill(0);
  pivots.forEach((col, r) => { coef[col] = A[r][m]; });
  return coef.reduce((s, c, k) => s + c * values[k], 0);
}

function validateStructure(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  const html = `${problem.visual?.html || ""} ${problem.answerVisual?.html || ""}`;
  assert(problem.prompt?.trim() && String(problem.answer ?? "").trim() && problem.solution?.trim(), id, difficulty, "지문·정답·풀이 없음");
  assert(problem.visual?.kind === "fig" && problem.visual.html?.includes("<svg"), id, difficulty, "그림 없음");
  assert(!/undefined|NaN|null|\[object Object\]/.test(`${text} ${html}`), id, difficulty, "잘못된 출력 토큰");
  assert(!/\d\s*\/\s*\d/.test(text), id, difficulty, "빗금 분수");
  assert(!/FC|필즈|클래식|본책/.test(text), id, difficulty, "금지 말");
  assert((problem.prompt.match(/\?/g) || []).length <= 1, id, difficulty, "한 카드에 질문이 두 개 이상");
  const meta = problem.meta;
  const numeric = numericAnswer(problem);
  switch (meta.family) {
    case "calendar-date-chain-b7": {
      const { dates, weekday, gaps, weekdays } = meta;
      assert(dates.length >= 2 && dates.length <= 6, id, difficulty, "징검다리 칸 수");
      dates.slice(1).forEach(([m, d], i) => {
        const [pm, pd] = dates[i];
        const last = i === dates.length - 2;
        assert(last ? m >= pm : (m === pm + 1 && d === pd), id, difficulty, "징검다리는 같은 날짜로 한 달씩");
        assert(gaps[i] === dateSerial(m, d) - dateSerial(pm, pd) && gaps[i] > 0, id, difficulty, "건너뛴 날 수 오류");
      });
      let w = weekday;
      gaps.forEach((g, i) => { w = mod(w + g, 7); assert(w === weekdays[i + 1], id, difficulty, "요일 옮기기 오류"); });
      assert(String(problem.answer).startsWith(`${WEEKDAYS[w]}요일`), id, difficulty, "징검다리 요일 답 오류");
      return;
    }
    case "calendar-remaining-days-b7":
      meta.items.forEach((it) => {
        const g = dateSerial(it.to[0], it.to[1]) - dateSerial(it.from[0], it.from[1]);
        assert(it.to[0] === it.from[0] + 1 && g === MONTH_DAYS[it.from[0] - 1] - it.from[1] + it.to[1] && g === it.gap, id, difficulty, "남은 날 + 날짜 오류");
        assert(mod(it.weekday + g, 7) === it.target && text.includes(`${WEEKDAYS[it.target]}요일`), id, difficulty, "남은 날 요일 오류");
      });
      return;
    case "elapsed-time-am-pm-b7":
      assert(meta.start < 720 && meta.end >= 720 && meta.end - meta.start === meta.dur, id, difficulty, "오전 오후 시각 오류");
      assert(problem.answer === `${dur(meta.dur)} = ${meta.dur}분`, id, difficulty, "오전 오후 걸린 시간 답 오류");
      return;
    case "time-column-sheet-b7":
      assert(meta.items.length === 6, id, difficulty, "세로셈 칸 수");
      meta.items.forEach((it, i) => {
        const r = it.kind === "add" ? it.a + it.b : it.a - it.b;
        assert(r === it.r && r > 0, id, difficulty, "시간 세로셈 계산 오류");
        if (it.kind === "add") assert((it.a % 60) + (it.b % 60) >= 60, id, difficulty, "받아올림 없는 덧셈");
        else assert((it.a % 60) < (it.b % 60), id, difficulty, "받아내림 없는 뺄셈");
        const want = it.kind === "ampm" ? dur(r) : `${Math.floor(r / 60)}시 ${r % 60}분`;
        assert(problem.answer.split(" / ")[i] === `(${i + 1}) ${want}`, id, difficulty, "세로셈 답 오류");
      });
      return;
    case "find-end-time-draw-b7":
    case "find-start-time-draw-b7":
      assert(meta.start + meta.dur === meta.end, id, difficulty, "시계 그리기 시각 오류");
      assert(problem.answer === clock12(meta.family === "find-end-time-draw-b7" ? meta.end : meta.start), id, difficulty, "시계 그리기 답 오류");
      assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "그리기 답 그림 없음");
      return;
    case "time-unit-mixed-sheet-b7":
      meta.items.forEach((it) => {
        const parts = [...it.left.matchAll(/(\d+)(일|시간|분|초)/g)].map((m) => ({ n: Number(m[1]), u: m[2] }));
        const toSec = { 일: 86400, 시간: 3600, 분: 60, 초: 1 };
        const total = parts.reduce((s, p) => s + p.n * toSec[p.u], 0);
        assert(total / toSec[it.unit] === it.value, id, difficulty, `단위 바꾸기 오류 ${it.left}`);
      });
      return;
    case "division-long-cryptarithm-b7":
      meta.items.forEach((it) => {
        const own = longDivisionLayout(it.d, it.q);
        assert(own && own.shape === it.shape, id, difficulty, "나눗셈 꼴 오류");
        Object.entries(it.shown).forEach(([k, v]) => assert(own.cells[k] === v, id, difficulty, "보이는 숫자가 답과 다름"));
        let count = 0;
        for (let d = 2; d <= 9; d += 1) for (let q = 10; q <= 99; q += 1) {
          const one = longDivisionLayout(d, q);
          if (one && one.shape === it.shape && Object.entries(it.shown).every(([k, v]) => one.cells[k] === v)) count += 1;
        }
        assert(count === 1, id, difficulty, `나눗셈 복면산 답 ${count}개`);
        assert(Object.keys(own.cells).length - Object.keys(it.shown).length >= 6, id, difficulty, "빈칸이 너무 적음");
        assert(!it.hideDivisor || !("d" in it.shown), id, difficulty, "나누는 수 빈칸 꼴 오류");
        assert(text.includes(`${it.N} ÷ ${it.d} = ${it.q}`), id, difficulty, "나눗셈 답 오류");
      });
      return;
    case "sequence-strip-shaded-b7":
      meta.items.forEach((it, i) => {
        assert(it.vals.every((v, k) => v === it.vals[0] + it.step * k), id, difficulty, "수 띠 규칙 오류");
        assert(it.cells.filter((v) => v !== null).length === 2 && it.cells[it.shade] === null, id, difficulty, "수 띠 보이는 칸 오류");
        const step = (it.vals[it.known] - it.cells[0]) / it.known;
        assert(problem.answer.split(" / ")[i] === `(${i + 1}) ${it.cells[0] + step * it.shade}`, id, difficulty, "수 띠 답 오류");
      });
      return;
    case "sequence-blank-start-nth-b7": {
      const step = (meta.b - meta.a) / 3;
      assert(Number.isInteger(step) && numeric === meta.a - step + step * (meta.position - 1), id, difficulty, "첫 수 빈칸 수열 오류");
      return;
    }
    case "sequence-index-table-b7":
      assert(numeric === meta.first + meta.step * (meta.target - 1), id, difficulty, "순서표 답 오류");
      return;
    case "correct-wrong-zero-base-b7": {
      const sols = [];
      for (let c = 0; c <= meta.total; c += 1) if (c * meta.gain - (meta.total - c) * meta.penalty === meta.score) sols.push(c);
      assert(sols.length === 1 && sols[0] === numeric, id, difficulty, "기본 점수 0 우기기 오류");
      return;
    }
    case "rect-perimeter-tree-count-b7":
      assert(meta.wm % meta.s === 0 && meta.hm % meta.s === 0 && numeric === (2 * (meta.wm + meta.hm)) / meta.s, id, difficulty, "직사각형 둘레 나무 오류");
      return;
    case "loop-tree-flower-count-b7": {
      const per = Math.round(meta.a * 100) / Math.round(meta.b * 100) - 1;
      assert(Number.isInteger(meta.P / meta.a) && Number.isInteger(per) && per >= 1, id, difficulty, "나무 사이 꽃 나누어떨어짐 오류");
      assert(numeric === (meta.P / meta.a) * per, id, difficulty, "나무 사이 꽃 수 오류");
      return;
    }
    case "loop-spacing-from-count-b7":
      assert(numeric * meta.count === meta.P, id, difficulty, "간격 오류");
      return;
    case "exchange-only-count-b7": {
      let empty = meta.initial;
      let got = 0;
      while (empty >= meta.rate) { const r = Math.floor(empty / meta.rate); got += r; empty = r + (empty % meta.rate); }
      assert(got === numeric, id, difficulty, "바꾼 병 수 오류");
      return;
    }
    case "doubling-before-full-b7":
      assert(meta.full - meta.day === meta.back && problem.answer === `병의 ${2 ** meta.back}분의 1`, id, difficulty, "며칠 전 몫 오류");
      return;
    case "doubling-frog-weed-steps-b7":
      assert(problem.answer.includes(`(4) ${2 ** meta.k}개`) && problem.answer.includes("(2) 2개"), id, difficulty, "개구리풀 답 오류");
      return;
    case "loop-lamp-bench-people-b7":
      assert(meta.P / meta.s === meta.lamps && problem.answer === `가로등 ${meta.lamps}개, ${meta.lamps * meta.benches * meta.seats}명`, id, difficulty, "가로등 의자 오류");
      return;
    case "loop-total-trees-perimeter-b7":
      assert(numeric === (meta.trees / meta.k) * (meta.k + 1) * meta.d, id, difficulty, "나무 수로 둘레 오류");
      return;
    case "palindrome-range-digit-sum-b7": {
      const list = [];
      for (let n = meta.lo + 1; n < meta.hi; n += 1) if (n >= 100 && n <= 999 && isPalindrome(n) && sum(String(n).split("").map(Number)) === meta.S) list.push(n);
      assert(list.length && problem.answer === list.join(", "), id, difficulty, "범위 대칭수 오류");
      return;
    }
    case "month-date-palindrome-b7": {
      const list = [];
      for (let d = 1; d <= MONTH_DAYS[meta.m - 1]; d += 1) if (isPalindrome(`${meta.m}${d}`)) list.push(`${meta.m}월 ${d}일`);
      assert(list.length && problem.answer === list.join(", "), id, difficulty, "한 달 날짜 대칭수 오류");
      return;
    }
    case "date-palindrome-count-range-b7":
      assert(numeric === allCalendarPalindromes(meta.a, meta.b).length && numeric > 0, id, difficulty, "날짜 대칭수 개수 오류");
      return;
    case "four-point-overlap-b7":
      meta.items.forEach((it, i) => {
        const [a, b, c, d] = it.xs;
        const want = it.mode === "overlap" ? c - b : d - a;
        assert((c - a) + (d - b) === (d - a) + (c - b) && it.answer === want && problem.answer.split(" / ")[i] === `(${i + 1}) ${want}`, id, difficulty, "네 점 겹친 거리 오류");
      });
      return;
    case "six-point-overlap-b7": {
      const values = meta.given.map(([i, j]) => meta.xs[j] - meta.xs[i]);
      const got = spanDetermined(meta.given, meta.ask, values);
      assert(got !== null && Math.abs(got - (meta.xs[meta.ask[1]] - meta.xs[meta.ask[0]])) < 1e-9 && numeric === Math.round(got), id, difficulty, "여섯 점 구간이 정해지지 않음");
      assert(!meta.given.some(([i, j]) => i === meta.ask[0] && j === meta.ask[1]), id, difficulty, "구하는 구간이 그대로 주어짐");
      return;
    }
    case "reversed-diff-both-ways-b7":
      meta.items.forEach((it) => {
        const list = [];
        for (let n = 10; n <= 99; n += 1) if (n % 10 && Math.abs(reverseOf(n) - n) === it.diff) list.push(n);
        assert(list.join(", ") === it.list.join(", ") && list.length, id, difficulty, "두 방향 자리 바꿈 목록 오류");
      });
      return;
    case "reversed-digit-grows-b7": {
      const list = [];
      for (let o = 0; o <= 9; o += 1) { const n = meta.t * 10 + o; if (o && reverseOf(n) - n === meta.diff) list.push(n); }
      assert(list.length === 1 && list[0] === numeric, id, difficulty, "커진 자리 바꿈 오류");
      return;
    }
    case "reversed-diff-smallest-b7": {
      let best = null;
      for (let n = 10; n <= 99 && best === null; n += 1) if (n % 10 && Math.abs(reverseOf(n) - n) === meta.diff) best = n;
      assert(best === numeric, id, difficulty, "가장 작은 자리 바꿈 수 오류");
      return;
    }
    case "venn-total-neither-one-b7": {
      const atLeast = meta.total - meta.none;
      const both = meta.A + meta.B - atLeast;
      assert(both > 0 && both <= Math.min(meta.A, meta.B) && numeric === atLeast - both, id, difficulty, "한 가지만 좋아하는 수 오류");
      return;
    }
    case "branch-tree-two-level-b7": {
      const girls = meta.gw + meta.gn;
      const gw = meta.known === "w" ? meta.gw : girls - meta.gn;
      const gn = girls - gw;
      const bw = (meta.gw + meta.bw) - gw;
      const bn = (meta.gn + meta.bn) - gn;
      assert(numeric === (meta.ask === "boys" ? bw + bn : bw), id, difficulty, "두 층 가지 그림 오류");
      return;
    }
    case "branch-tree-three-level-b7": {
      const kids = meta.bag + (meta.ms + meta.fs - meta.bag);
      const maleAdults = (meta.ms + meta.ma) - meta.ms;
      assert(numeric === kids + maleAdults + meta.fa, id, difficulty, "세 층 가지 그림 오류");
      return;
    }
    case "disjoint-groups-rest-b7":
      assert(numeric === (meta.notA + meta.notB + meta.a + meta.b) / 2 && numeric === meta.a + meta.b + meta.c, id, difficulty, "두 무리와 나머지 오류");
      return;
    case "reverse-add-chain-b7": {
      let n = meta.start;
      let k = 0;
      while (!isPalindrome(n) && k < 10) { n += reverseOf(n); k += 1; }
      assert(isPalindrome(n) && k === meta.steps.length && numeric === n, id, difficulty, "거꾸로 더하기 되풀이 오류");
      return;
    }
    case "kaprekar-fill-b7":
      meta.chains.forEach((chain, i) => {
        let cur = Number(meta.sets[i].join(""));
        chain.forEach((st) => { const s = kaprekarStep(cur); assert(s.value === st.r, id, difficulty, "495 칸 오류"); cur = s.value; });
        assert(chain.at(-1).r === 495, id, difficulty, "495에서 멈추지 않음");
      });
      return;
    case "palindrome-card-adjacent-b7": {
      const list = [];
      for (let a = 1; a <= meta.maxCard; a += 1) for (let b = 0; b <= meta.maxCard; b += 1) if (Math.abs(a - b) === meta.diff) list.push(a * 101 + b * 10);
      assert(problem.answer === list.join(", ") && list.length, id, difficulty, "카드 대칭수 오류");
      return;
    }
    case "stone-triangle-flip-b7":
      meta.rows.forEach((n, i) => {
        const moves = stoneFlipBrute(n);
        assert(moves === meta.moves[i] && moves === Math.floor((n * (n + 1)) / 6), id, difficulty, `삼각형 바둑돌 ${n}줄 최소 이동 오류`);
      });
      return;
    default:
      fail(id, difficulty, `검산 분기 없음: ${meta.family}`);
  }
}

function validate(problem, id, difficulty) {
  if (STRUCTURE_FAMILIES.has(problem.meta?.family)) return validateStructure(problem, id, difficulty);
  validateSurface(problem, id, difficulty);
  const meta = problem.meta;
  const numeric = numericAnswer(problem);
  switch (meta.family) {
    case "calendar-month-shift":
      assert(mod(meta.sourceWeekday + meta.shift, 7) === meta.targetWeekday, id, difficulty, "다음 달 요일 계산 오류");
      assert(problem.answer === `${WEEKDAYS[meta.targetWeekday]}요일`, id, difficulty, "다음 달 요일 답 오류"); return;
    case "calendar-cross-month": {
      const elapsed = dateSerial(meta.targetMonth, meta.targetDate, meta.leap) - dateSerial(meta.startMonth, meta.startDate, meta.leap);
      assert(elapsed === meta.elapsed && mod(meta.startWeekday + elapsed, 7) === meta.targetWeekday, id, difficulty, "여러 달 요일 계산 오류");
      assert(problem.answer === `${WEEKDAYS[meta.targetWeekday]}요일`, id, difficulty, "여러 달 요일 답 오류"); return;
    }
    case "weekday-after-days":
      assert(mod(meta.weekday + meta.days, 7) === meta.targetWeekday, id, difficulty, "며칠 뒤 요일 오류"); return;
    case "time-conversion":
      assert(meta.source * meta.factor === meta.result && numeric === meta.result, id, difficulty, "시간 단위 변환 오류"); return;
    case "clock-reading":
      assert(meta.total === (meta.hour % 12) * 60 + meta.minute && problem.answer === clockText(meta.total), id, difficulty, "시계 읽기 오류"); return;
    case "elapsed-time":
      assert(meta.end - meta.start === meta.duration && meta.hours * 60 + meta.minutes === meta.duration, id, difficulty, "지난 시간 오류"); return;
    case "time-arithmetic": {
      const rebuilt = meta.operation === "+" ? meta.first + meta.second : meta.first - meta.second;
      assert(rebuilt === meta.result && problem.answer === clockText(meta.result), id, difficulty, "시간 덧뺄셈 오류"); return;
    }
    case "find-end-time":
      assert(meta.start + meta.duration === meta.end && problem.answer === clockText(meta.end), id, difficulty, "끝 시각 오류"); return;
    case "find-start-time":
      assert(meta.end - meta.duration === meta.start && problem.answer === clockText(meta.start), id, difficulty, "시작 시각 오류"); return;
    case "consecutive-full-month":
      assert(mod(meta.july31 + 31, 7) === meta.august31 && mod(meta.july31 - 30, 7) === meta.july1 && mod(meta.july1 - 30, 7) === meta.june1, id, difficulty, "연속 큰달 역산 오류"); return;
    case "mirror-clock-reading":
      assert(mod(meta.original + meta.mirror, 720) === 0 && problem.answer === clockText(meta.original), id, difficulty, "거울 시계 오류"); return;
    case "mirror-clock-elapsed":
      assert(mod(720 - meta.sleep12, 720) === meta.mirrorSleep && mod(720 - meta.wake12, 720) === meta.mirrorWake, id, difficulty, "거울 시각 변환 오류");
      assert(1440 - meta.sleep + meta.wake === meta.duration, id, difficulty, "밤사이 시간 오류"); return;
    case "mirror-symmetric-clock":
      assert(meta.target === 360 && problem.answer === "6시", id, difficulty, "대칭 시계 오류"); return;
    case "arithmetic-sequence-nth":
      assert(meta.start + meta.step * (meta.position - 1) === meta.result && numeric === meta.result, id, difficulty, "등차수열 몇 번째 오류"); return;
    case "shared-matchsticks":
      assert(meta.added === meta.sides - 1 && meta.sides + meta.added * (meta.count - 1) === meta.result && numeric === meta.result, id, difficulty, "성냥개비 증가 오류"); return;
    case "division-fill":
      assert(meta.divisor * meta.quotient + meta.remainder === meta.dividend && meta.remainder < meta.divisor && numeric === meta.result, id, difficulty, "나눗셈 세로식 오류"); return;
    case "reverse-linear":
      assert(meta.addend + meta.multiplier * meta.unknown === meta.target && numeric === meta.unknown, id, difficulty, "거꾸로 식 오류"); return;
    case "arithmetic-sequence-position":
      assert(meta.start + meta.step * (meta.position - 1) === meta.target && numeric === meta.position, id, difficulty, "수열 위치 오류"); return;
    case "sparse-sequence":
      assert(meta.values.every((value, index) => value === meta.start + meta.step * (meta.indices[index] - 1)), id, difficulty, "띄엄 수열 오류");
      assert(numeric === meta.result, id, difficulty, "띄엄 수열 답 오류"); return;
    case "indexed-sequence":
      assert(meta.first + meta.step * (meta.targetIndex - 1) === meta.result && numeric === meta.result, id, difficulty, "순서표 수열 오류"); return;
    case "two-category": {
      const second = (meta.totalUnits - meta.units[0] * meta.totalCount) / (meta.units[1] - meta.units[0]);
      assert(second === meta.secondCount && meta.firstCount + meta.secondCount === meta.totalCount, id, difficulty, "가정법 개수 오류"); return;
    }
    case "correct-wrong-score": {
      const correct = (meta.score - meta.base + meta.total * meta.penalty) / (meta.gain + meta.penalty);
      assert(correct === meta.correct && meta.wrong === meta.total - meta.correct, id, difficulty, "맞고 틀린 점수 오류"); return;
    }
    case "object-growth":
      assert(meta.start + meta.step * (meta.position - 1) === meta.result && numeric === meta.result, id, difficulty, "사물 증가 오류"); return;
    case "bounded-symbol": {
      const valid = [];
      for (let first = 1; first < meta.bound; first += 1) {
        const second = 2 * first - meta.offset;
        if (second >= 1 && first + second < meta.bound) valid.push({ first, second, total: first + second });
      }
      assert(same(valid, meta.valid) && valid[0].total === meta.minTotal && valid.at(-1).total === meta.maxTotal, id, difficulty, "조건 수 전수 열거 오류");
      assert(meta.minTotal + meta.maxTotal === meta.result && numeric === meta.result, id, difficulty, "조건 수 답 오류"); return;
    }
    case "win-loss":
      assert(meta.wins + meta.losses === meta.total && meta.wins * meta.up - meta.losses * meta.down === 0 && numeric === meta.wins, id, difficulty, "승패 이동 오류"); return;
    case "shared-consumption":
      assert(meta.dwarfs + meta.giants === meta.totalPeople && meta.dwarfs / 2 + meta.giants * 2 === meta.fruits, id, difficulty, "먹는 양 가정 오류"); return;
    case "count-difference":
      assert(meta.chickens - meta.rabbits === meta.difference && meta.chickens * 2 - meta.rabbits * 4 === meta.legDifference, id, difficulty, "개수 차 가정 오류"); return;
    case "linked-sequences":
      assert(meta.firstStart + meta.firstStep * (meta.position - 1) === meta.target, id, difficulty, "첫째 대응 수열 오류");
      assert(meta.secondStart + meta.secondStep * (meta.position - 1) === meta.result && numeric === meta.result, id, difficulty, "둘째 대응 수열 오류"); return;
    case "climb-slip": {
      let height = 0;
      let day = 0;
      while (height < meta.height && day < 100) {
        day += 1;
        height += meta.climb;
        if (height < meta.height) height -= meta.slip;
      }
      assert(day === meta.days && numeric === meta.days, id, difficulty, "오르고 미끄러지는 날짜 오류"); return;
    }
    case "container-exchange": {
      let empty = meta.initial;
      let exchanged = 0;
      while (empty >= meta.rate) {
        const received = Math.floor(empty / meta.rate);
        exchanged += received;
        empty = received + empty % meta.rate;
      }
      assert(exchanged === meta.exchanged && empty === meta.remaining && meta.initial + exchanged === meta.total && numeric === meta.total, id, difficulty, "빈 병 교환 오류"); return;
    }
    case "reverse-doubling-day":
      assert(meta.start * (2 ** (meta.targetDay - 1)) === meta.target && meta.start * (2 ** (meta.fullDay - 1)) === meta.full && numeric === meta.targetDay, id, difficulty, "두 배 날짜 역산 오류"); return;
    case "doubling-fraction-start":
      assert(meta.start * (2 ** (meta.earlierDay - 1)) === meta.earlier && meta.start * (2 ** (meta.fullDay - 1)) === meta.full && meta.earlier + meta.start === meta.result && numeric === meta.result, id, difficulty, "두 배 앞선 양 오류"); return;
    case "doubling-start":
      assert(meta.normalStart * (2 ** (meta.normalDay - 1)) === meta.full && meta.neededStart * (2 ** (meta.targetDay - 1)) === meta.full && numeric === meta.neededStart, id, difficulty, "두 배 시작 수 오류"); return;
    case "doubling-half-day":
      assert(meta.half * 2 === meta.full && meta.targetDay === meta.fullDay - 1 && numeric === meta.targetDay, id, difficulty, "두 배 절반 날짜 오류"); return;
    case "doubling-earlier":
      assert(meta.multiplier === 2 ** meta.daysEarlier && meta.targetDay === meta.normalDay - meta.daysEarlier && numeric === meta.targetDay, id, difficulty, "두 배 빠른 날짜 오류"); return;
    case "polygon-border-points":
      assert(meta.sides * (meta.pointsPerSide - 1) === meta.total && numeric === meta.total, id, difficulty, "정다각형 점 수 오류"); return;
    case "polygon-side-points-inverse":
      assert(meta.total / meta.sides + 1 === meta.pointsPerSide && numeric === meta.pointsPerSide, id, difficulty, "한 변 점 수 역산 오류"); return;
    case "polygon-stakes":
      assert(meta.sides * (meta.stakesPerSide - 1) === meta.total && numeric === meta.total, id, difficulty, "정다각형 말뚝 오류"); return;
    case "closed-object-count":
      assert(meta.perimeter / meta.spacing === meta.count && numeric === meta.count, id, difficulty, "닫힌 길 물체 수 오류"); return;
    case "closed-perimeter":
      assert(meta.spacing * meta.count === meta.perimeter && numeric === meta.perimeter, id, difficulty, "닫힌 길 둘레 오류"); return;
    case "between-subdivision":
      assert(meta.subdivisions - 1 === meta.newPerGap && meta.oldCount * meta.newPerGap === meta.result && numeric === meta.result, id, difficulty, "사이 등분점 오류"); return;
    case "perimeter-capacity":
      assert(meta.lampCount * meta.benchesPerGap === meta.benches && meta.benches * meta.seatsPerBench === meta.people && numeric === meta.people, id, difficulty, "둘레 수용 인원 오류"); return;
    case "between-object-perimeter":
      assert(meta.treesPerGap + 1 === meta.intervalsPerGap && meta.lamps * meta.intervalsPerGap * meta.spacing === meta.perimeter && numeric === meta.perimeter, id, difficulty, "물체 사이 둘레 오류"); return;
    case "inner-outer-count": {
      const inner = 2 * (meta.innerWidth + meta.innerHeight) / meta.spacing;
      const outer = 2 * (meta.outerWidth + meta.outerHeight) / meta.spacing;
      assert(inner === meta.innerCount && outer === meta.outerCount && inner + outer === meta.total && numeric === meta.total, id, difficulty, "안팎 가로등 오류"); return;
    }
    case "polygon-shape-conversion":
      assert((meta.sourcePoints - 1) * meta.sourceSides === meta.intervals && (meta.targetPoints - 1) * meta.targetSides === meta.intervals && numeric === meta.targetPoints, id, difficulty, "정다각형 바꾸기 오류"); return;
    case "palindrome-count": {
      const expected = 9 * (10 ** (Math.ceil(meta.digits / 2) - 1));
      assert(expected === meta.count && numeric === meta.count, id, difficulty, "대칭수 개수 오류"); return;
    }
    case "palindrome-digit-sum": {
      const valid = [];
      for (let first = 1; first <= 9; first += 1) {
        const middle = meta.targetSum - first * 2;
        if (middle >= 0 && middle <= 9) valid.push(first * 101 + middle * 10);
      }
      assert(same(valid, meta.valid) && problem.answer === valid.join(", "), id, difficulty, "자리 합 대칭수 오류"); return;
    }
    case "calendar-palindrome": {
      const valid = allCalendarPalindromes(meta.startMonth, meta.endMonth);
      assert(valid.length > 0 && same(valid, meta.valid) && problem.answer === valid.join(", "), id, difficulty, "날짜 대칭수 오류"); return;
    }
    case "clock-palindrome": {
      const valid = allClockPalindromes(meta.startHour, meta.endHour);
      assert(valid.length > 0 && same(valid, meta.valid) && numeric === valid.length, id, difficulty, "시각 대칭수 오류"); return;
    }
    case "unit-unpadded-clock-palindrome-b7": {
      const valid = [];
      for (let hour = meta.startHour; hour < meta.endHour; hour += 1) for (let minute = 0; minute < 60; minute += 1) {
        const text = `${hour}${minute}`;
        if (isPalindrome(text)) valid.push({ hour, minute, text });
      }
      assert(valid.length > 0 && same(valid, meta.valid) && numeric === valid.length, id, difficulty, "앞자리 없는 시각 대칭수 오류"); return;
    }
    case "reverse-difference-list": {
      const valid = reverseDifferenceValues(meta.difference);
      assert(same(valid, meta.valid) && problem.answer === valid.join(", "), id, difficulty, "자리 바꿈 차 목록 오류"); return;
    }
    case "reverse-difference-extreme": {
      const valid = reverseDifferenceValues(meta.difference);
      assert(same(valid, meta.valid) && meta.smallest === valid[0] && meta.largest === valid.at(-1), id, difficulty, "자리 바꿈 최댓값 오류"); return;
    }
    case "reverse-given-tens":
      assert(meta.value === meta.tens * 10 + meta.ones && meta.reversed === meta.ones * 10 + meta.tens && meta.value - meta.reversed === meta.difference && numeric === meta.value, id, difficulty, "십의 자리 조건 오류"); return;
    case "reverse-pair-range": {
      const candidates = [];
      for (let tens = 1; tens <= 9; tens += 1) for (let ones = 1; ones <= 9; ones += 1) {
        const value = tens * 10 + ones;
        const reversed = ones * 10 + tens;
        if (value - reversed === meta.difference && value + reversed > meta.lower && value + reversed < meta.upper) candidates.push(value);
      }
      assert(candidates.length === 1 && candidates[0] === meta.value && numeric === meta.value, id, difficulty, "자리 바꿈 범위 답 유일성 오류"); return;
    }
    case "distance-chain":
      assert(sum(meta.gaps) === meta.total && meta.leftSpan + meta.rightSpan - meta.overlap === meta.total && numeric === meta.total, id, difficulty, "겹친 거리 오류"); return;
    case "venn-overlap-all":
    case "venn-union":
    case "venn-exactly-one":
    case "venn-neither":
    case "venn-overlap-neither": {
      assert(meta.leftOnly + meta.overlap === meta.leftTotal && meta.rightOnly + meta.overlap === meta.rightTotal, id, difficulty, "벤 영역 합 오류");
      assert(meta.leftOnly + meta.overlap + meta.rightOnly === meta.union && meta.union + meta.neither === meta.total, id, difficulty, "벤 전체 합 오류");
      const expected = meta.mode === "union" ? meta.union : meta.mode === "exactly-one" ? meta.leftOnly + meta.rightOnly : meta.mode === "neither" ? meta.neither : meta.overlap;
      assert(expected === meta.result && numeric === expected, id, difficulty, "벤 정답 오류"); return;
    }
    case "two-way-table":
      assert(same(meta.cells.map((row) => sum(row)), meta.rowTotals), id, difficulty, "이원표 행 합 오류");
      assert(same([meta.cells[0][0] + meta.cells[1][0], meta.cells[0][1] + meta.cells[1][1]], meta.columnTotals), id, difficulty, "이원표 열 합 오류");
      assert(meta.cells[meta.hiddenRow][meta.hiddenColumn] === meta.result && numeric === meta.result, id, difficulty, "이원표 빈칸 오류"); return;
    case "palindrome-adjacent": {
      const valid = [];
      for (let first = 1; first <= 9; first += 1) for (let middle = 0; middle <= 9; middle += 1) if (Math.abs(first - middle) === meta.difference) valid.push(first * 101 + middle * 10);
      assert(same(valid, meta.valid) && problem.answer === valid.join(", "), id, difficulty, "이웃 차 대칭수 오류"); return;
    }
    case "complement-total":
      assert(meta.notLeft === meta.rightOnly + meta.neither && meta.notRight === meta.leftOnly + meta.neither, id, difficulty, "여집합 수 오류");
      assert(meta.notLeft + meta.notRight + meta.overlap - meta.neither === meta.total && numeric === meta.total, id, difficulty, "여집합 전체 오류"); return;
    case "four-complement":
      assert(meta.complements.every((value, index) => value === meta.total - meta.groups[index]), id, difficulty, "네 모둠 여집합 오류");
      assert(sum(meta.complements) / 3 === meta.total && numeric === meta.total, id, difficulty, "네 모둠 전체 오류"); return;
    case "unit-four-group-three-clues-b7":
      assert(meta.notFirst === meta.total - meta.groups[0] && meta.notSecond === meta.total - meta.groups[1], id, difficulty, "세 조건 모둠 여집합 오류");
      assert(meta.neitherThirdNorFourth === meta.groups[0] + meta.groups[1] && numeric === meta.total, id, difficulty, "세 조건 모둠 전체 오류"); return;
    case "reverse-add-palindrome":
      assert(Number([...String(meta.start)].reverse().join("")) === meta.reversed && meta.start + meta.reversed === meta.result && isPalindrome(meta.result) && numeric === meta.result, id, difficulty, "거꾸로 더해 대칭수 오류"); return;
    case "stone-moves": {
      const target = new Set(meta.target.map((point) => point.join(":")));
      const overlap = meta.initial.filter((point) => target.has(point.join(":"))).length;
      assert(meta.target.length - overlap === meta.moves && numeric === meta.moves, id, difficulty, "바둑돌 최소 이동 오류"); return;
    }
    case "kaprekar-495": {
      let value = meta.start;
      const rebuilt = [];
      for (let count = 0; count < 10 && value !== 495; count += 1) {
        const step = kaprekarStep(value);
        rebuilt.push(step);
        value = step.value;
      }
      assert(value === 495 && same(rebuilt, meta.history) && rebuilt.length === meta.count && numeric === meta.count, id, difficulty, "495 규칙 오류"); return;
    }
    case "three-circle-sum":
      assert(meta.leftOverlap + meta.leftExclusive === meta.lowerSum, id, difficulty, "왼쪽 아래 원 합 오류");
      assert(meta.rightOverlap + meta.rightExclusive === meta.lowerSum, id, difficulty, "오른쪽 아래 원 합 오류");
      assert((meta.hiddenSide === "left" ? meta.leftExclusive : meta.rightExclusive) === meta.result && numeric === meta.result, id, difficulty, "세 원 색칠 부분 오류"); return;
    default:
      fail(id, difficulty, `검산 분기 없음: ${meta.family}`);
  }
}

function numbersInReference(reference) {
  if (Array.isArray(reference.numbers)) return reference.numbers;
  return Array.from({ length: reference.to - reference.from + 1 }, (_, index) => reference.from + index);
}

function referenceKeys(stage, references) {
  return references.flatMap((reference) => numbersInReference(reference).map((number) => `${stage}:${reference.section}:${reference.group}:${number}`));
}

if (!book) throw new Error("book-07 missing");
if (units.length !== 4) throw new Error(`book-07 unit count ${units.length}`);
if (typeIds.length !== 111) throw new Error(`book-07 type count ${typeIds.length}`);
if (unitTestQuestions.length !== 25) throw new Error(`book-07 unit test count ${unitTestQuestions.length}`);
unitTestQuestions.forEach((question, index) => {
  if (question.number !== index + 1) throw new Error(`book-07 unit test number ${question.number}, expected ${index + 1}`);
  if (question.typeId !== expectedUnitTestTypes[index]) throw new Error(`book-07 unit test ${question.number} type ${question.typeId}, expected ${expectedUnitTestTypes[index]}`);
  if (!question.verified) throw new Error(`book-07 unit test ${question.number} is not verified`);
  if (!typeById(question.typeId)) throw new Error(`book-07 unit test ${question.number} unknown type ${question.typeId}`);
});

let sourceQuestionCount = 0;
units.forEach((unit, unitIndex) => {
  const expected = TEXTBOOK_STAGES.flatMap((stage) => referenceKeys(stage.id, unit.studyRefs[stage.id] || []));
  const actual = [];
  unit.typeIds.forEach((typeId) => {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!GENERATORS[type.generator]) throw new Error(`missing generator ${type.generator}`);
    if (!textbookGuideForType(typeId)) throw new Error(`missing guide ${typeId}`);
    const refs = unit.typeStudyRefs?.[typeId];
    if (!refs) throw new Error(`missing study refs ${typeId}`);
    TEXTBOOK_STAGES.forEach((stage) => actual.push(...referenceKeys(stage.id, refs[stage.id] || [])));
  });
  const duplicate = actual.find((key, index) => actual.indexOf(key) !== index);
  if (duplicate) throw new Error(`${unit.label} duplicate source question ${duplicate}`);
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.find((key) => !actualSet.has(key));
  const extra = actual.find((key) => !expectedSet.has(key));
  if (missing || extra || actual.length !== expected.length) throw new Error(`${unit.label} coverage mismatch missing=${missing || "-"} extra=${extra || "-"} ${actual.length}/${expected.length}`);
  if (actual.length !== expectedUnitCounts[unitIndex]) throw new Error(`${unit.label} source count ${actual.length}`);
  sourceQuestionCount += actual.length;
});
if (sourceQuestionCount !== 180) throw new Error(`book-07 source count ${sourceQuestionCount}`);

let generated = 0;
for (const typeId of auditedTypeIds) {
  const type = typeById(typeId);
  const generator = GENERATORS[type.generator];
  for (const difficulty of [1, 2, 3]) {
    for (let index = 0; index < iterations; index += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 20 && !problem; attempt += 1) problem = generator({ difficulty });
      validate(problem, typeId, difficulty);
      generated += 1;
    }
  }
}

console.log(`book-07 audit passed: ${sourceQuestionCount} source questions, ${typeIds.length} body types, ${unitTestQuestions.length} unit-test questions, ${auditedTypeIds.length} audited types, ${generated.toLocaleString("en-US")} generated checks`);
