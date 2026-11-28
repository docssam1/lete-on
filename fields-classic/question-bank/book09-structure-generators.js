// 1과정 9권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK09_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK09_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK09_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK09_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
// 만든 꼴(대조 결과의 「새 생성기」·「partial 변형」):
//   1단원 바깥 직사각형 − 모서리 삼각형: 꼭짓점이 모두 직사각형 테두리 위에 있는 기운 삼각형·사각형·평행사변형·
//        직사각형(정사각형)·오각형, 기운 정사각형 두 개 사이의 테두리.
//   2단원 위·앞·왼쪽 옆 모양(개수 · 최대·최소), 4×4 네 층, 입체 → 위 모양의 수와 앞·옆 모양·최소 개수.
//   3단원 단서 셋만 있는 3×3 마방진(줄 합 찾고 모두 채우기), 4×4 드문 단서(두 줄이 만나는 빈칸으로 A+B),
//        삼각진 최소·최대 둘 · 두 합 둘 · 1~9 네 수 삼각진의 배치 모두.
//   4단원 기준 없는 섞인 방향의 차(앞·뒤, 먼저·늦게, 위·아래), 값 목록 + 차이·순서만 조건 섞기,
//        둥근 탁자(마주 봄 · 한 사람 건너 · 이웃하지 않음 · 오른쪽·왼쪽).
// (2차) 남은 번호:
//   1단원 같은 도형을 k조각·m조각으로 각각 · 처음 도형과 모양이 같은 4조각(★ 조건) · 보기와 다른 4조각 ·
//        주어진 조각 4개로 덮기(★) · 정사각형 울타리 두 개 — 칸(정사각형·4등분 직각삼각형·정삼각형) 도형을 완전 탐색으로 나눈다.
//   2단원 맞는 쌓은 모양 모두 고르기 · 정육면체까지 더 필요한 가장 적은 개수 · 번갈아 쌓은 검은색의 가장 적은 개수.
//   3단원 겹친 원 영역의 모든 경우 · 지름과 둘레의 합 · 같은 기호 가로·세로 합의 가장 작은(큰) 값 · 고리 원 ·
//        삼각형 일곱 원 · 원형진 가운데 수 모두 · 꺾인 길.
//   4단원 아이들이 한 말로 등수 · 형제의 말로 몇째 자리 · 「만약 ~라면」 책상 · 친구·이웃·결혼으로 직업.
// 모든 생성기는 같은 길을 밟는다: 꼴 스펙 → 수·배치를 새로 뽑기 → 완전 탐색으로 답이 하나뿐인지 확인 →
// 풀이는 아이가 하는 차례대로.

// ── 공통 ─────────────────────────────────────────────

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const sum = (list) => list.reduce((total, value) => total + value, 0);

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function permutations(items) {
  if (items.length <= 1) return [items.slice()];
  const out = [];
  items.forEach((value, index) => {
    const rest = items.slice(0, index).concat(items.slice(index + 1));
    permutations(rest).forEach((tail) => out.push([value, ...tail]));
  });
  return out;
}

// 수 뒤 조사(받침): 끝자리 0·1·3·6·7·8은 받침 있음.
const numBatchim = (n) => [0, 1, 3, 6, 7, 8].includes(Math.abs(Math.trunc(Number(n))) % 10);
// 글자(이름) 뒤 조사: 마지막 글자 받침.
function wordBatchim(word) {
  const code = String(word).charCodeAt(String(word).length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}
// ㉠㉡㉢…은 「기역·니은·디귿」처럼 읽어 받침이 있다.
const has = (value) => (typeof value === "number" ? numBatchim(value) : /^[\u3260-\u326d]$/.test(String(value)) ? true : wordBatchim(value));
const eun = (v) => `${v}${has(v) ? "은" : "는"}`;
const iga = (v) => `${v}${has(v) ? "이" : "가"}`;
const eul = (v) => `${v}${has(v) ? "을" : "를"}`;
const wa = (v) => `${v}${has(v) ? "과" : "와"}`;
// 사람 이름 부를 때(받침 있으면 「이」를 붙여 부름 — 「지민이는」)
const callName = (name) => (wordBatchim(name) ? `${name}이` : name);
const cnEun = (name) => `${callName(name)}는`;
const cnIga = (name) => (wordBatchim(name) ? `${name}이가` : `${name}가`);
const cnWa = (name) => (wordBatchim(name) ? `${name}이와` : `${name}와`);

const MARKS = ["㉠", "㉡", "㉢", "㉣", "㉤"];
const INK = "#2f2a24";
const FONT = "font-family:'Noto Sans KR',sans-serif";
const GRID = "#b9cdd6";
const EDGE = "#2f5f73";
const FILL = "#cfe5ee";

function svgWrap(width, height, body, label) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="width:${width}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">${body}</svg>`;
}
const txt = (x, y, value, { size = 15, weight = 700, fill = INK, anchor = "middle" } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${size}" font-weight="${weight}" style="fill:${fill};${FONT}">${value}</text>`;
const row = (id, domain, middle, label, generator, aliases) => ({ id, domain, middle, label, generator, searchAliases: aliases });
const figs = (list) => `<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start;justify-content:center">${list.join("")}</div>`;
const half = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

// ── 1단원 · 바깥 직사각형 − 모서리 삼각형 ──────────────────
// 꼭짓점이 모두 바깥 직사각형(W×H)의 테두리 위에 있는 볼록 다각형. 이웃한 두 꼭짓점 사이 테두리에 모서리가
// 하나 들어 있으면 그 자리에서 직각삼각형 하나를 뺀다(모서리가 없으면 같은 변 위라 뺄 것이 없다).

function perimeterPoint(t, W, H) {
  if (t <= W) return [t, 0];
  if (t <= W + H) return [W, t - W];
  if (t <= 2 * W + H) return [2 * W + H - t, H];
  return [0, 2 * W + 2 * H - t];
}
const CORNER_T = (W, H) => [0, W, W + H, 2 * W + H];

// 꼭짓점 둘레 위치(정렬)로 다각형·뺄 삼각형을 만든다. 모서리가 둘 이상 든 테두리는 null.
function inscribedPolygon(ts, W, H) {
  const P = 2 * W + 2 * H;
  const corners = CORNER_T(W, H);
  const points = ts.map((t) => perimeterPoint(t, W, H));
  const cuts = [];
  for (let i = 0; i < ts.length; i += 1) {
    const a = ts[i];
    const b = i + 1 < ts.length ? ts[i + 1] : ts[0] + P;
    const inside = [...corners, ...corners.map((c) => c + P)].filter((c) => c > a && c < b);
    if (inside.length > 1) return null;
    if (inside.length === 1) {
      const corner = perimeterPoint(inside[0] % P, W, H);
      const legA = inside[0] - a;
      const legB = b - inside[0];
      cuts.push({ corner, legs: [legA, legB], area: (legA * legB) / 2 });
    }
  }
  // 네 변을 모두 건드려야 바깥 직사각형이 W×H
  const touches = [points.some(([, y]) => y === 0), points.some(([x]) => x === W), points.some(([, y]) => y === H), points.some(([x]) => x === 0)];
  if (!touches.every(Boolean)) return null;
  // 한 변 위에 세 꼭짓점(가운데가 곧은 꼭짓점)이면 버림
  for (let i = 0; i < points.length; i += 1) {
    const [p, q, r] = [points[(i + points.length - 1) % points.length], points[i], points[(i + 1) % points.length]];
    if ((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]) === 0) return null;
  }
  const area = W * H - sum(cuts.map((c) => c.area));
  return { points, cuts, area };
}

const shoelace = (points) => Math.abs(points.reduce((acc, [x, y], i) => {
  const [nx, ny] = points[(i + 1) % points.length];
  return acc + x * ny - nx * y;
}, 0)) / 2;

function gridFigure({ cols, rows, polygons, holes = [], label, cell = 30, unitMark = false }) {
  const pad = 4;
  const width = cols * cell + pad * 2;
  const height = rows * cell + pad * 2;
  let body = "";
  for (let i = 0; i <= cols; i += 1) body += `<line x1="${pad + i * cell}" y1="${pad}" x2="${pad + i * cell}" y2="${pad + rows * cell}" style="stroke:${GRID};stroke-width:1"/>`;
  for (let j = 0; j <= rows; j += 1) body += `<line x1="${pad}" y1="${pad + j * cell}" x2="${pad + cols * cell}" y2="${pad + j * cell}" style="stroke:${GRID};stroke-width:1"/>`;
  const path = (pts) => `M${pts.map(([x, y]) => `${pad + x * cell} ${pad + y * cell}`).join("L")}Z`;
  const d = [...polygons, ...holes].map(path).join("");
  body += `<path d="${d}" fill-rule="evenodd" style="fill:${FILL};stroke:${EDGE};stroke-width:2.2;stroke-linejoin:round"/>`;
  body += `<rect x="${pad}" y="${pad}" width="${cols * cell}" height="${rows * cell}" style="fill:none;stroke:${EDGE};stroke-width:1.4"/>`;
  if (unitMark) body += txt(pad + cell / 2, pad + cell / 2 + 1, "1㎠", { size: 9, weight: 600 });
  return svgWrap(width, height, body, label);
}

const AREA_KINDS = {
  triangle: { name: "삼각형", k: 3 },
  quad: { name: "사각형", k: 4 },
  parallelogram: { name: "평행사변형", k: 4 },
  rectangle: { name: "직사각형", k: 4 },
  pentagon: { name: "오각형", k: 5 }
};

function isParallelogram(points) {
  if (points.length !== 4) return false;
  const [a, b, c, d] = points;
  return b[0] - a[0] === c[0] - d[0] && b[1] - a[1] === c[1] - d[1];
}
function isRectangle(points) {
  if (!isParallelogram(points)) return false;
  const [a, b, , d] = points;
  return (b[0] - a[0]) * (d[0] - a[0]) + (b[1] - a[1]) * (d[1] - a[1]) === 0;
}

function pickInscribed(kind, difficulty) {
  const range = difficulty === 1 ? [3, 5] : difficulty === 2 ? [4, 6] : [5, 7];
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const W = randomInt(range[0], range[1]);
    const H = randomInt(range[0], range[1]);
    const P = 2 * W + 2 * H;
    let ts;
    if (kind === "parallelogram" || kind === "rectangle") {
      let a;
      let b;
      if (kind === "rectangle") {
        // 직사각형: 한 변 (p, q), 다른 변 m(−q, p) — 둘러싼 칸은 가로 p+mq, 세로 q+mp
        const p = randomInt(1, difficulty === 1 ? 3 : 4);
        const q = randomInt(1, difficulty === 1 ? 3 : 4);
        const m = difficulty >= 2 && Math.random() < 0.4 ? 2 : 1;
        if (p === q && m === 1) continue;
        const w = p + m * q;
        const h = q + m * p;
        if (w > 9 || h > 9) continue;
        const points = [[m * q, 0], [w, q], [p, h], [0, m * p]];
        const made = inscribedPolygon([m * q, w + q, 2 * w + h - p, 2 * w + 2 * h - m * p], w, h);
        if (!made || !isRectangle(points)) continue;
        return { W: w, H: h, ...made, square: m === 1, sides: [p, q, m] };
      }
      a = randomInt(1, W - 1);
      b = randomInt(1, H - 1);
      // (a,0) · (W,b) · (W−a,H) · (0,H−b) — 아래 변은 오른쪽에서 왼쪽으로, 왼쪽 변은 아래에서 위로 잰다
      ts = [a, W + b, W + H + a, 2 * W + H + b];
      const made = inscribedPolygon(ts, W, H);
      if (!made || isRectangle(made.points) || !isParallelogram(made.points)) continue;
      return { W, H, ...made };
    }
    const k = AREA_KINDS[kind].k;
    const set = new Set();
    if (kind === "triangle") {
      // 꼭짓점 하나는 모서리, 나머지 둘은 그 모서리에 닿지 않는 두 변의 안쪽
      const ci = randomInt(0, 3);
      const corners = CORNER_T(W, H);
      set.add(corners[ci]);
      const sideStart = (s) => corners[s];
      const sideLen = (s) => (s % 2 === 0 ? W : H);
      [(ci + 1) % 4, (ci + 2) % 4].forEach((s) => set.add(sideStart(s) + randomInt(1, sideLen(s) - 1)));
    } else {
      while (set.size < k) set.add(randomInt(0, P - 1));
    }
    ts = [...set].sort((x, y) => x - y);
    const made = inscribedPolygon(ts, W, H);
    if (!made) continue;
    if (kind === "quad" && isParallelogram(made.points)) continue;
    if (made.cuts.length < (kind === "triangle" ? 3 : kind === "pentagon" ? 3 : 3)) continue;
    if (Math.abs(shoelace(made.points) - made.area) > 1e-9) continue;
    if (kind === "pentagon" && made.points.length !== 5) continue;
    return { W, H, ...made };
  }
  return null;
}

function cutText(cuts) {
  return cuts.map((c) => `${c.legs[0]}×${c.legs[1]}÷2=${half(c.area)}`).join(", ");
}

function tiltedAreaProblem(kind, { difficulty = 2 } = {}) {
  const made = pickInscribed(kind, difficulty);
  if (!made) return null;
  const { W, H, points, cuts, area } = made;
  const margin = difficulty === 1 ? 0 : randomInt(0, 1);
  const shift = (pts) => pts.map(([x, y]) => [x + margin, y + margin]);
  const shapeName = kind === "rectangle" ? (made.square ? "정사각형" : "직사각형") : AREA_KINDS[kind].name;
  const html = gridFigure({ cols: W + margin * 2, rows: H + margin * 2, polygons: [shift(points)], label: `모눈 위에 그린 기울어진 ${shapeName}` });
  const big = W * H;
  const removed = sum(cuts.map((c) => c.area));
  return {
    prompt: `한 변의 길이가 1cm인 모눈 위에 ${shapeName}을 그렸습니다. 색칠한 ${shapeName}의 넓이를 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${half(area)}㎠`,
    solution: `${shapeName}을 꼭 맞게 둘러싼 직사각형은 가로 ${W}cm, 세로 ${H}cm이므로 넓이는 ${W}×${H}=${big}㎠입니다. 바깥쪽 직각삼각형 ${cuts.length}개(${cutText(cuts)})의 넓이 ${half(removed)}㎠를 빼면 ${big}-${half(removed)}=${half(area)}㎠입니다.`,
    meta: { family: "tilted-area-b9", kind, W, H, margin, points, cuts, area, square: Boolean(made.square), answer: area }
  };
}

function tiltedSquareFrame({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const p = randomInt(2, difficulty === 1 ? 4 : 5);
    const q = randomInt(1, p);
    const outer = [[q, 0], [p + q, q], [p, p + q], [0, p]];
    const p2 = randomInt(1, p - 1);
    const q2 = randomInt(1, Math.max(1, q));
    const inner0 = [[q2, 0], [p2 + q2, q2], [p2, p2 + q2], [0, p2]];
    if (p2 * p2 + q2 * q2 * 1 >= p * p + q * q - 2) continue;
    const dx = randomInt(1, p + q - (p2 + q2) - 1);
    const dy = randomInt(1, p + q - (p2 + q2) - 1);
    if (dx < 1 || dy < 1) continue;
    const inner = inner0.map(([x, y]) => [x + dx, y + dy]);
    // 안쪽 정사각형 꼭짓점이 바깥 정사각형 안(경계 제외)에 있어야 한다
    const insideOuter = ([x, y]) => outer.every((a, i) => {
      const b = outer[(i + 1) % 4];
      return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) > 0;
    });
    if (!inner.every(insideOuter)) continue;
    const big = p * p + q * q;
    const small = p2 * p2 + q2 * q2;
    const margin = 1;
    const size = p + q + margin * 2;
    const shift = (pts) => pts.map(([x, y]) => [x + margin, y + margin]);
    const html = gridFigure({ cols: size, rows: size, polygons: [shift(outer)], holes: [shift(inner)], label: "기울어진 두 정사각형 사이를 색칠한 그림" });
    const outerBox = (p + q) ** 2;
    const innerBox = (p2 + q2) ** 2;
    return {
      prompt: "한 변의 길이가 1cm인 모눈 위에 기울어진 정사각형 두 개를 그렸습니다. 두 정사각형 사이에 색칠한 부분의 넓이를 구하세요.",
      visual: { kind: "fig", html },
      answer: `${big - small}㎠`,
      solution: `큰 정사각형은 둘러싼 정사각형 ${p + q}×${p + q}=${outerBox}㎠에서 바깥 직각삼각형 4개 ${2 * p * q}㎠를 빼면 ${big}㎠입니다. 작은 정사각형은 ${p2 + q2}×${p2 + q2}=${innerBox}㎠에서 ${2 * p2 * q2}㎠를 빼면 ${small}㎠입니다. 색칠한 부분은 ${big}-${small}=${big - small}㎠입니다.`,
      meta: { family: "tilted-frame-b9", outer, inner, big, small, answer: big - small }
    };
  }
  return null;
}

// ── 3단원 · 마방진 ─────────────────────────────────────

// 3×3 마방진: 가운데 e, 두 수 u, v로 모든 마방진을 나타낼 수 있다.
//   e+u   e-u-v  e+v
//   e-u+v   e    e+u-v
//   e-v   e+u+v  e-u
const MAGIC3_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const magic3 = (e, u, v) => [e + u, e - u - v, e + v, e - u + v, e, e + u - v, e - v, e + u + v, e - u];

// 아이가 배운 성질만으로 채우기: ①한 줄의 합 = 가운데 수 × 3 ②가운데를 지나는 줄의 양 끝 합 = 가운데 수 × 2
// ③합을 알면 두 수가 보이는 줄의 남은 한 칸. 이 셋으로 끝까지 채워지는지 본다(채워지면 답은 하나뿐).
function solveMagic3(shown) {
  const cell = [...shown];
  let S = null;
  const steps = [];
  for (let guard = 0; guard < 40; guard += 1) {
    let moved = false;
    if (cell[4] === null) {
      for (const [a, b] of [[0, 8], [2, 6], [1, 7], [3, 5]]) {
        if (cell[a] !== null && cell[b] !== null && (cell[a] + cell[b]) % 2 === 0) {
          cell[4] = (cell[a] + cell[b]) / 2;
          steps.push(`가운데를 지나는 줄의 양 끝 ${wa(cell[a])} ${cell[b]}의 합 ${cell[a] + cell[b]}은 가운데 수의 2배이므로 가운데 수는 ${cell[4]}입니다.`);
          moved = true;
          break;
        }
      }
    }
    if (cell[4] !== null && S === null) { S = cell[4] * 3; steps.push(`한 줄의 합은 가운데 수의 3배이므로 ${cell[4]}×3=${S}입니다.`); moved = true; }
    if (cell[4] !== null) {
      for (const [a, b] of [[0, 8], [2, 6], [1, 7], [3, 5]]) {
        if ((cell[a] === null) !== (cell[b] === null)) {
          const [known, unknown] = cell[a] === null ? [b, a] : [a, b];
          cell[unknown] = cell[4] * 2 - cell[known];
          moved = true;
        }
      }
    }
    if (S !== null) {
      for (const line of MAGIC3_LINES) {
        const empty = line.filter((i) => cell[i] === null);
        if (empty.length === 1) { cell[empty[0]] = S - sum(line.filter((i) => i !== empty[0]).map((i) => cell[i])); moved = true; }
      }
    }
    if (!moved) break;
  }
  return cell.every((v) => v !== null) ? { cell, S, steps } : null;
}

function magicThreeGivens({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const e = randomInt(difficulty === 1 ? 5 : 7, difficulty === 3 ? 20 : 13);
    const u = randomInt(1, difficulty === 3 ? 7 : 4) * pick([1, -1]);
    const v = randomInt(1, difficulty === 3 ? 7 : 4) * pick([1, -1]);
    const square = magic3(e, u, v);
    if (square.some((x) => x < 1) || new Set(square).size !== 9) continue;
    const cells = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
    // 가운데를 바로 주는 것은 쉬운 단계에서만
    if (difficulty === 3 && cells.includes(4)) continue;
    if (difficulty === 1 && !cells.includes(4)) continue;
    const shown = square.map((x, i) => (cells.includes(i) ? x : null));
    const solved = solveMagic3(shown);
    if (!solved || solved.cell.join() !== square.join()) continue;
    const S = 3 * e;
    return {
      prompt: "가로, 세로, 대각선의 세 수의 합이 모두 같은 3×3 마방진입니다. 한 줄의 합을 구하고, 빈칸을 모두 채우세요.",
      visual: { kind: "book9", subtype: "magic-grid", size: 3, shown },
      answer: `한 줄의 합 ${S}`,
      answerVisual: { kind: "book9", subtype: "magic-grid", size: 3, shown: square, lineSum: S },
      responseKind: "drawing",
      solution: `${solved.steps.join(" ")} 가운데를 지나는 줄은 양 끝의 합이 ${e * 2}이 되도록, 두 칸이 채워진 줄은 남은 한 칸을 ${S}에서 빼서 채웁니다.`,
      meta: { family: "magic3-givens-b9", shown, square, S, answer: S }
    };
  }
  return null;
}

// 4×4 마방진: 기본 마방진 셋 + 돌리기·뒤집기 + 가운데 두 줄 바꾸기 + 일정하게 늘리기.
const MAGIC4_BASES = [
  [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]],
  [[1, 15, 14, 4], [12, 6, 7, 9], [8, 10, 11, 5], [13, 3, 2, 16]],
  [[7, 12, 1, 14], [2, 13, 8, 11], [16, 3, 10, 5], [9, 6, 15, 4]]
];
function magic4Random(difficulty) {
  let m = pick(MAGIC4_BASES).map((r) => [...r]);
  const turns = randomInt(0, 3);
  for (let t = 0; t < turns; t += 1) m = m[0].map((_, c) => m.map((r) => r[c]).reverse());
  if (Math.random() < 0.5) m = m.map((r) => [...r].reverse());
  if (Math.random() < 0.5) m = [m[0], m[2], m[1], m[3]].map((r) => [r[0], r[2], r[1], r[3]]);
  const start = randomInt(1, difficulty === 3 ? 6 : 3);
  const step = difficulty === 1 ? 1 : randomInt(1, 2);
  return m.map((r) => r.map((x) => start + (x - 1) * step));
}
const LINES4 = [
  ...[0, 1, 2, 3].map((r) => ({ name: "가로줄", cells: [0, 1, 2, 3].map((c) => r * 4 + c) })),
  ...[0, 1, 2, 3].map((c) => ({ name: "세로줄", cells: [0, 1, 2, 3].map((r) => r * 4 + c) })),
  { name: "대각선", cells: [0, 5, 10, 15] },
  { name: "대각선", cells: [3, 6, 9, 12] }
];
function isMagic4(flat) {
  const s = sum(LINES4[0].cells.map((i) => flat[i]));
  return LINES4.every((l) => sum(l.cells.map((i) => flat[i])) === s);
}

