(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 개념탐구 2 예제 2 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e2-example-2";
  const generatorKey = "sourceGrade6DecimalDivisionE2Example2";
  const pools = Object.freeze([
    Object.freeze({ side: 2.4 }),
    Object.freeze({ side: 3.6 }),
    Object.freeze({ side: 4.2 })
  ]);
  const fmt = value => Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  const poolIndexForSeed = seed => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % pools.length;
  };
  const facts = data => {
    const leftParallel = Math.round(data.side / 6 * 100) / 100;
    const rightParallel = Math.round(data.side / 3 * 100) / 100;
    const areaByTrapezoid = Math.round((leftParallel + rightParallel) * data.side / 2 * 100) / 100;
    const areaBySquareRatio = Math.round(data.side * data.side / 4 * 100) / 100;
    const candidates = [areaByTrapezoid, areaBySquareRatio].filter((value, index, all) => all.indexOf(value) === index);
    return { leftParallel, rightParallel, areaByTrapezoid, areaBySquareRatio, candidates };
  };
  const model = () => {
    const x0 = 80, y0 = 70, side = 125;
    const A = { x: x0, y: y0 };
    const G = { x: x0 + side, y: y0 + side / 3 };
    const N = { x: x0 + side, y: y0 + side / 2 };
    const D = { x: x0 + side * 2, y: y0 + side };
    const R = { x: x0 + side * 2, y: y0 + side * 2 / 3 };
    const lowerEnd = D;
    const upperEnd = { x: x0 + side * 3, y: y0 + side };
    return { x0, y0, side, A, G, N, D, R, lowerEnd, upperEnd };
  };
  const pointText = point => `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
  const svg = (data, solved, poolIndex) => {
    const m = model();
    const f = facts(data);
    const points = `A:${pointText(m.A)};G:${pointText(m.G)};N:${pointText(m.N)};D:${pointText(m.D)};R:${pointText(m.R)};L:${pointText(m.lowerEnd)};U:${pointText(m.upperEnd)}`;
    const targetPoints = [m.G, m.N, m.D, m.R].map(pointText).join(" ");
    const labels = [
      ["ㄱ", m.G.x - 13, m.G.y - 12],
      ["ㄴ", m.N.x - 13, m.N.y + 14],
      ["ㄷ", m.D.x + 15, m.D.y - 11],
      ["ㄹ", m.R.x + 15, m.R.y - 7]
    ].map(([label, x, y]) => `<text class="source61-e2ex2-point-label" x="${x}" y="${y}">${label}</text>`).join("");
    const topDimensions = [0, 1, 2].map(index => {
      const left = m.x0 + index * m.side;
      return `<path class="source61-e2ex2-dimension" d="M${left},52 H${left + m.side} M${left},47 V57 M${left + m.side},47 V57"/><text class="source61-e2ex2-measure" x="${left + m.side / 2}" y="34">${fmt(data.side)}cm</text>`;
    }).join("");
    const answerLayer = solved
      ? `<text class="source61-e2ex2-result" x="250" y="238">사각형 ㄱㄴㄷㄹ의 넓이 ${fmt(f.areaByTrapezoid)}cm²</text>`
      : "";
    return `<svg class="geometry-diagram source61-e2ex2-diagram ${solved ? "is-solved" : ""}" viewBox="0 0 500 260" role="img" aria-label="정사각형 세 개와 두 선분으로 만든 사각형 ㄱㄴㄷㄹ" data-source61-e2ex2-model="three-joined-squares-two-segments" data-source61-e2ex2-phase="${solved ? "answer" : "problem"}" data-source61-e2ex2-points="${points}" data-target-order="G-N-D-R" data-source61-e2ex2-side="${data.side}" data-source61-e2ex2-area="${f.areaByTrapezoid}" data-pool="${poolIndex}">
      <rect class="source61-e2ex2-square-strip" x="${m.x0}" y="${m.y0}" width="${m.side * 3}" height="${m.side}"/>
      <path class="source61-e2ex2-divider" d="M${m.x0 + m.side},${m.y0} V${m.y0 + m.side} M${m.x0 + m.side * 2},${m.y0} V${m.y0 + m.side}"/>
      <polygon class="source61-e2ex2-target ${solved ? "is-solved" : ""}" points="${targetPoints}"/>
      <path class="source61-e2ex2-segment" d="M${pointText(m.A)} L${pointText(m.upperEnd)} M${pointText(m.A)} L${pointText(m.lowerEnd)}"/>
      ${topDimensions}
      <path class="source61-e2ex2-dimension" d="M62,${m.y0} V${m.y0 + m.side} M57,${m.y0} H67 M57,${m.y0 + m.side} H67"/>
      <text class="source61-e2ex2-measure" x="35" y="${m.y0 + m.side / 2}">${fmt(data.side)}cm</text>
      ${labels}${answerLayer}
    </svg>`;
  };
  const mathBoard = (data, f) => `<div class="source61-math-board source61-e2ex2-board"><strong>평행한 두 변을 구해 확인</strong><div class="source61-math-row"><span>ㄱㄴ</span><b>${fmt(data.side)}÷6=${fmt(f.leftParallel)}cm</b></div><div class="source61-math-row"><span>ㄹㄷ</span><b>${fmt(data.side)}÷3=${fmt(f.rightParallel)}cm</b></div><div class="source61-math-row"><span>넓이</span><b>(${fmt(f.leftParallel)}+${fmt(f.rightParallel)})×${fmt(data.side)}÷2=${fmt(f.areaByTrapezoid)}cm²</b></div></div>`;

  const markInventory = () => {
    const patch = item => Object.assign(item, {
      generatorKey, reviewLocked: false, reviewReason: "", answerVisualStatus: "verified",
      generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      verifiedVariantProvenance: ["source-values", "source-structure-variant", "source-structure-variant"], variant: 0
    });
    if (Array.isArray(window.HSE_SOURCE_INVENTORY_GRADE6?.items)) window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(item => item.sourceItemId === sourceItemId).forEach(patch);
    const semesters = window.HSE_CURRICULUM?.semesters || [];
    semesters.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []).filter(type => type.sourceItemId === sourceItemId).forEach(patch);
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => type?.sourceItemId === sourceItemId || type?.generatorKey === generatorKey ? generatorKey : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (type?.sourceItemId !== sourceItemId && type?.generatorKey !== generatorKey) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const poolIndex = poolIndexForSeed(seed);
    const data = pools[poolIndex];
    const f = facts(data);
    if (f.candidates.length !== 1 || f.areaByTrapezoid !== f.areaBySquareRatio) throw new Error(`${sourceItemId}: 두 독립 계산의 답이 하나로 일치하지 않습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0
      ? `<p class="question-step" data-step-evidence="guided">두 선분이 첫째와 둘째 세로선에서 만나는 높이를 먼저 구해 보세요.</p>`
      : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">사각형 ㄱㄴㄷㄹ의 평행한 두 변의 길이가 어떻게 정해지는지 그림을 이용해 설명해 보세요.</p>` : "";
    const difficultyDesign = ["guided", "source", "independent-reasoning"][level];
    const evidence = `<span hidden data-source61-e2ex2-kind="three-square-intersection-quadrilateral" data-source-item="${sourceItemId}" data-values="${[data.side, f.leftParallel, f.rightParallel, f.areaByTrapezoid].join(",")}" data-difficulty-design="${difficultyDesign}"></span>`;
    return {
      prompt: `한 변이 ${fmt(data.side)}cm인 정사각형 3개를 겹치지 않게 이어 붙였습니다. 그림의 사각형 ㄱㄴㄷㄹ의 넓이를 구하세요.${svg(data, false, poolIndex)}${extra}${evidence}`,
      answer: `${fmt(f.areaByTrapezoid)}cm²`,
      solution: `ㄱㄴ은 ${fmt(data.side)}÷6=${fmt(f.leftParallel)}cm이고, ㄹㄷ은 ${fmt(data.side)}÷3=${fmt(f.rightParallel)}cm입니다. 두 변 사이의 거리는 ${fmt(data.side)}cm이므로 사각형 ㄱㄴㄷㄹ의 넓이는 (${fmt(f.leftParallel)}+${fmt(f.rightParallel)})×${fmt(data.side)}÷2=${fmt(f.areaByTrapezoid)}cm²입니다.`,
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-e2ex2-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${svg(data, true, poolIndex)}${mathBoard(data, f)}<div class="solution-answer-caption">문제와 같은 점·선분에서 넓이를 다시 계산한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant", difficultyDesign
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
