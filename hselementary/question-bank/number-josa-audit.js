"use strict";
// 2026-11-28: 숫자 뒤 조사 보정(number-josa.js) 감사.
// - 숫자 읽기 끝소리(0·1·3·6·7·8 받침, 1·7·8 ㄹ 받침), 분수는 분자 끝 숫자, 이었/였을 확인한다.
// - 낱말 일부("2가지", "1이다", "3이상")·영문 뒤 숫자·분모 자리는 바꾸지 않는다.
// - 얼린 문항 객체는 원본을 두고 사본에 바꾼다(바뀐 것이 없으면 원본 그대로).
// - index.html에서 app.js 바로 앞(모든 생성기 플러그인 뒤)에 실린다.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const josa = require("./number-josa.js");

const cases = [
  ["6를 다섯 번", "6을 다섯 번"], ["4이 남는", "4가 남는"], ["3와 7 사이", "3과 7 사이"], ["10로 나누면", "10으로 나누면"],
  ["1으로 나누면", "1로 나누면"], ["7으로", "7로"], ["8으로", "8로"], ["6로", "6으로"], ["2은 짝수", "2는 짝수"], ["5과 6", "5와 6"],
  ["64.30를 반올림", "64.30을 반올림"], ["5.04을 계산", "5.04를 계산"], ["2,461를 버림", "2,461을 버림"], ["129은 어느", "129는 어느"],
  ["2/3를 이겼", "2/3를 이겼"], ["3/4을 이겼", "3/4을 이겼"], ["1/24이 남았", "1/24이 남았"], ["17/18를 세", "17/18을 세"], ["1 3/4을", "1 3/4을"],
  ["<span class=\"math-fraction\" role=\"img\" aria-label=\"4분의 3\"><span>3</span><span>4</span></span>를 이겼", "<span class=\"math-fraction\" role=\"img\" aria-label=\"4분의 3\"><span>3</span><span>4</span></span>을 이겼"],
  ["<span class=\"math-fraction\" role=\"img\" aria-label=\"7분의 2\"><span>2</span><span>7</span></span>을", "<span class=\"math-fraction\" role=\"img\" aria-label=\"7분의 2\"><span>2</span><span>7</span></span>를"],
  ["<span>7</span>를", "<span>7</span>을"], ["62이었습니다", "62였습니다"], ["30였습니다", "30이었습니다"],
  ["2가지", "2가지"], ["1이다", "1이다"], ["3이상", "3이상"], ["A1을", "A1을"], ["x2와", "x2와"], ["㉠을", "㉠을"], ["답은 12개를", "답은 12개를"],
];
for (const [input, expected] of cases) assert.equal(josa.fixText(input), expected, input);

const frozen = Object.freeze({ prompt: "6를 더하세요.", answer: "3", extra: 1 });
const fixed = josa.fixQuestion(frozen);
assert.notEqual(fixed, frozen);
assert.equal(frozen.prompt, "6를 더하세요.");
assert.equal(fixed.prompt, "6을 더하세요.");
assert.equal(fixed.extra, 1);
assert.ok(Object.isFrozen(fixed));
const clean = { prompt: "답은 5입니다." };
assert.equal(josa.fixQuestion(clean), clean);

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script\s+defer\s+src="\.\/([^"?]+)/g)].map(match => match[1]);
assert.equal(scripts.at(-1), "app.js");
assert.equal(scripts.at(-2), "number-josa.js", "number-josa.js loads right before app.js, after every generator plugin");
console.log(`PASS: number josa — ${cases.length} cases, frozen question copy, load order`);
