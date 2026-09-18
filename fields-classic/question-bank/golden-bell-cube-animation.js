function escapeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

export function cubeSourceAnimation(item) {
  if (item.visual?.subtype !== "source-hidden-cube") return null;
  const geometry = globalThis.GW_GEN;
  if (!geometry?.countHiddenFromIsoView || !geometry?.mapTotal) throw new Error("Cube geometry is unavailable");
  const map = item.visual.map?.map((row) => [...row]);
  if (!map?.length || !map[0]?.length || map.some((row) => row.length !== map[0].length || row.some((height) => !Number.isInteger(height) || height < 0))) return null;
  const total = geometry.mapTotal(map);
  if (!total) return null;
  const hidden = geometry.countHiddenFromIsoView(map);
  const visible = total - hidden;
  if (item.visual.expected && Object.entries({ total, hidden, visible }).some(([key, value]) => item.visual.expected[key] !== value)) throw new Error("Cube source and geometry disagree");
  // Removing far rows/columns preserves the front/right occluders. Inclusion-exclusion
  // isolates one column's hidden count using the existing Geometry visibility engine.
  const suffixHidden = (x, z) => z >= map.length || x >= map[0].length ? 0 : geometry.countHiddenFromIsoView(map.slice(z).map((row) => row.slice(x)));
  const columns = map.flatMap((row, z) => row.flatMap((height, x) => height ? [{ x, z, height, hidden: suffixHidden(x, z) - suffixHidden(x + 1, z) - suffixHidden(x, z + 1) + suffixHidden(x + 1, z + 1) }] : []));
  if (columns.reduce((sum, column) => sum + column.hidden, 0) !== hidden) throw new Error("Cube column counts disagree");
  const conceptExample = item.conceptExample === true && item.id.startsWith("concept-example-");
  const beats = conceptExample ? [
    { id: "given", phase: "given", caption: "주어진 쌓기나무와 위에서 본 자리를 살펴봐요.", durationMs: 4200 },
    { id: "target", phase: "target", caption: "앞과 오른쪽의 나무에 가려질 수 있는 기둥을 표시해요.", durationMs: 4200 },
    { id: "transform", phase: "transform", caption: "기둥 높이를 모두 더하고, 그림에서 보이는 나무를 세어 뺄셈식을 만들어요.", durationMs: 4800 },
    { id: "verify", phase: "verify", caption: "숨은 수를 다시 더해 전체 수와 같은지 확인해요.", durationMs: 4400 }
  ] : [
    { id: "problem", phase: "problem", caption: "같은 그림을 보며 보이지 않는 쌓기나무를 찾아요.", durationMs: 4500 },
    ...columns.map((column, index) => ({ id: `column-${column.x}-${column.z}`, phase: "column", columnIndex: index, caption: `표시한 기둥은 ${column.height}층이에요. 윗면에 ${column.height}을 적어요.`, durationMs: 4000 })),
    { id: "total", phase: "total", caption: "바탕 그림에 옮겨 적은 층수를 모두 더해요.", durationMs: 5000 },
    { id: "visible", phase: "visible", caption: "그림에서 보이는 나무를 세어요. 한 나무의 두 면을 두 번 세지 않아요.", durationMs: 5000 },
    { id: "hidden", phase: "hidden", caption: "전체에서 보이는 수를 빼요. 윗면의 작은 수는 그 기둥에서 숨은 나무 수예요.", durationMs: 5500 },
    { id: "verify", phase: "verify", caption: "보이는 수와 숨은 수를 더해 전체 수가 되는지 확인해요.", durationMs: 4500 }
  ];
  return {
    kind: "source-animation",
    family: "cube-hidden-count",
    sourceItemId: item.id,
    conceptExample,
    title: "기둥마다 숨은 나무를 찾아요",
    problem: item.prompt,
    visual: item.visual,
    map,
    columns,
    total,
    visible,
    hidden,
    beats,
    printSteps: conceptExample ? beats.map((_, index) => index) : [columns.length, columns.length + 1, columns.length + 3, columns.length + 4]
  };
}

