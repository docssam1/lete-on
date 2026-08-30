"use strict";

const fs = require("node:fs");
const path = require("node:path");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  console.error(`4-2 다각형 브라우저 감사: Playwright를 사용할 수 없습니다. ${error.message}`);
  process.exit(2);
}

global.window = {};
require("./curriculum.js");
require("./generators.js");

const inventoryPath = path.join(__dirname, "source-inventory", "4-2-unit-6-polygon.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const generatorApi = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester?.units.find(item => item.id === "4-2-u6");
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "4-2-polygon-browser-audit");
const failures = [];
let screenshotCount = 0;
let pdfCount = 0;
let generatedCount = 0;

const fail = message => failures.push(message);
const slug = value => String(value).replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
const itemId = value => `data-source42-polygon-item="${value}"`;
const invalidOutputPattern = /\b(?:undefined|null|NaN|Infinity)\b|(?:^|[^\d])\d+(?:\.\d+)?\/0(?:[^\d]|$)/;

const expectedAnswers = new Map([
  ["polygonDiagonals", new Map([
    [0, "35"], [1, "18"], [2, "54"], [3, "54"], [4, "정10각형, 정12각형"], [5, "24"],
    [6, "20"], [7, "450"], [8, "84"], [9, "정15각형, 정18각형"], [10, "36cm, 27개"]
  ])],
  ["regularPolygonApplication", new Map([[0, "36"], [1, "15"], [2, "60°, 453cm"], [3, "66"], [4, "112.5"], [5, "135"], [6, "52"], [7, "36"], [8, "15"], [9, "66"], [10, "54"]])],
  ["tessellationCover", new Map([[0, "8"], [1, "12"], [2, "4"], [3, "7"], [4, "8"], [5, "36"], [6, "4"], [7, "상희"], [8, "24"], [9, "16"], [10, "34"]])],
  ["shapePartitionCompose", new Map([[4, "9"], [8, "48"]])]
]);
const regularPolygonAngleContracts = new Map([
  [3, { angle: "66", adjacentAngle: "114", angleRays: "144210", markedVertex: "Q" }],
  [4, { angle: "112.5", adjacentAngle: "67.5", angleRays: true, markedVertex: "ㅂ", givenAngle: "45", givenAngleRays: "N-D;G-D", intersectionSegments: "G-N;G-R;G-D;G-M;N-D;R-M", polygonOrientation: "flat-top", rightAngle: "G-R-M" }],
  [5, { angle: "135", adjacentAngle: "45", angleRays: true, markedVertex: true }],
  [8, { angle: "15", adjacentAngle: "165", angleRays: true, markedVertex: true, notToScale: "true", givenAngle: "27", coordinateGivenAngle: "26.8725668", coordinateTargetAngle: "14.8725668" }],
  [9, { angle: "66", adjacentAngle: "114", angleRays: "144210", markedVertex: "ㅈ" }],
  [10, { angle: "54", adjacentAngle: "126", angleRays: true, markedVertex: "ㅂ" }]
]);

const generatorBySubunit = new Map([
  ["정다각형과 대각선", "polygonDiagonals"],
  ["정다각형의 활용", "regularPolygonApplication"],
  ["평면 덮기", "tessellationCover"],
  ["도형 나누기와 만들기", "shapePartitionCompose"]
]);

const types = unit ? unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitId: subunit.id,
  subunitName: subunit.name
}))) : [];
const inventoryById = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const readyTypes = types.filter(type => inventoryById.get(type.sourceItemId)?.implementationStatus === "ready");
const lockedTypes = types.filter(type => inventoryById.get(type.sourceItemId)?.implementationStatus === "review-locked");

