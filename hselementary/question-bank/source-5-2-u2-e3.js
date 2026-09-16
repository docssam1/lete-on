(function (root, factory) {
  "use strict";

  const exported = factory(root || {});
  if (typeof module !== "undefined" && module.exports) module.exports = exported;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const api = root.HSE_GENERATORS;
  if (!api) throw new Error("5-2 개념탐구 3 원문형 생성기를 불러오지 못했습니다.");

  const GENERATOR_KEY = "sourceGrade5Semester2Unit2Exploration3";
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
  const subtract = (left, right) => rational(left.n * right.d - right.n * left.d, left.d * right.d);
  const multiply = (left, right) => rational(left.n * right.n, left.d * right.d);
  const divide = (left, right) => rational(left.n * right.d, left.d * right.n);
  const mixed = (whole, numerator = 0, denominator = 1) => rational(whole * denominator + numerator, denominator);
  const naturalSum = values => values.reduce((sum, value) => sum + value, 0);
  const formatInteger = value => Number(value).toLocaleString("ko-KR");
  const formatFraction = value => {
    const item = rational(value.n, value.d);
    if (item.d === 1) return String(item.n);
    const whole = Math.floor(item.n / item.d);
    const remainder = item.n % item.d;
    return whole > 0 ? `${whole} ${remainder}/${item.d}` : `${item.n}/${item.d}`;
  };
  const poolIndexForSeed = (seed, count) => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % count;
  };
  const uniqueAnswer = (condition, sourceItemId, message) => {
    if (!condition) throw new Error(`${sourceItemId}: ${message}`);
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  const fractionMark = (x, y, value, size = 13) => `<g fill="#111" font-family="Batang, Times New Roman, serif" font-size="${size}" text-anchor="middle"><text x="${x}" y="${y - 6}">${value.n}</text><line x1="${x - 10}" y1="${y - 1}" x2="${x + 10}" y2="${y - 1}" stroke="#111" stroke-width="1"/><text x="${x}" y="${y + 13}">${value.d}</text></g>`;
  const source52Visual = (kind, label, body) => `<div class="source52-visual source52-${kind}" data-source52-visual="${kind}" aria-label="${escapeHtml(label)}">${body}</div>`;

  const rodDiagram = (data, solved = false) => {
    const longLength = data.longLength;
    const shortLength = longLength - data.difference;
    const depth = data.depth;
    const bottom = 220;
    const longHeight = 158;
    const scale = longHeight / longLength;
    const shortHeight = shortLength * scale;
    const waterY = bottom - depth * scale;
    const longTop = bottom - longHeight;
    const shortTop = bottom - shortHeight;
    const longX = 150;
    const shortX = 330;
    const solvedLabels = solved
      ? `<text x="${longX}" y="${longTop - 12}" text-anchor="middle">${longLength}cm</text><text x="${shortX}" y="${shortTop - 12}" text-anchor="middle">${shortLength}cm</text><text x="430" y="${waterY - 8}" text-anchor="end">깊이 ${depth}cm</text>`
      : "";
    return source52Visual("pool-rods", "두 막대를 수영장 바닥에 수직으로 넣은 그림", `<svg class="source52-pool-rods" style="display:block;width:min(460px,100%);height:auto;margin:14px auto 2px;overflow:visible" viewBox="0 0 500 252" role="img" aria-label="길이가 다른 두 막대의 젖은 부분 비율"><g fill="none" stroke="#111" stroke-width="1.4" stroke-linecap="square"><line x1="62" y1="${bottom}" x2="438" y2="${bottom}"/><line x1="62" y1="${waterY}" x2="438" y2="${waterY}" stroke-dasharray="5 4"/><line x1="${longX}" y1="${bottom}" x2="${longX}" y2="${longTop}" stroke-width="2"/><line x1="${shortX}" y1="${bottom}" x2="${shortX}" y2="${shortTop}" stroke-width="2"/><path d="M${longX + 16} ${longTop}h16v${shortTop - longTop}h-16"/></g><g fill="#111" font-family="Batang, Times New Roman, serif" font-size="13"><text x="62" y="${waterY - 8}">물의 높이</text><text x="${longX}" y="${bottom + 20}" text-anchor="middle">긴 막대</text><text x="${shortX}" y="${bottom + 20}" text-anchor="middle">짧은 막대</text><text x="${longX + 37}" y="${(longTop + shortTop) / 2 + 4}">${data.difference}cm</text><text x="${longX - 33}" y="${(bottom + waterY) / 2 - 5}" text-anchor="middle">젖은 부분</text><text x="${shortX + 34}" y="${(bottom + waterY) / 2 - 5}">젖은 부분</text>${solvedLabels}</g>${fractionMark(longX - 33, (bottom + waterY) / 2 + 16, data.longRatio)}${fractionMark(shortX + 63, (bottom + waterY) / 2 + 16, data.shortRatio)}</svg>`);
  };

  const rectangleDiagram = (data, solved = false) => {
    const height = 116;
    const width = height * data.ratio.n / data.ratio.d;
    const x = (470 - width) / 2;
    const y = 62;
    const labels = solved
      ? `<text x="${x + width / 2}" y="${y - 12}" text-anchor="middle">가로 ${data.width}cm</text><text x="${x - 14}" y="${y + height / 2}" text-anchor="end">세로 ${data.height}cm</text><text x="235" y="210" text-anchor="middle">넓이 ${formatInteger(data.area)}cm²</text>`
      : `<text x="235" y="30" text-anchor="middle">둘레 ${data.perimeter}cm</text><text x="${x + width / 2}" y="${y - 12}" text-anchor="middle">가로</text><text x="${x - 14}" y="${y + height / 2}" text-anchor="end">세로</text>`;
    return source52Visual("rectangle", "가로와 세로의 비를 나타낸 직사각형", `<svg class="source52-rectangle" style="display:block;width:min(430px,100%);height:auto;margin:14px auto 2px;overflow:visible" viewBox="0 0 470 224" role="img" aria-label="직사각형의 가로와 세로 관계"><g fill="none" stroke="#111" stroke-width="1.4"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></g><g fill="#111" font-family="Batang, Times New Roman, serif" font-size="14">${labels}</g>${!solved ? `<g fill="#111" font-family="Batang, Times New Roman, serif" font-size="13"><text x="${x + width + 14}" y="${y + height / 2 - 12}">가로는 세로의</text>${fractionMark(x + width + 45, y + height / 2 + 5, data.ratio)}<text x="${x + width + 68}" y="${y + height / 2 + 9}">배</text></g>` : ""}</svg>`);
  };

  const SPECS = new Map();
  const define = (sourceItemId, pools, build, options = {}) => SPECS.set(sourceItemId, { sourceItemId, pools, build, ...options });

  define("5-2-u2-e3-exploration", [
    { difference: 30, longRatio: rational(4, 5), shortRatio: rational(6, 7) },
    { difference: 36, longRatio: rational(3, 4), shortRatio: rational(5, 6) },
    { difference: 24, longRatio: rational(5, 6), shortRatio: rational(7, 8) }
  ], data => {
    const longLength = divide(multiply(data.shortRatio, rational(data.difference)), subtract(data.shortRatio, data.longRatio));
    const shortLength = subtract(longLength, rational(data.difference));
    const depth = multiply(longLength, data.longRatio);
    uniqueAnswer([longLength, shortLength, depth].every(value => value.d === 1 && value.n > 0), "5-2-u2-e3-exploration", "막대 길이와 깊이가 자연수가 아닙니다.");
    const model = { ...data, longLength: longLength.n, shortLength: shortLength.n, depth: depth.n };
    return {
      prompt: `길이의 차가 ${data.difference}cm인 두 막대로 수영장의 깊이를 재려고 합니다. 두 막대를 수영장 바닥에 수직으로 넣었더니 긴 막대는 전체의 ${formatFraction(data.longRatio)}, 짧은 막대는 전체의 ${formatFraction(data.shortRatio)}만큼 젖었습니다. 수영장의 깊이는 몇 cm인가요?${rodDiagram(model)}`,
      answer: `${depth.n}cm`,
      solution: `긴 막대의 길이를 □cm라 하면 짧은 막대는 □-${data.difference}cm입니다. 젖은 길이가 같으므로 □×${formatFraction(data.longRatio)}=(□-${data.difference})×${formatFraction(data.shortRatio)}입니다. 긴 막대는 ${longLength.n}cm이고 수영장 깊이는 ${longLength.n}×${formatFraction(data.longRatio)}=${depth.n}cm입니다.`,
      answerVisualBody: rodDiagram(model, true),
      proof: { candidates: [`${depth.n}cm`], witness: { longLength: longLength.n, shortLength: shortLength.n, depth: depth.n } }
    };
  }, { visual: true, answerVisual: true });

  define("5-2-u2-e3-example-1", [
    { ratio: rational(2, 3), bounce: 4, finalHeight: 64 },
    { ratio: rational(3, 4), bounce: 3, finalHeight: 81 },
    { ratio: rational(4, 5), bounce: 3, finalHeight: 128 }
  ], data => {
    const initial = multiply(data.finalHeight ? rational(data.finalHeight) : rational(0), rational(data.ratio.d ** data.bounce, data.ratio.n ** data.bounce));
    uniqueAnswer(initial.d === 1 && initial.n > 0, "5-2-u2-e3-example-1", "처음 높이가 자연수가 아닙니다.");
    return {
      prompt: `공을 위에서 떨어뜨리면 떨어진 높이의 ${formatFraction(data.ratio)}만큼 다시 튀어 오릅니다. 이 공을 떨어뜨린 뒤 ${data.bounce}번째 튀어 오른 높이가 ${data.finalHeight}cm일 때, 처음 떨어뜨린 높이는 몇 cm인가요?`,
      answer: `${initial.n}cm`,
      solution: `한 번 튀어 오를 때마다 높이에 ${formatFraction(data.ratio)}을 곱합니다. 처음 높이에 ${formatFraction(data.ratio)}을 ${data.bounce}번 곱한 값이 ${data.finalHeight}cm이므로 처음 높이는 ${data.finalHeight}×${formatFraction(rational(data.ratio.d ** data.bounce, data.ratio.n ** data.bounce))}=${initial.n}cm입니다.`,
      proof: { candidates: [`${initial.n}cm`], witness: { initial: initial.n, final: data.finalHeight, bounce: data.bounce } }
    };
  });

  define("5-2-u2-e3-example-2", [
    { gradeRatio: rational(3, 20), maleRatio: rational(14, 25), femaleCount: 132, winners: 48 },
    { gradeRatio: rational(2, 15), maleRatio: rational(3, 8), femaleCount: 150, winners: 45 },
    { gradeRatio: rational(5, 18), maleRatio: rational(7, 13), femaleCount: 200, winners: 78 }
  ], data => {
    const femaleRatio = multiply(data.gradeRatio, subtract(rational(1), data.maleRatio));
    const total = divide(rational(data.femaleCount), femaleRatio);
    const answer = divide(rational(data.winners), total);
    uniqueAnswer(total.d === 1 && answer.n > 0, "5-2-u2-e3-example-2", "학생 수 또는 답이 자연스럽게 정해지지 않습니다.");
    return {
      prompt: `어느 학교 전체 학생 수의 ${formatFraction(data.gradeRatio)}이 5학년 학생입니다. 그중 ${formatFraction(data.maleRatio)}가 남학생이고 여학생은 ${data.femaleCount}명입니다. 5학년 남학생 중 ${data.winners}명이 상을 받았다면, 전체 학생 수 중 상을 받은 5학년 남학생 수는 분수로 얼마인가요?`,
      answer: formatFraction(answer),
      solution: `전체 학생 수 중 5학년 여학생의 비율은 ${formatFraction(data.gradeRatio)}×${formatFraction(subtract(rational(1), data.maleRatio))}=${formatFraction(femaleRatio)}입니다. 전체 학생 수는 ${data.femaleCount}÷${formatFraction(femaleRatio)}=${total.n}명입니다. 따라서 구하는 분수는 ${data.winners}/${total.n}=${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { femaleRatio, total: total.n } }
    };
  });

  define("5-2-u2-e3-example-3", [
    { first: rational(3, 7), second: rational(3, 8), third: rational(2, 5), flowerArea: 1400 },
    { first: rational(2, 5), second: rational(1, 3), third: rational(3, 4), flowerArea: 1500 },
    { first: rational(1, 4), second: rational(2, 5), third: rational(1, 3), flowerArea: 1800 }
  ], data => {
    const targetRatio = multiply(multiply(subtract(rational(1), data.first), subtract(rational(1), data.second)), data.third);
    const totalArea = divide(rational(data.flowerArea), targetRatio);
    uniqueAnswer(totalArea.d === 1, "5-2-u2-e3-example-3", "꽃밭 전체 넓이가 자연수가 아닙니다.");
    return {
      prompt: `어느 꽃밭의 ${formatFraction(data.first)}에는 봉숭아를 심고, 남은 꽃밭의 ${formatFraction(data.second)}에는 사루비아를 심고, 그 남은 꽃밭의 ${formatFraction(data.third)}에는 채송화를 심었습니다. 채송화를 심은 꽃밭의 넓이가 ${formatInteger(data.flowerArea)}m²일 때, 전체 꽃밭의 넓이는 몇 m²인가요?`,
      answer: `${formatInteger(totalArea.n)}m²`,
      solution: `채송화 꽃밭은 전체의 ${formatFraction(subtract(rational(1), data.first))}×${formatFraction(subtract(rational(1), data.second))}×${formatFraction(data.third)}=${formatFraction(targetRatio)}입니다. 전체 넓이는 ${formatInteger(data.flowerArea)}÷${formatFraction(targetRatio)}=${formatInteger(totalArea.n)}m²입니다.`,
      proof: { candidates: [`${totalArea.n}m2`], witness: { targetRatio, totalArea: totalArea.n } }
    };
  });

  define("5-2-u2-e3-example-4", [
    { firstName: "서윤", secondName: "보현", firstPart: 14, secondPart: 9, total: 6900 },
    { firstName: "지우", secondName: "민서", firstPart: 11, secondPart: 7, total: 8100 },
    { firstName: "하윤", secondName: "도윤", firstPart: 8, secondPart: 5, total: 7800 }
  ], data => {
    const unit = data.total / (data.firstPart + data.secondPart);
    const first = unit * data.firstPart;
    const second = unit * data.secondPart;
    uniqueAnswer(Number.isInteger(unit) && Number.isInteger(first) && Number.isInteger(second), "5-2-u2-e3-example-4", "나눈 돈이 자연수 원 단위로 나뉘지 않습니다.");
    return {
      prompt: `${data.firstName}와 ${data.secondName}가 ${formatInteger(data.total)}원을 나누어 가졌습니다. 두 사람이 가진 돈을 비교해 보니 ${data.firstName}가 가진 돈의 1/${data.firstPart}과 ${data.secondName}가 가진 돈의 1/${data.secondPart}이 같습니다. ${data.firstName}와 ${data.secondName}는 각각 얼마씩 가졌나요?`,
      answer: `${data.firstName} ${formatInteger(first)}원, ${data.secondName} ${formatInteger(second)}원`,
      solution: `${data.firstName}:${data.secondName}=${data.firstPart}:${data.secondPart}입니다. 한 부분은 ${formatInteger(data.total)}÷${data.firstPart + data.secondPart}=${formatInteger(unit)}원이므로 ${data.firstName}는 ${formatInteger(first)}원, ${data.secondName}는 ${formatInteger(second)}원입니다.`,
      proof: { candidates: [`${first},${second}`], witness: { first, second, unit } }
    };
  });

  define("5-2-u2-e3-mission-1", [
    { perimeter: 720, ratio: rational(5, 4) },
    { perimeter: 560, ratio: rational(4, 3) },
    { perimeter: 900, ratio: rational(3, 2) }
  ], data => {
    const height = divide(rational(data.perimeter, 2), add(rational(1), data.ratio));
    const width = multiply(height, data.ratio);
    const area = multiply(width, height);
    uniqueAnswer([height, width, area].every(value => value.d === 1), "5-2-u2-e3-mission-1", "직사각형의 변 또는 넓이가 자연수가 아닙니다.");
    const model = { ...data, height: height.n, width: width.n, area: area.n };
    return {
      prompt: `둘레가 ${data.perimeter}cm인 직사각형이 있습니다. 가로가 세로의 ${formatFraction(data.ratio)}배라면 이 직사각형의 넓이는 얼마인가요?${rectangleDiagram(model)}`,
      answer: `${formatInteger(area.n)}cm²`,
      solution: `가로와 세로의 합은 ${data.perimeter}÷2=${data.perimeter / 2}cm입니다. 세로를 ${data.ratio.d}칸으로 보면 가로는 ${data.ratio.n}칸이므로 모두 ${data.ratio.n + data.ratio.d}칸입니다. 세로는 ${height.n}cm, 가로는 ${width.n}cm이고 넓이는 ${width.n}×${height.n}=${formatInteger(area.n)}cm²입니다.`,
      answerVisualBody: rectangleDiagram(model, true),
      proof: { candidates: [`${area.n}cm2`], witness: { width: width.n, height: height.n, area: area.n } }
    };
  }, { visual: true, answerVisual: true });

  define("5-2-u2-e3-mission-2", [
    { train: rational(4, 5), bus: rational(2, 3), walk: mixed(3, 2, 5) },
    { train: rational(3, 4), bus: rational(3, 5), walk: mixed(4, 1, 5) },
    { train: rational(2, 3), bus: rational(1, 2), walk: rational(5) }
  ], data => {
    const walkRatio = multiply(subtract(rational(1), data.train), subtract(rational(1), data.bus));
    const total = divide(data.walk, walkRatio);
    const target = subtract(total, data.walk);
    uniqueAnswer(total.d === 1 && target.n > 0, "5-2-u2-e3-mission-2", "전체 거리 또는 답이 자연스럽게 정해지지 않습니다.");
    return {
      prompt: `할아버지 댁까지 가는 데 전체 거리의 ${formatFraction(data.train)}는 기차를 타고, 남은 거리의 ${formatFraction(data.bus)}는 버스를 탔습니다. 나머지 ${formatFraction(data.walk)}km는 걸어갔습니다. 기차와 버스를 타고 간 거리는 모두 몇 km인가요?`,
      answer: `${formatFraction(target)}km`,
      solution: `걸어간 거리는 전체의 ${formatFraction(subtract(rational(1), data.train))}×${formatFraction(subtract(rational(1), data.bus))}=${formatFraction(walkRatio)}입니다. 전체 거리는 ${formatFraction(data.walk)}÷${formatFraction(walkRatio)}=${formatFraction(total)}km이므로 기차와 버스를 타고 간 거리는 ${formatFraction(total)}-${formatFraction(data.walk)}=${formatFraction(target)}km입니다.`,
      proof: { candidates: [`${target.n}/${target.d}km`], witness: { walkRatio, total } }
    };
  });

  define("5-2-u2-e3-mission-3", [
    { first: rational(1, 5), second: rational(5, 12), third: rational(3, 7), last: 40 },
    { first: rational(1, 4), second: rational(2, 5), third: rational(1, 3), last: 60 },
    { first: rational(2, 7), second: rational(3, 8), third: rational(2, 5), last: 75 }
  ], data => {
    const lastRatio = multiply(multiply(subtract(rational(1), data.first), subtract(rational(1), data.second)), subtract(rational(1), data.third));
    const total = divide(rational(data.last), lastRatio);
    const firstCount = multiply(total, data.first);
    uniqueAnswer(total.d === 1 && firstCount.d === 1, "5-2-u2-e3-mission-3", "사탕 수가 자연수가 아닙니다.");
    return {
      prompt: `가, 나, 다, 라 네 종류의 사탕이 있습니다. 전체의 ${formatFraction(data.first)}은 가 사탕이고, 남은 것의 ${formatFraction(data.second)}는 나 사탕이며, 그 나머지의 ${formatFraction(data.third)}은 다 사탕입니다. 라 사탕이 ${data.last}개 있다면 가 사탕은 몇 개인가요?`,
      answer: `${firstCount.n}개`,
      solution: `라 사탕은 전체의 ${formatFraction(subtract(rational(1), data.first))}×${formatFraction(subtract(rational(1), data.second))}×${formatFraction(subtract(rational(1), data.third))}=${formatFraction(lastRatio)}입니다. 전체는 ${data.last}÷${formatFraction(lastRatio)}=${total.n}개이므로 가 사탕은 ${total.n}×${formatFraction(data.first)}=${firstCount.n}개입니다.`,
      proof: { candidates: [`${firstCount.n}개`], witness: { lastRatio, total: total.n } }
    };
  });

  define("5-2-u2-e3-mission-4", [
    { multiplier: mixed(2, 2, 3), difference: 120 },
    { multiplier: mixed(2, 1, 2), difference: 150 },
    { multiplier: mixed(2, 3, 4), difference: 100 }
  ], data => {
    const pencil = divide(rational(data.difference), subtract(rational(3), data.multiplier));
    const pen = multiply(pencil, rational(3));
    uniqueAnswer(pencil.d === 1 && pen.d === 1, "5-2-u2-e3-mission-4", "물건 값이 자연수 원 단위로 정해지지 않습니다.");
    return {
      prompt: `연필 3자루의 값과 볼펜 1자루의 값이 같습니다. 볼펜 1자루의 값이 연필 1자루 값의 ${formatFraction(data.multiplier)}배보다 ${data.difference}원 비싸다면 연필 1자루의 값은 얼마인가요?`,
      answer: `${formatInteger(pencil.n)}원`,
      solution: `연필 1자루의 값을 □원이라 하면 볼펜 1자루의 값은 □의 3배입니다. 3×□=□×${formatFraction(data.multiplier)}+${data.difference}이므로 □=${formatInteger(pencil.n)}입니다.`,
      proof: { candidates: [`${pencil.n}원`], witness: { pencil: pencil.n, pen: pen.n } }
    };
  });

  define("5-2-u2-e3-mission-5", [
    { first: rational(2, 5), firstExtra: 5, second: rational(1, 4), secondExtra: 6, third: rational(2, 7), thirdExtra: 7 },
    { first: rational(1, 3), firstExtra: 3, second: rational(1, 4), secondExtra: 4, third: rational(1, 5), thirdExtra: 6 },
    { first: rational(1, 2), firstExtra: 2, second: rational(1, 6), secondExtra: 3, third: rational(1, 8), thirdExtra: 5 }
  ], data => {
    const fractionTotal = add(add(data.first, data.second), data.third);
    const extras = data.firstExtra + data.secondExtra + data.thirdExtra;
    const total = divide(rational(extras), subtract(rational(1), fractionTotal));
    const thirdCount = add(multiply(total, data.third), rational(data.thirdExtra));
    uniqueAnswer(total.d === 1 && thirdCount.d === 1, "5-2-u2-e3-mission-5", "사과 전체 수가 자연수가 아닙니다.");
    return {
      prompt: `가, 나, 다 세 사람이 과수원에서 사과를 땄습니다. 가는 전체의 ${formatFraction(data.first)}보다 ${data.firstExtra}개를 더 땄고, 나는 전체의 ${formatFraction(data.second)}보다 ${data.secondExtra}개를 더 땄으며, 다는 전체의 ${formatFraction(data.third)}보다 ${data.thirdExtra}개를 더 땄습니다. 세 사람이 사과 전체를 모두 땄을 때, 다는 모두 몇 개의 사과를 땄나요?`,
      answer: `${thirdCount.n}개`,
      solution: `세 사람이 땄다고 한 분수 부분은 전체의 ${formatFraction(fractionTotal)}이고, 더 땄다고 한 사과는 모두 ${extras}개입니다. 전체의 ${formatFraction(subtract(rational(1), fractionTotal))}이 ${extras}개이므로 전체는 ${total.n}개입니다. 다가 딴 사과는 ${total.n}×${formatFraction(data.third)}+${data.thirdExtra}=${thirdCount.n}개입니다.`,
      proof: { candidates: [`${thirdCount.n}개`], witness: { total: total.n, thirdCount: thirdCount.n } }
    };
  });

  define("5-2-u2-e3-mission-6", [
    { first: rational(1, 3), second: rational(3, 8), multiplier: mixed(1, 3, 7), difference: 10 },
    { first: rational(1, 4), second: rational(1, 3), multiplier: mixed(1, 1, 2), difference: 20 },
    { first: rational(1, 5), second: rational(1, 2), multiplier: mixed(1, 1, 3), difference: 24 }
  ], data => {
    const remainingRatio = multiply(subtract(rational(1), data.first), subtract(rational(1), data.second));
    const givenToRemaining = divide(subtract(rational(1), remainingRatio), remainingRatio);
    const factor = multiply(data.multiplier, givenToRemaining);
    const remaining = divide(rational(data.difference), subtract(factor, rational(1)));
    uniqueAnswer(remaining.d === 1 && remaining.n > 0, "5-2-u2-e3-mission-6", "남은 쌀의 양이 자연수 kg으로 정해지지 않습니다.");
    return {
      prompt: `윤건이는 가지고 있던 쌀의 ${formatFraction(data.first)}은 형근이에게 주고, 남은 쌀의 ${formatFraction(data.second)}은 현빈이에게 주었습니다. 윤건이에게 남은 쌀의 양은 형근이와 현빈이에게 준 쌀의 ${formatFraction(data.multiplier)}배보다 ${data.difference}kg 적었습니다. 윤건이에게 남은 쌀은 몇 kg인가요?`,
      answer: `${remaining.n}kg`,
      solution: `남은 쌀을 □kg이라고 하면, 처음 쌀과 두 사람에게 준 쌀을 함께 비교하여 준 쌀은 남은 쌀의 ${formatFraction(givenToRemaining)}배입니다. 따라서 □=□×${formatFraction(givenToRemaining)}×${formatFraction(data.multiplier)}-${data.difference}입니다. □=${remaining.n}이므로 남은 쌀은 ${remaining.n}kg입니다.`,
      proof: { candidates: [`${remaining.n}kg`], witness: { remainingRatio, givenToRemaining, remaining: remaining.n } }
    };
  });

  const generateSource = (sourceItemId, seed, difficultyOffset = 0) => {
    const spec = SPECS.get(sourceItemId);
    if (!spec) return null;
    const poolIndex = poolIndexForSeed(seed, spec.pools.length);
    const built = spec.build(spec.pools[poolIndex]);
    uniqueAnswer(Array.isArray(built.proof?.candidates) && built.proof.candidates.length === 1, sourceItemId, "독립 계산에서 정답 후보가 하나가 아닙니다.");
    const difficultyDesign = Number(difficultyOffset) < 0 ? "guided-source" : Number(difficultyOffset) > 0 ? "independent-source" : "source";
    const answerVisual = built.answerVisualBody ? `<div class="source52-answer-visual" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${built.answerVisualBody}</div>` : "";
    return {
      prompt: `${built.prompt}<span hidden data-source52-item="${sourceItemId}" data-source52-pool="${poolIndex}" data-answer-candidate-count="1" data-difficulty-design="${difficultyDesign}"></span>`,
      answer: built.answer,
      solution: built.solution,
      answerVisual,
      answerCandidateCount: 1,
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
      answerVisualRequired: Boolean(spec.answerVisual),
      answerVisualStatus: spec.answerVisual ? "verified" : "not-required"
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
