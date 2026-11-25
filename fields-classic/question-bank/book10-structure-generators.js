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

// ── 2단원 따라잡기 ─────────────────────────────────────
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const TOKENS = [
  { token: "●", name: "동그라미", color: "#d9792c" },
  { token: "▲", name: "세모", color: "#2581a0" },
  { token: "■", name: "네모", color: "#5f8a32" },
  { token: "★", name: "별", color: "#b0466a" }
];
const wa = (n) => `${n}${hasBatchim(n) ? "과" : "와"}`;
const wIga = (word) => `${word}${wordBatchim(word) ? "이" : "가"}`;
const piece = (s) => `<b style="color:${s.color};font-size:24px;line-height:1">${s.token}</b>`;
const tile = (label, color = ACCENT) => `<span style="display:inline-grid;place-items:center;min-width:40px;height:28px;padding:0 6px;border:1.5px solid ${color};border-radius:6px;background:#fff;color:${color};font-size:14px;font-weight:800">${label}</span>`;
// 저울 줄: [{ items: [html...], total }]
function scaleRowsHtml(rows, unit = "g", width = 520) {
  const line = (r) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 4px;border-bottom:1px dashed #d8cfbd"><span style="display:flex;flex-wrap:wrap;gap:5px;align-items:center">${r.items.join("")}</span><b style="white-space:nowrap;font-size:17px">= ${r.total}${unit}</b></div>`;
  return htmlPanel(rows.map(line).join(""), width);
}
const piecesOf = (shapes, counts) => counts.flatMap((n, i) => Array.from({ length: n }, () => piece(shapes[i])));
const valuesText = (shapes, values, unit = "") => shapes.map((s, i) => `${s.name}=${values[i]}${unit}`).join(", ");

// 두 모양 저울 — 개수 짝 (1,1)/(1,2) · (1,2)/(2,1) · (1,3)/(3,1), 둘 다 묻기
const COMBOS = [[[1, 1], [1, 2]], [[1, 2], [2, 1]], [[1, 3], [3, 1]]];
function twoSymbolComboB10({ difficulty = 2 }) {
  const combo = difficulty === 1 ? COMBOS[0] : difficulty === 2 ? pick(COMBOS.slice(0, 2)) : pick(COMBOS.slice(1));
  const hi = difficulty === 3 ? 30 : difficulty === 2 ? 18 : 12;
  let a, b;
  do { a = randomInt(2, hi); b = randomInt(2, hi); } while (a === b);
  const shapes = shuffle(TOKENS).slice(0, 2);
  const totals = combo.map(([x, y]) => x * a + y * b);
  const [A, B] = totals;
  const [s0, s1] = shapes;
  let steps;
  if (combo === COMBOS[0]) {
    steps = `둘째 저울에는 첫째 저울보다 ${wIga(s1.name)} 하나 더 있습니다. ${s1.name} = ${B} - ${A} = ${b}. ${s0.name} = ${A} - ${b} = ${a}.`;
  } else {
    const k = combo[0][0] + combo[0][1];
    const pair = (A + B) / k;
    const extra = combo[0][1] - 1;
    steps = `두 저울을 합치면 ${wWa(s0.name)} ${wIga(s1.name)} ${k}개씩이라 ${s0.name} 하나와 ${s1.name} 하나의 합은 (${A} + ${B}) ÷ ${k} = ${pair}입니다. 첫째 저울에서 ${eul(pair)} 빼면 ${s1.name} ${extra}개 = ${A - pair}${extra > 1 ? `, ${s1.name} = ${A - pair} ÷ ${extra} = ${b}` : ` → ${s1.name} = ${b}`}. ${s0.name} = ${pair} - ${b} = ${a}.`;
  }
  return problem("two-symbol-combo-b10", {
    prompt: "같은 모양은 무게가 같습니다. 두 저울을 보고 두 모양의 무게를 각각 구하세요.",
    visual: fig(scaleRowsHtml(combo.map((counts, i) => ({ items: piecesOf(shapes, counts), total: totals[i] })))),
    answer: valuesText(shapes, [a, b], "g"),
    solution: steps,
    meta: { coefficients: combo, totals, values: [a, b] }
  });
}

// 과녁 (2,1)/(1,1) → 한 칸 점수
function targetSvg(colors) {
  return `${svgOpen(110, 110, "두 칸 과녁")}<circle cx="55" cy="55" r="50" style="fill:${colors[1]};stroke:${LINE}"/><circle cx="55" cy="55" r="24" style="fill:${colors[0]};stroke:${LINE}"/></svg>`;
}
function targetOneScoreB10({ difficulty = 2 }) {
  const zones = [{ name: "노란 칸", color: "#ffd98a" }, { name: "파란 칸", color: "#b9d7ec" }];
  const hi = difficulty === 3 ? 40 : difficulty === 2 ? 20 : 12;
  let x, y;
  do { x = randomInt(3, hi); y = randomInt(2, hi); } while (x === y);
  const twiceZone = randomInt(0, 1);
  const hits = [twiceZone === 0 ? [2, 1] : [1, 2], [1, 1]];
  const values = [x, y];
  const totals = hits.map(([p, q]) => p * x + q * y);
  const ask = difficulty === 1 ? twiceZone : randomInt(0, 1);
  const order = shuffle([0, 1]);
  const diff = totals[0] - totals[1];
  const other = 1 - twiceZone;
  const lines = order.map((i) => `<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 2px;border-bottom:1px dashed #d8cfbd"><span>${MARKS[i]} ${zones[0].name} ${hits[i][0]}번, ${zones[1].name} ${hits[i][1]}번</span><b>${totals[i]}점</b></div>`).join("");
  const askName = zones[ask].name;
  const result = values[ask];
  const solution = `두 기록을 견주면 ${MARKS[0]}에는 ${wIga(zones[twiceZone].name)} 한 번 더 있습니다. ${zones[twiceZone].name} = ${totals[0]} - ${totals[1]} = ${diff}점.${ask === twiceZone ? "" : ` ${zones[other].name} = ${totals[1]} - ${diff} = ${values[other]}점.`}`;
  return problem("target-one-score-b10", {
    prompt: `과녁의 같은 칸은 맞힐 때마다 점수가 같습니다. 두 기록을 보고 ${askName} 한 번의 점수를 구하세요.`,
    visual: fig(`<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center">${targetSvg(zones.map((z) => z.color))}${htmlPanel(lines, 340)}</div>`),
    answer: `${result}점`,
    solution,
    meta: { values, hits, totals, ask }
  });
}

// m● + n▲ = A, ● + n▲ = B (공통 묶음) → 둘 다
function sharedTermThreeTwoB10({ difficulty = 2 }) {
  const m = difficulty === 3 ? pick([3, 4, 5]) : 3;
  const n = difficulty === 3 ? pick([2, 3]) : 2;
  const hi = difficulty === 3 ? 25 : difficulty === 2 ? 15 : 10;
  let a, b;
  do { a = randomInt(2, hi); b = randomInt(2, hi); } while (a === b);
  const shapes = shuffle(TOKENS).slice(0, 2);
  const coefficients = [[m, n], [1, n]];
  const totals = coefficients.map(([x, y]) => x * a + y * b);
  const order = randomInt(0, 1) ? [0, 1] : [1, 0];
  const [s0, s1] = shapes;
  const solution = `두 저울은 ${s1.name} ${n}개가 같고 ${s0.name}만 ${m - 1}개 다릅니다. ${s0.name} ${m - 1}개 = ${totals[0]} - ${totals[1]} = ${totals[0] - totals[1]} → ${s0.name} = ${a}. 둘째 저울에서 ${s1.name} ${n}개 = ${totals[1]} - ${a} = ${totals[1] - a} → ${s1.name} = ${b}.`;
  return problem("shared-term-three-two-b10", {
    prompt: "같은 모양은 무게가 같습니다. 두 저울을 보고 두 모양의 무게를 각각 구하세요.",
    visual: fig(scaleRowsHtml(order.map((i) => ({ items: piecesOf(shapes, coefficients[i]), total: totals[i] })))),
    answer: valuesText(shapes, [a, b], "g"),
    solution,
    meta: { coefficients, totals, values: [a, b] }
  });
}

