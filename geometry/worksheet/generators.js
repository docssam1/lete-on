// GW_GEN — 쌓기나무(stacked-cube) worksheet problem generators.
//
// WHY a Node-loadable IIFE: this file is unit-tested directly under `node`
// (see .selftest.mjs) so every teacher-facing worksheet can be regenerated
// and re-verified before shipping. It must not touch the DOM.
//
// Shape model: heightmap `map[z][x]`, values 0..H (0 = empty column).
//   x: 0..width-1, left -> right.
//   z: 0..depth-1, front (z=0) -> back (z=depth-1).
// A column height h means cubes occupy y = 0..h-1 (stacked from the floor,
// always "supported" — a heightmap can never describe a floating cube).
//
// View formulas below are copied verbatim (index arithmetic only, so the
// z=0/z=depth-1 end-label doesn't change behaviour) from
// /tmp/repo/geometry/games/three-views/levels.js (frontView/sideView/topView)
// so a shape drawn here matches what the existing games would show for the
// same map. The "hidden cube" rule is copied verbatim from
// /tmp/repo/geometry/games/hidden-count/levels.js (countHidden).
(function (global) {
  "use strict";

  // ---------------------------------------------------------------------
  // Seeded RNG — mulberry32 PRNG seeded by an FNV-1a-ish string hash, same
  // idea as /tmp/origin-full/number_magic/engine/rng.js. Self-contained here
  // so generators.js has zero external deps and stays Node-loadable.
  // ---------------------------------------------------------------------
  function hashSeed(str) {
    str = String(str);
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i += 1) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }

  function mulberry32(a) {
    return function next() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // rng object bundles the raw [0,1) stream with the helpers every generator
  // needs, so "uses ONLY that rng" is easy to audit (no Math.random anywhere
  // below this line).
  function createRng(seedStr) {
    const next = mulberry32(hashSeed(seedStr));
    return {
      next,
      int(min, max) {
        return min + Math.floor(next() * (max - min + 1));
      },
      pick(arr) {
        return arr[this.int(0, arr.length - 1)];
      },
      bool(p) {
        return next() < (p === undefined ? 0.5 : p);
      },
      shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i -= 1) {
          const j = this.int(0, i);
          const tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
        return a;
      }
    };
  }

  // ---------------------------------------------------------------------
  // Heightmap primitives
  // ---------------------------------------------------------------------
  function makeEmptyMap(width, depth) {
    const map = [];
    for (let z = 0; z < depth; z += 1) map.push(new Array(width).fill(0));
    return map;
  }

  function cloneMap(map) {
    return map.map((row) => row.slice());
  }

  function mapTotal(map) {
    let sum = 0;
    for (let z = 0; z < map.length; z += 1) for (let x = 0; x < map[z].length; x += 1) sum += map[z][x];
    return sum;
  }

  function maxHeightOf(map) {
    let m = 0;
    for (let z = 0; z < map.length; z += 1) for (let x = 0; x < map[z].length; x += 1) m = Math.max(m, map[z][x]);
    return m;
  }

  // front view: rows top->bottom = y high->low, cols = x. Copied verbatim
  // (as index arithmetic) from three-views/levels.js frontView().
  function frontView(map, width, depth, height) {
    const rows = [];
    for (let y = height - 1; y >= 0; y -= 1) {
      const row = [];
      for (let x = 0; x < width; x += 1) {
        let filled = 0;
        for (let z = 0; z < depth; z += 1) if (map[z][x] > y) { filled = 1; break; }
        row.push(filled);
      }
      rows.push(row);
    }
    return rows;
  }

  // side view from the right: cols c -> z = depth-1-c, rows y high->low.
  // Copied verbatim from three-views/levels.js sideView().
  function sideView(map, width, depth, height) {
    const rows = [];
    for (let y = height - 1; y >= 0; y -= 1) {
      const row = [];
      for (let c = 0; c < depth; c += 1) {
        const z = depth - 1 - c;
        let filled = 0;
        for (let x = 0; x < width; x += 1) if (map[z][x] > y) { filled = 1; break; }
        row.push(filled);
      }
      rows.push(row);
    }
    return rows;
  }

  // top view: rows r -> z=r, cols = x. Copied verbatim from
  // three-views/levels.js topView().
  function topView(map, width, depth) {
    const rows = [];
    for (let r = 0; r < depth; r += 1) {
      const row = [];
      for (let x = 0; x < width; x += 1) row.push(map[r][x] >= 1 ? 1 : 0);
      rows.push(row);
    }
    return rows;
  }

  function viewsOf(map, width, depth) {
    const height = Math.max(1, maxHeightOf(map));
    return {
      height,
      top: topView(map, width, depth),
      front: frontView(map, width, depth, height),
      side: sideView(map, width, depth, height)
    };
  }

  // Hidden-cube rule copied verbatim from hidden-count/levels.js countHidden().
  function countHidden(map) {
    const depth = map.length;
    const width = depth ? map[0].length : 0;
    let hidden = 0;
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        const h = map[z][x];
        for (let y = 0; y < h; y += 1) {
          const coveredTop = y < h - 1;
          let coveredFront = false;
          for (let z2 = z + 1; z2 < depth; z2 += 1) {
            if (map[z2][x] > y) { coveredFront = true; break; }
          }
          let coveredRight = false;
          for (let x2 = x + 1; x2 < width; x2 += 1) {
            if (map[z][x2] > y) { coveredRight = true; break; }
          }
          if (coveredTop && coveredFront && coveredRight) hidden += 1;
        }
      }
    }
    return hidden;
  }

  // 6-neighbour voxel presence test used by the painting problems (PN/PF).
  function hasVoxel(map, width, depth, x, y, z) {
    if (x < 0 || x >= width || z < 0 || z >= depth || y < 0) return false;
    const h = map[z][x];
    return h !== undefined && y < h;
  }

  function exposedFaceCount(map, width, depth, x, y, z) {
    let count = 0;
    if (!hasVoxel(map, width, depth, x + 1, y, z)) count += 1;
    if (!hasVoxel(map, width, depth, x - 1, y, z)) count += 1;
    if (!hasVoxel(map, width, depth, x, y, z + 1)) count += 1;
    if (!hasVoxel(map, width, depth, x, y, z - 1)) count += 1;
    if (!hasVoxel(map, width, depth, x, y + 1, z)) count += 1;
    // y-1 face: only a column's bottom-most cube (y=0) has no cube below it
    // inside the same column (heightmap columns are always contiguous from
    // the floor), so hasVoxel's y<0 guard already scores the floor as
    // "painted" (밑면 포함) without a special case.
    if (!hasVoxel(map, width, depth, x, y - 1, z)) count += 1;
    return count;
  }

  function forEachVoxel(map, width, depth, cb) {
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        const h = map[z][x];
        for (let y = 0; y < h; y += 1) cb(x, y, z);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Random shape construction
  // ---------------------------------------------------------------------
  function randomConnectedFootprint(rng, width, depth, minCells, maxCells) {
    const total = width * depth;
    const target = rng.int(Math.min(minCells, total), Math.min(maxCells, total));
    const cells = new Set();
    const start = [rng.int(0, width - 1), rng.int(0, depth - 1)];
    cells.add(start[0] + "," + start[1]);
    const frontier = [start];
    while (cells.size < target && frontier.length) {
      const idx = rng.int(0, frontier.length - 1);
      const [cx, cz] = frontier[idx];
      const neighbours = [[cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]].filter(
        ([x, z]) => x >= 0 && x < width && z >= 0 && z < depth && !cells.has(x + "," + z)
      );
      if (!neighbours.length) { frontier.splice(idx, 1); continue; }
      const [nx, nz] = neighbours[rng.int(0, neighbours.length - 1)];
      cells.add(nx + "," + nz);
      frontier.push([nx, nz]);
    }
    return cells;
  }

  // A dense-ish connected shape (>=50% of the footprint) with random heights
  // per occupied column — the base generator for most 3D problem types.
  function randomShape(rng, width, depth, maxH) {
    const total = width * depth;
    const minCells = Math.max(3, Math.round(total * 0.5));
    const cells = randomConnectedFootprint(rng, width, depth, minCells, total);
    const map = makeEmptyMap(width, depth);
    cells.forEach((key) => {
      const [x, z] = key.split(",").map(Number);
      map[z][x] = rng.int(1, maxH);
    });
    return map;
  }

  // Smaller-footprint shape used only by the three-view solver (VC/VM/VP).
  // WHY smaller than randomShape: enumerateShapes' DFS branches on every
  // occupied cell, and (crucially for VP) a "unique hidden view" is only
  // achievable when few enough cells share a row/column that no ambiguity
  // survives about which cell realizes that row/column's max. Empirically,
  // a ~25-40% footprint keeps 4x4/height-4 puzzles both fast (single-digit
  // ms typical) and reliably solvable within the retry budget, while denser
  // footprints (tried at ~50%+) frequently found ZERO unique-hidden-view
  // shapes in 250 tries and fell back to the trivial single-cube puzzle.
  function randomViewShape(rng, width, depth, maxH) {
    const total = width * depth;
    const minCells = Math.max(3, Math.round(total * 0.25));
    const maxCells = Math.max(minCells, Math.round(total * 0.4));
    const cells = randomConnectedFootprint(rng, width, depth, minCells, maxCells);
    const map = makeEmptyMap(width, depth);
    cells.forEach((key) => {
      const [x, z] = key.split(",").map(Number);
      map[z][x] = rng.int(1, maxH);
    });
    return map;
  }

  // Deterministic dense fallback (no rng) used when rejection sampling can't
  // find a shape with the required property inside the retry budget.
  function fallbackDenseShape(width, depth, maxH) {
    const map = makeEmptyMap(width, depth);
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) map[z][x] = maxH;
    return map;
  }

  // Guaranteed-unique shape (a single occupied column): with only one cell,
  // the view solver's last-occurrence check pins its height exactly, so it
  // always yields exactly one consistent candidate. Used as the fallback for
  // VC/VP when random sampling doesn't hit the target property in time.
  function fallbackSingleCellMap(width, depth, h) {
    const map = makeEmptyMap(width, depth);
    map[0][0] = Math.max(1, h);
    return map;
  }

  // Guaranteed min<max shape for VM: a 2x2 corner block with heights
  // 2,1 / 1,2. Every row and column already reaches its max of 2, so the
  // *other* two cells are each free to be 1 or 2 without breaking any view
  // — several different totals reproduce the same 3 views, i.e. min<max.
  function fallbackAmbiguousMap(width, depth) {
    const map = makeEmptyMap(width, depth);
    map[0][0] = 2;
    map[0][1] = 1;
    map[1][0] = 1;
    map[1][1] = 2;
    return map;
  }

  // ---------------------------------------------------------------------
  // Difficulty configuration — 하/중/상 -> grid size, max height, box n.
  // ---------------------------------------------------------------------
  function gridForDifficulty(rng, difficulty) {
    if (difficulty === "easy") return [3, 3];
    if (difficulty === "hard") return [4, 4];
    return rng.pick([[3, 3], [4, 3]]);
  }

  function maxHeightForDifficulty(rng, difficulty) {
    if (difficulty === "easy") return 3;
    if (difficulty === "hard") return 4;
    return rng.pick([3, 4]);
  }

  function boxNForDifficulty(difficulty) {
    return difficulty === "hard" ? 4 : 3;
  }

  function boxDimsForDifficulty(rng, difficulty) {
    if (difficulty === "easy") return [3, 3, 3];
    if (difficulty === "hard") return [4, 4, 4];
    return [rng.pick([3, 4]), rng.pick([3, 4]), rng.pick([3, 4])];
  }

  // ---------------------------------------------------------------------
  // Three-view consistency solver — shared by VC / VM / VP.
  //
  // Given the occupied-column silhouette plus (up to) two of the two max
  // arrays derived from the front/side views, DFS-enumerate every heightmap
  // that reproduces the GIVEN view(s) exactly. Column/row running maxima are
  // checked as soon as a column/row's last occupied cell is placed, which
  // prunes hard — real workbook grids (<=4x4) resolve well inside nodeCap.
  // ---------------------------------------------------------------------
  function deriveMaxArrays(map, width, depth) {
    const frontMax = new Array(width).fill(0);
    const sideMax = new Array(depth).fill(0);
    for (let x = 0; x < width; x += 1) {
      let m = 0;
      for (let z = 0; z < depth; z += 1) m = Math.max(m, map[z][x]);
      frontMax[x] = m;
    }
    for (let z = 0; z < depth; z += 1) {
      let m = 0;
      for (let x = 0; x < width; x += 1) m = Math.max(m, map[z][x]);
      sideMax[z] = m;
    }
    return { frontMax, sideMax };
  }

  function topSilhouette(map, width, depth) {
    const sil = [];
    for (let z = 0; z < depth; z += 1) {
      const row = [];
      for (let x = 0; x < width; x += 1) row.push(map[z][x] > 0 ? 1 : 0);
      sil.push(row);
    }
    return sil;
  }

  // opts: { frontMax: array|null, sideMax: array|null, maxH, nodeCap }
  // A null max array means that direction is NOT given (unconstrained other
  // than the global maxH cap) — used by VP to hide one view.
  function enumerateShapes(width, depth, silhouette, opts) {
    const frontMax = opts.frontMax || null;
    const sideMax = opts.sideMax || null;
    const maxH = opts.maxH;
    const nodeCap = opts.nodeCap || 200000;

    const cells = [];
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) if (silhouette[z][x]) cells.push([x, z]);
    const n = cells.length;
    const lastColIdx = new Array(width).fill(-1);
    const lastRowIdx = new Array(depth).fill(-1);
    cells.forEach(([x, z], i) => { lastColIdx[x] = i; lastRowIdx[z] = i; });

    const H = makeEmptyMap(width, depth);
    const colMax = new Array(width).fill(0);
    const rowMax = new Array(depth).fill(0);
    const results = [];
    let nodes = 0;
    let capped = false;

    function dfs(idx) {
      if (capped) return;
      nodes += 1;
      if (nodes > nodeCap) { capped = true; return; }
      if (idx === n) { results.push(cloneMap(H)); return; }
      const [x, z] = cells[idx];
      let cap = maxH;
      if (frontMax) cap = Math.min(cap, frontMax[x]);
      if (sideMax) cap = Math.min(cap, sideMax[z]);
      const prevColMax = colMax[x];
      const prevRowMax = rowMax[z];
      for (let h = 1; h <= cap; h += 1) {
        H[z][x] = h;
        colMax[x] = Math.max(prevColMax, h);
        rowMax[z] = Math.max(prevRowMax, h);
        if (frontMax && idx === lastColIdx[x] && colMax[x] !== frontMax[x]) continue;
        if (sideMax && idx === lastRowIdx[z] && rowMax[z] !== sideMax[z]) continue;
        dfs(idx + 1);
        if (capped) return;
      }
      H[z][x] = 0;
      colMax[x] = prevColMax;
      rowMax[z] = prevRowMax;
    }
    dfs(0);
    return { results, capped };
  }

  // ---------------------------------------------------------------------
  // Individual problem generators — each takes ONLY (rng, difficulty).
  // ---------------------------------------------------------------------

  // 1. TC — 바탕그림과 개수 (top-view number grid -> total + draw front/side)
  function genTC(rng, difficulty) {
    const [width, depth] = gridForDifficulty(rng, difficulty);
    const maxH = maxHeightForDifficulty(rng, difficulty);
    const total = width * depth;
    const minCells = Math.min(4, total);
    const maxCells = Math.min(8, total);
    const cells = randomConnectedFootprint(rng, width, depth, minCells, maxCells);
    const map = makeEmptyMap(width, depth);
    cells.forEach((key) => {
      const [x, z] = key.split(",").map(Number);
      map[z][x] = rng.int(1, maxH);
    });
    const views = viewsOf(map, width, depth);
    const numberGrid = map.map((row) => row.slice());
    return {
      type: "TC",
      prompt: "위에서 본 모양에 쌓기나무의 개수를 써넣었습니다. 물음에 답하시오. ① 쌓기나무는 모두 몇 개입니까? ② 앞과 오른쪽 옆에서 본 모양을 그리시오.",
      figures: { kind: "TC", width, depth, numberGrid, height: views.height },
      answer: { total: mapTotal(map), front: views.front, side: views.side, height: views.height },
      answerText: "① " + mapTotal(map) + "개  ② 정답지의 그림 참고"
    };
  }

  // Shared generator for VC / VM / VP — see comment above enumerateShapes.
  function genView3(rng, difficulty, mode) {
    const [width, depth] = gridForDifficulty(rng, difficulty);
    const maxH = maxHeightForDifficulty(rng, difficulty);
    const nodeCap = 20000;
    const maxTries = 250;

    for (let tries = 0; tries < maxTries; tries += 1) {
      const map = randomViewShape(rng, width, depth, maxH);
      const height = Math.max(1, maxHeightOf(map));
      const silhouette = topSilhouette(map, width, depth);
      const { frontMax, sideMax } = deriveMaxArrays(map, width, depth);
      const top = topView(map, width, depth);
      const front = frontView(map, width, depth, height);
      const side = sideView(map, width, depth, height);

      if (mode === "VC" || mode === "VM") {
        const { results, capped } = enumerateShapes(width, depth, silhouette, { frontMax, sideMax, maxH, nodeCap });
        if (capped || !results.length) continue;
        const totals = results.map(mapTotal);
        const min = Math.min.apply(null, totals);
        const max = Math.max.apply(null, totals);
        if (mode === "VC" && min === max) {
          return {
            type: "VC",
            prompt: "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓기나무는 모두 몇 개인지 구하시오.",
            figures: { kind: "views3", width, depth, top, front, side, height },
            answer: { count: min },
            answerText: min + "개"
          };
        }
        if (mode === "VM" && min < max) {
          return {
            type: "VM",
            prompt: "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓을 수 있는 쌓기나무의 최대 개수와 최소 개수를 각각 구하시오.",
            figures: { kind: "views3", width, depth, top, front, side, height },
            answer: { max, min },
            answerText: "최대 " + max + "개, 최소 " + min + "개"
          };
        }
        continue;
      }

      // VP: hide 앞 or 오른쪽 옆, keep 위 + the other view as given.
      const hideFront = rng.bool();
      const constraints = hideFront ? { sideMax, maxH, nodeCap } : { frontMax, maxH, nodeCap };
      const { results, capped } = enumerateShapes(width, depth, silhouette, constraints);
      if (capped || !results.length) continue;
      const patterns = new Set();
      let sampleHidden = null;
      results.forEach((shape) => {
        const hv = hideFront ? frontView(shape, width, depth, height) : sideView(shape, width, depth, height);
        const key = JSON.stringify(hv);
        if (!patterns.has(key)) { patterns.add(key); sampleHidden = hv; }
      });
      if (patterns.size === 1) {
        return {
          type: "VP",
          prompt: hideFront
            ? "위, 오른쪽 옆에서 본 모양입니다. 앞에서 본 모양을 그리시오."
            : "위, 앞에서 본 모양입니다. 오른쪽 옆에서 본 모양을 그리시오.",
          figures: {
            kind: "VP",
            width,
            depth,
            height,
            top,
            givenLabel: hideFront ? "오른쪽 옆" : "앞",
            given: hideFront ? side : front,
            hiddenLabel: hideFront ? "앞" : "오른쪽 옆"
          },
          answer: { hidden: sampleHidden, hiddenLabel: hideFront ? "앞" : "오른쪽 옆" },
          answerText: "정답지의 그림 참고"
        };
      }
    }

    // Fallback — see fallbackSingleCellMap / fallbackAmbiguousMap comments.
    if (mode === "VM") {
      const map = fallbackAmbiguousMap(width, depth);
      const height = Math.max(1, maxHeightOf(map));
      const silhouette = topSilhouette(map, width, depth);
      const { frontMax, sideMax } = deriveMaxArrays(map, width, depth);
      const { results } = enumerateShapes(width, depth, silhouette, { frontMax, sideMax, maxH: height, nodeCap });
      const totals = results.map(mapTotal);
      return {
        type: "VM",
        prompt: "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓을 수 있는 쌓기나무의 최대 개수와 최소 개수를 각각 구하시오.",
        figures: {
          kind: "views3", width, depth, height,
          top: topView(map, width, depth), front: frontView(map, width, depth, height), side: sideView(map, width, depth, height)
        },
        answer: { max: Math.max.apply(null, totals), min: Math.min.apply(null, totals) },
        answerText: "최대 " + Math.max.apply(null, totals) + "개, 최소 " + Math.min.apply(null, totals) + "개"
      };
    }
    const map = fallbackSingleCellMap(width, depth, maxH);
    const height = Math.max(1, maxHeightOf(map));
    const top = topView(map, width, depth);
    const front = frontView(map, width, depth, height);
    const side = sideView(map, width, depth, height);
    if (mode === "VC") {
      return {
        type: "VC",
        prompt: "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓기나무는 모두 몇 개인지 구하시오.",
        figures: { kind: "views3", width, depth, top, front, side, height },
        answer: { count: mapTotal(map) },
        answerText: mapTotal(map) + "개"
      };
    }
    const hideFront = rng.bool();
    return {
      type: "VP",
      prompt: hideFront
        ? "위, 오른쪽 옆에서 본 모양입니다. 앞에서 본 모양을 그리시오."
        : "위, 앞에서 본 모양입니다. 오른쪽 옆에서 본 모양을 그리시오.",
      figures: {
        kind: "VP", width, depth, height, top,
        givenLabel: hideFront ? "오른쪽 옆" : "앞",
        given: hideFront ? side : front,
        hiddenLabel: hideFront ? "앞" : "오른쪽 옆"
      },
      answer: { hidden: hideFront ? front : side, hiddenLabel: hideFront ? "앞" : "오른쪽 옆" },
      answerText: "정답지의 그림 참고"
    };
  }

  // 5. IC — 3D 그림 -> 개수
  function genIC(rng, difficulty) {
    const [width, depth] = gridForDifficulty(rng, difficulty);
    const maxH = maxHeightForDifficulty(rng, difficulty);
    const map = randomShape(rng, width, depth, maxH);
    const total = mapTotal(map);
    return {
      type: "IC",
      prompt: "쌓기나무로 쌓은 모양입니다. 사용된 쌓기나무는 최소 몇 개입니까?",
      figures: { kind: "iso", map, width, depth },
      answer: { total },
      answerText: total + "개"
    };
  }

  // 6. IH — 3D 그림 -> 보이지 않는 개수
  function genIH(rng, difficulty) {
    const [width, depth] = gridForDifficulty(rng, difficulty);
    const maxH = maxHeightForDifficulty(rng, difficulty);
    let map = null;
    let hidden = 0;
    for (let tries = 0; tries < 300; tries += 1) {
      map = randomShape(rng, width, depth, maxH);
      hidden = countHidden(map);
      if (hidden >= 1) break;
    }
    if (hidden < 1) {
      map = fallbackDenseShape(width, depth, maxH);
      hidden = countHidden(map);
    }
    return {
      type: "IH",
      prompt: "쌓기나무로 쌓은 모양입니다. 보이지 않는 쌓기나무는 몇 개입니까?",
      figures: { kind: "iso", map, width, depth },
      answer: { hidden },
      answerText: hidden + "개"
    };
  }

  // 7. FB — 상자 채우기
  function genFB(rng, difficulty) {
    const [W, D, H] = boxDimsForDifficulty(rng, difficulty);
    const total = W * D * H;
    const lo = Math.ceil(total * 0.3);
    const hi = Math.floor(total * 0.6);
    let map = null;
    let placed = 0;
    for (let tries = 0; tries < 200; tries += 1) {
      map = makeEmptyMap(W, D);
      for (let z = 0; z < D; z += 1) {
        for (let x = 0; x < W; x += 1) {
          if (rng.bool(0.55)) map[z][x] = rng.int(1, H);
        }
      }
      placed = mapTotal(map);
      if (placed >= lo && placed <= hi) break;
    }
    if (!placed) { map[0][0] = 1; placed = 1; }
    const need = total - placed;
    return {
      type: "FB",
      prompt: "가로 " + W + ", 세로 " + D + ", 높이 " + H + "인 상자에 쌓기나무를 쌓았습니다. 상자를 완전히 채우려면 쌓기나무가 몇 개 더 필요합니까?",
      figures: { kind: "iso-box", map, width: W, depth: D, boxH: H },
      answer: { need, total, placed },
      answerText: need + "개"
    };
  }

  // 8. CU — 정육면체 완성
  function genCU(rng, difficulty) {
    const n = boxNForDifficulty(difficulty);
    let map = null;
    let placed = 0;
    for (let tries = 0; tries < 200; tries += 1) {
      map = randomShape(rng, n, n, n);
      placed = mapTotal(map);
      if (placed > 0 && placed < n * n * n) break;
    }
    if (!placed || placed >= n * n * n) {
      map = fallbackDenseShape(n, n, n - 1);
      placed = mapTotal(map);
    }
    const total = n * n * n;
    const need = total - placed;
    return {
      type: "CU",
      prompt: "가로, 세로, 높이가 각각 " + n + "인 정육면체를 만들려고 합니다. 정육면체를 만들려면 적어도 몇 개의 쌓기나무가 더 필요합니까?",
      figures: { kind: "iso-box", map, width: n, depth: n, boxH: n },
      answer: { need, total, placed },
      answerText: need + "개"
    };
  }

  // 9. PN — n x n x n 색칠 (밑면 포함)
  function genPN(rng, difficulty) {
    const n = difficulty === "hard" ? 4 : 3;
    const map = makeEmptyMap(n, n);
    for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = n;
    let three = 0;
    let two = 0;
    let one = 0;
    let zero = 0;
    forEachVoxel(map, n, n, (x, y, z) => {
      const f = exposedFaceCount(map, n, n, x, y, z);
      if (f === 3) three += 1;
      else if (f === 2) two += 1;
      else if (f === 1) one += 1;
      else zero += 1;
    });
    return {
      type: "PN",
      prompt: "가로, 세로, 높이가 각각 " + n + "인 정육면체 모양입니다. 겉면(밑면도 칠합니다)을 모두 색칠했습니다. 다음을 구하시오. ① 세 면이 칠해진 쌓기나무 ② 두 면이 칠해진 쌓기나무 ③ 한 면이 칠해진 쌓기나무 ④ 한 면도 칠해지지 않은 쌓기나무",
      figures: { kind: "iso-box", map, width: n, depth: n, boxH: n, paint: true },
      answer: { three, two, one, zero },
      answerText: "① " + three + "개 ② " + two + "개 ③ " + one + "개 ④ " + zero + "개"
    };
  }

  // 10. PF — 모양 색칠 -> 면의 총수 (밑면 포함)
  function genPF(rng, difficulty) {
    const [width, depth] = gridForDifficulty(rng, difficulty);
    const maxH = maxHeightForDifficulty(rng, difficulty);
    let map = null;
    let total = 0;
    for (let tries = 0; tries < 300; tries += 1) {
      map = randomShape(rng, width, depth, maxH);
      total = mapTotal(map);
      if (total >= 8 && total <= 28) break;
    }
    if (total < 8 || total > 28) {
      map = fallbackDenseShape(width, depth, maxH);
      total = mapTotal(map);
    }
    let faces = 0;
    forEachVoxel(map, width, depth, (x, y, z) => { faces += exposedFaceCount(map, width, depth, x, y, z); });
    return {
      type: "PF",
      prompt: "쌓기나무로 만든 모양의 겉면(밑면 포함)을 모두 칠했습니다. 색칠된 면은 모두 몇 개입니까?",
      figures: { kind: "iso", map, width, depth, paint: true },
      answer: { faces, total },
      answerText: faces + "개"
    };
  }

  // 11. BW — 흑백 교차 (checkerboard cube)
  function genBW(rng, difficulty) {
    const n = difficulty === "hard" ? 4 : 3;
    const cornerWhite = rng.bool();
    let white = 0;
    let black = 0;
    for (let z = 0; z < n; z += 1) {
      for (let x = 0; x < n; x += 1) {
        for (let y = 0; y < n; y += 1) {
          const parityEven = (x + y + z) % 2 === 0;
          const isWhite = cornerWhite ? parityEven : !parityEven;
          if (isWhite) white += 1; else black += 1;
        }
      }
    }
    const askWhite = rng.bool();
    const count = askWhite ? white : black;
    const map = makeEmptyMap(n, n);
    for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = n;
    return {
      type: "BW",
      prompt: "쌓기나무를 정육면체 모양으로 쌓고, 맞닿은 면끼리 서로 다른 색이 되도록 흰색과 검은색을 번갈아 칠했습니다. " + (askWhite ? "흰색" : "검은색") + " 쌓기나무는 모두 몇 개입니까?",
      figures: { kind: "iso-box", map, width: n, depth: n, boxH: n, checker: true, cornerWhite },
      answer: { white, black, asked: askWhite ? "white" : "black", count },
      answerText: count + "개"
    };
  }

  // 12. HL — 구멍 뚫기
  function genHL(rng, difficulty) {
    const [W, D, H] = boxDimsForDifficulty(rng, difficulty);
    const total = W * D * H;
    const present = new Set();
    for (let x = 0; x < W; x += 1) for (let y = 0; y < H; y += 1) for (let z = 0; z < D; z += 1) present.add(x + "," + y + "," + z);
    const tunnelCount = rng.int(1, 3);
    const tunnels = [];
    const used = new Set();
    for (let i = 0; i < tunnelCount; i += 1) {
      let axis;
      let a;
      let b;
      let key;
      let tries = 0;
      do {
        axis = rng.pick(["x", "y", "z"]);
        if (axis === "x") { a = rng.int(0, H - 1); b = rng.int(0, D - 1); }
        else if (axis === "y") { a = rng.int(0, W - 1); b = rng.int(0, D - 1); }
        else { a = rng.int(0, W - 1); b = rng.int(0, H - 1); }
        key = axis + "," + a + "," + b;
        tries += 1;
      } while (used.has(key) && tries < 20);
      used.add(key);
      tunnels.push({ axis, a, b });
      if (axis === "x") for (let x = 0; x < W; x += 1) present.delete(x + "," + a + "," + b);
      else if (axis === "y") for (let y = 0; y < H; y += 1) present.delete(a + "," + y + "," + b);
      else for (let z = 0; z < D; z += 1) present.delete(a + "," + b + "," + z);
    }
    const remaining = present.size;
    return {
      type: "HL",
      prompt: "가로 " + W + ", 세로 " + D + ", 높이 " + H + "인 상자 모양으로 쌓기나무를 빈틈없이 쌓았습니다. 구멍이 반대편까지 뚫리도록 쌓기나무를 " + tunnelCount + "군데 빼냈습니다. 남은 쌓기나무의 개수를 구하시오.",
      figures: { kind: "iso-holes", width: W, depth: D, boxH: H, tunnels },
      answer: { remaining, total, removed: total - remaining },
      answerText: remaining + "개"
    };
  }

  // 13. SQ — 규칙 찾기
  function pyramidHeight(n, x, z) {
    let h = 0;
    for (let k = 1; k <= n; k += 1) {
      const size = n - k + 1;
      if (x < size && z < size) h += 1;
    }
    return h;
  }

  function buildSQShape(kind, n) {
    if (kind === "stair") {
      const map = makeEmptyMap(n, 1);
      for (let x = 0; x < n; x += 1) map[0][x] = n - x;
      return map;
    }
    if (kind === "tower") {
      const map = makeEmptyMap(n, n);
      for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = 1;
      return map;
    }
    // pyramid: nested squares, layer k (bottom=1) has side length n-k+1.
    const map = makeEmptyMap(n, n);
    for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = pyramidHeight(n, x, z);
    return map;
  }

  function sqFormula(kind, n) {
    if (kind === "stair") return (n * (n + 1)) / 2;
    if (kind === "tower") return n * n;
    let s = 0;
    for (let i = 1; i <= n; i += 1) s += i * i;
    return s;
  }

  function genSQ(rng, difficulty) {
    const kind = rng.pick(["stair", "pyramid", "tower"]);
    const askNth = rng.bool();
    const first3 = [1, 2, 3].map((n) => ({ n, map: buildSQShape(kind, n), width: kind === "stair" ? n : n, depth: kind === "stair" ? 1 : n }));
    let prompt;
    let answer;
    let answerText;
    if (askNth) {
      const N = rng.int(5, 8);
      const count = sqFormula(kind, N);
      prompt = "쌓기나무를 일정한 규칙에 따라 쌓았습니다. " + N + "번째 모양의 쌓기나무는 몇 개입니까?";
      answer = { mode: "nth", n: N, count };
      answerText = count + "개";
    } else {
      const m = rng.int(5, 9);
      const count = sqFormula(kind, m);
      prompt = "쌓기나무를 일정한 규칙에 따라 쌓았습니다. 쌓기나무 " + count + "개로 쌓은 모양은 몇 번째 모양입니까?";
      answer = { mode: "which", n: m, count };
      answerText = m + "번째";
    }
    return {
      type: "SQ",
      prompt,
      figures: { kind: "sequence", shapes: first3, patternKind: kind },
      answer,
      answerText
    };
  }

  // ---------------------------------------------------------------------
  // Public dispatch table + worksheet assembly
  // ---------------------------------------------------------------------
  const TYPES = [
    { code: "TC", label: "바탕그림과 개수", defaultOn: true },
    { code: "VC", label: "세 방향 → 개수", defaultOn: true },
    { code: "VM", label: "세 방향 → 최대·최소", defaultOn: true },
    { code: "VP", label: "두 방향 → 나머지 방향", defaultOn: true },
    { code: "IC", label: "3D 그림 → 개수", defaultOn: true },
    { code: "IH", label: "3D 그림 → 보이지 않는 개수", defaultOn: true },
    { code: "FB", label: "상자 채우기", defaultOn: true },
    { code: "CU", label: "정육면체 완성", defaultOn: false },
    { code: "PN", label: "정육면체 색칠", defaultOn: true },
    { code: "PF", label: "모양 색칠 → 면의 총수", defaultOn: false },
    { code: "BW", label: "흑백 교차", defaultOn: true },
    { code: "HL", label: "구멍 뚫기", defaultOn: true },
    { code: "SQ", label: "규칙 찾기", defaultOn: false }
  ];

  function make(typeCode, rng, difficulty) {
    switch (typeCode) {
      case "TC": return genTC(rng, difficulty);
      case "VC": return genView3(rng, difficulty, "VC");
      case "VM": return genView3(rng, difficulty, "VM");
      case "VP": return genView3(rng, difficulty, "VP");
      case "IC": return genIC(rng, difficulty);
      case "IH": return genIH(rng, difficulty);
      case "FB": return genFB(rng, difficulty);
      case "CU": return genCU(rng, difficulty);
      case "PN": return genPN(rng, difficulty);
      case "PF": return genPF(rng, difficulty);
      case "BW": return genBW(rng, difficulty);
      case "HL": return genHL(rng, difficulty);
      case "SQ": return genSQ(rng, difficulty);
      default: throw new Error("unknown worksheet type: " + typeCode);
    }
  }

  const DIFF_CODE = { easy: "0", mid: "1", hard: "2" };
  const CODE_DIFF = { 0: "easy", 1: "mid", 2: "hard" };

  // Code format: #GW-<TYPES>-<COUNT>x<SEED>
  // WHY the difficulty digit lives inside SEED: the spec fixes a 3-segment
  // code, but "same code -> identical worksheet" requires difficulty to be
  // recoverable too. 0/1/2 are valid base36 digits, so prefixing SEED with
  // one keeps SEED "a base36 token" while making the whole code
  // self-sufficient to reproduce a worksheet without any extra UI state.
  function buildCode(types, count, seedInt, difficulty) {
    const seedPart = (DIFF_CODE[difficulty] || "1") + (seedInt >>> 0).toString(36);
    return "#GW-" + types.join(".") + "-" + count + "x" + seedPart;
  }

  function parseCode(codeStr) {
    const m = /^#?GW-([A-Z.]+)-(\d+)x([0-9a-z]+)$/i.exec(String(codeStr).trim());
    if (!m) return null;
    const knownCodes = TYPES.map((t) => t.code);
    const types = m[1].toUpperCase().split(".").filter((c) => knownCodes.indexOf(c) !== -1);
    const count = parseInt(m[2], 10);
    const seedToken = m[3].toLowerCase();
    const difficulty = CODE_DIFF[seedToken[0]] || "mid";
    const seedInt = parseInt(seedToken.slice(1), 36) >>> 0;
    if (!types.length || !count || Number.isNaN(seedInt)) return null;
    return { types, count, seed: seedInt, difficulty };
  }

  function buildAssignment(rng, types, count) {
    const seq = [];
    while (seq.length < count) seq.push.apply(seq, rng.shuffle(types));
    return seq.slice(0, count);
  }

  function generateWorksheet(opts) {
    opts = opts || {};
    const types = opts.types && opts.types.length ? opts.types.slice() : TYPES.filter((t) => t.defaultOn).map((t) => t.code);
    const difficulty = opts.difficulty || "mid";
    const count = opts.count || 9;
    const seedInt = (opts.seed >>> 0) || 1;
    const rng = createRng("GW:" + seedInt + ":" + difficulty);
    const assignment = buildAssignment(rng, types, count);
    const problems = assignment.map((code) => make(code, rng, difficulty));
    return {
      code: buildCode(types, count, seedInt, difficulty),
      seed: seedInt,
      difficulty,
      types,
      count,
      problems
    };
  }

  global.GW_GEN = {
    // rng
    hashSeed,
    mulberry32,
    createRng,
    // heightmap core
    makeEmptyMap,
    cloneMap,
    mapTotal,
    maxHeightOf,
    frontView,
    sideView,
    topView,
    viewsOf,
    countHidden,
    hasVoxel,
    exposedFaceCount,
    forEachVoxel,
    // shape construction
    randomConnectedFootprint,
    randomShape,
    randomViewShape,
    fallbackDenseShape,
    // difficulty
    gridForDifficulty,
    maxHeightForDifficulty,
    boxNForDifficulty,
    boxDimsForDifficulty,
    // solver
    deriveMaxArrays,
    topSilhouette,
    enumerateShapes,
    // problem types
    TYPES,
    make,
    buildCode,
    parseCode,
    generateWorksheet
  };
})(typeof window !== "undefined" ? window : globalThis);
