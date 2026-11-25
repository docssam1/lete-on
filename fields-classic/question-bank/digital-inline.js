// 글 속 디지털 숫자(원장 2026-11-23 「디지털수인데 왜 그냥 아라비아 수를 써」) — 개념 꾸러미 글에 「[[d:25]]」라고 쓰면
// 일곱 막대 디지털 숫자 그림(인라인 SVG)으로 바꾼다. 원본 교재도 디지털 숫자는 글 속에서도 늘 막대 숫자로 그린다.
//   [[d:25]]    그대로          [[d:25|m]]  거울에 비친 모양(차례가 거꾸로 + 막대 좌우 뒤집기)
//   [[d:6|h]]   반 바퀴 돌린 모양  [[d:10:25]] 시각(가운데 두 점)
// 색은 둘레 글자색(currentColor)을 따른다 — 보기 단추가 맞음/틀림으로 색이 바뀌면 숫자도 같이 바뀐다.
const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
const W = 14, H = 24, GAP = 5, COLON = 7, PAD = 2;
const BAR = { a: [3, 0, W - 3, 0], b: [W - 1, 2, W - 1, H / 2 - 1.5], c: [W - 1, H / 2 + 1.5, W - 1, H - 2], d: [3, H, W - 3, H], e: [1, H / 2 + 1.5, 1, H - 2], f: [1, 2, 1, H / 2 - 1.5], g: [3, H / 2, W - 3, H / 2] };

export function digitalSvg(value, { mirror = false, half = false, label = "" } = {}) {
  const chars = [...String(value)];
  const order = mirror ? [...chars].reverse() : chars;
  let x = PAD, body = "";
  for (const ch of order) {
    if (ch === ":") { body += `<circle cx="${x + COLON / 2 - 1}" cy="${H * 0.3}" r="1.7"/><circle cx="${x + COLON / 2 - 1}" cy="${H * 0.7}" r="1.7"/>`; x += COLON; continue; }
    body += [...(SEG[ch] || "")].map((k) => {
      let [x1, y1, x2, y2] = BAR[k];
      if (ch === "1") { x1 = W / 2; x2 = W / 2; }   // 1은 칸 가운데에 선다(교재 약속)
      if (mirror) { x1 = W - x1; x2 = W - x2; }
      return `<line x1="${x + x1}" y1="${y1}" x2="${x + x2}" y2="${y2}"/>`;
    }).join("");
    x += W + GAP;
  }
  const width = x - GAP + PAD, height = H;
  const inner = half ? `<g transform="rotate(180 ${width / 2} ${height / 2})">${body}</g>` : body;
  const name = label || `디지털 숫자 ${value}${mirror ? "을 거울에 비춘 모양" : half ? "을 반 바퀴 돌린 모양" : ""}`;
  return `<svg class="dg-inline" viewBox="0 -2 ${width} ${height + 4}" role="img" aria-label="${name}" style="height:1.3em;width:auto;vertical-align:-0.3em;margin:0 .08em;overflow:visible"><g fill="currentColor" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">${inner}</g></svg>`;
}

// 글 속 [[d:…]]를 모두 그림으로
export const digitalText = (html) => String(html ?? "").replace(/\[\[d:([0-9:]+)(?:\|([mh]))?\]\]/g, (_, value, how) => digitalSvg(value, { mirror: how === "m", half: how === "h" }));
// 소리·검색용 — 그림 대신 숫자 글로(거울·반 바퀴 표시는 뺀다)
export const digitalPlain = (s) => String(s ?? "").replace(/\[\[d:([0-9:]+)(?:\|[mh])?\]\]/g, "$1");
