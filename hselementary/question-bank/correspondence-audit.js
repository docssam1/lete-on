"use strict";

// Regression checks for 5-1 unit 3 answers. Each rule is recomputed from the rendered prompt.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = [
  "규칙과 대응", "대응표와 대응 관계", "규칙과 대응의 활용 ①", "규칙과 대응의 활용 ②"
].map((name, index) => ({ id: `5-1-u3-t${index + 1}`, name, semesterId: "5-1", unitId: "5-1-u3", unitName: "규칙과 대응" }));

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const textOnly = text => text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const number = text => Number(text.replace(/,/g, ""));
const values = text => text.trim().split(/\s+/).filter(Boolean).map(number);

function verify(generated, type, context) {
  const prompt = textOnly(generated.prompt);
  const answer = String(generated.answer);
  check(generated.generator && generated.answer !== "" && generated.solution, context + ": 결과가 비어 있습니다.");
  check(!/NaN|undefined|Infinity/.test(generated.prompt + answer + generated.solution), context + ": 계산값이 깨졌습니다.");

  if (type.id === "5-1-u3-t1") {
    if (prompt.includes("규칙 상자")) {
      const pairs = [...prompt.matchAll(/(\d+) → (\d+)/g)].map(match => [Number(match[1]), Number(match[2])]);
      const target = Number(prompt.match(/규칙을 찾아 (\d+)을/)?.[1]);
      const multiplier = (pairs[1][1] - pairs[0][1]) / (pairs[1][0] - pairs[0][0]);
      const addend = pairs[0][1] - multiplier * pairs[0][0];
      check(Number(answer) === multiplier * target + addend, context + ": 규칙 상자 대응값이 틀렸습니다.");
      return;
    }
    if (prompt.includes("암호문")) {
      const first = prompt.match(/A → ([A-Z])/)[1];
      const shift = first.charCodeAt(0) - 65;
      const cipher = prompt.match(/암호문 ([A-Z]+)/)[1];
      const decoded = [...cipher].map(letter => String.fromCharCode((letter.charCodeAt(0) - 65 - shift + 26) % 26 + 65)).join("");
      check(answer === decoded, context + ": 암호 해독값이 틀렸습니다.");
      return;
    }
    const position = Number(prompt.match(/(\d+)번째 도형/)[1]);
    const sides = [3, 4, 4, 5];
    const before = Array.from({ length: position - 1 }, (_, index) => sides[index % sides.length]).reduce((sum, value) => sum + value, 0);
    const count = sides[(position - 1) % sides.length];
    const expected = count * ((before + 1) + (before + count)) / 2;
    check(Number(answer) === expected, context + ": 도형 꼭짓점 수의 합이 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u3-t2") {
    if (prompt.includes("▲와 ■")) {
      const [, inputText, outputText] = prompt.match(/▲ ([\d ]+) ■ ([\d ]+) □/) || [];
      const inputs = values(inputText);
      const outputs = values(outputText);
      const multiplier = (outputs[1] - outputs[0]) / (inputs[1] - inputs[0]);
      const addend = outputs[0] - multiplier * inputs[0];
      check(Number(answer) === multiplier * inputs.at(-1) + addend, context + ": 대응표 값이 틀렸습니다.");
      return;
    }
    const [, inputText, middleText, outputText] = prompt.match(/▲ ([\d ]+) ● ([\d ]+) □ ★ ([\d ]+) □/) || [];
    check(inputText && middleText && outputText, context + ": 연속 대응표를 읽지 못했습니다.");
    const inputs = values(inputText);
    const middle = values(middleText);
    const outputs = values(outputText);
    const firstMultiplier = (middle[1] - middle[0]) / (inputs[1] - inputs[0]);
    const firstAddend = middle[0] - firstMultiplier * inputs[0];
    const secondMultiplier = (outputs[1] - outputs[0]) / (middle[1] - middle[0]);
    const secondAddend = outputs[0] - secondMultiplier * middle[0];
    check(Number(answer) === secondMultiplier * (firstMultiplier * inputs.at(-1) + firstAddend) + secondAddend, context + ": 연속 대응표 값이 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u3-t3") {
    if (prompt.includes("직선들을")) {
      const count = Number(prompt.match(/직선을 (\d+)개/)[1]);
      check(Number(answer) === count * (count + 1) / 2 + 1, context + ": 직선 영역 개수가 틀렸습니다.");
    } else {
      const stage = Number(prompt.match(/(\d+)번째 단계/)[1]);
      check(Number(answer) === stage * (stage + 1) / 2, context + ": 계단 조각 수가 틀렸습니다.");
    }
    return;
  }

  if (type.id === "5-1-u3-t4") {
    if (prompt.includes("가로등")) {
      const [, spacing, first, opposite] = prompt.match(/(\d+)m 간격.*? (\d+)번째 가로등과 (\d+)번째/) || [];
      check(Number(answer) === 2 * (Number(opposite) - Number(first)) * Number(spacing), context + ": 원형 배치 둘레가 틀렸습니다.");
      return;
    }
    if (prompt.includes("통화 요금")) {
      const [, included, fee, rate, usage] = prompt.match(/처음 (\d+)분까지 ([\d,]+)원.*?1분마다 (\d+)원.*?시간이 (\d+)분/) || [];
      check(Number(answer) === number(fee) + (Number(usage) - Number(included)) * Number(rate), context + ": 통화 요금이 틀렸습니다.");
      return;
    }
    const [, fast, slow, remaining] = prompt.match(/한 시간에 (\d+)km, 동생은 한 시간에 (\d+)km.*?동생은 (\d+)km/) || [];
    const hours = Number(remaining) / (Number(fast) - Number(slow));
    check(Number(answer) === Number(fast) * hours, context + ": 속력 대응 거리가 틀렸습니다.");
  }
}

let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, seed % 9);
      verify(generated, type, `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`);
      generatedCount += 1;
    }
  }
}

console.log(`규칙과 대응 감사 통과: 4유형, ${generatedCount}개 생성`);
