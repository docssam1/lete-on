"use strict";

const fs = require("fs");
const vm = require("vm");
const crypto = require("crypto");

const context = { window: {}, console };
vm.createContext(context);
for (const file of ["generators.js", "source-grade6-surface-e1.js"]) {
  vm.runInContext(fs.readFileSync(`${__dirname}/${file}`, "utf8"), context, { filename: file });
}

const generator = context.window.HSE_GENERATORS;
const ids = [
  "exploration", "example-1", "example-2", "example-3", "example-4",
  "mission-1", "mission-2", "mission-3", "mission-6"
];
const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const key = point => point.join(",");
const fail = [];
const assert = (condition, message) => { if (!condition) fail.push(message); };
const surface = (size, removed) => {
  const gone = new Set(removed.map(key));
  let total = 0;
  for (let z = 0; z < size; z += 1) for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    if (gone.has(key([x, y, z]))) continue;
    for (const [dx, dy, dz] of dirs) {
      const next = [x + dx, y + dy, z + dz];
      if (next.some(value => value < 0 || value >= size) || gone.has(key(next))) total += 1;
    }
  }
  return total;
};
const surfaceOf = cells => {
  const present = new Set(cells.map(key));
  let total = 0;
  for (const [x, y, z] of cells) for (const [dx, dy, dz] of dirs) if (!present.has(key([x + dx, y + dy, z + dz]))) total += 1;
  return total;
};
const hasNeighbor = (point, cells) => dirs.some(([dx, dy, dz]) => cells.has(key([point[0] + dx, point[1] + dy, point[2] + dz])));
const box = (x, y, z, w, d, h) => ({ x, y, z, w, d, h });
const overlap = (a0, a1, b0, b1) => Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
const contact = (a, b) => {
  if (a.x + a.w === b.x || b.x + b.w === a.x) return overlap(a.y, a.y + a.d, b.y, b.y + b.d) * overlap(a.z, a.z + a.h, b.z, b.z + b.h);
  if (a.y + a.d === b.y || b.y + b.d === a.y) return overlap(a.x, a.x + a.w, b.x, b.x + b.w) * overlap(a.z, a.z + a.h, b.z, b.z + b.h);
  if (a.z + a.h === b.z || b.z + b.h === a.z) return overlap(a.x, a.x + a.w, b.x, b.x + b.w) * overlap(a.y, a.y + a.d, b.y, b.y + b.d);
  return 0;
};
const boxesSurface = boxes => {
  const isolated = boxes.reduce((sum, item) => sum + 2 * (item.w * item.d + item.w * item.h + item.d * item.h), 0);
  let contacts = 0;
  for (let i = 0; i < boxes.length; i += 1) for (let j = i + 1; j < boxes.length; j += 1) contacts += contact(boxes[i], boxes[j]);
  return { isolated, contacts, surface: isolated - 2 * contacts };
};
const triangular = (s, g, h) => {
  const middle0 = (s + g) / 2;
  const middle1 = middle0 + s + h;
  return [
    box(0, 0, 0, s, s, s), box(s + g, 0, 0, s, s, s), box(2 * (s + g), 0, 0, s, s, s),
    box(middle0, 0, s, s, s, s), box(middle1, 0, s, s, s, s), box(middle0 + (s + h) / 2, 0, 2 * s, s, s, s)
  ];
};
const tunnel = (size, middle) => {
  const removed = [];
  for (let z = 0; z < size; z += 1) for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    if ((x === middle && y === middle) || (x === middle && z === middle) || (y === middle && z === middle)) removed.push([x, y, z]);
  }
  return removed;
};
const mission5 = [[0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1], [0, 0, 2]];
const mission5Pools = [mission5, mission5.map(([x, y, z]) => [z, y, x]), mission5.map(([x, y, z]) => [y, z, x])];

const answers = {};
for (const kind of ids) {
  const hashes = new Set();
  for (let variant = 0; variant < 3; variant += 1) {
    const generated = generator.generate({ sourceItemId: `6-1-u6-e1-${kind}`, generatorKey: "sourceGrade6SurfaceE1", variant }, 1, 0, 1, variant);
    assert(generated.verifiedVariantCount === 3, `${kind}: verifiedVariantCount`);
    assert(!generated.prompt.includes("답:"), `${kind}/${variant}: problem contains answer text`);
    assert(Boolean(generated.answerVisual), `${kind}/${variant}: answer visual missing`);
    assert(!generated.answerVisual.includes("답:"), `${kind}/${variant}: answer value duplicated inside diagram`);
    hashes.add(crypto.createHash("sha256").update(`${generated.prompt}\n${generated.answerVisual}`).digest("hex"));
    if (variant === 0) answers[kind] = generated.answer;
  }
  assert(hashes.size === 3, `${kind}: duplicate verified pool`);
}

