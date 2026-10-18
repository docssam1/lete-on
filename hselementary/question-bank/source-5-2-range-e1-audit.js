"use strict";

// New numerical variants only. Original-source values and calculations stay in
// private evidence. This checker never calls the producer's answer helpers.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const IDS = ["exploration", "example-1-1", "example-1-2", "example-1-3", "example-1-4"].map(suffix => `5-2-u1-e1-${suffix}`);
const KEYS = ["source52RangeExploration", "source52RangeMaxStart", "source52RangeSeats", "source52RangeOverlap", "source52RangeBoxes"];
const KINDS = ["continuous-range", "maximum-lower-endpoint", "minimum-seat-intersection", "two-group-overlap", "bounded-box-allocation"];
const FIXTURES = [
  [{ lower: 14, upper: 21 }, { lower: 37, upper: 45 }, { lower: 58, upper: 64 }],
  [{ count: 428 }, { count: 653 }, { count: 786 }],
  [{ capacityA: 6, seatsA: 42, capacityB: 8, seatsB: 31 }, { capacityA: 5, seatsA: 48, capacityB: 7, seatsB: 34 }, { capacityA: 7, seatsA: 44, capacityB: 9, seatsB: 34 }],
  [{ total: 45, hats: 31, sunglasses: 26 }, { total: 52, hats: 37, sunglasses: 28 }, { total: 60, hats: 46, sunglasses: 34 }],
  [{ total: 263, minimum: 25, upperExclusive: 35 }, { total: 418, minimum: 29, upperExclusive: 40 }, { total: 563, minimum: 38, upperExclusive: 50 }]
];
const DESIGNS = [
  ["endpoint-inclusion-hint", "source-range-to-words-and-line", "derive-lower-endpoint-first"],
  ["endpoint-distance-given", "source-inclusive-count-maximum", "derive-inclusive-count-first"],
  ["first-seat-boundaries-given", "source-two-minimum-seat-conditions", "derive-first-seat-count-first"],
  ["complement-count-given", "source-two-group-overlap-range", "derive-hat-count-from-complement"],
  ["maximum-per-box-given", "source-bounded-box-count", "derive-total-before-allocation"]
];
const plain = value => JSON.parse(JSON.stringify(value));
const text = html => String(html).replace(/<svg\b[\s\S]*?<\/svg>/g, " ").replace(/<[^>]*>/g, "")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
const attributes = tag => Object.fromEntries([...String(tag).matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
const numbers = (value, expression, label) => {
  const match = expression.exec(value);
  assert(match, `${label}: missing or changed visible condition: ${value}`);
  return match.slice(1).map(Number);
};
const near = (actual, expected, label, tolerance = 0.003) => assert(Math.abs(actual - expected) < tolerance, `${label}: ${actual} != ${expected}`);

function load() {
  const context = vm.createContext({ window: {} });
  for (const file of ["source-inventory-4-1.js", "source-inventory-4-2-quadrilateral.js", "source-inventory-grade6.js", "curriculum.js", "generators.js", "source-5-2-range-e1.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context, { filename: file });
  }
  return { source: context.window.HSE_SOURCE_52_RANGE_E1, api: context.window.HSE_GENERATORS,
    types: context.window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types))) };
}

