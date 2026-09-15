"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const pdfJsPath = process.env.HSE_PDFJS_PATH
  || path.join(path.dirname(playwrightPath), "pdfjs-dist", "legacy", "build", "pdf.mjs");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-source-4-2-parallel-angle-browser-audit");
const failures = [];
let screenStates = 0;
let pdfFiles = 0;

global.window = {};
require("./curriculum.js");
require("./generators.js");
const moduleApi = require("./source-4-2-parallel-angle.js");

const api = window.HSE_GENERATORS;
const allTypes = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units || [])
  .flatMap(unit => unit.subunits || [])
  .flatMap(subunit => subunit.types || []);
const sourceTypes = moduleApi.SOURCE_IDS.map(sourceItemId => allTypes.find(type => type.sourceItemId === sourceItemId));
const requestedTypeId = String(process.env.HSE_TYPE_ID || "").trim();
const types = requestedTypeId ? sourceTypes.filter(type => type?.id === requestedTypeId) : sourceTypes;
const expectedMarkCounts = {
  exploration: 4,
  "example-2-3": 4,
  "example-2-4": 4,
  "mission-1": 3,
  "mission-2": 4,
  "mission-3": 4,
  "mission-4": 5,
  "mission-5": 4,
  "mission-6": 2
};
const formulaRequired = new Set(["example-2-3", "example-2-4", "mission-1", "mission-2", "mission-4", "mission-5", "mission-6"]);
const symbolicSolutionKinds = new Set(["exploration", "example-2-3", "example-2-4"]);

function fail(message) {
  failures.push(message);
}

let pdfJsPromise;
async function readPdfPageTexts(pdfPath) {
  if (!pdfJsPromise) pdfJsPromise = import(pathToFileURL(pdfJsPath).href);
  const pdfJs = await pdfJsPromise;
  const document = await pdfJs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)) }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(" "));
  }
  return pages;
}

async function assertPdfPagesContainWorksheetItems(pdfPath, label, type) {
  const pages = await readPdfPageTexts(pdfPath);
  pages.forEach((text, index) => {
    const substantive = text
      .replace(/LETE-ON/g, "")
      .replace(/(?:문제|정답·풀이)\s*\d+/g, "")
      .replace(/[·\s]/g, "");
    if (substantive.length < 40) fail(`${label} ${index + 1}쪽: 문항 없이 쪽 제목만 남았습니다.`);
  });
  const normalizedText = pages.join(" ").replace(/\s/g, "");
  const normalizedTypeName = String(type.name || "").replace(/\s/g, "");
  const itemCount = normalizedTypeName ? normalizedText.split(normalizedTypeName).length - 1 : 0;
  if (itemCount !== 3) fail(`${label}: 유형명이 ${itemCount}번 인쇄되어 문항 3개가 모두 들어갔는지 확인할 수 없습니다.`);
}

