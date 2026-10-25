// 손글씨 판서 대본들이 함께 쓰는 도구. 권별 대본 파일(concept-boards-bNN.js)과 concept-boards.js가 여기서 가져온다
// (concept-boards.js를 서로 가져오면 순환 import에서 상수가 아직 없는 때가 생긴다).

// 숫자 뒤 조사: 우리말로 읽은 마지막 소리에 받침이 있으면 앞 것, 없으면 뒤 것. ㄹ 받침(1·7·8)은 「로」.
// jo(5, "을") → "5를", jo(9, "이에요") → "9예요", jo(10, "과") → "10과"
const BATCHIM = { 0: "ㅇ", 1: "ㄹ", 2: "", 3: "ㅁ", 4: "", 5: "", 6: "ㄱ", 7: "ㄹ", 8: "ㄹ", 9: "" };
const PAIRS = { "이": ["이", "가"], "가": ["이", "가"], "을": ["을", "를"], "를": ["을", "를"], "은": ["은", "는"], "는": ["은", "는"], "과": ["과", "와"], "와": ["과", "와"], "이에요": ["이에요", "예요"], "예요": ["이에요", "예요"], "으로": ["으로", "로"], "로": ["으로", "로"], "이라": ["이라", "라"], "라": ["이라", "라"], "이고": ["이고", "이고"], "이니까": ["이니까", "이니까"], "도": ["도", "도"], "니까": ["이니까", "니까"], "이면": ["이면", "이면"], "인데": ["인데", "인데"], "인": ["인", "인"] };
export function jo(value, particle) {
  const t = String(value), last = t.match(/(\d+)\s*$/);
  let fin;
  if (last) { const n = Number(last[1]); fin = n % 10 ? BATCHIM[n % 10] : n % 100 ? "ㅂ" : n % 1000 ? "ㄱ" : "ㄴ"; }   // 십·백·천
  else { const c = t.charCodeAt(t.length - 1); fin = c >= 0xAC00 && c <= 0xD7A3 ? ((c - 0xAC00) % 28 ? "x" : "") : ""; }
  const [withB, without] = PAIRS[particle];
  if (withB === "으로") return t + (fin && fin !== "ㄹ" ? "으로" : "로");
  return t + (fin ? withB : without);
}

// 시계·모눈·디지털 숫자 규칙 — 여러 권의 판서가 함께 쓴다(concept-boards.js가 그대로 다시 내보낸다)
// 시계: 숫자 start에서 quarters(반의 반 바퀴 단위, 시계 방향 +)만큼 돌린 자리
export const landing = (start, quarters) => ((start - 1 + quarters * 3) % 12 + 12) % 12 + 1;
// 모눈: 칸 [줄, 칸]을 거울·돌리기로 옮긴 자리(rows×cols)
export const mirrorLR = (cells, cols) => cells.map(([r, c]) => [r, cols - 1 - c]);
export const mirrorTB = (cells, rows) => cells.map(([r, c]) => [rows - 1 - r, c]);
export const turnHalf = (cells, rows, cols) => cells.map(([r, c]) => [rows - 1 - r, cols - 1 - c]);

