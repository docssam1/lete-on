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
  const beats = [
    { id: "problem", phase: "problem", caption: "같은 그림을 보며 보이지 않는 쌓기나무를 찾아요.", durationMs: 4500 },
    ...columns.map((column, index) => ({ id: `column-${column.x}-${column.z}`, phase: "column", columnIndex: index, caption: `표시한 기둥은 ${column.height}층이에요. 윗면에 ${column.height}을 적어요.`, durationMs: 4000 })),
    { id: "total", phase: "total", caption: "바탕 그림에 옮겨 적은 층수를 모두 더해요.", durationMs: 5000 },
    { id: "visible", phase: "visible", caption: "그림에서 보이는 나무를 세어요. 한 나무의 두 면을 두 번 세지 않아요.", durationMs: 5000 },
    { id: "hidden", phase: "hidden", caption: "전체에서 보이는 수를 빼요. 윗면의 작은 수는 그 기둥에서 숨은 나무 수예요.", durationMs: 5500 },
    { id: "verify", phase: "verify", caption: "보이는 수와 숨은 수를 더해 전체 수가 되는지 확인해요.", durationMs: 4500 }
  ];
  return { kind: "source-animation", family: "cube-hidden-count", sourceItemId: item.id, title: "기둥마다 숨은 나무를 찾아요", problem: item.prompt, visual: item.visual, map, columns, total, visible, hidden, beats, printSteps: [columns.length, columns.length + 1, columns.length + 3, columns.length + 4] };
}

export function renderCubeSourceFrame(experience, step, { animate = false } = {}) {
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
