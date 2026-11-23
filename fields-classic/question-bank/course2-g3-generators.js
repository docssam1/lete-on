// 2과정 G3 「정육면체와 각·넓이」 교재 유사문제 생성기. 약속은 G1·G2 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 그림을 만든 수에서 계산하고, 세는 문제는 하나씩 세어 본다(주사위는 굴려 보고, 전개도는 접어 본다).
import { plainText } from "./course2-plain.js?v=20261122zi";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const shuffle = (items) => { const out = [...items]; for (let i = out.length - 1; i > 0; i -= 1) { const j = randomInt(0, i); [out[i], out[j]] = [out[j], out[i]]; } return out; };
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", YELLOW = "#fff1bf", BLUE = "#2f5fb3";
const R = Math.PI / 180;
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const dirOf = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);

function problem({ prompt, subtype, html, answer, solution, family, meta = {} }) {
  return { prompt, visual: { kind: "c2", subtype, html }, answer: String(answer), solution, meta: { family, answer, ...meta } };
}
const svg = (w, h, body, label = "그림") => `<svg class="c2-fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 15, anchor = "middle", color = INK, weight = 500 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
const line = (a, b, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (points, { fill = "none", color = INK, width = 2 } = {}) =>
  `<polygon points="${points.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`;
const rect = (x, y, w, h, { fill = "none", color = INK, width = 2 } = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
const circle = (c, r, { fill = "none", color = INK, width = 2 } = {}) => `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(r)}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
const dot = (p, r = 3.2, color = INK) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${r}" fill="${color}"/>`;
function angleMark(v, a1, a2, r, label, { color = MARK, size = 14, keep = false } = {}) {
  let span = a2 - a1;
  while (span <= 0) span += 360;
  if (span > 180 && !keep) { a1 = a2; span = 360 - span; }   // 보통은 작은 쪽 각, keep이면 a1 → a2 그대로(시계 방향 회전량 등)
  const p1 = at(v, r, a1), p2 = at(v, r, a1 + span), m = at(v, r + 15, a1 + span / 2);
  return `<path d="M ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.8"/>`
    + (label ? text(m.x, m.y, label, { size, color }) : "");
}
const rightMark = (v, a1, s = 10, color = INK) => { const p = at(v, s, a1), q = at(v, s, a1 + 90), c = at(p, s, a1 + 90); return `<path d="M ${f1(p.x)} ${f1(p.y)} L ${f1(c.x)} ${f1(c.y)} L ${f1(q.x)} ${f1(q.y)}" fill="none" stroke="${color}" stroke-width="1.6"/>`; };
const lenLabel = (a, b, value, { offset = 14, color = INK, size = 13 } = {}) => { const m = mid(a, b), p = at(m, offset, dirOf(a, b) + 90); return text(p.x, p.y, value, { size, color }); };

// ── 디지털 숫자(1은 가운데에 선다) ──
const SEG = { 0: "abcdef", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
function digit(d, x, y, { w = 26, h = 46, width = 4.5, color = INK } = {}) {
  const s = (a, b, c, e) => line(P(x + a, y + b), P(x + c, y + e), { color, width });
  if (String(d) === "1") return s(w / 2, 3, w / 2, h / 2 - 2) + s(w / 2, h / 2 + 2, w / 2, h - 3);
  const parts = { a: [4, 0, w - 4, 0], b: [w - 2, 3, w - 2, h / 2 - 2], c: [w - 2, h / 2 + 2, w - 2, h - 3], d: [4, h, w - 4, h], e: [2, h / 2 + 2, 2, h - 3], f: [2, 3, 2, h / 2 - 2], g: [4, h / 2, w - 4, h / 2] };
  return [...(SEG[d] || "")].map((k) => s(...parts[k])).join("");
}
const digitsRow = (str, x, y) => [...String(str)].map((c, i) => digit(c, x + i * 36, y)).join("");

// ════ 1단원 도형 움직이기 ════
// 1. 거울에 비추거나 반 바퀴 돌려도 같은 디지털 수 — 하나씩 만들어 보고 센다
const MIRROR = { 0: "0", 1: "1", 2: "5", 5: "2", 8: "8" };
const HALF = { 0: "0", 1: "1", 2: "2", 5: "5", 6: "9", 8: "8", 9: "6" };
const transformed = (n, map, reverse = true) => {
  const s = String(n);
  if ([...s].some((c) => !(c in map))) return null;
  const t = [...s].map((c) => map[c]);
  return (reverse ? t.reverse() : t).join("");
};
function c2SymmetricNumberCount({ difficulty = 2 }) {
  const mode = sample(["mirror", "half"]);
  const n = difficulty <= 1 ? 3 : sample([3, 4, 5]);
  const map = mode === "mirror" ? MIRROR : HALF;
  const list = [];
  for (let v = 10 ** (n - 1); v < 10 ** n; v += 1) if (transformed(v, map) === String(v)) list.push(v);
  const kind = difficulty >= 3 ? sample(["count", "largest", "second"]) : "count";
  const example = sample(list);
  const how = mode === "mirror" ? "오른쪽 거울에 비추면" : "반 바퀴(180°) 돌리면";
  const body = digitsRow(example, 20, 24) + (mode === "mirror" ? line(P(20 + n * 36 + 6, 12), P(20 + n * 36 + 6, 84), { color: BLUE, width: 3, dash: "6 5" }) : text(20 + n * 36 + 24, 48, "↻", { size: 26, color: GREEN }));
  const html = svg(n * 36 + 60, 96, body, `디지털 수 ${example}`);
  const rule = mode === "mirror" ? "거울에 비추면 숫자 차례가 거꾸로 되고, 0·1·8은 그대로, 2와 5는 서로 바뀝니다(나머지 숫자는 숫자가 되지 않습니다)" : "반 바퀴 돌리면 숫자 차례가 거꾸로 되고, 0·1·2·5·8은 그대로, 6과 9는 서로 바뀝니다";
  const pairs = mode === "mirror" ? "앞뒤 짝은 (1,1)·(2,5)·(5,2)·(8,8)·(0,0), 가운데 자리는 0·1·8" : "앞뒤 짝은 (1,1)·(2,2)·(5,5)·(6,9)·(8,8)·(9,6)·(0,0), 가운데 자리는 0·1·2·5·8";
  if (kind === "count") return problem({
    prompt: `그림의 디지털 숫자로 쓴 수는 ${how} 처음과 똑같은 수가 됩니다. 이처럼 ${how} 처음 수와 똑같아지는 ${n}자리 수는 모두 몇 개인가요?`,
    subtype: "symmetric-number", html, answer: `${list.length}개`,
    solution: `${rule}. 그래서 맨 앞과 맨 뒤, 둘째와 끝에서 둘째 자리가 짝을 이뤄야 합니다: ${pairs}. 맨 앞자리는 0이 될 수 없습니다. 모두 세면 ${list.length}개입니다${list.length <= 12 ? ` (${list.join(", ")})` : ""}.`,
    family: `symmetric-${mode}-count`, meta: { n }
  });
  const sorted = [...list].sort((a, b) => b - a);
  const pick = kind === "largest" ? sorted[0] : sorted[1];
  return problem({
    prompt: `그림의 디지털 숫자로 쓴 수는 ${how} 처음과 똑같은 수가 됩니다. 이처럼 ${how} 똑같아지는 ${n}자리 수 중에서 ${kind === "largest" ? "가장 큰" : "두 번째로 큰"} 수는 무엇인가요?`,
    subtype: "symmetric-number", html, answer: `${pick}`,
    solution: `${rule}. ${pairs}. 큰 수부터 찾으면 ${sorted.slice(0, 3).join(", ")} …이므로 답은 ${pick}입니다.`,
    family: `symmetric-${mode}-${kind}`, meta: { n }
  });
}

// ════ 2단원 주사위와 쌓기나무 ════
// 주사위 상태: [위, 아래, 앞, 뒤, 오른쪽, 왼쪽]. 마주 보는 면의 합은 7(또는 9)
const rollDie = (s, dir) => {
  const [t, b, f, k, r, l] = s;
  if (dir === "R") return [l, r, f, k, t, b];   // 오른쪽으로 굴리면 위가 오른쪽으로 간다
  if (dir === "L") return [r, l, f, k, b, t];
  if (dir === "F") return [k, f, t, b, r, l];   // 앞(아래쪽 화면)으로 굴리면 위가 앞으로
  return [f, k, b, t, r, l];                   // 뒤로
};
// 정육면체 한 개(빗각 투영)
function cubeAt(x, y, s, { top = "", front = "", right = "", fill = "#fff" } = {}) {
  const d = s * 0.42;
  const F = [P(x, y + d), P(x + s, y + d), P(x + s, y + d + s), P(x, y + d + s)];
  const T = [P(x, y + d), P(x + d, y), P(x + s + d, y), P(x + s, y + d)];
  const Rt = [P(x + s, y + d), P(x + s + d, y), P(x + s + d, y + s), P(x + s, y + d + s)];
  return poly(F, { fill }) + poly(T, { fill: SOFT }) + poly(Rt, { fill: "#d6e2da" })
    + (top !== "" ? text(x + s / 2 + d / 2, y + d / 2, String(top), { size: 14, weight: 700 }) : "")
    + (front !== "" ? text(x + s / 2, y + d + s / 2, String(front), { size: 16, weight: 700 }) : "")
    + (right !== "" ? text(x + s + d / 2, y + d / 2 + s / 2, String(right), { size: 13, weight: 700 }) : "");
}
function c2DiceHiddenSum({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "tower" : sample(["tower", "visible", "row"]);
  const k = difficulty <= 1 ? sample([2, 3]) : randomInt(3, 5);
  const top = randomInt(1, 6);
  const s = 44;
  if (kind === "row") {
    // 바닥에 한 줄로 붙인 주사위: 맞닿은 면 + 바닥면이 안 보인다. 맞닿은 두 면은 같은 주사위의 왼쪽·오른쪽 → 7씩
    const bottoms = Array.from({ length: k }, () => randomInt(1, 6));
    let body = "";
    for (let i = 0; i < k; i += 1) body += cubeAt(20 + i * s, 30, s, { top: 7 - bottoms[i] });
    const hiddenSides = 7 * (k - 1) - 0;   // 맞닿은 면: 첫 주사위 오른쪽 + 둘째 왼쪽 … — 가운데 주사위는 양옆 모두 가려짐
    // 가려진 옆면: 첫 주사위 오른쪽, 끝 주사위 왼쪽, 가운데 주사위 왼·오른쪽 → 가운데 (k−2)개 × 7 + 끝 두 개의 한 면씩
    // 맨 왼쪽 주사위의 오른쪽 면은 그 주사위의 윗면·바닥면이 될 수 없다(맨 오른쪽 주사위의 왼쪽 면도 마찬가지)
    const sideOf = (bottom) => sample([1, 2, 3, 4, 5, 6].filter((v) => v !== bottom && v !== 7 - bottom));
    const endR = sideOf(bottoms[0]), endL = sideOf(bottoms[k - 1]);
    const hidden = bottoms.reduce((t, v) => t + v, 0) + 7 * (k - 2) + endR + endL;
    void hiddenSides;
    const html = svg(k * s + 60, s * 1.6 + 50, body, `한 줄로 붙인 주사위 ${k}개`);
    return problem({
      prompt: `마주 보는 면의 눈의 합이 7인 주사위 ${k}개를 바닥에 한 줄로 붙여 놓았습니다. 윗면의 눈은 그림과 같고, 맨 왼쪽 주사위의 오른쪽 면은 ${endR}, 맨 오른쪽 주사위의 왼쪽 면은 ${endL}입니다. 바닥면과 맞닿은 면을 모두 합해 보이지 않는 면의 눈의 합은 얼마인가요?`,
      subtype: "dice-hidden", html, answer: `${hidden}`,
      solution: `바닥면은 윗면과 마주 보므로 7 − 윗면입니다: ${bottoms.join(", ")} → 합 ${bottoms.reduce((t, v) => t + v, 0)}. 가운데 주사위 ${k - 2}개는 왼쪽·오른쪽 면이 모두 가려지는데 둘은 마주 보는 면이라 7씩, ${7 * (k - 2)}입니다. 양 끝 주사위는 한 면씩 ${endR} + ${endL}. 모두 더하면 ${hidden}입니다.`,
      family: "dice-row-hidden", meta: { k }
    });
  }
  let body = "";
  for (let i = 0; i < k; i += 1) body += cubeAt(40, 20 + (k - 1 - i) * s, s, { top: i === k - 1 ? top : "" });
  const html = svg(s * 1.6 + 80, k * s + s * 0.5 + 30, body, `세로로 쌓은 주사위 ${k}개`);
  const hidden = 7 * k - top;
  if (kind === "tower") return problem({
    prompt: `마주 보는 면의 눈의 합이 7인 주사위 ${k}개를 바닥 위에 세로로 쌓았습니다. 맨 위 주사위의 윗면이 ${top}일 때, 바닥면을 포함하여 겹쳐서 보이지 않는 면의 눈을 모두 더하면 얼마인가요?`,
    subtype: "dice-hidden", html, answer: `${hidden}`,
    solution: `주사위마다 아랫면과 윗면은 마주 보는 면이라 합이 7입니다. 보이지 않는 면은 모든 주사위의 아랫면과 윗면에서 맨 위의 윗면 하나만 뺀 것이므로 7 × ${k} − ${top} = ${hidden}입니다.`,
    family: "dice-tower-hidden", meta: { k, top }
  });
  // 보이는 옆면의 합: 주사위마다 옆 네 면 = 21 − 7 = 14, 맨 위 윗면 더함(바닥은 안 보임)
  const visible = 14 * k + top;
  return problem({
    prompt: `마주 보는 면의 눈의 합이 7인 주사위 ${k}개를 바닥 위에 세로로 쌓았습니다. 맨 위 주사위의 윗면이 ${top}일 때, 바깥에서 보이는 면(옆면 모두와 맨 위 윗면)의 눈을 모두 더하면 얼마인가요?`,
    subtype: "dice-hidden", html, answer: `${visible}`,
    solution: `한 주사위의 눈을 모두 더하면 1 + 2 + … + 6 = 21이고, 윗면과 아랫면의 합이 7이므로 옆 네 면의 합은 14입니다. 옆면 ${k}개 주사위 × 14 = ${14 * k}에 맨 위 윗면 ${top}을 더하면 ${visible}입니다.`,
    family: "dice-tower-visible", meta: { k, top }
  });
}
function c2DiceRoll({ difficulty = 2 }) {
  const len = difficulty <= 1 ? randomInt(2, 3) : randomInt(3, 6);
  const start = sample([[1, 6, 2, 5, 3, 4], [1, 6, 3, 4, 5, 2], [2, 5, 1, 6, 4, 3], [3, 4, 2, 5, 6, 1], [5, 2, 1, 6, 3, 4]]);
  const moves = Array.from({ length: len }, () => sample(["R", "F"]));
  let s = start;
  moves.forEach((m) => { s = rollDie(s, m); });
  const k = 40;
  // 길: 오른쪽(R)·아래(F)로 칸을 잇는다
  let cx = 0, cy = 0; const cells = [[0, 0]];
  moves.forEach((m) => { if (m === "R") cx += 1; else cy += 1; cells.push([cx, cy]); });
  const o = P(30, 30);
  let body = cells.map(([x, y], i) => rect(o.x + x * k, o.y + y * k, k, k, { fill: i === 0 ? YELLOW : i === cells.length - 1 ? "#fbe3df" : "#fff" })).join("");
  for (let i = 0; i < cells.length - 1; i += 1) {
    const a = P(o.x + (cells[i][0] + 0.5) * k, o.y + (cells[i][1] + 0.5) * k), b = P(o.x + (cells[i + 1][0] + 0.5) * k, o.y + (cells[i + 1][1] + 0.5) * k);
    body += line(a, b, { color: GREEN, width: 2, dash: "4 3" });
  }
  body += text(o.x + k / 2, o.y + k / 2, String(start[0]), { size: 16, weight: 700 }) + text(o.x + (cx + 0.5) * k, o.y + (cy + 0.5) * k, "?", { size: 18, color: MARK, weight: 700 });
  const W = Math.max(...cells.map((c) => c[0])) + 1, H = Math.max(...cells.map((c) => c[1])) + 1;
  const html = svg(W * k + 60, H * k + 60, body, "주사위를 굴리는 길");
  const names = { R: "오른쪽", F: "아래쪽" };
  return problem({
    prompt: `마주 보는 면의 눈의 합이 7인 주사위를 색칠한 칸에 놓았습니다. 윗면은 ${start[0]}, 아래쪽(화면 아래)을 향한 면은 ${start[2]}, 오른쪽을 향한 면은 ${start[4]}입니다. 점선을 따라 한 칸씩 굴려 ? 칸에 왔을 때 윗면의 눈은 얼마인가요?`,
    subtype: "dice-roll", html, answer: `${s[0]}`,
    solution: `오른쪽으로 굴리면 왼쪽 면이 위로, 아래쪽으로 굴리면 뒤쪽 면(위쪽을 향한 면)이 위로 올라옵니다. 마주 보는 면은 합이 7이므로 처음에 아래 ${start[1]}, 뒤 ${start[3]}, 왼쪽 ${start[5]}입니다. ${moves.map((m) => names[m]).join(" → ")}로 굴리면 윗면은 차례로 ${(() => { let t = start; return moves.map((m) => (t = rollDie(t, m))[0]).join(" → "); })()}이 됩니다. 답은 ${s[0]}입니다.`,
    family: "dice-roll", meta: { moves: moves.join("") }
  });
}
// 정육면체 전개도(칸 좌표) — 굴려 접어 마주 보는 면을 찾는다
const NETS = [
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
  [[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 2]]
];
function foldNet(cells) {
  // 정육면체를 전개도 위에서 칸에서 칸으로 굴린다. 정육면체의 면 6개에 번호(0~5)를 붙여 두고,
  // 어느 칸에 놓일 때 바닥에 닿는 면이 그 칸이 된다. 처음 자리에서 마주 보는 면은 (0,1)·(2,3)·(4,5).
  const index = new Map(cells.map(([x, y], i) => [`${x},${y}`, i]));
  const label = new Array(6).fill(null);   // 정육면체 면 번호 → 칸 번호
  const seen = new Set();
  const visit = (i, st) => {
    seen.add(i); label[st[1]] = i;
    const [x, y] = cells[i];
    for (const [dx, dy, dir] of [[1, 0, "R"], [-1, 0, "L"], [0, 1, "F"], [0, -1, "B"]]) {
      const j = index.get(`${x + dx},${y + dy}`);
      if (j !== undefined && !seen.has(j)) visit(j, rollDie(st, dir));
    }
  };
  visit(0, [0, 1, 2, 3, 4, 5]);
  return label;   // [위, 아래, 앞, 뒤, 오른쪽, 왼쪽] 처음 자리의 면에 붙은 칸 — 짝 (0,1)(2,3)(4,5)가 마주 본다
}
const NET_LETTERS = ["가", "나", "다", "라", "마", "바"];
function c2CubeNetOpposite({ difficulty = 2 }) {
  const cells = sample(NETS);
  const st = foldNet(cells);
  if (st.some((v) => v === null)) return null;
  const opp = new Map([[st[0], st[1]], [st[1], st[0]], [st[2], st[3]], [st[3], st[2]], [st[4], st[5]], [st[5], st[4]]]);
  const kind = difficulty <= 1 ? "letter" : sample(["letter", "dice"]);
  const k = 46, o = P(20, 20);
  const W = Math.max(...cells.map((c) => c[0])) + 1, H = Math.max(...cells.map((c) => c[1])) + 1;
  if (kind === "letter") {
    const q = randomInt(0, 5);
    const body = cells.map(([x, y], i) => rect(o.x + x * k, o.y + y * k, k, k, { fill: i === q ? YELLOW : "#fff" }) + text(o.x + (x + 0.5) * k, o.y + (y + 0.5) * k, NET_LETTERS[i], { size: 17, weight: 700 })).join("");
    return problem({
      prompt: `전개도를 접어 정육면체를 만들었습니다. 면 「${NET_LETTERS[q]}」와 마주 보는 면은 무엇인가요?`,
      subtype: "cube-net", html: svg(W * k + 40, H * k + 40, body, "정육면체 전개도"), answer: NET_LETTERS[opp.get(q)],
      solution: `전개도에서 한 줄로 이어진 세 면 중 양 끝은 접으면 서로 마주 보고, 바로 붙은 두 면은 이웃합니다. 「${NET_LETTERS[q]}」를 바닥에 두고 나머지 면을 하나씩 세워 접어 보면 맨 위(마주 보는 자리)에 오는 면은 「${NET_LETTERS[opp.get(q)]}」입니다.`,
      family: "cube-net-letter", meta: { net: cells.length }
    });
  }
  // 주사위 전개도: 마주 보는 면의 합 7 — 빈칸 하나의 눈
  const faces = new Array(6).fill(0);
  const pairs = [[st[0], st[1]], [st[2], st[3]], [st[4], st[5]]];
  const vals = shuffle([[1, 6], [2, 5], [3, 4]]);
  pairs.forEach(([a, b], i) => { faces[a] = vals[i][0]; faces[b] = vals[i][1]; });
  const blank = randomInt(0, 5);
  const body = cells.map(([x, y], i) => rect(o.x + x * k, o.y + y * k, k, k, { fill: i === blank ? YELLOW : "#fff" }) + text(o.x + (x + 0.5) * k, o.y + (y + 0.5) * k, i === blank ? "?" : String(faces[i]), { size: 17, weight: 700, color: i === blank ? MARK : INK })).join("");
  return problem({
    prompt: `마주 보는 면의 눈의 합이 7이 되도록 주사위 전개도에 눈을 썼습니다. ? 칸에 알맞은 눈은 얼마인가요?`,
    subtype: "cube-net", html: svg(W * k + 40, H * k + 40, body, "주사위 전개도"), answer: `${faces[blank]}`,
    solution: `? 칸과 마주 보는 면을 찾으면(접었을 때 맨 위로 오는 면) ${faces[opp.get(blank)]}입니다. 합이 7이어야 하므로 7 − ${faces[opp.get(blank)]} = ${faces[blank]}입니다.`,
    family: "cube-net-dice", meta: {}
  });
}

// ════ 3단원 시계와 각 ════
// 2. 평행선과 각
function c2ParallelAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? sample(["alternate", "corresponding"]) : sample(["alternate", "interior", "bend", "bend"]);
  const a = randomInt(35, 75);
  const y1 = 50, y2 = 170;
  let body = line(P(20, y1), P(320, y1), { width: 2.4 }) + line(P(20, y2), P(320, y2), { width: 2.4 }) + text(330, y1, "가", { size: 13, anchor: "start" }) + text(330, y2, "나", { size: 13, anchor: "start" });
  body += `<path d="M 160 ${y1 - 6} l 8 6 l -8 6" fill="none" stroke="${GREEN}" stroke-width="2"/><path d="M 160 ${y2 - 6} l 8 6 l -8 6" fill="none" stroke="${GREEN}" stroke-width="2"/>`;
  let prompt, answer, solution;
  if (kind === "bend") {
    const b = randomInt(30, 70);
    const V = P(220, (y1 + y2) / 2 + randomInt(-15, 15));
    const A = P(V.x - (V.y - y1) / Math.tan(a * R), y1), B = P(V.x - (y2 - V.y) / Math.tan(b * R), y2);
    body += line(A, V, { width: 2.2 }) + line(B, V, { width: 2.2 });
    body += angleMark(A, 0, dirOf(A, V), 26, `${a}°`, { color: INK }) + angleMark(B, dirOf(B, V), 0, 26, `${b}°`, { color: INK }) + angleMark(V, dirOf(V, A), dirOf(V, B), 20, "?");
    prompt = `직선 가와 나는 서로 평행합니다. 꺾인 선이 두 평행선과 이루는 각이 ${a}°, ${b}°일 때, 꺾인 곳의 각 ?는 몇 도인가요?`;
    answer = a + b;
    solution = `꺾인 곳을 지나 가·나와 평행한 선을 하나 더 그으면 ?가 위아래 두 각으로 나뉩니다. 평행선에서 엇갈린 자리의 각(엇각)은 같으므로 위쪽은 ${a}°, 아래쪽은 ${b}°, ? = ${a} + ${b} = ${answer}°입니다.`;
  } else {
    const A = P(110, y1), B = P(110 + (y2 - y1) / Math.tan(a * R), y2);
    const ext1 = at(A, 40, dirOf(B, A)), ext2 = at(B, 40, dirOf(A, B));
    body += line(ext1, ext2, { width: 2.2 });
    body += angleMark(A, dirOf(A, B), 0, 24, `${a}°`, { color: INK });
    if (kind === "alternate") { body += angleMark(B, 180, dirOf(B, A), 24, "?"); answer = a; prompt = `직선 가와 나는 서로 평행합니다. 한 직선이 두 평행선과 만날 때 ${a}°인 각과 엇갈린 자리의 각 ?는 몇 도인가요?`; solution = `평행선과 한 직선이 만날 때 엇갈린 자리의 두 각(엇각)은 크기가 같습니다. ? = ${a}°입니다.`; }
    else if (kind === "corresponding") { body += angleMark(B, dirOf(B, ext2), 0, 24, "?"); answer = a; prompt = `직선 가와 나는 서로 평행합니다. 한 직선이 두 평행선과 만날 때 ${a}°인 각과 같은 자리의 각 ?는 몇 도인가요?`; solution = `평행선을 따라 위의 교차점을 아래로 그대로 옮기면 같은 자리의 각(동위각)이 겹칩니다. ? = ${a}°입니다.`; }
    else { body += angleMark(B, 0, dirOf(B, A), 24, "?"); answer = 180 - a; prompt = `직선 가와 나는 서로 평행합니다. 한 직선이 두 평행선과 만날 때, 두 평행선 사이 같은 쪽에 있는 각 ?는 몇 도인가요? (위쪽 각은 ${a}°)`; solution = `? 옆의 각은 ${a}°와 엇각이라 ${a}°이고, 둘은 일직선을 이루므로 ? = 180 − ${a} = ${answer}°입니다.`; }
  }
  return problem({ prompt, subtype: "parallel-angle", html: svg(350, 220, body, "평행선과 각"), answer: `${answer}°`, solution, family: `parallel-${kind}`, meta: { a } });
}
// 3. 숫자 없는 시계 — 짧은바늘의 자리로 시각 찾기
function analog(hour, minute, { numbers = false } = {}) {
  const c = P(100, 100), r = 82;
  let body = circle(c, r, { fill: "#fff", width: 2.6 });
  for (let i = 0; i < 60; i += 1) { const big = i % 5 === 0; body += line(at(c, r - (big ? 10 : 5), 90 - i * 6), at(c, r - 2, 90 - i * 6), { width: big ? 2.2 : 1, color: big ? INK : "#9aa39e" }); }
  if (numbers) for (let h = 1; h <= 12; h += 1) { const p = at(c, r - 22, 90 - h * 30); body += text(p.x, p.y, String(h), { size: 13 }); }
  body += line(c, at(c, r * 0.5, 90 - (30 * (hour % 12) + 0.5 * minute)), { width: 5 }) + line(c, at(c, r * 0.78, 90 - 6 * minute), { color: BLUE, width: 3 }) + dot(c, 4.5);
  return body;
}
function c2ClockFromAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "hourAngle" : sample(["hourAngle", "between"]);
  const hour = randomInt(1, 11);
  if (kind === "hourAngle") {
    const minute = difficulty <= 1 ? randomInt(1, 5) * 10 : randomInt(1, 59);
    const total = 30 * hour + minute / 2;
    let body = analog(hour, minute);
    body += line(P(100, 100), P(100, 22), { color: "#9aa39e", width: 1.4, dash: "4 4" }) + angleMark(P(100, 100), 90 - total, 90, 26, `${total}°`, { color: MARK, keep: true });
    return problem({
      prompt: `숫자가 쓰여 있지 않은 시계입니다(위쪽 점선이 12시 자리). 짧은바늘이 12시 자리에서 시계 방향으로 ${total}° 돌아간 곳에 있습니다. 지금은 몇 시 몇 분인가요?`,
      subtype: "clock-reverse", html: svg(200, 200, body, "숫자 없는 시계"), answer: `${hour}시 ${minute}분`,
      solution: `짧은바늘은 1시간에 30°씩 갑니다. ${total} ÷ 30 = ${hour} … ${total - 30 * hour}이므로 ${hour}시를 지나 ${total - 30 * hour}° 더 갔습니다. 1분에 0.5°씩이므로 ${total - 30 * hour} ÷ 0.5 = ${minute}분, ${hour}시 ${minute}분입니다.`,
      family: "clock-hour-angle", meta: { hour, minute }
    });
  }
  // 두 바늘이 이루는 각과 시(긴바늘이 짧은바늘보다 뒤/앞)로 분 찾기
  for (let tries = 0; tries < 60; tries += 1) {
    const minute = randomInt(1, 59);
    const diff = 5.5 * minute - 30 * hour;   // 긴바늘 − 짧은바늘(12에서 시계 방향으로 잰 각의 차)
    const ang = Math.abs(diff);
    if (ang === 0 || ang >= 180 || !Number.isInteger(ang * 2)) continue;
    const ahead = diff > 0;
    return problem({
      prompt: `${hour}시와 ${hour + 1}시 사이에 시계의 두 바늘이 이루는 작은 쪽의 각이 ${ang}°이고, 긴바늘이 짧은바늘${ahead ? "을 지나 앞서" : "보다 뒤에"} 있습니다. 지금은 몇 시 몇 분인가요?`,
      subtype: "clock-reverse", html: svg(200, 200, analog(hour, minute), "숫자 없는 시계"), answer: `${hour}시 ${minute}분`,
      solution: `${hour}시 정각에 짧은바늘은 12에서 ${30 * hour}°입니다. 1분마다 긴바늘은 6°, 짧은바늘은 0.5° 가므로 둘 사이는 1분에 5.5°씩 ${ahead ? "늘었다가 앞섭니다" : "줄어듭니다"}. ${ahead ? `${30 * hour} + ${ang} = ${30 * hour + ang}` : `${30 * hour} − ${ang} = ${30 * hour - ang}`}만큼 긴바늘이 따라잡으려면 ${ahead ? 30 * hour + ang : 30 * hour - ang} ÷ 5.5 = ${minute}분 걸립니다. ${hour}시 ${minute}분입니다.`,
      family: "clock-between", meta: { hour, minute }
    });
  }
  return null;
}

// ════ 4단원 평면도형의 넓이 ════
function c2RhombusArea({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "rhombus" : sample(["rhombus", "kite", "square", "reverse"]);
  const d1 = randomInt(3, 9) * 2, d2 = randomInt(3, 9) * 2;
  const s = 200 / Math.max(d1, d2);
  const c = P(130, 120);
  let pts, prompt, answer, solution, label;
  if (kind === "square") {
    const d = randomInt(3, 10) * 2;
    pts = [P(c.x, c.y - 90), P(c.x + 90, c.y), P(c.x, c.y + 90), P(c.x - 90, c.y)];
    const body = poly(pts, { fill: YELLOW }) + line(pts[0], pts[2], { color: GREEN, dash: "5 4" }) + line(pts[1], pts[3], { color: GREEN, dash: "5 4" }) + text(c.x + 12, c.y - 40, `${d}cm`, { size: 13, anchor: "start" });
    return problem({
      prompt: `대각선의 길이가 ${d}cm인 정사각형의 넓이는 몇 ㎠인가요?`,
      subtype: "rhombus-area", html: svg(260, 240, body, "정사각형"), answer: `${(d * d) / 2}㎠`,
      solution: `정사각형은 두 대각선의 길이가 같고 서로 수직이므로 마름모처럼 (대각선) × (대각선) ÷ 2로 넓이를 구합니다. ${d} × ${d} ÷ 2 = ${(d * d) / 2}㎠입니다(둘러싼 큰 정사각형의 반).`,
      family: "rhombus-square", meta: { d }
    });
  }
  const off = kind === "kite" ? 0.3 : 0.5;
  pts = [P(c.x, c.y - d2 * s * off), P(c.x + (d1 * s) / 2, c.y - d2 * s * (off - 0.5) * 0 + 0), P(c.x, c.y + d2 * s * (1 - off)), P(c.x - (d1 * s) / 2, c.y)];
  pts[1] = P(c.x + (d1 * s) / 2, c.y);
  const area = (d1 * d2) / 2;
  let body = poly(pts, { fill: YELLOW }) + line(pts[0], pts[2], { color: GREEN, dash: "5 4" }) + line(pts[1], pts[3], { color: GREEN, dash: "5 4" }) + rightMark(c, 0, 9, GREEN);
  if (kind === "reverse") {
    body += text(c.x + 8, c.y + 30, `${d2}cm`, { size: 13, anchor: "start" }) + text(c.x - 40, c.y - 12, "?", { size: 15, color: MARK });
    prompt = `두 대각선이 서로 수직인 사각형의 넓이가 ${area}㎠이고 한 대각선이 ${d2}cm입니다. 다른 대각선은 몇 cm인가요?`;
    answer = `${d1}cm`;
    solution = `넓이 = (대각선) × (대각선) ÷ 2이므로 ${area} × 2 ÷ ${d2} = ${d1}cm입니다.`;
  } else {
    body += text(c.x + 8, c.y + 30, `${d2}cm`, { size: 13, anchor: "start" }) + text(c.x - (d1 * s) / 4, c.y - 12, `${d1}cm`, { size: 13 });
    label = kind === "kite" ? "두 대각선이 서로 수직인 사각형(연 모양)" : "마름모";
    prompt = `${label}의 두 대각선이 ${d1}cm, ${d2}cm입니다. 넓이는 몇 ㎠인가요?`;
    answer = `${area}㎠`;
    solution = `대각선이 서로 수직이면 사각형을 둘러싸는 직사각형(${d1} × ${d2})을 그릴 수 있고, 사각형은 그 직사각형의 꼭 반입니다(바깥 삼각형 넷이 안쪽 삼각형 넷과 같습니다). ${d1} × ${d2} ÷ 2 = ${area}㎠입니다.`;
  }
  return problem({ prompt, subtype: "rhombus-area", html: svg(260, 250, body, "대각선이 수직인 사각형"), answer, solution, family: `rhombus-${kind}`, meta: { d1, d2 } });
}
function c2ParallelogramArea({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "area" : sample(["area", "reverse", "otherBase"]);
  const b = randomInt(5, 14), h = randomInt(3, 9), slantX = randomInt(2, 4);
  const s = 200 / (b + slantX);
  const A = P(30 + slantX * s, 30), B = P(30 + (b + slantX) * s, 30), C = P(30 + b * s, 30 + h * s), D = P(30, 30 + h * s);
  const side = Math.round(Math.sqrt(h * h + slantX * slantX) * 10) / 10;
  const foot = P(A.x, D.y);
  let body = poly([A, B, C, D], { fill: YELLOW }) + line(A, foot, { color: GREEN, dash: "5 4" }) + rightMark(foot, 0, 8, GREEN);
  body += lenLabel(D, C, `${b}cm`, { offset: -14 }) + text(A.x + 6, (A.y + foot.y) / 2, `${h}cm`, { size: 13, anchor: "start", color: GREEN }) + lenLabel(D, A, `${Math.ceil(side)}cm`, { offset: 14, color: "#7a857f" });
  const area = b * h;
  if (kind === "area") return problem({
    prompt: `밑변이 ${b}cm, 높이가 ${h}cm인 평행사변형의 넓이는 몇 ㎠인가요? (비스듬한 변의 길이 ${Math.ceil(side)}cm는 쓰지 않아도 됩니다.)`,
    subtype: "parallelogram-area", html: svg((b + slantX) * s + 60, h * s + 70, body, "평행사변형"), answer: `${area}㎠`,
    solution: `높이 선을 따라 왼쪽 삼각형을 잘라 오른쪽에 붙이면 가로 ${b}cm, 세로 ${h}cm인 직사각형이 됩니다. 넓이 = 밑변 × 높이 = ${b} × ${h} = ${area}㎠입니다. 비스듬한 변은 높이가 아닙니다.`,
    family: "parallelogram-area", meta: { b, h }
  });
  if (kind === "reverse") return problem({
    prompt: `넓이가 ${area}㎠인 평행사변형의 밑변이 ${b}cm입니다. 높이는 몇 cm인가요?`,
    subtype: "parallelogram-area", html: svg((b + slantX) * s + 60, h * s + 70, body.replace(`>${h}cm<`, ">?<"), "평행사변형"), answer: `${h}cm`,
    solution: `넓이 = 밑변 × 높이이므로 높이 = ${area} ÷ ${b} = ${h}cm입니다.`,
    family: "parallelogram-reverse", meta: { b, h }
  });
  // 다른 밑변과 높이: 넓이가 같다. 다른 변(비스듬한 변) b2는 높이 h보다 길고, 그 변에 대한 높이 h2는 밑변 b보다 짧다
  for (const b2 of shuffle([4, 5, 6, 7, 8, 9, 10, 12, 14, 15])) {
    if (b2 <= h || area % b2 !== 0) continue;
    const h2 = area / b2;
    if (h2 >= b || h2 === h) continue;
    const sx = Math.sqrt(b2 * b2 - h * h), sc = 200 / (b + sx);
    const A2 = P(30 + sx * sc, 30), B2 = P(30 + (b + sx) * sc, 30), C2 = P(30 + b * sc, 30 + h * sc), D2 = P(30, 30 + h * sc), F2 = P(A2.x, D2.y);
    const fig = poly([A2, B2, C2, D2], { fill: YELLOW }) + line(A2, F2, { color: GREEN, dash: "5 4" }) + rightMark(F2, 0, 8, GREEN)
      + lenLabel(D2, C2, `${b}cm`, { offset: -14 }) + text(A2.x + 6, (A2.y + F2.y) / 2, `${h}cm`, { size: 13, anchor: "start", color: GREEN }) + lenLabel(D2, A2, `${b2}cm`, { offset: 14 });
    return problem({
      prompt: `평행사변형의 밑변이 ${b}cm일 때 높이는 ${h}cm입니다. 같은 평행사변형에서 비스듬한 변 ${b2}cm를 밑변으로 하면 높이는 몇 cm인가요?`,
      subtype: "parallelogram-area", html: svg((b + sx) * sc + 60, h * sc + 70, fig, "평행사변형"), answer: `${h2}cm`,
      solution: `어느 변을 밑변으로 하든 넓이는 같습니다. 넓이 = ${b} × ${h} = ${area}㎠이므로 다른 높이 = ${area} ÷ ${b2} = ${h2}cm입니다.`,
      family: "parallelogram-other-base", meta: { b, h, b2 }
    });
  }
  return null;
}
function c2TriangleArea({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "area" : sample(["area", "obtuse", "reverse", "sameHeight"]);
  const b = randomInt(3, 10) * 2, h = randomInt(3, 10);
  const s = Math.min(16, 220 / (b + 6));
  const B = P(30, 30 + h * s), C = P(30 + b * s, 30 + h * s);
  const area = (b * h) / 2;
  if (kind === "obtuse") {
    const t = randomInt(2, 5);
    const A = P(C.x + t * s, 30);
    const foot = P(A.x, C.y);
    const body = poly([A, B, C], { fill: YELLOW }) + line(C, foot, { color: GREEN, dash: "4 4" }) + line(A, foot, { color: GREEN, dash: "5 4" }) + rightMark(foot, 90, 8, GREEN)
      + lenLabel(B, C, `${b}cm`, { offset: -14 }) + text(A.x + 6, (A.y + foot.y) / 2, `${h}cm`, { size: 13, anchor: "start", color: GREEN });
    return problem({
      prompt: `밑변이 ${b}cm이고, 꼭짓점에서 밑변을 늘인 선까지 내린 높이가 ${h}cm인 둔각삼각형의 넓이는 몇 ㎠인가요?`,
      subtype: "triangle-area", html: svg(A.x + 50, h * s + 70, body, "둔각삼각형"), answer: `${area}㎠`,
      solution: `둔각삼각형은 높이가 삼각형 바깥(밑변을 늘인 선)으로 내려옵니다. 그래도 넓이는 밑변 × 높이 ÷ 2 = ${b} × ${h} ÷ 2 = ${area}㎠입니다.`,
      family: "triangle-obtuse", meta: { b, h }
    });
  }
  const A = P(30 + randomInt(2, b - 1) * s, 30);
  const foot = P(A.x, C.y);
  let body = poly([A, B, C], { fill: YELLOW }) + line(A, foot, { color: GREEN, dash: "5 4" }) + rightMark(foot, 0, 8, GREEN) + lenLabel(B, C, `${b}cm`, { offset: -14 });
  if (kind === "sameHeight") {
    const b2 = randomInt(2, 8) * 2;
    const D = P(C.x + b2 * s, C.y);
    body = poly([A, B, C], { fill: YELLOW }) + poly([A, C, D], { fill: SOFT }) + line(A, foot, { color: GREEN, dash: "5 4" }) + lenLabel(B, C, `${b}cm`, { offset: -14 }) + lenLabel(C, D, `${b2}cm`, { offset: -14 }) + text((A.x + C.x + D.x) / 3, (A.y + C.y + D.y) / 3 + 6, "?", { size: 15, color: MARK });
    return problem({
      prompt: `꼭짓점을 함께 쓰는 두 삼각형이 한 직선 위에 밑변을 두고 있습니다. 왼쪽 삼각형(밑변 ${b}cm)의 넓이가 ${area}㎠일 때, 오른쪽 삼각형(밑변 ${b2}cm)의 넓이는 몇 ㎠인가요?`,
      subtype: "triangle-area", html: svg(D.x + 40, h * s + 70, body, "높이가 같은 두 삼각형"), answer: `${(b2 * h) / 2}㎠`,
      solution: `두 삼각형은 꼭짓점이 같아 높이가 같습니다. 왼쪽에서 높이 = ${area} × 2 ÷ ${b} = ${h}cm, 오른쪽 넓이 = ${b2} × ${h} ÷ 2 = ${(b2 * h) / 2}㎠입니다.`,
      family: "triangle-same-height", meta: { b, h, b2 }
    });
  }
  if (kind === "reverse") {
    body += text(A.x + 6, (A.y + foot.y) / 2, "?", { size: 15, anchor: "start", color: MARK });
    return problem({
      prompt: `넓이가 ${area}㎠인 삼각형의 밑변이 ${b}cm입니다. 높이는 몇 cm인가요?`,
      subtype: "triangle-area", html: svg(C.x + 40, h * s + 70, body, "삼각형"), answer: `${h}cm`,
      solution: `삼각형의 넓이 = 밑변 × 높이 ÷ 2이므로 높이 = ${area} × 2 ÷ ${b} = ${h}cm입니다.`,
      family: "triangle-reverse", meta: { b, h }
    });
  }
  body += text(A.x + 6, (A.y + foot.y) / 2, `${h}cm`, { size: 13, anchor: "start", color: GREEN });
  return problem({
    prompt: `밑변이 ${b}cm, 높이가 ${h}cm인 삼각형의 넓이는 몇 ㎠인가요?`,
    subtype: "triangle-area", html: svg(C.x + 40, h * s + 70, body, "삼각형"), answer: `${area}㎠`,
    solution: `똑같은 삼각형을 하나 더 돌려 붙이면 밑변 ${b}cm, 높이 ${h}cm인 평행사변형이 됩니다. 삼각형은 그 반이므로 ${b} × ${h} ÷ 2 = ${area}㎠입니다.`,
    family: "triangle-area", meta: { b, h }
  });
}
function c2TrapezoidArea({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "area" : sample(["area", "reverseHeight", "reverseSide"]);
  for (let tries = 0; tries < 40; tries += 1) {
    const a = randomInt(3, 10), b = randomInt(a + 2, 16), h = randomInt(3, 10);
    if ((a + b) * h % 2) continue;
    const area = ((a + b) * h) / 2;
    const s = 220 / b, o = P(30, 30), shift = randomInt(0, b - a) * s;
    const A = P(o.x + shift, o.y), B = P(o.x + shift + a * s, o.y), C = P(o.x + b * s, o.y + h * 14), D = P(o.x, o.y + h * 14);
    const foot = P(B.x, C.y);
    let body = poly([A, B, C, D], { fill: YELLOW }) + line(B, foot, { color: GREEN, dash: "5 4" }) + rightMark(foot, 90, 8, GREEN);
    body += lenLabel(A, B, kind === "reverseSide" ? "?" : `${a}cm`, { offset: 14, color: kind === "reverseSide" ? MARK : INK }) + lenLabel(D, C, `${b}cm`, { offset: -14 });
    body += text(B.x + 6, (B.y + foot.y) / 2, kind === "reverseHeight" ? "?" : `${h}cm`, { size: 13, anchor: "start", color: kind === "reverseHeight" ? MARK : GREEN });
    const html = svg(b * s + 70, h * 14 + 70, body, "사다리꼴");
    if (kind === "area") return problem({
      prompt: `윗변이 ${a}cm, 아랫변이 ${b}cm, 높이가 ${h}cm인 사다리꼴의 넓이는 몇 ㎠인가요?`,
      subtype: "trapezoid-area", html, answer: `${area}㎠`,
      solution: `똑같은 사다리꼴을 하나 더 거꾸로 돌려 붙이면 밑변이 ${a} + ${b} = ${a + b}cm인 평행사변형이 됩니다. 사다리꼴은 그 반이므로 (${a} + ${b}) × ${h} ÷ 2 = ${area}㎠입니다.`,
      family: "trapezoid-area", meta: { a, b, h }
    });
    if (kind === "reverseHeight") return problem({
      prompt: `윗변이 ${a}cm, 아랫변이 ${b}cm인 사다리꼴의 넓이가 ${area}㎠입니다. 높이는 몇 cm인가요?`,
      subtype: "trapezoid-area", html, answer: `${h}cm`,
      solution: `넓이 = (윗변 + 아랫변) × 높이 ÷ 2이므로 높이 = ${area} × 2 ÷ ${a + b} = ${h}cm입니다.`,
      family: "trapezoid-reverse-height", meta: { a, b, h }
    });
    return problem({
      prompt: `아랫변이 ${b}cm, 높이가 ${h}cm인 사다리꼴의 넓이가 ${area}㎠입니다. 윗변은 몇 cm인가요?`,
      subtype: "trapezoid-area", html, answer: `${a}cm`,
      solution: `(윗변 + 아랫변) = 넓이 × 2 ÷ 높이 = ${area} × 2 ÷ ${h} = ${a + b}cm입니다. 윗변 = ${a + b} − ${b} = ${a}cm입니다.`,
      family: "trapezoid-reverse-side", meta: { a, b, h }
    });
  }
  return null;
}

export const COURSE2_G3_GENERATORS = plainText({
  c2SymmetricNumberCount, c2DiceHiddenSum, c2DiceRoll, c2CubeNetOpposite,
  c2ParallelAngle, c2ClockFromAngle,
  c2RhombusArea, c2ParallelogramArea, c2TriangleArea, c2TrapezoidArea
});
export const COURSE2_G3_TYPE_ROWS = [
  ["c2-symmetric-number-count", "number", "디지털 숫자 대칭", "거울·반 바퀴에도 같은 여러 자리 수", "c2SymmetricNumberCount"],
  ["c2-dice-hidden-sum", "geometry", "주사위", "쌓거나 붙인 주사위의 보이지 않는 눈", "c2DiceHiddenSum"],
  ["c2-dice-roll", "geometry", "주사위", "굴린 주사위의 윗면", "c2DiceRoll"],
  ["c2-cube-net-opposite", "geometry", "전개도", "전개도에서 마주 보는 면", "c2CubeNetOpposite"],
  ["c2-parallel-angle", "geometry", "각", "평행선과 각(엇각·동위각·꺾인 선)", "c2ParallelAngle"],
  ["c2-clock-from-angle", "geometry", "각", "바늘의 각으로 시각 찾기", "c2ClockFromAngle"],
  ["c2-rhombus-area", "geometry", "넓이", "대각선이 수직인 사각형의 넓이", "c2RhombusArea"],
  ["c2-parallelogram-area", "geometry", "넓이", "평행사변형의 넓이", "c2ParallelogramArea"],
  ["c2-triangle-area", "geometry", "넓이", "삼각형의 넓이", "c2TriangleArea"],
  ["c2-trapezoid-area", "geometry", "넓이", "사다리꼴의 넓이", "c2TrapezoidArea"]
];
export const COURSE2_G3_GUIDES = Object.freeze({
  "c2-symmetric-number-count": "차례가 거꾸로 되므로 앞뒤 자리를 짝지어, 짝이 되는 숫자끼리만 고릅니다.",
  "c2-dice-hidden-sum": "마주 보는 두 면의 합은 7 — 위·아래, 왼쪽·오른쪽을 짝지어 셉니다.",
  "c2-dice-roll": "한 칸 굴릴 때마다 굴러가는 쪽의 반대편 면이 위로 올라옵니다.",
  "c2-cube-net-opposite": "한 줄로 이어진 세 면 중 양 끝은 마주 봅니다. 바닥 면을 정하고 하나씩 세워 접어 봅니다.",
  "c2-parallel-angle": "평행선에서 엇각·동위각은 같습니다. 꺾인 곳에는 평행선을 하나 더 그어 나눕니다.",
  "c2-clock-from-angle": "짧은바늘은 1시간에 30°, 1분에 0.5°, 두 바늘 사이는 1분에 5.5°씩 달라집니다.",
  "c2-rhombus-area": "대각선이 수직이면 넓이 = 두 대각선의 곱 ÷ 2(둘러싼 직사각형의 반)입니다.",
  "c2-parallelogram-area": "한쪽을 잘라 붙이면 직사각형 — 넓이 = 밑변 × 높이(비스듬한 변이 아님)입니다.",
  "c2-triangle-area": "똑같은 삼각형 둘이면 평행사변형 — 넓이 = 밑변 × 높이 ÷ 2입니다.",
  "c2-trapezoid-area": "똑같은 사다리꼴 둘이면 평행사변형 — 넓이 = (윗변 + 아랫변) × 높이 ÷ 2입니다."
});