// 그릇 + x, 그릇 + 2x → 그릇
const HOLDERS = [["그릇", "사과"], ["바구니", "배"], ["상자", "공책"], ["가방", "책"], ["접시", "떡"]];
function containerPlusContentB10({ difficulty = 2 }) {
  const [holder, item] = pick(HOLDERS);
  const pairs = difficulty === 1 ? [[1, 2]] : difficulty === 2 ? [[1, 2], [2, 4], [3, 6]] : [[2, 3], [1, 3], [2, 5], [3, 5]];
  const [c1, c2] = pick(pairs);
  const each = randomInt(difficulty === 1 ? 5 : 8, difficulty === 3 ? 40 : 25) * 10;
  const holderWeight = randomInt(5, difficulty === 3 ? 60 : 40) * 10;
  const totals = [holderWeight + c1 * each, holderWeight + c2 * each];
  const extra = c2 - c1;
  const rows = [c1, c2].map((count, i) => ({ items: [tile(holder), ...Array.from({ length: count }, () => tile(item, "#b0466a"))], total: totals[i] }));
  return problem("container-plus-content-b10", {
    prompt: `같은 ${holder}에 무게가 같은 ${wEul(item)} ${c1}개, ${c2}개 담아 무게를 쟀습니다. 빈 ${holder}의 무게는 몇 g인가요?`,
    visual: fig(scaleRowsHtml(rows)),
    answer: `${holderWeight}g`,
    solution: `더 담은 ${item} ${extra}개의 무게는 ${totals[1]} - ${totals[0]} = ${extra * each}g이므로 ${item} 한 개는 ${each}g입니다. 빈 ${holder} = ${totals[0]} - ${c1 * each} = ${holderWeight}g.`,
    meta: { holder, item, counts: [c1, c2], each, holderWeight, totals }
  });
}

// 닫힌 둘레 — 간격을 바꿨을 때 개수 차 → 처음 개수·둘레 (셋째 간격 개수)
function ringSvg(label) {
  return `${svgOpen(240, 150, label)}<ellipse cx="120" cy="75" rx="104" ry="58" style="fill:#e6efe0;stroke:${ACCENT};stroke-width:2.5;stroke-dasharray:3 9;stroke-linecap:round"/>${text(120, 82, "둘레 ? m", 17, 'font-weight="700"')}</svg>`;
}
const PLACES = [["연못", "말뚝"], ["둥근 꽃밭", "팻말"], ["운동장", "깃발"], ["호수", "가로등"]];
function perimeterSpacingReverse(difficulty, third) {
  const [place, thing] = pick(PLACES);
  const gapPool = difficulty === 1 ? [[2, 3], [2, 4], [3, 4]] : [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [4, 6], [3, 6], [5, 6], [4, 10], [6, 8]];
  const [g1, g2] = pick(gapPool);
  const block = lcm(g1, g2);
  const per = block / g1 - block / g2;
  const k = randomInt(2, difficulty === 3 ? 8 : 5);
  const perimeter = block * k;
  if (perimeter > 300) return perimeterSpacingReverse(difficulty, third);
  const d = per * k;
  const first = perimeter / g1;
  let g3 = null;
  if (third) {
    const options = range(2, 12).filter((g) => g !== g1 && g !== g2 && perimeter % g === 0);
    if (!options.length) return perimeterSpacingReverse(difficulty, third);
    g3 = pick(options);
  }
  const answer = `처음 ${first}개, 둘레 ${perimeter}m${third ? `, ${g3}m 간격 ${perimeter / g3}개` : ""}`;
  return {
    prompt: `${place} 둘레에 ${g1}m 간격으로 ${wEul(thing)} 세우려다 ${g2}m 간격으로 바꾸었더니 ${wIga(thing)} ${d}개 덜 들었습니다. 처음에 세우려던 ${thing} 수와 ${place} 둘레를 구하세요.${third ? ` 같은 둘레에 ${g3}m 간격으로 세우면 몇 개가 드나요?` : ""}`,
    visual: fig(ringSvg(`${place} 둘레`)),
    answer,
    solution: `닫힌 둘레는 (둘레 ÷ 간격)개가 듭니다. ${wa(g1)} ${g2}의 공배수 ${block}m마다 ${g1}m 간격은 ${block / g1}개, ${g2}m 간격은 ${block / g2}개라 ${per}개씩 차이 납니다. ${d}개 차이면 ${block}m가 ${d} ÷ ${per} = ${k}번 → 둘레 ${perimeter}m, 처음 ${perimeter} ÷ ${g1} = ${first}개.${third ? ` ${g3}m 간격이면 ${perimeter} ÷ ${g3} = ${perimeter / g3}개.` : ""}`,
    meta: { g1, g2, g3, d, perimeter, first }
  };
}
function perimeterSpacingReverseB10({ difficulty = 2 }) { return problem("perimeter-spacing-reverse-b10", perimeterSpacingReverse(difficulty, false)); }
function perimeterSpacingThirdB10({ difficulty = 3 }) { return problem("perimeter-spacing-third-b10", perimeterSpacingReverse(Math.max(2, difficulty), true)); }

// 같은 돈 — 싼 것을 몇 개 더 → 가진 돈·비싼 것 개수
const GOODS = [["공책", "권"], ["연필", "자루"], ["지우개", "개"], ["빵", "개"], ["색종이 묶음", "묶음"]];
function sameBudgetReverseB10({ difficulty = 2 }) {
  const [goods, unitWord] = pick(GOODS);
  const pricePool = difficulty === 1 ? [[400, 200], [600, 300], [500, 400]] : [[800, 600], [900, 600], [700, 500], [800, 500], [1200, 800], [1000, 600], [600, 400], [1500, 1000]];
  const [p1, p2] = pick(pricePool);
  const block = lcm(p1, p2);
  const per = block / p2 - block / p1;
  const k = randomInt(2, difficulty === 3 ? 6 : 4);
  const budget = block * k;
  const d = per * k;
  const expensive = budget / p1;
  return problem("same-budget-reverse-b10", {
    prompt: `가진 돈으로 한 ${unitWord}에 ${p1}원인 ${wEul(goods)} 사도, 한 ${unitWord}에 ${p2}원인 ${wEul(goods)} 사도 돈이 남지 않습니다. ${p2}원짜리를 ${d}${unitWord} 더 살 수 있을 때 가진 돈과 ${p1}원짜리 ${goods} 수를 구하세요.`,
    visual: fig(htmlPanel(`<table style="border-collapse:collapse;width:100%;text-align:center"><tr><th style="padding:6px;border-bottom:1px solid ${LINE}">한 ${unitWord} 값</th><th style="padding:6px;border-bottom:1px solid ${LINE}">살 수 있는 수</th></tr><tr><td style="padding:6px">${p1}원</td><td>?</td></tr><tr><td style="padding:6px">${p2}원</td><td>? (${d}${unitWord} 더)</td></tr><tr><td colspan="2" style="padding:6px;border-top:1px solid ${LINE}">가진 돈 ? 원</td></tr></table>`, 360)),
    answer: `가진 돈 ${budget}원, ${p1}원짜리 ${expensive}${unitWord}`,
    solution: `${wa(p1)} ${p2}의 공배수 ${block}원마다 ${p1}원짜리는 ${block / p1}${unitWord}, ${p2}원짜리는 ${block / p2}${unitWord}${wordBatchim(unitWord) ? "이라" : "라"} ${per}${unitWord}씩 차이 납니다. ${d}${unitWord} 차이면 ${block}원이 ${k}번 → 가진 돈 ${budget}원, ${p1}원짜리는 ${budget} ÷ ${p1} = ${expensive}${unitWord}.`,
    meta: { p1, p2, d, budget, expensive }
  });
}

// 사람이 더 와서(빠져서) 몫이 바뀜 → 처음 인원·전체
const SHARE_THINGS = ["사탕", "구슬", "색종이", "딱지", "스티커"];
function newPeopleReverseB10({ difficulty = 2 }) {
  const thing = pick(SHARE_THINGS);
  const leave = difficulty === 3 && randomInt(0, 2) === 0;
  for (let tries = 0; tries < 200; tries += 1) {
    const change = randomInt(1, difficulty === 1 ? 2 : 4);
    const delta = randomInt(1, difficulty === 1 ? 2 : 4);
    const small = randomInt(2, difficulty === 3 ? 12 : 8);
    // 더 옴: 처음 n명 × (small+delta) = (n+change) × small → n = change×small÷delta
    // 빠짐: 처음 n명 × small = (n−change) × (small+delta) → n = change×(small+delta)÷delta
    const numerator = leave ? change * (small + delta) : change * small;
    if (numerator % delta) continue;
    const first = numerator / delta;
    if (first < 3 || first > 30 || (leave && first - change < 2)) continue;
    const before = leave ? small : small + delta;
    const after = leave ? small + delta : small;
    const total = first * before;
    if (total > 400) continue;
    const prompt = leave
      ? `몇 명이 ${wEul(thing)} 한 사람에게 ${before}개씩 남김없이 나누어 가지려 했는데 ${change}명이 빠져서 한 사람에게 ${after}개씩 남김없이 나누어 가졌습니다. 처음 사람 수와 ${thing} 수를 구하세요.`
      : `몇 명이 ${wEul(thing)} 한 사람에게 ${before}개씩 남김없이 나누어 가지려 했는데 ${change}명이 더 와서 한 사람에게 ${after}개씩 남김없이 나누어 가졌습니다. 처음 사람 수와 ${thing} 수를 구하세요.`;
    const solution = leave
      ? `빠진 ${change}명 몫 ${change} × ${before} = ${change * before}개를 남은 사람이 한 명에 ${delta}개씩 더 가졌습니다. 남은 사람 = ${change * before} ÷ ${delta} = ${first - change}명, 처음 = ${first}명, ${thing} = ${first} × ${before} = ${total}개.`
      : `처음 사람들이 한 명에 ${delta}개씩 내놓아 새로 온 ${change}명에게 ${after}개씩, 모두 ${change} × ${after} = ${change * after}개를 주었습니다. 처음 사람 = ${change * after} ÷ ${delta} = ${first}명, ${thing} = ${first} × ${before} = ${total}개.`;
    const head = `<tr><th></th><th style="padding:6px;border-bottom:1px solid ${LINE}">사람 수</th><th style="padding:6px;border-bottom:1px solid ${LINE}">한 사람 몫</th></tr>`;
    const table = `<table style="border-collapse:collapse;width:100%;text-align:center">${head}<tr><th style="padding:6px">처음</th><td>?명</td><td>${before}개</td></tr><tr><th style="padding:6px">나중</th><td>${leave ? `${change}명 빠짐` : `${change}명 더 옴`}</td><td>${after}개</td></tr></table>`;
    return problem("new-people-reverse-b10", {
      prompt, visual: fig(htmlPanel(table, 360)),
      answer: `처음 ${first}명, ${thing} ${total}개`,
      solution,
      meta: { leave, change, before, after, first, total }
    });
  }
  return newPeopleReverseB10({ difficulty });
}

