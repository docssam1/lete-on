const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const variationDir = path.join(root, 'hyper-focus', 'data', 'variations');
const canonicalDir = path.join(root, 'hyper-focus', 'data', 'canonical');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const variations = new Map();
for (let id = 1; id <= 54; id += 1) {
  const q = String(id).padStart(2, '0');
  const canonicalPath = path.join(canonicalDir, `q${q}.json`);
  ok(fs.existsSync(canonicalPath), `q${q}: canonical missing`);
  if (fs.existsSync(canonicalPath)) readJson(canonicalPath);
  const pair = [];
  for (const suffix of ['01', '02']) {
    const file = `q${q}_var${suffix}.json`;
    const variation = readJson(path.join(variationDir, file));
    variations.set(`q${q}_var${suffix}`, variation);
    pair.push(variation);
    ok(variation.baseQuestionId === `q${q}`, `${file}: baseQuestionId mismatch`);
    ok(variation.answerValidation && variation.answerValidation.expectedAnswer !== undefined, `${file}: answer missing`);
    const mr = variation.machineReadable || {};
    for (const candidate of [mr.expectedAnswer, mr.solvingModel?.expectedAnswer, mr.countingModel?.expectedAnswer]) {
      if (candidate !== undefined) ok(same(candidate, variation.answerValidation.expectedAnswer), `${file}: machine answer mismatch`);
    }
    if (variation.problem?.prompt) {
      ok(!/[A-Za-z]{4,}\s+[A-Za-z]{3,}/.test(variation.problem.prompt), `${file}: English prompt remains`);
      const source = variation.source?.problemImage || '';
      if (source) {
        const sourcePath = path.join(root, 'hyper-focus', source.replace(/^\.\/assets\//, 'assets/'));
        ok(fs.existsSync(sourcePath), `${file}: active asset missing (${source})`);
      }
    }
  }
  ok(!same(pair[0].answerValidation.expectedAnswer, pair[1].answerValidation.expectedAnswer), `q${q}: var01/var02 answer collision`);
}

function validateQ06(name) {
  const v = variations.get(name);
  const canonical = readJson(path.join(canonicalDir, 'q06.json')).machineReadable.payload;
  const byId = new Map(canonical.choices.map(choice => [choice.choiceId, choice]));
  for (const choice of v.machineReadable.choices) {
    const source = byId.get(choice.canonicalChoiceId);
    const mapped = source.visibleColorSequence.map(color => v.machineReadable.colorSubstitutionFromCanonical[color]);
    ok(same(mapped, choice.visibleColorSequence), `${name}: choice ${choice.choiceId} color substitution mismatch`);
    ok(source.isValid === choice.isValid, `${name}: choice ${choice.choiceId} validity mismatch`);
  }
  const invalid = v.machineReadable.choices.filter(choice => !choice.isValid).map(choice => choice.choiceId);
  ok(same(invalid, v.answerValidation.expectedAnswer), `${name}: invalid-choice answer mismatch`);
}

function validateQ07(name) {
  const v = variations.get(name);
  const pairs = v.machineReadable.net.oppositeFacePairs.map(pair => new Set(pair));
  for (const choice of v.machineReadable.choices) {
    const invalid = pairs.some(pair => choice.visibleFaces.filter(face => pair.has(face)).length === 2);
    ok(choice.isValid === !invalid, `${name}: choice ${choice.choiceId} opposite-face mismatch`);
  }
  const key = v.machineReadable.expectedValidChoices ? 'expectedValidChoices' : 'expectedInvalidChoices';
  const actual = v.machineReadable.choices.filter(choice => key === 'expectedValidChoices' ? choice.isValid : !choice.isValid).map(choice => choice.choiceId);
  ok(same(actual, v.answerValidation.expectedAnswer), `${name}: option answer mismatch`);
}

function orientations(cells) {
  const output = new Map();
  for (const flip of [false, true]) {
    let current = cells.map(([r, c]) => [r, flip ? -c : c]);
    for (let turn = 0; turn < 4; turn += 1) {
      const minR = Math.min(...current.map(cell => cell[0]));
      const minC = Math.min(...current.map(cell => cell[1]));
      const normalized = current.map(([r, c]) => [r - minR, c - minC]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      output.set(JSON.stringify(normalized), normalized);
      current = current.map(([r, c]) => [c, -r]);
    }
  }
  return [...output.values()];
}

function canTile(board, pieces) {
  const cells = new Set(Array.from({ length: board.rows * board.cols }, (_, index) => index));
  const placements = new Map();
  for (const piece of pieces) {
    const list = [];
    for (const shape of orientations(piece.cells)) {
      const height = Math.max(...shape.map(cell => cell[0])) + 1;
      const width = Math.max(...shape.map(cell => cell[1])) + 1;
      for (let dr = 0; dr <= board.rows - height; dr += 1) for (let dc = 0; dc <= board.cols - width; dc += 1) {
        list.push(shape.map(([r, c]) => (r + dr) * board.cols + c + dc));
      }
    }
    placements.set(piece.pieceId, list);
  }
  function search(remaining, used) {
    if (!remaining.size) return true;
    const first = Math.min(...remaining);
    for (const piece of pieces) if (!used.has(piece.pieceId)) {
      for (const placement of placements.get(piece.pieceId)) if (placement.includes(first) && placement.every(cell => remaining.has(cell))) {
        const next = new Set(remaining); placement.forEach(cell => next.delete(cell));
        if (search(next, new Set([...used, piece.pieceId]))) return true;
      }
    }
    return false;
  }
  return search(cells, new Set());
}

function validateQ13(name) {
  const v = variations.get(name), mr = v.machineReadable, model = mr.solvingModel;
  const covered = model.solutionPlacements.flatMap(placement => placement.cells.map(cell => cell.join(',')));
  ok(covered.length === mr.board.cellCount && new Set(covered).size === mr.board.cellCount, `${name}: solution does not cover board exactly`);
  const used = [...model.usedPieceIds].sort();
  ok(same(used, model.solutionPlacements.map(p => p.pieceId).sort()), `${name}: placement piece ids mismatch`);
  const tilingSubsets = [];
  for (let omit = 0; omit < mr.pieces.length; omit += 1) {
    const subset = mr.pieces.filter((_, index) => index !== omit);
    if (canTile(mr.board, subset)) tilingSubsets.push(subset.map(piece => piece.pieceId).sort());
  }
  ok(tilingSubsets.length === 1 && same(tilingSubsets[0], used), `${name}: unused piece is not unique`);
  ok(same(v.answerValidation.expectedAnswer.usedPieceIds.slice().sort(), used), `${name}: answer used pieces mismatch`);
}

function minimumSquareCover(baseFigure) {
  const occupied = new Set(baseFigure.occupiedCells.map(cell => cell.join(',')));
  const squares = [];
  for (const [row, col] of baseFigure.occupiedCells) for (let size = 1; size <= 8; size += 1) {
    const cells = [];
    for (let r = row; r < row + size; r += 1) for (let c = col; c < col + size; c += 1) cells.push(`${r},${c}`);
    if (cells.every(cell => occupied.has(cell))) squares.push(cells);
  }
  let best = Infinity;
  function search(remaining, count) {
    if (count >= best) return;
    if (!remaining.size) { best = count; return; }
    const first = [...remaining][0];
    for (const square of squares) if (square.includes(first) && square.every(cell => remaining.has(cell))) {
      const next = new Set(remaining); square.forEach(cell => next.delete(cell)); search(next, count + 1);
    }
  }
  search(occupied, 0);
  return best;
}

function segmentSquareCount(segments) {
  const pointMap = new Map();
  for (const [a, b] of segments) { pointMap.set(a.join(','), a); pointMap.set(b.join(','), b); }
  const points = [...pointMap.values()];
  function covered(a, b) {
    const vx = b[0] - a[0], vy = b[1] - a[1], length2 = vx * vx + vy * vy;
    const intervals = [];
    for (const [c, d] of segments) {
      const cdx = c[0] - a[0], cdy = c[1] - a[1], ddx = d[0] - a[0], ddy = d[1] - a[1];
      if (vx * cdy - vy * cdx || vx * ddy - vy * ddx) continue;
      const t1 = (cdx * vx + cdy * vy) / length2, t2 = (ddx * vx + ddy * vy) / length2;
      const low = Math.max(0, Math.min(t1, t2)), high = Math.min(1, Math.max(t1, t2));
      if (high > low) intervals.push([low, high]);
    }
    intervals.sort((a1, b1) => a1[0] - b1[0]);
    let end = 0;
    for (const [low, high] of intervals) { if (low > end + 1e-9) return false; end = Math.max(end, high); }
    return end >= 1 - 1e-9;
  }
  const squares = new Set();
  for (const a of points) for (const b of points) {
    const dx = b[0] - a[0], dy = b[1] - a[1]; if (!dx && !dy) continue;
    const c = [b[0] - dy, b[1] + dx], d = [a[0] - dy, a[1] + dx];
    if (!pointMap.has(c.join(',')) || !pointMap.has(d.join(','))) continue;
    if ([[a,b],[b,c],[c,d],[d,a]].every(side => covered(...side))) squares.add([a,b,c,d].map(p => p.join(',')).sort().join('|'));
  }
  return squares.size;
}

function pointSquareCount(points) {
  const pointSet = new Set(points.map(point => point.join(','))), squares = new Set();
  for (const a of points) for (const b of points) {
    const dx = b[0] - a[0], dy = b[1] - a[1]; if (!dx && !dy) continue;
    for (const sign of [-1, 1]) {
      const c = [a[0] - sign * dy, a[1] + sign * dx], d = [b[0] - sign * dy, b[1] + sign * dx];
      if (pointSet.has(c.join(',')) && pointSet.has(d.join(','))) squares.add([a,b,c,d].map(p => p.join(',')).sort().join('|'));
    }
  }
  return squares.size;
}

function subsetSumCount(numbers) {
  const sums = new Set();
  for (let mask = 1; mask < 2 ** numbers.length; mask += 1) sums.add(numbers.reduce((sum, value, index) => sum + ((mask >> index) & 1 ? value : 0), 0));
  return sums.size;
}

function repeatedTotalCount(values, shots) {
  let totals = new Set([0]);
  for (let shot = 0; shot < shots; shot += 1) totals = new Set([...totals].flatMap(total => values.map(value => total + value)));
  return totals.size;
}

function enumeratePolycubes(targetCount) {
  const directions = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const permutations = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const parity = permutation => {
    let inversions = 0;
    for (let i = 0; i < 3; i += 1) for (let j = i + 1; j < 3; j += 1) if (permutation[i] > permutation[j]) inversions += 1;
    return inversions % 2 ? -1 : 1;
  };
  const rotations = [];
  for (const permutation of permutations) for (const sx of [-1,1]) for (const sy of [-1,1]) for (const sz of [-1,1]) {
    if (parity(permutation) * sx * sy * sz === 1) rotations.push({permutation, signs:[sx,sy,sz]});
  }
  const normalized = blocks => {
    const mins = [0,1,2].map(axis => Math.min(...blocks.map(block => block[axis])));
    return blocks.map(block => block.map((value, axis) => value - mins[axis])).sort((a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2]);
  };
  const key = blocks => normalized(blocks).map(block => block.join(',')).join(';');
  const canonicalKey = blocks => rotations.map(rotation => key(blocks.map(block => [
    block[rotation.permutation[0]] * rotation.signs[0],
    block[rotation.permutation[1]] * rotation.signs[1],
    block[rotation.permutation[2]] * rotation.signs[2]
  ]))).sort()[0];
  let shapes = [[[0,0,0]]];
  for (let count = 2; count <= targetCount; count += 1) {
    const next = new Map();
    for (const shape of shapes) {
      const occupied = new Set(shape.map(block => block.join(',')));
      for (const block of shape) for (const direction of directions) {
        const added = block.map((value, axis) => value + direction[axis]);
        if (!occupied.has(added.join(','))) {
          const candidate = [...shape, added], canonical = canonicalKey(candidate);
          if (!next.has(canonical)) next.set(canonical, normalized(candidate));
        }
      }
    }
    shapes = [...next.values()];
  }
  return {shapes, canonicalKey};
}

for (const name of ['q06_var01','q06_var02']) validateQ06(name);
for (const name of ['q07_var01','q07_var02']) validateQ07(name);
for (const name of ['q12_var01','q12_var02']) {
  const v = variations.get(name), mr = v.machineReadable;
  ok(mr.punchCount * mr.symmetryMultiplier === v.answerValidation.expectedAnswer, `${name}: fold-layer answer mismatch`);
}
for (const name of ['q13_var01','q13_var02']) validateQ13(name);
for (const name of ['q14_var01','q14_var02']) {
  const v = variations.get(name), count = minimumSquareCover(v.machineReadable.baseFigure);
  ok(count === v.answerValidation.expectedAnswer, `${name}: minimum square cover is ${count}`);
}
for (const name of ['q15_var01','q15_var02']) {
  const v = variations.get(name);
  ok(v.machineReadable.solvingModel.solutionLines.length === 2 && v.machineReadable.solvingModel.pieceCount === 6, `${name}: line/piece model mismatch`);
}
for (const name of ['q17_var01','q17_var02']) {
  const v = variations.get(name), count = segmentSquareCount(v.machineReadable.figure.lineSegments);
  ok(count === v.answerValidation.expectedAnswer, `${name}: segment enumeration is ${count}`);
}
const tricubes = enumeratePolycubes(3);
const tetracubes = enumeratePolycubes(4);
const nonplanarTetracubes = tetracubes.shapes.filter(shape => ![0,1,2].some(axis => new Set(shape.map(block => block[axis])).size === 1));
ok(readJson(path.join(canonicalDir, 'q18.json')).machineReadable.payload.equivalenceRule.sameIfReflected === false, 'q18 canonical: reflection rule conflicts with answer 8');
ok(tricubes.shapes.length === variations.get('q18_var01').answerValidation.expectedAnswer, `q18_var01: polycube enumeration is ${tricubes.shapes.length}`);
ok(tetracubes.shapes.length === 8, `q18 canonical: polycube enumeration is ${tetracubes.shapes.length}`);
ok(nonplanarTetracubes.length === variations.get('q18_var02').answerValidation.expectedAnswer, `q18_var02: nonplanar enumeration is ${nonplanarTetracubes.length}`);
const expectedNonplanar = new Set(nonplanarTetracubes.map(tetracubes.canonicalKey));
const declaredNonplanar = new Set(variations.get('q18_var02').machineReadable.solvingModel.representatives.map(rep => tetracubes.canonicalKey(rep.blocks)));
ok(same([...expectedNonplanar].sort(), [...declaredNonplanar].sort()), 'q18_var02: declared representatives do not match exhaustive set');

const q19Canonical = readJson(path.join(canonicalDir, 'q19.json'));
const q19Points = q19Canonical.machineReadable.payload.dotBoard.points.map(point => [point.x, point.y]);
ok(pointSquareCount(q19Points) === 6, 'q19 canonical: coordinate enumeration is not 6');
for (const name of ['q19_var01','q19_var02']) {
  const v = variations.get(name), count = pointSquareCount(v.machineReadable.dotBoard.points);
  ok(count === v.answerValidation.expectedAnswer, `${name}: coordinate enumeration is ${count}`);
}
for (const name of ['q20_var01','q20_var02']) {
  const v = variations.get(name), count = subsetSumCount(v.machineReadable.numbers);
  ok(count === v.answerValidation.expectedAnswer, `${name}: subset-sum count is ${count}`);
}
for (const name of ['q30_var01','q30_var02']) {
  const v = variations.get(name), count = repeatedTotalCount(v.machineReadable.choices, v.machineReadable.shots);
  ok(count === v.answerValidation.expectedAnswer, `${name}: total-score count is ${count}`);
}
for (const name of ['q51_var01','q51_var02']) {
  const v = variations.get(name), mr = v.machineReadable;
  const hourBells = Array.from({length: mr.endHour - mr.startHour}, (_, index) => mr.startHour + index + 1).reduce((a,b) => a + b, 0);
  const halfHourBells = mr.endHour - mr.startHour;
  ok(hourBells + halfHourBells === v.answerValidation.expectedAnswer, `${name}: bell total is ${hourBells + halfHourBells}`);
}

const allHfData = readJson(path.join(root, 'hyper-focus', 'data', 'hf_data.json'));
const allHfCore = readJson(path.join(root, 'hyper-focus', 'data', 'hf_core.json')).problems;
const q18HfData = allHfData.find(item => item.typeId === 18);
const q18HfCore = allHfCore.find(item => Number(item.typeId) === 18);
ok(q18HfData.originalProblem.answer === '8가지' && q18HfData.aiTutorPack.audioScript.includes('거울에 비친 모양'), 'q18 hf_data rotation-only rule mismatch');
ok(q18HfCore.answer === '8가지' && q18HfCore.teacherShortcut.includes('거울에 비친 모양'), 'q18 hf_core rotation-only rule mismatch');

const hfData = allHfData.find(item => item.typeId === 19);
const hfCore = allHfCore.find(item => Number(item.typeId) === 19);
ok(hfData.subType === 'geoboard_squares' && hfData.originalProblem.answer === '6개', 'q19 hf_data mismatch');
ok(hfCore.subType === 'geoboard_squares' && hfCore.answer === '6개', 'q19 hf_core mismatch');

if (failures.length) {
  console.error(`FAIL (${failures.length})`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log('PASS');
console.log('- canonical JSON: 54');
console.log('- variation JSON: 108');
console.log('- var01/var02 answer collisions: 0');
console.log('- targeted exhaustive validators: q06, q07, q12-q15, q17-q20, q30, q51');
