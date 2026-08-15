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
  const permutationNumbers = (digits) => {
    const values = new Set();
    const used = Array(digits.length).fill(false);
    const current = [];
    const visit = () => {
      if (current.length === digits.length) {
        values.add(Number(current.join("")));
        return;
      }
      for (let index = 0; index < digits.length; index += 1) {
        if (used[index] || (current.length === 0 && digits[index] === 0)) continue;
        used[index] = true;
        current.push(digits[index]);
        visit();
        current.pop();
        used[index] = false;
      }
    };
    visit();
    return [...values].sort((a, b) => a - b);
  };
  const result = (prompt, answer, solution) => ({ prompt, answer: String(answer), solution });
  const splitTotal = (rng, count, total, minValue, maxValue, step = 5) => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const values = [];
      let remaining = total;
      for (let index = 0; index < count - 1; index += 1) {
        const slots = count - index - 1;
        const low = Math.max(minValue, remaining - maxValue * slots);
        const high = Math.min(maxValue, remaining - minValue * slots);
        const lowStep = Math.ceil(low / step);
        const highStep = Math.floor(high / step);
        if (lowStep > highStep) break;
        const value = int(rng, lowStep, highStep) * step;
        values.push(value);
        remaining -= value;
      }
      if (values.length === count - 1 && remaining >= minValue && remaining <= maxValue && remaining % step === 0) return [...values, remaining];
    }
    throw new Error(`합 ${total}을 ${count}개의 각으로 나눌 수 없습니다.`);
  };
  const polar = (cx, cy, radius, degrees) => {
    const radians = (degrees - 90) * Math.PI / 180;
    return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
  };
  const rayFanSvg = (rayCount, labels = [], span = 144) => {
    const cx = 120;
    const cy = 112;
    const start = -span / 2;
    const end = span / 2;
    const angles = Array.from({ length: rayCount }, (_, index) => start + (end - start) * index / (rayCount - 1));
    const rays = angles.map(angle => {
      const [x, y] = polar(cx, cy, 82, angle);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    const texts = labels.map((label, index) => {
      const middle = (angles[index] + angles[index + 1]) / 2;
      const [x, y] = polar(cx, cy, 35, middle);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram ray-fan" viewBox="0 0 240 132" aria-label="한 점에서 뻗은 ${rayCount}개의 반직선"><g>${rays}</g>${texts}<circle cx="${cx}" cy="${cy}" r="3"/></svg>`;
  };
  const angleWheelSvg = (labels) => {
    const cx = 100;
    const cy = 88;
    const angles = Array.from({ length: labels.length }, (_, index) => index * 360 / labels.length);
    const rays = angles.map(angle => {
      const [x, y] = polar(cx, cy, 65, angle);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    const texts = labels.map((label, index) => {
      const [x, y] = polar(cx, cy, 30, angles[index] + 180 / labels.length);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram angle-wheel" viewBox="0 0 200 176" aria-label="한 점 둘레의 각"><g>${rays}</g>${texts}<circle cx="${cx}" cy="${cy}" r="3"/></svg>`;
  };
  const polygonSvg = (sides, labels, star = false) => {
    const cx = 120;
    const cy = 88;
    const radius = 62;
    const points = Array.from({ length: sides }, (_, index) => polar(cx, cy, radius, index * 360 / sides));
    const order = star && sides === 5 ? [0, 2, 4, 1, 3] : Array.from({ length: sides }, (_, index) => index);
    const path = order.map(index => points[index].map(value => value.toFixed(1)).join(",")).join(" ");
    const texts = labels.map((label, index) => {
      const [x, y] = polar(cx, cy, radius - (star ? 11 : 18), index * 360 / sides);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram polygon-diagram" viewBox="0 0 240 176" aria-label="${star ? "별 모양" : `${sides}각형`}"><polygon points="${path}"/>${texts}</svg>`;
  };
  const foldSvg = (angle) => {
    const radians = angle * Math.PI / 180;
    const dx = 72 * Math.sin(radians);
    const dy = 72 * Math.cos(radians);
    return `<svg class="geometry-diagram fold-diagram" viewBox="0 0 240 160" aria-label="종이를 접은 각도 그림"><rect x="42" y="24" width="150" height="112"/><line class="crease" x1="117" y1="25" x2="117" y2="136"/><line class="folded" x1="117" y1="105" x2="${(117 + dx).toFixed(1)}" y2="${(105 - dy).toFixed(1)}"/><line class="original" x1="117" y1="105" x2="${(117 - dx).toFixed(1)}" y2="${(105 - dy).toFixed(1)}"/><text x="117" y="67">${angle * 2}°</text></svg>`;
  };
  const rotatedSquareSvg = (angle) => `<svg class="geometry-diagram rotated-square" viewBox="0 0 240 176" aria-label="회전한 정사각형"><rect x="55" y="38" width="92" height="92"/><rect x="55" y="38" width="92" height="92" transform="rotate(${angle} 101 84)"/><path d="M101 84 L101 42 A42 42 0 0 1 ${(101 + 42 * Math.sin(angle * Math.PI / 180)).toFixed(1)} ${(84 - 42 * Math.cos(angle * Math.PI / 180)).toFixed(1)}"/><text x="112" y="53">${angle}°</text></svg>`;
  const clockSvg = (hour, minute) => {
    const minuteAngle = minute * 6;
    const hourAngle = (hour % 12) * 30 + minute * 0.5;
    const [mx, my] = polar(90, 90, 60, minuteAngle);
    const [hx, hy] = polar(90, 90, 43, hourAngle);
    const ticks = Array.from({ length: 12 }, (_, index) => {
      const [x1, y1] = polar(90, 90, 68, index * 30);
      const [x2, y2] = polar(90, 90, 74, index * 30);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }).join("");
    return `<svg class="geometry-diagram clock-diagram" viewBox="0 0 180 180" aria-label="${hour}시 ${String(minute).padStart(2, "0")}분 시계"><circle cx="90" cy="90" r="76"/>${ticks}<line class="hour-hand" x1="90" y1="90" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}"/><line class="minute-hand" x1="90" y1="90" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}"/><circle cx="90" cy="90" r="4"/></svg>`;
  };

  function range(level) {
    return {
      small: 12 + level * 8,
      medium: 40 + level * 30,
      large: 1000 * (level + 1)
    };
  }

  const generators = {
    largeNumberPlaceValue({ rng, level, variant = 0 }) {
      const digitCount = 11 + level;
      const makeDigits = () => Array.from({ length: digitCount }, (_, index) => index === 0 ? int(rng, 1, 9) : int(rng, 0, 9));

      if (variant % 3 === 0) {
        const digits = makeDigits();
        const highPlace = int(rng, 5, digitCount - 2);
        const lowPlace = int(rng, 2, highPlace - 2);
        digits[digitCount - highPlace - 1] = int(rng, 2, 9);
        digits[digitCount - lowPlace - 1] = int(rng, 1, 8);
        const value = Number(digits.join(""));
        const highValue = digits[digitCount - highPlace - 1] * 10 ** highPlace;
        const lowValue = digits[digitCount - lowPlace - 1] * 10 ** lowPlace;
        const answer = Math.abs(highValue - lowValue);
        return result(`${value.toLocaleString()}에서 ${(10 ** highPlace).toLocaleString()}의 자리 숫자가 나타내는 값과 ${(10 ** lowPlace).toLocaleString()}의 자리 숫자가 나타내는 값의 차를 구하세요.`, answer, `두 숫자가 나타내는 값은 각각 ${highValue.toLocaleString()}, ${lowValue.toLocaleString()}이므로 차는 ${answer.toLocaleString()}입니다.`);
      }

      if (variant % 3 === 1) {
        const digits = makeDigits();
        const targetIndex = int(rng, 2, digitCount - 3);
        digits[targetIndex] = int(rng, 2, 9);
        const value = Number(digits.join(""));
        const terms = digits.map((digit, index) => ({ digit, place: 10 ** (digitCount - index - 1) })).filter(term => term.digit > 0);
        const target = terms.find(term => term.place === 10 ** (digitCount - targetIndex - 1));
        const expression = terms.map(term => `${term.place.toLocaleString()} × ${term === target ? "□" : term.digit}`).join(" + ");
        return result(`다음 식의 □에 알맞은 수를 구하세요.<div class="equation expanded">${value.toLocaleString()} = ${expression}</div>`, target.digit, `${target.place.toLocaleString()}의 자리 숫자는 ${target.digit}이므로 □는 ${target.digit}입니다.`);
      }

      const digits = makeDigits();
      const lowPlace = int(rng, 0, Math.min(2, digitCount - 6));
      const highPlace = lowPlace + 4;
      const baseDigit = int(rng, 1, 3);
      const multiplier = int(rng, 2, 3);
      const lowDigit = baseDigit * multiplier;
      digits[digitCount - lowPlace - 1] = lowDigit;
      digits[digitCount - highPlace - 1] = baseDigit;
      const value = Number(digits.join(""));
      const multipliedDigitValue = lowDigit * 10 ** (lowPlace + 3);
      const dividedDigitValue = baseDigit * 10 ** (highPlace - 2);
      const answer = multipliedDigitValue / dividedDigitValue;
      return result(`${value.toLocaleString()}을 1000배 한 수에서 숫자 ${lowDigit}가 나타내는 값은, ${value.toLocaleString()}을 100분의 1로 한 수에서 숫자 ${baseDigit}가 나타내는 값의 몇 배인지 구하세요.`, answer, `1000배 한 수에서 숫자 ${lowDigit}의 값은 ${multipliedDigitValue.toLocaleString()}, 100분의 1로 한 수에서 숫자 ${baseDigit}의 값은 ${dividedDigitValue.toLocaleString()}이므로 ${multipliedDigitValue.toLocaleString()} ÷ ${dividedDigitValue.toLocaleString()} = ${answer}배입니다.`);
    },
    largeNumberCompare({ rng, level, variant = 0 }) {
      const blankNumber = (prefix, suffix, place) => {
        const raw = `${prefix}□${String(suffix).padStart(Math.log10(place), "0")}`;
        const grouped = [...raw].map((character, index) => index > 0 && (raw.length - index) % 3 === 0 ? `,${character}` : character).join("");
        return grouped.replace("□", '<span class="blank-digit">□</span>');
      };
      const makeNumber = (prefix, digit, suffix, place) => prefix * place * 10 + digit * place + suffix;
      const place = 10 ** (5 + level);

      if (variant % 3 === 0) {
        const lower = int(rng, 1, 5);
        const upper = int(rng, lower + 2, 9);
        const firstPrefix = int(rng, 21, 78);
        const secondPrefix = int(rng, 21, 78);
        const firstLeft = blankNumber(firstPrefix, place - 1, place);
        const firstRight = makeNumber(firstPrefix, upper, 0, place).toLocaleString();
        const secondLeft = makeNumber(secondPrefix, lower, place - 1, place).toLocaleString();
        const secondRight = blankNumber(secondPrefix, 0, place);
        const candidates = Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1);
        const answer = candidates.reduce((sum, value) => sum + value, 0);
        return result(`두 부등식의 □에는 같은 숫자가 들어갑니다. □에 공통으로 들어갈 수 있는 모든 숫자의 합을 구하세요.<div class="equation comparison">${firstLeft} &lt; ${firstRight}<br>${secondLeft} &lt; ${secondRight}</div>`, answer, `첫째 식에서 □는 ${upper}보다 작고, 둘째 식에서 ${lower}보다 커야 합니다. 가능한 숫자는 ${candidates.join(", ")}이므로 합은 ${answer}입니다.`);
      }

      if (variant % 3 === 1) {
        const scale = 10 ** (5 + level);
        const base = int(rng, 210, 780) * scale;
        const increment = int(rng, 12, 89) * scale / 100;
        const multipleBase = int(rng, 2100, 7800) * scale / 1000;
        const placeA = int(rng, 2, 8) * 10 ** (7 + level);
        const placeB = int(rng, 2, 9) * 10 ** (4 + level);
        const placeC = int(rng, 2, 9) * 10 ** (1 + level);
        const plainValue = base + int(rng, -50, 50) * scale / 10;
        const choices = [
          { label: "가", text: `${base.toLocaleString()}보다 ${increment.toLocaleString()} 큰 수`, value: base + increment },
          { label: "나", text: `${multipleBase.toLocaleString()}의 100배인 수`, value: multipleBase * 100 },
          { label: "다", text: `${(10 ** (7 + level)).toLocaleString()}이 ${placeA / 10 ** (7 + level)}개, ${(10 ** (4 + level)).toLocaleString()}이 ${placeB / 10 ** (4 + level)}개, ${(10 ** (1 + level)).toLocaleString()}이 ${placeC / 10 ** (1 + level)}개인 수`, value: placeA + placeB + placeC },
          { label: "라", text: plainValue.toLocaleString(), value: plainValue }
        ];
        const smallest = [...choices].sort((a, b) => a.value - b.value)[0];
        return result(`다음 네 수 중 가장 작은 수를 구하세요.<ol class="choice-list">${choices.map(choice => `<li><b>${choice.label}</b> ${choice.text}</li>`).join("")}</ol>`, smallest.value, `각 수를 숫자로 나타내어 비교하면 가장 작은 것은 ${smallest.label}, ${smallest.value.toLocaleString()}입니다.`);
      }

      const upper = int(rng, 3, 9);
      const prefix = int(rng, 31, 87);
      const left = blankNumber(prefix, place - 1, place);
      const right = makeNumber(prefix, upper, 0, place);
      const answer = upper - 1;
      return result(`부등식이 성립하도록 □에 넣을 수 있는 가장 큰 숫자를 구하세요.<div class="equation comparison">${left} &lt; ${right.toLocaleString()}</div>`, answer, `□가 ${upper}이면 뒤의 자릿수 때문에 부등식이 성립하지 않습니다. 따라서 ${upper}보다 작은 가장 큰 숫자인 ${answer}입니다.`);
    },
    largeNumberSkipPattern({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const step = pick(rng, [[100, 500, 1000], [500, 1000, 5000], [1000, 5000, 10000]][level]);
        const targetIndex = int(rng, [80, 300, 700][level], [240, 900, 1800][level]);
        const start = int(rng, 120, 890) * step;
        const answer = start + step * (targetIndex - 1);
        return result(`${start.toLocaleString()}부터 ${step.toLocaleString()}씩 뛰어 셀 때 ${targetIndex.toLocaleString()}번째 오는 수를 구하세요.`, answer, `첫 수 뒤로 ${targetIndex - 1}번 뛰므로 ${start.toLocaleString()} + ${step.toLocaleString()} × ${(targetIndex - 1).toLocaleString()} = ${answer.toLocaleString()}입니다.`);
      }

      if (variant % 3 === 1) {
        const step = pick(rng, [10000, 50000, 100000, 500000]);
        const start = int(rng, 100, 900) * step;
        const positions = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
        return result(`수직선의 눈금 간격은 모두 같습니다. ㉠과 ㉡의 합을 구하세요.<div class="number-line"><span>${positions[0].toLocaleString()}</span><i></i><b>㉠</b><i></i><span>${positions[2].toLocaleString()}</span><i></i><b>㉡</b><i></i><span>${positions[4].toLocaleString()}</span></div>`, positions[1] + positions[3], `한 눈금은 ${step.toLocaleString()}입니다. ㉠은 ${positions[1].toLocaleString()}, ㉡은 ${positions[3].toLocaleString()}이므로 합은 ${(positions[1] + positions[3]).toLocaleString()}입니다.`);
      }

      const correctStep = pick(rng, [200, 1000, 2000, 10000].slice(level, level + 2));
      const wrongStep = correctStep / 2;
      const correctCount = int(rng, 30 + level * 30, 90 + level * 60) * 2;
      const start = int(rng, 120, 890) * correctStep;
      const target = start + correctStep * correctCount;
      const mistaken = start + wrongStep * correctCount;
      const answer = (target - mistaken) / correctStep;
      return result(`${start.toLocaleString()}부터 ${correctStep.toLocaleString()}씩 ${correctCount}번 뛰어 세어야 하는 것을 잘못하여 ${wrongStep.toLocaleString()}씩 ${correctCount}번 뛰어 세었습니다. 목표 수까지 ${correctStep.toLocaleString()}씩 몇 번 더 뛰어 세어야 하는지 구하세요.`, answer, `목표 수는 ${target.toLocaleString()}, 잘못 센 마지막 수는 ${mistaken.toLocaleString()}입니다. 두 수의 차를 ${correctStep.toLocaleString()}으로 나누면 ${answer}번입니다.`);
    },
    largeNumberApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const lowUnit = pick(rng, [10000, 50000, 100000]);
        const ratio = pick(rng, [10, 20, 100]);
        const highUnit = lowUnit * ratio;
        const highCount = int(rng, 12, 45 + level * 20);
        const lowCount = int(rng, 1, ratio - 1);
        const amount = highUnit * highCount + lowUnit * lowCount;
        const answer = highCount + lowCount;
        return result(`은행에서 ${amount.toLocaleString()}원을 ${highUnit.toLocaleString()}원권과 ${lowUnit.toLocaleString()}원권 수표로 바꾸려고 합니다. 수표의 수가 가장 적도록 바꿀 때 수표는 모두 몇 장인지 구하세요.`, answer, `${highUnit.toLocaleString()}원권 ${highCount}장과 ${lowUnit.toLocaleString()}원권 ${lowCount}장으로 바꾸면 가장 적습니다. 따라서 ${highCount} + ${lowCount} = ${answer}장입니다.`);
      }

      if (variant % 3 === 1) {
        const end = int(rng, [120, 260, 420][level], [240, 480, 780][level]);
        const written = Array.from({ length: end }, (_, index) => String(index + 1)).join("");
        const digitCount = written.length;
        const answer = written.slice(-3);
        return result(`1부터 자연수를 차례로 이어 써서 모두 ${digitCount.toLocaleString()}자리인 수를 만들었습니다. 이 수의 마지막 세 자리 수를 구하세요.`, answer, `1부터 차례로 쓴 숫자의 자리 수를 구간별로 계산하면 마지막에 쓴 자연수는 ${end}입니다. 따라서 마지막 세 자리 수는 ${answer}입니다.`);
      }

      const groupCoins = 100;
      const groupHeight = pick(rng, [12, 15, 18]);
      const groupCount = int(rng, 12 + level * 10, 50 + level * 35) * 100000;
      const coinCount = groupCoins * groupCount;
      const totalCentimeters = groupHeight * groupCount;
      const answer = decimal(totalCentimeters / 100000, 2);
      return result(`같은 동전 ${groupCoins}개를 쌓은 높이는 ${groupHeight} cm입니다. 이 동전 ${coinCount.toLocaleString()}개를 한 줄로 쌓은 높이는 몇 km인지 구하세요.`, answer, `${coinCount.toLocaleString()}개는 ${groupCoins}개씩 ${groupCount.toLocaleString()}묶음입니다. 높이는 ${groupHeight} × ${groupCount.toLocaleString()} = ${totalCentimeters.toLocaleString()} cm이고, 100,000 cm가 1 km이므로 ${answer} km입니다.`);
    },
    conditionedNumber({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const digitCount = 7 + level;
        const firstLow = int(rng, 1, 4);
        const firstHigh = firstLow + int(rng, 2, Math.min(4, 9 - firstLow));
        const low = firstLow * 10 ** (digitCount - 1);
        const high = firstHigh * 10 ** (digitCount - 1);
        const digitSum = int(rng, 7, 14);
        const pairs = [];
        for (let ones = 0; ones <= 9; ones += 2) {
          const tens = digitSum - ones;
          if (tens >= 0 && tens <= 9) pairs.push([tens, ones]);
        }
        const firstDigitCount = firstHigh - firstLow;
        const freeDigitCount = digitCount - 3;
        const answer = firstDigitCount * pairs.length * 10 ** freeDigitCount;
        return result(`${low.toLocaleString()}보다 크고 ${high.toLocaleString()}보다 작은 ${digitCount}자리 자연수 중에서 십의 자리와 일의 자리 숫자의 합이 ${digitSum}이고 일의 자리 숫자가 짝수인 수는 모두 몇 개인지 구하세요.`, answer, `맨 앞자리 숫자는 ${Array.from({ length: firstDigitCount }, (_, index) => firstLow + index).join(", ")} 중 하나입니다. 끝 두 자리 조건은 ${pairs.length}가지이고, 가운데 ${freeDigitCount}자리는 각각 0부터 9까지 가능합니다. 따라서 ${firstDigitCount} × ${pairs.length} × ${10 ** freeDigitCount} = ${answer.toLocaleString()}개입니다.`);
      }

      if (variant % 3 === 1) {
        const highDigit = int(rng, 5, 9);
        const lowDigit = int(rng, 0, highDigit - 2);
        const digitSum = highDigit + lowDigit;
        const difference = (highDigit - lowDigit) * 9 * 1000000;
        const answer = highDigit * 10 + lowDigit;
        return result(`어떤 여덟 자리 수의 천만의 자리 숫자와 백만의 자리 숫자의 합은 ${digitSum}입니다. 두 자리 숫자를 서로 바꾸었더니 처음 수보다 ${difference.toLocaleString()}만큼 작아졌습니다. 처음 수의 천만의 자리와 백만의 자리 숫자를 차례로 이어 쓴 두 자리 수를 구하세요.`, answer, `두 자리를 바꿀 때 생기는 차는 두 숫자의 차 × 9,000,000입니다. 두 숫자의 차는 ${difference.toLocaleString()} ÷ 9,000,000 = ${highDigit - lowDigit}이고 합은 ${digitSum}이므로 두 숫자는 ${highDigit}, ${lowDigit}입니다. 답은 ${answer}입니다.`);
      }

      const digitCount = 7 + level;
      const ones = int(rng, 0, 6);
      let pairSum = int(rng, 9, 15);
      let leadingPair = null;
      while (!leadingPair) {
        for (let first = 9; first >= 1; first -= 1) {
          const second = pairSum - first;
          if (second >= 0 && second <= 9 && second !== first && first !== ones && second !== ones) {
            leadingPair = [first, second];
            break;
          }
        }
        if (!leadingPair) pairSum = int(rng, 9, 15);
      }
      const available = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].filter(value => !leadingPair.includes(value) && value !== ones);
      const middle = available.slice(0, digitCount - 3);
      const answer = Number([...leadingPair, ...middle, ones].join(""));
      return result(`다음 조건을 모두 만족하는 가장 큰 ${digitCount}자리 자연수를 구하세요.<ul class="condition-list"><li>각 자리 숫자는 모두 다릅니다.</li><li>가장 높은 두 자리 숫자의 합은 ${pairSum}입니다.</li><li>일의 자리 숫자는 ${ones}입니다.</li></ul>`, answer, `가장 높은 자리부터 큰 숫자를 놓되 모든 자리의 숫자가 다르게 되도록 확인하면 ${answer.toLocaleString()}입니다.`);
    },
    digitCardNumber({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const cardCount = 7 + Math.min(level, 1);
        const cards = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cardCount);
        const numbers = permutationNumbers(cards);
        const target = int(rng, 2 * 10 ** (cardCount - 1), 8 * 10 ** (cardCount - 1));
        const answer = numbers.reduce((best, value) => Math.abs(value - target) < Math.abs(best - target) || (Math.abs(value - target) === Math.abs(best - target) && value < best) ? value : best, numbers[0]);
        return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용해 만들 수 있는 자연수 중 ${target.toLocaleString()}에 가장 가까운 수를 구하세요.`, answer, `만들 수 있는 수를 큰 자리부터 비교하면 ${target.toLocaleString()}과의 차가 가장 작은 수는 ${answer.toLocaleString()}입니다.`);
      }

      if (variant % 3 === 1) {
        const baseCards = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        const cards = [baseCards[0], baseCards[1], baseCards[1], baseCards[2], baseCards[3], baseCards[3]];
        const numbers = permutationNumbers(cards).sort((a, b) => b - a);
        const rank = int(rng, 3, Math.min(12 + level * 3, numbers.length));
        const answer = numbers[rank - 1];
        return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 모두 사용해 만들 수 있는 여섯 자리 자연수 중 ${rank}번째로 큰 수를 구하세요.`, answer, `같은 숫자의 카드도 구분하지 않고 큰 수부터 차례로 배열하면 ${rank}번째 수는 ${answer.toLocaleString()}입니다.`);
      }

      const cardCount = 7 + Math.min(level, 1);
      const cards = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cardCount);
      if (!cards.includes(0)) cards[0] = 0;
      const numbers = permutationNumbers(cards);
      const smallest = numbers[0];
      const largest = numbers[numbers.length - 1];
      const answer = largest - smallest;
      return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용하여 만들 수 있는 가장 큰 수와 가장 작은 수의 차를 구하세요. 단, 0은 맨 앞에 놓을 수 없습니다.`, answer, `가장 큰 수는 ${largest.toLocaleString()}, 가장 작은 수는 ${smallest.toLocaleString()}이므로 차는 ${answer.toLocaleString()}입니다.`);
    },
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
    multiAngle({ rng, level, variant = 0 }) {
      const rayCount = int(rng, 6 + level, 7 + level);
      if (variant % 3 === 0) {
        const answer = rayCount * (rayCount - 1) / 2;
        return result(`한 점에서 뻗은 ${rayCount}개의 반직선 중 두 개를 골라 만들 수 있는 180°보다 작은 각은 모두 몇 개인지 구하세요.${rayFanSvg(rayCount)}`, answer, `각은 서로 다른 반직선 2개를 고르면 하나씩 정해집니다. 따라서 ${rayCount} × ${rayCount - 1} ÷ 2 = ${answer}개입니다.`);
      }
      if (variant % 3 === 1) {
        const step = 144 / (rayCount - 1);
        let acute = 0;
        let obtuse = 0;
        for (let first = 0; first < rayCount; first += 1) {
          for (let second = first + 1; second < rayCount; second += 1) {
            const angle = (second - first) * step;
            if (angle < 90) acute += 1;
            if (angle > 90 && angle < 180) obtuse += 1;
          }
        }
        return result(`그림의 반직선은 같은 간격으로 놓여 있습니다. 만들 수 있는 예각과 둔각은 모두 몇 개인지 구하세요.${rayFanSvg(rayCount)}`, acute + obtuse, `두 반직선 사이의 간격 수를 차례로 확인하면 예각은 ${acute}개, 둔각은 ${obtuse}개이므로 모두 ${acute + obtuse}개입니다.`);
      }
      const before = rayCount * (rayCount - 1) / 2;
      const after = (rayCount + 1) * rayCount / 2;
      return result(`한 점에서 뻗은 ${rayCount}개의 반직선 사이에 반직선 1개를 더 그었습니다. 180°보다 작은 각은 처음보다 몇 개 늘어나는지 구하세요.${rayFanSvg(rayCount + 1)}`, after - before, `처음에는 ${before}개, 한 개를 더 그린 뒤에는 ${after}개이므로 ${after - before}개 늘어납니다.`);
    },
    angleCalculation({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const a = int(rng, 2, 5 + level) * 10;
        const b = int(rng, 2, 5 + level) * 10;
        const answer = (180 - a - b) / 2;
        if (answer <= 0 || !Number.isInteger(answer)) return generators.angleCalculation({ rng, level, variant: variant + 3 });
        return result(`한 직선 위의 네 각 중 가운데 두 각의 크기는 서로 같습니다. □의 각도를 구하세요.${rayFanSvg(5, [`${a}°`, "□", "□", `${b}°`], 180)}`, answer, `직선 위의 각의 합은 180°이므로 가운데 두 각의 합은 180 - ${a} - ${b} = ${answer * 2}°입니다. 두 각이 같으므로 □는 ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const a = int(rng, 4, 10) * 5;
        const b = int(rng, 5, 12) * 5;
        const c = int(rng, 6, 15) * 5;
        const answer = 360 - a - b - c;
        if (answer < 20) return generators.angleCalculation({ rng, level, variant: variant + 3 });
        return result(`한 점 둘레의 네 각을 나타낸 그림입니다. □의 각도를 구하세요.${angleWheelSvg([`${a}°`, `${b}°`, `${c}°`, "□"])}`, answer, `한 점 둘레의 각의 합은 360°이므로 360 - ${a} - ${b} - ${c} = ${answer}°입니다.`);
      }
      const whole = int(rng, 11, 16) * 10;
      const part = int(rng, 3, Math.floor(whole / 10) - 3) * 10;
      const answer = whole - part;
      return result(`맞꼭지각의 크기가 ${whole}°이고, 그 맞은편 각을 두 각으로 나누었더니 한 각이 ${part}°가 되었습니다. 나머지 각 □의 크기를 구하세요.${rayFanSvg(4, [`${part}°`, "□", `${180 - whole}°`], 180)}`, answer, `맞꼭지각의 크기는 서로 같으므로 나뉜 두 각의 합은 ${whole}°입니다. 따라서 □는 ${whole} - ${part} = ${answer}°입니다.`);
    },
    angle({ rng, level }) {
      const total = pick(rng, level > 1 ? [180, 360] : [90, 180]);
      const a = int(rng, 2, Math.floor(total / 10) - 2) * 5;
      const b = int(rng, 2, Math.floor((total - a) / 10) - 1) * 5;
      const answer = total - a - b;
      return result(`한 점 둘레 또는 한 직선 위의 각을 나누어 잰 값입니다. □의 각도를 구하세요.<div class="equation">${a}° + ${b}° + □ = ${total}°</div>`, answer, `${total} - ${a} - ${b} = ${answer}이므로 □는 ${answer}°입니다.`);
    },
    polygonInterior({ rng, level, variant = 0 }) {
      const sides = int(rng, 4 + Math.min(level, 1), 5 + level);
      const total = (sides - 2) * 180;
      if (variant % 3 === 0) {
        const angles = splitTotal(rng, sides, total, 65, 155);
        const unknown = int(rng, 0, sides - 1);
        const answer = angles[unknown];
        const labels = angles.map((value, index) => index === unknown ? "□" : `${value}°`);
        return result(`${sides}각형의 내각을 나타낸 그림입니다. □의 각도를 구하세요.${polygonSvg(sides, labels)}`, answer, `${sides}각형의 내각의 합은 (${sides} - 2) × 180 = ${total}°입니다. 주어진 각의 합을 빼면 □는 ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const knownCount = sides - 2;
        const minimum = Math.max(20, Math.ceil((total - 155 * knownCount) / 10) * 5);
        const maximum = Math.min(155, Math.floor((total - 65 * knownCount) / 10) * 5);
        const answer = int(rng, minimum / 5, maximum / 5) * 5;
        const known = splitTotal(rng, sides - 2, total - answer * 2, 65, 155);
        const labels = [...known, "□", "□"];
        return result(`${sides}각형에서 □로 표시한 두 내각의 크기는 같습니다. □ 한 곳의 각도를 구하세요.${polygonSvg(sides, labels)}`, answer, `내각의 합 ${total}°에서 알려진 각의 합 ${known.reduce((sum, value) => sum + value, 0)}°를 빼면 두 □의 합은 ${answer * 2}°입니다. 따라서 한 각은 ${answer}°입니다.`);
      }
      const angles = splitTotal(rng, sides, total, 65, 155);
      const first = int(rng, 0, sides - 2);
      const second = first + 1;
      const answer = angles[first] + angles[second];
      const labels = angles.map((value, index) => index === first ? "㉠" : index === second ? "㉡" : `${value}°`);
      return result(`${sides}각형에서 ㉠과 ㉡의 각도의 합을 구하세요.${polygonSvg(sides, labels)}`, answer, `내각의 합 ${total}°에서 나머지 내각의 합 ${total - answer}°를 빼면 ㉠ + ㉡ = ${answer}°입니다.`);
    },
    polygonExterior({ rng, level, variant = 0 }) {
      if (variant % 3 === 2) {
        const angles = splitTotal(rng, 5, 180, 20, 55);
        const unknown = int(rng, 0, 4);
        const answer = angles[unknown];
        const labels = angles.map((value, index) => index === unknown ? "□" : `${value}°`);
        return result(`오각별의 다섯 뾰족한 각을 나타낸 그림입니다. □의 각도를 구하세요.${polygonSvg(5, labels, true)}`, answer, `오각별의 다섯 뾰족한 각의 합은 180°입니다. 180°에서 주어진 네 각의 합을 빼면 □는 ${answer}°입니다.`);
      }
      const sides = int(rng, 5, 6 + level);
      if (variant % 3 === 0) {
        const angles = splitTotal(rng, sides, 360, 30, 100);
        const unknown = int(rng, 0, sides - 1);
        const answer = angles[unknown];
        const labels = angles.map((value, index) => index === unknown ? "□" : `${value}°`);
        return result(`${sides}각형의 한 꼭짓점에 하나씩 표시한 외각입니다. □의 각도를 구하세요.${polygonSvg(sides, labels)}`, answer, `다각형의 외각의 합은 360°이므로 주어진 외각의 합을 빼면 □는 ${answer}°입니다.`);
      }
      const answer = int(rng, 6, 11) * 5;
      const known = splitTotal(rng, sides - 2, 360 - answer * 2, 30, 100);
      return result(`${sides}각형에서 □로 표시한 두 외각의 크기는 같습니다. □ 한 곳의 각도를 구하세요.${polygonSvg(sides, [...known, "□", "□"])}`, answer, `외각의 합 360°에서 알려진 외각의 합 ${known.reduce((sum, value) => sum + value, 0)}°를 빼고 2로 나누면 ${answer}°입니다.`);
    },
    interiorExteriorApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const answer = int(rng, 3 + level, 8 + level) * 5;
        return result(`종이를 점선을 따라 접었더니 원래 선과 접힌 선이 이루는 각이 ${answer * 2}°가 되었습니다. 접은 선과 점선이 이루는 각 □를 구하세요.${foldSvg(answer)}`, answer, `접기 전후의 선은 접는 선을 기준으로 대칭이므로 두 작은 각의 크기는 같습니다. ${answer * 2} ÷ 2 = ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const answer = int(rng, 5, 13 + level) * 5;
        return result(`정사각형을 한 꼭짓점을 중심으로 ${answer}°만큼 회전시켰습니다. 회전 전후의 서로 대응하는 두 변이 이루는 작은 각의 크기를 구하세요.${rotatedSquareSvg(answer)}`, answer, `도형의 모든 선분은 회전한 각도만큼 방향이 바뀌므로 대응하는 두 변이 이루는 작은 각은 ${answer}°입니다.`);
      }
      const sides = pick(rng, [[4, 5, 6], [5, 6, 8, 9], [6, 8, 9, 10, 12]][level]);
      const exterior = 360 / sides;
      const interior = 180 - exterior;
      return result(`모든 내각의 크기가 같은 정${sides}각형의 한 외각은 ${exterior}°입니다. 이 다각형의 한 내각의 크기를 구하세요.${polygonSvg(sides, Array(sides).fill(""))}`, interior, `한 꼭짓점의 내각과 외각의 합은 180°이므로 180 - ${exterior} = ${interior}°입니다.`);
    },
    clockAngle({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const hour = int(rng, 1, 11);
        const minute = pick(rng, [10, 16, 20, 24, 30, 40, 48, 50]);
        const difference = Math.abs(hour * 30 + minute * 0.5 - minute * 6);
        const answer = decimal(Math.min(difference, 360 - difference), 1);
        return result(`시계가 ${hour}시 ${minute}분을 가리킬 때 시침과 분침이 이루는 작은 쪽 각의 크기를 구하세요.${clockSvg(hour, minute)}`, answer, `시침은 12에서 ${hour * 30 + minute * 0.5}°, 분침은 12에서 ${minute * 6}°만큼 움직였습니다. 두 값의 차에서 작은 쪽 각을 택하면 ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const minutes = int(rng, 12 + level * 5, 32 + level * 8);
        const moved = minutes * 6;
        return result(`운동을 하는 동안 분침이 ${moved}° 움직였습니다. 운동한 시간은 몇 분인지 구하세요.${clockSvg(12, minutes % 60)}`, minutes, `분침은 1분에 6° 움직이므로 ${moved} ÷ 6 = ${minutes}분입니다.`);
      }
      const startHour = int(rng, 1, 8);
      const startMinute = pick(rng, [0, 10, 20, 30, 40]);
      const duration = int(rng, 5 + level * 3, 12 + level * 4) * 10;
      const endTotal = startHour * 60 + startMinute + duration;
      const endHour = Math.floor(endTotal / 60) % 12;
      const endMinute = endTotal % 60;
      const minuteMove = duration * 6;
      const hourMove = duration * 0.5;
      const answer = decimal(minuteMove - hourMove, 1);
      return result(`${startHour}시 ${String(startMinute).padStart(2, "0")}분부터 ${endHour || 12}시 ${String(endMinute).padStart(2, "0")}분까지 분침이 움직인 각도는 시침이 움직인 각도보다 몇 도 더 큰지 구하세요.<div class="clock-pair">${clockSvg(startHour, startMinute)}${clockSvg(endHour || 12, endMinute)}</div>`, answer, `${duration}분 동안 분침은 ${minuteMove}°, 시침은 ${hourMove}° 움직입니다. 차는 ${minuteMove} - ${hourMove} = ${answer}°입니다.`);
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
    [/^큰 수 알아보기$/, "largeNumberPlaceValue"],
    [/^큰 수의 크기 비교$/, "largeNumberCompare"],
    [/^큰 수의 규칙성과 뛰어 세기$/, "largeNumberSkipPattern"],
    [/^큰 수의 활용$/, "largeNumberApplication"],
    [/^조건에 맞는 수 찾기$/, "conditionedNumber"],
    [/^수 카드로 수 만들기$/, "digitCardNumber"],
    [/^여러 각도$/, "multiAngle"],
    [/^각도의 계산$/, "angleCalculation"],
    [/^다각형의 내각의 합$/, "polygonInterior"],
    [/^다각형의 외각의 성질$/, "polygonExterior"],
    [/^내각과 외각의 성질의 활용$/, "interiorExteriorApplication"],
    [/^시침과 분침 사이의 각도$/, "clockAngle"],
    [/일렬로 나열한 수|배열된 수들의 합/, "numberPattern"],
    [/^평행선 사이의 각도/, "angle"],
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

  function generate(type, _levelRank, difficultyOffset, seed, variant = 0) {
    const key = generatorKey(type.name);
    if (!key) return null;
    const level = Math.max(0, Math.min(2, 1 + difficultyOffset));
    return { ...generators[key]({ rng: mulberry32(seed), level, variant }), generator: key };
  }

  window.HSE_GENERATORS = { generatorKey, generate, names: Object.keys(generators) };
})();
