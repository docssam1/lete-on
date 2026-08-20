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

function placeValueCandidates(variation) {
  const mr = variation.machineReadable, digits = mr.digitCount;
  const start = 10 ** (digits - 1), end = 10 ** digits;
  return Array.from({ length: end - start }, (_, index) => start + index).filter(number => {
    const values = String(number).split('').map(Number);
    const place = digits === 3
      ? { hundreds: values[0], tens: values[1], ones: values[2] }
      : { thousands: values[0], hundreds: values[1], tens: values[2], ones: values[3] };
    return mr.conditions.every(condition => ({
      hundreds_eq_4: place.hundreds === 4,
      tens_eq_hundreds_plus_2: place.tens === place.hundreds + 2,
      ones_eq_tens_minus_4: place.ones === place.tens - 4,
      thousands_eq_2: place.thousands === 2,
      ones_eq_8: place.ones === 8,
      hundreds_eq_tens_plus_3: place.hundreds === place.tens + 3,
      digit_sum_21: values.reduce((sum, value) => sum + value, 0) === 21
    })[condition] === true);
  });
}

function comparisonCandidates(variation) {
  function evaluate(template, digit) {
    const expression = template.replace('[ ]', String(digit));
    const operator = expression.includes('>') ? '>' : '<';
    const [left, right] = expression.split(operator).map(value => Number(value.trim()));
    return operator === '>' ? left > right : left < right;
  }
  const mr = variation.machineReadable;
  return mr.digitDomain.filter(digit => mr.conditionBoxes.every(box => evaluate(box.expressionTemplate, digit)));
}

function vennAnswerCandidates(variation) {
  const mr = variation.machineReadable;
  const target = mr.diagram.targetPerCircle;
  const {leftOnly, rightOnly, topLeftOverlap} = mr.knownRegions;
  const answers = new Set();
  let assignmentCount = 0;
  for (let tripleOverlap = 0; tripleOverlap <= target; tripleOverlap += 1) {
    for (let bottomOverlap = 0; bottomOverlap <= target; bottomOverlap += 1) {
      if (leftOnly + topLeftOverlap + tripleOverlap + bottomOverlap !== target) continue;
      const topRightOverlap = target - rightOnly - tripleOverlap - bottomOverlap;
      const topOnly = target - topLeftOverlap - topRightOverlap - tripleOverlap;
      if (topRightOverlap < 0 || topOnly < 0) continue;
      assignmentCount += 1;
      answers.add(topOnly + tripleOverlap);
    }
  }
  return {answers: [...answers], assignmentCount};
}

function numberGridAnswerCandidates(variation) {
  const cells = variation.machineReadable.cells;
  const known = cells.filter(cell => cell.value !== null);
  const answers = new Map();
  for (let base = 0; base <= 99; base += 1) {
    for (let rowStep = 1; rowStep <= 20; rowStep += 1) {
      for (let columnStep = 1; columnStep <= 20; columnStep += 1) {
        const valueAt = cell => base + cell.col * rowStep + cell.row * columnStep;
        if (!known.every(cell => valueAt(cell) === cell.value)) continue;
        const answer = cells.filter(cell => cell.slot).sort((a, b) => a.slot - b.slot).map(valueAt);
        answers.set(JSON.stringify(answer), answer);
      }
    }
  }
  return [...answers.values()];
}