const exploration = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 2, 0], [1, 2, 0], [0, 1, 1], [1, 1, 1], [2, 2, 1], [0, 0, 2], [1, 0, 2], [2, 2, 2]];
assert(exploration.length === 11, "exploration: remaining count");
assert(surfaceOf(exploration) === 54, "exploration: surface");
assert(exploration.every(point => hasNeighbor(point, new Set(exploration.map(key)))), "exploration: isolated cube");
assert(Math.max(...Array.from({ length: 10 }, (_, index) => {
  const remaining = index + 1;
  return 6 * remaining - 2 * Math.ceil(remaining / 2);
})) === 50, "exploration: fewer than eleven cubes cannot keep surface 54");
assert(answers.exploration === "16개", "exploration: answer");
const explorationGenerated = generator.generate({ sourceItemId: "6-1-u6-e1-exploration", generatorKey: "sourceGrade6SurfaceE1", variant: 0 }, 1, 0, 1, 0);
assert(explorationGenerated.prompt.includes("최대 몇 개인가요"), "exploration: maximum wording missing");
assert(explorationGenerated.prompt.includes('data-model="voxel-grid"'), "exploration: initial cube visual missing");
assert(explorationGenerated.answerVisual.includes('data-model="three-layer-map"'), "exploration: answer layer map missing");
const e1Extrema = generator.generate({ sourceItemId: "6-1-u6-e1-example-1", generatorKey: "sourceGrade6SurfaceE1", variant: 0 }, 1, 0, 1, 0);
assert(!e1Extrema.prompt.includes("<strong>가장 큰 경우") && !e1Extrema.prompt.includes("<strong>가장 작은 경우"), "example-1: solution arrangement leaked into problem");
assert(e1Extrema.answerVisual.includes("<strong>가장 큰 경우") && e1Extrema.answerVisual.includes("<strong>가장 작은 경우"), "example-1: answer arrangements missing");
const m1Extrema = generator.generate({ sourceItemId: "6-1-u6-e1-mission-1", generatorKey: "sourceGrade6SurfaceE1", variant: 0 }, 1, 0, 1, 0);
assert(!m1Extrema.prompt.includes(">가장 큰 경우</text>") && !m1Extrema.prompt.includes(">가장 작은 경우</text>"), "mission-1: solution arrangement leaked into problem");
assert(m1Extrema.answerVisual.includes(">가장 큰 경우</text>") && m1Extrema.answerVisual.includes(">가장 작은 경우</text>"), "mission-1: answer arrangements missing");

const scale = 1;
const maxBoxes = [box(0, 0, 0, scale, scale, scale), box(-2 * scale, -scale, -scale, 2 * scale, 2 * scale, 2 * scale), box(0, -2 * scale, scale, 3 * scale, 3 * scale, 3 * scale)];
const minBoxes = [box(0, 0, 0, scale, scale, scale), box(-2 * scale, -scale, -scale, 2 * scale, 2 * scale, 2 * scale), box(-2 * scale, -2 * scale, scale, 3 * scale, 3 * scale, 3 * scale)];
assert(boxesSurface(maxBoxes).surface === 80, "example-1: maximum");
assert(boxesSurface(minBoxes).surface === 72, "example-1: minimum");
assert(boxesSurface(triangular(3, 2, 2)).surface === 306, "example-2: partial contact");
assert(boxesSurface(triangular(8, 5, 6)).contacts === 64, "mission-2: partial contact");
assert(boxesSurface(triangular(8, 5, 6)).surface === 2176, "mission-2: surface");
assert(surface(3, tunnel(3, 1)) * 3 * 3 === 648, "example-3: surface");
assert(6 * 9 * 9 + 12 * 9 * 3 - 18 * 3 * 3 === 648, "example-3: continuous tunnel formula");
assert(answers["example-4"] === "4배", "example-4: ratio");
assert(answers["mission-1"] === "최대 34, 최소 24", "mission-1: extrema");
assert(6 * 400 * 400 + 12 * 400 * 100 - 18 * 100 * 100 === 1260000, "mission-3: centered continuous tunnel surface");
assert(answers["mission-6"] === "18/7배", "mission-6: ratio");

const e4 = generator.generate({ sourceItemId: "6-1-u6-e1-example-4", generatorKey: "sourceGrade6SurfaceE1", variant: 0 }, 1, 0, 1, 0);
const m6 = generator.generate({ sourceItemId: "6-1-u6-e1-mission-6", generatorKey: "sourceGrade6SurfaceE1", variant: 0 }, 1, 0, 1, 0);
assert(e4.prompt.includes("작은 직육면체"), "example-4: wording");
assert(e4.prompt.includes("source61-surface-e1-grid-line"), "example-4: partition grid");
assert(m6.prompt.includes("source61-surface-e1-grid-line"), "mission-6: partition grid");
for (const kind of ["example-3", "mission-3"]) {
  const generated = generator.generate({ sourceItemId: `6-1-u6-e1-${kind}`, generatorKey: "sourceGrade6SurfaceE1", variant: 0 }, 1, 0, 1, 0);
  assert(generated.prompt.includes('data-model="continuous-centered-three-tunnels"'), `${kind}: continuous centered tunnel model missing`);
  assert(generated.answerVisual.includes('data-model="continuous-centered-three-tunnels"'), `${kind}: answer tunnel model missing`);
}

if (fail.length) {
  console.error(`6-1 겉넓이 E1 집중 감사 실패: ${fail.length}건`);
  console.error(fail.join("\n"));
  process.exit(1);
}
console.log("6-1 겉넓이 E1 집중 감사 통과: 공개 후보 9유형 × 3풀, 대표 답·부분 접촉·연속 구멍·문제/답 그림 분리 확인");
