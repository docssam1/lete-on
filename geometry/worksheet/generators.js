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
// same map.
//
// The "hidden cube" rule countHiddenWalled below is byte-for-byte the same
// as /tmp/repo/geometry/games/hidden-count/levels.js countHidden(). Frame
// check (verified EMPIRICALLY by rendering asymmetric shapes, not from the
// old painter comment which had it backwards): render.js's projection sends
// +z to screen lower-left and +x to screen lower-right, and cubeSvg() shows
// each cube's TOP, +z and +x faces — so the VIEWER stands on the large-z /
// large-x side, the far "back" corner is the z=0 / x=0 edge, and that is
// where renderIsoWalled() draws its two walls. With walls at z=0/x=0 the
// game's original blocking directions (taller column at z2>z blocks the
// front view, at x2>x blocks the right view) apply unchanged. See
// .selftest.mjs's refHiddenWalled(), an independent re-implementation over a
// voxel Set: because IH's shapes are asymmetric corner staircases, it fails
// if either the wall side or a blocking direction is mirrored.
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

  // Hidden-cube rule for IH -- 보이지 않는 개수 (벽 있음), the corner-wall
  // problem. Frame derivation, verified empirically against render.js's
  // actual output: cubeSvg() shows each cube's TOP, +z and +x faces, so the
  // viewer stands on the LARGE-z / LARGE-x side. The two walls therefore sit
  // on the far boundaries the viewer cannot see: the z = 0 plane (back) and
  // the x = 0 plane (left) -- exactly where renderIsoWalled draws them.
  //
  // A cube is hidden only when top AND front AND right are all blocked by a
  // taller column standing BETWEEN the viewer and the cube:
  //   - blocked from front (viewer beyond z=depth-1, looking toward -z /
  //     the back wall): needs a taller column at a LARGER z (z2 > z).
  //   - blocked from right (viewer beyond x=width-1, looking toward -x /
  //     the left wall): needs a taller column at a LARGER x (x2 > x).
  // This is byte-for-byte the same rule as hidden-count/levels.js's
  // countHidden() -- the game's corner scene and this picture agree.
  function countHiddenWalled(map) {
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

  // Hidden-cube rule for IN -- 보이지 않는 개수 (벽 없음), per
  // docs/03_COUNT_HIDDEN.md section 4: viewing directions are 앞/뒤/왼쪽/
  // 오른쪽/위 (front/back/left/right/top -- never from below, five
  // directions total). A cube is hidden only if it is blocked in ALL FIVE,
  // i.e. it is a true interior cube: a taller (or equal) column exists on
  // BOTH sides of it along x, on BOTH sides along z, and a cube sits
  // directly above it in its own column. No walls, so no orientation
  // choice is needed here -- the rule is fully symmetric.
  function countHiddenNoWall(map) {
    const depth = map.length;
    const width = depth ? map[0].length : 0;
    let hidden = 0;
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        const h = map[z][x];
        for (let y = 0; y < h; y += 1) {
          if (y >= h - 1) continue; // exposed from directly above: always visible
          let blockedRight = false;
          for (let x2 = x + 1; x2 < width; x2 += 1) if (map[z][x2] > y) { blockedRight = true; break; }
          if (!blockedRight) continue;
          let blockedLeft = false;
          for (let x2 = x - 1; x2 >= 0; x2 -= 1) if (map[z][x2] > y) { blockedLeft = true; break; }
          if (!blockedLeft) continue;
          let blockedFront = false;
          for (let z2 = z + 1; z2 < depth; z2 += 1) if (map[z2][x] > y) { blockedFront = true; break; }
          if (!blockedFront) continue;
          let blockedBack = false;
          for (let z2 = z - 1; z2 >= 0; z2 -= 1) if (map[z2][x] > y) { blockedBack = true; break; }
          if (!blockedBack) continue;
          hidden += 1;
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
  // 단계(level) × 강도(intensity) — 난이도 상/중/하를 대체하는 새 축.
  //
  // 단계는 커리큘럼 학년(선행 정도)을, 강도는 같은 단계 안에서의 사고 단계
  // 수를 나타낸다. 강도 1/2/3은 교재의 확인 / 연습 / 심화 코너에 대응하며,
  // 크기가 아니라 "묻는 것의 가짓수와 깊이"를 늘리는 축이다.
  //
  // LEVELS에는 커리큘럼 9단계를 전부 적어 둔다. 이번 학습지 엔진이 실제로
  // 문제를 만드는 단계만 available:true 이고, 나머지는 UI에서 "준비 중"으로
  // 보여 주기 위해 자리만 지킨다 — 목록을 지웠다가 나중에 다시 만들면 단계
  // 번호(코드에 들어가는 숫자)가 밀려 과거 학습지 코드가 깨지기 때문이다.
  // ---------------------------------------------------------------------
  const LEVELS = [
    { code: "L0", name: "킨더", age: "5-6세", available: false },
    { code: "L1", name: "키즈", age: "6-7세", available: false },
    { code: "L2", name: "pre", age: "초1-2", available: true },
    { code: "L3", name: "입문", age: "초3", available: true },
    { code: "L4", name: "초급", age: "초4", available: true },
    { code: "L5", name: "중급", age: "초5", available: true },
    { code: "L6", name: "2과정", age: "중1 이상", available: false },
    { code: "L7", name: "3과정", age: "중2 이상", available: false },
    { code: "L8", name: "4과정", age: "중3 이상", available: false }
  ];

  // 강도 표기 — 시트 머리말 배지·버튼 보조 점이 같은 문자열을 쓴다. 화면에
  // 보이는 이름은 "난이도 하/중/상"이고(아래 INTENSITY_WORDS), 점(●○○ 등)은
  // 버튼 안에서 글자를 보조하는 장식으로만 남는다 — 내부 파라미터 이름
  // (intensity 1/2/3)과 코드 형식은 바뀌지 않는다.
  const INTENSITY_MARKS = ["●○○", "●●○", "●●●"];
  const INTENSITY_WORDS = ["하", "중", "상"];

  const DEFAULT_LEVEL = "L4";
  const DEFAULT_INTENSITY = 2;

  // 단계 "전체" — 문제마다 그 유형이 지원하는 단계 중 하나를 rng로 골라
  // 섞어 내는 특수 모드. LEVELS(커리큘럼 9단계, code L0~L8)에는 넣지 않는다:
  // LEVELS는 "학년 하나"를 가리키는 목록이고 전체는 그 아홉 개를 섞으라는
  // 지시라 같은 목록에 아이템으로 넣으면 개수·번호 규약(코드 숫자 0~8)이
  // 깨진다. 대신 이 상수 하나로 어디서나 식별한다 — 코드의 단계 숫자는 9.
  const ALL_LEVEL = "ALL";

  function isAllLevel(level) {
    return String(level === undefined || level === null ? "" : level).trim().toUpperCase() === ALL_LEVEL;
  }

  function levelNum(level) {
    if (isAllLevel(level)) return 9;
    const m = /^L?(\d)$/i.exec(String(level === undefined || level === null ? "" : level).trim());
    return m ? parseInt(m[1], 10) : parseInt(String(DEFAULT_LEVEL).slice(1), 10);
  }

  function levelCode(level) {
    return isAllLevel(level) ? ALL_LEVEL : "L" + levelNum(level);
  }

  // "전체"는 LEVELS 목록에 없으므로 항상 같은 모양의 자리표시 정보를
  // 돌려준다 — levelBadge / UI가 이름·나이 필드를 실제 단계와 똑같이 읽을
  // 수 있도록.
  function levelInfo(level) {
    if (isAllLevel(level)) return { code: ALL_LEVEL, name: "전체", age: "단계 혼합", available: true };
    const code = levelCode(level);
    return LEVELS.filter((l) => l.code === code)[0] || null;
  }

  function availableLevels() {
    return LEVELS.filter((l) => l.available);
  }

  // Snap any level (including the 준비 중 ones) to the closest level that can
  // actually produce problems — the age picker relies on this so choosing
  // "5-6세" lands on pre instead of failing.
  function nearestAvailableLevel(level) {
    const want = levelNum(level);
    const pool = availableLevels();
    if (!pool.length) return DEFAULT_LEVEL;
    let best = pool[0];
    let bestDist = Math.abs(levelNum(best.code) - want);
    pool.forEach((l) => {
      const d = Math.abs(levelNum(l.code) - want);
      if (d < bestDist) { best = l; bestDist = d; }
    });
    return best.code;
  }

  function normalizeLevel(level) {
    if (isAllLevel(level)) return ALL_LEVEL;
    const code = levelCode(level);
    return levelInfo(code) ? code : DEFAULT_LEVEL;
  }

  function normalizeIntensity(intensity) {
    const n = parseInt(intensity, 10);
    if (!n || n < 1) return 1;
    return n > 3 ? 3 : n;
  }

  function intensityMark(intensity) {
    return INTENSITY_MARKS[normalizeIntensity(intensity) - 1];
  }

  function intensityWord(intensity) {
    return INTENSITY_WORDS[normalizeIntensity(intensity) - 1];
  }

  // Human badge for the sheet header / preview / cover, e.g. "초급 · 난이도
  // 중" — 혼합(전체) 단계에서는 "전체 혼합 · 난이도 중".
  function levelBadge(level, intensity) {
    const info = levelInfo(level);
    const name = isAllLevel(level) ? "전체 혼합" : (info ? info.name : levelCode(level));
    return name + " · 난이도 " + intensityWord(intensity);
  }

  // Backwards compatibility for the retired 하/중/상 axis: old worksheet codes
  // and any caller still passing a difficulty string map onto the new axis.
  const LEGACY_DIFFICULTY = {
    easy: { level: "L3", intensity: 1 },
    mid: { level: "L4", intensity: 2 },
    hard: { level: "L5", intensity: 3 }
  };

  function fromDifficulty(difficulty) {
    return LEGACY_DIFFICULTY[difficulty] || LEGACY_DIFFICULTY.mid;
  }

  // ---------------------------------------------------------------------
  // Size scales — 단계가 격자·높이를 정하고, 강도는 그 안에서 상한만 살짝
  // 밀어 준다 (근거: 필즈·1031 교재 유형×단계 매트릭스).
  // ---------------------------------------------------------------------

  // TC / IC 계열: L2 2x2 h<=2 · L3 3x3 h<=3 · L4 3x3~4x3 h<=4 · L5 4x4 h<=5.
  // 격자는 단계가 정하고, 높이는 그 단계의 상한 안에서 ●○○만 한 층 낮춘다
  // (강도의 본체는 아래 각 생성기의 "묻는 것의 가짓수"다).
  function countScale(rng, level, intensity) {
    const n = levelNum(level);
    const low = normalizeIntensity(intensity) === 1;
    if (n <= 2) return { width: 2, depth: 2, maxH: 2 };
    if (n === 3) return { width: 3, depth: 3, maxH: low ? 2 : 3 };
    if (n === 4) {
      const g = rng.pick([[3, 3], [4, 3]]);
      return { width: g[0], depth: g[1], maxH: low ? 3 : 4 };
    }
    return { width: 4, depth: 4, maxH: low ? 4 : 5 };
  }

  // VC / VM / VP / IH / IN 계열: 기존 easy/mid/hard 크기를 L3/L4/L5에 그대로
  // 대응시킨다. 높이 5는 세 방향 풀이의 탐색이 급격히 커져 4로 묶어 둔다.
  function viewScale(rng, level, intensity) {
    const n = levelNum(level);
    const low = normalizeIntensity(intensity) === 1;
    if (n <= 3) return { width: 3, depth: 3, maxH: low ? 2 : 3 };
    if (n === 4) {
      const g = rng.pick([[3, 3], [4, 3]]);
      return { width: g[0], depth: g[1], maxH: low ? 3 : 4 };
    }
    return { width: 4, depth: 4, maxH: 4 };
  }

  // CU 정육면체 한 변.
  function boxNForLevel(level, intensity) {
    const n = levelNum(level);
    if (n <= 3 && normalizeIntensity(intensity) === 1) return 2;
    if (n >= 5) return 4;
    if (n === 4 && normalizeIntensity(intensity) >= 3) return 4;
    return 3;
  }

  // FB 상자 크기: L2 2x2x2 · L3 3x3x3 · L4 4x3x3~4x4x3.
  function fillBoxDims(rng, level, intensity) {
    const n = levelNum(level);
    if (n <= 2) return [2, 2, 2];
    if (n === 3) return [3, 3, 3];
    return normalizeIntensity(intensity) >= 3 ? [4, 4, 3] : rng.pick([[4, 3, 3], [4, 4, 3]]);
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

  // Column/row max heights read straight off the GIVEN 앞/옆 view grids —
  // used for VC/VM's solve-table helper boxes. WHY not just reuse
  // deriveMaxArrays(map, ...): that derives from the private answer shape;
  // this instead counts filled rows in each front/side-view column, exactly
  // what a child does when copying max heights off the printed views (a
  // view column is filled contiguously from the bottom up to its max, so
  // counting 1s recovers the max directly).
  function colMaxFromFrontView(front, width) {
    const out = new Array(width).fill(0);
    for (let x = 0; x < width; x += 1) {
      let m = 0;
      for (let r = 0; r < front.length; r += 1) m += front[r][x];
      out[x] = m;
    }
    return out;
  }
  function rowMaxFromSideView(side, depth) {
    // side view column c maps to z = depth-1-c (see sideView() above).
    const out = new Array(depth).fill(0);
    for (let z = 0; z < depth; z += 1) {
      const c = depth - 1 - z;
      let m = 0;
      for (let r = 0; r < side.length; r += 1) m += side[r][c];
      out[z] = m;
    }
    return out;
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

  // How many columns the shape actually occupies — i.e. how many cubes sit on
  // the 1층 floor. Works on any 0/1 grid (a top view or a silhouette).
  function countFootprintCells(grid) {
    let n = 0;
    for (let z = 0; z < grid.length; z += 1) {
      for (let x = 0; x < grid[z].length; x += 1) if (grid[z][x]) n += 1;
    }
    return n;
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
  // Individual problem generators — each takes ONLY (rng, level, intensity).
  // ---------------------------------------------------------------------

  // 1. TC — 바탕그림과 개수 (top-view number grid -> total + draw front/side)
  //
  // 강도 = 묻는 것의 가짓수: ●○○ 개수만 / ●●○ 개수 + 앞·옆 그리기 /
  // ●●● 개수 + 앞·옆 그리기 + 가장 높은 층. 교재의 확인·연습·심화 코너가
  // 같은 바탕그림에 질문을 얹어 가는 방식 그대로다.
  function genTC(rng, level, intensity) {
    const scale = countScale(rng, level, intensity);
    const width = scale.width;
    const depth = scale.depth;
    const maxH = scale.maxH;
    const i = normalizeIntensity(intensity);
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
    const drawViews = i >= 2;
    const askHeight = i >= 3;
    let prompt = "위에서 본 모양에 쌓기나무의 개수를 써넣었습니다. 물음에 답하시오. ① 쌓기나무는 모두 몇 개입니까?";
    if (drawViews) prompt += " ② 앞과 오른쪽 옆에서 본 모양을 그리시오.";
    if (askHeight) prompt += " ③ 가장 높이 쌓은 곳은 몇 층입니까?";
    const sum = mapTotal(map);
    let answerText = "① " + sum + "개";
    if (drawViews) answerText += "  ② 정답지의 그림 참고";
    if (askHeight) answerText += "  ③ " + views.height + "층";
    return {
      type: "TC",
      prompt,
      figures: { kind: "TC", width, depth, numberGrid, height: views.height, drawViews },
      answer: { total: sum, front: views.front, side: views.side, height: views.height, drawViews, askHeight },
      answerText
    };
  }

  // Shared "풀이 방법" hint for VC/VM — same mechanism as IH/IN's methodHint
  // (a quiet grey .ws-method line), pointing at the solve-table scaffold
  // app.js renders under the three views.
  const SOLVE_TABLE_HINT = "풀이 방법 아래 칸에 앞에서 본 각 줄의 가장 높은 층수를, 오른쪽 칸에 옆에서 본 각 줄의 가장 높은 층수를 쓴 다음, 각 칸의 수를 정해 모두 더하기";

  // Shared generator for VC / VM / VP — see comment above enumerateShapes.
  function genView3(rng, level, intensity, mode) {
    const scale = viewScale(rng, level, intensity);
    const width = scale.width;
    const depth = scale.depth;
    const maxH = scale.maxH;
    // VC ●●●만 "1층에 놓인 개수"를 한 단계 더 묻는다 (세 방향을 읽어 표를
    // 채운 다음 그 표를 다시 읽어야 하므로 사고 단계가 하나 늘어난다).
    const askFloor = mode === "VC" && normalizeIntensity(intensity) >= 3;
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
          const floor = countFootprintCells(top);
          return {
            type: "VC",
            prompt: askFloor
              ? "위, 앞, 오른쪽 옆에서 본 모양입니다. ① 쌓기나무는 모두 몇 개인지 구하시오. ② 1층에 놓인 쌓기나무는 몇 개입니까?"
              : "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓기나무는 모두 몇 개인지 구하시오.",
            methodHint: SOLVE_TABLE_HINT,
            figures: { kind: "views3", width, depth, top, front, side, height, footprint: top, askFloor },
            answer: { count: min, floor, askFloor, numbers: cloneMap(map), colMax: colMaxFromFrontView(front, width), rowMax: rowMaxFromSideView(side, depth) },
            answerText: askFloor ? "① " + min + "개  ② " + floor + "개" : min + "개"
          };
        }
        if (mode === "VM" && min < max) {
          // Print the MAXIMUM-total consistent shape as the answer table's
          // numbers (matching the printed 최대 answer), and keep the
          // minimum-total shape too so the answer sheet can show 최소's own
          // working if needed later.
          const maxShape = results.find((r) => mapTotal(r) === max);
          const minShape = results.find((r) => mapTotal(r) === min);
          return {
            type: "VM",
            prompt: "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓을 수 있는 쌓기나무의 최대 개수와 최소 개수를 각각 구하시오.",
            methodHint: SOLVE_TABLE_HINT,
            figures: { kind: "views3", width, depth, top, front, side, height, footprint: top },
            answer: {
              max, min,
              numbers: maxShape,
              minNumbers: minShape,
              colMax: colMaxFromFrontView(front, width),
              rowMax: rowMaxFromSideView(side, depth)
            },
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
      const fbTop = topView(map, width, depth);
      const fbFront = frontView(map, width, depth, height);
      const fbSide = sideView(map, width, depth, height);
      const fbMax = Math.max.apply(null, totals);
      const fbMin = Math.min.apply(null, totals);
      const maxShape = results.find((r) => mapTotal(r) === fbMax);
      const minShape = results.find((r) => mapTotal(r) === fbMin);
      return {
        type: "VM",
        prompt: "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓을 수 있는 쌓기나무의 최대 개수와 최소 개수를 각각 구하시오.",
        methodHint: SOLVE_TABLE_HINT,
        figures: { kind: "views3", width, depth, height, top: fbTop, front: fbFront, side: fbSide, footprint: fbTop },
        answer: {
          max: fbMax,
          min: fbMin,
          numbers: maxShape,
          minNumbers: minShape,
          colMax: colMaxFromFrontView(fbFront, width),
          rowMax: rowMaxFromSideView(fbSide, depth)
        },
        answerText: "최대 " + fbMax + "개, 최소 " + fbMin + "개"
      };
    }
    const map = fallbackSingleCellMap(width, depth, maxH);
    const height = Math.max(1, maxHeightOf(map));
    const top = topView(map, width, depth);
    const front = frontView(map, width, depth, height);
    const side = sideView(map, width, depth, height);
    if (mode === "VC") {
      const fbFloor = countFootprintCells(top);
      return {
        type: "VC",
        prompt: askFloor
          ? "위, 앞, 오른쪽 옆에서 본 모양입니다. ① 쌓기나무는 모두 몇 개인지 구하시오. ② 1층에 놓인 쌓기나무는 몇 개입니까?"
          : "위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓기나무는 모두 몇 개인지 구하시오.",
        methodHint: SOLVE_TABLE_HINT,
        figures: { kind: "views3", width, depth, top, front, side, height, footprint: top, askFloor },
        answer: { count: mapTotal(map), floor: fbFloor, askFloor, numbers: cloneMap(map), colMax: colMaxFromFrontView(front, width), rowMax: rowMaxFromSideView(side, depth) },
        answerText: askFloor ? "① " + mapTotal(map) + "개  ② " + fbFloor + "개" : mapTotal(map) + "개"
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

  // 5. IC — 쌓기나무의 개수 세기 (3D 그림 -> 개수)
  //
  // 강도: ●○○ 전체 개수 / ●●○ 전체 + 1층 개수 / ●●● 전체 + 1층 + 2층 이상
  // 개수. 마지막 값은 앞 두 값의 차이라 "세고 → 빼는" 두 단계가 된다.
  function genIC(rng, level, intensity) {
    const scale = countScale(rng, level, intensity);
    const width = scale.width;
    const depth = scale.depth;
    const map = randomShape(rng, width, depth, scale.maxH);
    const i = normalizeIntensity(intensity);
    const total = mapTotal(map);
    const floor = countFootprintCells(topView(map, width, depth));
    const upper = total - floor;
    const askFloor = i >= 2;
    const askUpper = i >= 3;
    let prompt = "쌓기나무로 쌓은 모양입니다. ① 사용된 쌓기나무는 최소 몇 개입니까?";
    if (askFloor) prompt += " ② 1층에 놓인 쌓기나무는 몇 개입니까?";
    if (askUpper) prompt += " ③ 2층 이상에 놓인 쌓기나무는 몇 개입니까?";
    if (!askFloor) prompt = "쌓기나무로 쌓은 모양입니다. 사용된 쌓기나무는 최소 몇 개입니까?";
    let answerText = askFloor ? "① " + total + "개" : total + "개";
    if (askFloor) answerText += "  ② " + floor + "개";
    if (askUpper) answerText += "  ③ " + upper + "개";
    return {
      type: "IC",
      prompt,
      figures: { kind: "iso", map, width, depth },
      answer: { total, floor, upper, askFloor, askUpper },
      answerText
    };
  }

  // A "corner staircase": heights NEVER increase as you move away from the
  // two walls (x = 0 and z = 0), so the column in the inner corner is the
  // tallest and every column steps down (or stays level) toward the viewer.
  //
  // WHY this is mandatory for the walled picture: if a nearer column were
  // taller than the one behind it, it would completely hide that column in
  // the isometric drawing and the child could not read its height — the
  // problem would have no determinate answer. Plateaus (equal neighbours)
  // are deliberately common, because a plateau is exactly what buries a cube
  // and creates the "보이지 않는" cubes the question is about.
  //
  // firstColumnFull keeps the whole x = 0 wall at maxH (the 상자 채우기
  // convention the owner asked for) instead of letting it step down in z.
  function cornerStaircase(rng, width, depth, maxH, firstColumnFull) {
    const map = makeEmptyMap(width, depth);
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        if (x === 0 && (z === 0 || firstColumnFull)) { map[z][x] = maxH; continue; }
        const behind = z === 0 ? maxH : map[z - 1][x];
        const left = x === 0 ? maxH : map[z][x - 1];
        const cap = Math.min(behind, left);
        const drop = rng.bool(0.58) ? 0 : rng.int(1, 2);
        map[z][x] = Math.max(0, cap - drop);
      }
    }
    map[0][0] = maxH;
    return map;
  }

  // Guard for the above (also re-asserted by .selftest.mjs): no column may be
  // taller than the one directly behind it or directly to its left.
  function isCornerStaircase(map) {
    const depth = map.length;
    const width = depth ? map[0].length : 0;
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        if (z > 0 && map[z][x] > map[z - 1][x]) return false;
        if (x > 0 && map[z][x] > map[z][x - 1]) return false;
      }
    }
    return true;
  }

  // Does any column in the shape's back row (z = 0, the wall side in the
  // corrected frame) hold a cube? Used by genIH to guarantee the shape
  // actually leans into the drawn corner (a shape that never touches the
  // back wall would look wrong next to it).
  function touchesBackRow(map, width, depth) {
    const row = map[0];
    for (let x = 0; x < width; x += 1) if (row[x] > 0) return true;
    return false;
  }

  // Does any row hold a cube in the shape's left column (x = 0)? Same idea
  // as touchesBackRow, for the left wall.
  function touchesLeftColumn(map, depth) {
    for (let z = 0; z < depth; z += 1) if (map[z][0] > 0) return true;
    return false;
  }

  // 6. IH — 보이지 않는 개수 (벽 있음): corner-wall problem, math and picture
  // both anchored to the back (z=0) + left (x=0) corner -- see
  // countHiddenWalled and render.js's renderIsoWalled.
  //
  // 강도는 크기가 아니라 답의 크기(= 세어야 하는 칸 수)를 조절한다:
  // ●○○ 5개 이하, ●●○ 8개 이하, ●●● 12개 이하로 숨은 개수를 제한한다.
  function genIH(rng, level, intensity) {
    const scale = viewScale(rng, level, intensity);
    const width = scale.width;
    const depth = scale.depth;
    // viewScale already returns 3 or 4 for every level, so this is always
    // >= 2, but the shape must never degenerate to a single flat layer (a
    // 1-story shape can never hide a cube), so require it explicitly rather
    // than relying on that incidentally.
    const maxH = scale.maxH;
    const hiddenCap = normalizeIntensity(intensity) === 1 ? 5 : normalizeIntensity(intensity) === 2 ? 8 : 12;
    let map = null;
    let hidden = 0;
    let fallback = null; // best valid (hidden >= 1) staircase seen so far
    // EVERY candidate is a corner staircase — a random shape could stand a
    // tall column in front of a short one, hiding it completely, and then the
    // drawing would not determine that column's height. See cornerStaircase.
    for (let tries = 0; tries < 400; tries += 1) {
      const candidate = cornerStaircase(rng, width, depth, maxH, false);
      if (maxHeightOf(candidate) < 2) continue;
      if (!touchesBackRow(candidate, width, depth) || !touchesLeftColumn(candidate, depth)) continue;
      const h = countHiddenWalled(candidate);
      if (h < 1) continue;
      fallback = { map: candidate, hidden: h };
      // Cap the answer size: a solid 4x4x4 corner hides 27 cubes, which is
      // demoralising to count by hand. The cap comes from the 강도 above.
      if (h <= hiddenCap) { map = candidate; hidden = h; break; }
    }
    if (!map) {
      if (fallback) {
        map = fallback.map;
        hidden = fallback.hidden;
      } else {
        // Dense fallback fills every column to maxH: trivially a (flat)
        // corner staircase, touches both walls, and for width,depth >= 2 and
        // maxH >= 2 always yields hidden = (width-1)*(depth-1)*(maxH-1) >= 1.
        map = fallbackDenseShape(width, depth, maxH);
        hidden = countHiddenWalled(map);
      }
    }
    // total/visible ride along so the printed card can scaffold BOTH textbook
    // solution methods (write per-column hidden counts on the picture, or
    // 전체 − 보이는 = 보이지 않는) and the answer sheet can show the working.
    const total = mapTotal(map);
    return {
      type: "IH",
      prompt: "그림과 같이 뒤와 왼쪽에 벽이 있는 곳에 쌓기나무를 빈틈없이 쌓았습니다. 보이지 않는 쌓기나무는 몇 개입니까?",
      methodHint: "풀이 방법 ① 보이는 쌓기나무 위에 그 뒤에 숨은 개수를 써서 모두 더하기 ② 전체 개수에서 보이는 개수 빼기",
      figures: { kind: "iso-walled", map, width, depth },
      answer: { hidden, total, visible: total - hidden },
      answerText: hidden + "개"
    };
  }

  // Workbook archetype for IN: a centred step pyramid (ziggurat) — ring
  // distance from the rim sets the height, so the middle is tallest. This is
  // the shape the textbook always pairs with its bird's-eye "diamond" view.
  function centerPyramid(rng, width, depth, maxH) {
    const map = makeEmptyMap(width, depth);
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        const ring = Math.min(x, z, width - 1 - x, depth - 1 - z);
        map[z][x] = Math.max(1, Math.min(maxH, 1 + ring + (maxH > 3 && ring > 0 ? rng.int(0, 1) : 0)));
      }
    }
    return map;
  }

  function fullPrismMap(width, depth, height) {
    return Array.from({ length: depth }, () => Array.from({ length: width }, () => height));
  }

  // Printed no-wall questions must describe one unmistakable solid. Random
  // towers can hide several different interiors behind the same drawing, so
  // use complete prisms or a centred monotone step solid only.
  // 단계가 크기를(구 easy/mid/hard = L3/L4/L5 그대로), 강도가 모양의 종류를
  // 정한다 — ●○○은 늘 반듯한 직육면체, ●●○ 이상에서만 계단식 사각뿔이 섞여
  // 나온다 (사각뿔은 층마다 겉이 달라 한 단계 더 생각해야 한다).
  function clearNoWallShape(rng, level, intensity) {
    const n = levelNum(level);
    const i = normalizeIntensity(intensity);
    if (n <= 3) {
      // 반듯한 상자라는 읽기 쉬운 구조는 유지하되, 20문항을 만들었을 때
      // 같은 그림 세 장만 되풀이되지 않도록 방향과 높이를 함께 바꾼다.
      // ●●○ 이상에서는 가끔 가운데가 높은 계단식 사각뿔을 섞어 풀이 단계를
      // 올린다. ●○○은 방향·높이가 다른 반듯한 상자 10종을 유지한다.
      if (i >= 2 && rng.bool(0.4)) {
        const side = rng.pick([3, 4]);
        return { map: centerPyramid(rng, side, side, 3), width: side, depth: side, kind: "iso-top" };
      }
      const dims = rng.pick([
        [3, 3, 2], [3, 3, 3], [3, 3, 4],
        [4, 3, 2], [3, 4, 2], [4, 3, 3], [3, 4, 3],
        [4, 4, 2], [4, 4, 3], [4, 4, 4]
      ]);
      return { map: fullPrismMap(dims[0], dims[1], dims[2]), width: dims[0], depth: dims[1], kind: "iso" };
    }
    if (i >= 3) {
      return { map: centerPyramid(rng, 4, 4, 4), width: 4, depth: 4, kind: "iso-top" };
    }
    if (i >= 2 && rng.bool(n >= 5 ? 0.35 : 0.45)) {
      const side = n >= 5 ? 4 : 3;
      return { map: centerPyramid(rng, side, side, side === 4 ? 3 : 3), width: side, depth: side, kind: "iso-top" };
    }
    const dims = n >= 5
      ? rng.pick([[4, 4, 3], [4, 4, 4], [4, 3, 4]])
      : rng.pick([[3, 3, 3], [4, 3, 3], [3, 4, 3]]);
    return { map: fullPrismMap(dims[0], dims[1], dims[2]), width: dims[0], depth: dims[1], kind: "iso" };
  }

  // 6b. IN — 보이지 않는 개수 (벽 없음): free-standing shape, 5-direction rule
  // (docs/03_COUNT_HIDDEN.md section 4). Needs an interior grid cell, so the
  // footprint must be at least 3x3 -- gridForDifficulty already returns
  // 3x3 (easy), 3x3 or 4x3 (mid) or 4x4 (hard), i.e. always >= 3x3.
  //
  // Two workbook presentations, per the source textbook: random shapes use
  // the ordinary iso view; the pyramid archetype uses the bird's-eye
  // "diamond" view (figures.kind "iso-top") with the textbook's own
  // "바닥면은 보이지 않습니다" clause. The answer rule is identical either
  // way — visibility is a direction union, never camera-dependent
  // (docs/03_COUNT_HIDDEN.md §2).
  function genIN(rng, level, intensity) {
    const shape = clearNoWallShape(rng, level, intensity);
    const { map, width, depth } = shape;
    const hidden = countHiddenNoWall(map);
    // Same two-method scaffold as IH — the subtraction identity (전체 −
    // 보이는 = 보이지 않는) holds for the 5-direction rule too, by definition.
    const total = mapTotal(map);
    return {
      type: "IN",
      prompt: "벽이 없는 곳에 쌓기나무를 빈틈없이 쌓았습니다. 어느 방향에서 보아도 보이지 않는 쌓기나무는 몇 개입니까? (단, 바닥면은 보이지 않습니다.)",
      methodHint: "풀이 방법 ① 겉에서 보이는 쌓기나무를 먼저 세기 ② 전체 개수에서 보이는 개수 빼기",
      figures: { kind: shape.kind, map, width, depth },
      answer: { hidden, total, visible: total - hidden },
      answerText: hidden + "개"
    };
  }

  // 7. FB — 상자 채우기
  //
  // Textbook convention (see the GM-3 source pages): the stack is pushed into
  // the box's far/left corner and steps DOWN toward the open space, and the
  // leftmost column stands full height so the box's own height is readable
  // straight off the drawing. A scattered random fill made the picture hard
  // to read and hid how tall the box was, so the shape is now generated as a
  // left-anchored descending staircase rather than per-column coin flips.
  function genFB(rng, level, intensity) {
    const [W, D, H] = fillBoxDims(rng, level, intensity);
    const total = W * D * H;
    const lo = Math.ceil(total * 0.3);
    const hi = Math.floor(total * 0.6);
    let map = null;
    let placed = 0;
    for (let tries = 0; tries < 200; tries += 1) {
      // Corner staircase with the whole left wall at full height: heights
      // never rise again toward the viewer, so no column can hide the one
      // behind it and every stack's height stays readable in the drawing.
      map = cornerStaircase(rng, W, D, H, true);
      placed = mapTotal(map);
      if (placed >= lo && placed <= hi && placed < total) break;
    }
    // Guarantee the leftmost column is full and at least one cell is empty,
    // whatever the loop settled on.
    for (let z = 0; z < D; z += 1) map[z][0] = H;
    placed = mapTotal(map);
    if (placed >= total) { map[D - 1][W - 1] = Math.max(0, H - 1); placed = mapTotal(map); }
    const need = total - placed;
    return {
      type: "FB",
      prompt: "가로 " + W + ", 세로 " + D + ", 높이 " + H + "인 상자에 쌓기나무를 쌓았습니다. 상자를 완전히 채우려면 쌓기나무가 최소 몇 개 더 필요합니까?",
      figures: { kind: "iso-box", map, width: W, depth: D, boxH: H },
      answer: { need, total, placed },
      answerText: need + "개"
    };
  }

  // 8. CU — 정육면체 완성
  function genCU(rng, level, intensity) {
    const n = boxNForLevel(level, intensity);
    let map = null;
    let placed = 0;
    // Same readability rule as FB/IH: a corner staircase, so nothing already
    // in the cube can be hidden behind a taller neighbour.
    for (let tries = 0; tries < 200; tries += 1) {
      map = cornerStaircase(rng, n, n, n, false);
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

  // 9. PN — 색칠된 면·쌓기나무 (구 PN 직육면체 겉면 + 구 PF 모양 겉면 통합)
  //
  // 밑면을 칠하는지가 문제마다 다르므로, 면을 셀 때 y=0 아래쪽 면을 세는지
  // 여부를 인자로 받는다. 힙맵은 기둥이 늘 바닥부터 이어지므로 "아래에 이웃
  // 쌓기나무가 없는 칸"은 곧 y=0 칸이고, 밑면 제외는 그 한 면만 빼면 된다.
  function paintedFaceCount(map, width, depth, x, y, z, includeBottom) {
    let count = exposedFaceCount(map, width, depth, x, y, z);
    if (!includeBottom && !hasVoxel(map, width, depth, x, y - 1, z)) count -= 1;
    return count;
  }

  // 전수 셈: 낱개 쌓기나무를 색칠된 면 수(0~6)별로 세어 분포를 만든다.
  // n x n x n 공식과 독립적으로 검산할 수 있도록 answer에 그대로 싣는다.
  function paintDistribution(map, width, depth, includeBottom) {
    const dist = [0, 0, 0, 0, 0, 0, 0];
    let faces = 0;
    let cubes = 0;
    forEachVoxel(map, width, depth, (x, y, z) => {
      const k = paintedFaceCount(map, width, depth, x, y, z, includeBottom);
      dist[k] += 1;
      faces += k;
      cubes += 1;
    });
    return { dist, faces, cubes };
  }

  // 단계별 크기: L4 = 3x3x3~4x3x3, L5 = 4x4x4~5x4x4. 계단 모양(구 PF)은
  // 강도 ●○○의 L5에서만 섞는다 — 2면/3면을 묻는 ●●○·●●●은 교재와 같이
  // 직육면체로 고정해야 "모서리 8개, 모서리줄 …" 같은 규칙 발견이 산다.
  function paintShapeFor(rng, level, intensity) {
    const n = levelNum(level);
    const i = normalizeIntensity(intensity);
    if (n >= 5 && i === 1 && rng.bool(0.4)) {
      const map = cornerStaircase(rng, 4, 4, 4, false);
      return { map, width: 4, depth: 4, height: maxHeightOf(map), shapeKind: "stair" };
    }
    const dims = n >= 5
      ? rng.pick([[4, 4, 3], [4, 4, 4], [5, 4, 3], [4, 5, 3], [5, 4, 4], [4, 5, 4]])
      : rng.pick([[3, 3, 2], [3, 3, 3], [3, 3, 4], [4, 3, 2], [3, 4, 2], [4, 3, 3], [3, 4, 3], [4, 4, 2], [4, 4, 3], [4, 4, 4]]);
    return {
      map: fullPrismMap(dims[0], dims[1], dims[2]),
      width: dims[0],
      depth: dims[1],
      height: dims[2],
      shapeKind: dims[0] === dims[1] && dims[1] === dims[2] ? "cube" : "prism"
    };
  }

  const PAINT_FACE_WORD = ["한 면도 색칠되지 않은", "한 면만 색칠된", "두 면만 색칠된", "세 면만 색칠된"];

  function genPN(rng, level, intensity) {
    const i = normalizeIntensity(intensity);
    const shape = paintShapeFor(rng, level, i);
    const map = shape.map;
    const width = shape.width;
    const depth = shape.depth;
    // 밑면 제외 변형은 ●●●에서만 섞는다 (문제문에 반드시 명시한다).
    const includeBottom = i >= 3 ? rng.bool(0.5) : true;
    const stats = paintDistribution(map, width, depth, includeBottom);
    const bottomText = includeBottom
      ? "겉면(밑면 포함)을 모두 색칠했습니다."
      : "바닥에 놓은 채 겉면을 색칠했습니다. 바닥에 닿는 면은 칠하지 않았습니다.";
    const shapeText = shape.shapeKind === "stair"
      ? "쌓기나무로 만든 모양의 "
      : "가로 " + width + ", 세로 " + depth + ", 높이 " + shape.height + "인 " +
        (shape.shapeKind === "cube" ? "정육면체" : "직육면체") + " 모양으로 쌓기나무를 쌓고 ";

    if (i === 1) {
      return {
        type: "PN",
        prompt: shapeText + bottomText + " 색칠된 면은 모두 몇 면입니까?",
        figures: paintFigures(shape, includeBottom),
        answer: {
          variant: "faces",
          faces: stats.faces,
          dist: stats.dist,
          cubes: stats.cubes,
          includeBottom,
          width,
          depth,
          height: shape.height,
          shapeKind: shape.shapeKind
        },
        answerText: stats.faces + "면"
      };
    }

    // ●●○ 두 면 / 한 면, ●●● 세 면 / 한 면도 색칠되지 않은.
    const askFaces = i === 2 ? rng.pick([2, 1]) : rng.pick([3, 0]);
    const count = stats.dist[askFaces];
    return {
      type: "PN",
      prompt: shapeText + bottomText + " 색칠한 다음 쌓기나무를 낱개로 떼어 놓았습니다. " +
        PAINT_FACE_WORD[askFaces] + " 쌓기나무는 몇 개입니까?",
      figures: paintFigures(shape, includeBottom),
      answer: {
        variant: "count",
        askFaces,
        count,
        faces: stats.faces,
        dist: stats.dist,
        cubes: stats.cubes,
        includeBottom,
        width,
        depth,
        height: shape.height,
        shapeKind: shape.shapeKind
      },
      answerText: count + "개"
    };
  }

  function paintFigures(shape, includeBottom) {
    if (shape.shapeKind === "stair") {
      return { kind: "iso", map: shape.map, width: shape.width, depth: shape.depth, paint: true, includeBottom };
    }
    return { kind: "iso-box", map: shape.map, width: shape.width, depth: shape.depth, boxH: shape.height, paint: true, includeBottom };
  }

  // 단계가 모양의 복잡도를 정하고, 강도가 한 단계 낮은/높은 모양군을 당겨
  // 온다: L3은 늘 정육면체, L4는 ●○○만 정육면체·나머지는 계단형, L5는
  // ●○○이 L4의 계단형·●●○ 이상이 큰 계단형.
  function checkerShapeForLevel(rng, level, intensity) {
    const n = levelNum(level);
    const i = normalizeIntensity(intensity);
    const tier = n <= 3 ? 0 : n === 4 ? (i === 1 ? 0 : 1) : (i === 1 ? 1 : 2);
    if (tier === 0) {
      const dims = rng.pick(n <= 3 && i === 1
        ? [[2, 2, 2], [3, 3, 3], [2, 2, 3], [2, 3, 2], [3, 2, 2]]
        : [[2, 2, 2], [3, 3, 3], [3, 3, 2], [4, 3, 2], [3, 4, 2], [4, 3, 3]]);
      const map = fullPrismMap(dims[0], dims[1], dims[2]);
      const cube = dims[0] === dims[1] && dims[1] === dims[2];
      return { map, width: dims[0], depth: dims[1], shape: cube ? "cube" : "prism" };
    }

    const midShapes = [
      [
        [3, 3, 1, 0],
        [2, 2, 1, 1],
        [1, 1, 0, 0]
      ],
      [
        [2, 3, 2, 1],
        [2, 2, 2, 1],
        [1, 1, 1, 0]
      ],
      [
        [2, 3, 2, 1],
        [3, 2, 2, 1],
        [1, 2, 1, 0]
      ]
    ];
    const hardShapes = [
      [
        [4, 3, 2, 1],
        [3, 2, 2, 1],
        [2, 2, 1, 0],
        [1, 1, 0, 0]
      ],
      [
        [3, 3, 4, 2],
        [4, 3, 2, 1],
        [2, 3, 3, 1],
        [0, 2, 1, 0]
      ],
      [
        [4, 3, 3, 1],
        [3, 3, 2, 2],
        [2, 2, 1, 1],
        [1, 1, 1, 0]
      ]
    ];
    const map = cloneMap(rng.pick(tier >= 2 ? hardShapes : midShapes));
    if (rng.bool()) map.forEach((row) => row.reverse());
    return { map, width: map[0].length, depth: map.length, shape: "stair" };
  }

  // 11. BW — 흑백 교차 (정육면체 + 계단·돌출형)
  function genBW(rng, level, intensity) {
    const built = checkerShapeForLevel(rng, level, intensity);
    const map = built.map;
    const width = built.width;
    const depth = built.depth;
    const boxH = maxHeightOf(map);
    const cornerWhite = rng.bool();
    let white = 0;
    let black = 0;
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < map[z][x]; y += 1) {
          const parityEven = (x + y + z) % 2 === 0;
          const isWhite = cornerWhite ? parityEven : !parityEven;
          if (isWhite) white += 1; else black += 1;
        }
      }
    }
    const shapeText = built.shape === "cube"
      ? "정육면체 모양으로"
      : built.shape === "prism" ? "직육면체 모양으로" : "계단과 돌출이 있는 모양으로";
    return {
      type: "BW",
      prompt: "검은색과 흰색 쌓기나무를 같은 색의 면이 맞닿지 않게 " + shapeText + " 쌓았습니다. 흰색과 검은색 쌓기나무는 각각 몇 개입니까?",
      methodHint: "한 쌓기나무의 색을 정하면, 면이 맞닿은 쌓기나무의 색은 반대가 됩니다.",
      figures: { kind: "iso-box", map, width, depth, boxH, checker: true, cornerWhite, checkerShape: built.shape },
      answer: { white, black },
      answerText: "흰색 " + white + "개, 검은색 " + black + "개"
    };
  }

  // 12. HL — 구멍 뚫기
  //
  // 한 방향에 여러 개, 여러 방향에 나눠서 — 단계·강도별 구멍 배치는 아래
  // holePlan에 모아 두었다. 구멍이 서로 교차하면 같은 칸이 두 번 빠지므로
  // 개수는 언제나 좌표 Set(또는 그와 같은 층별 표)으로 세고, 구멍 수 × 길이
  // 로 빼지 않는다.
  function holeBoxDims(rng, level) {
    const n = levelNum(level);
    if (n <= 3) return rng.pick([[3, 3, 3], [4, 3, 3]]);
    if (n === 4) return rng.pick([[4, 4, 3], [4, 3, 4]]);
    return [4, 4, 4];
  }

  function holePlan(rng, level, intensity) {
    const n = levelNum(level);
    const i = normalizeIntensity(intensity);
    if (n <= 3) return { axisCount: 1, total: i === 1 ? 2 : 3, perAxisMax: 3 };
    if (n === 4) {
      if (i === 1) return { axisCount: 1, total: rng.int(2, 3), perAxisMax: 3 };
      return { axisCount: 2, total: rng.int(2, 3), perAxisMax: 2 };
    }
    if (i === 1) return { axisCount: 2, total: rng.int(2, 3), perAxisMax: 2 };
    if (i === 2) return { axisCount: rng.int(2, 3), total: rng.int(3, 4), perAxisMax: 3 };
    return { axisCount: 3, total: rng.int(4, 5), perAxisMax: 3 };
  }

  // 한 축의 구멍 자리 후보. (a, b)는 그 축에 수직인 단면의 두 좌표다.
  // 두 좌표가 모두 가장자리인 자리는 상자의 "모서리를 따라 깎은 홈"처럼
  // 보여 구멍으로 읽히지 않으므로 제외한다. 안쪽 자리를 먼저 쓰고, 한
  // 방향에 여러 개를 뚫느라 모자랄 때만 한쪽만 가장자리인 자리를 쓴다.
  function tunnelCandidates(axis, W, D, H) {
    const dims = axis === "x" ? [H, D] : axis === "y" ? [W, D] : [W, H];
    const inner = [];
    const edge = [];
    for (let a = 0; a < dims[0]; a += 1) {
      for (let b = 0; b < dims[1]; b += 1) {
        const aEdge = a === 0 || a === dims[0] - 1;
        const bEdge = b === 0 || b === dims[1] - 1;
        if (aEdge && bEdge) continue;
        (aEdge || bEdge ? edge : inner).push({ axis, a, b });
      }
    }
    return { inner, edge };
  }

  function distributeHoles(rng, axisCount, total, perAxisMax, capacity) {
    const counts = [];
    for (let k = 0; k < axisCount; k += 1) counts.push(Math.min(1, capacity[k]));
    let left = total - counts.reduce((s, c) => s + c, 0);
    for (let guard = 0; guard < 200 && left > 0; guard += 1) {
      const room = counts.map((c, k) => Math.min(perAxisMax, capacity[k]) - c);
      if (!room.some((r) => r > 0)) break;
      const k = rng.int(0, axisCount - 1);
      if (room[k] > 0) { counts[k] += 1; left -= 1; }
    }
    return counts;
  }

  // 층별 모눈 가이드의 데이터: 1층부터 각 층의 W x D 평면에서 구멍으로 빠진
  // 칸을 표시한다. renderHoleLayers(정답지·풀이 영역)와 자체 검증이 같은
  // 함수를 쓰므로 그림과 계산이 어긋날 수 없다.
  function holeLayers(width, depth, boxH, tunnels) {
    const grids = [];
    for (let y = 0; y < boxH; y += 1) grids.push(makeEmptyMap(width, depth));
    (tunnels || []).forEach((t) => {
      if (t.axis === "x") {
        for (let x = 0; x < width; x += 1) grids[t.a][t.b][x] = 1;
      } else if (t.axis === "y") {
        for (let y = 0; y < boxH; y += 1) grids[y][t.b][t.a] = 1;
      } else {
        for (let z = 0; z < depth; z += 1) grids[t.b][z][t.a] = 1;
      }
    });
    return grids.map((grid, index) => {
      let removed = 0;
      for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) if (grid[z][x]) removed += 1;
      return { floor: index + 1, grid, cells: width * depth, removed, remaining: width * depth - removed };
    });
  }

  const AXIS_WORD = { x: "옆", y: "위", z: "앞" };

  function genHL(rng, level, intensity) {
    const [W, D, H] = holeBoxDims(rng, level);
    const plan = holePlan(rng, level, intensity);
    const axes = rng.shuffle(["x", "y", "z"]).slice(0, plan.axisCount);
    const pools = axes.map((axis) => tunnelCandidates(axis, W, D, H));
    const capacity = pools.map((p) => p.inner.length + p.edge.length);
    const counts = distributeHoles(rng, axes.length, plan.total, plan.perAxisMax, capacity);
    const tunnels = [];
    axes.forEach((axis, k) => {
      const pool = pools[k];
      // 같은 방향에서는 (a, b)가 겹치지 않도록 한 목록에서 앞에서부터 뽑는다.
      const ordered = rng.shuffle(pool.inner).concat(rng.shuffle(pool.edge));
      tunnels.push.apply(tunnels, ordered.slice(0, counts[k]));
    });

    const total = W * D * H;
    const present = new Set();
    for (let x = 0; x < W; x += 1) for (let y = 0; y < H; y += 1) for (let z = 0; z < D; z += 1) present.add(x + "," + y + "," + z);
    tunnels.forEach(({ axis, a, b }) => {
      if (axis === "x") for (let x = 0; x < W; x += 1) present.delete(x + "," + a + "," + b);
      else if (axis === "y") for (let y = 0; y < H; y += 1) present.delete(a + "," + y + "," + b);
      else for (let z = 0; z < D; z += 1) present.delete(a + "," + b + "," + z);
    });
    const remaining = present.size;
    const layers = holeLayers(W, D, H, tunnels);
    const dirText = axes.map((axis) => AXIS_WORD[axis]).join("·");
    return {
      type: "HL",
      prompt: "가로 " + W + ", 세로 " + D + ", 높이 " + H + "인 상자 모양으로 쌓기나무를 빈틈없이 쌓았습니다. " +
        dirText + " 쪽에서 반대쪽까지 뚫린 구멍을 " + axes.length + "방향으로 모두 " + tunnels.length +
        "개 뚫었습니다. 남은 쌓기나무는 몇 개입니까?",
      methodHint: "풀이 방법 층마다 위에서 본 모눈을 그리고, 구멍으로 빠진 칸을 칠한 다음 남은 칸을 세어 더하기",
      figures: { kind: "iso-holes", width: W, depth: D, boxH: H, tunnels, axes, holes: tunnels.length },
      answer: { remaining, total, removed: total - remaining, holes: tunnels.length, axes: axes.slice(), layers },
      answerText: remaining + "개"
    };
  }

  // 13. SQ — 쌓기나무 규칙 찾기 (구 SQ 규칙 찾기 + 구 TS 삼각 계단 통합)
  //
  // 패턴 패밀리는 buildSQShape(모양)과 sqFormula(개수) 한 쌍으로 정의된다.
  // 둘은 반드시 일치해야 하므로(.selftest.mjs가 heightmap 합과 공식을
  // 대조한다) 새 패밀리를 넣을 때는 언제나 둘 다 건드린다.
  function pyramidHeight(n, x, z) {
    let h = 0;
    for (let k = 1; k <= n; k += 1) {
      const size = n - k + 1;
      if (x < size && z < size) h += 1;
    }
    return h;
  }

  // 구 TS의 삼각 계단. n단계는 바닥이 삼각형인 계단 모양이고 높이 지도
  // [n-x-z]의 합은 1, 4, 10, 20, 35... (사면체수)가 된다.
  function buildTriangularStairShape(n) {
    const map = makeEmptyMap(n, n);
    for (let z = 0; z < n; z += 1) {
      for (let x = 0; x < n - z; x += 1) map[z][x] = n - x - z;
    }
    return map;
  }

  function triangularStairTotal(n) {
    let total = 0;
    for (let stage = 1; stage <= n; stage += 1) total += (stage * (stage + 1)) / 2;
    return total;
  }

  function buildSQShape(kind, n) {
    if (kind === "stair") {
      // 계단: 1줄짜리 발자국에 n, n-1, ... 1층 — 합은 삼각수 1, 3, 6, 10.
      const map = makeEmptyMap(n, 1);
      for (let x = 0; x < n; x += 1) map[0][x] = n - x;
      return map;
    }
    if (kind === "cross") {
      // 십자: 팔 길이가 한 칸씩 자라 4개씩 늘어난다 — 1, 5, 9, 13.
      const side = 2 * n - 1;
      const c = n - 1;
      const map = makeEmptyMap(side, side);
      for (let z = 0; z < side; z += 1) for (let x = 0; x < side; x += 1) map[z][x] = (x === c || z === c) ? 1 : 0;
      return map;
    }
    if (kind === "tower") {
      // 정사각형: 홀수(1, 3, 5, ...)씩 늘어나 합이 n x n 이 된다.
      const map = makeEmptyMap(n, n);
      for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = 1;
      return map;
    }
    if (kind === "triangular-stair") return buildTriangularStairShape(n);
    if (kind === "frame") {
      // 액자 테두리: 바깥 한 변 n+2, 가운데 n x n 이 비어 있다 (높이 0 칸).
      const side = n + 2;
      const map = makeEmptyMap(side, side);
      for (let z = 0; z < side; z += 1) {
        for (let x = 0; x < side; x += 1) map[z][x] = (x === 0 || x === side - 1 || z === 0 || z === side - 1) ? 1 : 0;
      }
      return map;
    }
    if (kind === "cube") {
      const map = makeEmptyMap(n, n);
      for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = n;
      return map;
    }
    // pyramid: nested squares, layer k (bottom=1) has side length n-k+1.
    const map = makeEmptyMap(n, n);
    for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) map[z][x] = pyramidHeight(n, x, z);
    return map;
  }

  function sqFormula(kind, n) {
    if (kind === "stair") return (n * (n + 1)) / 2;
    if (kind === "cross") return 4 * n - 3;
    if (kind === "tower") return n * n;
    if (kind === "triangular-stair") return triangularStairTotal(n);
    if (kind === "frame") return (n + 2) * (n + 2) - n * n;
    if (kind === "cube") return n * n * n;
    let s = 0;
    for (let i = 1; i <= n; i += 1) s += i * i;
    return s;
  }

  function sqDims(kind, n) {
    if (kind === "stair") return { width: n, depth: 1 };
    if (kind === "cross") return { width: 2 * n - 1, depth: 2 * n - 1 };
    if (kind === "frame") return { width: n + 2, depth: n + 2 };
    return { width: n, depth: n };
  }

  // 패밀리별 최소 단계 — 평면 규칙(계단·십자·정사각형)이 입문, 입체로
  // 올라가는 규칙(사각뿔·삼각 계단·액자)이 초급, 세제곱은 중급이다.
  const SQ_FAMILIES = [
    { kind: "stair", minLevel: 3, name: "계단" },
    { kind: "cross", minLevel: 3, name: "십자" },
    { kind: "tower", minLevel: 3, name: "정사각형" },
    { kind: "pyramid", minLevel: 4, name: "사각뿔" },
    { kind: "triangular-stair", minLevel: 4, name: "삼각 계단" },
    { kind: "frame", minLevel: 4, name: "액자 테두리" },
    { kind: "cube", minLevel: 5, name: "정육면체" }
  ];

  function sqFamiliesFor(level) {
    const n = levelNum(level);
    const pool = SQ_FAMILIES.filter((f) => f.minLevel <= n);
    return pool.length ? pool : SQ_FAMILIES.filter((f) => f.minLevel <= 3);
  }

  function genSQ(rng, level, intensity) {
    const i = normalizeIntensity(intensity);
    const family = rng.pick(sqFamiliesFor(level));
    const kind = family.kind;
    // 강도 = 몇 번째까지 밀어붙이는가 + 어떤 방향으로 묻는가.
    const N = i === 1 ? rng.int(4, 5) : i === 2 ? rng.int(5, 7) : rng.int(6, 9);
    const modes = i === 1
      ? ["nth", "which"]
      : i === 2
        ? ["nth", "which", "increment"]
        : ["which", "increment", "which", "increment", "nth"];
    const mode = rng.pick(modes);
    const shapes = [1, 2, 3].map((stage) => {
      const dims = sqDims(kind, stage);
      return { n: stage, map: buildSQShape(kind, stage), width: dims.width, depth: dims.depth };
    });
    const stageCount = mode === "increment" ? N + 1 : N;
    const stageTotals = Array.from({ length: stageCount }, (_, index) => sqFormula(kind, index + 1));
    const count = sqFormula(kind, N);

    let prompt;
    let answer;
    let answerText;
    if (mode === "nth") {
      prompt = "쌓기나무를 일정한 규칙에 따라 쌓았습니다. " + N + "번째 모양의 쌓기나무는 몇 개입니까?";
      answer = { mode: "nth", n: N, count, stageTotals, patternKind: kind };
      answerText = count + "개";
    } else if (mode === "which") {
      prompt = "쌓기나무를 일정한 규칙에 따라 쌓았습니다. 쌓기나무 " + count + "개로 쌓은 모양은 몇 번째 모양입니까?";
      answer = { mode: "which", n: N, count, stageTotals, patternKind: kind };
      answerText = N + "번째";
    } else {
      const next = sqFormula(kind, N + 1);
      const delta = next - count;
      prompt = "쌓기나무를 일정한 규칙에 따라 쌓았습니다. " + N + "번째 모양에서 " + (N + 1) +
        "번째 모양을 만들려면 쌓기나무가 몇 개 더 필요합니까?";
      answer = { mode: "increment", n: N, count, next, delta, stageTotals, patternKind: kind };
      answerText = delta + "개";
    }
    return {
      type: "SQ",
      prompt,
      figures: { kind: "sequence", shapes, patternKind: kind, patternName: family.name },
      answer,
      answerText
    };
  }

  // ---------------------------------------------------------------------
  // Public dispatch table + worksheet assembly
  // ---------------------------------------------------------------------
  // 각 유형은 스스로 어느 단계에서 제공되는지 선언한다. UI의 유형 칩과
  // generateWorksheet의 필터가 같은 목록을 읽으므로, 단계를 바꾸면 화면과
  // 실제 생성 결과가 어긋날 수 없다.
  //
  // theme은 "이 유형이 어느 영역의 공부인가"를 나타내는 분류다. 표지의 포인트
  // 색과 캐릭터가 이 값 하나로 갈리므로, 유형을 새로 추가한 사람이 표지 쪽을
  // 잊어도 표지가 색을 잃을 뿐 유형과 어긋나지는 않는다. 어떤 색·어떤 캐릭터
  // 인지는 각 인쇄 엔진의 CSS가 정한다 — 여기에는 분류만 둔다.
  //   stack 쌓기나무 · view 관찰 · paint 색칠·무늬 · rule 규칙
  const TYPES = [
    { code: "TC", label: "바탕그림과 개수", defaultOn: true, theme: "stack", levels: ["L2", "L3", "L4", "L5"] },
    { code: "VC", label: "바탕그림을 보고 개수 구하기", defaultOn: false, theme: "view", levels: ["L3", "L4", "L5"] },
    { code: "VM", label: "세 방향 → 최대·최소", defaultOn: false, theme: "stack", levels: ["L3", "L4", "L5"] },
    { code: "VP", label: "바탕그림을 보고 나머지 바탕그림 그리기", defaultOn: false, theme: "view", levels: ["L3", "L4", "L5"] },
    { code: "IC", label: "쌓기나무의 개수 세기", defaultOn: false, theme: "stack", levels: ["L2", "L3", "L4", "L5"] },
    { code: "IH", label: "보이지 않는 개수 (벽 있음)", defaultOn: false, theme: "stack", levels: ["L3", "L4", "L5"] },
    { code: "IN", label: "보이지 않는 개수 (벽 없음)", defaultOn: false, theme: "stack", levels: ["L3", "L4", "L5"] },
    { code: "FB", label: "상자 채우기", defaultOn: false, theme: "stack", levels: ["L2", "L3", "L4"] },
    { code: "CU", label: "정육면체 완성", defaultOn: false, theme: "stack", levels: ["L3", "L4", "L5"] },
    { code: "PN", label: "색칠된 면·쌓기나무", defaultOn: false, theme: "paint", levels: ["L4", "L5"] },
    { code: "BW", label: "흑백 교차", defaultOn: false, theme: "paint", levels: ["L3", "L4", "L5"] },
    { code: "HL", label: "구멍 뚫기", defaultOn: false, theme: "paint", levels: ["L3", "L4", "L5"] },
    { code: "SQ", label: "쌓기나무 규칙 찾기", defaultOn: false, theme: "rule", levels: ["L3", "L4", "L5"] }
  ];

  // 통합으로 사라진 옛 코드 — 옛 학습지 코드를 그대로 붙여 넣어도 열리도록
  // 새 코드로 옮겨 준다 (PF는 PN에, TS는 SQ에 흡수됐다).
  const TYPE_ALIASES = { PF: "PN", TS: "SQ" };

  function canonicalType(code) {
    const up = String(code).toUpperCase();
    return TYPE_ALIASES[up] || up;
  }

  function typeInfo(code) {
    const want = canonicalType(code);
    return TYPES.filter((t) => t.code === want)[0] || null;
  }

  // "전체"는 모든 유형을 지원한다고 답한다 — 각 유형은 자기 자신이 실제로
  // 지원하는 단계 중 하나에서 만들어질 뿐이지, 전체 자체가 별도 단계로
  // 존재하는 게 아니기 때문이다(아래 make() 참고).
  function typeSupportsLevel(code, level) {
    const info = typeInfo(code);
    if (!info) return false;
    if (isAllLevel(level)) return true;
    return info.levels.indexOf(levelCode(level)) !== -1;
  }

  function typesForLevel(level) {
    if (isAllLevel(level)) return TYPES.map((t) => t.code);
    return TYPES.filter((t) => t.levels.indexOf(levelCode(level)) !== -1).map((t) => t.code);
  }

  // 표지 테마 — 고른 유형들이 모두 한 영역이면 그 영역의 테마를, 영역이 섞이면
  // "mix"를 돌려준다. "유형이 하나면 그 유형의 테마"보다 한 걸음 넓은 규칙인데,
  // TC+IC처럼 둘 다 쌓기나무인 조합에서까지 혼합 표지가 나오면 아이 입장에서는
  // 같은 공부인데 표지만 달라 보이기 때문이다.
  function themeForTypes(codes) {
    const seen = [];
    (codes || []).forEach((code) => {
      const info = typeInfo(code);
      const theme = info && info.theme ? info.theme : null;
      if (theme && seen.indexOf(theme) === -1) seen.push(theme);
    });
    if (seen.length === 1) return seen[0];
    return "mix";
  }

  // level이 "전체"이면 그 유형이 실제로 지원하는 단계(TYPES[].levels, 곧
  // available인 단계들) 중 하나를 rng로 골라 그 단계로 만든다 — rng는
  // generateWorksheet이 문제마다 순서대로 넘겨주는 공유 스트림이므로, 같은
  // 시드는 같은 단계 배치를 재현한다. 실제로 어느 단계가 뽑혔는지는
  // problem.level에 남겨 문제 카드·정답지의 단계 배지가 읽는다.
  function make(typeCode, rng, level, intensity) {
    const canon = canonicalType(typeCode);
    const info = typeInfo(canon);
    if (!info) throw new Error("unknown worksheet type: " + typeCode);
    const it = normalizeIntensity(intensity);
    const lv = isAllLevel(level) ? rng.pick(info.levels) : normalizeLevel(level);
    let problem;
    switch (canon) {
      case "TC": problem = genTC(rng, lv, it); break;
      case "VC": problem = genView3(rng, lv, it, "VC"); break;
      case "VM": problem = genView3(rng, lv, it, "VM"); break;
      case "VP": problem = genView3(rng, lv, it, "VP"); break;
      case "IC": problem = genIC(rng, lv, it); break;
      case "IH": problem = genIH(rng, lv, it); break;
      case "IN": problem = genIN(rng, lv, it); break;
      case "FB": problem = genFB(rng, lv, it); break;
      case "CU": problem = genCU(rng, lv, it); break;
      case "PN": problem = genPN(rng, lv, it); break;
      case "BW": problem = genBW(rng, lv, it); break;
      case "HL": problem = genHL(rng, lv, it); break;
      case "SQ": problem = genSQ(rng, lv, it); break;
      default: throw new Error("unknown worksheet type: " + typeCode);
    }
    problem.level = lv;
    return problem;
  }

  const CODE_DIFF = { 0: "easy", 1: "mid", 2: "hard" };

  // ---------------------------------------------------------------------
  // 문제 배열 방식 (arrange)
  //
  //   ""     골고루 섞기 — 고른 유형을 번갈아 뽑는 기본 동작.
  //   "type" 유형별 묶기 — 같은 유형끼리 이어 놓고 유형명 소제목을 단다.
  //   "diff" 난이도별 묶기 — 하 → 중 → 상 순서로 1/3씩 만들어 소제목을 단다.
  //
  // WHY "diff"가 강도 선택과 별개의 모드인가: 이 모드는 한 장 안에서 강도를
  // 1 → 2 → 3으로 올리는 것이 목적이라, 화면에서 고른 강도 하나를 쓰면 모드
  // 자체가 뜻을 잃는다. 그래서 이 모드에서는 강도 버튼을 비활성으로 두고
  // (UI 쪽 책임) 여기서는 세 강도를 순서대로 직접 쓴다.
  // ---------------------------------------------------------------------
  const ARRANGE_MIX = "";
  const ARRANGE_TYPE = "type";
  const ARRANGE_DIFF = "diff";

  // 코드에 실리는 한 글자. 기본(섞기)은 글자를 붙이지 않으므로 옛 코드가
  // 그대로 기본 모드로 읽힌다.
  const ARRANGE_CHAR = { type: "t", diff: "d" };
  const ARRANGE_FROM_CHAR = { t: ARRANGE_TYPE, d: ARRANGE_DIFF };

  function normalizeArrange(value) {
    const v = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
    if (v === ARRANGE_TYPE || v === "t") return ARRANGE_TYPE;
    if (v === ARRANGE_DIFF || v === "d") return ARRANGE_DIFF;
    return ARRANGE_MIX;
  }

  // 난이도별 묶기의 몫 나누기 — 나머지는 앞쪽(하 → 중)부터 한 문제씩 준다.
  // 문항 수가 3의 배수가 아닐 때 마지막 상 묶음만 비는 편이, 앞 묶음이 비어
  // 소제목만 덩그러니 남는 것보다 낫다.
  function splitThirds(count) {
    const n = Math.max(0, count | 0);
    const base = Math.floor(n / 3);
    const rest = n % 3;
    return [base + (rest > 0 ? 1 : 0), base + (rest > 1 ? 1 : 0), base];
  }

  // Code format: #GW-<TYPES>-<COUNT>x<SEED>[-<ARRANGE>]
  //
  // WHY the level/intensity digits live inside SEED: the code has a fixed
  // 3-segment shape, but "same code -> identical worksheet" requires the
  // 단계·강도 to be recoverable too. The SEED token is therefore
  //   "l" + <단계 숫자 0~8, 전체는 9> + <강도 1~3> + <base36 시드>
  // e.g. l42kf3a = L4 · 강도 2 · seed 0xkf3a(base36), l93kf3a = 전체(단계
  // 혼합) · 강도 3 · same seed. The old format put a bare 0/1/2 difficulty
  // digit in front instead; since base36 seeds are written after that digit
  // and the new token always starts with the letter "l", the two formats can
  // never be confused.
  //
  // 배열 모드는 시드 토큰 뒤에 "-t"(유형별) / "-d"(난이도별)로 붙인다.
  // WHY 하이픈으로 떼는가: base36 시드에는 t·d도 그대로 나올 수 있어서
  // "l42kf3at"의 마지막 t가 시드의 일부인지 모드 글자인지 가릴 방법이 없다.
  // 기본(섞기)은 아무것도 붙이지 않으므로 이미 나간 코드는 형태 그대로다.
  function buildCode(types, count, seedInt, level, intensity, arrange) {
    const seedPart = "l" + levelNum(level) + normalizeIntensity(intensity) + (seedInt >>> 0).toString(36);
    const arrangeChar = ARRANGE_CHAR[normalizeArrange(arrange)];
    return "#GW-" + types.join(".") + "-" + count + "x" + seedPart + (arrangeChar ? "-" + arrangeChar : "");
  }

  function parseCode(codeStr) {
    const m = /^#?GW-([A-Z.]+)-(\d+)x([0-9a-z]+)(?:-([td]))?$/i.exec(String(codeStr).trim());
    if (!m) return null;
    const knownCodes = TYPES.map((t) => t.code);
    const seen = {};
    const types = m[1].toUpperCase().split(".").map(canonicalType).filter((c) => {
      if (knownCodes.indexOf(c) === -1 || seen[c]) return false;
      seen[c] = true;
      return true;
    });
    const count = parseInt(m[2], 10);
    const seedToken = m[3].toLowerCase();
    let level;
    let intensity;
    let seedInt;
    if (seedToken[0] === "l") {
      // 단계 숫자 9는 "전체"(단계 혼합) — 그 자리는 LEVELS의 0~8 어느 것도
      // 아니므로 normalizeLevel("L9")로 보내지 않고 곧장 ALL_LEVEL로 읽는다.
      level = seedToken[1] === "9" ? ALL_LEVEL : normalizeLevel("L" + seedToken[1]);
      intensity = normalizeIntensity(seedToken[2]);
      seedInt = parseInt(seedToken.slice(3), 36) >>> 0;
    } else {
      const legacy = fromDifficulty(CODE_DIFF[seedToken[0]] || "mid");
      level = legacy.level;
      intensity = legacy.intensity;
      seedInt = parseInt(seedToken.slice(1), 36) >>> 0;
    }
    if (!types.length || !count || Number.isNaN(seedInt)) return null;
    const arrange = ARRANGE_FROM_CHAR[(m[4] || "").toLowerCase()] || ARRANGE_MIX;
    return { types, count, seed: seedInt, level, intensity, arrange };
  }

  function buildAssignment(rng, types, count) {
    if (!types.length) return [];
    const seq = [];
    while (seq.length < count) seq.push.apply(seq, rng.shuffle(types));
    return seq.slice(0, count);
  }

  // 유형별 묶기의 배치 — 섞기와 "유형별 문항 수"는 똑같이 두고 순서만 유형
  // 순으로 모은다. 개수까지 다시 나누면 같은 조건에서 섞기와 묶기가 서로 다른
  // 분량이 되어, 배열만 바꿨는데 학습량이 달라진다.
  function groupAssignmentByType(assignment, types) {
    return assignment
      .map((code, index) => ({ code, index }))
      .sort((a, b) => (types.indexOf(a.code) - types.indexOf(b.code)) || (a.index - b.index))
      .map((entry) => entry.code);
  }

  // 배열 모드에서 문제 카드·정답지가 소제목을 그릴 수 있도록 남기는 표시.
  // key가 바뀌는 자리마다 label을 소제목 줄로 찍으면 된다.
  function tagGroup(problem, key, label) {
    problem.group = { key, label };
    return problem;
  }

  // 난이도별 묶기 배지 — 한 장 안에서 강도가 셋 다 쓰이므로 머리말에 강도
  // 하나를 적으면 거짓말이 된다.
  function arrangeBadge(level, intensity, arrange) {
    if (normalizeArrange(arrange) !== ARRANGE_DIFF) return levelBadge(level, intensity);
    const info = levelInfo(level);
    const name = isAllLevel(level) ? "전체 혼합" : (info ? info.name : levelCode(level));
    return name + " · 난이도 " + INTENSITY_WORDS.join("→");
  }

  // opts: { types, count, seed, level, intensity, arrange }. difficulty is
  // still accepted for callers that have not moved over yet — fromDifficulty.
  function generateWorksheet(opts) {
    opts = opts || {};
    const legacy = opts.difficulty ? fromDifficulty(opts.difficulty) : null;
    const level = normalizeLevel(opts.level || (legacy && legacy.level));
    const intensity = normalizeIntensity(opts.intensity || (legacy && legacy.intensity) || DEFAULT_INTENSITY);
    const hasExplicitTypes = Object.prototype.hasOwnProperty.call(opts, "types");
    const requested = hasExplicitTypes
      ? (Array.isArray(opts.types) ? opts.types : [])
      : TYPES.filter((t) => t.defaultOn).map((t) => t.code);
    // 선택된 단계에서 지원하지 않는 유형과 중복만 뺀다. 호출자가 빈 배열을
    // 명시했다면 자동으로 기본 유형을 채우지 않는다 — 화면의 0개 선택 상태와
    // 생성 결과가 같아야 한다.
    const seen = {};
    const types = requested.map(canonicalType).filter((c) => {
      if (seen[c] || !typeSupportsLevel(c, level)) return false;
      seen[c] = true;
      return true;
    });
    const count = opts.count || 9;
    const seedInt = (opts.seed >>> 0) || 1;
    const arrange = normalizeArrange(opts.arrange);
    if (!types.length) {
      return {
        code: "",
        seed: seedInt,
        level,
        intensity,
        arrange,
        badge: arrangeBadge(level, intensity, arrange),
        types: [],
        count,
        problems: []
      };
    }
    // 씨앗에는 배열 모드를 넣지 않는다. 유형 배정(buildAssignment)이 세 모드
    // 모두 같은 난수 자리에서 시작해야 "배열만 바꿨는데 유형별 문항 수가
    // 달라지는" 일이 없다 — 배열은 학습량이 아니라 순서를 정하는 축이다.
    // 덤으로 이미 나간 코드는 예전과 글자 하나까지 같은 학습지를 만든다.
    const rng = createRng("GW:" + seedInt + ":" + level + ":" + intensity);
    let problems;
    if (arrange === ARRANGE_DIFF) {
      // 하 → 중 → 상 순서로 1/3씩. 단계는 그대로 두고 강도만 올라간다.
      problems = [];
      splitThirds(count).forEach((chunk, index) => {
        if (!chunk) return;
        const it = index + 1;
        buildAssignment(rng, types, chunk).forEach((code) => {
          const problem = make(code, rng, level, it);
          problem.intensity = it;
          problems.push(tagGroup(problem, "i" + it, "난이도 " + intensityWord(it)));
        });
      });
    } else if (arrange === ARRANGE_TYPE) {
      problems = groupAssignmentByType(buildAssignment(rng, types, count), types).map((code) => {
        const info = typeInfo(code);
        return tagGroup(make(code, rng, level, intensity), "t" + code, info ? info.label : code);
      });
    } else {
      problems = buildAssignment(rng, types, count).map((code) => make(code, rng, level, intensity));
    }
    return {
      code: buildCode(types, count, seedInt, level, intensity, arrange),
      seed: seedInt,
      level,
      intensity,
      arrange,
      badge: arrangeBadge(level, intensity, arrange),
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
    countHiddenWalled,
    cornerStaircase,
    isCornerStaircase,
    countHiddenNoWall,
    hasVoxel,
    exposedFaceCount,
    paintedFaceCount,
    paintDistribution,
    forEachVoxel,
    // shape construction
    randomConnectedFootprint,
    randomShape,
    randomViewShape,
    fallbackDenseShape,
    // 단계 × 강도
    LEVELS,
    INTENSITY_MARKS,
    INTENSITY_WORDS,
    ALL_LEVEL,
    DEFAULT_LEVEL,
    DEFAULT_INTENSITY,
    isAllLevel,
    levelNum,
    levelCode,
    levelInfo,
    availableLevels,
    nearestAvailableLevel,
    normalizeLevel,
    normalizeIntensity,
    intensityMark,
    intensityWord,
    levelBadge,
    // 문제 배열 방식
    ARRANGE_MIX,
    ARRANGE_TYPE,
    ARRANGE_DIFF,
    normalizeArrange,
    splitThirds,
    arrangeBadge,
    fromDifficulty,
    countScale,
    viewScale,
    boxNForLevel,
    fillBoxDims,
    // solver
    deriveMaxArrays,
    colMaxFromFrontView,
    rowMaxFromSideView,
    topSilhouette,
    countFootprintCells,
    enumerateShapes,
    buildTriangularStairShape,
    triangularStairTotal,
    buildSQShape,
    sqFormula,
    sqDims,
    SQ_FAMILIES,
    holeLayers,
    // problem types
    TYPES,
    TYPE_ALIASES,
    canonicalType,
    typeInfo,
    typeSupportsLevel,
    typesForLevel,
    themeForTypes,
    make,
    buildCode,
    parseCode,
    generateWorksheet
  };
})(typeof window !== "undefined" ? window : globalThis);