function safePath(urlPath) {
  const relative = decodeURIComponent(String(urlPath || "/").split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(repoRoot + path.sep) ? file : null;
}

function contentType(file) {
  return ({
    ".css": "text/css",
    ".html": "text/html",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml"
  })[path.extname(file)] || "application/octet-stream";
}

async function startReadOnlyServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

async function collectProblemState(page) {
  return page.evaluate(() => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const box = element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const inside = (inner, outer, tolerance = 2) => inner.left >= outer.left - tolerance
      && inner.right <= outer.right + tolerance
      && inner.top >= outer.top - tolerance
      && inner.bottom <= outer.bottom + tolerance;
    const normalize = angle => ((Number(angle) % 360) + 360) % 360;
    const angleDistance = (first, second) => {
      const delta = Math.abs(normalize(first) - normalize(second));
      return Math.min(delta, 360 - delta);
    };
    const lineCount = element => {
      const tops = [];
      const range = document.createRange();
      range.selectNodeContents(element);
      [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0).forEach(rect => {
        if (!tops.some(top => Math.abs(top - rect.top) < 2)) tops.push(rect.top);
      });
      return Math.max(1, tops.length);
    };
    const inspectSvg = (svg, item) => {
      if (!svg) return null;
      const itemBox = box(item);
      const svgBox = box(svg);
      const viewBox = svg.viewBox.baseVal;
      const insideViewBox = (bounds, tolerance = 2) => bounds.x >= viewBox.x - tolerance
        && bounds.y >= viewBox.y - tolerance
        && bounds.x + bounds.width <= viewBox.x + viewBox.width + tolerance
        && bounds.y + bounds.height <= viewBox.y + viewBox.height + tolerance;
      const lineIntersectsRect = (line, bounds, padding = 1.5) => {
        const left = bounds.x - padding;
        const right = bounds.x + bounds.width + padding;
        const top = bounds.y - padding;
        const bottom = bounds.y + bounds.height + padding;
        const x1 = Number(line.getAttribute("x1"));
        const y1 = Number(line.getAttribute("y1"));
        const x2 = Number(line.getAttribute("x2"));
        const y2 = Number(line.getAttribute("y2"));
        const dx = x2 - x1;
        const dy = y2 - y1;
        let low = 0;
        let high = 1;
        for (const [p, q] of [[-dx, x1 - left], [dx, right - x1], [-dy, y1 - top], [dy, bottom - y1]]) {
          if (p === 0 && q < 0) return false;
          if (p !== 0) {
            const ratio = q / p;
            if (p < 0) low = Math.max(low, ratio);
            else high = Math.min(high, ratio);
            if (low > high) return false;
          }
        }
        return true;
      };
      const pointDistance = (first, second) => Math.hypot(first[0] - second[0], first[1] - second[1]);
      const pointAttribute = (element, name) => String(element?.getAttribute(name) || "").split(",").map(Number);
      const leaderEndpoints = leader => {
        if (!leader) return [];
        if (leader.tagName === "line") return [
          [Number(leader.getAttribute("x1")), Number(leader.getAttribute("y1"))],
          [Number(leader.getAttribute("x2")), Number(leader.getAttribute("y2"))]
        ];
        if (typeof leader.getTotalLength !== "function") return [];
        const start = leader.getPointAtLength(0);
        const end = leader.getPointAtLength(leader.getTotalLength());
        return [[start.x, start.y], [end.x, end.y]];
      };
      const inspectLeader = group => {
        const label = group.querySelector("text");
        const leader = group.querySelector(".pa-leader");
        const midpoint = pointAttribute(group, "data-angle-midpoint");
        const labelBounds = label?.getBBox();
        const endpoints = leaderEndpoints(leader);
        const finite = point => point.length === 2 && point.every(Number.isFinite);
        const touchesMidpoint = endpoints.length === 2 && finite(midpoint) && endpoints.some(point => pointDistance(point, midpoint) <= 4);
        const touchesLabel = endpoints.length === 2 && labelBounds && endpoints.some(point => point[0] >= labelBounds.x - 10 && point[0] <= labelBounds.x + labelBounds.width + 10 && point[1] >= labelBounds.y - 4 && point[1] <= labelBounds.y + labelBounds.height + 4);
        const style = leader ? getComputedStyle(leader) : null;
        return {
          present: Boolean(leader),
          connected: Boolean(touchesMidpoint && touchesLabel),
          touchesMidpoint,
          touchesLabel,
          visible: Boolean(leader && style && style.stroke !== "none" && Number.parseFloat(style.strokeWidth) >= 0.8)
        };
      };
      const outsideGraphics = [...svg.querySelectorAll("line,path,circle,text")]
        .map(element => ({ element, bounds: element.getBBox() }))
        .filter(item => !insideViewBox(item.bounds, 3))
        .map(item => ({ tag: item.element.tagName, className: item.element.getAttribute("class") || "", name: item.element.getAttribute("data-line-name") || compact(item.element.textContent), bounds: { x: item.bounds.x, y: item.bounds.y, width: item.bounds.width, height: item.bounds.height } }));
      const graphicsInsideViewBox = outsideGraphics.length === 0;
      const svgTexts = [...svg.querySelectorAll("text")].map(text => ({
        text: compact(text.textContent),
        box: box(text)
      }));
      const textOverlapPairs = [];
      for (let first = 0; first < svgTexts.length; first += 1) {
        for (let second = first + 1; second < svgTexts.length; second += 1) {
          const a = svgTexts[first].box;
          const b = svgTexts[second].box;
          const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (width > 0.5 && height > 0.5) textOverlapPairs.push(`${svgTexts[first].text}/${svgTexts[second].text}`);
        }
      }
      const textStyleClear = [...svg.querySelectorAll("text")].every(text => {
        const style = getComputedStyle(text);
        const expectedFamily = text.classList.contains("pa-name") ? "Malgun Gothic" : "Times New Roman";
        return style.fontWeight === "400" && style.fill === "rgb(17, 17, 17)" && style.stroke === "none" && style.fontFamily.includes(expectedFamily);
      });
      const lineElements = [...svg.querySelectorAll(".pa-line, .pa-arc, .pa-parallel, .pa-right, .pa-leader")];
      const lineStyleClear = lineElements.length > 0 && lineElements.every(element => getComputedStyle(element).stroke === "rgb(34, 34, 34)");
      const nameLineOverlaps = [...svg.querySelectorAll("text.pa-name")].flatMap(label => {
        const bounds = label.getBBox();
        return [...svg.querySelectorAll("line.pa-line")]
          .filter(line => lineIntersectsRect(line, bounds))
          .map(line => `${compact(label.textContent)}/${line.getAttribute("data-line-name") || "이름 없는 선"}`);
      });
      const marks = [...svg.querySelectorAll("g.pa-angle[data-angle-role]")].map(group => {
        const path = group.querySelector("path.pa-arc");
        const label = group.querySelector("text");
        const center = String(group.getAttribute("data-angle-center") || "").split(",").map(Number);
        const start = Number(group.getAttribute("data-angle-start"));
        const span = Number(group.getAttribute("data-angle-span"));
        const sweep = Number(group.getAttribute("data-angle-sweep"));
        const radius = Number(group.getAttribute("data-angle-radius"));
        const labelMode = group.getAttribute("data-angle-label-mode") || "bisector";
        const labelX = Number(label?.getAttribute("x"));
        const labelY = Number(label?.getAttribute("y"));
        const labelBounds = label?.getBBox();
        const pathBounds = path ? box(path) : null;
        const pathStyle = path ? getComputedStyle(path) : null;
        const dx = labelX - center[0];
        const dy = labelY - center[1];
        const labelAngle = normalize(Math.atan2(dy, dx) * 180 / Math.PI);
        const expectedMidpoint = normalize(start + (sweep ? 1 : -1) * span / 2);
        const boundaryAngles = [start, normalize(start + (sweep ? 1 : -1) * span)];
        const halfWidth = Number(labelBounds?.width || 0) / 2;
        const halfHeight = Number(labelBounds?.height || 0) / 2;
        const boundaryClearance = boundaryAngles.map(angle => {
          const radians = angle * Math.PI / 180;
          const nx = -Math.sin(radians);
          const ny = Math.cos(radians);
          const centerDistance = Math.abs(dx * nx + dy * ny);
          const projectedHalfSize = halfWidth * Math.abs(nx) + halfHeight * Math.abs(ny);
          return centerDistance - projectedHalfSize;
        });
        const lineLabelOverlaps = labelBounds
          ? [...svg.querySelectorAll("line.pa-line")]
            .filter(line => lineIntersectsRect(line, labelBounds))
            .map(line => line.getAttribute("data-line-name") || "이름 없는 선")
          : ["각도 글자 없음"];
        const leader = inspectLeader(group);
        return {
          role: group.getAttribute("data-angle-role") || "",
          target: group.classList.contains("is-target"),
          label: compact(label?.textContent),
          value: Number(group.getAttribute("data-angle-value")),
          span,
          radius,
          labelMode,
          labelDistance: Math.hypot(dx, dy),
          midpointError: angleDistance(labelAngle, expectedMidpoint),
          boundaryClearance,
          lineLabelOverlaps,
          leader,
          pathLength: path && typeof path.getTotalLength === "function" ? path.getTotalLength() : 0,
          pathVisible: Boolean(pathBounds && pathBounds.width + pathBounds.height >= 6 && pathStyle && pathStyle.stroke !== "none" && Number.parseFloat(pathStyle.strokeWidth) >= 0.9),
          labelVisible: Boolean(labelBounds && labelBounds.width >= 7 && labelBounds.height >= 7 && inside(box(label), itemBox, 3))
        };
      });
      const lineWidths = [...svg.querySelectorAll(".pa-line")].map(element => Number.parseFloat(getComputedStyle(element).strokeWidth));
      const arcWidths = [...svg.querySelectorAll(".pa-arc")].map(element => Number.parseFloat(getComputedStyle(element).strokeWidth));
      return {
        phase: svg.getAttribute("data-phase"),
        sourceItemId: svg.getAttribute("data-source-item"),
        poolIndex: Number(svg.getAttribute("data-pool-index")),
        kind: svg.getAttribute("data-model-kind"),
        visible: svgBox.width >= 280 && svgBox.height >= 140,
        insideItem: inside(svgBox, itemBox, 3),
        viewBoxValid: viewBox.width >= 500 && viewBox.height >= 280,
        graphicsInsideViewBox,
        outsideGraphics,
        textInside: svgTexts.every(text => text.text && inside(text.box, itemBox, 3)),
        textOverlap: textOverlapPairs.length > 0,
        textOverlapPairs,
        lineCount: lineWidths.length,
        linesClear: lineWidths.length > 0 && lineWidths.every(width => width >= 1 && width <= 1.5),
        arcsClear: arcWidths.length > 0 && arcWidths.every(width => width >= 0.9),
        textStyleClear,
        lineStyleClear,
        nameLineOverlaps,
        marks
      };
    };

    const items = [...document.querySelectorAll("#problemView .question-item")].map(item => {
      const prompt = item.querySelector(".question-prompt");
      const helperSelectors = ".question-step,[data-step-evidence],.hint,.help,.guide";
      return {
        promptText: compact(prompt?.innerText),
        overflow: item.scrollWidth > item.clientWidth + 1,
        answerLineVisible: Boolean(item.querySelector(".answer-line")?.getBoundingClientRect().height),
        helperVisible: [...(prompt?.querySelectorAll(helperSelectors) || [])].some(element => getComputedStyle(element).display !== "none"),
        svg: inspectSvg(prompt?.querySelector("svg.source42-pa"), item)
      };
    });
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      items
    };
  });
}

