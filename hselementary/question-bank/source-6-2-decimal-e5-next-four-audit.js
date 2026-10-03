"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({ window: {} });
const load = name => vm.runInContext(fs.readFileSync(path.join(__dirname, name), "utf8"), context, { filename: name });
load("source-inventory-grade6.js");
load("curriculum.js");
load("generators.js");
const { window } = context;
const api = window.HSE_GENERATORS;
const catalog = window.HSE_SOURCE_INVENTORY_GRADE6;
const curriculum = window.HSE_CURRICULUM;
const types = curriculum.semesters.flatMap(semester => semester.units)
  .flatMap(unit => unit.subunits).flatMap(subunit => subunit.types);
const catalogBefore = JSON.stringify(catalog), curriculumBefore = JSON.stringify(curriculum);
const freeze = value => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
};
freeze(catalog);
freeze(curriculum);

// Printed conditions on e5-pdf-page-24.png (PDF 24 / printed 26), not an inventory answer or handwriting.
const sources = [
  { suffix: "exploration-1", key: "sourceGrade6SecondDecimalDivisionE5Exploration", answer: "3시간",
    facts: { sampleDistance: "276.3", sampleSeconds: "16200", fuelPerKm: "0.15", usedFuel: "27.63" },
    designs: ["speed-given", "source-distance-and-time", "remaining-fuel-extra-step"] },
  { suffix: "example-2", key: "sourceGrade6SecondDecimalDivisionE5Example2", answer: "35520원",
    facts: { sampleFuel: "1.2", sampleDistance: "17.4", price: "1480", targetDistance: "348" },
    designs: ["distance-per-liter-given", "source-fuel-distance-ratio", "two-day-total-distance"] },
  { suffix: "example-3", key: "sourceGrade6SecondDecimalDivisionE5Example3", answer: "8분 45초",
    facts: { timeA: "195", volumeA: "54.6", timeB: "150", volumeB: "38.1", targetVolume: "280.35" },
    designs: ["seconds-given", "source-mixed-times", "initial-water-extra-step"] },
  { suffix: "example-4", key: "sourceGrade6SecondDecimalDivisionE5Example4", answer: "2시간 30분",
    facts: { riverDistance: "20.1", riverSeconds: "5400", stillDistance: "36", stillSeconds: "3600", targetDistance: "56.5" },
    designs: ["current-speed-given", "source-drift-distance", "downstream-observation"] }
];
const idFor = source => `6-2-u2-e5-${source.suffix}`;
const N = "(\\d+(?:\\.\\d+)?)";
const CLOCK = "((?:\\d+시간(?:\\s*\\d+분)?|\\d+분(?:\\s*\\d+초)?|\\d+초))";
const regex = pattern => new RegExp(pattern, "u");
const read = (prompt, pattern, required = true) => {
  const matches = [...prompt.matchAll(new RegExp(pattern.source, "gu"))];
  assert(matches.length <= 1, `중복되거나 서로 다른 조건: ${pattern}`);
  if (required) assert.equal(matches.length, 1, `지문에 필요한 조건 없음: ${pattern}\n${prompt}`);
  return matches[0] || null;
};

const gcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
};
const q = (n, d = 1n) => {
  assert(d !== 0n, "분모는 0이 아니어야 함");
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
};
const decimal = text => {
  assert.match(text, /^\d+(?:\.\d+)?$/, `정확한 지문 수치: ${text}`);
  const [whole, fraction = ""] = text.split(".");
  return q(BigInt(whole + fraction), 10n ** BigInt(fraction.length));
};
const add = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => q(a.n * b.n, a.d * b.d);
const equal = (a, b, message) => assert.equal(a.n * b.d, b.n * a.d, message);
const positive = (...values) => values.forEach(value => assert(value.n > 0n, "수량은 양수여야 함"));
const seconds = text => {
  const clock = text.trim().match(/^(?:(\d+)시간)?\s*(?:(\d+)분)?\s*(?:(\d+)초)?$/u);
  assert(clock && clock.slice(1).some(value => value !== undefined), `시간 단위를 읽을 수 없음: ${text}`);
  const hours = BigInt(clock[1] || 0), minutes = BigInt(clock[2] || 0), secs = BigInt(clock[3] || 0);
  if (clock[1]) assert(minutes < 60n, "시간 뒤의 분은 60 미만");
  if (clock[1] || clock[2]) assert(secs < 60n, "분 뒤의 초는 60 미만");
  const result = q(hours * 3600n + minutes * 60n + secs);
  positive(result);
  return result;
};
const hourAnswer = totalSeconds => {
  assert.equal(totalSeconds % 60n, 0n, "시간 답은 온전한 분 단위");
  const minutes = totalSeconds / 60n;
  return `${minutes / 60n}시간${minutes % 60n ? ` ${minutes % 60n}분` : ""}`;
};
const minuteAnswer = totalSeconds => `${totalSeconds / 60n}분${totalSeconds % 60n ? ` ${totalSeconds % 60n}초` : ""}`;

