/* Source-backed equal-partition problem model and exact validator. */

export const GAME_ID = "equal-partition";
export const PROGRESS_KEY = "equalPartition";

const idOf = ([x, y]) => `${x},${y}`;
const cellOf = (id) => id.split(",").map(Number);
const sortCells = (cells) => [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);

export function edgeKey(a, b) {
  return [idOf(a), idOf(b)].sort().join("|");
}

export function rectangle(width, height) {
  return Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => [x, y])).flat();
}

export function normalize(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return sortCells(cells.map(([x, y]) => [x - minX, y - minY]));
}

function shapeKey(cells) {
  return normalize(cells).map(idOf).join(" ");
}

function turn(cells) { return normalize(cells.map(([x, y]) => [-y, x])); }
function flip(cells) { return normalize(cells.map(([x, y]) => [-x, y])); }

export function congruenceKey(cells) {
  const keys = [];
  let current = normalize(cells);
  for (let index = 0; index < 4; index += 1) { keys.push(shapeKey(current)); current = turn(current); }
  current = flip(cells);
  for (let index = 0; index < 4; index += 1) { keys.push(shapeKey(current)); current = turn(current); }
  return keys.sort()[0];
}

export function internalEdges(board) {
  const cells = new Set(board.map(idOf));
  const result = [];
  board.forEach(([x, y]) => [[x + 1, y], [x, y + 1]].forEach((next) => {
    if (cells.has(idOf(next))) result.push({ a: [x, y], b: next, key: edgeKey([x, y], next) });
  }));
  return result;
}

export function cutsForRegions(regions) {
  const owner = new Map();
  regions.forEach((region, index) => region.forEach((cell) => owner.set(idOf(cell), index)));
  return new Set(internalEdges(regions.flat()).filter(({ a, b }) => owner.get(idOf(a)) !== owner.get(idOf(b))).map(({ key }) => key));
}

