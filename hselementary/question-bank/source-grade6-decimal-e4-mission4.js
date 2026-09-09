(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 개념탐구 4 Mission 4 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e4-mission-4";
  const generatorKey = "sourceGrade6DecimalDivisionE4Mission4";
  const pools = Object.freeze([
    Object.freeze({ nr: 6, side: 4.4 }),
    Object.freeze({ nr: 4.8, side: 3.6 }),
    Object.freeze({ nr: 7.5, side: 5.2 })
  ]);
  const round = (value, places = 6) => Math.round((Number(value) + Number.EPSILON) * 10 ** places) / 10 ** places;
  const fmt = value => round(value).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  const poolIndexForSeed = seed => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % pools.length;
  };
  const facts = data => {
    const rm = round(3 * data.side);
    const nm = round(data.nr + rm);
    const largeSide = round(data.nr + 2 * data.side);
    return { rm, nm, largeSide };
  };
  const model = data => {
    const f = facts(data);
    const h = Math.sqrt(3) / 2;
    const N = { x: 0, y: 0 };
    const D = { x: data.side, y: 0 };
    const R = { x: data.nr, y: 0 };
    const M = { x: f.nm, y: 0 };
    const Q = { x: data.nr / 2, y: h * data.nr };
    const G = { x: data.side / 2, y: -h * data.side };
    const U = { x: data.side - f.largeSide / 2, y: -h * f.largeSide };
    const V = { x: data.side + f.largeSide / 2, y: -h * f.largeSide };
    const L = { x: G.x - (data.nr + data.side), y: G.y };
    const points = { G, N, D, R, M, Q, U, V, L };
    const bounds = Object.values(points).reduce((box, point) => ({
      minX: Math.min(box.minX, point.x), maxX: Math.max(box.maxX, point.x),
      minY: Math.min(box.minY, point.y), maxY: Math.max(box.maxY, point.y)
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    const scale = Math.min(480 / (bounds.maxX - bounds.minX), 210 / (bounds.maxY - bounds.minY));
    const screen = point => ({ x: round(55 + (point.x - bounds.minX) * scale, 3), y: round(35 + (point.y - bounds.minY) * scale, 3) });
    return { ...points, f, h, scale, screen };
  };
  const keyPoint = point => `${round(point.x, 4).toFixed(4)},${round(point.y, 4).toFixed(4)}`;
  const svg = (data, solved, poolIndex) => {
    const m = model(data);
    const at = name => m.screen(m[name]);
    const pointText = name => keyPoint(m[name]);
    const line = (from, to, className = "source61-e4m4-edge") => {
      const a = at(from), b = at(to);
      return `<line class="${className}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
    };
    const triangle = [at("G"), at("N"), at("D")];
    const baseline = at("N").y;
    const n = at("N"), r = at("R"), mPoint = at("M");
    const longDimensionY = baseline + 29;
    const shortDimensionY = baseline + 55;
    const pointData = ["G", "N", "D", "R", "M"].map(name => `${name}:${pointText(name)}`).join(";");
    return `<svg class="geometry-diagram source61-decimal-e4-diagram source61-e4m4-diagram ${solved ? "is-solved" : ""}" viewBox="0 0 600 345" role="img" aria-label="정삼각형이 이어진 도형" data-source61-e4-structure="equilateral-triangle-segment-chain" data-source61-e4-values="${[data.nr, m.f.nm, data.side, m.f.rm, m.f.largeSide].join(",")}" data-source61-e4m4-model="equilateral-triangle-segment-chain" data-source61-e4m4-phase="${solved ? "answer" : "problem"}" data-source61-e4m4-points="${pointData}" data-source61-e4m4-values="${[data.nr, m.f.nm, data.side, m.f.rm, m.f.largeSide].join(",")}" data-pool="${poolIndex}">
      ${solved ? `<polygon class="source61-e4m4-target is-solved" points="${triangle.map(keyPoint).join(" ")}"/>` : ""}
      <g class="source61-e4m4-shape">${line("U", "V")}${line("V", "D")}${line("D", "U")}${line("V", "M")}${line("M", "D")}${line("U", "L")}${line("L", "G")}${line("G", "N")}${line("N", "D")}${line("N", "Q")}${line("Q", "R")}${line("N", "R")}</g>
      ${solved ? line("R", "M", "source61-e4m4-rm is-solved") : ""}
      <g class="source61-e4m4-dimension">${line("N", "M", "source61-e4m4-guide")}${`<path d="M${n.x},${longDimensionY} H${mPoint.x} M${n.x},${longDimensionY - 5} V${longDimensionY + 5} M${mPoint.x},${longDimensionY - 5} V${longDimensionY + 5}"/>`}${`<path d="M${n.x},${shortDimensionY} H${r.x} M${n.x},${shortDimensionY - 5} V${shortDimensionY + 5} M${r.x},${shortDimensionY - 5} V${shortDimensionY + 5}"/>`}</g>
      <text class="source61-e4m4-measure" x="${round((n.x + mPoint.x) / 2, 3)}" y="${longDimensionY + 17}">ㄴㅁ ${fmt(m.f.nm)}cm</text>
      <text class="source61-e4m4-measure" x="${round((n.x + r.x) / 2, 3)}" y="${shortDimensionY + 17}">ㄴㄹ ${fmt(data.nr)}cm</text>
      <text class="source61-e4m4-label" x="${at("G").x}" y="${at("G").y - 15}">ㄱ</text><text class="source61-e4m4-label" x="${at("N").x - 14}" y="${at("N").y - 10}">ㄴ</text><text class="source61-e4m4-label" x="${at("D").x}" y="${at("D").y + 20}">ㄷ</text><text class="source61-e4m4-label" x="${at("R").x + 12}" y="${at("R").y + 20}">ㄹ</text><text class="source61-e4m4-label" x="${at("M").x}" y="${at("M").y + 20}">ㅁ</text>
      ${solved ? `<text class="source61-e4m4-result source61-e4-result-label" x="300" y="333">정삼각형 ㄱㄴㄷ의 한 변은 ${fmt(data.side)}cm</text>` : ""}
    </svg>`;
  };
  const row = (label, value) => `<div class="source61-math-row"><span>${label}</span><b>${value}</b></div>`;
  const mathBoard = (data, f) => `<div class="source61-math-board source61-e4m4-board"><strong>선분의 길이 관계</strong>${row("ㄹㅁ", `${fmt(f.nm)}-${fmt(data.nr)}=${fmt(f.rm)}cm`)}${row("정삼각형 ㄱㄴㄷ의 한 변", `${fmt(f.rm)}÷3=${fmt(data.side)}cm`)}${row("확인", `${fmt(data.nr)}+3×${fmt(data.side)}=${fmt(f.nm)}cm`)}</div>`;
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
    if (!(f.rm > 0 && f.nm > data.nr && Number.isFinite(data.side) && round(f.nm - data.nr) === f.rm && round(f.rm / 3) === data.side)) throw new Error(`${sourceItemId}: 정삼각형 선분 관계가 하나로 정해지지 않습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0 ? `<p class="question-step" data-step-evidence="guided">먼저 ㄹㅁ의 길이를 구한 뒤, 몇 개의 같은 변으로 이루어졌는지 세어 보세요.</p>` : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">ㄹㅁ이 정삼각형 ㄱㄴㄷ의 한 변 3개와 같은 길이인 까닭을 그림의 정삼각형을 따라 설명해 보세요.</p>` : "";
    const difficultyDesign = ["guided", "source", "independent-reasoning"][level];
    const evidence = `<span hidden data-source61-e4m4-kind="equilateral-triangle-segment-chain" data-source-item="${sourceItemId}" data-result-contract="single-value" data-difficulty-design="${difficultyDesign}"></span>`;
    return {
      prompt: `다음 도형은 모두 정삼각형으로 이루어져 있습니다. 선분 ㄴㅁ의 길이가 ${fmt(f.nm)}cm이고 선분 ㄴㄹ의 길이가 ${fmt(data.nr)}cm일 때, 정삼각형 ㄱㄴㄷ의 한 변의 길이를 구하세요.${svg(data, false, poolIndex)}${extra}${evidence}`,
      answer: `${fmt(data.side)}cm`,
      solution: `ㄹㅁ의 길이는 ${fmt(f.nm)}-${fmt(data.nr)}=${fmt(f.rm)}cm입니다. 그림에서 ㄹㅁ은 정삼각형 ㄱㄴㄷ의 한 변 3개와 같은 길이이므로, 한 변의 길이는 ${fmt(f.rm)}÷3=${fmt(data.side)}cm입니다.`,
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-decimal-e4-answer source61-e4m4-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${svg(data, true, poolIndex)}${mathBoard(data, f)}<div class="solution-answer-caption">문제와 같은 정삼각형 접합과 선분으로 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant", difficultyDesign
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