// Solve A*x=B after clearing exact decimal denominators. A>0 proves uniqueness on the entire domain.
// No per-hour/per-second rate from the generator or from the earlier audits is used here.
const crossRoot = (coefficient, target, unitStep) => {
  positive(coefficient, target);
  const a = coefficient.n * target.d, b = target.n * coefficient.d;
  assert.equal(b % a, 0n, "교차곱 등식의 답은 정확한 정수여야 함");
  const root = b / a;
  assert(root > 0n && root % unitStep === 0n, "답의 양수·단위 조건");
  assert.equal(a * root, b, "답을 교차곱 등식에 다시 넣어 확인");
  assert(a * (root - unitStep) < b && a * (root + unitStep) > b, "양의 계수이므로 같은 답을 주는 다른 시간·금액 없음");
  return root;
};

const solvePrompt = (source, prompt, level) => {
  assert.doesNotMatch(prompt, /<|>|정답|힌트|NaN|Infinity|undefined/, "학생 지문에 풀이 데이터나 그림 없음");
  const facts = {}, branches = [], issues = [];
  let coefficient, target, unitStep = 60n;

  if (source.suffix === "exploration-1") {
    const hourly = read(prompt, regex(`1시간에\\s*${N}\\s*km를 달립니다`), false);
    const measured = read(prompt, regex(`${N}\\s*km를 달리는 데\\s*${CLOCK}`), false);
    assert.equal(Boolean(hourly), level === 0, "쉬움에서만 1시간 거리 직접 제시");
    assert.equal(Boolean(measured), level !== 0, "기준·어려움에서는 관찰 거리와 시간 제시");
    facts.sampleDistance = decimal(hourly ? hourly[1] : measured[1]);
    facts.sampleSeconds = hourly ? q(3600n) : seconds(measured[2]);
    facts.fuelPerKm = decimal(read(prompt, regex(`1km를 달릴 때 휘발유\\s*${N}\\s*L`))[1]);
    const used = read(prompt, regex(`휘발유\\s*${N}\\s*L를 (?:사용|썼)`), false);
    const balance = read(prompt, regex(`시작할 때(?:는)? 휘발유가\\s*${N}\\s*L 있었고, (?:달리고 난 뒤|운행을 마친 뒤)(?:에는)?\\s*${N}\\s*L 남았습니다`), false);
    assert.equal(Boolean(used), level !== 2, "쉬움·기준은 사용한 휘발유 제시");
    assert.equal(Boolean(balance), level === 2, "어려움은 처음·남은 휘발유에서 사용량 구하기");
    if (balance) {
      facts.initialFuel = decimal(balance[1]); facts.remainingFuel = decimal(balance[2]);
      positive(facts.initialFuel, facts.remainingFuel);
      facts.usedFuel = sub(facts.initialFuel, facts.remainingFuel);
    } else facts.usedFuel = decimal(used[1]);
    positive(facts.sampleDistance, facts.sampleSeconds, facts.fuelPerKm, facts.usedFuel);
    assert.match(prompt, /얼마 동안 달린|몇 시간/, "물음은 달린 시간");
    // F_per_km * D_sample * seconds_target = F_used * seconds_sample.
    coefficient = mul(facts.fuelPerKm, facts.sampleDistance);
    target = mul(facts.usedFuel, facts.sampleSeconds);
    branches.push(hourly ? "hourly-distance-given" : "distance-and-clock-observed", balance ? "fuel-balance" : "used-fuel-given");
    const sameSpeed = /같은\s*빠르기로|일정한\s*빠르기로|빠르기(?:는|가)\s*(?:항상\s*)?(?:같|일정)/u.test(prompt)
      && !/같지 않|빠르기(?:는|가)\s*다르/u.test(prompt);
    if (!sameSpeed) issues.push("관찰한 때와 목표 운행의 빠르기가 같다는 문장 조건 없음 (same-speed)");
  } else if (source.suffix === "example-2") {
    unitStep = 1n;
    const perLiter = read(prompt, regex(`휘발유 1L로\\s*${N}\\s*km를 갑니다`), false);
    const sample = read(prompt, regex(`휘발유\\s*${N}\\s*L로\\s*${N}\\s*km를 갈 수 있는 자동차`), false);
    assert.equal(Boolean(perLiter), level === 0, "쉬움에서만 1L로 가는 거리 제시");
    assert.equal(Boolean(sample), level !== 0, "기준·어려움은 연료와 거리 관찰값 제시");
    facts.sampleFuel = perLiter ? q(1n) : decimal(sample[1]);
    facts.sampleDistance = decimal(perLiter ? perLiter[1] : sample[2]);
    facts.price = decimal(read(prompt, regex(`휘발유 1L의 가격이\\s*${N}\\s*원`))[1]);
    assert.equal(facts.price.d, 1n, "1L 가격은 정수 원");
    const single = read(prompt, regex(`이 자동차가\\s*${N}\\s*km를 가는 데`), false);
    const twoDays = read(prompt, regex(`첫날\\s*${N}\\s*km를, 다음 날\\s*${N}\\s*km를 갔다면`), false);
    assert.equal(Boolean(single), level !== 2, "쉬움·기준은 한 거리");
    assert.equal(Boolean(twoDays), level === 2, "어려움은 이틀 거리의 합");
    if (twoDays) {
      facts.firstDistance = decimal(twoDays[1]); facts.secondDistance = decimal(twoDays[2]);
      positive(facts.firstDistance, facts.secondDistance);
      facts.targetDistance = add(facts.firstDistance, facts.secondDistance);
    } else facts.targetDistance = decimal(single[1]);
    positive(facts.sampleFuel, facts.sampleDistance, facts.price, facts.targetDistance);
    assert.match(prompt, /필요한 휘발유값은 얼마/, "목표는 휘발유값, 연료량이 아님");
    // D_sample * cost = D_target * F_sample * price_per_litre.
    coefficient = facts.sampleDistance;
    target = mul(mul(facts.targetDistance, facts.sampleFuel), facts.price);
    branches.push(perLiter ? "one-litre-distance-given" : "sample-fuel-and-distance", twoDays ? "two-day-distance-sum" : "single-target-distance");
  } else if (source.suffix === "example-3") {
    unitStep = 1n;
    assert.match(prompt, /각각 따로 틀어/, "두 수도의 관찰은 각각 따로 잰 것");
    assert.match(prompt, /각 수도꼭지에서 1초 동안 나오는 물의 양이 일정/, "각 수도에서 일정하게 물이 나옴");
    const samples = read(prompt, regex(`㉮에서는\\s*${CLOCK} 동안\\s*${N}\\s*L, ㉯에서는\\s*${CLOCK} 동안\\s*${N}\\s*L의 물`));
    facts.timeA = seconds(samples[1]); facts.volumeA = decimal(samples[2]);
    facts.timeB = seconds(samples[3]); facts.volumeB = decimal(samples[4]);
    assert.equal(samples[1].includes("분"), level !== 0, "㉮의 분·초 변환은 기준부터 필요");
    assert.equal(samples[3].includes("분"), level !== 0, "㉯의 분·초 변환은 기준부터 필요");
    const emptyGoal = read(prompt, regex(`함께 틀어\\s*${N}\\s*L의 물을 받으려면`), false);
    const initial = read(prompt, regex(`처음에\\s*${N}\\s*L의 물이 들어 있는 (?:수조|물통)`), false);
    const final = read(prompt, regex(`(?:수조|물통)에 든 물이\\s*${N}\\s*L에 이를 때까지`), false);
    assert.equal(Boolean(initial), level === 2, "어려움에서만 처음 물 조건");
    assert.equal(Boolean(final), level === 2, "어려움에서만 끝 물 조건");
    assert.equal(Boolean(emptyGoal), level !== 2, "쉬움·기준은 받을 물의 양");
    if (initial) {
      facts.initialVolume = decimal(initial[1]); facts.finalVolume = decimal(final[1]);
      positive(facts.initialVolume, facts.finalVolume);
      facts.targetVolume = sub(facts.finalVolume, facts.initialVolume);
    } else facts.targetVolume = decimal(emptyGoal[1]);
    positive(facts.timeA, facts.timeB, facts.volumeA, facts.volumeB, facts.targetVolume);
    assert.match(prompt, /몇 분 몇 초/, "시간은 분·초로 물음");
    // (V_A*T_B + V_B*T_A) * seconds = V_target*T_A*T_B.
    coefficient = add(mul(facts.volumeA, facts.timeB), mul(facts.volumeB, facts.timeA));
    target = mul(mul(facts.targetVolume, facts.timeA), facts.timeB);
    branches.push(level === 0 ? "sample-seconds-given" : "two-mixed-clocks", initial ? "final-minus-initial-water" : "water-to-collect");
  } else if (source.suffix === "example-4") {
    const hourly = read(prompt, regex(`강물이 1시간에\\s*${N}\\s*km씩 흐릅니다`), false);
    const drift = read(prompt, regex(`${CLOCK} 동안\\s*${N}\\s*km를 흐르는 강`), false);
    assert.equal(Boolean(hourly), level === 0, "쉬움에서만 강물의 1시간 거리 제시");
    assert.equal(Boolean(drift), level !== 0, "기준·어려움은 강물의 관찰 거리·시간");
    facts.riverDistance = decimal(hourly ? hourly[1] : drift[2]);
    facts.riverSeconds = hourly ? q(3600n) : seconds(drift[1]);
    const still = read(prompt, regex(`흐르지 않는 물에서 이 배는 1시간에\\s*${N}\\s*km를 갑니다`), false);
    const downstream = read(prompt, regex(`강물이 흐르는 방향으로\\s*${CLOCK} 동안\\s*${N}\\s*km를 갔습니다`), false);
    assert.equal(Boolean(still), level !== 2, "쉬움·기준은 흐르지 않는 물의 배 관찰값");
    assert.equal(Boolean(downstream), level === 2, "어려움은 강물을 따라간 관찰값");
    facts.targetDistance = decimal(read(prompt, regex(`강물이 흐르는 반대 방향으로\\s*${N}\\s*km를 가려면`))[1]);
    assert.match(prompt, /몇 시간 몇 분/, "시간은 시간·분으로 물음");
    if (still) {
      facts.stillDistance = decimal(still[1]); facts.stillSeconds = q(3600n);
      positive(facts.stillDistance);
      // (D_still*T_river - D_river*T_still) * seconds = D_target*T_still*T_river.
      coefficient = sub(mul(facts.stillDistance, facts.riverSeconds), mul(facts.riverDistance, facts.stillSeconds));
      target = mul(mul(facts.targetDistance, facts.stillSeconds), facts.riverSeconds);
    } else {
      facts.downSeconds = seconds(downstream[1]); facts.downDistance = decimal(downstream[2]);
      positive(facts.downSeconds, facts.downDistance);
      if (!/배가 흐르지 않는 물에서 내는 빠르기는 강물을 따라갈 때와 거슬러 갈 때 같습니다/u.test(prompt)) {
        issues.push("강물을 따라갈 때와 거슬러 갈 때 배 자체의 빠르기가 같다는 조건 없음 (same-boat-speed)");
      }
      // Reverse the downstream observation directly: upstream = downstream minus two river contributions.
      coefficient = sub(mul(facts.downDistance, facts.riverSeconds), mul(q(2n), mul(facts.riverDistance, facts.downSeconds)));
      target = mul(mul(facts.targetDistance, facts.downSeconds), facts.riverSeconds);
    }
    positive(facts.riverDistance, facts.riverSeconds, facts.targetDistance, coefficient);
    branches.push(hourly ? "hourly-river-distance-given" : "river-distance-and-clock", still ? "boat-in-still-water" : "boat-downstream-observation");
  } else throw new Error(`알 수 없는 원본: ${source.suffix}`);

  const root = crossRoot(coefficient, target, unitStep);
  const answer = source.suffix === "example-2" ? `${root}원`
    : source.suffix === "example-3" ? minuteAnswer(root) : hourAnswer(root);
  return { root, answer, facts, branches, issues, coefficient, target };
};

