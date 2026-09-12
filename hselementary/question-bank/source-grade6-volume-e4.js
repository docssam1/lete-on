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
      { width: 40, depth: 20, water: 15, rod: 8, numerator: 375, denominator: 23 },
      { width: 36, depth: 24, water: 12, rod: 6, numerator: 288, denominator: 23 },
      { width: 30, depth: 25, water: 10, rod: 5, numerator: 300, denominator: 29 }
    ],
    flow: [
      { a: 1600, b: 400, initial: 30, inflow: 3000, transfer: 1400, time: 12, final: 42 },
      { a: 2000, b: 400, initial: 28, inflow: 4000, transfer: 1600, time: 10, final: 40 },
      { a: 1200, b: 300, initial: 24, inflow: 2400, transfer: 1200, time: 8, final: 32 }
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
      { width: 16, depth: 16, water: 10, stone: 1280, answer: 15 },
      { width: 18, depth: 18, water: 8, stone: 1296, answer: 12 },
      { width: 20, depth: 20, water: 9, stone: 1200, answer: 12 }
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

  const tiltedSvg = (d, stage, solved, answer) => {
    const target = stage === "segment" ? d.segment : stage === "restored" ? d.restored : d.sealedNumerator / d.sealedDenominator;
    const solvedText = stage === "segment" ? String(d.segment) : stage === "restored" ? String(d.restored) : mixedFractionText(d.sealedNumerator, d.sealedDenominator);
    const title = stage === "segment" ? "(가) 입체 수조와 (나) 45° 기울인 단면" : stage === "restored" ? "수조를 원래 바닥면으로 바로 세운 모습" : "입구를 막고 새 바닥면으로 놓은 모습";
    let content;
    let required;
    if (stage === "segment") {
      const tank = isoTank({ x: 54, y: 70, width: 165, height: 148, depthX: 38, depthY: 24 }, d.restored / d.height, solved);
      const diamond = diamondTank({ centerX: 474, centerY: 154, radius: 76 }, solved, solved ? `ㄴㅈ = ${d.segment}cm` : "ㄴㅈ = □ cm");
      content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">${title}</text>${label(145, 54, "(가)", "source61-volume-e4-subtitle")}${tank.markup}${label(148, 270, `가로 ${d.width}cm · 깊이 ${d.depth}cm`)}${label(244, 145, `높이 ${d.height}cm`, "source61-volume-e4-label", "start")}${label(474, 54, "(나)", "source61-volume-e4-subtitle")}${diamond}`;
      required = ["solid-tank", "depth-edge", "tilted-cross-section", "tilted-face", "water-segment", "bottom-contact"];
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
    const left = isoTank({ x: 62, y: 88, width: 190, height: 128, depthX: 42, depthY: 25 }, d.water / (d.water + 12), false);
    const finalHeight = d.numerator / d.denominator;
    const right = isoTank({ x: 350, y: 82, width: 178, height: 134, depthX: 42, depthY: 25 }, finalHeight / (finalHeight + 10), solved, { water: "raised-water-surface" });
    const rod = isoSolid({ x: 418, y: 55, width: 48, height: 174, depthX: 20, depthY: 12 }, solved, "square-rod-solid");
    const heightLabel = solved ? svgMeasurementLabel({ x: 324, y: right.water.frontWaterLeft.y + 2, value: mixedFractionText(d.numerator, d.denominator), unitName: "cm", className: "source61-volume-e4-target is-solved" }) : label(336, right.water.frontWaterLeft.y + 4, "□ cm", "source61-volume-e4-target", "end");
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">정사각형 막대를 세우기 전과 후</text>${label(165, 72, "[처음]")}${left.markup}${label(157, 270, `바닥 ${d.width}cm × ${d.depth}cm`)}${label(48, left.water.frontWaterLeft.y + 4, `${d.water}cm`, "source61-volume-e4-label", "end")}${label(455, 72, "[막대를 세운 뒤]")}${right.markup}${rod}${label(492, 270, `막대 밑면 ${d.rod}cm × ${d.rod}cm`)}${heightLabel}`;
    return wrapper("square-rod", content, [d.width, d.depth, d.water, d.rod, d.numerator, d.denominator], solved, answer, "정사각형 막대를 세운 입체 그릇", ["solid-tank", "depth-edge", "raised-water-surface", "square-rod-solid", "square-rod-solid-top"]);
  };

  const flowSvg = (d, solved, answer) => {
    const left = isoTank({ x: 70, y: 78, width: 210, height: 145, depthX: 48, depthY: 28 }, d.initial / (d.final + 12), solved, { water: "tank-a-water" });
    const right = isoTank({ x: 425, y: 115, width: 120, height: 108, depthX: 34, depthY: 20 }, solved ? 0.72 : 0.18, solved, { water: "tank-b-water" });
    const flow = `<path class="source61-volume-e4-flow-arrow" d="M288 148 C340 118 382 130 424 164" data-visual-element="transfer-flow"/><path class="source61-volume-e4-arrow-head" d="M413 154 L426 164 L410 169"/>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">가 그릇으로 들어오고 나 그릇으로 흐르는 물</text>${left.markup}${right.markup}${flow}${label(178, 70, `가: 밑면 ${d.a}${units.area}`)}${label(492, 108, `나: 밑면 ${d.b}${units.area}`)}${label(58, left.water.frontWaterLeft.y + 4, `처음 ${d.initial}cm`, "source61-volume-e4-label", "end")}${label(346, 108, `매분 ${d.transfer}mL`, "source61-volume-e4-arrow-text")}${label(320, 280, solved ? `${d.time}분 뒤 두 높이 ${d.final}cm` : "두 물높이가 같아지는 높이", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}`;
    return wrapper("flow-equal-height", content, [d.a, d.b, d.initial, d.inflow, d.transfer, d.time, d.final], solved, answer, "두 입체 그릇 사이의 물 이동", ["solid-tank", "depth-edge", "tank-a-water", "tank-b-water", "transfer-flow"]);
  };

  const unitSvg = (d, solved, answer) => {
    const rows = [[units.cubicMeter, "1,000,000mL"], [units.volume, "1mL"], ["dL", "100mL"], ["L", "1,000mL"]];
    const table = rows.map((row, index) => `<g><rect class="source61-volume-e4-table-row${index % 2 ? " alt" : ""}" x="154" y="${54 + index * 34}" width="332" height="34"/><text class="source61-volume-e4-table-text" x="200" y="${76 + index * 34}">${row[0]}</text><text class="source61-volume-e4-table-text" x="340" y="${76 + index * 34}">${row[1]}</text></g>`).join("");
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">단위표를 이용한 물의 양 계산</text><g data-visual-element="unit-table">${table}</g>${label(320, 236, solved ? `${num(d.answer)}mL` : "□mL", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}`;
    return wrapper("unit-conversion", content, [d.expression, d.answer], solved, `${num(d.answer)}mL`, "부피 단위 관계표", ["unit-table"]);
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
    return wrapper("wall-thickness", content, [d.width, d.depth, d.height, d.thickness, d.answer], solved, `${num(d.answer)}${units.volume} = ${decimalLiters(d.answer)}L`, "두께가 있는 입체 직육면체 그릇", ["solid-tank", "depth-edge", "side-wall-thickness", "front-wall-thickness", "left-wall-thickness", "right-wall-thickness", "inner-opening", "bottom-thickness"]);
  };
  const decimalLiters = value => (value / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 2 });

  const spillSvg = (d, solved, answer) => {
    const upright = isoTank({ x: 48, y: 98, width: 180, height: 128, depthX: 42, depthY: 26 }, d.ratioNumerator / d.ratioDenominator, false);
    const cx = 460, cy = 160, radius = 72, offset = 30;
    const front = [point(cx, cy - radius), point(cx + radius, cy), point(cx, cy + radius), point(cx - radius, cy)];
    const back = front.map(value => point(value.x + offset, value.y - 18));
    const waterLeft = point(cx - radius + 16, cy + 16), waterRight = point(cx + radius - 16, cy + 16);
    const backWaterLeft = point(waterLeft.x + offset, waterLeft.y - 18), backWaterRight = point(waterRight.x + offset, waterRight.y - 18);
    const tilted = `<g data-visual-element="tilted-solid">${polygon(front, "source61-volume-e4-diamond", "tilted-front-face")}${polygon(back, "source61-volume-e4-hidden-face", "tilted-back-face")}${front.map((value, index) => segment(value, back[index], "source61-volume-e4-depth-edge", `tilted-depth-edge-${index + 1}`)).join("")}${polygon([waterLeft, waterRight, front[2]], `source61-volume-e4-water${solved ? " is-solved" : ""}`, "tilted-water-front")}${polygon([waterLeft, backWaterLeft, backWaterRight, waterRight], `source61-volume-e4-water${solved ? " is-solved" : ""}`, "tilted-water-surface")}${segment(point(front[2].x - 66, front[2].y), point(front[2].x + 66, front[2].y), "source61-volume-e4-floor", "bottom-contact")}${label(front[2].x - 56, front[2].y - 8, "45°", "source61-volume-e4-angle")}</g>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">물을 채운 수조를 중심으로 45° 기울인 모습</text>${label(145, 76, "[기울이기 전]")}${upright.markup}${label(145, 274, `${d.height}cm × ${d.width}cm × ${d.depth}cm`)}${label(458, 76, "[45° 기울인 뒤]")}${tilted}${label(322, 154, "→", "source61-volume-e4-arrow-text")}${label(460, 278, solved ? `${num(d.answer)}mL 쏟아짐` : "쏟아진 물의 양", `source61-volume-e4-target${solved ? " is-solved" : ""}`)}`;
    return wrapper("tilted-spill", content, [d.height, d.width, d.depth, d.ratioNumerator, d.ratioDenominator, d.answer], solved, `${num(d.answer)}mL`, "45도 기울인 입체 수조", ["solid-tank", "depth-edge", "water-surface", "tilted-solid", "tilted-front-face", "tilted-back-face", "tilted-water-surface", "bottom-contact"]);
  };

  const stoneSvg = (d, solved, answer) => {
    const maximumHeight = Math.max(d.answer + 3, 18);
    const tank = isoTank({ x: 142, y: 70, width: 300, height: 165, depthX: 72, depthY: 40 }, (solved ? d.answer : d.water) / maximumHeight, solved, { water: solved ? "raised-water-surface" : "water-surface" });
    const stoneCenter = solved ? point(310, tank.water.frontWaterLeft.y + 46) : point(320, 66);
    const stonePath = `<path class="source61-volume-e4-stone${solved ? " is-solved" : ""}" d="M${stoneCenter.x - 30} ${stoneCenter.y + 4} L${stoneCenter.x - 22} ${stoneCenter.y - 18} L${stoneCenter.x + 8} ${stoneCenter.y - 25} L${stoneCenter.x + 30} ${stoneCenter.y - 4} L${stoneCenter.x + 20} ${stoneCenter.y + 22} L${stoneCenter.x - 10} ${stoneCenter.y + 28} Z" data-visual-element="stone-object"/>`;
    const arrow = solved ? "" : `<path class="source61-volume-e4-flow-arrow" d="M355 55 C380 78 372 104 346 124" data-visual-element="submerge-arrow"/><path class="source61-volume-e4-arrow-head" d="M340 113 L345 127 L357 117"/>`;
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">돌을 완전히 잠기게 넣는 입체 그릇</text>${tank.markup}${stonePath}${arrow}${label(292, 284, `바닥 ${d.width}cm × ${d.depth}cm`)}${label(128, tank.water.frontWaterLeft.y + 4, solved ? `물높이 ${d.answer}cm` : `처음 ${d.water}cm`, `source61-volume-e4-target${solved ? " is-solved" : ""}`, "end")}${label(510, 58, `돌 ${num(d.stone)}${units.volume}`, "source61-volume-e4-note")}`;
    return wrapper("submerged-stone", content, [d.width, d.depth, d.water, d.stone, d.answer], solved, `${d.answer}cm`, "돌이 잠긴 입체 수조", ["solid-tank", "depth-edge", solved ? "raised-water-surface" : "water-surface", "stone-object", ...(solved ? [] : ["submerge-arrow"])]);
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
    const finalHeightLabel = solved ? `${label(402, 178, "높이", "source61-volume-e4-target is-solved")}${svgMeasurementLabel({ x: 474, y: 176, value: answerValue, unitName: "cm", className: "source61-volume-e4-target is-solved" })}` : label(458, 178, `오른쪽 ${d.shownHeight}cm`, "source61-volume-e4-target");
    const content = `<text class="source61-volume-e4-title" x="320" y="28" text-anchor="middle">같은 양의 물을 넣은 두 칸 입체 그릇</text>${tank.markup}${water}${divider}${label(m.frontTopLeft.x + (dividerX - m.frontTopLeft.x) / 2, 282, `${d.left}cm`)}${label(dividerX + (m.frontTopRight.x - dividerX) / 2, 282, `${d.right}cm`)}${label(580, 126, `깊이 ${depth}cm`, "source61-volume-e4-note", "end")}${finalHeightLabel}`;
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

    if (kind === "exploration-1") {
      const d = pools.tilt[poolIndex];
      return make(`수조를 45° 기울였을 때 물의 단면에서 표시된 선분의 길이를 구하세요. 수조의 깊이는 ${d.depth}cm, 가로는 ${d.width}cm, 세로는 ${d.height}cm입니다.`, `${d.segment}cm`, `원본 단면에서 표시된 선분의 길이는 ${d.segment}cm입니다. 물의 양은 다음 문항에서도 같은 값으로 이어집니다.`, d, [d.depth, d.width, d.height, d.segment]);
    }
    if (kind === "exploration-2") {
      const d = pools.tilt[poolIndex];
      const volume = (d.segment + d.height) * d.width / 2 * d.depth;
      return make(`앞 문항의 수조를 바로 놓았습니다. 물의 양은 그대로일 때 물의 높이를 구하세요.`, `${d.restored}cm`, `기울였을 때 물의 부피는 (${d.segment}+${d.height})×${d.width}÷2×${d.depth}=${volume}${units.volume}입니다. 바로 놓은 뒤 높이는 ${volume}÷(${d.width}×${d.depth})=${d.restored}cm입니다.`, d, [d.segment, d.height, d.width, d.depth, volume, d.restored]);
    }
    if (kind === "exploration-3") {
      const d = pools.tilt[poolIndex];
      const volume = (d.segment + d.height) * d.width / 2 * d.depth;
      const answer = mixedFractionText(d.sealedNumerator, d.sealedDenominator);
      return make(`앞 문항의 물을 그대로 두고 수조의 입구를 막은 뒤, ${d.height}cm×${d.depth}cm인 면을 바닥에 놓았습니다. 물의 높이를 구하세요.`, `${answer}cm`, `물의 부피는 ${volume}${units.volume}입니다. 물높이는 ${volume}÷(${d.height}×${d.depth})=${mixedFractionMarkup(d.sealedNumerator, d.sealedDenominator)}cm입니다.`, d, [d.segment, d.height, d.width, d.depth, volume, d.sealedNumerator, d.sealedDenominator]);
    }
    if (kind === "example-1") {
      const d = pools.overflow[poolIndex];
      const headspace = d.width * d.depth * (d.height - d.water);
      return make(`가로 ${d.width}cm, 세로 ${d.depth}cm, 높이 ${d.height}cm인 어항에 물을 ${d.water}cm 높이로 넣었습니다. 돌을 완전히 잠기게 넣었더니 물 ${d.overflow / 1000}L가 넘쳤습니다. 돌의 부피를 구하세요.`, `${num(d.answer)}${units.volume}`, `물 위 빈 공간은 ${d.width}×${d.depth}×(${d.height}-${d.water})=${headspace}${units.volume}입니다. 돌의 부피는 ${headspace}+${d.overflow}=${d.answer}${units.volume}입니다.`, d, [d.width, d.depth, d.height, d.water, d.overflow, headspace, d.answer]);
    }
    if (kind === "example-2") {
      const d = pools.equal[poolIndex];
      const denominator = d.answerDenominator || 1;
      const answerNumerator = d.answerNumerator || d.answer;
      const answer = mixedFractionText(answerNumerator, denominator);
      return make(`직육면체 수조를 세 칸으로 나누어 물을 같은 양씩 담았습니다. 물의 높이는 차례로 ${d.heights.map(h => `${h}cm`).join(", ")}입니다. 칸막이를 뺀 뒤 물의 높이를 구하세요.`, `${answer}cm`, `각 칸의 물의 양을 1이라고 하면 전체 밑면 넓이는 ${fractionMarkup(1, d.heights[0])}+${fractionMarkup(1, d.heights[1])}+${fractionMarkup(1, d.heights[2])}입니다. 따라서 높이는 3÷(${fractionMarkup(1, d.heights[0])}+${fractionMarkup(1, d.heights[1])}+${fractionMarkup(1, d.heights[2])})=${mixedFractionMarkup(answerNumerator, denominator)}cm입니다.`, d, [...d.heights, answerNumerator, denominator]);
    }
    if (kind === "example-3") {
      const d = pools.rod[poolIndex];
      const volume = d.width * d.depth * d.water;
      const open = d.width * d.depth - d.rod * d.rod;
      const answer = mixedFractionText(d.numerator, d.denominator);
      return make(`가로 ${d.width}cm, 세로 ${d.depth}cm인 그릇에 물을 ${d.water}cm 높이로 넣었습니다. 한 변이 ${d.rod}cm인 정사각형 막대를 바닥에 세웠을 때 물의 높이를 구하세요.`, `${answer}cm`, `처음 물의 부피는 ${d.width}×${d.depth}×${d.water}=${volume}${units.volume}입니다. 물이 차는 밑면은 ${d.width}×${d.depth}-${d.rod}×${d.rod}=${open}${units.area}이므로 물높이는 ${volume}÷${open}=${mixedFractionMarkup(d.numerator, d.denominator)}cm입니다.`, d, [d.width, d.depth, d.water, d.rod, volume, open, d.numerator, d.denominator]);
    }
    if (kind === "example-4") {
      const d = pools.flow[poolIndex];
      const aRate = (d.inflow - d.transfer) / d.a;
      const bRate = d.transfer / d.b;
      return make(`가 그릇의 밑면 넓이는 ${d.a}${units.area}이고 물높이는 ${d.initial}cm입니다. 매분 ${d.inflow / 1000}L가 들어오고 그중 ${d.transfer / 1000}L가 나 그릇으로 흘러갑니다. 나 그릇의 밑면 넓이는 ${d.b}${units.area}일 때, 두 물높이가 같아지는 높이를 구하세요.`, `${d.final}cm`, `가의 높이는 매분 ${aRate}cm, 나의 높이는 매분 ${bRate}cm씩 변합니다. ${d.initial}+${aRate}t=${bRate}t이므로 t=${d.time}분이고 같은 높이는 ${d.initial}+${aRate}×${d.time}=${d.final}cm입니다.`, d, [d.a, d.b, d.initial, d.inflow, d.transfer, aRate, bRate, d.time, d.final]);
    }
    if (kind === "mission-1") {
      const d = pools.units[poolIndex];
      const answer = `${num(d.answer)}mL`;
      return make(`${d.expression}을 mL로 나타내세요.`, answer, `${d.converted}=${num(d.answer)}mL입니다.`, d, [d.expression, d.converted, d.answer]);
    }
    if (kind === "mission-2") {
      const d = pools.thick[poolIndex];
      const innerW = d.width - 2 * d.thickness;
      const innerD = d.depth - 2 * d.thickness;
      const innerH = d.height - d.thickness;
      const answer = `${num(d.answer)}${units.volume} = ${decimalLiters(d.answer)}L`;
      return make(`바깥 크기가 ${d.width}cm×${d.depth}cm×${d.height}cm인 그릇의 두께가 ${d.thickness}cm입니다. 그릇에 가득 담을 수 있는 물의 양을 구하세요.`, answer, `벽 두께는 양쪽에서 빼고 바닥 두께는 한 번 뺍니다. 안쪽은 (${d.width}-2×${d.thickness})×(${d.depth}-2×${d.thickness})×(${d.height}-${d.thickness})=${innerW}×${innerD}×${innerH}=${d.answer}${units.volume}=${decimalLiters(d.answer)}L입니다.`, d, [d.width, d.depth, d.height, d.thickness, innerW, innerD, innerH, d.answer]);
    }
    if (kind === "mission-3") {
      const d = pools.spill[poolIndex];
      const initial = d.height * d.width * d.depth * d.ratioNumerator / d.ratioDenominator;
      const remaining = (d.height * d.width - d.width * d.width / 2) * d.depth;
      const answer = `${num(d.answer)}mL`;
      return make(`가로 단면의 높이가 ${d.height}cm, 길이가 ${d.width}cm, 깊이가 ${d.depth}cm인 수조에 물을 전체의 ${fractionMarkup(d.ratioNumerator, d.ratioDenominator)}만큼 넣었습니다. 수조를 45° 기울였을 때 쏟아진 물의 양을 구하세요.`, answer, `처음 물은 ${d.height}×${d.width}×${d.depth}×${fractionMarkup(d.ratioNumerator, d.ratioDenominator)}=${initial}mL입니다. 기울인 뒤 남은 단면은 사다리꼴이므로 남은 물은 (${d.height}×${d.width}-${d.width}×${d.width}÷2)×${d.depth}=${remaining}mL입니다. 쏟아진 물은 ${initial}-${remaining}=${d.answer}mL입니다.`, d, [d.height, d.width, d.depth, initial, remaining, d.answer]);
    }
    if (kind === "mission-4") {
      const d = pools.stone[poolIndex];
      const initial = d.width * d.depth * d.water;
      const answer = `${d.answer}cm`;
      return make(`가로 ${d.width}cm, 세로 ${d.depth}cm인 그릇에 물을 ${d.water}cm 높이로 넣었습니다. 부피가 ${d.stone}${units.volume}인 돌을 완전히 잠기게 넣었을 때 물의 높이를 구하세요.`, answer, `처음 물의 양은 ${d.width}×${d.depth}×${d.water}=${initial}${units.volume}입니다. 돌을 넣은 뒤 ${initial}+${d.stone}=${initial + d.stone}${units.volume}가 되고, 물높이는 ${initial + d.stone}÷(${d.width}×${d.depth})=${d.answer}cm입니다.`, d, [d.width, d.depth, d.water, d.stone, initial, d.answer]);
    }
    if (kind === "mission-5") {
      const d = pools.displacement[poolIndex];
      const initial = d.width * d.depth * d.water;
      const open = d.width * d.depth - d.rodWidth * d.rodDepth;
      return make(`가로 ${d.width}cm, 세로 ${d.depth}cm인 그릇에 물을 ${d.water}cm 높이로 넣었습니다. 가로 ${d.rodWidth}cm, 세로 ${d.rodDepth}cm인 막대를 바닥에 세웠을 때 물의 높이를 구하세요.`, `${d.answer}cm`, `물의 부피는 ${initial}${units.volume}입니다. 물이 차는 밑면은 ${d.width}×${d.depth}-${d.rodWidth}×${d.rodDepth}=${open}${units.area}이므로 물높이는 ${initial}÷${open}=${d.answer}cm입니다.`, d, [d.width, d.depth, d.water, d.rodWidth, d.rodDepth, initial, open, d.answer]);
    }
    const d = pools.partition[poolIndex];
    const depth = d.volume / (d.right * d.shownHeight);
    const totalVolume = d.volume * 2;
    const totalBase = (d.left + d.right) * depth;
    const answerNumerator = d.answerNumerator || d.answer;
    const answerDenominator = d.answerDenominator || 1;
    return make(`칸막이로 나눈 두 부분에 각각 ${d.volume / 1000}L의 물이 있습니다. 두 부분의 가로는 각각 ${d.left}cm, ${d.right}cm이고, ${d.right}cm인 쪽의 물높이는 ${d.shownHeight}cm입니다. 칸막이를 뺀 뒤 물의 높이를 구하세요.`, `${mixedFractionText(answerNumerator, answerDenominator)}cm`, `공통 깊이는 ${d.volume}÷(${d.right}×${d.shownHeight})=${depth}cm입니다. 전체 물의 양은 ${totalVolume}${units.volume}, 전체 밑면은 (${d.left}+${d.right})×${depth}=${totalBase}${units.area}이므로 높이는 ${totalVolume}÷${totalBase}=${mixedFractionMarkup(answerNumerator, answerDenominator)}cm입니다.`, d, [d.volume, d.left, d.right, d.shownHeight, depth, totalVolume, totalBase, answerNumerator, answerDenominator]);
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
