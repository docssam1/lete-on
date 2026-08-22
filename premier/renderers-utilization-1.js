(function (global) {
  "use strict";

  const Figures = global.PremierFigures;
  if (!Figures) throw new Error("PremierFigures must be loaded before the utilization-1 renderers.");

  const INK = "#26313b";
  const MUTED = "#697580";
  const LIGHT = "#eef1f3";
  const SHADE = "#b9c0c6";
  const svg = (viewBox, body, className) => Figures.svg(viewBox, body, className || "wide-svg");
  const base = `fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;
  const label = (x, y, value, extra) => `<text x="${x}" y="${y}" fill="${INK}" font-size="13" font-family="Pretendard, Noto Sans KR, sans-serif" text-anchor="middle" ${extra || ""}>${value}</text>`;

  function cellsMarkup(cells, originX, originY, size) {
    return cells.map(([x, y]) => `<rect x="${originX + x * size}" y="${originY + y * size}" width="${size}" height="${size}" fill="#fff"/>`).join("");
  }

  function pinsForSheets(sheetCount, originX, originY, size) {
    let out = "";
    for (let i = 0; i < sheetCount; i += 1) {
      const x = originX + i * size;
      out += `<rect x="${x}" y="${originY}" width="${size}" height="${size}" fill="#fff"/>`;
    }
    for (let i = 0; i <= sheetCount; i += 1) {
      const x = originX + i * size;
      out += `<circle cx="${x}" cy="${originY}" r="3.1" fill="${SHADE}"/>`;
      out += `<circle cx="${x}" cy="${originY + size}" r="3.1" fill="${SHADE}"/>`;
    }
    return `<g ${base}>${out}</g>`;
  }

  function isoCube(x, y, z, ox, oy, mirror) {
    const w = 18;
    const d = 8;
    const h = 27;
    const px = mirror ? -x : x;
    const py = mirror ? -y : y;
    const sx = ox + (px - py) * w;
    const sy = oy + (px + py) * d - (z + 1) * h;
    const top = `${sx},${sy} ${sx + w},${sy + d} ${sx},${sy + 2 * d} ${sx - w},${sy + d}`;
    const left = `${sx - w},${sy + d} ${sx},${sy + 2 * d} ${sx},${sy + 2 * d + h} ${sx - w},${sy + d + h}`;
    const right = `${sx},${sy + 2 * d} ${sx + w},${sy + d} ${sx + w},${sy + d + h} ${sx},${sy + 2 * d + h}`;
    return `<g stroke="${INK}" stroke-width="1.15" stroke-linejoin="round" vector-effect="non-scaling-stroke"><polygon points="${left}" fill="#e5e9ec"/><polygon points="${right}" fill="#cbd2d7"/><polygon points="${top}" fill="#f8f9fa"/></g>`;
  }

  function stackView(stacks, ox, oy, mirror) {
    const cubes = [];
    stacks.forEach(({ x, y, h }) => {
      for (let z = 0; z < h; z += 1) cubes.push({ x, y, z });
    });
    cubes.sort((a, b) => {
      const depthOrder = mirror
        ? (b.x + b.y) - (a.x + a.y)
        : (a.x + a.y) - (b.x + b.y);
      return depthOrder || (a.z - b.z);
    });
    return cubes.map((cube) => isoCube(cube.x, cube.y, cube.z, ox, oy, mirror)).join("");
  }

  function motif(x, y, rotation, mirrored) {
    const transform = `translate(${x} ${y}) rotate(${rotation || 0}) scale(${mirrored ? -1 : 1} 1)`;
    return `<g transform="${transform}" ${base}>
      <path d="M-27 25 L0 -22 L28 25 Z"/>
      <path d="M0 -22 L25 -18 L28 25 Z"/>
      <path d="M0 -22 V-38 H18"/>
      <circle cx="-15" cy="13" r="6.5"/>
    </g>`;
  }

  Figures.register("u1-q1", function () {
    return svg("0 0 240 210", `<g ${base}>
      <rect x="40" y="10" width="160" height="180" fill="#fff"/>
      <g stroke="${MUTED}" stroke-width="1.25" stroke-dasharray="4 4">
        <path d="M40 58 L200 66"/>
        <path d="M40 168 L82 10 L200 168"/>
        <path d="M200 10 L122 190"/>
        <path d="M40 168 L200 188"/>
      </g>
    </g>`);
  });

  Figures.register("u1-q2", function () {
    return svg("0 0 500 180", `<defs>
      <marker id="u1q2-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${INK}"/></marker>
    </defs>
    <g ${base}>
      <rect x="30" y="10" width="86" height="115" fill="#fff"/>
      <line x1="73" y1="10" x2="73" y2="125" stroke="${MUTED}" stroke-dasharray="4 3"/>
      <path d="M52 65 C58 81 82 82 93 61" marker-end="url(#u1q2-arrow)"/>
      <text x="142" y="73" fill="${MUTED}" stroke="none" font-size="24">→</text>
      <path d="M205 13 L267 10 L267 126 L205 126 Z" fill="#fff"/>
      <path d="M211 9 L273 7" stroke="${SHADE}"/>
      <line x1="205" y1="69" x2="267" y2="69" stroke="${MUTED}" stroke-dasharray="4 3"/>
      <path d="M229 102 C211 91 212 68 230 57" marker-end="url(#u1q2-arrow)"/>
      <text x="305" y="73" fill="${MUTED}" stroke="none" font-size="24">→</text>
      <rect x="351" y="34" width="82" height="82" fill="#fff"/>
      <path d="M357 30 H439 V112 M362 26 H444 V108" stroke="${SHADE}"/>
      <path d="M351 34 L433 116 M433 34 L351 116" stroke="${MUTED}" stroke-dasharray="4 3"/>
    </g>
    ${label(73, 151, "〈그림 1〉")}${label(236, 151, "〈그림 2〉")}${label(392, 151, "〈그림 3〉")}`);
  });

  Figures.register("u1-q3", function () {
    return `<div class="rule-box" style="max-width:100%;">
      <ul style="margin:0;padding-left:1.4em;display:grid;gap:.45em;">
        <li>가영이는 현수보다 뒤에, 호진이보다 앞에서 달리고 있습니다.</li>
        <li>호진이보다 앞에 있는 사람 수와 뒤에 있는 사람 수는 같습니다.</li>
        <li>민호 바로 뒤에는 정희가 달리고 있습니다.</li>
      </ul>
    </div>`;
  });

  Figures.register("u1-q5", function () {
    const top = [[0, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const front = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]];
    const right = [[2, 0], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    return svg("0 0 520 170", `<g ${base}>
      ${cellsMarkup(top, 35, 12, 34)}
      ${cellsMarkup(front, 208, 12, 34)}
      ${cellsMarkup(right, 381, 12, 34)}
    </g>
    ${label(86, 145, "위")}${label(259, 145, "앞")}${label(432, 145, "오른쪽 옆")}`);
  });

  Figures.register("u1-q6", function () {
    return svg("0 0 280 170", `<g ${base}>
      <circle cx="140" cy="82" r="68" fill="#fff"/>
      <circle cx="140" cy="82" r="46" fill="#fff"/>
      <circle cx="140" cy="82" r="21" fill="#fff"/>
    </g>
    ${label(140, 88, "3", "font-size=\"17\"")}${label(180, 88, "2", "font-size=\"17\"")}${label(204, 88, "1", "font-size=\"17\"")}`);
  });

  Figures.register("u1-q7", function () {
    return svg("0 0 330 155", `<g ${base}>
      <rect x="45" y="14" width="240" height="117" fill="#fff"/>
      <line x1="125" y1="14" x2="125" y2="131"/>
      <line x1="205" y1="14" x2="205" y2="131"/>
      <line x1="45" y1="65" x2="285" y2="65"/>
      <line x1="45" y1="96" x2="285" y2="96"/>
    </g>
    ${label(165, 48, "㉠", "font-size=\"18\"")}${label(165, 87, "51", "font-size=\"16\"")}${label(85, 120, "29", "font-size=\"16\"")}${label(245, 120, "75", "font-size=\"16\"")}`);
  });

  Figures.register("u1-q9", function () {
    const example = (x, cols, rows, caption) => {
      const w = 76;
      const h = 54;
      let lines = "";
      for (let c = 1; c < cols; c += 1) lines += `<line x1="${x + w * c / cols}" y1="22" x2="${x + w * c / cols}" y2="${22 + h}" stroke="${MUTED}" stroke-dasharray="4 3"/>`;
      for (let r = 1; r < rows; r += 1) lines += `<line x1="${x}" y1="${22 + h * r / rows}" x2="${x + w}" y2="${22 + h * r / rows}" stroke="${MUTED}" stroke-dasharray="4 3"/>`;
      return `<g ${base}><rect x="${x}" y="22" width="${w}" height="${h}" fill="#fff"/>${lines}</g>${label(x + w / 2, 99, caption)}`;
    };
    return svg("0 0 500 118", `${example(18, 2, 1, "첫 번째")}${example(136, 2, 2, "두 번째")}${example(254, 3, 2, "세 번째")}${example(372, 3, 3, "네 번째")}${label(474, 50, "…", "font-size=\"22\"")}`);
  });

  Figures.register("u1-q10", function () {
    const pattern = [1, 0, 0, 1, 1, 0, 1];
    const stones = Array.from({ length: 21 }, (_, i) => {
      const black = pattern[i % pattern.length];
      const x = 18 + i * 20;
      return `<circle cx="${x}" cy="40" r="7.3" fill="${black ? INK : "#fff"}" stroke="${INK}" stroke-width="1.15" vector-effect="non-scaling-stroke"/>`;
    }).join("");
    return svg("0 0 460 80", `${stones}${label(445, 45, "…", "font-size=\"20\"")}`);
  });

  Figures.register("u1-q11", function () {
    return svg("0 0 440 64", `<text x="220" y="39" fill="${INK}" font-size="24" font-family="Georgia, serif" text-anchor="middle" letter-spacing="3">1, 1, 2, 3, 5, 8, 13, …</text>`);
  });

  Figures.register("u1-q12", function () {
    return svg("0 0 500 150", `${pinsForSheets(1, 38, 21, 58)}${pinsForSheets(2, 185, 21, 58)}${pinsForSheets(3, 330, 21, 58)}${label(67, 112, "1장")}${label(243, 112, "2장")}${label(417, 112, "3장")}`);
  });

  Figures.register("u1-q13", function () {
    return `<div class="rule-box" style="max-width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.65em 1.2em;">
      <span>연필 1자루 : 170원</span><span>색연필 1자루 : 440원</span><span>공책 1권 : 350원</span>
      <span>지우개 1개 : 180원</span><span>자 1개 : 220원</span><span>볼펜 1자루 : 530원</span>
    </div>`;
  });

  Figures.register("u1-q14", function () {
    const candidates = [
      motif(178, 80, 90, false), motif(276, 80, 180, true), motif(374, 80, 180, false),
      motif(472, 80, 0, false), motif(570, 80, 270, true), motif(668, 80, 90, true)
    ].join("");
    const nums = [178, 276, 374, 472, 570, 668].map((x, i) => label(x, 151, `◯${i + 1}`, "font-size=\"11\"")).join("");
    return svg("0 0 730 166", `<g ${base}><rect x="5" y="10" width="102" height="135" fill="#fff"/><rect x="126" y="10" width="599" height="135" fill="#fff"/></g>${label(25, 24, "보기", "text-anchor=\"start\" font-size=\"11\"")}${motif(56, 84, 0, false)}${candidates}${nums}`);
  });

  Figures.register("u1-q16", function () {
    const cells = [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2]];
    const size = 52;
    const ox = 62;
    const oy = 8;
    const body = cells.map(([x, y]) => {
      const px = ox + x * size;
      const py = oy + y * size;
      return `<rect x="${px}" y="${py}" width="${size}" height="${size}" fill="#fff"/><line x1="${px}" y1="${py}" x2="${px + size}" y2="${py + size}"/><line x1="${px + size}" y1="${py}" x2="${px}" y2="${py + size}"/>`;
    }).join("");
    const cx = ox + size;
    const cy = oy + size;
    const shade = `<polygon points="${cx},${cy + size} ${cx + size / 2},${cy + size / 2} ${cx + size},${cy + size}" fill="${SHADE}" stroke="none"/>`;
    const centralLines = `<g ${base}><rect x="${cx}" y="${cy}" width="${size}" height="${size}"/><line x1="${cx}" y1="${cy}" x2="${cx + size}" y2="${cy + size}"/><line x1="${cx + size}" y1="${cy}" x2="${cx}" y2="${cy + size}"/></g>`;
    return svg("0 0 280 178", `<g ${base}>${body}</g>${shade}${centralLines}`);
  });

  Figures.register("u1-q18", function () {
    const front = [
      { x: 0, y: 0, h: 1 }, { x: 1, y: 0, h: 1 },
      { x: 0, y: 1, h: 3 }, { x: 1, y: 1, h: 2 }, { x: 2, y: 1, h: 1 }
    ];
    const all = front.concat([
      { x: 0, y: 2, h: 1 }, { x: 1, y: 2, h: 1 }, { x: 2, y: 2, h: 1 }
    ]);
    return svg("0 0 600 205", `${stackView(front, 145, 145, false)}${stackView(all, 445, 145, true)}${label(145, 195, "앞에서 본 모양")}${label(445, 195, "뒤에서 본 모양")}`);
  });

  Figures.register("u1-q19", function () {
    return svg("0 0 300 205", `<g ${base}>
      <circle cx="150" cy="72" r="58" fill="rgba(255,255,255,.86)"/>
      <circle cx="104" cy="124" r="58" fill="rgba(255,255,255,.68)"/>
      <circle cx="196" cy="124" r="58" fill="rgba(255,255,255,.50)"/>
    </g>
    ${label(150, 48, "8", "font-size=\"17\"")}${label(112, 92, "3", "font-size=\"17\"")}${label(150, 111, "2", "font-size=\"17\"")}${label(188, 92, "10", "font-size=\"17\"")}${label(79, 137, "㉠", "font-size=\"17\"")}${label(150, 157, "㉡", "font-size=\"17\"")}${label(219, 137, "6", "font-size=\"17\"")}`);
  });

  Figures.register("u1-q20", function () {
    return `<div class="rule-box" style="max-width:100%;position:relative;padding-top:1.8em;">
      <b style="position:absolute;left:50%;top:0;transform:translate(-50%,-50%);padding:.25em .9em;border:1px solid #555;background:#fff;">보기</b>
      <ul style="margin:0;padding-left:1.4em;display:grid;gap:.45em;">
        <li>넣은 수가 한 자리 수이면 그 수끼리 곱합니다.</li>
        <li>넣은 수가 두 자리 수이면 그 수의 각 자리 숫자를 모두 더합니다.</li>
      </ul>
    </div>`;
  });
})(window);