function symbolEquationSolutions(variation) {
  const mr = variation.machineReadable;
  const symbols = Object.keys(variation.answerValidation.expectedAnswer).sort();
  function evaluateSide(side, assignment) {
    const operator = side.includes('+') ? '+' : (side.includes('x') || side.includes('×') ? 'x' : null);
    const values = side.trim().split(/\s*(?:\+|x|×)\s*/).map(token => assignment[token]);
    if (!operator) return values[0];
    return operator === '+' ? values.reduce((sum, value) => sum + value, 0) : values.reduce((product, value) => product * value, 1);
  }
  function satisfies(assignment) {
    return mr.equations.every(equation => {
      const [left, right] = equation.split('=').map(part => part.trim());
      return evaluateSide(left, assignment) === evaluateSide(right, assignment);
    });
  }
  const solutions = [];
  function search(index, assignment, used) {
    if (index === symbols.length) {
      if (satisfies(assignment)) solutions.push({...assignment});
      return;
    }
    const symbol = symbols[index];
    for (const digit of mr.digitDomain) if (!used.has(digit)) {
      assignment[symbol] = digit;
      used.add(digit);
      search(index + 1, assignment, used);
      used.delete(digit);
    }
  }
  search(0, {}, new Set());
  return solutions;
}

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  return values.flatMap((value, index) => permutations(values.filter((_, candidate) => candidate !== index)).map(rest => [value, ...rest]));
}

function lineOrderSolutions(participants, relations) {
  return permutations(participants).filter(order => {
    const position = person => order.indexOf(person);
    return relations.every(relation => {
      if (relation.type === 'between_in_front_order') {
        return position(relation.beforePerson) < position(relation.person) && position(relation.person) < position(relation.afterPerson);
      }
      if (relation.type === 'equal_ahead_behind') return position(relation.person) * 2 === order.length - 1;
      if (relation.type === 'immediately_behind') return position(relation.person) === position(relation.aheadPerson) + 1;
      return false;
    });
  });
}

function validLineTotals(givens) {
  const totals = [];
  for (let total = 2; total <= 100; total += 1) {
    const backPersonFrontPosition = total - givens.backRank + 1;
    if (givens.frontRank > total || backPersonFrontPosition < 1 || backPersonFrontPosition > total) continue;
    if (Math.abs(givens.frontRank - backPersonFrontPosition) === givens.peopleBetween + 1) totals.push(total);
  }
  return totals;
}

function circularSeatingSolutions(participants, anchorPerson, relations) {
  const others = participants.filter(person => person !== anchorPerson);
  return permutations(others).map(order => [anchorPerson, ...order]).filter(order => {
    const position = person => order.indexOf(person), count = order.length;
    return relations.every(relation => {
      if (relation.type === 'adjacent') {
        const distance = (position(relation.personA) - position(relation.personB) + count) % count;
        return distance === 1 || distance === count - 1;
      }
      if (relation.type === 'left_steps') return position(relation.person) === (position(relation.fromPerson) + relation.steps) % count;
      return false;
    });
  });
}

function circularPositionMap(order) {
  return {left_top: order[4], right_top: order[1], left_bottom: order[3], right_bottom: order[2]};
}

function circularViewpointAnswer(participantCount, referenceRightOffset) {
  if (participantCount % 2 !== 0) return null;
  const oppositeSeat = ((-referenceRightOffset + participantCount / 2) % participantCount + participantCount) % participantCount;
  return oppositeSeat === 0 ? participantCount : oppositeSeat;
}

function pairs(values) {
  const output = [];
  for (let i = 0; i < values.length; i += 1) for (let j = i + 1; j < values.length; j += 1) output.push([values[i], values[j]]);
  return output;
}

function logicMatrixSolutions(spec) {
  const choices = pairs(spec.categories), solutions = [];
  function search(index, assignment) {
    if (index === spec.entities.length) {
      for (const category of spec.categories) {
        const count = spec.entities.filter(entity => assignment[entity].includes(category)).length;
        if (count !== spec.categoryCounts[category]) return;
      }
      if (spec.onlyEntity) {
        const lovers = spec.entities.filter(entity => assignment[entity].includes(spec.onlyEntity.category));
        if (!same(lovers, [spec.onlyEntity.entity])) return;
      }
      solutions.push(Object.fromEntries(spec.entities.map(entity => [entity, assignment[entity].slice()])));
      return;
    }
    const entity = spec.entities[index], required = spec.knownLikes[entity] || [];
    for (const choice of choices) {
      if (!required.every(category => choice.includes(category))) continue;
      if (spec.onlyEntity && entity !== spec.onlyEntity.entity && choice.includes(spec.onlyEntity.category)) continue;
      assignment[entity] = choice;
      search(index + 1, assignment);
    }
  }
  search(0, {});
  return solutions;
}

