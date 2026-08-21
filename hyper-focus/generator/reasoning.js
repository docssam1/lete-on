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

  const Q13_PIECES = {
    F: [[0,1],[1,0],[1,1],[1,2],[2,2]], I: [[0,0],[0,1],[0,2],[0,3],[0,4]],
    L: [[0,0],[1,0],[2,0],[3,0],[3,1]], P: [[0,0],[0,1],[1,0],[1,1],[2,0]],
    U: [[0,0],[0,2],[1,0],[1,1],[1,2]], V: [[0,0],[1,0],[2,0],[2,1],[2,2]]
  };
  const Q13_TEMPLATES = [
    { ids: ["F","I","L","P","V"], unused: "F", placements: [
      { pieceId:"I", cells:[[0,0],[0,1],[0,2],[0,3],[0,4]] }, { pieceId:"L", cells:[[1,0],[1,1],[1,2],[1,3],[2,3]] },
      { pieceId:"P", cells:[[2,0],[2,1],[2,2],[3,0],[3,1]] }, { pieceId:"V", cells:[[1,4],[2,4],[3,2],[3,3],[3,4]] }
    ]},
    { ids: ["F","I","L","U","V"], unused: "I", placements: [
      { pieceId:"F", cells:[[0,0],[1,0],[1,1],[1,2],[2,1]] }, { pieceId:"V", cells:[[0,1],[0,2],[0,3],[1,3],[2,3]] },
      { pieceId:"L", cells:[[0,4],[1,4],[2,4],[3,3],[3,4]] }, { pieceId:"U", cells:[[2,0],[2,2],[3,0],[3,1],[3,2]] }
    ]}
  ];
  function orientations(cells) {
    const output = new Map();
    for (const flip of [false, true]) {
      let current = cells.map(([row, col]) => [row, flip ? -col : col]);
      for (let turn = 0; turn < 4; turn += 1) {
        const minRow = Math.min(...current.map((cell) => cell[0])), minCol = Math.min(...current.map((cell) => cell[1]));
        const normalized = current.map(([row, col]) => [row - minRow, col - minCol]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        output.set(JSON.stringify(normalized), normalized);
        current = current.map(([row, col]) => [col, -row]);
      }
    }
    return [...output.values()];
  }
  function canTileQ13(pieceIds) {
    const board = new Set(Array.from({ length: 20 }, (_, index) => index)), placements = new Map();
    pieceIds.forEach((pieceId) => {
      const list = [];
      orientations(Q13_PIECES[pieceId]).forEach((shape) => {
        const height = Math.max(...shape.map((cell) => cell[0])) + 1, width = Math.max(...shape.map((cell) => cell[1])) + 1;
        for (let dr = 0; dr <= 4 - height; dr += 1) for (let dc = 0; dc <= 5 - width; dc += 1) list.push(shape.map(([row, col]) => (row + dr) * 5 + col + dc));
      });
      placements.set(pieceId, list);
    });
    function search(remaining, unused) {
      if (!remaining.size) return true;
      const first = Math.min(...remaining);
      for (const pieceId of unused) for (const placement of placements.get(pieceId)) if (placement.includes(first) && placement.every((cell) => remaining.has(cell))) {
        const next = new Set(remaining); placement.forEach((cell) => next.delete(cell));
        if (search(next, unused.filter((id) => id !== pieceId))) return true;
      }
      return false;
    }
    return search(board, pieceIds.slice());
  }
  function enumerateQ13AnswerCandidates(payload) {
    if (!payload || !Array.isArray(payload.pieceIds) || payload.pieceIds.length !== 5) return [];
    const candidates = [];
    payload.pieceIds.forEach((unused) => {
      if (canTileQ13(payload.pieceIds.filter((id) => id !== unused))) candidates.push({ usedPieceIds: payload.pieceIds.filter((id) => id !== unused).sort(), unusedPieceId: unused });
    });
    return candidates;
  }
  function generateQ13(difficulty, seed) {
    const template = Q13_TEMPLATES[Math.abs(Math.trunc(Number(seed) || 1)) % 2], guideCount = { easy: 2, same: 1, hard: 0 }[difficulty] ?? 1;
    return { pieceIds: template.ids.slice(), unusedPieceId: template.unused, solutionPlacements: template.placements, guideCount, difficulty, seed: Number(seed) || 1 };
  }
  function deriveQ13Answer(payload) { return { usedPieceIds: payload.pieceIds.filter((id) => id !== payload.unusedPieceId).sort(), unusedPieceId: payload.unusedPieceId }; }
  function validateQ13(payload) {
    const candidates = enumerateQ13AnswerCandidates(payload), answer = deriveQ13Answer(payload), expectedGuide = { easy: 2, same: 1, hard: 0 }[payload && payload.difficulty];
    return expectedGuide !== undefined && payload.guideCount === expectedGuide && candidates.length === 1 && JSON.stringify(candidates[0]) === JSON.stringify(answer);
  }
  function renderQ13Problem(payload) {
    const colors = ["#f0c7b5","#beddd4","#c8d5ea","#ead6a8"], cell = 32, bx = 35, by = 52;
    let board = "";
    for (let row = 0; row < 4; row += 1) for (let col = 0; col < 5; col += 1) board += `<rect x="${bx + col * cell}" y="${by + row * cell}" width="${cell}" height="${cell}" fill="#fff" stroke="#65717a"/>`;
    payload.solutionPlacements.slice(0, payload.guideCount).forEach((placement, index) => placement.cells.forEach(([row, col]) => {
      board += `<rect x="${bx + col * cell + 1}" y="${by + row * cell + 1}" width="${cell - 2}" height="${cell - 2}" fill="${colors[index]}"/><text x="${bx + col * cell + 16}" y="${by + row * cell + 21}" text-anchor="middle" font-size="11" font-weight="900">${placement.pieceId}</text>`;
    }));
    let pieces = "";
    payload.pieceIds.forEach((pieceId, index) => {
      const cells = Q13_PIECES[pieceId], x = 250 + index * 82, y = 72;
      cells.forEach(([row, col]) => { pieces += `<rect x="${x + col * 15}" y="${y + row * 15}" width="15" height="15" fill="#dbe4ec" stroke="#536170"/>`; });
      pieces += `<text x="${x + 28}" y="158" text-anchor="middle" font-size="15" font-weight="950" fill="#273746">${pieceId}</text>`;
    });
    return `<svg class="hf-reasoning hf-pentomino" viewBox="0 0 680 245" role="img" aria-label="펜토미노 조각으로 직사각형 채우기"><rect width="680" height="245" rx="18" fill="#fff"/>${board}${pieces}<text x="115" y="205" text-anchor="middle" font-size="13" font-weight="850" fill="#59636a">20칸 직사각형</text><text x="455" y="205" text-anchor="middle" font-size="14" font-weight="850" fill="#59636a">5조각 중 4조각만 사용</text></svg>`;
  }
  function renderQ13Answer(payload) { return `정답: ${payload.unusedPieceId}조각 — 나머지 ${payload.pieceIds.filter((id) => id !== payload.unusedPieceId).join("·")}조각으로 20칸을 빈틈없이 채울 수 있습니다.`; }

  function squareChain(sizes) {
    const occupied = new Set(); let row = 0, col = 0;
    sizes.forEach((size) => {
      for (let r = row; r < row + size; r += 1) for (let c = col; c < col + size; c += 1) occupied.add(`${r},${c}`);
      row += size; col += size - 1;
    });
    const cells = [...occupied].map((key) => key.split(",").map(Number));
    return { cells, rows: Math.max(...cells.map((cell) => cell[0])) + 1, cols: Math.max(...cells.map((cell) => cell[1])) + 1 };
  }
  const Q14_CHAINS = { easy: [[3,2],[3,2,1]], same: [[4,2,2,2],[3,2,2,1,1]], hard: [[4,3,2,1,1,1],[3,3,2,2,1,1,1]] };
  function minimumSquareCoverQ14(cells) {
    const occupied = new Set(cells.map((cell) => cell.join(","))), squares = [];
    cells.forEach(([row, col]) => {
      for (let size = 1; size <= 8; size += 1) {
        const square = [];
        for (let r = row; r < row + size; r += 1) for (let c = col; c < col + size; c += 1) square.push(`${r},${c}`);
        if (square.every((cell) => occupied.has(cell))) squares.push(square);
      }
    });
    let best = Infinity;
    function search(remaining, count) {
      if (count >= best) return;
      if (!remaining.size) { best = count; return; }
      const first = remaining.values().next().value;
      squares.filter((square) => square.includes(first) && square.every((cell) => remaining.has(cell))).sort((a,b) => b.length-a.length).forEach((square) => {
        const next = new Set(remaining); square.forEach((cell) => next.delete(cell)); search(next, count + 1);
      });
    }
    search(occupied, 0); return best;
  }
  function generateQ14(difficulty, seed) {
    const pairs = Q14_CHAINS[difficulty] || Q14_CHAINS.same, sizes = pairs[Math.abs(Math.trunc(Number(seed) || 1)) % 2], figure = squareChain(sizes);
    return { ...figure, sizes: sizes.slice(), answer: sizes.length, difficulty, seed: Number(seed) || 1 };
  }
  function enumerateQ14AnswerCandidates(payload) { return payload && Array.isArray(payload.cells) ? [minimumSquareCoverQ14(payload.cells)] : []; }
  function deriveQ14Answer(payload) { return payload.answer; }
  function validateQ14(payload) {
    const pairs = Q14_CHAINS[payload && payload.difficulty], candidates = enumerateQ14AnswerCandidates(payload);
    return Boolean(pairs && pairs.some((sizes) => JSON.stringify(sizes) === JSON.stringify(payload.sizes)) && candidates.length === 1 && candidates[0] === payload.answer);
  }
  function renderQ14Problem(payload) {
    const cell = Math.min(22, 180 / payload.rows, 260 / payload.cols), width = payload.cols * cell, height = payload.rows * cell, ox = (680 - width) / 2, oy = (230 - height) / 2;
    const cells = payload.cells.map(([row, col]) => `<rect x="${ox + col * cell}" y="${oy + row * cell}" width="${cell}" height="${cell}" fill="#f2e7cf" stroke="#6d675d" stroke-width="1" stroke-dasharray="2 2"/>`).join("");
    return `<svg class="hf-reasoning hf-square-partition" viewBox="0 0 680 230" role="img" aria-label="점선을 따라 정사각형으로 나눌 도형"><rect width="680" height="230" rx="18" fill="#fff"/>${cells}<text x="340" y="218" text-anchor="middle" font-size="13" font-weight="850" fill="#59636a">칸의 선을 따라 나누세요.</text></svg>`;
  }
  function renderQ14Answer(payload) { return `정답: ${payload.answer}개 — 큰 정사각형부터 찾으면 ${payload.sizes.map((size) => `${size}×${size}`).join(", ")} 정사각형 ${payload.answer}개로 나뉩니다.`; }

  function q15CombCells(horizontal) {
    const coarse = [];
    if (!horizontal) {
      for (let x = 0; x < 5; x += 1) coarse.push([x, 3]);
      [0, 2, 4].forEach((x) => { for (let y = 0; y < 3; y += 1) coarse.push([x, y]); });
    } else {
      for (let y = 0; y < 5; y += 1) coarse.push([0, y]);
      [0, 2, 4].forEach((y) => { for (let x = 1; x < 4; x += 1) coarse.push([x, y]); });
    }
    return coarse.flatMap(([x, y]) => [[x*2,y*2],[x*2+1,y*2],[x*2,y*2+1],[x*2+1,y*2+1]]);
  }
  function q15PieceCount(cells, cuts) {
    const occupied = new Set(cells.map((cell) => cell.join(","))), seen = new Set(); let parts = 0;
    for (const start of occupied) {
      if (seen.has(start)) continue; parts += 1; seen.add(start); const queue = [start];
      while (queue.length) {
        const [x,y] = queue.pop().split(",").map(Number);
        for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const nx=x+dx, ny=y+dy, key=`${nx},${ny}`; if (!occupied.has(key) || seen.has(key)) continue;
          const blocked = (dx===1&&cuts.includes(`V${x+1}`))||(dx===-1&&cuts.includes(`V${x}`))||(dy===1&&cuts.includes(`H${y+1}`))||(dy===-1&&cuts.includes(`H${y}`));
          if (!blocked) { seen.add(key); queue.push(key); }
        }
      }
    }
    return parts;
  }
  function q15ValidPairs(payload) {
    const output=[];
    for(let i=0;i<payload.candidates.length;i+=1)for(let j=i+1;j<payload.candidates.length;j+=1){
      const pair=[payload.candidates[i],payload.candidates[j]];
      if(q15PieceCount(payload.cells,pair.map((line)=>line.id))===payload.targetPieces)output.push({lineIds:pair.map((line)=>line.id).sort(),labels:pair.map((line)=>line.label).sort()});
    }
    return output;
  }
  const Q15_SPEC={easy:{target:5,count:4},same:{target:6,count:5},hard:{target:7,count:6}};
  function generateQ15(difficulty,seed){
    const spec=Q15_SPEC[difficulty]||Q15_SPEC.same,rng=makeRng(seed),horizontal=Math.abs(Math.trunc(Number(seed)||1))%2===1,cells=q15CombCells(horizontal);
    const all=[];for(let x=1;x<(horizontal?8:10);x+=1)all.push({id:`V${x}`,axis:"V",position:x});for(let y=1;y<(horizontal?10:8);y+=1)all.push({id:`H${y}`,axis:"H",position:y});
    for(let attempt=0;attempt<2000;attempt+=1){
      const shuffled=all.slice().sort(()=>rng.next()-.5),candidates=shuffled.slice(0,spec.count).map((line,index)=>({...line,label:"가나다라마바사"[index]}));
      const payload={horizontal,cells,candidates,targetPieces:spec.target,difficulty,seed:Number(seed)||1};const pairs=q15ValidPairs(payload);
      if(pairs.length===1){payload.answer=pairs[0];return payload;}
    }
    throw new Error(`q15 ${difficulty} 단일 정답 후보 생성 실패`);
  }
  function enumerateQ15AnswerCandidates(payload){return payload&&Array.isArray(payload.candidates)?q15ValidPairs(payload):[];}
  function deriveQ15Answer(payload){return payload.answer;}
  function validateQ15(payload){const spec=Q15_SPEC[payload&&payload.difficulty],pairs=enumerateQ15AnswerCandidates(payload);return Boolean(spec&&payload.candidates.length===spec.count&&payload.targetPieces===spec.target&&pairs.length===1&&JSON.stringify(pairs[0])===JSON.stringify(payload.answer));}
  function renderQ15Problem(payload){
    const scale=34,ox=75,oy=28,fill=payload.cells.map(([x,y])=>`<rect x="${ox+x*scale/2}" y="${oy+y*scale/2}" width="${scale/2+0.4}" height="${scale/2+0.4}" fill="#e9e0ca"/>`).join("");
    const lines=payload.candidates.map((line)=>{if(line.axis==="V"){const x=ox+line.position*scale/2;return `<path d="M${x} ${oy-10}V${oy+8*scale/2+10}" stroke="#a44f49" stroke-width="2" stroke-dasharray="7 5"/><text x="${x}" y="${oy-14}" text-anchor="middle" font-size="14" font-weight="900">${line.label}</text>`;}const y=oy+line.position*scale/2;return `<path d="M${ox-10} ${y}H${ox+10*scale/2+10}" stroke="#4e776f" stroke-width="2" stroke-dasharray="7 5"/><text x="${ox-19}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="900">${line.label}</text>`;}).join("");
    return `<svg class="hf-reasoning hf-line-partition" viewBox="0 0 680 230" role="img" aria-label="빗 모양과 후보 직선"><rect width="680" height="230" rx="18" fill="#fff"/>${fill}${lines}<text x="500" y="82" text-anchor="middle" font-size="19" font-weight="900" fill="#243746">후보 직선 ${payload.candidates.length}개</text><text x="500" y="120" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">두 선을 골라</text><text x="500" y="151" text-anchor="middle" font-size="22" font-weight="950" fill="#9a4f45">${payload.targetPieces}조각</text><text x="500" y="181" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">만드세요.</text></svg>`;
  }
  function renderQ15Answer(payload){return `정답: ${payload.answer.labels.join("선과 ")}선 — 두 선을 따라 자르면 ${payload.targetPieces}조각이 됩니다.`;}

  function q16AllEdges(size){const h=[],v=[];for(let y=0;y<=size;y+=1)for(let x=0;x<size;x+=1)h.push(`H${x},${y}`);for(let x=0;x<=size;x+=1)for(let y=0;y<size;y+=1)v.push(`V${x},${y}`);return [...h,...v];}
  function q16SquareCounts(size,edges){const set=new Set(edges),bySize={},squares=[];for(let side=1;side<=size;side+=1)for(let y=0;y<=size-side;y+=1)for(let x=0;x<=size-side;x+=1){let ok=true;for(let d=0;d<side;d+=1)ok=ok&&set.has(`H${x+d},${y}`)&&set.has(`H${x+d},${y+side}`)&&set.has(`V${x},${y+d}`)&&set.has(`V${x+side},${y+d}`);if(ok){bySize[side]=(bySize[side]||0)+1;squares.push([x,y,side]);}}return{bySize,total:squares.length,squares};}
  const Q16_SPEC={easy:{size:2,min:2,max:5,remove:[0,2]},same:{size:3,min:7,max:13,remove:[1,4]},hard:{size:4,min:15,max:28,remove:[2,7]}};
  function generateQ16(difficulty,seed){const spec=Q16_SPEC[difficulty]||Q16_SPEC.same,rng=makeRng(seed),all=q16AllEdges(spec.size);for(let attempt=0;attempt<1000;attempt+=1){const remove=rng.int(spec.remove[0],spec.remove[1]),edges=all.slice().sort(()=>rng.next()-.5).slice(remove),count=q16SquareCounts(spec.size,edges);if(count.total>=spec.min&&count.total<=spec.max)return{size:spec.size,edges,bySize:count.bySize,answer:count.total,difficulty,seed:Number(seed)||1};}throw new Error(`q16 ${difficulty} 생성 실패`);}
  function enumerateQ16AnswerCandidates(payload){return payload&&Array.isArray(payload.edges)?[q16SquareCounts(payload.size,payload.edges).total]:[];}
  function deriveQ16Answer(payload){return payload.answer;}
  function validateQ16(payload){const spec=Q16_SPEC[payload&&payload.difficulty],answers=enumerateQ16AnswerCandidates(payload);return Boolean(spec&&payload.size===spec.size&&payload.answer>=spec.min&&payload.answer<=spec.max&&answers.length===1&&answers[0]===payload.answer);}
  function renderQ16Problem(payload){const cell=42,w=payload.size*cell,ox=(680-w)/2,oy=25;const lines=payload.edges.map((edge)=>{const axis=edge[0],[a,b]=edge.slice(1).split(",").map(Number);return axis==="H"?`<path d="M${ox+a*cell} ${oy+b*cell}h${cell}"/>`:`<path d="M${ox+a*cell} ${oy+b*cell}v${cell}"/>`;}).join("");return `<svg class="hf-reasoning hf-square-grid" viewBox="0 0 680 230" role="img" aria-label="정사각형을 세는 선 그림"><rect width="680" height="230" rx="18" fill="#fff"/><g fill="none" stroke="#273746" stroke-width="3" stroke-linecap="round">${lines}</g><text x="340" y="210" text-anchor="middle" font-size="14" font-weight="850" fill="#59636a">선이 모두 이어진 정사각형만 세세요.</text></svg>`;}
  function renderQ16Answer(payload){return `정답: ${payload.answer}개 — 크기별로 ${Object.entries(payload.bySize).map(([size,count])=>`${size}칸짜리 ${count}개`).join(", ")}를 더합니다.`;}

  const Q17_TEMPLATES={easy:[{cols:1,rows:1,diamonds:1},{cols:2,rows:1,diamonds:1}],same:[{cols:2,rows:2,diamonds:1},{cols:3,rows:2,diamonds:1}],hard:[{cols:3,rows:3,diamonds:2},{cols:4,rows:3,diamonds:2}]};
  function axisGridSquareCount(cols,rows){let total=0,bySize={};for(let size=1;size<=Math.min(cols,rows);size+=1){const count=(cols-size+1)*(rows-size+1);bySize[size]=count;total+=count;}return{total,bySize};}
  function generateQ17(difficulty,seed){const templates=Q17_TEMPLATES[difficulty]||Q17_TEMPLATES.same,t=templates[Math.abs(Math.trunc(Number(seed)||1))%2],axis=axisGridSquareCount(t.cols,t.rows);return{...t,axisBySize:axis.bySize,answer:axis.total+t.diamonds,difficulty,seed:Number(seed)||1};}
  function enumerateQ17AnswerCandidates(payload){if(!payload)return[];const axis=axisGridSquareCount(payload.cols,payload.rows);return[axis.total+payload.diamonds];}
  function deriveQ17Answer(payload){return payload.answer;}
  function validateQ17(payload){const templates=Q17_TEMPLATES[payload&&payload.difficulty],answers=enumerateQ17AnswerCandidates(payload);return Boolean(templates&&templates.some((t)=>t.cols===payload.cols&&t.rows===payload.rows&&t.diamonds===payload.diamonds)&&answers.length===1&&answers[0]===payload.answer);}
  function renderQ17Problem(payload){const cell=34,w=payload.cols*cell,h=payload.rows*cell,ox=90,oy=(190-h)/2;let grid="";for(let x=0;x<=payload.cols;x+=1)grid+=`<path d="M${ox+x*cell} ${oy}V${oy+h}"/>`;for(let y=0;y<=payload.rows;y+=1)grid+=`<path d="M${ox} ${oy+y*cell}H${ox+w}"/>`;let diamonds="";for(let i=0;i<payload.diamonds;i+=1){const cx=400+i*105,cy=105,s=36;diamonds+=`<path d="M${cx} ${cy-s}L${cx+s} ${cy}L${cx} ${cy+s}L${cx-s} ${cy}Z"/>`;}
    return `<svg class="hf-reasoning hf-tilted-squares" viewBox="0 0 680 230" role="img" aria-label="반듯한 정사각형과 기울어진 정사각형"><rect width="680" height="230" rx="18" fill="#fff"/><g fill="none" stroke="#273746" stroke-width="3">${grid}${diamonds}</g><text x="340" y="214" text-anchor="middle" font-size="14" font-weight="850" fill="#59636a">떨어진 그림끼리 이어서 새 정사각형을 만들지는 않습니다.</text></svg>`;}
  function renderQ17Answer(payload){const axis=Object.entries(payload.axisBySize).map(([size,count])=>`${size}칸짜리 ${count}개`).join(", ");return `정답: ${payload.answer}개 — 반듯한 정사각형은 ${axis}, 기울어진 정사각형은 ${payload.diamonds}개입니다.`;}

  const Q18_CACHE=new Map();
  function enumeratePolycubesQ18(targetCount){
    if(Q18_CACHE.has(targetCount))return Q18_CACHE.get(targetCount);
    const directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    const parity=(p)=>{let n=0;for(let i=0;i<3;i+=1)for(let j=i+1;j<3;j+=1)if(p[i]>p[j])n+=1;return n%2?-1:1;},rotations=[];
    for(const permutation of permutations)for(const sx of[-1,1])for(const sy of[-1,1])for(const sz of[-1,1])if(parity(permutation)*sx*sy*sz===1)rotations.push({permutation,signs:[sx,sy,sz]});
    const normalized=(blocks)=>{const mins=[0,1,2].map((axis)=>Math.min(...blocks.map((b)=>b[axis])));return blocks.map((b)=>b.map((v,a)=>v-mins[a])).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);};
    const key=(blocks)=>normalized(blocks).map((b)=>b.join(",")).join(";"),canonical=(blocks)=>rotations.map((r)=>key(blocks.map((b)=>[b[r.permutation[0]]*r.signs[0],b[r.permutation[1]]*r.signs[1],b[r.permutation[2]]*r.signs[2]]))).sort()[0];
    let shapes=[[[0,0,0]]];for(let count=2;count<=targetCount;count+=1){const next=new Map();for(const shape of shapes){const occupied=new Set(shape.map((b)=>b.join(",")));for(const block of shape)for(const d of directions){const added=block.map((v,a)=>v+d[a]);if(!occupied.has(added.join(","))){const candidate=[...shape,added],id=canonical(candidate);if(!next.has(id))next.set(id,normalized(candidate));}}}shapes=[...next.values()];}
    Q18_CACHE.set(targetCount,shapes);return shapes;
  }
  const Q18_TEMPLATES={easy:[{count:2,mode:"all"},{count:3,mode:"all"}],same:[{count:4,mode:"planar"},{count:4,mode:"nonplanar"}],hard:[{count:4,mode:"all"},{count:5,mode:"planar"}]};
  function q18Filtered(count,mode){const shapes=enumeratePolycubesQ18(count);if(mode==="all")return shapes;return shapes.filter((shape)=>{const planar=[0,1,2].some((axis)=>new Set(shape.map((b)=>b[axis])).size===1);return mode==="planar"?planar:!planar;});}
  function generateQ18(difficulty,seed){const templates=Q18_TEMPLATES[difficulty]||Q18_TEMPLATES.same,t=templates[Math.abs(Math.trunc(Number(seed)||1))%2],answer=q18Filtered(t.count,t.mode).length;return{cubeCount:t.count,mode:t.mode,answer,difficulty,seed:Number(seed)||1};}
  function enumerateQ18AnswerCandidates(payload){return payload&&payload.cubeCount?[q18Filtered(payload.cubeCount,payload.mode).length]:[];}
  function deriveQ18Answer(payload){return payload.answer;}
  function validateQ18(payload){const templates=Q18_TEMPLATES[payload&&payload.difficulty],answers=enumerateQ18AnswerCandidates(payload);return Boolean(templates&&templates.some((t)=>t.count===payload.cubeCount&&t.mode===payload.mode)&&answers.length===1&&answers[0]===payload.answer);}
  function q18Cube(x,y){return `<g transform="translate(${x} ${y})"><path d="M0 12L20 0 40 12 20 24Z" fill="#f5f5f2"/><path d="M0 12L20 24V48L0 36Z" fill="#d8dde0"/><path d="M40 12L20 24V48L40 36Z" fill="#c8ced1"/><path d="M0 12L20 0 40 12V36L20 48 0 36Z" fill="none" stroke="#58636b"/></g>`;}
  function renderQ18Problem(payload){let cubes="";for(let i=0;i<payload.cubeCount;i+=1)cubes+=q18Cube(190+i*43,70+(i%2)*12);const mode={all:"모든 입체 모양",planar:"한 층에 놓이는 모양",nonplanar:"두 층 이상인 모양"}[payload.mode];return `<svg class="hf-reasoning hf-polycubes" viewBox="0 0 680 230" role="img" aria-label="쌓기나무로 서로 다른 입체 만들기"><rect width="680" height="230" rx="18" fill="#fff"/>${cubes}<text x="340" y="178" text-anchor="middle" font-size="18" font-weight="900" fill="#243746">쌓기나무 ${payload.cubeCount}개 · ${mode}</text><text x="340" y="207" text-anchor="middle" font-size="14" font-weight="850" fill="#59636a">돌려서 겹치면 같은 모양, 거울 모양은 따로 셉니다.</text></svg>`;}
  function renderQ18Answer(payload){return `정답: ${payload.answer}가지 — 쌓기나무 ${payload.cubeCount}개를 면끼리 붙여 만들고, 돌려서 같은 모양을 하나로 묶어 셉니다.`;}

  function pointSquareCountQ19(points){const set=new Set(points.map((p)=>p.join(","))),squares=new Set();for(const a of points)for(const b of points){const dx=b[0]-a[0],dy=b[1]-a[1];if(!dx&&!dy)continue;for(const sign of[-1,1]){const c=[a[0]-sign*dy,a[1]+sign*dx],d=[b[0]-sign*dy,b[1]+sign*dx];if(set.has(c.join(","))&&set.has(d.join(",")))squares.add([a,b,c,d].map((p)=>p.join(",")).sort().join("|"));}}return squares.size;}
  const Q19_TEMPLATES={easy:[{w:2,h:2,missing:[]},{w:3,h:2,missing:[]}],same:[{w:3,h:3,missing:[]},{w:3,h:3,missing:[[1,1]]}],hard:[{w:4,h:4,missing:[]},{w:4,h:4,missing:[[1,1],[2,2]]}]};
  function q19Points(t){const missing=new Set(t.missing.map((p)=>p.join(","))),points=[];for(let y=0;y<t.h;y+=1)for(let x=0;x<t.w;x+=1)if(!missing.has(`${x},${y}`))points.push([x,y]);return points;}
  function generateQ19(difficulty,seed){const templates=Q19_TEMPLATES[difficulty]||Q19_TEMPLATES.same,t=templates[Math.abs(Math.trunc(Number(seed)||1))%2],points=q19Points(t);return{width:t.w,height:t.h,missing:t.missing,points,answer:pointSquareCountQ19(points),difficulty,seed:Number(seed)||1};}
  function enumerateQ19AnswerCandidates(payload){return payload&&Array.isArray(payload.points)?[pointSquareCountQ19(payload.points)]:[];}
  function deriveQ19Answer(payload){return payload.answer;}
  function validateQ19(payload){const templates=Q19_TEMPLATES[payload&&payload.difficulty],answers=enumerateQ19AnswerCandidates(payload);return Boolean(templates&&templates.some((t)=>t.w===payload.width&&t.h===payload.height&&JSON.stringify(t.missing)===JSON.stringify(payload.missing))&&answers.length===1&&answers[0]===payload.answer);}
  function renderQ19Problem(payload){const gap=40,w=(payload.width-1)*gap,h=(payload.height-1)*gap,ox=(680-w)/2,oy=(190-h)/2,dots=payload.points.map(([x,y])=>`<circle cx="${ox+x*gap}" cy="${oy+y*gap}" r="5.5" fill="#243746"/>`).join("");return `<svg class="hf-reasoning hf-geoboard" viewBox="0 0 680 230" role="img" aria-label="점을 이어 정사각형 만들기"><rect width="680" height="230" rx="18" fill="#fff"/>${dots}<text x="340" y="214" text-anchor="middle" font-size="14" font-weight="850" fill="#59636a">점 4개를 꼭짓점으로 하는 정사각형을 셉니다.</text></svg>`;}
  function renderQ19Answer(payload){return `정답: ${payload.answer}개 — 반듯한 정사각형과 기울어진 정사각형을 좌표로 하나씩 확인합니다.`;}

  const Q20_SPEC={easy:{count:3,minValue:1,maxValue:8,minAnswer:5,maxAnswer:7},same:{count:4,minValue:2,maxValue:12,minAnswer:10,maxAnswer:15},hard:{count:5,minValue:3,maxValue:18,minAnswer:20,maxAnswer:31}};
  function q20Sums(numbers){const sums=new Set();for(let mask=1;mask<2**numbers.length;mask+=1)sums.add(numbers.reduce((sum,value,index)=>sum+(((mask>>index)&1)?value:0),0));return[...sums].sort((a,b)=>a-b);}
  function generateQ20(difficulty,seed){const spec=Q20_SPEC[difficulty]||Q20_SPEC.same,rng=makeRng(seed);for(let attempt=0;attempt<1000;attempt+=1){const numbers=[...new Set(Array.from({length:spec.count*2},()=>rng.int(spec.minValue,spec.maxValue)))].slice(0,spec.count).sort((a,b)=>a-b);if(numbers.length!==spec.count)continue;const sums=q20Sums(numbers);if(sums.length>=spec.minAnswer&&sums.length<=spec.maxAnswer)return{numbers,sums,answer:sums.length,difficulty,seed:Number(seed)||1};}throw new Error(`q20 ${difficulty} 생성 실패`);}
  function enumerateQ20AnswerCandidates(payload){return payload&&Array.isArray(payload.numbers)?[q20Sums(payload.numbers).length]:[];}
  function deriveQ20Answer(payload){return payload.answer;}
  function validateQ20(payload){const spec=Q20_SPEC[payload&&payload.difficulty],answers=enumerateQ20AnswerCandidates(payload);return Boolean(spec&&payload.numbers.length===spec.count&&payload.answer>=spec.minAnswer&&payload.answer<=spec.maxAnswer&&answers.length===1&&answers[0]===payload.answer&&JSON.stringify(q20Sums(payload.numbers))===JSON.stringify(payload.sums));}
  function renderQ20Problem(payload){const max=Math.max(...payload.numbers),colors=["#d9c496","#bcd8d0","#c7d3e8","#edc5b4","#d9c8e4"],rods=payload.numbers.map((n,i)=>{const width=70+n/max*210,y=30+i*34;return `<rect x="${(680-width)/2}" y="${y}" width="${width}" height="20" rx="8" fill="${colors[i]}" stroke="#66717a"/><text x="340" y="${y+15}" text-anchor="middle" font-size="13" font-weight="900">${n}cm</text>`;}).join("");return `<svg class="hf-reasoning hf-segment-sums" viewBox="0 0 680 ${70+payload.numbers.length*34}" role="img" aria-label="서로 다른 길이의 막대">${rods}</svg>`;}
  function renderQ20Answer(payload){return `정답: ${payload.answer}가지 — 만들 수 있는 길이는 ${payload.sums.join(", ")}cm입니다. 같은 길이는 한 번만 셉니다.`;}

  global.HFQ10 = { generateQ10, validateQ10, enumerateQ10AnswerCandidates, renderQ10Problem, deriveQ10Answer, renderQ10Answer };
  global.HFQ11 = { generateQ11, validateQ11, enumerateQ11AnswerCandidates, renderQ11Problem, deriveQ11Answer, renderQ11Answer, visibleCells: q11VisibleCells };
  global.HFQ12 = { generateQ12, validateQ12, enumerateQ12AnswerCandidates, renderQ12Problem, deriveQ12Answer, renderQ12Answer, unfoldPoints };
  global.HFQ13 = { generateQ13, validateQ13, enumerateQ13AnswerCandidates, renderQ13Problem, deriveQ13Answer, renderQ13Answer };
  global.HFQ14 = { generateQ14, validateQ14, enumerateQ14AnswerCandidates, renderQ14Problem, deriveQ14Answer, renderQ14Answer, minimumSquareCover: minimumSquareCoverQ14 };
  global.HFQ15 = { generateQ15, validateQ15, enumerateQ15AnswerCandidates, renderQ15Problem, deriveQ15Answer, renderQ15Answer };
  global.HFQ16 = { generateQ16, validateQ16, enumerateQ16AnswerCandidates, renderQ16Problem, deriveQ16Answer, renderQ16Answer };
  global.HFQ17 = { generateQ17, validateQ17, enumerateQ17AnswerCandidates, renderQ17Problem, deriveQ17Answer, renderQ17Answer };
  global.HFQ18 = { generateQ18, validateQ18, enumerateQ18AnswerCandidates, renderQ18Problem, deriveQ18Answer, renderQ18Answer, enumeratePolycubes: enumeratePolycubesQ18 };
  global.HFQ19 = { generateQ19, validateQ19, enumerateQ19AnswerCandidates, renderQ19Problem, deriveQ19Answer, renderQ19Answer, pointSquareCount: pointSquareCountQ19 };
  global.HFQ20 = { generateQ20, validateQ20, enumerateQ20AnswerCandidates, renderQ20Problem, deriveQ20Answer, renderQ20Answer };
})(typeof window !== "undefined" ? window : globalThis);
