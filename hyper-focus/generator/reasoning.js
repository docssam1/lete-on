(function (global) {
  "use strict";

  function makeRng(seed) {
    let state = (Number(seed) >>> 0) || 1;
    return {
      next() {
        state += 0x6D2B79F5;
        let value = state;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
      },
      int(min, max) { return min + Math.floor(this.next() * (max - min + 1)); },
      pick(values) { return values[this.int(0, values.length - 1)]; }
    };
  }

  function svgText(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[char]);
  }

  const Q10_SPEC = {
    easy: { min: 1, max: 4, answerMin: 3, answerMax: 8 },
    same: { min: 4, max: 8, answerMin: 9, answerMax: 16 },
    hard: { min: 9, max: 18, answerMin: 19, answerMax: 35 }
  };
  function generateQ10(difficulty, seed) {
    const spec = Q10_SPEC[difficulty] || Q10_SPEC.same, rng = makeRng(seed);
    let left, right, answer;
    do {
      left = rng.int(spec.min, spec.max);
      right = rng.int(spec.min, spec.max);
      answer = left + right;
    } while (left === right || answer < spec.answerMin || answer > spec.answerMax);
    return { left, right, answer, rule: "sum", difficulty, seed: Number(seed) || 1 };
  }
  function enumerateQ10AnswerCandidates(payload) {
    if (!payload || payload.rule !== "sum" || !Number.isInteger(payload.left) || !Number.isInteger(payload.right)) return [];
    return [payload.left + payload.right];
  }
  function validateQ10(payload) {
    const spec = Q10_SPEC[payload && payload.difficulty], candidates = enumerateQ10AnswerCandidates(payload);
    return Boolean(spec && payload.left >= spec.min && payload.left <= spec.max
      && payload.right >= spec.min && payload.right <= spec.max && payload.left !== payload.right
      && payload.answer >= spec.answerMin && payload.answer <= spec.answerMax
      && candidates.length === 1 && candidates[0] === payload.answer);
  }
  function deriveQ10Answer(payload) { return payload.answer; }
  function renderQ10Problem(payload) {
    return `<svg class="hf-reasoning hf-overlap" viewBox="0 0 520 250" role="img" aria-label="두 색종이가 겹친 그림"><defs><filter id="q10s"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".12"/></filter></defs><rect width="520" height="250" rx="18" fill="#fff"/><g filter="url(#q10s)"><rect x="72" y="54" width="230" height="142" rx="18" fill="#f6d8c9" fill-opacity=".82" stroke="#a75d45" stroke-width="3"/><rect x="218" y="54" width="230" height="142" rx="18" fill="#cfe5df" fill-opacity=".82" stroke="#4f7e73" stroke-width="3"/></g><text x="145" y="137" text-anchor="middle" font-size="31" font-weight="900" fill="#713e30">${payload.left}</text><text x="375" y="137" text-anchor="middle" font-size="31" font-weight="900" fill="#315e54">${payload.right}</text><text x="260" y="137" text-anchor="middle" font-size="36" font-weight="950" fill="#172b3d">★</text><text x="260" y="226" text-anchor="middle" font-size="16" font-weight="800" fill="#56616b">겹친 부분의 수 = 양쪽 수의 합</text></svg>`;
  }
  function renderQ10Answer(payload) {
    return `정답: ${payload.answer} — 겹친 부분은 양쪽 수를 더하므로 ${payload.left}+${payload.right}=${payload.answer}입니다.`;
  }

  const Q11_SPEC = {
    easy: { min: 1, max: 6, sumMin: 8, sumMax: 20 },
    same: { min: 5, max: 12, sumMin: 24, sumMax: 44 },
    hard: { min: 13, max: 25, sumMin: 58, sumMax: 92 }
  };
  const Q11_CORNERS = [
    { rowHalf: "top", colHalf: "right", first: "위쪽을 아래로", second: "오른쪽을 왼쪽으로" },
    { rowHalf: "top", colHalf: "left", first: "위쪽을 아래로", second: "왼쪽을 오른쪽으로" },
    { rowHalf: "bottom", colHalf: "right", first: "아래쪽을 위로", second: "오른쪽을 왼쪽으로" },
    { rowHalf: "bottom", colHalf: "left", first: "아래쪽을 위로", second: "왼쪽을 오른쪽으로" }
  ];
  function q11VisibleCells(payload) {
    const rows = payload.rowHalf === "top" ? [0, 1] : [2, 3];
    const cols = payload.colHalf === "left" ? [0, 1] : [2, 3];
    return rows.flatMap((row) => cols.map((col) => ({ row, col, value: payload.grid[row][col] })));
  }
  function generateQ11(difficulty, seed) {
    const spec = Q11_SPEC[difficulty] || Q11_SPEC.same, rng = makeRng(seed), corner = rng.pick(Q11_CORNERS);
    let grid, visible, answer;
    do {
      grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => rng.int(spec.min, spec.max)));
      const partial = { ...corner, grid };
      visible = q11VisibleCells(partial);
      answer = visible.reduce((sum, cell) => sum + cell.value, 0);
    } while (answer < spec.sumMin || answer > spec.sumMax || new Set(visible.map((cell) => cell.value)).size < 3);
    return { ...corner, grid, visibleCells: visible, answer, difficulty, seed: Number(seed) || 1 };
  }
  function enumerateQ11AnswerCandidates(payload) {
    if (!payload || !Array.isArray(payload.grid) || payload.grid.length !== 4 || payload.grid.some((row) => !Array.isArray(row) || row.length !== 4)) return [];
    if (!["top", "bottom"].includes(payload.rowHalf) || !["left", "right"].includes(payload.colHalf)) return [];
    return [q11VisibleCells(payload).reduce((sum, cell) => sum + cell.value, 0)];
  }
  function validateQ11(payload) {
    const spec = Q11_SPEC[payload && payload.difficulty], candidates = enumerateQ11AnswerCandidates(payload);
    if (!spec || candidates.length !== 1 || candidates[0] !== payload.answer) return false;
    if (payload.grid.flat().some((value) => !Number.isInteger(value) || value < spec.min || value > spec.max)) return false;
    const expected = q11VisibleCells(payload);
    return payload.answer >= spec.sumMin && payload.answer <= spec.sumMax
      && JSON.stringify(expected) === JSON.stringify(payload.visibleCells)
      && new Set(expected.map((cell) => cell.value)).size >= 3;
  }
  function deriveQ11Answer(payload) { return payload.answer; }
  function q11GridSvg(payload) {
    let cells = "";
    for (let row = 0; row < 4; row += 1) for (let col = 0; col < 4; col += 1) {
      const x = col * 46, y = row * 46;
      cells += `<rect x="${x}" y="${y}" width="46" height="46" fill="#fffaf6" stroke="#927a70"/><text x="${x + 23}" y="${y + 29}" text-anchor="middle" font-size="17" font-weight="900" fill="#26313a">${payload.grid[row][col]}</text>`;
    }
    return cells;
  }
  function renderQ11Problem(payload) {
    const firstArrow = payload.rowHalf === "top"
      ? '<path d="M26 72C3 101 3 171 26 205" fill="none" stroke="#a54b46" stroke-width="4" marker-end="url(#q11a)"/>'
      : '<path d="M26 205C3 171 3 101 26 72" fill="none" stroke="#a54b46" stroke-width="4" marker-end="url(#q11a)"/>';
    const secondArrow = payload.colHalf === "right"
      ? '<path d="M476 76C449 47 381 47 354 76" fill="none" stroke="#a54b46" stroke-width="4" marker-end="url(#q11a)"/>'
      : '<path d="M354 188C381 217 449 217 476 188" fill="none" stroke="#a54b46" stroke-width="4" marker-end="url(#q11a)"/>';
    return `<svg class="hf-reasoning hf-fold-numbers" viewBox="0 0 680 300" role="img" aria-label="숫자판을 두 번 접는 그림"><defs><marker id="q11a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10Z" fill="#a54b46"/></marker><marker id="q11step" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10Z" fill="#8b969c"/></marker></defs><rect width="680" height="300" rx="18" fill="#fff"/><g transform="translate(34 46)">${q11GridSvg(payload)}<path d="M0 92H184M92 0V184" stroke="#a54b46" stroke-width="2" stroke-dasharray="7 5"/></g>${firstArrow}<path d="M238 138H294" stroke="#8b969c" stroke-width="4" marker-end="url(#q11step)"/><g transform="translate(318 84)"><rect width="184" height="92" rx="3" fill="#fffaf6" stroke="#927a70" stroke-width="2"/><path d="M92 0V92M0 46H184" stroke="#b9a49b"/></g>${secondArrow}<path d="M516 138H565" stroke="#8b969c" stroke-width="4" marker-end="url(#q11step)"/><g transform="translate(584 92)"><rect x="4" y="5" width="72" height="72" fill="#eadbd4" stroke="#bca59b"/><rect width="72" height="72" fill="#fffaf6" stroke="#927a70" stroke-width="2"/><path d="M36 0V72M0 36H72" stroke="#b9a49b"/><text x="18" y="25" text-anchor="middle" font-size="15" font-weight="900" fill="#9a8880">?</text><text x="54" y="25" text-anchor="middle" font-size="15" font-weight="900" fill="#9a8880">?</text><text x="18" y="61" text-anchor="middle" font-size="15" font-weight="900" fill="#9a8880">?</text><text x="54" y="61" text-anchor="middle" font-size="15" font-weight="900" fill="#9a8880">?</text></g><text x="126" y="258" text-anchor="middle" font-size="14" font-weight="850" fill="#72514b">① ${svgText(payload.first)}</text><text x="410" y="236" text-anchor="middle" font-size="14" font-weight="850" fill="#72514b">② ${svgText(payload.second)}</text><text x="620" y="190" text-anchor="middle" font-size="13" font-weight="850" fill="#59636a">가장 윗면</text><text x="340" y="286" text-anchor="middle" font-size="14" font-weight="800" fill="#59636a">접혀 움직이는 네모 칸을 따라가세요.</text></svg>`;
  }
  function renderQ11Answer(payload) {
    const numbers = payload.visibleCells.map((cell) => cell.value);
    return `정답: ${payload.answer} — ${payload.first} 접고 ${payload.second} 접으면 ${numbers.join(", ")}이 위에 옵니다. ${numbers.join("+")}=${payload.answer}입니다.`;
  }

  const Q12_SPEC = {
    easy: { foldCount: 1, punchMin: 1, punchMax: 2 },
    same: { foldCount: 2, punchMin: 1, punchMax: 2 },
    hard: { foldCount: 3, punchMin: 1, punchMax: 2 }
  };
  const Q12_FOLDS = [
    { axis: "vertical", label: "오른쪽을 왼쪽으로" },
    { axis: "horizontal", label: "아래쪽을 위로" },
    { axis: "diagonal", label: "대각선으로 한 번 더" }
  ];
  function reflectPoint(point, axis) {
    if (axis === "vertical") return [1 - point[0], point[1]];
    if (axis === "horizontal") return [point[0], 1 - point[1]];
    return [point[1], point[0]];
  }
  function pointKey(point) { return point.map((value) => value.toFixed(4)).join(","); }
  function unfoldPoints(punchPoints, folds) {
    let points = punchPoints.map((point) => point.slice());
    folds.slice().reverse().forEach((fold) => {
      const next = new Map();
      points.forEach((point) => {
        next.set(pointKey(point), point);
        const reflected = reflectPoint(point, fold.axis);
        next.set(pointKey(reflected), reflected);
      });
      points = [...next.values()];
    });
    return points;
  }
  function generateQ12(difficulty, seed) {
    const spec = Q12_SPEC[difficulty] || Q12_SPEC.same, rng = makeRng(seed), folds = Q12_FOLDS.slice(0, spec.foldCount);
    const punchCount = spec.punchMin === spec.punchMax
      ? spec.punchMin
      : spec.punchMin + (Math.abs(Math.trunc(Number(seed) || 1)) % (spec.punchMax - spec.punchMin + 1));
    let punchPoints, unfolded;
    do {
      punchPoints = Array.from({ length: punchCount }, (_, index) => {
        const x = 0.12 + rng.next() * 0.16 + index * 0.025;
        const y = spec.foldCount === 3 ? x + 0.08 + rng.next() * 0.10 : 0.22 + rng.next() * 0.18 + index * 0.025;
        return [Number(x.toFixed(4)), Number(Math.min(y, 0.47).toFixed(4))];
      });
      unfolded = unfoldPoints(punchPoints, folds);
    } while (unfolded.length !== punchCount * 2 ** spec.foldCount);
    return { folds, punchPoints, punchCount, unfoldedPoints: unfolded, answer: unfolded.length, difficulty, seed: Number(seed) || 1 };
  }
  function enumerateQ12AnswerCandidates(payload) {
    if (!payload || !Array.isArray(payload.folds) || !Array.isArray(payload.punchPoints)) return [];
    const points = unfoldPoints(payload.punchPoints, payload.folds);
    return points.length ? [points.length] : [];
  }
  function validateQ12(payload) {
    const spec = Q12_SPEC[payload && payload.difficulty], candidates = enumerateQ12AnswerCandidates(payload);
    if (!spec || payload.folds.length !== spec.foldCount || payload.punchCount < spec.punchMin || payload.punchCount > spec.punchMax) return false;
    if (payload.punchPoints.length !== payload.punchCount || candidates.length !== 1 || candidates[0] !== payload.answer) return false;
    return payload.answer === payload.punchCount * 2 ** spec.foldCount
      && JSON.stringify(unfoldPoints(payload.punchPoints, payload.folds)) === JSON.stringify(payload.unfoldedPoints);
  }
  function deriveQ12Answer(payload) { return payload.answer; }
  function renderQ12Problem(payload) {
    const panelGap = 145, startX = 20, states = [{ width: 110, height: 110, triangle: false }];
    payload.folds.forEach((fold) => {
      const previous = states[states.length - 1], next = { ...previous };
      if (fold.axis === "vertical") next.width /= 2;
      else if (fold.axis === "horizontal") next.height /= 2;
      else next.triangle = true;
      states.push(next);
    });
    function paper(state, x, punched) {
      const y = 70 + (110 - state.height) / 2, left = x + (110 - state.width) / 2;
      const shape = state.triangle
        ? `<path d="M${left} ${y + state.height}L${left + state.width} ${y + state.height}L${left} ${y}Z" fill="#fff8ed" stroke="#806a59" stroke-width="2.5"/>`
        : `<rect x="${left}" y="${y}" width="${state.width}" height="${state.height}" fill="#fff8ed" stroke="#806a59" stroke-width="2.5"/>`;
      if (!punched) return shape;
      const holes = Array.from({ length: payload.punchCount }, (_, index) => {
        const ratio = payload.punchCount === 1 ? 0.5 : 0.34 + index * 0.30;
        const cx = left + state.width * (state.triangle ? Math.min(ratio, 0.58) : ratio);
        const cy = y + state.height * (state.triangle ? 0.72 + index * 0.08 : 0.5);
        return `<circle cx="${cx}" cy="${cy}" r="${Math.max(4, Math.min(7, state.width / 9))}" fill="#fff" stroke="#a76545" stroke-width="3"/>`;
      }).join("");
      return shape + holes;
    }
    let panels = paper(states[0], startX, false) + `<path d="M${startX + 55} 70V180M${startX} 125H${startX + 110}M${startX} 70L${startX + 110} 180" stroke="#b79b84" stroke-dasharray="6 5"/>`;
    payload.folds.forEach((fold, index) => {
      const x = startX + (index + 1) * panelGap;
      panels += `<path d="M${x - 31} 125H${x - 8}" stroke="#8e9894" stroke-width="4" marker-end="url(#q12a)"/>${paper(states[index + 1], x, false)}<text x="${x + 55}" y="210" text-anchor="middle" font-size="12" font-weight="800" fill="#66554a">${index + 1}. ${svgText(fold.label)}</text>`;
    });
    const finalX = startX + (payload.folds.length + 1) * panelGap;
    const viewWidth = Math.max(620, finalX + 130), finalState = states[states.length - 1];
    return `<svg class="hf-reasoning hf-hole-fold" viewBox="0 0 ${viewWidth} 250" role="img" aria-label="색종이를 접어 구멍을 뚫는 그림"><defs><marker id="q12a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10Z" fill="#a76545"/></marker></defs><rect width="100%" height="250" rx="18" fill="#fff"/>${panels}<path d="M${finalX - 31} 125H${finalX - 8}" stroke="#8e9894" stroke-width="4" marker-end="url(#q12a)"/>${paper(finalState, finalX, true)}<text x="${finalX + 55}" y="210" text-anchor="middle" font-size="12" font-weight="800" fill="#66554a">구멍 ${payload.punchCount}개</text><text x="${viewWidth / 2}" y="235" text-anchor="middle" font-size="14" font-weight="850" fill="#59636a">접힌 선 위가 아닌 곳에 구멍을 뚫었습니다.</text></svg>`;
  }
  function renderQ12Answer(payload) {
    return `정답: ${payload.answer}개 — ${payload.folds.length}번 접으면 한 구멍이 ${2 ** payload.folds.length}개로 늘어납니다. ${payload.punchCount}×${2 ** payload.folds.length}=${payload.answer}입니다.`;
  }

  global.HFQ10 = { generateQ10, validateQ10, enumerateQ10AnswerCandidates, renderQ10Problem, deriveQ10Answer, renderQ10Answer };
  global.HFQ11 = { generateQ11, validateQ11, enumerateQ11AnswerCandidates, renderQ11Problem, deriveQ11Answer, renderQ11Answer, visibleCells: q11VisibleCells };
  global.HFQ12 = { generateQ12, validateQ12, enumerateQ12AnswerCandidates, renderQ12Problem, deriveQ12Answer, renderQ12Answer, unfoldPoints };
})(typeof window !== "undefined" ? window : globalThis);