// 둘씩 평균 → 세 값
const AVG_SETS = [
  { names: ["국어", "수학", "과학"], unit: "점", lo: 60, hi: 100, what: "세 과목 점수", pairWord: "두 과목씩" },
  { names: ["민지", "서준", "하은"], unit: "kg", lo: 24, hi: 40, what: "세 사람의 몸무게", pairWord: "두 사람씩" },
  { names: ["빨간 상자", "파란 상자", "노란 상자"], unit: "kg", lo: 6, hi: 30, what: "세 상자의 무게", pairWord: "두 상자씩" }
];
function pairAveragesB10({ difficulty = 2 }) {
  const set = pick(AVG_SETS);
  const parity = randomInt(0, 1);
  const pool = shuffle(range(set.lo, set.hi).filter((v) => v % 2 === parity));
  const values = pool.slice(0, 3);
  const pairs = [[0, 1], [1, 2], [0, 2]];
  const averages = pairs.map(([i, j]) => (values[i] + values[j]) / 2);
  const total = sum(values);
  const lines = pairs.map(([i, j], k) => `<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 2px;border-bottom:1px dashed #d8cfbd"><span>${set.names[i]}·${set.names[j]}의 평균</span><b>${averages[k]}${set.unit}</b></div>`).join("");
  return problem("pair-averages-b10", {
    prompt: `${set.what}${wordBatchim(set.what) ? "을" : "를"} ${set.pairWord} 묶어 평균을 냈습니다. ${set.names.join(", ")}의 값을 각각 구하세요.`,
    visual: fig(htmlPanel(lines, 380)),
    answer: set.names.map((n, i) => `${n}=${values[i]}${set.unit}`).join(", "),
    solution: `평균 × 2 = 두 값의 합: ${averages.map((v) => v * 2).join(", ")}. 세 합을 더하면 셋의 합의 2배 → 셋의 합 = ${averages.map((v) => v * 2).join(" + ")} = ${total * 2}, ÷ 2 = ${total}. ${pairs.map(([i, j], k) => `${set.names[3 - i - j]} = ${total} - ${averages[k] * 2} = ${values[3 - i - j]}`).join(", ")}.`,
    meta: { values, averages }
  });
}

// 접시에 2~5개 섞인 네 모양 — 하나씩 새 모양이 들어가는 이어진 식
function mixedPlateWeightsB10({ difficulty = 2 }) {
  const hi = difficulty === 3 ? 16 : 12;
  const values = shuffle(range(2, hi)).slice(0, 4);
  const shapes = TOKENS.slice();
  const plates = [];
  for (let k = 0; k < 4; k += 1) {
    const size = k + 2;
    const counts = [0, 0, 0, 0];
    if (k === 0) counts[0] = size;
    else {
      counts[k] = randomInt(1, Math.min(2, size - 1));
      for (let r = counts[k]; r < size; r += 1) counts[randomInt(0, k - 1)] += 1;
    }
    plates.push(counts);
  }
  const totals = plates.map((c) => sum(c.map((n, i) => n * values[i])));
  const order = shuffle([0, 1, 2, 3]);
  const rows = order.map((k) => ({ items: shuffle(piecesOf(shapes, plates[k])), total: totals[k] }));
  const steps = plates.map((c, k) => {
    const known = c.map((n, i) => (i !== k && n ? `${shapes[i].name} ${n}개(${n * values[i]})` : "")).filter(Boolean);
    const rest = totals[k] - sum(c.map((n, i) => (i !== k ? n * values[i] : 0)));
    return `${known.length ? `${totals[k]}에서 ${known.join("·")}를 빼면 ` : ""}${shapes[k].name} ${c[k]}개 = ${rest}${c[k] > 1 ? ` → ${shapes[k].name} = ${values[k]}` : ""}`;
  });
  return problem("mixed-plate-weights-b10", {
    prompt: "같은 모양은 무게가 같습니다. 네 접시를 보고 네 모양의 무게를 각각 구하세요.",
    visual: fig(scaleRowsHtml(rows)),
    answer: valuesText(shapes, values, "g"),
    solution: `한 가지 모양만 있는 접시부터 풀고, 아는 모양을 빼며 한 모양씩 찾습니다. ${steps.join(". ")}.`,
    meta: { plates, totals, values }
  });
}

// ── 3단원 조건에 맞는 수 ─────────────────────────────────
const cardsHtml = (values) => `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:6px 0">${values.map((v) => `<span style="display:inline-grid;place-items:center;width:44px;height:58px;border:2px solid ${ACCENT};border-radius:7px;background:#fff;color:${INK};${FONT};font-size:26px;font-weight:800">${v}</span>`).join("")}</div>`;
const numberOf = (digits) => Number(digits.join(""));
const makeNumbers = (cards, length, repeat = false) => {
  const out = new Set();
  const walk = (chosen, left) => {
    if (chosen.length === length) { if (chosen[0] !== 0) out.add(numberOf(chosen)); return; }
    left.forEach((d, i) => walk([...chosen, d], repeat ? left : left.filter((_, j) => j !== i)));
  };
  walk([], cards);
  return [...out].sort((a, b) => a - b);
};
const digitPool = (count, withZero) => {
  const nonzero = shuffle(range(1, 9)).slice(0, withZero ? count - 1 : count);
  return (withZero ? [0, ...nonzero] : nonzero).sort((a, b) => a - b);
};
const NUM_WORD = { 2: "두", 3: "세", 4: "네", 5: "다섯" };

// 카드로 만들 수 있는 수 모두 쓰기 (0 포함·카드 모두 쓰기)
function digitCardsListAllB10({ difficulty = 2 }) {
  const modes = difficulty === 1 ? ["three-all"] : difficulty === 2 ? ["three-all", "three-zero", "four-two"] : ["three-zero", "four-two", "four-two-zero"];
  const mode = pick(modes);
  const withZero = mode.includes("zero");
  const cardCount = mode.startsWith("three") ? 3 : 4;
  const length = mode.startsWith("three") ? 3 : 2;
  const cards = digitPool(cardCount, withZero);
  const numbers = makeNumbers(cards, length);
  const useAll = cardCount === length;
  return problem("digit-cards-list-all-b10", {
    prompt: `숫자 카드 ${NUM_WORD[cardCount]} 장${useAll ? "을 모두 한 번씩 써서" : ` 중 ${NUM_WORD[length]} 장을 골라 한 번씩 써서`} 만들 수 있는 ${NUM_WORD[length]} 자리 수를 모두 쓰세요.`,
    visual: fig(cardsHtml(cards)),
    answer: numbers.join(", "),
    solution: `가장 높은 자리에 올 숫자부터 차례로 정하고(0은 맨 앞에 올 수 없음), 남은 카드로 다음 자리를 채웁니다. ${cards.filter((d) => d !== 0).map((d) => `${ro(d)} 시작: ${numbers.filter((n) => String(n)[0] === String(d)).join(", ")}`).join(" / ")} → 모두 ${numbers.length}개.`,
    meta: { cards, length, numbers }
  });
}