function parseVisible(question, kind, level) {
  const prompt = text(question.prompt);
  let result;
  if (kind === 0) {
    let lower, upper;
    if (level === 2) {
      const [base, addition] = numbers(prompt, /㉠은 (\d+)보다 (\d+) 큰 수입니다\./, "derived lower endpoint");
      [upper] = numbers(prompt, /㉠ < □ ≤ (\d+)인 수 □에 대하여 답하세요\./, "upper inclusion and lower strictness");
      lower = base + addition;
    } else {
      [lower, upper] = numbers(prompt, /(\d+) < □ ≤ (\d+)인 수 □에 대하여 답하세요\./, "continuous interval inequality");
    }
    assert.match(prompt, /\(1\).*초과.*이하.*같은 뜻.*다른 말.*\(2\).*수직선.*범위/);
    result = { lower, upper };
  } else if (kind === 1) {
    assert.match(prompt, /ㄱ과 ㄴ은 세 자리 자연수/);
    assert.match(prompt, /ㄱ 이상 ㄴ 이하인 자연수/);
    assert.match(prompt, /ㄱ이 될 수 있는 수 중에서 가장 큰 수/);
    const values = level === 2
      ? numbers(prompt, /모두 (\d+)개보다 (\d+)개 더 많습니다/, "derived inclusive count")
      : numbers(prompt, /모두 (\d+)개입니다/, "inclusive count");
    result = { count: values.reduce((a, b) => a + b, 0) };
  } else if (kind === 2) {
    let capacityA, seatsA, capacityB, seatsB;
    if (level === 2) {
      [capacityB, seatsB, capacityA] = numbers(prompt, /(\d+)명씩 앉히면 긴 의자는 최소 (\d+)개 필요합니다\. (\d+)명씩 앉히면 필요한 최소 의자 수는/, "derived seat conditions");
      const [difference] = numbers(prompt, /최소 의자 수는 그보다 (\d+)개 더 많습니다/, "seat count difference");
      seatsA = seatsB + difference;
    } else {
      [capacityA, seatsA, capacityB, seatsB] = numbers(prompt, /(\d+)명씩 앉히면 긴 의자는 최소 (\d+)개, (\d+)명씩 앉히면 최소 (\d+)개 필요합니다/, "minimum seat counts");
    }
    assert.match(prompt, /학생 수의 범위를 ‘이상’과 ‘미만’/);
    result = { capacityA, seatsA, capacityB, seatsB };
  } else if (kind === 3) {
    const [total] = numbers(prompt, /등산을 간 (\d+)명 중/, "group total");
    const [sunglasses] = numbers(prompt, /선글라스를 낀 사람은 (\d+)명입니다/, "second group");
    const [hatCondition] = numbers(prompt, level === 2 ? /모자를 쓰지 않은 사람은 (\d+)명/ : /모자를 쓴 사람은 (\d+)명/, "hat condition");
    assert.match(prompt, /모자를 쓰고 선글라스도 낀 사람 수의 범위를 ‘초과’와 ‘이하’/);
    result = { total, hats: level === 2 ? total - hatCondition : hatCondition, sunglasses };
  } else {
    const values = level === 2
      ? numbers(prompt, /귤 (\d+)개에 (\d+)개를 더했습니다/, "derived total")
      : numbers(prompt, /귤 (\d+)개가 있습니다/, "total objects");
    const [minimum, upperExclusive] = numbers(prompt, /한 상자에 (\d+)개 이상 (\d+)개 미만씩 남김없이/, "box bounds");
    assert.match(prompt, /상자 수의 범위를 ‘초과’와 ‘미만’/);
    result = { total: values.reduce((a, b) => a + b, 0), minimum, upperExclusive };
  }
  assert(Object.values(result).every(Number.isSafeInteger), "Visible parameters must be safe integers");
  return result;
}