const verify = (source, item, level, variant) => {
  const result = solvePrompt(source, item.prompt, level);
  assert.equal(item.answer, result.answer, `${idFor(source)}: 실제 지문의 교차곱으로 구한 답`);
  if (source.suffix === "example-2") {
    assert.match(item.answer, /^[1-9]\d*원$/u);
  } else {
    assert.equal(seconds(item.answer).n, result.root, "표시한 답을 초로 다시 바꾸어 확인");
    assert.equal(seconds(item.answer).d, 1n);
    assert.doesNotMatch(item.answer, /약|반올림|소수/);
  }
  equal(mul(result.coefficient, q(result.root)), result.target, "반올림 없는 교차곱 역대입");
  assert.equal(item.sourceItemId, idFor(source));
  assert.equal(item.generator, source.key);
  assert.equal(item.generationMode, "fixed-verified-pool");
  assert.equal(item.verifiedVariantCount, 3);
  assert.equal(item.verifiedPoolIndex, variant);
  assert(item.answerVisual.includes(result.answer), "풀이 화면의 답도 같음");
  assert(item.answerVisual.includes(`data-difficulty-design="${source.designs[level]}"`), "난이도 표시는 실제 문장 줄기와 같음");
  if (source.suffix === "example-3" && level !== 0) {
    assert.match(item.solution, /㉮의.+?초, ㉯의.+?초입니다/u, "풀이에도 두 분·초 변환을 명시");
    assert(item.solution.includes(`${result.facts.timeA.n}초`) && item.solution.includes(`${result.facts.timeB.n}초`), "변환한 두 시간도 독립 계산과 같음");
  }
  assert.doesNotMatch(item.solution + item.answerVisual, /NaN|Infinity|undefined/);
  return result;
};

