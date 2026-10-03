(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("높이표 생성기에는 HSE_GENERATORS가 필요합니다.");
  const check = (value, message) => { if (!value) throw new Error(message); };
  const freeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const areaText = value => `<span class="math-inline-expression">${value}cm²</span>`;
  function validate(h) {
    check(Array.isArray(h) && h.length >= 2 && h.length <= 6, "높이표의 행 수가 올바르지 않습니다.");
    check(h.every(row => Array.isArray(row) && row.length === h[0].length && row.length >= 2 && row.length <= 6 && row.every(n => Number.isSafeInteger(n) && n >= 0 && n <= 6)), "높이표의 칸과 높이가 올바르지 않습니다.");
    check(h.flat().some(Boolean), "쌓기나무가 필요합니다.");
  }
  const total = h => h.flat().reduce((s, n) => s + n, 0);
  function views(h) {
    validate(h);
    // Row indices increase toward the front, opposite the world y axis.
    const front = h[0].map((_, x) => Math.max(...h.map(row => row[x])));
    const left = h.map(row => Math.max(...row));
    return { front, back: [...front].reverse(), left, right: [...left].reverse() };
  }
  function exposed(h, bottom = false) {
    validate(h);
    const at = (y, x) => h[y]?.[x] || 0;
    const front = h[0].map(() => 0), back = [...front];
    const left = h.map(() => 0), right = [...left];
    let top = 0;
    h.forEach((row, y) => row.forEach((v, x) => {
      if (v) top++;
      front[x] += Math.max(v - at(y + 1, x), 0);
      back[x] += Math.max(v - at(y - 1, x), 0);
      left[y] += Math.max(v - at(y, x - 1), 0);
      right[y] += Math.max(v - at(y, x + 1), 0);
    }));
    return { top, bottom: bottom ? top : 0, front, back, left, right,
      area: top * (bottom ? 2 : 1) + [...front, ...back, ...left, ...right].reduce((s, n) => s + n, 0) };
  }
  const svg = (id, phase, body, w, height, label) => `<svg class="geometry-diagram source62-height" data-renderer="source62-height-views" data-source-item="${id}" data-phase="${phase}" width="${w}" height="${height}" viewBox="0 0 ${w} ${height}" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const text = (x, y, value, owner, extra = "") => `<text x="${x}" y="${y}" dominant-baseline="middle" data-owner-id="${owner}" ${extra}>${esc(value)}</text>`;
  function heightChart(h, id, phase, hidden = null, directions = false) {
    const c = 32, cols = h[0].length, rows = h.length, left = directions ? 68 : 20, top = directions ? 40 : 20;
    const width = left * 2 + cols * c, height = top * 2 + rows * c;
    const cells = h.map((row, y) => row.map((v, x) => v ? `<rect data-owner-id="cell-${y}-${x}" x="${left + x * c}" y="${top + y * c}" width="${c}" height="${c}" class="height-cell"/>${text(left + (x + .5) * c, top + (y + .5) * c, hidden?.[0] === y && hidden?.[1] === x ? "□" : v, `cell-${y}-${x}`)}` : "").join("")).join("");
    const lines = Array.from({ length: cols + 1 }, (_, x) => `<line class="height-grid" x1="${left + x * c}" y1="${top}" x2="${left + x * c}" y2="${top + rows * c}"/>`).join("") + Array.from({ length: rows + 1 }, (_, y) => `<line class="height-grid" x1="${left}" y1="${top + y * c}" x2="${left + cols * c}" y2="${top + y * c}"/>`).join("");
    const labels = directions ? `${text(width / 2, 18, "뒤쪽", "back")}${text(width / 2, height - 18, "앞쪽", "front")}${text(31, height / 2, "왼쪽", "left")}${text(width - 31, height / 2, "오른쪽", "right")}` : "";
    return svg(id, phase, cells + lines + labels, width, height, directions ? "앞쪽이 아래에 표시된 바닥 칸별 높이표" : "칸마다 쌓인 쌓기나무 수를 적은 위에서 본 그림");
  }
  function profile(values, label, id, phase, empty = false, rows = null, columns = values.length) {
    const c = 27, n = rows || Math.max(...values), left = 18 + (columns - values.length) * c / 2, top = 14, width = columns * c + 36, height = n * c + 54;
    const cells = empty ? "" : values.map((v, x) => Array.from({ length: v }, (_, z) => `<rect class="height-answer-cell" data-owner-id="${label}-${x}-${z}" x="${left + x * c}" y="${top + (n - z - 1) * c}" width="${c}" height="${c}"/>`).join("")).join("");
    const lines = Array.from({ length: values.length + 1 }, (_, x) => `<line class="height-grid" x1="${left + x * c}" y1="${top}" x2="${left + x * c}" y2="${top + n * c}"/>`).join("") + Array.from({ length: n + 1 }, (_, y) => `<line class="height-grid" x1="${left}" y1="${top + y * c}" x2="${left + values.length * c}" y2="${top + y * c}"/>`).join("");
    return svg(id, phase, cells + lines + text(width / 2, height - 18, label, label), width, height, `${label} 모양을 그리는 격자`);
  }
  const group = body => `<div class="source62-height-panels">${body}</div>`;
  const sum = values => values.reduce((s, n) => s + n, 0);
  function areaAnswer(h, id) {
    const f = exposed(h);
    const panels = [[h.flat().filter(Boolean).map(() => 1), "윗면"], [f.front, "앞쪽"], [f.back, "뒤쪽"], [f.left, "왼쪽"], [f.right, "오른쪽"]];
    const columns = Math.max(...panels.map(([values]) => values.length));
    const rows = Math.max(...panels.flatMap(([values]) => values));
    return `<div class="source62-face-account" aria-label="방향별 겉면을 같은 넓이의 칸으로 모아 센 그림">${panels.map(([v, label]) => `<figure>${profile(v, label, id, "answer", false, rows, columns)}<figcaption>${label === "윗면" ? "윗면" : `${label}을 향한 면`} ${areaText(sum(v))}</figcaption></figure>`).join("")}</div>`;
  }
  const id1 = "6-2-u3-e1-exploration", id2 = "6-2-u3-e1-example-3";
  const definitions = freeze([
    { sourceItemId: id1, key: "sourceGrade6SecondSpaceE1HeightViews", kind: "four-views", steps: [2, 4, 5],
      pools: [
        [[0,0,0,0,0,0],[0,0,1,0,0,0],[0,2,3,4,1,0],[1,1,2,2,0,0],[0,0,0,1,0,0],[0,0,0,0,0,0]],
        [[0,1,0,0],[2,3,4,0],[1,2,1,2],[0,0,1,0]],
        [[0,0,1,0],[1,4,3,2],[0,2,2,1],[0,0,1,0]]
      ] },
    { sourceItemId: id2, key: "sourceGrade6SecondSpaceE1ExposedArea", kind: "surface-without-bottom", steps: [1, 3, 4],
      pools: [[[1,3,3],[2,1,2]], [[2,4,2],[1,2,3]], [[3,2,4],[1,3,2]]] }
  ]);
  function build(definition, pool, level) {
    const h = definition.pools[pool].map(row => [...row]);
    validate(h);
    const id = definition.sourceItemId;
    let hidden = null;
    if (level === 2) {
      const maximum = Math.max(...h.flat());
      h.forEach((row, y) => row.forEach((v, x) => { if (!hidden && v === maximum) hidden = [y, x]; }));
    }
    const missingCondition = hidden ? ` 사용한 쌓기나무는 모두 ${total(h)}개입니다.` : "";
    const hiddenStep = hidden ? `□에 쌓인 수는 전체 ${total(h)}개에서 나머지 칸의 ${total(h) - h[hidden[0]][hidden[1]]}개를 빼면 ${h[hidden[0]][hidden[1]]}개입니다. ` : "";
    if (definition.kind === "four-views") {
      const v = views(h), names = { front: "앞쪽", back: "뒤쪽", left: "왼쪽", right: "오른쪽" };
      const known = level === 0 ? "front" : null;
      const grids = Object.entries(v).map(([direction, values]) => profile(values, names[direction], id, "problem", direction !== known, Math.max(...h.flat()))).join("");
      const answer = "그림 참조";
      return { prompt: `그림의 수는 각 칸에 쌓은 쌓기나무의 개수입니다.${missingCondition} 앞쪽, 뒤쪽, 왼쪽, 오른쪽에서 본 모양을 각각 그리세요.${heightChart(h, id, "problem", hidden, true)}${group(grids)}`,
        answer, solution: `${hiddenStep}같은 방향으로 겹치는 칸 중 가장 높은 칸까지 보입니다. 뒤쪽은 앞쪽의 좌우가 바뀌고, 오른쪽은 왼쪽의 좌우가 바뀝니다.`,
        answerVisual: group(Object.entries(v).map(([direction, values]) => profile(values, names[direction], id, "answer")).join("")),
        model: { heights: h, hidden, total: total(h), views: v }, design: ["front-view-scaffold", "source-four-directions", "missing-height-and-four-directions"][level] };
    }
    const f = exposed(h), sides = f.area - f.top;
    const hint = level === 0 ? ` 보이는 옆면의 넓이의 합은 ${areaText(sides)}입니다.` : "";
    return { prompt: `한 모서리가 1cm인 쌓기나무를 그림과 같이 쌓았습니다. 수는 각 칸에 쌓은 쌓기나무의 개수입니다.${missingCondition}${hint} 밑면을 제외하고 겉에 드러난 면의 넓이를 구하세요.${heightChart(h, id, "problem", hidden)}`,
      answer: `${f.area}cm²`, solution: `${hiddenStep}윗면은 ${areaText(f.top)}입니다. 앞쪽, 뒤쪽, 왼쪽, 오른쪽을 향한 면은 각각 ${[f.front,f.back,f.left,f.right].map(v=>areaText(sum(v))).join(", ")}입니다. 모두 더하면 ${areaText(f.area)}입니다. 밑면은 더하지 않습니다.`,
      answerVisual: areaAnswer(h, id), model: { heights: h, hidden, total: total(h), faces: f }, design: ["side-area-given", "source-bottom-excluded", "missing-height-and-exposed-area"][level] };
  }
  const previousKey = api.generatorKey, previousGenerate = api.generate;
  const resolve = type => definitions.find(d => type?.sourceItemId === d.sourceItemId || type?.generatorKey === d.key);
  api.generatorKey = type => { const d = resolve(type); return d ? type.reviewLocked ? "" : d.key : previousKey(type); };
  api.generate = (type, rank, offset, seed, variant = 0) => {
    const d = resolve(type);
    if (!d) return previousGenerate(type, rank, offset, seed, variant);
    if (type.reviewLocked) return null;
    check(Number.isSafeInteger(variant) && variant >= 0, "고정 변형 번호는 영 이상의 안전한 정수여야 합니다.");
    offset ??= 0;
    check([-1,0,1].includes(offset), "난이도는 -1, 0, +1이어야 합니다.");
    const level = offset + 1, pool = variant % 3, item = build(d, pool, level);
    return { ...item, sourceItemId: d.sourceItemId, generator: d.key,
      answerVisual: `<div data-answer-source="${d.sourceItemId}" data-print-weight="compact">${item.answerVisual}</div>`,
      generationMode: "fixed-verified-pool", verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedPoolIndex: pool,
      verifiedVariantId: `${d.sourceItemId}:v${pool}`, variantProvenance: pool === 0 && level === 1 ? "source-values" : "source-structure-variant",
      difficultyLevel: level, difficultyRank: level, difficultyOffset: offset, levelRank: rank, sourceDifficultyRank: 1,
      difficultyDesign: item.design, reasoningSteps: d.steps[level], sourceStepCount: d.steps[1], difficultyStepDelta: d.steps[level] - d.steps[1],
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, model: freeze(item.model) };
  };
  for (const d of definitions) if (!api.names.includes(d.key)) api.names.push(d.key);
  window.HSE_SOURCE_GRADE6_HEIGHT_VIEWS = freeze({ definitions, views, exposed, registrationOnly: true });
  if (typeof module !== "undefined") module.exports = window.HSE_SOURCE_GRADE6_HEIGHT_VIEWS;
})();
