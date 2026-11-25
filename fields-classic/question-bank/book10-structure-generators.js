// 1과정 10권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK10_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK10_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK10_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK10_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
// 만든 꼴(대조 결과의 「새 생성기」·「partial 변형」):
//   1단원 1부터 n까지(짝수·홀수 개) 가우스 표 · 긴 연속수 합(짝수 개 6~12, 홀수 개 5~13) · 7~10개 연속수 채우기 ·
//        한 수를 주어진 여러 개수의 연속수로 채우기 · 요일이 정해진 한 주의 날짜 합으로 다른 날 요일 ·
//        합·개수·홀짝으로 연속한 홀수(짝수) 찾기 · 대칭 모양 수 배열표 합(㉮㉯) · 합으로 가장 작은/큰 칸 찾기(배열표·달력) ·
//        일의 자리 5끼리도 있는 곱셈 규칙 판 · 십의 자리 합만으로 연속수의 합 · 끝 두 자리만 보이는 연속수 덧셈 셋
//   2단원 두 모양 저울(개수 조합 여러 가지, 둘 다 구하기) · 두 구역 과녁 한 점수 · 공통 묶음 저울(3a+2b, a+2b) ·
//        컵과 구슬 두 배 · 간격을 바꾸면 늘어나는 나무 수로 처음 나무 수·둘레 · 값이 싼 물건으로 바꿔 더 산 개수 ·
//        새로 온 사람과 줄어든 몫으로 처음 인원·전체 · 두 과목씩 평균 · 2~5개 섞인 네 모양 저울
//   3단원 숫자 카드(모두 쓰기·0 포함·6장) · 점점 커지는/작아지는 수 모두 쓰기(어떤 수보다 큰/작은) ·
//        숫자 2~3개로 여러 자리 · 1부터 n까지 카드로 합이 같은 묶음 모두 · 자리 합이 같은 수 큰 수부터 · 같은 차 세 자리 수
//   4단원 1부터 600대까지 숫자 세기(자리별) · 가장 많이 나오는 숫자와 횟수 · 세 자리·네 자리 전체 숫자 수 ·
//        범위마다 수와 숫자의 개수 표 · 백의 자리대 범위의 숫자 세기 · 판정이 섞인 숫자 야구 · □△ 기호 숫자 야구

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[randomInt(0, list.length - 1)];
const sum = (list) => list.reduce((a, b) => a + b, 0);
const range = (from, to) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
const mod = (v, m) => ((v % m) + m) % m;
const runOf = (start, count, step = 1) => Array.from({ length: count }, (_, i) => start + i * step);

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function combinations(items, count, start = 0, chosen = [], output = []) {
  if (chosen.length === count) { output.push([...chosen]); return output; }
  for (let i = start; i <= items.length - (count - chosen.length); i += 1) {
    chosen.push(items[i]);
    combinations(items, count, i + 1, chosen, output);
    chosen.pop();
  }
  return output;
}

function permutations(items, count = items.length, chosen = [], output = []) {
  if (chosen.length === count) { output.push([...chosen]); return output; }
  items.forEach((value, index) => {
    chosen.push(value);
    permutations(items.slice(0, index).concat(items.slice(index + 1)), count, chosen, output);
    chosen.pop();
  });
  return output;
}