function auditInventoryContract() {
  if (!semester || !unit) {
    fail("4-2 6단원 다각형을 교육과정에서 찾지 못했습니다.");
    return;
  }
  if (inventory.items.length !== 44) fail(`원문 인벤토리는 44개여야 하나 ${inventory.items.length}개입니다.`);
  if (types.length !== inventory.items.length) fail(`교육과정 유형 ${types.length}개와 인벤토리 ${inventory.items.length}개가 다릅니다.`);
  const seenTypeIds = new Set();
  const seenSourceIds = new Set();
  for (const type of types) {
    if (seenTypeIds.has(type.id)) fail(`교육과정 유형 ID가 중복됩니다: ${type.id}`);
    seenTypeIds.add(type.id);
    if (seenSourceIds.has(type.sourceItemId)) fail(`교육과정 원문 ID가 중복됩니다: ${type.sourceItemId}`);
    seenSourceIds.add(type.sourceItemId);
    const source = inventoryById.get(type.sourceItemId);
    if (!source) {
      fail(`${type.id}: 인벤토리에 없는 원문 ID입니다.`);
      continue;
    }
    for (const field of ["sourceSection", "sourcePdfPage", "sourcePrintedPage"]) {
      if (type[field] !== source[field]) fail(`${type.id}: ${field}가 인벤토리와 다릅니다.`);
    }
    const inventoryLocked = source.implementationStatus === "review-locked";
    if (Boolean(type.reviewLocked) !== inventoryLocked) fail(`${type.id}: 잠금 상태가 인벤토리와 다릅니다.`);
    if (inventoryLocked && !String(type.reviewReason || "").trim()) fail(`${type.id}: 검수 대기 사유가 없습니다.`);
    if (type.label !== source.typeLabel || type.name !== source.typeLabel) fail(`${type.id}: 유형명이 원문 인벤토리와 다릅니다.`);
    if (!type.sourceVerified || !String(type.sourceEvidence || "").includes(type.label)) fail(`${type.id}: 유형별 원문 근거가 없습니다.`);
    if (generatorBySubunit.get(type.subunitName) !== type.generatorKey) fail(`${type.id}: 소단원과 생성기 연결이 다릅니다.`);
    if (!Number.isInteger(type.variant) || type.variant < 0 || type.variant > 10) fail(`${type.id}: 변형 번호가 0~10이 아닙니다.`);
  }
  for (const source of inventory.items) if (!seenSourceIds.has(source.sourceItemId)) fail(`${source.sourceItemId}: 교육과정에 연결되지 않았습니다.`);
  if (readyTypes.length + lockedTypes.length !== 44) fail(`준비·잠금 유형 합계가 44개가 아닙니다.`);
  if (readyTypes.length !== 35) fail(`다각형 공개 유형은 35개여야 하나 ${readyTypes.length}개입니다.`);
  if (lockedTypes.length !== 9) fail(`다각형 검수 대기 유형은 9개여야 하나 ${lockedTypes.length}개입니다.`);
  for (const subunit of unit.subunits) {
    const variants = subunit.types.map(type => type.variant).sort((a, b) => a - b).join(",");
    if (subunit.types.length !== 11 || variants !== "0,1,2,3,4,5,6,7,8,9,10") fail(`${subunit.name}: 원문 11개 변형 구조가 아닙니다.`);
  }
}