// 카드 개수 세기 — 카드 모두 쓰기 · 0 포함 · 6장
function digitCardsCountB10({ difficulty = 2 }) {
  const options = difficulty === 1
    ? [[4, 3, false], [4, 4, false], [4, 2, true]]
    : difficulty === 2 ? [[4, 4, false], [4, 3, true], [5, 3, true], [6, 2, false], [6, 2, true], [4, 4, true]]
      : [[6, 3, false], [6, 3, true], [5, 4, true], [6, 2, true], [5, 5, false]];
  const [cardCount, length, withZero] = pick(options);
  const cards = digitPool(cardCount, withZero);
  const numbers = makeNumbers(cards, length);
  const useAll = cardCount === length;
  const firstChoices = cardCount - (withZero ? 1 : 0);
  const rest = range(1, length - 1).map((i) => cardCount - i);
  return problem("digit-cards-count-b10", {
    prompt: `숫자 카드 ${cardCount}장${useAll ? "을 모두 한 번씩 써서" : ` 중 ${length}장을 골라 한 번씩 써서`} 만들 수 있는 ${length}자리 수는 모두 몇 개인가요?`,
    visual: fig(cardsHtml(cards)),
    answer: `${numbers.length}개`,
    solution: `맨 앞자리에 올 수 있는 카드는 ${firstChoices}장${withZero ? "(0은 안 됨)" : ""}, 그다음 자리부터는 쓴 카드를 빼고 ${rest.join(", ")}장씩 → ${[firstChoices, ...rest].join(" × ")} = ${numbers.length}개.`,
    meta: { cards, length, count: numbers.length }
  });
}

// 자리 숫자가 한 방향으로 — 모두 쓰기 (+ 어떤 수보다 크다/작다)
function monotoneList(difficulty, bounded) {
  const length = 3;
  const cardCount = difficulty === 1 ? 4 : 5;
  const cards = digitPool(cardCount, difficulty === 3 && randomInt(0, 1) === 0);
  const increasing = randomInt(0, 1) === 1;
  let numbers = combinations(cards, length).map((c) => {
    const s = c.slice().sort((a, b) => (increasing ? a - b : b - a));
    return s[0] === 0 ? null : numberOf(s);
  }).filter(Boolean).sort((a, b) => a - b);
  let condition = "";
  let bound = null;
  let above = null;
  if (bounded) {
    const mid = numbers[Math.floor(numbers.length / 2)];
    bound = Math.round(mid / 10) * 10 + pick([0, 5]);
    above = randomInt(0, 1) === 1;
    const kept = numbers.filter((n) => (above ? n > bound : n < bound));
    if (kept.length < 2 || kept.length > 8 || kept.length === numbers.length) return monotoneList(difficulty, bounded);
    condition = ` 중 ${bound}보다 ${above ? "큰" : "작은"} 수`;
    numbers = kept;
  }
  return {
    prompt: `숫자 카드 중 ${NUM_WORD[length]} 장을 골라 왼쪽부터 숫자가 점점 ${increasing ? "커지는" : "작아지는"} 세 자리 수를 만들려고 합니다. 만들 수 있는 수${condition ? condition : ""}를 모두 쓰세요.`,
    visual: fig(cardsHtml(cards)),
    answer: numbers.join(", "),
    solution: `카드 세 장을 고르면 ${increasing ? "작은" : "큰"} 숫자부터 놓는 방법은 하나뿐입니다. 세 장 고르기를 빠짐없이 적고${increasing ? "" : "(0은 맨 뒤에만)"} 수로 만듭니다${bounded ? `. 그중 ${bound}보다 ${above ? "큰" : "작은"} 것만 남깁니다` : ""}: ${numbers.join(", ")}.`,
    meta: { cards, increasing, bound, above, numbers }
  };
}
function monotoneDigitListB10({ difficulty = 2 }) { return problem("monotone-digit-list-b10", monotoneList(difficulty, false)); }
function monotoneDigitListBoundB10({ difficulty = 2 }) { return problem("monotone-digit-list-bound-b10", monotoneList(difficulty, true)); }

// 0 아닌 숫자 2~3개를 여러 번 써서 만드는 3~5자리 수의 개수
function repeatedNonzeroDigitCountB10({ difficulty = 2 }) {
  const kinds = difficulty === 1 ? 2 : randomInt(2, 3);
  const length = difficulty === 1 ? 3 : difficulty === 2 ? randomInt(3, 4) : randomInt(4, 5);
  const digits = shuffle(range(1, 9)).slice(0, kinds).sort((a, b) => a - b);
  const total = kinds ** length;
  const digitText = digits.length === 2 ? `${wa(digits[0])} ${digits[1]}` : `${digits[0]}, ${wa(digits[1])} ${digits[2]}`;
  return problem("repeated-nonzero-digit-count-b10", {
    prompt: `숫자 ${digitText}만 여러 번 써서 만들 수 있는 ${length}자리 수는 모두 몇 개인가요? (같은 숫자를 몇 번 써도 되고, 쓰지 않는 숫자가 있어도 됩니다.)`,
    visual: fig(cardsHtml(digits)),
    answer: `${total}개`,
    solution: `자리마다 ${kinds}가지씩 고를 수 있습니다(0이 없으니 맨 앞자리도 ${kinds}가지). ${Array.from({ length }, () => kinds).join(" × ")} = ${total}개.`,
    meta: { digits, length, total }
  });
}

// 1부터 n까지 카드에서 3장(4장)으로 합 S — 묶음 모두 쓰기
function cardSetTargetSumAllB10({ difficulty = 2 }) {
  for (let tries = 0; tries < 300; tries += 1) {
    const n = difficulty === 1 ? randomInt(6, 7) : difficulty === 2 ? randomInt(7, 9) : randomInt(8, 10);
    const pickCount = difficulty === 3 ? pick([3, 4]) : difficulty === 2 ? pick([3, 3, 4]) : 3;
    const cards = range(1, n);
    const all = combinations(cards, pickCount);
    const target = sum(pick(all));
    const sets = all.filter((c) => sum(c) === target);
    const lo = difficulty === 1 ? 2 : 3;
    const hi = difficulty === 1 ? 4 : 7;
    if (sets.length < lo || sets.length > hi) continue;
    return problem("card-set-target-sum-all-b10", {
      prompt: `1부터 ${n}까지 수 카드가 한 장씩 있습니다. 서로 다른 카드 ${pickCount}장을 골라 합이 ${target}${hasBatchim(target) ? "이" : "가"} 되게 하는 방법을 모두 쓰세요.`,
      visual: fig(cardsHtml(cards)),
      answer: sets.map((s) => `(${s.join(", ")})`).join(", "),
      solution: `가장 작은 카드를 1, 2, 3 … 으로 정해 두고 나머지 카드는 커지는 차례로 맞춥니다(같은 묶음을 두 번 세지 않게). ${sets.map((s) => `${s.join(" + ")} = ${target}`).join(", ")} → 모두 ${sets.length}가지.`,
      meta: { n, pickCount, target, sets }
    });
  }
  return cardSetTargetSumAllB10({ difficulty });
}

// 자리 숫자의 합이 같은 세 자리 수를 큰 수부터 — k번째
function digitSumRankedLargeB10({ difficulty = 2 }) {
  for (let tries = 0; tries < 100; tries += 1) {
    const target = randomInt(difficulty === 1 ? 20 : 8, difficulty === 1 ? 25 : 22);
    const list = range(100, 999).filter((v) => sum(String(v).split("").map(Number)) === target).sort((a, b) => b - a);
    const rank = randomInt(difficulty === 1 ? 3 : 5, Math.min(difficulty === 3 ? 18 : 12, list.length - 1));
    if (list.length < rank + 1) continue;
    const answer = list[rank - 1];
    const firstHundreds = list.filter((v) => Math.floor(v / 100) === Math.floor(list[0] / 100)).length;
    return problem("digit-sum-ranked-large-b10", {
      prompt: `각 자리 숫자의 합이 ${target}인 세 자리 수를 큰 수부터 차례로 쓸 때 ${rank}번째 수를 구하세요.`,
      visual: fig(htmlPanel(`<div style="text-align:center">백 + 십 + 일 = <b>${target}</b> &nbsp;·&nbsp; 큰 수부터 ${rank}번째 = ${box("?", "min-width:54px")}</div>`, 420)),
      answer: String(answer),
      solution: `백의 자리를 가장 크게 두고 십의 자리를 큰 것부터 내려갑니다. 백의 자리가 ${Math.floor(list[0] / 100)}인 수가 ${firstHundreds}개(${list.slice(0, firstHundreds).join(", ")}), 이어서 차례로 세면 ${rank}번째는 ${answer}입니다.`,
      meta: { target, rank, answer }
    });
  }
  return digitSumRankedLargeB10({ difficulty });
}

