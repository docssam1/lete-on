(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 부피 활용 생성기를 불러오지 못했습니다.");

  const ids = [
    "6-1-u6-e4-exploration-1", "6-1-u6-e4-exploration-2", "6-1-u6-e4-exploration-3",
    "6-1-u6-e4-example-1", "6-1-u6-e4-example-2", "6-1-u6-e4-example-3", "6-1-u6-e4-example-4",
    "6-1-u6-e4-mission-1", "6-1-u6-e4-mission-2", "6-1-u6-e4-mission-3",
    "6-1-u6-e4-mission-4", "6-1-u6-e4-mission-5", "6-1-u6-e4-mission-6"
  ];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const fractionMarkup = (n, d) => {
    const divisor = gcd(n, d);
    const numerator = n / divisor;
    const denominator = d / divisor;
    if (denominator === 1) return String(numerator);
    return `<span class="math-fraction" role="img" aria-label="${denominator}분의 ${numerator}"><span>${numerator}</span><span>${denominator}</span></span>`;
  };
  const mixedFractionText = (n, d) => {
    const divisor = gcd(n, d);
    const numerator = n / divisor;
    const denominator = d / divisor;
    const whole = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    if (!remainder) return String(whole);
    return whole ? `${whole} ${remainder}/${denominator}` : `${remainder}/${denominator}`;
  };
  const mixedFractionMarkup = (n, d) => {
    const divisor = gcd(n, d);
    const numerator = n / divisor;
    const denominator = d / divisor;
    const whole = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    if (!remainder) return String(whole);
    if (!whole) return fractionMarkup(remainder, denominator);
    return `<span class="math-mixed-number" role="img" aria-label="${whole}와 ${denominator}분의 ${remainder}"><span>${whole}</span>${fractionMarkup(remainder, denominator)}</span>`;
  };
  const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = value => Number(value).toLocaleString("ko-KR");
  const units = Object.freeze({ area: "cm²", volume: "cm³", cubicMeter: "m³" });
  const svgMeasurementAria = (value, unitName = "cm") => {
    const match = String(value).match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
    if (!match) return `${value}${unitName}`;
    const [, whole = "", numerator, denominator] = match;
    return whole ? `${whole}와 ${denominator}분의 ${numerator}${unitName}` : `${denominator}분의 ${numerator}${unitName}`;
  };
  const svgMeasurementLabel = ({ x, y, value, unitName = "cm", className = "" }) => {
    const match = String(value).match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
    if (!match) return label(x, y, `${value}${unitName}`, className || "source61-volume-e4-label");
    const [, whole = "", numerator, denominator] = match;
    const wholeWidth = whole ? whole.length * 8 + 5 : 0;
    const fractionWidth = Math.max(numerator.length, denominator.length) * 8 + 7;
    const unitWidth = unitName.length * 8;
    const start = x - (wholeWidth + fractionWidth + unitWidth) / 2;
    const fractionCenter = start + wholeWidth + fractionWidth / 2;
    const unitStart = start + wholeWidth + fractionWidth + 32;
    return `<g class="svg-measurement ${className}" aria-hidden="true" data-measurement-aria="${esc(svgMeasurementAria(value, unitName))}">${whole ? `<text class="svg-measure-text" x="${start.toFixed(1)}" y="${y}">${whole}</text>` : ""}<text class="svg-measure-fraction" x="${fractionCenter.toFixed(1)}" y="${y - 7}">${numerator}</text><line class="fraction-bar" x1="${(fractionCenter - fractionWidth / 2 + 1).toFixed(1)}" y1="${y}" x2="${(fractionCenter + fractionWidth / 2 - 1).toFixed(1)}" y2="${y}"/><text class="svg-measure-fraction" x="${fractionCenter.toFixed(1)}" y="${y + 8}">${denominator}</text><text class="svg-measure-text" x="${unitStart.toFixed(1)}" y="${y}">${unitName}</text></g>`;
  };
  const result = (prompt, answer, solution, options = {}) => ({
    prompt,
    answer: String(answer),
    solution,
    answerVisual: options.answerVisual,
    generationMode: "fixed-verified-pool",
    verifiedPoolIndex: options.poolIndex,
    verifiedVariantCount: 3,
    sourceItemId: options.sourceItemId
  });

  const pools = {
    tilt: [
      { depth: 8, width: 20, height: 26, segment: 6, restored: 16, sealedNumerator: 160, sealedDenominator: 13 },
      { depth: 10, width: 18, height: 30, segment: 12, restored: 21, sealedNumerator: 63, sealedDenominator: 5 },
      { depth: 12, width: 24, height: 34, segment: 10, restored: 22, sealedNumerator: 264, sealedDenominator: 17 }
    ],
    overflow: [
      { width: 20, depth: 40, height: 50, water: 45, overflow: 2500, answer: 6500 },
      { width: 24, depth: 30, height: 48, water: 44, overflow: 2400, answer: 5280 },
      { width: 25, depth: 32, height: 45, water: 40, overflow: 3200, answer: 7200 }
    ],
    equal: [
      { heights: [16, 6, 8], answerNumerator: 144, answerDenominator: 17 },
      { heights: [12, 8, 6], answer: 8 },
      { heights: [15, 10, 6], answer: 9 }
    ],
    rod: [
      { width: 40, depth: 20, height: 40, water: 15, rod: 8, numerator: 375, denominator: 23 },
      { width: 36, depth: 24, height: 30, water: 12, rod: 6, numerator: 288, denominator: 23 },
      { width: 30, depth: 25, height: 25, water: 10, rod: 5, numerator: 300, denominator: 29 }
    ],
    flow: [
      { a: 1600, aSides: [40, 40], b: 400, bSides: [20, 20], initial: 30, inflow: 3000, transfer: 1400, time: 12, final: 42 },
      { a: 2000, aSides: [50, 40], b: 400, bSides: [20, 20], initial: 28, inflow: 4000, transfer: 1600, time: 10, final: 40 },
      { a: 1200, aSides: [40, 30], b: 300, bSides: [20, 15], initial: 24, inflow: 2400, transfer: 1200, time: 8, final: 32 }
    ],
    units: [
      { expression: "2m³ - 56440cm³ + 7dL - 80L", converted: "2,000,000-56,440+700-80,000", answer: 1864260 },
      { expression: "3m³ - 145850cm³ + 3dL - 51L", converted: "3,000,000-145,850+300-51,000", answer: 2803450 },
      { expression: "1m³ - 95000cm³ + 9dL - 4L", converted: "1,000,000-95,000+900-4,000", answer: 901900 }
    ],
    thick: [
      { width: 38, depth: 18, height: 24, thickness: 4, answer: 6000 },
      { width: 34, depth: 23, height: 22, thickness: 2, answer: 11400 },
      { width: 44, depth: 28, height: 23, thickness: 3, answer: 16720 }
    ],
    spill: [
      { height: 45, width: 20, depth: 30, ratioNumerator: 4, ratioDenominator: 5, answer: 600 },
      { height: 30, width: 24, depth: 18, ratioNumerator: 4, ratioDenominator: 5, answer: 2592 },
      { height: 30, width: 20, depth: 16, ratioNumerator: 4, ratioDenominator: 5, answer: 1280 }
    ],
    stone: [
      { width: 16, depth: 16, height: 16, water: 10, stone: 1280, answer: 15 },
      { width: 18, depth: 18, height: 18, water: 8, stone: 1296, answer: 12 },
      { width: 20, depth: 20, height: 20, water: 9, stone: 1200, answer: 12 }
    ],
    displacement: [
      { width: 16, depth: 15, water: 12, rodWidth: 8, rodDepth: 6, answer: 15 },
      { width: 18, depth: 16, water: 11, rodWidth: 6, rodDepth: 4, answer: 12 },
      { width: 24, depth: 18, water: 9, rodWidth: 9, rodDepth: 12, answer: 12 }
    ],
    partition: [
      { volume: 6750, left: 15, right: 25, shownHeight: 9, answerNumerator: 45, answerDenominator: 4 },
      { volume: 7500, left: 15, right: 25, shownHeight: 12, answer: 15 },
      { volume: 7000, left: 12, right: 28, shownHeight: 10, answer: 14 }
    ]
  };

  const svgResult = answer => {
    const match = String(answer).match(/^(\d+\s+\d+\/\d+|\d+\/\d+)(.*)$/);
    if (!match) return `<text class="source61-volume-e4-result" x="320" y="304" text-anchor="middle">답: ${esc(answer)}</text>`;
    return `<text class="source61-volume-e4-result" x="278" y="304" text-anchor="end">답:</text>${svgMeasurementLabel({ x: 345, y: 302, value: match[1], unitName: match[2], className: "source61-volume-e4-result-measure" })}`;
  };
  const wrapper = (kind, content, values, solved, answer, label, required = []) => `<svg class="geometry-diagram source61-volume-e4-diagram" viewBox="0 0 640 320" role="img" aria-label="${esc(label)}" data-source61-volume-e4-kind="${kind}" data-source61-volume-e4-values="${esc(values.join(","))}" data-required-elements="${esc(required.join(","))}" data-phase="${solved ? "answer" : "problem"}" data-model-key="${kind}">${content}${solved ? svgResult(answer) : ""}</svg>`;
  const label = (x, y, text, className = "source61-volume-e4-label", anchor = "middle") => `<text class="${className}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(text)}</text>`;
  const point = (x, y) => ({ x, y });
  const pointList = values => values.map(value => `${value.x},${value.y}`).join(" ");
  const polygon = (values, className, role) => `<polygon class="${className}" points="${pointList(values)}" data-visual-element="${role}"/>`;
  const segment = (from, to, className, role) => `<line class="${className}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" data-visual-element="${role}"/>`;
  const box = (x, y, width, height, className = "source61-volume-e4-box", role = "front-face") => `<rect class="${className}" x="${x}" y="${y}" width="${width}" height="${height}" data-visual-element="${role}"/>`;
  const isoModel = ({ x, y, width, height, depthX, depthY }) => ({
    frontTopLeft: point(x, y + depthY), frontTopRight: point(x + width, y + depthY),
    frontBottomLeft: point(x, y + depthY + height), frontBottomRight: point(x + width, y + depthY + height),
    backTopLeft: point(x + depthX, y), backTopRight: point(x + width + depthX, y),
    backBottomLeft: point(x + depthX, y + height), backBottomRight: point(x + width + depthX, y + height)
  });
  const isoTank = (geometry, waterRatio, solved, roles = {}) => {
    const m = isoModel(geometry);
    const frontWaterY = m.frontBottomLeft.y - geometry.height * waterRatio;
    const backWaterY = m.backBottomLeft.y - geometry.height * waterRatio;
    const frontWaterLeft = point(m.frontBottomLeft.x, frontWaterY);
    const frontWaterRight = point(m.frontBottomRight.x, frontWaterY);
    const backWaterLeft = point(m.backBottomLeft.x, backWaterY);
    const backWaterRight = point(m.backBottomRight.x, backWaterY);
    const waterClass = `source61-volume-e4-water${solved ? " is-solved" : ""}`;
    const faces = [
      polygon([m.frontTopLeft, m.frontTopRight, m.frontBottomRight, m.frontBottomLeft], "source61-volume-e4-glass-face", roles.front || "front-face"),
      polygon([m.frontTopRight, m.backTopRight, m.backBottomRight, m.frontBottomRight], "source61-volume-e4-glass-face", roles.side || "side-face"),
      polygon([m.frontTopLeft, m.backTopLeft, m.backTopRight, m.frontTopRight], "source61-volume-e4-open-top", roles.top || "top-face"),
      segment(m.frontTopLeft, m.backTopLeft, "source61-volume-e4-depth-edge", roles.depth || "depth-edge"),
      segment(m.backTopLeft, m.backBottomLeft, "source61-volume-e4-hidden-edge", "hidden-depth-edge")
    ].join("");
    const water = waterRatio > 0 ? [
      polygon([frontWaterLeft, frontWaterRight, m.frontBottomRight, m.frontBottomLeft], waterClass, "water-front"),
      polygon([frontWaterRight, backWaterRight, m.backBottomRight, m.frontBottomRight], waterClass, "water-side"),
      polygon([frontWaterLeft, backWaterLeft, backWaterRight, frontWaterRight], waterClass, roles.water || "water-surface")
    ].join("") : "";
    const edges = [
      segment(m.frontTopLeft, m.frontTopRight, "source61-volume-e4-edge", "front-top-edge"),
      segment(m.frontTopRight, m.frontBottomRight, "source61-volume-e4-edge", "front-right-edge"),
      segment(m.frontBottomRight, m.frontBottomLeft, "source61-volume-e4-edge", "front-bottom-edge"),
      segment(m.frontBottomLeft, m.frontTopLeft, "source61-volume-e4-edge", "front-left-edge"),
      segment(m.backTopLeft, m.backTopRight, "source61-volume-e4-edge", "back-top-edge"),
      segment(m.backTopRight, m.backBottomRight, "source61-volume-e4-edge", "back-right-edge"),
      segment(m.backTopRight, m.frontTopRight, "source61-volume-e4-edge", "top-depth-edge"),
      segment(m.backBottomRight, m.frontBottomRight, "source61-volume-e4-hidden-edge", "bottom-depth-edge")
    ].join("");
    return { model: m, markup: `<g data-visual-element="solid-tank">${faces}${water}${edges}</g>`, water: { frontWaterLeft, frontWaterRight, backWaterLeft, backWaterRight } };
  };
  const isoSolid = (geometry, solved, role = "solid-object") => {
    const m = isoModel(geometry);
    const className = `source61-volume-e4-solid${solved ? " is-solved" : ""}`;
    return `<g data-visual-element="${role}">${polygon([m.frontTopLeft, m.frontTopRight, m.frontBottomRight, m.frontBottomLeft], className, `${role}-front`)}${polygon([m.frontTopRight, m.backTopRight, m.backBottomRight, m.frontBottomRight], className, `${role}-side`)}${polygon([m.frontTopLeft, m.backTopLeft, m.backTopRight, m.frontTopRight], className, `${role}-top`)}</g>`;
  };
  const diamondTank = ({ centerX, centerY, radius, waterOffset = 0 }, solved, targetText) => {
    const top = point(centerX, centerY - radius), right = point(centerX + radius, centerY), bottom = point(centerX, centerY + radius), left = point(centerX - radius, centerY);
    const waterLeft = point(centerX - radius + Math.abs(waterOffset), centerY + waterOffset);
    const waterRight = point(centerX + radius - Math.abs(waterOffset), centerY + waterOffset);
    return `<g data-visual-element="tilted-cross-section">${polygon([top, right, bottom, left], "source61-volume-e4-diamond", "tilted-face")}${polygon([waterLeft, waterRight, bottom], `source61-volume-e4-water${solved ? " is-solved" : ""}`, "tilted-water")}${segment(waterLeft, waterRight, "source61-volume-e4-water-line", "water-segment")}${segment(point(bottom.x - 72, bottom.y), point(bottom.x + 72, bottom.y), "source61-volume-e4-floor", "bottom-contact")}${label(top.x, top.y - 8, "ㄱ")}${label(left.x - 10, left.y + 4, "ㄴ", "source61-volume-e4-label", "end")}${label(right.x + 10, right.y + 4, "ㅈ", "source61-volume-e4-label", "start")}${label(bottom.x, bottom.y - 8, "ㄹ")}${label(bottom.x - 62, bottom.y - 8, "45°", "source61-volume-e4-angle")}${label(centerX, centerY + waterOffset - 10, targetText, `source61-volume-e4-target${solved ? " is-solved" : ""}`)}</g>`;
  };

  // 원문(인쇄 60쪽 개념탐구 4) 그림: ㉮ 물을 가득 담은 수조(ㄱㄴ 8cm, ㄴㄷ 20cm, ㄷㅅ 26cm)와 ㉯ 모서리 ㄱㄴ을 바닥에 대고 45° 기울인 모양.
  // 이름표 순서는 문제 그림 힌트 정책(이름표 순번 10 제거)과 맞춥니다: 10번째는 원문에 없는 "ㅈㄷ = □ cm" 표시입니다.
  const bookTiltFigure = (d, stage, solved) => {
    const k = 150 / d.height;
    const tank = isoTank({ x: 70, y: 88, width: Math.max(34, d.depth * k), height: d.height * k, depthX: Math.round(d.width * k * 0.62), depthY: Math.round(d.width * k * 0.4) }, 1, false);
    const m = tank.model;
    const k2 = 222 / ((d.width + d.height) * Math.SQRT1_2);
    const n = point(484, 292);
    const unitWidth = { x: Math.SQRT1_2, y: -Math.SQRT1_2 };
    const unitHeight = { x: -Math.SQRT1_2, y: -Math.SQRT1_2 };
    const at = (base, dir, length) => point(Math.round((base.x + dir.x * length * k2) * 10) / 10, Math.round((base.y + dir.y * length * k2) * 10) / 10);
    const c = at(n, unitWidth, d.width);
    const b = at(n, unitHeight, d.height);
    const top = at(c, unitHeight, d.height);
    const j = at(c, unitHeight, d.segment);
    const tilted = `<g data-visual-element="tilted-cross-section">${polygon([n, c, top, b], "source61-volume-e4-diamond", "tilted-face")}${polygon([n, c, j, b], `source61-volume-e4-water${solved ? " is-solved" : ""}`, "tilted-water")}${segment(b, j, "source61-volume-e4-water-line", "water-segment")}${segment(point(n.x - 150, n.y), point(n.x + 120, n.y), "source61-volume-e4-floor", "bottom-contact")}</g>`;
    const showTarget = stage === "segment";
    const targetText = solved ? `ㅈㄷ = ${d.segment}cm` : "ㅈㄷ = □ cm";
    const labels = [
      label(m.frontTopLeft.x - 18, m.backTopLeft.y - 10, "㉮", "source61-volume-e4-subtitle"),
      label((m.frontBottomLeft.x + m.frontBottomRight.x) / 2, m.frontBottomLeft.y + 22, `${d.depth}cm`),
      label((m.frontBottomRight.x + m.backBottomRight.x) / 2 + 22, (m.frontBottomRight.y + m.backBottomRight.y) / 2 + 18, `${d.width}cm`, "source61-volume-e4-label", "start"),
      label(m.backTopRight.x + 10, (m.backTopRight.y + m.backBottomRight.y) / 2, `${d.height}cm`, "source61-volume-e4-label", "start"),
      label(b.x - 26, top.y + 6, "㉯", "source61-volume-e4-subtitle"),
      label(top.x, top.y - 8, "ㅅ"),
      label(b.x - 10, b.y + 5, "ㅂ", "source61-volume-e4-label", "end"),
      label(j.x + 10, j.y + 4, "ㅈ", "source61-volume-e4-label", "start"),
      label(c.x + 10, c.y + 5, "ㄷ", "source61-volume-e4-label", "start"),
      label(n.x, n.y + 20, "ㄴ"),
      showTarget ? label((b.x + j.x) / 2 + 40, j.y + 46, targetText, `source61-volume-e4-target${solved ? " is-solved" : ""}`) : "",
      label(n.x - 40, n.y - 8, "45°", "source61-volume-e4-angle"),
      label(m.frontBottomLeft.x - 8, m.frontBottomLeft.y + 6, "ㄱ", "source61-volume-e4-label", "end"),
      label(m.frontBottomRight.x + 4, m.frontBottomRight.y + 16, "ㄴ", "source61-volume-e4-label", "start"),
      label(m.backBottomRight.x + 8, m.backBottomRight.y + 4, "ㄷ", "source61-volume-e4-label", "start"),
      label(m.backBottomLeft.x + 8, m.backBottomLeft.y - 4, "ㄹ", "source61-volume-e4-label", "start"),
      label(m.frontTopLeft.x - 8, m.frontTopLeft.y + 6, "ㅁ", "source61-volume-e4-label", "end"),
      label(m.frontTopRight.x + 4, m.frontTopRight.y + 16, "ㅂ", "source61-volume-e4-label", "start"),
      label(m.backTopRight.x + 6, m.backTopRight.y - 4, "ㅅ", "source61-volume-e4-label", "start"),
      label(m.backTopLeft.x - 4, m.backTopLeft.y - 6, "ㅇ", "source61-volume-e4-label", "end")
    ].join("");
    return { content: `${tank.markup}${tilted}${labels}`, required: ["solid-tank", "depth-edge", "tilted-cross-section", "tilted-face", "tilted-water", "water-segment", "bottom-contact"] };
  };

  const tiltedSvg = (d, stage, solved, answer) => {
    const target = stage === "segment" ? d.segment : stage === "restored" ? d.restored : d.sealedNumerator / d.sealedDenominator;
    const solvedText = stage === "segment" ? String(d.segment) : stage === "restored" ? String(d.restored) : mixedFractionText(d.sealedNumerator, d.sealedDenominator);
    const title = stage === "segment" ? "㉮ 물을 가득 담은 수조와 ㉯ 45° 기울인 모양" : stage === "restored" ? "수조를 원래 바닥면으로 바로 세운 모습" : "입구를 막고 새 바닥면으로 놓은 모습";
    let content;
    let required;
    if (!solved || stage === "segment") {
      const figure = bookTiltFigure(d, stage, solved);
      content = figure.content;
      required = figure.required;
    } else if (stage === "restored") {
      const tank = isoTank({ x: 145, y: 58, width: 300, height: 170, depthX: 70, depthY: 36 }, d.restored / d.height, solved, { water: "restored-water-surface" });
      const m = tank.model;
      const base = polygon([m.frontBottomLeft, m.frontBottomRight, m.backBottomRight, m.backBottomLeft], `source61-volume-e4-base-face${solved ? " is-solved" : ""}`, "original-base-face");
      content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">${title}</text>${tank.markup}${base}${label(295, 284, `바닥면 ${d.width}cm × ${d.depth}cm`)}${label(132, tank.water.frontWaterLeft.y + 4, solved ? `물높이 ${d.restored}cm` : "물높이 □ cm", `source61-volume-e4-target${solved ? " is-solved" : ""}`, "end")}`;
      required = ["solid-tank", "depth-edge", "original-base-face", "restored-water-surface"];
    } else {
      const tank = isoTank({ x: 135, y: 62, width: 315, height: 128, depthX: 72, depthY: 42 }, target / d.width, solved, { side: "new-base-face", top: "sealed-face", water: "sealed-water-surface" });
      const m = tank.model;
      const sealedFace = polygon([m.frontTopLeft, m.backTopLeft, m.backTopRight, m.frontTopRight], `source61-volume-e4-sealed-face${solved ? " is-solved" : ""}`, "sealed-face-highlight");
      const newBase = polygon([m.frontTopRight, m.backTopRight, m.backBottomRight, m.frontBottomRight], `source61-volume-e4-base-face${solved ? " is-solved" : ""}`, "new-base-face-highlight");
      const waterHeightLabel = solved ? `${label(74, tank.water.frontWaterLeft.y + 4, "물높이", "source61-volume-e4-target is-solved")}${svgMeasurementLabel({ x: 142, y: tank.water.frontWaterLeft.y + 2, value: solvedText, unitName: "cm", className: "source61-volume-e4-target is-solved" })}` : label(122, tank.water.frontWaterLeft.y + 4, "물높이 □ cm", "source61-volume-e4-target", "end");
      content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">${title}</text>${tank.markup}${sealedFace}${newBase}${label(335, 64, "막은 입구", "source61-volume-e4-note")}${label(535, 185, `새 바닥면 ${d.height}cm × ${d.depth}cm`, "source61-volume-e4-note", "end")}${waterHeightLabel}`;
      required = ["solid-tank", "depth-edge", "sealed-face", "new-base-face", "sealed-face-highlight", "new-base-face-highlight", "sealed-water-surface"];
    }
    return wrapper(`tilted-${stage}`, content, [d.depth, d.width, d.height, d.segment, d.restored, d.sealedNumerator, d.sealedDenominator, target], solved, answer, title, required);
  };

  const overflowSvg = (d, solved, answer) => {
    const tank = isoTank({ x: 128, y: 58, width: 300, height: 172, depthX: 72, depthY: 38 }, d.water / d.height, solved);
    const m = tank.model;
    const headspace = polygon([m.frontTopLeft, m.frontTopRight, tank.water.frontWaterRight, tank.water.frontWaterLeft], `source61-volume-e4-headspace${solved ? " is-solved" : ""}`, "headspace");
    const stone = isoSolid({ x: 278, y: tank.water.frontWaterLeft.y - 18, width: 52, height: 58, depthX: 18, depthY: 12 }, solved, "stone-solid");
    const overflowArrow = `<path class="source61-volume-e4-flow-arrow" d="M500 112 C548 120 548 160 518 176" data-visual-element="overflow"/><path class="source61-volume-e4-arrow-head" d="M510 166 L518 178 L526 166"/>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">물 위의 빈 공간을 채우고 넘친 모습</text>${tank.markup}${headspace}${stone}${overflowArrow}${label(266, 278, `바닥 ${d.width}cm × ${d.depth}cm`)}${label(510, 76, `높이 ${d.height}cm`, "source61-volume-e4-label", "start")}${label(116, tank.water.frontWaterLeft.y + 4, `물 ${d.water}cm`, "source61-volume-e4-label", "end")}${label(536, 196, `${d.overflow / 1000}L 넘침`, "source61-volume-e4-note")}${label(278, 94, solved ? `빈 공간도 돌의 부피에 포함` : "물 위의 빈 공간", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}`;
    return wrapper("overflow-stone", content, [d.width, d.depth, d.height, d.water, d.overflow, d.answer], solved, answer, "돌이 완전히 잠긴 입체 어항", ["solid-tank", "depth-edge", "water-surface", "headspace", "stone-solid", "overflow"]);
  };

  const equalSvg = (d, solved, answer) => {
    const geometry = { x: 76, y: 66, width: 450, height: 158, depthX: 58, depthY: 34 };
    const tank = isoTank(geometry, 0, solved);
    const m = tank.model;
    const weights = d.heights.map(height => 1 / height);
    const weightTotal = weights.reduce((sum, value) => sum + value, 0);
    const sectionWidths = weights.map(value => geometry.width * value / weightTotal);
    let cursor = m.frontBottomLeft.x;
    const sectionMarkup = sectionWidths.map((width, index) => {
      const waterHeight = geometry.height * d.heights[index] / Math.max(...d.heights) * 0.78;
      const frontY = m.frontBottomLeft.y - waterHeight;
      const backY = frontY - geometry.depthY;
      const frontLeft = point(cursor, frontY), frontRight = point(cursor + width, frontY);
      const backLeft = point(cursor + geometry.depthX, backY), backRight = point(cursor + width + geometry.depthX, backY);
      const water = `${polygon([frontLeft, frontRight, point(frontRight.x, m.frontBottomRight.y), point(frontLeft.x, m.frontBottomLeft.y)], `source61-volume-e4-water${solved ? " is-solved" : ""}`, `water-front-${index + 1}`)}${polygon([frontLeft, backLeft, backRight, frontRight], `source61-volume-e4-water${solved ? " is-solved" : ""}`, `water-surface-${index + 1}`)}`;
      const divider = index < 2 ? polygon([point(cursor + width, m.frontTopRight.y), point(cursor + width + geometry.depthX, m.backTopRight.y), point(cursor + width + geometry.depthX, m.backBottomRight.y), point(cursor + width, m.frontBottomRight.y)], "source61-volume-e4-divider-plane", `divider-plane-${index + 1}`) : "";
      const heightLabel = label(cursor + width / 2, frontY - 8, `${d.heights[index]}cm`, "source61-volume-e4-label");
      cursor += width;
      return `${water}${divider}${heightLabel}`;
    }).join("");
    const answerValue = mixedFractionText(d.answerNumerator || d.answer, d.answerDenominator || 1);
    const mergedLabel = solved ? `${label(232, 286, "칸막이를 빼면", "source61-volume-e4-target is-solved")}${svgMeasurementLabel({ x: 374, y: 284, value: answerValue, unitName: "cm", className: "source61-volume-e4-target is-solved" })}` : label(302, 286, "칸막이를 뺀 뒤의 높이", "source61-volume-e4-target");
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">같은 양의 물을 세 칸에 나눈 입체 수조</text>${tank.markup}<g data-visual-element="equal-volume-sections">${sectionMarkup}</g>${mergedLabel}`;
    return wrapper("equal-partitions", content, [...d.heights, d.answerNumerator || d.answer, d.answerDenominator || 1], solved, answer, "세 부분에 같은 양의 물을 담은 입체 수조", ["solid-tank", "depth-edge", "equal-volume-sections", "water-surface-1", "water-surface-2", "water-surface-3", "divider-plane-1", "divider-plane-2"]);
  };

  const rodSvg = (d, solved, answer) => {
    const left = isoTank({ x: 62, y: 88, width: 190, height: 128, depthX: 42, depthY: 25 }, d.water / d.height, false);
    const finalHeight = d.numerator / d.denominator;
    const right = isoTank({ x: 350, y: 82, width: 178, height: 134, depthX: 42, depthY: 25 }, finalHeight / d.height, solved, { water: "raised-water-surface" });
    const rod = isoSolid({ x: 418, y: 55, width: 48, height: 174, depthX: 20, depthY: 12 }, solved, "square-rod-solid");
    const heightLabel = solved ? svgMeasurementLabel({ x: 324, y: right.water.frontWaterLeft.y + 2, value: mixedFractionText(d.numerator, d.denominator), unitName: "cm", className: "source61-volume-e4-target is-solved" }) : label(336, right.water.frontWaterLeft.y + 4, "□ cm", "source61-volume-e4-target", "end");
    // 원문 그림: [그림 1] 가로 40cm·세로 20cm·높이 40cm 그릇에 물 15cm, [그림 2] 윗면에 8cm가 적힌 막대. 이름표 순번 6(□ cm)은 문제 그림 힌트 정책이 지웁니다.
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">막대를 세우기 전과 후</text>${label(165, 306, "[그림 1]")}${left.markup}${label(157, 272, `${d.width}cm × ${d.depth}cm`)}${label(48, left.water.frontWaterLeft.y + 4, `${d.water}cm`, "source61-volume-e4-label", "end")}${label(455, 306, "[그림 2]")}${right.markup}${rod}${label(442, 50, `${d.rod}cm`, "source61-volume-e4-label", "end")}${heightLabel}${label(300, 150, `${d.height}cm`, "source61-volume-e4-label", "start")}`;
    return wrapper("square-rod", content, [d.width, d.depth, d.height, d.water, d.rod, d.numerator, d.denominator], solved, answer, "막대를 세운 입체 그릇", ["solid-tank", "depth-edge", "raised-water-surface", "square-rod-solid", "square-rod-solid-top"]);
  };

  const flowSvg = (d, solved, answer) => {
    const left = isoTank({ x: 70, y: 78, width: 210, height: 145, depthX: 48, depthY: 28 }, d.initial / (d.final + 12), solved, { water: "tank-a-water" });
    const right = isoTank({ x: 425, y: 115, width: 120, height: 108, depthX: 34, depthY: 20 }, solved ? 0.72 : 0.18, solved, { water: "tank-b-water" });
    const flow = `<path class="source61-volume-e4-flow-arrow" d="M288 148 C340 118 382 130 424 164" data-visual-element="transfer-flow"/><path class="source61-volume-e4-arrow-head" d="M413 154 L426 164 L410 169"/>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">가 그릇으로 들어오고 나 그릇으로 흐르는 물</text>${left.markup}${right.markup}${flow}${label(178, 70, `가: ${d.aSides[0]}cm × ${d.aSides[1]}cm`)}${label(492, 108, `나: ${d.bSides[0]}cm × ${d.bSides[1]}cm`)}${label(58, left.water.frontWaterLeft.y + 4, `${d.initial}cm`, "source61-volume-e4-label", "end")}${label(346, 108, `1분에 ${d.transfer / 1000}L`, "source61-volume-e4-arrow-text")}${label(320, 280, solved ? `${d.time}분 뒤 두 높이 ${d.final}cm` : "두 물높이가 같아지는 높이", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}`;
    return wrapper("flow-equal-height", content, [...d.aSides, ...d.bSides, d.initial, d.inflow, d.transfer, d.time, d.final], solved, answer, "두 입체 그릇 사이의 물 이동", ["solid-tank", "depth-edge", "tank-a-water", "tank-b-water", "transfer-flow"]);
  };

  const unitSvg = (d, solved, answer) => {
    const rows = [[units.cubicMeter, "1,000,000mL"], [units.volume, "1mL"], ["dL", "100mL"], ["L", "1,000mL"]];
    const table = rows.map((row, index) => `<g><rect class="source61-volume-e4-table-row${index % 2 ? " alt" : ""}" x="154" y="${54 + index * 34}" width="332" height="34"/><text class="source61-volume-e4-table-text" x="200" y="${76 + index * 34}">${row[0]}</text><text class="source61-volume-e4-table-text" x="340" y="${76 + index * 34}">${row[1]}</text></g>`).join("");
    const expression = `<text class="${solved ? "source61-volume-e4-target is-solved" : "source61-volume-e4-title"}" x="320" y="${solved ? 230 : 60}" text-anchor="middle" data-visual-element="unit-expression">${esc(d.expression.replace(/ - /g, " − "))} = ${solved ? num(d.answer) : "□"}mL</text>`;
    // 원문은 식만 주므로 문제 그림에는 식만 두고, 단위 관계표는 답 그림에만 둡니다.
    const content = solved ? `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">단위표를 이용한 물의 양 계산</text><g data-visual-element="unit-table">${table}</g>${expression}` : expression;
    return wrapper("unit-conversion", content, [d.expression, d.answer], solved, `${num(d.answer)}mL`, "부피 단위 계산식", solved ? ["unit-expression", "unit-table"] : ["unit-expression"]);
  };

  const thickSvg = (d, solved, answer) => {
    const geometry = { x: 130, y: 62, width: 310, height: 160, depthX: 76, depthY: 42 };
    const tank = isoTank(geometry, 0, solved);
    const m = tank.model;
    const inset = Math.max(12, geometry.width * d.thickness / d.width);
    const innerFrontLeft = point(m.frontTopLeft.x + inset, m.frontTopLeft.y + 8);
    const innerFrontRight = point(m.frontTopRight.x - inset, m.frontTopRight.y + 8);
    const innerBackLeft = point(m.backTopLeft.x + inset, m.backTopLeft.y + 10);
    const innerBackRight = point(m.backTopRight.x - inset, m.backTopRight.y + 10);
    const rim = `<g data-visual-element="side-wall-thickness">${polygon([m.frontTopLeft, m.frontTopRight, innerFrontRight, innerFrontLeft], `source61-volume-e4-wall${solved ? " is-solved" : ""}`, "front-wall-thickness")}${polygon([m.frontTopLeft, m.backTopLeft, innerBackLeft, innerFrontLeft], `source61-volume-e4-wall${solved ? " is-solved" : ""}`, "left-wall-thickness")}${polygon([m.frontTopRight, m.backTopRight, innerBackRight, innerFrontRight], `source61-volume-e4-wall${solved ? " is-solved" : ""}`, "right-wall-thickness")}${polygon([innerFrontLeft, innerBackLeft, innerBackRight, innerFrontRight], "source61-volume-e4-inner", "inner-opening")}</g>`;
    const bottomY = m.frontBottomLeft.y - geometry.height * d.thickness / d.height;
    const bottom = `<g data-visual-element="bottom-thickness">${segment(point(m.frontBottomLeft.x, bottomY), point(m.frontBottomRight.x, bottomY), "source61-volume-e4-thickness-line", "bottom-inner-line")}${label(m.frontBottomLeft.x - 12, bottomY + 4, `${d.thickness}cm`, "source61-volume-e4-note", "end")}</g>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">옆면은 두 번, 바닥은 한 번 빼는 그릇</text>${tank.markup}${rim}${bottom}${label(286, 286, `바깥 ${d.width}cm × ${d.depth}cm × ${d.height}cm`)}${label(522, 100, `두께 ${d.thickness}cm`, "source61-volume-e4-note", "start")}${label(320, 174, solved ? `${num(d.answer)}${units.volume}` : "물을 담는 안쪽", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}`;
    return wrapper("wall-thickness", content, [d.width, d.depth, d.height, d.thickness, d.answer], solved, `${decimalLiters(d.answer)}L`, "두께가 있는 입체 직육면체 그릇", ["solid-tank", "depth-edge", "side-wall-thickness", "front-wall-thickness", "left-wall-thickness", "right-wall-thickness", "inner-opening", "bottom-thickness"]);
  };
  const decimalLiters = value => (value / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 2 });

  const spillSvg = (d, solved, answer) => {
    // 원문 그림처럼 높이·가로·안쪽 길이를 비례에 맞추어 세운 수조를 그리고, 선분 ㄱㄴ은 왼쪽 아래 안쪽 모서리입니다.
    const uprightScale = 150 / Math.max(d.height, d.width, d.depth);
    const upright = isoTank({ x: 92, y: 96, width: Math.round(d.width * uprightScale), height: Math.round(d.height * uprightScale), depthX: Math.round(d.depth * uprightScale * 0.55), depthY: Math.round(d.depth * uprightScale * 0.38) }, d.ratioNumerator / d.ratioDenominator, false);
    const cx = 460, cy = 160, radius = 72, offset = 30;
    const front = [point(cx, cy - radius), point(cx + radius, cy), point(cx, cy + radius), point(cx - radius, cy)];
    const back = front.map(value => point(value.x + offset, value.y - 18));
    const waterLeft = point(cx - radius + 16, cy + 16), waterRight = point(cx + radius - 16, cy + 16);
    const backWaterLeft = point(waterLeft.x + offset, waterLeft.y - 18), backWaterRight = point(waterRight.x + offset, waterRight.y - 18);
    const tilted = `<g data-visual-element="tilted-solid">${polygon(front, "source61-volume-e4-diamond", "tilted-front-face")}${polygon(back, "source61-volume-e4-hidden-face", "tilted-back-face")}${front.map((value, index) => segment(value, back[index], "source61-volume-e4-depth-edge", `tilted-depth-edge-${index + 1}`)).join("")}${polygon([waterLeft, waterRight, front[2]], `source61-volume-e4-water${solved ? " is-solved" : ""}`, "tilted-water-front")}${polygon([waterLeft, backWaterLeft, backWaterRight, waterRight], `source61-volume-e4-water${solved ? " is-solved" : ""}`, "tilted-water-surface")}${segment(point(front[2].x - 66, front[2].y), point(front[2].x + 66, front[2].y), "source61-volume-e4-floor", "bottom-contact")}${label(front[2].x - 56, front[2].y - 8, "45°", "source61-volume-e4-angle")}</g>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">물을 채운 수조를 중심으로 45° 기울인 모습</text>${label(145, 76, "[기울이기 전]")}${upright.markup}${label(upright.model.frontTopLeft.x - 10, (upright.model.frontTopLeft.y + upright.model.frontBottomLeft.y) / 2, `${d.height}cm`, "source61-volume-e4-label", "end")}${label(458, 76, "[45° 기울인 뒤]")}${tilted}${label(322, 154, "→", "source61-volume-e4-arrow-text")}${label(460, 278, solved ? `${num(d.answer)}mL 쏟아짐` : "쏟아진 물의 양", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}${label((upright.model.frontBottomLeft.x + upright.model.frontBottomRight.x) / 2, upright.model.frontBottomLeft.y + 20, `${d.width}cm`)}${label((upright.model.frontBottomRight.x + upright.model.backBottomRight.x) / 2 + 12, (upright.model.frontBottomRight.y + upright.model.backBottomRight.y) / 2 + 16, `${d.depth}cm`, "source61-volume-e4-label", "start")}${label(upright.model.frontBottomLeft.x - 6, upright.model.frontBottomLeft.y + 14, "ㄱ", "source61-volume-e4-label", "end")}${label(upright.model.backBottomLeft.x + 6, upright.model.backBottomLeft.y - 6, "ㄴ", "source61-volume-e4-label", "start")}`;
    return wrapper("tilted-spill", content, [d.height, d.width, d.depth, d.ratioNumerator, d.ratioDenominator, d.answer], solved, `${num(d.answer)}mL`, "45도 기울인 입체 수조", ["solid-tank", "depth-edge", "water-surface", "tilted-solid", "tilted-front-face", "tilted-back-face", "tilted-water-surface", "bottom-contact"]);
  };

  const stoneSvg = (d, solved, answer) => {
    const maximumHeight = d.height;
    const scale = Math.min(280 / d.width, 160 / d.height);
    const tank = isoTank({ x: 170, y: 70, width: Math.round(d.width * scale), height: Math.round(d.height * scale), depthX: Math.round(d.depth * scale * 0.5), depthY: Math.round(d.depth * scale * 0.3) }, (solved ? d.answer : d.water) / maximumHeight, solved, { water: solved ? "raised-water-surface" : "water-surface" });
    const stoneCenter = solved ? point((tank.model.frontBottomLeft.x + tank.model.frontBottomRight.x) / 2, tank.water.frontWaterLeft.y + 46) : point(320, 56);
    const stonePath = `<path class="source61-volume-e4-stone${solved ? " is-solved" : ""}" d="M${stoneCenter.x - 30} ${stoneCenter.y + 4} L${stoneCenter.x - 22} ${stoneCenter.y - 18} L${stoneCenter.x + 8} ${stoneCenter.y - 25} L${stoneCenter.x + 30} ${stoneCenter.y - 4} L${stoneCenter.x + 20} ${stoneCenter.y + 22} L${stoneCenter.x - 10} ${stoneCenter.y + 28} Z" data-visual-element="stone-object"/>`;
    const arrow = solved ? "" : `<path class="source61-volume-e4-flow-arrow" d="M355 55 C380 78 372 104 346 124" data-visual-element="submerge-arrow"/><path class="source61-volume-e4-arrow-head" d="M340 113 L345 127 L357 117"/>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">돌을 완전히 잠기게 넣는 입체 그릇</text>${tank.markup}${stonePath}${arrow}${label((tank.model.frontBottomLeft.x + tank.model.frontBottomRight.x) / 2, tank.model.frontBottomLeft.y + 20, `바닥 ${d.width}cm × ${d.depth}cm`)}${label(tank.model.frontBottomLeft.x - 12, tank.water.frontWaterLeft.y + 4, solved ? `물높이 ${d.answer}cm` : `처음 ${d.water}cm`, `source61-volume-e4-target${solved ? " is-solved" : ""}`, "end")}${label(510, 58, `돌 ${num(d.stone)}${units.volume}`, "source61-volume-e4-note")}${label(tank.model.backTopRight.x + 10, (tank.model.backTopRight.y + tank.model.backBottomRight.y) / 2, `높이 ${d.height}cm`, "source61-volume-e4-label", "start")}`;
    return wrapper("submerged-stone", content, [d.width, d.depth, d.height, d.water, d.stone, d.answer], solved, `${d.answer}cm`, "돌이 잠긴 입체 수조", ["solid-tank", "depth-edge", solved ? "raised-water-surface" : "water-surface", "stone-object", ...(solved ? [] : ["submerge-arrow"])]);
  };

  const displacementSvg = (d, solved, answer) => {
    const tank = isoTank({ x: 132, y: 70, width: 310, height: 165, depthX: 74, depthY: 40 }, d.answer / (d.answer + 5), solved, { water: "raised-water-surface" });
    const rodWidth = 42 + d.rodWidth * 2;
    const rodDepth = 18 + d.rodDepth;
    const rod = isoSolid({ x: 270, y: 48, width: rodWidth, height: 214, depthX: rodDepth, depthY: Math.round(rodDepth * 0.55) }, solved, "rectangular-rod-solid");
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">직육면체 막대를 바닥에 세운 입체 그릇</text>${tank.markup}${rod}${label(292, 286, `그릇 바닥 ${d.width}cm × ${d.depth}cm`)}${label(355, 72, `막대 밑면 ${d.rodWidth}cm × ${d.rodDepth}cm`, "source61-volume-e4-note", "start")}${label(118, tank.water.frontWaterLeft.y + 4, solved ? `물높이 ${d.answer}cm` : "물높이 □ cm", `source61-volume-e4-target${solved ? " is-solved" : ""}`, "end")}`;
    return wrapper("rectangular-rod", content, [d.width, d.depth, d.water, d.rodWidth, d.rodDepth, d.answer], solved, `${d.answer}cm`, "물속에 세운 입체 직육면체 막대", ["solid-tank", "depth-edge", "raised-water-surface", "rectangular-rod-solid", "rectangular-rod-solid-top"]);
  };

  const partitionSvg = (d, solved, answer) => {
    const geometry = { x: 78, y: 70, width: 450, height: 156, depthX: 58, depthY: 34 };
    const tank = isoTank(geometry, 0, solved);
    const m = tank.model;
    const dividerX = m.frontTopLeft.x + geometry.width * d.left / (d.left + d.right);
    const depth = d.volume / (d.right * d.shownHeight);
    const leftHeight = d.volume / (d.left * depth);
    const displayMax = Math.max(leftHeight, d.shownHeight) + 4;
    const waterPart = (leftX, rightX, waterHeight, role) => {
      const frontY = m.frontBottomLeft.y - geometry.height * waterHeight / displayMax;
      const backY = frontY - geometry.depthY;
      const fl = point(leftX, frontY), fr = point(rightX, frontY), bl = point(leftX + geometry.depthX, backY), br = point(rightX + geometry.depthX, backY);
      return `${polygon([fl, fr, point(fr.x, m.frontBottomRight.y), point(fl.x, m.frontBottomLeft.y)], `source61-volume-e4-water${solved ? " is-solved" : ""}`, `${role}-front`)}${polygon([fl, bl, br, fr], `source61-volume-e4-water${solved ? " is-solved" : ""}`, `${role}-surface`)}`;
    };
    const water = solved
      ? waterPart(m.frontTopLeft.x, m.frontTopRight.x, (d.answerNumerator || d.answer) / (d.answerDenominator || 1), "merged-water")
      : `${waterPart(m.frontTopLeft.x, dividerX, leftHeight, "left-water")}${waterPart(dividerX, m.frontTopRight.x, d.shownHeight, "right-water")}`;
    const divider = solved ? "" : polygon([point(dividerX, m.frontTopLeft.y), point(dividerX + geometry.depthX, m.backTopLeft.y), point(dividerX + geometry.depthX, m.backBottomLeft.y), point(dividerX, m.frontBottomLeft.y)], "source61-volume-e4-divider-plane", "divider-plane");
    const answerValue = mixedFractionText(d.answerNumerator || d.answer, d.answerDenominator || 1);
    const finalHeightLabel = solved ? `${label(402, 178, "높이", "source61-volume-e4-target is-solved")}${svgMeasurementLabel({ x: 474, y: 176, value: answerValue, unitName: "cm", className: "source61-volume-e4-target is-solved" })}` : label(458, 178, `${d.shownHeight}cm`, "source61-volume-e4-label");
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">같은 양의 물을 넣은 두 칸 입체 그릇</text>${tank.markup}${water}${divider}${label(m.frontTopLeft.x + (dividerX - m.frontTopLeft.x) / 2, 282, `${d.left}cm`)}${label(dividerX + (m.frontTopRight.x - dividerX) / 2, 282, `${d.right}cm`)}${solved ? label(580, 126, `깊이 ${depth}cm`, "source61-volume-e4-note", "end") : ""}${finalHeightLabel}`;
    return wrapper("partitioned-tank", content, [d.volume, d.left, d.right, d.shownHeight, d.answerNumerator || d.answer, d.answerDenominator || 1], solved, `${answerValue}cm`, "칸막이가 있는 입체 수조", solved ? ["solid-tank", "depth-edge", "merged-water-surface"] : ["solid-tank", "depth-edge", "divider-plane", "left-water-surface", "right-water-surface"]);
  };

  const render = (kind, data, solved, answer) => {
    if (kind.startsWith("exploration-1")) return tiltedSvg(data, "segment", solved, answer);
    if (kind.startsWith("exploration-2")) return tiltedSvg(data, "restored", solved, answer);
    if (kind.startsWith("exploration-3")) return tiltedSvg(data, "sealed", solved, answer);
    if (kind === "example-1") return overflowSvg(data, solved, answer);
    if (kind === "example-2") return equalSvg(data, solved, answer);
    if (kind === "example-3") return rodSvg(data, solved, answer);
    if (kind === "example-4") return flowSvg(data, solved, answer);
    if (kind === "mission-1") return unitSvg(data, solved, answer);
    if (kind === "mission-2") return thickSvg(data, solved, answer);
    if (kind === "mission-3") return spillSvg(data, solved, answer);
    if (kind === "mission-4") return stoneSvg(data, solved, answer);
    if (kind === "mission-5") return displacementSvg(data, solved, answer);
    return partitionSvg(data, solved, answer);
  };

  const keyById = new Map(ids.map(id => [id, id.split("-e4-")[1]]));
  const generator = ({ rng, level, variant = 0 }) => {
    if (!Number.isInteger(variant) || variant < 0 || variant >= ids.length) throw new Error("6-1 부피 활용 원문 유형 번호가 잘못되었습니다.");
    const sourceItemId = ids[variant];
    const kind = keyById.get(sourceItemId);
    const poolIndex = Math.floor(rng() * 3);
    const difficulty = ["심화 쉬움", "심화 기준", "심화 어려움"][level] || "심화 기준";
    const hint = level === 0 ? `<p class="question-step" data-step-evidence="guided">먼저 그림의 물이 차 있는 부분과 빈 부분의 부피를 나누어 보세요.</p>` : "";
    const challenge = level === 2 ? `<p class="question-step source61-volume-e4-challenge" data-step-evidence="independent-reasoning">단위를 맞춘 뒤, 그림에서 같은 물을 다른 모양으로 세는 과정을 식으로 나타내 보세요.</p>` : "";
    const make = (prompt, answer, solution, data, values) => {
      const answerText = typeof answer === "string" ? answer : String(answer);
      const problemVisual = render(kind, data, false, answerText);
      const answerVisual = render(kind, data, true, answerText);
      const evidence = `<span hidden data-source61-volume-e4-kind="${esc(kind)}" data-source-item="${sourceItemId}" data-pool-index="${poolIndex}" data-values="${esc(values.join(","))}" data-difficulty="${esc(difficulty)}"></span>`;
      return result(`${prompt}${hint}${challenge}${problemVisual}${evidence}`, answerText, solution, { answerVisual: `<div class="verified-answer-diagram source61-volume-e4-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${answerVisual}</div>`, poolIndex, sourceItemId });
    };

    const tiltIntro = "직육면체 모양의 수조 ㉮에 물을 가득 담은 후 ㉮의 수조를 모서리 ㄱㄴ이 바닥에 닿게 한 다음 45°만큼 기울인 모양을 옆에서 보았더니 ㉯와 같은 모양이 되었습니다.";
    const tiltSegmentStep = d => `㉯에서 물의 겉면 ㅂㅈ은 바닥과 평행하고 변 ㅂㅅ과 변 ㅅㅈ은 바닥과 45°를 이루므로 삼각형 ㅂㅅㅈ은 직각이등변삼각형입니다. 따라서 ㅅㅈ=ㅂㅅ=ㄴㄷ=${d.width}cm이고, ㅈㄷ=${d.height}-${d.width}=${d.segment}cm입니다.`;
    const tiltVolumeStep = d => `남은 물은 밑면이 사다리꼴 ㄴㄷㅈㅂ이고 높이가 ㄱㄴ=${d.depth}cm인 각기둥 모양이므로 물의 부피는 (${d.height}+${d.segment})×${d.width}÷2×${d.depth}=${(d.segment + d.height) * d.width / 2 * d.depth}${units.volume}입니다.`;
    if (kind === "exploration-1") {
      const d = pools.tilt[poolIndex];
      return make(`${tiltIntro} ㉯에서 선분 ㅈㄷ의 길이를 구하세요.`, `${d.segment}cm`, tiltSegmentStep(d), d, [d.depth, d.width, d.height, d.segment]);
    }
    if (kind === "exploration-2") {
      const d = pools.tilt[poolIndex];
      const volume = (d.segment + d.height) * d.width / 2 * d.depth;
      return make(`${tiltIntro} ㉯ 모양에서 다시 처음 상태와 같이 밑면 ㄱㄴㄷㄹ을 바닥에 닿게 한다면 물의 높이는 몇 cm가 됩니까?`, `${d.restored}cm`, `${tiltSegmentStep(d)} ${tiltVolumeStep(d)} 밑면 ㄱㄴㄷㄹ의 넓이는 ${d.depth}×${d.width}=${d.depth * d.width}${units.area}이므로 물의 높이는 ${volume}÷${d.depth * d.width}=${d.restored}cm입니다.`, d, [d.segment, d.height, d.width, d.depth, volume, d.restored]);
    }
    if (kind === "exploration-3") {
      const d = pools.tilt[poolIndex];
      const volume = (d.segment + d.height) * d.width / 2 * d.depth;
      const answer = mixedFractionText(d.sealedNumerator, d.sealedDenominator);
      return make(`${tiltIntro} ㉯ 수조에서 입구인 면 ㅁㅂㅅㅇ을 빈틈없이 막은 다음 면 ㄱㄴㅂㅁ을 바닥에 놓으면 물의 높이는 몇 cm가 됩니까?`, `${answer}cm`, `${tiltSegmentStep(d)} ${tiltVolumeStep(d)} 면 ㄱㄴㅂㅁ의 넓이는 ${d.depth}×${d.height}=${d.depth * d.height}${units.area}이므로 물의 높이는 ${volume}÷${d.depth * d.height}=${mixedFractionMarkup(d.sealedNumerator, d.sealedDenominator)}cm입니다.`, d, [d.segment, d.height, d.width, d.depth, volume, d.sealedNumerator, d.sealedDenominator]);
    }
    if (kind === "example-1") {
      const d = pools.overflow[poolIndex];
      const headspace = d.width * d.depth * (d.height - d.water);
      return make(`안치수가 오른쪽 그림과 같은 직육면체 모양의 어항이 있습니다. 이 어항에 물을 ${d.water}cm 높이만큼 부은 후 돌을 완전히 잠기도록 넣었더니 ${d.overflow / 1000}L의 물이 흘러넘쳤습니다. 이 돌의 부피는 몇 ${units.volume}입니까?`, `${num(d.answer)}${units.volume}`, `물 위의 빈 공간은 ${d.width}×${d.depth}×(${d.height}-${d.water})=${headspace}${units.volume}입니다. 흘러넘친 물 ${d.overflow / 1000}L는 ${d.overflow}${units.volume}이므로 돌의 부피는 ${headspace}+${d.overflow}=${d.answer}${units.volume}입니다.`, d, [d.width, d.depth, d.height, d.water, d.overflow, headspace, d.answer]);
    }
    if (kind === "example-2") {
      const d = pools.equal[poolIndex];
      const denominator = d.answerDenominator || 1;
      const answerNumerator = d.answerNumerator || d.answer;
      const answer = mixedFractionText(answerNumerator, denominator);
      return make(`안치수가 오른쪽 그림과 같은 직육면체 모양의 수조에 칸막이를 두 군데에 세웠습니다. 칸막이에 의해 나뉜 세 부분에 같은 양의 물을 넣었더니 물의 높이가 각각 ${d.heights.map(h => `${h}cm`).join(", ")}가 되었습니다. 칸막이를 빼내면 물의 높이는 몇 cm가 되는지 구하세요. (단, 칸막이의 두께는 생각하지 않습니다.)`, `${answer}cm`, `각 칸의 물의 양을 1이라고 하면 세 칸의 밑면 넓이는 각각 ${fractionMarkup(1, d.heights[0])}, ${fractionMarkup(1, d.heights[1])}, ${fractionMarkup(1, d.heights[2])}입니다. 칸막이를 빼면 물의 양은 3이고 밑면 넓이는 세 칸의 합이므로 높이는 3÷(${fractionMarkup(1, d.heights[0])}+${fractionMarkup(1, d.heights[1])}+${fractionMarkup(1, d.heights[2])})=${mixedFractionMarkup(answerNumerator, denominator)}cm입니다.`, d, [...d.heights, answerNumerator, denominator]);
    }
    if (kind === "example-3") {
      const d = pools.rod[poolIndex];
      const volume = d.width * d.depth * d.water;
      const open = d.width * d.depth - d.rod * d.rod;
      const answer = mixedFractionText(d.numerator, d.denominator);
      return make(`안치수가 오른쪽과 같은 직육면체 모양의 그릇에 [그림 1]과 같이 물이 들어 있습니다. 이 그릇에 직육면체 모양의 막대를 밑면이 바닥에 닿도록 [그림 2]와 같이 세웠습니다. 막대를 세운 후의 물의 높이는 몇 cm인지 구하세요.`, `${answer}cm`, `풀이 기준: [그림 2]에 ${d.rod}cm만 적혀 있으므로 막대의 밑면은 한 변이 ${d.rod}cm인 정사각형으로 봅니다. 처음 물의 부피는 ${d.width}×${d.depth}×${d.water}=${volume}${units.volume}입니다. 막대를 세운 뒤 물이 차는 밑면은 ${d.width}×${d.depth}-${d.rod}×${d.rod}=${open}${units.area}이므로 물의 높이는 ${volume}÷${open}=${mixedFractionMarkup(d.numerator, d.denominator)}cm입니다.`, d, [d.width, d.depth, d.height, d.water, d.rod, volume, open, d.numerator, d.denominator]);
    }
    if (kind === "example-4") {
      const d = pools.flow[poolIndex];
      const aRise = (d.inflow - d.transfer) / d.a;
      const bRise = d.transfer / d.b;
      const gap = bRise - aRise;
      return make(`오른쪽 그림에서 가 그릇에는 ${d.initial}cm의 물이 차 있는 상태에서 1분에 ${d.inflow / 1000}L씩 물이 들어오고 있으며, 동시에 가 그릇에서 나 그릇으로 1분에 ${d.transfer / 1000}L씩 물이 흘러내립니다. 두 그릇의 물의 높이가 같아질 때, 높이는 몇 cm가 됩니까?`, `${d.final}cm`, `가 그릇의 밑면 넓이는 ${d.aSides[0]}×${d.aSides[1]}=${d.a}${units.area}이고, 1분에 ${d.inflow}-${d.transfer}=${d.inflow - d.transfer}${units.volume}씩 물이 늘어나므로 1분에 ${d.inflow - d.transfer}÷${d.a}=${aRise}cm씩 높아집니다. 나 그릇의 밑면 넓이는 ${d.bSides[0]}×${d.bSides[1]}=${d.b}${units.area}이므로 1분에 ${d.transfer}÷${d.b}=${bRise}cm씩 높아집니다. 처음 높이의 차 ${d.initial}cm가 1분에 ${bRise}-${aRise}=${gap}cm씩 줄어들므로 ${d.initial}÷${gap}=${d.time}분 뒤 높이가 같아지고, 그때 높이는 ${d.initial}+${aRise}×${d.time}=${d.final}cm입니다.`, d, [...d.aSides, ...d.bSides, d.initial, d.inflow, d.transfer, aRise, bRise, d.time, d.final]);
    }
    if (kind === "mission-1") {
      const d = pools.units[poolIndex];
      const answer = `${num(d.answer)}mL`;
      return make(`다음 □ 안에 알맞은 수를 써넣으세요.`, answer, `1m³=1,000,000mL, 1cm³=1mL, 1dL=100mL, 1L=1,000mL이므로 ${d.converted}=${num(d.answer)}입니다. 따라서 □ 안에 알맞은 수는 ${num(d.answer)}입니다.`, d, [d.expression, d.converted, d.answer]);
    }
    if (kind === "mission-2") {
      const d = pools.thick[poolIndex];
      const innerW = d.width - 2 * d.thickness;
      const innerD = d.depth - 2 * d.thickness;
      const innerH = d.height - d.thickness;
      const answer = `${decimalLiters(d.answer)}L`;
      return make(`다음 그림과 같이 두께가 ${d.thickness}cm인 그릇에 물을 가득 채우면 물은 몇 L입니까?`, answer, `옆면의 두께는 양쪽에서 빼고 바닥의 두께는 한 번 뺍니다. 그릇의 안쪽은 (${d.width}-2×${d.thickness})×(${d.depth}-2×${d.thickness})×(${d.height}-${d.thickness})=${innerW}×${innerD}×${innerH}=${num(d.answer)}${units.volume}입니다. 1L=1,000${units.volume}이므로 물은 ${decimalLiters(d.answer)}L입니다.`, d, [d.width, d.depth, d.height, d.thickness, innerW, innerD, innerH, d.answer]);
    }
    if (kind === "mission-3") {
      const d = pools.spill[poolIndex];
      const initial = d.height * d.width * d.depth * d.ratioNumerator / d.ratioDenominator;
      const remaining = (d.height * d.width - d.width * d.width / 2) * d.depth;
      const answer = `${num(d.answer)}mL`;
      return make(`안치수가 아래 왼쪽과 같은 직육면체 모양의 수조에 물을 전체의 ${fractionMarkup(d.ratioNumerator, d.ratioDenominator)}만큼 부었습니다. 이 수조를 선분 ㄱㄴ을 중심으로 45° 기울였더니 물이 쏟아졌습니다. 쏟아진 물의 양은 몇 mL입니까?`, answer, `처음 물은 ${d.width}×${d.depth}×${d.height}×${fractionMarkup(d.ratioNumerator, d.ratioDenominator)}=${initial}${units.volume}입니다. 선분 ㄱㄴ(${d.depth}cm)을 중심으로 45° 기울이면 ㄱㄴ에 수직인 단면(가로 ${d.width}cm, 높이 ${d.height}cm)에서 물이 없는 부분은 두 변이 ${d.width}cm인 직각이등변삼각형이므로 남은 물은 (${d.height}×${d.width}-${d.width}×${d.width}÷2)×${d.depth}=${remaining}${units.volume}입니다. 쏟아진 물은 ${initial}-${remaining}=${d.answer}${units.volume}이므로 ${num(d.answer)}mL입니다.`, d, [d.height, d.width, d.depth, initial, remaining, d.answer]);
    }
    if (kind === "mission-4") {
      const d = pools.stone[poolIndex];
      const initial = d.width * d.depth * d.water;
      const answer = `${d.answer}cm`;
      return make(`안치수가 다음 그림과 같은 그릇에 물이 ${d.water}cm 높이만큼 들어 있습니다. 이 그릇에 부피가 ${d.stone}${units.volume}인 돌을 완전히 잠기도록 넣으면 물의 높이는 몇 cm가 됩니까?`, answer, `처음 물의 양은 ${d.width}×${d.depth}×${d.water}=${initial}${units.volume}입니다. 돌을 넣은 뒤 물과 돌의 부피는 ${initial}+${d.stone}=${initial + d.stone}${units.volume}이므로 물의 높이는 ${initial + d.stone}÷(${d.width}×${d.depth})=${d.answer}cm입니다. 그릇의 높이 ${d.height}cm보다 낮으므로 물은 넘치지 않습니다.`, d, [d.width, d.depth, d.height, d.water, d.stone, initial, d.answer]);
    }
    if (kind === "mission-5") {
      const d = pools.displacement[poolIndex];
      const initial = d.width * d.depth * d.water;
      const open = d.width * d.depth - d.rodWidth * d.rodDepth;
      return make(`오른쪽과 같이 직육면체 모양의 물통에 물을 ${d.water}cm 높이만큼 넣은 후 가로가 ${d.rodWidth}cm, 세로가 ${d.rodDepth}cm인 직육면체 모양의 나무 막대를 세웠습니다. 물의 높이는 몇 cm가 되는지 구하세요.`, `${d.answer}cm`, `물의 부피는 ${d.width}×${d.depth}×${d.water}=${initial}${units.volume}입니다. 막대를 세운 뒤 물이 차는 밑면은 ${d.width}×${d.depth}-${d.rodWidth}×${d.rodDepth}=${open}${units.area}이므로 물의 높이는 ${initial}÷${open}=${d.answer}cm입니다.`, d, [d.width, d.depth, d.water, d.rodWidth, d.rodDepth, initial, open, d.answer]);
    }
    const d = pools.partition[poolIndex];
    const depth = d.volume / (d.right * d.shownHeight);
    const totalVolume = d.volume * 2;
    const totalBase = (d.left + d.right) * depth;
    const answerNumerator = d.answerNumerator || d.answer;
    const answerDenominator = d.answerDenominator || 1;
    return make(`안치수가 다음 그림과 같은 직육면체 모양의 그릇에 칸막이를 밑면에 수직이 되도록 넣고 두 부분에 ${d.volume / 1000}L씩의 물을 각각 부었습니다. 그릇에 넣은 칸막이를 빼내면, 물의 높이는 몇 cm가 됩니까? (단, 칸막이의 두께는 생각하지 않습니다.)`, `${mixedFractionText(answerNumerator, answerDenominator)}cm`, `${d.volume / 1000}L=${d.volume}${units.volume}입니다. 가로 ${d.right}cm인 부분의 물의 높이가 ${d.shownHeight}cm이므로 그릇의 세로는 ${d.volume}÷(${d.right}×${d.shownHeight})=${depth}cm입니다. 전체 물의 양은 ${d.volume}×2=${totalVolume}${units.volume}, 전체 밑면은 (${d.left}+${d.right})×${depth}=${totalBase}${units.area}이므로 높이는 ${totalVolume}÷${totalBase}=${mixedFractionMarkup(answerNumerator, answerDenominator)}cm입니다.`, d, [d.volume, d.left, d.right, d.shownHeight, depth, totalVolume, totalBase, answerNumerator, answerDenominator]);
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => type?.generatorKey === "sourceGrade6VolumeE4" ? "sourceGrade6VolumeE4" : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (type?.generatorKey !== "sourceGrade6VolumeE4") return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const rng = (() => {
      let state = seed >>> 0;
      return () => {
        state = Math.imul(state ^ state >>> 15, 1 | state) + 0x6D2B79F5 | 0;
        let value = Math.imul(state ^ state >>> 7, 61 | state) ^ state;
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
      };
    })();
    const level = Math.max(0, Math.min(2, 1 + difficultyOffset));
    const resolvedVariant = Number.isInteger(type?.variant) ? type.variant : variant;
    return { ...generator({ rng, level, variant: resolvedVariant }), generator: "sourceGrade6VolumeE4" };
  };
})();
