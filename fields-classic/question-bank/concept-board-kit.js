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
