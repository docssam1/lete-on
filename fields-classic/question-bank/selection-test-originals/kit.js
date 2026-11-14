// 선발시험 원문 다시 짜기 공용 그림 도구 (원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」).
// 권별 테스트 도구(unit-test-originals/kit.js)를 그대로 쓰고, 선발시험에 자주 나오는 것(보기 틀·굵은 화살표·도형 글자·저울·바둑돌)을 더한다.
// 그림은 모두 인라인 SVG·인라인 스타일 — 색은 워밍업 그림 색표(.claude/skills/golden-bell-figure-style), 글자는 검정.
// 원문의 회사 이름·머리글(THE CLASSIC·필즈더클래식)은 옮기지 않는다. 정답은 두지 않는다(비공개 자리에만).
import { UT, esc, text, svg, box, line, cardsRow, conditionsBox } from "../unit-test-originals/kit.js?v=20261028ze";
export { UT, esc, text, svg, box, line, cardsRow, conditionsBox };

export const f1 = (n) => (Math.round(n * 10) / 10).toString();
const pts = (list) => list.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");

// 도형 색(색표: ○ 빨강 · △ 초록 · □ 파랑 · ◇ 보라 · ☆ 주황 · ▽ 분홍)
export const SHAPE = Object.freeze({
  circle: [UT.red, UT.redSoft], triangle: [UT.green, UT.greenSoft], triangleDown: [UT.pink, "#fde3ef"], square: [UT.blue, UT.blueSoft],
  diamond: [UT.purple, UT.purpleSoft], star: [UT.orange, UT.yellowSoft], pentagon: [UT.orange, UT.orangeSoft], heart: [UT.pink, "#fde3ef"]
});

// 도형 하나(가운데 cx, cy · 크기 s). value 가 있으면 안에 글자.
export function shape(kind, cx, cy, s = 30, value = null, { plain = false } = {}) {
  const [stroke, fill] = plain ? [UT.ink, "#fff"] : (SHAPE[kind] || [UT.ink, "#fff"]);
  const h = s / 2;
  const style = `fill="${fill}" stroke="${stroke}" stroke-width="${s > 26 ? 2 : 1.6}" stroke-linejoin="round"`;
  let body;
  if (kind === "circle") body = `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(h)}" ${style}/>`;
  else if (kind === "square") body = `<rect x="${f1(cx - h)}" y="${f1(cy - h)}" width="${f1(s)}" height="${f1(s)}" rx="2" ${style}/>`;
  else if (kind === "diamond") body = `<polygon points="${pts([[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]])}" ${style}/>`;
  else if (kind === "triangle") body = `<polygon points="${pts([[cx, cy - h], [cx + h, cy + h * 0.8], [cx - h, cy + h * 0.8]])}" ${style}/>`;
  else if (kind === "triangleDown") body = `<polygon points="${pts([[cx - h, cy - h * 0.8], [cx + h, cy - h * 0.8], [cx, cy + h]])}" ${style}/>`;
  else if (kind === "star") {
    const list = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? h * 0.45 : h; return [cx + Math.cos(a) * r, cy + 1 + Math.sin(a) * r]; });
    body = `<polygon points="${pts(list)}" ${style}/>`;
  } else if (kind === "pentagon") {
    body = `<polygon points="${pts(Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [cx + Math.cos(a) * h, cy + 1 + Math.sin(a) * h]; }))}" ${style}/>`;
  } else if (kind === "heart") {
    body = `<path d="M${f1(cx)} ${f1(cy + h * 0.85)} C${f1(cx - h * 1.25)} ${f1(cy)} ${f1(cx - h * 0.7)} ${f1(cy - h * 1.05)} ${f1(cx)} ${f1(cy - h * 0.4)} C${f1(cx + h * 0.7)} ${f1(cy - h * 1.05)} ${f1(cx + h * 1.25)} ${f1(cy)} ${f1(cx)} ${f1(cy + h * 0.85)}Z" ${style}/>`;
  } else body = "";
  return body + (value == null ? "" : text(cx, cy + (kind === "triangle" ? s * 0.12 : kind === "triangleDown" ? -s * 0.1 : 1), value, { size: s * 0.46 }));
}