function magicFourCrossClue({ difficulty = 2, mode } = {}) {
  const ask = mode || (difficulty === 1 ? "one" : pick(["one", "pair", "pair"]));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const flat = magic4Random(difficulty).flat();
    if (!isMagic4(flat)) continue;
    const [L1, L2] = shuffle(LINES4).slice(0, 2);
    const shared = L1.cells.filter((i) => L2.cells.includes(i));
    if (shared.length !== 1) continue;
    const X = shared[0];
    const targets = shuffle(L1.cells.filter((i) => i !== X)).slice(0, ask === "pair" ? 2 : 1);
    const shownCells = new Set([...L1.cells, ...L2.cells].filter((i) => i !== X && !targets.includes(i)));
    // 덧붙인 단서(답에는 쓰이지 않음): 0~2칸, 어느 줄도 네 칸이 다 보이지 않게
    shuffle([...Array(16).keys()].filter((i) => !shownCells.has(i) && i !== X && !targets.includes(i)))
      .slice(0, randomInt(0, difficulty === 3 ? 1 : 2)).forEach((i) => shownCells.add(i));
    if (LINES4.some((l) => l.cells.every((i) => shownCells.has(i)))) continue;
    const labels = ask === "pair" ? ["A", "B"] : ["㉠"];
    const shown = flat.map((x, i) => (targets.includes(i) ? labels[targets.indexOf(i)] : shownCells.has(i) ? x : null));
    const l2Known = L2.cells.filter((i) => i !== X).map((i) => flat[i]);
    const l1Known = L1.cells.filter((i) => i !== X && !targets.includes(i)).map((i) => flat[i]);
    const answer = sum(targets.map((i) => flat[i]));
    if (answer !== sum(l2Known) - sum(l1Known)) continue;
    const askText = ask === "pair" ? "A와 B에 들어갈 두 수의 합" : "㉠에 들어갈 수";
    const left = ask === "pair" ? "A+B" : "㉠";
    const lineName = (L) => (L.name === "대각선" ? "대각선" : L.name);
    return {
      prompt: `4×4 정사각형에 가로, 세로, 대각선의 네 수의 합이 모두 같도록 수를 넣었습니다. ${askText}을 구하세요.`,
      visual: { kind: "book9", subtype: "magic-grid", size: 4, shown },
      answer: String(answer),
      solution: `${left}가 있는 ${lineName(L1)}과 수 세 개가 보이는 ${lineName(L2)}은 빈칸 하나를 함께 씁니다. 두 줄의 합이 같으므로 함께 쓰는 빈칸을 빼고 비교하면 ${left}${l1Known.length ? `+${l1Known.join("+")}` : ""} = ${l2Known.join("+")}입니다. 따라서 ${left} = ${sum(l2Known)}${l1Known.length ? `-${sum(l1Known)}` : ""} = ${answer}입니다.`,
      meta: { family: "magic4-cross-b9", ask, flat, shown, targets, X, L1: L1.cells, L2: L2.cells, answer }
    };
  }
  return null;
}

// 삼각진(꼭짓점 3 + 변) — 6칸: 한 변 3칸, 9칸: 한 변 4칸
const TRI_LINES = { 6: [[0, 1, 2], [2, 3, 4], [4, 5, 0]], 9: [[0, 1, 2, 3], [3, 4, 5, 6], [6, 7, 8, 0]] };
const TRI_CORNERS = { 6: [0, 2, 4], 9: [0, 3, 6] };
// 꼭짓점 세 수를 고르고, 남은 수를 변마다 모자란 합이 되게 나누어 모든 배치를 찾는다(돌리기·뒤집기,
// 한 변 안의 차례는 한 가지로 본다). n=6이면 변의 가운데 1칸, n=9이면 2칸.
const triCache = new Map();
function triangleAllWays(values) {
  const key = values.join(",");
  if (triCache.has(key)) return triCache.get(key);
  const m = values.length === 6 ? 1 : 2;
  const total = sum(values);
  const ways = [];
  const seen = new Set();
  const groups = (pool, size, target) => {
    const out = [];
    const walk = (from, chosen, acc) => {
      if (chosen.length === size) { if (acc === target) out.push(chosen); return; }
      for (let i = from; i < pool.length; i += 1) walk(i + 1, [...chosen, pool[i]], acc + pool[i]);
    };
    walk(0, [], 0);
    return out;
  };
  for (let i = 0; i < values.length; i += 1) for (let j = i + 1; j < values.length; j += 1) for (let k = j + 1; k < values.length; k += 1) {
    const corner = [values[i], values[j], values[k]];
    if ((total + sum(corner)) % 3) continue;
    const S = (total + sum(corner)) / 3;
    const rest = values.filter((v) => !corner.includes(v));
    const [a, b, c] = corner;
    groups(rest, m, S - a - b).forEach((g1) => {
      const rest2 = rest.filter((v) => !g1.includes(v));
      groups(rest2, m, S - b - c).forEach((g2) => {
        const g3 = rest2.filter((v) => !g2.includes(v));
        if (sum(g3) !== S - c - a) return;
        const vals = m === 1 ? [a, g1[0], b, g2[0], c, g3[0]] : [a, g1[0], g1[1], b, g2[0], g2[1], c, g3[0], g3[1]];
        const wayKey = triangleWayKey(vals);
        if (seen.has(wayKey)) return;
        seen.add(wayKey);
        ways.push({ S, vals });
      });
    });
  }
  triCache.set(key, ways);
  return ways;
}
// 배치 하나를 「꼭짓점 둘 → 그 사이 수들」로 나타낸 열쇠(돌리기·뒤집기, 변 안 차례를 무시)
function triangleWayKey(vals) {
  return TRI_LINES[vals.length].map((l) => {
    const ends = [vals[l[0]], vals[l[l.length - 1]]].sort((a, b) => a - b);
    const mids = l.slice(1, -1).map((i) => vals[i]).sort((a, b) => a - b);
    return `${ends.join("-")}:${mids.join("-")}`;
  }).sort().join("|");
}
const triangleSums = (values) => [...new Set(triangleAllWays(values).map((w) => w.S))].sort((a, b) => a - b);
// 그림에 놓을 때는 돌리기·뒤집기를 무작위로
function triangleWays(values, S) {
  return triangleAllWays(values).filter((w) => w.S === S).map((w) => {
    const n = w.vals.length;
    const turn = randomInt(0, 2) * (n / 3);
    let vals = w.vals.map((_, i) => w.vals[(i + turn) % n]);
    if (Math.random() < 0.5) vals = vals.map((_, i) => vals[(n - i) % n]);
    return vals;
  });
}
const sideText = (vals) => TRI_LINES[vals.length].map((l) => `(${l.map((i) => vals[i]).join(", ")})`).join(" ");

function triangleSvg(vals, { title, lineSum } = {}) {
  const n = vals.length;
  const pts = n === 6
    ? [[110, 26], [66, 97], [22, 168], [110, 168], [198, 168], [154, 97]]
    : [[110, 22], [80, 71], [50, 120], [20, 168], [83, 168], [137, 168], [200, 168], [170, 120], [140, 71]];
  const corners = TRI_CORNERS[n];
  let body = `<polygon points="${corners.map((i) => pts[i].join(",")).join(" ")}" style="fill:none;stroke:${EDGE};stroke-width:2"/>`;
  pts.forEach(([x, y], i) => {
    body += `<circle cx="${x}" cy="${y}" r="15" style="fill:#fff;stroke:${EDGE};stroke-width:1.8"/>`;
    if (vals[i] !== null && vals[i] !== undefined) body += txt(x, y + 1, vals[i], { size: 15 });
  });
  if (lineSum !== undefined && lineSum !== null) body += txt(110, 128, `합 ${lineSum}`, { size: 13, weight: 600 });
  const svg = svgWrap(220, 190, body, "삼각진");
  return `<figure style="margin:0;display:grid;justify-items:center;gap:4px">${title ? `<figcaption style="font-size:13px;font-weight:700;${FONT}">${title}</figcaption>` : ""}${svg}</figure>`;
}
const cardStrip = (values) => `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:6px">${values.map((v) => `<span style="display:inline-grid;place-items:center;width:28px;height:28px;border:1.5px solid #a87c22;border-radius:5px;background:#fff6d6;font-weight:700;${FONT}">${v}</span>`).join("")}</div>`;
const listEul = (list) => `${list.slice(0, -1).map((v) => `${v}, `).join("")}${eul(list.at(-1))}`;
const cornersOf = (vals) => TRI_CORNERS[vals.length].map((i) => vals[i]).sort((a, b) => a - b);

// (1) 연속한 여섯 수로 한 변 합이 가장 작을 때와 가장 클 때 — 둘 다
// 늘어놓은 여섯 수: 쉬운 단계는 1~6처럼 연속한 수, 그 위로는 시작 수를 바꾸거나 2씩·3씩 커지는 수
function sixValues(difficulty) {
  const start = difficulty === 1 ? pick([1, 2, 3]) : randomInt(1, 9);
  const step = difficulty === 1 ? 1 : difficulty === 2 ? pick([1, 1, 2]) : pick([1, 2, 3]);
  return Array.from({ length: 6 }, (_, i) => start + i * step);
}
const valuesEul = (values) => (values[1] - values[0] === 1 ? `${values[0]}부터 ${values.at(-1)}까지의 수를` : `${values.slice(0, -1).join(", ")}, ${eul(values.at(-1))}`);

function triangleSixMinMax({ difficulty = 2 } = {}) {
  const values = sixValues(difficulty);
  const sums = triangleSums(values);
  const lo = sums[0];
  const hi = sums.at(-1);
  const loWay = triangleWays(values, lo);
  const hiWay = triangleWays(values, hi);
  if (loWay.length !== 1 || hiWay.length !== 1) return null;
  const blank = Array(6).fill(null);
  const total = sum(values);
  return {
    prompt: `삼각형의 꼭짓점과 변에 놓인 ○ 안에 ${valuesEul(values)} 한 번씩 넣어 한 변에 놓인 세 수의 합이 모두 같게 하려고 합니다. 합이 가장 작은 경우와 가장 큰 경우의 삼각진을 각각 완성하고, 그때의 한 변의 합을 구하세요.`,
    visual: { kind: "fig", html: `${cardStrip(values)}${figs([triangleSvg(blank, { title: "(1) 합이 가장 작은 경우" }), triangleSvg(blank, { title: "(2) 합이 가장 큰 경우" })])}` },
    answer: `가장 작은 경우 ${lo}, 가장 큰 경우 ${hi}`,
    answerVisual: { kind: "fig", html: figs([triangleSvg(loWay[0], { title: "(1)", lineSum: lo }), triangleSvg(hiWay[0], { title: "(2)", lineSum: hi })]) },
    responseKind: "drawing",
    solution: `세 변의 합을 모두 더하면 여섯 수의 합 ${total}에 꼭짓점 세 수를 한 번 더 더한 것입니다. 꼭짓점에 가장 작은 세 수 ${listEul(cornersOf(loWay[0]))} 놓으면 한 변의 합은 (${total}+${sum(cornersOf(loWay[0]))})÷3=${lo}, 가장 큰 세 수 ${listEul(cornersOf(hiWay[0]))} 놓으면 (${total}+${sum(cornersOf(hiWay[0]))})÷3=${hi}입니다. 큰 꼭짓점 두 개 사이에는 작은 수가, 작은 꼭짓점 두 개 사이에는 큰 수가 들어갑니다.`,
    meta: { family: "triangle-six-minmax-b9", values, lo, hi, loWay: loWay[0], hiWay: hiWay[0], answer: [lo, hi] }
  };
}

// (2) 연속한 여섯 수로 가운데 두 합(가장 작지도 크지도 않은 합)을 각각 만들기
function triangleSixTwoSums({ difficulty = 2 } = {}) {
  const values = sixValues(difficulty);
  const sums = triangleSums(values);
  const middle = sums.slice(1, -1);
  if (middle.length !== 2) return null;
  const ways = middle.map((S) => triangleWays(values, S));
  if (ways.some((w) => w.length !== 1)) return null;
  const blank = Array(6).fill(null);
  const total = sum(values);
  return {
    prompt: `삼각형의 꼭짓점과 변에 놓인 ○ 안에 ${valuesEul(values)} 한 번씩 넣어, 한 변에 놓인 세 수의 합이 (1) ${middle[0]}, (2) ${middle[1]}인 삼각진을 각각 완성하세요. 각 변의 세 수를 (꼭짓점, 가운데, 꼭짓점)으로 쓰세요.`,
    visual: { kind: "fig", html: `${cardStrip(values)}${figs([triangleSvg(blank, { title: `(1) 합이 ${middle[0]}인 경우` }), triangleSvg(blank, { title: `(2) 합이 ${middle[1]}인 경우` })])}` },
    answer: `(1) ${sideText(ways[0][0])} / (2) ${sideText(ways[1][0])}`,
    answerVisual: { kind: "fig", html: figs([triangleSvg(ways[0][0], { title: "(1)", lineSum: middle[0] }), triangleSvg(ways[1][0], { title: "(2)", lineSum: middle[1] })]) },
    responseKind: "drawing",
    solution: `세 변의 합은 ${total}에 꼭짓점 세 수를 한 번 더 더한 것입니다. 한 변의 합이 ${middle[0]}이면 꼭짓점 세 수의 합은 ${middle[0]}×3-${total}=${middle[0] * 3 - total}이고 이렇게 놓아 각 변이 맞는 꼭짓점은 ${cornersOf(ways[0][0]).join(", ")}입니다. 한 변의 합이 ${middle[1]}이면 꼭짓점의 합은 ${middle[1] * 3 - total}이고 꼭짓점은 ${cornersOf(ways[1][0]).join(", ")}입니다. 꼭짓점을 놓은 뒤 각 변에 모자란 수를 채웁니다.`,
    meta: { family: "triangle-six-two-sums-b9", values, sums: middle, ways: ways.map((w) => w[0]), answer: middle }
  };
}

// (3) 1~9로 한 변의 네 수 합이 가장 작을 때·가장 클 때·주어진 합일 때 — 짝짓는 방법을 모두
function triangleNineAllWays({ difficulty = 2, mode } = {}) {
  const startAt = difficulty === 1 ? pick([1, 2]) : difficulty === 2 ? pick([1, 1, 2, 3]) : randomInt(1, 6);
  const values = Array.from({ length: 9 }, (_, i) => startAt + i);
  const total = sum(values);
  const sums = triangleSums(values);
  const want = mode || (difficulty === 1 ? pick(["min", "max"]) : pick(["min", "max", "target"]));
  let S;
  if (want === "min") S = sums[0];
  else if (want === "max") S = sums.at(-1);
  else {
    const options = sums.slice(1, -1).filter((s) => { const n = triangleWays(values, s).length; return n >= 2 && n <= 3; });
    if (!options.length) return null;
    S = pick(options);
  }
  const ways = triangleWays(values, S);
  if (ways.length < 1 || ways.length > 3) return null;
  const blank = Array(9).fill(null);
  const corners = cornersOf(ways[0]);
  const sameCorners = ways.every((w) => cornersOf(w).join() === corners.join());
  const askText = want === "min" ? "네 수의 합이 가장 작을 때" : want === "max" ? "네 수의 합이 가장 클 때" : `네 수의 합이 모두 ${S}일 때`;
  return {
    prompt: `삼각형의 ○ 안에 ${values[0]}부터 ${values.at(-1)}까지의 수를 한 번씩 넣어 한 변에 놓인 네 수의 합이 모두 같게 하려고 합니다. ${askText}의 삼각진을 모두 완성하세요. (뒤집거나 돌려서 같은 것과 한 변 가운데 두 수의 자리만 바꾼 것은 한 가지로 보면 모두 ${ways.length}가지입니다.)`,
    visual: { kind: "fig", html: `${cardStrip(values)}${figs(ways.map((_, i) => triangleSvg(blank, { title: `방법 ${i + 1}` })))}` },
    answer: `${want === "target" ? "" : `한 변의 합 ${S} · `}${ways.map((w, i) => `방법 ${i + 1} ${sideText(w)}`).join(" · ")}`,
    answerVisual: { kind: "fig", html: figs(ways.map((w, i) => triangleSvg(w, { title: `방법 ${i + 1}`, lineSum: S }))) },
    responseKind: "drawing",
    solution: `세 변의 합은 아홉 수의 합 ${total}에 꼭짓점 세 수를 한 번 더 더한 것이므로, 한 변의 합이 ${S}이면 꼭짓점의 합은 ${S}×3-${total}=${S * 3 - total}입니다.${sameCorners ? ` 꼭짓점은 ${corners.join(", ")}입니다.` : ""} 꼭짓점을 놓고 남은 여섯 수를 각 변에 모자란 합이 되도록 두 개씩 짝지으면 ${ways.map((w) => sideText(w)).join(", ")}의 ${ways.length}가지입니다.`,
    meta: { family: "triangle-nine-ways-b9", want, values, S, ways, answer: S }
  };
}

// ── 4단원 · 논리 추리 ─────────────────────────────────

const KIDS = ["가람", "나연", "도현", "라희", "민호", "보람", "서진", "아린", "유찬", "은솔", "재윤", "지아", "태오", "하준", "해솔", "다온"];

// (1) 기준이 없는 섞인 방향의 차 — 한 사람을 10처럼 편한 수로 두고 나머지를 차례로 구한다.
const GAP_CONTEXTS = [
  { key: "race", intro: (names) => `${names.join(", ")}${has(names.at(-1)) ? "이" : "가"} 달리기를 하고 있습니다.`, unit: "m", more: "앞에", less: "뒤에", ask: (a, b) => `${wa(a)} ${b} 사이의 거리는 몇 m인지 구하세요.`, phrase: (x, y, d, up) => `${eun(x)} ${y}보다 ${d}m ${up ? "앞에" : "뒤에"} 있습니다.` },
  { key: "stairs", intro: (names) => `${names.join(", ")}${has(names.at(-1)) ? "이" : "가"} 계단에 서 있습니다.`, unit: "계단", more: "위", less: "아래", ask: (a, b) => `${eun(a)} ${b}보다 몇 계단 ${"위"}에 있는지 구하세요.`, phrase: (x, y, d, up) => `${eun(x)} ${y}보다 ${d}계단 ${up ? "위에" : "아래에"} 있습니다.` },
  { key: "time", intro: (names) => `${names.join(", ")}${has(names.at(-1)) ? "이" : "가"} 달리기 시합을 했습니다.`, unit: "초", more: "먼저", less: "늦게", ask: (a, b) => `${eun(a)} ${b}보다 몇 초 먼저 들어왔는지 구하세요.`, phrase: (x, y, d, up) => `${eun(x)} ${y}보다 ${d}초 ${up ? "먼저" : "늦게"} 들어왔습니다.` },
  { key: "stick", intro: (names) => `막대 ${names.join(", ")}의 길이를 비교했습니다.`, unit: "cm", more: "더 깁니다", less: "더 짧습니다", ask: (a, b) => `${wa(a)} ${b}의 길이는 몇 cm 차이가 나는지 구하세요.`, phrase: (x, y, d, up) => `${eun(x)} ${y}보다 ${d}cm ${up ? "더 깁니다" : "더 짧습니다"}.` }
];

function mixedDirectionGap({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const ctx = pick(GAP_CONTEXTS);
    const n = difficulty === 1 ? 4 : pick([4, 5]);
    const names = ctx.key === "stick" ? MARKS.slice(0, n) : shuffle(KIDS).slice(0, n);
    // 자리(클수록 앞·위·먼저·김) — 서로 다른 수
    const pos = shuffle(Array.from({ length: 14 }, (_, i) => i + 1)).slice(0, n);
    // 무작위로 이은 나무 모양(사람 n명, 조건 n−1개)
    const order = shuffle([...Array(n).keys()]);
    const edges = [];
    for (let i = 1; i < n; i += 1) edges.push([order[i], order[randomInt(0, i - 1)]]);
    if (edges.some(([a, b]) => Math.abs(pos[a] - pos[b]) > 9)) continue;
    // 조건 글: 방향을 섞는다(앞/뒤 둘 다 나오게)
    const clues = edges.map(([a, b]) => {
      const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
      return { x, y, d: Math.abs(pos[x] - pos[y]), up: pos[x] > pos[y] };
    });
    if (clues.every((c) => c.up) || clues.every((c) => !c.up)) continue;
    // 묻는 두 사람: 조건으로 바로 이어지지 않은 사람(길이 2 이상)
    const adj = Array.from({ length: n }, () => []);
    edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    const dist = (s) => { const d = Array(n).fill(-1); d[s] = 0; const q = [s]; while (q.length) { const v = q.shift(); adj[v].forEach((w) => { if (d[w] < 0) { d[w] = d[v] + 1; q.push(w); } }); } return d; };
    const pairs = [];
    const need = difficulty === 1 || n === 4 ? 2 : 3;
    for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1) if (dist(a)[b] >= need) pairs.push([a, b]);
    if (!pairs.length) continue;
    let [a, b] = pick(pairs);
    if (ctx.key !== "race" && ctx.key !== "stick" && pos[a] < pos[b]) [a, b] = [b, a];
    const answer = Math.abs(pos[a] - pos[b]);
    if (answer === 0) continue;
    // 풀이: 첫 조건의 사람을 편한 수로 두고 차례로 구한다
    const base = order[0];
    const lowest = Math.min(...pos);
    const anchor = Math.max(10, Math.ceil((pos[base] - lowest + 1) / 10) * 10);
    const val = pos.map((p) => p - pos[base] + anchor);
    const unit = ctx.unit;
    return {
      prompt: `${ctx.intro(names)} 조건을 보고 ${ctx.ask(names[a], names[b])}`,
      visual: { kind: "book9", subtype: "condition-list", conditions: shuffle(clues).map((c) => ctx.phrase(names[c.x], names[c.y], c.d, c.up)) },
      answer: `${answer}${unit}`,
      solution: `기준이 되는 값이 없으므로 ${names[base]}의 자리를 ${anchor}${unit}라고 두고 조건을 하나씩 따라가면 ${names.map((nm, i) => `${nm} ${val[i]}`).join(", ")}입니다. ${wa(names[a])} ${names[b]}의 차는 ${Math.max(val[a], val[b])}-${Math.min(val[a], val[b])}=${answer}${unit}입니다.`,
      meta: { family: "mixed-gap-b9", ctx: ctx.key, names, pos, clues, asked: [a, b], answer }
    };
  }
  return null;
}

// (2) 값 목록 + 차이 조건과 순서만 있는 조건 섞기 — 모든 경우를 넣어 보아 묻는 사람의 값이 하나뿐인지 확인
const VALUE_CONTEXTS = [
  { key: "height", unit: "cm", noun: "키", start: [128, 152], more: "큽니다", moreAnd: "크고", lessWord: "작습니다", subj: (x) => `${callName(x)}의 키는` },
  { key: "weight", unit: "kg", noun: "몸무게", start: [28, 48], more: "무겁습니다", moreAnd: "무겁고", lessWord: "가볍습니다", subj: (x) => `${x}의 몸무게는` }
];
function valueListMixedClues({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const ctx = pick(VALUE_CONTEXTS);
    const n = difficulty === 1 ? 5 : pick([5, 6]);
    const names = ctx.key === "weight" ? ["A", "B", "C", "D", "E", "F"].slice(0, n) : shuffle(KIDS).slice(0, n);
    const values = [randomInt(ctx.start[0], ctx.start[1])];
    while (values.length < n) values.push(values.at(-1) + pick([1, 2, 1, 2, 3]));
    const truth = shuffle([...values]);
    const pool = [];
    for (let x = 0; x < n; x += 1) for (let y = 0; y < n; y += 1) {
      const d = truth[x] - truth[y];
      if (d >= 1 && d <= 3) pool.push({ kind: "diff", x, y, d });
    }
    for (let z = 0; z < n; z += 1) for (let y = 0; y < n; y += 1) for (let u = 0; u < n; u += 1) for (let w = u + 1; w < n; w += 1) {
      if (new Set([z, y, u, w]).size === 4 && truth[y] < truth[z] && truth[z] < Math.min(truth[u], truth[w])) pool.push({ kind: "between", z, y, u, w });
    }
    const diffs = shuffle(pool.filter((c) => c.kind === "diff")).slice(0, 2);
    const between = pick(pool.filter((c) => c.kind === "between"));
    if (diffs.length < 2 || !between) continue;
    const clues = [...diffs, between];
    const holds = (vals, c) => (c.kind === "diff" ? vals[c.x] - vals[c.y] === c.d : vals[c.y] < vals[c.z] && vals[c.z] < Math.min(vals[c.u], vals[c.w]));
    const sols = permutations(values).filter((vals) => clues.every((c) => holds(vals, c)));
    const mentioned = new Set(clues.flatMap((c) => (c.kind === "diff" ? [c.x, c.y] : [c.z, c.y, c.u, c.w])));
    const fixed = [...Array(n).keys()].filter((i) => sols.every((s) => s[i] === sols[0][i]));
    const unmentioned = fixed.filter((i) => !mentioned.has(i));
    let target;
    if (difficulty >= 2 && unmentioned.length) target = pick(unmentioned);
    else if (fixed.length) target = pick(fixed);
    else continue;
    if (difficulty >= 2 && mentioned.has(target) && unmentioned.length === 0 && Math.random() < 0.5) continue;
    const say = (c) => (c.kind === "diff"
      ? `${ctx.subj(names[c.x])} ${callName(names[c.y])}의 ${ctx.noun}보다 ${c.d}${ctx.unit} 더 ${ctx.more}.`
      : `${cnEun(names[c.z])} ${callName(names[c.y])}보다 ${ctx.moreAnd}, ${cnWa(names[c.u])} ${callName(names[c.w])}보다는 ${ctx.lessWord}.`);
    const answer = truth[target];
    return {
      prompt: `${names.join(", ")}의 ${ctx.noun}는 ${values.map((v) => `${v}${ctx.unit}`).join(", ")} 중 하나이고 모두 다릅니다. 조건을 보고 ${callName(names[target])}의 ${eul(ctx.noun)} 구하세요.`,
      visual: { kind: "book9", subtype: "condition-list", conditions: clues.map(say), cards: values.map((v) => `${v}${ctx.unit}`) },
      answer: `${answer}${ctx.unit}`,
      solution: `차이가 정해진 두 짝(${diffs.map((c) => `${names[c.x]}·${names[c.y]} ${c.d}${ctx.unit}`).join(", ")})은 값 목록에서 그만큼 떨어진 두 수에만 놓일 수 있습니다. 짝마다 가능한 자리를 놓고 순서 조건(${names[between.y]} < ${names[between.z]} < ${names[between.u]}, ${names[between.w]})에 맞는 것만 남기면 ${sols.length === 1 ? `${sols[0].map((v, i) => `${names[i]} ${v}${ctx.unit}`).join(", ")}이고, ` : "어느 경우에도 "}${callName(names[target])}의 ${eun(ctx.noun)} ${answer}${ctx.unit}입니다.`,
      meta: { family: "value-list-mixed-b9", ctx: ctx.key, names, values, truth, clues, target, solutions: sols.length, answer }
    };
  }
  return null;
}