// 이웃한 자리 숫자가 같은 간격으로 커지는(작아지는) 수 — 위 한도 없음
function equalStepDigitNumbersB10({ difficulty = 2 }) {
  const length = difficulty === 3 ? pick([3, 4]) : 3;
  const increasing = randomInt(0, 1) === 1;
  const all = range(10 ** (length - 1), 10 ** length - 1).filter((v) => {
    const d = String(v).split("").map(Number);
    const step = d[1] - d[0];
    return step !== 0 && (increasing ? step > 0 : step < 0) && d.every((x, i) => i === 0 || x - d[i - 1] === step);
  });
  const listMode = difficulty === 1 || randomInt(0, 2) === 0;
  let numbers = all;
  let gapText = "";
  if (listMode) {
    const gapOf = (v) => Math.abs(Number(String(v)[1]) - Number(String(v)[0]));
    const steps = [...new Set(all.map(gapOf))].filter((g) => all.filter((v) => gapOf(v) === g).length >= 2);
    const gap = pick(steps);
    numbers = all.filter((v) => Math.abs(Number(String(v)[1]) - Number(String(v)[0])) === gap);
    gapText = ` 중 이웃한 숫자의 차가 ${gap}인 수`;
  } else {
    const minGap = pick([1, 1, 2, 3]);
    if (minGap > 1) {
      numbers = all.filter((v) => Math.abs(Number(String(v)[1]) - Number(String(v)[0])) >= minGap);
      gapText = ` 중 이웃한 숫자의 차가 ${minGap} 이상인 수`;
    }
  }
  const word = increasing ? "커지는" : "작아지는";
  return problem("equal-step-digit-numbers-b10", {
    prompt: `왼쪽부터 이웃한 자리 숫자가 같은 크기씩 ${word} ${NUM_WORD[length]} 자리 수${gapText}를 ${listMode ? "모두 쓰세요" : "모두 몇 개인지 구하세요"}.`,
    visual: fig(htmlPanel(`<div style="text-align:center">${Array.from({ length }, () => box("", "min-width:36px;height:36px")).join(` <b style="color:${SOFT}">${increasing ? "↗" : "↘"}</b> `)}</div>`, 360)),
    answer: listMode ? numbers.join(", ") : `${numbers.length}개`,
    solution: `차(간격)를 1, 2, 3 … 으로 정하고 첫 숫자를 바꿔 가며 ${increasing ? "맨 끝이 9를 넘지 않게" : "맨 끝이 0보다 작아지지 않게"} 셉니다${listMode ? "" : `: ${[...new Set(numbers.map((v) => Math.abs(Number(String(v)[1]) - Number(String(v)[0]))))].map((g) => `차 ${g} → ${numbers.filter((v) => Math.abs(Number(String(v)[1]) - Number(String(v)[0])) === g).length}개`).join(", ")}`} → ${listMode ? numbers.join(", ") : `${numbers.length}개`}.`,
    meta: { length, increasing, listMode, numbers }
  });
}

// ── 내보내기 ────────────────────────────────────────

export const BOOK10_STRUCTURE_GENERATORS = {
  gaussFromOneEvenB10,
  gaussFromOneOddB10,
  consecutiveSumEvenLongB10,
  consecutiveSumOddLongB10,
  consecutiveFromSumLongB10,
  consecutiveMultiLengthFillB10,
  calendarWeekSpanWeekdayB10,
  sameParityRunFromSumB10,
  shapedGridSymmetricSumB10,
  shapedGridReverseB10,
  calendarBlockReverseB10,
  sameTensComplementSheetB10,
  consecutiveTensDigitTotalB10,
  consecutiveMaskedTripleB10,
  twoSymbolComboB10,
  targetOneScoreB10,
  sharedTermThreeTwoB10,
  containerPlusContentB10,
  perimeterSpacingReverseB10,
  perimeterSpacingThirdB10,
  sameBudgetReverseB10,
  newPeopleReverseB10,
  pairAveragesB10,
  mixedPlateWeightsB10,
  digitCardsListAllB10,
  digitCardsCountB10,
  monotoneDigitListB10,
  monotoneDigitListBoundB10,
  repeatedNonzeroDigitCountB10,
  cardSetTargetSumAllB10,
  digitSumRankedLargeB10,
  equalStepDigitNumbersB10
};

const row = (id, middle, label, generator, aliases = [], domain = "number") => ({
  id, domain, middle, label, generator,
  catalogGroup: middle, catalogStrategy: label, searchAliases: aliases
});

export const BOOK10_STRUCTURE_TYPE_ROWS = [
  row("gauss-from-one-even-b10", "연속수의 합", "1부터 짝수 개까지 더하기(첫 수와 끝 수 짝짓기)", "gaussFromOneEvenB10", ["가우스", "1부터 더하기"]),
  row("gauss-from-one-odd-b10", "연속수의 합", "1부터 홀수 개까지 더하기(가운데 수 × 개수)", "gaussFromOneOddB10", ["가우스", "1부터 더하기"]),
  row("consecutive-sum-even-long-b10", "연속수의 합", "짝수 개(10~12개) 연속수의 합", "consecutiveSumEvenLongB10", ["연속수의 합"]),
  row("consecutive-sum-odd-long-b10", "연속수의 합", "홀수 개(9~13개) 연속수의 합", "consecutiveSumOddLongB10", ["연속수의 합"]),
  row("consecutive-from-sum-long-b10", "연속수의 합", "합과 개수(7~10개)로 연속수 채우기", "consecutiveFromSumLongB10", ["연속수 찾기"]),
  row("consecutive-multi-length-fill-b10", "연속수의 합", "한 수를 주어진 여러 개수의 연속수로 채우기", "consecutiveMultiLengthFillB10", ["연속수 분해"]),
  row("calendar-week-span-weekday-b10", "연속수의 합", "요일이 정해진 날짜의 합으로 다른 날 요일 찾기", "calendarWeekSpanWeekdayB10", ["달력", "요일"]),
  row("same-parity-run-from-sum-b10", "연속수의 합", "합·개수·홀짝으로 연속한 홀수(짝수) 찾기", "sameParityRunFromSumB10", ["연속한 홀수", "연속한 짝수"]),
  row("shaped-grid-symmetric-sum-b10", "연속수의 합", "수 배열표의 대칭 모양 합(가운데 × 칸 수)", "shapedGridSymmetricSumB10", ["수 배열표"]),
  row("shaped-grid-reverse-b10", "연속수의 합", "모양의 합으로 수 배열표의 가장 작은 칸 찾기", "shapedGridReverseB10", ["수 배열표", "거꾸로"]),
  row("calendar-block-reverse-b10", "연속수의 합", "달력 묶음의 합으로 가장 작은·큰 날짜 찾기", "calendarBlockReverseB10", ["달력", "묶음 합"]),
  row("same-tens-complement-sheet-b10", "곱셈의 규칙", "십의 자리가 같고 일의 자리 합이 10인 곱셈 판", "sameTensComplementSheetB10", ["곱셈 규칙"]),
  row("consecutive-tens-digit-total-b10", "연속수의 합", "십의 자리 숫자의 합으로 연속수의 합 구하기", "consecutiveTensDigitTotalB10", ["연속수", "십의 자리"]),
  row("consecutive-masked-triple-b10", "연속수의 합", "끝 두 자리만 보이는 연속한 세 수의 덧셈", "consecutiveMaskedTripleB10", ["연속수", "세로셈"]),
  row("two-symbol-combo-b10", "대응 관계", "개수 짝이 다른 두 저울로 두 모양의 무게 구하기", "twoSymbolComboB10", ["저울", "두 모양"]),
  row("target-one-score-b10", "대응 관계", "한 칸을 한 번 더 맞힌 기록으로 과녁 점수 구하기", "targetOneScoreB10", ["과녁", "점수"]),
  row("shared-term-three-two-b10", "대응 관계", "같은 묶음이 있는 두 저울로 두 모양의 무게 구하기", "sharedTermThreeTwoB10", ["저울", "공통 묶음"]),
  row("container-plus-content-b10", "대응 관계", "담은 개수가 다른 두 무게로 빈 그릇 무게 구하기", "containerPlusContentB10", ["그릇 무게", "빈 통"]),
  row("perimeter-spacing-reverse-b10", "간격과 개수", "닫힌 둘레에서 간격을 바꾼 개수 차로 둘레·처음 개수 구하기", "perimeterSpacingReverseB10", ["간격", "둘레", "거꾸로"]),
  row("perimeter-spacing-third-b10", "간격과 개수", "간격을 바꾼 개수 차로 둘레를 찾고 다른 간격의 개수 구하기", "perimeterSpacingThirdB10", ["간격", "둘레"]),
  row("same-budget-reverse-b10", "대응 관계", "같은 돈으로 더 살 수 있는 개수로 가진 돈 구하기", "sameBudgetReverseB10", ["같은 돈", "거꾸로"]),
  row("new-people-reverse-b10", "대응 관계", "사람 수가 바뀌어 달라진 몫으로 처음 사람 수 구하기", "newPeopleReverseB10", ["똑같이 나누기", "거꾸로"]),
  row("pair-averages-b10", "대응 관계", "둘씩 낸 평균으로 세 값 구하기", "pairAveragesB10", ["평균", "두 개씩"]),
  row("mixed-plate-weights-b10", "대응 관계", "여러 모양이 섞인 네 접시로 네 모양의 무게 구하기", "mixedPlateWeightsB10", ["저울", "네 모양"], "logic"),
  row("digit-cards-list-all-b10", "숫자 카드", "숫자 카드로 만들 수 있는 수 모두 쓰기(0 포함·카드 모두 쓰기)", "digitCardsListAllB10", ["숫자 카드", "모두 쓰기"]),
  row("digit-cards-count-b10", "숫자 카드", "숫자 카드 4~6장으로 만들 수 있는 수의 개수(0 포함·카드 모두 쓰기)", "digitCardsCountB10", ["숫자 카드", "경우의 수"]),
  row("monotone-digit-list-b10", "조건에 맞는 수", "자리 숫자가 점점 커지는(작아지는) 수 모두 쓰기", "monotoneDigitListB10", ["커지는 수", "모두 쓰기"]),
  row("monotone-digit-list-bound-b10", "조건에 맞는 수", "자리 숫자가 한 방향으로 변하는 수 중 어떤 수보다 큰(작은) 수 모두 쓰기", "monotoneDigitListBoundB10", ["커지는 수", "범위"]),
  row("repeated-nonzero-digit-count-b10", "조건에 맞는 수", "0 아닌 숫자 몇 개를 여러 번 써서 만드는 수의 개수", "repeatedNonzeroDigitCountB10", ["여러 번 쓰기", "경우의 수"]),
  row("card-set-target-sum-all-b10", "숫자 카드", "1부터 n까지 카드 중 몇 장으로 합 만들기 — 방법 모두 쓰기", "cardSetTargetSumAllB10", ["카드 합", "모두 쓰기"]),
  row("digit-sum-ranked-large-b10", "조건에 맞는 수", "자리 숫자의 합이 같은 수를 큰 수부터 쓸 때 몇 번째 수", "digitSumRankedLargeB10", ["자리 숫자의 합", "순서"]),
  row("equal-step-digit-numbers-b10", "조건에 맞는 수", "이웃한 자리 숫자가 같은 크기씩 커지는(작아지는) 수", "equalStepDigitNumbersB10", ["같은 간격", "자리 숫자"])
];

