import { domains, answerFor, areaOf } from "./core.js?v=area-1";

// All boards and the unit cue use the same 44 SVG-unit square.
// Intrinsic viewBoxes: whole 360x410, halves 360x500, compare 360x730, build 360x440.
const TILE = 44, LEFT = 48, TOP = 88;
const heights = { whole: 410, halves: 500, compare: 730, build: 440 };
const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const palette = [
  { fill: "#c7e7db", ink: "#165f50" },
  { fill: "#f5d4dc", ink: "#94334c" },
  { fill: "#f5e3ab", ink: "#77540a" },
  { fill: "#d5e3fa", ink: "#285a9b" }
];
const triangles = {
  nw: [[0, 0], [TILE, 0], [0, TILE]],
  ne: [[0, 0], [TILE, 0], [TILE, TILE]],
  se: [[TILE, 0], [TILE, TILE], [0, TILE]],
  sw: [[0, 0], [TILE, TILE], [0, TILE]]
};
const text = {
  ko: {
    cue: ["한 칸의 넓이를 1로 봅니다."],
    cell: (x, y) => `${y + 1}행 ${x + 1}열 온칸`,
    half: (x, y) => `${y + 1}행 ${x + 1}열 반칸`,
    active: "선택한 반칸", pair: n => `${n}번 짝`,
    tray: "반칸 둘을 모아 온칸 하나", area: n => `넓이: ${n}`,
    board: name => `도형 ${name}`, compare: "A의 넓이와 B의 넓이",
    example: ["가능한 정답의 한 예", "다른 모양도 정답이 될 수 있습니다."],
    drawing: ["그린 도형", "조건에 맞는 다른 모양도 정답입니다."]
  },
  en: {
    cue: ["The area of one square", "is 1 unit."],
    cell: (x, y) => `Whole square, row ${y + 1}, column ${x + 1}`,
    half: (x, y) => `Half square, row ${y + 1}, column ${x + 1}`,
    active: "Selected half square", pair: n => `Pair ${n}`,
    tray: "Two halves make one whole square", area: n => `Area: ${n}`,
    board: name => `Shape ${name}`, compare: "Area of A compared with area of B",
    example: ["One possible answer", "Other shapes can also be correct."],
    drawing: ["Your shape", "Other shapes can also meet the target."]
  },
  zh: {
    cue: ["把一个方格的面积看作1。"],
    cell: (x, y) => `第${y + 1}行第${x + 1}列的整格`,
    half: (x, y) => `第${y + 1}行第${x + 1}列的半格`,
    active: "已选半格", pair: n => `第${n}组`,
    tray: "两个半格拼成一个整格", area: n => `面积：${n}`,
    board: name => `图形${name}`, compare: "比较A的面积与B的面积",
    example: ["一个可能的答案", "其他形状也可能正确。"],
    drawing: ["你画的图形", "满足条件的其他形状也正确。"]
  },
  ja: {
    cue: ["ひとますの面積を", "1とします。"],
    cell: (x, y) => `${y + 1}行${x + 1}列のます`,
    half: (x, y) => `${y + 1}行${x + 1}列の半ます`,
    active: "選んだ半ます", pair: n => `${n}組目`,
    tray: "半ます二つで、ひとます分", area: n => `面積：${n}`,
    board: name => `図形${name}`, compare: "Aの面積をBの面積と比較",
    example: ["正解になる形の一例", "ほかの形も正解になります。"],
    drawing: ["作った図形", "条件に合うほかの形も正解です。"]
  }
};

function label(value, x, y, attrs = "") {
  return `<text x="${x}" y="${y}" text-anchor="middle" pointer-events="none" ${attrs}>${escape(value)}</text>`;
}
const points = part => triangles[part].map(point => point.join(",")).join(" ");
const center = part => triangles[part].reduce((sum, point) => [sum[0] + point[0] / 3, sum[1] + point[1] / 3], [0, 0]);
const coordKey = point => point.join(",");
function cleanCoords(value) {
  return Array.isArray(value) ? value.filter(point => Array.isArray(point) && point.length === 2 && point.every(n => Number.isInteger(n) && n >= 0 && n < 6)) : [];
}
function button(interactive, attr, value, description, pressed) {
  return interactive ? ` ${attr}="${escape(value)}" role="button" tabindex="0" aria-label="${escape(description)}" aria-pressed="${pressed}"` : "";
}
function board(top, name) {
  let svg = `<g data-grid="${name}" aria-hidden="true"><rect x="${LEFT}" y="${top}" width="264" height="264" fill="#ffffff" stroke="#8f9b97" stroke-width="1"/>`;
  for (let i = 1; i < 6; i++) {
    svg += `<path d="M${LEFT + i * TILE} ${top}v264 M${LEFT} ${top + i * TILE}h264" fill="none" stroke="#d6dedb" stroke-width="0.8"/>`;
  }
  return `${svg}</g>`;
}