function auditStaticGeneration() {
  for (const type of readyTypes) {
    const answerMap = expectedAnswers.get(type.generatorKey);
    if (!answerMap?.has(type.variant)) {
      fail(`${type.id}: 공개 유형의 독립 정답 계약이 없습니다.`);
      continue;
    }
    const expected = answerMap.get(type.variant);
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 30; seed += 1) {
        let generated;
        try {
          generated = generatorApi.generate(type, 0, difficulty, seed, type.variant);
          generatedCount += 1;
        } catch (error) {
          fail(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          continue;
        }
        const visible = `${generated?.prompt || ""} ${generated?.answer ?? ""} ${generated?.solution || ""}`;
        if (!generated?.prompt?.trim() || generated.answer === undefined || generated.answer === null || !generated.solution?.trim()) fail(`${type.id} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
        if (invalidOutputPattern.test(visible)) fail(`${type.id} / 시드 ${seed}: 잘못된 값이 노출됩니다.`);
        if (String(generated.answer) !== expected) fail(`${type.id} / 시드 ${seed}: 정답 ${JSON.stringify(generated.answer)}가 계약 ${JSON.stringify(expected)}와 다릅니다.`);
        if (!generated.prompt.includes(itemId(type.sourceItemId))) fail(`${type.id} / 시드 ${seed}: 원문 ID 표식이 없습니다.`);
        auditRegularPolygonAngleMetadata(type, name => [...visible.matchAll(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "g"))].map(match => match[1]), `${type.id} / 시드 ${seed}`);
        const svgTags = [...visible.matchAll(/<svg\b([^>]*)>/g)];
        for (const match of svgTags) {
          if (!/\bviewBox\s*=\s*["'][^"']+["']/.test(match[1])) fail(`${type.id} / 시드 ${seed}: SVG viewBox가 없습니다.`);
          if (!/\baria-label\s*=\s*["'][^"']+\S[^"']*["']/.test(match[1])) fail(`${type.id} / 시드 ${seed}: SVG aria-label이 없습니다.`);
          if (!/data-[a-z0-9-]+\s*=\s*["'][^"']+["']/.test(match[1])) fail(`${type.id} / 시드 ${seed}: SVG 의미 메타데이터가 없습니다.`);
        }
      }
    }
  }
}

function auditSpecificGeometryMetadata(type, state, label) {
  const values = state.svgMetadata;
  const normalize = value => String(value).trim().replace(/\s+/g, "");
  const has = (name, value) => values.some(entry => entry.name === name && normalize(entry.value) === normalize(value));
  const hasAny = (names, value) => names.some(name => has(name, value));
  const hasName = name => values.some(entry => entry.name === name);
  auditRegularPolygonAngleMetadata(type, name => values.filter(entry => entry.name === name).map(entry => entry.value), `${label} ${type.id}`);
  if (type.generatorKey === "polygonDiagonals") {
    if (type.variant === 1 && (!has("data-polygon-sides", 6) || state.solutionAnswers.some(answer => answer !== "18"))) fail(`${label} ${type.id}: 정육각형·18cm 메타데이터 또는 정답이 다릅니다.`);
    if (type.variant === 2 && !has("data-exterior-angle", 30)) fail(`${label} ${type.id}: 외각 30도 메타데이터가 없습니다.`);
    if (type.variant === 3 && !has("data-target-interior", 150)) fail(`${label} ${type.id}: 목표 안쪽 각 150도 메타데이터가 없습니다.`);
    if (type.variant === 5 && (!has("data-turn-angle", 15) || !has("data-segment-length", 3))) fail(`${label} ${type.id}: 회전각 15도·선분 3cm 메타데이터가 없습니다.`);
    if (type.variant === 7 && (!values.some(entry => /side/i.test(entry.name)) || !values.some(entry => /short-diagonal/i.test(entry.name)))) fail(`${label} ${type.id}: 한 변·짧은 대각선 강조 메타데이터가 없습니다.`);
    if (type.variant === 10 && !has("data-exterior-angle", 40)) fail(`${label} ${type.id}: 외각 40도 메타데이터가 없습니다.`);
  }
  if (type.generatorKey === "regularPolygonApplication" && type.variant === 2) {
    if (!hasAny(["data-marked-angles"], "162,150,120,132") || !has("data-boundary-sides", 151)) fail(`${label} ${type.id}: 정다각형 연결의 표시각·바깥 변 메타데이터가 원문 계약과 다릅니다.`);
  }
  if (type.generatorKey === "tessellationCover") {
    if (type.variant === 0 && (!has("data-choice-count", 11) || !has("data-verified-tile-count", 8) || !has("data-tiling-choice-indexes", "1,2,3,4,5,6,7,10"))) fail(`${label} ${type.id}: 평면 덮기 선택지 수·검증 도형·번호 메타데이터가 원문 계약과 다릅니다.`);
    if (type.variant === 4 && (!has("data-rows", 2) || !has("data-cols", 5) || !has("data-exhaustive-count", 8))) fail(`${label} ${type.id}: 2×5 덮기 전수조사 메타데이터가 원문 계약과 다릅니다.`);
    if (type.variant === 7 && (!has("data-boundary-direction-lengths", "1,1,2,1,1,1,1,1,3") || !has("data-unit-triangles", 12) || !has("data-concave-interior-angle", 240) || !has("data-internal-grid-visible", "false") || !has("data-reflex-arc-side", "inside"))) fail(`${label} ${type.id}: 원문 오목 도형의 바깥선·조각 수·안쪽 각·비노출 격자 계약이 다릅니다.`);
    if (type.variant === 10 && (!has("data-distinct-tilings", 34) || hasName("data-distinct-rectangles"))) fail(`${label} ${type.id}: 직사각형 덮기 메타데이터가 원문 계약과 다르거나 금지된 이름을 사용합니다.`);
  }
  if (type.generatorKey === "shapePartitionCompose") {
    if (type.variant === 4 && (!has("data-piece-count", 3) || !has("data-unit-triangles", 6) || !has("data-equivalence", "rotate-reflect"))) fail(`${label} ${type.id}: 마름모 조각의 개수·삼각형 수·같은 모양 기준 메타데이터가 원문 계약과 다릅니다.`);
    if (type.variant === 8 && (!has("data-piece-count", 4) || !has("data-cell-side-cm", 3) || !has("data-target-rows", 4) || !has("data-target-cols", 4))) fail(`${label} ${type.id}: ㅜ자 조각의 개수·칸의 길이·완성 정사각형 메타데이터가 원문 계약과 다릅니다.`);
    if (type.variant === 8) {
      const covers = state.svgStates.map(svg => svg.tPieceCover).filter(Boolean);
      if (!covers.length) fail(`${label} ${type.id}: T조각 원본형 SVG가 없습니다.`);
      covers.forEach((cover, index) => {
        if (!cover.exactCells) fail(`${label} ${type.id}: ${index + 1}번째 T조각 SVG의 data-cover-count/data-cover-cells가 0부터 15까지 중복 없이 정확히 덮지 않습니다.`);
        if (!cover.squareModelExact) fail(`${label} ${type.id}: ${index + 1}번째 T조각 SVG에 4×4 정사각형 모델이 없습니다.`);
        if (cover.outerBoundaryCount !== 1 || !cover.outerBoundaryVisible) fail(`${label} ${type.id}: ${index + 1}번째 T조각 SVG의 굵은 정사각형 외곽 경계가 정확히 하나 보이지 않습니다.`);
        if (!cover.pieceBoundaryVisible || !cover.distinctPieceBoundaries) fail(`${label} ${type.id}: ${index + 1}번째 T조각 SVG에서 네 T조각의 서로 다른 경계가 정사각형 안에 보이지 않습니다.`);
        if (cover.unitGridExposed) fail(`${label} ${type.id}: ${index + 1}번째 T조각 SVG에 원본에 없는 4×4 단위격자 전체가 노출되었습니다.`);
      });
    }
  }
  if (type.generatorKey !== "polygonDiagonals" && state.svgCount && state.svgStates.some(svg => !svg.semanticMetadata)) fail(`${label} ${type.id}: 도형 SVG의 의미 모델 메타데이터가 없습니다.`);
}

async function pageState(page) {
  return page.evaluate(() => {
    const rect = node => {
      const box = node?.getBoundingClientRect();
      return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null;
    };
    const inside = (inner, outer, tolerance = 2) => Boolean(inner && outer && inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance);
    const overlaps = (a, b) => Boolean(a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1);
    const finiteText = text => !/\b(?:undefined|null|NaN|Infinity)\b/.test(text || "");
    const svgMetadata = [];
    const svgs = [...document.querySelectorAll(".question-item svg")];
    const svgStates = svgs.map(svg => {
      [...svg.attributes].forEach(attribute => { if (attribute.name.startsWith("data-")) svgMetadata.push({ name: attribute.name, value: attribute.value }); });
      const box = rect(svg);
      const drawable = svg.querySelector("path, polygon, polyline, line, circle, ellipse, rect, text, image, use");
      const labels = [...svg.querySelectorAll("text")].map(node => ({ text: node.textContent?.trim() || "", box: (() => { try { const b = node.getBBox(); return { left: b.x, right: b.x + b.width, top: b.y, bottom: b.y + b.height }; } catch { return null; } })() })).filter(item => item.box);
      const labelOverlapPairs = labels.flatMap((left, index) => labels.slice(index + 1).filter(right => overlaps(left.box, right.box)).map(right => `${left.text}↔${right.text}`));
      const labelOverlap = labelOverlapPairs.length > 0;
      const meta = [...svg.attributes].filter(attribute => attribute.name.startsWith("data-")).map(attribute => ({ name: attribute.name, value: attribute.value }));
      const viewBox = svg.viewBox?.baseVal;
      const drawableNodes = [...svg.querySelectorAll("path, polygon, polyline, line, circle, ellipse, rect, text")];
      const clippedNodes = !viewBox ? ["viewBox 없음"] : drawableNodes.flatMap(node => {
        if (node.closest("[clip-path]")) return [];
        try {
          const bounds = node.getBBox();
          const clipped = bounds.x < viewBox.x - 4 || bounds.y < viewBox.y - 4 || bounds.x + bounds.width > viewBox.x + viewBox.width + 4 || bounds.y + bounds.height > viewBox.y + viewBox.height + 4;
          return clipped ? [`${node.tagName}:${node.textContent?.trim() || node.getAttribute("class") || "도형"}(${bounds.x.toFixed(1)},${bounds.y.toFixed(1)},${bounds.width.toFixed(1)},${bounds.height.toFixed(1)})`] : [];
        } catch {
          return [`${node.tagName}:크기 측정 실패`];
        }
      });
      const geometryClipped = clippedNodes.length > 0;
      const semanticMetadata = meta.some(attribute => /^(data-source42-polygon-diagram|data-polygon-|data-diagonal-|data-turn-|data-highlight|data-side-|data-short-)/.test(attribute.name));
      const tPieceCover = svg.classList.contains("source42-t-piece-square") ? (() => {
        const metadata = Object.fromEntries(meta.map(attribute => [attribute.name, attribute.value]));
        const coverCount = Number(metadata["data-cover-count"]);
        const coverCellsText = String(metadata["data-cover-cells"] || "");
        const normalizedCoverCellsText = coverCellsText.replace(/\s+/g, "");
        const expectedCoverCellsText = "0,1,2,5|3,6,7,11|4,8,9,12|10,13,14,15";
        const coverGroups = coverCellsText.split("|").map(group => group.split(",").map(value => Number(value.trim())));
        const cells = coverGroups.flat();
        const finite = Number.isFinite(coverCount) && cells.every(Number.isFinite);
        const exactMetadata = metadata["data-cover-count"] === "4" && normalizedCoverCellsText === expectedCoverCellsText;
        const exactCells = finite && exactMetadata && coverGroups.length === 4 && coverGroups.every(group => group.length === 4) && cells.length === 16 && cells.every(cell => cell >= 0 && cell <= 15 && Number.isInteger(cell)) && new Set(cells).size === 16 && [...new Set(cells)].sort((a, b) => a - b).every((cell, index) => cell === index);
        const visible = node => {
          const style = getComputedStyle(node);
          const bounds = node.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && (bounds.width > 0 || bounds.height > 0);
        };
        const stroked = node => {
          const style = getComputedStyle(node);
          return visible(node) && style.stroke !== "none" && Number.parseFloat(style.strokeWidth) > 0;
        };
        const strokeWidth = node => Number.parseFloat(getComputedStyle(node).strokeWidth) || 0;
        const svgBounds = node => {
          try {
            const bounds = node.getBBox();
            return { left: bounds.x, right: bounds.x + bounds.width, top: bounds.y, bottom: bounds.y + bounds.height, width: bounds.width, height: bounds.height };
          } catch {
            return null;
          }
        };
        const containedBy = (inner, outer, tolerance = 1) => Boolean(inner && outer && inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance);
        const squareModelExact = metadata["data-square-cells"] === "4x4" || (metadata["data-target-rows"] === "4" && metadata["data-target-cols"] === "4");
        const outerBoundaries = [...svg.querySelectorAll("[data-outer-boundary]")];
        const outerBoundary = outerBoundaries.length === 1 ? outerBoundaries[0] : null;
        const outerBounds = outerBoundary ? svgBounds(outerBoundary) : null;
        const outerBoundaryStrokeNodes = outerBoundary ? [outerBoundary, ...outerBoundary.querySelectorAll("path, polygon, polyline, line, rect")].filter(stroked) : [];
        const outerBoundaryVisible = Boolean(outerBoundary && outerBounds && Math.abs(outerBounds.width - outerBounds.height) <= 1 && outerBoundaryStrokeNodes.length && Math.max(...outerBoundaryStrokeNodes.map(strokeWidth)) >= 2.5);
        const pieceGroups = [...svg.querySelectorAll("[data-t-piece-index]")];
        const pieceBoundaryStates = pieceGroups.map(group => {
          const boundaryNodes = [...group.querySelectorAll("[data-piece-boundary], path, polygon, polyline, line, rect")].filter(stroked);
          const groupBounds = svgBounds(group);
          const fingerprint = boundaryNodes.map(node => {
            const bounds = svgBounds(node);
            return [node.tagName, node.getAttribute("d") || "", node.getAttribute("points") || "", node.getAttribute("transform") || "", bounds ? `${bounds.left},${bounds.top},${bounds.width},${bounds.height}` : ""].join(":");
          }).sort().join("|");
          return { index: group.getAttribute("data-t-piece-index") || "", boundaryNodeCount: boundaryNodes.length, insideOuter: containedBy(groupBounds, outerBounds), fingerprint };
        });
        const pieceBoundaryVisible = pieceGroups.length === 4 && new Set(pieceBoundaryStates.map(piece => piece.index)).size === 4 && pieceBoundaryStates.every(piece => piece.boundaryNodeCount > 0 && piece.insideOuter);
        const distinctPieceBoundaries = pieceBoundaryVisible && new Set(pieceBoundaryStates.map(piece => piece.fingerprint)).size === 4;
        const unitWidth = outerBounds ? outerBounds.width / 4 : 0;
        const unitHeight = outerBounds ? outerBounds.height / 4 : 0;
        const exposedUnitRects = outerBounds ? [...svg.querySelectorAll("rect")].filter(node => {
          if (node === outerBoundary || !stroked(node)) return false;
          const bounds = svgBounds(node);
          return containedBy(bounds, outerBounds) && Math.abs(bounds.width - unitWidth) <= 1 && Math.abs(bounds.height - unitHeight) <= 1;
        }) : [];
        const exposedPositions = new Set(exposedUnitRects.map(node => {
          const bounds = svgBounds(node);
          return `${Math.round((bounds.left - outerBounds.left) / unitWidth)},${Math.round((bounds.top - outerBounds.top) / unitHeight)}`;
        }));
        const fullCellRectsExposed = exposedPositions.size === 16 && Array.from({ length: 16 }, (_, cell) => `${cell % 4},${Math.floor(cell / 4)}`).every(position => exposedPositions.has(position));
        const fullGridLines = outerBounds ? [...svg.querySelectorAll("line")].filter(stroked).reduce((result, node) => {
          const x1 = Number(node.getAttribute("x1")), x2 = Number(node.getAttribute("x2")), y1 = Number(node.getAttribute("y1")), y2 = Number(node.getAttribute("y2"));
          if ([x1, x2, y1, y2].some(value => !Number.isFinite(value))) return result;
          if (Math.abs(x1 - x2) <= 0.5 && Math.abs(Math.abs(y2 - y1) - outerBounds.height) <= 1) result.vertical.add(Math.round((x1 - outerBounds.left) / unitWidth));
          if (Math.abs(y1 - y2) <= 0.5 && Math.abs(Math.abs(x2 - x1) - outerBounds.width) <= 1) result.horizontal.add(Math.round((y1 - outerBounds.top) / unitHeight));
          return result;
        }, { vertical: new Set(), horizontal: new Set() }) : { vertical: new Set(), horizontal: new Set() };
        const fullGridLinesExposed = [1, 2, 3].every(index => fullGridLines.vertical.has(index) && fullGridLines.horizontal.has(index));
        const unitGridExposed = fullCellRectsExposed || fullGridLinesExposed;
        return { coverCount, coverGroups, cells, exactMetadata, exactCells, squareModelExact, outerBoundaryCount: outerBoundaries.length, outerBoundaryVisible, pieceGroupCount: pieceGroups.length, pieceBoundaryStates, pieceBoundaryVisible, distinctPieceBoundaries, exposedUnitRectCount: exposedUnitRects.length, fullGridLinesExposed, unitGridExposed };
      })() : null;
      return { box, empty: !drawable || !box || box.width < 2 || box.height < 2, clipped: geometryClipped, clippedNodes, labelOverlap, labelOverlapPairs, semanticMetadata, meta, tPieceCover };
    });
    const questions = [...document.querySelectorAll(".question-item")];
    const allText = document.body.innerText || "";
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      questionCount: questions.length,
      allFinite: finiteText(allText),
      svgCount: svgs.length,
      svgStates,
      svgMetadata,
      solutionAnswers: [...document.querySelectorAll(".solution-item header strong")].map(node => node.textContent?.replace(/\s+/g, " ").trim() || ""),
      sourceItemIds: questions.map(question => [...question.querySelectorAll("[data-source42-polygon-item]")].map(node => node.dataset.source42PolygonItem || "")),
      questions: questions.map(question => {
        const itemBox = rect(question);
        const prompt = question.querySelector(".question-prompt");
        const answer = question.querySelector(".answer-line");
        return {
          promptText: prompt?.textContent?.replace(/\s+/g, " ").trim() || "",
          promptBox: rect(prompt),
          itemBox,
          answerBox: rect(answer),
          itemOverflow: question.scrollWidth > question.clientWidth + 1 || prompt?.scrollWidth > prompt?.clientWidth + 1,
          svgs: [...question.querySelectorAll("svg")].map(svg => ({
            box: rect(svg),
            inside: inside(rect(svg), itemBox),
            empty: !svg.querySelector("path, polygon, polyline, line, circle, ellipse, rect, text, image, use"),
            semanticMetadata: [...svg.attributes].some(attribute => /^(data-source42-polygon-diagram|data-polygon-|data-diagonal-|data-turn-|data-highlight|data-side-|data-short-)/.test(attribute.name))
          }))
        };
      })
    };
  });
}

function validateQuestionState(state, type, label) {
  if (state.documentOverflow) fail(`${label} ${type.id}: 문서 가로 넘침`);
  if (!state.allFinite) fail(`${label} ${type.id}: undefined/null/NaN/Infinity 노출`);
  if (state.questionCount !== 3) fail(`${label} ${type.id}: 문제 ${state.questionCount}개, 3개여야 합니다.`);
  if (state.sourceItemIds.some(ids => ids.length !== 1 || ids[0] !== type.sourceItemId)) fail(`${label} ${type.id}: 숨은 원문 ID가 문항마다 정확히 하나가 아닙니다.`);
  state.svgStates.forEach((svg, index) => {
    if (svg.clipped) fail(`${label} ${type.id}: ${index + 1}번째 SVG 내용이 viewBox 밖으로 잘립니다. ${svg.clippedNodes.join(", ")}`);
    if (svg.labelOverlap) fail(`${label} ${type.id}: ${index + 1}번째 SVG의 글자 표기가 겹칩니다. ${svg.labelOverlapPairs.join(", ")}`);
  });
  state.questions.forEach((question, index) => {
    const number = index + 1;
    if (!question.promptText) fail(`${label} ${type.id} ${number}번: 문제 내용이 비었습니다.`);
    if (!question.promptBox || !question.itemBox || question.promptBox.width < 2 || question.promptBox.height < 2) fail(`${label} ${type.id} ${number}번: 문제 내용이 보이지 않습니다.`);
    if (!question.answerBox || question.answerBox.width < 2 || question.answerBox.height < 2) fail(`${label} ${type.id} ${number}번: 답안 칸이 보이지 않습니다.`);
    if (question.itemOverflow) fail(`${label} ${type.id} ${number}번: 문항 가로 넘침`);
    question.svgs.forEach((svg, svgIndex) => {
      if (svg.empty) fail(`${label} ${type.id} ${number}번 ${svgIndex + 1}번째 SVG가 비어 있습니다.`);
      if (!svg.inside) fail(`${label} ${type.id} ${number}번 ${svgIndex + 1}번째 SVG가 문항 밖으로 나갑니다.`);
      if (!svg.semanticMetadata) fail(`${label} ${type.id} ${number}번 ${svgIndex + 1}번째 SVG에 도형 모델 메타데이터가 없습니다.`);
    });
  });
  auditSpecificGeometryMetadata(type, state, label);
}

async function inspectSolutions(page, type, label) {
  await page.click("#solutionTab");
  const state = await page.evaluate(() => {
    const solutions = [...document.querySelectorAll(".solution-item")];
    return {
      count: solutions.length,
      empty: solutions.some(item => !(item.textContent || "").trim()),
      overflow: solutions.some(item => item.scrollWidth > item.clientWidth + 1),
      allFinite: !/\b(?:undefined|null|NaN|Infinity)\b/.test(document.body.innerText || ""),
      answers: solutions.map(item => item.querySelector("header strong")?.textContent?.replace(/\s+/g, " ").trim() || "")
    };
  });
  if (state.count !== 3 || state.empty) fail(`${label} ${type.id}: 정답·풀이 ${state.count}개 또는 빈 풀이`);
  if (!state.allFinite) fail(`${label} ${type.id}: 정답·풀이에 잘못된 값이 노출됩니다.`);
  const expected = expectedAnswers.get(type.generatorKey)?.get(type.variant);
  if (state.answers.some(answer => answer !== expected)) fail(`${label} ${type.id}: 풀이 정답 ${JSON.stringify(state.answers)}가 계약 ${JSON.stringify(expected)}와 다릅니다.`);
  await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-solution.png`), fullPage: true });
  screenshotCount += 1;
}