// (3) 둥근 탁자 — 자리는 시계 방향 번호. 탁자를 보고 앉은 사람의 오른쪽 = 시계 반대 방향 바로 옆.
function seatSolutions(n, names, clues) {
  const out = [];
  permutations([...Array(n - 1).keys()].map((i) => i + 1)).forEach((rest) => {
    const seatOf = [0, ...rest];
    if (clues.every((c) => seatHolds(n, seatOf, c))) out.push(seatOf);
  });
  return out;
}
const gapOf = (n, s, t) => { const d = (((s - t) % n) + n) % n; return Math.min(d, n - d); };
function seatHolds(n, seatOf, c) {
  const s = seatOf[c.a];
  const t = c.b === undefined ? null : seatOf[c.b];
  switch (c.kind) {
    case "right": return t === (s - 1 + n) % n;
    case "left": return t === (s + 1) % n;
    case "notRight": return t !== (s - 1 + n) % n;
    case "adjacent": return gapOf(n, s, t) === 1;
    case "apart": return gapOf(n, s, t) !== 1;
    case "facing": return gapOf(n, s, t) === n / 2;
    case "oneBetween": return gapOf(n, s, t) === 2;
    case "between": { const m = seatOf[c.m]; return gapOf(n, m, s) === 1 && gapOf(n, m, t) === 1; }
    default: return false;
  }
}
function seatClueText(c, names) {
  const A = names[c.a];
  const B = c.b === undefined ? "" : names[c.b];
  switch (c.kind) {
    case "right": return `${callName(A)}의 오른쪽에는 ${iga(B)} 앉아 있습니다.`;
    case "left": return `${callName(A)}의 왼쪽에는 ${iga(B)} 앉아 있습니다.`;
    case "notRight": return `${callName(A)}의 오른쪽에 앉은 사람은 ${B}${has(B) ? "이" : "가"} 아닙니다.`;
    case "adjacent": return `${cnWa(A)} ${eun(callName(B))} 이웃하여 앉아 있습니다.`;
    case "apart": return `${cnWa(A)} ${eun(callName(B))} 이웃하여 앉아 있지 않습니다.`;
    case "facing": return `${cnWa(A)} ${eun(callName(B))} 서로 마주 보고 앉아 있습니다.`;
    case "oneBetween": return `${cnWa(A)} ${callName(B)} 사이에는 한 사람이 앉아 있습니다.`;
    case "between": return `${eun(callName(names[c.m]))} ${cnWa(A)} ${callName(B)} 사이에 앉아 있습니다.`;
    default: return "";
  }
}

function roundTableSvg(n, labels) {
  const R = 78;
  const cx = 120;
  const cy = 112;
  let body = `<circle cx="${cx}" cy="${cy}" r="${R - 30}" style="fill:#f3ead6;stroke:#a88b57;stroke-width:1.6"/>` + txt(cx, cy, "탁자", { size: 13, weight: 600 });
  for (let i = 0; i < n; i += 1) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="21" style="fill:#fff;stroke:${EDGE};stroke-width:1.6"/>`;
    if (labels[i]) body += txt(x.toFixed(1), (y + 1).toFixed(1), labels[i], { size: 13 });
  }
  return svgWrap(240, 224, body, "둥근 탁자 자리");
}

function roundTableMixed({ difficulty = 2, size } = {}) {
  const n = size || (difficulty === 1 ? 5 : pick([5, 6]));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const names = shuffle(KIDS).slice(0, n);
    const seatOf = [0, ...shuffle([...Array(n - 1).keys()].map((i) => i + 1))];
    const who = []; seatOf.forEach((s, p) => { who[s] = p; });
    // 묻는 꼴
    const askKinds = n === 6 ? ["between", "facing", "left", "fill"] : ["between", "left", "right"];
    const ask = pick(askKinds);
    const pool = [];
    for (let a = 0; a < n; a += 1) for (let b = 0; b < n; b += 1) {
      if (a === b) continue;
      const g = gapOf(n, seatOf[a], seatOf[b]);
      if (seatOf[b] === (seatOf[a] - 1 + n) % n) pool.push({ kind: "right", a, b, w: 1 });
      else pool.push({ kind: "notRight", a, b, w: 0.4 });
      if (seatOf[b] === (seatOf[a] + 1) % n) pool.push({ kind: "left", a, b, w: 0.6 });
      if (a < b) {
        if (g === 1) pool.push({ kind: "adjacent", a, b, w: 0.8 });
        else pool.push({ kind: "apart", a, b, w: 1.4 });
        if (n === 6 && g === 3) pool.push({ kind: "facing", a, b, w: 2.2 });
        if (n === 6 && g === 2) pool.push({ kind: "oneBetween", a, b, w: 1.8 });
      }
    }
    for (let m = 0; m < n; m += 1) {
      const l = who[(seatOf[m] + 1) % n];
      const r = who[(seatOf[m] - 1 + n) % n];
      pool.push({ kind: "between", m, a: l, b: r, w: 1.2 });
    }
    // 무게를 둔 무작위 차례로 조건을 더하다가 답이 하나가 되면 멈추고, 빼도 되는 조건은 뺀다
    const ordered = pool.map((c) => ({ c, key: Math.random() ** (1 / c.w) })).sort((x, y) => y.key - x.key).map((x) => x.c);
    const target = randomInt(0, n - 1);
    const answerOf = (sol) => {
      const w = []; sol.forEach((s, p) => { w[s] = p; });
      if (ask === "between") return [w[(sol[target] + 1) % n], w[(sol[target] - 1 + n) % n]].sort().join(",");
      if (ask === "facing") return String(w[(sol[target] + n / 2) % n]);
      if (ask === "left") return String(w[(sol[target] + 1) % n]);
      if (ask === "right") return String(w[(sol[target] - 1 + n) % n]);
      return sol.join(",");
    };
    const chosen = [];
    let sols = null;
    for (const c of ordered) {
      if (chosen.length >= 6) break;
      // 묻는 것을 그대로 말하는 조건은 쓰지 않는다
      if (ask === "between" && c.kind === "between" && c.m === target) continue;
      if ((ask === "left" || ask === "right") && (c.kind === "left" || c.kind === "right") && (c.a === target || c.b === target)) continue;
      if (ask === "facing" && c.kind === "facing" && (c.a === target || c.b === target)) continue;
      chosen.push(c);
      sols = seatSolutions(n, names, chosen);
      const answers = new Set(sols.map(answerOf));
      if (answers.size === 1 && (ask !== "fill" || sols.length === 1)) break;
    }
    if (!sols || new Set(sols.map(answerOf)).size !== 1 || (ask === "fill" && sols.length !== 1)) continue;
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      const trial = chosen.filter((_, j) => j !== i);
      const s2 = seatSolutions(n, names, trial);
      if (s2.length && new Set(s2.map(answerOf)).size === 1 && (ask !== "fill" || s2.length === 1)) chosen.splice(i, 1);
    }
    if (chosen.length < 3) continue;
    const kinds = new Set(chosen.map((c) => c.kind));
    const want = n === 6 ? ["facing", "oneBetween"] : ["apart", "notRight"];
    if (!want.some((k) => kinds.has(k))) continue;
    sols = seatSolutions(n, names, chosen);
    const T = names[target];
    const answerNames = answerOf(sols[0]).split(",").map((i) => names[Number(i)]);
    let prompt;
    let answer;
    if (ask === "between") { prompt = `${callName(T)}는 누구와 누구 사이에 앉아 있는지 구하세요.`; answer = `${answerNames[0]}, ${answerNames[1]}`; }
    else if (ask === "facing") { prompt = `${wa(callName(T))} 마주 보고 앉아 있는 사람은 누구인지 구하세요.`; answer = answerNames[0]; }
    else if (ask === "left") { prompt = `${callName(T)}의 왼쪽에 앉아 있는 사람은 누구인지 구하세요.`; answer = answerNames[0]; }
    else if (ask === "right") { prompt = `${callName(T)}의 오른쪽에 앉아 있는 사람은 누구인지 구하세요.`; answer = answerNames[0]; }
    else { prompt = `${callName(names[0])}의 자리를 보고 나머지 사람의 자리를 모두 써넣으세요.`; answer = sols[0].map((s, p) => [s, names[p]]).sort((x, y) => x[0] - y[0]).map(([, nm]) => nm).join(" → "); }
    const final = []; sols[0].forEach((s, p) => { final[s] = names[p]; });
    const shownLabels = Array(n).fill("");
    if (ask === "fill") shownLabels[0] = names[0];
    return {
      prompt: `${names.join(", ")}${has(names.at(-1)) ? "이" : "가"} 둥근 탁자에 둘러앉아 있습니다. (오른쪽·왼쪽은 탁자를 바라보고 앉은 사람 쪽에서 말합니다.) 조건을 보고 ${prompt}`,
      visual: { kind: "fig", html: `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center"><ol style="margin:0;padding-left:20px;line-height:1.7;${FONT};font-size:15px">${chosen.map((c) => `<li>${seatClueText(c, names)}</li>`).join("")}</ol>${roundTableSvg(n, shownLabels)}</div>` },
      answer,
      answerVisual: { kind: "fig", html: roundTableSvg(n, final) },
      solution: `조건이 가장 분명한 두 사람을 먼저 그림에 놓고, 나머지 조건에 맞지 않는 자리를 지워 가면 시계 방향으로 ${final.join(" → ")} 차례로 앉습니다.${sols.length > 1 ? " (좌우를 뒤집은 자리도 조건에 맞지만 답은 같습니다.)" : ""} 따라서 답은 ${answer}입니다.`,
      meta: { family: "round-table-b9", n, names, ask, target, clues: chosen, seatOf: sols[0], solutions: sols.length, answer }
    };
  }
  return null;
}

// ── 2단원 · 쌓기나무 ───────────────────────────────────

const frontOf = (map) => map[0].map((_, c) => Math.max(...map.map((r) => r[c])));
const rightOf = (map) => map.map((r) => Math.max(...r)).reverse();     // 오른쪽 옆: 앞줄이 왼쪽
const leftOf = (map) => map.map((r) => Math.max(...r));                // 왼쪽 옆: 뒷줄이 왼쪽
const footprint = (map) => map.map((r) => r.map((v) => (v > 0 ? 1 : 0)));

function viewBlocks(heights, { label, unit = 22, color = "#ffd45c" }) {
  const max = Math.max(1, ...heights);
  let body = "";
  heights.forEach((h, c) => { for (let k = 0; k < h; k += 1) body += `<rect x="${2 + c * unit}" y="${2 + (max - 1 - k) * unit}" width="${unit}" height="${unit}" style="fill:${color};stroke:#9a6a12;stroke-width:1.4"/>`; });
  return `<figure style="margin:0;display:grid;justify-items:center;gap:4px">${svgWrap(heights.length * unit + 4, max * unit + 4, body, label)}<figcaption style="font-size:13px;font-weight:700;${FONT}">${label}</figcaption></figure>`;
}
function topBlocks(map, { label = "위", unit = 22, numbers = false } = {}) {
  let body = "";
  map.forEach((r, i) => r.forEach((v, j) => {
    if (!v) return;
    body += `<rect x="${2 + j * unit}" y="${2 + i * unit}" width="${unit}" height="${unit}" style="fill:#ffeaa6;stroke:#9a6a12;stroke-width:1.4"/>`;
    if (numbers) body += txt(2 + j * unit + unit / 2, 2 + i * unit + unit / 2 + 1, v, { size: 12 });
  }));
  return `<figure style="margin:0;display:grid;justify-items:center;gap:4px">${svgWrap(map[0].length * unit + 4, map.length * unit + 4, body, label)}<figcaption style="font-size:13px;font-weight:700;${FONT}">${label}</figcaption></figure>`;
}

// 위 모양·앞·옆(왼쪽 또는 오른쪽)으로 만들 수 있는 모든 쌓기 — 개수의 가장 작은 값·가장 큰 값
function viewBounds(top, front, sideHeights, sideIsLeft) {
  const rows = top.length;
  const cols = top[0].length;
  const cells = [];
  top.forEach((r, i) => r.forEach((v, j) => { if (v) cells.push([i, j]); }));
  const sideOfRow = (i) => (sideIsLeft ? sideHeights[i] : sideHeights[rows - 1 - i]);
  const cur = top.map((r) => r.map(() => 0));
  let lo = Infinity;
  let hi = -Infinity;
  let count = 0;
  const visit = (k) => {
    if (k === cells.length) {
      for (let j = 0; j < cols; j += 1) if (Math.max(...cur.map((r) => r[j])) !== front[j]) return;
      for (let i = 0; i < rows; i += 1) if (Math.max(...cur[i]) !== sideOfRow(i)) return;
      const total = sum(cur.flat());
      lo = Math.min(lo, total);
      hi = Math.max(hi, total);
      count += 1;
      return;
    }
    const [i, j] = cells[k];
    const cap = Math.min(front[j], sideOfRow(i));
    for (let h = 1; h <= cap; h += 1) { cur[i][j] = h; visit(k + 1); }
    cur[i][j] = 0;
  };
  visit(0);
  return { lo, hi, count };
}

function cubeLeftViewProblem(mode, { difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const rows = difficulty === 1 ? 2 : pick([2, 3, 3]);
    const cols = difficulty === 1 ? 3 : pick([3, 3, 4]);
    const maxH = difficulty === 1 ? 2 : 3;
    const map = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() < 0.2 ? 0 : randomInt(1, maxH))));
    const top = footprint(map);
    if (top.some((r) => !r.some(Boolean)) || top[0].some((_, j) => !top.some((r) => r[j]))) continue;
    const front = frontOf(map);
    const left = leftOf(map);
    const bounds = viewBounds(top, front, left, true);
    if (mode === "count" && bounds.lo !== bounds.hi) continue;
    if (mode === "minmax" && (bounds.lo === bounds.hi || bounds.hi - bounds.lo > 9)) continue;
    // 최대: 칸마다 앞과 옆 중 작은 수
    const maxMap = map.map((r, i) => r.map((v, j) => (v ? Math.min(front[j], left[i]) : 0)));
    const html = figs([topBlocks(top), viewBlocks(front, { label: "앞" }), viewBlocks(left, { label: "왼쪽 옆", color: "#f0b23a" })]);
    if (mode === "count") {
      return {
        prompt: "쌓기나무로 쌓은 모양을 위, 앞, 왼쪽 옆에서 본 모양입니다. 위에서 본 모양의 각 칸에 쌓인 개수를 생각하여 쌓기나무의 개수를 구하세요. (왼쪽 옆 그림은 왼쪽에서 보았으므로 뒷줄이 왼쪽에 보입니다.)",
        visual: { kind: "fig", html },
        answer: `${bounds.lo}개`,
        answerVisual: { kind: "fig", html: topBlocks(maxMap, { label: "위(쌓인 개수)", numbers: true }) },
        solution: `앞에서 본 층수를 세로줄 아래에, 왼쪽 옆에서 본 층수를 가로줄 옆에 적습니다. 왼쪽 옆 그림은 뒷줄부터 ${left.join(", ")}층입니다. 1이 있는 줄은 모두 1, 한 칸뿐인 줄은 그 수를 쓰고 남은 칸을 맞추면 뒷줄부터 ${maxMap.map((r) => r.filter(Boolean).join("·")).join(", ")}개씩이므로 모두 ${bounds.lo}개입니다.`,
        meta: { family: "cube-left-view-b9", mode, map, top, front, left, lo: bounds.lo, hi: bounds.hi, answer: bounds.lo }
      };
    }
    return {
      prompt: "쌓기나무로 쌓은 모양을 위, 앞, 왼쪽 옆에서 본 모양입니다. 이 모양을 만드는 데 필요한 쌓기나무는 가장 많을 때와 가장 적을 때 각각 몇 개인지 구하세요. (왼쪽 옆 그림은 왼쪽에서 보았으므로 뒷줄이 왼쪽에 보입니다.)",
      visual: { kind: "fig", html },
      answer: `최대 ${bounds.hi}개, 최소 ${bounds.lo}개`,
      answerVisual: { kind: "fig", html: topBlocks(maxMap, { label: "가장 많을 때", numbers: true }) },
      solution: `가장 많을 때는 위에서 본 칸마다 앞과 왼쪽 옆의 층수 중 작은 수만큼 쌓으므로 ${sum(maxMap.flat())}개입니다. 가장 적을 때는 앞과 옆에서 보이는 가장 높은 층을 한 번씩만 맞추고 나머지 칸은 1개씩 쌓으므로 ${bounds.lo}개입니다.`,
      meta: { family: "cube-left-view-b9", mode, map, top, front, left, lo: bounds.lo, hi: bounds.hi, answer: [bounds.hi, bounds.lo] }
    };
  }
  return null;
}

// 4×4 바탕 위 네 층 — 층별 모양을 보고 앞·오른쪽 옆 모양
function cubeFourLayerViews({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const map = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => (Math.random() < 0.18 ? 0 : randomInt(1, 4))));
    if (Math.max(...map.flat()) !== 4) continue;
    if (sum(map.flat().map((v) => (v ? 1 : 0))) < (difficulty === 1 ? 9 : 11)) continue;
    const layers = [0, 1, 2, 3].map((k) => map.map((r) => r.map((v) => (v > k ? 1 : 0))));
    if (layers[3].flat().filter(Boolean).length > 4) continue;
    const front = frontOf(map);
    const side = rightOf(map);
    return {
      prompt: "쌓기나무를 4층으로 쌓았을 때 각 층을 위에서 본 모양입니다. 앞과 오른쪽 옆에서 본 모양을 각각 그리세요.",
      visual: { kind: "book9", subtype: "cube-layers", layers, blankProfiles: { frontColumns: 4, sideColumns: 4, rows: 4 } },
      answer: `앞 ${front.join("-")} / 옆 ${side.join("-")}`,
      answerVisual: { kind: "book9", subtype: "cube-layers", layers, front, side },
      responseKind: "drawing",
      solution: `층별 그림을 겹쳐 보면 칸마다 몇 층까지 있는지 알 수 있습니다. 앞에서는 세로줄마다 가장 높은 층이 보여 왼쪽부터 ${front.join(", ")}층, 오른쪽 옆에서는 앞줄부터 ${side.join(", ")}층으로 그립니다.`,
      meta: { family: "cube-four-layers-b9", map, layers, front, side, answer: [front, side] }
    };
  }
  return null;
}

// 입체 그림 → 위 모양(칸마다 쌓인 수)과 앞·오른쪽 옆 모양, 최소 개수
// 뒤·왼쪽 칸이 앞·오른쪽 칸보다 낮지 않게 쌓아 모든 윗면이 보이게 한다(보이지 않는 칸이 없어 최소 개수가 정해진다).
function cubeSolidTopNumbers({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rows = difficulty === 1 ? 2 : pick([2, 3]);
    const cols = difficulty === 1 ? 3 : pick([3, 4]);
    const maxH = difficulty === 3 ? 4 : 3;
    const map = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < rows; i += 1) for (let j = 0; j < cols; j += 1) {
      const cap = Math.min(i ? map[i - 1][j] : maxH, j ? map[i][j - 1] : maxH);
      map[i][j] = randomInt(i === 0 && j === 0 ? 1 : 0, cap);
    }
    const top = footprint(map);
    if (top.some((r) => !r.some(Boolean)) || top[0].some((_, j) => !top.some((r) => r[j]))) continue;
    if (new Set(map.flat().filter(Boolean)).size < 2) continue;
    const total = sum(map.flat());
    if (total < (difficulty === 1 ? 5 : 8)) continue;
    const front = frontOf(map);
    const side = rightOf(map);
    return {
      prompt: "쌓기나무로 쌓은 모양입니다. 위, 앞, 오른쪽 옆에서 본 모양을 그리고, 위에서 본 모양의 각 칸에 쌓인 쌓기나무의 개수를 써넣은 뒤 쌓기나무의 최소 개수를 구하세요.",
      visual: { kind: "book9", subtype: "cube-solid-views", map, blankProfiles: { frontColumns: cols, sideColumns: rows, rows: Math.max(...map.flat()) } },
      answer: `${total}개`,
      answerVisual: { kind: "fig", html: figs([topBlocks(map, { label: "위(쌓인 개수)", numbers: true }), viewBlocks(front, { label: "앞" }), viewBlocks(side, { label: "오른쪽 옆", color: "#f0b23a" })]) },
      responseKind: "drawing",
      solution: `위에서 본 모양은 1층의 모양과 같습니다. 각 칸에 그 자리에 쌓인 개수를 쓰면 뒷줄부터 ${map.map((r) => r.filter(Boolean).join("·")).join(", ")}개씩이고, 앞에서는 세로줄마다 가장 높은 층(${front.join(", ")}), 오른쪽 옆에서는 앞줄부터 가장 높은 층(${side.join(", ")})을 그립니다. 칸의 수를 모두 더하면 ${total}개입니다.`,
      meta: { family: "cube-solid-top-b9", map, front, side, total, answer: total }
    };
  }
  return null;
}

// ── (2차) 1단원 · 도형을 같은 조각으로 나누어 그리기 ──────────────
// 칸(정사각형 · 정사각형을 대각선으로 4등분한 직각삼각형 · 정삼각형)으로 된 도형을 다룬다. 칸은 꼭짓점 좌표(정수)의 목록이다.
//   sq  — 정사각형 칸, 꼭짓점 (x, y)
//   tet — 정사각형을 두 대각선으로 4등분한 직각이등변삼각형 칸, 좌표는 2배(모서리 짝수, 가운데 홀수)
//   tri — 정삼각형 칸, 좌표는 비스듬한 두 축(a, b): 화면 x = a + b/2, y = −b·(√3/2)
// 모양이 같은지는 돌리기·뒤집기·옮기기를 모두 해 본 가장 작은 열쇠로 비교한다.
const SQ_T = [([x, y]) => [x, y], ([x, y]) => [-x, y], ([x, y]) => [x, -y], ([x, y]) => [-x, -y], ([x, y]) => [y, x], ([x, y]) => [-y, x], ([x, y]) => [y, -x], ([x, y]) => [-y, -x]];
const TRI_T = (() => {
  const r = ([a, b]) => [-b, a + b];
  const f = ([a, b]) => [b, a];
  const out = [];
  for (let k = 0; k < 6; k += 1) {
    out.push((p) => { let q = p; for (let i = 0; i < k; i += 1) q = r(q); return q; });
    out.push((p) => { let q = f(p); for (let i = 0; i < k; i += 1) q = r(q); return q; });
  }
  return out;
})();
const LATTICE = {
  sq: { step: 1, T: SQ_T, screen: ([x, y]) => [x, y], cellsIn: (x0, y0, x1, y1) => { const out = []; for (let i = x0; i < x1; i += 1) for (let j = y0; j < y1; j += 1) out.push([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]); return out; } },
  tet: { step: 2, T: SQ_T, screen: ([x, y]) => [x / 2, y / 2], cellsIn: (x0, y0, x1, y1) => { const out = []; for (let i = x0; i < x1; i += 1) for (let j = y0; j < y1; j += 1) { const c = [[2 * i, 2 * j], [2 * i + 2, 2 * j], [2 * i + 2, 2 * j + 2], [2 * i, 2 * j + 2]]; const m = [2 * i + 1, 2 * j + 1]; for (let k = 0; k < 4; k += 1) out.push([c[k], c[(k + 1) % 4], m]); } return out; } },
  tri: { step: 1, T: TRI_T, screen: ([a, b]) => [a + b / 2, -b * Math.sqrt(3) / 2], cellsIn: (x0, y0, x1, y1) => { const out = []; for (let i = x0; i < x1; i += 1) for (let j = y0; j < y1; j += 1) { out.push([[i, j], [i + 1, j], [i, j + 1]]); out.push([[i + 1, j], [i + 1, j + 1], [i, j + 1]]); } return out; } }
};
const ptKey = (p) => p.join(",");
const cellKey = (pts) => pts.map(ptKey).sort().join("|");

