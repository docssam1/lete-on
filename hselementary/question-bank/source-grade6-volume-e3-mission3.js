(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 부피 개념탐구 3 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u6-e3-mission-3";
  const generatorKey = "sourceGrade6VolumeE3Mission3";
  const pools = Object.freeze([
    // 원문 그림(인쇄 59쪽): 높이 20cm 기둥(폭 □) 다음 높이 10cm·폭 18cm 계단, 높이 6cm·폭 10cm 계단. 위에서부터 내려가는 높이 10, 4, 6. 밑면 폭 28+□.
    Object.freeze({ unknown: 7, drops: Object.freeze([10, 4, 6]), runs: Object.freeze([18, 10]), prismHeight: 12, volume: 4560 }),
    Object.freeze({ unknown: 4, drops: Object.freeze([5, 3, 8]), runs: Object.freeze([8, 14]), prismHeight: 10, volume: 2640 }),
    Object.freeze({ unknown: 5, drops: Object.freeze([7, 5, 12]), runs: Object.freeze([12, 16]), prismHeight: 15, volume: 7740 })
  ]);
  const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  const num = value => Number(value).toLocaleString("ko-KR");

  const facts = data => {
    const [drop1, drop2, drop3] = data.drops;
    const [run2, run3] = data.runs;
    const totalDrop = drop1 + drop2 + drop3;
    const baseWidth = data.unknown + run2 + run3;
    const strips = [
      { width: data.unknown, height: drop1 },
      { width: data.unknown + run2, height: drop2 },
      { width: baseWidth, height: drop3 }
    ];
    const baseArea = strips.reduce((sum, strip) => sum + strip.width * strip.height, 0);
    const candidates = [];
    for (let candidate = 1; candidate <= 100; candidate += 1) {
      const candidateArea = drop1 * candidate + drop2 * (candidate + run2) + drop3 * (candidate + run2 + run3);
      if (candidateArea * data.prismHeight === data.volume) candidates.push(candidate);
    }
    return { drop1, drop2, drop3, run2, run3, totalDrop, baseWidth, strips, baseArea, candidates };
  };

  const netSvg = (data, solved, poolIndex) => {
    const f = facts(data);
    // 원문 그림과 같은 순서: □, 20cm | 밑면 쪽 | 6cm, 10cm, 4cm, 18cm, 10cm (밑면 둘레를 오른쪽 아래 모서리부터 시계 반대 방향으로 펼침)
    const perimeterEdges = [data.unknown, f.totalDrop, f.baseWidth, f.drop3, f.run3, f.drop2, f.run2, f.drop1];
    const edgeRoles = ["unknown", "total-drop", "base", "drop-3", "run-3", "drop-2", "run-2", "drop-1"];
    const scale = Math.min(9, 600 / perimeterEdges.reduce((sum, value) => sum + value, 0));
    const stripX = 30;
    const stripY = 70 + f.totalDrop * scale;
    const stripHeight = data.prismHeight * scale;
    const attachIndex = 2;
    const attachX = stripX + perimeterEdges.slice(0, attachIndex).reduce((sum, value) => sum + value, 0) * scale;
    const point = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;
    const polygonPoints = [
      [attachX, stripY],
      [attachX, stripY - f.totalDrop * scale],
      [attachX + data.unknown * scale, stripY - f.totalDrop * scale],
      [attachX + data.unknown * scale, stripY - (f.totalDrop - f.drop1) * scale],
      [attachX + (data.unknown + f.run2) * scale, stripY - (f.totalDrop - f.drop1) * scale],
      [attachX + (data.unknown + f.run2) * scale, stripY - f.drop3 * scale],
      [attachX + f.baseWidth * scale, stripY - f.drop3 * scale],
      [attachX + f.baseWidth * scale, stripY]
    ];
    let cursor = stripX;
    const segments = [];
    const strip = perimeterEdges.map((length, index) => {
      const width = length * scale;
      segments.push({ x: cursor, width });
      const rect = `<rect class="source61-vs-e3-net-face ${index % 2 ? "source61-vs-e3-net-b" : "source61-vs-e3-net-a"}" x="${cursor.toFixed(1)}" y="${stripY.toFixed(1)}" width="${width.toFixed(1)}" height="${stripHeight.toFixed(1)}" data-lateral-edge="${index + 1}" data-edge-role="${edgeRoles[index]}"/>`;
      cursor += width;
      return rect;
    }).join("");
    const base = `<polygon class="source61-vs-e3-net-face source61-vs-e3-net-c" points="${polygonPoints.map(value => point(value[0], value[1])).join(" ")}" data-base-face="step-polygon"/>`;
    const secondBase = `<polygon class="source61-vs-e3-net-face source61-vs-e3-net-c${solved ? " is-solved" : ""}" points="${polygonPoints.map(value => point(value[0], 2 * stripY + stripHeight - value[1])).join(" ")}" data-base-face="second-step-polygon"/>`;
    const label = (x, y, text, cls = "source61-vs-e3-measure", anchor = "middle") => `<text class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" style="text-anchor:${anchor}">${esc(text)}</text>`;
    const verticalLabel = (x, y, text, cls = "source61-vs-e3-measure") => `<text class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" transform="rotate(-90 ${x.toFixed(1)} ${y.toFixed(1)})" style="text-anchor:middle">${esc(text)}</text>`;
    const segmentCenter = index => segments[index].x + segments[index].width / 2;
    const stripBottom = stripY + stripHeight;
    const topX = attachX + data.unknown * scale / 2;
    // 이름표 순서는 문제 그림 힌트 정책(이름표 순번 6, 8 제거)과 맞춥니다: 6번째·8번째는 원문에 없는 안내 이름표입니다.
    const labels = [
      label(topX, stripY - f.totalDrop * scale - 10, solved ? `${data.unknown}cm` : "□ cm", solved ? "source61-vs-e3-result-label" : "source61-vs-e3-measure"),
      verticalLabel(attachX - 12, stripY - f.totalDrop * scale / 2, `${f.totalDrop}cm`),
      label(segmentCenter(6), stripBottom + 22, `${f.run2}cm`),
      label(segmentCenter(4), stripBottom + 22, `${f.run3}cm`),
      label(segmentCenter(3), stripY - 8, `${f.drop3}cm`),
      label(segmentCenter(5), stripY - 8, `${f.drop2}cm`),
      label(78, 26, "옆면 높이", "source61-vs-e3-note"),
      `<line class="source61-vs-e3-dimension" x1="${(attachX - 14).toFixed(1)}" y1="${stripY.toFixed(1)}" x2="${(attachX - 14).toFixed(1)}" y2="${stripBottom.toFixed(1)}"/>`,
      verticalLabel(attachX - 22, stripY + stripHeight / 2, `${data.prismHeight}cm`)
    ].join("");
    const solvedText = solved
      ? `${label(560, 30, `밑넓이 ${num(f.baseArea)}cm²`, "source61-vs-e3-result-label")}${label(560, 52, `빈칸 ${data.unknown}cm`, "source61-vs-e3-result-label")}`
      : label(560, 30, "계단 밑면 2개", "source61-vs-e3-note");
    const height = Math.ceil(2 * stripY + stripHeight - 70 + 30);
    return `<svg class="geometry-diagram source61-vs-e3-diagram" viewBox="0 0 660 ${height}" role="img" aria-label="${solved ? "빈칸 길이를 표시한" : "빈칸 길이를 묻는"} 입체도형 전개도" data-source61-vs-e3-structure="step-prism-net-unknown-edge" data-source61-vs-e3-model="right-step-prism-net" data-phase="${solved ? "answer" : "problem"}" data-pool="${poolIndex}">${strip}${base}${secondBase}${labels}${solvedText}</svg>`;
  };

  const promptFor = (data, level) => {
    const guide = level === 0
      ? " 먼저 부피를 옆면의 높이로 나누어 밑넓이를 구하고, 계단 모양 밑면을 높이가 다른 세 직사각형으로 나누어 보세요."
      : level === 2
        ? " 전개도에 표시된 길이만 사용하여 빈칸에 알맞은 길이가 하나뿐임을 확인하세요."
        : "";
    return `다음 전개도를 접어서 만든 입체도형의 부피는 ${num(data.volume)}cm³입니다. □ 안에 알맞은 수를 구하세요.${guide}`;
  };

  const solutionFor = data => {
    const f = facts(data);
    const middleHeight = f.drop3 + f.drop2;
    return `전개도를 접으면 밑면이 계단 모양인 각기둥이 되고, 높이는 ${data.prismHeight}cm입니다. 밑넓이는 ${num(data.volume)}÷${data.prismHeight}=${num(f.baseArea)}cm²입니다. 밑면의 세 기둥의 높이는 ${f.totalDrop}cm, ${f.drop3}+${f.drop2}=${middleHeight}cm, ${f.drop3}cm이고 가로는 □cm, ${f.run2}cm, ${f.run3}cm입니다. 밑넓이는 ${f.totalDrop}×□+${middleHeight}×${f.run2}+${f.drop3}×${f.run3}=${f.totalDrop}×□+${middleHeight * f.run2 + f.drop3 * f.run3}이므로 ${f.totalDrop}×□=${num(f.baseArea)}-${middleHeight * f.run2 + f.drop3 * f.run3}=${num(f.baseArea - middleHeight * f.run2 - f.drop3 * f.run3)}, □=${data.unknown}입니다. 1cm부터 100cm까지 확인해도 조건을 만족하는 자연수는 ${data.unknown} 하나뿐입니다.`;
  };

  const markInventory = () => {
    const patch = item => Object.assign(item, {
      generatorKey,
      reviewLocked: false,
      reviewReason: "",
      answerVisualStatus: "verified",
      generationMode: "fixed-verified-pool",
      verifiedVariantTarget: 3,
      verifiedVariantCount: 3,
      verifiedVariantProvenance: ["source-values", "source-structure-variant", "source-structure-variant"]
    });
    const items = window.HSE_SOURCE_INVENTORY_GRADE6?.items;
    if (Array.isArray(items)) items.filter(item => item.sourceItemId === sourceItemId).forEach(patch);
    const semesters = window.HSE_CURRICULUM?.semesters || [];
    semesters.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []).filter(type => type.sourceItemId === sourceItemId).forEach(patch);
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => type?.sourceItemId === sourceItemId || type?.generatorKey === generatorKey ? generatorKey : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (type?.sourceItemId !== sourceItemId && type?.generatorKey !== generatorKey) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const poolIndex = ((Number(variant) || 0) % pools.length + pools.length) % pools.length;
    const data = pools[poolIndex];
    const f = facts(data);
    if (f.baseArea * data.prismHeight !== data.volume || f.candidates.length !== 1 || f.candidates[0] !== data.unknown) throw new Error(`${sourceItemId}: 단일 정답 검산에 실패했습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const evidence = `<span hidden data-source-item="${sourceItemId}" data-pool-index="${poolIndex}" data-values="${esc([data.unknown, ...data.drops, ...data.runs, data.prismHeight, data.volume].join(","))}" data-difficulty="${level}"></span>`;
    return {
      prompt: `${promptFor(data, level)}${netSvg(data, false, poolIndex)}${evidence}`,
      answer: `${data.unknown}cm`,
      solution: solutionFor(data),
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-vs-e3-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${netSvg(data, true, poolIndex)}<div class="solution-answer-caption">같은 전개도에서 밑넓이와 빈칸을 다시 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex,
      verifiedVariantCount: 3,
      sourceItemId,
      generator: generatorKey,
      variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant",
      difficultyDesign: ["guided", "source", "independent-reasoning"][level]
    };
  };
  markInventory();
})();
