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

  const Q21_SPEC={easy:{digits:3,min:1,max:5,conditionCount:3},same:{digits:4,min:2,max:6,conditionCount:4},hard:{digits:4,min:3,max:7,conditionCount:5}};
  function q21Candidates(payload){const start=10**(payload.digitCount-1),end=10**payload.digitCount,answers=[];for(let n=start;n<end;n+=1){const ds=String(n).split("").map(Number),extraOk=!payload.extraSum||ds[payload.extraSum.indices[0]]+ds[payload.extraSum.indices[1]]===payload.extraSum.value;if(ds[0]===payload.first&&payload.deltas.every((delta,index)=>ds[index+1]===ds[index]+delta)&&extraOk)answers.push(n);}return answers;}
  function generateQ21(difficulty,seed){const spec=Q21_SPEC[difficulty]||Q21_SPEC.same,rng=makeRng(seed);for(let attempt=0;attempt<500;attempt+=1){const first=rng.int(spec.min,spec.max),deltas=[],digits=[first];for(let i=1;i<spec.digits;i+=1){const allowed=[-3,-2,-1,1,2,3].filter((d)=>digits[i-1]+d>=0&&digits[i-1]+d<=9);const delta=rng.pick(allowed);deltas.push(delta);digits.push(digits[i-1]+delta);}const extraSum=difficulty==="hard"?{indices:[0,spec.digits-1],value:digits[0]+digits[spec.digits-1]}:null,payload={digitCount:spec.digits,first,deltas,digits,extraSum,answer:Number(digits.join("")),difficulty,seed:Number(seed)||1};if(q21Candidates(payload).length===1)return payload;}throw new Error('q21 생성 실패');}
  function enumerateQ21AnswerCandidates(payload){return payload?[...q21Candidates(payload)]:[];}
  function deriveQ21Answer(payload){return payload.answer;}
  function validateQ21(payload){const spec=Q21_SPEC[payload&&payload.difficulty],c=enumerateQ21AnswerCandidates(payload),conditionCount=1+payload.deltas.length+(payload.extraSum?1:0);return Boolean(spec&&payload.digitCount===spec.digits&&conditionCount===spec.conditionCount&&c.length===1&&c[0]===payload.answer);}
  function q21ConditionText(payload){const names=payload.digitCount===3?["백","십","일"]:["천","백","십","일"],rows=[`${names[0]}의 자리 숫자는 ${payload.first}입니다.`];payload.deltas.forEach((d,i)=>rows.push(`${names[i+1]}의 자리 숫자는 ${names[i]}의 자리보다 ${Math.abs(d)} ${d>0?'큽니다':'작습니다'}.`));if(payload.extraSum)rows.push(`${names[payload.extraSum.indices[0]]}의 자리와 ${names[payload.extraSum.indices[1]]}의 자리 숫자의 합은 ${payload.extraSum.value}입니다.`);return rows;}
  function renderQ21Problem(payload){const rows=q21ConditionText(payload),height=90+rows.length*35,rowSvg=rows.map((t,i)=>`<text x="58" y="${72+i*34}" font-size="${rows.length>4?17:19}" font-weight="850" fill="#273746">${i+1}. ${t}</text>`).join("");return `<svg class="hf-reasoning hf-place-value" viewBox="0 0 680 ${height}" role="img" aria-label="자리 조건"><rect width="680" height="${height}" rx="18" fill="#fff"/><text x="340" y="35" text-anchor="middle" font-size="18" font-weight="900" fill="#8f5b43">조건을 모두 만족하는 ${payload.digitCount}자리 수</text>${rowSvg}</svg>`;}
  function renderQ21Answer(payload){return `정답: ${payload.answer} — ${q21ConditionText(payload).join(" ")}`;}

  function parseEquationQ22(eq){const m=eq.match(/^(\d+)-(\d+)=(\d+)$/);if(!m)return null;const nums=m.slice(1);if(nums.some((s)=>s.length>1&&s[0]==="0"))return null;return{a:Number(nums[0]),b:Number(nums[1]),c:Number(nums[2]),valid:Number(nums[0])-Number(nums[1])===Number(nums[2])};}
  function q22SwapCandidates(payload){const chars=payload.originalEquation.split(""),positions=chars.map((ch,i)=>/\d/.test(ch)?i:-1).filter((i)=>i>=0),out=[];for(let a=0;a<positions.length;a+=1)for(let b=a+1;b<positions.length;b+=1){const copy=chars.slice(),i=positions[a],j=positions[b];if(copy[i]===copy[j])continue;[copy[i],copy[j]]=[copy[j],copy[i]];const eq=copy.join(""),parsed=parseEquationQ22(eq);if(parsed&&parsed.valid)out.push(eq);}return out;}
  const Q22_SPEC={easy:{digits:2,min:20,max:60},same:{digits:2,min:40,max:90},hard:{digits:3,min:120,max:500}};
  function generateQ22(difficulty,seed){const spec=Q22_SPEC[difficulty]||Q22_SPEC.same,rng=makeRng(seed);for(let attempt=0;attempt<5000;attempt+=1){const a=rng.int(spec.min,spec.max),b=rng.int(Math.max(10,Math.floor(spec.min/3)),a-1),c=a-b,correct=`${a}-${b}=${c}`,chars=correct.split(""),pos=chars.map((ch,i)=>/\d/.test(ch)?i:-1).filter((i)=>i>=0),i=rng.pick(pos),j=rng.pick(pos.filter((p)=>p!==i&&chars[p]!==chars[i]));if(j===undefined)continue;[chars[i],chars[j]]=[chars[j],chars[i]];const original=chars.join("");if(parseEquationQ22(original)?.valid)continue;const payload={originalEquation:original,correctEquation:correct,difficulty,seed:Number(seed)||1};const candidates=q22SwapCandidates(payload);if(candidates.length===1&&candidates[0]===correct)return payload;}throw new Error(`q22 ${difficulty} 생성 실패`);}
  function enumerateQ22AnswerCandidates(payload){return payload?q22SwapCandidates(payload):[];}
  function deriveQ22Answer(payload){return payload.correctEquation;}
  function validateQ22(payload){const c=enumerateQ22AnswerCandidates(payload);return c.length===1&&c[0]===payload.correctEquation&&!parseEquationQ22(payload.originalEquation)?.valid;}
  function renderQ22Problem(payload){return `<svg class="hf-reasoning hf-swap-equation" viewBox="0 0 680 210" role="img" aria-label="숫자 두 개를 바꾸는 식"><rect width="680" height="210" rx="18" fill="#fff"/><text x="340" y="55" text-anchor="middle" font-size="18" font-weight="850" fill="#59636a">숫자 두 개의 자리를 서로 바꾸세요.</text><rect x="145" y="82" width="390" height="78" rx="14" fill="#fff8e9" stroke="#b89b54" stroke-width="2"/><text x="340" y="135" text-anchor="middle" font-size="36" font-weight="950" fill="#243746">${payload.originalEquation}</text></svg>`;}
  function renderQ22Answer(payload){return `정답: ${payload.correctEquation} — 숫자 두 개만 서로 바꾸면 계산이 맞습니다.`;}

  function q23Expressions(tokens,allowedOps){const ops=allowedOps||["+","-",""],out=[];function build(index,current){if(index===tokens.length-1){const parts=[String(tokens[0])];for(let i=0;i<current.length;i+=1)parts.push(current[i],String(tokens[i+1]));const expr=parts.join(""),terms=expr.match(/[+-]?\d+/g)||[],value=terms.reduce((s,t)=>s+Number(t),0);out.push({ops:current.slice(),expression:expr,value});return;}ops.forEach((op)=>build(index+1,[...current,op]));}build(0,[]);return out;}
  const Q23_SPEC={easy:{count:4,min:1,max:6,solutions:[1,3],ops:["+",""]},same:{count:5,min:1,max:7,solutions:[1,5],ops:["+","-",""]},hard:{count:6,min:0,max:8,solutions:[2,10],ops:["+","-",""]}};
  function generateQ23(difficulty,seed){const spec=Q23_SPEC[difficulty]||Q23_SPEC.same,rng=makeRng(seed);for(let attempt=0;attempt<4000;attempt+=1){const tokens=Array.from({length:spec.count},()=>rng.int(spec.min,spec.max)),all=q23Expressions(tokens,spec.ops),positive=all.filter((row)=>row.value>=0&&row.value<=199),target=rng.pick(positive).value,valid=all.filter((row)=>row.value===target);if(valid.length>=spec.solutions[0]&&valid.length<=spec.solutions[1])return{tokens,target,allowedOps:spec.ops,validExpressions:valid.map((r)=>r.expression),answer:valid.length,difficulty,seed:Number(seed)||1};}throw new Error(`q23 ${difficulty} 생성 실패`);}
  function enumerateQ23AnswerCandidates(payload){if(!payload)return[];return[q23Expressions(payload.tokens,payload.allowedOps).filter((row)=>row.value===payload.target).length];}
  function deriveQ23Answer(payload){return payload.answer;}
  function validateQ23(payload){const spec=Q23_SPEC[payload&&payload.difficulty],c=enumerateQ23AnswerCandidates(payload);return Boolean(spec&&payload.tokens.length===spec.count&&JSON.stringify(payload.allowedOps)===JSON.stringify(spec.ops)&&payload.target>=0&&c.length===1&&c[0]===payload.answer&&payload.answer>=spec.solutions[0]&&payload.answer<=spec.solutions[1]);}
  function renderQ23Problem(payload){const slots=payload.tokens.map((n,i)=>`${i?'<tspan fill="#9b6a3f"> □ </tspan>':''}<tspan>${n}</tspan>`).join(""),rule=payload.allowedOps.includes("-")?"빈칸에는 +, -, 또는 아무것도 쓰지 않습니다.":"빈칸에는 + 또는 아무것도 쓰지 않습니다.";return `<svg class="hf-reasoning hf-operator-slots" viewBox="0 0 680 220" role="img" aria-label="숫자 사이에 기호 넣기"><rect width="680" height="220" rx="18" fill="#fff"/><text x="340" y="55" text-anchor="middle" font-size="18" font-weight="850" fill="#59636a">${rule}</text><text x="340" y="125" text-anchor="middle" font-size="${payload.tokens.length>5?27:31}" font-weight="950" fill="#243746">${slots} = ${payload.target}</text><text x="340" y="182" text-anchor="middle" font-size="15" font-weight="850" fill="#59636a">아무것도 쓰지 않으면 두 숫자를 이어 한 수로 봅니다.</text></svg>`;}
  function renderQ23Answer(payload){return `정답: ${payload.answer}가지 — ${payload.validExpressions.map((e)=>`${e}=${payload.target}`).join(", ")}입니다.`;}

  const Q24_SPEC={easy:{count:5,min:1,max:9,consecutive:true},same:{count:9,min:1,max:12},hard:{count:10,min:2,max:15}};
  function q24Candidates(payload){const total=payload.numbers.reduce((a,b)=>a+b,0),out=[];for(let i=1;i<payload.numbers.length;i+=1)if(total-2*payload.numbers[i]===payload.target)out.push(payload.numbers[i]);return out;}
  function generateQ24(difficulty,seed){const spec=Q24_SPEC[difficulty]||Q24_SPEC.same,rng=makeRng(seed);for(let attempt=0;attempt<500;attempt+=1){const start=spec.consecutive?rng.int(1,5):0,numbers=spec.consecutive?Array.from({length:spec.count},(_,i)=>start+i):[...new Set(Array.from({length:spec.count*4},()=>rng.int(spec.min,spec.max)))].slice(0,spec.count);if(numbers.length!==spec.count)continue;const index=rng.int(1,numbers.length-1),target=numbers.reduce((a,b)=>a+b,0)-2*numbers[index],payload={numbers,target,changedNumber:numbers[index],difficulty,seed:Number(seed)||1};if(q24Candidates(payload).length===1)return payload;}throw new Error('q24 생성 실패');}
  function enumerateQ24AnswerCandidates(payload){return payload?q24Candidates(payload):[];}
  function deriveQ24Answer(payload){return payload.changedNumber;}
  function validateQ24(payload){const spec=Q24_SPEC[payload&&payload.difficulty],c=enumerateQ24AnswerCandidates(payload),consecutive=!spec.consecutive||payload.numbers.every((n,i)=>i===0||n===payload.numbers[i-1]+1);return Boolean(spec&&payload.numbers.length===spec.count&&consecutive&&c.length===1&&c[0]===payload.changedNumber);}
  function renderQ24Problem(payload){const expr=payload.numbers.join(" + ");return `<svg class="hf-reasoning hf-change-sign" viewBox="0 0 680 210" role="img" aria-label="더하기 하나를 빼기로 바꾸는 식"><rect width="680" height="210" rx="18" fill="#fff"/><text x="340" y="55" text-anchor="middle" font-size="18" font-weight="850" fill="#59636a">+ 하나에 동그라미 하고 -로 바꾸세요.</text><text x="340" y="125" text-anchor="middle" font-size="${payload.numbers.length>9?19:payload.numbers.length>6?21:28}" font-weight="950" fill="#243746">${expr} = ${payload.target}</text></svg>`;}
  function renderQ24Answer(payload){return `정답: ${payload.changedNumber} 앞의 + — 전체 합에서 ${payload.changedNumber}를 두 번 빼면 ${payload.target}이 됩니다.`;}

  const Q25_SPEC={easy:{length:2,conditionCount:2},same:{length:3,conditionCount:2},hard:{length:4,conditionCount:3}};
  function q25ConditionPass(condition,digit){const box=10*digit+condition.ones;return condition.boxSide==="left"?box>condition.constant:condition.constant>box;}
  function q25ConditionText(condition){const box=`□${condition.ones}`;return condition.boxSide==="left"?`${box} > ${condition.constant}`:`${condition.constant} > ${box}`;}
  function q25Digits(payload){return payload.domain.filter((digit)=>payload.conditions.every((condition)=>q25ConditionPass(condition,digit)));}
  function generateQ25(difficulty,seed){const spec=Q25_SPEC[difficulty]||Q25_SPEC.same,rng=makeRng(seed),domain=difficulty==="hard"?Array.from({length:10},(_,i)=>i):difficulty==="easy"?Array.from({length:5},(_,i)=>i+1):Array.from({length:9},(_,i)=>i+1),minDigit=domain[0],maxDigit=domain[domain.length-1],low=rng.int(minDigit,maxDigit-spec.length+1),high=low+spec.length-1,lowerOnes=rng.int(2,8),upperOnes=rng.int(1,7),conditions=[{boxSide:"left",ones:lowerOnes,constant:10*low+lowerOnes-1},{boxSide:"right",ones:upperOnes,constant:10*(high+1)+upperOnes-1}];if(spec.conditionCount===3){const ones=upperOnes===8?2:upperOnes+1;conditions.push({boxSide:"right",ones,constant:10*(high+1)+ones-1});}const digits=domain.filter((digit)=>conditions.every((condition)=>q25ConditionPass(condition,digit)));return{domain,conditions,digits,answer:digits.reduce((a,b)=>a+b,0),difficulty,seed:Number(seed)||1};}
  function enumerateQ25AnswerCandidates(payload){if(!payload)return[];const digits=q25Digits(payload);return[digits.reduce((a,b)=>a+b,0)];}
  function deriveQ25Answer(payload){return payload.answer;}
  function validateQ25(payload){const spec=Q25_SPEC[payload&&payload.difficulty],c=enumerateQ25AnswerCandidates(payload);return Boolean(spec&&payload.conditions.length===spec.conditionCount&&payload.digits.length===spec.length&&JSON.stringify(q25Digits(payload))===JSON.stringify(payload.digits)&&c.length===1&&c[0]===payload.answer);}
  function renderQ25Problem(payload){const boxWidth=payload.conditions.length===3?150:210,gap=18,total=payload.conditions.length*boxWidth+(payload.conditions.length-1)*gap,start=(680-total)/2,boxes=payload.conditions.map((condition,index)=>`<rect x="${start+index*(boxWidth+gap)}" y="82" width="${boxWidth}" height="72" rx="13" fill="#f7f2e7" stroke="#b6a47a" stroke-width="2"/><text x="${start+index*(boxWidth+gap)+boxWidth/2}" y="128" text-anchor="middle" font-size="27" font-weight="950" fill="#243746">${q25ConditionText(condition)}</text>`).join(""),range=`${payload.domain[0]}부터 ${payload.domain[payload.domain.length-1]}까지`;return `<svg class="hf-reasoning hf-common-digits" viewBox="0 0 680 220" role="img" aria-label="비교식의 두 조건에 공통인 숫자"><rect width="680" height="220" rx="18" fill="#fff"/><text x="340" y="48" text-anchor="middle" font-size="18" font-weight="850" fill="#59636a">${range} 중 모든 □에 공통으로 들어갈 숫자</text>${boxes}<text x="340" y="198" text-anchor="middle" font-size="16" font-weight="850" fill="#8f5b43">공통 숫자를 모두 더하세요.</text></svg>`;}
  function renderQ25Answer(payload){return `정답: ${payload.answer} — 공통 숫자는 ${payload.digits.join(", ")}이고, 모두 더하면 ${payload.answer}입니다.`;}

  function q26EdgeKey(x1,y1,x2,y2){const a=[x1,y1],b=[x2,y2],ordered=a[0]<b[0]||(a[0]===b[0]&&a[1]<b[1])?[a,b]:[b,a];return `${ordered[0].join(",")}-${ordered[1].join(",")}`;}
  function q26SquareEdges(x,y){return[q26EdgeKey(x,y,x+1,y),q26EdgeKey(x+1,y,x+1,y+1),q26EdgeKey(x,y+1,x+1,y+1),q26EdgeKey(x,y,x,y+1)];}
  function q26Combinations(values,count){const out=[];function visit(start,chosen){if(chosen.length===count){out.push(chosen.slice());return;}for(let i=start;i<=values.length-(count-chosen.length);i+=1)visit(i+1,[...chosen,values[i]]);}visit(0,[]);return out;}
  function q26TargetLayouts(grid){const cells=[];for(let y=0;y<grid.height;y+=1)for(let x=0;x<grid.width;x+=1)cells.push([x,y]);return q26Combinations(cells,3).filter((squares)=>{for(let a=0;a<squares.length;a+=1)for(let b=a+1;b<squares.length;b+=1)if(Math.abs(squares[a][0]-squares[b][0])+Math.abs(squares[a][1]-squares[b][1])===1)return false;return new Set(squares.flatMap(([x,y])=>q26SquareEdges(x,y))).size===12;});}
  function q26AllGridEdges(grid){const out=[];for(let y=0;y<=grid.height;y+=1)for(let x=0;x<grid.width;x+=1)out.push(q26EdgeKey(x,y,x+1,y));for(let x=0;x<=grid.width;x+=1)for(let y=0;y<grid.height;y+=1)out.push(q26EdgeKey(x,y,x,y+1));return out;}
  function q26ReachableTargets(payload){const initial=new Set(payload.initialEdges);return q26TargetLayouts(payload.grid).filter((squares)=>{const target=new Set(squares.flatMap(([x,y])=>q26SquareEdges(x,y))),removed=[...initial].filter((edge)=>!target.has(edge)).length,added=[...target].filter((edge)=>!initial.has(edge)).length;return removed===payload.moveCount&&added===payload.moveCount;});}
  function q26Sample(values,count,rng){const copy=values.slice(),out=[];while(out.length<count&&copy.length){const index=rng.int(0,copy.length-1);out.push(copy.splice(index,1)[0]);}return out;}
  const Q26_SPEC={easy:{grid:{width:3,height:2},moveCount:2},same:{grid:{width:4,height:3},moveCount:3},hard:{grid:{width:5,height:4},moveCount:3}};
  function generateQ26(difficulty,seed){const spec=Q26_SPEC[difficulty]||Q26_SPEC.same,rng=makeRng(seed),layouts=q26TargetLayouts(spec.grid),universe=q26AllGridEdges(spec.grid);for(let attempt=0;attempt<5000;attempt+=1){const targetSquares=rng.pick(layouts),targetEdges=[...new Set(targetSquares.flatMap(([x,y])=>q26SquareEdges(x,y)))],movedFrom=q26Sample(targetEdges,spec.moveCount,rng),outside=universe.filter((edge)=>!targetEdges.includes(edge)),movedTo=q26Sample(outside,spec.moveCount,rng),initialEdges=targetEdges.filter((edge)=>!movedFrom.includes(edge)).concat(movedTo).sort(),payload={grid:{...spec.grid},moveCount:spec.moveCount,initialEdges,targetSquares,targetEdges:targetEdges.slice().sort(),movedFrom:movedTo.slice().sort(),movedTo:movedFrom.slice().sort(),difficulty,seed:Number(seed)||1};const candidates=q26ReachableTargets(payload);if(candidates.length===1&&JSON.stringify(candidates[0])===JSON.stringify(targetSquares))return payload;}throw new Error(`q26 ${difficulty} 생성 실패`);}
  function enumerateQ26AnswerCandidates(payload){return payload?q26ReachableTargets(payload):[];}
  function deriveQ26Answer(payload){return payload.targetSquares;}
  function validateQ26(payload){const spec=Q26_SPEC[payload&&payload.difficulty],c=enumerateQ26AnswerCandidates(payload);if(!spec||payload.grid.width!==spec.grid.width||payload.grid.height!==spec.grid.height||payload.moveCount!==spec.moveCount||payload.initialEdges.length!==12||new Set(payload.initialEdges).size!==12||c.length!==1)return false;const target=new Set(c[0].flatMap(([x,y])=>q26SquareEdges(x,y))),initial=new Set(payload.initialEdges);return JSON.stringify(c[0])===JSON.stringify(payload.targetSquares)&&[...initial].filter((edge)=>!target.has(edge)).length===payload.moveCount&&[...target].filter((edge)=>!initial.has(edge)).length===payload.moveCount;}
  function q26EdgeCoords(edge){return edge.split("-").map((point)=>point.split(",").map(Number));}
  function renderQ26Problem(payload){const cell=Math.min(80,410/Math.max(payload.grid.width,payload.grid.height)),ox=(680-payload.grid.width*cell)/2,oy=42,points=Array.from({length:(payload.grid.width+1)*(payload.grid.height+1)},(_,index)=>{const x=index%(payload.grid.width+1),y=Math.floor(index/(payload.grid.width+1));return `<circle cx="${ox+x*cell}" cy="${oy+y*cell}" r="3" fill="#c7d0d8"/>`;}).join(""),lines=payload.initialEdges.map((edge)=>{const[[x1,y1],[x2,y2]]=q26EdgeCoords(edge);return `<line x1="${ox+x1*cell}" y1="${oy+y1*cell}" x2="${ox+x2*cell}" y2="${oy+y2*cell}" stroke="#9a5c36" stroke-width="9" stroke-linecap="round"/><circle cx="${ox+x1*cell}" cy="${oy+y1*cell}" r="5" fill="#d74b37"/><circle cx="${ox+x2*cell}" cy="${oy+y2*cell}" r="5" fill="#d74b37"/>`;}).join("");const height=oy+payload.grid.height*cell+62;return `<svg class="hf-reasoning hf-matchsticks" viewBox="0 0 680 ${height}" role="img" aria-label="점 격자 안의 성냥개비 옮기기"><rect width="680" height="${height}" rx="18" fill="#fff"/>${points}${lines}<text x="340" y="${height-22}" text-anchor="middle" font-size="16" font-weight="900" fill="#59636a">연한 점 자리에만 성냥개비 ${payload.moveCount}개를 옮겨 정사각형 3개 만들기</text></svg>`;}
  function renderQ26Answer(payload){const cells=payload.targetSquares.map(([x,y])=>`(${x+1}열, ${y+1}행)`).join(", ");return `정답: ${cells}에 정사각형을 만듭니다. 남는 성냥개비 ${payload.moveCount}개를 부족한 변 ${payload.moveCount}곳으로 옮깁니다.`;}

  const Q27_IDS=["TL","TR","R","BR","BL","L","C"],Q27_RING=["TL","TR","R","BR","BL","L"],Q27_ADJ={TL:["TR","L","C"],TR:["TL","R","C"],R:["TR","BR","C"],BR:["R","BL","C"],BL:["BR","L","C"],L:["BL","TL","C"],C:["TL","TR","R","BR","BL","L"]};
  function q27AllPaths(){const out=[];function walk(path,used){if(path.length===Q27_IDS.length){out.push(path.slice());return;}for(const next of Q27_ADJ[path[path.length-1]])if(!used.has(next)){used.add(next);walk([...path,next],used);used.delete(next);}}for(const start of Q27_IDS)walk([start],new Set([start]));return out;}
  const Q27_PATHS=q27AllPaths();
  function q27Evaluate(expression){let match=expression.match(/^(\d+)([+-])(\d+)=(\d+)$/);if(match){const left=match[2]==="+"?Number(match[1])+Number(match[3]):Number(match[1])-Number(match[3]);return left===Number(match[4])?Number(match[4]):null;}match=expression.match(/^(\d+)([+-])(\d+)([+-])(\d+)=(\d+)$/);if(!match)return null;let value=match[2]==="+"?Number(match[1])+Number(match[3]):Number(match[1])-Number(match[3]);value=match[4]==="+"?value+Number(match[5]):value-Number(match[5]);return value===Number(match[6])?Number(match[6]):null;}
  function q27BoardSolutions(board){const out=[];for(const path of Q27_PATHS){const expression=path.map((id)=>board.cells[id]).join(""),result=q27Evaluate(expression);if(result!==null)out.push({path,expression,result});}return out;}
  const Q27_SPEC={easy:{operations:[1,1,1],singleMode:"subtract"},same:{operations:[1,1,1],singleMode:"mixed"},hard:{operations:[2,2,2],singleMode:"mixed"}};
  function q27ExpressionTokens(operationCount,rng,singleMode){if(operationCount===1){const usePlus=singleMode==="mixed"&&rng.next()<.5;if(usePlus){for(let tries=0;tries<100;tries+=1){const a=rng.int(11,40),b=rng.int(1,9),result=a+b;if(result<=49)return String(a).split("").concat("+",String(b),"=",String(result).split(""));}}for(let tries=0;tries<100;tries+=1){const b=rng.int(11,88),result=rng.int(1,9),a=b+result;if(a<=98)return String(a).split("").concat("-",String(b).split(""),"=",String(result));}}for(let tries=0;tries<100;tries+=1){const a=rng.int(2,9),b=rng.int(1,9),c=rng.int(1,9),first=rng.pick(["+","-"]),second=rng.pick(["+","-"]);let value=first==="+"?a+b:a-b;value=second==="+"?value+c:value-c;if(value>=1&&value<=9)return[String(a),first,String(b),second,String(c),"=",String(value)];}return["8","+","4","-","5","=","7"];}
  function generateQ27Board(operationCount,rng,usedResults,singleMode){for(let attempt=0;attempt<5000;attempt+=1){const tokens=q27ExpressionTokens(operationCount,rng,singleMode),result=q27Evaluate(tokens.join(""));if(result===null||usedResults.has(result))continue;const path=rng.pick(Q27_PATHS),cells={};path.forEach((id,index)=>{cells[id]=tokens[index];});const board={cells},solutions=q27BoardSolutions(board);if(solutions.length===1&&JSON.stringify(solutions[0].path)===JSON.stringify(path)){usedResults.add(result);return{cells,solution:solutions[0]};}}throw new Error("q27 벌집 생성 실패");}
  function generateQ27(difficulty,seed){const spec=Q27_SPEC[difficulty]||Q27_SPEC.same,rng=makeRng(seed),usedResults=new Set(),boards=spec.operations.map((count,index)=>({boardId:index+1,...generateQ27Board(count,rng,usedResults,spec.singleMode)})),answer=boards.map((board)=>board.solution.result);return{boards,answer,difficulty,seed:Number(seed)||1};}
  function enumerateQ27AnswerCandidates(payload){if(!payload||!Array.isArray(payload.boards))return[];const solutions=payload.boards.map(q27BoardSolutions);return solutions.every((rows)=>rows.length===1)?[solutions.map((rows)=>rows[0].result)]:[];}
  function deriveQ27Answer(payload){return payload.answer;}
  function validateQ27(payload){const spec=Q27_SPEC[payload&&payload.difficulty],c=enumerateQ27AnswerCandidates(payload);if(!spec||payload.boards.length!==3||c.length!==1||JSON.stringify(c[0])!==JSON.stringify(payload.answer)||new Set(payload.answer).size!==3)return false;return payload.boards.every((board,index)=>q27BoardSolutions(board).length===1&&q27BoardSolutions(board)[0].expression===board.solution.expression&&((board.solution.expression.match(/[+-]/g)||[]).length===spec.operations[index]));}
  function q27HexPoints(cx,cy,r){return Array.from({length:6},(_,i)=>{const a=(Math.PI/180)*(60*i-30);return`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");}
  function renderQ27Problem(payload){const centers={C:[0,0],TL:[-30,-52],TR:[30,-52],R:[60,0],BR:[30,52],BL:[-30,52],L:[-60,0]},groups=payload.boards.map((board,index)=>{const ox=120+index*220,oy=116,cells=Q27_IDS.map((id)=>{const[x,y]=centers[id];return `<polygon points="${q27HexPoints(ox+x,oy+y,34)}" fill="${id==="C"?'#fff4cf':'#f8fafb'}" stroke="#53636f" stroke-width="2"/><text x="${ox+x}" y="${oy+y+7}" text-anchor="middle" font-size="25" font-weight="950" fill="#243746">${svgText(board.cells[id])}</text>`;}).join("");return `<text x="${ox}" y="24" text-anchor="middle" font-size="16" font-weight="900" fill="#8f5b43">${index+1}번</text>${cells}`;}).join("");return `<svg class="hf-reasoning hf-honeycomb" viewBox="0 0 680 240" role="img" aria-label="벌집 수 배열에서 식 만들기"><rect width="680" height="240" rx="18" fill="#fff"/>${groups}<text x="340" y="224" text-anchor="middle" font-size="15" font-weight="850" fill="#59636a">이웃한 칸만 따라 모든 칸을 한 번씩 지나 옳은 식을 만드세요.</text></svg>`;}
  function renderQ27Answer(payload){return `정답: ${payload.answer.join(", ")} — ${payload.boards.map((board,index)=>`${index+1}번 ${board.solution.expression}`).join(", ")}입니다.`;}

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
  global.HFQ21 = { generateQ21, validateQ21, enumerateQ21AnswerCandidates, renderQ21Problem, deriveQ21Answer, renderQ21Answer };
  global.HFQ22 = { generateQ22, validateQ22, enumerateQ22AnswerCandidates, renderQ22Problem, deriveQ22Answer, renderQ22Answer };
  global.HFQ23 = { generateQ23, validateQ23, enumerateQ23AnswerCandidates, renderQ23Problem, deriveQ23Answer, renderQ23Answer };
  global.HFQ24 = { generateQ24, validateQ24, enumerateQ24AnswerCandidates, renderQ24Problem, deriveQ24Answer, renderQ24Answer };
  global.HFQ25 = { generateQ25, validateQ25, enumerateQ25AnswerCandidates, renderQ25Problem, deriveQ25Answer, renderQ25Answer };
  global.HFQ26 = { generateQ26, validateQ26, enumerateQ26AnswerCandidates, renderQ26Problem, deriveQ26Answer, renderQ26Answer };
  global.HFQ27 = { generateQ27, validateQ27, enumerateQ27AnswerCandidates, renderQ27Problem, deriveQ27Answer, renderQ27Answer };
})(typeof window !== "undefined" ? window : globalThis);