function shapeKey(lat, cells) {
  const L = LATTICE[lat];
  let best = null;
  for (const T of L.T) {
    const moved = cells.map((c) => c.map(T));
    let mx = Infinity;
    let my = Infinity;
    moved.forEach((c) => c.forEach(([x, y]) => { mx = Math.min(mx, x); my = Math.min(my, y); }));
    const dx = -Math.floor(mx / L.step) * L.step;
    const dy = -Math.floor(my / L.step) * L.step;
    const key = moved.map((c) => cellKey(c.map(([x, y]) => [x + dx, y + dy]))).sort().join(";");
    if (best === null || key < best) best = key;
  }
  return best;
}

function insidePoly(poly, [x, y]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// 다각형 안에 가운데가 들어가는 칸들
function cellsOfPolygon(lat, poly) {
  const L = LATTICE[lat];
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const s = L.step;
  return L.cellsIn(Math.floor(Math.min(...xs) / s) - 1, Math.floor(Math.min(...ys) / s) - 1, Math.ceil(Math.max(...xs) / s) + 1, Math.ceil(Math.max(...ys) / s) + 1)
    .filter((c) => insidePoly(poly, [sum(c.map((p) => p[0])) / c.length, sum(c.map((p) => p[1])) / c.length]));
}
// 다각형·칸을 같은 방법으로 돌리고 0 근처로 옮기기(칸 격자를 지키는 만큼만 옮긴다)
function orientPoints(lat, T, pts) {
  const L = LATTICE[lat];
  const moved = pts.map(T);
  const dx = -Math.floor(Math.min(...moved.map((p) => p[0])) / L.step) * L.step;
  const dy = -Math.floor(Math.min(...moved.map((p) => p[1])) / L.step) * L.step;
  return { pts: moved.map(([x, y]) => [x + dx, y + dy]), dx, dy };
}

function makeRegion(lat, cells) {
  const keys = cells.map(cellKey);
  const index = new Map(keys.map((k, i) => [k, i]));
  const edges = new Map();
  cells.forEach((c, i) => c.forEach((p, k) => {
    const q = c[(k + 1) % c.length];
    const e = [ptKey(p), ptKey(q)].sort().join("~");
    if (!edges.has(e)) edges.set(e, { a: p, b: q, cells: [] });
    edges.get(e).cells.push(i);
  }));
  const adj = cells.map(() => []);
  edges.forEach((e) => { if (e.cells.length === 2) { adj[e.cells[0]].push(e.cells[1]); adj[e.cells[1]].push(e.cells[0]); } });
  return { lat, cells, keys, index, adj, edges };
}

function isConnectedIds(R, ids) {
  const set = new Set(ids);
  const seen = new Set([ids[0]]);
  const queue = [ids[0]];
  while (queue.length) { const v = queue.pop(); R.adj[v].forEach((w) => { if (set.has(w) && !seen.has(w)) { seen.add(w); queue.push(w); } }); }
  return seen.size === set.size;
}

// start 칸을 품은, 이어진 size칸 조각을 모두 찾는다
function connectedPieces(R, start, size) {
  let level = new Map([[String(start), [start]]]);
  for (let k = 1; k < size; k += 1) {
    const next = new Map();
    level.forEach((set) => {
      const own = new Set(set);
      set.forEach((v) => R.adj[v].forEach((w) => {
        if (own.has(w)) return;
        const grown = [...set, w].sort((a, b) => a - b);
        const key = grown.join(",");
        if (!next.has(key)) next.set(key, grown);
      }));
    });
    level = next;
  }
  return [...level.values()];
}

// 칸의 꼭짓점 가운데 x가 가장 작고, 그중 y가 가장 작은 점(옮겨도 같은 꼭짓점이 뽑힌다)
const lowestPoint = (pts) => pts.reduce((best, p) => (p[0] < best[0] || (p[0] === best[0] && p[1] < best[1]) ? p : best));
// 모양(칸 목록)을 도형 안에 놓는 모든 자리
function piecePlacements(R, shapeCells) {
  const L = LATTICE[R.lat];
  const out = new Map();
  for (const T of L.T) {
    const img = shapeCells.map((c) => c.map(T));
    const anchor = lowestPoint(img[0]);
    for (let r = 0; r < R.cells.length; r += 1) {
      const ra = lowestPoint(R.cells[r]);
      const dx = ra[0] - anchor[0];
      const dy = ra[1] - anchor[1];
      if (dx % L.step || dy % L.step) continue;
      const ids = [];
      let ok = true;
      for (const c of img) {
        const id = R.index.get(cellKey(c.map(([x, y]) => [x + dx, y + dy])));
        if (id === undefined) { ok = false; break; }
        ids.push(id);
      }
      if (!ok) continue;
      ids.sort((a, b) => a - b);
      out.set(ids.join(","), ids);
    }
  }
  return [...out.values()];
}

// 같은 모양 조각으로 빈틈없이 덮는 방법(늘 아직 안 덮인 첫 칸부터 덮으므로 한 방법을 한 번만 센다)
function tileWith(R, shapeCells, { limit = 60, keep = null } = {}) {
  const placements = piecePlacements(R, shapeCells).filter((p) => !keep || keep(p));
  const byCell = R.cells.map(() => []);
  placements.forEach((p) => p.forEach((v) => byCell[v].push(p)));
  const used = new Uint8Array(R.cells.length);
  const cur = [];
  const found = [];
  const go = () => {
    if (found.length >= limit) return;
    let first = -1;
    for (let i = 0; i < used.length; i += 1) if (!used[i]) { first = i; break; }
    if (first < 0) { found.push(cur.slice()); return; }
    for (const p of byCell[first]) {
      if (p.some((v) => used[v])) continue;
      p.forEach((v) => { used[v] = 1; });
      cur.push(p);
      go();
      cur.pop();
      p.forEach((v) => { used[v] = 0; });
    }
  };
  go();
  return found;
}

// 모양과 크기가 같은 k조각으로 나누는 모든 방법(조각 모양마다)
function congruentSplits(R, k, limit = 60) {
  const n = R.cells.length;
  if (n % k) return [];
  const firsts = connectedPieces(R, 0, n / k);
  const shapes = new Map();
  firsts.forEach((ids) => { const key = shapeKey(R.lat, ids.map((i) => R.cells[i])); if (!shapes.has(key)) shapes.set(key, ids); });
  const out = [];
  shapes.forEach((ids, key) => tileWith(R, ids.map((i) => R.cells[i]), { limit }).forEach((pieces) => out.push({ key, pieces })));
  return out;
}

const PIECE_COLORS = ["#ffe7a8", "#cfe8d4", "#f7d3df", "#d9e2f6", "#fbd8b8", "#e3d8f3"];

// 칸 도형 그림 — grid: 칸 점선, pieces: 조각 경계(빨강), markers: ★ 칸, numbers: {칸: 글자}
function latticeSvg(R, { pieces = null, markers = [], grid = true, label = "도형", size = 220, colorPieces = false } = {}) {
  const L = LATTICE[R.lat];
  const pts = R.cells.flat().map(L.screen);
  const minX = Math.min(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1]));
  const w = Math.max(...pts.map((p) => p[0])) - minX;
  const h = Math.max(...pts.map((p) => p[1])) - minY;
  const u = Math.min(R.lat === "tri" ? 46 : 40, (size - 12) / Math.max(w, h));
  const pad = 6;
  const P = (p) => { const [x, y] = L.screen(p); return [(pad + (x - minX) * u).toFixed(1), (pad + (y - minY) * u).toFixed(1)]; };
  const owner = new Map();
  (pieces || []).forEach((piece, i) => piece.forEach((v) => owner.set(v, i)));
  let body = "";
  R.cells.forEach((c, i) => {
    const fill = colorPieces && owner.has(i) ? PIECE_COLORS[owner.get(i) % PIECE_COLORS.length] : "#eef6f8";
    body += `<polygon points="${c.map((p) => P(p).join(",")).join(" ")}" style="fill:${fill};stroke:${fill};stroke-width:0.6"/>`;
  });
  const inner = [];
  const outer = [];
  const cuts = [];
  R.edges.forEach((e) => {
    const line = `x1="${P(e.a)[0]}" y1="${P(e.a)[1]}" x2="${P(e.b)[0]}" y2="${P(e.b)[1]}"`;
    if (e.cells.length === 1) outer.push(line);
    else if (pieces && owner.get(e.cells[0]) !== owner.get(e.cells[1])) cuts.push(line);
    else inner.push(line);
  });
  if (grid) body += inner.map((l) => `<line ${l} style="stroke:#8fb3c0;stroke-width:1;stroke-dasharray:3 3"/>`).join("");
  body += cuts.map((l) => `<line ${l} style="stroke:#d93a2b;stroke-width:3;stroke-linecap:round"/>`).join("");
  body += outer.map((l) => `<line ${l} style="stroke:${EDGE};stroke-width:2.2;stroke-linecap:round"/>`).join("");
  markers.forEach((v) => {
    const c = R.cells[v].map(P).map((p) => p.map(Number));
    const cx = sum(c.map((p) => p[0])) / c.length;
    const cy = sum(c.map((p) => p[1])) / c.length;
    body += txt(cx.toFixed(1), (cy + 1).toFixed(1), "★", { size: Math.max(11, Math.min(18, u * 0.45)), fill: "#2f7f96" });
  });
  return svgWrap(Math.ceil(w * u + pad * 2), Math.ceil(h * u + pad * 2), body, label);
}
const captioned = (svg, caption) => `<figure style="margin:0;display:grid;justify-items:center;gap:4px">${svg}<figcaption style="font-size:13px;font-weight:700;${FONT}">${caption}</figcaption></figure>`;
const regionMeta = (R) => R.cells.map((c) => c.map((p) => [...p]));

// (1) 같은 도형을 k조각과 m조각으로 각각 나누기 — 모눈 칸 도형을 무작위로 키워 보고 두 가지가 모두 되는 것만
function randomPolyomino(n, W, H) {
  const cells = new Set([`${randomInt(0, W - 1)},${randomInt(0, H - 1)}`]);
  for (let guard = 0; cells.size < n && guard < 800; guard += 1) {
    const list = [...cells];
    const [x, y] = list[randomInt(0, list.length - 1)].split(",").map(Number);
    const [dx, dy] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    if (x + dx < 0 || y + dy < 0 || x + dx >= W || y + dy >= H) continue;
    cells.add(`${x + dx},${y + dy}`);
  }
  if (cells.size < n) return null;
  return [...cells].map((s) => { const [i, j] = s.split(",").map(Number); return [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]; });
}
const isBar = (R, ids) => { const xs = new Set(); const ys = new Set(); ids.forEach((i) => { xs.add(R.cells[i][0][0]); ys.add(R.cells[i][0][1]); }); return xs.size === 1 || ys.size === 1; };

function partitionTwoWays({ difficulty = 2 } = {}) {
  const [k, m, n, W, H] = difficulty === 1 ? [2, 3, 6, 3, 3] : difficulty === 2 ? [4, 3, 12, 4, 4] : [4, 3, 12, 5, 4];
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const cells = randomPolyomino(n, W, H);
    if (!cells) continue;
    const R = makeRegion("sq", cells);
    const xs = cells.map((c) => c[0][0]);
    const ys = cells.map((c) => c[0][1]);
    if ((Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1) === n) continue; // 직사각형은 너무 쉽다
    const splitsK = congruentSplits(R, k, 20);
    if (!splitsK.length) continue;
    const splitsM = congruentSplits(R, m, 20);
    if (!splitsM.length) continue;
    if (difficulty === 3 && (splitsK.every((s) => s.pieces.every((p) => isBar(R, p))) || splitsM.every((s) => s.pieces.every((p) => isBar(R, p))))) continue;
    const shownK = pick(splitsK);
    const shownM = pick(splitsM);
    return {
      prompt: `다음 도형을 점선을 따라 (1) 모양과 크기가 같은 ${k}개의 도형으로, (2) 모양과 크기가 같은 ${m}개의 도형으로 각각 나누세요.`,
      visual: { kind: "fig", html: figs([captioned(latticeSvg(R, { label: "나눌 도형" }), `(1) ${k}개로 나누기`), captioned(latticeSvg(R, { label: "나눌 도형" }), `(2) ${m}개로 나누기`)]) },
      answer: "그림과 같이 나눕니다. (다른 방법도 있을 수 있습니다.)",
      answerVisual: { kind: "fig", html: figs([captioned(latticeSvg(R, { pieces: shownK.pieces, colorPieces: true, label: `${k}조각으로 나눈 도형` }), `(1) ${k}개`), captioned(latticeSvg(R, { pieces: shownM.pieces, colorPieces: true, label: `${m}조각으로 나눈 도형` }), `(2) ${m}개`)]) },
      responseKind: "drawing",
      solution: `도형은 작은 정사각형 ${n}칸입니다. ${k}개로 나누면 한 조각이 ${n / k}칸, ${m}개로 나누면 한 조각이 ${n / m}칸입니다. 튀어나온 칸이나 모서리 칸처럼 들어갈 조각이 적은 칸부터 같은 모양을 놓아 보며 나눕니다.`,
      meta: { family: "partition-two-ways-b9", lat: "sq", cells: regionMeta(R), k, m, splitK: shownK.pieces, splitM: shownM.pieces }
    };
  }
  return null;
}

// (2) 처음 도형과 모양이 같은 작은 4조각으로 나누기(★ 조건을 붙일 수 있다)
const REP_SHAPES = {
  lTromino: { lat: "sq", poly: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]], name: "ㄴ자 모양" },
  lTetromino: { lat: "sq", poly: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], name: "ㄴ자 모양" },
  pPentomino: { lat: "sq", poly: [[0, 0], [2, 0], [2, 2], [1, 2], [1, 3], [0, 3]], name: "P자 모양" },
  rightTrapezoid: { lat: "tet", poly: [[0, 0], [4, 0], [2, 2], [0, 2]], name: "사다리꼴" },
  rightTriangle: { lat: "tet", poly: [[0, 0], [4, 0], [0, 4]], name: "직각삼각형" },
  triTrapezoid: { lat: "tri", poly: [[0, 0], [2, 0], [1, 1], [0, 1]], name: "사다리꼴" },
  sphinx: { lat: "tri", poly: [[0, 0], [3, 0], [2, 1], [1, 1], [0, 2]], name: "도형" }
};
const REP_CACHE = new Map();
function repTiling(name, T) {
  const spec = REP_SHAPES[name];
  const small = orientPoints(spec.lat, T, spec.poly).pts;
  const key = `${name}:${JSON.stringify(small)}`;
  if (!REP_CACHE.has(key)) {
    const smallCells = cellsOfPolygon(spec.lat, small);
    const R = makeRegion(spec.lat, cellsOfPolygon(spec.lat, small.map(([x, y]) => [2 * x, 2 * y])));
    REP_CACHE.set(key, { R, smallCells, tilings: tileWith(R, smallCells, { limit: 50 }) });
  }
  return REP_CACHE.get(key);
}

function repTileFour({ difficulty = 2, stars = false } = {}) {
  const pool = stars
    ? (difficulty === 1 ? ["lTromino", "rightTriangle", "triTrapezoid", "lTetromino"] : difficulty === 2 ? ["lTetromino", "pPentomino", "rightTriangle", "triTrapezoid"] : ["lTetromino", "pPentomino", "sphinx", "rightTrapezoid"])
    : (difficulty === 1 ? ["lTromino", "rightTriangle", "triTrapezoid"] : difficulty === 2 ? ["lTetromino", "rightTrapezoid", "triTrapezoid", "pPentomino"] : ["pPentomino", "sphinx", "rightTrapezoid", "lTetromino"]);
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const name = pick(pool);
    const spec = REP_SHAPES[name];
    const { R, smallCells, tilings } = repTiling(name, pick(LATTICE[spec.lat].T));
    if (!tilings.length) continue;
    const shown = pick(tilings);
    let markers = [];
    if (stars) {
      markers = shown.map((piece) => pick(piece));
      const set = new Set(markers);
      const fits = tilings.filter((t) => t.every((piece) => piece.filter((v) => set.has(v)).length === 1));
      if (fits.length !== 1) continue;
    }
    const grid = stars || difficulty < 3;
    const smallR = makeRegion(spec.lat, smallCells);
    const condition = stars
      ? "(단, 조각은 처음 도형과 모양이 같아야 하고, 조각마다 ★이 하나씩 있어야 합니다.)"
      : "(조각 하나하나가 처음 도형과 모양이 같고 크기만 작습니다.)";
    return {
      prompt: `다음 도형을 ${grid ? "점선을 따라 " : ""}모양과 크기가 같은 4조각으로 나누세요. ${condition}`,
      visual: { kind: "fig", html: latticeSvg(R, { grid, markers, label: "4조각으로 나눌 도형" }) },
      answer: "그림과 같이 나눕니다.",
      answerVisual: { kind: "fig", html: latticeSvg(R, { pieces: shown, markers, colorPieces: true, label: "4조각으로 나눈 도형" }) },
      responseKind: "drawing",
      solution: `처음 도형을 4조각으로 나누면 한 조각의 넓이는 처음의 4분의 1이고, 모양이 같으려면 변의 길이가 모두 반이 되어야 합니다. 작은 ${spec.name} ${smallR.cells.length}칸짜리를 ${stars ? "★을 하나씩 품도록 " : ""}모서리부터 맞추어 넣으면 남은 자리에도 같은 모양이 꼭 맞게 들어갑니다.`,
      meta: { family: "rep-tile-b9", stars, lat: spec.lat, shape: name, cells: regionMeta(R), smallCells: smallCells.map((c) => c.map((p) => [...p])), pieces: shown, markers }
    };
  }
  return null;
}

// (3) 보기와 다른 방법으로 모양과 크기가 같은 4조각 — 가운데 점을 중심으로 네 번 돌려 붙인 도형
function partitionOtherWay({ difficulty = 2 } = {}) {
  const s = difficulty === 1 ? pick([3, 4]) : difficulty === 2 ? pick([4, 5]) : pick([5, 6]);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    // 가운데 꼭짓점 (0,0)의 오른쪽 위 사분면 근처에서 칸 s개를 키운다
    const seed = new Set(["0,0"]);
    for (let guard = 0; seed.size < s && guard < 200; guard += 1) {
      const list = [...seed];
      const [x, y] = list[randomInt(0, list.length - 1)].split(",").map(Number);
      const [dx, dy] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      if (x + dx < -1 || y + dy < -1 || x + dx > 3 || y + dy > 3) continue;
      seed.add(`${x + dx},${y + dy}`);
    }
    if (seed.size < s) continue;
    // 칸 (i,j) = [i,i+1]×[j,j+1]을 (0,0) 둘레로 90°씩 돌린다: (x,y) → (−y, x)
    const turn = ([i, j]) => [-j - 1, i];
    const quarter = [...seed].map((t) => t.split(",").map(Number));
    const all = [quarter];
    for (let r = 1; r < 4; r += 1) all.push(all[r - 1].map(turn));
    const keys = new Set(all.flat().map((c) => c.join(",")));
    if (keys.size !== 4 * s) continue;
    const cells = [...keys].map((t) => { const [i, j] = t.split(",").map(Number); return [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]; });
    const R = makeRegion("sq", cells);
    if (!isConnectedIds(R, R.cells.map((_, i) => i))) continue;
    const splits = congruentSplits(R, 4, 200);
    const byKey = new Map();
    splits.forEach((sp) => { if (!byKey.has(sp.key)) byKey.set(sp.key, []); byKey.get(sp.key).push(sp.pieces); });
    if (byKey.size < 2) continue;
    // 보기 = 돌려 붙인 네 조각
    const exampleIds = all.map((q) => q.map(([i, j]) => R.index.get(cellKey([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]))).sort((a, b) => a - b));
    const exampleKey = shapeKey("sq", exampleIds[0].map((i) => R.cells[i]));
    const others = [...byKey.entries()].filter(([key]) => key !== exampleKey);
    if (!others.length) continue;
    const need = Math.min(difficulty === 1 ? 1 : 2, others.length);
    const answers = shuffle(others).slice(0, need).map(([, list]) => pick(list));
    const blanks = Array.from({ length: need }, () => latticeSvg(R, { label: "나눌 도형", size: 200 }));
    return {
      prompt: `보기는 도형을 모양과 크기가 같은 4조각으로 나눈 것입니다. 같은 도형을 점선을 따라 모양과 크기가 같은 4조각으로 나누세요. (단, 조각의 모양이 보기와 달라야 하며${need > 1 ? ", 서로 다른 모양으로 두 가지를 찾습니다" : ""}.)`,
      visual: { kind: "fig", html: figs([captioned(latticeSvg(R, { pieces: exampleIds, colorPieces: true, label: "보기", size: 150 }), "보기"), ...blanks]) },
      answer: "그림과 같이 나눕니다. (다른 방법도 있을 수 있습니다.)",
      answerVisual: { kind: "fig", html: figs(answers.map((pieces) => latticeSvg(R, { pieces, colorPieces: true, label: "다르게 나눈 도형", size: 200 }))) },
      responseKind: "drawing",
      solution: `도형은 ${4 * s}칸이므로 한 조각은 ${s}칸입니다. 보기의 조각과 다른 ${s}칸 모양을 정한 뒤, 가운데를 중심으로 돌려 가며 같은 모양을 놓을 수 있는지 확인합니다.`,
      meta: { family: "partition-other-way-b9", lat: "sq", cells: regionMeta(R), example: exampleIds, answers, need }
    };
  }
  return null;
}