// 작은 원 속 글자(㉠·① 같은 표지 — 글꼴에 기대지 않고 직접 그린다). ㉠ 은 ringed(x, y, "ㄱ")
export const ringed = (cx, cy, value, { r = 11, size = 13, fill = "#fff" } = {}) =>
  `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}" stroke="${UT.ink}" stroke-width="1.4"/>${text(cx, cy + 0.5, value, { size, weight: 700 })}`;

// 칸(사각형) + 가운데 글자. value 가 "㉠"·"㉡" 이면 원 표지로 그린다.
const MARKS = { "㉠": "ㄱ", "㉡": "ㄴ", "㉢": "ㄷ", "㉣": "ㄹ", "㉤": "ㅁ" };
export function cell(x, y, w, h, value = "", { fill = "#fff", stroke = UT.box, size = 18, width = 1.6 } = {}) {
  const mark = MARKS[value];
  return box(x, y, w, h, { fill, stroke, width, radius: 2 }) + (value === "" || value == null ? "" : mark ? ringed(x + w / 2, y + h / 2, mark) : text(x + w / 2, y + h / 2 + 1, value, { size }));
}
// 원 칸 + 글자(㉠ 이면 표지)
export function disc(cx, cy, r, value = "", { fill = "#fff", stroke = UT.box, size = 18 } = {}) {
  const mark = MARKS[value];
  return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>` + (value === "" || value == null ? "" : mark ? ringed(cx, cy, mark) : text(cx, cy + 1, value, { size }));
}
export const mark = (cx, cy, value, opts) => ringed(cx, cy, MARKS[value] || value, opts);

// [보기] 틀: 둥근 네모, 위 가운데에 「보기」 글자
export function frame(x, y, w, h, label = "보기") {
  const lw = label.length * 15 + 22;
  return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="none" stroke="${UT.line}" stroke-width="1.5"/>`
    + `<rect x="${f1(x + w / 2 - lw / 2)}" y="${f1(y - 9)}" width="${lw}" height="18" fill="#fff"/>${text(x + w / 2, y, label, { size: 13, weight: 800, fill: UT.line })}`;
}

