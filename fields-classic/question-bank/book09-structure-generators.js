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
  roundTableSixB9: retry((o) => roundTableMixed({ ...o, size: 6 }))
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
  row("round-table-six-b9", "logic", "자리 배치", "여섯 명의 둥근 탁자 자리 정하기(마주 봄·한 사람 건너)", "roundTableSixB9", ["둥근 탁자", "마주 보기", "한 사람 건너"])
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
  "round-table-six-b9": "마주 보는 두 사람이나 한 사람을 건너 앉은 두 사람을 먼저 놓고 나머지 조건에 맞게 채웁니다."
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
  ["book-09", 4, "practice", 1, [16], "apartment-neighbor-logic-b9"]
];