// 디지털 숫자(막대 일곱 개). 이름은 game-digital.js와 같다: a 위 · b 오른쪽 위 · c 오른쪽 아래 · d 아래 · e 왼쪽 아래 · f 왼쪽 위 · g 가운데
export const DIGIT_SEGMENTS = Object.freeze({ 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" });
export const SEGMENT_MAPS = Object.freeze({
  "mirror-left-right": { a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" },
  "mirror-top-bottom": { a: "d", b: "c", c: "b", d: "a", e: "f", f: "e", g: "g" },
  "rotate-half": { a: "d", b: "e", c: "f", d: "a", e: "b", f: "c", g: "g" }
});
export const moveSegs = (on, op) => [...on].map((s) => SEGMENT_MAPS[op][s]).sort().join("");
// 옮긴 막대가 어떤 숫자인지(숫자가 아니면 null) — 확인 문제의 정답은 이걸로 계산한다
export const readDigit = (on) => { const key = [...on].sort().join(""); const hit = Object.entries(DIGIT_SEGMENTS).find(([, v]) => v === key); return hit ? Number(hit[0]) : null; };
export const transformDigit = (d, op) => readDigit(moveSegs(DIGIT_SEGMENTS[d], op));
// 막대 하나의 양 끝 좌표. 숫자 상자 (x, y) 왼쪽 위, 높이 h, 폭 h×0.55. 끝을 조금 띄워 막대가 서로 닿지 않게 한다.
export function segGeom(x, y, h, seg) {
  const w = h * 0.55, t = h * 0.07, mid = y + h / 2;
  return {
    a: [x + t, y, x + w - t, y], d: [x + t, y + h, x + w - t, y + h], g: [x + t, mid, x + w - t, mid],
    b: [x + w, y + t, x + w, mid - t], c: [x + w, mid + t, x + w, y + h - t], e: [x, mid + t, x, y + h - t], f: [x, y + t, x, mid - t]
  }[seg];
}
export const segMid = (x, y, h, seg) => { const [x1, y1, x2, y2] = segGeom(x, y, h, seg); return [(x1 + x2) / 2, (y1 + y2) / 2]; };

// 세로셈 복면산 그림(3권·8권): rows는 더하는 수들(왼쪽→오른쪽 글자 배열), sum은 결과. 오른쪽 끝을 맞춘다.
const kitText = (x, y, text, color, size, align) => ({ kind: "text", x, y, text, size, color, align });
export const SHAPE_OF = { "□": "square", "△": "triangle", "◇": "diamond", "○": "circle", "☆": "star" };
export function crypt(right, top, rows, sum, cell = 84) {
  const y = (i) => top + i * cell, x = (k) => right - (k + 0.5) * cell;        // k = 오른쪽에서 몇째 자리(0 = 일의 자리)
  const glyph = (ch, k, i, color = "ink") => SHAPE_OF[ch] ? { kind: "shape", type: SHAPE_OF[ch], cx: x(k), cy: y(i) + cell / 2, r: Math.round(cell * 0.4), color, width: 3 }
    : kitText(x(k), y(i) + cell / 2 + cell * 0.22, ch, color, Math.round(cell * 0.62), "center");
  const width = Math.max(...rows.map((r) => r.length), sum.length);
  const items = [];
  rows.forEach((r, i) => [...r].reverse().forEach((ch, k) => items.push(glyph(ch, k, i))));
  items.push(kitText(right - (width + 0.7) * cell, y(rows.length - 1) + cell / 2 + cell * 0.22, "+", "ink", Math.round(cell * 0.62), "center"));
  const lineY = y(rows.length) + 4;
  items.push({ kind: "line", x1: right - (width + 1.1) * cell, y1: lineY, x2: right + 6, y2: lineY, color: "ink", width: 3 });
  [...sum].reverse().forEach((ch, k) => items.push(glyph(ch, k, rows.length + 0.15)));
  return {
    items,
    // 도형 칸 안에 수 쓰기(row = 더하는 수 번호, rows.length = 결과 줄)
    val: (row, k, v, color = "green") => kitText(x(k), y(row === rows.length ? row + 0.15 : row) + cell / 2 + cell * 0.16, String(v), color, Math.round(cell * 0.42), "center"),
    carry: (k, v = 1) => kitText(x(k), top - 8, String(v), "red", 32, "center"),
    col: (k) => ({ kind: "box", x: x(k) - cell / 2 + 4, y: top - 4, w: cell - 8, h: (rows.length + 1.15) * cell + 6, color: "gold", dash: true })
  };
}

// 신발끈 공식(3권·9권): 꼭짓점 목록(모눈 칸 단위)의 넓이 — 판서의 답을 그림에서 직접 계산해 맞춘다
export const polyArea = (pts) => Math.abs(pts.reduce((a, [x1, y1], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return a + x1 * y2 - x2 * y1; }, 0)) / 2;

// 쌓기나무 그림(등각, 4권·9권): map[y][x] = 그 자리의 층수. 뒤에서 앞으로, 아래에서 위로 그려 앞의 것이 덮게 한다.
export const iso = (ox, oy, w = 30, h = 17, H = 34) => {
  const P = (x, y, z) => [ox + (x - y) * w, oy + (x + y) * h - z * H];
  const face = (pts, fill) => ({ kind: "path", d: `M ${pts.map(([a, b, c]) => P(a, b, c).map((v) => v.toFixed(1)).join(" ")).join(" L ")} Z`, stroke: "ink", width: 1.8, fill, quick: true });
  const cube = (x, y, z, tone = ["#f3ead2", "#d8c9a3", "#bfae86"]) => [
    face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], tone[0]),
    face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], tone[2]),
    face([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], tone[1])];
  const stack = (map, tone) => { const out = [], cells = [];
    map.forEach((row, y) => row.forEach((n, x) => { for (let z = 0; z < n; z++) cells.push([x, y, z]); }));
    cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]);
    for (const [x, y, z] of cells) out.push(...cube(x, y, z, tone)); return out; };
  const topLabel = (x, y, z, v, color = "red") => { const [cx, cy] = P(x + 0.5, y + 0.5, z); return kitText(cx, cy + 10, String(v), color, Math.round(w * 0.8), "center"); };
  return { P, cube, stack, topLabel };
};
export const topGrid = (x0, y0, map, cell = 46, color = "blue") => [{ kind: "grid", x: x0, y: y0, cols: map[0].length, rows: map.length, cell, color: "ink" },
  ...map.flatMap((row, r) => row.map((n, c) => kitText(x0 + (c + 0.5) * cell, y0 + (r + 0.5) * cell + 10, String(n), n ? color : "gray", 28, "center")))];
export const sum2 = (map) => map.flat().reduce((a, b) => a + b, 0);