function independentAnswer(kind, data) {
  if (kind === 0) {
    assert(data.lower < data.upper);
    const members = [];
    for (let quarter = 4 * (data.lower - 1); quarter <= 4 * (data.upper + 1); quarter++) {
      if (quarter / 4 > data.lower && quarter / 4 <= data.upper) members.push(quarter / 4);
    }
    assert(!members.includes(data.lower));
    assert(members.includes(data.upper));
    assert(members.includes(data.lower + 0.5), "Continuous interval must include non-integers");
    return { lower: data.lower, upper: data.upper, members };
  }
  if (kind === 1) {
    // Count each interval by stepping through endpoints; the producer's inverse
    // endpoint formula is deliberately not used as the answer oracle.
    let best = -1, candidates = 0;
    for (let start = 100; start <= 999; start++) {
      let count = 0;
      for (let end = start; end <= 999; end++) {
        count++;
        if (count === data.count) { best = Math.max(best, start); candidates++; }
      }
    }
    assert(best >= 100 && candidates > 0);
    return { value: best, candidates };
  }
  const possible = [];
  if (kind === 2) {
    const limit = Math.max(data.capacityA * data.seatsA, data.capacityB * data.seatsB) + 1;
    const occupiedBenches = (students, capacity) => {
      let benches = 0;
      for (let seated = 0; seated < students; seated += capacity) benches++;
      return benches;
    };
    for (let n = 1; n <= limit; n++) {
      if (occupiedBenches(n, data.capacityA) === data.seatsA && occupiedBenches(n, data.capacityB) === data.seatsB) possible.push(n);
    }
  } else if (kind === 3) {
    for (let both = 0; both <= data.total; both++) {
      const regions = [both, data.hats - both, data.sunglasses - both, data.total - data.hats - data.sunglasses + both];
      if (regions.every(n => n >= 0) && regions.reduce((a, b) => a + b, 0) === data.total) possible.push(both);
    }
  } else {
    // A sum-set calculation checks every integer content and every intermediate
    // box count. It is independent of quotient-bound and balanced-allocation code.
    let reachable = new Set([0]);
    for (let boxes = 1; boxes <= Math.floor(data.total / data.minimum) + 1; boxes++) {
      const next = new Set();
      for (const previous of reachable) for (let amount = data.minimum; amount < data.upperExclusive; amount++) {
        if (previous + amount <= data.total) next.add(previous + amount);
      }
      reachable = next;
      if (reachable.has(data.total)) possible.push(boxes);
    }
  }
  assert(possible.length > 0, "The visible conditions have no answer");
  const lower = possible[0], upper = possible[possible.length - 1];
  assert.deepEqual(possible, Array.from({ length: upper - lower + 1 }, (_, index) => lower + index), "No missing integer inside the proposed range");
  assert(!possible.includes(lower - 1) && !possible.includes(upper + 1));
  return { lower, upper, possible };
}

function arithmeticValue(expression) {
  assert.match(expression, /^\d+(?:\s*[+\-×]\s*\d+)*$/, `Unsupported numeric expression: ${expression}`);
  const terms = expression.replace(/\s/g, "").split(/(?=[+\-])/);
  return terms.reduce((sum, term) => sum + term.split("×").map(Number).reduce((a, b) => a * b, 1), 0);
}

function verifyNumericEquations(solution) {
  let count = 0;
  for (const match of String(solution).matchAll(/<span class="math-inline-expression">([\s\S]*?)<\/span>/g)) {
    const expression = text(match[1]);
    if (!expression.includes("=")) continue;
    assert.match(expression, /^\d[\d\s+\-×=]*$/, `Malformed visible numeric equation: ${expression}`);
    const parts = expression.split("=");
    assert.equal(parts.length, 2);
    assert.equal(arithmeticValue(parts[0].trim()), arithmeticValue(parts[1].trim()), `False visible equation: ${expression}`);
    count++;
  }
  return count;
}