// 수 뒤 받침: 끝자리 2·4·5·9는 받침 없음(이·사·오·구), 나머지(영·일·삼·육·칠·팔·십·백·천)는 받침 있음.
const hasBatchim = (n) => ![2, 4, 5, 9].includes(Math.abs(n) % 10);
const eul = (n) => `${n}${hasBatchim(n) ? "을" : "를"}`;
const iga = (n) => `${n}${hasBatchim(n) ? "이" : "가"}`;
const eun = (n) => `${n}${hasBatchim(n) ? "은" : "는"}`;
const ro = (n) => `${n}${[0, 3, 6].includes(Math.abs(n) % 10) ? "으로" : "로"}`;
const ira = (n) => `${n}${hasBatchim(n) ? "이라면" : "라면"}`;
const ieot = (n) => `${n}${hasBatchim(n) ? "이었습니다" : "였습니다"}`;
// 낱말 뒤 조사: 마지막 글자의 받침으로
const wordBatchim = (word) => { const c = word.charCodeAt(word.length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
const wEul = (word) => `${word}${wordBatchim(word) ? "을" : "를"}`;
const wEun = (word) => `${word}${wordBatchim(word) ? "은" : "는"}`;
const wWa = (word) => `${word}${wordBatchim(word) ? "과" : "와"}`;
const wUi = (word) => `${word}의`;

const PARTS = ["(1)", "(2)", "(3)", "(4)", "(5)", "(6)"];
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];
const MARKS = ["㉮", "㉯", "㉰"];
const WD = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAY = WD.map((d) => `${d}요일`);
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const KOR_COUNT = { 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉" };

// ── 그림 도구(인쇄에서도 같은 크기 — 폭을 박는다) ─────────────
const INK = "#2f2a24";
const LINE = "#8a7e68";
const SOFT = "#7a6f5c";
const PAPER = "#f7f3e8";
const ACCENT = "#2f6b4f";
const HILITE = ["#ffd98a", "#cfe3c4", "#f6c9b8"];
const FONT = "font-family:'FC Sans','Noto Sans KR',sans-serif";

const svgOpen = (w, h, label) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="width:${w}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">`;
const text = (x, y, value, size = 15, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;
const textL = (x, y, value, size = 15, extra = "") => `<text x="${x}" y="${y}" text-anchor="start" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;
const panel = (w, h) => `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" style="fill:${PAPER};stroke:none"/>`;
const fig = (html) => ({ kind: "fig", html });
const b10 = (subtype, rest) => ({ kind: "book10", subtype, ...rest });
const box = (inner, extra = "") => `<span style="display:inline-grid;place-items:center;min-width:30px;height:30px;padding:0 4px;border:1.5px solid ${ACCENT};border-radius:3px;background:#fff;font-weight:800;${extra}">${inner}</span>`;
const htmlPanel = (inner, width = 520) => `<div style="width:${width}px;max-width:100%;box-sizing:border-box;padding:12px 16px;border-radius:10px;background:${PAPER};color:${INK};${FONT};font-size:15px;line-height:1.6">${inner}</div>`;

function problem(family, { prompt, visual, answer, solution, meta = {} }) {
  return { prompt, visual, answer: String(answer), solution, meta: { family, ...meta } };
}

// ── 1단원 연속수 ───────────────────────────────────────

// target을 L개(≥2)의 연속수로 — 첫 수가 자연수일 때만
const runFor = (target, length) => {
  const start = (target - (length * (length - 1)) / 2) / length;
  return Number.isInteger(start) && start >= 1 ? runOf(start, length) : null;
};
const validLengths = (target, maxLength = 12) => range(2, maxLength).filter((length) => runFor(target, length));

// 「합 = ○ + ○ + …」 줄. values가 있으면 채운 줄(보기).
function blankRowsSvg(rows, label) {
  const cell = 40;
  const left = 112;
  const maxCount = Math.max(...rows.map((row) => row.count));
  const w = left + maxCount * cell + 10;
  const rowH = 46;
  const h = rows.length * rowH + 12;
  let body = panel(w, h);
  rows.forEach((row, i) => {
    const cy = 6 + i * rowH + rowH / 2;
    body += textL(10, cy + 5, row.label || "", 14, 'font-weight="700"');
    body += text(72, cy + 6, row.total, 17, 'font-weight="800"');
    body += text(100, cy + 6, "=", 17);
    for (let k = 0; k < row.count; k += 1) {
      const cx = left + 16 + k * cell;
      body += `<circle cx="${cx}" cy="${cy}" r="15" style="fill:#fff;stroke:${ACCENT};stroke-width:1.5"/>`;
      if (row.values) body += text(cx, cy + 5, row.values[k], 13, 'font-weight="700"');
      if (k < row.count - 1) body += text(cx + cell / 2, cy + 5, "+", 14);
    }
  });
  return `${svgOpen(w, h, label)}${body}</svg>`;
}

// 「(1) 식 = □」 줄 — 가우스 표와 긴 연속수 합
function sumRowsHtml(rows) {
  const line = (row) => `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;padding:6px 0;border-bottom:1px dashed #d8cfbd"><b style="min-width:30px">${row.label}</b><span style="letter-spacing:.3px">${row.expr}</span><span>=</span>${row.hint ? `<span style="color:${SOFT};font-size:14px">${row.hint}</span><span>=</span>` : ""}${box("", "min-width:54px")}</div>`;
  return htmlPanel(rows.map(line).join(""), 600);
}

const hintBox = (n = 1) => Array.from({ length: n }, () => "□").join("");

function gaussFromOne(parity, difficulty) {
  const pools = parity === "even"
    ? { 1: [8, 10, 12, 14, 16, 18, 20], 2: [12, 14, 16, 18, 20, 24, 30, 40], 3: [20, 30, 40, 50, 60, 80, 100] }
    : { 1: [7, 9, 11, 13, 15, 17, 19], 2: [11, 13, 15, 17, 19, 21, 29, 39], 3: [19, 29, 39, 49, 59, 79, 99] };
  const ends = shuffle(pools[difficulty]).slice(0, 3).sort((a, b) => a - b);
  const totals = ends.map((n) => (n * (n + 1)) / 2);
  const rows = ends.map((n, i) => ({
    label: PARTS[i],
    expr: parity === "even" ? `1+2+3+ … +${n - 1}+${n}` : `1+2+3+ … +□+ … +${n - 1}+${n}`,
    hint: parity === "even" ? `(1+${hintBox()})×${hintBox()}` : `${hintBox()}×${hintBox()}`
  }));
  const steps = ends.map((n, i) => parity === "even"
    ? `${PARTS[i]} 1+${n}=${n + 1}인 짝이 ${n / 2}개이므로 ${n + 1}×${n / 2}=${totals[i]}`
    : `${PARTS[i]} 가운데 수는 (1+${n})÷2=${(n + 1) / 2}이고 수가 ${n}개이므로 ${(n + 1) / 2}×${n}=${totals[i]}`);
  return { ends, totals, rows, steps };
}

function gaussFromOneEvenB10({ difficulty = 2 }) {
  const { ends, totals, rows, steps } = gaussFromOne("even", difficulty);
  return problem("gauss-from-one-even-b10", {
    prompt: "처음 수와 끝 수를 짝지어 더하는 가우스의 방법으로 다음 연속수의 합을 구하세요.",
    visual: fig(sumRowsHtml(rows)),
    answer: totals.map((v, i) => `${PARTS[i]} ${v}`).join(", "),
    solution: `${steps.join(". ")}입니다.`,
    meta: { ends, totals, parity: "even" }
  });
}

function gaussFromOneOddB10({ difficulty = 2 }) {
  const { ends, totals, rows, steps } = gaussFromOne("odd", difficulty);
  return problem("gauss-from-one-odd-b10", {
    prompt: "가운데 수를 이용하여 다음 연속수의 합을 구하세요.",
    visual: fig(sumRowsHtml(rows)),
    answer: totals.map((v, i) => `${PARTS[i]} ${v}`).join(", "),
    solution: `${steps.join(". ")}입니다.`,
    meta: { ends, totals, parity: "odd" }
  });
}

function longRuns(parity, difficulty) {
  const counts = parity === "even"
    ? { 1: [6, 8], 2: [8, 10], 3: [10, 12] }[difficulty]
    : { 1: [5, 7], 2: [7, 9], 3: [9, 11, 13] }[difficulty];
  const partCount = difficulty === 1 ? 2 : 3;
  const parts = [];
  const seen = new Set();
  while (parts.length < partCount) {
    const count = pick(counts);
    const start = randomInt(2, difficulty === 3 ? 30 : 16);
    const key = `${start}:${count}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parts.push({ start, count, values: runOf(start, count) });
  }
  return parts.map((part) => ({ ...part, total: sum(part.values) }));
}

function consecutiveSumEvenLongB10({ difficulty = 2 }) {
  const parts = longRuns("even", difficulty);
  const rows = parts.map((part, i) => ({ label: PARTS[i], expr: part.values.join("+"), hint: `(${hintBox()}+${hintBox()})×${hintBox()}` }));
  return problem("consecutive-sum-even-long-b10", {
    prompt: "처음 수와 끝 수를 짝지어 다음 연속수의 합을 곱셈으로 구하세요.",
    visual: fig(sumRowsHtml(rows)),
    answer: parts.map((part, i) => `${PARTS[i]} ${part.total}`).join(", "),
    solution: `${parts.map((part, i) => `${PARTS[i]} ${part.values[0]}+${part.values.at(-1)}=${part.values[0] + part.values.at(-1)}인 짝이 ${part.count / 2}개이므로 (${part.values[0]}+${part.values.at(-1)})×${part.count / 2}=${part.total}`).join(". ")}입니다.`,
    meta: { parts, parity: "even" }
  });
}

function consecutiveSumOddLongB10({ difficulty = 2 }) {
  const parts = longRuns("odd", difficulty);
  const rows = parts.map((part, i) => ({ label: PARTS[i], expr: part.values.join("+"), hint: `${hintBox()}×${hintBox()}` }));
  return problem("consecutive-sum-odd-long-b10", {
    prompt: "가운데 수를 찾아 다음 연속수의 합을 곱셈으로 구하세요.",
    visual: fig(sumRowsHtml(rows)),
    answer: parts.map((part, i) => `${PARTS[i]} ${part.total}`).join(", "),
    solution: `${parts.map((part, i) => `${PARTS[i]} 가운데 수는 ${part.values[(part.count - 1) / 2]}이고 수가 ${part.count}개이므로 ${part.values[(part.count - 1) / 2]}×${part.count}=${part.total}`).join(". ")}입니다.`,
    meta: { parts, parity: "odd" }
  });
}

const middleStep = (total, values) => {
  const count = values.length;
  if (count % 2) return `${count}개이면 가운데 수가 ${total}÷${count}=${values[(count - 1) / 2]}`;
  const pair = total / (count / 2);
  return `${count}개이면 가운데 두 수의 합이 ${total}÷${count / 2}=${pair}이므로 가운데 두 수는 ${values[count / 2 - 1]}, ${values[count / 2]}`;
};

const lengthPool = (pool, countParity) => {
  if (!countParity) return pool;
  const kept = pool.filter((n) => (n % 2 === 0) === (countParity === "even"));
  return kept.length ? kept : pool;
};

// 7~10개의 연속수 채우기 — 두 줄, 개수가 서로 다르다
function consecutiveFromSumLongB10({ difficulty = 2, countParity = "" }) {
  const pool = lengthPool(difficulty === 1 ? [7, 8, 9] : difficulty === 2 ? [7, 8, 9, 10] : [8, 9, 10, 11], countParity);
  const counts = shuffle(pool).slice(0, 2).sort((a, b) => a - b);
  if (counts.length < 2) counts.push(counts[0] + 2);
  const parts = counts.map((count) => {
    const start = randomInt(2, difficulty === 3 ? 30 : 18);
    const values = runOf(start, count);
    return { count, start, values, total: sum(values) };
  });
  return problem("consecutive-from-sum-long-b10", {
    prompt: "다음 수를 연속수의 합으로 나타내려고 합니다. ○ 안에 알맞은 수를 써넣으세요.",
    visual: fig(blankRowsSvg(parts.map((part, i) => ({ label: PARTS[i], total: part.total, count: part.count })), "연속수 채우기 두 줄")),
    answer: parts.map((part, i) => `${PARTS[i]} ${part.values.join(" + ")}`).join(" / "),
    solution: `${parts.map((part, i) => `${PARTS[i]} ${middleStep(part.total, part.values)}입니다. 앞뒤로 1씩 이어 쓰면 ${part.values.join(", ")}`).join(". ")}입니다.`,
    meta: { parts }
  });
}

// 한 수를 주어진 여러 개수의 연속수로 — 「75를 6개, 10개의 연속수로」 꼴
function consecutiveMultiLengthFillB10({ difficulty = 2, countParity = "" }) {
  const want = difficulty === 1 ? 2 : difficulty === 2 ? 3 : pick([4, 5]);
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const target = randomInt(difficulty === 1 ? 20 : 40, difficulty === 1 ? 70 : difficulty === 2 ? 130 : 210);
    let lengths = validLengths(target);
    if (countParity) lengths = lengths.filter((n) => (n % 2 === 0) === (countParity === "even"));
    if (lengths.length < want) continue;
    const chosen = shuffle(lengths).slice(0, want).sort((a, b) => a - b);
    const parts = chosen.map((count) => ({ count, values: runFor(target, count) }));
    return problem("consecutive-multi-length-fill-b10", {
      prompt: `${eul(target)} ${chosen.join("개, ")}개의 연속수의 합으로 나타내려고 합니다. ○ 안에 알맞은 수를 써넣으세요.`,
      visual: fig(blankRowsSvg(parts.map((part, i) => ({ label: PARTS[i], total: target, count: part.count })), `${target}을 여러 개수의 연속수로`)),
      answer: parts.map((part, i) => `${PARTS[i]} ${part.values.join(" + ")}`).join(" / "),
      solution: `${parts.map((part, i) => `${PARTS[i]} ${middleStep(target, part.values)}`).join(". ")}입니다.`,
      meta: { target, lengths: chosen, parts }
    });
  }
  return consecutiveMultiLengthFillB10({ difficulty: 2 });
}

// 달력 — 요일이 정해진 한 주(월~토 등)의 날짜 합으로 다른 날의 요일
const SPECIAL_DAYS = [[1, 1, "새해 첫날"], [3, 1, "삼일절"], [4, 5, "식목일"], [5, 5, "어린이날"], [6, 6, "현충일"], [7, 17, "제헌절"], [8, 15, "광복절"], [10, 3, "개천절"], [10, 9, "한글날"], [12, 25, "크리스마스"]];
const WEEK_SPANS = [[1, 6], [0, 6], [1, 5], [2, 6], [0, 5]];

function blankCalendarHtml({ month, rows, shadeRow, from, to, total }) {
  const cellW = 40;
  const head = WD.map((d, i) => `<b style="display:grid;place-items:center;height:26px;border:1px solid #e2dbcc;background:#f3eee2;font-size:13px;${i === 0 ? "color:#c8463c" : ""}">${d}</b>`).join("");
  const cells = Array.from({ length: rows * 7 }, (_, index) => {
    const on = Math.floor(index / 7) === shadeRow && index % 7 >= from && index % 7 <= to;
    return `<span style="display:block;height:28px;border:1px solid #e2dbcc;background:${on ? HILITE[0] : "#fff"}"></span>`;
  }).join("");
  return `<div style="width:${cellW * 7 + 4}px;max-width:100%;${FONT};color:${INK}"><div style="text-align:center;font-weight:800;margin-bottom:4px">${month}월</div><div style="display:grid;grid-template-columns:repeat(7,1fr);border:2px solid ${LINE}">${head}${cells}</div><div style="margin-top:6px;text-align:center;font-size:14px">${WEEKDAY[from]}~${WEEKDAY[to]} 날짜의 합 <b>${total}</b></div></div>`;
}

function calendarWeekSpanWeekdayB10({ difficulty = 2, countParity = "" }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    let spans = WEEK_SPANS;
    if (countParity) spans = spans.filter(([a, b]) => ((b - a + 1) % 2 === 0) === (countParity === "even"));
    const [from, to] = pick(spans);
    const length = to - from + 1;
    const special = Math.random() < 0.6 ? pick(SPECIAL_DAYS) : null;
    const month = special ? special[0] : randomInt(1, 12);
    const days = MONTH_DAYS[month - 1];
    const date = special ? special[1] : randomInt(1, days);
    const start = randomInt(1, days - length + 1);
    if (date >= start && date < start + length) continue;
    const dates = runOf(start, length);
    const total = sum(dates);
    const dayOne = mod(from - (start - 1), 7);
    const rows = Math.ceil((dayOne + days) / 7);
    const shadeRow = Math.floor((dayOne + start - 1) / 7);
    const weekday = mod(dayOne + date - 1, 7);
    const gap = Math.abs(date - start);
    const name = special ? `${month}월 ${date}일 ${special[2]}` : `${month}월 ${date}일`;
    const topic = special ? wEun(special[2]) : `${month}월 ${date}일은`;
    return problem("calendar-week-span-weekday-b10", {
      prompt: `어느 해 ${month}월 달력에서 어느 주 ${WEEKDAY[from]}부터 ${WEEKDAY[to]}까지의 날짜를 모두 더했더니 ${ieot(total)}. 그 해 ${special ? `${month}월 ${date}일 ` : ""}${topic} 무슨 요일인지 구하세요.`,
      visual: fig(blankCalendarHtml({ month, rows, shadeRow, from, to, total })),
      answer: WEEKDAY[weekday],
      solution: `${length}일의 날짜는 연속수이므로 ${middleStep(total, dates)}입니다. 날짜는 ${dates.join(", ")}이고 첫날 ${start}일이 ${WEEKDAY[from]}입니다. ${wEun(name)} ${start}일보다 ${gap}일 ${date > start ? "뒤" : "앞"}입니다. ${gap}÷7의 나머지는 ${gap % 7}이므로 ${WEEKDAY[weekday]}입니다.`,
      meta: { month, days, from, to, start, dates, total, date, dayOne, weekday }
    });
  }
  return calendarWeekSpanWeekdayB10({ difficulty });
}

// 합·개수·홀짝으로 연속한 홀수(짝수) 찾기 — 보기 한 줄 + 채울 줄
function sameParityRunFromSumB10({ difficulty = 2 }) {
  const parity = pick(["홀수", "짝수"]);
  const odd = parity === "홀수";
  const counts = shuffle(difficulty === 1 ? [3, 4] : difficulty === 2 ? [3, 4, 5] : [5, 6, 7]).slice(0, difficulty === 3 ? 3 : 2).sort((a, b) => a - b);
  const startOf = () => (odd ? 2 * randomInt(0, 14) + 1 : 2 * randomInt(1, 15));
  const exStart = startOf();
  const example = runOf(exStart, 3, 2);
  const parts = counts.map((count) => {
    const values = runOf(startOf(), count, 2);
    return { count, values, total: sum(values) };
  });
  const rows = [{ label: "보기", total: sum(example), count: 3, values: example }, ...parts.map((part, i) => ({ label: PARTS[i], total: part.total, count: part.count }))];
  const step = (part) => (part.count % 2
    ? `${part.count}개이면 가운데 수가 ${part.total}÷${part.count}=${part.values[(part.count - 1) / 2]}`
    : `${part.count}개이면 가운데 두 수의 합이 ${part.total}÷${part.count / 2}=${part.total / (part.count / 2)}이고 두 수는 2 차이이므로 ${part.values[part.count / 2 - 1]}, ${part.values[part.count / 2]}`);
  return problem("same-parity-run-from-sum-b10", {
    prompt: `보기처럼 주어진 수를 연속한 ${parity}들의 합으로 나타내세요. ○ 안에 알맞은 수를 써넣으세요.`,
    visual: fig(blankRowsSvg(rows, `연속한 ${parity}의 합`)),
    answer: parts.map((part, i) => `${PARTS[i]} ${part.values.join(" + ")}`).join(" / "),
    solution: `${parts.map((part, i) => `${PARTS[i]} ${step(part)}입니다. 2씩 앞뒤로 이어 쓰면 ${part.values.join(", ")}`).join(". ")}입니다.`,
    meta: { parity, example, parts }
  });
}

// 수 배열표 — 가운데 칸에 대해 대칭인 모양(가운데 수 × 칸 수)
const SHAPES = {
  "정사각형 9칸": [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
  "십자 5칸": [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]],
  "큰 십자 9칸": [[0, -2], [0, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [0, 1], [0, 2]],
  "엑스 5칸": [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  "테두리 8칸": [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
  "마름모 13칸": [[0, -2], [-1, -1], [0, -1], [1, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]],
  "직사각형 15칸": [[-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1]],
  "H 7칸": [[-1, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [1, 1]],
  "번개 5칸": [[-1, -1], [0, -1], [0, 0], [0, 1], [1, 1]],
  "모래시계 7칸": [[-1, -1], [0, -1], [1, -1], [0, 0], [-1, 1], [0, 1], [1, 1]]
};
const SHAPE_NAMES = Object.keys(SHAPES);
const shapeReach = (offsets) => ({ rx: Math.max(...offsets.map(([dx]) => Math.abs(dx))), ry: Math.max(...offsets.map(([, dy]) => Math.abs(dy))) });

function placeShape(grid, offsets, used) {
  const { rx, ry } = shapeReach(offsets);
  const spots = [];
  for (let r = ry; r < grid.rows - ry; r += 1) for (let c = rx; c < grid.cols - rx; c += 1) {
    const cells = offsets.map(([dx, dy]) => (r + dy) * grid.cols + (c + dx));
    // 다른 모양과 겹치거나 맞닿지 않게
    const near = cells.some((cell) => used.has(cell) || [-1, 1, -grid.cols, grid.cols].some((d) => used.has(cell + d)));
    if (!near) spots.push({ r, c, cells });
  }
  return spots.length ? pick(spots) : null;
}

function numberGridSvg({ cols, rows, start, shapes }) {
  const cell = 32;
  const w = cols * cell + 4;
  const legend = shapes.some((shape) => shape.label);
  const h = rows * cell + 4 + (legend ? 30 : 0);
  let body = "";
  const fillOf = new Map();
  shapes.forEach((shape, i) => shape.cells.forEach((index) => fillOf.set(index, HILITE[i])));
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    const index = r * cols + c;
    const x = 2 + c * cell;
    const y = 2 + r * cell;
    body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:${fillOf.get(index) || "#fff"};stroke:#cabda2;stroke-width:1"/>`;
    body += text(x + cell / 2, y + cell / 2 + 5, start + index, 12, 'font-weight="700"');
  }
  body += `<rect x="2" y="2" width="${cols * cell}" height="${rows * cell}" style="fill:none;stroke:${LINE};stroke-width:2"/>`;
  if (legend) {
    shapes.forEach((shape, i) => {
      const x = 10 + i * 80;
      const y = rows * cell + 14;
      body += `<rect x="${x}" y="${y}" width="16" height="16" style="fill:${HILITE[i]};stroke:${LINE}"/>`;
      body += textL(x + 22, y + 13, shape.label, 15, 'font-weight="800"');
    });
  }
  return `${svgOpen(w, h, "수 배열표")}${body}</svg>`;
}

function gridSpec(difficulty) {
  const cols = pick(difficulty === 1 ? [7, 8] : difficulty === 2 ? [7, 8, 9, 10] : [8, 9, 10]);
  const rows = randomInt(5, cols >= 9 ? 7 : 8);
  return { cols, rows, start: 1 };
}

function shapedGridSymmetricSumB10({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const grid = gridSpec(difficulty);
    const count = difficulty === 1 ? 1 : difficulty === 2 ? pick([1, 2]) : 2;
    const names = shuffle(SHAPE_NAMES).slice(0, count);
    const used = new Set();
    const shapes = [];
    for (const name of names) {
      const spot = placeShape(grid, SHAPES[name], used);
      if (!spot) break;
      spot.cells.forEach((cell) => used.add(cell));
      const center = grid.start + spot.r * grid.cols + spot.c;
      shapes.push({ name, cells: spot.cells, center, size: spot.cells.length, total: center * spot.cells.length, label: count > 1 ? MARKS[shapes.length] : "" });
    }
    if (shapes.length !== count) continue;
    const one = count === 1;
    return problem("shaped-grid-symmetric-sum-b10", {
      prompt: one ? `수 배열표에서 색칠한 ${shapes[0].size}개의 수의 합을 구하세요.` : "수 배열표에서 색칠한 부분 ㉮, ㉯의 수의 합을 각각 구하세요.",
      visual: fig(numberGridSvg({ ...grid, shapes })),
      answer: one ? shapes[0].total : shapes.map((shape) => `${shape.label} ${shape.total}`).join(", "),
      solution: `${shapes.map((shape) => `${shape.label ? `${shape.label} ` : ""}가운데 수 ${eul(shape.center)} 사이에 두고 마주 보는 두 수의 합이 ${ro(shape.center * 2)} 같으므로 합은 ${shape.center}×${shape.size}=${shape.total}`).join(". ")}입니다.`,
      meta: { ...grid, shapes: shapes.map(({ name, cells, center, size, total, label }) => ({ name, cells, center, size, total, label })) }
    });
  }
  return shapedGridSymmetricSumB10({ difficulty: 1 });
}

// 같은 모양의 합 → 가장 작은(큰) 칸
function shapedGridReverseB10({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const grid = gridSpec(difficulty);
    const name = pick(difficulty === 1 ? ["정사각형 9칸", "십자 5칸", "테두리 8칸"] : SHAPE_NAMES);
    const offsets = SHAPES[name];
    const shown = placeShape(grid, offsets, new Set());
    const { rx, ry } = shapeReach(offsets);
    const centers = [];
    for (let r = ry; r < grid.rows - ry; r += 1) for (let c = rx; c < grid.cols - rx; c += 1) if (r !== shown.r || c !== shown.c) centers.push({ r, c });
    if (!centers.length) continue;
    const other = pick(centers);
    const size = offsets.length;
    const center1 = grid.start + shown.r * grid.cols + shown.c;
    const center2 = grid.start + other.r * grid.cols + other.c;
    const cells2 = offsets.map(([dx, dy]) => grid.start + (other.r + dy) * grid.cols + (other.c + dx));
    const askSmall = Math.random() < 0.6;
    const target = askSmall ? Math.min(...cells2) : Math.max(...cells2);
    const total2 = center2 * size;
    return problem("shaped-grid-reverse-b10", {
      prompt: `수 배열표를 보고 물음에 답하세요. (1) 색칠한 ${size}개의 수의 합을 구하세요. (2) 같은 모양으로 색칠한 ${size}개의 수의 합이 ${ira(total2)} ${size}개의 수 중 가장 ${askSmall ? "작은" : "큰"} 수를 구하세요.`,
      visual: fig(numberGridSvg({ ...grid, shapes: [{ cells: shown.cells, label: "" }] })),
      answer: `(1) ${center1 * size}, (2) ${target}`,
      solution: `(1) 가운데 수 ${center1}의 ${size}배이므로 ${center1 * size}입니다. (2) 합 ${eul(total2)} ${ro(size)} 나누면 가운데 수 ${center2}이고, 같은 모양에서 가장 ${askSmall ? "작은" : "큰"} 칸은 ${target}입니다.`,
      meta: { ...grid, name, shownCells: shown.cells, center1, center2, size, total2, askSmall, target }
    });
  }
  return shapedGridReverseB10({ difficulty: 1 });
}

// 달력 3×3 — 합 · 합으로 가장 작은/큰 날짜
function calendarBlockReverseB10({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const dayOne = randomInt(0, 6);
    const days = pick([30, 31]);
    const valid = range(9, days - 8).filter((c) => { const wd = mod(dayOne + c - 1, 7); return wd >= 1 && wd <= 5; });
    if (valid.length < 3) continue;
    const [c1, c2, c3] = shuffle(valid);
    const block = (c) => [c - 8, c - 7, c - 6, c - 1, c, c + 1, c + 6, c + 7, c + 8];
    const parts = [{ ask: "sum", center: c1, answer: c1 * 9 }];
    const smallFirst = difficulty === 2 ? Math.random() < 0.5 : true;
    parts.push({ ask: smallFirst ? "small" : "large", center: c2, total: c2 * 9, answer: smallFirst ? c2 - 8 : c2 + 8 });
    if (difficulty === 3) parts.push({ ask: "large", center: c3, total: c3 * 9, answer: c3 + 8 });
    const lines = parts.map((part, i) => (part.ask === "sum"
      ? `${PARTS[i]} 색칠한 9개의 수의 합을 구하세요.`
      : `${PARTS[i]} 색칠한 사각형처럼 묶은 9개의 수의 합이 ${ira(part.total)} 9개의 수 중 가장 ${part.ask === "small" ? "작은" : "큰"} 수를 구하세요.`));
    return problem("calendar-block-reverse-b10", {
      prompt: `달력을 보고 물음에 답하세요. ${lines.join(" ")}`,
      visual: b10("calendar", { dayOne, days, highlighted: block(c1) }),
      answer: parts.map((part, i) => `${PARTS[i]} ${part.answer}`).join(", "),
      solution: parts.map((part, i) => (part.ask === "sum"
        ? `${PARTS[i]} 가운데 날짜 ${c1}의 9배이므로 ${c1 * 9}입니다.`
        : `${PARTS[i]} ${part.total}÷9=${iga(part.center)} 가운데 날짜이고, 가장 ${part.ask === "small" ? `작은 수는 ${part.center}−8=${part.answer}` : `큰 수는 ${part.center}+8=${part.answer}`}입니다.`)).join(" "),
      meta: { dayOne, days, parts }
    });
  }
  return calendarBlockReverseB10({ difficulty: 1 });
}

// 십의 자리가 같고 일의 자리 합이 10 — 일의 자리 5끼리(35×35)도 섞은 판
function verticalProductHtml(items) {
  const cell = (item, i) => `<div style="display:grid;justify-items:end;gap:2px;min-width:78px;padding:8px 10px;border:1px solid #d8cfbd;border-radius:6px;background:#fff;${FONT};color:${INK}"><b style="justify-self:start;font-size:14px">${CIRCLED[i]}</b><span style="font-size:20px;font-weight:800;letter-spacing:5px">${item.first}</span><span style="font-size:20px;font-weight:800;letter-spacing:5px;border-bottom:2px solid ${INK};padding-left:8px">× ${item.second}</span><span style="display:block;width:64px;height:26px;margin-top:4px;border:1.5px dashed ${ACCENT}"></span></div>`;
  return `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:560px">${items.map(cell).join("")}</div>`;
}

function sameTensComplementSheetB10({ difficulty = 2 }) {
  const total = difficulty === 3 ? 6 : 4;
  const fives = difficulty === 1 ? 1 : 2;
  const items = [];
  const seen = new Set();
  while (items.length < total) {
    const five = items.filter((item) => item.five).length < fives && (items.length >= total - fives || Math.random() < 0.4);
    const tens = randomInt(difficulty === 1 ? 1 : 2, 9);
    const a = five ? 5 : pick([1, 2, 3, 4, 6, 7, 8, 9]);
    const first = tens * 10 + a;
    const second = tens * 10 + (10 - a);
    const key = [first, second].sort().join("x");
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ first, second, tens, a, b: 10 - a, five, result: first * second });
  }
  const ordered = shuffle(items);
  return problem("same-tens-complement-sheet-b10", {
    prompt: "십의 자리 숫자가 같고 일의 자리 숫자의 합이 10인 곱셈의 규칙을 찾아 간편하게 계산하세요.",
    visual: fig(verticalProductHtml(ordered)),
    answer: ordered.map((item, i) => `${CIRCLED[i]} ${item.result}`).join(", "),
    solution: `앞 두 자리는 (십의 자리)×(십의 자리+1), 뒤 두 자리는 (일의 자리 곱)입니다. ${ordered.map((item, i) => `${CIRCLED[i]} ${item.tens}×${item.tens + 1}=${item.tens * (item.tens + 1)}, ${item.a}×${item.b}=${String(item.a * item.b).padStart(2, "0")} → ${item.result}`).join(", ")}입니다.`,
    meta: { items: ordered }
  });
}

// 연속하는 두 자리 수 3(4)개 — 십의 자리 숫자 합만 주고 전체 합 묻기
function consecutiveTensDigitTotalB10({ difficulty = 2 }) {
  const count = difficulty === 3 ? pick([3, 4]) : 3;
  const groups = new Map();
  for (let start = 10; start <= 100 - count; start += 1) {
    const values = runOf(start, count);
    const tens = sum(values.map((v) => Math.floor(v / 10)));
    if (!groups.has(tens)) groups.set(tens, []);
    groups.get(tens).push(values);
  }
  const unique = [...groups.entries()].filter(([, list]) => list.length === 1 && list[0][0] >= (difficulty === 1 ? 10 : 20));
  const [tensSum, [values]] = pick(unique);
  const askLargest = difficulty === 2 && Math.random() < 0.35;
  const total = sum(values);
  const tens = values.map((v) => Math.floor(v / 10));
  const boxes = values.map(() => `${box("")}${box("")}`).join(" <b style=\"font-size:18px\">+</b> ");
  return problem("consecutive-tens-digit-total-b10", {
    prompt: `연속하는 ${KOR_COUNT[count]} 개의 두 자리 수가 있습니다. 이 수들의 십의 자리 숫자의 합이 ${tensSum}일 때, ${askLargest ? "가장 큰 수를" : `${KOR_COUNT[count]} 수의 합을`} 구하세요.`,
    visual: fig(htmlPanel(`<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px">${boxes}</div><div style="margin-top:8px;text-align:center">십의 자리 숫자의 합 = <b>${tensSum}</b></div>`, 420)),
    answer: askLargest ? values.at(-1) : total,
    solution: `십의 자리 숫자가 모두 같으면 합이 ${count}의 배수입니다. ${tensSum}은 ${count}의 배수가 아니므로 중간에 십의 자리가 바뀝니다. 십의 자리 숫자는 ${tens.join(", ")}이고 수는 ${values.join(", ")}이므로 ${askLargest ? `가장 큰 수는 ${values.at(-1)}` : `합은 ${total}`}입니다.`,
    meta: { count, tensSum, values, askLargest, total }
  });
}

// 끝 두 자리만 보이는 연속하는 세 수의 덧셈 — 작은 문제 셋
function maskedAdditionHtml(tail, i) {
  const pair = () => `${box("", "width:28px;height:30px")}${box("", "width:28px;height:30px")}`;
  const row = (inner, plus = false) => `<div style="display:flex;justify-content:flex-end;align-items:center;gap:4px">${plus ? '<b style="font-size:18px;margin-right:4px">+</b>' : ""}${inner}</div>`;
  const digits = String(tail).padStart(2, "0").split("").map((d) => `<span style="display:inline-grid;place-items:center;width:30px;height:30px;font-size:20px;font-weight:800">${d}</span>`).join("");
  return `<div style="display:grid;gap:4px;padding:8px 10px;border:1px solid #d8cfbd;border-radius:6px;background:#fff;${FONT};color:${INK}"><b style="font-size:14px">${PARTS[i]}</b>${row(pair())}${row(pair())}${row(pair(), true)}<span style="display:block;height:2px;background:${INK}"></span>${row(`${box("", "width:28px;height:30px")}${digits}`)}</div>`;
}

function consecutiveMaskedTripleB10() {
  const tails = shuffle(range(0, 94).filter((t) => t % 3 !== 0));
  const chosen = [];
  for (const t of tails) {
    if (chosen.length === 3) break;
    const hundred = t % 3 === 2 ? 1 : 2;
    if (chosen.length === 2 && chosen.every((item) => item.hundred === hundred)) continue;
    chosen.push({ tail: t, hundred });
  }
  const parts = chosen.map(({ tail, hundred }) => {
    const total = hundred * 100 + tail;
    const middle = total / 3;
    return { tail, hundred, total, values: [middle - 1, middle, middle + 1] };
  });
  return problem("consecutive-masked-triple-b10", {
    prompt: "다음은 연속하는 두 자리 수 세 개의 덧셈입니다. 빈칸에 알맞은 숫자를 써넣으세요. 합의 백의 자리 숫자는 0이 아닙니다.",
    visual: fig(`<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center">${parts.map((part, i) => maskedAdditionHtml(part.tail, i)).join("")}</div>`),
    answer: parts.map((part, i) => `${PARTS[i]} ${part.values.join(" + ")} = ${part.total}`).join(" / "),
    solution: `연속하는 세 수의 합은 가운데 수의 3배라서 3의 배수입니다. ${parts.map((part, i) => `${PARTS[i]} 1${String(part.tail).padStart(2, "0")}${hasBatchim(part.tail) ? "과" : "와"} 2${String(part.tail).padStart(2, "0")} 중 3의 배수는 ${part.total}이고 가운데 수는 ${part.total}÷3=${part.values[1]}`).join(". ")}입니다.`,
    meta: { parts }
  });
}