export const BOOK10_STRUCTURE_GUIDES = {
  "gauss-from-one-even-b10": "첫 수와 끝 수, 둘째와 끝에서 둘째를 짝지으면 합이 같습니다. 짝의 합 × 짝의 개수.",
  "gauss-from-one-odd-b10": "홀수 개의 연속수는 가운데 수가 평균입니다. 가운데 수 × 개수.",
  "consecutive-sum-even-long-b10": "양 끝부터 짝지어 같은 합을 만들고 짝의 개수만큼 곱합니다.",
  "consecutive-sum-odd-long-b10": "가운데 수를 찾아 개수만큼 곱합니다.",
  "consecutive-from-sum-long-b10": "합 ÷ 개수로 가운데(또는 가운데 두 수의 평균)를 먼저 찾고 양쪽으로 펼칩니다.",
  "consecutive-multi-length-fill-b10": "개수마다 합 ÷ 개수로 가운데를 찾고, 가운데가 자연수(또는 ○.5)인지 보고 채웁니다.",
  "calendar-week-span-weekday-b10": "이어진 날짜의 합으로 가운데 날짜를 찾고, 7일마다 같은 요일임을 써서 다른 날의 요일을 셉니다.",
  "same-parity-run-from-sum-b10": "2씩 차이 나는 수도 합 ÷ 개수가 가운데 수입니다. 가운데에서 2씩 펼칩니다.",
  "shaped-grid-symmetric-sum-b10": "가운데를 두고 마주 보는 칸끼리 짝지으면 평균이 가운데 수입니다. 가운데 × 칸 수.",
  "shaped-grid-reverse-b10": "합 ÷ 칸 수로 가운데 칸의 수를 찾고, 거기서 가장 작은 칸까지 거꾸로 갑니다.",
  "calendar-block-reverse-b10": "묶음의 합 ÷ 칸 수가 가운데 날짜입니다. 위아래는 7, 옆은 1 차이입니다.",
  "same-tens-complement-sheet-b10": "십의 자리 수 × (그 수 + 1)을 앞에, 일의 자리 두 수의 곱을 두 자리로 뒤에 씁니다.",
  "consecutive-tens-digit-total-b10": "십의 자리 숫자가 모두 같은지, 중간에 바뀌는지를 합으로 따져 수를 정합니다.",
  "consecutive-masked-triple-b10": "연속한 세 수의 합은 가운데 수의 3배라 3의 배수입니다. 그런 합을 찾고 ÷ 3.",
  "two-symbol-combo-b10": "두 저울의 차이(하나 더 있는 모양)를 보거나, 두 저울을 합쳐 두 모양을 같은 개수로 만들어 한 짝의 무게를 먼저 구합니다.",
  "target-one-score-b10": "두 기록에서 한 번 더 맞힌 칸만 다르므로 점수의 차가 그 칸 한 번의 점수입니다.",
  "shared-term-three-two-b10": "두 저울에 똑같이 있는 묶음은 지우고 다른 모양만 견줍니다.",
  "container-plus-content-b10": "두 무게의 차가 더 담은 것의 무게입니다. 한 개 무게를 구해 빼면 빈 그릇입니다.",
  "perimeter-spacing-reverse-b10": "두 간격의 공배수 길이마다 개수가 몇 개씩 차이 나는지 보고, 전체 차이를 그 수로 나눠 둘레를 구합니다.",
  "perimeter-spacing-third-b10": "공배수 길이로 둘레를 먼저 구한 뒤, 닫힌 둘레는 둘레 ÷ 간격만큼 듭니다.",
  "same-budget-reverse-b10": "두 값의 공배수 금액마다 개수가 몇 개씩 차이 나는지 보고, 그 묶음이 몇 번인지 셉니다.",
  "new-people-reverse-b10": "바뀐 사람의 몫을 남은 사람들이 나누어 내거나 받습니다. 그 양 ÷ 한 명이 바뀐 개수 = 사람 수.",
  "pair-averages-b10": "평균 × 2로 두 값의 합을 만들고, 세 합을 더해 반으로 나누면 셋의 합입니다.",
  "mixed-plate-weights-b10": "한 가지 모양만 있는 접시부터 풀고, 아는 모양의 무게를 빼며 한 모양씩 찾습니다.",
  "digit-cards-list-all-b10": "맨 앞자리 숫자를 하나씩 정하고(0은 맨 앞 ✕) 남은 카드로 다음 자리를 채우며 빠짐없이 씁니다.",
  "digit-cards-count-b10": "자리마다 올 수 있는 카드 수를 차례로 곱합니다. 0은 맨 앞에 올 수 없습니다.",
  "monotone-digit-list-b10": "세 장을 고르면 놓는 차례는 하나뿐입니다. 세 장 고르기를 빠짐없이 적습니다.",
  "monotone-digit-list-bound-b10": "커지는(작아지는) 수를 모두 적은 뒤 조건에 맞는 것만 남깁니다.",
  "repeated-nonzero-digit-count-b10": "자리마다 고를 수 있는 숫자 수를 자리 수만큼 곱합니다.",
  "card-set-target-sum-all-b10": "가장 작은 카드를 정하고 나머지를 커지는 차례로 맞춰 같은 묶음을 두 번 쓰지 않습니다.",
  "digit-sum-ranked-large-b10": "백의 자리를 크게, 십의 자리를 큰 것부터 내려가며 차례로 셉니다.",
  "equal-step-digit-numbers-b10": "차를 정하고 첫 숫자를 바꿔 가며 끝 숫자가 0~9 안에 있는지 봅니다."
};