// (4) 주어진 조각 4개로 도형 덮기 — 조각마다 ★ 하나
function randomPieceCells(n) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const cells = randomPolyomino(n, 3, 4);
    if (!cells) continue;
    const xs = new Set(cells.map((c) => c[0][0]));
    const ys = new Set(cells.map((c) => c[0][1]));
    if (xs.size === 1 || ys.size === 1) continue;
    if (xs.size * ys.size === n) continue;
    return cells;
  }
  return null;
}
function coverWithPiece({ difficulty = 2 } = {}) {
  const n = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const box = difficulty === 3 ? 6 : 5;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const piece = randomPieceCells(n);
    if (!piece) continue;
    const pieceR = makeRegion("sq", piece);
    // 조각 4개를 서로 맞닿게 놓는다
    const placed = [];
    const taken = new Set();
    for (let tries = 0; placed.length < 4 && tries < 200; tries += 1) {
      const T = pick(SQ_T);
      const img = orientPoints("sq", T, piece.flat()).pts;
      const imgCells = [];
      for (let i = 0; i < img.length; i += 4) imgCells.push(img.slice(i, i + 4));
      const dx = randomInt(0, box - 1);
      const dy = randomInt(0, box - 1);
      const moved = imgCells.map((c) => c.map(([x, y]) => [x + dx, y + dy]));
      if (moved.some((c) => c.some(([x, y]) => x > box || y > box))) continue;
      const keys = moved.map(cellKey);
      if (keys.some((k) => taken.has(k))) continue;
      if (placed.length) {
        const touch = moved.some((c) => { const [x, y] = c[0]; return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => taken.has(cellKey([[x + a, y + b], [x + a + 1, y + b], [x + a + 1, y + b + 1], [x + a, y + b + 1]]))); });
        if (!touch) continue;
      }
      keys.forEach((k) => taken.add(k));
      placed.push(moved);
    }
    if (placed.length < 4) continue;
    const cells = placed.flat();
    const R = makeRegion("sq", cells);
    const truth = placed.map((p) => p.map((c) => R.index.get(cellKey(c))).sort((a, b) => a - b));
    const markers = truth.map((p) => pick(p));
    const starSet = new Set(markers);
    const fits = tileWith(R, piece, { limit: 5, keep: (p) => p.filter((v) => starSet.has(v)).length === 1 });
    if (fits.length !== 1) continue;
    // 별이 없어도 답이 하나뿐이면 별이 하는 일이 없다 — 별이 있어야 하나로 정해지는 것만(어려움 2·3)
    if (difficulty >= 2 && tileWith(R, piece, { limit: 2 }).length < 2) continue;
    return {
      prompt: `왼쪽 조각은 작은 정사각형 ${n}개를 이어 붙인 모양입니다. 오른쪽 도형을 점선을 따라 이 조각 4개로 나누세요. (조각은 돌리거나 뒤집어도 됩니다. 조각마다 ★이 1개씩 있어야 하고, 조각 안 ★의 자리는 달라도 됩니다.)`,
      visual: { kind: "fig", html: figs([captioned(latticeSvg(pieceR, { label: "주어진 조각", size: 110, pieces: [pieceR.cells.map((_, i) => i)], colorPieces: true }), "주어진 조각"), latticeSvg(R, { markers, label: "4조각으로 나눌 도형", size: 230 })]) },
      answer: "그림과 같이 나눕니다.",
      answerVisual: { kind: "fig", html: latticeSvg(R, { pieces: fits[0], markers, colorPieces: true, label: "나눈 도형", size: 230 }) },
      responseKind: "drawing",
      solution: `도형은 ${4 * n}칸이므로 조각 ${n}칸짜리 4개가 들어갑니다. 튀어나온 칸처럼 조각을 놓을 방법이 적은 곳부터 조각을 돌리거나 뒤집어 맞추고, 한 조각에 ★이 둘 들어가거나 하나도 없는 자리는 지웁니다.`,
      meta: { family: "cover-piece-b9", lat: "sq", cells: regionMeta(R), piece: piece.map((c) => c.map((p) => [...p])), markers, pieces: fits[0] }
    };
  }
  return null;
}


// (5) 정사각형 울타리 두 개로 동물 떼어 놓기 — 바른 정사각형과 반의반 바퀴의 반만큼 돌린 정사각형을 같은 가운데에 겹치면 칸이 10개(가운데 1, 바른 정사각형의 모서리 4, 돌린 정사각형의 끝 4, 바깥 1)
function fenceRegionOf([x, y], c, a, r) {
  const dx = x - c;
  const dy = y - c;
  const inSqBox = Math.abs(dx) < a && Math.abs(dy) < a;
  const inDia = Math.abs(dx) + Math.abs(dy) < r;
  const onLine = Math.abs(Math.abs(dx) - a) < 0.3 && Math.abs(dy) <= a + 0.3 || Math.abs(Math.abs(dy) - a) < 0.3 && Math.abs(dx) <= a + 0.3 || Math.abs(Math.abs(dx) + Math.abs(dy) - r) < 0.45;
  if (onLine) return null;
  if (inSqBox && inDia) return "center";
  if (inSqBox) return `corner${dx > 0 ? "R" : "L"}${dy > 0 ? "D" : "U"}`;
  if (inDia) return Math.abs(dx) > Math.abs(dy) ? `tip${dx > 0 ? "R" : "L"}` : `tip${dy > 0 ? "D" : "U"}`;
  return "outside";
}
function animalIcon(x, y) {
  return `<g><circle cx="${x - 7}" cy="${y - 7}" r="4.2" style="fill:#c58a52;stroke:#7a4f25;stroke-width:1"/><circle cx="${x + 7}" cy="${y - 7}" r="4.2" style="fill:#c58a52;stroke:#7a4f25;stroke-width:1"/><circle cx="${x}" cy="${y}" r="9.5" style="fill:#d9a56c;stroke:#7a4f25;stroke-width:1.2"/><ellipse cx="${x}" cy="${y + 3}" rx="5.5" ry="4" style="fill:#f3dcc0"/><circle cx="${x - 3.2}" cy="${y - 2}" r="1.3" style="fill:#3a2a1a"/><circle cx="${x + 3.2}" cy="${y - 2}" r="1.3" style="fill:#3a2a1a"/></g>`;
}
function fenceSvg(G, animals, fences = null) {
  const u = 34;
  const pad = 18;
  const P = (v) => pad + v * u;
  let body = `<rect x="4" y="4" width="${G * u + 2 * pad - 8}" height="${G * u + 2 * pad - 8}" rx="6" style="fill:#f4faf2;stroke:${EDGE};stroke-width:1.4"/>`;
  if (fences) {
    const { c, a, r } = fences;
    body += `<rect x="${P(c - a)}" y="${P(c - a)}" width="${2 * a * u}" height="${2 * a * u}" style="fill:none;stroke:#d93a2b;stroke-width:3"/>`;
    body += `<polygon points="${[[c, c - r], [c + r, c], [c, c + r], [c - r, c]].map(([x, y]) => `${P(x)},${P(y)}`).join(" ")}" style="fill:none;stroke:#d93a2b;stroke-width:3"/>`;
  }
  animals.forEach(([x, y]) => { body += animalIcon(P(x), P(y)); });
  return svgWrap(G * u + 2 * pad, G * u + 2 * pad, body, fences ? "울타리를 친 그림" : "동물이 있는 땅");
}
function twoSquareFences({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [G, a, r] = pick([[6, 2.5, 3.5], [8, 2.5, 4.5], [8, 3.5, 4.5], [7, 2.5, 4]]);
    const c = G / 2;
    const groups = new Map();
    for (let x = 0; x <= G; x += 1) for (let y = 0; y <= G; y += 1) {
      const reg = fenceRegionOf([x, y], c, a, r);
      if (!reg) continue;
      if (!groups.has(reg)) groups.set(reg, []);
      groups.get(reg).push([x, y]);
    }
    const inner = [...groups.keys()].filter((k) => k !== "outside");
    if (inner.length !== 9) continue;
    const want = difficulty === 1 ? 7 : difficulty === 2 ? 8 : pick([9, 10]);
    const chosen = want === 10 && groups.has("outside") ? [...inner, "outside"] : shuffle(inner).slice(0, Math.min(want, 9));
    const animals = chosen.map((k) => pick(groups.get(k)));
    const n = animals.length;
    return {
      prompt: `땅에 동물 ${n}마리가 있습니다. 정사각형 모양의 울타리 2개를 쳐서 동물이 한 마리씩 서로 다른 칸에 있도록 떼어 놓으려고 합니다. 울타리를 어떻게 쳐야 하는지 그려 넣으세요. (울타리끼리 겹쳐도 됩니다.)`,
      visual: { kind: "fig", html: fenceSvg(G, animals) },
      answer: "그림과 같이 바르게 놓인 정사각형과 비스듬히 돌린 정사각형을 엇갈려 겹쳐 칩니다. (크기가 조금 달라도 동물이 한 칸에 한 마리씩이면 됩니다.)",
      answerVisual: { kind: "fig", html: fenceSvg(G, animals, { c, a, r }) },
      responseKind: "drawing",
      solution: `정사각형 두 개를 따로 치면 칸이 많아야 4개밖에 생기지 않습니다. 하나를 비스듬히 돌려 두 정사각형이 서로 엇갈려 겹치게 하면, 가운데 칸 하나, 바른 정사각형의 네 모서리 칸, 돌린 정사각형의 네 끝 칸, 바깥까지 칸이 10개 생깁니다. 동물이 한 칸에 한 마리씩 들어가도록 두 울타리의 크기를 맞춥니다.`,
      meta: { family: "two-fences-b9", G, c, a, r, animals }
    };
  }
  return null;
}

// ── (2차) 2단원 · 쌓기나무 ─────────────────────────────

// 뒤·왼쪽 칸이 앞·오른쪽 칸보다 낮지 않은 쌓기(모든 윗면이 보인다)
function stepMap(rows, cols, maxH) {
  const map = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) for (let j = 0; j < cols; j += 1) {
    const cap = Math.min(i ? map[i - 1][j] : maxH, j ? map[i][j - 1] : maxH);
    map[i][j] = randomInt(i === 0 && j === 0 ? Math.max(1, maxH - 1) : 0, cap);
  }
  return map;
}
const viewSign = (map) => JSON.stringify([footprint(map), frontOf(map), rightOf(map)]);
const isStep = (map) => map.every((r, i) => r.every((v, j) => (i === 0 || v <= map[i - 1][j]) && (j === 0 || v <= r[j - 1])));
// 위·앞·옆이 같은 모든 계단 쌓기
function sameViewStepMaps(map) {
  const sign = viewSign(map);
  const top = footprint(map);
  const cells = [];
  top.forEach((r, i) => r.forEach((v, j) => { if (v) cells.push([i, j]); }));
  const maxH = Math.max(...map.flat());
  const cur = map.map((r) => r.map(() => 0));
  const out = [];
  const go = (k) => {
    if (out.length > 40) return;
    if (k === cells.length) { if (isStep(cur) && viewSign(cur) === sign) out.push(cur.map((r) => [...r])); return; }
    const [i, j] = cells[k];
    for (let h = 1; h <= maxH; h += 1) { cur[i][j] = h; go(k + 1); }
    cur[i][j] = 0;
  };
  go(0);
  return out;
}

// (1) 위·앞·오른쪽 옆 모양과 맞는 입체를 모두 고르기
function cubeViewModelAll({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rows = difficulty === 1 ? 2 : 3;
    const cols = 3;
    const map = stepMap(rows, cols, difficulty === 3 ? 4 : 3);
    const top = footprint(map);
    if (top.some((r) => !r.some(Boolean)) || top[0].some((_, j) => !top.some((r) => r[j]))) continue;
    const same = sameViewStepMaps(map);
    if (same.length < 2) continue;
    const correct = shuffle(same).slice(0, Math.min(same.length, difficulty === 3 ? pick([2, 3]) : 2));
    const sign = viewSign(map);
    const wrong = [];
    for (let tries = 0; wrong.length < 4 - correct.length && tries < 300; tries += 1) {
      const base = pick(correct).map((r) => [...r]);
      const i = randomInt(0, rows - 1);
      const j = randomInt(0, cols - 1);
      base[i][j] = Math.max(0, base[i][j] + pick([-1, 1]));
      if (!isStep(base) || !base.flat().some(Boolean) || viewSign(base) === sign) continue;
      if ([...correct, ...wrong].some((m) => JSON.stringify(m) === JSON.stringify(base))) continue;
      wrong.push(base);
    }
    if (wrong.length < 4 - correct.length) continue;
    const options = shuffle([...correct.map((m) => ({ map: m, correct: true })), ...wrong.map((m) => ({ map: m, correct: false }))]);
    const labels = ["①", "②", "③", "④"];
    const right = options.map((o, i) => (o.correct ? labels[i] : null)).filter(Boolean);
    const why = options.map((o, i) => {
      if (o.correct) return null;
      const f = frontOf(o.map);
      const s = rightOf(o.map);
      const reason = JSON.stringify(footprint(o.map)) !== JSON.stringify(top) ? "위에서 본 모양" : JSON.stringify(f) !== JSON.stringify(frontOf(map)) ? "앞에서 본 모양" : "오른쪽 옆에서 본 모양";
      return `${labels[i]}${[0, 2].includes(i) ? "은" : "는"} ${reason}이 다릅니다`;
    }).filter(Boolean);
    return {
      prompt: "다음은 쌓기나무로 쌓은 모양을 위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓은 모양으로 알맞은 것을 모두 고르세요.",
      visual: { kind: "book9", subtype: "cube-model-choice", top, front: frontOf(map), side: rightOf(map), options: options.map((o) => ({ map: o.map })) },
      answer: right.join(", "),
      solution: `위에서 본 모양으로 1층 자리를, 앞과 오른쪽 옆에서 본 모양으로 줄마다 가장 높은 층을 하나씩 맞추어 봅니다. ${why.join(", ")}. 세 방향 모양이 모두 같은 것은 ${right.join(", ")}입니다.`,
      meta: { family: "cube-model-all-b9", top, front: frontOf(map), side: rightOf(map), options, answer: right }
    };
  }
  return null;
}

// (2) 세 방향 모양 → 정육면체를 만들 때 더 쌓아야 하는 가장 적은 개수
function cubeViewsFillCube({ difficulty = 2 } = {}) {
  const n = difficulty === 3 ? 4 : 3;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const map = Array.from({ length: n }, () => Array.from({ length: n }, () => (Math.random() < (difficulty === 1 ? 0 : 0.15) ? 0 : randomInt(1, n))));
    if (Math.max(...map.flat()) !== n) continue;
    const top = footprint(map);
    if (top.some((r) => !r.some(Boolean)) || top[0].some((_, j) => !top.some((r) => r[j]))) continue;
    const front = frontOf(map);
    const side = rightOf(map);
    const sideRow = (i) => side[n - 1 - i];
    const most = map.map((r, i) => r.map((v, j) => (v ? Math.min(front[j], sideRow(i)) : 0)));
    const max = sum(most.flat());
    if (max === n ** 3 || max === sum(map.flat())) continue; // 위·앞·옆만으로 개수가 정해지면 「적어도」가 할 일이 없다
    const answer = n ** 3 - max;
    return {
      prompt: `쌓기나무로 만든 모양을 위, 앞, 오른쪽 옆에서 본 모양이 다음과 같습니다. 이 모양에 쌓기나무를 더 쌓아 가로, 세로, 높이가 모두 ${n}개인 정육면체를 만들려면 쌓기나무가 적어도 몇 개 더 필요한지 구하세요.`,
      visual: { kind: "fig", html: figs([topBlocks(top), viewBlocks(front, { label: "앞" }), viewBlocks(side, { label: "오른쪽 옆", color: "#f0b23a" })]) },
      answer: `${answer}개`,
      answerVisual: { kind: "fig", html: topBlocks(most, { label: "가장 많이 쌓은 경우", numbers: true }) },
      solution: `더 쌓는 개수가 가장 적으려면 지금 모양에 쌓기나무가 가장 많아야 합니다. 위에서 본 칸마다 앞과 오른쪽 옆에서 본 층수 중 작은 수만큼 쌓으면 ${max}개입니다. 정육면체는 ${n}×${n}×${n}=${n ** 3}개이므로 ${n ** 3}-${max}=${answer}개가 더 필요합니다.`,
      meta: { family: "cube-fill-cube-b9", n, map, top, front, side, max, answer }
    };
  }
  return null;
}

// (3) 같은 색끼리 면이 닿지 않게 쌓은 직육면체 — 검은색이 가장 적을 때
function cubeCheckerMinBlack({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const span = difficulty === 1 ? [2, 3] : difficulty === 2 ? [2, 4] : [3, 5];
    const [a, b, c] = [randomInt(...span), randomInt(...span), randomInt(...span)];
    const total = a * b * c;
    if (difficulty >= 2 && total % 2 === 0 && Math.random() < 0.6) continue;
    const answer = Math.floor(total / 2);
    const odd = total % 2 === 1;
    return {
      prompt: `흰색 쌓기나무와 검은색 쌓기나무를 같은 색끼리 면이 닿지 않도록 번갈아 쌓아 가로 ${a}개, 세로 ${b}개, 높이 ${c}개인 직육면체를 만들려고 합니다. 필요한 검은색 쌓기나무는 적어도 몇 개인지 구하세요.`,
      visual: { kind: "book9", subtype: "cube-solid-views", map: Array.from({ length: b }, () => Array(a).fill(c)) },
      answer: `${answer}개`,
      solution: `쌓기나무는 모두 ${a}×${b}×${c}=${total}개입니다. 옆이나 위아래로 한 칸 갈 때마다 색이 바뀌므로 ${odd ? `두 색의 개수는 1개 차이가 나고, 꼭짓점 자리의 색이 하나 더 많습니다. 꼭짓점을 흰색으로 놓으면 검은색은 (${total}-1)÷2=${answer}개입니다.` : `흰색과 검은색은 ${total}÷2=${answer}개씩 똑같습니다.`}`,
      meta: { family: "cube-checker-b9", a, b, c, answer }
    };
  }
  return null;
}

// ── (2차) 3단원 · 수 배열과 합 ─────────────────────────

const node = (x, y, value, r = 17) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" style="fill:#fff;stroke:${EDGE};stroke-width:1.6"/>${value === null || value === undefined || value === "" ? "" : txt(x.toFixed(1), (y + 1).toFixed(1), value, { size: 14 })}`;
const segment = (x1, y1, x2, y2) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:${EDGE};stroke-width:1.5"/>`;
const ALPHA = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const pickDistinct = (count, lo, hi) => shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, count).sort((a, b) => a - b);

// (1) 영역이 나뉜 원 사슬 — 원 c개, 이웃한 두 원만 겹친다. 영역 차례: 원1만, 원1∩원2, 원2만, … (원 안의 합이 모두 같게)
function chainSets(c) {
  const sets = [];
  for (let i = 0; i < c; i += 1) {
    const own = 2 * i;
    sets.push([own - 1, own, own + 1].filter((v) => v >= 0 && v <= 2 * c - 2));
  }
  // 끝 원은 자기 영역과 겹친 영역만, 가운데 원은 양쪽 겹친 영역 + 자기 영역
  return sets;
}
function chainSolutions(values, sets) {
  const n = values.length;
  const ways = [];
  const seen = new Set();
  for (const perm of permutations(values)) {
    const sums = sets.map((s) => sum(s.map((i) => perm[i])));
    if (!sums.every((v) => v === sums[0])) continue;
    const key = perm.join(",");
    const rev = [...perm].reverse().join(",");
    if (seen.has(rev)) continue;
    seen.add(key);
    ways.push({ perm, S: sums[0] });
  }
  return ways.length <= n ? ways : ways;
}
function chainSvg(c, labels) {
  const R = 50;
  const gap = 74;
  const W = 2 * R + gap * (c - 1) + 8;
  let body = "";
  for (let i = 0; i < c; i += 1) body += `<circle cx="${4 + R + i * gap}" cy="${R + 4}" r="${R}" style="fill:none;stroke:${EDGE};stroke-width:1.6"/>`;
  for (let r = 0; r < 2 * c - 1; r += 1) {
    const i = Math.floor(r / 2);
    let x = 4 + R + i * gap + (r % 2 ? gap / 2 : 0);
    if (r === 0) x -= 18;
    if (r === 2 * c - 2) x += 18;
    body += txt(x, R + 5, labels[r], { size: 15, fill: /^[A-Z]$/.test(labels[r]) ? "#5f6f76" : INK });
  }
  return svgWrap(W, 2 * R + 8, body, "겹친 원");
}
function chainCirclesWays({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const c = difficulty === 3 ? 4 : difficulty === 2 ? pick([3, 3, 4]) : 3;
    const n = 2 * c - 1;
    const s0 = randomInt(1, 5);
    const values = difficulty === 1 ? (Math.random() < 0.4 ? Array.from({ length: n }, (_, i) => s0 + i) : pickDistinct(n, 1, 7)) : pickDistinct(n, 1, c === 3 ? 9 : 11);
    const sets = chainSets(c);
    const ways = chainSolutions(values, sets);
    if (ways.length < 1 || ways.length > 3) continue;
    const names = ALPHA.slice(0, n);
    const wayText = ways.map((w) => names.map((nm, i) => `${nm}=${w.perm[i]}`).join(", "));
    return {
      prompt: `${names.join(", ")} 각 영역 안에 수 ${listEul(values)} 하나씩 넣어 모든 원 안에 적힌 수의 합이 같아지도록 만드세요. (${ways.length === 1 ? "답은 한 가지이고" : `모두 ${ways.length}가지이며`}, 좌우를 뒤집어서 같은 경우는 한 가지로 봅니다.)`,
      visual: { kind: "fig", html: `<div style="display:grid;justify-items:center;gap:10px">${cardStrip(values)}${chainSvg(c, names)}</div>` },
      answer: wayText.join(" / "),
      answerVisual: { kind: "fig", html: figs(ways.map((w) => chainSvg(c, w.perm))) },
      solution: `겹친 영역의 수는 두 원에 함께 더해집니다. 양 끝 원은 수가 두 개뿐이므로 큰 수가 들어가야 하고, 겹친 영역에 놓을 수부터 정해 합을 맞추어 봅니다. 모든 경우를 찾으면 ${ways.map((w, i) => `(${i + 1}) ${wayText[i]} — 한 원의 합 ${w.S}`).join(", ")}입니다.`,
      meta: { family: "chain-circles-b9", c, values, sets, ways: ways.map((w) => w.perm) }
    };
  }
  return null;
}

// (2) 가운데 + 둘레 원 — 지름 위 세 수의 합 = 둘레의 수 전부의 합
function wheelSvg(k, center, ring, { size = 200, ringCircle = true, r = 17 } = {}) {
  const c = size / 2;
  const RR = size / 2 - r - 4;
  let body = ringCircle ? `<circle cx="${c}" cy="${c}" r="${RR}" style="fill:none;stroke:${EDGE};stroke-width:1.5"/>` : "";
  const pts = Array.from({ length: 2 * k }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / k; return [c + Math.cos(a) * RR, c + Math.sin(a) * RR]; });
  for (let i = 0; i < k; i += 1) body += segment(pts[i][0], pts[i][1], pts[i + k][0], pts[i + k][1]);
  pts.forEach(([x, y], i) => { body += node(x, y, ring[i], r); });
  body += node(c, c, center, r);
  return svgWrap(size, size, body, "가운데 원과 둘레의 원");
}
function wheelLineRing({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const k = difficulty === 3 ? pick([2, 3]) : 2;
    const n = 2 * k + 1;
    // 짝의 합 = 가운데 수 ÷ (k−1) 이 되게 만든 뒤, 다른 방법이 없는지 모든 경우를 넣어 본다
    const center = k === 2 ? randomInt(5, difficulty === 1 ? 9 : 15) : 2 * randomInt(4, 9);
    const pairSum = center / (k - 1);
    const lows = shuffle(Array.from({ length: Math.ceil(pairSum / 2) - 1 }, (_, i) => i + 1)).slice(0, k);
    if (lows.length < k) continue;
    const values = [center, ...lows, ...lows.map((v) => pairSum - v)].sort((a, b) => a - b);
    if (new Set(values).size !== n) continue;
    const found = new Map();
    for (const perm of permutations(values)) {
      const [c, ...ring] = perm;
      const S = sum(ring);
      if (!Array.from({ length: k }, (_, i) => c + ring[i] + ring[i + k]).every((v) => v === S)) continue;
      const pairs = Array.from({ length: k }, (_, i) => [ring[i], ring[i + k]].sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]);
      found.set(`${c}|${JSON.stringify(pairs)}`, { c, ring, pairs, S });
    }
    if (found.size !== 1) continue;
    const sol = [...found.values()][0];
    return {
      prompt: `다음 그림의 원 안에 수 ${listEul(values)} 하나씩 넣어 직선 위에 있는 세 수의 합과 큰 원의 둘레에 있는 ${2 * k}개의 수의 합이 모두 같게 만드세요.`,
      visual: { kind: "fig", html: `<div style="display:grid;justify-items:center;gap:10px">${cardStrip(values)}${wheelSvg(k, "", Array(2 * k).fill(""))}</div>` },
      answer: `가운데 ${sol.c}, 마주 보는 두 수 ${sol.pairs.map((p) => `${wa(p[0])} ${p[1]}`).join(", ")} (합 ${sol.S})`,
      answerVisual: { kind: "fig", html: wheelSvg(k, sol.c, sol.ring) },
      solution: `직선 ${k}개의 합을 모두 더하면 가운데 수를 ${k}번, 둘레의 수를 한 번씩 더한 것이고 이것이 둘레의 합의 ${k}배와 같습니다. 그래서 둘레의 합은 ${k === 2 ? "가운데 수의 2배" : "가운데 수의 3배를 2로 나눈 수"}이고, 전체 합 ${sum(values)} = 가운데 수 + 둘레의 합이므로 가운데 수는 ${sol.c}, 한 줄의 합은 ${sol.S}입니다. 마주 보는 두 수의 합이 ${iga(sol.S - sol.c)} 되게 짝지으면 ${sol.pairs.map((p) => `${wa(p[0])} ${p[1]}`).join(", ")}입니다.`,
      meta: { family: "wheel-line-ring-b9", k, values, center: sol.c, ring: sol.ring, S: sol.S }
    };
  }
  return null;
}