let checks = 0, moduloChecks = 0, negativeChecks = 0, contractNegativeChecks = 0, originalChecks = 0;
const conditionIssues = [], summaries = [];
for (const source of sources) {
  const realType = types.find(type => type.sourceItemId === idFor(source));
  assert(realType && catalog.items.some(item => item.sourceItemId === idFor(source)), `${idFor(source)}: 원본 연결 필요`);
  // The real release flag is deliberately not asserted. Remove its variant so the explicit API argument selects the pool.
  const { variant: _catalogVariant, ...identity } = realType;
  const candidate = Object.freeze({ ...identity, sourceItemId: idFor(source), generatorKey: source.key, reviewLocked: false });
  const prompts = new Set(), sourceConditions = new Set();
  const branchesByDifficulty = new Map();
  for (const difficulty of [-1, 0, 1]) {
    const level = difficulty + 1, poolPrompts = new Set();
    for (let variant = 0; variant < 3; variant += 1) {
      const item = api.generate(candidate, 0, difficulty, 20261003, variant);
      assert(item, "잠긴 실제 유형도 별도 후보 fixture로 계산 검사 가능");
      const result = verify(source, item, level, variant);
      checks += 1;
      for (const message of result.issues) conditionIssues.push(`${idFor(source)} / difficulty ${difficulty} / variant ${variant}: ${message}`);
      // These are wraparound checks, not additional distinct-condition coverage or repeated-seed tests.
      assert.deepEqual(api.generate(candidate, 0, difficulty, 20261003, variant + 3), item, "variant modulo 3");
      moduloChecks += 1;
      assert.throws(() => verify(source, { ...item, answer: source.suffix === "example-2" ? "0원" : "0시간" }, level, variant));
      assert.throws(() => verify(source, { ...item, prompt: item.prompt.replace(/\d/u, "9") }, level, variant));
      negativeChecks += 2;
      if (source.suffix === "exploration-1") {
        const withoutSpeed = item.prompt.replace(/항상 같은 빠르기로 달리며,\s*/u, "");
        assert.notEqual(withoutSpeed, item.prompt, "실제 same-speed 문장을 제거하는 음성 검사");
        assert(solvePrompt(source, withoutSpeed, level).issues.some(issue => issue.includes("same-speed")), "빠르기 조건이 없으면 수치가 맞아도 문장 계약에서 실패");
        contractNegativeChecks += 1;
      }
      if (source.suffix === "example-4" && level === 2) {
        const withoutSpeed = item.prompt.replace(/배가 흐르지 않는 물에서 내는 빠르기는 강물을 따라갈 때와 거슬러 갈 때 같습니다\.\s*/u, "");
        assert.notEqual(withoutSpeed, item.prompt);
        assert(solvePrompt(source, withoutSpeed, level).issues.some(issue => issue.includes("same-boat-speed")), "배 자체의 빠르기 조건 누락 검출");
        contractNegativeChecks += 1;
      }
      poolPrompts.add(item.prompt); prompts.add(item.prompt);
      sourceConditions.add(JSON.stringify(result.facts, (_, value) => typeof value === "bigint" ? String(value) : value));
      branchesByDifficulty.set(difficulty, result.branches.join(" / "));
      if (difficulty === 0 && variant === 0) {
        assert.equal(result.answer, source.answer, "24쪽 원본 답을 독립 계산");
        for (const [name, value] of Object.entries(source.facts)) equal(result.facts[name], decimal(value), `${idFor(source)}: 원본 조건 ${name}`);
        originalChecks += 1;
        summaries.push({ sourceItemId: idFor(source), originalAnswer: result.answer, pdfPage: 24, printedPage: 26,
          publisherAnswerKeyVerified: false, handwritingUsed: false, answerEvidence: "printed-conditions-and-generated-statement-cross-products" });
      }
    }
    assert.equal(poolPrompts.size, 3, "각 난이도에는 서로 다른 세 고정 지문");
  }
  assert.equal(prompts.size, 9, "세 난이도의 실제 지문이 서로 다름");
  assert.equal(new Set(branchesByDifficulty.values()).size, 3, "숫자뿐 아니라 문장 조건 줄기가 세 가지여야 함");
  assert(sourceConditions.size >= 6, "난이도 문장·고정 풀을 모두 읽었는지 확인");
  summaries[summaries.length - 1].difficultyBranches = Object.fromEntries(branchesByDifficulty);
}

