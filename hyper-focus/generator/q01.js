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

/* ══════════════════════════════════════════════════════════════
   Phase2 확장 부트스트랩
   index.html 수정 없이 추가 generator를 연결한다.
   q01.js는 index.html의 인라인 스크립트 뒤에 로드되므로
   GENERATORS / buildWorksheet / onBuildWorksheet 전역에 접근 가능.
   ══════════════════════════════════════════════════════════════ */
(function () {
  if (typeof document === "undefined") return;

  var CSS = ".hf-views{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin:8px 0}"
    + ".hf-views figure{margin:0;text-align:center}"
    + ".hf-fig svg{width:160px;height:auto}"
    + ".hf-views figcaption{font-size:.75rem;color:#666;margin-top:4px}";

  function injectCss() {
    if (document.getElementById("hf-gen-css")) return;
    var st = document.createElement("style");
    st.id = "hf-gen-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function register() {
    if (typeof GENERATORS === "undefined") return;
    if (!window.HFQ02) return;

    GENERATORS[1].prompt = function () {
      return "다음은 쌓기나무로 만든 모양을 앞과 뒤에서 본 모양입니다. 쌓기나무는 모두 몇 개입니까?";
    };
    GENERATORS[2] = { gen: function (d, s) { return window.HFQ02.generateQ02(d, s); },
      problem: function (p) { return window.HFQ02.renderQ02Problem(p); },
      answer: function (p) { return window.HFQ02.renderQ02Answer(p); },
      title: "상자 채우기",
      prompt: function (p) { return "가로 " + p.width + ", 세로 " + p.depth + ", 높이 " + p.boxH + "인 상자에 쌓기나무를 쌓았습니다. 상자를 가득 채우려면 쌓기나무가 몇 개 더 필요합니까?"; } };
    GENERATORS[3] = { gen: function (d, s) { return window.HFQ03.generateQ03(d, s); },
      problem: function (p) { return window.HFQ03.renderQ03Problem(p); },
      answer: function (p) { return window.HFQ03.renderQ03Answer(p); },
      title: "흑백 쌓기나무",
      prompt: function () { return "검은색과 흰색 쌓기나무를 같은 색의 면이 맞닿지 않게 쌓았습니다. 흰색과 검은색 쌓기나무는 각각 몇 개입니까?"; } };
    GENERATORS[4] = { gen: function (d, s) { return window.HFQ04.generateQ04(d, s); },
      problem: function (p) { return window.HFQ04.renderQ04Problem(p); },
      answer: function (p) { return window.HFQ04.renderQ04Answer(p); },
      title: "구멍 뚫린 쌓기나무",
      prompt: function (p) { return "가로 " + p.width + ", 세로 " + p.depth + ", 높이 " + p.boxH + "가 되도록 빈틈없이 쌓은 쌓기나무에 반대쪽까지 통하도록 구멍을 뚫었습니다. 남은 쌓기나무는 몇 개입니까?"; } };
    GENERATORS[5] = { gen: function (d, s) { return window.HFQ05.generateQ05(d, s); },
      problem: function (p) { return window.HFQ05.renderQ05Problem(p); },
      answer: function (p) { return window.HFQ05.renderQ05Answer(p); },
      title: "숨은 쌓기나무",
      prompt: function (p) { return "쌓기나무를 빈틈없이 " + p.total + "개 쌓았습니다. 어느 방향에서도 보이지 않는 쌓기나무는 몇 개입니까? (단, 바닥면은 보이지 않습니다.)"; } };

    // 문제 지시문을 유형별로 사용하도록 교체
    window.buildWorksheet = function (opts) {
      var weaknessIds = opts.weaknessIds, diffs = opts.difficultyByQuestion, countPerType = opts.countPerType;
      var items = [], pending = [];
      weaknessIds.forEach(function (id) {
        var g = GENERATORS[id];
        if (!g) { pending.push(id); return; }
        var diff = diffs[id] || "same";
        var baseSeed = Date.now() % 100000 + id * 1000;
        for (var i = 0; i < countPerType; i += 1) {
          var p = g.gen(diff, baseSeed + i * 7919);
          items.push({ typeId: id, title: g.title, difficulty: diff, payload: p,
            promptText: g.prompt ? g.prompt(p) : g.title,
            problemHtml: g.problem(p), answerText: g.answer(p) });
        }
      });
      return { status: items.length ? "ok" : "not_ready", items: items, pending: pending, countPerType: countPerType };
    };

    window.onBuildWorksheet = function () {
      var weaknessIds = selectedSet.size > 0 ? Array.from(selectedSet).sort(function (a, b) { return a - b; }) : [];
      var area = document.getElementById("worksheet-area");
      area.style.display = "block";
      if (!weaknessIds.length) { area.innerHTML = '<p style="color:#888;padding:10px">먼저 틀린 문제를 체크해 주세요.</p>'; return; }
      var result = window.buildWorksheet({ weaknessIds: weaknessIds, difficultyByQuestion: difficultyByQuestion, countPerType: 2 });
      var nameEl = document.getElementById("studentName");
      var name = nameEl ? nameEl.value.trim() : "";
      var t = new Date();
      var dstr = t.getFullYear() + "." + String(t.getMonth() + 1).padStart(2, "0") + "." + String(t.getDate()).padStart(2, "0");
      var diffLabel = { easy: "쉽게", same: "같게", hard: "어렵게" };
      var html = "";
      if (result.items.length) {
        html += '<div id="worksheetSheet" class="ws-sheet"><div class="ws-head"><div class="ws-brand">G-FIELD 약점 보완 문제지</div><div class="ws-meta">'
          + escapeHTML(name || "학생") + " · " + dstr + "</div></div>";
        result.items.forEach(function (it, i) {
          html += '<div class="ws-q"><div class="ws-q-head">' + (i + 1) + ". [유형 "
            + String(it.typeId).padStart(2, "0") + " · " + diffLabel[it.difficulty] + "] "
            + escapeHTML(it.promptText) + "</div>" + it.problemHtml
            + '<div class="ws-ans-line">답: __________</div></div>';
        });
        html += '</div><div class="ws-actions"><button class="sim-answer-toggle" onclick="printWorksheet()">문제지 인쇄</button>'
          + '<button class="sim-answer-toggle" onclick="toggleWsAnswers(this)">정답 및 풀이 보기 ▾</button></div>';
        html += '<div id="wsAnswers" class="ws-answers" style="display:none">'
          + result.items.map(function (it, i) { return '<div class="ws-a-row">' + (i + 1) + ". " + escapeHTML(it.answerText) + "</div>"; }).join("")
          + "</div>";
      }
      if (result.pending.length) {
        html += '<p style="color:#888;font-size:.8rem;padding:8px">유형 '
          + result.pending.map(function (id) { return String(id).padStart(2, "0"); }).join(", ")
          + "은 생성기 준비 중입니다.</p>";
      }
      area.innerHTML = html;
    };
  }

  function boot() {
    try {
      injectCss();
      var s = document.createElement("script");
      s.src = "./generator/stacking.js";
      s.onload = function () { try { register(); } catch (e) { console.warn("HF generator 등록 실패", e); } };
      s.onerror = function () { console.warn("stacking.js 로드 실패 — q01만 사용"); };
      document.head.appendChild(s);
    } catch (e) { console.warn("HF 부트스트랩 실패", e); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