export function regionsFromCuts(board, cuts) {
  const boardSet = new Set(board.map(idOf));
  const unseen = new Set(boardSet);
  const regions = [];
  while (unseen.size) {
    const start = unseen.values().next().value;
    unseen.delete(start);
    const queue = [cellOf(start)];
    const region = [];
    while (queue.length) {
      const cell = queue.shift();
      region.push(cell);
      const [x, y] = cell;
      [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach((next) => {
        const nextId = idOf(next);
        if (!unseen.has(nextId) || cuts.has(edgeKey(cell, next))) return;
        unseen.delete(nextId);
        queue.push(next);
      });
    }
    regions.push(sortCells(region));
  }
  return regions;
}

function markerValue(problem, region, mode) {
  const values = problem.markers || {};
  if (mode === "oneEach" || mode === "equalCount") return region.filter((cell) => Object.hasOwn(values, idOf(cell))).length;
  if (mode === "equalSum") return region.reduce((sum, cell) => sum + Number(values[idOf(cell)] || 0), 0);
  return 0;
}

export function inspectPartition(problem, regions) {
  const reasons = [];
  if (regions.length !== problem.parts) reasons.push("regionCount");
  const areas = regions.map((region) => region.length);
  if (new Set(areas).size > 1) reasons.push("equalArea");
  if (problem.congruent && new Set(regions.map(congruenceKey)).size > 1) reasons.push("congruent");
  if (problem.markerRule) {
    const values = regions.map((region) => markerValue(problem, region, problem.markerRule));
    if (problem.markerRule === "oneEach" && values.some((value) => value !== 1)) reasons.push("oneEach");
    if ((problem.markerRule === "equalCount" || problem.markerRule === "equalSum") && new Set(values).size > 1) reasons.push(problem.markerRule);
  }
  return { valid: reasons.length === 0, reasons, areas };
}

export function validateCuts(problem, cuts) {
  const regions = regionsFromCuts(problem.board, cuts);
  return { ...inspectPartition(problem, regions), regions };
}

function connectedSubsets(cells, size, requiredId) {
  const cellSet = new Set(cells.map(idOf));
  const found = new Map();
  const start = cellOf(requiredId);
  function expand(chosen, frontier) {
    if (chosen.size === size) {
      const region = [...chosen].map(cellOf);
      found.set(region.map(idOf).sort().join(" "), region);
      return;
    }
    [...frontier].sort().forEach((candidate) => {
      const nextChosen = new Set(chosen);
      nextChosen.add(candidate);
      const nextFrontier = new Set(frontier);
      nextFrontier.delete(candidate);
      const [x, y] = cellOf(candidate);
      [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach((next) => {
        const id = idOf(next);
        if (cellSet.has(id) && !nextChosen.has(id)) nextFrontier.add(id);
      });
      expand(nextChosen, nextFrontier);
    });
  }
  const firstFrontier = new Set();
  const [x, y] = start;
  [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach((next) => {
    if (cellSet.has(idOf(next))) firstFrontier.add(idOf(next));
  });
  expand(new Set([requiredId]), firstFrontier);
  return [...found.values()];
}

export function findSolutions(problem, limit = 12) {
  const targetArea = problem.board.length / problem.parts;
  if (!Number.isInteger(targetArea)) return [];
  const solutions = inspectPartition(problem, problem.sampleRegions).valid
    ? [problem.sampleRegions.map((region) => sortCells(region))] : [];
  if (limit === 1 && solutions.length) return solutions;
  function visit(remaining, regions) {
    if (solutions.length >= limit) return;
    if (!remaining.length) {
      if (inspectPartition(problem, regions).valid) solutions.push(regions.map((region) => sortCells(region)));
      return;
    }
    const firstId = remaining.map(idOf).sort()[0];
    connectedSubsets(remaining, targetArea, firstId).forEach((region) => {
      if (solutions.length >= limit) return;
      if (problem.congruent && regions.length && congruenceKey(region) !== congruenceKey(regions[0])) return;
      if (problem.markerRule === "oneEach" && markerValue(problem, region, "oneEach") !== 1) return;
      const used = new Set(region.map(idOf));
      visit(remaining.filter((cell) => !used.has(idOf(cell))), [...regions, region]);
    });
  }
  visit(problem.board, []);
  const unique = new Map();
  solutions.forEach((regions) => {
    const key = regions.map((region) => region.map(idOf).sort().join(" ")).sort().join(" / ");
    unique.set(key, regions);
  });
  return [...unique.values()].slice(0, limit);
}

const rows = (w, h, parts) => Array.from({ length: parts }, (_, p) => {
  const start = Math.round(p * h / parts), end = Math.round((p + 1) * h / parts);
  return Array.from({ length: end - start }, (_, dy) => Array.from({ length: w }, (_, x) => [x, start + dy])).flat();
});
const evenBands = (w, h, parts, preferRows = false) => {
  if (preferRows && h % parts === 0) return rows(w, h, parts);
  if (w % parts === 0) return cols(w, h, parts);
  return rows(w, h, parts);
};
const cols = (w, h, parts) => Array.from({ length: parts }, (_, p) => {
  const start = Math.round(p * w / parts), end = Math.round((p + 1) * w / parts);
  return Array.from({ length: h }, (_, y) => Array.from({ length: end - start }, (_, dx) => [start + dx, y])).flat();
});

function makeProblem(level, index, { width, height, parts, regions, markerRule = null, markers = null, congruent = false, sourceRef }) {
  const sampleRegions = regions || (width % parts === 0 ? cols(width, height, parts) : rows(width, height, parts));
  return {
    id: `equal-partition-l${level}-${String(index + 1).padStart(2, "0")}`,
    board: sortCells(sampleRegions.flat()), parts, markerRule, markers, congruent, sampleRegions,
    sampleCuts: cutsForRegions(sampleRegions), sourceRef
  };
}

const D1 = "Prism D1-1 pp.13-25 (same-size-and-shape division, marker and equal-sum reconstruction)";
const E4 = "Prism E4-3 pp.10-26 (congruent division reconstruction; similarity excluded)";

const level1 = [
  [4,2],[3,2],[4,3],[5,2],[4,4],[6,2],[5,4],[3,4],[6,3],[5,2]
].map(([width,height], i) => makeProblem(1,i,{ width,height,parts:2,regions:evenBands(width,height,2,i%2===1),sourceRef:D1 }));

const level2Specs = [[3,3,3],[4,3,3],[4,4,4],[5,4,4],[6,3,3],[4,6,3],[6,4,4],[5,3,3],[6,6,3],[4,5,4]];
const level2 = level2Specs.map(([width,height,parts],i)=>makeProblem(2,i,{width,height,parts,regions:evenBands(width,height,parts,i%2===1),sourceRef:D1}));

function markersAt(regions, values = null) {
  return Object.fromEntries(regions.map((region,index)=>[idOf(region[Math.floor(region.length/2)]), values ? values[index] : "marker"]));
}
const level3 = level2Specs.map(([width,height,parts],i)=>{
  const sampleRegions=evenBands(width,height,parts,i%2===1);
  if(i<6) return makeProblem(3,i,{width,height,parts,regions:sampleRegions,markerRule:"oneEach",markers:markersAt(sampleRegions),sourceRef:D1});
  const markers={};
  sampleRegions.forEach((region)=>{ const selected=region.slice(0,Math.min(3,region.length)); const last=selected.length-1; selected.forEach((cell,j)=>{markers[idOf(cell)]=j===last?6-(selected.length-1):1;}); });
  return makeProblem(3,i,{width,height,parts,regions:sampleRegions,markerRule:"equalSum",markers,sourceRef:D1});
});

const level4 = [[4,2],[3,2],[4,3],[5,2],[4,4],[6,2],[6,3],[5,4],[4,5],[6,4]].map(([width,height],i)=>makeProblem(4,i,{width,height,parts:2,regions:evenBands(width,height,2,i%2===1),congruent:true,sourceRef:E4}));

const lShape = [[0,0],[0,1],[1,1]];
function shift(cells,dx,dy){return cells.map(([x,y])=>[x+dx,y+dy]);}
const complex = [
  [shift(lShape,0,0),shift(lShape,2,0),shift(lShape,4,0)],
  [shift(lShape,0,0),shift(lShape,2,0),shift(lShape,0,2),shift(lShape,2,2)]
];
const level5 = Array.from({length:10},(_,i)=>{
  const parts=i===0?3:i===1?4:(i%3===0?4:3);
  let sampleRegions;
  if(i<2) sampleRegions=complex[i];
  else { const width=parts*(i%2?2:1),height=i%2?2:3; sampleRegions=cols(width,height,parts); }
  const board=sampleRegions.flat();
  const width=Math.max(...board.map(([x])=>x))+1,height=Math.max(...board.map(([,y])=>y))+1;
  return makeProblem(5,i,{width,height,parts,regions:sampleRegions,congruent:true,markerRule:"oneEach",markers:markersAt(sampleRegions),sourceRef:E4});
});

export const levels = [
  { id:1,titleKey:"level1Title",descriptionKey:"level1Desc",ready:true,problems:level1 },
  { id:2,titleKey:"level2Title",descriptionKey:"level2Desc",ready:true,problems:level2 },
  { id:3,titleKey:"level3Title",descriptionKey:"level3Desc",ready:true,problems:level3 },
  { id:4,titleKey:"level4Title",descriptionKey:"level4Desc",ready:true,problems:level4 },
  { id:5,titleKey:"level5Title",descriptionKey:"level5Desc",ready:true,problems:level5 }
];

export function validateLevels() {
  const ids = new Set();
  levels.forEach((level) => {
    if (level.problems.length !== 10) throw new Error(`Level ${level.id} needs 10 problems.`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate ${problem.id}`); ids.add(problem.id);
      if (new Set(problem.board.map(idOf)).size !== problem.board.length) throw new Error(`${problem.id} repeats cells.`);
      if (problem.board.length % problem.parts) throw new Error(`${problem.id} area is not divisible.`);
      if (!problem.sourceRef) throw new Error(`${problem.id} lacks source locator.`);
      if (!inspectPartition(problem, problem.sampleRegions).valid) throw new Error(`${problem.id} sample is invalid.`);
      if (!validateCuts(problem, problem.sampleCuts).valid) throw new Error(`${problem.id} sample cuts are invalid.`);
    });
  });
  return true;
}

validateLevels();
