import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { levels } from "./levels.js";

const bits = { N: 1, E: 2, S: 4, W: 8 };
const directions = ["N", "E", "S", "W"];
const opposite = { N: "S", E: "W", S: "N", W: "E" };
const delta = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };

function rotate(mask) {
  return ((mask << 1) & 15) | ((mask & 8) >> 3);
}

function rotations(mask) {
  const values = new Set();
  let current = mask;
  for (let turn = 0; turn < 4; turn += 1) {
    values.add(current);
    current = rotate(current);
  }
  return [...values];
}

function validNetwork(problem, masks) {
  const endpoints = new Set(problem.endpoints.map((endpoint) => `${endpoint.index}:${endpoint.dir}`));
  for (let index = 0; index < masks.length; index += 1) {
    const row = Math.floor(index / problem.cols);
    const col = index % problem.cols;
    for (const direction of directions) {
      if (!(masks[index] & bits[direction])) continue;
      const [dr, dc] = delta[direction];
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow < 0 || nextRow >= problem.rows || nextCol < 0 || nextCol >= problem.cols) {
        if (!endpoints.has(`${index}:${direction}`)) return false;
        continue;
      }
      const neighbor = masks[nextRow * problem.cols + nextCol];
      if (!(neighbor & bits[opposite[direction]])) return false;
    }
  }

  const start = problem.endpoints.find((endpoint) => endpoint.kind === "start");
  if (!start || problem.endpoints.some((endpoint) => !(masks[endpoint.index] & bits[endpoint.dir]))) return false;
  const active = masks.map((mask, index) => mask ? index : -1).filter((index) => index >= 0);
  const seen = new Set([start.index]);
  const queue = [start.index];
  while (queue.length) {
    const index = queue.shift();
    const row = Math.floor(index / problem.cols);
    const col = index % problem.cols;
    for (const direction of directions) {
      if (!(masks[index] & bits[direction])) continue;
      const [dr, dc] = delta[direction];
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow < 0 || nextRow >= problem.rows || nextCol < 0 || nextCol >= problem.cols) continue;
      const next = nextRow * problem.cols + nextCol;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return active.every((index) => seen.has(index));
}

function solutionCount(problem) {
  const masks = [...problem.initial];
  let count = 0;
  function visit(position) {
    if (count > 1) return;
    if (position === problem.editable.length) {
      if (validNetwork(problem, masks)) count += 1;
      return;
    }
    const index = problem.editable[position];
    for (const mask of rotations(problem.solved[index])) {
      masks[index] = mask;
      visit(position + 1);
    }
  }
  visit(0);
  return count;
}

function shortestStats(problem) {
  const blocked = new Set(problem.blocked);
  const distance = Array(problem.rows * problem.cols).fill(Infinity);
  const ways = Array(problem.rows * problem.cols).fill(0);
  const queue = [problem.start];
  distance[problem.start] = 0;
  ways[problem.start] = 1;
  while (queue.length) {
    const current = queue.shift();
    const row = Math.floor(current / problem.cols);
    const col = current % problem.cols;
    for (const [dr, dc] of Object.values(delta)) {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow < 0 || nextRow >= problem.rows || nextCol < 0 || nextCol >= problem.cols) continue;
      const next = nextRow * problem.cols + nextCol;
      if (blocked.has(next)) continue;
      const candidate = distance[current] + 1;
      if (candidate < distance[next]) {
        distance[next] = candidate;
        ways[next] = ways[current];
        queue.push(next);
      } else if (candidate === distance[next]) {
        ways[next] += ways[current];
      }
    }
  }
  return { distance: distance[problem.goal], ways: ways[problem.goal] };
}

function storedPathIsValid(problem) {
  const seen = new Set();
  return problem.answerPath[0] === problem.start
    && problem.answerPath.at(-1) === problem.goal
    && problem.answerPath.length - 1 === problem.shortest
    && problem.answerPath.every((cell, index) => {
      if (problem.blocked.includes(cell) || seen.has(cell)) return false;
      seen.add(cell);
      if (!index) return true;
      const previous = problem.answerPath[index - 1];
      const row = Math.floor(cell / problem.cols);
      const col = cell % problem.cols;
      const previousRow = Math.floor(previous / problem.cols);
      const previousCol = previous % problem.cols;
      return Math.abs(row - previousRow) + Math.abs(col - previousCol) === 1;
    });
}

export function auditPathWalk(data = levels) {
  assert.deepEqual(data.map((level) => level.title.ko), ["한 길 잇기", "숨은 타일 추론", "두 곳에 닿기", "막힌 길 피하기", "가장 가까운 길"]);
  assert.deepEqual(data.map((level) => level.difficulty), ["입문", "초급", "초급", "중급", "중급"]);
  assert.ok(data.every((level) => level.problems.length === 10));

  const ids = new Set();
  const shortestPathCounts = [];
  const answerPositions = [0, 0, 0];
  for (const level of data) {
    for (const problem of level.problems) {
      assert.ok(!ids.has(problem.id), `duplicate id: ${problem.id}`);
      ids.add(problem.id);
      assert.ok(problem.sourceRef && problem.sourceKind, `${problem.id}: missing provenance`);
      assert.ok(Number.isInteger(problem.reasoningSteps) && problem.reasoningSteps > 0, `${problem.id}: invalid reasoning steps`);
      if (problem.interaction === "rotate-tiles") {
        assert.equal(validNetwork(problem, problem.initial), false, `${problem.id}: starts solved`);
        assert.equal(validNetwork(problem, problem.solved), true, `${problem.id}: stored solution invalid`);
        assert.equal(solutionCount(problem), 1, `${problem.id}: solution is not unique`);
      } else if (problem.interaction === "hidden-tile") {
        assert.equal(new Set(problem.choices).size, 3, `${problem.id}: repeated choices`);
        const accepted = problem.choices.filter((mask) => {
          const candidate = [...problem.initial];
          candidate[problem.hiddenIndex] = mask;
          return validNetwork(problem, candidate);
        });
        assert.deepEqual(accepted, [problem.choices[problem.answer]], `${problem.id}: hidden answer is not unique`);
        answerPositions[problem.answer] += 1;
        assert.equal(problem.sourceKind, "internal-extension");
      } else {
        const stats = shortestStats(problem);
        assert.equal(stats.distance, problem.shortest, `${problem.id}: shortest distance mismatch`);
        assert.ok(stats.ways > 0 && storedPathIsValid(problem), `${problem.id}: invalid stored shortest path`);
        assert.equal(problem.answerPolicy, "any-shortest-path");
        assert.match(problem.sourceRef, /book-p74-pdf-p64/);
        shortestPathCounts.push(stats.ways);
      }
    }
  }

  assert.equal(ids.size, 50);
  assert.deepEqual(answerPositions, [4, 3, 3]);
  const averages = data.map((level) => level.problems.reduce((sum, problem) => sum + problem.reasoningSteps, 0) / level.problems.length);
  assert.ok(averages.every((value, index) => !index || value >= averages[index - 1]), `reasoning averages regress: ${averages.join(", ")}`);
  return { levels: data.length, problems: ids.size, answerPositions, shortestPathCounts, reasoningAverages: averages.map((value) => Number(value.toFixed(1))) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(auditPathWalk(), null, 2));
}
