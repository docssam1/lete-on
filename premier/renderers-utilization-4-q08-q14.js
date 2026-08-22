(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#1c2734";
  const NAVY = "#173a6b";
  const GRID = "#7c8998";
  const PALE = "#eef2f6";
  const GOLD = "#c9a34d";
  const RED = "#b64032";

  function wrap(viewBox, body, className) {
    return svg(
      viewBox,
      `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`,
      className || "wide-svg"
    );
  }

  function txt(x, y, value, attrs) {
    return `<text x="${x}" y="${y}" ${attrs || ""}>${value}</text>`;
  }

  function poly(points, attrs) {
    return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`;
  }

  function arrow(x1, y1, x2, y2, color) {
    const stroke = color || NAVY;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const tipBackX = x2 - Math.cos(angle) * 9;
    const tipBackY = y2 - Math.sin(angle) * 9;
    const left = [tipBackX + Math.cos(angle + Math.PI / 2) * 4, tipBackY + Math.sin(angle + Math.PI / 2) * 4];
    const right = [tipBackX + Math.cos(angle - Math.PI / 2) * 4, tipBackY + Math.sin(angle - Math.PI / 2) * 4];
    return `<line x1="${x1}" y1="${y1}" x2="${tipBackX}" y2="${tipBackY}" stroke="${stroke}" stroke-width="1.8"/><polygon points="${x2},${y2} ${left[0]},${left[1]} ${right[0]},${right[1]}" fill="${stroke}" stroke="none"/>`;
  }

  // 8. 한글 낱말의 각 음절을 자모 획수로 바꾸는 예시 상자.
  register("u4-q8", function () {
    let body = `<rect x="18" y="12" width="374" height="64" rx="1" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
    body += txt(92, 52, "영재", `text-anchor="middle" font-size="18" font-weight="800" fill="${NAVY}"`);
    body += txt(152, 52, "→", `text-anchor="middle" font-size="19" font-weight="800" fill="${INK}"`);
    body += txt(190, 52, "56", `text-anchor="middle" font-size="18" font-weight="850" fill="${INK}"`);
    body += txt(272, 52, "수학", `text-anchor="middle" font-size="18" font-weight="800" fill="${NAVY}"`);
    body += txt(331, 52, "→", `text-anchor="middle" font-size="19" font-weight="800" fill="${INK}"`);
    body += txt(368, 52, "47", `text-anchor="middle" font-size="18" font-weight="850" fill="${INK}"`);
    return wrap("0 0 410 88", body);
  });

  // 9. 두 놀이를 두 집합으로 나타내어 조건을 한눈에 확인하는 그림.
  register("u4-q9", function () {
    const cx1 = 153;
    const cx2 = 247;
    const cy = 88;
    const r = 61;
    let body = `<rect x="12" y="10" width="376" height="154" rx="8" fill="#fafbfd" stroke="${GRID}" stroke-width="1.25"/>`;
    body += `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="#dce9f7" fill-opacity=".68" stroke="${NAVY}" stroke-width="1.8"/>`;
    body += `<circle cx="${cx2}" cy="${cy}" r="${r}" fill="#f8e8cf" fill-opacity=".68" stroke="${GOLD}" stroke-width="1.8"/>`;
    body += txt(cx1 - 20, 30, "술래잡기", `text-anchor="middle" font-size="13" font-weight="850" fill="${NAVY}"`);
    body += txt(cx1 - 20, 47, "15명", `text-anchor="middle" font-size="12" font-weight="750" fill="${INK}"`);
    body += txt(cx2 + 20, 30, "숨바꼭질", `text-anchor="middle" font-size="13" font-weight="850" fill="#8f5d20"`);
    body += txt(cx2 + 20, 47, "24명", `text-anchor="middle" font-size="12" font-weight="750" fill="${INK}"`);
    body += txt(200, 28, "전체 30명", `text-anchor="middle" font-size="12" font-weight="850" fill="${INK}"`);
    body += txt(200, 151, "대답하지 않음 3명", `text-anchor="middle" font-size="12" font-weight="750" fill="${INK}"`);
    return wrap("0 0 400 174", body);
  });

  // 10. 2~9를 배치하는 4×4 빈 격자와 행·열 곱을 표시한다.
  register("u4-q10", function () {
    const ox = 18;
    const oy = 8;
    const cell = 40;
    const side = 42;
    const rowProducts = [8, 42, 72, 15];
    const columnProducts = [10, 18, 32, 63];
    let body = "";

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        body += `<rect x="${ox + column * cell}" y="${oy + row * cell}" width="${cell}" height="${cell}" fill="#fff" stroke="${GRID}" stroke-width="1.15"/>`;
      }
      body += `<rect x="${ox + 4 * cell}" y="${oy + row * cell}" width="${side}" height="${cell}" fill="#ece7d9" stroke="${GRID}" stroke-width="1.15"/>`;
      body += txt(ox + 4 * cell + side / 2, oy + row * cell + 26, rowProducts[row], `text-anchor="middle" font-size="15" font-weight="800" fill="${INK}"`);
    }
    for (let column = 0; column < 4; column += 1) {
      body += `<rect x="${ox + column * cell}" y="${oy + 4 * cell}" width="${cell}" height="${side}" fill="#ece7d9" stroke="${GRID}" stroke-width="1.15"/>`;
      body += txt(ox + column * cell + cell / 2, oy + 4 * cell + 27, columnProducts[column], `text-anchor="middle" font-size="15" font-weight="800" fill="${INK}"`);
    }
    body += `<rect x="${ox + 4 * cell}" y="${oy + 4 * cell}" width="${side}" height="${side}" fill="#fff" stroke="none"/>`;
    return wrap("0 0 238 218", body);
  });

  // 11. 원본에 보이는 수열의 앞부분만 재현한다.
  register("u4-q11", function () {
    let body = `<rect x="10" y="14" width="448" height="54" rx="14" fill="#fff" stroke="#ccd3da" stroke-width="2"/>`;
    body += `<rect x="12" y="16" width="444" height="50" rx="12" fill="none" stroke="#eef1f4" stroke-width="2"/>`;
    body += txt(30, 49, "2, 3, 4, 6, 6, 9, 8, 12", `font-size="19" font-weight="800" fill="${INK}"`);
    body += txt(360, 49, "……", `font-size="20" font-weight="850" fill="${NAVY}"`);
    return wrap("0 0 468 82", body);
  });

  function fruit(kind, x, y, scale) {
    const s = scale || 1;
    if (kind === "pear") {
      return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -16 C-7 -12 -9 -5 -7 0 C-14 7 -11 18 0 20 C11 18 14 7 7 0 C9 -5 7 -12 0 -16 Z" fill="#d8b55a" stroke="${INK}" stroke-width="1.1"/><path d="M0 -16 Q4 -23 9 -22" fill="none" stroke="#4f7e4c" stroke-width="2"/></g>`;
    }
    if (kind === "watermelon") {
      return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-17 5 Q0 -13 17 5 Z" fill="#7aaf68" stroke="${INK}" stroke-width="1.1"/><path d="M-12 4 Q0 -8 12 4" fill="none" stroke="#e9d7a0" stroke-width="3"/><path d="M-8 1 l2 -2 M0 -4 v3 M8 1 l-2 -2" stroke="#4d7a48" stroke-width="1.2"/></g>`;
    }
    if (kind === "apple") {
      return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -11 C-13 -15 -18 1 -10 12 C-4 20 4 20 10 12 C18 1 13 -15 0 -11 Z" fill="#d76556" stroke="${INK}" stroke-width="1.1"/><path d="M0 -10 Q2 -20 8 -21" fill="none" stroke="#4f7e4c" stroke-width="2"/><path d="M4 -18 Q11 -21 14 -16 Q8 -13 4 -14 Z" fill="#76a767"/></g>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="13" fill="#efa05e" stroke="${INK}" stroke-width="1.1"/><path d="M-6 -10 Q0 -15 6 -10" fill="none" stroke="#5c8b4f" stroke-width="2"/></g>`;
  }

  function fruitScale(x, y, leftKind, leftLabel, rightKind, rightLabel, leftDown) {
    const leftX = x + 34;
    const rightX = x + 126;
    const centerX = x + 80;
    const leftY = y + (leftDown ? 66 : 50);
    const rightY = y + (leftDown ? 50 : 66);
    const beamY = y + 58;
    const beam = `<line x1="${leftX - 22}" y1="${leftY + 4}" x2="${rightX + 22}" y2="${rightY + 4}" stroke="${INK}" stroke-width="2.1"/>`;
    const leftHanger = `<line x1="${leftX}" y1="${leftY + 1}" x2="${leftX}" y2="${leftY - 12}" stroke="${GRID}" stroke-width="1.2"/>`;
    const rightHanger = `<line x1="${rightX}" y1="${rightY + 1}" x2="${rightX}" y2="${rightY - 12}" stroke="${GRID}" stroke-width="1.2"/>`;
    const cups = `<path d="M${leftX - 25} ${leftY - 12} Q${leftX} ${leftY - 2} ${leftX + 25} ${leftY - 12}" fill="none" stroke="${GRID}" stroke-width="1.25"/><path d="M${rightX - 25} ${rightY - 12} Q${rightX} ${rightY - 2} ${rightX + 25} ${rightY - 12}" fill="none" stroke="${GRID}" stroke-width="1.25"/>`;
    const stand = `<line x1="${centerX}" y1="${beamY + 3}" x2="${centerX}" y2="${y + 92}" stroke="${GRID}" stroke-width="1.2"/><path d="M${centerX} ${beamY + 3} L${centerX - 11} ${y + 93} H${centerX + 11} Z" fill="#dbe1e8" stroke="${INK}" stroke-width="1.2"/>`;
    return `<g>${txt(x + 80, y + 14, `${leftLabel}  ·  ${rightLabel}`, `text-anchor="middle" font-size="12" font-weight="850" fill="${NAVY}"`)}${beam}${leftHanger}${rightHanger}${cups}${stand}${fruit(leftKind, leftX, leftY - 24, .72)}${fruit(rightKind, rightX, rightY - 24, .72)}${txt(leftX, y + 108, leftLabel, `text-anchor="middle" font-size="11" font-weight="800" fill="${INK}"`)}${txt(rightX, y + 108, rightLabel, `text-anchor="middle" font-size="11" font-weight="800" fill="${INK}"`)}${arrow(leftDown ? rightX + 27 : leftX - 27, y + (leftDown ? 39 : 76), leftDown ? rightX + 27 : leftX - 27, y + (leftDown ? 25 : 62), RED)}</g>`;
  }

  // 12. 과일 두 개씩을 올린 네 저울의 기울기를 선명한 벡터로 재작성한다.
  register("u4-q12", function () {
    const body = [
      fruitScale(5, 4, "pear", "배", "watermelon", "수박", true),
      fruitScale(215, 4, "apple", "사과", "orange", "오렌지", true),
      fruitScale(5, 119, "watermelon", "수박", "orange", "오렌지", true),
      fruitScale(215, 119, "pear", "배", "apple", "사과", true)
    ].join("");
    return wrap("0 0 390 234", body);
  });

  // 13. A만 제시된 6인 원탁을 재현하고 나머지 자리는 비워 둔다.
  register("u4-q13", function () {
    const cx = 154;
    const cy = 95;
    const seats = [
      [cx, cy - 74],
      [cx + 66, cy - 35],
      [cx + 66, cy + 39],
      [cx, cy + 78],
      [cx - 66, cy + 39],
      [cx - 66, cy - 35]
    ];
    let body = `<circle cx="${cx}" cy="${cy}" r="42" fill="#d8d5cf" stroke="#b7aa90" stroke-width="1.8"/>`;
    seats.forEach(([x, y], index) => {
      body += `<circle cx="${x}" cy="${y}" r="18" fill="#fff" stroke="#c9c1ae" stroke-width="1.7"/>`;
      if (index === 3) body += txt(x, y + 6, "A", `text-anchor="middle" font-size="16" font-weight="850" fill="${NAVY}"`);
    });
    return wrap("0 0 308 198", body);
  });

  // 14. 짝수 카드와 주어진 세 칸이 보이는 3×3 마방진.
  register("u4-q14", function () {
    const tiles = [2, 4, 6, 8, 10, 12, 14, 16, 18];
    const tileSize = 31;
    let body = "";
    tiles.forEach((value, index) => {
      const x = 16 + index * 35;
      const border = index % 2 === 0 ? "#b8ca77" : "#c8badd";
      body += `<rect x="${x}" y="8" width="${tileSize}" height="${tileSize}" fill="#fff" stroke="${border}" stroke-width="1.4"/>`;
      body += txt(x + tileSize / 2, 29, value, `text-anchor="middle" font-size="12" font-weight="800" fill="${INK}"`);
    });

    const gx = 110;
    const gy = 60;
    const cell = 47;
    const givens = { "0,0": 16, "2,0": 12, "2,2": 4 };
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const x = gx + column * cell;
        const y = gy + row * cell;
        const value = givens[`${row},${column}`];
        body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${value ? "#f7fbff" : "#fff"}" stroke="#9ccde2" stroke-width="1.25"/>`;
        if (value) body += txt(x + cell / 2, y + 30, value, `text-anchor="middle" font-size="16" font-weight="850" fill="${NAVY}"`);
      }
    }
    return wrap("0 0 440 218", body);
  });
})(window);