// (3) 3×3 표 — 네 모퉁이는 주어지고, 색칠한 다섯 칸(가운데 줄과 가운데 칸의 위·아래)에 수 카드. 가로 합 = 세로 합(같은 기호)
const CROSS_CELLS = [1, 3, 4, 5, 7];
function crossGridSums(grid) {
  const rows = [0, 1, 2].map((r) => sum(grid.slice(r * 3, r * 3 + 3)));
  const cols = [0, 1, 2].map((c) => grid[c] + grid[c + 3] + grid[c + 6]);
  return { rows, cols };
}
function crossGridSvg(grid, { shaded = true } = {}) {
  const u = 40;
  let body = "";
  for (let i = 0; i < 9; i += 1) {
    const x = 2 + (i % 3) * u;
    const y = 2 + Math.floor(i / 3) * u;
    const fill = CROSS_CELLS.includes(i) && shaded ? "#d7eef4" : "#fff";
    body += `<rect x="${x}" y="${y}" width="${u}" height="${u}" style="fill:${fill};stroke:${EDGE};stroke-width:1.3"/>`;
    if (grid[i] !== null && grid[i] !== undefined) body += txt(x + u / 2, y + u / 2 + 1, grid[i], { size: 15 });
  }
  for (let r = 0; r < 3; r += 1) body += `<rect x="${2 + 3 * u}" y="${2 + r * u}" width="${u}" height="${u}" style="fill:#fff;stroke:${EDGE};stroke-width:1.3"/>${txt(2 + 3.5 * u, 2 + (r + 0.5) * u + 1, MARKS[r], { size: 15 })}`;
  for (let c = 0; c < 3; c += 1) body += `<rect x="${2 + c * u}" y="${2 + 3 * u}" width="${u}" height="${u}" style="fill:#fff;stroke:${EDGE};stroke-width:1.3"/>${txt(2 + (c + 0.5) * u, 2 + 3.5 * u + 1, MARKS[c], { size: 15 })}`;
  return svgWrap(4 * u + 4, 4 * u + 4, body, "가로와 세로의 합을 적는 표");
}
function crossGridMinMax({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const cards = difficulty === 1 ? [1, 2, 3, 4, 5] : pickDistinct(5, 1, difficulty === 2 ? 9 : 12);
    const rest = Array.from({ length: 15 }, (_, i) => i + 1).filter((v) => !cards.includes(v));
    const corners = shuffle(rest).slice(0, 4);
    const results = [];
    for (const perm of permutations(cards)) {
      const grid = [corners[0], null, corners[1], null, null, null, corners[2], null, corners[3]];
      CROSS_CELLS.forEach((cell, i) => { grid[cell] = perm[i]; });
      const { rows, cols } = crossGridSums(grid);
      if (rows.every((v, i) => v === cols[i])) results.push({ grid, mid: rows[1] });
    }
    const mids = [...new Set(results.map((r) => r.mid))].sort((a, b) => a - b);
    if (mids.length < 2) continue;
    const want = difficulty === 1 ? "min" : pick(["min", "max"]);
    const answer = want === "min" ? mids[0] : mids.at(-1);
    const best = results.find((r) => r.mid === answer);
    const shown = [corners[0], null, corners[1], null, null, null, corners[2], null, corners[3]];
    return {
      prompt: `다음 그림의 색칠한 칸에 수 ${listEul(cards)} 한 번씩 써서 가로와 세로의 합 ${MARKS.slice(0, 3).join(", ")}을 각각 구하려고 합니다. 같은 기호는 같은 수일 때, ㉡이 될 수 있는 가장 ${want === "min" ? "작은" : "큰"} 수를 구하세요.`,
      visual: { kind: "fig", html: `<div style="display:grid;justify-items:center;gap:10px">${cardStrip(cards)}${crossGridSvg(shown)}</div>` },
      answer: String(answer),
      answerVisual: { kind: "fig", html: crossGridSvg(best.grid, { shaded: false }) },
      solution: `첫째 가로줄과 첫째 세로줄은 모퉁이 ${eul(corners[0])} 함께 쓰므로 나머지 두 칸의 합이 같아야 하고, 셋째 줄끼리도 모퉁이 ${eul(corners[3])} 함께 씁니다. 가운데 가로줄과 가운데 세로줄은 가운데 칸을 함께 쓰므로 양 끝 두 칸의 합이 같아야 합니다. 이 조건에 맞게 놓는 방법을 모두 찾으면 ㉡은 ${mids.slice(0, -1).map((v) => `${v}, `).join("")}${iga(mids.at(-1))} 될 수 있으므로 가장 ${want === "min" ? "작은" : "큰"} 수는 ${answer}입니다.`,
      meta: { family: "cross-grid-b9", cards, corners, want, mids, answer }
    };
  }
  return null;
}

// (4) 고리처럼 이은 원 c개(위·아래 번갈아) — 영역 2c−1개에 수를 하나씩, 원마다 합이 같게
function ringsLayout(c) {
  const R = 44;
  const dx = 52;
  return Array.from({ length: c }, (_, i) => ({ x: R + 6 + i * dx, y: i % 2 ? R + 46 : R + 6, R }));
}
function ringsSvg(c, labels) {
  const circles = ringsLayout(c);
  const W = circles.at(-1).x + circles[0].R + 6;
  const H = circles[1].y + circles[0].R + 6;
  let body = circles.map((o) => `<circle cx="${o.x}" cy="${o.y}" r="${o.R}" style="fill:none;stroke:${EDGE};stroke-width:1.6"/>`).join("");
  for (let r = 0; r < 2 * c - 1; r += 1) {
    const i = Math.floor(r / 2);
    let x;
    let y;
    if (r % 2 === 0) { const o = circles[i]; x = o.x + (i === 0 ? -14 : i === c - 1 ? 14 : 0); y = o.y + (i % 2 ? 22 : -22); }
    else { x = (circles[i].x + circles[i + 1].x) / 2; y = (circles[i].y + circles[i + 1].y) / 2; }
    if (labels[r] !== null && labels[r] !== undefined && labels[r] !== "") body += txt(x, y, labels[r], { size: 15 });
  }
  return svgWrap(W, H, body, "고리처럼 이은 원");
}
function ringsSolutions(values, c, T) {
  const n = 2 * c - 1;
  const out = [];
  const cur = Array(n).fill(null);
  const used = new Set();
  const circleOf = (i) => [2 * i - 1, 2 * i, 2 * i + 1].filter((v) => v >= 0 && v < n);
  const go = (pos) => {
    if (pos === n) { out.push([...cur]); return; }
    for (const v of values) {
      if (used.has(v)) continue;
      cur[pos] = v;
      // pos가 어떤 원의 마지막 영역이면 그 원의 합을 확인
      let ok = true;
      for (let i = 0; i < c && ok; i += 1) { const s = circleOf(i); if (s.at(-1) === pos && sum(s.map((j) => cur[j])) !== T) ok = false; }
      if (ok) { used.add(v); go(pos + 1); used.delete(v); }
    }
    cur[pos] = null;
  };
  go(0);
  return out;
}
function ringsTargetSum({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const c = difficulty === 1 ? 4 : 5;
    const n = 2 * c - 1;
    const start = difficulty === 3 ? randomInt(1, 4) : 1;
    const values = Array.from({ length: n }, (_, i) => start + i);
    const T = randomInt(start * 2 + n - 3, start * 3 + n + 4);
    const sols = ringsSolutions(values, c, T);
    if (!sols.length) continue;
    const truth = pick(sols);
    // 보이는 수 1~2개로 답이 하나가 되게
    let givens = null;
    for (const count of [1, 2]) {
      const options = [];
      const idx = [...Array(n).keys()];
      if (count === 1) idx.forEach((i) => options.push([i]));
      else idx.forEach((i) => idx.forEach((j) => { if (i < j) options.push([i, j]); }));
      const good = shuffle(options).find((g) => sols.filter((s) => g.every((i) => s[i] === truth[i])).length === 1);
      if (good) { givens = good; break; }
    }
    if (!givens) continue;
    if (difficulty >= 2 && givens.length === 1 && Math.random() < 0.5) continue;
    const shown = truth.map((v, i) => (givens.includes(i) ? v : null));
    return {
      prompt: `${values[0]}부터 ${values.at(-1)}까지의 수를 한 번씩 넣어 원 ${c}개 안에 있는 수의 합이 각각 ${iga(T)} 되도록 만드세요. (이미 써넣은 수는 그대로 둡니다.)`,
      visual: { kind: "fig", html: ringsSvg(c, shown) },
      answer: `왼쪽부터 ${truth.join(", ")}`,
      answerVisual: { kind: "fig", html: ringsSvg(c, truth) },
      solution: `양 끝 원은 수가 두 개뿐이므로 보이는 수가 있으면 겹친 영역의 수가 바로 정해집니다(합 ${T}에서 뺍니다). 겹친 영역의 수를 알면 다음 원에서 남은 두 수의 합이 정해지므로, 남은 수 가운데 그 합이 되는 짝을 차례로 찾아 갑니다. 왼쪽부터 ${truth.join(", ")}입니다.`,
      meta: { family: "rings-sum-b9", c, values, T, givens, truth }
    };
  }
  return null;
}

// (5) 삼각형 일곱 원 — 바깥 꼭짓점 A·B·C, 안쪽 꼭짓점 M·E·F, 가운데 O. 삼각형 두 개와 직선 A-M-O, B-E-O, C-F-O의 합이 모두 같게
const TRI7 = { A: 0, B: 1, C: 2, M: 3, E: 4, F: 5, O: 6 };
const TRI7_SETS = [[0, 1, 2], [3, 4, 5], [0, 3, 6], [1, 4, 6], [2, 5, 6]];
function triangleSevenSvg(vals) {
  const pos = [[120, 22], [26, 186], [214, 186], [120, 72], [86, 154], [154, 154], [120, 124]];
  let body = `<polygon points="${[0, 1, 2].map((i) => pos[i].join(",")).join(" ")}" style="fill:none;stroke:${EDGE};stroke-width:1.5"/><polygon points="${[3, 4, 5].map((i) => pos[i].join(",")).join(" ")}" style="fill:none;stroke:${EDGE};stroke-width:1.5"/>`;
  [[0, 6], [1, 6], [2, 6]].forEach(([a, b]) => { body += segment(pos[a][0], pos[a][1], pos[b][0], pos[b][1]); });
  pos.forEach(([x, y], i) => { body += node(x, y, vals[i], 16); });
  return svgWrap(240, 208, body, "삼각형 위의 일곱 원");
}
function triangleSevenFill({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const d1 = difficulty === 1 ? 1 : randomInt(1, 3);
    const d2 = difficulty === 1 ? 2 : randomInt(d1 + 1, d1 + 4);
    const O = randomInt(d1 + d2 + 1, d1 + d2 + (difficulty === 1 ? 3 : 8));
    const values = [O - d1 - d2, O - d2, O - d1, O, O + d1, O + d2, O + d1 + d2].sort((a, b) => a - b);
    const sols = permutations(values).filter((p) => TRI7_SETS.every((s) => sum(s.map((i) => p[i])) === sum(TRI7_SETS[0].map((i) => p[i]))));
    if (!sols.length) continue;
    const truth = pick(sols);
    // 꼭대기 A를 보여 주면 나머지는 좌우만 바뀐다
    const sameTop = sols.filter((s) => s[0] === truth[0]);
    const mirror = (s) => [s[0], s[2], s[1], s[3], s[5], s[4], s[6]].join(",");
    if (!sameTop.every((s) => s.join(",") === truth.join(",") || s.join(",") === mirror(truth))) continue;
    const S = 3 * O;
    return {
      prompt: `삼각형 위의 세 수의 합과 일직선 위의 세 수의 합이 모두 같도록 ${listEul(values)} 빈 원에 한 번씩 써넣으세요. (맨 위의 수는 이미 써넣었습니다.)`,
      visual: { kind: "fig", html: triangleSevenSvg([truth[0], "", "", "", "", "", ""]) },
      answer: `가운데 ${O}, 한 줄의 합 ${S} (그림과 같이 채웁니다)`,
      answerVisual: { kind: "fig", html: triangleSevenSvg(truth) },
      solution: `두 삼각형의 합과 세 직선의 합을 모두 더하면 가운데 수가 세 번, 나머지는 두 번씩 더해집니다. 한 줄의 합을 S라 하면 5×S = 2×${sum(values)} + 가운데 수이고, 두 삼각형에 가운데를 뺀 여섯 수가 모두 들어 있으므로 2×S + 가운데 수 = ${sum(values)}입니다. 두 식에서 가운데 수는 ${O}, S는 ${S}입니다. 직선마다 가운데를 뺀 두 수의 합이 ${2 * O}이므로 ${values.filter((v) => v < O).map((v) => `${wa(v)} ${2 * O - v}`).join(", ")}${has(2 * O - Math.max(...values.filter((v) => v < O))) ? "을" : "를"} 짝지어 바깥과 안쪽에 놓고, 바깥 세 수의 합이 ${iga(S)} 되게 고릅니다.`,
      meta: { family: "triangle-seven-b9", values, truth, O, S }
    };
  }
  return null;
}

// (6) 가운데 + 둘레 2k개 — 지름 k개 위 세 수의 합이 같게. 가운데에 올 수 있는 수를 모두
function wheelCentersAll({ difficulty = 2 } = {}) {
  const k = difficulty === 1 ? pick([3, 4]) : difficulty === 2 ? pick([4, 5]) : pick([5, 6]);
  const s = randomInt(1, difficulty === 3 ? 6 : 4);
  const values = Array.from({ length: 2 * k + 1 }, (_, i) => s + i);
  const fills = [];
  values.forEach((c) => {
    const rest = values.filter((v) => v !== c);
    const target = (sum(rest) / k);
    const pairs = [];
    for (let i = 0; i < k; i += 1) pairs.push([rest[i], rest[rest.length - 1 - i]]);
    if (Number.isInteger(target) && pairs.every((p) => p[0] + p[1] === target)) fills.push({ c, pairs, S: c + target });
  });
  const ring = (f) => { const out = Array(2 * k); f.pairs.forEach((p, i) => { out[i] = p[0]; out[i + k] = p[1]; }); return out; };
  const centers = fills.map((f) => f.c);
  return {
    prompt: `${s}부터 ${s + 2 * k}까지의 수를 원 안에 한 번씩 넣어서 한 직선 위에 있는 세 수의 합이 모두 같게 만들려고 합니다. 가운데에 올 수 있는 수를 모두 구하고, 그때마다 한 가지씩 완성하세요.`,
    visual: { kind: "fig", html: figs(centers.map(() => wheelSvg(k, "", Array(2 * k).fill(""), { size: 170, ringCircle: false, r: 14 }))) },
    answer: `가운데 ${centers.join(", ")}`,
    answerVisual: { kind: "fig", html: figs(fills.map((f) => wheelSvg(k, f.c, ring(f), { size: 170, ringCircle: false, r: 14 }))) },
    solution: `가운데 수를 빼고 남은 ${2 * k}개의 수를 마주 보는 두 수의 합이 모두 같게 짝지어야 합니다. 남은 수들이 가장 작은 수와 가장 큰 수, 둘째로 작은 수와 둘째로 큰 수 … 처럼 짝지어 합이 같으려면 가운데에서 하나를 빼도 양쪽이 고르게 남아야 하므로 가운데에는 가장 작은 수 ${centers[0]}, 한가운데 수 ${centers[1]}, 가장 큰 수 ${centers[2]}만 올 수 있습니다. 그때 한 직선의 합은 각각 ${fills.map((f) => f.S).join(", ")}입니다.`,
    meta: { family: "wheel-centers-b9", k, values, centers, fills: fills.map((f) => ({ c: f.c, ring: ring(f) })) }
  };
}

// (7) 꺾인 길 위의 원 — 같은 직선 위의 수의 합이 모두 같게(줄마다 원의 수가 다르다)
const PATHS = [
  { lens: [2, 3, 2], dirs: [[1, 0], [0, 1], [1, 0]] },
  { lens: [3, 2], dirs: [[1, 0], [0, 1]] },
  { lens: [3, 3], dirs: [[0, 1], [1, 0]] },
  { lens: [2, 3, 3], dirs: [[1, 0], [0, 1], [1, 0]] },
  { lens: [3, 2, 3], dirs: [[1, 0], [0, 1], [-1, 0]] },
  { lens: [2, 3, 2, 3], dirs: [[1, 0], [0, 1], [1, 0], [0, 1]] }
];
function pathLayout(path) {
  const pts = [[0, 0]];
  const segs = [];
  path.lens.forEach((len, s) => {
    const startIdx = pts.length - 1;
    const [dx, dy] = path.dirs[s];
    for (let i = 1; i < len; i += 1) { const [x, y] = pts.at(-1); pts.push([x + dx, y + dy]); }
    segs.push(Array.from({ length: len }, (_, i) => startIdx + i));
  });
  return { pts, segs };
}
function pathSvg(path, vals) {
  const { pts, segs } = pathLayout(path);
  const u = 46;
  const minX = Math.min(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1]));
  const P = ([x, y]) => [22 + (x - minX) * u, 22 + (y - minY) * u];
  const W = (Math.max(...pts.map((p) => p[0])) - minX) * u + 44;
  const H = (Math.max(...pts.map((p) => p[1])) - minY) * u + 44;
  let body = "";
  segs.forEach((s) => { const a = P(pts[s[0]]); const b = P(pts[s.at(-1)]); body += segment(a[0], a[1], b[0], b[1]); });
  pts.forEach((p, i) => { const [x, y] = P(p); body += node(x, y, vals[i], 16); });
  return svgWrap(W, H, body, "꺾인 길 위의 원");
}
function pathSignature(path, perm) {
  const { segs } = pathLayout(path);
  const corners = segs.slice(1).map((s) => s[0]);
  const sig = (p) => JSON.stringify([corners.map((i) => p[i]), segs.map((s) => s.filter((i) => !corners.includes(i)).map((i) => p[i]).sort((a, b) => a - b))]);
  const palin = path.lens.join() === [...path.lens].reverse().join();
  return palin ? [sig(perm), sig([...perm].reverse())].sort()[0] : sig(perm);
}
function bentPathEqualSum({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const path = difficulty === 1 ? pick(PATHS.slice(0, 3)) : difficulty === 2 ? pick(PATHS.slice(0, 5)) : pick(PATHS.slice(2));
    const { pts, segs } = pathLayout(path);
    const n = pts.length;
    const values = pickDistinct(n, 1, n + (difficulty === 1 ? 3 : 5));
    const sols = permutations(values).filter((p) => segs.every((s) => sum(s.map((i) => p[i])) === sum(segs[0].map((i) => p[i]))));
    if (!sols.length) continue;
    const sigs = new Set(sols.map((p) => pathSignature(path, p)));
    if (sigs.size !== 1) continue;
    const truth = sols[0];
    const S = sum(segs[0].map((i) => truth[i]));
    const corners = segs.slice(1).map((s) => s[0]);
    return {
      prompt: `다음 그림에서 같은 직선 위에 있는 수들의 합이 모두 같아지게 ${listEul(values)} 하나씩 넣으세요.`,
      visual: { kind: "fig", html: `<div style="display:grid;justify-items:center;gap:10px">${cardStrip(values)}${pathSvg(path, Array(n).fill(""))}</div>` },
      answer: `꺾이는 원에 ${corners.map((i) => truth[i]).join(", ")} (한 줄의 합 ${S})`,
      answerVisual: { kind: "fig", html: pathSvg(path, truth) },
      solution: `꺾이는 원의 수는 두 직선에 함께 더해집니다. 직선마다 원의 개수가 다르므로, 원이 적은 직선에는 큰 수를, 원이 많은 직선에는 작은 수를 놓아야 합이 같아집니다. 꺾이는 원에 넣을 수를 정해 놓고 남은 수로 합을 맞추면 꺾이는 원에 ${corners.map((i) => truth[i]).join(", ")}, 한 줄의 합은 ${S}입니다.`,
      meta: { family: "bent-path-b9", lens: path.lens, values, truth, S, solutions: sols.length }
    };
  }
  return null;
}

// ── (2차) 4단원 · 말로 된 단서 → 순서·자리·표 ─────────────────

const clueList = (lines) => `<ol style="margin:0;padding-left:20px;line-height:1.75;${FONT};font-size:15px;max-width:440px">${lines.map((l) => `<li>${l}</li>`).join("")}</ol>`;
const wrapRow = (parts) => `<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center">${parts.join("")}</div>`;
function slotBoxes(labels, values = []) {
  const w = 54;
  const body = labels.map((l, i) => `${txt(4 + i * w + w / 2, 12, l, { size: 12, weight: 600 })}<rect x="${4 + i * w}" y="22" width="${w}" height="38" style="fill:#fff;stroke:${EDGE};stroke-width:1.3"/>${values[i] ? txt(4 + i * w + w / 2, 42, values[i], { size: 14 }) : ""}`).join("");
  return svgWrap(labels.length * w + 8, 64, body, "칸");
}
// ○·× 표: 줄 머리 rows, 칸 머리 cols, marks[r][c]
function markTable(rows, cols, marks = null) {
  const cw = 46;
  const rh = 30;
  const lw = 58;
  let body = "";
  cols.forEach((c, j) => { body += `<rect x="${2 + lw + j * cw}" y="2" width="${cw}" height="${rh}" style="fill:#eaf4f6;stroke:${EDGE};stroke-width:1"/>${txt(2 + lw + j * cw + cw / 2, 2 + rh / 2 + 1, c, { size: 13 })}`; });
  rows.forEach((r, i) => {
    const y = 2 + rh * (i + 1);
    body += `<rect x="2" y="${y}" width="${lw}" height="${rh}" style="fill:#eaf4f6;stroke:${EDGE};stroke-width:1"/>${txt(2 + lw / 2, y + rh / 2 + 1, r, { size: 13 })}`;
    cols.forEach((_, j) => {
      body += `<rect x="${2 + lw + j * cw}" y="${y}" width="${cw}" height="${rh}" style="fill:#fff;stroke:${EDGE};stroke-width:1"/>`;
      if (marks && marks[i][j]) body += txt(2 + lw + j * cw + cw / 2, y + rh / 2 + 1, marks[i][j], { size: 15, fill: marks[i][j] === "○" ? "#d93a2b" : "#5f6f76" });
    });
  });
  return svgWrap(lw + cols.length * cw + 4, rh * (rows.length + 1) + 4, body, "○, × 표");
}
// 단서 고르기: 무게 둔 무작위 차례로 더하다가 답이 하나가 되면 멈추고, 빼도 되는 단서는 뺀다
function chooseClues(pool, solve, { max = 8 } = {}) {
  const ordered = pool.map((c) => ({ c, key: Math.random() ** (1 / (c.w || 1)) })).sort((x, y) => y.key - x.key).map((x) => x.c);
  const chosen = [];
  for (const c of ordered) {
    if (chosen.length >= max) break;
    chosen.push(c);
    if (solve(chosen).length === 1) break;
  }
  if (solve(chosen).length !== 1) return null;
  for (let i = chosen.length - 1; i >= 0; i -= 1) {
    const trial = chosen.filter((_, j) => j !== i);
    if (solve(trial).length === 1) chosen.splice(i, 1);
  }
  return chosen;
}