function verifyNumberLine(markup, expected, solved, css) {
  const svg = /<svg\b[\s\S]*?<\/svg>/.exec(markup)?.[0];
  assert(svg, "Number-line SVG required");
  assert.equal(attributes(svg).viewBox, "0 0 360 108");
  assert.equal(attributes(svg)["data-phase"], solved ? "answer" : "question");
  const ticks = [...svg.matchAll(/<g class="source52-range-tick">([\s\S]*?)<\/g>/g)].map(([, group]) => {
    const line = attributes(/<line\b[^>]*>/.exec(group)?.[0]);
    const label = /<text\b([^>]*)>(\d+)<\/text>/.exec(group);
    assert(label);
    const labelAttrs = attributes(label[1]);
    const tick = { value: Number(label[2]), x: Number(line.x1), y1: Number(line.y1), y2: Number(line.y2) };
    near(Number(line.x2), tick.x, "vertical tick");
    near(Number(labelAttrs.x), tick.x, "tick label coordinate");
    assert(tick.y1 < 46 && tick.y2 > 46, "Tick must cross the actual axis");
    return tick;
  });
  assert.equal(ticks.length, expected.upper - expected.lower + 3);
  const first = ticks[0], last = ticks[ticks.length - 1];
  assert.equal(first.value, expected.lower - 1);
  assert.equal(last.value, expected.upper + 1);
  assert(first.x >= 0 && last.x <= 360 && first.x < last.x);
  const unit = (last.x - first.x) / (last.value - first.value);
  const valueAt = x => first.value + (x - first.x) / unit;
  ticks.forEach((tick, index) => {
    assert.equal(tick.value, first.value + index, "Consecutive integer tick labels");
    near(valueAt(tick.x), tick.value, "tick coordinate readback");
  });
  const intervals = [...svg.matchAll(/<line\b[^>]*class="source52-range-interval"[^>]*>/g)].map(match => attributes(match[0]));
  const endpoints = [...svg.matchAll(/<circle\b[^>]*>/g)].map(match => attributes(match[0]));
  if (!solved) {
    assert.equal(intervals.length, 0, "Student drawing must not contain its answer segment");
    assert.equal(endpoints.length, 0, "Student drawing must not contain solved endpoints");
    assert(!/is-open|is-closed/.test(svg));
    return;
  }
  assert.equal(intervals.length, 1);
  assert.equal(endpoints.length, 2);
  const [segment] = intervals;
  near(valueAt(Number(segment.x1)), expected.lower, "segment lower endpoint");
  near(valueAt(Number(segment.x2)), expected.upper, "segment upper endpoint");
  near(Number(segment.y1), 46, "segment axis");
  near(Number(segment.y2), 46, "segment axis");
  const open = endpoints.filter(endpoint => /\bis-open\b/.test(endpoint.class));
  const closed = endpoints.filter(endpoint => /\bis-closed\b/.test(endpoint.class));
  assert.equal(open.length, 1, "Exactly one open endpoint");
  assert.equal(closed.length, 1, "Exactly one closed endpoint");
  for (const [endpoint, boundary] of [[open[0], expected.lower], [closed[0], expected.upper]]) {
    near(valueAt(Number(endpoint.cx)), boundary, "circle coordinate readback");
    near(Number(endpoint.cy), 46, "circle axis");
    assert(Number(endpoint.r) >= 5, "Readable endpoint radius");
    assert(!endpoint.style && !endpoint.fill, "Endpoint inline style must not override verified fill classes");
  }
  assert.match(css, /\.source52-range-endpoint\.is-open\s*\{\s*fill:\s*#fff;/);
  assert.match(css, /\.source52-range-endpoint\.is-closed\s*\{\s*fill:\s*#111;/);
  assert(svg.includes(`${expected.lower} 초과 ${expected.upper} 이하`), "SVG accessible description must match its actual endpoints");
}

function validateQuestion(question, kind, variant, difficulty, css) {
  const level = difficulty + 1;
  assert.equal(question.sourceItemId, IDS[kind]);
  assert.equal(question.generator, KEYS[kind]);
  assert.equal(question.questionModel.kind, KINDS[kind]);
  assert.equal(question.publisherKeyVerified, false);
  assert.equal(question.publisherAnswerVerified, false);
  assert.equal(question.handwrittenAnswerVerified, false);
  assert.equal(question.answerVerification, "independent-enumeration-user-authorized");
  assert.equal(question.sourceStructurePreserved, true);
  assert.equal(question.generationMode, "fixed-verified-pool");
  assert.equal(question.verifiedVariantCount, 3);
  assert.equal(question.verifiedVariantTarget, 3);
  assert.equal(question.verifiedPoolIndex, variant);
  assert.equal(question.verifiedVariantId, `${IDS[kind]}:v${variant}`);
  assert.equal(question.variantProvenance, "source-structure-variant");
  assert.equal(question.difficultyOffset, difficulty);
  assert.equal(question.difficultyLevel, level);
  assert.equal(question.difficultyDesign, DESIGNS[kind][level]);
  assert.equal(question.reasoningSteps, level + (kind === 4 ? 3 : 2));
  assert.equal(question.difficultyStepDelta, difficulty);
  assert.match(question.sourceEvidenceRef, /^source-memory:/);
  const wrapper = attributes(/<div\b[^>]*>/.exec(question.prompt)?.[0]);
  assert.equal(wrapper["data-source-item"], IDS[kind]);
  assert.equal(Number(wrapper["data-pool-index"]), variant);
  assert.equal(Number(wrapper["data-difficulty-offset"]), difficulty);
  const data = parseVisible(question, kind, level);
  assert.deepEqual(data, FIXTURES[kind][variant], "Visible conditions must match the independently approved new fixture");
  for (const [key, value] of Object.entries(data)) assert.equal(question.questionModel[key], value, `Visible/model drift: ${key}`);
  const expected = independentAnswer(kind, data);
  const solution = text(question.solution);
  const prompt = text(question.prompt);
  if (level === 2) {
    const hiddenFields = [
      ["lowerBase", "lowerAddition", /㉠은 (\d+)보다 (\d+) 큰 수/],
      ["countBase", "countExtra", /모두 (\d+)개보다 (\d+)개 더 많습니다/],
      ["seatDifference", null, /최소 의자 수는 그보다 (\d+)개 더 많습니다/],
      ["noHat", null, /모자를 쓰지 않은 사람은 (\d+)명/],
      ["totalBase", "totalExtra", /귤 (\d+)개에 (\d+)개를 더했습니다/]
    ][kind];
    const parsed = numbers(prompt, hiddenFields[2], "visible intermediate parameters");
    parsed.forEach((value, index) => assert.equal(question.questionModel[hiddenFields[index]], value, "Hidden-condition model drift"));
  }
  assert.equal((question.prompt.match(/class="source52-range-hint"/g) || []).length, level === 0 ? 1 : 0);
  const equationCount = verifyNumericEquations(question.solution);
  assert(equationCount >= (kind === 0 ? (level === 2 ? 1 : 0) : 2), "Solution needs the independently checkable arithmetic steps");
  if (kind === 0) {
    assert.equal(question.resultContract, "rubric");
    assert.equal(question.mathematicalContract, "range");
    assert.equal(question.questionModel.naturalNumbersOnly, false);
    assert.equal(question.questionModel.subquestionCount, 2);
    assert.equal(question.questionModel.lowerIncluded, false);
    assert.equal(question.questionModel.upperIncluded, true);
    assert.equal(question.answerModel.continuous, true);
    assert.equal(question.answerModel.lower, expected.lower);
    assert.equal(question.answerModel.upper, expected.upper);
    assert.equal(question.answerModel.lowerIncluded, false);
    assert.equal(question.answerModel.upperIncluded, true);
    assert.equal(question.answer, `${expected.lower} 초과 ${expected.upper} 이하 · 수직선은 풀이 그림 참조`);
    assert(solution.includes(`${expected.lower}에는 빈 원, ${expected.upper}에는 채운 원`));
    assert(solution.includes("소수도 포함"));
    if (level === 0) assert(prompt.includes("왼쪽 끝수는 포함하지 않고, 오른쪽 끝수는 포함합니다"));
    verifyNumberLine(question.prompt, expected, false, css);
    verifyNumberLine(question.answerVisual, expected, true, css);
    assert.equal(question.answerVisualRequired, true);
    assert.equal(question.answerVisualStatus, "verified");
  } else if (kind === 1) {
    assert.equal(question.resultContract, "single-value");
    assert.equal(question.answer, String(expected.value));
    assert.equal(question.answerModel.value, expected.value);
    assert.equal(question.answerModel.upperEndpoint, 999);
    assert.equal(question.answerModel.inclusiveCount, data.count);
    assert.equal(question.questionModel.digits, 3);
    assert.equal(question.questionModel.lowerIncluded, true);
    assert.equal(question.questionModel.upperIncluded, true);
    assert(solution.includes(`999 - ${expected.value} + 1 = ${data.count}`));
    assert(solution.includes(`${data.count} - 1 = ${data.count - 1}`));
    assert(solution.includes(`999 - ${data.count - 1} = ${expected.value}`));
    if (level === 0) assert(prompt.includes(`ㄱ과 ㄴ의 차는 ${data.count - 1}입니다`));
  } else {
    assert.equal(question.resultContract, "range");
    assert.equal(question.questionModel.integerDomain, true);
    assert.equal(question.answerModel.lower, expected.lower);
    assert.equal(question.answerModel.upper, expected.upper);
    const displayLower = expected.lower - (kind === 2 ? 0 : 1);
    const displayUpper = expected.upper + (kind === 3 ? 0 : 1);
    const unit = kind === 4 ? "상자" : "명";
    const answer = `${displayLower}${unit} ${kind === 2 ? "이상" : "초과"} ${displayUpper}${unit} ${kind === 3 ? "이하" : "미만"}`;
    assert.equal(question.answer, answer);
    assert.equal(question.answerModel.displayLower, displayLower);
    assert.equal(question.answerModel.displayUpper, displayUpper);
    assert.equal(question.answerModel.lowerIncluded, kind === 2);
    assert.equal(question.answerModel.upperIncluded, kind === 3);
    assert(solution.includes(answer), "Solution conclusion must state the independently enumerated range");
    if (kind === 2) {
      const aLow = data.capacityA * (data.seatsA - 1) + 1, aHigh = data.capacityA * data.seatsA;
      const bLow = data.capacityB * (data.seatsB - 1) + 1, bHigh = data.capacityB * data.seatsB;
      assert(solution.includes(`${aLow}명부터 ${aHigh}명까지`));
      assert(solution.includes(`${bLow}명부터 ${bHigh}명까지`));
      for (const [capacity, seats] of [[data.capacityA, data.seatsA], [data.capacityB, data.seatsB]]) {
        assert(solution.includes(`${capacity} × ${seats - 1} = ${capacity * (seats - 1)}`));
        assert(solution.includes(`${capacity} × ${seats} = ${capacity * seats}`));
      }
      assert(solution.includes(`${data.seatsA - 1}개로는 모자라고 ${data.seatsA}개면 충분`));
      if (level === 0) assert(prompt.includes(`${aLow}명 이상 ${aHigh + 1}명 미만`));
    } else if (kind === 3) {
      assert(solution.includes(`${data.total} - ${data.hats} = ${data.total - data.hats}`));
      assert(solution.includes(`${data.sunglasses} - ${data.total - data.hats} = ${expected.lower}`));
      assert(solution.includes(`가장 많아야 ${expected.upper}명`));
      if (level === 0) assert(prompt.includes(`모자를 쓰지 않은 사람은 ${data.total - data.hats}명`));
    } else {
      assert(solution.includes(`${data.upperExclusive}개 미만이므로 한 상자에는 가장 많아야 ${data.upperExclusive - 1}개`));
      assert(solution.includes(`${data.upperExclusive - 1} × ${expected.lower - 1} = ${(data.upperExclusive - 1) * (expected.lower - 1)}`));
      assert(solution.includes(`${data.minimum} × ${expected.upper + 1} = ${data.minimum * (expected.upper + 1)}`));
      if (level === 0) assert(prompt.includes(`가장 많이 담을 수 있는 귤은 ${data.upperExclusive - 1}개`));
      assert.equal(question.answerModel.witnesses.length, expected.possible.length);
      question.answerModel.witnesses.forEach((allocation, index) => {
        assert.equal(allocation.count, expected.possible[index]);
        assert.equal(allocation.smallCount + allocation.largeCount, allocation.count);
        assert.equal(allocation.small * allocation.smallCount + allocation.large * allocation.largeCount, data.total);
        for (const [amount, count] of [[allocation.small, allocation.smallCount], [allocation.large, allocation.largeCount]]) {
          assert(Number.isInteger(count) && count >= 0);
          if (count) assert(amount >= data.minimum && amount < data.upperExclusive);
        }
      });
      const allocations = [...solution.matchAll(/(\d+)상자는 (\d+)개씩 (\d+)상자(?:와 (\d+)개씩 (\d+)상자)?/g)];
      assert.equal(allocations.length, 2, "Both endpoint allocations must appear in visible solution");
      allocations.forEach(match => {
        const [boxes, small, smallCount, large = 0, largeCount = 0] = match.slice(1).map(value => value === undefined ? 0 : Number(value));
        assert(expected.possible.includes(boxes));
        assert.equal(smallCount + largeCount, boxes);
        assert.equal(small * smallCount + large * largeCount, data.total);
        assert(small >= data.minimum && small < data.upperExclusive);
        if (largeCount) assert(large >= data.minimum && large < data.upperExclusive);
      });
    }
  }
  if (kind !== 0) {
    assert.equal(question.answerVisualRequired, false);
    assert.equal(question.answerVisualStatus, "not-required");
  }
  return { sourceItemId: IDS[kind], variant, difficulty, equationCount, domain: kind === 0 ? "continuous" : "integer", status: "passed" };
}

function run() {
  const { source, api, types } = load();
  const css = fs.readFileSync(path.join(__dirname, "source-5-2-range-e1.css"), "utf8");
  assert.deepEqual(plain(source.sourceItemIds), IDS);
  assert.equal(source.publisherKeyVerified, false);
  const states = [];
  for (let kind = 0; kind < IDS.length; kind++) {
    const type = types.find(item => item.id === IDS[kind]);
    assert(type && type.sourceItemId === IDS[kind]);
    assert.equal(api.generatorKey(type), KEYS[kind]);
    const prompts = new Set();
    for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
      const question = plain(source.getQuestion(IDS[kind], variant, difficulty));
      states.push(validateQuestion(question, kind, variant, difficulty, css));
      assert.deepEqual(plain(api.generate(type, 1, difficulty, 0, variant)), question, "Actual runtime route must use the inspected question");
      assert.deepEqual(plain(api.generate(type, 1, difficulty, 987, variant)), question, "Seed cannot create unverified numerical variants");
      assert.deepEqual(plain(source.getQuestion(IDS[kind], variant + 3, difficulty)), question, "Finite pool wraps to its actual three verified entries");
      prompts.add(text(question.prompt));
    }
    assert.equal(prompts.size, 9, "Three pools and three scaffold levels must have distinct prompts");
  }

  const negativeControls = [];
  const rejectQuestion = (name, kind, variant, difficulty, mutate) => {
    const question = plain(source.getQuestion(IDS[kind], variant, difficulty));
    mutate(question);
    assert.throws(() => validateQuestion(question, kind, variant, difficulty, css), assert.AssertionError, `${name} must fail`);
    negativeControls.push(name);
  };
  rejectQuestion("wrong-answer", 1, 0, 0, q => { q.answer = "0"; });
  rejectQuestion("range-strictness-off-by-one", 2, 0, 0, q => { q.answer = q.answer.replace("이상", "초과"); });
  rejectQuestion("impossible-box-count", 4, 0, 0, q => { q.answer = "0상자 초과 2상자 미만"; });
  rejectQuestion("moved-number-line-endpoint", 0, 0, 0, q => { q.answerVisual = q.answerVisual.replace(/cx="([\d.]+)"/, (_, x) => `cx="${Number(x) + 10}"`); });
  rejectQuestion("closed-open-endpoint", 0, 0, 0, q => { q.answerVisual = q.answerVisual.replace("is-open", "is-closed"); });
  rejectQuestion("moved-number-line-segment", 0, 0, 0, q => { q.answerVisual = q.answerVisual.replace(/(<line class="source52-range-interval"[^>]*x2=")([\d.]+)/, (_, before, x) => `${before}${Number(x) + 10}`); });
  rejectQuestion("visible-lower-strictness-changed", 0, 0, 0, q => { q.prompt = q.prompt.replace("&lt; □", "≤ □"); });
  rejectQuestion("visible-upper-inclusion-changed", 0, 0, 1, q => { q.prompt = q.prompt.replace("□ ≤", "□ &lt;"); });
  rejectQuestion("continuous-range-restricted-to-naturals", 0, 0, 0, q => { q.questionModel.naturalNumbersOnly = true; });
  rejectQuestion("student-answer-leak", 0, 0, 0, q => { q.prompt = q.prompt.replace(/<svg\b[\s\S]*?<\/svg>/, q.answerVisual); });
  rejectQuestion("visible-hard-condition-drift", 1, 0, 1, q => { q.prompt = q.prompt.replace('data-given="count-extra">28', 'data-given="count-extra">29'); });
  rejectQuestion("false-visible-solution-equation", 1, 0, 0, q => { q.solution = q.solution.replace(/= (\d+)<\/span>/, '= 0</span>'); });
  rejectQuestion("wrong-easy-hint", 4, 0, -1, q => { q.prompt = q.prompt.replace("가장 많이 담을 수 있는 귤은 34개", "가장 많이 담을 수 있는 귤은 35개"); });
  rejectQuestion("model-prompt-drift", 2, 0, 0, q => { q.questionModel.seatsA++; });
  rejectQuestion("false-publisher-verification", 0, 0, 0, q => { q.publisherKeyVerified = true; });
  rejectQuestion("wrong-question-source-id", 1, 0, 0, q => { q.sourceItemId = IDS[2]; });
  rejectQuestion("wrong-question-generator-key", 1, 0, 0, q => { q.generator = KEYS[2]; });
  rejectQuestion("unverified-extra-pool", 1, 0, 0, q => { q.verifiedVariantCount = 4; });
  assert.throws(() => independentAnswer(4, { total: 5, minimum: 8, upperExclusive: 10 }), assert.AssertionError);
  negativeControls.push("infeasible-box-conditions");
  const firstType = types.find(type => type.id === IDS[0]);
  for (const [name, mutate] of [
    ["locked-type", type => { type.reviewLocked = true; }],
    ["unverified-type", type => { type.sourceVerified = false; }],
    ["source-id-mismatch", type => { type.sourceItemId = IDS[1]; }],
    ["generator-key-mismatch", type => { type.generatorKey = KEYS[1]; }],
    ["runtime-id-mismatch", type => { type.id = IDS[1]; }]
  ]) {
    const damaged = plain(firstType); mutate(damaged);
    assert.equal(api.generatorKey(damaged), "", `${name}: no exposed key`);
    assert.equal(api.generate(damaged, 1, 0, 0, 0), null, `${name}: generation must stop`);
    negativeControls.push(name);
  }
  for (const variant of [-1, 0.5, NaN]) {
    assert.throws(() => source.getQuestion(IDS[0], variant, 0));
    negativeControls.push(`invalid-variant-${String(variant)}`);
  }
  assert.throws(() => source.getQuestion(IDS[0], 0, 2));
  negativeControls.push("invalid-difficulty");
  const report = { status: "passed", sourceItems: IDS.length, numericalVariants: 15, configurations: states.length,
    publisherKeyVerified: false, negativeControls, states, validation: "visible conditions, independent enumeration, arithmetic readback, SVG coordinate readback, finite pool and runtime gates" };
  if (process.env.HSE_AUDIT_OUTPUT) {
    assert(path.isAbsolute(process.env.HSE_AUDIT_OUTPUT), "Evidence output must be an absolute private path");
    fs.mkdirSync(process.env.HSE_AUDIT_OUTPUT, { recursive: true });
    fs.writeFileSync(path.join(process.env.HSE_AUDIT_OUTPUT, "range-e1-math-audit.json"), JSON.stringify(report, null, 2) + "\n");
  }
  console.log(`5-2 range Exploration 1: ${states.length} configurations, 15 finite numerical variants, visible conditions and solutions, continuous SVG, ${negativeControls.length} rejected negative controls passed.`);
  return report;
}

module.exports = { run, parseVisible, independentAnswer, validateQuestion, verifyNumberLine };
if (require.main === module) run();
