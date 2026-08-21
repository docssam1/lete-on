// Hyper Focus spatial generators — q06 관찰 회전 / q07 전개도 / q08 주사위 / q09 세 방향 최소
(function (global) {
  "use strict";

  function makeRng(seed) {
    let a = Number(seed) >>> 0;
    function next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      shuffle(arr) {
        const out = arr.slice();
        for (let i = out.length - 1; i > 0; i -= 1) {
          const j = Math.floor(next() * (i + 1));
          const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
        }
        return out;
      }
    };
  }

  function fmt(value) { return Math.round(value * 100) / 100; }
  function uniqueJson(items) {
    return items.filter((item, index) => items.findIndex((other) => JSON.stringify(other) === JSON.stringify(item)) === index);
  }
  function normalizeBlocks(blocks) {
    const minX = Math.min(...blocks.map((block) => block.x));
    const minZ = Math.min(...blocks.map((block) => block.z));
    return blocks.map((block) => ({ x: block.x - minX, z: block.z - minZ, color: block.color }));
  }
  function blockKey(blocks) {
    return normalizeBlocks(blocks).slice().sort((a, b) => a.z - b.z || a.x - b.x || a.color.localeCompare(b.color))
      .map((block) => `${block.x},${block.z},${block.color}`).join("|");
  }
  function rotateBlocks(blocks, turns) {
    let out = blocks.map((block) => ({ ...block }));
    for (let turn = 0; turn < turns; turn += 1) {
      out = out.map((block) => ({ x: -block.z, z: block.x, color: block.color }));
    }
    return normalizeBlocks(out);
  }
  function reflectionOf(blocks) {
    return normalizeBlocks(blocks.map((block) => ({ x: -block.x, z: block.z, color: block.color })));
  }
  function rotationKeys(blocks) {
    return new Set([0, 1, 2, 3].map((turns) => blockKey(rotateBlocks(blocks, turns))));
  }

  const COLOR = {
    blue:   { top: "#52bde4", left: "#2d9bc6", right: "#197da8", stroke: "#17394b" },
    green:  { top: "#69c86b", left: "#42a949", right: "#2e8736", stroke: "#214c28" },
    purple: { top: "#ba6bd9", left: "#944bb3", right: "#743692", stroke: "#462454" },
    orange: { top: "#ffad45", left: "#e98a24", right: "#c96e11", stroke: "#6a3a0d" },
    yellow: { top: "#f1d660", left: "#d7b83d", right: "#b99924", stroke: "#655714" }
  };
  function project(x, y, z, unit) { return { x: (x - z) * unit * 0.87, y: (x + z) * unit * 0.5 - y * unit }; }
  function polygon(points, fill, stroke) {
    return `<polygon points="${points.map((point) => `${fmt(point.x)},${fmt(point.y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>`;
  }
  function cubeSvg(x, z, unit, palette) {
    const top = [project(x, 1, z, unit), project(x + 1, 1, z, unit), project(x + 1, 1, z + 1, unit), project(x, 1, z + 1, unit)];
    const left = [project(x, 0, z + 1, unit), project(x + 1, 0, z + 1, unit), project(x + 1, 1, z + 1, unit), project(x, 1, z + 1, unit)];
    const right = [project(x + 1, 0, z, unit), project(x + 1, 0, z + 1, unit), project(x + 1, 1, z + 1, unit), project(x + 1, 1, z, unit)];
    return polygon(top, palette.top, palette.stroke) + polygon(left, palette.left, palette.stroke) + polygon(right, palette.right, palette.stroke);
  }
  function renderColoredSolid(blocks, unit) {
    unit = unit || 22;
    const normalized = normalizeBlocks(blocks);
    const maxX = Math.max(...normalized.map((block) => block.x)) + 1;
    const maxZ = Math.max(...normalized.map((block) => block.z)) + 1;
    const sorted = normalized.slice().sort((a, b) => a.z - b.z || a.x - b.x);
    let body = "";
    sorted.forEach((block) => { body += cubeSvg(block.x, block.z, unit, COLOR[block.color]); });
    const pad = unit * 0.75;
    const xMin = -maxZ * unit * 0.87 - pad;
    const yMin = -unit - pad;
    const width = (maxX + maxZ) * unit * 0.87 + pad * 2;
    const height = (maxX + maxZ) * unit * 0.5 + unit + pad * 2;
    return `<svg class="hf-color-solid" viewBox="${fmt(xMin)} ${fmt(yMin)} ${fmt(width)} ${fmt(height)}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
  }

  /* q06 — 회전으로 가능한 모습과 거울상/색 위치 오류 구분 */
  const Q06_POSITIONS = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 1]];
  const Q06_SPEC = {
    easy: { choiceCount: 4, invalidCount: 1 },
    same: { choiceCount: 6, invalidCount: 2 },
    hard: { choiceCount: 8, invalidCount: 4 }
  };
  function q06InvalidPool(base) {
    const pool = [reflectionOf(base)];
    for (let first = 0; first < base.length; first += 1) {
      for (let second = first + 1; second < base.length; second += 1) {
        const swapped = base.map((block) => ({ ...block }));
        const color = swapped[first].color;
        swapped[first].color = swapped[second].color;
        swapped[second].color = color;
        pool.push(normalizeBlocks(swapped));
        pool.push(reflectionOf(swapped));
      }
    }
    const valid = rotationKeys(base);
    return uniqueJson(pool.map((blocks) => ({ key: blockKey(blocks), blocks })))
      .filter((entry) => !valid.has(entry.key)).map((entry) => entry.blocks);
  }
  function generateQ06(difficulty, seed) {
    const rng = makeRng(seed);
    const spec = Q06_SPEC[difficulty] || Q06_SPEC.same;
    const colors = rng.shuffle(Object.keys(COLOR));
    const base = Q06_POSITIONS.map(([x, z], index) => ({ x, z, color: colors[index] }));
    const valid = rng.shuffle([0, 1, 2, 3].map((turns) => rotateBlocks(base, turns)));
    const invalid = rng.shuffle(q06InvalidPool(base));
    const selected = rng.shuffle([
      ...valid.slice(0, spec.choiceCount - spec.invalidCount).map((blocks) => ({ blocks })),
      ...invalid.slice(0, spec.invalidCount).map((blocks) => ({ blocks }))
    ]).map((choice, index) => ({ choiceId: index + 1, blocks: choice.blocks }));
    const payload = { base, choices: selected, difficulty, seed };
    payload.invalidChoices = enumerateQ06AnswerCandidates(payload)[0] || [];
    return payload;
  }
  function enumerateQ06AnswerCandidates(payload) {
    if (!payload || !Array.isArray(payload.base) || payload.base.length !== 5 || !Array.isArray(payload.choices)) return [];
    const validKeys = rotationKeys(payload.base);
    const invalid = payload.choices.filter((choice) => !validKeys.has(blockKey(choice.blocks))).map((choice) => choice.choiceId);
    return [invalid];
  }
  function validateQ06(payload) {
    if (!payload || new Set(payload.base.map((block) => `${block.x},${block.z}`)).size !== 5) return false;
    if (payload.base.some((block) => !COLOR[block.color])) return false;
    const keys = payload.choices.map((choice) => blockKey(choice.blocks));
    if (new Set(keys).size !== keys.length) return false;
    const spec = Q06_SPEC[payload.difficulty] || Q06_SPEC.same;
    if (payload.choices.length !== spec.choiceCount) return false;
    const candidates = enumerateQ06AnswerCandidates(payload);
    if (candidates.length !== 1 || !candidates[0].length) return false;
    return JSON.stringify(candidates[0]) === JSON.stringify(payload.invalidChoices);
  }
  function deriveQ06Answer(payload) { return payload.invalidChoices.slice(); }
  function renderQ06Problem(payload) {
    return `<div class="hf-spatial"><figure class="hf-base-solid"><div class="hf-spatial-main">${renderColoredSolid(payload.base, 24)}</div><figcaption>기준 모양</figcaption></figure><div class="hf-option-grid">${payload.choices.map((choice) => `<figure class="hf-option"><b>${choice.choiceId}</b>${renderColoredSolid(choice.blocks, 16)}</figure>`).join("")}</div></div>`;
  }
  function renderQ06Answer(payload) {
    return `정답: ${payload.invalidChoices.join(", ")}번 — 기준 모양을 돌려서 겹쳐 봅니다. 거울처럼 뒤집히거나 색 위치가 바뀐 보기는 만들 수 없습니다.`;
  }

  /* q07 — 전개도 면을 접었을 때 한 꼭짓점에서 보이는 세 면 */
  const Q07_NET_POSITIONS = [[-1, 2], [0, 2], [0, 1], [0, 0], [1, 0], [0, -1]];
  // 면의 방향까지 채점하지 않는 문제이므로 90° 돌아가도 같은 기호만 쓴다.
  // 줄무늬·삼각형처럼 방향이 있는 무늬를 넣으면 보기 방향이 새 정답 조건이 된다.
  const MARKS = ["dot", "cross", "plus", "ring", "star", "grid"];
  const MARK_GLYPH = { dot: "●", cross: "×", plus: "+", ring: "◎", star: "✦", grid: "▦" };
  function neg(vector) { return vector.map((value) => -value); }
  function vecKey(vector) { return vector.join(","); }
  function foldOrientations(faces) {
    const byPos = new Map(faces.map((face) => [`${face.x},${face.y}`, face]));
    const orientation = new Map();
    orientation.set(faces[0].faceId, { n: [0, 0, 1], r: [1, 0, 0], d: [0, 1, 0] });
    const queue = [faces[0]];
    while (queue.length) {
      const face = queue.shift();
      const current = orientation.get(face.faceId);
      const moves = [
        [1, 0, { n: current.r, r: neg(current.n), d: current.d }],
        [-1, 0, { n: neg(current.r), r: current.n, d: current.d }],
        [0, 1, { n: neg(current.d), r: current.r, d: current.n }],
        [0, -1, { n: current.d, r: current.r, d: neg(current.n) }]
      ];
      moves.forEach(([dx, dy, next]) => {
        const neighbor = byPos.get(`${face.x + dx},${face.y + dy}`);
        if (neighbor && !orientation.has(neighbor.faceId)) {
          orientation.set(neighbor.faceId, next); queue.push(neighbor);
        }
      });
    }
    return orientation;
  }
  function oppositeMarkPairs(faces) {
    const orientation = foldOrientations(faces);
    if (orientation.size !== 6 || new Set([...orientation.values()].map((item) => vecKey(item.n))).size !== 6) return [];
    const pairs = [];
    for (let i = 0; i < faces.length; i += 1) for (let j = i + 1; j < faces.length; j += 1) {
      const a = orientation.get(faces[i].faceId).n;
      const b = orientation.get(faces[j].faceId).n;
      if (a[0] === -b[0] && a[1] === -b[1] && a[2] === -b[2]) pairs.push([faces[i].mark, faces[j].mark]);
    }
    return pairs;
  }
  function tripleValid(triple, pairs) {
    return !pairs.some((pair) => triple.includes(pair[0]) && triple.includes(pair[1]));
  }
  function allTriples(items) {
    const out = [];
    for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1)
      for (let k = j + 1; k < items.length; k += 1) out.push([items[i], items[j], items[k]]);
    return out;
  }
  const Q07_SPEC = {
    easy: { choiceCount: 4, validCount: 2 },
    same: { choiceCount: 5, validCount: 3 },
    hard: { choiceCount: 6, validCount: 3 }
  };
  function generateQ07(difficulty, seed) {
    const rng = makeRng(seed);
    const spec = Q07_SPEC[difficulty] || Q07_SPEC.same;
    const marks = rng.shuffle(MARKS);
    const faces = Q07_NET_POSITIONS.map(([x, y], index) => ({ faceId: `F${index + 1}`, x, y, mark: marks[index] }));
    const pairs = oppositeMarkPairs(faces);
    const triples = allTriples(marks);
    const valid = rng.shuffle(triples.filter((triple) => tripleValid(triple, pairs)));
    const invalid = rng.shuffle(triples.filter((triple) => !tripleValid(triple, pairs)));
    const choices = rng.shuffle([
      ...valid.slice(0, spec.validCount),
      ...invalid.slice(0, spec.choiceCount - spec.validCount)
    ]).map((visibleMarks, index) => ({ choiceId: index + 1, visibleMarks: rng.shuffle(visibleMarks) }));
    const payload = { faces, oppositePairs: pairs, choices, difficulty, seed };
    payload.validChoices = enumerateQ07AnswerCandidates(payload)[0] || [];
    return payload;
  }
  function enumerateQ07AnswerCandidates(payload) {
    if (!payload || !Array.isArray(payload.faces) || payload.faces.length !== 6 || !Array.isArray(payload.choices)) return [];
    const pairs = oppositeMarkPairs(payload.faces);
    if (pairs.length !== 3) return [];
    return [payload.choices.filter((choice) => tripleValid(choice.visibleMarks, pairs)).map((choice) => choice.choiceId)];
  }
  function validateQ07(payload) {
    const candidates = enumerateQ07AnswerCandidates(payload);
    if (candidates.length !== 1 || !candidates[0].length) return false;
    const spec = Q07_SPEC[payload.difficulty] || Q07_SPEC.same;
    if (payload.choices.length !== spec.choiceCount) return false;
    if (new Set(payload.choices.map((choice) => choice.visibleMarks.slice().sort().join("|"))).size !== payload.choices.length) return false;
    return JSON.stringify(candidates[0]) === JSON.stringify(payload.validChoices);
  }
  function renderMark(mark, x, y, size) {
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${size}" font-weight="800" fill="#178ec1">${MARK_GLYPH[mark]}</text>`;
  }
  function renderNet(faces) {
    const cell = 34, pad = 5;
    const minX = Math.min(...faces.map((face) => face.x)), maxX = Math.max(...faces.map((face) => face.x));
    const minY = Math.min(...faces.map((face) => face.y)), maxY = Math.max(...faces.map((face) => face.y));
    const width = (maxX - minX + 1) * cell + pad * 2, height = (maxY - minY + 1) * cell + pad * 2;
    let body = "";
    faces.forEach((face) => {
      const x = (face.x - minX) * cell + pad;
      const y = (maxY - face.y) * cell + pad;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#fff" stroke="#303842" stroke-width="1.5"/>`;
      body += renderMark(face.mark, x + cell / 2, y + cell / 2 + 1, 18);
    });
    return `<svg class="hf-net" viewBox="0 0 ${width} ${height}">${body}</svg>`;
  }
  function renderMarkedCube(marks) {
    const top = "38,4 70,22 38,40 6,22";
    const left = "6,22 38,40 38,76 6,58";
    const right = "38,40 70,22 70,58 38,76";
    return `<svg class="hf-marked-cube" viewBox="0 0 76 82"><polygon points="${top}" fill="#fff" stroke="#47515e" stroke-width="1.5"/><polygon points="${left}" fill="#f4f6f8" stroke="#47515e" stroke-width="1.5"/><polygon points="${right}" fill="#e7ebef" stroke="#47515e" stroke-width="1.5"/>${renderMark(marks[0], 38, 23, 15)}${renderMark(marks[1], 22, 50, 15)}${renderMark(marks[2], 54, 50, 15)}</svg>`;
  }
  function deriveQ07Answer(payload) { return payload.validChoices.slice(); }
  function renderQ07Problem(payload) {
    return `<div class="hf-spatial"><figure class="hf-net-wrap">${renderNet(payload.faces)}<figcaption>전개도</figcaption></figure><div class="hf-option-grid">${payload.choices.map((choice) => `<figure class="hf-option"><b>${choice.choiceId}</b>${renderMarkedCube(choice.visibleMarks)}</figure>`).join("")}</div></div>`;
  }
  function renderQ07Answer(payload) {
    const pairs = payload.oppositePairs.map((pair) => `${MARK_GLYPH[pair[0]]}-${MARK_GLYPH[pair[1]]}`).join(", ");
    return `정답: ${payload.validChoices.join(", ")}번 — 서로 마주 보는 면(${pairs})은 한 꼭짓점에서 함께 보일 수 없습니다.`;
  }

  /* q08 — 시작 세 면과 경로로 주사위 바닥 수 추적 */
  const BASE_DIE = { top: 1, bottom: 6, front: 2, back: 5, right: 3, left: 4 };
  const DIRECTIONS = ["right", "down", "left", "up"];
  const DELTA = { right: [1, 0], down: [0, 1], left: [-1, 0], up: [0, -1] };
  function rollDie(state, direction) {
    const s = { ...state };
    if (direction === "right") return { top: s.left, bottom: s.right, front: s.front, back: s.back, right: s.top, left: s.bottom };
    if (direction === "left") return { top: s.right, bottom: s.left, front: s.front, back: s.back, right: s.bottom, left: s.top };
    if (direction === "down") return { top: s.back, bottom: s.front, front: s.top, back: s.bottom, right: s.right, left: s.left };
    return { top: s.front, bottom: s.back, front: s.bottom, back: s.top, right: s.right, left: s.left };
  }
  function dieKey(state) { return [state.top, state.bottom, state.front, state.back, state.right, state.left].join(","); }
  function allDieOrientations() {
    const seen = new Map([[dieKey(BASE_DIE), BASE_DIE]]), queue = [BASE_DIE];
    while (queue.length) {
      const state = queue.shift();
      DIRECTIONS.forEach((direction) => {
        const next = rollDie(state, direction), key = dieKey(next);
        if (!seen.has(key)) { seen.set(key, next); queue.push(next); }
      });
    }
    return [...seen.values()];
  }
  const DIE_ORIENTATIONS = allDieOrientations();
  const Q08_SPEC = {
    easy: { moves: [3, 4], turns: [0, 1] },
    same: { moves: [5, 6], turns: [2, 3] },
    hard: { moves: [7, 9], turns: [4, 6] }
  };
  function pathFromMoves(moves) {
    let x = 0, y = 0;
    const cells = [{ x, y }];
    moves.forEach((move) => { x += DELTA[move][0]; y += DELTA[move][1]; cells.push({ x, y }); });
    const minX = Math.min(...cells.map((cell) => cell.x)), minY = Math.min(...cells.map((cell) => cell.y));
    return cells.map((cell) => ({ x: cell.x - minX, y: cell.y - minY }));
  }
  function turnCount(moves) {
    let turns = 0;
    for (let index = 1; index < moves.length; index += 1) if (moves[index] !== moves[index - 1]) turns += 1;
    return turns;
  }
  function makeDicePath(rng, spec) {
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const length = rng.int(spec.moves[0], spec.moves[1]);
      const moves = [];
      let x = 0, y = 0;
      const visited = new Set(["0,0"]);
      while (moves.length < length) {
        const previous = moves[moves.length - 1];
        const choices = rng.shuffle(DIRECTIONS).filter((direction) => {
          if (previous && ((previous === "right" && direction === "left") || (previous === "left" && direction === "right") || (previous === "up" && direction === "down") || (previous === "down" && direction === "up"))) return false;
          const nx = x + DELTA[direction][0], ny = y + DELTA[direction][1];
          return !visited.has(`${nx},${ny}`);
        });
        if (!choices.length) break;
        const direction = choices[0];
        x += DELTA[direction][0]; y += DELTA[direction][1];
        visited.add(`${x},${y}`); moves.push(direction);
      }
      const turns = turnCount(moves);
      const cells = pathFromMoves(moves);
      const width = Math.max(...cells.map((cell) => cell.x)) + 1;
      const height = Math.max(...cells.map((cell) => cell.y)) + 1;
      if (moves.length === length && turns >= spec.turns[0] && turns <= spec.turns[1] && width <= 6 && height <= 6) return { moves, cells, width, height, turns };
    }
    return { moves: ["right", "down", "right", "right"], cells: pathFromMoves(["right", "down", "right", "right"]),
             width: 4, height: 2, turns: 2, fallback: true };
  }
  function traceDie(startState, moves) {
    const trace = [{ ...startState }];
    moves.forEach((move) => trace.push(rollDie(trace[trace.length - 1], move)));
    return trace;
  }
  function generateQ08(difficulty, seed) {
    const rng = makeRng(seed);
    const spec = Q08_SPEC[difficulty] || Q08_SPEC.same;
    const startState = { ...rng.pick(DIE_ORIENTATIONS) };
    const path = makeDicePath(rng, spec);
    const stateTrace = traceDie(startState, path.moves);
    const payload = { startState, path, stateTrace, bottom: stateTrace[stateTrace.length - 1].bottom,
                      difficulty, seed: path.fallback ? "fallback" : seed };
    return payload;
  }
  function enumerateQ08AnswerCandidates(payload) {
    if (!payload || !payload.startState || !payload.path || !Array.isArray(payload.path.moves)) return [];
    const possibleStarts = DIE_ORIENTATIONS.filter((state) => state.top === payload.startState.top && state.front === payload.startState.front && state.right === payload.startState.right);
    return uniqueJson(possibleStarts.map((state) => traceDie(state, payload.path.moves).slice(-1)[0].bottom));
  }
  function validateQ08(payload) {
    if (!payload || !DIE_ORIENTATIONS.some((state) => dieKey(state) === dieKey(payload.startState))) return false;
    const spec = Q08_SPEC[payload.difficulty];
    if (!spec || payload.path.fallback) return false;
    if (payload.path.moves.length < spec.moves[0] || payload.path.moves.length > spec.moves[1]) return false;
    if (payload.path.turns < spec.turns[0] || payload.path.turns > spec.turns[1]) return false;
    if (new Set(payload.path.cells.map((cell) => `${cell.x},${cell.y}`)).size !== payload.path.cells.length) return false;
    if (payload.path.cells.length !== payload.path.moves.length + 1) return false;
    const candidates = enumerateQ08AnswerCandidates(payload);
    return candidates.length === 1 && candidates[0] === payload.bottom;
  }
  function renderDie(state) {
    return `<svg class="hf-die" viewBox="0 0 96 94"><polygon points="48,4 88,26 48,48 8,26" fill="#fff" stroke="#47515e" stroke-width="1.7"/><polygon points="8,26 48,48 48,90 8,68" fill="#f1f3f5" stroke="#47515e" stroke-width="1.7"/><polygon points="48,48 88,26 88,68 48,90" fill="#e3e7eb" stroke="#47515e" stroke-width="1.7"/><text x="48" y="28" text-anchor="middle" font-size="18" font-weight="900">${state.top}</text><text x="28" y="63" text-anchor="middle" font-size="18" font-weight="900">${state.front}</text><text x="68" y="63" text-anchor="middle" font-size="18" font-weight="900">${state.right}</text></svg>`;
  }
  function renderDicePath(path) {
    const cell = 34, pad = 12, width = path.width * cell + pad * 2, height = path.height * cell + pad * 2;
    let body = "";
    path.cells.forEach((point, index) => {
      const x = point.x * cell + pad, y = point.y * cell + pad;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${index === path.cells.length - 1 ? "#d8c7a0" : "#fff"}" stroke="#4d5864" stroke-width="1.2"/>`;
      if (index === 0) body += `<text x="${x + cell / 2}" y="${y + cell / 2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="800" fill="#567">시작</text>`;
    });
    for (let index = 0; index < path.cells.length - 1; index += 1) {
      const from = path.cells[index], to = path.cells[index + 1];
      const x1 = from.x * cell + pad + cell / 2, y1 = from.y * cell + pad + cell / 2;
      const x2 = to.x * cell + pad + cell / 2, y2 = to.y * cell + pad + cell / 2;
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      body += `<line x1="${x1 + ux * 11}" y1="${y1 + uy * 11}" x2="${x2 - ux * 11}" y2="${y2 - uy * 11}" stroke="#b28a2d" stroke-width="2.5" marker-end="url(#hfArrow)"/>`;
    }
    return `<svg class="hf-dice-path" viewBox="0 0 ${width} ${height}"><defs><marker id="hfArrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#b28a2d"/></marker></defs>${body}</svg>`;
  }
  function deriveQ08Answer(payload) { return payload.bottom; }
  function renderQ08Problem(payload) {
    return `<div class="hf-views"><figure><div class="hf-dice-wrap">${renderDie(payload.startState)}</div><figcaption>처음 주사위</figcaption></figure><figure><div class="hf-path-wrap">${renderDicePath(payload.path)}</div><figcaption>화살표를 따라 한 칸씩 굴리기</figcaption></figure></div>`;
  }
  function renderQ08Answer(payload) {
    const bottoms = payload.stateTrace.slice(1).map((state) => state.bottom).join(" → ");
    return `정답: ${payload.bottom} — 한 칸씩 굴렸을 때 바닥면의 수는 ${bottoms} 순서로 바뀝니다.`;
  }

  /* q09 — 위·앞·오른쪽 옆 투영도에서 최소 높이맵 전수열거 */
  function emptyMap(width, depth) { return Array.from({ length: depth }, () => new Array(width).fill(0)); }
  function cloneMap(map) { return map.map((row) => row.slice()); }
  function mapTotal(map) { return map.flat().reduce((sum, value) => sum + value, 0); }
  function connectedFootprint(rng, width, depth, count) {
    const cells = [[rng.int(0, width - 1), rng.int(0, depth - 1)]];
    const seen = new Set([cells[0].join(",")]);
    while (cells.length < count) {
      const [x, z] = rng.pick(cells);
      const [dx, dz] = rng.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      const nx = x + dx, nz = z + dz, key = `${nx},${nz}`;
      if (nx >= 0 && nx < width && nz >= 0 && nz < depth && !seen.has(key)) { seen.add(key); cells.push([nx, nz]); }
    }
    return cells;
  }
  function q09Clues(map, width, depth) {
    const top = map.map((row) => row.map((height) => height > 0 ? 1 : 0));
    const frontHeights = new Array(width).fill(0);
    const rightHeights = new Array(depth).fill(0);
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) {
      frontHeights[x] = Math.max(frontHeights[x], map[z][x]);
      rightHeights[z] = Math.max(rightHeights[z], map[z][x]);
    }
    return { top, frontHeights, rightHeights };
  }
  function enumerateQ09Maps(payload, nodeCap) {
    if (!payload || !Array.isArray(payload.top) || !Array.isArray(payload.frontHeights) || !Array.isArray(payload.rightHeights)) return { maps: [], capped: false, nodes: 0 };
    const depth = payload.top.length, width = depth ? payload.top[0].length : 0;
    if (!width || payload.top.some((row) => !Array.isArray(row) || row.length !== width) || payload.frontHeights.length !== width || payload.rightHeights.length !== depth) return { maps: [], capped: false, nodes: 0 };
    const cells = [];
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) if (payload.top[z][x]) cells.push([x, z]);
    const lastCol = new Array(width).fill(-1), lastRow = new Array(depth).fill(-1);
    cells.forEach(([x, z], index) => { lastCol[x] = index; lastRow[z] = index; });
    const map = emptyMap(width, depth), col = new Array(width).fill(0), row = new Array(depth).fill(0), maps = [];
    let nodes = 0, capped = false;
    function dfs(index) {
      if (capped) return;
      nodes += 1;
      if (nodes > (nodeCap || 200000)) { capped = true; return; }
      if (index === cells.length) { maps.push(cloneMap(map)); return; }
      const [x, z] = cells[index];
      const cap = Math.min(payload.frontHeights[x], payload.rightHeights[z]);
      const oldCol = col[x], oldRow = row[z];
      for (let height = 1; height <= cap; height += 1) {
        map[z][x] = height; col[x] = Math.max(oldCol, height); row[z] = Math.max(oldRow, height);
        if (index === lastCol[x] && col[x] !== payload.frontHeights[x]) continue;
        if (index === lastRow[z] && row[z] !== payload.rightHeights[z]) continue;
        dfs(index + 1);
        if (capped) return;
      }
      map[z][x] = 0; col[x] = oldCol; row[z] = oldRow;
    }
    dfs(0);
    return { maps, capped, nodes };
  }
  const Q09_SPEC = {
    easy: { dims: [[2, 2], [2, 3]], cells: [3, 4], maxH: 3 },
    same: { dims: [[3, 3], [3, 2]], cells: [5, 6], maxH: 3 },
    hard: { dims: [[3, 3], [4, 3]], cells: [7, 9], maxH: 4 }
  };
  function generateQ09(difficulty, seed) {
    const rng = makeRng(seed), spec = Q09_SPEC[difficulty] || Q09_SPEC.same;
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const [width, depth] = rng.pick(spec.dims);
      const footprint = connectedFootprint(rng, width, depth, rng.int(spec.cells[0], Math.min(spec.cells[1], width * depth)));
      const map = emptyMap(width, depth);
      footprint.forEach(([x, z]) => { map[z][x] = rng.int(1, spec.maxH); });
      if (Math.max(...map.flat()) < 2) continue;
      const clues = q09Clues(map, width, depth);
      const enumerated = enumerateQ09Maps(clues, 200000);
      if (enumerated.capped || !enumerated.maps.length) continue;
      const totals = enumerated.maps.map(mapTotal), minimum = Math.min(...totals);
      const minimumMaps = enumerated.maps.filter((candidate) => mapTotal(candidate) === minimum);
      if (minimumMaps.length !== 1 || minimum <= footprint.length) continue;
      const payload = { width, depth, top: clues.top, frontHeights: clues.frontHeights, rightHeights: clues.rightHeights,
        minimum, minimumMap: minimumMaps[0], solutionCount: enumerated.maps.length, difficulty, seed };
      if (validateQ09(payload)) return payload;
    }
    const map = [[3, 0], [1, 1], [1, 0]], clues = q09Clues(map, 2, 3);
    return { width: 2, depth: 3, top: clues.top, frontHeights: clues.frontHeights, rightHeights: clues.rightHeights,
      minimum: 6, minimumMap: map, solutionCount: 1, difficulty, seed: "fallback" };
  }
  function enumerateQ09AnswerCandidates(payload) {
    const enumerated = enumerateQ09Maps(payload, 200000);
    if (enumerated.capped || !enumerated.maps.length) return [];
    return [Math.min(...enumerated.maps.map(mapTotal))];
  }
  function validateQ09(payload) {
    const spec = Q09_SPEC[payload && payload.difficulty];
    if (!spec || payload.seed === "fallback") return false;
    if (!spec.dims.some(([width, depth]) => width === payload.width && depth === payload.depth)) return false;
    const occupied = payload.top.flat().reduce((sum, value) => sum + (value ? 1 : 0), 0);
    if (occupied < spec.cells[0] || occupied > spec.cells[1]) return false;
    if (Math.max(...payload.frontHeights, ...payload.rightHeights) > spec.maxH) return false;
    const enumerated = enumerateQ09Maps(payload, 200000);
    if (enumerated.capped || !enumerated.maps.length) return false;
    const totals = enumerated.maps.map(mapTotal), minimum = Math.min(...totals);
    const minimumMaps = enumerated.maps.filter((map) => mapTotal(map) === minimum);
    const candidates = enumerateQ09AnswerCandidates(payload);
    return candidates.length === 1 && candidates[0] === payload.minimum && minimumMaps.length === 1
      && JSON.stringify(minimumMaps[0]) === JSON.stringify(payload.minimumMap);
  }
  function silhouetteFromHeights(heights) {
    const maxHeight = Math.max(...heights);
    return Array.from({ length: maxHeight }, (_, row) => heights.map((height) => height >= maxHeight - row ? 1 : 0));
  }
  function renderGrid(matrix, cell, filled, extraClass) {
    const rows = matrix.length, cols = rows ? matrix[0].length : 0;
    let body = "";
    for (let row = 0; row < rows; row += 1) for (let col = 0; col < cols; col += 1) {
      body += `<rect x="${col * cell}" y="${row * cell}" width="${cell}" height="${cell}" fill="${matrix[row][col] ? filled : "#fff"}" stroke="#4d5864" stroke-width="1.2"/>`;
    }
    return `<svg class="hf-view-grid ${extraClass || ""}" viewBox="0 0 ${cols * cell} ${rows * cell}" width="${cols * cell}" height="${rows * cell}">${body}</svg>`;
  }
  function deriveQ09Answer(payload) { return payload.minimum; }
  function renderQ09Problem(payload) {
    const sideDisplay = payload.rightHeights.slice().reverse();
    return `<div class="hf-three-views"><figure>${renderGrid(payload.top, 26, "#dce5ee", "hf-top-view")}<figcaption>위</figcaption></figure><figure>${renderGrid(silhouetteFromHeights(payload.frontHeights), 26, "#dce5ee", "hf-front-view")}<figcaption>앞</figcaption></figure><figure>${renderGrid(silhouetteFromHeights(sideDisplay), 26, "#dce5ee", "hf-side-view")}<figcaption>오른쪽 옆</figcaption></figure></div>`;
  }
  function renderQ09Answer(payload) {
    const heights = payload.minimumMap.flat().filter((height) => height > 0);
    return `정답: ${payload.minimum}개 — 위에서 본 각 칸에 앞과 오른쪽 옆의 높이를 맞추어 가장 작은 수를 쓰면 ${heights.join("+")}=${payload.minimum}입니다.`;
  }

  global.HFQ06 = { generateQ06, validateQ06, enumerateQ06AnswerCandidates, renderQ06Problem, deriveQ06Answer, renderQ06Answer };
  global.HFQ07 = { generateQ07, validateQ07, enumerateQ07AnswerCandidates, renderQ07Problem, deriveQ07Answer, renderQ07Answer, oppositeMarkPairs };
  global.HFQ08 = { generateQ08, validateQ08, enumerateQ08AnswerCandidates, renderQ08Problem, deriveQ08Answer, renderQ08Answer, rollDie, allDieOrientations };
  global.HFQ09 = { generateQ09, validateQ09, enumerateQ09AnswerCandidates, renderQ09Problem, deriveQ09Answer, renderQ09Answer, enumerateQ09Maps };
})(typeof window !== "undefined" ? window : globalThis);