// 굵은 화살표(속이 빈 막대 화살표 — 원문 모양)
export function blockArrow(x1, y1, x2, y2, { shaft = 7, head = 16, headLen = 11, fill = UT.yellowSoft, stroke = UT.line } = {}) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux;
  const s = shaft / 2, h = head / 2, bx = x2 - ux * headLen, by = y2 - uy * headLen;
  return `<polygon points="${pts([[x1 + px * s, y1 + py * s], [bx + px * s, by + py * s], [bx + px * h, by + py * h], [x2, y2], [bx - px * h, by - py * h], [bx - px * s, by - py * s], [x1 - px * s, y1 - py * s]])}" fill="${fill}" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round"/>`;
}
// 가는 화살표(선 + 머리)
export function arrow(x1, y1, x2, y2, { stroke = UT.ink, width = 1.5, head = 7 } = {}) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux;
  const bx = x2 - ux * head, by = y2 - uy * head;
  return line(x1, y1, bx, by, { stroke, width }) + `<polygon points="${pts([[x2, y2], [bx + px * head * 0.5, by + py * head * 0.5], [bx - px * head * 0.5, by - py * head * 0.5]])}" fill="${stroke}"/>`;
}
// ⊕ 표지
export const plusMark = (cx, cy, r = 10) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>${line(cx - r * 0.55, cy, cx + r * 0.55, cy, { width: 1.6 })}${line(cx, cy - r * 0.55, cx, cy + r * 0.55, { width: 1.6 })}`;

// 식 한 줄: tokens = ["star", "+", "circle", "=", "□", "52" …] — 도형 이름이면 도형, 아니면 글자. 빈 네모 칸은 "box"
export function equation(tokens, x, cy, { s = 24, gap = 6, size = 20 } = {}) {
  let out = "";
  let cx = x;
  for (const token of tokens) {
    if (SHAPE[token]) { out += shape(token, cx + s / 2, cy, s); cx += s + gap; }
    else if (token === "box") { out += box(cx, cy - s * 0.75, s * 1.5, s * 1.5, { fill: "#fff", stroke: UT.box, radius: 2 }); cx += s * 1.5 + gap; }
    else if (token === "blank") { out += box(cx, cy - s / 2, s, s, { fill: "#fff", stroke: UT.ink, width: 1.4, radius: 1 }); cx += s + gap; }
    else { const w = String(token).length * size * 0.62 + 4; out += text(cx + w / 2, cy + 1, token, { size, weight: 600 }); cx += w + gap; }
  }
  return { markup: out, width: cx - x - gap };
}
export function equationWidth(tokens, opts = {}) { return equation(tokens, 0, 0, opts).width; }

// 양팔 저울: 받침 세모 · 막대 · 두 접시, 접시 위 물건은 rows(아래 줄부터) — 칸 이름은 SHAPE 이름 또는 "cylinder"·"cube"
function thing(kind, cx, cy, s) {
  if (kind === "cylinder") {
    const rx = s * 0.48, ry = s * 0.16;
    return `<path d="M${f1(cx - rx)} ${f1(cy - s / 2 + ry)} V${f1(cy + s / 2 - ry)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(cx + rx)} ${f1(cy + s / 2 - ry)} V${f1(cy - s / 2 + ry)}" fill="${UT.orangeSoft}" stroke="${UT.orange}" stroke-width="1.5"/><ellipse cx="${f1(cx)}" cy="${f1(cy - s / 2 + ry)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${UT.yellowSoft}" stroke="${UT.orange}" stroke-width="1.5"/>`;
  }
  if (kind === "cube") {
    const a = s * 0.72, d = s * 0.22, x = cx - (a + d) / 2, y = cy - (a + d) / 2 + d;
    return `<polygon points="${pts([[x, y], [x + d, y - d], [x + a + d, y - d], [x + a, y]])}" fill="${UT.cubeTop}" stroke="${UT.cubeLine}" stroke-width="1.3" stroke-linejoin="round"/>`
      + `<polygon points="${pts([[x + a, y], [x + a + d, y - d], [x + a + d, y + a - d], [x + a, y + a]])}" fill="${UT.cubeSide}" stroke="${UT.cubeLine}" stroke-width="1.3" stroke-linejoin="round"/>`
      + `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(a)}" height="${f1(a)}" fill="${UT.cubeFront}" stroke="${UT.cubeLine}" stroke-width="1.3"/>`;
  }
  return shape(kind, cx, cy, s);
}
export function balance(cx, plateY, left = [], right = [], { span = 62, plate = 42, s = 20 } = {}) {
  const items = (rows, px) => rows.map((row, r) => row.map((kind, i) => thing(kind, px + (i - (row.length - 1) / 2) * (s + 2), plateY - 4 - s / 2 - r * (s + 1), s)).join("")).join("");
  return `<polygon points="${pts([[cx, plateY + 12], [cx + 14, plateY + 36], [cx - 14, plateY + 36]])}" fill="${UT.yellowSoft}" stroke="${UT.line}" stroke-width="1.5" stroke-linejoin="round"/>`
    + line(cx - span, plateY + 12, cx + span, plateY + 12, { stroke: UT.line, width: 2.2 })
    + line(cx - span, plateY + 3, cx - span, plateY + 12, { stroke: UT.line, width: 2 }) + line(cx + span, plateY + 3, cx + span, plateY + 12, { stroke: UT.line, width: 2 })
    + `<ellipse cx="${cx - span}" cy="${plateY}" rx="${plate}" ry="6" fill="#f3efe6" stroke="${UT.line}" stroke-width="1.5"/><ellipse cx="${cx + span}" cy="${plateY}" rx="${plate}" ry="6" fill="#f3efe6" stroke="${UT.line}" stroke-width="1.5"/>`
    + items(left, cx - span) + items(right, cx + span);
}

// 바둑돌
export const stone = (cx, cy, black, r = 9) => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${black ? "#222" : "#fbf8f1"}" stroke="${black ? "#222" : "#b3a891"}" stroke-width="1.3"/>`;

// 「1번째」 같은 작은 꼬리표
export const caption = (x, y, value, size = 12) => text(x, y, value, { size, weight: 600, fill: UT.ink });
