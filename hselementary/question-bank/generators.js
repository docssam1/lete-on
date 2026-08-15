(() => {
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const pick = (rng, values) => values[Math.floor(rng() * values.length)];
  const int = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const shuffle = (rng, values) => [...values].sort(() => rng() - 0.5);
  const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
  const fraction = (n, d) => {
    const divisor = gcd(n, d);
    n /= divisor;
    d /= divisor;
    return d === 1 ? String(n) : `${n}/${d}`;
  };
  const result = (prompt, answer, solution) => ({ prompt, answer: String(answer), solution });

  function range(level) {
    return {
      small: 12 + level * 8,
      medium: 40 + level * 30,
      large: 1000 * (level + 1)
    };
  }

  const generators = {
    largeNumber({ rng, level }) {
      const digits = 6 + level;
      const base = 10 ** (digits - 1);
      const a = int(rng, base, base * 9 - 1);
      const b = int(rng, base, base * 9 - 1);
      const symbol = a > b ? ">" : "<";
      return result(`${a.toLocaleString()}와 ${b.toLocaleString()}의 크기를 비교하여 □ 안에 &gt;, =, &lt; 중 알맞은 기호를 쓰세요.<div class="equation">${a.toLocaleString()} □ ${b.toLocaleString()}</div>`, symbol, `${a.toLocaleString()}와 ${b.toLocaleString()}를 높은 자리부터 비교하면 ${a.toLocaleString()} ${symbol} ${b.toLocaleString()}입니다.`);
    },
    numberPattern({ rng, level }) {
      const step = pick(rng, [10, 100, 1000, 250, 500].slice(0, 3 + level));
      const start = int(rng, 12, 80) * step;
      const missing = int(rng, 1, 3);
      const values = Array.from({ length: 5 }, (_, i) => start + i * step);
      const answer = values[missing];
      const display = values.map((value, index) => index === missing ? "□" : value.toLocaleString()).join(" → ");
      return result(`수의 배열에서 규칙을 찾아 □에 알맞은 수를 쓰세요.<div class="sequence">${display}</div>`, answer, `이웃한 수끼리 ${step.toLocaleString()}씩 커지므로 □는 ${answer.toLocaleString()}입니다.`);
    },
    digitCards({ rng, level }) {
      const count = 4 + Math.min(level, 1);
      const digits = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, count);
      const largest = Number([...digits].sort((a, b) => b - a).join(""));
      const smallest = Number([...digits].sort((a, b) => a - b).join(""));
      return result(`수 카드 ${digits.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용해 만들 수 있는 가장 큰 수와 가장 작은 수의 차를 구하세요.`, largest - smallest, `가장 큰 수는 ${largest.toLocaleString()}, 가장 작은 수는 ${smallest.toLocaleString()}이므로 차는 ${(largest - smallest).toLocaleString()}입니다.`);
    },
    angle({ rng, level }) {
      const total = pick(rng, level > 1 ? [180, 360] : [90, 180]);
      const a = int(rng, 2, Math.floor(total / 10) - 2) * 5;
      const b = int(rng, 2, Math.floor((total - a) / 10) - 1) * 5;
      const answer = total - a - b;
      return result(`한 점 둘레 또는 한 직선 위의 각을 나누어 잰 값입니다. □의 각도를 구하세요.<div class="equation">${a}° + ${b}° + □ = ${total}°</div>`, answer, `${total} - ${a} - ${b} = ${answer}이므로 □는 ${answer}°입니다.`);
    },
    polygonAngles({ rng, level }) {
      const sides = int(rng, 4, 6 + level);
      const answer = (sides - 2) * 180;
      return result(`${sides}각형의 모든 내각의 크기의 합을 구하세요.`, answer, `${sides}각형은 한 꼭짓점에서 삼각형 ${sides - 2}개로 나눌 수 있으므로 ${sides - 2} × 180° = ${answer}°입니다.`);
    },
    clockAngle({ rng }) {
      const hour = int(rng, 1, 11);
      const raw = hour * 30;
      const answer = Math.min(raw, 360 - raw);
      return result(`시계가 정확히 ${hour}시를 가리킬 때 시침과 분침이 이루는 작은 쪽 각의 크기를 구하세요.`, answer, `시계의 이웃한 숫자 사이는 30°이므로 작은 쪽 각은 ${answer}°입니다.`);
    },
    multiply({ rng, level }) {
      const r = range(level);
      const a = int(rng, 12, r.medium);
      const b = int(rng, 4, 9 + level * 7);
      return result(`<div class="equation">${a.toLocaleString()} × ${b} = □</div>`, a * b, `${a.toLocaleString()} × ${b} = ${(a * b).toLocaleString()}입니다.`);
    },
    divide({ rng, level }) {
      const divisor = int(rng, 3, 9 + level * 4);
      const quotient = int(rng, 12, 35 + level * 25);
      const dividend = divisor * quotient;
      return result(`<div class="equation">${dividend.toLocaleString()} ÷ ${divisor} = □</div>`, quotient, `${dividend.toLocaleString()}은 ${divisor}의 ${quotient}배이므로 몫은 ${quotient}입니다.`);
    },
    remainder({ rng, level }) {
      const divisor = int(rng, 4, 9 + level * 3);
      const quotient = int(rng, 8, 20 + level * 15);
      const remainder = int(rng, 1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      return result(`${dividend}을 ${divisor}로 나눈 몫과 나머지를 차례로 쓰세요.`, `${quotient}, ${remainder}`, `${dividend} = ${divisor} × ${quotient} + ${remainder}이므로 몫은 ${quotient}, 나머지는 ${remainder}입니다.`);
    },
    mixedOperation({ rng, level }) {
      const a = int(rng, 8, 18 + level * 8);
      const b = int(rng, 3, 8 + level * 3);
      const c = int(rng, 2, 7);
      const d = int(rng, 5, 20);
      const answer = a + b * c - d;
      return result(`<div class="equation">${a} + ${b} × ${c} - ${d} = □</div>`, answer, `곱셈을 먼저 계산하면 ${b} × ${c} = ${b * c}이고, ${a} + ${b * c} - ${d} = ${answer}입니다.`);
    },
    fractionCompare({ rng, level }) {
      const d = int(rng, 5, 9 + level * 3);
      const a = int(rng, 1, d - 2);
      const b = int(rng, a + 1, d - 1);
      const leftFirst = rng() > 0.5;
      const left = leftFirst ? a : b;
      const right = leftFirst ? b : a;
      const symbol = left > right ? ">" : "<";
      return result(`□ 안에 &gt;, =, &lt; 중 알맞은 기호를 쓰세요.<div class="equation">${left}/${d} □ ${right}/${d}</div>`, symbol, `분모가 같은 분수는 분자가 큰 분수가 더 크므로 ${left}/${d} ${symbol} ${right}/${d}입니다.`);
    },
    fractionAddSub({ rng, level }) {
      const d1 = int(rng, 3, 6 + level * 2);
      const d2 = level ? int(rng, 3, 7 + level * 2) : d1;
      const n1 = int(rng, 1, d1 - 1);
      const n2 = int(rng, 1, d2 - 1);
      const add = rng() > 0.35;
      let numerator = n1 * d2 + (add ? 1 : -1) * n2 * d1;
      if (numerator <= 0) return generators.fractionAddSub({ rng, level });
      const denominator = d1 * d2;
      const answer = fraction(numerator, denominator);
      const common = lcm(d1, d2);
      return result(`<div class="equation">${n1}/${d1} ${add ? "+" : "-"} ${n2}/${d2} = □</div>`, answer, `공통분모 ${common}으로 통분하여 계산하고 약분하면 ${answer}입니다.`);
    },
    decimalAddSub({ rng, level }) {
      const scale = level > 0 ? 100 : 10;
      const a = int(rng, 12, 90 + level * 80) / scale;
      const b = int(rng, 5, Math.max(6, Math.floor(a * scale) - 1)) / scale;
      const add = rng() > 0.4;
      const answer = decimal(add ? a + b : a - b, 3);
      return result(`<div class="equation">${decimal(a, 3)} ${add ? "+" : "-"} ${decimal(b, 3)} = □</div>`, answer, `소수점을 맞추어 계산하면 ${answer}입니다.`);
    },
    factors({ rng, level }) {
      const a = int(rng, 2, 6 + level * 3);
      const b = int(rng, 2, 6 + level * 3);
      const c = int(rng, 2, 5 + level * 2);
      const first = a * c;
      const second = b * c;
      const useLcm = rng() > 0.5;
      const answer = useLcm ? lcm(first, second) : gcd(first, second);
      return result(`${first}과 ${second}의 ${useLcm ? "최소공배수" : "최대공약수"}를 구하세요.`, answer, `${first}과 ${second}의 ${useLcm ? "공배수 중 가장 작은 수" : "공약수 중 가장 큰 수"}는 ${answer}입니다.`);
    },
    primeFactor({ rng, level }) {
      const primes = [2, 3, 5, 7].slice(0, 3 + Math.min(level, 1));
      const chosen = [pick(rng, primes), pick(rng, primes), pick(rng, primes)].sort((a, b) => a - b);
      if (level > 1) chosen.push(pick(rng, primes));
      const value = chosen.reduce((product, item) => product * item, 1);
      return result(`${value}을 소인수의 곱으로 나타내세요.`, chosen.join(" × "), `${value}을 소수로 차례로 나누면 ${chosen.join(" × ")}입니다.`);
    },
    correspondence({ rng, level }) {
      const a = int(rng, 2, 6 + level);
      const b = int(rng, 1, 9);
      const x = int(rng, 5, 12 + level * 5);
      const answer = a * x + b;
      return result(`두 수 x와 y 사이에 <b>y = ${a} × x + ${b}</b>의 대응 관계가 있습니다. x가 ${x}일 때 y를 구하세요.`, answer, `x 자리에 ${x}을 넣으면 y = ${a} × ${x} + ${b} = ${answer}입니다.`);
    },
    rounding({ rng, level }) {
      const unit = pick(rng, [10, 100, 1000].slice(0, 2 + Math.min(level, 1)));
      const value = int(rng, 120, 9800);
      const answer = Math.round(value / unit) * unit;
      return result(`${value.toLocaleString()}을 ${unit.toLocaleString()}의 자리에서 반올림하세요.`, answer, `${unit.toLocaleString()}의 자리 바로 아래 숫자를 보고 반올림하면 ${answer.toLocaleString()}입니다.`);
    },
    fractionMultiply({ rng, level }) {
      const d1 = int(rng, 3, 8 + level * 2);
      const d2 = int(rng, 3, 8 + level * 2);
      const n1 = int(rng, 1, d1 - 1);
      const n2 = int(rng, 1, d2 - 1);
      const answer = fraction(n1 * n2, d1 * d2);
      return result(`<div class="equation">${n1}/${d1} × ${n2}/${d2} = □</div>`, answer, `분자는 ${n1} × ${n2}, 분모는 ${d1} × ${d2}로 계산한 뒤 약분하면 ${answer}입니다.`);
    },
    decimalMultiply({ rng, level }) {
      const a = int(rng, 12, 79) / 10;
      const b = level ? int(rng, 12, 49) / 10 : int(rng, 2, 9);
      const answer = decimal(a * b, 3);
      return result(`<div class="equation">${decimal(a)} × ${decimal(b)} = □</div>`, answer, `자연수처럼 곱한 뒤 두 수의 소수 자릿수만큼 소수점을 옮기면 ${answer}입니다.`);
    },
    average({ rng, level }) {
      const count = 4 + Math.min(level, 1);
      const mean = int(rng, 12, 28 + level * 10);
      const offsets = count === 4 ? [-3, -1, 1, 3] : [-4, -2, 0, 2, 4];
      const values = shuffle(rng, offsets.map(offset => mean + offset));
      return result(`${values.join(", ")}의 평균을 구하세요.`, mean, `합은 ${mean * count}이고 자료는 ${count}개이므로 평균은 ${mean * count} ÷ ${count} = ${mean}입니다.`);
    },
    chance({ rng, level }) {
      const red = int(rng, 2, 5 + level);
      const blue = int(rng, 2, 5 + level);
      const yellow = int(rng, 1, 4 + level);
      const total = red + blue + yellow;
      return result(`주머니에 빨간 공 ${red}개, 파란 공 ${blue}개, 노란 공 ${yellow}개가 있습니다. 공 1개를 꺼낼 때 빨간 공이 나올 가능성을 분수로 나타내세요.`, fraction(red, total), `전체 공은 ${total}개이고 빨간 공은 ${red}개이므로 가능성은 ${red}/${total}, 약분하면 ${fraction(red, total)}입니다.`);
    },
    fractionDivide({ rng, level }) {
      const a = int(rng, 1, 4 + level);
      const b = int(rng, a + 1, 8 + level * 2);
      const c = int(rng, 2, 5 + level);
      const answer = fraction(a, b * c);
      return result(`<div class="equation">${a}/${b} ÷ ${c} = □</div>`, answer, `자연수 ${c}로 나누는 것은 분모에 ${c}를 곱하는 것과 같으므로 ${answer}입니다.`);
    },
    fractionDecimalMixed({ rng, level }) {
      const denominator = pick(rng, [2, 4, 5, 10]);
      const numerator = int(rng, 1, denominator - 1);
      const decimalValue = int(rng, 1, 8 + level) / 10;
      const add = rng() > 0.35;
      const fractionValue = numerator / denominator;
      if (!add && fractionValue <= decimalValue) return generators.fractionDecimalMixed({ rng, level });
      const answer = decimal(add ? fractionValue + decimalValue : fractionValue - decimalValue, 3);
      return result(`<div class="equation">${numerator}/${denominator} ${add ? "+" : "-"} ${decimal(decimalValue)} = □</div>`, answer, `${numerator}/${denominator}을 소수 ${decimal(fractionValue, 3)}로 바꾸어 계산하면 ${answer}입니다.`);
    },
    decimalDivide({ rng, level }) {
      const divisor = int(rng, 2, 8 + level * 2);
      const quotient = int(rng, 12, 45 + level * 20) / 10;
      const dividend = decimal(divisor * quotient, 2);
      return result(`<div class="equation">${dividend} ÷ ${divisor} = □</div>`, decimal(quotient, 2), `${dividend}을 ${divisor}로 나누면 ${decimal(quotient, 2)}입니다.`);
    },
    ratioPercent({ rng, level }) {
      const total = pick(rng, [40, 50, 80, 100, 120].slice(0, 3 + level));
      const percent = pick(rng, [10, 20, 25, 30, 40, 50, 60]);
      const answer = total * percent / 100;
      return result(`${total}의 ${percent}%는 얼마인지 구하세요.`, answer, `${total} × ${percent}/100 = ${answer}입니다.`);
    },
    priceConcentration({ rng, level }) {
      const price = int(rng, 12, 35 + level * 10) * 1000;
      const discount = pick(rng, [10, 15, 20, 25, 30]);
      const answer = price * (100 - discount) / 100;
      return result(`${price.toLocaleString()}원인 물건을 ${discount}% 할인하여 샀습니다. 지불한 금액을 구하세요.`, answer, `할인 후에는 정가의 ${100 - discount}%를 내므로 ${price.toLocaleString()} × ${(100 - discount)}/100 = ${answer.toLocaleString()}원입니다.`);
    },
    prismSurface({ rng, level }) {
      const a = int(rng, 3, 7 + level);
      const b = int(rng, 4, 9 + level);
      const c = int(rng, 5, 11 + level);
      const answer = 2 * (a * b + b * c + c * a);
      return result(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 겉넓이를 구하세요.`, answer, `서로 다른 세 면의 넓이의 합에 2를 곱하면 2 × (${a}×${b} + ${b}×${c} + ${c}×${a}) = ${answer}cm²입니다.`);
    },
    prismVolume({ rng, level }) {
      const a = int(rng, 3, 7 + level);
      const b = int(rng, 4, 9 + level);
      const c = int(rng, 5, 11 + level);
      const answer = a * b * c;
      return result(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 부피를 구하세요.`, answer, `${a} × ${b} × ${c} = ${answer}cm³입니다.`);
    },
    proportion({ rng, level }) {
      const a = int(rng, 2, 6 + level);
      const b = int(rng, 3, 8 + level);
      const multiplier = int(rng, 2, 5 + level);
      const c = a * multiplier;
      const answer = b * multiplier;
      return result(`비례식에서 □에 알맞은 수를 구하세요.<div class="equation">${a} : ${b} = ${c} : □</div>`, answer, `앞항 ${a}에 ${multiplier}를 곱하여 ${c}이 되었으므로 뒤항에도 ${multiplier}를 곱합니다. ${b} × ${multiplier} = ${answer}입니다.`);
    },
    proportionalDivision({ rng, level }) {
      const a = int(rng, 2, 5 + level);
      const b = int(rng, 2, 6 + level);
      const unit = int(rng, 3, 8 + level);
      const total = (a + b) * unit;
      return result(`${total}을 ${a} : ${b}로 비례배분할 때 큰 수를 구하세요.`, Math.max(a, b) * unit, `전체 비는 ${a + b}이고 한 몫은 ${total} ÷ ${a + b} = ${unit}입니다. 큰 비에 곱하면 ${Math.max(a, b) * unit}입니다.`);
    },
    circle({ rng, level }) {
      const radius = int(rng, 3, 8 + level);
      const askArea = rng() > 0.4;
      const answer = askArea ? decimal(3.14 * radius * radius, 2) : decimal(2 * 3.14 * radius, 2);
      return result(`원주율을 3.14로 할 때 반지름이 ${radius}cm인 원의 ${askArea ? "넓이" : "원주"}를 구하세요.`, answer, askArea ? `원의 넓이는 ${radius} × ${radius} × 3.14 = ${answer}cm²입니다.` : `원주는 ${radius} × 2 × 3.14 = ${answer}cm입니다.`);
    },
    sector({ rng, level }) {
      const radius = int(rng, 4, 8 + level);
      const angle = pick(rng, [60, 90, 120, 180]);
      const answer = decimal(3.14 * radius * radius * angle / 360, 2);
      return result(`원주율을 3.14로 할 때 반지름이 ${radius}cm이고 중심각이 ${angle}°인 부채꼴의 넓이를 구하세요.`, answer, `원 넓이 ${radius} × ${radius} × 3.14에 ${angle}/360을 곱하면 ${answer}cm²입니다.`);
    },
    cylinderSurface({ rng, level }) {
      const radius = int(rng, 2, 5 + level);
      const height = int(rng, 5, 10 + level * 2);
      const cone = rng() > 0.5;
      if (cone) {
        const slant = height + int(rng, 2, 5);
        const answer = decimal(3.14 * radius * radius + 3.14 * radius * slant, 2);
        return result(`원주율을 3.14로 할 때 밑면의 반지름이 ${radius}cm, 모선이 ${slant}cm인 원뿔의 겉넓이를 구하세요.`, answer, `밑면과 옆면의 넓이를 더하면 3.14 × ${radius}² + 3.14 × ${radius} × ${slant} = ${answer}cm²입니다.`);
      }
      const answer = decimal(2 * 3.14 * radius * radius + 2 * 3.14 * radius * height, 2);
      return result(`원주율을 3.14로 할 때 밑면의 반지름이 ${radius}cm, 높이가 ${height}cm인 원기둥의 겉넓이를 구하세요.`, answer, `두 밑면과 옆면의 넓이를 더하면 2 × 3.14 × ${radius}² + 2 × 3.14 × ${radius} × ${height} = ${answer}cm²입니다.`);
    }
  };

  const rules = [
    [/^큰 수의 크기 비교$/, "largeNumber"],
    [/큰 수의 규칙성|일렬로 나열한 수|배열된 수들의 합/, "numberPattern"],
    [/수 카드로 수 만들기|조건에 맞는 수 찾기/, "digitCards"],
    [/^다각형의 내각의 합$/, "polygonAngles"],
    [/시침과 분침/, "clockAngle"],
    [/^각도의 계산$|^여러 각도$|^평행선 사이의 각도/, "angle"],
    [/^곱셈 알아보기$|^곱셈식 완성하기$/, "multiply"],
    [/나눗셈의 나머지/, "remainder"],
    [/^나눗셈 알아보기$/, "divide"],
    [/^혼합 계산의 순서$|^하나의 식으로 나타내기$|^연산의 규칙$|^혼합 계산식 만들기$/, "mixedOperation"],
    [/분수의 종류와 크기 비교|통분과 분수의 크기 비교/, "fractionCompare"],
    [/분수의 덧셈|분수의 뺄셈|분수의 덧셈과 뺄셈/, "fractionAddSub"],
    [/^소수의 덧셈과 뺄셈$/, "decimalAddSub"],
    [/소인수분해/, "primeFactor"],
    [/최대공약수|최소공배수|^공약수의 활용$|^공배수의 활용$/, "factors"],
    [/^규칙과 대응$|^대응표와 대응 관계$/, "correspondence"],
    [/^어림하기$|^어림한 수의 범위$/, "rounding"],
    [/^분수와 자연수의 곱셈$|^분수끼리의 곱셈$/, "fractionMultiply"],
    [/소수와 자연수의 곱셈|소수와 소수의 곱셈/, "decimalMultiply"],
    [/^평균 구하기$/, "average"],
    [/사건의 가능성/, "chance"],
    [/^분수 나눗셈의 이해$/, "fractionDivide"],
    [/^분수와 소수의 혼합 계산$/, "fractionDecimalMixed"],
    [/^소수와 자연수의 나눗셈$|^소수 나눗셈의 이해$|^몫이 소수인 자연수의 나눗셈$/, "decimalDivide"],
    [/가격과 진하기/, "priceConcentration"],
    [/비와 비율|백분율|여러 가지 비율/, "ratioPercent"],
    [/^직육면체의 겉넓이$/, "prismSurface"],
    [/^직육면체의 부피$/, "prismVolume"]
    ,[/비의 성질과 비례식|비례식의 성질|비례식을 세워/, "proportion"]
    ,[/비례배분/, "proportionalDivision"]
    ,[/원주와 호의 길이/, "circle"]
    ,[/원과 부채꼴의 넓이/, "sector"]
    ,[/원기둥과 원뿔의 겉넓이/, "cylinderSurface"]
  ];

  function generatorKey(typeName) {
    return rules.find(([pattern]) => pattern.test(typeName))?.[1] || "";
  }

  function mulberry32(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function generate(type, levelRank, difficultyOffset, seed) {
    const key = generatorKey(type.name);
    if (!key) return null;
    const level = Math.max(0, Math.min(3, levelRank + difficultyOffset));
    return { ...generators[key]({ rng: mulberry32(seed), level }), generator: key };
  }

  window.HSE_GENERATORS = { generatorKey, generate, names: Object.keys(generators) };
})();