async function collectSolutionState(page) {
  return page.evaluate(() => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const box = element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const inside = (inner, outer, tolerance = 2) => inner.left >= outer.left - tolerance
      && inner.right <= outer.right + tolerance
      && inner.top >= outer.top - tolerance
      && inner.bottom <= outer.bottom + tolerance;
    const inspectSvg = (svg, item) => {
      if (!svg) return null;
      const viewBox = svg.viewBox.baseVal;
      const insideViewBox = (bounds, tolerance = 2) => bounds.x >= viewBox.x - tolerance
        && bounds.y >= viewBox.y - tolerance
        && bounds.x + bounds.width <= viewBox.x + viewBox.width + tolerance
        && bounds.y + bounds.height <= viewBox.y + viewBox.height + tolerance;
      const lineIntersectsRect = (line, bounds, padding = 1.5) => {
        const left = bounds.x - padding;
        const right = bounds.x + bounds.width + padding;
        const top = bounds.y - padding;
        const bottom = bounds.y + bounds.height + padding;
        const x1 = Number(line.getAttribute("x1"));
        const y1 = Number(line.getAttribute("y1"));
        const x2 = Number(line.getAttribute("x2"));
        const y2 = Number(line.getAttribute("y2"));
        const dx = x2 - x1;
        const dy = y2 - y1;
        let low = 0;
        let high = 1;
        for (const [p, q] of [[-dx, x1 - left], [dx, right - x1], [-dy, y1 - top], [dy, bottom - y1]]) {
          if (p === 0 && q < 0) return false;
          if (p !== 0) {
            const ratio = q / p;
            if (p < 0) low = Math.max(low, ratio);
            else high = Math.min(high, ratio);
            if (low > high) return false;
          }
        }
        return true;
      };
      const lineWidths = [...svg.querySelectorAll(".pa-line")].map(element => Number.parseFloat(getComputedStyle(element).strokeWidth));
      const arcWidths = [...svg.querySelectorAll(".pa-arc")].map(element => Number.parseFloat(getComputedStyle(element).strokeWidth));
      const svgTexts = [...svg.querySelectorAll("text")].map(text => ({ text: compact(text.textContent), box: box(text) }));
      const textOverlapPairs = [];
      for (let first = 0; first < svgTexts.length; first += 1) {
        for (let second = first + 1; second < svgTexts.length; second += 1) {
          const a = svgTexts[first].box;
          const b = svgTexts[second].box;
          const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (width > 0.5 && height > 0.5) textOverlapPairs.push(`${svgTexts[first].text}/${svgTexts[second].text}`);
        }
      }
      const textStyleClear = [...svg.querySelectorAll("text")].every(text => {
        const style = getComputedStyle(text);
        const expectedFamily = text.classList.contains("pa-name") ? "Malgun Gothic" : "Times New Roman";
        return style.fontWeight === "400" && style.fill === "rgb(17, 17, 17)" && style.stroke === "none" && style.fontFamily.includes(expectedFamily);
      });
      const lineElements = [...svg.querySelectorAll(".pa-line, .pa-arc, .pa-parallel, .pa-right, .pa-leader")];
      const lineStyleClear = lineElements.length > 0 && lineElements.every(element => getComputedStyle(element).stroke === "rgb(34, 34, 34)");
      const nameLineOverlaps = [...svg.querySelectorAll("text.pa-name")].flatMap(label => {
        const bounds = label.getBBox();
        return [...svg.querySelectorAll("line.pa-line")]
          .filter(line => lineIntersectsRect(line, bounds))
          .map(line => `${compact(label.textContent)}/${line.getAttribute("data-line-name") || "이름 없는 선"}`);
      });
      const angleMarks = [...svg.querySelectorAll("g.pa-angle")].map(group => {
        const label = group.querySelector("text");
        const bounds = label?.getBBox();
        return {
          label: compact(label?.textContent),
          labelInside: Boolean(label && bounds && inside(box(label), box(item), 3) && insideViewBox(bounds, 3)),
          lineLabelOverlaps: bounds
            ? [...svg.querySelectorAll("line.pa-line, line.pa-guide")]
              .filter(line => lineIntersectsRect(line, bounds))
              .map(line => line.getAttribute("data-line-name") || "이름 없는 선")
            : ["각도 글자 없음"]
        };
      });
      const outsideGraphics = [...svg.querySelectorAll("line,path,circle,text")]
        .map(element => ({ element, bounds: element.getBBox() }))
        .filter(item => !insideViewBox(item.bounds, 3))
        .map(item => ({ tag: item.element.tagName, className: item.element.getAttribute("class") || "", name: item.element.getAttribute("data-line-name") || compact(item.element.textContent), bounds: { x: item.bounds.x, y: item.bounds.y, width: item.bounds.width, height: item.bounds.height } }));
      const guides = [...svg.querySelectorAll(".pa-guide")];
      const guidesInsideViewBox = guides.every(guide => insideViewBox(guide.getBBox(), 3));
      return {
        insideItem: inside(box(svg), box(item), 3),
        graphicsInsideViewBox: outsideGraphics.length === 0,
        outsideGraphics,
        linesClear: lineWidths.length > 0 && lineWidths.every(width => width >= 1 && width <= 1.5),
        arcsClear: arcWidths.length > 0 && arcWidths.every(width => width >= 0.9),
        textStyleClear,
        lineStyleClear,
        textOverlapPairs,
        guideCount: guides.length,
        guidesInsideViewBox,
        nameLineOverlaps,
        angleMarks
      };
    };
    const lineCount = element => {
      const tops = [];
      const range = document.createRange();
      range.selectNodeContents(element);
      [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0).forEach(rect => {
        if (!tops.some(top => Math.abs(top - rect.top) < 2)) tops.push(rect.top);
      });
      return Math.max(1, tops.length);
    };
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      items: [...document.querySelectorAll("#solutionView .solution-item")].map(item => {
        const svg = item.querySelector(".solution-answer-visual svg.source42-pa");
        const formulas = [...item.querySelectorAll("p .math-inline-expression")].map(formula => ({
          text: compact(formula.textContent),
          lines: lineCount(formula),
          whiteSpace: getComputedStyle(formula).whiteSpace,
          hasBreak: Boolean(formula.querySelector("br"))
        }));
        return {
          text: compact(item.innerText),
          overflow: item.scrollWidth > item.clientWidth + 1,
          hasAnswerVisual: Boolean(svg && svg.getAttribute("data-phase") === "answer"),
          sourceItemId: svg?.getAttribute("data-source-item") || "",
          kind: svg?.getAttribute("data-model-kind") || "",
          targetLabels: [...(svg?.querySelectorAll(".pa-angle.is-target text") || [])].map(text => compact(text.textContent)),
          angleLabels: [...(svg?.querySelectorAll(".pa-angle text") || [])].map(text => compact(text.textContent)),
          solutionText: compact(item.querySelector("p")?.innerText),
          svg: inspectSvg(svg, item),
          formulas
        };
      })
    };
  });
}