function matchingPairs(p, requested, reveal) {
  const halfIndices = p.cells.flatMap((cell, index) => cell.part === "full" ? [] : [index]);
  const candidates = Array.isArray(requested) ? requested : [];
  const used = new Set(), pairs = [];
  for (const pair of candidates) {
    if (!Array.isArray(pair) || pair.length !== 2 || pair[0] === pair[1] ||
        !pair.every(index => Number.isInteger(index) && halfIndices.includes(index) && !used.has(index))) continue;
    pairs.push([...pair]);
    pair.forEach(index => used.add(index));
  }
  if (reveal) {
    const remaining = halfIndices.filter(index => !used.has(index));
    for (let i = 0; i + 1 < remaining.length; i += 2) pairs.push(remaining.slice(i, i + 2));
  }
  return pairs;
}

function halfTray(p, pairs, t) {
  if (!pairs.length) return "";
  let svg = label(t.tray, 180, 385, 'font-size="14" font-weight="600"');
  pairs.forEach((pair, index) => {
    const { fill, ink } = palette[index], x = 38 + index * 80;
    svg += `<g data-pair-tray="${index + 1}" transform="translate(${x} 405)" role="group" aria-label="${escape(t.pair(index + 1))}">`;
    pair.forEach((sourceIndex, slot) => {
      const part = p.cells[sourceIndex].part;
      // Rigid rotation sends either original half to NW or SE; area is unchanged.
      const angle = (slot * 2 - ["nw", "ne", "se", "sw"].indexOf(part)) * 90;
      svg += `<g data-source-half="${sourceIndex}" transform="rotate(${angle} 22 22)"><polygon data-pair-piece="${index + 1}" points="${points(part)}" fill="${fill}" stroke="${ink}" stroke-width="1.2"/></g>`;
    });
    svg += label(index + 1, TILE / 3, TILE / 3 + 4, `font-size="12" font-weight="700" fill="${ink}"`);
    svg += label(index + 1, TILE * 2 / 3, TILE * 2 / 3 + 4, `font-size="12" font-weight="700" fill="${ink}"`);
    svg += "</g>";
  });
  return svg;
}

