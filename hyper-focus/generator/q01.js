// HF q01 Generator — 앞과 뒤에서 본 쌓기나무 전체 개수
// 엔진: geometry/worksheet/render.js의 등축 SVG 이식 (자유 드로잉 금지 원칙)
// 계약: generateQ01(difficulty, seed) → validateQ01 → renderQ01Problem → deriveQ01Answer → renderQ01Answer
(function (global) {
  "use strict";

  // ── seeded RNG (mulberry32) — 같은 seed면 같은 문제 ──
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
      pick: (arr) => arr[Math.floor(next() * arr.length)]
    };
  }

  // ── 등축 SVG 엔진 (worksheet/render.js 이식) ──
  function project(x, y, z, u) {
    return { px: (x - z) * u * 0.87, py: (x + z) * u * 0.5 - y * u };
  }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function polygon(pts, fill, stroke) {
    const d = pts.map((p) => fmt(p.px) + "," + fmt(p.py)).join(" ");
    return '<polygon points="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1" stroke-linejoin="round"/>';
  }
  const PAL = { top: "#ececec", left: "#d4d4d4", right: "#bcbcbc", stroke: "#6d6d6d" };
  function quadY(x, yP, z, u) { return [project(x, yP, z, u), project(x + 1, yP, z, u), project(x + 1, yP, z + 1, u), project(x, yP, z + 1, u)]; }
  function quadZ(x, y, zP, u) { return [project(x, y, zP, u), project(x + 1, y, zP, u), project(x + 1, y + 1, zP, u), project(x, y + 1, zP, u)]; }
  function quadX(xP, y, z, u) { return [project(xP, y, z, u), project(xP, y, z + 1, u), project(xP, y + 1, z + 1, u), project(xP, y + 1, z, u)]; }
  function cubeSvg(x, y, z, u) {
    return polygon(quadY(x, y + 1, z, u), PAL.top, PAL.stroke)
         + polygon(quadZ(x, y, z + 1, u), PAL.left, PAL.stroke)
         + polygon(quadX(x + 1, y, z, u), PAL.right, PAL.stroke);
  }
  function maxHeightOf(map) {
    let m = 0;
    for (const row of map) for (const h of row) if (h > m) m = h;
    return m;
  }
  function isoBBox(width, depth, height, u) {
    const pad = u * 0.6;
    const xMin = -depth * u * 0.87 - pad, xMax = width * u * 0.87 + pad;
    const yMin = -height * u - pad, yMax = (width + depth) * u * 0.5 + pad;
    return { xMin, yMin, w: xMax - xMin, h: yMax - yMin };
  }
  function renderIso(map, width, depth, u) {
    u = u || 20;
    let svg = "";
    for (let z = 0; z < depth; z += 1)
      for (let x = 0; x < width; x += 1)
        for (let y = 0; y < (map[z][x] || 0); y += 1)
          svg += cubeSvg(x, y, z, u);
    const bb = isoBBox(width, depth, Math.max(1, maxHeightOf(map)), u);
    return '<svg viewBox="' + fmt(bb.xMin) + " " + fmt(bb.yMin) + " " + fmt(bb.w) + " " + fmt(bb.h) + '" preserveAspectRatio="xMidYMid meet" class="q01-iso">' + svg + "</svg>";
  }

  // ── 뒤에서 본 모양 = heightMap 180° 회전 ──
  function rotate180(map) {
    return map.slice().reverse().map((row) => row.slice().reverse());
  }

  // ── 가시성: 앞뷰에서 기둥(x,z)의 꼭대기가 보이는가 ──
  // 등축에서 뒤 기둥은 위로 올라가 보이므로, 자기 앞(z'>z, 같은 x)의
  // 기둥이 전부 자기보다 낮거나 같으면 top이 보인다. 높은 기둥이 있으면 가림.
  function columnVisibleFront(map, x, z, depth) {
    const h = map[z][x] || 0;
    if (h === 0) return true; // 빈 칸은 판정 불필요
    for (let zf = z + 1; zf < depth; zf += 1) {
      if ((map[zf][x] || 0) > h) return false;
    }
    return true;
  }

  // ── validator: 모든 기둥이 앞뷰 또는 뒤뷰에서 확인 가능해야 유일 정답 ──
  function validateQ01(payload) {
    const { map, width, depth } = payload;
    const back = rotate180(map);
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        if ((map[z][x] || 0) === 0) continue;
        const frontOk = columnVisibleFront(map, x, z, depth);
        // 뒤뷰에서 이 기둥의 회전 좌표
        const bz = depth - 1 - z, bx = width - 1 - x;
        const backOk = columnVisibleFront(back, bx, bz, depth);
        if (!frontOk && !backOk) return false; // 어느 쪽에서도 안 보임 → 문제 불성립
      }
    }
    // 최소 기둥 수·높이 변화 (밋밋한 문제 방지)
    const heights = [];
    for (const row of map) for (const h of row) if (h > 0) heights.push(h);
    if (heights.length < 3) return false;
    if (new Set(heights).size < 2) return false;
    return true;
  }

  // ── 난이도별 heightMap 생성 ──
  const DIFF_SPEC = {
    easy: { dims: [[2, 2], [3, 2]], maxH: 2, minTotal: 5, maxTotal: 8 },
    same: { dims: [[3, 3]], maxH: 3, minTotal: 9, maxTotal: 13 },
    hard: { dims: [[3, 3], [4, 3]], maxH: 4, minTotal: 14, maxTotal: 19 }
  };

  function generateQ01(difficulty, seed) {
    const spec = DIFF_SPEC[difficulty] || DIFF_SPEC.same;
    const rng = makeRng(seed);
    for (let attempt = 0; attempt < 300; attempt += 1) {
      const [width, depth] = rng.pick(spec.dims);
      const map = [];
      let total = 0;
      for (let z = 0; z < depth; z += 1) {
        const row = [];
        for (let x = 0; x < width; x += 1) {
          const h = rng.int(0, spec.maxH);
          row.push(h); total += h;
        }
        map.push(row);
      }
      if (total < spec.minTotal || total > spec.maxTotal) continue;
      const payload = { map, width, depth, difficulty, seed: seed + ":" + attempt };
      if (validateQ01(payload)) return payload;
    }
    // 실패 시 안전한 고정 문제 (검증된 형태)
    return { map: [[1, 2], [2, 1], [1, 1]], width: 2, depth: 3, difficulty, seed: "fallback" };
  }

  function deriveQ01Answer(payload) {
    let total = 0;
    for (const row of payload.map) for (const h of row) total += h;
    return total;
  }

  function renderQ01Problem(payload) {
    const front = renderIso(payload.map, payload.width, payload.depth);
    const back = renderIso(rotate180(payload.map), payload.width, payload.depth);
    return '<div class="q01-views">'
      + '<figure><div class="q01-fig">' + front + '</div><figcaption>앞에서 본 모양</figcaption></figure>'
      + '<figure><div class="q01-fig">' + back + '</div><figcaption>뒤에서 본 모양</figcaption></figure>'
      + '</div>';
  }

  function renderQ01Answer(payload) {
    const total = deriveQ01Answer(payload);
    // 자리별 개수 풀이 (7~8세: 기둥별로 세어 더하기)
    const cols = [];
    for (let z = 0; z < payload.depth; z += 1)
      for (let x = 0; x < payload.width; x += 1)
        if (payload.map[z][x] > 0) cols.push(payload.map[z][x]);
    return '정답: ' + total + '개 — 자리마다 쌓인 개수를 더하면 ' + cols.join('+') + '=' + total + '입니다.';
  }

  global.HFQ01 = { generateQ01, validateQ01, renderQ01Problem, deriveQ01Answer, renderQ01Answer, _renderIso: renderIso, _rotate180: rotate180 };
})(typeof window !== "undefined" ? window : globalThis);