export const BOOK10_STRUCTURE_REMAPS = [
  // 1단원 — 1부터 n까지·긴 연속수, 여러 개수로 채우기, 달력 요일, 거꾸로 찾기, 곱셈 규칙 판, 가린 세로셈
  ["book-10", 1, "activity", 2, [3], "gauss-from-one-even-b10"],
  ["book-10", 1, "practice", 1, [7], "gauss-from-one-even-b10"],
  ["book-10", 1, "activity", 2, [4], "consecutive-sum-even-long-b10"],
  ["book-10", 1, "practice", 1, [8], "consecutive-sum-even-long-b10"],
  ["book-10", 1, "activity", 3, [1], "gauss-from-one-odd-b10"],
  ["book-10", 1, "practice", 1, [15], "gauss-from-one-odd-b10"],
  ["book-10", 1, "activity", 3, [2], "consecutive-sum-odd-long-b10"],
  ["book-10", 1, "practice", 1, [16], "consecutive-sum-odd-long-b10"],
  ["book-10", 1, "activity", 3, [5], "consecutive-from-sum-long-b10"],
  ["book-10", 1, "check", 2, [1], "consecutive-from-sum-long-b10"],
  ["book-10", 1, "practice", 1, [11, 19], "consecutive-from-sum-long-b10"],
  ["book-10", 1, "activity", 3, [6], "consecutive-multi-length-fill-b10"],
  ["book-10", 1, "check", 2, [2], "consecutive-multi-length-fill-b10"],
  ["book-10", 1, "practice", 1, [12, 20, 26], "consecutive-multi-length-fill-b10"],
  ["book-10", 1, "activity", 3, [7], "calendar-week-span-weekday-b10"],
  ["book-10", 1, "check", 2, [3], "calendar-week-span-weekday-b10"],
  ["book-10", 1, "practice", 1, [13, 21], "calendar-week-span-weekday-b10"],
  ["book-10", 1, "check", 3, [1], "same-parity-run-from-sum-b10"],
  ["book-10", 1, "practice", 1, [23], "same-parity-run-from-sum-b10"],
  ["book-10", 1, "check", 3, [3], "shaped-grid-symmetric-sum-b10"],
  ["book-10", 1, "practice", 1, [24], "shaped-grid-symmetric-sum-b10"],
  ["book-10", 1, "advanced", 1, [2], "shaped-grid-reverse-b10"],
  ["book-10", 1, "check", 3, [4], "calendar-block-reverse-b10"],
  ["book-10", 1, "practice", 1, [25], "calendar-block-reverse-b10"],
  ["book-10", 1, "check", 1, [2], "same-tens-complement-sheet-b10"],
  ["book-10", 1, "practice", 1, [3], "same-tens-complement-sheet-b10"],
  ["book-10", 1, "advanced", 1, [5], "consecutive-tens-digit-total-b10"],
  ["book-10", 1, "advanced", 1, [6], "consecutive-masked-triple-b10"],
  // 2단원 — 개수 짝이 다른 저울, 과녁 한 칸, 공통 묶음, 빈 그릇, 거꾸로(간격·같은 돈·사람 수), 둘씩 평균, 섞인 접시
  ["book-10", 2, "activity", 1, [1], "two-symbol-combo-b10"],
  ["book-10", 2, "practice", 1, [1, 2], "two-symbol-combo-b10"],
  ["book-10", 2, "activity", 1, [2], "target-one-score-b10"],
  ["book-10", 2, "practice", 1, [3], "target-one-score-b10"],
  ["book-10", 2, "activity", 1, [3], "shared-term-three-two-b10"],
  ["book-10", 2, "practice", 1, [4], "shared-term-three-two-b10"],
  ["book-10", 2, "activity", 1, [4], "container-plus-content-b10"],
  ["book-10", 2, "practice", 1, [5], "container-plus-content-b10"],
  ["book-10", 2, "activity", 2, [1], "perimeter-spacing-reverse-b10"],
  ["book-10", 2, "practice", 1, [10], "perimeter-spacing-reverse-b10"],
  ["book-10", 2, "advanced", 1, [5], "perimeter-spacing-third-b10"],
  ["book-10", 2, "activity", 2, [2], "same-budget-reverse-b10"],
  ["book-10", 2, "practice", 1, [11], "same-budget-reverse-b10"],
  ["book-10", 2, "activity", 2, [3, 4], "new-people-reverse-b10"],
  ["book-10", 2, "practice", 1, [12, 13], "new-people-reverse-b10"],
  ["book-10", 2, "advanced", 1, [3], "pair-averages-b10"],
  ["book-10", 2, "advanced", 1, [2], "mixed-plate-weights-b10"],
  // 3단원 — 카드 모두 쓰기·개수(0·6장), 커지는 수 모두 쓰기(+범위), 0 아닌 숫자 여러 번, 카드 합 묶음 모두, 큰 수부터 순서, 같은 간격
  ["book-10", 3, "activity", 1, [1, 2], "digit-cards-list-all-b10"],
  ["book-10", 3, "practice", 1, [3], "digit-cards-list-all-b10"],
  ["book-10", 3, "activity", 1, [5, 6], "digit-cards-count-b10"],
  ["book-10", 3, "practice", 1, [4, 5], "digit-cards-count-b10"],
  ["book-10", 3, "activity", 2, [1], "monotone-digit-list-b10"],
  ["book-10", 3, "practice", 1, [11], "monotone-digit-list-b10"],
  ["book-10", 3, "activity", 2, [2], "monotone-digit-list-bound-b10"],
  ["book-10", 3, "practice", 1, [12, 13], "monotone-digit-list-bound-b10"],
  ["book-10", 3, "check", 1, [1, 2], "repeated-nonzero-digit-count-b10"],
  ["book-10", 3, "practice", 1, [7, 8], "repeated-nonzero-digit-count-b10"],
  ["book-10", 3, "check", 2, [1, 2, 3, 4], "card-set-target-sum-all-b10"],
  ["book-10", 3, "practice", 1, [14, 15, 16], "card-set-target-sum-all-b10"],
  ["book-10", 3, "advanced", 1, [5], "card-set-target-sum-all-b10"],
  ["book-10", 3, "advanced", 1, [2], "digit-sum-ranked-large-b10"],
  ["book-10", 3, "advanced", 1, [3], "equal-step-digit-numbers-b10"]
];