export function renderProblem(p, options = {}) {
  if (!Object.hasOwn(heights, p?.domain)) throw new RangeError("Unknown unit-area domain");
  const lang = Object.hasOwn(text, options.lang) ? options.lang : "ko";
  const t = text[lang], height = heights[p.domain], interactive = options.interactive === true;
  const reveal = options.reveal === true;
  const title = domains.find(domain => domain.id === p.domain).names[lang];
  const cue = t.cue.join(" ");
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" class="ua-diagram" lang="${lang}" xml:lang="${lang}" viewBox="0 0 360 ${height}" width="360" height="${height}" role="${interactive ? "group" : "img"}" aria-label="${escape(title)}" font-family="Arial, 'Malgun Gothic', 'Yu Gothic', 'Microsoft YaHei', sans-serif" font-size="15" fill="#253b33" style="display:block;width:100%;max-width:360px;height:auto;background:#fff">`;
  svg += `<title>${escape(title)}</title><desc>${escape(cue)}</desc>`;
  svg += '<style>.ua-diagram [role="button"]{cursor:pointer}.ua-diagram [role="button"]:focus{outline:none}.ua-diagram [role="button"]:focus,.ua-diagram [role="button"]:focus [data-part]{stroke:#151d19;stroke-width:3.5;stroke-dasharray:4 2}.ua-diagram text{letter-spacing:0}</style>';
  svg += `<g data-unit-cue="true" role="group" aria-label="${escape(cue)}"><rect x="20" y="18" width="44" height="44" fill="#f1f4f2" stroke="#53695e" stroke-width="1.5"/>${label("1", 42, 46, 'font-size="19" font-weight="700"')}`;
  t.cue.forEach((line, index) => { svg += `<text x="78" y="${t.cue.length === 1 ? 44 : 35 + index * 20}" font-size="14" pointer-events="none">${escape(line)}</text>`; });
  svg += "</g>";

  if (p.domain === "compare") {
    [p.left, p.right].forEach((cells, boardIndex) => {
      const name = boardIndex === 0 ? "A" : "B", top = boardIndex === 0 ? 108 : 414;
      const color = palette[boardIndex];
      svg += label(t.board(name), 180, top - 16, `font-size="17" font-weight="700" fill="${color.ink}"`);
      svg += board(top, name);
      cells.forEach((cell, index) => {
        const x = options.aligned ? index % 6 : cell.x, y = options.aligned ? Math.floor(index / 6) : cell.y;
        svg += `<g data-piece="${name}-${index}" data-piece-index="${index}" data-board="${name}" transform="translate(${LEFT + x * TILE} ${top + y * TILE})"><rect width="44" height="44" fill="${color.fill}" stroke="${color.ink}" stroke-width="1.2"/></g>`;
      });
    });
    svg += label(reveal ? `A: ${areaOf(p.left)}  ${escapeSign(answerFor(p))}  B: ${areaOf(p.right)}` : t.compare, 180, 711, `font-size="${reveal ? 18 : 14}"${reveal ? ' data-answer="true" font-weight="700"' : ""}`);
  } else if (p.domain === "build") {
    const selection = cleanCoords(options.selectedCells);
    const visible = reveal && !selection.length ? p.example : selection;
    const chosen = new Set(visible.map(coordKey));
    svg += board(TOP, "drawing");
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
      const selected = chosen.has(`${x},${y}`);
      svg += `<rect data-drawing-square="${x},${y}" x="${LEFT + x * TILE}" y="${TOP + y * TILE}" width="44" height="44" fill="${selected ? palette[0].fill : "transparent"}" stroke="${selected ? palette[0].ink : "#cbd6d0"}" stroke-width="1"${button(interactive, "data-cell", `${x},${y}`, t.cell(x, y), selected)}/>`;
    }
    if (reveal) {
      (selection.length ? t.drawing : t.example).forEach((line, index) => { svg += label(line, 180, 384 + index * 22, `font-size="${index ? 14 : 16}"${index ? "" : ' font-weight="700"'} data-answer="true"`); });
    }
  } else {
    const pairs = p.domain === "halves" ? matchingPairs(p, options.pairs, reveal) : [];
    const pairOf = new Map(pairs.flatMap((pair, index) => pair.map(half => [half, index])));
    const marks = [...new Set(cleanCoords(options.markedCells).map(coordKey))].filter(key => p.cells.some(cell => cell.part === "full" && `${cell.x},${cell.y}` === key));
    svg += board(TOP, "shape");
    p.cells.forEach((cell, index) => {
      const { x, y, part } = cell, pairIndex = pairOf.get(index), color = palette[pairIndex ?? 0];
      const isHalf = part !== "full", active = isHalf && options.activeHalf === index;
      const mark = marks.indexOf(`${x},${y}`), paired = pairIndex !== undefined;
      const description = `${isHalf ? t.half(x, y) : t.cell(x, y)}${paired ? `, ${t.pair(pairIndex + 1)}` : ""}${active ? `, ${t.active}` : ""}`;
      svg += `<g data-piece-index="${index}" transform="translate(${LEFT + x * TILE} ${TOP + y * TILE})"${isHalf ? button(interactive, "data-half", index, description, active || paired) : ""}>`;
      const attrs = `fill="${color.fill}" stroke="${active ? "#a95400" : color.ink}" stroke-width="${active ? 3.5 : 1.2}"${paired ? ` data-pair="${pairIndex + 1}"` : ""}${active ? ' data-active-half="true"' : ""}`;
      if (isHalf) {
        if (interactive) svg += '<rect data-half-hitbox="true" width="44" height="44" fill="transparent" stroke="none" pointer-events="all"/>';
        svg += `<polygon data-part="${part}" points="${points(part)}" ${attrs} pointer-events="none"/>`;
      } else svg += `<rect width="44" height="44" ${attrs}${button(interactive && p.domain === "whole", "data-cell", `${x},${y}`, description, mark >= 0)}/>`;
      if (paired) {
        const [cx, cy] = center(part);
        svg += label(pairIndex + 1, cx, cy + 4, `data-pair-badge="${pairIndex + 1}" font-size="12" font-weight="700" fill="${color.ink}"`);
      } else if (!isHalf && mark >= 0) {
        svg += `<circle cx="22" cy="22" r="13" fill="#fff" stroke="${color.ink}" stroke-width="1" pointer-events="none"/>`;
        svg += label(mark + 1, 22, 27, `data-count-mark="true" font-size="14" font-weight="700" fill="${color.ink}"`);
      }
      svg += "</g>";
    });
    if (p.domain === "halves") svg += halfTray(p, pairs, t);
    if (reveal) {
      const full = p.cells.filter(cell => cell.part === "full").length;
      const answer = p.domain === "halves" ? `${full} + ${(p.cells.length - full) / 2} = ${answerFor(p)}` : t.area(answerFor(p));
      svg += label(answer, 180, p.domain === "halves" ? 481 : 389, 'data-answer="true" font-size="19" font-weight="700"');
    }
  }
  return `${svg}</svg>`;
}

function escapeSign(answer) { return { less: "<", equal: "=", greater: ">" }[answer]; }