// (1) 달리기 뒤 아이들이 한 말 → 1등부터 5등까지
const subj = (name) => cnIga(name);
function raceClueText(c, names) {
  const X = names[c.x];
  if (c.kind === "overtake") return `${X} : 처음에는 ${c.from}등이었는데 ${c.n}명을 앞질렀어${c.notFirst ? ". 1등은 못 했지만 기뻐!" : "!"}`;
  if (c.kind === "fell") return `${X} : 앞장서 달리다가 신발이 벗겨지는 바람에 꼴찌로 들어왔어.`;
  if (c.kind === "lucky") return `${X} : ${callName(names[c.y])}한테 졌지만 다음엔 꼭 이길 거야.`;
  if (c.kind === "beat2") return `${X} : 나는 ${callName(names[c.y])}도, ${callName(names[c.z])}도 제쳤어.`;
  if (c.kind === "justAhead") return `${X} : 내 바로 앞에 ${subj(names[c.y])} 들어왔어.`;
  if (c.kind === "behind") return `${X} : 나보다 늦게 들어온 사람은 ${c.n}명이야.`;
  return `${X} : ${eun(callName(names[c.y]))} ${c.r}등이 아니었어.`;
}
function raceHolds(rank, c) {
  if (c.kind === "overtake") return rank[c.x] === c.from - c.n;
  if (c.kind === "fell") return rank[c.x] === 5;
  if (c.kind === "lucky") return rank[c.y] < rank[c.x];
  if (c.kind === "beat2") return rank[c.x] < rank[c.y] && rank[c.x] < rank[c.z];
  if (c.kind === "justAhead") return rank[c.y] === rank[c.x] - 1;
  if (c.kind === "behind") return rank[c.x] === 5 - c.n;
  return rank[c.y] !== c.r;
}
function raceTalkOrder({ difficulty = 2 } = {}) {
  const n = 5;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const names = shuffle(KIDS).slice(0, n);
    const rank = shuffle([1, 2, 3, 4, 5]); // rank[사람] = 등수
    const pool = [];
    for (let x = 0; x < n; x += 1) {
      const r = rank[x];
      for (let k = 1; r + k <= 5; k += 1) pool.push({ kind: "overtake", x, from: r + k, n: k, notFirst: r > 1 && Math.random() < 0.5, w: 0.5 });
      if (r === 5) pool.push({ kind: "fell", x, w: 0.6 });
      if (r < 5) pool.push({ kind: "behind", x, n: 5 - r, w: 0.4 });
      for (let y = 0; y < n; y += 1) {
        if (y === x) continue;
        if (rank[y] < r) pool.push({ kind: "lucky", x, y, w: 1.4 });
        if (rank[y] === r - 1) pool.push({ kind: "justAhead", x, y, w: 1.2 });
        for (let z = y + 1; z < n; z += 1) if (z !== x && rank[y] > r && rank[z] > r) pool.push({ kind: "beat2", x, y, z, w: 1.2 });
        for (let q = 1; q <= 5; q += 1) if (q !== rank[y]) pool.push({ kind: "not", x, y, r: q, w: 0.3 });
      }
    }
    const solve = (cl) => permutations([1, 2, 3, 4, 5]).filter((rk) => cl.every((c) => raceHolds(rk, c)));
    const chosen = chooseClues(pool, solve);
    if (!chosen || chosen.length < (difficulty === 1 ? 3 : 4)) continue;
    const direct = chosen.filter((c) => ["overtake", "fell", "behind"].includes(c.kind)).length;
    if (direct > (difficulty === 1 ? 2 : 1) || direct === 0 && difficulty === 1) continue;
    if (!chosen.some((c) => ["lucky", "beat2", "justAhead"].includes(c.kind))) continue;
    // 한 사람이 단서 둘 이상을 말하지 않게
    const speakers = chosen.map((c) => c.x);
    if (new Set(speakers).size !== speakers.length) continue;
    const order = [...names].sort((a, b) => rank[names.indexOf(a)] - rank[names.indexOf(b)]);
    return {
      prompt: `${names.join(", ")} 다섯 명이 달리기 시합을 했습니다. 아이들이 한 말을 보고 1등부터 5등까지 차례로 쓰세요.`,
      visual: { kind: "fig", html: wrapRow([clueList(chosen.map((c) => raceClueText(c, names))), slotBoxes(["1등", "2등", "3등", "4등", "5등"])]) },
      answer: order.join(", "),
      answerVisual: { kind: "fig", html: slotBoxes(["1등", "2등", "3등", "4등", "5등"], order) },
      solution: `말 속에서 등수를 바로 알 수 있는 것(처음 등수에서 앞지른 사람 수를 빼기, 맨 마지막, 뒤에 들어온 사람 수)부터 칸에 쓰고, 「누구한테 졌다」「바로 앞에 들어왔다」처럼 앞뒤를 말한 것으로 남은 칸을 채웁니다. 1등부터 ${order.join(", ")}입니다.`,
      meta: { family: "race-talk-b9", names, rank, clues: chosen, answer: order }
    };
  }
  return null;
}

// (2) 다섯 형제 — 자리마다 몇째가 앉는지 정해진 둥근 탁자. 형제들의 말로 각자 몇째인지
const ORDINALS = ["첫째", "둘째", "셋째", "넷째", "다섯째"];
function siblingClueText(c, names) {
  const X = names[c.x];
  if (c.kind === "youngest") return `${X} : 저는 막내예요.`;
  if (c.kind === "eldest") return `${X} : 저는 맏이예요.`;
  if (c.kind === "olderCount") return `${X} : 저보다 나이가 많은 형은 ${c.n}명이에요.`;
  if (c.kind === "oneYounger") return `${X} : 제 아래로는 동생이 딱 한 명 있어요.`;
  if (c.kind === "nextYear") return `${X} : 한 해가 지나면 저는 지금의 ${wa(names[c.y])} 나이가 같아져요.`;
  if (c.kind === "nextTo") return `${X} : ${names[c.y]}${has(names[c.y]) ? "은" : "는"} 제 바로 옆자리예요.`;
  if (c.kind === "nextToYoungest") return `${X} : 막내는 제 바로 옆자리예요.`;
  if (c.kind === "notNextTo") return `${X} : ${names[c.y]}${has(names[c.y]) ? "은" : "는"} 제 옆에 앉아 있지 않아요.`;
  return `${X} : 제 양옆에 앉은 사람은 모두 저보다 나이가 많아요.`;
}
function siblingHolds(ord, seatOf, c) {
  // ord[사람] = 몇째(0~4), seatOf[몇째] = 탁자 자리(0~4, 둘레 차례)
  const near = (p, q) => { const d = Math.abs(seatOf[ord[p]] - seatOf[ord[q]]); return d === 1 || d === 4; };
  const who = (k) => ord.indexOf(k);
  if (c.kind === "youngest") return ord[c.x] === 4;
  if (c.kind === "eldest") return ord[c.x] === 0;
  if (c.kind === "olderCount") return ord[c.x] === c.n;
  if (c.kind === "oneYounger") return ord[c.x] === 3;
  if (c.kind === "nextYear") return ord[c.y] === ord[c.x] - 1;
  if (c.kind === "nextTo") return near(c.x, c.y);
  if (c.kind === "notNextTo") return !near(c.x, c.y);
  if (c.kind === "nextToYoungest") return near(c.x, who(4));
  const s = seatOf[ord[c.x]];
  const nb = [seatOf.indexOf((s + 1) % 5), seatOf.indexOf((s + 4) % 5)].map(who);
  return nb.every((p) => ord[p] < ord[c.x]);
}
function siblingTableSvg(seatOf, labels = []) {
  const R = 80;
  const cx = 140;
  const cy = 130;
  let body = `<circle cx="${cx}" cy="${cy}" r="${R - 34}" style="fill:#e6f3f6;stroke:${EDGE};stroke-width:1.4"/>`;
  for (let s = 0; s < 5; s += 1) {
    const a = -Math.PI / 2 - (s * 2 * Math.PI) / 5;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    const k = seatOf.indexOf(s);
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19" style="fill:#fff;stroke:${EDGE};stroke-width:1.6"/>`;
    if (labels[k]) body += txt(x.toFixed(1), (y + 1).toFixed(1), labels[k], { size: 14 });
    const lx = cx + Math.cos(a) * (R + 40);
    const ly = cy + Math.sin(a) * (R + 34);
    body += txt(lx.toFixed(1), ly.toFixed(1), ORDINALS[k], { size: 12, weight: 600, fill: "#5f6f76" });
  }
  return svgWrap(280, 262, body, "몇째 자리인지 적힌 둥근 탁자");
}
function siblingSeatOrder({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const names = ["A", "B", "C", "D", "E"];
    const ord = shuffle([0, 1, 2, 3, 4]);
    const seatOf = shuffle([0, 1, 2, 3, 4]); // seatOf[몇째] = 자리
    const pool = [];
    for (let x = 0; x < 5; x += 1) {
      if (ord[x] === 4) pool.push({ kind: "youngest", x, w: 0.6 });
      if (ord[x] === 0) pool.push({ kind: "eldest", x, w: 0.4 });
      if (ord[x] >= 1 && ord[x] <= 2) pool.push({ kind: "olderCount", x, n: ord[x], w: 0.5 });
      if (ord[x] === 3) pool.push({ kind: "oneYounger", x, w: 1 });
      pool.push({ kind: "allOlder", x, w: 0.8 });
      if (ord[x] !== 4) pool.push({ kind: "nextToYoungest", x, w: 1.2 });
      for (let y = 0; y < 5; y += 1) {
        if (y === x) continue;
        if (ord[y] === ord[x] - 1) pool.push({ kind: "nextYear", x, y, w: 1.5 });
        pool.push({ kind: "nextTo", x, y, w: 1 });
        pool.push({ kind: "notNextTo", x, y, w: 0.5 });
      }
    }
    const truthPool = pool.filter((c) => siblingHolds(ord, seatOf, c));
    const solve = (cl) => permutations([0, 1, 2, 3, 4]).filter((o) => cl.every((c) => siblingHolds(o, seatOf, c)));
    const chosen = chooseClues(truthPool, solve, { max: 7 });
    if (!chosen || chosen.length < (difficulty === 1 ? 3 : 4) || chosen.length > 6) continue;
    if (!chosen.some((c) => c.kind === "nextYear") || !chosen.some((c) => ["nextTo", "nextToYoungest", "allOlder", "notNextTo"].includes(c.kind))) continue;
    const speakerCount = new Map();
    chosen.forEach((c) => speakerCount.set(c.x, (speakerCount.get(c.x) || 0) + 1));
    if ([...speakerCount.values()].some((v) => v > 2)) continue;
    const answer = names.map((nm, p) => `${nm} ${ORDINALS[ord[p]]}`).join(", ");
    return {
      prompt: "다섯 형제 A, B, C, D, E가 그림과 같이 둥근 탁자에 둘러앉아 있습니다. 자리 바깥에는 그 자리에 앉은 사람이 몇째인지 적혀 있습니다. 형제들의 말을 보고 A, B, C, D, E가 각각 어느 자리에 앉아 있는지 찾으세요. (형제는 한 살씩 차이가 나고, 쌍둥이는 없습니다.)",
      visual: { kind: "fig", html: wrapRow([clueList(chosen.map((c) => siblingClueText(c, names))), siblingTableSvg(seatOf)]) },
      answer,
      answerVisual: { kind: "fig", html: siblingTableSvg(seatOf, ORDINALS.map((_, k) => names[ord.indexOf(k)])) },
      solution: `「막내」「아래로 동생이 한 명」「나보다 나이 많은 형이 몇 명」처럼 몇째인지 바로 알려 주는 말부터 자리를 정합니다. 「한 해가 지나면 지금의 누구와 나이가 같아진다」는 그 사람이 나보다 바로 한 살 위라는 뜻이므로 몇째가 하나 앞입니다. 그다음 탁자 그림에서 옆자리 조건을 확인하면 ${answer}입니다.`,
      meta: { family: "sibling-seat-b9", ord, seatOf, clues: chosen, answer }
    };
  }
  return null;
}

// (3) 책상 번호 — 「앉지 않습니다」 목록 + 「만약 …가 아니라면 …도 아닙니다」 하나
const CIRCLED = ["①", "②", "③", "④", "⑤"];
function deskSolutions(n, bans, cond) {
  return permutations([...Array(n).keys()]).filter((seat) => bans.every((b) => !b.seats.includes(seat[b.x])) && (!cond || seat[cond.x] === cond.a || seat[cond.y] !== cond.b));
}
function deskExclusionIf({ difficulty = 2 } = {}) {
  const n = 5;
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const names = ["A", "B", "C", "D", "E"];
    const truth = shuffle([...Array(n).keys()]); // truth[사람] = 책상(0~4)
    const bans = names.map((_, x) => {
      const wrong = shuffle([...Array(n).keys()].filter((s) => s !== truth[x]));
      return { x, seats: wrong.slice(0, randomInt(difficulty === 1 ? 2 : 1, 3)).sort((a, b) => a - b) };
    });
    const before = deskSolutions(n, bans, null);
    if (before.length < 2 || before.length > (difficulty === 3 ? 6 : 4)) continue;
    const conds = [];
    for (let x = 0; x < n; x += 1) for (let a = 0; a < n; a += 1) for (let y = 0; y < n; y += 1) for (let b = 0; b < n; b += 1) {
      if (x === y) continue;
      const c = { x, a, y, b };
      if (truth[x] === a || truth[y] !== b) { if (deskSolutions(n, bans, c).length === 1) conds.push(c); }
    }
    // 조건이 가정을 쓰게: 참인 답에서는 「…가 아니라면」 쪽이 맞는 경우를 먼저
    const useful = conds.filter((c) => truth[c.x] !== c.a);
    const cond = pick(useful.length ? useful : conds);
    if (!cond) continue;
    const varying = [...Array(n).keys()].filter((p) => new Set(before.map((s) => s[p])).size > 1 && p !== cond.x && p !== cond.y);
    const target = varying.length ? pick(varying) : pick([...Array(n).keys()].filter((p) => new Set(before.map((s) => s[p])).size > 1));
    if (target === undefined) continue;
    const lines = bans.map((b) => `${names[b.x]}는 ${b.seats.map((s) => CIRCLED[s]).join(", ")}번 책상에 앉아 있지 않습니다.`);
    lines.push(`${names[cond.x]}가 ${CIRCLED[cond.a]}번 책상이 아니라면, ${names[cond.y]}는 ${CIRCLED[cond.b]}번 책상에 앉을 수 없습니다.`);
    const marks = names.map((_, x) => [...Array(n).keys()].map((s) => (truth[x] === s ? "○" : "×")));
    return {
      prompt: `책상 다섯 개에 앞에서부터 ①, ②, ③, ④, ⑤번이 붙어 있고, A, B, C, D, E 다섯 명이 한 사람씩 앉아 있습니다. 다음을 읽고 표에 ○, ×를 써 가며 ${names[target]}가 몇 번 책상에 앉아 있는지 구하세요.`,
      visual: { kind: "fig", html: wrapRow([clueList(lines), markTable(names, CIRCLED)]) },
      answer: `${CIRCLED[truth[target]]}번`,
      answerVisual: { kind: "fig", html: markTable(names, CIRCLED, marks) },
      solution: `「앉아 있지 않습니다」를 표에 ×로 지우고, ○가 하나만 남는 줄이나 칸부터 채우면 ${before.length}가지 경우가 남습니다. 마지막 문장은 ${names[cond.x]}가 ${CIRCLED[cond.a]}번이 아닌 경우에는 ${names[cond.y]}가 ${CIRCLED[cond.b]}번일 수 없다는 뜻이므로, 남은 경우 가운데 이에 어긋나는 것을 지우면 ${names.map((nm, x) => `${nm} ${CIRCLED[truth[x]]}`).join(", ")}입니다. 따라서 ${names[target]}는 ${CIRCLED[truth[target]]}번 책상입니다.`,
      meta: { family: "desk-if-b9", n, bans, cond, truth, target, before: before.length }
    };
  }
  return null;
}

// (4) 직업 — 「친합니다」「옆집」「결혼한 사이」 같은 말을 표로
const JOBS = [
  { job: "의사", act: "환자를 진찰하느라 바쁩니다" },
  { job: "화가", act: "전시회에 걸 그림을 그리고 있습니다" },
  { job: "교사", act: "학생들의 숙제를 검사하고 있습니다" },
  { job: "작곡가", act: "새 노래를 만드는 작업에 들어갔습니다" },
  { job: "요리사", act: "식당의 새 메뉴를 만들고 있습니다" },
  { job: "소방관", act: "불을 끄는 훈련을 받고 있습니다" }
];
const ADULTS = ["지성", "유진", "준교", "진우", "서연", "도윤", "하람", "민재", "수아", "태경"];
function jobClueText(c, names, jobs) {
  const X = names[c.x];
  if (c.kind === "friends") return `${eun(X)} ${wa(jobs[c.j1])} ${jobs[c.j2]}의 오랜 친구입니다.`;
  if (c.kind === "neighbor") return `${X}의 이웃은 ${jobs[c.j]}입니다.`;
  if (c.kind === "married") return `${wa(X)} ${eun(jobs[c.j])} 같은 동아리에서 만났습니다.`;
  if (c.kind === "older") return `${eun(jobs[c.j])} ${X}보다 나이가 많습니다.`;
  return `${eun(X)} ${JOBS.find((d) => d.job === jobs[c.j]).act}.`;
}
function jobHolds(as, c) {
  // as[사람] = 직업 번호
  if (c.kind === "friends") return as[c.x] !== c.j1 && as[c.x] !== c.j2;
  if (c.kind === "act") return as[c.x] === c.j;
  return as[c.x] !== c.j;
}
function jobRelationClues({ difficulty = 2 } = {}) {
  const n = 4;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const names = shuffle(ADULTS).slice(0, n);
    const jobs = shuffle(JOBS).slice(0, n).map((d) => d.job);
    const as = shuffle([...Array(n).keys()]);
    const pool = [];
    for (let x = 0; x < n; x += 1) for (let j = 0; j < n; j += 1) {
      if (as[x] === j) { pool.push({ kind: "act", x, j, w: 0.5 }); continue; }
      pool.push({ kind: "neighbor", x, j, w: 1 }, { kind: "married", x, j, w: 1 }, { kind: "older", x, j, w: 0.8 });
      for (let j2 = j + 1; j2 < n; j2 += 1) if (as[x] !== j2) pool.push({ kind: "friends", x, j1: j, j2, w: 1.6 });
    }
    const solve = (cl) => permutations([...Array(n).keys()]).filter((p) => cl.every((c) => jobHolds(p, c)));
    const chosen = chooseClues(pool, solve, { max: 6 });
    if (!chosen || chosen.length < 3) continue;
    if (chosen.filter((c) => c.kind === "act").length > 1) continue;
    if (difficulty >= 2 && !chosen.some((c) => c.kind === "friends")) continue;
    const kinds = new Set(chosen.map((c) => c.kind));
    if (kinds.size < 3 && difficulty >= 2) continue;
    const actJob = chosen.find((c) => c.kind === "act")?.j;
    const targetJob = pick([...Array(n).keys()].filter((j) => j !== actJob));
    const who = names[as.indexOf(targetJob)];
    const marks = jobs.map((_, j) => names.map((__, x) => (as[x] === j ? "○" : "×")));
    return {
      prompt: `${names.join(", ")}${has(names.at(-1)) ? "은" : "는"} 각각 ${jobs.join(", ")} 중 서로 다른 직업을 하나씩 가지고 있습니다. 다음을 읽고 표에 ○, ×를 써 가며 ${iga(jobs[targetJob])} 누구인지 찾으세요.`,
      visual: { kind: "fig", html: wrapRow([clueList(chosen.map((c) => jobClueText(c, names, jobs))), markTable(jobs, names)]) },
      answer: who,
      answerVisual: { kind: "fig", html: markTable(jobs, names, marks) },
      solution: `「친구」「이웃」「동아리에서 만났다」「나이가 많다」는 말에 나온 사람과 그 직업이 서로 다른 사람이라는 뜻이므로 표에 ×를 씁니다. ${chosen.some((c) => c.kind === "act") ? "하는 일을 말한 사람은 그 직업에 ○를 쓰고, " : ""}○가 정해진 줄과 칸의 나머지를 ×로 지워 가면 ${jobs.map((jb, j) => `${jb} ${names[as.indexOf(j)]}`).join(", ")}입니다. 따라서 ${eun(jobs[targetJob])} ${who}입니다.`,
      meta: { family: "job-clues-b9", names, jobs, as, clues: chosen, targetJob, answer: who }
    };
  }
  return null;
}

// ── 내보내기 ─────────────────────────────────────────

// 뽑기가 드물게 실패하면 다시 뽑는다(그래도 안 되면 null).
const retry = (make) => (options = {}) => {
  for (let i = 0; i < 30; i += 1) {
    const made = make(options);
    if (made) return made;
  }
  return null;
};

export const BOOK09_STRUCTURE_GENERATORS = {
  tiltedTriangleInRectB9: retry((o) => tiltedAreaProblem("triangle", o)),
  tiltedQuadInRectB9: retry((o) => tiltedAreaProblem("quad", o)),
  tiltedParallelogramInRectB9: retry((o) => tiltedAreaProblem("parallelogram", o)),
  tiltedRectangleInRectB9: retry((o) => tiltedAreaProblem("rectangle", o)),
  tiltedPentagonInRectB9: retry((o) => tiltedAreaProblem("pentagon", o)),
  tiltedSquareFrameB9: retry(tiltedSquareFrame),
  cubeLeftViewCountB9: retry((o) => cubeLeftViewProblem("count", o)),
  cubeLeftViewMinmaxB9: retry((o) => cubeLeftViewProblem("minmax", o)),
  cubeFourLayerViewsB9: retry(cubeFourLayerViews),
  cubeSolidTopNumbersB9: retry(cubeSolidTopNumbers),
  magicThreeGivensB9: retry(magicThreeGivens),
  magicFourCrossClueB9: retry(magicFourCrossClue),
  triangleSixMinMaxB9: retry(triangleSixMinMax),
  triangleSixTwoSumsB9: retry(triangleSixTwoSums),
  triangleNineAllWaysB9: retry(triangleNineAllWays),
  mixedDirectionGapB9: retry(mixedDirectionGap),
  valueListMixedCluesB9: retry(valueListMixedClues),
  roundTableFiveB9: retry((o) => roundTableMixed({ ...o, size: 5 })),
  roundTableSixB9: retry((o) => roundTableMixed({ ...o, size: 6 })),
  // (2차)
  partitionTwoWaysB9: retry(partitionTwoWays),
  repTileFourB9: retry((o) => repTileFour({ ...o, stars: false })),
  repTileFourStarB9: retry((o) => repTileFour({ ...o, stars: true })),
  partitionOtherWayB9: retry(partitionOtherWay),
  coverWithPieceStarB9: retry(coverWithPiece),
  twoSquareFencesB9: retry(twoSquareFences),
  cubeViewModelAllB9: retry(cubeViewModelAll),
  cubeViewsFillCubeB9: retry(cubeViewsFillCube),
  cubeCheckerMinBlackB9: retry(cubeCheckerMinBlack),
  chainCirclesWaysB9: retry(chainCirclesWays),
  wheelLineRingB9: retry(wheelLineRing),
  crossGridSumExtremeB9: retry(crossGridMinMax),
  ringsTargetSumB9: retry(ringsTargetSum),
  triangleSevenFillB9: retry(triangleSevenFill),
  wheelCentersAllB9: retry(wheelCentersAll),
  bentPathEqualSumB9: retry(bentPathEqualSum),
  raceTalkOrderB9: retry(raceTalkOrder),
  siblingSeatOrderB9: retry(siblingSeatOrder),
  deskExclusionIfB9: retry(deskExclusionIf),
  jobRelationCluesB9: retry(jobRelationClues)
};

