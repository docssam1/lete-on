(function (root, factory) {
  "use strict";

  const exported = factory(root || {});
  if (typeof module !== "undefined" && module.exports) module.exports = exported;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const api = root.HSE_GENERATORS;
  if (!api) throw new Error("5-2 원문형 생성기를 불러오지 못했습니다.");

  const GENERATOR_KEY = "sourceGrade5Semester2Exploration1";
  const gcd = (left, right) => {
    let a = Math.abs(Math.trunc(left));
    let b = Math.abs(Math.trunc(right));
    while (b) [a, b] = [b, a % b];
    return a || 1;
  };
  const rational = (numerator, denominator = 1) => {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) throw new Error("올바르지 않은 분수입니다.");
    const sign = denominator < 0 ? -1 : 1;
    const divisor = gcd(numerator, denominator);
    return { n: sign * numerator / divisor, d: Math.abs(denominator) / divisor };
  };
  const add = (left, right) => rational(left.n * right.d + right.n * left.d, left.d * right.d);
  const multiply = (left, right) => rational(left.n * right.n, left.d * right.d);
  const compare = (left, right) => left.n * right.d - right.n * left.d;
  const mixed = (whole, numerator = 0, denominator = 1) => rational(whole * denominator + numerator, denominator);
  const formatFraction = value => {
    const item = rational(value.n, value.d);
    if (item.d === 1) return String(item.n);
    const whole = Math.floor(item.n / item.d);
    const remainder = item.n % item.d;
    return whole > 0 ? `${whole} ${remainder}/${item.d}` : `${item.n}/${item.d}`;
  };
  const formatInteger = value => Number(value).toLocaleString("ko-KR");
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const poolIndexForSeed = (seed, count) => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % count;
  };
  const naturalSum = values => values.reduce((sum, value) => sum + value, 0);
  const integers = (start, end) => Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  const uniqueAnswer = (condition, sourceItemId, message) => {
    if (!condition) throw new Error(`${sourceItemId}: ${message}`);
  };

  const numberLine = ({ start, end, low, high, includeLow, includeHigh, solved, label = "수의 범위" }) => {
    const width = 520;
    const left = 38;
    const right = 482;
    const y = 62;
    const values = integers(start, end);
    const x = value => left + (value - start) * (right - left) / (end - start);
    const ticks = values.map(value => `<g class="source52-number-tick"><line x1="${x(value)}" y1="54" x2="${x(value)}" y2="70"/><text x="${x(value)}" y="92">${value}</text></g>`).join("");
    const answer = solved ? `<line class="source52-number-range" x1="${x(low)}" y1="${y}" x2="${x(high)}" y2="${y}"/><circle class="source52-number-end ${includeLow ? "is-closed" : "is-open"}" cx="${x(low)}" cy="${y}" r="7"/><circle class="source52-number-end ${includeHigh ? "is-closed" : "is-open"}" cx="${x(high)}" cy="${y}" r="7"/>` : "";
    return `<svg class="source52-number-line" viewBox="0 0 ${width} 112" role="img" aria-label="${escapeHtml(label)}" data-low="${low}" data-high="${high}" data-low-included="${includeLow}" data-high-included="${includeHigh}"><line class="source52-number-axis" x1="24" y1="${y}" x2="496" y2="${y}"/><path class="source52-number-arrow" d="M24 ${y}l9 -5v10zM496 ${y}l-9 -5v10z"/>${ticks}${answer}</svg>`;
  };

  const rangeTable = rows => `<table class="source52-range-table"><tbody>${rows.map(row => `<tr><th>${escapeHtml(row.label)}</th><td>${row.html}</td></tr>`).join("")}</tbody></table>`;
  const cardRow = digits => `<div class="source52-card-row" aria-label="수 카드 ${digits.join(", ")}">${digits.map(digit => `<span>${digit}</span>`).join("")}</div>`;
  const mathBoard = (title, rows) => `<div class="source52-math-board"><strong>${escapeHtml(title)}</strong>${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><b>${value}</b></div>`).join("")}</div>`;
  const answerVisual = (sourceItemId, body, poolIndex) => `<div class="source52-answer-visual" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${body}</div>`;

  const rangePools = Object.freeze([
    Object.freeze({ low: 18, high: 27 }),
    Object.freeze({ low: 42, high: 51 }),
    Object.freeze({ low: 63, high: 72 })
  ]);
  const unionPools = Object.freeze([
    Object.freeze({ a: 14, b: 25, c: 20, d: 36 }),
    Object.freeze({ a: 31, b: 44, c: 38, d: 53 }),
    Object.freeze({ a: 52, b: 66, c: 60, d: 78 })
  ]);

  const SPECS = new Map();
  const define = (sourceItemId, pools, build, options = {}) => SPECS.set(sourceItemId, { sourceItemId, pools, build, ...options });

  define("5-2-u1-e1-exploration-range-expression", rangePools, data => {
    const answer = `${data.low}보다 크고 ${data.high} 이하`;
    return {
      prompt: `${data.low}<□≤${data.high}일 때, □가 나타내는 자연수의 범위를 말로 쓰고 자연수의 양 끝을 쓰세요.`,
      answer: `${answer}; ${data.low + 1} 이상 ${data.high} 이하`,
      solution: `${data.low}은 포함하지 않고 ${data.high}은 포함합니다. 따라서 자연수로는 ${data.low + 1}부터 ${data.high}까지입니다.`,
      proof: { candidates: [`${data.low}<n≤${data.high}`] }
    };
  });

  define("5-2-u1-e1-exploration-range-number-line", rangePools, data => {
    const diagram = numberLine({ start: data.low - 1, end: data.high + 1, low: data.low, high: data.high, includeLow: false, includeHigh: true, solved: false });
    const solved = numberLine({ start: data.low - 1, end: data.high + 1, low: data.low, high: data.high, includeLow: false, includeHigh: true, solved: true, label: `${data.low}보다 크고 ${data.high} 이하인 범위의 정답 수직선` });
    return {
      prompt: `${data.low}보다 크고 ${data.high} 이하인 수의 범위를 수직선에 나타내세요.${diagram}`,
      answer: `${data.low}에는 열린 점, ${data.high}에는 닫힌 점`,
      solution: `${data.low}은 포함하지 않으므로 열린 점, ${data.high}은 포함하므로 닫힌 점으로 표시하고 그 사이를 잇습니다.`,
      answerVisualBody: solved,
      proof: { candidates: [`(${data.low},${data.high}]`] }
    };
  }, { visual: true });

  define("5-2-u1-e1-example-1", [432, 518, 675].map(count => ({ count })), data => {
    const answer = 1000 - data.count;
    return {
      prompt: `㉠과 ㉡은 세 자리 자연수입니다. ㉠ 이상 ㉡ 이하인 자연수가 모두 ${data.count}개일 때, ㉠이 될 수 있는 가장 큰 수를 구하세요.`,
      answer: String(answer),
      solution: `㉠을 가장 크게 하려면 ㉡을 가장 큰 세 자리 수 999로 둡니다. 999-${data.count}+1=${answer}입니다.`,
      proof: { candidates: [answer], witness: { upper: 999, count: 999 - answer + 1 } }
    };
  });

  define("5-2-u1-e1-example-2", [
    { seatsA: 5, chairsA: 83, seatsB: 7, chairsB: 60 },
    { seatsA: 6, chairsA: 68, seatsB: 9, chairsB: 46 },
    { seatsA: 7, chairsA: 61, seatsB: 8, chairsB: 54 }
  ], data => {
    const first = integers(data.seatsA * (data.chairsA - 1) + 1, data.seatsA * data.chairsA);
    const second = new Set(integers(data.seatsB * (data.chairsB - 1) + 1, data.seatsB * data.chairsB));
    const common = first.filter(value => second.has(value));
    uniqueAnswer(common.length > 0, "5-2-u1-e1-example-2", "두 의자 조건의 공통 범위가 없습니다.");
    return {
      prompt: `한 의자에 ${data.seatsA}명씩 앉히면 의자가 ${data.chairsA}개 필요하고, ${data.seatsB}명씩 앉히면 의자가 ${data.chairsB}개 필요합니다. 학생 수의 범위를 이상과 미만을 사용하여 나타내세요.`,
      answer: `${common[0]} 이상 ${common.at(-1) + 1} 미만`,
      solution: `첫 조건은 ${data.seatsA * (data.chairsA - 1)}명 초과 ${data.seatsA * data.chairsA}명 이하, 둘째 조건은 ${data.seatsB * (data.chairsB - 1)}명 초과 ${data.seatsB * data.chairsB}명 이하입니다. 공통 자연수는 ${common[0]}부터 ${common.at(-1)}까지입니다.`,
      proof: { candidates: [common.join(",")], witness: common }
    };
  });

  define("5-2-u1-e1-example-3", [
    { total: 50, first: 38, second: 27 },
    { total: 64, first: 49, second: 31 },
    { total: 72, first: 54, second: 43 }
  ], data => {
    const low = data.first + data.second - data.total;
    const high = Math.min(data.first, data.second);
    return {
      prompt: `회원 ${data.total}명 중 첫 활동에 참여한 사람은 ${data.first}명, 둘째 활동에 참여한 사람은 ${data.second}명입니다. 두 활동에 모두 참여한 사람 수의 범위를 이상과 이하를 사용하여 나타내세요.`,
      answer: `${low} 이상 ${high} 이하`,
      solution: `겹치는 사람 수는 적어도 ${data.first}+${data.second}-${data.total}=${low}명이고, 많아도 더 작은 집단의 수인 ${high}명입니다.`,
      proof: { candidates: [`${low}-${high}`], witness: { low, high } }
    };
  });

  define("5-2-u1-e1-example-4", [
    { total: 420, minimum: 38, maximumExclusive: 49 },
    { total: 512, minimum: 45, maximumExclusive: 58 },
    { total: 684, minimum: 58, maximumExclusive: 73 }
  ], data => {
    const values = integers(1, data.total).filter(boxes => data.minimum * boxes <= data.total && data.total < data.maximumExclusive * boxes);
    uniqueAnswer(values.length > 0, "5-2-u1-e1-example-4", "가능한 상자 수가 없습니다.");
    return {
      prompt: `사탕 ${data.total}개를 한 상자에 ${data.minimum}개 이상 ${data.maximumExclusive}개 미만씩 모두 나누어 담으려고 합니다. 가능한 상자 수의 범위를 초과와 미만으로 나타내세요.`,
      answer: `${values[0] - 1} 초과 ${values.at(-1) + 1} 미만`,
      solution: `상자 수를 □라 하면 ${data.minimum}×□≤${data.total}<${data.maximumExclusive}×□입니다. 이를 만족하는 자연수는 ${values.join(", ")}입니다.`,
      proof: { candidates: [values.join(",")], witness: values }
    };
  });

  define("5-2-u1-e1-mission-1-union-count", unionPools, data => {
    const first = integers(data.a, data.b - 1);
    const second = integers(data.c + 1, data.d);
    const union = [...new Set([...first, ...second])].sort((left, right) => left - right);
    return {
      prompt: `다음 두 조건 중 하나 이상을 만족하는 자연수는 모두 몇 개인가요?${rangeTable([["(가)", `${data.a} 이상 ${data.b} 미만`], ["(나)", `${data.c} 초과 ${data.d} 이하`]].map(([label, html]) => ({ label, html })))}`,
      answer: `${union.length}개`,
      solution: `(가)는 ${first.length}개, (나)는 ${second.length}개이고, 겹치는 수는 ${first.filter(value => second.includes(value)).length}개입니다. 따라서 ${union.length}개입니다.`,
      proof: { candidates: [union.length], witness: union }
    };
  }, { visual: true });

  define("5-2-u1-e1-mission-1-intersection-sum", unionPools, data => {
    const first = integers(data.a, data.b - 1);
    const second = new Set(integers(data.c + 1, data.d));
    const common = first.filter(value => second.has(value));
    const answer = naturalSum(common);
    return {
      prompt: `다음 두 조건을 모두 만족하는 자연수들의 합을 구하세요.${rangeTable([["(가)", `${data.a} 이상 ${data.b} 미만`], ["(나)", `${data.c} 초과 ${data.d} 이하`]].map(([label, html]) => ({ label, html })))}`,
      answer: String(answer),
      solution: `두 조건에 함께 들어가는 수는 ${common.join(", ")}이고, 합은 ${answer}입니다.`,
      proof: { candidates: [answer], witness: common }
    };
  }, { visual: true });

  define("5-2-u1-e1-mission-1-sum-range", unionPools, data => {
    const firstLow = data.a;
    const firstHigh = data.b - 1;
    const secondLow = data.c + 1;
    const secondHigh = data.d;
    const low = firstLow + secondLow;
    const high = firstHigh + secondHigh;
    return {
      prompt: `조건 (가)를 만족하는 자연수 하나와 조건 (나)를 만족하는 자연수 하나를 골라 더했습니다. 합이 될 수 있는 수의 범위를 구하세요.${rangeTable([["(가)", `${data.a} 이상 ${data.b} 미만`], ["(나)", `${data.c} 초과 ${data.d} 이하`]].map(([label, html]) => ({ label, html })))}`,
      answer: `${low} 이상 ${high} 이하`,
      solution: `가장 작은 합은 ${firstLow}+${secondLow}=${low}, 가장 큰 합은 ${firstHigh}+${secondHigh}=${high}입니다.`,
      proof: { candidates: [`${low}-${high}`], witness: { low, high } }
    };
  }, { visual: true });

  define("5-2-u1-e1-mission-2-multiple-count-endpoint", [
    { lower: 31, divisor: 4, count: 12 },
    { lower: 46, divisor: 5, count: 11 },
    { lower: 52, divisor: 6, count: 13 }
  ], data => {
    const first = Math.ceil(data.lower / data.divisor) * data.divisor;
    const last = first + (data.count - 1) * data.divisor;
    const next = last + data.divisor;
    const values = integers(last + 1, next);
    return {
      prompt: `${data.lower} 이상 □ 미만인 자연수 중 ${data.divisor}의 배수가 ${data.count}개입니다. □에 들어갈 수 있는 자연수를 모두 구하세요.`,
      answer: values.join(", "),
      solution: `첫 배수는 ${first}, ${data.count}번째 배수는 ${last}, 다음 배수는 ${next}입니다. 끝값은 포함되지 않으므로 ${values.join(", ")}가 가능합니다.`,
      proof: { candidates: [values.join(",")], witness: values }
    };
  });

  define("5-2-u1-e1-mission-3-endpoint-pair", [
    { referenceLow: 120, referenceHigh: 190 },
    { referenceLow: 200, referenceHigh: 274 },
    { referenceLow: 310, referenceHigh: 389 }
  ], data => {
    const count = data.referenceHigh - data.referenceLow + 1;
    const pairs = [];
    for (let first = 10; first <= 99; first += 1) {
      const second = first + count + 1;
      if (second <= 99) pairs.push([first, second]);
    }
    return {
      prompt: `ㄱ과 ㄴ은 두 자리 자연수입니다. ㄱ 초과 ㄴ 미만인 자연수의 개수가 ${data.referenceLow} 이상 ${data.referenceHigh} 이하인 자연수의 개수와 같을 때, 순서쌍 (ㄱ, ㄴ)은 모두 몇 개인가요?`,
      answer: `${pairs.length}개`,
      solution: `기준 범위에는 ${count}개가 있습니다. ㄴ-ㄱ-1=${count}이므로 ㄴ=ㄱ+${count + 1}입니다. 두 수가 모두 두 자리인 순서쌍을 세면 ${pairs.length}개입니다.`,
      proof: { candidates: [pairs.length], witness: pairs }
    };
  });

  define("5-2-u1-e1-mission-4-card-decimal-count", [
    { digits: [0, 1, 3, 4, 6, 8], low: 140, high: 650 },
    { digits: [0, 2, 4, 5, 7, 9], low: 240, high: 750 },
    { digits: [0, 1, 2, 5, 6, 8], low: 120, high: 650 }
  ], data => {
    const values = [];
    const byWhole = new Map();
    for (const a of data.digits) for (const b of data.digits) for (const c of data.digits) {
      if (a === 0 || new Set([a, b, c]).size !== 3) continue;
      const scaled = a * 100 + b * 10 + c;
      if (scaled > data.low && scaled <= data.high) {
        values.push(scaled);
        byWhole.set(a, (byWhole.get(a) || 0) + 1);
      }
    }
    const shown = value => `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
    const lowText = shown(data.low);
    const highText = shown(data.high);
    const tally = [...byWhole].map(([whole, count]) => [`자연수 부분 ${whole}`, `${count}개`]);
    return {
      prompt: `다음 수 카드 중 서로 다른 3장을 한 번씩 사용해 소수 둘째 자리까지인 수를 만듭니다. ${lowText} 초과 ${highText} 이하인 수는 모두 몇 개인가요?${cardRow(data.digits)}`,
      answer: `${values.length}개`,
      solution: `세 카드의 순서를 모두 확인하면 자연수 부분별 개수는 ${[...byWhole].map(([whole, count]) => `${whole}에서 ${count}개`).join(", ")}입니다. 모두 ${values.length}개입니다.`,
      answerVisualBody: mathBoard("자연수 부분별 전수 확인", tally),
      proof: { candidates: [values.length], witness: values }
    };
  }, { visual: true });

  define("5-2-u1-e1-mission-5-bus-range", [
    { capacityA: 36, busesA: 9, capacityB: 44, busesB: 7 },
    { capacityA: 42, busesA: 8, capacityB: 48, busesB: 7 },
    { capacityA: 35, busesA: 10, capacityB: 46, busesB: 8 }
  ], data => {
    const first = integers(data.capacityA * (data.busesA - 1) + 1, data.capacityA * data.busesA);
    const second = new Set(integers(data.capacityB * (data.busesB - 1) + 1, data.capacityB * data.busesB));
    const common = first.filter(value => second.has(value));
    uniqueAnswer(common.length > 0, "5-2-u1-e1-mission-5-bus-range", "두 버스 조건의 공통 범위가 없습니다.");
    return {
      prompt: `학생들이 현장 학습을 갑니다. ${data.capacityA}인승 버스는 적어도 ${data.busesA}대, ${data.capacityB}인승 버스는 적어도 ${data.busesB}대가 필요합니다. 학생 수의 범위를 초과와 이하를 사용하여 나타내세요.`,
      answer: `${common[0] - 1} 초과 ${common.at(-1)} 이하`,
      solution: `첫 조건은 ${data.capacityA * (data.busesA - 1)}명 초과 ${data.capacityA * data.busesA}명 이하, 둘째 조건은 ${data.capacityB * (data.busesB - 1)}명 초과 ${data.capacityB * data.busesB}명 이하입니다. 공통 범위는 ${common[0]}명부터 ${common.at(-1)}명까지입니다.`,
      proof: { candidates: [common.join(",")], witness: common }
    };
  });

  define("5-2-u1-e1-mission-6-box-range", [
    { total: 720, minimum: 18, maximum: 28 },
    { total: 960, minimum: 24, maximum: 36 },
    { total: 1260, minimum: 28, maximum: 42 }
  ], data => {
    const values = integers(1, data.total).filter(boxes => data.minimum * boxes <= data.total && data.total <= data.maximum * boxes);
    return {
      prompt: `과일 ${formatInteger(data.total)}개를 상자마다 ${data.minimum}개 이상 ${data.maximum}개 이하로 모두 나누어 담습니다. 만들 수 있는 상자 수의 범위를 초과와 미만으로 나타내세요.`,
      answer: `${values[0] - 1} 초과 ${values.at(-1) + 1} 미만`,
      solution: `상자 수를 □라 하면 ${data.minimum}×□≤${data.total}≤${data.maximum}×□입니다. 가능한 자연수는 ${values[0]}부터 ${values.at(-1)}까지입니다.`,
      proof: { candidates: [values.join(",")], witness: values }
    };
  });

  define("5-2-u2-e1-exploration-2", [
    { a: 3, p: 7, q: 8, b: 5, whole: 1, numerator: 5, denominator: 6 },
    { a: 5, p: 4, q: 7, b: 4, whole: 2, numerator: 1, denominator: 3 },
    { a: 6, p: 5, q: 9, b: 3, whole: 3, numerator: 2, denominator: 5 }
  ], data => {
    const first = multiply(rational(data.a), rational(data.p, data.q));
    const second = multiply(rational(data.b), mixed(data.whole, data.numerator, data.denominator));
    const answer = add(first, second);
    return {
      prompt: `㉠의 1/${data.a}이 ${data.p}/${data.q}이고, ㉡의 1/${data.b}이 ${data.whole} ${data.numerator}/${data.denominator}입니다. ㉠+㉡의 값을 구하세요.`,
      answer: formatFraction(answer),
      solution: `㉠=${data.a}×${data.p}/${data.q}=${formatFraction(first)}, ㉡=${data.b}×${data.whole} ${data.numerator}/${data.denominator}=${formatFraction(second)}입니다. 따라서 합은 ${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { first, second } }
    };
  });

  define("5-2-u2-e1-example-1", [
    { total: 420, girlsN: 3, girlsD: 7, selectedGirlsN: 2, selectedGirlsD: 3, selectedBoysN: 3, selectedBoysD: 5 },
    { total: 672, girlsN: 5, girlsD: 12, selectedGirlsN: 3, selectedGirlsD: 5, selectedBoysN: 4, selectedBoysD: 7 },
    { total: 540, girlsN: 7, girlsD: 15, selectedGirlsN: 5, selectedGirlsD: 7, selectedBoysN: 2, selectedBoysD: 3 }
  ], data => {
    const girls = data.total * data.girlsN / data.girlsD;
    const boys = data.total - girls;
    const selectedGirls = girls * data.selectedGirlsN / data.selectedGirlsD;
    const selectedBoys = boys * data.selectedBoysN / data.selectedBoysD;
    const answer = selectedGirls + selectedBoys;
    uniqueAnswer([girls, boys, selectedGirls, selectedBoys, answer].every(Number.isInteger), "5-2-u2-e1-example-1", "학생 수가 자연수가 아닙니다.");
    return {
      prompt: `5학년 학생 ${data.total}명 중 ${data.girlsN}/${data.girlsD}은 여학생입니다. 여학생의 ${data.selectedGirlsN}/${data.selectedGirlsD}과 남학생의 ${data.selectedBoysN}/${data.selectedBoysD}이 피아노를 칠 수 있다면 모두 몇 명인가요?`,
      answer: `${answer}명`,
      solution: `여학생은 ${girls}명, 남학생은 ${boys}명입니다. 피아노를 칠 수 있는 학생은 ${selectedGirls}+${selectedBoys}=${answer}명입니다.`,
      proof: { candidates: [answer], witness: { girls, boys, selectedGirls, selectedBoys } }
    };
  });

  define("5-2-u2-e1-example-2", [
    { slow: 79, fast: 102, hours: 2, minutes: 30 },
    { slow: 82, fast: 107, hours: 3, minutes: 18 },
    { slow: 76, fast: 101, hours: 2, minutes: 45 }
  ], data => {
    const duration = rational(data.hours * 60 + data.minutes, 60);
    const distance = multiply(rational(data.fast - data.slow), duration);
    const wholeKm = Math.floor(distance.n / distance.d);
    const metres = (distance.n % distance.d) * 1000 / distance.d;
    uniqueAnswer(Number.isInteger(metres), "5-2-u2-e1-example-2", "거리의 m 단위가 자연수가 아닙니다.");
    return {
      prompt: `두 자동차가 같은 곳에서 동시에 출발해 같은 방향으로 달렸습니다. 속력이 각각 시속 ${data.slow}km, ${data.fast}km이고 ${data.hours}시간 ${data.minutes}분 동안 달렸다면 두 자동차 사이의 거리는 몇 km 몇 m인가요?`,
      answer: `${wholeKm}km ${metres}m`,
      solution: `속력의 차는 시속 ${data.fast - data.slow}km이고 시간은 ${formatFraction(duration)}시간입니다. 거리의 차는 ${data.fast - data.slow}×${formatFraction(duration)}=${formatFraction(distance)}km이므로 ${wholeKm}km ${metres}m입니다.`,
      proof: { candidates: [`${distance.n}/${distance.d}`], witness: { wholeKm, metres } }
    };
  });

  define("5-2-u2-e1-example-3", [
    { fast: mixed(1, 1, 6), slow: mixed(2, 1, 4), hours: 12 },
    { fast: mixed(1, 2, 5), slow: mixed(1, 5, 6), hours: 15 },
    { fast: rational(3, 4), slow: mixed(1, 7, 10), hours: 18 }
  ], data => {
    const difference = multiply(add(data.fast, data.slow), rational(data.hours));
    const minutes = Math.floor(difference.n / difference.d);
    const seconds = (difference.n % difference.d) * 60 / difference.d;
    uniqueAnswer(Number.isInteger(seconds), "5-2-u2-e1-example-3", "초 단위가 자연수가 아닙니다.");
    return {
      prompt: `한 시계는 한 시간에 ${formatFraction(data.fast)}분씩 빠르고, 다른 시계는 한 시간에 ${formatFraction(data.slow)}분씩 느립니다. 두 시계를 같은 시각에 맞춘 뒤 ${data.hours}시간이 지나면 두 시계가 가리키는 시각은 몇 분 몇 초 차이가 나나요?`,
      answer: `${minutes}분 ${seconds}초`,
      solution: `한 시간마다 ${formatFraction(data.fast)}+${formatFraction(data.slow)}=${formatFraction(add(data.fast, data.slow))}분씩 벌어집니다. ${data.hours}시간 뒤에는 ${formatFraction(difference)}분, 즉 ${minutes}분 ${seconds}초입니다.`,
      proof: { candidates: [`${difference.n}/${difference.d}`], witness: { minutes, seconds } }
    };
  });

  define("5-2-u2-e1-example-4", [
    { firstD: 15, thirdD: 45, limit: 18 },
    { firstD: 14, thirdD: 42, limit: 16 },
    { firstD: 22, thirdD: 66, limit: 20 }
  ], data => {
    const valid = [];
    const witnesses = [];
    for (let middle = 1; middle < data.limit; middle += 1) {
      let found = null;
      for (let firstN = 1; firstN < data.firstD && !found; firstN += 1) {
        if (gcd(firstN, data.firstD) !== 1) continue;
        const numerator = firstN * data.thirdD;
        const denominator = data.firstD * middle;
        if (numerator % denominator !== 0) continue;
        const thirdN = numerator / denominator;
        if (thirdN > 0 && thirdN < data.thirdD && gcd(thirdN, data.thirdD) === 1) found = { firstN, thirdN };
      }
      if (found) {
        valid.push(middle);
        witnesses.push({ middle, ...found });
      }
    }
    return {
      prompt: `㉠/${data.firstD}과 ㉢/${data.thirdD}은 기약분수인 진분수이고, ㉡은 ${data.limit}보다 작은 자연수입니다. ㉠/${data.firstD}÷㉡=㉢/${data.thirdD}을 만족하는 ㉡을 모두 찾아 합을 구하세요.`,
      answer: String(naturalSum(valid)),
      solution: `㉡을 1부터 ${data.limit - 1}까지 넣어 두 분수가 모두 기약분수인 진분수가 되는지 확인하면 ${valid.join(", ")}입니다. 합은 ${naturalSum(valid)}입니다.`,
      proof: { candidates: [valid.join(",")], witness: witnesses }
    };
  });

  const fractionProductPools = {
    "5-2-u2-e1-mission-1-1": [
      { left: rational(7, 8), right: rational(3, 5) }, { left: rational(5, 9), right: rational(6, 7) }, { left: rational(11, 12), right: rational(4, 9) }
    ],
    "5-2-u2-e1-mission-1-2": [
      { left: rational(72), right: rational(5, 8) }, { left: rational(84), right: rational(5, 7) }, { left: rational(96), right: rational(7, 12) }
    ],
    "5-2-u2-e1-mission-1-3": [
      { left: mixed(2, 1, 4), right: rational(6) }, { left: mixed(1, 3, 5), right: rational(10) }, { left: mixed(3, 2, 7), right: rational(7) }
    ],
    "5-2-u2-e1-mission-1-4": [
      { left: rational(36), right: mixed(1, 7, 15) }, { left: rational(28), right: mixed(2, 3, 8) }, { left: rational(45), right: mixed(1, 5, 12) }
    ],
    "5-2-u2-e1-mission-1-5": [
      { left: rational(7, 10), right: rational(25) }, { left: rational(11, 12), right: rational(18) }, { left: rational(4, 9), right: rational(21) }
    ],
    "5-2-u2-e1-mission-1-6": [
      { left: rational(18), right: mixed(1, 5, 12) }, { left: rational(24), right: mixed(2, 7, 18) }, { left: rational(14), right: mixed(3, 2, 7) }
    ]
  };
  Object.entries(fractionProductPools).forEach(([sourceItemId, pools]) => define(sourceItemId, pools, data => {
    const answer = multiply(data.left, data.right);
    return {
      prompt: `다음을 계산하세요.<div class="source52-equation">${formatFraction(data.left)}×${formatFraction(data.right)}</div>`,
      answer: formatFraction(answer),
      solution: `두 수를 가분수로 나타내어 곱하고 약분하면 ${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: answer }
    };
  }, { visual: true }));

  define("5-2-u2-e1-mission-2", [
    { total: 420, boysN: 3, boysD: 7, rideN: 5, rideD: 6 },
    { total: 504, boysN: 5, boysD: 9, rideN: 3, rideD: 4 },
    { total: 630, boysN: 4, boysD: 9, rideN: 6, rideD: 7 }
  ], data => {
    const boys = data.total * data.boysN / data.boysD;
    const girls = data.total - boys;
    const notRide = girls * (data.rideD - data.rideN) / data.rideD;
    uniqueAnswer([boys, girls, notRide].every(Number.isInteger), "5-2-u2-e1-mission-2", "학생 수가 자연수가 아닙니다.");
    return {
      prompt: `5학년 학생 ${data.total}명 중 ${data.boysN}/${data.boysD}은 남학생이고 나머지는 여학생입니다. 여학생의 ${data.rideN}/${data.rideD}이 놀이기구를 탔다면, 타지 않은 여학생은 몇 명인가요?`,
      answer: `${notRide}명`,
      solution: `여학생은 ${data.total}-${boys}=${girls}명이고, 타지 않은 여학생은 그중 ${(data.rideD - data.rideN)}/${data.rideD}이므로 ${notRide}명입니다.`,
      proof: { candidates: [notRide], witness: { boys, girls, notRide } }
    };
  });

  define("5-2-u2-e1-mission-3", [
    { daily: mixed(3, 3, 8), days: 12 },
    { daily: mixed(4, 2, 5), days: 10 },
    { daily: mixed(2, 5, 6), days: 15 }
  ], data => {
    const delay = multiply(data.daily, rational(data.days));
    const delayMinutes = Math.floor(delay.n / delay.d);
    const delaySeconds = (delay.n % delay.d) * 60 / delay.d;
    uniqueAnswer(Number.isInteger(delaySeconds), "5-2-u2-e1-mission-3", "누적 오차가 초 단위로 끝나지 않습니다.");
    const totalSeconds = 12 * 3600 - delayMinutes * 60 - delaySeconds;
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor(totalSeconds % 3600 / 60);
    const second = totalSeconds % 60;
    const clock = `${hour}시 ${minute}분${second ? ` ${second}초` : ""}`;
    return {
      prompt: `하루에 ${formatFraction(data.daily)}분씩 늦게 가는 시계를 오늘 낮 12시에 정확히 맞추었습니다. ${data.days}일 뒤 실제 시각이 낮 12시일 때 이 시계가 가리키는 시각을 구하세요.`,
      answer: `오전 ${clock}`,
      solution: `누적 오차는 ${formatFraction(data.daily)}×${data.days}=${formatFraction(delay)}분입니다. 낮 12시에서 이만큼 빼면 오전 ${clock}입니다.`,
      proof: { candidates: [totalSeconds], witness: { delay, hour, minute, second } }
    };
  });

  define("5-2-u2-e1-mission-4", [
    { entries: [[mixed(2, 3, 5), 15], [mixed(3, 1, 2), 10], [mixed(1, 7, 8), 16]] },
    { entries: [[rational(2), 12], [mixed(3, 1, 2), 10], [mixed(2, 1, 2), 12]] },
    { entries: [[mixed(3, 1, 2), 8], [mixed(2, 1, 3), 9], [mixed(4, 1, 2), 8]] }
  ], data => {
    const coefficients = data.entries.map(([factor, times]) => multiply(factor, rational(times)));
    uniqueAnswer(new Set(coefficients.map(item => `${item.n}/${item.d}`)).size === 3, "5-2-u2-e1-mission-4", "세 곱셈 계수가 서로 다르지 않습니다.");
    const order = [0, 1, 2].sort((left, right) => compare(coefficients[right], coefficients[left]));
    const symbols = ["㉠", "㉡", "㉢"];
    const equation = data.entries.map(([factor, times], index) => `${symbols[index]}×${formatFraction(factor)}×${times}`).join(" = ");
    return {
      prompt: `다음 식이 성립할 때 ㉠, ㉡, ㉢을 작은 수부터 차례로 쓰세요.<div class="source52-equation source52-equation-wide">${equation}</div>`,
      answer: order.map(index => symbols[index]).join(", "),
      solution: `각 기호에 곱해진 수는 ${coefficients.map(formatFraction).join(", ")}입니다. 같은 값을 만들려면 큰 수가 곱해진 기호일수록 작으므로 ${order.map(index => symbols[index]).join("<")}입니다.`,
      proof: { candidates: [order.join(",")], witness: coefficients }
    };
  }, { visual: true });

  define("5-2-u2-e1-mission-5", [
    { denominator: 18, numerator: 5, multiplier: 72 },
    { denominator: 20, numerator: 7, multiplier: 60 },
    { denominator: 21, numerator: 8, multiplier: 84 }
  ], data => {
    const valid = integers(data.numerator + 1, data.denominator - 1).filter(value => (data.multiplier * value) % data.denominator === 0 && (data.multiplier * data.numerator) % value === 0);
    return {
      prompt: `□/${data.denominator}과 ${data.numerator}/□은 모두 진분수입니다. 각 분수에 ${data.multiplier}을 곱한 값이 모두 자연수가 되도록 □에 알맞은 자연수를 모두 구하세요.`,
      answer: valid.join(", "),
      solution: `${data.numerator}<□<${data.denominator}인 자연수를 넣어 두 곱이 모두 자연수인지 확인하면 ${valid.join(", ")}입니다.`,
      proof: { candidates: [valid.join(",")], witness: valid }
    };
  });

  define("5-2-u2-e1-mission-6", [
    { leftA: mixed(4, 1, 2), leftB: rational(4), middle: rational(3, 5), rightA: mixed(2, 2, 3), rightB: rational(9) },
    { leftA: mixed(3, 3, 4), leftB: rational(6), middle: rational(5, 8), rightA: mixed(2, 4, 5), rightB: rational(10) },
    { leftA: mixed(5, 1, 3), leftB: rational(3), middle: rational(4, 7), rightA: mixed(3, 1, 2), rightB: rational(8) }
  ], data => {
    const low = multiply(data.leftA, data.leftB);
    const high = multiply(data.rightA, data.rightB);
    const valid = integers(1, 200).filter(value => compare(low, multiply(data.middle, rational(value))) < 0 && compare(multiply(data.middle, rational(value)), high) < 0);
    return {
      prompt: `다음 부등식을 만족하는 자연수 □를 모두 더한 값을 구하세요.<div class="source52-equation source52-equation-wide">${formatFraction(data.leftA)}×${formatFraction(data.leftB)} &lt; ${formatFraction(data.middle)}×□ &lt; ${formatFraction(data.rightA)}×${formatFraction(data.rightB)}</div>`,
      answer: String(naturalSum(valid)),
      solution: `양 끝을 계산한 뒤 □의 범위를 구하면 가능한 자연수는 ${valid[0]}부터 ${valid.at(-1)}까지입니다. 이 수들의 합은 ${naturalSum(valid)}입니다.`,
      proof: { candidates: [valid.join(",")], witness: { low, high, valid } }
    };
  }, { visual: true });

  const generateSource = (sourceItemId, seed, difficultyOffset = 0) => {
    const spec = SPECS.get(sourceItemId);
    if (!spec) return null;
    const poolIndex = poolIndexForSeed(seed, spec.pools.length);
    const built = spec.build(spec.pools[poolIndex]);
    uniqueAnswer(Array.isArray(built.proof?.candidates) && built.proof.candidates.length === 1, sourceItemId, "독립 계산에서 정답 후보가 하나가 아닙니다.");
    const difficultyDesign = Number(difficultyOffset) < 0 ? "guided-source" : Number(difficultyOffset) > 0 ? "independent-source" : "source";
    const answerDiagram = built.answerVisualBody ? answerVisual(sourceItemId, built.answerVisualBody, poolIndex) : "";
    return {
      prompt: `${built.prompt}<span hidden data-source52-item="${sourceItemId}" data-source52-pool="${poolIndex}" data-answer-candidate-count="1" data-difficulty-design="${difficultyDesign}"></span>`,
      answer: built.answer,
      solution: built.solution,
      answerVisual: answerDiagram,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex,
      verifiedVariantCount: spec.pools.length,
      variantProvenance: "source-structure-variant",
      sourceItemId,
      generator: GENERATOR_KEY,
      difficultyDesign
    };
  };

  const patchReadyItem = item => {
    const spec = SPECS.get(item?.sourceItemId);
    if (!spec) return;
    Object.assign(item, {
      generatorKey: GENERATOR_KEY,
      reviewLocked: false,
      reviewReason: "현행 심화 원문 구조와 독립 계산을 확인한 고정 변형입니다.",
      sourceVerified: true,
      generationMode: "fixed-verified-pool",
      verifiedVariantTarget: spec.pools.length,
      verifiedVariantCount: spec.pools.length,
      problemVisualRequired: Boolean(spec.visual),
      answerVisualRequired: Boolean(spec.visual && [
        "5-2-u1-e1-exploration-range-number-line",
        "5-2-u1-e1-mission-4-card-decimal-count"
      ].includes(item.sourceItemId)),
      answerVisualStatus: spec.visual ? "verified" : "not-required"
    });
  };

  if (Array.isArray(root.HSE_SOURCE_INVENTORY_52?.items)) root.HSE_SOURCE_INVENTORY_52.items.forEach(patchReadyItem);
  const curriculumTypes = root.HSE_CURRICULUM?.semesters?.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []) || [];
  curriculumTypes.forEach(patchReadyItem);

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => SPECS.has(type?.sourceItemId) ? GENERATOR_KEY : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (!SPECS.has(type?.sourceItemId)) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    return generateSource(type.sourceItemId, seed, difficultyOffset);
  };
  if (Array.isArray(api.names) && !api.names.includes(GENERATOR_KEY)) api.names.push(GENERATOR_KEY);

  return {
    generatorKey: GENERATOR_KEY,
    sourceItemIds: Object.freeze([...SPECS.keys()]),
    generateSource,
    verify(sourceItemId, poolIndex) {
      const spec = SPECS.get(sourceItemId);
      if (!spec || !Number.isInteger(poolIndex) || !spec.pools[poolIndex]) return null;
      const built = spec.build(spec.pools[poolIndex]);
      return { sourceItemId, poolIndex, candidateCount: built.proof?.candidates?.length || 0, proof: built.proof, answer: built.answer };
    }
  };
});