function renderConceptCubeFrame(experience, step, animate) {
  const safeStep = Math.max(0, Math.min(Number(step) || 0, experience.beats.length - 1));
  const frame = experience.beats[safeStep];
  const { map, columns } = experience;
  const renderer = globalThis.GW_RENDER;
  if (!renderer?.renderIso) throw new Error("Cube renderer is unavailable");
  const targets = columns.filter((column) => column.hidden > 0);
  const targetKeys = new Set(targets.map((column) => `${column.x}:${column.z}`));
  const labels = frame.phase === "transform"
    ? new Map(columns.map((column) => [`${column.x}:${column.z}`, column.height]))
    : frame.phase === "verify"
      ? new Map(columns.map((column) => [`${column.x}:${column.z}`, column.hidden]))
      : new Map();
  const markingTargets = frame.phase === "target";
  const svg = renderer.renderIso(map, map[0].length, map.length, {
    u: 30,
    topLabels: true,
    topLabelSize: 18,
    topLabelColor: frame.phase === "verify" ? "#9d3d45" : "#176984",
    topLabelFn: (height, x, z) => labels.get(`${x}:${z}`),
    colorFn: (x, y, z) => markingTargets && targetKeys.has(`${x}:${z}`) ? "white" : "grey"
  });
  const topView = `<div class="source-cube-map" style="--source-columns:${map[0].length}" aria-label="${frame.phase === "verify" ? "기둥마다 숨은 개수" : frame.phase === "transform" ? "위에서 본 기둥 높이" : "위에서 본 기둥 자리"}">${map.flatMap((row, z) => row.map((height, x) => {
    const key = `${x}:${z}`;
    const active = markingTargets && targetKeys.has(key);
    return `<span data-column="${key}" class="${height ? "filled" : "empty"} ${active ? "active" : ""}">${labels.get(key) ?? ""}</span>`;
  })).join("")}</div>`;
  const captions = {
    given: ["주어진 쌓기나무", "위에서 본 자리"],
    target: ["가려질 수 있는 기둥 표시", "확인할 자리 표시"],
    transform: ["윗면의 수: 기둥 높이", "기둥 높이 지도"],
    verify: ["윗면의 수: 숨은 개수", "기둥마다 숨은 개수"]
  };
  const equations = {
    given: "보이지 않는 쌓기나무는 몇 개일까요?",
    target: "표시한 기둥이 다른 기둥 뒤에 가려지는지 살펴봐요.",
    transform: `전체 ${experience.total}개 - 보이는 것 ${experience.visible}개 = ?`,
    verify: `<span class="source-animation-final-answer" data-answer-value="${experience.hidden}">${experience.total} - ${experience.visible} = ${experience.hidden}</span><span>${experience.visible} + ${experience.hidden} = ${experience.total}</span>`
  };
  return `<div class="source-animation-cube ${animate ? "is-animating" : ""}" data-source-item="${escapeText(experience.sourceItemId)}" data-concept-example="${escapeText(experience.sourceItemId)}" data-concept-stage="${frame.phase}"><div class="source-cube-model"><figure>${svg}<figcaption>${captions[frame.phase][0]}</figcaption></figure><figure>${topView}<figcaption>${captions[frame.phase][1]}</figcaption></figure></div><p class="source-animation-equation">${equations[frame.phase]}</p></div>`;
}

export function renderCubeSourceFrame(experience, step, { animate = false } = {}) {
  if (experience.conceptExample) return renderConceptCubeFrame(experience, step, animate);
  const frame = experience.beats[Math.max(0, Math.min(step, experience.beats.length - 1))];
  const { map, columns } = experience;
  const renderer = globalThis.GW_RENDER;
  if (!renderer?.renderIso) throw new Error("Cube renderer is unavailable");
  const hiddenPhase = frame.phase === "hidden" || frame.phase === "verify";
  const columnIndex = frame.phase === "problem" ? -1 : frame.phase === "column" ? frame.columnIndex : columns.length - 1;
  const active = frame.phase === "column" ? columns[columnIndex] : null;
  const labels = new Map(columns.slice(0, columnIndex + 1).map((column) => [`${column.x}:${column.z}`, hiddenPhase ? column.hidden : column.height]));
  const svg = renderer.renderIso(map, map[0].length, map.length, {
    u: 30, topLabels: true, topLabelSize: 18, topLabelColor: hiddenPhase ? "#9d3d45" : "#176984",
    topLabelFn: (height, x, z) => labels.get(`${x}:${z}`),
    colorFn: (x, y, z) => active && active.x === x && active.z === z ? "white" : "grey"
  });
  const topView = `<div class="source-cube-map" style="--source-columns:${map[0].length}" aria-label="${hiddenPhase ? "각 기둥에서 숨은 수" : "위에서 본 기둥의 층수"}">${map.flatMap((row, z) => row.map((height, x) => `<span data-column="${x}:${z}" class="${height ? "filled" : "empty"} ${active?.x === x && active?.z === z ? "active" : ""}">${labels.has(`${x}:${z}`) ? labels.get(`${x}:${z}`) : ""}</span>`)).join("")}</div>`;
  const equations = {
    problem: "보이지 않는 쌓기나무는 몇 개일까요?",
    column: active ? `${active.height}층` : "",
    total: `${columns.map((column) => column.height).join(" + ")} = ${experience.total}`,
    visible: `전체 ${experience.total}개 · 보이는 것 ${experience.visible}개`,
    hidden: `${experience.total} - ${experience.visible} = ${experience.hidden}`,
    verify: `${experience.visible} + ${experience.hidden} = ${experience.total}`
  };
  return `<div class="source-animation-cube ${animate ? "is-animating" : ""}" data-source-item="${escapeText(experience.sourceItemId)}" data-cube-phase="${frame.phase}"><div class="source-cube-model"><figure>${svg}<figcaption>${hiddenPhase ? "윗면의 수: 이 기둥에서 숨은 개수" : "윗면의 수: 기둥의 층수"}</figcaption></figure><figure>${topView}<figcaption>${hiddenPhase ? "기둥마다 숨은 개수" : "위에서 본 바탕 그림"}</figcaption></figure></div><p class="source-animation-equation">${equations[frame.phase]}</p></div>`;
}