function assertProblem(state, type, label) {
  if (state.documentOverflow) fail(`${type.id} ${label}: 화면 전체에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) fail(`${type.id} ${label}: 문제는 3개여야 하나 ${state.items.length}개입니다.`);
  const poolIndices = [];
  state.items.forEach((item, index) => {
    const prefix = `${type.id} ${label} ${index + 1}번`;
    if (!item.promptText || item.overflow || !item.answerLineVisible) fail(`${prefix}: 문제 글·답칸 또는 가 폭이 올바르지 않습니다.`);
    if (item.helperVisible || /(힌트|도움말|정답은|따라서|먼저 .*하세요)/.test(item.promptText)) fail(`${prefix}: 문제 화면에 풀이성 설명이 노출됩니다.`);
    const svg = item.svg;
    if (!svg) {
      fail(`${prefix}: 평행선 각 그림이 없습니다.`);
      return;
    }
    poolIndices.push(svg.poolIndex);
    if (svg.phase !== "problem" || svg.sourceItemId !== type.sourceItemId || !svg.visible || !svg.insideItem || !svg.viewBoxValid || !svg.graphicsInsideViewBox || !svg.textInside || svg.textOverlap || !svg.linesClear || !svg.arcsClear || !svg.textStyleClear || !svg.lineStyleClear) {
      fail(`${prefix}: 그림 크기·출처·글자 겹침·선 굵기 검사에 실패했습니다 ${JSON.stringify(svg)}.`);
    }
    if (svg.nameLineOverlaps.length > 0) fail(`${prefix}: 점·선 이름이 실제 선분과 겹칩니다 ${svg.nameLineOverlaps.join(", ")}.`);
    const expectedMarks = expectedMarkCounts[svg.kind];
    if (svg.marks.length !== expectedMarks) fail(`${prefix}: 각 표시는 ${expectedMarks}개여야 하나 ${svg.marks.length}개입니다.`);
    svg.marks.forEach(mark => {
      const labelPlacementInvalid = mark.labelMode === "leader"
        ? mark.boundaryClearance.some(value => value < 1.5)
        : mark.labelDistance <= mark.radius + 8 || (mark.labelMode === "bisector" && mark.midpointError > 1.2);
      if (!(mark.value > 0 && mark.value < 180) || Math.abs(mark.value - mark.span) > 0.02 || mark.radius < 16 || labelPlacementInvalid || mark.pathLength < 5 || !mark.pathVisible || !mark.labelVisible) {
        fail(`${prefix}/${mark.role}: 각호 또는 숫자가 정확한 각 안에 있지 않거나 선과 겹칩니다 ${JSON.stringify(mark)}.`);
      }
      if (mark.lineLabelOverlaps.length > 0) fail(`${prefix}/${mark.role}: 각도 글자가 선과 겹칩니다 ${mark.lineLabelOverlaps.join(", ")}.`);
      if (mark.labelMode === "leader" && (!mark.leader.present || !mark.leader.connected || !mark.leader.visible)) fail(`${prefix}/${mark.role}: 원문 callout leader가 각호 중앙과 라벨을 연결하지 않습니다 ${JSON.stringify(mark.leader)}.`);
      if (mark.target && mark.labelMode !== "bisector") fail(`${prefix}/${mark.role}: target 각도 라벨이 각 내부 bisector에서 벗어났습니다.`);
      if (mark.target && !/^(?:㉠|㉡|㉢|㉣)$/.test(mark.label)) fail(`${prefix}/${mark.role}: 문제 그림에 목표각의 값이 미리 보입니다.`);
    });
  });
  if (poolIndices.length === 3 && new Set(poolIndices).size !== 3) fail(`${type.id} ${label}: 검증 문제 3개가 서로 다른 묶음으로 나오지 않습니다.`);
}

function assertSolution(state, type, label) {
  if (state.documentOverflow) fail(`${type.id} ${label}: 풀이 화면 전체에 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) fail(`${type.id} ${label}: 풀이는 3개여야 하나 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    const prefix = `${type.id} ${label} ${index + 1}번`;
    if (!item.text || item.overflow || !item.hasAnswerVisual || item.sourceItemId !== type.sourceItemId) fail(`${prefix}: 정답·답 그림 또는 폭이 올바르지 않습니다.`);
    if (item.svg?.textOverlapPairs?.length) fail(`${prefix}: 풀이 SVG 글자끼리 겹칩니다 ${item.svg.textOverlapPairs.join(", ")}.`);
    if (symbolicSolutionKinds.has(item.kind)) {
      if (item.kind === "example-2-4") {
        if (JSON.stringify(item.targetLabels) !== JSON.stringify(["㉠", "㉡"])) fail(`${prefix}: 예제 2-4 target 각이 개별 수치로 바뀌었습니다 ${JSON.stringify(item.targetLabels)}.`);
        if (item.angleLabels.filter(label => !/^(?:㉠|㉡)$/.test(label)).some(label => !/^\d+°$/.test(label))) fail(`${prefix}: 예제 2-4의 주어진 각 표시가 숫자 또는 target 기호가 아닙니다 ${JSON.stringify(item.angleLabels)}.`);
      } else if (JSON.stringify(item.angleLabels) !== JSON.stringify(["㉠", "㉡", "㉢", "㉣"])) {
        fail(`${prefix}: 원문 비교 풀이의 네 각 기호가 숫자로 바뀌었습니다 ${JSON.stringify(item.angleLabels)}.`);
      }
      if (item.kind === "exploration" && /\d+°/.test(item.solutionText)) fail(`${prefix}: 탐구 풀이에 원문이 요구하지 않은 수치 각 합이 노출됩니다.`);
      if (item.kind === "example-2-3" && /\d+°\s*\+/.test(item.solutionText)) fail(`${prefix}: 예제 2-3 풀이에 원문이 주지 않은 개별각 수치가 노출됩니다.`);
      if (item.kind === "example-2-3" && (item.svg?.guideCount !== 2 || !item.svg.guidesInsideViewBox)) fail(`${prefix}: 예제 2-3 풀이용 평행 보조선 2개가 없거나 그림 밖입니다.`);
    } else if (item.targetLabels.some(labelText => !/^\d+°$/.test(labelText))) {
      fail(`${prefix}: 답 그림의 목표각에 계산한 각도가 표시되지 않았습니다.`);
    }
    if (!item.svg || !item.svg.insideItem || !item.svg.graphicsInsideViewBox || !item.svg.linesClear || !item.svg.arcsClear || !item.svg.textStyleClear || !item.svg.lineStyleClear) fail(`${prefix}: 답 그림의 영역·선 굵기·문자 스타일 검사에 실패했습니다 ${JSON.stringify(item.svg)}.`);
    if ((item.svg?.nameLineOverlaps?.length || 0) > 0) fail(`${prefix}: 점·선 이름이 실제 선분과 겹칩니다 ${item.svg.nameLineOverlaps.join(", ")}.`);
    item.svg?.angleMarks.forEach(mark => {
      if (!mark.labelInside || mark.lineLabelOverlaps.length > 0) fail(`${prefix}: 답 각도가 목표각 안에 없거나 선과 겹칩니다 ${JSON.stringify(mark)}.`);
    });
    if (formulaRequired.has(item.kind) && item.formulas.length < 1) fail(`${prefix}: 계산식이 한 줄 수식 요소로 묶이지 않았습니다.`);
    item.formulas.forEach(formula => {
      if (!formula.text || formula.lines !== 1 || formula.whiteSpace !== "nowrap" || formula.hasBreak) fail(`${prefix}: 수식이 한 줄로 표시되지 않습니다 ${JSON.stringify(formula)}.`);
    });
  });
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function inspectType(page, baseUrl, type, viewport, label) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ media: "screen" });
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
  await waitForFonts(page);
  const problem = await collectProblemState(page);
  assertProblem(problem, type, `${label} 문제`);
  screenStates += 1;
  await page.screenshot({ path: path.join(outputDir, `${type.id}-${label}-problem.png`), fullPage: true, timeout: 120000 });
  if (label === "desktop" && requestedTypeId) {
    await page.locator("#problemView .question-item").first().screenshot({ path: path.join(outputDir, `${type.id}-problem-detail.png`) });
  }

  await page.locator("#solutionTab").click();
  await waitForFonts(page);
  const solution = await collectSolutionState(page);
  assertSolution(solution, type, `${label} 풀이`);
  screenStates += 1;
  await page.screenshot({ path: path.join(outputDir, `${type.id}-${label}-solution.png`), fullPage: true, timeout: 120000 });

  if (label !== "desktop") return;
  await page.locator("#problemTab").click();
  await page.emulateMedia({ media: "print" });
  await waitForFonts(page);
  const printProblem = await collectProblemState(page);
  assertProblem(printProblem, type, "A4 문제");
  const problemPdfPath = path.join(outputDir, `${type.id}-a4-problem.pdf`);
  await page.pdf({ path: problemPdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  await assertPdfPagesContainWorksheetItems(problemPdfPath, `${type.id} A4 문제`, type);
  pdfFiles += 1;
  await page.emulateMedia({ media: "screen" });
  await page.locator("#solutionTab").click();
  await page.emulateMedia({ media: "print" });
  await waitForFonts(page);
  const printSolution = await collectSolutionState(page);
  assertSolution(printSolution, type, "A4 풀이");
  const solutionPdfPath = path.join(outputDir, `${type.id}-a4-solution.pdf`);
  await page.pdf({ path: solutionPdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  await assertPdfPagesContainWorksheetItems(solutionPdfPath, `${type.id} A4 풀이`, type);
  pdfFiles += 1;
  await page.emulateMedia({ media: "screen" });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if ((!requestedTypeId && types.length !== 9) || (requestedTypeId && types.length !== 1) || types.some(type => !type || type.reviewLocked || api.generatorKey(type) !== moduleApi.GENERATOR_KEY)) fail(requestedTypeId ? `${requestedTypeId} 공개 유형을 전용 생성기에서 찾지 못했습니다.` : "평행선 각 공개 유형 9개가 전용 생성기에 연결되지 않았습니다.");
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`브라우저 오류: ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`콘솔 오류: ${message.text()}`);
  });
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  try {
    for (const type of types.filter(Boolean)) {
      await inspectType(page, baseUrl, type, { width: 1440, height: 1000 }, "desktop");
      await inspectType(page, baseUrl, type, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    await page.close();
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  fs.writeFileSync(path.join(outputDir, "audit-summary.json"), JSON.stringify({ types: types.filter(Boolean).length, screenStates, pdfFiles, failures }, null, 2));
  if (failures.length) {
    console.error(`4-2 평행선 각 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 5).join("\n"));
    console.error(`전체 기록: ${path.join(outputDir, "audit-summary.json")}`);
    process.exit(1);
  }
  console.log(`4-2 평행선 각 브라우저 감사 통과: ${types.length}유형 · PC/390px 문제·풀이 ${screenStates}상태 · A4 문제·풀이 ${pdfFiles}파일 · ${outputDir}`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