assert.throws(() => seconds("2시간 60분"), /60 미만/u);
assert.throws(() => seconds("8분 60초"), /60 미만/u);
assert.throws(() => crossRoot(q(0n), q(1n), 1n), /양수/u);
assert.throws(() => crossRoot(q(3n), q(1n), 1n), /정수/u);
assert.equal(JSON.stringify(catalog), catalogBefore, "카탈로그 수정 없음");
assert.equal(JSON.stringify(curriculum), curriculumBefore, "실제 공개·잠금 상태 수정 없음");
assert.equal(checks, 36);
assert.equal(moduloChecks, 36);
assert.equal(negativeChecks, 72);
assert.equal(contractNegativeChecks, 12);
assert.equal(originalChecks, 4);

console.log(`NUMERIC PASS: 36 distinct statement conditions / 36 modulo checks / 72 numeric negative checks / 12 speed-contract negative checks / 4 exact original targets`);
console.log(JSON.stringify(summaries, null, 2));
if (conditionIssues.length) {
  console.error(`STATEMENT CONTRACT FAIL: ${conditionIssues.length} conditions`);
  conditionIssues.forEach(message => console.error(message));
  process.exitCode = 1;
} else console.log("STATEMENT CONTRACT PASS: source conditions, three real difficulty branches, same-speed contract");
console.log("Candidate calculation only; publisher key not verified; handwriting not used; no public release decision or file writes.");