async function inspectPrint(page, type) {
  await page.click("#problemTab");
  try {
    await page.emulateMedia({ media: "print" });
    const state = await pageState(page);
    if (state.documentOverflow) fail(`A4 ${type.id}: 문서 가로 넘침`);
    const pageStateResult = await page.evaluate(() => {
      return [...document.querySelectorAll("#problemView .print-page")].flatMap(printPage => {
        const outer = printPage.getBoundingClientRect();
        return [...printPage.querySelectorAll(".question-item, svg")].flatMap(node => {
          const box = node.getBoundingClientRect();
          const outside = box.width > 0 && (box.left < outer.left - 2 || box.right > outer.right + 2);
          return outside ? [{ name: node.className?.baseVal || node.className || node.tagName, left: box.left, right: box.right, pageLeft: outer.left, pageRight: outer.right }] : [];
        });
      });
    });
    if (pageStateResult.length) fail(`A4 ${type.id}: 페이지 폭을 벗어난 내용이 있습니다. ${JSON.stringify(pageStateResult.slice(0, 3))}`);
    await page.pdf({ path: path.join(outputDir, `${slug(type.sourceItemId)}-a4-problem.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
    pdfCount += 1;

    await page.emulateMedia({ media: "screen" });
    await page.click("#solutionTab");
    await page.emulateMedia({ media: "print" });
    const solutionOverflow = await page.evaluate(() => [...document.querySelectorAll(".solution-item")].some(item => item.scrollWidth > item.clientWidth + 1));
    if (solutionOverflow) fail(`A4 ${type.id}: 풀이 폭이 넘칩니다.`);
    await page.pdf({ path: path.join(outputDir, `${slug(type.sourceItemId)}-a4-solution.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
    pdfCount += 1;
  } finally {
    await page.emulateMedia({ media: "screen" });
  }
  await page.locator("#solutionTab").waitFor({ state: "visible" });
}

async function inspectReadyType(browser, type) {
  const expected = expectedAnswers.get(type.generatorKey)?.get(type.variant);
  for (const [label, viewport] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.setDefaultTimeout(60000);
    page.on("pageerror", error => fail(`${label} ${type.id}: 브라우저 오류 ${error.message}`));
    page.on("console", message => { if (message.type() === "error" && !message.text().includes("Failed to load resource")) fail(`${label} ${type.id}: 콘솔 오류 ${message.text()}`); });
    await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
    const state = await pageState(page);
    validateQuestionState(state, type, label);
    if (state.solutionAnswers.some(answer => answer !== expected)) fail(`${label} ${type.id}: 풀이 정답 ${JSON.stringify(state.solutionAnswers)}가 계약 ${JSON.stringify(expected)}와 다릅니다.`);
    await page.screenshot({ path: path.join(outputDir, `${slug(type.sourceItemId)}-${label}-problem.png`), fullPage: true });
    screenshotCount += 1;
    if (label === "desktop") await inspectPrint(page, type);
    await inspectSolutions(page, type, label);
    await page.close();
  }
}

function auditRegularPolygonAngleMetadata(type, values, label) {
  if (type.generatorKey !== "regularPolygonApplication") return;
  const contract = regularPolygonAngleContracts.get(type.variant);
  if (!contract) return;
  const compact = value => String(value).replace(/[\s,\/]/g, "");
  const has = (name, expected) => expected === true
    ? values(name).some(value => String(value).trim())
    : values(name).some(value => compact(value) === compact(expected));
  const checks = [
    ["data-angle", contract.angle],
    ["data-adjacent-angle", contract.adjacentAngle],
    ["data-angle-rays", contract.angleRays],
    ["data-marked-vertex", contract.markedVertex],
    ["data-not-to-scale", contract.notToScale],
    ["data-given-angle", contract.givenAngle],
    ["data-coordinate-given-angle", contract.coordinateGivenAngle],
    ["data-coordinate-target-angle", contract.coordinateTargetAngle],
    ["data-intersection-segments", contract.intersectionSegments],
    ["data-polygon-orientation", contract.polygonOrientation],
    ["data-given-angle-rays", contract.givenAngleRays],
    ["data-right-angle", contract.rightAngle]
  ];
  for (const [name, expected] of checks) {
    if (expected !== undefined && !has(name, expected)) fail(`${label}: ${name} 메타데이터가 독립 기하 계약과 다릅니다.`);
  }
}

async function inspectLocked(browser, type) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  const direct = await page.evaluate(() => ({ hidden: document.querySelector("#worksheet")?.hidden !== false, questions: document.querySelectorAll(".question-item").length }));
  if (!direct.hidden || direct.questions) fail(`${type.id}: 검수 대기 유형이 직접 생성됩니다.`);
  await page.goto(`${baseUrl}?type=4-2-u6-t1&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#backButton").click();
  await page.locator(".bank-layout").waitFor({ state: "visible" });
  const catalog = await page.evaluate(sourceId => {
    const row = document.querySelector(`[data-preview-type-id="${sourceId}"]`);
    if (!row) return null;
    const unit = row.closest(".tree-unit");
    const toggle = unit?.querySelector("button[data-tree-unit]");
    return {
      pending: row.classList.contains("is-pending"),
      disabled: Boolean(row.querySelector("input[type=checkbox]:disabled")),
      state: row.querySelector(".tree-type-state")?.textContent?.trim() || "",
      unitId: toggle?.dataset.treeUnit || "",
      unitExpanded: toggle?.getAttribute("aria-expanded") === "true"
    };
  }, type.id);
  if (!catalog) fail(`${type.id}: 카탈로그 행이 없습니다.`);
  else {
    const lockedContractValid = catalog.pending && catalog.disabled && catalog.state === "검수 대기";
    if (!lockedContractValid) fail(`${type.id}: 카탈로그 잠금 표시가 정확하지 않습니다.`);
    else {
      const rowSelector = `[data-preview-type-id="${type.id}"]`;
      let row = page.locator(rowSelector);
      if (!(await row.isVisible()) && catalog.unitId) {
        const toggle = page.locator(`button[data-tree-unit="${catalog.unitId}"]`);
        if (await toggle.count() === 1 && (await toggle.getAttribute("aria-expanded")) !== "true") {
          await toggle.click();
          row = page.locator(rowSelector);
          await row.waitFor({ state: "attached" });
        }
      }
      let previewDispatched = false;
      if (await row.isVisible()) {
        await row.scrollIntoViewIfNeeded();
        await row.click();
        previewDispatched = true;
      }
      else {
        previewDispatched = await page.evaluate(sourceId => {
          const hiddenRow = document.querySelector(`[data-preview-type-id="${sourceId}"]`);
          if (!hiddenRow) return false;
          hiddenRow.click();
          return true;
        }, type.id);
        if (!previewDispatched) fail(`${type.id}: 접힌 카탈로그 행에 미리보기 클릭을 전달하지 못했습니다.`);
      }
      if (previewDispatched) {
        const preview = page.locator("#typePreviewPopover:not([hidden])");
        await preview.waitFor({ state: "visible" });
        const reason = await preview.textContent();
        if (!reason.includes(type.reviewReason || "검수 대기")) fail(`${type.id}: 검수 대기 사유가 미리보기에 표시되지 않습니다.`);
      }
    }
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  auditInventoryContract();
  auditStaticGeneration();
  if (failures.length) {
    console.error(`4-2 다각형 정적 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 80).join("\n"));
    process.exit(1);
  }
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const type of readyTypes) await inspectReadyType(browser, type);
  for (const type of lockedTypes) await inspectLocked(browser, type);
  await browser.close();
  if (failures.length) {
    console.error(`4-2 다각형 브라우저·인쇄 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 100).join("\n"));
    process.exit(1);
  }
  console.log(`4-2 다각형 브라우저·인쇄 감사 통과: 원문 44유형 · 공개 ${readyTypes.length} · 잠금 ${lockedTypes.length} · ${generatedCount.toLocaleString()}회 생성 · PC/모바일 ${screenshotCount}장 · A4 ${pdfCount}개 · ${outputDir}`);
})().catch(error => {
  console.error(`4-2 다각형 브라우저·인쇄 감사 예외: ${error.stack || error}`);
  process.exit(1);
});
