"use strict";

// 2026-11-28 손글씨·채점 답 대조 수정(묶음 G3-5-1) 감사.
// 5-1 심화 책 원문 조건으로 되돌린 14개 유형을 세 난이도 × 여러 시드에서 화면 문장만으로 다시 계산해 확인합니다.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const allTypes = semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types));
const byId = id => {
  const type = allTypes.find(item => item.id === id);
  if (!type) throw new Error(`${id} 유형이 없습니다.`);
  return type;
};
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const plain = html => String(html).replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<span class="math-fraction"[^>]*><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g, " [$1/$2] ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const fractions = html => [...String(html).matchAll(/<span class="math-fraction"[^>]*><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g)].map(match => [match[1], match[2]]);
const reduce = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const rationalAdd = (a, b) => reduce(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mixedText = ([n, d]) => { const w = Math.floor(n / d), r = n % d; return !r ? String(w) : w ? `${w} ${r}/${d}` : `${r}/${d}`; };
const seeds = range(1, 60);
const difficulties = [-1, 0, 1];
const generate = (type, difficulty, seed) => api.generate(type, 0, difficulty, seed, type.variant);
const each = (id, checkOne) => {
  const type = byId(id);
  const prompts = new Set();
  for (const difficulty of difficulties) for (const seed of seeds) {
    try {
      const generated = generate(type, difficulty, seed);
      if (/undefined|NaN|Infinity|\$\{/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("깨진 값 또는 남은 템플릿 표시가 있습니다.");
      checkOne(generated, plain(generated.prompt), difficulty);
      prompts.add(plain(generated.prompt));
      checked += 1;
    } catch (error) {
      fail(`${id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    }
  }
  if (prompts.size < 3) fail(`${id}: 유사문항 조건이 너무 적습니다(${prompts.size}).`);
};
const expect = (condition, message) => { if (!condition) throw new Error(message); };

// 5-1-u2-t2-12 Mission 4: 최대공약수와 "합"(책: 최대공약수 5, 합 100 → 4쌍).
each("5-1-u2-t2-12", (generated, text) => {
  const match = text.match(/최대공약수가 (\d+)이고, 합이 (\d+)인 두 수의 순서쌍 \(㉠, ㉡\)은 모두 몇 개인지 구하세요\. \(단, ㉠>㉡\)/);
  expect(match && !/곱은/.test(text), "합·최대공약수 조건 문장이 아닙니다.");
  const [g, sum] = [Number(match[1]), Number(match[2])];
  const count = range(1, sum - 1).filter(a => a > sum - a && gcd(a, sum - a) === g).length;
  expect(Number(generated.answer) === count && count >= 2, `독립 계산 ${count}개와 답 ${generated.answer}가 다릅니다.`);
});
expect(range(1, 99).filter(a => a > 100 - a && gcd(a, 100 - a) === 5).length === 4, "책 앵커(합 100, 최대공약수 5 → 4쌍)가 맞지 않습니다.");

// 5-1-u2-t4-11 Mission 6: "세 자리 수 ㉠㉡9 + 107"(책 답 82).
each("5-1-u2-t4-11", (generated, text) => {
  const match = text.match(/세 자리 수 ㉠㉡(\d)에 (\d+)\S* 더한 수가 36의 배수일 때, 가장 큰 두 자리 수 ㉠㉡\S* 구하세요/);
  expect(match && !/두 자리 수 □□/.test(text), "세 자리 수 ㉠㉡□ 문장이 아닙니다.");
  const [last, addend] = [Number(match[1]), Number(match[2])];
  const best = range(10, 99).filter(value => (value * 10 + last + addend) % 36 === 0).at(-1);
  expect(Number(generated.answer) === best, `독립 계산 ${best}와 답 ${generated.answer}가 다릅니다.`);
});

// 5-1-u3-t1-6 Mission 1: 예제 1-1과 다른 원문(6→5, 8→9, 12→17, 25→43, 15 → 23).
each("5-1-u3-t1-6", (generated, text) => {
  const pairs = [...text.matchAll(/(\d+)→(\d+)/g)].map(match => [Number(match[1]), Number(match[2])]);
  const target = Number((text.match(/상자 안에 (\d+)\S* 쓰인 공을 넣으면/) || [])[1]);
  expect(pairs.length === 4 && target, "원문처럼 네 짝과 넣을 수가 보이지 않습니다.");
  const rules = [];
  for (let m = 1; m <= 20; m += 1) for (let b = -50; b <= 50; b += 1) if (pairs.every(([x, y]) => m * x + b === y)) rules.push([m, b]);
  expect(rules.length === 1, `규칙 후보가 ${rules.length}개입니다.`);
  expect(Number(generated.answer) === rules[0][0] * target + rules[0][1], "답이 규칙과 다릅니다.");
  expect(/어떤 상자에 수가 쓰인 공을 넣었더니/.test(text) && !/^수 상자는/.test(text), "예제 1-1과 같은 문장입니다.");
});

// 5-1-u3-t1-7 Mission 2: 수연·경민 이야기(16→5, 32→7, 40→8, 72 → 12).
each("5-1-u3-t1-7", (generated, text) => {
  const pairs = [...text.matchAll(/수연이가 (\d+)(?:이라고|라고) 말하면 경민이는 (\d+)(?:이라고|라고) 답/g)].map(match => [Number(match[1]), Number(match[2])]);
  const target = Number((text.match(/수연이가 (\d+)(?:이라고|라고) 말하면 경민이는 어떤 수를/) || [])[1]);
  expect(pairs.length === 3 && target, "원문 이야기의 세 짝과 물음이 보이지 않습니다.");
  expect(!/→/.test(text), "예제 1-2와 같은 화살표 짝 문장입니다.");
  const rules = [];
  for (let d = 1; d <= 30; d += 1) for (let a = -30; a <= 30; a += 1) if ([...pairs, [target, 0]].every(([x]) => x % d === 0) && pairs.every(([x, y]) => x / d + a === y)) rules.push([d, a]);
  expect(rules.length === 1, `규칙 후보가 ${rules.length}개입니다.`);
  expect(Number(generated.answer) === target / rules[0][0] + rules[0][1], "답이 규칙과 다릅니다.");
});

// 5-1-u3-t2-3 예제 2-2: □, ○, △ 세 줄 표(책: △=(□-2)×(□-1)÷2-1).
each("5-1-u3-t2-3", (generated, text) => {
  expect(/□, ○, △ 사이의 대응 관계/.test(text) && !/◆/.test(text), "원문 세 기호 표 문장이 아닙니다.");
  const rows = new Map([...generated.prompt.matchAll(/<tr><th>([^<]+)<\/th>((?:<td>[^<]*<\/td>)+)<\/tr>/g)].map(match => [match[1], [...match[2].matchAll(/<td>([^<]*)<\/td>/g)].map(cell => cell[1] === "" ? null : Number(cell[1]))]));
  const squares = rows.get("□"), circles = rows.get("○"), triangles = rows.get("△");
  expect(squares && circles && triangles, "세 줄 표가 없습니다.");
  const shift = squares[0] - circles[0];
  const minus = 1 - triangles[0];
  squares.forEach((square, index) => {
    const circle = square - shift;
    if (circles[index] !== null) expect(circles[index] === circle, "○ 줄이 □와 맞지 않습니다.");
    if (triangles[index] !== null) expect(triangles[index] === circle * (circle + 1) / 2 - minus, "△ 줄이 관계식과 맞지 않습니다.");
  });
  const factor = offset => offset === 0 ? "□" : `(□-${offset})`;
  expect(generated.answer === `△=${factor(shift)}×${factor(shift - 1)}÷2${minus ? `-${minus}` : ""}`, `관계식 답 ${generated.answer}이 표와 다릅니다.`);
});

// 5-1-u3-t4-10 Mission 6: 십의 자리 수만큼 1초씩 더(책: 오후 4시 27분, 99개 → 오후 3시 36분 8초).
each("5-1-u3-t4-10", (generated, text) => {
  expect(/다음 동전의 십의 자리 수만큼 1초씩 더 걸립니다/.test(text) && !/10~99번째는 2초씩/.test(text), "원문 시간 규칙이 아닙니다.");
  const [, period, hourText, minuteText, countText] = text.match(/카이로에서 (오전|오후) (\d+)시(?: (\d+)분)?부터 동전 쌓기를 시작하여 다음 조건과 같이 동전을 (\d+)개까지/) || [];
  expect(countText, "시작 시각과 동전 수를 읽을 수 없습니다.");
  const count = Number(countText);
  expect(count <= 99, "100개째부터는 원문 규칙이 정해지지 않습니다.");
  let seconds = 0;
  for (let coin = 2; coin <= count; coin += 1) seconds += coin < 10 ? 1 : Math.floor(coin / 10) + 1;
  const startCairo = ((Number(hourText) % 12) + (period === "오후" ? 12 : 0)) * 3600 + Number(minuteText || 0) * 60;
  // 서울 12시 = 카이로 5시 → 카이로 = 서울-7, 리스본 12시 = 서울 20시 → 리스본 = 서울-8 → 리스본 = 카이로-1.
  const lisbon = startCairo - 3600 + seconds;
  const h = Math.floor(lisbon / 3600), m = Math.floor(lisbon / 60) % 60, s = lisbon % 60;
  expect(generated.answer === `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}시 ${m}분 ${s}초`, `독립 계산과 답 ${generated.answer}가 다릅니다.`);
});
{
  let seconds = 0;
  for (let coin = 2; coin <= 99; coin += 1) seconds += Math.floor(coin / 10) + 1;
  if (seconds !== 548) fail(`책 앵커 99개 쌓기 시간이 548초가 아닙니다(${seconds}).`);
}

// 5-1-u4-t1-5 예제 1-4: 최소공배수 조건(책: 분모 16, 분자 52, 최소공배수 572 → 143, 44).
each("5-1-u4-t1-5", (generated, text) => {
  const match = text.match(/분모에서 (\d+), 분자에서 (\d+)\S* 빼도 그 크기가 변하지 않습니다\. 가와 나의 최소공배수가 (\d+)일 때/);
  expect(match && !/최대공약수가/.test(text), "최소공배수 조건 문장이 아닙니다.");
  const [subDen, subNum, least] = match.slice(1).map(Number);
  const found = [];
  for (let na = subDen + 1; na <= least; na += 1) for (const ga of [na * subNum / subDen]) {
    if (!Number.isInteger(ga) || ga <= subNum) continue;
    if ((ga - subNum) * na === ga * (na - subDen) && ga * na / gcd(ga, na) === least) found.push(`${ga}, ${na}`);
  }
  expect(found.length === 1 && found[0] === generated.answer, `전수 확인 ${found.join(" / ")}와 답 ${generated.answer}가 다릅니다.`);
});

// 5-1-u4-t1-10 Mission 5: 수열을 약분하지 않고 보임(1/87, 2/86, 3/85, 4/84).
each("5-1-u4-t1-10", (generated, text) => {
  const shown = fractions(generated.prompt);
  const sequence = shown.slice(1, 5).map(([n, d]) => [Number(n), Number(d)]);
  expect(sequence.length === 4 && sequence.every(([n], index) => n === index + 1), "수열 분자가 1, 2, 3, 4로 보이지 않습니다(약분됨).");
  const sum = sequence[0][0] + sequence[0][1];
  expect(sequence.every(([n, d]) => n + d === sum), "분자와 분모의 합이 일정하지 않습니다.");
  const [tn, td] = shown[0].map(Number);
  const position = range(1, sum - 1).filter(k => k * td === tn * (sum - k));
  expect(position.length === 1 && generated.answer === `${position[0]}번째`, `독립 계산 ${position[0]}번째와 답 ${generated.answer}가 다릅니다.`);
  expect(!/분자는 1씩 커지고/.test(text), "원본에 없는 규칙 설명이 문제에 남아 있습니다.");
});

// 5-1-u5-t1-5, 5-1-u5-t1-16: 분모별 묶음을 약분하지 않고 보임(2/4, 3/6, …).
for (const [id, withOnes] of [["5-1-u5-t1-5", false], ["5-1-u5-t1-16", true]]) {
  each(id, generated => {
    const shown = fractions(generated.prompt).map(([n, d]) => [Number(n), Number(d)]);
    const last = Math.max(...shown.map(([, d]) => d));
    const expected = [];
    for (let d = 2; d <= last; d += 1) for (let n = 1; n < d; n += 1) expected.push(`${n}/${d}`);
    expect(shown.map(([n, d]) => `${n}/${d}`).join(",") === expected.join(","), "분모별 분수가 약분 없이 차례로 보이지 않습니다.");
    const ones = (plain(generated.prompt).match(/(?:^|[+\s])1(?=\s*[+=])/g) || []).length;
    expect(withOnes ? ones === last : ones === 0, `자연수 1의 개수가 다릅니다(${ones}).`);
    let total = [0, 1];
    shown.forEach(value => { total = rationalAdd(total, value); });
    total = rationalAdd(total, [withOnes ? last : 0, 1]);
    expect(String(generated.answer) === mixedText(total), `독립 합 ${mixedText(total)}와 답 ${generated.answer}가 다릅니다.`);
  });
}

// 5-1-u5-t2-16 Mission 5: 칸 (가), (나), (다)의 수의 합(책 19/16).
each("5-1-u5-t2-16", (generated, text) => {
  expect(/세 수 \(가\), \(나\), \(다\)의 합을 구하세요/.test(text) && !/㉠|㉡|㉢/.test(generated.prompt), "칸 전체의 합을 묻는 문장이 아닙니다.");
  const cells = [...generated.prompt.match(/<table class="problem-table fraction-magic">([\s\S]*?)<\/table>/)[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(match => {
    const fraction = match[1].match(/aria-label="(\d+)분의 (\d+)"/);
    return fraction ? [Number(fraction[2]), Number(fraction[1])] : match[1].trim();
  });
  expect(cells.length === 9 && cells.filter(Array.isArray).length === 3, "원문처럼 세 칸만 수가 보여야 합니다.");
  // 미지수 9개 연립을 단순 대입으로 풉니다: 가운데×3이 한 줄의 합.
  const value = [...cells].map(cell => Array.isArray(cell) ? reduce(cell[0], cell[1]) : null);
  const common = reduce(value[4][0] * 3, value[4][1]);
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (let round = 0; round < 9; round += 1) for (const line of lines) {
    const unknown = line.filter(index => !value[index]);
    if (unknown.length === 1) {
      let known = [0, 1];
      line.filter(index => value[index]).forEach(index => { known = rationalAdd(known, value[index]); });
      value[unknown[0]] = reduce(common[0] * known[1] - known[0] * common[1], common[1] * known[1]);
    }
  }
  expect(value.every(Boolean) && value.every(v => v[0] > 0), "보이는 칸만으로 표를 채울 수 없습니다.");
  let asked = [0, 1];
  ["(가)", "(나)", "(다)"].forEach(label => { asked = rationalAdd(asked, value[cells.indexOf(label)]); });
  expect(String(generated.answer) === mixedText(asked), `독립 계산 ${mixedText(asked)}와 답 ${generated.answer}가 다릅니다.`);
});

// 5-1-u6-t1 개념탐구 1: ①은 ㄱ자 색칠, 답 12가 조건(가로-세로=6)만으로 정해짐.
each("5-1-u6-t1", (generated, text) => {
  const svgs = [...generated.prompt.matchAll(/<svg[^>]*data-small-rects="([^"]+)" data-colored-rects="([^"]+)"/g)];
  expect(svgs.length === 2, "①, ② 두 그림이 없습니다.");
  const parse = list => list.split(";").map(item => item.split(",").map(Number));
  const [first, second] = svgs.map(match => ({ small: parse(match[1]), colored: parse(match[2]) }));
  const unionPerimeter = rects => {
    const cells = new Set();
    rects.forEach(([x, y, w, h]) => { for (let i = x; i < x + w; i += 1) for (let j = y; j < y + h; j += 1) cells.add(`${i}:${j}`); });
    let p = 0;
    cells.forEach(key => { const [x, y] = key.split(":").map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!cells.has(`${x + dx}:${y + dy}`)) p += 1; }); });
    return p;
  };
  const all = rects => rects.reduce((box, [x, y, w, h]) => [Math.max(box[0], x + w), Math.max(box[1], y + h)], [0, 0]);
  const [width, height] = all([...first.small, ...first.colored]);
  expect(width - height === 6 && /가로는 세로보다 (?:6|3×2)\s*cm 더 깁니다/.test(text), "가로-세로=6 조건이 그림·문장과 다릅니다.");
  // ①: 작은 직사각형은 왼쪽 위에 세로로 나란히, 색칠은 오른쪽 열 + 아랫부분(ㄱ자).
  expect(first.small.every(([x, y]) => y === 0) && first.colored.some(([x, y, w, h]) => y === 0 && h === height && x + w === width && w > 0) && first.colored.some(([x, y, w, h]) => x === 0 && y + h === height && h > 0), "①의 색칠이 원문 ㄱ자 구조가 아닙니다.");
  const difference = unionPerimeter(first.colored) - unionPerimeter(second.colored);
  expect(difference === 12 && Number(generated.answer) === 12, `실제 색칠 둘레 차 ${difference}와 답 ${generated.answer}가 12가 아닙니다.`);
  expect(unionPerimeter(first.colored) === 2 * (width + height) && unionPerimeter(second.colored) === 4 * height, "둘레 관계(① 2×(가로+세로), ② 4×세로)가 성립하지 않습니다.");
});

// 5-1-u6-t1-2 예제 1-1: 원문 배치(아래 42m), 자기 교차 없음, 숨은 두 변.
each("5-1-u6-t1-2", (generated) => {
  const svg = generated.prompt.match(/<svg[^>]*data-geometry-kind="right-angle-outline"[^>]*>/)[0];
  const points = svg.match(/data-geometry-points="([^"]+)"/)[1].split(";").map(point => point.split(",").map(Number));
  const hidden = svg.match(/data-hidden-segments="([^"]+)"/)[1].split(";").map(Number);
  const n = points.length;
  expect(n === 12 && hidden.join(";") === "3;10", "12개 변과 숨은 두 변(3, 10) 구조가 아닙니다.");
  const seg = index => [points[index], points[(index + 1) % n]];
  const length = index => Math.hypot(seg(index)[1][0] - seg(index)[0][0], seg(index)[1][1] - seg(index)[0][1]);
  const bottomY = Math.max(...points.map(point => point[1]));
  expect(points[0][1] === bottomY && points[1][1] === bottomY && length(0) === Math.max(...range(0, n - 1).map(length)), "가장 긴 가로가 아래 변이 아닙니다.");
  for (let i = 0; i < n; i += 1) for (let j = i + 2; j < n; j += 1) {
    if (i === 0 && j === n - 1) continue;
    const [a, b] = seg(i), [c, d] = seg(j);
    const hi = a[1] === b[1], hj = c[1] === d[1];
    if (hi === hj) continue;
    const [h0, h1, v0, v1] = hi ? [a, b, c, d] : [c, d, a, b];
    const crosses = v0[0] > Math.min(h0[0], h1[0]) && v0[0] < Math.max(h0[0], h1[0]) && h0[1] > Math.min(v0[1], v1[1]) && h0[1] < Math.max(v0[1], v1[1]);
    expect(!crosses, `그림의 ${i}번·${j}번 변이 엇갈립니다.`);
  }
  const labels = [...generated.prompt.matchAll(/data-label-segment="(\d+)" data-label-value="([\d.]+)"/g)].map(match => [Number(match[1]), Number(match[2])]);
  expect(labels.length === 10 && labels.every(([index, value]) => !hidden.includes(index) && Math.abs(length(index) / length(0) * labels.find(([i]) => i === 0)[1] - value) < 1e-6), "라벨 10개가 실제 변 길이 비와 맞지 않습니다.");
  const scale = labels.find(([i]) => i === 0)[1] / length(0);
  const perimeter = range(0, n - 1).reduce((total, index) => total + length(index) * scale, 0);
  expect(Number(String(generated.answer).replaceAll(",", "")) === Math.round(perimeter * 100), `그림에서 다시 잰 둘레 ${Math.round(perimeter * 100)}cm와 답 ${generated.answer}가 다릅니다.`);
});

// 5-1-u6-t3-10 Mission 2: 오타("18개의 이어") 수정, 높이 라벨이 빗변과 겹치지 않게 바깥 오른쪽.
each("5-1-u6-t3-10", (generated, text) => {
  expect(!/개의 이어 붙여|개씩 놓인 이어/.test(text) && /(조각 \d+개를|한 줄에 \d+개씩 \d+줄로) 이어 붙여/.test(text), "이어 붙이는 문장이 바르지 않습니다.");
  const svg = generated.prompt;
  const height = Number(svg.match(/data-height="(\d+)"/)[1]);
  const label = svg.match(/<text class="source51-e3-tile-measure is-height"[^>]*x="([\d.]+)"[^>]*>(\d+) cm<\/text>/);
  const polygon = svg.match(/<g class="source51-e3-tile-sample"[^>]*>\s*<polygon points="([^"]+)"/)[1].split(" ").map(point => point.split(",").map(Number));
  expect(label && Number(label[2]) === height, "높이 라벨이 없습니다.");
  expect(Number(label[1]) > Math.max(...polygon.map(point => point[0])), "높이 라벨이 조각 오른쪽 바깥에 있지 않습니다.");
  expect(/is-height" style="text-anchor:start"/.test(svg), "높이 라벨 정렬이 바깥쪽 시작 정렬이 아닙니다.");
});

// 책 원문 수치가 기준 난이도(0)의 유사문항 묶음 안에 실제로 나오는지 확인합니다.
const bookAnchors = [
  ["5-1-u2-t2-12", /최대공약수가 5이고, 합이 100인/, "4"],
  ["5-1-u2-t4-11", /세 자리 수 ㉠㉡9에 107/, "82"],
  ["5-1-u3-t1-6", /6→5, 8→9, 12→17, 25→43 상자 안에 15가/, "23"],
  ["5-1-u3-t1-7", /수연이가 16이라고 말하면 경민이는 5라고/, "12"],
  ["5-1-u3-t2-3", /다음은 □, ○, △/, "△=(□-2)×(□-1)÷2-1"],
  ["5-1-u3-t4-10", /오후 4시 27분부터 .* 99개까지/, "오후 3시 36분 8초"],
  ["5-1-u4-t1-5", /분모에서 16, 분자에서 52.*최소공배수가 572/, "143, 44"],
  ["5-1-u4-t1-10", /\[1\/87\] , \[2\/86\] , \[3\/85\] , \[4\/84\]/, "32번째"],
  ["5-1-u5-t2-16", /\[7\/16\]/, "1 3/16"],
  ["5-1-u6-t1-2", /가장 긴 가로는 42\s*m/, "17,800"]
];
for (const [id, pattern, answer] of bookAnchors) {
  const type = byId(id);
  const hit = range(1, 400).map(seed => generate(type, 0, seed)).find(generated => pattern.test(plain(generated.prompt)) && String(generated.answer) === answer);
  if (!hit) fail(`${id}: 기준 난이도에서 책 원문 수치(답 ${answer})가 나오지 않습니다.`);
  else checked += 1;
}

if (failures.length) {
  console.error(`손글씨 대조 수정 G3-5-1 감사 실패: ${failures.length}건\n${failures.slice(0, 60).join("\n")}`);
  process.exit(1);
}
console.log(`손글씨 대조 수정 G3-5-1 감사 통과: 14유형 · ${checked.toLocaleString()}회(세 난이도 × 시드 60) 책 조건·독립 계산·화면 구조 검사`);
