// HF Stacking Generators — q02(상자 채우기) q03(흑백 교차) q04(구멍 뚫기) q05(숨은 개수)
// 엔진: geometry/worksheet 의 등축 SVG + 검증된 카운팅 로직 이식 (자유 드로잉 금지)
// 계약: generateQNN(difficulty, seed) → validate → renderProblem → deriveAnswer → renderAnswer
(function (global) {
  "use strict";

  // ── seeded RNG (mulberry32) ──
  function makeRng(seed) {
    let a = seed >>> 0;
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
      bool: () => next() < 0.5
    };
  }

  // ── 등축 SVG 엔진 (worksheet/render.js 이식) ──
  function project(x, y, z, u) { return { px: (x - z) * u * 0.87, py: (x + z) * u * 0.5 - y * u }; }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function polygon(pts, fill, stroke, extra) {
    const d = pts.map((p) => fmt(p.px) + "," + fmt(p.py)).join(" ");
    return '<polygon points="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1" stroke-linejoin="round"' + (extra || "") + "/>";
  }
  const PALETTES = {
    grey: { top: "#ececec", left: "#d4d4d4", right: "#bcbcbc", stroke: "#6d6d6d" },
    white: { top: "#f8f8f4", left: "#e6e6e0", right: "#cfcfc9", stroke: "#6d6d6d" },
    black: { top: "#565656", left: "#3f3f3f", right: "#2b2b2b", stroke: "#161616" }
  };
  function quadY(x, yP, z, u) { return [project(x, yP, z, u), project(x + 1, yP, z, u), project(x + 1, yP, z + 1, u), project(x, yP, z + 1, u)]; }
  function quadZ(x, y, zP, u) { return [project(x, y, zP, u), project(x + 1, y, zP, u), project(x + 1, y + 1, zP, u), project(x, y + 1, zP, u)]; }
  function quadX(xP, y, z, u) { return [project(xP, y, z, u), project(xP, y, z + 1, u), project(xP, y + 1, z + 1, u), project(xP, y + 1, z, u)]; }
  function cubeSvg(x, y, z, u, pal) {
    return polygon(quadY(x, y + 1, z, u), pal.top, pal.stroke)
         + polygon(quadZ(x, y, z + 1, u), pal.left, pal.stroke)
         + polygon(quadX(x + 1, y, z, u), pal.right, pal.stroke);
  }
  function mapTotal(map) { let t = 0; for (const r of map) for (const h of r) t += h; return t; }
  function maxHeightOf(map) { let m = 0; for (const r of map) for (const h of r) if (h > m) m = h; return m; }
  function isoBBox(width, depth, height, u) {
    const pad = u * 0.6;
    return { xMin: -depth * u * 0.87 - pad, yMin: -height * u - pad,
             w: (width + depth) * u * 0.87 + pad * 2, h: (width + depth) * u * 0.5 + height * u + pad * 2 };
  }
  function wrapSvg(inner, bb) {
    return '<svg viewBox="' + fmt(bb.xMin) + " " + fmt(bb.yMin) + " " + fmt(bb.w) + " " + fmt(bb.h)
      + '" preserveAspectRatio="xMidYMid meet" class="hf-iso">' + inner + "</svg>";
  }
  // painter's order: far(z=0) → near
  function renderIso(map, width, depth, u, colorFn) {
    u = u || 20;
    let svg = "";
    for (let z = 0; z < depth; z += 1)
      for (let x = 0; x < width; x += 1)
        for (let y = 0; y < (map[z][x] || 0); y += 1)
          svg += cubeSvg(x, y, z, u, PALETTES[colorFn ? colorFn(x, y, z) : "grey"] || PALETTES.grey);
    return wrapSvg(svg, isoBBox(width, depth, Math.max(1, maxHeightOf(map)), u));
  }

  // ── 공용 셰이프: 모서리 계단 (앞 기둥이 뒤를 가리지 않음) ──
  function cornerStaircase(rng, width, depth, maxH, firstColumnFull) {
    const map = [];
    for (let z = 0; z < depth; z += 1) {
      const row = [];
      let prev = maxH;
      for (let x = 0; x < width; x += 1) {
        let h;
        if (x === 0 && firstColumnFull) h = maxH;
        else h = rng.int(0, prev);
        row.push(h); prev = h;
      }
      map.push(row);
    }
    return map;
  }

  // ── q05: 어느 방향에서도 안 보이는 개수 (worksheet countHiddenNoWall 이식) ──
  function countHiddenNoWall(map) {
    const depth = map.length, width = depth ? map[0].length : 0;
    let hidden = 0;
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        const h = map[z][x];
        for (let y = 0; y < h; y += 1) {
          if (y >= h - 1) continue;               // 위에서 보임
          let br = false; for (let x2 = x + 1; x2 < width; x2 += 1) if (map[z][x2] > y) { br = true; break; }
          if (!br) continue;
          let bl = false; for (let x2 = x - 1; x2 >= 0; x2 -= 1) if (map[z][x2] > y) { bl = true; break; }
          if (!bl) continue;
          let bf = false; for (let z2 = z + 1; z2 < depth; z2 += 1) if (map[z2][x] > y) { bf = true; break; }
          if (!bf) continue;
          let bb = false; for (let z2 = z - 1; z2 >= 0; z2 -= 1) if (map[z2][x] > y) { bb = true; break; }
          if (!bb) continue;
          hidden += 1;
        }
      }
    }
    return hidden;
  }

  // ══════════ q02 — 상자 채우기 ══════════
  const Q02_DIMS = { easy: [[3, 2, 2], [3, 3, 2]], same: [[3, 3, 3], [4, 3, 2]], hard: [[4, 3, 3], [4, 4, 3]] };
  function generateQ02(difficulty, seed) {
    const rng = makeRng(seed);
    const dims = Q02_DIMS[difficulty] || Q02_DIMS.same;
    for (let t = 0; t < 200; t += 1) {
      const [W, D, H] = rng.pick(dims);
      const total = W * D * H;
      let map = cornerStaircase(rng, W, D, H, true);
      for (let z = 0; z < D; z += 1) map[z][0] = H;         // 왼쪽 기둥 가득 → 상자 높이 판독 가능
      let placed = mapTotal(map);
      if (placed >= total) { map[D - 1][W - 1] = Math.max(0, H - 1); placed = mapTotal(map); }
      const need = total - placed;
      const payload = { map, width: W, depth: D, boxH: H, total, placed, need, difficulty, seed };
      if (validateQ02(payload)) return payload;
    }
    const map = [[3, 1, 0], [3, 2, 1], [3, 3, 2]];
    return { map, width: 3, depth: 3, boxH: 3, total: 27, placed: mapTotal(map), need: 27 - mapTotal(map), difficulty, seed: "fallback" };
  }
  function validateQ02(p) {
    if (p.need < 2) return false;                            // 너무 쉬움
    if (p.placed < p.total * 0.25 || p.placed > p.total * 0.75) return false;
    return maxHeightOf(p.map) === p.boxH;                    // 상자 높이가 그림에서 읽혀야 함
  }
  function deriveQ02Answer(p) { return p.need; }
  function renderQ02Problem(p) {
    return '<div class="hf-views"><figure><div class="hf-fig">' + renderIso(p.map, p.width, p.depth)
      + '</div><figcaption>상자에 쌓은 모양 (가로 ' + p.width + ', 세로 ' + p.depth + ', 높이 ' + p.boxH + ')</figcaption></figure></div>';
  }
  function renderQ02Answer(p) {
    return "정답: " + p.need + "개 — 상자를 가득 채우면 " + p.width + "×" + p.depth + "×" + p.boxH + "=" + p.total
      + "개입니다. 지금 " + p.placed + "개가 있으니 " + p.total + "−" + p.placed + "=" + p.need + "개가 더 필요합니다.";
  }

  // ══════════ q03 — 흑백 교차 ══════════
  const Q03_DIMS = { easy: [[2, 2, 2], [3, 2, 2]], same: [[3, 3, 2], [3, 2, 3]], hard: [[3, 3, 3], [4, 3, 2]] };
  function generateQ03(difficulty, seed) {
    const rng = makeRng(seed);
    const dims = Q03_DIMS[difficulty] || Q03_DIMS.same;
    for (let t = 0; t < 200; t += 1) {
      const [W, D, H] = rng.pick(dims);
      const cube = rng.bool();
      let map;
      if (cube) { map = []; for (let z = 0; z < D; z += 1) map.push(new Array(W).fill(H)); }
      else { map = cornerStaircase(rng, W, D, H, true); for (let z = 0; z < D; z += 1) map[z][0] = H; }
      const cornerWhite = rng.bool();
      let white = 0, black = 0;
      for (let z = 0; z < D; z += 1) for (let x = 0; x < W; x += 1) for (let y = 0; y < map[z][x]; y += 1) {
        const even = (x + y + z) % 2 === 0;
        if (cornerWhite ? even : !even) white += 1; else black += 1;
      }
      const payload = { map, width: W, depth: D, boxH: H, cube, cornerWhite, white, black, difficulty, seed };
      if (validateQ03(payload)) return payload;
    }
    const map = [[2, 2], [2, 2]];
    return { map, width: 2, depth: 2, boxH: 2, cube: true, cornerWhite: true, white: 4, black: 4, difficulty, seed: "fallback" };
  }
  function validateQ03(p) {
    const total = p.white + p.black;
    if (total < 6 || total > 30) return false;
    return p.white > 0 && p.black > 0;
  }
  function deriveQ03Answer(p) { return { white: p.white, black: p.black }; }
  function renderQ03Problem(p) {
    const colorFn = (x, y, z) => {
      const even = (x + y + z) % 2 === 0;
      return (p.cornerWhite ? even : !even) ? "white" : "black";
    };
    return '<div class="hf-views"><figure><div class="hf-fig">' + renderIso(p.map, p.width, p.depth, 20, colorFn)
      + '</div><figcaption>' + (p.cube ? "정육면체 모양으로" : "계단 모양으로") + " 쌓은 모양</figcaption></figure></div>";
  }
  function renderQ03Answer(p) {
    return "정답: 흰색 " + p.white + "개, 검은색 " + p.black + "개 — 맞닿은 면끼리 색이 반대이므로, 한 칸 옮길 때마다 색이 바뀝니다. 전체 "
      + (p.white + p.black) + "개를 색깔별로 세면 됩니다.";
  }

  // ══════════ q04 — 구멍 뚫기 ══════════
  const Q04_DIMS = { easy: [[3, 3, 3], [3, 2, 3], [3, 3, 2], [2, 3, 3]], same: [[3, 3, 3], [4, 3, 3]], hard: [[4, 4, 3], [4, 4, 4]] };
  const Q04_HOLES = { easy: [1, 1], same: [1, 2], hard: [2, 3] };
  function generateQ04(difficulty, seed) {
    const rng = makeRng(seed);
    const dims = Q04_DIMS[difficulty] || Q04_DIMS.same;
    const hr = Q04_HOLES[difficulty] || [1, 2];
    for (let t = 0; t < 200; t += 1) {
      const [W, D, H] = rng.pick(dims);
      const total = W * D * H;
      const removed = new Set();
      const holes = [];
      const holeCount = rng.int(hr[0], hr[1]);
      for (let i = 0; i < holeCount; i += 1) {
        // 축: 'z'(앞→뒤, 깊이 D 관통) 또는 'y'(위→아래, 높이 H 관통)
        const axis = difficulty === "easy" ? "z" : rng.pick(["z", "y"]);
        if (axis === "z") {
          const x = rng.int(0, W - 1), y = rng.int(0, H - 1);
          if (holes.some((h) => h.axis === "z" && h.x === x && h.y === y)) continue;
          holes.push({ axis: "z", x, y });
          for (let z = 0; z < D; z += 1) removed.add(x + "," + y + "," + z);
        } else {
          const x = rng.int(0, W - 1), z = rng.int(0, D - 1);
          if (holes.some((h) => h.axis === "y" && h.x === x && h.z === z)) continue;
          holes.push({ axis: "y", x, z });
          for (let y = 0; y < H; y += 1) removed.add(x + "," + y + "," + z);
        }
      }
      const payload = { width: W, depth: D, boxH: H, total, holes, removedCount: removed.size,
                        remaining: total - removed.size, removedSet: removed, difficulty, seed };
      if (validateQ04(payload)) return payload;
    }
    const removed = new Set();
    for (let z = 0; z < 3; z += 1) removed.add("1,1," + z);
    return { width: 3, depth: 3, boxH: 3, total: 27, holes: [{ axis: "z", x: 1, y: 1 }],
             removedCount: removed.size, remaining: 27 - removed.size, removedSet: removed, difficulty, seed: "fallback" };
  }
  function validateQ04(p) {
    if (p.holes.length === 0) return false;
    if (p.removedCount < 2) return false;
    return p.remaining > p.total * 0.5;                       // 너무 많이 뚫리면 그림이 무너짐
  }
  function deriveQ04Answer(p) { return p.remaining; }
  function renderQ04Problem(p) {
    const u = 20, W = p.width, D = p.depth, H = p.boxH;
    const has = (x, y, z) => !p.removedSet.has(x + "," + y + "," + z);
    let svg = "";
    for (let z = 0; z < D; z += 1)
      for (let x = 0; x < W; x += 1)
        for (let y = 0; y < H; y += 1) {
          if (!has(x, y, z)) continue;
          svg += cubeSvg(x, y, z, u, PALETTES.grey);
        }
    // 구멍 입구 표시 (앞면 z=D, 윗면 y=H)
    for (const h of p.holes) {
      if (h.axis === "z") svg += polygon(quadZ(h.x, h.y, D, u), "#2b2b2b", "#161616");
      else svg += polygon(quadY(h.x, H, h.z, u), "#2b2b2b", "#161616");
    }
    const inner = wrapSvg(svg, isoBBox(W, D, H, u));
    const desc = p.holes.map((h) => h.axis === "z" ? "앞에서 뒤로" : "위에서 아래로").filter((v, i, a) => a.indexOf(v) === i).join(", ");
    return '<div class="hf-views"><figure><div class="hf-fig">' + inner
      + '</div><figcaption>' + W + "×" + D + "×" + H + " 상자에 " + desc + " 구멍 " + p.holes.length + "개</figcaption></figure></div>";
  }
  function renderQ04Answer(p) {
    return "정답: " + p.remaining + "개 — 전체는 " + p.width + "×" + p.depth + "×" + p.boxH + "=" + p.total
      + "개입니다. 구멍으로 빠진 " + p.removedCount + "개를 빼면 " + p.total + "−" + p.removedCount + "=" + p.remaining + "개입니다.";
  }

  // ══════════ q05 — 숨은 쌓기나무 ══════════
  const Q05_DIMS = { easy: [[3, 3, 3]], same: [[3, 3, 4], [4, 3, 3]], hard: [[4, 4, 4], [4, 3, 4]] };
  function generateQ05(difficulty, seed) {
    const rng = makeRng(seed);
    const dims = Q05_DIMS[difficulty] || Q05_DIMS.same;
    const wants = { easy: [1, 2], same: [3, 5], hard: [5, 10] }[difficulty] || [3, 5];
    for (let t = 0; t < 400; t += 1) {
      const [W, D, H] = rng.pick(dims);
      const map = [];
      for (let z = 0; z < D; z += 1) {
        const row = [];
        for (let x = 0; x < W; x += 1) {
          // 가운데일수록 높게 → 숨은 칸이 생기는 형태
          const midX = (W - 1) / 2, midZ = (D - 1) / 2;
          const centerBias = (Math.abs(x - midX) + Math.abs(z - midZ)) < 1.2 ? 1 : 0;
          row.push(Math.min(H, rng.int(1, H - 1) + centerBias));
        }
        map.push(row);
      }
      const hidden = countHiddenNoWall(map);
      const total = mapTotal(map);
      const payload = { map, width: W, depth: D, hidden, total, visible: total - hidden, difficulty, seed };
      if (hidden < wants[0] || hidden > wants[1]) continue;
      if (validateQ05(payload)) return payload;
    }
    const map = [[2, 3, 2], [3, 4, 3], [2, 3, 2]];
    const hidden = countHiddenNoWall(map);
    return { map, width: 3, depth: 3, hidden, total: mapTotal(map), visible: mapTotal(map) - hidden, difficulty, seed: "fallback" };
  }
  function validateQ05(p) {
    if (p.hidden < 1) return false;
    if (p.total < 8) return false;
    return maxHeightOf(p.map) >= 2;
  }
  function deriveQ05Answer(p) { return p.hidden; }
  function renderQ05Problem(p) {
    return '<div class="hf-views"><figure><div class="hf-fig">' + renderIso(p.map, p.width, p.depth)
      + '</div><figcaption>쌓은 모양 (전체 ' + p.total + '개)</figcaption></figure></div>';
  }
  function renderQ05Answer(p) {
    return "정답: " + p.hidden + "개 — 전체 " + p.total + "개 중에서 겉으로 보이는 " + p.visible + "개를 빼면 "
      + p.total + "−" + p.visible + "=" + p.hidden + "개가 숨어 있습니다.";
  }

  global.HFQ02 = { generateQ02, validateQ02, renderQ02Problem, deriveQ02Answer, renderQ02Answer };
  global.HFQ03 = { generateQ03, validateQ03, renderQ03Problem, deriveQ03Answer, renderQ03Answer };
  global.HFQ04 = { generateQ04, validateQ04, renderQ04Problem, deriveQ04Answer, renderQ04Answer };
  global.HFQ05 = { generateQ05, validateQ05, renderQ05Problem, deriveQ05Answer, renderQ05Answer };
})(typeof window !== "undefined" ? window : globalThis);
