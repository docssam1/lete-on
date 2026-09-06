import { deriveDrawing } from "./drawing-problems.js?v=draw-1";

export const domainNames = ["모양 관찰", "평행이동", "회전", "확대", "줄이기"];

export const drawingQuota = (count) => count < 2 ? 0 : count < 4 ? 1 : 2;
export const entryHeight = (entry) => entry.responseMode === "draw" ? 73 : 48;
export const PAGE_CAPACITY = 244;

export function normalizeCount(value, available = 20) {
  const parsed = Number(value);
  const requested = Number.isFinite(parsed) && value !== "" ? Math.round(parsed) : 10;
  return Math.max(1, Math.min(20, available, requested));
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function chooseEntries(levels, selection, count, random = Math.random) {
  const included = selection === "all" ? levels : levels.filter((level) => String(level.id) === selection);
  if (!included.length) throw new Error("Unknown worksheet domain.");
  const total = normalizeCount(count, included.reduce((sum, level) => sum + level.problems.length, 0));
  const quotas = included.map(() => 0);
  for (let index = 0; index < total; index += 1) quotas[index % included.length] += 1;
  return included.flatMap((level, index) => {
    const quota = quotas[index];
    const drawCount = drawingQuota(quota);
    const pool = shuffle(level.problems, random);
    const drawn = [];
    if (drawCount) drawn.push(pool.find((problem) => problem.closed) || pool[0]);
    if (drawCount === 2) drawn.unshift(pool.find((problem) => !problem.closed) || pool.find((problem) => problem !== drawn[0]));
    const choices = pool.filter((problem) => !drawn.includes(problem)).slice(0, quota - drawCount);
    return [
      ...choices.map((problem) => ({ level, problem, responseMode: "choice" })),
      ...drawn.map((problem) => ({ level, problem, responseMode: "draw", drawing: deriveDrawing(problem) }))
    ];
  });
}

export function groupPages(entries) {
  const pages = [];
  for (const [index, entry] of entries.entries()) {
    const page = pages.at(-1);
    const height = page?.reduce((sum, item) => sum + entryHeight(item), 0) || 0;
    const startsDrawing = entry.responseMode === "draw" && entries[index - 1]?.responseMode !== "draw";
    const required = startsDrawing
      ? entries.slice(index, index + 2).filter((item) => item.level.id === entry.level.id && item.responseMode === "draw").reduce((sum, item) => sum + entryHeight(item), 0)
      : entryHeight(entry);
    if (!page || page[0].level.id !== entry.level.id || page.length === 5 || height + required > PAGE_CAPACITY) pages.push([entry]);
    else page.push(entry);
  }
  return pages;
}

export function displacementText({ dx = 0, dy = 0 }) {
  const steps = [];
  if (dx) steps.push(`${dx > 0 ? "오른쪽" : "왼쪽"} ${Math.abs(dx) / 10}칸`);
  if (dy) steps.push(`${dy > 0 ? "아래" : "위"} ${Math.abs(dy) / 10}칸`);
  return steps.join(", ");
}

export function operationText(operation) {
  if (operation.kind === "translate") return `${displacementText(operation)} 이동`;
  if (operation.kind === "rotate") return `${operation.angle < 0 ? "반시계" : "시계"} 방향으로 ${Math.abs(operation.angle) === 90 ? "반의 반 바퀴" : "반 바퀴"} (${Math.abs(operation.angle)}°) 회전`;
  if (operation.kind === "enlarge") return `변의 길이를 ${operation.scale}배로 확대`;
  if (operation.kind === "reduce") return "변의 길이를 절반으로 줄이기";
  return "모양과 꺾임 비교";
}

export function pathData(points, closed = false) {
  return points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ") + (closed ? " Z" : "");
}

export function edgeLength(points) {
  return Math.round(Math.hypot(points[1][0] - points[0][0], points[1][1] - points[0][1]) * 100) / 1000;
}

export function anchorIndex(problem) {
  if (problem.operation.kind !== "rotate") return 0;
  const pivot = problem.operation.pivot || [50, 50];
  return problem.target.findIndex(([x, y]) => Math.hypot(x - pivot[0], y - pivot[1]) > 1);
}

export function changedCorners(problem, choiceIndex) {
  const correct = problem.choices[problem.answerIndex];
  return problem.choices[choiceIndex].map((point, index) => ({ point, index }))
    .filter(({ point, index }) => !correct[index] || Math.hypot(point[0] - correct[index][0], point[1] - correct[index][1]) > .01);
}