export const BOOK09_STRUCTURE_TYPE_ROWS = [
  // 1단원 — 바깥 직사각형 − 모서리 삼각형
  row("tilted-triangle-in-rect-b9", "geometry", "모눈 넓이", "직사각형 테두리에 꼭짓점이 있는 기울어진 삼각형의 넓이", "tiltedTriangleInRectB9", ["바깥 직사각형 빼기", "기울어진 삼각형", "모눈 넓이"]),
  row("tilted-quad-in-rect-b9", "geometry", "모눈 넓이", "직사각형 테두리에 꼭짓점이 있는 사각형의 넓이", "tiltedQuadInRectB9", ["바깥 직사각형 빼기", "기울어진 사각형", "모눈 넓이"]),
  row("tilted-parallelogram-in-rect-b9", "geometry", "모눈 넓이", "직사각형 테두리에 꼭짓점이 있는 기울어진 평행사변형의 넓이", "tiltedParallelogramInRectB9", ["바깥 직사각형 빼기", "기울어진 평행사변형"]),
  row("tilted-rectangle-in-rect-b9", "geometry", "모눈 넓이", "직사각형 테두리에 꼭짓점이 있는 기울어진 직사각형의 넓이", "tiltedRectangleInRectB9", ["바깥 직사각형 빼기", "기울어진 직사각형", "기울어진 정사각형"]),
  row("tilted-pentagon-in-rect-b9", "geometry", "모눈 넓이", "직사각형 테두리에 꼭짓점이 있는 오각형의 넓이", "tiltedPentagonInRectB9", ["바깥 직사각형 빼기", "오각형 넓이"]),
  row("tilted-square-frame-b9", "geometry", "모눈 넓이", "기울어진 두 정사각형 사이의 넓이", "tiltedSquareFrameB9", ["기울어진 정사각형", "테두리 넓이", "큰 넓이 빼기 작은 넓이"]),
  // 2단원 — 왼쪽 옆 · 네 층 · 입체에서 위 모양의 수
  row("cube-left-view-count-b9", "geometry", "쌓기나무 바탕그림", "위·앞·왼쪽 옆 모양을 보고 쌓기나무 개수 구하기", "cubeLeftViewCountB9", ["왼쪽 옆", "위 앞 옆 모양", "쌓기나무 개수"]),
  row("cube-left-view-minmax-b9", "geometry", "쌓기나무 바탕그림", "위·앞·왼쪽 옆 모양으로 가능한 최대·최소 개수 구하기", "cubeLeftViewMinmaxB9", ["왼쪽 옆", "최대 최소", "쌓기나무 개수"]),
  row("cube-four-layer-views-b9", "geometry", "쌓기나무 바탕그림", "4×4 바탕의 네 층 모양을 앞·옆 모양으로 나타내기", "cubeFourLayerViewsB9", ["층별 모양", "4층", "앞 옆 모양"]),
  row("cube-solid-top-numbers-b9", "geometry", "쌓기나무 바탕그림", "입체 모양을 위 모양의 수와 앞·옆 모양으로 나타내고 최소 개수 구하기", "cubeSolidTopNumbersB9", ["바탕그림의 수", "위 앞 옆 모양", "최소 개수"]),
  // 3단원 — 마방진·삼각진
  row("magic-three-givens-b9", "number", "마방진", "단서 몇 개로 3×3 마방진의 한 줄 합을 구하고 모두 채우기", "magicThreeGivensB9", ["3×3 마방진", "가운데 수의 3배", "빈칸 채우기"]),
  row("magic-four-cross-clue-b9", "number", "마방진", "4×4 마방진에서 두 줄이 만나는 빈칸으로 모르는 수 구하기", "magicFourCrossClueB9", ["4×4 마방진", "두 줄 비교", "A+B"]),
  row("triangle-six-min-max-b9", "number", "수 배열과 합", "연속한 여섯 수 삼각진의 가장 작은 합과 가장 큰 합", "triangleSixMinMaxB9", ["삼각진", "가장 작은 합", "가장 큰 합"]),
  row("triangle-six-two-sums-b9", "number", "수 배열과 합", "연속한 여섯 수로 두 가지 합의 삼각진 만들기", "triangleSixTwoSumsB9", ["삼각진", "꼭짓점의 합", "한 변의 합"]),
  row("triangle-nine-all-ways-b9", "number", "수 배열과 합", "1부터 9까지 삼각진의 배치를 모두 찾기", "triangleNineAllWaysB9", ["삼각진", "네 수의 합", "모든 경우"]),
  // 4단원 — 순서·자리
  row("mixed-direction-gap-b9", "logic", "순서와 비교", "기준 없이 앞·뒤로 섞인 차로 두 사람의 차 구하기", "mixedDirectionGapB9", ["기준 정하기", "차 이어 가기", "앞 뒤 위치"]),
  row("value-list-mixed-clues-b9", "logic", "순서와 비교", "값 목록과 차이·순서 조건으로 한 사람의 값 정하기", "valueListMixedCluesB9", ["값 목록", "차이 조건", "순서 조건"]),
  row("round-table-five-b9", "logic", "자리 배치", "다섯 명의 둥근 탁자 자리 정하기(이웃하지 않음·오른쪽)", "roundTableFiveB9", ["둥근 탁자", "이웃하지 않음", "오른쪽 왼쪽"]),
  row("round-table-six-b9", "logic", "자리 배치", "여섯 명의 둥근 탁자 자리 정하기(마주 봄·한 사람 건너)", "roundTableSixB9", ["둥근 탁자", "마주 보기", "한 사람 건너"]),
  // (2차) 1단원 — 나누어 그리기
  row("partition-two-ways-b9", "geometry", "도형 분할", "같은 도형을 모양과 크기가 같은 k조각과 m조각으로 각각 나누기", "partitionTwoWaysB9", ["두 가지로 나누기", "합동 분할", "4조각과 3조각"]),
  row("rep-tile-four-b9", "geometry", "도형 분할", "처음 도형과 모양이 같은 작은 4조각으로 나누기", "repTileFourB9", ["닮은 4조각", "자기 닮음", "합동 분할"]),
  row("rep-tile-four-star-b9", "geometry", "도형 분할", "★이 하나씩 들어가게 처음 도형과 모양이 같은 4조각으로 나누기", "repTileFourStarB9", ["닮은 4조각", "별 하나씩", "합동 분할"]),
  row("partition-other-way-b9", "geometry", "도형 분할", "보기와 다른 모양으로 모양과 크기가 같은 4조각 나누기", "partitionOtherWayB9", ["보기와 다르게", "합동 분할", "돌려 붙인 도형"]),
  row("two-square-fences-b9", "geometry", "도형 분할", "정사각형 울타리 두 개를 엇갈려 쳐서 동물을 한 마리씩 떼어 놓기", "twoSquareFencesB9", ["울타리", "정사각형 두 개", "칸 나누기"]),
  row("cover-with-piece-star-b9", "geometry", "도형 분할", "주어진 조각 4개로 ★이 하나씩 들어가게 도형 나누기", "coverWithPieceStarB9", ["주어진 조각", "별 하나씩", "조각 덮기"]),
  // (2차) 2단원 — 쌓기나무
  row("cube-view-model-all-b9", "geometry", "쌓기나무 바탕그림", "위·앞·오른쪽 옆 모양과 맞는 쌓은 모양을 모두 고르기", "cubeViewModelAllB9", ["모두 고르기", "위 앞 옆 모양", "쌓은 모양"]),
  row("cube-views-fill-cube-b9", "geometry", "쌓기나무 채우기", "세 방향 모양을 보고 정육면체를 만드는 데 더 필요한 가장 적은 개수", "cubeViewsFillCubeB9", ["정육면체 만들기", "적어도 몇 개", "가장 많이 쌓은 경우"]),
  row("cube-checker-min-black-b9", "geometry", "쌓기나무 색칠", "같은 색이 맞닿지 않게 쌓은 직육면체에서 검은색의 가장 적은 개수", "cubeCheckerMinBlackB9", ["번갈아 쌓기", "검은색 최소", "꼭짓점 색"]),
  // (2차) 3단원 — 수 배열과 합
  row("chain-circles-ways-b9", "number", "수 배열과 합", "겹친 원의 영역에 수를 넣어 원마다 합이 같은 경우를 모두 찾기", "chainCirclesWaysB9", ["겹친 원", "영역", "모든 경우"]),
  row("wheel-line-ring-b9", "number", "수 배열과 합", "지름 위 세 수의 합과 둘레의 수의 합이 같게 만들기", "wheelLineRingB9", ["지름과 둘레", "가운데 수", "마주 보는 짝"]),
  row("cross-grid-sum-extreme-b9", "number", "수 배열과 합", "가로·세로 합이 같은 기호끼리 같을 때 가운데 줄 합의 가장 작은(큰) 값", "crossGridSumExtremeB9", ["가로 세로 합", "같은 기호", "가장 작은 수"]),
  row("rings-target-sum-b9", "number", "수 배열과 합", "고리처럼 이은 원마다 합이 정해진 수가 되게 채우기", "ringsTargetSumB9", ["고리 원", "겹친 영역", "합 맞추기"]),
  row("triangle-seven-fill-b9", "number", "수 배열과 합", "두 삼각형과 세 직선 위의 합이 같게 일곱 수 모두 놓기", "triangleSevenFillB9", ["삼각형과 직선", "가운데 수", "일곱 수"]),
  row("wheel-centers-all-b9", "number", "원형진", "원형진의 가운데에 올 수 있는 수를 모두 찾고 완성하기", "wheelCentersAllB9", ["원형진", "가운데 수", "세 가지"]),
  row("bent-path-equal-sum-b9", "number", "수 배열과 합", "꺾인 길 위 직선마다 합이 같게 수 놓기", "bentPathEqualSumB9", ["꺾인 길", "꺾이는 원", "직선의 합"]),
  // (2차) 4단원 — 말로 된 단서
  row("race-talk-order-b9", "logic", "순서와 비교", "아이들이 한 말로 1등부터 5등까지 정하기", "raceTalkOrderB9", ["말로 된 단서", "달리기 등수", "앞지르기"]),
  row("sibling-seat-order-b9", "logic", "자리 배치", "다섯 형제의 말로 몇째 자리에 앉았는지 찾기", "siblingSeatOrderB9", ["형제", "몇째", "둥근 탁자"]),
  row("desk-exclusion-if-b9", "logic", "조건표 추리", "앉지 않은 자리와 「만약 ~라면」 조건으로 책상 번호 정하기", "deskExclusionIfB9", ["○× 표", "만약 ~라면", "자리 정하기"]),
  row("job-relation-clues-b9", "logic", "조건표 추리", "친구·이웃 같은 말을 표로 바꾸어 직업 정하기", "jobRelationCluesB9", ["○× 표", "직업 정하기", "말을 표로"])
];

export const BOOK09_STRUCTURE_GUIDES = {
  "tilted-triangle-in-rect-b9": "삼각형을 꼭 맞게 둘러싼 직사각형의 넓이에서 바깥의 직각삼각형 세 개를 뺍니다.",
  "tilted-quad-in-rect-b9": "사각형을 꼭 맞게 둘러싼 직사각형을 그리고, 모서리마다 생기는 직각삼각형의 넓이를 뺍니다.",
  "tilted-parallelogram-in-rect-b9": "둘러싼 직사각형에서 마주 보는 두 쌍의 똑같은 직각삼각형을 뺍니다.",
  "tilted-rectangle-in-rect-b9": "기울어진 직사각형도 둘러싼 직사각형에서 네 모서리의 직각삼각형을 빼서 구합니다.",
  "tilted-pentagon-in-rect-b9": "오각형을 둘러싼 직사각형에서 테두리 위 꼭짓점 사이에 생기는 직각삼각형만 뺍니다.",
  "tilted-square-frame-b9": "큰 정사각형과 작은 정사각형의 넓이를 각각 둘러싼 정사각형에서 삼각형을 빼서 구한 뒤 큰 것에서 작은 것을 뺍니다.",
  "cube-left-view-count-b9": "왼쪽 옆에서 보면 뒷줄이 왼쪽에 보입니다. 앞과 왼쪽 옆의 층수를 위 모양의 줄에 맞춰 적고 칸마다 수를 정합니다.",
  "cube-left-view-minmax-b9": "가장 많을 때는 칸마다 앞과 왼쪽 옆 층수 중 작은 수, 가장 적을 때는 가장 높은 층을 한 번씩만 맞추고 나머지는 1개입니다.",
  "cube-four-layer-views-b9": "층별 그림을 겹쳐 칸마다 몇 층인지 세고, 앞과 옆에서는 줄마다 가장 높은 층만 그립니다.",
  "cube-solid-top-numbers-b9": "위 모양은 1층 모양이고, 칸마다 쌓인 개수를 쓴 뒤 앞·옆은 줄마다 가장 높은 층을 그립니다.",
  "magic-three-givens-b9": "가운데를 지나는 줄의 양 끝 합은 가운데 수의 2배, 한 줄의 합은 가운데 수의 3배입니다.",
  "magic-four-cross-clue-b9": "두 줄이 빈칸 하나를 함께 쓰면, 그 빈칸을 뺀 나머지 수들의 합이 서로 같습니다.",
  "triangle-six-min-max-b9": "세 변의 합 = 모든 수의 합 + 꼭짓점의 합이므로 꼭짓점에 작은 수를 놓으면 가장 작고 큰 수를 놓으면 가장 큽니다.",
  "triangle-six-two-sums-b9": "한 변의 합 × 3 − 모든 수의 합 = 꼭짓점 세 수의 합으로 꼭짓점을 먼저 정합니다.",
  "triangle-nine-all-ways-b9": "꼭짓점의 합을 먼저 구해 꼭짓점을 놓고, 남은 수를 변마다 모자란 합이 되게 두 개씩 짝짓는 방법을 모두 찾습니다.",
  "mixed-direction-gap-b9": "기준이 없으면 한 사람을 10처럼 편한 수로 두고 앞(+)·뒤(−)를 따라가며 모두 구한 뒤 차를 봅니다.",
  "value-list-mixed-clues-b9": "차이가 정해진 두 사람은 값 목록에서 그만큼 떨어진 자리에만 놓이므로 그 짝부터 놓고 순서 조건으로 남은 자리를 정합니다.",
  "round-table-five-b9": "가장 분명한 조건의 두 사람을 먼저 그림에 놓고, 이웃하지 않음·오른쪽 조건으로 남은 자리를 지워 갑니다.",
  "round-table-six-b9": "마주 보는 두 사람이나 한 사람을 건너 앉은 두 사람을 먼저 놓고 나머지 조건에 맞게 채웁니다.",
  "partition-two-ways-b9": "전체 칸 수를 조각 수로 나누어 한 조각의 칸 수를 먼저 구하고, 튀어나온 칸부터 같은 모양을 놓아 봅니다.",
  "rep-tile-four-b9": "모양이 같은 4조각이면 변의 길이가 모두 반이 되므로, 작은 같은 모양을 모서리부터 맞추어 넣습니다.",
  "rep-tile-four-star-b9": "변의 길이가 반인 작은 같은 모양을 ★이 하나씩 들어가게 모서리부터 놓아 봅니다.",
  "partition-other-way-b9": "한 조각의 칸 수를 구한 뒤 보기와 다른 모양을 정하고, 가운데를 중심으로 돌려 가며 놓을 수 있는지 확인합니다.",
  "two-square-fences-b9": "정사각형 두 개를 따로 치면 칸이 적으므로, 하나를 비스듬히 돌려 엇갈려 겹치면 칸이 가장 많이 생깁니다.",
  "cover-with-piece-star-b9": "조각을 놓을 방법이 적은 튀어나온 칸부터 조각을 돌리거나 뒤집어 맞추고, ★이 둘 들어가는 자리는 지웁니다.",
  "cube-view-model-all-b9": "위에서 본 모양으로 1층 자리를, 앞과 옆에서 본 모양으로 줄마다 가장 높은 층을 하나씩 대어 보고 셋이 모두 맞는 것만 고릅니다.",
  "cube-views-fill-cube-b9": "더 쌓는 개수가 가장 적으려면 지금 가장 많이 쌓여 있어야 하므로, 칸마다 앞과 옆 층수 중 작은 수만큼 쌓았다고 보고 정육면체 개수에서 뺍니다.",
  "cube-checker-min-black-b9": "한 칸 갈 때마다 색이 바뀌므로 두 색의 개수는 같거나 1개 차이이고, 꼭짓점 색이 더 많습니다.",
  "chain-circles-ways-b9": "겹친 영역의 수는 두 원에 함께 더해지므로, 수가 적게 든 끝 원에 큰 수를 넣으며 경우를 모두 찾습니다.",
  "wheel-line-ring-b9": "직선의 합을 모두 더하면 가운데 수가 여러 번 들어가므로, 둘레의 합과 견주어 가운데 수를 먼저 구합니다.",
  "cross-grid-sum-extreme-b9": "같은 기호인 가로줄과 세로줄은 겹친 칸을 빼고 남은 칸의 합이 같아야 하므로 그 짝부터 맞춥니다.",
  "rings-target-sum-b9": "양 끝 원은 수가 두 개뿐이라 겹친 칸이 바로 정해지고, 그다음 원에서 남은 두 수의 합을 차례로 구합니다.",
  "triangle-seven-fill-b9": "모든 줄의 합을 더해 가운데 수와 한 줄의 합을 먼저 구하고, 가운데를 지나는 줄마다 두 수의 짝을 정합니다.",
  "wheel-centers-all-b9": "가운데 수를 빼고 남은 수들이 합이 같은 짝으로 나뉘어야 하므로 가장 작은 수, 한가운데 수, 가장 큰 수만 가운데에 올 수 있습니다.",
  "bent-path-equal-sum-b9": "꺾이는 원은 두 직선에 함께 들어가므로, 원이 적은 직선에는 큰 수를 놓아 합을 맞춥니다.",
  "race-talk-order-b9": "말 속에서 등수를 바로 알 수 있는 것부터 칸에 쓰고, 누가 누구를 이겼다는 말로 남은 칸을 채웁니다.",
  "sibling-seat-order-b9": "몇째인지 바로 알려 주는 말부터 정하고, 「한 해 지나면 지금의 누구와 나이가 같다」는 바로 한 살 위라는 뜻으로 읽습니다.",
  "desk-exclusion-if-b9": "「앉아 있지 않습니다」를 표에 ×로 지운 뒤 남은 경우를 「~가 아니라면」 문장에 넣어 어긋나는 경우를 지웁니다.",
  "job-relation-clues-b9": "친구·이웃처럼 두 사람 사이를 말하면 서로 다른 사람이라는 뜻이므로 표에 ×를 쓰고, ○가 하나 남는 줄부터 정합니다."
};

export const BOOK09_STRUCTURE_REMAPS = [
  // 1단원 — 활동 1의 번호가 한 칸 밀려 있던 것(번호 없는 도입 예시를 1번으로 셈): 1번은 두 조각, 2번은 1~4가 한 번씩 든 네 조각
  ["book-09", 1, "activity", 1, [1], "rotational-partition-two"],
  ["book-09", 1, "activity", 1, [2], "latin-square-congruent-partition-b9"],
  // 1단원 — 바깥 직사각형 − 모서리 삼각형
  ["book-09", 1, "check", 2, [2], "tilted-triangle-in-rect-b9"],
  ["book-09", 1, "check", 2, [3], "tilted-parallelogram-in-rect-b9"],
  ["book-09", 1, "check", 2, [4], "tilted-rectangle-in-rect-b9"],
  ["book-09", 1, "practice", 1, [15], "tilted-quad-in-rect-b9"],
  ["book-09", 1, "practice", 1, [20], "tilted-triangle-in-rect-b9"],
  ["book-09", 1, "practice", 1, [21], "tilted-parallelogram-in-rect-b9"],
  ["book-09", 1, "practice", 1, [22], "tilted-pentagon-in-rect-b9"],
  ["book-09", 1, "advanced", 1, [5], "tilted-quad-in-rect-b9"],
  ["book-09", 1, "advanced", 1, [6], "tilted-square-frame-b9"],
  // 2단원 — 입체 → 위 모양의 수·앞·옆·최소 개수, 4×4 네 층, 왼쪽 옆
  ["book-09", 2, "activity", 1, [4, 5], "cube-solid-top-numbers-b9"],
  ["book-09", 2, "practice", 1, [5], "cube-solid-top-numbers-b9"],
  ["book-09", 2, "check", 1, [5], "cube-four-layer-views-b9"],
  ["book-09", 2, "practice", 1, [10], "cube-four-layer-views-b9"],
  ["book-09", 2, "activity", 2, [2], "cube-left-view-count-b9"],
  ["book-09", 2, "practice", 1, [12], "cube-left-view-count-b9"],
  ["book-09", 2, "check", 2, [5], "cube-left-view-minmax-b9"],
  ["book-09", 2, "practice", 1, [14], "cube-left-view-minmax-b9"],
  ["book-09", 2, "advanced", 1, [2], "cube-left-view-minmax-b9"],
  // 3단원 — 단서만 있는 3×3 마방진, 4×4 두 줄 비교, 삼각진
  ["book-09", 3, "activity", 1, [1, 2, 3], "magic-three-givens-b9"],
  ["book-09", 3, "practice", 1, [1], "magic-three-givens-b9"],
  ["book-09", 3, "activity", 1, [4], "magic-four-cross-clue-b9"],
  ["book-09", 3, "practice", 1, [2, 3], "magic-four-cross-clue-b9"],
  ["book-09", 3, "activity", 2, [1], "triangle-six-min-max-b9"],
  ["book-09", 3, "practice", 1, [8], "triangle-six-min-max-b9"],
  ["book-09", 3, "activity", 2, [2], "triangle-six-two-sums-b9"],
  ["book-09", 3, "practice", 1, [9], "triangle-six-two-sums-b9"],
  ["book-09", 3, "activity", 2, [3, 4], "triangle-nine-all-ways-b9"],
  ["book-09", 3, "practice", 1, [10, 11], "triangle-nine-all-ways-b9"],
  // 4단원 — 섞인 방향의 차, 값 목록 + 섞인 조건, 둥근 탁자, 15·16번 뒤바뀜(15번 탁자 · 16번 아파트)
  ["book-09", 4, "activity", 1, [3, 4], "mixed-direction-gap-b9"],
  ["book-09", 4, "practice", 1, [3, 4], "mixed-direction-gap-b9"],
  ["book-09", 4, "advanced", 1, [1], "mixed-direction-gap-b9"],
  ["book-09", 4, "activity", 1, [5, 6], "value-list-mixed-clues-b9"],
  ["book-09", 4, "practice", 1, [5, 6], "value-list-mixed-clues-b9"],
  ["book-09", 4, "activity", 2, [1], "round-table-five-b9"],
  ["book-09", 4, "practice", 1, [14], "round-table-five-b9"],
  ["book-09", 4, "practice", 1, [13, 15], "round-table-six-b9"],
  ["book-09", 4, "advanced", 1, [4], "round-table-six-b9"],
  ["book-09", 4, "practice", 1, [16], "apartment-neighbor-logic-b9"],
  // (2차) 1단원 — 나누어 그리기
  ["book-09", 1, "activity", 1, [6, 7], "partition-two-ways-b9"],
  ["book-09", 1, "check", 1, [1], "rep-tile-four-b9"],
  ["book-09", 1, "advanced", 1, [3], "rep-tile-four-star-b9"],
  ["book-09", 1, "practice", 1, [8], "partition-other-way-b9"],
  ["book-09", 1, "advanced", 1, [4], "cover-with-piece-star-b9"],
  ["book-09", 1, "advanced", 1, [2], "two-square-fences-b9"],
  // (2차) 2단원 — 모두 고르기, 정육면체 만들기, 검은색 최소
  ["book-09", 2, "practice", 1, [6], "cube-view-model-all-b9"],
  ["book-09", 2, "advanced", 1, [3], "cube-views-fill-cube-b9"],
  ["book-09", 2, "advanced", 1, [4], "cube-checker-min-black-b9"],
  // (2차) 3단원 — 도전 1~5, 연습 6·15
  ["book-09", 3, "advanced", 1, [1], "chain-circles-ways-b9"],
  ["book-09", 3, "advanced", 1, [2], "wheel-line-ring-b9"],
  ["book-09", 3, "advanced", 1, [3], "cross-grid-sum-extreme-b9"],
  ["book-09", 3, "advanced", 1, [4], "rings-target-sum-b9"],
  ["book-09", 3, "advanced", 1, [5], "triangle-seven-fill-b9"],
  ["book-09", 3, "practice", 1, [6], "wheel-centers-all-b9"],
  ["book-09", 3, "practice", 1, [15], "bent-path-equal-sum-b9"],
  // (2차) 4단원 — 말로 된 단서
  ["book-09", 4, "check", 1, [3], "race-talk-order-b9"],
  ["book-09", 4, "activity", 2, [2], "sibling-seat-order-b9"],
  ["book-09", 4, "activity", 2, [3], "desk-exclusion-if-b9"],
  ["book-09", 4, "practice", 1, [17], "job-relation-clues-b9"]
];