// ── 독립 검산(book10-audit.mjs가 부름) — 생성기 코드와 따로 meta로 다시 셈 ─────────
const isRun = (values, step = 1) => values.every((v, i) => i === 0 || v - values[i - 1] === step);
const sumOf = (values) => values.reduce((a, b) => a + b, 0);
// 정수 계수 연립식 — 계수 행렬의 계수(rank)가 미지수 수와 같고(답 하나) 주어진 값이 식에 맞는지
function uniqueLinear(rows, totals, values) {
  const n = values.length;
  if (rows.length < n || rows.some((r, i) => sumOf(r.map((c, j) => c * values[j])) !== totals[i])) return false;
  const a = rows.map((r) => r.slice(0, n).map(Number));
  let rank = 0;
  for (let col = 0; col < n; col += 1) {
    const pivot = a.findIndex((r, i) => i >= rank && Math.abs(r[col]) > 1e-9);
    if (pivot < 0) return false;
    [a[rank], a[pivot]] = [a[pivot], a[rank]];
    for (let i = 0; i < a.length; i += 1) if (i !== rank) { const f = a[i][col] / a[rank][col]; a[i] = a[i].map((v, j) => v - f * a[rank][j]); }
    rank += 1;
  }
  return values.every((v) => Number.isInteger(v) && v > 0);
}
function monotoneCheck(p) {
  const m = p.meta;
  const brute = range(100, 999).filter((v) => {
    const d = String(v).split("").map(Number);
    const left = m.cards.slice();
    if (!d.every((x) => { const i = left.indexOf(x); if (i < 0) return false; left.splice(i, 1); return true; })) return false;
    if (!(m.increasing ? d[0] < d[1] && d[1] < d[2] : d[0] > d[1] && d[1] > d[2])) return false;
    return m.bound === null || (m.above ? v > m.bound : v < m.bound);
  });
  return brute.join(", ") === p.answer && brute.length >= 2 && brute.length <= 10;
}
function spacingCheck(m) {
  const fits = [];
  for (let per = 1; per <= 2000; per += 1) if (per % m.g1 === 0 && per % m.g2 === 0 && per / m.g1 - per / m.g2 === m.d) fits.push(per);
  return fits.length === 1 && fits[0] === m.perimeter && m.first === m.perimeter / m.g1;
}
export const BOOK10_STRUCTURE_CHECKS = {
  "gauss-from-one-even-b10": (p) => p.meta.ends.every((n, i) => n % 2 === 0 && p.meta.totals[i] === (n * (n + 1)) / 2) || "1부터 n까지 합",
  "gauss-from-one-odd-b10": (p) => p.meta.ends.every((n, i) => n % 2 === 1 && p.meta.totals[i] === (n * (n + 1)) / 2) || "1부터 n까지 합",
  "consecutive-sum-even-long-b10": (p) => p.meta.parts.every((q) => isRun(q.values) && q.values.length % 2 === 0 && sumOf(q.values) === q.total) || "짝수 개 연속수 합",
  "consecutive-sum-odd-long-b10": (p) => p.meta.parts.every((q) => isRun(q.values) && q.values.length % 2 === 1 && sumOf(q.values) === q.total) || "홀수 개 연속수 합",
  "consecutive-from-sum-long-b10": (p) => p.meta.parts.every((q) => isRun(q.values) && q.values.length === q.count && q.values[0] >= 1 && sumOf(q.values) === q.total) || "합·개수로 연속수",
  "consecutive-multi-length-fill-b10": (p) => p.meta.parts.every((q, i) => isRun(q.values) && q.values.length === p.meta.lengths[i] && q.values[0] >= 1 && sumOf(q.values) === p.meta.target) || "여러 개수 연속수",
  "calendar-week-span-weekday-b10": (p) => {
    const m = p.meta;
    if (!isRun(m.dates) || sumOf(m.dates) !== m.total || m.dates[0] !== m.start) return "이어진 날짜 합";
    if (m.dates.length !== m.to - m.from + 1) return "요일 칸 수";
    if (((m.dayOne + m.start - 1) % 7 + 7) % 7 !== m.from) return "첫날 요일";
    if (((m.dayOne + m.date - 1) % 7 + 7) % 7 !== m.weekday) return "묻는 날 요일";
    if (!p.answer.includes(["일", "월", "화", "수", "목", "금", "토"][m.weekday])) return "답 요일";
    return m.date <= m.days || "날짜 범위";
  },
  "same-parity-run-from-sum-b10": (p) => p.meta.parts.every((q) => isRun(q.values, 2) && q.values.length === q.count && q.values.every((v) => v % 2 === (p.meta.parity === "짝수" ? 0 : 1)) && sumOf(q.values) === q.total) || "연속한 홀수·짝수",
  "shaped-grid-symmetric-sum-b10": (p) => p.meta.shapes.every((s) => {
    const values = s.cells.map((c) => p.meta.start + c);
    return values.length === s.size && sumOf(values) === s.total && s.total === s.center * s.size;
  }) || "모양 합 = 가운데 × 칸 수",
  "shaped-grid-reverse-b10": (p) => {
    const m = p.meta;
    const values = m.shownCells.map((c) => m.start + c);
    if (sumOf(values) !== m.center1 * m.size) return "처음 모양 합";
    const moved = values.map((v) => v - m.center1 + m.center2);
    if (sumOf(moved) !== m.total2) return "같은 모양 합";
    return (m.askSmall ? Math.min(...moved) : Math.max(...moved)) === m.target || "가장 작은·큰 칸";
  },
  "calendar-block-reverse-b10": (p) => p.meta.parts.every((q) => (q.ask === "sum" ? q.answer === q.center * 9 : q.total === q.center * 9 && q.answer === q.center + (q.ask === "large" ? 8 : -8))) || "달력 묶음",
  "same-tens-complement-sheet-b10": (p) => p.meta.items.every((it) => Math.floor(it.first / 10) === Math.floor(it.second / 10) && (it.first % 10) + (it.second % 10) === 10 && it.result === it.first * it.second) || "곱셈 규칙",
  "consecutive-tens-digit-total-b10": (p) => {
    const m = p.meta;
    const fits = [];
    for (let s = 10; s + m.count - 1 <= 99; s += 1) { const run = runOf(s, m.count); if (sumOf(run.map((v) => Math.floor(v / 10))) === m.tensSum) fits.push(run); }
    if (fits.length !== 1) return `조건에 맞는 연속수 ${fits.length}가지`;
    return String(m.askLargest ? fits[0].at(-1) : sumOf(fits[0])) === p.answer || "답";
  },
  "consecutive-masked-triple-b10": (p) => p.meta.parts.every((q) => {
    const ok = [100, 200].map((h) => h + q.tail).filter((t) => t % 3 === 0 && t / 3 - 1 >= 10 && t / 3 + 1 <= 99);
    return ok.length === 1 && ok[0] === q.total && isRun(q.values) && sumOf(q.values) === q.total;
  }) || "가린 덧셈 답 하나",
  "two-symbol-combo-b10": (p) => uniqueLinear(p.meta.coefficients, p.meta.totals, p.meta.values) || "두 저울 답 하나",
  "target-one-score-b10": (p) => (uniqueLinear(p.meta.hits, p.meta.totals, p.meta.values) && p.answer === `${p.meta.values[p.meta.ask]}점`) || "과녁 점수",
  "shared-term-three-two-b10": (p) => uniqueLinear(p.meta.coefficients, p.meta.totals, p.meta.values) || "공통 묶음 답 하나",
  "container-plus-content-b10": (p) => {
    const m = p.meta;
    const each = (m.totals[1] - m.totals[0]) / (m.counts[1] - m.counts[0]);
    return (Number.isInteger(each) && each === m.each && m.totals[0] - m.counts[0] * each === m.holderWeight && m.holderWeight > 0) || "빈 그릇";
  },
  "perimeter-spacing-reverse-b10": (p) => spacingCheck(p.meta) || "간격 거꾸로",
  "perimeter-spacing-third-b10": (p) => (spacingCheck(p.meta) && p.meta.g3 && p.answer.endsWith(`${p.meta.perimeter / p.meta.g3}개`)) || "셋째 간격",
  "same-budget-reverse-b10": (p) => {
    const m = p.meta;
    const fits = [];
    for (let b = m.p2; b <= 200000; b += m.p2) if (b % m.p1 === 0 && b / m.p2 - b / m.p1 === m.d) fits.push(b);
    return (fits.length === 1 && fits[0] === m.budget && m.expensive === m.budget / m.p1) || "같은 돈 거꾸로";
  },
  "new-people-reverse-b10": (p) => {
    const m = p.meta;
    const fits = range(1, 300).filter((n) => (m.leave ? n - m.change >= 1 && n * m.before === (n - m.change) * m.after : n * m.before === (n + m.change) * m.after));
    return (fits.length === 1 && fits[0] === m.first && m.total === m.first * m.before) || "처음 사람 수";
  },
  "pair-averages-b10": (p) => {
    const [a, b, c] = p.meta.values;
    return (new Set(p.meta.values).size === 3 && [(a + b) / 2, (b + c) / 2, (a + c) / 2].every((v, i) => v === p.meta.averages[i] && Number.isInteger(v))) || "둘씩 평균";
  },
  "mixed-plate-weights-b10": (p) => {
    const m = p.meta;
    if (!m.plates.every((c, k) => sumOf(c) >= 2 && sumOf(c) <= 5 && c.filter(Boolean).length >= (k === 0 ? 1 : 2))) return "접시 모양 수";
    return uniqueLinear(m.plates, m.totals, m.values) || "섞인 접시 답 하나";
  },
  "digit-cards-list-all-b10": (p) => {
    const m = p.meta;
    const brute = range(10 ** (m.length - 1), 10 ** m.length - 1).filter((v) => {
      const left = m.cards.slice();
      return String(v).split("").every((ch) => { const i = left.indexOf(Number(ch)); if (i < 0) return false; left.splice(i, 1); return true; });
    });
    return (brute.join(", ") === p.answer && brute.length >= 4 && brute.length <= 12) || "카드 수 목록";
  },
  "digit-cards-count-b10": (p) => {
    const m = p.meta;
    const brute = range(10 ** (m.length - 1), 10 ** m.length - 1).filter((v) => {
      const left = m.cards.slice();
      return String(v).split("").every((ch) => { const i = left.indexOf(Number(ch)); if (i < 0) return false; left.splice(i, 1); return true; });
    }).length;
    return p.answer === `${brute}개` || "카드 수 개수";
  },
  "monotone-digit-list-b10": (p) => monotoneCheck(p) || "커지는 수 목록",
  "monotone-digit-list-bound-b10": (p) => (monotoneCheck(p) && p.meta.bound !== null) || "범위 안 커지는 수",
  "repeated-nonzero-digit-count-b10": (p) => {
    const m = p.meta;
    const brute = range(10 ** (m.length - 1), 10 ** m.length - 1).filter((v) => String(v).split("").every((ch) => m.digits.includes(Number(ch)))).length;
    return (!m.digits.includes(0) && p.answer === `${brute}개`) || "여러 번 쓰기 개수";
  },
  "card-set-target-sum-all-b10": (p) => {
    const m = p.meta;
    const brute = [];
    const walk = (start, chosen) => {
      if (chosen.length === m.pickCount) { if (sumOf(chosen) === m.target) brute.push(chosen); return; }
      for (let v = start; v <= m.n; v += 1) walk(v + 1, [...chosen, v]);
    };
    walk(1, []);
    return (brute.map((s) => `(${s.join(", ")})`).join(", ") === p.answer && brute.length >= 2) || "카드 합 묶음";
  },
  "digit-sum-ranked-large-b10": (p) => {
    const m = p.meta;
    const list = [];
    for (let v = 999; v >= 100; v -= 1) if (sumOf(String(v).split("").map(Number)) === m.target) list.push(v);
    return String(list[m.rank - 1]) === p.answer || "큰 수부터 순서";
  },
  "equal-step-digit-numbers-b10": (p) => {
    const m = p.meta;
    const fits = range(10 ** (m.length - 1), 10 ** m.length - 1).filter((v) => {
      const d = String(v).split("").map(Number);
      const s = d[1] - d[0];
      return s !== 0 && (m.increasing ? s > 0 : s < 0) && d.every((x, i) => i === 0 || x - d[i - 1] === s);
    });
    if (!m.numbers.every((v) => fits.includes(v))) return "같은 간격 수";
    return (m.listMode ? p.answer === m.numbers.join(", ") && m.numbers.length >= 2 : p.answer === `${m.numbers.length}개`) || "같은 간격 답";
  }
};