function signedSumRules(examples) {
  const rules = [];
  for (const topCoefficient of [-1, 1]) for (const leftCoefficient of [-1, 1]) for (const rightCoefficient of [-1, 1]) {
    const coefficients = [topCoefficient, leftCoefficient, rightCoefficient];
    if (examples.every(example => example.outer.reduce((sum, value, index) => sum + value * coefficients[index], 0) === example.inner)) rules.push(coefficients);
  }
  return rules;
}

function signedSumTargetAnswers(target, rules) {
  const answers = new Set();
  for (const [topCoefficient, leftCoefficient, rightCoefficient] of rules) {
    const [top, left] = target.outer;
    const answer = (target.inner - topCoefficient * top - leftCoefficient * left) / rightCoefficient;
    if (Number.isInteger(answer) && answer >= 0 && answer <= 99) answers.add(answer);
  }
  return [...answers];
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
for (const name of ['q21_var01','q21_var02']) {
  const v = variations.get(name), candidates = placeValueCandidates(v);
  ok(candidates.length === 1, `${name}: place-value candidates are ${candidates.join(',')}`);
  ok(candidates[0] === v.answerValidation.expectedAnswer, `${name}: unique place-value answer is ${candidates[0]}`);
}
for (const name of ['q25_var01','q25_var02']) {
  const v = variations.get(name), candidates = comparisonCandidates(v);
  const expectedCandidates = v.machineReadable.solvingModel.commonCandidatesWithinDomain;
  ok(same(candidates, expectedCandidates), `${name}: common comparison candidates mismatch`);
  ok(candidates.reduce((sum, value) => sum + value, 0) === v.answerValidation.expectedAnswer, `${name}: common digit sum mismatch`);
}
for (const name of ['q28_var01','q28_var02']) {
  const v = variations.get(name), candidates = vennAnswerCandidates(v);
  ok(candidates.assignmentCount > 0, `${name}: no valid Venn assignments`);
  ok(candidates.answers.length === 1, `${name}: Venn answer candidates are ${candidates.answers.join(',')}`);
  ok(candidates.answers[0] === v.answerValidation.expectedAnswer, `${name}: Venn answer mismatch`);
  ok(v.machineReadable.knownRegions.leftOnly + v.machineReadable.knownRegions.topLeftOverlap - v.machineReadable.knownRegions.rightOnly === v.machineReadable.solvingModel.topRightOverlap, `${name}: derived top-right overlap mismatch`);
}
for (const name of ['q29_var01','q29_var02']) {
  const v = variations.get(name), candidates = numberGridAnswerCandidates(v);
  ok(candidates.length === 1, `${name}: number-grid answer sets are ${JSON.stringify(candidates)}`);
  ok(same(candidates[0], v.answerValidation.expectedAnswer), `${name}: number-grid ordered answer mismatch`);
}
for (const name of ['q31_var01','q31_var02']) {
  const v = variations.get(name), solutions = symbolEquationSolutions(v);
  ok(solutions.length === 1, `${name}: symbol-equation solution count is ${solutions.length}`);
  ok(same(solutions[0], v.answerValidation.expectedAnswer), `${name}: symbol-equation answer mismatch`);
  ok(v.machineReadable.solvingModel.validAssignmentCount === solutions.length, `${name}: declared assignment count mismatch`);
}
const q35Canonical = readJson(path.join(canonicalDir, 'q35.json'));
const q35CanonicalRelations = [
  {type: 'between_in_front_order', person: '가영', beforePerson: '현수', afterPerson: '호진'},
  {type: 'equal_ahead_behind', person: '호진'},
  {type: 'immediately_behind', person: '정희', aheadPerson: '민호'}
];
const q35CanonicalOrders = lineOrderSolutions(q35Canonical.machineReadable.payload.participants, q35CanonicalRelations);
ok(q35CanonicalOrders.length === 1 && q35CanonicalOrders[0][3] === q35Canonical.answerValidation.expectedAnswer, 'q35 canonical: original fourth-place answer is not uniquely 민호');
for (const name of ['q35_var01','q35_var02']) {
  const v = variations.get(name), mr = v.machineReadable, orders = lineOrderSolutions(mr.participants, mr.relations);
  ok(orders.length === 1, `${name}: line-order solution count is ${orders.length}`);
  ok(same(orders[0], mr.solvingModel.uniqueOrder), `${name}: declared unique order mismatch`);
  ok(orders[0] && orders[0][mr.queryRank - 1] === v.answerValidation.expectedAnswer, `${name}: queried rank answer mismatch`);
  ok(mr.solvingModel.validOrderCount === orders.length, `${name}: declared order count mismatch`);
}
const q36Canonical = readJson(path.join(canonicalDir, 'q36.json'));
const q36CanonicalTotals = validLineTotals(q36Canonical.machineReadable.payload.givens);
ok(same(q36CanonicalTotals, q36Canonical.machineReadable.payload.solvingModel.validTotals), `q36 canonical: valid totals are ${q36CanonicalTotals.join(',')}`);
ok(q36CanonicalTotals[0] === q36Canonical.answerValidation.expectedAnswer.min && q36CanonicalTotals.at(-1) === q36Canonical.answerValidation.expectedAnswer.max, 'q36 canonical: original min/max mismatch');
for (const name of ['q36_var01','q36_var02']) {
  const v = variations.get(name), mr = v.machineReadable, totals = validLineTotals(mr.givens);
  ok(same(totals, mr.solvingModel.validTotals), `${name}: valid totals are ${totals.join(',')}`);
  ok(totals.length === 2 && totals[0] === v.answerValidation.expectedAnswer.min && totals[1] === v.answerValidation.expectedAnswer.max, `${name}: min/max answer mismatch`);
}
const q37Canonical = readJson(path.join(canonicalDir, 'q37.json'));
const q37CanonicalRelations = [
  {type: 'adjacent', personA: '재하', personB: '주원'},
  {type: 'left_steps', person: '주원', fromPerson: '하은', steps: 2},
  {type: 'left_steps', person: '무겸', fromPerson: '아영', steps: 1}
];
const q37CanonicalSeats = circularSeatingSolutions(q37Canonical.machineReadable.payload.participants, q37Canonical.machineReadable.payload.anchorPerson, q37CanonicalRelations);
ok(q37CanonicalSeats.length === 1 && same(circularPositionMap(q37CanonicalSeats[0]), q37Canonical.answerValidation.expectedAnswer), 'q37 canonical: original circular position map is not unique');
for (const name of ['q37_var01','q37_var02']) {
  const v = variations.get(name), mr = v.machineReadable, seats = circularSeatingSolutions(mr.participants, mr.anchorPerson, mr.relations);
  ok(seats.length === 1, `${name}: circular seating count is ${seats.length}`);
  ok(seats[0] && same(circularPositionMap(seats[0]), v.answerValidation.expectedAnswer), `${name}: circular position map mismatch`);
  ok(mr.solvingModel.validSeatingCount === seats.length, `${name}: declared seating count mismatch`);
}
const q38Canonical = readJson(path.join(canonicalDir, 'q38.json'));
const q38CanonicalPayload = q38Canonical.machineReadable.payload;
ok(circularViewpointAnswer(q38CanonicalPayload.participantCount, 2) === q38Canonical.answerValidation.expectedAnswer, 'q38 canonical: original viewpoint answer is not 3');
for (const name of ['q38_var01','q38_var02']) {
  const v = variations.get(name), mr = v.machineReadable;
  const answer = circularViewpointAnswer(mr.participantCount, mr.referenceRightOffset);
  ok(mr.participantCount % 2 === 0 && mr.oppositeOffset === mr.participantCount / 2, `${name}: opposite seat does not exist or offset mismatch`);
  ok(answer === v.answerValidation.expectedAnswer, `${name}: circular viewpoint answer is ${answer}`);
  ok(mr.solvingModel.oppositeSeatFromAnchor === answer, `${name}: declared opposite seat mismatch`);
}
const q39Canonical = readJson(path.join(canonicalDir, 'q39.json'));
const q39CanonicalSpec = {
  entities: ['A','B','C','D'], categories: ['사과','배','귤','딸기'],
  categoryCounts: {사과:3, 배:2, 귤:2, 딸기:1}, onlyEntity: {category:'딸기', entity:'C'},
  knownLikes: {A:['배'], B:['사과'], D:['사과','배']}
};
const q39CanonicalSolutions = logicMatrixSolutions(q39CanonicalSpec);
const q39CanonicalAnswers = new Map(q39CanonicalSolutions.map(solution => [JSON.stringify(solution.B), solution.B]));
ok(q39CanonicalSolutions.length > 0 && q39CanonicalAnswers.size === 1 && same([...q39CanonicalAnswers.values()][0], q39Canonical.answerValidation.expectedAnswer), 'q39 canonical: original B pair is not uniquely 사과, 귤');
for (const name of ['q39_var01','q39_var02']) {
  const v = variations.get(name), mr = v.machineReadable, solutions = logicMatrixSolutions(mr);
  ok(solutions.length === 1, `${name}: logic-matrix solution count is ${solutions.length}`);
  ok(solutions[0] && same(solutions[0][mr.queryEntity], v.answerValidation.expectedAnswer), `${name}: queried fruit pair mismatch`);
  ok(mr.solvingModel.validMatrixCount === solutions.length, `${name}: declared matrix count mismatch`);
}
const q40Canonical = readJson(path.join(canonicalDir, 'q40.json'));
const q40CanonicalPayload = q40Canonical.machineReadable.payload;
const q40CanonicalRules = signedSumRules(q40CanonicalPayload.examples);
const q40CanonicalAnswers = signedSumTargetAnswers(q40CanonicalPayload.target, q40CanonicalRules);
ok(q40CanonicalRules.length === 1 && same(q40CanonicalAnswers, [q40Canonical.answerValidation.expectedAnswer]), `q40 canonical: original rule/answer mismatch (${JSON.stringify(q40CanonicalRules)} / ${q40CanonicalAnswers})`);
for (const name of ['q40_var01','q40_var02']) {
  const v = variations.get(name), mr = v.machineReadable, rules = signedSumRules(mr.examples), answers = signedSumTargetAnswers(mr.target, rules);
  ok(rules.length === 1 && same(rules[0], mr.rule.coefficients), `${name}: signed-sum rule count is ${rules.length}`);
  ok(answers.length === 1 && answers[0] === v.answerValidation.expectedAnswer, `${name}: target answer candidates are ${answers.join(',')}`);
  ok(mr.solvingModel.validSignedSumRuleCount === rules.length, `${name}: declared signed-sum rule count mismatch`);
}
const statusLedger = readJson(path.join(root, 'hyper-focus', 'qa', 'generator-status.json'));
const rejectedIds = [...variations.entries()].filter(([, variation]) => variation.status === 'rejected').map(([name]) => name).sort();
ok(same(rejectedIds, statusLedger.variationBank.rejectedVariationIds.slice().sort()), 'rejected variation ledger mismatch');
for (const name of rejectedIds) {
  const rejection = variations.get(name).rejection;
  ok(rejection && rejection.action === 'exclude_from_all_question_banks', `${name}: rejected action missing`);
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

for (const name of ['q33_var01','q33_var02']) {
  const v = variations.get(name), m = v.machineReadable;
  const aPosition = m.winsA * m.winStep - m.lossesA * m.loseStep;
  const bPosition = m.lossesA * m.winStep - m.winsA * m.loseStep;
  ok(m.winsA + m.lossesA === m.rounds, `${name}: round count mismatch`);
  ok(v.subType === 'rps_stair_position' && m.payloadType === 'rps_stair_position', `${name}: canonical subtype drift`);
  ok(v.problem.prompt.includes('같은 계단에서 시작'), `${name}: same-start condition missing`);
  ok(aPosition - bPosition === v.answerValidation.expectedAnswer, `${name}: stair difference mismatch`);
}

for (const name of ['q47_var01','q47_var02']) {
  const v = variations.get(name), m = v.machineReadable;
  const candidates = [];
  for (let alphabet = 0; alphabet <= m.initialTotal; alphabet += 1) {
    let state = { number_card: m.initialTotal - alphabet, alphabet_card: alphabet };
    let valid = true;
    for (const change of m.changes) {
      if (change.from !== 'outside') {
        if (state[change.from] < change.count) { valid = false; break; }
        state[change.from] -= change.count;
      }
      state[change.to] += change.count;
    }
    const final = m.solvingModel.finalState;
    if (valid && state.number_card === final.numberCards && state.alphabet_card === final.alphabetCards) candidates.push(alphabet);
  }
  ok(candidates.length === 1 && candidates[0] === v.answerValidation.expectedAnswer, `${name}: reverse-table candidates are ${candidates.join(',')}`);
}

for (const name of ['q48_var01','q48_var02']) {
  const v = variations.get(name), m = v.machineReadable;
  const perA = m.totalUnits / m.daysA, perB = m.totalUnits / m.daysB;
  const together = m.totalUnits / (perA + perB);
  ok(Number.isInteger(perA) && Number.isInteger(perB), `${name}: child-friendly whole-grid units missing`);
  ok(v.subType === 'work_together' && m.payloadType === 'work_together', `${name}: canonical subtype drift`);
  ok(v.problem.prompt.includes('매일 같은 속도로'), `${name}: constant-work-rate condition missing`);
  ok(perA === m.perDayA && perB === m.perDayB && perA + perB === m.perDayTogether, `${name}: per-day grid mismatch`);
  ok(together === v.answerValidation.expectedAnswer, `${name}: together-work answer mismatch`);
}

for (const name of ['q49_var01','q49_var02']) {
  const v = variations.get(name), m = v.machineReadable, given = m.givenRatio, target = m.target;
  const perAnimalPerDay = given.nuts / (given.animals * given.days);
  const days = target.nuts / (target.animals * perAnimalPerDay);
  ok(Number.isInteger(perAnimalPerDay) && Number.isInteger(days), `${name}: whole-unit rate condition missing`);
  ok(v.problem.prompt.includes('같은 속도로 매일 같은 수'), `${name}: constant-animal-rate condition missing`);
  ok(perAnimalPerDay === m.solvingModel.perAnimalPerDay, `${name}: unit rate mismatch`);
  ok(days === v.answerValidation.expectedAnswer, `${name}: target days mismatch`);
}

const textOnlyIds = ['q33_var01','q33_var02','q47_var01','q47_var02','q48_var01','q48_var02','q49_var01','q49_var02'];
for (const name of textOnlyIds) {
  const v = variations.get(name);
  ok(v.status === 'verified', `${name}: text-only status is not verified`);
  ok(v.presentation && v.presentation.mode === 'text-only', `${name}: explicit text-only presentation missing`);
  ok(v.presentation.answerUnit, `${name}: answer unit missing`);
  ok(v.problem && v.problem.prompt && v.solutionHint, `${name}: text-only prompt or solution missing`);
  ok(v.source && !v.source.problemImage, `${name}: text-only problem points to a misleading image`);
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
console.log('- targeted exhaustive validators: q06, q07, q12-q15, q17-q21, q25, q28-q31, q33, q35-q40, q47-q49, q51');
console.log(`- rejected canonical-type-drift variations: ${rejectedIds.length}`);
